# Phase 4: Public API Surface Analysis

## Overview
This document catalogs all public exports from `@clarity-chat/react` and categorizes them by:
- Architecture Layer (Top-Level, Mid-Level, Low-Level)
- Domain (Chat UI, Chat State, Memory, etc.)
- Recommended Use Case
- Status (Public, Internal, Deprecated)

## Public API Table

### TOP-LEVEL APIs (Drop-in Ready)

#### Chat UI Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `ClarityChat` | `components/clarity-chat` | Complete chat UI with zero config | ✅ Public |
| `ClarityChatPresets` | `components/clarity-chat-presets` | Pre-configured chat variants | ✅ Public |

#### Chat State Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useClarityChat` | `hooks/use-clarity-chat` | Primary chat hook with memory/streaming | ✅ Public |
| `useClarityObject<T>` | `hooks/use-clarity-object` | Type-safe structured output generation | ✅ Public |

#### Memory Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `MemoryProvider` | `memory/memory-provider` | Memory context provider | ✅ Public |

#### Tools & Agents Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `createAgent` | `agents/index` | Agent factory for tool orchestration | ✅ Public |

### MID-LEVEL APIs (Composable Building Blocks)

#### Chat UI Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `ChatWindow` | `components/chat-window` | Composable chat interface | ✅ Public |
| `ChatInput` | `components/chat-input` | Message input component | ✅ Public |
| `AdvancedChatInput` | `components/advanced-chat-input` | Enhanced input with attachments | ✅ Public |
| `MessageList` | `components/virtualized-message-list` | Virtualized message list | ✅ Public |
| `StreamingMessage` | `components/streaming-message` | Real-time streaming display | ✅ Public |
| `ThinkingIndicator` | `components/thinking-indicator` | Loading/thinking indicator | ✅ Public |

#### Chat State Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useChatEnhanced` | `hooks/use-chat-enhanced` | Enhanced chat hook (Vercel-compatible) | ✅ Public |
| `useChatHandlers` | `hooks/use-chat-handlers` | Pre-configured chat handlers | ✅ Public |
| `useClarityChatWithTools` | `hooks/use-clarity-chat-with-tools` | Chat with tool calling | ✅ Public |
| `useCompletion` | `hooks/use-completion` | Text completion hook | ✅ Public |
| `useAssistant` | `hooks/use-assistant` | Assistant hook with tools | ✅ Public |

#### Memory Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useMemoryContext` | `memory/memory-provider` | Access memory context safely | ✅ Public |

#### Streaming Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useStreamingSSE` | `hooks/use-streaming-sse` | SSE streaming hook | ✅ Public |
| `useStreamingWebSocket` | `hooks/use-streaming-websocket` | WebSocket streaming hook | ✅ Public |
| `useStreaming` | `hooks/use-streaming` | Low-level streaming primitive | ✅ Public |
| `useStreamableUI` | `hooks/use-streamable-ui` | UI streaming utilities | ✅ Public |

#### Tools Domain
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `createToolUIRegistry` | `agents/tool-ui-registry` | Tool result UI registry | ✅ Public |
| `ToolUIRegistry` | `agents/tool-ui-registry` | Tool registry class | ✅ Public |

### LOW-LEVEL APIs (Primitives & Utilities)

#### Message Utilities
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `convertCoreMessageToMessage` | `utils/message-conversion` | Message format conversion | ✅ Public |
| `convertMessageToCoreMessage` | `utils/message-conversion` | Reverse conversion | ✅ Public |
| `convertCoreMessagesToMessages` | `utils/message-conversion` | Batch conversion | ✅ Public |
| `convertMessagesToCoreMessages` | `utils/message-conversion` | Batch reverse conversion | ✅ Public |
| `createUserMessage` | `utils/chat-helpers` | Create user message | ✅ Public |
| `createAssistantMessage` | `utils/chat-helpers` | Create assistant message | ✅ Public |
| `createSystemMessage` | `utils/chat-helpers` | Create system message | ✅ Public |
| `createToolResultMessage` | `utils/chat-helpers` | Create tool result message | ✅ Public |

#### Configuration Helpers
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `createBasicChatConfig` | `utils/clarity-chat-helpers` | Basic config builder | ✅ Public |
| `createMemoryChatConfig` | `utils/clarity-chat-helpers` | Memory config builder | ✅ Public |
| `createStreamingChatConfig` | `utils/clarity-chat-helpers` | Streaming config builder | ✅ Public |
| `createEnterpriseChatConfig` | `utils/clarity-chat-helpers` | Enterprise config builder | ✅ Public |
| `isValidApiEndpoint` | `utils/clarity-chat-helpers` | Validate API endpoint | ✅ Public |
| `getApiEndpoint` | `utils/clarity-chat-helpers` | Get normalized endpoint | ✅ Public |

