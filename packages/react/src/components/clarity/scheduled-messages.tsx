'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Calendar } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Clock,
  CalendarIcon,
  Send,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  X,
} from 'lucide-react'
import { format } from 'date-fns'

// ============================================================================
// TYPES
// ============================================================================

export interface ScheduledMessage {
  id: string
  content: string
  scheduledFor: Date
  conversationId: string
  conversationName?: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  createdAt: Date
  attachments?: Array<{
    type: string
    name: string
    url: string
  }>
}

// ============================================================================
// SCHEDULE PICKER
// ============================================================================

interface SchedulePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  minDate?: Date
  children?: React.ReactNode
  className?: string
}

export function SchedulePicker({
  value,
  onChange,
  minDate = new Date(),
  children,
  className,
}: SchedulePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  )
  const [time, setTime] = React.useState(
    value ? format(value, 'HH:mm') : '09:00'
  )

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const [hours, minutes] = time.split(':').map(Number)
      date.setHours(hours, minutes)
      onChange(date)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours, minutes)
      onChange(newDate)
    }
  }

  const quickOptions = [
    {
      label: 'In 1 hour',
      getDate: () => new Date(Date.now() + 60 * 60 * 1000),
    },
    {
      label: 'In 3 hours',
      getDate: () => new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
    {
      label: 'Tomorrow morning',
      getDate: () => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        d.setHours(9, 0, 0, 0)
        return d
      },
    },
    {
      label: 'Tomorrow afternoon',
      getDate: () => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        d.setHours(14, 0, 0, 0)
        return d
      },
    },
    {
      label: 'Next Monday',
      getDate: () => {
        const d = new Date()
        d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7))
        d.setHours(9, 0, 0, 0)
        return d
      },
    },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className={className}>
            <Clock className="h-4 w-4 mr-2" />
            {value ? format(value, 'MMM d, h:mm a') : 'Schedule'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b border-border">
          <p className="text-sm font-medium mb-2">Quick options</p>
          <div className="flex flex-wrap gap-1">
            {quickOptions.map((option) => (
              <Button
                key={option.label}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => {
                  const date = option.getDate()
                  setSelectedDate(date)
                  setTime(format(date, 'HH:mm'))
                  onChange(date)
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date(minDate.setHours(0, 0, 0, 0))}
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// SCHEDULED MESSAGE CARD
// ============================================================================

interface ScheduledMessageCardProps {
  message: ScheduledMessage
  onEdit?: (message: ScheduledMessage) => void
  onDelete?: (message: ScheduledMessage) => void
  onSendNow?: (message: ScheduledMessage) => void
  onReschedule?: (message: ScheduledMessage, newDate: Date) => void
  className?: string
}

export function ScheduledMessageCard({
  message,
  onEdit,
  onDelete,
  onSendNow,
  onReschedule,
  className,
}: ScheduledMessageCardProps) {
  const [showReschedule, setShowReschedule] = React.useState(false)

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    sent: 'bg-green-500/10 text-green-600 border-green-500/30',
    failed: 'bg-red-500/10 text-red-600 border-red-500/30',
    cancelled: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div
      className={cn('rounded-lg border border-border p-4 bg-card', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full border capitalize',
                statusColors[message.status]
              )}
            >
              {message.status}
            </span>
            {message.conversationName && (
              <span className="text-xs text-muted-foreground truncate">
                to {message.conversationName}
              </span>
            )}
          </div>
          <p className="text-sm line-clamp-2">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              + {message.attachments.length} attachment(s)
            </p>
          )}
        </div>
        {message.status === 'pending' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onSendNow && (
                <DropdownMenuItem onClick={() => onSendNow(message)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send now
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(message)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onReschedule && (
                <DropdownMenuItem onClick={() => setShowReschedule(true)}>
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(message)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <CalendarIcon className="h-3 w-3" />
        <span>
          {message.status === 'sent'
            ? `Sent ${format(message.scheduledFor, "MMM d, yyyy 'at' h:mm a")}`
            : `Scheduled for ${format(message.scheduledFor, "MMM d, yyyy 'at' h:mm a")}`}
        </span>
      </div>

      {showReschedule && onReschedule && (
        <div className="mt-3 pt-3 border-t border-border">
          <SchedulePicker
            value={message.scheduledFor}
            onChange={(date) => {
              if (date) {
                onReschedule(message, date)
                setShowReschedule(false)
              }
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              <Clock className="h-4 w-4 mr-2" />
              Pick new time
            </Button>
          </SchedulePicker>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SCHEDULED MESSAGES LIST
// ============================================================================

interface ScheduledMessagesListProps {
  messages: ScheduledMessage[]
  onEdit?: (message: ScheduledMessage) => void
  onDelete?: (message: ScheduledMessage) => void
  onSendNow?: (message: ScheduledMessage) => void
  onReschedule?: (message: ScheduledMessage, newDate: Date) => void
  showPast?: boolean
  className?: string
}

export function ScheduledMessagesList({
  messages,
  onEdit,
  onDelete,
  onSendNow,
  onReschedule,
  showPast = false,
  className,
}: ScheduledMessagesListProps) {
  const now = new Date()
  const pendingMessages = messages
    .filter((m) => m.status === 'pending' && m.scheduledFor > now)
    .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())

  const pastMessages = showPast
    ? messages.filter((m) => m.status !== 'pending' || m.scheduledFor <= now)
    : []

  if (pendingMessages.length === 0 && pastMessages.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No scheduled messages</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {pendingMessages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">
            Upcoming ({pendingMessages.length})
          </h3>
          <div className="space-y-3">
            {pendingMessages.map((message) => (
              <ScheduledMessageCard
                key={message.id}
                message={message}
                onEdit={onEdit}
                onDelete={onDelete}
                onSendNow={onSendNow}
                onReschedule={onReschedule}
              />
            ))}
          </div>
        </div>
      )}
      {pastMessages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Past ({pastMessages.length})
          </h3>
          <div className="space-y-3">
            {pastMessages.map((message) => (
              <ScheduledMessageCard key={message.id} message={message} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SCHEDULE INDICATOR
// ============================================================================

interface ScheduleIndicatorProps {
  scheduledFor: Date
  onClear?: () => void
  className?: string
}

export function ScheduleIndicator({
  scheduledFor,
  onClear,
  className,
}: ScheduleIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm',
        className
      )}
    >
      <Clock className="h-4 w-4" />
      <span>Scheduled for {format(scheduledFor, "MMM d 'at' h:mm a")}</span>
      {onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 ml-auto"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useScheduledMessages(initialMessages: ScheduledMessage[] = []) {
  const [messages, setMessages] =
    React.useState<ScheduledMessage[]>(initialMessages)

  const scheduleMessage = React.useCallback(
    (
      content: string,
      scheduledFor: Date,
      conversationId: string,
      conversationName?: string,
      attachments?: ScheduledMessage['attachments']
    ) => {
      const newMessage: ScheduledMessage = {
        id: `scheduled-${Date.now()}`,
        content,
        scheduledFor,
        conversationId,
        conversationName,
        status: 'pending',
        createdAt: new Date(),
        attachments,
      }
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    },
    []
  )

  const rescheduleMessage = React.useCallback(
    (messageId: string, newDate: Date) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, scheduledFor: newDate } : m
        )
      )
    },
    []
  )

  const cancelMessage = React.useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: 'cancelled' as const } : m
      )
    )
  }, [])

  const deleteMessage = React.useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  const markAsSent = React.useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, status: 'sent' as const } : m
      )
    )
  }, [])

  return {
    messages,
    scheduleMessage,
    rescheduleMessage,
    cancelMessage,
    deleteMessage,
    markAsSent,
    setMessages,
  }
}
