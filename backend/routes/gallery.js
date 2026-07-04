const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// GET all gallery items
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM gallery ORDER BY date DESC');
      res.json(result.rows);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM gallery ORDER BY date DESC');
        if (result.length > 0 && result[0].values.length > 0) {
          const gallery = result[0].values.map(row => ({
            id: row[0],
            title: row[1],
            category: row[2],
            image: row[3],
            date: row[4]
          }));
          res.json(gallery);
        } else {
          res.json([]);
        }
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch gallery' });
      }
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// GET single gallery item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usePg) {
      const result = await pool.query('SELECT * FROM gallery WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
      res.json(result.rows[0]);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM gallery WHERE id = ?', [id]);
        if (result.length === 0 || result[0].values.length === 0) {
          return res.status(404).json({ error: 'Gallery item not found' });
        }
        const row = result[0].values[0];
        const item = {
          id: row[0],
          title: row[1],
          category: row[2],
          image: row[3],
          date: row[4]
        };
        res.json(item);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch gallery item' });
      }
    }
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ error: 'Failed to fetch gallery item' });
  }
});

// POST new gallery item
router.post('/', async (req, res) => {
  try {
    const { title, category, image, date } = req.body;
    if (!title || !category || !image) {
      return res.status(400).json({ error: 'Title, category, and image are required' });
    }

    const itemDate = date || new Date().toISOString().split('T')[0];

    if (usePg) {
      const result = await pool.query(
        'INSERT INTO gallery (title, category, image, date) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, category, image, itemDate]
      );
      res.status(201).json(result.rows[0]);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          'INSERT INTO gallery (title, category, image, date) VALUES (?, ?, ?, ?)',
          [title, category, image, itemDate]
        );
        saveSQLite();
        
        const result = db.exec('SELECT MAX(id) as lastId FROM gallery');
        const lastId = result[0].values[0][0];
        const itemResult = db.exec('SELECT * FROM gallery WHERE id = ?', [lastId]);
        
        if (itemResult.length === 0 || itemResult[0].values.length === 0) {
          return res.status(500).json({ error: 'Failed to retrieve created item' });
        }
        
        const row = itemResult[0].values[0];
        const item = {
          id: row[0],
          title: row[1],
          category: row[2],
          image: row[3],
          date: row[4]
        };
        res.status(201).json(item);
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        res.status(500).json({ error: 'Failed to create gallery item' });
      }
    }
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// PUT update gallery item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, image, date } = req.body;

    if (usePg) {
      const result = await pool.query(
        'UPDATE gallery SET title = $1, category = $2, image = $3, date = $4 WHERE id = $5 RETURNING *',
        [title, category, image, date, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
      res.json(result.rows[0]);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if item exists
        const checkResult = db.exec('SELECT id FROM gallery WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Gallery item not found' });
        }

        db.run(
          'UPDATE gallery SET title = ?, category = ?, image = ?, date = ? WHERE id = ?',
          [title, category, image, date, id]
        );
        saveSQLite();

        const result = db.exec('SELECT * FROM gallery WHERE id = ?', [id]);
        const row = result[0].values[0];
        const item = {
          id: row[0],
          title: row[1],
          category: row[2],
          image: row[3],
          date: row[4]
        };
        res.json(item);
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        res.status(500).json({ error: 'Failed to update gallery item' });
      }
    }
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// DELETE gallery item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (usePg) {
      const result = await pool.query('DELETE FROM gallery WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if item exists
        const checkResult = db.exec('SELECT id FROM gallery WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Gallery item not found' });
        }

        db.run('DELETE FROM gallery WHERE id = ?', [id]);
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite delete error:', sqliteErr);
        res.status(500).json({ error: 'Failed to delete gallery item' });
      }
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
