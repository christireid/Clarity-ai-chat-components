'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@clarity-chat/primitives'
import {
  format,
  isToday,
  isYesterday,
  isSameDay,
  differenceInMinutes,
} from 'date-fns'

// =============================================================================
// TYPES
// =============================================================================

export interface GroupedMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface MessageGroup {
  id: string
  sender?: GroupedMessage['sender']
  role: GroupedMessage['role']
  messages: GroupedMessage[]
  timestamp: Date
}

// =============================================================================
// DATE SEPARATOR
// =============================================================================

interface DateSeparatorProps {
  date: Date
  variant?: 'default' | 'subtle' | 'badge'
  className?: string
}

export function DateSeparator({
  date,
  variant = 'default',
  className,
}: DateSeparatorProps) {
  const getDateLabel = (d: Date) => {
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    return format(d, 'MMMM d, yyyy')
  }

  if (variant === 'badge') {
    return (
      <div className={cn('flex justify-center py-4', className)}>
        <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {getDateLabel(date)}
        </span>
      </div>
    )
  }

  if (variant === 'subtle') {
    return (
      <div className={cn('flex justify-center py-2', className)}>
        <span className="text-xs text-muted-foreground">
          {getDateLabel(date)}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-4 py-4', className)}>
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-medium text-muted-foreground">
        {getDateLabel(date)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// =============================================================================
// UNREAD SEPARATOR
// =============================================================================

interface UnreadSeparatorProps {
  count?: number
  className?: string
}

export function UnreadSeparator({ count, className }: UnreadSeparatorProps) {
  return (
    <div className={cn('flex items-center gap-4 py-2', className)}>
      <div className="flex-1 h-px bg-primary" />
      <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-medium">
        {count ? `${count} new messages` : 'New messages'}
      </span>
      <div className="flex-1 h-px bg-primary" />
    </div>
  )
}

// =============================================================================
// MESSAGE GROUP
// =============================================================================

interface MessageGroupProps {
  group: MessageGroup
  renderMessage: (
    message: GroupedMessage,
    isFirst: boolean,
    isLast: boolean
  ) => React.ReactNode
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
}

export function MessageGroupComponent({
  group,
  renderMessage,
  showAvatar = true,
  showTimestamp = true,
  className,
}: MessageGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        group.role === 'user' && 'flex-row-reverse',
        className
      )}
    >
      {showAvatar && group.sender && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage
            src={group.sender.avatar || '/placeholder.svg'}
            alt={group.sender.name}
          />
          <AvatarFallback className="text-xs">
            {group.sender.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {showAvatar && !group.sender && group.role === 'assistant' && (
        <div className="h-8 w-8 mt-1 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">AI</span>
        </div>
      )}
      <div
        className={cn(
          'flex flex-col gap-0.5 max-w-[80%]',
          group.role === 'user' && 'items-end'
        )}
      >
        {group.sender && (
          <span className="text-xs font-medium text-muted-foreground px-1">
            {group.sender.name}
          </span>
        )}
        {group.messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {renderMessage(
              message,
              index === 0,
              index === group.messages.length - 1
            )}
          </React.Fragment>
        ))}
        {showTimestamp && (
          <span
            className="text-[10px] text-muted-foreground px-1 mt-1"
            suppressHydrationWarning
          >
            {format(group.timestamp, 'h:mm a')}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// GROUPED MESSAGE LIST
// =============================================================================

interface GroupedMessageListProps {
  messages: GroupedMessage[]
  renderMessage: (
    message: GroupedMessage,
    isFirst: boolean,
    isLast: boolean
  ) => React.ReactNode
  groupingThreshold?: number // minutes
  showDateSeparators?: boolean
  dateSeparatorVariant?: DateSeparatorProps['variant']
  unreadFromId?: string
  className?: string
}

export function MessageGroup({
  messages,
  renderMessage,
  groupingThreshold = 5,
  showDateSeparators = true,
  dateSeparatorVariant = 'default',
  unreadFromId,
  className,
}: GroupedMessageListProps) {
  const groupedData = React.useMemo(() => {
    const result: Array<{
      type: 'date' | 'unread' | 'group'
      data: Date | MessageGroup
    }> = []
    let currentGroup: MessageGroup | null = null
    let lastDate: Date | null = null
    let unreadInserted = false

    for (const message of messages) {
      // Insert date separator if needed
      if (
        showDateSeparators &&
        (!lastDate || !isSameDay(lastDate, message.timestamp))
      ) {
        if (currentGroup) {
          result.push({ type: 'group', data: currentGroup })
          currentGroup = null
        }
        result.push({ type: 'date', data: message.timestamp })
        lastDate = message.timestamp
      }

      // Insert unread separator if needed
      if (!unreadInserted && unreadFromId && message.id === unreadFromId) {
        if (currentGroup) {
          result.push({ type: 'group', data: currentGroup })
          currentGroup = null
        }
        result.push({ type: 'unread', data: new Date() })
        unreadInserted = true
      }

      // Check if should continue current group
      const shouldGroup =
        currentGroup &&
        currentGroup.role === message.role &&
        currentGroup.sender?.id === message.sender?.id &&
        differenceInMinutes(
          message.timestamp,
          currentGroup.messages[currentGroup.messages.length - 1].timestamp
        ) < groupingThreshold

      if (shouldGroup && currentGroup) {
        currentGroup.messages.push(message)
      } else {
        if (currentGroup) {
          result.push({ type: 'group', data: currentGroup })
        }
        currentGroup = {
          id: `group-${message.id}`,
          sender: message.sender,
          role: message.role,
          messages: [message],
          timestamp: message.timestamp,
        }
      }
    }

    if (currentGroup) {
      result.push({ type: 'group', data: currentGroup })
    }

    return result
  }, [messages, groupingThreshold, showDateSeparators, unreadFromId])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {groupedData.map((item, index) => {
        if (item.type === 'date') {
          return (
            <DateSeparator
              key={`date-${index}`}
              date={item.data as Date}
              variant={dateSeparatorVariant}
            />
          )
        }
        if (item.type === 'unread') {
          return <UnreadSeparator key={`unread-${index}`} />
        }
        const group = item.data as MessageGroup
        return (
          <MessageGroupComponent
            key={group.id}
            group={group}
            renderMessage={renderMessage}
          />
        )
      })}
    </div>
  )
}

// =============================================================================
// COMPACT MESSAGE GROUP
// =============================================================================

interface CompactMessageGroupProps {
  messages: GroupedMessage[]
  maxVisible?: number
  className?: string
}

export function CompactMessageGroup({
  messages,
  maxVisible = 3,
  className,
}: CompactMessageGroupProps) {
  const [expanded, setExpanded] = React.useState(false)
  const visibleMessages = expanded ? messages : messages.slice(-maxVisible)
  const hiddenCount = messages.length - maxVisible

  return (
    <div className={cn('space-y-1', className)}>
      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-primary hover:underline px-2"
        >
          Show {hiddenCount} more messages
        </button>
      )}
      {visibleMessages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm',
            message.role === 'user'
              ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
              : 'bg-muted max-w-[80%]'
          )}
        >
          {message.content}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// TIME INDICATOR
// =============================================================================

interface TimeIndicatorProps {
  timestamp: Date
  format?: 'relative' | 'absolute' | 'smart'
  className?: string
}

export function TimeIndicator({
  timestamp,
  format: formatType = 'smart',
  className,
}: TimeIndicatorProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    if (formatType !== 'relative' && formatType !== 'smart') return
    const interval = setInterval(forceUpdate, 60000)
    return () => clearInterval(interval)
  }, [formatType])

  const getTimeText = () => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (formatType === 'absolute') {
      return format(timestamp, 'h:mm a')
    }

    if (formatType === 'relative' || (formatType === 'smart' && minutes < 60)) {
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return format(timestamp, 'MMM d')
    }

    return format(timestamp, 'h:mm a')
  }

  return (
    <time
      dateTime={timestamp.toISOString()}
      className={cn('text-xs text-muted-foreground', className)}
      suppressHydrationWarning
    >
      {getTimeText()}
    </time>
  )
}
