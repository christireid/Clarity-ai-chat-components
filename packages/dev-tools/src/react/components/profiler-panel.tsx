/**
 * Performance Profiler Panel Component
 * Premium performance monitoring with visual metrics and charts
 * React 19 component using useOptimistic for real-time metrics
 */

'use client'

import * as React from 'react'
// Helper function for formatting
function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}
import { useProfiler } from '../hooks/use-profiler'
import type { PerformanceMetrics } from '../../performance/profiler'
import {
  ZapIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  TrashIcon,
  ActivityIcon,
  ChevronDownIcon,
  MemoryIcon,
  ArrowUpDownIcon,
} from './icons'

export interface ProfilerPanelProps {
  /** Additional CSS classes */
  className?: string
  /** Show performance thresholds */
  showThresholds?: boolean
  /** Warning threshold in ms */
  warningThreshold?: number
  /** Error threshold in ms */
  errorThreshold?: number
  /** Enable grouping by operation type */
  enableGrouping?: boolean
  /** Sort order */
  sortOrder?: 'duration' | 'name' | 'time'
}

/**
 * Performance Profiler Panel Component
 * Displays real-time performance metrics with visual charts
 */
export function ProfilerPanel({
  className,
  showThresholds = true,
  warningThreshold = 100,
  errorThreshold = 500,
  enableGrouping = true,
  sortOrder = 'duration',
}: ProfilerPanelProps) {
  const { metrics, enabled, summary, setEnabled, clear } = useProfiler()

  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(
    null
  )
  const [currentSortOrder, setCurrentSortOrder] = React.useState(sortOrder)

  // Calculate max duration for scaling bars
  const maxDuration = React.useMemo(() => {
    const completedMetrics = metrics.filter((m) => m.duration !== undefined)
    if (completedMetrics.length === 0) return 100
    return Math.max(...completedMetrics.map((m) => m.duration || 0))
  }, [metrics])

  // Sort metrics based on current order
  const sortedMetrics = React.useMemo(() => {
    const completedMetrics = metrics.filter((m) => m.duration !== undefined)

    return [...completedMetrics].sort((a, b) => {
      switch (currentSortOrder) {
        case 'duration':
          return (b.duration || 0) - (a.duration || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'time':
          return b.startTime - a.startTime
        default:
          return 0
      }
    })
  }, [metrics, currentSortOrder])

  // Get performance level based on duration
  const getPerformanceLevel = (duration: number) => {
    if (duration >= errorThreshold) return 'critical'
    if (duration >= warningThreshold) return 'warning'
    return 'good'
  }

  // Toggle metric expansion
  const toggleMetric = (name: string) => {
    setExpandedMetric((prev) => (prev === name ? null : name))
  }

  // Cycle through sort orders
  const cycleSortOrder = () => {
    setCurrentSortOrder((prev) => {
      switch (prev) {
        case 'duration':
          return 'name'
        case 'name':
          return 'time'
        case 'time':
          return 'duration'
        default:
          return 'duration'
      }
    })
  }

  return (
    <div
      className={`profiler-panel ${className || ''}`}
      data-testid="profiler-panel"
    >
      {/* Header */}
      <header className="profiler-header">
        <h2>
          <ZapIcon size="lg" />
          Performance Profiler
        </h2>
        <div className="profiler-controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              aria-label="Enable profiler"
            />
            <span className="toggle-track" aria-hidden="true" />
            <span className="toggle-label">Enabled</span>
          </label>
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon"
            onClick={clear}
            aria-label="Clear metrics"
            title="Clear all metrics"
          >
            <TrashIcon />
          </button>
        </div>
      </header>

      {/* Summary Stats */}
      {summary.totalOperations > 0 && (
        <div
          className="profiler-summary"
          role="region"
          aria-label="Performance summary"
        >
          <div className="summary-item">
            <div className="summary-icon">
              <ActivityIcon size="xl" />
            </div>
            <div className="summary-content">
              <span className="summary-label">Operations</span>
              <span className="summary-value">{summary.totalOperations}</span>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">
              <ClockIcon />
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Time</span>
              <span className="summary-value">
                {formatDuration(summary.totalDuration)}
              </span>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">
              <TrendingUpIcon />
            </div>
            <div className="summary-content">
              <span className="summary-label">Average</span>
              <span className="summary-value">
                {formatDuration(summary.avgDuration)}
              </span>
            </div>
          </div>
          {summary.slowestOperation && (
            <div className="summary-item highlight-slow">
              <div className="summary-icon">
                <TrendingDownIcon />
              </div>
              <div className="summary-content">
                <span className="summary-label">Slowest</span>
                <span className="summary-value">
                  {summary.slowestOperation.name}
                  <span className="summary-detail">
                    {formatDuration(summary.slowestOperation.duration || 0)}
                  </span>
                </span>
              </div>
            </div>
          )}
          {summary.fastestOperation && (
            <div className="summary-item highlight-fast">
              <div className="summary-icon">
                <ZapIcon />
              </div>
              <div className="summary-content">
                <span className="summary-label">Fastest</span>
                <span className="summary-value">
                  {summary.fastestOperation.name}
                  <span className="summary-detail">
                    {formatDuration(summary.fastestOperation.duration || 0)}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Thresholds Legend */}
      {showThresholds && sortedMetrics.length > 0 && (
        <div
          className="profiler-legend"
          role="region"
          aria-label="Performance thresholds"
        >
          <div className="legend-item good">
            <span className="legend-dot" />
            <span>Good (&lt;{warningThreshold}ms)</span>
          </div>
          <div className="legend-item warning">
            <span className="legend-dot" />
            <span>
              Warning ({warningThreshold}-{errorThreshold}ms)
            </span>
          </div>
          <div className="legend-item critical">
            <span className="legend-dot" />
            <span>Critical (&gt;{errorThreshold}ms)</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {sortedMetrics.length > 0 && (
        <div className="profiler-toolbar">
          <button
            className="dt-btn dt-btn-ghost dt-btn-sm"
            onClick={cycleSortOrder}
            aria-label={`Sort by ${currentSortOrder}`}
          >
            <ArrowUpDownIcon size="sm" />
            <span>Sort: {currentSortOrder}</span>
          </button>
          <span className="metrics-count">
            {sortedMetrics.length} operation
            {sortedMetrics.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Metrics List */}
      <div
        className="profiler-metrics"
        role="list"
        aria-label="Performance metrics"
      >
        {sortedMetrics.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="metrics-list">
            {sortedMetrics.map((metric) => (
              <MetricItem
                key={metric.name}
                metric={metric}
                maxDuration={maxDuration}
                performanceLevel={getPerformanceLevel(metric.duration || 0)}
                expanded={expandedMetric === metric.name}
                onToggle={() => toggleMetric(metric.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <ActivityIcon size="xl" />
      </div>
      <h3 className="empty-state-title">No metrics recorded</h3>
      <p className="empty-state-description">
        Performance metrics will appear here as operations are profiled. Make
        sure the profiler is enabled.
      </p>
    </div>
  )
}

/**
 * Individual metric item component
 */
interface MetricItemProps {
  metric: PerformanceMetrics
  maxDuration: number
  performanceLevel: 'good' | 'warning' | 'critical'
  expanded: boolean
  onToggle: () => void
}

function MetricItem({
  metric,
  maxDuration,
  performanceLevel,
  expanded,
  onToggle,
}: MetricItemProps) {
  const barWidth = Math.min(100, ((metric.duration || 0) / maxDuration) * 100)

  return (
    <article
      className={`metric-item ${performanceLevel} ${expanded ? 'expanded' : ''}`}
      role="listitem"
    >
      <div
        className="metric-header"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div className="metric-info">
          <span className="metric-name">{metric.name}</span>
          <span className={`metric-duration ${performanceLevel}`}>
            {formatDuration(metric.duration || 0)}
          </span>
        </div>
        {metric.memoryDelta && (
          <div
            className="metric-memory"
            aria-label={`Memory change: ${formatMemory(metric.memoryDelta.heapUsed)}`}
          >
            <MemoryIcon />
            <span>{formatMemory(metric.memoryDelta.heapUsed)}</span>
          </div>
        )}
        <span className="expand-icon" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </div>

      {/* Performance Bar */}
      <div className="metric-bar-container">
        <div
          className="metric-bar"
          role="progressbar"
          aria-valuenow={barWidth}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`metric-bar-fill ${performanceLevel}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div
          className="metric-details"
          role="region"
          aria-label="Metric details"
        >
          <dl className="metric-details-list">
            <div className="detail-item">
              <dt>Start Time</dt>
              <dd>{new Date(metric.startTime).toLocaleTimeString()}</dd>
            </div>
            {metric.endTime && (
              <div className="detail-item">
                <dt>End Time</dt>
                <dd>{new Date(metric.endTime).toLocaleTimeString()}</dd>
              </div>
            )}
            {metric.duration !== undefined && (
              <div className="detail-item">
                <dt>Duration</dt>
                <dd className="highlight">{metric.duration.toFixed(3)}ms</dd>
              </div>
            )}
            {metric.memoryDelta && (
              <>
                <div className="detail-item">
                  <dt>Heap Used</dt>
                  <dd>{formatMemory(metric.memoryDelta.heapUsed)}</dd>
                </div>
                <div className="detail-item">
                  <dt>Heap Total</dt>
                  <dd>{formatMemory(metric.memoryDelta.heapTotal)}</dd>
                </div>
                <div className="detail-item">
                  <dt>External</dt>
                  <dd>{formatMemory(metric.memoryDelta.external)}</dd>
                </div>
              </>
            )}
            {metric.custom && Object.keys(metric.custom).length > 0 && (
              <div className="detail-item full-width">
                <dt>Custom Data</dt>
                <dd>
                  <pre className="code-block">
                    <code>{JSON.stringify(metric.custom, null, 2)}</code>
                  </pre>
                </dd>
              </div>
            )}
          </dl>

          {/* Visual Performance Breakdown */}
          {metric.duration !== undefined && (
            <div className="performance-breakdown">
              <h5>Performance Analysis</h5>
              <div className="breakdown-chart">
                <div className="breakdown-item">
                  <span className="breakdown-label">Execution Time</span>
                  <div className="breakdown-bar">
                    <div
                      className={`breakdown-fill ${performanceLevel}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="breakdown-value">
                    {metric.duration.toFixed(1)}ms
                  </span>
                </div>
                {metric.memoryDelta && metric.memoryDelta.heapUsed > 0 && (
                  <div className="breakdown-item">
                    <span className="breakdown-label">Memory Impact</span>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-fill memory"
                        style={{
                          width: `${Math.min(100, (metric.memoryDelta.heapUsed / 1024 / 1024) * 10)}%`,
                        }}
                      />
                    </div>
                    <span className="breakdown-value">
                      {formatMemory(metric.memoryDelta.heapUsed)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}



/**
 * Format memory for display
 */
function formatMemory(bytes: number): string {
  const absBytes = Math.abs(bytes)
  const sign = bytes < 0 ? '-' : '+'

  if (absBytes < 1024) return `${sign}${absBytes}B`
  if (absBytes < 1024 * 1024) return `${sign}${(absBytes / 1024).toFixed(1)}KB`
  return `${sign}${(absBytes / 1024 / 1024).toFixed(2)}MB`
}
