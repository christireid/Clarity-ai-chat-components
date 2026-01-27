/**
 * Tests for useCompletion hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCompletion } from '../use-completion'

global.fetch = vi.fn()

describe('useCompletion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty completion', () => {
    const { result } = renderHook(() => useCompletion())

    expect(result.current.completion).toBe('')
    expect(result.current.isLoading).toBe(false)
  })

  it('should initialize with initialCompletion', () => {
    const { result } = renderHook(() =>
      useCompletion({ initialCompletion: 'Initial text' })
    )

    expect(result.current.completion).toBe('Initial text')
  })

  it('should handle completion', async () => {
    const mockResponse = {
      ok: true,
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"completion":"Hello"}\n\n'))
          controller.close()
        },
      }),
    }

    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

    const { result } = renderHook(() =>
      useCompletion({ api: '/api/completion', stream: true })
    )

    await result.current.complete('Test prompt')

    await waitFor(() => {
      expect(result.current.completion).toBeTruthy()
    })
  })

  it('should handle stop', () => {
    const { result } = renderHook(() => useCompletion())

    result.current.stop()

    expect(result.current.isLoading).toBe(false)
  })

  it('should handle errors', async () => {
    const mockError = new Error('Network error')
    vi.mocked(fetch).mockRejectedValueOnce(mockError)

    const onError = vi.fn()

    const { result } = renderHook(() =>
      useCompletion({ api: '/api/completion', onError })
    )

    await expect(result.current.complete('Test')).rejects.toThrow()

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })
})
