/**
 * Component Performance Monitor for Clarity Chat Developer Tools
 *
 * Track React component performance including:
 * - Render counts and frequency
 * - Render duration timing
 * - Props change detection
 * - Memory impact estimation
 * - Component lifecycle tracking
 * - Re-render cause analysis
 * - Performance recommendations
 */

import chalk from 'chalk'
import { infoBox, warningBox, successBox } from '../ui/box'
import { table, keyValueTable, type TableColumn } from '../ui/table'

export interface RenderInfo {
  timestamp: number
  duration: number
  phase: 'mount' | 'update' | 'unmount'
  changedProps?: string[]
  changedState?: string[]
  trigger?: string
}

export interface ComponentMetrics {
  componentName: string
  instanceId: string
  mountTime: number
  unmountTime?: number
  renderCount: number
  totalRenderTime: number
  avgRenderTime: number
  maxRenderTime: number
  minRenderTime: number
  renders: RenderInfo[]
  warnings: string[]
  propsHistory: Array<{ timestamp: number; props: Record<string, unknown> }>
}

export interface PerformanceThresholds {
  maxRenderDuration: number // ms
  maxRenderCount: number // per minute
  maxPropsChangesPerRender: number
  warnOnUnnecessaryRenders: boolean
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxRenderDuration: 16, // Target 60fps
  maxRenderCount: 60, // 1 render per second
  maxPropsChangesPerRender: 5,
  warnOnUnnecessaryRenders: true,
}

/**
 * Component Performance Monitor
 * Track and analyze React component performance
 */
export class ComponentMonitor {
  private components: Map<string, ComponentMetrics> = new Map()
  private enabled: boolean = true
  private thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
  private listeners: Set<(metrics: ComponentMetrics) => void> = new Set()
  private globalRenderCount: number = 0
  private sessionStartTime: number = Date.now()

