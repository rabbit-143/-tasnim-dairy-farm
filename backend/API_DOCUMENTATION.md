# Tasnim Dairy Farm API Documentation

Base URL: `https://tasnim-dairy-farm-api.onrender.com` (Production)  
Base URL: `http://localhost:3000` (Development)

---

## Health Check

### GET /api/health

Check if API is running.

**Response**:
```json
{
  "status": "ok",
  "message": "Tasnim Dairy Farm API is running"
}
```

---

## Founders API

### GET /api/founders

Get all founders.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Mobasshera Sultana",
    "role": "CEO & Founder",
    "responsibilities": ["Strategic Leadership", "Farm Management"],
    "image": "/uploads/founder-1.jpg",
    "created_at": "2026-02-14T10:00:00Z",
    "updated_at": "2026-02-14T10:00:00Z"
  }
]
```

### GET /api/founders/:id

Get specific founder.

**Response**:
```json
{
  "id": 1,
  "name": "Mobasshera Sultana",
  "role": "CEO & Founder",
  "responsibilities": ["Strategic Leadership"],
  "image": null,
  "created_at": "2026-02-14T10:00:00Z",
  "updated_at": "2026-02-14T10:00:00Z"
}
```

### POST /api/founders

Create new founder (Admin only).

**Request**:
```json
{
  "name": "New Founder",
  "role": "Role Title",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "image": "/uploads/founder-new.jpg"
}
```

### PUT /api/founders/:id

Update founder (Admin only).

### DELETE /api/founders/:id

Delete founder (Admin only).

---

## Blogs API

### GET /api/blogs

Get all blog posts.

**Query Parameters**:
- `featured=true` - Get only featured blogs
- `category=Category%20Name` - Filter by category
- `limit=10` - Limit results
- `offset=0` - Pagination offset

**Response**:
```json
[
  {
    "id": 1,
    "title": "Blog Title",
    "category": "Farm Story",
    "excerpt": "Short description...",
    "content": "Full blog content...",
    "date": "2026-03-15",
    "image": "/uploads/blog-1.jpg",
    "seoTitle": "SEO Title",
    "metaDescription": "Meta description",
    "featured": true,
    "created_at": "2026-03-15T10:00:00Z",
    "updated_at": "2026-03-15T10:00:00Z"
  }
]
```

### GET /api/blogs/:id

Get single blog post.

### POST /api/blogs

Create blog post (Admin only).

**Request**:
```json
{
  "title": "New Blog Post",
  "category": "Farm Story",
  "excerpt": "Brief excerpt...",
  "content": "Full content...",
  "date": "2026-05-01",
  "image": "/uploads/blog.jpg",
  "seoTitle": "SEO Title",
  "metaDescription": "Meta description",
  "featured": false
}
```

### PUT /api/blogs/:id

Update blog post (Admin only).

### DELETE /api/blogs/:id

Delete blog post (Admin only).

---

## Gallery API

### GET /api/gallery

Get all gallery items.

**Query Parameters**:
- `category=Cattle%20Images` - Filter by category
- `limit=20` - Limit results

**Response**:
```json
[
  {
    "id": 1,
    "title": "Farm Overview",
    "category": "Farm Images",
    "image": "/uploads/farm-1.jpg",
    "date": "2026-02-14",
    "created_at": "2026-02-14T10:00:00Z",
    "updated_at": "2026-02-14T10:00:00Z"
  }
]
```

### GET /api/gallery/:id

Get single gallery item.

### POST /api/gallery

Create gallery item (Admin only).

**Request**:
```json
{
  "title": "New Image",
  "category": "Farm Images",
  "image": "/uploads/new-image.jpg",
  "date": "2026-05-01"
}
```

### PUT /api/gallery/:id

Update gallery item (Admin only).

### DELETE /api/gallery/:id

Delete gallery item (Admin only).

---

## Careers API

### GET /api/careers

Get all job postings.

**Query Parameters**:
- `active=true` - Get only active postings

**Response**:
```json
[
  {
    "id": 1,
    "title": "Dairy Farm Supervisor",
    "department": "Operations",
    "vacancy": 2,
    "deadline": "2026-07-31",
    "requirements": ["3+ years experience", "Knowledge of cattle"],
    "applyEmail": "careers@tasnimdairyfarm.com",
    "active": true,
    "created_at": "2026-05-01T10:00:00Z",
    "updated_at": "2026-05-01T10:00:00Z"
  }
]
```

### GET /api/careers/:id

Get single job posting.

### POST /api/careers

Create job posting (Admin only).

**Request**:
```json
{
  "title": "New Position",
  "department": "Operations",
  "vacancy": 1,
  "deadline": "2026-08-31",
  "requirements": ["Requirement 1", "Requirement 2"],
  "applyEmail": "careers@tasnimdairyfarm.com",
  "active": true
}
```

### PUT /api/careers/:id

Update job posting (Admin only).

### DELETE /api/careers/:id

Delete job posting (Admin only).

---

## Settings API

### GET /api/settings

Get site settings.

**Response**:
```json
{
  "id": 1,
  "siteName": "Tasnim Dairy Farm",
  "tagline": "Pure Milk, Pure Promise",
  "phone": "+880 1700-000000",
  "email": "info@tasnimdairyfarm.com",
  "address": "Tasnim Dairy Farm Complex, Dhaka, Bangladesh",
  "mapEmbed": "https://www.google.com/maps/embed?...",
  "facebook": "https://facebook.com/tasnim-dairy-farm",
  "instagram": "https://instagram.com/tasnim-dairy-farm",
  "whatsapp": "https://wa.me/8801700000000",
  "youtube": "https://youtube.com/@tasnim-dairy-farm",
  "linkedin": "https://linkedin.com/company/tasnim-dairy-farm",
  "aboutContent": "Long description...",
  "vision": "Our vision...",
  "mission": ["Mission 1", "Mission 2"],
  "visitors": 10482,
  "updated_at": "2026-05-01T10:00:00Z"
}
```

### PUT /api/settings

Update site settings (Admin only).

**Request**:
```json
{
  "siteName": "Updated Name",
  "tagline": "New tagline",
  "phone": "+880 1234-567890",
  "email": "newemail@example.com",
  "address": "New address",
  "mapEmbed": "https://...",
  "facebook": "https://facebook.com/...",
  "instagram": "https://instagram.com/...",
  "whatsapp": "https://wa.me/...",
  "youtube": "https://youtube.com/...",
  "linkedin": "https://linkedin.com/...",
  "aboutContent": "New about content",
  "vision": "New vision",
  "mission": ["New mission 1", "New mission 2"],
  "visitors": 10500
}
```

---

## Contact API

### GET /api/contact

Get all contact messages (Admin only).

**Query Parameters**:
- `is_read=false` - Get unread messages
- `limit=50` - Limit results

**Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+880 1234-567890",
    "subject": "Inquiry",
    "message": "Message content...",
    "is_read": false,
    "created_at": "2026-05-01T10:00:00Z"
  }
]
```

