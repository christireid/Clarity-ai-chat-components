/**
 * Accessibility System
 *
 * WCAG 2.1 AAA compliance utilities and components
 *
 * Features:
 * - Focus management (trap, restoration, roving tabindex)
 * - Keyboard shortcuts system (primary exports from hooks/keyboard)
 * - Screen reader utilities
 * - ARIA helpers
 * - Contrast checking
 */

export * from './a11y-utils'
export * from './focus-management'

// Note: KeyboardShortcut, useKeyboardShortcut, useKeyboardShortcuts are
// exported from hooks/keyboard to avoid duplicate exports.
// We only export the provider and default shortcuts here.
export {
  KeyboardShortcutsProvider,
  type KeyboardShortcutsProviderProps,
  defaultShortcuts,
} from './keyboard-shortcuts'
