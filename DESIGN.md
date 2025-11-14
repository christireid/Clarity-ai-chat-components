<<<<<<< HEAD
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
=======
# Clarity Chat - Architecture & Design Principles

## Overview

Clarity Chat is designed as a **layered, enterprise-grade platform** for building AI chat applications. The architecture follows a clear mental model with distinct layers for different use cases, from "drop-in ready" components to low-level primitives.

## Core Domains

The platform is organized around **7 core domains**:

1. **Chat UI** - Components for building chat interfaces
2. **Chat State** - Hooks for managing chat state and messages  
3. **Memory & Context** - Memory management, RAG, context windows
4. **Streaming & Transport** - SSE, WebSocket, streaming utilities
5. **Tools & Agents** - Tool integration, agent orchestration, structured output
6. **Enterprise Infrastructure** - Analytics, observability, quotas, RBAC, multi-tenancy
7. **Developer Experience** - Helpers, utilities, presets, configuration builders
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5

## Layered Architecture

Each domain follows a **three-layer architecture**:

<<<<<<< HEAD
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
=======
### Layer 1: Top-Level APIs (Drop-in Ready)
- **Purpose**: Obvious, use sane defaults, require minimal configuration
- **Naming**: `ClarityChat`, `useClarityChat`, `createEnterpriseShell`
- **Use Case**: "I want to add chat to my app in 3 lines of code"

### Layer 2: Mid-Level Building Blocks
- **Purpose**: Hooks/components for composing custom flows, still ergonomic and opinionated
- **Naming**: `useChatCore`, `ChatLayout`, `useMemoryContext`
- **Use Case**: "I need more control but want sensible defaults"

### Layer 3: Low-Level Primitives
- **Purpose**: Utility functions, internal hooks, adapters – for power users and internal reuse
- **Naming**: `buildContextBundle`, `normalizeMessages`, `createStateMachine`
- **Use Case**: "I need to build something custom or extend the platform"
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5

## Domain Architecture Table

| Domain | Top-Level APIs | Mid-Level APIs | Low-Level Primitives | Notes |
|--------|---------------|----------------|---------------------|-------|
<<<<<<< HEAD
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
=======
| **Chat UI** | `ClarityChat`, `ClarityChatPresets` | `ChatWindow`, `ChatInput`, `MessageList` | `Message`, `MessageContent`, `renderMessage` | Top-level is drop-in ready. Mid-level allows composition. Low-level is for custom rendering. |
| **Chat State** | `useClarityChat` | `useChatEnhanced`, `useChatHandlers` | `useChat`, `normalizeMessages`, `convertCoreMessagesToMessages` | Top-level includes memory/optimization. Mid-level is Vercel-compatible. Low-level is raw state management. |
| **Memory & Context** | `MemoryProvider` (with defaults) | `useMemoryContext`, `useMemoryQuery` | `MemoryService`, `buildContextBundle`, `createVectorStore` | Top-level is React context. Mid-level provides hooks. Low-level is framework-agnostic. |
| **Streaming & Transport** | `useClarityChat` (transport option) | `useStreamingSSE`, `useStreamingWebSocket` | `createStreamReader`, `parseStreamChunk`, `StreamChunk` | Top-level abstracts transport. Mid-level exposes transport hooks. Low-level is raw streaming utilities. |
| **Tools & Agents** | `useClarityObject<T>`, `createAgent` | `useClarityChatWithTools`, `ToolUIRegistry` | `Tool`, `ToolResult`, `parseToolArguments` | Top-level is structured output. Mid-level is tool integration. Low-level is tool primitives. |
| **Enterprise Infrastructure** | `AnalyticsProvider`, `QuotaProvider` | `useAnalytics`, `useQuota` | `AnalyticsService`, `QuotaService`, `AuditLogger` | Top-level is React providers. Mid-level provides hooks. Low-level is service layer. |
| **Developer Experience** | `ClarityChatPresets`, `createMemoryChatConfig` | `useChatHandlers`, `createChatConfig` | `isValidApiEndpoint`, `getApiEndpoint`, message helpers | Top-level is presets/configs. Mid-level is helpers. Low-level is validation/utilities. |

