# Public API Table

**Generated**: Phase 4 API Surface Validation  
**Package**: `@clarity-chat/react`

This document catalogs all public-facing APIs, their locations, and recommended use cases.

---

## Entry Points

| Entry Point | Path | Purpose | Recommended For |
|-------------|------|---------|-----------------|
| **Main** | `@clarity-chat/react` | Full API surface | Most use cases |
| **Core** | `@clarity-chat/react/core` | Essential APIs only | Lightweight imports |
| **Domains** | `@clarity-chat/react/domains` | Domain-organized exports | Domain-specific usage |

---

## Domain-Based APIs (Recommended)

### Chat UI Domain (`Chat.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `ClarityChat` | Component | `components/clarity-chat.tsx` | Zero-config chat UI | `api` only |
| `ClarityChatSimple` | Component | `components/clarity-chat-simple.tsx` | Ultra-minimal chat | `endpoint` only |
| `useClarityChat` | Hook | `hooks/use-clarity-chat.ts` | Custom chat logic | `api` only |
| `ChatWindow` | Component | `components/chat-window.tsx` | Custom chat layout | `messages`, `onSendMessage` |
| `ChatLayout` | Component | `components/chat-layout.tsx` | Custom layout structure | `children` |
| `ChatInput` | Component | `components/chat-input.tsx` | Standalone input | `onSendMessage` |
| `MessageList` | Component | `components/message-list.tsx` | Standalone message list | `messages` |
| `useChatCore` | Hook | `hooks/use-chat-core.ts` | Core chat without conveniences | `api` |
| `useChatSimple` | Hook | `hooks/use-chat-simple.ts` | Simplified chat hook | `api` |
| `useChatWithOperations` | Hook | `hooks/use-chat-with-operations.ts` | Chat + message operations | `api` |

**Recommended Entry Point**: `ClarityChat` for components, `useClarityChat` for hooks

---

### Memory & Context Domain (`Memory.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `useMemoryStore` | Hook | `hooks/use-memory-store.ts` | React memory management | None (optional `enabled`) |
| `createMemoryStore` | Factory | `memory/create-memory-store.ts` | Imperative memory store | None (optional config) |
| `MemoryProvider` | Component | `memory/memory-provider.tsx` | Memory context provider | None (optional config) |
| `useMemory` | Hook | `memory/use-memory.ts` | Access memory context | Requires `MemoryProvider` |
| `useMemoryQuery` | Hook | `memory/use-memory-query.ts` | Query memories | Requires `MemoryProvider` |
| `useSlidingWindow` | Hook | `memory/use-sliding-window.ts` | Sliding window strategy | Requires `MemoryProvider` |
| `buildContextBundle` | Function | `utils/memory/build-context-bundle.ts` | Build context from messages | `messages`, `memories` |
| `compressContext` | Function | `utils/memory/compress-context.ts` | Compress context to fit tokens | `messages`, `maxTokens` |
| `retrieveMemories` | Function | `utils/memory/retrieve-memories.ts` | Retrieve relevant memories | `query`, `memoryService` |

**Recommended Entry Point**: `useMemoryStore` for React, `createMemoryStore` for imperative

---

### AI Infrastructure Domain (`AI.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `useAgent` | Hook | `hooks/use-agent.ts` | AI agent orchestration | `model`, `tools` |
| `useRAGPipeline` | Hook | `hooks/use-rag-pipeline.ts` | RAG pipeline | `vectorStore`, `embeddingProvider` |
| `useVectorStore` | Hook | `vector-stores/react.tsx` | Vector store access | `provider`, `config` |
| `useEmbeddings` | Hook | `embeddings/react.tsx` | Embedding generation | `provider`, `apiKey` |
| `ReactAgent` | Class | `agents/react-agent.ts` | Agent class (advanced) | `config` |
| `AgentUtils` | Object | `agents/index.ts` | Agent utilities | N/A |
| `createAdapter` | Function | `adapters/index.ts` | Create model adapter | `provider`, `config` |
| `buildPrompt` | Function | `prompt/core/builder.ts` | Build prompts | `messages`, `options` |
| `parseToolCall` | Function | `agents/index.ts` | Parse tool calls | `content` |

**Recommended Entry Point**: `useAgent` for agents, `useRAGPipeline` for RAG

---

### Enterprise Domain (`Enterprise.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `createEnterpriseShell` | Factory | `enterprise/create-enterprise-shell.tsx` | Complete enterprise setup | `multiTenancy`, `rbac`, etc. |
| `useEnterpriseAuth` | Hook | `enterprise/use-enterprise-auth.ts` | Enterprise authentication | `provider` |
| `MultiTenancyProvider` | Component | `multi-tenancy/react.tsx` | Multi-tenancy context | `config` |
| `useMultiTenancy` | Hook | `multi-tenancy/react.tsx` | Access multi-tenancy | Requires `MultiTenancyProvider` |
| `RBACProvider` | Component | `rbac/react.tsx` | RBAC context | `config` |
| `useRBAC` | Hook | `rbac/react.tsx` | Access RBAC | Requires `RBACProvider` |
| `AuditLogger` | Class | `audit/audit-logger.ts` | Audit logging | `config` |
| `SafetyChecker` | Class | `safety/index.ts` | Safety checks | `config` |

**Recommended Entry Point**: `createEnterpriseShell` for full setup, individual providers for specific features

---

