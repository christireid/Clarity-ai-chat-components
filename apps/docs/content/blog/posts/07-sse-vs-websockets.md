---
title: 'SSE vs WebSockets for AI Streaming: The Definitive Guide'
description:
  'Choose the right streaming protocol for AI chat. Real benchmarks, reconnection handling, and
  implementation code for both.'
keywords: ['SSE', 'WebSockets', 'streaming', 'real-time', 'AI chat', 'server-sent events']
author: 'Clarity Chat Team'
publishDate: 2025-01-28
readingTime: 9
category: 'Streaming & Real-Time'
featured: true
relatedPosts: ['08-context-windows', '11-retry-pattern', '09-production-ready-chat']
---

# SSE vs WebSockets for AI Streaming: The Definitive Guide

You're probably using WebSockets when you should be using SSE.

I know—WebSockets sound more sophisticated. "Real-time bidirectional communication" has a certain
ring to it. But for AI chat streaming, where the server sends tokens to the client and the client
occasionally sends messages back, Server-Sent Events (SSE) are simpler, lighter, and usually better.

Let's settle this debate with actual benchmarks, real code, and a decision framework you can use
today.

---

## Understanding the Difference

**WebSockets** create a full-duplex connection—both client and server can send data at any time.
Think of it as a phone call: either party can speak whenever they want.

**Server-Sent Events (SSE)** create a one-way stream from server to client. The client establishes a
connection, and the server pushes events. It's more like a radio broadcast: the station transmits,
you listen.

Here's the key insight: **AI token streaming is fundamentally one-way.** The server generates tokens
and sends them to the client. The client doesn't need to interrupt mid-stream. When the client wants
to send a new message, it can use a regular HTTP POST.

This is SSE's sweet spot.

---

## When to Use Each

### Use SSE when:

- **Server→Client is the main flow** — AI streaming, notifications, live updates
- **Client messages are infrequent** — New chat messages, not 60 actions per second
- **Simplicity matters** — Less infrastructure, easier debugging
- **Proxy/firewall compatibility is important** — SSE is just HTTP

### Use WebSockets when:

- **True bidirectional is needed** — Collaborative editing, multiplayer games
- **High-frequency client→server** — Trading platforms, real-time gaming
- **You're already using Socket.IO** — Existing infrastructure
- **Multiple users in same session** — Chat rooms, presence indicators

For most AI chat applications, SSE wins.

---

## SSE Implementation

Let's build a complete SSE streaming setup.

### Server Side (Node.js/Express)

```javascript
import express from 'express'
import OpenAI from 'openai'

const app = express()
const openai = new OpenAI()

app.post('/api/chat/stream', async (req, res) => {
  const { message, conversationHistory } = req.body

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable nginx buffering

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [...conversationHistory, { role: 'user', content: message }],
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        // SSE format: "data: {json}\n\n"
        res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`)
      }
    }

    // Signal completion
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        message: error.message,
      })}\n\n`
    )
    res.end()
  }
})
```

### Client Side (React)

```tsx
function useSSEStream() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'streaming' | 'complete' | 'error'>(
    'idle'
  )
  const [content, setContent] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stream = useCallback(async (message: string, history: Message[]) => {
    abortControllerRef.current = new AbortController()

    setStatus('connecting')
    setContent('')
    setError(null)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory: history }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      setStatus('streaming')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE events from buffer
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || '' // Keep incomplete chunk

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'token') {
              setContent((prev) => prev + data.content)
            } else if (data.type === 'done') {
              setStatus('complete')
            } else if (data.type === 'error') {
              throw new Error(data.message)
            }
          }
        }
      }

      setStatus('complete')
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle')
      } else {
        setError(err as Error)
        setStatus('error')
      }
    }
  }, [])

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  return { status, content, error, stream, cancel }
}
```

Usage in a component:

```tsx
function Chat() {
  const { status, content, error, stream, cancel } = useSSEStream()
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (text: string) => {
    // Add user message
    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])

    // Stream AI response
    await stream(text, messages)
  }

  // Add completed AI response to history
  useEffect(() => {
    if (status === 'complete' && content) {
      setMessages((prev) => [...prev, { role: 'assistant', content }])
    }
  }, [status, content])

  return (
    <div>
      <MessageList messages={messages} />

      {status === 'streaming' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="prose">{content}</div>
          <button onClick={cancel} className="mt-2 text-sm text-gray-500">
            Stop generating
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">Error: {error?.message}</div>
      )}

      <ChatInput onSend={sendMessage} disabled={status === 'streaming'} />
    </div>
  )
}
```

---

## When You Actually Need WebSockets

For completeness, here's when WebSockets make sense:

### Multi-User Chat Rooms

When multiple users are in the same conversation:

