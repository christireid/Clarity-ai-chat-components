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
} from './components/chat/clarity-chat'
export { ChatWindow, type ChatWindowProps } from './components/chat/chat-window'
export { ChatInput, type ChatInputProps } from './components/chat/chat-input'
export {
  default as MessageList,
  type MessageListProps,
} from './components/chat/virtualized-message-list'
export { Message, type MessageProps } from './components/message/message'

// ============================================================================
// CORE HOOKS - Essential chat state management
// ============================================================================

export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/chat/use-chat-unified'
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/chat/use-clarity-chat'
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
} from './hooks/chat/use-chat-enhanced'
export type { Message as MessageType, AIStatus } from '@clarity-chat/types'

// ============================================================================
// UTILITIES - Message conversion helpers
// ============================================================================

export { convertCoreMessagesToMessages } from './utils/message/message-conversion'
