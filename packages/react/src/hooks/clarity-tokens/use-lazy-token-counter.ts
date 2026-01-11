'use client'

import * as React from 'react'
import type { UseTokenCounterReturn } from './types'

/**
 * Lazy-loading token counter state
 */
export type LazyTokenCounterState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; error: Error }

/**
 * Configuration for lazy token counter
 */
export interface UseLazyTokenCounterConfig {
  /** Model ID for encoding selection */
  model?: string
  /** Debounce delay in ms (default: 150) */
  debounceMs?: number
  /** Whether to auto-load on mount (default: false) */
  autoLoad?: boolean
  /** Fallback estimation ratio (chars per token, default: 4) */
  estimationRatio?: number
}

/**
 * Extended return type with loading state
 */
export interface UseLazyTokenCounterReturn extends Omit<
  UseTokenCounterReturn,
  'modelMaxTokens' | 'encodingName'
> {
  /** Current loading state */
  loadingState: LazyTokenCounterState
  /** Trigger loading of tokenizer (call when user enables token display) */
  loadTokenizer: () => Promise<void>
  /** Whether the tokenizer is loaded and ready */
  isReady: boolean
  /** Whether currently loading */
  isLoading: boolean
}

// Module-level cache for the loaded tokenizer module
let tokenizerModule: typeof import('gpt-tokenizer') | null = null
let tokenizerLoadPromise: Promise<typeof import('gpt-tokenizer')> | null = null

/**
 * useLazyTokenCounter - Token counting with lazy-loaded encodings
 *
 * This hook implements the lazy-load pattern from assistant-ui where the
 * tokenizer (gpt-tokenizer, ~200KB) is only loaded when explicitly requested.
 * Until loaded, it uses character-based estimation.
 *
 * **Why lazy loading?**
 * Most chat UIs don't need accurate token counting until the user explicitly
 * enables "show tokens" or similar features. Lazy loading reduces the initial
 * bundle size significantly.
 *
 * @example
 * ```tsx
 * function TokenDisplay() {
 *   const [showTokens, setShowTokens] = useState(false)
 *   const {
 *     countTokens,
 *     loadTokenizer,
 *     isReady,
 *     isLoading,
 *     loadingState,
 *   } = useLazyTokenCounter({ model: 'gpt-4o' })
 *
 *   const handleEnableTokens = async () => {
 *     setShowTokens(true)
 *     await loadTokenizer() // Load gpt-tokenizer on demand
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleEnableTokens}>
 *         {isLoading ? 'Loading...' : 'Show Tokens'}
 *       </button>
 *       {showTokens && (
 *         <span>
 *           {countTokens(text)} tokens
 *           {!isReady && ' (estimated)'}
 *         </span>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 *
 * @param config - Configuration options
 * @returns Token counting utilities with loading state
 */