  constructor(options: {
    enabled?: boolean
    thresholds?: Partial<PerformanceThresholds>
  } = {}) {
    this.enabled = options.enabled ?? true
    if (options.thresholds) {
      this.thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds }
    }
  }

  /**
   * Register a component mount
   */
  onMount(
    componentName: string,
    instanceId: string,
    initialProps?: Record<string, unknown>
  ): void {
    if (!this.enabled) return

    const metrics: ComponentMetrics = {
      componentName,
      instanceId,
      mountTime: Date.now(),
      renderCount: 0,
      totalRenderTime: 0,
      avgRenderTime: 0,
      maxRenderTime: 0,
      minRenderTime: Infinity,
      renders: [],
      warnings: [],
      propsHistory: initialProps ? [{ timestamp: Date.now(), props: initialProps }] : [],
    }

    this.components.set(instanceId, metrics)
  }

  /**
   * Record a render
   */
  onRender(
    instanceId: string,
    duration: number,
    options: {
      phase?: 'mount' | 'update' | 'unmount'
      changedProps?: string[]
      changedState?: string[]
      trigger?: string
      currentProps?: Record<string, unknown>
    } = {}
  ): void {
    if (!this.enabled) return

    const metrics = this.components.get(instanceId)
    if (!metrics) return

    const renderInfo: RenderInfo = {
      timestamp: Date.now(),
      duration,
      phase: options.phase ?? 'update',
      changedProps: options.changedProps,
      changedState: options.changedState,
      trigger: options.trigger,
    }

    metrics.renders.push(renderInfo)
    metrics.renderCount++
    metrics.totalRenderTime += duration
    metrics.avgRenderTime = metrics.totalRenderTime / metrics.renderCount
    metrics.maxRenderTime = Math.max(metrics.maxRenderTime, duration)
    metrics.minRenderTime = Math.min(metrics.minRenderTime, duration)

    this.globalRenderCount++

    // Track props history
    if (options.currentProps) {
      metrics.propsHistory.push({
        timestamp: Date.now(),
        props: options.currentProps,
      })

      // Keep only last 20 props changes
      if (metrics.propsHistory.length > 20) {
        metrics.propsHistory.shift()
      }
    }

    // Check for performance issues
    this.checkPerformance(metrics, renderInfo)

    // Notify listeners
    this.listeners.forEach(listener => listener(metrics))

    // Keep only last 100 renders per component
    if (metrics.renders.length > 100) {
      metrics.renders.shift()
    }
  }

  /**
   * Register component unmount
   */
  onUnmount(instanceId: string): void {
    if (!this.enabled) return

    const metrics = this.components.get(instanceId)
    if (!metrics) return

    metrics.unmountTime = Date.now()

    // Record final render info
    this.onRender(instanceId, 0, { phase: 'unmount' })
  }

  /**
   * Check for performance issues
   */
  private checkPerformance(metrics: ComponentMetrics, renderInfo: RenderInfo): void {
    // Check render duration
    if (renderInfo.duration > this.thresholds.maxRenderDuration) {
      const warning = `Slow render: ${renderInfo.duration.toFixed(2)}ms (threshold: ${this.thresholds.maxRenderDuration}ms)`
      metrics.warnings.push(warning)
    }

    // Check render frequency
    const recentRenders = metrics.renders.filter(
      r => r.timestamp > Date.now() - 60000
    )
    if (recentRenders.length > this.thresholds.maxRenderCount) {
      const warning = `High render frequency: ${recentRenders.length} renders in last minute (threshold: ${this.thresholds.maxRenderCount})`
      if (!metrics.warnings.includes(warning)) {
        metrics.warnings.push(warning)
      }
    }

    // Check for unnecessary renders
    if (
      this.thresholds.warnOnUnnecessaryRenders &&
      renderInfo.phase === 'update' &&
      !renderInfo.changedProps?.length &&
      !renderInfo.changedState?.length
    ) {
      const warning = 'Possible unnecessary render: no props or state changes detected'
      metrics.warnings.push(warning)
    }

    // Check for too many props changes
    if (
      renderInfo.changedProps &&
      renderInfo.changedProps.length > this.thresholds.maxPropsChangesPerRender
    ) {
      const warning = `Many props changed: ${renderInfo.changedProps.length} props (threshold: ${this.thresholds.maxPropsChangesPerRender})`
      metrics.warnings.push(warning)
    }
  }

  /**
   * Get metrics for a component
   */
  getMetrics(instanceId: string): ComponentMetrics | undefined {
    return this.components.get(instanceId)
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): ComponentMetrics[] {
    return Array.from(this.components.values())
  }

  /**
   * Get metrics by component name
   */
  getMetricsByName(componentName: string): ComponentMetrics[] {
    return this.getAllMetrics().filter(m => m.componentName === componentName)
  }

  /**
   * Get slowest components
   */
  getSlowestComponents(limit: number = 10): ComponentMetrics[] {
    return this.getAllMetrics()
      .filter(m => m.renderCount > 0)
      .sort((a, b) => b.avgRenderTime - a.avgRenderTime)
      .slice(0, limit)
  }

  /**
   * Get most rendered components
   */
  getMostRenderedComponents(limit: number = 10): ComponentMetrics[] {
    return this.getAllMetrics()
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit)
  }

  /**
   * Get components with warnings
   */
  getComponentsWithWarnings(): ComponentMetrics[] {
    return this.getAllMetrics().filter(m => m.warnings.length > 0)
  }

  /**
   * Get global statistics
   */
  getGlobalStats(): {
    totalComponents: number
    activeComponents: number
    totalRenders: number
    avgRenderTime: number
    totalRenderTime: number
    rendersPerSecond: number
    componentsWithWarnings: number
    topWarnings: Array<{ component: string; warning: string }>
  } {
    const metrics = this.getAllMetrics()
    const activeComponents = metrics.filter(m => !m.unmountTime)
    const totalRenderTime = metrics.reduce((sum, m) => sum + m.totalRenderTime, 0)
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000

    // Collect all warnings
    const allWarnings: Array<{ component: string; warning: string }> = []
    metrics.forEach(m => {
      m.warnings.forEach(warning => {
        allWarnings.push({ component: m.componentName, warning })
      })
    })

    return {
      totalComponents: metrics.length,
      activeComponents: activeComponents.length,
      totalRenders: this.globalRenderCount,
      avgRenderTime: this.globalRenderCount > 0
        ? totalRenderTime / this.globalRenderCount
        : 0,
      totalRenderTime,
      rendersPerSecond: this.globalRenderCount / sessionDuration,
      componentsWithWarnings: this.getComponentsWithWarnings().length,
      topWarnings: allWarnings.slice(0, 10),
    }
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = []
    const metrics = this.getAllMetrics()

    // Check for components that render too often
    const highRenderComponents = metrics.filter(m => {
      const recentRenders = m.renders.filter(r => r.timestamp > Date.now() - 60000)
      return recentRenders.length > this.thresholds.maxRenderCount
    })

    if (highRenderComponents.length > 0) {
      recommendations.push(
        `${highRenderComponents.length} component(s) have high render frequency. Consider using React.memo(), useMemo(), or useCallback().`
      )
    }

    // Check for slow renders
    const slowComponents = metrics.filter(m => m.avgRenderTime > this.thresholds.maxRenderDuration)
    if (slowComponents.length > 0) {
      recommendations.push(
        `${slowComponents.length} component(s) have slow renders. Consider code splitting, lazy loading, or optimizing render logic.`
      )
    }

    // Check for components with many props changes
    const manyPropsComponents = metrics.filter(m =>
      m.renders.some(r =>
        r.changedProps && r.changedProps.length > this.thresholds.maxPropsChangesPerRender
      )
    )
    if (manyPropsComponents.length > 0) {
      recommendations.push(
        `${manyPropsComponents.length} component(s) receive many prop changes. Consider restructuring props or using context for frequently changing values.`
      )
    }

    // Check for potential memory leaks
    const longLivedWithManyRenders = metrics.filter(m => {
      const lifetime = (m.unmountTime ?? Date.now()) - m.mountTime
      return lifetime > 300000 && m.renderCount > 500 // 5 min lifetime, 500+ renders
    })
    if (longLivedWithManyRenders.length > 0) {
      recommendations.push(
        `${longLivedWithManyRenders.length} long-lived component(s) have many renders. Verify there are no memory leaks or unnecessary re-renders.`
      )
    }

    if (recommendations.length === 0) {
      recommendations.push('No performance issues detected. Great job!')
    }

    return recommendations
  }

  /**
   * Add a metrics listener
   */
  addListener(listener: (metrics: ComponentMetrics) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.components.clear()
    this.globalRenderCount = 0
    this.sessionStartTime = Date.now()
  }

  /**
   * Set thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Export metrics
   */
  export(): string {
    return JSON.stringify({
      metrics: this.getAllMetrics(),
      globalStats: this.getGlobalStats(),
      recommendations: this.getRecommendations(),
      exportedAt: new Date().toISOString(),
    }, null, 2)
  }

  /**
   * Print formatted report
   */
  printReport(): void {
    const stats = this.getGlobalStats()

    console.log('')
    console.log(infoBox('Component Performance Monitor', '⚛️ Component Monitor'))
    console.log('')

    // Global stats
    const statsData: Record<string, string> = {
      'Total Components': chalk.cyan(stats.totalComponents.toString()),
      'Active Components': chalk.green(stats.activeComponents.toString()),
      'Total Renders': chalk.cyan(stats.totalRenders.toString()),
      'Avg Render Time': stats.avgRenderTime > this.thresholds.maxRenderDuration
        ? chalk.red(stats.avgRenderTime.toFixed(2) + 'ms')
        : chalk.green(stats.avgRenderTime.toFixed(2) + 'ms'),
      'Renders/sec': chalk.cyan(stats.rendersPerSecond.toFixed(2)),
      'Components with Warnings': stats.componentsWithWarnings > 0
        ? chalk.yellow(stats.componentsWithWarnings.toString())
        : chalk.green('0'),
    }

    console.log(keyValueTable(statsData))
    console.log('')

    // Slowest components
    const slowest = this.getSlowestComponents(5)
    if (slowest.length > 0) {
      console.log(warningBox('Slowest Components', '🐌 Slow Components'))
      console.log('')

      const columns: TableColumn[] = [
        { header: 'Component', width: 30, color: chalk.yellow },
        { header: 'Avg Time', width: 12, align: 'right', color: chalk.cyan },
        { header: 'Max Time', width: 12, align: 'right' },
        { header: 'Renders', width: 10, align: 'right' },
      ]

      const tableData = slowest.map(m => [
        m.componentName,
        m.avgRenderTime.toFixed(2) + 'ms',
        m.maxRenderTime.toFixed(2) + 'ms',
        m.renderCount.toString(),
      ])

      console.log(table(tableData, columns))
      console.log('')
    }

    // Most rendered
    const mostRendered = this.getMostRenderedComponents(5)
    if (mostRendered.length > 0) {
      console.log(infoBox('Most Rendered Components', '🔄 High Render Count'))
      console.log('')

      const columns: TableColumn[] = [
        { header: 'Component', width: 30, color: chalk.yellow },
        { header: 'Renders', width: 12, align: 'right', color: chalk.cyan },
        { header: 'Total Time', width: 12, align: 'right' },
        { header: 'Warnings', width: 10, align: 'right' },
      ]

      const tableData = mostRendered.map(m => [
        m.componentName,
        m.renderCount.toString(),
        m.totalRenderTime.toFixed(2) + 'ms',
        m.warnings.length.toString(),
      ])

      console.log(table(tableData, columns))
      console.log('')
    }

    // Recommendations
    const recommendations = this.getRecommendations()
    console.log(successBox('Recommendations', '💡 Performance Tips'))
    console.log('')
    recommendations.forEach((rec, i) => {
      console.log(chalk.cyan(`  ${i + 1}. ${rec}`))
    })
    console.log('')
  }
}

// Global instance
let globalMonitor: ComponentMonitor | null = null

/**
 * Get the global component monitor instance
 */
export function getComponentMonitor(): ComponentMonitor {
  if (!globalMonitor) {
    globalMonitor = new ComponentMonitor({
      enabled: process.env.NODE_ENV === 'development',
    })
  }
  return globalMonitor
}

/**
 * Create a new component monitor instance
 */
export function createComponentMonitor(options?: {
  enabled?: boolean
  thresholds?: Partial<PerformanceThresholds>
}): ComponentMonitor {
  return new ComponentMonitor(options)
}

/**
 * Higher-order component for automatic monitoring
 */
export function withMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
): React.ComponentType<P> {
  const displayName = componentName ?? WrappedComponent.displayName ?? WrappedComponent.name ?? 'Unknown'
  const monitor = getComponentMonitor()

  return function MonitoredComponent(props: P) {
    const instanceId = `${displayName}_${Math.random().toString(36).substr(2, 9)}`

    // This is a conceptual implementation
    // In practice, you'd use React.useEffect and React.useRef
    monitor.onMount(displayName, instanceId, props as Record<string, unknown>)

    return null // Placeholder - actual implementation would render WrappedComponent
  }
}

export default ComponentMonitor
