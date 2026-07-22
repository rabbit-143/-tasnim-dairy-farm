# 🚀 Deployment Checklist - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Systematic deployment verification and rollback procedures  
**Scope**: All production deployments (Frontend + Backend)

---

## 🎯 Deployment Overview

**Current Deployment Stack**:
- **Frontend**: Netlify (React SPA)
- **Backend**: Render.com (Node.js Express API)
- **Database**: Neon PostgreSQL (Production), SQLite (Development)

**Deployment Frequency**: As needed (typically weekly)  
**Deployment Window**: Weekdays 10 AM - 4 PM (avoid Friday deployments)  
**Rollback Time Target**: < 5 minutes

---

## ✅ Pre-Deployment Checklist

### **Phase 1: Local Verification** (Required)

#### **1.1 Frontend Pre-Deployment**
```bash
# 1. Pull latest code
git pull origin main

# 2. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Run TypeScript type checking
npm run type-check  # or: npx tsc --noEmit

# 4. Run build process
npm run build

# Expected output:
# ✓ Build successful
# ✓ No TypeScript errors
# ✓ Bundle size reasonable (<500KB gzipped)

# 5. Preview production build locally
npm run preview
# Visit http://localhost:4173
# Test critical user flows
```

**Frontend Verification Checklist**:
- [ ] No TypeScript compilation errors
- [ ] Build completes without warnings
- [ ] Bundle size < 500KB gzipped (check dist/ folder)
- [ ] All pages load correctly in preview
- [ ] Images load correctly
- [ ] Navigation works
- [ ] Responsive design intact (test mobile/tablet/desktop)
- [ ] No console errors in browser

---

#### **1.2 Backend Pre-Deployment**
```bash
# Navigate to backend
cd backend

# 1. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Test with production environment variables
cp .env .env.backup
# Set DATABASE_URL to production (or staging copy)
# Set NODE_ENV=production

# 3. Test server startup
npm start

# Expected output:
# ✓ Database connected successfully
# ✓ Server running on port 3000
# ✓ All routes registered

# 4. Test API endpoints
curl http://localhost:3000/health
# Expected: { "status": "ok", "database": "connected" }

curl http://localhost:3000/api/founders
# Expected: JSON array of founders
```

**Backend Verification Checklist**:
- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] All API routes respond correctly
- [ ] No deprecated dependency warnings
- [ ] Environment variables loaded correctly
- [ ] File upload directory exists and writable
- [ ] CORS configured for production domain
- [ ] Health check endpoint responds

---

### **Phase 2: Code Review** (Required)

```yaml
Git_Changes_Review:
  Command: git diff main --stat
  Check_For:
    - No accidental .env files
    - No debug code (console.log)
    - No commented-out code blocks
    - No TODO comments for critical features
    - No hardcoded credentials
    - No large binary files added

Commit_Quality:
  - [ ] Meaningful commit messages
  - [ ] Logical commit grouping
  - [ ] No merge conflicts
  - [ ] Branch up to date with main
```

---

### **Phase 3: Testing Requirements** (Required)

#### **3.1 Frontend Testing**
```yaml
Critical_User_Flows:
  Public_Site:
    - [ ] Home page loads
    - [ ] About page loads with growth timeline
    - [ ] Founders page loads with founder cards
    - [ ] Blog page loads and shows posts
    - [ ] Gallery page loads images
    - [ ] Careers page shows active jobs
    - [ ] Contact form submits successfully
    - [ ] Chatbot opens and responds
  
  Admin_Panel:
    - [ ] Admin login works (admin / tasnim@2026)
    - [ ] Dashboard shows statistics
    - [ ] Founders CRUD works (Create, Read, Update, Delete)
    - [ ] Blogs CRUD works
    - [ ] Gallery upload works (test with 2MB image)
    - [ ] Careers CRUD works
    - [ ] Messages display correctly
    - [ ] Settings update works
    - [ ] Admin logout works
    - [ ] Session persists on refresh
  
  Cross_Browser_Testing:
    - [ ] Chrome/Edge (latest)
    - [ ] Firefox (latest)
    - [ ] Safari (latest)
    - [ ] Mobile Chrome (iOS/Android)
  
  Responsive_Testing:
    - [ ] Mobile (375px width)
    - [ ] Tablet (768px width)
    - [ ] Desktop (1920px width)
```

