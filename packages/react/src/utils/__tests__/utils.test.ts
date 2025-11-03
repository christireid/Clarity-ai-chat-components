import { describe, it, expect, beforeEach, vi } from 'vitest'
import { withModelFallback, ModelFallbackManager } from '../model-fallback'
import {
  ContextWindowManager,
  FIFOTruncation,
  SmartTruncation,
  estimateTokens,
} from '../context-window'
import {
  MemoryRateLimitStorage,
  TokenBucketRateLimiter,
  SlidingWindowRateLimiter,
} from '../rate-limiting'
import { HybridSearch, SimpleBM25Searcher } from '../hybrid-search'

describe('Model Fallback', () => {
  describe('withModelFallback', () => {
    it('should succeed on first try', async () => {
      const fn = vi.fn().mockResolvedValue('success')

      const result = await withModelFallback(fn, {
        models: [{ provider: 'openai', model: 'gpt-4', priority: 1 }],
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should fallback on error', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Provider 1 error'))
        .mockResolvedValueOnce('success')

      const result = await withModelFallback(fn, {
        models: [
          {
            provider: 'provider1',
            model: 'model1',
            priority: 1,
            maxRetries: 1,
          },
          { provider: 'provider2', model: 'model2', priority: 2 },
        ],
      })

      expect(result.success).toBe(true)
      expect(result.data).toBe('success')
      expect(result.model.provider).toBe('provider2')
    })

    it('should retry with exponential backoff', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockRejectedValueOnce(new Error('Error 2'))
        .mockResolvedValueOnce('success')

      const result = await withModelFallback(fn, {
        models: [
          { provider: 'test', model: 'test', priority: 1, maxRetries: 3 },
        ],
        exponentialBackoff: true,
        retryDelay: 10,
      })

      expect(result.success).toBe(true)
      expect(fn).toHaveBeenCalledTimes(3)
    })
  })

  describe('ModelFallbackManager', () => {
    it('should track current model', () => {
      const manager = new ModelFallbackManager([
        { provider: 'p1', model: 'm1', priority: 1 },
        { provider: 'p2', model: 'm2', priority: 2 },
      ])

      expect(manager.getCurrentModel().provider).toBe('p1')
    })

    it('should move to next model', () => {
      const manager = new ModelFallbackManager([
        { provider: 'p1', model: 'm1', priority: 1 },
        { provider: 'p2', model: 'm2', priority: 2 },
      ])

      const next = manager.getNextModel()
      expect(next?.provider).toBe('p2')
      expect(manager.getCurrentModel().provider).toBe('p2')
    })

    it('should track attempts', () => {
      const manager = new ModelFallbackManager([
        { provider: 'p1', model: 'm1', priority: 1, maxRetries: 3 },
      ])

      const model = manager.getCurrentModel()
      manager.recordAttempt(new Error('test'))
      manager.recordAttempt(new Error('test'))

      expect(manager.getAttemptCount(model)).toBe(2)
      expect(manager.shouldRetry()).toBe(true)
    })
  })
})

describe('Context Window Management', () => {
  const countTokens = (text: string) => estimateTokens(text)

  describe('FIFOTruncation', () => {
    it('should keep most recent messages', () => {
      const strategy = new FIFOTruncation()
      const messages = [
        { role: 'user' as const, content: 'A'.repeat(100) },
        { role: 'assistant' as const, content: 'B'.repeat(100) },
        { role: 'user' as const, content: 'C'.repeat(100) },
        { role: 'assistant' as const, content: 'D'.repeat(100) },
      ]

      const truncated = strategy.truncate(messages, {
        maxTokens: 100,
        countTokens,
      })

      expect(truncated.length).toBeLessThan(messages.length)
      expect(truncated[truncated.length - 1].content).toContain('D')
    })

    it('should preserve system message', () => {
      const strategy = new FIFOTruncation()
      const messages = [
        { role: 'system' as const, content: 'System prompt' },
        { role: 'user' as const, content: 'A'.repeat(1000) },
        { role: 'user' as const, content: 'B'.repeat(1000) },
      ]

      const truncated = strategy.truncate(messages, {
        maxTokens: 500,
        countTokens,
        keepSystemMessage: true,
      })

      expect(truncated[0].role).toBe('system')
    })
  })

  describe('ContextWindowManager', () => {
    it('should truncate messages to fit window', () => {
      const manager = new ContextWindowManager('fifo', {
        maxTokens: 1000,
        reservedTokens: 200,
        countTokens,
      })

      const messages = Array.from({ length: 10 }, (_, i) => ({
        role: 'user' as const,
        content: 'A'.repeat(200),
      }))

      const truncated = manager.truncate(messages)
      const totalTokens = manager.countTokens(truncated as any)

      expect(totalTokens).toBeLessThanOrEqual(800)
    })

    it('should calculate remaining tokens', () => {
      const manager = new ContextWindowManager('fifo', {
        maxTokens: 1000,
        reservedTokens: 200,
        countTokens,
      })

      const messages = [{ role: 'user' as const, content: 'A'.repeat(400) }]

      const remaining = manager.getRemainingTokens(messages)
      expect(remaining).toBeGreaterThan(0)
    })
  })
})

