import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatWindow } from '../chat-window'
import type { Message } from '@clarity-chat/types'

describe('ChatWindow Component', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      chatId: 'test-chat',
      role: 'user',
      content: 'Hello',
      createdAt: new Date(Date.now() - 2000),
      updatedAt: new Date(Date.now() - 2000),
      status: 'sent',
    },
    {
      id: '2',
      chatId: 'test-chat',
      role: 'assistant',
      content: 'Hi there! How can I help you?',
      createdAt: new Date(Date.now() - 1000),
      updatedAt: new Date(Date.now() - 1000),
      status: 'sent',
    },
  ]

  const mockOnSendMessage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the chat window with messages', () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(
        screen.getByText('Hi there! How can I help you?')
      ).toBeInTheDocument()
    })

    it('should render empty state with no messages', () => {
      render(<ChatWindow messages={[]} onSendMessage={mockOnSendMessage} />)
      // Should still render the input area
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('should render thinking indicator when loading', () => {
      render(
        <ChatWindow
          messages={mockMessages}
          isLoading={true}
          aiStatus={{ stage: 'thinking', startedAt: new Date() }}
          onSendMessage={mockOnSendMessage}
        />
      )
      // ThinkingIndicator should be present
      expect(screen.getByText(/thinking/i)).toBeInTheDocument()
    })
  })

  describe('Message Input', () => {
    it('should allow typing in the input field', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'New message' } })

      expect(textarea).toHaveValue('New message')
    })

    it('should call onSendMessage when form is submitted', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )
      const user = userEvent.setup()

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Test message' } })
      await waitFor(() => {
        expect(textarea).toHaveValue('Test message')
      })
      const sendButton = screen.getByRole('button', { name: /send message/i })
      await waitFor(() => {
        expect(sendButton).not.toBeDisabled()
      })
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalledWith('Test message')
      })
    })

    it('should clear input after sending message', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )
      const user = userEvent.setup()

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Test message' } })
      await waitFor(() => {
        expect(textarea).toHaveValue('Test message')
      })
      const sendButton = screen.getByRole('button', { name: /send message/i })
      await waitFor(() => {
        expect(sendButton).not.toBeDisabled()
      })
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('')
      })
    })

    it('should disable input when loading', () => {
      render(
        <ChatWindow
          messages={mockMessages}
          isLoading={true}
          onSendMessage={mockOnSendMessage}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('should not send empty messages', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

      expect(mockOnSendMessage).not.toHaveBeenCalled()
    })

    it('should not send whitespace-only messages', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: '   ' } })
      await waitFor(() => {
        expect(textarea).toHaveValue('   ')
      })
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' })

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
          chatId: 'test-chat',
          role: 'user' as const,
          content: 'Another message',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent' as const,
        },
      ]

      rerender(
        <ChatWindow messages={newMessages} onSendMessage={mockOnSendMessage} />
      )

      expect(screen.getByText('Another message')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show thinking indicator during loading', () => {
      render(
        <ChatWindow
          messages={mockMessages}
          isLoading={true}
          aiStatus={{ stage: 'thinking', startedAt: new Date() }}
          onSendMessage={mockOnSendMessage}
        />
      )

      expect(screen.getByText(/thinking/i)).toBeInTheDocument()
    })

    it('should hide thinking indicator when not loading', () => {
      render(
        <ChatWindow
          messages={mockMessages}
          isLoading={false}
          aiStatus={{ stage: 'thinking', startedAt: new Date() }}
          onSendMessage={mockOnSendMessage}
        />
      )

      expect(screen.queryByText(/thinking|processing/i)).not.toBeInTheDocument()
    })

    it('should toggle thinking indicator correctly', () => {
      const { rerender } = render(
        <ChatWindow
          messages={mockMessages}
          isLoading={false}
          aiStatus={{ stage: 'thinking', startedAt: new Date() }}
          onSendMessage={mockOnSendMessage}
        />
      )

      expect(screen.queryByText(/thinking|processing/i)).not.toBeInTheDocument()

      rerender(
        <ChatWindow
          messages={mockMessages}
          isLoading={true}
          aiStatus={{ stage: 'thinking', startedAt: new Date() }}
          onSendMessage={mockOnSendMessage}
        />
      )

      expect(screen.getByText(/thinking/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible input with label', () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')

      // Focus should be possible via keyboard interaction
      textarea.focus()
      expect(textarea).toHaveFocus()
    })

    it('should have proper ARIA attributes', () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-disabled', 'false')
    })

    it('should indicate disabled state accessibly', () => {
      render(
        <ChatWindow
          messages={mockMessages}
          isLoading={true}
          onSendMessage={mockOnSendMessage}
        />
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
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )
      const user = userEvent.setup()

      const getTextarea = () => screen.getByRole('textbox')
      const getSendButton = () =>
        screen.getByRole('button', { name: /send message/i })

      fireEvent.change(getTextarea(), { target: { value: 'Message 1' } })
      await waitFor(() => expect(getTextarea()).toHaveValue('Message 1'))
      await waitFor(() => expect(getSendButton()).not.toBeDisabled())
      await user.click(getSendButton())
      await waitFor(() => expect(mockOnSendMessage).toHaveBeenCalledTimes(1))
      await new Promise((resolve) => setTimeout(resolve, 350))

      fireEvent.change(getTextarea(), { target: { value: 'Message 2' } })
      await waitFor(() => expect(getTextarea()).toHaveValue('Message 2'))
      await waitFor(() => expect(getSendButton()).not.toBeDisabled())
      await user.click(getSendButton())
      await waitFor(() => expect(mockOnSendMessage).toHaveBeenCalledTimes(2))
      await new Promise((resolve) => setTimeout(resolve, 350))

      fireEvent.change(getTextarea(), { target: { value: 'Message 3' } })
      await waitFor(() => expect(getTextarea()).toHaveValue('Message 3'))
      await waitFor(() => expect(getSendButton()).not.toBeDisabled())
      await user.click(getSendButton())

      await waitFor(() => {
        expect(mockOnSendMessage).toHaveBeenCalledTimes(3)
      })
    })

    it('should handle async onSendMessage', async () => {
      const asyncOnSend = vi.fn().mockResolvedValue(undefined)

      render(<ChatWindow messages={mockMessages} onSendMessage={asyncOnSend} />)
      const user = userEvent.setup()

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Async message' } })
      await waitFor(() => expect(textarea).toHaveValue('Async message'))
      await user.click(screen.getByRole('button', { name: /send message/i }))

      await waitFor(() => {
        expect(asyncOnSend).toHaveBeenCalledWith('Async message')
      })
    })

    it('should clear input even if onSendMessage throws', async () => {
      const errorOnSend = vi.fn().mockRejectedValue(new Error('Send failed'))

      render(<ChatWindow messages={mockMessages} onSendMessage={errorOnSend} />)
      const user = userEvent.setup()

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'Error message' } })
      await waitFor(() => expect(textarea).toHaveValue('Error message'))
      await user.click(screen.getByRole('button', { name: /send message/i }))

      // Input should still be cleared
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue('')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long messages', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const longMessage = 'A'.repeat(10000)
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: longMessage } })

      expect(textarea).toHaveValue(longMessage)
    })

    it('should handle messages with newlines', async () => {
      render(
        <ChatWindow messages={mockMessages} onSendMessage={mockOnSendMessage} />
      )

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2' } })

      expect(textarea.value).toContain('\n')
    })

    it('should handle empty messages array', () => {
      expect(() =>
        render(<ChatWindow messages={[]} onSendMessage={mockOnSendMessage} />)
      ).not.toThrow()
    })

    it('should handle undefined isLoading', () => {
      expect(() =>
        render(
          <ChatWindow
            messages={mockMessages}
            onSendMessage={mockOnSendMessage}
          />
        )
      ).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should handle large message lists', () => {
      const manyMessages: Message[] = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i}`,
        chatId: 'test-chat',
        role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
        content: `Message ${i}`,
        createdAt: new Date(Date.now() - (100 - i) * 1000),
        updatedAt: new Date(Date.now() - (100 - i) * 1000),
        status: 'sent' as const,
      }))

      const { container } = render(
        <ChatWindow messages={manyMessages} onSendMessage={mockOnSendMessage} />
      )

      expect(container).toBeInTheDocument()
    })
  })
})
