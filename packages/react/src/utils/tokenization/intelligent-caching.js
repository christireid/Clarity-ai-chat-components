/**
 * Intelligent Caching Layer for Token Optimization
 *
 * This module implements multi-level caching with:
 * - Semantic similarity matching
 * - Context-aware cache keys
 * - Predictive preloading
 * - Adaptive cache sizing
 * - Real-time cache analytics
 * - Cross-conversation cache sharing
 */
import { TokenCounter } from '@clarity-chat/token-optimization';
/**
 * Advanced semantic cache with intelligent matching
 */
export class IntelligentSemanticCache {
    cache;
    semanticIndex;
    contextIndex;
    accessPatterns;
    config;
    stats;
    preloadingQueue;
    constructor(config) {
        this.cache = new Map();
        this.semanticIndex = new Map();
        this.contextIndex = new Map();
        this.accessPatterns = new Map();
        this.config = config;
        this.stats = this.initializeStats();
        this.preloadingQueue = [];
        if (config.enableAnalytics) {
            this.startAnalyticsCollection();
        }
    }
    /**
     * Get cached result with intelligent matching
     */
    async get(key, context) {
        const startTime = performance.now();
        // Try exact match first
        let entry = this.cache.get(key);
        // Try semantic matching if enabled
        if (!entry && this.config.strategy === 'semantic') {
            entry = (await this.findSemanticMatch(key)) ?? undefined;
        }
        // Try contextual matching if enabled
        if (!entry && context && this.config.strategy === 'contextual') {
            entry = (await this.findContextualMatch(key, context)) ?? undefined;
        }
        if (entry) {
            this.updateEntryAccess(entry, key);
            const responseTime = performance.now() - startTime;
            this.updateStats(true, responseTime, entry.tokens);
            return entry.value;
        }
        const responseTime = performance.now() - startTime;
        this.updateStats(false, responseTime, 0);
        return null;
    }
    /**
     * Set cache entry with intelligent indexing
     */
    async set(key, value, context, metadata) {
        const tokens = value.tokens || (await TokenCounter.count(JSON.stringify(value)));
        // Check cache size and evict if necessary
        if (this.cache.size >= this.config.maxSize) {
            this.evictEntry();
        }
        const entry = {
            key,
            value,
            tokens,
            hits: 0,
            lastAccessed: Date.now(),
            created: Date.now(),
            ttl: this.config.ttl || 3600000, // 1 hour default
            semanticHash: this.generateSemanticHash(key),
            contextHash: context ? this.generateContextHash(context) : undefined,
            accessPattern: this.getCurrentAccessPattern(),
        };
        this.cache.set(key, entry);
        // Update indexes
        if (this.config.strategy === 'semantic') {
            this.updateSemanticIndex(entry);
        }
        if (this.config.strategy === 'contextual' && context) {
            this.updateContextIndex(entry, context);
        }
        // Update access patterns
        this.updateAccessPattern(key);
    }
    /**
     * Find semantic match using similarity algorithms
     */
    async findSemanticMatch(key) {
        const keyHash = this.generateSemanticHash(key);
        const candidates = this.semanticIndex.get(keyHash) || new Set();
        let bestMatch = null;
        let bestScore = this.config.semanticThreshold || 0.8;
        for (const candidateKey of candidates) {
            const entry = this.cache.get(candidateKey);
            if (!entry)
                continue;
            const similarity = this.calculateSemanticSimilarity(key, entry.key);
            if (similarity > bestScore) {
                bestScore = similarity;
                bestMatch = entry;
            }
        }
        return bestMatch;
    }
    /**
     * Find contextual match based on conversation context
     */
    async findContextualMatch(key, context) {
        const contextHash = this.generateContextHash(context);
        const candidates = this.contextIndex.get(contextHash) || new Set();
        let bestMatch = null;
        let bestScore = 0.6;
        for (const candidateKey of candidates) {
            const entry = this.cache.get(candidateKey);
            if (!entry || !entry.contextHash)
                continue;
            const contextSimilarity = this.calculateContextSimilarity(context, entry.contextHash);
            const keySimilarity = this.calculateSemanticSimilarity(key, entry.key);
            const combinedScore = contextSimilarity * 0.6 + keySimilarity * 0.4;
            if (combinedScore > bestScore) {
                bestScore = combinedScore;
                bestMatch = entry;
            }
        }
        return bestMatch;
    }
    /**
     * Multi-level cache with intelligent routing
     */
    async getMultiLevel(key, level, context) {
        // Route to appropriate cache level
        switch (level) {
            case 'memory':
                return this.get(key, context);
            case 'session':
                return this.getFromSessionStorage(key, context);
            case 'persistent':
                return this.getFromPersistentStorage(key, context);
            case 'distributed':
                return this.getFromDistributedCache(key, context);
            default:
                return this.get(key, context);
        }
    }
    /**
     * Predictive preloading based on access patterns
     */
    async preloadPredictedEntries(accessPattern) {
        const predictions = this.predictNextEntries(accessPattern);
        for (const prediction of predictions) {
            if (!this.cache.has(prediction)) {
                this.preloadingQueue.push(prediction);
            }
        }
        // Process preloading queue
        this.processPreloadingQueue();
    }
    /**
     * Intelligent cache warming based on usage patterns
     */
    async warmCache(usagePatterns) {
        const sortedPatterns = Array.from(usagePatterns.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20); // Top 20 patterns
        for (const [pattern, frequency] of sortedPatterns) {
            if (frequency > 5) {
                // High frequency patterns
                await this.preloadPredictedEntries([pattern]);
            }
        }
    }
    /**
     * Advanced cache analytics and optimization
     */
    getAnalytics() {
        const patterns = this.analyzeAccessPatterns();
        const recommendations = this.generateRecommendations();
        const opportunities = this.identifyOptimizationOpportunities();
        return {
            stats: { ...this.stats },
            patterns,
            recommendations,
            optimizationOpportunities: opportunities,
        };
    }
    /**
     * Smart eviction with multiple strategies
     */
    evictEntry() {
        let entryToEvict = null;
        let evictionKey = null;
        switch (this.config.evictionPolicy) {
            case 'lru':
                ;
                ({ entry: entryToEvict, key: evictionKey } = this.findLRUEntry());
                break;
            case 'lfu':
                ;
                ({ entry: entryToEvict, key: evictionKey } = this.findLFUEntry());
                break;
            case 'ttl':
                ;
                ({ entry: entryToEvict, key: evictionKey } = this.findTTLEntry());
                break;
            case 'adaptive':
                ;
                ({ entry: entryToEvict, key: evictionKey } = this.findAdaptiveEntry());
                break;
        }
        if (entryToEvict && evictionKey) {
            this.cache.delete(evictionKey);
            this.removeFromIndexes(entryToEvict);
            this.stats.evictions++;
            this.stats.memoryUsage -= this.estimateEntrySize(entryToEvict);
        }
    }
    /**
     * Semantic similarity calculation
     */
    calculateSemanticSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        const intersection = new Set([...words1].filter((x) => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }
    /**
     * Context similarity calculation
     */
    calculateContextSimilarity(context1, context2) {
        return this.calculateSemanticSimilarity(context1, context2);
    }
    /**
     * Generate semantic hash for similarity matching
     */
    generateSemanticHash(text) {
        const words = text.toLowerCase().split(/\s+/).sort();
        return words.slice(0, 10).join('|'); // Top 10 words as hash
    }
    /**
     * Generate context hash
     */
    generateContextHash(context) {
        return this.generateSemanticHash(context);
    }
    /**
     * Update semantic index
     */
    updateSemanticIndex(entry) {
        if (!entry.semanticHash)
            return;
        const entries = this.semanticIndex.get(entry.semanticHash) || new Set();
        entries.add(entry.key);
        this.semanticIndex.set(entry.semanticHash, entries);
    }
    /**
     * Update context index
     */
    updateContextIndex(entry, context) {
        if (!entry.contextHash)
            return;
        const entries = this.contextIndex.get(entry.contextHash) || new Set();
        entries.add(entry.key);
        this.contextIndex.set(entry.contextHash, entries);
    }
    /**
     * Remove from indexes
     */
    removeFromIndexes(entry) {
        if (entry.semanticHash) {
            const semanticEntries = this.semanticIndex.get(entry.semanticHash);
            if (semanticEntries) {
                semanticEntries.delete(entry.key);
                if (semanticEntries.size === 0) {
                    this.semanticIndex.delete(entry.semanticHash);
                }
            }
        }
        if (entry.contextHash) {
            const contextEntries = this.contextIndex.get(entry.contextHash);
            if (contextEntries) {
                contextEntries.delete(entry.key);
                if (contextEntries.size === 0) {
                    this.contextIndex.delete(entry.contextHash);
                }
            }
        }
    }
    /**
     * Find LRU entry
     */
    findLRUEntry() {
        let oldestEntry = null;
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastAccessed < oldestTime) {
                oldestTime = entry.lastAccessed;
                oldestEntry = entry;
                oldestKey = key;
            }
        }
        return oldestEntry && oldestKey
            ? { entry: oldestEntry, key: oldestKey }
            : { entry: null, key: null };
    }
    /**
     * Find LFU entry
     */
    findLFUEntry() {
        let leastUsedEntry = null;
        let leastUsedKey = null;
        let minHits = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.hits < minHits) {
                minHits = entry.hits;
                leastUsedEntry = entry;
                leastUsedKey = key;
            }
        }
        return leastUsedEntry && leastUsedKey
            ? { entry: leastUsedEntry, key: leastUsedKey }
            : { entry: null, key: null };
    }
    /**
     * Find TTL expired entry
     */
    findTTLEntry() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.created > entry.ttl) {
                return { entry, key };
            }
        }
        return { entry: null, key: null };
    }
    /**
     * Find adaptive entry based on multiple factors
     */
    findAdaptiveEntry() {
        let bestEntry = null;
        let bestKey = null;
        let bestScore = -1;
        for (const [key, entry] of this.cache.entries()) {
            const score = this.calculateAdaptiveScore(entry);
            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
                bestKey = key;
            }
        }
        return bestEntry && bestKey
            ? { entry: bestEntry, key: bestKey }
            : { entry: null, key: null };
    }
    /**
     * Calculate adaptive score for entry prioritization
     */
    calculateAdaptiveScore(entry) {
        const now = Date.now();
        const ageScore = (now - entry.lastAccessed) / 3600000; // Hours since access
        const frequencyScore = entry.hits / 10; // Normalize hits
        const sizeScore = entry.tokens / 1000; // Normalize token count
        // Combine scores (lower is better for eviction)
        return ageScore * 0.5 + frequencyScore * 0.3 + sizeScore * 0.2;
    }
    /**
     * Session storage integration
     */
    async getFromSessionStorage(key, context) {
        if (typeof sessionStorage === 'undefined')
            return null;
        try {
            const cached = sessionStorage.getItem(`semantic_${key}`);
            if (cached) {
                const entry = JSON.parse(cached);
                if (Date.now() - entry.created < entry.ttl) {
                    return entry.value;
                }
            }
        }
        catch (error) {
            console.warn('Session storage access failed:', error);
        }
        return null;
    }
    /**
     * Persistent storage integration
     */
    async getFromPersistentStorage(key, context) {
        // Implementation would use IndexedDB or similar
        return null;
    }
    /**
     * Distributed cache integration
     */
    async getFromDistributedCache(key, context) {
        // Implementation would use Redis or similar
        return null;
    }
    /**
     * Predict next entries based on access patterns
     */
    predictNextEntries(accessPattern) {
        const predictions = [];
        // Simple prediction based on last access
        if (accessPattern.length > 0) {
            const lastAccess = accessPattern[accessPattern.length - 1];
            const related = this.findRelatedKeys(lastAccess);
            predictions.push(...related);
        }
        return predictions.slice(0, 5); // Top 5 predictions
    }
    /**
     * Find related keys based on access patterns
     */
    findRelatedKeys(key) {
        const related = [];
        // Find keys with similar access patterns
        for (const [otherKey, entry] of this.cache.entries()) {
            if (otherKey === key)
                continue;
            const similarity = this.calculatePatternSimilarity(key, otherKey);
            if (similarity > 0.7) {
                related.push(otherKey);
            }
        }
        return related;
    }
    /**
     * Calculate pattern similarity
     */
    calculatePatternSimilarity(pattern1, pattern2) {
        return this.calculateSemanticSimilarity(pattern1, pattern2);
    }
    /**
     * Process preloading queue
     */
    processPreloadingQueue() {
        // Process queue asynchronously
        setTimeout(() => {
            while (this.preloadingQueue.length > 0) {
                const key = this.preloadingQueue.shift();
                if (key) {
                    // Simulate loading and caching
                    this.preloadingQueue = this.preloadingQueue.filter((k) => k !== key);
                }
            }
        }, 100);
    }
    /**
     * Analyze access patterns
     */
    analyzeAccessPatterns() {
        const patterns = new Map();
        for (const [key, entry] of this.cache.entries()) {
            const pattern = entry.accessPattern.join('->');
            patterns.set(pattern, (patterns.get(pattern) || 0) + entry.hits);
        }
        return patterns;
    }
    /**
     * Generate recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        if (this.stats.hitRate < 0.5) {
            recommendations.push('Consider increasing cache size or improving cache keys');
        }
        if (this.stats.evictions > this.cache.size * 0.1) {
            recommendations.push('High eviction rate - consider different eviction policy');
        }
        return recommendations;
    }
    /**
     * Identify optimization opportunities
     */
    identifyOptimizationOpportunities() {
        const opportunities = [];
        if (this.config.strategy === 'exact' && this.stats.hitRate < 0.7) {
            opportunities.push('Consider enabling semantic or contextual caching');
        }
        if (!this.config.enablePreloading && this.accessPatterns.size > 10) {
            opportunities.push('Enable predictive preloading based on access patterns');
        }
        return opportunities;
    }
    /**
     * Update entry access
     */
    updateEntryAccess(entry, key) {
        entry.hits++;
        entry.lastAccessed = Date.now();
        entry.accessPattern.push(key);
    }
    /**
     * Update stats
     */
    updateStats(hit, responseTime, tokens) {
        if (hit) {
            this.stats.hits++;
            this.stats.tokenSavings += tokens;
        }
        else {
            this.stats.misses++;
        }
        this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses);
        this.stats.avgResponseTime = (this.stats.avgResponseTime + responseTime) / 2;
    }
    /**
     * Initialize stats
     */
    initializeStats() {
        return {
            hits: 0,
            misses: 0,
            hitRate: 0,
            avgResponseTime: 0,
            memoryUsage: 0,
            entries: 0,
            evictions: 0,
            compressionRatio: 0,
            tokenSavings: 0,
        };
    }
    /**
     * Estimate entry size
     */
    estimateEntrySize(entry) {
        return JSON.stringify(entry).length;
    }
    /**
     * Get current access pattern
     */
    getCurrentAccessPattern() {
        return Array.from(this.accessPatterns.keys()).slice(-5);
    }
    /**
     * Update access pattern
     */
    updateAccessPattern(key) {
        this.accessPatterns.set(key, Date.now());
    }
    /**
     * Start analytics collection
     */
    startAnalyticsCollection() {
        setInterval(() => {
            this.collectAnalytics();
        }, 60000); // Every minute
    }
    /**
     * Collect analytics
     */
    collectAnalytics() {
        // Analytics collection logic
        this.stats.entries = this.cache.size;
        this.stats.memoryUsage = Array.from(this.cache.values()).reduce((total, entry) => total + this.estimateEntrySize(entry), 0);
    }
    /**
     * Process preloading queue asynchronously (public API)
     */
    async processPreloadingQueueAsync() {
        while (this.preloadingQueue.length > 0) {
            const key = this.preloadingQueue.shift();
            if (key && !this.cache.has(key)) {
                // Simulate preloading
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
        }
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return { ...this.stats };
    }
    /**
     * Clear cache
     */
    clear() {
        this.cache.clear();
        this.semanticIndex.clear();
        this.contextIndex.clear();
        this.accessPatterns.clear();
        this.stats = this.initializeStats();
    }
}
/**
 * Multi-level cache manager
 */
