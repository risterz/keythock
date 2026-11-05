export interface KeyData {
  id: string
  code: string
  label: string
  width: number // 1 = 1u, 1.5 = 1.5u, etc.
  row: number
  col: number
  gapBefore?: number
  isModifier?: boolean
  isSpecial?: boolean
}

export type RgbMode = 'rainbow' | 'ripple' | 'breathing' | 'static' | 'off'
export type ArtisanEsc = 'standard' | 'gemstone' | 'cyber-skull'

export interface Colorway {
  id: string
  name: string
  caseColor: string
  caseMaterial: 'matte' | 'metal' | 'frosted'
  alphaBg: string
  alphaText: string
  modBg: string
  modText: string
  accentBg: string
  accentText: string
  underglowColor: string
}

export const COLORWAYS: Colorway[] = [
  {
    id: 'cyber-neon',
    name: 'Cyberpunk 2077',
    caseColor: '#0a0d14',
    caseMaterial: 'metal',
    alphaBg: '#131826',
    alphaText: '#00f5ff',
    modBg: '#1f132e',
    modText: '#ff007f',
    accentBg: '#ff007f',
    accentText: '#ffffff',
    underglowColor: '#00f5ff'
  },
  {
    id: 'retro-beige',
    name: 'IBM Model M (1984)',
    caseColor: '#d6cfc7',
    caseMaterial: 'matte',
    alphaBg: '#ede8e1',
    alphaText: '#2e2b2a',
    modBg: '#c2b8ad',
    modText: '#1f1d1c',
    accentBg: '#c93434',
    accentText: '#ffffff',
    underglowColor: '#ffe8c2'
  },
  {
    id: 'botanical',
    name: 'Botanical Sage',
    caseColor: '#17231c',
    caseMaterial: 'matte',
    alphaBg: '#d8e2dc',
    alphaText: '#23382c',
    modBg: '#344e41',
    modText: '#e9ecef',
    accentBg: '#588157',
    accentText: '#ffffff',
    underglowColor: '#a3b18a'
  },
  {
    id: 'dracula',
    name: 'Dracula Dark',
    caseColor: '#1e1f29',
    caseMaterial: 'matte',
    alphaBg: '#282a36',
    alphaText: '#f8f8f2',
    modBg: '#44475a',
    modText: '#8be9fd',
    accentBg: '#bd93f9',
    accentText: '#282a36',
    underglowColor: '#bd93f9'
  },
  {
    id: 'solarized-amber',
    name: 'Amber Glow',
    caseColor: '#120d08',
    caseMaterial: 'metal',
    alphaBg: '#2b1d0c',
    alphaText: '#ffb703',
    modBg: '#3d260f',
    modText: '#fb8500',
    accentBg: '#d62828',
    accentText: '#ffffff',
    underglowColor: '#fb8500'
  }
]

export const TYPING_TEST_PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog while mechanical switches clack in rhythm.",
  "Custom mechanical keyboards combine tactile feel, acoustics, and engineering into one desk centerpiece.",
  "Lubed linear switches with poron gaskets and brass plates produce the deep thock sound enthusiasts adore.",
  "High quality keycaps molded with thick PBT plastic resist shine and deliver crisp acoustic resonance."
]

export const UNIT_SIZE = 0.92
export const KEY_GAP = 0.06

export type KeyboardLayoutType = '60' | '64' | '65' | '75' | 'tkl'

export interface Key3DPosition {
  key: KeyData
  x: number
  z: number
  width: number
}

export interface KeyboardLayoutConfig {
  id: KeyboardLayoutType
  name: string
  shortLabel: string
  keysCount: number
  tagline: string
  caseWidth: number
  caseDepth: number
  cameraZ: number
  keys: KeyData[]
  positions: Key3DPosition[]
  positionMap: Map<string, Key3DPosition>
  codeMap: Map<string, KeyData>
}

// Compute accurate 3D positions for a specific layout
export function computeLayoutPositions(
  keys: KeyData[],
  startX: number,
  rowZOffsets: number[]
): Key3DPosition[] {
  const positions: Key3DPosition[] = []
  const maxRow = Math.max(...keys.map(k => k.row))

  for (let r = 0; r <= maxRow; r++) {
    const keysInRow = keys.filter(k => k.row === r).sort((a, b) => a.col - b.col)
    let currentX = startX

    keysInRow.forEach(k => {
      if (k.gapBefore) {
        currentX += k.gapBefore * UNIT_SIZE
      }
      const keyWidth = k.width * UNIT_SIZE + (k.width - 1) * KEY_GAP
      const posX = currentX + keyWidth / 2
      positions.push({
        key: k,
        x: posX,
        z: rowZOffsets[r] || 0,
        width: keyWidth
      })
      currentX += keyWidth + KEY_GAP
    })
  }

  return positions
}

