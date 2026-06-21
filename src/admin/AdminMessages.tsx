import React, { useState, useEffect } from 'react';
import { FaTrash, FaEnvelope, FaPhone, FaClock, FaEye } from 'react-icons/fa';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Use correct backend URL (port 3000)
      const response = await fetch('http://localhost:3000/api/contact/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        console.log('Messages fetched:', data);
      } else {
        console.error('Failed to fetch messages:', response.status, response.statusText);
        alert('Failed to load messages. Make sure backend is running on port 3000.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Cannot connect to backend. Make sure the server is running:\ncd backend\nnpm start');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/contact/messages/${id}/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: true });
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/contact/messages/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Filter messages
  let filteredMessages = messages;
  
  if (filter === 'unread') {
    filteredMessages = filteredMessages.filter(m => !m.is_read);
  } else if (filter === 'read') {
    filteredMessages = filteredMessages.filter(m => m.is_read);
  }

  if (searchTerm) {
    filteredMessages = filteredMessages.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a2e', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaEnvelope size={28} style={{ color: '#0F5D2F' }} />
          Contact Messages
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Manage messages from your website visitors
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F5D2F' }}>{messages.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Total Messages</div>
        </div>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4AF37' }}>{unreadCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Unread</div>
        </div>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F5D2F' }}>{messages.length - unreadCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Read</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Messages List */}
        <div className="admin-card">
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '10px',
                  border: '1px solid #e5e7eb', fontSize: '0.9rem',
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem',
                  border: filter === 'all' ? '1px solid #0F5D2F' : '1px solid #e5e7eb',
                  background: filter === 'all' ? '#0F5D2F15' : '#ffffff',
                  color: filter === 'all' ? '#0F5D2F' : '#6b7280',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem',
                  border: filter === 'unread' ? '1px solid #D4AF37' : '1px solid #e5e7eb',
                  background: filter === 'unread' ? '#D4AF3720' : '#ffffff',
                  color: filter === 'unread' ? '#D4AF37' : '#6b7280',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem',
                  border: filter === 'read' ? '1px solid #10b981' : '1px solid #e5e7eb',
                  background: filter === 'read' ? '#10b98120' : '#ffffff',
                  color: filter === 'read' ? '#10b981' : '#6b7280',
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                Read
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>Loading messages...</p>
            ) : filteredMessages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No messages found</p>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) markAsRead(msg.id);
                  }}
                  style={{
                    textAlign: 'left', padding: '1rem', borderRadius: '10px',
                    border: selectedMessage?.id === msg.id ? '2px solid #0F5D2F' : '1px solid #e5e7eb',
                    background: selectedMessage?.id === msg.id ? '#0F5D2F08' : (msg.is_read ? '#ffffff' : '#fffbeb'),
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: !msg.is_read ? 700 : 600, color: '#1a1a2e', fontSize: '0.9rem' }}>
                      {msg.name}
                      {!msg.is_read && (
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', marginLeft: '0.5rem' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {msg.subject || '(No subject)'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {msg.message.substring(0, 60)}...
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        {selectedMessage ? (
          <div className="admin-card" style={{ position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e' }}>Message Details</h3>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                style={{
                  background: '#ef464620', border: 'none', color: '#ef4646',
                  padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600,
                }}
              >
                <FaTrash size={14} /> Delete
              </button>
            </div>

            {/* From */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>From</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a2e' }}>{selectedMessage.name}</div>
            </div>

            {/* Contact Info */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaEnvelope size={12} /> Email
                </div>
                <a href={`mailto:${selectedMessage.email}`} style={{ color: '#0F5D2F', textDecoration: 'none', wordBreak: 'break-all' }}>
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPhone size={12} /> Phone
                  </div>
                  <a href={`tel:${selectedMessage.phone}`} style={{ color: '#0F5D2F', textDecoration: 'none' }}>
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaClock size={12} /> Received
                </div>
                <div style={{ color: '#1a1a2e', fontSize: '0.9rem' }}>
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Subject */}
            {selectedMessage.subject && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Subject</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1a1a2e' }}>{selectedMessage.subject}</div>
              </div>
            )}

            {/* Message */}
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaEye size={12} /> Message
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {selectedMessage.message}
              </p>
            </div>

            {/* Status */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Status</div>
              <div style={{
                display: 'inline-block', padding: '0.4rem 0.75rem', borderRadius: '50px',
                background: selectedMessage.is_read ? '#10b98120' : '#D4AF3720',
                color: selectedMessage.is_read ? '#10b981' : '#D4AF37',
                fontSize: '0.8rem', fontWeight: 700,
              }}>
                {selectedMessage.is_read ? '✓ Read' : '◯ Unread'}
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: '#9ca3af' }}>
            <div style={{ textAlign: 'center' }}>
              <FaEnvelope size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Select a message to view details</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminMessages;
