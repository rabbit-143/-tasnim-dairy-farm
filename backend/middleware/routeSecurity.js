/**
 * 🔒 Enterprise Route Security Middleware
 * Comprehensive protection for all API routes with admin controls
 */

const { authenticateToken, requireAdmin } = require('../security/auth');
const { logAuditTrail, logSecurityEvent, SECURITY_EVENTS } = require('../security/logger');
const { validationSets } = require('../security/validation');

// Admin route protection with audit logging
const protectAdminRoute = (action) => {
  return [
    authenticateToken,
    requireAdmin,
    (req, res, next) => {
      // Log all admin actions for audit trail
      logAuditTrail(action, req.user.username, {
        method: req.method,
        path: req.originalUrl,
        body: req.method !== 'GET' ? req.body : undefined,
        params: req.params,
        query: req.query
      }, req);

      next();
    }
  ];
};

// Public route with optional rate limiting
const publicRoute = (enableRateLimit = false) => {
  const middleware = [];
  
  if (enableRateLimit) {
    const rateLimit = require('express-rate-limit');
    middleware.push(rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 10, // 10 requests per minute for public routes
      message: { error: 'Too many requests to this endpoint' },
      standardHeaders: true,
      legacyHeaders: false
    }));
  }

  // Log public route access
  middleware.push((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      logSecurityEvent('public_route_access', {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, req);
    }
    next();
  });

  return middleware;
};

// Read-only route protection (public read, admin write)
const hybridRoute = (action) => {
  return (req, res, next) => {
    // GET requests are public, others require admin
    if (req.method === 'GET') {
      return next();
    }

    // Apply admin protection for write operations
    return protectAdminRoute(action)[0](req, res, (err) => {
      if (err) return next(err);
      return protectAdminRoute(action)[1](req, res, (err2) => {
        if (err2) return next(err2);
        return protectAdminRoute(action)[2](req, res, next);
      });
    });
  };
};

// Content validation for create/update operations
const validateContent = (type) => {
  switch (type) {
    case 'blog':
    case 'career':
    case 'founder':
      return validationSets.createContent;
    
    case 'contact':
      return validationSets.contact;
    
    case 'pagination':
      return validationSets.pagination;
    
    default:
      return [];
  }
};

// File upload protection
const protectFileUpload = [
  authenticateToken,
  requireAdmin,
  (req, res, next) => {
    logAuditTrail('file_upload_attempt', req.user.username, {
      filename: req.file?.originalname,
      size: req.file?.size,
      mimetype: req.file?.mimetype
    }, req);
    
    next();
  }
];

// Database operation protection
const protectDatabaseOp = (operation, table) => {
  return [
    authenticateToken,
    requireAdmin,
    (req, res, next) => {
      logAuditTrail('database_operation', req.user.username, {
        operation,
        table,
        recordId: req.params.id,
        data: operation !== 'SELECT' ? req.body : undefined
      }, req);

      next();
    }
  ];
};

// Response sanitization middleware
const sanitizeResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Remove sensitive fields from responses
    if (data && typeof data === 'object') {
      delete data.password;
      delete data.secret;
      delete data.token;
      delete data.refreshToken;
      
      // Recursively clean arrays and nested objects
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            delete item.password;
            delete item.secret;
            delete item.token;
          }
        });
      }
    }

    return originalJson.call(this, data);
  };

  next();
};

// API versioning protection
const requireApiVersion = (minVersion = '1.0') => {
  return (req, res, next) => {
    const apiVersion = req.headers['api-version'] || req.query.v || '1.0';
    
    if (apiVersion < minVersion) {
      logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_REQUEST, {
        reason: 'Outdated API version',
        requestedVersion: apiVersion,
        minimumVersion: minVersion
      }, req);

      return res.status(400).json({
        error: 'API version too old',
        requestedVersion: apiVersion,
        minimumVersion: minVersion,
        code: 'API_VERSION_OUTDATED'
      });
    }

    req.apiVersion = apiVersion;
    next();
  };
};

// Request timeout protection
const requestTimeout = (seconds = 30) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      logSecurityEvent('request_timeout', {
        path: req.originalUrl,
        method: req.method,
        timeout: seconds
      }, req);

      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request timeout',
          timeout: seconds,
          code: 'REQUEST_TIMEOUT'
        });
      }
    }, seconds * 1000);

    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));

    next();
  };
};

// Content-Type validation
const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next();
    }

    const contentType = req.get('Content-Type') || '';
    const isValid = allowedTypes.some(type => contentType.includes(type));

    if (!isValid) {
      logSecurityEvent(SECURITY_EVENTS.VALIDATION_FAILURE, {
        reason: 'Invalid Content-Type',
        contentType,
        allowedTypes
      }, req);

      return res.status(400).json({
        error: 'Invalid Content-Type',
        expected: allowedTypes,
        received: contentType,
        code: 'INVALID_CONTENT_TYPE'
      });
    }

    next();
  };
};

module.exports = {
  protectAdminRoute,
  publicRoute,
  hybridRoute,
  validateContent,
  protectFileUpload,
  protectDatabaseOp,
  sanitizeResponse,
  requireApiVersion,
  requestTimeout,
  validateContentType
};