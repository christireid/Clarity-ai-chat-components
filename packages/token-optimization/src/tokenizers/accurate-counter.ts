/**
 * Accurate Token Counter
 *
 * High-performance token counting using gpt-tokenizer with caching and monitoring.
 *
 * gpt-tokenizer is a pure JavaScript implementation that is:
 * - 5-6x smaller than tiktoken (972KB vs 5.3MB for js-tiktoken)
 * - The fastest JS tokenizer available
 * - Supports all OpenAI models including o-series (o1, o3, o4), GPT-4o, GPT-4.1
 * - Used by Microsoft Teams AI, CodeRabbit, Elastic Kibana
 *
 * @see https://github.com/niieani/gpt-tokenizer
 */

import { encode, encodeChat, isWithinTokenLimit } from 'gpt-tokenizer'
import { Logger } from '../observability'

export interface TokenizerConfig {
  model: string
  cacheSize?: number
  enableCaching?: boolean
  enableMonitoring?: boolean
}

/**
 * Chat message format for token counting.
 *
 * @deprecated Define locally — use `TokenChatMessage` from `@clarity-chat/types` instead.
 * Kept for backwards compatibility; this is structurally compatible with `TokenChatMessage`.
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string
  name?: string
}

/**
 * Model name type for gpt-tokenizer
 * Supports OpenAI, Anthropic Claude, and Google Gemini models
 */
type ModelName =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'o1'
  | 'o1-mini'
  | string

/**
 * Encoding type identifiers for different tokenizer backends
 *
 * @remarks
 * - o200k_base: GPT-4o, o-series (200K vocabulary, optimized for code)
 * - cl100k_base: GPT-4, GPT-3.5 (100K vocabulary)
 * - claude: Anthropic's proprietary tokenizer
 * - gemini: Google's SentencePiece tokenizer
 */
type EncodingType = 'o200k_base' | 'cl100k_base' | 'claude' | 'gemini'

/**
 * Model to encoding mapping for accurate token counting
 *
 * Maps model identifiers to their corresponding tokenizer encoding.
 * For OpenAI models, maps to gpt-tokenizer model names.
 * For non-OpenAI models, maps to encoding type identifiers.
 *
 * @remarks
 * Note: For Claude and Gemini models, we use character-based estimation
 * as their tokenizers are not publicly available. The estimation provides
 * reasonable accuracy for most use cases.
 */
const MODEL_ENCODING_MAP: Record<string, ModelName | EncodingType> = {
  // OpenAI o-Series Reasoning Models (o200k_base encoding)
  o1: 'o1',
  'o1-mini': 'o1-mini',
  'o1-preview': 'o1',
  o3: 'o1', // o3 uses same encoding as o1
  'o3-mini': 'o1-mini', // o3-mini uses same encoding as o1-mini
  'o4-mini': 'o1-mini', // o4-mini uses same encoding as o1-mini

  // OpenAI GPT-4o Models (o200k_base encoding)
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4o-2024-05-13': 'gpt-4o',
  'gpt-4o-2024-08-06': 'gpt-4o',
  'gpt-4o-2024-11-20': 'gpt-4o',
  'gpt-4.1': 'gpt-4o',

  // OpenAI GPT-4 Models (cl100k_base encoding)
  'gpt-4': 'gpt-4',
  'gpt-4-turbo': 'gpt-4-turbo',
  'gpt-4-turbo-preview': 'gpt-4-turbo',
  'gpt-4-0125-preview': 'gpt-4-turbo',
  'gpt-4-1106-preview': 'gpt-4-turbo',
  'gpt-4-32k': 'gpt-4-32k',

  // OpenAI GPT-3.5 Models (cl100k_base encoding)
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0125': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-1106': 'gpt-3.5-turbo',

  // OpenAI Legacy Models
  'text-davinci-003': 'text-davinci-003',
  'text-davinci-002': 'text-davinci-002',

  // OpenAI Embedding Models
  'text-embedding-ada-002': 'text-embedding-ada-002',
  'text-embedding-3-small': 'text-embedding-3-small',
  'text-embedding-3-large': 'text-embedding-3-large',

  // Anthropic Claude 3.5 Models (claude encoding - uses estimation)
  'claude-3-5-sonnet-20241022': 'claude',
  'claude-3-5-haiku-20241022': 'claude',

  // Anthropic Claude 4.5 Models (claude encoding - uses estimation)
  'claude-opus-4-5': 'claude',
  'claude-sonnet-4-5': 'claude',
  'claude-haiku-4-5': 'claude',

  // Anthropic Claude 3 Models (claude encoding - uses estimation)
  'claude-3-opus': 'claude',
  'claude-3-sonnet': 'claude',
  'claude-3-haiku': 'claude',

  // Google Gemini 2.0 Models (gemini encoding - uses estimation)
  'gemini-2.0-pro': 'gemini',
  'gemini-2.0-flash': 'gemini',
  'gemini-2.0-flash-lite': 'gemini',

  // Google Gemini 1.5 Models (gemini encoding - uses estimation)
  'gemini-1.5-pro': 'gemini',
  'gemini-1.5-flash': 'gemini',
}

