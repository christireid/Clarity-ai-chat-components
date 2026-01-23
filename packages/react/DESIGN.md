# Clarity Chat Architecture & Design

## Core Domains

Clarity Chat is organized around **6 core domains**, each with a clear layered architecture:

1. **Chat UI** - User-facing chat interface components and interactions
2. **Memory & Context** - Conversation memory, RAG, context management
3. **AI Infrastructure** - Agents, tools, model adapters, streaming
4. **Enterprise Platform** - Multi-tenancy, RBAC, audit, quotas, safety
5. **Analytics & Observability** - Analytics, monitoring, performance tracking
6. **Developer Experience** - Presets, recipes, utilities, helpers

## Domain Architecture

### 1. Chat UI Domain

**Job to be done**: Render a functional chat interface with minimal configuration.

| Layer         | APIs                                                                   | Purpose                         |
| ------------- | ---------------------------------------------------------------------- | ------------------------------- |
| **Top-level** | `ClarityChat`, `ChatWithMemory`, `ChatComplete`                        | Drop-in components, zero config |
| **Mid-level** | `ChatWindow`, `useChat`, `useClarityChat`                              | Composable building blocks      |
| **Low-level** | `Message`, `ChatInput`, `useChatCore`, `convertCoreMessagesToMessages` | Primitives and utilities        |

**Naming Convention**:

- Top-level: `Chat*` components (e.g., `ClarityChat`, `ChatWithMemory`)
- Mid-level: `useChat*` hooks, `*Window` components
- Low-level: `*Core` hooks, `*Utils` functions

### 2. Memory & Context Domain

**Job to be done**: Manage conversation context and enable long-term memory.

| Layer         | APIs                                                               | Purpose                     |
| ------------- | ------------------------------------------------------------------ | --------------------------- |
| **Top-level** | `useMemory`, `MemoryProvider`                                      | Simple memory access        |
| **Mid-level** | `useMemoryQuery`, `useConversationMemory`, `useMemoryOptimization` | Memory operations           |
| **Low-level** | `MemoryService`, `TokenCounter`, `ContextOptimizer`                | Core services and utilities |

**Naming Convention**:

- Top-level: `useMemory*` hooks, `*Provider` components
- Mid-level: `useMemory*` hooks for specific operations
- Low-level: `*Service`, `*Manager`, `*Optimizer` classes

### 3. AI Infrastructure Domain

**Job to be done**: Connect to AI models, handle streaming, orchestrate agents.

| Layer         | APIs                                                                     | Purpose                  |
| ------------- | ------------------------------------------------------------------------ | ------------------------ |
| **Top-level** | `createAgent`, `useStreaming`, `useAssistant`                            | High-level AI operations |
| **Mid-level** | `ReactAgent`, `useStreamingSSE`, `useStreamingWebSocket`, model adapters | Composable AI primitives |
| **Low-level** | `StreamParser`, `AdapterBase`, `ToolRegistry`                            | Internal utilities       |

**Naming Convention**:

- Top-level: `create*` factories, `use*` hooks for common patterns
- Mid-level: `*Agent`, `*Adapter`, `use*` hooks for specific transports
- Low-level: `*Parser`, `*Registry`, `*Base` classes

### 4. Enterprise Platform Domain

**Job to be done**: Multi-tenant, secure, auditable AI applications.

| Layer         | APIs                                                             | Purpose             |
| ------------- | ---------------------------------------------------------------- | ------------------- |
| **Top-level** | `createTenantContext`, `useRBAC`, `useAudit`                     | Enterprise setup    |
| **Mid-level** | `TenantProvider`, `RBACProvider`, `AuditLogger`, `SafetyService` | Enterprise services |
| **Low-level** | `QuotaManager`, `PermissionChecker`, `AuditStore`                | Internal utilities  |

**Naming Convention**:

- Top-level: `create*` factories, `use*` hooks
- Mid-level: `*Provider`, `*Service`, `*Logger` classes
- Low-level: `*Manager`, `*Checker`, `*Store` classes

### 5. Analytics & Observability Domain

**Job to be done**: Track usage, monitor performance, debug issues.

| Layer         | APIs                                                      | Purpose                 |
| ------------- | --------------------------------------------------------- | ----------------------- |
| **Top-level** | `useAnalytics`, `AnalyticsProvider`                       | Simple analytics access |
| **Mid-level** | `usePerformance`, `useErrorTracking`, analytics providers | Specific tracking       |
| **Low-level** | `AnalyticsEvent`, `PerformanceMonitor`, `ErrorTracker`    | Core services           |

**Naming Convention**:

- Top-level: `useAnalytics`, `*Provider` components
- Mid-level: `use*` hooks for specific tracking
- Low-level: `*Event`, `*Monitor`, `*Tracker` classes

### 6. Developer Experience Domain

