import React, { useState } from 'react';
import { useAdmin, API_BASE_URL } from '../context/AdminContext';
import type { GalleryItem } from '../data/store';
import { FaImages, FaTrash, FaTimes, FaSave, FaUpload } from 'react-icons/fa';
const categories: GalleryItem['category'][] = ['Farm Images', 'Cattle Images', 'Production Images', 'Events'];

const AdminGallery: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Farm Images' as GalleryItem['category'],
    image: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [filter, setFilter] = useState<string>('All');

  const filtered = filter === 'All' ? gallery : gallery.filter(g => g.category === filter);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, WEBP allowed.');
      return;
    }
    
    try {
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setForm(p => ({ ...p, image: data.filepath }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.image) { alert('Title and image are required.'); return; }
    try {
      await addGalleryItem({ title: form.title, category: form.category, image: form.image, date: form.date });
      setForm({ title: '', category: 'Farm Images', image: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Gallery</h2>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary"><FaImages size={14} style={{ marginRight: '6px' }} /> Upload Image</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
              background: filter === cat ? '#0F5D2F' : '#ffffff', color: filter === cat ? 'white' : '#0F5D2F',
              border: filter === cat ? 'none' : '1.5px solid #0F5D2F25',
            }}
          >{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: '#ffffff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={item.image.startsWith('/uploads') 
                  ? item.image 
                  : item.image
                } 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={e => { (e.target as HTMLImageElement).src = '/images/farm-overview.jpg'; }} 
              />
              <div style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                background: '#0F5D2F', color: 'white', fontSize: '0.65rem',
                fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px',
              }}>{item.category}</div>
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{new Date(item.date).toLocaleDateString()}</div>
              <button
                onClick={async () => { if (confirm(`Delete "${item.title}"?`)) { try { await deleteGalleryItem(item.id); } catch (e) { /* handled in context */ } } }}
                className="admin-btn-danger"
                style={{ width: '100%', marginTop: '0.65rem' }}
              >
                <FaTrash size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><FaImages size={40} /></div>
            <p>No images in this category.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}><FaImages size={20} style={{ marginRight: '6px' }} /> Upload Gallery Image</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="admin-label">Image Title *</label>
                <input className="admin-input" type="text" placeholder="e.g. Morning Milking" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Category *</label>
                <select className="admin-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as GalleryItem['category'] }))}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Date</label>
                <input className="admin-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Upload Image (JPG, PNG, WEBP) *</label>
                <div style={{
                  border: '2px dashed #0F5D2F30', borderRadius: '12px', padding: '2rem',
                  textAlign: 'center', cursor: 'pointer', background: '#0F5D2F05',
                  position: 'relative',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><FaUpload size={32} /></div>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>Drop image or click to browse</p>
                  <input
                    type="file" accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  {form.image && (
                    <img src={form.image.startsWith('/uploads') ? form.image : form.image} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', marginTop: '0.75rem' }} />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}><FaSave size={14} style={{ marginRight: '6px' }} /> Upload</button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
