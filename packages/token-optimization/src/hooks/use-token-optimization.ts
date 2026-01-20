/**
 * Unified Token Optimization Hook
 *
 * Simplified React hook that provides all token optimization features
 * with sensible defaults and preset configurations.
 *
 * @module hooks/use-token-optimization
 */

import { useRef, useCallback, useMemo, useState } from 'react'
import { TieredCache } from '../cache/tiered-cache'
import type { TieredCacheConfig, CacheStats } from '../cache/tiered-cache'
import { ModelRouter, RoutingStrategy } from '../routing/model-router'
import type {
  ModelRouterConfig,
  RoutingResult,
  RouterStats,
  ModelConfig,
} from '../routing/model-router'
import {
  MarkdownCompressor,
  CompressionLevel,
} from '../compression/markdown-compressor'
import type { CompressionResult as MarkdownCompressionResult } from '../compression/markdown-compressor'
import { AccurateTokenCounter } from '../tokenizers/accurate-counter'
import type { SemanticCacheConfig } from '../caching/advanced-semantic-cache'

/**
 * Preset configuration levels
 */
export type TokenOptimizationPreset =
  | 'minimal'
  | 'standard'
  | 'production'
  | 'enterprise'

/**
 * Configuration for useTokenOptimization hook
 */
export interface UseTokenOptimizationConfig {
  /**
   * Use a preset configuration (recommended for most use cases)
   * @default 'standard'
   */
  preset?: TokenOptimizationPreset

  /**
   * Model for token counting
   * @default 'gpt-4o'
   */
  model?: string

  /**
   * Available models for routing
   */
  availableModels?: string[]

  /**
   * Enable caching
   * @default true
   */
  enableCache?: boolean

  /**
   * Enable compression
   * @default true
   */
  enableCompression?: boolean

  /**
   * Enable model routing
   * @default true
   */
  enableRouting?: boolean

  /**
   * Custom cache configuration (overrides preset)
   */
  cacheConfig?: Partial<TieredCacheConfig>

  /**
   * Custom router configuration (overrides preset)
   */
  routerConfig?: Partial<ModelRouterConfig>
}

/**
 * Return type for useTokenOptimization hook
 */
export interface UseTokenOptimizationReturn {
  /**
   * Count tokens in text
   */
  countTokens: (text: string) => number

  /**
   * Get cached response or undefined
   */
  getFromCache: (prompt: string) => Promise<string | undefined>

  /**
   * Store response in cache
   */
  setInCache: (prompt: string, response: string) => Promise<void>

  /**
   * Compress text to reduce tokens
   */
  compress: (text: string) => MarkdownCompressionResult

  /**
   * Route prompt to optimal model
   */
  route: (prompt: string) => RoutingResult

  /**
   * Optimize a prompt (compress + route + check cache)
   */
  optimize: (prompt: string) => Promise<{
    cachedResponse?: string
    compressedPrompt: string
    recommendedModel: string
    tokensSaved: number
    estimatedCostSaved: number
  }>

  /**
   * Get combined statistics
   */
  getStats: () => {
    cache: CacheStats | null
    router: RouterStats
    tokensProcessed: number
    tokensSaved: number
  }

  /**
   * Reset all statistics
   */
  resetStats: () => void

  /**
   * Clear all caches
   */
  clearCache: () => void
}

/**
 * Preset configurations
 */
const PRESETS: Record<
  TokenOptimizationPreset,
  {
    cache: Partial<TieredCacheConfig>
    compression: CompressionLevel
    routing: RoutingStrategy
  }
> = {
  minimal: {
    cache: {
      exact: { maxSize: 100, ttl: 300000 }, // 5 min TTL
      smart: { maxSize: 50, ttl: 300000 },
    },
    compression: CompressionLevel.Light,
    routing: RoutingStrategy.CostOptimized,
  },
  standard: {
    cache: {
      exact: { maxSize: 500, ttl: 1800000 }, // 30 min TTL
      smart: { maxSize: 200, ttl: 1800000 },
    },
    compression: CompressionLevel.Moderate,
    routing: RoutingStrategy.Balanced,
  },
  production: {
    cache: {
      exact: { maxSize: 1000, ttl: 3600000 }, // 1 hour TTL
      smart: { maxSize: 500, ttl: 3600000 },
    },
    compression: CompressionLevel.Moderate,
    routing: RoutingStrategy.Balanced,
  },
  enterprise: {
    cache: {
      exact: { maxSize: 5000, ttl: 7200000 }, // 2 hour TTL
      smart: { maxSize: 2000, ttl: 7200000 },
    },
    compression: CompressionLevel.Aggressive,
    routing: RoutingStrategy.QualityFirst,
  },
}

