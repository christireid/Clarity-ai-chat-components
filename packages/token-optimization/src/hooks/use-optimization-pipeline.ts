/**
 * useOptimizationPipeline - Unified token optimization hook
 *
 * Combines tiered caching, markdown compression, and model routing
 * into a single, easy-to-use React hook for comprehensive optimization.
 *
 * @module use-optimization-pipeline
 */

import { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { TieredCache } from '../cache/tiered-cache'
import type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats,
} from '../cache/tiered-cache'
import {
  MarkdownCompressor,
  CompressionLevel,
} from '../compression/markdown-compressor'
import type { CompressionResult } from '../compression/markdown-compressor'
import { ModelRouter, RoutingStrategy } from '../routing/model-router'
import type {
  ModelRouterConfig,
  ModelConfig,
  RoutingOptions,
  RoutingResult,
  RouterStats,
} from '../routing/model-router'

/**
 * Pipeline configuration
 */
export interface OptimizationPipelineConfig {
  /** Cache configuration (optional - disables caching if not provided) */
  cache?: TieredCacheConfig
  /** Compression level (optional - disables compression if not provided) */
  compressionLevel?: CompressionLevel
  /** Model router configuration (optional - disables routing if not provided) */
  router?: ModelRouterConfig
  /** Enable automatic stats tracking (triggers re-render on stats change) */
  trackStats?: boolean
}

/**
 * Result of processing a prompt through the pipeline
 */
export interface PipelineResult {
  /** Processed prompt (possibly compressed) */
  processedPrompt: string
  /** Original prompt */
  originalPrompt: string
  /** Whether cache hit occurred */
  cacheHit: boolean
  /** Cache result details */
  cacheResult?: TieredCacheResult
  /** Cached response (if cache hit) */
  cachedResponse?: string
  /** Compression result (if compression enabled) */
  compressionResult?: CompressionResult
  /** Routing result (if routing enabled) */
  routingResult?: RoutingResult
  /** Selected model ID (if routing enabled) */
  selectedModelId?: string
  /** Estimated cost in USD (if routing enabled) */
  estimatedCost?: number
  /** Total processing time in ms */
  processingTime: number
}

/**
 * Combined statistics for the pipeline
 */
export interface PipelineStats {
  /** Total prompts processed */
  totalProcessed: number
  /** Cache statistics */
  cache?: CacheStats
  /** Router statistics */
  router?: RouterStats
  /** Total tokens saved through compression */
  compressionTokensSaved: number
  /** Total cost savings from routing */
  routingCostSavings: number
  /** Overall cache hit rate */
  cacheHitRate: number
}

/**
 * Hook return type
 */
export interface UseOptimizationPipelineReturn {
  /**
   * Process a prompt through the optimization pipeline
   *
   * @param prompt - The prompt to process
   * @param options - Optional routing options
   * @returns Pipeline result with all optimization details
   */
  process: (prompt: string, options?: RoutingOptions) => Promise<PipelineResult>

  /**
   * Store a response in the cache
   *
   * @param prompt - The original prompt
   * @param response - The response to cache
   * @param metadata - Optional metadata
   */
  cacheResponse: (
    prompt: string,
    response: string,
    metadata?: Record<string, unknown>
  ) => Promise<void>

  /**
   * Compress markdown content
   *
   * @param content - Markdown content to compress
   * @returns Compression result
   */
  compress: (content: string) => CompressionResult

  /**
   * Route a prompt to optimal model (without caching)
   *
   * @param prompt - The prompt to route
   * @param options - Routing options
   * @returns Routing result
   */
  route: (prompt: string, options?: RoutingOptions) => RoutingResult | null

  /**
   * Get combined pipeline statistics
   */
  getStats: () => PipelineStats

  /**
   * Reset all statistics
   */
  resetStats: () => void

  /**
   * Clear all caches
   */
  clearCache: () => void

  /**
   * Current pipeline statistics (reactive, only when trackStats=true)
   */
  stats: PipelineStats | null

