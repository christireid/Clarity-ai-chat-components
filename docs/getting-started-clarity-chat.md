# Getting Started with Clarity Chat

Get up and running with Clarity Chat in minutes. This guide assumes you're using React with Next.js, but Clarity works with any React setup.

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Your First Chat

Here's the simplest possible chat implementation:

```tsx
'use client'

import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatPage() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
      {error && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error.message}
          </p>
        </div>
      )}
    </div>
  )
}
```

That's it! You now have a fully functional chat interface with:
- ✅ Streaming responses
- ✅ Loading states
- ✅ Error handling
- ✅ Production-ready UI

## What You Get Out of the Box

Clarity Chat provides everything you need for a production-ready chat experience:

### Streaming Responses
Messages stream in real-time as the AI generates them. No configuration needed—it just works.

### Sensible Defaults
- SSE (Server-Sent Events) transport for reliable streaming
- Automatic error recovery
- Optimized rendering for performance
- Accessible UI components (WCAG compliant)

### Production-Ready UI
The `<ChatWindow>` component includes:
- Virtualized message list (handles 1000+ messages smoothly)
- Animated thinking indicators
- Empty states
- Message actions (copy, retry, edit)
- Responsive design (mobile-first)

## Add Memory in One Step

Enable context-aware conversations with Clarity's built-in memory system:

```tsx
'use client'

import { useClarityChat, ChatWindow, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatWithMemory() {
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
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'semantic-chunks', // or 'sliding-window' or 'vector-store'
      maxTokens: 4000,
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
      {memoryEnabled && contextSummary && (
        <div className="fixed bottom-4 left-4 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs">
          Using {contextSummary.split(' ').length} words from memory
        </div>
      )}
    </div>
  )
}
```

With memory enabled, Clarity will:
- Automatically store conversation context
- Retrieve relevant past conversations
- Enrich prompts with context
- Optimize token usage

## Building Custom UI

If you prefer to build your own UI instead of using `<ChatWindow>`, `useClarityChat` provides `input` and `setInput` just like Vercel's `useChat`:

```tsx
const {
  messages: coreMessages,
  input,
  setInput,
  append,
  isLoading,
  handleSubmit,
} = useClarityChat({
  api: '/api/chat',
})

// Build your own UI
<form onSubmit={handleSubmit}>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message..."
  />
  <button disabled={isLoading}>Send</button>
</form>
```

**Note:** `<ChatWindow>` manages its own input state internally, so you don't need `input`/`setInput` when using it.

## Next Steps

- **[Compare with Vercel AI SDK](./clarity-vs-vercel-ai-sdk-ui.md)** - See how Clarity extends Vercel's API
- **[Migration Guide](./migrating-from-vercel.md)** - Migrate from Vercel AI SDK
- **[API Reference](../../packages/react/README.md)** - Complete API documentation
- **[Examples](../../packages/react/src/examples/)** - More code examples

## Need Help?

- Check the [API Reference](../../packages/react/README.md)
- Browse [examples](../../apps/examples/)
- See [Storybook](../../apps/storybook/) for interactive component demos
