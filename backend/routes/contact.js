const express = require('express');
const router = express.Router();
const { getDb, save, getById, deleteById } = require('../database');

// POST contact form submission
router.post('/', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    db.run(
      'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || '', subject || '', message, new Date().toISOString()]
    );
    save();

    console.log(`Contact form submission from ${name} <${email}>`);
    res.status(201).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET all messages - newest first
router.get('/messages', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const result = db.exec('SELECT * FROM contact_messages ORDER BY created_at DESC');
    
    if (result.length === 0 || result[0].values.length === 0) {
      return res.json([]);
    }

    const columns = result[0].columns;
    const messages = result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      // Convert is_read integer to boolean
      obj.is_read = Boolean(obj.is_read);
      return obj;
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET single message by ID
router.get('/messages/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const stmt = db.prepare('SELECT * FROM contact_messages WHERE id = ?');
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      row.is_read = Boolean(row.is_read);
      res.json(row);
    } else {
      stmt.free();
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// PUT mark message as read
router.put('/messages/:id/read', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const stmt = db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?');
    stmt.bind([id]);
    stmt.step();
    const changes = db.getRowsModified();
    stmt.free();

    if (changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    save();
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message
router.delete('/messages/:id', (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
    stmt.bind([id]);
    stmt.step();
    const changes = db.getRowsModified();
    stmt.free();

    if (changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    save();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;