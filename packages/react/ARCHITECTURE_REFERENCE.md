# Architecture Reference

## Overview

This document provides a comprehensive reference for Clarity Chat's architecture, including layered design, naming conventions, and contribution guidelines.

**Last Updated**: Phase 4 Architecture Documentation

---

## Layered Architecture

Clarity Chat follows a **three-layer architecture** across 6 core domains:

### Layer 1: Top-Level (Drop-In APIs)

**Purpose**: Zero-config, drop-in ready APIs that "just work"

**Characteristics**:
- Minimal required props (typically just `api`)
- Sensible defaults for all options
- Automatic feature integration
- Single component/hook solves common use case

**Examples**:
- `ClarityChat` - One-line chat component
- `ChatWithMemory` - Pre-configured memory
- `useChat` - Simplified hook

**When to use**: 90% of use cases

---

### Layer 2: Mid-Level (Composable Building Blocks)

**Purpose**: Composable APIs for custom workflows

**Characteristics**:
- Some configuration required
- Composable with other APIs
- Used in multiple workflows
- Provides building blocks

**Examples**:
- `useClarityChat` - Full control hook
- `ChatWindow` - UI component
- `useMemoryQuery` - Memory operations

**When to use**: Custom workflows, specific requirements

---

### Layer 3: Low-Level (Primitives & Utilities)

**Purpose**: Internal primitives and power-user utilities

**Characteristics**:
- Internal implementation details
- Used by mid/top-level APIs
- Power users need direct access
- Fine-grained control

**Examples**:
- `convertCoreMessagesToMessages` - Message conversion
- `Message` - Individual message component
- `MemoryService` - Core memory service

**When to use**: Advanced use cases, custom implementations

---

## Core Domains

### 1. Chat UI Domain

**Job to be done**: Render a functional chat interface with minimal configuration.

**Top-Level**:
- `ClarityChat` - Drop-in component
- `ChatWithMemory` - Memory pre-configured
- `ChatComplete` - Full stack

**Mid-Level**:
- `useChat` - Simplified hook
- `useClarityChat` - Full control hook
- `ChatWindow` - UI component

**Low-Level**:
- `Message` - Message component
- `ChatInput` - Input component
- `convertCoreMessagesToMessages` - Conversion utility

---

### 2. Memory & Context Domain

**Job to be done**: Manage conversation context and enable long-term memory.

**Top-Level**:
- `useMemory` - Simple memory access
- `MemoryProvider` - Context provider

**Mid-Level**:
- `useMemoryQuery` - Query memories
- `useConversationMemory` - Conversation memory
- `useMemoryOptimization` - Context optimization

**Low-Level**:
- `MemoryService` - Core service
- `TokenCounter` - Token counting
- `ContextOptimizer` - Context optimization

---

### 3. AI Infrastructure Domain

**Job to be done**: Connect to AI models, handle streaming, orchestrate agents.

**Top-Level**:
- `createAgent` - Create agent instance
- `useStreaming` - Generic streaming
- `useAssistant` - Assistant hook

**Mid-Level**:
- `ReactAgent` - React-compatible agent
- `useStreamingSSE` - SSE streaming
- `useStreamingWebSocket` - WebSocket streaming

**Low-Level**:
- `StreamParser` - Stream parsing
- `AdapterBase` - Base adapter
- `ToolRegistry` - Tool registry

---

### 4. Enterprise Platform Domain

**Job to be done**: Multi-tenant, secure, auditable AI applications.

**Top-Level**:
- `useRBAC` - Role-based access control
- `useAudit` - Audit logging
- `TenantProvider` - Multi-tenancy

**Mid-Level**:
- `RBACProvider` - RBAC provider
- `AuditLogger` - Audit logger
- `SafetyService` - Content safety

**Low-Level**:
- `QuotaManager` - Quota management
- `PermissionChecker` - Permission checking
- `AuditStore` - Audit storage

---

### 5. Analytics & Observability Domain

**Job to be done**: Track usage, monitor performance, debug issues.

**Top-Level**:
- `useAnalytics` - Analytics tracking
- `AnalyticsProvider` - Analytics provider

**Mid-Level**:
- `usePerformance` - Performance monitoring
- `useErrorTracking` - Error tracking
- Analytics hooks (`useTrackMount`, etc.)

**Low-Level**:
- `AnalyticsEvent` - Event types
- `PerformanceMonitor` - Performance monitor
- `ErrorTracker` - Error tracker

---

### 6. Developer Experience Domain

**Job to be done**: Reduce boilerplate, provide sensible defaults, enable quick iteration.

**Top-Level**:
- `chatPresets` - Pre-configured presets
- `applyChatPreset` - Apply preset
- Recipe components

**Mid-Level**:
- `useChatComposable` - Composable hook
- `createChatHook` - Hook builder

**Low-Level**:
- `normalizeMessages` - Message normalization
- `buildContextBundle` - Context building
- Test utilities

---

## Naming Conventions

### Components

**Pattern**: PascalCase, descriptive

