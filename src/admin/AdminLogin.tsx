import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaEye, FaEyeSlash, FaLock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
// CHANGED: Removed GiCow import as it's no longer needed

const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const success = loginAdmin(username, password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a3d1f 0%, #0F5D2F 50%, #1a7a3f 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif', padding: '1rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background particles */}
      <div className="particle" style={{ width: 300, height: 300, background: '#D4AF37', top: '-10%', right: '-5%', opacity: 0.06, animationDuration: '10s' }} />
      <div className="particle" style={{ width: 200, height: 200, background: '#ffffff', bottom: '-5%', left: '-3%', opacity: 0.04, animationDuration: '7s' }} />

      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '28px',
        padding: '3rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {/* CHANGED: Replaced circular cow icon with logo image */}
          <img 
            src="/images/logo.png" 
            alt="Tasnim Dairy Farm Logo"
            style={{
              width: '120px',
              height: 'auto',
              display: 'block',
              margin: '0 auto 1rem auto',
              objectFit: 'contain'
            }}
          />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e' }}>Admin Panel</h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>Tasnim Dairy Farm Management</p>
          <div style={{
            fontFamily: 'Amiri, serif', color: '#D4AF37', fontSize: '1rem',
            marginTop: '0.75rem', padding: '0.5rem', background: '#0F5D2F08',
            borderRadius: '8px', border: '1px solid #0F5D2F15',
          }}>
            بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="admin-label">Username</label>
            <input
              className="admin-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="admin-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280',
                }}
              >
                {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
              padding: '0.875rem', fontSize: '0.85rem', color: '#dc2626',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
            }}>
              <FaExclamationTriangle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <><FaSpinner size={16} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} /> Signing in...</>
            ) : (
              <><FaLock size={16} style={{ marginRight: '0.5rem' }} /> Sign In to Admin</>
            )}
          </button>
        </form>

        {/* <div style={{
          marginTop: '1.5rem', padding: '1rem', background: '#F8F9FA',
          borderRadius: '12px', fontSize: '0.78rem', color: '#6b7280', textAlign: 'center',
        }}>
          <p>Default credentials:</p>
          <p style={{ color: '#0F5D2F', fontWeight: 600 }}>Username: admin | Password: tasnim@2026</p>
        </div> */}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
