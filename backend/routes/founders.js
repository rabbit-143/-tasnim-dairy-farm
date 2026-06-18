const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all founders
router.get('/', (req, res) => {
  db.all('SELECT * FROM founders ORDER BY id', (err, founders) => {
    if (err) {
      console.error('Error fetching founders:', err);
      return res.status(500).json({ error: 'Failed to fetch founders' });
    }
    
    // Parse responsibilities JSON for each founder
    const foundersWithParsedData = founders.map(founder => ({
      ...founder,
      responsibilities: JSON.parse(founder.responsibilities || '[]')
    }));
    
    res.json(foundersWithParsedData);
  });
});

// POST new founder
router.post('/', (req, res) => {
  const { name, role, responsibilities, image } = req.body;
  
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const responsibilitiesJson = JSON.stringify(responsibilities || []);
  
  db.run(`
    INSERT INTO founders (name, role, responsibilities, image)
    VALUES (?, ?, ?, ?)
  `, [name, role, responsibilitiesJson, image || null], function(err) {
    if (err) {
      console.error('Error creating founder:', err);
      return res.status(500).json({ error: 'Failed to create founder' });
    }
    
    db.get('SELECT * FROM founders WHERE id = ?', [this.lastID], (err, newFounder) => {
      if (err) {
        console.error('Error fetching new founder:', err);
        return res.status(500).json({ error: 'Failed to fetch new founder' });
      }
      
      res.status(201).json({
        ...newFounder,
        responsibilities: JSON.parse(newFounder.responsibilities || '[]')
      });
    });
  });
});

// PUT update founder
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, role, responsibilities, image } = req.body;
  
  // Check if founder exists
  db.get('SELECT * FROM founders WHERE id = ?', [id], (err, existing) => {
    if (err) {
      console.error('Error checking founder:', err);
      return res.status(500).json({ error: 'Failed to check founder' });
    }
    
    if (!existing) {
      return res.status(404).json({ error: 'Founder not found' });
    }

    const responsibilitiesJson = JSON.stringify(responsibilities || []);
    
    db.run(`
      UPDATE founders 
      SET name = ?, role = ?, responsibilities = ?, image = ?
      WHERE id = ?
    `, [name, role, responsibilitiesJson, image || null, id], function(err) {
      if (err) {
        console.error('Error updating founder:', err);
        return res.status(500).json({ error: 'Failed to update founder' });
      }
      
      db.get('SELECT * FROM founders WHERE id = ?', [id], (err, updated) => {
        if (err) {
          console.error('Error fetching updated founder:', err);
          return res.status(500).json({ error: 'Failed to fetch updated founder' });
        }
        
        res.json({
          ...updated,
          responsibilities: JSON.parse(updated.responsibilities || '[]')
        });
      });
    });
  });
});

// DELETE founder
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Check if founder exists
  db.get('SELECT * FROM founders WHERE id = ?', [id], (err, existing) => {
    if (err) {
      console.error('Error checking founder:', err);
      return res.status(500).json({ error: 'Failed to check founder' });
    }
    
    if (!existing) {
      return res.status(404).json({ error: 'Founder not found' });
    }

    db.run('DELETE FROM founders WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting founder:', err);
        return res.status(500).json({ error: 'Failed to delete founder' });
      }
      
      res.json({ message: 'Founder deleted successfully' });
    });
  });
});

module.exports = router;
