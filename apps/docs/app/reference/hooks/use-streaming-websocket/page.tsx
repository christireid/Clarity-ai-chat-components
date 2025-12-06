'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useStreamingWebSocket Hook | Clarity Chat',
  description: 'Bidirectional WebSocket streaming with automatic reconnection, message queuing, and heartbeat monitoring.',
}

const useStreamingWebSocketOptions: Prop[] = [
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'WebSocket server URL (ws:// or wss://).',
  },
  {
    name: 'onMessage',
    type: '(data: any) => void',
    description: 'Callback when a message is received.',
  },
  {
    name: 'onOpen',
    type: '() => void',
    description: 'Callback when connection opens.',
  },
  {
    name: 'onClose',
    type: '(event: CloseEvent) => void',
    description: 'Callback when connection closes.',
  },
  {
    name: 'onError',
    type: '(error: Event) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'autoReconnect',
    type: 'boolean',
    default: 'false',
    description: 'Automatically reconnect on disconnect.',
  },
  {
    name: 'reconnectInterval',
    type: 'number',
    default: '1000',
    description: 'Delay between reconnection attempts (ms).',
  },
  {
    name: 'maxReconnectAttempts',
    type: 'number',
    default: 'Infinity',
    description: 'Maximum number of reconnection attempts.',
  },
  {
    name: 'heartbeatInterval',
    type: 'number',
    description: 'Send ping messages at this interval (ms).',
  },
  {
    name: 'protocols',
    type: 'string | string[]',
    description: 'WebSocket subprotocols.',
  },
  {
    name: 'binaryType',
    type: '"blob" | "arraybuffer"',
    default: '"blob"',
    description: 'Binary message type.',
  },
]

const useStreamingWebSocketReturn: Prop[] = [
  {
    name: 'connect',
    type: '() => void',
    description: 'Connect to the WebSocket server.',
  },
  {
    name: 'disconnect',
    type: '() => void',
    description: 'Disconnect from the WebSocket server.',
  },
  {
    name: 'send',
    type: '(data: string | ArrayBuffer | Blob) => void',
    description: 'Send a message to the server.',
  },
  {
    name: 'status',
    type: '"connecting" | "open" | "closing" | "closed"',
    description: 'Current connection status.',
  },
  {
    name: 'messages',
    type: 'any[]',
    description: 'Array of received messages (if queueMessages is enabled).',
  },
  {
    name: 'isConnected',
    type: 'boolean',
    description: 'Whether the connection is currently open.',
  },
  {
    name: 'reconnectAttempts',
    type: 'number',
    description: 'Number of reconnection attempts made.',
  },
]

