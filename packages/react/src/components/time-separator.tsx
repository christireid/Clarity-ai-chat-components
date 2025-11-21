'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative flex items-center justify-center py-4', className)}
      role="separator"
      aria-label={`Messages from ${children}`}
    >
      {/* Left line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />

      {/* Text */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
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
