const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// POST contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const createdAt = new Date().toISOString();

    if (usePg) {
      await pool.query(
        'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, email, phone || '', subject || '', message, createdAt]
      );
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        db.run(
          'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, phone || '', subject || '', message, createdAt]
        );
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        return res.status(500).json({ error: 'Failed to save message' });
      }
    }

    console.log(`Contact form submission from ${name} <${email}>`);
    res.status(201).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET all messages - newest first
router.get('/messages', async (req, res) => {
  try {
    if (usePg) {
      const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
      const messages = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        subject: row.subject,
        message: row.message,
        is_read: Boolean(row.is_read),
        created_at: row.created_at
      }));
      res.json(messages);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
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
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET single message by ID
router.get('/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    if (usePg) {
      const result = await pool.query('SELECT * FROM contact_messages WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      const message = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        subject: result.rows[0].subject,
        message: result.rows[0].message,
        is_read: Boolean(result.rows[0].is_read),
        created_at: result.rows[0].created_at
      };
      res.json(message);
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
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
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Failed to fetch message' });
      }
    }
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// PUT mark message as read
router.put('/messages/:id/read', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    if (usePg) {
      const result = await pool.query('UPDATE contact_messages SET is_read = 1 WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const stmt = db.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?');
        stmt.bind([id]);
        stmt.step();
        const changes = db.getRowsModified();
        stmt.free();

        if (changes === 0) {
          return res.status(404).json({ error: 'Message not found' });
        }
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite update error:', sqliteErr);
        return res.status(500).json({ error: 'Failed to update message' });
      }
    }

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message
router.delete('/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    if (usePg) {
      const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
    } else {
      const db = getDatabase(); if (!db) return res.status(500).json({ error: 'Database not initialized' });
      try {
        const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
        stmt.bind([id]);
        stmt.step();
        const changes = db.getRowsModified();
        stmt.free();

        if (changes === 0) {
          return res.status(404).json({ error: 'Message not found' });
        }
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite delete error:', sqliteErr);
        return res.status(500).json({ error: 'Failed to delete message' });
      }
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
