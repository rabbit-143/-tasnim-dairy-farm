# 🔍 Code Review Checklist - Tasnim Dairy Farm

**Version**: 2.0.0  
**Purpose**: Automated quality gates and review standards  
**Scope**: All code changes (self-review, peer review, AI review)

---

## 🎯 Review Philosophy

Code review is not about finding fault—it's about ensuring:
- **Quality**: Code works correctly and efficiently
- **Maintainability**: Future developers can understand and modify code
- **Security**: No vulnerabilities introduced
- **Consistency**: Follows project patterns and standards

---

## ✅ Universal Pre-Review Checklist

**Before submitting ANY code for review** (self-check):

### **Basic Hygiene**
- [ ] Code compiles/builds without errors
- [ ] No TypeScript errors
- [ ] No console warnings in browser
- [ ] No linting errors
- [ ] All imports are used (no unused imports)
- [ ] No commented-out code blocks
- [ ] No debug code (console.log, debugger, etc.)
- [ ] No TODO comments for critical functionality
- [ ] Git commit messages are meaningful

### **Testing**
- [ ] Code tested locally
- [ ] All affected features tested manually
- [ ] No regressions in existing functionality
- [ ] Edge cases considered and tested

### **Documentation**
- [ ] Complex logic has comments
- [ ] New features documented in relevant .md files
- [ ] API changes documented in API_DOCUMENTATION.md
- [ ] Database changes documented in DATABASE.md

---

## 🎨 Frontend Code Review Checklist

### **React Component Review**

#### **1. Component Structure**
```yaml
Check:
  - [ ] Component follows standard structure (imports → interface → component → export)
  - [ ] Props interface defined with TypeScript
  - [ ] State variables have correct types
  - [ ] useEffect dependencies are correct
  - [ ] No missing dependencies in useEffect
  - [ ] No infinite loops in useEffect
  - [ ] Cleanup functions provided where needed

Example_Issues:
  ❌ Missing dependency:
    useEffect(() => {
      fetchData(userId);
    }, []); // userId not in dependency array!
  
  ✅ Correct:
    useEffect(() => {
      fetchData(userId);
    }, [userId]);
```

#### **2. State Management**
```yaml
Check:
  - [ ] State is not duplicated (DRY principle)
  - [ ] Derived state is computed, not stored
  - [ ] State updates use functional form when needed
  - [ ] Context used appropriately (not prop drilling)
  - [ ] No unnecessary re-renders

Example_Issues:
  ❌ Unnecessary state:
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // fullName can be derived!
  
  ✅ Correct:
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const fullName = `${firstName} ${lastName}`; // Derived
```

#### **3. Error Handling**
```yaml
Check:
  - [ ] Loading states implemented
  - [ ] Error states handled
  - [ ] Try-catch blocks around async operations
  - [ ] User-friendly error messages
  - [ ] No unhandled promise rejections

Example_Issues:
  ❌ No error handling:
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    };
  
  ✅ Correct:
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
```

#### **4. Performance**
```yaml
Check:
  - [ ] No unnecessary re-renders
  - [ ] useMemo used for expensive computations
  - [ ] useCallback used for functions passed as props
  - [ ] Lists have unique key props
  - [ ] Images have loading="lazy"
  - [ ] No large inline objects in render

Example_Issues:
  ❌ Causing unnecessary re-renders:
    <ExpensiveComponent 
      config={{ theme: 'dark', size: 'large' }} 
    />
    // New object created on every render!
  
  ✅ Correct:
    const config = useMemo(() => ({ 
      theme: 'dark', 
      size: 'large' 
    }), []);
    <ExpensiveComponent config={config} />
```

#### **5. TypeScript Usage**
```yaml
Check:
  - [ ] No 'any' types (unless absolutely necessary)
  - [ ] All function parameters typed
  - [ ] All function returns typed
  - [ ] Props interfaces defined
  - [ ] Proper use of unions and generics
  - [ ] No type assertions without reason

Example_Issues:
  ❌ Using 'any':
    const handleClick = (event: any) => { ... }
  
  ✅ Correct:
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
```

#### **6. Styling (TailwindCSS)**
```yaml
Check:
  - [ ] Mobile-first responsive design
  - [ ] Consistent spacing (use Tailwind utilities)
  - [ ] Accessible color contrast (text-gray-800 on bg-white, etc.)
  - [ ] Hover/focus states for interactive elements
  - [ ] No hardcoded pixel values (use Tailwind)
  - [ ] Consistent with existing component styling

Example_Issues:
  ❌ Not responsive:
    <div className="w-96 p-8">...</div>
  
  ✅ Correct:
    <div className="w-full md:w-96 p-4 md:p-8">...</div>
```

