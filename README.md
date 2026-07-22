# 🐄 Tasnim Dairy Farm - Digital Platform

> **Pure Milk, Pure Promise** - A complete digital solution for Bangladesh's premier dairy farm

[![React](https://img.shields.io/badge/React-19.2.6-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.22.2-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)

---

## 🌟 Overview

Tasnim Dairy Farm is a full-stack web application providing a complete digital presence for a modern dairy farm operation in Bangladesh. The platform features a public-facing website, comprehensive admin management system, and AI-powered customer support chatbot.

**Established**: February 14, 2026  
**Location**: Dhaka, Bangladesh  
**Mission**: Producing healthy, pure milk while maintaining the highest standards of farm hygiene and animal welfare

---

## ✨ Features

### 🌐 Public Website
- **Home Page**: Engaging landing page with farm introduction
- **About**: Company story, vision, and mission
- **Founders**: Leadership team profiles and responsibilities
- **Farm**: Information about facilities and operations
- **Gallery**: Photo showcase of farm life and operations
- **Growth Journey**: Company milestones and development story
- **Blog**: Industry insights and farm updates
- **Careers**: Job opportunities and applications
- **Contact**: Inquiry form and location map

### 🔐 Admin Panel
- **Dashboard**: Statistics and quick action center
- **Message Management**: View and respond to customer inquiries
- **Content Management**: Update About, Vision, and Mission content
- **Founders Management**: CRUD operations for leadership profiles
- **Gallery Management**: Upload and organize farm photos
- **Growth Journey**: Add and edit company milestones
- **Blog Management**: Create and publish blog posts
- **Career Management**: Post and manage job opportunities
- **Site Settings**: Configure contact info, social media, and preferences

### 🤖 AI Chatbot (Mou)
- Bengali language support with English fallback
- Pattern-based intelligent responses
- Animated cow mascot
- Glassmorphism modern design
- Real-time conversation handling
- Context-aware responses about farm, products, and services

---

## 🛠️ Tech Stack

### Frontend
```yaml
Framework: React 19.2.6
Language: TypeScript 5.9.3
Build Tool: Vite 7.3.2
Styling: TailwindCSS 4.1.17
Routing: React Router DOM 7.17.0
State Management: React Context API
Animations: Framer Motion 12.40.0
Icons: Lucide React + React Icons
```

### Backend
```yaml
Runtime: Node.js
Framework: Express.js 4.22.2
Database (Dev): SQLite with sql.js 1.14.1
Database (Prod): PostgreSQL with pg 8.11.3
File Upload: Multer 1.4.5-lts.1
CORS: cors 2.8.6
Environment: dotenv 16.3.1
```

### Deployment
```yaml
Frontend: Netlify (CDN with auto-deployment)
Backend: Render.com (Auto-scaling containers)
Database: Neon PostgreSQL (Cloud-hosted)
CI/CD: GitHub Actions
SSL: Automatic (Let's Encrypt)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- Git installed
- Code editor (VS Code recommended)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/tasnim-dairy-farm.git
cd tasnim-dairy-farm
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 4. Configure Environment Variables

**Frontend**: Create `.env.local` in root directory
```env
VITE_API_URL=http://localhost:3000/api
```

**Backend**: Edit `backend/.env`
```env
DATABASE_URL=
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
NODE_ENV=development
PORT=3000
```

#### 5. Start Development Servers

**Terminal 1 - Frontend**:
```bash
npm run dev
# Starts at http://localhost:5173
```

**Terminal 2 - Backend**:
```bash
cd backend
npm start
# Starts at http://localhost:3000
```

#### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Admin Panel**: http://localhost:5173/admin
  - Username: `admin`
  - Password: `tasnim@2026`

---

## 📁 Project Structure

```
tasnim-dairy-farm-prd/
│
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx           # Main navigation
│   │   ├── Footer.tsx           # Site footer
│   │   ├── BackToTop.tsx        # Scroll to top
│   │   ├── WelcomeAnimation.tsx # Initial load animation
│   │   └── AIChat/              # Chatbot components
│   │       ├── ChatBot.tsx
│   │       └── ChatBot.css
│   │
│   ├── pages/                   # Route-based pages
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── FoundersPage.tsx
│   │   ├── FarmPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── GrowthPage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── CareersPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── AdminPanel.tsx
│   │
│   ├── admin/                   # Admin panel components
│   │   ├── AdminGallery.tsx
│   │   ├── AdminBlogs.tsx
│   │   ├── AdminFounders.tsx
│   │   └── [other admin components]
│   │
│   ├── context/                 # React Context providers
│   │   └── AdminContext.tsx    # Admin state management
│   │
│   ├── data/                    # Static data and types
│   │   └── store.ts            # TypeScript interfaces
│   │
│   └── App.tsx                  # Main app component
│
├── backend/                     # Express.js API server
│   ├── routes/                  # API route handlers
│   │   ├── founders.js
│   │   ├── blogs.js
│   │   ├── gallery.js
│   │   ├── careers.js
│   │   ├── contact.js
│   │   ├── settings.js
│   │   ├── growth.js
│   │   └── chatbot.js
│   │
│   ├── uploads/                 # User-uploaded files
│   ├── database.js              # Database configuration
│   ├── server.js                # Main server file
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
│
├── public/                      # Static assets
│   ├── images/                  # Image files
│   └── [other static files]
│
├── .github/                     # GitHub configuration
│   └── workflows/
│       └── deploy.yml           # CI/CD workflow
│
├── documentation/               # Project documentation
│   ├── AGENTS.md               # AI Agent master brain
│   ├── PROJECT_CONTEXT.md      # Project overview
│   ├── ARCHITECTURE.md         # System architecture
│   ├── CODING_RULES.md         # Coding standards
│   ├── DEBUG_GUIDE.md          # Debugging workflow
│   ├── CHATBOT_RULES.md        # AI chatbot guidelines
│   ├── DATABASE.md             # Database structure
│   ├── API_DOCUMENTATION.md    # API reference
│   ├── TASKS.md                # Current tasks
│   └── README.md               # This file
│
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
└── netlify.toml                 # Netlify deployment config
```

---

## 📚 Documentation

Comprehensive documentation is available in the project root:

| Document | Description |
|----------|-------------|
| [AGENTS.md](./AGENTS.md) | AI Agent master brain and guidelines |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Complete project overview and context |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture and design patterns |
| [CODING_RULES.md](./CODING_RULES.md) | Coding standards and best practices |
| [DEBUG_GUIDE.md](./DEBUG_GUIDE.md) | Debugging workflow and troubleshooting |
| [CHATBOT_RULES.md](./CHATBOT_RULES.md) | AI chatbot personality and responses |
| [DATABASE.md](./DATABASE.md) | Database schema and queries |
| [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) | Complete API reference |
| [TASKS.md](./TASKS.md) | Current and planned tasks |

---

## 🌐 Deployment

### Production URLs
- **Frontend**: https://tasnim-dairy-farm.netlify.app
- **Backend API**: https://tasnim-dairy-farm-api.onrender.com
- **Database**: Neon PostgreSQL (Cloud)


### Automated Deployment

**Frontend (Netlify)**:
- Automatic deployment on push to `main` branch
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables configured in Netlify dashboard

**Backend (Render)**:
- Automatic deployment on push to `main` branch
- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`
- Environment variables configured in Render dashboard

**Database (Neon)**:
- Managed PostgreSQL cloud database
- Automatic backups enabled
- Connection pooling configured

### Manual Deployment

See [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## 🧪 Testing

### Run Tests (Future Implementation)
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Admin login works correctly
- [ ] CRUD operations function properly
- [ ] Image uploads successful
- [ ] Chatbot responds correctly
- [ ] Mobile responsive design works
- [ ] Forms validate input properly

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
```bash
git fork https://github.com/yourusername/tasnim-dairy-farm.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow [CODING_RULES.md](./CODING_RULES.md)
- Write clean, documented code
- Test thoroughly

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
- Provide clear description of changes
- Reference any related issues
- Wait for code review

### Commit Message Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## 🐛 Bug Reports

Found a bug? Please report it!

### How to Report
1. Check if issue already exists in [Issues](https://github.com/yourusername/tasnim-dairy-farm/issues)
2. Create new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, etc.)

### Bug Report Template
```markdown
**Description**: Brief description of the bug

**Steps to Reproduce**:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Tasnim Dairy Farm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💬 Support

Need help? Here's how to get support:

### Documentation
First, check our comprehensive documentation:
- [AGENTS.md](./AGENTS.md) - AI Agent guidelines
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEBUG_GUIDE.md](./DEBUG_GUIDE.md) - Troubleshooting guide
- [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - API reference

### Contact
- **Email**: info@tasnimdairyfarm.com
- **Phone**: +880 1700-000000
- **GitHub Issues**: [Report an issue](https://github.com/yourusername/tasnim-dairy-farm/issues)
- **WhatsApp**: [+880 1700-000000](https://wa.me/8801700000000)

### Community
- **Discord**: [Join our community](https://discord.gg/tasnimdairyfarm) (Coming Soon)
- **Facebook**: [Tasnim Dairy Farm](https://facebook.com/tasnimdairyfarm)
- **Instagram**: [@tasnimdairyfarm](https://instagram.com/tasnimdairyfarm)

---

## 🙏 Acknowledgments

### Technologies Used
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Express](https://expressjs.com/) - Backend framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Netlify](https://www.netlify.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting
- [Neon](https://neon.tech/) - Database hosting

### Special Thanks
- The Tasnim Dairy Farm founding team
- Open source community
- All contributors and supporters

---

## 📊 Project Status

### Current Version: 1.0.0
**Status**: ✅ Production Ready

### Statistics
- **Lines of Code**: ~15,000+
- **Components**: 30+
- **API Endpoints**: 40+
- **Pages**: 10
- **Documentation Files**: 10

### Roadmap
- ✅ Phase 1: Core website (Complete)
- ✅ Phase 2: Admin panel (Complete)
- ✅ Phase 3: AI Chatbot (Complete)
- ✅ Phase 4: Deployment (Complete)
- 🔄 Phase 5: Security enhancements (In Progress)
- 📅 Phase 6: E-commerce integration (Planned)
- 📅 Phase 7: Mobile app (Planned)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐️ on GitHub!

---

## 📞 Connect With Us

<div align="center">

[![Website](https://img.shields.io/badge/Website-tasnimdairyfarm.com-green)](https://tasnimdairyfarm.netlify.app)
[![Facebook](https://img.shields.io/badge/Facebook-Follow-blue)](https://facebook.com/tasnimdairyfarm)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-purple)](https://instagram.com/tasnimdairyfarm)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-brightgreen)](https://wa.me/8801700000000)
[![Email](https://img.shields.io/badge/Email-Contact-red)](mailto:info@tasnimdairyfarm.com)

</div>

---

<div align="center">

**Made with ❤️ by Tasnim Dairy Farm Team**

*Pure Milk, Pure Promise* 🐄🥛

</div>