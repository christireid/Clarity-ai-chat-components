# useClarityChat - Complete Guide

## Overview

`useClarityChat` is Clarity's flagship chat hook, providing a production-ready API for building AI chat interfaces. It's a drop-in replacement for Vercel AI SDK's `useChat` with additional enterprise features.

## Quick Start

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={convertCoreMessagesToMessages(messages)}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Migration Guide](#migration-guide)
7. [Helper Hooks](#helper-hooks)
8. [TypeScript](#typescript)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Basic Usage

### Minimal Example

```tsx
import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, input, setInput, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.role}: {msg.content}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => append({ role: 'user', content: input })}>
        Send
      </button>
    </div>
  )
}
```

### With ChatWindow Component

```tsx
import { 
  useClarityChat, 
  ChatWindow, 
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={convertCoreMessagesToMessages(messages)}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

## Features

### ✅ Core Features (Vercel-Compatible)

- ✅ Streaming chat with SSE
- ✅ Message management
- ✅ Input handling
- ✅ Loading states
- ✅ Error handling
- ✅ Form submission

### 🚀 Enhanced Features

- ✅ **Memory Integration** - Automatic context management
- ✅ **WebSocket Support** - Bidirectional real-time communication
- ✅ **Error Recovery** - Automatic retry with exponential backoff
- ✅ **TypeScript Utilities** - Enhanced types and helpers
- ✅ **Helper Hooks** - Common patterns pre-built

## API Reference

See [USE_CLARITY_CHAT.md](./USE_CLARITY_CHAT.md) for complete API documentation.

## Examples

### Basic Chat
See [basic-clarity-chat-example.tsx](../examples/basic-clarity-chat-example.tsx)

### With Memory
See [clarity-chat-with-memory-example.tsx](../examples/clarity-chat-with-memory-example.tsx)

### With WebSocket
See [clarity-chat-websocket-example.tsx](../examples/clarity-chat-websocket-example.tsx)

### Error Handling
See [clarity-chat-error-handling-example.tsx](../examples/clarity-chat-error-handling-example.tsx)

### Advanced Features
See [clarity-chat-advanced-example.tsx](../examples/clarity-chat-advanced-example.tsx)

## Migration Guide

Migrating from Vercel AI SDK? See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## Helper Hooks

### useClarityChatWithWindow

Pre-configured for ChatWindow component:

```tsx
import { useClarityChatWithWindow } from '@clarity-chat/react'

const { messages, handleSendMessage, isLoading } = useClarityChatWithWindow({
  api: '/api/chat',
})

// messages is already converted to Message[] format
<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
/>
```

### useClarityChatWithAnalytics

Built-in analytics tracking:

```tsx
import { useClarityChatWithAnalytics } from '@clarity-chat/react'

const chat = useClarityChatWithAnalytics({
  api: '/api/chat',
  analytics: {
    trackMessageSent: (content) => {
      analytics.track('message_sent', { content })
    },
    trackMessageReceived: (message) => {
      analytics.track('message_received', { role: message.role })
    },
  },
})
```

### useClarityChatWithPersistence

Local storage persistence:

```tsx
import { useClarityChatWithPersistence } from '@clarity-chat/react'

const chat = useClarityChatWithPersistence({
  api: '/api/chat',
  storageKey: 'my-chat',
  persistMessages: true,
  persistInput: true,
})

// Messages and input are automatically saved/restored
// Clear with: chat.clearPersistence()
```

### useClarityChatWithDebounce

Debounced input:

```tsx
import { useClarityChatWithDebounce } from '@clarity-chat/react'

const { input, debouncedInput, ...rest } = useClarityChatWithDebounce({
  api: '/api/chat',
  debounceMs: 300,
})

// debouncedInput updates 300ms after user stops typing
```

### useClarityChatWithAutoSave

Automatic draft saving:

```tsx
import { useClarityChatWithAutoSave } from '@clarity-chat/react'

const { input, clearDraft, ...rest } = useClarityChatWithAutoSave({
  api: '/api/chat',
  autoSaveKey: 'chat-draft',
  autoSaveInterval: 5000, // Save every 5 seconds
})

// Input is automatically saved as draft
// Clear with: clearDraft()
```

## TypeScript

### Type Guards

```tsx
import { 
  isMemoryEnabled, 
  isUserMessage, 
  hasTextContent 
} from '@clarity-chat/react'

if (isMemoryEnabled(options)) {
  // TypeScript knows memory is enabled
}

if (isUserMessage(message)) {
  // TypeScript knows it's a user message
}
```

### Message Creation

```tsx
import { 
  createUserMessage, 
  createAssistantMessage 
} from '@clarity-chat/react'

const userMsg = createUserMessage('Hello!')
const assistantMsg = createAssistantMessage('Hi there!')
```

### Content Extraction

```tsx
import { extractTextContent } from '@clarity-chat/react'

const text = extractTextContent(message) // Always returns string
```

## Best Practices

1. **Always convert messages** when using `ChatWindow`:
   ```tsx
   const messages = convertCoreMessagesToMessages(coreMessages)
   ```

2. **Enable memory for persistent conversations**:
   ```tsx
   memory: { enabled: true, strategy: 'vector-store' }
   ```

3. **Use helper hooks** for common patterns:
   ```tsx
   useClarityChatWithWindow() // For ChatWindow
   useClarityChatWithPersistence() // For local storage
   ```

4. **Handle errors gracefully**:
   ```tsx
   const { error, memoryErrorInfo } = useClarityChat({...})
   if (error) { /* handle chat error */ }
   if (memoryErrorInfo.memoryError) { /* handle memory error */ }
   ```

5. **Wrap with MemoryProvider** when using memory:
   ```tsx
   <MemoryProvider config={{ maxMemories: 1000 }}>
     <YourChatComponent />
   </MemoryProvider>
   ```

## Troubleshooting

### Memory not working?
- Ensure `MemoryProvider` wraps your component
- Check `memory.enabled` is `true`
- Check `memoryErrorInfo` for errors

### Type errors?
- Use `convertCoreMessagesToMessages()` for `ChatWindow`
- Import types from `@clarity-chat/react`

### WebSocket issues?
- Check endpoint URL (use `ws://` or `wss://`)
- Verify server supports WebSocket

## See Also

- [USE_CLARITY_CHAT.md](./USE_CLARITY_CHAT.md) - Complete API documentation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration from Vercel AI SDK
- [VERCEL_VS_CLARITY.md](./VERCEL_VS_CLARITY.md) - Feature comparison
- [Examples](../examples/) - Complete working examples
