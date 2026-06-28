# Tasnim Dairy Farm - Production Deployment Guide

Welcome! This project is now ready for production deployment. This guide explains everything you need to know.

## 📋 Quick Navigation

- **Just want to deploy?** → Start with [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Configure environment variables?** → See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- **Know API endpoints?** → Check [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Deployment verification?** → Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🎯 What You're Getting

This is a **full-stack production-ready application** with:

### Frontend (React + Vite)
- ✅ Built with React for dynamic content
- ✅ Admin panel for managing all content
- ✅ Responsive design for all devices
- ✅ Deploys to **Netlify** (auto-deploys from GitHub)

### Backend (Node.js + Express)
- ✅ RESTful API for all operations
- ✅ Image upload support
- ✅ PostgreSQL database ready
- ✅ Deploys to **Render** (auto-deploys from GitHub)

### Database (PostgreSQL)
- ✅ Production-ready schema
- ✅ Hosted on **Neon** (free tier available)
- ✅ SSL encrypted connections
- ✅ Automatic backups

### Features
✅ Manage founders/team  
✅ Create & edit blog posts  
✅ Upload & manage gallery  
✅ Post job openings  
✅ Receive contact messages  
✅ Customize site settings  

---

## 🚀 Deployment in 5 Steps

### Step 1: Database (5 minutes)
```
1. Create Neon account: https://neon.tech
2. Create project, copy connection string
3. Run migration script from DATABASE_MIGRATION.sql
```

### Step 2: Backend (5 minutes)
```
1. Create Render account: https://render.com
2. Connect GitHub repository
3. Add DATABASE_URL environment variable
```

### Step 3: Frontend (5 minutes)
```
1. Create Netlify account: https://netlify.com
2. Connect GitHub repository
3. Add VITE_API_BASE_URL environment variable
```

### Step 4: Connect Them (2 minutes)
```
Update CORS_ORIGIN on Render to match Netlify URL
Update VITE_API_BASE_URL on Netlify to match Render URL
```

### Step 5: Test (5 minutes)
```
Visit your Netlify URL
Try admin panel → create content
Refresh → verify content persists
```

**That's it! You're live! 🎉**

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Your Visitors                      │
└────────────────┬─────────────────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────────┐
│        Netlify CDN & Frontend                        │
│  https://tasnim-dairy-farm.netlify.app              │
│  (React SPA with admin panel)                        │
└────────────────┬─────────────────────────────────────┘
                 │ API Calls
                 ▼
┌─────────────────────────────────────────────────────┐
│          Render API Server                           │
│  https://tasnim-dairy-farm-api.onrender.com         │
│  (Node.js Express API)                              │
└────────────────┬─────────────────────────────────────┘
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────────────────────┐
│        Neon PostgreSQL Database                      │
│  (Managed cloud database)                            │
│  - Founders, Blogs, Gallery, Careers, Settings     │
└─────────────────────────────────────────────────────┘

GitHub Push → Auto-deploys frontend & backend
Admin Panel → Updates persist immediately
```

---

## 🔑 Key Concepts

### Environment Variables
Different values for different environments:

| Variable | Dev | Production |
|----------|-----|-----------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | `https://your-api.onrender.com` |
| `NODE_ENV` | `development` | `production` |
| `DATABASE_URL` | SQLite | PostgreSQL |
| `CORS_ORIGIN` | `localhost` | `your-domain.netlify.app` |

### Database Strategy
- **Local Dev**: SQLite (auto-initialized, no setup)
- **Production**: PostgreSQL on Neon (scalable, reliable)

### File Uploads
- **Local Dev**: Saved to `backend/uploads/`
- **Production**: Use Cloudinary (Render doesn't persist files)

---

## 💰 Cost Breakdown (Monthly)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Neon | Free | $0 | Up to 3 projects, 3GB storage |
| Render | Free | $0 | Sleeps after 15 min inactivity |
| Render | Starter | $12 | Recommended for production |
| Netlify | Free | $0 | 100GB bandwidth/month |
| Cloudinary | Free | $0 | 10GB storage for uploads |
| **TOTAL** | - | **~$12/month** | Can start free, upgrade later |

---

## 🛠️ Local Development

### First Time Setup

```bash
# Backend
cd backend
npm install
# Leave DATABASE_URL empty to use SQLite
npm start

# In another terminal - Frontend
npm install
npm run dev
```

Visit http://localhost:5173

### Make Changes, See Instantly

Changes to frontend are instant (Vite hot reload).  
Changes to backend require restart (or use nodemon).

---

## 🚢 Deploying Updates

### Easy as Git Push!

```bash
# Make changes locally
git add .
git commit -m "Update features"
git push origin main
```

### What Happens Automatically:
1. **Render** sees the push → builds backend → deploys
2. **Netlify** sees the push → builds frontend → deploys
3. Both go live in 2-5 minutes
4. No manual steps needed!

---

## 🔐 Security Notes

### Secrets Management
✅ **GOOD**: Store in Render/Netlify environment variables  
❌ **BAD**: Commit to `.env` files

### CORS Security
Your backend only accepts requests from your frontend domain.  
Update `CORS_ORIGIN` on Render to match your frontend URL.

### Database SSL
Neon connections use SSL encryption automatically.

---

## 📈 Scaling Later

As your site grows:

| Metric | Free | Starter | Pro |
|--------|------|---------|-----|
| API Uptime | No (sleeps) | Yes | Yes |
| Database Size | 3GB | 10GB | Unlimited |
| Monthly Cost | $0 | $12 | $50+ |
| Request Limit | 100k | Unlimited | Unlimited |

Upgrade Render to Starter ($12/month) for always-on production.

---

## 🐛 Common Issues & Fixes

### Frontend shows blank page
- Check Netlify build logs
- Ensure `VITE_API_BASE_URL` is set
- Check browser console for errors

### Admin changes don't save
- Check Render logs for API errors
- Verify database connection
- Ensure DATABASE_URL is correct

### Slow first requests
- Normal on Render free tier (cold start)
- Upgrade to Starter tier for instant
- Or use third-party uptime monitor to keep warm

### Images not loading
- Use Cloudinary for production
- Local disk storage won't persist on Render

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PRODUCTION_DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions |
| `ENVIRONMENT_SETUP.md` | All environment variables explained |
| `backend/API_DOCUMENTATION.md` | API endpoints reference |
| `DEPLOYMENT_CHECKLIST.md` | Verification checklist |
| `backend/DATABASE_MIGRATION.sql` | Database schema |

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Express.js**: https://expressjs.com
- **PostgreSQL**: https://www.postgresql.org
- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Neon Docs**: https://neon.tech/docs

---

## ✅ Deployment Checklist

Before going live, verify:
- [ ] Neon database created & migration run
- [ ] Render backend deployed & connected to Neon
- [ ] Netlify frontend deployed & connected to Render
- [ ] CORS_ORIGIN set correctly on Render
- [ ] VITE_API_BASE_URL set correctly on Netlify
- [ ] Health check passes: `curl your-api-url/api/health`
- [ ] Frontend loads and admin panel works
- [ ] Can create/edit content and changes persist
- [ ] No errors in console or Render logs

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed checklist.

---

## 🆘 Getting Help

### Frontend Issues
- Check Netlify build logs: Dashboard → Deploys → Build log
- Check browser console: Press F12
- Verify `VITE_API_BASE_URL` environment variable

### Backend Issues
- Check Render logs: Dashboard → Logs
- Verify `DATABASE_URL` format
- Test API health: `curl your-api/api/health`

### Database Issues
- Check Neon console for connection details
- Verify SSL mode in connection string
- Test queries in Neon SQL Editor

### Still Stuck?
- Read [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) carefully
- Check [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- Review [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🎯 Next Steps

1. **Complete deployment** using [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
2. **Verify everything works** using [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. **Set up custom domain** (optional but recommended)
4. **Configure email notifications** for contact form
5. **Set up monitoring** (UptimeRobot free tier)
6. **Train team** on admin panel
7. **Plan backups** and maintenance

---

## 📞 Support

| Component | Support Link |
|-----------|--------------|
| Render | https://render.com/support |
| Netlify | https://www.netlify.com/support/ |
| Neon | https://neon.tech/docs/introduction |
| GitHub | https://github.community |

---

## 🎉 You're All Set!

Everything is ready. Follow the [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) and you'll be live in 30 minutes.

**Your app is about to go live!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-01  
**Status**: Production Ready ✅