// -------------------------------------------------------------
// 1. 60% Classic ANSI (61 Keys)
// -------------------------------------------------------------
const LAYOUT_60_KEYS: KeyData[] = [
  // Row 0
  { id: 'Escape', code: 'Escape', label: 'ESC', width: 1, row: 0, col: 0, isSpecial: true },
  { id: 'Digit1', code: 'Digit1', label: '1', width: 1, row: 0, col: 1 },
  { id: 'Digit2', code: 'Digit2', label: '2', width: 1, row: 0, col: 2 },
  { id: 'Digit3', code: 'Digit3', label: '3', width: 1, row: 0, col: 3 },
  { id: 'Digit4', code: 'Digit4', label: '4', width: 1, row: 0, col: 4 },
  { id: 'Digit5', code: 'Digit5', label: '5', width: 1, row: 0, col: 5 },
  { id: 'Digit6', code: 'Digit6', label: '6', width: 1, row: 0, col: 6 },
  { id: 'Digit7', code: 'Digit7', label: '7', width: 1, row: 0, col: 7 },
  { id: 'Digit8', code: 'Digit8', label: '8', width: 1, row: 0, col: 8 },
  { id: 'Digit9', code: 'Digit9', label: '9', width: 1, row: 0, col: 9 },
  { id: 'Digit0', code: 'Digit0', label: '0', width: 1, row: 0, col: 10 },
  { id: 'Minus', code: 'Minus', label: '-', width: 1, row: 0, col: 11 },
  { id: 'Equal', code: 'Equal', label: '=', width: 1, row: 0, col: 12 },
  { id: 'Backspace', code: 'Backspace', label: 'BACK', width: 2, row: 0, col: 13, isModifier: true },

  // Row 1
  { id: 'Tab', code: 'Tab', label: 'TAB', width: 1.5, row: 1, col: 0, isModifier: true },
  { id: 'KeyQ', code: 'KeyQ', label: 'Q', width: 1, row: 1, col: 1 },
  { id: 'KeyW', code: 'KeyW', label: 'W', width: 1, row: 1, col: 2 },
  { id: 'KeyE', code: 'KeyE', label: 'E', width: 1, row: 1, col: 3 },
  { id: 'KeyR', code: 'KeyR', label: 'R', width: 1, row: 1, col: 4 },
  { id: 'KeyT', code: 'KeyT', label: 'T', width: 1, row: 1, col: 5 },
  { id: 'KeyY', code: 'KeyY', label: 'Y', width: 1, row: 1, col: 6 },
  { id: 'KeyU', code: 'KeyU', label: 'U', width: 1, row: 1, col: 7 },
  { id: 'KeyI', code: 'KeyI', label: 'I', width: 1, row: 1, col: 8 },
  { id: 'KeyO', code: 'KeyO', label: 'O', width: 1, row: 1, col: 9 },
  { id: 'KeyP', code: 'KeyP', label: 'P', width: 1, row: 1, col: 10 },
  { id: 'BracketLeft', code: 'BracketLeft', label: '[', width: 1, row: 1, col: 11 },
  { id: 'BracketRight', code: 'BracketRight', label: ']', width: 1, row: 1, col: 12 },
  { id: 'Backslash', code: 'Backslash', label: '\\', width: 1.5, row: 1, col: 13, isModifier: true },

  // Row 2
  { id: 'CapsLock', code: 'CapsLock', label: 'CAPS', width: 1.75, row: 2, col: 0, isModifier: true },
  { id: 'KeyA', code: 'KeyA', label: 'A', width: 1, row: 2, col: 1 },
  { id: 'KeyS', code: 'KeyS', label: 'S', width: 1, row: 2, col: 2 },
  { id: 'KeyD', code: 'KeyD', label: 'D', width: 1, row: 2, col: 3 },
  { id: 'KeyF', code: 'KeyF', label: 'F', width: 1, row: 2, col: 4 },
  { id: 'KeyG', code: 'KeyG', label: 'G', width: 1, row: 2, col: 5 },
  { id: 'KeyH', code: 'KeyH', label: 'H', width: 1, row: 2, col: 6 },
  { id: 'KeyJ', code: 'KeyJ', label: 'J', width: 1, row: 2, col: 7 },
  { id: 'KeyK', code: 'KeyK', label: 'K', width: 1, row: 2, col: 8 },
  { id: 'KeyL', code: 'KeyL', label: 'L', width: 1, row: 2, col: 9 },
  { id: 'Semicolon', code: 'Semicolon', label: ';', width: 1, row: 2, col: 10 },
  { id: 'Quote', code: 'Quote', label: '\'', width: 1, row: 2, col: 11 },
  { id: 'Enter', code: 'Enter', label: 'ENTER', width: 2.25, row: 2, col: 12, isSpecial: true },

  // Row 3
  { id: 'ShiftLeft', code: 'ShiftLeft', label: 'SHIFT', width: 2.25, row: 3, col: 0, isModifier: true },
  { id: 'KeyZ', code: 'KeyZ', label: 'Z', width: 1, row: 3, col: 1 },
  { id: 'KeyX', code: 'KeyX', label: 'X', width: 1, row: 3, col: 2 },
  { id: 'KeyC', code: 'KeyC', label: 'C', width: 1, row: 3, col: 3 },
  { id: 'KeyV', code: 'KeyV', label: 'V', width: 1, row: 3, col: 4 },
  { id: 'KeyB', code: 'KeyB', label: 'B', width: 1, row: 3, col: 5 },
  { id: 'KeyN', code: 'KeyN', label: 'N', width: 1, row: 3, col: 6 },
  { id: 'KeyM', code: 'KeyM', label: 'M', width: 1, row: 3, col: 7 },
  { id: 'Comma', code: 'Comma', label: ',', width: 1, row: 3, col: 8 },
  { id: 'Period', code: 'Period', label: '.', width: 1, row: 3, col: 9 },
  { id: 'Slash', code: 'Slash', label: '/', width: 1, row: 3, col: 10 },
  { id: 'ShiftRight', code: 'ShiftRight', label: 'SHIFT', width: 2.75, row: 3, col: 11, isModifier: true },

  // Row 4
  { id: 'ControlLeft', code: 'ControlLeft', label: 'CTRL', width: 1.25, row: 4, col: 0, isModifier: true },
  { id: 'MetaLeft', code: 'MetaLeft', label: 'WIN', width: 1.25, row: 4, col: 1, isModifier: true },
  { id: 'AltLeft', code: 'AltLeft', label: 'ALT', width: 1.25, row: 4, col: 2, isModifier: true },
  { id: 'Space', code: 'Space', label: '', width: 6.25, row: 4, col: 3, isSpecial: true },
  { id: 'AltRight', code: 'AltRight', label: 'ALT', width: 1.25, row: 4, col: 4, isModifier: true },
  { id: 'MetaRight', code: 'MetaRight', label: 'FN', width: 1.25, row: 4, col: 5, isModifier: true },
  { id: 'ControlRight', code: 'ControlRight', label: 'CTRL', width: 1.25, row: 4, col: 6, isModifier: true }
]

