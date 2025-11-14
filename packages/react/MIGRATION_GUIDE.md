# Migration Guide: Vercel AI SDK → Clarity `useClarityChat`

This guide helps you migrate from Vercel AI SDK's `useChat` to Clarity's flagship `useClarityChat` hook.

## Quick Start

### Before (Vercel AI SDK)

```tsx
import { useChat } from 'ai/react'

function ChatComponent() {
  const { messages, append, isLoading, input, setInput } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => append({ role: 'user', content: input })}>
        Send
      </button>
    </div>
  )
}
```

### After (Clarity)

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, append, isLoading, input, setInput } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

## API Compatibility

`useClarityChat` maintains **100% API compatibility** with Vercel's `useChat`. All existing code will work without changes.

### Identical APIs

- ✅ `messages` - Array of chat messages
- ✅ `append` - Append a message
- ✅ `reload` - Reload/retry last message
- ✅ `stop` - Stop current stream
- ✅ `handleSubmit` - Handle form submission
- ✅ `input` / `setInput` - Input value state
- ✅ `isLoading` - Loading state
- ✅ `error` - Error state
- ✅ `data` - Current streaming message

### Enhanced Options

Clarity adds optional enhancements:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  
  // Clarity-specific enhancements
  memory: {
    enabled: true,
    strategy: 'sliding-window', // or 'semantic-chunks', 'vector-store'
    maxTokens: 4000,
  },
  transport: 'sse', // or 'websocket'
  
  // All Vercel options still work
  initialMessages: [],
  onFinish: (message) => console.log('Done:', message),
  // ... etc
})
```

## Step-by-Step Migration

### Step 1: Update Imports

```diff
- import { useChat } from 'ai/react'
+ import { useClarityChat } from '@clarity-chat/react'
```

### Step 2: Rename Hook

```diff
- const { messages, append, ... } = useChat({
+ const { messages, append, ... } = useClarityChat({
    api: '/api/chat',
  })
```

### Step 3: (Optional) Add Clarity Features

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true }, // Enable memory for context retention
  transport: 'sse', // Choose transport protocol
})
```

### Step 4: (Optional) Use Clarity Components

```tsx
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={(content) => append({ role: 'user', content })}
/>
```

## Memory Integration

To enable memory features, wrap your app with `MemoryProvider`:

```tsx
import { MemoryProvider } from '@clarity-chat/react/memory'

function App() {
  return (
    <MemoryProvider config={{ /* memory config */ }}>
      <ChatComponent />
    </MemoryProvider>
  )
}
```

Then enable memory in `useClarityChat`:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
  },
})
```

## Transport Options

Clarity supports multiple transport protocols:

- **SSE (default)**: Server-Sent Events, unidirectional streaming
- **WebSocket**: Bidirectional real-time communication

```tsx
// SSE (default)
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})

// WebSocket
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

## Benefits of Migration

1. **Same API** - Drop-in replacement, no code changes needed
2. **Enhanced Features** - Memory, multiple transports, better error handling
3. **Production Ready** - Built-in error recovery, token optimization, analytics
4. **Enterprise Features** - RBAC, quotas, multi-tenancy, audit logging
5. **Better DX** - Rich UI components, virtualized lists, thinking indicators

## Troubleshooting

### Memory not working?

Ensure `MemoryProvider` wraps your component tree:

```tsx
<MemoryProvider config={memoryConfig}>
  <YourChatComponent />
</MemoryProvider>
```

### Type errors?

All types are compatible. If you see errors, ensure you're importing from `@clarity-chat/react`:

```tsx
import { useClarityChat, type UseClarityChatOptions } from '@clarity-chat/react'
```

### Need advanced features?

`useChatEnhanced` is still available for advanced use cases:

```tsx
import { useChat } from '@clarity-chat/react'
// This is useChatEnhanced, fully compatible with Vercel
```

## Examples

See `packages/react/src/examples/basic-clarity-chat-example.tsx` for a complete example.

## Support

For issues or questions, see the [Clarity documentation](../../README.md) or open an issue.
