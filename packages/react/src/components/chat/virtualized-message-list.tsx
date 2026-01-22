/**
 * Virtualized Message List
 *
 * Efficient rendering for large conversations (1000+ messages) using
 * react-window for virtual scrolling.
 *
 * @blueprint Feature 6.1 - Virtual Scrolling
 * @priority HIGH
 * @status NEW - Implementation based on blueprint analysis
 */

'use client'

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { VariableSizeList as List } from 'react-window'
import type { ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import type { Message } from '@clarity-chat/types'

// Type assertions for react-window v1.8.11 with React 19
// AutoSizer component type assertion for compatibility
const AutoSizerComponent = AutoSizer as React.ComponentType<
  React.ComponentProps<typeof AutoSizer>
>
// MessageListData type for react-window itemData prop
type MessageListData = {
  messages: Message[]
  renderMessage: (message: Message, index: number) => React.ReactNode
  heightCache: MessageHeightCache
  setItemHeight: (index: number, height: number) => void
}
// List component - using 'as any' to work around strict generic type constraints with refs
// Note: react-window v2 has breaking API changes, staying on v1.8.11 for compatibility
const ListComponent = List as any

// ============================================================================
// Types
// ============================================================================

export interface VirtualizedMessageListProps {
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

  /** Threshold for enabling virtualization (message count) */
  threshold?: number

  /** Custom item key getter */
  itemKey?: (index: number, data: Message[]) => string
}

export interface MessageListProps extends Omit<
  VirtualizedMessageListProps,
  'threshold'
> {
  /** Enable virtualization automatically at this threshold */
  virtualizationThreshold?: number
}

// ============================================================================
// Message Height Cache
// ============================================================================

class MessageHeightCache {
  private heights: Map<string, number> = new Map()
  private defaultHeight: number

  constructor(defaultHeight: number = 150) {
    this.defaultHeight = defaultHeight
  }

  setHeight(key: string, height: number) {
    this.heights.set(key, height)
  }

  getHeight(key: string): number {
    return this.heights.get(key) || this.defaultHeight
  }

  hasHeight(key: string): boolean {
    return this.heights.has(key)
  }

  clear() {
    this.heights.clear()
  }
}

// ============================================================================
// Message Item Component
// ============================================================================

interface MessageItemProps extends ListChildComponentProps<MessageListData> {
  data: MessageListData
}

function MessageItem({ index, style, data }: MessageItemProps) {
  const { messages, renderMessage, heightCache, setItemHeight } = data
  const message = messages[index]
  const itemRef = React.useRef<HTMLDivElement>(null)

  // Use ResizeObserver instead of offsetHeight to avoid forced layouts
  React.useEffect(() => {
    const element = itemRef.current
    if (!element || !message) return

    const messageKey = message.id || `msg-${index}`

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use contentRect.height to avoid forced layout
        const height = entry.contentRect.height

        if (height > 0) {
          const cachedHeight = heightCache.getHeight(messageKey)

          // Only update if height changed significantly (>1px to avoid float rounding)
          if (Math.abs(cachedHeight - height) > 1) {
            heightCache.setHeight(messageKey, height)
            setItemHeight(index, height)
          }
        }
      }
    })

    resizeObserver.observe(element)

    // Cleanup observer on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [message, index, heightCache, setItemHeight])

  if (!message) {
    return <div style={style} />
  }

  return (
    <div style={style}>
      <div ref={itemRef}>{renderMessage(message, index)}</div>
    </div>
  )
}

// ============================================================================
// Virtualized Message List Component
// ============================================================================

/**
 * VirtualizedMessageList - Enhanced with React 19 features
 *
 * React 19 Enhancements:
 * - Keeps performance-critical useCallback (for react-window integration)
 * - Compiler optimizes the rest automatically
 * - Note: Some callbacks kept for stable refs required by react-window
 */
