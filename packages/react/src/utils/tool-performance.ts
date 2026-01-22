/**
 * Tool Performance Monitoring
 *
 * Utilities for tracking and analyzing tool execution performance:
 * - Execution time tracking
 * - Performance metrics collection
 * - Slow query detection
 * - Performance reports and analytics
 *
 * @module utils/tool-performance
 */

import type { ToolOrchestrator } from '../core/tool-orchestrator'

// =============================================================================
// Types
// =============================================================================

export interface PerformanceMetric {
  /** Tool name */
  toolName: string
  /** Execution duration in ms */
  duration: number
  /** Whether result was cached */
  cached: boolean
  /** Timestamp when execution started */
  timestamp: number
  /** Execution status */
  status: 'completed' | 'failed' | 'timeout' | 'cancelled'
  /** Error message if failed */
  error?: string
}

export interface PerformanceStats {
  /** Tool name */
  toolName: string
  /** Total executions */
  count: number
  /** Successful executions */
  successCount: number
  /** Failed executions */
  failureCount: number
  /** Cache hits */
  cacheHits: number
  /** Average duration (ms) */
  avgDuration: number
  /** Minimum duration (ms) */
  minDuration: number
  /** Maximum duration (ms) */
  maxDuration: number
  /** Median duration (ms) */
  medianDuration: number
  /** 95th percentile duration (ms) */
  p95Duration: number
  /** 99th percentile duration (ms) */
  p99Duration: number
  /** Success rate (0-1) */
  successRate: number
  /** Cache hit rate (0-1) */
  cacheHitRate: number
}

export interface PerformanceReport {
  /** Report generation timestamp */
  timestamp: number
  /** Total metrics collected */
  totalMetrics: number
  /** Time range of report (ms) */
  timeRange: {
    start: number
    end: number
    duration: number
  }
  /** Stats per tool */
  byTool: Record<string, PerformanceStats>
  /** Overall stats */
  overall: {
    totalExecutions: number
    successfulExecutions: number
    failedExecutions: number
    avgDuration: number
    slowestTool: { name: string; avgDuration: number } | null
    fastestTool: { name: string; avgDuration: number } | null
    mostUsedTool: { name: string; count: number } | null
  }
  /** Slow queries (> threshold) */
  slowQueries: Array<{
    toolName: string
    duration: number
    timestamp: number
  }>
}

export interface MonitorOptions {
  /** Enable monitoring (default: true) */
  enabled?: boolean
  /** Slow query threshold in ms (default: 5000) */
  slowQueryThreshold?: number
  /** Max metrics to store (default: 1000) */
  maxMetrics?: number
  /** Sample rate (0-1, default: 1 = all) */
  sampleRate?: number
  /** Callback for slow queries */
  onSlowQuery?: (metric: PerformanceMetric) => void
  /** Callback for errors */
  onError?: (metric: PerformanceMetric) => void
}

// =============================================================================
// Performance Monitor
// =============================================================================

/**
 * Performance monitoring for tool executions
 *
 * Tracks execution times, success rates, cache hits, and identifies
 * performance issues.
 *
 * @example
 * ```typescript
 * const monitor = new ToolPerformanceMonitor(orchestrator, {
 *   slowQueryThreshold: 3000,
 *   onSlowQuery: (metric) => {
 *     console.warn(`Slow query: ${metric.toolName} took ${metric.duration}ms`)
 *   }
 * })
 *
 * monitor.start()
 *
 * // ... execute tools ...
 *
 * const report = monitor.getReport()
 * console.log('Performance Report:', report)
 * ```
 */
export class ToolPerformanceMonitor {
  private orchestrator: ToolOrchestrator
  private options: Required<MonitorOptions>
  private metrics: PerformanceMetric[] = []
  private startTime: number = Date.now()
  private isMonitoring: boolean = false

  constructor(orchestrator: ToolOrchestrator, options: MonitorOptions = {}) {
    this.orchestrator = orchestrator
    this.options = {
      enabled: options.enabled ?? true,
      slowQueryThreshold: options.slowQueryThreshold ?? 5000,
      maxMetrics: options.maxMetrics ?? 1000,
      sampleRate: options.sampleRate ?? 1.0,
      onSlowQuery: options.onSlowQuery ?? (() => {}),
      onError: options.onError ?? (() => {}),
    }
  }

