/**
 * Simple in-memory cache with TTL support
 */
export class Cache {
    cache = new Map();
    defaultTTL;
    constructor(defaultTTL = 5 * 60 * 1000) {
        this.defaultTTL = defaultTTL;
    }
    /**
     * Get cached value if not expired
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        if (entry.expires < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    /**
     * Set cached value with TTL
     */
    set(key, value, ttl) {
        const expires = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { data: value, expires });
    }
    /**
     * Delete cached value
     */
    delete(key) {
        this.cache.delete(key);
    }
    /**
     * Clear all cached values
     */
    clear() {
        this.cache.clear();
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
        return cleaned;
    }
}
//# sourceMappingURL=cache.js.map