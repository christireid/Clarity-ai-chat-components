/**
 * Chat UI Domain
 * 
 * Top-level APIs for chat user interface
 */

// Top-level: Drop-in ready components
export { ClarityChat, type ClarityChatProps } from '../../components/clarity-chat'
export { ClarityChatSimple, type ClarityChatSimpleProps } from '../../components/clarity-chat-simple'

// Top-level: Main hook
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from '../../hooks/use-clarity-chat'

// Mid-level: Building blocks
export { ChatWindow, type ChatWindowProps } from '../../components/chat-window'
export { ChatInput } from '../../components/chat-input'
export { MessageList } from '../../components/message-list'
export {
  useChatSimple,
  type UseChatSimpleOptions,
  type UseChatSimpleReturn,
} from '../../hooks/use-chat-simple'
export {
  useChatWithOperations,
  type UseChatWithOperationsOptions,
  type UseChatWithOperationsReturn,
} from '../../hooks/use-chat-with-operations'

// Low-level: Primitives
export { Message } from '../../components/message'
export { StreamingMessage } from '../../components/streaming-message'
export { MessageBubble } from '../../components/message'
export { normalizeMessages } from '../../utils/message-conversion'
