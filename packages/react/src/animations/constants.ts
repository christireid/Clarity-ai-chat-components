/**
 * Animation Constants
 *
 * Centralized timing and configuration values for consistent animations.
 * This is the single source of truth for all animation-related values.
 *
 * Design Principles:
 * - All animations should use these tokens for consistency
 * - Prefer transform/opacity animations for 60fps performance
 * - Always provide reduced motion alternatives
 * - Use semantic names that describe purpose, not implementation
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
 */

// =============================================================================
// DURATION TOKENS
// =============================================================================

/**
 * Animation duration scale in milliseconds
 *
 * Usage guidelines:
 * - instant: Immediate feedback (keyboard shortcuts, toggles)
 * - faster: Micro-interactions (icon changes, state indicators)
 * - fast: Quick interactions (button clicks, input focus)
 * - normal: Standard transitions (dropdowns, accordions)
 * - slow: Emphasis transitions (modals, panels)
 * - slower: Complex animations (page transitions, onboarding)
 */
export const ANIMATION_DURATION = {
  /** 0ms - Instant, no transition */
  instant: 0,
  /** 75ms - Micro-interactions */
  faster: 75,
  /** 150ms - Quick interactions (buttons, inputs) */
  fast: 150,
  /** 200ms - Standard UI transitions */
  normal: 200,
  /** 300ms - Emphasis transitions (modals, menus) */
  slow: 300,
  /** 400ms - Complex transitions (panels, sheets) */
  slower: 400,
  /** 500ms - Page-level transitions */
  slowest: 500,
  // Legacy alias - use 'slower' instead
  /** @deprecated Use 'slower' instead */
  'extra-slow': 500,
} as const

/**
 * Duration values as CSS strings for direct use in styles
 */
export const DURATION_CSS = {
  instant: '0ms',
  faster: '75ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
} as const

/**
 * Duration values in seconds for Framer Motion
 */
export const DURATION_SECONDS = {
  instant: 0,
  faster: 0.075,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.4,
  slowest: 0.5,
} as const

/**
 * Tailwind duration class mappings
 * Use these for consistent Tailwind class generation
 */
export const TAILWIND_DURATION = {
  instant: 'duration-0',
  faster: 'duration-75',
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500', // Tailwind doesn't have 400, using closest
  slowest: 'duration-500',
} as const

// =============================================================================
// EASING TOKENS
// =============================================================================

/**
 * Easing function tokens
 *
 * Based on Material Design motion principles with CSS cubic-bezier values.
 * Use named tokens for consistency across the application.
 *
 * Performance Note: All easings here are GPU-accelerated when used with
 * transform and opacity properties.
 */
