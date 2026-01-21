/**
 * useRateLimitedChat Hook Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRateLimitedChat } from '../use-rate-limited-chat'

describe('useRateLimitedChat', () => {
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Mock successful response
    mockFetch.mockResolvedValue({
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'))
          controller.close()
        },
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize without rate limiting by default', () => {
    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: false,
      })
    )

    expect(result.current.isRateLimited).toBe(false)
    expect(result.current.rateLimitResetAt).toBeNull()
    expect(result.current.queueStatus.maxConcurrent).toBe(3) // default
  })

  it('should initialize with rate limiting enabled', () => {
    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
        maxConcurrent: 2,
        maxQueueSize: 5,
      })
    )

    expect(result.current.queueStatus.maxConcurrent).toBe(2)
    expect(result.current.queueStatus.maxQueueSize).toBe(5)
  })

  it('should handle successful requests', async () => {
    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
      })
    )

    const appendPromise = result.current.append({ role: 'user', content: 'Hello' })

    await expect(appendPromise).resolves.toBeDefined()
    expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.any(Object))
  })

  it('should handle rate limit errors', async () => {
    // Mock rate limit response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: new Headers({
        'Retry-After': '60',
      }),
    })

    const onRateLimited = vi.fn()

    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
        onRateLimited,
        rateLimitCheck: () => Promise.resolve({ allowed: false, resetAt: Date.now() + 60000 }),
      })
    )

    // This should trigger rate limiting
    await expect(result.current.append({ role: 'user', content: 'Hello' })).rejects.toThrow()

    expect(onRateLimited).toHaveBeenCalled()
    expect(result.current.isRateLimited).toBe(true)
  })

  it('should clear rate limit status after reset time', async () => {
    const resetTime = Date.now() + 1000 // 1 second from now

    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
      })
    )

    // Manually set rate limit state
    ;(result.current as any).isRateLimited = true
    ;(result.current as any).rateLimitResetAt = resetTime

    // Wait for reset time to pass
    await new Promise(resolve => setTimeout(resolve, 1100))

    await waitFor(() => {
      expect(result.current.isRateLimited).toBe(false)
      expect(result.current.rateLimitResetAt).toBeNull()
    })
  })

  it('should provide queue status', async () => {
    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
        maxConcurrent: 1,
        maxQueueSize: 3,
      })
    )

    expect(result.current.queueStatus).toEqual({
      queueLength: 0,
      activeCount: 0,
      maxConcurrent: 1,
      maxQueueSize: 3,
    })
  })

  it('should call request queued callback', async () => {
    // Mock slow response to force queuing
    mockFetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve({
        ok: true,
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'))
            controller.close()
          },
        }),
      }), 100)
    }))

    const onRequestQueued = vi.fn()

    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
        maxConcurrent: 1, // Force queuing
        onRequestQueued,
      })
    )

    // Start first request
    result.current.append({ role: 'user', content: 'First' })

    // Queue second request immediately
    result.current.append({ role: 'user', content: 'Second' })

    // Should call onRequestQueued
    await waitFor(() => {
      expect(onRequestQueued).toHaveBeenCalled()
    })
  })

  it('should allow clearing the queue', () => {
    const { result } = renderHook(() =>
      useRateLimitedChat({
        api: '/api/chat',
        enableRateLimiting: true,
      })
    )

    expect(typeof result.current.clearQueue).toBe('function')

    // Should not throw
    expect(() => result.current.clearQueue()).not.toThrow()
  })
})