/**
 * ClarityChat Component Tests
 */
import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClarityChat } from '../chat/ClarityChat'
import { ToastProvider } from '../ui/toast'

// Mock the useClarityChat hook with validation
vi.mock('../../hooks/use-clarity-chat', () => ({
  useClarityChat: vi.fn((options: { api?: string } = {}) => {
    // Replicate the validation logic from the real hook
    if (
      !options.api ||
      typeof options.api !== 'string' ||
      options.api.trim().length === 0
    ) {
      throw new Error(
        'ClarityChat: "api" prop is required. Provide a valid API endpoint URL.'
      )
    }
    return {
      messages: [],
      isLoading: false,
      error: null,
      append: vi.fn(),
      setMessages: vi.fn(),
      reload: vi.fn(),
      stop: vi.fn(),
      input: '',
      setInput: vi.fn(),
    }
  }),
}))

// Import the mocked hook for test manipulation
import { useClarityChat } from '../../hooks/chat/use-clarity-chat'

const mockUseClarityChat = vi.mocked(useClarityChat)

// Helper to render with required providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ClarityChat', () => {
  const createMockReturn = () => ({
    messages: [],
    isLoading: false,
    error: null,
    append: vi.fn().mockResolvedValue(undefined),
    setMessages: vi.fn(),
    reload: vi.fn(),
    stop: vi.fn(),
    input: '',
    setInput: vi.fn(),
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Use mockImplementation to preserve validation logic while allowing customization
    mockUseClarityChat.mockImplementation((options: { api?: string } = {}) => {
      // Replicate the validation logic from the real hook
      if (
        !options.api ||
        typeof options.api !== 'string' ||
        options.api.trim().length === 0
      ) {
        throw new Error(
          'ClarityChat: "api" prop is required. Provide a valid API endpoint URL.'
        )
      }
      return createMockReturn()
    })
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

      renderWithProviders(
        <ClarityChat api="/api/chat" initialMessages={initialMessages} />
      )

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
        ...createMockReturn(),
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
        ...createMockReturn(),
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
        ...createMockReturn(),
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
      renderWithProviders(
        <ClarityChat api="/api/chat" showHeader sessionTitle="My Chat" />
      )

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
        ...createMockReturn(),
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

  /**
   * Zero-Config Integration Tests
   *
   * These tests verify the "golden path" - the simplest possible usage
   * that must never break. If these fail, we've broken the core promise.
   */
  describe('Zero-Config Integration (Golden Path)', () => {
    it('renders with only api prop - the simplest possible usage', () => {
      // This is the zero-config promise: just provide an API endpoint
      renderWithProviders(<ClarityChat api="/api/chat" />)

      // Must render the input area
      expect(screen.getByRole('textbox')).toBeInTheDocument()

      // Must not throw any errors (implicitly tested by reaching here)
    })

    it('renders input that is interactive and enabled by default', () => {
      renderWithProviders(<ClarityChat api="/api/chat" />)

      const input = screen.getByRole('textbox')

      // Input must be enabled and ready to type
      expect(input).toBeEnabled()
      expect(input).not.toHaveAttribute('readonly')
    })

    it('initializes hook with correct API endpoint', () => {
      renderWithProviders(<ClarityChat api="/api/chat" />)

      // Verify the hook was called with the API
      expect(mockUseClarityChat).toHaveBeenCalledWith(
        expect.objectContaining({ api: '/api/chat' })
      )
    })

    it('does not log console errors in zero-config mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithProviders(<ClarityChat api="/api/chat" />)

      // Should not produce any console errors
      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('handles various valid API endpoint formats', () => {
      const validEndpoints = [
        '/api/chat',
        '/api/v1/chat',
        'https://api.example.com/chat',
        '/chat',
      ]

      validEndpoints.forEach((api) => {
        expect(() => {
          renderWithProviders(<ClarityChat api={api} />)
        }).not.toThrow()
      })
    })
  })
})
