# Clarity Chat Architecture & Design Principles

## Core Domains

Clarity Chat is organized around **7 core domains**, each with a clear mental model and layered API structure:

1. **Chat UI** - User interface for conversations
2. **Memory & Context** - Conversation memory, context management, RAG
3. **AI Infrastructure** - Agents, tools, adapters, embeddings, vector stores
4. **Enterprise** - Multi-tenancy, RBAC, audit, quotas, safety
5. **Analytics & Observability** - Tracking, monitoring, evaluation
6. **Streaming & Real-time** - SSE, WebSocket, streaming messages
7. **Developer Experience** - CLI, templates, examples, dev tools

---

## Layered Architecture

Each domain follows a **three-layer architecture**:

### Top-Level APIs (Drop-in Ready)
- **1-3 APIs per domain**
- Obvious names, sane defaults, minimal configuration
- Examples: `ClarityChat`, `useClarityChat`, `createMemoryStore`

### Mid-Level APIs (Building Blocks)
- Hooks/components for composing custom flows
- Still ergonomic and opinionated
- Examples: `useChatCore`, `ChatLayout`, `useMemoryContext`

### Low-Level Primitives (Power Users)
- Utility functions, internal hooks, adapters
- For power users and internal reuse
- Examples: `buildContextBundle`, `normalizeMessages`, `createStateMachine`

---

## Domain Architecture Table

| Domain | Top-Level APIs | Mid-Level APIs | Low-Level Primitives | Notes |
|--------|---------------|----------------|---------------------|-------|
| **Chat UI** | `ClarityChat`<br>`ClarityChatSimple` | `ChatWindow`<br>`useChatCore`<br>`ChatLayout` | `MessageList`<br>`ChatInput`<br>`normalizeMessages` | Main user-facing interface. Top-level handles everything, mid-level for custom layouts, primitives for full control. |
| **Memory & Context** | `useMemoryStore`<br>`createMemoryStore` | `useMemoryContext`<br>`useSlidingWindow`<br>`MemoryProvider` | `buildContextBundle`<br>`compressContext`<br>`retrieveMemories` | Conversation memory and context management. Top-level for simple setup, mid-level for RAG integration, primitives for custom strategies. |
| **AI Infrastructure** | `useAgent`<br>`useRAGPipeline` | `useVectorStore`<br>`useEmbeddings`<br>`useTools` | `createAdapter`<br>`buildPrompt`<br>`parseToolCall` | Agents, RAG, vector stores, embeddings. Top-level for common patterns, mid-level for composition, primitives for custom providers. |
| **Enterprise** | `createEnterpriseShell`<br>`useEnterpriseAuth` | `useMultiTenancy`<br>`useRBAC`<br>`useAudit` | `createTenant`<br>`checkPermission`<br>`logAuditEvent` | Multi-tenancy, RBAC, audit, quotas. Top-level for full enterprise setup, mid-level for individual features, primitives for custom implementations. |
| **Analytics & Observability** | `useAnalytics`<br>`AnalyticsProvider` | `useTracking`<br>`useMetrics`<br>`useEvaluation` | `trackEvent`<br>`recordMetric`<br>`evaluateResponse` | Tracking, monitoring, evaluation. Top-level for automatic tracking, mid-level for custom events, primitives for direct API access. |
| **Streaming & Real-time** | `useStreamingChat` | `useStreamingSSE`<br>`useStreamingWebSocket`<br>`StreamingMessage` | `parseStreamChunk`<br>`createStreamParser`<br>`handleReconnect` | SSE, WebSocket, streaming. Top-level for automatic handling, mid-level for protocol choice, primitives for custom streams. |
| **Developer Experience** | `createProject` (CLI)<br>`useTemplate` | `DevTools`<br>`useDebugMode` | `validateConfig`<br>`generateTypes` | CLI, templates, dev tools. Top-level for project setup, mid-level for development, primitives for tooling. |

---

## API Naming Conventions

### Top-Level APIs
- **Components**: `ClarityChat`, `EnterpriseShell`, `AnalyticsDashboard`
- **Hooks**: `useClarityChat`, `useMemoryStore`, `useAgent`
- **Factories**: `createMemoryStore`, `createEnterpriseShell`, `createRAGPipeline`

### Mid-Level APIs
- **Components**: `ChatWindow`, `ChatLayout`, `MemoryProvider`
- **Hooks**: `useChatCore`, `useMemoryContext`, `useVectorStore`
- **Pattern**: Descriptive names indicating their role in composition

### Low-Level Primitives
- **Functions**: `normalizeMessages`, `buildContextBundle`, `parseToolCall`
- **Hooks**: `useMessageState`, `useStreamParser` (internal)
- **Pattern**: Verb-based names indicating transformation/operation

---

## API Shape Conventions

### Hooks
- **Always start with `use`**
- **Return objects, not tuples**
- **Consistent keys**: `data`, `state`, `error`, `isLoading`, `actions`

```tsx
// ✅ Good
const { messages, isLoading, error, sendMessage } = useChat()

// ❌ Bad
const [messages, isLoading] = useChat() // Tuple
```

### Components
- **Normalized props**:
  - `onChange`, `onSubmit`, `onClick`, `onSelect`, `onClose`
  - `isLoading` / `disabled` for loading/disabled states
  - `variant`, `size` for style variants
- **Config objects**: Use `config` or `options` for complex setups
- **Advanced options**: Group under `advanced` or `expert` keys

