process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
console.log('DEBUG: PORT =', PORT);

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and WEBP files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Image upload endpoint
app.post('/api/upload/image', (req, res, next) => {
  console.log('DEBUG: Received upload request. Content-Type:', req.headers['content-type']);
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('DEBUG: Multer error:', err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('DEBUG: General upload error:', err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}, (req, res) => {
  console.log('DEBUG: req.file =', req.file);
  try {
    if (!req.file) {
      console.log('DEBUG: No file found in request');
      return res.status(400).json({ error: 'No file uploaded. Ensure field name is "image"' });
    }
    
    console.log('DEBUG: File successfully processed:', req.file.filename);
    const filepath = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      filepath: filepath,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// API Routes
const foundersRouter = require('./routes/founders');
const blogsRouter = require('./routes/blogs');
const galleryRouter = require('./routes/gallery');
const careersRouter = require('./routes/careers');
const settingsRouter = require('./routes/settings');
const contactRouter = require('./routes/contact');
const growthRouter = require('./routes/growth');

app.use('/api/founders', foundersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/careers', careersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/growth', growthRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tasnim Dairy Farm API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.code, err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is definitely listening on port ${PORT}`);
      console.log(`
╔═══════════════════════════════════════════════════╗
║   Tasnim Dairy Farm Backend API (PostgreSQL)      ║
║   Server running on http://localhost:${PORT}      ║
║   Frontend: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}                 ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end();
  console.log('Database connection closed');
  process.exit(0);
});
