'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useChat } from '../Chat'
import { ChatBubble } from '../ChatBubble'
import { cn } from '@clarity-chat/primitives'
import type { Message } from '../types'

interface VirtualizedChatListProps {
  className?: string
  renderBubble?: (message: Message) => React.ReactNode
}

// Map to store row heights
const rowHeights = new Map<number, number>()

export function VirtualizedChatList({
  className,
  renderBubble,
}: VirtualizedChatListProps) {
  const { messages } = useChat()
  const listRef = useRef<List>(null)
  const [isSticky, setIsSticky] = useState(true)

  // Ref to hold the list instance to trigger resets
  const setListRef = useCallback((ref: List | null) => {
    listRef.current = ref
  }, [])

  // Handle scroll events to detect if user scrolled up
  const onScroll = useCallback(({ scrollOffset, scrollDirection }: any) => {
    if (!listRef.current) return

    // Simple sticky logic: if we scroll up, disable sticky
    if (scrollDirection === 'backward') {
      setIsSticky(false)
    }

    // If we are near the bottom, re-enable sticky
    // Note: react-window doesn't expose total scrollHeight easily in onScroll,
    // so we might need a more robust check or just rely on manual "Scroll to Bottom" button
    // For now, we'll auto-scroll only if we were already sticky OR if new messages arrive and we haven't scrolled far up
  }, [])

  // Scroll to bottom when messages change, ONLY if sticky
  useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      if (isSticky) {
        // Small timeout to allow layout to settle
        setTimeout(() => {
          listRef.current?.scrollToItem(messages.length - 1, 'end')
        }, 50)
      }
    }
  }, [messages.length, isSticky])

  const getItemKey = (index: number) => messages[index].id

  // Custom Item Renderer that measures itself
  const Row = ({
    index,
    style,
  }: {
    index: number
    style: React.CSSProperties
  }) => {
    const rowRef = useRef<HTMLDivElement>(null)
    const message = messages[index]

    useEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height
        // Add some padding
        const totalHeight = height + 16

        if (rowHeights.get(index) !== totalHeight) {
          rowHeights.set(index, totalHeight)
          listRef.current?.resetAfterIndex(index)
        }
      }
    }, [message, index])

    return (
      <div style={style}>
        <div ref={rowRef} className="px-4 pb-4">
          {renderBubble ? (
            renderBubble(message)
          ) : (
            <ChatBubble message={message} />
          )}
        </div>
      </div>
    )
  }

  const getItemSize = (index: number) => rowHeights.get(index) || 80 // Default estimate

  return (
    <div className={cn('flex-1 h-full min-h-0 relative', className)}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <List
            ref={setListRef}
            height={height}
            width={width}
            itemCount={messages.length}
            itemSize={getItemSize}
            itemKey={getItemKey}
            onScroll={onScroll}
            className="scrollbar-thin"
          >
            {Row}
          </List>
        )}
      </AutoSizer>

      {/* Scroll to Bottom Button (Visible when not sticky) */}
      {!isSticky && (
        <button
          onClick={() => {
            setIsSticky(true)
            listRef.current?.scrollToItem(messages.length - 1, 'end')
          }}
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs shadow-lg animate-in fade-in"
        >
          Scroll to bottom
        </button>
      )}
    </div>
  )
}
