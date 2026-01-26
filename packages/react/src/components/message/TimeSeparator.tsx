'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import { ANIMATION_PRESETS } from '../../animations/constants'

export interface TimeSeparatorProps {
  /** The text to display (e.g., "Today", "Yesterday", "Monday") */
  children: React.ReactNode
  /** Optional CSS class name */
  className?: string
}

/**
 * TimeSeparator - Time/date divider for message lists
 *
 * Displays a horizontal line with centered text to separate messages
 * by time periods (e.g., "Today", "Yesterday", "Last Week").
 *
 * **Features:**
 * - Smooth fade-in animation
 * - Sticky positioning option
 * - Semantic markup with proper ARIA
 *
 * @param props - TimeSeparator configuration
 * @param props.children - Text to display in the separator
 * @param props.className - Optional CSS class name
 *
 * @example
 * ```tsx
 * <TimeSeparator>Today</TimeSeparator>
 * <Message ... />
 * <Message ... />
 * <TimeSeparator>Yesterday</TimeSeparator>
 * <Message ... />
 * ```
 */
export function TimeSeparator({ children, className }: TimeSeparatorProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.slideDown)}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              // Framer Motion 12: Spring entrance for time separator
              type: 'spring',
              damping: 20,
              stiffness: 280,
            }
      }
      viewport={{ once: true }}
      className={cn(
        'relative flex items-center justify-center py-4',
        className
      )}
      role="separator"
      aria-label={`Messages from ${children}`}
    >
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />

      {/* Text */}
      <motion.div
        {...(prefersReducedMotion
          ? ANIMATION_PRESETS.fadeIn
          : ANIMATION_PRESETS.scale)}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                // Framer Motion 12: Spring scale for badge
                type: 'spring',
                damping: 18,
                stiffness: 300,
                delay: 0.1,
              }
        }
        viewport={{ once: true }}
        className={cn(
          'px-4 py-1.5 mx-4',
          'text-xs font-bold uppercase tracking-wider',
          'text-muted-foreground/90',
          'bg-muted/60 backdrop-blur-md',
          'border border-border/40',
          'rounded-full shadow-md'
        )}
      >
        {children}
      </motion.div>

      {/* Right line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" />
    </motion.div>
  )
}

TimeSeparator.displayName = 'TimeSeparator'
