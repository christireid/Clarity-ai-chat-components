# Streaming Enhancements Guide

This guide documents all 13 enhancements implemented for the Clarity Chat streaming components. All enhancements are **backward compatible** with opt-in features.

## Table of Contents

- [Phase 1: Streaming & Error Handling](#phase-1-streaming--error-handling)
  - [SSE-6: Server-Suggested Retry Delays](#sse-6-server-suggested-retry-delays)
  - [STREAM-1: Timeout Support](#stream-1-timeout-support)
  - [STREAM-2: Content Length Limits](#stream-2-content-length-limits)
  - [ERROR-1: Circuit Breaker Success Tracking](#error-1-circuit-breaker-success-tracking)
  - [ERROR-2: Partial State in Retry Callbacks](#error-2-partial-state-in-retry-callbacks)
- [Phase 2: Message Delivery](#phase-2-message-delivery)
  - [DELIVERY-1: Message Deduplication](#delivery-1-message-deduplication)
  - [DELIVERY-3: Buffer Overflow Notifications](#delivery-3-buffer-overflow-notifications)
  - [DELIVERY-4: Sequence Number Validation](#delivery-4-sequence-number-validation)
  - [DELIVERY-5: WebSocket Acknowledgments](#delivery-5-websocket-acknowledgments)
- [Phase 3: Network Resilience](#phase-3-network-resilience)
  - [RECONNECT-1: Connection ID Tracking](#reconnect-1-connection-id-tracking)
  - [RECONNECT-2: Sustained Success Threshold](#reconnect-2-sustained-success-threshold)
  - [RECONNECT-3: Heartbeat Jitter](#reconnect-3-heartbeat-jitter)

---

## Phase 1: Streaming & Error Handling

### SSE-6: Server-Suggested Retry Delays

**Purpose**: Honor server-suggested retry delays from SSE `retry:` field per SSE specification.

**Hook**: `useStreamingSSE`

**How it works**:
- Parses `retry:` field from SSE events
- Stores server-suggested delay across connections
- Uses server delay on successful connection instead of default

**Usage**:
```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function ChatComponent() {
  const stream = useStreamingSSE({
    url: '/api/chat',
    // Server-suggested retries are automatically honored
    // If server sends "retry: 5000", that delay will be used
    reconnectDelay: 1000, // Fallback if server doesn't suggest
  })

  return <div>{stream.data}</div>
}
```

**Server-side example**:
```javascript
// Server can suggest retry delay
res.write('retry: 5000\n') // Suggest 5 second retry
res.write('data: Hello\n\n')
```

**Benefits**:
- Server controls reconnection timing during maintenance
- Different retry strategies for different endpoints
- Compliant with SSE specification

---

### STREAM-1: Timeout Support

**Purpose**: Add configurable timeouts to prevent indefinite streaming operations.

**Hook**: `useStreaming`

**New Options**:
- `timeout?: number` - Timeout in milliseconds (default: none)
- `onTimeout?: () => void` - Called when timeout occurs

**Usage**:
```tsx
import { useStreaming } from '@clarity-chat/react'

function StreamingComponent() {
  const { startStreaming, stopStreaming } = useStreaming({
    // Abort streaming after 30 seconds
    timeout: 30000,

    onTimeout: () => {
      console.warn('Streaming timed out after 30s')
      // Show user notification
    },

    onChunk: (chunk) => {
      console.log('Received:', chunk)
    },

    onError: (error) => {
      // Timeout errors will also trigger this
      console.error('Stream error:', error)
    }
  })

  const handleStart = async () => {
    const response = await fetch('/api/stream')
    await startStreaming(response.body!)
  }

  return (
    <button onClick={handleStart}>Start Stream</button>
  )
}
```

**Benefits**:
- Prevents resource leaks from stalled streams
- Better user experience with defined timeout behavior
- Complements connection-level timeouts

---

### STREAM-2: Content Length Limits

**Purpose**: Prevent unbounded memory growth from extremely large streaming responses.

**Hook**: `useStreaming`

**New Options**:
- `maxContentLength?: number` - Maximum characters (default: none)
- `onContentLimitExceeded?: (currentLength, limit) => void` - Called when limit exceeded

**Usage**:
```tsx
import { useStreaming } from '@clarity-chat/react'

function ChatWithLimits() {
  const { startStreaming } = useStreaming({
    // Limit response to 100KB of text (roughly 100,000 characters)
    maxContentLength: 100000,

    onContentLimitExceeded: (current, limit) => {
      console.warn(`Content exceeded limit: ${current} > ${limit}`)
      alert('Response too large, stream aborted')
    },

    onComplete: (fullText) => {
      console.log('Received:', fullText.length, 'characters')
    }
  })

  return <div>...</div>
}
```

**Benefits**:
- Protects against memory exhaustion
- Graceful handling of oversized responses
- Configurable per use case

---

### ERROR-1: Circuit Breaker Success Tracking

**Purpose**: Only close circuit breaker after sustained success, preventing premature recovery.

**Hook**: `useStreamingError`

**New Options**:
- `circuitBreakerSuccessThreshold?: number` - Consecutive successes needed (default: 3)
- `onCircuitClose?: () => void` - Called when circuit closes after recovery

**New Return Values**:
- `successCount: number` - Current consecutive success count

**Usage**:
```tsx
import { useStreamingError } from '@clarity-chat/error-handling'

function ResilientChat() {
  const {
    handleStreamError,
    retry,
    circuitState,
    successCount,
  } = useStreamingError({
    circuitBreakerThreshold: 5,      // Open after 5 failures
    circuitBreakerSuccessThreshold: 3, // Close after 3 successes

    onCircuitOpen: () => {
      console.log('Circuit opened - too many failures')
      showNotification('Service temporarily unavailable')
    },

    onCircuitClose: () => {
      console.log('Circuit closed - service recovered')
      showNotification('Service restored')
    },

    onRetry: (attempt, partialState) => {
      console.log(`Retry attempt ${attempt}`)
    }
  })

  return (
    <div>
      <div>Circuit: {circuitState}</div>
      <div>Consecutive Successes: {successCount}/3</div>
      {circuitState === 'half-open' && (
        <div>Testing recovery... {successCount} successful</div>
      )}
    </div>
  )
}
```

**State Transitions**:
```
closed -> open (after 5 failures)
open -> half-open (after reset time)
half-open -> closed (after 3 consecutive successes)
half-open -> open (on any failure)
```

**Benefits**:
- Prevents flapping between open/closed states
- More robust recovery verification
- Reduces unnecessary reconnection attempts

---

### ERROR-2: Partial State in Retry Callbacks

**Purpose**: Automatically pass partial content and event IDs to retry callbacks for seamless resumption.

**Hook**: `useStreamingError`

**Updated Signature**:
```typescript
onRetry?: (attempt: number, partialState?: ResumePayload) => void

interface ResumePayload {
  partialContent?: string
  lastEventId?: string
  tokenCount?: number
}
```

**Usage**:
```tsx
import { useStreamingError } from '@clarity-chat/error-handling'

function ResumableChat() {
  const [messages, setMessages] = useState('')
  const [lastEventId, setLastEventId] = useState('')

  const {
    handleStreamError,
    setRetryCallback,
  } = useStreamingError({
    maxRetries: 3,

    // Partial state is now automatically passed
    onRetry: (attempt, partialState) => {
      if (partialState) {
        console.log('Resuming from:', {
          contentLength: partialState.partialContent?.length,
          lastEvent: partialState.lastEventId
        })
      }
    }
  })

  const startStream = useCallback(async (resumePayload?: ResumePayload) => {
    try {
      const headers: Record<string, string> = {}

      // Use partial state for resumption
      if (resumePayload?.lastEventId) {
        headers['Last-Event-ID'] = resumePayload.lastEventId
      }

      const response = await fetch('/api/chat', { headers })
      // ... process stream

    } catch (err) {
      // Automatically includes partial state
      handleStreamError(err, {
        partialContent: messages,
        lastEventId: lastEventId
      })
    }
  }, [messages, lastEventId, handleStreamError])

  useEffect(() => {
    setRetryCallback(startStream)
  }, [startStream, setRetryCallback])

  return <div>{messages}</div>
}
```

**Benefits**:
- Automatic state preservation across retries
- Cleaner retry logic
- Works seamlessly with SSE resumption

---

## Phase 2: Message Delivery

### DELIVERY-1: Message Deduplication

**Purpose**: Detect and filter duplicate messages using IDs or content hashing.

**New Utilities**:
- `MessageDeduplicator` class
- `useMessageDeduplicator` React hook

**Usage - Class API**:
```tsx
import { MessageDeduplicator } from '@clarity-chat/react'

const deduplicator = new MessageDeduplicator({
  maxTrackedIds: 500,        // LRU cache size
  ttlMs: 300000,             // 5 minutes TTL
  useContentHash: false,     // Use content hashing for messages without IDs
})

// Check if message is duplicate
const message = { id: 'msg-123', data: { text: 'Hello' } }
if (!deduplicator.isDuplicate(message)) {
  deduplicator.markSeen(message)
  processMessage(message)
}

// Or filter array
const uniqueMessages = deduplicator.filterDuplicates(messages)
```

**Usage - React Hook**:
```tsx
import { useMessageDeduplicator } from '@clarity-chat/react'

function ChatWithDedup() {
  const [messages, setMessages] = useState([])
  const deduplicator = useMessageDeduplicator({
    maxTrackedIds: 500,
    ttlMs: 300000,
  })

  const handleMessage = (msg) => {
    if (!deduplicator.isDuplicate(msg)) {
      deduplicator.markSeen(msg)
      setMessages(prev => [...prev, msg])
    } else {
      console.log('Duplicate message ignored:', msg.id)
    }
  }

  return <div>...</div>
}
```

**Content Hashing (for messages without IDs)**:
```tsx
const deduplicator = new MessageDeduplicator({
  useContentHash: true,
  // Optional custom hash function
  hashFn: (data) => {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
  }
})
```

**Benefits**:
- Prevents duplicate message rendering
- LRU cache prevents unbounded memory growth
- TTL automatically removes old IDs
- Supports both ID-based and content-based deduplication

---

### DELIVERY-3: Buffer Overflow Notifications

**Purpose**: Notify application when message/event buffers overflow.

**Hooks**: `useStreamingSSE`, `useStreamingWebSocket`

**New Options**:
- SSE: `onEventBufferOverflow?: (droppedCount, bufferSize) => void`
- WebSocket: `onMessageBufferOverflow?: (droppedCount, bufferSize) => void`

**Usage - SSE**:
```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function SSEMonitoring() {
  const stream = useStreamingSSE({
    url: '/api/events',
    maxEventBufferSize: 1000,

    onEventBufferOverflow: (dropped, size) => {
      console.warn(`Event buffer overflow: dropped ${dropped} events`)

      // Send telemetry
      analytics.track('buffer_overflow', {
        dropped,
        bufferSize: size,
        component: 'chat'
      })

      // Increase buffer size if this happens frequently
      if (dropped > 100) {
        showWarning('High message volume detected')
      }
    }
  })

  return <div>...</div>
}
```

**Usage - WebSocket**:
```tsx
import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketMonitoring() {
  const ws = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    maxMessageBufferSize: 1000,

    onMessageBufferOverflow: (dropped, size) => {
      console.warn(`Message buffer overflow: dropped ${dropped} messages`)

      // Alert operations team
      if (dropped > 50) {
        sendAlert('High message volume in chat')
      }
    }
  })

  return <div>...</div>
}
```

**Benefits**:
- Visibility into buffer health
- Early warning for performance issues
- Enables dynamic buffer sizing
- Production monitoring and alerting

---

### DELIVERY-4: Sequence Number Validation

**Purpose**: Detect gaps, reordering, and duplicates in sequenced message streams.

**New Utilities**:
- `SequenceValidator` class
- `useSequenceValidator` React hook

**Usage - Class API**:
```tsx
import { SequenceValidator } from '@clarity-chat/react'

const validator = new SequenceValidator({
  initialSeq: 0,
  autoResync: true, // Continue from new sequence after gap

  onGap: (result) => {
    console.warn(`Missing ${result.gapSize} messages: expected ${result.expected}, got ${result.actual}`)
    requestMissingMessages(result.expected, result.actual)
  },

  onDuplicate: (result) => {
    console.warn(`Duplicate message: seq ${result.actual}`)
  },

  onReorder: (result) => {
    console.warn(`Out of order: expected ${result.expected}, got ${result.actual}`)
  }
})

// Validate each message
messages.forEach(msg => {
  const result = validator.validate(msg)
  if (result.valid) {
    processMessage(msg)
  }
})
```

**Usage - React Hook**:
```tsx
import { useSequenceValidator } from '@clarity-chat/react'

function SequencedChat() {
  const [messages, setMessages] = useState([])
  const [gapCount, setGapCount] = useState(0)

  const validator = useSequenceValidator({
    initialSeq: 1, // 1-based sequence
    autoResync: true,

    onGap: (result) => {
      setGapCount(c => c + 1)
      console.warn(`Gap detected: missing ${result.gapSize} messages`)

      // Request missing messages from server
      fetch(`/api/messages/range?from=${result.expected}&to=${result.actual - 1}`)
        .then(res => res.json())
        .then(missing => {
          setMessages(prev => [...prev, ...missing].sort((a, b) => a.seq - b.seq))
        })
    }
  })

  const handleMessage = (msg) => {
    const result = validator.validate(msg)

    if (result.valid) {
      setMessages(prev => [...prev, msg])
    } else {
      console.warn('Sequence issue:', result.issue)
    }
  }

  return (
    <div>
      <div>Messages: {messages.length}</div>
      <div>Gaps Detected: {gapCount}</div>
      <div>Next Expected: {validator.getExpected()}</div>
    </div>
  )
}
```

**Validation Results**:
```typescript
interface SequenceValidationResult {
  valid: boolean
  issue?: 'duplicate' | 'gap' | 'reorder'
  expected: number
  actual: number
  gapSize?: number  // Only for gaps
}
```

**Benefits**:
- Detects message loss in unreliable networks
- Identifies reordering (rare but possible)
- Enables gap filling from server
- Critical for financial/medical applications

---

### DELIVERY-5: WebSocket Acknowledgments

**Purpose**: Send automatic acknowledgments for messages requiring confirmation.

**Hook**: `useStreamingWebSocket`

**New Options**:
- `enableAcknowledgment?: boolean` - Enable ack support (default: false)
- `ackMessageType?: string` - Ack message type (default: 'ack')
- `onAcknowledgmentSent?: (messageId) => void` - Called when ack sent

**Usage**:
```tsx
import { useStreamingWebSocket } from '@clarity-chat/react'

function AcknowledgedChat() {
  const ws = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',

    // Enable acknowledgments for messages with 'id' field
    enableAcknowledgment: true,
    ackMessageType: 'ack', // Customize if needed

    onAcknowledgmentSent: (messageId) => {
      console.log('Acknowledged message:', messageId)
    },

    onMessage: (message) => {
      // Messages with 'id' field are automatically acknowledged
      console.log('Received:', message.data)
    }
  })

  return <div>...</div>
}
```

**Server-side handling**:
```javascript
// Server tracks unacknowledged messages
const pendingMessages = new Map()

// Send message with ID
ws.send(JSON.stringify({
  id: 'msg-123',
  type: 'message',
  content: 'Hello'
}))
pendingMessages.set('msg-123', { content: 'Hello', timestamp: Date.now() })

// Handle acknowledgments
ws.on('message', (data) => {
  const msg = JSON.parse(data)

  if (msg.type === 'ack') {
    console.log('Message acknowledged:', msg.id)
    pendingMessages.delete(msg.id)
  }
})

// Resend unacknowledged messages after timeout
setInterval(() => {
  const now = Date.now()
  for (const [id, msg] of pendingMessages) {
    if (now - msg.timestamp > 5000) {
      // Resend after 5 seconds
      ws.send(JSON.stringify({ id, ...msg }))
    }
  }
}, 1000)
```

**Acknowledgment format**:
```json
{
  "type": "ack",
  "id": "msg-123"
}
```

**Benefits**:
- Reliable message delivery tracking
- Enables server-side retry logic
- Critical for transactional messages
- Complements at-least-once delivery

---

## Phase 3: Network Resilience

### RECONNECT-1: Connection ID Tracking

**Purpose**: Prevent mount/unmount races from affecting active connections.

**Hooks**: `useStreamingSSE`, `useStreamingWebSocket`

**How it works**:
- Increments connection ID on each connect attempt
- Checks connection ID before state updates
- Stale connections are ignored

**No Configuration Required** - Automatically enabled.

**What it prevents**:
```tsx
// Problematic scenario (now prevented):
function ChatComponent() {
  const stream = useStreamingSSE({ url: '/api/chat' })

  // User rapidly navigates away and back
  // Old connection completes after new connection starts
  // Without connection ID: old connection could overwrite new state
  // With connection ID: old connection updates are ignored ✅

  return <div>{stream.data}</div>
}
```

**Benefits**:
- Prevents race conditions in React Strict Mode
- Safe during rapid navigation
- Eliminates stale state updates
- No performance overhead

---

### RECONNECT-2: Sustained Success Threshold

**Purpose**: Only reset exponential backoff after sustained successful connection.

**Hooks**: `useStreamingSSE`, `useStreamingWebSocket`

**New Option**:
- `reconnectSuccessThreshold?: number` - Consecutive successes needed (default: 3)

**Usage**:
```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function StableReconnection() {
  const stream = useStreamingSSE({
    url: '/api/chat',

    // Only reset backoff after 5 consecutive successful connections
    reconnectSuccessThreshold: 5,

    // Standard reconnection settings
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
  })

  return <div>...</div>
}
```

**Behavior**:
```
Connection 1: Success (count: 1/3) - Backoff still at 2s
Connection 2: Success (count: 2/3) - Backoff still at 2s
Connection 3: Success (count: 3/3) - Backoff reset to 1s ✅
Connection 4: Fail - Backoff increases to 2s, count reset to 0
```

**Benefits**:
- Prevents reconnection storms
- Waits for stability before resetting backoff
- Reduces server load during intermittent issues
- More robust recovery detection

---

### RECONNECT-3: Heartbeat Jitter

**Purpose**: Add ±10% randomization to heartbeat intervals to prevent synchronized traffic.

**Hooks**: `useStreamingSSE`, `useStreamingWebSocket`

**How it works**:
- Adds random ±10% jitter to each heartbeat
- SSE: Applied to heartbeat timeout
- WebSocket: Recursive setTimeout with per-beat jitter

**No Configuration Required** - Automatically enabled.

**Impact**:
```
Without jitter (1000 clients, 30s interval):
All clients ping at: 0s, 30s, 60s, 90s... (spike!)

With ±10% jitter (1000 clients, 30s interval):
Clients ping between:
  Client 1: 27s, 57.5s, 86s...
  Client 2: 32s, 61s, 92s...
  Client 3: 28.5s, 59s, 88s...
  ...spread over 27s-33s range (smooth load)
```

**Benefits**:
- Prevents "thundering herd" problem
- Reduces server load spikes
- Better resource utilization
- No user-visible impact

---

## Migration Guide

All enhancements are **backward compatible**. Existing code continues to work unchanged.

### Opt-in Strategy

**Minimal Migration** (no changes needed):
```tsx
// Existing code works as-is
const stream = useStreamingSSE({ url: '/api/chat' })
```

**Gradual Enhancement** (add features as needed):
```tsx
// Add timeout for long-running streams
const stream = useStreamingSSE({
  url: '/api/chat',
  timeout: 60000, // NEW: 60 second timeout
})
```

**Full Enhancement** (maximum reliability):
```tsx
import {
  useStreamingSSE,
  useMessageDeduplicator,
  useSequenceValidator
} from '@clarity-chat/react'
import { useStreamingError } from '@clarity-chat/error-handling'

function EnhancedChat() {
  const [messages, setMessages] = useState([])

  // Deduplication
  const deduplicator = useMessageDeduplicator({
    maxTrackedIds: 500,
    ttlMs: 300000,
  })

  // Sequence validation
  const validator = useSequenceValidator({
    initialSeq: 0,
    onGap: (result) => {
      console.warn(`Gap: missing ${result.gapSize} messages`)
    }
  })

  // Error handling with circuit breaker
  const {
    handleStreamError,
    setRetryCallback,
    circuitState,
    successCount,
  } = useStreamingError({
    circuitBreakerSuccessThreshold: 3,
    onCircuitClose: () => {
      console.log('Service recovered')
    }
  })

  // Streaming with all enhancements
  const stream = useStreamingSSE({
    url: '/api/chat',

    // Phase 1 enhancements
    reconnectSuccessThreshold: 3, // RECONNECT-2
    // Server-suggested retries (SSE-6) automatic
    // Connection ID (RECONNECT-1) automatic
    // Heartbeat jitter (RECONNECT-3) automatic

    // Buffer monitoring
    maxEventBufferSize: 1000,
    onEventBufferOverflow: (dropped, size) => {
      console.warn(`Buffer overflow: ${dropped} events dropped`)
    },

    onMessage: (event) => {
      const msg = event.data

      // DELIVERY-1: Deduplication
      if (deduplicator.isDuplicate(msg)) {
        return
      }
      deduplicator.markSeen(msg)

      // DELIVERY-4: Sequence validation
      if (msg.seq) {
        const result = validator.validate(msg)
        if (!result.valid) {
          console.warn('Sequence issue:', result.issue)
          return
        }
      }

      setMessages(prev => [...prev, msg])
    },

    onError: (error) => {
      handleStreamError(error, {
        partialContent: messages.map(m => m.text).join(''),
        lastEventId: stream.lastEvent?.id
      })
    }
  })

  useEffect(() => {
    setRetryCallback(() => {
      stream.connect()
    })
  }, [stream, setRetryCallback])

  return (
    <div>
      <div>Circuit: {circuitState} (successes: {successCount})</div>
      <div>Messages: {messages.length}</div>
    </div>
  )
}
```

---

## Performance Considerations

### Memory Usage

**Deduplication**:
- LRU cache limited by `maxTrackedIds` (default: 1000)
- TTL automatically removes old entries
- Minimal overhead: ~50 bytes per tracked ID

**Sequence Validation**:
- Stateless (only tracks expected sequence number)
- Negligible memory: ~16 bytes

**Success Tracking**:
- Single integer counter
- Negligible memory: ~4 bytes

### CPU Usage

**Heartbeat Jitter**:
- Math.random() per heartbeat
- Negligible CPU: <0.001ms per beat

**Content Hashing** (optional):
- FNV-1a: ~10µs per KB
- Only when `useContentHash: true`

### Network Usage

**Acknowledgments**:
- ~20 bytes per message acknowledged
- Only when `enableAcknowledgment: true`

---

## Best Practices

### 1. Start Conservative
```tsx
// Begin with defaults
const stream = useStreamingSSE({ url: '/api/chat' })
```

### 2. Add Monitoring
```tsx
// Add buffer overflow monitoring in production
const stream = useStreamingSSE({
  url: '/api/chat',
  onEventBufferOverflow: (dropped, size) => {
    analytics.track('buffer_overflow', { dropped, size })
  }
})
```

### 3. Enable Critical Features
```tsx
// For critical applications, enable deduplication and sequencing
const deduplicator = useMessageDeduplicator()
const validator = useSequenceValidator()
```

### 4. Tune Circuit Breaker
```tsx
// Adjust thresholds based on your service reliability
const error = useStreamingError({
  circuitBreakerThreshold: 5,          // Open after 5 failures
  circuitBreakerSuccessThreshold: 3,   // Close after 3 successes
  circuitBreakerResetTime: 30000,      // Try recovery after 30s
})
```

### 5. Monitor in Production
```tsx
// Set up comprehensive monitoring
const stream = useStreamingSSE({
  url: '/api/chat',

  onEventBufferOverflow: (dropped, size) => {
    metrics.increment('buffer.overflow', { dropped })
  },

  onError: (error) => {
    metrics.increment('stream.error', {
      code: error.code,
      recoverable: error.recoverable
    })
  },

  onReconnecting: (attempt, delay) => {
    metrics.timing('reconnect.delay', delay)
    metrics.increment('reconnect.attempt', { attempt })
  }
})
```

---

## Troubleshooting

### Buffer Overflows

**Symptom**: `onEventBufferOverflow` / `onMessageBufferOverflow` firing frequently

**Solutions**:
1. Increase buffer size: `maxEventBufferSize: 2000`
2. Process messages faster (optimize rendering)
3. Implement pagination or virtual scrolling
4. Reduce message frequency on server

### Circuit Breaker Flapping

**Symptom**: Circuit opening and closing rapidly

**Solutions**:
1. Increase success threshold: `circuitBreakerSuccessThreshold: 5`
2. Increase reset time: `circuitBreakerResetTime: 60000`
3. Add exponential backoff to retries
4. Investigate root cause of failures

### Sequence Gaps

**Symptom**: `onGap` firing frequently

**Solutions**:
1. Check network stability
2. Increase buffer sizes
3. Implement gap filling from server
4. Use WebSocket instead of SSE (if supported)

### High Memory Usage

**Symptom**: Memory grows over time

**Solutions**:
1. Reduce deduplicator TTL: `ttlMs: 60000` (1 minute)
2. Reduce tracked IDs: `maxTrackedIds: 500`
3. Disable content hashing: `useContentHash: false`
4. Clear messages periodically: `stream.reset()`

---

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/clarity-chat/components/issues
- Documentation: https://clarity-chat.dev/docs/streaming
- Community: https://discord.gg/clarity-chat
