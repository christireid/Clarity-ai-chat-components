/**
 * Error Handling Demonstrations
 *
 * Interactive showcase of error recovery patterns, retry logic,
 * fallback strategies, and error monitoring with glassmorphism UI
 */

import React, { useState, useEffect, useCallback } from 'react'
import { AlertCircle, RefreshCw, CheckCircle, XCircle, AlertTriangle, Activity, Clock, Zap } from 'lucide-react'
import './ErrorHandlingDemo.css'

// ============================================================================
// Error Types and Utilities
// ============================================================================

type ErrorType = 'network' | 'timeout' | 'rate-limit' | 'server' | 'validation'

interface ErrorLog {
  id: string
  type: ErrorType
  message: string
  timestamp: Date
  recovered: boolean
  attempts: number
  recoveryStrategy?: string
}

interface RetryConfig {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}

// ============================================================================
// Error Recovery Patterns Demo
// ============================================================================

const ErrorRecoveryDemo: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [recoveryStrategy, setRecoveryStrategy] = useState<'retry' | 'fallback' | 'graceful'>('retry')
  const [attempts, setAttempts] = useState(0)

  const simulateOperation = async (shouldFail: boolean = false) => {
    setStatus('loading')
    setAttempts(prev => prev + 1)

    await new Promise(resolve => setTimeout(resolve, 1500))

    if (shouldFail) {
      setStatus('error')
      setErrorMessage('API request failed: Connection timeout')

      // Auto-recovery based on strategy
      setTimeout(() => {
        handleRecovery(recoveryStrategy)
      }, 2000)
    } else {
      setStatus('success')
      setErrorMessage('')
      setTimeout(() => {
        setStatus('idle')
        setAttempts(0)
      }, 3000)
    }
  }

  const handleRecovery = (strategy: string) => {
    switch (strategy) {
      case 'retry':
        if (attempts < 3) {
          simulateOperation(attempts < 2) // Succeed on 3rd attempt
        } else {
          setStatus('error')
          setErrorMessage('Maximum retry attempts reached')
        }
        break
      case 'fallback':
        setStatus('success')
        setErrorMessage('Using fallback data source')
        setTimeout(() => setStatus('idle'), 3000)
        break
      case 'graceful':
        setStatus('idle')
        setErrorMessage('Operation cancelled - graceful degradation')
        setTimeout(() => setErrorMessage(''), 3000)
        break
    }
  }

  return (
    <div className="glass-card demo-section">
      <div className="demo-header">
        <AlertCircle className="demo-icon" />
        <h3>Error Recovery Patterns</h3>
      </div>

      <div className="demo-content">
        <div className="strategy-selector">
          <label>Recovery Strategy:</label>
          <div className="button-group">
            <button
              className={`strategy-btn ${recoveryStrategy === 'retry' ? 'active' : ''}`}
              onClick={() => setRecoveryStrategy('retry')}
            >
              <RefreshCw size={16} />
              Retry
            </button>
            <button
              className={`strategy-btn ${recoveryStrategy === 'fallback' ? 'active' : ''}`}
              onClick={() => setRecoveryStrategy('fallback')}
            >
              <Zap size={16} />
              Fallback
            </button>
            <button
              className={`strategy-btn ${recoveryStrategy === 'graceful' ? 'active' : ''}`}
              onClick={() => setRecoveryStrategy('graceful')}
            >
              <CheckCircle size={16} />
              Graceful
            </button>
          </div>
        </div>

        <div className="operation-display">
          <div className={`status-badge status-${status}`}>
            {status === 'loading' && <RefreshCw className="spin" size={16} />}
            {status === 'success' && <CheckCircle size={16} />}
            {status === 'error' && <XCircle size={16} />}
            {status === 'idle' && <Activity size={16} />}
            <span>{status.toUpperCase()}</span>
          </div>

          {attempts > 0 && (
            <div className="attempts-badge">
              Attempt {attempts}
            </div>
          )}

          {errorMessage && (
            <div className={`message-box ${status === 'error' ? 'error' : 'info'}`}>
              {errorMessage}
            </div>
          )}
        </div>

        <div className="demo-actions">
          <button
            className="action-btn success"
            onClick={() => simulateOperation(false)}
            disabled={status === 'loading'}
          >
            Trigger Success
          </button>
          <button
            className="action-btn error"
            onClick={() => simulateOperation(true)}
            disabled={status === 'loading'}
          >
            Trigger Error
          </button>
        </div>

        <div className="strategy-info">
          <h4>Strategy Details:</h4>
          {recoveryStrategy === 'retry' && (
            <p>Automatically retries failed operations with exponential backoff (max 3 attempts)</p>
          )}
          {recoveryStrategy === 'fallback' && (
            <p>Switches to alternative data source or cached data when primary fails</p>
          )}
          {recoveryStrategy === 'graceful' && (
            <p>Degrades functionality gracefully without blocking user experience</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Retry Logic with Exponential Backoff Demo
// ============================================================================

const RetryLogicDemo: React.FC = () => {
  const [isRetrying, setIsRetrying] = useState(false)
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [nextRetryIn, setNextRetryIn] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [config, setConfig] = useState<RetryConfig>({
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2
  })

  const calculateDelay = (attempt: number): number => {
    const delay = Math.min(
      config.initialDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    )
    return delay
  }

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const executeRetry = async () => {
    setIsRetrying(true)
    setCurrentAttempt(0)
    setLogs([])
    addLog('Starting retry sequence...')

    for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
      setCurrentAttempt(attempt + 1)
      addLog(`Attempt ${attempt + 1}/${config.maxAttempts}`)

      // Simulate API call
      const success = Math.random() > 0.7 || attempt === config.maxAttempts - 1

      await new Promise(resolve => setTimeout(resolve, 500))

      if (success) {
        addLog('✓ Operation succeeded!')
        setIsRetrying(false)
        return
      }

      addLog(`✗ Attempt ${attempt + 1} failed`)

      if (attempt < config.maxAttempts - 1) {
        const delay = calculateDelay(attempt)
        addLog(`Waiting ${delay}ms before retry...`)

        // Countdown timer
        for (let i = delay; i > 0; i -= 100) {
          setNextRetryIn(i)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } else {
        addLog('✗ All retry attempts exhausted')
      }
    }

    setIsRetrying(false)
  }

  return (
    <div className="glass-card demo-section">
      <div className="demo-header">
        <RefreshCw className="demo-icon" />
        <h3>Retry Logic with Exponential Backoff</h3>
      </div>

      <div className="demo-content">
        <div className="config-panel">
          <div className="config-row">
            <label>Max Attempts:</label>
            <input
              type="number"
              value={config.maxAttempts}
              onChange={(e) => setConfig(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
              min="1"
              max="10"
              disabled={isRetrying}
            />
          </div>
          <div className="config-row">
            <label>Initial Delay (ms):</label>
            <input
              type="number"
              value={config.initialDelay}
              onChange={(e) => setConfig(prev => ({ ...prev, initialDelay: parseInt(e.target.value) }))}
              min="100"
              max="5000"
              step="100"
              disabled={isRetrying}
            />
          </div>
          <div className="config-row">
            <label>Backoff Multiplier:</label>
            <input
              type="number"
              value={config.backoffMultiplier}
              onChange={(e) => setConfig(prev => ({ ...prev, backoffMultiplier: parseFloat(e.target.value) }))}
              min="1"
              max="5"
              step="0.5"
              disabled={isRetrying}
            />
          </div>
          <div className="config-row">
            <label>Max Delay (ms):</label>
            <input
              type="number"
              value={config.maxDelay}
              onChange={(e) => setConfig(prev => ({ ...prev, maxDelay: parseInt(e.target.value) }))}
              min="1000"
              max="60000"
              step="1000"
              disabled={isRetrying}
            />
          </div>
        </div>

        <div className="retry-visualization">
          {isRetrying && (
            <div className="retry-progress">
              <div className="progress-info">
                <span>Attempt {currentAttempt}/{config.maxAttempts}</span>
                {nextRetryIn > 0 && (
                  <span className="countdown">Next retry in {Math.ceil(nextRetryIn / 1000)}s</span>
                )}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentAttempt / config.maxAttempts) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="backoff-preview">
            <h4>Retry Delays:</h4>
            <div className="delay-timeline">
              {Array.from({ length: config.maxAttempts }, (_, i) => (
                <div
                  key={i}
                  className={`delay-point ${currentAttempt === i + 1 ? 'active' : ''}`}
                >
                  <span className="attempt-num">{i + 1}</span>
                  {i < config.maxAttempts - 1 && (
                    <span className="delay-time">{calculateDelay(i)}ms</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="action-btn primary"
          onClick={executeRetry}
          disabled={isRetrying}
        >
          {isRetrying ? 'Retrying...' : 'Start Retry Sequence'}
        </button>

        <div className="log-viewer">
          <h4>Execution Log:</h4>
          <div className="log-content">
            {logs.length === 0 ? (
              <p className="log-empty">No logs yet - click "Start Retry Sequence"</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="log-entry">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Fallback Strategies Demo
// ============================================================================

const FallbackStrategiesDemo: React.FC = () => {
  const [activeStrategy, setActiveStrategy] = useState<'cache' | 'default' | 'alternative' | 'degraded'>('cache')
  const [isPrimaryFailing, setIsPrimaryFailing] = useState(false)
  const [dataSource, setDataSource] = useState('Primary API')
  const [responseTime, setResponseTime] = useState(0)
  const [dataQuality, setDataQuality] = useState<'high' | 'medium' | 'low'>('high')

  const executeWithFallback = async () => {
    setResponseTime(0)
    const startTime = Date.now()

    // Try primary
    await new Promise(resolve => setTimeout(resolve, 500))

    if (isPrimaryFailing) {
      // Primary failed, use fallback
      await new Promise(resolve => setTimeout(resolve, 200))

      switch (activeStrategy) {
        case 'cache':
          setDataSource('Cached Data')
          setDataQuality('medium')
          break
        case 'default':
          setDataSource('Default Values')
          setDataQuality('low')
          break
        case 'alternative':
          setDataSource('Alternative API')
          setDataQuality('high')
          break
        case 'degraded':
          setDataSource('Degraded Mode')
          setDataQuality('low')
          break
      }
    } else {
      setDataSource('Primary API')
      setDataQuality('high')
    }

    setResponseTime(Date.now() - startTime)
  }

  useEffect(() => {
    executeWithFallback()
  }, [isPrimaryFailing, activeStrategy])

  return (
    <div className="glass-card demo-section">
      <div className="demo-header">
        <Zap className="demo-icon" />
        <h3>Fallback Strategies</h3>
      </div>

      <div className="demo-content">
        <div className="fallback-control">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isPrimaryFailing}
              onChange={(e) => setIsPrimaryFailing(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Simulate Primary Failure</span>
          </label>
        </div>

        <div className="fallback-selector">
          <h4>Fallback Strategy:</h4>
          <div className="strategy-grid">
            <button
              className={`strategy-card ${activeStrategy === 'cache' ? 'active' : ''}`}
              onClick={() => setActiveStrategy('cache')}
            >
              <Activity size={24} />
              <span>Cache Fallback</span>
              <small>Use cached data</small>
            </button>
            <button
              className={`strategy-card ${activeStrategy === 'default' ? 'active' : ''}`}
              onClick={() => setActiveStrategy('default')}
            >
              <CheckCircle size={24} />
              <span>Default Values</span>
              <small>Use safe defaults</small>
            </button>
            <button
              className={`strategy-card ${activeStrategy === 'alternative' ? 'active' : ''}`}
              onClick={() => setActiveStrategy('alternative')}
            >
              <RefreshCw size={24} />
              <span>Alternative API</span>
              <small>Switch provider</small>
            </button>
            <button
              className={`strategy-card ${activeStrategy === 'degraded' ? 'active' : ''}`}
              onClick={() => setActiveStrategy('degraded')}
            >
              <AlertTriangle size={24} />
              <span>Degraded Mode</span>
              <small>Limited features</small>
            </button>
          </div>
        </div>

        <div className="fallback-status">
          <div className="status-card">
            <h4>Current Data Source</h4>
            <div className={`source-badge source-${dataQuality}`}>
              {dataSource}
            </div>
          </div>
          <div className="status-card">
            <h4>Response Time</h4>
            <div className="metric-value">{responseTime}ms</div>
          </div>
          <div className="status-card">
            <h4>Data Quality</h4>
            <div className={`quality-badge quality-${dataQuality}`}>
              {dataQuality.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="strategy-explanation">
          <h4>How It Works:</h4>
          {activeStrategy === 'cache' && (
            <p>Returns previously cached data when the primary API fails. Fast but potentially stale.</p>
          )}
          {activeStrategy === 'default' && (
            <p>Uses predefined default values as a last resort. Always works but provides minimal functionality.</p>
          )}
          {activeStrategy === 'alternative' && (
            <p>Automatically switches to a backup API provider. Maintains quality but may have higher latency.</p>
          )}
          {activeStrategy === 'degraded' && (
            <p>Continues operating with reduced functionality. Some features disabled but core works.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Error Logging and Monitoring Demo
// ============================================================================

const ErrorMonitoringDemo: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [errorRate, setErrorRate] = useState(0)
  const [recoveryRate, setRecoveryRate] = useState(0)
  const [filter, setFilter] = useState<ErrorType | 'all'>('all')

  const generateError = (type: ErrorType) => {
    const errorMessages = {
      network: 'Network connection failed',
      timeout: 'Request timeout after 30s',
      'rate-limit': 'API rate limit exceeded',
      server: 'Internal server error (500)',
      validation: 'Invalid request parameters'
    }

    const newError: ErrorLog = {
      id: Date.now().toString(),
      type,
      message: errorMessages[type],
      timestamp: new Date(),
      recovered: Math.random() > 0.5,
      attempts: Math.floor(Math.random() * 3) + 1,
      recoveryStrategy: ['retry', 'fallback', 'graceful'][Math.floor(Math.random() * 3)]
    }

    setErrorLogs(prev => [newError, ...prev.slice(0, 49)]) // Keep last 50
  }

  const simulateTraffic = useCallback(() => {
    if (!isMonitoring) return

    const errorTypes: ErrorType[] = ['network', 'timeout', 'rate-limit', 'server', 'validation']
    const randomType = errorTypes[Math.floor(Math.random() * errorTypes.length)]

    if (Math.random() > 0.7) { // 30% error rate
      generateError(randomType)
    }
  }, [isMonitoring])

  useEffect(() => {
    const interval = setInterval(simulateTraffic, 3000)
    return () => clearInterval(interval)
  }, [simulateTraffic])

  useEffect(() => {
    if (errorLogs.length > 0) {
      const total = errorLogs.length
      const recovered = errorLogs.filter(e => e.recovered).length
      setErrorRate((total / (total + 100)) * 100) // Simulate total requests
      setRecoveryRate((recovered / total) * 100)
    }
  }, [errorLogs])

  const filteredLogs = filter === 'all'
    ? errorLogs
    : errorLogs.filter(log => log.type === filter)

  const getErrorTypeStats = () => {
    const stats: Record<ErrorType, number> = {
      network: 0,
      timeout: 0,
      'rate-limit': 0,
      server: 0,
      validation: 0
    }
    errorLogs.forEach(log => {
      stats[log.type]++
    })
    return stats
  }

  return (
    <div className="glass-card demo-section monitoring-section">
      <div className="demo-header">
        <Activity className="demo-icon" />
        <h3>Error Logging & Monitoring</h3>
      </div>

      <div className="demo-content">
        <div className="monitoring-controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isMonitoring}
              onChange={(e) => setIsMonitoring(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Live Monitoring</span>
          </label>
          <button
            className="action-btn error"
            onClick={() => setErrorLogs([])}
          >
            Clear Logs
          </button>
        </div>

        <div className="metrics-dashboard">
          <div className="metric-card">
            <div className="metric-icon">
              <XCircle />
            </div>
            <div className="metric-info">
              <span className="metric-label">Error Rate</span>
              <span className="metric-value">{errorRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon success">
              <CheckCircle />
            </div>
            <div className="metric-info">
              <span className="metric-label">Recovery Rate</span>
              <span className="metric-value">{recoveryRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <AlertCircle />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Errors</span>
              <span className="metric-value">{errorLogs.length}</span>
            </div>
          </div>
        </div>

        <div className="error-type-stats">
          <h4>Errors by Type:</h4>
          <div className="stats-grid">
            {Object.entries(getErrorTypeStats()).map(([type, count]) => (
              <div key={type} className="stat-item">
                <span className="stat-label">{type}</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${(count / errorLogs.length) * 100}%` }}
                  />
                </div>
                <span className="stat-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="error-generator">
          <h4>Generate Test Errors:</h4>
          <div className="button-group">
            <button onClick={() => generateError('network')} className="error-type-btn">
              Network
            </button>
            <button onClick={() => generateError('timeout')} className="error-type-btn">
              Timeout
            </button>
            <button onClick={() => generateError('rate-limit')} className="error-type-btn">
              Rate Limit
            </button>
            <button onClick={() => generateError('server')} className="error-type-btn">
              Server
            </button>
            <button onClick={() => generateError('validation')} className="error-type-btn">
              Validation
            </button>
          </div>
        </div>

        <div className="log-filter">
          <label>Filter by Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Types</option>
            <option value="network">Network</option>
            <option value="timeout">Timeout</option>
            <option value="rate-limit">Rate Limit</option>
            <option value="server">Server</option>
            <option value="validation">Validation</option>
          </select>
        </div>

        <div className="error-log-viewer">
          <h4>Error Log ({filteredLogs.length} entries):</h4>
          <div className="log-list">
            {filteredLogs.length === 0 ? (
              <div className="log-empty">
                No errors logged yet. {isMonitoring ? 'Monitoring...' : 'Start monitoring to capture errors.'}
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className={`error-log-entry ${log.recovered ? 'recovered' : 'failed'}`}>
                  <div className="log-header">
                    <span className={`error-type-badge type-${log.type}`}>
                      {log.type}
                    </span>
                    <span className="log-timestamp">
                      <Clock size={14} />
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="log-message">{log.message}</div>
                  <div className="log-footer">
                    <span className="log-attempts">Attempts: {log.attempts}</span>
                    {log.recovered && log.recoveryStrategy && (
                      <span className="log-recovery">
                        Recovered via {log.recoveryStrategy}
                      </span>
                    )}
                    {log.recovered ? (
                      <CheckCircle className="log-status success" size={16} />
                    ) : (
                      <XCircle className="log-status error" size={16} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Error Handling Demo Component
// ============================================================================

export default function ErrorHandlingDemo() {
  return (
    <div className="error-handling-demo">
      <div className="demo-hero">
        <h1>Error Handling & Recovery</h1>
        <p>
          Interactive demonstrations of production-ready error handling patterns,
          retry logic, fallback strategies, and real-time monitoring
        </p>
      </div>

      <div className="demo-grid">
        <ErrorRecoveryDemo />
        <RetryLogicDemo />
        <FallbackStrategiesDemo />
        <ErrorMonitoringDemo />
      </div>

      <div className="demo-footer">
        <div className="info-card">
          <h3>Best Practices</h3>
          <ul>
            <li>Always implement exponential backoff for retries</li>
            <li>Set maximum retry limits to prevent infinite loops</li>
            <li>Use circuit breakers for failing services</li>
            <li>Log all errors with context for debugging</li>
            <li>Provide graceful degradation when possible</li>
            <li>Monitor error rates and recovery success</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
