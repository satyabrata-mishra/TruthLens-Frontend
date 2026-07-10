import React, { useState, useRef, useEffect } from 'react';
import { Columns, Split, Eye, ZoomIn, ZoomOut, Maximize2, Minimize2, Move } from 'lucide-react';

interface HeatmapViewerProps {
  originalUrl: string;
  heatmapUrl: string;
}

type ViewTab = 'slider' | 'side' | 'toggle';

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ originalUrl, heatmapUrl }) => {
  const [activeTab, setActiveTab] = useState<ViewTab>('slider');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [zoom, setZoom] = useState(1); // zoom level 1 - 3
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isToggled, setIsToggled] = useState(true); // Toggle mode state

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Handle slider mouse/touch drag events
  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Zoom helpers
  const zoomIn = () => setZoom(prev => Math.min(3, prev + 0.5));
  const zoomOut = () => setZoom(prev => Math.max(1, prev - 0.5));
  const resetZoom = () => setZoom(1);

  // Toggle fullscreen escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const renderViewerContent = () => {
    const transformStyle = `scale(${zoom})`;

    switch (activeTab) {
      case 'slider':
        return (
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="heatmap-slider-container"
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%', 
              overflow: 'hidden', 
              cursor: 'ew-resize',
              background: '#0a0b0e',
            }}
          >
            {/* Background Original Image */}
            <div style={{
              width: '100%',
              height: '100%',
              transform: transformStyle,
              transformOrigin: 'center',
              transition: 'transform 0.1s ease-out',
            }}>
              <img
                src={originalUrl}
                alt="Original"
                className="heatmap-slider-image"
                draggable={false}
              />
            </div>

            {/* Foreground Heatmap Overlay (clipped width) */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                pointerEvents: 'none',
                transform: transformStyle,
                transformOrigin: 'center',
                transition: 'transform 0.1s ease-out',
              }}
            >
              <img
                src={heatmapUrl}
                alt="Heatmap scan"
                className="heatmap-slider-image"
                draggable={false}
              />
            </div>

            {/* Slider drag handle line */}
            <div 
              className="heatmap-slider-handle" 
              style={{ 
                left: `${sliderPos}%`,
                pointerEvents: 'none',
              }}
            >
              <div className="heatmap-slider-button">
                <Move size={16} />
              </div>
            </div>

            {/* Hint labels */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#fff',
              pointerEvents: 'none',
              zIndex: 8,
            }}>
              ORIGINAL
            </div>
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(139, 92, 246, 0.7)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#fff',
              pointerEvents: 'none',
              zIndex: 8,
            }}>
              HEATMAP
            </div>
          </div>
        );

      case 'side':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
            height: '100%',
            background: '#0a0b0e',
            padding: '12px',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
              <div style={{ width: '100%', height: '100%', transform: transformStyle, transformOrigin: 'center' }}>
                <img 
                  src={originalUrl} 
                  alt="Original Side" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />
              </div>
              <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Original</span>
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
              <div style={{ width: '100%', height: '100%', transform: transformStyle, transformOrigin: 'center' }}>
                <img 
                  src={heatmapUrl} 
                  alt="Heatmap Side" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />
              </div>
              <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(139,92,246,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Neural Overlay</span>
            </div>
          </div>
        );

      case 'toggle':
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#0a0b0e',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              transform: transformStyle,
              transformOrigin: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img 
                src={isToggled ? heatmapUrl : originalUrl} 
                alt="Toggle View" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            </div>

            {/* floating overlay control panel */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(13, 16, 26, 0.85)',
              border: '1px solid var(--border-color)',
              padding: '10px 16px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              zIndex: 8,
            }}>
              <button 
                onClick={() => setIsToggled(!isToggled)}
                className="btn"
                style={{
                  background: isToggled ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isToggled ? '#06070a' : '#fff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                }}
              >
                {isToggled ? 'Showing Heatmap' : 'Showing Original'}
              </button>
            </div>
          </div>
        );
    }
  };

  const mainLayout = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Header controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '14px',
      }}>
        {/* Comparison Modes Tab */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          padding: '4px',
          borderRadius: '10px',
          gap: '2px',
        }}>
          <button
            onClick={() => { setActiveTab('slider'); resetZoom(); }}
            style={{
              background: activeTab === 'slider' ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: 'none',
              color: activeTab === 'slider' ? '#fff' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: activeTab === 'slider' ? 600 : 400,
            }}
          >
            <Split size={14} />
            <span>Slider Overlay</span>
          </button>
          <button
            onClick={() => { setActiveTab('side'); resetZoom(); }}
            style={{
              background: activeTab === 'side' ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: 'none',
              color: activeTab === 'side' ? '#fff' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: activeTab === 'side' ? 600 : 400,
            }}
          >
            <Columns size={14} />
            <span>Side-by-Side</span>
          </button>
          <button
            onClick={() => { setActiveTab('toggle'); resetZoom(); }}
            style={{
              background: activeTab === 'toggle' ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: 'none',
              color: activeTab === 'toggle' ? '#fff' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: activeTab === 'toggle' ? 600 : 400,
            }}
          >
            <Eye size={14} />
            <span>Toggle Click</span>
          </button>
        </div>

        {/* View adjustments: Zoom, Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '2px',
          }}>
            <button 
              onClick={zoomOut} 
              disabled={zoom === 1}
              style={{
                background: 'none',
                border: 'none',
                color: zoom === 1 ? 'var(--text-muted)' : '#fff',
                cursor: zoom === 1 ? 'default' : 'pointer',
                padding: '6px 10px',
              }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '0 6px', fontFamily: 'var(--mono)' }}>
              {zoom.toFixed(1)}x
            </span>
            <button 
              onClick={zoomIn} 
              disabled={zoom === 3}
              style={{
                background: 'none',
                border: 'none',
                color: zoom === 3 ? 'var(--text-muted)' : '#fff',
                cursor: zoom === 3 ? 'default' : 'pointer',
                padding: '6px 10px',
              }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', borderRadius: '10px' }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main image content viewer */}
      <div className="heatmap-height-adjust" style={{
        height: '420px',
        width: '100%',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}>
        {renderViewerContent()}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        {/* Fullscreen overlay mode */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 6, 8, 0.98)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
        }}>
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {mainLayout}
          </div>
        </div>
      </>
    );
  }

  return mainLayout;
};
