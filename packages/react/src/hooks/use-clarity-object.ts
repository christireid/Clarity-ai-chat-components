/**
 * useClarityObject - Structured object output hook
 * 
 * Hook for generating structured, typed objects from AI models.
 * Supports both streaming and non-streaming object generation.
 * 
 * @example
 * ```tsx
 * interface Product {
 *   name: string
 *   price: number
 *   description: string
 * }
 * 
 * const { object, isLoading, run } = useClarityObject<Product>({
 *   api: '/api/generate-product',
 * })
 * 
 * await run({ query: 'laptop' })
 * // object will be Product | null
 * ```
 */

import * as React from 'react'
import { processStream, type StreamFormat, type StreamOptions } from '../utils/streaming-helpers'

/**
 * Options for useClarityObject hook
 */
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
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Callback when object is generated */
  onFinish?: (object: any, input: TInput) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback for progress updates during streaming */
  onProgress?: (partialObject: any) => void
}

/**
 * Return type for useClarityObject hook
 */
export interface UseClarityObjectReturn<TObject, TInput = any> {
  /** Current input value */
  input: TInput | undefined
  
  /** Set input value */
  setInput: (value: TInput) => void
  
  /** Generated object (null until first run completes) */
  object: TObject | null
  
  /** Whether request is in progress */
  isLoading: boolean
  
  /** Error if request failed */
  error: Error | null
  
  /** Run generation with optional input override */
  run: (overrideInput?: TInput) => Promise<void>
  
  /** Reset state (clear object and error) */
  reset: () => void
}

/**
 * Parse JSON from stream chunks or response
 */
function parseJSONChunk(chunk: string): any {
  try {
    // Try to parse as complete JSON
    return JSON.parse(chunk)
  } catch {
    // If not valid JSON, try to extract JSON from text
    const jsonMatch = chunk.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        return null
      }
    }
    return null
  }
}

/**
 * Merge partial objects (for streaming)
 */
function mergePartialObjects(partial: any, existing: any): any {
  if (!existing) return partial
  if (!partial) return existing
  
  // Deep merge objects
  if (typeof partial === 'object' && typeof existing === 'object' && !Array.isArray(partial) && !Array.isArray(existing)) {
    return { ...existing, ...partial }
  }
  
  // For arrays, replace if partial is array, otherwise keep existing
  if (Array.isArray(partial)) {
    return partial
  }
  
  return partial
}

/**
 * useClarityObject - Generate structured objects from AI
 * 
 * @param options Configuration options
 * @returns Object generation state and controls
 */
export function useClarityObject<TObject = any, TInput = any>(
  options: UseClarityObjectOptions<TInput>
): UseClarityObjectReturn<TObject, TInput> {
  const {
    api,
    initialInput,
    headers,
    body,
    stream = false,
    streamFormat = 'sse',
    fetch: customFetch = fetch,
    onFinish,
    onError,
    onProgress,
  } = options

  const [input, setInput] = React.useState<TInput | undefined>(initialInput)
  const [object, setObject] = React.useState<TObject | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const abortControllerRef = React.useRef<AbortController | null>(null)

  const run = React.useCallback(
    async (overrideInput?: TInput) => {
      const currentInput = overrideInput ?? input
      
      if (!currentInput) {
        setError(new Error('Input is required'))
        return
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setIsLoading(true)
      setError(null)

      try {
        const requestBody = {
          ...body,
          input: currentInput,
        }

        const response = await customFetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        if (stream && response.body) {
          // Handle streaming response
          let accumulatedText = ''
          let partialObject: any = null

          const streamOptions: StreamOptions = {
            format: streamFormat,
            signal: abortControllerRef.current.signal,
            onChunk: (chunk: string) => {
              accumulatedText += chunk
              
              // Try to parse JSON from accumulated text
              const parsed = parseJSONChunk(accumulatedText)
              if (parsed) {
                partialObject = mergePartialObjects(parsed, partialObject)
                setObject(partialObject as TObject)
                
                // Call progress callback
                if (onProgress) {
                  onProgress(partialObject)
                }
              }
            },
            onComplete: async (fullText: string) => {
              // Final parse attempt
              const finalObject = parseJSONChunk(fullText) || partialObject
              if (finalObject) {
                setObject(finalObject as TObject)
                
                if (onFinish) {
                  await onFinish(finalObject, currentInput)
                }
              }
            },
            onError: (err: Error) => {
              setError(err)
              setIsLoading(false)
              if (onError) {
                onError(err)
              }
            },
          }

          await processStream(response.body, streamOptions)
        } else {
          // Handle non-streaming response
          const data = await response.json()
          
          // Handle different response formats
          const resultObject = data.object ?? data.data ?? data
          
          setObject(resultObject as TObject)
          
          if (onFinish) {
            await onFinish(resultObject, currentInput)
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't set error
          return
        }
        
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        setError(error)
        
        if (onError) {
          onError(error)
        }
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [api, input, headers, body, stream, streamFormat, customFetch, onFinish, onError, onProgress]
  )

  const reset = React.useCallback(() => {
    setObject(null)
    setError(null)
    setIsLoading(false)
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
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
