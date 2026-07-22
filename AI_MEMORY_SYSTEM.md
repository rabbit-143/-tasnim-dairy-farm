# 🧠 AI Memory System - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Enterprise-grade AI memory and context retention system  
**Scope**: All AI coding agents working on this project

---

## 🎯 Memory System Overview

This system enables AI coding agents to retain project knowledge across sessions, track decisions, remember bugs, and maintain continuity like a human senior engineer who has worked on the project for years.

---

## 📝 Project Memory

### **Permanent Project Facts**

#### **Architectural Decisions**
```yaml
Database:
  Development: SQLite with sql.js (pure JavaScript)
  Production: PostgreSQL via Neon
  Reason: No Python dependencies, easy local setup
  Decision_Date: 2026-02-14
  Status: PERMANENT - Never change without explicit approval

Authentication:
  Current: Simple localStorage credential check
  Credentials: admin / tasnim@2026
  Status: TEMPORARY - Upgrade to JWT planned
  Security_Level: LOW
  Upgrade_Priority: HIGH

File_Uploads:
  Storage: Local disk (/backend/uploads/)
  Max_Size: 5MB
  Allowed_Types: [JPG, PNG, WEBP]
  Planned_Upgrade: Cloudinary CDN
  Status: FUNCTIONAL but needs upgrade

Frontend_Framework:
  Framework: React 19.2.6
  Language: TypeScript 5.9.3
  Build_Tool: Vite 7.3.2
  Styling: TailwindCSS 4.1.17
  Status: PERMANENT stack
  Upgrade_Policy: Minor versions only
```

#### **Critical Constraints**
```yaml
Backward_Compatibility:
  - Never remove existing API endpoints without approval
  - Never change database schema in production without migration plan
  - Never break admin panel functionality
  - Always test in development first

Security_Requirements:
  - All database queries must use parameterized queries
  - Never expose admin credentials in client code
  - Always validate file types on upload
  - CORS must be properly configured for each environment

Performance_Requirements:
  - Frontend build time < 30 seconds
  - API response time < 2 seconds
  - Database queries < 500ms
  - Image uploads < 10 seconds
```

#### **Known Technical Debt**
```yaml
Authentication_System:
  Issue: Plain password check, localStorage only
  Risk: Medium (admin-only system)
  Upgrade_Needed: JWT tokens + bcrypt
  Priority: HIGH
  Estimated_Effort: 4-6 hours

Image_Optimization:
  Issue: No compression on upload
  Impact: Slow page loads
  Solution: Implement sharp or imagemin
  Priority: MEDIUM
  Estimated_Effort: 2-3 hours

Code_Splitting:
  Issue: Single bundle loads everything
  Impact: Slower initial load
  Solution: React.lazy() for routes
  Priority: MEDIUM
  Estimated_Effort: 1-2 hours
```

---

## 🐛 Bug Memory

### **Bug History Log**

#### **Resolved Bugs**
```yaml
Bug_001:
  Date: 2026-03-15
  Issue: Database TypeError - getDb is not a function
  Root_Cause: Incorrect export pattern in database.js
  Solution: Changed to proper CommonJS module.exports
  Files_Changed: [backend/database.js]
  Status: RESOLVED
  Regression_Risk: LOW

Bug_002:
  Date: 2026-03-20
  Issue: Admin panel About section conflicting with Blog section
  Root_Cause: Shared state causing UI conflicts
  Solution: Separated into distinct components with independent state
  Files_Changed: [src/admin/AdminAbout.tsx, src/admin/AdminBlogs.tsx]
  Status: RESOLVED
  Regression_Risk: LOW

Bug_003:
  Date: 2026-04-05
  Issue: Founders page performance degradation
  Root_Cause: Dynamic cards with animations causing repaints
  Solution: Replaced with static banner approach
  Files_Changed: [src/pages/FoundersPage.tsx]
  Status: RESOLVED
  Performance_Gain: 60% faster render
  Regression_Risk: VERY_LOW

Bug_004:
  Date: 2026-04-12
  Issue: CORS errors on production
  Root_Cause: CORS_ORIGIN not including production domain
  Solution: Added production URL to allowed origins
  Files_Changed: [backend/.env, backend/server.js]
  Status: RESOLVED
  Regression_Risk: MEDIUM (test after domain changes)
```

#### **Known Minor Issues**
```yaml
Issue_001:
  Description: Admin session expires on browser refresh in Safari
  Impact: LOW (requires re-login)
  Workaround: Use Chrome/Firefox
  Planned_Fix: JWT tokens will resolve
  Priority: LOW

Issue_002:
  Description: No client-side validation for 5MB file size limit
  Impact: LOW (server validates, but poor UX)
  Planned_Fix: Add client-side check with user-friendly message
  Priority: LOW

Issue_003:
  Description: Render.com cold start takes 15-30 seconds
  Impact: MEDIUM (first request slow)
  Cause: Free tier limitation
  Solution: Upgrade plan or keep-alive ping
  Priority: MEDIUM
```

