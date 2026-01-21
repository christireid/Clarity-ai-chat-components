/**
 * useStreamingOptimization Hook
 *
 * React hook for optimized streaming LLM responses with real-time token/cost tracking.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  StreamingTokenCounter,
  type StreamingChunk,
  type StreamingTokenStats,
} from '../streaming/streaming-token-counter'
import {
  StreamingCostTracker,
  StreamingBudgetMonitor,
  StreamingRateLimiter,
  type StreamingModelPricing,
  type StreamingCostStats,
} from '../streaming/streaming-cost-tracker'
import {
  CacheWarmer,
  type CacheWarmingStrategy,
  type StreamingCacheEntry,
} from '../streaming/cache-warming'

/**
 * Streaming optimization configuration
 */
export interface UseStreamingOptimizationConfig {
  /** Model pricing */
  pricing: StreamingModelPricing
  /** Enable token prediction */
  enablePrediction?: boolean
  /** Enable timing metrics */
  enableTiming?: boolean
  /** Cache warming strategy */
  cacheWarming?: CacheWarmingStrategy
  /** Budget limit (optional) */
  budgetLimit?: number
  /** Update interval (ms) for UI updates */
  updateInterval?: number
}

/**
 * Streaming state
 */
export interface StreamingState {
  /** Is currently streaming */
  isStreaming: boolean
  /** Current response text */
  response: string
  /** Token statistics */
  tokenStats: StreamingTokenStats | null
  /** Cost statistics */
  costStats: StreamingCostStats | null
  /** Budget status (if budget monitoring enabled) */
  budgetStatus?: {
    withinBudget: boolean
    budgetRemaining: number
    budgetUtilization: number
  }
  /** Chunks received */
  chunkCount: number
  /** Cache hit (if available) */
  cacheHit: boolean
}

/**
 * Streaming optimization hook
 */
export function useStreamingOptimization(config: UseStreamingOptimizationConfig) {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    response: '',
    tokenStats: null,
    costStats: null,
    chunkCount: 0,
    cacheHit: false,
  })

  const tokenCounterRef = useRef<StreamingTokenCounter>()
  const costTrackerRef = useRef<StreamingCostTracker>()
  const budgetMonitorRef = useRef<StreamingBudgetMonitor>()
  const cacheWarmerRef = useRef<CacheWarmer>()
  const rateLimiterRef = useRef<StreamingRateLimiter>()
  const cacheStoreRef = useRef<Map<string, StreamingCacheEntry>>(new Map())

  // Initialize on mount
  useEffect(() => {
    tokenCounterRef.current = new StreamingTokenCounter({
      enablePrediction: config.enablePrediction ?? true,
      predictionStrategy: 'average',
    })

    rateLimiterRef.current = new StreamingRateLimiter(config.updateInterval ?? 100)

    if (config.cacheWarming) {
      cacheWarmerRef.current = new CacheWarmer(cacheStoreRef.current, {
        strategy: config.cacheWarming,
      })
    }

    if (config.budgetLimit) {
      budgetMonitorRef.current = new StreamingBudgetMonitor({
        budgetLimit: config.budgetLimit,
      })
    }
  }, [])

  /**
   * Process a streaming chunk
   */
  const processChunk = useCallback(
    (chunk: StreamingChunk, inputTokens: number) => {
      if (!tokenCounterRef.current) return

      // Count tokens
      const tokenStats = tokenCounterRef.current.processChunk(chunk)

      // Update cost tracker (create if needed)
      if (!costTrackerRef.current) {
        costTrackerRef.current = new StreamingCostTracker({
          pricing: config.pricing,
          inputTokens,
          enableTiming: config.enableTiming ?? true,
        })
      }

      const costStats = costTrackerRef.current.update(tokenStats)

      // Check budget if monitoring enabled
      let budgetStatus
      if (budgetMonitorRef.current) {
        budgetStatus = budgetMonitorRef.current.check(costStats)
      }

      // Update state (throttled)
      rateLimiterRef.current?.throttle(
        costStats,
        () => {
          setState({
            isStreaming: !chunk.isFinal,
            response: chunk.cumulative,
            tokenStats,
            costStats,
            budgetStatus,
            chunkCount: chunk.sequence + 1,
            cacheHit: false,
          })
        },
        chunk.isFinal // Force update on final chunk
      )

      // Cache warming
      if (cacheWarmerRef.current) {
        cacheWarmerRef.current.processChunk('', chunk, tokenStats.totalTokens)
      }

      // Return whether to continue streaming
      return !budgetStatus?.shouldStop
    },
    [config.pricing, config.enableTiming]
  )

  /**
   * Start streaming
   */
  const startStream = useCallback(
    async (
      prompt: string,
      inputTokens: number,
      streamGenerator: AsyncIterable<StreamingChunk>
    ): Promise<string> => {
      // Check cache first
      if (cacheWarmerRef.current) {
        const cached = cacheWarmerRef.current.get(prompt)
        if (cached && cached.isComplete) {
          setState({
            isStreaming: false,
            response: cached.response,
            tokenStats: {
              totalTokens: cached.totalTokens,
              chunkTokens: 0,
              chunkCount: cached.chunkCount,
              averageChunkTokens: cached.totalTokens / cached.chunkCount,
            },
            costStats: null, // Could calculate from cached data
            chunkCount: cached.chunkCount,
            cacheHit: true,
          })
          return cached.response
        }
      }

      // Reset trackers
      tokenCounterRef.current?.reset()
      costTrackerRef.current?.reset(inputTokens)
      budgetMonitorRef.current?.reset()

      setState((prev) => ({
        ...prev,
        isStreaming: true,
        response: '',
        tokenStats: null,
        costStats: null,
        chunkCount: 0,
        cacheHit: false,
      }))

      let finalResponse = ''

      try {
        for await (const chunk of streamGenerator) {
          const shouldContinue = processChunk(chunk, inputTokens)

          if (!shouldContinue) {
            // Budget exceeded, stop streaming
            break
          }

          finalResponse = chunk.cumulative

          if (chunk.isFinal) {
            break
          }
        }

        // Flush any pending updates
        rateLimiterRef.current?.flush((costStats) => {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            costStats,
          }))
        })

        return finalResponse
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isStreaming: false,
        }))
        throw error
      }
    },
    [processChunk]
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    tokenCounterRef.current?.reset()
    costTrackerRef.current?.reset()
    budgetMonitorRef.current?.reset()

    setState({
      isStreaming: false,
      response: '',
      tokenStats: null,
      costStats: null,
      chunkCount: 0,
      cacheHit: false,
    })
  }, [])

  /**
   * Get cache stats
   */
  const getCacheStats = useCallback(() => {
    return cacheWarmerRef.current?.getStats()
  }, [])

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheWarmerRef.current?.clear()
    cacheStoreRef.current.clear()
  }, [])

  return {
    ...state,
    startStream,
    processChunk,
    reset,
    getCacheStats,
    clearCache,
  }
}

