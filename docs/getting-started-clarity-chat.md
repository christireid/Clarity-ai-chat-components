# Getting Started with Clarity Chat

Get up and running with Clarity Chat in minutes. This guide assumes you're working with a React + Next.js project.

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
```

## Minimal Example

Here's the simplest possible chat implementation using `useClarityChat` and `ChatWindow`:

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function Page() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
  } = useClarityChat({ api: '/api/chat' })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      isLoading={isLoading}
    />
  )
}
```

## What You Get Out of the Box

With just the code above, you get:

- ✅ **Streaming responses** - Real-time message streaming as the AI generates responses
- ✅ **Sensible defaults** - Production-ready defaults for error handling, loading states, and UI behavior
- ✅ **Production-ready UI** - Fully accessible, responsive chat interface with:
  - Virtualized message list (handles 1000+ messages efficiently)
  - Smooth animations and transitions
  - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
  - Copy, edit, regenerate, and delete message actions
  - Empty states and loading indicators
  - Error boundaries and retry mechanisms

## Add Memory in One Step

Enable context-aware conversations by wrapping your app in `MemoryProvider` and enabling memory in `useClarityChat`:

```tsx
import { useClarityChat, ChatWindow, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

// Wrap your app (or page) with MemoryProvider
export default function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatPage />
    </MemoryProvider>
  )
}

function ChatPage() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    memoryEnabled,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window', // or 'semantic-chunks', 'vector-store'
      maxTokens: 4000,
    },
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

Memory strategies:
- **`sliding-window`** - Fast, keeps recent messages (recommended for most cases)
- **`semantic-chunks`** - Context-aware selection based on relevance
- **`vector-store`** - Long-term memory with embeddings for knowledge retention

## API Route Setup

You'll need a Next.js API route to handle chat requests. Here's a minimal example:

```tsx
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  })
  
  return result.toDataStreamResponse()
}
```

## Next Steps

- **Add structured output**: See `useClarityObject` for type-safe object generation
- **Add tool UI registry**: See `ClarityToolResult` for automatic tool result rendering
- **Customize the UI**: `ChatWindow` accepts many props for customization
- **Explore examples**: Check `apps/examples/` for complete examples

## Learn More

- [API Reference](../../packages/react/API_REFERENCE.md)
- [Migration Guide](../../packages/react/MIGRATION_GUIDE.md) (from Vercel AI SDK)
- [Best Practices](../../packages/react/BEST_PRACTICES.md)
- [Feature Comparison](../../packages/react/FEATURE_COMPARISON.md)
