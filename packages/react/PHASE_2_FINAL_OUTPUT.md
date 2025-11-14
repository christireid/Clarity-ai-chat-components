# Phase 2: Architecture & API Refinement - Final Output

## Domain Architecture Table

| Domain | Top-Level APIs | Mid-Level APIs | Low-Level Primitives | Notes |
|--------|---------------|----------------|---------------------|-------|
| **Chat UI** | `ClarityChat`, `ChatWithMemory`, `ChatComplete` | `ChatWindow`, `useChat`, `useClarityChat` | `Message`, `ChatInput`, `convertCoreMessagesToMessages` | Most common. Top = drop-in (1 line), Mid = composable (~10 lines), Low = primitives |
| **Memory & Context** | `useMemory`, `MemoryProvider` | `useMemoryQuery`, `useConversationMemory` | `MemoryService`, `TokenCounter`, `ContextOptimizer` | Context retention. Top = simple access, Mid = operations, Low = services |
| **AI Infrastructure** | `createAgent`, `useStreaming`, `useAssistant` | `ReactAgent`, `useStreamingSSE`, model adapters | `StreamParser`, `AdapterBase`, vector stores | AI connectivity. Top = factories, Mid = transports, Low = parsers |
| **Enterprise Platform** | `createTenantContext`, `useRBAC` | `TenantProvider`, `RBACProvider`, `SafetyService` | `QuotaManager`, `PermissionChecker` | Multi-tenant security. Top = setup, Mid = providers, Low = managers |
| **Analytics & Observability** | `useAnalytics`, `AnalyticsProvider` | `usePerformance`, analytics providers | `AnalyticsEvent`, `PerformanceMonitor` | Tracking. Top = simple access, Mid = specific tracking, Low = events |
| **Developer Experience** | `chatPresets`, `applyChatPreset` | `useChatComposable`, `createChatHook` | `normalizeMessages`, test utilities | Reduce boilerplate. Top = presets, Mid = composition, Low = helpers |

## Key API Consolidations & Renames

### 1. Message Conversion Utilities
- **Consolidated**: `coreMessagesToMessages` → `convertCoreMessagesToMessages` (canonical)
- **Deprecated**: `coreMessagesToMessages` kept as alias for backward compatibility
- **Reason**: Single source of truth, clearer naming convention

### 2. Chat Hooks Naming
- **Unified**: `useChat` (recommended, from use-chat-unified.ts)
- **Legacy**: `useChatLegacy` (from use-chat.ts, backward compatibility)
- **Enhanced**: `useChatEnhanced` (from use-chat-enhanced.ts, advanced features)
- **Reason**: Clear progression, no naming conflicts, backward compatible

### 3. Helper Hooks
- **Deprecated**: `useClarityChatWithWindow` (still works, but recommend `ClarityChat` component)
- **Reason**: Component pattern is simpler than hook + component

### 4. Domain-Organized Exports
- **Created**: 6 domain export files (`chat-ui.ts`, `memory-context.ts`, etc.)
- **Reason**: Better discoverability, clear boundaries, easier to maintain

## Standardized API Shapes

### Hooks Return Shape
```tsx
{
  // Data
  data: T | null
  // State
  isLoading: boolean
  error: Error | null
  // Actions
  action: () => Promise<void>
}
```

**Examples**:
- ✅ `useChat` → `{ messages, sendMessage, isLoading, error }`
- ✅ `useMemory` → `{ query, store, isLoading, error }`
- ✅ `useAnalytics` → `{ track, identify, isLoading }`

### Component Props Shape
```tsx
{
  // Required
  api: string
  // Optional with defaults
  isLoading?: boolean
  disabled?: boolean
  // Callbacks (consistent naming)
  onSendMessage?: (content: string) => void | Promise<void>
  onChange?: (value: T) => void
  onClick?: () => void
  // Style variants
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}
```

**Examples**:
- ✅ `ChatWindow` uses `onSendMessage`, `isLoading`, `disabled`
- ✅ `ChatInput` uses `onChange`, `onSubmit`, `disabled`
- ✅ Consistent callback naming: `on*` prefix, descriptive names

## Happy Path Workflows

### Workflow 1: Spin Up a Full Chat UI with Memory

**Goal**: Get a production-ready chat interface with memory in minimal code

**Primary APIs**: `ChatWithMemory` (top-level)

**Code**:
```tsx
import { ChatWithMemory } from '@clarity-chat/react'

function App() {
  return <ChatWithMemory api="/api/chat" strategy="vector-store" />
}
```

**Lines of code**: 1
**Why enterprise-grade**: Memory enables context retention, better UX, production-ready defaults

---

### Workflow 2: Create an AI-Powered Dashboard View

**Goal**: Build a custom dashboard with chat, analytics, and monitoring

