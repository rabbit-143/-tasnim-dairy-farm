const express = require('express');
const router = express.Router();
const { getDb, save } = require('../database');

// GET settings
router.get('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
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
      save();
      
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
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const { siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission, visitors } = req.body;

    const missionJson = JSON.stringify(mission || []);
    
    db.run(
      `UPDATE settings SET siteName = ?, tagline = ?, phone = ?, email = ?, address = ?, mapEmbed = ?, facebook = ?, instagram = ?, whatsapp = ?, youtube = ?, linkedin = ?, aboutContent = ?, vision = ?, mission = ?, visitors = ? WHERE id = 1`,
      [siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, missionJson, visitors]
    );
    
    save();
    
    const result = db.exec('SELECT * FROM settings WHERE id = 1');
    const row = result[0].values[0];
    
    const updated = {
      id: row[0], siteName: row[1], tagline: row[2], phone: row[3], email: row[4], address: row[5],
      mapEmbed: row[6], facebook: row[7], instagram: row[8], whatsapp: row[9], youtube: row[10],
      linkedin: row[11], aboutContent: row[12], vision: row[13], mission: JSON.parse(row[14] || '[]'), visitors: row[15]
    };
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
