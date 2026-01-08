/**
 * Chat UI Domain
 *
 * Production-ready components and hooks for chat interfaces.
 */
// =============================================================================
// TOP-LEVEL: Drop-in ready (use these first)
// =============================================================================
export { ClarityChat, } from '../../components/clarity-chat';
export { useClarityChat, } from '../../hooks/chat/use-clarity-chat';
// =============================================================================
// MID-LEVEL: Composable building blocks
// =============================================================================
export { ChatWindow } from '../../components/chat-window';
export { ChatLayout } from '../../components/chat-layout';
export { ChatInput } from '../../components/chat-input';
export { MessageList } from '../../components/message-list';
// =============================================================================
// LOW-LEVEL: Primitives for custom UIs
// =============================================================================
export { Message } from '../../components/message';
export { StreamingMessage } from '../../components/streaming-message';
// Composable primitives (Radix-style)
export { ChatPrimitive, ChatRoot, ChatMessages, ChatMessage, ChatMessageContent, ChatMessageActions, ChatInput as ChatInputPrimitive, ChatCopyButton, ChatRegenerateButton, ChatDeleteButton, ChatEmptyState, ChatLoadingIndicator, } from '../../primitives/chat';
//# sourceMappingURL=index.js.map