# Migrating from `useChat` to `useClarityChat`

> ⚠️ **DEPRECATION NOTICE**: The `useChat` hook is deprecated and will be removed in v3.0. Please
> migrate to `useClarityChat`.

## Why is `useChat` being deprecated?

The original `useChat` hook was a basic implementation that lacked several important features:

| Feature            | `useChat` (deprecated) | `useClarityChat`                           |
| ------------------ | ---------------------- | ------------------------------------------ |
| TypeScript support | Basic                  | Full generics support                      |
| Memory integration | ❌                     | ✅ Built-in                                |
| Error boundaries   | ❌                     | ✅ Automatic                               |
| Streaming modes    | Limited                | SSE, WebSocket, Polling                    |
| Message status     | Basic                  | Detailed (`pending`, `streaming`, `error`) |
| Retry logic        | Manual                 | ✅ Built-in with backoff                   |
| AbortController    | Partial                | ✅ Full support                            |

## Quick Migration (2 minutes)

### Before (deprecated)

```tsx
import { useChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, sendMessage, isLoading, error, clear } = useChat({
    onSendMessage: async (message) => {
      // Custom send logic
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      })
    },
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => sendMessage('Hello')}>Send</button>
    </div>
  )
}
```

### After (recommended)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, append, isLoading, error, setMessages } = useClarityChat({
    api: '/api/chat',
    // Memory integration is automatic
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <button onClick={() => append({ role: 'user', content: 'Hello' })}>Send</button>
    </div>
  )
}
```

## API Mapping

| `useChat`              | `useClarityChat`                    | Notes                           |
| ---------------------- | ----------------------------------- | ------------------------------- |
| `sendMessage(content)` | `append({ role: 'user', content })` | More explicit message structure |
| `messages`             | `messages`                          | Same                            |
| `isLoading`            | `isLoading`                         | Same                            |
| `error`                | `error`                             | Same                            |
| `clear()`              | `setMessages([])`                   | Use state setter                |
| `retry(messageId)`     | `reload()`                          | Retries last message            |
| `onSendMessage`        | `api` + `onFinish`                  | Use API endpoint                |

## Handling Custom Send Logic

If you were using `onSendMessage` for custom logic, use the callback props:

### Before

```tsx
const { sendMessage } = useChat({
  onSendMessage: async (message, { signal }) => {
    const response = await customFetch('/api/chat', message, signal)
    return response
  },
})
```

### After

```tsx
const { append } = useClarityChat({
  api: '/api/chat',
  onFinish: (message) => {
    // Called when streaming completes
    console.log('Message completed:', message)
  },
  onError: (error) => {
    // Handle errors
    console.error('Chat error:', error)
  },
})
```

## Handling Message Persistence

### Before

```tsx
const { messages } = useChat({
  persistMessages: true,
  storageKey: 'my-chat',
})
```

### After

```tsx
import { useClarityChat, useLocalStorage } from '@clarity-chat/react'

function ChatWithPersistence() {
  const [storedMessages, setStoredMessages] = useLocalStorage('my-chat', [])

  const { messages, append, setMessages } = useClarityChat({
    api: '/api/chat',
    initialMessages: storedMessages,
    onFinish: () => {
      setStoredMessages(messages)
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}
```

## Memory Integration

The new `useClarityChat` has built-in memory support:

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  // Enable memory (stores conversation context)
  body: {
    memoryEnabled: true,
    memoryKey: 'user-123-conversation',
  },
})
```

## Suppressing Deprecation Warnings

If you need to suppress the console warning during migration:

```tsx
// In your test setup or app entry
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn
  console.warn = (...args) => {
    if (args[0]?.includes?.('[useChat]')) return
    originalWarn.apply(console, args)
  }
}
```

**Note**: This is a temporary workaround. Complete your migration before v3.0.

## Timeline

- **v2.x (Current)**: `useChat` works but logs deprecation warning
- **v3.0 (Future)**: `useChat` will be removed entirely

## Need Help?

- [Full API Reference](/docs/api-reference)
- [useClarityChat Documentation](/docs/hooks/use-clarity-chat)
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
