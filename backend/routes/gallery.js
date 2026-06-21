const express = require('express');
const router = express.Router();
const { getDb, save, getById, existsById, deleteById } = require('../database');

function parseGalleryRow(row) {
  return { id: row[0], title: row[1], category: row[2], image: row[3], date: row[4] };
}

// GET all gallery items
router.get('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM gallery ORDER BY date DESC');
    if (result.length === 0 || result[0].values.length === 0) return res.json([]);
    res.json(result[0].values.map(parseGalleryRow));
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST new gallery item
router.post('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { title, category, image, date } = req.body;
    if (!title || !category || !image)
      return res.status(400).json({ error: 'Title, category, and image are required' });

    db.run(
      'INSERT INTO gallery (title, category, image, date) VALUES (?, ?, ?, ?)',
      [title, category, image, date || new Date().toISOString().split('T')[0]]
    );
    save();

    const result = db.exec('SELECT MAX(id) as lastId FROM gallery');
    const lastId = result[0].values[0][0];
    const itemResult = getById('gallery', lastId);
    if (itemResult.length === 0 || itemResult[0].values.length === 0)
      return res.status(500).json({ error: 'Failed to retrieve created item' });

    res.status(201).json(parseGalleryRow(itemResult[0].values[0]));
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// DELETE gallery item
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;

    if (!existsById('gallery', id)) return res.status(404).json({ error: 'Gallery item not found' });

    deleteById('gallery', id);
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
