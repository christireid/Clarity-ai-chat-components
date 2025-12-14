/**
 * @clarity-chat/react/slim - Minimal bundle entry point
 *
 * This entry point provides only the essential components and hooks
 * for basic chat functionality, resulting in a significantly smaller
 * bundle size (~200KB vs ~3MB for the full package).
 *
 * Use this when you only need:
 * - Drop-in ClarityChat component
 * - Basic useChat hook
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
 * import { useChat } from '@clarity-chat/react/slim'
 *
 * function ChatPage() {
 *   const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
 *   // ...
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// CORE COMPONENTS - Drop-in chat UI
// ============================================================================

export { ClarityChat, type ClarityChatProps } from './components/clarity-chat'
export { ChatWindow, type ChatWindowProps } from './components/chat-window'
export { ChatInput, type ChatInputProps } from './components/chat-input'
export { MessageList, type MessageListProps } from './components/message-list'
export { Message, type MessageProps } from './components/message'

// ============================================================================
// CORE HOOKS - Essential chat state management
// ============================================================================

export {
  useChat,
  type UseChatOptions,
  type UseChatReturn,
} from './hooks/use-chat-unified'
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './hooks/use-clarity-chat'
export {
  useChatHandlers,
  type UseChatHandlersOptions,
  type ChatHandlers,
} from './hooks/use-chat-handlers'

// ============================================================================
// CORE TYPES - Essential type definitions
// ============================================================================

export type {
  CoreMessage,
  CoreMessageContent,
  MessageRole,
} from './hooks/use-chat-enhanced'
export type { Message as MessageType, AIStatus } from '@clarity-chat/types'

// ============================================================================
// UTILITIES - Message conversion helpers
// ============================================================================

export { convertCoreMessagesToMessages } from './utils/message-conversion'
