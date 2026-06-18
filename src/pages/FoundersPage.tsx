import React, { useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaStar, FaSeedling, FaBookOpen } from 'react-icons/fa';

const FoundersPage: React.FC = () => {
  const { founders } = useAdmin();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const els = pageRef.current?.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div className="particle" style={{ width: 200, height: 200, background: '#D4AF37', top: '-5%', left: '5%', opacity: 0.08, animationDuration: '8s' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaStar size={14} style={{ marginRight: '6px' }} /> Our Leaders
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Meet the <span style={{ color: '#D4AF37' }}>Founders</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            Four passionate individuals who had the vision to establish a world-class dairy farm in Bangladesh.
          </p>
        </div>
      </section>

      {/* Founders Grid */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {founders.map((founder, i) => (
              <div key={founder.id} className="fade-up" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="founder-card" style={{ height: '100%' }}>
                  <div className="founder-img-wrapper" style={{ height: '300px' }}>
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} className="founder-img" />
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div className="founder-placeholder">
                          {founder.name.charAt(0)}
                        </div>
                        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>Photo Coming Soon</p>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #0F5D2F15, #0F5D2F25)',
                        color: '#0F5D2F', fontSize: '0.72rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        padding: '0.2rem 0.7rem', borderRadius: '50px',
                      }}>
                        {founder.role}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1a2e', margin: '0.75rem 0 0.5rem' }}>
                      {founder.name}
                    </h3>
                    <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg, #0F5D2F, #D4AF37)', borderRadius: '2px', marginBottom: '1rem' }} />
                    <div>
                      <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        Key Responsibilities
                      </p>
                      <ul className="founder-responsibilities">
                        {founder.responsibilities.map((r, ri) => (
                          <li key={ri}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="fade-up">
            <div className="section-badge"><FaBookOpen size={14} style={{ marginRight: '6px' }} /> Our Origin</div>
            <h2 className="section-title" style={{ marginTop: '1rem' }}>
              The <span className="section-title-accent">Founding Story</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <div style={{ background: '#F8F9FA', borderRadius: '24px', padding: '3rem', marginTop: '2rem', border: '1px solid rgba(15,93,47,0.1)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}><FaSeedling size={48} /></div>
              <p style={{ fontSize: '1.05rem', color: '#374151', lineHeight: '1.9', marginBottom: '1.5rem' }}>
                On <strong style={{ color: '#0F5D2F' }}>14 February 2026</strong>, four passionate individuals united by a shared dream decided to transform Bangladesh's dairy landscape. Starting with just <strong style={{ color: '#0F5D2F' }}>30 liters of milk daily</strong> and <strong style={{ color: '#0F5D2F' }}>10 dedicated employees</strong>, they laid the foundation of what would become one of Bangladesh's most promising dairy farms.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#374151', lineHeight: '1.9' }}>
                Today, less than a year later, Tasnim Dairy Farm produces <strong style={{ color: '#D4AF37' }}>100 liters daily</strong> with <strong style={{ color: '#D4AF37' }}>125 employees</strong>, demonstrating the power of vision, hard work, and commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoundersPage;
