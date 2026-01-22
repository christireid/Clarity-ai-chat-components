# Phase 0: Architecture Boundaries & Decisions

**Date**: 2026-01-22
**Phase**: Orientation & Boundaries
**Status**: ✅ Complete

---

## 1. CORE AI CHAT PACKAGES (IN SCOPE)

### Primary Packages

| Package | Path | Purpose | Lines of Code (est.) |
|---------|------|---------|---------------------|
| `@clarity-chat/react` | `packages/react/` | Main UI components, hooks, and chat logic | ~50,000+ |
| `@clarity-chat/primitives` | `packages/primitives/` | Headless UI primitives (shadcn/ui + Radix) | ~5,000 |
| `@clarity-chat/memory` | `packages/memory/` | Framework-agnostic memory & context | ~8,000 |
| `@clarity-chat/types` | `packages/types/` | TypeScript type definitions | ~2,000 |
| `@clarity-chat/utils` | `packages/utils/` | Shared utilities | ~3,000 |
| `@clarity-chat/token-optimization` | `packages/token-optimization/` | Token counting & optimization | ~4,000 |

**Total Surface Area**: ~72,000+ lines of TypeScript/TSX

---

## 2. ARCHITECTURE LAYERS

### Layer Separation (Bottom-Up)

```
┌─────────────────────────────────────────────────────────┐
│  Layer 5: APPLICATION API (@clarity-chat/react)         │
│  - ClarityChatApp (unified entry point)                 │
│  - Preset configurations (basic, enterprise, etc.)      │
│  - App-level orchestration                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 4: HIGH-LEVEL COMPONENTS (@clarity-chat/react)   │
│  - ClarityChat, ChatWindow, MessageList                 │
│  - StreamingMessage, ToolInvocationCard                 │
│  - ErrorBoundary, AccessibilityProvider                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: HOOKS & BUSINESS LOGIC (@clarity-chat/react)  │
│  - useClarityChat (primary chat hook)                   │
│  - useStreaming, useStreamingSSE, useStreamableUI       │
│  - Tool orchestration, memory integration               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: CORE SYSTEMS (@clarity-chat/react)            │
│  - ToolRegistry, ToolExecutor, ToolLifecycleManager     │
│  - Model Adapters (OpenAI, Anthropic, Google)           │
│  - Streaming primitives, message conversion             │
│  - Safety & security (safe-evaluate, validation)        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 1: PRIMITIVES & INFRASTRUCTURE                   │
│  - UI Primitives (@clarity-chat/primitives)             │
│  - Memory Service (@clarity-chat/memory)                │
│  - Types (@clarity-chat/types)                          │
│  - Utilities (@clarity-chat/utils)                      │
│  - Token Optimization (@clarity-chat/token-optimization)│
└─────────────────────────────────────────────────────────┘
```

---

## 3. CRITICAL ENTRY POINTS

### Public API Entry Points

| Entry Point | Path | Purpose | Bundle Impact |
|-------------|------|---------|---------------|
| **Main** | `packages/react/src/index.ts` | Full library (recommended) | ~100% |
| **Core** | `packages/react/src/core.ts` | Minimal bundle (~30% smaller) | ~70% |
| **Core Minimal** | `packages/react/src/core-minimal.ts` | Absolute minimum | ~50% |
| **App API** | `packages/react/src/app-api/` | Unified app-level API | ~95% |
| **Slim** | `packages/react/src/slim.ts` | Essential features only | ~60% |
| **Namespaced** | `packages/react/src/namespaced.ts` | Namespace exports | ~100% |
| **Internal** | `packages/react/src/internal.ts` | Internal/advanced APIs | ~100% |

### Export Strategy

- **Default (index.ts)**: Exports both App API and legacy public API
- **Core**: Minimal chat functionality for bundle size optimization
- **Internal**: Advanced APIs for power users (not guaranteed stable)
- **Adapters**: Model adapters can be imported separately
- **Memory**: Can be used standalone (`@clarity-chat/memory`)

---

## 4. STREAMING ARCHITECTURE

### Streaming Implementation Layers

1. **Low-Level Primitives** (`packages/react/src/hooks/streaming/`)
   - `useStreaming` - ReadableStream → token-by-token decoding
   - `useStreamingSSE` - Server-Sent Events with reconnection
   - `useStreamingWebSocket` - WebSocket streaming

2. **Mid-Level Adapters** (`packages/react/src/hooks/streaming/`)
   - `useStreamableUI` - Universal streaming adapter (multiple sources)
   - `useStreamingChat` - Chat-specific format handling