#### **3.2 Backend Testing**
```yaml
API_Endpoint_Testing:
  Founders_API:
    - [ ] GET /api/founders returns all founders
    - [ ] GET /api/founders/:id returns single founder
    - [ ] POST /api/founders creates new founder
    - [ ] PUT /api/founders/:id updates founder
    - [ ] DELETE /api/founders/:id deletes founder
  
  Blogs_API:
    - [ ] GET /api/blogs returns all blogs
    - [ ] POST /api/blogs creates new blog
    - [ ] PUT /api/blogs/:id updates blog
    - [ ] DELETE /api/blogs/:id deletes blog
  
  Gallery_API:
    - [ ] GET /api/gallery returns all images
    - [ ] POST /api/gallery uploads new image
    - [ ] DELETE /api/gallery/:id deletes image
  
  File_Upload:
    - [ ] Upload JPG image (< 5MB)
    - [ ] Upload PNG image (< 5MB)
    - [ ] Upload WEBP image (< 5MB)
    - [ ] Reject file > 5MB
    - [ ] Reject invalid file types
  
  Database:
    - [ ] All queries return data
    - [ ] No SQL errors in logs
    - [ ] Transactions work correctly
```

---

### **Phase 4: Environment Verification** (Required)

#### **4.1 Frontend Environment Variables**
```bash
# Check .env.production file exists
ls .env.production

# Verify required variables
cat .env.production
```

**Required Frontend Variables**:
- [ ] `VITE_API_URL` set to production backend URL
- [ ] `VITE_APP_NAME` set correctly
- [ ] No development URLs in production env

---

#### **4.2 Backend Environment Variables**
```bash
# Backend .env verification (on Render.com dashboard)
```

**Required Backend Variables**:
- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `NODE_ENV=production`
- [ ] `PORT` - Usually 3000 (Render auto-assigns)
- [ ] `CORS_ORIGIN` - Production frontend URL (Netlify)
- [ ] `MAX_FILE_SIZE` - 5242880 (5MB in bytes)
- [ ] No development URLs

**Security Check**:
- [ ] No secrets in Git
- [ ] No hardcoded passwords in code
- [ ] CORS restricted to production domain only

---

### **Phase 5: Database Backup** (Required)

```bash
# Create database backup before deployment
# Run from Neon console or backup script

# Backup command (adjust for your setup):
pg_dump -h <neon-host> -U <user> -d <database> > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup file created
ls -lh backup_*.sql

# Test backup restore (optional, in staging)
# psql -h <staging-host> -U <user> -d <staging-db> < backup_YYYYMMDD_HHMMSS.sql
```

**Database Backup Checklist**:
- [ ] Backup file created
- [ ] Backup file size reasonable (not 0 bytes)
- [ ] Backup stored securely
- [ ] Backup timestamp recorded
- [ ] Restore command documented

---

## 🚀 Deployment Execution

### **Step 1: Deploy Backend** (Deploy backend FIRST)

#### **1.1 Render.com Deployment**
```yaml
Manual_Deployment:
  1. Go to Render.com dashboard
  2. Select "tasnim-dairy-farm-backend" service
  3. Click "Manual Deploy" → "Deploy latest commit"
  4. Wait for build to complete (~2-3 minutes)
  5. Check deployment logs for errors

Automatic_Deployment (if enabled):
  - Push to main branch
  - Render auto-deploys
  - Monitor deployment logs
```

#### **1.2 Backend Deployment Verification**
```bash
# 1. Test health endpoint
curl https://tasnim-dairy-farm-api.onrender.com/health
# Expected: {"status":"ok","database":"connected"}

# 2. Test API endpoints
curl https://tasnim-dairy-farm-api.onrender.com/api/founders
# Expected: JSON array

# 3. Check backend logs
# In Render dashboard: View logs for errors
```

**Backend Deployment Checklist**:
- [ ] Deployment completed successfully
- [ ] Health endpoint responds
- [ ] API endpoints respond with data
- [ ] Database connection successful
- [ ] No errors in deployment logs
- [ ] Response time < 2 seconds (after cold start)

---

### **Step 2: Deploy Frontend** (Deploy frontend AFTER backend)

#### **2.1 Netlify Deployment**
```yaml
Automatic_Deployment:
  1. Push to main branch (or production branch)
  2. Netlify auto-deploys
  3. Monitor deployment status in Netlify dashboard
  
Manual_Deployment:
  1. Run: npm run build
  2. Go to Netlify dashboard
  3. Drag dist/ folder to deploy
  4. Wait for deployment (~1 minute)
```

