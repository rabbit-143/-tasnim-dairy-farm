const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// Default seed data
const defaultGrowthJourney = [
  {
    id: 1, milestone: '2026', year: '2026', title: 'The Beginning',
    description: 'Four passionate founders established Tasnim Dairy Farm with a bold vision. Started with 30 liters daily production and 10 dedicated employees.',
    image: null, stat_value: '30 L/Day', stat_label: 'Daily Production',
    color: '#0F5D2F', side: 'left', sort_order: 1,
  },
  {
    id: 2, milestone: 'Present', year: 'Present', title: 'Rapid Growth',
    description: 'Within months of founding, production tripled to 100 liters daily. The workforce grew to 125 employees.',
    image: null, stat_value: '100 L/Day', stat_label: 'Current Production',
    color: '#D4AF37', side: 'right', sort_order: 2,
  },
  {
    id: 3, milestone: '2028', year: '2028', title: 'Target Milestone',
    description: 'Target production of 1,000 liters daily and 30,000 liters monthly.',
    image: null, stat_value: '1,000 L/Day', stat_label: 'Target Production',
    color: '#0F5D2F', side: 'left', sort_order: 3,
  },
  {
    id: 4, milestone: 'Future', year: 'Future', title: 'Global Expansion',
    description: 'Establishment of a worldwide dairy supply network.',
    image: null, stat_value: 'Global', stat_label: 'Market Reach',
    color: '#D4AF37', side: 'right', sort_order: 4,
  },
];

// ========================================
// SQLite Helpers (with proper database access)
// ========================================
function sqliteQueryAll(query, params = []) {
  const db = getDatabase();
  if (!db) {
    console.error('SQLite database not available');
    return null;
  }
  
  try {
    const result = db.exec(query, params);
    if (result.length > 0 && result[0].values.length > 0) {
      const columns = result[0].columns;
      return result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    }
    return [];
  } catch (err) {
    console.error('SQLite query error:', err.message);
    return null;
  }
}

function sqliteQueryOne(query, params = []) {
  const rows = sqliteQueryAll(query, params);
  if (!rows || rows.length === 0) return null;
  return rows[0];
}

// SQLite write function
function sqliteRun(query, params = []) {
  const db = getDatabase();
  if (!db) {
    console.error('SQLite database not available');
    return false;
  }
  
  try {
    db.run(query, params);
    saveSQLite();
    return true;
  } catch (err) {
    console.error('SQLite run error:', err.message);
    return false;
  }
}

// ID validator
function parseId(raw) {
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// ========================================
// GET all growth journey items
// ========================================
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM growth_journey ORDER BY sort_order ASC');
      return res.json(result.rows);
    }

    // SQLite branch
    const rows = sqliteQueryAll('SELECT * FROM growth_journey ORDER BY sort_order ASC');

    if (rows && rows.length > 0) return res.json(rows);

    // Empty DB → seed with default data
    const db = getDatabase();
    if (db) {
      try {
        for (const item of defaultGrowthJourney) {
          db.run(
            'INSERT OR IGNORE INTO growth_journey (id, milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.milestone, item.year, item.title, item.description, item.image, item.stat_value, item.stat_label, item.color, item.side, item.sort_order]
          );
        }
        saveSQLite();

        const seeded = sqliteQueryAll('SELECT * FROM growth_journey ORDER BY sort_order ASC');
        if (seeded && seeded.length > 0) return res.json(seeded);
      } catch (seedError) {
        console.error('Error seeding growth journey:', seedError);
      }
    }

    return res.json(defaultGrowthJourney);
  } catch (error) {
    console.error('Error fetching growth journey:', error);
    res.status(500).json({ error: 'Failed to fetch growth journey items' });
  }
});

