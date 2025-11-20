/**
 * Enhanced Token Optimization Hook
 *
 * Next-generation token optimization with:
 * - TOON support (30-60% savings on structured data)
 * - Accurate tokenization (tiktoken)
 * - Prompt caching (50-90% savings)
 * - Advanced semantic caching
 * - Real-time cost tracking
 * - All existing optimizations
 */

'use client'

import * as React from 'react'
import type { CoreMessage } from './use-chat-enhanced'

// Import new utilities
import { jsonToToon, autoOptimize, formatForLLM, parseFlexible, type ToonOptimizationResult } from '../utils/toon'
import { countTokens, countConversationTokens, type TokenCount, type ModelName } from '../utils/tokenization'
import { calculateCost, type CostCalculation } from '../utils/tokenization/model-pricing'
import { PromptCacheManager, createAnthropicCachedMessages, type CacheStats } from '../utils/prompt-caching'

// Import existing utilities
import { compressPrompt, type CompressionResult } from '../utils/prompt-compression'
import { SmartCache } from '../utils/smart-cache'

export interface EnhancedTokenOptimizationOptions {
  /** Model to use */
  model?: ModelName

  /** Enable TOON format optimization */
  enableToon?: boolean
  /** Minimum TOON savings threshold */
  toonMinSavings?: number

  /** Enable accurate tokenization (requires js-tiktoken) */
  enableAccurateTokenization?: boolean

  /** Enable prompt caching */
  enablePromptCaching?: boolean
  /** Prompt caching provider */
  cachingProvider?: 'anthropic' | 'openai' | 'auto'

  /** Enable semantic caching */
  enableSemanticCaching?: boolean
  /** Similarity threshold for semantic caching */
  similarityThreshold?: number

  /** Enable prompt compression */
  enablePromptCompression?: boolean
  /** Compression aggressiveness */
  compressionLevel?: 'conservative' | 'balanced' | 'aggressive'

  /** Enable real-time cost tracking */
  enableCostTracking?: boolean

  /** Enable statistics collection */
  enableStats?: boolean
}

export interface EnhancedOptimizationStats {
  /** TOON optimization */
  toon: {
    conversions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }

  /** Prompt compression */
  compression: {
    compressions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }

  /** Prompt caching */
  cache: CacheStats

  /** Semantic caching */
  semanticCache: {
    hits: number
    misses: number
    hitRate: number
    tokensSaved: number
  }

  /** Accurate tokenization */
  tokenization: {
    accurateCount: number
    estimatedCount: number
    accuracyRate: number
  }

  /** Cost tracking */
  costs: {
    totalCost: number
    inputCost: number
    outputCost: number
    cachedCost: number
    savingsFromOptimization: number
  }

  /** Overall */
  overall: {
    totalTokensSaved: number
    totalCostSaved: number
    averageSavingsPercent: number
  }
}

export interface EnhancedOptimizationResult {
  /** Optimized content */
  content: string
  /** Format used */
  format: 'json' | 'toon' | 'text'
  /** Token count */
  tokens: TokenCount
  /** Cost calculation */
  cost?: CostCalculation
  /** Optimization breakdown */
  optimizations: {
    toon?: ToonOptimizationResult
    compression?: CompressionResult
    cached?: boolean
  }
}

/**
 * Enhanced Token Optimization Hook
 *
 * @example
 * ```tsx
 * const {
 *   optimizeData,
 *   optimizePrompt,
 *   prepareMessages,
 *   stats,
 *   resetStats
 * } = useTokenOptimizationEnhanced({
 *   model: 'claude-3-5-sonnet',
 *   enableToon: true,
 *   enablePromptCaching: true,
 *   enableSemanticCaching: true
 * })
 *
 * // Optimize structured data (uses TOON if beneficial)
 * const optimized = await optimizeData(myData)
 * console.log(`Saved ${optimized.optimizations.toon?.savingsPercent}%`)
 *
 * // Prepare messages with cache control
 * const messages = prepareMessages(conversationMessages)
 *
 * // Track total savings
 * console.log(`Total saved: $${stats.overall.totalCostSaved.toFixed(4)}`)
 * ```
 */
