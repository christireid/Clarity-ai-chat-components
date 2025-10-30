/**
 * Microanimations Library
 * 
 * Delightful microanimations for enhanced user experience.
 * These are small, subtle animations that provide feedback and delight.
 */

import { type Variants, type Transition } from 'framer-motion'
import { ANIMATION_DURATION, ANIMATION_EASING } from './constants'

/**
 * Feedback Animations
 * Provide immediate visual feedback for user actions
 */
export const FeedbackAnimations = {
  /** Shake animation for errors or invalid input */
  shake: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: ANIMATION_EASING.sharp,
    },
  },

  /** Bounce animation for success or emphasis */
  bounce: {
    y: [0, -10, 0, -5, 0],
    transition: {
      duration: 0.6,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Heartbeat pulse for active/alive elements */
  heartbeat: {
    scale: [1, 1.1, 1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Gentle pulse for subtle attention */
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Wiggle for playful attention-grabbing */
  wiggle: {
    rotate: [-3, 3, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.5,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Tada - celebratory animation */
  tada: {
    scale: [1, 0.9, 1.1, 1.1, 1.05, 1],
    rotate: [-3, 3, -3, 3, -2, 2, 0],
    transition: {
      duration: 0.8,
      ease: ANIMATION_EASING.spring,
    },
  },

  /** Flash for urgent attention */
  flash: {
    opacity: [1, 0, 1, 0, 1],
    transition: {
      duration: 0.75,
      ease: 'linear',
    },
  },

  /** Rubber band stretch effect */
  rubberBand: {
    scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
    scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    transition: {
      duration: 0.8,
      ease: ANIMATION_EASING.inOut,
    },
  },
} as const

/**
 * Success/Error State Animations
 */
export const StateAnimations = {
  /** Success checkmark animation */
  successCheck: {
    scale: [0, 1.2, 1],
    rotate: [0, 5, 0],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.5,
      ease: ANIMATION_EASING.spring,
    },
  },

  /** Error shake with color */
  errorShake: {
    x: [-8, 8, -8, 8, -4, 4, 0],
    transition: {
      duration: 0.4,
      ease: ANIMATION_EASING.sharp,
    },
  },

  /** Success glow effect */
  successGlow: {
    boxShadow: [
      '0 0 0 0 rgba(34, 197, 94, 0)',
      '0 0 0 10px rgba(34, 197, 94, 0.3)',
      '0 0 0 20px rgba(34, 197, 94, 0)',
    ],
    transition: {
      duration: 0.6,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Error glow effect */
  errorGlow: {
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0)',
      '0 0 0 10px rgba(239, 68, 68, 0.3)',
      '0 0 0 20px rgba(239, 68, 68, 0)',
    ],
    transition: {
      duration: 0.6,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Warning pulse */
  warningPulse: {
    scale: [1, 1.05, 1],
    backgroundColor: [
      'hsl(var(--warning))',
      'hsl(var(--warning) / 0.8)',
      'hsl(var(--warning))',
    ],
    transition: {
      duration: 1,
      repeat: 3,
      ease: ANIMATION_EASING.inOut,
    },
  },
} as const

/**
 * Loading Animations
 */
export const LoadingAnimations = {
  /** Spinner rotation */
  spinner: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  /** Pulsing loader */
  pulse: {
    opacity: [0.5, 1, 0.5],
    scale: [0.95, 1, 0.95],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Shimmer effect */
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  /** Bouncing dots wave */
  dotsWave: (index: number) => ({
    y: [-10, 10, -10],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: ANIMATION_EASING.inOut,
      delay: index * 0.15,
    },
  }),

  /** Elastic dots */
  dotsElastic: (index: number) => ({
    scale: [0.8, 1.2, 0.8],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: ANIMATION_EASING.spring,
      delay: index * 0.15,
    },
  }),

  /** Progress bar fill */
  progressFill: {
    scaleX: [0, 1],
    transition: {
      duration: 1,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Skeleton shimmer */
  skeletonShimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
} as const

/**
 * Hover & Focus Animations
 */
export const InteractionAnimations = {
  /** Lift on hover */
  lift: {
    hover: {
      y: -4,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      transition: { duration: ANIMATION_DURATION.fast / 1000 },
    },
  },

  /** Glow on hover */
  glow: {
    hover: {
      boxShadow: '0 0 20px var(--primary-glow, rgba(102, 126, 234, 0.4))',
      transition: { duration: ANIMATION_DURATION.fast / 1000 },
    },
  },

  /** Scale on hover */
  scale: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },

  /** Rotate on hover */
  rotate: {
    hover: { rotate: 5 },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },

  /** Brightness on hover */
  brighten: {
    hover: { filter: 'brightness(1.1)' },
    transition: { duration: ANIMATION_DURATION.instant / 1000 },
  },

  /** Focus ring pulse */
  focusPulse: {
    boxShadow: [
      '0 0 0 0 rgba(var(--primary-rgb), 0)',
      '0 0 0 4px rgba(var(--primary-rgb), 0.3)',
      '0 0 0 4px rgba(var(--primary-rgb), 0)',
    ],
    transition: {
      duration: 0.6,
      ease: ANIMATION_EASING.out,
    },
  },
} as const

/**
 * Entry & Exit Animations
 */
export const TransitionAnimations = {
  /** Fade in */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATION.normal / 1000 },
  },

  /** Slide up */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Slide down */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Slide left */
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Slide right */
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Zoom in */
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: ANIMATION_EASING.spring,
    },
  },

  /** Zoom out */
  zoomOut: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: ANIMATION_EASING.out,
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

  /** Flip in */
  flipIn: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
    transition: {
      duration: ANIMATION_DURATION.slow / 1000,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Rotate in */
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
    transition: {
      duration: ANIMATION_DURATION.slow / 1000,
      ease: ANIMATION_EASING.out,
    },
  },
} as const

/**
 * List Animations
 */
export const ListAnimations = {
  /** Staggered container */
  container: (staggerDelay = 0.05): Variants => ({
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerDelay / 2,
        staggerDirection: -1,
      },
    },
  }),

  /** List item */
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: ANIMATION_DURATION.fast / 1000 },
  },

  /** Cascade from left */
  cascadeLeft: (index: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      delay: index * 0.05,
      duration: ANIMATION_DURATION.fast / 1000,
      ease: ANIMATION_EASING.out,
    },
  }),

  /** Cascade from right */
  cascadeRight: (index: number) => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      delay: index * 0.05,
      duration: ANIMATION_DURATION.fast / 1000,
      ease: ANIMATION_EASING.out,
    },
  }),
} as const

