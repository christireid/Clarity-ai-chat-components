/**
 * Chat Hooks
 *
 * Primary hooks for chat functionality:
 * - `useClarityChat` - Main hook for chat with messages, streaming, memory
 * - `useClarityChatWithTools` - Chat with tool/function calling
 * - `useClarityObject` - Structured output generation
 *
 * Utility hooks:
 * - `useChatHandlers` - Message handling utilities
 * - `useChatHistory` - Chat history management
 * - `useCompletion` - Text completion
 * - `useAssistant` - OpenAI Assistant API
 * - `useAgent` - AI agent orchestration
 * - `useRAGPipeline` - Retrieval-Augmented Generation
 */

// ============================================================================
// PRIMARY HOOKS (Recommended)
// ============================================================================

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
} from './use-clarity-chat'

export {
  useClarityObject,
  type UseClarityObjectOptions,
  type UseClarityObjectReturn,
} from './use-clarity-object'

export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
  type ExtractedToolResult,
} from './use-clarity-chat-with-tools'

// ============================================================================
// UTILITY HOOKS (Public)
// ============================================================================

export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './use-chat-handlers'

export * from './use-chat-history'
export * from './use-completion'
export * from './use-assistant'
export * from './use-agent'
export * from './use-rag-pipeline'

// ============================================================================
// CORE TYPES (Re-exported from internal)
// ============================================================================

// CoreMessage and related types are re-exported for consumers who need type compatibility
export { type CoreMessage } from './use-chat-enhanced'


// ============================================================================
// INTERNAL HOOKS (Not for public use - use useClarityChat instead)
// ============================================================================

// useChatEnhanced is now internal only - exported here for backward compatibility
// but should not be used directly by external consumers
/**
 * @internal
 * @deprecated This hook is for internal use only. Use useClarityChat instead.
 */
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
} from './use-chat-enhanced'
