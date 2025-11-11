/**
 * Performance Profiler Panel Component
 * React 19 component using useOptimistic for real-time metrics
 */

'use client'

import * as React from 'react'
import { useProfiler } from '../hooks/use-profiler'
import type { PerformanceMetrics } from '../../performance/profiler'

export interface ProfilerPanelProps {
  className?: string
}

/**
 * Performance Profiler Panel Component
 * Displays real-time performance metrics with optimistic updates
 */
export function ProfilerPanel({ className }: ProfilerPanelProps) {
  const {
    metrics,
    enabled,
    summary,
    setEnabled,
    clear,
  } = useProfiler()

  return (
    <div className={className} data-testid="profiler-panel">
      <div className="profiler-header">
        <h2>Performance Profiler</h2>
        <div className="profiler-controls">
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enabled
          </label>
          <button onClick={clear}>Clear</button>
        </div>
      </div>

      {summary.totalOperations > 0 && (
        <div className="profiler-summary">
          <div className="summary-item">
            <span className="summary-label">Total Operations:</span>
            <span className="summary-value">{summary.totalOperations}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Duration:</span>
            <span className="summary-value">{summary.totalDuration.toFixed(2)}ms</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average Duration:</span>
            <span className="summary-value">{summary.avgDuration.toFixed(2)}ms</span>
          </div>
          {summary.slowestOperation && (
            <div className="summary-item">
              <span className="summary-label">Slowest:</span>
              <span className="summary-value">
                {summary.slowestOperation.name} ({summary.slowestOperation.duration?.toFixed(2)}ms)
              </span>
            </div>
          )}
          {summary.fastestOperation && (
            <div className="summary-item">
              <span className="summary-label">Fastest:</span>
              <span className="summary-value">
                {summary.fastestOperation.name} ({summary.fastestOperation.duration?.toFixed(2)}ms)
              </span>
            </div>
          )}
        </div>
      )}

      <div className="profiler-metrics">
        {metrics.length === 0 ? (
          <div className="empty-state">No metrics recorded yet</div>
        ) : (
          <div className="metrics-list">
            {metrics
              .filter(m => m.duration !== undefined)
              .sort((a, b) => (b.duration || 0) - (a.duration || 0))
              .map((metric) => (
                <MetricItem key={metric.name} metric={metric} />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface MetricItemProps {
  metric: PerformanceMetrics
}

function MetricItem({ metric }: MetricItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="metric-item">
      <div className="metric-header" onClick={() => setExpanded(!expanded)}>
        <div className="metric-info">
          <span className="metric-name">{metric.name}</span>
          {metric.duration && (
            <span className="metric-duration">{metric.duration.toFixed(2)}ms</span>
          )}
        </div>
        {metric.memoryDelta && (
          <div className="metric-memory">
            {(metric.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </div>

      {expanded && (
        <div className="metric-details">
          <div className="detail-item">
            <span>Start Time:</span>
            <span>{new Date(metric.startTime).toLocaleTimeString()}</span>
          </div>
          {metric.endTime && (
            <div className="detail-item">
              <span>End Time:</span>
              <span>{new Date(metric.endTime).toLocaleTimeString()}</span>
            </div>
          )}
          {metric.memoryDelta && (
            <div className="detail-item">
              <span>Memory Delta:</span>
              <span>
                Heap: {(metric.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
          {metric.custom && (
            <div className="detail-item">
              <span>Custom:</span>
              <pre>{JSON.stringify(metric.custom, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