// -------------------------------------------------------------
// 2. 64% Compact Arrows (64 Keys) - Famous GK64/DZ64 layout
// -------------------------------------------------------------
const LAYOUT_64_KEYS: KeyData[] = [
  // Row 0
  { id: 'Escape', code: 'Escape', label: 'ESC', width: 1, row: 0, col: 0, isSpecial: true },
  { id: 'Digit1', code: 'Digit1', label: '1', width: 1, row: 0, col: 1 },
  { id: 'Digit2', code: 'Digit2', label: '2', width: 1, row: 0, col: 2 },
  { id: 'Digit3', code: 'Digit3', label: '3', width: 1, row: 0, col: 3 },
  { id: 'Digit4', code: 'Digit4', label: '4', width: 1, row: 0, col: 4 },
  { id: 'Digit5', code: 'Digit5', label: '5', width: 1, row: 0, col: 5 },
  { id: 'Digit6', code: 'Digit6', label: '6', width: 1, row: 0, col: 6 },
  { id: 'Digit7', code: 'Digit7', label: '7', width: 1, row: 0, col: 7 },
  { id: 'Digit8', code: 'Digit8', label: '8', width: 1, row: 0, col: 8 },
  { id: 'Digit9', code: 'Digit9', label: '9', width: 1, row: 0, col: 9 },
  { id: 'Digit0', code: 'Digit0', label: '0', width: 1, row: 0, col: 10 },
  { id: 'Minus', code: 'Minus', label: '-', width: 1, row: 0, col: 11 },
  { id: 'Equal', code: 'Equal', label: '=', width: 1, row: 0, col: 12 },
  { id: 'Backspace', code: 'Backspace', label: 'BACK', width: 2, row: 0, col: 13, isModifier: true },

  // Row 1
  { id: 'Tab', code: 'Tab', label: 'TAB', width: 1.5, row: 1, col: 0, isModifier: true },
  { id: 'KeyQ', code: 'KeyQ', label: 'Q', width: 1, row: 1, col: 1 },
  { id: 'KeyW', code: 'KeyW', label: 'W', width: 1, row: 1, col: 2 },
  { id: 'KeyE', code: 'KeyE', label: 'E', width: 1, row: 1, col: 3 },
  { id: 'KeyR', code: 'KeyR', label: 'R', width: 1, row: 1, col: 4 },
  { id: 'KeyT', code: 'KeyT', label: 'T', width: 1, row: 1, col: 5 },
  { id: 'KeyY', code: 'KeyY', label: 'Y', width: 1, row: 1, col: 6 },
  { id: 'KeyU', code: 'KeyU', label: 'U', width: 1, row: 1, col: 7 },
  { id: 'KeyI', code: 'KeyI', label: 'I', width: 1, row: 1, col: 8 },
  { id: 'KeyO', code: 'KeyO', label: 'O', width: 1, row: 1, col: 9 },
  { id: 'KeyP', code: 'KeyP', label: 'P', width: 1, row: 1, col: 10 },
  { id: 'BracketLeft', code: 'BracketLeft', label: '[', width: 1, row: 1, col: 11 },
  { id: 'BracketRight', code: 'BracketRight', label: ']', width: 1, row: 1, col: 12 },
  { id: 'Backslash', code: 'Backslash', label: '\\', width: 1.5, row: 1, col: 13, isModifier: true },

  // Row 2
  { id: 'CapsLock', code: 'CapsLock', label: 'CAPS', width: 1.75, row: 2, col: 0, isModifier: true },
  { id: 'KeyA', code: 'KeyA', label: 'A', width: 1, row: 2, col: 1 },
  { id: 'KeyS', code: 'KeyS', label: 'S', width: 1, row: 2, col: 2 },
  { id: 'KeyD', code: 'KeyD', label: 'D', width: 1, row: 2, col: 3 },
  { id: 'KeyF', code: 'KeyF', label: 'F', width: 1, row: 2, col: 4 },
  { id: 'KeyG', code: 'KeyG', label: 'G', width: 1, row: 2, col: 5 },
  { id: 'KeyH', code: 'KeyH', label: 'H', width: 1, row: 2, col: 6 },
  { id: 'KeyJ', code: 'KeyJ', label: 'J', width: 1, row: 2, col: 7 },
  { id: 'KeyK', code: 'KeyK', label: 'K', width: 1, row: 2, col: 8 },
  { id: 'KeyL', code: 'KeyL', label: 'L', width: 1, row: 2, col: 9 },
  { id: 'Semicolon', code: 'Semicolon', label: ';', width: 1, row: 2, col: 10 },
  { id: 'Quote', code: 'Quote', label: '\'', width: 1, row: 2, col: 11 },
  { id: 'Enter', code: 'Enter', label: 'ENTER', width: 2.25, row: 2, col: 12, isSpecial: true },

  // Row 3 (2.0u Left Shift, dedicated 1u arrows & Delete)
  { id: 'ShiftLeft', code: 'ShiftLeft', label: 'SHIFT', width: 2.0, row: 3, col: 0, isModifier: true },
  { id: 'KeyZ', code: 'KeyZ', label: 'Z', width: 1, row: 3, col: 1 },
  { id: 'KeyX', code: 'KeyX', label: 'X', width: 1, row: 3, col: 2 },
  { id: 'KeyC', code: 'KeyC', label: 'C', width: 1, row: 3, col: 3 },
  { id: 'KeyV', code: 'KeyV', label: 'V', width: 1, row: 3, col: 4 },
  { id: 'KeyB', code: 'KeyB', label: 'B', width: 1, row: 3, col: 5 },
  { id: 'KeyN', code: 'KeyN', label: 'N', width: 1, row: 3, col: 6 },
  { id: 'KeyM', code: 'KeyM', label: 'M', width: 1, row: 3, col: 7 },
  { id: 'Comma', code: 'Comma', label: ',', width: 1, row: 3, col: 8 },
  { id: 'Period', code: 'Period', label: '.', width: 1, row: 3, col: 9 },
  { id: 'Slash', code: 'Slash', label: '/', width: 1, row: 3, col: 10 },
  { id: 'ShiftRight', code: 'ShiftRight', label: 'SHIFT', width: 1.0, row: 3, col: 11, isModifier: true },
  { id: 'ArrowUp', code: 'ArrowUp', label: '▲', width: 1.0, row: 3, col: 12, isSpecial: true },
  { id: 'Delete', code: 'Delete', label: 'DEL', width: 1.0, row: 3, col: 13, isModifier: true },

  // Row 4 (Compact bottom row with arrows)
  { id: 'ControlLeft', code: 'ControlLeft', label: 'CTRL', width: 1.25, row: 4, col: 0, isModifier: true },
  { id: 'MetaLeft', code: 'MetaLeft', label: 'WIN', width: 1.25, row: 4, col: 1, isModifier: true },
  { id: 'AltLeft', code: 'AltLeft', label: 'ALT', width: 1.25, row: 4, col: 2, isModifier: true },
  { id: 'Space', code: 'Space', label: '', width: 6.25, row: 4, col: 3, isSpecial: true },
  { id: 'AltRight', code: 'AltRight', label: 'ALT', width: 1.0, row: 4, col: 4, isModifier: true },
  { id: 'MetaRight', code: 'MetaRight', label: 'FN', width: 1.0, row: 4, col: 5, isModifier: true },
  { id: 'ArrowLeft', code: 'ArrowLeft', label: '◀', width: 1.0, row: 4, col: 6, isSpecial: true },
  { id: 'ArrowDown', code: 'ArrowDown', label: '▼', width: 1.0, row: 4, col: 7, isSpecial: true },
  { id: 'ArrowRight', code: 'ArrowRight', label: '▶', width: 1.0, row: 4, col: 8, isSpecial: true }
]

