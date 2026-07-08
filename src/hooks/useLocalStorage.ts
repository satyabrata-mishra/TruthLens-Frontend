import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  fileName: string;
  fileSize: number;
  fileResolution: string;
  fileFormat: string;
  mode: 'normal' | 'premium';
  prediction: 'AI Generated' | 'Real';
  confidence: number;
  heatmap: string;          // base64 Grad-CAM overlay
  originalImage: string;    // base64 original image (compressed for local storage)
  timestamp: number;
}

const STORAGE_KEY = 'truthlens_history';

// Helper to compress base64 image URL to a max dimension for local storage efficiency
export function compressImage(srcUrl: string, maxDim: number = 400): Promise<string> {
  return new Promise((resolve) => {
    if (srcUrl.startsWith('data:image/svg+xml')) {
      resolve(srcUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        // Use jpeg with 0.75 quality for high storage efficiency
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      } else {
        resolve(srcUrl);
      }
    };
    img.onerror = () => resolve(srcUrl);
    img.src = srcUrl;
  });
}

export function useLocalStorage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from LocalStorage:', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = async (
    item: Omit<HistoryItem, 'id' | 'timestamp' | 'originalImage' | 'heatmap'>,
    originalSrc: string,
    heatmapSrc: string
  ) => {
    try {
      // Compress both original image and heatmap to keep storage size well within the 5MB browser quota
      const [compressedOriginal, compressedHeatmap] = await Promise.all([
        compressImage(originalSrc, 350),
        compressImage(heatmapSrc, 350)
      ]);

      const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        originalImage: compressedOriginal,
        heatmap: compressedHeatmap,
        timestamp: Date.now()
      };

      setHistory(prev => {
        const updated = [newItem, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return newItem;
    } catch (e) {
      console.error('Failed to save prediction item to history:', e);
      return null;
    }
  };

  // Delete specific history item
  const deleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all history
  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear local history:', e);
    }
  };

  return {
    history,
    saveToHistory,
    deleteHistoryItem,
    clearHistory
  };
}
