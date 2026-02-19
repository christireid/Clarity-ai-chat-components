/**
 * Chat UI Domain
 *
 * Comprehensive components and hooks for chat interfaces.
 */

// =============================================================================
// TOP-LEVEL: Drop-in ready (use these first)
// =============================================================================

export {
  ClarityChat,
  type ClarityChatProps,
} from '../../components/clarity-chat'

export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from '../../hooks/chat/use-clarity-chat'

// =============================================================================
// MID-LEVEL: Composable building blocks
// =============================================================================

export { ChatWindow, type ChatWindowProps } from '../../components/ChatWindow'
export { ChatLayout, type ChatLayoutProps } from '../../components/ChatLayout'
export { ChatInput } from '../../components/ChatInput'
export { MessageList } from '../../components/MessageList'

// =============================================================================
// LOW-LEVEL: Primitives for custom UIs
// =============================================================================

export { Message } from '../../components/message'
export { StreamingMessage } from '../../components/StreamingMessage'

// Composable primitives (Radix-style)
export {
  ChatPrimitive,
  ChatRoot,
  ChatMessages,
  ChatMessage,
  ChatMessageContent,
  ChatMessageActions,
  ChatInput as ChatInputPrimitive,
  ChatCopyButton,
  ChatRegenerateButton,
  ChatDeleteButton,
  ChatEmptyState,
  ChatLoadingIndicator,
} from '../../primitives/chat'
