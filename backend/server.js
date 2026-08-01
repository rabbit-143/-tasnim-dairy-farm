/**
 * 🔒 ENTERPRISE SECURE SERVER - TASNIM DAIRY FARM
 * Production-ready server with comprehensive security hardening
 * Designed for millions of users with enterprise-grade protection
 */

// Global error handlers with security logging
process.on('uncaughtException', (err) => {
  console.error('🚨 CRITICAL: Uncaught Exception', {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 CRITICAL: Unhandled Rejection', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

// Core dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const fs = require('fs');

// Security modules
const { appLogger, logSecurityEvent, logAuditTrail, SECURITY_EVENTS } = require('./security/logger');
const { 
  detectSuspiciousRequest,
  sanitizeRequest,
  validateRequestSize,
  validationSets
} = require('./security/validation');
const {
  authenticateToken,
  requireAdmin,
  handleLogin,
  handleTokenRefresh,
  handleLogout,
  bruteforceMiddleware
} = require('./security/auth');
const { 
  secureUpload,
  processUploadedFile 
} = require('./security/fileUpload');

// Database
const { pool, initializeDatabase } = require('./database');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 ENTERPRISE SECURITY CONFIGURATION
// =====================================

// 1. SECURITY HEADERS with strict CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for Tailwind CSS
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:", 
        "blob:",
        "*.cloudinary.com" // If using Cloudinary CDN
      ],
      scriptSrc: [
        "'self'",
        "'wasm-unsafe-eval'" // For modern build tools
      ],
      connectSrc: [
        "'self'", 
        "https://api.longcat.chat", // Chatbot API
        process.env.NODE_ENV === 'development' ? "ws://localhost:*" : ""
      ].filter(Boolean),
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'"]
    },
  },
  // Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  // X-Frame-Options
  frameguard: { action: 'deny' },
  // X-Content-Type-Options
  noSniff: true,
  // X-XSS-Protection
  xssFilter: true,
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Permissions Policy
  permittedCrossDomainPolicies: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Additional security headers
app.use((req, res, next) => {
  // Permissions Policy (Feature Policy)
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
    'autoplay=(self)'
  ].join(', '));
  
  // Additional security headers
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
});

// 2. COMPRESSION with security considerations
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    // Don't compress responses with this request header
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  }
}));

// 3. RATE LIMITING - Multi-tier protection
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => 
  rateLimit({
    windowMs,
    max,
    message: { error: message, code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_HIT, {
        ip: req.ip,
        endpoint: req.originalUrl,
        limit: max,
        window: windowMs
      }, req);
      
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
  });

// Global rate limiting
const globalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per IP
  'Too many requests from this IP, please try again later.'
);

// Authentication rate limiting
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 auth attempts per IP
  'Too many authentication attempts, please try again later.',
  true // Skip successful requests
);

// Upload rate limiting
const uploadLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  10, // 10 uploads per IP
  'Too many file uploads, please try again later.'
);

// API rate limiting
const apiLimiter = createRateLimit(
  1 * 60 * 1000, // 1 minute
  30, // 30 API calls per IP per minute
  'API rate limit exceeded, please slow down.'
);

// 4. SLOW DOWN (Progressive delay)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests at full speed
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  validate: {
    delayMs: false // Disable warning message
  }
});

// Apply rate limiting
app.use('/api/auth', authLimiter, bruteforceMiddleware);
app.use('/api/upload', uploadLimiter);
app.use('/api', apiLimiter);
app.use(speedLimiter);
app.use(globalLimiter);

// 5. TRUST PROXY (for accurate IP detection behind load balancers)
app.set('trust proxy', process.env.TRUST_PROXY || 1);

// 6. REQUEST VALIDATION & SANITIZATION
app.use(validateRequestSize);
app.use(detectSuspiciousRequest);

// Body parser with strict limits
app.use(express.json({ 
  limit: '1mb', // Reduced from 10mb for security
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb',
  parameterLimit: 20
}));

