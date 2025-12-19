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
 * // For typing indicator
 * <AnimatedDots ariaLabel="AI is typing" />
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
  /** Number of dots (default: 3, clamped to 1-10) */
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
  /** Accessible label for screen readers (default: 'Loading') */
  ariaLabel?: string
}

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<AnimatedDotsSize, { dot: string; gap: string }> = {
  sm: { dot: 'w-1 h-1', gap: 'gap-1' },
  md: { dot: 'w-2 h-2', gap: 'gap-1.5' },
  lg: { dot: 'w-3 h-3', gap: 'gap-2' },
}

/**
 * Animation configurations for each variant
 */
const ANIMATION_CONFIG: Record<
  AnimatedDotsVariant,
  {
    animate: Record<string, number[]>
    initial: Record<string, number>
    transition: Record<string, unknown>
    defaultDuration: number | undefined
  }
> = {
  bounce: {
    animate: { y: [-2, -6, -2], opacity: [0.6, 1, 0.6] },
    initial: { y: -2, opacity: 0.6 },
    transition: { type: 'spring', damping: 10, stiffness: 400 },
    defaultDuration: undefined, // Uses spring physics
  },
  pulse: {
    animate: { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] },
    initial: { scale: 1, opacity: 0.5 },
    transition: { ease: 'easeInOut' },
    defaultDuration: 1,
  },
  wave: {
    animate: { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] },
    initial: { opacity: 0.3, scale: 0.9 },
    transition: { ease: 'linear' },
    defaultDuration: 1.2,
  },
  fade: {
    animate: { opacity: [0.3, 1, 0.3] },
    initial: { opacity: 0.3 },
    transition: { ease: 'easeInOut' },
    defaultDuration: 1.4,
  },
}

/**
 * Reduced motion animation (subtle opacity only)
 */
const REDUCED_MOTION_CONFIG = {
  animate: { opacity: [0.5, 0.8, 0.5] },
  initial: { opacity: 0.5 },
}

/**
 * Default values
 */
const DEFAULT_VARIANT: AnimatedDotsVariant = 'bounce'
const DEFAULT_SIZE: AnimatedDotsSize = 'md'
const DEFAULT_COUNT = 3
const MIN_COUNT = 1
const MAX_COUNT = 10

/**
 * Validate and normalize count value
 */
function normalizeCount(count: number | undefined): number {
  if (count === undefined) return DEFAULT_COUNT
  if (!Number.isFinite(count)) return DEFAULT_COUNT
  return Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.floor(count)))
}

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
 * - Safe handling of invalid inputs
 */
export function AnimatedDots({
  variant = DEFAULT_VARIANT,
  count = DEFAULT_COUNT,
  size = DEFAULT_SIZE,
  className,
  dotClassName,
  staggerDelay = 0.15,
  duration,
  ariaLabel = 'Loading',
}: AnimatedDotsProps) {
  const prefersReducedMotion = useReducedMotion()

  // Validate variant with fallback
  const safeVariant = ANIMATION_CONFIG[variant] ? variant : DEFAULT_VARIANT

  // Validate size with fallback
  const safeSize = SIZE_CONFIG[size] ? size : DEFAULT_SIZE

  // Get configs with validation
  const sizeConfig = SIZE_CONFIG[safeSize]
  const animationConfig = ANIMATION_CONFIG[safeVariant]

  // Validate and clamp count to reasonable bounds (1-10)
  const safeCount = React.useMemo(() => normalizeCount(count), [count])

  // Create array of dot indices
  const dots = React.useMemo(
    () => Array.from({ length: safeCount }, (_, i) => i),
    [safeCount]
  )

  // Memoize transition config for stable reference
  const baseTransition = React.useMemo(
    () => ({
      ...animationConfig.transition,
      duration: duration ?? animationConfig.defaultDuration,
      repeat: Infinity,
    }),
    [animationConfig.transition, animationConfig.defaultDuration, duration]
  )

  // Determine animation config based on reduced motion preference
  const { animate, initial } = prefersReducedMotion
    ? REDUCED_MOTION_CONFIG
    : animationConfig

  // Build transition for each dot (considers reduced motion)
  const getTransition = React.useCallback(
    (index: number) => {
      if (prefersReducedMotion) {
        return {
          duration: durations.slower,
          repeat: Infinity,
          delay: index * staggerDelay,
          ease: 'easeInOut' as const,
        }
      }
      return {
        ...baseTransition,
        delay: index * staggerDelay,
      }
    },
    [prefersReducedMotion, baseTransition, staggerDelay]
  )

  return (
    <div
      className={cn('flex items-center', sizeConfig.gap, className)}
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {dots.map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={initial}
          animate={animate}
          transition={getTransition(i)}
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
