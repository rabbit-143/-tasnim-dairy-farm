import React, { useState } from 'react';
import { useAdmin, API_BASE_URL } from '../context/AdminContext';
import type { GrowthJourney } from '../data/store';
import { FaHistory, FaTrash, FaTimes, FaSave, FaUpload, FaEdit } from 'react-icons/fa';

const AdminGrowthJourney: React.FC = () => {
  const { growthJourney, addGrowthJourney, updateGrowthJourney, deleteGrowthJourney } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<GrowthJourney, 'id'>>({
    milestone: '',
    year: '',
    title: '',
    description: '',
    image: null,
    stat_value: '',
    stat_label: '',
    color: '#0F5D2F',
    side: 'left',
    sort_order: 0,
  });

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
    if (!form.milestone.trim() || !form.year.trim() || !form.title.trim()) {
      alert('Milestone, Year, and Title are required.');
      return;
    }
    
    try {
      if (editingId) {
        await updateGrowthJourney(editingId, form);
      } else {
        await addGrowthJourney(form);
      }
      
      setForm({
        milestone: '',
        year: '',
        title: '',
        description: '',
        image: null,
        stat_value: '',
        stat_label: '',
        color: '#0F5D2F',
        side: 'left',
        sort_order: 0,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      // Error already handled in context
    }
  };

  const handleEdit = (item: GrowthJourney) => {
    setForm(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      milestone: '',
      year: '',
      title: '',
      description: '',
      image: null,
      stat_value: '',
      stat_label: '',
      color: '#0F5D2F',
      side: 'left',
      sort_order: 0,
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Growth Journey</h2>
        <button onClick={() => setShowForm(true)} className="admin-btn-primary"><FaHistory size={14} style={{ marginRight: '6px' }} /> Add Milestone</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {growthJourney.sort((a, b) => a.sort_order - b.sort_order).map(item => (
          <div key={item.id} style={{ background: '#ffffff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            {item.image && (
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={item.image.startsWith('/uploads') ? item.image : item.image} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={e => { (e.target as HTMLImageElement).src = '/images/farm-overview.jpg'; }} 
                />
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: item.color, color: 'white', fontSize: '0.65rem',
                  fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px',
                }}>{item.year}</div>
              </div>
            )}
            <div style={{ padding: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem', fontWeight: 600 }}>{item.milestone}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.3rem' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.4' }}>{item.description.substring(0, 60)}...</div>
              <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 700, marginBottom: '0.65rem' }}>{item.stat_value}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(item)}
                  className="admin-btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={async () => { if (confirm(`Delete "${item.title}"?`)) { try { await deleteGrowthJourney(item.id); } catch (e) { /* handled */ } } }}
                  className="admin-btn-danger"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                >
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {growthJourney.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><FaHistory size={40} /></div>
            <p>No growth journey milestones yet.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>
                <FaHistory size={20} style={{ marginRight: '6px' }} /> {editingId ? 'Edit' : 'Add'} Milestone
              </h3>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label className="admin-label">Milestone *</label>
                  <input className="admin-input" type="text" placeholder="e.g. 2026" value={form.milestone} onChange={e => setForm(p => ({ ...p, milestone: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Year *</label>
                  <input className="admin-input" type="text" placeholder="e.g. 2026" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="admin-label">Title *</label>
                <input className="admin-input" type="text" placeholder="e.g. The Beginning" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea className="admin-input" placeholder="Milestone description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label className="admin-label">Stat Value</label>
                  <input className="admin-input" type="text" placeholder="e.g. 30 L/Day" value={form.stat_value} onChange={e => setForm(p => ({ ...p, stat_value: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Stat Label</label>
                  <input className="admin-input" type="text" placeholder="e.g. Daily Production" value={form.stat_label} onChange={e => setForm(p => ({ ...p, stat_label: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label className="admin-label">Color</label>
                  <input className="admin-input" type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Side</label>
                  <select className="admin-input" value={form.side} onChange={e => setForm(p => ({ ...p, side: e.target.value as 'left' | 'right' }))}>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Upload Image (JPG, PNG, WEBP)</label>
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
                    <img src={form.image.startsWith('/uploads') ? `http://localhost:3000${form.image}` : form.image} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px', marginTop: '0.75rem' }} />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}><FaSave size={14} style={{ marginRight: '6px' }} /> {editingId ? 'Update' : 'Add'}</button>
                <button onClick={handleClose} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrowthJourney;