describe('Rate Limiting', () => {
  describe('MemoryRateLimitStorage', () => {
    let storage: MemoryRateLimitStorage

    beforeEach(() => {
      storage = new MemoryRateLimitStorage()
    })

    it('should increment counter', async () => {
      const count1 = await storage.increment('user1', 60000)
      const count2 = await storage.increment('user1', 60000)

      expect(count1).toBe(1)
      expect(count2).toBe(2)
    })

    it('should reset after TTL', async () => {
      await storage.increment('user1', 100)
      await new Promise((resolve) => setTimeout(resolve, 150))

      const count = await storage.get('user1')
      expect(count).toBe(0)
    })

    it('should reset counter', async () => {
      await storage.increment('user1', 60000)
      await storage.reset('user1')

      const count = await storage.get('user1')
      expect(count).toBe(0)
    })
  })

  describe('TokenBucketRateLimiter', () => {
    it('should allow requests within limit', async () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 3,
        windowMs: 60000,
        storage: new MemoryRateLimitStorage(),
      })

      const result1 = await limiter.checkLimit('user1')
      const result2 = await limiter.checkLimit('user1')
      const result3 = await limiter.checkLimit('user1')

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('should reject requests over limit', async () => {
      const limiter = new TokenBucketRateLimiter({
        maxRequests: 2,
        windowMs: 60000,
        storage: new MemoryRateLimitStorage(),
      })

      await limiter.checkLimit('user1')
      await limiter.checkLimit('user1')
      const result3 = await limiter.checkLimit('user1')

      expect(result3.allowed).toBe(false)
      expect(result3.retryAfter).toBeDefined()
    })
  })

  describe('SlidingWindowRateLimiter', () => {
    it('should track requests in sliding window', async () => {
      const limiter = new SlidingWindowRateLimiter({
        maxRequests: 2,
        windowMs: 1000,
        storage: new MemoryRateLimitStorage(),
      })

      const result1 = await limiter.checkLimit('user1')
      const result2 = await limiter.checkLimit('user1')
      const result3 = await limiter.checkLimit('user1')

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
    })
  })
})

describe('Hybrid Search', () => {
  describe('SimpleBM25Searcher', () => {
    it('should search documents', () => {
      const docs = [
        { id: '1', content: 'machine learning algorithms' },
        { id: '2', content: 'deep learning neural networks' },
        { id: '3', content: 'natural language processing' },
      ]

      const searcher = new SimpleBM25Searcher(docs)
      const results = searcher.search('machine learning', 2)

      expect(results).toHaveLength(2)
      expect(results[0].id).toBe('1')
    })

    it('should rank by relevance', () => {
      const docs = [
        { id: '1', content: 'cat dog' },
        { id: '2', content: 'cat cat cat' },
        { id: '3', content: 'dog bird' },
      ]

      const searcher = new SimpleBM25Searcher(docs)
      const results = searcher.search('cat', 3)

      expect(results[0].id).toBe('2') // Most mentions of 'cat'
    })
  })

  describe('HybridSearch', () => {
    it('should combine keyword and vector search', async () => {
      const docs = [
        { id: '1', content: 'machine learning' },
        { id: '2', content: 'deep learning' },
      ]

      const keywordSearcher = new SimpleBM25Searcher(docs)
      const vectorSearcher = {
        async search(query: string, topK: number) {
          return [
            { id: '2', score: 0.9, content: 'deep learning' },
            { id: '1', score: 0.7, content: 'machine learning' },
          ]
        },
      }

      const hybrid = new HybridSearch({
        keywordSearcher,
        vectorSearcher,
        fusionMethod: 'rrf',
      })

      const results = await hybrid.search('machine learning', 2)

      expect(results).toHaveLength(2)
      expect(results[0].id).toBeDefined()
    })
  })
})