3. **Optimization Layer** (`packages/react/src/hooks/clarity-tokens/`)
   - `useStreamOptimizer` - RAF-based batching (60-80% fewer renders)
   - `useSmoothStreaming` - Buffer & release at readable pace

4. **UI Components** (`packages/react/src/components/message/`)
   - `StreamingMessage` - Component with smooth animation
   - `StreamingTextRenderer` - Character-by-character rendering
   - `StreamBlock` - Streamable component wrapper

### Streaming Utilities

- **Format Detection**: `packages/react/src/utils/streaming/streaming-helpers.ts`
  - Handles OpenAI, Anthropic, Google, generic JSON formats
  - Content extraction from various response shapes

- **Optimization**: `packages/react/src/utils/streaming/streaming-optimizer.ts`
  - Early stop detection (save tokens)
  - Response monitoring & metrics
  - Partial response caching

### Key Files (28 files)

```
packages/react/src/hooks/streaming/
├── use-streaming.ts (239 lines) - Low-level ReadableStream
├── use-streaming-sse.tsx (730 lines) - SSE with reconnection
├── use-streamable-ui.ts (330 lines) - Universal adapter
├── use-streaming-chat.ts - Chat-specific
├── use-stream-status.ts - Status monitoring
└── use-smooth-streaming.ts - Animation buffer

packages/react/src/utils/streaming/
├── streaming-helpers.ts (698 lines) - Format parsing
├── streaming-optimizer.ts (695 lines) - Optimization
└── stream-cancellation.tsx - Cancellation handling

packages/react/src/components/message/
├── streaming-message.tsx (668 lines) - Main component
├── streaming-text-renderer.tsx (259 lines) - Animation
└── stream-block.tsx (123 lines) - Wrapper
```

---

## 5. TOOL CALLING ARCHITECTURE

### Tool Calling Layers

1. **Type System** (`packages/react/src/types/`)
   - `tool-definition.ts` - Canonical tool interface
   - `tool-invocation.ts` - Invocation state machine
   - `tool-status.ts` - Status types
   - `tool-result-types.ts` - Structured result types

2. **Core Systems** (`packages/react/src/core/`)
   - `ToolRegistry` - Registration & discovery
   - `ToolExecutor` - Validation, caching, timeout, execution
   - `ToolLifecycleManager` - State machine & events
   - `ToolOrchestrator` - High-level unified API

3. **Format Adapters** (`packages/react/src/adapters/`)
   - `tool-formats.ts` - Convert between OpenAI/Anthropic/Canonical formats
   - Model adapters with tool calling support

4. **UI Components** (`packages/react/src/components/`)
   - `ToolInvocationCard` - Display & approval UI
   - `ToolExecutionCard` - Execution status & controls
   - `ToolApprovalDialog` - Pre-built approval dialog
   - `ClarityToolResult` - Result rendering

5. **Security Layer** (`packages/react/src/utils/security/`)
   - `safe-evaluate.ts` - Pattern detection, safe globals
   - Parameter validation (JSON Schema)
   - Timeout protection

### Tool Lifecycle State Machine

```
requested → pending_approval → approved → executing → completed
                            ↓                      ↘
                          rejected                 failed
                                                    timeout
                                                    cancelled
                                                    cached
```

### Key Files (20+ files)

```
packages/react/src/types/
├── tool-definition.ts - Canonical interface
├── tool-invocation.ts - State machine
├── tool-status.ts - Status types
└── tool-result-types.ts - Result interfaces

packages/react/src/core/
├── tool-registry.ts - Registration
├── tool-executor.ts - Execution engine
├── tool-lifecycle.ts - State management
└── tool-orchestrator.ts - Unified API

packages/react/src/adapters/
├── tool-formats.ts - Format conversion
├── anthropic.ts - Anthropic adapter
├── openai.ts - OpenAI adapter
└── google.ts - Google adapter

packages/react/src/components/
├── message/tool-invocation-card.tsx - UI
├── ai/tool-execution-card.tsx - Execution UI
└── tool-approval/ToolApprovalDialog.tsx - Approval

packages/react/src/utils/security/
└── safe-evaluate.ts - Security
```

---

## 6. MEMORY & CONTEXT ARCHITECTURE

### Memory Package (`@clarity-chat/memory`)

**Purpose**: Framework-agnostic AI memory and context management

**Core Components**:

1. **Memory Service** (`memory-service.ts`)
   - Conversation history management
   - Semantic memory storage
   - Token-aware context window management
   - Query & recall with relevance scoring

2. **Storage Backends** (`stores/`)
   - In-memory (ephemeral)
   - IndexedDB (browser persistence)
   - File system (Node.js)
   - Custom storage adapters

3. **Embeddings** (`embeddings/`)
   - OpenAI embeddings
   - Local embeddings (transformers.js)
   - Custom embedding providers

4. **Summarization** (`summarization/`)
   - LLM-based summarization (80-90% reduction)
   - OpenAI summarizer
   - Anthropic summarizer
   - Extractive summarization (fallback)

5. **Token Optimization** (`compression/`, `token-optimizer.ts`)
   - Quality gates (preserve important context)
   - Cost-aware compression
   - Semantic caching
   - Dynamic compression strategies

6. **Decay Management** (`utils/decay-manager.ts`)
   - Memory forgetting (Mem0-inspired)
   - Importance scoring
   - Time-based decay curves

### React Integration (`packages/react/src/memory/`)

- `createMemoryStore` - Factory for memory instances
- `useMemory` - React hook for memory operations
- `MemoryProvider` - Context provider

### Key Files (40+ files)

```
packages/memory/src/
├── memory-service.ts (38,712 lines) - Core service
├── factory.ts - Zero-config factory
├── types.ts - Type definitions
├── stores/ - Storage backends
├── embeddings/ - Embedding providers
├── summarization/ - Summarizers
├── compression/ - Token optimization
├── scoring/ - Importance scoring
└── utils/ - Utilities & decay

packages/react/src/memory/
├── create-memory-store.ts - React factory
├── hooks.ts - Memory hooks
└── providers.tsx - Context providers
```

---

## 7. SLASH COMMANDS & MENTIONS

### Implementation

**Location**: `packages/react/src/components/input/`

1. **Advanced Chat Input** (`advanced-chat-input.tsx`)
   - Supports `/` (slash commands) and `@` (mentions)
   - Autocomplete suggestions
   - Fuzzy search
   - Default commands: `/help`, `/clear`, `/export`, `/model`

2. **Mention System** (`mention-system.tsx`)
   - `@` mentions for users
   - MentionableUser interface
   - Mention tracking (read/unread)
   - Fuzzy user search

### Default Slash Commands

```typescript
const DEFAULT_COMMANDS = [
  { label: 'help', value: '/help', description: 'Show available commands' },
  { label: 'clear', value: '/clear', description: 'Clear conversation' },
  { label: 'export', value: '/export', description: 'Export chat' },
  { label: 'model', value: '/model', description: 'Switch AI model' },
]
```

### Extension Points

- `onSuggestionRequest` callback for custom commands
- `InputSuggestion` type for defining commands
- Type: `'prompt' | 'command' | 'mention'`

---

## 8. ACCESSIBILITY ARCHITECTURE

### WCAG AA Compliance

**Location**: `packages/react/src/accessibility/`

1. **Core Utilities** (`core-utilities.ts`)
   - ARIA ID generation
   - Screen reader announcements
   - Focus management utilities

2. **Keyboard Shortcuts** (`keyboard-shortcuts.tsx`)
   - Keyboard navigation
   - Shortcut registry

3. **Focus Management** (`focus-management.ts`)
   - Focus trap
   - Focus restoration
   - Focusable element queries

4. **WCAG Validator** (`wcag-validator.ts`)
   - Automated accessibility testing
   - ARIA attribute validation

5. **Accessibility Automation** (`accessibility-automation.ts`)
   - Automated tests using axe-core

### Primitives Accessibility

**Location**: `packages/primitives/`

- All primitives built on Radix UI (accessible by default)
- ARIA utilities (`lib/aria.ts`)
- A11y context provider (`context/a11y-context.tsx`)
- Reduced motion support
- Focus management
- Screen reader support

---

## 9. DOCUMENTATION & STORYBOOK

### Documentation (`apps/docs/`)

**Structure**:
- VitePress-based documentation site
- API reference with TypeDoc integration
- Examples & guides
- Commercial documentation (enterprise features)

**Key Locations**:
- `apps/docs/app/` - Main documentation content
- `apps/docs/content/` - Markdown content
- `apps/docs/mcp-server/` - MCP server integration

### Storybook (`apps/storybook/`)

**Structure**:
- Storybook 10.x (React 19 compatible)
- Stories organized by category
- Interactive component showcase

