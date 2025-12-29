/**
 * Chat Primitives
 *
 * Low-level, composable building blocks for custom chat UIs.
 * Inspired by Radix UI primitives - unstyled, accessible, composable.
 *
 * @example
 * ```tsx
 * import { ChatPrimitive } from '@clarity-chat/react/primitives'
 *
 * function CustomChat() {
 *   const chat = useClarityChat({ api: '/api/chat' })
 *
 *   return (
 *     <ChatPrimitive.Root>
 *       <ChatPrimitive.Messages>
 *         {chat.messages.map((msg) => (
 *           <ChatPrimitive.Message key={msg.id} message={msg}>
 *             <ChatPrimitive.MessageContent />
 *             <ChatPrimitive.MessageActions>
 *               <ChatPrimitive.CopyButton />
 *               <ChatPrimitive.RegenerateButton />
 *             </ChatPrimitive.MessageActions>
 *           </ChatPrimitive.Message>
 *         ))}
 *       </ChatPrimitive.Messages>
 *
 *       <ChatPrimitive.Input onSubmit={(content) => chat.append({ role: 'user', content })} />
 *     </ChatPrimitive.Root>
 *   )
 * }
 * ```
 */

export {
  ChatRoot,
  ChatMessages,
  ChatMessage,
  ChatMessageContent,
  ChatMessageActions,
  ChatInput,
  ChatCopyButton,
  ChatRegenerateButton,
  ChatDeleteButton,
  ChatEmptyState,
  ChatLoadingIndicator,
} from './chat-primitives'

export type {
  ChatRootProps,
  ChatMessagesProps,
  ChatMessageProps,
  ChatMessageContentProps,
  ChatMessageActionsProps,
  ChatInputProps,
  ChatCopyButtonProps,
  ChatRegenerateButtonProps,
  ChatDeleteButtonProps,
  ChatEmptyStateProps,
  ChatLoadingIndicatorProps,
} from './chat-primitives'

// Compound component pattern for convenient usage
import {
  ChatRoot,
  ChatMessages,
  ChatMessage,
  ChatMessageContent,
  ChatMessageActions,
  ChatInput,
  ChatCopyButton,
  ChatRegenerateButton,
  ChatDeleteButton,
  ChatEmptyState,
  ChatLoadingIndicator,
} from './chat-primitives'

export const ChatPrimitive = {
  Root: ChatRoot,
  Messages: ChatMessages,
  Message: ChatMessage,
  MessageContent: ChatMessageContent,
  MessageActions: ChatMessageActions,
  Input: ChatInput,
  CopyButton: ChatCopyButton,
  RegenerateButton: ChatRegenerateButton,
  DeleteButton: ChatDeleteButton,
  EmptyState: ChatEmptyState,
  LoadingIndicator: ChatLoadingIndicator,
}
