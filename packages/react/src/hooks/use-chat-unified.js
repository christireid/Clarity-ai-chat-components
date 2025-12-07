/**
 * useChat - Unified chat hook with sensible defaults
 *
 * This is a simplified wrapper around useClarityChat that provides:
 * - Automatic message conversion
 * - Better defaults
 * - Common patterns built-in
 *
 * For maximum simplicity, use the ClarityChat component instead.
 * For maximum control, use useClarityChat directly.
 *
 * @example
 * ```tsx
 * // Simple usage
 * const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
 *
 * // With options
 * const chat = useChat({
 *   api: '/api/chat',
 *   autoScroll: true,
 *   persistMessages: true,
 * })
 * ```
 */
'use client';
import * as React from 'react';
import { useClarityChat } from './use-clarity-chat';
import { convertCoreMessagesToMessages } from '../utils/message-conversion';
import { validateApiEndpoint, validateStorageKey } from '../utils/runtime-validation';
/**
 * useChat - Simplified chat hook with sensible defaults
 *
 * This hook provides a simpler API than useClarityChat while maintaining
 * access to all advanced features through the `chat` property.
 *
 * @param options - Configuration options
 * @returns Simplified chat interface + full chat object
 */
export function useChat(options = {}) {
    // Runtime validation with developer-friendly errors
    validateApiEndpoint(options.api, 'useChat');
    // Validate storageKey if persistence is enabled
    if (options.persistMessages) {
        validateStorageKey(options.storageKey, 'useChat');
    }
    const { persistMessages = false, storageKey = 'clarity-chat', autoScroll = true, chatId = 'default', ...chatOptions } = options;
    // Use the underlying hook
    const chat = useClarityChat(chatOptions);
    // Convert messages automatically
    const messages = React.useMemo(() => convertCoreMessagesToMessages(chat.messages, chatId), [chat.messages, chatId]);
    // Simplified send message function
    const sendMessage = React.useCallback(async (content) => {
        await chat.append({
            role: 'user',
            content,
        });
    }, [chat]);
    // Clear messages helper
    const clearMessages = React.useCallback(() => {
        chat.setMessages([]);
        if (persistMessages) {
            try {
                localStorage.removeItem(`${storageKey}-messages`);
            }
            catch {
                // Ignore
            }
        }
    }, [chat, persistMessages, storageKey]);
    // Persist messages if enabled
    React.useEffect(() => {
        if (persistMessages && messages.length > 0) {
            try {
                localStorage.setItem(`${storageKey}-messages`, JSON.stringify(chat.messages) // Store CoreMessage[] format
                );
            }
            catch (error) {
                console.warn('[useChat] Failed to persist messages:', error);
            }
        }
    }, [messages.length, persistMessages, storageKey, chat.messages]);
    // Load persisted messages on mount
    React.useEffect(() => {
        if (persistMessages && chat.messages.length === 0) {
            try {
                const stored = localStorage.getItem(`${storageKey}-messages`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    chat.setMessages(parsed);
                }
            }
            catch (error) {
                console.warn('[useChat] Failed to load persisted messages:', error);
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Auto-scroll effect
    React.useEffect(() => {
        if (autoScroll && messages.length > 0) {
            const timer = setTimeout(() => {
                const container = document.querySelector('[data-chat-container]');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages.length, autoScroll]);
    return {
        messages,
        sendMessage,
        isLoading: chat.isLoading,
        error: chat.error,
        input: chat.input,
        setInput: chat.setInput,
        clearMessages,
        chat, // Full access to underlying hook
    };
}
//# sourceMappingURL=use-chat-unified.js.map