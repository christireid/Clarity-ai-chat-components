'use client'

import { memo, useMemo, useCallback } from 'react'
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
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

export interface ThinkingIndicatorProps {
  status?: AIStatus
  className?: string
}

export function ThinkingIndicator({
  status,
  className,
}: ThinkingIndicatorProps) {
  // Memoize icon and label getters to prevent recreation on every render
  const getStageIcon = useCallback((stage: AIStatus['stage']) => {
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
  }, [])

  const getStageLabel = useCallback((stage: AIStatus['stage']) => {
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
  }, [])

  // Compute values from status
  const stageIcon = useMemo(() => getStageIcon(status?.stage || 'thinking'), [status?.stage, getStageIcon])
  const stageLabel = useMemo(() => getStageLabel(status?.stage || 'thinking'), [status?.stage, getStageLabel])
  const estimatedSeconds = useMemo(() => {
    if (!status?.estimatedCompletion) return null
    const now = Date.now()
    const completion = status.estimatedCompletion.getTime()
    return Math.max(0, Math.round((completion - now) / 1000))
  }, [status?.estimatedCompletion])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: ANIMATION_DURATION.normal / 1000,
        ease: ANIMATION_EASING.out,
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border/40 bg-muted/40 px-4 py-3 shadow-md',
        className
      )}
    >
      {/* Animated Icon - Fixed size container for stability */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: ANIMATION_EASING.inOut,
        }}
        className="flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] text-primary"
      >
        {stageIcon}
      </motion.div>

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
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.85, 1, 0.85],
                }}
                transition={{
                  duration: 1.4,
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
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION.fast / 1000,
              ease: ANIMATION_EASING.out,
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
                duration: ANIMATION_DURATION.slow / 1000,
                ease: ANIMATION_EASING.out,
              }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Estimated Time */}
      {estimatedSeconds !== null && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 text-xs font-medium text-muted-foreground/90 tabular-nums"
        >
          ~{estimatedSeconds}s
        </motion.span>
      )}
    </motion.div>
  )
}

ThinkingIndicator.displayName = 'ThinkingIndicator'