/**
 * Simplified streaming hook (just tokens, no cost)
 */
export function useStreamingTokens(config?: {
  enablePrediction?: boolean
  updateInterval?: number
}) {
  const [stats, setStats] = useState<StreamingTokenStats | null>(null)
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const counterRef = useRef<StreamingTokenCounter>()
  const rateLimiterRef = useRef<StreamingRateLimiter>()

  useEffect(() => {
    counterRef.current = new StreamingTokenCounter({
      enablePrediction: config?.enablePrediction ?? true,
    })

    rateLimiterRef.current = new StreamingRateLimiter(config?.updateInterval ?? 100)
  }, [])

  const processChunk = useCallback((chunk: StreamingChunk) => {
    if (!counterRef.current) return

    const tokenStats = counterRef.current.processChunk(chunk)

    rateLimiterRef.current?.throttle(
      tokenStats as any,
      () => {
        setStats(tokenStats)
        setResponse(chunk.cumulative)
        setIsStreaming(!chunk.isFinal)
      },
      chunk.isFinal
    )
  }, [])

  const reset = useCallback(() => {
    counterRef.current?.reset()
    setStats(null)
    setResponse('')
    setIsStreaming(false)
  }, [])

  return {
    stats,
    response,
    isStreaming,
    processChunk,
    reset,
  }
}

/**
 * Simplified streaming hook (just cost, assumes tokens provided)
 */
export function useStreamingCost(
  pricing: StreamingModelPricing,
  inputTokens: number,
  config?: {
    enableTiming?: boolean
    budgetLimit?: number
  }
) {
  const [stats, setStats] = useState<StreamingCostStats | null>(null)
  const [budgetStatus, setBudgetStatus] = useState<{
    withinBudget: boolean
    budgetRemaining: number
    budgetUtilization: number
  } | null>(null)

  const trackerRef = useRef<StreamingCostTracker>()
  const budgetMonitorRef = useRef<StreamingBudgetMonitor>()

  useEffect(() => {
    trackerRef.current = new StreamingCostTracker({
      pricing,
      inputTokens,
      enableTiming: config?.enableTiming ?? true,
    })

    if (config?.budgetLimit) {
      budgetMonitorRef.current = new StreamingBudgetMonitor({
        budgetLimit: config.budgetLimit,
      })
    }
  }, [pricing, inputTokens])

  const updateCost = useCallback((tokenStats: StreamingTokenStats) => {
    if (!trackerRef.current) return

    const costStats = trackerRef.current.update(tokenStats)
    setStats(costStats)

    if (budgetMonitorRef.current) {
      const status = budgetMonitorRef.current.check(costStats)
      setBudgetStatus(status)
    }
  }, [])

  const reset = useCallback(() => {
    trackerRef.current?.reset()
    budgetMonitorRef.current?.reset()
    setStats(null)
    setBudgetStatus(null)
  }, [])

  return {
    stats,
    budgetStatus,
    updateCost,
    reset,
  }
}
