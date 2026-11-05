import { useState, useEffect, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  Sparkles,
  Zap,
  Info,
  RotateCcw,
  Palette
} from 'lucide-react'
import Keyboard3D from './components/Keyboard3D'
import { soundEngine, SWITCH_PROFILES, SwitchType } from './audio/soundEngine'
import { COLORWAYS, Colorway, KeyData } from './data/keyboardConfig'

export default function App() {
  const [activeSwitch, setActiveSwitch] = useState<SwitchType>('holy-panda')
  const [activeColorway, setActiveColorway] = useState<Colorway>(COLORWAYS[0])
  const [volume, setVolume] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0)
  const [typedHistory, setTypedHistory] = useState<string>('')
  const [wpm, setWpm] = useState<number>(0)
  const keystrokeTimestamps = useRef<number[]>([])

  // Calculate rolling WPM
  const registerKeystroke = useCallback((isSpacebar = false) => {
    const now = Date.now()
    keystrokeTimestamps.current.push(now)
    // Keep keystrokes in last 5 seconds
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(t => now - t <= 5000)
    const currentWpm = Math.round((keystrokeTimestamps.current.length / 5) * 60 / 5)
    setWpm(currentWpm)
    setKeystrokeCount(c => c + 1)

    // Play switch sound
    if (!isMuted) {
      soundEngine.playSwitch(activeSwitch, volume, isSpacebar)
    }

    // Trigger celebration at 100 strokes
    if (keystrokeTimestamps.current.length > 30) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 }
      })
    }
  }, [activeSwitch, volume, isMuted])

  // Handle hardware keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return

      setActiveKeys(prev => {
        const next = new Set(prev)
        next.add(e.code)
        return next
      })

      const isSpace = e.code === 'Space'
      registerKeystroke(isSpace)

      if (e.key.length === 1) {
        setTypedHistory(h => (h + e.key).slice(-45))
      } else if (e.code === 'Backspace') {
        setTypedHistory(h => h.slice(0, -1))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(e.code)
        return next
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [registerKeystroke])

  // Handle on-screen 3D key click
  const handleKeyClick = (key: KeyData) => {
    setActiveKeys(prev => {
      const next = new Set(prev)
      next.add(key.code)
      return next
    })

    registerKeystroke(key.code === 'Space')
    if (key.label.length === 1) {
      setTypedHistory(h => (h + key.label).slice(-45))
    }

    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(key.code)
        return next
      })
    }, 120)
  }

  const currentSwitchProfile = SWITCH_PROFILES[activeSwitch]

  return (
    <div className="flex flex-col h-screen w-full bg-[#080a0f] text-gray-100 overflow-hidden select-none">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
              <KeyboardIcon className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              KeyThock <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">3D Sim</span>
            </h1>
            <p className="text-xs text-gray-400">Interactive Mechanical Keyboard & Acoustic Simulator</p>
          </div>
        </div>

        {/* Stats & HUD */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 bg-gray-900/90 border border-gray-800 px-4 py-1.5 rounded-xl text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase mr-1.5">Speed:</span>
              <span className="text-cyan-400 font-bold">{wpm} WPM</span>
            </div>
            <div className="w-px h-3 bg-gray-700" />
            <div>
              <span className="text-gray-500 uppercase mr-1.5">Strokes:</span>
              <span className="text-purple-400 font-bold">{keystrokeCount}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                if (isMuted) setIsMuted(false)
              }}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="flex-1 h-full relative">
          <Keyboard3D
            colorway={activeColorway}
            activeKeys={activeKeys}
            onKeyPress={handleKeyClick}
          />

          {/* Real-time Typing Stream Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-md border border-gray-800/90 px-6 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-lg pointer-events-none">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-gray-400 uppercase font-mono">Buffer:</span>
            <span className="text-sm font-mono text-cyan-300 font-medium tracking-wide truncate">
              {typedHistory || 'Type on physical keyboard or click 3D keys...'}
            </span>
          </div>

          {/* 3D Controls Hint */}
          <div className="absolute bottom-4 left-4 bg-gray-950/70 backdrop-blur-sm border border-gray-800/60 px-3 py-1.5 rounded-lg text-[11px] text-gray-400 flex items-center gap-2 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drag to rotate • Scroll to zoom • Type anywhere</span>
          </div>
        </div>

        {/* Right Sidebar Configurator */}
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-800/80 bg-gray-950/90 backdrop-blur-xl p-5 overflow-y-auto space-y-6 z-10 flex-shrink-0">
          {/* Switch Acoustics Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Switch Acoustics
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {currentSwitchProfile.feel}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(SWITCH_PROFILES) as SwitchType[]).map((st) => {
                const s = SWITCH_PROFILES[st]
                const isSelected = activeSwitch === st
                return (
                  <button
                    key={st}
                    onClick={() => {
                      setActiveSwitch(st)
                      soundEngine.playSwitch(st, volume)
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-gray-900/40 border-gray-800/60 hover:bg-gray-900/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {s.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.accentColor }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Colorway / Keycaps Theme Selector */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Keycap Colorway
            </h2>

            <div className="grid grid-cols-1 gap-2">
              {COLORWAYS.map((c) => {
                const isSelected = activeColorway.id === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveColorway(c)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-gray-900 border-purple-500/50 shadow-md shadow-purple-500/10'
                        : 'bg-gray-900/40 border-gray-800/60 hover:bg-gray-900/80 hover:border-gray-700'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {c.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: c.alphaBg }}
                        title="Alpha Key"
                      />
                      <span
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: c.modBg }}
                        title="Modifier Key"
                      />
                      <span
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: c.accentBg }}
                        title="Accent Key"
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Free Typing Test Sandbox */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Acoustics Test Pad
              </span>
              <button
                onClick={() => setTypedHistory('')}
                className="text-xs text-gray-400 hover:text-cyan-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Click here and start rapid typing to test switch clack & thock acoustics..."
              className="w-full bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
