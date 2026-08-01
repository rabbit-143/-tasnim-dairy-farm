/**
 * 🔒 ENTERPRISE SECURE FOUNDERS API ROUTES
 * Production-ready with comprehensive security, validation, and audit logging
 */

const express = require('express');
const router = express.Router();
const { pool, usePg, saveSQLite, getDatabase } = require('../database');

// Enterprise security middleware
const { 
  hybridRoute, 
  protectDatabaseOp,
  sanitizeResponse,
  requireApiVersion,
  requestTimeout,
  validateContentType 
} = require('../middleware/routeSecurity');

const { validationSets } = require('../security/validation');
const { logSecurityEvent, SECURITY_EVENTS } = require('../security/logger');

// Apply global route security
router.use(sanitizeResponse);
router.use(requestTimeout(30));
router.use(requireApiVersion('1.0'));

// Advanced founder validation
const validateFounder = [
  ...validationSets.createContent,
  (req, res, next) => {
    // Additional founder-specific validation
    const { responsibilities } = req.body;
    
    if (responsibilities) {
      if (!Array.isArray(responsibilities)) {
        return res.status(400).json({
          error: 'Responsibilities must be an array',
          code: 'INVALID_RESPONSIBILITIES_FORMAT'
        });
      }
      
      if (responsibilities.length > 20) {
        return res.status(400).json({
          error: 'Too many responsibilities (max 20)',
          code: 'RESPONSIBILITIES_LIMIT_EXCEEDED'
        });
      }

      // Validate each responsibility
      for (const resp of responsibilities) {
        if (typeof resp !== 'string' || resp.trim().length === 0) {
          return res.status(400).json({
            error: 'Each responsibility must be a non-empty string',
            code: 'INVALID_RESPONSIBILITY_ITEM'
          });
        }
        
        if (resp.length > 200) {
          return res.status(400).json({
            error: 'Responsibility too long (max 200 characters)',
            code: 'RESPONSIBILITY_TOO_LONG'
          });
        }
      }
    }

    next();
  }
];

// Secure data sanitization for founders
const sanitizeFounder = (data) => {
  const sanitized = {
    name: data.name?.toString().trim().slice(0, 100) || '',
    role: data.role?.toString().trim().slice(0, 100) || '',
    responsibilities: Array.isArray(data.responsibilities) 
      ? data.responsibilities
          .map(r => r.toString().trim().slice(0, 200))
          .filter(r => r.length > 0)
          .slice(0, 20) // Limit to 20 responsibilities
      : [],
    image: data.image?.toString().trim().slice(0, 500) || null
  };
  
  // Validate image URL format if provided
  if (sanitized.image && !/^\/uploads\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(sanitized.image)) {
    sanitized.image = null; // Remove invalid image paths
  }
  
  return sanitized;
};

// Error handler for database operations
const handleDatabaseError = (error, operation, req, res) => {
  logSecurityEvent('database_error', {
    operation,
    error: error.message,
    table: 'founders',
    userId: req.user?.username || 'anonymous'
  }, req);

  console.error(`Database ${operation} error:`, error);
  
  res.status(500).json({ 
    error: `Failed to ${operation} founder`,
    code: 'DATABASE_OPERATION_FAILED'
  });
};

// GET all founders (Public with caching)
router.get('/', 
  requireApiVersion('1.0'),
  validationSets.pagination,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      // Add caching headers for public content
      res.set({
        'Cache-Control': 'public, max-age=300', // 5 minutes
        'ETag': `founders-${Date.now()}`,
        'Last-Modified': new Date().toUTCString()
      });

      if (usePg) {
        const countResult = await pool.query('SELECT COUNT(*) FROM founders');
        const total = parseInt(countResult.rows[0].count);

        const result = await pool.query(
          'SELECT * FROM founders ORDER BY id LIMIT $1 OFFSET $2',
          [limit, offset]
        );

        const founders = result.rows.map(row => ({
          id: row.id,
          name: row.name,
          role: row.role,
          responsibilities: JSON.parse(row.responsibilities || '[]'),
          image: row.image
        }));

        res.json({
          data: founders,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } else {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ 
            error: 'Database not available',
            code: 'DATABASE_UNAVAILABLE'
          });
        }

        try {
          // Get total count
          const countResult = db.exec('SELECT COUNT(*) as count FROM founders');
          const total = countResult.length > 0 ? countResult[0].values[0][0] : 0;

          // Get paginated results
          const result = db.exec(
            'SELECT * FROM founders ORDER BY id LIMIT ? OFFSET ?',
            [limit, offset]
          );

          const founders = result.length > 0 && result[0].values.length > 0
            ? result[0].values.map(row => ({
                id: row[0],
                name: row[1],
                role: row[2],
                responsibilities: JSON.parse(row[3] || '[]'),
                image: row[4]
              }))
            : [];

          res.json({
            data: founders,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            }
          });
        } catch (sqliteErr) {
          handleDatabaseError(sqliteErr, 'read', req, res);
        }
      }
    } catch (error) {
      handleDatabaseError(error, 'fetch', req, res);
    }
  }
);

