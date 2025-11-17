# Public API Table

## Overview

This document provides a comprehensive table of all public APIs exported from `@clarity-chat/react`, organized by domain and layer.

**Last Updated**: Phase 4 API Validation

---

## Chat UI Domain

### Top-Level: Drop-In Components

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `ClarityChat` | `components/clarity-chat.tsx` | Simplest chat setup - one line, zero config | `api` only |
| `ChatWithMemory` | `components/chat-recipes.tsx` | Chat with memory pre-configured | `api`, `strategy` |
| `ChatWithAnalytics` | `components/chat-recipes.tsx` | Chat with analytics tracking | `api` |
| `ChatWithPreset` | `components/chat-recipes.tsx` | Chat using preset configuration | `api`, `preset` |
| `ChatWithPersistence` | `components/chat-recipes.tsx` | Chat with localStorage persistence | `api` |
| `ChatWithErrorHandling` | `components/chat-recipes.tsx` | Chat with error boundary | `api` |
| `ChatComplete` | `components/chat-recipes.tsx` | Full-featured chat (memory + analytics + errors) | `api`, `memoryStrategy` |
| `ChatWithErrorBoundary` | `components/chat-with-error-boundary.tsx` | Chat wrapped with error boundary | `api` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useChat` | `hooks/use-chat-unified.ts` | Simplified chat hook with auto conversion | `api` |
| `useClarityChat` | `hooks/use-clarity-chat.ts` | Full control chat hook | `api` |
| `useChatComposable` | `hooks/use-chat-composable.ts` | Composable chat hook builder | `api` |
| `useChatWithFeatures` | `hooks/use-chat-composable.ts` | Chat hook with feature flags | `api`, `features` |
| `createChatHook` | `hooks/use-chat-composable.ts` | Builder pattern for custom chat hooks | `api` |
| `ChatWindow` | `components/chat-window.tsx` | Chat UI component | `messages`, `onSendMessage` |
| `Message` | `components/message.tsx` | Individual message component | `message` |
| `MessageList` | `components/message-list.tsx` | Message list component | `messages` |
| `VirtualizedMessageList` | `components/virtualized-message-list.tsx` | Virtualized message list | `messages` |
| `ChatInput` | `components/chat-input.tsx` | Chat input component | `value`, `onChange`, `onSubmit` |
| `AdvancedChatInput` | `components/advanced-chat-input.tsx` | Enhanced chat input with attachments | `value`, `onChange`, `onSubmit` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useChatLegacy` | `hooks/use-chat.ts` | Legacy chat hook (backward compat) | `api` |
| `useChatEnhanced` | `hooks/use-chat-enhanced.ts` | Enhanced chat hook (advanced) | `api` |
| `convertCoreMessagesToMessages` | `utils/message-conversion.ts` | Convert CoreMessage[] to Message[] | `coreMessages`, `chatId?` |
| `convertMessageToCoreMessage` | `utils/message-conversion.ts` | Convert Message to CoreMessage | `message` |
| `convertCoreMessageToMessage` | `utils/message-conversion.ts` | Convert CoreMessage to Message | `coreMessage`, `chatId?` |
| `convertMessagesToCoreMessages` | `utils/message-conversion.ts` | Convert Message[] to CoreMessage[] | `messages` |
| `coreMessagesToMessages` | `utils/message-conversion.ts` | Deprecated alias (backward compat) | `coreMessages`, `chatId?` |
| `coreMessageToMessage` | `utils/message-conversion.ts` | Deprecated alias (backward compat) | `coreMessage`, `chatId?` |
| `useClarityChatWithWindow` | `hooks/use-clarity-chat-helpers.ts` | Deprecated (use ClarityChat component) | `api` |
| `useClarityChatWithAnalytics` | `hooks/use-clarity-chat-helpers.ts` | Chat hook with analytics | `api` |
| `useClarityChatWithPersistence` | `hooks/use-clarity-chat-helpers.ts` | Chat hook with persistence | `api` |
| `useClarityChatWithDebounce` | `hooks/use-clarity-chat-helpers.ts` | Chat hook with debounce | `api` |
| `useClarityChatWithAutoSave` | `hooks/use-clarity-chat-helpers.ts` | Chat hook with auto-save | `api` |
| `useClarityChatWithTools` | `hooks/use-clarity-chat-with-tools.ts` | Chat hook with tool support | `api`, `tools` |

