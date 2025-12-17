/**
 * Fixed MemoryService Tests
 * Addresses test failures and memory issues
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { MemoryServiceFixed } from './memory-service-fixed'
import type { MemoryServiceConfig } from './types'

// Create minimal config for testing
function createTestConfig(overrides: Partial<MemoryServiceConfig> = {}): MemoryServiceConfig {
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
    cleanupInterval: 300000, // 5 minutes
    summarizationInterval: 600000, // 10 minutes
    retentionPolicy: {
      shortTerm: 300,
      session: 3600,
      thread: 86400,
      global: 0,
    },
    debug: false,
    ...overrides,
  }
}

describe('MemoryServiceFixed', () => {
  let service: MemoryServiceFixed

  beforeEach(() => {
    service = new MemoryServiceFixed(createTestConfig())
  })

  afterEach(async () => {
    await service.close()
  })

  describe('constructor', () => {
    it('should create service with config', () => {
      expect(service).toBeDefined()
    })

    it('should initialize with empty cache', () => {
      const stats = service.getStats()
      expect(stats.total).toBe(0)
    })

    it('should handle missing config gracefully', () => {
      expect(() => new MemoryServiceFixed({} as any)).toThrow()
    })
  })

  describe('addMemory', () => {
    it('should add a memory item', async () => {
      const memory = await service.addMemory(
        'Test content',
        'episodic',
        'session',
        { topic: 'test' }
      )

      expect(memory).toBeDefined()
      expect(memory.id).toBeDefined()
      expect(memory.content).toBe('Test content')
      expect(memory.type).toBe('episodic')
      expect(memory.scope).toBe('session')
      expect(memory.metadata.topic).toBe('test')
    })

    it('should calculate tokens for content', async () => {
      const memory = await service.addMemory(
        'Hello World', // 11 chars = 3 tokens (ceil(11/4))
        'episodic',
        'session'
      )

      expect(memory.tokens).toBe(3)
    })

    it('should set default confidence', async () => {
      const memory = await service.addMemory(
        'Test',
        'episodic',
        'session'
      )

      expect(memory.confidence).toBe(0.8)
    })

    it('should allow custom confidence', async () => {
      const memory = await service.addMemory(
        'Test',
        'episodic',
        'session',
        {},
        { confidence: 0.95 }
      )

      expect(memory.confidence).toBe(0.95)
    })

    it('should set default priority', async () => {
      const memory = await service.addMemory(
        'Test',
        'episodic',
        'session'
      )

      expect(memory.priority).toBe('medium')
    })

    it('should allow custom priority', async () => {
      const memory = await service.addMemory(
        'Test',
        'episodic',
        'session',
        {},
        { priority: 'critical' }
      )

      expect(memory.priority).toBe('critical')
    })

    it('should set timestamps', async () => {
      const before = new Date()
      const memory = await service.addMemory('Test', 'episodic', 'session')
      const after = new Date()

      expect(memory.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(memory.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
      expect(memory.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    })

    it('should accept custom embedding', async () => {
      const embedding = [0.1, 0.2, 0.3]
      const memory = await service.addMemory(
        'Test',
        'semantic',
        'global',
        {},
        { embedding }
      )

      expect(memory.embedding).toEqual(embedding)
    })

    it('should handle empty content gracefully', async () => {
      await expect(service.addMemory('', 'episodic', 'session')).rejects.toThrow('Content cannot be empty')
    })

    it('should handle null content gracefully', async () => {
      await expect(service.addMemory(null as any, 'episodic', 'session')).rejects.toThrow('Content cannot be empty')
    })
  })

  describe('addMemories', () => {
    it('should add multiple memories', async () => {
      const memories = await service.addMemories([
        { content: 'First', type: 'episodic', scope: 'session' },
        { content: 'Second', type: 'semantic', scope: 'user' },
        { content: 'Third', type: 'procedural', scope: 'global' },
      ])

      expect(memories.length).toBe(3)
      expect(memories[0].content).toBe('First')
      expect(memories[1].content).toBe('Second')
      expect(memories[2].content).toBe('Third')
    })

    it('should return empty array for empty input', async () => {
      const memories = await service.addMemories([])
      expect(memories).toEqual([])
    })

    it('should handle null input gracefully', async () => {
      const memories = await service.addMemories(null as any)
      expect(memories).toEqual([])
    })
  })

  describe('get', () => {
    it('should get memory by id', async () => {
      const added = await service.addMemory('Test content', 'episodic', 'session')
      const retrieved = await service.get(added.id)

      expect(retrieved).not.toBeNull()
      expect(retrieved?.id).toBe(added.id)
      expect(retrieved?.content).toBe('Test content')
    })

    it('should return null for non-existent id', async () => {
      const retrieved = await service.get('non-existent-id')
      expect(retrieved).toBeNull()
    })

    it('should return null for null id', async () => {
      const retrieved = await service.get(null as any)
      expect(retrieved).toBeNull()
    })

    it('should return null for empty id', async () => {
      const retrieved = await service.get('')
      expect(retrieved).toBeNull()
    })
  })

  describe('query', () => {
    beforeEach(async () => {
      await service.addMemory('The quick brown fox', 'episodic', 'session', {
        userId: 'user-1',
        topic: 'animals'
      })
      await service.addMemory('jumps over the lazy dog', 'episodic', 'session', {
        userId: 'user-1',
        topic: 'animals'
      })
      await service.addMemory('Hello world', 'semantic', 'global', {
        userId: 'user-2',
        topic: 'greeting'
      })
    })

    it('should query by content', async () => {
      const results = await service.query({ content: 'fox' })

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].memory.content).toContain('fox')
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('should query by metadata', async () => {
      const results = await service.query({ metadata: { topic: 'animals' } })

      expect(results.length).toBe(2)
      expect(results.every(r => r.memory.metadata.topic === 'animals')).toBe(true)
    })

    it('should query with limit', async () => {
      const results = await service.query({ content: 'the', limit: 2 })

      expect(results.length).toBeLessThanOrEqual(2)
    })

    it('should query with threshold', async () => {
      const results = await service.query({ content: 'fox', threshold: 0.5 })

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].score).toBeGreaterThanOrEqual(0.5)
    })

    it('should return empty array for no matches', async () => {
      const results = await service.query({ content: 'nonexistent' })

      expect(results).toEqual([])
    })

    it('should return empty array for empty query', async () => {
      const results = await service.query({} as any)

      expect(results).toEqual([])
    })

    it('should handle null query gracefully', async () => {
      const results = await service.query(null as any)

      expect(results).toEqual([])
    })
  })

  describe('getStats', () => {
    it('should return stats for empty service', () => {
      const stats = service.getStats()

      expect(stats.total).toBe(0)
      expect(stats.byType.episodic).toBe(0)
      expect(stats.byType.semantic).toBe(0)
      expect(stats.byType.procedural).toBe(0)
      expect(stats.byType.working).toBe(0)
      expect(stats.totalTokens).toBe(0)
      expect(stats.averageConfidence).toBe(0)
      expect(stats.oldest).toBeNull()
      expect(stats.newest).toBeNull()
    })

    it('should return stats with memories', async () => {
      await service.addMemory('Test 1', 'episodic', 'session')
      await service.addMemory('Test 2', 'semantic', 'global')
      await service.addMemory('Test 3', 'procedural', 'thread')

      const stats = service.getStats()

      expect(stats.total).toBe(3)
      expect(stats.byType.episodic).toBe(1)
      expect(stats.byType.semantic).toBe(1)
      expect(stats.byType.procedural).toBe(1)
      expect(stats.byType.working).toBe(0)
      expect(stats.totalTokens).toBeGreaterThan(0)
      expect(stats.averageConfidence).toBe(0.8)
      expect(stats.oldest).toBeInstanceOf(Date)
      expect(stats.newest).toBeInstanceOf(Date)
    })

    it('should handle large memory sets', async () => {
      const memories = []
      for (let i = 0; i < 100; i++) {
        memories.push({
          content: `Test memory ${i}`,
          type: i % 2 === 0 ? 'episodic' : 'semantic',
          scope: 'session'
        })
      }

      await service.addMemories(memories)
      const stats = service.getStats()

      expect(stats.total).toBe(100)
      expect(stats.byType.episodic).toBe(50)
      expect(stats.byType.semantic).toBe(50)
    })
  })

  describe('memory management', () => {
    it('should properly close service', async () => {
      await service.addMemory('Test', 'episodic', 'session')
      expect(service.getStats().total).toBe(1)

      await service.close()
      
      // After close, stats should show 0
      expect(service.getStats().total).toBe(0)
    })

    it('should prevent operations after close', async () => {
      await service.close()
      
      await expect(service.addMemory('Test', 'episodic', 'session')).rejects.toThrow('Memory service is shutting down')
    })
  })

  describe('error handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const badService = new MemoryServiceFixed({
        tokenOptimization: null as any,
        persistence: { useVectorStore: false, useCache: true, useDatabase: false },
        enableAutoSummarization: false,
        enableAutoCleanup: false,
        retentionPolicy: { shortTerm: 300, session: 3600, thread: 86400, global: 0 }
      })

      // Should not throw during construction
      expect(badService).toBeDefined()
      
      await badService.close()
    })

    it('should emit errors for debugging', async () => {
      const errorHandler = vi.fn()
      const badService = new MemoryServiceFixed(createTestConfig())
      
      // Add error listener
      badService.on('error', errorHandler)
      
      // Try to add invalid memory
      try {
        await badService.addMemory('', 'episodic', 'session')
      } catch (error) {
        // Expected to throw
      }
      
      await badService.close()
    })
  })
})