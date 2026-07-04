import React, { useState } from 'react';
import { useAdmin, API_BASE_URL } from '../context/AdminContext';
import type { BlogPost } from '../data/store';
import { FaPlus, FaNewspaper, FaEdit, FaTrash, FaTimes, FaSave, FaCalendarAlt } from 'react-icons/fa';

const getImageUrl = (path: string | null) => path?.startsWith('/uploads/') ? path : path;

const AdminBlogs: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: '', category: '', excerpt: '', content: '', image: '',
    seoTitle: '', metaDescription: '', featured: false, date: new Date().toISOString().split('T')[0],
  });

  const resetForm = () => {
    setForm({ title: '', category: '', excerpt: '', content: '', image: '', seoTitle: '', metaDescription: '', featured: false, date: new Date().toISOString().split('T')[0] });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (blog: BlogPost) => {
    setForm({
      title: blog.title, category: blog.category, excerpt: blog.excerpt, content: blog.content,
      image: blog.image || '', seoTitle: blog.seoTitle, metaDescription: blog.metaDescription,
      featured: blog.featured, date: blog.date,
    });
    setEditing(blog);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim()) { alert('Title and category required.'); return; }
    try {
      if (editing) { await updateBlog(editing.id, form); }
      else { await addBlog(form); }
      resetForm();
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Blog Posts</h2>
        <button onClick={openAdd} className="admin-btn-primary"><FaPlus size={14} style={{ marginRight: '6px' }} /> Write Post</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blogs.map(blog => (
          <div key={blog.id} className="admin-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {blog.image && (
              <div style={{
                width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px',
                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', backgroundSize: 'cover', backgroundImage: `url('${getImageUrl(blog.image)}')`,
              }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{blog.category}</span>
                {blog.featured && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px', background: '#fef3c7', color: '#92400e' }}>
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.35rem' }}>{blog.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem', lineHeight: 1.4 }}>{blog.excerpt}</p>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}><FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> {new Date(blog.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(blog)} className="admin-btn-edit"><FaEdit size={14} /></button>
              <button onClick={async () => { if (confirm('Delete this blog post?')) { try { await deleteBlog(blog.id); } catch (e) { /* handled in context */ } } }} className="admin-btn-danger"><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><FaNewspaper size={40} /></div>
            <p>No blog posts yet. Write your first post!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>{editing ? <><FaEdit size={20} style={{ marginRight: '6px' }} /> Edit Post</> : <><FaPlus size={20} style={{ marginRight: '6px' }} /> Write New Post</>}</h3>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="admin-label">Post Title *</label>
                <input className="admin-input" type="text" placeholder="e.g. Sustainable Farming Practices" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Category *</label>
                  <input className="admin-input" type="text" placeholder="e.g. Technology" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Publish Date</label>
                  <input className="admin-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="admin-label">Featured Image URL</label>
                <input className="admin-input" type="text" placeholder="https://..." value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Excerpt (Short Summary) *</label>
                <textarea className="admin-input" placeholder="Brief summary of the post..." rows={2} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="admin-label">Content (Full Post) *</label>
                <textarea className="admin-input" placeholder="Write your full blog post content here..." rows={6} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">SEO Title</label>
                  <input className="admin-input" type="text" placeholder="SEO optimized title" value={form.seoTitle} onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Meta Description</label>
                  <input className="admin-input" type="text" placeholder="Short SEO description" value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                <label htmlFor="featured" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>⭐ Feature this post</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}><FaSave size={14} style={{ marginRight: '6px' }} /> {editing ? 'Update Post' : 'Publish Post'}</button>
                <button onClick={resetForm} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
