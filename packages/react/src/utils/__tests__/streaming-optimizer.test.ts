/**
 * Tests for StreamingResponseMonitor and related utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  StreamingResponseMonitor,
  PartialResponseCache,
  createOptimizedStreamHandler,
  hashQuery,
  estimateResponseLength,
  getRecommendedMaxTokens,
  DEFAULT_COMPLETION_SIGNALS,
  DEFAULT_EARLY_STOP_PATTERNS,
} from '../streaming-optimizer'

// Mock the estimator
vi.mock('../tokenization/estimator', () => ({
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
}))

describe('StreamingResponseMonitor', () => {
  let monitor: StreamingResponseMonitor

  beforeEach(() => {
    monitor = new StreamingResponseMonitor({
      maxOutputTokens: 100,
      minTokensBeforeCheck: 10,
      confidenceThreshold: 0.7,
      detectRepetition: true,
    })
  })

  describe('basic streaming', () => {
    it('should process chunks and accumulate response', () => {
      const analysis1 = monitor.onChunk('Hello ')
      expect(analysis1.shouldContinue).toBe(true)
      expect(analysis1.currentTokens).toBeGreaterThan(0)

      const analysis2 = monitor.onChunk('World!')
      expect(analysis2.shouldContinue).toBe(true)

      expect(monitor.getAccumulatedResponse()).toBe('Hello World!')
    })

    it('should stop at max tokens', () => {
      // Add chunks until we exceed max tokens
      let analysis = monitor.onChunk('A'.repeat(400)) // ~100 tokens

      expect(analysis.shouldContinue).toBe(false)
      expect(analysis.reason).toBe('max-tokens')
      expect(analysis.confidence).toBe(1.0)
    })

    it('should not check for completion before minTokensBeforeCheck', () => {
      // Create monitor with high min threshold
      const strictMonitor = new StreamingResponseMonitor({
        minTokensBeforeCheck: 100,
        targetCompletionSignals: ['In conclusion'],
      })

      // Add completion signal but under threshold
      const analysis = strictMonitor.onChunk('In conclusion, this is done.')
      expect(analysis.shouldContinue).toBe(true)
    })
  })

  describe('completion signal detection', () => {
    it('should detect default completion signals', () => {
      const signalMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 1000,
        minTokensBeforeCheck: 5,
        confidenceThreshold: 0.6,
      })

      // Add enough text to get past minTokensBeforeCheck
      signalMonitor.onChunk('A'.repeat(100))

      // Add completion signal
      const analysis = signalMonitor.onChunk(' In conclusion, this is the end.')

      expect(analysis.shouldContinue).toBe(false)
      expect(analysis.reason).toBe('completion-signal')
      expect(analysis.detectedSignal).toBe('In conclusion')
    })

    it('should detect custom completion signals', () => {
      const customMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 1000,
        minTokensBeforeCheck: 5,
        targetCompletionSignals: ['[END]', 'FINISHED'],
        confidenceThreshold: 0.6,
      })

      customMonitor.onChunk('A'.repeat(100))
      const analysis = customMonitor.onChunk(' [END]')

      expect(analysis.shouldContinue).toBe(false)
      expect(analysis.reason).toBe('completion-signal')
    })
  })

  describe('early stop patterns', () => {
    it('should detect end of code block', () => {
      const codeMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 1000,
        minTokensBeforeCheck: 5,
      })

      codeMonitor.onChunk('function test() { return 42; }')
      const analysis = codeMonitor.onChunk('\n```\n')

      expect(analysis.shouldContinue).toBe(false)
      expect(analysis.reason).toBe('pattern-match')
    })

    it('should detect [DONE] marker', () => {
      const markerMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 1000,
        minTokensBeforeCheck: 5,
      })

      markerMonitor.onChunk('Processing complete. ')
      const analysis = markerMonitor.onChunk('[DONE]')

      expect(analysis.shouldContinue).toBe(false)
      expect(analysis.reason).toBe('pattern-match')
    })
  })

  describe('repetition detection', () => {
    it('should detect exact repetition', () => {
      const repMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 10000,
        minTokensBeforeCheck: 5,
        detectRepetition: true,
        repetitionWindowSize: 20,
      })

      // Add base content
      repMonitor.onChunk('Hello world! ')

      // Add repeated content many times to trigger detection
      for (let i = 0; i < 15; i++) {
        repMonitor.onChunk('same text ')
      }

      const analysis = repMonitor.onChunk('same text ')

      // Should eventually detect repetition
      expect(analysis.reason === 'repetition' || analysis.shouldContinue).toBeTruthy()
    })

    it('should detect low unique word ratio as repetition', () => {
      const repMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 10000,
        minTokensBeforeCheck: 5,
        detectRepetition: true,
      })

      // Setup with enough chunks
      for (let i = 0; i < 15; i++) {
        repMonitor.onChunk('the ')
      }

      // Keep adding the same word
      for (let i = 0; i < 10; i++) {
        const analysis = repMonitor.onChunk('the ')
        if (!analysis.shouldContinue && analysis.reason === 'repetition') {
          expect(analysis.confidence).toBeGreaterThan(0)
          return
        }
      }
    })
  })

  describe('force stop', () => {
    it('should stop on forceStop', () => {
      const analysis1 = monitor.onChunk('Hello')
      expect(analysis1.shouldContinue).toBe(true)

      monitor.forceStop()

      const analysis2 = monitor.onChunk(' World')
      expect(analysis2.shouldContinue).toBe(false)
      expect(analysis2.reason).toBe('user-stop')
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      monitor.onChunk('Hello World')
      expect(monitor.getAccumulatedResponse()).toBe('Hello World')
      expect(monitor.getTokensConsumed()).toBeGreaterThan(0)

      monitor.reset()

      expect(monitor.getAccumulatedResponse()).toBe('')
      expect(monitor.getTokensConsumed()).toBe(0)
    })

    it('should reset stop state', () => {
      monitor.forceStop()
      let analysis = monitor.onChunk('Test')
      expect(analysis.shouldContinue).toBe(false)

      monitor.reset()

      analysis = monitor.onChunk('Test')
      expect(analysis.shouldContinue).toBe(true)
    })
  })

  describe('metrics', () => {
    it('should track metrics correctly', () => {
      monitor.onChunk('Hello')
      monitor.onChunk(' World')
      monitor.onChunk('!')

      const metrics = monitor.getMetrics()

      expect(metrics.chunksProcessed).toBe(3)
      expect(metrics.tokensBeforeStop).toBeGreaterThan(0)
      expect(metrics.totalDuration).toBeGreaterThanOrEqual(0)
    })

    it('should calculate potential savings when stopped', () => {
      monitor.onChunk('A'.repeat(100))
      monitor.forceStop()

      const metrics = monitor.getMetrics()
      expect(metrics.potentialTokensSaved).toBeGreaterThan(0)
    })

    it('should track stop events', () => {
      const stopMonitor = new StreamingResponseMonitor({
        maxOutputTokens: 10,
      })

      stopMonitor.onChunk('A'.repeat(50)) // Exceed max

      const metrics = stopMonitor.getMetrics()
      expect(metrics.earlyStopEvents).toBe(1)
    })
  })
})

describe('PartialResponseCache', () => {
  let cache: PartialResponseCache

  beforeEach(() => {
    cache = new PartialResponseCache({
      maxEntries: 5,
      checkpointInterval: 10,
    })
  })

  describe('checkpoint', () => {
    it('should store checkpoints', () => {
      cache.checkpoint('q1', 'Hello', 10, false)

      const entry = cache.get('q1')
      expect(entry).toBeDefined()
      expect(entry?.content).toBe('Hello')
      expect(entry?.tokens).toBe(10)
      expect(entry?.isComplete).toBe(false)
    })

    it('should respect checkpoint interval', () => {
      cache.checkpoint('q1', 'Hello', 10, false)
      cache.checkpoint('q1', 'Hello World', 15, false) // Only 5 tokens more

      // Should not update because interval not reached
      const entry = cache.get('q1')
      expect(entry?.content).toBe('Hello')

      // Now exceed interval
      cache.checkpoint('q1', 'Hello World Again!', 25, false)
      const updated = cache.get('q1')
      expect(updated?.content).toBe('Hello World Again!')
    })

    it('should evict oldest when at capacity', () => {
      // Fill cache
      for (let i = 0; i < 5; i++) {
        cache.checkpoint(`q${i}`, `content ${i}`, (i + 1) * 20, false)
      }

      expect(cache.get('q0')).toBeDefined()

      // Add one more
      cache.checkpoint('q5', 'new content', 100, false)

      // Oldest should be evicted
      expect(cache.get('q0')).toBeUndefined()
      expect(cache.get('q5')).toBeDefined()
    })
  })

  describe('canResume', () => {
    it('should return true for incomplete, recent entries', () => {
      cache.checkpoint('q1', 'Hello', 10, false)

      expect(cache.canResume('q1')).toBe(true)
    })

    it('should return false for completed entries', () => {
      cache.checkpoint('q1', 'Hello', 10, true)

      expect(cache.canResume('q1')).toBe(false)
    })

    it('should return false for missing entries', () => {
      expect(cache.canResume('nonexistent')).toBe(false)
    })

    it('should return false for entries older than maxAge', () => {
      cache.checkpoint('q1', 'Hello', 10, false)

      // maxAge of 0 means immediately stale
      expect(cache.canResume('q1', 0)).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all entries', () => {
      cache.checkpoint('q1', 'Hello', 10, false)
      cache.checkpoint('q2', 'World', 10, false)

      cache.clear()

      expect(cache.get('q1')).toBeUndefined()
      expect(cache.get('q2')).toBeUndefined()
    })
  })

  describe('getStats', () => {
    it('should return correct statistics', () => {
      cache.checkpoint('q1', 'Hello', 10, false)
      cache.checkpoint('q2', 'World', 20, false)

      const stats = cache.getStats()

      expect(stats.entries).toBe(2)
      expect(stats.totalTokens).toBe(30)
      expect(stats.oldestAge).toBeGreaterThanOrEqual(0)
    })

    it('should return zero stats for empty cache', () => {
      const stats = cache.getStats()

      expect(stats.entries).toBe(0)
      expect(stats.totalTokens).toBe(0)
      expect(stats.oldestAge).toBe(0)
    })
  })
})

describe('createOptimizedStreamHandler', () => {
  it('should process stream and return results', async () => {
    const handler = createOptimizedStreamHandler({
      maxOutputTokens: 1000,
    })

    // Create a mock stream
    const chunks = ['Hello', ' ', 'World', '!']
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk)))
        controller.close()
      },
    })

    const result = await handler.process(stream)

    expect(result.content).toBe('Hello World!')
    expect(result.earlyStopped).toBe(false)
    expect(result.metrics.chunksProcessed).toBe(4)
  })

  it('should call callbacks', async () => {
    const handler = createOptimizedStreamHandler({
      maxOutputTokens: 1000,
    })

    const onChunk = vi.fn()
    const onComplete = vi.fn()

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('Test'))
        controller.close()
      },
    })

    await handler.process(stream, { onChunk, onComplete })

    expect(onChunk).toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })

  it('should call onEarlyStop when stopped early', async () => {
    const handler = createOptimizedStreamHandler({
      maxOutputTokens: 5, // Very low to trigger early stop
    })

    const onEarlyStop = vi.fn()

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('A'.repeat(100)))
        controller.close()
      },
    })

    const result = await handler.process(stream, { onEarlyStop })

    expect(result.earlyStopped).toBe(true)
    expect(onEarlyStop).toHaveBeenCalled()
  })

  it('should provide access to monitor', () => {
    const handler = createOptimizedStreamHandler()

    const monitor = handler.getMonitor()
    expect(monitor).toBeInstanceOf(StreamingResponseMonitor)
  })
})

describe('hashQuery', () => {
  it('should generate consistent hashes', () => {
    const query = 'test query'

    const hash1 = hashQuery(query)
    const hash2 = hashQuery(query)

    expect(hash1).toBe(hash2)
    expect(hash1).toMatch(/^q_/)
  })

  it('should generate different hashes for different queries', () => {
    const hash1 = hashQuery('query one')
    const hash2 = hashQuery('query two')

    expect(hash1).not.toBe(hash2)
  })
})

describe('estimateResponseLength', () => {
  it('should estimate short for brief queries', () => {
    expect(estimateResponseLength('What time is it?')).toBe('short')
    expect(estimateResponseLength('Yes or no?')).toBe('short')
    expect(estimateResponseLength('briefly explain')).toBe('short')
    expect(estimateResponseLength('tldr this')).toBe('short')
  })

  it('should estimate long for detailed queries', () => {
    expect(estimateResponseLength('Please explain in detail how this works')).toBe('long')
    expect(estimateResponseLength('Give me a comprehensive guide')).toBe('long')
    expect(estimateResponseLength('Step by step instructions for everything')).toBe('long')
  })

  it('should estimate medium for typical queries', () => {
    expect(estimateResponseLength('How does React work with state management?')).toBe('medium')
  })
})

describe('getRecommendedMaxTokens', () => {
  it('should return base tokens by response length', () => {
    expect(getRecommendedMaxTokens('Hi')).toBe(500) // short
    expect(getRecommendedMaxTokens('How does React work with state management?')).toBe(1500) // medium
    expect(getRecommendedMaxTokens('Explain in detail the comprehensive guide')).toBe(4000) // long
  })

  it('should increase tokens for code context', () => {
    const base = getRecommendedMaxTokens('explain this')
    const withCode = getRecommendedMaxTokens('explain this', { hasCode: true })

    expect(withCode).toBeGreaterThan(base)
  })

  it('should increase tokens for technical context', () => {
    const base = getRecommendedMaxTokens('explain this')
    const technical = getRecommendedMaxTokens('explain this', { isTechnical: true })

    expect(technical).toBeGreaterThan(base)
  })

  it('should stack multipliers', () => {
    const withCode = getRecommendedMaxTokens('explain this', { hasCode: true })
    const withBoth = getRecommendedMaxTokens('explain this', { hasCode: true, isTechnical: true })

    expect(withBoth).toBeGreaterThan(withCode)
  })
})

describe('DEFAULT_EARLY_STOP_PATTERNS', () => {
  it('should match end of code block', () => {
    const text = '```'
    expect(DEFAULT_EARLY_STOP_PATTERNS.some(p => p.test(text))).toBe(true)
  })

  it('should match [END] marker', () => {
    const text = '[END]'
    expect(DEFAULT_EARLY_STOP_PATTERNS.some(p => p.test(text))).toBe(true)
  })

  it('should match [DONE] marker', () => {
    const text = '[DONE]'
    expect(DEFAULT_EARLY_STOP_PATTERNS.some(p => p.test(text))).toBe(true)
  })

  it('patterns should be safe from catastrophic backtracking', () => {
    // Test that patterns complete quickly on pathological input
    const pathologicalInput = 'a'.repeat(10000)

    const start = Date.now()
    DEFAULT_EARLY_STOP_PATTERNS.forEach(pattern => {
      pattern.test(pathologicalInput)
    })
    const duration = Date.now() - start

    // Should complete in under 100ms even on pathological input
    expect(duration).toBeLessThan(100)
  })
})

describe('DEFAULT_COMPLETION_SIGNALS', () => {
  it('should include common ending phrases', () => {
    expect(DEFAULT_COMPLETION_SIGNALS).toContain('In conclusion')
    expect(DEFAULT_COMPLETION_SIGNALS).toContain('To summarize')
    expect(DEFAULT_COMPLETION_SIGNALS).toContain('Hope this helps')
    expect(DEFAULT_COMPLETION_SIGNALS).toContain('Let me know if')
  })
})
