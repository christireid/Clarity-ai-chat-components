'use client'

/**
 * PreviewMessage Component
 *
 * Displays a single message in the preview pane with role-based styling.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../../utils/cn'
import {
  ANIMATION_PRESETS,
  DURATION_SECONDS,
  EASING_FRAMER,
} from '../../../../animations/constants'
import type { PreviewMessage as PreviewMessageType } from '../types'

export interface PreviewMessageProps {
  /** Message to display */
  message: PreviewMessageType
  /** Whether this message is currently streaming */
  isStreaming?: boolean
  /** Streaming content (if streaming) */
  streamingContent?: string
}

/**
 * Role icons and labels
 */
const ROLE_CONFIG = {
  system: {
    icon: '⚙️',
    label: 'SYSTEM',
    bgClass:
      'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
    textClass: 'text-amber-800 dark:text-amber-200',
  },
  user: {
    icon: '👤',
    label: 'USER',
    bgClass:
      'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50',
    textClass: 'text-blue-800 dark:text-blue-200',
  },
  assistant: {
    icon: '🤖',
    label: 'ASSISTANT',
    bgClass:
      'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50',
    textClass: 'text-green-800 dark:text-green-200',
  },
}

/**
 * Streaming cursor component
 */
function StreamingCursor() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.span
      className="inline-block w-2 h-4 bg-primary ml-0.5"
      animate={{ opacity: prefersReducedMotion ? 1 : [1, 0, 1] }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.slower,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: 'linear',
      }}
    />
  )
}

/**
 * Single message in the preview
 */
export const PreviewMessage = React.memo(function PreviewMessage({
  message,
  isStreaming = false,
  streamingContent,
}: PreviewMessageProps) {
  const config = ROLE_CONFIG[message.role]
  const displayContent = isStreaming ? streamingContent : message.content
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : ANIMATION_PRESETS.slideUp.initial}
      animate={prefersReducedMotion ? false : ANIMATION_PRESETS.slideUp.animate}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
        ease: EASING_FRAMER.out,
      }}
      className={cn('rounded-lg border p-4', config.bgClass)}
    >
      {/* Header */}
      <div className={cn('flex items-center gap-2 mb-2', config.textClass)}>
        <span>{config.icon}</span>
        <span className="text-xs font-semibold tracking-wider">
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div className="text-sm text-foreground whitespace-pre-wrap break-words">
        {displayContent}
        {isStreaming && <StreamingCursor />}
      </div>
    </motion.div>
  )
})

export default PreviewMessage
