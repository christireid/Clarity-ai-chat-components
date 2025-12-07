/**
 * Simple LRU Cache Implementation
 *
 * Used for caching embeddings and other expensive operations
 */
export class LRUCache {
    cache;
    maxSize;
    ttl;
    constructor(options) {
        this.cache = new Map();
        this.maxSize = options.maxSize;
        this.ttl = options.ttl;
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return undefined;
        }
        // Check TTL
        if (this.ttl && Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return undefined;
        }
        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, item);
        return item.value;
    }
    set(key, value) {
        // Remove if exists
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        // Add new item
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
        });
        // Evict oldest if over limit
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
    }
    has(key) {
        const item = this.cache.get(key);
        if (!item)
            return false;
        // Check TTL
        if (this.ttl && Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
    /**
     * Clean expired entries
     */
    cleanup() {
        if (!this.ttl)
            return 0;
        const now = Date.now();
        let cleaned = 0;
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > this.ttl) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }
}
//# sourceMappingURL=cache.js.map