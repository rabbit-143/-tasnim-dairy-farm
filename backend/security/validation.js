/**
 * 🔒 Enterprise Input Validation & Sanitization
 * Advanced validation with XSS protection and data sanitization
 */

const { body, param, query, validationResult } = require('express-validator');
const xss = require('xss');
const { logSecurityEvent, SECURITY_EVENTS } = require('./logger');

// Custom XSS filter options
const xssOptions = {
  whiteList: {}, // No HTML tags allowed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style'],
  css: false
};

// Sanitize text input
const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  return xss(text.trim(), xssOptions);
};

// Common validation rules
const validationRules = {
  // Basic field validations
  id: param('id')
    .isInt({ min: 1, max: 2147483647 })
    .withMessage('ID must be a valid positive integer')
    .toInt(),

  email: body('email')
    .isEmail()
    .isLength({ max: 254 })
    .normalizeEmail({ gmail_remove_dots: false })
    .withMessage('Invalid email format'),

  username: body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-50 characters, alphanumeric only')
    .customSanitizer(sanitizeText),

  password: body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be 8-128 chars with uppercase, lowercase, number, and special character'),

  // Text content validations
  title: body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be 1-200 characters')
    .customSanitizer(sanitizeText),

  content: body('content')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be 1-10000 characters')
    .customSanitizer(sanitizeText),

  description: body('description')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be 1-1000 characters')
    .customSanitizer(sanitizeText),

  name: body('name')
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name must be 1-100 characters, letters only')
    .customSanitizer(sanitizeText),

  // URL validation
  url: body('url')
    .optional()
    .isURL({ protocols: ['https'], require_protocol: true })
    .isLength({ max: 500 })
    .withMessage('URL must be HTTPS and under 500 characters'),

  // Phone number validation
  phone: body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number format'),

  // Date validation
  date: body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be in ISO format'),

  // Numeric validations
  number: (field, min = 0, max = 999999999) => 
    body(field)
      .isFloat({ min, max })
      .withMessage(`${field} must be between ${min} and ${max}`)
      .toFloat(),

  // Boolean validation
  boolean: (field) =>
    body(field)
      .optional()
      .isBoolean()
      .withMessage(`${field} must be boolean`)
      .toBoolean(),

  // Array validation
  array: (field, maxLength = 50) =>
    body(field)
      .optional()
      .isArray({ max: maxLength })
      .withMessage(`${field} must be an array with max ${maxLength} items`),

  // Query parameter validations
  page: query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Page must be between 1 and 10000')
    .toInt(),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  search: query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be 1-100 characters')
    .customSanitizer(sanitizeText)
};

// Advanced validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Log validation failure for security monitoring
    logSecurityEvent(SECURITY_EVENTS.VALIDATION_FAILURE, {
      errors: errors.array(),
      route: req.route?.path || req.path,
      method: req.method
    }, req);

    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: typeof err.value === 'string' ? '***' : err.value // Hide sensitive data
      }))
    });
  }

  next();
};

// Request size validation middleware
const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length']) || 0;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_REQUEST, {
      reason: 'Request size too large',
      size: contentLength,
      maxSize
    }, req);

    return res.status(413).json({ 
      error: 'Request entity too large',
      maxSize: '10MB'
    });
  }

  next();
};

// Suspicious request detection
const detectSuspiciousRequest = (req, res, next) => {
  const suspiciousPatterns = [
    // SQL injection patterns
    /(union|select|insert|delete|drop|create|alter|exec|execute)/i,
    // XSS patterns  
    /<script|javascript:|on\w+\s*=/i,
    // Path traversal
    /\.\.[\/\\]/,
    // Command injection
    /[;&|`$(){}]/
  ];

  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_REQUEST, {
        pattern: pattern.source,
        matchedContent: checkString.substring(0, 200) // Limit logged content
      }, req);

      return res.status(400).json({
        error: 'Request contains potentially malicious content'
      });
    }
  }

  next();
};

// Content sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  // Sanitize query params
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }

  next();
};

// Recursively sanitize object properties
const sanitizeObject = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeText(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  }
};

// Validation rule sets for different endpoints
const validationSets = {
  login: [
    validationRules.username,
    validationRules.password,
    handleValidationErrors
  ],

  createContent: [
    validationRules.title,
    validationRules.content,
    validationRules.description.optional(),
    handleValidationErrors
  ],

  updateContent: [
    validationRules.id,
    validationRules.title.optional(),
    validationRules.content.optional(),
    validationRules.description.optional(),
    handleValidationErrors
  ],

  contact: [
    validationRules.name,
    validationRules.email,
    body('message').isLength({ min: 10, max: 2000 }).customSanitizer(sanitizeText),
    validationRules.phone.optional(),
    handleValidationErrors
  ],

  pagination: [
    validationRules.page,
    validationRules.limit,
    validationRules.search,
    handleValidationErrors
  ]
};

module.exports = {
  validationRules,
  validationSets,
  handleValidationErrors,
  validateRequestSize,
  detectSuspiciousRequest,
  sanitizeRequest,
  sanitizeText
};