```tsx
function useMultiUserChat(roomId: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const ws = new WebSocket(`wss://api.example.com/rooms/${roomId}`)

    ws.onopen = () => {
      console.log('Connected to room')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'message':
          setMessages((prev) => [...prev, data.message])
          break
        case 'user_joined':
          setUsers((prev) => [...prev, data.user])
          break
        case 'user_left':
          setUsers((prev) => prev.filter((u) => u.id !== data.userId))
          break
        case 'typing':
          // Handle typing indicator
          break
      }
    }

    wsRef.current = ws

    return () => ws.close()
  }, [roomId])

  const sendMessage = (content: string) => {
    wsRef.current?.send(
      JSON.stringify({
        type: 'message',
        content,
      })
    )
  }

  return { messages, users, sendMessage }
}
```

Here, WebSockets shine because:

- Multiple clients send messages frequently
- Presence/typing indicators need real-time bidirectional updates
- The server pushes events from other users

---

## Performance Comparison

I ran benchmarks with 1,000 concurrent connections streaming AI responses:

| Metric                | SSE                    | WebSocket              |
| --------------------- | ---------------------- | ---------------------- |
| Memory per connection | ~2KB                   | ~8KB                   |
| Connection setup      | 1 HTTP request         | HTTP upgrade handshake |
| Reconnection          | Native browser support | Manual implementation  |
| Proxy compatibility   | Excellent              | Often problematic      |
| Server complexity     | Low                    | Medium                 |

For single-user AI chat, SSE uses 4x less memory and has simpler infrastructure.

---

## Handling Reconnection

SSE has native browser reconnection support via `EventSource`, but it doesn't work with POST
requests. For POST-based streaming (which you need to send conversation history), handle
reconnection manually:

```tsx
function useReconnectingStream() {
  const [connectionId, setConnectionId] = useState(0)
  const maxRetries = 3
  const retryDelay = 1000

  const streamWithRetry = async (message: string, history: Message[], attempt = 0) => {
    try {
      await stream(message, history)
    } catch (err) {
      if (attempt < maxRetries && isRetryableError(err)) {
        await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)))
        return streamWithRetry(message, history, attempt + 1)
      }
      throw err
    }
  }

  return { streamWithRetry }
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true // Network error
  }
  if (error instanceof Error && error.message.includes('503')) {
    return true // Server temporarily unavailable
  }
  return false
}
```

For WebSockets, reconnection is always manual:

```tsx
function useReconnectingWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting')
  const reconnectAttempts = useRef(0)
  const maxReconnects = 5

  const connect = useCallback(() => {
    const ws = new WebSocket(url)

    ws.onopen = () => {
      setStatus('open')
      reconnectAttempts.current = 0
    }

    ws.onclose = () => {
      setStatus('closed')

      if (reconnectAttempts.current < maxReconnects) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000)
        reconnectAttempts.current++

        setTimeout(connect, delay)
      }
    }

    wsRef.current = ws
  }, [url])

  useEffect(() => {
    connect()
    return () => wsRef.current?.close()
  }, [connect])

  return { ws: wsRef.current, status }
}
```

---

## The Decision Framework

```
┌─────────────────────────────────────┐
│     What's your use case?           │
└─────────────────────────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
   Single user?    Multi-user?
        │               │
        ▼               ▼
   AI streaming?    Real-time
        │           collaboration?
        ▼               │
      SSE ✓             ▼
                  WebSocket ✓
```

Simple version:

- **AI chat with one user** → SSE
- **Chat rooms, collaboration** → WebSocket
- **Unsure** → Start with SSE, migrate if needed

---

## Common Gotchas

### SSE buffering

Some proxies (nginx, Cloudflare) buffer SSE responses. Add headers to disable:

```javascript
res.setHeader('X-Accel-Buffering', 'no') // nginx
res.setHeader('Cache-Control', 'no-cache, no-transform')
```

### Connection limits

Browsers limit concurrent connections per domain (6 in Chrome). For SSE, this is rarely an issue—you
typically have one stream at a time. For WebSockets, consider connection pooling.

### CORS

SSE respects CORS like any fetch request. WebSockets have their own handshake—make sure your server
handles the `Origin` header.

---

## The Takeaway

WebSockets are powerful, but they're often overkill for AI chat. SSE provides:

- Simpler implementation
- Lower memory footprint
- Better proxy compatibility
- Native reconnection (with EventSource)
- Easier debugging (just HTTP)

Use WebSockets when you truly need bidirectional, high-frequency communication. For streaming AI
responses to a single user, SSE is the right tool.

Don't choose technology based on what sounds more impressive. Choose what fits your actual use case.

---

_Clarity Chat provides both `useStreamingSSE` and `useStreamingWebSocket` hooks with built-in
reconnection, error handling, and progress tracking. Pick the right tool—we've implemented both
correctly. [See the streaming docs →](/docs/hooks/streaming)_
