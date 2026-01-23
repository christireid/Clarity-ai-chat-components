/**
 * Tool Performance Monitoring Tests
 *
 * Tests for performance tracking, metrics collection, and reporting
 *
 * @module utils/__tests__/tool-performance.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ToolPerformanceMonitor,
  formatPerformanceReport,
  compareReports,
} from '../tool-performance'
import { ToolOrchestrator } from '../../core/tool-orchestrator'
import type { ToolDefinition } from '../../../types/tool-definition'

// =============================================================================
// Test Tools
// =============================================================================

function createFastTool(duration: number = 10): ToolDefinition {
  return {
    name: 'fast_tool',
    description: 'Fast tool',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, duration))
      return { result: 'fast' }
    },
  }
}

function createSlowTool(duration: number = 100): ToolDefinition {
  return {
    name: 'slow_tool',
    description: 'Slow tool',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      await new Promise((resolve) => setTimeout(resolve, duration))
      return { result: 'slow' }
    },
  }
}

function createFailingTool(): ToolDefinition {
  return {
    name: 'failing_tool',
    description: 'Failing tool',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      throw new Error('Tool failed')
    },
  }
}

// =============================================================================
// Tests: ToolPerformanceMonitor
// =============================================================================

describe('ToolPerformanceMonitor', () => {
  let orchestrator: ToolOrchestrator

  beforeEach(() => {
    orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFastTool(10), createSlowTool(50), createFailingTool()],
    })
  })

  it('should track successful executions', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})

    const stats = monitor.getToolStats('fast_tool')

    expect(stats).toBeDefined()
    expect(stats!.count).toBe(2)
    expect(stats!.successCount).toBe(2)
    expect(stats!.failureCount).toBe(0)
    expect(stats!.avgDuration).toBeGreaterThan(0)
  })

  it('should track failed executions', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    try {
      await orchestrator.executeTool('failing_tool', {})
    } catch {
      // Expected to fail - we're testing error tracking
    }

    const stats = monitor.getToolStats('failing_tool')

    expect(stats).toBeDefined()
    expect(stats!.count).toBe(1)
    expect(stats!.successCount).toBe(0)
    expect(stats!.failureCount).toBe(1)
  })

  it('should calculate correct statistics', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: false,
      tools: [
        {
          name: 'test_tool',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
          handler: async ({ delay }) => {
            await new Promise((resolve) => setTimeout(resolve, delay || 10))
            return { result: 'ok' }
          },
        },
      ],
    })

    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    // Execute with different durations
    await orchestrator.executeTool('test_tool', { delay: 10 })
    await orchestrator.executeTool('test_tool', { delay: 20 })
    await orchestrator.executeTool('test_tool', { delay: 30 })

    const stats = monitor.getToolStats('test_tool')

    expect(stats).toBeDefined()
    expect(stats!.count).toBe(3)
    expect(stats!.minDuration).toBeGreaterThanOrEqual(10)
    expect(stats!.maxDuration).toBeGreaterThanOrEqual(30)
    expect(stats!.avgDuration).toBeGreaterThan(10)
    expect(stats!.avgDuration).toBeLessThan(40)
  })

  it('should detect slow queries', async () => {
    const onSlowQuery = vi.fn()

    const monitor = new ToolPerformanceMonitor(orchestrator, {
      slowQueryThreshold: 30,
      onSlowQuery,
    })

    monitor.start()

    await orchestrator.executeTool('slow_tool', {}) // Should trigger

    expect(onSlowQuery).toHaveBeenCalled()
    expect(onSlowQuery.mock.calls[0][0]).toHaveProperty('toolName', 'slow_tool')
  })

  it('should generate performance report', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('slow_tool', {})

    try {
      await orchestrator.executeTool('failing_tool', {})
    } catch {
      // Expected to fail - we're testing error tracking
    }

    const report = monitor.getReport()

    expect(report).toHaveProperty('timestamp')
    expect(report).toHaveProperty('totalMetrics')
    expect(report).toHaveProperty('timeRange')
    expect(report).toHaveProperty('byTool')
    expect(report).toHaveProperty('overall')

    expect(report.totalMetrics).toBe(3)
    expect(report.overall.totalExecutions).toBe(3)
    expect(report.overall.successfulExecutions).toBe(2)
    expect(report.overall.failedExecutions).toBe(1)

    expect(Object.keys(report.byTool)).toContain('fast_tool')
    expect(Object.keys(report.byTool)).toContain('slow_tool')
    expect(Object.keys(report.byTool)).toContain('failing_tool')
  })

  it('should identify slowest/fastest/most used tools', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('slow_tool', {})

    const report = monitor.getReport()

    expect(report.overall.slowestTool).toHaveProperty('name', 'slow_tool')
    expect(report.overall.fastestTool).toHaveProperty('name', 'fast_tool')
    expect(report.overall.mostUsedTool).toHaveProperty('name', 'fast_tool')
    expect(report.overall.mostUsedTool).toHaveProperty('count', 3)
  })

  it('should respect maxMetrics limit', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator, {
      maxMetrics: 2,
    })

    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})

    const report = monitor.getReport()

    expect(report.totalMetrics).toBe(2) // Should only keep last 2
  })

  it('should support sample rate', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator, {
      sampleRate: 0, // Sample none
    })

    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('fast_tool', {})

    const report = monitor.getReport()

    expect(report.totalMetrics).toBe(0)
  })

  it('should clear metrics', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})

    let report = monitor.getReport()
    expect(report.totalMetrics).toBe(1)

    monitor.clear()

    report = monitor.getReport()
    expect(report.totalMetrics).toBe(0)
  })

  it('should export metrics as JSON', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})

    const json = monitor.exportMetrics()
    const data = JSON.parse(json)

    expect(data).toHaveProperty('startTime')
    expect(data).toHaveProperty('metrics')
    expect(data.metrics).toHaveLength(1)
  })

  it('should get metrics for time range', async () => {
    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    const start = Date.now()

    await orchestrator.executeTool('fast_tool', {})
    await new Promise((resolve) => setTimeout(resolve, 100))

    const middle = Date.now()

    await orchestrator.executeTool('fast_tool', {})

    const end = Date.now()

    const allMetrics = monitor.getMetrics()
    expect(allMetrics).toHaveLength(2)

    const firstMetrics = monitor.getMetrics(start, middle)
    expect(firstMetrics).toHaveLength(1)

    const secondMetrics = monitor.getMetrics(middle, end)
    expect(secondMetrics).toHaveLength(1)
  })

  it('should calculate percentiles correctly', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: false,
      tools: [
        {
          name: 'test_tool',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
          handler: async ({ delay }) => {
            await new Promise((resolve) => setTimeout(resolve, delay))
            return { result: 'ok' }
          },
        },
      ],
    })

    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    // Create a distribution: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    for (let i = 1; i <= 10; i++) {
      await orchestrator.executeTool('test_tool', { delay: i * 10 })
    }

    const stats = monitor.getToolStats('test_tool')

    expect(stats).toBeDefined()
    expect(stats!.medianDuration).toBeGreaterThanOrEqual(50)
    expect(stats!.medianDuration).toBeLessThanOrEqual(60)
    expect(stats!.p95Duration).toBeGreaterThanOrEqual(90)
    expect(stats!.p99Duration).toBeGreaterThanOrEqual(95)
  })

  it('should track cache hits', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: true,
      tools: [createFastTool()],
    })

    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    // First call - not cached
    await orchestrator.executeTool('fast_tool', {})

    // Second call - cached
    await orchestrator.executeTool('fast_tool', {})

    const stats = monitor.getToolStats('fast_tool')

    expect(stats).toBeDefined()
    expect(stats!.count).toBe(2)
    expect(stats!.cacheHits).toBe(1)
    expect(stats!.cacheHitRate).toBe(0.5)
  })
})

// =============================================================================
// Tests: formatPerformanceReport
// =============================================================================

describe('formatPerformanceReport', () => {
  it('should format report as readable string', async () => {
    const orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createFastTool(), createSlowTool()],
    })

    const monitor = new ToolPerformanceMonitor(orchestrator)
    monitor.start()

    await orchestrator.executeTool('fast_tool', {})
    await orchestrator.executeTool('slow_tool', {})

    const report = monitor.getReport()
    const formatted = formatPerformanceReport(report)

    expect(formatted).toContain('TOOL PERFORMANCE REPORT')
    expect(formatted).toContain('OVERALL STATISTICS')
    expect(formatted).toContain('PER-TOOL STATISTICS')
    expect(formatted).toContain('fast_tool')
    expect(formatted).toContain('slow_tool')
    expect(formatted).toContain('Total Executions: 2')
  })
})

// =============================================================================
// Tests: compareReports
// =============================================================================

describe('compareReports', () => {
  it('should compare two reports', async () => {
    const orchestrator1 = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: false,
      tools: [createFastTool(10)],
    })

    const monitor1 = new ToolPerformanceMonitor(orchestrator1)
    monitor1.start()

    await orchestrator1.executeTool('fast_tool', {})

    const baseline = monitor1.getReport()

    // Create second orchestrator with slower tool
    const orchestrator2 = new ToolOrchestrator({
      autoApprove: true,
      enableCaching: false,
      tools: [createFastTool(20)],
    })

    const monitor2 = new ToolPerformanceMonitor(orchestrator2)
    monitor2.start()

    await orchestrator2.executeTool('fast_tool', {})

    const current = monitor2.getReport()

    const comparisons = compareReports(baseline, current)

    expect(comparisons).toHaveLength(1)
    expect(comparisons[0].toolName).toBe('fast_tool')
    expect(comparisons[0].currentDuration).toBeGreaterThan(
      comparisons[0].baselineDuration
    )
    expect(comparisons[0].change).toBeGreaterThan(0)
    expect(comparisons[0].changePercent).toBeGreaterThan(0)
  })
})
