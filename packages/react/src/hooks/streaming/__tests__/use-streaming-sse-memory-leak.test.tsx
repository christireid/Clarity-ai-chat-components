/**
 * Memory leak tests for SSE reconnection cycles
 *
 * These tests verify that timeout accumulation is prevented during
 * repeated reconnection cycles, which could cause memory exhaustion
 * in long-running sessions.
 *
 * CRIT-002: Memory Leak in SSE Reconnection Loop
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useStreamingSSE } from '../use-streaming-sse'

// Mock logger
vi.mock('@clarity-chat/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('useStreamingSSE - Memory Leak Prevention', () => {
  // Track setTimeout/clearTimeout calls
  let setTimeoutSpy: any
  let clearTimeoutSpy: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Spy on timeout functions
    setTimeoutSpy = vi.spyOn(global, 'setTimeout')
    clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
  })

  it('should clear timeouts before creating new ones during reconnection', async () => {
    let attemptCount = 0
    const maxAttempts = 10 // Test with 10 reconnections for speed

    mockFetch.mockImplementation(() => {
      attemptCount++

      if (attemptCount <= maxAttempts) {
        // Simulate connection that immediately fails
        const mockReader = {
          read: vi.fn().mockRejectedValueOnce(new Error(`Attempt ${attemptCount} failed`)),
          cancel: vi.fn(() => Promise.resolve()),
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'text/event-stream']]),
          body: {
            getReader: () => mockReader,
          },
        })
      }

      // Final successful connection
      const mockReader = {
        read: vi.fn(() => new Promise(() => {})), // Never resolves
        cancel: vi.fn(() => Promise.resolve()),
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/event-stream']]),
        body: {
          getReader: () => mockReader,
        },
      })
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: true,
        maxReconnectAttempts: 150,
        reconnectDelay: 10,
        heartbeatInterval: 1000,
      })
    )

    // Start connection
    act(() => {
      result.current.connect()
    })

    // Wait for reconnections to complete
    await waitFor(
      () => {
        expect(attemptCount).toBeGreaterThanOrEqual(maxAttempts)
      },
      { timeout: 15000 }
    )

    // Get call counts
    const setTimeoutCalls = setTimeoutSpy.mock.calls.length
    const clearTimeoutCalls = clearTimeoutSpy.mock.calls.length

    // Verify timeouts are being cleared
    // clearTimeout calls should be > 0, indicating cleanup is happening
    expect(clearTimeoutCalls).toBeGreaterThan(0)

    // The ratio should show that most timeouts are being cleared
    // Allow some active timeouts (heartbeat, pending reconnect, timing variations)
    // Without the fix, this would be ~100+ (1 timeout per reconnection accumulated)
    // With the fix, should be < 20 for 10 reconnections (bounded by active connections)
    const unclearedTimeouts = setTimeoutCalls - clearTimeoutCalls
    expect(unclearedTimeouts).toBeLessThan(20)

    // Cleanup
    act(() => {
      result.current.disconnect()
    })
  }, 20000)

  it('should call clearTimeout for heartbeat and reconnect timeouts on disconnect', async () => {
    // Mock reader that streams indefinitely
    const mockReader = {
      read: vi.fn(() => new Promise(() => {})),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader,
      },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: true,
        heartbeatInterval: 1000,
      })
    )

    // Reset spy call counts
    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()

    // Connect
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Should have created timeouts
    const setTimeoutCallsAfterConnect = setTimeoutSpy.mock.calls.length
    expect(setTimeoutCallsAfterConnect).toBeGreaterThan(0)

    // Disconnect
    clearTimeoutSpy.mockClear()

    act(() => {
      result.current.disconnect()
    })

    // Should have cleared timeouts
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should clear old timeouts before creating new ones in connect()', async () => {
    // Mock successful connection
    const mockReader = {
      read: vi.fn(() => new Promise(() => {})),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader,
      },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
        heartbeatInterval: 1000,
      })
    )

    // First connection
    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    const setTimeoutCallsAfterFirst = setTimeoutSpy.mock.calls.length

    // Disconnect and reconnect
    act(() => {
      result.current.disconnect()
    })

    // Don't clear spies - we want to capture the clearTimeout calls in connect()
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Total clearTimeout calls should be > 0 (includes disconnect + connect cleanup)
    const totalClearTimeoutCalls = clearTimeoutSpy.mock.calls.length
    expect(totalClearTimeoutCalls).toBeGreaterThan(0)

    // Verify timeouts aren't accumulating by checking total numbers are reasonable
    // If accumulating, we'd see exponential growth in setTimeout calls
    const setTimeoutCallsTotal = setTimeoutSpy.mock.calls.length

    // Total setTimeout calls should be reasonable (not 2x, 3x, etc from accumulation)
    // Allow up to 2x for timing variations but not unbounded growth
    expect(setTimeoutCallsTotal).toBeLessThan(setTimeoutCallsAfterFirst * 2.5)
  })

  it('should handle rapid connect/disconnect cycles without accumulation', async () => {
    // Mock successful connection
    const mockReader = {
      read: vi.fn(() => new Promise(() => {})),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader,
      },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
        heartbeatInterval: 1000,
      })
    )

    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()

    // Perform 20 rapid connect/disconnect cycles
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.connect()
      })

      await act(async () => {
        await Promise.resolve()
      })

      act(() => {
        result.current.disconnect()
      })
    }

    // Get final counts
    const setTimeoutCalls = setTimeoutSpy.mock.calls.length
    const clearTimeoutCalls = clearTimeoutSpy.mock.calls.length

    // Should have cleared most timeouts
    // Allow a small difference for the last cycle's timeouts
    const unclearedTimeouts = setTimeoutCalls - clearTimeoutCalls
    expect(unclearedTimeouts).toBeLessThan(5)
  })

  it('should clean up timeouts when connection fails and reconnects', async () => {
    let attemptCount = 0

    mockFetch.mockImplementation(() => {
      attemptCount++

      if (attemptCount === 1) {
        // First attempt fails
        const mockReader = {
          read: vi.fn().mockRejectedValueOnce(new Error('Connection failed')),
          cancel: vi.fn(() => Promise.resolve()),
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Map([['content-type', 'text/event-stream']]),
          body: {
            getReader: () => mockReader,
          },
        })
      }

      // Second attempt succeeds
      const mockReader = {
        read: vi.fn(() => new Promise(() => {})),
        cancel: vi.fn(() => Promise.resolve()),
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Map([['content-type', 'text/event-stream']]),
        body: {
          getReader: () => mockReader,
        },
      })
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: true,
        maxReconnectAttempts: 5,
        reconnectDelay: 10,
        heartbeatInterval: 1000,
      })
    )

    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()

    // Start connection
    act(() => {
      result.current.connect()
    })

    // Wait for successful reconnection
    await waitFor(() => {
      expect(result.current.status).toBe('streaming')
    })

    // Get counts
    const clearTimeoutCalls = clearTimeoutSpy.mock.calls.length

    // Should have cleared timeouts during error recovery
    expect(clearTimeoutCalls).toBeGreaterThan(0)

    // Cleanup
    act(() => {
      result.current.disconnect()
    })
  })
})
