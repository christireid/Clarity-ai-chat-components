/**
 * Enhanced in-memory cache with TTL, LRU eviction, and statistics
 */
interface CacheOptions {
    /** Default TTL in milliseconds (default: 5 minutes) */
    defaultTTL?: number;
    /** Maximum number of entries (default: 100) */
    maxSize?: number;
    /** Name for logging purposes */
    name?: string;
}
export declare class Cache<T> {
    private cache;
    private defaultTTL;
    private maxSize;
    private name;
    private hits;
    private misses;
    constructor(options?: CacheOptions | number);
    /**
     * Get cached value if not expired
     */
    get(key: string): T | null;
    /**
     * Set cached value with TTL
     */
    set(key: string, value: T, ttl?: number): void;
    /**
     * Delete cached value
     */
    delete(key: string): boolean;
    /**
     * Clear all cached values
     */
    clear(): void;
    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean;
    /**
     * Clean expired entries
     */
    clean(): number;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        maxSize: number;
        hits: number;
        misses: number;
        hitRate: number;
    };
    /**
     * Get or compute a value using a factory function
     */
    getOrSet(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
    /**
     * Get all keys in cache
     */
    keys(): string[];
    /**
     * Get current size
     */
    get size(): number;
}
/**
 * Cache key generators for MCP resources
 */
export declare const CacheKeys: {
    projectAnalysis: (path: string) => string;
    projectValidation: (path: string) => string;
    modelInfo: (model: string) => string;
    example: (name: string) => string;
    exampleList: () => string;
};
/**
 * Pre-configured cache instances for different resource types
 * All values configurable via environment variables
 */
export declare const projectCache: Cache<unknown>;
export declare const modelCache: Cache<unknown>;
export declare const exampleCache: Cache<unknown>;
export declare function stopCacheCleanup(): void;
export {};
//# sourceMappingURL=cache.d.ts.map