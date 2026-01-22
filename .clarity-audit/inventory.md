# Clarity Chat - Complete Inventory

**Audit Date**: 2026-01-21 **Branch**: ultimate-token-opt **Version**: @clarity-chat/react v0.1.0

---

## EXECUTIVE SUMMARY

**Total Components**: 182+ hooks, 60+ components **Provider Support**: OpenAI, Anthropic, Google AI
**Package Structure**: Monorepo with 7 core packages **Bundle Sizes**: 650KB (full), 35KB
(core-minimal)

---

## 1. CORE CHAT APIS

### Tier 1: Drop-in Ready (Primary Entry Points)

| Hook                        | Location                                      | Purpose                           | Features                                      |
| --------------------------- | --------------------------------------------- | --------------------------------- | --------------------------------------------- |
| `useClarityChat`            | `/hooks/use-clarity-chat/use-clarity-chat.ts` | Primary chat hook (80% use cases) | Messages, streaming, events, token tracking   |
| `useClarityChatApp`         | `/app-api/use-clarity-chat-app.ts`            | Unified app-level chat            | Memory, token opt, RAG, safety, tools, events |
| `useChat` (useHeadlessChat) | `/hooks/chat/use-chat.ts`                     | Headless/Vercel AI SDK compatible | Low-level logic, 100% control                 |
| `useClarityChatWithTools`   | `/hooks/chat/use-clarity-chat-with-tools.ts`  | Tool invocation support           | Agentic, function calling, tool results       |

### Tier 2: Composable Hooks (182+ total)

**Streaming** (5 hooks):

- useStreamingSSE, useStreamingWebSocket, useStreamingChat, useStreamStatus, useSmoothText

**Memory & Storage** (8 hooks):

- useMemoryStore, useChatHistory, useMemoryContext, useLocalStorage, useIndexedDB

**Token Optimization** (40+ hooks):

- useTokenBudgetMonitor, useTokenTracker, useTokenCounter, useTokenOptimization, useModelRouter,
  etc.

**Tool & Agent** (6 hooks):

- useAgent, useAssistant, useRAGPipeline, useCompletion, useClarityObject

**Resilience** (4 hooks):

- useCircuitBreaker, useRetryWithBackoff, useErrorRecovery, useRequestDeduplication

---

## 2. COMPONENT INVENTORY

### Drop-in Components (7)

- ClarityChat, ClarityChatApp, ChatWindow, ChatInput, AdvancedChatInput, VirtualizedMessageList,
  ChatLayout

### Message Components (8)

- Message, StreamingMessage, ThinkingIndicator, ToolInvocationCard, ClarityToolResult,
  MessageMetadata, StreamBlock, CitationCard

### AI Components (5)

- EnhancedMarkdownRenderer, ChainOfThought, ThinkingBar, StreamStatusProgress, SourceCitation

### Navigation Components (2)

- CommandPalette, CommandPaletteEnhanced

### Input Components (2)

- MentionInput, AdvancedChatInput

---

## 3. PROVIDER ADAPTERS

| Provider      | Models                         | Features                                  |
| ------------- | ------------------------------ | ----------------------------------------- |
| **OpenAI**    | GPT-4, GPT-4 Turbo, o1         | Chat, vision, function calling, streaming |
| **Anthropic** | Claude 3 (Opus, Sonnet, Haiku) | Extended thinking, tool use, streaming    |
| **Google**    | Gemini Pro, Gemini Ultra       | Multimodal, tool use                      |

---

## 4. MEMORY SYSTEM

**Package**: `@clarity-chat/memory`

**Features**:

- Sliding window context manager
- Vector embeddings with search
- Multiple embedding providers
- Compression for context optimization
- Tiered storage (memory, localStorage, IndexedDB)
- Decay-based lifecycle management

---

## 5. TOKEN OPTIMIZATION

**Package**: `@clarity-chat/token-optimization`

**40+ Hooks Including**:

- Semantic caching (embedding-based)
- Model routing (cost optimization)
- Compression (markdown, prompt)
- Budget monitoring (real-time cost tracking)
- Context window management

**Goal**: 80%+ cost reduction documented

---

## 6. TOOL INVOCATION

**Files**:

- `/agents/tools.ts` - Safe tools registry
- `/agents/tool-ui-registry.ts` - Custom UI mapping
- `/utils/tools/tool-result-extractor.ts` - Result extraction
- `/app-api/tools-engine.ts` - Orchestration

**Features**:

- Type-safe tool definitions (Zod)
- Custom UI renderers
- Approval workflows
- Timeout handling (30s default)

---

## 7. EXPORT STRUCTURE

**Main Package**: `@clarity-chat/react`

- Primary exports: 170+ (useClarityChat, components, hooks)
- Internal exports: Advanced APIs
- Hooks exports: All 182+ hooks organized by domain

**Supporting Packages**:

