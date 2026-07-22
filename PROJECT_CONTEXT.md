# 📋 Project Context - Tasnim Dairy Farm

## 🏢 Business Overview

**Company**: Tasnim Dairy Farm  
**Established**: February 14, 2026  
**Industry**: Dairy Farming & Agriculture  
**Vision**: To become one of the most trusted dairy farms in Bangladesh  
**Mission**: Produce healthy and pure milk while maintaining the highest farm hygiene standards

---

## 🌐 Project Purpose

This is a **complete digital presence solution** for Tasnim Dairy Farm, providing:

### **Public-Facing Website**
- Corporate information and farm story
- Founders and leadership team showcase
- Photo gallery of farm operations
- Blog for dairy industry insights
- Career opportunities posting
- Contact information and inquiry forms
- AI-powered chatbot for customer service

### **Admin Management System**
- Content management for all website sections
- Message management from contact forms
- Gallery and blog post administration
- Founder profiles and company information updates
- Career posting management
- Site settings and configuration

---

## 🎯 Target Audience

### **Primary Users**
- **Potential customers** seeking quality dairy products
- **Industry partners** for B2B collaborations
- **Job seekers** interested in agricultural careers
- **Local community** learning about modern farming practices

### **Admin Users**
- **Farm management team** updating content
- **Marketing team** publishing blog posts and managing gallery
- **HR team** posting job opportunities
- **Customer service** monitoring inquiries and messages

---

## 🏗️ Current Project Status

### **✅ COMPLETED FEATURES**

#### **Frontend (100% Complete)**
- React 19.2.6 application with TypeScript
- 9 public pages: Home, About, Founders, Farm, Gallery, Growth, Blog, Careers, Contact
- Full admin panel with 8 management sections
- Responsive design for all screen sizes
- AI chatbot with Bengali language support
- Modern UI with TailwindCSS and animations

#### **Backend API (100% Complete)**
- RESTful API with Express.js
- Complete CRUD operations for all data models
- Image upload system with Multer
- Dual database support (SQLite + PostgreSQL)
- CORS configuration for cross-origin requests
- Error handling and validation

#### **Database Schema (100% Complete)**
- 7 main tables: founders, blogs, gallery, careers, settings, contact_messages, growth_journey
- Auto-initialization with seed data
- Production-ready PostgreSQL configuration
- Development SQLite fallback

#### **Deployment Infrastructure (100% Complete)**
- Frontend: Netlify with GitHub Actions CI/CD
- Backend: Render.com with auto-deployment
- Database: Neon PostgreSQL for production
- Environment configuration for dev/production
- Domain setup and SSL certificates

---

## 🔧 Technology Stack

### **Frontend Technologies**
```yaml
Framework: React 19.2.6
Language: TypeScript 5.9.3
Build Tool: Vite 7.3.2
Styling: TailwindCSS 4.1.17
Routing: React Router DOM 7.17.0
State Management: React Context API
Icons: Lucide React + React Icons
Animations: Framer Motion 12.40.0
```

### **Backend Technologies**
```yaml
Runtime: Node.js
Framework: Express.js 4.22.2
Database (Dev): SQLite with sql.js
Database (Prod): PostgreSQL with pg client
File Upload: Multer 1.4.5-lts.1
CORS Handling: CORS 2.8.6
Environment: dotenv 16.3.1
```

### **Deployment & DevOps**
```yaml
Frontend Hosting: Netlify
Backend Hosting: Render.com
Database: Neon PostgreSQL (Production)
CI/CD: GitHub Actions
Domain Management: Netlify DNS
SSL: Automatic (Let's Encrypt)
```

---

## 📁 Project Structure Breakdown

