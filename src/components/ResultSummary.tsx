import React from 'react';
import { Info } from 'lucide-react';

interface ResultSummaryProps {
  prediction: 'AI Generated' | 'Real';
  confidence: number;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ prediction, confidence }) => {
  const isReal = prediction === 'Real';
  const percent = Math.round(confidence * 100);

  return (
    <>
      
      {/* Box 1: Analysis Summary */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'rgba(13, 16, 26, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} style={{ color: 'var(--accent-cyan)' }} />
          Forensic Analysis Summary
        </h3>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
          {isReal ? (
            <span>
              The forensic engine analyzed the image matrix and classified it as <strong>Authentic (Real)</strong> with a confidence level of <strong>{percent}%</strong>. No indicators of generative artificial intelligence (such as GAN blending boundaries, localized blurring, or diffusion-based structural anomalies) were detected.
            </span>
          ) : (
            <span>
              The forensic engine identified signs of synthetic generation, classifying the image as <strong>AI Generated (DeepFake)</strong> with a confidence of <strong>{percent}%</strong>. Visual patterns in the image match signatures commonly left behind by diffusion models and generative adversarial network (GAN) architectures.
            </span>
          )}
        </p>
      </div>

      {/* Box 2: Warm / Red Zones Tamper zones */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'rgba(13, 16, 26, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderLeft: '3px solid var(--accent-red)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ff8a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', boxShadow: '0 0 8px var(--accent-red)' }} />
          Warm / Red Zones (Tamper Focus)
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '12px', lineHeight: '1.5' }}>
          <strong>Areas of maximum neural activation.</strong> These are the focal points of manipulation or high variance where structural pixel anomalies, boundary blurs, or synthetic textures were flagged by the model.
        </p>
      </div>

      {/* Box 3: Cool / Blue Zones background info */}
      <div className="glass-panel" style={{
        padding: '20px',
        background: 'rgba(13, 16, 26, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderLeft: '3px solid var(--accent-blue)'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#8ec5fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', boxShadow: '0 0 8px var(--accent-blue)' }} />
          Cool / Blue Zones (Discarded Features)
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '12px', lineHeight: '1.5' }}>
          <strong>Areas of low neural activation.</strong> The network determined these regions contain consistent natural details (such as organic lighting gradients or expected skin pores) and discarded them from the tamper scan.
        </p>
      </div>

    </>
  );
};
