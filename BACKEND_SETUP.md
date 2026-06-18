# Backend Setup Guide - Tasnim Dairy Farm

এই guide টি follow করে আপনার React + TypeScript Frontend এর সাথে Node.js Backend connect করুন।

## ✅ Prerequisites

আপনার system এ install করা থাকতে হবে:
- Node.js (v16 বা তার উপরে)
- npm (Node Package Manager)

Check করুন:
```bash
node --version
npm --version
```

## 📁 Backend Installation Steps

### Step 1: Backend directory তে যান
```bash
cd backend
```

### Step 2: Dependencies install করুন
```bash
npm install
```

এটি install করবে:
- express
- better-sqlite3
- multer
- cors
- nodemon (dev dependency)

### Step 3: Backend server start করুন

**Development mode (auto-reload):**
```bash
npm run dev
```

**অথবা Production mode:**
```bash
npm start
```

Server শুরু হয়ে যাবে **http://localhost:3001** এ

### Step 4: Database auto-setup যাচাই করুন

Server প্রথমবার run করলে automatically:
- ✅ `tasnim.db` database file তৈরি হবে
- ✅ সব tables create হবে
- ✅ 5 জন default founders insert হবে
- ✅ `uploads/` folder তৈরি হবে

Console এ দেখবেন:
```
Initializing database...
Database tables created successfully.
Inserting default founders...
Default founders inserted successfully.

╔═══════════════════════════════════════════════════╗
║   Tasnim Dairy Farm Backend API                   ║
║   Server running on http://localhost:3001        ║
║   Frontend: http://localhost:5173                 ║
╚═══════════════════════════════════════════════════╝
```

## 🚀 Frontend Setup

### Step 1: একটি নতুন terminal window খুলুন

Backend terminal টি চলতে দিন। নতুন terminal এ project root directory তে যান।

### Step 2: Frontend dependencies install করুন (যদি করা না থাকে)
```bash
npm install
```

### Step 3: Frontend start করুন
```bash
npm run dev
```

Frontend চলবে **http://localhost:5173** এ

## 🔌 Connection যাচাই করুন

### Test 1: Browser Console Check

1. Frontend এ যান: http://localhost:5173
2. Admin Panel এ login করুন:
   - Username: `admin`
   - Password: `tasnim@2026`
3. Founders section এ যান
4. Browser console খুলুন (F12)
5. Network tab দেখুন - `/api/founders` request দেখতে পাবেন

### Test 2: API Direct Test

Browser এ যান:
```
http://localhost:3001/api/health
```

দেখবেন:
```json
{
  "status": "ok",
  "message": "Tasnim Dairy Farm API is running"
}
```

### Test 3: Founders API Test

Browser এ যান:
```
http://localhost:3001/api/founders
```

5 জন default founder এর JSON data দেখতে পাবেন।

## 📸 Image Upload Test

Admin Panel থেকে:
1. "Add Founder" button এ click করুন
2. Image file select করুন (JPG/PNG/WEBP)
3. Upload সফল হলে message আসবে
4. Image preview দেখতে পাবেন
5. Save করলে founder add হবে database এ

Uploaded images থাকবে: `backend/uploads/`

## 🎯 Default Founders

Database এ automatically insert হবে:

| ID | Name                    | Role                        | Image                              |
|----|-------------------------|-----------------------------|------------------------------------|
| 1  | Mobasshera Sultana      | Founder & CEO               | /images/Founder & CEO.png          |
| 2  | Johirul Islam           | Founder & CO                | /images/Founder & CO.png           |
| 3  | Rakibul Hasan Rahat     | Founder & Marketing Lead    | /images/Founder & Marketing Lead.png|
| 4  | Anjhum Akter            | Founder & Accountant        | /images/Founder & Accountent.png   |
| 5  | Etheka Ariyana          | Brand Ambassador            | /images/Brand Ambassador.png       |

**Note:** এই image paths গুলো existing public folder এ থাকা image গুলোকে reference করে।

## 🛠️ Troubleshooting

### ❌ Problem: Port 3001 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Then restart backend
npm run dev
```

### ❌ Problem: Cannot find module 'better-sqlite3'

**Solution:**
```bash
cd backend
npm install
```

### ❌ Problem: CORS error

**Check করুন:**
1. Backend server চলছে কিনা (http://localhost:3001)
2. Frontend server চলছে কিনা (http://localhost:5173)
3. Backend server.js এ CORS origin ঠিক আছে কিনা

### ❌ Problem: Database not created

**Solution:**
1. Backend server stop করুন (Ctrl+C)
2. `backend/tasnim.db` file delete করুন (যদি থাকে)
3. Server আবার start করুন - fresh database তৈরি হবে

### ❌ Problem: Image upload fails

**Check করুন:**
1. `backend/uploads/` folder তৈরি হয়েছে কিনা
2. File size 5MB এর কম কিনা
3. File format JPG/PNG/WEBP কিনা
4. Backend console এ error message দেখুন

## 📂 Project Structure

```
tasnim-dairy-farm-prd/
├── backend/                    ← Backend folder
│   ├── server.js              ← Main server
│   ├── database.js            ← Database setup
│   ├── routes/                ← API routes
│   │   ├── founders.js
│   │   ├── blogs.js
│   │   ├── gallery.js
│   │   ├── careers.js
│   │   └── settings.js
│   ├── uploads/               ← Uploaded images
│   ├── tasnim.db              ← SQLite database (auto-created)
│   ├── package.json
│   └── README.md
├── src/                       ← Frontend source
│   ├── context/
│   │   └── AdminContext.tsx   ← ✅ Updated to use backend
│   ├── admin/
│   │   └── AdminFounders.tsx  ← ✅ Updated image upload
│   └── ...
└── package.json               ← Frontend package.json
```

## 🔄 Development Workflow

### Both servers একসাথে চালানোর জন্য:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### বা একটা script দিয়ে চালাতে চাইলে:

Root `package.json` এ script যোগ করুন:
```json
{
  "scripts": {
    "dev": "npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev\""
  }
}
```

তারপর install করুন:
```bash
npm install -D concurrently
```

এখন একসাথে চালান:
```bash
npm run dev:all
```

## 📝 API Endpoints সংক্ষেপে

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | /api/founders            | সব founders              |
| POST   | /api/founders            | নতুন founder add         |
| PUT    | /api/founders/:id        | Founder update           |
| DELETE | /api/founders/:id        | Founder delete           |
| POST   | /api/upload/image        | Image upload             |
| GET    | /api/health              | Server health check      |

## 🎉 সফলভাবে Setup Complete!

এখন আপনার:
- ✅ Backend API চলছে port 3001 এ
- ✅ Frontend চলছে port 5173 এ
- ✅ Database তৈরি হয়েছে default data সহ
- ✅ Image upload কাজ করছে
- ✅ CRUD operations চলছে

## 🔐 Admin Login Credentials

- **Username:** `admin`
- **Password:** `tasnim@2026`

## 📞 Need Help?

- Backend logs দেখুন terminal এ
- Browser console check করুন Network tab
- Database file: `backend/tasnim.db` (SQLite browser দিয়ে open করতে পারবেন)

---

**Happy Coding! 🚀**
