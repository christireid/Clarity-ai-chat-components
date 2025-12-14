# Migrating from Vercel AI SDK UI to Clarity

This guide helps you migrate from Vercel AI SDK UI to Clarity Chat Components.

## Quick Migration

### Step 1: Install Clarity

```bash
npm uninstall ai
npm install @clarity-chat/react
```

### Step 2: Replace `useChat` with `useClarityChat`

**Before (Vercel):**
```tsx
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
})
```

**After (Clarity):**
```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

const { messages: coreMessages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

### Step 3: Use ChatWindow Component

**Before (Vercel - custom UI):**
```tsx
<div>
  {messages.map(m => (
    <div key={m.id}>{m.content}</div>
  ))}
  <form onSubmit={handleSubmit}>
    <input value={input} onChange={handleInputChange} />
    <button>Send</button>
  </form>
</div>
```

**After (Clarity - production UI):**
```tsx
<ChatWindow
  messages={messages}
  onSendMessage={(content) => append({ role: 'user', content })}
  isLoading={isLoading}
/>
```

## API Compatibility

Clarity's `useClarityChat` is fully compatible with Vercel's `useChat` API:

| Vercel API | Clarity Equivalent | Notes |
|------------|-------------------|-------|
| `messages` | `messages` (via `convertCoreMessagesToMessages`) | Same format |
| `input` | `input` | Same |
| `setInput` | `setInput` | Same |
| `handleInputChange` | `setInput` | Same |
| `handleSubmit` | `append` | Use `append({ role: 'user', content })` |
| `isLoading` | `isLoading` | Same |
| `error` | `error` | Same |
| `reload` | `reload` | Same |
| `stop` | `stop` | Same |

## Optional: Add Memory

Clarity adds memory management that Vercel doesn't have:

```tsx
import { MemoryProvider } from '@clarity-chat/react'

// Wrap your app
<MemoryProvider config={{ maxTokens: 10000 }}>
  <App />
</MemoryProvider>

// In your component
useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
  },
})
```

## Optional: Add Tool UI Registry

Clarity provides automatic tool result rendering:

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResult,
})

// Render tool results automatically
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

## Migration Checklist

- [ ] Install `@clarity-chat/react`
- [ ] Replace `useChat` with `useClarityChat`
- [ ] Convert messages with `convertCoreMessagesToMessages`
- [ ] Replace custom UI with `ChatWindow`
- [ ] Update `handleSubmit` to use `append`
- [ ] (Optional) Add `MemoryProvider` for memory
- [ ] (Optional) Add tool UI registry for tools
- [ ] Test chat functionality
- [ ] Remove Vercel AI SDK dependency

## Common Issues

### Issue: Messages not displaying

**Solution:** Make sure to convert `CoreMessage[]` to `Message[]`:
```tsx
const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

### Issue: Input handling

**Solution:** `ChatWindow` handles input internally. Remove manual input handling:
```tsx
// Remove this:
<input value={input} onChange={setInput} />

// ChatWindow handles it internally
```

### Issue: Form submission

**Solution:** Use `append` instead of form submission:
```tsx
// Before
<form onSubmit={handleSubmit}>

// After
<ChatWindow
  onSendMessage={(content) => append({ role: 'user', content })}
/>
```

## Need Help?

- [Getting Started Guide](./getting-started.md)
- [Feature Comparison](./clarity-vs-vercel-ai-sdk-ui.md)
- [API Reference](../packages/react/README.md)
