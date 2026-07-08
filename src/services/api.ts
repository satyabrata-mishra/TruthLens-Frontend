export interface PredictionResponse {
  prediction: 'AI Generated' | 'Real';
  confidence: number;
  heatmap: string; // base64 data URL
}

export async function predictImage(
  file: File, 
  mode: 'normal' | 'premium',
  useDemo: boolean = false
): Promise<PredictionResponse> {
  if (useDemo) {
    return getDemoPrediction(file, mode);
  }

  const formData = new FormData();
  formData.append('file', file);

  const endpoint = mode === 'premium' ? '/api/predict/premium' : '/api/predict/normal';
  
  // VITE_API_URL can be set to point to backend. If empty, uses Vite dev proxy or relative path
  console.log(import.meta.env.VITE_API_URL);
  const apiBase = import.meta.env.VITE_API_URL || '';
  const url = `${apiBase}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = 'Analysis failed on the server.';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || errorDetail;
      } catch {
        // Fallback to text
      }
      throw new Error(`Server Error (${response.status}): ${errorDetail}`);
    }

    return await response.json();
  } catch (error: any) {
    // If it's a network error (like connection refused)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('NETWORK_DISCONNECTED');
    }
    throw error;
  }
}

/**
 * Fallback local demo generator that simulates prediction and returns a custom heatmap 
 * using canvas overlay so the platform is fully inspectable when offline.
 */
function getDemoPrediction(file: File, mode: 'normal' | 'premium'): Promise<PredictionResponse> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context not available');
          }

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Create a mock Grad-CAM heatmap overlay
          const grad = ctx.createRadialGradient(
            canvas.width * 0.4 + Math.random() * canvas.width * 0.2,
            canvas.height * 0.4 + Math.random() * canvas.height * 0.2,
            10,
            canvas.width * 0.5,
            canvas.height * 0.5,
            Math.min(canvas.width, canvas.height) * 0.4
          );
          
          // Simulation of JET colormap (red high activation, blue/cyan low)
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');   // Red
          grad.addColorStop(0.2, 'rgba(245, 158, 11, 0.3)'); // Orange/Yellow
          grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)'); // Green
          grad.addColorStop(1, 'rgba(59, 130, 246, 0.05)');   // Blue

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Simple heuristic: if filename contains 'fake' or 'ai' or starts with odd characters,
          // make it AI Generated, otherwise semi-random
          const nameLower = file.name.toLowerCase();
          const isFake = nameLower.includes('fake') || nameLower.includes('ai') || nameLower.includes('generated') || Math.random() > 0.55;
          // Use mode to simulate slightly different performance profile
          const confidence = mode === 'premium' ? 0.85 + Math.random() * 0.13 : 0.70 + Math.random() * 0.25;

          resolve({
            prediction: isFake ? 'AI Generated' : 'Real',
            confidence: Number(confidence.toFixed(4)),
            heatmap: canvas.toDataURL('image/png'),
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error reading upload file.'));
    reader.readAsDataURL(file);
  });
}
