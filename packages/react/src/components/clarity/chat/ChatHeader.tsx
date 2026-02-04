'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { MoreVertical, Minimize2, Maximize2, X } from 'lucide-react'
import { Button } from '@clarity-chat/primitives'

/**
 * ChatHeader - Header with title and actions
 */

interface ChatHeaderProps {
  title?: string
  subtitle?: string
  avatar?: React.ReactNode
  actions?: React.ReactNode
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  className?: string
}

export function ChatHeader({
  title = 'Chat',
  subtitle,
  avatar,
  actions,
  onMinimize,
  onMaximize,
  onClose,
  className,
}: ChatHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-3 p-3 border-b border-border',
        className
      )}
      role="banner"
    >
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        {avatar && (
          <div className="shrink-0" aria-hidden="true">
            {avatar}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-neutral-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 shrink-0">
        {actions}

        {onMinimize && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        )}

        {onMaximize && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMaximize}
            className="h-8 w-8"
            aria-label="Maximize chat"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
