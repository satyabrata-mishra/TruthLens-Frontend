import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface PremiumTransitionProps {
  mode: 'normal' | 'premium';
}

export const PremiumTransition: React.FC<PremiumTransitionProps> = ({ mode }) => {
  const [active, setActive] = useState(false);
  const prevMode = useRef(mode);

  useEffect(() => {
    if (prevMode.current === 'normal' && mode === 'premium') {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
      }, 1400); // Animation duration
      return () => clearTimeout(timer);
    }
    prevMode.current = mode;
  }, [mode]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(6, 7, 10, 0.4)',
      backdropFilter: 'blur(4px)',
      animation: 'fadeOut 0.3s ease-in 1.1s forwards',
    }}>
      {/* Glow aura */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(30px)',
        animation: 'pulseGlow 1.2s ease-out infinite',
      }} />

      {/* Grid lines warp effect */}
      <div className="neural-grid neural-grid-premium" style={{
        position: 'absolute',
        opacity: 0.7,
        animation: 'warpGrid 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
      }} />

      {/* Centered upgrade banner */}
      <div className="glass-panel" style={{
        padding: '24px 40px',
        borderRadius: '20px',
        background: 'rgba(15, 10, 30, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        transform: 'scale(0.9)',
        animation: 'popIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'var(--gradient-premium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
        }}>
          <Sparkles size={24} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--accent-purple)',
            fontWeight: 700,
          }}>
            AI Engine Upgraded
          </span>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginTop: '4px',
            fontFamily: 'var(--font-heading)'
          }}>
            Premium Mode Activated
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '6px'
          }}>
            EfficientNet-B0 (224 × 224 Resolution)
          </p>
        </div>
      </div>

      {/* Styled animation keyframes inside component */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          15% { transform: scale(1.05); opacity: 1; }
          30% { transform: scale(1); opacity: 1; }
          85% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        @keyframes warpGrid {
          0% { transform: perspective(500px) translateZ(-100px) rotate(0deg); opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { transform: perspective(500px) translateZ(100px) rotate(2deg); opacity: 0; }
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.9; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