export const ANIMATION_EASING = {
  /** Linear - constant speed (use for spinners, progress bars) */
  linear: 'linear',
  /** Default - balanced in/out curve */
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Ease in - starts slow, ends fast (for exits) */
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Ease out - starts fast, ends slow (for entrances) */
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Ease in-out - slow at both ends (for emphasis) */
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Sharp - quick start and end (for quick interactions) */
  sharp: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  /** Smooth - very gradual curve (for subtle transitions) */
  smooth: 'cubic-bezier(0.4, 0, 0.1, 1)',
  /** Spring - overshoot effect (for playful/success states) */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Bounce - pronounced overshoot (for celebratory moments) */
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  /** Snappy - quick with slight overshoot (for responsive UI) */
  snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

/**
 * Easing as Framer Motion compatible format
 */
export const EASING_FRAMER = {
  linear: 'linear',
  default: [0.4, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  sharp: [0.25, 0.1, 0.25, 1] as const,
  smooth: [0.4, 0, 0.1, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  snappy: [0.4, 0, 0.2, 1] as const,
} as const

/**
 * Tailwind timing function class mappings
 */
export const TAILWIND_EASING = {
  linear: 'ease-linear',
  default: 'ease-[cubic-bezier(0.4,0,0.2,1)]',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
  sharp: 'ease-[cubic-bezier(0.25,0.1,0.25,1)]',
  smooth: 'ease-[cubic-bezier(0.4,0,0.1,1)]',
  spring: 'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  bounce: 'ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
  snappy: 'ease-[cubic-bezier(0.4,0,0.2,1)]',
} as const

// =============================================================================
// STAGGER TIMING
// =============================================================================

/**
 * Stagger delay values for list/sequential animations (in seconds)
 */
export const STAGGER_TIMING = {
  /** 0s - Immediate sequencing */
  instant: 0,
  /** 0.03s - Very fast stagger for dense lists */
  faster: 0.03,
  /** 0.05s - Fast stagger for subtle motion */
  fast: 0.05,
  /** 0.08s - Balanced stagger for standard lists */
  normal: 0.08,
  /** 0.12s - Emphasized stagger for dramatic reveals */
  slow: 0.12,
  /** 0.2s - Dramatic stagger for important sequences */
  slower: 0.2,
} as const

// =============================================================================
// INTERACTION VARIANTS (Framer Motion)
// =============================================================================

/**
 * Pre-built interaction variants for common components
 *
 * These are designed for 60fps performance using only transform and opacity.
 * Use with Framer Motion's whileHover and whileTap props.
 */
export const INTERACTION_VARIANTS = {
  /** Subtle button interaction */
  button: {
    hover: { scale: 1.02, y: -1 },
    tap: { scale: 0.98, y: 0 },
    transition: { duration: DURATION_SECONDS.fast, ease: EASING_FRAMER.out },
  },
  /** Elevated card interaction */
  card: {
    hover: { y: -2, scale: 1.01 },
    tap: { scale: 0.99 },
    transition: { duration: DURATION_SECONDS.normal, ease: EASING_FRAMER.out },
  },
  /** Playful icon interaction */
  icon: {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.9, rotate: -5 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },
  /** Clean icon button interaction */
  iconButton: {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    transition: { duration: DURATION_SECONDS.fast, ease: EASING_FRAMER.out },
  },
  /** Subtle link interaction */
  link: {
    hover: { scale: 1.01 },
    tap: { scale: 0.99 },
    transition: { duration: DURATION_SECONDS.faster, ease: EASING_FRAMER.out },
  },
} as const

/**
 * Reduced motion versions of interaction variants
 * Returns static values to prevent motion while maintaining feedback
 */
export const INTERACTION_VARIANTS_REDUCED = {
  button: {
    hover: { opacity: 0.9 },
    tap: { opacity: 0.8 },
    transition: { duration: 0 },
  },
  card: {
    hover: { opacity: 0.95 },
    tap: { opacity: 0.9 },
    transition: { duration: 0 },
  },
  icon: {
    hover: { opacity: 0.9 },
    tap: { opacity: 0.8 },
    transition: { duration: 0 },
  },
  iconButton: {
    hover: { opacity: 0.9 },
    tap: { opacity: 0.8 },
    transition: { duration: 0 },
  },
  link: {
    hover: { opacity: 0.9 },
    tap: { opacity: 0.85 },
    transition: { duration: 0 },
  },
} as const

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

/**
 * @deprecated Use DURATION_SECONDS instead
 * Legacy timing constants for backward compatibility
 */
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

/**
 * UI feedback timing delays (in milliseconds)
 */
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

// =============================================================================
// ANIMATION PRESETS (Framer Motion)
// =============================================================================

/**
 * Standard animation presets for Framer Motion
 *
 * All presets animate only transform and opacity for 60fps performance.
 * Use with motion components: initial, animate, exit props.
 */
export const ANIMATION_PRESETS = {
  /** Simple fade in/out */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Slide up with fade */
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  /** Slide down with fade */
  slideDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  /** Slide from left with fade */
  slideLeft: {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
  },
  /** Slide from right with fade */
  slideRight: {
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
  },
  /** Scale up with fade */
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  /** Scale with slight rotation (playful) */
  scaleRotate: {
    initial: { opacity: 0, scale: 0.9, rotate: -3 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.9, rotate: 3 },
  },
  /** Pop in effect (for notifications, badges) */
  pop: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  /** Collapse/expand effect */
  collapse: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  },
} as const

/**
 * Reduced motion versions of animation presets
 * Only uses opacity to avoid triggering vestibular issues
 */
export const ANIMATION_PRESETS_REDUCED = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideDown: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideRight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scaleRotate: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  pop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  collapse: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
} as const

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

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

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * CSS custom property names for animation tokens
 * Use these to generate consistent CSS variable names
 */
export const CSS_VARS = {
  duration: {
    instant: '--animation-duration-instant',
    faster: '--animation-duration-faster',
    fast: '--animation-duration-fast',
    normal: '--animation-duration-normal',
    slow: '--animation-duration-slow',
    slower: '--animation-duration-slower',
    slowest: '--animation-duration-slowest',
  },
  easing: {
    default: '--animation-easing-default',
    in: '--animation-easing-in',
    out: '--animation-easing-out',
    inOut: '--animation-easing-in-out',
    sharp: '--animation-easing-sharp',
    smooth: '--animation-easing-smooth',
    spring: '--animation-easing-spring',
  },
} as const

/**
 * Generate CSS custom properties string for injection into :root
 */
export function generateCSSVars(): string {
  return `
    :root {
      /* Animation Durations */
      --animation-duration-instant: ${DURATION_CSS.instant};
      --animation-duration-faster: ${DURATION_CSS.faster};
      --animation-duration-fast: ${DURATION_CSS.fast};
      --animation-duration-normal: ${DURATION_CSS.normal};
      --animation-duration-slow: ${DURATION_CSS.slow};
      --animation-duration-slower: ${DURATION_CSS.slower};
      --animation-duration-slowest: ${DURATION_CSS.slowest};

      /* Animation Easings */
      --animation-easing-default: ${ANIMATION_EASING.default};
      --animation-easing-in: ${ANIMATION_EASING.in};
      --animation-easing-out: ${ANIMATION_EASING.out};
      --animation-easing-in-out: ${ANIMATION_EASING.inOut};
      --animation-easing-sharp: ${ANIMATION_EASING.sharp};
      --animation-easing-smooth: ${ANIMATION_EASING.smooth};
      --animation-easing-spring: ${ANIMATION_EASING.spring};
    }
  `.trim()
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get animation preset based on reduced motion preference
 */
export function getPreset<K extends keyof typeof ANIMATION_PRESETS>(
  key: K,
  prefersReducedMotion: boolean
): (typeof ANIMATION_PRESETS)[K] | (typeof ANIMATION_PRESETS_REDUCED)[K] {
  return prefersReducedMotion
    ? ANIMATION_PRESETS_REDUCED[key]
    : ANIMATION_PRESETS[key]
}

/**
 * Get interaction variant based on reduced motion preference
 */
export function getInteractionVariant<
  K extends keyof typeof INTERACTION_VARIANTS,
>(
  key: K,
  prefersReducedMotion: boolean
): (typeof INTERACTION_VARIANTS)[K] | (typeof INTERACTION_VARIANTS_REDUCED)[K] {
  return prefersReducedMotion
    ? INTERACTION_VARIANTS_REDUCED[key]
    : INTERACTION_VARIANTS[key]
}

/**
 * Get transition config for Framer Motion
 */
export function getTransition(
  duration: keyof typeof DURATION_SECONDS = 'normal',
  easing: keyof typeof EASING_FRAMER = 'default',
  prefersReducedMotion = false
): { duration: number; ease: readonly number[] | string } {
  if (prefersReducedMotion) {
    return { duration: 0, ease: 'linear' }
  }
  return {
    duration: DURATION_SECONDS[duration],
    ease: EASING_FRAMER[easing],
  }
}

/**
 * Generate Tailwind transition classes
 */
export function getTailwindTransition(
  duration: keyof typeof TAILWIND_DURATION = 'normal',
  easing: keyof typeof TAILWIND_EASING = 'default',
  properties = 'transition-all'
): string {
  return `${properties} ${TAILWIND_DURATION[duration]} ${TAILWIND_EASING[easing]}`
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type AnimationDuration = keyof typeof ANIMATION_DURATION
export type AnimationEasing = keyof typeof ANIMATION_EASING
export type StaggerTiming = keyof typeof STAGGER_TIMING
export type AnimationPreset = keyof typeof ANIMATION_PRESETS
export type InteractionVariant = keyof typeof INTERACTION_VARIANTS
