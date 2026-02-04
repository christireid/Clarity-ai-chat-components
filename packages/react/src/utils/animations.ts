// @ts-nocheck
/**
 * Animation Utilities for Clarity Chat
 *
 * Comprehensive animation utilities using framer-motion for smooth,
 * performant UI animations. Includes presets, hooks, and orchestration utilities.
 *
 * Features:
 * - Pre-configured animation presets
 * - Custom animation hooks for common patterns
 * - Reduced motion support for accessibility
 * - Animation orchestration utilities
 *
 * @module animations
 * @example
 * ```typescript
 * import { fadeIn, useMessageAnimation, stagger } from '@clarity-chat/react/utils/animations'
 * import { motion } from 'framer-motion'
 *
 * // Use a preset
 * <motion.div variants={fadeIn}>Hello</motion.div>
 *
 * // Use a hook
 * const { variant, transition } = useMessageAnimation(0)
 *
 * // Stagger animations
 * const staggeredVariants = stagger([fadeIn, slideInUp], { stagger: 0.1 })
 * ```
 */

import * as React from 'react'
import type {
  Variants,
  Transition,
  TargetAndTransition,
  VariantLabels,
} from 'framer-motion'

/**
 * Duration constants for consistent animation timing
 */
export const DURATION = {
  /** Quick animations: 150ms */
  FAST: 0.15,
  /** Standard animations: 300ms */
  NORMAL: 0.3,
  /** Slower animations: 500ms */
  SLOW: 0.5,
  /** Very slow animations: 800ms */
  VERY_SLOW: 0.8,
} as const

/**
 * Easing constants for consistent animation feel
 */
export const EASING = {
  /** Standard easing curve */
  ease: [0.25, 0.46, 0.45, 0.94],
  /** Smooth easing */
  easeInOut: [0.42, 0, 0.58, 1],
  /** Spring-like easing */
  spring: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 10,
    mass: 1,
  },
  /** Bouncy spring */
  bounce: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 12,
    mass: 1,
  },
  /** Gentle spring */
  gentleSpring: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 15,
    mass: 1,
  },
} as const

/**
 * Animation preset: Fade In
 * Animates opacity from 0 to 1
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Animation preset: Fade Out
 * Animates opacity from 1 to 0
 */
export const fadeOut: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 0 },
  exit: { opacity: 0 },
}

/**
 * Animation preset: Slide In from Left
 * Enters with x translation and opacity
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

/**
 * Animation preset: Slide In from Right
 * Enters with x translation and opacity
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
}

/**
 * Animation preset: Slide In from Top
 * Enters with y translation and opacity
 */
export const slideInUp: Variants = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
}

/**
 * Animation preset: Slide In from Bottom
 * Enters with y translation and opacity
 */
export const slideInDown: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
}

/**
 * Animation preset: Scale In
 * Enters with scale and opacity
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * Animation preset: Scale Out
 * Exits with scale and opacity
 */
export const scaleOut: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 0.95 },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * Animation preset: Message Enter
 * For message list items - combined slide and fade
 */
export const messageEnter: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
}

/**
 * Animation preset: Message Exit
 * For message removal - combined slide and fade
 */
export const messageExit: Variants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 0, y: -10, scale: 0.98 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
}

/**
 * Animation preset: Thinking Pulse
 * Subtle pulse animation for thinking indicators
 */
export const thinkingPulse: Variants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: { opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] },
}

/**
 * Animation preset: Tool Card Flip
 * 3D flip animation for tool cards
 */
export const toolCardFlip: Variants = {
  initial: { rotateY: 0, opacity: 1 },
  animate: { rotateY: 360, opacity: 1 },
  exit: { rotateY: 0, opacity: 0 },
}

/**
 * Animation preset: Progress Fill
 * Animate progress bar filling
 */
export const progressFill: Variants = {
  initial: { scaleX: 0, transformOrigin: '0%' },
  animate: { scaleX: 1, transformOrigin: '0%' },
  exit: { scaleX: 0, transformOrigin: '0%' },
}

/**
 * Get reduced motion variants based on prefers-reduced-motion
 * Falls back to instant transitions when reduced motion is preferred
 */
export function getReducedMotionVariants(
  variants: Variants,
  prefersReducedMotion?: boolean
): Variants {
  if (prefersReducedMotion === undefined) {
    // Check at runtime if not explicitly provided
    if (typeof window !== 'undefined') {
      prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    }
  }

  if (!prefersReducedMotion) {
    return variants
  }

  // Return variants with instant transitions
  return {
    initial: variants.initial,
    animate: variants.animate,
    exit: variants.exit,
  }
}

