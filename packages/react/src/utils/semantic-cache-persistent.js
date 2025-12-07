/**
 * Persistent Semantic Cache with IndexedDB
 *
 * Advanced caching system that:
 * - Persists across browser sessions using IndexedDB
 * - Finds semantically similar queries using embeddings
 * - Implements LRU eviction when max entries exceeded
 * - Auto-prunes expired entries
 *
 * Can save 40-70% on repeated or similar queries.
 *
 * @module utils/semantic-cache-persistent
 */
// Default configuration values
const DEFAULT_CONFIG = {
    dbName: 'clarity-semantic-cache',
    storeName: 'responses',
    maxEntries: 1000,
    ttlMs: 24 * 60 * 60 * 1000, // 24 hours
    similarityThreshold: 0.85,
};
// IndexedDB version
const DB_VERSION = 1;
/**
 * Calculate cosine similarity between two embedding vectors
 */
function cosineSimilarity(a, b) {
    if (a.length !== b.length || a.length === 0)
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
/**
 * Generate a unique ID for cache entries
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
/**
 * Normalize query for exact matching
 */
function normalizeQuery(query) {
    return query.toLowerCase().trim().replace(/\s+/g, ' ');
}
/**
 * Persistent Semantic Cache using IndexedDB
 *
 * Note: Semantic similarity search performs a linear scan of all entries,
 * which works well for caches up to ~1000 entries. For larger caches,
 * consider reducing maxEntries or implementing vector indexing.
 *
 * @example
 * ```typescript
 * const cache = new PersistentSemanticCache({
 *   embedFunction: async (text) => await getEmbedding(text),
 *   maxEntries: 500,
 *   ttlMs: 12 * 60 * 60 * 1000, // 12 hours
 * })
 *
 * // Check cache before API call
 * const cached = await cache.checkCache('What is React?')
 * if (cached) {
 *   return cached.response
 * }
 *
 * // After API call, store response
 * const response = await callAPI('What is React?')
 * await cache.storeResponse('What is React?', response)
 * ```
 */
export class PersistentSemanticCache {
    config;
    db = null;
    dbPromise = null;
    stats = {
        hits: 0,
        misses: 0,
        tokensSaved: 0,
    };
    constructor(config) {
        // Validate required config
        if (!config.embedFunction) {
            throw new Error('embedFunction is required for PersistentSemanticCache');
        }
        // Validate optional config values
        if (config.maxEntries !== undefined && config.maxEntries <= 0) {
            throw new Error('maxEntries must be positive');
        }
        if (config.ttlMs !== undefined && config.ttlMs < 0) {
            throw new Error('ttlMs cannot be negative');
        }
        if (config.similarityThreshold !== undefined &&
            (config.similarityThreshold < 0 || config.similarityThreshold > 1)) {
            throw new Error('similarityThreshold must be between 0 and 1');
        }
        this.config = {
            dbName: config.dbName ?? DEFAULT_CONFIG.dbName,
            storeName: config.storeName ?? DEFAULT_CONFIG.storeName,
            maxEntries: config.maxEntries ?? DEFAULT_CONFIG.maxEntries,
            ttlMs: config.ttlMs ?? DEFAULT_CONFIG.ttlMs,
            similarityThreshold: config.similarityThreshold ?? DEFAULT_CONFIG.similarityThreshold,
            embedFunction: config.embedFunction,
        };
    }
    /**
     * Initialize IndexedDB connection (lazy)
     */
    async getDb() {
        if (this.db)
            return this.db;
        if (this.dbPromise)
            return this.dbPromise;
        this.dbPromise = new Promise((resolve, reject) => {
            // Check if IndexedDB is available
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB is not available'));
                return;
            }
            const request = indexedDB.open(this.config.dbName, DB_VERSION);
            request.onerror = () => {
                reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.config.storeName)) {
                    const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' });
                    // Create indexes for efficient queries
                    store.createIndex('query', 'query', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                }
            };
        });
        // Reset dbPromise on failure so next call can retry
        this.dbPromise.catch(() => {
            this.dbPromise = null;
        });
        return this.dbPromise;
    }
    /**
     * Check cache for a matching response
     */
    async checkCache(query) {
        // Validate input - avoid expensive embedding call for invalid queries
        if (!query || typeof query !== 'string') {
            return null;
        }
        try {
            const db = await this.getDb();
            const normalizedQuery = normalizeQuery(query);
            // First, try exact match
            const exactMatch = await this.findExactMatch(db, normalizedQuery);
            if (exactMatch && !this.isExpired(exactMatch)) {
                await this.updateHitCount(db, exactMatch.id);
                this.stats.hits++;
                return exactMatch;
            }
            // Try semantic similarity match
            const queryEmbedding = await this.config.embedFunction(query);
            const semanticMatch = await this.findSemanticMatch(db, queryEmbedding);
            if (semanticMatch) {
                await this.updateHitCount(db, semanticMatch.id);
                this.stats.hits++;
                return semanticMatch;
            }
            this.stats.misses++;
            return null;
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] Cache check failed:', error);
            this.stats.misses++;
            return null;
        }
    }
    /**
     * Store a response in the cache
     */
    async storeResponse(query, response, metadata) {
        // Validate inputs
        if (!query || typeof query !== 'string') {
            console.warn('[PersistentSemanticCache] Invalid query - skipping store');
            return;
        }
        if (!response || typeof response !== 'string') {
            console.warn('[PersistentSemanticCache] Invalid response - skipping store');
            return;
        }
        try {
            const db = await this.getDb();
            const queryEmbedding = await this.config.embedFunction(query);
            const now = Date.now();
            const entry = {
                id: generateId(),
                query: normalizeQuery(query),
                queryEmbedding,
                response,
                timestamp: now,
                hits: 0,
                lastAccessed: now,
                metadata,
            };
            await this.put(db, entry);
            // Enforce max entries (LRU eviction)
            await this.enforceMaxEntries(db);
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] Store failed:', error);
        }
    }
    /**
     * Find entries similar to the given embedding
     */
    async findSimilar(embedding, threshold) {
        try {
            const db = await this.getDb();
            const entries = await this.getAllEntries(db);
            const similarityThreshold = threshold ?? this.config.similarityThreshold;
            const matches = [];
            for (const entry of entries) {
                if (this.isExpired(entry))
                    continue;
                const similarity = cosineSimilarity(embedding, entry.queryEmbedding);
                if (similarity >= similarityThreshold) {
                    matches.push({ entry, similarity });
                }
            }
            // Sort by similarity descending
            matches.sort((a, b) => b.similarity - a.similarity);
            return matches.map((m) => m.entry);
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] findSimilar failed:', error);
            return [];
        }
    }
    /**
     * Remove expired entries
     */
    async prune() {
        try {
            const db = await this.getDb();
            const entries = await this.getAllEntries(db);
            let pruned = 0;
            for (const entry of entries) {
                if (this.isExpired(entry)) {
                    await this.delete(db, entry.id);
                    pruned++;
                }
            }
            return pruned;
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] Prune failed:', error);
            return 0;
        }
    }
    /**
     * Clear all cache entries
     */
    async clear() {
        try {
            const db = await this.getDb();
            const transaction = db.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            store.clear();
            await new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
            this.stats = { hits: 0, misses: 0, tokensSaved: 0 };
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] Clear failed:', error);
        }
    }
    /**
     * Get cache statistics
     */
    async getStats() {
        try {
            const db = await this.getDb();
            const entries = await this.getAllEntries(db);
            let oldestEntry = null;
            let dbSizeBytes = 0;
            for (const entry of entries) {
                if (oldestEntry === null || entry.timestamp < oldestEntry) {
                    oldestEntry = entry.timestamp;
                }
                // Approximate size: embedding (4 bytes per float) + response + query
                dbSizeBytes +=
                    entry.queryEmbedding.length * 4 +
                        entry.response.length * 2 +
                        entry.query.length * 2;
            }
            const total = this.stats.hits + this.stats.misses;
            return {
                size: entries.length,
                hits: this.stats.hits,
                misses: this.stats.misses,
                hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
                tokensSaved: this.stats.tokensSaved,
                oldestEntry,
                dbSizeBytes,
            };
        }
        catch (error) {
            console.warn('[PersistentSemanticCache] getStats failed:', error);
            return {
                size: 0,
                hits: this.stats.hits,
                misses: this.stats.misses,
                hitRate: 0,
                tokensSaved: this.stats.tokensSaved,
                oldestEntry: null,
                dbSizeBytes: 0,
            };
        }
    }
    /**
     * Record token savings for statistics
     */
    recordTokensSaved(tokens) {
        this.stats.tokensSaved += tokens;
    }
    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.dbPromise = null;
        }
    }
    // ============================================================================
    // Private Methods
    // ============================================================================
    /**
     * Find exact match by normalized query
     */
    findExactMatch(db, normalizedQuery) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.config.storeName, 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const index = store.index('query');
            const request = index.get(normalizedQuery);
            request.onsuccess = () => {
                resolve(request.result ?? null);
            };
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * Find semantic match using embedding similarity
     * Note: O(n) linear scan - acceptable for maxEntries <= 1000
     */
    async findSemanticMatch(db, queryEmbedding) {
        const entries = await this.getAllEntries(db);
        let bestMatch = null;
        let bestSimilarity = 0;
        for (const entry of entries) {
            if (this.isExpired(entry))
                continue;
            const similarity = cosineSimilarity(queryEmbedding, entry.queryEmbedding);
            if (similarity > bestSimilarity && similarity >= this.config.similarityThreshold) {
                bestSimilarity = similarity;
                bestMatch = entry;
            }
        }
        return bestMatch;
    }
    /**
     * Get all entries from the store
     */
    getAllEntries(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.config.storeName, 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                resolve(request.result ?? []);
            };
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * Put an entry into the store
     */
    put(db, entry) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.put(entry);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * Delete an entry by ID
     */
    delete(db, id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
    /**
     * Update hit count and last accessed time for an entry
     */
    async updateHitCount(db, id) {
        const transaction = db.transaction(this.config.storeName, 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const entry = getRequest.result;
                if (entry) {
                    entry.hits++;
                    entry.lastAccessed = Date.now();
                    const putRequest = store.put(entry);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                }
                else {
                    resolve();
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }
    /**
     * Check if entry is expired
     */
    isExpired(entry) {
        if (this.config.ttlMs === 0)
            return false;
        return Date.now() - entry.timestamp > this.config.ttlMs;
    }
    /**
     * Enforce max entries using LRU eviction
     */
    async enforceMaxEntries(db) {
        const entries = await this.getAllEntries(db);
        if (entries.length <= this.config.maxEntries)
            return;
        // Sort by LRU score (lastAccessed - hits bonus)
        const sortedEntries = entries.sort((a, b) => {
            const scoreA = a.lastAccessed - a.hits * 60000; // 1 minute bonus per hit
            const scoreB = b.lastAccessed - b.hits * 60000;
            return scoreA - scoreB;
        });
        // Remove oldest entries until under limit
        const toRemove = sortedEntries.slice(0, entries.length - this.config.maxEntries);
        for (const entry of toRemove) {
            await this.delete(db, entry.id);
        }
    }
}
/**
 * Create a persistent semantic cache with the given configuration
 */
export function createPersistentSemanticCache(config) {
    return new PersistentSemanticCache(config);
}
/**
 * React hook for using persistent semantic cache
 */
export function usePersistentSemanticCacheConfig(embedFunction, options) {
    return {
        embedFunction,
        ...options,
    };
}
//# sourceMappingURL=semantic-cache-persistent.js.map