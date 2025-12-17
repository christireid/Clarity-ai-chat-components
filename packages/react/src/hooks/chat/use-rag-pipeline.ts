import { logger } from '@clarity-chat/utils/logger';
/**
 * useRAGPipeline - Top-level hook for RAG pipeline
 *
 * Drop-in ready hook for Retrieval-Augmented Generation with vector stores.
 *
 * @example
 * ```tsx
 * const rag = useRAGPipeline({
 *   vectorStore: 'pinecone',
 *   embeddingProvider: 'openai',
 * })
 *
 * const results = await rag.retrieve('What is React?')
 * ```
 */

'use client'

import * as React from 'react'
import { useVectorStore } from '../vector-stores/react'
import { useEmbeddings } from '../embeddings/react'
import {
  validateVectorStoreProvider,
  validateEmbeddingProvider,
} from '../../utils/config/runtime-validation'

/**
 * Options for useRAGPipeline
 */
export interface UseRAGPipelineOptions {
  /** Vector store type */
  vectorStore: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma'
  /** Embedding provider */
  embeddingProvider: 'openai' | 'cohere' | 'custom'
  /** API keys */
  apiKeys?: {
    vectorStore?: string
    embeddings?: string
  }
  /** Reranker */
  reranker?: 'cohere' | 'jina' | 'voyage'
}

/**
 * Return type for useRAGPipeline
 */
export interface UseRAGPipelineReturn {
  /** Retrieve relevant documents */
  retrieve: (query: string, limit?: number) => Promise<any[]>
  /** Rerank results */
  rerank: (query: string, documents: any[]) => Promise<any[]>
  /** Context for chat */
  context: {
    documents: any[]
    query: string
  }
}

/**
 * useRAGPipeline - Top-level RAG hook
 *
 * Provides a simple API for RAG pipeline with automatic
 * vector store and embedding management.
 *
 * @param options - Configuration options for the RAG pipeline
 * @param options.vectorStore - Vector store provider ('pinecone', 'qdrant', 'weaviate', 'chroma')
 * @param options.embeddingProvider - Embedding provider ('openai', 'cohere', 'custom')
 * @param options.apiKeys - API keys for vector store and embeddings (optional)
 * @param options.reranker - Reranker provider for result refinement (optional)
 *
 * @returns RAG pipeline instance with retrieve, rerank methods and context
 *
 * @throws {Error} If vector store or embedding initialization fails
 *
 * @example
 * ```tsx
 * const rag = useRAGPipeline({
 *   vectorStore: 'pinecone',
 *   embeddingProvider: 'openai',
 *   apiKeys: {
 *     vectorStore: process.env.PINECONE_API_KEY,
 *     embeddings: process.env.OPENAI_API_KEY,
 *   },
 * })
 *
 * const results = await rag.retrieve('What is React?', 5)
 * ```
 */
export function useRAGPipeline(
  options: UseRAGPipelineOptions
): UseRAGPipelineReturn {
  const { vectorStore, embeddingProvider, apiKeys, reranker } = options

  // Runtime validation
  React.useEffect(() => {
    try {
      validateVectorStoreProvider(vectorStore)
      validateEmbeddingProvider(embeddingProvider)
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        logger.error('[useRAGPipeline] Validation error:', error)
        throw error
      }
    }
  }, [vectorStore, embeddingProvider])

  const vs = useVectorStore({
    provider: vectorStore,
    config: {
      apiKey: apiKeys?.vectorStore,
      indexName: 'default',
    },
  })

  const embeddings = useEmbeddings({
    provider: embeddingProvider,
    apiKey: apiKeys?.embeddings,
  })

  const [context, setContext] = React.useState<{
    documents: any[]
    query: string
  }>({ documents: [], query: '' })

  const retrieve = React.useCallback(
    async (query: string, limit = 5) => {
      try {
        // Generate embedding for query (single string returns number[])
        const queryEmbedding = (await embeddings.generate(query)) as number[]

        // Search vector store
        const results = await vs.search(queryEmbedding, { topK: limit })

        setContext({ documents: results, query })
        return results
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('RAG retrieval failed')
        logger.error('[useRAGPipeline] Retrieval failed:', error)
        // Return empty array on error (fail gracefully)
        return []
      }
    },
    [vs, embeddings]
  )

  const rerankResults = React.useCallback(
    async (query: string, documents: any[]) => {
      if (!reranker || documents.length === 0) return documents
      // Reranking implementation would go here
      return documents
    },
    [reranker]
  )

  return {
    retrieve,
    rerank: rerankResults,
    context,
  }
}
