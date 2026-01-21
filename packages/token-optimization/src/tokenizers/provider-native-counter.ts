/**
 * Provider-Native Token Counting
 *
 * Integrates with LLM provider APIs for 100% accurate token counting.
 * Falls back to local estimation when API keys are not available.
 *
 * Providers:
 * - Anthropic: Uses /v1/messages/count_tokens API (free, 100% accurate)
 * - Google Gemini: Uses countTokens API (free, 3000 RPM, 100% accurate)
 * - OpenAI: Uses gpt-tokenizer library (99%+ accurate, no API available)
 *
 * @module provider-native-counter
 */

import type { CacheableMessage } from '../providers/types'

/**
 * Configuration for provider-native token counting
 */
export interface ProviderNativeCounterConfig {
  /** Provider to count tokens for */
  provider: 'anthropic' | 'google' | 'openai'

  /** Model identifier */
  model: string

  /** API key for the provider (optional - falls back to estimation if not provided) */
  apiKey?: string

  /** Prefer native API over local estimation (default: true if apiKey provided) */
  preferNative?: boolean

  /** Enable caching of API results (default: true) */
  enableCaching?: boolean

  /** Cache TTL in milliseconds (default: 3600000 = 1 hour) */
  cacheTtl?: number
}

/**
 * Result from provider-native token counting
 */
export interface TokenCountResult {
  /** Token count */
  tokens: number

  /** Method used for counting */
  method: 'provider-api' | 'local-accurate' | 'estimated'

  /** Provider name */
  provider: string

  /** Model used */
  model: string

  /** Whether result was from cache */
  cached: boolean

  /** Additional metadata from provider */
  metadata?: {
    /** Input tokens (if available) */
    inputTokens?: number
    /** Output tokens (if available) */
    outputTokens?: number
    /** Cached tokens (if available) */
    cachedTokens?: number
    /** API response time in ms */
    responseTimeMs?: number
  }
}

/**
 * Provider-Native Token Counter
 *
 * Counts tokens using provider APIs for maximum accuracy.
 * Automatically falls back to local methods when APIs are unavailable.
 *
 * @example
 * ```typescript
 * const counter = new ProviderNativeCounter({
 *   provider: 'anthropic',
 *   model: 'claude-3-5-sonnet',
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 * })
 *
 * const result = await counter.count('Hello, world!')
 * console.log(`${result.tokens} tokens (${result.method})`)
 * ```
 */
export class ProviderNativeCounter {
  private config: Required<ProviderNativeCounterConfig>
  private cache: Map<string, { result: TokenCountResult; expiry: number }>

  constructor(config: ProviderNativeCounterConfig) {
    this.config = {
      preferNative: config.apiKey ? true : false,
      enableCaching: true,
      cacheTtl: 3600000, // 1 hour
      ...config,
      apiKey: config.apiKey || '',
    }
    this.cache = new Map()
  }

  /**
   * Count tokens in text or messages
   *
   * @param content - Text string or array of messages
   * @returns Token count result with metadata
   */
  async count(
    content: string | CacheableMessage[]
  ): Promise<TokenCountResult> {
    // Check cache first
    if (this.config.enableCaching) {
      const cached = this.getFromCache(content)
      if (cached) return cached
    }

    let result: TokenCountResult

    // Try provider-native API if preferred and API key available
    if (this.config.preferNative && this.config.apiKey) {
      try {
        result = await this.countWithProviderAPI(content)
      } catch (error) {
        console.warn(
          `Provider API failed, falling back to local counting:`,
          error
        )
        result = await this.countLocally(content)
      }
    } else {
      result = await this.countLocally(content)
    }

    // Cache result
    if (this.config.enableCaching) {
      this.setInCache(content, result)
    }

    return result
  }

