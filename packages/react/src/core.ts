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
export { ClarityChat, type ClarityChatProps } from './components/clarity-chat'
export { ClarityChatSimple, type ClarityChatSimpleProps } from './components/clarity-chat-simple'

// Main hook
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'

// Core components
export { ChatWindow, type ChatWindowProps } from './components/chat-window'
export { ChatInput } from './components/chat-input'
export { MessageList } from './components/message-list'

// Core types
export type { Message, MessageRole } from '@clarity-chat/types'

// Core utilities
export {
  convertCoreMessagesToMessages,
  convertMessagesToCoreMessages,
} from './utils/message-conversion'

// Error handling
export { ErrorBoundary } from './components/error-boundary'

// Composed hooks
export {
  useChatWithOperations,
  type UseChatWithOperationsOptions,
  type UseChatWithOperationsReturn,
} from './hooks/use-chat-with-operations'

// Simplified hook
export {
  useChatSimple,
  type UseChatSimpleOptions,
  type UseChatSimpleReturn,
} from './hooks/use-chat-simple'

// Memory store factory
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from './memory/create-memory-store'
