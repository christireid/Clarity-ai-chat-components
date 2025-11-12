# Hooks Overview

Clarity Chat exposes ergonomic React hooks that encapsulate common chat workflows, state machines, and side effects. Hooks are type-safe and integrate seamlessly with streaming model adapters.

## `useChat`

Manages end-to-end chat state, including optimistic updates, retries, and persisted history.

```tsx
import { ChatWindow, useChat } from '@clarity-chat/react'

export function SupportWidget() {
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastResponse,
  } = useChat({ chatId: 'support', model: 'gpt-4o-mini' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={content => sendMessage({ role: 'user', content })}
      onRegenerate={regenerateLastResponse}
    />
  )
}
```

## `useStreamingChat`

Helps orchestrate live token streaming via Server-Sent Events or WebSockets with built-in abort and timeout management.

## `useMessageOperations`

Provides helpers for branching, editing, retrying, and tagging messages. Ideal for human-in-the-loop review flows.

## `useComposer`

Drives the chat composer UI, exposing rich event callbacks for mention suggestions, file uploads, and slash commands.

## Best Practices

- Scope hooks per conversation to avoid cross-talk between concurrent chats.
- Combine `useChat` with `ModelSelector` to dynamically switch adapters based on operator input.
- Pair `useStreamingChat` with `StreamingMessage` to reflect gradual completions without blocking UI.

Continue with the [Message Handling](/guide/messages) topic to learn how to model roles, attachments, and metadata.
