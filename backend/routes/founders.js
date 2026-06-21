const express = require('express');
const router = express.Router();
const { getDb, save, getById, existsById, deleteById } = require('../database');

function parseFounderRow(row) {
  return {
    id: row[0],
    name: row[1],
    role: row[2],
    responsibilities: JSON.parse(row[3] || '[]'),
    image: row[4]
  };
}

// GET all founders
router.get('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const result = db.exec('SELECT * FROM founders ORDER BY id');
    if (result.length === 0 || result[0].values.length === 0) return res.json([]);
    res.json(result[0].values.map(parseFounderRow));
  } catch (error) {
    console.error('Error fetching founders:', error);
    res.status(500).json({ error: 'Failed to fetch founders' });
  }
});

// POST new founder
router.post('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { name, role, responsibilities, image } = req.body;
    if (!name || !role) return res.status(400).json({ error: 'Name and role are required' });

    db.run(
      'INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)',
      [name, role, JSON.stringify(responsibilities || []), image || null]
    );
    save();

    const result = db.exec('SELECT MAX(id) as lastId FROM founders');
    const lastId = result[0].values[0][0];
    const itemResult = getById('founders', lastId);
    if (itemResult.length === 0 || itemResult[0].values.length === 0)
      return res.status(500).json({ error: 'Failed to retrieve created founder' });

    res.status(201).json(parseFounderRow(itemResult[0].values[0]));
  } catch (error) {
    console.error('Error creating founder:', error);
    res.status(500).json({ error: 'Failed to create founder' });
  }
});

// PUT update founder
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;
    const { name, role, responsibilities, image } = req.body;

    if (!existsById('founders', id)) return res.status(404).json({ error: 'Founder not found' });

    db.run(
      'UPDATE founders SET name = ?, role = ?, responsibilities = ?, image = ? WHERE id = ?',
      [name, role, JSON.stringify(responsibilities || []), image || null, id]
    );
    save();

    const result = getById('founders', id);
    res.json(parseFounderRow(result[0].values[0]));
  } catch (error) {
    console.error('Error updating founder:', error);
    res.status(500).json({ error: 'Failed to update founder' });
  }
});

// DELETE founder
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const { id } = req.params;

    if (!existsById('founders', id)) return res.status(404).json({ error: 'Founder not found' });

    deleteById('founders', id);
    res.json({ message: 'Founder deleted successfully' });
  } catch (error) {
    console.error('Error deleting founder:', error);
    res.status(500).json({ error: 'Failed to delete founder' });
  }
});

module.exports = router;
