const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, param, validationResult } = require('express-validator');
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION_' + Math.random();
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Input Validation Rules
const validateContactForm = [
  body('name')
    .notEmpty()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1-100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-\(\)]{7,20}$/)
    .withMessage('Invalid phone number format'),
  body('subject')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 200 })
    .withMessage('Subject must not exceed 200 characters'),
  body('message')
    .notEmpty()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10-2000 characters')
];

const validateId = param('id')
  .isInt({ min: 1 })
  .withMessage('ID must be a positive integer');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Sanitize contact data
const sanitizeContactData = (data) => {
  const sanitized = {
    name: data.name?.toString().trim() || '',
    email: data.email?.toString().toLowerCase().trim() || '',
    phone: data.phone?.toString().trim().replace(/[^\d\+\-\(\)\s]/g, '') || '',
    subject: data.subject?.toString().trim() || '',
    message: data.message?.toString().trim() || ''
  };
  
  return sanitized;
};

// POST contact form submission (Public - but with validation)
router.post('/', [
  ...validateContactForm,
  handleValidationErrors
], async (req, res) => {
  try {
    const sanitizedData = sanitizeContactData(req.body);
    const { name, email, phone, subject, message } = sanitizedData;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const createdAt = new Date().toISOString();

    if (usePg) {
      await pool.query(
        'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, email, phone, subject, message, createdAt]
      );
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not available' });
      try {
        db.run(
          'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, phone, subject, message, createdAt]
        );
        saveSQLite();
      } catch (sqliteErr) {
        console.error('SQLite insert error:', sqliteErr);
        return res.status(500).json({ error: 'Failed to save message' });
      }
    }

    // Log for security monitoring (don't log sensitive data)
    console.log(`Contact form submission from ${email} at ${createdAt}`);
    res.status(201).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// GET all messages (Admin only)
router.get('/messages', authenticateToken, async (req, res) => {
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
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not available' });
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
          obj.is_read = Boolean(obj.is_read);
          return obj;
        });

        res.json(messages);
      } catch (sqliteErr) {
        console.error('SQLite read error:', sqliteErr);
        res.status(500).json({ error: 'Database query failed' });
      }
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET single message by ID (Admin only)
router.get('/messages/:id', [authenticateToken, validateId, handleValidationErrors], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

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
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not available' });
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
        res.status(500).json({ error: 'Database query failed' });
      }
    }
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// PUT mark message as read (Admin only)
router.put('/messages/:id/read', [authenticateToken, validateId, handleValidationErrors], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (usePg) {
      const result = await pool.query('UPDATE contact_messages SET is_read = 1 WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not available' });
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
        return res.status(500).json({ error: 'Database operation failed' });
      }
    }

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message (Admin only)
router.delete('/messages/:id', [authenticateToken, validateId, handleValidationErrors], async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (usePg) {
      const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
    } else {
      const db = getDatabase();
      if (!db) return res.status(500).json({ error: 'Database not available' });
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
        return res.status(500).json({ error: 'Database operation failed' });
      }
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
