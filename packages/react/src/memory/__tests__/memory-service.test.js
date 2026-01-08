/**
 * Memory Service Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryService } from '../memory-service';
// Mock vector store
const mockVectorStore = {
    provider: 'mock',
    initialize: vi.fn().mockResolvedValue(undefined),
    upsert: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(undefined),
    deleteNamespace: vi.fn().mockResolvedValue(undefined),
    getStats: vi.fn().mockResolvedValue({ totalVectors: 0, dimension: 1536 }),
    fetch: vi.fn().mockResolvedValue([]),
    list: vi.fn().mockResolvedValue({ ids: [] }),
    close: vi.fn().mockResolvedValue(undefined),
};
// Mock embeddings
const mockEmbeddings = {
    name: 'mock',
    defaultModel: 'mock-model',
    models: [],
    embed: vi.fn().mockResolvedValue({ embeddings: [[0.1, 0.2, 0.3]], dimension: 3 }),
    embedText: vi.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    embedBatch: vi.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
    getDimension: vi.fn().mockReturnValue(3),
};
const defaultConfig = {
    tokenOptimization: {
        maxContextWindow: 4096,
        allocation: {
            systemPrompt: 0.10,
            userPreferences: 0.15,
            recentContext: 0.30,
            semanticMemory: 0.25,
            episodicMemory: 0.15,
            responseReserve: 0.05,
        },
        dynamicAllocation: false,
        enableCompression: false,
        enableChunking: false,
    },
    persistence: {
        useVectorStore: false,
        useCache: true,
        useDatabase: false,
    },
    enableAutoSummarization: false,
    enableAutoCleanup: false,
    retentionPolicy: {
        shortTerm: 3600,
        session: 86400,
        thread: 604800,
        global: 0,
    },
};
describe('MemoryService', () => {
    let service;
    beforeEach(() => {
        service = new MemoryService(defaultConfig);
    });
    describe('addMemory', () => {
        it('should add a memory item', async () => {
            const memory = await service.addMemory('Test content', 'episodic', 'session', { test: true });
            expect(memory).toBeDefined();
            expect(memory.content).toBe('Test content');
            expect(memory.type).toBe('episodic');
            expect(memory.scope).toBe('session');
            expect(memory.metadata.test).toBe(true);
            expect(memory.tokens).toBeGreaterThan(0);
        });
        it('should generate embeddings when provider is available', async () => {
            const serviceWithEmbeddings = new MemoryService(defaultConfig, undefined, mockEmbeddings);
            const memory = await serviceWithEmbeddings.addMemory('Test content', 'semantic', 'global');
            expect(mockEmbeddings.embedText).toHaveBeenCalledWith('Test content');
            expect(memory.embedding).toEqual([0.1, 0.2, 0.3]);
        });
        it('should set default confidence and priority', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            expect(memory.confidence).toBe(0.8);
            expect(memory.priority).toBe('medium');
        });
        it('should accept custom priority and confidence', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session', {}, { priority: 'high', confidence: 0.95 });
            expect(memory.priority).toBe('high');
            expect(memory.confidence).toBe(0.95);
        });
    });
    describe('query', () => {
        beforeEach(async () => {
            await service.addMemory('First memory', 'episodic', 'session', { tag: 'test1' });
            await service.addMemory('Second memory', 'semantic', 'global', { tag: 'test2' });
            await service.addMemory('Third memory', 'episodic', 'thread', { tag: 'test3' });
        });
        it('should find memories by text search', async () => {
            const results = await service.query({
                query: 'First',
            });
            expect(results).toHaveLength(1);
            expect(results[0].memory.content).toBe('First memory');
        });
        it('should filter by type', async () => {
            const results = await service.query({
                types: ['semantic'],
            });
            expect(results).toHaveLength(1);
            expect(results[0].memory.type).toBe('semantic');
        });
        it('should filter by scope', async () => {
            const results = await service.query({
                scopes: ['session'],
            });
            expect(results).toHaveLength(1);
            expect(results[0].memory.scope).toBe('session');
        });
        it('should limit results', async () => {
            const results = await service.query({
                limit: 2,
            });
            expect(results.length).toBeLessThanOrEqual(2);
        });
        it('should apply token budget', async () => {
            const results = await service.query({
                tokenBudget: 10,
            });
            const totalTokens = results.reduce((sum, r) => sum + r.memory.tokens, 0);
            expect(totalTokens).toBeLessThanOrEqual(10);
        });
    });
    describe('updateMemory', () => {
        it('should update memory content', async () => {
            const memory = await service.addMemory('Original', 'episodic', 'session');
            const updated = await service.updateMemory(memory.id, {
                content: 'Updated',
            });
            expect(updated).toBeDefined();
            expect(updated.content).toBe('Updated');
            expect(updated.tokens).not.toBe(memory.tokens);
        });
        it('should return null for non-existent memory', async () => {
            const updated = await service.updateMemory('non-existent', { content: 'Test' });
            expect(updated).toBeNull();
        });
    });
    describe('deleteMemory', () => {
        it('should delete a memory', async () => {
            const memory = await service.addMemory('To delete', 'episodic', 'session');
            const deleted = await service.deleteMemory(memory.id);
            expect(deleted).toBe(true);
            const results = await service.query({ query: 'To delete' });
            expect(results).toHaveLength(0);
        });
        it('should return false for non-existent memory', async () => {
            const deleted = await service.deleteMemory('non-existent');
            expect(deleted).toBe(false);
        });
    });
    describe('promoteMemory', () => {
        it('should promote memory to higher scope', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const promoted = await service.promoteMemory(memory.id, 'global');
            expect(promoted).toBeDefined();
            expect(promoted.scope).toBe('global');
            expect(promoted.priority).not.toBe(memory.priority);
        });
    });
    describe('compressMemory', () => {
        it('should compress memory content', async () => {
            const longContent = 'This is a very long memory content that should be compressed. '.repeat(10);
            const memory = await service.addMemory(longContent, 'episodic', 'session');
            const compressed = await service.compressMemory(memory.id, 0.5);
            expect(compressed).toBeDefined();
            expect(compressed.tokens).toBeLessThan(memory.tokens);
            expect(compressed.compressed).toBeDefined();
            expect(compressed.original).toBe(longContent);
        });
    });
    describe('getStats', () => {
        beforeEach(async () => {
            await service.addMemory('Memory 1', 'episodic', 'session');
            await service.addMemory('Memory 2', 'semantic', 'global');
            await service.addMemory('Memory 3', 'episodic', 'thread');
        });
        it('should return memory statistics', () => {
            const stats = service.getStats();
            expect(stats.total).toBe(3);
            expect(stats.byType.episodic).toBe(2);
            expect(stats.byType.semantic).toBe(1);
            expect(stats.byScope.session).toBe(1);
            expect(stats.byScope.global).toBe(1);
            expect(stats.byScope.thread).toBe(1);
            expect(stats.totalTokens).toBeGreaterThan(0);
        });
    });
    describe('cleanup', () => {
        it('should remove expired memories', async () => {
            const expiredDate = new Date(Date.now() - 1000);
            const memory = await service.addMemory('Expired', 'episodic', 'session');
            await service.updateMemory(memory.id, { expiresAt: expiredDate });
            const cleaned = await service.cleanup();
            expect(cleaned).toBe(1);
            const results = await service.query({ query: 'Expired' });
            expect(results).toHaveLength(0);
        });
        it('should respect retention policy', async () => {
            const oldDate = new Date(Date.now() - 100000000); // Very old
            const memory = await service.addMemory('Old', 'short-term', 'session');
            await service.updateMemory(memory.id, { createdAt: oldDate });
            const cleaned = await service.cleanup();
            expect(cleaned).toBeGreaterThan(0);
        });
    });
    describe('events', () => {
        it('should emit memory:created event', async () => {
            const listener = vi.fn();
            service.on('memory:created', listener);
            await service.addMemory('Test', 'episodic', 'session');
            expect(listener).toHaveBeenCalled();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                type: 'memory:created',
                memory: expect.objectContaining({ content: 'Test' }),
            }));
        });
        it('should emit memory:updated event', async () => {
            const listener = vi.fn();
            service.on('memory:updated', listener);
            const memory = await service.addMemory('Original', 'episodic', 'session');
            await service.updateMemory(memory.id, { content: 'Updated' });
            expect(listener).toHaveBeenCalled();
        });
        it('should emit memory:deleted event', async () => {
            const listener = vi.fn();
            service.on('memory:deleted', listener);
            const memory = await service.addMemory('To delete', 'episodic', 'session');
            await service.deleteMemory(memory.id);
            expect(listener).toHaveBeenCalled();
        });
        it('should unsubscribe from events', async () => {
            const listener = vi.fn();
            service.on('memory:created', listener);
            service.off('memory:created', listener);
            await service.addMemory('Test', 'episodic', 'session');
            expect(listener).not.toHaveBeenCalled();
        });
    });
    describe('buffer management', () => {
        it('should flush buffer when threshold reached', async () => {
            const listener = vi.fn();
            service.on('buffer:flushed', listener);
            // Add many memories to trigger flush
            for (let i = 0; i < 60; i++) {
                await service.addMemory(`Memory ${i}`, 'episodic', 'session');
            }
            expect(listener).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=memory-service.test.js.map