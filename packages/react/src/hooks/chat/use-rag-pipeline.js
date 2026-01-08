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
'use client';
import * as React from 'react';
import { useVectorStore } from '../vector-stores/react';
import { useEmbeddings } from '../embeddings/react';
import { validateVectorStoreProvider, validateEmbeddingProvider, } from '../utils/runtime-validation';
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
export function useRAGPipeline(options) {
    const { vectorStore, embeddingProvider, apiKeys, reranker } = options;
    // Runtime validation
    React.useEffect(() => {
        try {
            validateVectorStoreProvider(vectorStore);
            validateEmbeddingProvider(embeddingProvider);
        }
        catch (error) {
            if (process.env['NODE_ENV'] === 'development') {
                console.error('[useRAGPipeline] Validation error:', error);
                throw error;
            }
        }
    }, [vectorStore, embeddingProvider]);
    const vs = useVectorStore({
        provider: vectorStore,
        config: {
            apiKey: apiKeys?.vectorStore,
            indexName: 'default',
        },
    });
    const embeddings = useEmbeddings({
        provider: embeddingProvider,
        apiKey: apiKeys?.embeddings,
    });
    const [context, setContext] = React.useState({ documents: [], query: '' });
    const retrieve = React.useCallback(async (query, limit = 5) => {
        try {
            // Generate embedding for query (single string returns number[])
            const queryEmbedding = (await embeddings.generate(query));
            // Search vector store
            const results = await vs.search(queryEmbedding, { topK: limit });
            setContext({ documents: results, query });
            return results;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('RAG retrieval failed');
            console.error('[useRAGPipeline] Retrieval failed:', error);
            // Return empty array on error (fail gracefully)
            return [];
        }
    }, [vs, embeddings]);
    const rerankResults = React.useCallback(async (query, documents) => {
        if (!reranker || documents.length === 0)
            return documents;
        // Reranking implementation would go here
        return documents;
    }, [reranker]);
    return {
        retrieve,
        rerank: rerankResults,
        context,
    };
}
//# sourceMappingURL=use-rag-pipeline.js.map