  /**
   * Feature flags indicating which optimizations are enabled
   */
  features: {
    caching: boolean
    compression: boolean
    routing: boolean
  }

  /**
   * Whether the pipeline is ready
   */
  isReady: boolean
}

/**
 * Unified optimization pipeline hook
 *
 * @param config - Pipeline configuration for cache, compression, and routing
 * @returns Pipeline interface with process, cache, compress, and route functions
 *
 * @example
 * ```tsx
 * function AIChat() {
 *   const pipeline = useOptimizationPipeline({
 *     cache: {
 *       exact: { maxSize: 1000, ttl: 3600000 },
 *       smart: { maxSize: 500, ttl: 3600000 },
 *       semantic: { maxSize: 200, similarityThreshold: 0.92 }
 *     },
 *     compressionLevel: CompressionLevel.Moderate,
 *     router: {
 *       models: [
 *         { id: 'gpt-4o-mini', tier: 'small', ... },
 *         { id: 'gpt-4o', tier: 'medium', ... }
 *       ]
 *     },
 *     trackStats: true
 *   })
 *
 *   const handleSubmit = async (prompt: string) => {
 *     const result = await pipeline.process(prompt)
 *
 *     if (result.cacheHit) {
 *       return result.cachedResponse
 *     }
 *
 *     const response = await callAI(
 *       result.selectedModelId ?? 'gpt-4o-mini',
 *       result.processedPrompt
 *     )
 *
 *     // Cache the response for future use
 *     await pipeline.cacheResponse(prompt, response)
 *     return response
 *   }
 *
 *   return <ChatUI onSubmit={handleSubmit} stats={pipeline.stats} />
 * }
 * ```
 */
