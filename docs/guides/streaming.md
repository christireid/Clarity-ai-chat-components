# Streaming Messages Guide

Learn how to implement real-time streaming responses in your chat application.

---

## 🌊 Why Streaming?

Streaming provides a better user experience by:
- ✅ Showing responses as they're generated
- ✅ Reducing perceived latency
- ✅ Allowing users to read while AI is thinking
- ✅ Enabling cancellation of long responses

### Streaming vs Non-Streaming Comparison

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant AI
    
    rect rgb(255, 240, 240)
    Note over User,AI: ❌ Non-Streaming (Traditional)
    User->>UI: Send message
    UI->>API: POST request
    API->>AI: Generate response
    Note over AI: Wait 10-30 seconds...
    AI-->>API: Complete response
    API-->>UI: Full response
    UI-->>User: Display all at once
    Note over User: Long wait time!
    end
    
    rect rgb(240, 255, 240)
    Note over User,AI: ✅ Streaming (Modern)
    User->>UI: Send message
    UI->>API: POST request (stream=true)
    API->>AI: Generate response
    
    loop Every 50-200ms
        AI-->>API: Chunk of text
        API-->>UI: Stream chunk
        UI-->>User: Display progressively
    end
    
    AI-->>API: Stream complete
    API-->>UI: Close stream
    Note over User: Instant feedback!
    end
```

### User Experience Impact

```mermaid
graph LR
    subgraph "Non-Streaming UX"
        A1[User sends message] --> A2[Loading spinner...]
        A2 --> A3[Wait 15s]
        A3 --> A4[Full response appears]
        A4 --> A5[User reads]
    end
    
    subgraph "Streaming UX"
        B1[User sends message] --> B2[First words appear]
        B2 --> B3[User starts reading]
        B3 --> B4[More text streams in]
        B4 --> B5[User continues reading]
        B5 --> B6[Response completes]
    end
    
    style A2 fill:#ef4444,color:#fff
    style A3 fill:#f59e0b,color:#fff
    style B2 fill:#7ED321,color:#fff
    style B3 fill:#10b981,color:#fff
    style B5 fill:#50E3C2,color:#fff
```

---

## 🚀 Quick Start

### Streaming Architecture Overview

```mermaid
graph TB
    subgraph "Frontend"
        A[User Input] --> B[useStreaming Hook]
        B --> C[Fetch with ReadableStream]
    end
    
    subgraph "Backend"
        D[API Route] --> E[AI Provider SDK]
        E --> F[Stream Generator]
    end
    
    subgraph "AI Provider"
        G[OpenAI/Claude/etc]
    end
    
    C -->|HTTP Request| D
    F -->|Text Chunks| C
    E -->|API Call| G
    G -->|Streamed Tokens| E
    
    C --> H[Update UI State]
    H --> I[Render Message]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style G fill:#F5A623,color:#fff
    style I fill:#7ED321,color:#fff
```

### Basic Streaming with SSE

```tsx
import { useStreaming } from '@clarity-chat/react'

