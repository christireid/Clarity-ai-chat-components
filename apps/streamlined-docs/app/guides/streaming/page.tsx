'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  Radio,
  Wifi,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Activity,
  RefreshCw,
  XCircle,
  Timer,
  MemoryStick,
  Wrench,
  Shield,
  Terminal,
  FileCode,
  ChevronRight,
  Layers,
  Network,
  Server,
  Gauge,
  Bug,
  HelpCircle,
  AlertCircle,
  Clock,
  Repeat,
  Pause,
  Play,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const sseBasicExample = `'use client'

import { useStreamingSSE } from '@clarity-chat/react'

export function ChatWithSSE() {
  const {
    status,
    data,
    error,
    connect,
    disconnect,
    reset,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello, AI!', conversationId: '123' },
    authToken: user.token,

    // Event handlers
    onMessage: (event) => {
      console.log('Received:', event.data)
      if (event.type === 'done') {
        disconnect()
      }
    },
    onError: (error) => console.error('SSE Error:', error),
    onOpen: () => console.log('Connection opened'),
    onClose: () => console.log('Connection closed'),
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={connect}
          disabled={status !== 'idle'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Start Streaming
        </button>
        <button
          onClick={disconnect}
          disabled={status === 'idle' || status === 'closed'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Cancel
        </button>
        <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <span className={\`w-2 h-2 rounded-full \${
          status === 'streaming' ? 'bg-green-500 animate-pulse' :
          status === 'connecting' ? 'bg-yellow-500' :
          status === 'error' ? 'bg-red-500' : 'bg-gray-300'
        }\`} />
        <span className="text-sm capitalize">{status}</span>
      </div>

      {/* Streaming content */}
      {status === 'streaming' && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="whitespace-pre-wrap">{data}</p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}`

const apiRouteExample = `// app/api/chat/stream/route.ts
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, conversationId } = await req.json()

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        // Connect to your AI provider (e.g., OpenAI, Anthropic)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            stream: true,
          }),
        })

        if (!response.ok) {
          throw new Error(\`API error: \${response.status}\`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No reader available')

        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\\n').filter(line => line.trim())

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // Send completion event
                controller.enqueue(encoder.encode('event: done\\ndata: {}\\n\\n'))
              } else {
                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    // Send SSE event with event ID for resumption
                    controller.enqueue(
                      encoder.encode(\`id: \${Date.now()}\\ndata: \${content}\\n\\n\`)
                    )
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      } catch (error) {
        // Send error event
        controller.enqueue(
          encoder.encode(\`event: error\\ndata: \${JSON.stringify({ message: error.message })}\\n\\n\`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}`

const streamStatusExample = `'use client'

import { useStreamingSSE, useStreamStatus } from '@clarity-chat/react'

export function ChatWithProgress() {
  const {
    progress,
    tokens,
    time,
    state,
    isStreaming,
    isComplete,
    startStream,
    recordTokens,
    complete,
    setError,
    reset,
  } = useStreamStatus({
    estimatedTotal: 500, // Estimated tokens
    onProgress: (progress, tokens) => {
      console.log(\`\${progress.toFixed(1)}% - \${tokens.tokensPerSecond} tok/s\`)
    },
    onComplete: (stats) => {
      console.log(\`Completed in \${stats.time.elapsed}ms\`)
    },
  })

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Tell me about React' },
    onOpen: () => startStream(),
    onMessage: (event) => {
      // Count approximate tokens (words / 0.75)
      const approxTokens = Math.ceil(event.raw.split(/\\s+/).length / 0.75)
      recordTokens(approxTokens)

      if (event.type === 'done') {
        complete()
        stream.disconnect()
      }
    },
    onError: (err) => setError(err),
  })

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: \`\${progress}%\` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Progress:</span>
          <span className="ml-2 font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-gray-500">Tokens:</span>
          <span className="ml-2 font-medium">{tokens.received}</span>
        </div>
        <div>
          <span className="text-gray-500">Speed:</span>
          <span className="ml-2 font-medium">{tokens.tokensPerSecond} tok/s</span>
        </div>
      </div>

      {/* Time stats */}
      <div className="flex gap-4 text-sm text-gray-600">
        <span>Elapsed: {(time.elapsed / 1000).toFixed(1)}s</span>
        {time.timeToFirstToken && (
          <span>TTFT: {time.timeToFirstToken}ms</span>
        )}
        {time.remaining !== undefined && (
          <span>Remaining: ~{(time.remaining / 1000).toFixed(1)}s</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={stream.connect} disabled={isStreaming}>
          Start
        </button>
        <button onClick={stream.disconnect} disabled={!isStreaming}>
          Stop
        </button>
        <button onClick={() => { stream.reset(); reset(); }}>
          Reset
        </button>
      </div>
    </div>
  )
}`

