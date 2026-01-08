/**
 * Smart Caching System with Semantic Similarity
 *
 * Advanced caching that understands query similarity, not just exact matches.
 * Can save 20-40% on repeated or similar queries.
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        const aVal = a[i] ?? 0;
        const bVal = b[i] ?? 0;
        dotProduct += aVal * bVal;
        normA += aVal * aVal;
        normB += bVal * bVal;
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
// Token estimation imported from centralized module: estimateTokens
/**
 * Create a simple hash for exact matching
 */
function hashQuery(query) {
    // Normalize and create hash
    const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
    return btoa(normalized).substring(0, 32);
}
/**
 * Smart cache with semantic similarity matching
 *
 * @example
 * ```tsx
 * // Basic exact matching
 * const cache = new SmartCache<string>()
 *
 * cache.set('What is React?', 'React is a JavaScript library...')
 * const result = cache.get('What is React?')
 *
 * // With semantic similarity
 * const cache = new SmartCache<string>({
 *   enableSemanticMatching: true,
 *   embedFunction: async (text) => await getEmbedding(text),
 *   similarityThreshold: 0.85
 * })
 *
 * cache.set('What is React?', 'React is a JavaScript library...')
 * // Will find similar query even with different wording
 * const result = cache.get('Can you explain React?')
 * ```
 */
export class SmartCache {
    cache = new Map();
    options;
    stats = {
        size: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        tokensSaved: 0,
        costSaved: 0,
    };
    constructor(options = {}) {
        this.options = {
            maxSize: options.maxSize ?? 100,
            defaultTTL: options.defaultTTL ?? 0,
            similarityThreshold: options.similarityThreshold ?? 0.85,
            enableSemanticMatching: options.enableSemanticMatching ?? false,
            embedFunction: options.embedFunction,
        };
    }
    /**
     * Get from cache (exact or semantic match)
     */
    async get(query) {
        // Try exact match first
        const exactKey = hashQuery(query);
        const exactMatch = this.cache.get(exactKey);
        if (exactMatch && !this.isExpired(exactMatch)) {
            exactMatch.hits++;
            this.stats.hits++;
            this.updateStats();
            return exactMatch.response;
        }
        // Try semantic matching if enabled
        if (this.options.enableSemanticMatching && this.options.embedFunction) {
            const match = await this.findSimilar(query);
            if (match) {
                match.hits++;
                this.stats.hits++;
                this.updateStats();
                return match.response;
            }
        }
        this.stats.misses++;
        this.updateStats();
        return null;
    }
    /**
     * Set cache entry
     */
    async set(query, response, options) {
        const key = hashQuery(query);
        const timestamp = Date.now();
        const ttl = options?.ttl ?? this.options.defaultTTL;
        // Get embedding if semantic matching enabled
        let embedding;
        if (this.options.enableSemanticMatching && this.options.embedFunction) {
            try {
                embedding = await this.options.embedFunction(query);
            }
            catch (error) {
                console.warn('Failed to generate embedding:', error);
            }
        }
        const entry = {
            key,
            query,
            response,
            embedding,
            timestamp,
            hits: 0,
            tags: options?.tags,
            ttl,
        };
        this.cache.set(key, entry);
        // Enforce max size (LRU eviction)
        if (this.cache.size > this.options.maxSize) {
            this.evictLRU();
        }
        this.updateStats();
    }
    /**
     * Find similar query using embeddings
     */
    async findSimilar(query) {
        if (!this.options.embedFunction)
            return null;
        try {
            const queryEmbedding = await this.options.embedFunction(query);
            let bestMatch = null;
            let bestSimilarity = 0;
            for (const entry of this.cache.values()) {
                if (!entry.embedding || this.isExpired(entry))
                    continue;
                const similarity = cosineSimilarity(queryEmbedding, entry.embedding);
                if (similarity > bestSimilarity &&
                    similarity >= this.options.similarityThreshold) {
                    bestSimilarity = similarity;
                    bestMatch = entry;
                }
            }
            return bestMatch;
        }
        catch (error) {
            console.warn('Semantic matching failed:', error);
            return null;
        }
    }
    /**
     * Check if entry is expired
     */
    isExpired(entry) {
        if (!entry.ttl || entry.ttl === 0)
            return false;
        return Date.now() - entry.timestamp > entry.ttl;
    }
    /**
     * Evict least recently used entry
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            const score = entry.timestamp - entry.hits * 1000; // Favor frequently accessed
            if (score < oldestTime) {
                oldestTime = score;
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }
    /**
     * Clear expired entries
     */
    clearExpired() {
        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
            }
        }
        this.updateStats();
    }
    /**
     * Clear all entries
     */
    clear() {
        this.cache.clear();
        this.updateStats();
    }
    /**
     * Clear entries by tag
     */
    clearByTag(tag) {
        for (const [key, entry] of this.cache.entries()) {
            if (entry.tags?.includes(tag)) {
                this.cache.delete(key);
            }
        }
        this.updateStats();
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Update statistics
     */
    updateStats() {
        this.stats.size = this.cache.size;
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    }
    /**
     * Record token savings
     */
    recordSavings(tokens, costPerToken = 0) {
        this.stats.tokensSaved += tokens;
        this.stats.costSaved += tokens * costPerToken;
    }
    /**
     * Get all entries
     */
    getAll() {
        return Array.from(this.cache.values());
    }
    /**
     * Get entries by tag
     */
    getByTag(tag) {
        return Array.from(this.cache.values()).filter((entry) => entry.tags?.includes(tag));
    }
}
/**
 * Simple in-memory cache without semantic matching
 */
export class SimpleCache {
    maxSize;
    defaultTTL;
    cache = new Map();
    hits = 0;
    misses = 0;
    constructor(maxSize = 100, defaultTTL = 0) {
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.misses++;
            return null;
        }
        // Check expiry
        if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            this.misses++;
            return null;
        }
        this.hits++;
        return entry.value;
    }
    set(key, value, ttl) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: ttl ?? this.defaultTTL,
        });
        // Enforce max size
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey)
                this.cache.delete(firstKey);
        }
    }
    clear() {
        this.cache.clear();
    }
    getHitRate() {
        const total = this.hits + this.misses;
        return total > 0 ? (this.hits / total) * 100 : 0;
    }
    getStats() {
        return {
            size: this.cache.size,
            hits: this.hits,
            misses: this.misses,
            hitRate: this.getHitRate(),
        };
    }
}
//# sourceMappingURL=smart-cache.js.map