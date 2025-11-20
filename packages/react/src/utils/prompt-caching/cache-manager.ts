/**
 * Prompt Caching Manager
 *
 * Manages prompt caching for Anthropic and OpenAI models
 * Can achieve 50-90% cost reduction on repeated context
 */

export type CacheProvider = 'anthropic' | 'openai' | 'auto'

export interface CacheableContent {
  /** Content to cache */
  content: string
  /** Cache type */
  type: 'system' | 'context' | 'document' | 'code' | 'custom'
  /** Minimum length to cache (tokens) */
  minLength?: number
  /** Cache TTL override */
  ttl?: number
  /** Cache priority (higher = more important) */
  priority?: number
}

export interface CacheStats {
  /** Total cache requests */
  requests: number
  /** Cache hits */
  hits: number
  /** Cache misses */
  misses: number
  /** Hit rate percentage */
  hitRate: number
  /** Tokens saved from caching */
  tokensSaved: number
  /** Cost saved in dollars */
  costSaved: number
}

export interface PromptCacheOptions {
  /** Provider to use */
  provider?: CacheProvider
  /** Model name */
  model?: string
  /** Default minimum length to cache (tokens) */
  defaultMinLength?: number
  /** Enable automatic cache management */
  autoManage?: boolean
  /** Track statistics */
  trackStats?: boolean
}

/**
 * Prompt Cache Manager
 *
 * Manages caching of prompts across different providers
 *
 * @example
 * ```ts
 * const cacheManager = new PromptCacheManager({
 *   provider: 'anthropic',
 *   model: 'claude-3-5-sonnet'
 * })
 *
 * // Mark content for caching
 * const messages = cacheManager.prepareMessages([
 *   { role: 'system', content: longSystemPrompt },
 *   { role: 'user', content: userQuery }
 * ])
 *
 * // 90% cost reduction on cached system prompt!
 * ```
 */
export class PromptCacheManager {
  private options: Required<PromptCacheOptions>
  private stats: CacheStats = {
    requests: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    tokensSaved: 0,
    costSaved: 0,
  }
  private cacheRegistry = new Map<string, CacheableContent>()

  constructor(options: PromptCacheOptions = {}) {
    this.options = {
      provider: options.provider ?? 'auto',
      model: options.model ?? 'claude-3-5-sonnet',
      defaultMinLength: options.defaultMinLength ?? 1024,
      autoManage: options.autoManage ?? true,
      trackStats: options.trackStats ?? true,
    }
  }

  /**
   * Register content for caching
   */
  registerCacheable(id: string, content: CacheableContent): void {
    this.cacheRegistry.set(id, content)
  }

  /**
   * Unregister cacheable content
   */
  unregisterCacheable(id: string): void {
    this.cacheRegistry.delete(id)
  }

  /**
   * Prepare messages with cache control (Anthropic format)
   */
  prepareMessagesAnthropic(
    messages: Array<{ role: string; content: string | any }>
  ): Array<{
    role: string
    content: string | any
    cache_control?: { type: 'ephemeral' }
  }> {
    const prepared = messages.map((msg, index) => {
      const isLongContent =
        typeof msg.content === 'string' && this.estimateTokens(msg.content) >= this.options.defaultMinLength

      // Anthropic: Cache long system messages and last user message with context
      const shouldCache =
        (msg.role === 'system' && isLongContent) ||
        (msg.role === 'user' && isLongContent && index === messages.length - 1)

      if (shouldCache && this.options.autoManage) {
        return {
          ...msg,
          cache_control: { type: 'ephemeral' as const },
        }
      }

      return msg
    })

    return prepared
  }

  /**
   * Prepare request with cache control (OpenAI format)
   */
  prepareRequestOpenAI(params: {
    messages: Array<{ role: string; content: string }>
    system?: string
  }): {
    messages: Array<{ role: string; content: string }>
    cached_content?: string
  } {
    const { messages, system } = params

    // OpenAI: Can cache system prompt separately
    if (system && this.estimateTokens(system) >= this.options.defaultMinLength) {
      return {
        messages,
        cached_content: system,
      }
    }

    return { messages }
  }

  /**
   * Detect if content is cacheable
   */
  isCacheable(content: string, minLength?: number): boolean {
    const threshold = minLength ?? this.options.defaultMinLength
    return this.estimateTokens(content) >= threshold
  }

  /**
   * Get optimal cache points in conversation
   */
  getOptimalCachePoints(
    messages: Array<{ role: string; content: string }>
  ): number[] {
    const cachePoints: number[] = []

    messages.forEach((msg, index) => {
      // Cache system messages
      if (msg.role === 'system' && this.isCacheable(msg.content)) {
        cachePoints.push(index)
      }

      // Cache long context or document messages
      if (msg.role === 'user' && this.isCacheable(msg.content, 2048)) {
        cachePoints.push(index)
      }
    })

    return cachePoints
  }

