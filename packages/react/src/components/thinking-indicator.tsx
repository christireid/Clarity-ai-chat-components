import * as React from 'react'
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

// Stage icon mapping - extracted to module level to prevent recreation
const STAGE_ICONS: Record<AIStatus['stage'], React.ComponentType<{ size: number }>> = {
  thinking: BotIcon,
  researching: SearchIcon,
  compiling: FileIcon,
  generating: SparklesIcon,
  finalizing: CheckCircleIcon,
}

// Stage label mapping - extracted to module level
const STAGE_LABELS: Record<AIStatus['stage'], string> = {
  thinking: 'Thinking',
  researching: 'Researching',
  compiling: 'Compiling',
  generating: 'Generating',
  finalizing: 'Finalizing',
}

export const ThinkingIndicator = React.memo(function ThinkingIndicator({
  status,
  className,
}: ThinkingIndicatorProps) {
  // Memoize computed values
  const stage = status?.stage || 'thinking'
  const IconComponent = React.useMemo(
    () => STAGE_ICONS[stage] || BotIcon,
    [stage]
  )
  
  const stageLabel = React.useMemo(
    () => STAGE_LABELS[stage] || 'Processing',
    [stage]
  )
  
  const stageIcon = React.useMemo(
    () => <IconComponent size={20} />,
    [IconComponent]
  )

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
        'flex items-center gap-3 rounded-2xl border border-border/60 bg-[hsl(var(--surface-muted))] px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)]',
        className
      )}
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: ANIMATION_EASING.inOut,
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
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: ANIMATION_EASING.inOut,
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
              ease: ANIMATION_EASING.out,
            }}
            className="text-xs text-muted-foreground mt-1"
          >
            {status.topic}
          </motion.p>
        )}

        {/* Progress Bar */}
        {status?.progress !== undefined && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]">
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
      {status?.estimatedCompletion && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs text-muted-foreground"
        >
          ~
          {Math.ceil(
            (status.estimatedCompletion.getTime() - Date.now()) / 1000
          )}
          s
        </motion.span>
      )}
    </motion.div>
  )
})

ThinkingIndicator.displayName = 'ThinkingIndicator'
