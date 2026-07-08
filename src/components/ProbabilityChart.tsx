import React, { useEffect, useState } from 'react';

interface ProbabilityChartProps {
  confidence: number;
  prediction: 'AI Generated' | 'Real';
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ confidence, prediction }) => {
  const isReal = prediction === 'Real';
  
  // Calculate distribution values
  const probReal = isReal ? confidence : 1.0 - confidence;
  const probFake = isReal ? 1.0 - confidence : confidence;
  
  const pctReal = Math.round(probReal * 100);
  const pctFake = Math.round(probFake * 100);

  const [realWidth, setRealWidth] = useState(0);
  const [fakeWidth, setFakeWidth] = useState(0);

  // Trigger growing animation on mount/update
  useEffect(() => {
    const timer = setTimeout(() => {
      setRealWidth(pctReal);
      setFakeWidth(pctFake);
    }, 150);
    return () => clearTimeout(timer);
  }, [pctReal, pctFake]);

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      background: 'rgba(13, 16, 26, 0.4)',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        Probability Distribution
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Real / Authentic Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Authentic Image</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{pctReal}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${realWidth}%`,
              height: '100%',
              background: 'linear-gradient(to right, #10b981, #059669)',
              borderRadius: '100px',
              transition: 'width 1s cubic-bezier(0.1, 0.8, 0.2, 1)',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
            }} />
          </div>
        </div>

        {/* Fake / Synthetic Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Synthetic / DeepFake</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-red)' }}>{pctFake}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${fakeWidth}%`,
              height: '100%',
              background: 'linear-gradient(to right, #ef4444, #dc2626)',
              borderRadius: '100px',
              transition: 'width 1s cubic-bezier(0.1, 0.8, 0.2, 1)',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
