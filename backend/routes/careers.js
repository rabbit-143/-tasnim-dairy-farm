const express = require('express');
const router = express.Router();
const { getDb, save, getById, existsById, deleteById } = require('../database');

function parseCareerRow(row) {
  return {
    id: row[0],
    title: row[1],
    department: row[2],
    vacancy: row[3],
    deadline: row[4],
    requirements: JSON.parse(row[5] || '[]'),
    applyEmail: row[6],
    active: Boolean(row[7])
  };
}

// GET all careers
router.get('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM careers ORDER BY deadline DESC');
    if (result.length === 0 || result[0].values.length === 0) return res.json([]);
    res.json(result[0].values.map(parseCareerRow));
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// POST new career
router.post('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;
    if (!title || !department) return res.status(400).json({ error: 'Title and department are required' });

    const requirementsJson = JSON.stringify(requirements || []);

    db.run(
      'INSERT INTO careers (title, department, vacancy, deadline, requirements, applyEmail, active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, department, vacancy || 1, deadline || '', requirementsJson, applyEmail || '', active ? 1 : 0]
    );
    save();

    const result = db.exec('SELECT MAX(id) as lastId FROM careers');
    const lastId = result[0].values[0][0];
    const itemResult = getById('careers', lastId);
    if (itemResult.length === 0 || itemResult[0].values.length === 0)
      return res.status(500).json({ error: 'Failed to retrieve created career' });

    res.status(201).json(parseCareerRow(itemResult[0].values[0]));
  } catch (error) {
    console.error('Error creating career:', error);
    res.status(500).json({ error: 'Failed to create career' });
  }
});

// PUT update career
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;
    const { title, department, vacancy, deadline, requirements, applyEmail, active } = req.body;

    if (!existsById('careers', id)) return res.status(404).json({ error: 'Career not found' });

    const requirementsJson = JSON.stringify(requirements || []);

    db.run(
      'UPDATE careers SET title = ?, department = ?, vacancy = ?, deadline = ?, requirements = ?, applyEmail = ?, active = ? WHERE id = ?',
      [title, department, vacancy, deadline, requirementsJson, applyEmail, active ? 1 : 0, id]
    );
    save();

    const result = getById('careers', id);
    res.json(parseCareerRow(result[0].values[0]));
  } catch (error) {
    console.error('Error updating career:', error);
    res.status(500).json({ error: 'Failed to update career' });
  }
});

// DELETE career
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;

    if (!existsById('careers', id)) return res.status(404).json({ error: 'Career not found' });

    deleteById('careers', id);
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    console.error('Error deleting career:', error);
    res.status(500).json({ error: 'Failed to delete career' });
  }
});

module.exports = router;
