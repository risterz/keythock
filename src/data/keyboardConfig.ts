export interface KeyData {
  id: string
  code: string
  label: string
  width: number // 1 = 1u, 1.5 = 1.5u, etc.
  row: number
  col: number
  isModifier?: boolean
  isSpecial?: boolean
}

export type RgbMode = 'rainbow' | 'ripple' | 'breathing' | 'static'
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
export const ROW_Z_OFFSETS = [-2.1, -1.05, 0, 1.05, 2.1]

// 60% Compact Keyboard Layout Matrix
export const KEYBOARD_LAYOUT: KeyData[] = [
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

export interface Key3DPosition {
  key: KeyData
  x: number
  z: number
  width: number
}

// Compute accurate 3D positions for every key
export function computeKey3DPositions(): Key3DPosition[] {
  const positions: Key3DPosition[] = []
  const rows = [0, 1, 2, 3, 4]

  rows.forEach(r => {
    const keysInRow = KEYBOARD_LAYOUT.filter(k => k.row === r)
    let currentX = -7.0

    keysInRow.forEach(k => {
      const keyWidth = k.width * UNIT_SIZE + (k.width - 1) * KEY_GAP
      const posX = currentX + keyWidth / 2
      positions.push({
        key: k,
        x: posX,
        z: ROW_Z_OFFSETS[r],
        width: keyWidth
      })
      currentX += keyWidth + KEY_GAP
    })
  })

  return positions
}

export const KEY_3D_POSITIONS = computeKey3DPositions()

export const KEY_POSITION_MAP = new Map<string, Key3DPosition>()
KEY_3D_POSITIONS.forEach(pos => {
  KEY_POSITION_MAP.set(pos.key.code, pos)
  KEY_POSITION_MAP.set(pos.key.id, pos)
})

export const KEY_CODE_MAP = new Map<string, KeyData>()
KEYBOARD_LAYOUT.forEach(k => {
  KEY_CODE_MAP.set(k.code, k)
  KEY_CODE_MAP.set(k.id, k)
})

// Lookup key data by KeyboardEvent code or key character
export function findKeyData(code: string, key?: string): KeyData | undefined {
  if (KEY_CODE_MAP.has(code)) {
    return KEY_CODE_MAP.get(code)
  }
  if (key) {
    if (key === ' ') return KEY_CODE_MAP.get('Space')
    const upper = key.toUpperCase()
    if (KEY_CODE_MAP.has(`Key${upper}`)) return KEY_CODE_MAP.get(`Key${upper}`)
    if (KEY_CODE_MAP.has(`Digit${upper}`)) return KEY_CODE_MAP.get(`Digit${upper}`)

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
      '?': 'Slash'
    }
    if (symbolMap[key] && KEY_CODE_MAP.has(symbolMap[key])) {
      return KEY_CODE_MAP.get(symbolMap[key])
    }

    const byLabel = KEYBOARD_LAYOUT.find(k => k.label.toUpperCase() === upper)
    if (byLabel) return byLabel
  }
  return undefined
}
