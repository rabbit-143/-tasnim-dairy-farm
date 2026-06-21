import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { CareerPost } from '../data/store';
import { FaPlus, FaBriefcase, FaCheckCircle, FaTimesCircle, FaUsers, FaCalendarAlt, FaPause, FaPlay, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

const AdminCareers: React.FC = () => {
  const { careers, addCareer, updateCareer, deleteCareer } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CareerPost | null>(null);
  const [form, setForm] = useState({
    title: '', department: '', vacancy: 1, deadline: '',
    requirements: '', applyEmail: '', active: true,
  });

  const resetForm = () => {
    setForm({ title: '', department: '', vacancy: 1, deadline: '', requirements: '', applyEmail: '', active: true });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => { resetForm(); setShowForm(true); };

  const openEdit = (career: CareerPost) => {
    setForm({
      title: career.title, department: career.department, vacancy: career.vacancy,
      deadline: career.deadline, requirements: career.requirements.join('\n'),
      applyEmail: career.applyEmail, active: career.active,
    });
    setEditing(career);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.department.trim()) { alert('Title and department required.'); return; }
    const data = {
      ...form,
      requirements: form.requirements.split('\n').map(r => r.trim()).filter(r => r),
    };
    try {
      if (editing) { await updateCareer(editing.id, data); }
      else { await addCareer(data); }
      resetForm();
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Manage Careers</h2>
        <button onClick={openAdd} className="admin-btn-primary"><FaPlus size={14} style={{ marginRight: '6px' }} /> Post Job</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {careers.map(career => (
          <div key={career.id} className="admin-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '50px', height: '50px', flexShrink: 0, borderRadius: '14px',
              background: 'linear-gradient(135deg, #0F5D2F, #1a7a3f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
            }}><FaBriefcase size={24} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{career.department}</span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '50px',
                  background: career.active ? '#0F5D2F15' : '#ef444415',
                  color: career.active ? '#0F5D2F' : '#ef4444',
                }}>
                  {career.active ? <><FaCheckCircle size={12} /> Active</> : <><FaTimesCircle size={12} /> Closed</>}
                </span>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>{career.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}><FaUsers size={12} /> {career.vacancy} Vacant</span>
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}><FaCalendarAlt size={12} /> {new Date(career.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={() => updateCareer(career.id, { active: !career.active })}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.78rem',
                  border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  background: career.active ? '#fef3c7' : '#d1fae5',
                  color: career.active ? '#92400e' : '#065f46',
                }}
              >
                {career.active ? <><FaPause size={12} /> Deactivate</> : <><FaPlay size={12} /> Activate</>}
              </button>
              <button onClick={() => openEdit(career)} className="admin-btn-edit"><FaEdit size={14} /></button>
              <button onClick={async () => { if (confirm('Delete this job posting?')) { try { await deleteCareer(career.id); } catch (e) { /* handled in context */ } } }} className="admin-btn-danger"><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
        {careers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><FaBriefcase size={40} /></div>
            <p>No job postings. Create your first position!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.1rem' }}>{editing ? <><FaEdit size={20} style={{ marginRight: '6px' }} /> Edit Job</> : <><FaPlus size={20} style={{ marginRight: '6px' }} /> Post New Job</>}</h3>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FaTimes size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="admin-label">Job Title *</label>
                <input className="admin-input" type="text" placeholder="e.g. Dairy Farm Supervisor" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Department *</label>
                  <input className="admin-input" type="text" placeholder="e.g. Operations" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Vacancies</label>
                  <input className="admin-input" type="number" min={1} value={form.vacancy} onChange={e => setForm(p => ({ ...p, vacancy: parseInt(e.target.value) || 1 }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Application Deadline</label>
                  <input className="admin-input" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                </div>
                <div>
                  <label className="admin-label">Apply Email</label>
                  <input className="admin-input" type="email" placeholder="careers@..." value={form.applyEmail} onChange={e => setForm(p => ({ ...p, applyEmail: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="admin-label">Requirements (one per line)</label>
                <textarea className="admin-input" placeholder="3+ years experience&#10;Knowledge of cattle management" rows={4} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                <label htmlFor="active" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}><FaCheckCircle size={14} /> Post as Active</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleSave} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center' }}><FaSave size={14} style={{ marginRight: '6px' }} /> {editing ? 'Update' : 'Post Job'}</button>
                <button onClick={resetForm} style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareers;
