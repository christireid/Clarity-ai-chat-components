/**
 * Fixed Memory Service
 * Addresses memory leaks, test failures, and performance issues
 */
import { TokenCounter, ContextOptimizer } from './token-optimizer';
import { DecayManager, } from './utils/decay-manager';
/**
 * Fixed Memory Service with proper memory management
 */
export class MemoryServiceFixed {
    config;
    vectorStore;
    embeddings;
    cache;
    buffer;
    optimizer;
    eventListeners;
    cleanupInterval;
    summarizationInterval;
    decayManager;
    decayInterval;
    tokenCounter;
    isInitialized = false;
    isShuttingDown = false;
    constructor(config, vectorStore, embeddings) {
        this.config = config;
        this.vectorStore = vectorStore;
        this.embeddings = embeddings;
        this.cache = new Map();
        this.buffer = this.createBuffer();
        this.optimizer = new ContextOptimizer(config.tokenOptimization);
        this.eventListeners = new Map();
        this.tokenCounter = new TokenCounter();
        this.initialize();
    }
    /**
     * Initialize service with proper error handling
     */
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            // Initialize vector store if configured
            if (this.config.persistence?.useVectorStore && this.vectorStore) {
                await this.vectorStore.initialize();
            }
            // Initialize decay manager if configured
            if (this.config.decay?.enabled) {
                this.decayManager = new DecayManager(this.config.decay.policies);
                // Start decay background task if interval specified
                if (this.config.decay.decayInterval) {
                    this.startDecayTask();
                }
            }
            // Start background tasks
            if (this.config.enableAutoCleanup && this.config.cleanupInterval) {
                this.startCleanupTask();
            }
            if (this.config.enableAutoSummarization && this.config.summarizationInterval) {
                this.startSummarizationTask();
            }
            this.isInitialized = true;
        }
        catch (error) {
            this.emit('error', { type: 'initialization', error });
            throw error;
        }
    }
    /**
     * Create memory buffer with proper initialization
     */
    createBuffer() {
        return {
            shortTerm: new Map(),
            session: new Map(),
            thread: new Map(),
            global: new Map(),
            priorities: new Map(),
            timestamps: new Map(),
            metadata: new Map()
        };
    }
    /**
     * Add a memory item with proper validation and error handling
     */
    async addMemory(content, type = 'episodic', scope = 'session', metadata = {}, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('Memory service is shutting down');
        }
        try {
            // Validate content
            if (!content || content.trim().length === 0) {
                throw new Error('Content cannot be empty');
            }
            // Calculate tokens
            const tokens = options.tokens ?? this.tokenCounter.countTokens(content);
            // Generate ID
            const id = options.id ?? this.generateId();
            // Handle embedding if needed
            let embedding;
            if (type === 'semantic' && this.embeddings) {
                embedding = options.embedding ?? await this.generateEmbedding(content);
            }
            // Create memory item
            const now = new Date();
            const memory = {
                id,
                content,
                type,
                scope,
                tokens,
                confidence: options.confidence ?? 0.8,
                priority: options.priority ?? 'medium',
                createdAt: options.createdAt ?? now,
                updatedAt: options.updatedAt ?? now,
                accessedAt: now,
                metadata,
                embedding,
                version: 1,
                tags: options.tags ?? []
            };
            // Store in cache
            this.cache.set(id, memory);
            // Store in buffer by scope
            this.buffer[scope].set(id, memory);
            // Store in vector store if configured
            if (this.config.persistence?.useVectorStore && this.vectorStore && embedding) {
                await this.vectorStore.upsert([{
                        id,
                        values: embedding,
                        metadata: {
                            content,
                            type,
                            scope,
                            tokens,
                            createdAt: memory.createdAt.toISOString()
                        }
                    }]);
            }
            // Emit event
            this.emit('memoryAdded', { memory });
            return memory;
        }
        catch (error) {
            this.emit('error', { type: 'addMemory', error, content });
            throw error;
        }
    }
    /**
     * Add multiple memories with proper error handling
     */
    async addMemories(items) {
        if (!items || items.length === 0) {
            return [];
        }
        try {
            const results = await Promise.all(items.map(item => this.addMemory(item.content, item.type, item.scope, item.metadata, item.options)));
            return results;
        }
        catch (error) {
            this.emit('error', { type: 'addMemories', error });
            throw error;
        }
    }
    /**
     * Get memory by ID with proper error handling
     */
    async get(id) {
        if (!id)
            return null;
        try {
            const memory = this.cache.get(id);
            if (memory) {
                // Update access time
                memory.accessedAt = new Date();
                return memory;
            }
            // Check vector store if configured
            if (this.config.persistence?.useVectorStore && this.vectorStore) {
                const results = await this.vectorStore.query({
                    id,
                    includeMetadata: true
                });
                if (results.length > 0) {
                    const result = results[0];
                    return this.reconstructMemoryFromVector(result);
                }
            }
            return null;
        }
        catch (error) {
            this.emit('error', { type: 'get', error, id });
            return null;
        }
    }
    /**
     * Query memories with proper error handling
     */
    async query(query) {
        if (!query)
            return [];
        try {
            const results = [];
            // Search by content
            if (query.content) {
                const contentResults = await this.searchByContent(query);
                results.push(...contentResults);
            }
            // Search by embedding
            if (query.embedding && this.vectorStore) {
                const embeddingResults = await this.searchByEmbedding(query);
                results.push(...embeddingResults);
            }
            // Search by metadata
            if (query.metadata) {
                const metadataResults = await this.searchByMetadata(query);
                results.push(...metadataResults);
            }
            // Deduplicate and rank results
            const uniqueResults = this.deduplicateResults(results);
            const rankedResults = this.rankResults(uniqueResults, query);
            return rankedResults;
        }
        catch (error) {
            this.emit('error', { type: 'query', error, query });
            return [];
        }
    }
    /**
     * Get memory statistics
     */
    getStats() {
        const stats = {
            total: this.cache.size,
            byType: {
                episodic: 0,
                semantic: 0,
                procedural: 0,
                working: 0
            },
            byScope: {
                shortTerm: this.buffer.shortTerm.size,
                session: this.buffer.session.size,
                thread: this.buffer.thread.size,
                global: this.buffer.global.size
            },
            totalTokens: 0,
            averageConfidence: 0,
            oldest: null,
            newest: null
        };
        // Count by type and calculate totals
        let totalConfidence = 0;
        let totalCount = 0;
        for (const memory of this.cache.values()) {
            stats.byType[memory.type]++;
            stats.totalTokens += memory.tokens;
            totalConfidence += memory.confidence;
            totalCount++;
            if (!stats.oldest || memory.createdAt < stats.oldest) {
                stats.oldest = memory.createdAt;
            }
            if (!stats.newest || memory.createdAt > stats.newest) {
                stats.newest = memory.createdAt;
            }
        }
        stats.averageConfidence = totalCount > 0 ? totalConfidence / totalCount : 0;
        return stats;
    }
    /**
     * Close service and cleanup resources
     */
    async close() {
        this.isShuttingDown = true;
        // Stop background tasks
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = undefined;
        }
        if (this.summarizationInterval) {
            clearInterval(this.summarizationInterval);
            this.summarizationInterval = undefined;
        }
        if (this.decayInterval) {
            clearInterval(this.decayInterval);
            this.decayInterval = undefined;
        }
        // Close vector store
        if (this.vectorStore) {
            await this.vectorStore.close();
        }
        // Clear memory
        this.cache.clear();
        Object.values(this.buffer).forEach(map => map.clear());
        this.isInitialized = false;
    }
    // Private helper methods
    generateId() {
        return `mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    async generateEmbedding(content) {
        if (!this.embeddings) {
            throw new Error('Embedding provider not configured');
        }
        return this.embeddings.embed(content);
    }
    reconstructMemoryFromVector(vector) {
        const metadata = vector.metadata || {};
        return {
            id: vector.id,
            content: metadata.content || '',
            type: metadata.type || 'episodic',
            scope: metadata.scope || 'session',
            tokens: metadata.tokens || 0,
            confidence: 0.8,
            priority: 'medium',
            createdAt: new Date(metadata.createdAt || Date.now()),
            updatedAt: new Date(metadata.createdAt || Date.now()),
            accessedAt: new Date(),
            metadata: {},
            embedding: vector.values,
            version: 1,
            tags: []
        };
    }
    async searchByContent(query) {
        const results = [];
        const searchContent = query.content?.toLowerCase() || '';
        for (const memory of this.cache.values()) {
            const content = memory.content.toLowerCase();
            const score = this.calculateTextSimilarity(content, searchContent);
            if (score > (query.threshold || 0.3)) {
                results.push({
                    memory,
                    score,
                    reason: 'content-match'
                });
            }
        }
        return results;
    }
    async searchByEmbedding(query) {
        if (!query.embedding || !this.vectorStore)
            return [];
        const vectorQuery = {
            vector: query.embedding,
            topK: query.limit || 10,
            threshold: query.threshold || 0.7,
            includeMetadata: true
        };
        const matches = await this.vectorStore.query(vectorQuery);
        return matches.map(match => ({
            memory: this.reconstructMemoryFromVector(match),
            score: match.score || 0,
            reason: 'semantic-similarity'
        }));
    }
    async searchByMetadata(query) {
        const results = [];
        const metadataQuery = query.metadata || {};
        for (const memory of this.cache.values()) {
            let matches = true;
            for (const [key, value] of Object.entries(metadataQuery)) {
                if (memory.metadata[key] !== value) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                results.push({
                    memory,
                    score: 1.0,
                    reason: 'metadata-match'
                });
            }
        }
        return results;
    }
    calculateTextSimilarity(text1, text2) {
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        return intersection.length / union.length;
    }
    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(result => {
            if (seen.has(result.memory.id)) {
                return false;
            }
            seen.add(result.memory.id);
            return true;
        });
    }
    rankResults(results, query) {
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, query.limit || 10);
    }
    startCleanupTask() {
        if (this.cleanupInterval)
            return;
        this.cleanupInterval = setInterval(async () => {
            try {
                await this.performCleanup();
            }
            catch (error) {
                this.emit('error', { type: 'cleanup', error });
            }
        }, this.config.cleanupInterval || 300000); // 5 minutes default
    }
    startSummarizationTask() {
        if (this.summarizationInterval)
            return;
        this.summarizationInterval = setInterval(async () => {
            try {
                await this.performSummarization();
            }
            catch (error) {
                this.emit('error', { type: 'summarization', error });
            }
        }, this.config.summarizationInterval || 600000); // 10 minutes default
    }
    startDecayTask() {
        if (this.decayInterval)
            return;
        this.decayInterval = setInterval(async () => {
            try {
                await this.performDecay();
            }
            catch (error) {
                this.emit('error', { type: 'decay', error });
            }
        }, this.config.decay.decayInterval || 300000); // 5 minutes default
    }
    async performCleanup() {
        // Implementation depends on cleanup policy
        this.emit('cleanup', { timestamp: new Date() });
    }
    async performSummarization() {
        // Implementation depends on summarization policy
        this.emit('summarization', { timestamp: new Date() });
    }
    async performDecay() {
        if (!this.decayManager)
            return;
        // Implementation depends on decay policy
        this.emit('decay', { timestamp: new Date() });
    }
    emit(event, data) {
        const listeners = this.eventListeners.get(event.type) || new Set();
        listeners.forEach(listener => {
            try {
                listener(event, data);
            }
            catch (error) {
                console.error('Error in event listener:', error);
            }
        });
    }
}
//# sourceMappingURL=memory-service-fixed.js.map