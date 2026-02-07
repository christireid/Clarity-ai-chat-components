/**
 * Provider-Native Prompt Caching Formatter
 *
 * ⚠️ IMPORTANT: This module FORMATS messages for provider-native caching.
 * It does NOT implement actual caching or make API calls.
 *
 * Formats messages with provider-specific cache control markers:
 * - Anthropic: cache_control breakpoints
 * - OpenAI: Message reordering for automatic caching
 * - Google: Cache metadata preparation
 *
 * To use provider caching:
 * 1. Format messages using this module
 * 2. Make API calls to provider with formatted messages
 * 3. Track actual costs to measure real savings
 *
 * @module providers/prompt-caching
 */

import type {
  CachingProvider,
  AnthropicContentBlock,
  AnthropicMessage,
  AnthropicCacheControl,
  OpenAIUsageMetadata,
  ProviderCachingConfig,
  ProviderCachingResult,
  ProviderCacheMetadata,
  CacheableMessage,
  TokenCounter,
} from './types'

/**
 * Default configuration for provider caching
 */
const DEFAULT_CONFIG: ProviderCachingConfig = {
  enabled: true,
  provider: 'anthropic',
  anthropic: {
    defaultTTL: '5m',
    minCachedTokens: 1024,
    maxBreakpoints: 4,
    autoDetectBreakpoints: true,
  },
  openai: {
    retention: 'in_memory',
    optimizeMessageOrder: true,
  },
  google: {
    mode: 'implicit',
    defaultTTL: '3600s',
    autoCreateCache: true,
  },
}

/**
 * Provider-Native Caching Formatter
 *
 * ⚠️ IMPORTANT: This class only FORMATS messages with cache control markers.
 * It does NOT make API calls or implement actual caching. You must:
 * 1. Use this class to format messages with cache markers
 * 2. Make provider API calls yourself with the formatted messages
 * 3. Make repeated API calls to benefit from provider caching
 * 4. Track actual costs to measure real savings
 *
 * Provider-specific formatting:
 * - Anthropic: Adds cache_control breakpoints to message blocks
 * - OpenAI: Reorders messages to optimize automatic caching (≥1024 tokens)
 * - Google: Prepares metadata for implicit/explicit caching modes
 *
 * @example
 * const formatter = new ProviderCachingFormatter({ provider: 'anthropic' })
 * const { messages } = await formatter.formatMessagesForCaching(myMessages)
 *
 * // YOU implement the actual caching:
 * const response = await anthropic.messages.create({
 *   messages,  // Uses formatted messages
 *   model: 'claude-3-5-sonnet-20241022',
 *   // ... other params
 * })
 */
export class ProviderCachingFormatter {
  private config: ProviderCachingConfig
  private tokenCounter?: TokenCounter

  constructor(
    config: Partial<ProviderCachingConfig> = {},
    tokenCounter?: TokenCounter
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.tokenCounter = tokenCounter
  }

  /**
   * Format messages for provider-native caching
   *
   * ⚠️ This method ONLY formats messages. It does NOT:
   * - Make API calls to providers
   * - Store or retrieve cached content
   * - Guarantee any cost savings
   *
   * You must implement provider API calls yourself to use caching.
   *
   * @param messages - Array of messages to format
   * @param provider - Target provider (defaults to config.provider)
   * @returns Formatting result with cache-optimized messages
   */
  async formatMessagesForCaching(
    messages: CacheableMessage[],
    provider?: CachingProvider
  ): Promise<ProviderCachingResult> {
    const targetProvider = provider || this.config.provider

    if (!this.config.enabled) {
      return this.createNoCacheResult(messages)
    }

    switch (targetProvider) {
      case 'anthropic':
        return this.applyAnthropicCaching(messages)
      case 'openai':
        return this.applyOpenAICaching(messages)
      case 'google':
        return this.applyGoogleCaching(messages)
      default:
        return this.createNoCacheResult(messages)
    }
  }

