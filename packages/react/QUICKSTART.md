# Clarity Chat Quickstart Guide

## 🚀 Three Ways to Use Clarity Chat

Choose the approach that fits your needs:

### 1. ClarityChat Component (Recommended for Most Users) ⭐

**Best for**: Quick setup, minimal code, production apps

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** One line and you have a fully-featured chat interface.

#### With Customization

```tsx
<ClarityChat
  api="/api/chat"
  showHeader
  sessionTitle="My AI Assistant"
  className="h-screen"
  memory={{ enabled: true }}
/>
```

### 2. useChat Hook (Simplified Hook API)

**Best for**: More control, custom UI, hook-based patterns

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

**Benefits**:
- Automatic message conversion
- Built-in persistence (optional)
- Auto-scroll support
- Simpler API than `useClarityChat`

#### With Persistence

```tsx
const { messages, sendMessage, isLoading, clearMessages } = useChat({
  api: '/api/chat',
  persistMessages: true, // Saves to localStorage
  storageKey: 'my-chat',
})
```

### 3. useClarityChat Hook (Full Control)

**Best for**: Maximum control, advanced features, custom implementations

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const convertedMessages = convertCoreMessagesToMessages(messages)

  return (
    <ChatWindow
      messages={convertedMessages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

## 📋 API Comparison

| Feature | ClarityChat | useChat | useClarityChat |
|---------|------------|---------|----------------|
| **Lines of code** | 1 | ~10 | ~15 |
| **Message conversion** | ✅ Automatic | ✅ Automatic | ❌ Manual |
| **Auto-scroll** | ✅ Built-in | ✅ Built-in | ❌ Manual |
| **Persistence** | ❌ | ✅ Optional | ❌ |
| **Error boundary** | ❌ | ❌ | ❌ |
| **Customization** | ✅ Props | ✅ Props | ✅ Full control |
| **Advanced features** | ✅ All | ✅ All | ✅ All |

## 🎯 When to Use What

### Use `ClarityChat` Component When:
- ✅ You want the simplest setup
- ✅ You're building a standard chat interface
- ✅ You want zero boilerplate
- ✅ You're prototyping or building quickly

### Use `useChat` Hook When:
- ✅ You need more control over the UI
- ✅ You want built-in persistence
- ✅ You prefer hook-based patterns
- ✅ You want automatic message conversion

### Use `useClarityChat` Hook When:
- ✅ You need maximum control
- ✅ You're building custom chat flows
- ✅ You need access to all advanced features
- ✅ You're comfortable with manual message conversion

## 🔧 Common Patterns

### Pattern 1: Basic Chat
```tsx
<ClarityChat api="/api/chat" />
```

### Pattern 2: Chat with Memory
```tsx
<ClarityChat
  api="/api/chat"
  memory={{ enabled: true, strategy: 'vector-store' }}
/>
```

### Pattern 3: Persistent Chat
```tsx
const { messages, sendMessage, isLoading } = useChat({
  api: '/api/chat',
  persistMessages: true,
})
```

### Pattern 4: Chat with Error Handling
```tsx
import { ChatWithErrorBoundary } from '@clarity-chat/react'

<ChatWithErrorBoundary
  api="/api/chat"
  onError={(error) => {
    // Send to error tracking
    trackError(error)
  }}
/>
```

### Pattern 5: Custom UI with Hook
```tsx
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })

return (
  <div>
    <CustomHeader />
    <CustomMessageList messages={messages} />
    <CustomInput onSend={sendMessage} />
  </div>
)
```

## 🎨 Styling

All components work with Tailwind CSS and support custom className:

```tsx
<ClarityChat
  api="/api/chat"
  className="h-screen rounded-lg shadow-lg"
/>
```

## 📚 Next Steps

- [Full Documentation](./README.md)
- [API Reference](./API_REFERENCE.md)
- [Examples](./src/examples/)
- [Migration Guide](./MIGRATION_GUIDE.md)

## 💡 Tips

1. **Start with ClarityChat** - It's the simplest and covers 90% of use cases
2. **Upgrade to useChat** - If you need persistence or more control
3. **Use useClarityChat** - Only if you need maximum flexibility
4. **Add error boundaries** - Use `ChatWithErrorBoundary` for production apps
5. **Enable memory** - For better context retention in conversations

---

**Questions?** Check the [full documentation](./README.md) or [examples](./src/examples/).