// -------------------------------------------------------------
// 3. 65% Streamlined (68 Keys)
// -------------------------------------------------------------
const LAYOUT_65_KEYS: KeyData[] = [
  // Row 0
  { id: 'Escape', code: 'Escape', label: 'ESC', width: 1, row: 0, col: 0, isSpecial: true },
  { id: 'Digit1', code: 'Digit1', label: '1', width: 1, row: 0, col: 1 },
  { id: 'Digit2', code: 'Digit2', label: '2', width: 1, row: 0, col: 2 },
  { id: 'Digit3', code: 'Digit3', label: '3', width: 1, row: 0, col: 3 },
  { id: 'Digit4', code: 'Digit4', label: '4', width: 1, row: 0, col: 4 },
  { id: 'Digit5', code: 'Digit5', label: '5', width: 1, row: 0, col: 5 },
  { id: 'Digit6', code: 'Digit6', label: '6', width: 1, row: 0, col: 6 },
  { id: 'Digit7', code: 'Digit7', label: '7', width: 1, row: 0, col: 7 },
  { id: 'Digit8', code: 'Digit8', label: '8', width: 1, row: 0, col: 8 },
  { id: 'Digit9', code: 'Digit9', label: '9', width: 1, row: 0, col: 9 },
  { id: 'Digit0', code: 'Digit0', label: '0', width: 1, row: 0, col: 10 },
  { id: 'Minus', code: 'Minus', label: '-', width: 1, row: 0, col: 11 },
  { id: 'Equal', code: 'Equal', label: '=', width: 1, row: 0, col: 12 },
  { id: 'Backspace', code: 'Backspace', label: 'BACK', width: 2, row: 0, col: 13, isModifier: true },
  { id: 'Delete', code: 'Delete', label: 'DEL', width: 1, row: 0, col: 14, isModifier: true },

  // Row 1
  { id: 'Tab', code: 'Tab', label: 'TAB', width: 1.5, row: 1, col: 0, isModifier: true },
  { id: 'KeyQ', code: 'KeyQ', label: 'Q', width: 1, row: 1, col: 1 },
  { id: 'KeyW', code: 'KeyW', label: 'W', width: 1, row: 1, col: 2 },
  { id: 'KeyE', code: 'KeyE', label: 'E', width: 1, row: 1, col: 3 },
  { id: 'KeyR', code: 'KeyR', label: 'R', width: 1, row: 1, col: 4 },
  { id: 'KeyT', code: 'KeyT', label: 'T', width: 1, row: 1, col: 5 },
  { id: 'KeyY', code: 'KeyY', label: 'Y', width: 1, row: 1, col: 6 },
  { id: 'KeyU', code: 'KeyU', label: 'U', width: 1, row: 1, col: 7 },
  { id: 'KeyI', code: 'KeyI', label: 'I', width: 1, row: 1, col: 8 },
  { id: 'KeyO', code: 'KeyO', label: 'O', width: 1, row: 1, col: 9 },
  { id: 'KeyP', code: 'KeyP', label: 'P', width: 1, row: 1, col: 10 },
  { id: 'BracketLeft', code: 'BracketLeft', label: '[', width: 1, row: 1, col: 11 },
  { id: 'BracketRight', code: 'BracketRight', label: ']', width: 1, row: 1, col: 12 },
  { id: 'Backslash', code: 'Backslash', label: '\\', width: 1.5, row: 1, col: 13, isModifier: true },
  { id: 'PageUp', code: 'PageUp', label: 'PGUP', width: 1, row: 1, col: 14, isModifier: true },

  // Row 2
  { id: 'CapsLock', code: 'CapsLock', label: 'CAPS', width: 1.75, row: 2, col: 0, isModifier: true },
  { id: 'KeyA', code: 'KeyA', label: 'A', width: 1, row: 2, col: 1 },
  { id: 'KeyS', code: 'KeyS', label: 'S', width: 1, row: 2, col: 2 },
  { id: 'KeyD', code: 'KeyD', label: 'D', width: 1, row: 2, col: 3 },
  { id: 'KeyF', code: 'KeyF', label: 'F', width: 1, row: 2, col: 4 },
  { id: 'KeyG', code: 'KeyG', label: 'G', width: 1, row: 2, col: 5 },
  { id: 'KeyH', code: 'KeyH', label: 'H', width: 1, row: 2, col: 6 },
  { id: 'KeyJ', code: 'KeyJ', label: 'J', width: 1, row: 2, col: 7 },
  { id: 'KeyK', code: 'KeyK', label: 'K', width: 1, row: 2, col: 8 },
  { id: 'KeyL', code: 'KeyL', label: 'L', width: 1, row: 2, col: 9 },
  { id: 'Semicolon', code: 'Semicolon', label: ';', width: 1, row: 2, col: 10 },
  { id: 'Quote', code: 'Quote', label: '\'', width: 1, row: 2, col: 11 },
  { id: 'Enter', code: 'Enter', label: 'ENTER', width: 2.25, row: 2, col: 12, isSpecial: true },
  { id: 'PageDown', code: 'PageDown', label: 'PGDN', width: 1, row: 2, col: 13, isModifier: true },

  // Row 3
  { id: 'ShiftLeft', code: 'ShiftLeft', label: 'SHIFT', width: 2.25, row: 3, col: 0, isModifier: true },
  { id: 'KeyZ', code: 'KeyZ', label: 'Z', width: 1, row: 3, col: 1 },
  { id: 'KeyX', code: 'KeyX', label: 'X', width: 1, row: 3, col: 2 },
  { id: 'KeyC', code: 'KeyC', label: 'C', width: 1, row: 3, col: 3 },
  { id: 'KeyV', code: 'KeyV', label: 'V', width: 1, row: 3, col: 4 },
  { id: 'KeyB', code: 'KeyB', label: 'B', width: 1, row: 3, col: 5 },
  { id: 'KeyN', code: 'KeyN', label: 'N', width: 1, row: 3, col: 6 },
  { id: 'KeyM', code: 'KeyM', label: 'M', width: 1, row: 3, col: 7 },
  { id: 'Comma', code: 'Comma', label: ',', width: 1, row: 3, col: 8 },
  { id: 'Period', code: 'Period', label: '.', width: 1, row: 3, col: 9 },
  { id: 'Slash', code: 'Slash', label: '/', width: 1, row: 3, col: 10 },
  { id: 'ShiftRight', code: 'ShiftRight', label: 'SHIFT', width: 1.75, row: 3, col: 11, isModifier: true },
  { id: 'ArrowUp', code: 'ArrowUp', label: '▲', width: 1, row: 3, col: 12, isSpecial: true },
  { id: 'End', code: 'End', label: 'END', width: 1, row: 3, col: 13, isModifier: true },

  // Row 4
  { id: 'ControlLeft', code: 'ControlLeft', label: 'CTRL', width: 1.25, row: 4, col: 0, isModifier: true },
  { id: 'MetaLeft', code: 'MetaLeft', label: 'WIN', width: 1.25, row: 4, col: 1, isModifier: true },
  { id: 'AltLeft', code: 'AltLeft', label: 'ALT', width: 1.25, row: 4, col: 2, isModifier: true },
  { id: 'Space', code: 'Space', label: '', width: 6.25, row: 4, col: 3, isSpecial: true },
  { id: 'AltRight', code: 'AltRight', label: 'ALT', width: 1.25, row: 4, col: 4, isModifier: true },
  { id: 'MetaRight', code: 'MetaRight', label: 'FN', width: 1.25, row: 4, col: 5, isModifier: true },
  { id: 'ArrowLeft', code: 'ArrowLeft', label: '◀', width: 1, row: 4, col: 6, isSpecial: true },
  { id: 'ArrowDown', code: 'ArrowDown', label: '▼', width: 1, row: 4, col: 7, isSpecial: true },
  { id: 'ArrowRight', code: 'ArrowRight', label: '▶', width: 1, row: 4, col: 8, isSpecial: true }
]

