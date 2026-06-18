const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database
const dbPath = path.join(__dirname, 'tasnim.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
function initDatabase() {
  console.log('Initializing database...');

  // Create Founders table
  db.run(`
    CREATE TABLE IF NOT EXISTS founders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      responsibilities TEXT NOT NULL,
      image TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating founders table:', err);
    } else {
      console.log('Founders table ready');
    }
  });

  // Create Blogs table
  db.run(`
    CREATE TABLE IF NOT EXISTS blogs (
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
    )
  `, (err) => {
    if (err) console.error('Error creating blogs table:', err);
  });

  // Create Gallery table
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `, (err) => {
    if (err) console.error('Error creating gallery table:', err);
  });

  // Create Careers table
  db.run(`
    CREATE TABLE IF NOT EXISTS careers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      vacancy INTEGER NOT NULL,
      deadline TEXT NOT NULL,
      requirements TEXT NOT NULL,
      applyEmail TEXT NOT NULL,
      active INTEGER DEFAULT 1
    )
  `, (err) => {
    if (err) console.error('Error creating careers table:', err);
  });

  // Create Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
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
    )
  `, (err) => {
    if (err) console.error('Error creating settings table:', err);
  });

  console.log('Database tables created successfully.');

  // Insert default founders if table is empty
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM founders', (err, row) => {
      if (err) {
        console.error('Error checking founders:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Inserting default founders...');
        
        const defaultFounders = [
          {
            id: 1,
            name: 'Mobasshera Sultana',
            role: 'Founder & CEO',
            responsibilities: JSON.stringify(['Strategic Leadership', 'Farm Management', 'Growth Planning']),
            image: '/images/Founder & CEO.png'
          },
          {
            id: 2,
            name: 'Johirul Islam',
            role: 'Founder & CO',
            responsibilities: JSON.stringify(['Operations', 'Expansion Planning', 'Resource Management']),
            image: '/images/Founder & CO.png'
          },
          {
            id: 3,
            name: 'Rakibul Hasan Rahat',
            role: 'Founder & Marketing Lead',
            responsibilities: JSON.stringify(['Branding', 'Marketing', 'Public Relations']),
            image: '/images/Founder & Marketing Lead.png'
          },
          {
            id: 4,
            name: 'Anjhum Akter',
            role: 'Founder & Accountant',
            responsibilities: JSON.stringify(['Financial Management', 'Accounting', 'Budget Planning']),
            image: '/images/Founder & Accountant.png'
          },
          {
            id: 5,
            name: 'Etheka Ariyana',
            role: 'Brand Ambassador',
            responsibilities: JSON.stringify(['Brand Representation', 'Public Relations', 'Community Engagement']),
            image: '/images/Brand Ambassador.png'
          }
        ];

        const stmt = db.prepare(`
          INSERT INTO founders (id, name, role, responsibilities, image)
          VALUES (?, ?, ?, ?, ?)
        `);

        defaultFounders.forEach(founder => {
          stmt.run(founder.id, founder.name, founder.role, founder.responsibilities, founder.image, (err) => {
            if (err) console.error('Error inserting founder:', err);
          });
        });

        stmt.finalize(() => {
          console.log('Default founders inserted successfully.');
        });
      }
    });
  }, 500);
}

// Initialize database on load
initDatabase();

module.exports = db;
