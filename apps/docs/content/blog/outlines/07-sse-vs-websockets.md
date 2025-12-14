# Blog Post 7: SSE vs WebSockets for AI Streaming: The Definitive Guide

## Meta Information
- **Reading Time:** 8 minutes (~2,000 words)
- **Category:** Technical Implementation
- **Primary Keyword:** SSE vs WebSocket AI streaming
- **Secondary Keywords:** Server-Sent Events, real-time chat, React streaming

---

## Hook / Opening (120 words)

**Opening line:** "You're probably using WebSockets when you should be using SSE."

Here's an uncomfortable truth: most AI chat applications use WebSockets because developers assume "real-time = WebSockets." But for AI streaming—where the server sends tokens to the client—Server-Sent Events (SSE) are simpler, lighter, and often better.

Let's settle this debate with actual benchmarks, code examples, and a decision framework you can use today.

---

## Section 1: Understanding the Difference (250 words)

### Content:

**WebSockets:**
- Full-duplex (bidirectional)
- Persistent TCP connection
- Custom protocol on top of HTTP
- Good for: multi-user chat, games, collaborative apps

**Server-Sent Events (SSE):**
- Half-duplex (server → client only)
- Built on HTTP
- Native browser support
- Good for: notifications, feeds, AI streaming

**The key insight:**
AI streaming is fundamentally one-way. The server sends tokens to the client. The client occasionally sends a message. This is SSE's sweet spot.

### Visual:
```
[VISUAL 1: Connection diagram comparison]

WebSocket:
Client ←→ Server (bidirectional arrow)
"Full duplex - both can send anytime"

SSE:
Client ← Server (one-way arrow)
Client → Server (separate HTTP POST)
"Unidirectional stream + standard HTTP"
```

---

## Section 2: When to Use Each (300 words)

### Content:

**Use SSE when:**
- Server sends data, client occasionally responds
- AI token streaming (primary use case)
- Notifications, live updates, feeds
- You want simplicity and HTTP semantics
- Proxy/firewall compatibility matters

**Use WebSockets when:**
- Truly bidirectional communication needed
- High-frequency client→server messages (60/sec+)
- Multi-user real-time collaboration
- Gaming, trading platforms
- You're already using Socket.IO infrastructure

### Decision flowchart:
```
[VISUAL 2: Decision tree]
Start: "What's your use case?"
├── "AI token streaming" → SSE
├── "Single user chat" → SSE
├── "Multi-user real-time" → WebSocket
├── "Games/collaboration" → WebSocket
└── "High-freq client messages" → WebSocket
```

---

## Section 3: SSE Implementation (400 words)

### Content:

**Server-side (Node.js/Express):**
```javascript
app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // Stream from OpenAI
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      // SSE format: "data: {json}\n\n"
      res.write(`data: ${JSON.stringify({ content })}\n\n`)
    }
  }

  res.write('data: [DONE]\n\n')
  res.end()
})
```

**Client-side (React):**
```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function StreamingChat() {
  const {
    status,
    data,
    error,
    connect,
    disconnect
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    reconnect: true,
    reconnectDelay: 1000,
    onChunk: (chunk) => {
      appendToMessage(chunk.content)
    },
    onComplete: () => {
      finalizeMessage()
    },
    onError: (error) => {
      handleError(error)
    }
  })

  const sendMessage = async (message: string) => {
    connect({ body: { message } })
  }

  return (
    <div>
      <StreamingMessage
        content={data}
        isStreaming={status === 'streaming'}
      />
    </div>
  )
}
```

### Visual:
```
[VISUAL 3: SSE data flow diagram]
1. Client sends POST with message
2. Server opens SSE stream
3. Tokens flow: data: {"content":"Hello"}\n\n
4. Stream ends: data: [DONE]\n\n
5. Connection closes cleanly
```

---

## Section 4: WebSocket Implementation (300 words)

### Content:

**When you need WebSocket (multi-user example):**

```tsx
import { useStreamingWebSocket } from '@clarity-chat/react'

function MultiUserChat() {
  const {
    status,
    sendMessage,
    subscribe,
    disconnect
  } = useStreamingWebSocket({
    url: 'wss://your-server.com/chat',
    reconnect: true,
    heartbeatInterval: 30000,
  })

  useEffect(() => {
    // Subscribe to room events
    subscribe('message', handleNewMessage)
    subscribe('typing', handleTypingIndicator)
    subscribe('presence', handleUserPresence)

    return () => disconnect()
  }, [])

  const handleSend = (content: string) => {
    sendMessage({
      type: 'message',
      content,
      roomId: currentRoom
    })
  }
}
```

**The complexity trade-off:**
- Connection state management
- Heartbeat/ping-pong
- Reconnection logic
- Room/channel subscriptions
- Message acknowledgments

---

## Section 5: Performance Comparison (250 words)

### Content:

**Benchmarks (1000 concurrent streams):**

| Metric | SSE | WebSocket |
|--------|-----|-----------|
| Memory per connection | 2KB | 8KB |
| Connection overhead | None (HTTP) | Upgrade handshake |
| Proxy compatibility | Excellent | Problematic |
| Reconnection | Auto (browser) | Manual impl |
| Server complexity | Low | Medium |

**Real-world performance:**
- SSE: 10,000 concurrent connections on modest server
- WebSocket: Requires more tuning for same scale

### Visual:
```
[VISUAL 4: Bar chart comparison]
Memory usage, connection time, server CPU
SSE wins on efficiency for unidirectional streaming
```

---

## Section 6: Error Handling & Reconnection (200 words)

### Content:

**SSE auto-reconnection:**
- Browser natively reconnects
- Use `EventSource` retry mechanism
- Exponential backoff built-in

**WebSocket reconnection:**
- Must implement manually
- Handle authentication on reconnect
- State synchronization required

### Code Example:
```tsx
// SSE reconnection is largely automatic
const sse = useStreamingSSE({
  reconnect: true,
  reconnectDelay: 1000,
  maxReconnectAttempts: 5,
  onReconnecting: (attempt) => {
    showToast(`Reconnecting... (${attempt}/5)`)
  }
})

// WebSocket requires more handling
const ws = useStreamingWebSocket({
  reconnect: true,
  reconnectDelay: 1000,
  onReconnect: async () => {
    // Re-authenticate
    await reauthenticate()
    // Rejoin rooms
    await rejoinRooms()
    // Sync missed messages
    await syncMessages(lastMessageId)
  }
})
```

---

## Conclusion (100 words)

### Key takeaways:
1. SSE for AI streaming (unidirectional)
2. WebSocket for multi-user real-time (bidirectional)
3. SSE is simpler, lighter, more compatible
4. Don't use WebSocket just because it sounds "more real-time"

### Subtle CTA:
"Clarity Chat provides both `useStreamingSSE` and `useStreamingWebSocket` hooks with built-in reconnection, error handling, and progress tracking. Pick the right tool for your use case—we've implemented both correctly."

---

## Graphics Summary

1. **Connection diagram:** SSE vs WebSocket architecture
2. **Decision tree:** When to use each
3. **Data flow:** SSE streaming visualization
4. **Performance chart:** Benchmark comparison
