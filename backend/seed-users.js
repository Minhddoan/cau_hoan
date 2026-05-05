const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function seedUsers() {
  console.log('👥 Đang tạo tài khoản người dùng mẫu...\n');

  const defaultPassword = '123456';
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(defaultPassword, salt);

  const users = [
    { email: 'admin@songvu.com',   name: 'Super Admin', role: 'super_admin' },
    { email: 'manager@songvu.com', name: 'Manager',     role: 'admin' },
    { email: 'staff@songvu.com',   name: 'Staff Editor', role: 'editor' },
    { email: 'guest@songvu.com',   name: 'Guest Viewer', role: 'viewer' }
  ];

  try {
    for (const user of users) {
      // Lấy role_id từ tên role
      const { rows: roles } = await pool.query('SELECT id FROM roles WHERE name = $1', [user.role]);
      
      if (roles.length > 0) {
        const roleId = roles[0].id;
        
        await pool.query(
          `INSERT INTO users (email, password_hash, full_name, role_id, is_active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, TRUE, NOW(), NOW())
           ON CONFLICT (email) DO UPDATE 
           SET password_hash = $2, full_name = $3, role_id = $4`,
          [user.email, hash, user.name, roleId]
        );
        
        console.log(`✅ Đã tạo: ${user.email} (Quyền: ${user.role})`);
      } else {
        console.log(`⚠️ Không tìm thấy quyền: ${user.role} cho ${user.email}`);
      }
    }

    console.log('\n✨ Xong! Mật khẩu mặc định cho tất cả là: 123456');

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await pool.end();
  }
}

seedUsers();