### Analytics & Observability Domain (`Analytics.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `AnalyticsProvider` | Component | `analytics/AnalyticsProvider.tsx` | Analytics context | `config` |
| `useAnalytics` | Hook | `analytics/use-analytics.ts` | Access analytics | Requires `AnalyticsProvider` |
| `useTracking` | Hook | `analytics/use-tracking.ts` | Track events | Requires `AnalyticsProvider` |
| `useMetrics` | Hook | `observability/use-metrics.ts` | Record metrics | Requires `AnalyticsProvider` |
| `useEvaluation` | Hook | `observability/use-evaluation.ts` | Evaluate responses | Requires `AnalyticsProvider` |
| `createGoogleAnalyticsProvider` | Function | `analytics/providers.ts` | GA4 provider | `measurementId` |
| `createConsoleProvider` | Function | `analytics/providers.ts` | Console logger | None |
| `trackEvent` | Function | `analytics/track-event.ts` | Track event directly | `event`, `properties` |
| `recordMetric` | Function | `observability/record-metric.ts` | Record metric | `name`, `value` |
| `evaluateResponse` | Function | `observability/evaluate-response.ts` | Evaluate response | `response`, `criteria` |

**Recommended Entry Point**: `AnalyticsProvider` + `useAnalytics` for React, direct functions for non-React

---

### Streaming & Real-time Domain (`Streaming.*`)

| API | Type | Location | Use Case | Config Required |
|-----|------|---------|---------|-----------------|
| `useStreamingChat` | Hook | `hooks/use-streaming-chat.ts` | Streaming chat | `api`, `protocol` |
| `useStreamingSSE` | Hook | `hooks/use-streaming-sse.ts` | SSE streaming | `url` |
| `useStreamingWebSocket` | Hook | `hooks/use-streaming-websocket.ts` | WebSocket streaming | `url` |
| `StreamingMessage` | Component | `components/streaming-message.tsx` | Streaming message UI | `content` |
| `parseStreamChunk` | Function | `utils/streaming-parser.ts` | Parse stream chunk | `chunk` |
| `createStreamParser` | Function | `utils/streaming-parser.ts` | Create stream parser | `options` |
| `handleReconnect` | Function | `utils/streaming-helpers.ts` | Handle reconnection | `options` |

**Recommended Entry Point**: `useStreamingChat` for automatic protocol selection

---

## Core Exports (`/core`)

| API | Type | Location | Use Case |
|-----|------|---------|---------|
| `ClarityChat` | Component | `components/clarity-chat.tsx` | Main chat component |
| `ClarityChatSimple` | Component | `components/clarity-chat-simple.tsx` | Minimal chat component |
| `useClarityChat` | Hook | `hooks/use-clarity-chat.ts` | Main chat hook |
| `ChatWindow` | Component | `components/chat-window.tsx` | Chat window component |
| `ChatInput` | Component | `components/chat-input.tsx` | Chat input component |
| `MessageList` | Component | `components/message-list.tsx` | Message list component |
| `Message` | Type | `@clarity-chat/types` | Message type |
| `MessageRole` | Type | `@clarity-chat/types` | Message role type |
| `convertCoreMessagesToMessages` | Function | `utils/message-conversion.ts` | Convert message formats |
| `convertMessagesToCoreMessages` | Function | `utils/message-conversion.ts` | Convert message formats |
| `ErrorBoundary` | Component | `components/error-boundary.tsx` | Error boundary |
| `useChatWithOperations` | Hook | `hooks/use-chat-with-operations.ts` | Chat with operations |
| `useChatSimple` | Hook | `hooks/use-chat-simple.ts` | Simplified chat hook |
| `createMemoryStore` | Factory | `memory/create-memory-store.ts` | Memory store factory |

**Use Case**: Import only essential APIs for smaller bundle size

---

## Utility Functions

### Error Handling (`utils/error-handling.ts`)

| Function | Purpose | Parameters |
|----------|---------|-----------|
| `classifyError` | Classify error type | `error: Error \| Response \| unknown` |
| `normalizeError` | Normalize to ClarityError | `error: Error \| Response \| unknown` |
| `formatErrorForUser` | Format user-friendly message | `error: ClarityError` |
| `isRetryableError` | Check if retryable | `error: Error \| Response \| unknown` |
| `getRetryDelay` | Get retry delay | `error: Error \| Response \| unknown` |

---

## Internal APIs (Not Recommended for Direct Use)

The following are exported but intended for internal use or advanced scenarios:

- Low-level primitives in `utils/` (use domain APIs instead)
- Internal hooks in `hooks/` (use top-level hooks instead)
- Adapter implementations (use `createAdapter` instead)
- Provider internals (use provider components/hooks instead)

---

## Migration Notes

### Deprecated APIs

| Deprecated | Replacement | Migration Guide |
|------------|-------------|-----------------|
| `useChat` | `useClarityChat` | See `MIGRATION_GUIDE.md` |
| `useMounted` | React 18+ built-ins | Use `useEffect` or `useState` |
| `useSimpleHapticFeedback` | Platform APIs | Use native haptic APIs |

---

## API Stability

- **Stable**: Top-level domain APIs (`ClarityChat`, `useClarityChat`, `useMemoryStore`, etc.)
- **Experimental**: Some advanced features may change
- **Deprecated**: Marked with `@deprecated` and migration guides

---

**Last Updated**: Phase 4 API Surface Validation
