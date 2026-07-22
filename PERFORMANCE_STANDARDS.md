# ⚡ Performance Standards - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Define performance budgets and optimization strategies  
**Scope**: Frontend, Backend, Database, and Network Performance

---

## 🎯 Performance Philosophy

**Performance is not optional—it's a feature.** Users expect:
- Fast page loads (< 3 seconds)
- Instant interactions (< 100ms)
- Smooth animations (60 FPS)
- Reliable API responses (< 2 seconds)

**Poor performance directly impacts**:
- User satisfaction and retention
- SEO rankings (Core Web Vitals)
- Conversion rates
- Business reputation

---

## 📊 Performance Budgets

### **Frontend Performance Budgets**

#### **Page Load Metrics**
```yaml
First_Contentful_Paint (FCP):
  Target: < 1.5 seconds
  Acceptable: < 2.5 seconds
  Poor: > 2.5 seconds
  How_To_Measure: Lighthouse, Chrome DevTools
  
Largest_Contentful_Paint (LCP):
  Target: < 2.5 seconds
  Acceptable: < 4.0 seconds
  Poor: > 4.0 seconds
  Impact: Core Web Vital (affects SEO)
  
First_Input_Delay (FID):
  Target: < 100ms
  Acceptable: < 300ms
  Poor: > 300ms
  Impact: Core Web Vital (affects SEO)
  
Cumulative_Layout_Shift (CLS):
  Target: < 0.1
  Acceptable: < 0.25
  Poor: > 0.25
  Impact: Core Web Vital (affects SEO)
  
Time_To_Interactive (TTI):
  Target: < 3.5 seconds
  Acceptable: < 5.0 seconds
  Poor: > 5.0 seconds
  
Total_Blocking_Time (TBT):
  Target: < 200ms
  Acceptable: < 600ms
  Poor: > 600ms
```

#### **Bundle Size Budgets**
```yaml
Initial_JavaScript:
  Target: < 200 KB (gzipped)
  Acceptable: < 350 KB (gzipped)
  Poor: > 500 KB (gzipped)
  Current: Check with: npm run build
  
Initial_CSS:
  Target: < 50 KB (gzipped)
  Acceptable: < 100 KB (gzipped)
  Poor: > 150 KB (gzipped)
  
Total_Initial_Bundle:
  Target: < 250 KB (gzipped)
  Acceptable: < 450 KB (gzipped)
  Poor: > 650 KB (gzipped)
  
Image_Size_Per_Page:
  Target: < 500 KB total per page
  Acceptable: < 1 MB total per page
  Poor: > 1.5 MB total per page
```

#### **Runtime Performance**
```yaml
React_Component_Render:
  Target: < 16ms (60 FPS)
  Acceptable: < 33ms (30 FPS)
  Poor: > 33ms
  
Animation_Frame_Rate:
  Target: 60 FPS consistently
  Acceptable: > 30 FPS average
  Poor: < 30 FPS
  
Memory_Usage:
  Target: < 50 MB
  Acceptable: < 100 MB
  Poor: > 150 MB
  Watch_For: Memory leaks over time
```

---

### **Backend Performance Budgets**

#### **API Response Times**
```yaml
Health_Check_Endpoint:
  Target: < 100ms
  Acceptable: < 200ms
  Poor: > 500ms
  Endpoint: GET /health
  
Simple_GET_Requests (list all):
  Target: < 500ms
  Acceptable: < 1000ms
  Poor: > 2000ms
  Examples: GET /api/founders, GET /api/blogs
  
Single_Item_GET_Requests:
  Target: < 200ms
  Acceptable: < 500ms
  Poor: > 1000ms
  Examples: GET /api/founders/:id
  
POST_Requests (create):
  Target: < 500ms
  Acceptable: < 1000ms
  Poor: > 2000ms
  Examples: POST /api/founders
  
PUT_Requests (update):
  Target: < 500ms
  Acceptable: < 1000ms
  Poor: > 2000ms
  
DELETE_Requests:
  Target: < 300ms
  Acceptable: < 500ms
  Poor: > 1000ms
  
File_Upload_Requests:
  Target: < 3 seconds (for 5MB file)
  Acceptable: < 5 seconds
  Poor: > 10 seconds
  Note: Excludes network transfer time
  
Cold_Start (Render.com):
  Expected: 15-30 seconds (first request after idle)
  Mitigation: Keep-alive ping or upgrade plan
  Not_Counted_In: Normal response time metrics
```

