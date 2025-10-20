import * as React from 'react'
import { motion } from 'framer-motion'
import type { AIStatus } from '@clarity-chat/types'
import { cn } from '@clarity-chat/primitives'

export interface ThinkingIndicatorProps {
  status?: AIStatus
  className?: string
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  status,
  className,
}) => {
  const getStageIcon = (stage: AIStatus['stage']) => {
    switch (stage) {
      case 'thinking':
        return '🤔'
      case 'researching':
        return '🔍'
      case 'compiling':
        return '📝'
      case 'generating':
        return '✨'
      case 'finalizing':
        return '🎯'
      default:
        return '💭'
    }
  }

  const getStageLabel = (stage: AIStatus['stage']) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('flex items-center gap-3 p-4 rounded-lg bg-muted', className)}
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-2xl"
      >
        {status ? getStageIcon(status.stage) : '💭'}
      </motion.div>

      {/* Status Text */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {status ? getStageLabel(status.stage) : 'Processing'}
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
                }}
                className="w-1.5 h-1.5 rounded-full bg-current"
              />
            ))}
          </div>
        </div>

        {/* Topic/Detail */}
        {status?.topic && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground mt-1"
          >
            {status.topic}
          </motion.p>
        )}

        {/* Progress Bar */}
        {status?.progress !== undefined && (
          <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Estimated Time */}
      {status?.estimatedCompletion && (
        <span className="text-xs text-muted-foreground">
          ~{Math.ceil((status.estimatedCompletion.getTime() - Date.now()) / 1000)}s
        </span>
      )}
    </motion.div>
  )
}