#### **7. Accessibility**
```yaml
Check:
  - [ ] All images have alt text
  - [ ] Form inputs have labels
  - [ ] Buttons have descriptive text or aria-label
  - [ ] Interactive elements keyboard accessible
  - [ ] Semantic HTML used (nav, main, article, etc.)
  - [ ] Focus states visible
  - [ ] Color not sole means of conveying information

Example_Issues:
  ❌ Missing alt text:
    <img src="founder.jpg" />
  
  ✅ Correct:
    <img src="founder.jpg" alt="Mahbub Rahman - Founder & CEO" />
```

---

## 🔧 Backend Code Review Checklist

### **API Endpoint Review**

#### **1. Route Structure**
```yaml
Check:
  - [ ] RESTful naming conventions followed
  - [ ] Proper HTTP methods (GET, POST, PUT, DELETE)
  - [ ] Consistent URL patterns
  - [ ] Version in URL if needed (/api/v1/...)
  - [ ] Follows existing route structure

Example_Issues:
  ❌ Non-RESTful:
    router.post('/getFounders', ...)
    router.post('/deleteFounder/:id', ...)
  
  ✅ Correct:
    router.get('/founders', ...)
    router.delete('/founders/:id', ...)
```

#### **2. Input Validation**
```yaml
Check:
  - [ ] All required fields validated
  - [ ] Data types validated
  - [ ] String lengths validated
  - [ ] File types validated (if file upload)
  - [ ] File sizes validated (if file upload)
  - [ ] Returns 400 for invalid input with clear message

Example_Issues:
  ❌ No validation:
    router.post('/founders', async (req, res) => {
      const { name, role } = req.body;
      await pool.query('INSERT INTO founders ...');
    });
  
  ✅ Correct:
    router.post('/founders', async (req, res) => {
      const { name, role, responsibilities } = req.body;
      
      if (!name || !role || !Array.isArray(responsibilities)) {
        return res.status(400).json({ 
          error: 'Invalid input: name, role, and responsibilities required' 
        });
      }
      
      if (name.length > 100) {
        return res.status(400).json({ 
          error: 'Name must be less than 100 characters' 
        });
      }
      
      // Proceed with insert
    });
```

#### **3. Error Handling**
```yaml
Check:
  - [ ] Try-catch blocks around all async operations
  - [ ] Proper HTTP status codes returned
  - [ ] Error messages logged (for debugging)
  - [ ] User-friendly error messages returned
  - [ ] No sensitive information in error messages
  - [ ] Database errors don't expose schema

Example_Issues:
  ❌ Poor error handling:
    router.get('/founders/:id', async (req, res) => {
      const result = await pool.query('SELECT * FROM founders WHERE id = $1', [req.params.id]);
      res.json(result.rows[0]);
    });
  
  ✅ Correct:
    router.get('/founders/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const result = await pool.query(
          'SELECT * FROM founders WHERE id = $1', 
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Founder not found' });
        }
        
        res.json(result.rows[0]);
      } catch (error) {
        console.error('Error fetching founder:', error);
        res.status(500).json({ error: 'Failed to fetch founder' });
      }
    });
```

#### **4. Database Queries**
```yaml
Check:
  - [ ] Always use parameterized queries (NEVER string concatenation)
  - [ ] Queries optimized (proper indexes assumed)
  - [ ] Transactions used for multi-step operations
  - [ ] Connection released after use
  - [ ] No N+1 query problems
  - [ ] SQL injection prevention

Example_Issues:
  ❌ SQL INJECTION VULNERABLE:
    const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
    await pool.query(query);
  
  ✅ Correct (parameterized):
    await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);
  
  ❌ N+1 problem:
    const founders = await pool.query('SELECT * FROM founders');
    for (let founder of founders.rows) {
      founder.posts = await pool.query('SELECT * FROM posts WHERE founder_id = $1', [founder.id]);
    }
  
  ✅ Correct (JOIN):
    const result = await pool.query(`
      SELECT f.*, json_agg(p) as posts
      FROM founders f
      LEFT JOIN posts p ON p.founder_id = f.id
      GROUP BY f.id
    `);
```

