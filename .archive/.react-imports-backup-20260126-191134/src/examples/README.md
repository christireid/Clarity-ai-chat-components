# Examples Directory

## Overview

This directory contains example implementations demonstrating how to use Clarity Chat in various scenarios.

**Last Updated**: Post-Phase 4 Cleanup

---

## 📚 Example Organization

### Phase 4 Examples (Recommended) ⭐

These are the most up-to-date examples following Phase 4 architecture:

1. **`hello-world-examples.tsx`** - Simplest possible usage (1-12 LOC)
   - `HelloWorld_ClarityChat` - One-line component
   - `HelloWorld_ClarityChatStyled` - With styling
   - `HelloWorld_UseChat` - Using simplified hook
   - `HelloWorld_ChatWithMemory` - With memory
   - `HelloWorld_UseChatPersistent` - With persistence

2. **`intermediate-examples.tsx`** - Real-world patterns (35-50 LOC)
   - `Intermediate_CustomChat` - Custom header and actions
   - `Intermediate_ChatWithAnalytics` - Analytics integration
   - `Intermediate_ChatWithMemoryCustom` - Memory customization
   - `Intermediate_ChatWithErrorHandling` - Error handling

3. **`advanced-examples.tsx`** - Enterprise patterns (70-100 LOC)
   - `Advanced_EnterpriseChatStack` - Full enterprise stack
   - `Advanced_CustomDashboard` - Custom dashboard
   - `Advanced_MultiChat` - Multiple chat instances
   - `Advanced_CustomIntegrations` - Custom integrations

### Legacy Examples

These examples are still functional but may use older patterns:

- `basic-clarity-chat-example.tsx` - Basic usage with `useClarityChat`
- `clarity-chat-quickstart.tsx` - Quickstart examples
- `advanced-clarity-chat-example.tsx` - Advanced features
- `clarity-chat-with-memory-example.tsx` - Memory examples
- `clarity-chat-error-handling-example.tsx` - Error handling
- `clarity-chat-websocket-example.tsx` - WebSocket examples
- And more...

**Note**: Legacy examples are kept for backward compatibility but new code should prefer Phase 4 examples.

---

## 🎯 Quick Start

### Simplest Example

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

See `hello-world-examples.tsx` for more simple examples.

### With More Control

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

function App() {
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

See `intermediate-examples.tsx` for more patterns.

### Enterprise Example

```tsx
import { ChatComplete, MemoryProvider, AnalyticsProvider } from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider config={{ endpoint: '/api/analytics' }}>
      <MemoryProvider config={{ maxTokens: 10000 }}>
        <ChatComplete api="/api/chat" memoryStrategy="vector-store" />
      </MemoryProvider>
    </AnalyticsProvider>
  )
}
```

See `advanced-examples.tsx` for more enterprise patterns.

---

## 📖 Example Categories

### By Complexity

- **Hello World** (1-12 LOC) - Simplest usage
- **Intermediate** (35-50 LOC) - Real-world patterns
- **Advanced** (70-100 LOC) - Enterprise patterns

### By Feature

- **Basic Chat** - Simple chat interface
- **Memory** - Chat with memory enabled
- **Analytics** - Chat with analytics tracking
- **Error Handling** - Chat with error boundaries
- **WebSocket** - WebSocket transport
- **Custom UI** - Custom chat interfaces
- **Enterprise** - Full-featured stack

---

## 🔄 Migration

### From Legacy Examples

If you're using legacy examples, consider migrating to Phase 4 examples:

**Before** (Legacy):
```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

const { messages: coreMessages, append } = useClarityChat({ api: '/api/chat' })
const messages = convertCoreMessagesToMessages(coreMessages)
```

**After** (Phase 4):
```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

const { messages, sendMessage } = useChat({ api: '/api/chat' })
// messages already converted!
```

**Benefits**:
- Simpler API
- Automatic message conversion
- Better error messages
- Runtime validation

---

## 📝 Contributing Examples

When adding new examples:

1. **Follow Phase 4 patterns** - Use new APIs (`ClarityChat`, `useChat`, etc.)
2. **Include JSDoc** - Document what the example demonstrates
3. **Keep it simple** - Focus on one feature or pattern
4. **Add to appropriate file** - Hello World, Intermediate, or Advanced
5. **Update this README** - Add your example to the list

---

## 🔗 Related Documentation

- [TUTORIALS.md](../TUTORIALS.md) - Step-by-step tutorials
- [PUBLIC_API_TABLE.md](../PUBLIC_API_TABLE.md) - Complete API reference
- [README.md](../README.md) - Main documentation

---

**Last Updated**: Post-Phase 4 Cleanup  
**Status**: ✅ Organized and documented