/**
 * Check if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

/**
 * Configuration for animation orchestration
 */
export interface AnimationOrchestrationConfig {
  /** Delay between items in milliseconds */
  stagger?: number
  /** Direction for stagger: 'forward' or 'reverse' */
  direction?: 'forward' | 'reverse'
  /** Delay before animation starts in milliseconds */
  delayChildren?: number
}

/**
 * Stagger animation configuration
 */
export interface StaggerConfig extends AnimationOrchestrationConfig {
  /** Container variant that controls child stagger */
  containerVariant?: string
  /** Child variant name */
  childVariant?: string
}

/**
 * Create a staggered variant for animating lists
 *
 * @param variants - Base variants to apply
 * @param config - Stagger configuration
 * @returns Container variants with staggered children
 *
 * @example
 * ```typescript
 * const containerVariants = stagger(fadeIn, { stagger: 0.1 })
 * <motion.div variants={containerVariants} initial="initial" animate="animate">
 *   {items.map((item, i) => (
 *     <motion.div key={i} variants={fadeIn}>
 *       {item}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export function stagger(
  variants: Variants,
  config: StaggerConfig = {}
): Variants {
  const {
    stagger: staggerAmount = 0.1,
    direction = 'forward',
    delayChildren = 0,
    containerVariant = 'animate',
  } = config

  return {
    initial: 'initial',
    [containerVariant]: {
      transition: {
        staggerChildren: staggerAmount,
        delayChildren: delayChildren / 1000, // Convert ms to seconds
        direction: direction === 'reverse' ? -1 : 1,
      },
    },
  }
}

/**
 * Create sequential animation configuration
 *
 * @param transitions - Array of transitions to sequence
 * @param delayMs - Delay between transitions in milliseconds
 * @returns Orchestrated transition
 *
 * @example
 * ```typescript
 * const sequentialTransition = sequence([
 *   { duration: 0.3 },
 *   { duration: 0.2 },
 *   { duration: 0.4 }
 * ], 100)
 * ```
 */
export function sequence(
  transitions: Transition[],
  delayMs: number = 0
): Transition {
  return {
    ...transitions[0],
    delay: delayMs / 1000,
  }
}

/**
 * Create parallel animation configuration
 * All animations run simultaneously
 *
 * @param transition - Base transition config
 * @returns Parallel transition
 *
 * @example
 * ```typescript
 * const parallelTransition = parallel({
 *   duration: 0.3,
 *   ease: 'easeInOut'
 * })
 * ```
 */
export function parallel(transition: Transition): Transition {
  return {
    ...transition,
  }
}

/**
 * Merge multiple variants together
 *
 * @param variants - Multiple variant objects
 * @returns Merged variants
 *
 * @example
 * ```typescript
 * const combined = mergeVariants(fadeIn, slideInUp)
 * ```
 */
export function mergeVariants(...variantsList: Variants[]): Variants {
  const merged: Variants = {}

  for (const variants of variantsList) {
    for (const key in variants) {
      const state = key as keyof Variants
      if (merged[state]) {
        // Merge properties from both variants
        merged[state] = {
          ...merged[state],
          ...(variants[state] as object),
        }
      } else {
        merged[state] = variants[state]
      }
    }
  }

  return merged
}

/**
 * Hook for message animation with stagger support
 *
 * @param index - Index of the message in the list
 * @param staggerDelay - Delay between messages in milliseconds
 * @returns Animated variant and transition config
 *
 * @example
 * ```typescript
 * const { variant, transition } = useMessageAnimation(0, 50)
 * <motion.div variants={variant} transition={transition}>
 *   Message content
 * </motion.div>
 * ```
 */
export function useMessageAnimation(
  index: number,
  staggerDelay: number = 50
): { variant: Variants; transition: Transition } {
  const prefersReducedMotion = useReducedMotion()

  const variant: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        delay: (index * staggerDelay) / 1000,
        duration: DURATION.NORMAL,
        ease: EASING.easeInOut,
      }

  return { variant, transition }
}

/**
 * Hook for streaming text animation
 *
 * @param isStreaming - Whether text is currently streaming
 * @param showCursor - Whether to show cursor blink
 * @returns Animation state and handlers
 *
 * @example
 * ```typescript
 * const streaming = useStreamingAnimation(true)
 * <motion.span animate={streaming.cursorAnimation}>
 *   │
 * </motion.span>
 * ```
 */