---

## Memory & Context Domain

### Top-Level: Drop-In APIs

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useMemory` | `memory/memory-provider.tsx` | Simple memory access hook | Requires `MemoryProvider` |
| `MemoryProvider` | `memory/memory-provider.tsx` | Memory context provider | `config` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useMemoryQuery` | `memory/` | Query memory by content/type | Requires `MemoryProvider` |
| `useConversationMemory` | `memory/` | Access conversation memory | Requires `MemoryProvider` |
| `useMemoryOptimization` | `memory/` | Optimize memory context | Requires `MemoryProvider` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `MemoryService` | `@clarity-chat/memory` | Core memory service class | `config` |
| `TokenCounter` | `utils/` | Count tokens in text | `text`, `model?` |
| `ContextOptimizer` | `utils/` | Optimize context windows | `messages`, `maxTokens` |
| `SemanticChunker` | `utils/` | Semantic text chunking | `text`, `options?` |

---

## AI Infrastructure Domain

### Top-Level: Drop-In APIs

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `createAgent` | `agents/react-agent.ts` | Create AI agent instance | `config` |
| `useStreaming` | `hooks/use-streaming.ts` | Generic streaming hook | `onChunk?`, `onComplete?` |
| `useAssistant` | `hooks/use-assistant.ts` | Assistant hook with tool support | `api?` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `ReactAgent` | `agents/react-agent.ts` | React-compatible agent class | `config` |
| `useStreamingSSE` | `hooks/use-streaming-sse.tsx` | SSE streaming hook | `endpoint` |
| `useStreamingWebSocket` | `hooks/use-streaming-websocket.tsx` | WebSocket streaming hook | `url` |
| `useClarityObject` | `hooks/use-clarity-object.ts` | Structured object generation | `api` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `StreamParser` | `utils/streaming-helpers.ts` | Parse streaming responses | `stream`, `format` |
| `AdapterBase` | `adapters/` | Base adapter class | N/A (abstract) |
| `ToolRegistry` | `agents/tool-ui-registry.ts` | Tool registry for UI components | `registry` |
| `createToolUIRegistry` | `agents/tool-ui-registry.ts` | Create tool UI registry | `registry` |
| `ClarityToolResult` | `components/clarity-tool-result.tsx` | Render tool results | `registry`, `toolCall`, `result` |

---

## Enterprise Platform Domain