// -------------------------------------------------------------
// 4. 75% Compact (84 Keys) - With dedicated F-Row
// -------------------------------------------------------------
const LAYOUT_75_KEYS: KeyData[] = [
  // Row 0 (F-Row)
  { id: 'Escape', code: 'Escape', label: 'ESC', width: 1, row: 0, col: 0, isSpecial: true },
  { id: 'F1', code: 'F1', label: 'F1', width: 1, row: 0, col: 1 },
  { id: 'F2', code: 'F2', label: 'F2', width: 1, row: 0, col: 2 },
  { id: 'F3', code: 'F3', label: 'F3', width: 1, row: 0, col: 3 },
  { id: 'F4', code: 'F4', label: 'F4', width: 1, row: 0, col: 4 },
  { id: 'F5', code: 'F5', label: 'F5', width: 1, row: 0, col: 5 },
  { id: 'F6', code: 'F6', label: 'F6', width: 1, row: 0, col: 6 },
  { id: 'F7', code: 'F7', label: 'F7', width: 1, row: 0, col: 7 },
  { id: 'F8', code: 'F8', label: 'F8', width: 1, row: 0, col: 8 },
  { id: 'F9', code: 'F9', label: 'F9', width: 1, row: 0, col: 9 },
  { id: 'F10', code: 'F10', label: 'F10', width: 1, row: 0, col: 10 },
  { id: 'F11', code: 'F11', label: 'F11', width: 1, row: 0, col: 11 },
  { id: 'F12', code: 'F12', label: 'F12', width: 1, row: 0, col: 12 },
  { id: 'PrintScreen', code: 'PrintScreen', label: 'PRT', width: 1, row: 0, col: 13, isModifier: true },
  { id: 'Pause', code: 'Pause', label: 'PAUS', width: 1, row: 0, col: 14, isModifier: true },
  { id: 'Delete', code: 'Delete', label: 'DEL', width: 1, row: 0, col: 15, isModifier: true },

  // Row 1 (Numbers + Home)
  { id: 'Backquote', code: 'Backquote', label: '`', width: 1, row: 1, col: 0 },
  { id: 'Digit1', code: 'Digit1', label: '1', width: 1, row: 1, col: 1 },
  { id: 'Digit2', code: 'Digit2', label: '2', width: 1, row: 1, col: 2 },
  { id: 'Digit3', code: 'Digit3', label: '3', width: 1, row: 1, col: 3 },
  { id: 'Digit4', code: 'Digit4', label: '4', width: 1, row: 1, col: 4 },
  { id: 'Digit5', code: 'Digit5', label: '5', width: 1, row: 1, col: 5 },
  { id: 'Digit6', code: 'Digit6', label: '6', width: 1, row: 1, col: 6 },
  { id: 'Digit7', code: 'Digit7', label: '7', width: 1, row: 1, col: 7 },
  { id: 'Digit8', code: 'Digit8', label: '8', width: 1, row: 1, col: 8 },
  { id: 'Digit9', code: 'Digit9', label: '9', width: 1, row: 1, col: 9 },
  { id: 'Digit0', code: 'Digit0', label: '0', width: 1, row: 1, col: 10 },
  { id: 'Minus', code: 'Minus', label: '-', width: 1, row: 1, col: 11 },
  { id: 'Equal', code: 'Equal', label: '=', width: 1, row: 1, col: 12 },
  { id: 'Backspace', code: 'Backspace', label: 'BACK', width: 2, row: 1, col: 13, isModifier: true },
  { id: 'Home', code: 'Home', label: 'HOME', width: 1, row: 1, col: 14, isModifier: true },

  // Row 2 (Q-P + PgUp)
  { id: 'Tab', code: 'Tab', label: 'TAB', width: 1.5, row: 2, col: 0, isModifier: true },
  { id: 'KeyQ', code: 'KeyQ', label: 'Q', width: 1, row: 2, col: 1 },
  { id: 'KeyW', code: 'KeyW', label: 'W', width: 1, row: 2, col: 2 },
  { id: 'KeyE', code: 'KeyE', label: 'E', width: 1, row: 2, col: 3 },
  { id: 'KeyR', code: 'KeyR', label: 'R', width: 1, row: 2, col: 4 },
  { id: 'KeyT', code: 'KeyT', label: 'T', width: 1, row: 2, col: 5 },
  { id: 'KeyY', code: 'KeyY', label: 'Y', width: 1, row: 2, col: 6 },
  { id: 'KeyU', code: 'KeyU', label: 'U', width: 1, row: 2, col: 7 },
  { id: 'KeyI', code: 'KeyI', label: 'I', width: 1, row: 2, col: 8 },
  { id: 'KeyO', code: 'KeyO', label: 'O', width: 1, row: 2, col: 9 },
  { id: 'KeyP', code: 'KeyP', label: 'P', width: 1, row: 2, col: 10 },
  { id: 'BracketLeft', code: 'BracketLeft', label: '[', width: 1, row: 2, col: 11 },
  { id: 'BracketRight', code: 'BracketRight', label: ']', width: 1, row: 2, col: 12 },
  { id: 'Backslash', code: 'Backslash', label: '\\', width: 1.5, row: 2, col: 13, isModifier: true },
  { id: 'PageUp', code: 'PageUp', label: 'PGUP', width: 1, row: 2, col: 14, isModifier: true },

  // Row 3 (A-L + PgDn)
  { id: 'CapsLock', code: 'CapsLock', label: 'CAPS', width: 1.75, row: 3, col: 0, isModifier: true },
  { id: 'KeyA', code: 'KeyA', label: 'A', width: 1, row: 3, col: 1 },
  { id: 'KeyS', code: 'KeyS', label: 'S', width: 1, row: 3, col: 2 },
  { id: 'KeyD', code: 'KeyD', label: 'D', width: 1, row: 3, col: 3 },
  { id: 'KeyF', code: 'KeyF', label: 'F', width: 1, row: 3, col: 4 },
  { id: 'KeyG', code: 'KeyG', label: 'G', width: 1, row: 3, col: 5 },
  { id: 'KeyH', code: 'KeyH', label: 'H', width: 1, row: 3, col: 6 },
  { id: 'KeyJ', code: 'KeyJ', label: 'J', width: 1, row: 3, col: 7 },
  { id: 'KeyK', code: 'KeyK', label: 'K', width: 1, row: 3, col: 8 },
  { id: 'KeyL', code: 'KeyL', label: 'L', width: 1, row: 3, col: 9 },
  { id: 'Semicolon', code: 'Semicolon', label: ';', width: 1, row: 3, col: 10 },
  { id: 'Quote', code: 'Quote', label: '\'', width: 1, row: 3, col: 11 },
  { id: 'Enter', code: 'Enter', label: 'ENTER', width: 2.25, row: 3, col: 12, isSpecial: true },
  { id: 'PageDown', code: 'PageDown', label: 'PGDN', width: 1, row: 3, col: 13, isModifier: true },

  // Row 4 (Shift + Arrows + End)
  { id: 'ShiftLeft', code: 'ShiftLeft', label: 'SHIFT', width: 2.25, row: 4, col: 0, isModifier: true },
  { id: 'KeyZ', code: 'KeyZ', label: 'Z', width: 1, row: 4, col: 1 },
  { id: 'KeyX', code: 'KeyX', label: 'X', width: 1, row: 4, col: 2 },
  { id: 'KeyC', code: 'KeyC', label: 'C', width: 1, row: 4, col: 3 },
  { id: 'KeyV', code: 'KeyV', label: 'V', width: 1, row: 4, col: 4 },
  { id: 'KeyB', code: 'KeyB', label: 'B', width: 1, row: 4, col: 5 },
  { id: 'KeyN', code: 'KeyN', label: 'N', width: 1, row: 4, col: 6 },
  { id: 'KeyM', code: 'KeyM', label: 'M', width: 1, row: 4, col: 7 },
  { id: 'Comma', code: 'Comma', label: ',', width: 1, row: 4, col: 8 },
  { id: 'Period', code: 'Period', label: '.', width: 1, row: 4, col: 9 },
  { id: 'Slash', code: 'Slash', label: '/', width: 1, row: 4, col: 10 },
  { id: 'ShiftRight', code: 'ShiftRight', label: 'SHIFT', width: 1.75, row: 4, col: 11, isModifier: true },
  { id: 'ArrowUp', code: 'ArrowUp', label: '▲', width: 1, row: 4, col: 12, isSpecial: true },
  { id: 'End', code: 'End', label: 'END', width: 1, row: 4, col: 13, isModifier: true },

  // Row 5
  { id: 'ControlLeft', code: 'ControlLeft', label: 'CTRL', width: 1.25, row: 5, col: 0, isModifier: true },
  { id: 'MetaLeft', code: 'MetaLeft', label: 'WIN', width: 1.25, row: 5, col: 1, isModifier: true },
  { id: 'AltLeft', code: 'AltLeft', label: 'ALT', width: 1.25, row: 5, col: 2, isModifier: true },
  { id: 'Space', code: 'Space', label: '', width: 6.25, row: 5, col: 3, isSpecial: true },
  { id: 'AltRight', code: 'AltRight', label: 'ALT', width: 1.25, row: 5, col: 4, isModifier: true },
  { id: 'MetaRight', code: 'MetaRight', label: 'FN', width: 1.25, row: 5, col: 5, isModifier: true },
  { id: 'ArrowLeft', code: 'ArrowLeft', label: '◀', width: 1, row: 5, col: 6, isSpecial: true },
  { id: 'ArrowDown', code: 'ArrowDown', label: '▼', width: 1, row: 5, col: 7, isSpecial: true },
  { id: 'ArrowRight', code: 'ArrowRight', label: '▶', width: 1, row: 5, col: 8, isSpecial: true }
]

