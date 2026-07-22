# 🏗️ System Architecture - Tasnim Dairy Farm

## 🌐 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER BROWSER  │    │  NETLIFY CDN    │    │   RENDER.COM    │
│                 │◄──►│                 │◄──►│                 │
│ React Frontend  │    │ Static Hosting  │    │ Node.js Backend │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │  NEON POSTGRES  │
                                               │                 │
                                               │ Cloud Database  │
                                               └─────────────────┘
```

---

## 🎯 Architecture Patterns

### **Frontend Architecture**
**Pattern**: Single Page Application (SPA) with Component-Based Design
**Framework**: React with Hooks and Context API
**State Management**: React Context + Local State

```
App.tsx (Root)
├── WelcomeAnimation (Initial load)
├── Navbar (Global navigation)
├── Routes (Page routing)
│   ├── Public Pages
│   │   ├── HomePage
│   │   ├── AboutPage
│   │   ├── FoundersPage
│   │   ├── FarmPage
│   │   ├── GalleryPage
│   │   ├── GrowthPage
│   │   ├── BlogPage
│   │   ├── CareersPage
│   │   └── ContactPage
│   └── Protected Route
│       └── AdminPanel
├── Footer (Global footer)
├── BackToTop (UX enhancement)
└── ChatBot (AI assistant)
```

### **Backend Architecture**
**Pattern**: RESTful API with Layered Architecture
**Framework**: Express.js with Middleware Pipeline
**Data Access**: Direct Database Queries with Pool Management

```
server.js (Entry point)
├── Middleware Stack
│   ├── CORS configuration
│   ├── JSON body parser
│   ├── Static file serving
│   └── Error handling
├── Route Handlers
│   ├── /api/founders
│   ├── /api/blogs
│   ├── /api/gallery
│   ├── /api/careers
│   ├── /api/contact
│   ├── /api/settings
│   ├── /api/growth
│   ├── /api/chatbot
│   └── /api/upload
└── Database Connection
    ├── PostgreSQL (Production)
    └── SQLite (Development)
```

---

## 🔄 Data Flow Patterns

### **Frontend State Management**

```typescript
// AdminContext Pattern
AdminContext {
  state: {
    founders: Founder[],
    blogs: BlogPost[],
    gallery: GalleryItem[],
    careers: CareerPost[],
    settings: SiteSettings,
    messages: ContactMessage[],
    isAuthenticated: boolean
  },
  actions: {
    setFounders(), addFounder(), updateFounder(), deleteFounder(),
    setBlogs(), addBlog(), updateBlog(), deleteBlog(),
    setGallery(), addGalleryItem(), updateGalleryItem(), deleteGalleryItem(),
    // ... other CRUD operations
  }
}
```

### **API Request/Response Flow**

```
Frontend Component
├── 1. User Action (Click, Form Submit)
├── 2. Context Method Call
├── 3. HTTP Request to Backend
│   ├── Method: GET/POST/PUT/DELETE
│   ├── Headers: Content-Type, Authorization
│   └── Body: JSON payload (if applicable)
├── 4. Backend Route Handler
├── 5. Database Operation
├── 6. JSON Response
├── 7. Context State Update
└── 8. Component Re-render
```

### **File Upload Architecture**

```
File Selection (Frontend)
├── FormData creation
├── Multer middleware (Backend)
├── Disk storage (/uploads directory)
├── File path return
├── Database record update
└── UI display with file URL
```

---

## 🗄️ Database Architecture

### **Schema Design Pattern**
**Pattern**: Normalized Relational Design with JSONB for Complex Data

### **Production Schema (PostgreSQL)**
```sql
-- Core Content Tables
├── founders (id, name, role, responsibilities[], image, timestamps)
├── blogs (id, title, category, excerpt, content, date, image, seo_fields, featured, timestamps)
├── gallery (id, title, category, image, date, timestamps)
├── careers (id, title, department, vacancy, deadline, requirements[], email, active, timestamps)

-- Communication Tables
├── contact_messages (id, name, email, phone, subject, message, is_read, timestamp)
├── settings (id, site_name, tagline, contact_info, social_links, content, visitor_count, timestamp)

