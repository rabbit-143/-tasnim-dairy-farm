const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// GET settings
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM settings WHERE id = 1');
      
      if (result.rows.length === 0) {
        // Insert default settings
        const defaultSettings = await pool.query(
          `INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
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
        const settings = {
          id: defaultSettings.rows[0].id,
          siteName: defaultSettings.rows[0].sitename,
          tagline: defaultSettings.rows[0].tagline,
          phone: defaultSettings.rows[0].phone,
          email: defaultSettings.rows[0].email,
          address: defaultSettings.rows[0].address,
          mapEmbed: defaultSettings.rows[0].mapembed,
          facebook: defaultSettings.rows[0].facebook,
          instagram: defaultSettings.rows[0].instagram,
          whatsapp: defaultSettings.rows[0].whatsapp,
          youtube: defaultSettings.rows[0].youtube,
          linkedin: defaultSettings.rows[0].linkedin,
          aboutContent: defaultSettings.rows[0].aboutcontent,
          vision: defaultSettings.rows[0].vision,
          mission: JSON.parse(defaultSettings.rows[0].mission || '[]'),
          visitors: defaultSettings.rows[0].visitors
        };
        return res.json(settings);
      }
      
      const settings = {
        id: result.rows[0].id,
        siteName: result.rows[0].sitename,
        tagline: result.rows[0].tagline,
        phone: result.rows[0].phone,
        email: result.rows[0].email,
        address: result.rows[0].address,
        mapEmbed: result.rows[0].mapembed,
        facebook: result.rows[0].facebook,
        instagram: result.rows[0].instagram,
        whatsapp: result.rows[0].whatsapp,
        youtube: result.rows[0].youtube,
        linkedin: result.rows[0].linkedin,
        aboutContent: result.rows[0].aboutcontent,
        vision: result.rows[0].vision,
        mission: JSON.parse(result.rows[0].mission || '[]'),
        visitors: result.rows[0].visitors
      };
      res.json(settings);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM settings WHERE id = 1');
        
        if (result.length === 0 || result[0].values.length === 0) {
          // Insert default settings
          db.run(
            `INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [1, 'Tasnim Dairy Farm', 'Pure Milk, Pure Promise', '+880 1700-000000', 'info@tasnimdairyfarm.com',
            'Tasnim Dairy Farm Complex, Dhaka, Bangladesh', '', 'https://facebook.com', 'https://instagram.com',
            'https://wa.me/8801700000000', 'https://youtube.com', 'https://linkedin.com',
            'Tasnim Dairy Farm was established on 14 February 2026...', 'To become one of the most trusted dairy farms in Bangladesh...',
            JSON.stringify(['Produce healthy and pure milk', 'Maintain the highest farm hygiene standards', 'Ensure animal welfare and ethical treatment']),
            10482]
          );
          saveSQLite();
          
          const newResult = db.exec('SELECT * FROM settings WHERE id = 1');
          const row = newResult[0].values[0];
          
          const settings = {
            id: row[0], siteName: row[1], tagline: row[2], phone: row[3], email: row[4], address: row[5],
            mapEmbed: row[6], facebook: row[7], instagram: row[8], whatsapp: row[9], youtube: row[10],
            linkedin: row[11], aboutContent: row[12], vision: row[13], mission: JSON.parse(row[14] || '[]'), visitors: row[15]
          };
          
          return res.json(settings);
        }
        
        const row = result[0].values[0];
        const settings = {
          id: row[0], siteName: row[1], tagline: row[2], phone: row[3], email: row[4], address: row[5],
          mapEmbed: row[6], facebook: row[7], instagram: row[8], whatsapp: row[9], youtube: row[10],
          linkedin: row[11], aboutContent: row[12], vision: row[13], mission: JSON.parse(row[14] || '[]'), visitors: row[15]
        };
        
        res.json(settings);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch settings' });
      }
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  try {
    const { siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors } = req.body;
    const missionJson = JSON.stringify(mission || []);
    
    if (usePg) {
      const result = await pool.query(
        `UPDATE settings SET siteName = $1, tagline = $2, phone = $3, email = $4, address = $5, mapEmbed = $6, facebook = $7, instagram = $8, whatsapp = $9, youtube = $10, linkedin = $11, aboutContent = $12, vision = $13, mission = $14, visitors = $15 WHERE id = 1 RETURNING *`,
        [siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, missionJson, visitors]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      
      const settings = {
        id: result.rows[0].id,
        siteName: result.rows[0].sitename,
        tagline: result.rows[0].tagline,
        phone: result.rows[0].phone,
        email: result.rows[0].email,
        address: result.rows[0].address,
        mapEmbed: result.rows[0].mapembed,
        facebook: result.rows[0].facebook,
        instagram: result.rows[0].instagram,
        whatsapp: result.rows[0].whatsapp,
        youtube: result.rows[0].youtube,
        linkedin: result.rows[0].linkedin,
        aboutContent: result.rows[0].aboutcontent,
        vision: result.rows[0].vision,
        mission: JSON.parse(result.rows[0].mission || '[]'),
        visitors: result.rows[0].visitors
      };
      res.json(settings);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          `UPDATE settings SET siteName = ?, tagline = ?, phone = ?, email = ?, address = ?, mapEmbed = ?, facebook = ?, instagram = ?, whatsapp = ?, youtube = ?, linkedin = ?, aboutContent = ?, vision = ?, mission = ?, visitors = ? WHERE id = 1`,
          [siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, missionJson, visitors]
        );
        saveSQLite();
        
        const result = db.exec('SELECT * FROM settings WHERE id = 1');
        if (result.length === 0 || result[0].values.length === 0) {
          return res.status(404).json({ error: 'Settings not found' });
        }
        
        const row = result[0].values[0];
        const updated = {
          id: row[0], siteName: row[1], tagline: row[2], phone: row[3], email: row[4], address: row[5],
          mapEmbed: row[6], facebook: row[7], instagram: row[8], whatsapp: row[9], youtube: row[10],
          linkedin: row[11], aboutContent: row[12], vision: row[13], mission: JSON.parse(row[14] || '[]'), visitors: row[15]
        };
        
        res.json(updated);
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        res.status(500).json({ error: 'Failed to update settings' });
      }
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
