'use client'

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
 *
 * @deprecated Import from './navigation' instead
 */

// Re-export everything from the new modular structure
export type {
  KeyboardShortcutConfig,
  ShortcutConflict,
  KeyboardNavigationState,
  KeyboardNavigationAction,
} from './navigation/types'

export { useIsMac } from './navigation/platform-detection'

export { formatShortcutDisplay } from './navigation/shortcut-formatting'

export type { KeyboardNavigationContextValue } from './navigation/context'

export type { KeyboardNavigationProviderProps } from './navigation/provider'
export { KeyboardNavigationProvider } from './navigation/provider'

export {
  useKeyboardNavigation,
  useKeyboardShortcut,
  useVimNavigation,
  useFocusScope,
  useKeyboardHintsOnModifier,
} from './navigation/hooks'
export type { UseVimNavigationOptions } from './navigation/hooks'

export { defaultChatShortcuts } from './navigation/default-shortcuts'
