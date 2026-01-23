/**
 * useTieredCache - React hook for tiered caching
 *
 * Provides a React-friendly interface to the TieredCache system
 * with automatic cleanup and memoized callbacks.
 *
 * @module use-tiered-cache
 */

import {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useTransition,
  useOptimistic,
} from 'react'
import { TieredCache } from '../cache/tiered-cache'
import type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats,
  PrefetchItem,
} from '../cache/tiered-cache'
import type { CacheContext } from '../caching/advanced-semantic-cache'

/**
 * Hook configuration
 */
export interface UseTieredCacheConfig extends TieredCacheConfig {
  /** Enable automatic stats tracking (triggers re-render on stats change) */
  trackStats?: boolean
}

/**
 * Optimistic entry state for React 19
 */
export interface OptimisticEntry {
  prompt: string
  response: string
  status: 'pending' | 'confirmed' | 'failed'
}

/**
 * Hook return type
 */
export interface UseTieredCacheReturn {
  /**
   * Look up a prompt across all cache tiers
   *
   * @param prompt - The prompt to look up
   * @param context - Optional context for semantic matching
   * @returns Cache result with tier information
   */
  get: (prompt: string, context?: CacheContext) => Promise<TieredCacheResult>

  /**
   * Store a prompt-response pair in all cache tiers
   *
   * @param prompt - The prompt
   * @param response - The response to cache
   * @param metadata - Optional metadata
   */
  set: (
    prompt: string,
    response: string,
    metadata?: Record<string, unknown>
  ) => Promise<void>

  /**
   * Invalidate a specific prompt from the cache
   *
   * @param prompt - The prompt to invalidate
   */
  invalidate: (prompt: string) => Promise<void>

  /**
   * Prefetch multiple items into the cache
   *
   * @param items - Array of key-value pairs to prefetch
   */
  prefetch: (items: PrefetchItem[]) => Promise<void>

  /**
   * Clear all cache tiers
   */
  clear: () => void

  /**
   * Get current cache statistics
   */
  getStats: () => CacheStats

  /**
   * Current cache statistics (reactive, only when trackStats=true)
   */
  stats: CacheStats | null

  /**
   * Whether the cache is ready
   */
  isReady: boolean

  /**
   * React 19: Whether a cache operation is in a transition
   */
  isPending: boolean

  /**
   * React 19: Optimistic entries that haven't been confirmed yet
   */
  optimisticEntries: OptimisticEntry[]

  /**
   * React 19: Set cache entry with optimistic update (instant UI feedback)
   */
  optimisticSet: (
    prompt: string,
    response: string,
    metadata?: Record<string, unknown>
  ) => void
}

/**
 * React hook for using the tiered cache system
 *
 * @param config - Cache configuration for exact, smart, and semantic tiers
 * @returns Cache interface with get, set, invalidate, prefetch, and clear functions
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const cache = useTieredCache({
 *     exact: { maxSize: 1000, ttl: 3600000 },
 *     smart: { maxSize: 500, ttl: 3600000 },
 *     semantic: { maxSize: 200, similarityThreshold: 0.92 }
 *   })
 *
 *   const handleSubmit = async (prompt: string) => {
 *     // Check cache first
 *     const cached = await cache.get(prompt)
 *     if (cached.hit) {
 *       return cached.data
 *     }
 *
 *     // Fetch from API
 *     const response = await fetchAI(prompt)
 *
 *     // Cache for future requests
 *     await cache.set(prompt, response)
 *     return response
 *   }
 *
 *   return <ChatUI onSubmit={handleSubmit} stats={cache.stats} />
 * }
 * ```
 */
