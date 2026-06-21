import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaSave, FaCheckCircle, FaGlobe, FaPhoneAlt, FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedinIn, FaChartBar } from 'react-icons/fa';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...settings });

  useEffect(() => { setForm({ ...settings }); }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>Site Settings</h2>
        <button onClick={handleSave} className="admin-btn-primary">
          <FaSave size={14} style={{ marginRight: '6px' }} /> Save All Settings
        </button>
      </div>

      {saved && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <FaCheckCircle size={16} color="#065f46" />
          <span style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600 }}>Settings saved successfully!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* General */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaGlobe size={20} /> General Settings
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Website Name</label>
              <input className="admin-input" type="text" value={form.siteName} onChange={e => setForm(p => ({ ...p, siteName: e.target.value }))} />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input className="admin-input" type="text" value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaPhoneAlt size={20} /> Contact Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="admin-label">Phone Number</label>
              <input className="admin-input" type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="admin-label">Email Address</label>
              <input className="admin-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="admin-label">Address</label>
              <input className="admin-input" type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="admin-label">Google Maps Embed URL</label>
              <input className="admin-input" type="text" value={form.mapEmbed} onChange={e => setForm(p => ({ ...p, mapEmbed: e.target.value }))} placeholder="https://www.google.com/maps/embed?..." />
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
                Go to Google Maps → Share → Embed a map → Copy the src URL
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaGlobe size={20} /> Social Media Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Facebook', key: 'facebook', icon: <FaFacebookF size={14} /> },
              { label: 'Instagram', key: 'instagram', icon: <FaInstagram size={14} /> },
              { label: 'WhatsApp', key: 'whatsapp', icon: <FaWhatsapp size={14} /> },
              { label: 'YouTube', key: 'youtube', icon: <FaYoutube size={14} /> },
              { label: 'LinkedIn', key: 'linkedin', icon: <FaLinkedinIn size={14} /> },
            ].map(social => (
              <div key={social.key}>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {social.icon} {social.label}
                </label>
                <input
                  className="admin-input"
                  type="text"
                  value={form[social.key as keyof typeof form] as string}
                  onChange={e => setForm(p => ({ ...p, [social.key]: e.target.value }))}
                  placeholder={`https://...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Count */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartBar size={20} /> Website Statistics
          </h3>
          <div style={{ maxWidth: '300px' }}>
            <label className="admin-label">Total Visitors Count</label>
            <input
              className="admin-input"
              type="number"
              value={form.visitors}
              onChange={e => setForm(p => ({ ...p, visitors: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <button onClick={handleSave} className="admin-btn-primary" style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>
          <FaSave size={16} style={{ marginRight: '6px' }} /> Save All Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