  /**
   * Estimate tokens (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Approximate: 4 chars per token
    return Math.ceil(text.length / 4)
  }

  /**
   * Record cache hit
   */
  recordCacheHit(tokensSaved: number, costSaved: number = 0): void {
    if (!this.options.trackStats) return

    this.stats.requests++
    this.stats.hits++
    this.stats.tokensSaved += tokensSaved
    this.stats.costSaved += costSaved
    this.updateHitRate()
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    if (!this.options.trackStats) return

    this.stats.requests++
    this.stats.misses++
    this.updateHitRate()
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    if (this.stats.requests > 0) {
      this.stats.hitRate = (this.stats.hits / this.stats.requests) * 100
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      requests: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      tokensSaved: 0,
      costSaved: 0,
    }
  }

  /**
   * Calculate potential savings from caching
   */
  calculatePotentialSavings(params: {
    inputTokens: number
    cacheHitRate: number
    provider: 'anthropic' | 'openai'
  }): {
    withoutCache: number
    withCache: number
    savings: number
    savingsPercent: number
  } {
    const { inputTokens, cacheHitRate, provider } = params

    // Anthropic: Cache reads are 90% cheaper
    // OpenAI: Cache reads are 50% cheaper
    const cacheDiscount = provider === 'anthropic' ? 0.9 : 0.5

    const cachedTokens = Math.floor(inputTokens * cacheHitRate)
    const uncachedTokens = inputTokens - cachedTokens

    // Assuming base cost of $3 per 1M tokens (Claude Sonnet)
    const costPer1M = provider === 'anthropic' ? 3.0 : 2.5
    const cachedCostPer1M = costPer1M * (1 - cacheDiscount)

    const withoutCache = (inputTokens / 1_000_000) * costPer1M
    const withCache =
      (uncachedTokens / 1_000_000) * costPer1M + (cachedTokens / 1_000_000) * cachedCostPer1M

    const savings = withoutCache - withCache
    const savingsPercent = withoutCache > 0 ? (savings / withoutCache) * 100 : 0

    return {
      withoutCache,
      withCache,
      savings,
      savingsPercent,
    }
  }
}

/**
 * Create cache-aware message format for Anthropic
 */
export function createAnthropicCachedMessages(
  systemPrompt: string,
  conversationMessages: Array<{ role: string; content: string }>,
  minCacheLength: number = 1024
): Array<{
  role: string
  content: string
  cache_control?: { type: 'ephemeral' }
}> {
  const messages: any[] = []

  // Add system message with cache control if long enough
  if (systemPrompt) {
    const estimatedTokens = Math.ceil(systemPrompt.length / 4)
    messages.push({
      role: 'system',
      content: systemPrompt,
      ...(estimatedTokens >= minCacheLength ? { cache_control: { type: 'ephemeral' } } : {}),
    })
  }

  // Add conversation messages
  // Cache the last long user message (typically contains context)
  conversationMessages.forEach((msg, index) => {
    const estimatedTokens = Math.ceil(msg.content.length / 4)
    const isLastUserMessage =
      msg.role === 'user' && index === conversationMessages.length - 1
    const shouldCache = isLastUserMessage && estimatedTokens >= minCacheLength

    messages.push({
      ...msg,
      ...(shouldCache ? { cache_control: { type: 'ephemeral' } } : {}),
    })
  })

  return messages
}

/**
 * Estimate cache savings for a conversation
 */
export function estimateCacheSavings(params: {
  systemPromptTokens: number
  contextTokens: number
  conversationsPerDay: number
  provider: 'anthropic' | 'openai'
  model: string
}): {
  dailySavings: number
  monthlySavings: number
  annualSavings: number
  details: string
} {
  const { systemPromptTokens, contextTokens, conversationsPerDay, provider } = params

  // Assume system prompt and context are cached after first use
  const cacheableTokens = systemPromptTokens + contextTokens
  const cacheDiscount = provider === 'anthropic' ? 0.9 : 0.5

  // Cost per 1M tokens
  const costPer1M = provider === 'anthropic' ? 3.0 : 2.5

  // Without cache: pay full price every time
  const costPerConversationWithout = (cacheableTokens / 1_000_000) * costPer1M

  // With cache: pay full price once, then discounted price
  const costPerConversationWith =
    (cacheableTokens / 1_000_000) * costPer1M * (1 - cacheDiscount)

  const savingsPerConversation = costPerConversationWithout - costPerConversationWith
  const dailySavings = savingsPerConversation * conversationsPerDay
  const monthlySavings = dailySavings * 30
  const annualSavings = dailySavings * 365

  return {
    dailySavings,
    monthlySavings,
    annualSavings,
    details: `Saving ${(cacheDiscount * 100).toFixed(0)}% on ${cacheableTokens} tokens per conversation`,
  }
}
