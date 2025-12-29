/**
 * TanStack Virtual Message List
 *
 * Modern virtualization using @tanstack/react-virtual for efficient
 * rendering of large conversation lists with dynamic row heights.
 *
 * Key improvements over react-window:
 * - Built-in dynamic height measurement
 * - No external AutoSizer needed
 * - Better TypeScript support
 * - Smaller bundle size
 * - More flexible APIs
 *
 * @see https://tanstack.com/virtual/latest
 * @license MIT (TanStack Virtual)
 */

'use client'

import * as React from 'react'
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual'
import type { Message } from '@clarity-chat/types'
import { cn } from '@clarity-chat/primitives'

// ============================================================================
// Types
// ============================================================================

export interface TanStackMessageListProps {
  /** Messages to render */
  messages: Message[]

  /** Render function for each message */
  renderMessage: (message: Message, index: number) => React.ReactNode

  /** Estimated height of each message in pixels */
  estimatedItemSize?: number

  /** Number of items to render outside of the visible area */
  overscanCount?: number

  /** Auto-scroll to bottom when new messages arrive */
  autoScrollToBottom?: boolean

  /** Callback when scroll position changes */
  onScroll?: (scrollOffset: number) => void

  /** Custom CSS class */
  className?: string

  /** Container height (default: 100%) */
  height?: string | number

  /** Enable smooth scrolling animations */
  smoothScroll?: boolean

  /** Gap between messages in pixels */
  gap?: number

  /** Custom item key getter */
  getItemKey?: (index: number) => string | number

  /** Callback when user scrolls away from bottom */
  onScrollAwayFromBottom?: () => void

  /** Threshold in pixels for "near bottom" detection */
  scrollThreshold?: number
}

// ============================================================================
// TanStack Virtual Message List Component
// ============================================================================

/**
 * TanStackMessageList - Modern virtualized list using TanStack Virtual
 *
 * Features:
 * - Dynamic row height measurement
 * - Smooth scrolling support
 * - Auto-scroll to bottom
 * - Efficient re-renders with React 19 patterns
 */
