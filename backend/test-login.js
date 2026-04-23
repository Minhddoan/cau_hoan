require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testLogin() {
  try {
    const email = 'admin@songvu.com';
    const password = 'Admin@123456';
    const { rows } = await pool.query(
      `SELECT u.*, r.name as role_name, r.display_name as role_display
       FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = $1`,
      [email]
    );
    console.log('Found user:', rows[0] ? rows[0].email : 'NOT FOUND');
    if (rows[0]) {
      console.log('is_active:', rows[0].is_active);
      console.log('password_hash exists:', !!rows[0].password_hash);
      const valid = await bcrypt.compare(password, rows[0].password_hash);
      console.log('Password valid:', valid);
      if (valid) {
        const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log('Token OK:', token.substring(0, 20) + '...');
        
        // Simulate audit log
        const auditRes = await pool.query(
          `INSERT INTO audit_logs (user_id, user_email, action, resource_type, resource_id, resource_name, ip_address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
          [rows[0].id, rows[0].email, 'LOGIN', 'user', rows[0].id, rows[0].full_name, '127.0.0.1']
        );
        console.log('Audit log OK, id:', auditRes.rows[0].id);
        
        console.log('\n✅ Login flow hoạt động bình thường!');
      }
    }
  } catch (e) {
    console.error('ERROR:', e.message);
    console.error(e.stack);
  } finally {
    await pool.end();
  }
}
testLogin();