/**
 * Default models for routing
 */
const DEFAULT_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']

/**
 * Create default semantic cache config based on preset
 */
function getDefaultSemanticConfig(
  preset: TokenOptimizationPreset
): SemanticCacheConfig {
  const sizes: Record<TokenOptimizationPreset, number> = {
    minimal: 50,
    standard: 200,
    production: 500,
    enterprise: 2000,
  }
  const thresholds: Record<TokenOptimizationPreset, number> = {
    minimal: 0.9,
    standard: 0.85,
    production: 0.85,
    enterprise: 0.8,
  }
  const maxAges: Record<TokenOptimizationPreset, number> = {
    minimal: 300000, // 5 min
    standard: 1800000, // 30 min
    production: 3600000, // 1 hour
    enterprise: 7200000, // 2 hours
  }
  return {
    maxSize: sizes[preset],
    maxAge: maxAges[preset],
    similarityThreshold: thresholds[preset],
    enableEmbeddingCache: preset !== 'minimal',
    enableContextAwareness: preset === 'production' || preset === 'enterprise',
    enablePredictiveCaching: preset === 'enterprise',
    compressionThreshold: 1000,
  }
}

/**
 * Unified token optimization hook
 *
 * Provides a simple, all-in-one interface for token optimization.
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { countTokens, optimize, compress, route, getStats } = useTokenOptimization({
 *     preset: 'production',
 *     model: 'gpt-4o',
 *   })
 *
 *   const handleSend = async (prompt: string) => {
 *     const { cachedResponse, compressedPrompt, recommendedModel, tokensSaved } = await optimize(prompt)
 *
 *     if (cachedResponse) {
 *       return cachedResponse // Use cached response
 *     }
 *
 *     // Send compressedPrompt to recommendedModel
 *     console.log(`Saved ${tokensSaved} tokens`)
 *   }
 * }
 * ```
 */
