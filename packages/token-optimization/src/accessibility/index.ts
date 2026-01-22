/**
 * Accessibility Utilities
 *
 * WCAG 2.1 AA compliant accessibility features for token optimization.
 * Provides screen reader announcements, accessible components, and
 * keyboard navigation support.
 *
 * @module accessibility
 */

// Screen reader announcements
export {
  announce,
  announceTokenUsage,
  announceCost,
  announceCompression,
  announceThresholdCrossing,
  cleanupAnnouncer,
  type AnnouncementPriority,
} from './announcer'

// React hooks for accessibility
export {
  useTokenAnnouncer,
  useTokenKeyboardShortcuts,
  usePrefersReducedMotion,
  usePrefersHighContrast,
  type TokenAnnouncerOptions,
  type UseTokenAnnouncerReturn,
  type KeyboardShortcutOptions,
  type ReducedMotionOptions,
} from './hooks'

// Accessible components
export {
  AccessibleTokenDisplay,
  MemoizedAccessibleTokenDisplay,
  useTokenDisplayState,
  type AccessibleTokenDisplayProps,
  type TokenDisplayState,
} from './token-display'
