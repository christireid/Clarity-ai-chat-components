/**
 * In-Memory Storage Adapter
 *
 * Fast, ephemeral storage for development and serverless
 */
import { countTokens } from '../utils/token-counter';
export class InMemoryStore {
    memories = new Map();
    async initialize() {
        this.memories = new Map();
    }
    async save(memory) {
        this.memories.set(memory.id, memory);
    }
    async load(id) {
        return this.memories.get(id) || null;
    }
    async update(id, memory) {
        if (!this.memories.has(id)) {
            throw new Error(`Memory not found: ${id}`);
        }
        this.memories.set(id, memory);
    }
    async delete(id) {
        this.memories.delete(id);
    }
    async search(query, options) {
        const results = [];
        const queryLower = query.toLowerCase();
        for (const memory of this.memories.values()) {
            // Filter by options
            if (options?.types && !options.types.includes(memory.type))
                continue;
            if (options?.scopes && !options.scopes.includes(memory.scope))
                continue;
            if (options?.userId && memory.metadata.userId !== options.userId)
                continue;
            if (options?.sessionId && memory.metadata.sessionId !== options.sessionId)
                continue;
            if (options?.tags && !options.tags.some(tag => memory.tags?.includes(tag)))
                continue;
            // Simple text matching (will be enhanced with vector search)
            const contentLower = memory.content.toLowerCase();
            let score = 0;
            if (contentLower.includes(queryLower)) {
                score = 0.7;
                // Boost score for exact matches
                if (contentLower === queryLower) {
                    score = 1.0;
                }
                else if (contentLower.startsWith(queryLower)) {
                    score = 0.9;
                }
            }
            // Boost by importance
            score = score * (0.5 + (memory.importance ?? 0.5) * 0.5);
            // Vector similarity if embeddings available
            if (options?.embedding && memory.embedding) {
                const similarity = this.cosineSimilarity(options.embedding, memory.embedding);
                score = Math.max(score, similarity * 0.8 + (memory.importance ?? 0.5) * 0.2);
            }
            if (score > 0 && (!options?.minScore || score >= options.minScore)) {
                results.push({ memory, score });
            }
        }
        // Sort by score
        results.sort((a, b) => b.score - a.score);
        // Apply limit
        return results.slice(0, options?.limit || 10);
    }
    async query(options) {
        const results = [];
        for (const memory of this.memories.values()) {
            if (options?.scope && memory.scope !== options.scope)
                continue;
            if (options?.type && memory.type !== options.type)
                continue;
            if (options?.userId && memory.metadata.userId !== options.userId)
                continue;
            if (options?.sessionId && memory.metadata.sessionId !== options.sessionId)
                continue;
            results.push(memory);
        }
        return results;
    }
    async clear(scope, type) {
        if (!scope && !type) {
            this.memories.clear();
            return;
        }
        const toDelete = [];
        for (const memory of this.memories.values()) {
            if (scope && memory.scope !== scope)
                continue;
            if (type && memory.type !== type)
                continue;
            toDelete.push(memory.id);
        }
        for (const id of toDelete) {
            this.memories.delete(id);
        }
    }
    async getStats() {
        const byType = {
            episodic: 0,
            semantic: 0,
            profile: 0,
            procedural: 0,
            'short-term': 0,
        };
        const byScope = {
            session: 0,
            thread: 0,
            user: 0,
            global: 0,
        };
        let tokenUsage = 0;
        let totalImportance = 0;
        let compressedCount = 0;
        for (const memory of this.memories.values()) {
            byType[memory.type]++;
            byScope[memory.scope]++;
            tokenUsage += this.countTokens(memory.content);
            totalImportance += (memory.importance ?? 0.5);
            if (memory.compressed)
                compressedCount++;
        }
        return {
            totalMemories: this.memories.size,
            byType,
            byScope,
            tokenUsage,
            compressionRatio: this.memories.size > 0 ? compressedCount / this.memories.size : 0,
            averageImportance: this.memories.size > 0 ? totalImportance / this.memories.size : 0,
        };
    }
    async close() {
        this.memories.clear();
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
    countTokens(text) {
        return countTokens(text);
    }
}
//# sourceMappingURL=in-memory-store.js.map