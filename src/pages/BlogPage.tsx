import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import type { BlogPost } from '../data/store';
import { FaFileAlt, FaNewspaper, FaCalendarAlt, FaTimes, FaStar } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3001';
const getImageUrl = (path: string | null | undefined): string | undefined => path?.startsWith('/uploads/') ? `${API_BASE_URL}${path}` : (path || undefined);

const BlogPage: React.FC = () => {
  const { blogs } = useAdmin();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const pageRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];
  const filtered = activeCategory === 'All' ? blogs : blogs.filter(b => b.category === activeCategory);

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
            <FaFileAlt size={14} style={{ marginRight: '6px' }} /> Latest Insights
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Dairy <span style={{ color: '#D4AF37' }}>Blog</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            News, insights, and stories from our farm and the dairy industry.
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section style={{ background: '#F8F9FA', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }} className="fade-up">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.5rem', borderRadius: '50px',
                  border: activeCategory === cat ? 'none' : '2px solid #0F5D2F25',
                  background: activeCategory === cat ? 'linear-gradient(135deg, #0F5D2F, #1a7a3f)' : '#ffffff',
                  color: activeCategory === cat ? '#ffffff' : '#0F5D2F',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', transition: 'all 0.3s ease',
                  boxShadow: activeCategory === cat ? '0 4px 15px rgba(15,93,47,0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {filtered.map((post, i) => (
                <div
                  key={post.id}
                  className="blog-card fade-up"
                  style={{ transitionDelay: `${i * 0.12}s`, cursor: 'pointer' }}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="blog-img">
                    {post.image ? (
                      <img src={getImageUrl(post.image)} alt={post.title} onError={e => { (e.target as HTMLImageElement).src = '/images/farm-overview.jpg'; }} />
                    ) : (
                      <span style={{ fontSize: '3rem' }}><FaNewspaper size={48} /></span>
                    )}
                    <div className="blog-category">{post.category}</div>
                    {post.featured && (
                      <div style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: '#0F5D2F', color: 'white',
                        padding: '0.2rem 0.6rem', borderRadius: '50px',
                        fontSize: '0.7rem', fontWeight: 700,
                      }}><FaStar size={10} /> Featured</div>
                    )}
                  </div>
                  <div className="blog-body">
                    <div className="blog-date">
                      <FaCalendarAlt size={12} style={{ marginRight: '4px' }} />
                      {new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="blog-title">{post.title}</div>
                    <div className="blog-excerpt">{post.excerpt}</div>
                    <div className="blog-read-more">
                      Read Full Article →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FaFileAlt size={48} /></div>
              <p>No blog posts found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <span style={{
                background: '#0F5D2F15', color: '#0F5D2F', padding: '0.25rem 0.75rem',
                borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
              }}>
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}
              >
                <FaTimes size={18} />
              </button>
            </div>
            {selectedPost.image && (
              <img
                src={getImageUrl(selectedPost.image)}
                alt={selectedPost.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}
                onError={e => { (e.target as HTMLImageElement).src = '/images/farm-overview.jpg'; }}
              />
            )}
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.75rem', lineHeight: '1.4' }}>
              {selectedPost.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
              <FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> {new Date(selectedPost.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: '1.8', marginBottom: '1rem' }}>
              {selectedPost.excerpt}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.8' }}>
              {selectedPost.content === 'Full blog content here...'
                ? 'This article is managed from the admin panel. Full content will be available when published by the administrator.'
                : selectedPost.content
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
