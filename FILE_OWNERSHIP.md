# 📂 File Ownership & Responsibility Map

**Version**: 2.0.0  
**Purpose**: Define ownership boundaries and safe editing rules for every file  
**Impact**: Prevents accidental breakage and system conflicts

---

## 🎯 Ownership Philosophy

Every file in this project belongs to a **responsible system**. Understanding ownership prevents:
- Accidental breaking of features
- Conflicting changes across systems
- Database corruption from wrong file edits
- Authentication bypass from careless modifications

---

## 🗂️ Complete File Ownership Map

### **🔴 CRITICAL - Database Layer** (High Risk)

#### **backend/database.js**
```yaml
Owner: Database Configuration System
Responsibility: Database connection management, schema initialization
Safe_To_Edit:
  - Adding new table schemas (with migration plan)
  - Updating connection pool settings
  - Adding fallback data for new tables
Dangerous_To_Edit:
  - Existing table schemas (requires migration)
  - Connection logic (breaks all APIs)
  - Export pattern (breaks all imports)
Required_Testing:
  - Test both SQLite and PostgreSQL
  - Verify all API endpoints still work
  - Check data seeding works
Risk_Level: CRITICAL
Dependencies: All API routes depend on this file
Breaking_This_Breaks: Entire application
```

#### **backend/db-helper.js**
```yaml
Owner: Database Utilities
Responsibility: Database query helpers and utilities
Safe_To_Edit:
  - Adding new helper functions
  - Improving query patterns
Dangerous_To_Edit:
  - Changing function signatures (breaks routes)
  - Modifying return formats (breaks frontend)
Risk_Level: HIGH
```

---

### **🔴 CRITICAL - Authentication System** (High Risk)

#### **src/context/AdminContext.tsx**
```yaml
Owner: Authentication & Admin State Management
Responsibility: Admin login, session management, admin data state
Safe_To_Edit:
  - Adding new admin data state (founders, blogs, etc.)
  - Adding new fetch functions
  - Improving error handling
Dangerous_To_Edit:
  - Login logic (can lock out admins)
  - Session check logic (can break admin access)
  - isAuthenticated state logic
Required_Testing:
  - Test login flow completely
  - Test logout flow
  - Test protected route access
  - Test session persistence
Risk_Level: CRITICAL
Dependencies: All admin components depend on this
Breaking_This_Breaks: Entire admin panel
```

#### **src/pages/AdminPanel.tsx**
```yaml
Owner: Admin Panel Main Layout
Responsibility: Admin routing, sidebar, main admin structure
Safe_To_Edit:
  - Adding new admin sections to sidebar
  - Updating navigation items
  - Changing layout styles
Dangerous_To_Edit:
  - Authentication check logic
  - Route protection
  - AdminContext provider
Risk_Level: HIGH
```

---

### **🟠 HIGH RISK - API Routes**

#### **backend/routes/founders.js**
```yaml
Owner: Founders API System
Database_Tables: founders
Safe_To_Edit:
  - Adding new endpoints
  - Improving query efficiency
  - Adding validation
Dangerous_To_Edit:
  - Changing response formats (breaks frontend)
  - Removing endpoints (breaks frontend)
  - Changing URL patterns
Required_Testing:
  - Test GET /api/founders
  - Test POST /api/founders
  - Test PUT /api/founders/:id
  - Test DELETE /api/founders/:id
  - Verify frontend still works
Risk_Level: HIGH
Frontend_Consumers: AdminFounders.tsx, FoundersPage.tsx
```

#### **backend/routes/blogs.js**
```yaml
Owner: Blog API System
Database_Tables: blogs
Safe_To_Edit:
  - Adding new endpoints
  - Adding filtering/search
  - Adding pagination
Dangerous_To_Edit:
  - Changing response structure
  - Removing endpoints
Risk_Level: HIGH
Frontend_Consumers: AdminBlogs.tsx, BlogPage.tsx
```

#### **backend/routes/gallery.js**
```yaml
Owner: Gallery API System
Database_Tables: gallery
Safe_To_Edit:
  - Adding category filtering
  - Adding sorting options
Dangerous_To_Edit:
  - Image URL format
  - Response structure
Risk_Level: HIGH
Frontend_Consumers: AdminGallery.tsx, GalleryPage.tsx
```

#### **backend/routes/careers.js**
```yaml
Owner: Careers API System
Database_Tables: careers
Safe_To_Edit:
  - Adding active/inactive filtering
  - Adding job category support
Dangerous_To_Edit:
  - Response format
  - Required fields
Risk_Level: HIGH
Frontend_Consumers: AdminCareers.tsx, CareersPage.tsx
```

