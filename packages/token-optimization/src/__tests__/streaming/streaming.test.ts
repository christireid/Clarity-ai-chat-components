/**
 * Streaming Optimization Tests
 */

import { describe, it, expect, vi } from 'vitest'
import {
  StreamingTokenCounter,
  StreamAdapter,
  createStreamingCounter,
  StreamingCostTracker,
  StreamingBudgetMonitor,
  CacheWarmer,
  createCacheWarmer,
} from '../../streaming'
import type { StreamingChunk } from '../../streaming'

describe('StreamingTokenCounter', () => {
  it('should count tokens incrementally', () => {
    const counter = new StreamingTokenCounter()

    const chunk1: StreamingChunk = {
      content: 'Hello',
      sequence: 0,
      cumulative: 'Hello',
      isFinal: false,
    }

    const stats1 = counter.processChunk(chunk1)
    expect(stats1.totalTokens).toBeGreaterThan(0)
    expect(stats1.chunkCount).toBe(1)

    const chunk2: StreamingChunk = {
      content: ' world',
      sequence: 1,
      cumulative: 'Hello world',
      isFinal: true,
    }

    const stats2 = counter.processChunk(chunk2)
    expect(stats2.totalTokens).toBeGreaterThan(stats1.totalTokens)
    expect(stats2.chunkCount).toBe(2)
  })

  it('should predict final tokens', () => {
    const counter = new StreamingTokenCounter({
      enablePrediction: true,
      predictionStrategy: 'average',
    })

    // Process several chunks
    for (let i = 0; i < 5; i++) {
      const chunk: StreamingChunk = {
        content: `chunk ${i} `,
        sequence: i,
        cumulative: `chunk 0 ${Array.from({ length: i }, (_, j) => `chunk ${j + 1}`).join(' ')}`,
        isFinal: false,
      }
      counter.processChunk(chunk)
    }

    const stats = counter.getStats(false)
    expect(stats.estimatedFinalTokens).toBeDefined()
    expect(stats.estimationConfidence).toBeGreaterThan(0)
  })

  it('should call onTokenUpdate callback', () => {
    const callback = vi.fn()
    const counter = new StreamingTokenCounter({
      onTokenUpdate: callback,
    })

    const chunk: StreamingChunk = {
      content: 'Test',
      sequence: 0,
      cumulative: 'Test',
      isFinal: false,
    }

    counter.processChunk(chunk)
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      totalTokens: expect.any(Number),
      chunkCount: 1,
    }))
  })

  it('should reset state', () => {
    const counter = new StreamingTokenCounter()

    counter.processChunk({
      content: 'Test',
      sequence: 0,
      cumulative: 'Test',
      isFinal: false,
    })

    expect(counter.getStats().totalTokens).toBeGreaterThan(0)

    counter.reset()

    expect(counter.getStats().totalTokens).toBe(0)
    expect(counter.getStats().chunkCount).toBe(0)
  })
})

describe('StreamAdapter', () => {
  it('should adapt OpenAI stream format', async () => {
    const mockStream = async function* () {
      yield { choices: [{ delta: { content: 'Hello' }, finish_reason: null }], model: 'gpt-4o' }
      yield { choices: [{ delta: { content: ' world' }, finish_reason: 'stop' }], model: 'gpt-4o' }
    }

    const chunks: StreamingChunk[] = []
    const adapted = StreamAdapter.openai(mockStream(), (chunk) => chunks.push(chunk))

    for await (const chunk of adapted) {
      expect(chunk.content).toBeTruthy()
      expect(chunk.cumulative).toBeTruthy()
    }

    expect(chunks).toHaveLength(2)
    expect(chunks[0].content).toBe('Hello')
    expect(chunks[1].isFinal).toBe(true)
  })

  it('should adapt Anthropic stream format', async () => {
    const mockStream = async function* () {
      yield { type: 'content_block_delta', delta: { text: 'Hello' }, index: 0 }
      yield { type: 'content_block_delta', delta: { text: ' world' }, index: 0 }
      yield { type: 'message_stop', stop_reason: 'end_turn' }
    }

    const chunks: StreamingChunk[] = []
    const adapted = StreamAdapter.anthropic(mockStream(), (chunk) => chunks.push(chunk))

    for await (const chunk of adapted) {
      // Process chunks
    }

    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks[chunks.length - 1].isFinal).toBe(true)
  })
})

describe('StreamingCostTracker', () => {
  const pricing = {
    model: 'gpt-4o',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
  }

  it('should track costs incrementally', () => {
    const tracker = new StreamingCostTracker({
      pricing,
      inputTokens: 100,
    })

    const tokenStats = {
      totalTokens: 50,
      chunkTokens: 50,
      chunkCount: 1,
      averageChunkTokens: 50,
    }

    const costStats = tracker.update(tokenStats)

    expect(costStats.inputTokens).toBe(100)
    expect(costStats.outputTokens).toBe(50)
    expect(costStats.inputCost).toBeGreaterThan(0)
    expect(costStats.outputCost).toBeGreaterThan(0)
    expect(costStats.totalCost).toBe(costStats.inputCost + costStats.outputCost)
  })

  it('should track timing metrics', () => {
    const tracker = new StreamingCostTracker({
      pricing,
      inputTokens: 100,
      enableTiming: true,
    })

    const tokenStats = {
      totalTokens: 100,
      chunkTokens: 100,
      chunkCount: 1,
      averageChunkTokens: 100,
    }

    const stats = tracker.update(tokenStats)

    expect(stats.tokensPerSecond).toBeDefined()
    expect(stats.tokensPerSecond).toBeGreaterThanOrEqual(0)
  })

  it('should estimate final cost', () => {
    const tracker = new StreamingCostTracker({
      pricing,
      inputTokens: 100,
    })

    const tokenStats = {
      totalTokens: 50,
      chunkTokens: 50,
      chunkCount: 1,
      averageChunkTokens: 50,
      estimatedFinalTokens: 200,
    }

    const stats = tracker.update(tokenStats)

    expect(stats.estimatedFinalOutputTokens).toBe(200)
    expect(stats.estimatedFinalCost).toBeGreaterThan(stats.totalCost)
  })
})

