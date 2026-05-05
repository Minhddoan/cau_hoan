const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'phongthuy_songvu',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

async function migrate() {
  try {
    console.log('Starting database migration...');
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS booking_type VARCHAR(50) DEFAULT 'master_booking';
    `);
    
    // Update existing records if any
    await pool.query(`
      UPDATE bookings SET booking_type = 'master_booking' WHERE booking_type IS NULL;
    `);
    
    console.log('Successfully added booking_type column to bookings table.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