#### **backend/routes/contact.js**
```yaml
Owner: Contact Messages API
Database_Tables: contact_messages
Safe_To_Edit:
  - Adding email notification
  - Adding status tracking
Dangerous_To_Edit:
  - Message storage format
Risk_Level: MEDIUM
Frontend_Consumers: AdminMessages.tsx, ContactPage.tsx
```

#### **backend/routes/growth.js**
```yaml
Owner: Growth Journey API
Database_Tables: growth_journey
Safe_To_Edit:
  - Adding timeline features
  - Adding milestone categories
Dangerous_To_Edit:
  - Response structure
Risk_Level: MEDIUM
Frontend_Consumers: AdminGrowth.tsx, AboutPage.tsx
```

#### **backend/routes/settings.js**
```yaml
Owner: Site Settings API
Database_Tables: settings
Responsibility: Global site configuration
Safe_To_Edit:
  - Adding new settings
  - Adding validation
Dangerous_To_Edit:
  - Existing setting keys (frontend depends on them)
  - Response format
Risk_Level: HIGH
Frontend_Consumers: AdminSettings.tsx, multiple pages
Note: Changes here affect entire site
```

#### **backend/routes/chatbot.js**
```yaml
Owner: Chatbot Response System
Database_Tables: None (in-memory pattern matching)
Safe_To_Edit:
  - Adding new patterns and responses
  - Improving response quality
  - Adding Bengali responses
Dangerous_To_Edit:
  - Response format structure
  - API endpoint signature
Risk_Level: MEDIUM
Frontend_Consumers: ChatBot.tsx
Reference: CHATBOT_RULES.md for response patterns
```

---

### **🟠 HIGH RISK - Server Configuration**

#### **backend/server.js**
```yaml
Owner: Server Bootstrap & Configuration
Responsibility: Express setup, CORS, middleware, route registration
Safe_To_Edit:
  - Adding new API routes
  - Adding new middleware
  - Improving logging
Dangerous_To_Edit:
  - CORS configuration (breaks frontend)
  - Port configuration (breaks deployment)
  - Multer file upload settings (breaks uploads)
  - Static file serving (breaks image access)
Required_Testing:
  - Test CORS allows frontend requests
  - Test file uploads still work
  - Test all API routes accessible
  - Test static files accessible
Risk_Level: HIGH
Breaking_This_Breaks: Entire backend
```

---

### **🟡 MEDIUM RISK - Admin Panel Components**

#### **src/admin/AdminFounders.tsx**
```yaml
Owner: Founders Admin Interface
API_Dependency: /api/founders
Context_Dependency: AdminContext
Safe_To_Edit:
  - UI improvements
  - Form validation
  - Error messages
Dangerous_To_Edit:
  - API call formats
  - Data structure assumptions
Risk_Level: MEDIUM
```

#### **src/admin/AdminBlogs.tsx**
```yaml
Owner: Blog Admin Interface
API_Dependency: /api/blogs
Safe_To_Edit:
  - Editor UI
  - Preview features
  - SEO fields
Dangerous_To_Edit:
  - API integration
  - Data model
Risk_Level: MEDIUM
```

#### **src/admin/AdminGallery.tsx**
```yaml
Owner: Gallery Admin Interface
API_Dependency: /api/gallery
Special_Feature: Image upload with multipart/form-data
Safe_To_Edit:
  - Image preview
  - Category management
Dangerous_To_Edit:
  - File upload logic
  - FormData construction
Risk_Level: MEDIUM
```

#### **src/admin/AdminCareers.tsx**
```yaml
Owner: Careers Admin Interface
API_Dependency: /api/careers
Safe_To_Edit:
  - Job posting form
  - Status toggles
Dangerous_To_Edit:
  - API calls
Risk_Level: MEDIUM
```

#### **src/admin/AdminDashboard.tsx**
```yaml
Owner: Admin Dashboard Statistics
API_Dependencies: Multiple (founders, blogs, gallery, careers, messages)
Safe_To_Edit:
  - Statistics display
  - Card layouts
Dangerous_To_Edit:
  - API aggregation logic
Risk_Level: MEDIUM
```

#### **src/admin/AdminMessages.tsx**
```yaml
Owner: Contact Messages Interface
API_Dependency: /api/contact
Safe_To_Edit:
  - Message filtering
  - Read/unread status
Dangerous_To_Edit:
  - API integration
Risk_Level: LOW
```

#### **src/admin/AdminSettings.tsx**
```yaml
Owner: Site Settings Interface
API_Dependency: /api/settings
Safe_To_Edit:
  - Settings form UI
  - Validation
Dangerous_To_Edit:
  - Setting keys
  - API structure
Risk_Level: MEDIUM
Note: Settings affect entire site
```

---

### **🟢 LOW RISK - Public Pages**

#### **src/pages/HomePage.tsx**
```yaml
Owner: Public Home Page
API_Dependencies: None (uses static data mostly)
Safe_To_Edit:
  - Layout and styling
  - Content sections
  - Animations
Risk_Level: LOW
```

