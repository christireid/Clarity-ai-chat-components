# Clarity Chat Quick Start Guide

## 🚀 Get Started in 5 Lines

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** You now have a production-ready AI chat interface.

---

## 📚 API Layers

### Layer 1: Simplest (Component)
**Use when**: You want the easiest possible setup

```tsx
import { ClarityChat } from '@clarity-chat/react'

<ClarityChat api="/api/chat" />
```

**Features included:**
- ✅ Error handling
- ✅ Network status
- ✅ Token tracking
- ✅ Auto-scroll
- ✅ Message operations (edit/regenerate/delete)
- ✅ Responsive design

### Layer 2: Customized (Component with Props)
**Use when**: You want to customize appearance/behavior

```tsx
import { ClarityChat } from '@clarity-chat/react'

<ClarityChat
  api="/api/chat"
  theme="dark"
  enableMemory
  showTokenCounter
  onMessageSent={(msg) => console.log(msg)}
/>
```

### Layer 3: Hook-Based (More Control)
**Use when**: You need more control over the chat state

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

### Layer 4: Composed Hooks (Common Patterns)
**Use when**: You want common patterns pre-composed

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

### Layer 5: Individual Hooks (Maximum Control)
**Use when**: You need full control over every aspect

```tsx
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages,
  useAutoScroll,
  useTokenTracker,
  ErrorBoundary,
} from '@clarity-chat/react'

// Wire everything together manually
```

---

## 🎯 Common Use Cases

### Basic Chat
```tsx
<ClarityChat api="/api/chat" />
```

### Dark Theme
```tsx
<ClarityChat api="/api/chat" theme="dark" />
```

### With Memory
```tsx
<ClarityChat api="/api/chat" enableMemory memoryStrategy="vector-store" />
```

### With Custom Header
```tsx
<ClarityChat
  api="/api/chat"
  showHeader
  sessionTitle="My Assistant"
  sessionSubtitle="Ask me anything!"
/>
```

### With Callbacks
```tsx
<ClarityChat
  api="/api/chat"
  onMessageSent={(msg) => console.log('Sent:', msg)}
  onMessageReceived={(msg) => console.log('Received:', msg)}
  onError={(error) => console.error('Error:', error)}
/>
```

### Streaming Chat
```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function App() {
  const chat = useClarityChat({
    api: '/api/chat/stream',
    transport: 'sse', // Server-Sent Events
  })

  const messages = convertCoreMessagesToMessages(chat.messages)

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}
```

---

## 🔧 Configuration Options

### ClarityChat Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api` | `string` | **required** | API endpoint URL |
| `theme` | `string` | `"default"` | Theme name |
| `enableMemory` | `boolean` | `false` | Enable memory integration |
| `memoryStrategy` | `string` | `"sliding-window"` | Memory strategy |
| `showTokenCounter` | `boolean` | `true` | Show token counter |
| `showNetworkStatus` | `boolean` | `true` | Show network status |
| `showHeader` | `boolean` | `false` | Show header |
| `sessionTitle` | `string` | `"Chat"` | Session title |
| `sessionSubtitle` | `string` | - | Session subtitle |
| `enableMessageOperations` | `boolean` | `true` | Enable edit/regenerate/delete |
| `onMessageSent` | `function` | - | Callback when message sent |
| `onMessageReceived` | `function` | - | Callback when message received |
| `onError` | `function` | - | Callback on error |

---

## 📖 Examples

- **Minimal**: `apps/examples/minimal-chat/` - Simplest usage
- **Customized**: `apps/examples/customized-chat/` - Customization examples
- **Basic**: `apps/examples/basic-chat/` - Full feature demo
- **Advanced**: `apps/examples/advanced-chat-features/` - All features

---

## 🆘 Need Help?

- **Documentation**: See `README.md`
- **Examples**: See `apps/examples/`
- **Recipes**: See `packages/react/src/recipes.tsx`
- **API Reference**: See `apps/docs/`

---

## 🎉 Next Steps

1. **Try the minimal example**: `apps/examples/minimal-chat/`
2. **Customize it**: See `apps/examples/customized-chat/`
3. **Explore advanced features**: See `apps/examples/advanced-chat-features/`
4. **Read the docs**: See `README.md` for full documentation
