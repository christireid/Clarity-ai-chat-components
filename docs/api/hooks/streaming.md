# Streaming Hooks

Hooks for managing streaming responses from AI models with automatic reconnection and progress tracking.

---

## Overview

These hooks handle streaming AI responses using Server-Sent Events (SSE) or WebSockets. **Grade A** streaming implementation according to our audit.

| Hook | Purpose | Use Case |
|---------|----------|----------|
| [`useStreaming`](#usestreaming) | Low-level ReadableStream primitive | Custom streaming protocols |
| [`useStreamingSSE`](#usestreamingsse) | SSE with auto-reconnect ⭐ | OpenAI/Anthropic API |
| [`useStreamingWebSocket`](#usestreamingwebsocket) | WebSocket with keepalive | Bidirectional streaming |
| [`useSmoothedText`](#usesmoothedtext) | 60fps text smoothing | Premium UX |
| [`useStreamStatus`](#usestreamstatus) | Progress tracking | UI feedback |
| [`useStreamableUI`](#usestreamableui) | Vercel AI SDK compat | Generative UI |
| [`useStreamingChat`](#usestreamingchat) | High-level chat streaming | Quick setup |

**Quick Start: Basic streaming**
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // Automatic streaming!
})
```

---

## useStreaming

**Low-level primitive for handling ReadableStream data.** Foundation for all other streaming hooks.

### Signature

```typescript
function useStreaming(options?: UseStreamingOptions): UseStreamingReturn

interface UseStreamingOptions {
  /** Called for each chunk received */
  onChunk?: (chunk: string) => void
  /** Called when streaming completes */
  onComplete?: (fullText: string) => void
  /** Called on error */
  onError?: (error: Error) => void
}

interface UseStreamingReturn {
  /** Accumulated stream content */
  content: string
  /** Whether currently streaming */
  isStreaming: boolean
  /** Start streaming from a ReadableStream */
  startStreaming: (stream: ReadableStream<Uint8Array>, options?: {
    signal?: AbortSignal
  }) => Promise<void>
  /** Stop streaming */
  stopStreaming: () => void
  /** Reset content and state */
  reset: () => void
}
```

### Examples

#### Basic ReadableStream Handling

```typescript
import { useStreaming } from '@clarity-chat/react/hooks'

function StreamingDemo() {
  const {
    content,
    isStreaming,
    startStreaming,
    stopStreaming,
  } = useStreaming({
    onChunk: (chunk) => console.log('Received:', chunk),
    onComplete: (full) => console.log('Done!', full),
    onError: (err) => console.error('Error:', err),
  })

  const handleStream = async () => {
    const response = await fetch('/api/stream')

    if (!response.body) {
      throw new Error('No response body')
    }

    await startStreaming(response.body)
  }

  return (
    <div>
      <button onClick={handleStream} disabled={isStreaming}>
        Start Stream
      </button>
      <button onClick={stopStreaming} disabled={!isStreaming}>
        Cancel
      </button>
      <pre>{content}</pre>
    </div>
  )
}
```

#### With AbortController

```typescript
function CancellableStream() {
  const { startStreaming, stopStreaming } = useStreaming()
  const controllerRef = useRef<AbortController | null>(null)

  const handleStart = async () => {
    controllerRef.current = new AbortController()

    const response = await fetch('/api/stream', {
      signal: controllerRef.current.signal,
    })

    if (!response.body) return

    await startStreaming(response.body, {
      signal: controllerRef.current.signal,
    })
  }

  const handleCancel = () => {
    controllerRef.current?.abort()
    stopStreaming()
  }

  return (
    <div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}
```

### When to Use

✅ **Use `useStreaming` for:**
- Custom streaming protocols
- Low-level stream handling
- Building higher-level abstractions
- Non-SSE/WebSocket streams

❌ **Don't use for:**
- SSE/WebSocket (use specific hooks)
- Chat interfaces (use `useClarityChat`)
- If you need automatic reconnection

---

## useStreamingSSE

**Production-ready SSE streaming with automatic reconnection, authentication, and heartbeat monitoring.**

### Signature

```typescript
function useStreamingSSE(options: UseStreamingSSEOptions): UseStreamingSSEReturn

interface UseStreamingSSEOptions {
  /** SSE endpoint URL (required) */
  url: string
  /** HTTP method (default: 'GET') */
  method?: 'GET' | 'POST'
  /** Request body for POST */
  body?: any
  /** Request headers */
  headers?: Record<string, string>
  /** Auth token (auto-added to headers) */
  authToken?: string
  /** Cookie-based auth fallback (default: true) */
  useCookieFallback?: boolean
  /** Auto-reconnect (default: true) */
  autoReconnect?: boolean
  /** Max reconnection attempts (default: 5) */
  maxReconnectAttempts?: number
  /** Initial reconnect delay (default: 1000ms) */
  reconnectDelay?: number
  /** Max reconnect delay (default: 30000ms) */
  maxReconnectDelay?: number
  /** Heartbeat interval (default: 30000ms) */
  heartbeatInterval?: number
  /** Resume from last event ID (default: true) */
  resumeFromLastEventId?: boolean
  /** Auto-parse JSON (default: true) */
  autoParseJson?: boolean

  // Callbacks
  onOpen?: () => void
  onMessage?: (event: SSEEvent) => void
  onError?: (error: Error) => void
  onClose?: () => void
  onReconnecting?: (attempt: number, delay: number) => void
  onMaxReconnectAttemptsReached?: () => void
}

interface UseStreamingSSEReturn {
  /** Connection status */
  status: SSEStatus // 'idle' | 'connecting' | 'connected' | 'streaming' | 'error' | 'closed'
  /** All received events */
  events: SSEEvent[]
  /** Latest event */
  lastEvent: SSEEvent | null
  /** Accumulated data from events */
  data: string
  /** Current error */
  error: Error | undefined
  /** Connect to SSE endpoint */
  connect: () => void
  /** Disconnect */
  disconnect: () => void
  /** Reconnect (disconnect + connect) */
  reconnect: () => void
  /** Reset state */
  reset: () => void
  /** Current reconnection attempt */
  reconnectAttempt: number
  /** Whether reconnecting */
  isReconnecting: boolean
}
```

### Examples

#### OpenAI API Streaming

```typescript
import { useStreamingSSE } from '@clarity-chat/react/hooks'

function OpenAIChat() {
  const [input, setInput] = useState('')
  const {
    data,
    status,
    error,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    authToken: process.env.OPENAI_API_KEY,
    body: {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: input }],
      stream: true,
    },
    onMessage: (event) => {
      if (event.type === 'done') {
        disconnect()
      }
    },
    onError: (err) => console.error('Streaming error:', err),
  })

  const handleSend = () => {
    if (input.trim()) {
      connect()
    }
  }

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend} disabled={status !== 'idle'}>
        Send
      </button>
      <button onClick={disconnect} disabled={status === 'idle'}>
        Cancel
      </button>

      {status === 'connecting' && <Spinner />}
      {status === 'streaming' && <div>{data}</div>}
      {error && <Alert severity="error">{error.message}</Alert>}
    </div>
  )
}
```

### When to Use

✅ **Use `useStreamingSSE` for:**
- OpenAI/Anthropic API streaming
- Backend chat APIs with SSE
- One-way streaming (server → client)
- When you need automatic reconnection

❌ **Don't use for:**
- Bidirectional communication (use WebSocket)
- Chat interfaces (use `useClarityChat`)

---

## useSmoothedText

**Render streaming text at 60fps for a premium reading experience.** Eliminates jarring text jumps.

### Signature

```typescript
function useSmoothedText(
  text: string,
  options?: UseSmoothedTextOptions
): UseSmoothedTextReturn

interface UseSmoothedTextOptions {
  /** Enable smoothing (default: true) */
  enabled?: boolean
  /** Characters per frame at ~60fps (default: 2) */
  charsPerFrame?: number
  /** Frame delay in ms (default: 16 for 60fps) */
  frameDelay?: number
  /** Max buffer before speeding up (default: 100) */
  maxBuffer?: number
  /** Catch-up speed when buffer full (default: 8) */
  catchUpCharsPerFrame?: number
  /** Callback when animation completes */
  onComplete?: () => void
}

interface UseSmoothedTextReturn {
  /** The smoothly animated text to display */
  displayText: string
  /** Whether animation is running */
  isAnimating: boolean
  /** Characters still buffered */
  bufferedChars: number
  /** Skip animation, show all immediately */
  flush: () => void
  /** Reset to empty */
  reset: () => void
}
```

### Examples

```typescript
import { useSmoothedText } from '@clarity-chat/react/hooks'

function SmoothStreamingMessage({ text, isStreaming }: {
  text: string
  isStreaming: boolean
}) {
  const { displayText, isAnimating } = useSmoothedText(text, {
    enabled: isStreaming,
    charsPerFrame: 2,
  })

  return (
    <div>
      <p>{displayText}</p>
      {isAnimating && <BlinkingCursor />}
    </div>
  )
}
```

### When to Use

✅ **Use `useSmoothedText` for:**
- Streaming AI responses
- Premium reading experience
- Eliminating text jumps

❌ **Don't use for:**
- Non-streaming text
- Very short messages (<50 chars)

---

## Common Patterns

### Full Streaming Stack

```typescript
function PremiumStreamingChat() {
  const {
    progress,
    tokens,
    startStream,
    recordTokens,
    complete,
  } = useStreamStatus({ estimatedTotal: 500 })

  const {
    data,
    status,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: input },
    onMessage: (event) => {
      if (event.type === 'token_count') {
        recordTokens(event.data.count)
      } else if (event.type === 'done') {
        complete()
        disconnect()
      }
    },
  })

  const { displayText } = useSmoothedText(data, {
    enabled: status === 'streaming',
    charsPerFrame: 2,
  })

  return (
    <div>
      {/* Progress */}
      <ProgressBar value={progress} />
      <span>{tokens.tokensPerSecond} tok/s</span>

      {/* Smoothly animated text */}
      <div>{displayText}</div>
    </div>
  )
}
```

---

## Troubleshooting

**SSE connection fails immediately?**
- Check CORS headers on server
- Ensure `Content-Type: text/event-stream` header
- Verify auth token is valid

**Streaming is choppy?**
- Use `useSmoothedText` for 60fps animation
- Check `charsPerFrame` setting (try 2-4)

**Progress bar stuck at 0%?**
- Ensure you're calling `recordTokens()` as data arrives
- Check `estimatedTotal` is set correctly

**Memory leak with long streams?**
- Use `maxMessageBufferSize` to limit buffered messages
- Call `reset()` when done

[See full troubleshooting guide →](../../troubleshooting.md)

---

## Related Hooks

- [Chat Hooks →](./chat.md) - High-level chat with streaming
- [Token Hooks →](./token.md) - Token tracking and optimization

---

**Next:** [Error Handling Hooks →](./error.md)
