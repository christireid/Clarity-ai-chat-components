/**
 * VirtualizedMessageList Scroll Regression Tests
 *
 * Tests for ISSUE-019: VirtualizedMessageList Scroll Jump
 * Ensures scroll position is preserved during data updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VirtualizedMessageList } from '../virtualized-message-list'
import type { Message } from '@clarity-chat/types'

// Mock react-window to avoid complex virtualization setup
vi.mock('react-window', () => ({
  VariableSizeList: vi.fn(({ children, itemCount, itemSize, height, onScroll }) => {
    const items = []
    for (let i = 0; i < itemCount; i++) {
      items.push(children({ index: i, style: { height: itemSize(i) } }))
    }

    return (
      <div
        data-testid="virtualized-list"
        style={{ height, overflow: 'auto' }}
        onScroll={(e) => {
          if (onScroll) {
            onScroll({
              scrollOffset: e.currentTarget.scrollTop,
              scrollUpdateWasRequested: false,
            })
          }
        }}
      >
        {items}
      </div>
    )
  }),
}))

vi.mock('react-virtualized-auto-sizer', () => ({
  default: vi.fn(({ children }) => children({ height: 400, width: 600 })),
}))

describe('VirtualizedMessageList Scroll Regression', () => {
  const user = userEvent.setup()

  const createMockMessage = (id: string, content: string): Message => ({
    id,
    content,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const renderMessage = (message: Message, index: number) => (
    <div key={message.id} data-testid={`message-${message.id}`}>
      {message.content}
    </div>
  )

  describe('Scroll Position Preservation', () => {
    it('preserves scroll position when new messages are added and user is scrolled up', async () => {
      const initialMessages = Array.from({ length: 50 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}`)
      )

      const { rerender } = render(
        <VirtualizedMessageList
          messages={initialMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      const listElement = screen.getByTestId('virtualized-list')

      // Simulate scrolling to middle (scroll to ~25th item)
      fireEvent.scroll(listElement, { target: { scrollTop: 1250 } })

      // Wait for scroll event to be processed
      await waitFor(() => {
        expect(listElement.scrollTop).toBe(1250)
      })

      // Add new messages
      const newMessages = [
        ...initialMessages,
        createMockMessage('msg-50', 'New message 1'),
        createMockMessage('msg-51', 'New message 2'),
      ]

      rerender(
        <VirtualizedMessageList
          messages={newMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      // Scroll position should be preserved (approximately)
      // Note: In real implementation, this would be more precise
      await waitFor(() => {
        // Should maintain relative scroll position
        expect(listElement.scrollTop).toBeGreaterThan(1200)
      })
    })

    it('auto-scrolls to bottom when user is near bottom', async () => {
      const initialMessages = Array.from({ length: 10 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}`)
      )

      const { rerender } = render(
        <VirtualizedMessageList
          messages={initialMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
          autoScrollToBottom={true}
        />
      )

      const listElement = screen.getByTestId('virtualized-list')

      // Scroll to near bottom (within threshold)
      const scrollHeight = 10 * 50 // 10 messages * 50px each
      const containerHeight = 400
      const nearBottomPosition = scrollHeight - containerHeight - 50 // Within 50px of bottom

      fireEvent.scroll(listElement, { target: { scrollTop: nearBottomPosition } })

      // Add new messages
      const newMessages = [
        ...initialMessages,
        createMockMessage('msg-10', 'New message'),
      ]

      rerender(
        <VirtualizedMessageList
          messages={newMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
          autoScrollToBottom={true}
        />
      )

      // Should auto-scroll to bottom
      await waitFor(() => {
        const expectedScrollTop = 11 * 50 - 400 // New total height minus container height
        expect(listElement.scrollTop).toBe(expectedScrollTop)
      })
    })

    it('does not auto-scroll when autoScrollToBottom is false', async () => {
      const initialMessages = Array.from({ length: 10 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}`)
      )

      const { rerender } = render(
        <VirtualizedMessageList
          messages={initialMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
          autoScrollToBottom={false}
        />
      )

      const listElement = screen.getByTestId('virtualized-list')

      // Scroll to middle
      fireEvent.scroll(listElement, { target: { scrollTop: 200 } })

      // Add new messages
      const newMessages = [
        ...initialMessages,
        createMockMessage('msg-10', 'New message'),
      ]

      rerender(
        <VirtualizedMessageList
          messages={newMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
          autoScrollToBottom={false}
        />
      )

      // Should not auto-scroll
      expect(listElement.scrollTop).toBe(200)
    })
  })

  describe('Performance with Large Datasets', () => {
    it('handles large message lists efficiently', () => {
      const largeMessageList = Array.from({ length: 1000 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i} with some content`)
      )

      const startTime = performance.now()

      const { container } = render(
        <VirtualizedMessageList
          messages={largeMessageList}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      const endTime = performance.now()

      // Should render quickly even with large dataset
      expect(endTime - startTime).toBeLessThan(100) // Less than 100ms
      expect(container).toBeInTheDocument()
    })

    it('maintains scroll position during rapid message updates', async () => {
      let messages = Array.from({ length: 20 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}`)
      )

      const { rerender } = render(
        <VirtualizedMessageList
          messages={messages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      const listElement = screen.getByTestId('virtualized-list')

      // Scroll to position
      fireEvent.scroll(listElement, { target: { scrollTop: 300 } })

      // Simulate rapid message additions (like in a live chat)
      for (let i = 0; i < 5; i++) {
        messages = [
          ...messages,
          createMockMessage(`new-msg-${i}`, `New message ${i}`),
        ]

        rerender(
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={50}
            height={400}
          />
        )
      }

      // Scroll position should be reasonably preserved
      await waitFor(() => {
        // Should not jump to bottom due to rapid updates
        expect(listElement.scrollTop).toBeGreaterThan(250)
        expect(listElement.scrollTop).toBeLessThan(400)
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty message list gracefully', () => {
      expect(() => {
        render(
          <VirtualizedMessageList
            messages={[]}
            renderMessage={renderMessage}
            estimatedItemSize={50}
            height={400}
          />
        )
      }).not.toThrow()
    })

    it('handles single message correctly', () => {
      const singleMessage = [createMockMessage('msg-1', 'Single message')]

      const { container } = render(
        <VirtualizedMessageList
          messages={singleMessage}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      expect(screen.getByTestId('message-msg-1')).toBeInTheDocument()
      expect(container).toBeInTheDocument()
    })

    it('handles messages with varying heights', () => {
      const variedMessages = [
        createMockMessage('short', 'Hi'),
        createMockMessage('long', 'This is a very long message that should take up more space and potentially wrap to multiple lines depending on the container width and styling applied to the message component.'),
        createMockMessage('medium', 'Medium length message'),
      ]

      const { container } = render(
        <VirtualizedMessageList
          messages={variedMessages}
          renderMessage={renderMessage}
          estimatedItemSize={50}
          height={400}
        />
      )

      expect(screen.getByTestId('message-short')).toBeInTheDocument()
      expect(screen.getByTestId('message-long')).toBeInTheDocument()
      expect(screen.getByTestId('message-medium')).toBeInTheDocument()
    })
  })
})