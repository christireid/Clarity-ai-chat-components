# useClarityChat - Quick Reference Guide

## Import

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { convertCoreMessagesToMessages } from '@clarity-chat/react'
```

## Basic Usage

```tsx
const { messages, input, setInput, append, isLoading, error } = useClarityChat({
  api: '/api/chat',
})
```

## With Memory

```tsx
// 1. Wrap app with MemoryProvider
<MemoryProvider config={memoryConfig}>
  <YourApp />
</MemoryProvider>

// 2. Use hook with memory enabled
const { messages, memoryEnabled, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})
```

## With ChatWindow Component

```tsx
import { ChatWindow } from '@clarity-chat/react'

const { messages: coreMessages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

const messages = convertCoreMessagesToMessages(coreMessages, 'chat-id')

return (
  <ChatWindow
    messages={messages}
    isLoading={isLoading}
    onSendMessage={(content) => append({ role: 'user', content })}
  />
)
```

## Common Options

```tsx
useClarityChat({
  // Required
  api: '/api/chat',
  
  // Memory (optional)
  memory: {
    enabled: true,
    strategy: 'sliding-window' | 'semantic-chunks' | 'vector-store',
    maxTokens: 4000,
    autoCapture: true,
  },
  
  // Transport (optional, default: 'sse')
  transport: 'sse' | 'websocket',
  
  // Initial messages (optional)
  initialMessages: [{ role: 'user', content: 'Hello' }],
  
  // Error handling (optional)
  onError: (error) => console.error(error),
  
  // User/Thread context (optional)
  userId: 'user-123',
  threadId: 'thread-456',
})
```

## Return Values

```tsx
const {
  // Core chat functionality (same as Vercel useChat)
  messages,           // CoreMessage[]
  input,              // string
  setInput,           // (input: string) => void
  append,             // (message: CoreMessage) => Promise<string | null>
  reload,             // () => Promise<string | null>
  stop,               // () => void
  isLoading,          // boolean
  error,              // Error | undefined
  
  // Clarity-specific additions
  memoryEnabled,      // boolean
  memoryInfo,         // ClarityChatMemoryInfo
  memoryError,        // ClarityChatErrorInfo
  contextSummary,     // string | undefined
} = useClarityChat(options)
```

## Memory Strategies

### Sliding Window (Default)
```tsx
memory: { enabled: true, strategy: 'sliding-window' }
```
- Keeps last N messages in context
- Fast, simple, no external dependencies

### Semantic Chunks
```tsx
memory: { enabled: true, strategy: 'semantic-chunks' }
```
- Groups related messages semantically
- Better for longer conversations

### Vector Store
```tsx
memory: { enabled: true, strategy: 'vector-store' }
```
- Uses vector search for relevant context
- Best for cross-conversation memory
- Requires vector store configuration

## Migration from Vercel

### Before (Vercel)
```tsx
import { useChat } from 'ai/react'

const { messages, append } = useChat({ api: '/api/chat' })
```

### After (Clarity)
```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append } = useClarityChat({ api: '/api/chat' })
```

**That's it!** All existing code works without changes.

## Examples

- **Basic**: `packages/react/src/examples/basic-clarity-chat-example.tsx`
- **Advanced**: `packages/react/src/examples/advanced-clarity-chat-example.tsx`
- **With Memory**: `packages/react/src/examples/clarity-chat-with-memory-example.tsx`
- **Error Handling**: `packages/react/src/examples/clarity-chat-error-handling-example.tsx`
- **WebSocket**: `packages/react/src/examples/clarity-chat-websocket-example.tsx`
- **Streaming**: `packages/react/src/examples/streaming-chat-example.tsx`

## Troubleshooting

### Memory not working?
```tsx
// ✅ Correct
<MemoryProvider config={config}>
  <App />
</MemoryProvider>

// ❌ Wrong - missing provider
<App />
```

### Type errors with ChatWindow?
```tsx
// ✅ Correct - convert messages
const messages = convertCoreMessagesToMessages(coreMessages, 'chat-id')
<ChatWindow messages={messages} />

// ❌ Wrong - using CoreMessage[] directly
<ChatWindow messages={coreMessages} />
```

### Transport not working?
```tsx
// ✅ SSE (default) - works with most servers
transport: 'sse'

// ✅ WebSocket - requires server support
transport: 'websocket'
```

## See Also

- [Full Documentation](./USECLARITYCHAT_README.md)
- [Implementation Summary](./USECLARITYCHAT_COMPLETE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
