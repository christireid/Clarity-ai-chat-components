import { logger } from '@clarity-chat/utils/logger';
/**
 * Token Optimization Hook (Legacy)
 *
 * @deprecated Use `useTokenOptimizationEnhanced` instead. This hook is maintained
 * for backward compatibility only. The enhanced hook includes all features from
 * this hook plus TOON encoding, accurate tokenization, prompt caching, and more.
 *
 * Migration guide:
 * ```tsx
 * // Before (deprecated)
 * import { useTokenOptimization } from '@clarity-chat/react'
 * const { optimizePrompt } = useTokenOptimization({ enablePromptShortening: true })
 *
 * // After (recommended)
 * import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
 * const { optimizePrompt } = useTokenOptimizationEnhanced({
 *   preset: 'balanced',  // or customize individual options
 *   enablePromptCompression: true,
 * })
 * ```
 *
 * @see useTokenOptimizationEnhanced for the unified hook with all features
 */

'use client'

import * as React from 'react'
import type {
  TokenOptimizationConfig,
  PromptShorteningOptions,
  HistoryLimitingOptions,
  CacheOptions,
  SimilarityCacheOptions,
  ThrottlingOptions,
  ModelRoutingOptions,
  ReferenceOptions,
  OutputLimitOptions,
  BatchingOptions,
} from '../utils/token-optimization'
import {
  shortenPrompt,
  calculateTokenSavings,
  limitHistory,
  createCache,
  generateCacheKey,
  createThrottler,
  routeToModel,
  estimateRoutingSavings,
  createReference,
  shouldUseReference,
  enforceOutputLimit,
  createBatcher,
  findSimilarCached,
  calculateSimilarity,
  estimateTokens,
} from '../utils/token-optimization'
import type { CoreMessage } from './use-chat-enhanced'

export interface UseTokenOptimizationOptions extends TokenOptimizationConfig {
  // Prompt shortening
  promptShortening?: PromptShorteningOptions
  
  // History limiting
  historyLimiting?: HistoryLimitingOptions
  
  // Caching
  caching?: CacheOptions
  
  // Similarity caching
  similarityCaching?: SimilarityCacheOptions
  
  // Throttling
  throttling?: ThrottlingOptions
  
  // Model routing
  modelRouting?: ModelRoutingOptions
  
  // References
  references?: ReferenceOptions
  
  // Output limits
  outputLimits?: OutputLimitOptions
  
  // Batching
  batching?: BatchingOptions
}

export interface TokenOptimizationStats {
  /** Total tokens saved */
  tokensSaved: number
  /** Percentage of tokens saved */
  percentageSaved: number
  /** Number of cache hits */
  cacheHits: number
  /** Number of cache misses */
  cacheMisses: number
  /** Number of requests throttled */
  requestsThrottled: number
  /** Number of requests routed to simple model */
  simpleModelRoutes: number
  /** Number of requests routed to complex model */
  complexModelRoutes: number
  /** Estimated cost savings in dollars */
  costSavings: number
}

export interface UseTokenOptimizationReturn {
  /** Optimize a prompt (shorten if enabled) */
  optimizePrompt: (prompt: string) => { optimized: string; savings: ReturnType<typeof calculateTokenSavings> }
  
  /** Limit conversation history */
  optimizeHistory: (messages: CoreMessage[]) => CoreMessage[]
  
  /** Get cached response if available */
  getCachedResponse: (query: string) => any | null
  
  /** Set cached response */
  setCachedResponse: (query: string, response: any, ttl?: number) => void
  
  /** Check if request can be made (throttling) */
  canMakeRequest: () => boolean
  
  /** Record a request (for throttling) */
  recordRequest: () => void
  
  /** Route query to appropriate model */
  routeQuery: (query: string) => string
  
  /** Create reference for large data */
  createDataReference: (data: string | object) => { type: 'reference'; id: string; originalSize: number } | { type: 'data'; data: string | object }
  
  /** Enforce output limits */
  limitOutput: (output: string) => string
  
  /** Add request to batch */
  batchRequest: <T>(request: () => Promise<T>) => Promise<T>
  
  /** Statistics */
  stats: TokenOptimizationStats
  
  /** Reset statistics */
  resetStats: () => void
}

