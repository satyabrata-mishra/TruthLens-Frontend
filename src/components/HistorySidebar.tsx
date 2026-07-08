import React from 'react';
import { X, Trash2, Calendar, HardDrive } from 'lucide-react';
import type { HistoryItem } from '../hooks/useLocalStorage';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  items,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '420px',
      background: '#090a0f',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Local Analysis History</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            {items.length} saved {items.length === 1 ? 'record' : 'records'}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="btn btn-secondary"
          style={{ padding: '6px 10px', borderRadius: '8px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* History Items list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {items.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            gap: '16px',
            textAlign: 'center',
          }}>
            <HardDrive size={40} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>No previous scans found</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Verify an image to store records here.</p>
            </div>
          </div>
        ) : (
          items.map((item) => {
            const isReal = item.prediction === 'Real';
            const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
              dateStyle: 'short',
              timeStyle: 'short',
            });

            return (
              <div 
                key={item.id}
                onClick={() => { onSelect(item); onClose(); }}
                className="glass-panel"
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
              >
                {/* Thumbnail image */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#000',
                  flexShrink: 0,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  <img
                    src={item.originalImage}
                    alt={item.fileName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isReal ? 'var(--accent-green)' : 'var(--accent-red)',
                      textTransform: 'uppercase',
                    }}>
                      {isReal ? 'Authentic' : 'DeepFake'}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      background: item.mode === 'premium' ? 'var(--gradient-premium)' : 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                    }}>
                      {item.mode === 'premium' ? 'PREMIUM' : 'NORMAL'}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#fff',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }} title={item.fileName}>
                    {item.fileName}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}>
                    <span>Conf: {Math.round(item.confidence * 100)}%</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={10} /> {dateStr}
                    </span>
                  </div>
                </div>

                {/* Delete button wrapper */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer controls */}
      {items.length > 0 && (
        <div style={{
          padding: '20px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(255,255,255,0.01)',
        }}>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all history records?')) {
                onClearAll();
              }
            }}
            className="btn btn-secondary"
            style={{
              width: '100%',
              gap: '8px',
              color: '#ff8a8a',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.02)',
            }}
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
