import { getLogger } from '../debug/logger'

const logger = getLogger('profiler')

/**
 * Performance profiler for AI chat applications
 * 
 * Tracks:
 * - API call latency
 * - Token throughput
 * - Memory usage
 * - Streaming performance
 */

import type { TableColumn } from '../ui/table'
import { table, keyValueTable } from '../ui/table'
import { infoBox } from '../ui/box'
import chalk from 'chalk'
// Helper functions for formatting
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}
export interface PerformanceMetrics {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  memoryBefore?: NodeJS.MemoryUsage
  memoryAfter?: NodeJS.MemoryUsage
  memoryDelta?: {
    heapUsed: number
    heapTotal: number
    external: number
    rss: number
  }
  custom?: Record<string, any>
}

export interface StreamingMetrics {
  ttfb: number // Time to first byte
  chunks: number
  totalBytes: number
  duration: number
  throughput: number // bytes per second
  chunkTimes: number[] // Time between chunks
  avgChunkTime: number
  maxChunkTime: number
  minChunkTime: number
}

class Profiler {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private enabled: boolean = false

  constructor(enabled: boolean = true) {
    this.enabled = enabled
  }

  /**
   * Start profiling an operation
   */
  start(name: string, options: { trackMemory?: boolean } = {}): void {
    if (!this.enabled) return

    const metrics: PerformanceMetrics = {
      name,
      startTime: performance.now()
    }

    if (options.trackMemory) {
      metrics.memoryBefore = process.memoryUsage()
    }

    this.metrics.set(name, metrics)
  }

  /**
   * End profiling an operation
   */
  end(name: string, custom?: Record<string, any>): PerformanceMetrics | undefined {
    if (!this.enabled) return

    const metrics = this.metrics.get(name)
    if (!metrics) {
      warn(`No metrics found for operation: ${name}`)
      return
    }

    metrics.endTime = performance.now()
    metrics.duration = metrics.endTime - metrics.startTime

    if (metrics.memoryBefore) {
      metrics.memoryAfter = process.memoryUsage()
      metrics.memoryDelta = {
        heapUsed: metrics.memoryAfter.heapUsed - metrics.memoryBefore.heapUsed,
        heapTotal: metrics.memoryAfter.heapTotal - metrics.memoryBefore.heapTotal,
        external: metrics.memoryAfter.external - metrics.memoryBefore.external,
        rss: metrics.memoryAfter.rss - metrics.memoryBefore.rss
      }
    }

    if (custom) {
      metrics.custom = custom
    }

    return metrics
  }

  /**
   * Profile an async function
   */
  async profile<T>(
    name: string,
    fn: () => Promise<T>,
    options: { trackMemory?: boolean } = {}
  ): Promise<{ result: T; metrics: PerformanceMetrics }> {
    this.start(name, options)
    
    try {
      const result = await fn()
      const metrics = this.end(name)!
      return { result, metrics }
    } catch (error) {
      this.end(name)
      throw error
    }
  }

  /**
   * Profile streaming performance
   */
  async profileStream<T>(
    stream: AsyncIterable<T>,
    options: {
      extractSize?: (chunk: T) => number
    } = {}
  ): Promise<{
    chunks: T[]
    metrics: StreamingMetrics
  }> {
    const chunks: T[] = []
    const chunkTimes: number[] = []
    
    let startTime = performance.now()
    let lastChunkTime = startTime
    let ttfb = 0
    let totalBytes = 0

    let isFirstChunk = true

    for await (const chunk of stream) {
      const now = performance.now()
      
      if (isFirstChunk) {
        ttfb = now - startTime
        isFirstChunk = false
      } else {
        chunkTimes.push(now - lastChunkTime)
      }

      lastChunkTime = now
      chunks.push(chunk)

      if (options.extractSize) {
        totalBytes += options.extractSize(chunk)
      }
    }

    const duration = performance.now() - startTime
    const throughput = totalBytes > 0 ? (totalBytes / duration) * 1000 : 0

    const metrics: StreamingMetrics = {
      ttfb,
      chunks: chunks.length,
      totalBytes,
      duration,
      throughput,
      chunkTimes,
      avgChunkTime: chunkTimes.length > 0 
        ? chunkTimes.reduce((a, b) => a + b, 0) / chunkTimes.length 
        : 0,
      maxChunkTime: chunkTimes.length > 0 ? Math.max(...chunkTimes) : 0,
      minChunkTime: chunkTimes.length > 0 ? Math.min(...chunkTimes) : 0
    }

    return { chunks, metrics }
  }

