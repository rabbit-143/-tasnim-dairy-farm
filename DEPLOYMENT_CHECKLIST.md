# Production Deployment Checklist

Use this checklist to ensure everything is properly configured before going live.

---

## Database Setup (Neon PostgreSQL)

- [ ] Create Neon account (https://neon.tech)
- [ ] Create project named `tasnim-dairy-farm-prd`
- [ ] Copy connection string from Neon console
- [ ] Run SQL migration script in Neon SQL Editor
- [ ] Verify tables created:
  - [ ] `founders`
  - [ ] `blogs`
  - [ ] `gallery`
  - [ ] `careers`
  - [ ] `settings`
  - [ ] `contact_messages`
- [ ] Verify default data inserted
- [ ] Test connection string works locally

---

## Backend Setup (Render)

### Code Changes
- [ ] Update `backend/package.json` with `pg` dependency
- [ ] Verify `database.js` supports PostgreSQL
- [ ] Check `server.js` has error handling
- [ ] Verify Procfile exists or create one
- [ ] Create `render.yaml` configuration

### Deployment
- [ ] Create Render account (https://render.com)
- [ ] Connect GitHub repository to Render
- [ ] Create Web Service for backend
- [ ] Set build command: `cd backend && npm install`
- [ ] Set start command: `cd backend && npm start`
- [ ] Set root directory: `backend`

### Environment Variables (Render)
- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = Your Neon connection string
- [ ] `CORS_ORIGIN` = Your Netlify frontend URL
- [ ] `PORT` = (leave empty - Render sets automatically)
- [ ] Optional: `LOG_LEVEL` = `info`

### Verification
- [ ] Backend builds successfully on Render
- [ ] Check Render logs for errors
- [ ] Test health endpoint: `curl https://<your-api>.onrender.com/api/health`
- [ ] Verify database connection in logs
- [ ] Test API endpoints from browser

---

## Frontend Setup (Netlify)

### Code Changes
- [ ] Create `.env.production` with `VITE_API_BASE_URL`
- [ ] Create `.env.development` for local testing
- [ ] Verify all API calls use environment variable
- [ ] Check for hardcoded `localhost` URLs (should use env var)
- [ ] Create `netlify.toml` configuration
- [ ] Verify `dist` directory is correct build output

### Deployment
- [ ] Create Netlify account (https://netlify.com)
- [ ] Connect GitHub repository to Netlify
- [ ] Create new site from Git
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Leave base directory empty

### Environment Variables (Netlify)
- [ ] `VITE_API_BASE_URL` = Your Render backend URL

### Verification
- [ ] Frontend builds successfully on Netlify
- [ ] Check Netlify deploy logs
- [ ] Visit your Netlify URL
- [ ] Admin panel loads
- [ ] API calls connect to correct backend
- [ ] Check browser console for errors

---

## GitHub Setup

- [ ] Push code to main branch
- [ ] Create `.github/workflows/deploy.yml` (optional)
- [ ] Verify GitHub integration with Render
- [ ] Verify GitHub integration with Netlify
- [ ] Test: Push a small change and verify auto-deployment

---

## Local Development

- [ ] Run `npm install` in both frontend and backend
- [ ] Create `backend/.env` with SQLite settings
- [ ] Create `.env.development` in frontend root
- [ ] Start backend: `cd backend && npm start`
- [ ] Start frontend: `npm run dev`
- [ ] Verify localhost access: http://localhost:5173
- [ ] Test admin panel locally
- [ ] Verify data persists in SQLite

---

## Security & Configuration

- [ ] No hardcoded API URLs in code
- [ ] All secrets in environment variables (not in .env files)
- [ ] `.gitignore` includes `.env*` and `.env.local`
- [ ] Verify CORS_ORIGIN matches frontend domain exactly
- [ ] Check SSL enabled in database connection string
- [ ] Verify NODE_ENV is `production` on Render
- [ ] No test/demo data in production

---

## Testing Production

### Backend Testing
```bash
# Health check
curl https://<your-api>.onrender.com/api/health

# Get founders
curl https://<your-api>.onrender.com/api/founders

# Get settings
curl https://<your-api>.onrender.com/api/settings
```

### Frontend Testing
- [ ] Visit frontend URL
- [ ] Check homepage loads
- [ ] Verify all pages load
- [ ] Check admin panel access
- [ ] Test creating/updating content in admin
- [ ] Verify changes appear on main site immediately
- [ ] Test contact form submission
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Check images load correctly

### Database Testing
- [ ] Log into Neon console
- [ ] Run test query: `SELECT * FROM founders;`
- [ ] Verify data from admin updates shows in database
- [ ] Check indexes created
- [ ] Verify timestamps updating correctly

---

## Monitoring & Alerts

- [ ] Set up Render monitoring (optional)
- [ ] Set up Netlify analytics (optional)
- [ ] Add UptimeRobot health checks (free tier)
- [ ] Configure email notifications
- [ ] Document support contact info
- [ ] Create status page (optional)

---

## File Upload Setup (if applicable)

If using Cloudinary:
- [ ] Create Cloudinary account (https://cloudinary.com)
- [ ] Get CLOUD_NAME, API_KEY, API_SECRET
- [ ] Add Cloudinary env vars to Render
- [ ] Install cloudinary packages: `npm install cloudinary multer-storage-cloudinary`
- [ ] Update `server.js` to use Cloudinary storage
- [ ] Test file upload in admin panel

If using disk storage:
- [ ] ⚠️ Warning: Files don't persist on Render (ephemeral filesystem)
- [ ] Use Cloudinary or AWS S3 instead

---

## Documentation

- [ ] Created PRODUCTION_DEPLOYMENT_GUIDE.md
- [ ] Created ENVIRONMENT_SETUP.md
- [ ] Created API_DOCUMENTATION.md
- [ ] Updated README.md with deployment instructions
- [ ] Document admin panel usage
- [ ] Document API endpoints
- [ ] Keep credentials in secure location (1Password, LastPass, etc.)

---

## Performance Optimization

- [ ] Enable caching on Netlify (`.netlify/functions`)
- [ ] Verify static assets cached (images, CSS, JS)
- [ ] Check database query performance
- [ ] Consider CDN for large files
- [ ] Monitor Render CPU usage
- [ ] Monitor Netlify bandwidth usage

---

## Rollback Plan

- [ ] Know how to revert on Render (previous deployments tab)
- [ ] Know how to revert on Netlify (deploy history)
- [ ] Keep backup of database (Neon auto-backs up)
- [ ] Document emergency contacts
- [ ] Have staging environment (optional but recommended)

---

## Post-Deployment

- [ ] Announce to team/stakeholders
- [ ] Monitor for errors/issues (first 24 hours critical)
- [ ] Check analytics and logs
- [ ] Verify email notifications working
- [ ] Update DNS if using custom domain
- [ ] Set up SSL certificate (automatic on Netlify/Render)
- [ ] Plan regular backups
- [ ] Schedule security audits

---

## Final Verification

- [ ] Admin panel works
- [ ] Data persists across refreshes
- [ ] All pages accessible
- [ ] Forms submit correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] All team members can access

---

## Estimated Timeline

| Step | Time | Notes |
|------|------|-------|
| Neon setup | 5 min | Quick signup & config |
| Render deployment | 10 min | Auto-builds on push |
| Netlify deployment | 5 min | Auto-builds on push |
| Testing | 15 min | Full QA |
| **Total** | **~35 min** | First time longer |

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Backend won't start | Check logs: `Render → Logs`. Verify `DATABASE_URL` |
| Frontend can't reach API | Check `VITE_API_BASE_URL` in Netlify env vars |
| Database connection fails | Verify SSL mode and credentials in connection string |
| Images not loading | Use Cloudinary or verify file paths |
| Admin changes not saving | Check Render logs for SQL errors |
| Cold start slow | Normal on Render free tier (~15-30s). Upgrade for instant |
| Pages show 404 | Check `netlify.toml` redirect rule for React Router |

---

## Success Criteria

✅ **You're done when:**
1. Frontend loads from Netlify URL
2. Admin panel accessible
3. Able to create/edit content
4. Changes visible immediately on production site
5. GitHub push triggers auto-deployments
6. No errors in browser console
7. No errors in backend logs
8. Database queries executing correctly
9. All team members can access
10. Documentation complete

---

## Support Contacts

- **Render Support**: https://render.com/support
- **Netlify Support**: https://www.netlify.com/support/
- **Neon Support**: https://neon.tech/docs/introduction
- **React Docs**: https://react.dev
- **Node.js Docs**: https://nodejs.org/docs

---

## Next Steps (After Deployment)

1. Set up custom domain (optional)
2. Enable analytics
3. Set up error tracking (Sentry)
4. Create backup strategy
5. Plan scalability
6. Monitor costs
7. Train team on admin panel
8. Set up regular maintenance

---

**Last Updated**: 2026-05-01  
**Version**: 1.0.0  
**Status**: Ready for deployment