#### **5. Security**
```yaml
Check:
  - [ ] Authentication checked for protected routes
  - [ ] Authorization verified (user has permission)
  - [ ] CORS properly configured
  - [ ] Rate limiting considered (if needed)
  - [ ] No credentials in code
  - [ ] Environment variables used for secrets
  - [ ] File upload types restricted
  - [ ] File upload sizes restricted

Example_Issues:
  ❌ No auth check:
    router.delete('/founders/:id', async (req, res) => {
      // Anyone can delete!
    });
  
  ✅ Correct:
    router.delete('/founders/:id', checkAuth, async (req, res) => {
      // Only authenticated admins can delete
    });
```

#### **6. Response Format**
```yaml
Check:
  - [ ] Consistent response structure
  - [ ] Proper HTTP status codes
  - [ ] Success: 200 (GET), 201 (POST), 204 (DELETE)
  - [ ] Error: 400 (bad request), 404 (not found), 500 (server error)
  - [ ] JSON format used
  - [ ] No circular references

Example_Issues:
  ❌ Inconsistent:
    // Sometimes returns:
    { data: [...] }
    // Sometimes returns:
    [ ... ]
  
  ✅ Correct (consistent):
    // Always return array directly for lists
    res.json(founders);
    // Always return object for single item
    res.json(founder);
    // Always return {error: "..."} for errors
    res.status(404).json({ error: 'Not found' });
```

---

## 🗄️ Database Changes Review

### **Schema Changes**
```yaml
Check:
  - [ ] Migration script provided
  - [ ] Rollback script provided
  - [ ] Both SQLite and PostgreSQL compatible
  - [ ] No breaking changes to existing columns
  - [ ] Default values provided for new NOT NULL columns
  - [ ] Indexes considered for new columns
  - [ ] Foreign key constraints correct
  - [ ] Tested in development environment

Example_Issues:
  ❌ Breaking change:
    ALTER TABLE founders 
    DROP COLUMN email; -- Data loss!
  
  ✅ Correct (safe):
    -- Step 1: Add new column with default
    ALTER TABLE founders 
    ADD COLUMN email_address VARCHAR(255) DEFAULT '';
    
    -- Step 2: Copy data
    UPDATE founders 
    SET email_address = email;
    
    -- Step 3: After verification, drop old column
    ALTER TABLE founders 
    DROP COLUMN email;
```

### **Query Changes**
```yaml
Check:
  - [ ] Query returns expected data structure
  - [ ] Query tested with real data
  - [ ] Query performance acceptable (< 500ms)
  - [ ] Query handles NULL values
  - [ ] Query handles empty results
  - [ ] Works in both SQLite and PostgreSQL
```

---

## 🔐 Security Review Checklist

### **Critical Security Checks**
```yaml
Authentication:
  - [ ] No credentials hardcoded
  - [ ] Passwords never logged
  - [ ] Session tokens secure
  - [ ] HTTPS enforced in production

Input_Validation:
  - [ ] All user input validated
  - [ ] SQL injection prevented (parameterized queries)
  - [ ] XSS prevented (proper escaping)
  - [ ] File upload types restricted
  - [ ] File upload sizes limited

Data_Protection:
  - [ ] Sensitive data encrypted
  - [ ] No secrets in Git
  - [ ] Environment variables for config
  - [ ] Proper CORS configuration

API_Security:
  - [ ] Rate limiting considered
  - [ ] Authentication required for sensitive endpoints
  - [ ] Authorization checked
  - [ ] No information leakage in errors
```

---

## ⚡ Performance Review Checklist

### **Frontend Performance**
```yaml
Check:
  - [ ] No unnecessary re-renders
  - [ ] Images optimized and lazy loaded
  - [ ] Code splitting considered for large components
  - [ ] API calls debounced where appropriate
  - [ ] No blocking operations in render
  - [ ] Bundle size reasonable (< 500KB gzipped)

Tools:
  - Chrome DevTools → Lighthouse
  - React DevTools → Profiler
  - Bundle analyzer (npm run build --analyze)
```

### **Backend Performance**
```yaml
Check:
  - [ ] Database queries optimized
  - [ ] No N+1 query problems
  - [ ] Pagination for large datasets
  - [ ] Connection pooling configured
  - [ ] Response caching considered
  - [ ] API response time < 2 seconds

Tools:
  - Database query EXPLAIN
  - API benchmarking tools
  - Render.com metrics
```

---

## 📊 Code Quality Metrics

