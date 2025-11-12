import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
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
};
export default function NetworkStatusPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Network Status" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "A production-ready network status indicator with auto-detection, periodic connectivity checks, connection quality measurement, and customizable appearance." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Overview" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Network Status component provides real-time monitoring of network connectivity and connection quality. It uses the Navigator API for automatic detection, performs periodic ping checks to verify connectivity, measures latency and downlink speed, and displays status with color-coded indicators. The component can detect online, offline, slow, and unstable connection states." }), _jsx("h3", { className: "text-xl font-semibold mb-3 mt-6", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Auto-detection of network status using Navigator API" }), _jsx("li", { children: "Periodic connectivity checks via customizable ping endpoint" }), _jsx("li", { children: "Connection quality measurement (online, offline, slow, unstable)" }), _jsx("li", { children: "Latency (RTT) measurement with configurable slow threshold" }), _jsx("li", { children: "Downlink speed monitoring when available" }), _jsx("li", { children: "Four connection states with visual indicators and colors" }), _jsx("li", { children: "Customizable position (top-left, top-right, bottom-left, bottom-right)" }), _jsx("li", { children: "Optional detailed view showing latency and speed metrics" }), _jsx("li", { children: "Status change callbacks for integration with app logic" }), _jsx("li", { children: "ARIA live region support for accessibility" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Installation" }), _jsx("div", { className: "bg-muted p-4 rounded-lg", children: _jsx("code", { className: "text-sm", children: "npm install @clarity-chat/react" }) }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "No additional dependencies required - uses standard browser APIs." })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props API" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "status" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "NetworkConnectionStatus" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Controlled status override (auto-detected if not provided)" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "show" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "true" }), _jsx("td", { className: "p-2", children: "Whether to show the status indicator" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "position" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "Position" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "'top-right'" }), _jsx("td", { className: "p-2", children: "Position of the indicator on screen" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "showDetails" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "false" }), _jsx("td", { className: "p-2", children: "Show detailed connection info (latency, speed)" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onStatusChange" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(status) => void" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Callback when connection status changes" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "pingEndpoint" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "'/api/ping'" }), _jsx("td", { className: "p-2", children: "Custom endpoint for connectivity checks" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "pingInterval" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "30000" }), _jsx("td", { className: "p-2", children: "Ping check interval in milliseconds" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "slowThreshold" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "number" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "1000" }), _jsx("td", { className: "p-2", children: "Latency threshold in ms for slow connection" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "''" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Type Definitions" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Connection status types
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Chat Integration Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Auto-Reconnect Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Custom Ping Endpoint Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Conditional Display Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "TypeScript Support" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The component is fully typed with comprehensive TypeScript definitions:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import type { 
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Accessibility" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Network Status component implements comprehensive accessibility features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "ARIA Live Region:" }), " role=\"status\" with aria-live=\"polite\" for status announcements"] }), _jsxs("li", { children: [_jsx("strong", { children: "ARIA Labels:" }), " Descriptive aria-label for screen reader context"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color Independence:" }), " Status conveyed through text and icons, not just color"] }), _jsxs("li", { children: [_jsx("strong", { children: "High Contrast:" }), " Color combinations meet WCAG AA standards"] }), _jsxs("li", { children: [_jsx("strong", { children: "Semantic Markup:" }), " Proper use of status role for assistive technologies"] }), _jsxs("li", { children: [_jsx("strong", { children: "Visual Indicators:" }), " Multiple visual cues (color, text, icon, animation)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Focus Management:" }), " Component doesn't trap focus or interfere with navigation"] })] }), _jsx("div", { className: "bg-muted p-6 rounded-lg mt-4", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Accessibility implementation
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
</div>` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Styling" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Customize the appearance using the className prop or by overriding default styles:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { NetworkStatus } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Performance Dashboard:" }), " Monitor application performance metrics"] }), _jsxs("li", { children: [_jsx("strong", { children: "Loading Indicator:" }), " Show loading states during network operations"] }), _jsxs("li", { children: [_jsx("strong", { children: "Toast:" }), " Display network-related notifications"] }), _jsxs("li", { children: [_jsx("strong", { children: "Error Boundary:" }), " Handle network errors gracefully"] }), _jsxs("li", { children: [_jsx("strong", { children: "Retry Button:" }), " Allow users to retry failed network requests"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Use 30-second ping intervals by default to balance freshness and API load" }), _jsx("li", { children: "Implement onStatusChange callback to pause/resume streaming on connection changes" }), _jsx("li", { children: "Show detailed metrics only in development or for debugging" }), _jsx("li", { children: "Disable user actions (send message, upload file) when offline" }), _jsx("li", { children: "Display user-friendly warnings for slow connections before expensive operations" }), _jsx("li", { children: "Use conditional display to show indicator only when there are issues" }), _jsx("li", { children: "Implement auto-reconnect logic for WebSocket connections" }), _jsx("li", { children: "Log network status changes to analytics for monitoring" }), _jsx("li", { children: "Set appropriate slowThreshold based on your API's typical response time" }), _jsx("li", { children: "Position indicator where it's visible but non-intrusive (typically top/bottom corners)" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Use Cases" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Chat Applications" }), _jsx("p", { className: "text-muted-foreground", children: "Display connection status during chat streaming, pause streaming on connection loss, warn users before sending messages on poor connections, and show reconnection status." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Real-time Collaboration" }), _jsx("p", { className: "text-muted-foreground", children: "Monitor connection quality for collaborative editing, notify users when connection degrades, automatically save work locally when offline, and sync when back online." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Live Streaming" }), _jsx("p", { className: "text-muted-foreground", children: "Show connection quality for video/audio streaming, adjust quality based on connection speed, warn users about potential buffering on slow connections." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Progressive Web Apps" }), _jsx("p", { className: "text-muted-foreground", children: "Enable offline mode when connection is lost, sync data in background when reconnected, show pending operations count, notify users of sync status." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "File Upload/Download" }), _jsx("p", { className: "text-muted-foreground", children: "Warn users before large uploads on slow connections, pause/resume transfers based on connection status, estimate completion time based on connection speed." })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Performance Tips" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Use HEAD requests for ping checks to minimize bandwidth usage" }), _jsx("li", { children: "Increase pingInterval in production to reduce API calls (30-60 seconds)" }), _jsx("li", { children: "Implement exponential backoff for reconnection attempts" }), _jsx("li", { children: "Cache ping results briefly to avoid redundant checks" }), _jsx("li", { children: "Use lightweight ping endpoints that return quickly" }), _jsx("li", { children: "Conditionally render component only when needed to reduce overhead" }), _jsx("li", { children: "Clean up event listeners and intervals properly in component cleanup" }), _jsx("li", { children: "Throttle onStatusChange callbacks to avoid excessive handler invocations" })] })] }), _jsx("footer", { className: "mt-16 pt-8 border-t", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("a", { href: "/reference/components", className: "text-primary hover:underline", children: "\u2190 Back to Components" }), _jsx("a", { href: "/reference/components/theme-preview", className: "text-primary hover:underline", children: "Next: Theme Preview \u2192" })] }) })] }));
}
//# sourceMappingURL=page.js.map