const websocketExample = `'use client'

import { useStreamingWebSocket } from '@clarity-chat/react'
import { useEffect } from 'react'

export function ChatWithWebSocket() {
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
    reconnectAttempt,
    isReconnecting,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws/chat',
    protocols: ['v1.chat'],

    // Reconnection settings
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    reconnectOnCleanClose: true,

    // Heartbeat settings (keepalive)
    enableHeartbeat: true,
    heartbeatInterval: 30000,
    heartbeatTimeout: 5000,
    heartbeatMessage: 'ping',

    // Connection settings
    connectionTimeout: 15000,
    connectOnMount: false,

    // Event handlers
    onOpen: (event) => console.log('WebSocket connected'),
    onMessage: (msg) => {
      console.log('Received:', msg.data)
      // Handle different message types
      if (msg.data.type === 'stream_chunk') {
        // Append to current message
      } else if (msg.data.type === 'stream_end') {
        // Mark message as complete
      } else if (msg.data.type === 'error') {
        // Handle error
      }
    },
    onError: (event) => console.error('WebSocket error:', event),
    onClose: (event) => console.log('WebSocket closed:', event.code, event.reason),
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting in \${delay}ms (attempt \${attempt})\`)
    },
    onMaxReconnectAttemptsReached: () => {
      console.error('Max reconnection attempts reached')
    },
    onHeartbeatFailed: () => {
      console.warn('Heartbeat failed - connection may be stale')
    },
  })

  // Connect on mount
  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  // Send a chat message
  const sendMessage = (text: string) => {
    sendJson({
      type: 'chat_message',
      content: text,
      timestamp: Date.now(),
    })
  }

  return (
    <div className="space-y-4">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        <span className={\`w-2 h-2 rounded-full \${
          status === 'connected' ? 'bg-green-500' :
          status === 'connecting' || status === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
          status === 'error' ? 'bg-red-500' : 'bg-gray-300'
        }\`} />
        <span className="text-sm capitalize">{status}</span>
        {isReconnecting && (
          <span className="text-xs text-gray-500">
            (attempt {reconnectAttempt})
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            {typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data)}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={(e) => {
        e.preventDefault()
        const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
        if (input.value.trim()) {
          sendMessage(input.value)
          input.value = ''
        }
      }}>
        <input
          name="message"
          placeholder="Type a message..."
          disabled={status !== 'connected'}
          className="w-full px-4 py-2 border rounded"
        />
      </form>
    </div>
  )
}`

const websocketServerExample = `// WebSocket Server (Node.js with ws)
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
  console.log('Client connected')

  // Send welcome message
  ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }))

  // Handle incoming messages
  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString())

    if (message === 'ping') {
      // Respond to heartbeat
      ws.send('pong')
      return
    }

    if (message.type === 'chat_message') {
      // Stream AI response
      const response = await streamAIResponse(message.content)

      for await (const chunk of response) {
        ws.send(JSON.stringify({
          type: 'stream_chunk',
          content: chunk,
          timestamp: Date.now(),
        }))
      }

      ws.send(JSON.stringify({
        type: 'stream_end',
        timestamp: Date.now(),
      }))
    }
  })

  ws.on('close', (code, reason) => {
    console.log(\`Client disconnected: \${code} \${reason}\`)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

async function* streamAIResponse(message: string) {
  // Connect to AI provider and yield chunks
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      stream: true,
    }),
  })

  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    // Parse and yield content
    yield extractContent(chunk)
  }
}`

