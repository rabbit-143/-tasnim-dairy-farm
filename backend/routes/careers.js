const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// GET all careers
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM careers ORDER BY deadline DESC');
      const careers = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        department: row.department,
        vacancy: row.vacancy,
        deadline: row.deadline,
        requirements: JSON.parse(row.requirements || '[]'),
        applyEmail: row.applyemail,
        active: Boolean(row.active)
      }));
      res.json(careers);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM careers ORDER BY deadline DESC');
        if (result.length > 0 && result[0].values.length > 0) {
          const careers = result[0].values.map(row => ({
            id: row[0],
            title: row[1],
            department: row[2],
            vacancy: row[3],
            deadline: row[4],
            requirements: JSON.parse(row[5] || '[]'),
            applyEmail: row[6],
            active: Boolean(row[7])
          }));
          res.json(careers);
        } else {
          res.json([]);
        }
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch careers' });
      }
    }
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// GET single career
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usePg) {
      const result = await pool.query('SELECT * FROM careers WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Career not found' });
      const career = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        department: result.rows[0].department,
        vacancy: result.rows[0].vacancy,
        deadline: result.rows[0].deadline,
        requirements: JSON.parse(result.rows[0].requirements || '[]'),
        applyEmail: result.rows[0].applyemail,
        active: Boolean(result.rows[0].active)
      };
      res.json(career);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const result = db.exec('SELECT * FROM careers WHERE id = ?', [id]);
        if (result.length === 0 || result[0].values.length === 0) {
          return res.status(404).json({ error: 'Career not found' });
        }
        const row = result[0].values[0];
        const career = {
          id: row[0],
          title: row[1],
          department: row[2],
          vacancy: row[3],
          deadline: row[4],
          requirements: JSON.parse(row[5] || '[]'),
          applyEmail: row[6],
          active: Boolean(row[7])
        };
        res.json(career);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch career' });
      }
    }
  } catch (error) {
    console.error('Error fetching career:', error);
    res.status(500).json({ error: 'Failed to fetch career' });
  }
});

// POST new career
router.post('/', async (req, res) => {
  try {
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;
    if (!title || !department) return res.status(400).json({ error: 'Title and department are required' });

    const requirementsJson = JSON.stringify(requirements || []);

    if (usePg) {
      const result = await pool.query(
        'INSERT INTO careers (title, department, vacancy, deadline, requirements, applyEmail, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, department, vacancy || 1, deadline || '', requirementsJson, applyEmail || '', active ? 1 : 0]
      );
      const career = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        department: result.rows[0].department,
        vacancy: result.rows[0].vacancy,
        deadline: result.rows[0].deadline,
        requirements: JSON.parse(result.rows[0].requirements || '[]'),
        applyEmail: result.rows[0].applyemail,
        active: Boolean(result.rows[0].active)
      };
      res.status(201).json(career);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          'INSERT INTO careers (title, department, vacancy, deadline, requirements, applyEmail, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [title, department, vacancy || 1, deadline || '', requirementsJson, applyEmail || '', active ? 1 : 0]
        );
        saveSQLite();
        
        const result = db.exec('SELECT MAX(id) as lastId FROM careers');
        const lastId = result[0].values[0][0];
        const itemResult = db.exec('SELECT * FROM careers WHERE id = ?', [lastId]);
        
        if (itemResult.length === 0 || itemResult[0].values.length === 0) {
          return res.status(500).json({ error: 'Failed to retrieve created career' });
        }
        
        const row = itemResult[0].values[0];
        const career = {
          id: row[0],
          title: row[1],
          department: row[2],
          vacancy: row[3],
          deadline: row[4],
          requirements: JSON.parse(row[5] || '[]'),
          applyEmail: row[6],
          active: Boolean(row[7])
        };
        res.status(201).json(career);
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        res.status(500).json({ error: 'Failed to create career' });
      }
    }
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({ error: 'Failed to create career' });
  }
});

// PUT update career
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;

    const requirementsJson = JSON.stringify(requirements || []);

    if (usePg) {
      const result = await pool.query(
        'UPDATE careers SET title = $1, department = $2, vacancy = $3, deadline = $4, requirements = $5, applyEmail = $6, active = $7 WHERE id = $8 RETURNING *',
        [title, department, vacancy, deadline, requirementsJson, applyEmail, active ? 1 : 0, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Career not found' });
      const career = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        department: result.rows[0].department,
        vacancy: result.rows[0].vacancy,
        deadline: result.rows[0].deadline,
        requirements: JSON.parse(result.rows[0].requirements || '[]'),
        applyEmail: result.rows[0].applyemail,
        active: Boolean(result.rows[0].active)
      };
      res.json(career);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if career exists
        const checkResult = db.exec('SELECT id FROM careers WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Career not found' });
        }

        db.run(
          'UPDATE careers SET title = ?, department = ?, vacancy = ?, deadline = ?, requirements = ?, applyEmail = ?, active = ? WHERE id = ?',
          [title, department, vacancy, deadline, requirementsJson, applyEmail, active ? 1 : 0, id]
        );
        saveSQLite();

        const result = db.exec('SELECT * FROM careers WHERE id = ?', [id]);
        const row = result[0].values[0];
        const career = {
          id: row[0],
          title: row[1],
          department: row[2],
          vacancy: row[3],
          deadline: row[4],
          requirements: JSON.parse(row[5] || '[]'),
          applyEmail: row[6],
          active: Boolean(row[7])
        };
        res.json(career);
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        res.status(500).json({ error: 'Failed to update career' });
      }
    }
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({ error: 'Failed to update career' });
  }
});

// DELETE career
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (usePg) {
      const result = await pool.query('DELETE FROM careers WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Career not found' });
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        // Check if career exists
        const checkResult = db.exec('SELECT id FROM careers WHERE id = ?', [id]);
        if (checkResult.length === 0 || checkResult[0].values.length === 0) {
          return res.status(404).json({ error: 'Career not found' });
        }

        db.run('DELETE FROM careers WHERE id = ?', [id]);
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite delete error:', sqliteErr);
        res.status(500).json({ error: 'Failed to delete career' });
      }
    }

    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ error: 'Failed to delete career' });
  }
});

module.exports = router;
