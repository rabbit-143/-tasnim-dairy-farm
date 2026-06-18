const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all gallery items
router.get('/', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM gallery ORDER BY date DESC').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// POST new gallery item
router.post('/', (req, res) => {
  try {
    const { title, category, image, date } = req.body;
    
    if (!title || !category || !image || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery (title, category, image, date)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, category, image, date);
    
    const newItem = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// DELETE gallery item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    stmt.run(id);
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
