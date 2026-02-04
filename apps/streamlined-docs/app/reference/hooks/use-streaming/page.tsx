'use client'

/**
 * Streaming Hooks - API Reference Documentation
 *
 * Documentation for useStreamingSSE and useStreamingWebSocket hooks.
 * Mid-level hooks for real-time streaming with automatic reconnection,
 * heartbeat monitoring, and connection management.
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
  Wifi,
  Radio,
  RefreshCw,
  AlertCircle,
  Clock,
  Shield,
  Activity,
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
  deprecated?: boolean
  deprecatedMessage?: string
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
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
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
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
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
  { id: 'comparison', title: 'SSE vs WebSocket' },
  { id: 'import', title: 'Import' },
  {
    id: 'use-streaming-sse',
    title: 'useStreamingSSE',
    children: [
      { id: 'sse-signature', title: 'Signature' },
      { id: 'sse-options', title: 'Options' },
      { id: 'sse-returns', title: 'Returns' },
    ],
  },
  {
    id: 'use-streaming-websocket',
    title: 'useStreamingWebSocket',
    children: [
      { id: 'ws-signature', title: 'Signature' },
      { id: 'ws-options', title: 'Options' },
      { id: 'ws-returns', title: 'Returns' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic-sse', title: 'Basic SSE' },
      { id: 'example-basic-ws', title: 'Basic WebSocket' },
      { id: 'example-reconnection', title: 'Reconnection Handling' },
      { id: 'example-chat', title: 'Chat Integration' },
    ],
  },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related APIs' },
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

const sseOptionsProps: PropDefinition[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'Base URL for SSE endpoint.',
  },
  {
    name: 'method',
    type: "'GET' | 'POST'",
    default: "'GET'",
    description: 'HTTP method for the request.',
  },
  {
    name: 'body',
    type: 'any',
    description: 'Request body for POST requests.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom request headers.',
  },
  {
    name: 'authToken',
    type: 'string',
    description: 'Authentication token (added to Authorization header).',
  },
  {
    name: 'useCookieFallback',
    type: 'boolean',
    default: 'true',
    description: 'Use cookie-based auth if header auth fails.',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic reconnection on connection loss.',
  },
  {
    name: 'maxReconnectAttempts',
    type: 'number',
    default: '5',
    description: 'Maximum reconnection attempts before giving up.',
  },
  {
    name: 'reconnectDelay',
    type: 'number',
    default: '1000',
    description: 'Initial reconnection delay in milliseconds.',
  },
  {
    name: 'maxReconnectDelay',
    type: 'number',
    default: '30000',
    description: 'Maximum reconnection delay in milliseconds.',
  },
  {
    name: 'reconnectSuccessThreshold',
    type: 'number',
    default: '3',
    description: 'Consecutive successes required to reset backoff.',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    default: '30000',
    description: 'Heartbeat interval in milliseconds.',
  },
  {
    name: 'connectionTimeout',
    type: 'number',
    default: '15000',
    description: 'Connection timeout in milliseconds.',
  },
  {
    name: 'maxEventBufferSize',
    type: 'number',
    default: '1000',
    description: 'Maximum events to keep in buffer (prevents memory leaks).',
  },
  {
    name: 'resumeFromLastEventId',
    type: 'boolean',
    default: 'true',
    description: 'Resume from last event ID on reconnection.',
  },
  {
    name: 'autoParseJson',
    type: 'boolean',
    default: 'true',
    description: 'Automatically parse JSON responses.',
  },
]

const sseCallbackProps: PropDefinition[] = [
  {
    name: 'onOpen',
    type: '() => void',
    description: 'Called when connection is established.',
  },
  {
    name: 'onMessage',
    type: '(event: SSEEvent) => void',
    description: 'Called for each SSE event received.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Called when an error occurs.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Called when connection is closed.',
  },
  {
    name: 'onReconnecting',
    type: '(attempt: number, delay: number) => void',
    description: 'Called when reconnection attempt starts.',
  },
  {
    name: 'onMaxReconnectAttemptsReached',
    type: '() => void',
    description: 'Called when max reconnection attempts reached.',
  },
  {
    name: 'onEventBufferOverflow',
    type: '(droppedCount: number, bufferSize: number) => void',
    description: 'Called when event buffer overflows.',
  },
]

const sseReturnProps: PropDefinition[] = [
  {
    name: 'status',
    type: 'SSEStatus',
    description:
      "Current connection status: 'idle' | 'connecting' | 'connected' | 'streaming' | 'error' | 'closed'.",
  },
  {
    name: 'events',
    type: 'SSEEvent[]',
    description: 'Array of all received events.',
  },
  {
    name: 'lastEvent',
    type: 'SSEEvent | null',
    description: 'Most recently received event.',
  },
  {
    name: 'data',
    type: 'string',
    description: 'Accumulated data from streaming events.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error if any.',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Initiate connection to SSE endpoint.',
  },
  {
    name: 'disconnect',
    type: '() => void',
    description: 'Disconnect from SSE endpoint.',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Disconnect and reconnect.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state and clear events.',
  },
  {
    name: 'reconnectAttempt',
    type: 'number',
    description: 'Current reconnection attempt number.',
  },
  {
    name: 'isReconnecting',
    type: 'boolean',
    description: 'Whether currently reconnecting.',
  },
]

const wsOptionsProps: PropDefinition[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'WebSocket URL (ws:// or wss://).',
  },
  {
    name: 'protocols',
    type: 'string | string[]',
    description: 'WebSocket sub-protocols to use.',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic reconnection.',
  },
  {
    name: 'reconnectOnCleanClose',
    type: 'boolean',
    default: 'true',
    description: 'Reconnect on clean server close (for server restarts).',
  },
  {
    name: 'maxReconnectAttempts',
    type: 'number',
    default: '5',
    description: 'Maximum reconnection attempts.',
  },
  {
    name: 'reconnectDelay',
    type: 'number',
    default: '1000',
    description: 'Initial reconnection delay in milliseconds.',
  },
  {
    name: 'maxReconnectDelay',
    type: 'number',
    default: '30000',
    description: 'Maximum reconnection delay in milliseconds.',
  },
  {
    name: 'reconnectSuccessThreshold',
    type: 'number',
    default: '3',
    description: 'Consecutive successes required to reset backoff.',
  },
  {
    name: 'connectionTimeout',
    type: 'number',
    default: '15000',
    description: 'Connection timeout in milliseconds.',
  },
  {
    name: 'enableHeartbeat',
    type: 'boolean',
    default: 'true',
    description: 'Enable heartbeat/ping-pong for keepalive.',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    default: '30000',
    description: 'Heartbeat interval in milliseconds.',
  },
  {
    name: 'heartbeatTimeout',
    type: 'number',
    default: '5000',
    description: 'Heartbeat timeout in milliseconds.',
  },
  {
    name: 'heartbeatMessage',
    type: 'string',
    default: "'ping'",
    description: 'Message to send for heartbeat.',
  },
  {
    name: 'autoParseJson',
    type: 'boolean',
    default: 'true',
    description: 'Automatically parse JSON messages.',
  },
  {
    name: 'connectOnMount',
    type: 'boolean',
    default: 'false',
    description: 'Connect immediately on mount.',
  },
  {
    name: 'maxMessageBufferSize',
    type: 'number',
    default: '1000',
    description: 'Maximum messages to keep in buffer.',
  },
  {
    name: 'enableAcknowledgment',
    type: 'boolean',
    default: 'false',
    description: 'Enable automatic message acknowledgment.',
  },
]

const wsCallbackProps: PropDefinition[] = [
  {
    name: 'onOpen',
    type: '(event: Event) => void',
    description: 'Called when connection is established.',
  },
  {
    name: 'onMessage',
    type: '(message: WebSocketMessage) => void',
    description: 'Called for each message received.',
  },
  {
    name: 'onError',
    type: '(event: Event) => void',
    description: 'Called when an error occurs.',
  },
  {
    name: 'onClose',
    type: '(event: CloseEvent) => void',
    description: 'Called when connection is closed.',
  },
  {
    name: 'onReconnecting',
    type: '(attempt: number, delay: number) => void',
    description: 'Called when reconnection attempt starts.',
  },
  {
    name: 'onMaxReconnectAttemptsReached',
    type: '() => void',
    description: 'Called when max reconnection attempts reached.',
  },
  {
    name: 'onHeartbeatFailed',
    type: '() => void',
    description: 'Called when heartbeat fails.',
  },
  {
    name: 'onMessageBufferOverflow',
    type: '(droppedCount: number, bufferSize: number) => void',
    description: 'Called when message buffer overflows.',
  },
  {
    name: 'onAcknowledgmentSent',
    type: '(messageId: string) => void',
    description: 'Called when an acknowledgment is sent.',
  },
]

const wsReturnProps: PropDefinition[] = [
  {
    name: 'status',
    type: 'WebSocketStatus',
    description:
      "Current status: 'idle' | 'connecting' | 'connected' | 'closing' | 'closed' | 'error' | 'reconnecting'.",
  },
  {
    name: 'messages',
    type: 'WebSocketMessage[]',
    description: 'Array of all received messages.',
  },
  {
    name: 'lastMessage',
    type: 'WebSocketMessage | null',
    description: 'Most recently received message.',
  },
  {
    name: 'error',
    type: 'Event | null',
    description: 'Current error event if any.',
  },
  {
    name: 'readyState',
    type: 'number',
    description: 'WebSocket ready state.',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Initiate WebSocket connection.',
  },
  {
    name: 'disconnect',
    type: '(code?: number, reason?: string) => void',
    description: 'Disconnect from WebSocket.',
  },
  {
    name: 'send',
    type: '(data: string | object | ArrayBuffer | Blob) => boolean',
    description: 'Send message through WebSocket.',
  },
  {
    name: 'sendJson',
    type: '(data: any) => boolean',
    description: 'Send JSON message (convenience method).',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Disconnect and reconnect.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state and clear messages.',
  },
  {
    name: 'reconnectAttempt',
    type: 'number',
    description: 'Current reconnection attempt number.',
  },
  {
    name: 'isReconnecting',
    type: 'boolean',
    description: 'Whether currently reconnecting.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  useStreamingSSE,
  useStreamingWebSocket,
  type SSEStatus,
  type SSEEvent,
  type UseStreamingSSEOptions,
  type UseStreamingSSEReturn,
  type WebSocketStatus,
  type WebSocketMessage,
  type UseStreamingWebSocketOptions,
  type UseStreamingWebSocketReturn,
} from '@clarity-chat/react'`

const sseSignatureCode = `function useStreamingSSE(
  options: UseStreamingSSEOptions
): UseStreamingSSEReturn`

const wsSignatureCode = `function useStreamingWebSocket(
  options: UseStreamingWebSocketOptions
): UseStreamingWebSocketReturn`

const basicSSECode = `import { useStreamingSSE } from '@clarity-chat/react'

function StreamingChat() {
  const {
    status,
    data,
    error,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello', conversationId: '123' },
    authToken: user.token,
    onMessage: (event) => {
      console.log('Received:', event.data)
      if (event.type === 'done') {
        disconnect()
      }
    },
    onError: (error) => console.error('SSE Error:', error),
  })

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Send Message
      </button>
      <button onClick={disconnect} disabled={status === 'idle'}>
        Cancel
      </button>

      {status === 'streaming' && <div className="response">{data}</div>}
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  )
}`

const basicWSCode = `import { useStreamingWebSocket } from '@clarity-chat/react'

function RealtimeChat() {
  const {
    status,
    messages,
    lastMessage,
    connect,
    disconnect,
    send,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    onOpen: () => console.log('Connected!'),
    onMessage: (msg) => console.log('Received:', msg.data),
    onClose: () => console.log('Disconnected'),
  })

  React.useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  const sendMessage = () => {
    send({ type: 'message', content: 'Hello!' })
  }

  return (
    <div>
      <div>Status: {status}</div>
      <button onClick={sendMessage} disabled={status !== 'connected'}>
        Send Message
      </button>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{JSON.stringify(msg.data)}</div>
        ))}
      </div>
    </div>
  )
}`

const reconnectionCode = `import { useStreamingSSE } from '@clarity-chat/react'

function ResilientStream() {
  const {
    status,
    data,
    reconnectAttempt,
    isReconnecting,
    connect,
  } = useStreamingSSE({
    url: '/api/stream',
    autoReconnect: true,
    maxReconnectAttempts: 10,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    reconnectSuccessThreshold: 3,
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting... attempt \${attempt} in \${delay}ms\`)
    },
    onMaxReconnectAttemptsReached: () => {
      console.error('Connection lost. Please refresh the page.')
    },
  })

  return (
    <div>
      {isReconnecting && (
        <div className="reconnecting-banner">
          Reconnecting... (attempt {reconnectAttempt})
        </div>
      )}
      <div>{data}</div>
    </div>
  )
}`

const chatIntegrationCode = `import { useStreamingSSE } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function ChatWithStreaming() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const {
    status,
    data: streamingContent,
    connect,
    disconnect,
    reset,
  } = useStreamingSSE({
    url: '/api/chat',
    method: 'POST',
    onMessage: (event) => {
      if (event.type === 'done') {
        // Finalize the assistant message
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant') {
            return prev.map((m, i) =>
              i === prev.length - 1
                ? { ...m, content: streamingContent }
                : m
            )
          }
          return prev
        })
        disconnect()
        reset()
      }
    },
  })

  const sendMessage = useCallback(() => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    }

    // Add placeholder assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')

    // Start streaming
    connect()
  }, [input, connect])

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={\`message \${msg.role}\`}>
            {msg.role === 'assistant' && status === 'streaming'
              ? streamingContent
              : msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === 'streaming'}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={status === 'streaming'}>
          Send
        </button>
      </form>
    </div>
  )
}`

const typesCode = `// SSE Types
type SSEStatus = 'idle' | 'connecting' | 'connected' | 'streaming' | 'error' | 'closed'

interface SSEEvent {
  type: string
  data: any
  raw: string
  id?: string
  retry?: number
}

// WebSocket Types
type WebSocketStatus = 'idle' | 'connecting' | 'connected' | 'closing' | 'closed' | 'error' | 'reconnecting'

interface WebSocketMessage {
  data: any
  raw: string | ArrayBuffer | Blob
  type: 'text' | 'binary' | 'blob'
  timestamp: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseStreamingPage() {
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
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Hooks
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                Streaming Hooks
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Mid-level hooks for real-time streaming via Server-Sent Events
                (SSE) and WebSocket. Features automatic reconnection, heartbeat
                monitoring, and production-ready connection management.
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
                {
                  icon: RefreshCw,
                  label: 'Auto-Reconnect',
                  desc: 'Exponential backoff',
                },
                {
                  icon: Activity,
                  label: 'Heartbeat',
                  desc: 'Connection health',
                },
                {
                  icon: Shield,
                  label: 'Auth Support',
                  desc: 'Token & cookies',
                },
                { icon: Zap, label: 'RAF Batching', desc: '60fps rendering' },
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
                  The streaming hooks provide production-ready real-time
                  communication for AI chat applications. They are mid-level
                  hooks in the Clarity architecture, sitting between the
                  low-level <code>useStreaming</code> primitive and the
                  top-level <code>useClarityChat</code>.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Automatic Reconnection:</strong> Exponential backoff
                    with jitter to prevent thundering herd
                  </li>
                  <li>
                    <strong>Heartbeat Monitoring:</strong> Detect stale
                    connections before they cause issues
                  </li>
                  <li>
                    <strong>Authentication:</strong> Support for token headers
                    and cookie fallback
                  </li>
                  <li>
                    <strong>Memory Management:</strong> Bounded event buffers
                    prevent memory leaks
                  </li>
                  <li>
                    <strong>RAF Batching:</strong> 60fps rendering performance
                    via requestAnimationFrame
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Architecture Layer
                </h4>
                <p>
                  These hooks are in the{' '}
                  <strong>Mid-Level (Composable Building Blocks)</strong> layer.
                  For drop-in chat functionality, use
                  <code>useClarityChat</code> with the <code>transport</code>
                  option set to <code>&apos;sse&apos;</code> or{' '}
                  <code>&apos;websocket&apos;</code>.
                </p>
              </div>
            </Section>

            {/* Comparison Section */}
            <Section id="comparison" title="SSE vs WebSocket">
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left font-semibold">
                        Feature
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">SSE</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        WebSocket
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium">Direction</td>
                      <td className="px-4 py-3">Server to Client only</td>
                      <td className="px-4 py-3">Bidirectional</td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-medium">Protocol</td>
                      <td className="px-4 py-3">HTTP/1.1 or HTTP/2</td>
                      <td className="px-4 py-3">WebSocket (ws://)</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium">Best For</td>
                      <td className="px-4 py-3">OpenAI/Anthropic streaming</td>
                      <td className="px-4 py-3">
                        Real-time bidirectional chat
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-medium">Reconnection</td>
                      <td className="px-4 py-3">Built-in with Last-Event-ID</td>
                      <td className="px-4 py-3">Manual, custom protocol</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium">Proxy Support</td>
                      <td className="px-4 py-3">Excellent (standard HTTP)</td>
                      <td className="px-4 py-3">May require configuration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Use Case</td>
                      <td className="px-4 py-3">
                        AI completions, notifications
                      </td>
                      <td className="px-4 py-3">Chat, gaming, collaboration</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Recommendation:</strong> Use SSE for most AI chat
                  applications. It works better with existing infrastructure,
                  supports automatic reconnection with event resumption, and is
                  simpler to debug. Use WebSocket only when you need true
                  bidirectional communication.
                </p>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* useStreamingSSE Section */}
            <Section id="use-streaming-sse" title="useStreamingSSE">
              <p className="text-muted-foreground mb-6">
                Production-ready SSE streaming hook with automatic reconnection,
                authentication handling, and event resumption.
              </p>

              <SubSection id="sse-signature" title="Signature">
                <CodeBlock
                  code={sseSignatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="sse-options" title="Options">
                <PropsTable props={sseOptionsProps} title="Core Options" />
                <div className="mt-4">
                  <PropsTable props={sseCallbackProps} title="Callbacks" />
                </div>
              </SubSection>

              <SubSection id="sse-returns" title="Returns">
                <PropsTable props={sseReturnProps} />
              </SubSection>
            </Section>

            {/* useStreamingWebSocket Section */}
            <Section id="use-streaming-websocket" title="useStreamingWebSocket">
              <p className="text-muted-foreground mb-6">
                Production-ready WebSocket hook with heartbeat/ping-pong,
                automatic reconnection, and message acknowledgment support.
              </p>

              <SubSection id="ws-signature" title="Signature">
                <CodeBlock
                  code={wsSignatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="ws-options" title="Options">
                <PropsTable props={wsOptionsProps} title="Core Options" />
                <div className="mt-4">
                  <PropsTable props={wsCallbackProps} title="Callbacks" />
                </div>
              </SubSection>

              <SubSection id="ws-returns" title="Returns">
                <PropsTable props={wsReturnProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic-sse" title="Basic SSE Usage">
                <p className="text-muted-foreground mb-4">
                  Connect to an SSE endpoint and stream responses:
                </p>
                <CodeBlock
                  code={basicSSECode}
                  language="tsx"
                  filename="BasicSSE.tsx"
                />
              </SubSection>

              <SubSection id="example-basic-ws" title="Basic WebSocket Usage">
                <p className="text-muted-foreground mb-4">
                  Establish a bidirectional WebSocket connection:
                </p>
                <CodeBlock
                  code={basicWSCode}
                  language="tsx"
                  filename="BasicWebSocket.tsx"
                />
              </SubSection>

              <SubSection
                id="example-reconnection"
                title="Reconnection Handling"
              >
                <p className="text-muted-foreground mb-4">
                  Configure automatic reconnection with exponential backoff:
                </p>
                <CodeBlock
                  code={reconnectionCode}
                  language="tsx"
                  filename="ResilientStream.tsx"
                />
              </SubSection>

              <SubSection id="example-chat" title="Chat Integration">
                <p className="text-muted-foreground mb-4">
                  Full chat implementation with SSE streaming:
                </p>
                <CodeBlock
                  code={chatIntegrationCode}
                  language="tsx"
                  filename="ChatWithStreaming.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Connection keeps reconnecting
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    This usually indicates a server-side issue or network
                    instability.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Check server logs for errors</li>
                    <li>Verify the endpoint URL is correct</li>
                    <li>Ensure authentication tokens are valid</li>
                    <li>
                      Check for proxy timeouts (increase heartbeat interval)
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Events not parsing correctly
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    SSE events may not be in the expected format.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Check if server sends valid SSE format (data: prefix)
                    </li>
                    <li>
                      Set <code>autoParseJson: false</code> to debug raw events
                    </li>
                    <li>
                      Ensure Content-Type is <code>text/event-stream</code>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    WebSocket connection fails
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    WebSocket connections may be blocked by firewalls or
                    proxies.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Ensure URL uses <code>wss://</code> for secure connections
                    </li>
                    <li>Check CORS configuration on server</li>
                    <li>Verify WebSocket is not blocked by proxy</li>
                    <li>Try SSE as a fallback option</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Memory usage growing over time
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Long-running connections may accumulate events.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Reduce <code>maxEventBufferSize</code> /{' '}
                      <code>maxMessageBufferSize</code>
                    </li>
                    <li>
                      Call <code>reset()</code> periodically for long sessions
                    </li>
                    <li>
                      Use <code>lastEvent</code> / <code>lastMessage</code>{' '}
                      instead of arrays
                    </li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description:
                      'Top-level chat hook with built-in streaming support',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'useStreaming',
                    type: 'hook',
                    description:
                      'Low-level primitive for ReadableStream handling',
                    href: '/reference/hooks/use-streaming-primitive',
                  },
                  {
                    name: 'StreamingMessage',
                    type: 'component',
                    description: 'Component for rendering streaming text',
                    href: '/reference/components/streaming-message',
                  },
                  {
                    name: 'useSmoothedText',
                    type: 'hook',
                    description: '60fps text smoothing for stream output',
                    href: '/reference/hooks/use-smoothed-text',
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

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-clarity-chat"
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
                      useClarityChat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-token-optimization"
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
                      Token Optimization Hooks
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
