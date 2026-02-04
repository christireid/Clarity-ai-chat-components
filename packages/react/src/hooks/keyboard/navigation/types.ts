/**
 * Type definitions for keyboard navigation system
 */

export interface KeyboardShortcutConfig {
  /** Unique identifier for the shortcut */
  id: string
  /** Key combination (e.g., 'mod+k', 'g i' for sequence) */
  keys: string | string[]
  /** Human-readable description */
  description: string
  /** Category for grouping in help modal */
  category?: string
  /** Handler function */
  handler: (event: KeyboardEvent) => void
  /** Priority (higher = handled first) */
  priority?: number
  /** Whether shortcut works in input fields */
  enableInInput?: boolean
  /** Whether this shortcut is currently active */
  enabled?: boolean
  /** Scope - only active when this scope is focused */
  scope?: string
  /** Prevent default browser behavior */
  preventDefault?: boolean
}

export interface ShortcutConflict {
  key: string
  shortcuts: KeyboardShortcutConfig[]
}

export interface KeyboardNavigationState {
  /** Currently active shortcuts */
  shortcuts: Map<string, KeyboardShortcutConfig>
  /** Detected conflicts */
  conflicts: ShortcutConflict[]
  /** Current sequence buffer (for multi-key shortcuts like 'g i') */
  sequenceBuffer: string[]
  /** Active scope (e.g., 'message-list', 'command-palette') */
  activeScope: string | null
  /** Whether keyboard navigation mode is active */
  isKeyboardNavigating: boolean
  /** Currently focused element index in a list */
  focusedIndex: number
  /** Show keyboard hints overlay */
  showHints: boolean
}

export type KeyboardNavigationAction =
  | { type: 'REGISTER_SHORTCUT'; shortcut: KeyboardShortcutConfig }
  | { type: 'UNREGISTER_SHORTCUT'; id: string }
  | { type: 'SET_SCOPE'; scope: string | null }
  | { type: 'APPEND_SEQUENCE'; key: string }
  | { type: 'CLEAR_SEQUENCE' }
  | { type: 'SET_KEYBOARD_NAVIGATING'; isNavigating: boolean }
  | { type: 'SET_FOCUSED_INDEX'; index: number }
  | { type: 'TOGGLE_HINTS' }
  | { type: 'SET_HINTS'; show: boolean }