function StreamingChat() {
  const { streamMessage, isStreaming } = useStreaming({
    onChunk: (chunk) => console.log('Received:', chunk),
    onComplete: (fullText) => console.log('Done:', fullText),
  })

  const handleSend = async (content: string) => {
    await streamMessage('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      isLoading={isStreaming}
    />
  )
}
```

---

## 📡 Server-Sent Events (SSE)

### SSE Architecture

```mermaid
graph LR
    subgraph "Client"
        A[Browser] --> B[EventSource/Fetch]
        B --> C[Event Listener]
    end
    
    subgraph "Server"
        D[HTTP Endpoint] --> E[Keep-Alive Connection]
        E --> F[Stream Writer]
    end
    
    subgraph "Data Flow"
        G[AI Response] --> H[Chunk 1]
        G --> I[Chunk 2]
        G --> J[Chunk N]
    end
    
    B -.->|Long-lived connection| D
    F -.->|Server Push| B
    
    H --> F
    I --> F
    J --> F
    
    C --> K[Update UI]
    
    style B fill:#4A90E2,color:#fff
    style E fill:#50E3C2,color:#fff
    style F fill:#F5A623,color:#fff
    style K fill:#7ED321,color:#fff
```

### SSE Message Format

```mermaid
sequenceDiagram
    participant Server
    participant Stream as HTTP Stream
    participant Client
    
    Note over Server,Client: SSE Event Format
    
    Server->>Stream: data: {"content": "Hello"}
    Stream->>Client: Parse JSON
    Client->>Client: Update UI: "Hello"
    
    Server->>Stream: data: {"content": " World"}
    Stream->>Client: Parse JSON
    Client->>Client: Update UI: "Hello World"
    
    Server->>Stream: data: {"content": "!"}
    Stream->>Client: Parse JSON
    Client->>Client: Update UI: "Hello World!"
    
    Server->>Stream: data: [DONE]
    Stream->>Client: Stream complete
    Client->>Client: Finalize message
    
    Note over Server,Client: Each chunk ends with \n\n
```

### Backend Implementation (Next.js)

```typescript
// app/api/chat/route.ts
import { OpenAI } from 'openai'

export async function POST(req: Request) {
  const { message } = await req.json()
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
    stream: true,
  })

  // Create a readable stream
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

### Frontend with useStreamingSSE

```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function SSEChat() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const { connect, isConnected, disconnect } = useStreamingSSE({
    url: '/api/chat/stream',
    onMessage: (data) => {
      // Update the last message with streamed content
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + data.content },
          ]
        }
        return prev
      })
    },
    onError: (error) => console.error('SSE Error:', error),
  })

  const handleSend = async (content: string) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() },
    ])
    
    // Add empty assistant message for streaming
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date() },
    ])
    
    // Start streaming
    connect({ message: content })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      isLoading={isConnected}
    />
  )
}
```

---

## 🔌 WebSocket Streaming

### WebSocket vs SSE Comparison

```mermaid
graph TB
    subgraph "Server-Sent Events (SSE)"
        A1[Unidirectional]
        A2[Server → Client only]
        A3[HTTP-based]
        A4[Auto-reconnect]
        A5[Text data only]
        A6[Simpler implementation]
    end
    
    subgraph "WebSocket"
        B1[Bidirectional]
        B2[Client ↔ Server]
        B3[WebSocket protocol]
        B4[Manual reconnect]
        B5[Binary + Text data]
        B6[More complex setup]
    end
    
    subgraph "Use Cases"
        C1[SSE: Chat responses<br/>AI streaming<br/>Notifications]
        C2[WebSocket: Real-time chat<br/>Multiplayer games<br/>Live collaboration]
    end
    
    A1 --> C1
    B1 --> C2
    
    style A1 fill:#4A90E2,color:#fff
    style A6 fill:#7ED321,color:#fff
    style B1 fill:#F5A623,color:#fff
    style B5 fill:#50E3C2,color:#fff
```

### WebSocket Connection Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Connecting: new WebSocket(url)
    Connecting --> Open: onopen event
    Connecting --> Failed: onerror event
    
    Open --> Sending: ws.send(data)
    Open --> Receiving: onmessage event
    Open --> Closing: ws.close()
    Open --> Closed: Connection lost
    
    Sending --> Open: Message sent
    Receiving --> Open: Message processed
    
    Closing --> Closed: onclose event
    Closed --> Reconnecting: Auto-reconnect enabled
    Reconnecting --> Connecting: Retry
    
    Failed --> Reconnecting: Auto-reconnect enabled
    Reconnecting --> [*]: Max retries reached
    Closed --> [*]: Manual close
    
    note right of Open
        Active bidirectional
        communication
    end note
    
    note right of Reconnecting
        Exponential backoff
        retry strategy
    end note
```

### Backend Implementation (Express)

```typescript
import { WebSocketServer } from 'ws'
import { OpenAI } from 'openai'