export function useStreamingAnimation(
  isStreaming: boolean = false,
  showCursor: boolean = true
): {
  cursorAnimation: TargetAndTransition
  containerVariant: VariantLabels
  textVariant: VariantLabels
  isActive: boolean
} {
  const prefersReducedMotion = useReducedMotion()

  const cursorAnimation: TargetAndTransition = prefersReducedMotion
    ? { opacity: 0.7 }
    : {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: DURATION.SLOW,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }

  return {
    cursorAnimation:
      showCursor && isStreaming ? cursorAnimation : { opacity: 0 },
    containerVariant: 'animate',
    textVariant: 'animate',
    isActive: isStreaming,
  }
}

/**
 * Status-based animation configuration
 */
export interface StatusAnimationConfig {
  status: 'idle' | 'loading' | 'success' | 'error'
  pulse?: boolean
  scale?: boolean
}

/**
 * Hook for status-based animations
 *
 * @param status - Current status
 * @param config - Animation options
 * @returns Variants and transition for the status
 *
 * @example
 * ```typescript
 * const statusAnimation = useStatusAnimation('loading')
 * <motion.div variants={statusAnimation.variant}>
 *   Loading...
 * </motion.div>
 * ```
 */
export function useStatusAnimation(
  status: 'idle' | 'loading' | 'success' | 'error',
  config: Partial<StatusAnimationConfig> = {}
): { variant: Variants; transition: Transition } {
  const { pulse = true, scale = false } = config
  const prefersReducedMotion = useReducedMotion()

  let variant: Variants = {}

  switch (status) {
    case 'loading':
      variant = {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          ...(pulse && { scale: [1, scale ? 1.05 : 1] }),
        },
      }
      break

    case 'success':
      variant = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }
      break

    case 'error':
      variant = {
        initial: { opacity: 0, x: -10 },
        animate: {
          opacity: 1,
          x: [0, 5, -5, 0],
        },
        exit: { opacity: 0, x: -10 },
      }
      break

    default: // idle
      variant = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
  }

  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: DURATION.NORMAL,
        ease: EASING.easeInOut,
        repeat: status === 'loading' && pulse ? Infinity : 0,
        repeatType: 'loop',
      }

  return { variant, transition }
}

/**
 * Hook to detect if animations are being used
 * Useful for performance monitoring
 */
export function useAnimationPerformance(): {
  prefersReducedMotion: boolean
  isSupported: boolean
  supportsGPUAcceleration: boolean
} {
  const prefersReducedMotion = useReducedMotion()
  const [supportsGPUAcceleration, setSupportsGPUAcceleration] =
    React.useState(true)

  React.useEffect(() => {
    // Check if browser supports GPU-accelerated properties
    const test = document.createElement('div')
    const style = test.style as any
    const transforms = [
      'transform',
      'WebkitTransform',
      'MozTransform',
      'OTransform',
      'msTransform',
    ]

    const hasSupport = transforms.some((t) => t in style)
    setSupportsGPUAcceleration(hasSupport)
  }, [])

  return {
    prefersReducedMotion,
    isSupported: true,
    supportsGPUAcceleration,
  }
}

/**
 * Animation presets object for easy access
 */
export const ANIMATION_PRESETS = {
  fadeIn,
  fadeOut,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideInDown,
  scaleIn,
  scaleOut,
  messageEnter,
  messageExit,
  thinkingPulse,
  toolCardFlip,
  progressFill,
} as const

/**
 * Get all available animation presets
 */
export function getAnimationPresets(): typeof ANIMATION_PRESETS {
  return ANIMATION_PRESETS
}

/**
 * Transition presets for common durations
 */
export const TRANSITION_PRESETS = {
  fast: {
    duration: DURATION.FAST,
    ease: EASING.easeInOut,
  },
  normal: {
    duration: DURATION.NORMAL,
    ease: EASING.easeInOut,
  },
  slow: {
    duration: DURATION.SLOW,
    ease: EASING.easeInOut,
  },
  spring: {
    ...EASING.spring,
    duration: DURATION.NORMAL,
  },
  gentleSpring: {
    ...EASING.gentleSpring,
    duration: DURATION.NORMAL,
  },
} as const

/**
 * Type for animation preset keys
 */
export type AnimationPresetKey = keyof typeof ANIMATION_PRESETS

/**
 * Type for transition preset keys
 */
export type TransitionPresetKey = keyof typeof TRANSITION_PRESETS

/**
 * Get animation preset by key
 *
 * @param key - The preset key
 * @returns The preset variants
 */
export function getAnimationPreset(key: AnimationPresetKey): Variants {
  return ANIMATION_PRESETS[key]
}

/**
 * Get transition preset by key
 *
 * @param key - The preset key
 * @returns The transition configuration
 */
export function getTransitionPreset(key: TransitionPresetKey): Transition {
  return TRANSITION_PRESETS[key]
}
