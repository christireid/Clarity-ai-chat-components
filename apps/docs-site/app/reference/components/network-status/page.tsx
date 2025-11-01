import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network Status Component | Clarity Chat',
  description: 'Real-time network connection status indicator with auto-detection, quality measurement, and customizable positioning.',
  keywords: [
    'network status',
    'connection indicator',
    'online offline',
    'network monitoring',
    'connectivity check',
    'ping endpoint',
    'latency monitoring',
    'connection quality',
    'clarity chat',
    'react component',
  ],
}

export default function NetworkStatusPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Network Status</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A production-ready network status indicator with auto-detection, periodic connectivity 
        checks, connection quality measurement, and customizable appearance.
      </p>

      {/* Overview Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Network Status component provides real-time monitoring of network connectivity and 
          connection quality. It uses the Navigator API for automatic detection, performs periodic 
          ping checks to verify connectivity, measures latency and downlink speed, and displays 
          status with color-coded indicators. The component can detect online, offline, slow, and 
          unstable connection states.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Auto-detection of network status using Navigator API</li>
          <li>Periodic connectivity checks via customizable ping endpoint</li>
          <li>Connection quality measurement (online, offline, slow, unstable)</li>
          <li>Latency (RTT) measurement with configurable slow threshold</li>
          <li>Downlink speed monitoring when available</li>
          <li>Four connection states with visual indicators and colors</li>
          <li>Customizable position (top-left, top-right, bottom-left, bottom-right)</li>
          <li>Optional detailed view showing latency and speed metrics</li>
          <li>Status change callbacks for integration with app logic</li>
          <li>ARIA live region support for accessibility</li>
        </ul>
      </section>

      {/* Installation Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Installation</h2>
        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm">
            npm install @clarity-chat/react
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          No additional dependencies required - uses standard browser APIs.
        </p>
      </section>

      {/* Basic Usage Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'

function App() {
  return (
    <div>
      {/* Basic usage with auto-detection */}
      <NetworkStatus />
      
      {/* Custom position and detailed view */}
      <NetworkStatus
        position="bottom-right"
        showDetails={true}
      />
      
      {/* Only show when not online */}
      <NetworkStatus
        show={status !== 'online'}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Props API Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props API</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">status</td>
                <td className="p-2 font-mono text-sm">NetworkConnectionStatus</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Controlled status override (auto-detected if not provided)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">show</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2 font-mono text-sm">true</td>
                <td className="p-2">Whether to show the status indicator</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">position</td>
                <td className="p-2 font-mono text-sm">Position</td>
                <td className="p-2 font-mono text-sm">'top-right'</td>
                <td className="p-2">Position of the indicator on screen</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">showDetails</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2 font-mono text-sm">false</td>
                <td className="p-2">Show detailed connection info (latency, speed)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onStatusChange</td>
                <td className="p-2 font-mono text-sm">(status) =&gt; void</td>
                <td className="p-2 font-mono text-sm">undefined</td>
                <td className="p-2">Callback when connection status changes</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">pingEndpoint</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">'/api/ping'</td>
                <td className="p-2">Custom endpoint for connectivity checks</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">pingInterval</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2 font-mono text-sm">30000</td>
                <td className="p-2">Ping check interval in milliseconds</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">slowThreshold</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2 font-mono text-sm">1000</td>
                <td className="p-2">Latency threshold in ms for slow connection</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2 font-mono text-sm">''</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Definitions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Type Definitions</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Connection status types
type NetworkConnectionStatus = 
  | 'online'    // Connected and responsive
  | 'offline'   // No connection
  | 'slow'      // Connected but slow (>slowThreshold)
  | 'unstable'  // Intermittent connection issues

// Position options
type Position = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'

interface NetworkStatusProps {
  status?: NetworkConnectionStatus
  show?: boolean
  position?: Position
  showDetails?: boolean
  onStatusChange?: (status: NetworkConnectionStatus) => void
  pingEndpoint?: string
  pingInterval?: number
  slowThreshold?: number
  className?: string
}

