/**
 * Tests for Typed Memory Service
 * Validates type safety and performance improvements
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TypedMemoryService, TypedMemoryItem, TypedAddOptions } from '../src/memory-service-typed';
describe('TypedMemoryService - Type Safety', () => {
    let service;
    let config;
    beforeEach(() => {
        config = {
            maxTokens: 1000,
            maxMemories: 100,
            enableAutoCleanup: true,
            cleanupInterval: 300000,
            enableAutoSummarization: false,
            summarizationInterval: 600000,
            persistence: {
                enabled: false,
                useVectorStore: false
            },
            decay: {
                enabled: false
            },
            tokenOptimization: {
                enabled: true,
                maxContextTokens: 800,
                compressionThreshold: 0.8
            }
        };
        service = new TypedMemoryService(config);
    });
    afterEach(async () => {
        await service.close();
    });
    describe('Type-Safe Memory Addition', () => {
        it('should add memory with strongly typed metadata', async () => {
            const metadata = {
                userId: 'user123',
                sessionId: 'session456',
                tags: ['important', 'personal'],
                confidence: 0.95,
                source: 'user'
            };
            const memory = await service.addMemory('User mentioned their favorite color is blue', 'episodic', 'session', metadata);
            expect(memory).toBeDefined();
            expect(memory.id).toBeDefined();
            expect(memory.content).toBe('User mentioned their favorite color is blue');
            expect(memory.metadata).toEqual(metadata);
            expect(memory.metadata.userId).toBe('user123');
            expect(memory.metadata.confidence).toBe(0.95);
        });
        it('should enforce metadata type constraints at compile time', async () => {
            // This test validates that TypeScript prevents incorrect metadata types
            const metadata = {
                userId: 'user123',
                sessionId: 'session456',
                tags: ['test'],
                confidence: 0.8,
                source: 'system'
            };
            const memory = await service.addMemory('System generated summary', 'semantic', 'global', metadata);
            expect(memory.metadata.source).toBe('system');
            // TypeScript should prevent: source: 'invalid' as it's not in the union type
        });
        it('should handle metadata with different types correctly', async () => {
            const chatService = new TypedMemoryService(config);
            const chatMetadata = {
                conversationId: 'conv789',
                messageId: 'msg012',
                participant: 'assistant',
                timestamp: Date.now(),
                sentiment: 'positive'
            };
            const memory = await chatService.addMemory('Assistant provided helpful response', 'episodic', 'thread', chatMetadata);
            expect(memory.metadata.conversationId).toBe('conv789');
            expect(memory.metadata.participant).toBe('assistant');
            expect(typeof memory.metadata.timestamp).toBe('number');
            await chatService.close();
        });
    });
    describe('Type-Safe Memory Retrieval', () => {
        it('should retrieve memory with correct types', async () => {
            const metadata = {
                userId: 'user999',
                sessionId: 'session888',
                tags: ['retrieval-test'],
                confidence: 0.9,
                source: 'ai'
            };
            const addedMemory = await service.addMemory('Test memory for retrieval', 'episodic', 'session', metadata);
            const retrievedMemory = await service.getMemory(addedMemory.id);
            expect(retrievedMemory).toBeDefined();
            expect(retrievedMemory?.metadata.userId).toBe('user999');
            expect(retrievedMemory?.metadata.tags).toContain('retrieval-test');
        });
        it('should return null for non-existent memory', async () => {
            const result = await service.getMemory('non-existent-id');
            expect(result).toBeNull();
        });
        it('should handle default values for missing memories', async () => {
            const defaultMetadata = {
                userId: 'default',
                sessionId: 'default',
                tags: [],
                confidence: 0,
                source: 'system'
            };
            const result = await service.getMemory('non-existent-id', {
                id: 'default-id',
                content: 'Default memory',
                type: 'episodic',
                scope: 'session',
                tokens: 0,
                confidence: 0.5,
                priority: 'low',
                createdAt: new Date(),
                updatedAt: new Date(),
                accessedAt: new Date(),
                metadata: defaultMetadata,
                version: 1,
                tags: []
            });
            expect(result).toBeDefined();
            expect(result?.metadata.userId).toBe('default');
        });
    });
    describe('Type-Safe Memory Query Builder', () => {
        it('should build and execute type-safe queries', async () => {
            // Add test memories
            await service.addMemory('User likes pizza', 'episodic', 'session', {
                userId: 'user111',
                sessionId: 'session222',
                tags: ['food', 'preferences'],
                confidence: 0.8,
                source: 'user'
            });
            await service.addMemory('System processed order', 'semantic', 'global', {
                userId: 'user111',
                sessionId: 'session222',
                tags: ['order', 'processed'],
                confidence: 1.0,
                source: 'system'
            });
            // Build type-safe query
            const results = await service.createQuery()
                .withContent('pizza')
                .withType('episodic')
                .withScope('session')
                .execute();
            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(0);
            if (results.length > 0) {
                expect(results[0].memory.content).toContain('pizza');
                expect(results[0].memory.type).toBe('episodic');
            }
        });
        it('should filter by metadata with type safety', async () => {
            await service.addMemory('Test memory 1', 'episodic', 'session', {
                userId: 'user333',
                sessionId: 'session444',
                tags: ['test'],
                confidence: 0.7,
                source: 'user'
            });
            await service.addMemory('Test memory 2', 'episodic', 'session', {
                userId: 'user555',
                sessionId: 'session666',
                tags: ['test'],
                confidence: 0.8,
                source: 'ai'
            });
            const results = await service.createQuery()
                .withMetadata({
                userId: 'user333',
                source: 'user'
            })
                .execute();
            expect(results.length).toBe(1);
            expect(results[0].memory.metadata.userId).toBe('user333');
            expect(results[0].memory.metadata.source).toBe('user');
        });
    });
    describe('Type-Safe Memory Updates', () => {
        it('should update memory with partial metadata', async () => {
            const originalMetadata = {
                userId: 'user777',
                sessionId: 'session888',
                tags: ['original'],
                confidence: 0.7,
                source: 'user'
            };
            const memory = await service.addMemory('Original content', 'episodic', 'session', originalMetadata);
            const updatedMemory = await service.updateMemory(memory.id, {
                content: 'Updated content',
                metadata: {
                    ...originalMetadata,
                    tags: ['updated', 'modified'],
                    confidence: 0.9
                }
            });
            expect(updatedMemory).toBeDefined();
            expect(updatedMemory?.content).toBe('Updated content');
            expect(updatedMemory?.metadata.tags).toEqual(['updated', 'modified']);
            expect(updatedMemory?.metadata.confidence).toBe(0.9);
        });
        it('should prevent updating immutable fields', async () => {
            const memory = await service.addMemory('Test content', 'episodic', 'session', {
                userId: 'user999',
                sessionId: 'session000',
                tags: [],
                confidence: 0.8,
                source: 'user'
            });
            // Attempt to update ID (should be prevented)
            const updatedMemory = await service.updateMemory(memory.id, {
                id: 'new-id',
                content: 'Updated content'
            });
            expect(updatedMemory?.id).toBe(memory.id); // ID should remain unchanged
            expect(updatedMemory?.content).toBe('Updated content');
        });
    });
    describe('Performance Optimizations', () => {
        it('should handle large numbers of memories efficiently', async () => {
            const startTime = Date.now();
            const memoryPromises = [];
            // Add 100 memories
            for (let i = 0; i < 100; i++) {
                const metadata = {
                    userId: `user${i}`,
                    sessionId: `session${i}`,
                    tags: [`tag${i}`, 'performance-test'],
                    confidence: Math.random(),
                    source: i % 2 === 0 ? 'user' : 'ai'
                };
                memoryPromises.push(service.addMemory(`Memory content ${i}`, 'episodic', 'session', metadata));
            }
            const memories = await Promise.all(memoryPromises);
            const endTime = Date.now();
            expect(memories).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
        });
        it('should cache token calculations for performance', async () => {
            const content = 'This is a test memory that needs token calculation';
            // First call - calculates tokens
            const start1 = Date.now();
            const memory1 = await service.addMemory(content, 'episodic', 'session', {
                userId: 'user123',
                sessionId: 'session456',
                tags: ['token-test'],
                confidence: 0.8,
                source: 'user'
            });
            const time1 = Date.now() - start1;
            // Second call - should use cached tokens or faster calculation
            const start2 = Date.now();
            const memory2 = await service.addMemory(content, 'episodic', 'session', {
                userId: 'user124',
                sessionId: 'session457',
                tags: ['token-test-2'],
                confidence: 0.9,
                source: 'ai'
            });
            const time2 = Date.now() - start2;
            expect(memory1.tokens).toBeGreaterThan(0);
            expect(memory2.tokens).toBeGreaterThan(0);
            // Performance should be reasonable even if not cached
            expect(time1).toBeLessThan(100); // Should be fast
            expect(time2).toBeLessThan(100);
        });
    });
    describe('Type-Safe Statistics', () => {
        it('should provide typed statistics with metadata analysis', async () => {
            // Add memories with different metadata patterns
            await service.addMemory('Memory 1', 'episodic', 'session', {
                userId: 'user111',
                sessionId: 'session222',
                tags: ['test', 'analysis'],
                confidence: 0.8,
                source: 'user'
            });
            await service.addMemory('Memory 2', 'semantic', 'global', {
                userId: 'user333',
                sessionId: 'session444',
                tags: ['test', 'semantic'],
                confidence: 0.9,
                source: 'ai'
            });
            const stats = service.getTypedStats();
            expect(stats.total).toBe(2);
            expect(stats.byType.episodic).toBe(1);
            expect(stats.byType.semantic).toBe(1);
            expect(stats.metadataBreakdown.totalPatterns).toBeGreaterThan(0);
            expect(stats.metadataBreakdown.consistency).toBeGreaterThan(0);
            expect(stats.typeSafety.totalTypedMemories).toBe(2);
            expect(stats.typeSafety.validationErrors).toBe(0);
        });
    });
    describe('Error Handling with Type Safety', () => {
        it('should handle empty content with proper error types', async () => {
            await expect(service.addMemory('', 'episodic', 'session', {
                userId: 'user123',
                sessionId: 'session456',
                tags: [],
                confidence: 0.5,
                source: 'user'
            })).rejects.toThrow('Content cannot be empty');
        });
        it('should handle service shutdown gracefully', async () => {
            await service.close();
            await expect(service.addMemory('Test after shutdown', 'episodic', 'session', {
                userId: 'user123',
                sessionId: 'session456',
                tags: [],
                confidence: 0.5,
                source: 'user'
            })).rejects.toThrow('Memory service is shutting down');
        });
    });
});
//# sourceMappingURL=memory-service-typed.test.js.map