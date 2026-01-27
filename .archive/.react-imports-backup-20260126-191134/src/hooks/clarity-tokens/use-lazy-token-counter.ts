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
  /** Enable caching in AccurateTokenCounter (default: true) */
  enableCaching?: boolean
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

// Module-level cache for the loaded AccurateTokenCounter instance
// This ensures we share a single instance across all hook usages
let sharedTokenCounter:
  | import('@clarity-chat/token-optimization').AccurateTokenCounter
  | null = null
let tokenCounterLoadPromise: Promise<
  import('@clarity-chat/token-optimization').AccurateTokenCounter
> | null = null
let currentModel: string | null = null

/**
 * useLazyTokenCounter - Token counting with lazy-loaded encodings
 *
 * This hook implements the lazy-load pattern where the token counter
 * (AccurateTokenCounter from @clarity-chat/token-optimization) is only loaded
 * when explicitly requested. Until loaded, it uses character-based estimation.
 *
 * **Why lazy loading?**
 * Most chat UIs don't need accurate token counting until the user explicitly
 * enables "show tokens" or similar features. Lazy loading reduces the initial
 * bundle size significantly.
 *
 * **Integration with token-optimization:**
 * This hook wraps AccurateTokenCounter internally, providing:
 * - High-performance token counting using gpt-tokenizer
 * - Built-in caching for repeated counts
 * - Support for OpenAI, Anthropic Claude, and Google Gemini models
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
 *     await loadTokenizer() // Load AccurateTokenCounter on demand
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
    enableCaching = true,
  } = config

  // State
  const [loadingState, setLoadingState] = React.useState<LazyTokenCounterState>(
    sharedTokenCounter && currentModel === model
      ? { status: 'ready' }
      : { status: 'idle' }
  )
  const [tokenCount, setTokenCount] = React.useState(0)
  const [streamTokenCount, setStreamTokenCount] = React.useState(0)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Local estimation cache for pre-load usage
  const estimationCacheRef = React.useRef<Map<string, number>>(new Map())

  /**
   * Load the AccurateTokenCounter on demand
   */
  const loadTokenizer = React.useCallback(async (): Promise<void> => {
    // Already loaded with same model
    if (sharedTokenCounter && currentModel === model) {
      setLoadingState({ status: 'ready' })
      return
    }

    // Model changed - need to reload
    if (sharedTokenCounter && currentModel !== model) {
      sharedTokenCounter.destroy()
      sharedTokenCounter = null
      tokenCounterLoadPromise = null
    }

    // Already loading - wait for existing promise
    if (tokenCounterLoadPromise) {
      setLoadingState({ status: 'loading' })
      try {
        await tokenCounterLoadPromise
        setLoadingState({ status: 'ready' })
      } catch (error) {
        setLoadingState({ status: 'error', error: error as Error })
      }
      return
    }

    // Start loading
    setLoadingState({ status: 'loading' })

    try {
      // Dynamic import - this enables code-splitting
      // The AccurateTokenCounter from @clarity-chat/token-optimization
      // uses gpt-tokenizer internally (pure JS, ~200KB)
      tokenCounterLoadPromise = (async () => {
        const { AccurateTokenCounter } =
          await import('@clarity-chat/token-optimization')
        const counter = new AccurateTokenCounter({
          model,
          enableCaching,
          cacheSize: 500,
        })
        return counter
      })()

      sharedTokenCounter = await tokenCounterLoadPromise
      currentModel = model
      setLoadingState({ status: 'ready' })
    } catch (error) {
      tokenCounterLoadPromise = null
      setLoadingState({ status: 'error', error: error as Error })
      throw error
    }
  }, [model, enableCaching])

  // Auto-load if configured
  React.useEffect(() => {
    if (autoLoad && (!sharedTokenCounter || currentModel !== model)) {
      loadTokenizer()
    }
  }, [autoLoad, loadTokenizer, model])

  /**
   * Count tokens - uses AccurateTokenCounter if loaded, otherwise estimates
   */
  const countTokens = React.useCallback(
    (text: string): number => {
      if (!text) return 0

      // If AccurateTokenCounter is loaded, use it
      if (sharedTokenCounter && currentModel === model) {
        return sharedTokenCounter.count(text)
      }

      // Estimation before tokenizer is loaded
      // Use local cache to avoid repeated estimation
      const cacheKey = `${model}:${text}`
      if (estimationCacheRef.current.has(cacheKey)) {
        return estimationCacheRef.current.get(cacheKey)!
      }

      const count = Math.ceil(text.length / estimationRatio)

      // Cache result (limit cache size to prevent memory issues)
      if (estimationCacheRef.current.size > 500) {
        // Clear oldest entries
        const entries = Array.from(estimationCacheRef.current.entries())
        entries
          .slice(0, 100)
          .forEach(([key]) => estimationCacheRef.current.delete(key))
      }
      estimationCacheRef.current.set(cacheKey, count)

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

      // If AccurateTokenCounter is loaded, use it
      if (sharedTokenCounter && currentModel === model) {
        return sharedTokenCounter.countChat(
          messages.map((msg) => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content,
          }))
        )
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

      // If AccurateTokenCounter is loaded, use its optimized method
      if (sharedTokenCounter && currentModel === model) {
        return sharedTokenCounter.isWithinLimit(text, limit)
      }

      // Estimation-based check
      return Math.ceil(text.length / estimationRatio) <= limit
    },
    [model, estimationRatio]
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
 * @param model - Model ID for the tokenizer (default: 'gpt-4o')
 *
 * @example
 * ```tsx
 * // In a layout component
 * useEffect(() => {
 *   // Prefetch during browser idle time
 *   if ('requestIdleCallback' in window) {
 *     requestIdleCallback(() => preloadTokenizer('gpt-4o'))
 *   }
 * }, [])
 * ```
 */
export async function preloadTokenizer(
  model: string = 'gpt-4o'
): Promise<void> {
  if (sharedTokenCounter && currentModel === model) return

  if (!tokenCounterLoadPromise || currentModel !== model) {
    // Clean up existing counter if model changed
    if (sharedTokenCounter && currentModel !== model) {
      sharedTokenCounter.destroy()
      sharedTokenCounter = null
    }

    tokenCounterLoadPromise = (async () => {
      const { AccurateTokenCounter } =
        await import('@clarity-chat/token-optimization')
      const counter = new AccurateTokenCounter({
        model,
        enableCaching: true,
        cacheSize: 500,
      })
      return counter
    })()
  }

  sharedTokenCounter = await tokenCounterLoadPromise
  currentModel = model
}

/**
 * Check if the tokenizer is already loaded
 *
 * @param model - Optional model to check for specific model loading
 */
export function isTokenizerLoaded(model?: string): boolean {
  if (model) {
    return sharedTokenCounter !== null && currentModel === model
  }
  return sharedTokenCounter !== null
}

/**
 * Get the currently loaded model name (if any)
 */
export function getLoadedModel(): string | null {
  return currentModel
}

/**
 * Destroy the shared token counter and free resources
 * Useful for cleanup in tests or when switching between apps
 */
export function destroySharedTokenCounter(): void {
  if (sharedTokenCounter) {
    sharedTokenCounter.destroy()
    sharedTokenCounter = null
    tokenCounterLoadPromise = null
    currentModel = null
  }
}
