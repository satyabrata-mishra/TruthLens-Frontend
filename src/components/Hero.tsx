import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartClick }) => {
  return (
    <section style={{
      padding: '80px 24px 60px 24px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {/* Decorative top pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '100px',
        marginBottom: '24px',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
      }}>
        <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          State-of-the-Art DeepFake Forensic Detection
        </span>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        margin: '0 0 20px 0',
        background: 'linear-gradient(to right, #ffffff 30%, #a5b4fc 70%, #818cf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Verify Image Authenticity <br />
        With Explainable AI.
      </h1>

      <p style={{
        fontSize: 'clamp(15px, 2.5vw, 18px)',
        lineHeight: '1.6',
        color: 'var(--text-secondary)',
        maxWidth: '650px',
        margin: '0 auto 32px auto',
      }}>
        TruthLens runs advanced convolutional neural scans to tell you whether an image is 100% authentic or AI-generated. Examine visual tamper zones with Grad-CAM heatmaps.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <button 
          onClick={onStartClick} 
          className="btn btn-primary"
          style={{
            fontSize: '16px',
            padding: '14px 32px',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)',
          }}
        >
          <span>Verify Image Now</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Hero preview frames simulation */}
      <div style={{
        marginTop: '60px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(30px)',
          zIndex: -1,
        }} />
      </div>
    </section>
  );
};
