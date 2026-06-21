import React, { useState, useEffect, useRef } from 'react';
import { useAdmin, API_BASE_URL } from '../context/AdminContext';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaComment, FaCheckCircle, FaPaperPlane, FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  const { settings } = useAdmin();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      alert('Failed to connect to server. Make sure the backend is running.');
    }
  };

  return (
    <div ref={pageRef}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0a3d1f, #0F5D2F)',
        padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-badge" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            <FaPhone size={14} style={{ marginRight: '6px' }} /> Get in Touch
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', marginTop: '1rem' }}>
            Contact <span style={{ color: '#D4AF37' }}>Us</span>
          </h1>
          <div className="section-divider" style={{ justifyContent: 'center' }}>
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line right" />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            We'd love to hear from you. Reach out to us through any channel below.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section style={{ background: '#F8F9FA', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              { icon: <FaMapMarkerAlt size={18} />, title: 'Our Address', value: settings.address, href: null },
              { icon: <FaPhone size={18} />, title: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
              { icon: <FaEnvelope size={18} />, title: 'Email', value: settings.email, href: `mailto:${settings.email}` },
              { icon: <FaComment size={18} />, title: 'WhatsApp', value: 'Chat with us on WhatsApp', href: settings.whatsapp },
            ].map((info, i) => (
              <div key={i} className="contact-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="contact-icon">
                  <span style={{ fontSize: '1.25rem' }}>{info.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    {info.title}
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.9rem', color: '#0F5D2F', fontWeight: 600, textDecoration: 'none', lineHeight: '1.5' }}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 500, lineHeight: '1.5' }}>{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form + Map */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Form */}
            <div className="fade-left">
              <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.5rem' }}>Send a Message</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
                  Fill out the form and we'll get back to you within 24 hours.
                </p>

                {submitted && (
                  <div style={{
                    background: '#0F5D2F15', border: '1px solid #0F5D2F40',
                    borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
                    display: 'flex', gap: '0.75rem', alignItems: 'center',
                  }}>
                    <FaCheckCircle size={16} />
                    <span style={{ fontSize: '0.875rem', color: '#0F5D2F', fontWeight: 600 }}>
                      Message sent successfully! We'll be in touch soon.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label className="admin-label">Full Name *</label>
                      <input
                        className="admin-input"
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="admin-label">Phone</label>
                      <input
                        className="admin-input"
                        type="tel"
                        placeholder="Your phone"
                        value={form.phone}
                        onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Email Address *</label>
                    <input
                      className="admin-input"
                      type="email"
                      placeholder="Your email"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-label">Subject</label>
                    <input
                      className="admin-input"
                      type="text"
                      placeholder="Message subject"
                      value={form.subject}
                      onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Message *</label>
                    <textarea
                      className="admin-input"
                      placeholder="Write your message here..."
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                    <FaPaperPlane size={14} style={{ marginRight: '6px' }} /> Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Map + Social */}
            <div className="fade-right">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                <iframe
                  src={settings.mapEmbed}
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tasnim Dairy Farm Location"
                />
              </div>

              {/* Social Media */}
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem' }}>Follow Us</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { href: settings.facebook, icon: <FaFacebookF size={14} />, label: 'Facebook', color: '#1877F2' },
                    { href: settings.instagram, icon: <FaInstagram size={14} />, label: 'Instagram', color: '#E1306C' },
                    { href: settings.whatsapp, icon: <FaWhatsapp size={14} />, label: 'WhatsApp', color: '#25D366' },
                    { href: settings.youtube, icon: <FaYoutube size={14} />, label: 'YouTube', color: '#FF0000' },
                    { href: settings.linkedin, icon: <FaLinkedinIn size={14} />, label: 'LinkedIn', color: '#0A66C2' },
                  ].map(social => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.75rem 1rem', borderRadius: '12px',
                        background: '#F8F9FA', textDecoration: 'none',
                        fontSize: '0.875rem', fontWeight: 600, color: '#374151',
                        transition: 'all 0.2s ease', border: '1px solid #e5e7eb',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = social.color; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F8F9FA'; (e.currentTarget as HTMLElement).style.color = '#374151'; }}
                    >
                      <span>{social.icon}</span>
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
