#!/usr/bin/env node
/**
 * 🔐 Secure Admin Account Seeder
 * Creates the first admin account with hashed password
 * Usage: node scripts/seed-admin.js
 * Or: npm run seed:admin
 */

const { hashPassword } = require('../security/auth');
const { pool, usePg, getDatabase } = require('../database');
const readline = require('readline');
require('dotenv').config();

// ANSI color codes for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function for colored console output
function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Prompt user for input with validation
function promptUser(question, validator = null) {
  return new Promise((resolve) => {
    const askQuestion = () => {
      rl.question(question, (answer) => {
        if (validator && !validator(answer)) {
          askQuestion();
        } else {
          resolve(answer.trim());
        }
      });
    };
    askQuestion();
  });
}

// Validate username (alphanumeric, underscore, hyphen only)
function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_-]+$/;
  if (!username || username.length < 3) {
    log('red', '❌ Username must be at least 3 characters long');
    return false;
  }
  if (!regex.test(username)) {
    log('red', '❌ Username can only contain letters, numbers, underscores, and hyphens');
    return false;
  }
  return true;
}

// Validate password strength
function validatePassword(password) {
  if (!password || password.length < 8) {
    log('red', '❌ Password must be at least 8 characters long');
    return false;
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    log('red', '❌ Password must contain at least one lowercase letter, one uppercase letter, and one number');
    return false;
  }
  if (/tasnim|admin|password|123456/.test(password.toLowerCase())) {
    log('red', '❌ Password cannot contain common words like "admin", "password", "tasnim", or "123456"');
    return false;
  }
  return true;
}

// Check if admin already exists
async function checkExistingAdmin() {
  try {
    if (usePg) {
      const client = await pool.connect();
      const result = await client.query('SELECT COUNT(*) as count FROM admins');
      client.release();
      return parseInt(result.rows[0].count) > 0;
    } else {
      const db = getDatabase();
      const result = db.exec('SELECT COUNT(*) as count FROM admins');
      return result.length > 0 && result[0].values[0][0] > 0;
    }
  } catch (error) {
    if (error.message.includes('does not exist') || error.message.includes('no such table')) {
      // Table doesn't exist yet, that's okay
      return false;
    }
    throw error;
  }
}

// Insert admin into database
async function insertAdmin(username, hashedPassword) {
  const now = new Date().toISOString();
  
  try {
    if (usePg) {
      const client = await pool.connect();
      await client.query(
        'INSERT INTO admins (username, password_hash, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
        [username, hashedPassword, 'admin', now, now]
      );
      client.release();
    } else {
      const db = getDatabase();
      db.run(
        'INSERT INTO admins (username, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, 'admin', now, now]
      );
      
      // Save SQLite database
      const { saveSQLite } = require('../database');
      saveSQLite();
    }
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed') || error.code === '23505') {
      throw new Error(`Admin with username "${username}" already exists`);
    }
    throw error;
  }
}

// Main seeding function
async function seedAdmin() {
  try {
    console.log(`
${colors.cyan}${colors.bold}╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║           🔐 TASNIM DAIRY FARM - ADMIN ACCOUNT SEEDER         ║
║                                                               ║
║     This script creates a secure admin account with          ║
║     bcrypt-hashed password to replace hardcoded credentials   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`);

    // Check if admin already exists
    const adminExists = await checkExistingAdmin();
    if (adminExists) {
      log('yellow', '⚠️  Admin account(s) already exist in the database.');
      const overwrite = await promptUser('Do you want to create another admin? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        log('blue', 'ℹ️  Seeding cancelled. Existing admin accounts are preserved.');
        rl.close();
        return;
      }
    }

    // Get credentials from environment or prompt
    let username = process.env.ADMIN_USERNAME;
    let password = process.env.ADMIN_PASSWORD;

    if (!username) {
      log('blue', 'ℹ️  ADMIN_USERNAME not found in environment variables.');
      username = await promptUser('Enter admin username (3+ characters, alphanumeric): ', validateUsername);
    } else {
      if (!validateUsername(username)) {
        log('red', `❌ Invalid username in ADMIN_USERNAME: ${username}`);
        username = await promptUser('Enter a valid admin username: ', validateUsername);
      }
    }

    if (!password) {
      log('blue', 'ℹ️  ADMIN_PASSWORD not found in environment variables.');
      log('yellow', '⚠️  Password requirements: 8+ chars, uppercase, lowercase, number, no common words');
      password = await promptUser('Enter admin password: ', validatePassword);
    } else {
      if (!validatePassword(password)) {
        log('red', '❌ Invalid password in ADMIN_PASSWORD (too weak or contains common words)');
        password = await promptUser('Enter a secure admin password: ', validatePassword);
      }
    }

    log('cyan', '🔐 Hashing password with bcrypt (salt rounds: 12)...');
    const hashedPassword = await hashPassword(password);

    log('cyan', '💾 Inserting admin into database...');
    await insertAdmin(username, hashedPassword);

    console.log(`
${colors.green}${colors.bold}╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                    ✅ ADMIN ACCOUNT CREATED                    ║
║                                                               ║
║   Username: ${username.padEnd(47)}║
║   Password: [SECURELY HASHED WITH BCRYPT]                    ║
║   Role:     admin                                            ║
║                                                               ║
║                     🔒 SECURITY REMINDERS                     ║
║                                                               ║
║   1. The old hardcoded password "tasnim@2026" is now        ║
║      completely disabled and will not work                   ║
║                                                               ║
║   2. Clear your shell history to remove the password:       ║
║      history -c (bash) or Clear-History (PowerShell)        ║
║                                                               ║
║   3. Unset environment variables if used:                    ║
║      unset ADMIN_PASSWORD (bash) or                         ║
║      $env:ADMIN_PASSWORD = $null (PowerShell)               ║
║                                                               ║
║   4. Test the new credentials immediately                    ║
║                                                               ║
║   5. Consider making the GitHub repo private temporarily     ║
║      while you clean up the git history                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`);

    rl.close();

  } catch (error) {
    log('red', `❌ ERROR: ${error.message}`);
    console.error('\nFull error details:', error);
    rl.close();
    process.exit(1);
  }
}

// Handle script interruption
process.on('SIGINT', () => {
  log('yellow', '\n⚠️  Seeding cancelled by user');
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('yellow', '\n⚠️  Seeding terminated');
  rl.close();
  process.exit(0);
});

// Run the seeder
if (require.main === module) {
  seedAdmin().catch((error) => {
    log('red', `❌ FATAL ERROR: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedAdmin };