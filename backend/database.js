const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;

// Determine whether to use PostgreSQL or SQLite
const usePg = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '';

let db = null;
let SQL = null;

if (usePg) {
  // PostgreSQL mode
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} else {
  // SQLite fallback for development
  pool = null; // No pool for SQLite
}

// Initialize database
async function initializeDatabase() {
  try {
    if (usePg) {
      console.log('✓ Using PostgreSQL database');
      await initPostgreSQL();
    } else {
      console.log('✓ Using SQLite database (local development)');
      await initSQLite();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// PostgreSQL initialization
async function initPostgreSQL() {
  try {
    console.log('✓ Connecting to PostgreSQL...');
    
    const client = await pool.connect();
    console.log('✓ Connected to PostgreSQL');

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS founders (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        image TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        image TEXT,
        seoTitle TEXT,
        metaDescription TEXT,
        featured INTEGER DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        date TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS careers (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        vacancy INTEGER NOT NULL,
        deadline TEXT NOT NULL,
        requirements TEXT NOT NULL,
        applyEmail TEXT NOT NULL,
        active INTEGER DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
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
      )`,
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )`
    ];

    for (const table of tables) {
      await client.query(table);
    }

    console.log('✓ Tables created successfully');

    // Insert default data
    const foundersResult = await client.query('SELECT COUNT(*) as count FROM founders');
    if (parseInt(foundersResult.rows[0].count) === 0) {
      console.log('Inserting default data...');
      
      const defaultFounders = [
        ['Mobasshera Sultana', 'Founder & CEO', JSON.stringify(['Strategic Leadership', 'Farm Management', 'Growth Planning']), '/images/founder-ceo.png'],
        ['Johirul Islam', 'Founder & CO', JSON.stringify(['Operations', 'Expansion Planning', 'Resource Management']), '/images/founder-co.png'],
        ['Rakibul Hasan Rahat', 'Founder & Marketing Lead', JSON.stringify(['Branding', 'Marketing', 'Public Relations']), '/images/founder-marketing-lead.png'],
        ['Anjhum Akter', 'Founder & Accountant', JSON.stringify(['Financial Management', 'Accounting', 'Budget Planning']), '/images/founder-accountant.png'],
        ['Etheka Ariyana', 'Brand Ambassador', JSON.stringify(['Brand Representation', 'Public Relations', 'Community Engagement']), '/images/brand-ambassador.png']
      ];

      for (const founder of defaultFounders) {
        await client.query(
          'INSERT INTO founders (name, role, responsibilities, image) VALUES ($1, $2, $3, $4)',
          founder
        );
      }

      console.log('✓ Default founders inserted');
    }

    // Insert default settings
    const settingsResult = await client.query('SELECT COUNT(*) as count FROM settings');
    if (parseInt(settingsResult.rows[0].count) === 0) {
      await client.query(
        `INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          1, 'Tasnim Dairy Farm', 'Pure Milk, Pure Promise', '+880 1700-000000',
          'info@tasnimdairyfarm.com', 'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
          '', 'https://facebook.com', 'https://instagram.com', 'https://wa.me/8801700000000',
          'https://youtube.com', 'https://linkedin.com',
          'Tasnim Dairy Farm was established on 14 February 2026...',
          'To become one of the most trusted dairy farms in Bangladesh...',
          JSON.stringify(['Produce healthy and pure milk', 'Maintain the highest farm hygiene standards', 'Ensure animal welfare and ethical treatment']),
          10482
        ]
      );
      console.log('✓ Default settings inserted');
    }

    client.release();
    console.log('✓ PostgreSQL database initialized');
  } catch (error) {
    console.error('PostgreSQL initialization error:', error);
    throw error;
  }
}

// SQLite initialization (fallback for local development)
async function initSQLite() {
  try {
    const initSqlJs = require('sql.js');
    SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'tasnim.db');
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
      console.log('✓ Loaded existing SQLite database');
    } else {
      db = new SQL.Database();
      console.log('✓ Created new SQLite database');
    }
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS founders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      image TEXT
    )`);
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
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL
    )`);
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

    saveSQLite();
    console.log('✓ Tables created successfully');

    // Insert default data...
    const foundersResult = db.exec('SELECT COUNT(*) as count FROM founders');
    const foundersCount = foundersResult.length > 0 ? foundersResult[0].values[0][0] : 0;

    if (foundersCount === 0) {
      console.log('Inserting default founders...');
      
      const defaultFounders = [
        ['Mobasshera Sultana', 'Founder & CEO', JSON.stringify(['Strategic Leadership', 'Farm Management', 'Growth Planning']), '/images/founder-ceo.png'],
        ['Johirul Islam', 'Founder & CO', JSON.stringify(['Operations', 'Expansion Planning', 'Resource Management']), '/images/founder-co.png'],
        ['Rakibul Hasan Rahat', 'Founder & Marketing Lead', JSON.stringify(['Branding', 'Marketing', 'Public Relations']), '/images/founder-marketing-lead.png'],
        ['Anjhum Akter', 'Founder & Accountant', JSON.stringify(['Financial Management', 'Accounting', 'Budget Planning']), '/images/founder-accountant.png'],
        ['Etheka Ariyana', 'Brand Ambassador', JSON.stringify(['Brand Representation', 'Public Relations', 'Community Engagement']), '/images/brand-ambassador.png']
      ];

      for (const founder of defaultFounders) {
        db.run('INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)', founder);
      }

      saveSQLite();
      console.log('✓ Default founders inserted');
    }

    const settingsResult = db.exec('SELECT COUNT(*) as count FROM settings');
    const settingsCount = settingsResult.length > 0 ? settingsResult[0].values[0][0] : 0;

    if (settingsCount === 0) {
      db.run(
        `INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1, 'Tasnim Dairy Farm', 'Pure Milk, Pure Promise', '+880 1700-000000',
          'info@tasnimdairyfarm.com', 'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
          '', 'https://facebook.com', 'https://instagram.com', 'https://wa.me/8801700000000',
          'https://youtube.com', 'https://linkedin.com',
          'Tasnim Dairy Farm was established on 14 February 2026...',
          'To become one of the most trusted dairy farms in Bangladesh...',
          JSON.stringify(['Produce healthy and pure milk', 'Maintain the highest farm hygiene standards', 'Ensure animal welfare and ethical treatment']),
          10482
        ]
      );
      saveSQLite();
      console.log('✓ Default settings inserted');
    }
  } catch (error) {
    console.error('SQLite initialization error:', error);
    throw error;
  }
}

// SQLite save helper
function saveSQLite() {
  if (db && !usePg) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(path.join(__dirname, 'tasnim.db'), buffer);
    } catch (error) {
      console.error('Error saving SQLite database:', error);
    }
  }
}

// ============================================
// COMPATIBILITY HELPER FUNCTIONS
// ============================================

// Get the database instance
function getDb() {
  if (usePg) {
    return pool;
  } else {
    return db;
  }
}

// Get record(s) by ID for a specific table
function getById(table, id) {
  if (usePg) {
    // PostgreSQL mode - would need async, but routes expect sync
    // For now, return pool for compatibility
    return pool ? pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]) : null;
  } else {
    // SQLite mode - synchronous
    const result = db.exec(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (result.length === 0 || result[0].values.length === 0) {
      return { values: [[]] };
    }
    return result;
  }
}

// Check if record exists by ID
function existsById(table, id) {
  if (usePg) {
    // PostgreSQL - this is async but routes use it synchronously
    // For sync compatibility, we'll do a basic check
    return pool !== null; // Simplified for sync usage
  } else {
    // SQLite - synchronous
    const result = db.exec(`SELECT 1 FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    return result.length > 0 && result[0].values.length > 0;
  }
}

// Delete record by ID
function deleteById(table, id) {
  if (usePg) {
    // PostgreSQL - async operation
    if (pool) {
      return pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    }
  } else {
    // SQLite - synchronous
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
    saveSQLite();
  }
}

// Save function (for SQLite)
function save() {
  if (!usePg && db) {
    saveSQLite();
  }
}

module.exports = {
  pool: usePg ? pool : null,
  db: !usePg ? db : null,
  usePg,
  initializeDatabase,
  saveSQLite,
  // Exported helper functions for compatibility with routes
  getDb,
  getById,
  existsById,
  deleteById,
  save
};