**Key Locations**:
- `apps/storybook/.storybook/` - Configuration
- `apps/storybook/stories/` - Component stories
- Categories: Advanced/AI, Primitives, Chat, Input

**Story Categories**:
- AI Operations (`AIOperations.stories.tsx`)
- Tool Calling (`ClarityToolResult.stories.tsx`)
- Agent Runs (`AgentRunFeed.stories.tsx`)
- Chat Primitives (`ChatPrimitives.stories.tsx`)

---

## 10. MODEL ADAPTERS

### Supported Providers

**Location**: `packages/react/src/adapters/`

| Provider | File | Tool Calling | Streaming | Status |
|----------|------|-------------|-----------|--------|
| **OpenAI** | `openai.ts` | ✅ Full | ✅ SSE | Production |
| **Anthropic** | `anthropic.ts` | ✅ Full | ✅ SSE | Production |
| **Google** | `google.ts` | ✅ Full | ✅ SSE | Production |

### Adapter Features

1. **Format Conversion** (`tool-formats.ts`)
   - Convert between canonical and provider formats
   - Preserve tool metadata

2. **Error Handling** (`errors.ts`)
   - Provider-specific error mapping
   - Retry logic (`retry.ts`)
   - Circuit breaker (`circuit-breaker.ts`)

3. **Monitoring** (`monitoring.ts`, `telemetry.ts`)
   - Request/response logging
   - Performance metrics
   - Error tracking

---

## 11. UI vs HEADLESS BOUNDARIES

### Headless (Primitives)

**Package**: `@clarity-chat/primitives`

- Pure UI components (buttons, dialogs, inputs)
- No AI chat logic
- Radix UI + shadcn/ui foundation
- Accessible by default
- Can be used in non-AI contexts

### UI with Logic (React Package)

**Package**: `@clarity-chat/react`

- AI chat-specific components
- Streaming logic
- Tool calling UI
- Memory integration
- Message components

### Clear Separation

```
┌──────────────────────────────────────┐
│  @clarity-chat/react                 │
│  - StreamingMessage                  │
│  - ToolInvocationCard                │
│  - ChatWindow                        │
│  - Uses primitives for UI            │
└──────────────────────────────────────┘
              ↓ imports
┌──────────────────────────────────────┐
│  @clarity-chat/primitives            │
│  - Button, Dialog, Input             │
│  - Pure UI, no AI logic              │
│  - Accessible, themeable             │
└──────────────────────────────────────┘
```

---

## 12. DEPENDENCIES & LICENSING

### Key Dependencies

**All dependencies verified as MIT-compatible**:

- React 19.x (MIT)
- Framer Motion (MIT)
- Radix UI (MIT)
- Zod (MIT)
- Lucide Icons (ISC)
- React Markdown (MIT)
- DOMPurify (Apache-2.0)

### Peer Dependencies (Optional)

- `flowtoken` - Token counting (optional)
- `mermaid` - Diagram rendering (optional)
- `pdfjs-dist` - PDF parsing (optional)
- `mammoth` - DOCX parsing (optional)
- `cohere-ai` - Reranking (optional)

**All peer dependencies are MIT or Apache-2.0 licensed.**

---

## 13. TESTING INFRASTRUCTURE

### Test Coverage

**Location**: `packages/react/src/__tests__/`

1. **Unit Tests** (Vitest)
   - Component tests
   - Hook tests
   - Utility tests

2. **Integration Tests**
   - Module resolution tests
   - API compatibility tests
   - Multi-package integration

3. **E2E Tests** (Playwright)
   - `tests/visual/` - Visual regression
   - `apps/docs/tests/` - Smoke tests

4. **Accessibility Tests**
   - axe-core integration
   - ARIA validation
   - Keyboard navigation tests

### Test Utilities

**Location**: `packages/react/src/test-utils/`

- Mock providers
- Test data factories
- Assertion helpers

---

## 14. BUILD & BUNDLING

### Build System

- **Bundler**: tsup (esbuild-based)
- **Formats**: ESM (.js), CJS (.cjs), Types (.d.ts)
- **Monorepo**: Turbo (parallel builds)

### Build Outputs

Each package produces:
- `dist/index.js` - ESM
- `dist/index.cjs` - CommonJS
- `dist/index.d.ts` - TypeScript types
- `dist/styles/index.css` - Styles (react package only)

### Size Optimization

- Multiple entry points for tree-shaking
- Core/slim bundles for size-conscious apps
- Lazy loading for heavy features (PDF, DOCX loaders)