- `@clarity-chat/types` - Core types
- `@clarity-chat/memory` - Memory service
- `@clarity-chat/token-optimization` - Token features
- `@clarity-chat/error-handling` - Error utilities
- `@clarity-chat/primitives` - Base components

---

## 8. FILE STRUCTURE

### Chat Core

```
/hooks/chat/
  - use-clarity-chat.ts
  - use-chat.ts
  - use-clarity-chat-with-tools.ts
/components/chat/
  - clarity-chat.tsx
  - chat-window.tsx
  - chat-input.tsx
```

### Types

```
/packages/types/src/
  - chat.ts (Chat, ChatSummary, ChatHistory)
  - message.ts (Message, MessageRole)
/types/
  - chat-types.ts (type guards)
/adapters/
  - types.ts (provider types)
```

### Memory

```
/packages/memory/src/
  - memory-service.ts
  - stores/ (in-memory, file, indexeddb)
  - context/ (builders, managers)
/memory/
  - memory-provider.tsx
```

### Tools

```
/agents/
  - tools.ts
  - tool-ui-registry.ts
/utils/tools/
  - tool-result-extractor.ts
  - tool-result-helpers.ts
```

---

## 9. BUNDLE ANALYSIS

| Bundle       | Size      | Purpose                            |
| ------------ | --------- | ---------------------------------- |
| Full         | 650KB     | Complete library with all features |
| Core         | 350KB     | Essential chat functionality       |
| Core-minimal | 35KB      | Minimal headless implementation    |
| Adapters     | 35KB each | Per-provider bundles               |

**Size Limits Enforced**: Yes (via `.size-limit.json`)

---

## 10. DUPLICATION ANALYSIS

### Confirmed Duplications

1. **Chat Helper Utilities**
   - `utils/message/chat-helpers.ts`
   - `utils/message/clarity-chat-helpers.ts`
   - **Impact**: Overlapping message extraction logic
   - **Recommendation**: Consolidate into single file

2. **Multiple Chat Entry Points**
   - `useChat`, `useChatEnhanced`, `useClarityChat`, `useHeadlessChat`
   - **Impact**: Confusing for developers (which to use?)
   - **Recommendation**: Deprecate aliases, clarify primary hook

3. **Message Conversion Logic Scattered**
   - `/utils/message/message-conversion.ts`
   - `/utils/tools/tool-result-extractor.ts`
   - `/utils/message/chat-helpers.ts`
   - **Impact**: Inconsistent extraction patterns
   - **Recommendation**: Centralize extraction utilities

---

## 11. UNEXPORTED UTILITIES

### Should Be Public

**Tool Utilities**:

- extractToolResults, extractToolResultsByName, getLatestToolResult
- groupToolResultsByToolName, hasToolBeenCalled, countToolCallsByTool
- parseToolArguments, formatToolCall, getToolResultSummary

**Message Utilities**:

- messageToText, extractTextContent, hasToolCalls
- estimateTokensForMessage, groupMessagesByRole
- findLastMessage, findLastUserMessage, findLastAssistantMessage

**Streaming Utilities**:

- parseStreamChunk, optimizeStreamBatch, collectStreamText
- aggregateStreamDeltas

**Component Utilities**:

- composeComponents, withProps, conditional, composeHooks
- transformProps, createContextProvider

**Accessibility Helpers**:

- createAccessibleButtonProps, createAccessibleDialogProps
- useKeyboardListNavigation, announceToScreenReader
- useFocusManagement, isKeyboardAccessible

---

## 12. ARCHITECTURE GAPS

### Missing Critical Features

1. **No Unified Fork/Branching** - Cannot branch conversations for A/B testing
2. **No Regenerate Hook** - Manual retry logic only
3. **No Abort Management** - No structured cancellation hierarchy
4. **Weak Tool Type Safety** - Tool definitions lack formal correlation
5. **No Memory Scoping** - Cannot isolate per conversation/session
6. **No Error Taxonomy** - Generic Error handling, no ClarityErrorCode enum

---

## 13. CRITICAL FILES REFERENCE

| Category      | Key Files                                   | Status                  |
| ------------- | ------------------------------------------- | ----------------------- |
| **Chat Core** | use-clarity-chat.ts, chat-window.tsx        | ✅ Solid                |
| **Streaming** | use-streaming-sse.tsx, streaming-helpers.ts | ⚠️ Memory leaks found   |
| **Memory**    | memory-service.ts, stores/\*.ts             | ⚠️ Race conditions      |
| **Tools**     | tools-engine.ts, tool-result-helpers.ts     | ⚠️ Cache issues         |
| **Types**     | chat.ts, message.ts, chat-types.ts          | ⚠️ Strict mode disabled |
| **Adapters**  | openai.ts, anthropic.ts, google.ts          | ✅ Good                 |

---

**Inventory Complete**: 2026-01-21
