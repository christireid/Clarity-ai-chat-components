// TODO: useStreamingWebSocket is planned but not yet implemented in @clarity-chat/react.
// This page documents the intended API and features.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import { useStreamingWebSocket } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Placeholder demo component - shows Coming Soon notice
function BasicWebSocketDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            aria-label="Connect to WebSocket"
          >
            Connect (Coming Soon)
          </button>
          <button
            disabled
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
            aria-label="Disconnect from WebSocket"
          >
            Disconnect
          </button>
          <span className="text-sm text-muted-foreground">
            Status: idle
          </span>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            useStreamingWebSocket is planned but not yet implemented.
          </p>
        </div>
      </div>
    </div>
  )
}

const useStreamingWebSocketOptionsProps: Prop[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description:
      'WebSocket URL (ws:// or wss://). Must be a valid WebSocket URL.',
  },
  {
    name: 'protocols',
    type: 'string | string[]',
    description: 'WebSocket subprotocols to use.',
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
    name: 'enableHeartbeat',
    type: 'boolean',
    default: 'true',
    description:
      'Enable heartbeat/ping-pong mechanism to keep connection alive.',
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
    description:
      'Heartbeat timeout in milliseconds. If no pong received, connection is considered dead.',
  },
  {
    name: 'heartbeatMessage',
    type: 'string',
    default: '"ping"',
    description: 'Heartbeat message to send (ping).',
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
    description: 'Connect immediately when component mounts.',
  },
  {
    name: 'onOpen',
    type: '(event: Event) => void',
    description: 'Callback when WebSocket connection is opened.',
  },
  {
    name: 'onMessage',
    type: '(message: WebSocketMessage) => void',
    description:
      'Callback for each message received. Receives parsed message object.',
  },
  {
    name: 'onError',
    type: '(event: Event) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'onClose',
    type: '(event: CloseEvent) => void',
    description: 'Callback when WebSocket connection is closed.',
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
  {
    name: 'onHeartbeatFailed',
    type: '() => void',
    description: 'Callback when heartbeat fails (no pong received).',
  },
]