/**
 * Hook for token optimization
 *
 * @deprecated Use `useTokenOptimizationEnhanced` instead for all new development.
 *
 * @example
 * ```tsx
 * const {
 *   optimizePrompt,
 *   optimizeHistory,
 *   getCachedResponse,
 *   routeQuery,
 *   stats,
 * } = useTokenOptimization({
 *   enablePromptShortening: true,
 *   enableHistoryLimiting: true,
 *   enableCaching: true,
 *   enableModelRouting: true,
 * })
 *
 * // Optimize prompt before sending
 * const { optimized, savings } = optimizePrompt(userInput)
 * logger.debug(`Saved ${savings.tokensSaved} tokens (${savings.percentage.toFixed(1)}%)`)
 *
 * // Limit history
 * const limitedMessages = optimizeHistory(messages)
 *
 * // Check cache
 * const cached = getCachedResponse(optimized)
 * if (cached) {
 *   return cached
 * }
 *
 * // Route to appropriate model
 * const model = routeQuery(optimized)
 * ```
 */
export function useTokenOptimization(
  options: UseTokenOptimizationOptions = {}
): UseTokenOptimizationReturn {
  // Emit deprecation warning in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(
        '[useTokenOptimization] DEPRECATED: useTokenOptimization is deprecated. ' +
          'Please migrate to useTokenOptimizationEnhanced for additional features including ' +
          'TOON encoding, accurate tokenization, prompt caching, presets, and more. ' +
          'See documentation for migration guide.'
      )
    }
  }, [])
  const {
    enablePromptShortening = false,
    enableHistoryLimiting = false,
    enableCaching = false,
    enableThrottling = false,
    enableModelRouting = false,
    enableSimilarityCaching = false,
    enableReferences = false,
    enableOutputLimits = false,
    enableBatching = false,
    promptShortening = {},
    historyLimiting = {},
    caching = {},
    similarityCaching = {},
    throttling = {},
    modelRouting = {},
    references = {},
    outputLimits = {},
    batching = {},
  } = options

  // Initialize caches
  const cache = React.useMemo(
    () => (enableCaching ? createCache(caching) : null),
    [enableCaching, caching]
  )

  const similarityCache = React.useMemo(() => {
    if (!enableSimilarityCaching) return null
    return new Map<string, { query: string; response: any; timestamp: number }>()
  }, [enableSimilarityCaching])

  // Initialize throttler
  const throttler = React.useMemo(
    () => (enableThrottling ? createThrottler(throttling) : null),
    [enableThrottling, throttling]
  )

  // Initialize batcher
  const batcher = React.useMemo(
    () => (enableBatching ? createBatcher(batching) : null),
    [enableBatching, batching]
  )

  // Statistics
  const [stats, setStats] = React.useState<TokenOptimizationStats>({
    tokensSaved: 0,
    percentageSaved: 0,
    cacheHits: 0,
    cacheMisses: 0,
    requestsThrottled: 0,
    simpleModelRoutes: 0,
    complexModelRoutes: 0,
    costSavings: 0,
  })

  /**
   * Optimize prompt
   */
  const optimizePrompt = React.useCallback(
    (prompt: string): { optimized: string; savings: ReturnType<typeof calculateTokenSavings> } => {
      if (!enablePromptShortening) {
        return { optimized: prompt, savings: { tokensSaved: 0, percentage: 0, originalTokens: estimateTokens(prompt), shortenedTokens: estimateTokens(prompt) } }
      }

      const optimized = shortenPrompt(prompt, promptShortening)
      const savings = calculateTokenSavings(prompt, optimized)

      setStats(prev => ({
        ...prev,
        tokensSaved: prev.tokensSaved + savings.tokensSaved,
        percentageSaved: prev.tokensSaved > 0 
          ? ((prev.tokensSaved + savings.tokensSaved) / (prev.tokensSaved / (prev.percentageSaved / 100) + savings.originalTokens)) * 100
          : savings.percentage,
      }))

      return { optimized, savings }
    },
    [enablePromptShortening, promptShortening]
  )

  /**
   * Optimize history
   */
  const optimizeHistory = React.useCallback(
    (messages: CoreMessage[]): CoreMessage[] => {
      if (!enableHistoryLimiting) {
        return messages
      }

      return limitHistory(messages, historyLimiting)
    },
    [enableHistoryLimiting, historyLimiting]
  )

  /**
   * Get cached response
   */
  const getCachedResponse = React.useCallback(
    (query: string): any | null => {
      if (!enableCaching && !enableSimilarityCaching) {
        return null
      }

      // Try exact cache first
      if (enableCaching && cache) {
        const key = generateCacheKey(query)
        const cached = cache.get(key)
        if (cached) {
          setStats(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }))
          return cached
        }
      }

      // Try similarity cache
      if (enableSimilarityCaching && similarityCache) {
        const threshold = similarityCaching.similarityThreshold ?? 0.7
        const cached = findSimilarCached(query, similarityCache, threshold)
        if (cached) {
          setStats(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }))
          return cached
        }
      }

      setStats(prev => ({ ...prev, cacheMisses: prev.cacheMisses + 1 }))
      return null
    },
    [enableCaching, enableSimilarityCaching, cache, similarityCache]
  )

  /**
   * Set cached response
   */
  const setCachedResponse = React.useCallback(
    (query: string, response: any, ttl?: number): void => {
      if (!enableCaching && !enableSimilarityCaching) {
        return
      }

      if (enableCaching && cache) {
        const key = generateCacheKey(query)
        cache.set(key, response, ttl ?? caching.ttl)
      }

      if (enableSimilarityCaching && similarityCache) {
        const key = generateCacheKey(query)
        similarityCache.set(key, {
          query,
          response,
          timestamp: Date.now(),
        })
      }
    },
    [enableCaching, enableSimilarityCaching, cache, similarityCache, caching]
  )

  /**
   * Check if can make request
   */
  const canMakeRequest = React.useCallback((): boolean => {
    if (!enableThrottling || !throttler) {
      return true
    }

    const canMake = throttler.canMakeRequest()
    if (!canMake) {
      setStats(prev => ({ ...prev, requestsThrottled: prev.requestsThrottled + 1 }))
    }

    return canMake
  }, [enableThrottling, throttler])

  /**
   * Record request
   */
  const recordRequest = React.useCallback((): void => {
    if (enableThrottling && throttler) {
      throttler.recordRequest()
    }
  }, [enableThrottling, throttler])

  /**
   * Route query to model
   */
  const routeQuery = React.useCallback(
    (query: string): string => {
      if (!enableModelRouting) {
        return modelRouting.complexModel ?? 'gpt-4'
      }

      const model = routeToModel(query, modelRouting)
      const savings = estimateRoutingSavings(query, modelRouting)

      setStats(prev => ({
        ...prev,
        simpleModelRoutes: prev.simpleModelRoutes + (model === modelRouting.simpleModel ? 1 : 0),
        complexModelRoutes: prev.complexModelRoutes + (model === modelRouting.complexModel ? 1 : 0),
        costSavings: prev.costSavings + savings.saved,
      }))

      return model
    },
    [enableModelRouting, modelRouting]
  )

  /**
   * Create data reference
   */
  const createDataReference = React.useCallback(
    (data: string | object): { type: 'reference'; id: string; originalSize: number } | { type: 'data'; data: string | object } => {
      if (!enableReferences) {
        return { type: 'data', data }
      }

      return createReference(data, references)
    },
    [enableReferences, references]
  )

  /**
   * Limit output
   */
  const limitOutput = React.useCallback(
    (output: string): string => {
      if (!enableOutputLimits) {
        return output
      }

      return enforceOutputLimit(output, outputLimits)
    },
    [enableOutputLimits, outputLimits]
  )

  /**
   * Batch request
   */
  const batchRequest = React.useCallback(
    async <T,>(request: () => Promise<T>): Promise<T> => {
      if (!enableBatching || !batcher) {
        return request()
      }

      return batcher.add(request)
    },
    [enableBatching, batcher]
  )

  /**
   * Reset statistics
   */
  const resetStats = React.useCallback(() => {
    setStats({
      tokensSaved: 0,
      percentageSaved: 0,
      cacheHits: 0,
      cacheMisses: 0,
      requestsThrottled: 0,
      simpleModelRoutes: 0,
      complexModelRoutes: 0,
      costSavings: 0,
    })
  }, [])

  return {
    optimizePrompt,
    optimizeHistory,
    getCachedResponse,
    setCachedResponse,
    canMakeRequest,
    recordRequest,
    routeQuery,
    createDataReference,
    limitOutput,
    batchRequest,
    stats,
    resetStats,
  }
}
