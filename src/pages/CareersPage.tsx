import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { CareerPost } from '../data/store';
import { FaStar, FaBriefcase, FaChartLine, FaHeart, FaHandshake, FaLeaf, FaCog, FaBullhorn, FaMoneyBillWave, FaUsers, FaTrophy, FaCalendarAlt, FaListAlt, FaTimes, FaCheck, FaEnvelope } from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';

const CareersPage: React.FC = () => {
  const { careers } = useAdmin();
  const [selectedJob, setSelectedJob] = useState<CareerPost | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const activeJobs = careers.filter(c => c.active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const els = pageRef.current?.querySelectorAll('.fade-up, .scale-in');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const deptIcons: Record<string, React.ReactNode> = {
    'Operations': <FaCog size={20} />,
    'Marketing': <FaBullhorn size={20} />,
    'Animal Health': <GiCow size={20} />,
    'Finance': <FaMoneyBillWave size={20} />,
    'HR': <FaUsers size={20} />,
    'Management': <FaTrophy size={20} />,
    'Default': <FaBriefcase size={20} />,
  };

  const getDeptIcon = (dept: string) => deptIcons[dept] || deptIcons['Default'];

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div className="particle" style={{ width: 200, height: 200, background: '#D4AF37', top: '-5%', left: '3%', opacity: 0.08, animationDuration: '8s' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaBriefcase size={14} style={{ marginRight: '6px' }} /> Join Our Team
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Career <span style={{ color: '#D4AF37' }}>Opportunities</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            Be part of Bangladesh's most promising dairy enterprise. Grow with us.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ background: '#ffffff', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaStar size={14} style={{ marginRight: '6px' }} /> Why Us</div>
            <h2 className="section-title">Why Join <span className="section-title-accent">Tasnim Dairy Farm</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <FaChartLine size={32} />, title: 'Career Growth', desc: 'Rapid organizational growth means fast career advancement opportunities.' },
              { icon: <FaHeart size={32} />, title: 'Meaningful Work', desc: 'Contribute to food security and sustainable agriculture in Bangladesh.' },
              { icon: <FaHandshake size={32} />, title: 'Teamwork', desc: 'Work in a collaborative, family-like environment built on mutual respect.' },
              { icon: <FaLeaf size={32} />, title: 'Learning', desc: 'Continuous training and skill development programs for all staff.' },
            ].map((benefit, i) => (
              <div key={i} className="glass-card fade-up" style={{ padding: '2rem', textAlign: 'center', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' }}>{benefit.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section style={{ background: '#F8F9FA', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaListAlt size={14} style={{ marginRight: '6px' }} /> Open Positions</div>
            <h2 className="section-title">Current <span className="section-title-accent">Vacancies</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">{activeJobs.length} position{activeJobs.length !== 1 ? 's' : ''} currently available</p>
          </div>

          {activeJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeJobs.map((job, i) => (
                <div
                  key={job.id}
                  className="career-card fade-up"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="career-icon" style={{ background: 'linear-gradient(135deg, #0F5D2F15, #0F5D2F25)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{getDeptIcon(job.department)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="career-dept">{job.department}</div>
                    <div className="career-title">{job.title}</div>
                    <div className="career-meta">
                      <span className="career-tag"><FaUsers size={12} /> {job.vacancy} Vacant</span>
                      <span className="career-tag"><FaCalendarAlt size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    style={{
                      background: 'linear-gradient(135deg, #0F5D2F, #1a7a3f)',
                      color: 'white', border: 'none', padding: '0.65rem 1.5rem',
                      borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem',
                      cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FaBriefcase size={48} /></div>
              <p style={{ fontSize: '1rem' }}>No positions available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span style={{
                  background: '#0F5D2F15', color: '#0F5D2F', padding: '0.25rem 0.75rem',
                  borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {selectedJob.department}
                </span>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}
              >
                <FaTimes size={18} />
              </button>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '1.25rem' }}>
              {selectedJob.title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Department', value: selectedJob.department },
                { label: 'Vacancies', value: `${selectedJob.vacancy} Position${selectedJob.vacancy > 1 ? 's' : ''}` },
                { label: 'Deadline', value: new Date(selectedJob.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { label: 'Status', value: selectedJob.active ? <><FaCheck size={12} /> Active</> : <><FaTimes size={12} /> Closed</> },
              ].map(item => (
                <div key={item.label} style={{ background: '#F8F9FA', borderRadius: '10px', padding: '0.875rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a2e', marginTop: '0.25rem' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Requirements
              </h3>
              <ul style={{ listStyle: 'none' }}>
                {selectedJob.requirements.map((req, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.4rem 0', fontSize: '0.875rem', color: '#374151', lineHeight: '1.6' }}>
                    <span style={{ color: '#0F5D2F', flexShrink: 0 }}><FaCheck size={12} /></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #0F5D2F10, #D4AF3710)', borderRadius: '14px', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
                <strong>To Apply:</strong> Send your CV and cover letter to:
              </p>
              <a
                href={`mailto:${selectedJob.applyEmail}?subject=Application for ${selectedJob.title}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'linear-gradient(135deg, #0F5D2F, #1a7a3f)',
                  color: 'white', padding: '0.75rem 1.5rem', borderRadius: '10px',
                  textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
                }}
              >
                <FaEnvelope size={14} /> Apply Now: {selectedJob.applyEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
