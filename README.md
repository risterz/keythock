# 🎹 KeyThock 3D

> **Interactive 3D Mechanical Keyboard Customizer, Sound Simulator & Typing Playground.**  
> Built with **React Three Fiber**, **Three.js**, and procedural **Web Audio API** synthesis.

[![Live Demo](https://img.shields.io/badge/Live_Demo-keythock.pages.dev-06b6d4?style=for-the-badge&logo=cloudflare&logoColor=white)](https://keythock.pages.dev)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)

---

## 🌟 Live Demo

Experience the 3D customizer live in your browser:  
👉 **[https://keythock.pages.dev](https://keythock.pages.dev)**

---

## ✨ Features

### 🎮 Interactive 3D Keyboard Canvas
- **Physical Key Simulation**: Real-time spring depression animations and haptic feedback.
- **Full Camera Control**: Orbit, pan, zoom, and rotate smoothly with Three.js OrbitControls.
- **Dual Input Sync**: Type using your physical hardware keyboard or click individual 3D keycaps with your mouse.
- **Chassis Dimensions & Centering**: Dynamic layout calculation with zero keycap clipping across all form factors.

### 📐 Multiple Keyboard Form Factors
Switch dynamically between keyboard layouts:
- **60% Compact**: Minimalist 61-key ANSI layout.
- **64% Arrow Layout**: Dedicated arrow cluster with 1u Shift.
- **65% Standard**: Arrow cluster plus navigation column (Del, PgUp, PgDn).
- **75% Compact**: Integrated function row (F1-F12) and vertical navigation column.
- **80% TKL (Tenkeyless)**: Traditional 87-key layout with dedicated navigation cluster and arrow cluster.

### 🔊 Procedural Web Audio Synthesis Engine
Zero large sample packs required — all switch keystrokes and bottom-out sounds are procedurally generated in real-time via Web Audio API:
- **Holy Panda**: Tactile bump, crisp clack, deep bottom-out thock.
- **Gateron Oil King**: Ultra-smooth linear, deep bass signature.
- **Cherry MX Blue**: Dual-stage acoustic click leaf with metallic transient.
- **Gateron Silent Black**: Dampened silicone pad simulation with muted travel.
- **Topre 45g**: Electro-capacitive rubber dome pop with low-pitch resonance.

### 🛡️ Switch Plate Material Configurator
Acoustic and visual shaders modulate in real-time:
- **Polycarbonate (PC)**: Deepest bass thock, frosted translucent shader (`opacity: 0.75`).
- **POM (Acetal)**: Creamy, marbled thock with dense off-white finish.
- **FR4**: Balanced classic thock, matte epoxy black with gold traces.
- **Aluminum**: Crisp mid-high pitch, brushed metallic gray.
- **Brass**: High-pitch clacky acoustic resonance, polished gold luster.

### 🔥 Acoustic Mod Profiles
- **Stock Case**: Clean baseline mechanical acoustics.
- **Tape Mod (Tempest Mod)**: Low-frequency dampener and pitch filter.
- **PE Foam Mod**: Poppy, bright, marbly switch resonance.

### 🌈 Per-Key Dynamic RGB Lighting
- **Ripple**: Reactive wave radiating outward from pressed keys.
- **Rainbow**: Dynamic spectrum wave across the entire switch matrix.
- **Breathing**: Pulsing ambient glow.
- **Static**: Steady cyberpunk glow.
- **Off**: Stealth mode without lighting.

### 🔍 Exploded 3D Teardown View
Interactive teardown slider separates internal keyboard layers with 3D depth tags:
1. **Keycaps**: PBT Doubleshot sculpts.
2. **Mechanical Switches**: Translucent housings with colored stems.
3. **Switch Plate**: Custom dynamic material (Brass, Alum, FR4, POM, PC).
4. **Plate Foam**: EVA acoustic dampening foam.
5. **Hot-Swap PCB**: Circuit board traces with per-key RGB LEDs.
6. **Bottom Case & Weight**: Aluminum anodized chassis with brass weight bar.

### ⏱️ Typing Speed Test & Playground
- **Sandbox Mode**: Free typing with rolling WPM calculation, keystroke counter, and character stream.
- **Speed Test Challenge**: Passage accuracy tracking, real-time timer, acoustic error feedback, and celebratory confetti upon completion.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **3D Rendering** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` |
| **Audio Engine** | Procedural Web Audio API (Oscillators, BiquadFilter, Convolver, GainNodes) |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Effects** | Canvas Confetti |
| **Hosting & CI/CD** | Cloudflare Pages, GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/risterz/keythock.git
   cd keythock
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Built static assets will be generated in `dist/`.

---

## 📁 Project Architecture

```
keythock/
├── public/                 # Static assets and icons
├── src/
│   ├── audio/
│   │   └── soundEngine.ts  # Web Audio API procedural synthesis & plate acoustics
│   ├── components/
│   │   └── Keyboard3D.tsx  # Three.js / R3F 3D Keyboard, Shaders, & Teardown
│   ├── data/
│   │   └── keyboardConfig.ts # ANSI Layouts (60, 64, 65, 75, TKL), Colorways, Texts
│   ├── App.tsx             # Main Application, HUD, Speed Test, & Controls
│   ├── main.tsx            # Application entrypoint
│   └── index.css           # Tailwind CSS directives & global styling
├── index.html              # HTML template
├── package.json            # Dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

---

## ☁️ Deployment

### Cloudflare Pages (Direct Deployment)
Deploying using Wrangler CLI:
```bash
npm run build
npx wrangler pages deploy dist --project-name keythock --branch main
```

Or connect the repository `risterz/keythock` directly via Cloudflare Dashboard for automatic continuous deployment on every `git push`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
