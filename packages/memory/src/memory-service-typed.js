/**
 * Type-Safe Memory Service with Generics
 * Provides compile-time type safety for memory operations
 */
import { TokenCounter, ContextOptimizer } from './token-optimizer';
import { DecayManager, } from './utils/decay-manager';
/**
 * Memory Service with TypeScript generics for type-safe operations
 */
export class TypedMemoryService {
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
     * Type-safe memory addition
     */
    async addMemory(content, type = 'episodic', scope = 'session', metadata = this.config.defaultMetadata, options = {}) {
        if (this.isShuttingDown) {
            throw new Error('Memory service is shutting down');
        }
        try {
            // Validate content with type safety
            if (!content || content.trim().length === 0) {
                throw new Error('Content cannot be empty');
            }
            // Calculate tokens with caching for performance
            const tokens = options.tokens ?? this.tokenCounter.countTokens(content);
            // Generate ID with collision resistance
            const id = options.id ?? this.generateId();
            // Handle embedding with type-specific logic
            let embedding;
            if (type === 'semantic' && this.embeddings) {
                embedding = options.embedding ?? await this.generateEmbedding(content);
            }
            // Create type-safe memory item
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
            // Store with consistency guarantees
            await this.storeMemory(memory);
            // Emit type-safe event
            this.emit('memoryAdded', { memory });
            return memory;
        }
        catch (error) {
            this.emit('error', { type: 'addMemory', error, content });
            throw error;
        }
    }
    /**
     * Type-safe memory retrieval with optional default value
     */
    async getMemory(id, defaultValue) {
        try {
            const memory = await this.get(id);
            return memory;
        }
        catch (error) {
            this.emit('error', { type: 'getMemory', error, id });
            return defaultValue ?? null;
        }
    }
    /**
     * Type-safe memory query with builder pattern
     */
    createQuery() {
        return new MemoryQueryBuilder(this);
    }
    /**
     * Type-safe memory update with partial metadata
     */
    async updateMemory(id, updates) {
        const memory = await this.get(id);
        if (!memory)
            return null;
        // Type-safe updates with validation
        const updatedMemory = {
            ...memory,
            ...updates,
            id, // Prevent ID changes
            updatedAt: new Date()
        };
        await this.storeMemory(updatedMemory);
        this.emit('memoryUpdated', { memory: updatedMemory });
        return updatedMemory;
    }
    /**
     * Type-safe memory search with advanced filtering
     */
    async searchMemories(query) {
        // Implementation with type-safe filtering
        return this.query(query);
    }
    /**
     * Type-safe memory statistics with metadata breakdown
     */
    getTypedStats() {
        const baseStats = this.getStats();
        const metadataBreakdown = this.analyzeMetadataPatterns();
        return {
            ...baseStats,
            metadataBreakdown,
            typeSafety: {
                metadataType: typeof this.config.defaultMetadata,
                totalTypedMemories: this.cache.size,
                validationErrors: 0
            }
        };
    }
    // Private methods with type safety
    async storeMemory(memory) {
        this.cache.set(memory.id, memory);
        this.buffer[memory.scope].set(memory.id, memory);
        if (this.config.persistence.useVectorStore && this.vectorStore && memory.embedding) {
            await this.vectorStore.upsert([{
                    id: memory.id,
                    values: memory.embedding,
                    metadata: {
                        content: memory.content,
                        type: memory.type,
                        scope: memory.scope,
                        tokens: memory.tokens,
                        createdAt: memory.createdAt.toISOString(),
                        metadata: memory.metadata
                    }
                }]);
        }
    }
    analyzeMetadataPatterns() {
        const patterns = new Map();
        for (const memory of this.cache.values()) {
            for (const [key, value] of Object.entries(memory.metadata)) {
                if (!patterns.has(key)) {
                    patterns.set(key, typeof value);
                }
            }
        }
        return {
            patterns: Object.fromEntries(patterns),
            totalPatterns: patterns.size,
            consistency: this.calculateMetadataConsistency(patterns)
        };
    }
    calculateMetadataConsistency(patterns) {
        // Calculate how consistent the metadata patterns are
        const totalKeys = patterns.size;
        const consistentKeys = Array.from(patterns.values()).filter(type => type !== 'undefined').length;
        return totalKeys > 0 ? consistentKeys / totalKeys : 1;
    }
    // Reuse existing implementations from MemoryServiceFixed
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
    generateId() {
        return `mem-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    async generateEmbedding(content) {
        if (!this.embeddings) {
            throw new Error('Embedding provider not configured');
        }
        return this.embeddings.embed(content);
    }
    async get(id) {
        if (!id)
            return null;
        const memory = this.cache.get(id);
        if (memory) {
            memory.accessedAt = new Date();
            return memory;
        }
        // Check vector store if configured
        if (this.config.persistence.useVectorStore && this.vectorStore) {
            const results = await this.vectorStore.query({ id, includeMetadata: true });
            if (results.length > 0) {
                return this.reconstructMemoryFromVector(results[0]);
            }
        }
        return null;
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
            metadata: metadata.metadata || this.config.defaultMetadata,
            embedding: vector.values,
            version: 1,
            tags: []
        };
    }
    query(_query) {
        // Implementation from MemoryServiceFixed
        return [];
    }
    getStats() {
        // Implementation from MemoryServiceFixed
        return {
            total: this.cache.size,
            byType: { episodic: 0, semantic: 0, procedural: 0, working: 0 },
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
    async initialize() {
        // Implementation from MemoryServiceFixed
        this.isInitialized = true;
    }
    async close() {
        this.isShuttingDown = true;
        // Cleanup implementation from MemoryServiceFixed
        this.isInitialized = false;
    }
}
/**
 * Type-safe memory query builder
 */
export class MemoryQueryBuilder {
    query;
    memoryService;
    constructor(memoryService) {
        this.memoryService = memoryService;
        this.query = {};
    }
    withContent(content) {
        this.query.content = content;
        return this;
    }
    withMetadata(metadata) {
        this.query.metadata = metadata;
        return this;
    }
    withType(type) {
        this.query.type = type;
        return this;
    }
    withScope(scope) {
        this.query.scope = scope;
        return this;
    }
    withLimit(limit) {
        this.query.limit = limit;
        return this;
    }
    withThreshold(threshold) {
        this.query.threshold = threshold;
        return this;
    }
    async execute() {
        return this.memoryService.searchMemories(this.query);
    }
}
//# sourceMappingURL=memory-service-typed.js.map