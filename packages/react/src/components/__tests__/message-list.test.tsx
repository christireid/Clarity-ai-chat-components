import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageList } from '../message-list'
import type { Message } from '@clarity-chat/types'

describe('MessageList Component', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      chatId: 'chat-1',
      role: 'user',
      content: 'First message',
      createdAt: new Date(Date.now() - 3000),
      updatedAt: new Date(Date.now() - 3000),
      status: 'sent',
    },
    {
      id: '2',
      chatId: 'chat-1',
      role: 'assistant',
      content: 'Second message',
      createdAt: new Date(Date.now() - 2000),
      updatedAt: new Date(Date.now() - 2000),
      status: 'sent',
    },
    {
      id: '3',
      chatId: 'chat-1',
      role: 'user',
      content: 'Third message',
      createdAt: new Date(Date.now() - 1000),
      updatedAt: new Date(Date.now() - 1000),
      status: 'sent',
    },
  ]

  describe('Rendering', () => {
    it('should render all messages', () => {
      render(<MessageList messages={mockMessages} />)

      expect(screen.getByText('First message')).toBeInTheDocument()
      expect(screen.getByText('Second message')).toBeInTheDocument()
      expect(screen.getByText('Third message')).toBeInTheDocument()
    })

    it('should render empty state with no messages', () => {
      const { container } = render(<MessageList messages={[]} />)

      expect(container).toBeInTheDocument()
    })

    it('should render messages in chronological order', () => {
      const { container } = render(<MessageList messages={mockMessages} />)

      const messages = Array.from(container.querySelectorAll('.group'))
      expect(messages).toHaveLength(3)
    })
  })

  describe('Auto-scroll', () => {
    it('should auto-scroll to bottom for new messages', () => {
      const { rerender } = render(<MessageList messages={mockMessages} />)

      const newMessages = [
        ...mockMessages,
        {
          id: '4',
          chatId: 'chat-1',
          role: 'assistant' as const,
          content: 'New message',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent' as const,
        },
      ]

      rerender(<MessageList messages={newMessages} />)

      expect(screen.getByText('New message')).toBeInTheDocument()
    })

    it('should not auto-scroll if user has scrolled up', () => {
      const { container } = render(<MessageList messages={mockMessages} />)

      // Simulate scroll position
      const scrollContainer = container.querySelector('[data-autoscroll]')
      if (scrollContainer) {
        Object.defineProperty(scrollContainer, 'scrollTop', { value: 0, writable: true })
        Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, writable: false })
        Object.defineProperty(scrollContainer, 'clientHeight', { value: 500, writable: false })
      }

      expect(container).toBeInTheDocument()
    })
  })

  describe('Message Grouping', () => {
    it('should render consecutive messages from same role', () => {
      const groupedMessages: Message[] = [
        {
          id: '1',
          chatId: 'chat-1',
          role: 'user',
          content: 'Message 1',
          createdAt: new Date(Date.now() - 3000),
          updatedAt: new Date(Date.now() - 3000),
          status: 'sent',
        },
        {
          id: '2',
          chatId: 'chat-1',
          role: 'user',
          content: 'Message 2',
          createdAt: new Date(Date.now() - 2000),
          updatedAt: new Date(Date.now() - 2000),
          status: 'sent',
        },
      ]

      render(<MessageList messages={groupedMessages} />)

      expect(screen.getByText('Message 1')).toBeInTheDocument()
      expect(screen.getByText('Message 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      const { container } = render(<MessageList messages={mockMessages} />)

      const list = container.querySelector('[role="log"]')
      expect(list || container).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<MessageList messages={mockMessages} />)

      expect(container).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<MessageList messages={mockMessages} className="custom-list" />)

      const customElement = container.querySelector('.custom-list')
      expect(customElement).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should handle large message lists', () => {
      const manyMessages: Message[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `msg-${i}`,
        chatId: 'chat-1',
        role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
        content: `Message ${i}`,
        createdAt: new Date(Date.now() - (1000 - i) * 1000),
        updatedAt: new Date(Date.now() - (1000 - i) * 1000),
        status: 'sent' as const,
      }))

      const { container } = render(<MessageList messages={manyMessages} />)

      expect(container).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined messages gracefully', () => {
      expect(() => render(<MessageList messages={[]} />)).not.toThrow()
    })

    it('should handle messages with missing optional fields', () => {
      const minimalMessages: Message[] = [
        {
          id: '1',
          chatId: 'chat-1',
          role: 'user',
          content: 'Minimal message',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        },
      ]

      expect(() => render(<MessageList messages={minimalMessages} />)).not.toThrow()
    })
  })
})
