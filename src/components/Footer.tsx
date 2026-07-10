import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '40px 24px',
      marginTop: 'auto',
      background: 'rgba(6, 7, 10, 0.4)',
      textAlign: 'center',
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', color: '#fff' }}>TruthLens</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.6' }}>
          An advanced AI-powered forensic examination platform for verifying image authenticity. 
          Detect deepfakes, inspect neural heatmaps, and secure visual trust instantly.
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          &copy; {new Date().getFullYear()} TruthLens AI. Created by Satyabrata Mishra. All rights reserved. Powered by Explainable Artificial Intelligence (XAI).
        </p>
      </div>
    </footer>
  );
};