export function VirtualizedMessageList({
  messages,
  renderMessage,
  estimatedItemSize = 150,
  overscanCount = 3,
  autoScrollToBottom = true,
  onScroll,
  className,
  itemKey,
}: VirtualizedMessageListProps) {
  const listRef = React.useRef<List>(null)
  const heightCacheRef = React.useRef(new MessageHeightCache(estimatedItemSize))
  // Replace force update anti-pattern with useReducer
  const [, forceRender] = React.useReducer((x: number) => x + 1, 0)
  const previousMessagesLength = React.useRef(messages.length)
  const isNearBottomRef = React.useRef(true)
  const [scrollOffset, setScrollOffset] = React.useState(0)

  // Track if user is near bottom and preserve scroll position
  // React 19: Keep useCallback for stable ref (required by react-window)
  const handleScroll = React.useCallback(
    ({
      scrollOffset,
      scrollUpdateWasRequested,
    }: {
      scrollOffset: number
      scrollUpdateWasRequested: boolean
    }) => {
      // Store scroll offset for preservation during data updates
      setScrollOffset(scrollOffset)

      if (!scrollUpdateWasRequested && listRef.current) {
        const list = listRef.current
        const scrollHeight = messages.reduce(
          (sum, msg, i) =>
            sum + heightCacheRef.current.getHeight(msg.id || `msg-${i}`),
          0
        )
        const clientHeight =
          (list as { _outerRef?: { clientHeight?: number } })._outerRef
            ?.clientHeight || 600
        const threshold = 100 // px from bottom

        isNearBottomRef.current =
          scrollHeight - (scrollOffset + clientHeight) < threshold
      }

      onScroll?.(scrollOffset)
    },
    [messages, onScroll]
  )

  // Auto-scroll to bottom on new messages or preserve scroll position
  React.useEffect(() => {
    const hasNewMessages = messages.length > previousMessagesLength.current

    if (listRef.current) {
      if (
        autoScrollToBottom &&
        hasNewMessages &&
        isNearBottomRef.current
      ) {
        // Auto-scroll to bottom when user is near bottom
        listRef.current.scrollToItem(messages.length - 1, 'end')
      } else if (hasNewMessages && !isNearBottomRef.current) {
        // Preserve scroll position when user is not at bottom
        // Small delay to ensure DOM has updated with new messages
        setTimeout(() => {
          if (listRef.current) {
            listRef.current.scrollToOffset(scrollOffset)
          }
        }, 0)
      }
    }

    previousMessagesLength.current = messages.length
  }, [messages.length, autoScrollToBottom, scrollOffset])

  // Get item height from cache
  // React 19: Keep useCallback - passed to react-window, needs stable ref
  const getItemSize = React.useCallback(
    (index: number) => {
      const message = messages[index]
      const key = message?.id || `msg-${index}`
      return heightCacheRef.current.getHeight(key)
    },
    [messages]
  )

  // Update item height and trigger re-render
  // React 19: Keep useCallback - passed to child components, needs stable ref
  const setItemHeight = React.useCallback((index: number, height: number) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(index, false)
      forceRender()
    }
  }, [])

  // Get item key
  // React 19: Keep useCallback - passed to react-window, needs stable ref
  const getItemKey = React.useCallback(
    (index: number, data: MessageListData) => {
      return (
        itemKey?.(index, data.messages) ||
        data.messages[index]?.id ||
        `msg-${index}`
      )
    },
    [itemKey]
  )

  // Clear cache when messages change dramatically
  React.useEffect(() => {
    if (Math.abs(messages.length - previousMessagesLength.current) > 50) {
      heightCacheRef.current.clear()
    }
  }, [messages.length])

  // Check if any message is currently streaming (for aria-busy)
  // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
  const isStreaming = React.useMemo(
    () => messages.some((m) => m.status === 'streaming'),
    [messages]
  )

  return (
    <div
      className={className}
      style={{ height: '100%', width: '100%' }}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={isStreaming}
    >
      <AutoSizerComponent>
        {({ height: _height, width }: { height: number; width: number }) => (
          <ListComponent
            ref={listRef}
            height={_height}
            width={width}
            itemCount={messages.length}
            itemSize={getItemSize}
            itemData={{
              messages,
              renderMessage,
              heightCache: heightCacheRef.current,
              setItemHeight,
            }}
            itemKey={getItemKey}
            overscanCount={overscanCount}
            onScroll={handleScroll}
          >
            {MessageItem}
          </ListComponent>
        )}
      </AutoSizerComponent>
    </div>
  )
}

// ============================================================================
// Smart Message List (Auto-enables virtualization)
// ============================================================================

export function AutoVirtualizedMessageList({
  messages,
  renderMessage,
  virtualizationThreshold = 100,
  ...props
}: MessageListProps) {
  const shouldVirtualize = messages.length > virtualizationThreshold

  if (shouldVirtualize) {
    return (
      <VirtualizedMessageList
        messages={messages}
        renderMessage={renderMessage}
        {...props}
      />
    )
  }

  // Standard rendering for small lists
  // Check if any message is currently streaming (for aria-busy)
  // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
  const isStreaming = React.useMemo(
    () => messages.some((m) => m.status === 'streaming'),
    [messages]
  )

  return (
    <div
      className={props.className}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={isStreaming}
    >
      {messages.map((message, index) => (
        <div key={message.id || `msg-${index}`}>
          {renderMessage(message, index)}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to manage scroll position and auto-scroll behavior
 */
export function useMessageListScroll(
  messages: Message[],
  options: {
    autoScroll?: boolean
    scrollThreshold?: number
  } = {}
) {
  const { autoScroll = true, scrollThreshold = 100 } = options
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false)

  const handleScroll = useCallback(
    (_scrollOffset: number) => {
      // This would need the total height to work properly
      // Implementation depends on the container
      setUserHasScrolledUp(!isNearBottom)
    },
    [isNearBottom]
  )

  const scrollToBottom = useCallback(() => {
    // Implementation depends on ref to list component
    setUserHasScrolledUp(false)
    setIsNearBottom(true)
  }, [])

  return {
    isNearBottom,
    userHasScrolledUp,
    handleScroll,
    scrollToBottom,
    shouldAutoScroll: autoScroll && isNearBottom,
  }
}

/**
 * Hook to implement "Jump to bottom" button
 */
export function useJumpToBottom(isNearBottom: boolean) {
  const [showButton, setShowButton] = useState(false)
  const [newMessageCount, setNewMessageCount] = useState(0)

  useEffect(() => {
    setShowButton(!isNearBottom && newMessageCount > 0)
  }, [isNearBottom, newMessageCount])

  const incrementNewMessages = useCallback(() => {
    if (!isNearBottom) {
      setNewMessageCount((prev: number) => prev + 1)
    }
  }, [isNearBottom])

  const resetNewMessages = useCallback(() => {
    setNewMessageCount(0)
    setShowButton(false)
  }, [])

  return {
    showButton,
    newMessageCount,
    incrementNewMessages,
    resetNewMessages,
  }
}

// ============================================================================
// Performance Monitoring
// ============================================================================

export function useMessageListPerformance(messages: Message[]) {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    messageCount: 0,
    averageHeight: 0,
  })

  useEffect(() => {
    const startTime = performance.now()

    // Measure after render
    requestIdleCallback(() => {
      const endTime = performance.now()
      setMetrics({
        renderTime: endTime - startTime,
        messageCount: messages.length,
        averageHeight: 150, // Would calculate from actual heights
      })
    })
  }, [messages.length])

  return metrics
}

export default VirtualizedMessageList
