/**
 * Chat Hooks
 *
 * Core hooks for managing chat state, messages, and AI interactions.
 */

// Primary Chat Hooks
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

// Enhanced Chat Hook
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
  type CoreMessage,
} from './use-chat-enhanced'

// Unified Chat Hook
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './use-chat-unified'

// Legacy Chat Hook
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from './use-chat'

// Chat Handlers
export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './use-chat-handlers'

// Additional Chat Hooks
export * from './use-chat-simple'
export * from './use-chat-composable'
export * from './use-chat-history'

// AI Hooks
export * from './use-completion'
export * from './use-assistant'
