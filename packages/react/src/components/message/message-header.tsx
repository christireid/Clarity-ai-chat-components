'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@clarity-chat/primitives'
import { formatRelativeTime } from '../../internal/helpers'
import { duration } from '../../animations/constants'

export interface MessageHeaderProps {
  role: 'user' | 'assistant'
  timestamp?: string | number
  status?: 'sending' | 'sent' | 'error' | 'streaming'
  showTimestamp?: boolean
  isHovered?: boolean
  className?: string
}

export function MessageHeader({
  role,
  timestamp,
  status,
  showTimestamp = true,
  isHovered = false,
  className,
}: MessageHeaderProps) {
  const isUser = role === 'user'

  return (
    <div
      className={`flex items-center ${
        isUser ? 'gap-2 flex-row-reverse' : 'gap-2'
      } ${className || ''}`}
    >
      <h4 className="font-semibold text-sm whitespace-nowrap">
        {isUser ? 'You' : 'AI Assistant'}
      </h4>
      {showTimestamp && timestamp && (
        <>
          <span className="text-muted-foreground/70" aria-hidden="true">
            ·
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: duration('normal') }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground whitespace-nowrap"
          >
            {formatRelativeTime(
              typeof timestamp === 'string' ? new Date(timestamp) : timestamp
            )}
          </motion.span>
        </>
      )}
      {status === 'sending' && (
        <Badge variant="secondary" dot>
          Sending
        </Badge>
      )}
      {status === 'error' && <Badge variant="destructive">Error</Badge>}
    </div>
  )
}
