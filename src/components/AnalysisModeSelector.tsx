import React from 'react';
import { Zap, Sparkles, Flame } from 'lucide-react';

export type AnalysisMode = 'normal' | 'premium';

interface AnalysisModeSelectorProps {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '4px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Select AI Forensic Engine
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Choose the neural resolution setting that matches your verification criteria.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        position: 'relative',
      }}>
        {/* Normal Mode Selection Card */}
        <div 
          onClick={() => onChange('normal')}
          className={`glass-panel ${mode === 'normal' ? 'glass-panel-glow' : ''}`}
          style={{
            padding: '24px',
            borderRadius: '16px',
            cursor: 'pointer',
            background: mode === 'normal' ? 'rgba(6, 182, 212, 0.05)' : 'rgba(13, 16, 26, 0.2)',
            borderColor: mode === 'normal' ? 'var(--accent-cyan)' : 'var(--border-color)',
            transition: 'all var(--transition-normal)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle indicator light */}
          {mode === 'normal' && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)',
            }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: mode === 'normal' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Normal Mode</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Endpoint: /api/predict/normal</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>
            Optimized for speed. Resizes image to <strong style={{ color: 'var(--accent-cyan)' }}>32 × 32 pixels</strong> before CNN processing. Best suited for quick, bulk verifications. Accuracy is lower as finer details are reduced.
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '12px',
            marginTop: '4px',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Scan Speed:</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Super Fast (&lt; 0.2s)</span>
          </div>
        </div>

        {/* Premium Mode Selection Card */}
        <div 
          onClick={() => onChange('premium')}
          className={`glass-panel ${mode === 'premium' ? 'glass-panel-premium' : ''}`}
          style={{
            padding: '24px',
            borderRadius: '16px',
            cursor: 'pointer',
            background: mode === 'premium' ? 'rgba(139, 92, 246, 0.07)' : 'rgba(13, 16, 26, 0.2)',
            borderColor: mode === 'premium' ? 'rgba(139, 92, 246, 0.5)' : 'var(--border-color)',
            transition: 'all var(--transition-normal)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Animated Glow Border if premium is active */}
          {mode === 'premium' && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'var(--gradient-premium)',
            }} />
          )}

          {/* Premium badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            background: 'var(--gradient-premium)',
            borderRadius: '20px',
            fontSize: '9px',
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 10px rgba(139, 92, 246, 0.4)',
          }}>
            <Flame size={10} /> Pro
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: mode === 'premium' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>Premium Mode</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Endpoint: /api/predict/premium</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', flexGrow: 1 }}>
            Advanced verification. Preserves detailed resolution at <strong style={{ color: 'var(--accent-purple)' }}>224 × 224 pixels</strong>. Runs deeper scans for subtle AI artifacts and boundary blurs. Recommended for critical authenticity audits.
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '12px',
            marginTop: '4px',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Accuracy Rating:</span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>High Reliability</span>
          </div>
        </div>
      </div>
    </div>
  );
};
