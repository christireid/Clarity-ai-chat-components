'use client'

/**
 * @clarity-chat/react/core - Minimal Bundle Entry Point
 *
 * This file exports only the most essential APIs for a minimal bundle size.
 * Use this entry point when you want just the basics without the full library.
 *
 * Bundle size: ~30% smaller than the full library
 *
 * ## When to Use
 *
 * Use this entry point when:
 * - You only need basic chat functionality
 * - Bundle size is critical (e.g., mobile apps)
 * - You'll add features incrementally
 *
 * ## What's Included
 *
 * - Core Components: ClarityChat, ChatWindow, ChatInput, MessageList
 * - Primary Hook: useClarityChat
 * - Essential Types: Message, MessageRole
 * - Error Handling: ErrorBoundary, ChatWithErrorBoundary
 * - Memory: createMemoryStore
 *
 * @example
 * ```tsx
 * import { ClarityChat, useClarityChat } from '@clarity-chat/react/core'
 *
 * function App() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Combine with feature-specific imports for tree-shaking
 * import { ClarityChat } from '@clarity-chat/react/core'
 * import { useStreamingSSE } from '@clarity-chat/react/hooks'
 * import { TokenCounter } from '@clarity-chat/react/components'
 * ```
 *
 * @packageDocumentation
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

// Types are exported above with their components

// =============================================================================
// PRIMARY HOOK
// =============================================================================

/**
 * Primary chat state management hook
 */
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/chat/use-clarity-chat'

// Core components
export { ChatWindow, type ChatWindowProps } from './components/chat/chat-window'
export { ChatInput } from './components/chat/chat-input'
export { MessageList } from './components/message/message-list'

// =============================================================================
// CORE TYPES
// =============================================================================

/**
 * Essential message types
 */
export type { Message, MessageRole } from '@clarity-chat/types'

// =============================================================================
// MESSAGE UTILITIES
// =============================================================================

/**
 * Message conversion utilities
 */
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

// =============================================================================
// COMPOSED HOOKS
// =============================================================================

/**
 * Simplified chat hook for basic use cases
 */
export {
  useChatSimple,
  type UseChatSimpleOptions,
  type UseChatSimpleReturn,
} from './hooks/chat/use-chat-simple'

// =============================================================================
// MEMORY
// =============================================================================

/**
 * Memory store factory for conversation persistence
 */
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from './memory/create-memory-store'