```
tasnim-dairy-farm-prd/
├── 🎨 FRONTEND (src/)
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx      # Main navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── BackToTop.tsx   # Scroll to top button
│   │   └── AIChat/         # Chatbot components
│   ├── pages/              # Route-based pages
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── AboutPage.tsx   # Company information
│   │   ├── FoundersPage.tsx # Leadership team
│   │   ├── FarmPage.tsx    # Farm operations
│   │   ├── GalleryPage.tsx # Photo gallery
│   │   ├── GrowthPage.tsx  # Company growth story
│   │   ├── BlogPage.tsx    # Industry blog
│   │   ├── CareersPage.tsx # Job opportunities
│   │   ├── ContactPage.tsx # Contact form
│   │   └── AdminPanel.tsx  # Admin dashboard
│   ├── admin/              # Admin panel components
│   │   ├── AdminGallery.tsx    # Gallery management
│   │   ├── AdminBlogs.tsx      # Blog management
│   │   ├── AdminFounders.tsx   # Founders management
│   │   └── [other admin components]
│   ├── context/            # React Context providers
│   │   └── AdminContext.tsx    # Admin state management
│   └── data/               # Static data and TypeScript types
│       └── store.ts        # Data interfaces and defaults
│
├── ⚡ BACKEND (backend/)
│   ├── routes/             # API endpoint handlers
│   │   ├── blogs.js        # Blog CRUD operations
│   │   ├── founders.js     # Founders CRUD operations
│   │   ├── gallery.js      # Gallery CRUD operations
│   │   ├── careers.js      # Career posts CRUD
│   │   ├── contact.js      # Contact form handling
│   │   ├── settings.js     # Site settings management
│   │   ├── growth.js       # Growth journey management
│   │   └── chatbot.js      # AI chatbot responses
│   ├── uploads/            # User-uploaded images
│   ├── database.js         # Database configuration
│   ├── server.js           # Main Express server
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
│
├── 📚 DOCUMENTATION/
│   ├── API_DOCUMENTATION.md    # Complete API reference
│   ├── BACKEND_SETUP.md       # Backend setup guide
│   ├── CHATBOT_DOCUMENTATION.md # AI chatbot guide
│   └── [25+ other documentation files]
│
└── 🚀 DEPLOYMENT/
    ├── .github/workflows/deploy.yml # GitHub Actions CI/CD
    ├── netlify.toml              # Netlify configuration
    ├── render.yaml               # Render deployment config
    └── [environment files]
```

---

## 🔄 Data Flow Architecture

### **Frontend to Backend Communication**
```
User Action → React Component → AdminContext → API Call → Express Route → Database → Response → UI Update
```

### **Image Upload Flow**
```
File Selection → FormData → Multer Middleware → Disk Storage → File Path → Database → UI Display
```

### **Authentication Flow**
```
Login Form → Credential Check → Local Storage → Context State → Protected Routes → API Authorization
```

---

## 🌍 Environment Configuration

### **Development Environment**
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3000` (Express server)
- Database: SQLite (local file-based)
- File Uploads: Local disk storage
- CORS: Permissive for development

### **Production Environment**
- Frontend: `https://tasnim-dairy-farm.netlify.app`
- Backend: `https://tasnim-dairy-farm-api.onrender.com`
- Database: Neon PostgreSQL (cloud-hosted)
- File Uploads: Local disk (planned: Cloudinary)
- CORS: Restricted to production domain

---

## 👥 Team Structure & Roles

### **Technical Roles**
- **Frontend Developer**: React/TypeScript component development
- **Backend Developer**: API development and database management
- **DevOps Engineer**: Deployment and infrastructure management
- **UI/UX Designer**: Interface design and user experience

### **Business Roles**
- **Content Manager**: Blog posts and company information updates
- **Marketing Manager**: Gallery management and promotional content
- **HR Manager**: Career posting and candidate management
- **Customer Service**: Inquiry response and chatbot monitoring

---

## 📈 Business Logic & Features

### **Core Business Entities**
1. **Founders** - Leadership team profiles with roles and responsibilities
2. **Blog Posts** - Industry insights, farm stories, and company updates
3. **Gallery** - Visual showcase of farm operations and facilities
4. **Career Posts** - Job opportunities with requirements and application details
5. **Contact Messages** - Customer inquiries and communication
6. **Site Settings** - Company information, social media, and contact details
7. **Growth Journey** - Company milestones and development story

### **Key Business Processes**
- **Content Publishing**: Admin creates/updates blog posts and gallery items
- **Lead Generation**: Contact forms capture potential customer inquiries
- **Recruitment**: Career posts attract candidates for farm positions
- **Customer Support**: AI chatbot provides initial customer assistance
- **Brand Management**: Founders section establishes credibility and trust

---

## 🎨 Design Philosophy

### **Visual Identity**
- **Color Scheme**: Green (nature/agriculture) + White (purity) + Professional blues
- **Typography**: Poppins and Inter fonts for modern, readable design
- **Imagery**: High-quality farm photos showcasing operations and products
- **Layout**: Clean, spacious design with focus on content readability

### **User Experience Principles**
- **Simplicity**: Clear navigation and intuitive interface
- **Performance**: Fast loading times and responsive interactions
- **Accessibility**: Readable fonts, good contrast, and mobile-friendly design
- **Trust**: Professional appearance with credible information presentation

---

## 🔮 Future Roadmap

### **Immediate Improvements (Next 30 days)**
- Enhanced security with JWT authentication
- Image optimization and CDN integration
- Advanced search functionality for blog and gallery
- Email notification system for contact forms

### **Medium-term Goals (3-6 months)**
- Multi-language support (Bengali + English)
- E-commerce integration for product sales
- Advanced analytics and visitor tracking
- Mobile app development planning

### **Long-term Vision (6+ months)**
- IoT integration for farm monitoring
- Customer portal for order tracking
- Advanced AI chatbot with natural language processing
- Integration with farm management systems

---

This project represents a complete digital transformation for Tasnim Dairy Farm, positioning them as a modern, technology-forward agricultural business in Bangladesh's growing dairy industry.