  /**
   * Anthropic: Insert cache_control breakpoints
   *
   * Strategy:
   * 1. Identify static content (system messages, tool definitions)
   * 2. Calculate token counts
   * 3. Insert cache_control at optimal locations
   * 4. Respect minimum token threshold and max breakpoints
   */
  private async applyAnthropicCaching(
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> {
    const config = this.config.anthropic!
    const minTokens = config.minCachedTokens || 1024
    const maxBreakpoints = config.maxBreakpoints || 4
    const ttl = config.defaultTTL || '5m'

    // Convert to Anthropic format
    const anthropicMessages: AnthropicMessage[] = []
    let breakpointsAdded = 0
    let totalCachedTokens = 0

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      const isStatic = this.isStaticContent(msg, i, messages.length)
      const shouldCache =
        isStatic && msg.cacheable !== false && breakpointsAdded < maxBreakpoints

      // Count tokens if we have a counter
      const tokenCount = this.tokenCounter
        ? this.tokenCounter.count(
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)
          )
        : 0

      if (shouldCache && tokenCount >= minTokens) {
        // Convert content to block format with cache_control
        const blocks = this.convertToAnthropicBlocks(msg.content, {
          type: 'ephemeral',
          ttl,
        })

        anthropicMessages.push({
          role: msg.role === 'system' ? 'user' : msg.role, // Anthropic doesn't have system role in messages
          content: blocks,
        })

        breakpointsAdded++
        totalCachedTokens += tokenCount
      } else {
        // Standard message without caching
        anthropicMessages.push({
          role: msg.role === 'system' ? 'user' : msg.role,
          content:
            typeof msg.content === 'string'
              ? msg.content
              : this.convertToAnthropicBlocks(msg.content),
        })
      }
    }

    const estimatedSavings = this.calculateSavings(
      totalCachedTokens,
      0.9 // 90% savings on cached tokens
    )

    const metadata: ProviderCacheMetadata = {
      provider: 'anthropic',
      cachedTokens: totalCachedTokens,
      savingsPercentage: estimatedSavings.percentage,
      createdAt: new Date().toISOString(),
      providerDetails: {
        breakpointCount: breakpointsAdded,
        ttl,
      },
    }

    const recommendations: string[] = []
    if (breakpointsAdded === 0) {
      recommendations.push(
        `No cache breakpoints added. Ensure messages exceed ${minTokens} tokens.`
      )
    }
    if (breakpointsAdded === maxBreakpoints) {
      recommendations.push(
        'Maximum cache breakpoints reached. Consider increasing maxBreakpoints if needed.'
      )
    }

