/**
 * Enhanced in-memory cache with TTL, LRU eviction, and statistics
 */
import { logger } from './logger.js';
export class Cache {
    cache = new Map();
    defaultTTL;
    maxSize;
    name;
    hits = 0;
    misses = 0;
    constructor(options = {}) {
        // Support legacy number argument for backwards compatibility
        if (typeof options === 'number') {
            this.defaultTTL = options;
            this.maxSize = 100;
            this.name = 'cache';
        }
        else {
            this.defaultTTL = options.defaultTTL ?? 5 * 60 * 1000;
            this.maxSize = options.maxSize ?? 100;
            this.name = options.name ?? 'cache';
        }
    }
    /**
     * Get cached value if not expired
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.misses++;
            return null;
        }
        if (entry.expires < Date.now()) {
            this.cache.delete(key);
            this.misses++;
            logger.debug(`[${this.name}] Cache expired`, { key });
            return null;
        }
        this.hits++;
        logger.debug(`[${this.name}] Cache hit`, { key });
        // LRU: Move to end by re-inserting
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.data;
    }
    /**
     * Set cached value with TTL
     */
    set(key, value, ttl) {
        // Evict oldest entry if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
                logger.debug(`[${this.name}] Evicted oldest entry`, { key: oldestKey });
            }
        }
        const now = Date.now();
        const expires = now + (ttl ?? this.defaultTTL);
        this.cache.set(key, { data: value, expires, createdAt: now });
        logger.debug(`[${this.name}] Cache set`, { key, ttl: ttl ?? this.defaultTTL });
    }
    /**
     * Delete cached value
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Clear all cached values
     */
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
        logger.info(`[${this.name}] Cache cleared`);
    }
    /**
     * Check if key exists and is not expired
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        if (entry.expires < Date.now()) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * Clean expired entries
     */
    clean() {
        const now = Date.now();
        let cleaned = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expires < now) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            logger.debug(`[${this.name}] Cleaned expired entries`, { count: cleaned });
        }
        return cleaned;
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const total = this.hits + this.misses;
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? this.hits / total : 0
        };
    }
    /**
     * Get or compute a value using a factory function
     */
    async getOrSet(key, factory, ttl) {
        const cached = this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await factory();
        this.set(key, value, ttl);
        return value;
    }
    /**
     * Get all keys in cache
     */
    keys() {
        return Array.from(this.cache.keys());
    }
    /**
     * Get current size
     */
    get size() {
        return this.cache.size;
    }
}
/**
 * Cache key generators for MCP resources
 */
export const CacheKeys = {
    projectAnalysis: (path) => `project:analysis:${path}`,
    projectValidation: (path) => `project:validation:${path}`,
    modelInfo: (model) => `model:info:${model}`,
    example: (name) => `example:${name}`,
    exampleList: () => 'examples:list'
};
/**
 * Parse environment variable as integer with default
 */
const parseEnvInt = (value, defaultValue) => {
    if (!value)
        return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};
/**
 * Pre-configured cache instances for different resource types
 * All values configurable via environment variables
 */
// Project cache - short TTL as project files may change
export const projectCache = new Cache({
    defaultTTL: parseEnvInt(process.env.MCP_PROJECT_CACHE_TTL, 30 * 1000), // 30 seconds
    maxSize: parseEnvInt(process.env.MCP_PROJECT_CACHE_SIZE, 50),
    name: 'project'
});
// Model info cache - long TTL as model info is static
export const modelCache = new Cache({
    defaultTTL: parseEnvInt(process.env.MCP_MODEL_CACHE_TTL, 60 * 60 * 1000), // 1 hour
    maxSize: parseEnvInt(process.env.MCP_MODEL_CACHE_SIZE, 20),
    name: 'model'
});
// Examples cache - long TTL as examples are static
export const exampleCache = new Cache({
    defaultTTL: parseEnvInt(process.env.MCP_EXAMPLE_CACHE_TTL, 60 * 60 * 1000), // 1 hour
    maxSize: parseEnvInt(process.env.MCP_EXAMPLE_CACHE_SIZE, 30),
    name: 'example'
});
// Cleanup interval (configurable via env)
const cleanupIntervalMs = parseEnvInt(process.env.MCP_CACHE_CLEANUP_INTERVAL, 5 * 60 * 1000);
// Start periodic cleanup
const cleanupInterval = setInterval(() => {
    projectCache.clean();
    modelCache.clean();
    exampleCache.clean();
}, cleanupIntervalMs);
// Unref to allow process to exit
if (cleanupInterval.unref) {
    cleanupInterval.unref();
}
// Allow cleanup interval to be cleared for testing
export function stopCacheCleanup() {
    clearInterval(cleanupInterval);
}
//# sourceMappingURL=cache.js.map