#### **Server Resource Usage**
```yaml
CPU_Usage:
  Target: < 50% average
  Acceptable: < 70% average
  Poor: > 80% sustained
  
Memory_Usage:
  Target: < 256 MB
  Acceptable: < 512 MB
  Poor: > 1 GB
  
Response_Size:
  Target: < 100 KB per response
  Acceptable: < 500 KB per response
  Poor: > 1 MB per response
```

---

### **Database Performance Budgets**

#### **Query Execution Times**
```yaml
Simple_SELECT (single row):
  Target: < 10ms
  Acceptable: < 50ms
  Poor: > 100ms
  Example: SELECT * FROM founders WHERE id = $1
  
List_Query (all rows):
  Target: < 50ms
  Acceptable: < 200ms
  Poor: > 500ms
  Example: SELECT * FROM founders ORDER BY created_at
  
JOIN_Query:
  Target: < 100ms
  Acceptable: < 300ms
  Poor: > 500ms
  
INSERT_Query:
  Target: < 20ms
  Acceptable: < 100ms
  Poor: > 200ms
  
UPDATE_Query:
  Target: < 30ms
  Acceptable: < 100ms
  Poor: > 200ms
  
DELETE_Query:
  Target: < 20ms
  Acceptable: < 50ms
  Poor: > 100ms
```

#### **Database Connections**
```yaml
Connection_Pool_Size:
  Minimum: 5
  Default: 10
  Maximum: 20
  Current: Check Neon dashboard
  
Active_Connections:
  Target: < 50% of pool
  Alert_If: > 80% of pool
  Critical_If: > 95% of pool
  
Connection_Wait_Time:
  Target: < 10ms
  Acceptable: < 50ms
  Poor: > 100ms
```

---

## 🔍 Performance Monitoring

### **Tools and Metrics**

#### **Frontend Monitoring**
```yaml
Development:
  - Chrome DevTools → Lighthouse (run monthly)
  - Chrome DevTools → Performance tab (profile slow pages)
  - React DevTools → Profiler (identify slow components)
  - Network tab → Check bundle sizes and load times
  
Production:
  - Netlify Analytics (page views, load times)
  - Google PageSpeed Insights (monthly audit)
  - Core Web Vitals (monitor via Search Console)
  - Real User Monitoring (RUM) - future addition

Commands:
  # Check bundle size
  npm run build
  # Check in dist/ folder sizes
```

#### **Backend Monitoring**
```yaml
Development:
  - Console timing logs
  - Postman/Thunder Client (API response times)
  - Database query EXPLAIN ANALYZE
  
Production:
  - Render.com metrics dashboard
  - API response time monitoring
  - Error rate tracking
  - Neon database metrics

Commands:
  # Time API request
  time curl https://api.domain.com/api/founders
```

#### **Database Monitoring**
```yaml
Development:
  - SQLite: No built-in monitoring (lightweight)
  
Production:
  - Neon dashboard: Query performance
  - Connection pool usage
  - Slow query log (> 1 second)
  - Active connections count

Commands:
  # PostgreSQL query performance
  EXPLAIN ANALYZE SELECT * FROM founders;
```

---

## ⚡ Optimization Strategies

### **Frontend Optimizations**

#### **1. Code Splitting**
```yaml
Current_Status: Single bundle (no code splitting yet)
Target: Split by routes

Implementation:
  # Use React.lazy() for route-based splitting
  const HomePage = React.lazy(() => import('./pages/HomePage'));
  const AboutPage = React.lazy(() => import('./pages/AboutPage'));
  const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
  
  # Wrap with Suspense
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  </Suspense>

Expected_Improvement:
  - Initial bundle: 350KB → 150KB (57% reduction)
  - FCP: 2.0s → 1.2s (40% faster)

Priority: MEDIUM
Effort: 2-3 hours
```

#### **2. Image Optimization**
```yaml
Current_Status: Original images uploaded (no compression)
Target: Compressed and optimized images

Implementation:
  Option_1_Server_Side:
    # Install sharp
    npm install sharp
    
    # In multer upload handler
    const sharp = require('sharp');
    await sharp(file.path)
      .resize(1200, 800, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  
  Option_2_CDN (Recommended):
    # Use Cloudinary with automatic optimization
    # Already configured in .env.example

Expected_Improvement:
  - Image size: 2MB → 200KB (90% reduction)
  - LCP: 3.5s → 1.8s (49% faster)
  - Gallery page load: 5s → 2s (60% faster)

Priority: HIGH
Effort: 3-4 hours
```

