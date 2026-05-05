const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');
require('dotenv').config();

async function runMigration() {
  console.log('🚀 Running migration...');
  try {
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'database/migration_v2.sql'), 'utf8');
    await pool.query(migrationSQL);
    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    pool.end();
  }
}

runMigration();
