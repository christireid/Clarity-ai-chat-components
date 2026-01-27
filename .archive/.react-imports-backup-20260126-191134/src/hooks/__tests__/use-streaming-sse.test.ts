import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStreamingSSE } from '../use-streaming-sse'

// Mock fetch for SSE
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useStreamingSSE', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should initialize with idle status', () => {
    const { result } = renderHook(() =>
      useStreamingSSE({
        url: '/api/stream',
      })
    )

    expect(result.current.status).toBe('idle')
    expect(result.current.events).toEqual([])
    expect(result.current.data).toBe('')
  })

  it('should handle basic SSE connection', async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: hello\n\n'),
        })
        .mockResolvedValueOnce({ done: true }),
      cancel: vi.fn(),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader },
    })

    const onMessage = vi.fn()

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: '/api/stream',
        onMessage,
      })
    )

    result.current.connect()

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('should add authentication header', async () => {
    const mockReader = {
      read: vi.fn().mockResolvedValueOnce({ done: true }),
      cancel: vi.fn(),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({
        url: '/api/stream',
        authToken: 'test-token',
      })
    )

    result.current.connect()

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/stream',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })
  })

  it('should disconnect and cancel stream', async () => {
    const mockReader = {
      read: vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ done: true }), 100))
      ),
      cancel: vi.fn(),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader },
    })

    const { result } = renderHook(() =>
      useStreamingSSE({ url: '/api/stream' })
    )

    result.current.connect()
    result.current.disconnect()

    await waitFor(() => {
      expect(result.current.status).toBe('closed')
    })
  })

  it('should reset state', () => {
    const { result } = renderHook(() =>
      useStreamingSSE({ url: '/api/stream' })
    )

    result.current.reset()

    expect(result.current.events).toEqual([])
    expect(result.current.data).toBe('')
    expect(result.current.error).toBeNull()
  })
})
