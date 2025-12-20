/**
 * Accurate Token Counter
 *
 * High-performance token counting using gpt-tokenizer with caching and monitoring.
 *
 * gpt-tokenizer is a pure JavaScript implementation that is:
 * - 20x smaller than tiktoken WASM (~200KB vs ~4MB)
 * - The fastest JS tokenizer available
 * - Supports all OpenAI models including o-series (o1, o3, o4), GPT-4o, GPT-4.1
 * - Used by Microsoft Teams AI, CodeRabbit, Elastic Kibana
 *
 * @see https://github.com/niieani/gpt-tokenizer
 */

import { encode, encodeChat, isWithinTokenLimit } from 'gpt-tokenizer'

export interface TokenizerConfig {
  model: string
  cacheSize?: number
  enableCaching?: boolean
  enableMonitoring?: boolean
}

/**
 * Chat message format for token counting
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool'
  content: string
  name?: string
}

/**
 * Model name type for gpt-tokenizer
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
 * Model to encoding mapping for gpt-tokenizer
 * Supports all current OpenAI models including the latest o-series
 */
const MODEL_ENCODING_MAP: Record<string, ModelName> = {
  // O-series models (o200k_base encoding)
  o1: 'o1',
  'o1-mini': 'o1-mini',
  'o1-preview': 'o1-preview',
  o3: 'o1', // Use o1 encoding for o3
  'o3-mini': 'o1-mini',
  o4: 'o1', // Use o1 encoding for o4
  'o4-mini': 'o1-mini',

  // GPT-4o models (o200k_base encoding)
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4o-2024-05-13': 'gpt-4o',
  'gpt-4o-2024-08-06': 'gpt-4o',
  'gpt-4.1': 'gpt-4o',

  // GPT-4 models (cl100k_base encoding)
  'gpt-4': 'gpt-4',
  'gpt-4-turbo': 'gpt-4-turbo',
  'gpt-4-turbo-preview': 'gpt-4-turbo-preview',
  'gpt-4-0125-preview': 'gpt-4-0125-preview',
  'gpt-4-1106-preview': 'gpt-4-1106-preview',
  'gpt-4-32k': 'gpt-4-32k',

  // GPT-3.5 models (cl100k_base encoding)
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0125': 'gpt-3.5-turbo-0125',
  'gpt-3.5-turbo-1106': 'gpt-3.5-turbo-1106',

  // Legacy models
  'text-davinci-003': 'text-davinci-003',
  'text-davinci-002': 'text-davinci-002',

  // Embedding models
  'text-embedding-ada-002': 'text-embedding-ada-002',
  'text-embedding-3-small': 'text-embedding-3-small',
  'text-embedding-3-large': 'text-embedding-3-large',
}

export class AccurateTokenCounter {
  private modelName: ModelName
  private cache: Map<string, number>
  private cacheHits = 0
  private cacheMisses = 0
  private monitoring = {
    totalCalls: 0,
    totalTokens: 0,
    averageTokens: 0,
    startTime: Date.now(),
  }

  constructor(private config: TokenizerConfig) {
    // Map the model name to gpt-tokenizer model name
    this.modelName = MODEL_ENCODING_MAP[config.model] || 'gpt-4o'

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

    try {
      // Use gpt-tokenizer for accurate counting (pure JS, no WASM)
      const tokens = encode(text, { allowedSpecial: 'all' }).length

      this.updateMonitoring('tokens', tokens)

      // Cache result
      if (this.config.enableCaching) {
        this.addToCache(text, tokens)
      }

      return tokens
    } catch (error) {
      // Fallback to character-based estimation
      const estimated = Math.ceil(text.length / 4)
      console.warn(`Token encoding failed, using estimation: ${error}`)
      return estimated
    }
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
    // Clear cache every hour to prevent memory leaks
    setInterval(() => {
      this.cache.clear()
      this.cacheHits = 0
      this.cacheMisses = 0

      if (this.config.enableMonitoring) {
        console.log('[TokenCounter] Cache cleared')
      }
    }, 3600000)
  }

  private setupMonitoring(): void {
    // Log monitoring stats every 5 minutes
    setInterval(() => {
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

    console.log('[TokenCounter Monitoring]', {
      totalCalls: this.monitoring.totalCalls,
      totalTokens: this.monitoring.totalTokens,
      averageTokens: Math.round(this.monitoring.averageTokens * 100) / 100,
      runtime: Math.round(runtime),
      cacheHitRate: Math.round(cacheStats.hitRate * 100) + '%',
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
   * Clean up resources
   */
  destroy(): void {
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
