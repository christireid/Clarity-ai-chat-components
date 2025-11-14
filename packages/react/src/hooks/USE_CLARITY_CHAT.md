# useClarityChat Hook Documentation

## Overview

`useClarityChat` is Clarity's flagship chat hook, providing a production-ready API for building AI chat interfaces. It wraps `useChatEnhanced` (Vercel AI SDK compatible) with Clarity-specific enhancements including memory integration, transport selection, and convenience features.

## Quick Start

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import { coreMessagesToMessages } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading, memoryInfo } = useClarityChat({
    api: '/api/chat',
  })

  const chatMessages = React.useMemo(
    () => coreMessagesToMessages(messages),
    [messages]
  )

  return (
    <ChatWindow
      messages={chatMessages}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

## API Reference

### `useClarityChat(options?)`

#### Options

```typescript
interface UseClarityChatOptions {
  // All useChatEnhanced options are supported
  api?: string
  initialMessages?: CoreMessage[]
  body?: Record<string, any>
  headers?: Record<string, string>
  // ... (see useChatEnhanced for full list)

  // Clarity-specific options
  memory?: {
    enabled?: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  transport?: 'sse' | 'websocket'
  websocket?: {
    autoReconnect?: boolean
    maxReconnectAttempts?: number
    enableHeartbeat?: boolean
    protocols?: string | string[]
  }
}
```

#### Return Value

```typescript
interface UseClarityChatReturn {
  // All useChatEnhanced return values
  messages: CoreMessage[]
  append: (message: CoreMessage) => Promise<string | null>
  isLoading: boolean
  error: Error | undefined
  // ... (see useChatEnhanced for full list)

  // Clarity-specific additions
  memoryInfo: {
    memoryCount: number
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    lastContextSummary?: string
  }
}
```

## Features

### 1. Memory Integration

Automatically store and retrieve conversation context:

```tsx
const { messages, append, memoryInfo } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'vector-store', // or 'sliding-window' or 'semantic-chunks'
    maxTokens: 2000,
  },
})

// Memory is automatically:
// - Queried before sending messages (adds context)
// - Stored after receiving responses
// - Available via memoryInfo.memoryCount
```

**Memory Strategies:**
- `sliding-window`: Recent messages only (token-efficient)
- `semantic-chunks`: Semantic similarity-based retrieval
- `vector-store`: Full vector search with embeddings

### 2. Transport Selection

Choose between SSE (default) or WebSocket:

```tsx
// SSE (default, Vercel-compatible)
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})

// WebSocket (bidirectional, lower latency)
const chat = useClarityChat({
  api: '/api/chat/ws',
  transport: 'websocket',
  websocket: {
    autoReconnect: true,
    maxReconnectAttempts: 5,
    enableHeartbeat: true,
  },
})
```

### 3. Memory Information

Access memory statistics:

```tsx
const { memoryInfo } = useClarityChat({
  memory: { enabled: true },
})

console.log(memoryInfo.memoryCount) // Number of stored memories
console.log(memoryInfo.enabled) // true
console.log(memoryInfo.strategy) // 'vector-store'
console.log(memoryInfo.lastContextSummary) // "Added 3 memory context items"
```

## Migration from Vercel AI SDK

`useClarityChat` is a drop-in replacement for Vercel's `useChat`:

### Before (Vercel)
```tsx
import { useChat } from 'ai/react'

const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})
```

### After (Clarity)
```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

**That's it!** The API is identical, so no code changes needed.

### Adding Memory (Optional)

```tsx
const { messages, append, isLoading, memoryInfo } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true }, // Just add this!
})
```

## Examples

### Basic Chat

```tsx
import { useClarityChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'

function BasicChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={coreMessagesToMessages(messages)}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

### Chat with Memory

```tsx
import {
  useClarityChat,
  ChatWindow,
  MemoryProvider,
  coreMessagesToMessages,
} from '@clarity-chat/react'

function ChatWithMemory() {
  const { messages, append, isLoading, memoryInfo } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  return (
    <>
      <div>Memories: {memoryInfo.memoryCount}</div>
      <ChatWindow
        messages={coreMessagesToMessages(messages)}
        onSendMessage={(content) => append({ role: 'user', content })}
        isLoading={isLoading}
      />
    </>
  )
}

// Wrap with MemoryProvider
function App() {
  return (
    <MemoryProvider config={{ maxMemories: 1000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}
```

### WebSocket Chat

```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat/ws',
  transport: 'websocket',
  websocket: {
    autoReconnect: true,
    maxReconnectAttempts: 5,
    enableHeartbeat: true,
  },
})
```

## Advanced Usage

### Custom Transform

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  transform: (messages) => {
    // Your custom transform logic
    // Memory context is added automatically if enabled
    return messages.map(msg => ({
      ...msg,
      // Add custom fields
    }))
  },
})
```

### Custom onFinish

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  onFinish: async (message) => {
    // Your custom logic
    // Memory storage happens automatically if enabled
    console.log('Message finished:', message)
  },
})
```

