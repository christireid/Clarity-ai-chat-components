/**
 * Middleware Pipeline Tests
 *
 * Tests for middleware functionality, cleanup, and edge cases.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createMiddlewarePipeline,
  createLoggingMiddleware,
  createTimeoutMiddleware,
  createRetryMiddleware,
  createRateLimitMiddleware,
  createCachingMiddleware,
  createValidationMiddleware,
  createErrorHandlerMiddleware,
  createMiddlewareContext,
} from '../middleware'

// ============================================
// Timeout Middleware Tests
// ============================================

describe('Timeout Middleware', () => {
  it('should clear timeout on successful completion', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createTimeoutMiddleware(5000))
    pipeline.use({
      name: 'fast-handler',
      priority: 100,
      handler: async () => 'success',
    })

    await pipeline.execute('test')

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('should clear timeout on error', async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createTimeoutMiddleware(5000))
    pipeline.use({
      name: 'error-handler',
      priority: 100,
      handler: async () => {
        throw new Error('Test error')
      },
    })

    await expect(pipeline.execute('test')).rejects.toThrow('Test error')
    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('should timeout slow requests', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createTimeoutMiddleware(50)) // 50ms timeout
    pipeline.use({
      name: 'slow-handler',
      priority: 100,
      handler: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return 'too slow'
      },
    })

    await expect(pipeline.execute('test')).rejects.toThrow('timed out')
  })
})

// ============================================
// Caching Middleware Tests
// ============================================

describe('Caching Middleware', () => {
  it('should cache results', async () => {
    let callCount = 0

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createCachingMiddleware({
        getCacheKey: (input) => input,
        ttlMs: 10000,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async (input) => {
        callCount++
        return `result-${callCount}`
      },
    })

    // First call - should execute handler
    const result1 = await pipeline.execute('key1')
    expect(result1).toBe('result-1')
    expect(callCount).toBe(1)

    // Second call with same key - should use cache
    const result2 = await pipeline.execute('key1')
    expect(result2).toBe('result-1') // Same cached result
    expect(callCount).toBe(1) // Handler not called again

    // Different key - should execute handler
    const result3 = await pipeline.execute('key2')
    expect(result3).toBe('result-2')
    expect(callCount).toBe(2)
  })

  it('should expire cached entries', async () => {
    let callCount = 0

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createCachingMiddleware({
        getCacheKey: (input) => input,
        ttlMs: 50, // 50ms TTL
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => {
        callCount++
        return `result-${callCount}`
      },
    })

    await pipeline.execute('key1')
    expect(callCount).toBe(1)

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should execute handler again after expiration
    const result = await pipeline.execute('key1')
    expect(result).toBe('result-2')
    expect(callCount).toBe(2)
  })

  it('should evict expired entries before size-based eviction', async () => {
    let callCount = 0

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createCachingMiddleware({
        getCacheKey: (input) => input,
        ttlMs: 50,
        maxSize: 2,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => {
        callCount++
        return `result-${callCount}`
      },
    })

    // Fill cache
    await pipeline.execute('key1')
    await pipeline.execute('key2')
    expect(callCount).toBe(2)

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 100))

    // This should evict expired entries
    await pipeline.execute('key3')
    expect(callCount).toBe(3)
  })

  it('should respect max size and evict oldest', async () => {
    let callCount = 0

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createCachingMiddleware({
        getCacheKey: (input) => input,
        ttlMs: 10000,
        maxSize: 2,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => {
        callCount++
        return `result-${callCount}`
      },
    })

    await pipeline.execute('key1') // callCount = 1
    await pipeline.execute('key2') // callCount = 2
    await pipeline.execute('key3') // callCount = 3, evicts key1

    // key1 should have been evicted, so this should call handler
    const result = await pipeline.execute('key1')
    expect(result).toBe('result-4') // New result
    expect(callCount).toBe(4)
  })
})

// ============================================
// Rate Limit Middleware Tests
// ============================================

describe('Rate Limit Middleware', () => {
  it('should enforce rate limits', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createRateLimitMiddleware({
        maxRequests: 2,
        windowMs: 1000,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => 'success',
    })

    // First two requests should succeed
    await expect(pipeline.execute('test')).resolves.toBe('success')
    await expect(pipeline.execute('test')).resolves.toBe('success')

    // Third request should fail
    await expect(pipeline.execute('test')).rejects.toThrow(
      'Rate limit exceeded'
    )
  })

  it('should reset after window expires', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createRateLimitMiddleware({
        maxRequests: 1,
        windowMs: 50,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => 'success',
    })

    await pipeline.execute('test')
    await expect(pipeline.execute('test')).rejects.toThrow(
      'Rate limit exceeded'
    )

    // Wait for window to reset
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(pipeline.execute('test')).resolves.toBe('success')
  })

  it('should call onRateLimited callback', async () => {
    const onRateLimited = vi.fn()

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createRateLimitMiddleware({
        maxRequests: 1,
        windowMs: 1000,
        onRateLimited,
      })
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => 'success',
    })

    await pipeline.execute('test')
    await expect(pipeline.execute('test')).rejects.toThrow()

    expect(onRateLimited).toHaveBeenCalledTimes(1)
  })
})

// ============================================
// Retry Middleware Tests
// ============================================

describe('Retry Middleware', () => {
  it('should create retry middleware with options', () => {
    const middleware = createRetryMiddleware({
      maxRetries: 3,
      delay: 100,
      backoffMultiplier: 2,
    })

    expect(middleware.name).toBe('retry')
    expect(middleware.priority).toBe(3)
    expect(middleware.handler).toBeDefined()
  })

  it('should create retry middleware with custom name', () => {
    const middleware = createRetryMiddleware({}, 'custom-retry')
    expect(middleware.name).toBe('custom-retry')
  })

  it('should have default options', () => {
    const middleware = createRetryMiddleware()
    expect(middleware.name).toBe('retry')
    expect(middleware.handler).toBeDefined()
  })
})

// ============================================
// Validation Middleware Tests
// ============================================

describe('Validation Middleware', () => {
  it('should pass valid input', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createValidationMiddleware((input) => input.length > 0))
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async (input) => input.toUpperCase(),
    })

    await expect(pipeline.execute('test')).resolves.toBe('TEST')
  })

  it('should reject invalid input', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(
      createValidationMiddleware(
        (input) => input.length > 0 || 'Input required'
      )
    )
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => 'success',
    })

    await expect(pipeline.execute('')).rejects.toThrow('Input required')
  })
})

// ============================================
// Error Handler Middleware Tests
// ============================================

describe('Error Handler Middleware', () => {
  it('should handle errors gracefully', async () => {
    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createErrorHandlerMiddleware(() => 'fallback'))
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => {
        throw new Error('Something went wrong')
      },
    })

    await expect(pipeline.execute('test')).resolves.toBe('fallback')
  })

  it('should pass error to handler', async () => {
    const errorHandler = vi.fn((error) => `Error: ${(error as Error).message}`)

    const pipeline = createMiddlewarePipeline<string, string>()
    pipeline.use(createErrorHandlerMiddleware(errorHandler))
    pipeline.use({
      name: 'handler',
      priority: 100,
      handler: async () => {
        throw new Error('Test error')
      },
    })

    const result = await pipeline.execute('test')
    expect(result).toBe('Error: Test error')
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    )
  })
})

// ============================================
// Middleware Context Tests
// ============================================

describe('Middleware Context', () => {
  it('should generate unique request IDs', () => {
    const ctx1 = createMiddlewareContext()
    const ctx2 = createMiddlewareContext()

    expect(ctx1.requestId).not.toBe(ctx2.requestId)
    expect(ctx1.requestId).toMatch(/^req_\d+_[a-z0-9]+$/)
  })

  it('should include timestamp', () => {
    const before = new Date()
    const ctx = createMiddlewareContext()
    const after = new Date()

    expect(ctx.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(ctx.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('should allow custom metadata', () => {
    const ctx = createMiddlewareContext({
      metadata: { userId: '123', region: 'us-east' },
    })

    expect(ctx.metadata).toEqual({ userId: '123', region: 'us-east' })
  })
})

// ============================================
// Pipeline Priority Tests
// ============================================

describe('Middleware Priority', () => {
  it('should execute middleware in priority order', async () => {
    const order: number[] = []

    const pipeline = createMiddlewarePipeline<string, string>()

    // Add in reverse order to test sorting
    pipeline.use({
      name: 'third',
      priority: 30,
      handler: async (input, ctx, next) => {
        order.push(30)
        return next()
      },
    })
    pipeline.use({
      name: 'first',
      priority: 10,
      handler: async (input, ctx, next) => {
        order.push(10)
        return next()
      },
    })
    pipeline.use({
      name: 'second',
      priority: 20,
      handler: async (input, ctx, next) => {
        order.push(20)
        return next()
      },
    })

    await pipeline.execute('test')

    expect(order).toEqual([10, 20, 30])
  })
})