export function useTokenOptimization(
  config: UseTokenOptimizationConfig = {}
): UseTokenOptimizationReturn {
  const {
    preset = 'standard',
    model = 'gpt-4o',
    availableModels = DEFAULT_MODELS,
    enableCache = true,
    enableCompression = true,
    enableRouting = true,
    cacheConfig,
    routerConfig,
  } = config

  const presetConfig = PRESETS[preset]

  // Statistics tracking
  const [stats, setStats] = useState({
    tokensProcessed: 0,
    tokensSaved: 0,
  })

  // Initialize cache
  const cacheRef = useRef<TieredCache | null>(null)
  if (enableCache && !cacheRef.current) {
    cacheRef.current = new TieredCache({
      exact: { maxSize: 500, ttl: 1800000, ...presetConfig.cache.exact },
      smart: { maxSize: 200, ttl: 1800000, ...presetConfig.cache.smart },
      semantic: cacheConfig?.semantic ?? getDefaultSemanticConfig(preset),
      ...cacheConfig,
    } as TieredCacheConfig)
  }

  // Create model configs for router
  const modelConfigs: ModelConfig[] = useMemo(
    () =>
      availableModels.map((m) => ({
        id: m,
        tier: m.includes('mini')
          ? ('small' as const)
          : m.includes('4o')
            ? ('medium' as const)
            : ('large' as const),
        contextWindow: m.includes('turbo')
          ? 128000
          : m.includes('4o')
            ? 128000
            : 8192,
        inputCostPer1M: m.includes('mini') ? 0.15 : m.includes('4o') ? 2.5 : 10,
        outputCostPer1M: m.includes('mini') ? 0.6 : m.includes('4o') ? 10 : 30,
        maxOutput: m.includes('turbo') ? 4096 : 16384,
        capabilities: ['chat', 'completion'],
      })),
    [availableModels]
  )

  // Initialize router
  const routerRef = useRef<ModelRouter | null>(null)
  if (enableRouting && !routerRef.current) {
    routerRef.current = new ModelRouter({
      models: modelConfigs,
      defaultStrategy: presetConfig.routing,
      ...routerConfig,
    })
  }

  // Initialize compressor
  const compressorRef = useRef<MarkdownCompressor | null>(null)
  if (enableCompression && !compressorRef.current) {
    compressorRef.current = new MarkdownCompressor({
      level: presetConfig.compression,
    })
  }

  // Initialize token counter
  const counterRef = useRef<AccurateTokenCounter | null>(null)
  if (!counterRef.current) {
    counterRef.current = new AccurateTokenCounter({ model })
  }

  // Count tokens
  const countTokens = useCallback((text: string): number => {
    return counterRef.current?.count(text) ?? Math.ceil(text.length / 4)
  }, [])

  // Get from cache
  const getFromCache = useCallback(
    async (prompt: string): Promise<string | undefined> => {
      if (!enableCache || !cacheRef.current) return undefined

      const result = await cacheRef.current.get(prompt)
      return result.hit ? result.data : undefined
    },
    [enableCache]
  )

  // Set in cache
  const setInCache = useCallback(
    async (prompt: string, response: string): Promise<void> => {
      if (!enableCache || !cacheRef.current) return
      await cacheRef.current.set(prompt, response)
    },
    [enableCache]
  )

  // Compress text
  const compress = useCallback(
    (text: string): MarkdownCompressionResult => {
      if (!enableCompression || !compressorRef.current) {
        return {
          compressed: text,
          originalSize: text.length,
          compressedSize: text.length,
          savingsPercent: 0,
          estimatedTokensSaved: 0,
          toonApplied: false,
        }
      }
      return compressorRef.current.compress(text)
    },
    [enableCompression]
  )

  // Route to model
  const route = useCallback(
    (prompt: string): RoutingResult => {
      if (!enableRouting || !routerRef.current) {
        return {
          selectedModel: undefined,
          strategy: RoutingStrategy.Balanced,
          confidence: 0,
        }
      }
      return routerRef.current.route(prompt)
    },
    [enableRouting]
  )

  // Optimize (all-in-one)
  const optimize = useCallback(
    async (prompt: string) => {
      const originalTokens = countTokens(prompt)

      // Check cache first
      const cachedResponse = await getFromCache(prompt)
      if (cachedResponse) {
        setStats((prev) => ({
          ...prev,
          tokensProcessed: prev.tokensProcessed + originalTokens,
          tokensSaved: prev.tokensSaved + originalTokens, // Saved all tokens by using cache
        }))
        return {
          cachedResponse,
          compressedPrompt: prompt,
          recommendedModel: model,
          tokensSaved: originalTokens,
          estimatedCostSaved: originalTokens * 0.00001, // Rough estimate
        }
      }

      // Compress
      const compressionResult = compress(prompt)
      const compressedPrompt = compressionResult.compressed

      // Estimate compressed tokens from character ratio
      const compressedTokens =
        compressionResult.originalSize > 0
          ? Math.ceil(
              originalTokens *
                (compressionResult.compressedSize /
                  compressionResult.originalSize)
            )
          : originalTokens

      // Route
      const routingResult = route(compressedPrompt)
      const recommendedModel =
        routingResult.selectedModel?.id ?? availableModels[0] ?? model

      const tokensSaved = originalTokens - compressedTokens

      setStats((prev) => ({
        ...prev,
        tokensProcessed: prev.tokensProcessed + originalTokens,
        tokensSaved: prev.tokensSaved + tokensSaved,
      }))

      return {
        cachedResponse: undefined,
        compressedPrompt,
        recommendedModel,
        tokensSaved,
        estimatedCostSaved: tokensSaved * 0.00001,
      }
    },
    [countTokens, getFromCache, compress, route, model, availableModels]
  )

  // Get stats
  const getStats = useCallback(() => {
    return {
      cache: cacheRef.current?.getStats() ?? null,
      router: routerRef.current?.getStats() ?? {
        totalRoutes: 0,
        routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
        estimatedSavings: 0,
        averageComplexity: 0,
      },
      tokensProcessed: stats.tokensProcessed,
      tokensSaved: stats.tokensSaved,
    }
  }, [stats])

  // Reset stats
  const resetStats = useCallback(() => {
    routerRef.current?.resetStats()
    setStats({ tokensProcessed: 0, tokensSaved: 0 })
  }, [])

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current?.clear()
  }, [])

  return useMemo(
    () => ({
      countTokens,
      getFromCache,
      setInCache,
      compress,
      route,
      optimize,
      getStats,
      resetStats,
      clearCache,
    }),
    [
      countTokens,
      getFromCache,
      setInCache,
      compress,
      route,
      optimize,
      getStats,
      resetStats,
      clearCache,
    ]
  )
}