#### Type Utilities
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `isMemoryEnabled` | `types/clarity-chat-types` | Check if memory enabled | ✅ Public |
| `isUserMessage` | `types/clarity-chat-types` | Type guard for user messages | ✅ Public |
| `isAssistantMessage` | `types/clarity-chat-types` | Type guard for assistant messages | ✅ Public |
| `hasTextContent` | `types/clarity-chat-types` | Check for text content | ✅ Public |
| `extractTextContent` | `types/clarity-chat-types` | Extract text from message | ✅ Public |

#### Legacy/Internal APIs (Review Needed)
| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useChat` | `hooks/use-chat` | Legacy chat hook | ⚠️ Consider Deprecating |
| `useClarityChatWithWindow` | `hooks/use-clarity-chat-helpers` | Helper hook | ⚠️ Consider Internal |
| `useClarityChatWithAnalytics` | `hooks/use-clarity-chat-helpers` | Helper hook | ⚠️ Consider Internal |
| `useClarityChatWithPersistence` | `hooks/use-clarity-chat-helpers` | Helper hook | ⚠️ Consider Internal |
| `useClarityChatWithDebounce` | `hooks/use-clarity-chat-helpers` | Helper hook | ⚠️ Consider Internal |
| `useClarityChatWithAutoSave` | `hooks/use-clarity-chat-helpers` | Helper hook | ⚠️ Consider Internal |

### ENTERPRISE INFRASTRUCTURE (Top-Level Providers)

| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `AnalyticsProvider` | `analytics` | Analytics provider | ✅ Public |
| `useAnalytics` | `analytics` | Analytics hook | ✅ Public |
| `ObservabilityProvider` | `observability` | Observability provider | ✅ Public |
| `QuotaProvider` | `quotas` | Quota management | ✅ Public |
| `RBACProvider` | `rbac` | Role-based access control | ✅ Public |
| `MultiTenancyProvider` | `multi-tenancy` | Multi-tenancy support | ✅ Public |
| `AuditProvider` | `audit` | Audit logging | ✅ Public |
| `WebhookProvider` | `webhooks` | Webhook management | ✅ Public |

### ADDITIONAL COMPONENTS (Feature-Specific)

These are exported but may need categorization:
- Message components (Message, MessageMetadata, StreamBlock, etc.)
- Tool components (ToolInvocationCard, ClarityToolResult, etc.)
- Feature components (ModelSelector, ContextCard, SettingsPanel, etc.)
- Error handling (ErrorBoundary, RetryButton, NetworkStatus)
- Token management (TokenCounter, TokenOptimizationPanel)

**Status**: ✅ Public but may benefit from better organization

### UTILITY HOOKS

| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `useDebounce` | `hooks/use-debounce` | Debounce values/callbacks | ✅ Public |
| `useThrottle` | `hooks/use-throttle` | Throttle values/callbacks | ✅ Public |
| `useLocalStorage` | `hooks/use-local-storage` | LocalStorage hook | ✅ Public |
| `useAutoScroll` | `hooks/use-auto-scroll` | Auto-scroll utility | ✅ Public |
| `useClipboard` | `hooks/use-clipboard` | Clipboard utilities | ✅ Public |
| `useEventListener` | `hooks/use-event-listener` | Event listener hook | ✅ Public |
| `useMediaQuery` | `hooks/use-media-query` | Media query hook | ✅ Public |
| `useMounted` | `hooks/use-mounted` | Mount state hook | ✅ Public |
| `usePrevious` | `hooks/use-previous` | Previous value hook | ✅ Public |
| `useToggle` | `hooks/use-toggle` | Toggle state hook | ✅ Public |

**Status**: ✅ Public - Utility hooks are fine to export

### TESTING UTILITIES

| Export | Location | Use Case | Status |
|--------|----------|----------|--------|
| `createMockUseClarityChat` | `test-utils` | Test mock factory | ⚠️ Should be Internal |
| `createTestMessages` | `test-utils` | Test message factory | ⚠️ Should be Internal |
| `simulateStreamingResponse` | `test-utils` | Test streaming helper | ⚠️ Should be Internal |

**Status**: ⚠️ Testing utilities should NOT be in public API

## Recommendations

### 1. Move to Internal
- Testing utilities (`test-utils/*`)
- Helper hooks that are implementation details (`useClarityChatWith*`)

### 2. Consider Deprecating
- `useChat` (legacy, use `useChatEnhanced` or `useClarityChat` instead)

### 3. Organize Better
- Group feature components by domain
- Create sub-exports for enterprise features
- Consider namespace exports for related utilities

### 4. Add Validation
- All top-level APIs need runtime validation
- Mid-level APIs should validate required props
- Low-level utilities should validate inputs

### 5. Documentation
- Each public API needs JSDoc with architecture layer
- Examples for each top-level API
- Migration guides for deprecated APIs
