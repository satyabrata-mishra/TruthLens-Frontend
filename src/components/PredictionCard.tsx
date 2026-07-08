import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface PredictionCardProps {
  prediction: 'AI Generated' | 'Real';
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const isReal = prediction === 'Real';

  return (
    <div className="glass-panel" style={{
      padding: '30px 24px',
      background: isReal 
        ? 'rgba(16, 185, 129, 0.04)' 
        : 'rgba(239, 68, 68, 0.04)',
      borderColor: isReal 
        ? 'rgba(16, 185, 129, 0.3)' 
        : 'rgba(239, 68, 68, 0.3)',
      boxShadow: isReal 
        ? '0 0 30px rgba(16, 185, 129, 0.08)' 
        : '0 0 30px rgba(239, 68, 68, 0.08)',
      borderRadius: '20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative vertical light bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '4px',
        background: isReal ? 'var(--accent-green)' : 'var(--accent-red)',
      }} />

      {/* Pulsing alert icon wrapper */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: isReal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isReal ? 'var(--accent-green)' : 'var(--accent-red)',
        boxShadow: `0 0 20px ${isReal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
        animation: 'iconPulse 2s infinite ease-in-out',
      }}>
        {isReal ? <ShieldCheck size={36} /> : <ShieldAlert size={36} />}
      </div>

      <div>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: isReal ? 'var(--accent-green)' : 'var(--accent-red)',
        }}>
          Verdict Analysis
        </span>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#fff',
          marginTop: '6px',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
        }}>
          {isReal ? 'Authentic Image' : 'DeepFake Detected'}
        </h2>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginTop: '8px',
          maxWidth: '300px',
          lineHeight: '1.5',
        }}>
          {isReal 
            ? 'The neural network found no signature visual manipulation artifacts. The image appears authentic.' 
            : 'Forensic scan detected traces of generative AI modeling or GAN boundaries within the image matrix.'}
        </p>
      </div>

      {/* Styled animation inside prediction card */}
      <style>{`
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px ${isReal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; }
          50% { transform: scale(1.06); box-shadow: 0 0 30px ${isReal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; }
        }
      `}</style>
    </div>
  );
};
