import React, { useState, useEffect } from 'react';
import { Loader2, Check, RefreshCw, Cpu, Layers, Sparkles, Image, CheckCircle } from 'lucide-react';

interface LoadingOverlayProps {
  imagePreviewUrl: string | null;
  onFinished: () => void;
  isCompleted: boolean; // Tells us if the backend actually finished
}

const STAGES = [
  { label: 'Uploading Image...', icon: <Image size={16} /> },
  { label: 'Preparing Neural Network...', icon: <Cpu size={16} /> },
  { label: 'Scanning Image Matrix...', icon: <RefreshCw size={16} /> },
  { label: 'Detecting Artificial Manipulations...', icon: <Layers size={16} /> },
  { label: 'Generating Heatmap (Grad-CAM)...', icon: <Sparkles size={16} /> },
  { label: 'Preparing Verification Report...', icon: <CheckCircle size={16} /> },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  imagePreviewUrl, 
  onFinished, 
  isCompleted 
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment stages step-by-step to let the user see the forensic scan details
    const intervalTime = 600; // 600ms per stage, total 3.6s minimum duration
    const stageTimer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageTimer);
          return prev;
        }
      });
    }, intervalTime);

    // Increment progress bar smoothly
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const target = (currentStage + 1) * (100 / STAGES.length);
        if (prev < target) {
          return Math.min(prev + 2, 100);
        }
        return prev;
      });
    }, 40);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, [currentStage]);

  // If the backend has finished AND we reached the final stage, trigger onFinished
  useEffect(() => {
    if (isCompleted && currentStage === STAGES.length - 1 && progress >= 95) {
      const finishTimer = setTimeout(() => {
        onFinished();
      }, 300);
      return () => clearTimeout(finishTimer);
    }
  }, [isCompleted, currentStage, progress, onFinished]);

  return (
    <div className="glass-panel" style={{
      padding: '40px 24px',
      background: 'rgba(10, 11, 18, 0.9)',
      border: '1px solid rgba(6, 182, 212, 0.25)',
      boxShadow: '0 0 40px rgba(6, 182, 212, 0.15)',
      borderRadius: '20px',
      maxWidth: '600px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Laser Scan Animation Container */}
      <div style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid rgba(6, 182, 212, 0.3)',
        background: '#000',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
      }}>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Forensic scan thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.7,
            }}
          />
        )}
        
        {/* Animated Laser Line */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, transparent, var(--accent-cyan), #ffffff, var(--accent-cyan), transparent)',
          boxShadow: '0 0 15px var(--accent-cyan), 0 0 8px #ffffff',
          animation: 'scanning 2s ease-in-out infinite',
          zIndex: 5,
        }} />
      </div>

      {/* Forensic Stages list */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        textAlign: 'left',
      }}>
        {STAGES.map((stage, idx) => {
          const isDone = currentStage > idx;
          const isActive = currentStage === idx;
          return (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: isDone || isActive ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDone 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : isActive 
                    ? 'rgba(6, 182, 212, 0.15)' 
                    : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  isDone 
                    ? 'var(--accent-green)' 
                    : isActive 
                      ? 'var(--accent-cyan)' 
                      : 'rgba(255, 255, 255, 0.08)'
                }`,
                color: isDone 
                  ? 'var(--accent-green)' 
                  : isActive 
                    ? 'var(--accent-cyan)' 
                    : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                {isDone ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Loader2 size={14} className="spinning" style={{ animation: 'spin 1.5s linear infinite' }} />
                ) : (
                  stage.icon
                )}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Container */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '100px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--gradient-primary)',
            boxShadow: '0 0 10px var(--accent-cyan)',
            transition: 'width 0.4s ease-out',
            borderRadius: '100px',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          <span>PROCESSING METRICS</span>
          <span>{Math.round(progress)}% COMPLETE</span>
        </div>
      </div>

      {/* Embedded Spin Animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
