# Getting Started with Clarity Chat

> **Learn how to build production-ready AI chat interfaces in minutes.**

Clarity Chat provides everything you need to build ChatGPT-like interfaces: streaming, error
handling, token management, accessibility, and more. This guide will get you up and running in under
5 minutes.

## Prerequisites

- React 19+ (or React 18 with compatibility mode)
- Node.js 20+ or Bun
- Basic knowledge of React hooks

> **Note**: Clarity works with any React setup (Next.js, Vite, Remix, etc.). Examples here use
> Next.js, but the concepts apply everywhere.

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

import { useClarityChat, ChatWindow } from '@clarity-chat/react'

export default function ChatPage() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
  })

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

**That's it!** You now have a fully functional chat interface with:

- **Streaming responses** - Messages appear in real-time as the AI generates them
- **Loading states** - Visual feedback during message processing
- **Error handling** - Automatic error recovery and user-friendly error messages
- **Production-ready UI** - Beautiful, accessible, responsive interface

> **Note**: `ChatWindow` accepts both `CoreMessage[]` (from `useClarityChat`) and `Message[]`
> formats directly - no conversion needed!

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

import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

export default function ChatWithMemory() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatPage />
    </MemoryProvider>
  )
}

function ChatPage() {
  const { messages, append, isLoading, memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'semantic-chunks', // or 'sliding-window' or 'vector-store'
      maxTokens: 4000,
    },
  })

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

If you prefer to build your own UI instead of using `<ChatWindow>`, `useClarityChat` provides
`input` and `setInput` just like Vercel's `useChat`:

```tsx
const {
  messages,
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

**Note:** `<ChatWindow>` manages its own input state internally, so you don't need
`input`/`setInput` when using it.

## Next Steps

Now that you have a basic chat working, explore more features:

### Learn More

- **[API Reference](../../packages/react/README.md)** - Complete API documentation
- **[Guides](./)** - Theming, token optimization, error handling, and more
- **[Cookbook](./cookbook/)** - Common patterns and recipes

### See It In Action

- **[Examples](../../apps/examples/)** - 30+ production-ready examples
- **[Storybook](http://localhost:6006)** - Interactive component demos

### Migration

- **[Compare with Vercel AI SDK](./clarity-vs-vercel-ai-sdk-ui.md)** - See how Clarity extends
  Vercel's API
- **[Migration Guide](./migrating-from-vercel.md)** - Migrate from Vercel AI SDK

## Troubleshooting

### Messages not appearing?

- Check that `messages` prop is an array
- Verify your API is returning messages correctly
- Ensure your API endpoint is accessible

### Streaming not working?

- Verify your API endpoint supports SSE (Server-Sent Events)
- Check network tab for connection issues
- Ensure `isLoading` state is being managed correctly

### Type errors?

- Make sure you're importing types from `@clarity-chat/react`
- Check that you're using React 19+ (or compatibility mode)
- Verify all imports are correct

### Need more help?

- Check the [FAQ](./FAQ.md)
- Browse [examples](../../apps/examples/)
- See [Storybook](http://localhost:6006) for interactive demos
- Open an issue on [GitHub](https://github.com/christireid/Clarity-ai-chat-components/issues)
