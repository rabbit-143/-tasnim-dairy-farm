# Environment Variables Setup Guide

## Overview

This project uses environment variables to manage different configurations for:
- **Local Development** (localhost with SQLite or local PostgreSQL)
- **Production** (Render API + Neon PostgreSQL)

Environment variables are loaded from `.env` files using `dotenv` package.

---

## Quick Start

### 1. Local Development Setup

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

Leave `DATABASE_URL` empty to use SQLite (auto-initialized).

Or use local PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tasnim_dairy_farm_dev
```

#### Frontend (.env.local)
Create `.env.local` at project root:
```env
VITE_API_BASE_URL=http://localhost:3000
```

#### Start Local Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

✅ Visit http://localhost:5173

---

### 2. Production Deployment

#### Step 1: Create Neon PostgreSQL Database
1. Sign up at https://neon.tech
2. Create project: `tasnim-dairy-farm-prd`
3. Copy connection string
4. Run `backend/DATABASE_MIGRATION.sql` in Neon SQL Editor

#### Step 2: Deploy Backend on Render

1. Create web service on https://render.com
2. Connect GitHub repository
3. Add environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Neon connection string |
| `CORS_ORIGIN` | Your Netlify domain |

#### Step 3: Deploy Frontend on Netlify

1. Create site on https://netlify.com
2. Connect GitHub repository
3. Add environment variable:
   - `VITE_API_BASE_URL` = Your Render URL

---

## Detailed Environment Variables

### Backend Variables

#### Required
- **NODE_ENV** (`development` or `production`)
  - Controls logging, CORS behavior, database SSL
  
- **DATABASE_URL** (for production)
  - PostgreSQL connection string from Neon
  - Leave empty for SQLite in development
  - Format: `postgresql://user:password@host:port/database?sslmode=require`

- **CORS_ORIGIN** (production)
  - Your frontend URL(s)
  - Multiple URLs: `https://example.com,https://www.example.com`

#### Optional
- **PORT** (default: 3000)
  - Server port (Render assigns automatically)

- **LOG_LEVEL** (default: `info`)
  - Options: `debug`, `info`, `warn`, `error`

- **CLOUDINARY_CLOUD_NAME** (for file uploads)
  - Your Cloudinary account cloud name
  
- **CLOUDINARY_API_KEY** (for file uploads)
  - Your Cloudinary API key
  
- **CLOUDINARY_API_SECRET** (for file uploads)
  - Your Cloudinary API secret

### Frontend Variables

All frontend variables must start with `VITE_` to be accessible in browser.

#### Required for Production
- **VITE_API_BASE_URL**
  - `http://localhost:3000` (development)
  - `https://tasnim-dairy-farm-api.onrender.com` (production)

#### Optional
- **VITE_APP_NAME**
  - App display name (shown in browser title)
  - Default: `Tasnim Dairy Farm`

- **VITE_APP_VERSION**
  - Current app version for tracking

- **VITE_ENABLE_ADMIN_PANEL**
  - Set to `true` or `false` to enable/disable admin features

---

## Environment Files Priority

Variables are loaded in this order (later overrides earlier):

1. **`.env`** (checked into git, shared defaults)
2. **`.env.local`** (NOT in git, local machine only)
3. **`.env.production`** (for production builds)
4. **`.env.development`** (for development builds)
5. **System environment variables** (Render/Netlify dashboard)

### Example Priority

If you have:
- `.env` with `VITE_API_BASE_URL=http://localhost:3000`
- Netlify environment with `VITE_API_BASE_URL=https://production-api.com`

Result: Netlify production build will use `https://production-api.com`

---

## Secure Credentials Handling

### ⚠️ Never commit these to git:
```
.env.local
.env.production.local
.env.*.local
*.key
*.pem
secrets/
```

### ✅ Safe to commit:
```
.env.example (template without values)
.env.production (if no secrets)
.env.development (if no secrets)
```

### Using .gitignore
Already included:
```
.env.local
.env.*.local
```

### For Render/Netlify
- Add secrets directly in dashboard
- Never paste secrets in files
- Use environment variable management

---

## Configuration by Environment

### Development (Local)

**backend/.env**:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
LOG_LEVEL=debug
```

**frontend/.env.local**:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DEBUG_MODE=true
```

### Production (Deployed)

**Render Environment Variables**:
```
NODE_ENV=production
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://tasnim-dairy-farm.netlify.app
PORT= (leave empty - Render sets it)
```

**Netlify Environment Variables**:
```
VITE_API_BASE_URL=https://tasnim-dairy-farm-api.onrender.com
```

---

## Database Configuration

### SQLite (Local Development)
```env
DATABASE_URL=
```
- Auto-initializes to `backend/tasnim.db`
- Perfect for single-user development
- No setup required

### PostgreSQL (Production)

#### Neon Setup
1. Go to https://console.neon.tech
2. Create project
3. Get connection string: "Connection strings" tab
4. Copy URL starting with `postgresql://`

```env
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
```

#### Local PostgreSQL (optional for development)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/tasnim_dairy_farm_dev
```

---

## File Upload Configuration

### Local Development (Disk Storage)
- Files saved to `backend/uploads/`
- No environment variables needed

### Production (Cloudinary Recommended)

1. Sign up at https://cloudinary.com (free tier available)
2. Get credentials from dashboard
3. Add to Render environment:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Install packages:
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

---

## Testing Environment Variables

### Check Backend Configuration
```bash
curl http://localhost:3000/api/health
```

Should show: `{"status":"ok","message":"Tasnim Dairy Farm API is running"}`

### Check Frontend Configuration
Open browser console (F12) and run:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

Should show your API base URL.

### View Render Variables
```bash
# SSH into Render container
render logs <service-name>
```

### View Netlify Variables
```bash
# In Netlify dashboard → Site settings → Build & deploy → Environment
```

---

## Troubleshooting

### Frontend Can't Connect to API
- Check `VITE_API_BASE_URL` in browser console
- Ensure it matches Render service URL
- Check browser Network tab for actual API requests
- Verify CORS headers in Render logs

### Database Connection Failed
- Check `DATABASE_URL` format
- Verify credentials in Neon console
- Test connection string: `psql <DATABASE_URL>`
- Check Render service logs

### Environment Variable Not Loading
- Restart development server after changing `.env`
- For Render/Netlify: redeploy service
- Check file name: must be `.env` or `.env.production` (exact case)
- Verify no trailing spaces in values

### SQLite Not Persisting in Production
- This is expected! Render has ephemeral filesystem
- Switch to Neon PostgreSQL for production

---

## Migration from SQLite to PostgreSQL

1. **Create Neon project and run migration script**
2. **Update DATABASE_URL** to Neon connection string
3. **Restart backend** - it will auto-migrate data
4. **Keep SQLite locally** for development

---

## Summary Checklist

- [ ] `.env` file exists in backend directory
- [ ] `VITE_API_BASE_URL` set in frontend
- [ ] Database URL correct for environment
- [ ] CORS_ORIGIN includes frontend domain
- [ ] No secrets in version control
- [ ] Environment variables tested and working
- [ ] Production services have all required variables
