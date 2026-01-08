/**
 * Caching utilities for API extraction
 */
import type { APICache, ExtractedAPI } from '../types/index.js';
/** Get content hash for a file */
export declare function getContentHash(content: string): string;
/** Get content hash for a file path */
export declare function getFileHash(filePath: string): string;
/** Load cache from disk */
export declare function loadCache(cachePath: string): APICache;
/** Save cache to disk */
export declare function saveCache(cache: APICache, cachePath: string): void;
/** Create empty cache */
export declare function createEmptyCache(): APICache;
/** Check if a file is cached and valid */
export declare function isCacheValid(cache: APICache, filePath: string, currentHash: string): boolean;
/** Get cached APIs for a file */
export declare function getCachedAPIs(cache: APICache, filePath: string): ExtractedAPI[] | null;
/** Set cached APIs for a file */
export declare function setCacheEntry(cache: APICache, filePath: string, contentHash: string, apis: ExtractedAPI[]): void;
/** Remove stale entries from cache */
export declare function pruneCache(cache: APICache, validPaths: Set<string>): number;
/** Cache statistics */
export interface CacheStats {
    totalEntries: number;
    hitRate: number;
    missRate: number;
    lastFullExtraction?: string;
}
/** Get cache statistics */
export declare function getCacheStats(cache: APICache, hits: number, misses: number): CacheStats;
/** Merge caches (for parallel processing) */
export declare function mergeCaches(caches: APICache[]): APICache;
/** Create a cache key from multiple inputs */
export declare function createCacheKey(...inputs: string[]): string;
/** Simple in-memory LRU cache for API extraction results */
export declare class LRUCache<K, V> {
    private cache;
    private readonly maxSize;
    constructor(maxSize: number);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    clear(): void;
    get size(): number;
}
//# sourceMappingURL=cache.d.ts.map