// Status configuration
const STATUS_CONFIG = {
  online: {
    color: 'bg-green-500',      // Green indicator
    textColor: 'text-green-700',
    label: 'Online',
    icon: '✓'
  },
  offline: {
    color: 'bg-red-500',        // Red indicator
    textColor: 'text-red-700',
    label: 'Offline',
    icon: '✕'
  },
  slow: {
    color: 'bg-yellow-500',     // Yellow indicator
    textColor: 'text-yellow-700',
    label: 'Slow Connection',
    icon: '⚠'
  },
  unstable: {
    color: 'bg-orange-500',     // Orange indicator
    textColor: 'text-orange-700',
    label: 'Unstable',
    icon: '~'
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Chat Integration Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Chat Integration Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'
import { useState } from 'react'

function ChatInterface() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [networkStatus, setNetworkStatus] = useState('online')
  const [messages, setMessages] = useState([])

  const handleNetworkChange = (status) => {
    console.log('Network status changed:', status)
    setNetworkStatus(status)

    // Pause streaming if connection is lost
    if (status === 'offline' && isStreaming) {
      setIsStreaming(false)
      alert('Connection lost. Streaming paused.')
    }

    // Warn about slow connection
    if (status === 'slow') {
      console.warn('Slow connection detected. Response may be delayed.')
    }
  }

  const sendMessage = async (text) => {
    // Prevent sending on offline
    if (networkStatus === 'offline') {
      alert('Cannot send message while offline')
      return
    }

    // Warn on slow connection
    if (networkStatus === 'slow') {
      const proceed = confirm(
        'Your connection is slow. Message may take longer to send. Continue?'
      )
      if (!proceed) return
    }

    try {
      setIsStreaming(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text })
      })
      // Handle response...
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="chat-container">
      {/* Network status indicator */}
      <NetworkStatus
        position="top-right"
        showDetails={true}
        onStatusChange={handleNetworkChange}
        pingEndpoint="/api/health"
        pingInterval={10000}  // Check every 10 seconds
        slowThreshold={500}   // >500ms is slow
      />

      {/* Chat messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.text}</div>
        ))}
      </div>

      {/* Input disabled when offline */}
      <input
        type="text"
        disabled={networkStatus === 'offline'}
        placeholder={
          networkStatus === 'offline'
            ? 'Offline - Cannot send messages'
            : 'Type a message...'
        }
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value)
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Auto-Reconnect Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Auto-Reconnect Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'
import { useState, useEffect, useRef } from 'react'

