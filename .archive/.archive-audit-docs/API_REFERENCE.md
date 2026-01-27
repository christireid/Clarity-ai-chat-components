# useClarityChat API Reference

Complete API reference for the `useClarityChat` hook.

## Hook Signature

```typescript
function useClarityChat(
  options?: UseClarityChatOptions
): UseClarityChatReturn
```

## Options

### UseClarityChatOptions

Extends `UseChatEnhancedOptions` (Vercel AI SDK compatible) with Clarity-specific options.

#### Standard Options (Vercel AI SDK Compatible)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `api` | `string` | - | API endpoint URL for chat requests |
| `id` | `string` | - | Unique chat session ID |
| `initialMessages` | `CoreMessage[]` | `[]` | Initial messages to populate chat |
| `onFinish` | `(message: CoreMessage) => void \| Promise<void>` | - | Callback when message stream completes |
| `onError` | `(error: Error) => void` | - | Error handler callback |
| `headers` | `Record<string, string>` | `{}` | Custom headers for API requests |
| `body` | `Record<string, any>` | `{}` | Additional body parameters |
| `credentials` | `RequestCredentials` | `'same-origin'` | Fetch credentials mode |
| `keepLastMessage` | `boolean` | `false` | Keep last message on error |

#### Clarity-Specific Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `memory` | `ClarityMemoryOptions \| undefined` | `undefined` | Memory configuration |
| `transport` | `'sse' \| 'websocket'` | `'sse'` | Transport protocol |
| `userId` | `string` | - | User ID for memory context |
| `threadId` | `string` | - | Thread ID for conversation tracking |

### ClarityMemoryOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable memory integration |
| `strategy` | `'sliding-window' \| 'semantic-chunks' \| 'vector-store'` | `'sliding-window'` | Memory retrieval strategy |
| `maxTokens` | `number` | `4000` | Maximum tokens for memory context |
| `autoCapture` | `boolean` | `true` | Automatically capture messages to memory |

## Return Value

### UseClarityChatReturn

Extends `UseChatEnhancedReturn` with Clarity-specific additions.

#### Standard Properties

| Property | Type | Description |
|----------|------|-------------|
| `messages` | `CoreMessage[]` | Array of chat messages |
| `append` | `(message: CoreMessage \| Pick<CoreMessage, 'role' \| 'content'>, options?: { data?: Record<string, any> }) => Promise<void>` | Append a message to chat |
| `setInput` | `(input: string) => void` | Set input field value |
| `handleSubmit` | `(e: React.FormEvent<HTMLFormElement>) => void` | Handle form submission |
| `input` | `string` | Current input value |
| `isLoading` | `boolean` | Loading state |
| `error` | `Error \| undefined` | Current error, if any |
| `stop` | `() => void` | Stop current stream |
| `reload` | `() => void` | Reload last message |
| `setMessages` | `(messages: CoreMessage[]) => void` | Replace all messages |

#### Clarity-Specific Properties

| Property | Type | Description |
|----------|------|-------------|
| `memoryEnabled` | `boolean` | Whether memory is currently enabled |
| `contextSummary` | `string \| undefined` | Summary of memory context (if available) |

## Examples

### Basic Usage

```typescript
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

### With Memory

```typescript
const {
  messages,
  append,
  memoryEnabled,
  contextSummary,
} = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 4000,
    autoCapture: true,
  },
})
```

### With Transport Selection

```typescript
const { messages, append } = useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

### With User Context

```typescript
const { messages, append } = useClarityChat({
  api: '/api/chat',
  userId: 'user-123',
  threadId: 'thread-456',
  memory: {
    enabled: true,
    strategy: 'vector-store',
  },
})
```

### With Error Handling

```typescript
const { messages, append, error, isLoading } = useClarityChat({
  api: '/api/chat',
  onError: (err) => {
    console.error('Chat error:', err)
    // Custom error handling
  },
})
```

### With Message Finish Callback

```typescript
const { messages, append } = useClarityChat({
  api: '/api/chat',
  onFinish: async (message) => {
    console.log('Message finished:', message)
    // Custom post-processing
  },
})
```

