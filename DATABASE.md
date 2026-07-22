# 🗄️ Database Documentation - Tasnim Dairy Farm

## 🎯 Database Architecture

### **Dual Database System**
```
Development: SQLite (File-based, no external dependencies)
Production: PostgreSQL (Cloud-hosted on Neon)
```

### **Why Two Databases?**
- **SQLite**: Fast local development, no setup required, pure JavaScript
- **PostgreSQL**: Production-grade, scalable, cloud-hosted, ACID compliant

---

## 📊 Database Schema

### **Table 1: founders**
```sql
CREATE TABLE founders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  responsibilities TEXT, -- JSON array as text
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store leadership team information  
**Access**: Public read, Admin write  
**Example Data**:
```json
{
  "id": 1,
  "name": "Mobasshera Sultana",
  "role": "Founder & CEO",
  "responsibilities": ["Strategic Leadership", "Farm Management"],
  "image": "/uploads/founder-1.jpg",
  "created_at": "2026-02-14T10:00:00Z"
}
```

---

### **Table 2: blogs**
```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  excerpt TEXT,
  content TEXT NOT NULL,
  date DATE,
  image TEXT,
  seo_title VARCHAR(255),
  meta_description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store blog posts and articles  
**Access**: Public read, Admin write  
**Indexes**: `featured`, `category`, `date`  
**Example Data**:
```json
{
  "id": 1,
  "title": "The Journey of Pure Milk",
  "category": "Farm Story",
  "excerpt": "How we ensure quality...",
  "content": "Full article content...",
  "date": "2026-03-15",
  "image": "/uploads/blog-1.jpg",
  "featured": true
}
```

---

### **Table 3: gallery**
```sql
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  category VARCHAR(100),
  image TEXT NOT NULL,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store farm photos and images  
**Access**: Public read, Admin write  
**Categories**: "Farm Images", "Cattle Images", "Product Images", "Event Photos"  
**Example Data**:
```json
{
  "id": 1,
  "title": "Morning Milking Session",
  "category": "Farm Images",
  "image": "/uploads/gallery-1.jpg",
  "date": "2026-02-14"
}
```

---

### **Table 4: careers**
```sql
CREATE TABLE careers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  vacancy INTEGER DEFAULT 1,
  deadline DATE,
  requirements TEXT, -- JSON array as text
  apply_email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store job postings  
**Access**: Public read, Admin write  
**Example Data**:
```json
{
  "id": 1,
  "title": "Dairy Farm Supervisor",
  "department": "Operations",
  "vacancy": 2,
  "deadline": "2026-07-31",
  "requirements": ["3+ years experience", "Knowledge of cattle"],
  "apply_email": "careers@tasnimdairyfarm.com",
  "active": true
}
```

---

### **Table 5: contact_messages**
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store customer inquiries from contact form  
**Access**: Admin only  
**Example Data**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880 1234-567890",
  "subject": "Bulk Order Inquiry",
  "message": "I want to order 100 liters per week...",
  "is_read": false,
  "created_at": "2026-05-01T10:30:00Z"
}
```

---

### **Table 6: settings**
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY,
  site_name VARCHAR(255),
  tagline VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  map_embed TEXT,
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  whatsapp VARCHAR(255),
  youtube VARCHAR(255),
  linkedin VARCHAR(255),
  about_content TEXT,
  vision TEXT,
  mission TEXT, -- JSON array as text
  visitors INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Store site-wide configuration  
**Access**: Public read, Admin write  
**Note**: Single row table (id always = 1)  
**Example Data**:
```json
{
  "id": 1,
  "site_name": "Tasnim Dairy Farm",
  "tagline": "Pure Milk, Pure Promise",
  "phone": "+880 1700-000000",
  "email": "info@tasnimdairyfarm.com",
  "address": "Tasnim Dairy Farm Complex, Dhaka",
  "facebook": "https://facebook.com/tasnim-dairy-farm",
  "visitors": 10482
}
```

---

### **Table 7: growth_journey**
```sql
CREATE TABLE growth_journey (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER, -- 1-12
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  milestone_type VARCHAR(50), -- 'beginning', 'expansion', 'achievement'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose**: Track company milestones and growth story  
**Access**: Public read, Admin write  
**Example Data**:
```json
{
  "id": 1,
  "year": 2026,
  "month": 2,
  "title": "Farm Establishment",
  "description": "Started with 10 cows...",
  "image": "/uploads/beginning.jpg",
  "milestone_type": "beginning"
}
```

---

## 🔄 Database Connection Management

### **Development (SQLite)**
```javascript
const SQL = require('sql.js');
const fs = require('fs');
const path = require('path');

// File-based SQLite
const dbPath = path.join(__dirname, 'tasnim.db');

let db;
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
  initializeSchema();
}

// Save changes to file
const saveDatabase = () => {
  const data = db.export();
  fs.writeFileSync(dbPath, data);
};
```

### **Production (PostgreSQL)**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Connected to PostgreSQL');
  }
});
```

---

## 🔧 Common Database Operations

### **Query Patterns**

#### **SELECT - Get All Records**
```javascript
// PostgreSQL
const result = await pool.query('SELECT * FROM founders ORDER BY created_at DESC');
const founders = result.rows;

