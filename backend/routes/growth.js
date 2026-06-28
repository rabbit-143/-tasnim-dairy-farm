const express = require('express');
const router = express.Router();
const { pool, db, usePg, saveSQLite } = require('../database');

// Store default data for SQLite fallback
const defaultGrowthJourney = [
  {
    id: 1,
    milestone: '2026',
    year: '2026',
    title: 'The Beginning',
    description: 'Four passionate founders established Tasnim Dairy Farm with a bold vision. Started with 30 liters daily production and 10 dedicated employees.',
    image: null,
    stat_value: '30 L/Day',
    stat_label: 'Daily Production',
    color: '#0F5D2F',
    side: 'left',
    sort_order: 1,
  },
  {
    id: 2,
    milestone: 'Present',
    year: 'Present',
    title: 'Rapid Growth',
    description: 'Within months of founding, production tripled to 100 liters daily. The workforce grew to 125 employees.',
    image: null,
    stat_value: '100 L/Day',
    stat_label: 'Current Production',
    color: '#D4AF37',
    side: 'right',
    sort_order: 2,
  },
  {
    id: 3,
    milestone: '2028',
    year: '2028',
    title: 'Target Milestone',
    description: 'Target production of 1,000 liters daily and 30,000 liters monthly.',
    image: null,
    stat_value: '1,000 L/Day',
    stat_label: 'Target Production',
    color: '#0F5D2F',
    side: 'left',
    sort_order: 3,
  },
  {
    id: 4,
    milestone: 'Future',
    year: 'Future',
    title: 'Global Expansion',
    description: 'Establishment of a worldwide dairy supply network.',
    image: null,
    stat_value: 'Global',
    stat_label: 'Market Reach',
    color: '#D4AF37',
    side: 'right',
    sort_order: 4,
  },
];

// Get all growth journey items
router.get('/', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM growth_journey ORDER BY sort_order ASC');
      res.json(result.rows);
    } else {
      // For SQLite, if db is not available, return default data
      if (!db) {
        return res.json(defaultGrowthJourney);
      }
      try {
        const result = db.exec('SELECT * FROM growth_journey ORDER BY sort_order ASC');
        if (result.length > 0 && result[0].values.length > 0) {
          const data = result[0].values.map(row => ({
            id: row[0],
            milestone: row[1],
            year: row[2],
            title: row[3],
            description: row[4],
            image: row[5],
            stat_value: row[6],
            stat_label: row[7],
            color: row[8],
            side: row[9],
            sort_order: row[10]
          }));
          res.json(data);
        } else {
          res.json(defaultGrowthJourney);
        }
      } catch (sqliteErr) {
        console.warn('SQLite read error, using default data:', sqliteErr.message);
        res.json(defaultGrowthJourney);
      }
    }
  } catch (error) {
    console.error('Error fetching growth journey:', error);
    res.status(500).json({ error: 'Failed to fetch growth journey items' });
  }
});

// Get single growth journey item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (usePg) {
      const result = await pool.query('SELECT * FROM growth_journey WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
      res.json(result.rows[0]);
    } else {
      // For SQLite
      const item = defaultGrowthJourney.find(item => item.id == id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    }
  } catch (error) {
    console.error('Error fetching growth journey item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create growth journey item
router.post('/', async (req, res) => {
  try {
    const { milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order } = req.body;
    
    if (usePg) {
      const result = await pool.query(
        'INSERT INTO growth_journey (milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order || 0]
      );
      res.json(result.rows[0]);
    } else {
      // For SQLite
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const maxId = Math.max(...defaultGrowthJourney.map(m => m.id), 0) + 1;
        const newItem = {
          id: maxId,
          milestone,
          year,
          title,
          description,
          image,
          stat_value,
          stat_label,
          color,
          side,
          sort_order: sort_order || defaultGrowthJourney.length + 1
        };
        defaultGrowthJourney.push(newItem);
        
        db.run(
          'INSERT INTO growth_journey (id, milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [newItem.id, milestone, year, title, description, image, stat_value, stat_label, color, side, newItem.sort_order]
        );
        saveSQLite();
        res.json(newItem);
      } catch (err) {
        console.error('SQLite insert error:', err);
        res.status(500).json({ error: 'Failed to create item' });
      }
    }
  } catch (error) {
    console.error('Error creating growth journey item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update growth journey item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order } = req.body;
    
    if (usePg) {
      const result = await pool.query(
        'UPDATE growth_journey SET milestone = $1, year = $2, title = $3, description = $4, image = $5, stat_value = $6, stat_label = $7, color = $8, side = $9, sort_order = $10 WHERE id = $11 RETURNING *',
        [milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order, id]
      );
      res.json(result.rows[0]);
    } else {
      // For SQLite
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const index = defaultGrowthJourney.findIndex(item => item.id == id);
        if (index === -1) return res.status(404).json({ error: 'Item not found' });
        
        const updatedItem = {
          id: parseInt(id),
          milestone,
          year,
          title,
          description,
          image,
          stat_value,
          stat_label,
          color,
          side,
          sort_order
        };
        defaultGrowthJourney[index] = updatedItem;
        
        db.run(
          'UPDATE growth_journey SET milestone = ?, year = ?, title = ?, description = ?, image = ?, stat_value = ?, stat_label = ?, color = ?, side = ?, sort_order = ? WHERE id = ?',
          [milestone, year, title, description, image, stat_value, stat_label, color, side, sort_order, id]
        );
        saveSQLite();
        res.json(updatedItem);
      } catch (err) {
        console.error('SQLite update error:', err);
        res.status(500).json({ error: 'Failed to update item' });
      }
    }
  } catch (error) {
    console.error('Error updating growth journey item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete growth journey item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (usePg) {
      await pool.query('DELETE FROM growth_journey WHERE id = $1', [id]);
    } else {
      // For SQLite
      if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const index = defaultGrowthJourney.findIndex(item => item.id == id);
        if (index !== -1) {
          defaultGrowthJourney.splice(index, 1);
        }
        
        db.run('DELETE FROM growth_journey WHERE id = ?', [id]);
        saveSQLite();
      } catch (err) {
        console.error('SQLite delete error:', err);
        return res.status(500).json({ error: 'Failed to delete item' });
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting growth journey item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
