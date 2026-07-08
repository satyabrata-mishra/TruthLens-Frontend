import React from 'react';
import { RefreshCw, Sparkles, ServerCrash } from 'lucide-react';

interface ErrorCardProps {
  error: string;
  onRetry: () => void;
  onActivateDemoMode?: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ 
  error, 
  onRetry,
  onActivateDemoMode 
}) => {
  const isNetworkDisconnected = error === 'NETWORK_DISCONNECTED';

  return (
    <div className="glass-panel" style={{
      padding: '40px 24px',
      background: 'rgba(239, 68, 68, 0.04)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
      boxShadow: '0 0 30px rgba(239, 68, 68, 0.1)',
      borderRadius: '20px',
      maxWidth: '560px',
      width: '100%',
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.12)',
        color: 'var(--accent-red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}>
        <ServerCrash size={28} />
      </div>

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Forensic Scanner Interrupted
        </h3>
        
        {isNetworkDisconnected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              TruthLens was unable to connect to the backend server at <strong>http://localhost:8000</strong>.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Please verify that your Python backend FastAPI service is running (e.g. <code>uvicorn main:app --reload</code>).
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            {error || 'An unexpected server error occurred during image inference.'}
          </p>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
        marginTop: '8px',
      }}>
        <button 
          onClick={onRetry}
          className="btn btn-primary"
          style={{
            background: 'var(--accent-red)',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            padding: '10px 24px',
            fontSize: '14px',
          }}
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>

        {onActivateDemoMode && (
          <button 
            onClick={onActivateDemoMode}
            className="btn btn-secondary"
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              background: 'rgba(6, 182, 212, 0.05)',
              color: 'var(--accent-cyan)',
            }}
          >
            <Sparkles size={16} />
            <span>Use Demo Mode</span>
          </button>
        )}
      </div>
    </div>
  );
};
