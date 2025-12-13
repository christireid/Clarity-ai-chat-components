'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastProvider, useStreamingWebSocket } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicWebSocketDemo() {
  const [connected, setConnected] = useState(false)
  const [message, setMessage] = useState('')

  const {
    status,
    messages,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://echo.websocket.org', // Public echo server for demo
    onMessage: (msg) => {
      console.log('Received:', msg.data)
    },
    onError: (err) => {
      console.error('WebSocket Error:', err)
    },
  })

  useEffect(() => {
    if (connected && status === 'idle') {
      connect()
    }
  }, [connected, connect, status])

  const handleSend = useCallback(() => {
    if (message.trim() && status === 'connected') {
      sendJson({ type: 'message', content: message })
      setMessage('')
    }
  }, [message, status, sendJson])

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
            aria-label="Connect to WebSocket"
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
            aria-label="Disconnect from WebSocket"
          >
            Disconnect
          </button>
          <span className="text-sm text-muted-foreground">
            Status: {status}
          </span>
        </div>

        {status === 'connected' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend()
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-border rounded"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className="p-2 bg-muted rounded text-sm">
                <p className="text-xs text-muted-foreground mb-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                <p>{typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data)}</p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded">
            <p className="text-sm">Error: {error.type}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const useStreamingWebSocketOptionsProps: Prop[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'WebSocket URL (ws:// or wss://). Must be a valid WebSocket URL.',
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
    description: 'Automatically reconnect on connection loss with exponential backoff.',
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
    description: 'Initial reconnection delay in milliseconds. Increases exponentially.',
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
    description: 'Enable heartbeat/ping-pong mechanism to keep connection alive.',
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
    description: 'Heartbeat timeout in milliseconds. If no pong received, connection is considered dead.',
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
    description: 'Callback for each message received. Receives parsed message object.',
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
    description: 'Callback when reconnection attempt starts. Receives attempt number and delay.',
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
    description: 'WebSocket ready state (0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED).',
  },
  {
    name: 'connect',
    type: '() => void',
    description: 'Connect to the WebSocket.',
  },
  {
    name: 'disconnect',
    type: '(code?: number, reason?: string) => void',
    description: 'Disconnect from the WebSocket. Optionally provide close code and reason.',
  },
  {
    name: 'send',
    type: '(data: string | object | ArrayBuffer | Blob) => boolean',
    description: 'Send a message. Returns true if sent successfully, false if connection not open.',
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
          A production-ready hook for bidirectional WebSocket streaming with automatic reconnection,
          heartbeat/ping-pong, message queuing, and lifecycle management.
        </p>

        <Callout type="info">
          <p>
            For chat streaming, use <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> with{' '}
            <code>transport: 'websocket'</code>. useStreamingWebSocket is for custom WebSocket implementations.
          </p>
        </Callout>

        <ViewInStorybook component="useStreamingWebSocket" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try connecting to a WebSocket! Send messages and see them echoed back.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const { status, messages, connect, disconnect, sendJson } = useStreamingWebSocket({
    url: 'wss://echo.websocket.org',
    onMessage: (msg) => {
      console.log('Received:', msg.data)
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
      <button onClick={() => sendJson({ type: 'test', message: 'Hello' })}>
        Send Test
      </button>
      <p>Status: {status}</p>
      <p>Messages: {messages.length}</p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'
import type { WebSocketMessage, UseStreamingWebSocketOptions, UseStreamingWebSocketReturn } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Connect to a WebSocket and send/receive messages:
        </p>

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

        <h2 id="connect-on-mount">Connect on Mount</h2>

        <p>
          Automatically connect when component mounts:
        </p>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function AutoConnectWebSocket() {
  const {
    status,
    messages,
    disconnect,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    connectOnMount: true, // Connect automatically
    onMessage: (msg) => {
      console.log('Received:', msg.data)
    },
  })

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="sending-messages">Sending Messages</h2>

        <p>
          Send text, JSON, or binary messages:
        </p>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketWithSend() {
  const {
    status,
    send,
    sendJson,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    connectOnMount: true,
  })

  const handleSendText = () => {
    send('Hello, WebSocket!')
  }

  const handleSendJson = () => {
    sendJson({
      type: 'chat',
      message: 'Hello',
      userId: 'user-123',
    })
  }

  const handleSendBinary = () => {
    const buffer = new ArrayBuffer(8)
    const view = new Uint8Array(buffer)
    view[0] = 0x48 // 'H'
    view[1] = 0x65 // 'e'
    send(buffer)
  }

  return (
    <div>
      <button onClick={handleSendText} disabled={status !== 'connected'}>
        Send Text
      </button>
      <button onClick={handleSendJson} disabled={status !== 'connected'}>
        Send JSON
      </button>
      <button onClick={handleSendBinary} disabled={status !== 'connected'}>
        Send Binary
      </button>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="automatic-reconnection">Automatic Reconnection</h2>

        <p>
          Configure automatic reconnection with exponential backoff:
        </p>

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

        <p>
          Keep connection alive with heartbeat mechanism:
        </p>

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
            The heartbeat mechanism sends a ping message at regular intervals. If no pong is received
            within the timeout period, the connection is considered dead and reconnection is attempted.
          </p>
        </Callout>

        <h2 id="message-handling">Message Handling</h2>

        <p>
          Handle different message types:
        </p>

        <EnhancedCodeBlock
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'
import type { WebSocketMessage } from '@clarity-chat/react'

function WebSocketWithMessageHandling() {
  const {
    messages,
    lastMessage,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    connectOnMount: true,
    onMessage: (msg: WebSocketMessage) => {
      switch (msg.type) {
        case 'text':
          console.log('Text message:', msg.data)
          break
        case 'binary':
          console.log('Binary message:', msg.raw)
          break
        case 'blob':
          console.log('Blob message:', msg.raw)
          break
      }
    },
  })

  return (
    <div>
      <p>Total messages: {messages.length}</p>
      {lastMessage && (
        <p>
          Last message ({lastMessage.type}):{' '}
          {typeof lastMessage.data === 'string'
            ? lastMessage.data
            : JSON.stringify(lastMessage.data)}
        </p>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

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

        <p>
          WebSocket ready state constants:
        </p>

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

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useEffect, useCallback } from 'react'
import { useStreamingWebSocket } from '@clarity-chat/react'
import type { WebSocketMessage } from '@clarity-chat/react'

function CompleteWebSocketExample() {
  const [input, setInput] = useState('')

  const {
    status,
    messages,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
    sendJson,
    reconnect,
    reset,
    isReconnecting,
    reconnectAttempt,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    enableHeartbeat: true,
    heartbeatInterval: 30000,
    onMessage: (msg: WebSocketMessage) => {
      console.log('Received:', msg.data)
    },
    onError: (err) => {
      console.error('WebSocket Error:', err)
    },
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting in \${delay}ms (attempt \${attempt})\`)
    },
  })

  const handleSend = useCallback(() => {
    if (input.trim() && status === 'connected') {
      sendJson({ type: 'message', content: input })
      setInput('')
    }
  }, [input, status, sendJson])

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
        {isReconnecting && (
          <p>Reconnecting... (attempt {reconnectAttempt})</p>
        )}
        {error && <p className="text-destructive">Error: {error.type}</p>}
      </div>

      {status === 'connected' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-border rounded"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground mb-1">
              {new Date(msg.timestamp).toLocaleTimeString()} ({msg.type})
            </p>
            <p>
              {typeof msg.data === 'string'
                ? msg.data
                : JSON.stringify(msg.data)}
            </p>
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
            <strong>Note:</strong> The WebSocket URL <code>wss://api.example.com/ws</code> is a placeholder.
            You'll need to implement your own WebSocket server or use a service that provides WebSocket endpoints.
          </p>
        </Callout>

        <h2 id="status-values">Status Values</h2>

        <p>
          Connection status can be one of:
        </p>

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
            <strong>Clean up on unmount:</strong> Always call <code>disconnect()</code> in cleanup
          </li>
          <li>
            <strong>Handle errors:</strong> Provide <code>onError</code> callback for error handling
          </li>
          <li>
            <strong>Monitor status:</strong> Use <code>status</code> to show connection state in UI
          </li>
          <li>
            <strong>Use reconnection:</strong> Enable <code>autoReconnect</code> for production apps
          </li>
          <li>
            <strong>Enable heartbeat:</strong> Use <code>enableHeartbeat</code> to detect dead connections
          </li>
          <li>
            <strong>Check ready state:</strong> Verify <code>status === 'connected'</code> before sending
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-streaming-sse">useStreamingSSE</a> - SSE streaming hook
          </li>
          <li>
            <a href="/reference/hooks/use-streamable-ui">useStreamableUI</a> - UI state for streaming
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat hook with WebSocket support
          </li>
          <li>
            <a href="/reference/components/streaming-message">StreamingMessage</a> - Display streaming content
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - SSE vs WebSocket comparison
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
