import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaCalendarAlt, FaUsers, FaUser, FaStar, FaBullseye, FaChartLine, FaChartBar, FaListAlt, FaGlobe, FaSeedling, FaRocket, FaIndustry, FaDna, FaLaptop, FaGraduationCap, FaLeaf } from 'react-icons/fa';
import { GiMilkCarton } from 'react-icons/gi';

const StatBlock: React.FC<{ end: number; suffix?: string; label: string; icon: React.ReactNode }> = ({
  end, suffix = '', label, icon
}) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  return (
    <div ref={ref} className="stat-card">
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <span className="stat-number">
        {inView ? <CountUp end={end} duration={2.5} separator="," /> : '0'}{suffix}
      </span>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const GrowthPage: React.FC = () => {
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

  const timelineData = [
    {
      year: '2026',
      icon: <FaSeedling size={20} />,
      title: 'The Beginning',
      subtitle: 'Farm Founded – February 14, 2026',
      desc: 'Four passionate founders established Tasnim Dairy Farm with a bold vision. Started with 30 liters daily production and 10 dedicated employees. The foundation of a great dairy empire was laid.',
      stat: '30 L/Day',
      statLabel: 'Daily Production',
      color: '#0F5D2F',
      side: 'left',
    },
    {
      year: 'Present',
      icon: <FaChartLine size={20} />,
      title: 'Rapid Growth',
      subtitle: 'Current Operations – 2026',
      desc: 'Within months of founding, production tripled to 100 liters daily. The workforce grew to 125 employees. Modern dairy management systems implemented. Quality control protocols established.',
      stat: '100 L/Day',
      statLabel: 'Current Production',
      color: '#D4AF37',
      side: 'right',
    },
    {
      year: '2028',
      icon: <FaRocket size={20} />,
      title: 'Target Milestone',
      subtitle: 'Ambitious 2028 Goal',
      desc: 'Target production of 1,000 liters daily and 30,000 liters monthly. Expansion of farm facilities, modernization of production systems, and significant workforce growth planned.',
      stat: '1,000 L/Day',
      statLabel: 'Target Production',
      color: '#0F5D2F',
      side: 'left',
    },
    {
      year: 'Future',
      icon: <FaGlobe size={20} />,
      title: 'Global Expansion',
      subtitle: 'Long-Term Vision',
      desc: 'Establishment of a worldwide dairy supply network. International market penetration with certified pure milk. Recognition as one of Bangladesh\'s leading dairy brands globally.',
      stat: 'Global',
      statLabel: 'Market Reach',
      color: '#D4AF37',
      side: 'right',
    },
  ];

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div className="particle" style={{ width: 250, height: 250, background: '#D4AF37', bottom: '-5%', right: '3%', opacity: 0.07, animationDuration: '9s' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaChartLine size={14} style={{ marginRight: '6px' }} /> Our Journey
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Growth <span style={{ color: '#D4AF37' }}>Journey</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            From humble beginnings to ambitious goals – tracking our remarkable growth trajectory.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#F8F9FA', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaChartBar size={14} style={{ marginRight: '6px' }} /> Numbers That Matter</div>
            <h2 className="section-title">Growth <span className="section-title-accent">Statistics</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
            <StatBlock end={2026} label="Year Founded" icon={<FaCalendarAlt size={32} />} />
            <StatBlock end={30} suffix=" L" label="Initial Daily" icon={<GiMilkCarton size={32} />} />
            <StatBlock end={100} suffix=" L" label="Current Daily" icon={<FaChartLine size={32} />} />
            <StatBlock end={3000} suffix=" L" label="Monthly Output" icon={<FaListAlt size={32} />} />
            <StatBlock end={10} label="Initial Staff" icon={<FaUser size={32} />} />
            <StatBlock end={125} label="Current Staff" icon={<FaUsers size={32} />} />
            <StatBlock end={4} label="Founders" icon={<FaStar size={32} />} />
            <StatBlock end={1000} suffix=" L" label="Target 2028" icon={<FaBullseye size={32} />} />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge"><FaListAlt size={14} style={{ marginRight: '6px' }} /> Timeline</div>
            <h2 className="section-title">Our <span className="section-title-accent">Milestones</span></h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
            <p className="section-desc">A visual journey through our key milestones and future targets.</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line" />

            {timelineData.map((item, i) => (
              <div
                key={i}
                className={`timeline-item ${item.side === 'right' ? 'fade-right' : 'fade-left'}`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {/* Content */}
                <div className="timeline-content">
                  <div style={{
                    display: 'inline-block', background: `${item.color}20`,
                    color: item.color, padding: '0.35rem 1rem', borderRadius: '50px',
                    fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem',
                  }}>
                    {item.subtitle}
                  </div>
                  <div className="timeline-year" style={{ color: item.color }}>{item.year}</div>
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-desc">{item.desc}</div>
                  <div style={{
                    marginTop: '1.25rem', background: '#F8F9FA', borderRadius: '12px',
                    padding: '0.875rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center',
                    border: `1px solid ${item.color}20`,
                  }}>
                    <span style={{ fontSize: '1.5rem', color: item.color, fontWeight: 800 }}>{item.stat}</span>
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.statLabel}</span>
                  </div>
                </div>

                {/* Dot */}
                <div className="timeline-dot">
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                </div>

                {/* Spacer */}
                <div style={{ width: '45%' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section style={{ background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header fade-up">
            <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              <FaGlobe size={14} style={{ marginRight: '6px' }} /> Long-Term Vision
            </div>
            <h2 className="section-title" style={{ color: '#ffffff' }}>
              Future <span style={{ color: '#D4AF37' }}>Goals</span>
            </h2>
            <div className="section-divider">
              <div className="divider-line" />
              <div className="divider-dot" />
              <div className="divider-line right" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <FaIndustry size={32} />, title: 'Expand Facilities', desc: 'Build state-of-the-art production facilities to support 1,000+ liters daily production capacity.' },
              { icon: <FaGlobe size={32} />, title: 'International Export', desc: 'Establish export channels to Middle Eastern, Southeast Asian, and European markets.' },
              { icon: <FaDna size={32} />, title: 'Breed Improvement', desc: 'Import high-yield dairy cattle breeds to maximize per-cow milk production efficiency.' },
              { icon: <FaLaptop size={32} />, title: 'Smart Farming', desc: 'Implement IoT sensors, AI-driven feed management, and automated milking systems.' },
              { icon: <FaGraduationCap size={32} />, title: 'Training Center', desc: 'Establish a dairy farming training and research center benefiting local farmers.' },
              { icon: <FaLeaf size={32} />, title: 'Zero Waste', desc: 'Achieve complete waste-to-energy conversion with biogas plants and organic fertilizer production.' },
            ].map((goal, i) => (
              <div key={i} className="scale-in" style={{
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,175,55,0.2)', borderRadius: '20px',
                padding: '2rem', transitionDelay: `${i * 0.1}s`,
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{goal.icon}</div>
                <h3 style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>{goal.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: '1.7' }}>{goal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrowthPage;
