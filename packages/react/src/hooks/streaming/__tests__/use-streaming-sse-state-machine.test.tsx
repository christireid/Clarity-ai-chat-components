/**
 * State machine validation tests
 *
 * These tests verify that SSE state transitions follow the defined state machine
 * and invalid transitions are logged as warnings.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStreamingSSE } from '../use-streaming-sse'

// Mock logger to capture warnings
vi.mock('@clarity-chat/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

import { logger } from '@clarity-chat/utils/logger'
const mockLoggerWarn = logger.warn as ReturnType<typeof vi.fn>

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('useStreamingSSE - State Machine Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock: successful connection that streams indefinitely
    const mockReader = {
      read: vi.fn(() => new Promise(() => {})), // Never resolves
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
  })

  it('should allow valid transition: idle → connecting', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
      })
    )

    expect(result.current.status).toBe('idle')

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Valid transition, no warning
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow valid transition: connecting → connected → streaming', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
      })
    )

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Should go: idle → connecting → connected → streaming
    expect(result.current.status).toBe('streaming')
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow valid transition: streaming → closed', async () => {
    // Mock reader that completes immediately
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: test\n\n') })
        .mockResolvedValueOnce({ done: true }),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
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
      })
    )

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    // Should end at closed
    expect(result.current.status).toBe('closed')
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow valid transition: streaming → error on failure', async () => {
    // Mock reader that throws error
    const mockReader = {
      read: vi.fn().mockRejectedValueOnce(new Error('Stream error')),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
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
      })
    )

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    // Should end at error
    expect(result.current.status).toBe('error')
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow valid transition: closed → connecting on reconnect', async () => {
    // First connection completes
    const mockReader1 = {
      read: vi.fn().mockResolvedValueOnce({ done: true }),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader1,
      },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
      })
    )

    // First connection
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    expect(result.current.status).toBe('closed')

    // Setup second connection
    const mockReader2 = {
      read: vi.fn(() => new Promise(() => {})),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader2,
      },
    })

    // Reconnect
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Valid transition: closed → connecting → ...
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow valid transition: error → connecting on retry', async () => {
    // Connection fails
    const mockReader = {
      read: vi.fn().mockRejectedValueOnce(new Error('Connection failed')),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
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
      })
    )

    // First connection fails
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    expect(result.current.status).toBe('error')

    // Setup retry
    const mockReader2 = {
      read: vi.fn(() => new Promise(() => {})),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => mockReader2,
      },
    })

    // Retry connection
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Valid transition: error → connecting → ...
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })

  it('should allow same-state transitions (idempotent)', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
      })
    )

    // Try connecting multiple times while already connecting
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // Should not attempt duplicate connection (guarded by status check)
    const callCount = mockFetch.mock.calls.length

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    // No additional fetch (already streaming)
    expect(mockFetch).toHaveBeenCalledTimes(callCount)
  })

  it('should allow disconnect from any state', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        autoReconnect: false,
      })
    )

    // Connect then disconnect
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    act(() => {
      result.current.disconnect()
    })

    // streaming → closed is valid
    expect(result.current.status).toBe('closed')
    expect(mockLoggerWarn).not.toHaveBeenCalled()
  })
})
