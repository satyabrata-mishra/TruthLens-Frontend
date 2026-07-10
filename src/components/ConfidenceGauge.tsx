import React, { useEffect, useState } from 'react';

interface ConfidenceGaugeProps {
  confidence: number; // Float between 0.5 and 1.0 (or 0 and 1)
  prediction: 'AI Generated' | 'Real';
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ confidence, prediction }) => {
  const isReal = prediction === 'Real';
  const percentage = Math.round(confidence * 100);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Animate the percentage count on mount/update
  useEffect(() => {
    let start = 0;
    const end = percentage;
    if (start === end) return;

    const totalDuration = 1000; // 1s animation
    const incrementTime = Math.max(Math.floor(totalDuration / end), 10);
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedPercent(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [percentage]);

  // Circle path parameters
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  // Determine description rating
  let rating = 'Low Confidence';
  let ratingColor = 'var(--accent-red)';
  if (percentage >= 85) {
    rating = 'High Confidence';
    ratingColor = isReal ? 'var(--accent-green)' : 'var(--accent-red)';
  } else if (percentage >= 70) {
    rating = 'Moderate Confidence';
    ratingColor = 'var(--accent-amber)';
  }

  const baseColor = isReal ? 'var(--accent-green)' : 'var(--accent-red)';

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      background: 'rgba(13, 16, 26, 0.4)',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'flex-start' }}>
        Prediction Confidence
      </h3>

      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
        <div style={{ position: 'relative', width: '170px', height: '170px' }}>
        <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          {/* Animated active progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={baseColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out',
              filter: `drop-shadow(0 0 4px ${baseColor})`
            }}
          />
        </svg>

        {/* Floating text inside the circle */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            lineHeight: '1',
          }}>
            {animatedPercent}%
          </span>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            marginTop: '2px',
            textTransform: 'uppercase',
          }}>
            Confidence
          </span>
        </div>
      </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: ratingColor,
          background: 'rgba(255,255,255,0.02)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {rating}
        </span>
      </div>
    </div>
  );
};
