'use client'

/**
 * Disconnect race condition tests
 *
 * These tests verify that disconnect() safely handles in-flight read operations
 * and prevents orphaned timeouts/state updates.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStreamingSSE } from '../use-streaming-sse'

// Mock logger
vi.mock('@clarity-chat/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

// Mock fetch and ReadableStream
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('useStreamingSSE - Disconnect Race Conditions', () => {
  let mockReader: any
  let mockStream: any
  let readPromiseResolve: any
  let readPromiseReject: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a mock reader with controllable read() promise
    mockReader = {
      read: vi.fn(() => {
        return new Promise((resolve, reject) => {
          readPromiseResolve = resolve
          readPromiseReject = reject
        })
      }),
      cancel: vi.fn(() => Promise.resolve()),
    }

    mockStream = {
      getReader: vi.fn(() => mockReader),
    }

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: mockStream,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle disconnect during in-flight read operation', async () => {
    const onMessage = vi.fn()
    const onClose = vi.fn()

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        onMessage,
        onClose,
        autoReconnect: false,
      })
    )

    // Start connecting
    const connectPromise = act(async () => {
      await result.current.connect()
    })

    // Wait for the promise to be created
    await Promise.resolve()

    expect(result.current.status).toBe('streaming')

    // Disconnect while read() is in-flight
    act(() => {
      result.current.disconnect()
    })

    // Verify disconnect happened
    expect(result.current.status).toBe('closed')
    expect(mockReader.cancel).toHaveBeenCalled()

    // Now resolve the in-flight read() with data (after disconnect)
    const textEncoder = new TextEncoder()
    const chunk = textEncoder.encode('data: {"message":"test"}\n\n')

    readPromiseResolve({ done: false, value: chunk })

    // Wait for any state updates
    await act(async () => {
      await Promise.resolve()
    })

    // Verify data was NOT processed (no message callback)
    expect(onMessage).not.toHaveBeenCalled()
    expect(result.current.events).toHaveLength(0)
  })

  it('should not create heartbeat timeout after disconnect', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        heartbeatInterval: 5000,
        autoReconnect: false,
      })
    )

    // Connect
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.status).toBe('streaming')

    // Get initial fetch count
    const initialFetchCount = mockFetch.mock.calls.length

    // Disconnect while read() is in-flight
    act(() => {
      result.current.disconnect()
    })

    // Resolve read with data (after disconnect)
    const textEncoder = new TextEncoder()
    const chunk = textEncoder.encode('data: test\n\n')

    readPromiseResolve({ done: false, value: chunk })

    await act(async () => {
      await Promise.resolve()
    })

    // Verify no additional fetch calls (no reconnection)
    expect(mockFetch).toHaveBeenCalledTimes(initialFetchCount)
    expect(result.current.status).toBe('closed')
  })

  it('should prevent state updates after disconnect', async () => {
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

    expect(result.current.status).toBe('streaming')

    // Disconnect
    act(() => {
      result.current.disconnect()
    })

    expect(result.current.status).toBe('closed')

    // Try to resolve read with data (after disconnect)
    const textEncoder = new TextEncoder()
    const chunk = textEncoder.encode('data: test\n\n')

    readPromiseResolve({ done: false, value: chunk })

    await act(async () => {
      await Promise.resolve()
    })

    // Verify status stayed 'closed' (no state updates)
    expect(result.current.status).toBe('closed')
    expect(result.current.events).toHaveLength(0)
  })

  it('should clean up reader on disconnect', async () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        heartbeatInterval: 5000,
        autoReconnect: false,
      })
    )

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.status).toBe('streaming')

    // Disconnect
    act(() => {
      result.current.disconnect()
    })

    // Verify reader was cancelled
    expect(mockReader.cancel).toHaveBeenCalled()
    expect(result.current.status).toBe('closed')
  })

  it('should allow reconnection after disconnect', async () => {
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
      await Promise.resolve()
    })

    expect(result.current.status).toBe('streaming')

    // Disconnect
    act(() => {
      result.current.disconnect()
    })

    expect(result.current.status).toBe('closed')

    // Resolve the in-flight read
    readPromiseResolve({ done: false, value: new Uint8Array() })

    await act(async () => {
      await Promise.resolve()
    })

    // Reset mocks for reconnection
    vi.clearAllMocks()
    const newMockReader = {
      read: vi.fn(() => new Promise(() => {})), // Keep pending
      cancel: vi.fn(() => Promise.resolve()),
    }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Map([['content-type', 'text/event-stream']]),
      body: {
        getReader: () => newMockReader,
      },
    })

    // Reconnect
    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.status).toBe('streaming')
    expect(mockFetch).toHaveBeenCalledTimes(1) // New connection
  })

  it('should handle multiple chunks arriving after disconnect', async () => {
    const onMessage = vi.fn()

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: 'http://localhost/api/stream',
        onMessage,
        autoReconnect: false,
      })
    )

    act(() => {
      result.current.connect()
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.status).toBe('streaming')

    // Disconnect
    act(() => {
      result.current.disconnect()
    })

    expect(result.current.status).toBe('closed')

    // Simulate chunk arriving after disconnect
    const textEncoder = new TextEncoder()
    const chunk = textEncoder.encode('data: chunk1\n\n')

    readPromiseResolve({ done: false, value: chunk })

    await act(async () => {
      await Promise.resolve()
    })

    // Verify NO messages were processed
    expect(onMessage).not.toHaveBeenCalled()
    expect(result.current.events).toHaveLength(0)
  })
})
