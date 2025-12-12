/**
 * Centralized Spring Animation Presets for Framer Motion 12
 *
 * Provides consistent, reusable spring physics configurations across all components.
 * All presets respect user's `prefers-reduced-motion` setting.
 *
 * @packageDocumentation
 */

import type { Transition } from 'framer-motion'
import { DURATION_SECONDS } from './constants'

/**
 * Spring preset types
 */
export type SpringPresetName =
  | 'quick' // Fast, responsive (buttons, tooltips)
  | 'smooth' // Balanced, general-purpose (most UI)
  | 'gentle' // Slow, soft (large modals, sheets)
  | 'bouncy' // Playful, celebration (success states)
  | 'snappy' // Very fast, immediate (context menus)
  | 'elastic' // High bounce (drag interactions)
  | 'cursor' // Specialized for cursors/indicators

/**
 * Spring physics configurations
 *
 * **Damping**: Controls oscillation (10-30)
 * - Lower (10-15): More bounce, playful
 * - Medium (18-22): Balanced, natural
 * - Higher (25-30): Less bounce, smooth
 *
 * **Stiffness**: Controls speed (100-400)
 * - Lower (100-200): Slower, softer
 * - Medium (250-300): Balanced speed
 * - Higher (300-400): Fast, responsive
 */
export const SPRING_PRESETS = {
  /** Fast & responsive - buttons, chips, tooltips */
  quick: {
    type: 'spring' as const,
    damping: 22,
    stiffness: 300,
  },

  /** Smooth & balanced - general UI, modals, cards */
  smooth: {
    type: 'spring' as const,
    damping: 26,
    stiffness: 280,
  },

  /** Gentle & soft - large panels, sidebars, sheets */
  gentle: {
    type: 'spring' as const,
    damping: 30,
    stiffness: 200,
  },

  /** Bouncy & playful - success states, celebrations */
  bouncy: {
    type: 'spring' as const,
    damping: 15,
    stiffness: 300,
  },

  /** Very fast - dropdowns, context menus, tooltips */
  snappy: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 350,
  },

  /** High bounce - drag interactions, gestures */
  elastic: {
    type: 'spring' as const,
    damping: 12,
    stiffness: 200,
  },

  /** Specialized for cursors/typing indicators */
  cursor: {
    type: 'spring' as const,
    damping: 10,
    stiffness: 400,
  },
} as const

/**
 * Get a spring transition that respects reduced motion preferences
 *
 * @param preset - Named spring preset
 * @param prefersReducedMotion - User's motion preference
 * @param overrides - Additional transition properties (delay, duration limit, etc.)
 * @returns Framer Motion transition object
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   transition={getSpring('quick', prefersReducedMotion)}
 * />
 *
 * // With delay
 * <motion.div
 *   transition={getSpring('quick', prefersReducedMotion, { delay: 0.1 })}
 * />
 * ```
 */
export function getSpring(
  preset: SpringPresetName,
  prefersReducedMotion: boolean,
  overrides?: Partial<Transition>
): Transition {
  const baseTransition = SPRING_PRESETS[preset]

  // For reduced motion: use instant tween (no spring physics)
  if (prefersReducedMotion) {
    return {
      type: 'tween',
      duration: DURATION_SECONDS.fast, // Near-instant
      ease: 'linear',
      ...overrides,
    }
  }

  // Normal spring transition
  return {
    ...baseTransition,
    ...overrides,
  }
}

/**
 * Common spring combinations for specific use cases
 */
export const SPRING_COMBINATIONS = {
  /** Entrance animations (fade + scale + slide) */
  entrance: (
    prefersReducedMotion: boolean,
    preset: SpringPresetName = 'smooth'
  ) => getSpring(preset, prefersReducedMotion),

  /** Exit animations (matching entrance) */
  exit: (prefersReducedMotion: boolean, preset: SpringPresetName = 'quick') =>
    getSpring(preset, prefersReducedMotion),

  /** Staggered children (with delay) */
  stagger: (
    index: number,
    prefersReducedMotion: boolean,
    staggerDelay: number = 0.05,
    preset: SpringPresetName = 'quick'
  ) =>
    getSpring(preset, prefersReducedMotion, {
      delay: prefersReducedMotion ? 0 : index * staggerDelay,
    }),

  /** Layout animations (resize, reorder) */
  layout: (prefersReducedMotion: boolean) => ({
    type: prefersReducedMotion ? 'tween' : ('spring' as const),
    damping: 25,
    stiffness: 300,
    duration: prefersReducedMotion ? 0.01 : undefined,
  }),
} as const

/**
 * Legacy compatibility - gradually migrate to named presets
 * @deprecated Use getSpring() with named presets instead. Will be removed in v3.0.
 * @see {@link getSpring} for the recommended API using named presets
 * @example
 * ```ts
 * // Instead of:
 * const transition = createSpringTransition(15, 100, prefersReducedMotion)
 *
 * // Use:
 * const spring = getSpring('gentle') // or 'snappy', 'bouncy', 'smooth'
 * ```
 */
export function createSpringTransition(
  damping: number,
  stiffness: number,
  prefersReducedMotion: boolean
): Transition {
  if (prefersReducedMotion) {
    return {
      type: 'tween',
      duration: DURATION_SECONDS.fast,
      ease: 'linear',
    }
  }

  return {
    type: 'spring',
    damping,
    stiffness,
  }
}
