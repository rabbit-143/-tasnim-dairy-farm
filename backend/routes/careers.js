const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all careers
router.get('/', (req, res) => {
  try {
    const careers = db.prepare('SELECT * FROM careers ORDER BY id DESC').all();
    
    // Parse requirements JSON and convert active to boolean
    const careersWithParsedData = careers.map(career => ({
      ...career,
      requirements: JSON.parse(career.requirements || '[]'),
      active: career.active === 1
    }));
    
    res.json(careersWithParsedData);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// POST new career
router.post('/', (req, res) => {
  try {
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;
    
    if (!title || !department || !vacancy || !deadline || !applyEmail) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const requirementsJson = JSON.stringify(requirements || []);
    
    const stmt = db.prepare(`
      INSERT INTO careers (title, department, vacancy, deadline, requirements, applyEmail, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title, 
      department, 
      vacancy, 
      deadline, 
      requirementsJson, 
      applyEmail, 
      active ? 1 : 0
    );
    
    const newCareer = db.prepare('SELECT * FROM careers WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...newCareer,
      requirements: JSON.parse(newCareer.requirements || '[]'),
      active: newCareer.active === 1
    });
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({ error: 'Failed to create career' });
  }
});

// PUT update career
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;
    
    const existing = db.prepare('SELECT * FROM careers WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Career not found' });
    }

    const requirementsJson = JSON.stringify(requirements || []);
    
    const stmt = db.prepare(`
      UPDATE careers 
      SET title = ?, department = ?, vacancy = ?, deadline = ?, 
          requirements = ?, applyEmail = ?, active = ?
      WHERE id = ?
    `);
    
    stmt.run(
      title, 
      department, 
      vacancy, 
      deadline, 
      requirementsJson, 
      applyEmail, 
      active ? 1 : 0, 
      id
    );
    
    const updated = db.prepare('SELECT * FROM careers WHERE id = ?').get(id);
    
    res.json({
      ...updated,
      requirements: JSON.parse(updated.requirements || '[]'),
      active: updated.active === 1
    });
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({ error: 'Failed to update career' });
  }
});

// DELETE career
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM careers WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Career not found' });
    }

    const stmt = db.prepare('DELETE FROM careers WHERE id = ?');
    stmt.run(id);
    
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ error: 'Failed to delete career' });
  }
});

module.exports = router;
