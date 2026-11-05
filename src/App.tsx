import { useState, useEffect, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import {
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  Sparkles,
  Zap,
  RotateCcw,
  Palette,
  Layers,
  Activity,
  Sun,
  Flame,
  Award,
  Play,
  CheckCircle2
} from 'lucide-react'
import Keyboard3D from './components/Keyboard3D'
import {
  soundEngine,
  SWITCH_PROFILES,
  SwitchType,
  ACOUSTIC_MODS,
  AcousticMod
} from './audio/soundEngine'
import {
  COLORWAYS,
  Colorway,
  KeyData,
  RgbMode,
  ArtisanEsc,
  TYPING_TEST_PARAGRAPHS,
  KEY_POSITION_MAP,
  findKeyData
} from './data/keyboardConfig'

export default function App() {
  // Config state
  const [activeSwitch, setActiveSwitch] = useState<SwitchType>('holy-panda')
  const [activeMod, setActiveMod] = useState<AcousticMod>('pe-foam')
  const [activeColorway, setActiveColorway] = useState<Colorway>(COLORWAYS[0])
  const [rgbMode, setRgbMode] = useState<RgbMode>('ripple')
  const [artisanEsc, setArtisanEsc] = useState<ArtisanEsc>('gemstone')
  const [explodeAmount, setExplodeAmount] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Interaction & HUD state
  const [mode, setMode] = useState<'sandbox' | 'speedtest'>('sandbox')
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [lastPressedKeyPos, setLastPressedKeyPos] = useState<{ x: number; z: number; time: number } | null>(null)
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0)
  const [typedBuffer, setTypedBuffer] = useState<string>('')
  const [wpm, setWpm] = useState<number>(0)
  const keystrokeTimestamps = useRef<number[]>([])

  // Speed Test state & refs for race-condition-free event handling
  const [targetParagraph, setTargetParagraph] = useState<string>(TYPING_TEST_PARAGRAPHS[0])
  const [testInput, setTestInput] = useState<string>('')
  const [testStartTime, setTestStartTime] = useState<number | null>(null)
  const [testCompleted, setTestCompleted] = useState<boolean>(false)
  const [testStats, setTestStats] = useState<{ wpm: number; accuracy: number; time: number } | null>(null)
  const [errorCount, setErrorCount] = useState<number>(0)

  const testInputRef = useRef<string>('')
  const targetParagraphRef = useRef<string>(TYPING_TEST_PARAGRAPHS[0])
  const testStartTimeRef = useRef<number | null>(null)
  const testCompletedRef = useRef<boolean>(false)
  const errorCountRef = useRef<number>(0)
  const activeKeyPressTimes = useRef<Map<string, number>>(new Map())
  const activeKeyReleaseTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Register physical or on-screen keystroke
  const handleKeystrokeAction = useCallback((keyData?: KeyData, keyChar?: string) => {
    const now = Date.now()
    keystrokeTimestamps.current.push(now)
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(t => now - t <= 5000)
    const rollingWpm = Math.round((keystrokeTimestamps.current.length / 5) * 60 / 5)
    setWpm(rollingWpm)
    setKeystrokeCount(c => c + 1)

    const isSpace = keyData?.code === 'Space' || keyChar === ' '

    // Play switch sound with active acoustics mod
    if (!isMuted) {
      soundEngine.playSwitch(activeSwitch, volume, isSpace, activeMod)
    }

    if (keyData) {
      const pos = KEY_POSITION_MAP.get(keyData.code) || KEY_POSITION_MAP.get(keyData.id)
      if (pos) {
        setLastPressedKeyPos({
          x: pos.x,
          z: pos.z,
          time: now
        })
      }
    }
  }, [activeSwitch, volume, isMuted, activeMod])

  // Hardware keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default actions (space scroll/button click, tab jump, backspace history)
      if (['Space', 'Tab'].includes(e.code) || e.key === ' ' || (e.code === 'Backspace' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault()
      }

      // Defocus any active HTML button so Space never triggers an accidental button click
      if (document.activeElement instanceof HTMLElement && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.blur()
      }

      if (e.repeat) return

      const keyData = findKeyData(e.code, e.key)
      const targetCode = keyData ? keyData.code : e.code

      // Visual actuation tracking with minimum dwell time
      activeKeyPressTimes.current.set(targetCode, Date.now())
      const pendingTimer = activeKeyReleaseTimeouts.current.get(targetCode)
      if (pendingTimer) {
        clearTimeout(pendingTimer)
        activeKeyReleaseTimeouts.current.delete(targetCode)
      }

      setActiveKeys(prev => {
        const next = new Set(prev)
        next.add(targetCode)
        return next
      })

      handleKeystrokeAction(keyData, e.key)

      // Handle Sandbox Buffer
      if (mode === 'sandbox') {
        if (e.key === 'Backspace') {
          setTypedBuffer(h => h.slice(0, -1))
        } else if (e.key === ' ') {
          setTypedBuffer(h => (h + ' ').slice(-45))
        } else if (e.key.length === 1) {
          setTypedBuffer(h => (h + e.key).slice(-45))
        }
      }

      // Handle Speed Test Input
      if (mode === 'speedtest' && !testCompletedRef.current) {
        if (!testStartTimeRef.current) {
          const now = Date.now()
          testStartTimeRef.current = now
          setTestStartTime(now)
        }

        if (e.key === 'Backspace') {
          testInputRef.current = testInputRef.current.slice(0, -1)
          setTestInput(testInputRef.current)
        } else if (e.key.length === 1) {
          const target = targetParagraphRef.current
          const currentInput = testInputRef.current

          if (currentInput.length < target.length) {
            const expectedChar = target[currentInput.length]
            if (e.key !== expectedChar) {
              errorCountRef.current += 1
              setErrorCount(errorCountRef.current)
              soundEngine.playErrorSound(volume)
            }

            const nextInput = currentInput + e.key
            testInputRef.current = nextInput
            setTestInput(nextInput)

            // Completed test!
            if (nextInput.length >= target.length) {
              const timeTaken = Math.max(0.2, (Date.now() - (testStartTimeRef.current || Date.now())) / 1000)
              const words = target.split(' ').length
              const finalWpm = Math.max(1, Math.round((words / timeTaken) * 60))
              const accuracy = Math.max(0, Math.round(((target.length - errorCountRef.current) / target.length) * 100))

              testCompletedRef.current = true
              setTestStats({ wpm: finalWpm, accuracy, time: parseFloat(timeTaken.toFixed(1)) })
              setTestCompleted(true)

              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              })
            }
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyData = findKeyData(e.code, e.key)
      const targetCode = keyData ? keyData.code : e.code

      const pressedAt = activeKeyPressTimes.current.get(targetCode) || 0
      const elapsed = Date.now() - pressedAt
      const minDwell = 90

      if (elapsed < minDwell) {
        const timer = setTimeout(() => {
          setActiveKeys(prev => {
            const next = new Set(prev)
            next.delete(targetCode)
            return next
          })
          activeKeyReleaseTimeouts.current.delete(targetCode)
        }, minDwell - elapsed)
        activeKeyReleaseTimeouts.current.set(targetCode, timer)
      } else {
        setActiveKeys(prev => {
          const next = new Set(prev)
          next.delete(targetCode)
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeystrokeAction, mode, volume])

  // Click on 3D keycap
  const handle3DKeyClick = (key: KeyData) => {
    const keyChar = key.code === 'Space' ? ' ' : (key.label.length === 1 ? key.label : '')
    const targetCode = key.code

    activeKeyPressTimes.current.set(targetCode, Date.now())
    setActiveKeys(prev => new Set(prev).add(targetCode))
    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev)
        next.delete(targetCode)
        return next
      })
    }, 120)

    handleKeystrokeAction(key, keyChar || key.label)

    if (mode === 'sandbox') {
      if (key.code === 'Backspace') {
        setTypedBuffer(h => h.slice(0, -1))
      } else if (keyChar) {
        setTypedBuffer(h => (h + keyChar).slice(-45))
      }
    } else if (mode === 'speedtest' && !testCompletedRef.current) {
      if (!testStartTimeRef.current) {
        const now = Date.now()
        testStartTimeRef.current = now
        setTestStartTime(now)
      }

      if (key.code === 'Backspace') {
        testInputRef.current = testInputRef.current.slice(0, -1)
        setTestInput(testInputRef.current)
      } else if (keyChar && keyChar.length === 1) {
        const target = targetParagraphRef.current
        const currentInput = testInputRef.current

        if (currentInput.length < target.length) {
          const expectedChar = target[currentInput.length]
          if (keyChar.toLowerCase() !== expectedChar.toLowerCase()) {
            errorCountRef.current += 1
            setErrorCount(errorCountRef.current)
            soundEngine.playErrorSound(volume)
          }

          const nextInput = currentInput + keyChar
          testInputRef.current = nextInput
          setTestInput(nextInput)

          if (nextInput.length >= target.length) {
            const timeTaken = Math.max(0.2, (Date.now() - (testStartTimeRef.current || Date.now())) / 1000)
            const words = target.split(' ').length
            const finalWpm = Math.max(1, Math.round((words / timeTaken) * 60))
            const accuracy = Math.max(0, Math.round(((target.length - errorCountRef.current) / target.length) * 100))

            testCompletedRef.current = true
            setTestStats({ wpm: finalWpm, accuracy, time: parseFloat(timeTaken.toFixed(1)) })
            setTestCompleted(true)

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            })
          }
        }
      }
    }
  }

  // Restart Speed Test
  const resetSpeedTest = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setTargetParagraph(current => {
      const candidates = TYPING_TEST_PARAGRAPHS.filter(p => p !== current)
      const nextP = candidates[Math.floor(Math.random() * candidates.length)] || TYPING_TEST_PARAGRAPHS[0]
      targetParagraphRef.current = nextP
      return nextP
    })
    testInputRef.current = ''
    setTestInput('')
    testStartTimeRef.current = null
    setTestStartTime(null)
    testCompletedRef.current = false
    setTestCompleted(false)
    setTestStats(null)
    errorCountRef.current = 0
    setErrorCount(0)
  }, [])

  const currentSwitch = SWITCH_PROFILES[activeSwitch]
  const currentMod = ACOUSTIC_MODS[activeMod]

  return (
    <div className="flex flex-col h-screen w-full bg-[#07090e] text-gray-100 overflow-hidden select-none">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
              <KeyboardIcon className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                KeyThock
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                3D Pro
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Mechanical Keyboard Simulator • Acoustic Engine & 3D Teardown
            </p>
          </div>
        </div>

          {/* Mode Selector Tabs */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
          <button
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur()
              setMode('sandbox')
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'sandbox' ? 'bg-cyan-500/20 text-cyan-300 shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sandbox
          </button>
          <button
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur()
              setMode('speedtest')
              resetSpeedTest()
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'speedtest' ? 'bg-fuchsia-500/20 text-fuchsia-300 shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Speed Test
          </button>
        </div>

        {/* HUD & Volume */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 bg-gray-900/90 border border-gray-800 px-3.5 py-1.5 rounded-xl text-xs font-mono">
            <div>
              <span className="text-gray-500 mr-1.5">WPM:</span>
              <span className="text-cyan-400 font-bold">{wpm}</span>
            </div>
            <div className="w-px h-3 bg-gray-700" />
            <div>
              <span className="text-gray-500 mr-1.5">Strokes:</span>
              <span className="text-purple-400 font-bold">{keystrokeCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 transition-colors"
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
              className="w-16 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* 3D Canvas Area */}
        <div className="flex-1 h-full relative">
          <Keyboard3D
            colorway={activeColorway}
            activeKeys={activeKeys}
            onKeyPress={handle3DKeyClick}
            explodeAmount={explodeAmount}
            rgbMode={rgbMode}
            artisanEsc={artisanEsc}
            lastPressedKeyPos={lastPressedKeyPos}
          />

          {/* Sandbox Typing Stream Overlay */}
          {mode === 'sandbox' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-950/80 backdrop-blur-md border border-gray-800/90 px-6 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-lg pointer-events-none">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
              <span className="text-xs text-gray-500 uppercase font-mono">Stream:</span>
              <span className="text-sm font-mono text-cyan-300 font-medium tracking-wide truncate">
                {typedBuffer || 'Type on keyboard to hear switch acoustics...'}
              </span>
            </div>
          )}

          {/* MonkeyType Speed Test Floating Overlay */}
          {mode === 'speedtest' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-xl bg-gray-950/90 backdrop-blur-xl border border-gray-800/90 p-5 rounded-2xl shadow-2xl z-10">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-gray-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Type the passage below:
                </span>
                <button
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.blur()
                    resetSpeedTest()
                  }}
                  className="text-gray-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart
                </button>
              </div>

              {/* Character by character stream with visible whitespace support */}
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/80 font-mono text-base tracking-wide leading-relaxed whitespace-pre-wrap select-none min-h-[5.5rem]">
                {targetParagraph.split('').map((char, index) => {
                  let colorClass = 'text-gray-500'
                  const isCurrent = index === testInput.length

                  if (index < testInput.length) {
                    colorClass = testInput[index] === char ? 'text-green-400 font-bold' : 'text-red-400 bg-red-500/25 rounded px-0.5'
                  } else if (isCurrent) {
                    colorClass = 'text-cyan-300 bg-cyan-500/20 rounded px-0.5 border-b-2 border-cyan-400 animate-pulse'
                  }

                  return (
                    <span key={index} className={`${colorClass} transition-colors inline-block`}>
                      {char === ' ' ? (isCurrent ? '␣' : ' ') : char}
                    </span>
                  )
                })}
              </div>

              {/* Speed Test Results Modal */}
              {testCompleted && testStats && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                        Test Finished! <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </h3>
                      <div className="flex gap-4 text-xs font-mono mt-1 text-gray-300">
                        <span>Speed: <strong className="text-cyan-400 text-sm">{testStats.wpm} WPM</strong></span>
                        <span>Accuracy: <strong className="text-green-400 text-sm">{testStats.accuracy}%</strong></span>
                        <span>Time: <strong>{testStats.time}s</strong></span>
                      </div>
                    </div>
                  </div>
                  <button
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur()
                      resetSpeedTest()
                    }}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" /> Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Exploded Teardown Floating Control */}
          <div className="absolute bottom-4 left-4 bg-gray-950/85 backdrop-blur-md border border-gray-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 z-10">
            <Layers className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
                <span>3D EXPLODED TEARDOWN</span>
                <span className="text-cyan-400 font-bold">{Math.round(explodeAmount * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={explodeAmount}
                onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                className="w-44 accent-cyan-400 cursor-pointer"
              />
            </div>
            <button
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur()
                setExplodeAmount(explodeAmount > 0.1 ? 0 : 0.85)
              }}
              className="text-[11px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded font-mono transition-colors"
            >
              {explodeAmount > 0.1 ? 'Assemble' : 'Explode'}
            </button>
          </div>
        </div>

        {/* Right Configurator Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-gray-800/80 bg-gray-950/95 backdrop-blur-xl p-5 overflow-y-auto space-y-5 z-10 flex-shrink-0">
          {/* Switch Acoustics Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Switch Acoustics
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {currentSwitch.feel}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(SWITCH_PROFILES) as SwitchType[]).map((st) => {
                const s = SWITCH_PROFILES[st]
                const isSelected = activeSwitch === st
                return (
                  <button
                    key={st}
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur()
                      setActiveSwitch(st)
                      soundEngine.playSwitch(st, volume, false, activeMod)
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-gray-900/40 border-gray-800/60 hover:bg-gray-900/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {s.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: s.accentColor }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Keyboard Acoustic Mods (Tape Mod / PE Foam) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Acoustic Mod Profile
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {currentMod.tag}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(ACOUSTIC_MODS) as AcousticMod[]).map((m) => {
                const isSelected = activeMod === m
                return (
                  <button
                    key={m}
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur()
                      setActiveMod(m)
                      soundEngine.playSwitch(activeSwitch, volume, false, m)
                    }}
                    className={`py-2 px-2 text-center rounded-xl border transition-all text-xs font-medium ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                        : 'bg-gray-900/40 border-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-900/80'
                    }`}
                  >
                    {m === 'stock' ? 'Stock Case' : m === 'tape-mod' ? 'Tape Mod' : 'PE Foam'}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">{currentMod.description}</p>
          </div>

          {/* RGB Dynamic Lighting Selector */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              Per-Key RGB Lighting
            </h2>

            <div className="grid grid-cols-4 gap-1.5">
              {(['ripple', 'rainbow', 'breathing', 'static'] as RgbMode[]).map((m) => {
                const isSelected = rgbMode === m
                return (
                  <button
                    key={m}
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur()
                      setRgbMode(m)
                    }}
                    className={`py-1.5 px-2 text-center rounded-lg border text-xs capitalize transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                        : 'bg-gray-900/40 border-gray-800/60 text-gray-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Artisan ESC Key Sculpt */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-fuchsia-400" />
              ESC Key Artisan
            </h2>

            <div className="flex gap-2">
              <button
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur()
                  setArtisanEsc('gemstone')
                }}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  artisanEsc === 'gemstone'
                    ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300 font-semibold'
                    : 'bg-gray-900/40 border-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                💎 Cyber Crystal
              </button>
              <button
                tabIndex={-1}
                onClick={(e) => {
                  e.currentTarget.blur()
                  setArtisanEsc('standard')
                }}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  artisanEsc === 'standard'
                    ? 'bg-gray-800 border-gray-600 text-white font-semibold'
                    : 'bg-gray-900/40 border-gray-800/60 text-gray-400 hover:text-white'
                }`}
              >
                Classic PBT
              </button>
            </div>
          </div>

          {/* Colorway / Keycaps Theme */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Keycap Colorway
            </h2>

            <div className="grid grid-cols-1 gap-1.5">
              {COLORWAYS.map((c) => {
                const isSelected = activeColorway.id === c.id
                return (
                  <button
                    key={c.id}
                    tabIndex={-1}
                    onClick={(e) => {
                      e.currentTarget.blur()
                      setActiveColorway(c)
                    }}
                    className={`w-full p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-gray-900 border-purple-500/50 shadow-md shadow-purple-500/10'
                        : 'bg-gray-900/40 border-gray-800/60 hover:bg-gray-900/80 hover:border-gray-700'
                    }`}
                  >
                    <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {c.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: c.alphaBg }} />
                      <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: c.modBg }} />
                      <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: c.accentBg }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
