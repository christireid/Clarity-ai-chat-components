/**
 * Clarity Memory - Embedding Providers
 * 
 * Embedding provider implementations for various services
 */

import type { Embedder } from '../core/types'

/**
 * OpenAI Embedding Provider
 */
export class OpenAIEmbedder implements Embedder {
  private apiKey: string
  private model: string
  private baseURL?: string

  constructor(apiKey: string, options: { model?: string; baseURL?: string } = {}) {
    this.apiKey = apiKey
    this.model = options.model || 'text-embedding-3-small'
    this.baseURL = options.baseURL
  }

  async embed(text: string): Promise<number[]> {
    const response = await fetch(
      `${this.baseURL || 'https://api.openai.com/v1'}/embeddings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json() as { data: Array<{ embedding: number[] }> }
    if (!data.data || data.data.length === 0) {
      throw new Error('No embeddings returned from API')
    }
    const first = data.data[0]
    if (!first) {
      throw new Error('No embeddings returned from API')
    }
    return first.embedding
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await fetch(
      `${this.baseURL || 'https://api.openai.com/v1'}/embeddings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: texts,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json() as { data: Array<{ embedding: number[] }> }
    return data.data.map((item) => item.embedding)
  }
}

/**
 * Mock Embedder (for testing/development)
 * Returns random embeddings
 */
export class MockEmbedder implements Embedder {
  private dimension: number

  constructor(dimension: number = 1536) {
    this.dimension = dimension
  }

  async embed(text: string): Promise<number[]> {
    // Generate deterministic "random" embedding based on text hash
    const hash = this.hashString(text)
    const embedding: number[] = []
    
    for (let i = 0; i < this.dimension; i++) {
      // Use hash + index to generate pseudo-random value
      const seed = (hash + i) % 1000000
      embedding.push((seed / 1000000) * 2 - 1) // Normalize to [-1, 1]
    }
    
    return embedding
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(text => this.embed(text)))
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

/**
 * Create an embedder from configuration
 */
export function createEmbedder(
  provider: 'openai' | 'mock',
  config: { apiKey?: string; model?: string; baseURL?: string; dimension?: number }
): Embedder {
  switch (provider) {
    case 'openai':
      if (!config.apiKey) {
        throw new Error('OpenAI API key is required')
      }
      return new OpenAIEmbedder(config.apiKey, {
        model: config.model,
        baseURL: config.baseURL,
      })
    
    case 'mock':
      return new MockEmbedder(config.dimension)
    
    default:
      throw new Error(`Unknown embedder provider: ${provider}`)
  }
}