export function useTokenOptimizationEnhanced(
  options: EnhancedTokenOptimizationOptions = {}
): {
  /** Optimize structured data (auto TOON/JSON) */
  optimizeData: (data: any) => Promise<EnhancedOptimizationResult>

  /** Optimize text prompt */
  optimizePrompt: (prompt: string) => Promise<EnhancedOptimizationResult>

  /** Prepare messages with caching */
  prepareMessages: (
    messages: CoreMessage[]
  ) => Array<{
    role: string
    content: string
    cache_control?: { type: 'ephemeral' }
  }>

  /** Parse response (handles TOON/JSON) */
  parseResponse: (response: string) => any

  /** Count tokens accurately */
  countTokens: (text: string) => Promise<TokenCount>

  /** Calculate cost */
  calculateCost: (params: { inputTokens: number; outputTokens: number }) => CostCalculation

  /** Get statistics */
  stats: EnhancedOptimizationStats

  /** Reset statistics */
  resetStats: () => void
} {
  const {
    model = 'gpt-4',
    enableToon = true,
    toonMinSavings = 20,
    enableAccurateTokenization = true,
    enablePromptCaching = false,
    cachingProvider = 'auto',
    enableSemanticCaching = false,
    similarityThreshold = 0.85,
    enablePromptCompression = true,
    compressionLevel = 'balanced',
    enableCostTracking = true,
    enableStats = true,
  } = options

  // Initialize managers
  const promptCacheManager = React.useMemo(
    () =>
      new PromptCacheManager({
        provider: cachingProvider,
        model,
        trackStats: enableStats,
      }),
    [cachingProvider, model, enableStats]
  )

  const semanticCache = React.useMemo(
    () =>
      enableSemanticCaching
        ? new SmartCache({
            maxSize: 100,
            enableSemanticMatching: true,
            similarityThreshold,
          })
        : null,
    [enableSemanticCaching, similarityThreshold]
  )

  // Statistics
  const [stats, setStats] = React.useState<EnhancedOptimizationStats>({
    toon: {
      conversions: 0,
      totalTokensSaved: 0,
      averageSavingsPercent: 0,
    },
    compression: {
      compressions: 0,
      totalTokensSaved: 0,
      averageSavingsPercent: 0,
    },
    cache: promptCacheManager.getStats(),
    semanticCache: {
      hits: 0,
      misses: 0,
      hitRate: 0,
      tokensSaved: 0,
    },
    tokenization: {
      accurateCount: 0,
      estimatedCount: 0,
      accuracyRate: 0,
    },
    costs: {
      totalCost: 0,
      inputCost: 0,
      outputCost: 0,
      cachedCost: 0,
      savingsFromOptimization: 0,
    },
    overall: {
      totalTokensSaved: 0,
      totalCostSaved: 0,
      averageSavingsPercent: 0,
    },
  })

  /**
   * Optimize structured data
   */
  const optimizeData = React.useCallback(
    async (data: any): Promise<EnhancedOptimizationResult> => {
      // Apply TOON optimization
      let content: string
      let format: 'json' | 'toon' = 'json'
      let toonResult: ToonOptimizationResult | undefined

      if (enableToon) {
        const result = autoOptimize(data, { minSavingsPercent: toonMinSavings })
        content = result.data
        format = result.format
        toonResult = result

        // Update stats
        if (enableStats && result.format === 'toon') {
          setStats(prev => ({
            ...prev,
            toon: {
              conversions: prev.toon.conversions + 1,
              totalTokensSaved: prev.toon.totalTokensSaved + result.tokensSaved,
              averageSavingsPercent:
                (prev.toon.averageSavingsPercent * prev.toon.conversions + result.savingsPercent) /
                (prev.toon.conversions + 1),
            },
          }))
        }
      } else {
        content = JSON.stringify(data)
      }

      // Count tokens
      const tokens = await countTokens(content, {
        model,
        preferAccurate: enableAccurateTokenization,
      })

      // Update tokenization stats
      if (enableStats) {
        setStats(prev => ({
          ...prev,
          tokenization: {
            accurateCount:
              prev.tokenization.accurateCount + (tokens.method === 'accurate' ? 1 : 0),
            estimatedCount:
              prev.tokenization.estimatedCount + (tokens.method === 'estimated' ? 1 : 0),
            accuracyRate:
              ((prev.tokenization.accurateCount + (tokens.method === 'accurate' ? 1 : 0)) /
                (prev.tokenization.accurateCount +
                  prev.tokenization.estimatedCount +
                  1)) *
              100,
          },
        }))
      }

      // Calculate cost
      let cost: CostCalculation | undefined
      if (enableCostTracking) {
        cost = calculateCost({
          model,
          inputTokens: tokens.total,
          outputTokens: 0,
        })

        setStats(prev => ({
          ...prev,
          costs: {
            ...prev.costs,
            inputCost: prev.costs.inputCost + cost!.inputCost,
            totalCost: prev.costs.totalCost + cost!.totalCost,
          },
        }))
      }

      return {
        content,
        format,
        tokens,
        cost,
        optimizations: {
          toon: toonResult,
        },
      }
    },
    [
      enableToon,
      toonMinSavings,
      model,
      enableAccurateTokenization,
      enableCostTracking,
      enableStats,
    ]
  )

  /**
   * Optimize text prompt
   */
  const optimizePrompt = React.useCallback(
    async (prompt: string): Promise<EnhancedOptimizationResult> => {
      let content = prompt
      let compressionResult: CompressionResult | undefined

      // Apply compression
      if (enablePromptCompression) {
        const options =
          compressionLevel === 'aggressive'
            ? { removeFillers: true, useAbbreviations: true, reducePunctuation: true }
            : compressionLevel === 'conservative'
            ? { removeFillers: false, useAbbreviations: false, reducePunctuation: true }
            : { removeFillers: true, useAbbreviations: false, reducePunctuation: true }

        compressionResult = compressPrompt(prompt, options)
        content = compressionResult.compressed

        // Update stats
        if (enableStats) {
          setStats(prev => ({
            ...prev,
            compression: {
              compressions: prev.compression.compressions + 1,
              totalTokensSaved: prev.compression.totalTokensSaved + compressionResult!.tokenSavings,
              averageSavingsPercent:
                (prev.compression.averageSavingsPercent * prev.compression.compressions +
                  compressionResult!.savingsPercent) /
                (prev.compression.compressions + 1),
            },
          }))
        }
      }

      // Count tokens
      const tokens = await countTokens(content, {
        model,
        preferAccurate: enableAccurateTokenization,
      })

      // Calculate cost
      let cost: CostCalculation | undefined
      if (enableCostTracking) {
        cost = calculateCost({
          model,
          inputTokens: tokens.total,
          outputTokens: 0,
        })

        setStats(prev => ({
          ...prev,
          costs: {
            ...prev.costs,
            inputCost: prev.costs.inputCost + cost!.inputCost,
            totalCost: prev.costs.totalCost + cost!.totalCost,
          },
        }))
      }

      return {
        content,
        format: 'text',
        tokens,
        cost,
        optimizations: {
          compression: compressionResult,
        },
      }
    },
    [
      enablePromptCompression,
      compressionLevel,
      model,
      enableAccurateTokenization,
      enableCostTracking,
      enableStats,
    ]
  )

  /**
   * Prepare messages with caching
   */
  const prepareMessages = React.useCallback(
    (messages: CoreMessage[]) => {
      if (!enablePromptCaching) {
        return messages as any
      }

      // Extract system prompt
      const systemMessage = messages.find(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')

      const systemPrompt = systemMessage
        ? typeof systemMessage.content === 'string'
          ? systemMessage.content
          : JSON.stringify(systemMessage.content)
        : ''

      // Prepare with cache control
      if (cachingProvider === 'anthropic' || cachingProvider === 'auto') {
        return createAnthropicCachedMessages(
          systemPrompt,
          conversationMessages.map(m => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          }))
        )
      }

      return messages as any
    },
    [enablePromptCaching, cachingProvider]
  )

  /**
   * Parse response
   */
  const parseResponse = React.useCallback((response: string): any => {
    return parseFlexible(response)
  }, [])

  /**
   * Count tokens wrapper
   */
  const countTokensWrapper = React.useCallback(
    async (text: string): Promise<TokenCount> => {
      return countTokens(text, {
        model,
        preferAccurate: enableAccurateTokenization,
      })
    },
    [model, enableAccurateTokenization]
  )

  /**
   * Calculate cost wrapper
   */
  const calculateCostWrapper = React.useCallback(
    (params: { inputTokens: number; outputTokens: number }): CostCalculation => {
      return calculateCost({
        model,
        ...params,
      })
    },
    [model]
  )

  /**
   * Reset statistics
   */
  const resetStats = React.useCallback(() => {
    setStats({
      toon: {
        conversions: 0,
        totalTokensSaved: 0,
        averageSavingsPercent: 0,
      },
      compression: {
        compressions: 0,
        totalTokensSaved: 0,
        averageSavingsPercent: 0,
      },
      cache: promptCacheManager.getStats(),
      semanticCache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
        tokensSaved: 0,
      },
      tokenization: {
        accurateCount: 0,
        estimatedCount: 0,
        accuracyRate: 0,
      },
      costs: {
        totalCost: 0,
        inputCost: 0,
        outputCost: 0,
        cachedCost: 0,
        savingsFromOptimization: 0,
      },
      overall: {
        totalTokensSaved: 0,
        totalCostSaved: 0,
        averageSavingsPercent: 0,
      },
    })
    promptCacheManager.resetStats()
  }, [promptCacheManager])

  // Update overall stats periodically
  React.useEffect(() => {
    if (!enableStats) return

    const totalTokensSaved =
      stats.toon.totalTokensSaved +
      stats.compression.totalTokensSaved +
      stats.cache.tokensSaved +
      stats.semanticCache.tokensSaved

    const totalCostSaved =
      stats.costs.savingsFromOptimization + stats.cache.costSaved

    setStats(prev => ({
      ...prev,
      overall: {
        totalTokensSaved,
        totalCostSaved,
        averageSavingsPercent:
          (stats.toon.averageSavingsPercent + stats.compression.averageSavingsPercent) / 2,
      },
    }))
  }, [
    stats.toon,
    stats.compression,
    stats.cache,
    stats.semanticCache,
    stats.costs,
    enableStats,
  ])

  return {
    optimizeData,
    optimizePrompt,
    prepareMessages,
    parseResponse,
    countTokens: countTokensWrapper,
    calculateCost: calculateCostWrapper,
    stats,
    resetStats,
  }
}