**Job to be done**: Reduce boilerplate, provide sensible defaults, enable quick iteration.

| Layer         | APIs                                                      | Purpose               |
| ------------- | --------------------------------------------------------- | --------------------- |
| **Top-level** | `chatPresets`, `applyChatPreset`, recipe components       | Pre-configured setups |
| **Mid-level** | `useChatComposable`, `createChatHook`, helper hooks       | Feature composition   |
| **Low-level** | `normalizeMessages`, `buildContextBundle`, test utilities | Internal helpers      |

**Naming Convention**:

- Top-level: `*Preset`, `apply*` functions, recipe components
- Mid-level: `use*Composable`, `create*` builders
- Low-level: `normalize*`, `build*`, `*Utils` functions

## API Shape Conventions

### Hooks

**Return Shape**:

```tsx
{
  // Data
  data: T | null
  // State
  isLoading: boolean
  error: Error | null
  // Actions
  action: () => Promise<void>
  // Advanced access (optional)
  advanced?: { ... }
}
```

**Naming**: Always `use*` prefix

**Examples**:

- ✅ `useChat`, `useMemory`, `useAnalytics`
- ❌ `chatHook`, `getMemory`, `trackAnalytics`

### Components

**Props Shape**:

```tsx
{
  // Required
  api: string
  // Optional with defaults
  isLoading?: boolean
  disabled?: boolean
  // Callbacks
  onChange?: (value: T) => void
  onSubmit?: (value: T) => void | Promise<void>
  onClick?: () => void
  onClose?: () => void
  // Style variants
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  // Advanced options grouped
  advanced?: { ... }
}
```

**Naming**: PascalCase, descriptive

**Examples**:

- ✅ `ChatWindow`, `MessageList`, `ChatInput`
- ❌ `Chat`, `MsgList`, `Input`

### Config Objects

**Shape**:

```tsx
{
  // Common options
  enabled?: boolean
  // Grouped advanced options
  advanced?: {
    // Rarely used knobs
  }
  // Or flat with clear naming
  maxRetries?: number
  retryDelay?: number
}
```

## Layering Rules

### When to Add a Top-Level API

- Solves a common use case (>30% of users)
- Requires minimal configuration (<3 required props)
- Has sensible defaults
- Can be used standalone

### When to Add a Mid-Level API

- Composable with other APIs
- Requires some configuration
- Used in multiple workflows
- Provides building blocks

### When to Add a Low-Level API

- Internal implementation detail
- Used by mid/top-level APIs
- Power users need direct access
- Provides fine-grained control

## Adding New APIs

### Step 1: Identify Domain

Which domain does this belong to? If none, consider if it's needed or if it fits an existing domain.

### Step 2: Determine Layer

- **Top-level**: Common use case, minimal config → Add to top-level
- **Mid-level**: Composable, some config → Add to mid-level
- **Low-level**: Internal, power users → Add to low-level

### Step 3: Follow Naming Convention

- Use domain-appropriate naming
- Follow API shape conventions
- Be consistent with existing APIs

### Step 4: Export Appropriately

- Top-level: Export from main index
- Mid-level: Export from domain index
- Low-level: Export from domain index (may be internal)

### Step 5: Document

- Add JSDoc comments
- Include examples
- Update this DESIGN.md if architecture changes

## Migration Notes

### From Old to New Architecture

**Old**: Everything exported from root **New**: Layered exports with clear domains

**Migration**:

- Old exports still work (backward compatible)
- New exports follow layered architecture
- Gradually migrate to new structure

## Examples

### Top-Level Usage

```tsx
// Chat UI - Simplest
<ClarityChat api="/api/chat" />

// Memory - Simple
const { query } = useMemory()

// AI - Simple
const agent = createAgent({ tools: [...] })

// Analytics - Simple
const { track } = useAnalytics()
```

### Mid-Level Usage

```tsx
// Chat UI - Composable
const { messages, sendMessage } = useChat({ api: '/api/chat' })
return <ChatWindow messages={messages} onSendMessage={sendMessage} />

// Memory - Composable
const { query, store } = useMemoryQuery()
const { optimize } = useMemoryOptimization()

// AI - Composable
const agent = new ReactAgent({ tools: [...] })
const { stream } = useStreamingSSE({ endpoint: '/api/stream' })
```

### Low-Level Usage

```tsx
// Chat UI - Primitives
const messages = convertCoreMessagesToMessages(coreMessages)
const normalized = normalizeMessages(messages)

// Memory - Primitives
const service = new MemoryService(config)
const optimized = new ContextOptimizer().optimize(context)

// AI - Primitives
const parser = new StreamParser()
const adapter = new OpenAIAdapter(apiKey)
```

---

**Last Updated**: Phase 2 Architecture Refinement **Maintainer**: Architecture Team
