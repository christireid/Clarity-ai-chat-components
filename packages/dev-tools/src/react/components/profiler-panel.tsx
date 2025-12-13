/**
 * Performance Profiler Panel Component
 * Premium performance monitoring with visual metrics and charts
 * React 19 component using useOptimistic for real-time metrics
 */

'use client'

import * as React from 'react'
import { useProfiler } from '../hooks/use-profiler'
import type { PerformanceMetrics } from '../../performance/profiler'

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
 * Icons for the profiler panel
 */
const Icons = {
  Zap: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  TrendingUp: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendingDown: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Activity: () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Memory: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 14h3" />
      <path d="M1 9h3" />
      <path d="M1 14h3" />
    </svg>
  ),
  ArrowUpDown: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  ),
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
          <Icons.Zap />
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
            <Icons.Trash />
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
              <Icons.Activity />
            </div>
            <div className="summary-content">
              <span className="summary-label">Operations</span>
              <span className="summary-value">{summary.totalOperations}</span>
            </div>
          </div>
          <div className="summary-item">
            <div className="summary-icon">
              <Icons.Clock />
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
              <Icons.TrendingUp />
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
                <Icons.TrendingDown />
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
                <Icons.Zap />
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
            <Icons.ArrowUpDown />
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
        <Icons.Activity />
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
            <Icons.Memory />
            <span>{formatMemory(metric.memoryDelta.heapUsed)}</span>
          </div>
        )}
        <span className="expand-icon" aria-hidden="true">
          <Icons.ChevronDown />
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
 * Format duration for display
 */
function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`
  if (ms < 1000) return `${ms.toFixed(1)}ms`
  return `${(ms / 1000).toFixed(2)}s`
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
