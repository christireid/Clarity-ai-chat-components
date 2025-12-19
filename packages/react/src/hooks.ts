'use client'

/**
 * @clarity-chat/react/hooks - All React Hooks
 *
 * This entry point exports all hooks from the library for tree-shakeable imports.
 * Hooks are organized by domain for better discoverability.
 *
 * ## Hook Categories
 *
 * | Category | Description | Key Hooks |
 * |----------|-------------|-----------|
 * | **Chat** | Core chat and AI interaction | `useClarityChat`, `useChat`, `useAgent` |
 * | **Streaming** | Real-time streaming responses | `useStreamingSSE`, `useStreamingWebSocket` |
 * | **Memory** | Conversation persistence | `useMemoryStore`, `useMemoryContext` |
 * | **Token** | Token counting and optimization | `useTokenBudgetMonitor`, `useTokenTracker` |
 * | **Resilience** | Error handling and retry | `useCircuitBreaker`, `useRetryWithBackoff` |
 * | **UI** | General UI utilities | `useReducedMotion`, `useClipboard` |
 * | **Keyboard** | Keyboard navigation | `useKeyboardShortcuts`, `useKeyboardNavigation` |
 * | **Storage** | Data persistence | `useLocalStorage`, `useIndexedDB` |
 * | **Performance** | Performance optimization | `useRenderPerformance`, `useDeferredSearch` |
 * | **Theme** | Theme management | `useThemeColors`, `useThemeAnalytics` |
 *
 * @example Basic usage
 * ```tsx
 * import { useClarityChat } from '@clarity-chat/react/hooks'
 *
 * function ChatComponent() {
 *   const { messages, sendMessage, isLoading } = useClarityChat({
 *     api: '/api/chat'
 *   })
 *   // ...
 * }
 * ```
 *
 * @example Multiple hooks
 * ```tsx
 * import {
 *   useClarityChat,
 *   useStreamingSSE,
 *   useCircuitBreaker,
 *   useLocalStorage
 * } from '@clarity-chat/react/hooks'
 * ```
 *
 * @packageDocumentation
 */

// =============================================================================
// PRIMARY CHAT HOOKS
// These are the most commonly used hooks - explicitly exported for documentation
// =============================================================================

/**
 * Primary chat state management hook.
 * This is the main hook for building chat interfaces.
 *
 * @see {@link https://docs.clarity-chat.com/hooks/use-clarity-chat | Documentation}
 */
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
  type ClarityMemoryOptions,
  type ClarityWebSocketOptions,
  type ClarityChatMemoryInfo,
  type ClarityChatErrorInfo,
  type ClarityPromptOptimizationOptions,
  type ClarityChatTokenStats,
} from './hooks/chat/use-clarity-chat'

/**
 * Unified chat hook with enhanced features.
 * Use this for more control over chat behavior.
 */
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/chat/use-chat-unified'

/**
 * Hook for generating structured JSON objects with AI.
 * Returns typed, validated objects instead of plain text.
 */
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

/**
 * Hook for AI agent interactions with tool calling.
 */
// NOTE: Commented out due to missing dependencies
// export {
//   useAgent,
//   type UseAgentOptions,
//   type UseAgentReturn,
// } from './hooks/chat/use-agent'

/**
 * Hook for RAG (Retrieval Augmented Generation) pipelines.
 * Combines vector search with AI generation.
 */
// NOTE: Commented out due to missing dependencies
// export {
//   useRAGPipeline,
//   type UseRAGPipelineOptions,
//   type UseRAGPipelineReturn,
// } from './hooks/chat/use-rag-pipeline'

/**
 * Hook for persistent conversation memory.
 */
export {
  useMemoryStore,
  type UseMemoryStoreOptions,
  type UseMemoryStoreReturn,
} from './hooks/storage/use-memory-store'

/**
 * Hook for chat history with undo/redo support.
 */
export {
  useChatHistory,
  type ChatHistoryOptions,
  type UseChatHistoryReturn,
  type ChatMessage as ChatHistoryMessage,
} from './hooks/chat/use-chat-history'

/**
 * Memory context hook for accessing the MemoryProvider.
 */
export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// =============================================================================
// ALL HOOKS BY DOMAIN
// Re-exported from organized subdirectories
// =============================================================================

/** Chat hooks - core chat functionality */
export * from './hooks/chat'

/** Streaming hooks - SSE, WebSocket, and streaming utilities */
export * from './hooks/streaming'

/** Resilience hooks - circuit breaker, retry, deduplication */
export * from './hooks/resilience'

/** Token hooks - budget monitoring, tracking, optimization */
export * from './hooks/token'

/** UI hooks - clipboard, scroll, animations, etc. */
export * from './hooks/ui'

/** Keyboard hooks - shortcuts and navigation */
export * from './hooks/keyboard'

/** Storage hooks - localStorage, IndexedDB */
export * from './hooks/storage'

/** Performance hooks - render tracking, deferred operations */
// NOTE: Commenting out to avoid duplicate exports (useIntersectionObserver)
// export * from './hooks/performance'

/** Theme hooks - colors, analytics, shortcuts */
export * from './hooks/theme'

/** Dashboard hooks - analytics data */
export * from './hooks/dashboard'

/** Input hooks - voice, mobile keyboard */
export * from './hooks/input'

/** Context hooks - monitoring, management */
export * from './hooks/context'

/** Model hooks - routing, selection */
export * from './hooks/model'

/** Message hooks - history, operations */
export * from './hooks/message'

/** Security hooks - validation, sanitization */
// export * from './hooks/security'
