'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  Settings,
  Filter,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import { ScrollArea } from '@clarity-chat/primitives'

// Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  avatar?: string
  category?: string
}

// Helper function
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Type icons
const typeIcons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
}

// Single notification item
interface NotificationItemProps {
  notification: Notification
  onRead?: (id: string) => void
  onDelete?: (id: string) => void
  onAction?: () => void
}

export function NotificationItem({
  notification,
  onRead,
  onDelete,
  onAction,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        'group flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer',
        !notification.read && 'bg-muted/30'
      )}
      onClick={() => onRead?.(notification.id)}
    >
      <div className="shrink-0 mt-0.5">{typeIcons[notification.type]}</div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-tight',
              !notification.read && 'font-medium'
            )}
          >
            {notification.title}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.read && onRead && (
                <DropdownMenuItem onClick={() => onRead(notification.id)}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as read
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(notification.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {notification.message && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.timestamp)}
          </span>
          {notification.action && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                notification.action?.onClick()
                onAction?.()
              }}
            >
              {notification.action.label}
            </Button>
          )}
        </div>
      </div>
      {!notification.read && (
        <div className="shrink-0">
          <div className="h-2 w-2 rounded-full bg-accent" />
        </div>
      )}
    </div>
  )
}

// Notification center popover
interface NotificationCenterProps {
  notifications: Notification[]
  onRead?: (id: string) => void
  onReadAll?: () => void
  onDelete?: (id: string) => void
  onClearAll?: () => void
  onSettings?: () => void
  className?: string
}

export function NotificationCenter({
  notifications,
  onRead,
  onReadAll,
  onDelete,
  onClearAll,
  onSettings,
  className,
}: NotificationCenterProps) {
  const [open, setOpen] = React.useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('relative', className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-1">
            {onReadAll && unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onReadAll}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            {onSettings && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onSettings}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="font-medium text-sm">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              {"You're all caught up!"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={onRead}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && onClearAll && (
          <div className="border-t px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={onClearAll}
            >
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Toast-style notification
interface ToastNotificationProps {
  notification: Notification
  onClose?: () => void
  onAction?: () => void
  duration?: number
  className?: string
}

export function ToastNotification({
  notification,
  onClose,
  onAction,
  duration = 5000,
  className,
}: ToastNotificationProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColors: Record<NotificationType, string> = {
    info: 'border-blue-500/20 bg-blue-500/10',
    success: 'border-emerald-500/20 bg-emerald-500/10',
    warning: 'border-amber-500/20 bg-amber-500/10',
    error: 'border-red-500/20 bg-red-500/10',
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right',
        bgColors[notification.type],
        className
      )}
    >
      <div className="shrink-0">{typeIcons[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        {notification.message && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {notification.message}
          </p>
        )}
        {notification.action && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-2 text-sm"
            onClick={() => {
              notification.action?.onClick()
              onAction?.()
              onClose?.()
            }}
          >
            {notification.action.label}
          </Button>
        )}
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Notification badge for inline use
interface NotificationBadgeProps {
  count: number
  max?: number
  className?: string
}

export function NotificationBadge({
  count,
  max = 99,
  className,
}: NotificationBadgeProps) {
  if (count === 0) return null

  return (
    <Badge
      variant="destructive"
      className={cn('h-5 min-w-5 px-1.5 text-xs', className)}
    >
      {count > max ? `${max}+` : count}
    </Badge>
  )
}