// -------------------------------------------------------------
// 5. 80% Tenkeyless TKL (87 Keys) - Tournament Classic
// -------------------------------------------------------------
const LAYOUT_TKL_KEYS: KeyData[] = [
  // Row 0 (F-Row with gaps)
  { id: 'Escape', code: 'Escape', label: 'ESC', width: 1, row: 0, col: 0, isSpecial: true },
  { id: 'F1', code: 'F1', label: 'F1', width: 1, row: 0, col: 1, gapBefore: 0.5 },
  { id: 'F2', code: 'F2', label: 'F2', width: 1, row: 0, col: 2 },
  { id: 'F3', code: 'F3', label: 'F3', width: 1, row: 0, col: 3 },
  { id: 'F4', code: 'F4', label: 'F4', width: 1, row: 0, col: 4 },
  { id: 'F5', code: 'F5', label: 'F5', width: 1, row: 0, col: 5, gapBefore: 0.5 },
  { id: 'F6', code: 'F6', label: 'F6', width: 1, row: 0, col: 6 },
  { id: 'F7', code: 'F7', label: 'F7', width: 1, row: 0, col: 7 },
  { id: 'F8', code: 'F8', label: 'F8', width: 1, row: 0, col: 8 },
  { id: 'F9', code: 'F9', label: 'F9', width: 1, row: 0, col: 9, gapBefore: 0.5 },
  { id: 'F10', code: 'F10', label: 'F10', width: 1, row: 0, col: 10 },
  { id: 'F11', code: 'F11', label: 'F11', width: 1, row: 0, col: 11 },
  { id: 'F12', code: 'F12', label: 'F12', width: 1, row: 0, col: 12 },
  { id: 'PrintScreen', code: 'PrintScreen', label: 'PRT', width: 1, row: 0, col: 13, gapBefore: 0.5, isModifier: true },
  { id: 'ScrollLock', code: 'ScrollLock', label: 'SCR', width: 1, row: 0, col: 14, isModifier: true },
  { id: 'Pause', code: 'Pause', label: 'PAUS', width: 1, row: 0, col: 15, isModifier: true },

  // Row 1 (Numbers + Navigation Top)
  { id: 'Backquote', code: 'Backquote', label: '`', width: 1, row: 1, col: 0 },
  { id: 'Digit1', code: 'Digit1', label: '1', width: 1, row: 1, col: 1 },
  { id: 'Digit2', code: 'Digit2', label: '2', width: 1, row: 1, col: 2 },
  { id: 'Digit3', code: 'Digit3', label: '3', width: 1, row: 1, col: 3 },
  { id: 'Digit4', code: 'Digit4', label: '4', width: 1, row: 1, col: 4 },
  { id: 'Digit5', code: 'Digit5', label: '5', width: 1, row: 1, col: 5 },
  { id: 'Digit6', code: 'Digit6', label: '6', width: 1, row: 1, col: 6 },
  { id: 'Digit7', code: 'Digit7', label: '7', width: 1, row: 1, col: 7 },
  { id: 'Digit8', code: 'Digit8', label: '8', width: 1, row: 1, col: 8 },
  { id: 'Digit9', code: 'Digit9', label: '9', width: 1, row: 1, col: 9 },
  { id: 'Digit0', code: 'Digit0', label: '0', width: 1, row: 1, col: 10 },
  { id: 'Minus', code: 'Minus', label: '-', width: 1, row: 1, col: 11 },
  { id: 'Equal', code: 'Equal', label: '=', width: 1, row: 1, col: 12 },
  { id: 'Backspace', code: 'Backspace', label: 'BACK', width: 2, row: 1, col: 13, isModifier: true },
  { id: 'Insert', code: 'Insert', label: 'INS', width: 1, row: 1, col: 14, gapBefore: 0.5, isModifier: true },
  { id: 'Home', code: 'Home', label: 'HOME', width: 1, row: 1, col: 15, isModifier: true },
  { id: 'PageUp', code: 'PageUp', label: 'PGUP', width: 1, row: 1, col: 16, isModifier: true },

  // Row 2 (Q-P + Navigation Bottom)
  { id: 'Tab', code: 'Tab', label: 'TAB', width: 1.5, row: 2, col: 0, isModifier: true },
  { id: 'KeyQ', code: 'KeyQ', label: 'Q', width: 1, row: 2, col: 1 },
  { id: 'KeyW', code: 'KeyW', label: 'W', width: 1, row: 2, col: 2 },
  { id: 'KeyE', code: 'KeyE', label: 'E', width: 1, row: 2, col: 3 },
  { id: 'KeyR', code: 'KeyR', label: 'R', width: 1, row: 2, col: 4 },
  { id: 'KeyT', code: 'KeyT', label: 'T', width: 1, row: 2, col: 5 },
  { id: 'KeyY', code: 'KeyY', label: 'Y', width: 1, row: 2, col: 6 },
  { id: 'KeyU', code: 'KeyU', label: 'U', width: 1, row: 2, col: 7 },
  { id: 'KeyI', code: 'KeyI', label: 'I', width: 1, row: 2, col: 8 },
  { id: 'KeyO', code: 'KeyO', label: 'O', width: 1, row: 2, col: 9 },
  { id: 'KeyP', code: 'KeyP', label: 'P', width: 1, row: 2, col: 10 },
  { id: 'BracketLeft', code: 'BracketLeft', label: '[', width: 1, row: 2, col: 11 },
  { id: 'BracketRight', code: 'BracketRight', label: ']', width: 1, row: 2, col: 12 },
  { id: 'Backslash', code: 'Backslash', label: '\\', width: 1.5, row: 2, col: 13, isModifier: true },
  { id: 'Delete', code: 'Delete', label: 'DEL', width: 1, row: 2, col: 14, gapBefore: 0.5, isModifier: true },
  { id: 'End', code: 'End', label: 'END', width: 1, row: 2, col: 15, isModifier: true },
  { id: 'PageDown', code: 'PageDown', label: 'PGDN', width: 1, row: 2, col: 16, isModifier: true },

  // Row 3 (A-L)
  { id: 'CapsLock', code: 'CapsLock', label: 'CAPS', width: 1.75, row: 3, col: 0, isModifier: true },
  { id: 'KeyA', code: 'KeyA', label: 'A', width: 1, row: 3, col: 1 },
  { id: 'KeyS', code: 'KeyS', label: 'S', width: 1, row: 3, col: 2 },
  { id: 'KeyD', code: 'KeyD', label: 'D', width: 1, row: 3, col: 3 },
  { id: 'KeyF', code: 'KeyF', label: 'F', width: 1, row: 3, col: 4 },
  { id: 'KeyG', code: 'KeyG', label: 'G', width: 1, row: 3, col: 5 },
  { id: 'KeyH', code: 'KeyH', label: 'H', width: 1, row: 3, col: 6 },
  { id: 'KeyJ', code: 'KeyJ', label: 'J', width: 1, row: 3, col: 7 },
  { id: 'KeyK', code: 'KeyK', label: 'K', width: 1, row: 3, col: 8 },
  { id: 'KeyL', code: 'KeyL', label: 'L', width: 1, row: 3, col: 9 },
  { id: 'Semicolon', code: 'Semicolon', label: ';', width: 1, row: 3, col: 10 },
  { id: 'Quote', code: 'Quote', label: '\'', width: 1, row: 3, col: 11 },
  { id: 'Enter', code: 'Enter', label: 'ENTER', width: 2.25, row: 3, col: 12, isSpecial: true },

  // Row 4 (Shift + Arrow Up)
  { id: 'ShiftLeft', code: 'ShiftLeft', label: 'SHIFT', width: 2.25, row: 4, col: 0, isModifier: true },
  { id: 'KeyZ', code: 'KeyZ', label: 'Z', width: 1, row: 4, col: 1 },
  { id: 'KeyX', code: 'KeyX', label: 'X', width: 1, row: 4, col: 2 },
  { id: 'KeyC', code: 'KeyC', label: 'C', width: 1, row: 3, col: 3 },
  { id: 'KeyV', code: 'KeyV', label: 'V', width: 1, row: 4, col: 4 },
  { id: 'KeyB', code: 'KeyB', label: 'B', width: 1, row: 4, col: 5 },
  { id: 'KeyN', code: 'KeyN', label: 'N', width: 1, row: 4, col: 6 },
  { id: 'KeyM', code: 'KeyM', label: 'M', width: 1, row: 4, col: 7 },
  { id: 'Comma', code: 'Comma', label: ',', width: 1, row: 4, col: 8 },
  { id: 'Period', code: 'Period', label: '.', width: 1, row: 4, col: 9 },
  { id: 'Slash', code: 'Slash', label: '/', width: 1, row: 4, col: 10 },
  { id: 'ShiftRight', code: 'ShiftRight', label: 'SHIFT', width: 2.75, row: 4, col: 11, isModifier: true },
  { id: 'ArrowUp', code: 'ArrowUp', label: '▲', width: 1, row: 4, col: 12, gapBefore: 1.5, isSpecial: true },

  // Row 5 (Bottom Row + Left/Down/Right Arrows)
  { id: 'ControlLeft', code: 'ControlLeft', label: 'CTRL', width: 1.25, row: 5, col: 0, isModifier: true },
  { id: 'MetaLeft', code: 'MetaLeft', label: 'WIN', width: 1.25, row: 5, col: 1, isModifier: true },
  { id: 'AltLeft', code: 'AltLeft', label: 'ALT', width: 1.25, row: 5, col: 2, isModifier: true },
  { id: 'Space', code: 'Space', label: '', width: 6.25, row: 5, col: 3, isSpecial: true },
  { id: 'AltRight', code: 'AltRight', label: 'ALT', width: 1.25, row: 5, col: 4, isModifier: true },
  { id: 'MetaRight', code: 'MetaRight', label: 'FN', width: 1.25, row: 5, col: 5, isModifier: true },
  { id: 'ControlRight', code: 'ControlRight', label: 'CTRL', width: 1.25, row: 5, col: 6, isModifier: true },
  { id: 'ArrowLeft', code: 'ArrowLeft', label: '◀', width: 1, row: 5, col: 7, gapBefore: 0.5, isSpecial: true },
  { id: 'ArrowDown', code: 'ArrowDown', label: '▼', width: 1, row: 5, col: 8, isSpecial: true },
  { id: 'ArrowRight', code: 'ArrowRight', label: '▶', width: 1, row: 5, col: 9, isSpecial: true }
]

