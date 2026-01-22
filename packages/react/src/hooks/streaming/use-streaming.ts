'use client'

import * as React from 'react'

export interface UseStreamingOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void

  /** STREAM-1: Streaming timeout in milliseconds (default: none) */
  timeout?: number

  /** STREAM-1: Called when streaming times out */
  onTimeout?: () => void

  /** STREAM-2: Maximum content length in characters (default: none, prevents memory exhaustion) */
  maxContentLength?: number

  /** STREAM-2: Called when content length limit is exceeded */
  onContentLimitExceeded?: (currentLength: number, limit: number) => void
}

/**
 * Return type for useStreaming hook (low-level primitive)
 * 
 * Follows the standard hook return pattern:
 * - Data: `content` (accumulated stream content)
 * - State: `isStreaming` (streaming status)
 * - Actions: `startStreaming`, `stopStreaming`, `reset`
 */
export interface UseStreamingReturn {
  /** Accumulated stream content (data) */
  content: string
  
  /** Whether currently streaming (state) */
  isStreaming: boolean
  
  /** Start streaming from a ReadableStream (action) */
  startStreaming: (stream: ReadableStream<Uint8Array>, options?: { signal?: AbortSignal }) => Promise<void>
  
  /** Stop streaming (action) */
  stopStreaming: () => void
  
  /** Reset content and state (action) */
  reset: () => void
}

/**
 * useStreaming - Low-Level Streaming Primitive
 * 
 * **Architecture Layer**: Low-Level (Primitives)
 * **Domain**: Streaming & Transport
 * 
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 * 
 * For higher-level streaming, use mid-level `useStreamingSSE` or `useStreamingWebSocket`.
 * For chat streaming, use top-level `useClarityChat` with streaming enabled.
 * 
 * **Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 * 
 * @param options - Configuration options
 * @param options.onChunk - Called for each chunk received
 * @param options.onComplete - Called when streaming completes
 * @param options.onError - Called on error
 * @returns Streaming state and controls
 * 
 * @example
 * ```tsx
 * const { content, isStreaming, startStreaming, stopStreaming } = useStreaming({
 *   onChunk: (chunk) => console.log('Received:', chunk),
 *   onComplete: (full) => console.log('Done!', full)
 * })
 * 
 * // Start streaming with cancellation support
 * const controller = new AbortController()
 * await startStreaming(response.body, { signal: controller.signal })
 * 
 * // Stop streaming early if needed
 * stopStreaming()
 * ```
 */
export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const { onChunk, onComplete, onError, timeout, onTimeout, maxContentLength, onContentLimitExceeded } = options

  const [content, setContent] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const readerRef = React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null) // STREAM-1: Timeout tracking

  // Store callbacks in refs to avoid recreating streaming function when callbacks change
  const onChunkRef = React.useRef(onChunk)
  const onCompleteRef = React.useRef(onComplete)
  const onErrorRef = React.useRef(onError)
  const onTimeoutRef = React.useRef(onTimeout) // STREAM-1: Timeout callback ref
  const onContentLimitExceededRef = React.useRef(onContentLimitExceeded) // STREAM-2: Content limit callback ref

  React.useLayoutEffect(() => {
    onChunkRef.current = onChunk
    onCompleteRef.current = onComplete
    onErrorRef.current = onError
    onTimeoutRef.current = onTimeout
    onContentLimitExceededRef.current = onContentLimitExceeded
  }, [onChunk, onComplete, onError, onTimeout, onContentLimitExceeded])

  const stopStreaming = React.useCallback(() => {
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    // STREAM-1: Clear timeout on stop
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const startStreaming = React.useCallback(
    async (stream: ReadableStream<Uint8Array>, options?: { signal?: AbortSignal }) => {
      // Stop any existing streaming
      stopStreaming()

      setIsStreaming(true)
      setContent('')

      // Create AbortController if not provided
      const controller = new AbortController()
      abortControllerRef.current = controller
      const signal = options?.signal || controller.signal

      // STREAM-1: Set up timeout if specified
      if (timeout && timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          // FIX: Issue #15 - Cancel reader to prevent stuck streams
          if (readerRef.current) {
            readerRef.current.cancel().catch(() => {
              // Ignore cancel errors during timeout
            })
          }
          controller.abort()
          const timeoutError = new Error(
            `Streaming timeout after ${timeout}ms`
          )
          onErrorRef.current?.(timeoutError)
          onTimeoutRef.current?.()
        }, timeout)
      }

      try {
        const reader = stream.getReader()
        readerRef.current = reader
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          // Check if aborted
          if (signal?.aborted) {
            throw new DOMException('Streaming aborted', 'AbortError')
          }

          const { done, value } = await reader.read()

          if (done) {
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk

          // STREAM-2: Check content length limit
          if (maxContentLength && maxContentLength > 0 && fullText.length > maxContentLength) {
            onContentLimitExceededRef.current?.(fullText.length, maxContentLength)
            const limitError = new Error(
              `Content length limit exceeded: ${fullText.length} > ${maxContentLength}`
            )
            onErrorRef.current?.(limitError)
            controller.abort()
            break
          }

          setContent(fullText)
          onChunkRef.current?.(chunk)
        }

        // STREAM-1: Clear timeout on successful completion
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        onCompleteRef.current?.(fullText)
      } catch (err) {
        // STREAM-1: Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        // Don't call onError for abort (already called by timeout handler or external abort)
        if (err instanceof Error && err.name !== 'AbortError') {
          onErrorRef.current?.(err)
        }
      } finally {
        setIsStreaming(false)
        readerRef.current = null
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      }
    },
    [stopStreaming, timeout, maxContentLength] // STREAM-1, STREAM-2: timeout and maxContentLength in deps; callbacks accessed via refs
  )

  const reset = React.useCallback(() => {
    stopStreaming()
    setContent('')
  }, [stopStreaming])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopStreaming()
    }
  }, [stopStreaming])

  return {
    content,
    isStreaming,
    startStreaming,
    stopStreaming,
    reset,
  }
}