export function useLazyTokenCounter(
  config: UseLazyTokenCounterConfig = {}
): UseLazyTokenCounterReturn {
  const {
    model = 'gpt-4o',
    debounceMs = 150,
    autoLoad = false,
    estimationRatio = 4,
  } = config

  // State
  const [loadingState, setLoadingState] = React.useState<LazyTokenCounterState>(
    tokenizerModule ? { status: 'ready' } : { status: 'idle' }
  )
  const [tokenCount, setTokenCount] = React.useState(0)
  const [streamTokenCount, setStreamTokenCount] = React.useState(0)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Cache for token counts (shared across instances)
  const cacheRef = React.useRef<Map<string, number>>(new Map())

  /**
   * Load the tokenizer module on demand
   */
  const loadTokenizer = React.useCallback(async (): Promise<void> => {
    // Already loaded
    if (tokenizerModule) {
      setLoadingState({ status: 'ready' })
      return
    }

    // Already loading - wait for existing promise
    if (tokenizerLoadPromise) {
      setLoadingState({ status: 'loading' })
      try {
        await tokenizerLoadPromise
        setLoadingState({ status: 'ready' })
      } catch (error) {
        setLoadingState({ status: 'error', error: error as Error })
      }
      return
    }

    // Start loading
    setLoadingState({ status: 'loading' })

    try {
      // Dynamic import - this is where the magic happens
      // Webpack/Turbopack will code-split this into a separate chunk
      tokenizerLoadPromise = import('gpt-tokenizer')
      tokenizerModule = await tokenizerLoadPromise
      setLoadingState({ status: 'ready' })
    } catch (error) {
      tokenizerLoadPromise = null
      setLoadingState({ status: 'error', error: error as Error })
      throw error
    }
  }, [])

  // Auto-load if configured
  React.useEffect(() => {
    if (autoLoad && !tokenizerModule) {
      loadTokenizer()
    }
  }, [autoLoad, loadTokenizer])

  /**
   * Count tokens - uses gpt-tokenizer if loaded, otherwise estimates
   */
  const countTokens = React.useCallback(
    (text: string): number => {
      if (!text) return 0

      // Check cache first
      const cacheKey = `${model}:${text}`
      if (cacheRef.current.has(cacheKey)) {
        return cacheRef.current.get(cacheKey)!
      }

      let count: number

      if (tokenizerModule) {
        // Use accurate tokenizer
        try {
          count = tokenizerModule.encode(text, { allowedSpecial: 'all' }).length
        } catch {
          // Fallback to estimation
          count = Math.ceil(text.length / estimationRatio)
        }
      } else {
        // Estimation before tokenizer is loaded
        count = Math.ceil(text.length / estimationRatio)
      }

      // Cache result (limit cache size to prevent memory issues)
      if (cacheRef.current.size > 500) {
        // Clear oldest entries
        const entries = Array.from(cacheRef.current.entries())
        entries.slice(0, 100).forEach(([key]) => cacheRef.current.delete(key))
      }
      cacheRef.current.set(cacheKey, count)

      return count
    },
    [model, estimationRatio]
  )

  /**
   * Count tokens for chat messages
   */
  const countChatTokens = React.useCallback(
    (messages: Array<{ role: string; content: string }>): number => {
      if (!messages || messages.length === 0) return 0

      if (tokenizerModule) {
        try {
          const gptMessages = messages.map((msg) => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content,
          }))
          return tokenizerModule.encodeChat(gptMessages, model as 'gpt-4o')
            .length
        } catch {
          // Fall through to estimation
        }
      }

      // Estimation: sum content tokens + overhead per message
      return messages.reduce(
        (sum, msg) => sum + Math.ceil(msg.content.length / estimationRatio) + 4,
        3
      )
    },
    [model, estimationRatio]
  )

  /**
   * Check if text is within token limit
   */
  const isWithinLimit = React.useCallback(
    (text: string, limit: number): boolean => {
      if (!text) return true

      if (tokenizerModule) {
        return tokenizerModule.isWithinTokenLimit(text, limit) !== false
      }

      // Estimation-based check
      return Math.ceil(text.length / estimationRatio) <= limit
    },
    [estimationRatio]
  )

  /**
   * Set input with debounced token counting
   */
  const setInput = React.useCallback(
    (text: string): void => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        setTokenCount(countTokens(text))
      }, debounceMs)
    },
    [countTokens, debounceMs]
  )

  /**
   * Process streaming chunk
   */
  const onStreamChunk = React.useCallback(
    (chunk: string): void => {
      const chunkTokens = countTokens(chunk)
      setStreamTokenCount((prev) => prev + chunkTokens)
    },
    [countTokens]
  )

  /**
   * Reset stream counter
   */
  const resetStreamCount = React.useCallback((): void => {
    setStreamTokenCount(0)
  }, [])

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Derived state
  const isReady = loadingState.status === 'ready'
  const isLoading = loadingState.status === 'loading'

  return {
    countTokens,
    countChatTokens,
    tokenCount,
    setInput,
    isWithinLimit,
    streamTokenCount,
    onStreamChunk,
    resetStreamCount,
    loadingState,
    loadTokenizer,
    isReady,
    isLoading,
  }
}

/**
 * Preload the tokenizer module (useful for prefetching)
 *
 * Call this during idle time or on route change to preload
 * the tokenizer before the user needs it.
 *
 * @example
 * ```tsx
 * // In a layout component
 * useEffect(() => {
 *   // Prefetch during browser idle time
 *   if ('requestIdleCallback' in window) {
 *     requestIdleCallback(() => preloadTokenizer())
 *   }
 * }, [])
 * ```
 */
export async function preloadTokenizer(): Promise<void> {
  if (tokenizerModule) return

  if (!tokenizerLoadPromise) {
    tokenizerLoadPromise = import('gpt-tokenizer')
  }

  tokenizerModule = await tokenizerLoadPromise
}

/**
 * Check if the tokenizer is already loaded
 */
export function isTokenizerLoaded(): boolean {
  return tokenizerModule !== null
}
