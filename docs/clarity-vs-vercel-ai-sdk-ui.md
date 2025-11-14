# Clarity vs Vercel AI SDK UI

**Clarity AI Chat Components** is a React-first AI UI library that's API-compatible with Vercel AI SDK UI while adding enterprise-grade features. If you're familiar with Vercel's `useChat`, `useCompletion`, and `useAssistant` hooks, you'll feel right at home—but with more power under the hood.

## What is Clarity?

Clarity is:
- **React-first**: Built specifically for React applications with React 19 optimizations
- **API-compatible**: Drop-in replacement for Vercel AI SDK UI hooks
- **More opinionated**: First-class support for memory, agents, streaming protocols, and production UX
- **Enterprise-ready**: Built-in analytics, quotas, RBAC, and observability

## Feature Comparison

| Area                    | Vercel AI SDK UI                               | Clarity AI Chat Components                                       |
| ----------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **Core chat hook**      | `useChat`                                      | `useClarityChat` (wraps enhanced `useChat`, adds memory/transport) |
| **Completion**          | `useCompletion`                                | `useCompletion` (compatible, with extra DX options)              |
| **Structured output**   | `useObject`                                    | `useClarityObject` (typed, composable)                           |
| **Memory & context**    | Guide-level, DIY                               | First-class `MemoryProvider` + `@clarity-chat/memory` engine     |
| **Tools & generative UI** | Docs + patterns; UI built manually             | Agents + tools + tool→UI registry + `<ClarityToolResult />`      |
| **Streaming protocols** | UIMessage streams, stream helpers              | Hooks for SSE & WebSocket (`useStreamingSSE`, `useStreamingWebSocket`) |
| **Chat UI components**  | Examples, some primitives                      | Production-ready `<ChatWindow>`, message components, indicators  |
| **Error handling**      | Basic examples                                 | `useErrorRecovery`, opinionated error components                  |
| **Observability & quotas** | BYO infra                                      | Analytics / quotas / RBAC scaffolding (packages in repo)         |

## Detailed Comparison

### Core Chat Hook

**Vercel:**
```tsx
const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})
```

**Clarity:**
```tsx
const { messages, append, isLoading, memoryEnabled, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'semantic-chunks' },
  transport: 'sse', // or 'websocket'
})
```

**Difference:** Clarity adds memory integration and transport selection while maintaining full API compatibility. You can use `useClarityChat` exactly like `useChat` if you want.

### Memory & Context

**Vercel:** You manage context yourself—store messages, retrieve history, build context strings.

**Clarity:** Built-in memory system with three strategies:
- **Sliding Window**: Fast, recent context (good for short conversations)
- **Semantic Chunks**: Context-aware selection (good for medium conversations)
- **Vector Store**: Long-term memory with embeddings (good for persistent context)

```tsx
<MemoryProvider config={{ maxTokens: 10000 }}>
  <YourApp />
</MemoryProvider>

const chat = useClarityChat({
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 4000,
  },
})
```

### Tools & Generative UI

**Vercel:** You define tools and manually render their results.

**Clarity:** Tool → UI registry pattern for automatic rendering:

```tsx
// Define tool result component
function WeatherResult({ data }) {
  return <Card>Temperature: {data.temp}°C</Card>
}

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Use in chat
<ClarityToolResult
  registry={toolRegistry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

### Streaming Protocols

**Vercel:** Uses standard fetch with SSE support (implicit).

**Clarity:** Explicit hooks for different protocols:
- `useStreamingSSE`: Production-ready SSE with reconnection, resume, heartbeat
- `useStreamingWebSocket`: WebSocket support with bidirectional communication
- `useStreaming`: Generic streaming hook for custom protocols

### Chat UI Components

**Vercel:** Provides examples and some primitive components. You build most UI yourself.

**Clarity:** Production-ready components:
- `<ChatWindow>`: Complete chat interface
- `<VirtualizedMessageList>`: Handles 1000+ messages smoothly
- `<ThinkingIndicator>`: Animated processing states
- `<ToolInvocationCard>`: Rich tool execution display
- `<AgentRunFeed>`: Agent step-by-step visualization

### Error Handling

**Vercel:** Basic error states in hooks.

**Clarity:** Intelligent error recovery:
- Automatic retry with exponential backoff
- Error classification (network, rate limit, server, auth)
- User-friendly error messages
- `<ErrorBoundary>` components for graceful failures

### Observability & Enterprise Features

**Vercel:** Bring your own infrastructure for analytics, quotas, RBAC.

**Clarity:** Built-in scaffolding:
- Analytics system (`@clarity-chat/react/analytics`)
- Usage quotas (`@clarity-chat/react/quotas`)
- RBAC (`@clarity-chat/react/rbac`)
- Multi-tenancy (`@clarity-chat/react/multi-tenancy`)
- Audit logging (`@clarity-chat/react/audit`)

## When to Choose Clarity

Choose Clarity if you need:
- ✅ **Memory & context management** without building it yourself
- ✅ **Production-ready UI components** out of the box
- ✅ **Enterprise features** (analytics, quotas, RBAC)
- ✅ **Advanced streaming** (WebSocket, SSE with reconnection)
- ✅ **Tool UI registry** for generative UIs
- ✅ **Agent orchestration** (ReAct pattern)
- ✅ **Better DX** (error recovery, token optimization, caching)

Choose Vercel if you:
- ✅ Want minimal, unopinionated hooks
- ✅ Prefer building UI from scratch
- ✅ Need server-side utilities (`generateObject`, etc.)
- ✅ Want broader community adoption

## Migration Path

Clarity is designed to be a drop-in replacement. See the [Migration Guide](./migrating-from-vercel.md) for step-by-step instructions.

**TL;DR:** Replace `useChat` with `useClarityChat`, wrap your app in `<MemoryProvider>` if you want memory, and you're done.

## Learn More

- **[Getting Started](./getting-started-clarity-chat.md)** - Quick start guide
- **[Migration Guide](./migrating-from-vercel.md)** - Migrate from Vercel
- **[API Reference](../../packages/react/README.md)** - Complete documentation
- **[Feature Audit](../../CLARITY_VS_VERCEL_AI_SDK_AUDIT.md)** - Detailed technical comparison
