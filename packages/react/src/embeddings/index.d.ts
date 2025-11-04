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
export * from './types';
export * from './openai';
export * from './cohere';
export * from './cache';
import type { EmbeddingProvider, EmbeddingConfig, EmbeddingCache, EmbeddingRequest, EmbeddingResponse } from './types';
/**
 * Create an embedding provider
 */
export declare function createEmbeddingProvider(config: EmbeddingConfig): EmbeddingProvider;
/**
 * Cached Embedding Provider
 *
 * Wraps any embedding provider with caching to reduce costs and latency.
 */
export declare class CachedEmbeddingProvider implements EmbeddingProvider {
    readonly name: string;
    readonly defaultModel: string;
    readonly models: any[];
    private provider;
    private cache;
    constructor(provider: EmbeddingProvider, cache?: EmbeddingCache);
    embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
    embedText(text: string, model?: string): Promise<number[]>;
    embedBatch(texts: string[], model?: string): Promise<number[][]>;
    getDimension(model?: string): number;
    getCacheStats(): Promise<{
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
    clearCache(): Promise<void>;
}
/**
 * Create a cached embedding provider
 */
export declare function createCachedEmbeddingProvider(providerOrConfig: EmbeddingProvider | EmbeddingConfig, options?: {
    cache?: EmbeddingCache;
}): CachedEmbeddingProvider;
/**
 * Utility functions for embeddings
 */
export declare const EmbeddingUtils: {
    /**
     * Calculate cosine similarity between two embeddings
     */
    cosineSimilarity(a: number[], b: number[]): number;
    /**
     * Find most similar embeddings
     */
    findMostSimilar(query: number[], candidates: Array<{
        embedding: number[];
        data: any;
    }>, topK?: number): Array<{
        similarity: number;
        data: any;
    }>;
    /**
     * Estimate token count for text
     */
    estimateTokens(text: string): number;
    /**
     * Calculate embedding cost
     */
    calculateCost(tokens: number, costPer1M: number): number;
};
//# sourceMappingURL=index.d.ts.map