  /**
   * Start monitoring tool executions
   */
  start(): void {
    if (this.isMonitoring || !this.options.enabled) return

    this.isMonitoring = true
    this.startTime = Date.now()

    // Listen to lifecycle events
    this.orchestrator.lifecycle.on('tool_completed', (event) => {
      this.recordMetric({
        toolName: event.call.toolName,
        duration: event.call.duration || 0,
        cached: event.call.cached || false,
        timestamp: event.call.startedAt || Date.now(),
        status: 'completed',
      })
    })

    this.orchestrator.lifecycle.on('tool_failed', (event) => {
      const metric: PerformanceMetric = {
        toolName: event.call.toolName,
        duration: event.call.duration || 0,
        cached: false,
        timestamp: event.call.startedAt || Date.now(),
        status: 'failed',
        error: event.error.message,
      }

      this.recordMetric(metric)
      this.options.onError(metric)
    })

    this.orchestrator.lifecycle.on('tool_timeout', (event) => {
      const metric: PerformanceMetric = {
        toolName: event.call.toolName,
        duration: event.call.duration || 0,
        cached: false,
        timestamp: event.call.startedAt || Date.now(),
        status: 'timeout',
        error: 'Execution timeout',
      }

      this.recordMetric(metric)
      this.options.onSlowQuery(metric)
    })

    this.orchestrator.lifecycle.on('tool_cancelled', (event) => {
      this.recordMetric({
        toolName: event.call.toolName,
        duration: event.call.duration || 0,
        cached: false,
        timestamp: event.call.startedAt || Date.now(),
        status: 'cancelled',
      })
    })
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.isMonitoring = false
    // Note: We don't remove event listeners as they're cheap and
    // removing them would require tracking handler references
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    // Sample rate check
    if (Math.random() > this.options.sampleRate) return

    // Add to metrics
    this.metrics.push(metric)

    // Check for slow query
    if (metric.duration > this.options.slowQueryThreshold) {
      this.options.onSlowQuery(metric)
    }

    // Trim metrics if over limit
    if (this.metrics.length > this.options.maxMetrics) {
      this.metrics.shift() // Remove oldest
    }
  }

  /**
   * Get statistics for a specific tool
   */
  getToolStats(toolName: string): PerformanceStats | null {
    const toolMetrics = this.metrics.filter((m) => m.toolName === toolName)

    if (toolMetrics.length === 0) return null

    return this.calculateStats(toolName, toolMetrics)
  }

  /**
   * Get statistics for all tools
   */
  getAllStats(): Record<string, PerformanceStats> {
    const statsByTool: Record<string, PerformanceStats> = {}

    // Group metrics by tool
    const metricsByTool = this.metrics.reduce(
      (acc, metric) => {
        if (!acc[metric.toolName]) acc[metric.toolName] = []
        acc[metric.toolName].push(metric)
        return acc
      },
      {} as Record<string, PerformanceMetric[]>
    )

    // Calculate stats for each tool
    for (const [toolName, metrics] of Object.entries(metricsByTool)) {
      statsByTool[toolName] = this.calculateStats(toolName, metrics)
    }

    return statsByTool
  }

