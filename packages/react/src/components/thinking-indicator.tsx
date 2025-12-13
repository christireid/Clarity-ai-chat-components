'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { AIStatus } from '@clarity-chat/types'
import { cn } from '@clarity-chat/primitives'
import {
  BotIcon,
  SearchIcon,
  FileIcon,
  SparklesIcon,
  CheckCircleIcon,
} from './icons'
import { ANIMATION_DURATION, EASING_FRAMER } from '../animations/constants'
import { useReducedMotion } from '../hooks/use-reduced-motion'

export interface ThinkingIndicatorProps {
  status?: AIStatus
  className?: string
}

/**
 * Get the icon for a given AI status stage
 */
function getStageIcon(stage: AIStatus['stage'] | undefined) {
  const iconProps = { size: 18 }
  switch (stage) {
    case 'thinking':
      return <BotIcon {...iconProps} />
    case 'researching':
      return <SearchIcon {...iconProps} />
    case 'compiling':
      return <FileIcon {...iconProps} />
    case 'generating':
      return <SparklesIcon {...iconProps} />
    case 'finalizing':
      return <CheckCircleIcon {...iconProps} />
    default:
      return <BotIcon {...iconProps} />
  }
}

/**
 * Get the label for a given AI status stage
 */
function getStageLabel(stage: AIStatus['stage'] | undefined): string {
  switch (stage) {
    case 'thinking':
      return 'Thinking'
    case 'researching':
      return 'Researching'
    case 'compiling':
      return 'Compiling'
    case 'generating':
      return 'Generating'
    case 'finalizing':
      return 'Finalizing'
    default:
      return 'Processing'
  }
}

export function ThinkingIndicator({
  status,
  className,
}: ThinkingIndicatorProps) {
  // Respect user's reduced motion preferences
  const prefersReducedMotion = useReducedMotion()

  // Compute derived values
  const stageIcon = getStageIcon(status?.stage || 'thinking')
  const stageLabel = getStageLabel(status?.stage || 'thinking')

  const estimatedSeconds = useMemo(() => {
    if (!status?.estimatedCompletion) return null
    const now = Date.now()
    const completion = status.estimatedCompletion.getTime()
    return Math.max(0, Math.round((completion - now) / 1000))
  }, [status?.estimatedCompletion])

  // Animation variants that respect reduced motion
  const containerVariants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      }

  const iconAnimation = prefersReducedMotion
    ? {} // No animation for reduced motion
    : { scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }

  const dotAnimation = prefersReducedMotion
    ? { opacity: [0.5, 0.8, 0.5] } // Subtle opacity only
    : { opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }

  // Build descriptive aria-label for screen readers
  // Truncate topic for aria-label to prevent overly long announcements
  const truncatedTopic = status?.topic
    ? status.topic.length > 100
      ? `${status.topic.slice(0, 100)}...`
      : status.topic
    : null
  const ariaLabel = truncatedTopic
    ? `AI is ${stageLabel.toLowerCase()}: ${truncatedTopic}${estimatedSeconds !== null ? `, approximately ${estimatedSeconds} seconds remaining` : ''}`
    : `AI is ${stageLabel.toLowerCase()}${estimatedSeconds !== null ? `, approximately ${estimatedSeconds} seconds remaining` : ''}`

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      initial={containerVariants.initial}
      animate={containerVariants.animate}
      exit={containerVariants.exit}
      transition={{
        duration: prefersReducedMotion ? 0.1 : ANIMATION_DURATION.normal / 1000,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border/40 bg-muted/40 px-4 py-3 shadow-md',
        className
      )}
    >
      {/* Animated Icon with Pulse Ring - Fixed size container for stability */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-[32px] h-[32px]">
        {/* Pulse Ring Animation */}
        {!prefersReducedMotion && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full bg-primary/30"
            />
            <motion.div
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: durations.slower,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />
          </>
        )}
        {/* Icon Container */}
        <motion.div
          animate={iconAnimation}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: durations.slower,
                  repeat: Infinity,
                  ease: EASING_FRAMER.inOut,
                }
          }
          className="relative z-10 flex items-center justify-center w-[32px] h-[32px] rounded-full bg-primary/10 text-primary"
        >
          {stageIcon}
        </motion.div>
      </div>

      {/* Status Text - Proper flex layout */}
      <div className="flex-1 min-w-0">
        {/* Label and dots in same row, properly aligned */}
        <div className="flex items-center">
          <span className="font-semibold text-sm leading-none">
            {stageLabel}
          </span>

          {/* Animated Dots - inline with text, properly spaced */}
          <div className="flex items-center gap-[3px] ml-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={dotAnimation}
                transition={{
                  duration: prefersReducedMotion ? 2 : 1.4,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
                className="w-[4px] h-[4px] rounded-full bg-current inline-block"
              />
            ))}
          </div>
        </div>

        {/* Topic/Detail */}
        {status?.topic && (
          <motion.p
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 3 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            transition={{
              duration: prefersReducedMotion
                ? 0.1
                : ANIMATION_DURATION.fast / 1000,
              ease: EASING_FRAMER.out,
            }}
            className="text-xs text-muted-foreground/90 mt-1 truncate"
          >
            {status.topic}
          </motion.p>
        )}

        {/* Progress Bar */}
        {status?.progress !== undefined && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              transition={{
                duration: prefersReducedMotion
                  ? 0.1
                  : ANIMATION_DURATION.slow / 1000,
                ease: EASING_FRAMER.out,
              }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Estimated Time */}
      {estimatedSeconds !== null && (
        <motion.span
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
          }
          animate={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
          }
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
          className="flex-shrink-0 text-xs font-medium text-muted-foreground/90 tabular-nums"
        >
          ~{estimatedSeconds}s
        </motion.span>
      )}
    </motion.div>
  )
}

ThinkingIndicator.displayName = 'ThinkingIndicator'
