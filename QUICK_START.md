# 🚀 Quick Start Guide - Tasnim Dairy Farm

## Current Status: ✅ BACKEND RUNNING

The backend server is **already running** on `http://localhost:3001`

---

## Start Frontend (One Command)

```bash
npm run dev
```

Then open: **http://localhost:5173**

---

## Admin Login

- **Username**: `admin`
- **Password**: `tasnim@2026`

---

## What You Can Do Now

### 1. **Manage Blogs**
- ✅ Add new blog posts
- ✅ Edit existing blogs
- ✅ Delete blogs
- ✅ Upload featured images

### 2. **Manage Gallery**
- ✅ Upload farm images
- ✅ Organize by category
- ✅ Delete images

### 3. **Post Job Openings**
- ✅ Create career postings
- ✅ Set requirements
- ✅ Manage deadlines

### 4. **Update Site Settings**
- ✅ Change site name, tagline
- ✅ Update contact info
- ✅ Social media links
- ✅ About content

### 5. **View Founders**
- ✅ 5 founders are pre-loaded
- ✅ Display on About page

---

## Backend API URLs

| Feature | Endpoint | Status |
|---------|----------|--------|
| Health | GET http://localhost:3001/api/health | ✅ |
| Founders | GET http://localhost:3001/api/founders | ✅ |
| Blogs | GET http://localhost:3001/api/blogs | ✅ |
| Gallery | GET http://localhost:3001/api/gallery | ✅ |
| Careers | GET http://localhost:3001/api/careers | ✅ |
| Settings | GET http://localhost:3001/api/settings | ✅ |

---

## File Uploads

- **Storage**: `backend/uploads/`
- **Access**: `http://localhost:3001/uploads/filename`
- **Max Size**: 5MB
- **Formats**: JPG, PNG, WEBP

---

## Database

- **Type**: sql.js (Pure JavaScript SQLite)
- **File**: `backend/tasnim.db`
- **Auto-saves**: After every operation
- **Default Data**: 5 founders + site settings

---

## Stop Backend (if needed)

```bash
# Ctrl + C in the terminal where backend is running
```

---

## Restart Backend

```bash
cd backend
npm run dev
```

---

## Troubleshooting

### Backend not responding?
- Check if running on http://localhost:3001
- Restart with `npm run dev` in backend folder

### Images not uploading?
- Check `backend/uploads/` folder exists
- Make sure file is under 5MB
- Use JPG, PNG, or WEBP format

### Frontend can't reach backend?
- Ensure backend is running on port 3001
- Check CORS is enabled (it is ✅)
- Check network connection

---

## Key Files

- `backend/database.js` - Database setup
- `backend/server.js` - API server
- `backend/routes/*` - API endpoints
- `src/context/AdminContext.tsx` - Frontend API integration
- `src/admin/*` - Admin UI pages

---

## That's It! 🎉

Everything is ready to use. Just start the frontend and you're good to go!

**Questions?** Check the BACKEND_COMPLETE_STATUS.md file for detailed information.
