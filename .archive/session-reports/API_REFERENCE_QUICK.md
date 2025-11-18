# API Reference Quick Guide

Quick reference for the most commonly used APIs.

---

## 🎯 High-Level Components (Simplest)

### `ClarityChatSimple`
Ultra-minimal - just 1 prop.

```tsx
import { ClarityChatSimple } from '@clarity-chat/react'

<ClarityChatSimple endpoint="/api/chat" />
```

**Props:**
- `endpoint` (required) - API endpoint URL
- `theme?` - Theme name

---

### `ClarityChat`
Drop-in ready component - handles everything.

```tsx
import { ClarityChat } from '@clarity-chat/react'

<ClarityChat api="/api/chat" />
```

**Key Props:**
- `api` (required) - API endpoint URL
- `theme?` - Theme name
- `enableMemory?` - Enable memory integration
- `showTokenCounter?` - Show token counter (default: true)
- `showNetworkStatus?` - Show network status (default: true)
- `onMessageSent?` - Callback when message sent
- `onMessageReceived?` - Callback when message received
- `onError?` - Callback on error

---

## 🪝 Hooks

### `useChatSimple`
Simplified hook - messages already converted.

```tsx
import { useChatSimple, ChatWindow } from '@clarity-chat/react'

const { messages, sendMessage, isLoading } = useChatSimple({ api: '/api/chat' })

<ChatWindow messages={messages} isLoading={isLoading} onSendMessage={sendMessage} />
```

**Returns:**
- `messages` - Message[] (already converted)
- `sendMessage` - (content: string) => Promise<void>
- `isLoading` - boolean
- `error` - Error | null
- `clearMessages` - () => void

---

### `useChatWithOperations`
Composed hook - chat + message operations.

```tsx
import { useChatWithOperations } from '@clarity-chat/react'

const {
  messages,
  append,
  isLoading,
  editMessage,
  regenerateMessage,
  deleteMessage,
  undo,
  redo,
} = useChatWithOperations({ api: '/api/chat' })
```

**Returns:**
- All `useChatSimple` returns
- `editMessage` - (id: string, content: string) => void
- `regenerateMessage` - (id: string) => void
- `deleteMessage` - (id: string) => void
- `undo` - () => void
- `redo` - () => void
- `canUndo` - boolean
- `canRedo` - boolean

---

### `useClarityChat`
Full-featured hook - maximum control.

```tsx
import { useClarityChat, convertCoreMessagesToMessages } from '@clarity-chat/react'

const chat = useClarityChat({ api: '/api/chat' })
const messages = convertCoreMessagesToMessages(chat.messages)
```

**Returns:**
- `messages` - CoreMessage[] (needs conversion)
- `append` - (message) => Promise<void>
- `isLoading` - boolean
- `error` - Error | null
- Plus memory, token stats, etc.

---

## 🧩 Components

### `ChatWindow`
Main chat UI component.

```tsx
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
/>
```

**Key Props:**
- `messages` (required) - Message[]
- `isLoading?` - boolean
- `onSendMessage` (required) - (content: string) => void
- `onEditMessage?` - (id: string) => void
- `onRegenerateMessage?` - (id: string) => void
- `onDeleteMessage?` - (id: string) => void
- `advanced?` - Advanced options object

---

## 📦 Import Paths

### Full Library
```tsx
import { ClarityChat } from '@clarity-chat/react'
```

### Core APIs Only
```tsx
import { ClarityChat } from '@clarity-chat/react/core'
```

### Styles
```tsx
import '@clarity-chat/react/dist/styles/index.css'
```

---

## 🎯 Common Patterns

### Pattern 1: Simplest
```tsx
import { ClarityChatSimple } from '@clarity-chat/react'
<ClarityChatSimple endpoint="/api/chat" />
```

### Pattern 2: Simple
```tsx
import { ClarityChat } from '@clarity-chat/react'
<ClarityChat api="/api/chat" />
```

### Pattern 3: Customized
```tsx
import { ClarityChat } from '@clarity-chat/react'
<ClarityChat api="/api/chat" theme="dark" enableMemory />
```

### Pattern 4: Hook-Based
```tsx
import { useChatSimple, ChatWindow } from '@clarity-chat/react'
const { messages, sendMessage, isLoading } = useChatSimple({ api: '/api/chat' })
<ChatWindow messages={messages} isLoading={isLoading} onSendMessage={sendMessage} />
```

### Pattern 5: With Operations
```tsx
import { useChatWithOperations, ChatWindow } from '@clarity-chat/react'
const chat = useChatWithOperations({ api: '/api/chat' })
<ChatWindow {...chat} onSendMessage={async (c) => await chat.append({ role: 'user', content: c })} />
```

---

## 📚 More Information

- **Quick Start**: `QUICK_START_GUIDE.md`
- **Migration**: `MIGRATION_GUIDE.md`
- **Recipes**: `packages/react/src/recipes.tsx`
- **Examples**: `apps/examples/`
