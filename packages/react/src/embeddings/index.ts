/**
 * Embeddings System - Multi-Provider Embedding Generation
 *
 * Unified interface for generating embeddings across OpenAI, Cohere, and other providers.
 * Includes caching for cost reduction and performance.
 *
 * @example
 * ```tsx
 * // Create embedding provider
 * const embeddings = createEmbeddingProvider({
 *   provider: 'openai',
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'text-embedding-3-small',
 * })
 *
 * // Generate single embedding
 * const vector = await embeddings.embedText('Hello world')
 *
 * // Generate batch embeddings
 * const vectors = await embeddings.embedBatch([
 *   'Document 1',
 *   'Document 2',
 *   'Document 3',
 * ])
 *
 * // With caching
 * const cachedEmbeddings = createCachedEmbeddingProvider(embeddings, {
 *   cache: new MemoryEmbeddingCache(),
 * })
 * ```
 */

export * from './types'
export * from './openai'
export * from './cohere'
export * from './cache'
export * from './react'
export * from './local-embedder'

import type {
  EmbeddingProvider,
  EmbeddingConfig,
  EmbeddingCache,
  EmbeddingRequest,
  EmbeddingResponse,
} from './types'
import { OpenAIEmbeddingProvider } from './openai'
import { CohereEmbeddingProvider } from './cohere'
import { MemoryEmbeddingCache } from './cache'

/**
 * Create an embedding provider
 */
export function createEmbeddingProvider(
  config: EmbeddingConfig
): EmbeddingProvider {
  switch (config.provider) {
    case 'openai':
      return new OpenAIEmbeddingProvider(config)

    case 'cohere':
      return new CohereEmbeddingProvider(config)

    default:
      throw new Error(`Unsupported embedding provider: ${config.provider}`)
  }
}

/**
 * Cached Embedding Provider
 *
 * Wraps any embedding provider with caching to reduce costs and latency.
 */
export class CachedEmbeddingProvider implements EmbeddingProvider {
  readonly name: string
  readonly defaultModel: string
  readonly models: any[]

  private provider: EmbeddingProvider
  private cache: EmbeddingCache

  constructor(provider: EmbeddingProvider, cache?: EmbeddingCache) {
    this.provider = provider
    this.cache = cache || new MemoryEmbeddingCache()
    this.name = `${provider.name}-cached`
    this.defaultModel = provider.defaultModel
    this.models = provider.models
  }

  async embed(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const model = request.model || this.defaultModel
    const texts = Array.isArray(request.input) ? request.input : [request.input]

    // Check cache for each text
    const embeddings: number[][] = []
    const uncachedTexts: string[] = []
    const uncachedIndices: number[] = []

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i]
      if (!text) continue

      const cached = await this.cache.get(text, model)
      if (cached) {
        embeddings[i] = cached
      } else {
        uncachedTexts.push(text)
        uncachedIndices.push(i)
      }
    }

    // Generate embeddings for uncached texts
    if (uncachedTexts.length > 0) {
      const response = await this.provider.embed({
        ...request,
        input: uncachedTexts,
      })

      // Cache new embeddings
      for (let i = 0; i < uncachedTexts.length; i++) {
        const embedding = response.embeddings[i]
        const text = uncachedTexts[i]
        const index = uncachedIndices[i]

        if (!embedding || !text || index === undefined) continue

        await this.cache.set(text, model, embedding)
        embeddings[index] = embedding
      }

      return {
        ...response,
        embeddings,
      }
    }

    // All were cached
    const firstEmbedding = embeddings[0]
    return {
      embeddings,
      model,
      dimension: firstEmbedding?.length ?? 0,
    }
  }

  async embedText(text: string, model?: string): Promise<number[]> {
    const m = model || this.defaultModel

    // Check cache
    const cached = await this.cache.get(text, m)
    if (cached) return cached

    // Generate and cache
    const embedding = await this.provider.embedText(text, model)
    await this.cache.set(text, m, embedding)

    return embedding
  }

  async embedBatch(texts: string[], model?: string): Promise<number[][]> {
    const response = await this.embed({
      input: texts,
      model,
    })
    return response.embeddings
  }

  getDimension(model?: string): number {
    return this.provider.getDimension(model)
  }

  async getCacheStats() {
    return await this.cache.stats()
  }

  async clearCache() {
    return await this.cache.clear()
  }
}

/**
 * Create a cached embedding provider
 */
export function createCachedEmbeddingProvider(
  providerOrConfig: EmbeddingProvider | EmbeddingConfig,
  options?: { cache?: EmbeddingCache }
): CachedEmbeddingProvider {
  const provider =
    'name' in providerOrConfig && 'embed' in providerOrConfig
      ? (providerOrConfig as EmbeddingProvider)
      : createEmbeddingProvider(providerOrConfig as EmbeddingConfig)

  return new CachedEmbeddingProvider(provider, options?.cache)
}

/**
 * Utility functions for embeddings
 */
export const EmbeddingUtils = {
  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have same dimension')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0
      const bVal = b[i] ?? 0
      dotProduct += aVal * bVal
      normA += aVal * aVal
      normB += bVal * bVal
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  },

  /**
   * Find most similar embeddings
   */
  findMostSimilar(
    query: number[],
    candidates: Array<{ embedding: number[]; data: any }>,
    topK = 5
  ): Array<{ similarity: number; data: any }> {
    const similarities = candidates.map((c) => ({
      similarity: this.cosineSimilarity(query, c.embedding),
      data: c.data,
    }))

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
  },

  /**
   * Estimate token count for text
   */
  estimateTokens(text: string): number {
    // Rough estimation: ~4 chars per token
    return Math.ceil(text.length / 4)
  },

  /**
   * Calculate embedding cost
   */
  calculateCost(tokens: number, costPer1M: number): number {
    return (tokens / 1_000_000) * costPer1M
  },
}
