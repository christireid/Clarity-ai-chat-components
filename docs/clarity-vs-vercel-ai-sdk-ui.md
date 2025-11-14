# Clarity vs Vercel AI SDK UI

Clarity is a React-first AI UI library that's API-compatible with key Vercel AI SDK UI hooks, but more opinionated around memory, agents, streaming, and production UX.

## Introduction

**Clarity AI Chat Components** extends Vercel AI SDK UI with:
- **First-class memory management** - Built-in memory strategies for context retention
- **Agent orchestration** - ReAct agents with tool composition
- **Production UI components** - ChatWindow, VirtualizedMessageList, and 50+ components
- **Advanced streaming** - SSE and WebSocket support with reconnection logic
- **Enterprise features** - RBAC, quotas, audit logging, multi-tenancy scaffolding

While maintaining **full API compatibility** with Vercel's `useChat`, `useCompletion`, and `useAssistant` hooks.

## Feature Comparison Table

| Area                    | Vercel AI SDK UI                               | Clarity AI Chat Components                                       |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **Core chat hook**      | `useChat`                                      | `useClarityChat` (wraps enhanced `useChat`, adds memory/transport) |
| **Completion**          | `useCompletion`                                | `useCompletion` (compatible, with extra DX options)              |
| **Structured output**   | `useObject` (client) / `generateObject` (server) | `useClarityObject` (typed, composable, streaming support)        |
| **Memory & context**    | Guide-level, DIY                               | First-class `MemoryProvider` + `@clarity-chat/memory` engine     |
| **Tools & generative UI** | Docs + patterns; UI built manually             | Agents + tools + tool→UI registry + `<ClarityToolResult />`      |
| **Streaming protocols** | UIMessage streams, stream helpers              | Hooks for SSE & WebSocket (`useStreamingSSE`, `useStreamingWebSocket`) |
| **Chat UI components** | Examples, some primitives                      | Production-ready `<ChatWindow>`, message components, indicators  |
| **Error handling**     | Basic examples                                 | `useErrorRecovery`, opinionated error components                  |
| **Observability & quotas** | BYO infra                                      | Analytics / quotas / RBAC scaffolding (packages in repo)         |

## Detailed Comparison

### Core Chat Hook

**Vercel:**
```tsx
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
})
```

**Clarity:**
```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, input, setInput, append, isLoading } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'sliding-window' },
  transport: 'sse', // or 'websocket'
})
```

**Clarity Advantages:**
- Memory integration (3 strategies)
- Transport selection (SSE/WebSocket)
- Context enrichment
- Auto memory capture
- Context summary generation

### Memory & Context

**Vercel:** No built-in memory management. Developers must implement their own context management, token counting, and summarization.

**Clarity:** First-class memory system with three strategies:

```tsx
import { MemoryProvider } from '@clarity-chat/react'

<MemoryProvider config={{ maxTokens: 10000 }}>
  <App />
</MemoryProvider>

// In your component
useClarityChat({
  memory: {
    enabled: true,
    strategy: 'sliding-window', // or 'semantic-chunks', 'vector-store'
    maxTokens: 4000,
  },
})
```

**Clarity Advantages:**
- Built-in memory strategies
- Automatic context management
- Token optimization
- Memory visualization
- Long-term context retention

### Structured Output

**Vercel:** Server-side `generateObject` or client-side `useObject` hook.

**Clarity:** Client-side `useClarityObject` with streaming support:

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true, // Streaming support
})
```

**Clarity Advantages:**
- Type-safe generics
- Streaming support
- Automatic JSON parsing
- React integration

### Tools & Generative UI

**Vercel:** Manual tool result rendering:

```tsx
{toolInvocations.map(inv => {
  if (inv.toolName === 'weather') {
    return <WeatherDisplay data={inv.result} />
  }
  // Manual mapping for each tool
})}
```

**Clarity:** Automatic tool UI registry:

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResult,
})

<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

**Clarity Advantages:**
- Type-safe registry
- Automatic rendering
- Fallback handling
- Message context integration

### Streaming Protocols

**Vercel:** SSE via fetch API (implicit).

**Clarity:** Explicit SSE and WebSocket hooks:

```tsx
// SSE with reconnection
const { data, status } = useStreamingSSE({
  url: '/api/stream',
  onMessage: (event) => console.log(event.data),
})

// WebSocket with heartbeat
const { send, status } = useStreamingWebSocket({
  url: 'ws://api/chat',
  onMessage: (message) => console.log(message),
})
```

**Clarity Advantages:**
- WebSocket support
- Automatic reconnection
- Heartbeat monitoring
- Resume from last event ID

### Chat UI Components

**Vercel:** Basic examples and primitives. Developers build their own UI.

**Clarity:** Production-ready components:

```tsx
import { ChatWindow, VirtualizedMessageList, ThinkingIndicator } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  showHeader
  sessionTitle="My Chat"
/>
```

**Clarity Advantages:**
- Virtualized lists (1000+ messages)
- Thinking indicators
- Tool invocation cards
- Agent run feeds
- Accessibility (WCAG compliant)
- Responsive design

### Error Handling

**Vercel:** Basic error states in hooks.

**Clarity:** Dedicated error recovery:

```tsx
import { ErrorBoundary, RetryButton, useErrorRecovery } from '@clarity-chat/react'

<ErrorBoundary fallback={<RetryButton />}>
  <ChatWindow />
</ErrorBoundary>
```

**Clarity Advantages:**
- Error boundaries
- Retry mechanisms
- Error classification
- Network status tracking

## Migration Path

### From Vercel to Clarity

1. **Replace `useChat` with `useClarityChat`**
   ```tsx
   // Before
   import { useChat } from 'ai/react'
   
   // After
   import { useClarityChat } from '@clarity-chat/react'
   ```

2. **Add Memory (Optional)**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     memory: { enabled: true },
   })
   ```

3. **Use Production Components**
   ```tsx
   import { ChatWindow } from '@clarity-chat/react'
   ```

4. **Add Tool UI Registry (Optional)**
   ```tsx
   import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'
   ```

See the [Migration Guide](../../packages/react/MIGRATION_GUIDE.md) for detailed instructions.

## When to Choose Clarity

Choose Clarity when you need:
- ✅ Memory management for long conversations
- ✅ Production-ready UI components
- ✅ Tool UI registry for generative UI
- ✅ WebSocket support for real-time apps
- ✅ Agent orchestration
- ✅ Enterprise features (RBAC, quotas, audit)
- ✅ Advanced error recovery
- ✅ Full TypeScript support

## When to Choose Vercel AI SDK UI

Choose Vercel AI SDK UI when you need:
- ✅ Minimal dependencies
- ✅ Simple chat without memory
- ✅ Server-side structured output only
- ✅ Basic UI (build your own)
- ✅ SSE-only streaming

## Summary

Clarity provides **full compatibility** with Vercel AI SDK UI while adding:
- Memory management
- Production UI components
- Tool UI registry
- WebSocket support
- Agent orchestration
- Enterprise features

**Migration is straightforward** - see the [Migration Guide](../../packages/react/MIGRATION_GUIDE.md).

---

**Ready to get started?** See the [Getting Started Guide](./getting-started-clarity-chat.md)!