#### **src/pages/AboutPage.tsx**
```yaml
Owner: About & Vision Page
API_Dependencies: /api/growth (for timeline)
Safe_To_Edit:
  - Content layout
  - Story sections
Risk_Level: LOW
```

#### **src/pages/FoundersPage.tsx**
```yaml
Owner: Founders Public Display
API_Dependencies: /api/founders
Safe_To_Edit:
  - Layout and design
  - Founder card styling
Dangerous_To_Edit:
  - API data structure expectations
Risk_Level: LOW
```

#### **src/pages/BlogPage.tsx**
```yaml
Owner: Blog Listing & Details
API_Dependencies: /api/blogs
Safe_To_Edit:
  - Blog card design
  - Filtering UI
Risk_Level: LOW
```

#### **src/pages/GalleryPage.tsx**
```yaml
Owner: Gallery Public Display
API_Dependencies: /api/gallery
Safe_To_Edit:
  - Image grid layout
  - Lightbox functionality
Risk_Level: LOW
```

#### **src/pages/CareersPage.tsx**
```yaml
Owner: Careers Public Display
API_Dependencies: /api/careers
Safe_To_Edit:
  - Job card design
  - Application form
Risk_Level: LOW
```

#### **src/pages/ContactPage.tsx**
```yaml
Owner: Contact Form
API_Dependencies: POST /api/contact
Safe_To_Edit:
  - Form design
  - Validation messages
Dangerous_To_Edit:
  - API payload structure
Risk_Level: LOW
```

---

### **🟢 LOW RISK - Reusable Components**

#### **src/components/Navbar.tsx**
```yaml
Owner: Site Navigation
Safe_To_Edit:
  - Menu items
  - Styling
  - Responsive behavior
Risk_Level: LOW
```

#### **src/components/Footer.tsx**
```yaml
Owner: Site Footer
Safe_To_Edit:
  - Footer content
  - Links
  - Social media icons
Risk_Level: LOW
```

#### **src/components/AIChat/ChatBot.tsx**
```yaml
Owner: Chatbot UI Interface
API_Dependencies: POST /api/chatbot
Safe_To_Edit:
  - Chat UI design
  - Animation
  - Message display
Dangerous_To_Edit:
  - API call structure
  - Message format
Risk_Level: MEDIUM
Reference: CHATBOT_RULES.md for personality
```

---

### **🟢 LOW RISK - Data & Types**

#### **src/data/store.ts**
```yaml
Owner: TypeScript Type Definitions
Responsibility: All data model interfaces
Safe_To_Edit:
  - Adding new interfaces
  - Adding optional properties
Dangerous_To_Edit:
  - Changing existing required properties
  - Removing interfaces
Risk_Level: MEDIUM
Note: Changes must match backend data structures
Affected_Files: All components using these types
```

---

### **🔵 SAFE - Configuration Files**

#### **vite.config.ts**
```yaml
Owner: Vite Build Configuration
Safe_To_Edit:
  - Build optimization settings
  - Plugin configurations
Dangerous_To_Edit:
  - Entry point
  - Output directory
Risk_Level: MEDIUM
```

#### **tailwind.config.js**
```yaml
Owner: TailwindCSS Configuration
Safe_To_Edit:
  - Color palette
  - Custom utilities
  - Theme extensions
Risk_Level: LOW
```

#### **tsconfig.json**
```yaml
Owner: TypeScript Configuration
Safe_To_Edit:
  - Compiler options (carefully)
Dangerous_To_Edit:
  - Include/exclude patterns
Risk_Level: MEDIUM
```

#### **package.json (frontend & backend)**
```yaml
Owner: Dependency Management
Safe_To_Edit:
  - Patch version updates
  - Scripts
Dangerous_To_Edit:
  - Major version upgrades
  - Removing dependencies
Risk_Level: HIGH
Process: Follow RISK_FRAMEWORK.md for updates
```

---

### **🔵 SAFE - Environment Files**

#### **.env (all variants)**
```yaml
Files:
  - .env
  - .env.development
  - .env.local
  - .env.production
  - backend/.env
  - backend/.env.example
Owner: Environment Configuration
Safe_To_Edit:
  - Variable values (matching environment)
Dangerous_To_Edit:
  - Variable names (breaks code references)
  - Removing variables (breaks code)
Risk_Level: HIGH
Security: Never commit actual secrets
Process: Update .env.example when adding new variables
```

---

### **🔵 SAFE - Documentation Files**

#### **All .md files in project root**
```yaml
Files: AGENTS.md, PROJECT_CONTEXT.md, ARCHITECTURE.md, etc.
Owner: Documentation System
Safe_To_Edit: Always
Risk_Level: LOW
Note: Keep synchronized with code changes
```

