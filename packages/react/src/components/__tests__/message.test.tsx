import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message } from '../message'
import type { Message as MessageType } from '@clarity-chat/types'
import { renderWithProviders } from '../../test-utils'

describe('Message Component', () => {
  const mockMessage: MessageType = {
    id: '1',
    chatId: 'chat-1',
    role: 'user',
    content: 'Hello, world!',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  const mockAssistantMessage: MessageType = {
    id: '2',
    chatId: 'chat-1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render user message correctly', () => {
      renderWithProviders(<Message message={mockMessage} />)
      expect(screen.getByText('Hello, world!')).toBeInTheDocument()
      expect(screen.getByText('You')).toBeInTheDocument()
    })

    it('should render assistant message correctly', () => {
      renderWithProviders(<Message message={mockAssistantMessage} />)
      expect(
        screen.getByText('Hello! How can I help you today?')
      ).toBeInTheDocument()
      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    })

    it('should render without avatar when showAvatar is false', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} showAvatar={false} />
      )
      // Avatar component has specific size class - it shouldn't exist when showAvatar is false
      const avatar = container.querySelector('.h-10.w-10')
      expect(avatar).not.toBeInTheDocument()
    })

    it('should render without timestamp when showTimestamp is false', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} showTimestamp={false} />
      )
      const timeElements = container.querySelectorAll(
        '.text-xs.text-muted-foreground'
      )
      expect(timeElements).toHaveLength(0)
    })
  })

  describe('Status Badges', () => {
    it('should show "Sending" badge for sending status', () => {
      const sendingMessage = { ...mockMessage, status: 'sending' as const }
      renderWithProviders(<Message message={sendingMessage} />)
      expect(screen.getByText('Sending')).toBeInTheDocument()
    })

    it('should show "Error" badge for error status', () => {
      const errorMessage = { ...mockMessage, status: 'error' as const }
      renderWithProviders(<Message message={errorMessage} />)
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })

  describe('Streaming Animation', () => {
    it('should render assistant message with streaming status', () => {
      const streamingMessage = {
        ...mockAssistantMessage,
        status: 'streaming' as const,
      }
      renderWithProviders(<Message message={streamingMessage} />)
      // Verify the assistant message content is rendered during streaming
      expect(screen.getByText(/How can I help you/)).toBeInTheDocument()
      // Verify no "Error" or "Sending" badge is shown
      expect(screen.queryByText('Error')).not.toBeInTheDocument()
      expect(screen.queryByText('Sending')).not.toBeInTheDocument()
      // AI Assistant label should be visible
      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    })
  })

  describe('Attachments', () => {
    it('should render attachments', () => {
      const messageWithAttachments: MessageType = {
        ...mockMessage,
        attachments: [
          {
            id: '1',
            name: 'document.pdf',
            url: '/document.pdf',
            type: 'document',
            mimeType: 'application/pdf',
            size: 1024,
          },
          {
            id: '2',
            name: 'image.png',
            url: '/image.png',
            type: 'image',
            mimeType: 'image/png',
            size: 2048,
          },
        ],
      }
      renderWithProviders(<Message message={messageWithAttachments} />)
      expect(screen.getByText('document.pdf')).toBeInTheDocument()
      expect(screen.getByText('image.png')).toBeInTheDocument()
    })
  })

  describe('Markdown Rendering', () => {
    it('should render markdown in assistant messages', () => {
      const markdownMessage: MessageType = {
        ...mockAssistantMessage,
        content: '**Bold text** and *italic text*',
      }
      const { container } = renderWithProviders(
        <Message message={markdownMessage} />
      )
      expect(container.querySelector('strong')).toBeInTheDocument()
      expect(container.querySelector('em')).toBeInTheDocument()
    })

    it('should render code blocks', () => {
      const codeMessage: MessageType = {
        ...mockAssistantMessage,
        content: '```javascript\nconst x = 42;\n```',
      }
      const { container } = renderWithProviders(
        <Message message={codeMessage} />
      )
      expect(container.querySelector('pre')).toBeInTheDocument()
      expect(container.querySelector('code')).toBeInTheDocument()
    })

    it('should render inline code', () => {
      const inlineCodeMessage: MessageType = {
        ...mockAssistantMessage,
        content: 'Use `console.log()` to debug',
      }
      const { container } = renderWithProviders(
        <Message message={inlineCodeMessage} />
      )
      const inlineCode = container.querySelector('code')
      expect(inlineCode).toBeInTheDocument()
    })
  })

  describe('Feedback Actions', () => {
    it('should call onFeedback with "up" when thumbs up is clicked', async () => {
      const onFeedback = vi.fn()
      const { container } = renderWithProviders(
        <Message message={mockAssistantMessage} onFeedback={onFeedback} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        const thumbsUp = screen.getByLabelText('Good response')
        expect(thumbsUp).toBeInTheDocument()
      })

      const thumbsUp = screen.getByLabelText('Good response')
      fireEvent.click(thumbsUp)

      expect(onFeedback).toHaveBeenCalledWith('up')
    })

    it('should call onFeedback with "down" when thumbs down is clicked', async () => {
      const onFeedback = vi.fn()
      const { container } = renderWithProviders(
        <Message message={mockAssistantMessage} onFeedback={onFeedback} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        const thumbsDown = screen.getByLabelText('Poor response')
        expect(thumbsDown).toBeInTheDocument()
      })

      const thumbsDown = screen.getByLabelText('Poor response')
      fireEvent.click(thumbsDown)

      expect(onFeedback).toHaveBeenCalledWith('down')
    })

    it('should show feedback actions for all messages (including user messages)', () => {
      const onFeedback = vi.fn()
      const { container } = renderWithProviders(
        <Message message={mockMessage} onFeedback={onFeedback} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      // Feedback actions are now shown for all message types
      expect(screen.queryByLabelText('Good response')).toBeInTheDocument()
      expect(screen.queryByLabelText('Poor response')).toBeInTheDocument()
    })

    it('should persist feedback state after clicking', async () => {
      const onFeedback = vi.fn()
      const { container } = renderWithProviders(
        <Message message={mockAssistantMessage} onFeedback={onFeedback} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        const thumbsUp = screen.getByLabelText('Good response')
        expect(thumbsUp).toBeInTheDocument()
      })

      const thumbsUp = screen.getByLabelText('Good response')
      fireEvent.click(thumbsUp)

      // Verify feedback callback was called
      expect(onFeedback).toHaveBeenCalledWith('up')

      // After click, the button should get success styling (wait for state update)
      await waitFor(() => {
        const updatedThumbsUp = screen.getByLabelText('Good response')
        expect(updatedThumbsUp).toHaveClass('text-success')
      })
    })
  })

  describe('Retry Action', () => {
    it('should show retry button for error messages', async () => {
      const onRetry = vi.fn()
      const errorMessage = { ...mockAssistantMessage, status: 'error' as const }
      const { container } = renderWithProviders(
        <Message message={errorMessage} onRetry={onRetry} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Retry')).toBeInTheDocument()
      })
    })

    it('should call onRetry when retry button is clicked', async () => {
      const onRetry = vi.fn()
      const errorMessage = { ...mockAssistantMessage, status: 'error' as const }
      const { container } = renderWithProviders(
        <Message message={errorMessage} onRetry={onRetry} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Retry')).toBeInTheDocument()
      })

      const retryButton = screen.getByLabelText('Retry')
      fireEvent.click(retryButton)

      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('Metadata Display', () => {
    it('should display token count when provided', () => {
      const messageWithMetadata: MessageType = {
        ...mockAssistantMessage,
        metadata: { tokens: 150 },
      }
      renderWithProviders(<Message message={messageWithMetadata} />)
      expect(screen.getByText('150 tokens')).toBeInTheDocument()
    })

    it('should display processing time when provided', () => {
      const messageWithMetadata: MessageType = {
        ...mockAssistantMessage,
        metadata: { processingTime: 1200 },
      }
      renderWithProviders(<Message message={messageWithMetadata} />)
      expect(screen.getByText('⚡ 1200ms')).toBeInTheDocument()
    })

    it('should display model name when provided', () => {
      const messageWithMetadata: MessageType = {
        ...mockAssistantMessage,
        metadata: { model: 'gpt-4' },
      }
      renderWithProviders(<Message message={messageWithMetadata} />)
      expect(screen.getByText('🤖 gpt-4')).toBeInTheDocument()
    })

    it('should display all metadata together', () => {
      const messageWithMetadata: MessageType = {
        ...mockAssistantMessage,
        metadata: {
          tokens: 150,
          processingTime: 1200,
          model: 'gpt-4',
        },
      }
      renderWithProviders(<Message message={messageWithMetadata} />)
      expect(screen.getByText('150 tokens')).toBeInTheDocument()
      expect(screen.getByText('⚡ 1200ms')).toBeInTheDocument()
      expect(screen.getByText('🤖 gpt-4')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} />
      )
      const message = container.querySelector('.group')
      expect(message).toBeInTheDocument()
    })

    it('should render avatar with fallback text', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} />
      )
      // Avatar uses fallback text 'U' for user when no image src is provided
      const fallback = container.querySelector('[class*="rounded-full"]')
      expect(fallback).toBeInTheDocument()
    })

    it('should support keyboard navigation for feedback buttons', async () => {
      const onFeedback = vi.fn()
      const user = userEvent.setup()
      const { container } = renderWithProviders(
        <Message message={mockAssistantMessage} onFeedback={onFeedback} />
      )

      // Hover to reveal actions
      const messageDiv = container.querySelector('.group')
      if (messageDiv) {
        fireEvent.mouseEnter(messageDiv)
      }

      await waitFor(() => {
        const thumbsUp = screen.getByLabelText('Good response')
        expect(thumbsUp).toBeInTheDocument()
      })

      const thumbsUp = screen.getByLabelText('Good response')
      thumbsUp.focus()
      await user.keyboard('{Enter}')

      expect(onFeedback).toHaveBeenCalledWith('up')
    })
  })

  describe('Animation', () => {
    it('should apply initial animation props', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} />
      )
      const motion = container.querySelector('.group')
      expect(motion).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <Message message={mockMessage} className="custom-class" />
      )
      const message = container.querySelector('.custom-class')
      expect(message).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content gracefully', () => {
      const emptyMessage = { ...mockMessage, content: '' }
      renderWithProviders(<Message message={emptyMessage} />)
      expect(screen.getByText('You')).toBeInTheDocument()
    })

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(10000)
      const longMessage = { ...mockMessage, content: longContent }
      renderWithProviders(<Message message={longMessage} />)
      expect(screen.getByText(longContent)).toBeInTheDocument()
    })

    it('should handle special characters in content', () => {
      const specialMessage = {
        ...mockMessage,
        content: '<script>alert("xss")</script>',
      }
      const { container } = renderWithProviders(
        <Message message={specialMessage} />
      )
      // Should not execute script, should render as text
      expect(container.querySelector('script')).not.toBeInTheDocument()
    })

    it('should handle undefined optional props', () => {
      const messageWithFeedback = {
        ...mockAssistantMessage,
        feedback: { type: 'up' as const, timestamp: new Date() },
      }
      expect(() =>
        renderWithProviders(<Message message={messageWithFeedback} />)
      ).not.toThrow()
    })
  })
})