-- Growth Tracking
└── growth_journey (id, year, month, title, description, image, milestone_type, timestamp)
```

### **Development Schema (SQLite)**
```sql
-- Identical structure with SQLite-compatible data types
-- Uses TEXT for JSON arrays (parsed in application layer)
-- Uses INTEGER for BOOLEAN fields
-- Uses TEXT for TIMESTAMP fields
```

### **Database Connection Pattern**

```javascript
// Dual Database Support
const initializeDatabase = () => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    // PostgreSQL for production
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  } else {
    // SQLite for development
    return sql.js in-memory database
  }
}
```

---

## 🔐 Security Architecture

### **Authentication Pattern**
**Current**: Simple Credential Check
**Planned**: JWT Token-Based Authentication

```javascript
// Current Implementation
const isAuthenticated = (username, password) => {
  return username === 'admin' && password === 'tasnim@2026';
}

// Frontend Storage
localStorage.setItem('adminAuth', JSON.stringify({ authenticated: true }));
```

### **API Security Measures**
```javascript
// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN.split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// File Upload Security
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
};
```

---

## 📱 Responsive Design Architecture

### **Breakpoint Strategy**
```css
/* TailwindCSS Responsive Design */
- Mobile First: Base styles for mobile (320px+)
- sm: Small tablets (640px+)
- md: Tablets (768px+)
- lg: Small laptops (1024px+)
- xl: Large screens (1280px+)
- 2xl: Very large screens (1536px+)
```

### **Component Responsive Patterns**
```tsx
// Adaptive Layout Pattern
<div className={`
  grid 
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
  p-4 md:p-6 lg:p-8
`}>
  {/* Content adapts to screen size */}
</div>
```

---

## 🚀 Performance Architecture

### **Frontend Performance Strategies**
```typescript
// Code Splitting (Ready for implementation)
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

// Image Optimization
const optimizeImage = (src: string, width: number) => {
  return `${src}?w=${width}&q=80`;
};

// Component Memoization
const MemoizedComponent = React.memo(ExpensiveComponent);
```

### **Backend Performance Patterns**
```javascript
// Connection Pooling
const pool = new Pool({
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Response Optimization
app.use(compression()); // Gzip compression
app.use(express.static('uploads', { maxAge: '1d' })); // Static file caching
```

---

## 🔄 Error Handling Architecture

### **Frontend Error Boundaries**
```tsx
// Global Error Handling Pattern
const ErrorBoundary: React.FC = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <ErrorFallback onReset={() => setHasError(false)} />;
  }
  
  return children;
};
```

### **Backend Error Middleware**
```javascript
// Centralized Error Handling
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
};

app.use(errorHandler);
```

---

## 🌐 Deployment Architecture

### **CI/CD Pipeline**
```yaml
# GitHub Actions Workflow
Frontend Deployment:
  Build → Test → Deploy to Netlify → Verify

Backend Deployment:
  Build → Test → Deploy to Render → Database Migration → Verify

Database:
  Development: Local SQLite
  Production: Neon PostgreSQL with automated backups
```

### **Environment Management**
```
Development:
├── Frontend: localhost:5173 (Vite dev server)
├── Backend: localhost:3000 (Express server)
└── Database: SQLite (local file)

Production:
├── Frontend: Netlify CDN (Global distribution)
├── Backend: Render.com (Auto-scaling containers)
└── Database: Neon PostgreSQL (Managed cloud database)
```

---

## 🔧 Monitoring & Observability

### **Application Monitoring**
```javascript
// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### **Error Tracking**
```javascript
// Production Error Logging
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // In production: Send to error tracking service (Sentry, etc.)
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production: Send to error tracking service
});
```

---

## 🔄 Scalability Considerations

### **Frontend Scalability**
- Static file hosting via CDN (Netlify)
- Component lazy loading ready for implementation
- State management can migrate to Redux/Zustand if needed
- Bundle splitting for optimal loading performance

### **Backend Scalability**
- Stateless API design (ready for horizontal scaling)
- Database connection pooling
- File upload can migrate to cloud storage (Cloudinary configured)
- API rate limiting ready for implementation

### **Database Scalability**
- Neon PostgreSQL with read replicas support
- Connection pooling for concurrent requests
- Index optimization for query performance
- Backup and recovery strategies in place

---

This architecture provides a solid foundation for a production-ready dairy farm management system, with clear patterns for maintenance, enhancement, and scalability.