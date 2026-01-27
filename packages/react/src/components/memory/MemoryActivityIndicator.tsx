'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import { ANIMATION_PRESETS } from '../../animations/constants'
import type { MemoryActivity } from '../../hooks/memory/use-memory-feedback'
import {
  getActivityLabel,
  getActivityIcon,
} from '../../hooks/memory/use-memory-feedback'

export interface MemoryActivityIndicatorProps {
  /** Current memory activity (null if none) */
  activity: MemoryActivity | null
  /** Position of the indicator */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'inline'
  /** Whether to show detailed information */
  showDetails?: boolean
  /** Custom class name */
  className?: string
}

/**
 * Memory Activity Indicator
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Memory - UI Feedback
 *
 * Visual indicator for memory operations (save, search, retrieval).
 * Provides transparency into memory system activity.
 *
 * **Agent-Native Architecture Principle**:
 * "What the user can see, the agent can see" - Memory operations are visible
 * to provide context awareness and transparency.
 *
 * @example
 * ```tsx
 * function ChatWithMemory() {
 *   const { activity } = useMemoryFeedback()
 *
 *   return (
 *     <div className="relative">
 *       <Chat />
 *       <MemoryActivityIndicator
 *         activity={activity}
 *         position="top-right"
 *         showDetails
 *       />
 *     </div>
 *   )
 * }
 * ```
 *
 * **Features:**
 * - Animated entry/exit
 * - Success/error states
 * - Activity counts (for search/retrieval)
 * - Reduced motion support
 * - Customizable positioning
 *
 * @param props - MemoryActivityIndicator configuration
 */
export function MemoryActivityIndicator({
  activity,
  position = 'top-right',
  showDetails = true,
  className,
}: MemoryActivityIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()

  // Position classes
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    inline: 'relative',
  }

  // Animation variants
  const variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.8, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: -10 },
      }

  // Get icon based on activity type
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'save':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        )
      case 'download':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )
      case 'search':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )
      case 'trash':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )
      case 'refresh':
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )
      case 'brain':
      default:
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        )
    }
  }

  return (
    <AnimatePresence>
      {activity && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
          className={cn(
            positionClasses[position],
            'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
            'bg-background/95 backdrop-blur-sm border',
            activity.success === false
              ? 'border-destructive bg-destructive/5'
              : 'border-border',
            className
          )}
          role="status"
          aria-live="polite"
          aria-label={getActivityLabel(activity)}
        >
          {/* Icon with pulse animation */}
          <motion.div
            className={cn(
              'flex items-center justify-center',
              activity.success === false ? 'text-destructive' : 'text-primary'
            )}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.1, 1],
                  }
            }
            transition={{
              duration: durations.slower,
              repeat: 2,
              ease: 'easeInOut',
            }}
          >
            {renderIcon(getActivityIcon(activity.type))}
          </motion.div>

          {/* Label and details */}
          <div className="flex flex-col min-w-0">
            <span
              className={cn(
                'text-sm font-medium',
                activity.success === false
                  ? 'text-destructive'
                  : 'text-foreground'
              )}
            >
              {getActivityLabel(activity)}
            </span>

            {showDetails && (
              <>
                {activity.query && (
                  <span className="text-xs text-muted-foreground truncate">
                    Query: "{activity.query}"
                  </span>
                )}
                {activity.error && (
                  <span className="text-xs text-destructive">
                    {activity.error}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Success checkmark */}
          {activity.success !== false && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              className="text-primary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

MemoryActivityIndicator.displayName = 'MemoryActivityIndicator'
