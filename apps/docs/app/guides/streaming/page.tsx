'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Pagination } from '@/components/Navigation/Pagination'

export default function StreamingGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">
            Streaming & Transport Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to streaming AI responses, comparing SSE vs
            WebSocket, implementation patterns, and best practices.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Why Streaming Matters</h2>
          <p className="mb-4">
            Streaming allows AI responses to appear word-by-word as they're
            generated, dramatically improving perceived performance and user
            experience. Instead of waiting 20-30 seconds for a complete
            response, users see content immediately and can start reading right
            away.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 border-2 border-destructive/20 rounded-xl">
              <div className="font-semibold text-destructive mb-2">
                ❌ Without Streaming
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• User waits 20-30 seconds</li>
                <li>• Feels slow and broken</li>
                <li>• Users might leave</li>
                <li>• All-or-nothing response</li>
                <li>• No progress indication</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-green-500/20 rounded-xl bg-green-500/5">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-2">
                ✅ With Streaming
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Response appears immediately</li>
                <li>• Feels fast and responsive</li>
                <li>• Users stay engaged</li>
                <li>• Can start reading early</li>
                <li>• Real-time progress feedback</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <p>
              <strong>The Numbers:</strong> Streaming can reduce perceived
              latency by 70-80%. Users think your app is 3-4x faster even though
              actual generation time is the same.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Transport Protocols</h2>
          <p className="mb-4">
            Clarity Chat supports two transport protocols for streaming:
            Server-Sent Events (SSE) and WebSocket. Each has different
            characteristics and use cases.
          </p>

          <h3 className="text-2xl font-semibold mb-3">
            Server-Sent Events (SSE)
          </h3>
          <p className="mb-4">
            SSE is a one-way streaming protocol where the server pushes data to
            the client over HTTP. It's simpler to implement and works well for
            most chat applications.
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Aspect</th>
                  <th className="border border-border p-2 text-left">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Direction</strong>
                  </td>
                  <td className="border border-border p-2">
                    One-way (server → client)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Protocol</strong>
                  </td>
                  <td className="border border-border p-2">HTTP/HTTPS</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Complexity</strong>
                  </td>
                  <td className="border border-border p-2">
                    Low - simple HTTP connection
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Reconnection</strong>
                  </td>
                  <td className="border border-border p-2">
                    Automatic with event ID resumption
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Best For</strong>
                  </td>
                  <td className="border border-border p-2">
                    Most chat applications, simple streaming
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <EnhancedCodeBlock
            code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEChat() {
  const {
    status,
    data,
    events,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello' },
    autoReconnect: true,
    onMessage: (event) => {
      console.log('Received:', event.data)
    },
  })

  return (
    <div>
      <button onClick={connect}>Start Stream</button>
      <p>Status: {status}</p>
      <p>Data: {data}</p>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">WebSocket</h3>
          <p className="mb-4">
            WebSocket provides bidirectional communication, allowing both
            server-to-client and client-to-server streaming. Better for complex
            applications requiring real-time interaction.
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Aspect</th>
                  <th className="border border-border p-2 text-left">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Direction</strong>
                  </td>
                  <td className="border border-border p-2">
                    Bidirectional (server ↔ client)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Protocol</strong>
                  </td>
                  <td className="border border-border p-2">
                    WebSocket (ws:// or wss://)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Complexity</strong>
                  </td>
                  <td className="border border-border p-2">
                    Medium - requires WebSocket server
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Reconnection</strong>
                  </td>
                  <td className="border border-border p-2">
                    Automatic with exponential backoff
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Best For</strong>
                  </td>
                  <td className="border border-border p-2">
                    Real-time collaboration, complex interactions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <EnhancedCodeBlock
            code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketChat() {
  const {
    status,
    messages,
    sendJson,
    connect,
    disconnect,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    autoReconnect: true,
    enableHeartbeat: true,
    onMessage: (msg) => {
      console.log('Received:', msg.data)
    },
  })

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={() => sendJson({ type: 'message', content: 'Hello' })}>
        Send
      </button>
      <p>Status: {status}</p>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            SSE vs WebSocket Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">
                    Feature
                  </th>
                  <th className="border border-border p-2 text-left">SSE</th>
                  <th className="border border-border p-2 text-left">
                    WebSocket
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Direction</strong>
                  </td>
                  <td className="border border-border p-2">One-way</td>
                  <td className="border border-border p-2">Bidirectional</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Protocol</strong>
                  </td>
                  <td className="border border-border p-2">HTTP</td>
                  <td className="border border-border p-2">WebSocket</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Setup Complexity</strong>
                  </td>
                  <td className="border border-border p-2">Low</td>
                  <td className="border border-border p-2">Medium</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Reconnection</strong>
                  </td>
                  <td className="border border-border p-2">Automatic</td>
                  <td className="border border-border p-2">Automatic</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Heartbeat</strong>
                  </td>
                  <td className="border border-border p-2">Built-in</td>
                  <td className="border border-border p-2">
                    Manual (ping/pong)
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Use Case</strong>
                  </td>
                  <td className="border border-border p-2">Simple streaming</td>
                  <td className="border border-border p-2">
                    Real-time interaction
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="tip">
            <p>
              <strong>Recommendation:</strong> Start with SSE for most chat
              applications. It's simpler, works with standard HTTP
              infrastructure, and handles reconnection automatically. Use
              WebSocket when you need bidirectional communication or real-time
              collaboration features.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            Using Streaming with useClarityChat
          </h2>
          <p className="mb-4">
            The <code>useClarityChat</code> hook supports both SSE and WebSocket
            transports:
          </p>

          <h3 className="text-2xl font-semibold mb-3">
            SSE Transport (Default)
          </h3>
          <EnhancedCodeBlock
            code={`import { useClarityChat } from '@clarity-chat/react'

function SSEChat() {
  const {
    messages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    transport: 'sse', // Default
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            WebSocket Transport
          </h3>
          <EnhancedCodeBlock
            code={`import { useClarityChat } from '@clarity-chat/react'

function WebSocketChat() {
  const {
    messages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    transport: 'websocket',
    websocket: {
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableHeartbeat: true,
    },
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Server Implementation</h2>
          <p className="mb-4">
            Here are examples of implementing streaming endpoints for both SSE
            and WebSocket:
          </p>

          <h3 className="text-2xl font-semibold mb-3">
            SSE Server (Next.js API Route)
          </h3>
          <EnhancedCodeBlock
            code={`// app/api/chat/stream/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Create streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages,
          stream: true,
        })

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(
              encoder.encode(\`data: \${JSON.stringify({ content })}\\n\\n\`)
            )
          }
        }

        // Send done event
        controller.enqueue(
          encoder.encode(\`event: done\\ndata: {}\\n\\n\`)
        )
        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(\`event: error\\ndata: \${JSON.stringify({ error: error.message })}\\n\\n\`)
        )
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
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            WebSocket Server (Node.js)
          </h3>
          <EnhancedCodeBlock
            code={`// server.js
import { WebSocketServer } from 'ws'
import OpenAI from 'openai'

const wss = new WebSocketServer({ port: 8080 })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const { type, messages } = JSON.parse(data.toString())

    if (type === 'chat') {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages,
          stream: true,
        })

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            ws.send(JSON.stringify({ type: 'chunk', content }))
          }
        }

        ws.send(JSON.stringify({ type: 'done' }))
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', error: error.message }))
      }
    }
  })

  // Heartbeat
  const heartbeat = setInterval(() => {
    ws.ping()
  }, 30000)

  ws.on('close', () => {
    clearInterval(heartbeat)
  })
})`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            Handling Stream Interruption
          </h2>
          <p className="mb-4">
            Users should be able to cancel long-running streams. Here's how to
            implement cancellation:
          </p>

          <EnhancedCodeBlock
            code={`import { useClarityChat } from '@clarity-chat/react'
