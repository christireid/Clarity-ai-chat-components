# useClarityChat

> Primary hook for managing chat state and interactions in Clarity Chat.

## Overview

`useClarityChat` is the **top-level API** for chat functionality. It provides:

- **Message State Management**: Track messages, loading state, and errors
- **Memory Integration**: Optional long-term memory with vector search
- **Prompt Optimization**: Automatic token budget management
- **Transport Selection**: SSE (default) or WebSocket protocols

## Quick Start

```tsx
import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

## With Memory

```tsx
import { useClarityChat, MemoryProvider } from '@clarity-chat/react'

// Wrap your app with MemoryProvider
;<MemoryProvider config={{ strategy: 'vector-store' }}>
  <ChatComponent />
</MemoryProvider>

// In your component
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 2000,
  },
})
```

## With Prompt Optimization

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'hybrid',
    keepRecent: 3,
  },
})

// Access token stats
console.log(chat.tokenStats?.utilization) // 0.75 = 75% of budget used
```

## API Reference

### Options

| Option               | Type                               | Default      | Description          |
| -------------------- | ---------------------------------- | ------------ | -------------------- |
| `api`                | `string`                           | **required** | API endpoint URL     |
| `memory`             | `ClarityMemoryOptions`             | `undefined`  | Memory configuration |
| `transport`          | `'sse' \| 'websocket'`             | `'sse'`      | Transport protocol   |
| `promptOptimization` | `ClarityPromptOptimizationOptions` | `undefined`  | Token optimization   |

### Return Value

| Property          | Type                    | Description         |
| ----------------- | ----------------------- | ------------------- |
| `messages`        | `CoreMessage[]`         | Current messages    |
| `append`          | `function`              | Add a message       |
| `reload`          | `function`              | Reload last message |
| `stop`            | `function`              | Stop streaming      |
| `isLoading`       | `boolean`               | Loading state       |
| `error`           | `Error \| null`         | Last error          |
| `memoryInfo`      | `ClarityChatMemoryInfo` | Memory statistics   |
| `memoryErrorInfo` | `ClarityChatErrorInfo`  | Memory error info   |
| `tokenStats`      | `ClarityChatTokenStats` | Token statistics    |

## Architecture

```
useClarityChat (Top-Level)
    └── useChatEnhanced (Mid-Level)
            └── useChat (Low-Level)
```

For more control, use `useChatEnhanced` or `useChat` directly.

## File Structure

```
use-clarity-chat/
├── index.ts              # Public exports
├── use-clarity-chat.ts   # Main hook implementation
├── types.ts              # Type definitions
├── helpers.ts            # Internal utilities
└── README.md             # This file
```
