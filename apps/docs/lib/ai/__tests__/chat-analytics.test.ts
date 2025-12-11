/**
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  trackChatInteraction,
  trackApiError,
  trackSearchQuery,
  createPerformanceTimer,
  flushAnalytics,
  getQueueSize,
  clearQueue,
  type ChatInteractionMetrics,
} from '../chat-analytics'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('chat-analytics', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    // Reset environment
    process.env = { ...originalEnv }
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  describe('trackChatInteraction', () => {
    const validMetrics: ChatInteractionMetrics = {
      messageLength: 100,
      hasDocsContext: true,
      searchResultsCount: 5,
      provider: 'gemini',
    }

    it('logs to console in development mode', () => {
      process.env.NODE_ENV = 'development'

      trackChatInteraction(validMetrics)

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Chat interaction:',
        expect.objectContaining({
          messageLength: 100,
          hasDocsContext: true,
          searchResultsCount: 5,
          provider: 'gemini',
          timestamp: expect.any(String),
          environment: 'development',
        })
      )
    })

    it('does not log to console in production mode', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'false'

      trackChatInteraction(validMetrics)

      expect(console.log).not.toHaveBeenCalled()
    })

    it('does nothing when analytics is disabled', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'false'

      trackChatInteraction(validMetrics)

      expect(console.log).not.toHaveBeenCalled()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('sends to analytics service in production when enabled', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'
      process.env.ANALYTICS_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({ ok: true })

      trackChatInteraction(validMetrics)

      // Wait for async operations
      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://analytics.example.com/track',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer test-api-key',
            },
            body: expect.any(String),
          })
        )
      })
    })

    it('includes all optional fields when provided', () => {
      process.env.NODE_ENV = 'development'

      const fullMetrics: ChatInteractionMetrics = {
        ...validMetrics,
        responseTimeMs: 250,
        tokensUsed: 150,
        userId: 'user-123',
        sessionId: 'session-456',
      }

      trackChatInteraction(fullMetrics)

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Chat interaction:',
        expect.objectContaining({
          responseTimeMs: 250,
          tokensUsed: 150,
          userId: 'user-123',
          sessionId: 'session-456',
        })
      )
    })

    it('handles fetch errors gracefully without throwing', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Should not throw
      expect(() => trackChatInteraction(validMetrics)).not.toThrow()

      // Wait for async operations
      await vi.waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          '[Analytics] Failed to send metrics:',
          expect.any(Error)
        )
      })
    })

    it('handles non-ok response from analytics service', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      trackChatInteraction(validMetrics)

      // Wait for async operations
      await vi.waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          '[Analytics] Failed to send metrics:',
          expect.any(Error)
        )
      })
    })

    it('does not send to service without endpoint configured', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      delete process.env.ANALYTICS_ENDPOINT

      trackChatInteraction(validMetrics)

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('trackApiError', () => {
    const errorData = {
      path: '/api/chat',
      method: 'POST',
      statusCode: 500,
      errorMessage: 'Internal server error',
    }

    it('logs error to console in development', () => {
      process.env.NODE_ENV = 'development'

      trackApiError(errorData)

      expect(console.error).toHaveBeenCalledWith(
        '[Analytics] API error:',
        expect.objectContaining({
          path: '/api/chat',
          method: 'POST',
          statusCode: 500,
          errorMessage: 'Internal server error',
          timestamp: expect.any(String),
        })
      )
    })

    it('includes stack trace when provided', () => {
      process.env.NODE_ENV = 'development'

      trackApiError({
        ...errorData,
        stack: 'Error: test\n  at test.ts:1:1',
      })

      expect(console.error).toHaveBeenCalledWith(
        '[Analytics] API error:',
        expect.objectContaining({
          stack: 'Error: test\n  at test.ts:1:1',
        })
      )
    })

    it('sends error to analytics service in production', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      mockFetch.mockResolvedValueOnce({ ok: true })

      trackApiError(errorData)

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
        const body = JSON.parse(mockFetch.mock.calls[0][1].body)
        expect(body.type).toBe('api_error')
        expect(body.path).toBe('/api/chat')
      })
    })

    it('does nothing when disabled', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'false'

      trackApiError(errorData)

      expect(console.error).not.toHaveBeenCalled()
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('trackSearchQuery', () => {
    const queryData = {
      searchTerm: 'how to use chat window',
      resultsCount: 10,
    }

    it('logs search query in development', () => {
      process.env.NODE_ENV = 'development'

      trackSearchQuery(queryData)

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Search query:',
        expect.objectContaining({
          searchTerm: 'how to use chat window',
          resultsCount: 10,
          timestamp: expect.any(String),
        })
      )
    })

    it('includes topResultScore when provided', () => {
      process.env.NODE_ENV = 'development'

      trackSearchQuery({
        ...queryData,
        topResultScore: 0.95,
      })

      expect(console.log).toHaveBeenCalledWith(
        '[Analytics] Search query:',
        expect.objectContaining({
          topResultScore: 0.95,
        })
      )
    })

    it('does nothing when disabled', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'false'

      trackSearchQuery(queryData)

      expect(console.log).not.toHaveBeenCalled()
    })
  })

  describe('createPerformanceTimer', () => {
    it('returns an object with stop method', () => {
      const timer = createPerformanceTimer()

      expect(timer).toHaveProperty('stop')
      expect(typeof timer.stop).toBe('function')
    })

    it('measures elapsed time', async () => {
      const timer = createPerformanceTimer()

      // Wait 50ms
      await new Promise((resolve) => setTimeout(resolve, 50))

      const elapsed = timer.stop()

      // Should be at least 50ms, allowing some margin
      expect(elapsed).toBeGreaterThanOrEqual(45)
      expect(elapsed).toBeLessThan(200) // Reasonable upper bound
    })

    it('returns rounded integer milliseconds', () => {
      const timer = createPerformanceTimer()
      const elapsed = timer.stop()

      expect(Number.isInteger(elapsed)).toBe(true)
    })

    it('can be stopped multiple times (returns time since start)', () => {
      const timer = createPerformanceTimer()

      const first = timer.stop()
      const second = timer.stop()

      // Both should be valid numbers, second >= first
      expect(second).toBeGreaterThanOrEqual(first)
    })
  })

  describe('configuration', () => {
    it('always enables analytics in development', () => {
      process.env.NODE_ENV = 'development'
      process.env.ANALYTICS_ENABLED = 'false' // Explicitly disabled

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      // Should still log in dev
      expect(console.log).toHaveBeenCalled()
    })

    it('uses empty string for API key when not set', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'
      delete process.env.ANALYTICS_API_KEY

      mockFetch.mockResolvedValueOnce({ ok: true })

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      // Flush to trigger the send
      flushAnalytics()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer ',
            }),
          })
        )
      })
    })
  })

  describe('batching', () => {
    beforeEach(() => {
      clearQueue()
    })

    it('queues events for batched sending', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      expect(getQueueSize()).toBe(1)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('flushes queue when batch size is reached', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      mockFetch.mockResolvedValueOnce({ ok: true })

      // Queue 10 events (batch size)
      for (let i = 0; i < 10; i++) {
        trackChatInteraction({
          messageLength: 10 + i,
          hasDocsContext: false,
          searchResultsCount: i,
          provider: 'demo',
        })
      }

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.batch).toBe(true)
      expect(body.events.length).toBe(10)
    })

    it('flushAnalytics sends all queued events', async () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      mockFetch.mockResolvedValueOnce({ ok: true })

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      trackApiError({
        path: '/api/chat',
        method: 'POST',
        statusCode: 500,
        errorMessage: 'Error',
      })

      expect(getQueueSize()).toBe(2)

      flushAnalytics()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalled()
      })

      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.events.length).toBe(2)
      expect(body.events[0].type).toBe('chat_interaction')
      expect(body.events[1].type).toBe('api_error')
    })

    it('clearQueue removes all events without sending', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      process.env.ANALYTICS_ENDPOINT = 'https://analytics.example.com/track'

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      expect(getQueueSize()).toBe(1)

      clearQueue()

      expect(getQueueSize()).toBe(0)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('does not queue events when endpoint is not configured', () => {
      process.env.NODE_ENV = 'production'
      process.env.ANALYTICS_ENABLED = 'true'
      delete process.env.ANALYTICS_ENDPOINT

      trackChatInteraction({
        messageLength: 10,
        hasDocsContext: false,
        searchResultsCount: 0,
        provider: 'demo',
      })

      expect(getQueueSize()).toBe(0)
    })
  })
})
