/**
 * useCompletion hook - Vercel AI SDK compatible
 * 
 * Hook for managing text completion state with streaming support.
 * Ideal for single-turn completions, autocomplete, and text generation.
 */

import * as React from 'react'
import { generateId } from '@clarity-chat/primitives'

/**
 * Options for useCompletion hook
 */
export interface UseCompletionOptions {
  /** API endpoint URL */
  api?: string
  
  /** Initial completion text */
  initialCompletion?: string
  
  /** Additional body data */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when completion finishes */
  onFinish?: (prompt: string, completion: string) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Custom completion ID generator */
  id?: string
  
  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}

/**
 * Return type for useCompletion hook
 */
export interface UseCompletionReturn {
  /** Current completion text */
  completion: string
  
  /** Set completion text directly */
  setCompletion: React.Dispatch<React.SetStateAction<string>>
  
  /** Complete the given prompt */
  complete: (prompt: string, options?: { body?: Record<string, any> }) => Promise<string | null>
  
  /** Stop the current completion */
  stop: () => void
  
  /** Whether currently loading */
  isLoading: boolean
  
  /** Current error */
  error: Error | undefined
  
  /** Abort controller for current request */
  abort: () => void
}

/**
 * useCompletion hook for text completions
 * 
 * @example
 * ```tsx
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   onFinish: (prompt, completion) => {
 *     console.log('Completed:', completion)
 *   },
 * })
 * 
 * // Complete a prompt
 * await complete('What is the capital of France?')
 * ```
 */
export function useCompletion(options: UseCompletionOptions = {}): UseCompletionReturn {
  const {
    api = '/api/completion',
    initialCompletion = '',
    body,
    headers = {},
    credentials,
    fetch: customFetch = fetch,
    onResponse,
    onFinish,
    onError,
    stream = true,
    id: generateCompletionId = () => generateId(),
    experimental,
  } = options

  const [completion, setCompletion] = React.useState(initialCompletion)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | undefined>()
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const mountedRef = React.useRef(true)

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  /**
   * Abort current request
   */
  const abort = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  /**
   * Stop completion
   */
  const stop = React.useCallback(() => {
    abort()
    if (mountedRef.current) {
      setIsLoading(false)
    }
  }, [abort])

  /**
   * Complete a prompt
   */
  const complete = React.useCallback(
    async (
      prompt: string,
      options?: { body?: Record<string, any> }
    ): Promise<string | null> => {
      if (!prompt.trim()) return null

      setIsLoading(true)
      setError(undefined)
      setCompletion('')

      abortControllerRef.current = new AbortController()

      try {
        const requestBody: Record<string, any> = {
          ...body,
          ...options?.body,
          prompt,
        }

        const response = await customFetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          credentials,
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        })

        await onResponse?.(response)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (!stream || !response.body) {
          // Non-streaming response
          const result = await response.json()
          const completionText = result.completion || result.text || result.content || ''
          
          if (mountedRef.current) {
            setCompletion(completionText)
            setIsLoading(false)
            await onFinish?.(prompt, completionText)
          }
          
          return completionText
        }

        // Streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (!line.trim()) continue

            // Handle SSE format
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }

              try {
                const parsed = JSON.parse(data)
                
                // Handle different streaming formats
                if (parsed.choices?.[0]?.text) {
                  // OpenAI completion format
                  accumulatedText += parsed.choices[0].text
                } else if (parsed.completion) {
                  accumulatedText += parsed.completion
                } else if (parsed.text) {
                  accumulatedText += parsed.text
                } else if (parsed.content) {
                  accumulatedText += parsed.content
                } else if (parsed.delta) {
                  accumulatedText += parsed.delta
                } else if (typeof parsed === 'string') {
                  accumulatedText += parsed
                }

                if (mountedRef.current) {
                  setCompletion(accumulatedText)
                }
              } catch {
                // Non-JSON line, treat as plain text
                accumulatedText += data
                if (mountedRef.current) {
                  setCompletion(accumulatedText)
                }
              }
            } else if (line.trim()) {
              // Plain text streaming
              accumulatedText += line
              if (mountedRef.current) {
                setCompletion(accumulatedText)
              }
            }
          }
        }

        // Finalize
        if (mountedRef.current) {
          setIsLoading(false)
          await onFinish?.(prompt, accumulatedText)
        }

        return accumulatedText
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return null
        }

        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)

        if (mountedRef.current) {
          setIsLoading(false)
        }

        throw error
      } finally {
        if (mountedRef.current) {
          abortControllerRef.current = null
        }
      }
    },
    [
      api,
      body,
      headers,
      credentials,
      customFetch,
      stream,
      onResponse,
      onFinish,
      onError,
    ]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abort()
    }
  }, [abort])

  return {
    completion,
    setCompletion,
    complete,
    stop,
    isLoading,
    error,
    abort,
  }
}
