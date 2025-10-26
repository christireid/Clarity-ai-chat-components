import * as React from 'react'
import { motion } from 'framer-motion'
import type { AIStatus } from '@clarity-chat/types'
import { cn } from '@clarity-chat/primitives'
import { 
  BotIcon, 
  SearchIcon, 
  FileIcon, 
  SparklesIcon, 
  CheckCircleIcon 
} from './icons'
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants'

export interface ThinkingIndicatorProps {
  status?: AIStatus
  className?: string
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  status,
  className,
}) => {
  const getStageIcon = (stage: AIStatus['stage']) => {
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
      transition={{ 
        duration: ANIMATION_DURATION.normal / 1000,
        ease: ANIMATION_EASING.out,
      }}
      className={cn('flex items-center gap-3 p-4 rounded-lg bg-muted', className)}
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
        {status ? getStageIcon(status.stage) : <BotIcon size={20} />}
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
          <div className="mt-2 h-1 bg-background rounded-full overflow-hidden">
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
          ~{Math.ceil((status.estimatedCompletion.getTime() - Date.now()) / 1000)}s
        </motion.span>
      )}
    </motion.div>
  )
}
