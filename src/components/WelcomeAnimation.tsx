import React, { useState, useEffect } from 'react';

const WelcomeAnimation: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3900);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="welcome-overlay">
      {/* Decorative particles */}
      <div className="particle" style={{ width: 80, height: 80, background: '#D4AF37', top: '10%', left: '10%', animationDelay: '0s' }} />
      <div className="particle" style={{ width: 50, height: 50, background: '#ffffff', top: '20%', right: '15%', animationDelay: '1s' }} />
      <div className="particle" style={{ width: 60, height: 60, background: '#D4AF37', bottom: '20%', left: '20%', animationDelay: '2s' }} />
      <div className="particle" style={{ width: 40, height: 40, background: '#ffffff', bottom: '15%', right: '10%', animationDelay: '0.5s' }} />

      {/* Outer ring */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        border: '2px solid rgba(212,175,55,0.2)',
        borderRadius: '50%',
        animation: 'float 3s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '240px',
        height: '240px',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '50%',
        animation: 'float 3s ease-in-out infinite reverse',
      }} />

      <div className="welcome-arabic">
        السلام عليكم
      </div>

      <div className="welcome-divider" />

      <div className="welcome-english">
        Peace Be Upon You
      </div>

      <div className="welcome-logo-text">
        Tasnim Dairy Farm
      </div>
    </div>
  );
};

export default WelcomeAnimation;
