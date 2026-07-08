import React from 'react';
import { Calendar, Cpu, Clock, Minimize, FileText } from 'lucide-react';

interface MetadataPanelProps {
  mode: 'normal' | 'premium';
  resolution: string;
  durationMs: number;
  timestamp: number;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ 
  mode, 
  resolution, 
  durationMs, 
  timestamp 
}) => {
  const isPremium = mode === 'premium';
  const modelName = isPremium ? 'EfficientNet-B0 (Transfer Learning)' : 'Custom Sequential CNN';
  const inputSize = isPremium ? '224 × 224 px' : '32 × 32 px';
  
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  };

  const rows = [
    { label: 'Classification Model', value: modelName, icon: <Cpu size={16} /> },
    { label: 'Selected Engine Mode', value: isPremium ? 'Premium Mode' : 'Normal Mode', icon: <FileText size={16} /> },
    { label: 'API Tensor Resolution', value: inputSize, icon: <Minimize size={16} /> },
    { label: 'Original Resolution', value: resolution, icon: <Minimize size={16} /> },
    { label: 'Processing Duration', value: `${(durationMs / 1000).toFixed(3)} seconds`, icon: <Clock size={16} /> },
    { label: 'Analysis Completed At', value: formatDate(timestamp), icon: <Calendar size={16} /> },
  ];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      background: 'rgba(13, 16, 26, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
        Forensic Audit Logs
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.map((row, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: idx !== rows.length - 1 ? '10px' : '0',
              borderBottom: idx !== rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontSize: '13px',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.icon}</span>
              <span>{row.label}</span>
            </div>
            <span style={{ fontWeight: 500, color: '#fff', textAlign: 'right' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