### Top-Level: Drop-In APIs

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useRBAC` | `rbac/` | Role-based access control | Requires `RBACProvider` |
| `useAudit` | `audit/` | Audit logging hook | Requires `AuditLogger` |
| `TenantProvider` | `multi-tenancy/` | Multi-tenant context provider | `config` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `RBACProvider` | `rbac/` | RBAC context provider | `config` |
| `AuditLogger` | `audit/audit-logger.ts` | Audit logging service | `config` |
| `SafetyService` | `safety/` | Content safety service | `config` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `QuotaManager` | `quotas/` | Usage quota management | `config` |
| `PermissionChecker` | `rbac/` | Permission checking utility | `permissions`, `resource` |
| `AuditStore` | `audit/` | Audit event storage | `config` |

---

## Analytics & Observability Domain

### Top-Level: Drop-In APIs

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `useAnalytics` | `analytics/AnalyticsProvider.tsx` | Analytics tracking hook | Requires `AnalyticsProvider` |
| `AnalyticsProvider` | `analytics/AnalyticsProvider.tsx` | Analytics context provider | `config` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `usePerformance` | `hooks/use-performance.tsx` | Performance monitoring | N/A |
| `useErrorTracking` | `analytics/hooks.tsx` | Error tracking hook | Requires `AnalyticsProvider` |
| `useTrackMount` | `analytics/hooks.tsx` | Track component mount | `eventName`, `properties?` |
| `useTrackUnmount` | `analytics/hooks.tsx` | Track component unmount | `eventName`, `properties?` |
| `useTrackChange` | `analytics/hooks.tsx` | Track value changes | `eventName`, `value`, `properties?` |
| `useTrackVisibility` | `analytics/hooks.tsx` | Track visibility changes | `eventName`, `properties?` |
| `useTrackClick` | `analytics/hooks.tsx` | Track click events | `eventName`, `properties?` |
| `useTrackSubmit` | `analytics/hooks.tsx` | Track form submissions | `eventName`, `properties?` |
| `useTrackError` | `analytics/hooks.tsx` | Track errors | N/A (returns function) |
| `useTrackTiming` | `analytics/hooks.tsx` | Track timing metrics | N/A (returns functions) |
| `useTrackFeature` | `analytics/hooks.tsx` | Track feature usage | `eventName`, `debounceMs?` |
| `useTrackScrollDepth` | `analytics/hooks.tsx` | Track scroll depth | `eventName`, `thresholds?` |
| `useTrackTimeOnPage` | `analytics/hooks.tsx` | Track time on page | `eventName`, `properties?` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `AnalyticsEvent` | `analytics/types.ts` | Analytics event type | N/A (type) |
| `PerformanceMonitor` | `observability/` | Performance monitoring service | `config` |
| `ErrorTracker` | `observability/` | Error tracking service | `config` |

---

## Developer Experience Domain

### Top-Level: Drop-In APIs

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `chatPresets` | `presets/chat-presets.ts` | Pre-configured chat presets | N/A (object) |
| `hookPresets` | `presets/chat-presets.ts` | Pre-configured hook presets | N/A (object) |
| `applyChatPreset` | `presets/chat-presets.ts` | Apply preset to chat config | `preset`, `config` |

### Mid-Level: Composable Building Blocks

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `ChatHookBuilder` | `hooks/use-chat-composable.ts` | Builder for custom chat hooks | `api` |

### Low-Level: Primitives and Utilities

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `normalizeMessages` | `utils/` | Normalize message format | `messages` |
| `buildContextBundle` | `utils/` | Build context bundle | `messages`, `options?` |
| Test utilities | `test-utils/` | Testing helpers | Various |

---

## Cross-Domain / Shared Components

### UI Primitives

| API | Location | Recommended Use Case | Config Required |
|-----|----------|---------------------|-----------------|
| `ErrorBoundary` | `components/error-boundary.tsx` | Error boundary component | `fallback?`, `onError?` |
| `ThinkingIndicator` | `components/thinking-indicator.tsx` | Loading/thinking indicator | `status?` |
| `RetryButton` | `components/retry-button.tsx` | Retry action button | `onRetry` |
| `NetworkStatus` | `components/network-status.tsx` | Network connection status | N/A |
| `TokenCounter` | `components/token-counter.tsx` | Token count display | `count`, `limit?` |
| `Skeleton` | `components/skeleton.tsx` | Loading skeleton | `variant?`, `className?` |
| `Toast` | `components/toast.tsx` | Toast notification | `message`, `variant?` |
| `Progress` | `components/progress.tsx` | Progress indicator | `value`, `max?` |

---

## API Validation Status

### ✅ Validated

- [x] All top-level APIs work with minimal configuration
- [x] Naming matches Phase 2 architecture model
- [x] Props/options use standardized conventions
- [x] TypeScript types are clear and accurate
- [x] No internal utilities exposed unintentionally
- [x] Deprecated APIs clearly marked

### 📝 Notes

- **Deprecated APIs**: `useClarityChatWithWindow`, `coreMessagesToMessages`, `coreMessageToMessage` are deprecated but maintained for backward compatibility
- **Legacy APIs**: `useChatLegacy`, `useChatEnhanced` are available for advanced users but `useChat` and `useClarityChat` are recommended
- **Internal APIs**: Some low-level utilities are exported for power users but documented as advanced/internal

---

## Recommended Entry Points

### For Most Users (90% of use cases)
1. **`ClarityChat`** - Simplest setup
2. **`ChatWithMemory`** - Chat with memory
3. **`useChat`** - Simplified hook

### For Advanced Users (10% of use cases)
1. **`useClarityChat`** - Full control
2. **`ChatWindow`** - Custom UI
3. **`useChatComposable`** - Feature composition

### For Power Users (<1% of use cases)
1. Low-level primitives
2. Internal utilities
3. Legacy APIs

---

**Last Updated**: Phase 4 API Validation  
**Status**: ✅ Complete
