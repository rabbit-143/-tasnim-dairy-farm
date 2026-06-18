import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { BlogPost } from '../data/store';
import { FaPlus, FaFileAlt, FaStar, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

const AdminBlogs: React.FC = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: '', category: '', excerpt: '', content: '',
    date: new Date().toISOString().split('T')[0],
    image: null as string | null,
    seoTitle: '', metaDescription: '', featured: false,
  });

  const resetForm = () => {
    setForm({ title: '', category: '', excerpt: '', content: '', date: new Date().toISOString().split('T')[0], image: null, seoTitle: '', metaDescription: '', featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (post: BlogPost) => {
    setForm({ title: post.title, category: post.category, excerpt: post.excerpt, content: post.content, date: post.date, image: post.image, seoTitle: post.seoTitle, metaDescription: post.metaDescription, featured: post.featured });
    setEditing(post);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) { alert('Only JPG, PNG, WEBP allowed.'); return; }
    const reader = new FileReader();
    reader.onload = ev => setForm(p => ({ ...p, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.category.trim()) { alert('Title and category required.'); return; }
    const data = { ...form };
    if (editing) { updateBlog(editing.id, data); }
    else { addBlog(data); }
    resetForm();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Blog Posts</h2>
        <button onClick={openAdd} className="admin-btn-primary"><FaPlus size={14} style={{ marginRight: '6px' }} /> New Post</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blogs.map(post => (
          <div key={post.id} className="admin-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '100px', height: '70px', borderRadius: '10px', overflow: 'hidden',
              background: 'linear-gradient(135deg, #0F5D2F15, #D4AF3715)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            }}>
              {post.image ? <img src={post.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FaFileAlt size={24} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ background: '#0F5D2F15', color: '#0F5D2F', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px' }}>{post.category}</span>
                {post.featured && <span style={{ background: '#D4AF3720', color: '#b8942f', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px' }}><FaStar size={12} /> Featured</span>}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>{post.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>{new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(post)} className="admin-btn-edit"><FaEdit size={14} /> Edit</button>
              <button onClick={() => { if (confirm('Delete this post?')) deleteBlog(post.id); }} className="admin-btn-danger"><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><FaFileAlt size={40} /></div>
            <p>No blog posts yet. Create your first post!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>{editing ? <><FaEdit size={20} style={{ marginRight: '6px' }} /> Edit Post</> : <><FaPlus size={20} style={{ marginRight: '6px' }} /> New Blog Post</>}</h3>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#6b7280' }}><FaTimes size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" type="text" placeholder="Blog title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Category *</label>
                  <input className="admin-input" type="text" placeholder="e.g. Farm Story, Quality" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Publish Date</label>
                  <input className="admin-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                  <label htmlFor="featured" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}><FaStar size={14} /> Featured Post</label>
                </div>
              </div>
              <div>
                <label className="admin-label">Excerpt / Summary</label>
                <textarea className="admin-input" placeholder="Short summary..." rows={3} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="admin-label">Full Content</label>
                <textarea className="admin-input" placeholder="Full blog content..." rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="admin-label">SEO Title</label>
                <input className="admin-input" type="text" placeholder="SEO optimized title" value={form.seoTitle} onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Meta Description</label>
                <textarea className="admin-input" placeholder="Meta description for SEO..." rows={2} value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="admin-label">Featured Image (JPG, PNG, WEBP)</label>
                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} style={{ fontSize: '0.85rem' }} />
                {form.image && (
                  <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img src={form.image} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '10px' }} />
                    <button onClick={() => setForm(p => ({ ...p, image: null }))} style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}><FaTimes size={12} /></button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}><FaSave size={14} style={{ marginRight: '6px' }} /> {editing ? 'Update' : 'Publish'}</button>
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
