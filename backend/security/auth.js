/**
 * 🔒 Enterprise Authentication & Authorization
 * JWT-based auth with 2FA support, account lockout, and brute force protection
 * Using secure in-memory rate limiting (production should use Redis)
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { logSecurityEvent, logAuditTrail, SECURITY_EVENTS, getClientIP } = require('./logger');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  return 'dev-secret-change-in-production';
})();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Secure Brute Force Protection (in-memory for now, use Redis in production)
class BruteForceProtection {
  constructor() {
    this.attempts = new Map(); // IP -> { count, firstAttempt, lockUntil }
    this.maxAttempts = 5;
    this.windowMs = 15 * 60 * 1000; // 15 minutes
    this.lockoutMs = 30 * 60 * 1000; // 30 minutes
    
    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  isBlocked(ip) {
    const record = this.attempts.get(ip);
    if (!record) return false;

    // Check if lockout has expired
    if (record.lockUntil && Date.now() > record.lockUntil) {
      this.attempts.delete(ip);
      return false;
    }

    return record.lockUntil && Date.now() < record.lockUntil;
  }

  recordAttempt(ip) {
    const now = Date.now();
    let record = this.attempts.get(ip) || { count: 0, firstAttempt: now };

    // Reset counter if window has expired
    if (now - record.firstAttempt > this.windowMs) {
      record = { count: 0, firstAttempt: now };
    }

    record.count++;

    // Lock account if max attempts exceeded
    if (record.count >= this.maxAttempts) {
      record.lockUntil = now + this.lockoutMs;
    }

    this.attempts.set(ip, record);
    return record.count >= this.maxAttempts;
  }

  reset(ip) {
    this.attempts.delete(ip);
  }

  cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.attempts.entries()) {
      if (record.lockUntil && now > record.lockUntil) {
        this.attempts.delete(ip);
      } else if (!record.lockUntil && (now - record.firstAttempt) > this.windowMs) {
        this.attempts.delete(ip);
      }
    }
  }

  getStats(ip) {
    const record = this.attempts.get(ip);
    if (!record) return { attempts: 0, locked: false };
    
    const locked = this.isBlocked(ip);
    const remainingTime = locked && record.lockUntil ? 
      Math.ceil((record.lockUntil - Date.now()) / 1000) : 0;

    return {
      attempts: record.count,
      locked,
      remainingTime
    };
  }
}

const bruteForce = new BruteForceProtection();

// Brute force middleware
const bruteforceMiddleware = (req, res, next) => {
  const ip = getClientIP(req);
  
  if (bruteForce.isBlocked(ip)) {
    const stats = bruteForce.getStats(ip);
    
    logSecurityEvent(SECURITY_EVENTS.AUTH_LOCKOUT, {
      ip,
      remainingTime: stats.remainingTime,
      reason: 'IP blocked due to brute force attempts'
    }, req);

    return res.status(429).json({
      error: 'Too many failed attempts',
      lockoutTime: stats.remainingTime,
      message: `IP temporarily blocked. Try again in ${Math.ceil(stats.remainingTime / 60)} minutes.`,
      code: 'BRUTE_FORCE_LOCKOUT'
    });
  }

  next();
};

// Account lockout tracking (in production, use Redis or database)
const accountLockouts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT tokens
const generateTokens = (payload) => {
  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
  return jwt.verify(token, secret);
};

// Check account lockout
const isAccountLocked = (identifier) => {
  const lockout = accountLockouts.get(identifier);
  if (!lockout) return false;

  if (Date.now() > lockout.lockedUntil) {
    accountLockouts.delete(identifier);
    return false;
  }

  return true;
};

// Track failed login attempt
const trackFailedLogin = (identifier, req) => {
  const existing = accountLockouts.get(identifier) || { attempts: 0, lockedUntil: null };
  existing.attempts += 1;

  if (existing.attempts >= MAX_LOGIN_ATTEMPTS) {
    existing.lockedUntil = Date.now() + LOCKOUT_DURATION;
    
    logSecurityEvent(SECURITY_EVENTS.AUTH_LOCKOUT, {
      identifier,
      attempts: existing.attempts,
      lockoutDuration: LOCKOUT_DURATION / 1000,
      reason: 'Maximum login attempts exceeded'
    }, req);
  }

  accountLockouts.set(identifier, existing);
  return existing.attempts >= MAX_LOGIN_ATTEMPTS;
};

// Clear failed login attempts
const clearFailedLogins = (identifier) => {
  accountLockouts.delete(identifier);
};

// 2FA Setup
const generate2FASecret = (username) => {
  return speakeasy.generateSecret({
    name: `Tasnim Dairy Farm (${username})`,
    issuer: 'Tasnim Dairy Farm',
    length: 32
  });
};

// Generate QR Code for 2FA setup
const generate2FAQRCode = async (secret) => {
  return await QRCode.toDataURL(secret.otpauth_url);
};

// Verify 2FA token
const verify2FAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps (60 seconds) of variance
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
      reason: 'No token provided',
      endpoint: req.originalUrl
    }, req);

    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if token is access token
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    req.user = decoded;
    next();
  } catch (error) {
    logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
      reason: 'Invalid token',
      error: error.message,
      endpoint: req.originalUrl
    }, req);

    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'TOKEN_INVALID'
    });
  }
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
      reason: 'Insufficient privileges',
      user: req.user?.username || 'anonymous',
      requiredRole: 'admin',
      userRole: req.user?.role || 'none',
      endpoint: req.originalUrl
    }, req);

    return res.status(403).json({ 
      error: 'Admin privileges required',
      code: 'INSUFFICIENT_PRIVILEGES'
    });
  }

  next();
};

// Login handler with enhanced security
const handleLogin = async (req, res) => {
  const { username, password, twoFactorToken } = req.body;
  const clientIP = getClientIP(req);

  try {
    // Get database instance
    const { usePg, getDatabase } = require('../database');
    
    let user = null;
    
    if (usePg) {
      // PostgreSQL query
      const client = await getDatabase().connect();
      try {
        const result = await client.query('SELECT * FROM admins WHERE username = $1', [username]);
        user = result.rows[0] || null;
        
        // Update last_login_at on successful authentication (we'll do this later)
      } finally {
        client.release();
      }
    } else {
      // SQLite query
      const db = getDatabase();
      const result = db.exec('SELECT * FROM admins WHERE username = ?', [username]);
      
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        const columns = result[0].columns;
        user = {};
        columns.forEach((col, index) => {
          user[col] = row[index];
        });
      }
    }
    
    // Check if any admin accounts exist
    let hasAdmins = false;
    if (usePg) {
      const client = await getDatabase().connect();
      try {
        const countResult = await client.query('SELECT COUNT(*) as count FROM admins');
        hasAdmins = parseInt(countResult.rows[0].count) > 0;
      } finally {
        client.release();
      }
    } else {
      const db = getDatabase();
      try {
        const countResult = db.exec('SELECT COUNT(*) as count FROM admins');
        hasAdmins = countResult.length > 0 && countResult[0].values[0][0] > 0;
      } catch (error) {
        // Table might not exist yet
        hasAdmins = false;
      }
    }
    
    // If no admins exist, return specific message
    if (!hasAdmins) {
      logSecurityEvent(SECURITY_EVENTS.AUTH_FAILURE, {
        reason: 'No admin accounts configured',
        ip: clientIP
      }, req);
      
      return res.status(401).json({
        error: 'No admin account configured. Run the seed script first.',
        code: 'NO_ADMIN_CONFIGURED',
        hint: 'Run: npm run seed:admin'
      });
    }
    
    // Verify credentials using bcrypt
    let isValidCredentials = false;
    if (user && user.password_hash) {
      isValidCredentials = await comparePassword(password, user.password_hash);
    }
    
    if (!isValidCredentials) {
      // Record failed attempt for brute force protection
      const isLocked = bruteForce.recordAttempt(clientIP);
      
      logSecurityEvent(SECURITY_EVENTS.AUTH_FAILURE, {
        username,
        reason: 'Invalid credentials',
        ip: clientIP,
        isLocked
      }, req);

      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login timestamp
    const now = new Date().toISOString();
    if (usePg) {
      const client = await getDatabase().connect();
      try {
        await client.query('UPDATE admins SET last_login_at = $1 WHERE id = $2', [now, user.id]);
      } finally {
        client.release();
      }
    } else {
      const db = getDatabase();
      db.run('UPDATE admins SET last_login_at = ? WHERE id = ?', [now, user.id]);
      const { saveSQLite } = require('../database');
      saveSQLite();
    }

    // TODO: Check 2FA if enabled for user
    // For now, 2FA is optional
    if (twoFactorToken) {
      // Verify 2FA token (placeholder - implement with user's secret)
      // const isValid2FA = verify2FAToken(twoFactorToken, userSecret);
      // if (!isValid2FA) {
      //   return res.status(401).json({ error: '2FA verification failed' });
      // }
    }

    // Clear failed login attempts on successful login
    bruteForce.reset(clientIP);

    // Generate tokens
    const tokenPayload = {
      username: user.username,
      role: user.role,
      ip: clientIP,
      iat: Math.floor(Date.now() / 1000)
    };

    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    // Log successful login
    logSecurityEvent(SECURITY_EVENTS.AUTH_SUCCESS, {
      username: user.username,
      ip: clientIP,
      userAgent: req.get('User-Agent'),
      lastLogin: user.last_login_at
    }, req);

    // Set secure HTTP-only cookies for tokens
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      accessToken,
      expiresIn: JWT_EXPIRES_IN,
      user: {
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    logSecurityEvent(SECURITY_EVENTS.AUTH_FAILURE, {
      username,
      reason: 'System error',
      error: error.message
    }, req);

    res.status(500).json({
      error: 'Authentication system error',
      code: 'AUTH_SYSTEM_ERROR'
    });
  }
};

// Token refresh handler
const handleTokenRefresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh token required',
      code: 'REFRESH_TOKEN_REQUIRED'
    });
  }

  try {
    const decoded = verifyToken(refreshToken, true);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Generate new access token
    const { accessToken } = generateTokens({
      username: decoded.username,
      role: decoded.role,
      ip: decoded.ip
    });

    res.json({
      success: true,
      accessToken,
      expiresIn: JWT_EXPIRES_IN
    });

  } catch (error) {
    logSecurityEvent(SECURITY_EVENTS.AUTH_FAILURE, {
      reason: 'Invalid refresh token',
      error: error.message
    }, req);

    // Clear invalid refresh token
    res.clearCookie('refreshToken');

    res.status(403).json({
      error: 'Invalid refresh token',
      code: 'REFRESH_TOKEN_INVALID'
    });
  }
};

// Logout handler
const handleLogout = async (req, res) => {
  const username = req.user?.username;

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  if (username) {
    logAuditTrail('logout', username, { ip: getClientIP(req) }, req);
  }

  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  bruteforceMiddleware,
  hashPassword,
  comparePassword,
  generateTokens,
  verifyToken,
  authenticateToken,
  requireAdmin,
  handleLogin,
  handleTokenRefresh,
  handleLogout,
  generate2FASecret,
  generate2FAQRCode,
  verify2FAToken,
  bruteForce
};