  /**
   * Generate comprehensive performance report
   */
  getReport(): PerformanceReport {
    const byTool = this.getAllStats()
    const now = Date.now()

    // Calculate overall stats
    const totalExecutions = this.metrics.length
    const successfulExecutions = this.metrics.filter((m) => m.status === 'completed').length
    const failedExecutions = totalExecutions - successfulExecutions

    const avgDuration =
      totalExecutions > 0
        ? this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalExecutions
        : 0

    // Find slowest/fastest/most used tools
    const toolStats = Object.entries(byTool)
    const slowestTool =
      toolStats.length > 0
        ? toolStats.reduce((slowest, [name, stats]) =>
            stats.avgDuration > (slowest?.avgDuration ?? 0)
              ? { name, avgDuration: stats.avgDuration }
              : slowest
          )
        : null

    const fastestTool =
      toolStats.length > 0
        ? toolStats.reduce((fastest, [name, stats]) =>
            stats.avgDuration < (fastest?.avgDuration ?? Infinity)
              ? { name, avgDuration: stats.avgDuration }
              : fastest
          )
        : null

    const mostUsedTool =
      toolStats.length > 0
        ? toolStats.reduce((mostUsed, [name, stats]) =>
            stats.count > (mostUsed?.count ?? 0) ? { name, count: stats.count } : mostUsed
          )
        : null

    // Find slow queries
    const slowQueries = this.metrics
      .filter((m) => m.duration > this.options.slowQueryThreshold)
      .map((m) => ({
        toolName: m.toolName,
        duration: m.duration,
        timestamp: m.timestamp,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10) // Top 10 slowest

    return {
      timestamp: now,
      totalMetrics: this.metrics.length,
      timeRange: {
        start: this.startTime,
        end: now,
        duration: now - this.startTime,
      },
      byTool,
      overall: {
        totalExecutions,
        successfulExecutions,
        failedExecutions,
        avgDuration,
        slowestTool,
        fastestTool,
        mostUsedTool,
      },
      slowQueries,
    }
  }

  /**
   * Get metrics for a time range
   */
  getMetrics(startTime?: number, endTime?: number): PerformanceMetric[] {
    let filtered = this.metrics

    if (startTime) {
      filtered = filtered.filter((m) => m.timestamp >= startTime)
    }

    if (endTime) {
      filtered = filtered.filter((m) => m.timestamp <= endTime)
    }

    return filtered
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.startTime = Date.now()
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(
      {
        startTime: this.startTime,
        metrics: this.metrics,
      },
      null,
      2
    )
  }

  /**
   * Calculate statistics for a set of metrics
   */
  private calculateStats(toolName: string, metrics: PerformanceMetric[]): PerformanceStats {
    const count = metrics.length
    const successCount = metrics.filter((m) => m.status === 'completed').length
    const failureCount = count - successCount
    const cacheHits = metrics.filter((m) => m.cached).length

    const durations = metrics.map((m) => m.duration).sort((a, b) => a - b)

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / count
    const minDuration = durations[0] || 0
    const maxDuration = durations[durations.length - 1] || 0

    const medianDuration = this.calculatePercentile(durations, 50)
    const p95Duration = this.calculatePercentile(durations, 95)
    const p99Duration = this.calculatePercentile(durations, 99)

    return {
      toolName,
      count,
      successCount,
      failureCount,
      cacheHits,
      avgDuration,
      minDuration,
      maxDuration,
      medianDuration,
      p95Duration,
      p99Duration,
      successRate: count > 0 ? successCount / count : 0,
      cacheHitRate: count > 0 ? cacheHits / count : 0,
    }
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0

    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1
    return sortedValues[Math.max(0, index)]
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format performance report as human-readable string
 */
export function formatPerformanceReport(report: PerformanceReport): string {
  const lines: string[] = []

  lines.push('='.repeat(60))
  lines.push('TOOL PERFORMANCE REPORT')
  lines.push('='.repeat(60))
  lines.push('')

  // Time range
  const duration = (report.timeRange.duration / 1000).toFixed(2)
  lines.push(`Time Range: ${duration}s`)
  lines.push(`Total Metrics: ${report.totalMetrics}`)
  lines.push('')

  // Overall stats
  lines.push('OVERALL STATISTICS')
  lines.push('-'.repeat(60))
  lines.push(`Total Executions: ${report.overall.totalExecutions}`)
  lines.push(`Successful: ${report.overall.successfulExecutions}`)
  lines.push(`Failed: ${report.overall.failedExecutions}`)
  lines.push(`Average Duration: ${report.overall.avgDuration.toFixed(2)}ms`)

  if (report.overall.slowestTool) {
    lines.push(
      `Slowest Tool: ${report.overall.slowestTool.name} (${report.overall.slowestTool.avgDuration.toFixed(2)}ms avg)`
    )
  }

  if (report.overall.fastestTool) {
    lines.push(
      `Fastest Tool: ${report.overall.fastestTool.name} (${report.overall.fastestTool.avgDuration.toFixed(2)}ms avg)`
    )
  }

  if (report.overall.mostUsedTool) {
    lines.push(
      `Most Used Tool: ${report.overall.mostUsedTool.name} (${report.overall.mostUsedTool.count} calls)`
    )
  }

  lines.push('')

  // Per-tool stats
  lines.push('PER-TOOL STATISTICS')
  lines.push('-'.repeat(60))

  for (const [toolName, stats] of Object.entries(report.byTool)) {
    lines.push(`\n${toolName}:`)
    lines.push(`  Calls: ${stats.count}`)
    lines.push(`  Success Rate: ${(stats.successRate * 100).toFixed(1)}%`)
    lines.push(`  Cache Hit Rate: ${(stats.cacheHitRate * 100).toFixed(1)}%`)
    lines.push(`  Avg Duration: ${stats.avgDuration.toFixed(2)}ms`)
    lines.push(`  Min/Max: ${stats.minDuration.toFixed(2)}ms / ${stats.maxDuration.toFixed(2)}ms`)
    lines.push(`  P95/P99: ${stats.p95Duration.toFixed(2)}ms / ${stats.p99Duration.toFixed(2)}ms`)
  }

  // Slow queries
  if (report.slowQueries.length > 0) {
    lines.push('')
    lines.push('SLOW QUERIES')
    lines.push('-'.repeat(60))

    for (const query of report.slowQueries) {
      lines.push(`${query.toolName}: ${query.duration.toFixed(2)}ms`)
    }
  }

  lines.push('')
  lines.push('='.repeat(60))

  return lines.join('\n')
}

/**
 * Compare two performance reports
 */
export function compareReports(
  baseline: PerformanceReport,
  current: PerformanceReport
): {
  toolName: string
  baselineDuration: number
  currentDuration: number
  change: number
  changePercent: number
}[] {
  const comparisons: Array<{
    toolName: string
    baselineDuration: number
    currentDuration: number
    change: number
    changePercent: number
  }> = []

  for (const toolName of Object.keys(current.byTool)) {
    const baselineStats = baseline.byTool[toolName]
    const currentStats = current.byTool[toolName]

    if (!baselineStats) continue

    const change = currentStats.avgDuration - baselineStats.avgDuration
    const changePercent = (change / baselineStats.avgDuration) * 100

    comparisons.push({
      toolName,
      baselineDuration: baselineStats.avgDuration,
      currentDuration: currentStats.avgDuration,
      change,
      changePercent,
    })
  }

  return comparisons.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
}
