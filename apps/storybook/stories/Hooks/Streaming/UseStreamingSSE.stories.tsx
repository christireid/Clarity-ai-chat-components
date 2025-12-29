import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useStreamingSSE, type SSEEvent } from '@clarity-chat/react/internal'

const meta = {
  title: 'Hooks/Streaming/UseStreamingSSE',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# useStreamingSSE

React hook for Server-Sent Events (SSE) streaming with automatic reconnection, error recovery, and heartbeat support.

## Features

- **Auto Reconnection**: Automatic reconnection with exponential backoff
- **Heartbeat**: Keep-alive mechanism to detect stale connections
- **Error Recovery**: Robust error handling with retry logic
- **Resume Support**: Resume from last event ID after disconnect
- **JSON Parsing**: Automatic JSON parsing for structured data
- **Connection Management**: Manual connect/disconnect control
- **Status Tracking**: Real-time connection status updates
- **Event History**: Access to all received events

## Use Cases

- **Real-Time Updates**: Live feeds, notifications, stock prices
- **AI Streaming**: Token-by-token LLM responses
- **Progress Updates**: Long-running operation status
- **Live Chat**: Real-time message delivery
- **Dashboard Metrics**: Live metric updates

## Basic Usage

\`\`\`tsx
const { status, data, connect, disconnect } = useStreamingSSE({
  url: '/api/stream',
  onMessage: (event) => console.log(event.data),
  autoReconnect: true,
})

// Connect manually
connect()

// Disconnect when done
disconnect()
\`\`\`

## API Reference

### Options

- \`url\`: SSE endpoint URL
- \`method\`: HTTP method ('GET' | 'POST')
- \`body\`: Request body for POST
- \`headers\`: Custom headers
- \`authToken\`: Authentication token
- \`autoReconnect\`: Enable reconnection (default: true)
- \`maxReconnectAttempts\`: Max retries (default: 5)
- \`reconnectDelay\`: Initial delay (default: 1000ms)
- \`heartbeatInterval\`: Heartbeat interval (default: 30000ms)

### Returns

- \`status\`: Connection status
- \`events\`: All received events
- \`lastEvent\`: Latest event
- \`data\`: Accumulated data string
- \`error\`: Current error
- \`connect()\`: Connect to endpoint
- \`disconnect()\`: Disconnect
- \`reconnect()\`: Force reconnection
- \`clear()\`: Clear event history
`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock SSE Server (simulated)
// ============================================================================

function useMockSSEServer() {
  const [isActive, setIsActive] = React.useState(false)
  const [events, setEvents] = React.useState<SSEEvent[]>([])

  const simulateSSE = (callback: (event: SSEEvent) => void) => {
    let counter = 0
    const interval = setInterval(() => {
      const event: SSEEvent = {
        type: 'message',
        data: { counter, message: `Event ${counter}`, timestamp: Date.now() },
        raw: JSON.stringify({ counter, message: `Event ${counter}` }),
        id: String(counter),
      }
      callback(event)
      setEvents((prev) => [...prev, event])
      counter++

      // Stop after 10 events
      if (counter >= 10) {
        clearInterval(interval)
        setIsActive(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  return { isActive, setIsActive, events, simulateSSE }
}

// ============================================================================
// Basic Examples
// ============================================================================

export const BasicExample: Story = {
  render: () => {
    const [messages, setMessages] = React.useState<SSEEvent[]>([])
    const [isConnected, setIsConnected] = React.useState(false)

    const handleMessage = (event: SSEEvent) => {
      setMessages((prev) => [...prev, event])
    }

    const mockConnect = () => {
      setIsConnected(true)
      let count = 0
      const interval = setInterval(() => {
        if (count < 10) {
          handleMessage({
            type: 'message',
            data: { count, text: `Message ${count}` },
            raw: JSON.stringify({ count, text: `Message ${count}` }),
            id: String(count),
          })
          count++
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={mockConnect}
            disabled={isConnected}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isConnected ? 'Connected' : 'Connect'}
          </button>
          <button
            onClick={() => {
              setMessages([])
              setIsConnected(false)
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Clear
          </button>
        </div>

        <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-muted">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No messages yet. Click Connect to start.
            </p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-background rounded">
                  <div className="text-sm font-mono">
                    {JSON.stringify(msg.data, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
}

// ============================================================================
// AI Streaming Simulation
// ============================================================================

export const AIStreamingExample: Story = {
  render: () => {
    const [content, setContent] = React.useState('')
    const [isStreaming, setIsStreaming] = React.useState(false)

    const streamAIResponse = () => {
      setIsStreaming(true)
      setContent('')

      const fullText =
        'This is a simulated AI response that streams token by token, just like how modern language models deliver their responses in real-time.'
      const words = fullText.split(' ')
      let index = 0

      const interval = setInterval(() => {
        if (index < words.length) {
          setContent((prev) => prev + (prev ? ' ' : '') + words[index])
          index++
        } else {
          clearInterval(interval)
          setIsStreaming(false)
        }
      }, 150)
    }

    return (
      <div className="space-y-4">
        <button
          onClick={streamAIResponse}
          disabled={isStreaming}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isStreaming ? 'Streaming...' : 'Start AI Streaming'}
        </button>

        <div className="border rounded-lg p-4 min-h-[100px] bg-muted">
          <p className="text-foreground">
            {content}
            {isStreaming && <span className="animate-pulse">▋</span>}
          </p>
        </div>

        {!isStreaming && content && (
          <div className="text-sm text-muted-foreground">✓ Stream complete</div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulates AI token-by-token streaming response.',
      },
    },
  },
}

// ============================================================================
// Connection Status Visualization
// ============================================================================

export const ConnectionStatusExample: Story = {
  render: () => {
    const [status, setStatus] = React.useState<
      'idle' | 'connecting' | 'connected' | 'error'
    >('idle')
    const [eventCount, setEventCount] = React.useState(0)

    const connect = () => {
      setStatus('connecting')
      setTimeout(() => {
        setStatus('connected')
        // Simulate receiving events
        const interval = setInterval(() => {
          setEventCount((c) => c + 1)
        }, 500)

        setTimeout(() => {
          clearInterval(interval)
        }, 5000)
      }, 1000)
    }

    const disconnect = () => {
      setStatus('idle')
      setEventCount(0)
    }

    const statusColors = {
      idle: 'bg-gray-500',
      connecting: 'bg-yellow-500',
      connected: 'bg-green-500',
      error: 'bg-red-500',
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div
            className={`w-3 h-3 rounded-full ${statusColors[status]} animate-pulse`}
          />
          <div className="flex-1">
            <div className="font-medium capitalize">{status}</div>
            <div className="text-sm text-muted-foreground">
              {eventCount > 0 && `${eventCount} events received`}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={connect}
              disabled={status !== 'idle'}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              Connect
            </button>
            <button
              onClick={disconnect}
              disabled={status === 'idle'}
              className="px-3 py-1.5 text-sm border rounded hover:bg-accent disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted">
          <h4 className="font-semibold mb-2">Status Indicators</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Idle - Not connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Connecting - Establishing connection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Connected - Receiving events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Error - Connection failed</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Visualizes connection status with indicators.',
      },
    },
  },
}

// ============================================================================
// Auto Reconnection Demo
// ============================================================================

export const AutoReconnectionExample: Story = {
  render: () => {
    const [logs, setLogs] = React.useState<string[]>([])
    const [isActive, setIsActive] = React.useState(false)
    const [reconnectCount, setReconnectCount] = React.useState(0)

    const addLog = (message: string) => {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ${message}`,
      ])
    }

    const simulateConnection = () => {
      setIsActive(true)
      addLog('Connecting to server...')

      setTimeout(() => {
        addLog('✓ Connected successfully')

        // Simulate disconnect after 3 seconds
        setTimeout(() => {
          addLog('⚠ Connection lost - Server disconnected')
          setReconnectCount((c) => c + 1)

          // Attempt reconnection
          setTimeout(() => {
            addLog('Attempting to reconnect...')

            setTimeout(() => {
              addLog('✓ Reconnected successfully')
            }, 1500)
          }, 2000)
        }, 3000)
      }, 1000)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <div className="font-medium">Auto Reconnection</div>
            <div className="text-sm text-muted-foreground">
              Reconnection attempts: {reconnectCount}
            </div>
          </div>
          <button
            onClick={simulateConnection}
            disabled={isActive}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            Simulate Connection
          </button>
        </div>

        <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-muted font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="py-1">
              {log}
            </div>
          ))}
        </div>

        <button
          onClick={() => setLogs([])}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear Logs
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates automatic reconnection with logging.',
      },
    },
  },
}

// ============================================================================
// Real-Time Dashboard
// ============================================================================

export const RealTimeDashboard: Story = {
  render: () => {
    const [metrics, setMetrics] = React.useState({
      users: 0,
      requests: 0,
      errors: 0,
      latency: 0,
    })
    const [isLive, setIsLive] = React.useState(false)

    React.useEffect(() => {
      if (!isLive) return

      const interval = setInterval(() => {
        setMetrics({
          users: Math.floor(Math.random() * 100) + 50,
          requests: Math.floor(Math.random() * 1000) + 500,
          errors: Math.floor(Math.random() * 10),
          latency: Math.floor(Math.random() * 200) + 50,
        })
      }, 1000)

      return () => clearInterval(interval)
    }, [isLive])

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Live Metrics Dashboard</h3>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded ${
              isLive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLive ? 'Stop' : 'Start'} Live Updates
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">{metrics.users}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">{metrics.requests}</div>
            <div className="text-sm text-muted-foreground">Requests/min</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {metrics.errors}
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold">{metrics.latency}ms</div>
            <div className="text-sm text-muted-foreground">Avg Latency</div>
          </div>
        </div>

        {isLive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live updates active</span>
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-time metrics dashboard powered by SSE.',
      },
    },
  },
}