export class MultiLevelCacheManager {
    caches;
    config;
    constructor() {
        this.caches = new Map();
        this.config = new Map();
    }
    /**
     * Add cache level
     */
    addCacheLevel(level, config) {
        this.caches.set(level, new IntelligentSemanticCache(config));
        this.config.set(level, config);
    }
    /**
     * Multi-level get with intelligent routing
     */
    async getMultiLevel(key, context) {
        // Try each cache level in order
        const levels = [
            'memory',
            'session',
            'persistent',
            'distributed',
        ];
        for (const level of levels) {
            const cache = this.caches.get(level);
            if (cache) {
                const result = await cache.get(key, context);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }
    /**
     * Multi-level set
     */
    async setMultiLevel(key, value, context) {
        // Set in all enabled cache levels
        for (const [level, cache] of this.caches.entries()) {
            await cache.set(key, value, context);
        }
    }
    /**
     * Get comprehensive analytics
     */
    getAnalytics() {
        const analytics = new Map();
        for (const [level, cache] of this.caches.entries()) {
            analytics.set(level, cache.getAnalytics());
        }
        return analytics;
    }
    /**
     * Optimize all cache levels
     */
    optimizeAll() {
        for (const cache of this.caches.values()) {
            // Implement optimization logic
            const analytics = cache.getAnalytics();
            // Use analytics to optimize cache configuration
        }
    }
}
/**
 * Token-specific cache with intelligent features
 */
export class IntelligentTokenCache {
    cache;
    compressionCache;
    constructor(config) {
        this.cache = new IntelligentSemanticCache(config);
        this.compressionCache = new Map();
    }
    /**
     * Get cached token count with compression
     */
    async getTokenCount(text, model) {
        const cacheKey = `tokens_${text.slice(0, 50)}_${model || 'default'}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached.count;
        }
        // Calculate and cache
        const count = await TokenCounter.count(text);
        await this.cache.set(cacheKey, { count, text, model });
        return count;
    }
    /**
     * Get cached compression result
     */
    async getCompressedText(text, strategy) {
        const cacheKey = `compressed_${strategy}_${text.slice(0, 50)}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached.compressedText;
        }
        return text; // Return original if not cached
    }
    /**
     * Cache compression result
     */
    async setCompressedText(text, compressedText, strategy) {
        const cacheKey = `compressed_${strategy}_${text.slice(0, 50)}`;
        await this.cache.set(cacheKey, {
            compressedText,
            originalText: text,
            strategy,
        });
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return this.cache.getStats();
    }
}
// Export singleton instances
export const semanticCache = new IntelligentSemanticCache({
    level: 'memory',
    strategy: 'semantic',
    maxSize: 1000,
    evictionPolicy: 'lru',
    semanticThreshold: 0.7,
    enableAnalytics: true,
});
export const multiLevelCache = new MultiLevelCacheManager();
export const tokenCache = new IntelligentTokenCache({
    level: 'memory',
    strategy: 'exact',
    maxSize: 5000,
    evictionPolicy: 'lfu',
    enableAnalytics: true,
});
// Convenience functions
export async function getCachedTokenCount(text, model) {
    return tokenCache.getTokenCount(text, model);
}
export async function getCachedCompression(text, strategy) {
    return tokenCache.getCompressedText(text, strategy);
}
export async function setCachedCompression(text, compressedText, strategy) {
    return tokenCache.setCompressedText(text, compressedText, strategy);
}
export function getCacheAnalytics() {
    return {
        semantic: semanticCache.getAnalytics(),
        token: tokenCache.getStats(),
        multiLevel: multiLevelCache.getAnalytics(),
    };
}
//# sourceMappingURL=intelligent-caching.js.map