export function useTieredCache(
  config: UseTieredCacheConfig
): UseTieredCacheReturn {
  const { trackStats = false, ...cacheConfig } = config

  // React 19: useTransition for non-blocking cache operations
  const [isPending, startTransition] = useTransition()

  // Persist cache instance across renders
  const cacheRef = useRef<TieredCache | null>(null)

  // Lazy initialization
  if (cacheRef.current === null) {
    cacheRef.current = new TieredCache(cacheConfig)
  }

  // Track stats reactively if enabled
  const [stats, setStats] = useState<CacheStats | null>(null)

  // React 19: useOptimistic for instant UI feedback on cache operations
  type CacheEntryAction = {
    type: 'add' | 'confirm' | 'fail' | 'remove'
    prompt: string
    response?: string
  }
  const [optimisticEntries, updateOptimistic] = useOptimistic<
    OptimisticEntry[],
    CacheEntryAction
  >([], (state, action) => {
    switch (action.type) {
      case 'add':
        return [
          ...state,
          {
            prompt: action.prompt,
            response: action.response ?? '',
            status: 'pending' as const,
          },
        ]
      case 'confirm':
        return state.map((e) =>
          e.prompt === action.prompt
            ? { ...e, status: 'confirmed' as const }
            : e
        )
      case 'fail':
        return state.map((e) =>
          e.prompt === action.prompt ? { ...e, status: 'failed' as const } : e
        )
      case 'remove':
        return state.filter((e) => e.prompt !== action.prompt)
      default:
        return state
    }
  })

  // Initialize cache in useEffect (not during render!)
  useEffect(() => {
    // Initialize cache
    if (!cacheRef.current) {
      cacheRef.current = new TieredCache(cacheConfig)
    }

    // Cleanup on unmount or config change
    return () => {
      cacheRef.current?.clear()
      cacheRef.current = null
    }
  }, [cacheConfig])

  // Initialize stats in effect to avoid setState during render
  useEffect(() => {
    if (trackStats && cacheRef.current) {
      setStats(cacheRef.current.getStats())
    }
  }, [trackStats])

  // Update stats helper
  const updateStats = useCallback(() => {
    if (trackStats && cacheRef.current) {
      setStats(cacheRef.current.getStats())
    }
  }, [trackStats])

  // Memoized get function
  const get = useCallback(
    async (
      prompt: string,
      context?: CacheContext
    ): Promise<TieredCacheResult> => {
      if (!cacheRef.current) {
        return { hit: false }
      }
      const result = await cacheRef.current.get(prompt, context)
      updateStats()
      return result
    },
    [updateStats]
  )

  // Memoized set function
  const set = useCallback(
    async (
      prompt: string,
      response: string,
      metadata?: Record<string, unknown>
    ): Promise<void> => {
      if (!cacheRef.current) return
      await cacheRef.current.set(prompt, response, metadata)
      updateStats()
    },
    [updateStats]
  )

  // Memoized invalidate function
  const invalidate = useCallback(
    async (prompt: string): Promise<void> => {
      if (!cacheRef.current) return
      await cacheRef.current.invalidate(prompt)
      updateStats()
    },
    [updateStats]
  )

  // Memoized prefetch function
  const prefetch = useCallback(
    async (items: PrefetchItem[]): Promise<void> => {
      if (!cacheRef.current) return
      await cacheRef.current.prefetch(items)
      updateStats()
    },
    [updateStats]
  )

  // Memoized clear function
  const clear = useCallback((): void => {
    if (!cacheRef.current) return
    cacheRef.current.clear()
    updateStats()
  }, [updateStats])

  // Memoized getStats function
  const getStats = useCallback((): CacheStats => {
    if (!cacheRef.current) {
      return {
        hitRate: 0,
        totalHits: 0,
        totalMisses: 0,
        exactSize: 0,
        smartSize: 0,
        semanticSize: 0,
        tierStats: {
          exact: { hits: 0, misses: 0, size: 0 },
          smart: { hits: 0, misses: 0, size: 0 },
          semantic: { hits: 0, misses: 0, size: 0 },
        },
      }
    }
    return cacheRef.current.getStats()
  }, [])

  // React 19: Optimistic set with instant UI feedback
  const optimisticSet = useCallback(
    (
      prompt: string,
      response: string,
      metadata?: Record<string, unknown>
    ): void => {
      if (!cacheRef.current) return

      // Optimistically show the entry as pending
      updateOptimistic({ type: 'add', prompt, response })

      // Perform actual cache operation in a transition
      startTransition(async () => {
        try {
          await cacheRef.current?.set(prompt, response, metadata)
          updateOptimistic({ type: 'confirm', prompt })
          updateStats()
          // Remove from optimistic state after a short delay
          setTimeout(() => {
            updateOptimistic({ type: 'remove', prompt })
          }, 1000)
        } catch {
          updateOptimistic({ type: 'fail', prompt })
        }
      })
    },
    [updateOptimistic, startTransition, updateStats]
  )

  // Memoized return value
  return useMemo(
    () => ({
      get,
      set,
      invalidate,
      prefetch,
      clear,
      getStats,
      stats,
      isReady: cacheRef.current !== null,
      // React 19 features
      isPending,
      optimisticEntries,
      optimisticSet,
    }),
    [
      get,
      set,
      invalidate,
      prefetch,
      clear,
      getStats,
      stats,
      isPending,
      optimisticEntries,
      optimisticSet,
    ]
  )
}
