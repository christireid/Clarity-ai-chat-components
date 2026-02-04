'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { Check, CheckCheck, Clock, AlertCircle, Eye } from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface ReadReceipt {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  readAt: Date
}

// ============================================================================
// MESSAGE STATUS INDICATOR
// ============================================================================

interface MessageStatusIndicatorProps {
  status: MessageStatus
  timestamp?: Date
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MessageStatusIndicator({
  status,
  timestamp,
  showLabel = false,
  size = 'sm',
  className,
}: MessageStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const statusConfig = {
    sending: {
      icon: Clock,
      label: 'Sending...',
      color: 'text-muted-foreground',
    },
    sent: {
      icon: Check,
      label: 'Sent',
      color: 'text-muted-foreground',
    },
    delivered: {
      icon: CheckCheck,
      label: 'Delivered',
      color: 'text-muted-foreground',
    },
    read: {
      icon: CheckCheck,
      label: 'Read',
      color: 'text-primary',
    },
    failed: {
      icon: AlertCircle,
      label: 'Failed',
      color: 'text-destructive',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const content = (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <Icon className={cn(sizeClasses[size], config.color)} />
      {showLabel && (
        <span className={cn('text-xs', config.color)}>{config.label}</span>
      )}
    </div>
  )

  if (timestamp) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">
              {config.label} at {timestamp.toLocaleTimeString()}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

// ============================================================================
// READ RECEIPT AVATARS
// ============================================================================

interface ReadReceiptAvatarsProps {
  receipts: ReadReceipt[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
}

export function ReadReceiptAvatars({
  receipts,
  maxVisible = 5,
  size = 'sm',
  showTooltip = true,
  className,
}: ReadReceiptAvatarsProps) {
  const visibleReceipts = receipts.slice(0, maxVisible)
  const remainingCount = receipts.length - maxVisible

  const sizeClasses = {
    sm: 'h-4 w-4 text-[8px]',
    md: 'h-5 w-5 text-[10px]',
    lg: 'h-6 w-6 text-xs',
  }

  const avatars = (
    <div className={cn('flex -space-x-1', className)}>
      {visibleReceipts.map((receipt, index) => (
        <div
          key={receipt.id}
          className={cn(
            'rounded-full border-2 border-background bg-muted flex items-center justify-center font-medium',
            sizeClasses[size]
          )}
          style={{ zIndex: visibleReceipts.length - index }}
        >
          {receipt.userAvatar ? (
            <img
              src={receipt.userAvatar || '/placeholder.svg'}
              alt={receipt.userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{receipt.userName.charAt(0).toUpperCase()}</span>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'rounded-full border-2 border-background bg-muted flex items-center justify-center font-medium',
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )

  if (!showTooltip) return avatars

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{avatars}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="space-y-1">
            <p className="text-xs font-medium">Seen by</p>
            {receipts.slice(0, 10).map((receipt) => (
              <p key={receipt.id} className="text-xs text-muted-foreground">
                {receipt.userName} - {receipt.readAt.toLocaleTimeString()}
              </p>
            ))}
            {receipts.length > 10 && (
              <p className="text-xs text-muted-foreground">
                and {receipts.length - 10} others
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ============================================================================
// READ RECEIPT LIST
// ============================================================================

interface ReadReceiptListProps {
  receipts: ReadReceipt[]
  className?: string
}

export function ReadReceiptList({ receipts, className }: ReadReceiptListProps) {
  if (receipts.length === 0) {
    return (
      <div
        className={cn(
          'text-center py-4 text-muted-foreground text-sm',
          className
        )}
      >
        No one has seen this message yet
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {receipts.map((receipt) => (
        <div
          key={receipt.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
        >
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {receipt.userAvatar ? (
              <img
                src={receipt.userAvatar || '/placeholder.svg'}
                alt={receipt.userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {receipt.userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{receipt.userName}</p>
            <p className="text-xs text-muted-foreground">
              Seen at {receipt.readAt.toLocaleString()}
            </p>
          </div>
          <Eye className="h-4 w-4 text-primary" />
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// TYPING INDICATOR WITH STATUS
// ============================================================================

interface TypingStatusProps {
  users: string[]
  maxNames?: number
  className?: string
}

export function TypingStatus({
  users,
  maxNames = 2,
  className,
}: TypingStatusProps) {
  if (users.length === 0) return null

  const displayNames = users.slice(0, maxNames)
  const remainingCount = users.length - maxNames

  let text = ''
  if (displayNames.length === 1) {
    text = `${displayNames[0]} is typing`
  } else if (remainingCount > 0) {
    text = `${displayNames.join(', ')} and ${remainingCount} others are typing`
  } else {
    text = `${displayNames.join(' and ')} are typing`
  }

  return (
    <div
      className={cn('flex items-center gap-2 text-muted-foreground', className)}
    >
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-xs">{text}</span>
    </div>
  )
}

// ============================================================================
// ONLINE STATUS
// ============================================================================

export type OnlineStatus = 'online' | 'away' | 'busy' | 'offline'

interface OnlineStatusIndicatorProps {
  status: OnlineStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function OnlineStatusIndicator({
  status,
  size = 'sm',
  showLabel = false,
  className,
}: OnlineStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  }

  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    away: { color: 'bg-yellow-500', label: 'Away' },
    busy: { color: 'bg-red-500', label: 'Busy' },
    offline: { color: 'bg-muted-foreground', label: 'Offline' },
  }

  const config = statusConfig[status]

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('rounded-full', sizeClasses[size], config.color)} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  )
}

// ============================================================================
// AVATAR WITH STATUS
// ============================================================================

interface AvatarWithStatusProps {
  src?: string
  name: string
  status: OnlineStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarWithStatus({
  src,
  name,
  status,
  size = 'md',
  className,
}: AvatarWithStatusProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const indicatorPosition = {
    sm: 'bottom-0 right-0',
    md: 'bottom-0 right-0',
    lg: 'bottom-0.5 right-0.5',
  }

  const indicatorSize = {
    sm: 'h-2 w-2 border',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-muted-foreground',
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className={cn(
          'rounded-full bg-muted flex items-center justify-center overflow-hidden',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src || '/placeholder.svg'}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-muted-foreground">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span
        className={cn(
          'absolute rounded-full border-background',
          indicatorPosition[size],
          indicatorSize[size],
          statusColors[status]
        )}
      />
    </div>
  )
}

// ============================================================================
// LAST SEEN
// ============================================================================

interface LastSeenProps {
  lastSeen?: Date
  online?: boolean
  className?: string
}

export function LastSeen({
  lastSeen,
  online = false,
  className,
}: LastSeenProps) {
  if (online) {
    return (
      <span className={cn('text-xs text-green-500', className)}>
        Online now
      </span>
    )
  }

  if (!lastSeen) {
    return (
      <span className={cn('text-xs text-muted-foreground', className)}>
        Offline
      </span>
    )
  }

  const now = new Date()
  const diff = now.getTime() - lastSeen.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let timeString = ''
  if (minutes < 1) {
    timeString = 'just now'
  } else if (minutes < 60) {
    timeString = `${minutes}m ago`
  } else if (hours < 24) {
    timeString = `${hours}h ago`
  } else if (days < 7) {
    timeString = `${days}d ago`
  } else {
    timeString = lastSeen.toLocaleDateString()
  }

  return (
    <span className={cn('text-xs text-muted-foreground', className)}>
      Last seen {timeString}
    </span>
  )
}

// ============================================================================
// UNREAD BADGE
// ============================================================================

interface UnreadBadgeProps {
  count: number
  max?: number
  variant?: 'default' | 'dot' | 'muted'
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
  if (count === 0) return null

  if (variant === 'dot') {
    const dotSizes = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    }
    return (
      <span
        className={cn('rounded-full bg-primary', dotSizes[size], className)}
      />
    )
  }

  const sizeClasses = {
    sm: 'h-4 min-w-4 text-[10px] px-1',
    md: 'h-5 min-w-5 text-xs px-1.5',
    lg: 'h-6 min-w-6 text-sm px-2',
  }

  const displayCount = count > max ? `${max}+` : count

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium',
        variant === 'default'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </span>
  )
}
