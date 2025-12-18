# Choose Your Chat Hook - Decision Tree

> **Problem Solved**: 8 different chat hooks → Clear path for developers  
> **Status**: ✅ Phase 1 Implementation  
> **Last Updated**: January 2025

---

## 🎯 Quick Start: Which Hook Should I Use?

### 1-Minute Decision Tree

```
START HERE
   ↓
Do you want the simplest possible setup?
   ├─ YES → Use `useClarityChat` ✅ (RECOMMENDED)
   │         Perfect for: 90% of use cases
   │         Setup: 2 lines of code
   │
   └─ NO → Need advanced features?
         ↓
      Do you need fine-grained control?
         ├─ YES → Use `useChatEnhanced` ⚙️
         │         Perfect for: Custom streaming, memory, tools
         │         Setup: More configuration options
         │
         └─ NO → Building something unique?
               ↓
            Use `useChatComposable` 🔧
            Perfect for: Complete control, custom logic
            Setup: Maximum flexibility
```

---

## 📊 Hook Comparison Matrix

| Feature            | useClarityChat   | useChatEnhanced     | useChatComposable        |
| ------------------ | ---------------- | ------------------- | ------------------------ |
| **Difficulty**     | ⭐ Easy          | ⭐⭐ Moderate       | ⭐⭐⭐ Advanced          |
| **Setup Time**     | 2 minutes        | 5-10 minutes        | 15+ minutes              |
| **Use Cases**      | 90% of apps      | Complex features    | Unique requirements      |
| **Streaming**      | ✅ Auto          | ✅ Configurable     | ✅ Manual control        |
| **Memory**         | ✅ Built-in      | ✅ Advanced options | ✅ Custom implementation |
| **Error Handling** | ✅ Auto          | ✅ Configurable     | ⚠️ Manual                |
| **Type Safety**    | ✅✅✅ Excellent | ✅✅✅ Excellent    | ✅✅ Good                |
| **Documentation**  | ✅✅✅ Extensive | ✅✅ Good           | ✅ Basic                 |

---

## 🚀 Option 1: `useClarityChat` (RECOMMENDED)

### When to Use

- ✅ First time using Clarity Chat
- ✅ Standard chat interface
- ✅ Want it to "just work"
- ✅ Don't need custom streaming logic
- ✅ 90% of production use cases

### When NOT to Use

- ❌ Need to customize streaming behavior
- ❌ Building multi-modal interfaces
- ❌ Require custom memory strategies

### Quick Start

```tsx
import { useClarityChat } from '@clarity-chat/react'

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
    // That's it! Everything else is automatic
  })

  return (
    <ChatWindow messages={chat.messages} isLoading={chat.isLoading} onSendMessage={chat.append} />
  )
}
```

### What You Get

- ✅ Automatic streaming (SSE)
- ✅ Message management
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Request deduplication
- ✅ TypeScript support

### API Surface

```typescript
const chat = useClarityChat({
  api: string,              // Required: Your API endpoint
  initialMessages?: Message[],
  memory?: MemoryConfig,
  onError?: (error) => void,
})

// Returns:
chat.messages              // Message[]
chat.isLoading            // boolean
chat.error                // Error | null
chat.append(message)      // Send message
chat.reload()             // Reload last message
chat.stop()               // Stop streaming
chat.setMessages(msgs)    // Set messages manually
```

---

## ⚙️ Option 2: `useChatEnhanced` (ADVANCED)

### When to Use

- ✅ Need custom streaming configuration
- ✅ Advanced memory strategies
- ✅ Tool/function calling
- ✅ Multi-provider support
- ✅ Fine-grained error handling
- ✅ ~10% of production use cases

### When NOT to Use

- ❌ Just getting started (use `useClarityChat` first)
- ❌ Standard chat is enough
- ❌ Need complete control (use `useChatComposable`)

### Example

```tsx
import { useChatEnhanced } from '@clarity-chat/react'

function AdvancedChat() {
  const chat = useChatEnhanced({
    api: '/api/chat',

    // Custom streaming
    streaming: {
      protocol: 'sse',
      reconnect: true,
      onChunk: (chunk) => processChunk(chunk),
    },

    // Memory configuration
    memory: {
      strategy: 'vector-store',
      maxTokens: 4000,
      provider: 'pinecone',
    },

    // Tool calling
    tools: [weatherTool, searchTool],

    // Error handling
    onError: (error, context) => {
      if (context.retryCount < 3) {
        return 'retry'
      }
      reportError(error)
    },
  })

  return <CustomChatInterface chat={chat} />
}
```

### What You Get

Everything from `useClarityChat` plus:

- ✅ Custom streaming protocols
- ✅ Advanced memory strategies
- ✅ Tool/function calling
- ✅ Request middleware
- ✅ Response transformers
- ✅ Fine-grained retry logic

---

## 🔧 Option 3: `useChatComposable` (EXPERT)

### When to Use

