/**
 * Chat UI Domain Exports
 *
 * Top-level: Drop-in components
 * Mid-level: Composable building blocks
 * Low-level: Primitives and utilities
 */

// ============================================================================
// TOP-LEVEL: Drop-in Components
// ============================================================================

// Main drop-in component
export { ClarityChat, type ClarityChatProps } from '../components/clarity-chat'

// Recipe components (pre-built combinations)
export {
  ChatWithMemory,
  ChatWithAnalytics,
  ChatWithPreset,
  ChatWithPersistence,
  ChatWithErrorHandling,
  ChatComplete,
  type ChatWithMemoryProps,
  type ChatWithAnalyticsProps,
  type ChatWithPresetProps,
  type ChatWithPersistenceProps,
  type ChatWithErrorHandlingProps,
  type ChatCompleteProps,
} from '../components/chat-recipes'

// Error boundary wrapper
export {
  ChatWithErrorBoundary,
  type ChatWithErrorBoundaryProps,
} from '../components/chat-with-error-boundary'

// ============================================================================
// MID-LEVEL: Composable Building Blocks
// ============================================================================

// Simplified unified hook
export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from '../hooks/use-chat-unified'

// Main chat hook
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
} from '../hooks/use-clarity-chat'

// Composable hooks
export {
  useChatComposable,
  useChatWithFeatures,
  createChatHook,
  ChatHookBuilder,
  type ChatFeatures,
} from '../hooks/use-chat-composable'

// Chat window component
export {
  ChatWindow,
  type ChatWindowProps,
} from '../components/chat/chat-window'

// Message components
export { Message, type MessageProps } from '../components/message'
export { MessageList, type MessageListProps } from '../components/message-list'
export { VirtualizedMessageList } from '../components/virtualized-message-list'

// Input components
export { ChatInput, type ChatInputProps } from '../components/chat-input'
export {
  AdvancedChatInput,
  type AdvancedChatInputProps,
} from '../components/advanced-chat-input'

// ============================================================================
// LOW-LEVEL: Primitives and Utilities
// ============================================================================

// Legacy chat hook (for backward compatibility)
// Note: This is the original useChat from use-chat.ts
export {
  useChat as useChatLegacy,
  type UseChatOptions as UseChatOptionsLegacy,
  type UseChatReturn as UseChatReturnLegacy,
} from '../hooks/use-chat'

// Enhanced chat hook (internal use, but exported for advanced users)
// Note: This is useChat from use-chat-enhanced.ts
export {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
} from '../hooks/chat/use-chat-enhanced'

// Message conversion utilities
export {
  convertCoreMessageToMessage,
  convertMessageToCoreMessage,
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
  // Deprecated but kept for backward compatibility
  coreMessagesToMessages,
  coreMessageToMessage,
} from '../utils/message/message-conversion'

// Helper hooks
export {
  useClarityChatWithWindow,
  useClarityChatWithAnalytics,
  useClarityChatWithPersistence,
  useClarityChatWithDebounce,
  useClarityChatWithAutoSave,
} from '../hooks/use-clarity-chat-helpers'

// Tool integration
export {
  useClarityChatWithTools,
  type UseClarityChatWithToolsOptions,
  type UseClarityChatWithToolsReturn,
  type ExtractedToolResult,
} from '../hooks/use-clarity-chat-with-tools'
