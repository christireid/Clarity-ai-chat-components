/**
 * Memory Service Tests - Fixed Version
 *
 * Fixed version with proper test environment setup
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryService } from '../memory-service';
import { setupTestEnvironment, cleanupTestEnvironment } from '../../test-utils/fix-test-environment';
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
        vectorStore: null,
        cacheSize: 1000,
        ttl: 3600000, // 1 hour
    },
    embeddings: mockEmbeddings,
    namespace: 'test',
};
describe('MemoryService', () => {
    let service;
    beforeEach(() => {
        setupTestEnvironment();
        service = new MemoryService(defaultConfig);
    });
    afterEach(() => {
        cleanupTestEnvironment();
    });
    describe('initialization', () => {
        it('should initialize with default config', () => {
            expect(service).toBeDefined();
            expect(service.getConfig()).toEqual(defaultConfig);
        });
        it('should handle initialization errors gracefully', async () => {
            const badConfig = {
                ...defaultConfig,
                embeddings: null,
            };
            expect(() => new MemoryService(badConfig)).toThrow();
        });
    });
    describe('memory operations', () => {
        it('should store and retrieve memories', async () => {
            const memory = {
                id: 'test-memory',
                type: 'semantic',
                content: 'Test memory content',
                embedding: [0.1, 0.2, 0.3],
                metadata: { source: 'test' },
                timestamp: Date.now(),
            };
            await expect(service.store(memory)).resolves.toBeUndefined();
            const retrieved = await service.retrieve('test-memory');
            expect(retrieved).toBeDefined();
            expect(retrieved?.content).toBe('Test memory content');
        });
        it('should handle storage errors gracefully', async () => {
            const invalidMemory = {
                id: 'invalid',
                type: 'semantic',
                content: '',
                embedding: [], // Invalid embedding
                metadata: {},
                timestamp: Date.now(),
            };
            await expect(service.store(invalidMemory)).rejects.toThrow();
        });
    });
    describe('context management', () => {
        it('should optimize token allocation', async () => {
            const context = await service.getContext({
                userId: 'test-user',
                maxTokens: 1000,
                includeRecent: true,
                includeSemantic: true,
                includeEpisodic: true,
            });
            expect(context).toBeDefined();
            expect(context.length).toBeGreaterThan(0);
            expect(context.length).toBeLessThanOrEqual(1000);
        });
        it('should handle empty context gracefully', async () => {
            const context = await service.getContext({
                userId: 'non-existent',
                maxTokens: 100,
                includeRecent: false,
                includeSemantic: false,
                includeEpisodic: false,
            });
            expect(context).toEqual([]);
        });
    });
    describe('memory management', () => {
        it('should handle memory limits', async () => {
            const config = {
                ...defaultConfig,
                persistence: {
                    ...defaultConfig.persistence,
                    cacheSize: 2,
                },
            };
            const limitedService = new MemoryService(config);
            // Add memories up to the limit
            for (let i = 0; i < 5; i++) {
                const memory = {
                    id: `memory-${i}`,
                    type: 'semantic',
                    content: `Memory content ${i}`,
                    embedding: [0.1, 0.2, 0.3],
                    metadata: { index: i },
                    timestamp: Date.now() + i,
                };
                await limitedService.store(memory);
            }
            // Should only have 2 memories in cache due to limit
            const stats = limitedService.getStats();
            expect(stats.totalMemories).toBeLessThanOrEqual(2);
        });
        it('should clean up expired memories', async () => {
            const config = {
                ...defaultConfig,
                persistence: {
                    ...defaultConfig.persistence,
                    ttl: 100, // 100ms TTL
                },
            };
            const ttlService = new MemoryService(config);
            const memory = {
                id: 'ttl-memory',
                type: 'semantic',
                content: 'TTL memory content',
                embedding: [0.1, 0.2, 0.3],
                metadata: {},
                timestamp: Date.now(),
            };
            await ttlService.store(memory);
            // Wait for TTL to expire
            await new Promise(resolve => setTimeout(resolve, 150));
            // Clean up expired memories
            await ttlService.cleanup();
            // Memory should be gone
            const retrieved = await ttlService.retrieve('ttl-memory');
            expect(retrieved).toBeNull();
        });
    });
    describe('error handling', () => {
        it('should handle vector store errors', async () => {
            const failingVectorStore = {
                ...mockVectorStore,
                query: vi.fn().mockRejectedValue(new Error('Vector store error')),
            };
            const config = {
                ...defaultConfig,
                persistence: {
                    ...defaultConfig.persistence,
                    useVectorStore: true,
                    vectorStore: failingVectorStore,
                },
            };
            const failingService = new MemoryService(config);
            await expect(failingService.search('test query', 5)).rejects.toThrow('Vector store error');
        });
        it('should handle embedding errors', async () => {
            const failingEmbeddings = {
                ...mockEmbeddings,
                embedText: vi.fn().mockRejectedValue(new Error('Embedding error')),
            };
            const config = {
                ...defaultConfig,
                embeddings: failingEmbeddings,
            };
            const failingService = new MemoryService(config);
            await expect(failingService.store({
                id: 'embedding-error',
                type: 'semantic',
                content: 'Test content',
                embedding: [], // This will trigger embedding
                metadata: {},
                timestamp: Date.now(),
            })).rejects.toThrow('Embedding error');
        });
    });
    describe('performance', () => {
        it('should handle concurrent operations', async () => {
            const promises = [];
            for (let i = 0; i < 10; i++) {
                const memory = {
                    id: `concurrent-${i}`,
                    type: 'semantic',
                    content: `Concurrent memory ${i}`,
                    embedding: [0.1, 0.2, 0.3],
                    metadata: { index: i },
                    timestamp: Date.now() + i,
                };
                promises.push(service.store(memory));
            }
            await Promise.all(promises);
            // Verify all memories were stored
            const stats = service.getStats();
            expect(stats.totalMemories).toBeGreaterThanOrEqual(10);
        });
        it('should optimize memory usage', async () => {
            const initialMemory = process.memoryUsage().heapUsed;
            // Add many memories
            for (let i = 0; i < 100; i++) {
                const memory = {
                    id: `performance-${i}`,
                    type: 'semantic',
                    content: `Performance test memory ${i}`,
                    embedding: [0.1, 0.2, 0.3],
                    metadata: { index: i },
                    timestamp: Date.now() + i,
                };
                await service.store(memory);
            }
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            // Memory increase should be reasonable (less than 50MB for 100 memories)
            expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
        });
    });
});
//# sourceMappingURL=memory-service-fixed.test.js.map