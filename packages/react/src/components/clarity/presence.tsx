'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export type PresenceStatus =
  | 'online'
  | 'offline'
  | 'away'
  | 'busy'
  | 'invisible'

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'reconnecting'
  | 'error'

export interface User {
  id: string
  name: string
  avatar?: string
  status: PresenceStatus
  lastSeen?: Date
  isTyping?: boolean
  customStatus?: string
}

// =============================================================================
// PRESENCE DOT
// =============================================================================

interface PresenceDotProps {
  status: PresenceStatus
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
}

const statusColors: Record<PresenceStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  invisible: 'bg-gray-400',
}

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export function PresenceDot({
  status,
  size = 'md',
  pulse = true,
  className,
}: PresenceDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn('rounded-full', statusColors[status], sizeClasses[size])}
      />
      {pulse && status === 'online' && (
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75',
            sizeClasses[size]
          )}
        />
      )}
    </span>
  )
}

// =============================================================================
// USER PRESENCE
// =============================================================================

interface UserPresenceProps {
  user: User
  showName?: boolean
  showStatus?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const avatarSizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

export function UserPresence({
  user,
  showName = true,
  showStatus = false,
  size = 'md',
  className,
}: UserPresenceProps) {
  const getLastSeenText = (lastSeen?: Date) => {
    if (!lastSeen) return 'Unknown'
    const now = new Date()
    const diff = now.getTime() - lastSeen.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <div className="relative">
              <Avatar className={avatarSizes[size]}>
                <AvatarImage
                  src={user.avatar || '/placeholder.svg'}
                  alt={user.name}
                />
                <AvatarFallback className="text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <PresenceDot
                status={user.status}
                size="sm"
                className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background rounded-full"
              />
            </div>
            {showName && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                {showStatus && user.customStatus && (
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user.customStatus}
                  </span>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground capitalize">{user.status}</p>
            {user.status === 'offline' && user.lastSeen && (
              <p className="text-xs text-muted-foreground">
                Last seen: {getLastSeenText(user.lastSeen)}
              </p>
            )}
            {user.isTyping && <p className="text-xs text-primary">Typing...</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =============================================================================
// PRESENCE LIST
// =============================================================================

interface PresenceListProps {
  users: User[]
  maxVisible?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PresenceList({
  users,
  maxVisible = 5,
  size = 'md',
  className,
}: PresenceListProps) {
  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = users.length - maxVisible

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <UserPresence
            key={user.id}
            user={user}
            showName={false}
            size={size}
            className="ring-2 ring-background rounded-full"
          />
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium ring-2 ring-background',
              avatarSizes[size]
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// CONNECTION STATUS
// =============================================================================

interface ConnectionStatusProps {
  status: ConnectionStatus
  onRetry?: () => void
  showLabel?: boolean
  className?: string
}

export function ConnectionStatusIndicator({
  status,
  onRetry,
  showLabel = true,
  className,
}: ConnectionStatusProps) {
  const statusConfig: Record<
    ConnectionStatus,
    { icon: React.ReactNode; label: string; color: string }
  > = {
    connected: {
      icon: <Wifi className="h-4 w-4" />,
      label: 'Connected',
      color: 'text-green-500',
    },
    connecting: {
      icon: <RefreshCw className="h-4 w-4 animate-spin" />,
      label: 'Connecting...',
      color: 'text-yellow-500',
    },
    disconnected: {
      icon: <WifiOff className="h-4 w-4" />,
      label: 'Disconnected',
      color: 'text-gray-500',
    },
    reconnecting: {
      icon: <RefreshCw className="h-4 w-4 animate-spin" />,
      label: 'Reconnecting...',
      color: 'text-yellow-500',
    },
    error: {
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Connection Error',
      color: 'text-red-500',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={cn('flex items-center gap-2', config.color, className)}>
      {config.icon}
      {showLabel && <span className="text-sm">{config.label}</span>}
      {(status === 'disconnected' || status === 'error') && onRetry && (
        <button
          onClick={onRetry}
          className="text-xs underline hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// =============================================================================
// TYPING AWARENESS
// =============================================================================

interface TypingAwarenessProps {
  users: User[]
  maxNames?: number
  className?: string
}

export function TypingAwareness({
  users,
  maxNames = 2,
  className,
}: TypingAwarenessProps) {
  const typingUsers = users.filter((u) => u.isTyping)

  if (typingUsers.length === 0) return null

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing`
    }
    if (typingUsers.length <= maxNames) {
      const names = typingUsers.map((u) => u.name)
      return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are typing`
    }
    return `${typingUsers.length} people are typing`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex -space-x-1">
        {typingUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-5 w-5 ring-1 ring-background">
            <AvatarImage
              src={user.avatar || '/placeholder.svg'}
              alt={user.name}
            />
            <AvatarFallback className="text-[10px]">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>{getTypingText()}</span>
      <span className="flex gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </span>
    </div>
  )
}

// =============================================================================
// WHO'S HERE
// =============================================================================

interface WhosHereProps {
  users: User[]
  currentUserId?: string
  className?: string
}

export function WhosHere({ users, currentUserId, className }: WhosHereProps) {
  const onlineUsers = users.filter(
    (u) => u.status === 'online' && u.id !== currentUserId
  )
  const awayUsers = users.filter(
    (u) => u.status === 'away' && u.id !== currentUserId
  )

  return (
    <div className={cn('space-y-3', className)}>
      {onlineUsers.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Online ({onlineUsers.length})
          </h4>
          <div className="space-y-1">
            {onlineUsers.map((user) => (
              <UserPresence key={user.id} user={user} showStatus size="sm" />
            ))}
          </div>
        </div>
      )}
      {awayUsers.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Away ({awayUsers.length})
          </h4>
          <div className="space-y-1">
            {awayUsers.map((user) => (
              <UserPresence key={user.id} user={user} showStatus size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// LIVE CURSORS (for collaborative editing)
// =============================================================================

interface Cursor {
  userId: string
  userName: string
  color: string
  x: number
  y: number
}

interface LiveCursorsProps {
  cursors: Cursor[]
  className?: string
}

export function LiveCursors({ cursors, className }: LiveCursorsProps) {
  return (
    <div className={cn('pointer-events-none fixed inset-0 z-50', className)}>
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute transition-all duration-75 ease-out"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: cursor.color }}
          >
            <path
              d="M5.5 3.21V20.79c0 .45.54.67.85.35l4.56-4.56h7.89c.55 0 1-.45 1-1V8.21c0-.55-.45-1-1-1H10.91L5.85 3.56c-.31-.32-.85-.1-.85.35z"
              fill="currentColor"
            />
          </svg>
          <span
            className="absolute left-4 top-4 px-1.5 py-0.5 rounded text-xs text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </span>
        </div>
      ))}
    </div>
  )
}
