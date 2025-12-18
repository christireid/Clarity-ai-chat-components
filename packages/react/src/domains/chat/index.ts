/**
 * Chat UI Domain
 *
 * Top-level APIs for chat user interface
 */

// Top-level: Drop-in ready components
export {
  ClarityChat,
  type ClarityChatProps,
} from '../../components/clarity-chat'
export {
  ClarityChatSimple,
  type ClarityChatSimpleProps,
} from '../../components/clarity-chat-simple'

// Top-level: Main hook
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from '../../hooks/chat/use-clarity-chat'

// Mid-level: Building blocks
export { ChatWindow, type ChatWindowProps } from '../../components/chat-window'
export { ChatLayout, type ChatLayoutProps } from '../../components/chat-layout'
export { ChatInput } from '../../components/chat-input'
export { MessageList } from '../../components/message-list'
export {
  useChatCore,
  type UseChatCoreOptions,
  type UseChatCoreReturn,
} from '../../hooks/use-chat-core'
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
// TODO: Re-enable once MessageBubble is implemented
// export { MessageBubble } from '../../components/message'
// TODO: Re-enable once normalizeMessages is implemented
// export { normalizeMessages } from '../../utils/message-conversion'