// GET single founder (Public)
router.get('/:id', 
  validationSets.pagination,
  async (req, res) => {
    try {
      const { id } = req.params;
      const founderId = parseInt(id, 10);

      if (isNaN(founderId) || founderId < 1) {
        return res.status(400).json({ 
          error: 'Invalid founder ID',
          code: 'INVALID_ID_FORMAT'
        });
      }
      
      // Add caching for individual founders
      res.set({
        'Cache-Control': 'public, max-age=300', // 5 minutes
        'ETag': `founder-${founderId}-${Date.now()}`,
      });

      if (usePg) {
        const result = await pool.query('SELECT * FROM founders WHERE id = $1', [founderId]);
        if (result.rows.length === 0) {
          return res.status(404).json({ 
            error: 'Founder not found',
            code: 'FOUNDER_NOT_FOUND'
          });
        }

        const founder = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          role: result.rows[0].role,
          responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
          image: result.rows[0].image
        };
        res.json(founder);
      } else {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ 
            error: 'Database not available',
            code: 'DATABASE_UNAVAILABLE'
          });
        }

        try {
          const result = db.exec('SELECT * FROM founders WHERE id = ?', [founderId]);
          if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ 
              error: 'Founder not found',
              code: 'FOUNDER_NOT_FOUND'
            });
          }

          const row = result[0].values[0];
          const founder = {
            id: row[0],
            name: row[1],
            role: row[2],
            responsibilities: JSON.parse(row[3] || '[]'),
            image: row[4]
          };
          res.json(founder);
        } catch (sqliteErr) {
          handleDatabaseError(sqliteErr, 'read', req, res);
        }
      }
    } catch (error) {
      handleDatabaseError(error, 'fetch', req, res);
    }
  }
);

// POST new founder (Admin only)
router.post('/', 
  validateContentType(['application/json']),
  ...protectDatabaseOp('INSERT', 'founders'),
  validateFounder,
  async (req, res) => {
    try {
      const sanitizedData = sanitizeFounder(req.body);
      const { name, role, responsibilities, image } = sanitizedData;
      
      if (!name || !role) {
        return res.status(400).json({ 
          error: 'Name and role are required',
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      const responsibilitiesJson = JSON.stringify(responsibilities);

      if (usePg) {
        const result = await pool.query(
          'INSERT INTO founders (name, role, responsibilities, image) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, role, responsibilitiesJson, image]
        );

        const founder = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          role: result.rows[0].role,
          responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
          image: result.rows[0].image
        };
        
        res.status(201).json({
          message: 'Founder created successfully',
          data: founder
        });
      } else {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ 
            error: 'Database not available',
            code: 'DATABASE_UNAVAILABLE'
          });
        }

        try {
          db.run(
            'INSERT INTO founders (name, role, responsibilities, image) VALUES (?, ?, ?, ?)',
            [name, role, responsibilitiesJson, image]
          );
          saveSQLite();
          
          const result = db.exec('SELECT MAX(id) as lastId FROM founders');
          const lastId = result[0].values[0][0];
          const itemResult = db.exec('SELECT * FROM founders WHERE id = ?', [lastId]);
          
          if (itemResult.length === 0 || itemResult[0].values.length === 0) {
            return res.status(500).json({ 
              error: 'Failed to retrieve created founder',
              code: 'CREATION_VERIFICATION_FAILED'
            });
          }
          
          const row = itemResult[0].values[0];
          const founder = {
            id: row[0],
            name: row[1],
            role: row[2],
            responsibilities: JSON.parse(row[3] || '[]'),
            image: row[4]
          };
          
          res.status(201).json({
            message: 'Founder created successfully',
            data: founder
          });
        } catch (sqliteErr) {
          handleDatabaseError(sqliteErr, 'create', req, res);
        }
      }
    } catch (error) {
      handleDatabaseError(error, 'create', req, res);
    }
  }
);

