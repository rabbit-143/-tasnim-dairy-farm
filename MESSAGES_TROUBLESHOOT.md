# Message Box Troubleshooting Guide 🔧

## Problem: Messages Not Appearing in Admin Panel

যদি contact form থেকে message send করলেও admin panel এ দেখা না যায়, তাহলে এই steps follow করুন:

---

## Step 1: Check Backend Server is Running

সবচেয়ে গুরুত্বপূর্ণ - backend server চলছে কিনা check করুন:

```bash
cd backend
npm start
```

এটি port `3001` এ চলবে এবং এমন দেখাবে:

```
╔═══════════════════════════════════════════════════╗
║   Tasnim Dairy Farm Backend API                   ║
║   Server running on http://localhost:3001         ║
║   Frontend: http://localhost:5173                 ║
╚═══════════════════════════════════════════════════╝
```

**যদি এটা না দেখেন, তাহলে:**
- একটি নতুন terminal খুলুন (আলাদা window)
- Backend folder এ যান
- `npm start` run করুন
- এটি চালু রাখুন

---

## Step 2: Verify Backend Port

Backend এ যাচাই করুন যে PORT সঠিক আছে:

**File:** `backend/server.js` - Line 8
```javascript
const PORT = process.env.PORT || 3001;
```

✅ এটি `3001` হওয়া উচিত (default)

---

## Step 3: Check Database

Database সঠিকভাবে initialize হয়েছে কিনা দেখুন:

**File:** `backend/database.js` এ check করুন database path:
```javascript
const dbPath = path.join(__dirname, 'tasnim.db');
```

**Verify:**
- `backend/tasnim.db` file exist করছে কিনা
- Backend terminal এ এমন message দেখা যাবে: `✓ Loaded existing SQLite database` অথবা `✓ Created new SQLite database`

---

## Step 4: Test Contact API Directly

Browser থেকে API test করুন:

**Copy এবং browser address bar এ paste করুন:**
```
http://localhost:3001/api/contact/messages
```

**আপনি দেখতে পাবেন:**
- ✅ Empty array `[]` - Database initialize হয়েছে (messages নেই)
- ✅ Array with messages `[{...}, {...}]` - Messages save হয়েছে
- ❌ Error message - Database problem আছে

---

## Step 5: Check Frontend API Base URL

Frontend সঠিক backend URL ব্যবহার করছে কিনা check করুন:

**File:** `src/context/AdminContext.tsx` - Line 6
```typescript
export const API_BASE_URL = 'http://localhost:3001/api';
```

✅ এটি `3001` port ব্যবহার করা উচিত

---

## Step 6: Check Browser Console

Frontend app এ browser console খুলুন (F12):

1. Contact form submit করুন
2. Browser console এ errors দেখুন
3. Common errors:

**Error: "Failed to connect to backend"**
- Backend server চলছে না
- PORT 3001 blocked আছে

**Error: "CORS error"**
- Backend CORS setting সঠিক না
- দেখুন: `backend/server.js` line 10-13

**Error: "Failed to send message"**
- Backend database initialize না হয়েছে
- Backend logs দেখুন

---

## Step 7: Test Form Submission

Contact form submit করার সময় কি হয় তা check করুন:

1. **Browser DevTools খুলুন** (F12)
2. **Network tab এ যান**
3. Contact form submit করুন
4. দেখুন `POST` request:
   - ✅ Status 201 = Success
   - ❌ Status 500 = Backend error
   - ❌ Status 0 / Failed = Connection error

---

## Common Issues & Solutions

### Issue 1: "Cannot GET /api/contact/messages"
**সমস্যা:** Backend server না চলছে

**সমাধান:**
```bash
cd backend
npm start
```

---

### Issue 2: CORS Error
**সমস্যা:** Frontend থেকে backend এ request blocked

**Check:** `backend/server.js` line 10-13
```javascript
const allowedOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigins.split(',').map(s => s.trim()),
  credentials: true
}));
```

**সমাধান:** Frontend URL `http://localhost:5173` এ চলছে কিনা check করুন

---

### Issue 3: Database Error
**সমস্যা:** "Database not initialized"

**সমাধান:**
```bash
# Backend delete করুন
cd backend
rm tasnim.db

# Re-start
npm start
```

---

### Issue 4: Messages Not Saving
**সমস্যা:** Form submit "success" দেখায় কিন্তু message save না হয়

**কারণ:** 
- Name, Email, Message field empty আছে
- Backend database corrupt

**সমাধান:**
- সব required fields fill করুন
- Database reset করুন (Issue 3 দেখুন)

---

## Quick Debug Checklist

Message না দেখা পেলে এই checklist follow করুন:

- [ ] Backend server চলছে? (`npm start` from `/backend`)
- [ ] Port 3001 সঠিক? (server.js এ)
- [ ] Database file exist করছে? (`backend/tasnim.db`)
- [ ] Contact form submit success message পাচ্ছেন?
- [ ] Browser console এ errors নেই?
- [ ] API URL সঠিক? (`http://localhost:3001/api/contact/messages`)
- [ ] Frontend এ admin panel load হয়েছে?

---

## Complete Setup (From Scratch)

যদি কিছুই কাজ না করে:

```bash
# 1. Backend folder এ
cd backend

# 2. Dependencies install করুন (যদি এখনো না করেছেন)
npm install

# 3. Database delete করুন (নতুন করে তৈরি হবে)
rm tasnim.db

# 4. Backend start করুন
npm start

# 5. দ্বিতীয় terminal এ - Frontend folder এ
cd .. (parent directory এ যান)

# 6. Frontend start করুন (যদি development mode চান)
npm run dev

# 7. Browser এ যান
# Frontend: http://localhost:5173
# Admin: http://localhost:5173/admin-panel
```

---

## Getting Help

**Backend terminal এ কি দেখছেন?**
- Copy করুন এবং check করুন if there are error messages

**Browser console এ কি দেখছেন?**
- F12 → Console tab → errors screenshot নিন

**Contact form submit করলে কি হয়?**
- Success message দেখা যায় কিনা?
- Admin panel এ message দেখা যায় কিনা?

---

## Endpoints Reference

এই endpoints এ direct browser/curl দিয়ে test করতে পারেন:

```
GET    http://localhost:3001/api/contact/messages
       → সব messages দেখায়

POST   http://localhost:3001/api/contact
       → নতুন message send করে (form থেকে)

PUT    http://localhost:3001/api/contact/messages/{id}/read
       → message কে read mark করে

DELETE http://localhost:3001/api/contact/messages/{id}
       → message delete করে
```

---

**Backend সঠিকভাবে চলছে কিনা আমাকে জানান এবং আমি আরও help করব!** 📧

