/**
 * Response Cache
 *
 * Caches AI responses to reduce API costs and improve response times.
 * Uses query content + RAG context as cache key for accuracy.
 */
export interface CachedResponse {
    query: string;
    response: string;
    sources?: Array<{
        url: string;
        title: string;
        confidence: number;
    }>;
    model: string;
    timestamp: string;
    hits: number;
}
export interface CacheStats {
    totalQueries: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    estimatedSavings: number;
}
interface ResponseCache {
    /** Get cached response */
    get(query: string, contextHash?: string): Promise<CachedResponse | null>;
    /** Store response in cache */
    set(query: string, response: string, options: {
        sources?: Array<{
            url: string;
            title: string;
            confidence: number;
        }>;
        model?: string;
        contextHash?: string;
        ttl?: number;
    }): Promise<void>;
    /** Get cache statistics */
    getStats(): Promise<CacheStats>;
    /** Clear cache */
    clear(): Promise<void>;
}
/**
 * Redis Response Cache (Production)
 */
export declare class RedisResponseCache implements ResponseCache {
    private redis;
    private defaultTTL;
    constructor(ttl?: number);
    private getCacheKey;
    private getStatsKey;
    get(query: string, contextHash?: string): Promise<CachedResponse | null>;
    set(query: string, response: string, options: {
        sources?: Array<{
            url: string;
            title: string;
            confidence: number;
        }>;
        model?: string;
        contextHash?: string;
        ttl?: number;
    }): Promise<void>;
    getStats(): Promise<CacheStats>;
    clear(): Promise<void>;
}
/**
 * Local Response Cache (Development)
 */
export declare class LocalResponseCache implements ResponseCache {
    private cache;
    private stats;
    get(query: string, contextHash?: string): Promise<CachedResponse | null>;
    set(query: string, response: string, options: {
        sources?: Array<{
            url: string;
            title: string;
            confidence: number;
        }>;
        model?: string;
        contextHash?: string;
        ttl?: number;
    }): Promise<void>;
    getStats(): Promise<CacheStats>;
    clear(): Promise<void>;
}
/**
 * Get the appropriate response cache based on environment
 */
export declare function getResponseCache(): ResponseCache;
/**
 * Generate context hash for RAG queries
 * Uses source URLs to create a stable hash
 */
export declare function generateContextHash(sources: Array<{
    url: string;
}>): string;
export {};
//# sourceMappingURL=responseCache.d.ts.map