import { useState } from 'react'

function CancellableChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const {
    messages,
    append,
    stop,
  } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
  })

  const handleSend = async (message: string) => {
    setIsStreaming(true)
    try {
      await append({ role: 'user', content: message })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleCancel = () => {
    stop() // Stop the current stream
    setIsStreaming(false)
  }

  return (
    <div>
      {isStreaming && (
        <button onClick={handleCancel}>Cancel</button>
      )}
      {/* Chat UI */}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Error Handling</h2>
          <p className="mb-4">
            Proper error handling is crucial for streaming. Handle network
            errors, interruptions, and API errors:
          </p>

          <EnhancedCodeBlock
            code={`import { useClarityChat } from '@clarity-chat/react'

function ChatWithErrorHandling() {
  const {
    messages,
    append,
    error,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    transport: 'sse',
    onError: (error) => {
      console.error('Stream error:', error)
      // Show user-friendly error message
      if (error.message.includes('network')) {
        alert('Network error. Please check your connection.')
      } else if (error.message.includes('rate limit')) {
        alert('Rate limit exceeded. Please try again later.')
      } else {
        alert('An error occurred. Please try again.')
      }
    },
  })

  return (
    <div>
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      {/* Chat UI */}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            Reconnection Strategies
          </h2>
          <p className="mb-4">
            Both SSE and WebSocket hooks support automatic reconnection with
            exponential backoff:
          </p>

          <h3 className="text-2xl font-semibold mb-3">SSE Reconnection</h3>
          <EnhancedCodeBlock
            code={`import { useStreamingSSE } from '@clarity-chat/react'

function SSEReconnect() {
  const {
    status,
    reconnectAttempt,
    isReconnecting,
  } = useStreamingSSE({
    url: '/api/stream',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000, // Start with 1 second
    maxReconnectDelay: 30000, // Max 30 seconds
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },
    onMaxReconnectAttemptsReached: () => {
      alert('Failed to reconnect. Please refresh the page.')
    },
  })

  return (
    <div>
      {isReconnecting && (
        <p>Reconnecting... (attempt {reconnectAttempt})</p>
      )}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            WebSocket Reconnection
          </h3>
          <EnhancedCodeBlock
            code={`import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketReconnect() {
  const {
    status,
    reconnectAttempt,
    isReconnecting,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/ws',
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt}) in \${delay}ms\`)
    },
  })

  return (
    <div>
      {isReconnecting && (
        <p>Reconnecting... (attempt {reconnectAttempt})</p>
      )}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            When to Use Each Transport
          </h2>

          <h3 className="text-2xl font-semibold mb-3">Use SSE When:</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>✅ You need simple one-way streaming (server → client)</li>
            <li>✅ You want to use standard HTTP infrastructure</li>
            <li>✅ You need automatic reconnection with event ID resumption</li>
            <li>✅ You're building a standard chat application</li>
            <li>✅ You want the simplest implementation</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            Use WebSocket When:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>✅ You need bidirectional communication</li>
            <li>✅ You're building real-time collaboration features</li>
            <li>✅ You need to send frequent updates from client to server</li>
            <li>✅ You're building a complex real-time application</li>
            <li>✅ You need lower latency for client-to-server messages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">
            1. Show Streaming Indicators
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Display a cursor or typing indicator while streaming</li>
            <li>Mark messages as "streaming" until complete</li>
            <li>Show connection status (connected, reconnecting, etc.)</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            2. Handle Interruptions Gracefully
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Allow users to cancel long-running streams</li>
            <li>Handle network interruptions with automatic reconnection</li>
            <li>Preserve partial content if stream is interrupted</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            3. Optimize UI Updates
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              Debounce UI updates (update every 50-100ms, not every chunk)
            </li>
            <li>
              Use React's <code>useTransition</code> for non-urgent updates
            </li>
            <li>Avoid re-rendering the entire message list on each chunk</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Auto-Scroll</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Automatically scroll to show the latest content</li>
            <li>Pause auto-scroll if user has manually scrolled up</li>
            <li>Resume auto-scroll when user scrolls back to bottom</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            5. Error Recovery
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Provide clear error messages to users</li>
            <li>Offer retry options for failed streams</li>
            <li>
              Log errors for debugging while showing user-friendly messages
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">6. Performance</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use virtual scrolling for long message lists</li>
            <li>Memoize expensive computations</li>
            <li>Limit the number of messages rendered at once</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Troubleshooting</h2>

          <h3 className="text-2xl font-semibold mb-3">Stream Not Starting</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Check that the API endpoint supports streaming</li>
            <li>Verify CORS headers allow streaming responses</li>
            <li>Ensure the server sends proper SSE or WebSocket headers</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            Connection Drops Frequently
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Enable automatic reconnection with exponential backoff</li>
            <li>Check network stability and proxy settings</li>
            <li>Implement heartbeat/ping-pong for WebSocket</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">UI Feels Laggy</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Debounce UI updates instead of updating on every chunk</li>
            <li>
              Use React's <code>useTransition</code> for non-urgent updates
            </li>
            <li>Consider virtual scrolling for long message lists</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a
                href="/reference/hooks/use-streaming-sse"
                className="text-primary underline"
              >
                useStreamingSSE Hook
              </a>{' '}
              – SSE streaming hook documentation
            </li>
            <li>
              <a
                href="/reference/hooks/use-streaming-websocket"
                className="text-primary underline"
              >
                useStreamingWebSocket Hook
              </a>{' '}
              – WebSocket streaming hook documentation
            </li>
            <li>
              <a
                href="/reference/hooks/use-streamable-ui"
                className="text-primary underline"
              >
                useStreamableUI Hook
              </a>{' '}
              – UI state management for streaming
            </li>
            <li>
              <a
                href="/reference/hooks/use-clarity-chat"
                className="text-primary underline"
              >
                useClarityChat Hook
              </a>{' '}
              – Chat hook with streaming support
            </li>
            <li>
              <a
                href="/reference/components/streaming-message"
                className="text-primary underline"
              >
                StreamingMessage Component
              </a>{' '}
              – Component for displaying streaming content
            </li>
          </ul>
        </section>

        <Pagination
          previous={{
            title: 'Memory System Guide',
            href: '/guides/memory',
          }}
          next={{
            title: 'Token Optimization Guide',
            href: '/guides/token-optimization',
          }}
        />
      </div>
    </>
  )
}