  /**
   * Get metrics for an operation
   */
  getMetrics(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name)
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalOperations: number
    totalDuration: number
    avgDuration: number
    slowestOperation?: PerformanceMetrics
    fastestOperation?: PerformanceMetrics
  } {
    const allMetrics = this.getAllMetrics()
    const completedMetrics = allMetrics.filter(m => m.duration !== undefined)

    if (completedMetrics.length === 0) {
      return {
        totalOperations: 0,
        totalDuration: 0,
        avgDuration: 0
      }
    }

    const totalDuration = completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0)
    const avgDuration = totalDuration / completedMetrics.length

    const slowestOperation = completedMetrics.reduce((slowest, current) => 
      (current.duration || 0) > (slowest.duration || 0) ? current : slowest
    )

    const fastestOperation = completedMetrics.reduce((fastest, current) => 
      (current.duration || 0) < (fastest.duration || 0) ? current : fastest
    )

    return {
      totalOperations: completedMetrics.length,
      totalDuration,
      avgDuration,
      slowestOperation,
      fastestOperation
    }
  }

  /**
   * Print metrics report with beautiful formatting
   */
  printReport(): void {
    const summary = this.getSummary()

    // Summary box
    const summaryContent = [
      `Total Operations: ${chalk.cyan(summary.totalOperations)}`,
      `Total Duration: ${chalk.cyan(summary.totalDuration.toFixed(2) + 'ms')}`,
      `Average Duration: ${chalk.cyan(summary.avgDuration.toFixed(2) + 'ms')}`,
    ].join('\n')

    logger.debug()
    logger.debug(infoBox(summaryContent, '📊 Performance Summary'))
    logger.debug()

    // Operations table
    const operations = this.getAllMetrics()
      .filter(m => m.duration !== undefined)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))

    if (operations.length > 0) {
      const columns: TableColumn[] = [
        { header: 'Operation', width: 30, color: chalk.yellow },
        { header: 'Duration', width: 15, align: 'right', color: chalk.cyan },
        { header: 'Memory', width: 15, align: 'right' },
        { header: 'Details', width: 30 },
      ]

      const tableData = operations.map(m => {
        const memory = m.memoryDelta
          ? `${(m.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB`
          : '—'
        
        const details = m.custom
          ? Object.entries(m.custom).map(([k, v]) => `${k}: ${v}`).join(', ')
          : '—'

        return [
          m.name,
          `${m.duration?.toFixed(2)}ms`,
          memory,
          details,
        ]
      })

      logger.debug(table(tableData, columns))
      logger.debug()

      // Highlight slowest/fastest
      if (summary.slowestOperation && summary.fastestOperation) {
        const highlight = [
          chalk.yellow('⚡ Fastest: ') + chalk.green(summary.fastestOperation.name) + 
            chalk.gray(` (${summary.fastestOperation.duration?.toFixed(2)}ms)`),
          chalk.yellow('🐌 Slowest: ') + chalk.red(summary.slowestOperation.name) + 
            chalk.gray(` (${summary.slowestOperation.duration?.toFixed(2)}ms)`),
        ].join('\n')
        logger.debug(infoBox(highlight, '⚡ Highlights'))
        logger.debug()
      }
    }
  }

  /**
   * Print streaming metrics with beautiful formatting
   */
  printStreamingMetrics(metrics: StreamingMetrics): void {

    const metricsData = {
      'Time to First Byte': chalk.cyan(metrics.ttfb.toFixed(2) + 'ms'),
      'Total Chunks': chalk.cyan(metrics.chunks.toString()),
      'Total Bytes': chalk.cyan(formatBytes(metrics.totalBytes)),
      'Duration': chalk.cyan(metrics.duration.toFixed(2) + 'ms'),
      'Throughput': chalk.cyan((metrics.throughput / 1024).toFixed(2) + ' KB/s'),
    }

    const timingData = {
      'Average': chalk.cyan(metrics.avgChunkTime.toFixed(2) + 'ms'),
      'Min': chalk.green(metrics.minChunkTime.toFixed(2) + 'ms'),
      'Max': chalk.yellow(metrics.maxChunkTime.toFixed(2) + 'ms'),
    }

    logger.debug()
    logger.debug(infoBox(keyValueTable(metricsData), '📡 Streaming Performance'))
    logger.debug()
    logger.debug(infoBox(keyValueTable(timingData), '⏱️  Chunk Timing'))
    logger.debug()
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear()
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify({
      metrics: Array.from(this.metrics.values()),
      summary: this.getSummary()
    }, null, 2)
  }

  /**
   * Enable/disable profiler
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

// Global profiler instance
let globalProfiler: Profiler | null = null

/**
 * Get the global profiler instance
 */
export function getProfiler(): Profiler {
  if (!globalProfiler) {
    globalProfiler = new Profiler(
      process.env.NODE_ENV === 'development'
    )
  }
  return globalProfiler
}

/**
 * Create a new profiler instance
 */
export function createProfiler(enabled?: boolean): Profiler {
  return new Profiler(enabled)
}

/**
 * Measure token throughput
 */
export function calculateTokenThroughput(
  tokens: number,
  durationMs: number
): {
  tokensPerSecond: number
  tokensPerMinute: number
} {
  const tokensPerSecond = (tokens / durationMs) * 1000
  const tokensPerMinute = tokensPerSecond * 60

  return {
    tokensPerSecond,
    tokensPerMinute
  }
}



export { Profiler }
