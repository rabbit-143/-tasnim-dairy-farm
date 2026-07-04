# 🚀 Tasnim Dairy Farm - Deployment Guide

## 📋 Prerequisites
- GitHub account
- Netlify account  
- Backend deployed on Render/Railway/Heroku

## 🔧 Backend Deployment (First)

### Option 1: Deploy to Render
1. Go to [Render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `DATABASE_URL=[your-postgresql-url]`
     - `CORS_ORIGIN=https://your-netlify-domain.netlify.app`
     - `PORT=10000`

### Option 2: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Deploy from GitHub
3. Select backend folder
4. Set environment variables (same as above)

## 🌐 Frontend Deployment (Netlify)

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Netlify

#### Option A: Drag & Drop
1. Go to [Netlify.com](https://netlify.com)
2. Drag the `dist` folder to deploy area
3. Site will be deployed instantly

#### Option B: GitHub Integration (Recommended)
1. Push code to GitHub (instructions below)
2. Connect Netlify to your GitHub repository
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
4. Deploy automatically on every push

## 📤 Push to GitHub

### 1. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Complete Tasnim Dairy Farm website"
```

### 2. Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `tasnim-dairy-farm`
3. Don't initialize with README (since you have existing code)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tasnim-dairy-farm.git
git branch -M main
git push -u origin main
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
CORS_ORIGIN=https://your-site.netlify.app
PORT=10000
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 📋 Deployment Checklist

### Backend ✅
- [ ] Environment variables configured
- [ ] Database connected
- [ ] CORS properly set
- [ ] File upload working
- [ ] All API endpoints tested

### Frontend ✅  
- [ ] Build successfully
- [ ] Environment variables set
- [ ] API calls working
- [ ] Admin panel functional
- [ ] Images loading properly
- [ ] Routing working (SPA)

## 🚀 Go Live Steps

1. **Deploy Backend First**
   - Deploy to Render/Railway
   - Test API endpoints
   - Note the backend URL

2. **Update Frontend Config**
   - Update `VITE_API_URL` in .env.production
   - Test locally with production API

3. **Deploy Frontend**
   - Push to GitHub
   - Deploy to Netlify
   - Test complete functionality

4. **Final Testing**
   - Test all admin features
   - Test contact forms  
   - Test image uploads
   - Test on different devices

## 🔗 Live URLs

- **Frontend:** https://tasnim-dairy-farm.netlify.app
- **Backend API:** https://tasnim-dairy-farm-backend.onrender.com/api
- **Admin Panel:** https://tasnim-dairy-farm.netlify.app/admin

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors:** Update CORS_ORIGIN in backend
2. **API Not Loading:** Check VITE_API_URL in frontend
3. **Images Not Loading:** Ensure backend serves static files
4. **404 on Refresh:** Netlify redirects configured in netlify.toml

### Debug Commands:
```bash
# Test backend locally
cd backend && npm start

# Test frontend build
npm run build && npm run preview

# Check environment variables
echo $VITE_API_URL
```

## 📞 Support
If you encounter issues, check:
1. Browser console for errors
2. Network tab for failed requests  
3. Backend logs for server errors
4. Netlify deploy logs for build issues