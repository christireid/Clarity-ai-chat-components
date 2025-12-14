'use client'

/**
 * AnimatedDots Component
 *
 * Reusable animated dots indicator for loading states, typing indicators,
 * and progress indicators. Supports multiple animation variants and
 * respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatedDots />
 *
 * // With variant
 * <AnimatedDots variant="pulse" />
 *
 * // Customized
 * <AnimatedDots
 *   variant="wave"
 *   count={4}
 *   size="lg"
 *   className="text-primary"
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS as durations } from '../../animations/constants'

/**
 * Animation variants for the dots
 */
export type AnimatedDotsVariant = 'bounce' | 'pulse' | 'wave' | 'fade'

/**
 * Size presets for the dots
 */
export type AnimatedDotsSize = 'sm' | 'md' | 'lg'

/**
 * Props for the AnimatedDots component
 */
export interface AnimatedDotsProps {
  /** Animation variant (default: 'bounce') */
  variant?: AnimatedDotsVariant
  /** Number of dots (default: 3) */
  count?: number
  /** Size preset (default: 'md') */
  size?: AnimatedDotsSize
  /** Custom className for the container */
  className?: string
  /** Custom className for each dot */
  dotClassName?: string
  /** Delay between each dot's animation in seconds (default: 0.15) */
  staggerDelay?: number
  /** Animation duration in seconds (default: varies by variant) */
  duration?: number
}

/**
 * Size configurations
 */
const SIZE_CONFIG = {
  sm: { dot: 'w-1 h-1', gap: 'gap-1' },
  md: { dot: 'w-2 h-2', gap: 'gap-1.5' },
  lg: { dot: 'w-3 h-3', gap: 'gap-2' },
} as const

/**
 * Animation configurations for each variant
 */
const ANIMATION_CONFIG = {
  bounce: {
    animate: { y: [-2, -6, -2], opacity: [0.6, 1, 0.6] },
    transition: { type: 'spring', damping: 10, stiffness: 400 },
    defaultDuration: undefined, // Uses spring physics
  },
  pulse: {
    animate: { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] },
    transition: { ease: 'easeInOut' },
    defaultDuration: 1,
  },
  wave: {
    animate: { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] },
    transition: { ease: 'linear' },
    defaultDuration: 1.2,
  },
  fade: {
    animate: { opacity: [0.3, 1, 0.3] },
    transition: { ease: 'easeInOut' },
    defaultDuration: 1.4,
  },
} as const

/**
 * Reduced motion animation (subtle opacity only)
 */
const REDUCED_MOTION_ANIMATE = { opacity: [0.5, 0.8, 0.5] }

/**
 * AnimatedDots - Reusable animated dots indicator
 *
 * A lightweight, accessible component for displaying animated dots.
 * Perfect for loading states, typing indicators, and progress feedback.
 *
 * Features:
 * - Multiple animation variants (bounce, pulse, wave, fade)
 * - Respects prefers-reduced-motion
 * - Customizable size, count, and timing
 * - Accessible with proper aria attributes
 */
export function AnimatedDots({
  variant = 'bounce',
  count = 3,
  size = 'md',
  className,
  dotClassName,
  staggerDelay = 0.15,
  duration,
}: AnimatedDotsProps) {
  const prefersReducedMotion = useReducedMotion()
  const sizeConfig = SIZE_CONFIG[size]
  const animationConfig = ANIMATION_CONFIG[variant]

  // Validate and clamp count to reasonable bounds (1-10)
  const safeCount = React.useMemo(
    () => Math.max(1, Math.min(10, Math.floor(count))),
    [count]
  )

  // Create array of dot indices
  const dots = React.useMemo(
    () => Array.from({ length: safeCount }, (_, i) => i),
    [safeCount]
  )

  // Determine the animation to use
  const animate = prefersReducedMotion
    ? REDUCED_MOTION_ANIMATE
    : animationConfig.animate

  // Build transition config
  const baseTransition = {
    ...animationConfig.transition,
    duration: duration ?? animationConfig.defaultDuration,
    repeat: Infinity,
  }

  if (prefersReducedMotion) {
    // For reduced motion, use longer duration with simple easing
    return (
      <div
        className={cn('flex items-center', sizeConfig.gap, className)}
        role="status"
        aria-label="Loading"
      >
        {dots.map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            animate={animate}
            transition={{
              duration: durations.slower,
              repeat: Infinity,
              delay: i * staggerDelay,
              ease: 'easeInOut',
            }}
            className={cn(
              'rounded-full bg-current',
              sizeConfig.dot,
              dotClassName
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('flex items-center', sizeConfig.gap, className)}
      role="status"
      aria-label="Loading"
    >
      {dots.map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          animate={animate}
          transition={{
            ...baseTransition,
            delay: i * staggerDelay,
          }}
          className={cn(
            'rounded-full bg-current',
            sizeConfig.dot,
            dotClassName
          )}
        />
      ))}
    </div>
  )
}

AnimatedDots.displayName = 'AnimatedDots'

/**
 * Pre-configured variants as named exports for convenience
 */

/**
 * Bouncing dots animation (default, iMessage-style)
 */
export function BouncingDots(props: Omit<AnimatedDotsProps, 'variant'>) {
  return <AnimatedDots {...props} variant="bounce" />
}

BouncingDots.displayName = 'BouncingDots'

/**
 * Pulsing dots animation (expanding/contracting)
 */
export function PulsingDots(props: Omit<AnimatedDotsProps, 'variant'>) {
  return <AnimatedDots {...props} variant="pulse" />
}

PulsingDots.displayName = 'PulsingDots'

/**
 * Wave dots animation (sequential fade with scale)
 */
export function WaveDots(props: Omit<AnimatedDotsProps, 'variant'>) {
  return <AnimatedDots {...props} variant="wave" />
}

WaveDots.displayName = 'WaveDots'

/**
 * Fading dots animation (opacity only, subtle)
 */
export function FadingDots(props: Omit<AnimatedDotsProps, 'variant'>) {
  return <AnimatedDots {...props} variant="fade" />
}

FadingDots.displayName = 'FadingDots'