function createLayoutConfig(
  id: KeyboardLayoutType,
  name: string,
  shortLabel: string,
  keysCount: number,
  tagline: string,
  caseWidth: number,
  caseDepth: number,
  cameraZ: number,
  startX: number,
  rowZOffsets: number[],
  keys: KeyData[]
): KeyboardLayoutConfig {
  const positions = computeLayoutPositions(keys, startX, rowZOffsets)
  const positionMap = new Map<string, Key3DPosition>()
  const codeMap = new Map<string, KeyData>()

  positions.forEach(p => {
    positionMap.set(p.key.code, p)
    positionMap.set(p.key.id, p)
  })

  keys.forEach(k => {
    codeMap.set(k.code, k)
    codeMap.set(k.id, k)
  })

  return {
    id,
    name,
    shortLabel,
    keysCount,
    tagline,
    caseWidth,
    caseDepth,
    cameraZ,
    keys,
    positions,
    positionMap,
    codeMap
  }
}

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutType, KeyboardLayoutConfig> = {
  '60': createLayoutConfig(
    '60',
    '60% ANSI Standard',
    '60%',
    61,
    'Ultra-compact 61-key minimalist layout. Maximum mouse clearance.',
    15.2,
    5.8,
    13,
    -7.0,
    [-2.1, -1.05, 0, 1.05, 2.1],
    LAYOUT_60_KEYS
  ),
  '64': createLayoutConfig(
    '64',
    '64% Compact Arrows',
    '64%',
    64,
    'Enthusiast 64-key with dedicated arrow keys and delete in a 60% chassis.',
    15.2,
    5.8,
    13,
    -7.0,
    [-2.1, -1.05, 0, 1.05, 2.1],
    LAYOUT_64_KEYS
  ),
  '65': createLayoutConfig(
    '65',
    '65% Streamlined',
    '65%',
    68,
    'Dedicated arrow keys with vertical navigation column (Del, PgUp, PgDn).',
    16.2,
    5.8,
    13.5,
    -7.5,
    [-2.1, -1.05, 0, 1.05, 2.1],
    LAYOUT_65_KEYS
  ),
  '75': createLayoutConfig(
    '75',
    '75% Compact TKL',
    '75%',
    84,
    'Dedicated F-row (F1-F12) + arrow cluster + nav column in a condensed footprint.',
    16.2,
    6.9,
    14.2,
    -7.5,
    [-2.65, -1.6, -0.55, 0.5, 1.55, 2.6],
    LAYOUT_75_KEYS
  ),
  'tkl': createLayoutConfig(
    'tkl',
    '80% Tenkeyless (TKL)',
    '80% TKL',
    87,
    'Esports tournament standard. Full F-row, separated nav island and arrow cluster.',
    18.8,
    6.9,
    15.5,
    -8.7,
    [-2.65, -1.6, -0.55, 0.5, 1.55, 2.6],
    LAYOUT_TKL_KEYS
  )
}

