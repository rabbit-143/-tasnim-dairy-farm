import React, { useEffect, useRef } from 'react';
import { FaHome, FaWarehouse, FaLeaf, FaFlask, FaBroom, FaTrophy, FaGlobe, FaHeart } from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';

const FarmPage: React.FC = () => {
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

  const farmSections = [
    {
      icon: <FaWarehouse size={24} />,
      title: 'Farm Overview',
      image: '/images/farm-overview.jpg',
      content: 'Tasnim Dairy Farm spans a carefully planned agricultural complex designed for maximum efficiency and animal comfort. Our modern facility features designated areas for cattle housing, feed storage, milking parlors, and quality control laboratories. The farm layout ensures smooth workflow from animal care to milk packaging, adhering to international dairy farm standards.',
      highlights: ['Modern facility design', 'Optimal space utilization', 'International standards', 'Strategic zone planning'],
    },
    {
      icon: <GiCow size={24} />,
      title: 'Cattle Management',
      image: '/images/gallery-cattle.jpg',
      content: 'Our cattle management program is built on the foundation of animal welfare and scientific nutrition. Each cow in our herd receives personalized care from our veterinary team. We maintain detailed health records for every animal, conduct regular health screenings, and ensure optimal vaccination schedules. Happy, healthy cows produce the best quality milk.',
      highlights: ['Veterinary oversight', 'Individual health records', 'Regular vaccinations', 'Stress-free environment'],
    },
    {
      icon: <FaLeaf size={24} />,
      title: 'Feeding Process',
      image: '/images/farm-landscape.jpg',
      content: 'Our scientifically formulated feeding program combines fresh green fodder, quality hay, silage, and balanced nutritional supplements. We source feed from trusted local farmers and maintain strict quality checks on all feed materials. Seasonal variations in nutrition are carefully managed to maintain consistent milk quality and cow health throughout the year.',
      highlights: ['Scientific nutrition plans', 'Fresh local fodder', 'Quality supplements', 'Seasonal adjustments'],
    },
    {
      icon: <GiMilkCarton size={24} />,
      title: 'Milk Collection',
      image: '/images/milk-production.jpg',
      content: 'Our milk collection process follows strict hygienic protocols to ensure zero contamination from cow to storage. We conduct two milking sessions daily using modern milking equipment. All collection vessels are sterilized before each use. Milk is immediately cooled to preserve freshness and nutritional integrity.',
      highlights: ['Twice daily milking', 'Sterile equipment', 'Immediate cooling', 'Hygienic handling'],
    },
    {
      icon: <FaFlask size={24} />,
      title: 'Quality Control',
      image: '/images/farm-overview.jpg',
      content: 'Quality is not negotiable at Tasnim Dairy Farm. Every batch of milk undergoes rigorous testing for fat content, protein levels, bacterial count, and absence of antibiotics. Our quality control laboratory is equipped with modern testing instruments. Only milk that passes all quality parameters proceeds to storage and dispatch.',
      highlights: ['Laboratory testing', 'Fat & protein analysis', 'Bacterial count checks', 'Antibiotic screening'],
    },
    {
      icon: <FaBroom size={24} />,
      title: 'Hygiene Standards',
      image: '/images/milk-production.jpg',
      content: 'Maintaining exceptional hygiene is a non-negotiable commitment at our farm. Daily cleaning protocols cover all animal housing areas, milking parlors, equipment, and common areas. Our farm staff adheres to strict personal hygiene standards including hand washing, protective clothing, and health screenings. Regular deep cleaning is scheduled weekly.',
      highlights: ['Daily sanitation', 'Equipment sterilization', 'Staff hygiene training', 'Weekly deep cleaning'],
    },
  ];

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div className="particle" style={{ width: 200, height: 200, background: '#D4AF37', top: '-5%', right: '5%', opacity: 0.08, animationDuration: '8s' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaHome size={14} style={{ marginRight: '6px' }} /> Farm Operations
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Our <span style={{ color: '#D4AF37' }}>Farm</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            Behind every drop of pure milk is a world-class system of care, quality, and dedication.
          </p>
        </div>
      </section>

      {/* Farm Sections */}
      {farmSections.map((section, i) => (
        <section
          key={i}
          style={{
            background: i % 2 === 0 ? '#ffffff' : '#F8F9FA',
            padding: '5rem 1.5rem',
          }}
        >
          <div style={{
            maxWidth: '1400px', margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}>
            <div className={i % 2 === 0 ? 'fade-left' : 'fade-right'} style={{ order: i % 2 === 0 ? 1 : 2 }}>
              <div style={{
                display: 'inline-flex', gap: '0.75rem', alignItems: 'center',
                background: '#0F5D2F12', padding: '0.5rem 1rem', borderRadius: '50px',
                marginBottom: '1.25rem',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{section.icon}</span>
                <span style={{ color: '#0F5D2F', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {section.title}
                </span>
              </div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <span className="section-title-accent">{section.title}</span>
              </h2>
              <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #0F5D2F, #D4AF37)', borderRadius: '2px', marginBottom: '1.25rem' }} />
              <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: '1.9', marginBottom: '1.5rem' }}>
                {section.content}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {section.highlights.map((h, hi) => (
                  <span key={hi} style={{
                    background: '#0F5D2F12', color: '#0F5D2F', padding: '0.4rem 0.9rem',
                    borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600,
                    border: '1px solid #0F5D2F20',
                  }}>
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
            <div className={i % 2 === 0 ? 'fade-right' : 'fade-left'} style={{ order: i % 2 === 0 ? 2 : 1 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={section.image}
                  alt={section.title}
                  style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}
                />
                <div style={{
                  position: 'absolute', top: '1.5rem', left: '1.5rem',
                  background: 'rgba(15, 93, 47, 0.93)', backdropFilter: 'blur(10px)',
                  borderRadius: '12px', padding: '0.75rem 1.25rem', color: 'white',
                  fontSize: '1.8rem',
                }}>
                  {section.icon}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Certifications */}
      <section style={{ background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="fade-up">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Our Commitment to <span style={{ color: '#D4AF37' }}>Excellence</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem' }}>
              Every operation follows international best practices
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: <FaLeaf size={24} />, label: 'Organic Practices' },
              { icon: <FaHeart size={24} />, label: 'Animal Welfare' },
              { icon: <FaFlask size={24} />, label: 'Quality Tested' },
              { icon: <FaTrophy size={24} />, label: 'Premium Grade' },
              { icon: <FaGlobe size={24} />, label: 'Eco-Friendly' },
            ].map((item, i) => (
              <div key={i} className="scale-in" style={{
                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px',
                padding: '1.5rem 2rem', color: 'white', textAlign: 'center',
                transitionDelay: `${i * 0.1}s`,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D4AF37' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmPage;