const abortExample = `'use client'

import { useStreamingSSE } from '@clarity-chat/react'
import { useCallback, useRef } from 'react'

export function AbortableChat() {
  const abortTimeoutRef = useRef<NodeJS.Timeout>()

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Tell me a long story' },

    // Automatic timeout after 60 seconds
    connectionTimeout: 60000,

    onMessage: (event) => {
      // Reset timeout on each message
      if (abortTimeoutRef.current) {
        clearTimeout(abortTimeoutRef.current)
      }

      // Set a new timeout for inactivity
      abortTimeoutRef.current = setTimeout(() => {
        console.log('Aborting due to inactivity')
        stream.disconnect()
      }, 10000) // Abort if no message for 10s
    },
  })

  // Abort with cleanup
  const handleAbort = useCallback(() => {
    if (abortTimeoutRef.current) {
      clearTimeout(abortTimeoutRef.current)
    }
    stream.disconnect()
    console.log('Stream aborted by user')
  }, [stream])

  return (
    <div>
      <button
        onClick={handleAbort}
        disabled={stream.status !== 'streaming'}
        className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"
      >
        <XCircle className="w-4 h-4" />
        Abort Stream
      </button>

      {stream.status === 'streaming' && (
        <p className="text-sm text-gray-500 mt-2">
          Click to cancel the current stream
        </p>
      )}
    </div>
  )
}`

const reconnectionExample = `'use client'

import { useStreamingSSE } from '@clarity-chat/react'

export function ResilientChat() {
  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello' },

    // Reconnection configuration
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,        // Start with 1 second
    maxReconnectDelay: 30000,    // Cap at 30 seconds
    reconnectSuccessThreshold: 3, // Reset backoff after 3 successful connections

    // Heartbeat monitoring
    heartbeatInterval: 30000,    // Check every 30 seconds

    // Resume from last event
    resumeFromLastEventId: true,

    // Callbacks
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting... attempt \${attempt}, next in \${delay}ms\`)
    },
    onMaxReconnectAttemptsReached: () => {
      console.error('Connection failed after max attempts')
      // Show user a "try again" button
    },
  })

  return (
    <div className="space-y-4">
      {stream.isReconnecting && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
          <div>
            <p className="font-medium text-yellow-800">Reconnecting...</p>
            <p className="text-sm text-yellow-600">
              Attempt {stream.reconnectAttempt} of 5
            </p>
          </div>
        </div>
      )}

      {stream.status === 'error' && !stream.isReconnecting && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-medium text-red-800">Connection Lost</p>
          <button
            onClick={stream.reconnect}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {stream.status === 'streaming' && (
        <div className="flex items-center gap-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Connected and streaming
        </div>
      )}
    </div>
  )
}`

const toolExecutionExample = `'use client'

import { useStreamingSSE, useStreamStatus } from '@clarity-chat/react'
import { useState } from 'react'

interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  status: 'pending' | 'executing' | 'complete' | 'error'
  result?: unknown
}

export function ChatWithToolExecution() {
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [content, setContent] = useState('')

  const streamStatus = useStreamStatus({
    trackedFields: ['content', 'tool_calls'],
  })

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'What is the weather in NYC?' },

    onOpen: () => streamStatus.startStream(),

    onMessage: async (event) => {
      const data = event.data

      // Handle text content
      if (data.type === 'text_delta') {
        setContent(prev => prev + data.content)
        streamStatus.updateFieldStatus('content', { status: 'streaming' })
      }

      // Handle tool calls
      if (data.type === 'tool_call') {
        const toolCall: ToolCall = {
          id: data.id,
          name: data.name,
          arguments: data.arguments,
          status: 'pending',
        }

        setToolCalls(prev => [...prev, toolCall])
        streamStatus.updateFieldStatus('tool_calls', { status: 'streaming' })

        // Execute the tool
        setToolCalls(prev => prev.map(tc =>
          tc.id === data.id ? { ...tc, status: 'executing' } : tc
        ))

        try {
          const result = await executeToolCall(toolCall)
          setToolCalls(prev => prev.map(tc =>
            tc.id === data.id ? { ...tc, status: 'complete', result } : tc
          ))

          // Send tool result back to stream
          stream.reconnect() // Or handle via separate API call
        } catch (error) {
          setToolCalls(prev => prev.map(tc =>
            tc.id === data.id ? { ...tc, status: 'error' } : tc
          ))
        }
      }

      if (data.type === 'done') {
        streamStatus.complete()
        stream.disconnect()
      }
    },
  })

  return (
    <div className="space-y-4">
      {/* Tool calls */}
      {toolCalls.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Tool Calls</h3>
          {toolCalls.map(tool => (
            <div
              key={tool.id}
              className={\`p-3 rounded-lg border \${
                tool.status === 'executing' ? 'bg-yellow-50 border-yellow-200' :
                tool.status === 'complete' ? 'bg-green-50 border-green-200' :
                tool.status === 'error' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }\`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span className="font-mono text-sm">{tool.name}</span>
                <span className="text-xs text-gray-500 capitalize">
                  ({tool.status})
                </span>
              </div>
              {tool.result && (
                <pre className="mt-2 text-xs bg-white p-2 rounded">
                  {JSON.stringify(tool.result, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
}

async function executeToolCall(tool: ToolCall): Promise<unknown> {
  // Execute tool based on name
  switch (tool.name) {
    case 'get_weather':
      return fetchWeather(tool.arguments.location as string)
    case 'search':
      return performSearch(tool.arguments.query as string)
    default:
      throw new Error(\`Unknown tool: \${tool.name}\`)
  }
}`

