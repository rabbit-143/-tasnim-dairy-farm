# 💻 Coding Standards - Tasnim Dairy Farm

## 🎯 General Principles

### **1. Code Quality**
- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Add comments only when logic is complex
- Keep functions small and focused (max 50 lines)

### **2. Type Safety**
- Always use TypeScript for frontend code
- Define interfaces for all data structures
- Avoid `any` type unless absolutely necessary
- Use proper typing for function parameters and returns

### **3. Error Handling**
- Wrap async operations in try-catch blocks
- Provide meaningful error messages
- Return proper HTTP status codes in APIs
- Log errors for debugging purposes

---

## 📁 File Naming Conventions

### **Frontend Files**
```
Components: PascalCase
- ✅ Navbar.tsx
- ✅ AdminPanel.tsx
- ✅ ChatBot.tsx
- ❌ navbar.tsx
- ❌ admin-panel.tsx

Pages: PascalCase with "Page" suffix
- ✅ HomePage.tsx
- ✅ AboutPage.tsx
- ❌ home.tsx

Context: PascalCase with "Context" suffix
- ✅ AdminContext.tsx
- ✅ AuthContext.tsx

Utilities: camelCase
- ✅ apiHelpers.ts
- ✅ formatDate.ts
```

### **Backend Files**
```
Routes: camelCase, plural nouns
- ✅ blogs.js
- ✅ founders.js
- ✅ gallery.js
- ❌ Blog.js
- ❌ founder.js

Config files: camelCase
- ✅ database.js
- ✅ server.js
```

---

## 🎨 React Component Structure

### **Standard Component Pattern**
```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Props interface
interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

// Component definition
const ComponentName: React.FC<ComponentNameProps> = ({ title, onAction }) => {
  // State declarations
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hooks
  const navigate = useNavigate();
  
  // Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // Functions
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/endpoint');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Render
  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};

export default ComponentName;
```

---

## 🔧 API Endpoint Pattern

### **Express Route Handler**
```javascript
const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// GET all items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table_name ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET single item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM table_name WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST new item
router.post('/', async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    
    // Validation
    if (!field1 || !field2) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      'INSERT INTO table_name (field1, field2) VALUES ($1, $2) RETURNING *',
      [field1, field2]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { field1, field2 } = req.body;
    
    const result = await pool.query(
      'UPDATE table_name SET field1 = $1, field2 = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [field1, field2, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM table_name WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
```

---

## 🎨 TailwindCSS Best Practices

### **Responsive Design**
```tsx
// Mobile-first approach
<div className={`
  p-4 md:p-6 lg:p-8
  text-sm md:text-base lg:text-lg
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
`}>
  Content
</div>
```

### **Component Reusability**
```tsx
// Use consistent button styles
const Button = ({ children, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};
```

---

## 🗄️ Database Query Patterns

### **Parameterized Queries (Always)**
```javascript
// ✅ CORRECT: Parameterized query
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);

// ❌ WRONG: SQL injection vulnerable
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);
```

### **Transaction Pattern**
```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  const result1 = await client.query('INSERT INTO table1 ...');
  const result2 = await client.query('INSERT INTO table2 ...');
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

---

## 📝 TypeScript Interface Standards

### **Data Model Interfaces**
```typescript
// Location: src/data/store.ts

export interface Founder {
  id: number;
  name: string;
  role: string;
  responsibilities: string[];
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  seoTitle?: string;
  metaDescription?: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🔄 State Management Pattern

### **AdminContext Pattern**
```typescript
interface AdminContextType {
  // Data state
  founders: Founder[];
  blogs: BlogPost[];
  
  // Loading states
  loading: boolean;
  
  // Actions
  setFounders: (founders: Founder[]) => void;
  addFounder: (founder: Founder) => void;
  updateFounder: (id: number, founder: Partial<Founder>) => void;
  deleteFounder: (id: number) => void;
}
```

---

## 🎯 Variable Naming


### **Boolean Variables**
```typescript
// ✅ Use 'is', 'has', 'should', 'can'
const isLoading = true;
const hasError = false;
const shouldRefetch = true;
const canDelete = false;

// ❌ Avoid unclear names
const loading = true;
const error = false;
```

### **Function Names**
```typescript
// ✅ Verb-based action names
const fetchFounders = async () => {};
const handleSubmit = () => {};
const validateForm = () => {};
const calculateTotal = () => {};

// ❌ Unclear names
const founders = async () => {};
const submit = () => {};
```

### **Constants**
```typescript
// ✅ SCREAMING_SNAKE_CASE for true constants
const API_BASE_URL = 'http://localhost:3000';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 10;

// Regular camelCase for config objects
const apiConfig = {
  baseUrl: 'http://localhost:3000',
  timeout: 5000
};
```

---

## 🚨 Common Pitfalls to Avoid

### **1. Not Handling Loading States**
```tsx
// ❌ BAD
const Component = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
  
  return <div>{data.map(item => <div>{item.name}</div>)}</div>;
};

// ✅ GOOD
const Component = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
```

### **2. Missing Key Props**
```tsx
// ❌ BAD
{items.map(item => <div>{item.name}</div>)}

// ✅ GOOD
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### **3. Not Cleaning Up Effects**
```tsx
// ❌ BAD
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000);
}, []);

