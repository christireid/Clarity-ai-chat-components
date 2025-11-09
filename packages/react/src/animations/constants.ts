/**
 * Animation Constants
 * Centralized timing and configuration values for consistent animations
 */

export const ANIMATION_DURATION = {
  /** 100ms - Instant interactions */
  instant: 100,
  /** 150ms - Quick interactions */
  fast: 150,
  /** 300ms - Standard transitions */
  normal: 300,
  /** 500ms - Slow, emphasized transitions */
  slow: 500,
  /** 1000ms - Extra slow, significant state changes */
  'extra-slow': 1000,
} as const

export const ANIMATION_EASING = {
  /** Default easing */
  default: 'easeOut',
  /** Smooth acceleration */
  in: 'easeIn',
  /** Smooth deceleration */
  out: 'easeOut',
  /** Smooth acceleration and deceleration */
  inOut: 'easeInOut',
  /** Sharp, immediate easing */
  sharp: 'linear',
  /** Spring physics */
  spring: 'spring',
} as const

export const STAGGER_TIMING = {
  /** 0ms - Immediate sequencing */
  instant: 0,
  /** 50ms - Fast stagger for subtle motion */
  fast: 0.05,
  /** 100ms - Balanced stagger for standard lists */
  normal: 0.1,
  /** 200ms - Emphasized stagger for dramatic reveals */
  slow: 0.2,
} as const

export const INTERACTION_VARIANTS = {
  button: {
    hover: { scale: 1.02, y: -1 },
    tap: { scale: 0.98, y: 0 },
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  card: {
    hover: { y: -1, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    tap: { scale: 0.99 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  icon: {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.9, rotate: -5 },
    transition: { duration: 0.15, type: 'spring', stiffness: 400 },
  },
  iconButton: {
    hover: { scale: 1.1, y: -1 },
    tap: { scale: 0.95 },
    transition: { duration: 0.15, ease: 'easeOut' },
  },
} as const

export const ANIMATION_TIMINGS = {
  /** 200ms - Fast animations */
  FAST: 0.2,
  /** 300ms - Normal animations */
  NORMAL: 0.3,
  /** 500ms - Slow animations */
  SLOW: 0.5,
  /** 3000ms - Infinite cycle duration */
  INFINITE_CYCLE: 3,
} as const

export const UI_FEEDBACK_DELAYS = {
  /** 1000ms - Success state display duration */
  SUCCESS: 1000,
  /** 2000ms - Error state display duration */
  ERROR: 2000,
  /** 300ms - Tooltip delay */
  TOOLTIP: 300,
  /** 150ms - Hover delay */
  HOVER: 150,
} as const

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  scaleRotate: {
    initial: { opacity: 0, scale: 0.8, rotate: -5 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.8, rotate: 5 },
  },
} as const

/**
 * Z-index layers for consistent stacking context
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const

export type AnimationDuration = keyof typeof ANIMATION_DURATION
export type AnimationEasing = keyof typeof ANIMATION_EASING
export type StaggerTiming = keyof typeof STAGGER_TIMING
