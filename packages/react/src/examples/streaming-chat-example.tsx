import * as React from 'react'
import { useStreamingSSE } from '../hooks/use-streaming-sse'
import { useStreamingWebSocket } from '../hooks/use-streaming-websocket'
import { StreamCancellation } from '../components/stream-cancellation'
import { Button } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

/**
 * Example: SSE Streaming Chat
 * 
 * Demonstrates real-world usage of useStreamingSSE hook
 * for OpenAI/Anthropic-style streaming chat responses.
 */
export const SSEStreamingChatExample: React.FC = () => {
  const [input, setInput] = React.useState('')
  const [conversationId] = React.useState(() => crypto.randomUUID())

  const {
    status,
    data,
    error,
    connect,
    disconnect,
    reconnectAttempt,
    isReconnecting,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: input, conversationId },
    authToken: 'your-auth-token', // Replace with actual token
    autoReconnect: true,
    maxReconnectAttempts: 3,
    onMessage: (event) => {
      // Handle special event types
      if (event.type === 'done') {
        console.log('Stream completed')
        disconnect()
      } else if (event.type === 'error') {
        console.error('Server error:', event.data)
      }
    },
    onError: (error) => {
      console.error('SSE Error:', error)
    },
    onReconnecting: (attempt, delay) => {
      console.log(`Reconnecting... Attempt ${attempt}, delay ${delay}ms`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    connect()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h2 className="text-2xl font-bold">SSE Streaming Chat</h2>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <div
          className={cn('h-2 w-2 rounded-full', {
            'bg-gray-400': status === 'idle',
            'bg-yellow-500 animate-pulse': status === 'connecting',
            'bg-green-500': status === 'connected' || status === 'streaming',
            'bg-red-500': status === 'error',
          })}
        />
        <span className="capitalize">{status}</span>
        {isReconnecting && (
          <span className="text-muted-foreground">
            (Reconnecting... Attempt {reconnectAttempt})
          </span>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error.message}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => connect()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Message Display */}
      <div className="min-h-[200px] rounded-lg border bg-white p-4">
        {data ? (
          <div className="prose prose-sm">
            <p className="whitespace-pre-wrap">{data}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Enter a message and click "Send" to start streaming...
          </p>
        )}
      </div>

      {/* Stream Cancellation */}
      <StreamCancellation
        isStreaming={status === 'streaming'}
        onCancel={disconnect}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border px-4 py-2"
          disabled={status === 'streaming'}
        />
        <Button
          type="submit"
          disabled={!input.trim() || status === 'streaming'}
        >
          Send
        </Button>
      </form>
    </div>
  )
}

/**
 * Example: WebSocket Chat
 * 
 * Demonstrates real-world usage of useStreamingWebSocket hook
 * for bidirectional real-time chat.
 */
export const WebSocketChatExample: React.FC = () => {
  const [input, setInput] = React.useState('')
  const [displayMessages, setDisplayMessages] = React.useState<string[]>([])

  const {
    status,
    messages,
    send,
    connect,
    disconnect,
    reconnectAttempt,
    isReconnecting,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    autoReconnect: true,
    enableHeartbeat: true,
    connectOnMount: false,
    onMessage: (message) => {
      // Handle incoming message
      const data = message.data
      if (data.type === 'chat') {
        setDisplayMessages((prev) => [...prev, `${data.user}: ${data.message}`])
      }
    },
    onError: (error) => {
      console.error('WebSocket Error:', error)
    },
    onReconnecting: (attempt, delay) => {
      console.log(`Reconnecting... Attempt ${attempt}, delay ${delay}ms`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== 'connected') return

    // Send message
    const success = send({
      type: 'chat',
      message: input,
      timestamp: Date.now(),
    })

    if (success) {
      // Optimistically add to UI
      setDisplayMessages((prev) => [...prev, `You: ${input}`])
      setInput('')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h2 className="text-2xl font-bold">WebSocket Chat</h2>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <div
          className={cn('h-2 w-2 rounded-full', {
            'bg-gray-400': status === 'idle' || status === 'closed',
            'bg-yellow-500 animate-pulse': status === 'connecting' || status === 'reconnecting',
            'bg-green-500': status === 'connected',
            'bg-red-500': status === 'error',
          })}
        />
        <span className="capitalize">{status}</span>
        {isReconnecting && (
          <span className="text-muted-foreground">
            (Reconnecting... Attempt {reconnectAttempt})
          </span>
        )}
      </div>

      {/* Connection Controls */}
      <div className="flex gap-2">
        <Button
          onClick={connect}
          disabled={status === 'connected' || status === 'connecting'}
          variant="outline"
        >
          Connect
        </Button>
        <Button
          onClick={() => disconnect()}
          disabled={status === 'idle' || status === 'closed'}
          variant="outline"
        >
          Disconnect
        </Button>
      </div>

      {/* Messages Display */}
      <div className="min-h-[300px] space-y-2 rounded-lg border bg-white p-4">
        {displayMessages.length > 0 ? (
          displayMessages.map((msg, i) => (
            <div
              key={i}
              className={cn('rounded-lg p-3', {
                'bg-blue-50 text-right': msg.startsWith('You:'),
                'bg-gray-50': !msg.startsWith('You:'),
              })}
            >
              <p className="text-sm">{msg}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            Connect and send a message to start chatting...
          </p>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border px-4 py-2"
          disabled={status !== 'connected'}
        />
        <Button type="submit" disabled={!input.trim() || status !== 'connected'}>
          Send
        </Button>
      </form>

      {/* Stats */}
      <div className="text-xs text-muted-foreground">
        Total messages received: {messages.length}
      </div>
    </div>
  )
}

/**
 * Example: Combined SSE + WebSocket Demo
 * 
 * Shows how to choose between SSE and WebSocket based on use case.
 */
export const CombinedStreamingExample: React.FC = () => {
  const [mode, setMode] = React.useState<'sse' | 'websocket'>('sse')

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Streaming Examples</h1>
        <p className="text-muted-foreground">
          Compare SSE and WebSocket streaming implementations
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'sse' ? 'default' : 'outline'}
          onClick={() => setMode('sse')}
        >
          SSE (Server-Sent Events)
        </Button>
        <Button
          variant={mode === 'websocket' ? 'default' : 'outline'}
          onClick={() => setMode('websocket')}
        >
          WebSocket
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-2 font-semibold">When to Use Each:</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-1 font-medium text-green-600">SSE (Server-Sent Events)</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Unidirectional (server → client)</li>
              <li>✓ OpenAI/Anthropic-style streaming</li>
              <li>✓ HTTP-based (easier through firewalls)</li>
              <li>✓ Automatic reconnection</li>
              <li>✓ Event ID for resumption</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-1 font-medium text-blue-600">WebSocket</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Bidirectional (client ↔ server)</li>
              <li>✓ Real-time chat</li>
              <li>✓ Live collaboration</li>
              <li>✓ Gaming/interactive apps</li>
              <li>✓ Lower latency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example Display */}
      {mode === 'sse' ? <SSEStreamingChatExample /> : <WebSocketChatExample />}
    </div>
  )
}
