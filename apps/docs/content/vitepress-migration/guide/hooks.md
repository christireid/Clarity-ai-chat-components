# Hooks Overview

Clarity Chat provides a comprehensive set of React hooks organized in a three-tier architecture. Hooks are type-safe and integrate seamlessly with streaming model adapters.

## Hook Architecture

| Tier | Purpose | Examples |
|------|---------|----------|
| **Top-Level** | Drop-in ready, full features | `useClarityChat`, `useClarityChatWithTools` |
| **Mid-Level** | Building blocks for custom implementations | `useAssistant`, `useCompletion`, `useStreaming` |
| **Low-Level** | Foundational utilities | `useDebounce`, `useThrottle`, `useSafeTimeout` |

## Top-Level Hooks (Recommended)

### `useClarityChat` - Flagship Hook

**The primary hook for production chat applications** with memory integration, streaming, and enterprise features.

**Key Features:**
- ✅ **Memory Integration**: Sliding-window, semantic-chunks, or vector-store strategies
- ✅ **Race-Condition-Free**: Stable async memory operations
- ✅ **Transport Selection**: SSE or WebSocket streaming
- ✅ **Context Enrichment**: Automatic memory context injection
- ✅ **Error Recovery**: Built-in retry logic and error classification

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

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
    transport: 'sse', // 'sse' | 'websocket'
    tokenOptimization: { enabled: true },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
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

### `useClarityChatWithTools`

Extended chat hook with integrated tool calling support.

```tsx
import { useClarityChatWithTools } from '@clarity-chat/react'

const { messages, append, toolInvocations } = useClarityChatWithTools({
  api: '/api/chat',
  tools: [weatherTool, calculatorTool],
  onToolCall: async (tool, args) => {
    // Handle tool execution
  },
})
```

## Mid-Level Hooks

### `useAssistant`

For AI assistants with tool calling, status tracking, and streaming support.

### `useCompletion`

For single-turn text completions with caching and progress tracking.

### `useStreaming`

Low-level streaming primitive for custom streaming implementations.

### `useStreamingChat`

Orchestrates live token streaming with abort/timeout management for complex streaming scenarios.

## Utility Hooks

### `useMessageOperations`

Manages end-to-end chat state for simpler use cases without memory integration.

### `useTokenTracker`

Track token usage and estimate costs for AI API calls.

### `useKeyboardShortcuts`

Register keyboard shortcuts with cross-platform modifier support.

## Best Practices

- Start with top-level hooks (`useClarityChat`) for most use cases
- Use mid-level hooks when you need more control over specific features
- Scope hooks per conversation to avoid cross-talk between concurrent chats
- Pair streaming hooks with `StreamingMessage` to reflect gradual completions

Continue with the [Message Handling](/guide/messages) topic to learn how to model roles, attachments, and metadata.