const memoryOptimizationExample = `'use client'

import { useStreamingSSE } from '@clarity-chat/react'
import { useCallback, useState } from 'react'

export function MemoryEfficientChat() {
  // Keep only rendered content, not full event history
  const [displayContent, setDisplayContent] = useState('')
  const [bufferOverflows, setBufferOverflows] = useState(0)

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Generate a very long response' },

    // Limit event buffer to prevent memory leaks
    maxEventBufferSize: 100, // Keep only last 100 events

    // Handle buffer overflow (events being dropped)
    onEventBufferOverflow: (droppedCount, bufferSize) => {
      console.warn(\`Buffer overflow: dropped \${droppedCount} events\`)
      setBufferOverflows(prev => prev + droppedCount)
    },

    onMessage: (event) => {
      // Process immediately, don't rely on events array
      if (typeof event.data === 'string') {
        setDisplayContent(prev => prev + event.data)
      }
    },
  })

  // Periodic cleanup for long sessions
  const handleCleanup = useCallback(() => {
    stream.reset()
    setDisplayContent('')
    setBufferOverflows(0)
  }, [stream])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Events in buffer: {stream.events.length}
          {bufferOverflows > 0 && (
            <span className="ml-2 text-yellow-600">
              ({bufferOverflows} dropped)
            </span>
          )}
        </div>
        <button
          onClick={handleCleanup}
          className="text-sm text-blue-500 hover:underline"
        >
          Clear Memory
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-auto">
        {displayContent}
      </div>

      {/* Memory usage warning */}
      {stream.events.length > 80 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-700">
            Buffer nearly full. Consider clearing for long sessions.
          </span>
        </div>
      )}
    </div>
  )
}`

const errorHandlingExample = `'use client'

import { useStreamingSSE } from '@clarity-chat/react'
import { useState } from 'react'

type ErrorType = 'network' | 'auth' | 'rate_limit' | 'server' | 'unknown'

interface StreamError {
  type: ErrorType
  message: string
  retryable: boolean
}

export function RobustErrorHandling() {
  const [error, setError] = useState<StreamError | null>(null)

  const classifyError = (err: Error): StreamError => {
    const message = err.message.toLowerCase()

    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Network connection lost. Check your internet.',
        retryable: true,
      }
    }

    if (message.includes('401') || message.includes('auth')) {
      return {
        type: 'auth',
        message: 'Session expired. Please log in again.',
        retryable: false,
      }
    }

    if (message.includes('429') || message.includes('rate')) {
      return {
        type: 'rate_limit',
        message: 'Too many requests. Please wait a moment.',
        retryable: true,
      }
    }

    if (message.includes('500') || message.includes('server')) {
      return {
        type: 'server',
        message: 'Server error. Our team has been notified.',
        retryable: true,
      }
    }

    return {
      type: 'unknown',
      message: err.message,
      retryable: true,
    }
  }

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello' },

    // Connection timeout
    connectionTimeout: 15000,

    // Disable auto-reconnect to handle manually
    autoReconnect: false,

    onError: (err) => {
      const classified = classifyError(err)
      setError(classified)

      // Log for monitoring
      console.error('Stream error:', {
        type: classified.type,
        message: err.message,
        stack: err.stack,
      })

      // Report to error tracking
      // Sentry.captureException(err)
    },

    onClose: () => {
      // Connection closed normally
      setError(null)
    },
  })

  const handleRetry = () => {
    setError(null)
    stream.reconnect()
  }

  if (error) {
    return (
      <div className={\`p-4 rounded-lg border \${
        error.type === 'auth' ? 'bg-red-50 border-red-200' :
        error.type === 'rate_limit' ? 'bg-yellow-50 border-yellow-200' :
        'bg-orange-50 border-orange-200'
      }\`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-current flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium">
              {error.type === 'network' && 'Connection Error'}
              {error.type === 'auth' && 'Authentication Required'}
              {error.type === 'rate_limit' && 'Rate Limited'}
              {error.type === 'server' && 'Server Error'}
              {error.type === 'unknown' && 'Something Went Wrong'}
            </h3>
            <p className="text-sm mt-1 opacity-80">{error.message}</p>

            <div className="mt-3 flex gap-2">
              {error.retryable && (
                <button
                  onClick={handleRetry}
                  className="px-3 py-1.5 bg-current text-white rounded text-sm"
                >
                  Try Again
                </button>
              )}
              {error.type === 'auth' && (
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-3 py-1.5 bg-current text-white rounded text-sm"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Normal chat UI */}
    </div>
  )
}`

