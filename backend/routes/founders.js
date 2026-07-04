const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// GET all founders
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM founders ORDER BY id');
      const founders = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        role: row.role,
        responsibilities: JSON.parse(row.responsibilities || '[]'),
        image: row.image
      }));
      res.json(founders);
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM founders ORDER BY id');
        if (result.length > 0 && result[0].values.length > 0) {
          const founders = result[0].values.map(row => ({
            id: row[0],
            name: row[1],
            role: row[2],
            responsibilities: JSON.parse(row[3] || '[]'),
            image: row[4]
          }));
          res.json(founders);
        } else {
          res.json([]);
        }
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch founders' });
      }
    }
  } catch (error) {
    console.error('Error fetching founders:', error);
    res.status(500).json({ error: 'Failed to fetch founders' });
  }
});

// GET single founder
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usePg) {
      const result = await pool.query('SELECT * FROM founders WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Founder not found' });
      const founder = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role,
        responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
        image: result.rows[0].image
      };
      res.json(founder);
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM founders WHERE id = ?', [id]);
        if (result.length === 0 || result[0].values.length === 0) {
          return res.status(404).json({ error: 'Founder not found' });
        }
        const row = result[0].values[0];
        const founder = {
          id: row[0],
          name: row[1],
          role: row[2],
          responsibilities: JSON.parse(row[3] || '[]'),
          image: row[4]
        };
        res.json(founder);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch founder' });
      }
    }
  } catch (error) {
    console.error('Error fetching founder:', error);
    res.status(500).json({ error: 'Failed to fetch founder' });
  }
});

// POST new founder
router.post('/', async (req, res) => {
  try {
    const { name, role, responsibilities, image } = req.body;
    if (!name || !role) return res.status(400).json({ error: 'Name and role are required' });

    const responsibilitiesJson = JSON.stringify(responsibilities || []);

    if (usePg) {
      const result = await pool.query(
        'INSERT INTO founders (name, role, responsibilities, image) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, role, responsibilitiesJson, image || null]
      );
      const founder = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role,
        responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
        image: result.rows[0].image
      };
      res.status(201).json(founder);
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          'INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)',
          [name, role, responsibilitiesJson, image || null]
        );
        saveSQLite();
        
        const result = db.exec('SELECT MAX(id) as lastId FROM founders');
        const lastId = result[0].values[0][0];
        const itemResult = db.exec('SELECT * FROM founders WHERE id = ?', [lastId]);
        
        if (itemResult.length === 0 || itemResult[0].values.length === 0) {
          return res.status(500).json({ error: 'Failed to retrieve created founder' });
        }
        
        const row = itemResult[0].values[0];
        const founder = {
          id: row[0],
          name: row[1],
          role: row[2],
          responsibilities: JSON.parse(row[3] || '[]'),
          image: row[4]
        };
        res.status(201).json(founder);
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        res.status(500).json({ error: 'Failed to create founder' });
      }
    }
  } catch (error) {
    console.error('Error creating founder:', error);
    res.status(500).json({ error: 'Failed to create founder' });
  }
});

// PUT update founder
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, responsibilities, image } = req.body;

    const responsibilitiesJson = JSON.stringify(responsibilities || []);

    if (usePg) {
      const result = await pool.query(
        'UPDATE founders SET name = $1, role = $2, responsibilities = $3, image = $4 WHERE id = $5 RETURNING *',
        [name, role, responsibilitiesJson, image || null, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Founder not found' });
      const founder = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        role: result.rows[0].role,
        responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
        image: result.rows[0].image
      };
      res.json(founder);
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if founder exists
        const checkResult = db.exec('SELECT id FROM founders WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Founder not found' });
        }

        db.run(
          'UPDATE founders SET name = ?, role = ?, responsibilities = ?, image = ? WHERE id = ?',
          [name, role, responsibilitiesJson, image || null, id]
        );
        saveSQLite();

        const result = db.exec('SELECT * FROM founders WHERE id = ?', [id]);
        const row = result[0].values[0];
        const founder = {
          id: row[0],
          name: row[1],
          role: row[2],
          responsibilities: JSON.parse(row[3] || '[]'),
          image: row[4]
        };
        res.json(founder);
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        res.status(500).json({ error: 'Failed to update founder' });
      }
    }
  } catch (error) {
    console.error('Error updating founder:', error);
    res.status(500).json({ error: 'Failed to update founder' });
  }
});

// DELETE founder
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (usePg) {
      const result = await pool.query('DELETE FROM founders WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Founder not found' });
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if founder exists
        const checkResult = db.exec('SELECT id FROM founders WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Founder not found' });
        }

        db.run('DELETE FROM founders WHERE id = ?', [id]);
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite delete error:', sqliteErr);
        res.status(500).json({ error: 'Failed to delete founder' });
      }
    }

    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    console.error('Error deleting founder:', error);
    res.status(500).json({ error: 'Failed to delete founder' });
  }
});

module.exports = router;