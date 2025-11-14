/**
 * Embeddings Types
 * 
 * Unified interface for embedding generation across multiple providers
 * (OpenAI, Cohere, HuggingFace, Google, etc.)
 */

export interface EmbeddingConfig {
  /** Provider name */
  provider: 'openai' | 'cohere' | 'huggingface' | 'google' | 'custom'
  /** API key */
  apiKey?: string
  /** Model name */
  model?: string
  /** API endpoint (for custom or self-hosted) */
  endpoint?: string
  /** Batch size for bulk operations */
  batchSize?: number
  /** Additional provider-specific config */
  config?: Record<string, any>
}

export interface EmbeddingRequest {
  /** Text or texts to embed */
  input: string | string[]
  /** Model to use (overrides config) */
  model?: string
  /** Encoding format */
  encodingFormat?: 'float' | 'base64'
  /** User identifier for tracking */
  user?: string
  /** Dimensions (for providers that support it) */
  dimensions?: number
}

export interface EmbeddingResponse {
  /** Generated embeddings */
  embeddings: number[][]
  /** Model used */
  model: string
  /** Token usage */
  usage?: {
    promptTokens: number
    totalTokens: number
  }
  /** Dimension of embeddings */
  dimension: number
}

export interface EmbeddingProvider {
  /** Provider name */
  readonly name: string
  /** Default model */
  readonly defaultModel: string
  /** Supported models */
  readonly models: EmbeddingModel[]
  
  /**
   * Generate embeddings for text
   */
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>
  
  /**
   * Generate embedding for single text (convenience method)
   */
  embedText(text: string, model?: string): Promise<number[]>
  
  /**
   * Generate embeddings for multiple texts
   */
  embedBatch(texts: string[], model?: string): Promise<number[][]>
  
  /**
   * Get embedding dimension for a model
   */
  getDimension(model?: string): number
}

export interface EmbeddingModel {
  /** Model ID */
  id: string
  /** Display name */
  name: string
  /** Embedding dimension */
  dimension: number
  /** Max input tokens */
  maxTokens: number
  /** Cost per 1M tokens (USD) */
  costPer1M: number
  /** Performance tier */
  performance: 'fast' | 'balanced' | 'quality'
  /** Recommended use case */
  useCase?: string
}

/**
 * Embedding cache entry
 */
export interface EmbeddingCacheEntry {
  /** Cache key (hash of text + model) */
  key: string
  /** Text that was embedded */
  text: string
  /** Model used */
  model: string
  /** Generated embedding */
  embedding: number[]
  /** Timestamp */
  timestamp: number
  /** Expiry time (optional) */
  expiresAt?: number
}

/**
 * Semantic cache for embeddings
 */
export interface EmbeddingCache {
  /**
   * Get embedding from cache
   */
  get(text: string, model: string): Promise<number[] | null>
  
  /**
   * Store embedding in cache
   */
  set(text: string, model: string, embedding: number[], ttl?: number): Promise<void>
  
  /**
   * Check if embedding is cached
   */
  has(text: string, model: string): Promise<boolean>
  
  /**
   * Clear cache
   */
  clear(): Promise<void>
  
  /**
   * Get cache stats
   */
  stats(): Promise<{
    size: number
    hits: number
    misses: number
    hitRate: number
  }>
}

