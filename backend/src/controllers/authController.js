const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    const { rows } = await pool.query(
      `SELECT u.*, r.name as role_name, r.display_name as role_display
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Cập nhật last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Audit log
    await logAudit(user.id, user.email, 'LOGIN', 'user', user.id, user.full_name, null, null, req);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role_name,
        role_display: user.role_display,
        avatar_url: user.avatar_url,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, u.last_login, u.created_at,
              r.name as role, r.display_name as role_display
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  await logAudit(req.user.id, req.user.email, 'LOGOUT', 'user', req.user.id, req.user.full_name, null, null, req);
  res.json({ success: true, message: 'Đăng xuất thành công' });
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }
    if (new_password.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải ít nhất 8 ký tự' });
    }

    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    const hash = await bcrypt.hash(new_password, 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id]);
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'user', req.user.id, 'Change password', null, null, req);

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { login, getMe, logout, changePassword };
