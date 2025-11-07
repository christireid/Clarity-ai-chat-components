/**
 * Vector Stores - Enterprise RAG Infrastructure
 *
 * Unified interface for multiple vector databases enabling seamless switching
 * between providers without code changes.
 *
 * @example
 * ```tsx
 * // Pinecone
 * const store = createVectorStore({
 *   provider: 'pinecone',
 *   apiKey: process.env.PINECONE_API_KEY,
 *   environment: 'us-east1-gcp',
 *   indexName: 'my-index',
 * })
 *
 * // Qdrant
 * const store = createVectorStore({
 *   provider: 'qdrant',
 *   endpoint: 'https://xyz.qdrant.io',
 *   apiKey: process.env.QDRANT_API_KEY,
 *   indexName: 'my-collection',
 * })
 *
 * // Usage (same for all providers)
 * await store.initialize()
 * await store.upsert(vectors)
 * const results = await store.query({ vector, topK: 10 })
 * ```
 */
export * from './types';
export * from './pinecone';
export * from './qdrant';
export * from './weaviate';
export * from './chroma';
import type { VectorStore, VectorStoreConfig } from './types';
/**
 * Create a vector store instance
 *
 * Factory function that creates the appropriate vector store based on provider
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
export declare function createVectorStore(config: VectorStoreConfig): VectorStore;
/**
 * Vector store utilities
 */
export declare const VectorStoreUtils: {
    /**
     * Batch vectors for efficient upload
     */
    batchVectors(vectors: any[], batchSize: number): any[][];
    /**
     * Generate a unique vector ID
     */
    generateId(): string;
    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(a: number[], b: number[]): number;
    /**
     * Calculate euclidean distance between two vectors
     */
    euclideanDistance(a: number[], b: number[]): number;
    /**
     * Normalize a vector to unit length
     */
    normalizeVector(vector: number[]): number[];
};
//# sourceMappingURL=index.d.ts.map