/**
 * Rate Limiting Integration Tests
 *
 * Tests the complete rate limiting system integration with ClarityChat components,
 * including request queue, status display, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClarityChat } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/react'

// Mock API for rate limiting tests
class MockRateLimitedAPI {
  private requestCount = 0
  private rateLimitReached = false
  private resetTime: number | null = null

  constructor(
    private rateLimitAfter: number = 3,
    private resetDelay: number = 5000
  ) {}

  async chat(messages: Message[]): Promise<{ content: string; role: 'assistant' }> {
    this.requestCount++

    if (this.rateLimitReached) {
      if (this.resetTime && Date.now() >= this.resetTime) {
        // Reset rate limit
        this.rateLimitReached = false
        this.resetTime = null
        this.requestCount = 1
      } else {
        const error = new Error('Rate limit exceeded')
        ;(error as any).status = 429
        ;(error as any).headers = new Map([
          ['retry-after', this.resetTime ? Math.ceil((this.resetTime - Date.now()) / 1000).toString() : '60']
        ])
        throw error
      }
    }

    if (this.requestCount >= this.rateLimitAfter) {
      this.rateLimitReached = true
      this.resetTime = Date.now() + this.resetDelay
      const error = new Error('Rate limit exceeded')
      ;(error as any).status = 429
      ;(error as any).headers = new Map([['retry-after', this.resetDelay.toString()]])
      throw error
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      role: 'assistant',
      content: `Response to: ${messages[messages.length - 1]?.content || 'empty'}`,
    }
  }

  reset() {
    this.requestCount = 0
    this.rateLimitReached = false
    this.resetTime = null
  }

  getRequestCount(): number {
    return this.requestCount
  }
}

// Mock API instance
let mockAPI: MockRateLimitedAPI

// Mock fetch for rate limited API
const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockAPI = new MockRateLimitedAPI()
  mockFetch.mockImplementation(async (url: string, options?: any) => {
    if (url.includes('/api/chat')) {
      try {
        const body = JSON.parse(options?.body || '{}')
        const response = await mockAPI.chat(body.messages || [])
        return {
          ok: true,
          json: () => Promise.resolve(response),
        }
      } catch (error: any) {
        return {
          ok: false,
          status: error.status || 500,
          headers: {
            get: (key: string) => error.headers?.get(key),
          },
          json: () => Promise.resolve({ error: error.message }),
        }
      }
    }
    return { ok: false, status: 404 }
  })
})

afterEach(() => {
  mockAPI.reset()
  vi.clearAllMocks()
})

describe('Rate Limiting Integration', () => {
  describe('ClarityChat with Rate Limiting', () => {
    it('handles rate limiting gracefully', async () => {
      const user = userEvent.setup()
      const onRateLimited = vi.fn()
      const onRequestQueued = vi.fn()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={2}
          showQueueStatus={true}
          onRateLimited={onRateLimited}
          onRequestQueued={onRequestQueued}
        />
      )

      const input = screen.getByRole('textbox')

      // Send first message (should succeed)
      await user.type(input, 'First message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: First message/)).toBeInTheDocument()
      })

      // Send second message (should succeed)
      await user.clear(input)
      await user.type(input, 'Second message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Second message/)).toBeInTheDocument()
      })

      // Send third message (should trigger rate limit)
      await user.clear(input)
      await user.type(input, 'Third message')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should show rate limited status
      await waitFor(() => {
        expect(onRateLimited).toHaveBeenCalled()
      })

      // Queue status should be visible
      expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
    })

    it('queues requests when rate limited', async () => {
      const user = userEvent.setup()
      const onRequestQueued = vi.fn()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={3}
          showQueueStatus={true}
          onRequestQueued={onRequestQueued}
        />
      )

      // Trigger rate limit first
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message 1')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 1/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 2')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 2/)).toBeInTheDocument()
      })

      // Now send multiple messages quickly to trigger queuing
      await user.clear(input)
      await user.type(input, 'Message 3')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await user.clear(input)
      await user.type(input, 'Message 4')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await user.clear(input)
      await user.type(input, 'Message 5')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should show queued requests
      await waitFor(() => {
        expect(onRequestQueued).toHaveBeenCalled()
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })
    })

    it('respects queue size limits', async () => {
      const user = userEvent.setup()
      const onQueueFull = vi.fn()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={1}
          showQueueStatus={true}
          onQueueFull={onQueueFull}
        />
      )

      // Trigger rate limit
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message 1')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 1/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 2')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 2/)).toBeInTheDocument()
      })

      // Send to trigger rate limit
      await user.clear(input)
      await user.type(input, 'Message 3')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Try to exceed queue size
      await user.clear(input)
      await user.type(input, 'Message 4')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await user.clear(input)
      await user.type(input, 'Message 5')
      await user.click(screen.getByRole('button', { name: /send/i }))

      // Should trigger queue full
      await waitFor(() => {
        expect(onQueueFull).toHaveBeenCalled()
      })
    })

    it('recovers after rate limit reset', async () => {
      const user = userEvent.setup()
      const onRateLimited = vi.fn()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={2}
          showQueueStatus={true}
          onRateLimited={onRateLimited}
        />
      )

      // Trigger rate limit
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message 1')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 1/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 2')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 2/)).toBeInTheDocument()
      })

      // Trigger rate limit
      await user.clear(input)
      await user.type(input, 'Message 3')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(onRateLimited).toHaveBeenCalled()
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Wait for rate limit to reset (mock API resets after 5 seconds)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5100))
      })

      // Should be able to send again
      await user.clear(input)
      await user.type(input, 'Message 4')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 4/)).toBeInTheDocument()
      })
    })

    it('displays queue status correctly', async () => {
      const user = userEvent.setup()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={3}
          showQueueStatus={true}
          compactQueueStatus={false}
        />
      )

      // Initially no status shown
      expect(screen.queryByText(/Sync Status/i)).not.toBeInTheDocument()

      // Trigger rate limiting
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message 1')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 1/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 2')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 2/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 3')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Rate Limited/i)).toBeInTheDocument()
      })

      // Queue status should be detailed
      expect(screen.getByText(/Sync Status/i)).toBeInTheDocument()
      expect(screen.getByText(/Last Sync/i)).toBeInTheDocument()
      expect(screen.getByText(/Pending Changes/i)).toBeInTheDocument()
    })

    it('allows manual queue clearing', async () => {
      const user = userEvent.setup()

      render(
        <ClarityChat
          api="/api/chat"
          enableRateLimiting={true}
          maxConcurrentRequests={1}
          maxQueueSize={3}
          showQueueStatus={true}
        />
      )

      // Trigger queuing
      const input = screen.getByRole('textbox')
      await user.type(input, 'Message 1')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 1/)).toBeInTheDocument()
      })

      await user.clear(input)
      await user.type(input, 'Message 2')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/Response to: Message 2/)).toBeInTheDocument()
      })

      // Queue messages
      await user.clear(input)
      await user.type(input, 'Message 3')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await user.clear(input)
      await user.type(input, 'Message 4')
      await user.click(screen.getByRole('button', { name: /send/i }))

      await waitFor(() => {
        expect(screen.getByText(/pending/i)).toBeInTheDocument()
      })

      // Clear queue
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await user.click(clearButton)

      // Queue should be empty
      await waitFor(() => {
        expect(screen.queryByText(/pending/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('useRateLimitedChat Hook Integration', () => {
    it('integrates with useClarityChat seamlessly', async () => {
      const TestComponent = () => {
        const chat = useClarityChat({
          api: '/api/chat',
          enableRateLimiting: true,
          maxConcurrentRequests: 1,
          maxQueueSize: 2,
        })

        return (
          <div>
            <div data-testid="status">
              {chat.isRateLimited ? 'Rate Limited' : 'Normal'}
            </div>
            <div data-testid="queue-size">{chat.queueStatus?.queueLength || 0}</div>
            <button onClick={() => chat.append('Test message')}>Send</button>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      // Initially normal
      expect(screen.getByTestId('status')).toHaveTextContent('Normal')

      // Trigger rate limiting by sending multiple messages
      const sendButton = screen.getByRole('button')
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('Rate Limited')
      })

      // Send more messages to queue them
      await user.click(sendButton)
      await user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByTestId('queue-size')).toHaveTextContent('2')
      })
    })
  })
})