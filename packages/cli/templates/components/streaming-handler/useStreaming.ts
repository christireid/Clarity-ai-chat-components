/**
 * Streaming Hook
 * SSE streaming utilities with reconnection and error handling
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface StreamingOptions {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
  retryAttempts?: number
  retryDelay?: number
}

interface StreamingState {
  isStreaming: boolean
  error: Error | null
  abortController: AbortController | null
}

export function useStreaming(options: StreamingOptions) {
  const {
    url,
    method = 'POST',
    headers = {},
    body,
    onChunk,
    onComplete,
    onError,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options

  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    error: null,
    abortController: null,
  })

  const accumulatedTextRef = useRef('')
  const retryCountRef = useRef(0)

  const abort = useCallback(() => {
    if (state.abortController) {
      state.abortController.abort()
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        abortController: null,
      }))
    }
  }, [state.abortController])

  const stream = useCallback(
    async (customBody?: unknown) => {
      // Abort any existing stream
      abort()

      const controller = new AbortController()
      accumulatedTextRef.current = ''

      setState({
        isStreaming: true,
        error: null,
        abortController: controller,
      })

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(customBody ?? body),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          const chunk = decoder.decode(value, { stream: true })

          // Handle SSE format
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                continue
              }

              try {
                const parsed = JSON.parse(data)
                const content =
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.content ||
                  parsed.text ||
                  ''

                if (content) {
                  accumulatedTextRef.current += content
                  onChunk?.(content)
                }
              } catch {
                // If not JSON, treat as plain text
                if (data.trim()) {
                  accumulatedTextRef.current += data
                  onChunk?.(data)
                }
              }
            }
          }
        }

        onComplete?.(accumulatedTextRef.current)
        retryCountRef.current = 0

        setState((prev) => ({
          ...prev,
          isStreaming: false,
          abortController: null,
        }))
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Stream was intentionally aborted
          return
        }

        const err = error instanceof Error ? error : new Error(String(error))

        // Retry logic
        if (retryCountRef.current < retryAttempts) {
          retryCountRef.current++
          setTimeout(() => {
            stream(customBody)
          }, retryDelay * retryCountRef.current)
          return
        }

        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: err,
          abortController: null,
        }))

        onError?.(err)
      }
    },
    [url, method, headers, body, onChunk, onComplete, onError, retryAttempts, retryDelay, abort]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort()
    }
  }, [abort])

  return {
    stream,
    abort,
    isStreaming: state.isStreaming,
    error: state.error,
    accumulatedText: accumulatedTextRef.current,
  }
}