### **Bug Prevention Patterns**
```yaml
Always_Check_Before_Changing:
  - Database queries use parameterized queries (prevent SQL injection)
  - CORS_ORIGIN includes current environment
  - File uploads validate type and size
  - Admin routes check authentication
  - API responses include proper HTTP status codes

Common_Regression_Points:
  - Database connection configuration (database.js)
  - CORS setup (server.js)
  - Authentication flow (AdminContext.tsx)
  - File upload configuration (server.js multer setup)
  - Environment variable changes (.env files)

Testing_Checklist:
  - Frontend build completes without errors
  - All API endpoints respond correctly
  - Admin login works
  - File uploads succeed
  - Database queries execute without errors
```

---

## 🎯 Decision Memory

### **Architecture Decision Records (ADR)**

#### **ADR-001: Dual Database System**
```yaml
Date: 2026-02-14
Decision: Use SQLite for development, PostgreSQL for production
Context:
  - Needed zero-setup local development
  - Required production-grade database for scale
  - Team wanted to avoid Python dependencies
Consequences:
  Positive:
    - Developers can start immediately without database setup
    - Production has proper ACID compliance
    - No Python dependency issues
  Negative:
    - Must test compatibility between SQLite and PostgreSQL
    - Schema must work in both systems
    - Array/JSON handling differs slightly
Status: ACTIVE
Review_Date: 2026-08-01
```

#### **ADR-002: Simple Authentication (Temporary)**
```yaml
Date: 2026-02-20
Decision: Use simple localStorage authentication initially
Context:
  - MVP needed quickly
  - Admin panel for internal use only
  - JWT implementation would delay launch
Consequences:
  Positive:
    - Fast implementation (2 hours)
    - Sufficient for internal use
    - Easy to understand
  Negative:
    - Not production-grade security
    - Vulnerable to XSS attacks
    - No token expiration
    - No role-based access
Status: TEMPORARY
Upgrade_Required: Yes
Upgrade_Timeline: Q2 2026
Migration_Plan: Implement JWT + bcrypt, migrate localStorage to HTTP-only cookies
```

#### **ADR-003: Vite Over Webpack**
```yaml
Date: 2026-02-12
Decision: Use Vite as build tool instead of Create React App
Context:
  - CRA is deprecated
  - Needed fast development experience
  - TypeScript support required
Consequences:
  Positive:
    - Extremely fast HMR
    - Better TypeScript support
    - Smaller bundle sizes
    - Modern dev experience
  Negative:
    - Different from legacy CRA patterns
    - Some plugins may not be compatible
Status: PERMANENT
Review_Date: Never (unless Vite becomes deprecated)
```

#### **ADR-004: TailwindCSS for Styling**
```yaml
Date: 2026-02-13
Decision: Use TailwindCSS instead of CSS-in-JS or plain CSS
Context:
  - Needed rapid UI development
  - Wanted consistent design system
  - Required responsive design
Consequences:
  Positive:
    - Extremely fast styling
    - Consistent design tokens
    - Excellent responsive utilities
    - Purges unused CSS
  Negative:
    - Long className strings
    - Learning curve for new developers
Status: PERMANENT
Upgrade_Policy: Follow Tailwind major versions
```

---

## 💡 Feature Memory

### **Feature Implementation History**

#### **Feature: AI Chatbot**
```yaml
Implemented: 2026-04-01
Version: 1.0.0
Purpose: Provide 24/7 customer support in Bengali
Components:
  - src/components/AIChat/ChatBot.tsx
  - src/components/AIChat/ChatBot.css
  - backend/routes/chatbot.js
Technology: Pattern-matching responses (not true AI yet)
Future_Upgrade: Integrate OpenAI/Claude API
Performance: <100ms response time
User_Feedback: Positive (85% helpful responses)
Maintenance_Notes:
  - Add new patterns to chatbot.js patterns object
  - Update CHATBOT_RULES.md when adding responses
  - Test Bengali and English separately
```

#### **Feature: Admin Panel**
```yaml
Implemented: 2026-03-01
Version: 1.0.0
Purpose: Content management for all website sections
Sections:
  - Dashboard (statistics)
  - Messages (contact forms)
  - About & Vision (content editing)
  - Founders (CRUD)
  - Gallery (CRUD)
  - Growth Journey (CRUD)
  - Blog Posts (CRUD)
  - Careers (CRUD)
  - Site Settings (configuration)
Authentication: Simple credentials (upgrade needed)
Known_Issues: [Issue_001: Session persistence]
Maintenance_Notes:
  - All state managed by AdminContext
  - Follow existing CRUD patterns when adding sections
  - Always include loading states
```

#### **Feature: Dual Database Support**
```yaml
Implemented: 2026-02-14
Version: 1.0.0
Purpose: Zero-setup development with production-grade deployment
Databases:
  Development: SQLite with sql.js
  Production: PostgreSQL via Neon
Auto_Switch: Based on DATABASE_URL environment variable
Schema: 7 tables (founders, blogs, gallery, careers, contact_messages, settings, growth_journey)
Maintenance_Notes:
  - Always test schema changes in both databases
  - JSON arrays stored as TEXT in SQLite, JSONB in PostgreSQL
  - Use parameterized queries for compatibility
Critical_Files: [backend/database.js]
```

