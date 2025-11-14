# useClarityChat Quick Start

Get started with `useClarityChat` in 5 minutes.

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Basic Example

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function Chat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

## With Memory

```tsx
import { useClarityChat, ChatWindow, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <Chat />
    </MemoryProvider>
  )
}

function Chat() {
  const { messages: coreMessages, append, isLoading, memoryEnabled } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div>
      {memoryEnabled && <div>Memory Active</div>}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={(content) => append({ role: 'user', content })}
      />
    </div>
  )
}
```

## API Endpoint Setup

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

### Express Route

```typescript
// routes/chat.ts
import { streamText } from 'ai'
import express from 'express'

const router = express.Router()

router.post('/chat', async (req, res) => {
  const { messages } = req.body

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  })

  result.pipeDataStreamToResponse(res)
})

export default router
```

## Common Patterns

### Form Handling

```tsx
function ChatForm() {
  const { input, setInput, handleSubmit, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        Send
      </button>
    </form>
  )
}
```

### Error Handling

```tsx
function ChatWithErrorHandling() {
  const { messages, append, error, isLoading } = useClarityChat({
    api: '/api/chat',
    onError: (err) => {
      console.error('Chat error:', err)
    },
  })

  return (
    <div>
      {error && (
        <div className="error">
          Error: {error.message}
        </div>
      )}
      {/* Chat UI */}
    </div>
  )
}
```

### Loading States

```tsx
function ChatWithLoading() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div>
      {isLoading && <div>Thinking...</div>}
      {/* Messages */}
    </div>
  )
}
```

## Memory Strategies

### Sliding Window (Fast)

```tsx
useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 2000,
  },
})
```

### Semantic Chunks (Balanced)

```tsx
useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 6000,
  },
})
```

### Vector Store (Long-term)

```tsx
useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 10000,
  },
})
```

## Transport Selection

### SSE (Default)

```tsx
useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})
```

### WebSocket

```tsx
useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

## Next Steps

- 📖 Read the [Full Documentation](./USECLARITYCHAT_README.md)
- 🔄 See [Migration Guide](./MIGRATION_GUIDE.md) for Vercel AI SDK users
- 📚 Check [API Reference](./API_REFERENCE.md) for complete API docs
- ⚡ Learn [Performance Optimization](./PERFORMANCE_GUIDE.md)
- 📝 Review [TypeScript Guide](./TYPESCRIPT_GUIDE.md) for type safety

## Examples

- [Basic Example](../../apps/examples/use-clarity-chat-showcase/)
- [Vercel-Compatible Example](../../apps/examples/vercel-ai-sdk-compatible/)
- [Storybook Stories](../../apps/storybook/stories/UseClarityChat.stories.tsx)
