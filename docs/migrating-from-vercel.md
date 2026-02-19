# Migrating from Vercel AI SDK UI to Clarity

This guide helps you migrate from Vercel AI SDK UI to Clarity Chat Components. Clarity is designed to be a drop-in replacement, so migration is straightforward.

## Quick Migration (5 Minutes)

### Step 1: Install Clarity

```bash
npm uninstall ai
npm install @clarity-chat/react
```

### Step 2: Update Imports

**Before (Vercel):**
```tsx
import { useChat } from 'ai/react'
```

**After (Clarity):**
```tsx
import { useClarityChat, convertCoreMessagesToMessages } from '@clarity-chat/react'
```

### Step 3: Replace `useChat` with `useClarityChat`

**Before (Vercel):**
```tsx
const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})
```

**After (Clarity):**
```tsx
const { messages: coreMessages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

// Convert CoreMessage[] to Message[] if using ChatWindow
const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

That's it! Your chat should work exactly the same. The API is fully compatible.

## Complete Migration Example

### Before: Vercel AI SDK UI

```tsx
'use client'

import { useChat } from 'ai/react'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

### After: Clarity Chat Components

```tsx
'use client'

import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatPage() {
  const {
    messages: coreMessages,
    append,
    isLoading,
  } = useClarityChat({
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
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**Benefits:**
- ✅ Robust UI out of the box
- ✅ Virtualized message list (handles 1000+ messages)
- ✅ Better error handling
- ✅ Accessible components

## API Compatibility

### `useChat` → `useClarityChat`

All Vercel `useChat` options work with `useClarityChat`:

```tsx
// All these options work exactly the same
useClarityChat({
  api: '/api/chat',
  initialMessages: [...],
  initialInput: '',
  onFinish: (message) => { ... },
  onError: (error) => { ... },
  headers: { ... },
  body: { ... },
  // ... all other useChat options
})
```

**Additional Clarity options:**
```tsx
useClarityChat({
  // ... all useChat options
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 4000,
  },
  transport: 'sse', // or 'websocket'
})
```

### `useCompletion` → `useCompletion`

Clarity's `useCompletion` is fully compatible:

```tsx
// Works exactly the same
import { useCompletion } from '@clarity-chat/react'

const { completion, complete, isLoading } = useCompletion({
  api: '/api/completion',
})
```

### `useAssistant` → `useAssistant`

Clarity's `useAssistant` is fully compatible:

```tsx
// Works exactly the same
import { useAssistant } from '@clarity-chat/react'

const { messages, append, toolInvocations, status } = useAssistant({
  api: '/api/assistant',
  tools: [...],
})
```

## Adding Memory (Optional)

If you want to enable memory for context-aware conversations:

### Step 1: Wrap Your App

```tsx
import { MemoryProvider } from '@clarity-chat/react'

export default function App({ children }) {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      {children}
    </MemoryProvider>
  )
}
```

### Step 2: Enable Memory in Hook

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
  },
})
```

That's it! Clarity will now:
- Store conversation context automatically
- Retrieve relevant past conversations
- Enrich prompts with context
- Optimize token usage

## Using Production UI Components

### Replace Custom UI with `<ChatWindow>`

**Before:**
```tsx
<div>
  {messages.map((m) => (
    <div key={m.id}>{m.content}</div>
  ))}
  <input ... />
</div>
```

**After:**
```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={async (content) => {
    await append({ role: 'user', content })
  }}
  showHeader
  sessionTitle="My Chat"
/>
```

### Use Tool UI Registry for Generative UIs

**Before:** Manual tool result rendering

**After:**
```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_web: SearchResult,
})

<ClarityToolResult
  registry={toolRegistry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

## Common Migration Patterns

### Pattern 1: Minimal Change (Keep Custom UI)

```tsx
// Just replace the hook, keep your UI
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

// Your existing UI code works unchanged
```

### Pattern 2: Use Production UI

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

const chat = useClarityChat({ api: '/api/chat' })
const messages = useMemo(
  () => convertCoreMessagesToMessages(chat.messages),
  [chat.messages]
)

return <ChatWindow messages={messages} onSendMessage={...} />
```

### Pattern 3: Add Memory

```tsx
<MemoryProvider>
  <YourApp />
</MemoryProvider>

const chat = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})
```

## Breaking Changes

There are **no breaking changes** for basic usage. However:

1. **Message Format**: `useClarityChat` returns `CoreMessage[]` (Vercel format). If you use `<ChatWindow>`, convert with `convertCoreMessagesToMessages()`.

2. **Input Management**: `<ChatWindow>` manages its own input state. If you were using `input`/`setInput` from `useChat`, you don't need them with `<ChatWindow>`.

3. **Server API**: Your server API should remain compatible. Clarity uses the same request/response format as Vercel.

## Troubleshooting

### "Messages don't render correctly"

Make sure to convert `CoreMessage[]` to `Message[]`:
```tsx
const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

### "Memory not working"

Ensure `<MemoryProvider>` wraps your app:
```tsx
<MemoryProvider config={{ maxTokens: 10000 }}>
  <YourApp />
</MemoryProvider>
```

### "Type errors"

Clarity uses the same types as Vercel (`CoreMessage`, etc.). If you see type errors, check your imports:
```tsx
import type { CoreMessage } from '@clarity-chat/react'
```

## Next Steps

- **[Getting Started](./getting-started.md)** - Learn Clarity basics
- **[Clarity vs Vercel](./clarity-vs-vercel-ai-sdk-ui.md)** - Detailed comparison
- **[API Reference](../../packages/react/README.md)** - Complete documentation
- **[Examples](../../packages/react/src/examples/)** - Code examples

## Need Help?

- Check the [API Reference](../../packages/react/README.md)
- Browse [examples](../../apps/examples/)
- See [Storybook](../../apps/storybook/) for interactive demos
