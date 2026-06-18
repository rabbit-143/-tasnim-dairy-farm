import React, { useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaHome, FaBookOpen, FaEye, FaBullseye, FaGem, FaCalendarAlt, FaUsers, FaStar, FaLeaf, FaHandshake, FaHeart, FaTrophy, FaGlobe } from 'react-icons/fa';
import { GiMilkCarton } from 'react-icons/gi';

const AboutPage: React.FC = () => {
  const { settings } = useAdmin();
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
      {/* Page Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="particle" style={{ width: 200, height: 200, background: '#D4AF37', top: '-5%', right: '5%', opacity: 0.08, animationDuration: '8s' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaHome size={14} style={{ marginRight: '6px' }} /> About Us
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            About <span style={{ color: '#D4AF37' }}>Tasnim Dairy Farm</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            Our story, values, vision, and the mission that drives us every day.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="fade-left">
            <div className="section-badge"><FaBookOpen size={14} style={{ marginRight: '6px' }} /> Our Story</div>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '1rem' }}>
              Company <span className="section-title-accent">Overview</span>
            </h2>
            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #0F5D2F, #D4AF37)', borderRadius: '2px', margin: '1.25rem 0' }} />
            <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: '1.9', marginBottom: '2rem' }}>
              {settings.aboutContent}
            </p>

            {/* Key facts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: <FaCalendarAlt size={18} />, label: 'Founded', value: '14 Feb 2026' },
                { icon: <FaUsers size={18} />, label: 'Employees', value: '125+' },
                { icon: <GiMilkCarton size={18} />, label: 'Daily Output', value: '100 Liters' },
                { icon: <FaStar size={18} />, label: 'Founders', value: '4 Visionaries' },
              ].map(fact => (
                <div key={fact.label} style={{
                  background: '#F8F9FA', borderRadius: '14px', padding: '1.25rem',
                  border: '1px solid rgba(15,93,47,0.08)', display: 'flex', gap: '0.75rem', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{fact.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{fact.label}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F5D2F' }}>{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-right">
            <div style={{ position: 'relative' }}>
              <img
                src="/images/farm-landscape.jpg"
                alt="Tasnim Dairy Farm"
                style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
              />
              <div style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'linear-gradient(135deg, #0F5D2F, #D4AF37)',
                borderRadius: '16px', padding: '1rem 1.5rem', color: 'white',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>Target</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1,000 L</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Daily by 2028</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="fade-up">
            <div className="section-badge"><FaEye size={14} style={{ marginRight: '6px' }} /> Vision</div>
            <h2 className="section-title" style={{ marginTop: '1rem' }}>
              Our <span className="section-title-accent">Vision</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #0F5D2F, #1a7a3f)',
              borderRadius: '24px', padding: '3rem 3.5rem',
              position: 'relative', overflow: 'hidden', marginTop: '2rem',
            }}>
              <div style={{
                position: 'absolute', top: '-30px', right: '-30px',
                width: '120px', height: '120px', background: 'rgba(212,175,55,0.15)',
                borderRadius: '50%',
              }} />
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}><FaGlobe size={48} /></div>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'rgba(255,255,255,0.95)',
                lineHeight: '1.8', fontStyle: 'italic', position: 'relative', zIndex: 2,
              }}>
                "{settings.vision}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaBullseye size={14} style={{ marginRight: '6px' }} /> Mission</div>
            <h2 className="section-title">
              Our <span className="section-title-accent">Mission</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">The principles that guide every decision we make at the farm.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {settings.mission.map((item, i) => (
              <div key={i} className="glass-card fade-up" style={{
                padding: '2rem', transitionDelay: `${i * 0.1}s`,
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #0F5D2F, #D4AF37)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: '1.7', fontWeight: 500 }}>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <FaGem size={14} style={{ marginRight: '6px' }} /> Core Values
            </div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              What We <span style={{ color: '#D4AF37' }}>Stand For</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <FaLeaf size={32} />, title: 'Purity', desc: 'Every drop meets the highest safety standards' },
              { icon: <FaHandshake size={32} />, title: 'Integrity', desc: 'Honest practices from farm to consumer' },
              { icon: <FaHeart size={32} />, title: 'Sustainability', desc: 'Eco-conscious farming for future generations' },
              { icon: <FaTrophy size={32} />, title: 'Excellence', desc: 'Continuous improvement in all operations' },
              { icon: <FaHeart size={32} />, title: 'Care', desc: 'For animals, employees, and community' },
            ].map((val, i) => (
              <div key={i} className="scale-in" style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,175,55,0.2)', borderRadius: '20px',
                padding: '2rem', textAlign: 'center',
                transitionDelay: `${i * 0.1}s`,
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{val.icon}</div>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{val.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6' }}>{val.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
