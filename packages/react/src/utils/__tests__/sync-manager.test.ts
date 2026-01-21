/**
 * Sync Manager Tests
 *
 * Tests for cross-device synchronization with conflict resolution,
 * offline support, and real-time updates.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SyncManager, ConflictResolver, SyncQueue } from '../sync-manager'
import type { SyncableData, SyncOptions } from '../sync-manager'

describe('SyncManager', () => {
  let localStorage: any
  let remoteStorage: any
  let options: SyncOptions
  let syncManager: SyncManager

  beforeEach(() => {
    localStorage = {
      getAll: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }

    remoteStorage = {
      getAll: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      getConflicts: vi.fn(),
    }

    options = {
      conflictStrategy: 'merge',
      enableRealtime: false,
      syncInterval: 30000,
      maxRetries: 3,
    }

    syncManager = new SyncManager(localStorage, remoteStorage, options)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Sync', () => {
    it('should sync successfully with no conflicts', async () => {
      const localData: SyncableData = {
        id: 'test-1',
        lastModified: 1000,
        version: 1,
        data: { content: 'local' },
      }

      const remoteData: SyncableData = {
        id: 'test-2',
        lastModified: 2000,
        version: 1,
        data: { content: 'remote' },
      }

      localStorage.getAll.mockResolvedValue([localData])
      remoteStorage.getAll.mockResolvedValue([remoteData])

      const result = await syncManager.sync()

      expect(result.success).toBe(true)
      expect(result.syncedItems).toBe(2)
      expect(result.conflictsResolved).toBe(0)
      expect(localStorage.set).toHaveBeenCalledWith(remoteData)
      expect(remoteStorage.set).toHaveBeenCalledWith(localData)
    })

    it('should handle remote data newer than local', async () => {
      const localData: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { content: 'old' },
      }

      const remoteData: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { content: 'new' },
      }

      localStorage.get.mockResolvedValue(localData)
      remoteStorage.getAll.mockResolvedValue([remoteData])

      const result = await syncManager.sync()

      expect(localStorage.set).toHaveBeenCalledWith(remoteData)
    })

    it('should upload local changes', async () => {
      const localData: SyncableData = {
        id: 'test',
        lastModified: Date.now(),
        version: 1,
        data: { content: 'local' },
      }

      localStorage.getAll.mockResolvedValue([localData])
      remoteStorage.getAll.mockResolvedValue([])

      await syncManager.sync()

      expect(remoteStorage.set).toHaveBeenCalledWith(localData)
    })
  })

  describe('Conflict Resolution', () => {
    it('should resolve conflicts using merge strategy', async () => {
      const localData: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { title: 'Local', content: 'Local content' },
      }

      const remoteData: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { title: 'Remote', description: 'Remote description' },
      }

      localStorage.get.mockResolvedValue(localData)
      remoteStorage.getAll.mockResolvedValue([remoteData])

      const result = await syncManager.sync()

      expect(result.conflictsResolved).toBe(1)
      expect(localStorage.set).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            title: 'Remote', // Remote wins
            content: 'Local content', // Local preserved
            description: 'Remote description', // Remote preserved
          },
        })
      )
    })

    it('should use last-write-wins strategy', async () => {
      const localWinsManager = new SyncManager(localStorage, remoteStorage, {
        ...options,
        conflictStrategy: 'local-wins',
      })

      const localData: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { content: 'local' },
      }

      const remoteData: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { content: 'remote' },
      }

      localStorage.get.mockResolvedValue(localData)
      remoteStorage.getAll.mockResolvedValue([remoteData])

      await localWinsManager.sync()

      expect(localStorage.set).toHaveBeenCalledWith(localData)
    })

    it('should call manual conflict resolver', async () => {
      const onConflict = vi.fn().mockResolvedValue({
        id: 'test',
        lastModified: 3000,
        version: 3,
        data: { content: 'resolved' },
      })

      const manualManager = new SyncManager(localStorage, remoteStorage, {
        ...options,
        conflictStrategy: 'manual',
        onConflict,
      })

      const localData: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { content: 'local' },
      }

      const remoteData: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { content: 'remote' },
      }

      localStorage.get.mockResolvedValue(localData)
      remoteStorage.getAll.mockResolvedValue([remoteData])

      await manualManager.sync()

      expect(onConflict).toHaveBeenCalled()
      expect(localStorage.set).toHaveBeenCalledWith(
        expect.objectContaining({ data: { content: 'resolved' } })
      )
    })
  })

  describe('Queue Management', () => {
    it('should queue changes for sync', () => {
      const data: SyncableData = {
        id: 'test',
        lastModified: Date.now(),
        version: 1,
        data: { content: 'test' },
      }

      syncManager.queueChange('update', data)

      expect(syncManager.getStatus().pendingChanges).toBe(1)
    })

    it('should process queued changes during sync', async () => {
      const data: SyncableData = {
        id: 'test',
        lastModified: Date.now(),
        version: 1,
        data: { content: 'queued' },
      }

      syncManager.queueChange('create', data)
      localStorage.getAll.mockResolvedValue([])
      remoteStorage.getAll.mockResolvedValue([])

      await syncManager.sync()

      expect(remoteStorage.set).toHaveBeenCalledWith(data)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      remoteStorage.getAll.mockRejectedValue(new Error('Network error'))

      const result = await syncManager.sync()

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle offline state', async () => {
      // Mock offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })

      const result = await syncManager.sync()

      expect(result.success).toBe(false)
      expect(result.errors[0].type).toBe('network')
    })

    it('should retry failed operations', async () => {
      remoteStorage.set.mockRejectedValueOnce(new Error('Temp failure'))
        .mockResolvedValueOnce(undefined)

      const data: SyncableData = {
        id: 'test',
        lastModified: Date.now(),
        version: 1,
        data: { content: 'test' },
      }

      syncManager.queueChange('create', data)
      localStorage.getAll.mockResolvedValue([])
      remoteStorage.getAll.mockResolvedValue([])

      await syncManager.sync()

      expect(remoteStorage.set).toHaveBeenCalledTimes(2)
    })
  })
})

describe('ConflictResolver', () => {
  describe('Merge Strategy', () => {
    it('should merge object properties', () => {
      const local: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { a: 1, b: 2 },
      }

      const remote: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { b: 3, c: 4 },
      }

      const result = ConflictResolver.mergeData(local, remote)

      expect(result.data).toEqual({ a: 1, b: 3, c: 4 })
    })

    it('should handle array merging', () => {
      const local: SyncableData = {
        id: 'test',
        lastModified: 1000,
        version: 1,
        data: { tags: ['a', 'b'] },
      }

      const remote: SyncableData = {
        id: 'test',
        lastModified: 2000,
        version: 2,
        data: { tags: ['b', 'c'] },
      }

      const result = ConflictResolver.mergeData(local, remote)

      expect(result.data.tags).toEqual(['a', 'b', 'c'])
    })
  })
})

describe('SyncQueue', () => {
  let queue: SyncQueue

  beforeEach(() => {
    queue = new SyncQueue()
  })

  it('should enqueue and dequeue operations', () => {
    const data = { id: 'test', lastModified: Date.now(), version: 1, data: {} }

    queue.enqueue('create', data)
    expect(queue.size).toBe(1)

    const operations = queue.dequeue()
    expect(operations).toHaveLength(1)
    expect(operations[0].type).toBe('create')
    expect(queue.size).toBe(0)
  })

  it('should prevent duplicate operations', () => {
    const data1 = { id: 'test', lastModified: Date.now(), version: 1, data: {} }
    const data2 = { id: 'test', lastModified: Date.now() + 1000, version: 2, data: {} }

    queue.enqueue('update', data1)
    queue.enqueue('update', data2)

    expect(queue.size).toBe(1)
  })

  it('should retry failed operations', () => {
    const data = { id: 'test', lastModified: Date.now(), version: 1, data: {} }

    queue.enqueue('create', data)
    const operations = queue.dequeue()
    const operationId = operations[0].id

    // First retry should succeed
    expect(queue.retry(operationId)).toBe(true)
    expect(queue.size).toBe(1)

    // Second retry should also succeed
    expect(queue.retry(operationId)).toBe(true)
    expect(queue.size).toBe(1)

    // Third retry should fail (max retries reached)
    expect(queue.retry(operationId)).toBe(false)
  })
})