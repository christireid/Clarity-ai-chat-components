/**
 * useClarityObject - Top-Level Structured Output Hook
 * 
 * Hook for generating structured objects from AI models with type safety.
 * Supports both streaming and non-streaming object generation.
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Tools & Agents
 * 
 * This is the recommended way to generate type-safe structured data from AI.
 * For tool calling, use mid-level `useClarityChatWithTools` instead.
 * 
 * @example
 * ```tsx
 * interface Product {
 *   name: string
 *   price: number
 *   description: string
 * }
 * 
 * const { object, run, isLoading } = useClarityObject<Product>({
 *   api: '/api/generate-object',
 *   initialInput: { query: 'laptops' },
 * })
 * 
 * await run({ query: 'gaming laptops' })
 * ```
 * 
 * @example
 * ```tsx
 * // With streaming
 * const { object, run, isLoading, progress } = useClarityObject<Product>({
 *   api: '/api/generate-object',
 *   stream: true,
 *   onProgress: (chunk) => console.log('Progress:', chunk),
 * })
 * ```
 */

import * as React from 'react'
import { processStream, type StreamFormat } from '../utils/streaming-helpers'

export interface UseClarityObjectOptions<TInput = any> {
  /** API endpoint URL */
  api: string
  
  /** Initial input value */
  initialInput?: TInput
  
  /** Custom headers */
  headers?: HeadersInit
  
  /** Additional body data */
  body?: Record<string, any>
  
  /** Enable streaming (default: false) */
  stream?: boolean
  
  /** Stream format (default: 'sse') */
  streamFormat?: StreamFormat
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Callback when object is generated */
  onFinish?: (object: any) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback for progress updates */
  onProgress?: (chunk: string) => void
}

/**
 * Return type for useClarityObject hook (top-level API)
 * 
 * Follows the standard hook return pattern:
 * - Data: `object`, `input` (current state)
 * - State: `isLoading`, `error`
 * - Actions: `run`, `reset`, `setInput`
 * 
 * This hook provides type-safe structured object generation from AI models.
 */
export interface UseClarityObjectReturn<TObject, TInput = any> {
  /** Current input value (data) */
  input: TInput
  
  /** Set input value (action) */
  setInput: (value: TInput) => void
  
  /** Generated object, null if not yet generated (data) */
  object: TObject | null
  
  /** Loading state (state) */
  isLoading: boolean
  
  /** Error state (state) */
  error: Error | null
  
  /** Run generation with optional input override (action) */
  run: (overrideInput?: TInput) => Promise<void>
  
  /** Reset state (action) */
  reset: () => void
}

/**
 * Parse JSON from stream chunks
 */
function parseJSONChunks(chunks: string[]): any | null {
  try {
    // Try to parse complete JSON first
    const fullText = chunks.join('')
    const jsonMatch = fullText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Try incremental parsing
    for (let i = chunks.length; i > 0; i--) {
      const attempt = chunks.slice(0, i).join('')
      const match = attempt.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          return JSON.parse(match[0])
        } catch {
          continue
        }
      }
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Structured object generation hook
 */
export function useClarityObject<TObject = any, TInput = any>(
  options: UseClarityObjectOptions<TInput> = {}
): UseClarityObjectReturn<TObject, TInput> {
  // Validate API endpoint
  if (!options.api || typeof options.api !== 'string' || options.api.trim().length === 0) {
    throw new Error(
      'useClarityObject: "api" option is required.\n' +
      'Please provide your API endpoint URL.\n\n' +
      'Example:\n' +
      '  const { object, run } = useClarityObject<Product>({ api: "/api/generate-object" })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/getting-started'
    )
  }

  const {
    api,
    initialInput,
    headers,
    body,
    stream = false,
    streamFormat = 'sse',
    credentials = 'same-origin',
    fetch: customFetch = fetch,
    onFinish,
    onError,
    onProgress,
  } = options

  const [input, setInput] = React.useState<TInput>(initialInput as TInput)
  const [object, setObject] = React.useState<TObject | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const reset = React.useCallback(() => {
    setObject(null)
    setError(null)
    setIsLoading(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const run = React.useCallback(
    async (overrideInput?: TInput) => {
      const inputToUse = overrideInput ?? input
      
      if (!inputToUse) {
        setError(new Error('Input is required'))
        return
      }

      // Reset state
      setError(null)
      setIsLoading(true)
      
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const requestBody = {
          ...body,
          input: inputToUse,
        }

        const response = await customFetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          credentials,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        if (stream && response.body) {
          // Streaming mode: accumulate chunks and parse JSON
          const chunks: string[] = []
          
          await processStream(
            response.body,
            streamFormat,
            {
              onChunk: (chunk: string) => {
                chunks.push(chunk)
                onProgress?.(chunk)
                
                // Try to parse JSON incrementally
                const parsed = parseJSONChunks(chunks)
                if (parsed) {
                  setObject(parsed as TObject)
                }
              },
              onComplete: () => {
                // Final parse attempt
                const parsed = parseJSONChunks(chunks)
                if (parsed) {
                  setObject(parsed as TObject)
                  onFinish?.(parsed)
                } else {
                  setError(new Error('Failed to parse JSON from stream'))
                }
                setIsLoading(false)
              },
              onError: (err) => {
                setError(err)
                setIsLoading(false)
                onError?.(err)
              },
            },
            controller.signal
          )
        } else {
          // Non-streaming mode: parse JSON directly
          const data = await response.json()
          
          if (data.object) {
            setObject(data.object as TObject)
          } else if (typeof data === 'object') {
            setObject(data as TObject)
          } else {
            throw new Error('Invalid response format: expected object')
          }
          
          setIsLoading(false)
          onFinish?.(data.object || data)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Request was cancelled, don't set error
          return
        }
        
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setIsLoading(false)
        onError?.(error)
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      }
    },
    [api, input, body, headers, credentials, stream, streamFormat, customFetch, onFinish, onError, onProgress]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    input,
    setInput,
    object,
    isLoading,
    error,
    run,
    reset,
  }
}