const wss = new WebSocketServer({ port: 8080 })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const { message } = JSON.parse(data.toString())
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        ws.send(JSON.stringify({ type: 'chunk', content }))
      }
    }
    
    ws.send(JSON.stringify({ type: 'done' }))
  })
})
```

### Frontend with useStreamingWebSocket

```tsx
import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketChat() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const { sendMessage, isConnected } = useStreamingWebSocket({
    url: 'ws://localhost:8080',
    onMessage: (data) => {
      if (data.type === 'chunk') {
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + data.content },
          ]
        })
      }
    },
    reconnect: true,
    reconnectInterval: 3000,
  })

  const handleSend = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() },
      { id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: new Date() },
    ])
    
    sendMessage({ message: content })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      isLoading={!isConnected}
    />
  )
}
```

---

## ⚡ Advanced Features

### Stream Cancellation Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Hook as useStreaming
    participant API
    participant AI
    
    User->>UI: Send message
    UI->>Hook: streamMessage()
    Hook->>API: Start streaming
    API->>AI: Begin generation
    
    loop Streaming
        AI-->>API: Chunk
        API-->>Hook: Stream chunk
        Hook-->>UI: Update UI
    end
    
    User->>UI: Click "Cancel"
    UI->>Hook: cancel()
    Hook->>API: AbortController.abort()
    API->>AI: Stop generation
    AI-->>API: Cleanup
    API-->>Hook: Stream aborted
    Hook-->>UI: Reset state
    UI-->>User: Show cancellation
    
    Note over User,AI: Cost savings + Better UX
```

### Stream Cancellation

```tsx
import { StreamCancellation } from '@clarity-chat/react'

function CancellableChat() {
  const { streamMessage, isStreaming, cancel } = useStreaming()

  return (
    <div>
      <ChatWindow
        messages={messages}
        onSendMessage={streamMessage}
        isLoading={isStreaming}
      />
      
      {isStreaming && (
        <StreamCancellation
          onCancel={cancel}
          message="Cancel generation"
        />
      )}
    </div>
  )
}
```

### Typing Indicators

```tsx
import { useRealisticTyping } from '@clarity-chat/react'

function TypingChat() {
  const { showTyping, stages } = useRealisticTyping({
    stages: [
      { text: 'Thinking...', duration: 1000 },
      { text: 'Analyzing...', duration: 1500 },
      { text: 'Generating response...', duration: 2000 },
    ],
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      renderTyping={() => showTyping && (
        <ThinkingIndicator stage={stages[currentStage]} />
      )}
    />
  )
}
```

### Thinking Stages Visualization

```mermaid
gantt
    title AI Thinking Stages During Response Generation
    dateFormat  ss
    section Stages
    Thinking...           :a1, 00, 1s
    Analyzing...          :a2, after a1, 1.5s
    Generating response...:a3, after a2, 2s
    Streaming text...     :a4, after a3, 5s
    Complete              :milestone, after a4, 0s
```

### Token Streaming with Cost Tracking

```tsx
import { useTokenTracker } from '@clarity-chat/react'

function CostAwareChat() {
  const { trackTokens, totalTokens, estimatedCost } = useTokenTracker({
    model: 'gpt-4',
    pricing: {
      input: 0.03,  // per 1K tokens
      output: 0.06,
    },
  })

  const { streamMessage } = useStreaming({
    onChunk: (chunk, metadata) => {
      if (metadata?.tokens) {
        trackTokens(metadata.tokens)
      }
    },
  })

  return (
    <div>
      <ChatWindow messages={messages} onSendMessage={streamMessage} />
      <TokenCounter tokens={totalTokens} cost={estimatedCost} />
    </div>
  )
}
```

### Token Cost Calculation

```mermaid
graph LR
    A[Incoming Chunk] --> B{Has Token Metadata?}
    B -->|Yes| C[Extract Token Count]
    B -->|No| D[Estimate from Text Length]
    
    C --> E[Add to Total Tokens]
    D --> F[~4 chars = 1 token]
    F --> E
    
    E --> G[Calculate Input Cost]
    E --> H[Calculate Output Cost]
    
    G --> I[Input Tokens × $0.03/1K]
    H --> J[Output Tokens × $0.06/1K]
    
    I --> K[Total Cost]
    J --> K
    
    K --> L[Display to User]
    
    style C fill:#7ED321,color:#fff
    style D fill:#F5A623,color:#fff
    style K fill:#4A90E2,color:#fff
    style L fill:#50E3C2,color:#fff
```