#### **3. Lazy Loading Images**
```yaml
Current_Status: Some images use loading="lazy"
Target: All images lazy loaded

Implementation:
  <img 
    src={imageUrl} 
    alt={description}
    loading="lazy"
    decoding="async"
  />

Expected_Improvement:
  - Initial page weight: -30%
  - FCP: -20%

Priority: HIGH
Effort: 30 minutes (search and replace)
```

#### **4. React Performance**
```yaml
Optimizations:
  useMemo:
    Use_For: Expensive computations
    Example:
      const filteredBlogs = useMemo(() => {
        return blogs.filter(blog => blog.category === selectedCategory);
      }, [blogs, selectedCategory]);
  
  useCallback:
    Use_For: Functions passed to child components
    Example:
      const handleDelete = useCallback((id) => {
        deleteFounder(id);
      }, [deleteFounder]);
  
  React.memo:
    Use_For: Pure components that re-render often
    Example:
      const FounderCard = React.memo(({ founder }) => {
        return <div>...</div>;
      });

Priority: MEDIUM
Effort: Ongoing (apply as needed)
```

#### **5. Font Optimization**
```yaml
Current_Status: Using system fonts (good!)
If_Custom_Fonts_Added:
  - Use font-display: swap
  - Preload critical fonts
  - Subset fonts to needed characters
  - Use modern formats (WOFF2)

Example:
  <link 
    rel="preload" 
    href="/fonts/custom.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin 
  />
```

---

### **Backend Optimizations**

#### **1. Database Query Optimization**
```yaml
Current_Status: Basic queries, no indexing strategy
Target: Optimized queries with proper indexes

Optimizations:
  Add_Indexes:
    # For frequently queried columns
    CREATE INDEX idx_founders_created_at ON founders(created_at DESC);
    CREATE INDEX idx_blogs_category ON blogs(category);
    CREATE INDEX idx_blogs_featured ON blogs(featured) WHERE featured = true;
  
  Optimize_Queries:
    # Avoid SELECT *
    ❌ SELECT * FROM founders;
    ✅ SELECT id, name, role, image FROM founders;
    
    # Use LIMIT for lists
    ✅ SELECT * FROM blogs ORDER BY created_at DESC LIMIT 50;
    
    # Avoid N+1 queries (use JOINs)
    ❌ Query founders, then query posts for each founder
    ✅ Single query with LEFT JOIN

Expected_Improvement:
  - List queries: 500ms → 50ms (90% faster)
  - API response time: 1000ms → 300ms (70% faster)

Priority: HIGH
Effort: 4-6 hours
```

#### **2. Response Caching**
```yaml
Current_Status: No caching (fresh data every request)
Target: Cache static/semi-static data

Implementation:
  # Simple in-memory cache
  const cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  router.get('/api/founders', async (req, res) => {
    const cacheKey = 'founders:all';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }
    
    const data = await pool.query('SELECT * FROM founders');
    cache.set(cacheKey, { data: data.rows, timestamp: Date.now() });
    
    res.json(data.rows);
  });

Cache_Strategy:
  Public_Pages: Cache for 5 minutes
  Admin_Pages: No cache (always fresh)
  Settings: Cache for 10 minutes
  Static_Content: Cache for 1 hour

Expected_Improvement:
  - Cached requests: 500ms → 10ms (98% faster)
  - Database load: -70%

Priority: MEDIUM
Effort: 3-4 hours
Risk: Stale data (mitigate with short TTL)
```

#### **3. Compression**
```yaml
Current_Status: No compression middleware
Target: Gzip/Brotli compression enabled

Implementation:
  # Install compression
  npm install compression
  
  # In server.js
  const compression = require('compression');
  app.use(compression());

Expected_Improvement:
  - Response size: 100KB → 20KB (80% reduction)
  - Network transfer time: -80%

Priority: HIGH
Effort: 15 minutes
```

#### **4. Connection Pooling**
```yaml
Current_Status: Using pg pool (already optimized)
Configuration: Default settings

Optimization:
  # In database.js
  const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 20,                    // Maximum connections
    min: 2,                     // Minimum connections
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 2000, // Fail fast if no connection available
  });

Monitor:
  - Active connections should be < 10 normally
  - Alert if > 15 sustained

Priority: LOW (already configured)
```

---

### **Database Optimizations**

