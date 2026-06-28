# Quick Reference Card

Print this or bookmark it for quick access.

---

## 🚀 Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://tasnim-dairy-farm.netlify.app |
| **Backend API** | https://tasnim-dairy-farm-api.onrender.com |
| **Database** | Neon PostgreSQL (see console) |
| **Admin Panel** | https://tasnim-dairy-farm.netlify.app/admin |

---

## 🎯 Admin Panel Quick Access

**URL**: https://tasnim-dairy-farm.netlify.app/admin

### Admin Features
- **Manage Founders**: Add/edit/delete team members
- **Blog Posts**: Create articles, mark as featured
- **Gallery**: Upload images in categories
- **Careers**: Post job openings
- **Settings**: Edit site info, social links
- **Messages**: View contact form submissions

---

## 🔧 Environment Variables

### Backend (Render Environment)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://tasnim-dairy-farm.netlify.app
```

### Frontend (Netlify Environment)
```
VITE_API_BASE_URL=https://tasnim-dairy-farm-api.onrender.com
```

### Local Dev (.env files)
```
Backend: DATABASE_URL= (empty for SQLite)
Frontend: VITE_API_BASE_URL=http://localhost:3000
```

---

## 📡 API Endpoints (for developers)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check |
| GET | `/api/founders` | Get all founders |
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/gallery` | Get all images |
| GET | `/api/careers` | Get jobs |
| GET | `/api/settings` | Get site settings |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/upload/image` | Upload image |

See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for full details.

---

## 🚢 Deployment Commands

### Push to GitHub (auto-deploys)
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Check Deployment Status
- **Render**: https://dashboard.render.com
- **Netlify**: https://app.netlify.com

### Monitor Backend Logs
```bash
# Via Render dashboard
Render → Select service → Logs
```

### Monitor Frontend Build
```bash
# Via Netlify dashboard
Netlify → Select site → Deploys
```

---

## 🗄️ Database Quick Tasks

### Access Database
1. Go to https://console.neon.tech
2. Select your project
3. Click SQL Editor

### Common Queries
```sql
-- Get all founders
SELECT * FROM founders;

-- Get blog posts
SELECT * FROM blogs;

-- Get contact messages
SELECT * FROM contact_messages WHERE is_read = false;

-- Get settings
SELECT * FROM settings;

-- Count gallery items
SELECT COUNT(*) FROM gallery;
```

---

## 🐛 Troubleshooting Quick Fixes

### Frontend not loading
```
✓ Check Netlify build logs
✓ Verify VITE_API_BASE_URL in Netlify env
✓ Clear browser cache (Ctrl+Shift+Del)
```

### API returning errors
```
✓ Check Render logs
✓ Verify DATABASE_URL is correct
✓ Ensure Neon database is running
✓ Test: curl https://your-api/api/health
```

### Admin changes not saving
```
✓ Check Render backend logs
✓ Verify database connection
✓ Check browser console for errors
```

### Images not showing
```
✓ Use Cloudinary for production
✓ Check image URLs in database
✓ Verify image files exist
```

---

## 🔐 Security Checklist

- [ ] No secrets in .env files
- [ ] Secrets only in Render/Netlify dashboard
- [ ] DATABASE_URL has SSL enabled
- [ ] CORS_ORIGIN matches frontend domain
- [ ] NODE_ENV is production on Render
- [ ] Admin panel protected (implement auth if needed)

---

## 📊 Performance Tips

- **Disable watch mode in production**: Use `npm run build`
- **Cache API responses**: Consider caching layers
- **Compress images**: Before uploading
- **Use CDN**: Netlify has built-in CDN
- **Monitor database queries**: Check Neon logs

---

## 💰 Cost Management

| Item | Current | Action |
|------|---------|--------|
| Database | Free (Neon) | ✓ OK |
| Backend | Free (Render) | ⚠️ Sleeps - upgrade to $12/mo |
| Frontend | Free (Netlify) | ✓ OK |
| Uploads | Free (Cloudinary) | ✓ OK |

---

## 📞 Important Links

| Service | Dashboard |
|---------|-----------|
| Render | https://dashboard.render.com |
| Netlify | https://app.netlify.com |
| Neon | https://console.neon.tech |
| GitHub | https://github.com |

---

## 👥 Team Access

### Who Can Deploy?
- Anyone with GitHub access can deploy (push to main)
- Auto-deploys trigger on every push

### Who Can Manage Admin Panel?
- Anyone with frontend access can access `/admin`
- Current: No password protection (add if needed)

### Who Can Access Database?
- Only someone with Neon credentials
- Contact admin for access

---

## 📋 Before Each Release

- [ ] Test locally: `npm run dev` + `npm start`
- [ ] Check for console errors (F12)
- [ ] Verify all features work
- [ ] Run tests if available
- [ ] Create meaningful commit message
- [ ] Push to main branch
- [ ] Monitor Render & Netlify dashboards
- [ ] Verify production is live (2-5 min)

---

## 🎓 Common Tasks

### Add New Blog Post
1. Go to admin panel → Blogs
2. Click "Add Blog"
3. Fill in title, content, image
4. Click Save
5. It appears on homepage instantly

### Add New Gallery Image
1. Go to admin panel → Gallery
2. Click "Add Image"
3. Select image, choose category
4. Click Save
5. It appears in gallery instantly

### Post Job Opening
1. Go to admin panel → Careers
2. Click "Add Position"
3. Fill in details
4. Click Save
5. It appears on careers page

### Update Site Settings
1. Go to admin panel → Settings
2. Edit any field (name, email, socials)
3. Click Save
4. Changes apply everywhere

---

## 🔔 Monitoring Alerts

Set up alerts for:
- Backend down: UptimeRobot (free)
- Database errors: Check Render logs
- Frontend build failures: Netlify notifies via email
- High disk usage: Check Neon console

---

## 📱 Responsive Testing

Test on:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

Use browser DevTools (F12) to test.

---

## ♻️ Scheduled Maintenance

| Task | Frequency | Notes |
|------|-----------|-------|
| Update dependencies | Monthly | `npm update` |
| Check logs | Weekly | Monitor for errors |
| Database backup | Auto | Neon handles this |
| Security patches | As needed | Update immediately |
| Performance review | Monthly | Check metrics |

---

## 🎯 Key Metrics to Monitor

- Page load time (target < 3s)
- API response time (target < 200ms)
- Uptime (target > 99.9%)
- Database connections
- Storage usage
- Monthly visitors

---

## 🆘 Emergency Contacts

| Person | Role | Contact |
|--------|------|---------|
| Developer | Tech Support | - |
| Admin | Content | - |
| Manager | Oversight | - |

---

## ✅ Monthly Checklist

- [ ] Review logs for errors
- [ ] Check database size (Neon)
- [ ] Verify backups are working
- [ ] Update dependencies
- [ ] Review usage/costs
- [ ] Check security alerts
- [ ] Performance review
- [ ] Team training update

---

## 🚨 Emergency Procedures

### If Frontend is Down
1. Check Netlify: Dashboard → Deploys
2. Trigger redeploy if needed
3. Clear cache: Cmd+Shift+Del

### If Backend is Down
1. Check Render: Dashboard → Logs
2. Restart service manually
3. Check database connection

### If Database is Down
1. Check Neon: Console
2. Contact Neon support if needed
3. Use backups to restore

---

**Last Updated**: 2026-05-01  
**Version**: 1.0.0  
**Print Date**: _____________
