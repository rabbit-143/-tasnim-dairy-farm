import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FaTimes } from 'react-icons/fa';

const navItems = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'farm', label: 'Our Farm', path: '/farm' },
  { id: 'founders', label: 'Founders', path: '/founders' },
  { id: 'gallery', label: 'Gallery', path: '/gallery' },
  { id: 'growth', label: 'Growth Journey', path: '/growth' },
  { id: 'careers', label: 'Careers', path: '/careers' },
  { id: 'blog', label: 'Dairy Blog', path: '/blog' },
  { id: 'contact', label: 'Contact', path: '/contact' },
  { id: 'about', label: 'About Us', path: '/about' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Bismillah Top Header */}
      <div className="top-header">
        <div className="bismillah-text">
          بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="nav-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {/* CHANGED: Added gold circular background around logo */}
            <div className="nav-logo-icon">
              <div style={{
                background: '#D4AF37',
                borderRadius: '50%',
                padding: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            </div>
            <div>
              <div className="nav-logo-text">{settings.siteName}</div>
              <div className="nav-logo-sub">{settings.tagline}</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.path)}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
              >
                {item.label}
              </button>
            ))}
            {/* <button
              onClick={() => handleNav('/admin')}
              style={{
                marginLeft: '0.5rem',
                background: 'linear-gradient(135deg, #D4AF37, #e8c84a)',
                color: '#0a3d1f',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              ⚙ Admin
            </button> */}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* CHANGED: Added gold circular background around mobile menu logo */}
            <div style={{
              background: '#D4AF37',
              borderRadius: '50%',
              padding: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            </div>
            <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1.1rem' }}>
              {settings.siteName}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div style={{ fontFamily: 'Amiri, serif', color: '#D4AF37', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item.path)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: isActive(item.path) ? 'rgba(212,175,55,0.15)' : 'none',
              border: 'none',
              color: isActive(item.path) ? '#D4AF37' : 'rgba(255,255,255,0.85)',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              marginBottom: '0.25rem',
              borderLeft: isActive(item.path) ? '3px solid #D4AF37' : '3px solid transparent',
            }}
          >
            {item.label}
          </button>
        ))}

        {/* <button
          onClick={() => handleNav('/admin')}
          style={{
            marginTop: '1rem',
            width: '100%',
            background: 'linear-gradient(135deg, #D4AF37, #e8c84a)',
            color: '#0a3d1f',
            border: 'none',
            padding: '0.85rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          ⚙ Admin Panel
        </button> */}
      </div>

      <style>{`
        .nav-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }

        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
