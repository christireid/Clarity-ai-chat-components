'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button, Badge } from '@clarity-chat/primitives'
import { BotIcon } from '../ui/icons'
import { duration } from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

export interface ChatWindowHeaderProps {
  show: boolean
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showMessageCount: boolean
  messageCountText: string | null
  onExport?: () => void
  onClear?: () => void
  normalizedMessagesLength: number
}

export function ChatWindowHeader({
  show,
  title,
  subtitle,
  actions,
  showMessageCount,
  messageCountText,
  onExport,
  onClear,
  normalizedMessagesLength,
}: ChatWindowHeaderProps) {
  const prefersReducedMotion = useReducedMotion()

  if (!show) return null

  return (
    <motion.div
      className="flex items-center justify-between gap-4 border-b border-border/60 bg-card/50 px-5 py-4 sm:px-6 backdrop-blur-md"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration('slow'),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25">
          <BotIcon size={22} />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5 pl-0.5">
          <h2 className="text-sm font-bold text-foreground truncate leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground/80 truncate leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {showMessageCount && messageCountText && (
          <Badge
            variant="secondary"
            className="shrink-0"
            aria-label={messageCountText}
          >
            {messageCountText}
          </Badge>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {actions}

        {onExport && normalizedMessagesLength > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onExport}
            className="gap-2 hover:bg-accent/50 transition-colors"
            title="Export conversation"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}

        {onClear && normalizedMessagesLength > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Clear conversation"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
    </motion.div>
  )
}
