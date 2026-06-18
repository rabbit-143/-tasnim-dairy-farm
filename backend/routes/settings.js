const express = require('express');
const router = express.Router();
const db = require('../database');

// GET settings
router.get('/', (req, res) => {
  try {
    let settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    
    if (!settings) {
      // Insert default settings if not exists
      const stmt = db.prepare(`
        INSERT INTO settings (
          id, siteName, tagline, phone, email, address, mapEmbed,
          facebook, instagram, whatsapp, youtube, linkedin,
          aboutContent, vision, mission, visitors
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
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
        JSON.stringify([
          'Produce healthy and pure milk',
          'Maintain the highest farm hygiene standards',
          'Ensure animal welfare and ethical treatment'
        ]),
        10482
      );
      
      settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    }
    
    // Parse mission JSON
    const settingsWithParsedData = {
      ...settings,
      mission: JSON.parse(settings.mission || '[]')
    };
    
    res.json(settingsWithParsedData);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', (req, res) => {
  try {
    const {
      siteName, tagline, phone, email, address, mapEmbed,
      facebook, instagram, whatsapp, youtube, linkedin,
      aboutContent, vision, mission, visitors
    } = req.body;

    const missionJson = JSON.stringify(mission || []);
    
    const stmt = db.prepare(`
      UPDATE settings 
      SET siteName = ?, tagline = ?, phone = ?, email = ?, address = ?, mapEmbed = ?,
          facebook = ?, instagram = ?, whatsapp = ?, youtube = ?, linkedin = ?,
          aboutContent = ?, vision = ?, mission = ?, visitors = ?
      WHERE id = 1
    `);
    
    stmt.run(
      siteName, tagline, phone, email, address, mapEmbed,
      facebook, instagram, whatsapp, youtube, linkedin,
      aboutContent, vision, missionJson, visitors
    );
    
    const updated = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    
    res.json({
      ...updated,
      mission: JSON.parse(updated.mission || '[]')
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
