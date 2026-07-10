# TruthLens - Verify Every Image 🛡️

TruthLens is an AI-powered DeepFake Forensic Examination platform built with **React**, **TypeScript**, **Vite**, and **Vanilla CSS**. It enables journalists, researchers, and developers to verify image authenticity, inspect anomalies, and review Grad-CAM explainability heatmaps using a premium glassmorphic SaaS dashboard.

---

## 🌟 Key Features

- **Advanced Image Upload**: Supports local file browsing, Drag & Drop, and global Clipboard Paste (Ctrl+V). Automatically scans and prints natural image resolution, file sizes, and formats before submission.
- **Dual Forensic Engines**:
  - **Normal Mode**: Resizes images to `32 × 32 px` for rapid inference (< 0.2s) utilizing a custom Sequential CNN.
  - **Premium Mode**: Preserves high-resolution details at `224 × 224 px` running an EfficientNet-B0 transfer-learned network to spot subtle synthetic boundaries.
- **Upgraded Warp Visuals**: Activating Premium Mode triggers a glowing particle-grid warp transition, visually reinforcing the engine upgrade.
- **Laser-Scan Loading Overlay**: Replaces basic spinner icons with a progressive checklist of active neural phases (Matrix Scan, Manipulation Spotting, Grad-CAM Generation) and an animated neon laser sweep.
- **Interactive Report Dashboard**:
  - **Grad-CAM Slider**: Side-by-side, toggle click, or interactive before/after transparency sliders using custom clip-path handlers.
  - **Zoom & Fullscreen**: 1x to 3x digital zoom adjustments and fullscreen overlay modes.
  - **Forensic Logs**: Displays dynamic audit parameters (processing duration in milliseconds, final predictions, confidence scores).
  - **Explainability**: Plain English guides translating red/warm activations (anomaly zones) vs blue/cool activations (natural features).
- **LocalStorage History Sidebar**: Stores verification history locally in the browser. Employs a custom downscaling algorithm (constraining thumbs to 350px width at 0.75 JPEG compression) to prevent exceeding browser storage quotas.
- **Connection Error Handling & Offline Demo Mode**: Diagnostic error states for server timeouts. Includes an **Offline Demo Mode** that utilizes HTML Canvas gradients to mock Grad-CAM outputs, allowing complete interface previewing without a live backend connection.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Component-based architecture)
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS (Responsive Flexbox and Grid layouts, CSS Custom Properties, and keyframe animations)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

Clone the repository and install the dependencies:

```bash
# Install package dependencies
npm install
```

### Running Locally

To boot up the local Vite development server:

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

By default, Vite acts as a reverse proxy for API requests:
- Calls to `/api` are routed to the Python FastAPI backend running at `http://localhost:8000`.
- To configure a custom backend server endpoint, specify the `VITE_API_URL` environment variable.

### Building for Production

To verify TypeScript integrity and compile the optimized production bundle:

```bash
npm run build
```
The compiled assets will be written to the `dist/` directory.

---

## 📁 Codebase Structure

```text
truthlens-frontend/
├── src/
│   ├── assets/           # Static asset configurations (Vite, React SVGs)
│   ├── components/       # Reusable UI layout elements
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── UploadArea.tsx
│   │   ├── AnalysisModeSelector.tsx
│   │   ├── PremiumTransition.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── PredictionCard.tsx
│   │   ├── HeatmapViewer.tsx
│   │   ├── ConfidenceGauge.tsx
│   │   ├── ProbabilityChart.tsx
│   │   ├── MetadataPanel.tsx
│   │   ├── ResultSummary.tsx
│   │   ├── HistorySidebar.tsx
│   │   └── ErrorCard.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts   # History logging and thumb compression hooks
│   ├── services/
│   │   └── api.ts               # FastAPI client requests & offline canvas generators
│   ├── App.tsx           # Primary state manager & routing controller
│   ├── index.css         # Global design variables, animations, and sliders
│   └── main.tsx          # React application root
├── index.html            # Core document wrapper (loads Outfit + Inter fonts)
├── vite.config.ts        # Vite reverse-proxy configuration
└── tsconfig.json         # TypeScript rules
```

---

## 🔒 Security & Privacy

TruthLens processes images on the fly via backend memory streams. No uploaded images are saved to a remote database, and all logs/history items are kept 100% locally in your own browser's storage cache.

---

## ✍️ Author

Developed and designed by **Satyabrata Mishra**.