describe('StreamingBudgetMonitor', () => {
  it('should monitor budget', () => {
    const monitor = new StreamingBudgetMonitor({
      budgetLimit: 1.0,
    })

    const costStats = {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
      inputCost: 0.0001,
      outputCost: 0.0005,
      totalCost: 0.0006,
      costPerOutputToken: 0.00001,
    }

    const status = monitor.check(costStats)

    expect(status.withinBudget).toBe(true)
    expect(status.budgetRemaining).toBeCloseTo(0.9994, 4)
    expect(status.budgetUtilization).toBeLessThan(1)
    expect(status.shouldStop).toBe(false)
  })

  it('should trigger warning threshold', () => {
    const onWarning = vi.fn()
    const monitor = new StreamingBudgetMonitor({
      budgetLimit: 1.0,
      warningThreshold: 0.8,
      onWarning,
    })

    const costStats = {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
      inputCost: 0.4,
      outputCost: 0.5,
      totalCost: 0.9,
      costPerOutputToken: 0.01,
    }

    monitor.check(costStats)

    expect(onWarning).toHaveBeenCalledOnce()
  })

  it('should trigger budget exceeded', () => {
    const onExceeded = vi.fn()
    const monitor = new StreamingBudgetMonitor({
      budgetLimit: 1.0,
      onBudgetExceeded: onExceeded,
    })

    const costStats = {
      inputTokens: 100,
      outputTokens: 50,
      totalTokens: 150,
      inputCost: 0.5,
      outputCost: 0.6,
      totalCost: 1.1,
      costPerOutputToken: 0.012,
    }

    const status = monitor.check(costStats)

    expect(status.shouldStop).toBe(true)
    expect(onExceeded).toHaveBeenCalledOnce()
  })
})

describe('CacheWarmer', () => {
  it('should cache streaming chunks', () => {
    const { warmer, cacheStore } = createCacheWarmer('incremental')

    const chunk: StreamingChunk = {
      content: 'Hello world',
      sequence: 0,
      cumulative: 'Hello world',
      isFinal: true,
    }

    const result = warmer.processChunk('test prompt', chunk, 5)

    expect(result.cached).toBe(true)
    expect(result.key).toBeTruthy()
    expect(cacheStore.size).toBeGreaterThan(0)
  })

  it('should use threshold strategy', () => {
    const { warmer } = createCacheWarmer('threshold', {
      chunkThreshold: 5,
    })

    // First chunk (below threshold)
    const chunk1: StreamingChunk = {
      content: 'Hello',
      sequence: 0,
      cumulative: 'Hello',
      isFinal: false,
    }

    const result1 = warmer.processChunk('test', chunk1, 2)
    expect(result1.cached).toBe(false)

    // Sixth chunk (meets threshold)
    const chunk6: StreamingChunk = {
      content: 'test',
      sequence: 5,
      cumulative: 'Hello test test test test test',
      isFinal: false,
    }

    const result6 = warmer.processChunk('test', chunk6, 10)
    expect(result6.cached).toBe(true)
  })

  it('should retrieve cached entries', () => {
    const { warmer } = createCacheWarmer('complete')

    const chunk: StreamingChunk = {
      content: 'Response',
      sequence: 0,
      cumulative: 'Response',
      isFinal: true,
    }

    warmer.processChunk('prompt', chunk, 5)

    const cached = warmer.get('prompt')
    expect(cached).toBeDefined()
    expect(cached?.response).toBe('Response')
    expect(cached?.isComplete).toBe(true)
  })

  it('should get cache stats', () => {
    const { warmer } = createCacheWarmer('incremental')

    for (let i = 0; i < 5; i++) {
      const chunk: StreamingChunk = {
        content: `chunk ${i}`,
        sequence: i,
        cumulative: `chunk 0 ${Array.from({ length: i }, (_, j) => `chunk ${j + 1}`).join(' ')}`,
        isFinal: i === 4,
      }
      warmer.processChunk(`prompt-${i}`, chunk, i + 1)
    }

    const stats = warmer.getStats()

    expect(stats.totalEntries).toBe(5)
    expect(stats.completeEntries).toBe(1)
    expect(stats.incompleteEntries).toBe(4)
    expect(stats.averageTokens).toBeGreaterThan(0)
  })
})

describe('createStreamingCounter', () => {
  it('should create counter with OpenAI adapter', async () => {
    const { counter, adapt } = createStreamingCounter('openai')

    const mockStream = async function* () {
      yield { choices: [{ delta: { content: 'Test' }, finish_reason: null }], model: 'gpt-4o' }
    }

    for await (const chunk of adapt(mockStream())) {
      expect(chunk.content).toBe('Test')
    }

    expect(counter.getStats().chunkCount).toBeGreaterThan(0)
  })

  it('should create counter with prediction', () => {
    const { counter } = createStreamingCounter('openai', {
      enablePrediction: true,
    })

    for (let i = 0; i < 5; i++) {
      counter.processChunk({
        content: 'test ',
        sequence: i,
        cumulative: 'test '.repeat(i + 1),
        isFinal: false,
      })
    }

    const stats = counter.getStats(false)
    expect(stats.estimatedFinalTokens).toBeDefined()
  })
})