// Security sanitization middleware
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xssClean()); // Clean user input from malicious HTML
app.use(hpp({ // Prevent HTTP Parameter Pollution
  whitelist: ['sort', 'fields', 'page', 'limit'] // Allow arrays for these params
}));
app.use(sanitizeRequest); // Custom sanitization

// 7. CORS - Strict configuration for production
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.) only in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logSecurityEvent(SECURITY_EVENTS.CORS_VIOLATION, {
        origin: origin || 'null',
        allowedOrigins
      });
      
      callback(new Error('Origin not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// 8. SECURITY LOGGING
app.use((req, res, next) => {
  // Log all requests in production
  if (process.env.NODE_ENV === 'production') {
    appLogger.info('Request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer')
    });
  }
  next();
});

// 9. SECURE STATIC FILE SERVING
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  appLogger.info('Created uploads directory');
}

app.use('/uploads', express.static(uploadsDir, {
  dotfiles: 'deny', // Deny access to dotfiles
  index: false, // Disable directory browsing
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Prevent execution of uploaded files
    res.set({
      'Content-Type': 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'attachment', // Force download
      'Cache-Control': 'public, max-age=86400'
    });
  }
}));

// =====================================
// 🔐 AUTHENTICATION & API ENDPOINTS
// =====================================

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Tasnim Dairy Farm API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0-enterprise'
  });
});

// Authentication endpoints
app.post('/api/auth/login', validationSets.login, handleLogin);
app.post('/api/auth/refresh', handleTokenRefresh);
app.post('/api/auth/logout', authenticateToken, handleLogout);

// Secure file upload endpoint
app.post('/api/upload/image', 
  authenticateToken,
  requireAdmin,
  secureUpload.single('image'),
  processUploadedFile,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        code: 'NO_FILE_UPLOADED' 
      });
    }
    
    const filepath = `/uploads/${req.file.filename}`;
    
    // Log admin action
    logAuditTrail('file_upload', req.user.username, {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      filepath
    }, req);
    
    res.json({
      success: true,
      filepath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  }
);

// API Routes - All require authentication for write operations
const foundersRouter = require('./routes/founders');
const blogsRouter = require('./routes/blogs');
const galleryRouter = require('./routes/gallery');
const careersRouter = require('./routes/careers');
const settingsRouter = require('./routes/settings');
const contactRouter = require('./routes/contact');
const growthRouter = require('./routes/growth');

// Public routes (read-only)
app.use('/api/founders', foundersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/careers', careersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/growth', growthRouter);
app.use('/api/contact', contactRouter); // Contact form remains public

// Admin dashboard endpoint
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  logAuditTrail('dashboard_access', req.user.username, {}, req);
  
  res.json({
    success: true,
    message: 'Admin dashboard accessed',
    user: {
      username: req.user.username,
      role: req.user.role
    }
  });
});

// =====================================
// 🛡️ ERROR HANDLING & SECURITY
// =====================================

// 404 handler
app.use((req, res) => {
  logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_REQUEST, {
    reason: 'Route not found',
    path: req.originalUrl,
    method: req.method
  }, req);
  
  res.status(404).json({ 
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND' 
  });
});