/**
 * Check if an encoding type requires estimation (non-OpenAI models)
 *
 * @param encoding - The encoding type to check
 * @returns True if the encoding requires character-based estimation
 */
function isEstimationEncoding(
  encoding: string
): encoding is 'claude' | 'gemini' {
  return encoding === 'claude' || encoding === 'gemini'
}

export class AccurateTokenCounter {
  private modelName: ModelName | EncodingType
  private cache: Map<string, number>
  private cacheHits = 0
  private cacheMisses = 0
  private useEstimation: boolean
  private monitoring = {
    totalCalls: 0,
    totalTokens: 0,
    averageTokens: 0,
    startTime: Date.now(),
  }

  /** Interval ID for cache invalidation timer */
  private cacheInvalidationInterval: ReturnType<typeof setInterval> | null =
    null
  /** Interval ID for monitoring timer */
  private monitoringInterval: ReturnType<typeof setInterval> | null = null

  /** Logger instance for structured logging */
  private readonly logger: Logger

  constructor(private config: TokenizerConfig) {
    // Initialize logger with appropriate log level based on monitoring config
    this.logger = new Logger({
      logLevel: config.enableMonitoring ? 'info' : 'warn',
      serviceName: 'token-counter',
    })

    // Map the model name to gpt-tokenizer model name or encoding type
    const encoding = MODEL_ENCODING_MAP[config.model] || 'gpt-4o'
    this.modelName = encoding
    this.useEstimation = isEstimationEncoding(encoding)

    this.cache = new Map()

    if (this.config.enableCaching) {
      this.setupCacheInvalidation()
    }

    if (this.config.enableMonitoring) {
      this.setupMonitoring()
    }
  }

  /**
   * Count tokens in text with high accuracy using gpt-tokenizer
   *
   * For OpenAI models, uses gpt-tokenizer for exact counting.
   * For Claude and Gemini models, uses character-based estimation
   * as their tokenizers are not publicly available.
   */
  count(text: string): number {
    if (!text) return 0

    this.updateMonitoring('calls', 1)

    // Check cache first
    if (this.config.enableCaching && this.cache.has(text)) {
      this.cacheHits++
      const cached = this.cache.get(text)!
      this.updateMonitoring('tokens', cached)
      return cached
    }

    this.cacheMisses++

    let tokens: number

    // Use estimation for non-OpenAI models (Claude, Gemini)
    if (this.useEstimation) {
      tokens = this.estimateTokens(text)
    } else {
      try {
        // Use gpt-tokenizer for accurate counting (pure JS, no WASM)
        tokens = encode(text, { allowedSpecial: 'all' }).length
      } catch (error) {
        // Fallback to character-based estimation
        tokens = this.estimateTokens(text)
        this.logger.warn('Token encoding failed, using estimation', {
          error: error instanceof Error ? error.message : String(error),
          model: this.modelName,
        })
      }
    }

    this.updateMonitoring('tokens', tokens)

    // Cache result
    if (this.config.enableCaching) {
      this.addToCache(text, tokens)
    }

    return tokens
  }

  /**
   * Estimate tokens using improved heuristics
   *
   * Used for non-OpenAI models where exact tokenization is not available.
   * Uses gpt-tokenizer with cl100k_base as a proxy for better accuracy (~90% vs ~70%).
   *
   * Research shows Claude and Gemini tokenization is similar to cl100k_base:
   * - Claude uses a BPE tokenizer similar to GPT-4
   * - Gemini uses SentencePiece which produces similar token counts
   *
   * @see https://www.propelcode.ai/blog/token-counting-tiktoken-anthropic-gemini-guide-2025
   *
   * @param text - The text to estimate tokens for
   * @returns Estimated token count
   */
  private estimateTokens(text: string): number {
    try {
      // Use gpt-tokenizer's encode as a proxy for Claude/Gemini
      // This gives ~90% accuracy vs the ~70% of simple character-based
      const tokens = encode(text, { allowedSpecial: 'all' }).length

      // Apply model-specific adjustment factors
      // Claude tends to be slightly more efficient than GPT tokenization
      // Gemini is similar to Claude
      const adjustmentFactor = this.modelName === 'claude' ? 0.95 : 0.97

      return Math.ceil(tokens * adjustmentFactor)
    } catch {
      // Fallback to improved character-based estimation
      return this.characterBasedEstimate(text)
    }
  }

