import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PerformanceMonitor, measurePerformance } from '../performance.js'

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    PerformanceMonitor.clear()
  })

  it('should track synchronous function execution', () => {
    const result = PerformanceMonitor.track('test-sync', () => {
      return 1 + 1
    })
    expect(result).toBe(2)
    
    const metrics = PerformanceMonitor.getMetrics()
    expect(metrics.operationCount).toBe(1)
    const op = metrics.operations.get('test-sync')
    expect(op).toBeDefined()
    expect(op?.count).toBe(1)
  })

  it('should track asynchronous function execution', async () => {
    const result = await PerformanceMonitor.trackAsync('test-async', async () => {
      return Promise.resolve('success')
    })
    expect(result).toBe('success')
    
    const metrics = PerformanceMonitor.getMetrics()
    expect(metrics.operationCount).toBe(1)
    const op = metrics.operations.get('test-async')
    expect(op).toBeDefined()
  })

  it('should manual time operations', () => {
    PerformanceMonitor.time('manual-test')
    PerformanceMonitor.timeEnd('manual-test')
    
    const metrics = PerformanceMonitor.getMetrics()
    expect(metrics.operationCount).toBe(1)
    expect(metrics.operations.has('manual-test')).toBe(true)
  })

  it('should aggregate metrics', () => {
    PerformanceMonitor.track('op', () => {})
    PerformanceMonitor.track('op', () => {})
    
    const op = PerformanceMonitor.getOperationMetrics('op')
    expect(op?.count).toBe(2)
  })
})
