# Production Deployment Guide - Tasnim Dairy Farm

## Overview
This guide walks you through deploying the Tasnim Dairy Farm project to production using:
- **Frontend**: Netlify (auto-deploys from GitHub)
- **Backend**: Render (auto-deploys from GitHub)
- **Database**: Neon PostgreSQL (production-grade managed PostgreSQL)

## Architecture

```
GitHub Repository
    ├── GitHub Actions (optional)
    │
    ├── → Netlify (Frontend)
    │     └── Builds & deploys React frontend
    │
    └── → Render (Backend)
          └── Deploys Node.js API + connects to Neon
                    ↓
                Neon PostgreSQL
                (Production Database)
```

## Prerequisites

- GitHub account with the repository
- Netlify account (free tier works)
- Render account (https://render.com)
- Neon account (https://neon.tech) - Free tier includes 3 projects
- Credit card on file (for unused resources cleanup)

---

## Part 1: Database Setup (Neon PostgreSQL)

### 1.1 Create Neon Project

1. Go to https://neon.tech
2. Sign up or log in
3. Create a new project:
   - **Project name**: `tasnim-dairy-farm-prd`
   - **Region**: Choose closest to your users (Asia = Tokyo or Singapore)
   - **Postgres version**: 15 or 16 (latest stable)
4. Click "Create project"

### 1.2 Get Database Connection String

1. In Neon console, go to "Connection strings"
2. Select "Role" dropdown → Choose your role (default: neondb_owner)
3. Copy the **Connection String** (starts with `postgresql://`)
   - Format: `postgresql://username:password@host/database?sslmode=require`
4. Save this securely - you'll need it for Render

### 1.3 Initialize Database Schema

1. In Neon console, click **SQL Editor**
2. Copy-paste the entire content from `DATABASE_MIGRATION.sql` (see Part 5 below)
3. Click "Execute"
4. Verify tables are created:
   - `founders`
   - `blogs`
   - `gallery`
   - `careers`
   - `settings`
   - `contact_messages`

✅ Database is ready!

---

## Part 2: Backend Deployment (Render)

### 2.1 Connect GitHub to Render

1. Go to https://render.com
2. Sign up or log in
3. Go to **Dashboard** → **New** → **Web Service**
4. Select **Connect GitHub repository**
5. Authorize Render to access your GitHub account
6. Select the repository containing your project

### 2.2 Configure Render Service

1. Fill in the service details:
   - **Name**: `tasnim-dairy-farm-api`
   - **Environment**: `Node`
   - **Build command**: `cd backend && npm install`
   - **Start command**: `cd backend && npm start`
   - **Instance Type**: Free (sufficient for small projects)

2. Click **Create Web Service**

### 2.3 Add Environment Variables

1. In Render dashboard, go to your service → **Environment**
2. Add these environment variables:

   | Key | Value | Example |
   |-----|-------|---------|
   | `NODE_ENV` | `production` | `production` |
   | `DATABASE_URL` | Your Neon connection string | `postgresql://user:pass@host/db?sslmode=require` |
   | `CORS_ORIGIN` | Your Netlify domain | `https://tasnim-dairy-farm.netlify.app` |
   | `PORT` | Leave empty (Render assigns automatically) | |

3. Click **Save changes**
4. Render will automatically deploy

### 2.4 Verify Backend Deployment

1. Render will show a live URL like: `https://tasnim-dairy-farm-api.onrender.com`
2. Test the health endpoint:
   ```bash
   curl https://tasnim-dairy-farm-api.onrender.com/api/health
   ```
3. Expected response:
   ```json
   {"status": "ok", "message": "Tasnim Dairy Farm API is running"}
   ```

✅ Backend is deployed!

**Note**: Free tier on Render goes to sleep after 15 minutes of inactivity. Consider upgrading to Starter ($12/month) for production.

---

## Part 3: Frontend Deployment (Netlify)

### 3.1 Connect GitHub to Netlify

1. Go to https://netlify.com
2. Sign up or log in
3. Click **Add new site** → **Import an existing project**
4. Select **GitHub**
5. Authorize and select your repository

### 3.2 Configure Build Settings

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Base directory**: (leave empty)

### 3.3 Add Environment Variables

1. In Netlify, go to **Site settings** → **Build & deploy** → **Environment**
2. Add environment variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://tasnim-dairy-farm-api.onrender.com` (your Render URL)

3. Click **Save**

### 3.4 Trigger Deploy

1. Netlify will auto-build and deploy
2. You'll get a URL like: `https://tasnim-dairy-farm.netlify.app`
3. Check deployment status in **Deploys**

✅ Frontend is deployed!

---

## Part 4: Update Frontend Configuration

### 4.1 Update API Base URL

Edit your frontend environment files:

**`.env.production`** (create this file):
```env
VITE_API_BASE_URL=https://tasnim-dairy-farm-api.onrender.com
```

**`.env.development`** (local development):
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4.2 Update Frontend Code

Ensure your API calls use the environment variable:

**`src/services/api.ts`** (or similar):
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = {
  get: (endpoint: string) => 
    fetch(`${API_BASE_URL}/api${endpoint}`).then(r => r.json()),
  post: (endpoint: string, data: any) =>
    fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
  // ... other methods
};
```

---

## Part 5: Database Migration Script

Create file: **`backend/DATABASE_MIGRATION.sql`**

```sql
-- Tasnim Dairy Farm Production Database Schema

-- Founders Table
CREATE TABLE IF NOT EXISTS founders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  seoTitle TEXT,
  metaDescription TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Farm Images', 'Cattle Images', 'Production Images', 'Events')),
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Careers Table
CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  vacancy INTEGER NOT NULL CHECK (vacancy > 0),
  deadline TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  applyEmail TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  siteName TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  mapEmbed TEXT,
  facebook TEXT,
  instagram TEXT,
  whatsapp TEXT,
  youtube TEXT,
  linkedin TEXT,
  aboutContent TEXT,
  vision TEXT,
  mission JSONB DEFAULT '[]'::jsonb,
  visitors INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(active);
CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_messages(is_read);

-- Insert default settings (only on first creation)
INSERT INTO settings (id, siteName, tagline, phone, email, address, mapEmbed, facebook, instagram, whatsapp, youtube, linkedin, aboutContent, vision, mission)
VALUES (
  1,
  'Tasnim Dairy Farm',
  'Pure Milk, Pure Promise',
  '+880 1700-000000',
  'info@tasnimdairyfarm.com',
  'Tasnim Dairy Farm Complex, Dhaka, Bangladesh',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902139408672!2d90.39919931498205!3d23.750945884591076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1614930164854!5m2!1sen!2sbd',
  'https://facebook.com/tasnim-dairy-farm',
  'https://instagram.com/tasnim-dairy-farm',
  'https://wa.me/8801700000000',
  'https://youtube.com/@tasnim-dairy-farm',
  'https://linkedin.com/company/tasnim-dairy-farm',
  'Tasnim Dairy Farm was established on 14 February 2026 by four passionate founders with a vision to produce pure, safe, and high-quality milk.',
  'To become one of the most trusted dairy farms in Bangladesh and establish a globally recognized dairy supply network.',
  '["Produce healthy and pure milk", "Maintain the highest farm hygiene standards", "Ensure animal welfare", "Create employment", "Support sustainable practices"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert default founders (only on first creation)
INSERT INTO founders (name, role, responsibilities, image)
VALUES 
  ('Mobasshera Sultana', 'CEO & Founder', '["Strategic Leadership", "Farm Management", "Growth Planning"]'::jsonb, NULL),
  ('Johirul Islam', 'Co-Founder', '["Operations", "Expansion Planning", "Resource Management"]'::jsonb, NULL),
  ('Rakibul Hasan Rahat', 'Founder & Marketing Lead', '["Branding", "Marketing", "Public Relations"]'::jsonb, NULL),
  ('Anjhum Akter', 'Founder & Accountant', '["Financial Management", "Accounting", "Budget Planning"]'::jsonb, NULL)
ON CONFLICT DO NOTHING;
```

Save this file and run it in Neon's SQL editor as described in Part 1.3.

---

## Part 6: Environment Variables Checklist

### Backend (.env in `backend/` directory):

```env
# Production Environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# CORS
CORS_ORIGIN=https://tasnim-dairy-farm.netlify.app

# Optional
LOG_LEVEL=info
```

### Frontend (.env files):

**`.env.production`**:
```env
VITE_API_BASE_URL=https://tasnim-dairy-farm-api.onrender.com
VITE_APP_NAME=Tasnim Dairy Farm
```

**`.env.development`**:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Tasnim Dairy Farm (Dev)
```

---

## Part 7: Automatic GitHub Deployments

### Setup Git Workflow

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```

2. **Netlify auto-detects changes** → builds & deploys frontend
3. **Render auto-detects changes** → builds & deploys backend
4. **Both go live automatically!**

### Deployment Times
- **Frontend**: 1-3 minutes
- **Backend**: 2-5 minutes (may take longer on cold start)

---

## Part 8: File Upload Handling

### Local Development
Files upload to `backend/uploads/` directory (disk storage)

### Production (Render)
**⚠️ Important**: Render has an ephemeral file system. Files uploaded won't persist between deployments.

**Solution**: Use cloud storage like Cloudinary or AWS S3

### Recommended: Use Cloudinary (Free tier)

1. Sign up at https://cloudinary.com
2. Get your `CLOUD_NAME` and `API_KEY`
3. Update backend `server.js`:

```javascript
// Replace disk storage with Cloudinary
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tasnim-dairy-farm',
    resource_type: 'auto'
  }
});

