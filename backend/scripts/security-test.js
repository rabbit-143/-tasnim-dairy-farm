/**
 * 🔒 Enterprise Security Testing Suite
 * Comprehensive security validation for production deployment
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3005';
const TEST_RESULTS = [];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`)
};

// Test result tracking
const addResult = (test, passed, details = '') => {
  TEST_RESULTS.push({
    test,
    passed,
    details,
    timestamp: new Date().toISOString()
  });
};

// Test security headers
const testSecurityHeaders = async () => {
  log.header('🛡️  TESTING SECURITY HEADERS');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    const headers = response.headers;
    
    // Required security headers
    const requiredHeaders = {
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'strict-transport-security': true,
      'content-security-policy': true,
      'x-xss-protection': true,
      'permissions-policy': true
    };

    for (const [header, expected] of Object.entries(requiredHeaders)) {
      const value = headers[header.toLowerCase()];
      
      if (expected === true && value) {
        log.success(`${header}: Present`);
        addResult(`Security Header: ${header}`, true, value);
      } else if (value === expected) {
        log.success(`${header}: ${value}`);
        addResult(`Security Header: ${header}`, true, value);
      } else {
        log.error(`${header}: Missing or incorrect (${value})`);
        addResult(`Security Header: ${header}`, false, value || 'Missing');
      }
    }

    // Test CSP directives
    const csp = headers['content-security-policy'];
    if (csp) {
      const requiredDirectives = ['default-src', 'script-src', 'style-src', 'frame-src'];
      const hasAllDirectives = requiredDirectives.every(dir => csp.includes(dir));
      
      if (hasAllDirectives) {
        log.success('CSP: All required directives present');
        addResult('CSP Directives', true, 'All present');
      } else {
        log.error('CSP: Missing required directives');
        addResult('CSP Directives', false, 'Missing directives');
      }
    }

  } catch (error) {
    log.error(`Security headers test failed: ${error.message}`);
    addResult('Security Headers Test', false, error.message);
  }
};

// Test rate limiting
const testRateLimiting = async () => {
  log.header('🚦 TESTING RATE LIMITING');
  
  try {
    const promises = [];
    const requestCount = 15; // Should trigger rate limiting
    
    for (let i = 0; i < requestCount; i++) {
      promises.push(
        axios.get(`${BASE_URL}/api/health`, { timeout: 5000 })
          .catch(err => ({ error: err.response?.status || err.code }))
      );
    }

    const responses = await Promise.all(promises);
    const rateLimitedCount = responses.filter(r => 
      r.error === 429 || r.status === 429
    ).length;

    if (rateLimitedCount > 0) {
      log.success(`Rate limiting active: ${rateLimitedCount}/${requestCount} requests blocked`);
      addResult('Rate Limiting', true, `${rateLimitedCount} requests blocked`);
    } else {
      log.warning('Rate limiting not triggered (may need more requests)');
      addResult('Rate Limiting', false, 'No requests blocked');
    }

  } catch (error) {
    log.error(`Rate limiting test failed: ${error.message}`);
    addResult('Rate Limiting Test', false, error.message);
  }
};

// Test authentication
const testAuthentication = async () => {
  log.header('🔐 TESTING AUTHENTICATION');
  
  try {
    // Test unauthenticated access to protected endpoint
    try {
      await axios.post(`${BASE_URL}/api/upload/image`, {});
      log.error('Protected endpoint accessible without authentication');
      addResult('Authentication Protection', false, 'Endpoint accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        log.success('Protected endpoint properly secured');
        addResult('Authentication Protection', true, 'Unauthorized access blocked');
      } else {
        log.warning(`Unexpected response: ${error.response?.status}`);
        addResult('Authentication Protection', false, `Status: ${error.response?.status}`);
      }
    }

    // Test login endpoint
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: 'admin',
        password: 'tasnim@2026'
      });

      if (response.data.success && response.data.accessToken) {
        log.success('Login endpoint working correctly');
        addResult('Login Functionality', true, 'Token returned');
        
        // Test protected endpoint with valid token
        const token = response.data.accessToken;
        try {
          const protectedResponse = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (protectedResponse.status === 200) {
            log.success('JWT authentication working');
            addResult('JWT Authentication', true, 'Protected access granted');
          }
        } catch (authError) {
          log.error(`Protected access failed: ${authError.response?.status}`);
          addResult('JWT Authentication', false, authError.message);
        }
      } else {
        log.error('Login endpoint not returning token');
        addResult('Login Functionality', false, 'No token returned');
      }
    } catch (loginError) {
      log.error(`Login test failed: ${loginError.message}`);
      addResult('Login Functionality', false, loginError.message);
    }

    // Test invalid credentials
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        username: 'invalid',
        password: 'wrong'
      });
      log.error('Invalid credentials accepted');
      addResult('Invalid Credentials Rejection', false, 'Credentials accepted');
    } catch (error) {
      if (error.response?.status === 401) {
        log.success('Invalid credentials properly rejected');
        addResult('Invalid Credentials Rejection', true, 'Access denied');
      }
    }

  } catch (error) {
    log.error(`Authentication test failed: ${error.message}`);
    addResult('Authentication Test', false, error.message);
  }
};

// Test input validation
const testInputValidation = async () => {
  log.header('🧪 TESTING INPUT VALIDATION');
  
  const maliciousInputs = [
    { name: 'XSS Script', payload: { name: '<script>alert("xss")</script>' } },
    { name: 'SQL Injection', payload: { name: "'; DROP TABLE founders; --" } },
    { name: 'NoSQL Injection', payload: { name: { $ne: null } } },
    { name: 'XXE Attack', payload: { name: '<?xml version="1.0"?><!DOCTYPE test><test>test</test>' } },
    { name: 'Command Injection', payload: { name: 'test; rm -rf /' } },
    { name: 'Path Traversal', payload: { name: '../../../etc/passwd' } }
  ];

  for (const input of maliciousInputs) {
    try {
      await axios.post(`${BASE_URL}/api/founders`, input.payload);
      log.error(`${input.name}: Malicious input accepted`);
      addResult(`Input Validation: ${input.name}`, false, 'Accepted');
    } catch (error) {
      if (error.response?.status >= 400 && error.response?.status < 500) {
        log.success(`${input.name}: Properly rejected`);
        addResult(`Input Validation: ${input.name}`, true, 'Rejected');
      } else {
        log.warning(`${input.name}: Unexpected response ${error.response?.status}`);
        addResult(`Input Validation: ${input.name}`, false, `Status: ${error.response?.status}`);
      }
    }
  }
};

// Test CORS configuration
const testCORS = async () => {
  log.header('🌐 TESTING CORS CONFIGURATION');
  
  try {
    // Test allowed origin
    const allowedResponse = await axios.options(`${BASE_URL}/api/health`, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET'
      }
    });

    if (allowedResponse.headers['access-control-allow-origin']) {
      log.success('CORS headers present for allowed origin');
      addResult('CORS Allowed Origin', true, 'Headers present');
    } else {
      log.error('CORS headers missing for allowed origin');
      addResult('CORS Allowed Origin', false, 'Headers missing');
    }

    // Test disallowed origin
    try {
      await axios.options(`${BASE_URL}/api/health`, {
        headers: {
          'Origin': 'https://malicious-site.com',
          'Access-Control-Request-Method': 'GET'
        }
      });
      log.warning('Disallowed origin test inconclusive');
      addResult('CORS Disallowed Origin', false, 'May allow all origins');
    } catch (error) {
      if (error.response?.status === 403 || error.code === 'ERR_NETWORK') {
        log.success('Disallowed origin properly blocked');
        addResult('CORS Disallowed Origin', true, 'Blocked');
      }
    }

  } catch (error) {
    log.error(`CORS test failed: ${error.message}`);
    addResult('CORS Test', false, error.message);
  }
};

// Test file upload security
const testFileUploadSecurity = async () => {
  log.header('📁 TESTING FILE UPLOAD SECURITY');
  
  try {
    // First get a valid token
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'tasnim@2026'
    });

    if (!authResponse.data.accessToken) {
      log.error('Cannot test file upload: No auth token');
      return;
    }

    const token = authResponse.data.accessToken;

    // Test malicious file types
    const maliciousFiles = [
      { name: 'script.js', content: 'console.log("malicious")' },
      { name: 'executable.exe', content: 'MZ\x90\x00' },
      { name: 'shell.php', content: '<?php system($_GET["cmd"]); ?>' }
    ];

    for (const file of maliciousFiles) {
      try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', Buffer.from(file.content), file.name);

        await axios.post(`${BASE_URL}/api/upload/image`, form, {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });

        log.error(`Malicious file accepted: ${file.name}`);
        addResult(`File Upload Security: ${file.name}`, false, 'Accepted');
      } catch (error) {
        if (error.response?.status === 400) {
          log.success(`Malicious file rejected: ${file.name}`);
          addResult(`File Upload Security: ${file.name}`, true, 'Rejected');
        } else {
          log.warning(`Unexpected response for ${file.name}: ${error.response?.status}`);
        }
      }
    }

  } catch (error) {
    log.error(`File upload security test failed: ${error.message}`);
    addResult('File Upload Security Test', false, error.message);
  }
};

// Generate security report
const generateReport = () => {
  log.header('📊 SECURITY TEST REPORT');
  
  const passed = TEST_RESULTS.filter(r => r.passed).length;
  const failed = TEST_RESULTS.filter(r => !r.passed).length;
  const total = TEST_RESULTS.length;
  
  console.log(`\n${colors.bold}SUMMARY:${colors.reset}`);
  console.log(`✅ Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`❌ Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`📊 Total:  ${total}`);
  console.log(`🎯 Score:  ${Math.round((passed / total) * 100)}%`);

  if (failed > 0) {
    console.log(`\n${colors.red}${colors.bold}FAILED TESTS:${colors.reset}`);
    TEST_RESULTS.filter(r => !r.passed).forEach(result => {
      console.log(`❌ ${result.test}: ${result.details}`);
    });
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: { passed, failed, total, score: Math.round((passed / total) * 100) },
    results: TEST_RESULTS
  };

  fs.writeFileSync(
    path.join(__dirname, '../logs/security-test-report.json'),
    JSON.stringify(report, null, 2)
  );

  log.success(`Detailed report saved to logs/security-test-report.json`);
  
  if (passed === total) {
    log.success('🎉 ALL SECURITY TESTS PASSED! Production ready.');
  } else {
    log.warning(`⚠️  ${failed} security issues found. Review before production deployment.`);
  }
};

// Main test runner
const runSecurityTests = async () => {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                                                              ║');
  console.log('║         🔒 ENTERPRISE SECURITY TEST SUITE 🔒               ║');
  console.log('║                                                              ║');
  console.log('║    Comprehensive security validation for production          ║');
  console.log('║                                                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  log.info(`Testing server at: ${BASE_URL}`);
  
  try {
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    await testSecurityHeaders();
    await testRateLimiting();
    await testAuthentication();
    await testInputValidation();
    await testCORS();
    await testFileUploadSecurity();
    
    generateReport();
    
  } catch (error) {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
};

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests();
}

module.exports = { runSecurityTests };