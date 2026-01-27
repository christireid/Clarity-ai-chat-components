/**
 * Enhanced Keyboard Navigation System
 *
 * Best-in-class keyboard navigation with:
 * - Global shortcut registry with conflict detection
 * - Keyboard shortcut sequences (vim-style g+i chaining)
 * - Vim-style j/k navigation for lists
 * - Focus management with visual feedback
 * - Skip links and landmarks
 * - Keyboard discoverability hints
 */

// Types
export type {
  KeyboardShortcutConfig,
  ShortcutConflict,
  KeyboardNavigationState,
  KeyboardNavigationAction,
} from './types'

// Platform detection
export { useIsMac } from './platform-detection'

// Formatting utilities
export { formatShortcutDisplay } from './shortcut-formatting'

// Context
export type { KeyboardNavigationContextValue } from './context'

// Provider
export type { KeyboardNavigationProviderProps } from './provider'
export { KeyboardNavigationProvider } from './provider'

// Hooks
export {
  useKeyboardNavigation,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
} from './hooks'
export type { UseVimNavigationOptions } from './hooks'

// Default shortcuts
export { defaultChatShortcuts } from './default-shortcuts'
