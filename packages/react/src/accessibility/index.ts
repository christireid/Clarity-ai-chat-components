/**
 * Accessibility System
 *
 * WCAG 2.1 AAA compliance utilities and components
 *
 * Features:
 * - Core utilities (ARIA helpers, contrast checking, screen reader support)
 * - WCAG validation and compliance checking
 * - Focus management (trap, restoration, roving tabindex)
 * - Keyboard shortcuts system
 * - Accessibility automation
 */

// Core utilities - ARIA, contrast, reduced motion, screen reader helpers
export * from './core-utilities'

// WCAG compliance validation and auditing
export * from './wcag-validator'

// Focus management
export * from './focus-management'

// Accessibility automation framework
export * from './accessibility-automation'

// Keyboard shortcuts - provider and defaults only (hooks from hooks/keyboard)
export {
  KeyboardShortcutsProvider,
  type KeyboardShortcutsProviderProps,
  defaultShortcuts,
} from './keyboard-shortcuts'
