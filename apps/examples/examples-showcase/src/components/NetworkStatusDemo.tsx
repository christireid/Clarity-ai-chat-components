/**
 * NetworkStatus Component Demonstration
 *
 * Features:
 * - Real-time connection status monitoring
 * - Offline mode simulation
 * - Sync status indicators
 * - Glassmorphism styled badges
 * - Connection recovery animations
 */

import React, { useState, useEffect } from 'react'
import './NetworkStatusDemo.css'

type ConnectionStatus = 'online' | 'offline' | 'reconnecting' | 'slow'
type SyncStatus = 'synced' | 'syncing' | 'pending' | 'failed'

interface NetworkStats {
  latency: number
  downlink: number
  rtt: number
  effectiveType: string
}

export default function NetworkStatusDemo() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online')
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    latency: 0,
    downlink: 0,
    rtt: 0,
    effectiveType: '4g'
  })
  const [pendingMessages, setPendingMessages] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState(new Date())
  const [showRecoveryAnimation, setShowRecoveryAnimation] = useState(false)

  // Monitor real network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setConnectionStatus('reconnecting')
      setShowRecoveryAnimation(true)

      // Simulate reconnection process
      setTimeout(() => {
        setConnectionStatus('online')
        if (pendingMessages > 0) {
          setSyncStatus('syncing')
          syncPendingMessages()
        }
        setTimeout(() => setShowRecoveryAnimation(false), 2000)
      }, 1500)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setConnectionStatus('offline')
      setSyncStatus('pending')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [pendingMessages])

  // Monitor connection quality
  useEffect(() => {
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection

    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkStats({
          latency: Math.random() * 100 + 10,
          downlink: connection.downlink || Math.random() * 10,
          rtt: connection.rtt || Math.random() * 100 + 20,
          effectiveType: connection.effectiveType || '4g'
        })

        // Detect slow connection
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          if (connectionStatus === 'online') {
            setConnectionStatus('slow')
          }
        }
      }

      updateNetworkInfo()
      connection.addEventListener('change', updateNetworkInfo)

      return () => {
        connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [connectionStatus])

  // Simulate periodic syncing
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'online' && syncStatus === 'synced') {
        setSyncStatus('syncing')
        setTimeout(() => {
          setSyncStatus('synced')
          setLastSyncTime(new Date())
        }, 1000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [connectionStatus, syncStatus])

  const syncPendingMessages = () => {
    let count = pendingMessages
    const syncInterval = setInterval(() => {
      if (count > 0) {
        count--
        setPendingMessages(count)
      } else {
        clearInterval(syncInterval)
        setSyncStatus('synced')
        setLastSyncTime(new Date())
      }
    }, 500)
  }

  const simulateOffline = () => {
    setConnectionStatus('offline')
    setSyncStatus('pending')
    setPendingMessages((prev) => prev + 3)
  }

  const simulateReconnect = () => {
    setConnectionStatus('reconnecting')
    setShowRecoveryAnimation(true)
    setTimeout(() => {
      setConnectionStatus('online')
      if (pendingMessages > 0) {
        setSyncStatus('syncing')
        syncPendingMessages()
      }
      setTimeout(() => setShowRecoveryAnimation(false), 2000)
    }, 1500)
  }

  const simulateSlowConnection = () => {
    setConnectionStatus('slow')
    setSyncStatus('syncing')
    setTimeout(() => {
      setConnectionStatus('online')
      setSyncStatus('synced')
    }, 3000)
  }

  const addPendingMessage = () => {
    setPendingMessages((prev) => prev + 1)
    if (connectionStatus === 'offline') {
      setSyncStatus('pending')
    }
  }

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'online':
        return '✓'
      case 'offline':
        return '✕'
      case 'reconnecting':
        return '↻'
      case 'slow':
        return '⚠'
      default:
        return '•'
    }
  }

  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case 'online':
        return 'Connected'
      case 'offline':
        return 'Offline'
      case 'reconnecting':
        return 'Reconnecting...'
      case 'slow':
        return 'Slow Connection'
      default:
        return 'Unknown'
    }
  }

  const getSyncIcon = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return '☁'
      case 'syncing':
        return '↻'
      case 'pending':
        return '⏸'
      case 'failed':
        return '✕'
      default:
        return '•'
    }
  }

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="network-status-demo">
      <div className="demo-header">
        <h1>NetworkStatus Component</h1>
        <p>Real-time connection monitoring with glassmorphism styling</p>
      </div>

      {/* Recovery Animation Overlay */}
      {showRecoveryAnimation && (
        <div className="recovery-overlay">
          <div className="recovery-content">
            <div className="recovery-icon">✓</div>
            <h3>Connection Restored</h3>
            <p>Syncing pending changes...</p>
          </div>
        </div>
      )}

      {/* Main Status Display */}
      <div className="status-display">
        <div className={`status-card glassmorphism status-${connectionStatus}`}>
          <div className="status-icon-large">
            {getStatusIcon(connectionStatus)}
          </div>
          <h2>{getStatusText(connectionStatus)}</h2>
          <div className="status-details">
            {connectionStatus === 'online' && (
              <>
                <div className="stat-item">
                  <span className="stat-label">Latency</span>
                  <span className="stat-value">{networkStats.latency.toFixed(0)}ms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Speed</span>
                  <span className="stat-value">{networkStats.downlink.toFixed(1)} Mbps</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Type</span>
                  <span className="stat-value">{networkStats.effectiveType.toUpperCase()}</span>
                </div>
              </>
            )}
            {connectionStatus === 'offline' && (
              <p className="offline-message">
                No internet connection. Changes will sync when you're back online.
              </p>
            )}
            {connectionStatus === 'slow' && (
              <p className="slow-message">
                Your connection is slow. Some features may be delayed.
              </p>
            )}
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className={`sync-badge glassmorphism sync-${syncStatus}`}>
          <div className="sync-icon">{getSyncIcon(syncStatus)}</div>
          <div className="sync-info">
            <span className="sync-label">
              {syncStatus === 'synced' && 'All changes saved'}
              {syncStatus === 'syncing' && 'Syncing...'}
              {syncStatus === 'pending' && `${pendingMessages} pending`}
              {syncStatus === 'failed' && 'Sync failed'}
            </span>
            {syncStatus === 'synced' && (
              <span className="sync-time">{formatTimeSince(lastSyncTime)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Badges Grid */}
      <div className="badges-grid">
        <div className="badge-section">
          <h3>Connection Badges</h3>
          <div className="badges">
            <div className="badge glassmorphism badge-online">
              <span className="badge-dot"></span>
              <span>Online</span>
            </div>
            <div className="badge glassmorphism badge-offline">
              <span className="badge-dot"></span>
              <span>Offline</span>
            </div>
            <div className="badge glassmorphism badge-reconnecting">
              <span className="badge-dot"></span>
              <span>Reconnecting</span>
            </div>
            <div className="badge glassmorphism badge-slow">
              <span className="badge-dot"></span>
              <span>Slow</span>
            </div>
          </div>
        </div>

        <div className="badge-section">
          <h3>Sync Indicators</h3>
          <div className="badges">
            <div className="badge glassmorphism badge-synced">
              <span className="sync-indicator">☁</span>
              <span>Synced</span>
            </div>
            <div className="badge glassmorphism badge-syncing">
              <span className="sync-indicator spinning">↻</span>
              <span>Syncing</span>
            </div>
            <div className="badge glassmorphism badge-pending">
              <span className="sync-indicator">⏸</span>
              <span>Pending</span>
            </div>
            <div className="badge glassmorphism badge-failed">
              <span className="sync-indicator">✕</span>
              <span>Failed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Messages Queue */}
      {pendingMessages > 0 && (
        <div className="pending-queue glassmorphism">
          <div className="queue-header">
            <h4>Pending Changes</h4>
            <span className="queue-count">{pendingMessages}</span>
          </div>
          <div className="queue-items">
            {Array.from({ length: Math.min(pendingMessages, 5) }).map((_, i) => (
              <div key={i} className="queue-item">
                <span className="queue-icon">📄</span>
                <span className="queue-text">Message {i + 1}</span>
                <span className="queue-status">Waiting to sync</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulation Controls */}
      <div className="simulation-controls">
        <h3>Simulation Controls</h3>
        <div className="control-grid">
          <button
            className="control-button offline-btn"
            onClick={simulateOffline}
            disabled={connectionStatus === 'offline'}
          >
            <span>✕</span>
            Simulate Offline
          </button>
          <button
            className="control-button reconnect-btn"
            onClick={simulateReconnect}
            disabled={connectionStatus === 'online'}
          >
            <span>↻</span>
            Simulate Reconnect
          </button>
          <button
            className="control-button slow-btn"
            onClick={simulateSlowConnection}
            disabled={connectionStatus !== 'online'}
          >
            <span>⚠</span>
            Simulate Slow Connection
          </button>
          <button
            className="control-button message-btn"
            onClick={addPendingMessage}
          >
            <span>+</span>
            Add Pending Message
          </button>
        </div>
      </div>

      {/* Network Stats Dashboard */}
      <div className="network-stats glassmorphism">
        <h3>Network Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <span className="stat-title">Latency</span>
              <span className="stat-number">{networkStats.latency.toFixed(0)}ms</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📶</div>
            <div className="stat-content">
              <span className="stat-title">Download</span>
              <span className="stat-number">{networkStats.downlink.toFixed(1)} Mbps</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <span className="stat-title">RTT</span>
              <span className="stat-number">{networkStats.rtt.toFixed(0)}ms</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📡</div>
            <div className="stat-content">
              <span className="stat-title">Type</span>
              <span className="stat-number">{networkStats.effectiveType.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Network Status */}
      <div className="real-status glassmorphism">
        <h4>Actual Browser Status</h4>
        <div className="real-status-info">
          <span className={`real-indicator ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '✓' : '✕'}
          </span>
          <span>{isOnline ? 'Browser is Online' : 'Browser is Offline'}</span>
        </div>
        <p className="real-status-note">
          Try disconnecting your internet to see real status changes
        </p>
      </div>

      {/* Code Examples */}
      <div className="code-examples">
        <h3>Code Examples</h3>
        <div className="code-tabs">
          <div className="code-tab">
            <h4>Basic Usage</h4>
            <pre><code>{`import { NetworkStatus } from '@clarity-chat/react'

function App() {
  return (
    <NetworkStatus
      showStats
      autoReconnect
    />
  )
}`}</code></pre>
          </div>
          <div className="code-tab">
            <h4>With Custom Handlers</h4>
            <pre><code>{`import { NetworkStatus } from '@clarity-chat/react'

function App() {
  const handleStatusChange = (status) => {
    console.log('Network status:', status)
  }

  const handleReconnect = () => {
    console.log('Reconnected!')
  }

  return (
    <NetworkStatus
      onStatusChange={handleStatusChange}
      onReconnect={handleReconnect}
      showPendingQueue
    />
  )
}`}</code></pre>
          </div>
        </div>
      </div>
    </div>
  )
}
