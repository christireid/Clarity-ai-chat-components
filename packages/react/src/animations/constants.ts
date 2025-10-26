/**
 * Animation Constants
 * 
 * Centralized animation timing and easing values for consistent motion design.
 */

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  /** Ultra fast - 100ms - Micro-interactions, hover states */
  instant: 100,
  /** Fast - 150ms - Button presses, simple transitions */
  fast: 150,
  /** Normal - 250ms - Standard transitions, fades */
  normal: 250,
  /** Slow - 350ms - Complex transitions, slides */
  slow: 350,
  /** Slower - 500ms - Page transitions, reveals */
  slower: 500,
  /** Very slow - 700ms - Special effects, dramatic reveals */
  slowest: 700,
} as const

/**
 * Animation easing functions
 */
export const ANIMATION_EASING = {
  /** Default ease - Smooth in and out */
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Ease in - Starts slow, ends fast */
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Ease out - Starts fast, ends slow */
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Ease in-out - Smooth start and end */
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Spring - Bouncy, energetic feel */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Sharp - Quick, decisive movement */
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  /** Emphasized - Attention-grabbing */
  emphasized: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const

/**
 * Stagger timing for list animations
 */
export const STAGGER_TIMING = {
  /** Very fast stagger - 30ms between items */
  fast: 0.03,
  /** Normal stagger - 50ms between items */
  normal: 0.05,
  /** Slow stagger - 80ms between items */
  slow: 0.08,
  /** Very slow stagger - 120ms between items */
  slower: 0.12,
} as const

/**
 * Common animation variants for framer-motion
 */
export const ANIMATION_VARIANTS = {
  /** Fade in/out */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATION.normal / 1000 },
  },
  
  /** Fade and slide up */
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { 
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },
  
  /** Fade and slide down */
  fadeSlideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { 
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },
  
  /** Scale and fade */
  scaleFade: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { 
      duration: ANIMATION_DURATION.fast / 1000,
      ease: ANIMATION_EASING.spring,
    },
  },
  
  /** Pop in with spring */
  popIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { 
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.spring,
    },
  },
  
  /** Slide from left */
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { 
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },
  
  /** Slide from right */
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { 
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },
  
  /** List container with stagger */
  listContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: STAGGER_TIMING.normal,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: STAGGER_TIMING.fast,
        staggerDirection: -1,
      },
    },
  },
  
  /** List item */
  listItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: ANIMATION_DURATION.fast / 1000 },
  },
} as const

/**
 * Hover and tap animations
 */
export const INTERACTION_VARIANTS = {
  /** Button hover/tap */
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },
  
  /** Icon button hover/tap */
  iconButton: {
    hover: { scale: 1.1, rotate: 5 },
    tap: { scale: 0.9 },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },
  
  /** Card hover */
  card: {
    hover: { y: -4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' },
    transition: { duration: ANIMATION_DURATION.fast / 1000 },
  },
  
  /** Subtle lift on hover */
  lift: {
    hover: { y: -2 },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },
  
  /** Glow effect on hover */
  glow: {
    hover: { boxShadow: '0 0 20px rgba(var(--primary), 0.3)' },
    transition: { duration: ANIMATION_DURATION.fast / 1000 },
  },
} as const

/**
 * Loading and skeleton animation
 */
export const LOADING_ANIMATION = {
  pulse: {
    animate: {
      opacity: [0.5, 0.8, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: ANIMATION_EASING.inOut,
    },
  },
  
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  spinner: {
    animate: {
      rotate: [0, 360],
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  dots: {
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1, 0.8],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
} as const

/**
 * Type exports
 */
export type AnimationDuration = keyof typeof ANIMATION_DURATION
export type AnimationEasing = keyof typeof ANIMATION_EASING
export type StaggerTiming = keyof typeof STAGGER_TIMING
export type AnimationVariant = keyof typeof ANIMATION_VARIANTS
export type InteractionVariant = keyof typeof INTERACTION_VARIANTS