#### **2.2 Frontend Deployment Verification**
```bash
# 1. Visit production URL
# https://tasnim-dairy-farm.netlify.app

# 2. Check browser console for errors
# Open DevTools → Console (should be clean)

# 3. Test API connectivity
# Open any page that fetches data (Founders, Blogs, etc.)
# Verify data loads correctly
```

**Frontend Deployment Checklist**:
- [ ] Deployment completed successfully
- [ ] Site loads at production URL
- [ ] No console errors
- [ ] API requests work (check Network tab)
- [ ] Images load correctly
- [ ] All pages accessible
- [ ] Mobile responsive design intact

---

## ✅ Post-Deployment Verification

### **Phase 1: Immediate Checks** (Within 5 minutes)

#### **1.1 Smoke Testing**
```yaml
Public_Site_Smoke_Test:
  1. Visit homepage → Should load in < 3 seconds
  2. Click "About" → Timeline should load
  3. Click "Founders" → Founder cards should display
  4. Click "Blog" → Blog posts should display
  5. Click "Gallery" → Images should display
  6. Click "Careers" → Job listings should display
  7. Submit contact form → Should submit successfully
  8. Open chatbot → Should respond to Bengali greeting

Admin_Panel_Smoke_Test:
  1. Login to admin panel (admin / tasnim@2026)
  2. Check dashboard statistics display
  3. Create test founder → Should save
  4. Delete test founder → Should delete
  5. Upload test image to gallery → Should upload
  6. Logout → Should redirect to login

Expected_Results:
  - All pages load successfully
  - No 404 errors
  - No CORS errors
  - Data displays correctly
  - Forms submit successfully
```

#### **1.2 Performance Verification**
```yaml
Performance_Metrics:
  - [ ] Homepage loads in < 3 seconds (first visit)
  - [ ] Subsequent pages load in < 1 second
  - [ ] API response time < 2 seconds
  - [ ] Images load progressively
  - [ ] No layout shifts (CLS)

Tools:
  - Chrome DevTools → Lighthouse
  - Network tab → Check load times
  - Performance tab → Check rendering
```

#### **1.3 Error Monitoring**
```yaml
Frontend_Error_Check:
  - Open browser console
  - Navigate all pages
  - Check for JavaScript errors
  - Check for CORS errors
  - Check for 404 errors

Backend_Error_Check:
  - Check Render logs
  - Look for 500 errors
  - Check database connection errors
  - Check file upload errors
```

---

### **Phase 2: Extended Monitoring** (First 1-2 hours)

```yaml
Monitor:
  Frontend:
    - Check Netlify analytics for traffic
    - Monitor error rate
    - Check lighthouse score
  
  Backend:
    - Monitor Render metrics
    - Check API response times
    - Monitor database connections
    - Check error logs
  
  Database:
    - Check Neon dashboard
    - Monitor query performance
    - Check connection pool usage

Alert_Thresholds:
  - Error rate > 1%
  - API response time > 3 seconds
  - Database connection failures
  - HTTP 500 errors
```

---

### **Phase 3: User Acceptance** (First 24 hours)

```yaml
User_Testing:
  - [ ] Ask team to test all features
  - [ ] Monitor contact form submissions
  - [ ] Check chatbot interactions
  - [ ] Verify admin panel works for all admins

Metrics_To_Track:
  - Page load times
  - Error rate
  - API success rate
  - User complaints/feedback
```

---

## 🔄 Rollback Procedures

### **When to Rollback**

```yaml
Immediate_Rollback_Required:
  - Site completely down
  - Database connection failures
  - Critical functionality broken
  - Security vulnerability exposed
  - Data loss occurring

Consider_Rollback:
  - Error rate > 5%
  - Major features broken
  - Performance degradation > 50%
  - User-reported critical bugs

No_Rollback_Needed:
  - Minor UI issues
  - Non-critical bugs
  - Cosmetic problems
  - Performance degradation < 20%
```

---

### **Frontend Rollback** (< 2 minutes)

#### **Option 1: Netlify UI Rollback**
```yaml
Steps:
  1. Go to Netlify dashboard
  2. Click "Deploys"
  3. Find previous successful deployment
  4. Click "Publish deploy"
  5. Wait ~1 minute for rollback
  6. Verify site works

Time: ~2 minutes
```

