/**
 * @clarity-chat/react/slim - Minimal bundle entry point
 *
 * This entry point provides only the essential components and hooks
 * for basic chat functionality, resulting in a significantly smaller
 * bundle size (~200KB vs ~3MB for the full package).
 *
 * Use this when you only need:
 * - Drop-in ClarityChat component
 * - Core useClarityChat hook
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react/slim'
 * import '@clarity-chat/react/styles.css'
 *
 * function App() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 *
 * @example
 * ```tsx
 * import { useClarityChat } from '@clarity-chat/react/slim'
 *
 * function ChatPage() {
 *   const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
 *   // ...
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE COMPONENTS - Drop-in chat UI
// ============================================================================

export {
  ClarityChat,
  type ClarityChatProps,
} from './components/chat/ClarityChat'
export { ChatWindow, type ChatWindowProps } from './components/chat/ChatWindow'
export { ChatInput, type ChatInputProps } from './components/chat/ChatInput'
/** @deprecated Use TanStackMessageList instead. See CODE_REUSE_AUDIT.md P0-12 */
export {
  default as MessageList,
  type MessageListProps,
} from './components/chat/VirtualizedMessageList'
export {
  TanStackMessageList,
  AutoTanStackMessageList,
  type TanStackMessageListProps,
  type AutoTanStackMessageListProps,
} from './components/chat/tanstack-message-list'
export { Message, type MessageProps } from './components/message/message'

// ============================================================================
// CORE HOOKS - Essential chat state management
// ============================================================================

// useChat was removed in v2.0 - use useClarityChat instead
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'
export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/chat/use-chat-handlers'

// ============================================================================
// CORE TYPES - Essential type definitions
// ============================================================================

export type {
  CoreMessage,
  CoreMessageContent,
  MessageRole,
} from './internal/hooks/use-chat-enhanced'
export type { Message as MessageType, AIStatus } from '@clarity-chat/types'

// ============================================================================
// UTILITIES - Message conversion helpers
// ============================================================================

export { convertCoreMessagesToMessages } from './utils/message/message-conversion'
