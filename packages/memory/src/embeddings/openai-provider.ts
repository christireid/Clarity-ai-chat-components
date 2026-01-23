/**
 * OpenAI Embedding Provider
 *
 * Optimized with caching, retry logic, and rate limiting
 */

import type { EmbeddingProvider } from './embedding-provider'
import { LRUCache, TTLCache } from '@clarity-chat/utils/cache'
import { retry, isRetryableError } from '../utils/retry'
import { RateLimiter } from '../utils/rate-limiter'

export interface OpenAIProviderConfig {
  apiKey: string
  model?: string
  dimensions?: number
  cache?: boolean
  cacheSize?: number
  cacheTTL?: number
  maxRetries?: number
  rateLimit?: {
    maxTokens: number
    refillRate: number
  }
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private apiKey: string
  private model: string
  public dimensions: number
  private cache?: LRUCache<string, number[]> | TTLCache<string, number[]>
  private rateLimiter?: RateLimiter

  constructor(config: OpenAIProviderConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'text-embedding-3-small'
    this.dimensions = config.dimensions || 1536

    // Setup cache if enabled
    if (config.cache !== false) {
      if (config.cacheTTL) {
        // Use TTL cache if TTL is configured
        this.cache = new TTLCache<string, number[]>(config.cacheTTL)
      } else {
        // Use LRU cache otherwise
        this.cache = new LRUCache<string, number[]>(config.cacheSize || 1000)
      }
    }

    // Setup rate limiter if configured
    if (config.rateLimit) {
      this.rateLimiter = new RateLimiter(config.rateLimit)
    }
  }

  async embed(text: string): Promise<number[]> {
    // Check cache first
    if (this.cache?.has(text)) {
      return this.cache.get(text)!
    }

    // Rate limit if configured
    if (this.rateLimiter) {
      await this.rateLimiter.acquire()
    }

    // Retry with exponential backoff
    const embedding = await retry(
      async () => {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            input: text,
            dimensions: this.dimensions,
          }),
        })

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }))
          const errorMessage = `OpenAI embedding failed: ${JSON.stringify(error)}`

          // Check if retryable
          if (isRetryableError(new Error(errorMessage))) {
            throw new Error(errorMessage)
          }

          // Non-retryable errors (e.g., invalid API key)
          throw new Error(errorMessage)
        }

        const data = await response.json()
        const result = data.data[0]?.embedding || []

        if (result.length === 0) {
          throw new Error('Empty embedding returned')
        }

        return result
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        retryableErrors: ['network', 'timeout', '503', '502', '504'],
      }
    )

    // Cache result
    if (this.cache) {
      this.cache.set(text, embedding)
    }

    return embedding
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Check cache for each text
    const cached: Map<number, number[]> = new Map()
    const uncached: Array<{ index: number; text: string }> = []

    texts.forEach((text, index) => {
      if (this.cache?.has(text)) {
        cached.set(index, this.cache.get(text)!)
      } else {
        uncached.push({ index, text })
      }
    })

    // If all cached, return immediately
    if (uncached.length === 0) {
      return texts.map((_, index) => cached.get(index)!)
    }

    // Rate limit if configured
    if (this.rateLimiter) {
      await this.rateLimiter.acquire()
    }

    // Fetch uncached embeddings
    const embeddings = await retry(
      async () => {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            input: uncached.map((item) => item.text),
            dimensions: this.dimensions,
          }),
        })

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }))
          throw new Error(
            `OpenAI batch embedding failed: ${JSON.stringify(error)}`
          )
        }

        const data = await response.json()
        return data.data.map((item: any) => item.embedding)
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        retryableErrors: ['network', 'timeout', '503', '502', '504'],
      }
    )

    // Cache results and build final array
    const results: number[][] = []
    let uncachedIndex = 0

    texts.forEach((text, index) => {
      if (cached.has(index)) {
        results.push(cached.get(index)!)
      } else {
        const embedding = embeddings[uncachedIndex]!
        if (this.cache) {
          this.cache.set(text, embedding)
        }
        results.push(embedding)
        uncachedIndex++
      }
    })

    return results
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache?.clear()
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number } | null {
    if (!this.cache) return null
    return {
      size: this.cache.size,
    }
  }
}
