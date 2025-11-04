import * as React from 'react';
import { generateId } from '@clarity-chat/primitives';
/**
 * Chat state management hook with message handling and async operations.
 *
 * **Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Loading states
 *
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 *
 * @param {UseChatOptions} [options] - Configuration options
 * @param {Message[]} [options.initialMessages] - Initial messages array
 * @param {Function} [options.onSendMessage] - Async callback when message is sent
 * @returns {UseChatReturn} Chat state and control functions
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading } = useChat({
 *   onSendMessage: async (message, { signal }) => {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       body: JSON.stringify(message),
 *       signal // Cancellable request
 *     })
 *     return response.json()
 *   }
 * })
 * ```
 */
export function useChat(options = {}) {
    const { initialMessages = [], onSendMessage } = options;
    const [messages, setMessages] = React.useState(initialMessages);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const abortControllerRef = React.useRef(null);
    const sendMessage = React.useCallback(async (content, options) => {
        // Cancel any pending request
        abortControllerRef.current?.abort();
        // Create new AbortController if not provided
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const signal = options?.signal || controller.signal;
        const userMessage = {
            id: generateId(),
            chatId: 'default',
            role: 'user',
            content,
            status: 'sent',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        try {
            await onSendMessage?.(userMessage, { signal });
        }
        catch (err) {
            // Don't set error if request was aborted
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            setError(err);
            setMessages((prev) => prev.map((msg) => msg.id === userMessage.id ? { ...msg, status: 'error' } : msg));
        }
        finally {
            setIsLoading(false);
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    }, [onSendMessage]);
    const retry = React.useCallback(async (messageId, options) => {
        const message = messages.find((msg) => msg.id === messageId);
        if (!message)
            return;
        await sendMessage(message.content, options);
    }, [messages, sendMessage]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);
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