---

## 🛠️ Error Handling

### Error Handling State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Streaming: Start stream
    Streaming --> Success: Stream complete
    Streaming --> NetworkError: Connection lost
    Streaming --> APIError: API error
    Streaming --> Timeout: Request timeout
    
    NetworkError --> Retrying: Auto-retry
    APIError --> Retrying: Auto-retry
    Timeout --> Retrying: Auto-retry
    
    Retrying --> Streaming: Retry attempt
    Retrying --> Failed: Max retries reached
    
    Success --> Idle: Ready for next
    Failed --> FallbackMode: Use non-streaming
    FallbackMode --> Idle: Request complete
    
    note right of Retrying
        Exponential backoff:
        1s, 2s, 4s, 8s
    end note
    
    note right of FallbackMode
        Graceful degradation
        to regular requests
    end note
```

### Retry on Connection Loss

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

function ResilientStreamingChat() {
  const { executeWithRetry } = useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
  })

  const { streamMessage } = useStreaming({
    onError: async (error) => {
      await executeWithRetry(async () => {
        // Retry the stream
        await streamMessage(url, options)
      })
    },
  })

  return <ChatWindow {...props} />
}
```

### Fallback to Non-Streaming

```tsx
function AdaptiveChat() {
  const [useStreaming, setUseStreaming] = useState(true)
  
  const handleSend = async (content: string) => {
    if (useStreaming) {
      try {
        await streamMessage('/api/chat', { ... })
      } catch (error) {
        console.warn('Streaming failed, falling back to regular request')
        setUseStreaming(false)
        // Fall back to regular request
        const response = await fetch('/api/chat', { ... })
        const data = await response.json()
        // Handle non-streaming response
      }
    } else {
      // Regular non-streaming request
    }
  }

  return <ChatWindow onSendMessage={handleSend} />
}
```

### Adaptive Fallback Flow

```mermaid
graph TD
    A[Send Message] --> B{Streaming Enabled?}
    B -->|Yes| C[Try Stream]
    B -->|No| D[Regular Request]
    
    C --> E{Stream Success?}
    E -->|Yes| F[Display Streamed Response]
    E -->|No| G[Log Error]
    
    G --> H{Retry Count < 3?}
    H -->|Yes| I[Exponential Backoff]
    H -->|No| J[Disable Streaming]
    
    I --> C
    J --> K[Show Error Toast]
    K --> D
    
    D --> L[Get Full Response]
    L --> M[Display at Once]
    
    F --> N[Ready for Next Message]
    M --> N
    
    style C fill:#4A90E2,color:#fff
    style D fill:#F5A623,color:#fff
    style F fill:#7ED321,color:#fff
    style J fill:#ef4444,color:#fff
```

---

## 📊 Performance Optimization

### Streaming Performance Metrics

```mermaid
graph TB
    subgraph "Without Optimization"
        A1[Every chunk = UI update]
        A2[60+ updates/second]
        A3[UI thrashing]
        A4[Laggy experience]
    end
    
    subgraph "With Debouncing"
        B1[Buffer chunks]
        B2[Update every 100ms]
        B3[10 updates/second]
        B4[Smooth experience]
    end
    
    subgraph "With Batching"
        C1[Collect chunks]
        C2[Flush on interval]
        C3[Combine multiple chunks]
        C4[Efficient rendering]
    end
    
    A1 --> A2 --> A3 --> A4
    B1 --> B2 --> B3 --> B4
    C1 --> C2 --> C3 --> C4
    
    style A3 fill:#ef4444,color:#fff
    style A4 fill:#f59e0b,color:#fff
    style B3 fill:#7ED321,color:#fff
    style B4 fill:#10b981,color:#fff
    style C4 fill:#50E3C2,color:#fff
```

### Debounced Updates