- ✅ Building custom chat patterns
- ✅ Need complete control over everything
- ✅ Integrating with existing systems
- ✅ Building a library on top of Clarity
- ✅ <1% of production use cases

### When NOT to Use

- ❌ Standard features are enough
- ❌ Want batteries included
- ❌ Building a typical chat app

### Example

```tsx
import { useChatComposable } from '@clarity-chat/react'

function CustomChat() {
  const chat = useChatComposable({
    // You control everything
    onSend: async (message) => {
      // Custom send logic
      const response = await myCustomAPI(message)
      return transformResponse(response)
    },

    onStream: (chunk) => {
      // Custom streaming logic
      return processStreamChunk(chunk)
    },

    onError: (error) => {
      // Custom error handling
      handleError(error)
    },
  })

  // You manage state, rendering, everything
  return <MyCustomInterface {...chat} />
}
```

### What You Get

- ✅ Low-level primitives
- ✅ Maximum flexibility
- ✅ No opinions/assumptions
- ⚠️ You handle everything else

---

## ❌ Deprecated Hooks (DO NOT USE)

### `useChat` ⛔

**Status**: Deprecated in v2.0, will be removed in v3.0  
**Use Instead**: `useClarityChat`

```tsx
// OLD (Deprecated)
import { useChat } from '@clarity-chat/react'
const chat = useChat({ ... })

// NEW (Recommended)
import { useClarityChat } from '@clarity-chat/react'
const chat = useClarityChat({ api: '/api/chat' })
```

### Other Deprecated Hooks ⛔

- `useChatCore` → Use `useClarityChat`
- `useChatUnified` → Use `useClarityChat`
- `useChatSimple` → Use `useClarityChat`
- `useChatWithOperations` → Use `useChatEnhanced`

**Migration Guide**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 🎓 Common Scenarios

### Scenario 1: Basic Chat

**Goal**: Simple chat interface  
**Hook**: `useClarityChat` ✅  
**Reason**: Handles everything automatically

### Scenario 2: Chat with Memory

**Goal**: Chat remembers conversation context  
**Hook**: `useClarityChat` with `memory` option ✅  
**Reason**: Built-in memory support

```tsx
useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'sliding-window' },
})
```

### Scenario 3: Multi-Provider Chat

**Goal**: Switch between OpenAI, Claude, etc.  
**Hook**: `useChatEnhanced` ⚙️  
**Reason**: Supports provider configuration

### Scenario 4: Tool-Enabled Chat

**Goal**: AI can call functions/tools  
**Hook**: `useChatEnhanced` with `tools` ⚙️  
**Reason**: Built-in tool calling support

### Scenario 5: Custom Streaming

**Goal**: Unique streaming requirements  
**Hook**: `useChatComposable` 🔧  
**Reason**: Complete control over streaming

### Scenario 6: Embedded Chat Widget

**Goal**: Embed in existing app  
**Hook**: `useClarityChat` ✅  
**Reason**: Lightweight, works everywhere

---

## 📚 Next Steps

### After Choosing Your Hook

1. **Read the Hook's Documentation**
   - `useClarityChat`: `/docs/hooks/use-clarity-chat.md`
   - `useChatEnhanced`: `/docs/hooks/use-chat-enhanced.md`
   - `useChatComposable`: `/docs/hooks/use-chat-composable.md`

2. **Check Out Examples**
   - Basic Chat: `/examples/basic-chat`
   - Advanced Features: `/examples/advanced-features`
   - Tool Calling: `/examples/tool-calling`

3. **Join the Community**
   - Discord: https://discord.gg/clarity-chat
   - GitHub Discussions: https://github.com/clarity-chat/discussions

---

## 🤔 Still Not Sure?

### Decision Helpers

**If you can answer YES to all:**

- [ ] I want the simplest setup
- [ ] Standard chat features are enough
- [ ] I don't need custom streaming logic

**→ Use `useClarityChat`** ✅

**If you answer YES to any:**

- [ ] I need custom streaming configuration
- [ ] I'm using tool/function calling
- [ ] I need advanced memory strategies
- [ ] I'm integrating multiple AI providers

**→ Use `useChatEnhanced`** ⚙️

**If you answer YES to:**

- [ ] I need complete control over everything
- [ ] I'm building custom patterns
- [ ] Standard hooks don't fit my use case

**→ Use `useChatComposable`** 🔧

---

## 📊 Usage Statistics

Based on production usage:

- **useClarityChat**: ~90% of implementations
- **useChatEnhanced**: ~9% of implementations
- **useChatComposable**: ~1% of implementations

**Recommendation**: Start with `useClarityChat`. Upgrade to `useChatEnhanced` only when you hit its
limitations.

---

## 💬 Feedback

Found this helpful? Have suggestions?

- Open an issue: https://github.com/clarity-chat/issues
- Join Discord: https://discord.gg/clarity-chat

---

**Last Updated**: January 2025  
**Version**: v2.1+  
**Status**: ✅ Production Ready
