const express = require('express');
const router = express.Router();
const { getDb, save, getById, existsById, deleteById } = require('../database');

function parseBlogRow(row) {
  return {
    id: row[0],
    title: row[1],
    category: row[2],
    excerpt: row[3],
    content: row[4],
    date: row[5],
    image: row[6],
    seoTitle: row[7],
    metaDescription: row[8],
    featured: Boolean(row[9])
  };
}

// GET all blogs
router.get('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM blogs ORDER BY date DESC');
    if (result.length === 0 || result[0].values.length === 0) return res.json([]);
    res.json(result[0].values.map(parseBlogRow));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// POST new blog
router.post('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'Title and category are required' });

    db.run(
      'INSERT INTO blogs (title, category, excerpt, content, date, image, seoTitle, metaDescription, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category, excerpt || '', content || '', date || new Date().toISOString().split('T')[0],
      image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0]
    );
    save();

    const result = db.exec('SELECT MAX(id) as lastId FROM blogs');
    const lastId = result[0].values[0][0];
    const itemResult = getById('blogs', lastId);
    if (itemResult.length === 0 || itemResult[0].values.length === 0)
      return res.status(500).json({ error: 'Failed to retrieve created blog' });

    res.status(201).json(parseBlogRow(itemResult[0].values[0]));
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// PUT update blog
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;

    if (!existsById('blogs', id)) return res.status(404).json({ error: 'Blog not found' });

    db.run(
      'UPDATE blogs SET title = ?, category = ?, excerpt = ?, content = ?, date = ?, image = ?, seoTitle = ?, metaDescription = ?, featured = ? WHERE id = ?',
      [title, category, excerpt, content, date, image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0, id]
    );
    save();

    const result = getById('blogs', id);
    res.json(parseBlogRow(result[0].values[0]));
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE blog
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;

    if (!existsById('blogs', id)) return res.status(404).json({ error: 'Blog not found' });

    deleteById('blogs', id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
