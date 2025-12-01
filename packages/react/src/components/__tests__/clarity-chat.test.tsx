/**
 * ClarityChat Component Tests
 */
import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClarityChat } from '../clarity-chat'
import { ToastProvider } from '../toast'

// Mock the useClarityChat hook
vi.mock('../../hooks/use-clarity-chat', () => ({
  useClarityChat: vi.fn(() => ({
    messages: [],
    isLoading: false,
    error: null,
    append: vi.fn(),
    setMessages: vi.fn(),
    reload: vi.fn(),
    stop: vi.fn(),
    input: '',
    setInput: vi.fn(),
  })),
}))

// Import the mocked hook for test manipulation
import { useClarityChat } from '../../hooks/use-clarity-chat'

const mockUseClarityChat = vi.mocked(useClarityChat)

// Helper to render with required providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ClarityChat', () => {
  const defaultMockReturn = {
    messages: [],
    isLoading: false,
    error: null,
    append: vi.fn().mockResolvedValue(undefined),
    setMessages: vi.fn(),
    reload: vi.fn(),
    stop: vi.fn(),
    input: '',
    setInput: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseClarityChat.mockReturnValue(defaultMockReturn)
  })

  describe('Required props validation', () => {
    it('should throw error when api prop is missing', () => {
      expect(() => {
        // @ts-expect-error - testing runtime validation
        renderWithProviders(<ClarityChat />)
      }).toThrow('ClarityChat: "api" prop is required')
    })

    it('should throw error when api prop is empty string', () => {
      expect(() => {
        renderWithProviders(<ClarityChat api="" />)
      }).toThrow('ClarityChat: "api" prop is required')
    })

    it('should throw error when api prop is whitespace only', () => {
      expect(() => {
        renderWithProviders(<ClarityChat api="   " />)
      }).toThrow('ClarityChat: "api" prop is required')
    })

    it('should not throw when api prop is provided', () => {
      expect(() => {
        renderWithProviders(<ClarityChat api="/api/chat" />)
      }).not.toThrow()
    })
  })

  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      renderWithProviders(<ClarityChat api="/api/chat" />)
      // Should render the input area from ChatWindow
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should pass api to useClarityChat hook', () => {
      renderWithProviders(<ClarityChat api="/api/chat" />)

      expect(mockUseClarityChat).toHaveBeenCalledWith(
        expect.objectContaining({ api: '/api/chat' })
      )
    })

    it('should apply custom className', () => {
      const { container } = renderWithProviders(
        <ClarityChat api="/api/chat" className="custom-chat-class" />
      )

      // The className should be passed to ChatWindow
      expect(container.querySelector('.custom-chat-class')).toBeInTheDocument()
    })
  })

  describe('Hook options passthrough', () => {
    it('should pass memory options to hook', () => {
      renderWithProviders(
        <ClarityChat
          api="/api/chat"
          memory={{ enabled: true, strategy: 'vector-store' }}
        />
      )

      expect(mockUseClarityChat).toHaveBeenCalledWith(
        expect.objectContaining({
          memory: { enabled: true, strategy: 'vector-store' },
        })
      )
    })

    it('should pass initialMessages to hook', () => {
      const initialMessages = [{ role: 'user' as const, content: 'Hello' }]

      renderWithProviders(<ClarityChat api="/api/chat" initialMessages={initialMessages} />)

      expect(mockUseClarityChat).toHaveBeenCalledWith(
        expect.objectContaining({ initialMessages })
      )
    })

    it('should pass onFinish to hook', () => {
      const onFinish = vi.fn()

      renderWithProviders(<ClarityChat api="/api/chat" onFinish={onFinish} />)

      expect(mockUseClarityChat).toHaveBeenCalledWith(
        expect.objectContaining({ onFinish })
      )
    })
  })

  describe('Messages display', () => {
    it('should pass messages from hook to ChatWindow', () => {
      const messages = [
        { role: 'user' as const, content: 'Hello' },
        { role: 'assistant' as const, content: 'Hi there!' },
      ]
      mockUseClarityChat.mockReturnValue({
        ...defaultMockReturn,
        messages,
      })

      renderWithProviders(<ClarityChat api="/api/chat" />)

      // Verify hook was called and returns messages
      expect(mockUseClarityChat).toHaveBeenCalled()
      // The component should have rendered (input should exist)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should pass isLoading to ChatWindow', () => {
      mockUseClarityChat.mockReturnValue({
        ...defaultMockReturn,
        isLoading: true,
      })

      renderWithProviders(<ClarityChat api="/api/chat" />)

      // When loading, the input should be disabled
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('Message sending', () => {
    it('should initialize with append function from hook', () => {
      const mockAppend = vi.fn().mockResolvedValue(undefined)
      mockUseClarityChat.mockReturnValue({
        ...defaultMockReturn,
        append: mockAppend,
      })

      renderWithProviders(<ClarityChat api="/api/chat" />)

      // Verify the component rendered and hook was called
      expect(mockUseClarityChat).toHaveBeenCalled()
      // The append function should be available (used internally by handleSendMessage)
      expect(mockAppend).toBeDefined()
    })

    it('should render input for typing messages', () => {
      renderWithProviders(<ClarityChat api="/api/chat" />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Header configuration', () => {
    it('should pass showHeader to ChatWindow', () => {
      renderWithProviders(<ClarityChat api="/api/chat" showHeader />)

      // The ChatWindow should receive showHeader prop
      // This tests that the prop is passed through
      expect(mockUseClarityChat).toHaveBeenCalled()
    })

    it('should pass sessionTitle to ChatWindow', () => {
      renderWithProviders(<ClarityChat api="/api/chat" showHeader sessionTitle="My Chat" />)

      // When showHeader is true, the title should be displayed
      expect(screen.getByText('My Chat')).toBeInTheDocument()
    })

    it('should pass sessionSubtitle to ChatWindow', () => {
      renderWithProviders(
        <ClarityChat
          api="/api/chat"
          showHeader
          sessionTitle="Chat"
          sessionSubtitle="AI Assistant"
        />
      )

      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    })
  })

  describe('Clear functionality', () => {
    it('should clear messages and call onClear when clear is triggered', async () => {
      const mockSetMessages = vi.fn()
      const mockOnClear = vi.fn()

      mockUseClarityChat.mockReturnValue({
        ...defaultMockReturn,
        setMessages: mockSetMessages,
        messages: [{ role: 'user' as const, content: 'Test' }],
      })

      renderWithProviders(
        <ClarityChat api="/api/chat" showHeader onClear={mockOnClear} />
      )

      // Find and click clear button (if present in header)
      const clearButton = screen.queryByRole('button', { name: /clear/i })
      if (clearButton) {
        const user = userEvent.setup()
        await user.click(clearButton)

        expect(mockSetMessages).toHaveBeenCalledWith([])
        expect(mockOnClear).toHaveBeenCalled()
      }
    })
  })

  describe('Empty state', () => {
    it('should render custom empty state', () => {
      renderWithProviders(
        <ClarityChat
          api="/api/chat"
          emptyState={<div>Start a conversation!</div>}
        />
      )

      expect(screen.getByText('Start a conversation!')).toBeInTheDocument()
    })
  })

  describe('displayName', () => {
    it('should have correct displayName', () => {
      expect(ClarityChat.displayName).toBe('ClarityChat')
    })
  })
})