const useStreamingWebSocketReturnProps: Prop[] = [
  {
    name: 'status',
    type: '"idle" | "connecting" | "connected" | "closing" | "closed" | "error" | "reconnecting"',
    description: 'Current connection status.',
  },
  {
    name: 'messages',
    type: 'WebSocketMessage[]',
    description: 'Array of all received messages.',
  },
  {
    name: 'lastMessage',
    type: 'WebSocketMessage | null',
    description: 'Latest received message.',
  },
  {
    name: 'error',
    type: 'Event | null',
    description: 'Current error if connection failed.',
  },
  {
    name: 'readyState',
    type: 'number',
    description:
      'WebSocket ready state (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED).',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Connect to the WebSocket.',
  },
  {
    name: 'disconnect',
    type: '(code?: number, reason?: string) => void',
    description:
      'Disconnect from the WebSocket. Optionally provide close code and reason.',
  },
  {
    name: 'send',
    type: '(data: string | object | ArrayBuffer | Blob) => boolean',
    description:
      'Send a message. Returns true if sent successfully, false if connection not open.',
  },
  {
    name: 'sendJson',
    type: '(data: any) => boolean',
    description: 'Send a JSON message. Automatically stringifies the object.',
  },
  {
    name: 'reconnect',
    type: '() => void',
    description: 'Reconnect (disconnect and connect again).',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state and clear all messages.',
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

export default function UseStreamingWebSocketPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useStreamingWebSocket</h1>

        <p className="lead">
          A production-ready hook for bidirectional WebSocket streaming with
          automatic reconnection, heartbeat/ping-pong, message queuing, and
          lifecycle management.
        </p>

        <Callout type="warning" className="mb-6">
          <p>
            <strong>Coming Soon:</strong> useStreamingWebSocket is planned but not yet
            implemented in @clarity-chat/react. This page documents the intended API.
          </p>
        </Callout>

        <Callout type="info">
          <p>
            For chat streaming, use{' '}
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> with{' '}
            <code>transport: 'websocket'</code>. useStreamingWebSocket is for
            custom WebSocket implementations.
          </p>
        </Callout>

        <ViewInStorybook component="useStreamingWebSocket" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try connecting to a WebSocket! Send messages and see them echoed
            back.
          </p>
          <CodePlayground
            initialCode={`// useStreamingWebSocket is coming soon!
// This playground will be functional once the hook is implemented.

function Example() {
  // Once implemented:
  // const { status, messages, connect, disconnect, sendJson } = useStreamingWebSocket({
  //   url: 'wss://echo.websocket.org',
  //   onMessage: (msg) => {
  //     console.log('Received:', msg.data)
  //   },
  // })

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <p className="text-center text-muted-foreground py-8">
        useStreamingWebSocket coming soon...
      </p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`// Coming soon:
import { useStreamingWebSocket } from '@clarity-chat/react'
import type { WebSocketMessage, UseStreamingWebSocketOptions, UseStreamingWebSocketReturn } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>Connect to a WebSocket and send/receive messages:</p>

        <ComponentPreview
          title="Simple WebSocket Connection"
          description="Basic WebSocket connection with send/receive"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'
import { useEffect } from 'react'

function SimpleWebSocket() {
  const {
    status,
    messages,
    connect,
    disconnect,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    onMessage: (msg) => {
      console.log('Received:', msg.data)
    },
  })

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => sendJson({ type: 'ping' })}>Send Ping</button>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{JSON.stringify(msg.data)}</div>
        ))}
      </div>
    </div>
  )
}`}
        >
          <BasicWebSocketDemo />
        </ComponentPreview>

        <h2 id="automatic-reconnection">Automatic Reconnection</h2>

        <p>Configure automatic reconnection with exponential backoff:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketWithReconnect() {
  const {
    status,
    reconnectAttempt,
    isReconnecting,
    connect,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },
    onMaxReconnectAttemptsReached: () => {
      console.error('Max reconnection attempts reached')
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

        <h2 id="heartbeat">Heartbeat/Ping-Pong</h2>

        <p>Keep connection alive with heartbeat mechanism:</p>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketWithHeartbeat() {
  const {
    status,
    connect,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    enableHeartbeat: true,
    heartbeatInterval: 30000, // Send ping every 30 seconds
    heartbeatTimeout: 5000, // Timeout after 5 seconds
    heartbeatMessage: 'ping',
    onHeartbeatFailed: () => {
      console.error('Heartbeat failed - connection may be dead')
      // Hook will automatically attempt reconnection
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

        <Callout type="tip">
          <p>
            The heartbeat mechanism sends a ping message at regular intervals.
            If no pong is received within the timeout period, the connection is
            considered dead and reconnection is attempted.
          </p>
        </Callout>

        <h2 id="options">Options</h2>

        <PropsTable props={useStreamingWebSocketOptionsProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={useStreamingWebSocketReturnProps} />

        <h2 id="websocket-message-type">WebSocketMessage Type</h2>

        <p>
          The <code>WebSocketMessage</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface WebSocketMessage {
  /** Message data (pre-parsed if JSON) */
  data: any
  /** Raw message data */
  raw: string | ArrayBuffer | Blob
  /** Message type (text, binary, blob) */
  type: 'text' | 'binary' | 'blob'
  /** Timestamp when message was received */
  timestamp: number
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="ready-state">Ready State</h2>

        <p>WebSocket ready state constants:</p>

        <ul>
          <li>
            <strong>0 (CONNECTING):</strong> Connection is being established
          </li>
          <li>
            <strong>1 (OPEN):</strong> Connection is open and ready
          </li>
          <li>
            <strong>2 (CLOSING):</strong> Connection is being closed
          </li>
          <li>
            <strong>3 (CLOSED):</strong> Connection is closed
          </li>
        </ul>

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The WebSocket URL{' '}
            <code>wss://api.example.com/ws</code> is a placeholder. You'll need
            to implement your own WebSocket server or use a service that
            provides WebSocket endpoints.
          </p>
        </Callout>

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
            <strong>connected:</strong> Connection open and ready
          </li>
          <li>
            <strong>closing:</strong> Connection is being closed
          </li>
          <li>
            <strong>closed:</strong> Connection closed
          </li>
          <li>
            <strong>error:</strong> Connection error occurred
          </li>
          <li>
            <strong>reconnecting:</strong> Attempting to reconnect
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
            <strong>Enable heartbeat:</strong> Use <code>enableHeartbeat</code>{' '}
            to detect dead connections
          </li>
          <li>
            <strong>Check ready state:</strong> Verify{' '}
            <code>status === 'connected'</code> before sending
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-streaming-sse">useStreamingSSE</a> -
            SSE streaming hook
          </li>
          <li>
            <a href="/reference/hooks/use-streamable-ui">useStreamableUI</a> -
            UI state for streaming
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Chat hook with WebSocket support
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
            title: 'useStreamingSSE',
            href: '/reference/hooks/use-streaming-sse',
          }}
          next={{
            title: 'useStreamableUI',
            href: '/reference/hooks/use-streamable-ui',
          }}
        />
      </>
    </ToastProvider>
  )
}
