/**
 * Accurate Token Counter
 * 
 * High-performance token counting using tiktoken with caching and monitoring
 */

import { encoding_for_model, get_encoding, type TiktokenModel } from '@dqbd/tiktoken'

export interface TokenizerConfig {
  model: string
  cacheSize?: number
  enableCaching?: boolean
  enableMonitoring?: boolean
}

export class AccurateTokenCounter {
  private encoder: any
  private cache: Map<string, number>
  private cacheHits = 0
  private cacheMisses = 0
  private monitoring = {
    totalCalls: 0,
    totalTokens: 0,
    averageTokens: 0,
    startTime: Date.now()
  }

  constructor(private config: TokenizerConfig) {
    try {
      this.encoder = encoding_for_model(config.model as TiktokenModel)
    } catch (error) {
      // Fallback to cl100k_base encoding if model not found
      this.encoder = get_encoding('cl100k_base')
    }
    
    this.cache = new Map()
    
    if (this.config.enableCaching) {
      this.setupCacheInvalidation()
    }
    
    if (this.config.enableMonitoring) {
      this.setupMonitoring()
    }
  }

  /**
   * Count tokens in text with high accuracy
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
      // Use tiktoken for accurate counting
      const tokens = this.encoder.encode(text).length
      
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
    const words = text.split(/\s+/).filter(w => w.length > 0).length
    
    return {
      tokens,
      characters: chars,
      words,
      ratio: chars > 0 ? chars / tokens : 0,
      estimated: false
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
      this.monitoring.averageTokens = this.monitoring.totalTokens / this.monitoring.totalCalls
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
      cacheHitRate: Math.round(cacheStats.hitRate * 100) + '%'
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
      enabled: this.config.enableCaching || false
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
      tokensPerSecond: this.monitoring.totalTokens / runtime
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cache.clear()
    this.encoder = null
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