/**
 * Attention Seekers
 * Use sparingly for important notifications
 */
export const AttentionAnimations = {
  /** Gentle bounce */
  bounce: {
    y: [0, -20, 0, -10, 0, -5, 0],
    transition: {
      duration: 1,
      ease: ANIMATION_EASING.out,
    },
  },

  /** Swing */
  swing: {
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    transition: {
      duration: 1,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Jello */
  jello: {
    skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
    skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0],
    transition: {
      duration: 1,
      ease: ANIMATION_EASING.inOut,
    },
  },

  /** Head shake */
  headShake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    rotate: [0, -5, 5, -3, 3, -2, 2, 0],
    transition: {
      duration: 1,
      ease: ANIMATION_EASING.inOut,
    },
  },
} as const

/**
 * Typography Animations
 */
export const TypographyAnimations = {
  /** Character reveal */
  revealChar: (index: number) => ({
    opacity: [0, 1],
    y: [10, 0],
    transition: {
      delay: index * 0.03,
      duration: 0.3,
      ease: ANIMATION_EASING.out,
    },
  }),

  /** Typing cursor */
  typingCursor: {
    opacity: [1, 1, 0, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'step-end',
    },
  },

  /** Text gradient shimmer */
  textShimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
} as const

/**
 * Helper function to create ripple effect
 * Returns an object with ripple animation properties
 */
export const createRipple = (x: number, y: number, size: number) => ({
  x,
  y,
  width: size,
  height: size,
  borderRadius: '50%',
  position: 'absolute' as const,
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'currentColor',
  opacity: 0.3,
  pointerEvents: 'none' as const,
  animation: {
    scale: [0, 2],
    opacity: [0.3, 0],
  },
  transition: {
    duration: 0.6,
    ease: ANIMATION_EASING.out,
  },
})

/**
 * Type exports
 */
export type FeedbackAnimation = keyof typeof FeedbackAnimations
export type StateAnimation = keyof typeof StateAnimations
export type LoadingAnimation = keyof typeof LoadingAnimations
export type InteractionAnimation = keyof typeof InteractionAnimations
export type TransitionAnimation = keyof typeof TransitionAnimations
export type AttentionAnimation = keyof typeof AttentionAnimations