---

## 15. KEY DECISIONS & RATIONALE

### Decision 1: Monorepo Structure

**Why**: Shared development, consistent versioning, easier refactoring

**Trade-offs**: More complex setup, but better DX for contributors

### Decision 2: React 19 Migration

**Status**: Complete

**Benefits**:
- Ref as prop (no forwardRef)
- useTransition for non-blocking updates
- Better TypeScript inference

### Decision 3: Framework-Agnostic Memory

**Why**: Memory service can be used outside React

**Location**: Separate `@clarity-chat/memory` package

**Usage**: React integration via thin wrapper

### Decision 4: Multiple Entry Points

**Why**: Different bundle sizes for different use cases

**Options**: Full, Core, Core-Minimal, Slim, App API

### Decision 5: Tool Calling Security-First

**Why**: Prevent malicious tool execution

**Features**:
- Default `requiresApproval: true`
- Safe evaluation (blocked patterns)
- JSON Schema validation
- Timeout protection

### Decision 6: Streaming Optimization Layers

**Why**: Balance responsiveness and performance

**Layers**:
1. Low-level (accurate, raw)
2. Optimization (batching, RAF)
3. UI (smooth animation)

### Decision 7: shadcn/ui + Radix Primitives

**Why**: Battle-tested accessibility, wide adoption

**Trade-offs**: Larger bundle than custom primitives, but production-ready

---

## 16. CRITICAL PATHS (MUST AUDIT)

### Priority 1: Core Chat Flow

1. Message submission → `useClarityChat`
2. Streaming response → `useStreaming` → `StreamingMessage`
3. Message rendering → `MessageList` → `Message`
4. Error handling → `ErrorBoundary` → `ChatWithErrorBoundary`

### Priority 2: Tool Calling Flow

1. Tool definition → `ToolRegistry.register()`
2. Tool invocation → `ToolExecutor.execute()`
3. Approval flow → `ToolLifecycleManager` → `ToolApprovalDialog`
4. Result rendering → `ToolInvocationCard` → `ClarityToolResult`

### Priority 3: Memory Integration

1. Message add → `MemoryService.add()`
2. Context recall → `MemoryService.recall()`
3. Token optimization → `MemoryService.optimize()`
4. Summarization → `LLMSummarizer.summarize()`

### Priority 4: Streaming Robustness

1. Network failure → reconnection logic
2. Cancel/interrupt → AbortController
3. Format detection → multiple APIs
4. Optimization → RAF batching

---

## 17. OUT OF SCOPE (NOT AI CHAT CORE)

The following are **NOT** part of the core AI chat audit:

1. **License System** (`packages/license/`)
   - Commercial licensing logic
   - Not required for core chat functionality

2. **CLI Tools** (`packages/cli/`)
   - Development tooling
   - Not runtime code

3. **Codemods** (`packages/codemods/`)
   - Migration utilities
   - Not runtime code

4. **Dev Tools** (`packages/dev-tools/`)
   - Development utilities
   - Not runtime code

5. **Testing Utils Package** (`packages/testing-utils/`)
   - Test helpers for consumers
   - Not core functionality

6. **Playground** (`packages/playground/`)
   - Development playground
   - Not production code

7. **Example Apps** (`apps/examples/`)
   - Usage examples
   - Not library code

8. **Commercial Features** (unless AI-chat-related)
   - Billing, analytics dashboards
   - Multi-tenancy (unless affects chat)

---

## 18. PHASE 0 COMPLETION CHECKLIST

✅ **Core packages identified**
✅ **Architecture layers mapped**
✅ **Streaming implementation catalogued**
✅ **Tool calling system documented**
✅ **Memory architecture understood**
✅ **Slash commands & mentions located**
✅ **Accessibility approach reviewed**
✅ **Documentation & Storybook locations noted**
✅ **Model adapters identified**
✅ **UI vs headless boundaries clear**
✅ **Dependencies & licensing verified**
✅ **Testing infrastructure mapped**
✅ **Build system understood**
✅ **Key decisions documented**
✅ **Critical paths prioritized**
✅ **Out-of-scope items excluded**

---

## NEXT PHASE

**Phase 1: Full Indexing** will catalog every file, function, hook, and component in the AI chat surface area, documenting:
- Exact file paths
- Public vs internal APIs
- Exports and consumers
- Test coverage status
- Documentation status
- Dependencies and side effects

**Estimated**: ~400-500 total files to index