```tsx
import { useDebounce } from '@clarity-chat/react'

function OptimizedStreamingChat() {
  const [streamedContent, setStreamedContent] = useState('')
  const debouncedContent = useDebounce(streamedContent, 100)

  const { streamMessage } = useStreaming({
    onChunk: (chunk) => {
      // Accumulate chunks but debounce UI updates
      setStreamedContent((prev) => prev + chunk)
    },
  })

  // Use debounced content for rendering
  return <Message content={debouncedContent} />
}
```

### Batched Chunk Processing

```tsx
function BatchedStreamingChat() {
  const chunkBuffer = useRef<string[]>([])
  const flushInterval = useRef<NodeJS.Timeout>()

  const flushBuffer = () => {
    if (chunkBuffer.current.length > 0) {
      const combined = chunkBuffer.current.join('')
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + combined },
        ]
      })
      chunkBuffer.current = []
    }
  }

  const { streamMessage } = useStreaming({
    onChunk: (chunk) => {
      chunkBuffer.current.push(chunk)
      
      // Flush every 100ms
      if (!flushInterval.current) {
        flushInterval.current = setInterval(flushBuffer, 100)
      }
    },
    onComplete: () => {
      flushBuffer()
      if (flushInterval.current) {
        clearInterval(flushInterval.current)
        flushInterval.current = undefined
      }
    },
  })

  return <ChatWindow onSendMessage={streamMessage} />
}
```

### Batch Processing Timeline

```mermaid
gantt
    title Chunk Processing Timeline (100ms batches)
    dateFormat  ss.SSS
    
    section Chunks Arrive
    Chunk 1    :a1, 00.000, 10ms
    Chunk 2    :a2, 00.020, 10ms
    Chunk 3    :a3, 00.045, 10ms
    Chunk 4    :a4, 00.070, 10ms
    
    section Buffer
    Accumulate :b1, 00.000, 100ms
    
    section UI Update
    Flush & Render :c1, 00.100, 20ms
    
    section Next Batch
    Chunks 5-8 :d1, 00.120, 80ms
    Flush & Render :d2, 00.200, 20ms
```

---

## 🔐 Security Best Practices

### Security Architecture

```mermaid
graph TB
    A[Client Request] --> B{Rate Limit Check}
    B -->|Pass| C{Authentication}
    B -->|Fail| D[429 Too Many Requests]
    
    C -->|Valid| E{Input Validation}
    C -->|Invalid| F[401 Unauthorized]
    
    E -->|Pass| G{Content Filter}
    E -->|Fail| H[400 Bad Request]
    
    G -->|Safe| I[Start Stream]
    G -->|Unsafe| J[403 Forbidden]
    
    I --> K[Stream Response]
    K --> L{Output Filter}
    L -->|Safe| M[Send to Client]
    L -->|Unsafe| N[Sanitize Content]
    N --> M
    
    style B fill:#F5A623,color:#fff
    style C fill:#4A90E2,color:#fff
    style E fill:#50E3C2,color:#fff
    style M fill:#7ED321,color:#fff
    style D fill:#ef4444,color:#fff
    style F fill:#ef4444,color:#fff
    style H fill:#ef4444,color:#fff
    style J fill:#ef4444,color:#fff
```

### Rate Limiting

```typescript
// Backend rate limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
})

export async function POST(req: Request) {
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
  
  // Continue with streaming
}
```

### Input Validation

```tsx
function SecureStreamingChat() {
  const validateInput = (content: string): boolean => {
    // Check length
    if (content.length > 4000) {
      toast.error('Message too long (max 4000 characters)')
      return false
    }
    
    // Check for malicious patterns
    if (/<script|javascript:/i.test(content)) {
      toast.error('Invalid input detected')
      return false
    }
    
    return true
  }

  const handleSend = async (content: string) => {
    if (!validateInput(content)) return
    await streamMessage('/api/chat', { ... })
  }

  return <ChatWindow onSendMessage={handleSend} />
}
```

### Input Validation Flow

