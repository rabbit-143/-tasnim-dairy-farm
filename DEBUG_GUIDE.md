# 🐛 Debug Guide - Tasnim Dairy Farm

## 🎯 Debugging Philosophy

1. **Understand the problem** before attempting fixes
2. **Reproduce the issue** consistently
3. **Isolate the cause** (frontend, backend, or database)
4. **Test the fix** thoroughly before deploying
5. **Document the solution** for future reference

---

## 🔍 Common Issues & Solutions

### **Issue 1: "Cannot GET /api/endpoint" - 404 Error**

**Symptoms:**
- API calls fail with 404 status
- Frontend shows "Failed to fetch data"

**Diagnosis:**
```bash
# Check if backend server is running
# Should see: "Server running on port 3000"
cd backend
npm start

# Check route registration in server.js
# Verify the route file is imported and used
```

**Solution:**
```javascript
// In backend/server.js, ensure route is registered:
const foundersRoute = require('./routes/founders');
app.use('/api/founders', foundersRoute);

// Verify route file exists: backend/routes/founders.js
```

---

### **Issue 2: CORS Error - "Access-Control-Allow-Origin"**

**Symptoms:**
- Browser console shows CORS policy error
- API requests blocked by browser

**Diagnosis:**
```javascript
// Check backend/.env file
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

// Should include your frontend URL
// Development: http://localhost:5173
// Production: https://your-domain.netlify.app
```

**Solution:**
```javascript
// Update backend/.env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:5000

// Or for production:
CORS_ORIGIN=https://tasnim-dairy-farm.netlify.app

// Restart backend server after changing .env
```

---

### **Issue 3: Database Connection Error**

**Symptoms:**
- "Error initializing database"
- "ECONNREFUSED" or timeout errors

**Diagnosis:**
```bash
# Check DATABASE_URL in backend/.env
echo %DATABASE_URL%

# For SQLite development (should be empty or commented):
DATABASE_URL=

# For PostgreSQL production:
DATABASE_URL=postgresql://user:pass@host/db
```

**Solution for Development:**
```bash
# Use SQLite (no external database needed)
# In backend/.env:
DATABASE_URL=

# Database will auto-create using sql.js
```

**Solution for Production:**
```bash
# Use Neon PostgreSQL
# Get connection string from Neon dashboard
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
```

---

### **Issue 4: Image Upload Fails**

**Symptoms:**
- "No file uploaded" error
- Images don't appear after upload

**Diagnosis:**
```javascript
// Check multer configuration in server.js
console.log('Upload directory:', path.join(__dirname, 'uploads'));
console.log('File exists:', fs.existsSync(uploadsDir));

// Check file field name matches
// Frontend must use: formData.append('image', file)
// Backend expects: upload.single('image')
```

**Solution:**
```javascript
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Frontend upload code:
const formData = new FormData();
formData.append('image', fileInput.files[0]); // Must be 'image'

// Backend route:
router.post('/upload/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filepath: `/uploads/${req.file.filename}` });
});
```

---

### **Issue 5: Admin Login Not Working**

**Symptoms:**
- Login form doesn't respond
- "Invalid credentials" despite correct password

**Diagnosis:**
```typescript
// Check AdminContext.tsx login function
console.log('Username entered:', username);
console.log('Expected:', 'admin');
console.log('Password match:', password === 'tasnim@2026');
```

**Solution:**
```typescript
// Verify credentials in AdminContext.tsx
const login = (username: string, password: string): boolean => {
  if (username === 'admin' && password === 'tasnim@2026') {
    setIsAuthenticated(true);
    localStorage.setItem('adminAuth', JSON.stringify({ authenticated: true }));
    return true;
  }
  return false;
};

// Check localStorage persistence
// Should persist after page refresh
```

---

### **Issue 6: Frontend Build Fails**

**Symptoms:**
- `npm run build` shows TypeScript errors
- Vite build process fails

**Diagnosis:**
```bash
# Run TypeScript checker
npx tsc --noEmit

# Check for import errors
# Verify all imported components exist
```

**Solution:**
```bash
# Fix TypeScript errors one by one
# Common fixes:

# 1. Missing type annotations
const handleClick = (event: React.MouseEvent) => {}

# 2. Incorrect imports
import type { Founder } from '../data/store';

# 3. Unused variables
// Remove or use the variable

# After fixes, rebuild:
npm run build
```

---

### **Issue 7: Data Not Persisting**

**Symptoms:**
- Changes save but disappear after refresh
- Database seems empty after restart

