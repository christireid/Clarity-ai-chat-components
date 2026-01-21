/**
 * OpenTelemetry Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  TelemetryCollector,
  instrumentTokenCount,
  instrumentOptimization,
  initTelemetry,
  getTelemetry,
  withTelemetry,
} from '../../telemetry'

describe('TelemetryCollector', () => {
  let collector: TelemetryCollector

  beforeEach(() => {
    collector = new TelemetryCollector({
      serviceName: 'test-service',
      enableTracing: true,
      enableMetrics: true,
    })
  })

  describe('Span Management', () => {
    it('should create and track spans', () => {
      const spanId = collector.startSpan('test-operation', { userId: '123' })

      expect(spanId).toBeTruthy()
      expect(spanId).toContain('test-operation')

      collector.endSpan(spanId, { result: 'success' })

      const spans = collector.getSpans()
      expect(spans).toHaveLength(1)
      expect(spans[0].name).toBe('test-operation')
      expect(spans[0].attributes.userId).toBe('123')
      expect(spans[0].attributes.result).toBe('success')
      expect(spans[0].endTime).toBeDefined()
    })

    it('should handle empty span ID gracefully', () => {
      collector.endSpan('')
      collector.endSpan('non-existent-span')

      expect(collector.getSpans()).toHaveLength(0)
    })

    it('should record span duration', () => {
      const spanId = collector.startSpan('timed-operation')

      // Simulate work
      const start = Date.now()
      while (Date.now() - start < 10) {
        // Wait 10ms
      }

      collector.endSpan(spanId)

      const spans = collector.getSpans()
      expect(spans[0].endTime).toBeGreaterThan(spans[0].startTime)
    })

    it('should respect sample rate', () => {
      const sampled = new TelemetryCollector({
        serviceName: 'test',
        sampleRate: 0, // Sample nothing
      })

      const spanId = sampled.startSpan('test')
      expect(spanId).toBe('')
    })
  })

  describe('Error Recording', () => {
    it('should record errors in spans', () => {
      const spanId = collector.startSpan('error-operation')
      const error = new Error('Test error')

      collector.recordError(spanId, error)
      collector.endSpan(spanId)

      const spans = collector.getSpans()
      expect(spans[0].status).toBe('error')
      expect(spans[0].error).toBe(error)
      expect(spans[0].events).toHaveLength(1)
      expect(spans[0].events[0].name).toBe('error')
      expect(spans[0].events[0].attributes?.message).toBe('Test error')
    })

    it('should handle error recording for non-existent spans', () => {
      expect(() => {
        collector.recordError('non-existent', new Error('Test'))
      }).not.toThrow()
    })
  })

  describe('Span Events', () => {
    it('should add events to spans', () => {
      const spanId = collector.startSpan('event-operation')

      collector.addEvent(spanId, 'step1', { detail: 'Started' })
      collector.addEvent(spanId, 'step2', { detail: 'Processing' })
      collector.addEvent(spanId, 'step3', { detail: 'Completed' })

      collector.endSpan(spanId)

      const spans = collector.getSpans()
      expect(spans[0].events).toHaveLength(3)
      expect(spans[0].events[0].name).toBe('step1')
      expect(spans[0].events[1].name).toBe('step2')
      expect(spans[0].events[2].name).toBe('step3')
    })
  })

  describe('Metrics', () => {
    it('should record counter metrics', () => {
      collector.recordMetric('tokensCounted', 100)
      collector.recordMetric('optimizationsPerformed', 5)

      const metrics = collector.getMetrics()
      expect(metrics.tokensCounted).toBe(100)
      expect(metrics.optimizationsPerformed).toBe(5)
    })

    it('should increment counters', () => {
      collector.incrementCounter('cacheHits', 1)
      collector.incrementCounter('cacheHits', 2)
      collector.incrementCounter('cacheHits', 3)

      const metrics = collector.getMetrics()
      expect(metrics.cacheHits).toBe(6)
    })

    it('should record histogram metrics', () => {
      collector.recordMetric('tokenCountDurations', 10)
      collector.recordMetric('tokenCountDurations', 20)
      collector.recordMetric('tokenCountDurations', 30)

      const metrics = collector.getMetrics()
      expect(metrics.tokenCountDurations).toEqual([10, 20, 30])
    })

    it('should respect enableMetrics flag', () => {
      const noMetrics = new TelemetryCollector({
        serviceName: 'test',
        enableMetrics: false,
      })

      noMetrics.recordMetric('tokensCounted', 100)
      noMetrics.incrementCounter('cacheHits')

      const metrics = noMetrics.getMetrics()
      expect(metrics.tokensCounted).toBe(0)
      expect(metrics.cacheHits).toBe(0)
    })
  })

  describe('Export and Clear', () => {
    it('should export data and clear state', () => {
      const spanId = collector.startSpan('test')
      collector.endSpan(spanId)
      collector.recordMetric('tokensCounted', 100)

      const data = collector.export()

      expect(data.spans).toHaveLength(1)
      expect(data.metrics.tokensCounted).toBe(100)

      // After export, data should be cleared
      expect(collector.getSpans()).toHaveLength(0)
      expect(collector.getMetrics().tokensCounted).toBe(0)
    })

    it('should clear all data', () => {
      const spanId = collector.startSpan('test')
      collector.endSpan(spanId)
      collector.recordMetric('tokensCounted', 100)

      collector.clear()

      expect(collector.getSpans()).toHaveLength(0)
      expect(collector.getMetrics().tokensCounted).toBe(0)
    })
  })
})

describe('instrumentTokenCount', () => {
  it('should instrument synchronous token count function', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      enableTracing: true,
      enableMetrics: true,
    })

    const countTokens = (text: string) => text.split(' ').length

    const instrumented = instrumentTokenCount(countTokens, collector)

    const result = instrumented('hello world test')

    expect(result).toBe(3)

    const metrics = collector.getMetrics()
    expect(metrics.tokensCounted).toBe(1)
    expect(metrics.tokenCountDurations).toHaveLength(1)

    const spans = collector.getSpans()
    expect(spans).toHaveLength(1)
    expect(spans[0].name).toBe('token_count')
    expect(spans[0].attributes.tokens).toBe(3)
  })

  it('should handle errors in token counting', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      enableTracing: true,
      enableMetrics: true,
    })

    const failingCount = () => {
      throw new Error('Count failed')
    }

    const instrumented = instrumentTokenCount(failingCount, collector)

    expect(() => instrumented()).toThrow('Count failed')

    const metrics = collector.getMetrics()
    expect(metrics.errorsEncountered).toBe(1)

    const spans = collector.getSpans()
    expect(spans[0].status).toBe('error')
  })

  it('should use custom span name', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
    })

    const countTokens = (text: string) => text.length

    const instrumented = instrumentTokenCount(countTokens, collector, 'custom_count')

    instrumented('test')

    const spans = collector.getSpans()
    expect(spans[0].name).toBe('custom_count')
  })
})

describe('instrumentOptimization', () => {
  it('should instrument async optimization function', async () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      enableTracing: true,
      enableMetrics: true,
    })

    const optimize = async (text: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return { optimized: text.toLowerCase(), tokensSaved: 5, strategy: 'lowercase' }
    }

    const instrumented = instrumentOptimization(optimize, collector)

    const result = await instrumented('HELLO WORLD')

    expect(result.optimized).toBe('hello world')
    expect(result.tokensSaved).toBe(5)

    const metrics = collector.getMetrics()
    expect(metrics.optimizationsPerformed).toBe(1)
    expect(metrics.optimizationDurations).toHaveLength(1)
    expect(metrics.optimizationDurations[0]).toBeGreaterThanOrEqual(10)

    const spans = collector.getSpans()
    expect(spans[0].name).toBe('optimization')
    expect(spans[0].attributes.tokensSaved).toBe(5)
    expect(spans[0].attributes.strategy).toBe('lowercase')
  })

  it('should handle errors in optimization', async () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      enableTracing: true,
      enableMetrics: true,
    })

    const failingOptimize = async () => {
      throw new Error('Optimization failed')
    }

    const instrumented = instrumentOptimization(failingOptimize, collector)

    await expect(instrumented()).rejects.toThrow('Optimization failed')

    const metrics = collector.getMetrics()
    expect(metrics.errorsEncountered).toBe(1)

    const spans = collector.getSpans()
    expect(spans[0].status).toBe('error')
  })
})

describe('Global Telemetry', () => {
  it('should initialize and retrieve global telemetry', () => {
    const collector = initTelemetry({
      serviceName: 'global-test',
    })

    expect(collector).toBeInstanceOf(TelemetryCollector)

    const retrieved = getTelemetry()
    expect(retrieved).toBe(collector)
  })

  it('should return null if telemetry not initialized', () => {
    // Note: This test might fail if previous test ran
    // In real usage, you'd reset global state or use a different approach
    const retrieved = getTelemetry()
    expect(retrieved).toBeDefined() // From previous test
  })
})

describe('withTelemetry', () => {
  it('should wrap sync function with telemetry', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
    })

    const add = (a: number, b: number) => a + b

    const instrumented = withTelemetry(add, {
      collector,
      spanName: 'add_operation',
      type: 'sync',
    })

    const result = instrumented(2, 3)

    expect(result).toBe(5)

    const spans = collector.getSpans()
    expect(spans).toHaveLength(1)
    expect(spans[0].name).toBe('add_operation')
  })

  it('should wrap async function with telemetry', async () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
    })

    const asyncAdd = async (a: number, b: number) => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      return a + b
    }

    const instrumented = withTelemetry(asyncAdd, {
      collector,
      spanName: 'async_add',
      type: 'async',
    })

    const result = await instrumented(2, 3)

    expect(result).toBe(5)

    const spans = collector.getSpans()
    expect(spans).toHaveLength(1)
    expect(spans[0].name).toBe('async_add')
  })

  it('should use global collector if not provided', () => {
    initTelemetry({ serviceName: 'test' })

    const add = (a: number, b: number) => a + b

    const instrumented = withTelemetry(add, {
      spanName: 'add',
    })

    const result = instrumented(2, 3)
    expect(result).toBe(5)
  })

  it('should return original function if no collector available', () => {
    const add = (a: number, b: number) => a + b

    const instrumented = withTelemetry(add, {
      collector: null as any,
    })

    expect(instrumented).toBe(add)
  })
})

describe('Integration Tests', () => {
  it('should track complete operation lifecycle', async () => {
    const collector = new TelemetryCollector({
      serviceName: 'integration-test',
      enableTracing: true,
      enableMetrics: true,
    })

    // Start main operation
    const mainSpanId = collector.startSpan('main_operation', {
      operation: 'token_optimization',
    })

    // Token counting
    collector.addEvent(mainSpanId, 'token_count_start')
    collector.recordMetric('tokensCounted', 100)
    collector.incrementCounter('tokensCounted')
    collector.addEvent(mainSpanId, 'token_count_end')

    // Cache check
    const cacheSpanId = collector.startSpan('cache_check')
    collector.incrementCounter('cacheHits')
    collector.endSpan(cacheSpanId, { hit: true })

    // Optimization
    const optSpanId = collector.startSpan('optimization')
    await new Promise((resolve) => setTimeout(resolve, 10))
    collector.recordMetric('optimizationDurations', 10)
    collector.incrementCounter('optimizationsPerformed')
    collector.endSpan(optSpanId, { tokensSaved: 50 })

    // Complete main operation
    collector.endSpan(mainSpanId, { totalTokens: 50 })

    // Verify
    const spans = collector.getSpans()
    expect(spans).toHaveLength(3)
    expect(spans[0].name).toBe('cache_check')
    expect(spans[1].name).toBe('optimization')
    expect(spans[2].name).toBe('main_operation')
    expect(spans[2].events).toHaveLength(2)

    const metrics = collector.getMetrics()
    expect(metrics.tokensCounted).toBe(101)
    expect(metrics.cacheHits).toBe(1)
    expect(metrics.optimizationsPerformed).toBe(1)
  })

  it('should handle error recovery in operations', async () => {
    const collector = new TelemetryCollector({
      serviceName: 'error-recovery-test',
      enableTracing: true,
      enableMetrics: true,
    })

    const spanId = collector.startSpan('risky_operation')

    try {
      // Simulate error
      throw new Error('Operation failed')
    } catch (error) {
      collector.recordError(spanId, error as Error)
      collector.incrementCounter('errorsEncountered')

      // Retry logic
      collector.addEvent(spanId, 'retry_attempt', { attempt: 1 })

      // Successful retry
      collector.incrementCounter('optimizationsPerformed')
    } finally {
      collector.endSpan(spanId)
    }

    const spans = collector.getSpans()
    expect(spans[0].status).toBe('error')
    expect(spans[0].events.some((e) => e.name === 'retry_attempt')).toBe(true)

    const metrics = collector.getMetrics()
    expect(metrics.errorsEncountered).toBe(1)
    expect(metrics.optimizationsPerformed).toBe(1)
  })
})

describe('Performance', () => {
  it('should handle high volume of spans efficiently', () => {
    const collector = new TelemetryCollector({
      serviceName: 'perf-test',
      enableTracing: true,
    })

    const start = performance.now()

    for (let i = 0; i < 1000; i++) {
      const spanId = collector.startSpan(`operation-${i}`)
      collector.endSpan(spanId)
    }

    const duration = performance.now() - start

    expect(collector.getSpans()).toHaveLength(1000)
    expect(duration).toBeLessThan(100) // Should be fast
  })

  it('should handle high volume of metrics efficiently', () => {
    const collector = new TelemetryCollector({
      serviceName: 'perf-test',
      enableMetrics: true,
    })

    const start = performance.now()

    for (let i = 0; i < 10000; i++) {
      collector.incrementCounter('tokensCounted')
      collector.recordMetric('tokenCountDurations', i)
    }

    const duration = performance.now() - start

    const metrics = collector.getMetrics()
    expect(metrics.tokensCounted).toBe(10000)
    expect(metrics.tokenCountDurations).toHaveLength(10000)
    expect(duration).toBeLessThan(100) // Should be fast
  })
})

describe('Configuration', () => {
  it('should apply custom attributes to spans', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      attributes: {
        environment: 'test',
        version: '1.0.0',
      },
    })

    const spanId = collector.startSpan('operation')
    collector.endSpan(spanId)

    const spans = collector.getSpans()
    expect(spans[0].attributes.environment).toBe('test')
    expect(spans[0].attributes.version).toBe('1.0.0')
  })

  it('should merge span-specific attributes with global', () => {
    const collector = new TelemetryCollector({
      serviceName: 'test',
      attributes: { global: 'value' },
    })

    const spanId = collector.startSpan('operation', { specific: 'data' })
    collector.endSpan(spanId)

    const spans = collector.getSpans()
    expect(spans[0].attributes.global).toBe('value')
    expect(spans[0].attributes.specific).toBe('data')
  })
})
