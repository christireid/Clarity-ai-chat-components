/**
 * Chat Hooks
 *
 * Three primary hooks for chat functionality:
 * - `useClarityChat` - Main hook for chat with messages, streaming, memory
 * - `useClarityObject` - Structured output generation
 * - `useClarityChatWithTools` - Chat with tool/function calling
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
// UTILITY HOOKS
// ============================================================================

export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './use-chat-handlers'

export * from './use-chat-history'
export * from './use-completion'
export * from './use-assistant'

// ============================================================================
// CORE TYPES
// ============================================================================

export { type CoreMessage } from './use-chat-enhanced'

// ============================================================================
// DEPRECATED HOOKS (Will be removed in v2.0)
// Use useClarityChat instead
// ============================================================================

/** @deprecated Use useClarityChat instead */
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
} from './use-chat-enhanced'

/** @deprecated Use useClarityChat instead */
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './use-chat-unified'

/** @deprecated Use useClarityChat instead */
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './use-chat'

/** @deprecated Use useClarityChat instead. ChatWindow accepts CoreMessage[] directly. */
export * from './use-chat-simple'

/** @deprecated Use useClarityChat with primitives instead */
export * from './use-chat-composable'
