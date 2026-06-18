# Tasnim Dairy Farm Backend API

Node.js + Express + SQLite backend for Tasnim Dairy Farm website.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **better-sqlite3** - Fast SQLite database
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── server.js           # Main Express server
├── database.js         # SQLite database setup
├── routes/
│   ├── founders.js     # Founders CRUD endpoints
│   ├── blogs.js        # Blogs CRUD endpoints
│   ├── gallery.js      # Gallery CRUD endpoints
│   ├── careers.js      # Careers CRUD endpoints
│   └── settings.js     # Settings endpoints
├── uploads/            # Uploaded images
├── tasnim.db           # SQLite database file (auto-created)
└── package.json
```

## 🔧 Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Server

### Development mode (with nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on **http://localhost:3001**

## 📡 API Endpoints

### Founders

- `GET /api/founders` - Get all founders
- `POST /api/founders` - Create new founder
- `PUT /api/founders/:id` - Update founder
- `DELETE /api/founders/:id` - Delete founder

### File Upload

- `POST /api/upload/image` - Upload image (multipart/form-data)
  - Field name: `image`
  - Allowed: JPG, PNG, WEBP
  - Max size: 5MB
  - Returns: `{ success: true, filepath: "/uploads/filename.jpg" }`

### Blogs

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Gallery

- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Create gallery item
- `DELETE /api/gallery/:id` - Delete gallery item

### Careers

- `GET /api/careers` - Get all career posts
- `POST /api/careers` - Create career post
- `PUT /api/careers/:id` - Update career post
- `DELETE /api/careers/:id` - Delete career post

### Settings

- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update site settings

### Health Check

- `GET /api/health` - Server health status

## 🗄️ Database Schema

### Founders Table
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
name TEXT NOT NULL
role TEXT NOT NULL
responsibilities TEXT NOT NULL (JSON array)
image TEXT (filepath)
```

### Default Founders
The database automatically seeds with 5 default founders on first run:
1. Mobasshera Sultana - Founder & CEO
2. Johirul Islam - Founder & CO
3. Rakibul Hasan Rahat - Marketing Lead
4. Anjhum Akter - Founder & Accountant
5. Etheka Ariyana - Brand Ambassador

## 🔒 CORS Configuration

Frontend URL: **http://localhost:5173**

## 📝 Image Upload Flow

1. Frontend selects file
2. Sends POST request to `/api/upload/image` with FormData
3. Backend saves to `backend/uploads/` directory
4. Returns filepath: `/uploads/{timestamp}-{originalname}`
5. Frontend saves filepath in database via founders API

## 🛠️ Development Notes

- Database file (`tasnim.db`) is auto-created on first run
- Default founders are auto-inserted on first run
- Uploaded images are stored in `backend/uploads/`
- Images are served statically at `/uploads/` route

## 🐛 Troubleshooting

### Port 3001 already in use:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Change port in server.js
const PORT = process.env.PORT || 3002;
```

### Cannot find module 'better-sqlite3':
```bash
npm install better-sqlite3 --save
```

### CORS error from frontend:
Make sure frontend is running on http://localhost:5173
Check CORS configuration in server.js

## 📦 Package.json Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon (auto-reload)

## 🔗 Connect with Frontend

Frontend should use base URL: `http://localhost:3001/api`

Example fetch:
```javascript
const response = await fetch('http://localhost:3001/api/founders');
const founders = await response.json();
```

## 📄 License

MIT License - Tasnim Dairy Farm
