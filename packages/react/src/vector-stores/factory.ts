/**
 * Vector Store Factory
 *
 * Centralized factory function for creating vector store instances.
 * This module exists to avoid circular dependencies between index.ts and react.tsx.
 *
 * @internal
 */

import type { VectorStore, VectorStoreConfig } from './types'
import { PineconeVectorStore } from './pinecone'
import { QdrantVectorStore } from './qdrant'
import { WeaviateVectorStore } from './weaviate'
import { ChromaVectorStore } from './chroma'

/**
 * Create a vector store instance
 *
 * Factory function that creates the appropriate vector store based on provider
 *
 * @param config - Configuration for the vector store
 * @returns A vector store instance
 * @throws Error if provider is not supported
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
  switch (config.provider) {
    case 'pinecone':
      return new PineconeVectorStore(config as any)

    case 'qdrant':
      return new QdrantVectorStore(config as any)

    case 'weaviate':
      return new WeaviateVectorStore(config as any)

    case 'chroma':
      return new ChromaVectorStore(config as any)

    default:
      throw new Error(`Unsupported vector store provider: ${config.provider}`)
  }
}
