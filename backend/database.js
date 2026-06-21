const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'tasnim.db');
let db = null;
let SQL = null;

// Initialize SQL.js and database
const initializeDatabase = async () => {
  try {
    // Load sql.js
    SQL = await initSqlJs();
    
    // Load or create database
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
      console.log('✓ Loaded existing SQLite database');
    } else {
      db = new SQL.Database();
      console.log('✓ Created new SQLite database');
    }
    
    initTables();
    insertDefaultData();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Save database to disk
function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }
}

// Create all tables
function initTables() {
  if (!db) return;
  
  console.log('Initializing tables...');

  try {
    // Create Founders table
    db.run(`CREATE TABLE IF NOT EXISTS founders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      image TEXT
    )`);

    // Create Blogs table
    db.run(`CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT,
      seoTitle TEXT,
      metaDescription TEXT,
      featured INTEGER DEFAULT 0
    )`);

    // Create Gallery table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL
    )`);

    // Create Careers table
    db.run(`CREATE TABLE IF NOT EXISTS careers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      vacancy INTEGER NOT NULL,
      deadline TEXT NOT NULL,
      requirements TEXT NOT NULL,
      applyEmail TEXT NOT NULL,
      active INTEGER DEFAULT 1
    )`);

    // Create Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      siteName TEXT NOT NULL,
      tagline TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      mapEmbed TEXT,
      facebook TEXT,
      instagram TEXT,
      whatsapp TEXT,
      youtube TEXT,
      linkedin TEXT,
      aboutContent TEXT,
      vision TEXT,
      mission TEXT,
      visitors INTEGER DEFAULT 0
    )`);

    // Create Contact Messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )`);

    saveDatabase();
    console.log('✓ Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Insert default founders
function insertDefaultData() {
  if (!db) return;

  try {
    const result = db.exec('SELECT COUNT(*) as count FROM founders');
    const count = result.length > 0 ? result[0].values[0][0] : 0;

    if (count === 0) {
      console.log('Inserting default founders...');
      
      const defaultFounders = [
        {
          name: 'Mobasshera Sultana',
          role: 'Founder & CEO',
          responsibilities: JSON.stringify(['Strategic Leadership', 'Farm Management', 'Growth Planning']),
          image: '/images/founder-ceo.png'
        },
        {
          name: 'Johirul Islam',
          role: 'Founder & CO',
          responsibilities: JSON.stringify(['Operations', 'Expansion Planning', 'Resource Management']),
          image: '/images/founder-co.png'
        },
        {
          name: 'Rakibul Hasan Rahat',
          role: 'Founder & Marketing Lead',
          responsibilities: JSON.stringify(['Branding', 'Marketing', 'Public Relations']),
          image: '/images/founder-marketing-lead.png'
        },
        {
          name: 'Anjhum Akter',
          role: 'Founder & Accountant',
          responsibilities: JSON.stringify(['Financial Management', 'Accounting', 'Budget Planning']),
          image: '/images/founder-accountant.png'
        },
        {
          name: 'Etheka Ariyana',
          role: 'Brand Ambassador',
          responsibilities: JSON.stringify(['Brand Representation', 'Public Relations', 'Community Engagement']),
          image: '/images/brand-ambassador.png'
        }
      ];

      for (const founder of defaultFounders) {
        db.run(
          'INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)',
          [founder.name, founder.role, founder.responsibilities, founder.image]
        );
      }

      saveDatabase();
      console.log('✓ Default founders inserted');
    }

    // Insert default settings if empty
    const settingsResult = db.exec('SELECT COUNT(*) as count FROM settings');
    const settingsCount = settingsResult.length > 0 ? settingsResult[0].values[0][0] : 0;

    if (settingsCount === 0) {
      console.log('Inserting default settings...');
      
      db.run(
        `INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          'Tasnim Dairy Farm',
          'Pure Milk, Pure Promise',
          '+880 1700-000000',
          'info@tasnimdairyfarm.com',
          'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
          '',
          'https://facebook.com',
          'https://instagram.com',
          'https://wa.me/8801700000000',
          'https://youtube.com',
          'https://linkedin.com',
          'Tasnim Dairy Farm was established on 14 February 2026...',
          'To become one of the most trusted dairy farms in Bangladesh...',
          JSON.stringify(['Produce healthy and pure milk', 'Maintain the highest farm hygiene standards', 'Ensure animal welfare and ethical treatment']),
          10482
        ]
      );

      saveDatabase();
      console.log('✓ Default settings inserted');
    }
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}

// Parameterized query helper to prevent SQL injection
function getById(table, id) {
  if (!db) return [];
  const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
  stmt.bind([id]);
  const columns = [];
  const rows = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    if (columns.length === 0) columns.push(...Object.keys(row));
    rows.push(Object.values(row));
  }
  stmt.free();
  return rows.length > 0 ? [{ columns, values: rows }] : [];
}

function existsById(table, id) {
  if (!db) return false;
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE id = ?`);
  stmt.bind([id]);
  if (stmt.step()) {
    const result = stmt.getAsObject();
    stmt.free();
    return result.count > 0;
  }
  stmt.free();
  return false;
}

function deleteById(table, id) {
  if (!db) return;
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  save();
}

// Start database initialization and export promise for server to await
const initPromise = initializeDatabase();

module.exports = {
  getDb: () => db,
  save: saveDatabase,
  getById,
  existsById,
  deleteById,
  initPromise
};
