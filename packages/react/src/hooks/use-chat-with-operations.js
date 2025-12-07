/**
 * useChatWithOperations - Composed hook combining chat + message operations
 *
 * This hook combines useClarityChat with useMessageOperations to provide
 * a complete chat experience with edit/regenerate/delete functionality.
 *
 * @example
 * ```tsx
 * const {
 *   messages,
 *   append,
 *   isLoading,
 *   editMessage,
 *   regenerateMessage,
 *   deleteMessage,
 *   undo,
 *   redo,
 * } = useChatWithOperations({
 *   api: '/api/chat',
 * })
 * ```
 */
'use client';
import * as React from 'react';
import { useClarityChat } from './use-clarity-chat';
import { useMessageOperations } from './use-message-operations';
import { convertCoreMessagesToMessages } from '../utils/message-conversion';
/**
 * useChatWithOperations - Composed hook for chat with message operations
 *
 * Combines useClarityChat and useMessageOperations into a single hook
 * that provides both chat functionality and message editing capabilities.
 */
export function useChatWithOperations(options = {}) {
    const { enableOperations = true, ...chatOptions } = options;
    // Use the flagship chat hook
    const chat = useClarityChat(chatOptions);
    // Convert CoreMessages to Messages
    const messages = React.useMemo(() => {
        return convertCoreMessagesToMessages(chat.messages);
    }, [chat.messages]);
    // Use message operations hook
    const operations = useMessageOperations({
        initialMessages: messages,
        enabled: enableOperations,
    });
    // Sync operations with chat messages
    React.useEffect(() => {
        if (enableOperations && messages.length > 0) {
            // Update operations when chat messages change
            // This is a simplified sync - in production you might want more sophisticated syncing
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !operations.messages.find(m => m.id === lastMessage.id)) {
                operations.addMessage({
                    chatId: lastMessage.chatId,
                    role: lastMessage.role,
                    content: lastMessage.content,
                });
            }
        }
    }, [messages, enableOperations, operations]);
    // Clear all messages
    const clearMessages = React.useCallback(() => {
        if (enableOperations) {
            operations.messages.forEach(msg => {
                operations.deleteMessage(msg.id);
            });
        }
    }, [enableOperations, operations]);
    return {
        // From chat
        messages: enableOperations ? operations.messages.map(msg => ({
            id: msg.id,
            chatId: msg.chatId,
            role: msg.role,
            content: msg.content,
            status: 'sent',
            createdAt: new Date(msg.timestamp),
            updatedAt: new Date(msg.timestamp),
        })) : messages,
        append: async (message) => {
            await chat.append({
                role: message.role,
                content: message.content,
            });
        },
        isLoading: chat.isLoading,
        error: chat.error,
        // From operations
        editMessage: enableOperations ? operations.editMessage : () => { },
        regenerateMessage: enableOperations ? operations.regenerateMessage : () => { },
        deleteMessage: enableOperations ? operations.deleteMessage : () => { },
        undo: enableOperations ? operations.undo : () => { },
        redo: enableOperations ? operations.redo : () => { },
        canUndo: enableOperations ? operations.canUndo : false,
        canRedo: enableOperations ? operations.canRedo : false,
        // Additional
        clearMessages,
    };
}
//# sourceMappingURL=use-chat-with-operations.js.map