```tsx
// ✅ Good
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  advanced={{ onMessageCopy, onMessageFeedback }}
/>

// ❌ Bad
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  onMessageCopy={handleCopy}
  onMessageFeedback={handleFeedback}
  onMessageRetry={handleRetry}
  headerActions={actions}
  emptyState={customEmpty}
/>
```

### Config Objects
- **Use `config` or `options` for complex setups**
- **Group rarely used knobs under `advanced` or `expert`**

```tsx
// ✅ Good
useClarityChat({
  api: '/api/chat',
  config: {
    memory: { enabled: true },
    streaming: { protocol: 'sse' },
  },
  advanced: {
    retry: { maxAttempts: 5 },
    timeout: 30000,
  },
})

// ❌ Bad
useClarityChat({
  api: '/api/chat',
  memoryEnabled: true,
  memoryStrategy: 'vector-store',
  streamingProtocol: 'sse',
  retryMaxAttempts: 5,
  timeout: 30000,
})
```

---

## Rules for Adding New APIs

### 1. Determine the Layer
- **Top-level**: Can a user do something useful with minimal config? → Top-level
- **Mid-level**: Is this a building block for composition? → Mid-level
- **Low-level**: Is this a utility or internal detail? → Low-level

### 2. Choose the Name
- **Top-level**: Clear, obvious, describes what it does
- **Mid-level**: Descriptive, indicates role in composition
- **Low-level**: Verb-based, indicates transformation/operation

### 3. Choose the Location
- **Top-level**: Domain root (e.g., `src/chat/`, `src/memory/`)
- **Mid-level**: Domain root or subdirectory
- **Low-level**: `utils/` or `internal/` subdirectory

### 4. Export Strategy
- **Top-level**: Export from domain index and main index
- **Mid-level**: Export from domain index, optionally from main index
- **Low-level**: Export from domain index only, or keep internal

---

## Happy Path Workflows

### Workflow 1: Full Chat UI with Memory
**Goal**: Spin up a complete chat interface with conversation memory

**APIs**: `ClarityChat` (top-level) + `enableMemory` prop

**Lines of Code**: 5-10

**Why Enterprise-Grade**: Includes error handling, network status, token tracking, memory integration, all with zero configuration.

```tsx
<ClarityChat
  api="/api/chat"
  enableMemory
  memoryStrategy="vector-store"
/>
```

### Workflow 2: Custom Chat Layout with RAG
**Goal**: Build a custom chat layout with RAG pipeline

**APIs**: `useChatCore` (mid-level) + `useRAGPipeline` (top-level) + `ChatLayout` (mid-level)

**Lines of Code**: 20-30

**Why Enterprise-Grade**: Composable building blocks allow custom layouts while maintaining enterprise features like RAG, error handling, and observability.

```tsx
const chat = useChatCore({ api: '/api/chat' })
const rag = useRAGPipeline({ vectorStore: 'pinecone' })

return (
  <ChatLayout>
    <Sidebar>
      <RAGContext context={rag.context} />
    </Sidebar>
    <Main>
      <ChatWindow {...chat} />
    </Main>
  </ChatLayout>
)
```

### Workflow 3: Enterprise Multi-Tenant Chat
**Goal**: Set up multi-tenant chat with RBAC and audit logging

**APIs**: `createEnterpriseShell` (top-level)

**Lines of Code**: 15-25

**Why Enterprise-Grade**: Single API sets up complete enterprise infrastructure with multi-tenancy, RBAC, audit logging, and quotas.

```tsx
const shell = createEnterpriseShell({
  auth: { provider: 'okta' },
  multiTenancy: { enabled: true },
  rbac: { roles: ['admin', 'user'] },
  audit: { enabled: true },
})

return <shell.ChatApp api="/api/chat" />
```

### Workflow 4: AI Agent with Tools
**Goal**: Create an AI agent with tool calling capabilities

**APIs**: `useAgent` (top-level) + `useTools` (mid-level)

**Lines of Code**: 20-30

**Why Enterprise-Grade**: High-level agent API with automatic tool management, error handling, and observability built-in.

```tsx
const agent = useAgent({
  model: 'gpt-4',
  tools: [webSearchTool, calculatorTool],
})

const response = await agent.run({ query: 'What is 2+2?' })
```

---

## Architecture Principles

1. **Progressive Disclosure**: Start simple, add complexity only when needed
2. **Composition Over Configuration**: Prefer composing building blocks over massive config objects
3. **Sensible Defaults**: Everything should work with minimal configuration
4. **Type Safety**: Strong TypeScript types throughout
5. **Backward Compatibility**: New APIs don't break existing code
6. **Clear Mental Models**: Each domain has a clear purpose and boundaries

---

## Migration Strategy

When refactoring APIs:

1. **Add new APIs** alongside old ones
2. **Mark old APIs as deprecated** with migration path
3. **Update examples** to use new APIs
4. **Keep old APIs working** for backward compatibility
5. **Document migration** in MIGRATION_GUIDE.md

---

## Future Considerations

- **Plugin System**: Allow extending domains via plugins
- **Tree-Shaking**: Ensure unused code can be eliminated
- **Bundle Size**: Keep top-level APIs lightweight
- **Performance**: Optimize for common use cases
- **Testing**: Each layer should be testable independently

---

**Last Updated**: 2024  
**Status**: Active Design Document  
**Maintainers**: Architecture Team
