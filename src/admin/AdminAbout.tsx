import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaSave, FaCheckCircle, FaHome, FaEye, FaBullseye, FaChartBar } from 'react-icons/fa';

const AdminAbout: React.FC = () => {
  const { settings, updateSettings, growthStats, updateGrowthStat } = useAdmin();
  const [saved, setSaved] = useState(false);
  const [aboutContent, setAboutContent] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');

  // Update form when settings change
  useEffect(() => {
    setAboutContent(settings.aboutContent || '');
    setVision(settings.vision || '');
    setMission((settings.mission || []).join('\n'));
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        aboutContent,
        vision,
        mission: mission.split('\n').map(m => m.trim()).filter(m => m),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a2e' }}>About, Vision & Mission</h2>
        <button onClick={handleSave} className="admin-btn-primary"><FaSave size={14} style={{ marginRight: '6px' }} /> Save Changes</button>
      </div>

      {saved && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <FaCheckCircle size={16} /> <span style={{ fontSize: '0.875rem', color: '#065f46', fontWeight: 600 }}>Content saved successfully!</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* About Content */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <FaHome size={16} style={{ marginRight: '6px' }} /> About Us Content
          </h3>
          <div>
            <label className="admin-label">Company Overview Text</label>
            <textarea
              className="admin-input"
              rows={6}
              value={aboutContent}
              onChange={e => setAboutContent(e.target.value)}
              placeholder="Describe your company..."
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
              This text appears on the About page and homepage.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <FaEye size={16} style={{ marginRight: '6px' }} /> Vision Statement
          </h3>
          <div>
            <label className="admin-label">Vision Text</label>
            <textarea
              className="admin-input"
              rows={4}
              value={vision}
              onChange={e => setVision(e.target.value)}
              placeholder="Our vision is to..."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Mission */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <FaBullseye size={16} style={{ marginRight: '6px' }} /> Mission Points
          </h3>
          <div>
            <label className="admin-label">Mission Points (one per line)</label>
            <textarea
              className="admin-input"
              rows={8}
              value={mission}
              onChange={e => setMission(e.target.value)}
              placeholder="Produce healthy and pure milk&#10;Maintain farm hygiene&#10;Ensure animal welfare"
              style={{ resize: 'vertical' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem' }}>
              Enter each mission point on a new line. They will appear as a list.
            </p>
          </div>
        </div>

        {/* Growth Statistics */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <FaChartBar size={16} style={{ marginRight: '6px' }} /> Growth Statistics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {growthStats.map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div key={i} style={{ background: '#F8F9FA', borderRadius: '12px', padding: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0F5D2F' }}>
                    <FaChartBar size={24} />
                  </div>
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.72rem' }}>Label</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={stat.label}
                      onChange={e => updateGrowthStat(i, { label: e.target.value })}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <label className="admin-label" style={{ fontSize: '0.72rem' }}>Value</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={stat.value}
                      onChange={e => updateGrowthStat(i, { value: e.target.value })}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    <label className="admin-label" style={{ fontSize: '0.72rem' }}>Suffix (optional)</label>
                    <input
                      className="admin-input"
                      type="text"
                      value={stat.suffix || ''}
                      onChange={e => updateGrowthStat(i, { suffix: e.target.value })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleSave} className="admin-btn-primary" style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>
          <FaSave size={16} style={{ marginRight: '6px' }} /> Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminAbout;