## TypeScript Types

```typescript
import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityWebSocketOptions,
  ClarityChatMemoryInfo,
} from '@clarity-chat/react'
```

## Best Practices

1. **Always convert messages** when using `ChatWindow`:
   ```tsx
   const messages = coreMessagesToMessages(coreMessages)
   ```

2. **Enable memory for persistent conversations**:
   ```tsx
   memory: { enabled: true, strategy: 'vector-store' }
   ```

3. **Use SSE for Vercel compatibility**, WebSocket for real-time apps

4. **Wrap with MemoryProvider** when using memory features

5. **Check memoryInfo** to display memory statistics to users

## Error Handling

### Memory Error Handling

`useClarityChat` includes comprehensive error handling for memory operations:

```tsx
const { memoryErrorInfo } = useClarityChat({
  memory: {
    enabled: true,
    retryOnError: true, // Enable automatic retry (default: true)
    maxRetryAttempts: 3, // Max retries (default: 2)
    onMemoryError: (error, operation) => {
      // Handle memory errors
      console.error(`Memory ${operation} failed:`, error)
    },
  },
})

// Access error information
if (memoryErrorInfo.memoryError) {
  console.log('Error type:', memoryErrorInfo.memoryErrorType)
  console.log('Operation:', memoryErrorInfo.memoryErrorOperation)
  console.log('Error:', memoryErrorInfo.memoryError)
}
```

**Error Types:**
- `network`: Network connectivity issues
- `ratelimit`: Rate limiting errors
- `server`: Server errors (5xx)
- `auth`: Authentication errors (401, 403)
- `memory`: Memory-specific errors
- `unknown`: Unclassified errors

**Retry Logic:**
- Automatic retry with exponential backoff
- Configurable max attempts
- Retries only for retryable errors (network, server)
- Non-critical errors don't block chat functionality

### Error Display Example

```tsx
function ErrorDisplay({ memoryErrorInfo }) {
  if (!memoryErrorInfo.memoryError) return null

  return (
    <Alert variant="warning">
      Memory {memoryErrorInfo.memoryErrorOperation} failed: 
      {memoryErrorInfo.memoryError.message}
    </Alert>
  )
}
```

## Troubleshooting

### Memory not working?
- Ensure `MemoryProvider` wraps your component
- Check that `memory.enabled` is `true`
- Verify memory service is initialized
- Check `memoryErrorInfo` for error details

### Memory errors?
- Check `memoryErrorInfo.memoryErrorType` for error classification
- Enable `retryOnError: true` for automatic retries
- Increase `maxRetryAttempts` for unreliable networks
- Use `onMemoryError` callback for custom handling

### WebSocket connection issues?
- Check WebSocket endpoint URL (use `ws://` or `wss://`)
- Verify server supports WebSocket protocol
- Check `websocket.autoReconnect` settings

### Type errors?
- Use `coreMessagesToMessages()` for `ChatWindow`
- Import types from `@clarity-chat/react`

## See Also

- [useChatEnhanced](./use-chat-enhanced.ts) - Underlying hook (Vercel-compatible)
- [MemoryProvider](../memory/memory-provider.tsx) - Memory context provider
- [Message Conversion Utils](../utils/message-conversion.ts) - Type conversion helpers
- [Examples](../examples/) - Complete working examples
