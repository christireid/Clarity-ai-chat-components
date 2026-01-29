'use client'

/**
 * useStreamingWebSocket Hook - API Reference Documentation
 *
 * Production-ready WebSocket streaming hook with bidirectional communication,
 * automatic reconnection, heartbeat monitoring, and message acknowledgment.
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
  Activity,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  Radio,
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
      { id: 'example-basic', title: 'Basic Connection' },
      { id: 'example-bidirectional', title: 'Bidirectional Chat' },
      { id: 'example-binary', title: 'Binary Messages' },
      { id: 'example-heartbeat', title: 'Heartbeat Monitoring' },
      { id: 'example-acknowledgment', title: 'Message Acknowledgment' },
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
    description: 'WebSocket URL (ws:// or wss://)',
  },
  {
    name: 'protocols',
    type: 'string | string[]',
    description: 'WebSocket sub-protocols',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic reconnection on disconnect',
  },
  {
    name: 'reconnectOnCleanClose',
    type: 'boolean',
    default: 'true',
    description: 'Reconnect even on clean server close (useful for server restarts)',
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
    description: 'Maximum reconnection delay in milliseconds',
  },
  {
    name: 'reconnectSuccessThreshold',
    type: 'number',
    default: '3',
    description: 'Consecutive successful connections to reset backoff delay',
  },
  {
    name: 'connectionTimeout',
    type: 'number',
    default: '15000',
    description: 'Connection timeout in milliseconds',
  },
  {
    name: 'enableHeartbeat',
    type: 'boolean',
    default: 'true',
    description: 'Enable heartbeat/ping-pong mechanism',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    default: '30000',
    description: 'Heartbeat interval in milliseconds',
  },
  {
    name: 'heartbeatTimeout',
    type: 'number',
    default: '5000',
    description: 'Heartbeat timeout in milliseconds',
  },
  {
    name: 'heartbeatMessage',
    type: 'string',
    default: `'ping'`,
    description: 'Message to send for heartbeat',
  },
  {
    name: 'autoParseJson',
    type: 'boolean',
    default: 'true',
    description: 'Automatically parse JSON messages',
  },
  {
    name: 'connectOnMount',
    type: 'boolean',
    default: 'false',
    description: 'Connect immediately when component mounts',
  },
  {
    name: 'maxMessageBufferSize',
    type: 'number',
    default: '1000',
    description: 'Maximum number of messages to keep in buffer (prevents memory leaks)',
  },
  {
    name: 'onMessageBufferOverflow',
    type: '(droppedCount: number, bufferSize: number) => void',
    description: 'Callback when message buffer overflows',
  },
  {
    name: 'enableAcknowledgment',
    type: 'boolean',
    default: 'false',
    description: 'Enable automatic message acknowledgment',
  },
  {
    name: 'ackMessageType',
    type: 'string',
    default: `'ack'`,
    description: 'Message type for acknowledgment messages',
  },
  {
    name: 'onAcknowledgmentSent',
    type: '(messageId: string) => void',
    description: 'Callback when acknowledgment is sent',
  },
  {
    name: 'onOpen',
    type: '(event: Event) => void',
    description: 'Callback when connection opens',
  },
  {
    name: 'onMessage',
    type: '(message: WebSocketMessage) => void',
    description: 'Callback for each message received',
  },
  {
    name: 'onError',
    type: '(event: Event) => void',
    description: 'Callback when an error occurs',
  },
  {
    name: 'onClose',
    type: '(event: CloseEvent) => void',
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
  {
    name: 'onHeartbeatFailed',
    type: '() => void',
    description: 'Callback when heartbeat fails',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'status',
    type: `'idle' | 'connecting' | 'connected' | 'closing' | 'closed' | 'error' | 'reconnecting'`,
    description: 'Current connection status',
  },
  {
    name: 'messages',
    type: 'WebSocketMessage[]',
    description: 'All received messages in chronological order',
  },
  {
    name: 'lastMessage',
    type: 'WebSocketMessage | null',
    description: 'Most recently received message',
  },
  {
    name: 'error',
    type: 'Event | null',
    description: 'Current error if any occurred',
  },
  {
    name: 'readyState',
    type: 'number',
    description: 'WebSocket ready state (0: connecting, 1: open, 2: closing, 3: closed)',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Initiate WebSocket connection',
  },
  {
    name: 'disconnect',
    type: '(code?: number, reason?: string) => void',
    description: 'Close the connection (default code: 1000)',
  },
  {
    name: 'send',
    type: '(data: string | object | ArrayBuffer | Blob) => boolean',
    description: 'Send message through WebSocket (returns success)',
  },
  {
    name: 'sendJson',
    type: '(data: any) => boolean',
    description: 'Send JSON message (convenience method)',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Force reconnection (disconnect then connect)',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset all state (messages, error, reconnection)',
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

const importCode = `import { useStreamingWebSocket } from '@clarity-chat/react'
import type { WebSocketMessage, UseStreamingWebSocketOptions } from '@clarity-chat/react'`

const signatureCode = `function useStreamingWebSocket(
  options: UseStreamingWebSocketOptions
): UseStreamingWebSocketReturn`

const basicUsageCode = `import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketChat() {
  const {
    status,
    messages,
    connect,
    disconnect,
    send,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    onOpen: () => {
      console.log('Connected to WebSocket')
    },
    onMessage: (message) => {
      console.log('Received:', message.data)
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
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
          disabled={status === 'connected' || status === 'connecting'}
        >
          Connect
        </button>
        <button
          onClick={() => disconnect()}
          disabled={status !== 'connected'}
        >
          Disconnect
        </button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            {typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data)}
          </div>
        ))}
      </div>
    </div>
  )
}`

const bidirectionalCode = `import { useStreamingWebSocket } from '@clarity-chat/react'
import { useState } from 'react'

function BidirectionalChat() {
  const [input, setInput] = useState('')

  const {
    status,
    messages,
    connect,
    disconnect,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://chat.example.com/ws',
    autoReconnect: true,
    autoParseJson: true, // Automatically parse JSON messages
    onOpen: () => {
      // Send authentication message on connect
      sendJson({
        type: 'auth',
        token: localStorage.getItem('authToken'),
      })
    },
  })

  const handleSendMessage = () => {
    if (!input.trim() || status !== 'connected') return

    // Send JSON message
    const success = sendJson({
      type: 'chat',
      message: input,
      timestamp: Date.now(),
    })

    if (success) {
      setInput('')
    }
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => {
          // Messages are automatically parsed as JSON
          if (msg.data?.type === 'chat') {
            return (
              <div key={index} className="message">
                {msg.data.message}
              </div>
            )
          }
          return null
        })}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          disabled={status !== 'connected'}
        />
        <button
          onClick={handleSendMessage}
          disabled={status !== 'connected' || !input.trim()}
        >
          Send
        </button>
      </div>

      {status === 'reconnecting' && (
        <div className="reconnecting">Reconnecting...</div>
      )}
    </div>
  )
}`

const binaryCode = `import { useStreamingWebSocket } from '@clarity-chat/react'

function BinaryDataStreaming() {
  const {
    status,
    messages,
    connect,
    send,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/binary',
    autoParseJson: false, // Don't parse binary data
    onMessage: (message) => {
      if (message.type === 'binary') {
        // Handle binary data (ArrayBuffer)
        const view = new Uint8Array(message.raw as ArrayBuffer)
        console.log('Received binary data:', view.length, 'bytes')
      } else if (message.type === 'blob') {
        // Handle blob data
        const blob = message.raw as Blob
        console.log('Received blob:', blob.size, 'bytes')
      } else {
        // Handle text data
        console.log('Received text:', message.raw)
      }
    },
  })

  const sendBinaryData = () => {
    // Create binary data
    const buffer = new ArrayBuffer(8)
    const view = new Uint8Array(buffer)
    view.set([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08])

    // Send binary data
    send(buffer)
  }

  const sendBlob = async () => {
    // Create blob from file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (file) {
      send(file) // Send as blob
    }
  }

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={sendBinaryData} disabled={status !== 'connected'}>
        Send Binary
      </button>
      <button onClick={sendBlob} disabled={status !== 'connected'}>
        Send File
      </button>

      <div>
        Received {messages.length} messages
        ({messages.filter(m => m.type === 'binary').length} binary)
      </div>
    </div>
  )
}`

const heartbeatCode = `import { useStreamingWebSocket } from '@clarity-chat/react'
import { useState } from 'react'

function HeartbeatMonitoring() {
  const [heartbeatStatus, setHeartbeatStatus] = useState<'healthy' | 'stale' | 'failed'>('healthy')
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null)

  const {
    status,
    connect,
    disconnect,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    enableHeartbeat: true,
    heartbeatInterval: 30000, // 30 seconds
    heartbeatTimeout: 5000, // 5 second timeout
    heartbeatMessage: 'ping', // Custom heartbeat message

    onOpen: () => {
      setHeartbeatStatus('healthy')
      setLastHeartbeat(new Date())
    },

    onMessage: (message) => {
      // Any message counts as a heartbeat response
      setHeartbeatStatus('healthy')
      setLastHeartbeat(new Date())

      if (message.data === 'pong') {
        console.log('Received pong response')
      }
    },

    onHeartbeatFailed: () => {
      console.warn('Heartbeat failed - connection may be stale')
      setHeartbeatStatus('failed')
      // Hook will automatically attempt reconnection
    },

    onReconnecting: (attempt, delay) => {
      setHeartbeatStatus('stale')
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },
  })

  return (
    <div>
      <div className="connection-status">
        <div>Status: {status}</div>
        <div>
          Heartbeat:{' '}
          <span className={heartbeatStatus === 'healthy' ? 'text-green-600' : 'text-red-600'}>
            {heartbeatStatus}
          </span>
        </div>
        {lastHeartbeat && (
          <div>Last heartbeat: {lastHeartbeat.toLocaleTimeString()}</div>
        )}
      </div>

      <div className="controls">
        <button onClick={connect} disabled={status === 'connected'}>
          Connect
        </button>
        <button onClick={disconnect} disabled={status !== 'connected'}>
          Disconnect
        </button>
      </div>
    </div>
  )
}

// Server-side heartbeat handler (Node.js example):
/*
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    if (message === 'ping') {
      ws.send('pong') // Respond to heartbeat
    } else {
      // Handle other messages
    }
  })
})
*/`

const acknowledgmentCode = `import { useStreamingWebSocket } from '@clarity-chat/react'
import { useState } from 'react'

