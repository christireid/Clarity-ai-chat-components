# Enhancements Quick Reference

Quick lookup for all 13 implemented streaming enhancements.

## useStreamingSSE

### New Options

```typescript
interface UseStreamingSSEOptions {
  // RECONNECT-2: Sustained success before backoff reset
  reconnectSuccessThreshold?: number // default: 3

  // DELIVERY-3: Buffer overflow notification
  onEventBufferOverflow?: (droppedCount: number, bufferSize: number) => void

  // SSE-6: Server-suggested retry (automatic, no config needed)
  // RECONNECT-1: Connection ID tracking (automatic)
  // RECONNECT-3: Heartbeat jitter ±10% (automatic)
}
```

### Examples

```tsx
// Enable buffer overflow monitoring
const stream = useStreamingSSE({
  url: '/api/chat',
  onEventBufferOverflow: (dropped, size) => {
    console.warn(`Dropped ${dropped} events from buffer of ${size}`)
  }
})

// Increase sustained success threshold
const stream = useStreamingSSE({
  url: '/api/chat',
  reconnectSuccessThreshold: 5 // Need 5 consecutive successes
})
```

---

## useStreamingWebSocket

### New Options

```typescript
interface UseStreamingWebSocketOptions {
  // RECONNECT-2: Sustained success before backoff reset
  reconnectSuccessThreshold?: number // default: 3

  // DELIVERY-3: Buffer overflow notification
  onMessageBufferOverflow?: (droppedCount: number, bufferSize: number) => void

  // DELIVERY-5: Acknowledgment support
  enableAcknowledgment?: boolean // default: false
  ackMessageType?: string // default: 'ack'
  onAcknowledgmentSent?: (messageId: string) => void

  // RECONNECT-1: Connection ID tracking (automatic)
  // RECONNECT-3: Heartbeat jitter ±10% (automatic)
}
```

### Examples

```tsx
// Enable acknowledgments for critical messages
const ws = useStreamingWebSocket({
  url: 'wss://api.example.com/chat',
  enableAcknowledgment: true,
  onAcknowledgmentSent: (id) => {
    console.log('Acknowledged:', id)
  }
})

// Monitor buffer health
const ws = useStreamingWebSocket({
  url: 'wss://api.example.com/chat',
  maxMessageBufferSize: 1000,
  onMessageBufferOverflow: (dropped, size) => {
    analytics.track('buffer_overflow', { dropped, size })
  }
})
```

---

## useStreaming

### New Options

```typescript
interface UseStreamingOptions {
  // STREAM-1: Timeout support
  timeout?: number // milliseconds
  onTimeout?: () => void

  // STREAM-2: Content length limits
  maxContentLength?: number // characters
  onContentLimitExceeded?: (currentLength: number, limit: number) => void
}
```

### Examples

```tsx
// Add 30 second timeout
const { startStreaming } = useStreaming({
  timeout: 30000,
  onTimeout: () => {
    alert('Stream timed out')
  }
})

// Limit content to 100KB
const { startStreaming } = useStreaming({
  maxContentLength: 100000,
  onContentLimitExceeded: (current, limit) => {
    console.warn(`Exceeded: ${current} > ${limit}`)
  }
})
```

---

## useStreamingError

### New Options

```typescript
interface UseStreamingErrorOptions {
  // ERROR-1: Circuit breaker success tracking
  circuitBreakerSuccessThreshold?: number // default: 3
  onCircuitClose?: () => void

  // ERROR-2: Partial state in retry callbacks
  onRetry?: (attempt: number, partialState?: ResumePayload) => void
}
```

### New Return Values

```typescript
interface UseStreamingErrorReturn {
  // ERROR-1: Success count tracking
  successCount: number
}
```

### Examples

```tsx
// Track circuit breaker recovery
const { circuitState, successCount } = useStreamingError({
  circuitBreakerSuccessThreshold: 3,
  onCircuitClose: () => {
    console.log('Circuit closed after recovery')
  }
})

console.log(`Circuit: ${circuitState}, Successes: ${successCount}`)

// Use partial state in retries
const { handleStreamError } = useStreamingError({
  onRetry: (attempt, partialState) => {
    if (partialState?.lastEventId) {
      console.log('Resuming from:', partialState.lastEventId)
    }
  }
})

// Pass partial state when handling errors
handleStreamError(error, {
  partialContent: currentText,
  lastEventId: lastId
})
```

---

## MessageDeduplicator

### New Class

```typescript
class MessageDeduplicator<T> {
  constructor(options?: {
    maxTrackedIds?: number      // default: 1000
    ttlMs?: number               // default: 300000 (5 min)
    useContentHash?: boolean     // default: false
    hashFn?: (data: unknown) => string
  })

  isDuplicate(message: DeduplicatableMessage<T>): boolean
  markSeen(message: DeduplicatableMessage<T>): void
  filterDuplicates(messages: DeduplicatableMessage<T>[]): DeduplicatableMessage<T>[]
  clear(): void
  getTrackedCount(): number
}

interface DeduplicatableMessage<T> {
  id?: string
  data: T
  timestamp?: number
}
```

### Examples

```tsx
// Class API
import { MessageDeduplicator } from '@clarity-chat/react'

const deduplicator = new MessageDeduplicator({
  maxTrackedIds: 500,
  ttlMs: 300000
})

if (!deduplicator.isDuplicate(message)) {
  deduplicator.markSeen(message)
  processMessage(message)
}

// React Hook
import { useMessageDeduplicator } from '@clarity-chat/react'

const deduplicator = useMessageDeduplicator({
  maxTrackedIds: 500
})

const handleMessage = (msg) => {
  if (!deduplicator.isDuplicate(msg)) {
    deduplicator.markSeen(msg)
    setMessages(prev => [...prev, msg])
  }
}

// Filter array
const uniqueMessages = deduplicator.filterDuplicates(messages)
```

