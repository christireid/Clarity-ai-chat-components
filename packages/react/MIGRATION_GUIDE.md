# Migration Guide

## Overview

This guide helps you migrate from older versions of Clarity Chat or from similar libraries (like Vercel AI SDK UI) to the latest Clarity Chat architecture.

**Last Updated**: Phase 4 Migration Guide

---

## Migrating to Clarity Chat 1.0

### What Changed

**Architecture**:
- ✅ Layered architecture (top/mid/low)
- ✅ Domain-organized exports
- ✅ Consistent API shapes
- ✅ Runtime validation

**APIs**:
- ✅ New top-level components (`ClarityChat`, `ChatWithMemory`)
- ✅ Simplified hooks (`useChat`)
- ✅ Improved error messages
- ✅ Better TypeScript types

**Breaking Changes**:
- ⚠️ None! 100% backward compatible

---

## From Vercel AI SDK UI

### Before (Vercel AI SDK UI)

```tsx
import { useChat } from 'ai/react'

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button>Send</button>
      </form>
    </div>
  )
}
```

### After (Clarity Chat - Simplest)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  return <ClarityChat api="/api/chat" />
}
```

### After (Clarity Chat - More Control)

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

### Key Differences

| Feature | Vercel AI SDK UI | Clarity Chat |
|---------|-----------------|--------------|
| **Setup** | Hook + manual UI | One component |
| **Message Format** | `CoreMessage[]` | `Message[]` (auto-converted) |
| **Input Handling** | Manual form | Built-in |
| **Loading States** | Manual | Automatic |
| **Error Handling** | Manual | Built-in |
| **Memory** | Not included | Built-in (3 strategies) |
| **Analytics** | Not included | Built-in |

---

## From Old Clarity Chat Versions

### Before (Old API)

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })
  
  // Manual message conversion
  const convertedMessages = messages.map(m => ({
    id: m.id,
    role: m.role,
    content: m.content,
    // ... manual conversion
  }))
  
  return (
    <ChatWindow
      messages={convertedMessages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### After (New API - Simplest)

```tsx
import { ClarityChat } from '@clarity-chat/react'

function Chat() {
  return <ClarityChat api="/api/chat" />
}
```

### After (New API - More Control)

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  // Automatic message conversion - no manual work needed!
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

### Key Improvements

1. **Automatic Message Conversion**: No more manual `convertCoreMessagesToMessages`
2. **Simplified API**: `sendMessage` instead of `append({ role: 'user', content })`
3. **Better Errors**: Runtime validation with helpful messages
4. **Memory Built-in**: Use `ChatWithMemory` for instant memory support

---

## API Mapping

### Hooks

| Old API | New API | Notes |
|---------|---------|-------|
| `useClarityChat` | `useClarityChat` | Still available, enhanced |
| `useClarityChat` | `useChat` | Simplified version |
| `useChatLegacy` | `useChatLegacy` | Still available (backward compat) |
| `useChatEnhanced` | `useChatEnhanced` | Still available (advanced) |

### Components

| Old API | New API | Notes |
|---------|---------|-------|
| `ChatWindow` | `ChatWindow` | Enhanced with validation |
| `ChatWindow` | `ClarityChat` | Drop-in component |
| N/A | `ChatWithMemory` | New - pre-configured memory |
| N/A | `ChatComplete` | New - full stack |

### Utilities

| Old API | New API | Notes |
|---------|---------|-------|
| `coreMessagesToMessages` | `convertCoreMessagesToMessages` | Renamed (old still works) |
| `coreMessageToMessage` | `convertCoreMessageToMessage` | Renamed (old still works) |

---

## Step-by-Step Migration

### Step 1: Update Imports

**Before**:
```tsx
import { useClarityChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'
```

**After**:
```tsx
import { ClarityChat } from '@clarity-chat/react'
// Or for more control:
import { useChat, ChatWindow } from '@clarity-chat/react'
```

### Step 2: Simplify Component

**Before**:
```tsx
function Chat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })
  
  const messages = useMemo(
    () => coreMessagesToMessages(coreMessages),
    [coreMessages]
  )
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

**After**:
```tsx
function Chat() {
  return <ClarityChat api="/api/chat" />
}
```

### Step 3: Add Customization (If Needed)

```tsx
function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      showHeader
      sessionTitle="My Chat"
      onMessageFeedback={(id, type) => {
        // Custom feedback handling
      }}
    />
  )
}
```

### Step 4: Add Memory (Optional)

```tsx
import { ChatWithMemory } from '@clarity-chat/react'

function Chat() {
  return (
    <ChatWithMemory
      api="/api/chat"
      strategy="vector-store"
    />
  )
}
```

---

## Common Migration Patterns

### Pattern 1: Simple Chat

**Before**:
```tsx
const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
```

**After**:
```tsx
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
```

**Change**: `append` → `sendMessage`, automatic conversion

---

### Pattern 2: Chat with Memory

**Before**:
```tsx
<MemoryProvider config={...}>
  <ClarityChat api="/api/chat" memory={{ enabled: true }} />
</MemoryProvider>
```

**After**:
```tsx
<ChatWithMemory api="/api/chat" strategy="vector-store" />
```

**Change**: Pre-configured component, no provider needed

---

### Pattern 3: Custom UI

**Before**:
```tsx
const { messages, append } = useClarityChat({ api: '/api/chat' })
const converted = convertCoreMessagesToMessages(messages)
// Custom UI with converted messages
```

**After**:
```tsx
const { messages, sendMessage } = useChat({ api: '/api/chat' })
// Use messages directly - already converted!
```

**Change**: No manual conversion needed

---

## Deprecated APIs

These APIs still work but are deprecated:

- `coreMessagesToMessages` → Use `convertCoreMessagesToMessages`
- `coreMessageToMessage` → Use `convertCoreMessageToMessage`
- `useClarityChatWithWindow` → Use `ClarityChat` component

**Migration**: Update imports and function calls. Old APIs will be removed in v2.0.

---

## Troubleshooting

### Error: "Missing required prop 'api'"

**Solution**: Add `api` prop:
```tsx
<ClarityChat api="/api/chat" />
```

### Error: "MemoryProvider is not available"

**Solution**: Wrap with `MemoryProvider` or use `ChatWithMemory`:
```tsx
<ChatWithMemory api="/api/chat" />
```

### Error: "Invalid 'strategy' prop"

**Solution**: Use valid strategy:
```tsx
strategy="vector-store" // or "sliding-window" or "semantic-chunks"
```

---

## Need Help?

- Check [API Reference](./API_REFERENCE.md)
- See [Examples](./src/examples/)
- Read [Architecture Guide](./ARCHITECTURE_REFERENCE.md)
- Open an issue

---

**Last Updated**: Phase 4 Migration Guide  
**Status**: ✅ Complete
