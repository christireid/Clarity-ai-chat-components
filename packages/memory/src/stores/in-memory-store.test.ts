/**
 * InMemoryStore Tests
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStore } from './in-memory-store'
import type { Memory, MemoryType, MemoryScope } from '../types'

// Helper to create a test memory item
function createMemory(overrides: Partial<Memory> = {}): Memory {
  return {
    id: `test-${Date.now()}-${Math.random()}`,
    type: 'episodic' as MemoryType,
    scope: 'session' as MemoryScope,
    content: 'Test memory content',
    metadata: {},
    confidence: 0.8,
    priority: 'medium',
    tokens: 10,
    accessCount: 0,
    lastAccessed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

describe('InMemoryStore', () => {
  let store: InMemoryStore

  beforeEach(async () => {
    store = new InMemoryStore()
    await store.initialize()
  })

  describe('initialize', () => {
    it('should initialize with empty storage', async () => {
      const newStore = new InMemoryStore()
      await newStore.initialize()
      const stats = await newStore.getStats()
      expect(stats.totalMemories).toBe(0)
    })
  })

  describe('save and load', () => {
    it('should save and load a memory', async () => {
      const memory = createMemory({ id: 'test-1', content: 'Hello World' })
      await store.save(memory)

      const loaded = await store.load('test-1')
      expect(loaded).not.toBeNull()
      expect(loaded?.content).toBe('Hello World')
    })

    it('should return null for non-existent memory', async () => {
      const loaded = await store.load('non-existent')
      expect(loaded).toBeNull()
    })

    it('should overwrite memory with same id', async () => {
      const memory1 = createMemory({ id: 'test-1', content: 'Version 1' })
      const memory2 = createMemory({ id: 'test-1', content: 'Version 2' })

      await store.save(memory1)
      await store.save(memory2)

      const loaded = await store.load('test-1')
      expect(loaded?.content).toBe('Version 2')
    })
  })

  describe('update', () => {
    it('should update an existing memory', async () => {
      const memory = createMemory({ id: 'test-1', content: 'Original' })
      await store.save(memory)

      const updated = { ...memory, content: 'Updated' }
      await store.update('test-1', updated)

      const loaded = await store.load('test-1')
      expect(loaded?.content).toBe('Updated')
    })

    it('should throw error when updating non-existent memory', async () => {
      const memory = createMemory({ id: 'test-1' })

      await expect(store.update('non-existent', memory))
        .rejects.toThrow('Memory not found: non-existent')
    })
  })

  describe('delete', () => {
    it('should delete a memory', async () => {
      const memory = createMemory({ id: 'test-1' })
      await store.save(memory)

      await store.delete('test-1')

      const loaded = await store.load('test-1')
      expect(loaded).toBeNull()
    })

    it('should not throw when deleting non-existent memory', async () => {
      await expect(store.delete('non-existent')).resolves.not.toThrow()
    })
  })

  describe('search', () => {
    beforeEach(async () => {
      // Add test memories
      await store.save(createMemory({
        id: '1',
        content: 'The quick brown fox',
        type: 'episodic',
        scope: 'session',
        importance: 0.8,
      }))
      await store.save(createMemory({
        id: '2',
        content: 'A lazy dog sleeping',
        type: 'semantic',
        scope: 'user',
        importance: 0.5,
      }))
      await store.save(createMemory({
        id: '3',
        content: 'Quick response time',
        type: 'episodic',
        scope: 'session',
        importance: 0.9,
        metadata: { userId: 'user-1' },
      }))
    })

    it('should find memories by text match', async () => {
      const results = await store.search('quick')
      expect(results.length).toBe(2)
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('should rank exact matches higher', async () => {
      await store.save(createMemory({
        id: 'exact',
        content: 'fox',
        importance: 0.5,
      }))

      const results = await store.search('fox')
      const foxMemory = results.find(r => r.memory.id === 'exact')
      expect(foxMemory).toBeDefined()
      expect(foxMemory!.score).toBeGreaterThan(0.5)
    })

    it('should filter by type', async () => {
      const results = await store.search('quick', { types: ['episodic'] })
      expect(results.every(r => r.memory.type === 'episodic')).toBe(true)
    })

    it('should filter by scope', async () => {
      const results = await store.search('', { scopes: ['user'] })
      expect(results.every(r => r.memory.scope === 'user')).toBe(true)
    })

    it('should filter by userId', async () => {
      const results = await store.search('quick', { userId: 'user-1' })
      expect(results.length).toBe(1)
      expect(results[0].memory.metadata.userId).toBe('user-1')
    })

    it('should respect minScore', async () => {
      const results = await store.search('quick', { minScore: 0.5 })
      expect(results.every(r => r.score >= 0.5)).toBe(true)
    })

    it('should respect limit', async () => {
      const results = await store.search('', { limit: 1 })
      expect(results.length).toBeLessThanOrEqual(1)
    })

    it('should sort by score descending', async () => {
      const results = await store.search('quick')
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score)
      }
    })

    it('should use vector similarity when embeddings provided', async () => {
      await store.save(createMemory({
        id: 'vector',
        content: 'vector test',
        embedding: [1, 0, 0],
        importance: 0.5,
      }))

      const results = await store.search('test', { embedding: [1, 0, 0] })
      const vectorMemory = results.find(r => r.memory.id === 'vector')
      expect(vectorMemory).toBeDefined()
      expect(vectorMemory!.score).toBeGreaterThan(0)
    })
  })

  describe('query', () => {
    beforeEach(async () => {
      await store.save(createMemory({
        id: '1',
        type: 'episodic',
        scope: 'session',
        metadata: { userId: 'user-1', sessionId: 'session-1' },
      }))
      await store.save(createMemory({
        id: '2',
        type: 'semantic',
        scope: 'user',
        metadata: { userId: 'user-2' },
      }))
    })

    it('should return all memories without filters', async () => {
      const results = await store.query()
      expect(results.length).toBe(2)
    })

    it('should filter by scope', async () => {
      const results = await store.query({ scope: 'session' })
      expect(results.length).toBe(1)
      expect(results[0].scope).toBe('session')
    })

    it('should filter by type', async () => {
      const results = await store.query({ type: 'semantic' })
      expect(results.length).toBe(1)
      expect(results[0].type).toBe('semantic')
    })

    it('should filter by userId', async () => {
      const results = await store.query({ userId: 'user-1' })
      expect(results.length).toBe(1)
      expect(results[0].metadata.userId).toBe('user-1')
    })

    it('should filter by sessionId', async () => {
      const results = await store.query({ sessionId: 'session-1' })
      expect(results.length).toBe(1)
      expect(results[0].metadata.sessionId).toBe('session-1')
    })
  })

  describe('clear', () => {
    beforeEach(async () => {
      await store.save(createMemory({ id: '1', type: 'episodic', scope: 'session' }))
      await store.save(createMemory({ id: '2', type: 'semantic', scope: 'user' }))
      await store.save(createMemory({ id: '3', type: 'episodic', scope: 'user' }))
    })

    it('should clear all memories when no filter', async () => {
      await store.clear()
      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(0)
    })

    it('should clear memories by scope', async () => {
      await store.clear('user')
      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(1)
      expect(stats.byScope.user).toBe(0)
    })

    it('should clear memories by type', async () => {
      await store.clear(undefined, 'episodic')
      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(1)
      expect(stats.byType.episodic).toBe(0)
    })

    it('should clear memories by both scope and type', async () => {
      await store.clear('user', 'episodic')
      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(2)
    })
  })

  describe('getStats', () => {
    it('should return correct stats for empty store', async () => {
      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(0)
      expect(stats.tokenUsage).toBe(0)
      expect(stats.averageImportance).toBe(0)
      expect(stats.compressionRatio).toBe(0)
    })

    it('should count by type correctly', async () => {
      await store.save(createMemory({ type: 'episodic' }))
      await store.save(createMemory({ type: 'episodic' }))
      await store.save(createMemory({ type: 'semantic' }))

      const stats = await store.getStats()
      expect(stats.byType.episodic).toBe(2)
      expect(stats.byType.semantic).toBe(1)
    })

    it('should count by scope correctly', async () => {
      await store.save(createMemory({ scope: 'session' }))
      await store.save(createMemory({ scope: 'user' }))
      await store.save(createMemory({ scope: 'user' }))

      const stats = await store.getStats()
      expect(stats.byScope.session).toBe(1)
      expect(stats.byScope.user).toBe(2)
    })

    it('should calculate average importance', async () => {
      await store.save(createMemory({ importance: 0.2 }))
      await store.save(createMemory({ importance: 0.8 }))

      const stats = await store.getStats()
      expect(stats.averageImportance).toBe(0.5)
    })

    it('should calculate compression ratio', async () => {
      await store.save(createMemory({ compressed: 'short' }))
      await store.save(createMemory({}))

      const stats = await store.getStats()
      expect(stats.compressionRatio).toBe(0.5)
    })
  })

  describe('close', () => {
    it('should clear all memories on close', async () => {
      await store.save(createMemory({ id: '1' }))
      await store.save(createMemory({ id: '2' }))

      await store.close()

      const stats = await store.getStats()
      expect(stats.totalMemories).toBe(0)
    })
  })

  describe('cosineSimilarity (via search)', () => {
    it('should calculate correct similarity for identical vectors', async () => {
      await store.save(createMemory({
        id: 'v1',
        content: 'test',
        embedding: [1, 0, 0],
        importance: 1,
      }))

      const results = await store.search('test', { embedding: [1, 0, 0] })
      expect(results.length).toBeGreaterThan(0)
      // Identical vectors should have high similarity
      expect(results[0].score).toBeGreaterThan(0.8)
    })

    it('should handle orthogonal vectors', async () => {
      await store.save(createMemory({
        id: 'v1',
        content: 'orthogonal',
        embedding: [1, 0, 0],
        importance: 1,
      }))

      const results = await store.search('orthogonal', { embedding: [0, 1, 0] })
      // Orthogonal vectors have 0 similarity, but text match adds score
      const mem = results.find(r => r.memory.id === 'v1')
      expect(mem).toBeDefined()
    })

    it('should handle vectors of different lengths', async () => {
      await store.save(createMemory({
        id: 'v1',
        content: 'different length',
        embedding: [1, 0, 0],
        importance: 1,
      }))

      // Different length vectors should return 0 similarity
      const results = await store.search('different', { embedding: [1, 0] })
      expect(results.length).toBeGreaterThan(0)
    })
  })
})
