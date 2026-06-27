import React from 'react';
import './CowAvatar.css';

interface CowAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showOnlineIndicator?: boolean;
  animate?: boolean;
}

/**
 * Premium Cow Mascot Avatar
 * - Cute, premium, friendly design
 * - Green recolored patches (dark areas)
 * - Minimal, modern styling
 * - Glassmorphic button with glow effect
 */
const CowAvatar: React.FC<CowAvatarProps> = ({ 
  size = 'md', 
  showOnlineIndicator = false,
  animate = true 
}) => {
  const sizeMap = {
    sm: 56,
    md: 64,
    lg: 80,
  };

  const dimension = sizeMap[size];

  return (
    <div className={`cow-avatar-container cow-size-${size} ${animate ? 'animate-pulse' : ''}`}>
      <div className="cow-avatar-button">
        {/* Cow SVG */}
        <svg
          width={dimension}
          height={dimension}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="cow-svg"
        >
          {/* Head */}
          <circle cx="100" cy="85" r="55" fill="#F5DEB3" />

          {/* Left Ear */}
          <ellipse cx="65" cy="35" rx="20" ry="28" fill="#F5DEB3" />
          <ellipse cx="65" cy="40" rx="12" ry="18" fill="#FFF8DC" />

          {/* Right Ear */}
          <ellipse cx="135" cy="35" rx="20" ry="28" fill="#F5DEB3" />
          <ellipse cx="135" cy="40" rx="12" ry="18" fill="#FFF8DC" />

          {/* Left Eye White */}
          <circle cx="75" cy="75" r="12" fill="#FFFFFF" />
          <circle cx="75" cy="75" r="8" fill="#000000" />
          <circle cx="77" cy="72" r="3" fill="#FFFFFF" />

          {/* Right Eye White */}
          <circle cx="125" cy="75" r="12" fill="#FFFFFF" />
          <circle cx="125" cy="75" r="8" fill="#000000" />
          <circle cx="127" cy="72" r="3" fill="#FFFFFF" />

          {/* Snout */}
          <ellipse cx="100" cy="110" rx="25" ry="20" fill="#FFF8DC" />

          {/* Nose */}
          <ellipse cx="100" cy="105" rx="10" ry="8" fill="#000000" />

          {/* Mouth */}
          <path d="M 100 105 Q 95 115 85 112" stroke="#000000" strokeWidth="1.5" fill="none" />
          <path d="M 100 105 Q 105 115 115 112" stroke="#000000" strokeWidth="1.5" fill="none" />

          {/* LEFT PATCH - Premium Green Recolor */}
          <ellipse cx="60" cy="55" rx="22" ry="28" fill="#4CAF50" opacity="0.85" />

          {/* RIGHT PATCH - Premium Green Recolor */}
          <ellipse cx="140" cy="55" rx="22" ry="28" fill="#2E7D32" opacity="0.85" />

          {/* Mouth Smile */}
          <path d="M 85 120 Q 100 128 115 120" stroke="#000000" strokeWidth="2" fill="none" />
        </svg>

        {/* Soft Glow Effect */}
        <div className="cow-glow"></div>

        {/* Sparkle Effects */}
        <div className="sparkle sparkle-1"></div>
        <div className="sparkle sparkle-2"></div>
        <div className="sparkle sparkle-3"></div>
      </div>

      {/* Online Indicator */}
      {showOnlineIndicator && (
        <div className="online-indicator">
          <span className="online-dot"></span>
        </div>
      )}
    </div>
  );
};

export default CowAvatar;