// ✅ GOOD
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000);
  return () => clearInterval(interval);
}, []);
```

---

## 📦 Import Order Convention

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus } from 'lucide-react';

// 2. Internal context/utilities
import { useAdmin } from '../context/AdminContext';
import { formatDate } from '../utils/formatters';

// 3. Components
import Button from '../components/Button';
import Modal from '../components/Modal';

// 4. Types
import type { Founder, BlogPost } from '../data/store';

// 5. Styles (if separate CSS files)
import './Component.css';
```

---

## 🔐 Security Best Practices

### **1. Never Expose Credentials**
```typescript
// ❌ BAD
const password = 'tasnim@2026';

// ✅ GOOD
const password = process.env.ADMIN_PASSWORD;
```

### **2. Validate Input**
```javascript
router.post('/api/founders', async (req, res) => {
  const { name, role, responsibilities } = req.body;
  
  // ✅ Validate required fields
  if (!name || !role || !Array.isArray(responsibilities)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }
  
  // ✅ Sanitize strings
  const sanitizedName = name.trim();
  
  // Proceed with database operation
});
```

### **3. Use HTTPS in Production**
```javascript
// Check protocol in production
if (process.env.NODE_ENV === 'production' && req.protocol !== 'https') {
  return res.redirect(`https://${req.hostname}${req.url}`);
}
```

---

## 📊 Performance Guidelines

### **1. Memoize Expensive Computations**
```typescript
import { useMemo } from 'react';

const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);
```

### **2. Lazy Load Images**
```tsx
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
/>
```

### **3. Debounce Search Inputs**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## 🧪 Testing Standards (Future Implementation)

### **Component Testing Pattern**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **API Testing Pattern**
```javascript
describe('GET /api/founders', () => {
  it('returns all founders', async () => {
    const response = await request(app).get('/api/founders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  it('returns 404 for non-existent founder', async () => {
    const response = await request(app).get('/api/founders/99999');
    expect(response.status).toBe(404);
  });
});
```

---

## 📝 Comment Guidelines

### **When to Comment**
```typescript
// ✅ GOOD: Explain complex business logic
// Calculate milk production based on cattle count and season
// Summer: 15L/cattle, Winter: 12L/cattle
const calculateProduction = (cattleCount: number, season: string) => {
  const baseRate = season === 'summer' ? 15 : 12;
  return cattleCount * baseRate;
};

// ❌ BAD: Stating the obvious
// Set the name variable
const name = 'John';

// ✅ GOOD: Explain workarounds
// Using setTimeout to avoid React state update warning
// TODO: Refactor to use proper async/await pattern
setTimeout(() => setData(newData), 0);
```

### **TODO Format**
```typescript
// TODO: Add pagination support
// FIXME: Memory leak in useEffect cleanup
// HACK: Temporary workaround for API bug
// NOTE: This function will be deprecated in v2.0
```

---

## 🎯 Code Review Checklist

Before committing code, verify:

- [ ] No TypeScript errors
- [ ] All imports used
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Loading states managed
- [ ] Responsive design tested
- [ ] Key props on mapped elements
- [ ] API endpoints use parameterized queries
- [ ] Environment variables not hardcoded
- [ ] Comments added for complex logic

---

These standards ensure consistent, maintainable, and secure code across the Tasnim Dairy Farm project.