**Primary APIs**: `useChat` (mid-level), `useAnalytics` (top-level), `ChatWindow` (mid-level)

**Code**:
```tsx
import { useChat, useAnalytics, ChatWindow } from '@clarity-chat/react'

function Dashboard() {
  const chat = useChat({ api: '/api/chat' })
  const { track } = useAnalytics()

  const handleSend = async (content: string) => {
    track('message_sent', { content })
    await chat.sendMessage(content)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSend}
        showHeader
        sessionTitle="AI Dashboard"
      />
      <AnalyticsSidebar chat={chat} />
    </div>
  )
}
```

**Lines of code**: ~15
**Why enterprise-grade**: Composable, observable, production-ready, easy to extend

---

### Workflow 3: Wire Memory Store + Chat Together

**Goal**: Set up memory system with chat for long-term context

**Primary APIs**: `MemoryProvider` (top-level), `useClarityChat` (mid-level), `ChatWindow` (mid-level)

**Code**:
```tsx
import { MemoryProvider, useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{
      strategy: 'vector-store',
      vectorStore: { type: 'qdrant', url: '...', apiKey: '...' },
    }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
  })

  const messages = convertCoreMessagesToMessages(chat.messages)

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}
```

**Lines of code**: ~20
**Why enterprise-grade**: Proper separation of concerns, composable, testable, production-ready

---

### Workflow 4: Enterprise Chat with Everything

**Goal**: Production-ready chat with all enterprise features

**Primary APIs**: `ChatComplete` (top-level), `AnalyticsProvider` (top-level)

**Code**:
```tsx
import { ChatComplete, AnalyticsProvider, createGoogleAnalyticsProvider } from '@clarity-chat/react'

function App() {
  const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')

  return (
    <AnalyticsProvider config={{
      enabled: true,
      providers: [gaProvider],
      autoTrackPageViews: true,
      autoTrackErrors: true,
    }}>
      <ChatComplete
        api="/api/chat"
        memoryStrategy="vector-store"
        storageKey="enterprise-chat"
        onMessageSent={(content) => track('message_sent', { content })}
        onError={(error) => trackError(error)}
      />
    </AnalyticsProvider>
  )
}
```

**Lines of code**: ~10
**Why enterprise-grade**: Everything enabled, error handling, observability, production-ready

## Architecture Coherence

### Before Phase 2
- ❌ 470+ line index.ts with everything exported
- ❌ No clear domain boundaries
- ❌ Overlapping APIs with confusing names
- ❌ Inconsistent API shapes
- ❌ Hard to discover related APIs

### After Phase 2
- ✅ Domain-organized exports (6 domain files)
- ✅ Clear layered architecture (top/mid/low)
- ✅ Consolidated overlapping APIs
- ✅ Standardized API shapes
- ✅ Clear mental model and discoverability
- ✅ DESIGN.md documents architecture
- ✅ Happy path workflows documented

### Key Improvements

1. **Domain Organization**
   - Exports organized by 6 core domains
   - Clear boundaries between domains
   - Easy to find related APIs

2. **Layered Architecture**
   - **Top-level**: Drop-in ready (1-3 lines of code)
   - **Mid-level**: Composable (~10-20 lines)
   - **Low-level**: Primitives (for power users)

3. **Consistent Naming**
   - Hooks: `use*` prefix
   - Components: PascalCase, descriptive
   - Configs: Grouped, consistent shapes

4. **Better Discoverability**
   - DESIGN.md documents architecture
   - Clear examples for each layer
   - Happy path workflows documented
   - Domain-organized exports

## How Architecture is Now More Coherent

The architecture is now **coherent, layered, and drop-in ready** for enterprise-grade use because:

1. **Clear Mental Model**: 6 domains with clear boundaries make it easy to understand what the library does and where to find things.

2. **Layered Progression**: Top → Mid → Low level APIs provide a clear path from "I want it to work now" to "I need full control."

3. **Consistent Patterns**: Standardized API shapes mean once you learn one hook/component, you understand the pattern for others.

4. **Enterprise-Ready**: Top-level APIs have sensible defaults, error handling, and production-ready features built-in.

5. **Composable**: Mid-level APIs can be combined to build custom solutions without starting from scratch.

6. **Discoverable**: Domain organization and DESIGN.md make it easy to find the right API for your use case.

7. **Backward Compatible**: All existing code continues to work, allowing gradual migration.

**Result**: An engineer can build something real this afternoon without fighting the framework. They start with top-level APIs (1 line), customize with mid-level APIs (~10 lines), and only dive into low-level when needed.

---

**Status**: ✅ Phase 2 Complete
**Breaking Changes**: None (fully backward compatible)
**Architecture**: ✅ Coherent, layered, well-documented, enterprise-ready
