import { logger } from '@clarity-chat/utils/logger';
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastProvider, useStreamingSSE } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicSSEDemo() {
  const [connected, setConnected] = useState(false)

  const { status, data, events, error, connect, disconnect } = useStreamingSSE({
    url: '/api/stream',
    method: 'POST',
    body: { message: 'Hello' },
    onMessage: (event) => {
      logger.debug('Received event:', event)
    },
    onError: (err) => {
      logger.error('SSE Error:', err)
    },
  })

  useEffect(() => {
    if (connected && status === 'idle') {
      connect()
    }
  }, [connected, connect, status])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setConnected(true)
              connect()
            }}
            disabled={status !== 'idle'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Connect
          </button>
          <button
            onClick={() => {
              disconnect()
              setConnected(false)
            }}
            disabled={status === 'idle'}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
          >
            Disconnect
          </button>
          <span className="text-sm text-muted-foreground">
            Status: {status}
          </span>
        </div>
        {data && (
          <div className="p-3 bg-muted rounded">
            <p className="text-sm">{data}</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded">
            <p className="text-sm">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const useStreamingSSEOptionsProps: Prop[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'Base URL for SSE endpoint. Can be relative or absolute.',
  },
  {
    name: 'method',
    type: '"GET" | "POST"',
    default: '"GET"',
    description:
      'HTTP method for the SSE request. POST allows sending a request body.',
  },
  {
    name: 'body',
    type: 'any',
    description: 'Request body for POST requests. Will be JSON stringified.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Additional HTTP headers to send with the request.',
  },
  {
    name: 'authToken',
    type: 'string',
    description:
      'Authentication token. Automatically added to headers as "Authorization: Bearer {token}".',
  },
  {
    name: 'useCookieFallback',
    type: 'boolean',
    default: 'true',
    description: 'Use cookie-based authentication if header auth fails.',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically reconnect on connection loss with exponential backoff.',
  },
  {
    name: 'maxReconnectAttempts',
    type: 'number',
    default: '5',
    description: 'Maximum number of reconnection attempts before giving up.',
  },
  {
    name: 'reconnectDelay',
    type: 'number',
    default: '1000',
    description:
      'Initial reconnection delay in milliseconds. Increases exponentially.',
  },
  {
    name: 'maxReconnectDelay',
    type: 'number',
    default: '30000',
    description: 'Maximum reconnection delay in milliseconds.',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    default: '30000',
    description:
      'Heartbeat interval in milliseconds. Server should send keepalive comments.',
  },
  {
    name: 'resumeFromLastEventId',
    type: 'boolean',
    default: 'true',
    description:
      'Resume from last event ID if connection is lost. Requires server support.',
  },
  {
    name: 'autoParseJson',
    type: 'boolean',
    default: 'true',
    description: 'Automatically parse JSON event data.',
  },
  {
    name: 'onOpen',
    type: '() => void',
    description: 'Callback when SSE connection is established.',
  },
  {
    name: 'onMessage',
    type: '(event: SSEEvent) => void',
    description:
      'Callback for each SSE event received. Receives parsed event object.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Callback when SSE connection is closed.',
  },
  {
    name: 'onReconnecting',
    type: '(attempt: number, delay: number) => void',
    description:
      'Callback when reconnection attempt starts. Receives attempt number and delay.',
  },
  {
    name: 'onMaxReconnectAttemptsReached',
    type: '() => void',
    description: 'Callback when maximum reconnection attempts are reached.',
  },
]

const useStreamingSSEReturnProps: Prop[] = [
  {
    name: 'status',
    type: '"idle" | "connecting" | "connected" | "streaming" | "error" | "closed"',
    description: 'Current connection status.',
  },
  {
    name: 'events',
    type: 'SSEEvent[]',
    description: 'Array of all received SSE events.',
  },
  {
    name: 'lastEvent',
    type: 'SSEEvent | null',
    description: 'Latest received event.',
  },
  {
    name: 'data',
    type: 'string',
    description: 'Accumulated data from streaming events.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Current error if connection failed.',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Connect to the SSE endpoint.',
  },
  {
    name: 'disconnect',
    type: '() => void',
    description: 'Disconnect from the SSE endpoint.',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Reconnect (disconnect and connect again).',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state and clear all events.',
  },
  {
    name: 'reconnectAttempt',
    type: 'number',
    description: 'Current reconnection attempt number (0 if not reconnecting).',
  },
  {
    name: 'isReconnecting',
    type: 'boolean',
    description: 'Whether currently attempting to reconnect.',
  },
]

export default function UseStreamingSSEPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useStreamingSSE</h1>

        <p className="lead">
          A production-ready hook for Server-Sent Events (SSE) streaming with
          automatic reconnection, authentication handling, event parsing, and
          network status detection.
        </p>

        <Callout type="info">
          <p>
            For chat streaming, use{' '}
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> with{' '}
            <code>transport: 'sse'</code>. useStreamingSSE is for custom SSE
            implementations.
          </p>
        </Callout>

        <ViewInStorybook component="useStreamingSSE" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try connecting to an SSE stream! See how events are received and
            status changes.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const { status, data, connect, disconnect } = useStreamingSSE({
    url: '/api/stream',
    onMessage: (event) => {
      logger.debug('Event:', event)
    },
  })

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Connect
      </button>
      <button onClick={disconnect} disabled={status === 'idle'}>
        Disconnect
      </button>
      <p>Status: {status}</p>
      <p>Data: {data}</p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'
import type { SSEEvent, UseStreamingSSEOptions, UseStreamingSSEReturn } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>Connect to an SSE endpoint and receive streaming events:</p>

        <ComponentPreview
          title="Simple SSE Connection"
          description="Basic SSE connection with manual connect/disconnect"
          code={`import { useStreamingSSE } from '@clarity-chat/react'
import { useEffect } from 'react'

function SimpleSSE() {
  const {
    status,
    data,
    events,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/stream',
    onMessage: (event) => {
      logger.debug('Received:', event.data)
    },
  })

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return (
    <div>
      <p>Status: {status}</p>
      <p>Data: {data}</p>
      <p>Events: {events.length}</p>
    </div>
  )
}`}
        >
          <BasicSSEDemo />
        </ComponentPreview>

        <h2 id="with-post-request">With POST Request</h2>

        <p>Send data with POST request:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEWithPost() {
  const {
    status,
    data,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: {
      message: 'Hello, AI!',
      conversationId: 'conv-123',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    onMessage: (event) => {
      if (event.type === 'done') {
        disconnect()
      }
    },
  })

  return (
    <div>
      <button onClick={connect}>Start Stream</button>
      <div>{data}</div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="authentication">Authentication</h2>

        <p>Add authentication token or use cookie-based auth:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEWithAuth() {
  const userToken = 'your-auth-token'

  const {
    status,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/stream',
    authToken: userToken, // Automatically added as "Authorization: Bearer {token}"
    useCookieFallback: true, // Fall back to cookies if header auth fails
    onError: (error) => {
      if (error.message.includes('401')) {
        // Handle authentication error
        logger.error('Authentication failed')
      }
    },
  })

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <p>Status: {status}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="automatic-reconnection">Automatic Reconnection</h2>

        <p>Configure automatic reconnection with exponential backoff:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEWithReconnect() {
  const {
    status,
    reconnectAttempt,
    isReconnecting,
    connect,
  } = useStreamingSSE({
    url: '/api/stream',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000, // Start with 1 second
    maxReconnectDelay: 30000, // Max 30 seconds
    onReconnecting: (attempt, delay) => {
      logger.debug(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },
    onMaxReconnectAttemptsReached: () => {
      logger.error('Max reconnection attempts reached')
    },
  })

  return (
    <div>
      <p>Status: {status}</p>
      {isReconnecting && (
        <p>Reconnecting... (attempt {reconnectAttempt})</p>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            Reconnection delay increases exponentially: 1s → 2s → 4s → 8s → 16s
            → 30s (max). This prevents overwhelming the server while ensuring
            eventual reconnection.
          </p>
        </Callout>

        <h2 id="event-handling">Event Handling</h2>

        <p>Handle different event types:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'
import type { SSEEvent } from '@clarity-chat/react'

function SSEWithEventHandling() {
  const {
    events,
    lastEvent,
    connect,
  } = useStreamingSSE({
    url: '/api/stream',
    onMessage: (event: SSEEvent) => {
      switch (event.type) {
        case 'message':
          logger.debug('Message:', event.data)
          break
        case 'error':
          logger.error('Error event:', event.data)
          break
        case 'done':
          logger.debug('Stream complete')
          break
        default:
          logger.debug('Unknown event type:', event.type)
      }
    },
  })

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <div>
        <p>Total events: {events.length}</p>
        {lastEvent && (
          <p>Last event: {lastEvent.type} - {JSON.stringify(lastEvent.data)}</p>
        )}
      </div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="resume-from-event-id">Resume from Event ID</h2>

        <p>Resume streaming from the last event ID after reconnection:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEWithResume() {
  const {
    events,
    connect,
  } = useStreamingSSE({
    url: '/api/stream',
    resumeFromLastEventId: true, // Automatically resume from last event
    onMessage: (event) => {
      // Server should include Last-Event-ID header on reconnect
      logger.debug('Event ID:', event.id)
    },
  })

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <p>Events: {events.length}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable props={useStreamingSSEOptionsProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={useStreamingSSEReturnProps} />

        <h2 id="sse-event-type">SSEEvent Type</h2>

        <p>
          The <code>SSEEvent</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface SSEEvent {
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
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useEffect, useCallback } from 'react'
import { useStreamingSSE } from '@clarity-chat/react'
import type { SSEEvent } from '@clarity-chat/react'

function CompleteSSEExample() {
  const [messages, setMessages] = useState<string[]>([])

  const {
    status,
    data,
    events,
    error,
    connect,
    disconnect,
    reconnect,
    reset,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: {
      message: 'Tell me a story',
      conversationId: 'conv-123',
    },
    authToken: 'your-token',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    resumeFromLastEventId: true,
    onMessage: (event: SSEEvent) => {
      if (event.type === 'message') {
        setMessages(prev => [...prev, event.data])
      } else if (event.type === 'done') {
        disconnect()
      }
    },
    onError: (err) => {
      logger.error('SSE Error:', err)
    },
    onReconnecting: (attempt, delay) => {
      logger.debug(\`Reconnecting in \${delay}ms (attempt \${attempt})\`)
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={connect}
          disabled={status !== 'idle'}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={status === 'idle'}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
        >
          Disconnect
        </button>
        <button
          onClick={reconnect}
          disabled={status === 'idle'}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
        >
          Reconnect
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
        >
          Reset
        </button>
      </div>

      <div>
        <p>Status: {status}</p>
        {error && <p className="text-destructive">Error: {error.message}</p>}
      </div>

      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-muted rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The API endpoint{' '}
            <code>/api/chat/stream</code> is a placeholder. You'll need to
            implement your own SSE endpoint that sends Server-Sent Events.
          </p>
        </Callout>

        <h2 id="server-implementation">Server Implementation Example</h2>

        <p>Example Next.js API route for SSE:</p>

        <EnhancedCodeBlock
          code={`// app/api/stream/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message } = await req.json()

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Send initial event
      controller.enqueue(
        encoder.encode(\`event: message\\ndata: {"type":"start"}\\n\\n\`)
      )

      // Simulate streaming response
      const words = message.split(' ')
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        controller.enqueue(
          encoder.encode(\`event: message\\ndata: {"type":"token","content":"\${words[i]} "}\\nid: \${i}\\n\\n\`)
        )
      }

      // Send done event
      controller.enqueue(
        encoder.encode(\`event: done\\ndata: {"type":"done"}\\n\\n\`)
      )

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="status-values">Status Values</h2>

        <p>Connection status can be one of:</p>

        <ul>
          <li>
            <strong>idle:</strong> Not connected, ready to connect
          </li>
          <li>
            <strong>connecting:</strong> Establishing connection
          </li>
          <li>
            <strong>connected:</strong> Connection established, waiting for
            events
          </li>
          <li>
            <strong>streaming:</strong> Actively receiving events
          </li>
          <li>
            <strong>error:</strong> Connection error occurred
          </li>
          <li>
            <strong>closed:</strong> Connection closed
          </li>
        </ul>

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Clean up on unmount:</strong> Always call{' '}
            <code>disconnect()</code> in cleanup
          </li>
          <li>
            <strong>Handle errors:</strong> Provide <code>onError</code>{' '}
            callback for error handling
          </li>
          <li>
            <strong>Monitor status:</strong> Use <code>status</code> to show
            connection state in UI
          </li>
          <li>
            <strong>Use reconnection:</strong> Enable <code>autoReconnect</code>{' '}
            for production apps
          </li>
          <li>
            <strong>Resume support:</strong> Enable{' '}
            <code>resumeFromLastEventId</code> if server supports it
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-streaming-websocket">
              useStreamingWebSocket
            </a>{' '}
            - WebSocket streaming hook
          </li>
          <li>
            <a href="/reference/hooks/use-streamable-ui">useStreamableUI</a> -
            UI state for streaming
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Chat hook with SSE support
          </li>
          <li>
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            - Display streaming content
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - SSE vs WebSocket
            comparison
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useClarityObject',
            href: '/reference/hooks/use-clarity-object',
          }}
          next={{
            title: 'useStreamingWebSocket',
            href: '/reference/hooks/use-streaming-websocket',
          }}
        />
      </>
    </ToastProvider>
  )
}
