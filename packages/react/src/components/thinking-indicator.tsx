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

export const ThinkingIndicator = memo(function ThinkingIndicator({
  status,
  className,
}: ThinkingIndicatorProps) {
  // Memoize icon and label getters to prevent recreation on every render
  const getStageIcon = useCallback((stage: AIStatus['stage']) => {
    const iconProps = { size: 20 }
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
  const estimatedSeconds = useMemo(() => status?.estimatedSeconds ?? null, [status?.estimatedSeconds])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: ANIMATION_DURATION.normal / 1000,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-border/40 bg-card/95 backdrop-blur-sm px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="text-primary"
      >
        {stageIcon}
      </motion.div>

      {/* Status Text */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {stageLabel}
          </span>

          {/* Animated Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="w-1.5 h-1.5 rounded-full bg-current"
              />
            ))}
          </div>
        </div>

        {/* Topic/Detail */}
        {status?.topic && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ANIMATION_DURATION.fast / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-xs text-muted-foreground/80 mt-1"
          >
            {status.topic}
          </motion.p>
        )}

        {/* Progress Bar */}
        {status?.progress !== undefined && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              transition={{
                duration: ANIMATION_DURATION.slow / 1000,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Estimated Time */}
      {estimatedSeconds !== null && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-muted-foreground"
        >
          ~{estimatedSeconds}s
        </motion.span>
      )}
    </motion.div>
  )
})

ThinkingIndicator.displayName = 'ThinkingIndicator'
