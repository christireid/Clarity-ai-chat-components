/**
 * Simple in-memory cache with TTL support
 */
export declare class Cache<T> {
    private cache;
    private defaultTTL;
    constructor(defaultTTL?: number);
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
    delete(key: string): void;
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
}
//# sourceMappingURL=cache.d.ts.map