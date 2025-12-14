'use client'

/**
 * @clarity-chat/react/hooks - All React Hooks
 *
 * This entry point exports all hooks from the library for tree-shakeable imports.
 * Hooks are organized by domain for better discoverability.
 *
 * ## Hook Categories
 *
 * - **Chat Hooks**: Core chat and AI interaction hooks
 * - **Streaming Hooks**: Real-time streaming response hooks
 * - **Memory Hooks**: Conversation persistence hooks
 * - **Token Hooks**: Token counting and optimization hooks
 * - **Resilience Hooks**: Error handling and retry hooks
 * - **UI Hooks**: General UI utility hooks
 * - **Keyboard Hooks**: Keyboard navigation and shortcuts
 * - **Storage Hooks**: Data persistence (localStorage, IndexedDB)
 * - **Performance Hooks**: Performance optimization hooks
 * - **Theme Hooks**: Theme management hooks
 * - **Dashboard Hooks**: Analytics dashboard hooks
 * - **Security Hooks**: Security and validation hooks
 *
 * @example
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
// CHAT HOOKS (Primary)
// =============================================================================

/**
 * Primary chat state management hook
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
 * Unified chat hook
 */
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/chat/use-chat-unified'

/**
 * Structured output hook
 */
export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './hooks/chat/use-clarity-object'

/**
 * Enhanced chat hook with more features
 */
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
  type CoreMessage,
} from './hooks/chat/use-chat-enhanced'

/**
 * Chat handlers hook
 */
export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/chat/use-chat-handlers'

/**
 * Chat with tools hook
 */
export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
  type ExtractedToolResult,
} from './hooks/chat/use-clarity-chat-with-tools'

/**
 * Agent hook
 */
export {
  useAgent,
  type UseAgentOptions,
  type UseAgentReturn,
} from './hooks/chat/use-agent'

/**
 * RAG pipeline hook
 */
export {
  useRAGPipeline,
  type UseRAGPipelineOptions,
  type UseRAGPipelineReturn,
} from './hooks/chat/use-rag-pipeline'

/**
 * Memory store hook
 */
export {
  useMemoryStore,
  type UseMemoryStoreOptions,
  type UseMemoryStoreReturn,
} from './hooks/storage/use-memory-store'

/**
 * Chat history hook with undo/redo
 */
export {
  useChatHistory,
  type ChatHistoryOptions,
  type UseChatHistoryReturn,
  type ChatMessage as ChatHistoryMessage,
} from './hooks/chat/use-chat-history'

/**
 * Legacy chat hook (deprecated)
 * @deprecated Use `useChat` instead
 */
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './hooks/chat/use-chat'

// Additional chat hooks from subdirectory
export * from './hooks/chat/use-clarity-chat-helpers'
export * from './hooks/chat/use-chat-core'
export * from './hooks/chat/use-chat-simple'
export * from './hooks/chat/use-chat-composable'
export * from './hooks/chat/use-chat-with-operations'
export * from './hooks/chat/use-completion'
export * from './hooks/chat/use-assistant'

// =============================================================================
// STREAMING HOOKS
// =============================================================================

export * from './hooks/streaming'

// =============================================================================
// MEMORY HOOKS
// =============================================================================

export {
  useMemoryContext,
  type UseMemoryContextReturn,
} from './memory/memory-provider'

// =============================================================================
// RESILIENCE HOOKS (AI-OPS)
// =============================================================================

export * from './hooks/resilience'

// =============================================================================
// TOKEN HOOKS
// =============================================================================

export * from './hooks/token'

// =============================================================================
// UI UTILITY HOOKS
// =============================================================================

export * from './hooks/ui'

// =============================================================================
// KEYBOARD HOOKS
// =============================================================================

export * from './hooks/keyboard'

// =============================================================================
// STORAGE HOOKS
// =============================================================================

export * from './hooks/storage'

// =============================================================================
// PERFORMANCE HOOKS
// =============================================================================

export * from './hooks/performance'

// =============================================================================
// THEME HOOKS
// =============================================================================

export * from './hooks/theme'

// =============================================================================
// DASHBOARD HOOKS
// =============================================================================

export * from './hooks/dashboard'

// =============================================================================
// INPUT HOOKS
// =============================================================================

export * from './hooks/input'

// =============================================================================
// CONTEXT HOOKS
// =============================================================================

export * from './hooks/context'

// =============================================================================
// MODEL HOOKS
// =============================================================================

export * from './hooks/model'

// =============================================================================
// MESSAGE HOOKS
// =============================================================================

export * from './hooks/message'

// =============================================================================
// SECURITY HOOKS
// =============================================================================

export * from './hooks/security'
