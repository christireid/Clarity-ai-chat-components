import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useStreaming } from '../use-streaming'

// Helper to create a mock ReadableStream
function createMockStream(chunks: string[], delay = 10): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index < chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        controller.enqueue(encoder.encode(chunks[index]))
        index++
      } else {
        controller.close()
      }
    },
  })
}

describe('useStreaming', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with empty content', () => {
      const { result } = renderHook(() => useStreaming())

      expect(result.current.content).toBe('')
      expect(result.current.isStreaming).toBe(false)
    })
  })

  describe('startStreaming', () => {
    it('should stream chunks and update content', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Hello', ' ', 'World'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Hello World')
      expect(result.current.isStreaming).toBe(false)
    })

    it('should set isStreaming to true during streaming', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Test'], 100)

      const streamPromise = act(async () => {
        await result.current.startStreaming(stream)
      })

      // Should be streaming
      await waitFor(() => {
        expect(result.current.isStreaming).toBe(true)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      await streamPromise

      // Should not be streaming after completion
      expect(result.current.isStreaming).toBe(false)
    })

    it('should call onChunk callback for each chunk', async () => {
      const onChunk = vi.fn()
      const { result } = renderHook(() => useStreaming({ onChunk }))

      const chunks = ['First', ' chunk', ' here']
      const stream = createMockStream(chunks)

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(onChunk).toHaveBeenCalledTimes(3)
      expect(onChunk).toHaveBeenNthCalledWith(1, 'First')
      expect(onChunk).toHaveBeenNthCalledWith(2, ' chunk')
      expect(onChunk).toHaveBeenNthCalledWith(3, ' here')
    })

    it('should call onComplete callback with full text', async () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() => useStreaming({ onComplete }))

      const stream = createMockStream(['Hello', ' ', 'World'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith('Hello World')
    })

    it('should call onError callback on error', async () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useStreaming({ onError }))

      const errorStream = new ReadableStream({
        pull() {
          throw new Error('Stream error')
        },
      })

      await act(async () => {
        await result.current.startStreaming(errorStream)
      })

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Stream error',
      }))
    })

    it('should accumulate content progressively', async () => {
      const contentHistory: string[] = []
      const onChunk = vi.fn(() => {
        contentHistory.push(result.current.content)
      })

      const { result } = renderHook(() => useStreaming({ onChunk }))

      const stream = createMockStream(['A', 'B', 'C'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('ABC')
    })

    it('should handle empty stream', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream([])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('')
      expect(result.current.isStreaming).toBe(false)
    })

    it('should handle single chunk', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Single chunk'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Single chunk')
    })

    it('should handle many small chunks', async () => {
      const { result } = renderHook(() => useStreaming())

      const chunks = Array.from({ length: 100 }, (_, i) => `${i}`)
      const stream = createMockStream(chunks)

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe(chunks.join(''))
    })
  })

  describe('AbortController Support', () => {
    it('should support custom AbortSignal', async () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useStreaming({ onError }))

      const controller = new AbortController()
      const stream = createMockStream(['Test'], 100)

      const streamPromise = act(async () => {
        await result.current.startStreaming(stream, { signal: controller.signal })
      })

      // Abort after starting
      act(() => {
        controller.abort()
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      await streamPromise

      // Should not call onError for abort
      expect(onError).not.toHaveBeenCalled()
    })

    it('should handle abort during streaming', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Start', ' streaming', ' text'], 50)
      const controller = new AbortController()

      const streamPromise = act(async () => {
        await result.current.startStreaming(stream, { signal: controller.signal })
      })

      // Let first chunk come through
      await act(async () => {
        await vi.advanceTimersByTimeAsync(60)
      })

      // Abort
      act(() => {
        controller.abort()
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      await streamPromise

      // Should have stopped streaming
      expect(result.current.isStreaming).toBe(false)
    })

    it('should cleanup on unmount during streaming', async () => {
      const { result, unmount } = renderHook(() => useStreaming())

      const stream = createMockStream(['Test'], 100)

      act(() => {
        result.current.startStreaming(stream)
      })

      // Unmount while streaming
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('stopStreaming', () => {
    it('should stop streaming when called', async () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() => useStreaming({ onComplete }))

      const stream = createMockStream(['First', ' chunk', ' here'], 50)

      const streamPromise = act(async () => {
        await result.current.startStreaming(stream)
      })

      // Let first chunk come through
      await act(async () => {
        await vi.advanceTimersByTimeAsync(60)
      })

      // Stop streaming
      act(() => {
        result.current.stopStreaming()
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      await streamPromise

      expect(result.current.isStreaming).toBe(false)
      // onComplete should not be called when manually stopped
      expect(onComplete).not.toHaveBeenCalled()
    })

    it('should be safe to call when not streaming', () => {
      const { result } = renderHook(() => useStreaming())

      expect(() => {
        act(() => {
          result.current.stopStreaming()
        })
      }).not.toThrow()
    })

    it('should cancel current stream before starting new one', async () => {
      const { result } = renderHook(() => useStreaming())

      const firstStream = createMockStream(['First'], 100)
      const secondStream = createMockStream(['Second'], 10)

      // Start first stream
      act(() => {
        result.current.startStreaming(firstStream)
      })

      await waitFor(() => {
        expect(result.current.isStreaming).toBe(true)
      })

      // Start second stream (should cancel first)
      await act(async () => {
        await result.current.startStreaming(secondStream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Second')
    })
  })

  describe('reset', () => {
    it('should reset content and streaming state', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Test content'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Test content')

      act(() => {
        result.current.reset()
      })

      expect(result.current.content).toBe('')
      expect(result.current.isStreaming).toBe(false)
    })

    it('should stop streaming when reset is called', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Test'], 100)

      act(() => {
        result.current.startStreaming(stream)
      })

      await waitFor(() => {
        expect(result.current.isStreaming).toBe(true)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.isStreaming).toBe(false)
      expect(result.current.content).toBe('')
    })
  })

  describe('Error Handling', () => {
    it('should handle stream errors gracefully', async () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useStreaming({ onError }))

      const errorStream = new ReadableStream({
        async pull(controller) {
          throw new Error('Stream failure')
        },
      })

      await act(async () => {
        await result.current.startStreaming(errorStream)
      })

      expect(onError).toHaveBeenCalledWith(expect.any(Error))
      expect(result.current.isStreaming).toBe(false)
    })

    it('should not call onError for AbortError', async () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useStreaming({ onError }))

      const controller = new AbortController()
      const stream = createMockStream(['Test'])

      act(() => {
        controller.abort()
      })

      await act(async () => {
        await result.current.startStreaming(stream, { signal: controller.signal })
        await vi.runAllTimersAsync()
      })

      expect(onError).not.toHaveBeenCalled()
    })

    it('should continue to work after error', async () => {
      const onError = vi.fn()
      const { result } = renderHook(() => useStreaming({ onError }))

      // First stream errors
      const errorStream = new ReadableStream({
        pull() {
          throw new Error('First error')
        },
      })

      await act(async () => {
        await result.current.startStreaming(errorStream)
      })

      expect(onError).toHaveBeenCalledTimes(1)

      // Second stream succeeds
      const goodStream = createMockStream(['Success'])

      await act(async () => {
        await result.current.startStreaming(goodStream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Success')
    })
  })

  describe('Edge Cases', () => {
    it('should handle Unicode characters', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['🚀', ' ', '世界', ' ', '😀'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('🚀 世界 😀')
    })

    it('should handle newlines and special characters', async () => {
      const { result } = renderHook(() => useStreaming())

      const stream = createMockStream(['Line 1\n', 'Line 2\t', 'Tab\r\n'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe('Line 1\nLine 2\tTab\r\n')
    })

    it('should handle very large chunks', async () => {
      const { result } = renderHook(() => useStreaming())

      const largeChunk = 'a'.repeat(1000000) // 1MB
      const stream = createMockStream([largeChunk])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(result.current.content).toBe(largeChunk)
    })

    it('should handle rapid start/stop cycles', async () => {
      const { result } = renderHook(() => useStreaming())

      for (let i = 0; i < 5; i++) {
        const stream = createMockStream([`Cycle ${i}`])

        await act(async () => {
          await result.current.startStreaming(stream)
          await vi.runAllTimersAsync()
        })

        act(() => {
          result.current.reset()
        })
      }

      expect(result.current.content).toBe('')
      expect(result.current.isStreaming).toBe(false)
    })
  })

  describe('Callback Order', () => {
    it('should call callbacks in correct order', async () => {
      const callOrder: string[] = []

      const onChunk = vi.fn(() => callOrder.push('chunk'))
      const onComplete = vi.fn(() => callOrder.push('complete'))

      const { result } = renderHook(() =>
        useStreaming({ onChunk, onComplete })
      )

      const stream = createMockStream(['A', 'B', 'C'])

      await act(async () => {
        await result.current.startStreaming(stream)
        await vi.runAllTimersAsync()
      })

      expect(callOrder).toEqual(['chunk', 'chunk', 'chunk', 'complete'])
    })

    it('should not call onComplete if streaming is stopped', async () => {
      const onComplete = vi.fn()
      const { result } = renderHook(() => useStreaming({ onComplete }))

      const stream = createMockStream(['Test'], 100)

      const streamPromise = act(async () => {
        await result.current.startStreaming(stream)
      })

      act(() => {
        result.current.stopStreaming()
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      await streamPromise

      expect(onComplete).not.toHaveBeenCalled()
    })
  })
})

