/**
 * Feedback Animations
 * 
 * Visual feedback components for success, error, and state changes.
 * Provides delightful animations for user actions.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon,
  InfoIcon,
} from './icons'
import { 
  ANIMATION_DURATION, 
  ANIMATION_EASING,
  // createSuccessAnimation, // Reserved for future use
  // createErrorAnimation, // Reserved for future use
} from '../animations'

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
  React.useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.spring,
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-3 p-6 rounded-lg',
            colorClasses[type],
            className
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: ANIMATION_DURATION.slow / 1000,
              ease: ANIMATION_EASING.spring,
              delay: 0.1,
            }}
          >
            <Icon size={48} />
          </motion.div>
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 45 }}
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.spring,
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
  const [key, setKey] = React.useState(0)

  React.useEffect(() => {
    if (trigger) {
      setKey((prev) => prev + 1)
    }
  }, [trigger])

  return (
    <motion.div
      key={key}
      animate={trigger ? {
        x: [-10, 10, -10, 10, -5, 5, 0],
      } : {}}
      transition={{
        duration: 0.5,
        ease: ANIMATION_EASING.default,
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
  return (
    <motion.div
      animate={active ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      } : {}}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: ANIMATION_EASING.inOut,
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
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <AnimatePresence>
        {ripples.map((id) => (
          <motion.div
            key={id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: ANIMATION_EASING.out }}
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
  const [particles, setParticles] = React.useState<number[]>([])

  React.useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: count }, (_, i) => i)
      setParticles(newParticles)
      
      setTimeout(() => {
        setParticles([])
      }, 2000)
    }
  }, [trigger, count])

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <AnimatePresence>
        {particles.map((i) => (
          <motion.div
            key={i}
            initial={{ 
              x: '50%', 
              y: '50%',
              scale: 0,
              opacity: 1,
            }}
            animate={{ 
              x: `${50 + (Math.random() - 0.5) * 200}%`,
              y: `${50 + (Math.random() - 0.5) * 200}%`,
              scale: 1,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1 + Math.random(),
              ease: ANIMATION_EASING.out,
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: [
                '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'
              ][Math.floor(Math.random() * 6)],
            }}
          />
        ))}
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
  return (
    <motion.div
      animate={active ? {
        boxShadow: [
          `0 0 0 0 ${color}00`,
          `0 0 20px 5px ${color}40`,
          `0 0 0 0 ${color}00`,
        ],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: ANIMATION_EASING.inOut,
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
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 0.9, 1.05, 1],
          }}
          exit={{ scale: 0 }}
          transition={{
            duration: 0.5,
            times: [0, 0.4, 0.6, 0.8, 1],
            ease: ANIMATION_EASING.out,
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
  const Icon = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: AlertCircleIcon,
    info: InfoIcon,
  }[type]

  const colorClasses = {
    success: 'bg-success/10 border-success/20 text-success-foreground',
    error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
    warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
    info: 'bg-info/10 border-info/20 text-info-foreground',
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: position === 'top' ? -20 : 20,
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          exit={{ 
            opacity: 0, 
            y: position === 'top' ? -20 : 20,
          }}
          transition={{
            duration: ANIMATION_DURATION.normal / 1000,
            ease: ANIMATION_EASING.spring,
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm',
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
