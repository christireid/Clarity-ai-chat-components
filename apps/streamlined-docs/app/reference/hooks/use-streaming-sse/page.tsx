'use client'

/**
 * useStreamingSSE Hook - API Reference Documentation
 *
 * Production-ready SSE streaming hook with automatic reconnection,
 * authentication handling, token assembly, and network status detection.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Radio,
  RefreshCw,
  Shield,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  { id: 'parameters', title: 'Parameters' },
  { id: 'returns', title: 'Return Value' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Streaming' },
      { id: 'example-auth', title: 'With Authentication' },
      { id: 'example-reconnection', title: 'Automatic Reconnection' },
      { id: 'example-post', title: 'POST Requests' },
      { id: 'example-resumption', title: 'Event ID Resumption' },
    ],
  },
  { id: 'advanced', title: 'Advanced Usage' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related APIs' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const optionsProps: PropDefinition[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'Base URL for SSE endpoint',
  },
  {
    name: 'method',
    type: `'GET' | 'POST'`,
    default: `'GET'`,
    description: 'HTTP method for the request',
  },
  {
    name: 'body',
    type: 'any',
    description: 'Request body for POST requests',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom HTTP headers',
  },
  {
    name: 'authToken',
    type: 'string',
    description: 'Bearer authentication token (added to Authorization header)',
  },
  {
    name: 'useCookieFallback',
    type: 'boolean',
    default: 'true',
    description: 'Use cookie-based auth if header auth fails',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic reconnection on disconnect',
  },
  {
    name: 'maxReconnectAttempts',
    type: 'number',
    default: '5',
    description: 'Maximum number of reconnection attempts',
  },
  {
    name: 'reconnectDelay',
    type: 'number',
    default: '1000',
    description: 'Initial reconnection delay in milliseconds',
  },
  {
    name: 'maxReconnectDelay',
    type: 'number',
    default: '30000',
    description: 'Maximum reconnection delay in milliseconds (30 seconds)',
  },
  {
    name: 'reconnectSuccessThreshold',
    type: 'number',
    default: '3',
    description: 'Consecutive successes required to reset backoff',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    default: '30000',
    description: 'Heartbeat check interval in milliseconds (30 seconds)',
  },
  {
    name: 'connectionTimeout',
    type: 'number',
    default: '15000',
    description: 'Connection timeout in milliseconds (15 seconds)',
  },
  {
    name: 'maxEventBufferSize',
    type: 'number',
    default: '1000',
    description: 'Maximum number of events to buffer (prevents memory leaks)',
  },
  {
    name: 'onEventBufferOverflow',
    type: '(droppedCount: number, bufferSize: number) => void',
    description: 'Callback when event buffer overflows',
  },
  {
    name: 'resumeFromLastEventId',
    type: 'boolean',
    default: 'true',
    description: 'Resume from last event ID on reconnection',
  },
  {
    name: 'autoParseJson',
    type: 'boolean',
    default: 'true',
    description: 'Automatically parse JSON event data',
  },
  {
    name: 'onOpen',
    type: '() => void',
    description: 'Callback when connection opens',
  },
  {
    name: 'onMessage',
    type: '(event: SSEEvent) => void',
    description: 'Callback for each SSE event received',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when connection closes',
  },
  {
    name: 'onReconnecting',
    type: '(attempt: number, delay: number) => void',
    description: 'Callback when reconnection attempt starts',
  },
  {
    name: 'onMaxReconnectAttemptsReached',
    type: '() => void',
    description: 'Callback when max reconnection attempts reached',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'status',
    type: `'idle' | 'connecting' | 'connected' | 'streaming' | 'error' | 'closed'`,
    description: 'Current connection status',
  },
  {
    name: 'events',
    type: 'SSEEvent[]',
    description: 'All received events in chronological order',
  },
  {
    name: 'lastEvent',
    type: 'SSEEvent | null',
    description: 'Most recently received event',
  },
  {
    name: 'data',
    type: 'string',
    description: 'Accumulated data from all streaming events',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error if any occurred',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Initiate connection to SSE endpoint',
  },
  {
    name: 'disconnect',
    type: '() => void',
    description: 'Close the connection and stop reconnection',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Force reconnection (disconnect then connect)',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset all state (events, data, error)',
  },
  {
    name: 'reconnectAttempt',
    type: 'number',
    description: 'Current reconnection attempt number',
  },
  {
    name: 'isReconnecting',
    type: 'boolean',
    description: 'Whether currently in reconnection state',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { useStreamingSSE } from '@clarity-chat/react'
import type { SSEEvent, UseStreamingSSEOptions } from '@clarity-chat/react'`

const signatureCode = `function useStreamingSSE(
  options: UseStreamingSSEOptions
): UseStreamingSSEReturn`

const basicUsageCode = `import { useStreamingSSE } from '@clarity-chat/react'

function StreamingChat() {
  const {
    status,
    data,
    error,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    onMessage: (event) => {
      console.log('Received:', event.data)
    },
    onError: (error) => {
      console.error('SSE Error:', error)
    },
  })

  return (
    <div>
      <div className="status">
        Status: <span className="font-mono">{status}</span>
      </div>

      <div className="controls">
        <button
          onClick={connect}
          disabled={status !== 'idle' && status !== 'closed'}
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={status === 'idle' || status === 'closed'}
        >
          Disconnect
        </button>
      </div>

      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}

      <div className="stream-content">
        {status === 'streaming' && (
          <div className="typing-indicator">
            {data}
            <span className="cursor">|</span>
          </div>
        )}
      </div>
    </div>
  )
}`

const authUsageCode = `import { useStreamingSSE } from '@clarity-chat/react'

function AuthenticatedStream() {
  const [apiKey, setApiKey] = useState('')

  const {
    status,
    data,
    connect,
  } = useStreamingSSE({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    authToken: apiKey, // Bearer token
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello!' }],
      stream: true,
    },
    useCookieFallback: false, // Don't use cookies for external APIs
  })

  return (
    <div>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter OpenAI API key"
      />
      <button onClick={connect} disabled={!apiKey}>
        Start Stream
      </button>

      {status === 'streaming' && <div>{data}</div>}
    </div>
  )
}`

const reconnectionCode = `import { useStreamingSSE } from '@clarity-chat/react'

function ReconnectingStream() {
  const {
    status,
    reconnectAttempt,
    isReconnecting,
    connect,
  } = useStreamingSSE({
    url: '/api/stream',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000, // Start with 1s
    maxReconnectDelay: 30000, // Max 30s
    reconnectSuccessThreshold: 3, // Reset backoff after 3 successes

    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },

    onMaxReconnectAttemptsReached: () => {
      console.error('Max reconnection attempts reached')
      // Show user a "Retry" button or notification
    },

    onOpen: () => {
      console.log('Connected successfully')
    },
  })

  return (
    <div>
      <div className="connection-status">
        {isReconnecting && (
          <div className="reconnecting">
            Reconnecting... (Attempt {reconnectAttempt})
          </div>
        )}

        {status === 'connected' && (
          <div className="connected">
            Connected
          </div>
        )}

        {status === 'error' && !isReconnecting && (
          <div className="error">
            Connection failed
            <button onClick={connect}>Retry</button>
          </div>
        )}
      </div>
    </div>
  )
}`

const postRequestCode = `import { useStreamingSSE } from '@clarity-chat/react'

function ChatWithPOST() {
  const [message, setMessage] = useState('')
  const [conversationId, setConversationId] = useState('123')

  const {
    status,
    data,
    connect,
    disconnect,
    reset,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: {
      message,
      conversationId,
      stream: true,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    onMessage: (event) => {
      if (event.type === 'done') {
        disconnect()
        reset() // Clear accumulated data for next message
      }
    },
  })

  const sendMessage = () => {
    if (!message.trim()) return
    connect()
  }

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        disabled={status === 'streaming'}
      />

      <button
        onClick={sendMessage}
        disabled={status === 'streaming' || !message.trim()}
      >
        {status === 'streaming' ? 'Streaming...' : 'Send'}
      </button>

      {status === 'streaming' && (
        <div className="stream">
          {data}
        </div>
      )}
    </div>
  )
}`

const resumptionCode = `import { useStreamingSSE } from '@clarity-chat/react'

function ResumableStream() {
  const {
    status,
    events,
    lastEvent,
    connect,
  } = useStreamingSSE({
    url: '/api/long-stream',
    resumeFromLastEventId: true, // Enable resumption

    onMessage: (event) => {
      // Server must send 'id' field for resumption:
      // id: event-123
      // data: {"chunk": "content"}

      console.log('Event ID:', event.id)
      console.log('Event data:', event.data)
    },

    onOpen: () => {
      // On reconnection, hook automatically sends:
      // Last-Event-ID: event-123
      console.log('Connected, resuming from:', lastEvent?.id)
    },
  })

  return (
    <div>
      <div>Total events received: {events.length}</div>
      {lastEvent && <div>Last event ID: {lastEvent.id}</div>}

      <button onClick={connect}>
        {lastEvent ? 'Resume Stream' : 'Start Stream'}
      </button>
    </div>
  )
}

// Server implementation example (Node.js):
/*
app.get('/api/long-stream', (req, res) => {
  const lastEventId = req.headers['last-event-id']
  let eventCounter = lastEventId ? parseInt(lastEventId) + 1 : 0

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const interval = setInterval(() => {
    res.write(\`id: \${eventCounter}\\n\`)
    res.write(\`data: {"chunk": "Event \${eventCounter}"}\\n\\n\`)
    eventCounter++

    if (eventCounter >= 100) {
      res.write('event: done\\ndata: {}\\n\\n')
      res.end()
      clearInterval(interval)
    }
  }, 100)

  req.on('close', () => clearInterval(interval))
})
*/`

const advancedCode = `import { useStreamingSSE } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function AdvancedSSEUsage() {
  const [config, setConfig] = useState({
    maxEventBufferSize: 500,
    heartbeatInterval: 15000,
  })

  const {
    status,
    events,
    data,
    connect,
    disconnect,
    reset,
  } = useStreamingSSE({
    url: '/api/stream',
    method: 'POST',
    body: { userId: '123' },

    // Performance: Limit memory usage
    maxEventBufferSize: config.maxEventBufferSize,
    onEventBufferOverflow: (dropped, size) => {
      console.warn(\`Dropped \${dropped} events (buffer size: \${size})\`)
    },

    // Reliability: Custom heartbeat
    heartbeatInterval: config.heartbeatInterval,

    // Reconnection: Exponential backoff with jitter
    autoReconnect: true,
    reconnectDelay: 1000,
    maxReconnectDelay: 60000,
    reconnectSuccessThreshold: 3,

    // Event handling
    onMessage: (event) => {
      if (event.type === 'heartbeat') {
        // Server sent a heartbeat
        return
      }

      if (event.type === 'metadata') {
        // Handle metadata separately
        console.log('Metadata:', event.data)
        return
      }

      // Handle content
      console.log('Content chunk:', event.data)
    },

    onError: (error) => {
      // Log errors to monitoring service
      console.error('[SSE Error]', error)
    },
  })

  // Auto-connect on mount
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  // Cleanup old events periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (events.length > 100) {
        reset() // Clear old events
      }
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [events.length, reset])

  return (
    <div>
      <div className="stats">
        <div>Status: {status}</div>
        <div>Events: {events.length}</div>
        <div>Data size: {data.length} chars</div>
      </div>

      <div className="controls">
        <button onClick={reset}>Clear Buffer</button>
        <button onClick={disconnect}>Disconnect</button>
        <button onClick={connect}>Reconnect</button>
      </div>

      <div className="config">
        <label>
          Buffer Size:
          <input
            type="number"
            value={config.maxEventBufferSize}
            onChange={(e) =>
              setConfig({ ...config, maxEventBufferSize: +e.target.value })
            }
          />
        </label>
      </div>
    </div>
  )
}`

const bestPracticesCode = `// ✅ GOOD: Cleanup on unmount
function MyComponent() {
  const { connect, disconnect } = useStreamingSSE({ url: '/api/stream' })

  useEffect(() => {
    connect()
    return () => disconnect() // Important!
  }, [])
}

// ✅ GOOD: Handle all event types
useStreamingSSE({
  url: '/api/stream',
  onMessage: (event) => {
    switch (event.type) {
      case 'content':
        // Handle content
        break
      case 'metadata':
        // Handle metadata
        break
      case 'done':
        // Stream complete
        disconnect()
        break
    }
  },
})

// ✅ GOOD: Limit buffer size for long-running streams
useStreamingSSE({
  url: '/api/stream',
  maxEventBufferSize: 100, // Prevent memory leaks
  onEventBufferOverflow: (dropped, size) => {
    console.warn(\`Dropped \${dropped} events\`)
  },
})

// ❌ BAD: No cleanup
function MyComponent() {
  const { connect } = useStreamingSSE({ url: '/api/stream' })
  connect() // Leaks connection on unmount
}

// ❌ BAD: Accumulating unlimited data
// data string grows forever, causing memory issues
const { data } = useStreamingSSE({ url: '/api/stream' })
// Instead, use events and process incrementally

// ❌ BAD: Not handling errors
useStreamingSSE({
  url: '/api/stream',
  // Missing onError - errors will be silent
})`

const typesCode = `// SSE Event structure
interface SSEEvent {
  /** Event type (e.g., "message", "error", "done") */
  type: string
  /** Event data (pre-parsed if JSON) */
  data: any
  /** Raw event data string */
  raw: string
  /** Event ID for resumption */
  id?: string
  /** Retry interval suggested by server */
  retry?: number
}

// Connection status
type SSEStatus =
  | 'idle'           // Not connected
  | 'connecting'     // Attempting connection
  | 'connected'      // Connected, waiting for data
  | 'streaming'      // Actively receiving data
  | 'error'          // Error occurred
  | 'closed'         // Connection closed

// Options interface
interface UseStreamingSSEOptions {
  url: string
  method?: 'GET' | 'POST'
  body?: any
  headers?: Record<string, string>
  authToken?: string
  useCookieFallback?: boolean
  autoReconnect?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
  maxReconnectDelay?: number
  reconnectSuccessThreshold?: number
  heartbeatInterval?: number
  connectionTimeout?: number
  maxEventBufferSize?: number
  onEventBufferOverflow?: (droppedCount: number, bufferSize: number) => void
  resumeFromLastEventId?: boolean
  autoParseJson?: boolean
  onOpen?: () => void
  onMessage?: (event: SSEEvent) => void
  onError?: (error: Error) => void
  onClose?: () => void
  onReconnecting?: (attempt: number, delay: number) => void
  onMaxReconnectAttemptsReached?: () => void
}

// Return interface
interface UseStreamingSSEReturn {
  status: SSEStatus
  events: SSEEvent[]
  lastEvent: SSEEvent | null
  data: string
  error: Error | undefined
  connect: () => void
  disconnect: () => void
  reconnect: () => void
  reset: () => void
  reconnectAttempt: number
  isReconnecting: boolean
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseStreamingSSEPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Radio className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hook
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useStreamingSSE
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Production-ready Server-Sent Events (SSE) streaming hook with
                automatic reconnection, authentication handling, event
                resumption, and memory-efficient buffering. Built for reliable
                real-time communication with AI APIs and streaming endpoints.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Zap, label: 'Auto Reconnect', desc: 'Exponential backoff' },
                { icon: Shield, label: 'Auth Ready', desc: 'Token + cookies' },
                { icon: RefreshCw, label: 'Resumption', desc: 'Event ID support' },
                { icon: Activity, label: 'Heartbeat', desc: 'Connection monitoring' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>useStreamingSSE</code> is a mid-level hook for managing
                  Server-Sent Events connections. It handles the complexity of
                  SSE streaming including automatic reconnection, event parsing,
                  authentication, and connection lifecycle management.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Automatic Reconnection:</strong> Exponential backoff
                    with jitter prevents thundering herd
                  </li>
                  <li>
                    <strong>Event Resumption:</strong> Resume from last event ID
                    on reconnection
                  </li>
                  <li>
                    <strong>Authentication:</strong> Bearer token auth with
                    cookie fallback
                  </li>
                  <li>
                    <strong>Memory Efficient:</strong> Bounded event buffer
                    prevents memory leaks
                  </li>
                  <li>
                    <strong>Heartbeat Monitoring:</strong> Detects stale
                    connections
                  </li>
                  <li>
                    <strong>TypeScript First:</strong> Complete type safety with
                    discriminated unions
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <p>
                  Use <code>useStreamingSSE</code> when you need direct control
                  over SSE streaming. For higher-level chat interfaces, use{' '}
                  <code>useClarityChat</code> with{' '}
                  <code>transport: &apos;sse&apos;</code> instead.
                </p>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Architecture Note:</strong> This is a mid-level hook
                    in the Clarity architecture. It provides composable building
                    blocks for streaming without imposing chat-specific
                    constraints.
                  </p>
                </div>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <div className="space-y-4">
                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="Import"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Signature Section */}
            <Section id="signature" title="Signature">
              <div className="space-y-4">
                <CodeBlock
                  code={signatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Required Parameter:</strong> The <code>url</code>{' '}
                    option is required. All other options have sensible defaults.
                  </p>
                </div>
              </div>
            </Section>

            {/* Parameters Section */}
            <Section id="parameters" title="Parameters">
              <p className="text-muted-foreground mb-6">
                Configure SSE connection behavior, authentication, reconnection
                strategy, and event handling.
              </p>

              <PropsTable props={optionsProps} />
            </Section>

            {/* Return Value Section */}
            <Section id="returns" title="Return Value">
              <p className="text-muted-foreground mb-6">
                Returns connection state, received events, and control methods.
              </p>

              <PropsTable props={returnProps} />
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Streaming">
                <p className="text-muted-foreground mb-4">
                  Simple SSE streaming with status display and connection
                  controls:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicStreaming.tsx"
                />
              </SubSection>

              <SubSection id="example-auth" title="With Authentication">
                <p className="text-muted-foreground mb-4">
                  Stream from authenticated API endpoints with Bearer tokens:
                </p>
                <CodeBlock
                  code={authUsageCode}
                  language="tsx"
                  filename="AuthenticatedStream.tsx"
                />
              </SubSection>

              <SubSection id="example-reconnection" title="Automatic Reconnection">
                <p className="text-muted-foreground mb-4">
                  Handle network interruptions with automatic reconnection and
                  exponential backoff:
                </p>
                <CodeBlock
                  code={reconnectionCode}
                  language="tsx"
                  filename="ReconnectingStream.tsx"
                />
              </SubSection>

              <SubSection id="example-post" title="POST Requests">
                <p className="text-muted-foreground mb-4">
                  Send POST requests with body data for chat-style streaming:
                </p>
                <CodeBlock
                  code={postRequestCode}
                  language="tsx"
                  filename="ChatWithPOST.tsx"
                />
              </SubSection>

              <SubSection id="example-resumption" title="Event ID Resumption">
                <p className="text-muted-foreground mb-4">
                  Resume streaming from the last received event ID after
                  reconnection:
                </p>
                <CodeBlock
                  code={resumptionCode}
                  language="tsx"
                  filename="ResumableStream.tsx"
                />
              </SubSection>
            </Section>

            {/* Advanced Usage Section */}
            <Section id="advanced" title="Advanced Usage">
              <p className="text-muted-foreground mb-4">
                Production patterns for memory management, performance tuning,
                and reliability:
              </p>
              <CodeBlock
                code={advancedCode}
                language="tsx"
                filename="AdvancedSSE.tsx"
              />
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <p className="text-muted-foreground mb-4">
                Follow these patterns for reliable SSE streaming:
              </p>
              <CodeBlock
                code={bestPracticesCode}
                language="tsx"
                filename="BestPractices.tsx"
              />
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Complete type definitions for type-safe SSE streaming:
              </p>
              <CodeBlock
                code={typesCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useStreamingWebSocket',
                    type: 'hook',
                    description: 'WebSocket streaming with bidirectional communication',
                    href: '/reference/hooks/use-streaming-websocket',
                  },
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'High-level chat hook with SSE support',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'useChat',
                    type: 'hook',
                    description: 'Basic chat with streaming',
                    href: '/reference/hooks/use-chat',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'UI component for streaming chat',
                    href: '/reference/components/chat-window',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Connection not establishing
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Ensure your server returns proper SSE headers:
                  </p>
                  <div className="p-3 bg-muted/30 rounded font-mono text-sm">
                    Content-Type: text/event-stream
                    <br />
                    Cache-Control: no-cache
                    <br />
                    Connection: keep-alive
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Events not parsing as JSON
                  </h4>
                  <p className="text-muted-foreground">
                    Set <code>autoParseJson: true</code> (default) and ensure
                    server sends valid JSON in the <code>data:</code> field. The
                    hook gracefully falls back to raw strings if JSON parsing
                    fails.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Memory usage growing unbounded
                  </h4>
                  <p className="text-muted-foreground">
                    Set <code>maxEventBufferSize</code> to limit stored events.
                    The <code>data</code> field accumulates all event data, so
                    call <code>reset()</code> periodically for long-running
                    streams, or process events incrementally using{' '}
                    <code>onMessage</code>.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Reconnection not working
                  </h4>
                  <p className="text-muted-foreground">
                    Check <code>autoReconnect: true</code> is set. The hook uses
                    exponential backoff, so delays increase with each attempt.
                    Maximum attempts default to 5. Increase{' '}
                    <code>maxReconnectAttempts</code> if needed.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    CORS errors with external APIs
                  </h4>
                  <p className="text-muted-foreground">
                    SSE requires proper CORS headers from the server. For
                    external APIs (like OpenAI), you may need to proxy requests
                    through your own backend to add CORS headers.
                  </p>
                </div>
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-chat"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      useChat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-streaming-websocket"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      useStreamingWebSocket
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