#### **1. Indexing Strategy**
```yaml
Critical_Indexes:
  Founders:
    - id (PRIMARY KEY - automatic)
    - created_at (for ORDER BY)
  
  Blogs:
    - id (PRIMARY KEY)
    - created_at (for ORDER BY)
    - category (for filtering)
    - featured (for homepage)
  
  Gallery:
    - id (PRIMARY KEY)
    - category (for filtering)
  
  Careers:
    - id (PRIMARY KEY)
    - status (for active/inactive filtering)

Create_Commands:
  CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
  CREATE INDEX IF NOT EXISTS idx_careers_status ON careers(status);

Priority: HIGH
Effort: 1 hour
```

#### **2. Query Optimization**
```yaml
Use_EXPLAIN:
  # Before optimizing, understand query plan
  EXPLAIN ANALYZE SELECT * FROM blogs WHERE category = 'dairy';
  
  # Look for:
  - Sequential scans (bad) vs Index scans (good)
  - High row counts
  - Slow operations

Optimization_Patterns:
  # Limit results
  SELECT * FROM blogs LIMIT 50;
  
  # Select only needed columns
  SELECT id, title, excerpt FROM blogs;
  
  # Use WHERE to filter early
  SELECT * FROM blogs WHERE featured = true LIMIT 10;
```

---

## 📊 Performance Testing Workflow

### **Before Every Release**

```yaml
Step_1_Frontend_Performance:
  1. Run Lighthouse audit:
     - Open Chrome DevTools
     - Go to Lighthouse tab
     - Run audit in "Desktop" mode
     - Target: Performance score > 85
  
  2. Check bundle size:
     - npm run build
     - Check dist/ folder
     - Target: Total < 500KB gzipped
  
  3. Test on slow 3G:
     - Chrome DevTools → Network tab
     - Throttle to "Slow 3G"
     - Pages should load in < 10 seconds

Step_2_Backend_Performance:
  1. Test API response times:
     curl -w "@curl-format.txt" -o /dev/null -s https://api.domain.com/api/founders
     # Target: < 1000ms
  
  2. Check database query times:
     # In PostgreSQL
     EXPLAIN ANALYZE SELECT * FROM founders;
     # Target: < 50ms
  
  3. Monitor Render metrics:
     - Check response time graphs
     - Target: Average < 1000ms

Step_3_Load_Testing (Optional):
  # Use Apache Bench or similar
  ab -n 1000 -c 10 https://api.domain.com/api/founders
  # Target: No errors, response time < 2s
```

---

## 🚨 Performance Alerts

### **When to Investigate**

```yaml
Red_Alerts (Immediate Action):
  - Lighthouse performance score < 50
  - API response time > 5 seconds
  - Page load time > 10 seconds
  - Database query > 2 seconds
  - Bundle size > 1 MB gzipped

Yellow_Alerts (Plan Optimization):
  - Lighthouse performance score < 70
  - API response time > 2 seconds
  - Page load time > 5 seconds
  - Database query > 500ms
  - Bundle size > 500 KB gzipped

Green (Acceptable):
  - Lighthouse performance score > 85
  - API response time < 1 second
  - Page load time < 3 seconds
  - Database query < 200ms
  - Bundle size < 350 KB gzipped
```

---

## 📋 Performance Optimization Roadmap

### **Q2 2026 (High Priority)**
```yaml
1. Image_Optimization:
   - Implement sharp for compression
   - Or migrate to Cloudinary
   - Target: 80% image size reduction
   Effort: 3-4 hours

2. Backend_Compression:
   - Add compression middleware
   - Target: 80% response size reduction
   Effort: 15 minutes

3. Database_Indexing:
   - Add critical indexes
   - Target: 80% query time reduction
   Effort: 1 hour
```

### **Q3 2026 (Medium Priority)**
```yaml
4. Code_Splitting:
   - Split by routes
   - Target: 40% initial bundle reduction
   Effort: 2-3 hours

5. Response_Caching:
   - Cache public endpoints
   - Target: 90% response time reduction (cached)
   Effort: 3-4 hours

6. React_Optimization:
   - Add useMemo/useCallback where needed
   - Memo expensive components
   Effort: Ongoing
```

### **Q4 2026 (Nice to Have)**
```yaml
7. CDN_Migration:
   - Move images to Cloudinary
   - Target: Global delivery, faster loads
   Effort: 4-6 hours

8. Service_Worker:
   - Add PWA support
   - Cache assets for offline
   Effort: 6-8 hours
```

---

**Remember: Performance is not a one-time task—it's an ongoing commitment. Measure regularly, optimize continuously, and never regress.**