// Global error handler with security logging
app.use((err, req, res, next) => {
  // Log error details
  appLogger.error('Server Error', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  if (err.code === 'EBADCSRFTOKEN') {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_REQUEST, {
      reason: 'CSRF token mismatch'
    }, req);
    return res.status(403).json({ 
      error: 'Invalid security token',
      code: 'CSRF_ERROR'
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ 
      error: 'Invalid JSON format',
      code: 'JSON_PARSE_ERROR'
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Request entity too large',
      code: 'PAYLOAD_TOO_LARGE'
    });
  }

  // Multer errors
  if (err.code && err.code.startsWith('LIMIT_')) {
    let errorMessage = 'File upload error';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        errorMessage = 'File size exceeds 5MB limit';
        break;
      case 'LIMIT_FILE_COUNT':
        errorMessage = 'Too many files uploaded';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        errorMessage = 'Unexpected file field';
        break;
    }
    
    return res.status(400).json({ 
      error: errorMessage,
      code: err.code
    });
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    logSecurityEvent(SECURITY_EVENTS.CORS_VIOLATION, {
      error: err.message
    }, req);
    
    return res.status(403).json({ 
      error: 'Origin not allowed',
      code: 'CORS_ERROR'
    });
  }

  // Generic error response
  const statusCode = err.status || err.statusCode || 500;
  
  if (statusCode >= 500) {
    // Log server errors
    logSecurityEvent('server_error', {
      error: err.message,
      statusCode
    }, req);
  }

  // Don't expose internal details in production
  const errorResponse = {
    error: statusCode >= 500 ? 'Internal server error' : err.message,
    code: err.code || 'INTERNAL_ERROR'
  };

  // Add debug info in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }

  res.status(statusCode).json(errorResponse);
});

// =====================================
// 🚀 SERVER STARTUP & LIFECYCLE
// =====================================

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  appLogger.info(`Received ${signal}, starting graceful shutdown...`);
  
  // Close database connections
  if (pool) {
    pool.end(() => {
      appLogger.info('Database connection pool closed');
    });
  }
  
  // Additional cleanup here (Redis, etc.)
  
  setTimeout(() => {
    appLogger.info('Graceful shutdown completed');
    process.exit(0);
  }, 10000); // 10 second timeout
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server with enterprise configuration
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    appLogger.info('Database initialized successfully');

    // Validate required environment variables
    const requiredEnvVars = ['JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      const serverInfo = {
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        cors_origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        timestamp: new Date().toISOString(),
        security_features: [
          'Helmet Security Headers',
          'Rate Limiting (Multi-tier)',
          'CORS Protection', 
          'Request Validation',
          'File Upload Security',
          'Authentication & Authorization',
          'Security Logging',
          'Brute Force Protection',
          'XSS Protection',
          'NoSQL Injection Prevention',
          'Compression Security',
          'Trusted Proxy Configuration'
        ]
      };

      appLogger.info('🔒 ENTERPRISE SECURE SERVER STARTED', serverInfo);

      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🔒 TASNIM DAIRY FARM - ENTERPRISE SECURITY ENABLED 🔒      ║
║                                                               ║
║   Environment: ${(process.env.NODE_ENV || 'development').toUpperCase().padEnd(47)}║
║   Port:        ${PORT.toString().padEnd(47)}║
║   Frontend:    ${(process.env.CORS_ORIGIN || 'http://localhost:5173').substring(0,47).padEnd(47)}║
║   Database:    PostgreSQL (Production Ready)                  ║
║                                                               ║
║   🛡️  SECURITY FEATURES ACTIVE:                               ║
║   ✅ Strict CSP & Security Headers                           ║
║   ✅ Multi-tier Rate Limiting                                ║
║   ✅ Brute Force Protection                                  ║
║   ✅ Advanced Input Validation                               ║
║   ✅ Secure File Upload & Scanning                          ║
║   ✅ JWT Authentication + 2FA Ready                         ║
║   ✅ Comprehensive Security Logging                         ║
║   ✅ CORS & XSS Protection                                  ║
║   ✅ NoSQL Injection Prevention                             ║
║   ✅ Compression Security                                   ║
║   ✅ Account Lockout Protection                             ║
║                                                               ║
║   Status: PRODUCTION READY FOR MILLIONS OF USERS            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `);
    });

    // Configure server timeout
    server.timeout = 30000; // 30 seconds
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds

    return server;

  } catch (error) {
    appLogger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    
    console.error('❌ CRITICAL ERROR: Failed to start server');
    console.error(error.message);
    
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error('❌ STARTUP ERROR:', error);
  process.exit(1);
});

module.exports = app;