export function useOptimizationPipeline(
  config: OptimizationPipelineConfig
): UseOptimizationPipelineReturn {
  const { trackStats = false } = config

  // Persist instances across renders
  const cacheRef = useRef<TieredCache | null>(null)
  const compressorRef = useRef<MarkdownCompressor | null>(null)
  const routerRef = useRef<ModelRouter | null>(null)

  // Internal stats tracking
  const internalStats = useRef({
    totalProcessed: 0,
    compressionTokensSaved: 0,
    cacheHits: 0,
  })

  // Reactive stats
  const [stats, setStats] = useState<PipelineStats | null>(null)

  // Initialize components in useEffect (not during render!)
  // This ensures proper React lifecycle compliance and works in Strict Mode
  useEffect(() => {
    // Initialize cache
    if (config.cache && !cacheRef.current) {
      cacheRef.current = new TieredCache(config.cache)
    }

    // Initialize compressor
    if (config.compressionLevel && !compressorRef.current) {
      compressorRef.current = new MarkdownCompressor({
        level: config.compressionLevel,
        enableTOON: true,
      })
    }

    // Initialize router
    if (config.router && !routerRef.current) {
      routerRef.current = new ModelRouter(config.router)
    }

    // Cleanup when config changes or on unmount
    return () => {
      // Clear cache
      cacheRef.current?.clear()
      cacheRef.current = null

      // Router and compressor don't have explicit destroy methods
      // but setting to null allows garbage collection
      routerRef.current = null
      compressorRef.current = null
    }
  }, [config.cache, config.compressionLevel, config.router])

  // Initialize stats in effect to avoid setState during render
  useEffect(() => {
    if (trackStats && stats === null) {
      setStats(buildStats())
    }
  }, [trackStats, stats])

  // Build combined stats
  function buildStats(): PipelineStats {
    const cacheStats = cacheRef.current?.getStats()
    const routerStats = routerRef.current?.getStats()

    return {
      totalProcessed: internalStats.current.totalProcessed,
      cache: cacheStats,
      router: routerStats,
      compressionTokensSaved: internalStats.current.compressionTokensSaved,
      routingCostSavings: routerStats?.estimatedSavings ?? 0,
      cacheHitRate:
        internalStats.current.totalProcessed > 0
          ? internalStats.current.cacheHits /
            internalStats.current.totalProcessed
          : 0,
    }
  }

  // Update stats helper
  const updateStats = useCallback(() => {
    if (trackStats) {
      setStats(buildStats())
    }
  }, [trackStats])

  // Process a prompt through the pipeline
  const process = useCallback(
    async (
      prompt: string,
      options?: RoutingOptions
    ): Promise<PipelineResult> => {
      const startTime = performance.now()
      internalStats.current.totalProcessed++

      let processedPrompt = prompt
      let cacheHit = false
      let cacheResult: TieredCacheResult | undefined
      let cachedResponse: string | undefined
      let compressionResult: CompressionResult | undefined
      let routingResult: RoutingResult | undefined

      // Step 1: Check cache first
      if (cacheRef.current) {
        cacheResult = await cacheRef.current.get(prompt)
        if (cacheResult.hit && cacheResult.data) {
          cacheHit = true
          cachedResponse = cacheResult.data
          internalStats.current.cacheHits++
        }
      }

      // Step 2: Compress if not cached and compression enabled
      if (!cacheHit && compressorRef.current) {
        compressionResult = compressorRef.current.compress(prompt)
        processedPrompt = compressionResult.compressed
        internalStats.current.compressionTokensSaved +=
          compressionResult.estimatedTokensSaved
      }

      // Step 3: Route to optimal model
      if (routerRef.current) {
        routingResult = routerRef.current.route(processedPrompt, options)
      }

      updateStats()

      return {
        processedPrompt,
        originalPrompt: prompt,
        cacheHit,
        cacheResult,
        cachedResponse,
        compressionResult,
        routingResult,
        selectedModelId: routingResult?.selectedModel?.id,
        estimatedCost: routingResult?.estimatedCost,
        processingTime: performance.now() - startTime,
      }
    },
    [updateStats]
  )

  // Cache a response
  const cacheResponse = useCallback(
    async (
      prompt: string,
      response: string,
      metadata?: Record<string, unknown>
    ): Promise<void> => {
      if (cacheRef.current) {
        await cacheRef.current.set(prompt, response, metadata)
        updateStats()
      }
    },
    [updateStats]
  )

  // Compress content
  const compress = useCallback((content: string): CompressionResult => {
    if (!compressorRef.current) {
      return {
        compressed: content,
        originalSize: content.length,
        compressedSize: content.length,
        savingsPercent: 0,
        estimatedTokensSaved: 0,
        toonApplied: false,
      }
    }
    return compressorRef.current.compress(content)
  }, [])

  // Route a prompt
  const route = useCallback(
    (prompt: string, options?: RoutingOptions): RoutingResult | null => {
      if (!routerRef.current) return null
      return routerRef.current.route(prompt, options)
    },
    []
  )

  // Get stats
  const getStats = useCallback((): PipelineStats => {
    return buildStats()
  }, [])

  // Reset all stats
  const resetStats = useCallback((): void => {
    internalStats.current = {
      totalProcessed: 0,
      compressionTokensSaved: 0,
      cacheHits: 0,
    }
    routerRef.current?.resetStats()
    updateStats()
  }, [updateStats])

  // Clear cache
  const clearCache = useCallback((): void => {
    cacheRef.current?.clear()
    updateStats()
  }, [updateStats])

  // Feature flags
  const features = useMemo(
    () => ({
      caching: config.cache !== undefined,
      compression: config.compressionLevel !== undefined,
      routing: config.router !== undefined,
    }),
    [config.cache, config.compressionLevel, config.router]
  )

  // Memoized return value
  return useMemo(
    () => ({
      process,
      cacheResponse,
      compress,
      route,
      getStats,
      resetStats,
      clearCache,
      stats,
      features,
      isReady: true,
    }),
    [
      process,
      cacheResponse,
      compress,
      route,
      getStats,
      resetStats,
      clearCache,
      stats,
      features,
    ]
  )
}

// Re-export types and enums for convenience
export { CompressionLevel, RoutingStrategy }
export type { ModelConfig, RoutingOptions, CacheStats, RouterStats }
