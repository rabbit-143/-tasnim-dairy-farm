import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FaCalendarAlt, FaUsers, FaBullseye, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { GiMilkCarton } from 'react-icons/gi';

const Footer: React.FC = () => {
  const { settings } = useAdmin();
  const navigate = useNavigate();

  const quickLinks = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'farm', label: 'Our Farm', path: '/farm' },
    { id: 'founders', label: 'Founders', path: '/founders' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'growth', label: 'Growth Journey', path: '/growth' },
    { id: 'blog', label: 'Dairy Blog', path: '/blog' },
    { id: 'careers', label: 'Careers', path: '/careers' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'about', label: 'About Us', path: '/about' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Main footer */}
      <div style={{ padding: '4rem 1.5rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {/* CHANGED: Added gold circular background around footer logo */}
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
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div className="footer-logo">{settings.siteName}</div>
                <div style={{ fontSize: '0.7rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{settings.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Established 2015. Committed to producing pure, safe, and high-quality milk while contributing to food security and sustainable agriculture.
            </p>
            {/* Bismillah */}
            <div style={{
              fontFamily: '"Noto Sans", sans-serif',
              color: '#D4AF37',
              fontSize: '1rem',
              padding: '0.75rem',
              background: 'rgba(212,175,55,0.08)',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid rgba(212,175,55,0.15)',
            }}>
              بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#D4AF37', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Quick Links
            </h4>
            {quickLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.path)}
                className="footer-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif' }}
              >
                › {link.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: '#D4AF37',
                fontWeight: 700,
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Contact Us
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <FaMapMarkerAlt
                  style={{
                    color: '#D4AF37',
                    fontSize: '1rem',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                />
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: '1.5'
                  }}
                >
                  {settings.address}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <FaPhoneAlt style={{ color: '#D4AF37' }} />
                <a
                  href={`tel:${settings.phone}`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none'
                  }}
                >
                  {settings.phone}
                </a>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <FaEnvelope style={{ color: '#D4AF37' }} />
                <a
                  href={`mailto:${settings.email}`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none'
                  }}
                >
                  {settings.email}
                </a>
              </div>

            </div>

            {/* Social Icons */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ color: '#D4AF37', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Follow Us
              </h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { href: settings.facebook, icon: '/images/social-media/facebook.png', label: 'Facebook', color: '#1877F2' },
                  { href: settings.instagram, icon: '/images/social-media/instagram.png', label: 'Instagram', color: '#E1306C' },
                  { href: settings.whatsapp, icon: '/images/social-media/social.png', label: 'WhatsApp', color: '#25D366' },
                  { href: settings.youtube, icon: '/images/social-media/youtube.png', label: 'YouTube', color: '#FF0000' },
                  { href: settings.linkedin, icon: '/images/social-media/linkedin.png', label: 'LinkedIn', color: '#0A66C2' },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className="social-btn"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <img src={social.icon} alt={social.label} style={{ width: '24px', height: '24px' }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Farm Stats */}
          <div>
            <h4 style={{ color: '#D4AF37', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Farm at a Glance
            </h4>
            {[
              { icon: <FaCalendarAlt />, label: 'Established', value: '2026' },
              { icon: <GiMilkCarton />, label: 'Daily Production', value: '100 L' },
              { icon: <FaUsers />, label: 'Employees', value: '125' },
              { icon: <FaBullseye />, label: 'Target (2028)', value: '1,000 L/day' },
            ].map(stat => (
              <div key={stat.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                  {stat.icon} {stat.label}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
              © 2026 {settings.siteName}. All Rights Reserved. | Built with care for pure milk production.
              {' '}Developed By{' '}
              <a
                href="https://www.facebook.com/hmnobin.24434"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#D4AF37',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: '0.3s'
                }}
              >
                HM Nobin
              </a>
            </p>
      </div>
    </footer>
  );
};

export default Footer;
