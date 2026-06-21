# 🚀 Tasnim Dairy Farm - Quick Run Guide

## সবচেয়ে সহজ উপায়ে শুরু করুন

### Option 1: ওয়ান-ক্লিক স্টার্ট (সহজ) ⭐

1. **এই ফাইলটি ডাবল-ক্লিক করুন:**
   - `START_PROJECT.bat` (Windows এ সবচেয়ে সহজ)

2. **অপেক্ষা করুন 10 সেকেন্ড** - সব কিছু auto start হবে
3. **Browser auto খুলবে** - `http://localhost:5173`

✅ Done! সব সার্ভার চলছে

---

### Option 2: PowerShell এ চালান

```powershell
.\START_PROJECT.ps1
```

---

### Option 3: ম্যানুয়াল স্টার্ট (Manual Control)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ দেখবেন: `Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ দেখবেন: `Local: http://localhost:5173`

---

## ✅ যখন সব কিছু চলবে তখন কি হবে:

```
╔═══════════════════════════════════════════════════╗
║   Tasnim Dairy Farm Backend API                   ║
║   Server running on http://localhost:5000         ║
║   Frontend: http://localhost:5173                 ║
╚═══════════════════════════════════════════════════╝
```

**Browser এ যাবেন:**
- Website: http://localhost:5173
- Admin Panel: http://localhost:5173/admin-panel
- Contact: http://localhost:5173/contact

---

## 🔍 কি কাজ করছে Check করুন:

### Backend Check:
```
Browser এ যান: http://localhost:5000/api/health
দেখা যাবে: {"status":"ok","message":"Tasnim Dairy Farm API is running"}
```

### Frontend Check:
```
Browser এ যান: http://localhost:5173
দেখা যাবে: Tasnim Dairy Farm website
```

### Messages Check:
```
1. http://localhost:5173/contact এ যান
2. Form fill করুন এবং send করুন
3. http://localhost:5173/admin-panel এ যান
4. "Messages" সেকশন এ যান
5. আপনার message দেখা যাবে ✓
```

---

## ❌ যদি কিছু কাজ না করে:

### সমস্যা 1: "Failed to connect to server"
```
সমাধান:
1. Backend terminal check করুন (চলছে কিনা?)
2. Port 5000 free আছে কিনা? (netstat -ano | findstr :5000)
3. Backend restart করুন
```

### সমস্যা 2: Frontend লোড না হয়
```
সমাধান:
1. Frontend terminal check করুন
2. Port 5173 free আছে কিনা?
3. npm run dev দিয়ে restart করুন
```

### সমস্যা 3: সব কিছু stuck হয়ে গেছে
```
সমাধান:
সব terminal বন্ধ করুন এবং আবার START_PROJECT.bat চালান
```

---

## 📋 Port Reference:

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000/api |
| Database | Local | backend/tasnim.db |

---

## 🛠️ Troubleshooting Commands:

**সব Node process stop করুন:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Port 5000 check করুন:**
```powershell
netstat -ano | findstr :5000
```

**Port 5173 check করুন:**
```powershell
netstat -ano | findstr :5173
```

---

## 📝 Default Admin Credentials:

```
Username: admin
Password: tasnim@2026
```

---

## 🎯 প্রথম বার সেটআপ করলে:

1. ✅ Backend start করুন (`npm start` from `/backend`)
2. ✅ Frontend start করুন (`npm run dev`)
3. ✅ Website open করুন (http://localhost:5173)
4. ✅ Admin login করুন (admin / tasnim@2026)
5. ✅ Contact form test করুন
6. ✅ Messages section চেক করুন

---

**যদি সবকিছু সঠিকভাবে চলছে, তাহলে আপনি দেখতে পাবেন:**

✅ Website loads  
✅ Admin panel কাজ করে  
✅ Contact messages পাঠানো যায়  
✅ Admin panel এ messages দেখা যায়  
✅ Messages manage করা যায় (read/delete)  

---

**Happy coding! 🚀**

