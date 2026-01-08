# @clarity-chat/react

**Build beautiful AI chat interfaces in one line of code.**

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Installation

```bash
npm install @clarity-chat/react
```

## Quick Start (3 Minutes)

```tsx
import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**That's it.** You now have a production-ready chat with streaming, error handling, memory, and
accessibility.

---

## Enable Features with One Line

```tsx
// Add memory - conversations persist automatically
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Add token optimization - reduce AI costs by 60-90%
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Use a preset - pro, memory, rag, tools, or enterprise
<ClarityChatApp api="/api/chat" preset="enterprise" />

// Combine preset with custom config
<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  config={{ tokenOptimization: { budget: 16000 } }}
/>
```

### Available Presets

| Preset       | Features Included                                        |
| ------------ | -------------------------------------------------------- |
| `simple`     | Streaming + error recovery + accessible UI               |
| `pro`        | + Token stats, basic safety                              |
| `memory`     | + Memory with sliding-window                             |
| `rag`        | + Document sources, chunking, retrieval                  |
| `tools`      | + Tool calling with registry pattern                     |
| `enterprise` | **All features**: Memory, tokens, safety, RAG, analytics |

---

## Headless Mode (Full Control)

```tsx
import { useClarityChatApp } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    preset: 'pro',
  })

  return (
    <div>
      {chat.messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input
        value={chat.input}
        onChange={chat.handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && chat.handleSubmit()}
      />
      <button onClick={chat.handleSubmit}>Send</button>

      {/* Access metadata from all systems */}
      <div>Tokens: {chat.meta.token.totalTokens}</div>
      <div>Memory items: {chat.meta.memory.totalItems}</div>
    </div>
  )
}
```

---

## Why Clarity Chat?

| Feature            | Clarity Chat       | DIY Solution       |
| ------------------ | ------------------ | ------------------ |
| Setup time         | **3 minutes**      | Days               |
| Streaming          | Built-in           | Manual             |
| Memory management  | **6 presets**      | Build from scratch |
| Token optimization | **60-90% savings** | Manual             |
| Accessibility      | **WCAG AAA**       | DIY                |
| Error recovery     | Auto-retry         | Custom logic       |

---

## Core APIs

### Primary (Recommended)

| API                   | Use Case                                               |
| --------------------- | ------------------------------------------------------ |
| `<ClarityChatApp />`  | **Recommended.** Full-featured chat with one component |
| `useClarityChatApp()` | **Recommended.** Headless hook with all features       |

### Legacy (Still Supported)

| API                         | Use Case                      |
| --------------------------- | ----------------------------- |
| `<ClarityChat />`           | Drop-in chat component        |
| `useClarityChat()`          | Chat hook with memory options |
| `useClarityObject<T>()`     | Structured output generation  |
| `useClarityChatWithTools()` | Chat with function calling    |

---

## Components

### Chat Components

```tsx
import {
  ClarityChatApp, // Full-featured (recommended)
  ClarityChat, // Drop-in component
  ChatWindow, // UI-only component
  ChatInput, // Message input
  VirtualizedMessageList, // Optimized for large lists
  StreamingMessage, // Real-time streaming display
} from '@clarity-chat/react'
```

### Layout Components

```tsx
import {
  ChatLayout, // Basic layout
  ResizableChatLayout, // Resizable panels
  FloatingChatWidget, // Floating chat button
} from '@clarity-chat/react'
```

### Headless Primitives

```tsx
import { ChatPrimitive } from '@clarity-chat/react'

;<ChatPrimitive.Root>
  <ChatPrimitive.Messages>
    {messages.map((msg) => (
      <ChatPrimitive.Message key={msg.id}>
        <ChatPrimitive.MessageContent>{msg.content}</ChatPrimitive.MessageContent>
        <ChatPrimitive.MessageActions>
          <ChatPrimitive.CopyButton />
          <ChatPrimitive.RegenerateButton />
        </ChatPrimitive.MessageActions>
      </ChatPrimitive.Message>
    ))}
  </ChatPrimitive.Messages>
  <ChatPrimitive.Input />
</ChatPrimitive.Root>
```

---

## Bundle Size

| Import Path                        | Size      | Use Case            |
| ---------------------------------- | --------- | ------------------- |
| `@clarity-chat/react`              | ~600KB    | Full library        |
| `@clarity-chat/react/core`         | ~300KB    | Core + hooks        |
| `@clarity-chat/react/core-minimal` | **~30KB** | Just ClarityChatApp |
| `@clarity-chat/react/slim`         | ~276KB    | Optimized bundle    |

**Tree-shaking**: All imports are tree-shakeable. Import only what you need.

---

## Feature Flags

```typescript
interface ClarityFeatureFlags {
  memory?: boolean // Context persistence
  tokenOptimization?: boolean // Cost reduction
  tools?: boolean // Function calling
  rag?: boolean // Document retrieval
  safety?: boolean // Content moderation
  observability?: boolean // Analytics
  streaming?: boolean // Real-time responses (default: true)
  errorRecovery?: boolean // Auto-retry (default: true)
}
```

---

## Configuration

```tsx
<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  features={{ memory: true, tokenOptimization: true }}
  config={{
    memory: {
      strategy: 'sliding-window',
      maxTokens: 8000,
    },
    tokenOptimization: {
      budget: 16000,
      showStats: true,
    },
    safety: {
      piiRedaction: true,
      promptInjectionDetection: true,
    },
  }}
/>
```

---

## Examples

### Minimal Examples

```tsx
// Basic chat
<ClarityChatApp api="/api/chat" />

// With memory
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Enterprise
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

### Production Example

```tsx
import { ClarityChatApp, ThemeProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme="ocean">
      <ClarityChatApp
        api="/api/chat"
        preset="enterprise"
        systemPrompt="You are a helpful assistant."
        onEvent={(event) => {
          if (event.type === 'message:sent') {
            analytics.track('message_sent')
          }
        }}
      />
    </ThemeProvider>
  )
}
```

---

## Documentation

- **[Getting Started](../../docs/getting-started.md)** - Quick start guide
- **[Migration Guide](../../docs/MIGRATION_GUIDE.md)** - Migrate from other libraries
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Examples](../../apps/examples/)** - 40+ production examples

---

## Related Packages

- `@clarity-chat/memory` - Memory management system
- `@clarity-chat/types` - Type definitions
- `@clarity-chat/primitives` - UI building blocks
- `@clarity-chat/utils` - Utility functions

---

## License

MIT License - See [LICENSE](../../LICENSE) file.

---

**Ready to build?** Start with `<ClarityChatApp api="/api/chat" />` and add features as you need
them!
