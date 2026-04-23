const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── Authenticate JWT ────────────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user vẫn còn active trong DB
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.is_active, u.role_id,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [decoded.userId]
    );

    if (!rows[0] || !rows[0].is_active) {
      return res.status(401).json({ success: false, message: 'Tài khoản không hợp lệ hoặc đã bị vô hiệu hóa' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token đã hết hạn' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

// ─── Role Hierarchy ──────────────────────────────────────────────────────────
const ROLE_LEVELS = { viewer: 1, editor: 2, admin: 3, super_admin: 4 };

const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role_name;
    const userLevel = ROLE_LEVELS[userRole] || 0;

    // Nếu truyền vào array of roles (bất kỳ role nào trong list là OK)
    if (Array.isArray(requiredRoles)) {
      const maxRequired = Math.max(...requiredRoles.map(r => ROLE_LEVELS[r] || 0));
      if (userLevel >= maxRequired) return next();
    }
    // Nếu truyền string: role tối thiểu
    if (typeof requiredRoles === 'string') {
      const required = ROLE_LEVELS[requiredRoles] || 0;
      if (userLevel >= required) return next();
    }

    return res.status(403).json({
      success: false,
      message: `Bạn không có quyền thực hiện hành động này. Yêu cầu: ${requiredRoles}`
    });
  };
};

// ─── Audit Logger ────────────────────────────────────────────────────────────
const logAudit = async (userId, userEmail, action, resourceType, resourceId, resourceName, oldValues, newValues, req) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, user_email, action, resource_type, resource_id, resource_name, old_values, new_values, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        userEmail,
        action,
        resourceType,
        resourceId,
        resourceName,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues  ? JSON.stringify(newValues)  : null,
        req?.ip || null,
        req?.headers?.['user-agent'] || null,
      ]
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = { authenticate, checkRole, logAudit };
