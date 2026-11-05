// Web Audio API Procedural Switch & Acoustic Mod Synthesizer
// Produces real-time, zero-latency mechanical keyboard acoustics without external MP3 assets

export type SwitchType = 'holy-panda' | 'gateron-yellow' | 'cherry-blue' | 'oil-king' | 'topre'
export type AcousticMod = 'stock' | 'tape-mod' | 'pe-foam'

export interface SwitchProfile {
  id: SwitchType
  name: string
  feel: 'Tactile' | 'Linear' | 'Clicky' | 'Electro-Capacitive'
  description: string
  accentColor: string
  baseFreq: number
  clickSharpness: number
  thockDepth: number
}

export const SWITCH_PROFILES: Record<SwitchType, SwitchProfile> = {
  'holy-panda': {
    id: 'holy-panda',
    name: 'Holy Panda (Tactile Thock)',
    feel: 'Tactile',
    description: 'Iconic rounded tactile bump with a pronounced, deep hollow bottom-out clack.',
    accentColor: '#f59e0b',
    baseFreq: 180,
    clickSharpness: 0.4,
    thockDepth: 0.85
  },
  'gateron-yellow': {
    id: 'gateron-yellow',
    name: 'Gateron Yellow (Creamy Linear)',
    feel: 'Linear',
    description: 'Smooth, buttery linear actuation with soft, marbly sound acoustics.',
    accentColor: '#eab308',
    baseFreq: 220,
    clickSharpness: 0.25,
    thockDepth: 0.7
  },
  'cherry-blue': {
    id: 'cherry-blue',
    name: 'Cherry MX Blue (Crisp Clicky)',
    feel: 'Clicky',
    description: 'High-pitched metal leaf click mechanism with sharp mechanical spring resonance.',
    accentColor: '#0ea5e9',
    baseFreq: 320,
    clickSharpness: 0.95,
    thockDepth: 0.35
  },
  'oil-king': {
    id: 'oil-king',
    name: 'Gateron Oil King (Deep Poppy)',
    feel: 'Linear',
    description: 'Factory-lubed nylon housing providing ultra-deep acoustic thock.',
    accentColor: '#10b981',
    baseFreq: 140,
    clickSharpness: 0.2,
    thockDepth: 0.95
  },
  'topre': {
    id: 'topre',
    name: 'Topre 45g (Silent Dome)',
    feel: 'Electro-Capacitive',
    description: 'Electro-capacitive rubber dome giving a gentle, satisfying raindrop thud.',
    accentColor: '#a855f7',
    baseFreq: 110,
    clickSharpness: 0.1,
    thockDepth: 0.9
  }
}

export const ACOUSTIC_MODS: Record<AcousticMod, { name: string; description: string; tag: string }> = {
  'stock': {
    name: 'Stock Case',
    description: 'Open, resonant aluminum case with natural hollow acoustic reverberation.',
    tag: 'Raw Clack'
  },
  'tape-mod': {
    name: 'Tempest Tape Mod (3 Layers)',
    description: 'Masking tape applied to PCB acting as low-pass filter, creating a poppy, rounded profile.',
    tag: 'Deep Pop'
  },
  'pe-foam': {
    name: 'PE Foam Mod (Marbly)',
    description: 'Polyethylene switch pad sheet dampening vibrations into an ultra-satisfying raindrop thock.',
    tag: 'Creamy Marbly'
  }
}

class SoundEngine {
  private ctx: AudioContext | null = null

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playSwitch(
    switchType: SwitchType,
    volume = 0.85,
    isSpacebar = false,
    mod: AcousticMod = 'stock'
  ) {
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const profile = SWITCH_PROFILES[switchType]
    const pitchMod = isSpacebar ? 0.65 : 0.96 + Math.random() * 0.08

    // 1. Bottom-Out Thock Resonance (Low Frequency Body)
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    const lowFilter = this.ctx.createBiquadFilter()

    osc.type = isSpacebar ? 'triangle' : 'sine'

    // Adjust frequencies based on acoustic foam / tape mods
    let baseFreq = profile.baseFreq * pitchMod
    let filterCutoff = isSpacebar ? 450 : 800
    let duration = isSpacebar ? 0.12 : 0.07

    if (mod === 'tape-mod') {
      baseFreq *= 0.88 // deeper pitch
      filterCutoff = isSpacebar ? 360 : 620 // warmer low pass
      duration *= 1.2 // slightly longer resonant decay
    } else if (mod === 'pe-foam') {
      baseFreq *= 1.15 // distinct marble pop
      filterCutoff = isSpacebar ? 520 : 950 // crisp marble clarity
      duration *= 0.85 // compact tight pop
    }

    const startFreq = baseFreq * (1.8 + profile.thockDepth)
    const endFreq = baseFreq * 0.75

    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + 0.04)

    lowFilter.type = 'lowpass'
    lowFilter.frequency.setValueAtTime(filterCutoff, now)

    const thockVol = volume * (0.4 + profile.thockDepth * 0.5) * (isSpacebar ? 1.4 : 1.0)
    oscGain.gain.setValueAtTime(thockVol, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.connect(lowFilter)
    lowFilter.connect(oscGain)
    oscGain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.2)

    // 2. High-Frequency Mechanical Transient Click / Snap
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.03)
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = noiseBuffer

    const noiseFilter = this.ctx.createBiquadFilter()
    noiseFilter.type = profile.clickSharpness > 0.6 ? 'highpass' : 'bandpass'

    let clickFreq = profile.clickSharpness > 0.6 ? 2400 : 1200 + profile.clickSharpness * 800
    if (mod === 'tape-mod') clickFreq *= 0.8
    if (mod === 'pe-foam') clickFreq *= 1.25

    noiseFilter.frequency.setValueAtTime(clickFreq, now)
    noiseFilter.Q.setValueAtTime(profile.clickSharpness * 5 + 1.5, now)

    const noiseGain = this.ctx.createGain()
    const clickVol = volume * (0.2 + profile.clickSharpness * 0.7) * (mod === 'tape-mod' ? 0.75 : 1.0)
    noiseGain.gain.setValueAtTime(clickVol, now)
    noiseGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + (profile.clickSharpness > 0.6 ? 0.04 : 0.02)
    )

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + 0.05)

    // 3. Stabilizer Wire Clack (Spacebar, Enter, Backspace)
    if (isSpacebar) {
      const stabOsc = this.ctx.createOscillator()
      const stabGain = this.ctx.createGain()
      stabOsc.type = 'square'
      stabOsc.frequency.setValueAtTime(320, now)
      stabOsc.frequency.exponentialRampToValueAtTime(120, now + 0.03)

      stabGain.gain.setValueAtTime(volume * 0.15, now)
      stabGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      stabOsc.connect(stabGain)
      stabGain.connect(this.ctx.destination)
      stabOsc.start(now)
      stabOsc.stop(now + 0.04)
    }
  }

  playErrorSound(volume = 0.5) {
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.setValueAtTime(110, now + 0.05)

    gain.gain.setValueAtTime(volume * 0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  }
}

export const soundEngine = new SoundEngine()
