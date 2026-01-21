/**
 * Request Queue Tests
 *
 * Tests for the request queue system with rate limiting, priority handling,
 * and error recovery.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RequestQueue } from '../request-queue'

describe('RequestQueue', () => {
  let queue: RequestQueue
  let mockRequest: vi.MockedFunction<() => Promise<string>>

  beforeEach(() => {
    queue = new RequestQueue({
      maxConcurrent: 2,
      maxQueueSize: 5,
      retryDelayMs: 10, // Fast for testing
      maxRetries: 2,
    })
    mockRequest = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllTimers()
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should process requests immediately when under capacity', async () => {
      mockRequest.mockResolvedValue('success')

      const result = await queue.enqueue(mockRequest)

      expect(result).toBe('success')
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })

    it('should queue requests when at capacity', async () => {
      mockRequest.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve('success'), 100)
      }))

      // Fill capacity
      const promises = Array(2).fill(null).map(() => queue.enqueue(mockRequest))

      // Add one more (should queue)
      const queuedPromise = queue.enqueue(mockRequest)

      // Wait for first batch to complete
      vi.advanceTimersByTime(100)
      await Promise.all(promises)

      // Now the queued request should complete
      vi.advanceTimersByTime(10)
      const result = await queuedPromise

      expect(result).toBe('success')
      expect(mockRequest).toHaveBeenCalledTimes(3)
    })

    it('should respect max queue size', async () => {
      // Create a small queue
      const smallQueue = new RequestQueue({
        maxConcurrent: 1,
        maxQueueSize: 2,
        maxRetries: 0,
      })

      mockRequest.mockResolvedValue('success')

      // Fill queue
      await smallQueue.enqueue(mockRequest)
      await smallQueue.enqueue(mockRequest)
      await smallQueue.enqueue(mockRequest)

      // This should fail
      await expect(smallQueue.enqueue(mockRequest)).rejects.toThrow('Request queue is full')
    })
  })

  describe('Priority Handling', () => {
    it('should process high priority requests first', async () => {
      const callOrder: string[] = []

      const createRequest = (id: string) => () =>
        new Promise<string>(resolve => {
          callOrder.push(id)
          setTimeout(() => resolve(id), 50)
        })

      // Add requests with different priorities
      const promises = [
        queue.enqueue(createRequest('normal-1'), { priority: 'normal' }),
        queue.enqueue(createRequest('low-1'), { priority: 'low' }),
        queue.enqueue(createRequest('high-1'), { priority: 'high' }),
        queue.enqueue(createRequest('normal-2'), { priority: 'normal' }),
      ]

      vi.advanceTimersByTime(100)
      await Promise.all(promises)

      // High priority should be processed first
      expect(callOrder[0]).toBe('high-1')
      expect(callOrder.slice(1)).toEqual(expect.arrayContaining(['normal-1', 'normal-2', 'low-1']))
    })
  })

  describe('Error Handling and Retry', () => {
    it('should retry failed requests', async () => {
      let attempts = 0
      mockRequest.mockImplementation(() => {
        attempts++
        if (attempts < 2) {
          return Promise.reject(new Error('Temporary failure'))
        }
        return Promise.resolve('success')
      })

      const result = await queue.enqueue(mockRequest, { maxRetries: 2 })

      expect(result).toBe('success')
      expect(mockRequest).toHaveBeenCalledTimes(2)
    })

    it('should give up after max retries', async () => {
      mockRequest.mockRejectedValue(new Error('Persistent failure'))

      await expect(queue.enqueue(mockRequest, { maxRetries: 2 })).rejects.toThrow('Persistent failure')
      expect(mockRequest).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limit responses', async () => {
      const rateLimitCheck = vi.fn()
        .mockResolvedValueOnce({ allowed: false, resetAt: Date.now() + 1000 })
        .mockResolvedValueOnce({ allowed: true, resetAt: 0 })

      const testQueue = new RequestQueue({
        maxConcurrent: 1,
        rateLimitCheck,
        retryDelayMs: 10,
      })

      mockRequest.mockResolvedValue('success')

      const promise = testQueue.enqueue(mockRequest)

      // Advance time to after rate limit reset
      vi.advanceTimersByTime(1010)

      const result = await promise

      expect(result).toBe('success')
      expect(rateLimitCheck).toHaveBeenCalledTimes(2)
    })

    it('should call rate limit callback', async () => {
      const onRateLimited = vi.fn()

      const testQueue = new RequestQueue({
        maxConcurrent: 1,
        rateLimitCheck: () => Promise.resolve({ allowed: false, resetAt: Date.now() + 1000 }),
        onRateLimited,
      })

      mockRequest.mockResolvedValue('success')

      testQueue.enqueue(mockRequest)

      expect(onRateLimited).toHaveBeenCalled()
    })
  })

  describe('Queue Management', () => {
    it('should cancel queued requests', async () => {
      mockRequest.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve('success'), 100)
      }))

      // Fill capacity
      await queue.enqueue(mockRequest)
      await queue.enqueue(mockRequest)

      // Add and cancel a request
      const promise = queue.enqueue(mockRequest)
      const status = queue.getStatus()

      // Should have the request in queue
      expect(status.queueLength).toBe(1)

      // Cancel it
      const cancelled = queue.cancel((promise as any).id || 'unknown')
      expect(cancelled).toBe(true)

      // Queue should be empty
      expect(queue.getStatus().queueLength).toBe(0)
    })

    it('should clear the queue', async () => {
      mockRequest.mockResolvedValue('success')

      // Fill capacity
      await queue.enqueue(mockRequest)
      await queue.enqueue(mockRequest)
      await queue.enqueue(mockRequest)
      await queue.enqueue(mockRequest)

      const status = queue.getStatus()
      expect(status.queueLength).toBe(2) // 2 concurrent, 2 queued

      queue.clear()

      expect(queue.getStatus().queueLength).toBe(0)
    })

    it('should provide accurate queue status', async () => {
      mockRequest.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve('success'), 100)
      }))

      // Add multiple requests
      const promises = Array(4).fill(null).map(() => queue.enqueue(mockRequest))

      const status = queue.getStatus()
      expect(status.queueLength).toBe(2) // 2 concurrent capacity, so 2 queued
      expect(status.activeCount).toBe(2) // 2 active
      expect(status.maxConcurrent).toBe(2)
      expect(status.maxQueueSize).toBe(5)

      // Complete requests
      vi.advanceTimersByTime(100)
      await Promise.all(promises)

      const finalStatus = queue.getStatus()
      expect(finalStatus.queueLength).toBe(0)
      expect(finalStatus.activeCount).toBe(0)
    })
  })

  describe('Callbacks', () => {
    it('should call success callback', async () => {
      const onSuccess = vi.fn()
      mockRequest.mockResolvedValue('success')

      await queue.enqueue(mockRequest, { onSuccess })

      expect(onSuccess).toHaveBeenCalledWith('success')
    })

    it('should call error callback', async () => {
      const onError = vi.fn()
      mockRequest.mockRejectedValue(new Error('test error'))

      await expect(queue.enqueue(mockRequest, { onError })).rejects.toThrow()
      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('should call queue update callback', async () => {
      const onQueueUpdate = vi.fn()
      mockRequest.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve('success'), 100)
      }))

      // Fill capacity
      await queue.enqueue(mockRequest)
      await queue.enqueue(mockRequest)

      // Add queued request
      queue.enqueue(mockRequest, { onQueueUpdate })

      expect(onQueueUpdate).toHaveBeenCalledWith(1, expect.any(Number))
    })

    it('should call queue full callback', async () => {
      const onQueueFull = vi.fn()

      const smallQueue = new RequestQueue({
        maxConcurrent: 1,
        maxQueueSize: 1,
        onQueueFull,
      })

      mockRequest.mockResolvedValue('success')

      // Fill queue
      await smallQueue.enqueue(mockRequest)
      await expect(smallQueue.enqueue(mockRequest)).rejects.toThrow()

      expect(onQueueFull).toHaveBeenCalled()
    })
  })
})