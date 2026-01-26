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
export { ClarityChat, type ClarityChatProps } from '../components/ClarityChat'

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
} from '../components/ChatRecipes'

// Error boundary wrapper
export {
  ChatWithErrorBoundary,
  type ChatWithErrorBoundaryProps,
} from '../components/ChatWithErrorBoundary'

// ============================================================================
// MID-LEVEL: Composable Building Blocks
// ============================================================================

// Main chat hook (useChat was removed in v2.0)
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

// Chat window component
export {
  ChatWindow,
  type ChatWindowProps,
} from '../components/chat/chat-window'

// Message components
export { Message, type MessageProps } from '../components/message'
export { MessageList, type MessageListProps } from '../components/MessageList'
export { VirtualizedMessageList } from '../components/VirtualizedMessageList'

// Input components
export { ChatInput, type ChatInputProps } from '../components/ChatInput'
export {
  AdvancedChatInput,
  type AdvancedChatInputProps,
} from '../components/advanced-chat-input'

// ============================================================================
// LOW-LEVEL: Primitives and Utilities
// ============================================================================

// Enhanced chat hook (internal use, but exported for advanced users)
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