## API Naming Conventions

### Components
- **Top-level**: `ClarityX`, `XPresets` (e.g., `ClarityChat`, `ClarityChatPresets`)
- **Mid-level**: `XWindow`, `XInput`, `XList` (e.g., `ChatWindow`, `ChatInput`, `MessageList`)
- **Low-level**: Generic names (e.g., `Message`, `Button`, `Card`)

### Hooks
- **Top-level**: `useClarityX` (e.g., `useClarityChat`, `useClarityObject`)
- **Mid-level**: `useXCore`, `useXContext`, `useXWithY` (e.g., `useChatCore`, `useMemoryContext`, `useChatWithTools`)
- **Low-level**: `useX`, utility hooks (e.g., `useChat`, `useDebounce`, `useLocalStorage`)

### Utilities
- **Top-level**: `createXConfig`, `createXPreset` (e.g., `createMemoryChatConfig`, `createEnterpriseChatConfig`)
- **Mid-level**: `createX`, `buildX` (e.g., `createUserMessage`, `buildContextBundle`)
- **Low-level**: `normalizeX`, `parseX`, `validateX` (e.g., `normalizeMessages`, `parseToolArguments`, `validateApiEndpoint`)

## Consistent API Shapes

### Hooks
All hooks follow this pattern:
```typescript
interface UseXReturn {
  // Data
  data?: T
  items?: T[]
  
  // State
  isLoading: boolean
  isError: boolean
  error?: Error | null
  
  // Actions
  mutate: () => Promise<void>
  reset: () => void
  
  // Domain-specific additions
  [key: string]: any
}
```

### Components
All components follow this pattern:
```typescript
interface XProps {
  // Core props
  value?: T
  defaultValue?: T
  
  // Event handlers (normalized)
  onChange?: (value: T) => void
  onSubmit?: (value: T) => void
  onClose?: () => void
  
  // State
  isLoading?: boolean
  disabled?: boolean
  
  // Variants
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  
  // Composition
  className?: string
  children?: React.ReactNode
  
  // Domain-specific additions
  [key: string]: any
}
```

### Config Objects
All config objects follow this pattern:
```typescript
interface XConfig {
  // Required core config
  api: string
  
  // Optional feature flags
  memory?: MemoryConfig
  streaming?: StreamingConfig
  
  // Advanced options (grouped)
  advanced?: {
    retry?: RetryConfig
    timeout?: number
  }
  
  // Expert options (rarely used)
  expert?: {
    customAdapter?: Adapter
    experimental?: ExperimentalFeatures
  }
}
```

## Happy Path Workflows

### Workflow 1: Simple Chat UI
**Goal**: Add a production-ready chat interface in 3 lines

**APIs Used**: `ClarityChat`
**Lines of Code**: 3

```tsx
import { ClarityChat } from '@clarity-chat/react'
<ClarityChat api="/api/chat" />
```

**Why Enterprise-Grade**: Includes error handling, loading states, accessibility, responsive design, streaming support, and more out of the box.

### Workflow 2: Chat with Memory
**Goal**: Add context-aware chat with memory management

**APIs Used**: `ClarityChatPresets.WithMemory` or `useClarityChat` + `MemoryProvider`
**Lines of Code**: 5-10

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
<ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="vector-store" />
```

**Why Enterprise-Grade**: Includes memory management, context window optimization, semantic search, and vector store integration.

### Workflow 3: Custom Chat with Tools
**Goal**: Build a custom chat interface with tool calling

**APIs Used**: `useClarityChat`, `useChatHandlers`, `ChatWindow`, `useClarityChatWithTools`
**Lines of Code**: 20-30

```tsx
const chat = useClarityChat({ api: '/api/chat' })
const handlers = useChatHandlers({ chat })
const tools = useClarityChatWithTools({ tools: [searchTool, calculatorTool] })