---

## SequenceValidator

### New Class

```typescript
class SequenceValidator<T> {
  constructor(options?: {
    initialSeq?: number          // default: 0
    autoResync?: boolean         // default: true
    onGap?: (result: SequenceValidationResult) => void
    onDuplicate?: (result: SequenceValidationResult) => void
    onReorder?: (result: SequenceValidationResult) => void
  })

  validate(message: SequencedMessage<T>): SequenceValidationResult
  reset(initialSeq?: number): void
  getExpected(): number
  getLast(): number | null
  setExpected(seq: number): void
}

interface SequencedMessage<T> {
  seq: number
  data: T
}

interface SequenceValidationResult {
  valid: boolean
  issue?: 'duplicate' | 'gap' | 'reorder'
  expected: number
  actual: number
  gapSize?: number
}
```

### Examples

```tsx
// Class API
import { SequenceValidator } from '@clarity-chat/react'

const validator = new SequenceValidator({
  initialSeq: 0,
  onGap: (result) => {
    console.warn(`Gap: missing ${result.gapSize} messages`)
  }
})

const result = validator.validate(message)
if (result.valid) {
  processMessage(message)
}

// React Hook
import { useSequenceValidator } from '@clarity-chat/react'

const validator = useSequenceValidator({
  initialSeq: 1,
  onGap: (result) => {
    requestMissingMessages(result.expected, result.actual)
  },
  onDuplicate: (result) => {
    console.warn('Duplicate:', result.actual)
  }
})

const handleMessage = (msg) => {
  const result = validator.validate(msg)
  if (result.valid) {
    setMessages(prev => [...prev, msg])
  }
}
```

---

## Default Values Summary

| Enhancement | Option | Default |
|------------|--------|---------|
| RECONNECT-2 | `reconnectSuccessThreshold` | 3 |
| STREAM-1 | `timeout` | none (disabled) |
| STREAM-2 | `maxContentLength` | none (disabled) |
| ERROR-1 | `circuitBreakerSuccessThreshold` | 3 |
| DELIVERY-1 | `maxTrackedIds` | 1000 |
| DELIVERY-1 | `ttlMs` | 300000 (5 min) |
| DELIVERY-1 | `useContentHash` | false |
| DELIVERY-4 | `initialSeq` | 0 |
| DELIVERY-4 | `autoResync` | true |
| DELIVERY-5 | `enableAcknowledgment` | false |
| DELIVERY-5 | `ackMessageType` | 'ack' |
| RECONNECT-3 | Heartbeat jitter | ±10% (always on) |
| RECONNECT-1 | Connection ID | (always on) |
| SSE-6 | Server retry | (always on) |

---

## Automatic Features (No Config)

These enhancements are **always active** and require no configuration:

- **SSE-6**: Server-suggested retry delays automatically honored
- **RECONNECT-1**: Connection ID tracking prevents mount/unmount races
- **RECONNECT-3**: ±10% heartbeat jitter reduces synchronized traffic

---

## Common Patterns

### Basic Enhancement
```tsx
// Just add timeout
const stream = useStreamingSSE({
  url: '/api/chat',
  timeout: 60000 // 60 seconds
})
```

### Production Monitoring
```tsx
const stream = useStreamingSSE({
  url: '/api/chat',
  onEventBufferOverflow: (dropped, size) => {
    analytics.track('buffer_overflow', { dropped, size })
  }
})
```

### Mission-Critical
```tsx
import {
  useStreamingWebSocket,
  useMessageDeduplicator,
  useSequenceValidator
} from '@clarity-chat/react'

const deduplicator = useMessageDeduplicator()
const validator = useSequenceValidator({
  onGap: (result) => {
    requestMissingMessages(result.expected, result.actual)
  }
})

const ws = useStreamingWebSocket({
  url: 'wss://api.example.com/critical',
  enableAcknowledgment: true,
  reconnectSuccessThreshold: 5,
  onMessageBufferOverflow: (dropped, size) => {
    alertOps('buffer_overflow', { dropped, size })
  },
  onMessage: (message) => {
    if (deduplicator.isDuplicate(message)) return
    deduplicator.markSeen(message)

    const result = validator.validate(message)
    if (result.valid) {
      processMessage(message)
    }
  }
})
```

---

## Migration Checklist

- [ ] Review new options for your hooks
- [ ] Add buffer overflow monitoring in production
- [ ] Enable deduplication for critical streams
- [ ] Add sequence validation for ordered messages
- [ ] Configure circuit breaker thresholds
- [ ] Add timeouts for long-running streams
- [ ] Enable acknowledgments for WebSocket (if needed)
- [ ] Update monitoring and alerting
- [ ] Test with various network conditions
- [ ] Document your configuration choices

---

## TypeScript Support

All enhancements have full TypeScript support:

```tsx
import type {
  MessageDeduplicator,
  DeduplicatableMessage,
  MessageDeduplicatorOptions,
  SequenceValidator,
  SequencedMessage,
  SequenceValidationResult,
  SequenceValidatorOptions,
  ResumePayload,
} from '@clarity-chat/react'

import type {
  UseStreamingErrorOptions,
  UseStreamingErrorReturn,
} from '@clarity-chat/error-handling'
```

---

## See Also

- [Complete Enhancements Guide](./ENHANCEMENTS_GUIDE.md) - Detailed documentation
- [Streaming Audit Report](./STREAMING_AUDIT_REPORT.md) - Full audit findings
- [PR Description](./PR_DESCRIPTION.md) - Overview and achievements
