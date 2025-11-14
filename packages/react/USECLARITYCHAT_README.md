# useClarityChat - Flagship Chat Hook

`useClarityChat` is Clarity's primary chat hook, providing a clean, production-ready API that wraps `useChatEnhanced` with Clarity-specific enhancements while maintaining full compatibility with Vercel AI SDK patterns.

## Quick Start

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'
import { coreMessagesToMessages } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const convertedMessages = coreMessagesToMessages(messages)

  return (
    <ChatWindow
      messages={convertedMessages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

## Features

### ✅ Full Vercel Compatibility
- Same API surface as `useChat` from Vercel AI SDK
- All options from `UseChatOptions` supported
- Drop-in replacement - no code changes needed

### 🧠 Memory Integration (Optional)
Enable context retention and intelligent memory management:

```tsx
import { MemoryProvider } from '@clarity-chat/react/memory'

function App() {
  return (
    <MemoryProvider config={memoryConfig}>
      <MyChat />
    </MemoryProvider>
  )
}

function MyChat() {
  const { messages, memoryContext, memoryEnabled } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window', // or 'semantic-chunks', 'vector-store'
      maxTokens: 4000,
    },
  })

  // memoryContext contains relevant context from memory
  // memoryEnabled indicates if memory is active
}
```

### 🚀 Transport Selection
Choose between SSE (default) or WebSocket:

```tsx
// SSE (default) - unidirectional streaming
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})

// WebSocket - bidirectional real-time communication
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

## API Reference

### Options

```typescript
interface UseClarityChatOptions {
  // All Vercel useChat options are supported
  api?: string
  initialMessages?: CoreMessage[]
  body?: Record<string, any>
  headers?: Record<string, string>
  onFinish?: (message: CoreMessage) => void
  // ... etc

  // Clarity-specific options
  memory?: {
    enabled?: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  transport?: 'sse' | 'websocket'
}
```

### Return Value

```typescript
interface UseClarityChatReturn {
  // All Vercel useChat return values
  messages: CoreMessage[]
  append: (message: CoreMessage) => Promise<string | null>
  reload: () => Promise<string | null>
  stop: () => void
  handleSubmit: (event?: React.FormEvent) => void
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  error: Error | undefined
  data: CoreMessage | undefined
  abort: () => void

  // Clarity-specific additions
  memoryContext?: string  // Current memory context summary
  memoryEnabled?: boolean  // Whether memory is active
}
```

## Memory Strategies

### Sliding Window
Includes the most recent N messages in context. Best for short-term context.

```tsx
memory: {
  enabled: true,
  strategy: 'sliding-window',
  maxTokens: 2000,
}
```

### Semantic Chunks
Includes semantically relevant chunks from conversation history. Best for medium-term context.

```tsx
memory: {
  enabled: true,
  strategy: 'semantic-chunks',
  maxTokens: 4000,
}
```

### Vector Store
Uses vector search to find relevant memories. Best for long-term context and cross-conversation memory.

```tsx
memory: {
  enabled: true,
  strategy: 'vector-store',
  maxTokens: 4000,
}
```

## Examples

### Basic Example
See `packages/react/src/examples/basic-clarity-chat-example.tsx`

### Advanced Example
See `packages/react/src/examples/advanced-clarity-chat-example.tsx`

### With Memory
See `packages/react/src/examples/clarity-chat-with-memory-example.tsx`

## Migration from Vercel

See `MIGRATION_GUIDE.md` for detailed migration instructions.

**TL;DR:**
1. Change import: `import { useChat } from 'ai/react'` → `import { useClarityChat } from '@clarity-chat/react'`
2. Change hook name: `useChat` → `useClarityChat`
3. That's it! All existing code works.

## Best Practices

1. **Use ChatWindow Component**: Provides production-ready UI with virtualized lists, thinking indicators, and more
2. **Enable Memory for Context**: Wrap with `MemoryProvider` and enable memory for better context retention
3. **Choose Transport Wisely**: Use SSE for simple streaming, WebSocket for bidirectional communication
4. **Handle Errors**: Use `onError` callback for custom error handling
5. **Convert Messages**: Use `coreMessagesToMessages()` when integrating with `ChatWindow`

## Troubleshooting

### Memory not working?
- Ensure `MemoryProvider` wraps your component tree
- Check that `memory.enabled` is set to `true`
- Verify memory configuration is correct

### Type errors?
- Ensure you're importing from `@clarity-chat/react`
- Use `coreMessagesToMessages()` for message type conversion

### Transport issues?
- SSE is default and works with most servers
- WebSocket requires server support for WebSocket connections

## See Also

- [Migration Guide](./MIGRATION_GUIDE.md)
- [Phase 2 Completion Report](./PHASE_2_COMPLETE.md)
- [Vercel AI SDK Audit](./CLARITY_VS_VERCEL_AI_SDK_AUDIT.md)