  /**
   * Count tokens using provider-native API
   */
  private async countWithProviderAPI(
    content: string | CacheableMessage[]
  ): Promise<TokenCountResult> {
    const startTime = performance.now()

    switch (this.config.provider) {
      case 'anthropic':
        return this.countWithAnthropicAPI(content, startTime)
      case 'google':
        return this.countWithGeminiAPI(content, startTime)
      case 'openai':
        // OpenAI has no counting API - fall back to local
        return this.countLocally(content)
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`)
    }
  }

  /**
   * Count tokens using Anthropic's /v1/messages/count_tokens API
   *
   * @see https://docs.anthropic.com/claude/reference/messages-count-tokens
   */
  private async countWithAnthropicAPI(
    content: string | CacheableMessage[],
    startTime: number
  ): Promise<TokenCountResult> {
    // Convert string to messages format
    const messages: CacheableMessage[] =
      typeof content === 'string'
        ? [{ role: 'user', content }]
        : content

    const response = await fetch(
      'https://api.anthropic.com/v1/messages/count_tokens',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      )
    }

    const data = (await response.json()) as { input_tokens: number }
    const responseTimeMs = performance.now() - startTime

    return {
      tokens: data.input_tokens,
      method: 'provider-api',
      provider: 'anthropic',
      model: this.config.model,
      cached: false,
      metadata: {
        inputTokens: data.input_tokens,
        responseTimeMs,
      },
    }
  }

  /**
   * Count tokens using Google Gemini's countTokens API
   *
   * @see https://ai.google.dev/api/tokens
   */
  private async countWithGeminiAPI(
    content: string | CacheableMessage[],
    startTime: number
  ): Promise<TokenCountResult> {
    // Convert to Gemini format
    const contents =
      typeof content === 'string'
        ? [{ parts: [{ text: content }] }]
        : content.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:countTokens?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      )
    }

    const data = (await response.json()) as { totalTokens: number }
    const responseTimeMs = performance.now() - startTime

    return {
      tokens: data.totalTokens,
      method: 'provider-api',
      provider: 'google',
      model: this.config.model,
      cached: false,
      metadata: {
        inputTokens: data.totalTokens,
        responseTimeMs,
      },
    }
  }

  /**
   * Count tokens using local methods (gpt-tokenizer or estimation)
   */
  private async countLocally(
    content: string | CacheableMessage[]
  ): Promise<TokenCountResult> {
    const text =
      typeof content === 'string'
        ? content
        : content.map(msg => msg.content).join(' ')

    let tokens: number
    let method: 'local-accurate' | 'estimated'

    if (this.config.provider === 'openai') {
      // Use gpt-tokenizer for OpenAI (99%+ accurate)
      const { AccurateTokenCounter } = await import('./accurate-counter')
      const counter = new AccurateTokenCounter({ model: this.config.model })
      tokens = counter.count(text)
      counter.destroy()
      method = 'local-accurate'
    } else {
      // Use character-based estimation for other providers
      tokens = this.estimateTokens(text)
      method = 'estimated'
    }

    return {
      tokens,
      method,
      provider: this.config.provider,
      model: this.config.model,
      cached: false,
    }
  }

  /**
   * Estimate tokens using character-based heuristics
   */
  private estimateTokens(text: string): number {
    const charsPerToken: Record<string, number> = {
      anthropic: 3.5, // Claude: ~3.5 chars/token
      google: 4.0, // Gemini: ~4 chars/token
      openai: 4.0, // GPT: ~4 chars/token (fallback)
    }

    const ratio = charsPerToken[this.config.provider] || 4.0
    return Math.ceil(text.length / ratio)
  }

  /**
   * Get cached result
   */
  private getFromCache(
    content: string | CacheableMessage[]
  ): TokenCountResult | null {
    const key = this.getCacheKey(content)
    const cached = this.cache.get(key)

    if (cached && cached.expiry > Date.now()) {
      return { ...cached.result, cached: true }
    }

    if (cached) {
      this.cache.delete(key)
    }

    return null
  }

  /**
   * Store result in cache
   */
  private setInCache(
    content: string | CacheableMessage[],
    result: TokenCountResult
  ): void {
    const key = this.getCacheKey(content)
    this.cache.set(key, {
      result,
      expiry: Date.now() + this.config.cacheTtl,
    })
  }

  /**
   * Generate cache key
   */
  private getCacheKey(content: string | CacheableMessage[]): string {
    const text =
      typeof content === 'string'
        ? content
        : JSON.stringify(content.map(m => ({ r: m.role, c: m.content })))

    // Simple hash for cache key
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `${this.config.provider}:${this.config.model}:${hash}`
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Would need to track separately
      misses: 0, // Would need to track separately
    }
  }
}

/**
 * Quick count function for convenience
 *
 * @example
 * ```typescript
 * const tokens = await providerNativeCount(
 *   'Hello, world!',
 *   { provider: 'anthropic', model: 'claude-3-5-sonnet', apiKey: process.env.ANTHROPIC_API_KEY }
 * )
 * ```
 */
export async function providerNativeCount(
  content: string | CacheableMessage[],
  config: ProviderNativeCounterConfig
): Promise<TokenCountResult> {
  const counter = new ProviderNativeCounter(config)
  return counter.count(content)
}
