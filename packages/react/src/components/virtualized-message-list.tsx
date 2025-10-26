/**
 * Virtualized Message List
 * 
 * High-performance message list using virtual scrolling for large datasets.
 * Only renders visible messages to maintain performance with 1000+ messages.
 * 
 * Note: This is an optimized version that manually implements virtualization
 * without external dependencies. For production use with react-window, see docs.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { ScrollArea, Button } from '@clarity-chat/primitives'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import { ArrowDownIcon } from './icons'
import { SkeletonMessage } from './skeleton'
import { INTERACTION_VARIANTS } from '../animations/constants'

export interface VirtualizedMessageListProps {
  messages: MessageType[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  onMessageRetry?: (messageId: string) => void
  /** Show loading skeleton while messages are being fetched */
  isLoading?: boolean
  /** Number of skeleton messages to show while loading */
  loadingCount?: number
  /** Empty state content */
  emptyState?: React.ReactNode
  /** Enable virtualization (only render visible items) */
  enableVirtualization?: boolean
  /** Estimated height of each message in pixels */
  estimatedMessageHeight?: number
  /** Number of overscan items (render extra items above/below viewport) */
  overscan?: number
  className?: string
}

/**
 * Custom hook for virtual scrolling
 */
function useVirtualization(
  itemCount: number,
  containerRef: React.RefObject<HTMLDivElement>,
  estimatedItemHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)

  // Measure container height
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerHeight(entry.contentRect.height)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef])

  // Track scroll position
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      setScrollTop(container.scrollTop)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan)
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / estimatedItemHeight) + overscan
  )

  const visibleItems = Array.from(
    { length: endIndex - startIndex },
    (_, i) => startIndex + i
  )

  const totalHeight = itemCount * estimatedItemHeight
  const offsetY = startIndex * estimatedItemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  }
}

/**
 * Virtualized message list component
 */
export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  isLoading = false,
  loadingCount = 3,
  emptyState,
  enableVirtualization = true,
  estimatedMessageHeight = 120,
  overscan = 3,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Use auto-scroll hook
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth',
    threshold: 100,
  })

  // Virtual scrolling
  const {
    visibleItems,
    totalHeight,
    offsetY,
  } = useVirtualization(
    messages.length,
    containerRef,
    estimatedMessageHeight,
    overscan
  )

  // Show empty state if no messages and not loading
  const showEmptyState = messages.length === 0 && !isLoading && emptyState

  // Use virtualization only for large lists
  const shouldVirtualize = enableVirtualization && messages.length > 50

  return (
    <div className="relative h-full">
      <ScrollArea 
        ref={(node) => {
          (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }} 
        className={className}
      >
        {/* Loading skeletons */}
        {isLoading && messages.length === 0 && (
          <div className="space-y-4 p-4">
            {Array.from({ length: loadingCount }).map((_, index) => (
              <SkeletonMessage
                key={`skeleton-${index}`}
                role={index % 2 === 0 ? 'user' : 'assistant'}
                lines={index % 2 === 0 ? 2 : 4}
                variant="shimmer"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {showEmptyState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-full p-8"
          >
            {emptyState}
          </motion.div>
        )}

        {/* Messages - Virtualized */}
        {messages.length > 0 && shouldVirtualize && (
          <div 
            ref={contentRef}
            className="relative"
            style={{ height: totalHeight }}
          >
            <div
              className="absolute top-0 left-0 right-0 space-y-4 p-4"
              style={{ transform: `translateY(${offsetY}px)` }}
            >
              {visibleItems.map((index) => {
                const message = messages[index]
                if (!message) return null

                return (
                  <Message
                    key={message.id}
                    message={message}
                    onCopy={(content) => onMessageCopy?.(message.id, content)}
                    onFeedback={(type) => onMessageFeedback?.(message.id, type)}
                    onRetry={() => onMessageRetry?.(message.id)}
                  />
                )
              })}
            </div>

            {/* Loading indicator for new messages */}
            {isLoading && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <SkeletonMessage role="assistant" lines={3} variant="shimmer" />
              </div>
            )}
          </div>
        )}

        {/* Messages - Non-virtualized (for small lists) */}
        {messages.length > 0 && !shouldVirtualize && (
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onCopy={(content) => onMessageCopy?.(message.id, content)}
                onFeedback={(type) => onMessageFeedback?.(message.id, type)}
                onRetry={() => onMessageRetry?.(message.id)}
              />
            ))}

            {/* Loading indicator for new messages */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SkeletonMessage role="assistant" lines={3} variant="shimmer" />
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>
      
      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {!isNearBottom && messages.length > 0 && (
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={INTERACTION_VARIANTS.button.hover}
              whileTap={INTERACTION_VARIANTS.button.tap}
              transition={INTERACTION_VARIANTS.button.transition}
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={scrollToBottom}
                className="shadow-lg gap-1.5"
              >
                <ArrowDownIcon size={16} />
                Scroll to bottom
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Performance tip component for virtualization threshold
 */
export const VirtualizationTip: React.FC<{ messageCount: number }> = ({ messageCount }) => {
  if (messageCount < 50) return null

  return (
    <div className="text-xs text-muted-foreground p-2 border-t">
      💡 Tip: Virtual scrolling is enabled for better performance with {messageCount} messages
    </div>
  )
}
