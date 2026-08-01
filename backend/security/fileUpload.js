/**
 * 🔒 Enterprise File Upload Security
 * Advanced file validation with MIME detection, virus scanning, and malware protection
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const fileType = require('file-type');
const { logSecurityEvent, SECURITY_EVENTS, getClientIP } = require('./logger');

// File upload configuration
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 1,
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  uploadDir: path.join(__dirname, '../uploads'),
  tempDir: path.join(__dirname, '../temp'),
  quarantineDir: path.join(__dirname, '../quarantine')
};

// Ensure directories exist
const ensureDirectories = () => {
  const dirs = [UPLOAD_CONFIG.uploadDir, UPLOAD_CONFIG.tempDir, UPLOAD_CONFIG.quarantineDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectories();

// Advanced file validation
const validateFileContent = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Detect actual file type from content
    const detectedType = await fileType.fromBuffer(fileBuffer);
    
    if (!detectedType) {
      throw new Error('Unable to detect file type');
    }

    // Verify MIME type matches actual content
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(detectedType.mime)) {
      throw new Error(`File type ${detectedType.mime} not allowed`);
    }

    // Additional image validation
    if (detectedType.mime.startsWith('image/')) {
      return await validateImageFile(fileBuffer, detectedType);
    }

    return { valid: true, fileType: detectedType };

  } catch (error) {
    throw new Error(`File validation failed: ${error.message}`);
  }
};

// Validate image files for malicious content
const validateImageFile = async (buffer, fileType) => {
  const MAX_DIMENSION = 4096; // Maximum width/height
  const MIN_SIZE = 100; // Minimum file size in bytes

  // Check file size
  if (buffer.length < MIN_SIZE) {
    throw new Error('Image file too small, possibly corrupted');
  }

  // Basic image header validation
  const signatures = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46]
  };

  const signature = signatures[fileType.mime];
  if (signature) {
    const header = Array.from(buffer.slice(0, signature.length));
    if (!signature.every((byte, index) => byte === header[index])) {
      throw new Error('Invalid image file signature');
    }
  }

  // Check for embedded executable code patterns
  const suspiciousPatterns = [
    /eval\s*\(/gi,
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /%3C%73%63%72%69%70%74/gi, // URL encoded <script
    /\x00/g // Null bytes
  ];

  const fileContent = buffer.toString('binary');
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fileContent)) {
      throw new Error('File contains potentially malicious content');
    }
  }

  return { valid: true, fileType };
};

// Virus scanning placeholder (integrate with ClamAV in production)
const scanForViruses = async (filePath) => {
  try {
    // TODO: Integrate with node-clamav or external antivirus service
    // const clamscan = await new NodeClam().init();
    // const scanResult = await clamscan.scanFile(filePath);
    // return scanResult;

    // For now, just check file size and basic patterns
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error('Empty file detected');
    }

    return { isInfected: false, viruses: [] };
  } catch (error) {
    throw new Error(`Virus scan failed: ${error.message}`);
  }
};

// Generate secure filename
const generateSecureFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return `${timestamp}-${random}${ext}`;
};

// Secure multer storage configuration
const secureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_CONFIG.tempDir); // Upload to temp first
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  }
});

// Enhanced file filter
const secureFileFilter = (req, file, cb) => {
  const clientIP = getClientIP(req);
  
  try {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
      logSecurityEvent(SECURITY_EVENTS.FILE_UPLOAD_REJECTED, {
        reason: 'Invalid file extension',
        extension: ext,
        filename: file.originalname,
        ip: clientIP
      }, req);
      
      return cb(new Error('File type not allowed'), false);
    }

    // Check MIME type
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
      logSecurityEvent(SECURITY_EVENTS.FILE_UPLOAD_REJECTED, {
        reason: 'Invalid MIME type',
        mimetype: file.mimetype,
        filename: file.originalname,
        ip: clientIP
      }, req);
      
      return cb(new Error('File MIME type not allowed'), false);
    }

    // Check filename for suspicious patterns
    const suspiciousFilename = /[<>:"|?*\x00-\x1f]|^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    if (suspiciousFilename.test(file.originalname)) {
      logSecurityEvent(SECURITY_EVENTS.FILE_UPLOAD_REJECTED, {
        reason: 'Suspicious filename',
        filename: file.originalname,
        ip: clientIP
      }, req);
      
      return cb(new Error('Invalid filename'), false);
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

// Configure multer with security settings
const secureUpload = multer({
  storage: secureStorage,
  fileFilter: secureFileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.maxFileSize,
    files: UPLOAD_CONFIG.maxFiles,
    fields: 5,
    fieldNameSize: 50,
    fieldSize: 1024,
    parts: 10
  }
});

// Process uploaded file with validation
const processUploadedFile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const tempPath = req.file.path;
  const finalPath = path.join(UPLOAD_CONFIG.uploadDir, req.file.filename);
  const quarantinePath = path.join(UPLOAD_CONFIG.quarantineDir, req.file.filename);

  try {
    // Validate file content
    const validation = await validateFileContent(tempPath);
    
    if (!validation.valid) {
      throw new Error('File validation failed');
    }

    // Scan for viruses
    const scanResult = await scanForViruses(tempPath);
    
    if (scanResult.isInfected) {
      // Move to quarantine
      fs.renameSync(tempPath, quarantinePath);
      
      logSecurityEvent(SECURITY_EVENTS.MALICIOUS_FILE_DETECTED, {
        filename: req.file.filename,
        originalName: req.file.originalname,
        viruses: scanResult.viruses,
        quarantined: true
      }, req);

      throw new Error('File contains malicious content');
    }

    // Move to final upload directory
    fs.renameSync(tempPath, finalPath);

    // Update file path in request
    req.file.path = finalPath;
    req.file.destination = UPLOAD_CONFIG.uploadDir;

    // Log successful upload
    logSecurityEvent('file_upload_success', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }, req);

    next();

  } catch (error) {
    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    logSecurityEvent(SECURITY_EVENTS.FILE_UPLOAD_REJECTED, {
      reason: error.message,
      filename: req.file?.filename,
      originalName: req.file?.originalname
    }, req);

    return res.status(400).json({
      error: 'File upload failed',
      message: error.message,
      code: 'FILE_UPLOAD_ERROR'
    });
  }
};

// File cleanup utility
const cleanupOldFiles = async (maxAgeHours = 24) => {
  const dirs = [UPLOAD_CONFIG.tempDir, UPLOAD_CONFIG.quarantineDir];
  const maxAge = Date.now() - (maxAgeHours * 60 * 60 * 1000);

  for (const dir of dirs) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error(`Cleanup error in ${dir}:`, error);
    }
  }
};

// Schedule periodic cleanup
setInterval(() => {
  cleanupOldFiles().catch(console.error);
}, 60 * 60 * 1000); // Every hour

module.exports = {
  secureUpload,
  processUploadedFile,
  validateFileContent,
  scanForViruses,
  cleanupOldFiles,
  UPLOAD_CONFIG
};