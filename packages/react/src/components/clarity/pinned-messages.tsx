'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Pin,
  ChevronDown,
  ChevronUp,
  X,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface PinnedMessage {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  pinnedAt: Date
  pinnedBy: string
  messageTimestamp: Date
}

// ============================================================================
// PINNED MESSAGE BANNER
// ============================================================================

interface PinnedMessageBannerProps {
  message: PinnedMessage
  onJump?: (messageId: string) => void
  onUnpin?: (messageId: string) => void
  onViewAll?: () => void
  totalPinned?: number
  className?: string
}

export function PinnedMessageBanner({
  message,
  onJump,
  onUnpin,
  onViewAll,
  totalPinned = 1,
  className,
}: PinnedMessageBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 bg-muted/50 border-b border-border',
        className
      )}
    >
      <Pin className="h-4 w-4 text-primary flex-shrink-0" />
      <button
        onClick={() => onJump?.(message.id)}
        className="flex-1 min-w-0 text-left hover:underline"
      >
        <p className="text-sm truncate">
          <span className="font-medium">{message.author.name}:</span>{' '}
          {message.content}
        </p>
      </button>
      <div className="flex items-center gap-1">
        {totalPinned > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-xs"
          >
            View all {totalPinned}
          </Button>
        )}
        {onUnpin && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUnpin(message.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PINNED MESSAGES LIST
// ============================================================================

interface PinnedMessagesListProps {
  messages: PinnedMessage[]
  onJump?: (messageId: string) => void
  onUnpin?: (messageId: string) => void
  defaultExpanded?: boolean
  className?: string
}

export function PinnedMessagesList({
  messages,
  onJump,
  onUnpin,
  defaultExpanded = false,
  className,
}: PinnedMessagesListProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  if (messages.length === 0) return null

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={cn('border-b border-border', className)}
    >
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {messages.length} Pinned{' '}
              {messages.length === 1 ? 'Message' : 'Messages'}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y divide-border">
          {messages.map((message) => (
            <PinnedMessageItem
              key={message.id}
              message={message}
              onJump={onJump}
              onUnpin={onUnpin}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ============================================================================
// PINNED MESSAGE ITEM
// ============================================================================

interface PinnedMessageItemProps {
  message: PinnedMessage
  onJump?: (messageId: string) => void
  onUnpin?: (messageId: string) => void
  className?: string
}

export function PinnedMessageItem({
  message,
  onJump,
  onUnpin,
  className,
}: PinnedMessageItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors group',
        className
      )}
    >
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {message.author.avatar ? (
          <img
            src={message.author.avatar || '/placeholder.svg'}
            alt={message.author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {message.author.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm">{message.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {message.messageTimestamp.toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {message.content}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Pinned by {message.pinnedBy} on{' '}
          {message.pinnedAt.toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onJump && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onJump(message.id)}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        {onUnpin && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUnpin(message.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PIN BUTTON
// ============================================================================

interface PinButtonProps {
  isPinned?: boolean
  onPin?: () => void
  onUnpin?: () => void
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function PinButton({
  isPinned = false,
  onPin,
  onUnpin,
  size = 'md',
  showLabel = false,
  className,
}: PinButtonProps) {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  if (showLabel) {
    return (
      <Button
        variant={isPinned ? 'secondary' : 'ghost'}
        size="sm"
        onClick={isPinned ? onUnpin : onPin}
        className={className}
      >
        <Pin
          className={cn(iconSizes[size], isPinned && 'fill-current', 'mr-2')}
        />
        {isPinned ? 'Unpin' : 'Pin'}
      </Button>
    )
  }

  return (
    <Button
      variant={isPinned ? 'secondary' : 'ghost'}
      size="icon"
      onClick={isPinned ? onUnpin : onPin}
      className={cn(sizeClasses[size], className)}
    >
      <Pin className={cn(iconSizes[size], isPinned && 'fill-current')} />
    </Button>
  )
}

// ============================================================================
// PINNED CAROUSEL
// ============================================================================

interface PinnedCarouselProps {
  messages: PinnedMessage[]
  onJump?: (messageId: string) => void
  autoRotate?: boolean
  rotateInterval?: number
  className?: string
}

export function PinnedCarousel({
  messages,
  onJump,
  autoRotate = true,
  rotateInterval = 5000,
  className,
}: PinnedCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (!autoRotate || messages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [autoRotate, messages.length, rotateInterval])

  if (messages.length === 0) return null

  const currentMessage = messages[currentIndex]

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 bg-primary/5 border-b border-primary/20',
        className
      )}
    >
      <Pin className="h-4 w-4 text-primary flex-shrink-0" />
      <button
        onClick={() => onJump?.(currentMessage.id)}
        className="flex-1 min-w-0 text-left"
      >
        <p className="text-sm truncate">
          <span className="font-medium">{currentMessage.author.name}:</span>{' '}
          {currentMessage.content}
        </p>
      </button>
      {messages.length > 1 && (
        <div className="flex items-center gap-1">
          {messages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function usePinnedMessages(initialMessages: PinnedMessage[] = []) {
  const [pinnedMessages, setPinnedMessages] =
    React.useState<PinnedMessage[]>(initialMessages)

  const pinMessage = React.useCallback(
    (
      message: Omit<PinnedMessage, 'pinnedAt' | 'pinnedBy'>,
      pinnedBy: string
    ) => {
      const pinnedMessage: PinnedMessage = {
        ...message,
        pinnedAt: new Date(),
        pinnedBy,
      }
      setPinnedMessages((prev) => [...prev, pinnedMessage])
      return pinnedMessage
    },
    []
  )

  const unpinMessage = React.useCallback((messageId: string) => {
    setPinnedMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  const isPinned = React.useCallback(
    (messageId: string) => {
      return pinnedMessages.some((m) => m.id === messageId)
    },
    [pinnedMessages]
  )

  return {
    pinnedMessages,
    pinMessage,
    unpinMessage,
    isPinned,
    setPinnedMessages,
  }
}