```mermaid
graph LR
    A[User Input] --> B{Length Check}
    B -->|> 4000 chars| C[Reject: Too Long]
    B -->|✓ Valid| D{Pattern Check}
    
    D -->|Script Tags| E[Reject: XSS Attempt]
    D -->|SQL Keywords| F[Reject: SQLi Attempt]
    D -->|✓ Safe| G{Encoding Check}
    
    G -->|Invalid UTF-8| H[Reject: Bad Encoding]
    G -->|✓ Valid| I{Rate Limit}
    
    I -->|Exceeded| J[Reject: Too Many Requests]
    I -->|✓ OK| K[Sanitize Input]
    
    K --> L[Forward to AI]
    
    style C fill:#ef4444,color:#fff
    style E fill:#ef4444,color:#fff
    style F fill:#ef4444,color:#fff
    style H fill:#ef4444,color:#fff
    style J fill:#ef4444,color:#fff
    style K fill:#50E3C2,color:#fff
    style L fill:#7ED321,color:#fff
```

---

## 📚 Provider-Specific Examples

### Provider Integration Comparison

```mermaid
graph TB
    subgraph "OpenAI"
        O1[GPT-4 Turbo]
        O2[Stream: true]
        O3[Delta chunks]
        O4[Usage metadata]
    end
    
    subgraph "Anthropic Claude"
        A1[Claude 3 Opus]
        A2[messages.stream]
        A3[content_block_delta]
        A4[No usage in stream]
    end
    
    subgraph "Azure OpenAI"
        Z1[Deployed models]
        Z2[streamChatCompletions]
        Z3[Compatible with OpenAI]
        Z4[Regional endpoints]
    end
    
    subgraph "Local Models (Ollama)"
        L1[Open-source models]
        L2[Local streaming]
        L3[No API costs]
        L4[Privacy-focused]
    end
    
    style O1 fill:#10b981,color:#fff
    style A1 fill:#F5A623,color:#fff
    style Z1 fill:#4A90E2,color:#fff
    style L1 fill:#ec4899,color:#fff
```

### OpenAI

```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{ role: 'user', content: message }],
  stream: true,
  stream_options: { include_usage: true }, // Get token usage
})
```

### Anthropic Claude

```typescript
const stream = await anthropic.messages.stream({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [{ role: 'user', content: message }],
})

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    // Handle chunk
  }
}
```

### Azure OpenAI

```typescript
const deployment = 'gpt-4'
const stream = await client.streamChatCompletions(
  deployment,
  [{ role: 'user', content: message }]
)

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content
  if (content) {
    // Handle chunk
  }
}
```

---

## 🧪 Testing Streaming

### Testing Strategy

```mermaid
graph TD
    A[Streaming Tests] --> B[Unit Tests]
    A --> C[Integration Tests]
    A --> D[E2E Tests]
    
    B --> B1[Mock stream chunks]
    B --> B2[Test state updates]
    B --> B3[Test error handling]
    
    C --> C1[Test API endpoints]
    C --> C2[Test reconnection]
    C --> C3[Test cancellation]
    
    D --> D1[Full user flow]
    D --> D2[Real streaming]
    D --> D3[Performance metrics]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
    style D fill:#ec4899,color:#fff
```

### Mock Streaming Response

```tsx
import { vi } from 'vitest'

describe('Streaming Chat', () => {
  it('handles streamed messages', async () => {
    const mockStream = vi.fn().mockImplementation(async () => {
      // Simulate chunks
      await new Promise((resolve) => setTimeout(resolve, 100))
      onChunk('Hello')
      await new Promise((resolve) => setTimeout(resolve, 100))
      onChunk(' World')
      onComplete('Hello World')
    })

    const { result } = renderHook(() => useStreaming())
    await act(async () => {
      await result.current.streamMessage('/api/chat', {})
    })

    expect(result.current.isStreaming).toBe(false)
  })
})
```

---

## 📖 Related Documentation

- [useStreaming Hook](../api/hooks.md#usestreaming)
- [Error Handling](./error-handling.md)
- [Performance Guide](./performance.md)

---

**Need help with streaming?** [Join our Discord](https://discord.gg/clarity-chat)
