/**
 * useChat - Legacy chat hook (DEPRECATED)
 *
 * ⚠️ **DEPRECATED**: This hook is deprecated in favor of `useClarityChat`.
 *
 * **Migration Guide:**
 *
 * ```tsx
 * // Old (deprecated)
 * import { useChat } from '@clarity-chat/react'
 * const { messages, sendMessage, isLoading } = useChat({ ... })
 *
 * // New (recommended)
 * import { useClarityChat } from '@clarity-chat/react'
 * const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
 * ```
 *
 * **Why deprecated:**
 * - `useClarityChat` provides better TypeScript support
 * - `useClarityChat` includes memory integration, error handling, and more features
 * - `useClarityChat` follows the new API shape conventions
 *
 * This hook will be removed in v3.0. Please migrate to `useClarityChat`.
 *
 * @deprecated Use `useClarityChat` instead. This will be removed in v3.0.
 */
'use client';
import * as React from 'react';
import { generateId } from '@clarity-chat/primitives';
/**
 * @deprecated Use `useClarityChat` instead. This will be removed in v3.0.
 */
export function useChat(options = {}) {
    // Log deprecation warning in development
    if (process.env['NODE_ENV'] === 'development') {
        console.warn('[useChat] This hook is deprecated. Please migrate to `useClarityChat` from @clarity-chat/react. ' +
            'See migration guide: https://github.com/clarity-chat/clarity-chat/blob/main/MIGRATION_GUIDE.md');
    }
    const { initialMessages = [], onSendMessage } = options;
    const [messages, setMessages] = React.useState(initialMessages);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const sendMessage = React.useCallback(async (content, options) => {
        if (!onSendMessage) {
            console.warn('[useChat] onSendMessage is required to send messages');
            return;
        }
        setIsLoading(true);
        setError(null);
        const userMessage = {
            id: generateId(),
            chatId: 'default',
            role: 'user',
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sent',
        };
        setMessages((prev) => [...prev, userMessage]);
        try {
            await onSendMessage(userMessage, options);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to send message');
            setError(error);
            setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, [onSendMessage]);
    const retry = React.useCallback(async (messageId, options) => {
        const message = messages.find((m) => m.id === messageId);
        if (!message || message.role !== 'user') {
            console.warn('[useChat] Cannot retry: message not found or not a user message');
            return;
        }
        // Remove the failed message and its response
        setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === messageId);
            if (index === -1)
                return prev;
            return prev.slice(0, index);
        });
        await sendMessage(message.content, options);
    }, [messages, sendMessage]);
    const clear = React.useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);
    return {
        messages,
        isLoading,
        error,
        sendMessage,
        retry,
        clear,
    };
}
//# sourceMappingURL=use-chat.js.map