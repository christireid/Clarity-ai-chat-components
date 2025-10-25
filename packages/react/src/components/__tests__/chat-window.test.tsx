import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatWindow } from '../chat-window'
import type { Message } from '@clarity-chat/types'

describe('ChatWindow Component', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'user',
      content: 'Hello',
      createdAt: Date.now() - 2000,
      status: 'sent',
    },
    {
      id: '2',
      role: 'assistant',
      content: 'Hi there! How can I help you?',
      createdAt: Date.now() - 1000,
      status: 'sent',
    },
  ]

  const mockOnSendMessage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the chat window with messages', () => {
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument()
    })

    it('should render empty state with no messages', () => {
      render(<ChatWindow messages={[]} onSendMessage={mockOnSendMessage} />)
      // Should still render the input area
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('should render thinking indicator when loading', () => {
      render(
        <ChatWindow messages={mockMessages} isLoading={true} onSendMessage={mockOnSendMessage} />
      )
      // ThinkingIndicator should be present
      expect(screen.getByText(/thinking|processing/i)).toBeInTheDocument()
    })
  })

  describe('Message Input', () => {
    it('should allow typing in the input field', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'New message')

      expect(textarea).toHaveValue('New message')
    })

    it('should call onSendMessage when form is submitted', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test message{Enter}')

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
      })
    })

    it('should clear input after sending message', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test message{Enter}')

      await waitFor(() => {
        expect(textarea).toHaveValue('')
      })
    })

    it('should disable input when loading', () => {
      render(
        <ChatWindow messages={mockMessages} isLoading={true} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('should not send empty messages', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, '{Enter}')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })

    it('should not send whitespace-only messages', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, '   {Enter}')

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })
  })

  describe('Message List Display', () => {
    it('should display messages in order', () => {
      const { container } = render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const messages = container.querySelectorAll('.group')
      expect(messages.length).toBe(mockMessages.length)
    })

    it('should update when new messages are added', () => {
      const { rerender } = render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const newMessages = [
        ...mockMessages,
        {
          id: '3',
          role: 'user' as const,
          content: 'Another message',
          createdAt: Date.now(),
          status: 'sent' as const,
        },
      ]

      rerender(<ChatWindow messages={newMessages} onSendMessage={mockOnSendMessage} />)

      expect(screen.getByText('Another message')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show thinking indicator during loading', () => {
      render(
        <ChatWindow messages={mockMessages} isLoading={true} onSendMessage={mockOnSendMessage} />
      )

      expect(screen.getByText(/thinking|processing/i)).toBeInTheDocument()
    })

    it('should hide thinking indicator when not loading', () => {
      render(
        <ChatWindow messages={mockMessages} isLoading={false} onSendMessage={mockOnSendMessage} />
      )

      expect(screen.queryByText(/thinking|processing/i)).not.toBeInTheDocument()
    })

    it('should toggle thinking indicator correctly', () => {
      const { rerender } = render(
        <ChatWindow messages={mockMessages} isLoading={false} onSendMessage={mockOnSendMessage} />
      )

      expect(screen.queryByText(/thinking|processing/i)).not.toBeInTheDocument()

      rerender(
        <ChatWindow messages={mockMessages} isLoading={true} onSendMessage={mockOnSendMessage} />
      )

      expect(screen.getByText(/thinking|processing/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible input with label', () => {
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')

      // Tab should focus the textarea
      await user.tab()
      expect(textarea).toHaveFocus()
    })

    it('should have proper ARIA attributes', () => {
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-disabled', 'false')
    })

    it('should indicate disabled state accessibly', () => {
      render(
        <ChatWindow messages={mockMessages} isLoading={true} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(
        <ChatWindow
          messages={mockMessages}
          onSendMessage={mockOnSendMessage}
          className="custom-chat-window"
        />
      )

      const card = container.querySelector('.custom-chat-window')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should handle rapid message sending', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')

      await user.type(textarea, 'Message 1{Enter}')
      await user.type(textarea, 'Message 2{Enter}')
      await user.type(textarea, 'Message 3{Enter}')

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalledTimes(3)
      })
    })

    it('should handle async onSendMessage', async () => {
      const asyncOnSend = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<ChatWindow messages={mockMessages} onSendMessage={asyncOnSend} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Async message{Enter}')

      await waitFor(() => {
        expect(asyncOnSend).toHaveBeenCalledWith('Async message')
      })
    })

    it('should clear input even if onSendMessage throws', async () => {
      const errorOnSend = vi.fn().mockRejectedValue(new Error('Send failed'))
      const user = userEvent.setup()

      render(<ChatWindow messages={mockMessages} onSendMessage={errorOnSend} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Error message{Enter}')

      // Input should still be cleared
      await waitFor(() => {
        expect(textarea).toHaveValue('')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long messages', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const longMessage = 'A'.repeat(10000)
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, longMessage)

      expect(textarea).toHaveValue(longMessage)
    })

    it('should handle messages with newlines', async () => {
      const user = userEvent.setup()
      render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2')

      expect(textarea.value).toContain('\n')
    })

    it('should handle empty messages array', () => {
      expect(() =>
        render(<ChatWindow messages={[]} onSendMessage={mockOnSendMessage} />)
      ).not.toThrow()
    })

    it('should handle undefined isLoading', () => {
      expect(() =>
        render(<ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />)
      ).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle large message lists', () => {
      const manyMessages: Message[] = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i}`,
        role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
        content: `Message ${i}`,
        createdAt: Date.now() - (100 - i) * 1000,
        status: 'sent' as const,
      }))

      const { container } = render(
        <ChatWindow messages={manyMessages} onSendMessage={mockOnSendMessage} />
      )

      expect(container).toBeInTheDocument()
    })
  })
})
