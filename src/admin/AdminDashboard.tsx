import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaFileAlt, FaCamera, FaBriefcase, FaStar, FaUserFriends, FaCalendarAlt, FaChartLine, FaUsers } from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';

type AdminPage = 'dashboard' | 'founders' | 'blogs' | 'gallery' | 'careers' | 'settings' | 'about';

interface Props {
  setAdminPage: (page: AdminPage) => void;
}

const AdminDashboard: React.FC<Props> = ({ setAdminPage }) => {
  const { blogs, gallery, careers, founders, settings } = useAdmin();

  const stats = [
    { icon: <FaFileAlt size={36} />, label: 'Blog Posts', value: blogs.length, page: 'blogs', color: '#0F5D2F' },
    { icon: <FaCamera size={36} />, label: 'Gallery Images', value: gallery.length, page: 'gallery', color: '#D4AF37' },
    { icon: <FaBriefcase size={36} />, label: 'Job Postings', value: careers.filter(c => c.active).length, page: 'careers', color: '#0F5D2F' },
    { icon: <FaStar size={36} />, label: 'Founders', value: founders.length, page: 'founders', color: '#D4AF37' },
    { icon: <FaUserFriends size={36} />, label: 'Visitors', value: settings.visitors.toLocaleString(), page: 'settings', color: '#0F5D2F' },
    { icon: <GiMilkCarton size={36} />, label: 'Daily Production', value: '100 L', page: 'about', color: '#D4AF37' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F5D2F, #D4AF37)',
        borderRadius: '20px', padding: '2rem 2.5rem', marginBottom: '2rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-30px', top: '-30px',
          width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Welcome to Admin Dashboard <GiCow size={28} />
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
            Manage all content for Tasnim Dairy Farm from here.
          </p>
          <div style={{ marginTop: '1rem', fontFamily: 'Amiri, serif', color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
            بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <button
            key={i}
            onClick={() => setAdminPage(stat.page as AdminPage)}
            style={{
              background: '#ffffff', borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 2px 15px rgba(0,0,0,0.06)', cursor: 'pointer',
              border: `1px solid ${stat.color}15`, textAlign: 'center',
              transition: 'all 0.3s ease', fontFamily: 'Poppins, sans-serif',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 15px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ marginBottom: '0.75rem', color: stat.color }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Blogs */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaFileAlt size={20} /> Recent Blog Posts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blogs.slice(0, 3).map(blog => (
              <div key={blog.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', background: '#F8F9FA', borderRadius: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>{blog.title.substring(0, 35)}...</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{blog.category} · {new Date(blog.date).toLocaleDateString()}</div>
                </div>
                {blog.featured && <span style={{ background: '#D4AF3720', color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '50px' }}>Featured</span>}
              </div>
            ))}
            {blogs.length === 0 && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No blog posts yet.</p>}
          </div>
          <button onClick={() => setAdminPage('blogs')} className="admin-btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            Manage Blogs
          </button>
        </div>

        {/* Recent Jobs */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaBriefcase size={20} /> Active Job Postings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {careers.filter(c => c.active).slice(0, 3).map(job => (
              <div key={job.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', background: '#F8F9FA', borderRadius: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>{job.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{job.department} · {job.vacancy} vacant</div>
                </div>
                <span style={{ background: '#0F5D2F20', color: '#0F5D2F', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '50px' }}>Active</span>
              </div>
            ))}
            {careers.filter(c => c.active).length === 0 && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>No active job postings.</p>}
          </div>
          <button onClick={() => setAdminPage('careers')} className="admin-btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            Manage Careers
          </button>
        </div>
      </div>

      {/* Farm Info Banner */}
      <div style={{
        background: '#F8F9FA', borderRadius: '16px', padding: '1.5rem',
        marginTop: '1.5rem', border: '1px solid #0F5D2F15',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem',
      }}>
        {[
          { icon: <FaCalendarAlt size={24} />, label: 'Founded', value: '14 Feb 2026' },
          { icon: <GiMilkCarton size={24} />, label: 'Daily Output', value: '100 Liters' },
          { icon: <FaChartLine size={24} />, label: '2028 Target', value: '1,000 L/day' },
          { icon: <FaUsers size={24} />, label: 'Employees', value: '125' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ color: '#0F5D2F' }}>{item.icon}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{item.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F5D2F' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
