import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { UploadArea } from './components/UploadArea';
import { AnalysisModeSelector } from './components/AnalysisModeSelector';
import type { AnalysisMode } from './components/AnalysisModeSelector';
import { PremiumTransition } from './components/PremiumTransition';
import { LoadingOverlay } from './components/LoadingOverlay';
import { PredictionCard } from './components/PredictionCard';
import { HeatmapViewer } from './components/HeatmapViewer';
import { ConfidenceGauge } from './components/ConfidenceGauge';
import { ProbabilityChart } from './components/ProbabilityChart';
import { MetadataPanel } from './components/MetadataPanel';
import { ResultSummary } from './components/ResultSummary';
import { HistorySidebar } from './components/HistorySidebar';
import { ErrorCard } from './components/ErrorCard';
import { Footer } from './components/Footer';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HistoryItem } from './hooks/useLocalStorage';
import { predictImage } from './services/api';
import type { PredictionResponse } from './services/api';
import { ArrowLeft, Sparkles, RotateCw } from 'lucide-react';

function App() {
  // App States
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: number;
    format: string;
    resolution: string;
  } | null>(null);

  const [mode, setMode] = useState<AnalysisMode>('normal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiCompleted, setApiCompleted] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Demo Mode and History
  const [useDemo, setUseDemo] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  const { history, saveToHistory, deleteHistoryItem, clearHistory } = useLocalStorage();
  
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleStartClick = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (
    selectedFile: File | null,
    url: string | null,
    details: typeof fileDetails
  ) => {
    setFile(selectedFile);
    setPreviewUrl(url);
    setFileDetails(details);
    if (!selectedFile) {
      // Clear results if file is removed
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !previewUrl || !fileDetails) return;

    setIsAnalyzing(true);
    setApiCompleted(false);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {
      // Call endpoint
      const response = await predictImage(file, mode, useDemo);
      const elapsed = performance.now() - startTime;
      
      setDurationMs(Math.round(elapsed));
      setTimestamp(Date.now());
      setResult(response);

      // Save item to history
      await saveToHistory(
        {
          fileName: fileDetails.name,
          fileSize: fileDetails.size,
          fileResolution: fileDetails.resolution,
          fileFormat: fileDetails.format,
          mode: mode,
          prediction: response.prediction,
          confidence: response.confidence
        },
        previewUrl,
        response.heatmap
      );

      // Signal to LoadingOverlay that background task is done
      setApiCompleted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during inference.');
      setIsAnalyzing(false);
    }
  };

  // Reopen results from history click
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setFile(null); // Clear active file upload
    setFileDetails({
      name: item.fileName,
      size: item.fileSize,
      format: item.fileFormat,
      resolution: item.fileResolution,
    });
    setPreviewUrl(item.originalImage);
    setMode(item.mode);
    setResult({
      prediction: item.prediction,
      confidence: item.confidence,
      heatmap: item.heatmap,
    });
    setDurationMs(item.mode === 'premium' ? 1240 : 180); // Estimate duration for presentation
    setTimestamp(item.timestamp);
    setError(null);
    setIsAnalyzing(false);
    setApiCompleted(false);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileDetails(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setApiCompleted(false);
  };

  const handleVerifyImageClick = () => {
    handleReset();
    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto scroll to results when loaded
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (result && !isAnalyzing) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result, isAnalyzing]);

  return (
    <>
      {/* Dynamic backgrounds */}
      <div className={`neural-grid ${mode === 'premium' ? 'neural-grid-premium' : ''}`} />
      <div className="glow-orb glow-orb-cyan" />
      <div className="glow-orb glow-orb-purple" style={{ bottom: '10%' }} />

      <Navbar 
        onHistoryClick={() => setHistoryOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
        onVerifyClick={handleVerifyImageClick}
      />

      <PremiumTransition mode={mode} />

      {/* Main Body Grid */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        
        {/* Landing Page: Only shown if no file is selected AND no result is open */}
        {!previewUrl && !isAnalyzing && !result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <Hero onStartClick={handleStartClick} />
            
            <div ref={uploadSectionRef} style={{ 
              maxWidth: '700px', 
              width: '100%', 
              margin: '0 auto', 
              padding: '0 20px 40px 20px',
              scrollMarginTop: '100px'
            }}>
              <UploadArea 
                selectedFile={file} 
                onFileSelect={handleFileSelect} 
              />
            </div>

            <Features />
          </div>
        )}

        {/* Verification Workspace: Selected file ready for scan details */}
        {previewUrl && !isAnalyzing && !result && !error && (
          <section style={{
            maxWidth: '800px',
            width: '100%',
            margin: '40px auto 80px auto',
            padding: '0 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', borderRadius: '10px' }}
              >
                <ArrowLeft size={16} />
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Verification Workspace</h2>
            </div>

            <UploadArea 
              selectedFile={file} 
              onFileSelect={handleFileSelect} 
            />

            <AnalysisModeSelector 
              mode={mode} 
              onChange={setMode} 
            />

            {/* Glowing CTA Scan Action */}
            <button
              onClick={handleAnalyze}
              className={`btn ${mode === 'premium' ? 'btn-premium' : 'btn-primary'}`}
              style={{
                width: '100%',
                padding: '16px 32px',
                fontSize: '18px',
                borderRadius: '14px',
                marginTop: '10px',
                boxShadow: mode === 'premium' 
                  ? '0 0 30px rgba(139, 92, 246, 0.3)' 
                  : '0 0 30px rgba(6, 182, 212, 0.3)',
              }}
            >
              <span>Initialize Forensic Scan</span>
              <Sparkles size={20} />
            </button>
          </section>
        )}

        {/* Loading / AI Scanning Stage */}
        {isAnalyzing && (
          <section style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px 20px',
          }}>
            <LoadingOverlay 
              imagePreviewUrl={previewUrl}
              isCompleted={apiCompleted}
              onFinished={() => setIsAnalyzing(false)}
            />
          </section>
        )}

        {/* Error state */}
        {error && !isAnalyzing && (
          <section style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '65vh',
            padding: '40px 20px',
          }}>
            <ErrorCard 
              error={error} 
              onRetry={handleAnalyze}
              onActivateDemoMode={() => {
                setUseDemo(true);
                setError(null);
                // Immediately trigger prediction in demo mode
                setTimeout(() => handleAnalyze(), 100);
              }}
            />
          </section>
        )}

        {/* Results Screen */}
        {result && !isAnalyzing && !error && (
          <section 
            ref={resultsRef}
            style={{
              maxWidth: '1200px',
              width: '100%',
              margin: '30px auto 80px auto',
              padding: '0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Header controls */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '20px',
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Verification Completed
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Analysis Report</h2>
              </div>
              
              <button 
                onClick={handleReset}
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  borderRadius: '10px',
                }}
              >
                <RotateCw size={16} />
                <span>Verify Another Image</span>
              </button>
            </div>

            {/* Results Grid Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'start',
            }}>
              
              {/* Left Column: Heatmap comparison viewer */}
              <div style={{ 
                gridColumn: 'span 1',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <HeatmapViewer 
                  originalUrl={previewUrl!}
                  heatmapUrl={result.heatmap}
                />
              </div>

              {/* Right Column: Prediction results statistics */}
              <div className="report-stats-grid" style={{ 
                gridColumn: 'span 1',
              }}>
                <PredictionCard prediction={result.prediction} />
                
                <ConfidenceGauge 
                  confidence={result.confidence} 
                  prediction={result.prediction}
                />
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <MetadataPanel 
                    mode={mode} 
                    resolution={fileDetails?.resolution || 'Unknown'} 
                    durationMs={durationMs} 
                    timestamp={timestamp}
                  />
                </div>

                <ProbabilityChart 
                  confidence={result.confidence} 
                  prediction={result.prediction}
                />

                <ResultSummary 
                  prediction={result.prediction} 
                  confidence={result.confidence} 
                />
              </div>

            </div>
          </section>
        )}

      </main>

      <Footer />

      {/* History sidebar drawer */}
      <HistorySidebar 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={history}
        onSelect={handleSelectHistoryItem}
        onDelete={deleteHistoryItem}
        onClearAll={clearHistory}
      />
    </>
  );
}

export default App;
