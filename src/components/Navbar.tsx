import React from 'react';
import { ShieldCheck, History } from 'lucide-react';

interface NavbarProps {
  onHistoryClick: () => void;
  historyCount: number;
  onReset: () => void;
  onVerifyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHistoryClick, historyCount, onReset, onVerifyClick }) => {
  return (
    <nav className="glass-panel app-navbar">
      <div 
        onClick={onReset} 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: '10px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ShieldCheck size={24} color="#06070a" />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            TruthLens
            <span style={{
              fontSize: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              padding: '2px 8px',
              borderRadius: '20px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>BETA</span>
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Verify Every Image</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={onVerifyClick}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '10px' }}
        >
          <span className="hide-mobile">Verify Image</span>
          <span className="show-mobile-only">+ Verify</span>
        </button>

        <button
          onClick={onHistoryClick}
          className="btn btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '10px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: historyCount > 0 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <History size={16} />
          <span className="hide-mobile">History</span>
          {historyCount > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-blue)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              minWidth: '18px',
              height: '18px',
              borderRadius: '50%',
              padding: '0 4px',
            }}>
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