const upload = multer({ storage });
```

4. Add to Render environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. Install packages:
   ```bash
   npm install cloudinary multer-storage-cloudinary
   ```

---

## Part 9: Testing Production Setup

### Test Backend API
```bash
# Health check
curl https://tasnim-dairy-farm-api.onrender.com/api/health

# Get all founders
curl https://tasnim-dairy-farm-api.onrender.com/api/founders

# Get settings
curl https://tasnim-dairy-farm-api.onrender.com/api/settings
```

### Test Frontend
1. Visit: https://tasnim-dairy-farm.netlify.app
2. Admin panel should work
3. Any updates should hit the production API

### Test Admin Updates
1. Go to Admin Panel
2. Update a blog post / gallery image
3. Refresh the website
4. Changes should appear immediately

---

## Part 10: Monitoring & Maintenance

### Render Dashboard
- Check deployment history
- View logs for errors
- Monitor uptime

### Netlify Dashboard
- Check build logs
- Preview deployments
- Monitor analytics

### Neon Console
- Monitor query performance
- Check storage usage
- View connection logs

### Add Health Monitoring
Consider using free services like:
- **Render**: Built-in monitoring
- **Netlify**: Built-in analytics
- **UptimeRobot** (free tier): Monitors if API is up

---

## Part 11: Troubleshooting

### Backend showing errors on Render

1. Check logs: Render Dashboard → Service → Logs
2. Verify `DATABASE_URL` is correct
3. Ensure Neon credentials are valid
4. Check if tables exist in Neon

### Frontend not connecting to API

1. Check `VITE_API_BASE_URL` in Netlify environment
2. Verify Render backend is running
3. Check browser console for CORS errors

### Admin changes not persisting

1. Check backend logs for SQL errors
2. Verify database connection
3. Ensure tables exist in Neon
4. Check file permissions

### Cold start delays on Render

- This is normal on free tier
- Upgrade to Starter ($12/month) to prevent sleeping
- Or use https://kaffeine.herokuapp.com (alternative)

---

## Part 12: Cost Breakdown (Monthly)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Neon PostgreSQL | Free | $0 | Up to 3 projects, 3GB storage |
| Render Backend | Free | $0 | Sleeps after 15 min inactivity |
| Render Backend | Starter | $12 | Recommended for production |
| Netlify Frontend | Free | $0 | Bandwidth limited to 100GB/month |
| Cloudinary (uploads) | Free | $0 | Up to 10GB storage |
| **Total** (production) | - | ~$12/month | Can upgrade as needed |

---

## Part 13: Scaling to Production

When your site grows:

1. **Upgrade Render** → $12-$45/month depending on needs
2. **Upgrade Neon** → Pay-as-you-go ($0.16 per CPU hour after free tier)
3. **Add CDN** → Netlify Pro ($19/month) for better performance
4. **Database backups** → Neon includes automatic backups
5. **Monitoring** → Add Sentry (free tier) for error tracking

---

## Summary: 5-Step Deployment Checklist

- [ ] Create Neon PostgreSQL project & run migration script
- [ ] Deploy backend on Render with DATABASE_URL env var
- [ ] Deploy frontend on Netlify with VITE_API_BASE_URL env var
- [ ] Test: Visit frontend → admin panel → make a change
- [ ] Verify changes persist after page refresh

**Everything is now production-ready!** 🚀

Any admin panel changes will immediately update the production database and website.
