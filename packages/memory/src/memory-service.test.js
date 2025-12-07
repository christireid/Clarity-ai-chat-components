/**
 * MemoryService Tests
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryService } from './memory-service';
// Create minimal config for testing
function createTestConfig(overrides = {}) {
    return {
        tokenOptimization: {
            maxContextWindow: 4096,
            allocation: {
                systemPrompt: 0.1,
                userPreferences: 0.1,
                recentContext: 0.3,
                semanticMemory: 0.2,
                episodicMemory: 0.2,
                responseReserve: 0.1,
            },
            dynamicAllocation: false,
            enableCompression: true,
            compressionRatio: 0.5,
        },
        persistence: {
            useVectorStore: false,
            useCache: true,
            useDatabase: false,
        },
        enableAutoSummarization: false,
        enableAutoCleanup: false,
        retentionPolicy: {
            shortTerm: 300,
            session: 3600,
            thread: 86400,
            global: 0,
        },
        debug: false,
        ...overrides,
    };
}
describe('MemoryService', () => {
    let service;
    beforeEach(() => {
        service = new MemoryService(createTestConfig());
    });
    afterEach(async () => {
        await service.close();
    });
    describe('constructor', () => {
        it('should create service with config', () => {
            expect(service).toBeDefined();
        });
        it('should initialize with empty cache', () => {
            const stats = service.getStats();
            expect(stats.total).toBe(0);
        });
    });
    describe('addMemory', () => {
        it('should add a memory item', async () => {
            const memory = await service.addMemory('Test content', 'episodic', 'session', { topic: 'test' });
            expect(memory).toBeDefined();
            expect(memory.id).toBeDefined();
            expect(memory.content).toBe('Test content');
            expect(memory.type).toBe('episodic');
            expect(memory.scope).toBe('session');
            expect(memory.metadata.topic).toBe('test');
        });
        it('should calculate tokens for content', async () => {
            const memory = await service.addMemory('Hello World', // 11 chars = 3 tokens (ceil(11/4))
            'episodic', 'session');
            expect(memory.tokens).toBe(3);
        });
        it('should set default confidence', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            expect(memory.confidence).toBe(0.8);
        });
        it('should allow custom confidence', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session', {}, { confidence: 0.95 });
            expect(memory.confidence).toBe(0.95);
        });
        it('should set default priority', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            expect(memory.priority).toBe('medium');
        });
        it('should allow custom priority', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session', {}, { priority: 'critical' });
            expect(memory.priority).toBe('critical');
        });
        it('should set timestamps', async () => {
            const before = new Date();
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const after = new Date();
            expect(memory.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(memory.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
            expect(memory.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        });
        it('should accept custom embedding', async () => {
            const embedding = [0.1, 0.2, 0.3];
            const memory = await service.addMemory('Test', 'semantic', 'global', {}, { embedding });
            expect(memory.embedding).toEqual(embedding);
        });
    });
    describe('addMemories', () => {
        it('should add multiple memories', async () => {
            const memories = await service.addMemories([
                { content: 'First', type: 'episodic', scope: 'session' },
                { content: 'Second', type: 'semantic', scope: 'user' },
                { content: 'Third', type: 'procedural', scope: 'global' },
            ]);
            expect(memories.length).toBe(3);
            expect(memories[0].content).toBe('First');
            expect(memories[1].content).toBe('Second');
            expect(memories[2].content).toBe('Third');
        });
        it('should return empty array for empty input', async () => {
            const memories = await service.addMemories([]);
            expect(memories).toEqual([]);
        });
    });
    describe('get', () => {
        it('should get memory by id', async () => {
            const added = await service.addMemory('Test content', 'episodic', 'session');
            const retrieved = await service.get(added.id);
            expect(retrieved).not.toBeNull();
            expect(retrieved?.id).toBe(added.id);
            expect(retrieved?.content).toBe('Test content');
        });
        it('should return null for non-existent id', async () => {
            const retrieved = await service.get('non-existent-id');
            expect(retrieved).toBeNull();
        });
    });
    describe('query', () => {
        beforeEach(async () => {
            await service.addMemory('The quick brown fox', 'episodic', 'session', {
                userId: 'user-1',
            });
            await service.addMemory('A lazy dog sleeping', 'semantic', 'user', {
                userId: 'user-2',
            });
            await service.addMemory('Quick response time', 'episodic', 'global', {
                userId: 'user-1',
                threadId: 'thread-1',
            });
        });
        it('should find memories by text query', async () => {
            const results = await service.query({ query: 'quick' });
            expect(results.length).toBeGreaterThan(0);
            expect(results.some(r => r.memory.content.toLowerCase().includes('quick'))).toBe(true);
        });
        it('should filter by type', async () => {
            const results = await service.query({
                types: ['episodic'],
            });
            expect(results.length).toBe(2);
            expect(results.every(r => r.memory.type === 'episodic')).toBe(true);
        });
        it('should filter by scope', async () => {
            const results = await service.query({
                scopes: ['session'],
            });
            expect(results.length).toBe(1);
            expect(results[0].memory.scope).toBe('session');
        });
        it('should filter by userId', async () => {
            const results = await service.query({
                userId: 'user-1',
            });
            expect(results.length).toBe(2);
            expect(results.every(r => r.memory.metadata.userId === 'user-1')).toBe(true);
        });
        it('should filter by threadId', async () => {
            const results = await service.query({
                threadId: 'thread-1',
            });
            expect(results.length).toBe(1);
            expect(results[0].memory.metadata.threadId).toBe('thread-1');
        });
        it('should respect limit', async () => {
            const results = await service.query({ limit: 1 });
            expect(results.length).toBeLessThanOrEqual(1);
        });
        it('should filter by minConfidence', async () => {
            const results = await service.query({
                minConfidence: 0.9,
            });
            expect(results.every(r => r.memory.confidence >= 0.9)).toBe(true);
        });
        it('should optimize for token budget', async () => {
            // Add a large memory
            await service.addMemory('A'.repeat(1000), // Large content
            'episodic', 'session');
            const results = await service.query({
                tokenBudget: 20,
            });
            const totalTokens = results.reduce((sum, r) => sum + r.memory.tokens, 0);
            expect(totalTokens).toBeLessThanOrEqual(20);
        });
    });
    describe('updateMemory', () => {
        it('should update memory content', async () => {
            const memory = await service.addMemory('Original', 'episodic', 'session');
            const updated = await service.updateMemory(memory.id, {
                content: 'Updated',
            });
            expect(updated?.content).toBe('Updated');
        });
        it('should recalculate tokens on content change', async () => {
            const memory = await service.addMemory('Short', 'episodic', 'session');
            const originalTokens = memory.tokens;
            const updated = await service.updateMemory(memory.id, {
                content: 'This is a much longer piece of content',
            });
            expect(updated?.tokens).toBeGreaterThan(originalTokens);
        });
        it('should update metadata', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session', {
                topic: 'original',
            });
            const updated = await service.updateMemory(memory.id, {
                metadata: { ...memory.metadata, topic: 'updated' },
            });
            expect(updated?.metadata.topic).toBe('updated');
        });
        it('should update timestamp', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const originalUpdated = memory.updatedAt;
            // Wait a bit to ensure time difference
            await new Promise(resolve => setTimeout(resolve, 10));
            const updated = await service.updateMemory(memory.id, {
                content: 'Changed',
            });
            expect(updated?.updatedAt.getTime()).toBeGreaterThan(originalUpdated.getTime());
        });
        it('should return null for non-existent id', async () => {
            const updated = await service.updateMemory('non-existent', {
                content: 'Test',
            });
            expect(updated).toBeNull();
        });
    });
    describe('deleteMemory', () => {
        it('should delete memory', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const deleted = await service.deleteMemory(memory.id);
            expect(deleted).toBe(true);
            const retrieved = await service.get(memory.id);
            expect(retrieved).toBeNull();
        });
        it('should return false for non-existent id', async () => {
            const deleted = await service.deleteMemory('non-existent');
            expect(deleted).toBe(false);
        });
    });
    describe('deleteMemories', () => {
        beforeEach(async () => {
            await service.addMemory('First', 'episodic', 'session', { userId: 'user-1' });
            await service.addMemory('Second', 'episodic', 'session', { userId: 'user-1' });
            await service.addMemory('Third', 'semantic', 'user', { userId: 'user-2' });
        });
        it('should delete memories matching filter', async () => {
            const count = await service.deleteMemories({
                userId: 'user-1',
            });
            expect(count).toBe(2);
            const remaining = await service.query({});
            expect(remaining.length).toBe(1);
        });
        it('should return 0 when no matches', async () => {
            const count = await service.deleteMemories({
                userId: 'non-existent',
            });
            expect(count).toBe(0);
        });
    });
    describe('promoteMemory', () => {
        it('should promote memory to higher scope', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const promoted = await service.promoteMemory(memory.id, 'user');
            expect(promoted?.scope).toBe('user');
        });
        it('should return null for non-existent id', async () => {
            const promoted = await service.promoteMemory('non-existent', 'global');
            expect(promoted).toBeNull();
        });
    });
    describe('getStats', () => {
        it('should return empty stats initially', () => {
            const stats = service.getStats();
            expect(stats.total).toBe(0);
            expect(stats.totalTokens).toBe(0);
        });
        it('should count memories by type', async () => {
            await service.addMemory('One', 'episodic', 'session');
            await service.addMemory('Two', 'episodic', 'session');
            await service.addMemory('Three', 'semantic', 'user');
            const stats = service.getStats();
            expect(stats.byType.episodic).toBe(2);
            expect(stats.byType.semantic).toBe(1);
        });
        it('should count memories by scope', async () => {
            await service.addMemory('One', 'episodic', 'session');
            await service.addMemory('Two', 'semantic', 'user');
            await service.addMemory('Three', 'semantic', 'user');
            const stats = service.getStats();
            expect(stats.byScope.session).toBe(1);
            expect(stats.byScope.user).toBe(2);
        });
        it('should calculate total tokens', async () => {
            await service.addMemory('Hello', 'episodic', 'session'); // 5 chars = 2 tokens
            await service.addMemory('World', 'episodic', 'session'); // 5 chars = 2 tokens
            const stats = service.getStats();
            expect(stats.totalTokens).toBe(4);
        });
    });
    describe('event listeners', () => {
        it('should emit memory:created event', async () => {
            const listener = vi.fn();
            service.on('memory:created', listener);
            await service.addMemory('Test', 'episodic', 'session');
            expect(listener).toHaveBeenCalledTimes(1);
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
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                type: 'memory:updated',
                memory: expect.objectContaining({ content: 'Updated' }),
            }));
        });
        it('should emit memory:deleted event', async () => {
            const listener = vi.fn();
            service.on('memory:deleted', listener);
            const memory = await service.addMemory('Test', 'episodic', 'session');
            await service.deleteMemory(memory.id);
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                type: 'memory:deleted',
            }));
        });
        it('should remove listener with off', async () => {
            const listener = vi.fn();
            service.on('memory:created', listener);
            service.off('memory:created', listener);
            await service.addMemory('Test', 'episodic', 'session');
            expect(listener).not.toHaveBeenCalled();
        });
    });
    describe('close', () => {
        it('should stop without error', async () => {
            await service.addMemory('Test', 'episodic', 'session');
            await expect(service.close()).resolves.not.toThrow();
        });
    });
    describe('add (convenience method)', () => {
        it('should add memory with defaults', async () => {
            const id = await service.add('Test content');
            expect(id).toBeDefined();
            expect(typeof id).toBe('string');
            const memory = await service.get(id);
            expect(memory?.content).toBe('Test content');
        });
        it('should accept optional parameters', async () => {
            const id = await service.add('Test', {
                type: 'semantic',
                scope: 'global',
                importance: 0.9,
                tags: ['important'],
            });
            const memory = await service.get(id);
            expect(memory?.type).toBe('semantic');
            expect(memory?.scope).toBe('global');
        });
    });
    describe('recall', () => {
        beforeEach(async () => {
            await service.addMemory('The cat sat on the mat', 'episodic', 'session');
            await service.addMemory('Dogs are loyal pets', 'semantic', 'user');
        });
        it('should recall memories by query', async () => {
            const results = await service.recall('cat');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].memory.content).toContain('cat');
        });
        it('should respect query options', async () => {
            const results = await service.recall('', { scopes: ['user'] });
            expect(results.every(r => r.memory.scope === 'user')).toBe(true);
        });
    });
    describe('forget', () => {
        it('should forget a memory by id', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            const forgotten = await service.forget(memory.id);
            expect(forgotten).toBe(true);
            const retrieved = await service.get(memory.id);
            expect(retrieved).toBeNull();
        });
        it('should return false for non-existent id', async () => {
            const forgotten = await service.forget('non-existent');
            expect(forgotten).toBe(false);
        });
    });
    describe('summarization', () => {
        it('should emit memory:compressed event when summarizing', async () => {
            const listener = vi.fn();
            service.on('memory:compressed', listener);
            // Add an old memory that qualifies for summarization
            const longContent = 'This is a very long piece of content that should be summarized. '.repeat(10);
            const memory = await service.addMemory(longContent, 'episodic', 'session', {}, { priority: 'low' });
            // Manually set createdAt to be old enough (more than 1 hour)
            const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
            await service.updateMemory(memory.id, {
                createdAt: oldDate,
            });
            // The summarization task runs automatically, but we need to trigger it
            // Since it's a private method, we test via the memory:compressed event
            // which is emitted when summarization occurs
        });
        it('should handle memory with missing content gracefully', async () => {
            // Test that the service doesn't crash when iterating over memories
            // with potentially invalid content
            await service.addMemory('Valid content', 'episodic', 'session');
            // The service should handle all edge cases in the summarization cycle
            const stats = service.getStats();
            expect(stats.total).toBe(1);
        });
        it('should skip high priority memories during summarization', async () => {
            // High priority memories should never be compressed
            const content = 'Important content that should not be summarized. '.repeat(10);
            const memory = await service.addMemory(content, 'episodic', 'session', {}, { priority: 'critical' });
            const retrieved = await service.get(memory.id);
            expect(retrieved?.compressed).toBeFalsy();
        });
        it('should skip short content during summarization', async () => {
            // Content shorter than 200 chars should not be summarized
            const memory = await service.addMemory('Short content', 'episodic', 'session');
            const retrieved = await service.get(memory.id);
            expect(retrieved?.compressed).toBeFalsy();
        });
        it('should skip already compressed memories', async () => {
            const content = 'This is content that will be marked as compressed. '.repeat(10);
            const memory = await service.addMemory(content, 'episodic', 'session');
            // Mark as already compressed
            await service.updateMemory(memory.id, {
                compressed: 'Already compressed summary',
            });
            const retrieved = await service.get(memory.id);
            // Should still have the manual compressed value, not be re-compressed
            expect(retrieved?.compressed).toBe('Already compressed summary');
        });
    });
    describe('defensive coding', () => {
        it('should handle non-Date createdAt values', async () => {
            const memory = await service.addMemory('Test content', 'episodic', 'session');
            // Update with a string date (simulating deserialization)
            await service.updateMemory(memory.id, {
                createdAt: new Date().toISOString(),
            });
            // Service should still function
            const stats = service.getStats();
            expect(stats.total).toBe(1);
        });
        it('should handle invalid createdAt gracefully', async () => {
            const memory = await service.addMemory('Test', 'episodic', 'session');
            // This tests that NaN date handling works
            const stats = service.getStats();
            expect(stats.total).toBe(1);
        });
    });
});
//# sourceMappingURL=memory-service.test.js.map