---

## 🚫 Protected Files List

### **NEVER EDIT WITHOUT EXPLICIT APPROVAL**

```yaml
1. backend/database.js
   Reason: Breaks entire database layer
   
2. src/context/AdminContext.tsx
   Reason: Can lock out all admins
   
3. backend/server.js (CORS section)
   Reason: Breaks frontend-backend communication
   
4. .env files (production)
   Reason: Can expose secrets or break production
   
5. package.json (dependency removal)
   Reason: Can break entire build
```

---

## ✅ Safe Editing Rules

### **Rule 1: Add, Don't Modify**
```yaml
Safe:
  - Add new API endpoints
  - Add new optional properties to interfaces
  - Add new components
  - Add new utility functions

Dangerous:
  - Modify existing API endpoint signatures
  - Change existing interface required properties
  - Modify existing component props
  - Change existing function signatures
```

### **Rule 2: Test Dependent Systems**
```yaml
If_You_Edit: backend/routes/founders.js
Then_Test:
  - AdminFounders.tsx still works
  - FoundersPage.tsx still works
  - All CRUD operations work

If_You_Edit: src/context/AdminContext.tsx
Then_Test:
  - Admin login works
  - All admin pages accessible
  - Logout works
  - Session persists on refresh
```

### **Rule 3: Follow the Dependency Tree**
```yaml
Database_Layer:
  backend/database.js
    ↓
API_Routes:
  backend/routes/*.js
    ↓
Admin_Context:
  src/context/AdminContext.tsx
    ↓
Admin_Components:
  src/admin/*.tsx
    ↓
Public_Pages:
  src/pages/*.tsx

Rule: Changes at lower levels affect all higher levels
```

---

## 🔍 Ownership Quick Reference

| File Pattern | Owner | Risk Level | Can Edit? |
|-------------|-------|------------|-----------|
| `backend/database.js` | Database Config | 🔴 CRITICAL | With migration only |
| `backend/server.js` | Server Bootstrap | 🟠 HIGH | Carefully |
| `backend/routes/*.js` | API System | 🟠 HIGH | Yes, test dependents |
| `src/context/*.tsx` | State Management | 🔴 CRITICAL | Very carefully |
| `src/admin/*.tsx` | Admin UI | 🟡 MEDIUM | Yes |
| `src/pages/*.tsx` | Public Pages | 🟢 LOW | Yes freely |
| `src/components/*.tsx` | UI Components | 🟢 LOW | Yes freely |
| `src/data/store.ts` | Type Definitions | 🟡 MEDIUM | Match backend |
| `*.config.*` | Build Config | 🟡 MEDIUM | Carefully |
| `package.json` | Dependencies | 🟠 HIGH | Follow process |
| `.env*` | Environment | 🟠 HIGH | Never commit secrets |
| `*.md` | Documentation | 🟢 LOW | Always safe |

---

## 📊 System Interaction Map

```yaml
User_Frontend:
  Entry: src/App.tsx → React Router
  Public_Routes:
    - HomePage → (static data)
    - AboutPage → GET /api/growth
    - FoundersPage → GET /api/founders
    - BlogPage → GET /api/blogs
    - GalleryPage → GET /api/gallery
    - CareersPage → GET /api/careers
    - ContactPage → POST /api/contact
  Admin_Routes:
    - AdminPanel → All admin components
      - AdminDashboard → Multiple APIs
      - AdminFounders → /api/founders (CRUD)
      - AdminBlogs → /api/blogs (CRUD)
      - AdminGallery → /api/gallery (CRUD)
      - AdminCareers → /api/careers (CRUD)
      - AdminMessages → /api/contact (Read)
      - AdminSettings → /api/settings (CRUD)

Backend_API:
  Entry: backend/server.js
  Database: backend/database.js
  Routes:
    - /api/founders → backend/routes/founders.js → founders table
    - /api/blogs → backend/routes/blogs.js → blogs table
    - /api/gallery → backend/routes/gallery.js → gallery table
    - /api/careers → backend/routes/careers.js → careers table
    - /api/contact → backend/routes/contact.js → contact_messages table
    - /api/growth → backend/routes/growth.js → growth_journey table
    - /api/settings → backend/routes/settings.js → settings table
    - /api/chatbot → backend/routes/chatbot.js → in-memory
```

---

## 🛡️ Before Editing Checklist

Before editing ANY file, ask yourself:

- [ ] What system does this file belong to?
- [ ] What is the risk level of this file?
- [ ] What other files depend on this file?
- [ ] Do I need approval for this change?
- [ ] What testing is required after the change?
- [ ] Do I have a rollback plan?
- [ ] Have I read the relevant documentation?

---

**Remember: Every file has an owner and a purpose. Respect ownership boundaries to prevent system-wide failures.**
