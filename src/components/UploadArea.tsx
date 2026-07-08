import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, FileImage, Image as ImageIcon, Clipboard, AlertCircle } from 'lucide-react';

interface FileDetails {
  file: File;
  name: string;
  size: number;
  format: string;
  resolution: string;
  previewUrl: string;
}

interface UploadAreaProps {
  onFileSelect: (file: File | null, previewUrl: string | null, details: Omit<FileDetails, 'file' | 'previewUrl'> | null) => void;
  selectedFile: File | null;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  // Sync if parent resets the file
  useEffect(() => {
    if (!selectedFile) {
      setFileDetails(null);
      setError(null);
    }
  }, [selectedFile]);

  // Handle clipboard paste generally when focusing the page/container
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const processFile = (file: File) => {
    setError(null);

    // 1. Validation: check if it is an image
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    // 2. Validation: limit to 10MB
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      setError(`Oversized file detected. Maximum upload limit is 10 MB (Your file is ${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    // Create object URL for local preview
    const previewUrl = URL.createObjectURL(file);

    // Load image in memory to extract natural dimensions (resolution)
    const img = new Image();
    img.onload = () => {
      const details = {
        file,
        name: file.name || 'Pasted Image',
        size: file.size,
        format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
        resolution: `${img.naturalWidth} × ${img.naturalHeight} px`,
        previewUrl
      };
      setFileDetails(details);
      onFileSelect(file, previewUrl, {
        name: details.name,
        size: details.size,
        format: details.format,
        resolution: details.resolution
      });
    };
    img.onerror = () => {
      setError('Corrupted image or invalid format. Could not decode image data.');
      URL.revokeObjectURL(previewUrl);
    };
    img.src = previewUrl;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (fileDetails?.previewUrl) {
      URL.revokeObjectURL(fileDetails.previewUrl);
    }
    setFileDetails(null);
    setError(null);
    onFileSelect(null, null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Human readable file sizes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Error message card */}
      {error && (
        <div className="glass-panel" style={{
          padding: '16px',
          borderColor: 'var(--accent-red)',
          background: 'rgba(239, 68, 68, 0.05)',
          color: '#ff8a8a',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0, color: 'var(--accent-red)' }} />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!fileDetails ? (
        <div
          ref={pasteAreaRef}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`glass-panel ${dragActive ? 'glass-panel-glow' : ''}`}
          style={{
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: dragActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragActive ? 'rgba(6, 182, 212, 0.05)' : 'rgba(13, 16, 26, 0.3)',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: dragActive ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: dragActive ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
            color: dragActive ? '#06070a' : 'var(--accent-cyan)',
            transition: 'all 0.2s',
          }}>
            <Upload size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              Drag & Drop Image Here
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              or <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>browse files</span> from your computer
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            width: '100%',
            maxWidth: '360px',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clipboard size={14} /> Paste (Ctrl+V)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileImage size={14} /> PNG, JPG, WEBP
            </span>
            <span>Max 10MB</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="glass-panel" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(13, 16, 26, 0.5)',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
          }}>
            {/* The Image Preview thumbnail */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#000',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={fileDetails.previewUrl}
                alt="Upload preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'background 0.2s',
                }}
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>

            {/* Metadata Info Panel */}
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontWeight: 600, fontSize: '16px', color: '#fff', wordBreak: 'break-all' }}>
                  {fileDetails.name}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '12px',
                marginTop: '4px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FILE SIZE</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {formatBytes(fileDetails.size)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RESOLUTION</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {fileDetails.resolution}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FORMAT</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {fileDetails.format}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
