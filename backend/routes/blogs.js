const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// GET all blogs
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM blogs ORDER BY date DESC');
      const blogs = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        excerpt: row.excerpt,
        content: row.content,
        date: row.date,
        image: row.image,
        seoTitle: row.seotitle,
        metaDescription: row.metadescription,
        featured: Boolean(row.featured)
      }));
      res.json(blogs);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM blogs ORDER BY date DESC');
        if (result.length > 0 && result[0].values.length > 0) {
          const blogs = result[0].values.map(row => ({
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
          }));
          res.json(blogs);
        } else {
          res.json([]);
        }
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch blogs' });
      }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET single blog
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usePg) {
      const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
      const blog = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        category: result.rows[0].category,
        excerpt: result.rows[0].excerpt,
        content: result.rows[0].content,
        date: result.rows[0].date,
        image: result.rows[0].image,
        seoTitle: result.rows[0].seotitle,
        metaDescription: result.rows[0].metadescription,
        featured: Boolean(result.rows[0].featured)
      };
      res.json(blog);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM blogs WHERE id = ?', [id]);
        if (result.length === 0 || result[0].values.length === 0) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        const row = result[0].values[0];
        const blog = {
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
        res.json(blog);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch blog' });
      }
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// POST new blog
router.post('/', async (req, res) => {
  try {
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;
    if (!title || !category) return res.status(400).json({ error: 'Title and category are required' });

    const blogDate = date || new Date().toISOString().split('T')[0];

    if (usePg) {
      const result = await pool.query(
        'INSERT INTO blogs (title, category, excerpt, content, date, image, seoTitle, metaDescription, featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [title, category, excerpt || '', content || '', blogDate, image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0]
      );
      const blog = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        category: result.rows[0].category,
        excerpt: result.rows[0].excerpt,
        content: result.rows[0].content,
        date: result.rows[0].date,
        image: result.rows[0].image,
        seoTitle: result.rows[0].seotitle,
        metaDescription: result.rows[0].metadescription,
        featured: Boolean(result.rows[0].featured)
      };
      res.status(201).json(blog);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          'INSERT INTO blogs (title, category, excerpt, content, date, image, seoTitle, metaDescription, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [title, category, excerpt || '', content || '', blogDate, image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0]
        );
        saveSQLite();
        
        const result = db.exec('SELECT MAX(id) as lastId FROM blogs');
        const lastId = result[0].values[0][0];
        const itemResult = db.exec('SELECT * FROM blogs WHERE id = ?', [lastId]);
        
        if (itemResult.length === 0 || itemResult[0].values.length === 0) {
          return res.status(500).json({ error: 'Failed to retrieve created blog' });
        }
        
        const row = itemResult[0].values[0];
        const blog = {
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
        res.status(201).json(blog);
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        res.status(500).json({ error: 'Failed to create blog' });
      }
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// PUT update blog
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, excerpt, content, date, image, seoTitle, metaDescription, featured } = req.body;

    if (usePg) {
      const result = await pool.query(
        'UPDATE blogs SET title = $1, category = $2, excerpt = $3, content = $4, date = $5, image = $6, seoTitle = $7, metaDescription = $8, featured = $9 WHERE id = $10 RETURNING *',
        [title, category, excerpt, content, date, image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
      const blog = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        category: result.rows[0].category,
        excerpt: result.rows[0].excerpt,
        content: result.rows[0].content,
        date: result.rows[0].date,
        image: result.rows[0].image,
        seoTitle: result.rows[0].seotitle,
        metaDescription: result.rows[0].metadescription,
        featured: Boolean(result.rows[0].featured)
      };
      res.json(blog);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if blog exists
        const checkResult = db.exec('SELECT id FROM blogs WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        db.run(
          'UPDATE blogs SET title = ?, category = ?, excerpt = ?, content = ?, date = ?, image = ?, seoTitle = ?, metaDescription = ?, featured = ? WHERE id = ?',
          [title, category, excerpt, content, date, image || null, seoTitle || '', metaDescription || '', featured ? 1 : 0, id]
        );
        saveSQLite();

        const result = db.exec('SELECT * FROM blogs WHERE id = ?', [id]);
        const row = result[0].values[0];
        const blog = {
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
        res.json(blog);
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        res.status(500).json({ error: 'Failed to update blog' });
      }
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// DELETE blog
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (usePg) {
      const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if blog exists
        const checkResult = db.exec('SELECT id FROM blogs WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        db.run('DELETE FROM blogs WHERE id = ?', [id]);
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite delete error:', sqliteErr);
        res.status(500).json({ error: 'Failed to delete blog' });
      }
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