<ChatWindow
  messages={chat.messages}
  onSendMessage={handlers.onSendMessage}
  toolResults={tools.results}
/>
```

**Why Enterprise-Grade**: Full control over UI, tool integration, error handling, and extensibility while maintaining type safety.

### Workflow 4: Enterprise Application
**Goal**: Full-featured enterprise chat with analytics, quotas, and RBAC

**APIs Used**: `ClarityChatPresets.Enterprise`, `AnalyticsProvider`, `QuotaProvider`, `RBACProvider`
**Lines of Code**: 15-25

```tsx
<AnalyticsProvider config={analyticsConfig}>
  <QuotaProvider config={quotaConfig}>
    <RBACProvider config={rbacConfig}>
      <ClarityChatPresets.Enterprise api="/api/chat" />
    </RBACProvider>
  </QuotaProvider>
</AnalyticsProvider>
```

**Why Enterprise-Grade**: Complete observability, usage tracking, access control, and audit logging built-in.

## Rules for Adding New APIs

### Where Should It Live?

1. **Top-Level APIs**: 
   - Components: `packages/react/src/components/clarity-*.tsx`
   - Hooks: `packages/react/src/hooks/use-clarity-*.ts`
   - Presets: `packages/react/src/components/*-presets.tsx`

2. **Mid-Level APIs**:
   - Components: `packages/react/src/components/*-window.tsx`, `*-input.tsx`, `*-list.tsx`
   - Hooks: `packages/react/src/hooks/use-*-core.ts`, `use-*-context.ts`, `use-*-with-*.ts`

3. **Low-Level Primitives**:
   - Utilities: `packages/react/src/utils/*.ts`
   - Types: `packages/react/src/types/*.ts`
   - Internal hooks: `packages/react/src/hooks/use-*.ts` (generic names)

### How Should It Be Named?

1. **Top-Level**: 
   - Start with `Clarity` (e.g., `ClarityChat`, `ClarityObject`)
   - Or use `createXConfig` pattern for configs

2. **Mid-Level**:
   - Descriptive names (e.g., `ChatWindow`, `MemoryContext`)
   - Use `useXWithY` for composed hooks

3. **Low-Level**:
   - Generic, functional names (e.g., `normalizeMessages`, `parseStreamChunk`)

### How Should It Be Layered?

1. **Top-Level**: 
   - Should work with minimal configuration
   - Should include sensible defaults
   - Should handle common edge cases
   - Should be the "happy path" for most users

2. **Mid-Level**:
   - Should expose enough control for customization
   - Should still be opinionated (not too generic)
   - Should compose well with other mid-level APIs

3. **Low-Level**:
   - Should be framework-agnostic where possible
   - Should be composable and reusable
   - Should not assume React or any specific framework
   - Should be well-typed and documented

## Migration Strategy

When refactoring existing APIs:

1. **Preserve Behavior**: Existing code should continue to work
2. **Add Deprecation Warnings**: Mark old APIs with `@deprecated` JSDoc
3. **Provide Migration Path**: Document how to migrate in migration guides
4. **Gradual Migration**: Don't break everything at once
5. **Type Safety**: Use TypeScript to guide migration

## Design Principles

1. **Progressive Disclosure**: Start simple, expose complexity only when needed
2. **Composition Over Configuration**: Prefer composition of smaller pieces over large config objects
3. **Type Safety First**: Leverage TypeScript to prevent errors and guide usage
4. **Developer Experience**: Optimize for the engineer who wants to build something real this afternoon
5. **Enterprise-Grade**: Include observability, error handling, and scalability by default
6. **Backward Compatibility**: Don't break existing code unless absolutely necessary

## Future Considerations

- **Tree-Shaking**: Ensure low-level primitives can be tree-shaken
- **Bundle Size**: Keep top-level APIs lightweight, defer heavy features
- **Performance**: Optimize for common use cases, allow opt-in for advanced features
- **Accessibility**: All components should be WCAG compliant
- **Internationalization**: Plan for i18n support in the future
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5
