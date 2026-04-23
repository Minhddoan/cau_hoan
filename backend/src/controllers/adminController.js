const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// ─── USERS ────────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.email, u.full_name, u.is_active, u.last_login, u.avatar_url, u.created_at,
              r.id as role_id, r.name as role_name, r.display_name as role_display
       FROM users u LEFT JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, full_name, role_id, is_active } = req.body;
    if (!email || !password || !role_id) {
      return res.status(400).json({ success: false, message: 'Thiếu email, password hoặc role_id' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải ít nhất 8 ký tự' });
    }
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING id, email, full_name, role_id, is_active, created_at`,
      [email.toLowerCase(), hash, full_name, role_id, is_active !== false]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'user', rows[0].id, rows[0].email, null, { email: rows[0].email, role_id }, req);
    res.status(201).json({ success: true, data: rows[0], message: 'Tạo tài khoản thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, role_id, is_active, email } = req.body;

    // Không cho phép sửa chính mình bằng route này
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Dùng /auth/change-password để sửa thông tin cá nhân' });
    }

    const { rows: old } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    const { rows } = await pool.query(
      `UPDATE users SET full_name=COALESCE($1,full_name), role_id=COALESCE($2,role_id), is_active=COALESCE($3,is_active), email=COALESCE($4,email), updated_at=NOW()
       WHERE id=$5 RETURNING id, email, full_name, role_id, is_active`,
      [full_name, role_id, is_active, email?.toLowerCase(), id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'user', id, rows[0].email, old[0], rows[0], req);
    res.json({ success: true, data: rows[0], message: 'Cập nhật thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Không thể xóa chính mình' });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    // Deactivate thay vì xóa để giữ audit log
    await pool.query('UPDATE users SET is_active=FALSE, updated_at=NOW() WHERE id=$1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'user', id, rows[0].email, rows[0], null, req);
    res.json({ success: true, message: 'Vô hiệu hóa tài khoản thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;
    if (!new_password || new_password.length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải ít nhất 8 ký tự' });
    }
    const hash = await bcrypt.hash(new_password, 12);
    await pool.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, id]);
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'user', id, 'Password reset', null, null, req);
    res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── ROLES ────────────────────────────────────────────────────────────────────
const getRoles = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id, action, resource_type } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (user_id) { conditions.push(`user_id = $${idx++}`); params.push(user_id); }
    if (action) { conditions.push(`action = $${idx++}`); params.push(action); }
    if (resource_type) { conditions.push(`resource_type = $${idx++}`); params.push(resource_type); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM audit_logs ${where}`, params);
    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM site_settings ORDER BY group_name, key');
    // Group by group_name
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.group_name]) grouped[row.group_name] = {};
      grouped[row.group_name][row.key] = row.value;
    });
    res.json({ success: true, data: rows, grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    const updatedKeys = [];

    for (const [key, value] of Object.entries(updates)) {
      await pool.query(
        `UPDATE site_settings SET value=$1, updated_by=$2, updated_at=NOW() WHERE key=$3`,
        [value, req.user.id, key]
      );
      updatedKeys.push(key);
    }

    await logAudit(req.user.id, req.user.email, 'UPDATE', 'settings', null, updatedKeys.join(','), null, updates, req);
    res.json({ success: true, message: 'Đã cập nhật cài đặt', updated: updatedKeys });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const [
      products, articles, faqs, bookings, bookingsPending,
      bookingsToday, bookingsThisMonth, jobs, newApplications, users,
      recentAuditLogs, bookingsByStatus, bookingsByMonth
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM products WHERE is_active=TRUE'),
      pool.query('SELECT COUNT(*) FROM articles WHERE is_published=TRUE'),
      pool.query('SELECT COUNT(*) FROM faqs WHERE is_active=TRUE'),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status='pending'"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE DATE(created_at) = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"),
      pool.query('SELECT COUNT(*) FROM jobs WHERE is_active=TRUE'),
      pool.query("SELECT COUNT(*) FROM job_applications WHERE status='new'"),
      pool.query('SELECT COUNT(*) FROM users WHERE is_active=TRUE'),
      pool.query(`
        SELECT al.*, u.full_name FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 10
      `),
      pool.query(`
        SELECT status, COUNT(*) as count FROM bookings GROUP BY status ORDER BY count DESC
      `),
      pool.query(`
        SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'MM/YYYY') as month,
               COUNT(*) as count
        FROM bookings WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at)
      `),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          products:         parseInt(products.rows[0].count),
          articles:         parseInt(articles.rows[0].count),
          faqs:             parseInt(faqs.rows[0].count),
          bookings:         parseInt(bookings.rows[0].count),
          bookingsPending:  parseInt(bookingsPending.rows[0].count),
          bookingsToday:    parseInt(bookingsToday.rows[0].count),
          bookingsThisMonth:parseInt(bookingsThisMonth.rows[0].count),
          jobs:             parseInt(jobs.rows[0].count),
          newApplications:  parseInt(newApplications.rows[0].count),
          users:            parseInt(users.rows[0].count),
        },
        charts: {
          bookingsByStatus: bookingsByStatus.rows,
          bookingsByMonth:  bookingsByMonth.rows,
        },
        recentActivity: recentAuditLogs.rows,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getUsers, createUser, updateUser, deleteUser, resetUserPassword,
  getRoles,
  getAuditLogs,
  getSettings, updateSettings,
  getDashboard,
};
