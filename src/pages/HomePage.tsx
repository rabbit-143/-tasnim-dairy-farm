import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
// CHANGED: Removed GiCow from hero badge import, but kept it for Farm Section Preview
import { GiCow, GiMilkCarton } from 'react-icons/gi';
import { FaHome, FaPhone, FaChartBar, FaCalendarAlt, FaChartLine, FaUsers, FaStar, FaBullseye, FaWarehouse, FaLeaf, FaFlask, FaBroom, FaEye, FaCheck, FaFileAlt, FaBriefcase, FaChevronDown } from 'react-icons/fa';


// Animate on scroll hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = ref.current?.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
};

const StatCounter: React.FC<{ end: number; suffix?: string; label: string; icon: React.ReactNode; delay?: number }> = ({
  end, suffix = '', label, icon, delay = 0
}) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  return (
    <div ref={ref} className="stat-card">
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <span className="stat-number">
        {inView ? <CountUp end={end} duration={2.5} delay={delay} separator="," /> : '0'}{suffix}
      </span>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { settings, blogs } = useAdmin();
  const pageRef = useScrollAnimation();
  const foundersRef = useRef<HTMLDivElement>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);


  // Auto-scroll to founders section if coming from founders page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scrollTo') === 'founders' && foundersRef.current) {
      setTimeout(() => {
        foundersRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div ref={pageRef}>
      {/* ======================== HERO SECTION ======================== */}
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('/images/hero-farm.jpg')` }}
        />
        <div className="hero-overlay" />

        {/* Floating particles */}
        <div className="particle" style={{ width: 200, height: 200, background: '#D4AF37', top: '10%', right: '5%', opacity: 0.05, animationDuration: '8s' }} />
        <div className="particle" style={{ width: 150, height: 150, background: '#ffffff', bottom: '20%', left: '3%', opacity: 0.04, animationDuration: '6s' }} />

        <div className="hero-content" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ maxWidth: '700px' }}>
            {/* CHANGED: Removed Hero Badge completely */}

            <h1
              className="hero-title"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.5s',
              }}
            >
              {settings.siteName}
              <span className="hero-title-accent">Pure Milk.</span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.7em' }}>Pure Promise.</span>
            </h1>

            <p
              className="hero-subtitle"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.7s',
              }}
            >
              Producing pure, safe, and high-quality milk while contributing to food security and sustainable agriculture in Bangladesh.
            </p>

            <div
              className="hero-stats"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.9s',
              }}
            >
              {[
                { value: '100', label: 'Liters Daily', suffix: 'L' },
                { value: '3,000', label: 'Monthly', suffix: 'L' },
                { value: '125', label: 'Employees', suffix: '+' },
                { value: '4', label: 'Founders', suffix: '' },
              ].map((stat, i) => (
                <div key={i} className="hero-stat">
                  <span className="hero-stat-num">{stat.value}{stat.suffix}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CHANGED: Reduced top margin from 2.5rem to 1.5rem */}
            <div
              style={{
                display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap',
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s ease 1.1s',
              }}
            >
              <button className="btn-primary" onClick={() => handleNavigate('/about')}>
                <FaHome size={16} style={{ marginRight: '0.5rem' }} /> About Our Farm
              </button>
              <button className="btn-outline" onClick={() => handleNavigate('/contact')}>
                <FaPhone size={16} style={{ marginRight: '0.5rem' }} /> Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* CHANGED: Updated scroll indicator with bouncing chevron icon */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem',
        }}>
          <span>Scroll Down</span>
          <FaChevronDown 
            size={20} 
            style={{ 
              color: '#D4AF37',
              animation: 'bounce 2s ease-in-out infinite'
            }} 
          />
        </div>
      </section>

      {/* CHANGED: Added bounce keyframe animation for scroll indicator */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* ======================== QUICK STATS ======================== */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaChartBar size={14} style={{ marginRight: '0.5rem' }} /> Growth Metrics</div>
            <h2 className="section-title">Farm <span className="section-title-accent">at a Glance</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">Tracking our journey from a small operation to a thriving dairy enterprise.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 180px))', gap: '1.25rem', justifyContent: 'center' }}>
            <div className="scale-in" style={{ animationDelay: '0s' }}>
              <StatCounter end={2026} label="Established" icon={<FaCalendarAlt />} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.1s' }}>
              <StatCounter end={30} suffix=" L/day" label="Initial Production" icon={<GiMilkCarton />} delay={0.2} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.2s' }}>
              <StatCounter end={100} suffix=" L/day" label="Current Production" icon={<FaChartLine />} delay={0.4} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.3s' }}>
              <StatCounter end={3000} suffix=" L/mo" label="Monthly Output" icon={<FaChartBar />} delay={0.3} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.4s' }}>
              <StatCounter end={10} label="Initial Employees" icon={<FaUsers />} delay={0.2} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.5s' }}>
              <StatCounter end={125} label="Current Employees" icon={<FaUsers />} delay={0.4} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.6s' }}>
              <StatCounter end={4} label="Founders" icon={<FaStar />} delay={0.1} />
            </div>
            <div className="scale-in" style={{ animationDelay: '0.7s' }}>
              <StatCounter end={1000} suffix=" L/day" label="Target 2028" icon={<FaBullseye />} delay={0.5} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== ABOUT PREVIEW ======================== */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div className="fade-left">
            <div className="section-badge"><FaHome size={14} style={{ marginRight: '0.5rem' }} /> About Us</div>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '1rem' }}>
              Our Story of <span className="section-title-accent">Pure Dedication</span>
            </h2>
            <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #0F5D2F, #D4AF37)', borderRadius: '2px', margin: '1.25rem 0' }} />
            <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: '1.9', marginBottom: '1.5rem' }}>
              {settings.aboutContent}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => handleNavigate('/about')}>
                Learn More →
              </button>
              <button
                onClick={() => handleNavigate('/founders')}
                style={{
                  background: 'transparent', border: '2px solid #0F5D2F', color: '#0F5D2F',
                  padding: '0.875rem 1.5rem', borderRadius: '50px', fontWeight: 600,
                  fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#0F5D2F'; (e.target as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#0F5D2F'; }}
              >
                Meet Founders
              </button>
            </div>
          </div>
          <div className="fade-right">
            <div style={{ position: 'relative' }}>
              <img
                src="/images/farm-overview.jpg"
                alt="Tasnim Dairy Farm Overview"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
              />
              {/* Badge overlay */}
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem',
                background: 'rgba(15, 93, 47, 0.95)', backdropFilter: 'blur(10px)',
                borderRadius: '16px', padding: '1rem 1.5rem', color: 'white',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                border: '1px solid rgba(212,175,55,0.3)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Est.</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Feb 14, 2026</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Founded with passion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== VISION & MISSION ======================== */}
      <section style={{ background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)', padding: '5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="particle" style={{ width: 300, height: 300, background: '#D4AF37', top: '-10%', right: '-5%', opacity: 0.05, animationDuration: '10s' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <FaStar size={14} style={{ marginRight: '0.5rem' }} /> Our Foundation
            </div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              Vision & <span style={{ color: '#D4AF37' }}>Mission</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Vision */}
            <div className="fade-left" style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.2)', borderRadius: '24px', padding: '2.5rem',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px', height: '56px', background: 'linear-gradient(135deg, #D4AF37, #e8c84a)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><FaEye size={24} color="#0a3d1f" /></div>
                <h3 style={{ color: '#D4AF37', fontSize: '1.4rem', fontWeight: 700 }}>Our Vision</h3>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.8' }}>
                {settings.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="fade-right" style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.2)', borderRadius: '24px', padding: '2.5rem',
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '56px', height: '56px', background: 'linear-gradient(135deg, #D4AF37, #e8c84a)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}><FaBullseye size={24} color="#0a3d1f" /></div>
                <h3 style={{ color: '#D4AF37', fontSize: '1.4rem', fontWeight: 700 }}>Our Mission</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {settings.mission.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <FaCheck size={14} style={{ color: '#D4AF37', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FOUNDERS PREVIEW ======================== */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }} ref={foundersRef}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <h2 className="section-title">Meet Our <span className="section-title-accent">Founders</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>

          {/* Responsive Banner with Hover Effect */}
          <div 
            className="fade-up"
            onClick={() => handleNavigate('/founders')}
            style={{
              marginTop: '2rem',
              cursor: 'pointer',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.02)';
              el.style.boxShadow = '0 30px 70px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
            }}
          >
            <img 
              src="/images/Founders%20Team.jpg" 
              alt="Meet Our Founders" 
              style={{
                width: '100%',
                height: 'clamp(300px, 50vw, 600px)',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn-primary" onClick={() => handleNavigate('/founders')}>
              View Founder Details →
            </button>
          </div>
        </div>
      </section>

      {/* ======================== FARM SECTION PREVIEW ======================== */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaWarehouse size={14} style={{ marginRight: '0.5rem' }} /> Our Operations</div>
            <h2 className="section-title">Life on the <span className="section-title-accent">Farm</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">From sunrise cattle care to evening milk collection – excellence in every step.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <GiCow size={24} />, title: 'Cattle Management', desc: 'Our trained veterinarians ensure every cow receives proper nutrition, healthcare, and humane treatment for optimal milk production.' },
              { icon: <FaLeaf size={24} />, title: 'Natural Feeding', desc: 'We use scientifically balanced feed with fresh grass, hay, and nutritional supplements to maintain cattle health.' },
              { icon: <GiMilkCarton size={24} />, title: 'Milk Collection', desc: 'Modern milking systems with strict hygiene protocols ensure safe, pure milk collection twice daily.' },
              { icon: <FaFlask size={24} />, title: 'Quality Control', desc: 'Every batch undergoes rigorous quality testing before dispatch, ensuring international safety standards.' },
              { icon: <FaBroom size={24} />, title: 'Hygiene Standards', desc: 'Strict farm sanitation protocols and regular deep cleaning maintain our premium hygiene rating.' },
              { icon: <FaLeaf size={24} />, title: 'Sustainability', desc: 'Eco-friendly practices including waste composting and water conservation guide our sustainable operations.' },
            ].map((feature, i) => (
              <div key={i} className="farm-feature fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="farm-feature-icon">{feature.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.7' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-primary" onClick={() => handleNavigate('/farm')}>
              Explore Our Farm →
            </button>
          </div>
        </div>
      </section>

      {/* ======================== BLOG PREVIEW ======================== */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaFileAlt size={14} style={{ marginRight: '0.5rem' }} /> Latest Articles</div>
            <h2 className="section-title">Dairy <span className="section-title-accent">Blog</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">Stay updated with the latest news, insights, and stories from our farm.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {blogs.slice(0, 3).map((post, i) => (
              <div key={post.id} className="blog-card fade-up" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="blog-img">
                  {post.image ? (
                    <img src={post.image} alt={post.title} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}><FaFileAlt /></span>
                  )}
                  <div className="blog-category">{post.category}</div>
                </div>
                <div className="blog-body">
                  <div className="blog-date">
                    <FaCalendarAlt size={12} style={{ marginRight: '0.4rem' }} />
                    {new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="blog-title">{post.title}</div>
                  <div className="blog-excerpt">{post.excerpt}</div>
                  <button
                    className="blog-read-more"
                    onClick={() => handleNavigate('/blog')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-primary" onClick={() => handleNavigate('/blog')}>
              View All Articles →
            </button>
          </div>
        </div>
      </section>

      {/* ======================== CTA BANNER ======================== */}
      <section style={{
        background: 'linear-gradient(135deg, #0F5D2F, #D4AF37)',
        padding: '4rem 1.5rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }} className="fade-up">
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Join Our Growing Family
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.8', marginBottom: '2rem' }}>
            Be part of Bangladesh's most promising dairy enterprise. Whether you're a job seeker, partner, or supporter – we welcome you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#0F5D2F' }}
              onClick={() => navigate('/careers')}
            >
              <FaBriefcase size={1} style={{ marginRight: '0.5rem' }} /> View Careers
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate('/contact')}
            >
              <FaPhone size={16} style={{ marginRight: '0.5rem' }} /> Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
