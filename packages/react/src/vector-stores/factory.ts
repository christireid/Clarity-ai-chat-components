/**
 * Vector Store Factory
 *
 * Centralized factory function for creating vector store instances.
 * This module exists to avoid circular dependencies between index.ts and react.tsx.
 *
 * @internal
 */

import type {
  VectorStore,
  VectorStoreConfig,
  PineconeStoreConfig,
  QdrantStoreConfig,
  WeaviateStoreConfig,
  ChromaStoreConfig,
} from './types'
import { PineconeVectorStore } from './pinecone'
import { QdrantVectorStore } from './qdrant'
import { WeaviateVectorStore } from './weaviate'
import { ChromaVectorStore } from './chroma'

/**
 * Runtime validation errors for vector store configuration
 */
export class VectorStoreConfigError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly field?: string
  ) {
    super(message)
    this.name = 'VectorStoreConfigError'
  }
}

/**
 * Validate required string field
 */
function validateRequiredString(
  value: unknown,
  fieldName: string,
  provider: string
): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new VectorStoreConfigError(
      `${fieldName} is required and must be a non-empty string`,
      provider,
      fieldName
    )
  }
}

/**
 * Validate Pinecone configuration
 */
function validatePineconeConfig(config: PineconeStoreConfig): void {
  validateRequiredString(config.apiKey, 'apiKey', 'pinecone')
  validateRequiredString(config.indexName, 'indexName', 'pinecone')

  // Environment is optional but must be valid if provided
  if (
    config.environment !== undefined &&
    typeof config.environment !== 'string'
  ) {
    throw new VectorStoreConfigError(
      'environment must be a string',
      'pinecone',
      'environment'
    )
  }
}

/**
 * Validate Qdrant configuration
 */
function validateQdrantConfig(config: QdrantStoreConfig): void {
  validateRequiredString(config.indexName, 'indexName', 'qdrant')

  // Validate endpoint if provided
  if (config.endpoint !== undefined) {
    validateRequiredString(config.endpoint, 'endpoint', 'qdrant')
    if (
      !config.endpoint.startsWith('http://') &&
      !config.endpoint.startsWith('https://')
    ) {
      throw new VectorStoreConfigError(
        'endpoint must be a valid URL starting with http:// or https://',
        'qdrant',
        'endpoint'
      )
    }
  }

  // Dimension must be positive integer if provided
  if (config.dimension !== undefined) {
    if (
      typeof config.dimension !== 'number' ||
      config.dimension <= 0 ||
      !Number.isInteger(config.dimension)
    ) {
      throw new VectorStoreConfigError(
        'dimension must be a positive integer',
        'qdrant',
        'dimension'
      )
    }
  }
}

/**
 * Validate Weaviate configuration
 */
function validateWeaviateConfig(config: WeaviateStoreConfig): void {
  validateRequiredString(config.indexName, 'indexName', 'weaviate')
  validateRequiredString(config.endpoint, 'endpoint', 'weaviate')

  // Validate endpoint is a valid URL
  if (
    !config.endpoint.startsWith('http://') &&
    !config.endpoint.startsWith('https://')
  ) {
    throw new VectorStoreConfigError(
      'endpoint must be a valid URL starting with http:// or https://',
      'weaviate',
      'endpoint'
    )
  }
}

/**
 * Validate Chroma configuration
 */
function validateChromaConfig(config: ChromaStoreConfig): void {
  validateRequiredString(config.indexName, 'indexName', 'chroma')

  // Endpoint validation (optional - defaults to localhost)
  if (config.endpoint !== undefined) {
    if (typeof config.endpoint !== 'string' || config.endpoint.trim() === '') {
      throw new VectorStoreConfigError(
        'endpoint must be a non-empty string',
        'chroma',
        'endpoint'
      )
    }
  }
}

/**
 * Create a vector store instance
 *
 * Factory function that creates the appropriate vector store based on provider.
 * Includes comprehensive runtime validation to catch configuration errors early.
 *
 * @param config - Configuration for the vector store
 * @returns A vector store instance
 * @throws {VectorStoreConfigError} If configuration is invalid
 * @throws {Error} If provider is not supported
 *
 * @example
 * ```tsx
 * const store = createVectorStore({
 *   provider: 'pinecone',
 *   apiKey: process.env.PINECONE_API_KEY,
 *   environment: 'us-east1-gcp',
 *   indexName: 'documents',
 * })
 *
 * await store.initialize()
 * ```
 */
export function createVectorStore(config: VectorStoreConfig): VectorStore {
  // Validate config object exists
  if (!config || typeof config !== 'object') {
    throw new VectorStoreConfigError(
      'Configuration object is required',
      'unknown'
    )
  }

  switch (config.provider) {
    case 'pinecone': {
      validatePineconeConfig(config)
      return new PineconeVectorStore(config)
    }

    case 'qdrant': {
      validateQdrantConfig(config)
      return new QdrantVectorStore(config)
    }

    case 'weaviate': {
      validateWeaviateConfig(config)
      return new WeaviateVectorStore(config)
    }

    case 'chroma': {
      validateChromaConfig(config)
      return new ChromaVectorStore(config)
    }

    case 'custom':
      throw new VectorStoreConfigError(
        'Custom vector store requires manual implementation. ' +
          'Please implement the VectorStore interface directly.',
        'custom'
      )

    default: {
      const _exhaustiveCheck: never = config
      throw new VectorStoreConfigError(
        `Unsupported vector store provider: "${(_exhaustiveCheck as VectorStoreConfig).provider}". ` +
          'Supported providers: pinecone, qdrant, weaviate, chroma',
        (_exhaustiveCheck as VectorStoreConfig).provider
      )
    }
  }
}
