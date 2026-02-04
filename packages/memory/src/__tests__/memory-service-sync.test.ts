/**
 * Cache-Vector Store Synchronization Tests
 *
 * These tests verify that cache-vector store remain consistent
 * even when vector store operations fail, through automatic rollback.
 *
 * CRIT-005: Cache-Store Sync Gaps
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryService } from '../memory-service/core'
import type { VectorStore, EmbeddingProvider } from '../types'

describe('MemoryService - Cache-Vector Store Sync', () => {
  let memoryService: MemoryService
  let mockVectorStore: Partial<VectorStore>
  let mockEmbeddings: EmbeddingProvider

  beforeEach(() => {
    // Create mock embeddings provider (returns dummy 1536-dimensional vector)
    mockEmbeddings = {
      embedText: vi.fn().mockResolvedValue(new Array(1536).fill(0.1)),
    }

    // Create mock vector store with explicit default implementations
    mockVectorStore = {
      upsert: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue([]),
    }

    // Create memory service with mock vector store AND embeddings
    // Note: MemoryService constructor takes (config, vectorStore?, embeddings?)
    memoryService = new MemoryService(
      {
        maxItems: 1000,
        maxTokens: 100000,
        persistence: {
          enabled: false,
        },
        debug: true, // Enable debug mode to see error logs
      },
      mockVectorStore as VectorStore,
      mockEmbeddings
    )
  })

  describe('updateMemory() rollback', () => {
    it('should rollback cache changes when vector store update fails', async () => {
      // Add initial memory
      const memory = await memoryService.addMemory(
        'original content',
        'semantic',
        'conversation',
        { userId: 'test-user' }
      )

      // Get original state
      const originalContent = memory.content
      const originalTokens = memory.tokens

      // Mock vector store to fail
      vi.mocked(mockVectorStore.upsert!).mockRejectedValueOnce(
        new Error('Vector store connection failed')
      )

      // Attempt to update memory - should throw
      await expect(
        memoryService.updateMemory(memory.id, {
          content: 'updated content',
        })
      ).rejects.toThrow('vector store sync failed')

      // Verify cache was rolled back to original state
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory).toBeDefined()
      expect(cachedMemory!.content).toBe(originalContent)
      expect(cachedMemory!.tokens).toBe(originalTokens)
      expect(cachedMemory!.content).not.toBe('updated content')
    })

    it('should commit changes when vector store update succeeds', async () => {
      // Add initial memory
      const memory = await memoryService.addMemory(
        'original content',
        'semantic',
        'conversation'
      )

      // Mock vector store to succeed
      vi.mocked(mockVectorStore.upsert).mockResolvedValueOnce(undefined)

      // Update memory - should succeed
      const updated = await memoryService.updateMemory(memory.id, {
        content: 'updated content',
      })

      // Verify changes were committed
      expect(updated).toBeDefined()
      expect(updated!.content).toBe('updated content')

      // Verify cache has updated content
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory!.content).toBe('updated content')
    })

    it('should preserve original memory during multiple failed updates', async () => {
      // Add initial memory
      const memory = await memoryService.addMemory(
        'original content',
        'semantic',
        'conversation'
      )

      const originalContent = memory.content

      // Mock vector store to fail multiple times
      vi.mocked(mockVectorStore.upsert)
        .mockRejectedValueOnce(new Error('Failure 1'))
        .mockRejectedValueOnce(new Error('Failure 2'))
        .mockRejectedValueOnce(new Error('Failure 3'))

      // Attempt multiple updates
      for (let i = 1; i <= 3; i++) {
        await expect(
          memoryService.updateMemory(memory.id, {
            content: `update attempt ${i}`,
          })
        ).rejects.toThrow()
      }

      // Verify original content is still preserved
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory!.content).toBe(originalContent)
    })
  })

  describe('deleteMemory() rollback', () => {
    it('should rollback cache deletion when vector store delete fails', async () => {
      // Add memory
      const memory = await memoryService.addMemory(
        'test content',
        'semantic',
        'conversation',
        { userId: 'test-user' }
      )

      // Mock vector store to fail
      vi.mocked(mockVectorStore.delete).mockRejectedValueOnce(
        new Error('Vector store delete failed')
      )

      // Attempt to delete - should throw
      await expect(memoryService.deleteMemory(memory.id)).rejects.toThrow(
        'vector store sync failed'
      )

      // Verify memory was restored in cache
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory).toBeDefined()
      expect(cachedMemory!.id).toBe(memory.id)
      expect(cachedMemory!.content).toBe('test content')
    })

    it('should commit deletion when vector store delete succeeds', async () => {
      // Add memory
      const memory = await memoryService.addMemory(
        'test content',
        'semantic',
        'conversation'
      )

      // Mock vector store to succeed
      vi.mocked(mockVectorStore.delete).mockResolvedValueOnce(undefined)

      // Delete memory - should succeed
      const result = await memoryService.deleteMemory(memory.id)
      expect(result).toBe(true)

      // Verify memory is gone from cache
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory).toBeNull()
    })

    it('should preserve memory during multiple failed deletions', async () => {
      // Add memory
      const memory = await memoryService.addMemory(
        'persistent content',
        'semantic',
        'conversation'
      )

      // Mock vector store to fail multiple times
      vi.mocked(mockVectorStore.delete)
        .mockRejectedValueOnce(new Error('Failure 1'))
        .mockRejectedValueOnce(new Error('Failure 2'))

      // Attempt multiple deletions
      for (let i = 1; i <= 2; i++) {
        await expect(memoryService.deleteMemory(memory.id)).rejects.toThrow()
      }

      // Verify memory still exists
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory).toBeDefined()
      expect(cachedMemory!.id).toBe(memory.id)
    })
  })

  describe('flushBuffer() consistency', () => {
    it('should preserve buffer when vector store flush fails', async () => {
      // Add memories to buffer (don't await flush)
      const memory1 = await memoryService.addMemory(
        'content 1',
        'semantic',
        'conversation'
      )
      const memory2 = await memoryService.addMemory(
        'content 2',
        'semantic',
        'conversation'
      )

      // Mock vector store to fail
      vi.mocked(mockVectorStore.upsert).mockRejectedValueOnce(
        new Error('Vector store flush failed')
      )

      // Attempt flush - should throw
      await expect(memoryService.flushBuffer()).rejects.toThrow(
        'Buffer flush failed'
      )

      // Verify buffer is NOT cleared (preserved for retry)
      // This is internal, but we can verify by successfully flushing after
      vi.mocked(mockVectorStore.upsert).mockResolvedValueOnce(undefined)

      // Retry flush - should succeed with same items
      await expect(memoryService.flushBuffer()).resolves.not.toThrow()

      // Vector store should have received the items
      expect(mockVectorStore.upsert).toHaveBeenCalled()
    })

    it('should clear buffer only after successful vector store flush', async () => {
      // Add memories
      await memoryService.addMemory('content 1', 'semantic', 'conversation')
      await memoryService.addMemory('content 2', 'semantic', 'conversation')

      // Mock vector store to succeed
      vi.mocked(mockVectorStore.upsert).mockResolvedValueOnce(undefined)

      // Flush - should succeed
      await memoryService.flushBuffer()

      // Try flush again - should be no-op (buffer was cleared)
      vi.mocked(mockVectorStore.upsert).mockClear()
      await memoryService.flushBuffer()

      // Vector store should NOT be called (buffer was empty)
      expect(mockVectorStore.upsert).not.toHaveBeenCalled()
    })
  })

  describe('consistency guarantees', () => {
    it('should maintain cache-vector store consistency across operations', async () => {
      // Add memory
      const memory = await memoryService.addMemory(
        'initial',
        'semantic',
        'conversation'
      )

      // Successful update
      vi.mocked(mockVectorStore.upsert).mockResolvedValueOnce(undefined)
      await memoryService.updateMemory(memory.id, { content: 'updated' })

      // Failed update (should rollback)
      vi.mocked(mockVectorStore.upsert).mockRejectedValueOnce(
        new Error('Failure')
      )
      await expect(
        memoryService.updateMemory(memory.id, { content: 'failed update' })
      ).rejects.toThrow()

      // Verify cache has last successful state
      const cachedMemory = await memoryService.get(memory.id)
      expect(cachedMemory!.content).toBe('updated')
      expect(cachedMemory!.content).not.toBe('failed update')
    })

    it('should handle mixed success/failure scenarios correctly', async () => {
      // Add 3 memories
      const mem1 = await memoryService.addMemory(
        'm1',
        'semantic',
        'conversation'
      )
      const mem2 = await memoryService.addMemory(
        'm2',
        'semantic',
        'conversation'
      )
      const mem3 = await memoryService.addMemory(
        'm3',
        'semantic',
        'conversation'
      )

      // Update mem1 - success
      vi.mocked(mockVectorStore.upsert).mockResolvedValueOnce(undefined)
      await memoryService.updateMemory(mem1.id, { content: 'm1-updated' })

      // Update mem2 - failure (rollback)
      vi.mocked(mockVectorStore.upsert).mockRejectedValueOnce(new Error('Fail'))
      await expect(
        memoryService.updateMemory(mem2.id, { content: 'm2-updated' })
      ).rejects.toThrow()

      // Delete mem3 - success
      vi.mocked(mockVectorStore.delete).mockResolvedValueOnce(undefined)
      await memoryService.deleteMemory(mem3.id)

      // Verify final state
      const cached1 = await memoryService.get(mem1.id)
      const cached2 = await memoryService.get(mem2.id)
      const cached3 = await memoryService.get(mem3.id)

      expect(cached1!.content).toBe('m1-updated') // Updated
      expect(cached2!.content).toBe('m2') // Rolled back
      expect(cached3).toBeNull() // Deleted
    })
  })
})
