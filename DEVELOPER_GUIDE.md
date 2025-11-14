# Clarity Chat - Developer Guide

## Overview

This guide helps you understand Clarity Chat's architecture and how to use it effectively. Whether you're building a simple chat interface or a complex enterprise application, this guide will help you choose the right APIs and patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Choosing the Right API](#choosing-the-right-api)
3. [Core Domains](#core-domains)
4. [Common Patterns](#common-patterns)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Architecture Overview

Clarity Chat follows a **layered architecture** with **7 core domains**. Each domain has three layers:

### Layers

1. **Top-Level (Drop-in Ready)**: Use these for quick setup with minimal configuration
2. **Mid-Level (Composable)**: Use these when you need more control but want sensible defaults
3. **Low-Level (Primitives)**: Use these when building custom solutions or extending the platform

### Domains

1. **Chat UI** - Components for building chat interfaces
2. **Chat State** - Hooks for managing chat state and messages
3. **Memory & Context** - Memory management, RAG, context windows
4. **Streaming & Transport** - SSE, WebSocket, streaming utilities
5. **Tools & Agents** - Tool integration, agent orchestration, structured output
6. **Enterprise Infrastructure** - Analytics, observability, quotas, RBAC, multi-tenancy
7. **Developer Experience** - Helpers, utilities, presets, configuration builders

See `DESIGN.md` for complete architecture documentation.

## Choosing the Right API

### Decision Tree

```
Do you need a working chat interface in minutes?
├─ Yes → Use ClarityChat (Top-Level)
│   └─ Need memory? → Use ClarityChatPresets.WithMemory
│   └─ Need enterprise features? → Use ClarityChatPresets.Enterprise
│
└─ No → Do you need custom UI?
    ├─ Yes → Use ChatWindow + useClarityChat + useChatHandlers (Mid-Level)
    │   └─ Need more control? → Use low-level primitives
    │
    └─ No → Do you need structured output?
        ├─ Yes → Use useClarityObject<T> (Top-Level)
        └─ No → Use useClarityChat (Top-Level)
```

### Quick Reference

| Use Case | Recommended API | Layer |
|----------|----------------|------|
| Simple chat interface | `ClarityChat` | Top-Level |
| Chat with memory | `ClarityChatPresets.WithMemory` | Top-Level |
| Custom UI with handlers | `ChatWindow` + `useChatHandlers` | Mid-Level |
| Vercel AI SDK compatibility | `useChatEnhanced` | Mid-Level |
| Structured output | `useClarityObject<T>` | Top-Level |
| Tool calling | `useClarityChatWithTools` | Mid-Level |
| Custom streaming | `useStreamingSSE` / `useStreamingWebSocket` | Mid-Level |
| Enterprise features | `AnalyticsProvider` + `QuotaProvider` | Top-Level |

## Core Domains

### 1. Chat UI

**Purpose**: Build chat interfaces

**Top-Level**:
```tsx
import { ClarityChat, ClarityChatPresets } from '@clarity-chat/react'

// Simple
<ClarityChat api="/api/chat" />

// With presets
<ClarityChatPresets.WithMemory api="/api/chat" />
```

**Mid-Level**:
```tsx
import { ChatWindow, ChatInput, MessageList } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  isLoading={isLoading}
/>
```

**Low-Level**:
```tsx
import { Message, MessageContent } from '@clarity-chat/react'
// Build custom message rendering
```

### 2. Chat State

**Purpose**: Manage chat state and messages

**Top-Level**:
```tsx
import { useClarityChat } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})
```

**Mid-Level**:
```tsx
import { useChatEnhanced, useChatHandlers } from '@clarity-chat/react'

// Vercel-compatible
const chat = useChatEnhanced({ api: '/api/chat' })

// With handlers
const handlers = useChatHandlers({ chat })
```

**Low-Level**:
```tsx
import { useChat, normalizeMessages } from '@clarity-chat/react'
// Raw state management
```

### 3. Memory & Context

**Purpose**: Manage conversation memory and context

**Top-Level**:
```tsx
import { MemoryProvider } from '@clarity-chat/react'

<MemoryProvider config={{ maxTokens: 10000 }}>
  <YourChat />
</MemoryProvider>
```

**Mid-Level**:
```tsx
import { useMemoryContext } from '@clarity-chat/react'

const memory = useMemoryContext()
await memory?.addMemory(content, 'conversation', 'session')
```

**Low-Level**:
```tsx
import { MemoryService, createVectorStore } from '@clarity-chat/react'
// Framework-agnostic memory management
```

### 4. Streaming & Transport

**Purpose**: Handle streaming responses

**Top-Level**:
```tsx
// Built into useClarityChat
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // or 'websocket'
})
```

**Mid-Level**:
```tsx
import { useStreamingSSE, useStreamingWebSocket } from '@clarity-chat/react'

const stream = useStreamingSSE({ api: '/api/chat' })
```

**Low-Level**:
```tsx
import { createStreamReader, parseStreamChunk } from '@clarity-chat/react'
// Custom streaming implementation
```

### 5. Tools & Agents

**Purpose**: Integrate tools and build agents

**Top-Level**:
```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
}

const { object, run } = useClarityObject<Product>({
  api: '/api/generate-object',
})
```

**Mid-Level**:
```tsx
import { useClarityChatWithTools, createAgent } from '@clarity-chat/react'

const tools = useClarityChatWithTools({
  tools: [searchTool, calculatorTool],
})

const agent = createAgent({
  name: 'ResearchAgent',
  tools: [searchTool],
})
```

**Low-Level**:
```tsx
import { Tool, ToolResult, parseToolArguments } from '@clarity-chat/react'
// Custom tool implementation
```

### 6. Enterprise Infrastructure

**Purpose**: Add enterprise features (analytics, quotas, RBAC)

**Top-Level**:
```tsx
import {
  AnalyticsProvider,
  QuotaProvider,
  RBACProvider,
} from '@clarity-chat/react'

<AnalyticsProvider config={analyticsConfig}>
  <QuotaProvider config={quotaConfig}>
    <RBACProvider config={rbacConfig}>
      <ClarityChat api="/api/chat" />
    </RBACProvider>
  </QuotaProvider>
</AnalyticsProvider>
```

**Mid-Level**:
```tsx
import { useAnalytics, useQuota } from '@clarity-chat/react'

const analytics = useAnalytics()
analytics.track('message_sent', { userId: '123' })

const quota = useQuota()
const canSend = quota.check('messages', 1)
```

### 7. Developer Experience

**Purpose**: Helpers and utilities

**Top-Level**:
```tsx
import { ClarityChatPresets, createMemoryChatConfig } from '@clarity-chat/react'

// Presets
<ClarityChatPresets.Enterprise api="/api/chat" />

// Config helpers
const config = createMemoryChatConfig('/api/chat', 'vector-store', 6000)
```

**Mid-Level**:
```tsx
import { useChatHandlers } from '@clarity-chat/react'

const handlers = useChatHandlers({ chat })
```

**Low-Level**:
```tsx
import { isValidApiEndpoint, getApiEndpoint } from '@clarity-chat/react'

if (isValidApiEndpoint(api)) {
  // Use API
}
```

## Common Patterns

### Pattern 1: Simple Chat (3 lines)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

<ClarityChat api="/api/chat" />
```

### Pattern 2: Chat with Memory

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'

<ClarityChatPresets.WithMemory 
  api="/api/chat"
  memoryStrategy="vector-store"
/>
```

### Pattern 3: Custom Chat with Handlers

```tsx
import {
  useClarityChat,
  ChatWindow,
  useChatHandlers,
} from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const handlers = useChatHandlers({
    chat,
    onMessageSent: (content) => console.log('Sent:', content),
    onMessageError: (error) => console.error('Error:', error),
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
    />
  )
}
```

### Pattern 4: Enterprise Setup

```tsx
import {
  ClarityChatPresets,
  AnalyticsProvider,
  QuotaProvider,
  RBACProvider,
} from '@clarity-chat/react'

function EnterpriseChat() {
  return (
    <AnalyticsProvider config={{ provider: 'console' }}>
      <QuotaProvider config={{ limits: { messagesPerDay: 1000 } }}>
        <RBACProvider config={{ roles: ['user', 'admin'] }}>
          <ClarityChatPresets.Enterprise api="/api/chat" />
        </RBACProvider>
      </QuotaProvider>
    </AnalyticsProvider>
  )
}
```

### Pattern 5: Structured Output

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface UserProfile {
  name: string
  email: string
  age: number
}

function ProfileGenerator() {
  const { object, run, isLoading } = useClarityObject<UserProfile>({
    api: '/api/generate-object',
  })

  const handleGenerate = async () => {
    await run({ prompt: 'Create a user profile' })
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={isLoading}>
        Generate Profile
      </button>
      {object && (
        <div>
          <h3>{object.name}</h3>
          <p>{object.email}</p>
        </div>
      )}
    </div>
  )
}
```

## Best Practices

### 1. Start with Top-Level APIs

Always start with top-level APIs (`ClarityChat`, `useClarityChat`). Only move to mid-level or low-level if you need more control.

### 2. Use Presets for Common Configurations

Instead of manually configuring memory, use presets:

```tsx
// ❌ Don't
<ClarityChat
  api="/api/chat"
  memory={{ enabled: true, strategy: 'sliding-window', maxTokens: 4000 }}
/>

// ✅ Do
<ClarityChatPresets.WithMemory api="/api/chat" />
```

### 3. Use Handlers Hook

Reduce boilerplate with `useChatHandlers`:

```tsx
// ❌ Don't
const handleSend = React.useCallback(
  async (content: string) => {
    try {
      await chat.append({ role: 'user', content })
    } catch (error) {
      console.error(error)
    }
  },
  [chat]
)

// ✅ Do
const handlers = useChatHandlers({ chat })
// Use handlers.onSendMessage
```

### 4. Group Advanced Options

When creating config objects, group advanced options:

```tsx
const config = {
  api: '/api/chat',
  memory: { enabled: true },
  advanced: {
    retry: { maxAttempts: 3 },
    timeout: 30000,
  },
}
```

### 5. Use TypeScript

Leverage TypeScript for type safety:

```tsx
// ✅ Type-safe structured output
interface Product {
  name: string
  price: number
}

const { object } = useClarityObject<Product>({ api: '/api/generate' })
// object is typed as Product | null
```

### 6. Handle Errors

Always handle errors:

```tsx
const handlers = useChatHandlers({
  chat,
  onMessageError: (error) => {
    // Log error
    console.error('Failed to send message:', error)
    // Show user-friendly message
    toast.error('Failed to send message. Please try again.')
  },
})
```

## Troubleshooting

### Issue: Messages not appearing

**Solution**: Ensure you're passing messages correctly:

```tsx
// ✅ Correct
<ChatWindow messages={chat.messages} />

// ❌ Wrong - missing messages prop
<ChatWindow />
```

### Issue: API endpoint not working

**Solution**: Validate the endpoint:

```tsx
import { isValidApiEndpoint } from '@clarity-chat/react'

if (!isValidApiEndpoint(api)) {
  console.error('Invalid API endpoint')
}
```

### Issue: Memory not working

**Solution**: Ensure MemoryProvider is set up:

```tsx
// ✅ Correct
<MemoryProvider config={{ maxTokens: 10000 }}>
  <ClarityChat api="/api/chat" memory={{ enabled: true }} />
</MemoryProvider>

// ❌ Wrong - missing MemoryProvider
<ClarityChat api="/api/chat" memory={{ enabled: true }} />
```

### Issue: Type errors with CoreMessage

**Solution**: Use conversion utilities:

```tsx
import { convertCoreMessagesToMessages } from '@clarity-chat/react'

// ChatWindow accepts both Message[] and CoreMessage[]
// But if you need to convert:
const messages = convertCoreMessagesToMessages(coreMessages)
```

## Additional Resources

- **Architecture**: See `DESIGN.md` for complete architecture documentation
- **Quick Reference**: See `QUICK_REFERENCE_ARCHITECTURE.md` for quick lookup
- **Examples**: See `packages/react/src/examples/` for real-world examples
- **API Reference**: See `packages/react/src/exports.ts` for structured exports

## Getting Help

1. Check the documentation files (`DESIGN.md`, `QUICK_REFERENCE_ARCHITECTURE.md`)
2. Look at examples in `packages/react/src/examples/`
3. Check TypeScript types for autocomplete and type safety
4. Review error messages - they often include helpful guidance

---

**Happy Building!** 🚀
