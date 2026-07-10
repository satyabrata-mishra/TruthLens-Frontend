import React from 'react';
import { Eye, ShieldAlert, Cpu, Zap, Lock, History } from 'lucide-react';

export const Features: React.FC = () => {
  const list = [
    {
      icon: <Cpu size={24} style={{ color: 'var(--accent-cyan)' }} />,
      title: 'AI DeepFake Detection',
      desc: 'Powered by advanced convolutional neural networks trained to detect synthetic facial and visual artifacts.',
    },
    {
      icon: <Eye size={24} style={{ color: 'var(--accent-blue)' }} />,
      title: 'Explainable AI Heatmaps',
      desc: 'Visualize manipulation zones. Grad-CAM neural weight overlays show exactly where the model spotted inconsistencies.',
    },
    {
      icon: <ShieldAlert size={24} style={{ color: 'var(--accent-purple)' }} />,
      title: 'Confidence Analysis',
      desc: 'No simple binary answers. Get precise probability statistics and confidence levels for deep analysis.',
    },
    {
      icon: <Zap size={24} style={{ color: 'var(--accent-amber)' }} />,
      title: 'Adaptive Modes',
      desc: 'Switch between speed-optimized Normal Mode (32x32 scan) and high-accuracy Premium Mode (224x224 deep scan).',
    },
    {
      icon: <Lock size={24} style={{ color: 'var(--accent-green)' }} />,
      title: 'Privacy First',
      desc: 'Your files are processed directly by the API. We do not store your images in any cloud databases.',
    },
    {
      icon: <History size={24} style={{ color: 'var(--accent-cyan)' }} />,
      title: 'Local History',
      desc: 'Access your previous analyses directly in your browser. All history runs locally using your browser storage.',
    },
  ];

  return (
    <section style={{
      padding: '40px 24px 80px 24px',
      maxWidth: '1100px',
      margin: '0 auto',
      zIndex: 10,
      position: 'relative',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>Engineered for Deep Forensic Integrity</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore the features that make TruthLens a powerful utility for journalists, developers, and users alike.
        </p>
      </div>

      <div className="features-grid">
        {list.map((f, i) => (
          <div 
            key={i} 
            className="glass-panel features-card"
          >
            <div className="features-card-icon-wrapper" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '12px',
              borderRadius: '12px',
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {f.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#fff' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