const completeSSEExample = `'use client'

import { useStreamingSSE, useStreamStatus } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  status: 'pending' | 'streaming' | 'complete' | 'error'
}

export function CompleteSSEChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const streamStatus = useStreamStatus({
    onProgress: (progress) => {
      console.log(\`Streaming: \${progress.toFixed(1)}%\`)
    },
  })

  const stream = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    autoReconnect: true,
    maxReconnectAttempts: 3,
    resumeFromLastEventId: true,

    onOpen: () => {
      streamStatus.startStream()
    },

    onMessage: (event) => {
      if (event.type === 'text_delta') {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant' && last.status === 'streaming') {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + event.data },
            ]
          }
          return prev
        })
        streamStatus.recordTokens(1)
      }

      if (event.type === 'done') {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...last, status: 'complete' },
            ]
          }
          return prev
        })
        streamStatus.complete()
        stream.disconnect()
      }
    },

    onError: (error) => {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, status: 'error' },
          ]
        }
        return prev
      })
      streamStatus.setError(error)
    },

    onReconnecting: (attempt) => {
      console.log(\`Reconnecting attempt \${attempt}...\`)
    },
  })

  const sendMessage = useCallback(() => {
    if (!input.trim() || stream.status === 'streaming') return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      status: 'complete',
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      status: 'streaming',
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')

    // Update stream body and connect
    stream.reset()
    // Note: In practice, you'd manage body state separately
    stream.connect()
  }, [input, stream])

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={\`p-4 rounded-lg \${
              msg.role === 'user'
                ? 'bg-blue-100 ml-12'
                : 'bg-gray-100 mr-12'
            }\`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {msg.status === 'streaming' && (
              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
            )}
            {msg.status === 'error' && (
              <p className="text-red-500 text-sm mt-2">
                Error generating response
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {streamStatus.isStreaming && (
        <div className="px-4 py-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Generating... {streamStatus.tokens.tokensPerSecond} tok/s</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={stream.status === 'streaming'}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              disabled={!input.trim() || stream.status === 'streaming'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}`

