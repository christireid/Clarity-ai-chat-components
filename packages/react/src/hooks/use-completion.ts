/**
 * useCompletion - Mid-Level Completion Hook
 * 
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat & Completions
 * 
 * Hook for managing text completion state with streaming support.
 * Ideal for single-turn completions, autocomplete, and text generation.
 * 
 * For chat interfaces, use top-level `useClarityChat` instead.
 * For structured output, use top-level `useClarityObject` instead.
 * 
 * **2025 Improvements**:
 * - Uses shared streaming-helpers for consistent behavior
 * - Request deduplication cache (prevents redundant API calls)
 * - Removed deprecated mountedRef pattern
 * - Better error handling with type guards
 * - Progress tracking support
 * - Cache configuration options
 * 
 * @param options - Completion configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.stream - Enable streaming (default: true)
 * @param options.onFinish - Callback when completion finishes
 * @param options.onError - Callback on error
 * @returns Completion state and controls
 * 
 * @example
 * ```tsx
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   onFinish: (prompt, completion) => console.log('Done:', completion),
 * })
 * 
 * await complete('Write a story about')
 * ```
 * 
 * @throws {Error} If API endpoint is invalid or missing
 */

'use client'

import * as React from 'react'
import { generateId } from '@clarity-chat/primitives'
import { processStream, type StreamFormat } from '../utils/streaming-helpers'

/**
 * Cache entry for deduplication
 */
interface CacheEntry {
  completion: string
  timestamp: number
  expiresAt: number
}

type CompletionRequestOptions = {
  body?: Record<string, any>
}

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
  
  /** Callback for progress updates (bytes received) */
  onProgress?: (bytes: number) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Stream format (default: 'sse') */
  streamFormat?: StreamFormat
  
  /** Custom completion ID generator */
  id?: string
  
  /** Enable request deduplication cache (default: false) */
  enableCache?: boolean
  
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTTL?: number
  
  /** Maximum cache size (default: 100 entries) */
  maxCacheSize?: number
  
  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}

/**
 * Return type for useCompletion hook (mid-level API)
 * 
 * Follows the standard hook return pattern:
 * - Data: `completion` (current completion text)
 * - State: `isLoading`, `error`, `progress`
 * - Actions: `complete`, `stop`, `abort`, `clearCache`
 */
export interface UseCompletionReturn {
  /** Current completion text (data) */
  completion: string
  
  /** Set completion text directly */
  setCompletion: React.Dispatch<React.SetStateAction<string>>
  
  /** Complete the given prompt (action) */
  complete: (prompt: string, options?: { body?: Record<string, any> }) => Promise<string | null>
  
  /** Stop the current completion (action) */
  stop: () => void
  
  /** Whether currently loading (state) */
  isLoading: boolean
  
  /** Current error (state) */
  error: Error | undefined
  
  /** Abort controller for current request (action) */
  abort: () => void

  /** Clear the deduplication cache (action) */
  clearCache: () => void

  /** Get cache statistics (utility) */
  getCacheStats: () => { enabled: boolean; size: number; maxSize: number }
}

/**
 * LRU Cache for request deduplication
 */
class CompletionCache {
  private cache = new Map<string, CacheEntry>()
  private maxSize: number
  private ttl: number

  constructor(maxSize: number = 100, ttl: number = 300000) {
    this.maxSize = maxSize
    this.ttl = ttl
  }

  private hashKey(prompt: string, body?: Record<string, any>): string {
    return `${prompt}:${JSON.stringify(body || {})}`
  }

  get(prompt: string, body?: Record<string, any>): string | null {
    const key = this.hashKey(prompt, body)
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    // Move to end (LRU)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.completion
  }

