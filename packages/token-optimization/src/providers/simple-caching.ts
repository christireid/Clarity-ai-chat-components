/**
 * Simple Provider Caching API
 *
 * Functional API with sensible defaults for easy provider caching.
 * Recommended for most use cases.
 *
 * @module providers/simple-caching
 */

import { ProviderCachingManager } from './prompt-caching'
import { SimpleTokenCounter } from '../tokenizers/simple-counter'
import type {
  CacheableMessage,
  ProviderCachingResult,
  CachingProvider,
} from './types'

/**
 * Simple provider caching configuration
 */
export interface SimpleProviderCachingConfig {
  /**
   * Provider to use
   * @default 'anthropic'
   */
  provider?: CachingProvider

  /**
   * Minimum tokens before caching (applies to all providers)
   * @default 1024
   */
  minTokens?: number

  /**
   * Enable automatic provider selection based on content
   * @default false
   */
  autoSelectProvider?: boolean
}

/**
 * Create a provider caching function with sensible defaults
 *
 * @example
 * ```typescript
 * const cache = createProviderCache()
 *
 * const result = await cache([
 *   { role: 'system', content: largeSystemPrompt },
 *   { role: 'user', content: userQuery }
 * ])
 *
 * // Use result.messages in your API call
 * // Check result.estimatedSavings to see potential cost reduction
 * ```
 */
export function createProviderCache(config: SimpleProviderCachingConfig = {}) {
  const {
    provider = 'anthropic',
    minTokens = 1024,
    autoSelectProvider = false,
  } = config

  // Create token counter with simple defaults
  const tokenCounter = new SimpleTokenCounter()

  // Create manager with optimized config
  const manager = new ProviderCachingManager(
    {
      enabled: true,
      provider,
      anthropic: {
        minCachedTokens: minTokens,
        maxBreakpoints: 4,
        autoDetectBreakpoints: true,
        defaultTTL: '5m',
      },
      openai: {
        optimizeMessageOrder: true,
        retention: 'in_memory',
      },
      google: {
        mode: 'implicit',
        autoCreateCache: true,
        defaultTTL: '3600s',
      },
    },
    tokenCounter
  )

  return async (
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> => {
    // Auto-select provider if enabled
    if (autoSelectProvider) {
      const totalTokens = messages.reduce(
        (sum, msg) =>
          sum +
          tokenCounter.count(
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)
          ),
        0
      )

      // Use Anthropic for structured prompts, OpenAI for large contexts
      const selectedProvider: CachingProvider =
        totalTokens > 5000 ? 'openai' : 'anthropic'

      return manager.applyCaching(messages, selectedProvider)
    }

    return manager.applyCaching(messages, provider)
  }
}

/**
 * Quick provider caching with zero configuration
 *
 * @example
 * ```typescript
 * const result = await quickCache([
 *   { role: 'system', content: 'You are a helpful assistant' },
 *   { role: 'user', content: 'Hello!' }
 * ])
 * ```
 */
export async function quickCache(
  messages: CacheableMessage[],
  provider: CachingProvider = 'anthropic'
): Promise<ProviderCachingResult> {
  const cache = createProviderCache({ provider })
  return cache(messages)
}

/**
 * Provider-specific quick caching functions
 */
export const anthropicCache = (messages: CacheableMessage[]) =>
  quickCache(messages, 'anthropic')

export const openaiCache = (messages: CacheableMessage[]) =>
  quickCache(messages, 'openai')

export const googleCache = (messages: CacheableMessage[]) =>
  quickCache(messages, 'google')

/**
 * Estimate potential savings before applying caching
 */
export async function estimateCacheSavings(
  messages: CacheableMessage[],
  provider: CachingProvider = 'anthropic'
): Promise<{
  eligible: boolean
  estimatedTokens: number
  estimatedSavingsPercent: number
  recommendation: string
}> {
  const counter = new SimpleTokenCounter()

  const totalTokens = messages.reduce(
    (sum, msg) =>
      sum +
      counter.count(
        typeof msg.content === 'string'
          ? msg.content
          : JSON.stringify(msg.content)
      ),
    0
  )

  const eligible = totalTokens >= 1024

  if (!eligible) {
    return {
      eligible: false,
      estimatedTokens: totalTokens,
      estimatedSavingsPercent: 0,
      recommendation: `Need at least 1024 tokens for ${provider} caching. Current: ${totalTokens} tokens.`,
    }
  }

  // Estimate cacheable portion (typically system messages + early context)
  const cacheableTokens = Math.floor(totalTokens * 0.7) // Conservative 70%

  return {
    eligible: true,
    estimatedTokens: cacheableTokens,
    estimatedSavingsPercent: 90, // All providers offer 90% savings
    recommendation: `${provider} caching enabled. Expected to cache ~${cacheableTokens} tokens with 90% cost reduction.`,
  }
}
