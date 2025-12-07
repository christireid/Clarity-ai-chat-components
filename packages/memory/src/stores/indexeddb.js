/**
 * IndexedDB Vector Store
 * Browser-native storage for client-side applications
 */
export class IndexedDBStore {
    dbName;
    storeName = 'memories';
    db = null;
    initialized = false;
    constructor(dbName = 'clarity-memory') {
        this.dbName = dbName;
    }
    async initialize() {
        if (this.initialized)
            return;
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                reject(new Error('IndexedDB is not available in this environment'));
                return;
            }
            const request = indexedDB.open(this.dbName, 1);
            request.onerror = () => {
                reject(new Error(`Failed to open IndexedDB: ${request.error}`));
            };
            request.onsuccess = () => {
                this.db = request.result;
                this.initialized = true;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                    });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('importance', 'importance', { unique: false });
                }
            };
        });
    }
    async add(memory) {
        await this.ensureInitialized();
        return this.put(memory);
    }
    async get(id) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            request.onerror = () => {
                reject(new Error(`Failed to get memory: ${request.error}`));
            };
        });
    }
    async update(_id, memory) {
        await this.ensureInitialized();
        return this.put(memory);
    }
    async delete(id) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = () => {
                reject(new Error(`Failed to delete memory: ${request.error}`));
            };
        });
    }
    async search(query, options) {
        await this.ensureInitialized();
        const allMemories = await this.getAll({ types: options.types });
        const results = [];
        for (const memory of allMemories) {
            // Apply metadata filters
            if (options.filters) {
                let matches = true;
                for (const [key, value] of Object.entries(options.filters)) {
                    if (memory.metadata?.[key] !== value) {
                        matches = false;
                        break;
                    }
                }
                if (!matches)
                    continue;
            }
            // Apply tag filter
            if (options.tags && memory.tags) {
                const hasTag = options.tags.some((tag) => memory.tags?.includes(tag));
                if (!hasTag)
                    continue;
            }
            // Calculate similarity score
            let score = 0;
            // Text similarity
            if (query) {
                const queryLower = query.toLowerCase();
                const contentLower = memory.content.toLowerCase();
                if (contentLower.includes(queryLower)) {
                    score = 0.7;
                }
                else {
                    const queryWords = new Set(queryLower.split(/\s+/));
                    const contentWords = new Set(contentLower.split(/\s+/));
                    const overlap = [...queryWords].filter((w) => contentWords.has(w))
                        .length;
                    score = overlap / Math.max(queryWords.size, 1) * 0.5;
                }
            }
            // Vector similarity (if embeddings available)
            if (options.embedding && memory.embedding) {
                const vectorScore = this.cosineSimilarity(options.embedding, memory.embedding);
                score = Math.max(score, vectorScore);
            }
            // Boost by importance
            score = score * (0.7 + (memory.importance ?? 0.5) * 0.3);
            if (score >= (options.minScore || 0)) {
                results.push({ memory, score });
            }
        }
        // Sort by score
        results.sort((a, b) => b.score - a.score);
        // Apply limit
        return results.slice(0, options.limit || 10);
    }
    async getAll(options) {
        await this.ensureInitialized();
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                let memories = request.result;
                // Filter by type if specified
                if (options?.types) {
                    memories = memories.filter((m) => options.types.includes(m.type));
                }
                resolve(memories);
            };
            request.onerror = () => {
                reject(new Error(`Failed to get all memories: ${request.error}`));
            };
        });
    }
    async close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
        this.initialized = false;
    }
    // Private helpers
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }
    async put(memory) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(memory);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = () => {
                reject(new Error(`Failed to put memory: ${request.error}`));
            };
        });
    }
    cosineSimilarity(a, b) {
        if (a.length !== b.length)
            return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA === 0 || normB === 0)
            return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
//# sourceMappingURL=indexeddb.js.map