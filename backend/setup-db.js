const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');
require('dotenv').config();

async function seed() {
  console.log('🌱 Starting database setup...\n');

  try {
    // 1. Run schema.sql
    console.log('📦 Creating tables...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database/schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('✅ Tables created\n');

    // 2. Create super_admin user
    console.log('👤 Creating super_admin user...');
    const { rows: roles } = await pool.query("SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1");
    if (!roles[0]) {
      console.error('❌ super_admin role not found. Schema may not have been seeded correctly.');
      process.exit(1);
    }

    const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@songvu.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const hash = await bcrypt.hash(adminPassword, 12);

    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role_id, is_active, created_at, updated_at)
       VALUES ($1, $2, 'Super Administrator', $3, TRUE, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, role_id = $3, updated_at = NOW()`,
      [adminEmail, hash, roles[0].id]
    );
    console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}\n`);

    // 3. Run seed.sql (optional data)
    const seedPath = path.join(__dirname, 'database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌿 Inserting sample data...');
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seedSQL);
      console.log('✅ Sample data inserted\n');
    }

    console.log('═══════════════════════════════════════');
    console.log('🎉 Database setup complete!');
    console.log(`📧 Admin email:    ${adminEmail}`);
    console.log(`🔑 Admin password: ${adminPassword}`);
    console.log('═══════════════════════════════════════\n');

  } catch (err) {
    console.error('❌ Setup error:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
  } finally {
    await pool.end();
  }
}

seed();
