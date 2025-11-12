/**
 * API Inspector Panel Component
 * React 19 component using useOptimistic for real-time updates
 */

'use client'

import * as React from 'react'
import { useAPIInspector } from '../hooks/use-api-inspector'
import type { APICallLog } from '../../debug/api-inspector'

export interface APIInspectorPanelProps {
  className?: string
  maxLogs?: number
}

/**
 * API Inspector Panel Component
 * Displays real-time API call logs with optimistic updates
 */
export function APIInspectorPanel({ className, maxLogs = 100 }: APIInspectorPanelProps) {
  const {
    logs,
    enabled,
    verbose,
    stats,
    setEnabled,
    setVerbose,
    clearLogs,
  } = useAPIInspector()

  const displayLogs = React.useMemo(() => {
    return logs.slice(-maxLogs)
  }, [logs, maxLogs])

  return (
    <div className={className} data-testid="api-inspector-panel">
      <div className="api-inspector-header">
        <h2>API Inspector</h2>
        <div className="api-inspector-controls">
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={verbose}
              onChange={(e) => setVerbose(e.target.checked)}
            />
            Verbose
          </label>
          <button onClick={clearLogs}>Clear</button>
        </div>
      </div>

      <div className="api-inspector-stats">
        <div className="stat">
          <span className="stat-label">Total Calls:</span>
          <span className="stat-value">{stats.totalCalls}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completedCalls}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Errors:</span>
          <span className="stat-value">{stats.errorCalls}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Response:</span>
          <span className="stat-value">{stats.averageResponseTime.toFixed(2)}ms</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Tokens:</span>
          <span className="stat-value">{stats.totalUsage.totalTokens}</span>
        </div>
      </div>

      <div className="api-inspector-logs">
        {displayLogs.length === 0 ? (
          <div className="empty-state">No API calls logged yet</div>
        ) : (
          <div className="logs-list">
            {displayLogs.map((log) => (
              <APICallLogItem key={log.id} log={log} verbose={verbose} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface APICallLogItemProps {
  log: APICallLog
  verbose: boolean
}

function APICallLogItem({ log, verbose }: APICallLogItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className={`api-call-log ${log.error ? 'error' : ''}`}>
      <div className="log-header" onClick={() => setExpanded(!expanded)}>
        <div className="log-info">
          <span className="log-provider">{log.provider}</span>
          <span className="log-model">{log.model}</span>
          <span className="log-endpoint">{log.endpoint}</span>
        </div>
        <div className="log-metrics">
          {log.timing.duration && (
            <span className="log-duration">{log.timing.duration.toFixed(2)}ms</span>
          )}
          {log.usage && (
            <span className="log-tokens">{log.usage.totalTokens} tokens</span>
          )}
          {log.error && <span className="log-error">❌</span>}
        </div>
      </div>

      {expanded && (
        <div className="log-details">
          {verbose && (
            <>
              <div className="log-section">
                <h4>Request</h4>
                <pre>{JSON.stringify(log.request, null, 2)}</pre>
              </div>
              {log.response && (
                <div className="log-section">
                  <h4>Response</h4>
                  <pre>{JSON.stringify(log.response, null, 2)}</pre>
                </div>
              )}
              {log.error && (
                <div className="log-section error">
                  <h4>Error</h4>
                  <pre>{log.error.message}</pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
