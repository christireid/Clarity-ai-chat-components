/**
 * Provider-Native Caching Types
 *
 * Type definitions for provider-specific prompt caching features
 * Supporting Anthropic, OpenAI, and Google Gemini
 */

/**
 * Supported providers with native caching capabilities
 */
export type CachingProvider = 'anthropic' | 'openai' | 'google'

/**
 * Cache control configuration for Anthropic Claude
 *
 * Anthropic supports up to 4 cache breakpoints per request.
 * Minimum cached content: 1024 tokens (Sonnet/Opus), 2048-4096 (Haiku)
 */
export interface AnthropicCacheControl {
  type: 'ephemeral'
  /**
   * Time-to-live for cached content
   * @default '5m'
   */
  ttl?: '5m' | '1h'
}

/**
 * Anthropic message content block with optional caching
 */
export interface AnthropicContentBlock {
  type: 'text' | 'image'
  text?: string
  source?: {
    type: 'base64'
    media_type: string
    data: string
  }
  /**
   * Cache control breakpoint
   * Add this to mark content for caching
   */
  cache_control?: AnthropicCacheControl
}

/**
 * Anthropic message format
 */
export interface AnthropicMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | AnthropicContentBlock[]
}

/**
 * OpenAI prompt caching configuration
 *
 * OpenAI automatically caches prompts ≥1024 tokens.
 * No explicit cache control needed - just track performance.
 */
export interface OpenAICacheConfig {
  /**
   * Prompt cache retention policy
   * - 'in_memory': Default, cache cleared on model restart
   * - '24h': Extended retention for 24 hours
   */
  prompt_cache_retention?: 'in_memory' | '24h'
}

/**
 * OpenAI usage metadata with cache information
 */
export interface OpenAIUsageMetadata {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  prompt_tokens_details: {
    /**
     * Number of prompt tokens served from cache
     * Will be 0 for prompts <1024 tokens
     */
    cached_tokens: number
  }
  completion_tokens_details?: {
    reasoning_tokens?: number
    accepted_prediction_tokens?: number
    rejected_prediction_tokens?: number
  }
}

/**
 * Google Gemini caching mode
 */
export type GeminiCachingMode = 'implicit' | 'explicit'

/**
 * Google Gemini explicit cache configuration
 */
export interface GeminiCacheConfig {
  /**
   * Caching mode
   * - 'implicit': Automatic caching (like OpenAI)
   * - 'explicit': Manual cache creation with IDs
   */
  mode: GeminiCachingMode

  /**
   * For explicit mode: cache display name
   */
  displayName?: string

  /**
   * Time-to-live as duration string (e.g., '86400s' for 24 hours)
   * Up to 9 fractional digits allowed (e.g., '3.5s')
   */
  ttl?: string

  /**
   * For explicit mode: existing cache ID to reuse
   */
  cacheId?: string

  /**
   * For explicit mode: system instruction to cache
   */
  systemInstruction?: string

  /**
   * Cloud KMS encryption key (Vertex AI only)
   */
  kmsKeyName?: string
}

/**
 * Google Gemini cached content response
 */
export interface GeminiCachedContent {
  name: string // Format: 'caches/{cache-id}'
  displayName?: string
  createTime: string
  updateTime: string
  expireTime: string
}

/**
 * Provider-specific cache metadata
 */
export interface ProviderCacheMetadata {
  /**
   * Which provider's cache is being used
   */
  provider: CachingProvider

  /**
   * Provider-specific cache identifier
   */
  cacheKey?: string

  /**
   * When the cache entry was created
   */
  createdAt?: string

  /**
   * When the cache entry expires
   */
  expiresAt?: string

  /**
   * Number of tokens cached by provider
   */
  cachedTokens?: number

  /**
   * Cost savings from caching (0-1 percentage)
   */
  savingsPercentage?: number

  /**
   * Provider-specific details
   */
  providerDetails?: {
    // Anthropic
    breakpointCount?: number
    ttl?: string

    // OpenAI
    retention?: string
    cacheHitRate?: number

    // Google
    cacheId?: string
    cacheName?: string
  }
}

/**
 * Result of applying provider caching
 */
export interface ProviderCachingResult {
  /**
   * Whether caching was applied
   */
  cached: boolean

  /**
   * Modified messages with cache control
   * Returns provider-specific format (Anthropic, OpenAI, or Google)
   */
  messages: CacheableMessage[] | AnthropicMessage[]

  /**
   * Cache metadata
   */
  metadata: ProviderCacheMetadata

  /**
   * Estimated token savings
   */
  estimatedSavings: {
    tokens: number
    percentage: number
    costReduction: number
  }

  /**
   * Recommendations for optimization
   */
  recommendations: string[]
}

/**
 * Configuration for provider-native caching
 */
export interface ProviderCachingConfig {
  /**
   * Enable provider-native caching
   * @default false
   */
  enabled: boolean

  /**
   * Target provider
   */
  provider: CachingProvider

  /**
   * Provider-specific configuration
   */
  anthropic?: {
    /**
     * Default TTL for cache breakpoints
     * @default '5m'
     */
    defaultTTL?: '5m' | '1h'

    /**
     * Minimum tokens before adding cache control
     * @default 1024
     */
    minCachedTokens?: number

    /**
     * Maximum cache breakpoints per request
     * @default 4
     */
    maxBreakpoints?: number

    /**
     * Automatically detect optimal breakpoint locations
     * @default true
     */
    autoDetectBreakpoints?: boolean
  }

  openai?: {
    /**
     * Cache retention policy
     * @default 'in_memory'
     */
    retention?: 'in_memory' | '24h'

    /**
     * Reorder messages to optimize caching
     * (Put static content first)
     * @default true
     */
    optimizeMessageOrder?: boolean
  }

  google?: {
    /**
     * Caching mode
     * @default 'implicit'
     */
    mode?: GeminiCachingMode

    /**
     * Default TTL for explicit caches
     * @default '3600s' (1 hour)
     */
    defaultTTL?: string

    /**
     * Auto-create caches for large prompts
     * @default true
     */
    autoCreateCache?: boolean

    /**
     * Explicit cache ID for reusing existing caches
     * Only used in explicit mode
     */
    cacheId?: string
  }
}

/**
 * Message format that can be enhanced with provider caching
 */
export interface CacheableMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | any[]
  /**
   * Optional: mark this message as cacheable
   */
  cacheable?: boolean
  /**
   * Optional: relative importance for cache prioritization
   * Higher = more likely to be cached
   */
  cacheWeight?: number
}

/**
 * Token counter interface for estimating cache benefit
 */
export interface TokenCounter {
  count(text: string): number
  countBatch?(texts: string[]): number | number[] | Promise<number[]>
}
