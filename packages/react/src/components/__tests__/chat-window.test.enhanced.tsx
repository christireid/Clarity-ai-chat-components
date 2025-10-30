import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChatWindow } from '../chat-window'
import { ThemeProvider, themes } from '../../theme'
import type { Message } from '@clarity-chat/types'

describe('ChatWindow - Enhanced Tests', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you?',
      timestamp: new Date('2024-01-01T10:00:00'),
    },
    {
      id: '2',
      role: 'user',
      content: 'I need help with React',
      timestamp: new Date('2024-01-01T10:01:00'),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'I can help with React! What specifically do you need?',
      timestamp: new Date('2024-01-01T10:02:00'),
    },
  ]

  const defaultProps = {
    messages: mockMessages,
    onSendMessage: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all messages correctly', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
      expect(screen.getByText('I need help with React')).toBeInTheDocument()
      expect(
        screen.getByText('I can help with React! What specifically do you need?')
      ).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} placeholder="Type your question..." />
        </ThemeProvider>
      )

      expect(
        screen.getByPlaceholderText('Type your question...')
      ).toBeInTheDocument()
    })

    it('renders loading state', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} isLoading />
        </ThemeProvider>
      )

      expect(screen.getByTestId('thinking-indicator')).toBeInTheDocument()
    })

    it('renders empty state when no messages', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} messages={[]} />
        </ThemeProvider>
      )

      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('sends message on submit', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      await user.type(input, 'Hello world')
      await user.keyboard('{Enter}')

      expect(onSendMessage).toHaveBeenCalledWith('Hello world')
    })

    it('clears input after sending', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(
        /type a message/i
      ) as HTMLInputElement
      await user.type(input, 'Test message')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(input.value).toBe('')
      })
    })

    it('does not send empty messages', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      await user.click(input)
      await user.keyboard('{Enter}')

      expect(onSendMessage).not.toHaveBeenCalled()
    })

    it('disables input when loading', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} isLoading onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      expect(input).toBeDisabled()

      await user.type(input, 'Should not work')
      expect(onSendMessage).not.toHaveBeenCalled()
    })
  })

  describe('Message Operations', () => {
    it('allows copying message content', async () => {
      const user = userEvent.setup()
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      })

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const copyButtons = screen.getAllByLabelText(/copy/i)
      await user.click(copyButtons[0])

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Hello! How can I help you?'
      )
    })

    it('allows editing user messages', async () => {
      const user = userEvent.setup()
      const onEditMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onEditMessage={onEditMessage} />
        </ThemeProvider>
      )

      // Find user message (id: '2')
      const userMessage = screen.getByText('I need help with React')
      const editButton = within(userMessage.closest('div')!).getByLabelText(/edit/i)

      await user.click(editButton)

      const editInput = screen.getByDisplayValue('I need help with React')
      await user.clear(editInput)
      await user.type(editInput, 'I need help with TypeScript')
      await user.keyboard('{Enter}')

      expect(onEditMessage).toHaveBeenCalledWith('2', 'I need help with TypeScript')
    })

    it('allows regenerating AI messages', async () => {
      const user = userEvent.setup()
      const onRegenerateMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onRegenerateMessage={onRegenerateMessage} />
        </ThemeProvider>
      )

      const aiMessage = screen.getByText(
        'I can help with React! What specifically do you need?'
      )
      const regenerateButton = within(aiMessage.closest('div')!).getByLabelText(
        /regenerate/i
      )

      await user.click(regenerateButton)

      expect(onRegenerateMessage).toHaveBeenCalledWith('3')
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports Shift+Enter for new line', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      await user.type(input, 'Line 1')
      await user.keyboard('{Shift>}{Enter}{/Shift}')
      await user.type(input, 'Line 2')

      expect(onSendMessage).not.toHaveBeenCalled()
      expect(input).toHaveValue('Line 1\nLine 2')
    })

    it('focuses input on /', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      
      // Focus elsewhere
      await user.click(document.body)
      expect(input).not.toHaveFocus()

      // Press /
      await user.keyboard('/')

      expect(input).toHaveFocus()
    })

    it('supports Escape to clear input', async () => {
      const user = userEvent.setup()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(
        /type a message/i
      ) as HTMLInputElement
      await user.type(input, 'Test message')
      await user.keyboard('{Escape}')

      expect(input.value).toBe('')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      expect(screen.getByRole('main')).toHaveAttribute(
        'aria-label',
        'Chat conversation'
      )
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-label',
        'Message input'
      )
    })

    it('announces new messages to screen readers', async () => {
      const { rerender } = render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const newMessages = [
        ...mockMessages,
        {
          id: '4',
          role: 'assistant' as const,
          content: 'New message',
          timestamp: new Date(),
        },
      ]

      rerender(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} messages={newMessages} />
        </ThemeProvider>
      )

      const liveRegion = screen.getByRole('status', { name: /new message/i })
      expect(liveRegion).toHaveTextContent('New message from assistant')
    })

    it('has proper heading hierarchy', () => {
      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} title="Customer Support" />
        </ThemeProvider>
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Customer Support')
    })
  })

  describe('Theming', () => {
    it('applies theme correctly', () => {
      render(
        <ThemeProvider theme={themes.ocean}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const container = screen.getByRole('main').parentElement
      expect(container).toHaveClass('theme-ocean')
    })

    it('switches themes dynamically', () => {
      const { rerender } = render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      let container = screen.getByRole('main').parentElement
      expect(container).toHaveClass('theme-default')

      rerender(
        <ThemeProvider theme={themes.dark}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      container = screen.getByRole('main').parentElement
      expect(container).toHaveClass('theme-dark')
    })
  })

  describe('Performance', () => {
    it('renders large message lists efficiently', () => {
      const manyMessages: Message[] = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
        content: `Message ${i}`,
        timestamp: new Date(),
      }))

      const { container } = render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} messages={manyMessages} />
        </ThemeProvider>
      )

      // Should use virtualization (not all messages in DOM)
      const messageElements = container.querySelectorAll('[data-message-id]')
      expect(messageElements.length).toBeLessThan(100) // Only visible messages
    })

    it('memoizes messages to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const firstRender = screen.getAllByTestId('message')
      
      // Re-render with same messages
      rerender(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} />
        </ThemeProvider>
      )

      const secondRender = screen.getAllByTestId('message')
      
      // Should be same instances (memoized)
      expect(firstRender[0]).toBe(secondRender[0])
    })
  })

  describe('Error Handling', () => {
    it('displays error message on send failure', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      await user.type(input, 'Test message')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
      })
    })

    it('allows retrying failed messages', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined)

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow {...defaultProps} onSendMessage={onSendMessage} />
        </ThemeProvider>
      )

      const input = screen.getByPlaceholderText(/type a message/i)
      await user.type(input, 'Test message')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
      })

      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(onSendMessage).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('File Attachments', () => {
    it('supports file uploads', async () => {
      const user = userEvent.setup()
      const onSendMessage = vi.fn()

      render(
        <ThemeProvider theme={themes.default}>
          <ChatWindow
            {...defaultProps}
            onSendMessage={onSendMessage}
            enableFileUpload
          />
        </ThemeProvider>
      )

      const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
      const input = screen.getByLabelText(/attach files/i)

      await user.upload(input, file)

      expect(screen.getByText('hello.txt')).toBeInTheDocument()

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      expect(onSendMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          attachments: [expect.objectContaining({ name: 'hello.txt' })],
        })
      )
    })
  })
})