### **Complexity**
```yaml
Function_Length:
  Target: < 50 lines per function
  If_Longer: Consider breaking into smaller functions

Cyclomatic_Complexity:
  Target: < 10
  If_Higher: Simplify logic, extract functions

File_Length:
  Target: < 300 lines per file
  If_Longer: Consider splitting into multiple files
```

### **Maintainability**
```yaml
Check:
  - [ ] Code is self-documenting (clear variable names)
  - [ ] Complex logic has comments
  - [ ] No magic numbers (use named constants)
  - [ ] No deeply nested conditionals (> 3 levels)
  - [ ] Consistent naming conventions
  - [ ] Follows project patterns

Example_Issues:
  ❌ Magic numbers:
    if (price > 5000) { ... }
  
  ✅ Correct:
    const MAX_REGULAR_PRICE = 5000;
    if (price > MAX_REGULAR_PRICE) { ... }
```

---

## 🧪 Testing Considerations

### **Manual Testing Required**
```yaml
Before_Approval:
  - [ ] Feature tested in development
  - [ ] Edge cases tested
  - [ ] Error scenarios tested
  - [ ] Responsive design tested (mobile/tablet/desktop)
  - [ ] Cross-browser tested (Chrome, Firefox, Safari)

Example_Test_Cases:
  Feature: Create new founder
    - Happy path: Valid data submits successfully
    - Edge case: Empty name field shows error
    - Edge case: Invalid image type shows error
    - Edge case: Image > 5MB shows error
    - Edge case: Network failure shows error
```

---

## 📋 Review Process

### **Self-Review** (Before asking for review)
```yaml
1. Run through entire checklist above
2. Test all changes locally
3. Read through your own code diff
4. Verify no unintended changes
5. Write clear commit message
6. Document changes in relevant .md files
```

### **Peer Review** (When reviewing others' code)
```yaml
1. Understand the change purpose
2. Check against this checklist
3. Test the changes locally if possible
4. Provide constructive feedback
5. Approve if all checks pass

Feedback_Guidelines:
  - Be specific (line numbers, examples)
  - Be constructive (suggest solutions)
  - Be respectful (question, don't attack)
  - Prioritize issues (critical vs nice-to-have)
```

### **AI Self-Review** (For AI agents)
```yaml
Before_Completing_Task:
  - [ ] Run through this entire checklist
  - [ ] Verify code follows CODING_RULES.md
  - [ ] Check against FILE_OWNERSHIP.md
  - [ ] Assess risk level (RISK_FRAMEWORK.md)
  - [ ] Test changes work correctly
  - [ ] Update documentation
  - [ ] Document in AI_MEMORY_SYSTEM.md if significant
```

---

## 🚦 Quality Gates

### **Must Pass Before Merge**

```yaml
Gate_1_Build:
  - [ ] TypeScript compiles without errors
  - [ ] Build process completes successfully
  - [ ] No linting errors

Gate_2_Functionality:
  - [ ] Feature works as intended
  - [ ] No regressions in existing features
  - [ ] All manual tests pass

Gate_3_Code_Quality:
  - [ ] Follows CODING_RULES.md
  - [ ] Passes security review
  - [ ] Passes performance review
  - [ ] Maintainability acceptable

Gate_4_Documentation:
  - [ ] Code commented where needed
  - [ ] Documentation updated
  - [ ] Commit message clear
```

---

## ⚠️ Red Flags

**Immediate rejection if any of these found**:

```yaml
Critical_Issues:
  🔴 SQL injection vulnerability
  🔴 Hardcoded credentials
  🔴 Secrets committed to Git
  🔴 No error handling in critical paths
  🔴 Breaking changes without migration
  🔴 Removing existing features without approval
  🔴 Authentication bypass
  🔴 Data loss risk

High_Priority_Issues:
  🟠 Missing input validation
  🟠 No loading states
  🟠 Unclear variable names
  🟠 Excessive code duplication
  🟠 Poor error messages
  🟠 No TypeScript types
  🟠 Accessibility violations
```

---

## 📝 Review Comments Template

```yaml
# Use these when providing feedback:

Blocking:
  "❌ BLOCKING: [Specific issue]. Must be fixed before merge."
  
Critical:
  "🔴 CRITICAL: [Security/data issue]. Requires immediate attention."

Suggestion:
  "💡 SUGGESTION: [Improvement]. Consider [alternative approach]."

Question:
  "❓ QUESTION: [Question about approach]. Can you clarify?"

Praise:
  "✅ NICE: [What was done well]. Great job!"
```

---

**Remember: Code review is a learning opportunity for everyone. Be thorough, be respectful, and focus on building quality software.**
