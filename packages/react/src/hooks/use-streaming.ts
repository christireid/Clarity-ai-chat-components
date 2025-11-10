import * as React from 'react'

export interface UseStreamingOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

export interface UseStreamingReturn {
  content: string
  isPending: boolean
  startStreaming: (stream: ReadableStream<Uint8Array>, options?: { signal?: AbortSignal }) => Promise<void>
  stopStreaming: () => void
  reset: () => void
  /** @deprecated Use isPending instead */
  isStreaming: boolean
}

/**
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 * 
 * **React 19 Improvements:**
 * - Uses `useTransition` for automatic pending state
 * - Non-blocking stream processing
 * - Better integration with concurrent features
 * - Simpler state management
 * 
 * **Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 * 
 * **Use Cases:**
 * - Streaming API responses (OpenAI, Anthropic, etc.)
 * - Large file processing
 * - Real-time data feeds
 * - Progressive content rendering
 * 
 * @param {UseStreamingOptions} [options] - Configuration options
 * @param {Function} [options.onChunk] - Called for each chunk received
 * @param {Function} [options.onComplete] - Called when streaming completes
 * @param {Function} [options.onError] - Called on error
 * @returns {UseStreamingReturn} Streaming state and controls
 * @example
 * ```tsx
 * const { content, isPending, startStreaming, stopStreaming } = useStreaming({
 *   onChunk: (chunk) => console.log('Received:', chunk),
 *   onComplete: (full) => console.log('Done!', full)
 * })
 * 
 * // Start streaming with cancellation support
 * const controller = new AbortController()
 * await startStreaming(response.body, { signal: controller.signal })
 * 
 * // isPending automatically tracked by React 19's useTransition
 * <div>{isPending && <LoadingSpinner />}</div>
 * ```
 */
export function useStreaming(options: UseStreamingOptions = {}): UseStreamingReturn {
  const { onChunk, onComplete, onError } = options
  
  const [content, setContent] = React.useState('')
  
  // React 19: useTransition for automatic pending state
  const [isPending, startTransition] = React.useTransition()
  
  const readerRef = React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  
  // Store callbacks in refs to avoid recreating streaming function when callbacks change
  const onChunkRef = React.useRef(onChunk)
  const onCompleteRef = React.useRef(onComplete)
  const onErrorRef = React.useRef(onError)
  
  React.useLayoutEffect(() => {
    onChunkRef.current = onChunk
    onCompleteRef.current = onComplete
    onErrorRef.current = onError
  }, [onChunk, onComplete, onError])

  const stopStreaming = React.useCallback(() => {
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    // Note: Can't manually stop useTransition, but canceling the reader/controller will stop the operation
  }, [])

  const startStreaming = React.useCallback(
    async (stream: ReadableStream<Uint8Array>, options?: { signal?: AbortSignal }) => {
      // Stop any existing streaming
      stopStreaming()

      setContent('')

      // Create AbortController if not provided
      const controller = new AbortController()
      abortControllerRef.current = controller
      const signal = options?.signal || controller.signal

      // React 19: useTransition makes streaming non-blocking
      startTransition(async () => {
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

            setContent(fullText)
            onChunkRef.current?.(chunk)
          }

          onCompleteRef.current?.(fullText)
        } catch (err) {
          // Don't call onError for abort
          if (err instanceof Error && err.name !== 'AbortError') {
            onErrorRef.current?.(err)
          }
        } finally {
          readerRef.current = null
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null
          }
        }
      })
    },
    [stopStreaming, startTransition]
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
    isPending,
    startStreaming,
    stopStreaming,
    reset,
    // Backwards compatibility: isStreaming is now an alias for isPending
    isStreaming: isPending,
  }
}