export const LAYOUT_TYPES: KeyboardLayoutType[] = ['60', '64', '65', '75', 'tkl']

// Default fallback 60% layout for backwards compatibility
export const KEYBOARD_LAYOUT = KEYBOARD_LAYOUTS['60'].keys
export const KEY_3D_POSITIONS = KEYBOARD_LAYOUTS['60'].positions
export const KEY_POSITION_MAP = KEYBOARD_LAYOUTS['60'].positionMap
export const KEY_CODE_MAP = KEYBOARD_LAYOUTS['60'].codeMap

// Universal key data lookup with support for active layout
export function findKeyData(
  code: string,
  key?: string,
  layoutConfig: KeyboardLayoutConfig = KEYBOARD_LAYOUTS['64']
): KeyData | undefined {
  if (layoutConfig.codeMap.has(code)) {
    return layoutConfig.codeMap.get(code)
  }
  if (key) {
    if (key === ' ') return layoutConfig.codeMap.get('Space')
    if (key === 'ArrowUp') return layoutConfig.codeMap.get('ArrowUp')
    if (key === 'ArrowDown') return layoutConfig.codeMap.get('ArrowDown')
    if (key === 'ArrowLeft') return layoutConfig.codeMap.get('ArrowLeft')
    if (key === 'ArrowRight') return layoutConfig.codeMap.get('ArrowRight')

    const upper = key.toUpperCase()
    if (layoutConfig.codeMap.has(`Key${upper}`)) return layoutConfig.codeMap.get(`Key${upper}`)
    if (layoutConfig.codeMap.has(`Digit${upper}`)) return layoutConfig.codeMap.get(`Digit${upper}`)

    // Common symbol mapping
    const symbolMap: Record<string, string> = {
      '-': 'Minus',
      '_': 'Minus',
      '=': 'Equal',
      '+': 'Equal',
      '[': 'BracketLeft',
      '{': 'BracketLeft',
      ']': 'BracketRight',
      '}': 'BracketRight',
      '\\': 'Backslash',
      '|': 'Backslash',
      ';': 'Semicolon',
      ':': 'Semicolon',
      "'": 'Quote',
      '"': 'Quote',
      ',': 'Comma',
      '<': 'Comma',
      '.': 'Period',
      '>': 'Period',
      '/': 'Slash',
      '?': 'Slash',
      '`': 'Backquote',
      '~': 'Backquote'
    }
    if (symbolMap[key] && layoutConfig.codeMap.has(symbolMap[key])) {
      return layoutConfig.codeMap.get(symbolMap[key])
    }

    const byLabel = layoutConfig.keys.find(k => k.label.toUpperCase() === upper)
    if (byLabel) return byLabel
  }
  return undefined
}