function AutoReconnectApp() {
  const [connectionStatus, setConnectionStatus] = useState('online')
  const [reconnecting, setReconnecting] = useState(false)
  const wsRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8080')
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected')
      reconnectAttempts.current = 0
      setReconnecting(false)
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected')
      setReconnecting(true)
    }

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const handleNetworkStatusChange = (status) => {
    setConnectionStatus(status)

    if (status === 'offline') {
      // Close WebSocket when offline
      wsRef.current?.close()
      setReconnecting(false)
    } else if (status === 'online') {
      // Attempt to reconnect when back online
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        attemptReconnect()
      }
    }
  }

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      setReconnecting(false)
      return
    }

    setReconnecting(true)
    reconnectAttempts.current++

    // Exponential backoff
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
    
    setTimeout(() => {
      console.log(\`Reconnection attempt \${reconnectAttempts.current}\`)
      connectWebSocket()
    }, delay)
  }

  useEffect(() => {
    connectWebSocket()
    return () => wsRef.current?.close()
  }, [])

  return (
    <div className="app">
      <NetworkStatus
        position="top-right"
        showDetails={true}
        onStatusChange={handleNetworkStatusChange}
        pingInterval={5000}
      />

      {reconnecting && (
        <div className="fixed top-16 right-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            Reconnecting... (Attempt {reconnectAttempts.current})
          </p>
        </div>
      )}

      {connectionStatus === 'offline' && (
        <div className="fixed top-16 right-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-900">
            Connection lost. Will reconnect when back online.
          </p>
        </div>
      )}
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Custom Ping Endpoint Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Custom Ping Endpoint Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'

// Backend: API route for health check
// pages/api/health.ts
export default async function handler(req, res) {
  if (req.method === 'HEAD') {
    // Quick response for ping checks
    res.status(200).end()
  } else {
    res.status(200).json({
      status: 'healthy',
      timestamp: Date.now(),
      version: '1.0.0'
    })
  }
}

// Frontend: Use custom health endpoint
function App() {
  const handleStatusChange = (status) => {
    // Log to analytics
    if (window.gtag) {
      window.gtag('event', 'network_status_change', {
        event_category: 'Network',
        event_label: status,
        value: status === 'online' ? 1 : 0
      })
    }

    // Store in localStorage for debugging
    localStorage.setItem('last_network_status', JSON.stringify({
      status,
      timestamp: Date.now()
    }))
  }

  return (
    <div>
      <NetworkStatus
        pingEndpoint="/api/health"
        pingInterval={15000}     // Check every 15 seconds
        slowThreshold={750}      // >750ms is slow for health endpoint
        showDetails={true}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Conditional Display Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Conditional Display Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'
import { useState } from 'react'

function ConditionalNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState('online')
  const [showAlways, setShowAlways] = useState(false)

  return (
    <div>
      {/* Only show when there's an issue (or user wants to see it) */}
      <NetworkStatus
        show={showAlways || networkStatus !== 'online'}
        position="top-right"
        showDetails={true}
        onStatusChange={setNetworkStatus}
      />

      {/* Settings toggle */}
      <div className="settings">
        <label>
          <input
            type="checkbox"
            checked={showAlways}
            onChange={(e) => setShowAlways(e.target.checked)}
          />
          Always show network status
        </label>
      </div>

      {/* Banner for severe issues */}
      {networkStatus === 'offline' && (
        <div className="banner offline-banner">
          <strong>No Internet Connection</strong>
          <p>Please check your connection and try again.</p>
        </div>
      )}

      {networkStatus === 'slow' && (
        <div className="banner slow-banner">
          <strong>Slow Connection Detected</strong>
          <p>Some features may be slower than usual.</p>
        </div>
      )}
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* TypeScript Support Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">TypeScript Support</h2>
        <p className="text-muted-foreground mb-4">
          The component is fully typed with comprehensive TypeScript definitions:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import type { 
  NetworkStatusProps,
  NetworkConnectionStatus 
} from '@clarity-chat/react'
import { NetworkStatus } from '@clarity-chat/react'

// Type-safe props
const statusConfig: NetworkStatusProps = {
  position: 'bottom-right',
  showDetails: true,
  pingInterval: 10000,
  slowThreshold: 500,
  onStatusChange: (status: NetworkConnectionStatus) => {
    console.log('Status changed to:', status)
  }
}

function TypedNetworkMonitor() {
  const [status, setStatus] = useState<NetworkConnectionStatus>('online')

  const handleStatusChange = (newStatus: NetworkConnectionStatus) => {
    setStatus(newStatus)
    
    // Type-safe status checks
    if (newStatus === 'offline') {
      // Handle offline
    } else if (newStatus === 'slow') {
      // Handle slow connection
    }
  }

  return (
    <NetworkStatus
      {...statusConfig}
      status={status}
      onStatusChange={handleStatusChange}
    />
  )
}

// Custom hook with types
function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkConnectionStatus>('online')
  const [latency, setLatency] = useState<number | null>(null)

  return {
    status,
    latency,
    isOnline: status === 'online',
    isOffline: status === 'offline',
    isSlow: status === 'slow' || status === 'unstable'
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility</h2>
        <p className="text-muted-foreground mb-4">
          The Network Status component implements comprehensive accessibility features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>ARIA Live Region:</strong> role="status" with aria-live="polite" for status announcements</li>
          <li><strong>ARIA Labels:</strong> Descriptive aria-label for screen reader context</li>
          <li><strong>Color Independence:</strong> Status conveyed through text and icons, not just color</li>
          <li><strong>High Contrast:</strong> Color combinations meet WCAG AA standards</li>
          <li><strong>Semantic Markup:</strong> Proper use of status role for assistive technologies</li>
          <li><strong>Visual Indicators:</strong> Multiple visual cues (color, text, icon, animation)</li>
          <li><strong>Focus Management:</strong> Component doesn't trap focus or interfere with navigation</li>
        </ul>

        <div className="bg-muted p-6 rounded-lg mt-4">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Accessibility implementation
<div
  className="network-status"
  role="status"
  aria-live="polite"
  aria-label="Network status: Online"
>
  <div className="indicator">
    <div className="dot bg-green-500" aria-hidden="true" />
    <span className="label">Online</span>
  </div>
  
  {showDetails && (
    <div className="details">
      <span aria-label="Latency: 45 milliseconds">45ms</span>
      <span aria-label="Download speed: 5.2 megabits per second">
        5.2 Mbps
      </span>
    </div>
  )}
</div>`}</code>
          </pre>
        </div>
      </section>

      {/* Styling Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Styling</h2>
        <p className="text-muted-foreground mb-4">
          Customize the appearance using the className prop or by overriding default styles:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { NetworkStatus } from '@clarity-chat/react'

function StyledNetworkStatus() {
  return (
    <NetworkStatus
      position="bottom-right"
      showDetails={true}
      className="custom-network-status"
    />
  )
}

/* Custom CSS */
.custom-network-status {
  /* Override default positioning */
  bottom: 20px;
  right: 20px;
}

.custom-network-status > div {
  /* Customize container */
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 12px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Custom status colors */
.custom-network-status .bg-green-500 {
  background: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
}

.custom-network-status .bg-red-500 {
  background: #ef4444;
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .custom-network-status > div {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Related Components Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Performance Dashboard:</strong> Monitor application performance metrics</li>
          <li><strong>Loading Indicator:</strong> Show loading states during network operations</li>
          <li><strong>Toast:</strong> Display network-related notifications</li>
          <li><strong>Error Boundary:</strong> Handle network errors gracefully</li>
          <li><strong>Retry Button:</strong> Allow users to retry failed network requests</li>
        </ul>
      </section>

      {/* Best Practices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use 30-second ping intervals by default to balance freshness and API load</li>
          <li>Implement onStatusChange callback to pause/resume streaming on connection changes</li>
          <li>Show detailed metrics only in development or for debugging</li>
          <li>Disable user actions (send message, upload file) when offline</li>
          <li>Display user-friendly warnings for slow connections before expensive operations</li>
          <li>Use conditional display to show indicator only when there are issues</li>
          <li>Implement auto-reconnect logic for WebSocket connections</li>
          <li>Log network status changes to analytics for monitoring</li>
          <li>Set appropriate slowThreshold based on your API's typical response time</li>
          <li>Position indicator where it's visible but non-intrusive (typically top/bottom corners)</li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Use Cases</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Chat Applications</h3>
            <p className="text-muted-foreground">
              Display connection status during chat streaming, pause streaming on connection loss, 
              warn users before sending messages on poor connections, and show reconnection status.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-muted-foreground">
              Monitor connection quality for collaborative editing, notify users when connection 
              degrades, automatically save work locally when offline, and sync when back online.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Live Streaming</h3>
            <p className="text-muted-foreground">
              Show connection quality for video/audio streaming, adjust quality based on 
              connection speed, warn users about potential buffering on slow connections.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Progressive Web Apps</h3>
            <p className="text-muted-foreground">
              Enable offline mode when connection is lost, sync data in background when 
              reconnected, show pending operations count, notify users of sync status.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">File Upload/Download</h3>
            <p className="text-muted-foreground">
              Warn users before large uploads on slow connections, pause/resume transfers 
              based on connection status, estimate completion time based on connection speed.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use HEAD requests for ping checks to minimize bandwidth usage</li>
          <li>Increase pingInterval in production to reduce API calls (30-60 seconds)</li>
          <li>Implement exponential backoff for reconnection attempts</li>
          <li>Cache ping results briefly to avoid redundant checks</li>
          <li>Use lightweight ping endpoints that return quickly</li>
          <li>Conditionally render component only when needed to reduce overhead</li>
          <li>Clean up event listeners and intervals properly in component cleanup</li>
          <li>Throttle onStatusChange callbacks to avoid excessive handler invocations</li>
        </ul>
      </section>

      {/* Footer Navigation */}
      <footer className="mt-16 pt-8 border-t">
        <div className="flex justify-between items-center">
          <a href="/reference/components" className="text-primary hover:underline">
            ← Back to Components
          </a>
          <a href="/reference/components/theme-preview" className="text-primary hover:underline">
            Next: Theme Preview →
          </a>
        </div>
      </footer>
    </div>
  )
}