// SQLite
const stmt = db.prepare('SELECT * FROM founders ORDER BY created_at DESC');
const founders = [];
while (stmt.step()) {
  founders.push(stmt.getAsObject());
}
stmt.free();
```

#### **SELECT - Get Single Record**
```javascript
// PostgreSQL
const result = await pool.query('SELECT * FROM founders WHERE id = $1', [founderId]);
const founder = result.rows[0];

// SQLite
const stmt = db.prepare('SELECT * FROM founders WHERE id = ?');
stmt.bind([founderId]);
const founder = stmt.step() ? stmt.getAsObject() : null;
stmt.free();
```

#### **INSERT - Create New Record**
```javascript
// PostgreSQL
const result = await pool.query(
  'INSERT INTO founders (name, role, responsibilities, image) VALUES ($1, $2, $3, $4) RETURNING *',
  [name, role, JSON.stringify(responsibilities), image]
);
const newFounder = result.rows[0];

// SQLite
db.run(
  'INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)',
  [name, role, JSON.stringify(responsibilities), image]
);
saveDatabase();
```

#### **UPDATE - Modify Record**
```javascript
// PostgreSQL
const result = await pool.query(
  'UPDATE founders SET name = $1, role = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
  [name, role, founderId]
);

// SQLite
db.run(
  'UPDATE founders SET name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  [name, role, founderId]
);
saveDatabase();
```

#### **DELETE - Remove Record**
```javascript
// PostgreSQL
await pool.query('DELETE FROM founders WHERE id = $1', [founderId]);

// SQLite
db.run('DELETE FROM founders WHERE id = ?', [founderId]);
saveDatabase();
```

---

## 🛡️ Data Integrity & Validation

### **Required Field Validation**
```javascript
const validateFounder = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.role || data.role.trim() === '') {
    errors.push('Role is required');
  }
  
  if (!Array.isArray(data.responsibilities)) {
    errors.push('Responsibilities must be an array');
  }
  
  return errors;
};

// Use in route handler
const errors = validateFounder(req.body);
if (errors.length > 0) {
  return res.status(400).json({ error: errors.join(', ') });
}
```

### **SQL Injection Prevention**
```javascript
// ✅ ALWAYS use parameterized queries
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);

// ❌ NEVER concatenate user input
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${userEmail}'` // DANGEROUS!
);
```

---

## 📈 Database Performance

### **Indexing Strategy**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_blogs_featured ON blogs(featured);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_date ON blogs(date DESC);
CREATE INDEX idx_careers_active ON careers(active);
CREATE INDEX idx_contact_is_read ON contact_messages(is_read);
```

### **Query Optimization**
```javascript
// ❌ BAD: Fetching all data when only need subset
const allBlogs = await pool.query('SELECT * FROM blogs');
const featuredBlogs = allBlogs.rows.filter(blog => blog.featured);

// ✅ GOOD: Filter in database
const result = await pool.query('SELECT * FROM blogs WHERE featured = true');
const featuredBlogs = result.rows;
```

---

## 🔄 Backup & Recovery

### **Manual Backup (Development)**
```bash
# SQLite: Simply copy the database file
copy backend\tasnim.db backend\tasnim-backup-2026-05-01.db
```

### **Automated Backup (Production)**
```bash
# PostgreSQL: Use pg_dump
pg_dump -h host -U username -d database_name -F c -f backup.dump

# Restore from backup
pg_restore -h host -U username -d database_name backup.dump
```

### **Neon Automatic Backups**
- Daily automatic backups
- Point-in-time recovery available
- Access backups from Neon dashboard

---

## 🔍 Troubleshooting

### **Issue: Database connection timeout**
```javascript
// Solution: Increase connection timeout
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000, // Increase from 2000
});
```

### **Issue: Too many connections**
```javascript
// Solution: Reduce max pool size or close unused connections
const pool = new Pool({
  max: 10, // Reduce from 20
  idleTimeoutMillis: 10000 // Close idle connections faster
});
```

### **Issue: SQLite database locked**
```javascript
// Solution: Ensure database.saveDatabase() is called after writes
db.run('UPDATE ...', [params]);
saveDatabase(); // Don't forget this!
```

---

This database documentation ensures all engineers understand the data structure and can work efficiently with both development and production databases.