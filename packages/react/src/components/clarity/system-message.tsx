'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Bell,
  Clock,
  Shield,
  Zap,
  Settings,
  RefreshCw,
  X,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type SystemMessageType =
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'notification'
  | 'update'
  | 'security'
  | 'feature'

export interface SystemMessageProps {
  type?: SystemMessageType
  title?: React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  timestamp?: Date
  showTimestamp?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'filled' | 'outlined' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// ============================================================================
// SYSTEM MESSAGE
// ============================================================================

const typeConfig: Record<
  SystemMessageType,
  { icon: React.ReactNode; color: string; bgColor: string; borderColor: string }
> = {
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  notification: {
    icon: <Bell className="w-4 h-4" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  update: {
    icon: <RefreshCw className="w-4 h-4" />,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
  security: {
    icon: <Shield className="w-4 h-4" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  feature: {
    icon: <Zap className="w-4 h-4" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
}

export function SystemMessage({
  type = 'info',
  title,
  content,
  icon,
  timestamp,
  showTimestamp = false,
  dismissible = false,
  onDismiss,
  action,
  variant = 'default',
  size = 'md',
  className,
}: SystemMessageProps) {
  const config = typeConfig[type]

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base',
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const variantClasses = {
    default: cn(config.bgColor, 'border', config.borderColor),
    filled: cn(config.bgColor, config.color),
    outlined: cn('bg-transparent border-2', config.borderColor),
    subtle: 'bg-muted/50',
  }

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 rounded-lg',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {/* Icon */}
      <span className={cn('flex-shrink-0 mt-0.5', config.color)}>
        {icon ||
          React.cloneElement(config.icon as React.ReactElement, {
            className: iconSizes[size],
          })}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className={cn('font-medium', config.color)}>{title}</p>}
        <div className={cn('text-muted-foreground', title && 'mt-0.5')}>
          {content}
        </div>

        {/* Action */}
        {action && (
          <Button
            variant="link"
            size="sm"
            onClick={action.onClick}
            className={cn('h-auto p-0 mt-1', config.color)}
          >
            {action.label}
          </Button>
        )}
      </div>

      {/* Timestamp */}
      {showTimestamp && timestamp && (
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatTimestamp(timestamp)}
        </span>
      )}

      {/* Dismiss button */}
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 flex-shrink-0 -mr-1"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// DIVIDER MESSAGE - For conversation dividers
// ============================================================================

export interface DividerMessageProps {
  content: React.ReactNode
  dashed?: boolean
  className?: string
}

export function DividerMessage({
  content,
  dashed = false,
  className,
}: DividerMessageProps) {
  return (
    <div className={cn('flex items-center gap-4 py-4', className)}>
      <div
        className={cn(
          'flex-1 h-px',
          dashed ? 'border-t border-dashed border-border' : 'bg-border'
        )}
      />
      <span className="text-xs text-muted-foreground px-2">{content}</span>
      <div
        className={cn(
          'flex-1 h-px',
          dashed ? 'border-t border-dashed border-border' : 'bg-border'
        )}
      />
    </div>
  )
}

// ============================================================================
// DATE DIVIDER - For date separators in chat
// ============================================================================

export interface DateDividerProps {
  date: Date
  format?: 'short' | 'medium' | 'long' | 'relative'
  className?: string
}

export function DateDivider({
  date,
  format = 'medium',
  className,
}: DateDividerProps) {
  const formatDate = () => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString()

    if (format === 'relative') {
      if (isToday) return 'Today'
      if (isYesterday) return 'Yesterday'
    }

    switch (format) {
      case 'short':
        return date.toLocaleDateString([], {
          month: 'numeric',
          day: 'numeric',
        })
      case 'long':
        return date.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      case 'medium':
      default:
        if (isToday) return 'Today'
        if (isYesterday) return 'Yesterday'
        return date.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
    }
  }

  return <DividerMessage content={formatDate()} className={className} />
}

// ============================================================================
// TYPING INDICATOR - Shows when someone is typing
// ============================================================================

export interface TypingIndicatorProps {
  users?: string[]
  showNames?: boolean
  className?: string
}

export function TypingIndicator({
  users = [],
  showNames = true,
  className,
}: TypingIndicatorProps) {
  const getText = () => {
    if (!showNames || users.length === 0) return 'typing'
    if (users.length === 1) return `${users[0]} is typing`
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing`
    return `${users[0]} and ${users.length - 1} others are typing`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
      <span>{getText()}</span>
    </div>
  )
}

// ============================================================================
// NOTIFICATION BUBBLE - Floating notification
// ============================================================================

export interface NotificationBubbleProps {
  type?: SystemMessageType
  title?: string
  content: React.ReactNode
  icon?: React.ReactNode
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export function NotificationBubble({
  type = 'info',
  title,
  content,
  icon,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  position = 'bottom-right',
  className,
}: NotificationBubbleProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const config = typeConfig[type]

  React.useEffect(() => {
    if (!autoClose) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, autoCloseDelay)

    return () => clearTimeout(timer)
  }, [autoClose, autoCloseDelay, onClose])

  if (!isVisible) return null

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        positionClasses[position],
        className
      )}
    >
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-lg shadow-lg border',
          config.bgColor,
          config.borderColor
        )}
      >
        <span className={cn('flex-shrink-0', config.color)}>
          {icon || config.icon}
        </span>

        <div className="flex-1 min-w-0">
          {title && <p className={cn('font-medium', config.color)}>{title}</p>}
          <div className="text-sm text-muted-foreground">{content}</div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="h-6 w-6 flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// SYSTEM BUBBLE - For chat system messages
// ============================================================================

export interface SystemBubbleProps {
  content: React.ReactNode
  variant?: 'filled' | 'outlined' | 'shadow' | 'borderless'
  shape?: 'default' | 'round' | 'corner'
  className?: string
}

export function SystemBubble({
  content,
  variant = 'shadow',
  shape = 'default',
  className,
}: SystemBubbleProps) {
  const variantClasses = {
    filled: 'bg-muted',
    outlined: 'bg-transparent border border-border',
    shadow: 'bg-background shadow-sm border border-border',
    borderless: 'bg-transparent',
  }

  const shapeClasses = {
    default: 'rounded-lg',
    round: 'rounded-full',
    corner: 'rounded-lg rounded-tl-none',
  }

  return (
    <div className="flex justify-center py-2">
      <div
        className={cn(
          'px-4 py-2 text-sm text-muted-foreground text-center max-w-md',
          variantClasses[variant],
          shapeClasses[shape],
          className
        )}
      >
        {content}
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SystemMessage