  set(prompt: string, completion: string, body?: Record<string, any>): void {
    const key = this.hashKey(prompt, body)
    const now = Date.now()

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      completion,
      timestamp: now,
      expiresAt: now + this.ttl,
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
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
 * 
 * @example
 * ```tsx
 * // With caching and progress tracking
 * const { completion, complete, isLoading } = useCompletion({
 *   api: '/api/completion',
 *   enableCache: true,
 *   cacheTTL: 600000, // 10 minutes
 *   onProgress: (bytes) => setProgress(bytes),
 *   streamFormat: 'sse',
 * })
 * 
 * // Repeated calls with same prompt use cache
 * await complete('What is the capital of France?') // API call
 * await complete('What is the capital of France?') // From cache (instant)
 * ```
 */
export function useCompletion(options: UseCompletionOptions = {}): UseCompletionReturn {
  // Validate API endpoint
  const apiOption = options.api || '/api/completion'
  if (!apiOption || typeof apiOption !== 'string' || apiOption.trim().length === 0) {
    throw new Error(
      'useCompletion: "api" option is required.\n' +
      'Please provide a valid API endpoint URL.\n\n' +
      'Example:\n' +
      '  const { completion, complete } = useCompletion({ api: "/api/completion" })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/completions'
    )
  }

  const {
    api = apiOption,
    initialCompletion = '',
    body,
    headers = {},
    credentials,
    fetch: customFetch = fetch,
    onResponse,
    onFinish,
    onError,
    onProgress,
    stream = true,
    streamFormat = 'sse',
    id: generateCompletionId = () => generateId(),
    enableCache = false,
    cacheTTL = 300000, // 5 minutes
    maxCacheSize = 100,
    experimental,
  } = options

  const [completion, setCompletion] = React.useState(initialCompletion)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | undefined>()
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const cacheRef = React.useRef<CompletionCache | null>(null)

  // Initialize cache if enabled
  if (enableCache && !cacheRef.current) {
    cacheRef.current = new CompletionCache(maxCacheSize, cacheTTL)
  }

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
    setIsLoading(false)
  }, [abort])

  /**
   * Complete a prompt with optional caching
   */
    const complete = React.useCallback(
      async (
        prompt: string,
        options: CompletionRequestOptions = {}
      ): Promise<string | null> => {
        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt) {
          const emptyError = new Error('Prompt cannot be empty')
          onError?.(emptyError)
          return null
        }

        if (enableCache && cacheRef.current) {
          const requestBody = { ...body, ...options.body }
          const cached = cacheRef.current.get(trimmedPrompt, requestBody)
          if (cached) {
            setCompletion(cached)
            await onFinish?.(trimmedPrompt, cached)
            return cached
          }
        }

        setIsLoading(true)
        setError(undefined)
        setCompletion('')

        abortControllerRef.current = new AbortController()

        try {
          const requestBody: Record<string, any> = {
            ...body,
            ...options.body,
            prompt: trimmedPrompt,
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
            const errorText = await response.text().catch(() => '')
            throw new Error(
              `HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
            )
          }

          if (!stream || !response.body) {
            const result = await response.json()
            const completionText = result.completion || result.text || result.content || ''

            setCompletion(completionText)
            setIsLoading(false)
            await onFinish?.(trimmedPrompt, completionText)

            if (enableCache && cacheRef.current) {
              cacheRef.current.set(trimmedPrompt, completionText, requestBody)
            }

            return completionText
          }

          const result = await processStream(response.body, {
            format: streamFormat,
            signal: abortControllerRef.current.signal,
            onChunk: (chunk) => {
              setCompletion((prev) => prev + chunk)
            },
            onProgress,
            onError,
          })

          setCompletion(result.content)
          setIsLoading(false)
          await onFinish?.(trimmedPrompt, result.content)

          if (enableCache && cacheRef.current) {
            cacheRef.current.set(trimmedPrompt, result.content, requestBody)
          }

          return result.content
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            setIsLoading(false)
            return null
          }

          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          onError?.(error)
          setIsLoading(false)

          throw error
        } finally {
          abortControllerRef.current = null
        }
      },
      [
        api,
        body,
        credentials,
        customFetch,
        enableCache,
        headers,
        onError,
        onFinish,
        onProgress,
        onResponse,
        stream,
        streamFormat,
      ]
    )

  /**
   * Clear cache manually
   */
  const clearCache = React.useCallback(() => {
    if (cacheRef.current) {
      cacheRef.current.clear()
    }
  }, [])

  /**
   * Get cache statistics
   */
  const getCacheStats = React.useCallback(() => {
    if (!cacheRef.current) {
      return { enabled: false, size: 0, maxSize: 0 }
    }
    return {
      enabled: true,
      size: cacheRef.current.size(),
      maxSize: maxCacheSize,
    }
  }, [maxCacheSize])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abort()
      // Clean up cache
      if (cacheRef.current) {
        cacheRef.current.clear()
      }
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
    clearCache,
    getCacheStats,
  }
}