### GET /api/contact/:id

Get single contact message (Admin only).

### POST /api/contact

Submit contact form (Public).

**Request**:
```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "phone": "+880 1234-567890",
  "subject": "Subject",
  "message": "Message content..."
}
```

### PUT /api/contact/:id

Mark message as read (Admin only).

**Request**:
```json
{
  "is_read": true
}
```

### DELETE /api/contact/:id

Delete contact message (Admin only).

---

## Image Upload

### POST /api/upload/image

Upload image file.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Field name: `image`
- Max size: 5MB
- Allowed types: JPG, PNG, WEBP

**Response**:
```json
{
  "success": true,
  "filepath": "/uploads/1781933151683-filename.jpg",
  "filename": "1781933151683-filename.jpg"
}
```

**Example (Frontend)**:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/upload/image`,
  {
    method: 'POST',
    body: formData
  }
);

const data = await response.json();
console.log(data.filepath); // Use this in your requests
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## CORS Headers

All responses include CORS headers:
```
Access-Control-Allow-Origin: <CORS_ORIGIN>
Access-Control-Allow-Credentials: true
```

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider adding:
- Request rate limiting (100 requests/minute per IP)
- Admin operations throttling
- File upload limits

---

## Authentication

Currently implemented via context on frontend. For production, implement:
- JWT tokens
- Refresh token rotation
- Secure HTTP-only cookies
- Password hashing (bcrypt)

---

## Performance Tips

1. **Use pagination for large datasets**
   ```
   GET /api/blogs?limit=10&offset=0
   ```

2. **Filter by category before fetching**
   ```
   GET /api/gallery?category=Farm%20Images
   ```

3. **Cache API responses on frontend**
   - Use React Query or SWR
   - Set appropriate cache times

4. **Compress images before upload**
   - Max file size: 5MB
   - Recommended: < 2MB for web

---

## Development vs Production

| Feature | Development | Production |
|---------|-------------|-----------|
| Database | SQLite (local) | PostgreSQL (Neon) |
| API URL | http://localhost:3000 | https://tasnim-dairy-farm-api.onrender.com |
| File Storage | Disk (`/uploads`) | Cloudinary |
| CORS | Permissive | Restricted to frontend domain |
| SSL | Not required | Required |
| Cold Start | N/A | First request slow (15-30s) |
