import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaImages, FaTimes, FaSearch } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3001';
const getImageUrl = (path: string): string => path.startsWith('/uploads/') ? `${API_BASE_URL}${path}` : path;

const categories = ['All', 'Farm Images', 'Cattle Images', 'Production Images', 'Events'];

const GalleryPage: React.FC = () => {
  const { gallery } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    const els = pageRef.current?.querySelectorAll('.fade-up, .scale-in');
    els?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaImages size={14} style={{ marginRight: '6px' }} /> Visual Gallery
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Farm <span style={{ color: '#D4AF37' }}>Gallery</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            A visual journey through life at Tasnim Dairy Farm.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ background: '#F8F9FA', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }} className="fade-up">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  border: activeCategory === cat ? 'none' : '2px solid #0F5D2F25',
                  background: activeCategory === cat ? 'linear-gradient(135deg, #0F5D2F, #1a7a3f)' : '#ffffff',
                  color: activeCategory === cat ? '#ffffff' : '#0F5D2F',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === cat ? '0 4px 15px rgba(15,93,47,0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className="gallery-item scale-in"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                  onClick={() => setLightboxImg(getImageUrl(item.image))}
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/images/farm-overview.jpg';
                    }}
                  />
                  <div className="gallery-overlay">
                    <span><FaSearch size={20} /></span>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '2rem 1rem 1rem',
                    transform: 'translateY(100%)',
                    transition: 'transform 0.3s ease',
                  }} className="gallery-info">
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{item.category}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FaImages size={48} /></div>
              <p style={{ fontSize: '1rem' }}>No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="modal-overlay"
          onClick={() => setLightboxImg(null)}
          style={{ cursor: 'zoom-out' }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImg}
              alt="Gallery"
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            />
            <button
              onClick={() => setLightboxImg(null)}
              style={{
                position: 'absolute', top: '-1rem', right: '-1rem',
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#0F5D2F', color: 'white', border: 'none',
                fontSize: '1rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gallery-item:hover .gallery-info { transform: translateY(0) !important; }
      `}</style>
    </div>
  );
};

export default GalleryPage;
