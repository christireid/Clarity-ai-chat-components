import { logger } from '@clarity-chat/utils/logger';
/**
 * API Inspector Panel Component
 * Premium API call monitoring with filtering, search, and export
 * React 19 component using useOptimistic for real-time updates
 */

'use client'

import * as React from 'react'
import { useAPIInspector } from '../hooks/use-api-inspector'
import type { APICallLog } from '../../debug/api-inspector'
import {
  SearchIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  ChevronDownIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  InboxIcon,
} from './icons'

export interface APIInspectorPanelProps {
  /** Additional CSS classes */
  className?: string
  /** Maximum number of logs to display */
  maxLogs?: number
  /** Auto-scroll to latest log */
  autoScroll?: boolean
  /** Show toolbar with search and filters */
  showToolbar?: boolean
  /** Enable export functionality */
  enableExport?: boolean
}

type FilterStatus = 'all' | 'completed' | 'pending' | 'error'
type FilterProvider = 'all' | 'openai' | 'anthropic' | 'google'

/**
 * API Inspector Panel Component
 * Premium API call monitoring with real-time updates
 */
export function APIInspectorPanel({
  className,
  maxLogs = 100,
  autoScroll = true,
  showToolbar = true,
  enableExport = true,
}: APIInspectorPanelProps) {
  const { logs, enabled, verbose, stats, setEnabled, setVerbose, clearLogs } =
    useAPIInspector()

  // Local state for filtering and search
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>('all')
  const [providerFilter, setProviderFilter] =
    React.useState<FilterProvider>('all')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const logsContainerRef = React.useRef<HTMLDivElement>(null)

  // Filter and search logs
  const filteredLogs = React.useMemo(() => {
    let result = logs.slice(-maxLogs)

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((log) => {
        if (statusFilter === 'error') return log.error
        if (statusFilter === 'completed')
          return !log.error && log.timing.endTime
        if (statusFilter === 'pending') return !log.timing.endTime
        return true
      })
    }

    // Apply provider filter
    if (providerFilter !== 'all') {
      result = result.filter(
        (log) => log.provider.toLowerCase() === providerFilter.toLowerCase()
      )
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.provider.toLowerCase().includes(query) ||
          log.model.toLowerCase().includes(query) ||
          log.endpoint.toLowerCase().includes(query) ||
          log.id.toLowerCase().includes(query)
      )
    }

    return result
  }, [logs, maxLogs, statusFilter, providerFilter, searchQuery])

  // Auto-scroll to latest
  React.useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [logs.length, autoScroll])

  // Export logs to JSON
  const handleExport = React.useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      stats,
      logs: filteredLogs,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-inspector-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [filteredLogs, stats])

  // Copy log to clipboard
  const handleCopyLog = React.useCallback(async (log: APICallLog) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(log, null, 2))
      setCopiedId(log.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      logger.error('Failed to copy:', err)
    }
  }, [])

  return (
    <div
      className={`api-inspector-panel ${className || ''}`}
      data-testid="api-inspector-panel"
    >
      {/* Header */}
      <header className="api-inspector-header">
        <h2>
          <span className="sr-only">API</span>
          API Inspector
        </h2>
        <div className="api-inspector-controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              aria-label="Enable API inspector"
            />
            <span className="toggle-track" aria-hidden="true" />
            <span className="toggle-label">Enabled</span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={verbose}
              onChange={(e) => setVerbose(e.target.checked)}
              aria-label="Enable verbose mode"
            />
            <span className="toggle-track" aria-hidden="true" />
            <span className="toggle-label">Verbose</span>
          </label>
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon"
            onClick={clearLogs}
            aria-label="Clear all logs"
            title="Clear logs"
          >
            <TrashIcon />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div
        className="api-inspector-stats"
        role="region"
        aria-label="API call statistics"
      >
        <div className="stat">
          <span className="stat-label">Total Calls</span>
          <span className="stat-value">{stats.totalCalls}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed</span>
          <span className="stat-value highlight">{stats.completedCalls}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Errors</span>
          <span className={`stat-value ${stats.errorCalls > 0 ? 'error' : ''}`}>
            {stats.errorCalls}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Response</span>
          <span className="stat-value">
            {stats.averageResponseTime.toFixed(0)}ms
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Tokens</span>
          <span className="stat-value">
            {stats.totalUsage.totalTokens.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      {showToolbar && (
        <div
          className="api-inspector-toolbar"
          role="toolbar"
          aria-label="Filter and search controls"
        >
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search by provider, model, endpoint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search logs"
            />
          </div>

          <div className="filter-group" role="group" aria-label="Status filter">
            {(['all', 'completed', 'pending', 'error'] as FilterStatus[]).map(
              (status) => (
                <button
                  key={status}
                  className={`filter-button ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={statusFilter === status}
                >
                  {status === 'all'
                    ? 'All'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>

          <div
            className="filter-group"
            role="group"
            aria-label="Provider filter"
          >
            {(['all', 'openai', 'anthropic', 'google'] as FilterProvider[]).map(
              (provider) => (
                <button
                  key={provider}
                  className={`filter-button ${providerFilter === provider ? 'active' : ''}`}
                  onClick={() => setProviderFilter(provider)}
                  aria-pressed={providerFilter === provider}
                >
                  {provider === 'all'
                    ? 'All'
                    : provider.charAt(0).toUpperCase() + provider.slice(1)}
                </button>
              )
            )}
          </div>

          {enableExport && filteredLogs.length > 0 && (
            <button
              className="dt-btn dt-btn-ghost"
              onClick={handleExport}
              aria-label="Export logs to JSON"
            >
              <DownloadIcon />
              <span>Export</span>
            </button>
          )}
        </div>
      )}

      {/* Logs Container */}
      <div
        ref={logsContainerRef}
        className="api-inspector-logs"
        role="log"
        aria-label="API call logs"
        aria-live="polite"
      >
        {filteredLogs.length === 0 ? (
          <EmptyState
            hasFilters={
              searchQuery !== '' ||
              statusFilter !== 'all' ||
              providerFilter !== 'all'
            }
          />
        ) : (
          <div className="logs-list">
            {filteredLogs.map((log) => (
              <APICallLogItem
                key={log.id}
                log={log}
                verbose={verbose}
                onCopy={handleCopyLog}
                isCopied={copiedId === log.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {filteredLogs.length > 0 && (
        <div className="api-inspector-footer">
          <span className="results-count">
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <InboxIcon size="xl" />
      </div>
      <h3 className="empty-state-title">
        {hasFilters ? 'No matching logs' : 'No API calls yet'}
      </h3>
      <p className="empty-state-description">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'API calls will appear here as they happen. Make sure the inspector is enabled.'}
      </p>
    </div>
  )
}

/**
 * Individual log item component
 */
interface APICallLogItemProps {
  log: APICallLog
  verbose: boolean
  onCopy: (log: APICallLog) => void
  isCopied: boolean
}

function APICallLogItem({
  log,
  verbose,
  onCopy,
  isCopied,
}: APICallLogItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  const status = log.error
    ? 'error'
    : log.timing.endTime
      ? 'completed'
      : 'pending'
  const statusIcon = {
    error: <AlertCircleIcon />,
    completed: <CheckCircleIcon />,
    pending: <ClockIcon />,
  }[status]

  const providerClass = log.provider.toLowerCase()

  return (
    <article
      className={`api-call-log ${status} ${expanded ? 'expanded' : ''}`}
      aria-label={`${log.provider} API call to ${log.endpoint}`}
    >
      <div
        className="log-header"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded(!expanded)
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`log-details-${log.id}`}
      >
        <div className="log-info">
          <span
            className={`log-provider ${providerClass}`}
            aria-label={`Provider: ${log.provider}`}
          >
            {log.provider}
          </span>
          <span className="log-model" aria-label={`Model: ${log.model}`}>
            {log.model}
          </span>
          <span
            className="log-endpoint"
            aria-label={`Endpoint: ${log.endpoint}`}
          >
            {log.endpoint}
          </span>
        </div>
        <div className="log-metrics">
          {log.timing.duration !== undefined && (
            <span
              className="log-duration"
              aria-label={`Duration: ${log.timing.duration.toFixed(0)} milliseconds`}
            >
              {log.timing.duration.toFixed(0)}ms
            </span>
          )}
          {log.usage && (
            <span
              className="log-tokens"
              aria-label={`Tokens: ${log.usage.totalTokens}`}
            >
              {log.usage.totalTokens.toLocaleString()} tokens
            </span>
          )}
          <span
            className={`log-status ${status}`}
            aria-label={`Status: ${status}`}
          >
            {statusIcon}
          </span>
          <span className="expand-icon" aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {expanded && (
        <div
          id={`log-details-${log.id}`}
          className="log-details"
          role="region"
          aria-label="Log details"
        >
          {/* Timing Details */}
          <section className="log-section">
            <header className="log-section-header">
              <h4>Timing</h4>
              <button
                className="dt-btn dt-btn-ghost dt-btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onCopy(log)
                }}
                aria-label={isCopied ? 'Copied!' : 'Copy log to clipboard'}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </header>
            <dl className="timing-details">
              <div className="timing-item">
                <dt>Start Time</dt>
                <dd>{new Date(log.timing.startTime).toLocaleTimeString()}</dd>
              </div>
              {log.timing.endTime && (
                <div className="timing-item">
                  <dt>End Time</dt>
                  <dd>{new Date(log.timing.endTime).toLocaleTimeString()}</dd>
                </div>
              )}
              {log.timing.ttfb !== undefined && (
                <div className="timing-item">
                  <dt>Time to First Byte</dt>
                  <dd>{log.timing.ttfb.toFixed(0)}ms</dd>
                </div>
              )}
              {log.timing.duration !== undefined && (
                <div className="timing-item">
                  <dt>Total Duration</dt>
                  <dd>{log.timing.duration.toFixed(2)}ms</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Usage Details */}
          {log.usage && (
            <section className="log-section">
              <h4>Token Usage</h4>
              <dl className="usage-details">
                <div className="usage-item">
                  <dt>Prompt Tokens</dt>
                  <dd>{log.usage.promptTokens.toLocaleString()}</dd>
                </div>
                <div className="usage-item">
                  <dt>Completion Tokens</dt>
                  <dd>{log.usage.completionTokens.toLocaleString()}</dd>
                </div>
                <div className="usage-item">
                  <dt>Total Tokens</dt>
                  <dd className="highlight">
                    {log.usage.totalTokens.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </section>
          )}

          {/* Request/Response (verbose mode) */}
          {verbose && (
            <>
              <section className="log-section">
                <h4>Request</h4>
                <pre className="code-block">
                  <code>{JSON.stringify(log.request, null, 2)}</code>
                </pre>
              </section>
              {log.response && (
                <section className="log-section">
                  <h4>Response</h4>
                  <pre className="code-block">
                    <code>{JSON.stringify(log.response, null, 2)}</code>
                  </pre>
                </section>
              )}
            </>
          )}

          {/* Error Details */}
          {log.error && (
            <section className="log-section error">
              <h4>Error</h4>
              <div className="error-details">
                <p className="error-message">{log.error.message}</p>
                {log.error.code && (
                  <p className="error-code">Code: {log.error.code}</p>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </article>
  )
}
