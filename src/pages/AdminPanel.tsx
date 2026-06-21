import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { MdDashboard } from 'react-icons/md';
import { FaInfoCircle, FaUsers, FaImages, FaFileAlt, FaBriefcase, FaCog, FaHome, FaSignOutAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import AdminFounders from '../admin/AdminFounders';
import AdminBlogs from '../admin/AdminBlogs';
import AdminGallery from '../admin/AdminGallery';
import AdminCareers from '../admin/AdminCareers';
import AdminSettings from '../admin/AdminSettings';
import AdminAbout from '../admin/AdminAbout';
import AdminMessages from '../admin/AdminMessages';

type AdminPage = 'dashboard' | 'founders' | 'blogs' | 'gallery' | 'careers' | 'settings' | 'about' | 'messages';

interface AdminPanelProps {
  setCurrentPage: (page: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setCurrentPage }) => {
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  const navItems: { id: AdminPage; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <MdDashboard size={18} />, label: 'Dashboard' },
    { id: 'messages', icon: <FaEnvelope size={18} />, label: 'Messages' },
    { id: 'about', icon: <FaInfoCircle size={18} />, label: 'About & Vision' },
    { id: 'founders', icon: <FaUsers size={18} />, label: 'Founders' },
    { id: 'gallery', icon: <FaImages size={18} />, label: 'Gallery' },
    { id: 'blogs', icon: <FaFileAlt size={18} />, label: 'Blog Posts' },
    { id: 'careers', icon: <FaBriefcase size={18} />, label: 'Careers' },
    { id: 'settings', icon: <FaCog size={18} />, label: 'Site Settings' },
  ];

  const renderPage = () => {
    switch (adminPage) {
      case 'dashboard': return <AdminDashboard setAdminPage={setAdminPage} />;
      case 'messages': return <AdminMessages />;
      case 'founders': return <AdminFounders />;
      case 'blogs': return <AdminBlogs />;
      case 'gallery': return <AdminGallery />;
      case 'careers': return <AdminCareers />;
      case 'settings': return <AdminSettings />;
      case 'about': return <AdminAbout />;
      default: return <AdminDashboard setAdminPage={setAdminPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* Sidebar */}
      <div className="admin-sidebar" style={{
        transform: sidebarOpen ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', background: '#ffffff',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px'
            }}>
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>Tasnim Dairy Farm</div>
              <div style={{ color: '#D4AF37', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '1rem 0', flex: 1 }}>
          <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Management
          </div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setAdminPage(item.id); setSidebarOpen(false); }}
              className={`admin-nav-item ${adminPage === item.id ? 'active' : ''}`}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'Poppins, sans-serif', marginBottom: '0.5rem',
            }}
          >
            <FaHome size={16} /> View Website
          </button>
          <button
            onClick={logoutAdmin}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5', cursor: 'pointer', fontSize: '0.85rem',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <FaSignOutAlt size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main" style={{ flex: 1 }}>
        {/* Top Bar */}
        <div style={{
          background: '#ffffff', padding: '1rem 1.5rem', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 10px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', display: 'none' }}
              className="admin-mobile-toggle"
            >
              ☰
            </button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e' }}>
              {navItems.find(n => n.id === adminPage)?.icon} {navItems.find(n => n.id === adminPage)?.label}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: '#0F5D2F15', padding: '0.4rem 1rem', borderRadius: '50px',
              fontSize: '0.8rem', color: '#0F5D2F', fontWeight: 600,
            }}>
              <FaUser size={14} /> Admin
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '2rem', minHeight: 'calc(100vh - 68px)' }}>
          {renderPage()}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 100; }
          .admin-main { margin-left: 0 !important; }
          .admin-mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
