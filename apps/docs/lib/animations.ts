/**
 * Animation Library for Clarity Chat Documentation
 *
 * Reusable animation variants and utilities for consistent, performant animations
 * throughout the documentation site.
 *
 * Performance Guidelines:
 * - Only animate GPU-accelerated properties (transform, opacity)
 * - Use springs for natural, organic motion
 * - Respect prefers-reduced-motion
 * - Target 60fps for all animations
 */

import { Variants, Transition } from 'framer-motion'

// =============================================================================
// EASING CURVES
// =============================================================================

/**
 * Custom easing curves for consistent motion
 * Based on industry standards from Apple, Google, and leading design systems
 */
export const easings = {
  // Standard ease for most UI interactions
  easeOut: [0.25, 0.46, 0.45, 0.94],

  // Snappy, responsive feel for buttons
  easeOutQuick: [0.22, 1, 0.36, 1],

  // Smooth, gentle motion for large elements
  easeInOut: [0.65, 0, 0.35, 1],

  // Anticipation effect (slight pullback before action)
  anticipate: [0.68, -0.55, 0.265, 1.55],
} as const

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

/**
 * Pre-configured spring physics for natural motion
 */
export const springs = {
  // Snappy spring for buttons, small elements
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },

  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
  },

  // Smooth spring for large elements, modals
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },

  // Gentle spring for subtle movements
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },
} as const

// =============================================================================
// DURATION STANDARDS
// =============================================================================

/**
 * Standard durations for consistency
 * Following Material Design and iOS HIG guidelines
 */
export const durations = {
  instant: 0.1, // 100ms - Instantaneous feedback
  fast: 0.15, // 150ms - Quick micro-interactions
  normal: 0.2, // 200ms - Standard transitions
  moderate: 0.3, // 300ms - Modal appearances, larger elements
  slow: 0.5, // 500ms - Page transitions, complex animations
  slower: 0.7, // 700ms - Scroll animations, reveals
} as const

// =============================================================================
// BASIC ANIMATIONS
// =============================================================================

/**
 * Fade in from invisible to visible
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Fade in with upward slide (most common pattern)
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

/**
 * Fade in with downward slide (for dropdowns, menus)
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

/**
 * Fade in with scale (for modals, popovers)
 */
export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

// =============================================================================
// INTERACTIVE ANIMATIONS
// =============================================================================

/**
 * Standard button tap/press animation
 * Creates satisfying tactile feedback
 */
export const buttonTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springs.snappy,
}

/**
 * Gentle hover scale for cards, links
 */
export const cardHover = {
  whileHover: { scale: 1.02, y: -4 },
  transition: { duration: durations.normal, ease: easings.easeOut },
}

/**
 * Icon rotation on hover (for interactive icons)
 */
export const iconHover = {
  whileHover: { rotate: 15, scale: 1.1 },
  transition: springs.bouncy,
}

/**
 * Shake animation for errors or alerts
 */
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
}

/**
 * Pulse animation for notifications, badges
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// =============================================================================
// STAGGER CONTAINERS
// =============================================================================

/**
 * Container for staggered children animations
 * Use with list items, grids, etc.
 */
export const staggerContainer = (staggerDelay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
})

/**
 * Child item for staggered animations
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springs.smooth,
  },
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

/**
 * Fade in when scrolling into view
 * Use with whileInView prop
 */
export const scrollFadeIn: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: durations.moderate, ease: easings.easeOut },
}

/**
 * Scale up when scrolling into view
 */
export const scrollScaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-50px' },
  transition: springs.smooth,
}

/**
 * Blur in when scrolling into view (for images, media)
 */
export const scrollBlurIn: Variants = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  whileInView: { opacity: 1, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: durations.slow, ease: easings.easeOut },
}

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

/**
 * Standard page transition (fade + slide)
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * Modal/Dialog entrance
 */
export const modalTransition: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
}

/**
 * Drawer slide in from side
 */
export const drawerTransition = (
  side: 'left' | 'right' = 'right'
): Variants => ({
  initial: { x: side === 'right' ? '100%' : '-100%' },
  animate: { x: 0 },
  exit: { x: side === 'right' ? '100%' : '-100%' },
})

// =============================================================================
// SPECIAL EFFECTS
// =============================================================================

/**
 * Shimmer loading effect
 * Use with animated background gradient
 */
export const shimmer = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 0%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/**
 * Glowing pulse effect
 * Use for focus states, active indicators
 */
export const glow: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(59, 130, 246, 0)',
      '0 0 0 8px rgba(59, 130, 246, 0.1)',
      '0 0 0 0 rgba(59, 130, 246, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Confetti burst (for success states)
 * Returns array of particle configs
 */
export const confettiParticles = (count = 12) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360,
    delay: i * 0.02,
    distance: 40 + Math.random() * 20,
  }))
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create transition with custom duration and easing
 */
export const transition = (
  duration = durations.normal,
  ease: keyof typeof easings = 'easeOut',
  delay = 0
): Transition => ({
  duration,
  ease: easings[ease],
  delay,
})

/**
 * Create stagger transition for children
 */
export const staggerTransition = (
  staggerDelay = 0.1,
  delayChildren = 0
): Transition => ({
  staggerChildren: staggerDelay,
  delayChildren,
})

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation variants respecting reduced motion preference
 * Returns static variants if user prefers reduced motion
 */
export const getAccessibleVariants = <T extends Variants>(
  variants: T,
  reducedVariants?: Partial<T>
): T => {
  if (prefersReducedMotion() && reducedVariants) {
    return { ...variants, ...reducedVariants } as T
  }
  return variants
}

/**
 * Create viewport configuration for scroll animations
 */
export const createViewport = (
  once = true,
  margin = '-100px',
  amount: number | 'some' | 'all' = 0.2
) => ({
  once,
  margin,
  amount,
})

// =============================================================================
// PRESETS FOR COMMON COMPONENTS
// =============================================================================

/**
 * Complete animation preset for buttons
 */
export const buttonAnimation = {
  ...buttonTap,
  transition: springs.snappy,
}

/**
 * Complete animation preset for cards
 */
export const cardAnimation = {
  ...cardHover,
  whileTap: { scale: 0.99 },
}

/**
 * Complete animation preset for links
 */
export const linkAnimation = {
  whileHover: { x: 4 },
  transition: { duration: durations.fast, ease: easings.easeOut },
}

/**
 * Complete animation preset for icons
 */
export const iconAnimation = {
  ...iconHover,
}

// =============================================================================
// EXPORT DEFAULT COLLECTION
// =============================================================================

/**
 * Default export with commonly used animations
 */
export default {
  // Basic animations
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInScale,
  slideInLeft,
  slideInRight,

  // Interactive
  buttonTap,
  cardHover,
  iconHover,

  // Special effects
  shake,
  pulse,
  shimmer,
  glow,

  // Stagger
  staggerContainer,
  staggerItem,

  // Scroll
  scrollFadeIn,
  scrollScaleIn,
  scrollBlurIn,

  // Page transitions
  pageTransition,
  modalTransition,
  drawerTransition,

  // Presets
  buttonAnimation,
  cardAnimation,
  linkAnimation,
  iconAnimation,

  // Utilities
  springs,
  easings,
  durations,
  transition,
  staggerTransition,
  prefersReducedMotion,
  getAccessibleVariants,
  createViewport,
  confettiParticles,
}
