/**
 * useChatHandlers - Mid-Level Handler Hook
 *
 * Provides pre-configured handlers for common chat operations, eliminating
 * boilerplate when using useClarityChat with ChatWindow.
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat State
 *
 * This hook wraps common patterns like sending messages, clearing chat,
 * retrying messages, and editing messages with proper error handling.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom handlers, use low-level `useClarityChat` directly.
 *
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 *
 * <ChatWindow
 *   messages={chat.messages}
 *   onSendMessage={handlers.onSendMessage}
 *   onClear={handlers.onClear}
 *   onMessageRetry={handlers.onRetry}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const handlers = useChatHandlers({
 *   chat,
 *   onMessageSent: (content) => logger.debug('Sent:', content),
 *   onMessageError: (error) => logger.logger.error('Error:', error),
 * })
 * ```
 */
'use client';
import * as React from 'react';
/**
 * Creates pre-configured handlers for ChatWindow
 *
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 *
 * return (
 *   <ChatWindow
 *     messages={chat.messages}
 *     isLoading={chat.isLoading}
 *     onSendMessage={handlers.onSendMessage}
 *     onClear={handlers.onClear}
 *   />
 * )
 * ```
 */
export function useChatHandlers({ chat, onMessageSent, onMessageError, }) {
    const handleSendMessage = React.useCallback(async (content) => {
        try {
            await chat.append({ role: 'user', content });
            await onMessageSent?.(content);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            onMessageError?.(err);
            throw err;
        }
    }, [chat, onMessageSent, onMessageError]);
    const handleClear = React.useCallback(() => {
        chat.setMessages([]);
    }, [chat]);
    const handleRetry = React.useCallback(async (messageId) => {
        try {
            // Find the message and resend
            const message = chat.messages.find((m) => m.id === messageId);
            if (message && message.role === 'user') {
                await chat.append({ role: 'user', content: String(message.content) });
            }
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            onMessageError?.(err);
            throw err;
        }
    }, [chat, onMessageError]);
    const handleEdit = React.useCallback(async (messageId, newContent) => {
        try {
            // Remove messages after the edited one
            const messageIndex = chat.messages.findIndex((m) => m.id === messageId);
            if (messageIndex >= 0) {
                const newMessages = chat.messages.slice(0, messageIndex);
                chat.setMessages(newMessages);
                // Send the edited message
                await chat.append({ role: 'user', content: newContent });
            }
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            onMessageError?.(err);
            throw err;
        }
    }, [chat, onMessageError]);
    return {
        onSendMessage: handleSendMessage,
        onClear: handleClear,
        onRetry: handleRetry,
        onEdit: handleEdit,
    };
}
//# sourceMappingURL=use-chat-handlers.js.map