export function TanStackMessageList({
  messages,
  renderMessage,
  estimatedItemSize = 150,
  overscanCount = 5,
  autoScrollToBottom = true,
  onScroll,
  className,
  height = '100%',
  smoothScroll = true,
  gap = 8,
  getItemKey,
  onScrollAwayFromBottom,
  scrollThreshold = 100,
}: TanStackMessageListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const previousMessagesLength = React.useRef(messages.length)
  const isNearBottomRef = React.useRef(true)
  const lastScrollTop = React.useRef(0)

  // Default key getter
  const itemKey = React.useCallback(
    (index: number) => {
      if (getItemKey) return getItemKey(index)
      return messages[index]?.id || `msg-${index}`
    },
    [getItemKey, messages]
  )

  // Create virtualizer
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemSize,
    overscan: overscanCount,
    getItemKey: itemKey,
    // Enable dynamic measurement
    measureElement: (element) => element.getBoundingClientRect().height + gap,
  })

  // Handle scroll events
  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const scrollTop = target.scrollTop
      const scrollHeight = target.scrollHeight
      const clientHeight = target.clientHeight

      // Check if near bottom
      const wasNearBottom = isNearBottomRef.current
      isNearBottomRef.current =
        scrollHeight - (scrollTop + clientHeight) < scrollThreshold

      // Detect scroll away from bottom
      if (wasNearBottom && !isNearBottomRef.current) {
        onScrollAwayFromBottom?.()
      }

      lastScrollTop.current = scrollTop
      onScroll?.(scrollTop)
    },
    [onScroll, onScrollAwayFromBottom, scrollThreshold]
  )

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (
      autoScrollToBottom &&
      messages.length > previousMessagesLength.current &&
      isNearBottomRef.current
    ) {
      virtualizer.scrollToIndex(messages.length - 1, {
        align: 'end',
        behavior: smoothScroll ? 'smooth' : 'auto',
      })
    }
    previousMessagesLength.current = messages.length
  }, [messages.length, autoScrollToBottom, smoothScroll, virtualizer])

  // Check if any message is streaming
  const isStreaming = React.useMemo(
    () => messages.some((m) => m.status === 'streaming'),
    [messages]
  )

  // Get virtual items
  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height, contain: 'strict' }}
      onScroll={handleScroll}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={isStreaming}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem: VirtualItem) => {
          const message = messages[virtualItem.index]
          if (!message) return null

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderMessage(message, virtualItem.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

TanStackMessageList.displayName = 'TanStackMessageList'

// ============================================================================
// Auto-Virtualizing Message List
// ============================================================================

export interface AutoTanStackMessageListProps extends TanStackMessageListProps {
  /** Threshold for enabling virtualization (message count) */
  virtualizationThreshold?: number
}

/**
 * AutoTanStackMessageList - Automatically enables virtualization
 * for large message lists
 */
export function AutoTanStackMessageList({
  messages,
  renderMessage,
  virtualizationThreshold = 50,
  className,
  ...props
}: AutoTanStackMessageListProps) {
  const shouldVirtualize = messages.length > virtualizationThreshold

  // Check if any message is streaming
  const isStreaming = React.useMemo(
    () => messages.some((m) => m.status === 'streaming'),
    [messages]
  )

  if (shouldVirtualize) {
    return (
      <TanStackMessageList
        messages={messages}
        renderMessage={renderMessage}
        className={className}
        {...props}
      />
    )
  }

  // Standard rendering for small lists
  return (
    <div
      className={cn('overflow-auto', className)}
      style={{ height: props.height || '100%' }}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={isStreaming}
    >
      {messages.map((message, index) => (
        <div
          key={message.id || `msg-${index}`}
          style={{ marginBottom: props.gap || 8 }}
        >
          {renderMessage(message, index)}
        </div>
      ))}
    </div>
  )
}

AutoTanStackMessageList.displayName = 'AutoTanStackMessageList'

// ============================================================================
// Scroll Control Hook
// ============================================================================

export interface UseMessageListScrollOptions {
  /** Enable auto-scroll behavior */
  autoScroll?: boolean
  /** Threshold for "near bottom" detection in pixels */
  scrollThreshold?: number
  /** Smooth scroll behavior */
  smoothScroll?: boolean
}

export interface UseMessageListScrollReturn {
  /** Whether user is near the bottom of the list */
  isNearBottom: boolean
  /** Whether user has scrolled up from bottom */
  userHasScrolledUp: boolean
  /** Number of new messages since scrolling away */
  newMessageCount: number
  /** Scroll to bottom of the list */
  scrollToBottom: () => void
  /** Scroll to a specific message index */
  scrollToIndex: (index: number) => void
  /** Reset new message count */
  resetNewMessages: () => void
  /** Handle scroll events */
  handleScroll: (scrollOffset: number) => void
}

/**
 * Hook for controlling scroll behavior in message lists
 */
export function useMessageListScrollControl(
  virtualizerRef: React.RefObject<ReturnType<typeof useVirtualizer>>,
  messageCount: number,
  options: UseMessageListScrollOptions = {}
): UseMessageListScrollReturn {
  const {
    autoScroll = true,
    scrollThreshold = 100,
    smoothScroll = true,
  } = options

  const [isNearBottom, setIsNearBottom] = React.useState(true)
  const [userHasScrolledUp, setUserHasScrolledUp] = React.useState(false)
  const [newMessageCount, setNewMessageCount] = React.useState(0)
  const previousMessageCount = React.useRef(messageCount)

  // Track new messages when scrolled away
  React.useEffect(() => {
    if (messageCount > previousMessageCount.current && !isNearBottom) {
      setNewMessageCount(
        (prev) => prev + (messageCount - previousMessageCount.current)
      )
    }
    previousMessageCount.current = messageCount
  }, [messageCount, isNearBottom])

  const scrollToBottom = React.useCallback(() => {
    virtualizerRef.current?.scrollToIndex(messageCount - 1, {
      align: 'end',
      behavior: smoothScroll ? 'smooth' : 'auto',
    })
    setUserHasScrolledUp(false)
    setNewMessageCount(0)
    setIsNearBottom(true)
  }, [virtualizerRef, messageCount, smoothScroll])

  const scrollToIndex = React.useCallback(
    (index: number) => {
      virtualizerRef.current?.scrollToIndex(index, {
        align: 'center',
        behavior: smoothScroll ? 'smooth' : 'auto',
      })
    },
    [virtualizerRef, smoothScroll]
  )

  const resetNewMessages = React.useCallback(() => {
    setNewMessageCount(0)
  }, [])

  const handleScroll = React.useCallback((_scrollOffset: number) => {
    // Scroll state is typically managed by the virtualizer
    // This is for external tracking
  }, [])

  return {
    isNearBottom,
    userHasScrolledUp,
    newMessageCount,
    scrollToBottom,
    scrollToIndex,
    resetNewMessages,
    handleScroll,
  }
}

// ============================================================================
// Jump to Bottom Button Hook
// ============================================================================

export interface UseJumpToBottomReturn {
  /** Whether to show the jump button */
  showButton: boolean
  /** Number of unread messages */
  unreadCount: number
  /** Handle click on jump button */
  handleClick: () => void
}

/**
 * Hook for implementing a "Jump to Bottom" button
 */
export function useJumpToBottom(
  scrollControl: UseMessageListScrollReturn
): UseJumpToBottomReturn {
  const showButton =
    !scrollControl.isNearBottom && scrollControl.newMessageCount > 0

  const handleClick = React.useCallback(() => {
    scrollControl.scrollToBottom()
  }, [scrollControl])

  return {
    showButton,
    unreadCount: scrollControl.newMessageCount,
    handleClick,
  }
}

// ============================================================================
// Exports
// ============================================================================

export default TanStackMessageList
