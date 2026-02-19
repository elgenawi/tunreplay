/**
 * Create an admin user in the database.
 * Usage: node scripts/create-admin.js <email> <password> [name]
 * Or with npm: npm run create-admin -- <email> <password> [name]
 *
 * Requires .env with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const [,, email, password, name] = process.argv;

async function main() {
  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
    console.error('Example: node scripts/create-admin.js admin@example.com MySecurePass123 "Admin"');
    process.exit(1);
  }

  const emailNorm = email.trim().toLowerCase();
  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters.');
    process.exit(1);
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  for (const [k, v] of Object.entries(dbConfig)) {
    if (v === undefined || v === '') {
      console.error(`Error: Missing ${k} in .env`);
      process.exit(1);
    }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')`,
      [emailNorm, passwordHash, (name || '').trim() || null]
    );

    console.log('Admin user created successfully.');
    console.log('Email:', emailNorm);
    console.log('Role: admin');
    await connection.end();
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error('Error: A user with this email already exists.');
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

main();
