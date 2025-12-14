/**
 * Core Exports - Essential APIs Only
 *
 * This file exports only the most essential APIs for a simpler import experience.
 * Use this if you want to import just the basics without the full library.
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react/core'
 * ```
 *
 * @fileoverview Core essential APIs
 */

// Main high-level component
export {
  ClarityChat,
  type ClarityChatProps,
} from './components/chat/clarity-chat'
export {
  ClarityChatSimple,
  type ClarityChatSimpleProps,
} from './components/chat/clarity-chat-simple'

// Main hook
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'

// Core components
export { ChatWindow, type ChatWindowProps } from './components/chat/chat-window'
export { ChatInput } from './components/chat/chat-input'
export { MessageList } from './components/message/message-list'

// Core types
export type { Message, MessageRole } from '@clarity-chat/types'

// Core utilities
export {
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message/message-conversion'

// Error handling
export { ErrorBoundary } from './components/feedback/error-boundary'
export {
  ChatWithErrorBoundary,
  type ChatWithErrorBoundaryProps,
} from './components/chat/chat-with-error-boundary'

// Composed hooks
export {
  useChatWithOperations,
  type UseChatWithOperationsOptions,
  type UseChatWithOperationsReturn,
} from './hooks/chat/use-chat-with-operations'

// Simplified hook
export {
  useChatSimple,
  type UseChatSimpleOptions,
  type UseChatSimpleReturn,
} from './hooks/chat/use-chat-simple'

// Memory store factory
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from './memory/create-memory-store'
