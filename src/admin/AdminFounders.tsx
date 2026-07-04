import React, { useState } from 'react';
import { useAdmin, API_BASE_URL } from '../context/AdminContext';
import type { Founder } from '../data/store';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaChevronRight, FaSpinner } from 'react-icons/fa';

const AdminFounders: React.FC = () => {
  const { founders, addFounder, updateFounder, deleteFounder, loading } = useAdmin();
  const [editing, setEditing] = useState<Founder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', role: '', responsibilities: '', image: null as string | null,
  });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', role: '', responsibilities: '', image: null });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => {
    setForm({ name: '', role: '', responsibilities: '', image: null });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (founder: Founder) => {
    setForm({
      name: founder.name,
      role: founder.role,
      responsibilities: founder.responsibilities.join('\n'),
      image: founder.image,
    });
    setEditing(founder);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Set the filepath returned from backend
      setForm(prev => ({ ...prev, image: data.filepath }));
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      alert('Please fill in name and role.');
      return;
    }
    
    const responsibilities = form.responsibilities.split('\n').map(r => r.trim()).filter(r => r);
    
    try {
      if (editing) {
        await updateFounder(editing.id, { 
          name: form.name, 
          role: form.role, 
          responsibilities, 
          image: form.image 
        });
      } else {
        await addFounder({ 
          name: form.name, 
          role: form.role, 
          responsibilities, 
          image: form.image 
        });
      }
      resetForm();
    } catch (error) {
      // Error already handled in AdminContext
      console.error('Save error:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Founders</h2>
        <button onClick={openAdd} className="admin-btn-primary" disabled={loading}>
          <FaPlus size={14} style={{ marginRight: '6px' }} /> Add Founder
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#0F5D2F' }}>
          <FaSpinner size={24} className="spin" /> Loading founders...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {founders.map(founder => (
          <div key={founder.id} className="admin-card" style={{ position: 'relative' }}>
            <div style={{
              height: '160px', borderRadius: '12px', overflow: 'hidden',
              background: 'linear-gradient(135deg, #0F5D2F15, #D4AF3715)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
            }}>
              {founder.image ? (
                <img 
                  src={founder.image.startsWith('/uploads') 
                    ? founder.image
                    : founder.image
                  } 
                  alt={founder.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F5D2F, #1a7a3f)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4AF37', fontSize: '2rem', fontWeight: 800,
                }}>
                  {founder.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e' }}>{founder.name}</h3>
            <p style={{ fontSize: '0.78rem', color: '#0F5D2F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{founder.role}</p>
            <ul style={{ marginTop: '0.75rem', listStyle: 'none' }}>
              {founder.responsibilities.map((r, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: '#6b7280', padding: '0.2rem 0', display: 'flex', gap: '0.4rem' }}>
                  <span style={{ color: '#D4AF37' }}><FaChevronRight size={10} /></span> {r}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button onClick={() => openEdit(founder)} className="admin-btn-edit" style={{ flex: 1 }} disabled={loading}>
                <FaEdit size={14} /> Edit
              </button>
              <button
                onClick={async () => { 
                  if (confirm(`Delete ${founder.name}?`)) {
                    try {
                      await deleteFounder(founder.id);
                    } catch (error) {
                      // Error already handled in context
                    }
                  }
                }}
                className="admin-btn-danger"
                style={{ flex: 1 }}
                disabled={loading}
              >
                <FaTrash size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>
                {editing ? <><FaEdit size={20} style={{ marginRight: '6px' }} /> Edit Founder</> : <><FaPlus size={20} style={{ marginRight: '6px' }} /> Add Founder</>}
              </h3>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#6b7280' }}><FaTimes size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="admin-label">Full Name *</label>
                <input className="admin-input" type="text" placeholder="Founder name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} disabled={loading} />
              </div>
              <div>
                <label className="admin-label">Role / Title *</label>
                <input className="admin-input" type="text" placeholder="e.g. CEO & Founder" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} disabled={loading} />
              </div>
              <div>
                <label className="admin-label">Responsibilities (one per line)</label>
                <textarea className="admin-input" placeholder="Strategic Leadership&#10;Farm Management&#10;Growth Planning" rows={4} value={form.responsibilities} onChange={e => setForm(p => ({ ...p, responsibilities: e.target.value }))} style={{ resize: 'vertical' }} disabled={loading} />
              </div>
              <div>
                <label className="admin-label">Photo (JPG, PNG, WEBP only, Max 5MB)</label>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.webp" 
                  onChange={handleImageUpload} 
                  style={{ display: 'block', width: '100%', fontSize: '0.85rem' }} 
                  disabled={uploading || loading}
                />
                {uploading && (
                  <div style={{ marginTop: '0.5rem', color: '#0F5D2F', fontSize: '0.85rem' }}>
                    <FaSpinner className="spin" style={{ marginRight: '6px' }} />
                    Uploading image...
                  </div>
                )}
                {form.image && !uploading && (
                  <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={form.image.startsWith('/uploads') 
                        ? form.image
                        : form.image
                      } 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #0F5D2F20' }} 
                    />
                    <button onClick={() => setForm(p => ({ ...p, image: null }))} style={{
                      position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px',
                      borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none',
                      cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }} disabled={loading}><FaTimes size={12} /></button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={uploading || loading}>
                  {loading ? <><FaSpinner className="spin" style={{ marginRight: '6px' }} /> Saving...</> : <><FaSave size={14} style={{ marginRight: '6px' }} /> {editing ? 'Update' : 'Save'}</>}
                </button>
                <button onClick={resetForm} style={{
                  flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1.5px solid #e5e7eb',
                  background: 'white', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                }} disabled={loading}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFounders;
