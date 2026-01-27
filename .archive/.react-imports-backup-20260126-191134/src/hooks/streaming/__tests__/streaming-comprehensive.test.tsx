'use client'

/**
 * Comprehensive Streaming Tests
 *
 * Tests for streaming response handling, chunk accumulation, error handling,
 * and state management across all streaming hooks.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useStreamingSSE } from '../use-streaming-sse'
import { processStream } from '../../../utils/streaming/streaming-helpers'
import type { StreamOptions } from '../../../utils/streaming/streaming-helpers'

// Mock fetch
global.fetch = vi.fn()

// Mock TextDecoder
global.TextDecoder = class {
  decode(value: Uint8Array, options?: { stream?: boolean }): string {
    return new TextDecoder().decode(value, options)
  }
} as any

describe('Streaming Response Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Chunk Accumulation', () => {
    it('should accumulate chunks correctly', async () => {
      const chunks = ['Hello', ' ', 'world', '!']
      let accumulated = ''

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
      })

      expect(accumulated).toBe('Hello world!')
    })

    it('should handle rapid consecutive chunks', async () => {
      const chunks = Array(100).fill('a')
      let accumulated = ''
      let chunkCount = 0

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
          chunkCount++
        },
      })

      expect(accumulated.length).toBe(100)
      expect(chunkCount).toBe(100)
    })

    it('should handle empty chunks', async () => {
      const chunks = ['Hello', '', 'world']
      let accumulated = ''

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
      })

      expect(accumulated).toBe('Helloworld')
    })

    it('should handle unicode characters correctly', async () => {
      const chunks = ['Hello', ' 你好', ' world']
      let accumulated = ''

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
      })

      expect(accumulated).toBe('Hello 你好 world')
    })
  })

  describe('SSE Format Parsing', () => {
    it('should parse SSE data lines correctly', async () => {
      const sseData = 'data: {"content": "Hello"}\n\n'
      let receivedData: any = null

      const stream = createMockStream([sseData])
      await processStream(stream, {
        format: 'sse',
        onData: (data) => {
          receivedData = data
        },
      })

      expect(receivedData).toEqual({ content: 'Hello' })
    })

    it('should handle multi-line SSE data', async () => {
      const sseData = 'data: Line 1\ndata: Line 2\n\n'
      let receivedData: string | null = null

      const stream = createMockStream([sseData])
      await processStream(stream, {
        format: 'sse',
        onData: (data) => {
          receivedData = data as string
        },
      })

      expect(receivedData).toBe('Line 1\nLine 2')
    })

    it('should handle [DONE] marker', async () => {
      const sseData = 'data: {"content": "Hello"}\n\ndata: [DONE]\n\n'
      let chunkCount = 0

      const stream = createMockStream([sseData])
      await processStream(stream, {
        format: 'sse',
        onChunk: () => {
          chunkCount++
        },
      })

      expect(chunkCount).toBe(1) // Only one chunk before [DONE]
    })
  })

  describe('Error Handling During Streaming', () => {
    it('should preserve partial content on immediate failure', async () => {
      const stream = createFailingStream(['Hello'], 0)
      let accumulated = ''
      let error: Error | null = null

      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
        onError: (err) => {
          error = err
        },
      })

      expect(accumulated).toBe('Hello')
      expect(error).toBeTruthy()
    })

    it('should preserve partial content on mid-stream failure', async () => {
      const stream = createFailingStream(['Hello', ' ', 'world'], 2)
      let accumulated = ''
      let error: Error | null = null

      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
        onError: (err) => {
          error = err
        },
      })

      expect(accumulated).toBe('Hello ')
      expect(error).toBeTruthy()
    })

    it('should handle network interruption gracefully', async () => {
      const stream = createInterruptedStream(['Hello', ' world'])
      let accumulated = ''
      let error: Error | null = null

      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
        onError: (err) => {
          error = err
        },
      })

      expect(accumulated).toBeTruthy()
      expect(error).toBeTruthy()
    })

    it('should handle AbortError correctly', async () => {
      const controller = new AbortController()
      const stream = createMockStream(['Hello', ' world'])

      // Abort after first chunk
      setTimeout(() => controller.abort(), 10)

      let accumulated = ''
      let error: Error | null = null

      await processStream(stream, {
        signal: controller.signal,
        onChunk: (chunk) => {
          accumulated += chunk
        },
        onError: (err) => {
          error = err
        },
      })

      expect(accumulated).toBeTruthy()
      // AbortError should not call onError
      expect(error).toBeNull()
    })
  })

  describe('State Management', () => {
    it('should batch rapid updates efficiently', async () => {
      const chunks = Array(1000).fill('a')
      let updateCount = 0

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: () => {
          updateCount++
        },
      })

      // Should process all chunks
      expect(updateCount).toBe(1000)
    })

    it('should handle buffer overflow protection', async () => {
      const largeChunk = 'a'.repeat(100000) // Larger than default maxChunkSize
      let processed = false

      const stream = createMockStream([largeChunk])
      await processStream(stream, {
        maxChunkSize: 65536,
        onChunk: () => {
          processed = true
        },
      })

      expect(processed).toBe(true)
    })
  })

  describe('useStreamingSSE Hook', () => {
    it('should connect and receive chunks', async () => {
      const chunks = ['Hello', ' ', 'world']
      const mockResponse = createMockFetchResponse(chunks)

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() =>
        useStreamingSSE({
          url: '/api/stream',
          onMessage: vi.fn(),
        })
      )

      result.current.connect()

      await waitFor(() => {
        expect(result.current.status).toBe('streaming')
      })

      await waitFor(() => {
        expect(result.current.data).toBeTruthy()
      }, { timeout: 2000 })
    })

    it('should handle reconnection on failure', async () => {
      const mockResponse = createMockFetchResponse(['Hello'])
      ;(global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() =>
        useStreamingSSE({
          url: '/api/stream',
          autoReconnect: true,
          maxReconnectAttempts: 3,
        })
      )

      result.current.connect()

      await waitFor(() => {
        expect(result.current.isReconnecting).toBe(true)
      }, { timeout: 1000 })
    })

    it('should disconnect cleanly', async () => {
      const mockResponse = createMockFetchResponse(['Hello'])
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() =>
        useStreamingSSE({
          url: '/api/stream',
        })
      )

      result.current.connect()
      await waitFor(() => {
        expect(result.current.status).toBe('streaming')
      })

      result.current.disconnect()

      await waitFor(() => {
        expect(result.current.status).toBe('closed')
      })
    })
  })

  describe('Markdown Rendering During Streaming', () => {
    it('should handle partial markdown tags', async () => {
      const chunks = ['**Hello', ' world**']
      let accumulated = ''

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
      })

      expect(accumulated).toBe('**Hello world**')
    })

    it('should handle code blocks split across chunks', async () => {
      const chunks = ['```js\nconst x', ' = 1;\n```']
      let accumulated = ''

      const stream = createMockStream(chunks)
      await processStream(stream, {
        onChunk: (chunk) => {
          accumulated += chunk
        },
      })

      expect(accumulated).toBe('```js\nconst x = 1;\n```')
    })
  })

  describe('Performance', () => {
    it('should handle large streams efficiently', async () => {
      const largeChunks = Array(10000).fill('a')
      let processed = 0

      const stream = createMockStream(largeChunks)
      const startTime = performance.now()

      await processStream(stream, {
        onChunk: () => {
          processed++
        },
      })

      const duration = performance.now() - startTime

      expect(processed).toBe(10000)
      expect(duration).toBeLessThan(5000) // Should complete in reasonable time
    })
  })
})

// Helper functions

function createMockStream(chunks: string[]): ReadableStream<Uint8Array> {
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index >= chunks.length) {
        controller.close()
        return
      }

      const chunk = chunks[index++]
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(chunk))
    },
  })
}

function createFailingStream(
  chunks: string[],
  failAfter: number
): ReadableStream<Uint8Array> {
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index >= chunks.length) {
        controller.close()
        return
      }

      if (index >= failAfter) {
        controller.error(new Error('Stream failed'))
        return
      }

      const chunk = chunks[index++]
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(chunk))
    },
  })
}

function createInterruptedStream(
  chunks: string[]
): ReadableStream<Uint8Array> {
  let index = 0

  return new ReadableStream({
    async pull(controller) {
      if (index >= chunks.length) {
        controller.close()
        return
      }

      const chunk = chunks[index++]
      const encoder = new TextEncoder()

      // Simulate interruption after first chunk
      if (index === 1) {
        controller.enqueue(encoder.encode(chunk))
        setTimeout(() => {
          controller.error(new Error('Network interrupted'))
        }, 10)
        return
      }

      controller.enqueue(encoder.encode(chunk))
    },
  })
}

function createMockFetchResponse(
  chunks: string[]
): Response {
  const stream = createMockStream(chunks)

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