// PUT update founder (Admin only)
router.put('/:id',
  validateContentType(['application/json']),
  ...protectDatabaseOp('UPDATE', 'founders'),
  validateFounder,
  async (req, res) => {
    try {
      const { id } = req.params;
      const founderId = parseInt(id, 10);
      
      if (isNaN(founderId) || founderId < 1) {
        return res.status(400).json({ 
          error: 'Invalid founder ID',
          code: 'INVALID_ID_FORMAT'
        });
      }

      const sanitizedData = sanitizeFounder(req.body);
      const { name, role, responsibilities, image } = sanitizedData;
      const responsibilitiesJson = JSON.stringify(responsibilities);

      if (usePg) {
        const result = await pool.query(
          'UPDATE founders SET name = $1, role = $2, responsibilities = $3, image = $4 WHERE id = $5 RETURNING *',
          [name, role, responsibilitiesJson, image, founderId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ 
            error: 'Founder not found',
            code: 'FOUNDER_NOT_FOUND'
          });
        }

        const founder = {
          id: result.rows[0].id,
          name: result.rows[0].name,
          role: result.rows[0].role,
          responsibilities: JSON.parse(result.rows[0].responsibilities || '[]'),
          image: result.rows[0].image
        };

        res.json({
          message: 'Founder updated successfully',
          data: founder
        });
      } else {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ 
            error: 'Database not available',
            code: 'DATABASE_UNAVAILABLE'
          });
        }

        try {
          // Check if founder exists
          const checkResult = db.exec('SELECT id FROM founders WHERE id = ?', [founderId]);
          if (checkResult.length === 0 || checkResult[0].values.length === 0) {
            return res.status(404).json({ 
              error: 'Founder not found',
              code: 'FOUNDER_NOT_FOUND'
            });
          }

          db.run(
            'UPDATE founders SET name = ?, role = ?, responsibilities = ?, image = ? WHERE id = ?',
            [name, role, responsibilitiesJson, image, founderId]
          );
          saveSQLite();

          const result = db.exec('SELECT * FROM founders WHERE id = ?', [founderId]);
          const row = result[0].values[0];
          const founder = {
            id: row[0],
            name: row[1],
            role: row[2],
            responsibilities: JSON.parse(row[3] || '[]'),
            image: row[4]
          };

          res.json({
            message: 'Founder updated successfully',
            data: founder
          });
        } catch (sqliteErr) {
          handleDatabaseError(sqliteErr, 'update', req, res);
        }
      }
    } catch (error) {
      handleDatabaseError(error, 'update', req, res);
    }
  }
);

// DELETE founder (Admin only)
router.delete('/:id',
  ...protectDatabaseOp('DELETE', 'founders'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const founderId = parseInt(id, 10);

      if (isNaN(founderId) || founderId < 1) {
        return res.status(400).json({ 
          error: 'Invalid founder ID',
          code: 'INVALID_ID_FORMAT'
        });
      }

      if (usePg) {
        const result = await pool.query('DELETE FROM founders WHERE id = $1 RETURNING id', [founderId]);
        if (result.rows.length === 0) {
          return res.status(404).json({ 
            error: 'Founder not found',
            code: 'FOUNDER_NOT_FOUND'
          });
        }
      } else {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ 
            error: 'Database not available',
            code: 'DATABASE_UNAVAILABLE'
          });
        }

        try {
          // Check if founder exists
          const checkResult = db.exec('SELECT id FROM founders WHERE id = ?', [founderId]);
          if (checkResult.length === 0 || checkResult[0].values.length === 0) {
            return res.status(404).json({ 
              error: 'Founder not found',
              code: 'FOUNDER_NOT_FOUND'
            });
          }

          db.run('DELETE FROM founders WHERE id = ?', [founderId]);
          saveSQLite();
        } catch (sqliteErr) {
          handleDatabaseError(sqliteErr, 'delete', req, res);
        }
      }

      res.json({ 
        message: 'Founder deleted successfully',
        deletedId: founderId
      });
    } catch (error) {
      handleDatabaseError(error, 'delete', req, res);
    }
  }
);

module.exports = router;