const troubleshootingItems = [
  {
    title: 'Stream connects but no data received',
    description: 'The connection opens successfully but onMessage is never called.',
    solution: `Check your server is sending proper SSE format:

1. Each event must end with two newlines (\\n\\n)
2. Data lines must start with "data: "
3. Ensure Content-Type is "text/event-stream"

Server response format:
  data: Hello\\n\\n
  data: World\\n\\n
  event: done\\ndata: {}\\n\\n`,
  },
  {
    title: 'WebSocket immediately disconnects',
    description: 'Connection opens then closes with code 1006.',
    solution: `Code 1006 indicates abnormal closure. Common causes:

1. CORS: Ensure your WS server allows the origin
2. Auth: Check authentication is being passed correctly
3. Proxy: Some proxies don't support WebSocket upgrades
4. SSL: Use wss:// in production, not ws://

Check browser console for specific error messages.`,
  },
  {
    title: 'Reconnection not working',
    description: 'Auto-reconnect is enabled but stream never reconnects.',
    solution: `Ensure these conditions are met:

1. autoReconnect: true is set
2. reconnectAttempt < maxReconnectAttempts
3. Error is not a clean disconnect (wasClean: false)
4. For clean closes, set reconnectOnCleanClose: true

Also check onMaxReconnectAttemptsReached callback.`,
  },
  {
    title: 'Memory usage keeps growing',
    description: 'Long streaming sessions cause browser to slow down.',
    solution: `Configure buffer limits:

1. Set maxEventBufferSize (default: 1000)
2. Use onEventBufferOverflow callback to monitor
3. Call reset() periodically for long sessions
4. Process events in onMessage instead of relying on events array

Consider streaming to a backend for very long sessions.`,
  },
  {
    title: 'Authentication token not being sent',
    description: 'Server returns 401 despite providing authToken.',
    solution: `Check token handling:

1. Verify authToken is not undefined/null
2. SSE uses Authorization header (not cookies by default)
3. Enable useCookieFallback: true for cookie auth
4. Check CORS allows Authorization header

For WebSocket, tokens must be in query string or first message.`,
  },
  {
    title: 'Events arriving out of order',
    description: 'Stream chunks appear in wrong sequence.',
    solution: `SSE events are ordered by default, but if using resumption:

1. Check if resumeFromLastEventId is causing jumps
2. Verify server sends monotonic event IDs
3. Use id field in SSE format for ordering
4. Consider adding sequence numbers in your data

If issue persists, it may be a server-side problem.`,
  },
]

type TransportType = 'sse' | 'websocket'