### **Feature Evolution Plan**
```yaml
Short_Term (Next 30 days):
  - JWT Authentication (upgrade from localStorage)
  - Image Compression (add sharp for uploads)
  - Loading States (improve UX during data fetching)

Medium_Term (3-6 months):
  - Multi-language Support (Bengali + English UI)
  - E-commerce Integration (product catalog + cart)
  - Advanced Analytics (GA4 + custom dashboard)

Long_Term (6+ months):
  - Mobile Application (React Native)
  - Real AI Chatbot (OpenAI/Claude integration)
  - IoT Integration (farm monitoring sensors)
```

---

## 🔗 Dependency Memory

### **Critical Dependencies**

#### **Frontend Dependencies**
```yaml
React:
  Version: 19.2.6
  Why: Latest stable, improved performance
  Update_Policy: Patch versions only
  Breaking_Changes_In: React 20 (monitor)
  
TypeScript:
  Version: 5.9.3
  Why: Type safety, better IDE support
  Update_Policy: Minor versions only
  Breaking_Changes_In: TypeScript 6.0 (monitor)

Vite:
  Version: 7.3.2
  Why: Fast builds, modern tooling
  Update_Policy: Minor versions (test before major)
  Known_Issues: None

TailwindCSS:
  Version: 4.1.17
  Why: Rapid styling, consistent design
  Update_Policy: Minor versions only (major versions break utilities)
  Migration_Required_For: v5.0 (when released)
```

#### **Backend Dependencies**
```yaml
Express:
  Version: 4.22.2
  Why: Industry standard, simple, fast
  Update_Policy: Patch versions only
  Breaking_Changes_In: Express 5 (major refactor needed)

Multer:
  Version: 1.4.5-lts.1
  Why: File upload handling
  Update_Policy: Patch versions only
  Known_Issues: 5MB limit hardcoded in server.js

PostgreSQL_Client:
  Package: pg
  Version: 8.11.3
  Why: PostgreSQL connection
  Update_Policy: Minor versions only
  Connection_Pooling: Configured (max 20 connections)

SQLite:
  Package: sql.js
  Version: 1.14.1
  Why: Pure JavaScript SQLite (no Python deps)
  Update_Policy: Patch versions only
  Known_Issues: None
```

### **Dependency Upgrade Rules**
```yaml
Patch_Updates (x.y.Z):
  Frequency: Monthly
  Testing: Basic smoke test
  Approval: Not required
  Risk: LOW

Minor_Updates (x.Y.0):
  Frequency: Quarterly
  Testing: Full regression testing
  Approval: Required
  Risk: MEDIUM
  Review_Breaking_Changes: Always

Major_Updates (X.0.0):
  Frequency: Only when necessary
  Testing: Comprehensive testing in staging
  Approval: Required from senior engineer
  Risk: HIGH
  Migration_Plan: Required
  Rollback_Plan: Required
```

---

## 🔄 Context Retention Rules

### **Session Continuity**

When starting a new session, AI agents must:

1. **Read Project Memory First**
   - Review recent decisions from this document
   - Check known bugs and workarounds
   - Understand current architecture constraints

2. **Check Recent Changes**
   - Read TASKS.md for current sprint status
   - Check if any major refactoring is in progress
   - Review any new architectural decisions

3. **Verify Environment**
   - Confirm which environment (dev/production)
   - Check if local database is configured
   - Verify all dependencies are installed

4. **Load Context**
   - Review relevant documentation for current task
   - Check related bug history
   - Understand dependencies affected by changes

### **Knowledge Transfer Protocol**

When making significant changes, AI agents must:

1. **Document Decision**
   - Add new ADR if architectural
   - Update bug memory if fixing issue
   - Record in feature memory if new feature

2. **Update Affected Documentation**
   - Update ARCHITECTURE.md if system design changes
   - Update DATABASE.md if schema changes
   - Update API_DOCUMENTATION.md if endpoints change
   - Update CODING_RULES.md if patterns change

3. **Record For Future**
   - Add to this AI_MEMORY_SYSTEM.md
   - Update regression prevention patterns
   - Document any new constraints or requirements

---

## 📊 Memory Maintenance

### **Weekly Review**
- Update bug memory with resolved issues
- Add new architectural decisions
- Update technical debt tracking
- Review and update constraints

### **Monthly Review**
- Archive old resolved bugs (keep for reference)
- Update dependency versions
- Review ADRs for accuracy
- Update feature evolution plans

### **Quarterly Review**
- Full memory system audit
- Archive obsolete information
- Update all decision records
- Review and update all constraints

---

**This memory system ensures every AI agent has perfect continuity and behaves like a senior engineer who has been on the project from day one.**