// ========================================
// GET single growth journey item
// ========================================
router.get('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid id' });

    if (usePg) {
      const result = await pool.query('SELECT * FROM growth_journey WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
      return res.json(result.rows[0]);
    }

    const item = sqliteQueryOne('SELECT * FROM growth_journey WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  } catch (error) {
    console.error('Error fetching growth journey item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// ========================================
// CREATE growth journey item
// ========================================
router.post('/', async (req, res) => {
  try {
    const {
      milestone, year, title, description,
      image, stat_value, stat_label, color, side, sort_order,
    } = req.body || {};

    // Required field validation
    if (!title || !milestone) {
      return res.status(400).json({ error: 'title and milestone are required' });
    }

    if (usePg) {
      const result = await pool.query(
        `INSERT INTO growth_journey
          (milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          milestone, year, title, description,
          image || null, stat_value, stat_label, color, side,
          sort_order || 0,
        ]
      );
      return res.json(result.rows[0]);
    }

    // SQLite branch
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    // Determine sort_order if not provided
    let finalSortOrder = sort_order;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const maxSortRow = sqliteQueryOne('SELECT MAX(sort_order) as max_sort FROM growth_journey');
      finalSortOrder = (maxSortRow && maxSortRow.max_sort ? maxSortRow.max_sort : 0) + 1;
    }

    try {
      db.run(
        `INSERT INTO growth_journey
          (milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          milestone, year, title, description,
          image || null, stat_value, stat_label, color, side,
          finalSortOrder,
        ]
      );
      saveSQLite();

      // Get the newly created item
      const result = db.exec('SELECT MAX(id) as lastId FROM growth_journey');
      const lastId = result[0].values[0][0];
      const created = sqliteQueryOne('SELECT * FROM growth_journey WHERE id = ?', [lastId]);
      return res.json(created);
    } catch (sqliteError) {
      console.error('SQLite insert error:', sqliteError);
      return res.status(500).json({ error: 'Failed to create item' });
    }
  } catch (error) {
    console.error('Error creating growth journey item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// ========================================
// UPDATE growth journey item
// ========================================
router.put('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid id' });

    const {
      milestone, year, title, description,
      image, stat_value, stat_label, color, side, sort_order,
    } = req.body || {};

    if (usePg) {
      // Fetch existing for fallback values
      const existingRes = await pool.query('SELECT * FROM growth_journey WHERE id = $1', [id]);
      if (existingRes.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
      const existing = existingRes.rows[0];

      const result = await pool.query(
        `UPDATE growth_journey
           SET milestone = $1, year = $2, title = $3, description = $4,
               image = $5, stat_value = $6, stat_label = $7,
               color = $8, side = $9, sort_order = $10
         WHERE id = $11
         RETURNING *`,
        [
          milestone ?? existing.milestone,
          year ?? existing.year,
          title ?? existing.title,
          description ?? existing.description,
          image ?? existing.image,
          stat_value ?? existing.stat_value,
          stat_label ?? existing.stat_label,
          color ?? existing.color,
          side ?? existing.side,
          sort_order ?? existing.sort_order ?? 0,
          id,
        ]
      );
      return res.json(result.rows[0]);
    }

    // SQLite branch
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const existing = sqliteQueryOne('SELECT * FROM growth_journey WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    try {
      db.run(
        `UPDATE growth_journey
           SET milestone = ?, year = ?, title = ?, description = ?,
               image = ?, stat_value = ?, stat_label = ?,
               color = ?, side = ?, sort_order = ?
         WHERE id = ?`,
        [
          milestone ?? existing.milestone,
          year ?? existing.year,
          title ?? existing.title,
          description ?? existing.description,
          image ?? existing.image,
          stat_value ?? existing.stat_value,
          stat_label ?? existing.stat_label,
          color ?? existing.color,
          side ?? existing.side,
          sort_order ?? existing.sort_order ?? 0,
          id,
        ]
      );
      saveSQLite();

      const updated = sqliteQueryOne('SELECT * FROM growth_journey WHERE id = ?', [id]);
      return res.json(updated);
    } catch (sqliteError) {
      console.error('SQLite update error:', sqliteError);
      return res.status(500).json({ error: 'Failed to update item' });
    }
  } catch (error) {
    console.error('Error updating growth journey item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// ========================================
// DELETE growth journey item
// ========================================
router.delete('/:id', async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: 'Invalid id' });

    if (usePg) {
      const result = await pool.query(
        'DELETE FROM growth_journey WHERE id = $1 RETURNING id',
        [id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
      return res.json({ success: true });
    }

    // SQLite branch
    const db = getDatabase();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const existing = sqliteQueryOne('SELECT * FROM growth_journey WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    try {
      db.run('DELETE FROM growth_journey WHERE id = ?', [id]);
      saveSQLite();
      return res.json({ success: true });
    } catch (sqliteError) {
      console.error('SQLite delete error:', sqliteError);
      return res.status(500).json({ error: 'Failed to delete item' });
    }
  } catch (error) {
    console.error('Error deleting growth journey item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;