  /**
   * Fallback character-based estimation with improved accuracy
   *
   * Uses multiple heuristics for better accuracy:
   * - Word count (English ~1.3 tokens/word)
   * - Character count (average ~4 chars/token)
   * - Special handling for code, CJK, punctuation
   */
  private characterBasedEstimate(text: string): number {
    if (!text) return 0

    const chars = text.length
    const words = text.split(/\s+/).filter(Boolean).length

    // Count code-like content (higher token density)
    const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).join('').length
    const inlineCode = (text.match(/`[^`]+`/g) || []).join('').length

    // Count CJK characters (typically 1 char = 1-2 tokens)
    const cjkChars = (
      text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []
    ).length

    // Count punctuation (often separate tokens)
    const punctuation = (text.match(/[.,!?;:'"()[\]{}<>]/g) || []).length

    // Calculate base estimate
    let estimate = 0

    // Non-code text: ~4 chars per token
    const regularChars = chars - codeBlocks - inlineCode - cjkChars
    estimate += regularChars / 4

    // Code: ~3 chars per token (more symbols = more tokens)
    estimate += (codeBlocks + inlineCode) / 3

    // CJK: ~1.5 chars per token
    estimate += cjkChars / 1.5

    // Add punctuation tokens (often separate)
    estimate += punctuation * 0.3

    // Apply word-count sanity check (should be at least 0.75 tokens per word)
    const minByWords = words * 0.75
    estimate = Math.max(estimate, minByWords)

    return Math.ceil(estimate)
  }

  /**
   * Check if text is within token limit (optimized - faster than counting)
   * Uses gpt-tokenizer's isWithinTokenLimit which stops counting once limit is reached
   */
  isWithinLimit(text: string, maxTokens: number): boolean {
    if (!text) return true
    return isWithinTokenLimit(text, maxTokens) !== false
  }

  /**
   * Count tokens in a chat conversation (handles message formatting overhead)
   */
  countChat(messages: ChatMessage[]): number {
    if (!messages || messages.length === 0) return 0

    try {
      // Convert to gpt-tokenizer format and use encodeChat
      const gptMessages = messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
        ...(msg.name && { name: msg.name }),
      }))
      const tokens = encodeChat(gptMessages, this.modelName as 'gpt-4o').length
      return tokens
    } catch {
      // Fallback: estimate each message
      return messages.reduce((sum, msg) => {
        const content = typeof msg.content === 'string' ? msg.content : ''
        return sum + this.count(content) + 4 // +4 for message overhead
      }, 3) // +3 for conversation overhead
    }
  }

  /**
   * Count tokens in multiple texts efficiently
   */
  countBatch(texts: string[]): number {
    return texts.reduce((sum, text) => sum + this.count(text), 0)
  }

  /**
   * Estimate tokens for a text without full encoding (faster for large texts)
   */
  estimate(text: string): number {
    if (!text) return 0

    // Quick estimation based on character patterns
    const words = text.split(/\s+/).length
    const chars = text.length

    // Rough heuristic: ~0.75 tokens per word, ~4 chars per token
    const wordBased = Math.ceil(words * 0.75)
    const charBased = Math.ceil(chars / 4)

    // Take the average for better estimation
    return Math.ceil((wordBased + charBased) / 2)
  }

  /**
   * Get token information for a text
   */
  getTokenInfo(text: string): TokenInfo {
    const tokens = this.count(text)
    const chars = text.length
    const words = text.split(/\s+/).filter((w) => w.length > 0).length

    return {
      tokens,
      characters: chars,
      words,
      ratio: chars > 0 ? chars / tokens : 0,
      estimated: false,
    }
  }

  /**
   * Truncate text to fit token budget
   */
  truncate(text: string, maxTokens: number): string {
    const tokens = this.count(text)
    if (tokens <= maxTokens) return text

    // Binary search for optimal truncation point
    let left = 0
    let right = text.length

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      const truncated = text.slice(0, mid)
      const truncatedTokens = this.count(truncated)

      if (truncatedTokens <= maxTokens) {
        left = mid + 1
      } else {
        right = mid
      }
    }

    // Try to break at sentence boundary
    const truncated = text.slice(0, left)
    const lastSentence = truncated.lastIndexOf('.')
    const lastNewline = truncated.lastIndexOf('\n')
    const breakPoint = Math.max(lastSentence, lastNewline)

    if (breakPoint > left * 0.8) {
      return text.slice(0, breakPoint + 1)
    }

    return truncated + '...'
  }

  private addToCache(text: string, tokens: number): void {
    // If cache is full, remove oldest entry before adding new one
    if (this.config.cacheSize && this.cache.size >= this.config.cacheSize) {
      // Remove oldest entry (FIFO)
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(text, tokens)
  }

  private setupCacheInvalidation(): void {
    // Clear any existing interval to prevent leaks
    if (this.cacheInvalidationInterval) {
      clearInterval(this.cacheInvalidationInterval)
    }

    // Clear cache every hour to prevent memory leaks
    this.cacheInvalidationInterval = setInterval(() => {
      this.cache.clear()
      this.cacheHits = 0
      this.cacheMisses = 0

      if (this.config.enableMonitoring) {
        this.logger.info('Cache cleared', { model: this.modelName })
      }
    }, 3600000)
  }

  private setupMonitoring(): void {
    // Clear any existing interval to prevent leaks
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    // Log monitoring stats every 5 minutes
    this.monitoringInterval = setInterval(() => {
      this.logMonitoringStats()
    }, 300000)
  }

  private updateMonitoring(type: 'calls' | 'tokens', value: number): void {
    if (!this.config.enableMonitoring) return

    if (type === 'calls') {
      this.monitoring.totalCalls += value
    } else {
      this.monitoring.totalTokens += value
      this.monitoring.averageTokens =
        this.monitoring.totalTokens / this.monitoring.totalCalls
    }
  }

  private logMonitoringStats(): void {
    if (!this.config.enableMonitoring) return

    const runtime = (Date.now() - this.monitoring.startTime) / 1000
    const cacheStats = this.getCacheStats()

    this.logger.info('Token counter monitoring stats', {
      totalCalls: this.monitoring.totalCalls,
      totalTokens: this.monitoring.totalTokens,
      averageTokens: Math.round(this.monitoring.averageTokens * 100) / 100,
      runtimeSeconds: Math.round(runtime),
      cacheHitRate: Math.round(cacheStats.hitRate * 100),
      model: this.modelName,
    })
  }

  /**
   * Get cache performance statistics
   */
  getCacheStats(): CacheStats {
    const total = this.cacheHits + this.cacheMisses
    return {
      size: this.cache.size,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: total > 0 ? this.cacheHits / total : 0,
      enabled: this.config.enableCaching || false,
    }
  }

  /**
   * Get monitoring statistics
   */
  getMonitoringStats(): MonitoringStats {
    if (!this.config.enableMonitoring) {
      return { enabled: false }
    }

    const runtime = (Date.now() - this.monitoring.startTime) / 1000

    return {
      enabled: true,
      totalCalls: this.monitoring.totalCalls,
      totalTokens: this.monitoring.totalTokens,
      averageTokens: Math.round(this.monitoring.averageTokens * 100) / 100,
      runtime: Math.round(runtime),
      tokensPerSecond: this.monitoring.totalTokens / runtime,
    }
  }

  /**
   * Clean up resources and stop all intervals.
   *
   * Call this method when disposing of the AccurateTokenCounter instance
   * to prevent memory leaks from ongoing timers.
   */
  destroy(): void {
    // Clear all intervals to prevent memory leaks
    if (this.cacheInvalidationInterval) {
      clearInterval(this.cacheInvalidationInterval)
      this.cacheInvalidationInterval = null
    }

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }

    // Clear cache
    this.cache.clear()
  }

  /**
   * Get the model name being used for tokenization
   */
  getModelName(): string {
    return this.modelName
  }

  /**
   * Get supported model names
   */
  static getSupportedModels(): string[] {
    return Object.keys(MODEL_ENCODING_MAP)
  }
}

export interface TokenInfo {
  tokens: number
  characters: number
  words: number
  ratio: number
  estimated: boolean
}

export interface CacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
  enabled: boolean
}

export interface MonitoringStats {
  enabled: boolean
  totalCalls?: number
  totalTokens?: number
  averageTokens?: number
  runtime?: number
  tokensPerSecond?: number
}
