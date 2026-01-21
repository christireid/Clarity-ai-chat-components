# Hooks Overview

Clarity Chat provides a comprehensive set of React hooks organized in a three-tier architecture. Hooks are type-safe and integrate seamlessly with streaming model adapters.

## Hook Architecture

| Tier | Purpose | Examples |
|------|---------|----------|
| **Top-Level** | Drop-in ready, full features | `useClarityChat`, `useClarityChatWithTools` |
| **Mid-Level** | Building blocks for custom implementations | `useAssistant`, `useCompletion`, `useStreaming` |
| **Low-Level** | Foundational utilities | `useDebounce`, `useThrottle`, `useSafeTimeout` |

## Top-Level Hooks (Recommended)

### `useClarityChat`

The primary hook for chat functionality. Includes memory integration, token optimization, and streaming support.

```tsx
import { ChatWindow, useClarityChat } from '@clarity-chat/react'

export function SupportWidget() {
  const {
    messages,
    isLoading,
    append,
    error,
  } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true },
    tokenOptimization: { enabled: true },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={content => append({ role: 'user', content })}
    />
  )
}
```

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

## Utility Hooks

### `useMessageOperations`

Provides helpers for branching, editing, retrying, and tagging messages. Ideal for human-in-the-loop review flows.

### `useTokenTracker`

Track token usage and estimate costs for AI API calls.

### `useKeyboardShortcuts`

Register keyboard shortcuts with cross-platform modifier support.

## Legacy Hooks

### `useChat` (Deprecated)

> **Note:** `useChat` is maintained for backwards compatibility. For new projects, use `useClarityChat` instead.

## Best Practices

- Start with top-level hooks (`useClarityChat`) for most use cases
- Use mid-level hooks when you need more control over specific features
- Scope hooks per conversation to avoid cross-talk between concurrent chats
- Pair streaming hooks with `StreamingMessage` to reflect gradual completions

Continue with the [Message Handling](/guide/messages) topic to learn how to model roles, attachments, and metadata.
