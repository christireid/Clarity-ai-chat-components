import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {
  ClarityChatApp,
  ClarityChatAppProvider,
  useClarityChatAppContext,
} from '../ClarityChatApp'
import { useClarityChatApp } from '../use-clarity-chat-app'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ClarityChatApp', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders with default UI', () => {
      render(<ClarityChatApp api="/api/chat" />)

      expect(screen.getByText('Chat')).toBeInTheDocument()
      expect(screen.getByText('Start a conversation')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Type a message...')
      ).toBeInTheDocument()
    })

    it('renders with custom header', () => {
      render(
        <ClarityChatApp api="/api/chat" header={<div>Custom Header</div>} />
      )

      expect(screen.getByText('Custom Header')).toBeInTheDocument()
    })

    it('renders with custom footer', () => {
      render(
        <ClarityChatApp api="/api/chat" footer={<div>Custom Footer</div>} />
      )

      expect(screen.getByText('Custom Footer')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <ClarityChatApp api="/api/chat" className="my-custom-class" />
      )

      expect(container.querySelector('.my-custom-class')).toBeInTheDocument()
    })
  })

  describe('basic functionality', () => {
    it('shows send button disabled when input is empty', () => {
      render(<ClarityChatApp api="/api/chat" />)

      const sendButton = screen.getByText('Send')
      expect(sendButton).toBeDisabled()
    })

    it('enables send button when input has content', () => {
      render(<ClarityChatApp api="/api/chat" />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })

      const sendButton = screen.getByText('Send')
      expect(sendButton).not.toBeDisabled()
    })

    it('sends message on button click', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Hello back!' }),
      })

      render(<ClarityChatApp api="/api/chat" />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })

      const sendButton = screen.getByText('Send')
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/chat',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
    })

    it('sends message on Enter key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Hello back!' }),
      })

      render(<ClarityChatApp api="/api/chat" />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })

    it('clears input after sending', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Hello back!' }),
      })

      render(<ClarityChatApp api="/api/chat" />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  })

  describe('presets', () => {
    it('works with simple preset', () => {
      render(<ClarityChatApp api="/api/chat" preset="simple" />)
      expect(screen.getByText('Chat')).toBeInTheDocument()
    })

    it('works with pro preset', () => {
      render(<ClarityChatApp api="/api/chat" preset="pro" />)
      expect(screen.getByText('Chat')).toBeInTheDocument()
    })

    it('works with memory preset', () => {
      render(<ClarityChatApp api="/api/chat" preset="memory" />)
      expect(screen.getByText('Chat')).toBeInTheDocument()
    })

    it('works with enterprise preset', () => {
      render(<ClarityChatApp api="/api/chat" preset="enterprise" />)
      expect(screen.getByText('Chat')).toBeInTheDocument()
    })
  })

  describe('feature flags', () => {
    it('enables memory with flag', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Response' }),
      })

      render(<ClarityChatApp api="/api/chat" features={{ memory: true }} />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })
    })

    it('shows token stats when tokenOptimization is enabled', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Response' }),
      })

      render(
        <ClarityChatApp
          api="/api/chat"
          features={{ tokenOptimization: true }}
          config={{ tokenOptimization: { showStats: true } }}
        />
      )

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(screen.getByText(/Budget:/)).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('displays error when request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      render(
        <ClarityChatApp
          api="/api/chat"
          config={{ errorRecovery: { maxRetries: 0 } }}
        />
      )

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(screen.getByText(/Error/)).toBeInTheDocument()
      })
    })

    it('shows retry button on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      render(
        <ClarityChatApp
          api="/api/chat"
          config={{ errorRecovery: { maxRetries: 0 } }}
        />
      )

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument()
      })
    })
  })

  describe('events', () => {
    it('calls onEvent callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Response' }),
      })

      const onEvent = vi.fn()

      render(<ClarityChatApp api="/api/chat" onEvent={onEvent} />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'message:sent',
          })
        )
      })
    })

    it('calls onMessageSent callback', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: 'Response' }),
      })

      const onMessageSent = vi.fn()

      render(<ClarityChatApp api="/api/chat" onMessageSent={onMessageSent} />)

      const input = screen.getByPlaceholderText('Type a message...')
      fireEvent.change(input, { target: { value: 'Hello' } })
      fireEvent.click(screen.getByText('Send'))

      await waitFor(() => {
        expect(onMessageSent).toHaveBeenCalledWith(
          expect.objectContaining({
            role: 'user',
            content: 'Hello',
          })
        )
      })
    })
  })
})

describe('ClarityChatAppProvider', () => {
  it('provides context to children', () => {
    function TestComponent() {
      const chat = useClarityChatAppContext()
      return <div>Has context: {chat ? 'yes' : 'no'}</div>
    }

    render(
      <ClarityChatAppProvider api="/api/chat">
        <TestComponent />
      </ClarityChatAppProvider>
    )

    expect(screen.getByText('Has context: yes')).toBeInTheDocument()
  })

  it('throws when used outside provider', () => {
    function TestComponent() {
      const chat = useClarityChatAppContext()
      return <div>{chat ? 'yes' : 'no'}</div>
    }

    expect(() => render(<TestComponent />)).toThrow()
  })
})

describe('useClarityChatApp', () => {
  it('returns expected interface', () => {
    let hookResult: ReturnType<typeof useClarityChatApp> | null = null

    function TestComponent() {
      hookResult = useClarityChatApp({ api: '/api/chat' })
      return null
    }

    render(<TestComponent />)

    expect(hookResult).not.toBeNull()
    expect(hookResult!.messages).toEqual([])
    expect(hookResult!.isLoading).toBe(false)
    expect(hookResult!.error).toBeNull()
    expect(typeof hookResult!.send).toBe('function')
    expect(typeof hookResult!.append).toBe('function')
    expect(typeof hookResult!.stop).toBe('function')
    expect(typeof hookResult!.retry).toBe('function')
    expect(typeof hookResult!.clear).toBe('function')
    expect(hookResult!.meta).toBeDefined()
    expect(hookResult!.config).toBeDefined()
  })

  it('has correct metadata structure', () => {
    let hookResult: ReturnType<typeof useClarityChatApp> | null = null

    function TestComponent() {
      hookResult = useClarityChatApp({ api: '/api/chat', preset: 'enterprise' })
      return null
    }

    render(<TestComponent />)

    expect(hookResult!.meta.token).toBeDefined()
    expect(hookResult!.meta.memory).toBeDefined()
    expect(hookResult!.meta.rag).toBeDefined()
    expect(hookResult!.meta.safety).toBeDefined()
    expect(hookResult!.meta.tools).toBeDefined()

    // Enterprise preset should enable features
    expect(hookResult!.meta.memory.enabled).toBe(true)
    expect(hookResult!.meta.safety.enabled).toBe(true)
  })
})