    return {
      cached: breakpointsAdded > 0,
      messages: anthropicMessages,
      metadata,
      estimatedSavings,
      recommendations,
    }
  }

  /**
   * OpenAI: Optimize message order for automatic caching
   *
   * Strategy:
   * 1. OpenAI automatically caches prompts ≥1024 tokens
   * 2. Reorder messages to put static content first
   * 3. No explicit cache control needed
   */
  private async applyOpenAICaching(
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> {
    const config = this.config.openai!
    const shouldOptimize = config.optimizeMessageOrder ?? true

    let optimizedMessages = [...messages]
    let totalTokens = 0
    let staticTokens = 0

    // Calculate token counts
    for (const msg of messages) {
      const tokenCount = this.tokenCounter
        ? this.tokenCounter.count(
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)
          )
        : 0

      totalTokens += tokenCount

      if (this.isStaticContent(msg, messages.indexOf(msg), messages.length)) {
        staticTokens += tokenCount
      }
    }

    // Reorder if optimization is enabled and beneficial
    if (shouldOptimize && staticTokens > 1024) {
      const staticMessages = messages.filter((msg, idx) =>
        this.isStaticContent(msg, idx, messages.length)
      )
      const dynamicMessages = messages.filter(
        (msg, idx) => !this.isStaticContent(msg, idx, messages.length)
      )

      optimizedMessages = [...staticMessages, ...dynamicMessages]
    }

    const estimatedSavings = this.calculateSavings(
      staticTokens >= 1024 ? staticTokens : 0,
      0.9 // 90% savings on cached tokens
    )

    const metadata: ProviderCacheMetadata = {
      provider: 'openai',
      cachedTokens: staticTokens >= 1024 ? staticTokens : 0,
      savingsPercentage: estimatedSavings.percentage,
      createdAt: new Date().toISOString(),
      providerDetails: {
        retention: config.retention || 'in_memory',
        cacheHitRate: staticTokens >= 1024 ? 0.9 : 0,
      },
    }

    const recommendations: string[] = []
    if (totalTokens < 1024) {
      recommendations.push(
        'Total prompt is below 1024 tokens. OpenAI caching requires ≥1024 tokens.'
      )
    }
    if (staticTokens < 1024 && totalTokens >= 1024) {
      recommendations.push(
        'Static content is below 1024 tokens. Consider consolidating static messages.'
      )
    }

    return {
      cached: staticTokens >= 1024,
      messages: optimizedMessages,
      metadata,
      estimatedSavings,
      recommendations,
    }
  }

  /**
   * Google: Apply implicit or explicit caching
   *
   * Strategy:
   * 1. Implicit mode: Similar to OpenAI, automatic
   * 2. Explicit mode: Create cached content, return cache ID
   */
  private async applyGoogleCaching(
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> {
    const config = this.config.google!
    const mode = config.mode || 'implicit'

    if (mode === 'implicit') {
      // Similar to OpenAI - automatic caching
      return this.applyGoogleImplicitCaching(messages)
    } else {
      // Explicit mode - would require API call to create cache
      return this.applyGoogleExplicitCaching(messages)
    }
  }

  /**
   * Google implicit caching (automatic like OpenAI)
   */
  private async applyGoogleImplicitCaching(
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> {
    // Google's implicit caching works automatically for large prompts
    // Just return optimized message order
    let totalTokens = 0

    for (const msg of messages) {
      const tokenCount = this.tokenCounter
        ? this.tokenCounter.count(
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)
          )
        : 0
      totalTokens += tokenCount
    }

    const estimatedSavings = this.calculateSavings(
      totalTokens >= 1024 ? totalTokens * 0.7 : 0, // Estimate 70% of content is cacheable
      0.9
    )

    const metadata: ProviderCacheMetadata = {
      provider: 'google',
      cachedTokens: totalTokens >= 1024 ? Math.floor(totalTokens * 0.7) : 0,
      savingsPercentage: estimatedSavings.percentage,
      createdAt: new Date().toISOString(),
    }

    return {
      cached: totalTokens >= 1024,
      messages,
      metadata,
      estimatedSavings,
      recommendations:
        totalTokens < 1024
          ? [
              'Prompt is below recommended size for automatic caching. Consider explicit caching mode.',
            ]
          : [],
    }
  }

  /**
   * Google explicit caching (manual cache creation)
   *
   * Note: This returns metadata for cache creation.
   * Actual API call should be made by the caller.
   */
  private async applyGoogleExplicitCaching(
    messages: CacheableMessage[]
  ): Promise<ProviderCachingResult> {
    const config = this.config.google!
    let totalTokens = 0

    for (const msg of messages) {
      const tokenCount = this.tokenCounter
        ? this.tokenCounter.count(
            typeof msg.content === 'string'
              ? msg.content
              : JSON.stringify(msg.content)
          )
        : 0
      totalTokens += tokenCount
    }

    const estimatedSavings = this.calculateSavings(totalTokens, 0.9)

    const metadata: ProviderCacheMetadata = {
      provider: 'google',
      cacheKey: config.cacheId || `cache-${Date.now()}`,
      cachedTokens: totalTokens,
      savingsPercentage: estimatedSavings.percentage,
      createdAt: new Date().toISOString(),
      expiresAt: this.calculateExpiry(config.defaultTTL || '3600s'),
      providerDetails: {
        cacheId: config.cacheId,
      },
    }

    return {
      cached: true,
      messages,
      metadata,
      estimatedSavings,
      recommendations: [
        'Explicit cache mode: Create cache with Google Caches API before making requests.',
        `Use cache ID in subsequent requests for ${config.defaultTTL || '3600s'} TTL.`,
      ],
    }
  }

  /**
   * Helper: Determine if content is static (cacheable)
   */
  private isStaticContent(
    message: CacheableMessage,
    index: number,
    totalMessages: number
  ): boolean {
    // Explicit cache weight
    if (message.cacheWeight !== undefined) {
      return message.cacheWeight > 0.5
    }

    // Explicit cacheable flag
    if (message.cacheable !== undefined) {
      return message.cacheable
    }

    // System messages are typically static
    if (message.role === 'system') {
      return true
    }

    // First few messages are likely static (system prompts, tool definitions)
    if (index < 2) {
      return true
    }

    // Last message is typically user query (dynamic)
    if (index === totalMessages - 1) {
      return false
    }

    // Default: assume non-static
    return false
  }

  /**
   * Helper: Convert content to Anthropic block format
   */
  private convertToAnthropicBlocks(
    content: string | any[],
    cacheControl?: AnthropicCacheControl
  ): AnthropicContentBlock[] {
    if (typeof content === 'string') {
      const block: AnthropicContentBlock = {
        type: 'text',
        text: content,
      }

      if (cacheControl) {
        block.cache_control = cacheControl
      }

      return [block]
    }

    // Already in block format
    if (Array.isArray(content)) {
      const blocks = content as AnthropicContentBlock[]

      // Add cache control to last block if requested
      if (cacheControl && blocks.length > 0) {
        const lastBlock = blocks[blocks.length - 1]
        lastBlock.cache_control = cacheControl
      }

      return blocks
    }

    return []
  }

  /**
   * Helper: Calculate savings estimate
   */
  private calculateSavings(
    cachedTokens: number,
    savingsRate: number
  ): {
    tokens: number
    percentage: number
    costReduction: number
  } {
    const tokensSaved = Math.floor(cachedTokens * savingsRate)
    const percentage = cachedTokens > 0 ? savingsRate : 0
    const costReduction = percentage // 90% cost reduction

    return {
      tokens: tokensSaved,
      percentage,
      costReduction,
    }
  }

  /**
   * Helper: Calculate expiry time from TTL string
   */
  private calculateExpiry(ttl: string): string {
    // Parse duration string like "3600s" or "1h"
    const seconds = ttl.endsWith('s')
      ? parseInt(ttl.slice(0, -1), 10)
      : ttl === '1h'
        ? 3600
        : 300 // default 5m

    const expiryDate = new Date(Date.now() + seconds * 1000)
    return expiryDate.toISOString()
  }

  /**
   * Helper: Create no-cache result
   */
  private createNoCacheResult(
    messages: CacheableMessage[]
  ): ProviderCachingResult {
    return {
      cached: false,
      messages,
      metadata: {
        provider: this.config.provider,
        cachedTokens: 0,
        savingsPercentage: 0,
      },
      estimatedSavings: {
        tokens: 0,
        percentage: 0,
        costReduction: 0,
      },
      recommendations: ['Provider caching is disabled.'],
    }
  }

  /**
   * Parse OpenAI response to extract cache metrics
   */
  static parseOpenAIUsage(usage: OpenAIUsageMetadata): {
    cachedTokens: number
    totalTokens: number
    cacheHitRate: number
    costSavings: number
  } {
    const cachedTokens = usage.prompt_tokens_details.cached_tokens
    const totalTokens = usage.total_tokens
    const cacheHitRate =
      usage.prompt_tokens > 0 ? cachedTokens / usage.prompt_tokens : 0
    const costSavings = cacheHitRate * 0.9 // 90% savings on cached tokens

    return {
      cachedTokens,
      totalTokens,
      cacheHitRate,
      costSavings,
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ProviderCachingConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): ProviderCachingConfig {
    return { ...this.config }
  }
}

/**
 * Convenience function: Format messages for provider caching
 *
 * ⚠️ This function ONLY formats messages. You must make provider API calls yourself.
 */
export async function formatMessagesForProviderCaching(
  messages: CacheableMessage[],
  config: Partial<ProviderCachingConfig> = {},
  tokenCounter?: TokenCounter
): Promise<ProviderCachingResult> {
  const formatter = new ProviderCachingFormatter(config, tokenCounter)
  return formatter.formatMessagesForCaching(messages)
}

/**
 * Convenience function: Parse OpenAI cache metrics
 */
export function parseOpenAICacheMetrics(usage: OpenAIUsageMetadata) {
  return ProviderCachingFormatter.parseOpenAIUsage(usage)
}
