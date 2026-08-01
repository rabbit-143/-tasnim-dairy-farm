/**
 * 🔒 Enterprise Security Logger
 * Centralized security event logging with audit trails
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '../logs');
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const logObj = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    if (stack) {
      logObj.stack = stack;
    }
    
    return JSON.stringify(logObj);
  })
);

// Security Events Logger (separate from general logs)
const securityLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'security-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      auditFile: path.join(logDir, 'security-audit.json')
    }),
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logDir, 'security-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

// Application Logger
const appLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logDir, 'app-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

// Add console transport for non-production
if (process.env.NODE_ENV !== 'production') {
  appLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Security Event Types
const SECURITY_EVENTS = {
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILURE: 'auth_failure',
  AUTH_LOCKOUT: 'auth_lockout',
  SUSPICIOUS_REQUEST: 'suspicious_request',
  FILE_UPLOAD_REJECTED: 'file_upload_rejected',
  RATE_LIMIT_HIT: 'rate_limit_hit',
  CORS_VIOLATION: 'cors_violation',
  VALIDATION_FAILURE: 'validation_failure',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  ADMIN_ACTION: 'admin_action',
  DATA_BREACH_ATTEMPT: 'data_breach_attempt',
  MALICIOUS_FILE_DETECTED: 'malicious_file_detected'
};

// Helper functions
const logSecurityEvent = (event, details = {}, req = null) => {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    ...details
  };

  if (req) {
    logData.ip = getClientIP(req);
    logData.userAgent = req.get('User-Agent');
    logData.referer = req.get('Referer');
    logData.method = req.method;
    logData.url = req.originalUrl;
    logData.sessionId = req.sessionID;
  }

  securityLogger.info('Security Event', logData);
  
  // High-priority alerts for critical events
  if (['auth_lockout', 'data_breach_attempt', 'malicious_file_detected'].includes(event)) {
    securityLogger.error('CRITICAL Security Event', logData);
  }
};

const logAppEvent = (level, message, meta = {}) => {
  appLogger.log(level, message, meta);
};

// Get real client IP (handles proxies)
const getClientIP = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '0.0.0.0';
};

// Audit trail for admin actions
const logAuditTrail = (action, user, details = {}, req = null) => {
  logSecurityEvent(SECURITY_EVENTS.ADMIN_ACTION, {
    action,
    user,
    details,
    severity: 'high'
  }, req);
};

module.exports = {
  securityLogger,
  appLogger,
  logSecurityEvent,
  logAppEvent,
  logAuditTrail,
  SECURITY_EVENTS,
  getClientIP
};