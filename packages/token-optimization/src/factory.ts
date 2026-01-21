/**
 * Token Optimization Factory
 *
 * Provides a simplified API for creating optimizers with sensible defaults.
 * Use this for non-React applications or server-side code.
 *
 * @module factory
 */

import { TieredCache } from './cache/tiered-cache'
import type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats,
} from './cache/tiered-cache'
import { ModelRouter, RoutingStrategy } from './routing/model-router'
import type {
  RoutingResult,
  RouterStats,
  ModelConfig,
} from './routing/model-router'
import {
  MarkdownCompressor,
  CompressionLevel,
} from './compression/markdown-compressor'
import type { CompressionResult as MarkdownCompressionResult } from './compression/markdown-compressor'
import { AccurateTokenCounter } from './tokenizers/accurate-counter'
import type { SemanticCacheConfig } from './caching/advanced-semantic-cache'
import { ProviderCachingManager } from './providers/prompt-caching'
import type {
  ProviderCachingConfig,
  CacheableMessage,
} from './providers/types'

/**
 * Preset configuration levels
 */
export type OptimizerPreset =
  | 'minimal'
  | 'standard'
  | 'production'
  | 'enterprise'

/**
 * Configuration for createOptimizer
 */
export interface OptimizerConfig {
  /**
   * Use a preset configuration (recommended for most use cases)
   * @default 'standard'
   */
  preset?: OptimizerPreset

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
   * Enable provider-native caching (Anthropic, OpenAI, Google)
   * @default false (opt-in for safety)
   */
  enableProviderCaching?: boolean

  /**
   * Provider for native caching
   * @default 'anthropic'
   */
  cachingProvider?: 'anthropic' | 'openai' | 'google'

  /**
   * Custom cache configuration (overrides preset)
   */
  cacheConfig?: Partial<TieredCacheConfig>
}

/**
 * Optimizer instance returned by createOptimizer
 */
export interface Optimizer {
  /**
   * Count tokens in text
   */
  countTokens: (text: string) => number

