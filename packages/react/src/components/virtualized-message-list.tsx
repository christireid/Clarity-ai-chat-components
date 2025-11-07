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

import React, { useRef, useEffect, useState, useCallback, useReducer } from 'react'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Message } from '@clarity-chat/types'

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

export interface MessageListProps extends Omit<VirtualizedMessageListProps, 'threshold'> {
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

interface MessageItemProps extends ListChildComponentProps {
  data: {
    messages: Message[]
    renderMessage: (message: Message, index: number) => React.ReactNode
    heightCache: MessageHeightCache
    setItemHeight: (index: number, height: number) => void
  }
}

function MessageItem({ index, style, data }: MessageItemProps) {
  const { messages, renderMessage, heightCache, setItemHeight } = data
  const message = messages[index]
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight
      const messageKey = message.id || `msg-${index}`
      
      if (!heightCache.hasHeight(messageKey) || heightCache.getHeight(messageKey) !== height) {
        heightCache.setHeight(messageKey, height)
        setItemHeight(index, height)
      }
    }
  }, [message, index, heightCache, setItemHeight])

  return (
    <div style={style}>
      <div ref={itemRef}>
        {renderMessage(message, index)}
      </div>
    </div>
  )
}

// ============================================================================
// Virtualized Message List Component
// ============================================================================

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
  const listRef = useRef<List>(null)
  const heightCacheRef = useRef(new MessageHeightCache(estimatedItemSize))
  // Replace force update anti-pattern with useReducer
  const [, forceRender] = useReducer((x: number) => x + 1, 0)
  const previousMessagesLength = useRef(messages.length)
  const isNearBottomRef = useRef(true)

  // Track if user is near bottom
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (!scrollUpdateWasRequested && listRef.current) {
      const list = listRef.current
      const scrollHeight = messages.reduce((sum, msg, i) => 
        sum + heightCacheRef.current.getHeight(msg.id || `msg-${i}`), 0
      )
      const clientHeight = (list as any)._outerRef?.clientHeight || 600
      const threshold = 100 // px from bottom
      
      isNearBottomRef.current = scrollHeight - (scrollOffset + clientHeight) < threshold
    }
    
    onScroll?.(scrollOffset)
  }, [messages, onScroll])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (
      autoScrollToBottom &&
      messages.length > previousMessagesLength.current &&
      isNearBottomRef.current &&
      listRef.current
    ) {
      listRef.current.scrollToItem(messages.length - 1, 'end')
    }
    previousMessagesLength.current = messages.length
  }, [messages.length, autoScrollToBottom])

  // Get item height from cache
  const getItemSize = useCallback((index: number) => {
    const message = messages[index]
    const key = message.id || `msg-${index}`
    return heightCacheRef.current.getHeight(key)
  }, [messages])

  // Update item height and trigger re-render
  const setItemHeight = useCallback((index: number, height: number) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(index, false)
      forceRender()
    }
  }, [])

  // Get item key
  const getItemKey = useCallback((index: number, data: Message[]) => {
    return itemKey?.(index, data) || data[index].id || `msg-${index}`
  }, [itemKey])

  // Clear cache when messages change dramatically
  useEffect(() => {
    if (Math.abs(messages.length - previousMessagesLength.current) > 50) {
      heightCacheRef.current.clear()
    }
  }, [messages.length])

  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
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
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

// ============================================================================
// Smart Message List (Auto-enables virtualization)
// ============================================================================

export function MessageList({
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
  return (
    <div className={props.className}>
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

  const handleScroll = useCallback((scrollOffset: number) => {
    // This would need the total height to work properly
    // Implementation depends on the container
    setUserHasScrolledUp(!isNearBottom)
  }, [isNearBottom])

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
      setNewMessageCount(prev => prev + 1)
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