function MessageAcknowledgment() {
  const [deliveryStatus, setDeliveryStatus] = useState<Record<string, 'sent' | 'delivered'>>({})

  const {
    status,
    messages,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    enableAcknowledgment: true, // Enable auto-acknowledgment
    ackMessageType: 'ack', // Acknowledgment message type

    onMessage: (message) => {
      // Automatically send acknowledgment for messages with 'id'
      if (message.data?.id) {
        console.log(\`Auto-acknowledged message: \${message.data.id}\`)
      }

      // Handle acknowledgments from server
      if (message.data?.type === 'ack') {
        const messageId = message.data.id
        setDeliveryStatus(prev => ({
          ...prev,
          [messageId]: 'delivered'
        }))
      }
    },

    onAcknowledgmentSent: (messageId) => {
      console.log(\`Acknowledgment sent for: \${messageId}\`)
    },
  })

  const sendMessage = (content: string) => {
    const messageId = \`msg-\${Date.now()}\`

    // Mark as sent
    setDeliveryStatus(prev => ({
      ...prev,
      [messageId]: 'sent'
    }))

    // Send message with ID for acknowledgment tracking
    sendJson({
      type: 'chat',
      id: messageId,
      content,
      timestamp: Date.now(),
    })
  }

  return (
    <div>
      <div className="messages">
        {messages
          .filter(m => m.data?.type === 'chat')
          .map((msg) => {
            const messageId = msg.data.id
            const status = deliveryStatus[messageId]

            return (
              <div key={messageId} className="message">
                <div>{msg.data.content}</div>
                <div className="delivery-status">
                  {status === 'sent' && '✓ Sent'}
                  {status === 'delivered' && '✓✓ Delivered'}
                </div>
              </div>
            )
          })}
      </div>

      <button
        onClick={() => sendMessage('Hello!')}
        disabled={status !== 'connected'}
      >
        Send with Acknowledgment
      </button>
    </div>
  )
}

// Server-side acknowledgment handler (Node.js):
/*
ws.on('message', (data) => {
  const message = JSON.parse(data)

  // Process message
  handleMessage(message)

  // Send acknowledgment back
  if (message.id) {
    ws.send(JSON.stringify({
      type: 'ack',
      id: message.id
    }))
  }
})
*/`

const advancedCode = `import { useStreamingWebSocket } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function AdvancedWebSocketUsage() {
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent')
  const [messageLatency, setMessageLatency] = useState<number[]>([])

  const {
    status,
    messages,
    reconnectAttempt,
    isReconnecting,
    connect,
    disconnect,
    sendJson,
    reset,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    protocols: ['chat-v2', 'chat-v1'], // Try protocols in order

    // Reconnection: Exponential backoff with jitter
    autoReconnect: true,
    reconnectOnCleanClose: true, // Reconnect on server restart
    maxReconnectAttempts: 10,
    reconnectDelay: 1000, // Start at 1s
    maxReconnectDelay: 60000, // Max 60s
    reconnectSuccessThreshold: 3, // Reset backoff after 3 successes

    // Performance: Limit memory usage
    maxMessageBufferSize: 500,
    onMessageBufferOverflow: (dropped, size) => {
      console.warn(\`Dropped \${dropped} messages (buffer: \${size})\`)
    },

    // Reliability: Heartbeat monitoring
    enableHeartbeat: true,
    heartbeatInterval: 30000,
    heartbeatTimeout: 5000,

    // Quality monitoring
    onMessage: (message) => {
      if (message.data?.timestamp) {
        const latency = Date.now() - message.data.timestamp
        setMessageLatency(prev => [...prev.slice(-10), latency])

        // Update connection quality
        const avgLatency = messageLatency.reduce((a, b) => a + b, 0) / messageLatency.length
        if (avgLatency < 100) setConnectionQuality('excellent')
        else if (avgLatency < 300) setConnectionQuality('good')
        else setConnectionQuality('poor')
      }
    },

    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },

    onMaxReconnectAttemptsReached: () => {
      console.error('Max reconnection attempts reached')
      // Show user a manual reconnect button
    },
  })

  // Auto-connect on mount
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 100) {
        reset() // Clear old messages
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [messages.length, reset])

  const sendPing = () => {
    sendJson({
      type: 'ping',
      timestamp: Date.now(),
    })
  }

  return (
    <div>
      <div className="stats">
        <div>Status: {status}</div>
        <div>Quality: {connectionQuality}</div>
        <div>Messages: {messages.length}</div>
        {messageLatency.length > 0 && (
          <div>
            Latency: {Math.round(messageLatency[messageLatency.length - 1])}ms
          </div>
        )}
        {isReconnecting && (
          <div>Reconnecting... (Attempt {reconnectAttempt})</div>
        )}
      </div>

      <div className="controls">
        <button onClick={sendPing} disabled={status !== 'connected'}>
          Ping Server
        </button>
        <button onClick={reset}>Clear Messages</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    </div>
  )
}`

const bestPracticesCode = `// ✅ GOOD: Cleanup on unmount
function MyComponent() {
  const { connect, disconnect } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws'
  })

  useEffect(() => {
    connect()
    return () => disconnect() // Important!
  }, [])
}

// ✅ GOOD: Check connection before sending
const sendMessage = (data: any) => {
  if (status === 'connected') {
    const success = sendJson(data)
    if (!success) {
      console.error('Failed to send message')
    }
  }
}

// ✅ GOOD: Handle all message types
useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  onMessage: (message) => {
    switch (message.type) {
      case 'text':
        handleTextMessage(message.data)
        break
      case 'binary':
        handleBinaryMessage(message.raw as ArrayBuffer)
        break
      case 'blob':
        handleBlobMessage(message.raw as Blob)
        break
    }
  },
})

// ✅ GOOD: Limit message buffer
useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  maxMessageBufferSize: 100, // Prevent memory leaks
  onMessageBufferOverflow: (dropped) => {
    console.warn(\`Dropped \${dropped} old messages\`)
  },
})

// ✅ GOOD: Use wss:// in production
const wsUrl = process.env.NODE_ENV === 'production'
  ? 'wss://api.example.com/ws' // Secure WebSocket
  : 'ws://localhost:8080/ws' // Local development

// ❌ BAD: No cleanup
function MyComponent() {
  const { connect } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws'
  })
  connect() // Leaks connection on unmount
}

// ❌ BAD: Sending without checking connection
const sendMessage = (data: any) => {
  sendJson(data) // May fail silently if not connected
}

// ❌ BAD: Accumulating unlimited messages
const { messages } = useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  // No maxMessageBufferSize - messages grow forever
})

// ❌ BAD: Using ws:// in production
useStreamingWebSocket({
  url: 'ws://api.example.com/ws' // Insecure!
})`

const typesCode = `// WebSocket message structure
interface WebSocketMessage {
  /** Message data (pre-parsed if JSON) */
  data: any
  /** Raw message data */
  raw: string | ArrayBuffer | Blob
  /** Message type (text, binary, blob) */
  type: 'text' | 'binary' | 'blob'
  /** Timestamp when message was received */
  timestamp: number
}

// Connection status
type WebSocketStatus =
  | 'idle'           // Not connected
  | 'connecting'     // Attempting connection
  | 'connected'      // Connected and ready
  | 'closing'        // Closing connection
  | 'closed'         // Connection closed
  | 'error'          // Error occurred
  | 'reconnecting'   // Attempting reconnection

// Options interface
interface UseStreamingWebSocketOptions {
  url: string
  protocols?: string | string[]
  autoReconnect?: boolean
  reconnectOnCleanClose?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
  maxReconnectDelay?: number
  reconnectSuccessThreshold?: number
  connectionTimeout?: number
  enableHeartbeat?: boolean
  heartbeatInterval?: number
  heartbeatTimeout?: number
  heartbeatMessage?: string
  autoParseJson?: boolean
  connectOnMount?: boolean
  maxMessageBufferSize?: number
  onMessageBufferOverflow?: (droppedCount: number, bufferSize: number) => void
  enableAcknowledgment?: boolean
  ackMessageType?: string
  onAcknowledgmentSent?: (messageId: string) => void
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onReconnecting?: (attempt: number, delay: number) => void
  onMaxReconnectAttemptsReached?: () => void
  onHeartbeatFailed?: () => void
}

// Return interface
interface UseStreamingWebSocketReturn {
  status: WebSocketStatus
  messages: WebSocketMessage[]
  lastMessage: WebSocketMessage | null
  error: Event | null
  readyState: number
  connect: () => void
  disconnect: (code?: number, reason?: string) => void
  send: (data: string | object | ArrayBuffer | Blob) => boolean
  sendJson: (data: any) => boolean
  reconnect: () => void
  reset: () => void
  reconnectAttempt: number
  isReconnecting: boolean
}

// WebSocket ready states
enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

// WebSocket close codes
enum WebSocketCloseCode {
  NORMAL = 1000,          // Normal closure
  GOING_AWAY = 1001,      // Server going away
  PROTOCOL_ERROR = 1002,  // Protocol error
  UNSUPPORTED_DATA = 1003,// Unsupported data
  INVALID_FRAME = 1007,   // Invalid frame payload
  POLICY_VIOLATION = 1008,// Policy violation
  MESSAGE_TOO_BIG = 1009, // Message too big
  INTERNAL_ERROR = 1011,  // Internal server error
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseStreamingWebSocketPage() {
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
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
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
                useStreamingWebSocket
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Production-ready WebSocket streaming hook with bidirectional
                communication, automatic reconnection with exponential backoff,
                heartbeat monitoring, message acknowledgment, and support for
                text and binary data. Built for real-time AI chat and
                collaborative applications.
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
                { icon: MessageCircle, label: 'Bidirectional', desc: 'Full duplex' },
                { icon: RefreshCw, label: 'Auto Reconnect', desc: 'Exponential backoff' },
                { icon: Activity, label: 'Heartbeat', desc: 'Connection health' },
                { icon: CheckCircle, label: 'Acknowledgment', desc: 'Delivery tracking' },
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
                  <code>useStreamingWebSocket</code> is a mid-level hook for
                  managing WebSocket connections with full-duplex bidirectional
                  communication. Unlike SSE (server-to-client only), WebSocket
                  enables real-time two-way messaging ideal for chat
                  applications, collaborative editing, and live updates.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Bidirectional Communication:</strong> Send and
                    receive messages in real-time
                  </li>
                  <li>
                    <strong>Automatic Reconnection:</strong> Exponential backoff
                    with jitter and success threshold
                  </li>
                  <li>
                    <strong>Heartbeat Monitoring:</strong> Detect and recover
                    from stale connections
                  </li>
                  <li>
                    <strong>Message Acknowledgment:</strong> Track message
                    delivery with automatic acks
                  </li>
                  <li>
                    <strong>Binary Support:</strong> Send and receive
                    ArrayBuffer, Blob, and text data
                  </li>
                  <li>
                    <strong>Memory Efficient:</strong> Bounded message buffer
                    prevents memory leaks
                  </li>
                  <li>
                    <strong>TypeScript First:</strong> Complete type safety with
                    discriminated message types
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <p>
                  Use <code>useStreamingWebSocket</code> when you need
                  bidirectional real-time communication. For server-to-client
                  streaming only, use <code>useStreamingSSE</code>. For
                  high-level chat, use <code>useClarityChat</code> with{' '}
                  <code>transport: &apos;websocket&apos;</code>.
                </p>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>SSE vs WebSocket:</strong> SSE is simpler and
                    better for server-to-client streaming. WebSocket is better
                    when you need client-to-server messaging, lower latency, or
                    binary data support.
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
                    option is required and must use <code>ws://</code> or{' '}
                    <code>wss://</code> protocol.
                  </p>
                </div>
              </div>
            </Section>

            {/* Parameters Section */}
            <Section id="parameters" title="Parameters">
              <p className="text-muted-foreground mb-6">
                Configure WebSocket connection behavior, reconnection strategy,
                heartbeat monitoring, and message handling.
              </p>

              <PropsTable props={optionsProps} />
            </Section>

            {/* Return Value Section */}
            <Section id="returns" title="Return Value">
              <p className="text-muted-foreground mb-6">
                Returns connection state, received messages, and control methods
                for sending and managing the WebSocket connection.
              </p>

              <PropsTable props={returnProps} />
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Connection">
                <p className="text-muted-foreground mb-4">
                  Simple WebSocket connection with status display and manual
                  controls:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicWebSocket.tsx"
                />
              </SubSection>

              <SubSection id="example-bidirectional" title="Bidirectional Chat">
                <p className="text-muted-foreground mb-4">
                  Real-time chat with bidirectional messaging and automatic JSON
                  parsing:
                </p>
                <CodeBlock
                  code={bidirectionalCode}
                  language="tsx"
                  filename="BidirectionalChat.tsx"
                />
              </SubSection>

              <SubSection id="example-binary" title="Binary Messages">
                <p className="text-muted-foreground mb-4">
                  Send and receive binary data (ArrayBuffer, Blob) for file
                  transfers:
                </p>
                <CodeBlock
                  code={binaryCode}
                  language="tsx"
                  filename="BinaryData.tsx"
                />
              </SubSection>

              <SubSection id="example-heartbeat" title="Heartbeat Monitoring">
                <p className="text-muted-foreground mb-4">
                  Monitor connection health with automatic heartbeat and
                  reconnection:
                </p>
                <CodeBlock
                  code={heartbeatCode}
                  language="tsx"
                  filename="HeartbeatMonitoring.tsx"
                />
              </SubSection>

              <SubSection id="example-acknowledgment" title="Message Acknowledgment">
                <p className="text-muted-foreground mb-4">
                  Track message delivery with automatic acknowledgment:
                </p>
                <CodeBlock
                  code={acknowledgmentCode}
                  language="tsx"
                  filename="MessageAcknowledgment.tsx"
                />
              </SubSection>
            </Section>

            {/* Advanced Usage Section */}
            <Section id="advanced" title="Advanced Usage">
              <p className="text-muted-foreground mb-4">
                Production patterns for connection quality monitoring,
                performance optimization, and reliability:
              </p>
              <CodeBlock
                code={advancedCode}
                language="tsx"
                filename="AdvancedWebSocket.tsx"
              />
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <p className="text-muted-foreground mb-4">
                Follow these patterns for reliable WebSocket connections:
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
                Complete type definitions for type-safe WebSocket streaming:
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
                    name: 'useStreamingSSE',
                    type: 'hook',
                    description: 'Server-Sent Events streaming (server-to-client only)',
                    href: '/reference/hooks/use-streaming-sse',
                  },
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'High-level chat hook with WebSocket support',
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
                  <h4 className="font-semibold text-foreground mb-2">
                    Connection failing with protocol error
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Ensure you're using the correct protocol:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      <code>wss://</code> for production (secure)
                    </li>
                    <li>
                      <code>ws://</code> for local development only
                    </li>
                    <li>
                      HTTPS pages cannot connect to <code>ws://</code> (mixed
                      content)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Messages not being received
                  </h4>
                  <p className="text-muted-foreground">
                    Check that <code>autoParseJson: true</code> matches your
                    server's message format. If the server sends plain text,
                    set to <code>false</code>. If sending JSON, ensure it's
                    valid JSON.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Reconnection not working
                  </h4>
                  <p className="text-muted-foreground">
                    Ensure <code>autoReconnect: true</code> is set. Check that{' '}
                    <code>reconnectOnCleanClose: true</code> if you need to
                    reconnect on server restarts. The hook uses exponential
                    backoff, so delays increase with each attempt.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    send() returns false
                  </h4>
                  <p className="text-muted-foreground">
                    The connection is not open. Check <code>status</code>{' '}
                    before sending. Only send when{' '}
                    <code>status === &apos;connected&apos;</code>.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Memory usage growing
                  </h4>
                  <p className="text-muted-foreground">
                    Set <code>maxMessageBufferSize</code> to limit stored
                    messages. The hook automatically drops oldest messages when
                    the buffer overflows. Call <code>reset()</code> periodically
                    for long-running connections.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Binary data not working
                  </h4>
                  <p className="text-muted-foreground">
                    Set <code>autoParseJson: false</code> when receiving binary
                    data. Check <code>message.type</code> to distinguish between{' '}
                    <code>text</code>, <code>binary</code>, and{' '}
                    <code>blob</code> messages.
                  </p>
                </div>
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-streaming-sse"
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
                      useStreamingSSE
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-token-budget-monitor"
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
                      useTokenBudgetMonitor
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
