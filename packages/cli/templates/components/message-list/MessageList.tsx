/**
 * Message List Component
 * Virtualized message list with auto-scroll
 */

import React, { useRef, useEffect, useCallback } from 'react'
import { MessageItem, Message } from './MessageItem'

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
  autoScroll?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  renderMessage?: (message: Message) => React.ReactNode
  className?: string
}

export function MessageList({
  messages,
  isLoading = false,
  autoScroll = true,
  onLoadMore,
  hasMore = false,
  renderMessage,
  className = '',
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isUserScrollingRef = useRef(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && !isUserScrollingRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Detect user scrolling
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

    isUserScrollingRef.current = !isAtBottom

    // Load more when scrolling to top
    if (scrollTop < 100 && hasMore && onLoadMore && !isLoading) {
      onLoadMore()
    }
  }, [hasMore, onLoadMore, isLoading])

  // Scroll to bottom manually
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    isUserScrollingRef.current = false
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {/* Loading more indicator */}
        {isLoading && hasMore && (
          <div className="flex justify-center py-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start a conversation!</p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            {renderMessage ? renderMessage(message) : <MessageItem message={message} />}
          </div>
        ))}

        {/* Streaming indicator */}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {isUserScrollingRef.current && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-2 bg-white border rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Scroll to bottom"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  )
}