export default function UseStreamingWebSocketPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useStreamingWebSocket</h1>

      <p className="lead">
        Bidirectional WebSocket streaming with automatic reconnection, message queuing,
        heartbeat monitoring, and robust error handling. Perfect for real-time chat applications.
      </p>

      <Callout type="info" title="Bidirectional Communication">
        <p>
          Unlike SSE (Server-Sent Events), WebSocket supports bidirectional communication.
          You can send messages to the server and receive responses in real-time.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, disconnect, send, status, isConnected } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    onMessage: (data) => {
      console.log('Received:', data)
    },
    autoReconnect: true,
  })

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  const handleSend = () => {
    if (isConnected) {
      send({ type: 'message', content: 'Hello!' })
    }
  }

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleSend} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useStreamingWebSocket:
        </p>
        <CodePlayground
          initialCode={`import { useStreamingWebSocket } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function Example() {
  const [messages, setMessages] = useState([])
  
  const { connect, disconnect, send, status, isConnected } = useStreamingWebSocket({
    url: 'wss://echo.websocket.org', // Public echo server for testing
    onMessage: (data) => {
      setMessages(prev => [...prev, data])
    },
    autoReconnect: true,
  })

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [])

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => send('Hello!')} disabled={!isConnected}>
        Send
      </button>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{JSON.stringify(msg)}</div>
        ))}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Auto-Reconnect</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, send, status } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    onMessage: (data) => {
      console.log('Received:', data)
    },
    autoReconnect: true,
    reconnectInterval: 2000, // 2 seconds
    maxReconnectAttempts: 10,
  })

  useEffect(() => {
    connect()
  }, [])

  return <div>Status: {status}</div>
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Heartbeat</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, send } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    onMessage: (data) => {
      // Handle messages
    },
    heartbeatInterval: 30000, // Send ping every 30 seconds
    autoReconnect: true,
  })

  useEffect(() => {
    connect()
  }, [])

  return <div>Chat connected</div>
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Message Queue</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, send, messages, isConnected } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    onMessage: (data) => {
      // Messages are automatically queued
    },
    autoReconnect: true,
  })

  useEffect(() => {
    connect()
  }, [])

  // Send messages even when disconnected - they'll be queued
  const handleSend = (text: string) => {
    send({ type: 'message', content: text })
  }

  return (
    <div>
      <div>Messages: {messages.length}</div>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, status, reconnectAttempts } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    onMessage: (data) => {
      // Handle messages
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
      // Send to error tracking
    },
    onClose: (event) => {
      if (event.code !== 1000) {
        console.error('Unexpected close:', event.code, event.reason)
      }
    },
    autoReconnect: true,
    maxReconnectAttempts: 5,
  })

  useEffect(() => {
    connect()
  }, [])

  if (reconnectAttempts >= 5) {
    return <div>Connection failed. Please refresh.</div>
  }

  return <div>Status: {status}</div>
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Binary Messages</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function Chat() {
  const { connect, send } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    binaryType: 'arraybuffer', // or 'blob'
    onMessage: (data) => {
      if (data instanceof ArrayBuffer) {
        // Handle binary data
        const view = new Uint8Array(data)
        console.log('Binary data:', view)
      } else {
        // Handle text data
        console.log('Text data:', data)
      }
    },
  })

  useEffect(() => {
    connect()
  }, [])

  const sendBinary = () => {
    const buffer = new ArrayBuffer(8)
    send(buffer)
  }

  return <button onClick={sendBinary}>Send Binary</button>
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useStreamingWebSocketOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useStreamingWebSocketReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Automatic reconnection</strong> - Reconnects on disconnect with exponential backoff</li>
          <li><strong>Message queuing</strong> - Queues messages when disconnected, sends when reconnected</li>
          <li><strong>Heartbeat monitoring</strong> - Optional ping/pong to keep connection alive</li>
          <li><strong>Binary support</strong> - Send and receive binary data (ArrayBuffer or Blob)</li>
          <li><strong>Connection state tracking</strong> - Real-time status updates</li>
          <li><strong>Error handling</strong> - Comprehensive error callbacks and recovery</li>
          <li><strong>Protocol support</strong> - WebSocket subprotocol support</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Reconnection Strategy</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          When <code>autoReconnect</code> is enabled, the hook uses exponential backoff:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>First attempt: immediate</li>
          <li>Subsequent attempts: <code>reconnectInterval * (2 ^ attemptNumber)</code></li>
          <li>Maximum delay: 30 seconds</li>
          <li>Stops after <code>maxReconnectAttempts</code> (default: Infinity)</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">WebSocket vs SSE</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Feature</th>
                <th className="text-left p-2">WebSocket</th>
                <th className="text-left p-2">SSE</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b">
                <td className="p-2">Direction</td>
                <td className="p-2">Bidirectional</td>
                <td className="p-2">Server → Client only</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Protocol</td>
                <td className="p-2">ws:// or wss://</td>
                <td className="p-2">HTTP/HTTPS</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Binary Support</td>
                <td className="p-2">Yes</td>
                <td className="p-2">No (text only)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Use Case</td>
                <td className="p-2">Real-time chat, gaming</td>
                <td className="p-2">Notifications, updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Performance Considerations</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>WebSocket connections are persistent, reducing overhead</li>
          <li>Message queuing prevents data loss during reconnection</li>
          <li>Heartbeat keeps connections alive through proxies and firewalls</li>
          <li>Binary messages are more efficient for large payloads</li>
          <li>Automatic cleanup on unmount prevents memory leaks</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-streaming-sse" className="docs-card">
            <h3>useStreamingSSE Hook</h3>
            <p>SSE streaming (unidirectional)</p>
          </a>
          <a href="/reference/hooks/use-streamable-ui" className="docs-card">
            <h3>useStreamableUI Hook</h3>
            <p>React Server Components streaming</p>
          </a>
          <a href="/reference/hooks/use-streaming" className="docs-card">
            <h3>useStreaming Hook</h3>
            <p>Low-level streaming primitive</p>
          </a>
          <a href="/guides/streaming" className="docs-card">
            <h3>Streaming Guide</h3>
            <p>Complete streaming guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useStreamableUI', href: '/reference/hooks/use-streamable-ui' }}
        next={{ title: 'useStreaming', href: '/reference/hooks/use-streaming' }}
      />
    </>
  )
}