**Examples**:
- ✅ `ClarityChat`, `ChatWindow`, `MessageList`
- ❌ `Chat`, `Window`, `List`

**Top-Level**: `Chat*` prefix (e.g., `ClarityChat`, `ChatWithMemory`)  
**Mid-Level**: Descriptive names (e.g., `ChatWindow`, `MessageList`)  
**Low-Level**: Simple names (e.g., `Message`, `ChatInput`)

---

### Hooks

**Pattern**: `use*` prefix, camelCase

**Examples**:
- ✅ `useChat`, `useMemory`, `useAnalytics`
- ❌ `chatHook`, `getMemory`, `trackAnalytics`

**Top-Level**: `use*` (e.g., `useChat`, `useMemory`)  
**Mid-Level**: `use*` with descriptor (e.g., `useMemoryQuery`, `useChatComposable`)  
**Low-Level**: `use*` with specific purpose (e.g., `useAutoScroll`, `useDebounce`)

---

### Utilities

**Pattern**: camelCase, verb-based

**Examples**:
- ✅ `convertCoreMessagesToMessages`, `normalizeMessages`
- ❌ `messageConverter`, `normalizer`

**Functions**: Verb-based (e.g., `convert`, `normalize`, `build`)  
**Classes**: Noun-based (e.g., `MemoryService`, `TokenCounter`)

---

## File Structure Expectations

### Domain Organization

```
src/
├── components/          # UI components
│   ├── clarity-chat.tsx
│   ├── chat-window.tsx
│   └── ...
├── hooks/              # React hooks
│   ├── use-chat-unified.ts
│   ├── use-clarity-chat.ts
│   └── ...
├── memory/             # Memory domain
│   ├── memory-provider.tsx
│   └── ...
├── analytics/          # Analytics domain
│   ├── AnalyticsProvider.tsx
│   └── ...
├── exports/            # Domain exports
│   ├── chat-ui.ts
│   ├── memory-context.ts
│   └── ...
└── utils/              # Shared utilities
    ├── runtime-validation.ts
    ├── message-conversion.ts
    └── ...
```

### Export Organization

**Main Entry**: `src/index.ts`
- Re-exports from domain exports
- Maintains backward compatibility

**Domain Exports**: `src/exports/*.ts`
- Organized by domain
- Layered (top/mid/low)

---

## Adding New APIs

### Step 1: Identify Domain

Which domain does this belong to?
- Chat UI
- Memory & Context
- AI Infrastructure
- Enterprise Platform
- Analytics & Observability
- Developer Experience

If none, consider if it's needed or if it fits an existing domain.

### Step 2: Determine Layer

**Top-Level**:
- Common use case (>30% of users)
- Minimal configuration (<3 required props)
- Sensible defaults
- Can be used standalone

**Mid-Level**:
- Composable with other APIs
- Requires some configuration
- Used in multiple workflows
- Provides building blocks

**Low-Level**:
- Internal implementation detail
- Used by mid/top-level APIs
- Power users need direct access
- Provides fine-grained control

### Step 3: Follow Naming Convention

- Use domain-appropriate naming
- Follow API shape conventions
- Be consistent with existing APIs

### Step 4: Export Appropriately

- **Top-level**: Export from domain export file, then from main index
- **Mid-level**: Export from domain export file
- **Low-level**: Export from domain export file (may be internal)

### Step 5: Document

- Add JSDoc comments
- Include examples
- Update this document if architecture changes

---

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

**Required Keys** (where applicable):
- `data` or domain-specific data key
- `isLoading`
- `error`
- Action functions

---

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
  // Style variants
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  // Advanced options grouped
  advanced?: { ... }
}
```

**Required Props**: Minimal (typically just `api` for top-level)  
**Callbacks**: `on*` prefix  
**States**: `isLoading`, `disabled`  
**Variants**: `variant`, `size`

---

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

**Pattern**: `{ configOption, advanced?: {...} }`

---

## Contribution Guidelines

### Before Adding a New API

1. **Check if it exists**: Search existing APIs first
2. **Identify domain**: Which domain does it belong to?
3. **Determine layer**: Top, mid, or low?
4. **Follow conventions**: Naming, shapes, patterns
5. **Add validation**: Runtime checks for top-level APIs
6. **Document**: JSDoc with examples
7. **Export**: Add to appropriate domain export file

### Code Style

- Use TypeScript strict mode
- Follow existing patterns
- Add runtime validation for top-level APIs
- Include JSDoc comments
- Write examples

### Testing

- Add tests for new hooks
- Test error cases
- Test edge cases
- Verify TypeScript types

---

## Migration Notes

### From Old to New Architecture

**Old**: Everything exported from root  
**New**: Layered exports with clear domains

**Migration**:
- Old exports still work (backward compatible)
- New exports follow layered architecture
- Gradually migrate to new structure

See [MIGRATION_GUIDE_PHASE_2.md](./MIGRATION_GUIDE_PHASE_2.md) for details.

---

**Last Updated**: Phase 4 Architecture Documentation  
**Maintainer**: Architecture Team
