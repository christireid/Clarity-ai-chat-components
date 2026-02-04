/**
 * Feedback Animations
 *
 * Visual feedback components for success, error, and state changes.
 * Provides delightful animations for user actions.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  InfoIcon,
} from './icons'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
  // createSuccessAnimation, // Reserved for future use
  // createErrorAnimation, // Reserved for future use
} from '../../animations'

export type FeedbackType = 'success' | 'error' | 'warning' | 'info'

export interface FeedbackAnimationProps {
  /** Type of feedback */
  type: FeedbackType
  /** Show the animation */
  show: boolean
  /** Custom message */
  message?: string
  /** Duration before auto-hide (0 for no auto-hide) */
  duration?: number
  /** Callback when animation completes */
  onComplete?: () => void
  /** Additional className */
  className?: string
}

/**
 * Animated feedback overlay
 */
export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  show,
  message,
  duration = 2000,
  onComplete,
  className,
}) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [show, duration, onComplete])

  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: AlertCircleIcon,
    info: InfoIcon,
  }[type]

  const colorClasses = {
    success: 'bg-success text-success-foreground',
    error: 'bg-destructive text-destructive-foreground',
    warning: 'bg-warning text-warning-foreground',
    info: 'bg-info text-info-foreground',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }
          }
          animate={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
          }
          exit={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }
          }
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: EASING_FRAMER.spring,
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-3 p-6 rounded-lg shadow-md border border-border/50',
            colorClasses[type],
            className
          )}
        >
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }
            }
            transition={{
              duration: ANIMATION_DURATION.slow / 1000,
              ease: EASING_FRAMER.spring,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <Icon size={48} />
          </motion.div>

          {message && (
            <motion.p
              {...(prefersReducedMotion
                ? ANIMATION_PRESETS.fadeIn
                : ANIMATION_PRESETS.slideUp)}
              transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
              className="text-sm font-medium"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Success checkmark animation
 */
export const SuccessCheckmark: React.FC<{
  show: boolean
  size?: number
  className?: string
}> = ({ show, size = 48, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -45 }
          }
          animate={
            prefersReducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }
          }
          exit={
            prefersReducedMotion ? { opacity: 0 } : { scale: 0, rotate: 45 }
          }
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: EASING_FRAMER.spring,
          }}
          className={cn('text-success', className)}
        >
          <CheckCircleIcon size={size} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Error shake animation wrapper
 */
export const ErrorShake: React.FC<{
  trigger: boolean
  children: React.ReactNode
  className?: string
}> = ({ trigger, children, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()
  const [key, setKey] = React.useState(0)

  React.useEffect(() => {
    if (trigger) {
      setKey((prev) => prev + 1)
    }
  }, [trigger])

  return (
    <motion.div
      key={key}
      animate={
        trigger && !prefersReducedMotion
          ? {
              x: [-10, 10, -10, 10, -5, 5, 0],
            }
          : {}
      }
      transition={{
        duration: durations.slow,
        ease: EASING_FRAMER.default,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Pulse animation for attention
 */
export const PulseAttention: React.FC<{
  active: boolean
  children: React.ReactNode
  className?: string
}> = ({ active, children, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={
        active && !prefersReducedMotion
          ? {
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }
          : {}
      }
      transition={{
        duration: durations.slower,
        repeat: Infinity,
        ease: EASING_FRAMER.inOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Ripple effect animation
 */
export const RippleEffect: React.FC<{
  trigger: boolean
  color?: string
  className?: string
}> = ({ trigger, color = 'currentColor', className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()
  const [ripples, setRipples] = React.useState<number[]>([])

  React.useEffect(() => {
    if (trigger) {
      const id = Date.now()
      setRipples((prev) => [...prev, id])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r !== id))
      }, 1000)
    }
  }, [trigger])

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.div
            key={id}
            initial={
              prefersReducedMotion
                ? { opacity: 0.6 }
                : { scale: 0, opacity: 0.6 }
            }
            animate={
              prefersReducedMotion ? { opacity: 0 } : { scale: 2.5, opacity: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: durations.slower, ease: EASING_FRAMER.out }}
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: color }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Confetti animation for celebrations
 */
export const ConfettiEffect: React.FC<{
  trigger: boolean
  count?: number
  className?: string
}> = ({ trigger, count = 20, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = React.useState<number[]>([])

  React.useEffect(() => {
    // Skip animation entirely when reduced motion is preferred
    if (trigger && !prefersReducedMotion) {
      const newParticles = Array.from({ length: count }, (_, i) => i)
      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
      }, 2000)
    }
  }, [trigger, count, prefersReducedMotion])

  // Don't render confetti when reduced motion is preferred
  if (prefersReducedMotion) {
    return null
  }

  const confettiColors = [
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
  ]

  const confettiInitial = {
    x: '50%',
    y: '50%',
    scale: 0,
    opacity: 1,
  }

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      <AnimatePresence>
        {particles.map((i) => {
          const randomX = 50 + (Math.random() - 0.5) * 200
          const randomY = 50 + (Math.random() - 0.5) * 200
          const randomRotate = Math.random() * 360
          const randomDuration = 1 + Math.random()
          const randomColor = confettiColors[Math.floor(Math.random() * 6)]

          const particleAnimate = {
            x: `${randomX}%`,
            y: `${randomY}%`,
            scale: 1,
            opacity: 0,
            rotate: randomRotate,
          }

          return (
            <motion.div
              key={i}
              initial={confettiInitial}
              animate={particleAnimate}
              transition={{
                duration: randomDuration,
                ease: EASING_FRAMER.out,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: randomColor,
              }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/**
 * Glow effect animation
 */
export const GlowEffect: React.FC<{
  active: boolean
  color?: string
  children: React.ReactNode
  className?: string
}> = ({ active, color = 'rgb(var(--primary))', children, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={
        active && !prefersReducedMotion
          ? {
              boxShadow: [
                `0 0 0 0 ${color}00`,
                `0 0 20px 5px ${color}40`,
                `0 0 0 0 ${color}00`,
              ],
            }
          : {}
      }
      transition={{
        duration: durations.slower,
        repeat: Infinity,
        ease: EASING_FRAMER.inOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Bounce animation for success feedback
 */
export const BounceIn: React.FC<{
  show: boolean
  children: React.ReactNode
  className?: string
}> = ({ show, children, className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { scale: [0, 1.2, 0.9, 1.05, 1] }
          }
          exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0 }}
          transition={{
            duration: durations.slow,
            times: prefersReducedMotion ? undefined : [0, 0.4, 0.6, 0.8, 1],
            ease: EASING_FRAMER.out,
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Slide and fade notification
 */
export const SlideNotification: React.FC<{
  show: boolean
  message: string
  type?: FeedbackType
  position?: 'top' | 'bottom'
  className?: string
}> = ({ show, message, type = 'info', position = 'top', className }) => {
  // Accessibility: Respect user's reduced motion preference
  const prefersReducedMotion = useReducedMotion()

  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: AlertCircleIcon,
    info: InfoIcon,
  }[type]

  const colorClasses = {
    success: 'bg-success/10 border-success/20 text-success-foreground',
    error:
      'bg-destructive/10 border-destructive/20 text-destructive-foreground',
    warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
    info: 'bg-info/10 border-info/20 text-info-foreground',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...(prefersReducedMotion
            ? ANIMATION_PRESETS.fadeIn
            : position === 'top'
              ? ANIMATION_PRESETS.slideDown
              : ANIMATION_PRESETS.slideUp)}
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: EASING_FRAMER.spring,
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-lg border border-border/50 backdrop-blur-sm shadow-md',
            colorClasses[type],
            className
          )}
        >
          <Icon size={16} />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