export default function StreamingGuidePage() {
  const [selectedTransport, setSelectedTransport] = useState<TransportType>('sse')

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Radio className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Streaming Guide
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Real-Time Streaming in Clarity Chat
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Learn how to implement real-time streaming for AI chat applications.
            Stream responses token-by-token for instant feedback and better UX.
          </p>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200/50 dark:border-brand-800/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold">What You'll Learn</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Server-Sent Events (SSE) streaming with useStreamingSSE',
                'WebSocket streaming with useStreamingWebSocket',
                'Progress tracking with useStreamStatus',
                'Automatic reconnection and error recovery',
                'Abort/cancel streaming operations',
                'Tool execution during streams',
                'Memory optimization for long sessions',
                'Robust error handling patterns',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Prerequisites */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Prerequisites</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Clarity Chat',
                value: 'Installed & configured',
                icon: <CheckCircle2 className="w-4 h-4" />,
              },
              {
                label: 'React',
                value: '18.0+ or 19.0+',
                icon: <Zap className="w-4 h-4" />,
              },
              {
                label: 'Backend',
                value: 'SSE or WebSocket server',
                icon: <Server className="w-4 h-4" />,
              },
              {
                label: 'AI Provider',
                value: 'OpenAI, Anthropic, etc.',
                icon: <Network className="w-4 h-4" />,
              },
            ].map((req, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-brand-500 mb-2">
                  {req.icon}
                  <span className="text-sm font-medium">{req.label}</span>
                </div>
                <p className="text-lg font-semibold">{req.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">
                  New to Clarity Chat?
                </strong>{' '}
                Start with the{' '}
                <Link href="/get-started/installation" className="text-blue-500 hover:underline">
                  Installation Guide
                </Link>{' '}
                and{' '}
                <Link href="/get-started/quick-start" className="text-blue-500 hover:underline">
                  Quick Start
                </Link>{' '}
                before diving into streaming.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Understanding Streaming */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Wifi className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Understanding Streaming</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Streaming enables real-time delivery of AI responses, showing users each
            token as it's generated rather than waiting for the complete response.
            Clarity Chat supports two transport protocols:
          </p>

          {/* Transport Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { id: 'sse', label: 'Server-Sent Events (SSE)', badge: 'Recommended' },
              { id: 'websocket', label: 'WebSocket' },
            ].map((transport) => (
              <button
                key={transport.id}
                onClick={() => setSelectedTransport(transport.id as TransportType)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  selectedTransport === transport.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {transport.label}
                {transport.badge && selectedTransport === transport.id && (
                  <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                    {transport.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTransport}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
            >
              {selectedTransport === 'sse' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Radio className="w-5 h-5 text-brand-500" />
                      What is SSE?
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Server-Sent Events is a standard for server-to-client streaming
                      over HTTP. It's simpler than WebSocket and works great for
                      AI streaming where data flows in one direction.
                    </p>
                    <ul className="space-y-2 text-sm">
                      {[
                        'Built on HTTP - works everywhere',
                        'Automatic reconnection built-in',
                        'Event IDs for resumption',
                        'Simple server implementation',
                        'Firewall and proxy friendly',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-500" />
                      When to Use SSE
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-2">
                          Best For:
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <li>AI chat streaming (OpenAI, Anthropic, etc.)</li>
                          <li>One-way data flow (server to client)</li>
                          <li>Simple deployment requirements</li>
                          <li>Applications behind proxies/CDNs</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-600 dark:text-amber-400 text-sm mb-2">
                          Consider WebSocket If:
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <li>You need bidirectional real-time data</li>
                          <li>Low latency is critical (&lt;100ms)</li>
                          <li>You're building multiplayer features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTransport === 'websocket' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Network className="w-5 h-5 text-brand-500" />
                      What is WebSocket?
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      WebSocket provides full-duplex communication over a single
                      TCP connection. It's ideal when you need bidirectional
                      real-time communication.
                    </p>
                    <ul className="space-y-2 text-sm">
                      {[
                        'Bidirectional communication',
                        'Lower latency than HTTP',
                        'Binary and text message support',
                        'Custom protocol support',
                        'Persistent connection',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-500" />
                      When to Use WebSocket
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-2">
                          Best For:
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <li>Real-time collaborative features</li>
                          <li>Live updates (presence, typing indicators)</li>
                          <li>Gaming and interactive apps</li>
                          <li>When you need to send data client to server</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-600 dark:text-amber-400 text-sm mb-2">
                          Considerations:
                        </h4>
                        <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <li>More complex server setup required</li>
                          <li>May require WebSocket-capable infrastructure</li>
                          <li>Some proxies/firewalls block WebSocket</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </ScrollReveal>

      {/* Basic SSE Streaming */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Radio className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Basic SSE Streaming</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">useStreamingSSE</code> hook
            provides a complete solution for SSE streaming with automatic
            reconnection, authentication, and event handling.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Use the useStreamingSSE hook">
              <CodeBlock
                code={sseBasicExample}
                filename="components/ChatWithSSE.tsx"
              />
            </StepCard>

            <StepCard number={2} title="Create the API route">
              <CodeBlock
                code={apiRouteExample}
                filename="app/api/chat/stream/route.ts"
              />
            </StepCard>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">
                  Key Features:
                </strong>{' '}
                The hook handles connection lifecycle, automatic reconnection with
                exponential backoff, event parsing, and memory management out of the box.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Stream Status Tracking */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Tracking Stream Progress</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Use <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">useStreamStatus</code> to
            track streaming progress, token counts, and timing statistics.
          </p>

          <CodeBlock
            code={streamStatusExample}
            filename="components/ChatWithProgress.tsx"
          />

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Gauge className="w-5 h-5" />,
                title: 'Progress Tracking',
                description: '0-100% progress based on estimated tokens',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Time Statistics',
                description: 'Elapsed time, TTFT, and ETA',
              },
              {
                icon: <Activity className="w-5 h-5" />,
                title: 'Throughput',
                description: 'Real-time tokens per second measurement',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-brand-500 mb-2">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Advanced Patterns - Collapsible */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Advanced Streaming Patterns</h2>
          </div>

          <div className="space-y-4">
            <CollapsibleSection
              title="Abort / Cancel Streaming"
              badge="User Control"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Allow users to cancel long-running streams and implement automatic
                timeouts for inactive connections.
              </p>
              <CodeBlock
                code={abortExample}
                filename="components/AbortableChat.tsx"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Reconnection Strategies"
              badge="Resilience"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Configure automatic reconnection with exponential backoff, jitter,
                and resume from last event ID.
              </p>
              <CodeBlock
                code={reconnectionExample}
                filename="components/ResilientChat.tsx"
              />
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Exponential Backoff', desc: 'Delay doubles each attempt' },
                  { label: 'Jitter', desc: 'Prevents thundering herd' },
                  { label: 'Success Threshold', desc: 'Resets after sustained connection' },
                  { label: 'Resume Support', desc: 'Continues from last event ID' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{item.label}:</span>{' '}
                      <span className="text-neutral-500">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Tool Execution During Streams"
              badge="Function Calling"
            >
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Handle AI tool calls and function execution while streaming,
                interleaving tool results with text content.
              </p>
              <CodeBlock
                code={toolExecutionExample}
                filename="components/ChatWithTools.tsx"
              />
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* WebSocket Streaming */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">WebSocket Streaming</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            For bidirectional communication or when you need persistent connections,
            use <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">useStreamingWebSocket</code>.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Client-side WebSocket hook">
              <CodeBlock
                code={websocketExample}
                filename="components/ChatWithWebSocket.tsx"
              />
            </StepCard>

            <CollapsibleSection
              title="WebSocket Server Setup"
              badge="Node.js Example"
            >
              <CodeBlock
                code={websocketServerExample}
                filename="server/websocket.ts"
              />
            </CollapsibleSection>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">
                  Infrastructure Note:
                </strong>{' '}
                WebSocket requires server infrastructure that supports persistent
                connections. Services like Vercel Serverless don't support WebSocket
                natively - consider Railway, Fly.io, or dedicated servers.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Performance Considerations */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <MemoryStick className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Performance Considerations</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MemoryStick className="w-5 h-5 text-brand-500" />
                Memory Management
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Set <code>maxEventBufferSize</code> to limit stored events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Process events in <code>onMessage</code>, don't rely on events array</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Call <code>reset()</code> periodically for long sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Use <code>onEventBufferOverflow</code> callback for monitoring</span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-brand-500" />
                Render Optimization
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Updates are batched with requestAnimationFrame</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Use <code>lastEvent</code> instead of full events array when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Virtualize long message lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Memoize message components</span>
                </li>
              </ul>
            </div>
          </div>

          <CollapsibleSection
            title="Memory Optimization Example"
            badge="Long Sessions"
          >
            <CodeBlock
              code={memoryOptimizationExample}
              filename="components/MemoryEfficientChat.tsx"
            />
          </CollapsibleSection>
        </section>
      </ScrollReveal>

      {/* Error Handling */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Error Handling</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Production applications need robust error handling with user-friendly
            messages and appropriate recovery options.
          </p>

          <CodeBlock
            code={errorHandlingExample}
            filename="components/RobustErrorHandling.tsx"
          />

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: 'Network',
                color: 'orange',
                desc: 'Connection lost, auto-retry',
              },
              {
                type: 'Auth',
                color: 'red',
                desc: 'Redirect to login',
              },
              {
                type: 'Rate Limit',
                color: 'yellow',
                desc: 'Wait and retry',
              },
              {
                type: 'Server',
                color: 'red',
                desc: 'Report error, manual retry',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className={cn(
                  'font-medium mb-1',
                  item.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                  item.color === 'red' && 'text-red-600 dark:text-red-400',
                  item.color === 'yellow' && 'text-yellow-600 dark:text-yellow-400'
                )}>
                  {item.type} Error
                </div>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Complete Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Complete Example</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            A complete chat implementation combining all the patterns:
            SSE streaming, progress tracking, error handling, and reconnection.
          </p>

          <CodeBlock
            code={completeSSEExample}
            filename="components/CompleteSSEChat.tsx"
          />
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingItems.map((issue, i) => (
              <CollapsibleSection
                key={i}
                title={issue.title}
                badge="Common Issue"
              >
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {issue.description}
                  </p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{issue.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Continue Learning</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Now that you understand streaming, explore these related topics
              to build even more powerful chat applications.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'useClarityChat Hook',
                  description: 'High-level hook that combines streaming with chat state',
                  href: '/reference/hooks/use-clarity-chat',
                },
                {
                  icon: <Wrench className="w-5 h-5" />,
                  title: 'Tool Execution',
                  description: 'Deep dive into function calling and tool use',
                  href: '/guides/tool-execution',
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: 'Error Boundaries',
                  description: 'React error boundaries for chat components',
                  href: '/guides/error-handling',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
        {number}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({
  code,
  filename,
  language = 'typescript',
}: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
