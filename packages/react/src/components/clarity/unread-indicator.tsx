'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { ChevronDown, MessageSquare, ArrowDown } from 'lucide-react'

// =============================================================================
// UNREAD BADGE
// =============================================================================

interface UnreadBadgeProps {
  count: number
  max?: number
  variant?: 'default' | 'dot' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UnreadBadge({
  count,
  max = 99,
  variant = 'default',
  size = 'md',
  className,
}: UnreadBadgeProps) {
  if (count <= 0) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  const sizeClasses = {
    sm: 'min-w-4 h-4 text-[10px]',
    md: 'min-w-5 h-5 text-xs',
    lg: 'min-w-6 h-6 text-sm',
  }

  if (variant === 'dot') {
    return (
      <span className={cn('w-2.5 h-2.5 rounded-full bg-primary', className)} />
    )
  }

  if (variant === 'pulse') {
    return (
      <span className={cn('relative', className)}>
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium px-1.5',
            sizeClasses[size]
          )}
        >
          {displayCount}
        </span>
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium px-1.5',
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </span>
  )
}

// =============================================================================
// NEW MESSAGES BANNER
// =============================================================================

interface NewMessagesBannerProps {
  count: number
  onClick?: () => void
  onDismiss?: () => void
  position?: 'top' | 'bottom'
  className?: string
}

export function NewMessagesBanner({
  count,
  onClick,
  onDismiss,
  position = 'bottom',
  className,
}: NewMessagesBannerProps) {
  if (count <= 0) return null

  return (
    <div
      className={cn(
        'absolute left-1/2 -translate-x-1/2 z-10',
        position === 'top' ? 'top-2' : 'bottom-2',
        className
      )}
    >
      <Button
        variant="default"
        size="sm"
        onClick={onClick}
        className="rounded-full shadow-lg gap-2 pr-2"
      >
        <MessageSquare className="h-4 w-4" />
        <span>
          {count} new message{count > 1 ? 's' : ''}
        </span>
        <ArrowDown className="h-3 w-3" />
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismiss()
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-primary-foreground/20"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 3l6 6M9 3l-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </Button>
    </div>
  )
}

// =============================================================================
// JUMP TO UNREAD
// =============================================================================

interface JumpToUnreadProps {
  hasUnread: boolean
  unreadCount?: number
  onClick?: () => void
  className?: string
}

export function JumpToUnread({
  hasUnread,
  unreadCount,
  onClick,
  className,
}: JumpToUnreadProps) {
  if (!hasUnread) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn('gap-2', className)}
    >
      <ChevronDown className="h-4 w-4" />
      Jump to unread
      {unreadCount && unreadCount > 0 && (
        <UnreadBadge count={unreadCount} size="sm" />
      )}
    </Button>
  )
}

// =============================================================================
// CONVERSATION UNREAD INDICATOR
// =============================================================================

interface ConversationUnreadProps {
  unreadCount: number
  lastMessagePreview?: string
  lastMessageTime?: Date
  onClick?: () => void
  className?: string
}

export function ConversationUnreadIndicator({
  unreadCount,
  lastMessagePreview,
  lastMessageTime,
  onClick,
  className,
}: ConversationUnreadProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return date.toLocaleDateString()
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors',
        unreadCount > 0 ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {lastMessagePreview && (
          <p
            className={cn('text-sm truncate', unreadCount > 0 && 'font-medium')}
          >
            {lastMessagePreview}
          </p>
        )}
        {lastMessageTime && (
          <p className="text-xs text-muted-foreground">
            {formatTime(lastMessageTime)}
          </p>
        )}
      </div>
      {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
    </div>
  )
}

// =============================================================================
// CHANNEL UNREAD STATE
// =============================================================================

interface ChannelUnreadStateProps {
  channels: Array<{
    id: string
    name: string
    unreadCount: number
    hasMention?: boolean
  }>
  onChannelClick?: (channelId: string) => void
  className?: string
}

export function ChannelUnreadState({
  channels,
  onChannelClick,
  className,
}: ChannelUnreadStateProps) {
  const totalUnread = channels.reduce((sum, c) => sum + c.unreadCount, 0)
  const hasMentions = channels.some((c) => c.hasMention)

  return (
    <div className={cn('space-y-1', className)}>
      {channels
        .filter((c) => c.unreadCount > 0)
        .map((channel) => (
          <div
            key={channel.id}
            onClick={() => onChannelClick?.(channel.id)}
            className={cn(
              'flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-muted',
              channel.hasMention && 'bg-primary/10'
            )}
          >
            <span
              className={cn(
                'text-sm',
                channel.unreadCount > 0 && 'font-medium'
              )}
            >
              # {channel.name}
            </span>
            <div className="flex items-center gap-2">
              {channel.hasMention && (
                <span className="text-xs text-primary">@</span>
              )}
              <UnreadBadge count={channel.unreadCount} size="sm" />
            </div>
          </div>
        ))}
      {totalUnread > 0 && (
        <div className="pt-2 border-t text-xs text-muted-foreground text-center">
          {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
          {hasMentions && ' (including mentions)'}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// USE UNREAD TRACKING HOOK
// =============================================================================

interface UseUnreadTrackingOptions {
  initialUnreadId?: string
  onMarkAsRead?: (messageIds: string[]) => void
}

export function useUnreadTracking(options: UseUnreadTrackingOptions = {}) {
  const { initialUnreadId, onMarkAsRead } = options
  const [firstUnreadId, setFirstUnreadId] = React.useState(initialUnreadId)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const visibleMessagesRef = React.useRef<Set<string>>(new Set())

  const markAsRead = React.useCallback(
    (messageIds: string[]) => {
      visibleMessagesRef.current = new Set([
        ...visibleMessagesRef.current,
        ...messageIds,
      ])
      onMarkAsRead?.(messageIds)

      if (messageIds.includes(firstUnreadId || '')) {
        setFirstUnreadId(undefined)
      }
      setUnreadCount((c) => Math.max(0, c - messageIds.length))
    },
    [firstUnreadId, onMarkAsRead]
  )

  const addUnread = React.useCallback(
    (messageId: string) => {
      if (!firstUnreadId) {
        setFirstUnreadId(messageId)
      }
      setUnreadCount((c) => c + 1)
    },
    [firstUnreadId]
  )

  const clearUnread = React.useCallback(() => {
    setFirstUnreadId(undefined)
    setUnreadCount(0)
  }, [])

  return {
    firstUnreadId,
    unreadCount,
    markAsRead,
    addUnread,
    clearUnread,
  }
}
