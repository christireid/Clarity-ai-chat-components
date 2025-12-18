/**
 * ThemeToggle Component
 *
 * Enhanced theme toggle button with smooth animations.
 *
 * @module theme/ThemeToggle
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useTheme } from './use-theme'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../animations/motion-safe'
import { DURATION_SECONDS as durations } from '../animations/constants'

/**
 * Props for ThemeToggle component
 */
export interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ThemeToggle - Enhanced theme toggle button with smooth animations
 *
 * Features:
 * - Smooth icon transitions
 * - Reduced motion support
 * - Loading state during transition
 * - Accessible with ARIA labels
 * - Keyboard support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeToggle />
 *
 * // With label
 * <ThemeToggle showLabel />
 *
 * // Custom className
 * <ThemeToggle className="custom-styles" />
 * ```
 */
export function ThemeToggle({
  className,
  showLabel = false,
  variant = 'ghost',
  size = 'md',
}: ThemeToggleProps) {
  const { mode, toggleMode, theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const handleToggle = React.useCallback(() => {
    setIsTransitioning(true)
    toggleMode()
    setTimeout(() => {
      setIsTransitioning(false)
    }, theme.transitionDuration || 200)
  }, [toggleMode, theme.transitionDuration])

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  }

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline:
      'border border-border/40 hover:bg-accent/50 hover:border-primary/50',
    ghost: 'hover:bg-accent/50',
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isTransitioning}
      whileHover={{
        scale: getMotionSafeValue(prefersReducedMotion, 1.05, 1),
      }}
      whileTap={{
        scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1),
      }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2.5 rounded-lg',
        'transition-all duration-150 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        showLabel && 'px-3.5',
        className
      )}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{
            rotate: getMotionSafeValue(prefersReducedMotion, -90, 0),
            opacity: 0,
            scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
          }}
          animate={{
            rotate: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            rotate: getMotionSafeValue(prefersReducedMotion, 90, 0),
            opacity: 0,
            scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
          }}
          transition={{
            duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
            ease: 'easeOut',
          }}
          className="flex items-center gap-2.5"
        >
          {mode === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {showLabel && (
            <span className="text-sm font-semibold">
              {mode === 'dark' ? 'Light' : 'Dark'}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Loading indicator */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg"
        >
          <motion.div
            animate={{
              rotate: prefersReducedMotion ? 0 : 360,
            }}
            transition={{
              duration: durations.slower,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
        </motion.div>
      )}
    </motion.button>
  )
}

ThemeToggle.displayName = 'ThemeToggle'
