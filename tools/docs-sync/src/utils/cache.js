/**
 * Caching utilities for API extraction
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
const CACHE_VERSION = 1;
/** Get content hash for a file */
export function getContentHash(content) {
    return createHash('sha256').update(content).digest('hex').slice(0, 16);
}
/** Get content hash for a file path */
export function getFileHash(filePath) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        return getContentHash(content);
    }
    catch {
        return '';
    }
}
/** Load cache from disk */
export function loadCache(cachePath) {
    try {
        if (existsSync(cachePath)) {
            const data = readFileSync(cachePath, 'utf-8');
            const cache = JSON.parse(data);
            // Check cache version
            if (cache.version !== CACHE_VERSION) {
                return createEmptyCache();
            }
            return cache;
        }
    }
    catch {
        // Cache corrupted, return empty
    }
    return createEmptyCache();
}
/** Save cache to disk */
export function saveCache(cache, cachePath) {
    const dir = dirname(cachePath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
}
/** Create empty cache */
export function createEmptyCache() {
    return {
        version: CACHE_VERSION,
        entries: {},
    };
}
/** Check if a file is cached and valid */
export function isCacheValid(cache, filePath, currentHash) {
    const entry = cache.entries[filePath];
    if (!entry)
        return false;
    return entry.contentHash === currentHash;
}
/** Get cached APIs for a file */
export function getCachedAPIs(cache, filePath) {
    const entry = cache.entries[filePath];
    return entry?.apis ?? null;
}
/** Set cached APIs for a file */
export function setCacheEntry(cache, filePath, contentHash, apis) {
    cache.entries[filePath] = {
        filePath,
        contentHash,
        apis,
        cachedAt: new Date().toISOString(),
    };
}
/** Remove stale entries from cache */
export function pruneCache(cache, validPaths) {
    let removed = 0;
    for (const path of Object.keys(cache.entries)) {
        if (!validPaths.has(path)) {
            delete cache.entries[path];
            removed++;
        }
    }
    return removed;
}
/** Get cache statistics */
export function getCacheStats(cache, hits, misses) {
    const total = hits + misses;
    return {
        totalEntries: Object.keys(cache.entries).length,
        hitRate: total > 0 ? hits / total : 0,
        missRate: total > 0 ? misses / total : 0,
        lastFullExtraction: cache.lastFullExtraction,
    };
}
/** Merge caches (for parallel processing) */
export function mergeCaches(caches) {
    const merged = createEmptyCache();
    for (const cache of caches) {
        for (const [path, entry] of Object.entries(cache.entries)) {
            // Keep the newer entry
            const existing = merged.entries[path];
            if (!existing || new Date(entry.cachedAt) > new Date(existing.cachedAt)) {
                merged.entries[path] = entry;
            }
        }
        // Track latest full extraction
        if (cache.lastFullExtraction) {
            if (!merged.lastFullExtraction ||
                new Date(cache.lastFullExtraction) > new Date(merged.lastFullExtraction)) {
                merged.lastFullExtraction = cache.lastFullExtraction;
            }
        }
    }
    return merged;
}
/** Create a cache key from multiple inputs */
export function createCacheKey(...inputs) {
    return getContentHash(inputs.join(':'));
}
/** Simple in-memory LRU cache for API extraction results */
export class LRUCache {
    cache = new Map();
    maxSize;
    constructor(maxSize) {
        this.maxSize = maxSize;
    }
    get(key) {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }
    set(key, value) {
        // Remove existing to update position
        this.cache.delete(key);
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldest = this.cache.keys().next().value;
            if (oldest !== undefined) {
                this.cache.delete(oldest);
            }
        }
        this.cache.set(key, value);
    }
    has(key) {
        return this.cache.has(key);
    }
    clear() {
        this.cache.clear();
    }
    get size() {
        return this.cache.size;
    }
}
//# sourceMappingURL=cache.js.map