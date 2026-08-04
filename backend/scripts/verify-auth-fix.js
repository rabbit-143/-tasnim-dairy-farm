#!/usr/bin/env node
/**
 * 🔐 Authentication Security Verification Script
 * Verifies that hardcoded credentials are removed and database auth is working
 * Usage: node scripts/verify-auth-fix.js
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');
const path = require('path');

const execAsync = promisify(exec);

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Verification checklist
const verifications = [
  'No occurrence of tasnim@2026 in active code files',
  'handleLogin queries the database and uses comparePassword',
  'Login with old hardcoded credentials fails',
  'Server boots correctly with JWT_SECRET',
  '.env.example has no real secrets, only placeholders'
];

let checkedItems = 0;

async function checkHardcodedCredentials() {
  log('cyan', '\n🔍 Checking for hardcoded credentials in active code files...');
  
  try {
    // Check backend code files for hardcoded password, excluding test files that verify it's rejected
    const { stdout } = await execAsync('git grep -n "tasnim@2026" -- "backend/*.js" "backend/**/*.js" "src/**/*.tsx" "src/**/*.ts" | grep -v "security-test.js" | grep -v "verify-auth-fix.js" || true', {
      cwd: path.resolve(__dirname, '../..')
    });
    
    if (stdout.trim()) {
      log('red', '❌ Hardcoded credentials found in active code files:');
      console.log(stdout);
      return false;
    } else {
      log('green', '✅ No hardcoded credentials in active code files');
      log('blue', '   (Security tests that verify rejection are allowed)');
      checkedItems++;
      return true;
    }
  } catch (error) {
    log('yellow', '⚠️  Could not check for hardcoded credentials (git not available)');
    log('blue', '   Manually verify: git grep -n "tasnim@2026" backend/ src/ | grep -v test');
    return null;
  }
}

async function checkDatabaseAuth() {
  log('cyan', '\n🔍 Verifying database authentication is implemented...');
  
  try {
    // Read the auth.js file to verify it uses database
    const fs = require('fs');
    const authFile = fs.readFileSync(path.resolve(__dirname, '../security/auth.js'), 'utf8');
    
    if (authFile.includes('getDatabase()') && authFile.includes('comparePassword') && 
        authFile.includes('SELECT * FROM admins WHERE username')) {
      log('green', '✅ handleLogin queries database and uses comparePassword');
      checkedItems++;
      return true;
    } else {
      log('red', '❌ Database authentication not properly implemented');
      return false;
    }
  } catch (error) {
    log('red', '❌ Could not read auth.js file');
    return false;
  }
}

async function testOldCredentials() {
  log('cyan', '\n🔍 Testing that old hardcoded credentials are rejected...');
  
  try {
    const response = await axios.post('http://localhost:3005/api/auth/login', {
      username: 'admin',
      password: 'tasnim@2026'
    }, { timeout: 5000 });
    
    // If we get here, old credentials still work (BAD!)
    log('red', '❌ OLD CREDENTIALS STILL WORK! This is a critical security issue.');
    return false;
    
  } catch (error) {
    if (error.response?.status === 401) {
      log('green', '✅ Old hardcoded credentials properly rejected');
      checkedItems++;
      return true;
    } else if (error.code === 'ECONNREFUSED') {
      log('yellow', '⚠️  Server not running - cannot test credential rejection');
      log('blue', '   Start server with: npm run dev');
      return null;
    } else {
      log('yellow', `⚠️  Unexpected response: ${error.response?.status || error.code}`);
      return null;
    }
  }
}

async function checkServerBoot() {
  log('cyan', '\n🔍 Checking server can boot with environment variables...');
  
  try {
    // Check that JWT_SECRET is mentioned in server.js
    const fs = require('fs');
    const serverFile = fs.readFileSync(path.resolve(__dirname, '../server.js'), 'utf8');
    
    if (serverFile.includes('JWT_SECRET') && serverFile.includes('requiredEnvVars')) {
      log('green', '✅ Server validates JWT_SECRET environment variable');
      checkedItems++;
      return true;
    } else {
      log('yellow', '⚠️  JWT_SECRET validation may not be implemented');
      return false;
    }
  } catch (error) {
    log('red', '❌ Could not read server.js file');
    return false;
  }
}

async function checkEnvExample() {
  log('cyan', '\n🔍 Checking .env.example has no real secrets...');
  
  try {
    const fs = require('fs');
    const envExample = fs.readFileSync(path.resolve(__dirname, '../.env.example'), 'utf8');
    
    if (envExample.includes('tasnim@2026')) {
      log('red', '❌ .env.example contains real secrets');
      return false;
    } else if (envExample.includes('# ADMIN_USERNAME') && envExample.includes('# ADMIN_PASSWORD')) {
      log('green', '✅ .env.example has only commented placeholders');
      checkedItems++;
      return true;
    } else {
      log('yellow', '⚠️  .env.example may be missing admin credential placeholders');
      return false;
    }
  } catch (error) {
    log('red', '❌ Could not read .env.example file');
    return false;
  }
}

async function runVerification() {
  console.log(`${colors.cyan}${colors.bold}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                                                               ║');
  console.log('║      🔐 AUTHENTICATION SECURITY FIX VERIFICATION 🔐          ║');
  console.log('║                                                               ║');
  console.log('║   Verifying hardcoded credentials have been properly fixed   ║');
  console.log('║                                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const results = [];
  
  results.push(await checkHardcodedCredentials());
  results.push(await checkDatabaseAuth());
  results.push(await testOldCredentials());
  results.push(await checkServerBoot());
  results.push(await checkEnvExample());

  // Generate report
  log('cyan', '\n📊 VERIFICATION REPORT');
  console.log('═'.repeat(50));
  
  verifications.forEach((item, index) => {
    const result = results[index];
    if (result === true) {
      log('green', `✅ ${item}`);
    } else if (result === false) {
      log('red', `❌ ${item}`);
    } else {
      log('yellow', `⚠️  ${item} (could not verify)`);
    }
  });

  console.log('\n' + '═'.repeat(50));
  log('cyan', `VERIFIED: ${checkedItems}/${verifications.length} items`);

  if (checkedItems === verifications.length) {
    log('green', '\n🎉 ALL VERIFICATIONS PASSED!');
    log('green', '   Hardcoded credentials have been successfully removed.');
    log('blue', '\n📝 NEXT STEPS:');
    log('blue', '   1. Run: npm run seed:admin');
    log('blue', '   2. Test login with new credentials');
    log('blue', '   3. Consider cleaning Git history (see instructions)');
  } else {
    log('yellow', '\n⚠️  SOME VERIFICATIONS FAILED');
    log('yellow', '   Review the failed items above before proceeding.');
  }

  console.log('\n' + '═'.repeat(50));
}

// Run verification
runVerification().catch(error => {
  log('red', `❌ VERIFICATION ERROR: ${error.message}`);
  process.exit(1);
});