**Diagnosis:**
```javascript
// Check if using SQLite in-memory mode
// backend/database.js

// Problem: In-memory database loses data on restart
const db = new SQL.Database(); // In-memory

// Solution: Use file-based or PostgreSQL
```

**Solution for Development:**
```javascript
// Use file-based SQLite
const fs = require('fs');
const dbPath = path.join(__dirname, 'tasnim.db');

let db;
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
  // Initialize schema
}

// Save on changes
const saveDatabase = () => {
  const data = db.export();
  fs.writeFileSync(dbPath, data);
};
```

---

### **Issue 8: Chatbot Not Responding**

**Symptoms:**
- Chat messages send but no response
- "Failed to get response" error

**Diagnosis:**
```javascript
// Check backend/routes/chatbot.js exists
// Verify route is registered in server.js
app.use('/api/chatbot', require('./routes/chatbot'));

// Check API endpoint
fetch('http://localhost:3000/api/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test' })
});
```

**Solution:**
```javascript
// Ensure chatbot route exists and is properly configured
// backend/routes/chatbot.js should have POST /chat endpoint

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Your chatbot logic here
    const response = generateResponse(message);
    
    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});
```

---

## 🛠️ Debugging Tools & Commands

### **Frontend Debugging**

```bash
# Start development server with console
npm run dev

# Build and check for errors
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Clear node_modules and reinstall
rd /s /q node_modules
npm install
```

### **Backend Debugging**

```bash
# Start backend with logs
cd backend
npm start

# Check environment variables
echo %PORT%
echo %DATABASE_URL%
echo %CORS_ORIGIN%

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/founders

# Check database file
dir tasnim.db

# View backend logs
# Logs appear in terminal where npm start is running
```

### **Database Debugging**

```javascript
// Add debug logging to database.js
console.log('Database mode:', usePg ? 'PostgreSQL' : 'SQLite');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Log query results
const result = await pool.query('SELECT * FROM founders');
console.log('Query result:', result.rows);

// Check table schema
const tables = await pool.query(`
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public'
`);
console.log('Available tables:', tables.rows);
```

---

## 🔥 Emergency Fixes

### **Frontend Won't Start**
```bash
# 1. Clear cache and restart
rd /s /q node_modules .vite
npm install
npm run dev

# 2. Check port availability
netstat -ano | findstr :5173

# 3. Kill process using port (if needed)
taskkill /PID <PID> /F
```

### **Backend Won't Start**
```bash
cd backend

# 1. Check syntax errors
node server.js

# 2. Reinstall dependencies
rd /s /q node_modules
npm install

# 3. Reset database
del tasnim.db
npm start
```

### **Complete Reset (Nuclear Option)**
```bash
# Stop all running processes
# Clear everything and start fresh

# Frontend
rd /s /q node_modules .vite dist
npm install
npm run dev

# Backend  
cd backend
rd /s /q node_modules
del tasnim.db
npm install
npm start
```

---

## 📊 Monitoring & Logging

### **Add Debug Logging**

```typescript
// Frontend (AdminContext.tsx)
const fetchFounders = async () => {
  console.log('[DEBUG] Fetching founders...');
  console.log('[DEBUG] API URL:', `${API_BASE_URL}/founders`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/founders`);
    console.log('[DEBUG] Response status:', response.status);
    
    const data = await response.json();
    console.log('[DEBUG] Founders data:', data);
    
    setFounders(data);
  } catch (error) {
    console.error('[ERROR] Failed to fetch founders:', error);
  }
};
```

```javascript
// Backend (routes/founders.js)
router.get('/', async (req, res) => {
  console.log('[DEBUG] GET /api/founders called');
  
  try {
    const result = await pool.query('SELECT * FROM founders');
    console.log('[DEBUG] Found', result.rows.length, 'founders');
    
    res.json(result.rows);
  } catch (error) {
    console.error('[ERROR] Database query failed:', error);
    res.status(500).json({ error: 'Failed to fetch founders' });
  }
});
```

---

## 🎯 Step-by-Step Debug Process

### **For API Issues:**

1. **Check backend is running**
   ```bash
   # Terminal should show: "Server running on port 3000"
   ```

2. **Test endpoint directly**
   ```bash
   curl http://localhost:3000/api/founders
   # or visit in browser
   ```

3. **Check network tab in browser**
   - Open DevTools → Network tab
   - Look for failed requests (red)
   - Check request URL and response

4. **Verify CORS settings**
   - Check backend/.env CORS_ORIGIN
   - Restart backend after changes

5. **Check database connection**
   - Verify DATABASE_URL in .env
   - Check backend logs for connection errors

---

This guide covers 95% of common issues. For new issues, add them here after resolution!