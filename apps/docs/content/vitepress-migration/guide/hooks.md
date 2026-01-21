# Hooks Overview

Clarity Chat exposes ergonomic React hooks that encapsulate common chat workflows, state machines, and side effects. Hooks are type-safe and integrate seamlessly with streaming model adapters.

## 🆕 `useClarityChat` - Flagship Hook (Recommended)

**The primary hook for production chat applications** with memory integration, streaming, and enterprise features.

**Key Features:**
- ✅ **Memory Integration**: Sliding-window, semantic-chunks, or vector-store strategies
- ✅ **Race-Condition-Free**: Stable async memory operations
- ✅ **Transport Selection**: SSE or WebSocket streaming
- ✅ **Context Enrichment**: Automatic memory context injection
- ✅ **Error Recovery**: Built-in retry logic and error classification

```tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

export function EnterpriseChat() {
  const {
    messages,
    append,
    isLoading,
    memoryInfo,
    contextSummary,
    error
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store', // sliding-window | semantic-chunks | vector-store
      maxTokens: 4000
    },
    transport: 'sse' // 'sse' | 'websocket'
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}

      // 🎯 New grouped props API
      header={{
        show: true,
        title: 'AI Assistant',
        showMessageCount: true
      }}

      messageActions={{
        onFeedback: (id, type) => console.log('Feedback:', id, type),
        onRetry: (id) => console.log('Retry:', id)
      }}
    />
  )
}
```

### Memory Strategies

| Strategy | Use Case | Performance | Context Quality |
|----------|----------|-------------|-----------------|
| `sliding-window` | Short conversations | ⚡ Fast | 📝 Recent context |
| `semantic-chunks` | Medium conversations | ⚖️ Balanced | 🎯 Relevant chunks |
| `vector-store` | Enterprise/long-term | 🐌 Slower | 🔍 Semantic search |

## `useChat` - Basic Hook

Manages end-to-end chat state for simpler use cases without memory integration.

```tsx
import { ChatWindow, useChat } from '@clarity-chat/react'

export function BasicChat() {
  const {
    messages,
    isLoading,
    sendMessage,
  } = useChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

## `useStreamingChat` - Advanced Streaming

Orchestrates live token streaming with abort/timeout management for complex streaming scenarios.

## Best Practices

- Scope hooks per conversation to avoid cross-talk between concurrent chats.
- Combine `useChat` with `ModelSelector` to dynamically switch adapters based on operator input.
- Pair `useStreamingChat` with `StreamingMessage` to reflect gradual completions without blocking UI.

Continue with the [Message Handling](/guide/messages) topic to learn how to model roles, attachments, and metadata.