  /**
   * Get cached response
   */
  getFromCache: (prompt: string) => Promise<TieredCacheResult>

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
   * Optimize a prompt (cache + provider caching + compress + route)
   */
  optimize: (prompt: string) => Promise<{
    cachedResponse?: string
    compressedPrompt: string
    recommendedModel: string
    tokensSaved: number
    estimatedCostSaved: number
    providerCacheMetadata?: {
      provider: string
      cachedTokens: number
      savingsPercentage: number
      estimatedSavings: {
        tokens: number
        costReduction: number
      }
    }
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

  /**
   * Dispose of resources
   */
  dispose: () => void
}

/**
 * Preset configurations
 */
const PRESETS: Record<
  OptimizerPreset,
  {
    cache: Partial<TieredCacheConfig>
    compression: CompressionLevel
    routing: RoutingStrategy
  }
> = {
  minimal: {
    cache: {
      exact: { maxSize: 100, ttl: 300000 },
      smart: { maxSize: 50, ttl: 300000 },
    },
    compression: CompressionLevel.Light,
    routing: RoutingStrategy.CostOptimized,
  },
  standard: {
    cache: {
      exact: { maxSize: 500, ttl: 1800000 },
      smart: { maxSize: 200, ttl: 1800000 },
    },
    compression: CompressionLevel.Moderate,
    routing: RoutingStrategy.Balanced,
  },
  production: {
    cache: {
      exact: { maxSize: 1000, ttl: 3600000 },
      smart: { maxSize: 500, ttl: 3600000 },
    },
    compression: CompressionLevel.Moderate,
    routing: RoutingStrategy.Balanced,
  },
  enterprise: {
    cache: {
      exact: { maxSize: 5000, ttl: 7200000 },
      smart: { maxSize: 2000, ttl: 7200000 },
    },
    compression: CompressionLevel.Aggressive,
    routing: RoutingStrategy.QualityFirst,
  },
}

const DEFAULT_MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']

/**
 * Create default semantic cache config based on preset
 */
function getDefaultSemanticConfig(
  preset: OptimizerPreset
): SemanticCacheConfig {
  const sizes: Record<OptimizerPreset, number> = {
    minimal: 50,
    standard: 200,
    production: 500,
    enterprise: 2000,
  }
  const thresholds: Record<OptimizerPreset, number> = {
    minimal: 0.9,
    standard: 0.85,
    production: 0.85,
    enterprise: 0.8,
  }
  const maxAges: Record<OptimizerPreset, number> = {
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
 * Create a token optimizer with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage with defaults
 * const optimizer = createOptimizer()
 *
 * // With preset
 * const optimizer = createOptimizer({ preset: 'production' })
 *
 * // Custom configuration
 * const optimizer = createOptimizer({
 *   preset: 'production',
 *   model: 'gpt-4o',
 *   availableModels: ['gpt-4o-mini', 'gpt-4o', 'claude-3-sonnet'],
 * })
 *
 * // Usage
 * const { cachedResponse, compressedPrompt, recommendedModel, tokensSaved } = await optimizer.optimize(prompt)
 *
 * if (cachedResponse) {
 *   return cachedResponse
 * }
 *
 * // Send compressedPrompt to recommendedModel
 * ```
 */
export function createOptimizer(config: OptimizerConfig = {}): Optimizer {
  const {
    preset = 'standard',
    model = 'gpt-4o',
    availableModels = DEFAULT_MODELS,
    enableCache = true,
    enableCompression = true,
    enableRouting = true,
    enableProviderCaching = false,
    cachingProvider = 'anthropic',
    cacheConfig,
  } = config

  const presetConfig = PRESETS[preset]

  // Statistics tracking
  let stats = {
    tokensProcessed: 0,
    tokensSaved: 0,
  }

  // Initialize components
  const cache = enableCache
    ? new TieredCache({
        exact: { maxSize: 500, ttl: 1800000, ...presetConfig.cache.exact },
        smart: { maxSize: 200, ttl: 1800000, ...presetConfig.cache.smart },
        semantic: cacheConfig?.semantic ?? getDefaultSemanticConfig(preset),
        ...cacheConfig,
      } as TieredCacheConfig)
    : null

  // Create model configs for router
  const modelConfigs: ModelConfig[] = availableModels.map((m) => ({
    id: m,
    tier: m.includes('mini') ? 'small' : m.includes('4o') ? 'medium' : 'large',
    contextWindow: m.includes('turbo')
      ? 128000
      : m.includes('4o')
        ? 128000
        : 8192,
    inputCostPer1M: m.includes('mini') ? 0.15 : m.includes('4o') ? 2.5 : 10,
    outputCostPer1M: m.includes('mini') ? 0.6 : m.includes('4o') ? 10 : 30,
    maxOutput: m.includes('turbo') ? 4096 : 16384,
    capabilities: ['chat', 'completion'],
  }))

  const router = enableRouting
    ? new ModelRouter({
        models: modelConfigs,
        defaultStrategy: presetConfig.routing,
      })
    : null

  const compressor = enableCompression
    ? new MarkdownCompressor({
        level: presetConfig.compression,
      })
    : null

  const counter = new AccurateTokenCounter({ model })

  // Initialize provider caching if enabled
  const providerCaching = enableProviderCaching
    ? new ProviderCachingManager(
        {
          enabled: true,
          provider: cachingProvider,
        } as ProviderCachingConfig,
        counter
      )
    : null

  return {
    countTokens: (text: string) => counter.count(text),

    getFromCache: async (prompt: string) => {
      if (!cache) return { hit: false }
      return cache.get(prompt)
    },

    setInCache: async (prompt: string, response: string) => {
      if (cache) await cache.set(prompt, response)
    },

    compress: (text: string) => {
      if (!compressor) {
        return {
          compressed: text,
          originalSize: text.length,
          compressedSize: text.length,
          savingsPercent: 0,
          estimatedTokensSaved: 0,
          toonApplied: false,
        }
      }
      return compressor.compress(text)
    },

    route: (prompt: string) => {
      if (!router) {
        return {
          selectedModel: undefined,
          strategy: RoutingStrategy.Balanced,
          confidence: 0,
        }
      }
      return router.route(prompt)
    },

    optimize: async (prompt: string) => {
      const originalTokens = counter.count(prompt)
      let providerCacheMetadata:
        | {
            provider: string
            cachedTokens: number
            savingsPercentage: number
            estimatedSavings: {
              tokens: number
              costReduction: number
            }
          }
        | undefined = undefined
      let providerCacheApplied = false

      // Step 1: Check local cache
      if (cache) {
        const result = await cache.get(prompt)
        if (result.hit && result.data) {
          stats.tokensProcessed += originalTokens
          stats.tokensSaved += originalTokens
          return {
            cachedResponse: result.data,
            compressedPrompt: prompt,
            recommendedModel: model,
            tokensSaved: originalTokens,
            estimatedCostSaved: originalTokens * 0.00001,
            providerCacheMetadata,
          }
        }
      }

      // Step 2: Apply provider-native caching
      let optimizedPrompt = prompt
      if (providerCaching) {
        try {
          const messages: CacheableMessage[] = [
            {
              role: 'user',
              content: prompt,
              cacheable: true,
            },
          ]

          const providerResult = await providerCaching.applyCaching(messages)

          if (providerResult.cached) {
            providerCacheApplied = true
            providerCacheMetadata = {
              provider: providerResult.metadata.provider,
              cachedTokens: providerResult.metadata.cachedTokens || 0,
              savingsPercentage: providerResult.metadata.savingsPercentage || 0,
              estimatedSavings: {
                tokens: providerResult.estimatedSavings.tokens,
                costReduction: providerResult.estimatedSavings.costReduction,
              },
            }
          }
        } catch (error) {
          console.warn('Provider caching failed:', error)
        }
      }

      // Step 3: Compress
      let compressedPrompt = optimizedPrompt
      let compressedTokens = originalTokens
      if (compressor) {
        const result = compressor.compress(optimizedPrompt)
        compressedPrompt = result.compressed
        // Estimate compressed tokens from character ratio
        compressedTokens = Math.ceil(
          originalTokens * (result.compressedSize / result.originalSize)
        )
      }

      // Step 4: Route
      let recommendedModel = availableModels[0] || model
      if (router) {
        const result = router.route(compressedPrompt)
        recommendedModel = result.selectedModel?.id ?? recommendedModel
      }

      // Calculate total savings including provider caching
      let tokensSaved = originalTokens - compressedTokens
      if (providerCacheApplied && providerCacheMetadata) {
        // Provider caching provides 90% reduction on cached tokens
        tokensSaved += Math.floor(
          providerCacheMetadata.cachedTokens *
            providerCacheMetadata.savingsPercentage
        )
      }

      stats.tokensProcessed += originalTokens
      stats.tokensSaved += tokensSaved

      return {
        cachedResponse: undefined,
        compressedPrompt,
        recommendedModel,
        tokensSaved,
        estimatedCostSaved: tokensSaved * 0.00001,
        providerCacheMetadata,
      }
    },

    getStats: () => ({
      cache: cache?.getStats() ?? null,
      router: router?.getStats() ?? {
        totalRoutes: 0,
        routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
        estimatedSavings: 0,
        averageComplexity: 0,
      },
      tokensProcessed: stats.tokensProcessed,
      tokensSaved: stats.tokensSaved,
    }),

    resetStats: () => {
      router?.resetStats()
      stats = { tokensProcessed: 0, tokensSaved: 0 }
    },

    clearCache: () => {
      cache?.clear()
    },

    dispose: () => {
      cache?.clear()
    },
  }
}

/**
 * Presets for quick configuration
 */
export const OptimizerPresets = PRESETS
