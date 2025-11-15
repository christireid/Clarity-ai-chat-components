# Migration Guide: Old API → New API

This guide helps you migrate from the old API patterns to the new simplified APIs.

---

## 🎯 Quick Migration

### Before (Old API - 50+ lines)

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useAutoScroll } from '@clarity-chat/react'
import { useTokenTracker } from '@clarity-chat/react'
import { ErrorBoundary } from '@clarity-chat/react'
import { NetworkStatus } from '@clarity-chat/react'
import { TokenCounter } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
  const convertedMessages = convertCoreMessagesToMessages(messages)
  const { scrollRef } = useAutoScroll({ dependencies: [convertedMessages] })
  const tokenTracker = useTokenTracker({ modelName: 'gpt-3.5-turbo' })

  return (
    <ErrorBoundary>
      <div ref={scrollRef}>
        <NetworkStatus />
        <TokenCounter tokens={tokenTracker.totalTokens} />
        <ChatWindow
          messages={convertedMessages}
          isLoading={isLoading}
          onSendMessage={async (content) => {
            await append({ role: 'user', content })
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
```

### After (New API - 5 lines)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** All the features (error boundaries, network status, token tracking, auto-scroll) are included automatically.

---

## 📋 Migration Patterns

### Pattern 1: Basic Chat

#### Old Way
```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
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

#### New Way
```tsx
import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

---

### Pattern 2: Chat with Message Operations

#### Old Way
```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMessageOperations } from '@clarity-chat/react'

function App() {
  const chat = useClarityChat({ api: '/api/chat' })
  const operations = useMessageOperations({ initialMessages: [] })
  // ... manual wiring ...
}
```

#### New Way
```tsx
import { useChatWithOperations, ChatWindow } from '@clarity-chat/react'

function App() {
  const {
    messages,
    append,
    isLoading,
    editMessage,
    regenerateMessage,
    deleteMessage,
  } = useChatWithOperations({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      onEditMessage={editMessage}
      onRegenerateMessage={regenerateMessage}
      onDeleteMessage={deleteMessage}
    />
  )
}
```

**Or even simpler:**
```tsx
import { ClarityChat } from '@clarity-chat/react'

export default function App() {
  return <ClarityChat api="/api/chat" enableMessageOperations />
}
```

---

### Pattern 3: Chat with Custom Callbacks

#### Old Way
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  onFinish: (message) => {
    console.log('Received:', message)
  },
  onError: (error) => {
    console.error('Error:', error)
  },
})
```

#### New Way
```tsx
<ClarityChat
  api="/api/chat"
  onMessageReceived={(msg) => console.log('Received:', msg)}
  onError={(error) => console.error('Error:', error)}
/>
```

---

### Pattern 4: Chat with Memory

#### Old Way
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'vector-store',
  },
})
```

#### New Way
```tsx
<ClarityChat
  api="/api/chat"
  enableMemory
  memoryStrategy="vector-store"
/>
```

---

### Pattern 5: Chat with Analytics

#### Old Way
```tsx
import { useClarityChatWithAnalytics } from '@clarity-chat/react'

const chat = useClarityChatWithAnalytics({
  api: '/api/chat',
  analytics: {
    trackMessageSent: (content) => analytics.track('message_sent', { content }),
    trackMessageReceived: (message) => analytics.track('message_received', { message }),
  },
})
```

#### New Way
```tsx
import { ClarityChat } from '@clarity-chat/react'

<ClarityChat
  api="/api/chat"
  onMessageSent={(msg) => analytics.track('message_sent', { content: msg.content })}
  onMessageReceived={(msg) => analytics.track('message_received', { message: msg })}
/>
```

---

### Pattern 6: Chat with Custom Styling

#### Old Way
```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  className="my-custom-chat"
  showHeader
  sessionTitle="My Chat"
/>
```

#### New Way
```tsx
<ClarityChat
  api="/api/chat"
  className="my-custom-chat"
  showHeader
  sessionTitle="My Chat"
/>
```

---

## 🔄 Component Props Migration

### ChatWindow Props

#### Old Way
```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  onMessageCopy={handleCopy}
  onMessageFeedback={handleFeedback}
  onMessageRetry={handleRetry}
  headerActions={actions}
  emptyState={customEmpty}
/>
```

#### New Way
```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  advanced={{
    onMessageCopy: handleCopy,
    onMessageFeedback: handleFeedback,
    onMessageRetry: handleRetry,
    headerActions: actions,
    emptyState: customEmpty,
  }}
/>
```

**Benefits:**
- Cleaner prop surface
- Better autocomplete
- Clear separation of basic vs advanced

---

## 🎯 Migration Checklist

- [ ] Replace `useClarityChat` + `ChatWindow` + `convertCoreMessagesToMessages` with `ClarityChat`
- [ ] Remove manual `ErrorBoundary` setup (now included)
- [ ] Remove manual `NetworkStatus` setup (now included)
- [ ] Remove manual `TokenCounter` setup (now included)
- [ ] Remove manual `useAutoScroll` setup (now included)
- [ ] Replace `useClarityChat` + `useMessageOperations` with `useChatWithOperations`
- [ ] Move advanced `ChatWindow` props to `advanced` prop
- [ ] Update imports to use new APIs

---

## ⚠️ Breaking Changes

**None!** All old APIs still work. You can migrate gradually:

1. **Phase 1**: Keep using old API (works fine)
2. **Phase 2**: Migrate new components to `ClarityChat`
3. **Phase 3**: Migrate existing components gradually
4. **Phase 4**: Fully migrate to new APIs

---

## 🆘 Need Help?

- **Examples**: See `apps/examples/`
- **Recipes**: See `packages/react/src/recipes.tsx`
- **Quick Start**: See `QUICK_START_GUIDE.md`
- **Documentation**: See `README.md`

---

## 📚 Related Documentation

- **Quick Start Guide**: `QUICK_START_GUIDE.md`
- **Recipes**: `packages/react/src/recipes.tsx`
- **Examples**: `apps/examples/`