## Memory Strategies

### sliding-window

Fast, recent context only. Best for short conversations.

```typescript
memory: {
  enabled: true,
  strategy: 'sliding-window',
  maxTokens: 2000,
}
```

**Characteristics:**
- Fastest query time
- Minimal overhead
- Recent messages only
- Best for: Real-time chat, customer support

### semantic-chunks

Context-aware retrieval. Best for medium conversations.

```typescript
memory: {
  enabled: true,
  strategy: 'semantic-chunks',
  maxTokens: 6000,
}
```

**Characteristics:**
- Moderate query time
- Semantic relevance
- Context-aware
- Best for: Research assistants, document Q&A

### vector-store

Long-term memory. Best for enterprise applications.

```typescript
memory: {
  enabled: true,
  strategy: 'vector-store',
  maxTokens: 10000,
}
```

**Characteristics:**
- Slower query time
- Long-term memory
- Vector similarity search
- Best for: Enterprise chat, knowledge bases

## Transport Protocols

### SSE (Server-Sent Events)

Default transport. Unidirectional, simpler setup.

```typescript
transport: 'sse'
```

**Characteristics:**
- Lower overhead
- Easier to scale
- Unidirectional
- ~50-100ms latency

### WebSocket

Bidirectional transport. Lower latency.

```typescript
transport: 'websocket'
```

**Characteristics:**
- Lower latency (~10-30ms)
- Bidirectional
- Persistent connection
- Higher server resources

## Error Handling

### Error Types

Errors are standard `Error` objects. Common error scenarios:

```typescript
const { error } = useClarityChat({
  api: '/api/chat',
  onError: (err) => {
    if (err.message.includes('network')) {
      // Network error
    } else if (err.message.includes('memory')) {
      // Memory error
    } else {
      // Other error
    }
  },
})
```

### Error Recovery

```typescript
const { error, reload, stop } = useClarityChat({
  api: '/api/chat',
})

// Retry on error
if (error) {
  reload()
}

// Stop on error
if (error) {
  stop()
}
```

## Memory Context

### Checking Memory Status

```typescript
const { memoryEnabled, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})

if (memoryEnabled) {
  console.log('Memory context:', contextSummary)
}
```

### Memory Context Summary

The `contextSummary` provides a brief overview of relevant memory:

```typescript
const { contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})

// Display context summary to user
{contextSummary && (
  <div>Context: {contextSummary}</div>
)}
```

## Message Types

### CoreMessage

```typescript
type CoreMessage = {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{
    type: 'text' | 'image' | 'tool-call'
    text?: string
    image?: string | ArrayBuffer
    toolCallId?: string
    toolName?: string
    args?: Record<string, any>
  }>
}
```

### Appending Messages

```typescript
// Simple text message
await append({
  role: 'user',
  content: 'Hello',
})

// With additional data
await append(
  {
    role: 'user',
    content: 'Hello',
  },
  {
    data: {
      timestamp: Date.now(),
      source: 'web',
    },
  }
)
```

## Best Practices

### 1. Memoize Message Conversion

```typescript
const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

### 2. Handle Loading States

```typescript
const { isLoading, messages } = useClarityChat({
  api: '/api/chat',
})

{isLoading && <LoadingIndicator />}
```

### 3. Error Boundaries

```typescript
<ErrorBoundary>
  <ChatComponent />
</ErrorBoundary>
```

### 4. Memory Provider Wrapper

```typescript
<MemoryProvider config={{ maxTokens: 10000 }}>
  <App />
</MemoryProvider>
```

## Type Definitions

All types are exported from `@clarity-chat/react`:

```typescript
import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityTransport,
  CoreMessage,
} from '@clarity-chat/react'
```

## See Also

- [Migration Guide](./MIGRATION_GUIDE.md) - Migrating from Vercel AI SDK
- [TypeScript Guide](./TYPESCRIPT_GUIDE.md) - TypeScript usage patterns
- [Performance Guide](./PERFORMANCE_GUIDE.md) - Performance optimization
- [useClarityChat README](./USECLARITYCHAT_README.md) - Comprehensive documentation
