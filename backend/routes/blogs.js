const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all blogs
router.get('/', (req, res) => {
  try {
    const blogs = db.prepare('SELECT * FROM blogs ORDER BY date DESC').all();
    
    // Convert featured from 0/1 to boolean
    const blogsWithBoolean = blogs.map(blog => ({
      ...blog,
      featured: blog.featured === 1
    }));
    
    res.json(blogsWithBoolean);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// POST new blog
router.post('/', (req, res) => {
  try {
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;
    
    if (!title || !category || !excerpt || !content || !date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const stmt = db.prepare(`
      INSERT INTO blogs (title, category, excerpt, content, date, image, seoTitle, metaDescription, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title, 
      category, 
      excerpt, 
      content, 
      date, 
      image || null, 
      seoTitle || '', 
      metaDescription || '', 
      featured ? 1 : 0
    );
    
    const newBlog = db.prepare('SELECT * FROM blogs WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...newBlog,
      featured: newBlog.featured === 1
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// PUT update blog
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;
    
    const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const stmt = db.prepare(`
      UPDATE blogs 
      SET title = ?, category = ?, excerpt = ?, content = ?, date = ?, 
          image = ?, seoTitle = ?, metaDescription = ?, featured = ?
      WHERE id = ?
    `);
    
    stmt.run(
      title, 
      category, 
      excerpt, 
      content, 
      date, 
      image || null, 
      seoTitle || '', 
      metaDescription || '', 
      featured ? 1 : 0, 
      id
    );
    
    const updated = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
    
    res.json({
      ...updated,
      featured: updated.featured === 1
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE blog
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const stmt = db.prepare('DELETE FROM blogs WHERE id = ?');
    stmt.run(id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
