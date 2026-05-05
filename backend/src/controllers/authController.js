const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, full_name, birthday, phone, address } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải từ 6 ký tự trở lên' });
    }

    // 1. Kiểm tra email trùng lặp
    const { rows: existingUser } = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email này đã được đăng ký' });
    }

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Lấy role 'viewer' mặc định
    const { rows: roleRows } = await pool.query("SELECT id FROM roles WHERE name = 'viewer'");
    const roleId = roleRows[0]?.id || 4;

    // 4. Tạo người dùng mới
    const { rows: newUser } = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, birthday, phone, address, role_id, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW(), NOW()) RETURNING id, email, full_name, birthday, phone, address`,
      [email.toLowerCase(), passwordHash, full_name, birthday, phone, address, roleId]
    );

    // Audit log
    await logAudit(newUser[0].id, newUser[0].email, 'REGISTER', 'user', newUser[0].id, newUser[0].full_name, null, null, req);

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.',
      user: newUser[0]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

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
        birthday: user.birthday,
        phone: user.phone,
        address: user.address,
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
      `SELECT u.id, u.email, u.full_name, u.birthday, u.phone, u.address, u.avatar_url, u.last_login, u.created_at,
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

// PUT /api/auth/me
const updateMe = async (req, res) => {
  try {
    const { full_name, birthday, phone, address, avatar_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE users SET 
       full_name=COALESCE($1,full_name), 
       birthday=COALESCE($2,birthday), 
       phone=COALESCE($3,phone), 
       address=COALESCE($4,address),
       avatar_url=COALESCE($5,avatar_url),
       updated_at=NOW()
       WHERE id = $6 RETURNING id, email, full_name, birthday, phone, address, avatar_url`,
      [full_name, birthday, phone, address, avatar_url, req.user.id]
    );
    res.json({ success: true, user: rows[0], message: 'Cập nhật thông tin thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { register, login, getMe, updateMe, logout, changePassword };
