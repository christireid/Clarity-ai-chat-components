/**
 * Motion-Safe Animation Utilities
 *
 * Provides animation variants that automatically respect `prefers-reduced-motion`.
 * When reduced motion is preferred, animations are simplified or disabled entirely.
 */

import type { Variant } from 'framer-motion'

/**
 * Create animation variants that respect reduced motion preferences
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param variants - Animation variants (initial, animate, exit)
 * @param fallbackVariants - Optional simplified variants for reduced motion (default: instant opacity changes)
 * @returns Motion-safe animation variants
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * const variants = getMotionSafeVariants(prefersReducedMotion, {
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   exit: { opacity: 0, y: -20 }
 * })
 *
 * return <motion.div variants={variants} />
 * ```
 */
export function getMotionSafeVariants<T extends Record<string, Variant>>(
  reducedMotion: boolean,
  variants: T,
  fallbackVariants?: Partial<T>
): T {
  if (!reducedMotion) {
    return variants
  }

  // Default fallback: instant opacity changes only
  const defaultFallback: Record<string, Variant> = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (fallbackVariants || defaultFallback) as T
}

/**
 * Get motion-safe transition settings
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param transition - Transition configuration
 * @returns Motion-safe transition (instant if reduced motion)
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={getMotionSafeTransition(prefersReducedMotion, {
 *     duration: 0.3,
 *     ease: 'easeOut'
 *   })}
 * />
 * ```
 */
export function getMotionSafeTransition(
  reducedMotion: boolean,
  transition: Record<string, unknown>
): Record<string, unknown> {
  if (reducedMotion) {
    return { duration: 0 }
  }
  return transition
}

/**
 * Get motion-safe duration
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param duration - Duration in seconds
 * @returns 0 if reduced motion, original duration otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={{ duration: getMotionSafeDuration(prefersReducedMotion, 0.3) }}
 * />
 * ```
 */
export function getMotionSafeDuration(
  reducedMotion: boolean,
  duration: number
): number {
  return reducedMotion ? 0 : duration
}

/**
 * Get motion-safe scale value
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param scale - Scale value
 * @returns 1 if reduced motion (no scale), original scale otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   whileHover={{ scale: getMotionSafeScale(prefersReducedMotion, 1.05) }}
 * />
 * ```
 */
export function getMotionSafeScale(
  reducedMotion: boolean,
  scale: number
): number {
  return reducedMotion ? 1 : scale
}

/**
 * Get motion-safe animation value
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param value - Animation value
 * @param fallback - Fallback value for reduced motion (default: 0)
 * @returns Fallback if reduced motion, original value otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={{
 *     y: getMotionSafeValue(prefersReducedMotion, 20, 0),
 *     rotate: getMotionSafeValue(prefersReducedMotion, 45, 0)
 *   }}
 * />
 * ```
 */
export function getMotionSafeValue<T>(
  reducedMotion: boolean,
  value: T,
  fallback: T = 0 as T
): T {
  return reducedMotion ? fallback : value
}

/**
 * Common motion-safe animation presets
 */
export const MOTION_SAFE_PRESETS = {
  /**
   * Fade in/out - safe for reduced motion (opacity only)
   */
  fade: {
    full: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },

  /**
   * Slide up - simplified for reduced motion
   */
  slideUp: {
    full: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },

  /**
   * Scale - simplified for reduced motion
   */
  scale: {
    full: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },

  /**
   * Slide and scale - simplified for reduced motion
   */
  slideScale: {
    full: {
      initial: { opacity: 0, y: 10, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 10, scale: 0.95 },
    },
    reduced: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
} as const

/**
 * Get preset variants that respect reduced motion
 *
 * @param reducedMotion - Whether reduced motion is preferred
 * @param preset - Preset name
 * @returns Motion-safe variants
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const variants = getMotionSafePreset(prefersReducedMotion, 'slideUp')
 *
 * <motion.div variants={variants} />
 * ```
 */
export function getMotionSafePreset(
  reducedMotion: boolean,
  preset: keyof typeof MOTION_SAFE_PRESETS
) {
  return reducedMotion
    ? MOTION_SAFE_PRESETS[preset].reduced
    : MOTION_SAFE_PRESETS[preset].full
}
