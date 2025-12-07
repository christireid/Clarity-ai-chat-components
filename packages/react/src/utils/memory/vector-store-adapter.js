/**
 * Vector Store Adapter Interface
 *
 * Provides a unified interface for integrating with various vector databases
 * (Pinecone, Qdrant, Weaviate, etc.) for semantic memory storage and retrieval.
 */
/**
 * Base implementation with common functionality
 */
export class BaseVectorStoreAdapter {
    initialized = false;
    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(a, b) {
        if (a.length !== b.length) {
            throw new Error('Vectors must have the same length');
        }
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
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    /**
     * Normalize vector
     */
    normalizeVector(vector) {
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude === 0)
            return vector;
        return vector.map((val) => val / magnitude);
    }
    /**
     * Create metadata for vector storage
     */
    createMetadata(memory) {
        return {
            userId: memory.userId,
            timestamp: memory.lastUpdated.toISOString(),
            chunkIndex: 0,
            totalChunks: 1,
            memoryType: memory.type,
            topic: memory.metadata?.['topic'],
            sentiment: memory.metadata?.['sentiment'],
            importanceScore: memory.importanceScore ?? 0,
            scope: memory.scope,
            layer: memory.layer,
        };
    }
}
/**
 * In-memory vector store for development/testing
 */
export class InMemoryVectorStore extends BaseVectorStoreAdapter {
    memories = new Map();
    async initialize() {
        this.initialized = true;
    }
    async storeMemory(memory, embedding) {
        this.memories.set(memory.id, { memory, embedding });
    }
    async similaritySearch(queryEmbedding, options) {
        const { userId, k = 5, minScore = 0.7, filter } = options;
        const results = [];
        for (const { memory, embedding } of this.memories.values()) {
            // Apply filters
            if (memory.userId !== userId)
                continue;
            if (filter) {
                if (filter['scope'] && !filter['scope'].includes(memory.scope))
                    continue;
                if (filter['type'] && !filter['type'].includes(memory.type))
                    continue;
            }
            // Calculate similarity
            const score = this.cosineSimilarity(queryEmbedding, embedding);
            if (score >= minScore) {
                results.push({ memory, score });
            }
        }
        // Sort by score and limit
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, k).map((r) => ({
            ...r.memory,
            metadata: {
                ...r.memory.metadata,
                similarityScore: r.score,
            },
        }));
    }
    async deleteMemory(memoryId) {
        this.memories.delete(memoryId);
    }
    async updateMemory(memory, embedding) {
        const existing = this.memories.get(memory.id);
        if (existing) {
            this.memories.set(memory.id, {
                memory,
                embedding: embedding ?? existing.embedding,
            });
        }
    }
    async getMemory(memoryId) {
        const stored = this.memories.get(memoryId);
        return stored ? stored.memory : null;
    }
    async createEmbedding(text) {
        // Simple hash-based embedding for development
        // In production, use OpenAI, Cohere, or other embedding API
        const hash = this.simpleHash(text);
        const embedding = [];
        for (let i = 0; i < 384; i++) {
            // 384-dimensional embedding (sentence-transformers default)
            const val = Math.sin(hash + i) * 0.5 + 0.5;
            embedding.push(val);
        }
        return this.normalizeVector(embedding);
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
}
/**
 * Factory function to create vector store adapters
 */
export function createVectorStoreAdapter(type, config) {
    switch (type) {
        case 'in-memory':
            return new InMemoryVectorStore();
        // In production, add implementations for:
        // case 'pinecone':
        //   return new PineconeVectorStore(config)
        // case 'qdrant':
        //   return new QdrantVectorStore(config)
        // case 'weaviate':
        //   return new WeaviateVectorStore(config)
        default:
            throw new Error(`Unsupported vector store type: ${type}`);
    }
}
//# sourceMappingURL=vector-store-adapter.js.map