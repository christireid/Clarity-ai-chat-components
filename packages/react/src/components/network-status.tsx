import * as React from 'react'

/**
 * Network connection status
 */
export type NetworkConnectionStatus = 'online' | 'offline' | 'slow' | 'unstable'

/**
 * Network status props
 */
export interface NetworkStatusProps {
  /** Current connection status (auto-detected if not provided) */
  status?: NetworkConnectionStatus
  
  /** Show status indicator (default: true) */
  show?: boolean
  
  /** Position of the indicator (default: 'top-right') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  /** Show detailed connection info (default: false) */
  showDetails?: boolean
  
  /** Callback when status changes */
  onStatusChange?: (status: NetworkConnectionStatus) => void
  
  /** Custom ping endpoint for connectivity check (default: '/api/ping') */
  pingEndpoint?: string
  
  /** Ping interval in ms (default: 30000) */
  pingInterval?: number
  
  /** Threshold for slow connection in ms (default: 1000) */
  slowThreshold?: number
  
  /** Custom CSS class */
  className?: string
}

/**
 * Status colors and labels
 */
const STATUS_CONFIG = {
  online: {
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-300',
    label: 'Online',
    icon: '✓',
  },
  offline: {
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-300',
    label: 'Offline',
    icon: '✕',
  },
  slow: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    label: 'Slow Connection',
    icon: '⚠',
  },
  unstable: {
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300',
    label: 'Unstable',
    icon: '~',
  },
}

/**
 * Production-ready Network Status indicator component.
 * 
 * **Features:**
 * - Auto-detection of network status using Navigator API
 * - Periodic connectivity checks via ping endpoint
 * - Connection quality measurement (fast/slow/unstable)
 * - Visual indicator with status colors
 * - Optional detailed connection info (RTT, downlink speed)
 * - Customizable position and appearance
 * - Accessibility support (ARIA live regions)
 * 
 * **Use Cases:**
 * - Show connection status during chat streaming
 * - Warn users before sending messages on poor connection
 * - Auto-pause streaming on network loss
 * - Display reconnection status
 * 
 * @example
 * ```tsx
 * // Basic usage (auto-detection)
 * <NetworkStatus />
 * 
 * // Custom position and details
 * <NetworkStatus
 *   position="bottom-right"
 *   showDetails={true}
 *   onStatusChange={(status) => {
 *     if (status === 'offline') {
 *       pauseStreaming()
 *     }
 *   }}
 * />
 * 
 * // With custom ping endpoint
 * <NetworkStatus
 *   pingEndpoint="/api/health"
 *   pingInterval={10000} // Check every 10s
 *   slowThreshold={500}  // >500ms = slow
 * />
 * 
 * // Controlled status
 * const [status, setStatus] = useState<NetworkConnectionStatus>('online')
 * 
 * <NetworkStatus
 *   status={status}
 *   show={status !== 'online'} // Only show when not online
 * />
 * ```
 */
export function NetworkStatus({
  status: externalStatus,
  show = true,
  position = 'top-right',
  showDetails = false,
  onStatusChange,
  pingEndpoint = '/api/ping',
  pingInterval = 30000,
  slowThreshold = 1000,
  className = '',
}: NetworkStatusProps) {
  const [internalStatus, setInternalStatus] = React.useState<NetworkConnectionStatus>('online')
  const [latency, setLatency] = React.useState<number | null>(null)
  const [downlinkSpeed, setDownlinkSpeed] = React.useState<number | null>(null)
  const pingIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const status = externalStatus ?? internalStatus

  /**
   * Check connection quality via ping
   */
  const checkConnection = React.useCallback(async () => {
    const startTime = performance.now()

    try {
      const response = await fetch(pingEndpoint, {
        method: 'HEAD',
        cache: 'no-cache',
      })

      const endTime = performance.now()
      const rtt = endTime - startTime

      setLatency(rtt)

      // Determine status based on response time
      if (response.ok) {
        if (rtt > slowThreshold) {
          setInternalStatus('slow')
        } else {
          setInternalStatus('online')
        }
      } else {
        setInternalStatus('unstable')
      }
    } catch (error) {
      console.error('[NetworkStatus] Ping failed:', error)
      setInternalStatus('offline')
      setLatency(null)
    }
  }, [pingEndpoint, slowThreshold])

  /**
   * Handle online event
   */
  const handleOnline = React.useCallback(() => {
    console.log('[NetworkStatus] Network online')
    setInternalStatus('online')
    checkConnection()
  }, [checkConnection])

  /**
   * Handle offline event
   */
  const handleOffline = React.useCallback(() => {
    console.log('[NetworkStatus] Network offline')
    setInternalStatus('offline')
    setLatency(null)
  }, [])

  /**
   * Get connection info from Navigator API
   */
  const updateConnectionInfo = React.useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        setDownlinkSpeed(connection.downlink)

        // Check effective connection type
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setInternalStatus('slow')
        } else if (connection.effectiveType === '3g') {
          setInternalStatus('unstable')
        }
      }
    }
  }, [])

  /**
   * Initialize network monitoring
   */
  React.useEffect(() => {
    // Initial check
    updateConnectionInfo()
    checkConnection()

    // Listen to online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen to connection changes (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        connection.addEventListener('change', updateConnectionInfo)
      }
    }

    // Start periodic ping checks
    pingIntervalRef.current = setInterval(checkConnection, pingInterval)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        if (connection) {
          connection.removeEventListener('change', updateConnectionInfo)
        }
      }

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
    }
  }, [checkConnection, handleOnline, handleOffline, updateConnectionInfo, pingInterval])

  /**
   * Notify status changes
   */
  React.useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  // Don't render if show is false
  if (!show) {
    return null
  }

  const config = STATUS_CONFIG[status]

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Network status: ${config.label}`}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Status indicator dot */}
        <div className="relative">
          <div className={`w-3 h-3 ${config.color} rounded-full`} />
          {status === 'online' && (
            <div className={`absolute inset-0 w-3 h-3 ${config.color} rounded-full animate-ping opacity-75`} />
          )}
        </div>

        {/* Status label */}
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>

        {/* Details (optional) */}
        {showDetails && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2">
            {latency !== null && (
              <span>
                {latency.toFixed(0)}ms
              </span>
            )}
            {downlinkSpeed !== null && (
              <span>
                {downlinkSpeed.toFixed(1)} Mbps
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