#### **Option 2: Git Rollback + Redeploy**
```bash
# 1. Revert commit
git revert HEAD
git push origin main

# 2. Netlify auto-deploys previous version
# Or manually trigger deploy

# Time: ~3-4 minutes
```

---

### **Backend Rollback** (< 3 minutes)

#### **Option 1: Render UI Rollback**
```yaml
Steps:
  1. Go to Render dashboard
  2. Select service
  3. Click "Rollback" on previous deploy
  4. Wait ~2 minutes for rollback
  5. Verify API works

Time: ~3 minutes
```

#### **Option 2: Git Rollback + Redeploy**
```bash
# 1. Revert backend changes
cd backend
git revert HEAD
git push origin main

# 2. Render auto-deploys
# Time: ~3-4 minutes
```

---

### **Database Rollback** (< 10 minutes)

**⚠️ WARNING: Database rollback is HIGH RISK**

```yaml
When_Needed:
  - Schema migration failed
  - Data corruption occurred
  - Wrong data update executed

Process:
  1. Stop backend server (prevent writes)
  2. Restore from backup:
     psql -h <neon-host> -U <user> -d <database> < backup_YYYYMMDD_HHMMSS.sql
  3. Verify data integrity
  4. Restart backend server
  5. Test all functionality

Time: ~10-15 minutes
Risk: HIGH (potential data loss)
```

---

### **Complete System Rollback** (< 5 minutes)

```yaml
Full_Rollback_Steps:
  1. Rollback backend first (2-3 min)
  2. Verify backend works
  3. Rollback frontend (2 min)
  4. Verify frontend works
  5. Test critical flows

Total_Time: ~5 minutes
```

---

## 📊 Deployment Metrics

### **Track Per Deployment**

```yaml
Deployment_Record:
  Date: YYYY-MM-DD
  Time: HH:MM (timezone)
  Deployed_By: Name
  Git_Commit: [commit hash]
  
  Changes:
    - Feature: [description]
    - Bug_Fix: [description]
  
  Deployment_Duration:
    Backend: X minutes
    Frontend: X minutes
    Total: X minutes
  
  Status: SUCCESS / FAILED / ROLLED_BACK
  
  Issues:
    - [Any issues encountered]
  
  Rollback:
    Required: Yes/No
    Reason: [if applicable]
    Time_To_Rollback: X minutes
```

---

## 🎯 Deployment Best Practices

### **DO's**
```yaml
✅ Deploy during business hours (10 AM - 4 PM)
✅ Deploy backend before frontend
✅ Test in production immediately after deploy
✅ Have rollback plan ready
✅ Monitor for 1-2 hours after deploy
✅ Backup database before schema changes
✅ Communicate deployment to team
✅ Document any issues encountered
```

### **DON'Ts**
```yaml
❌ Don't deploy on Fridays
❌ Don't deploy late night/weekends
❌ Don't deploy without testing locally
❌ Don't deploy multiple changes at once
❌ Don't deploy without database backup
❌ Don't ignore warning signs
❌ Don't deploy untested code
❌ Don't skip verification steps
```

---

## 🚨 Emergency Contacts

```yaml
Technical_Issues:
  Frontend: [Netlify Support]
  Backend: [Render Support]
  Database: [Neon Support]

Project_Team:
  Lead_Developer: [Contact]
  Admin: [Contact]
```

---

## 📋 Deployment History Template

```yaml
# Copy this for each deployment

Deployment_YYYYMMDD_HHMM:
  Status: [SUCCESS/FAILED/ROLLED_BACK]
  Deployed_By: [Name]
  Git_Commit: [hash]
  
  Pre_Deployment:
    - [ ] Local tests passed
    - [ ] Code review completed
    - [ ] Database backup created
  
  Deployment:
    - Backend_Deploy_Time: [X minutes]
    - Frontend_Deploy_Time: [X minutes]
  
  Post_Deployment:
    - [ ] Smoke tests passed
    - [ ] Performance acceptable
    - [ ] No critical errors
  
  Issues:
    - [List any issues]
  
  Rollback:
    - Required: [Yes/No]
    - Reason: [If applicable]
```

---

**Remember: Always test thoroughly before deployment. A good deployment is boring - nothing unexpected happens.**
