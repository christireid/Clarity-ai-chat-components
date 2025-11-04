/**
 * Embedding Cache Implementation
 *
 * Semantic caching for embeddings to reduce API costs and latency.
 * Supports in-memory and persistent storage.
 */
import type { EmbeddingCache } from './types';
/**
 * In-Memory Embedding Cache
 *
 * Fast, ephemeral cache for embedding results.
 * Use for development or short-lived applications.
 */
export declare class MemoryEmbeddingCache implements EmbeddingCache {
    private cache;
    private statsData;
    private getCacheKey;
    get(text: string, model: string): Promise<number[] | null>;
    set(text: string, model: string, embedding: number[], ttl?: number): Promise<void>;
    has(text: string, model: string): Promise<boolean>;
    clear(): Promise<void>;
    stats(): Promise<{
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
}
/**
 * LocalStorage Embedding Cache
 *
 * Persistent cache using browser localStorage.
 * Use for client-side applications.
 */
export declare class LocalStorageEmbeddingCache implements EmbeddingCache {
    private storageKey;
    private statsData;
    private getCacheKey;
    private getCache;
    private setCache;
    get(text: string, model: string): Promise<number[] | null>;
    set(text: string, model: string, embedding: number[], ttl?: number): Promise<void>;
    has(text: string, model: string): Promise<boolean>;
    clear(): Promise<void>;
    stats(): Promise<{
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
}
/**
 * Semantic Cache with Similarity Search
 *
 * Advanced caching that finds similar queries instead of exact matches.
 * Reduces API calls even for slightly different text.
 */
export declare class SemanticEmbeddingCache implements EmbeddingCache {
    private cache;
    private statsData;
    private similarityThreshold;
    constructor(similarityThreshold?: number);
    private cosineSimilarity;
    private getCacheKey;
    get(text: string, model: string): Promise<number[] | null>;
    set(text: string, model: string, embedding: number[], ttl?: number): Promise<void>;
    has(text: string, model: string): Promise<boolean>;
    clear(): Promise<void>;
    stats(): Promise<{
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    }>;
}
//# sourceMappingURL=cache.d.ts.map