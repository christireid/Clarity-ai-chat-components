/**
 * Optimistic Message Updates
 *
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 */
'use client';
import * as React from 'react';
export function useOptimisticMessage(options) {
    const { onSend, onConfirm, onError, defaultUser } = options;
    const [messages, setMessages] = React.useState([]);
    const [sending, setSending] = React.useState(new Set());
    const isSending = sending.size > 0;
    // Send message optimistically
    const sendOptimistic = React.useCallback(async (content) => {
        // Create optimistic message
        const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
        const optimisticMessage = {
            id: optimisticId,
            chatId: 'optimistic-chat',
            role: 'user',
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'sending',
            isOptimistic: true,
        };
        // Add optimistic message immediately
        setMessages((prev) => [...prev, optimisticMessage]);
        setSending((prev) => new Set(prev).add(optimisticId));
        try {
            // Send to server
            const confirmedMessage = await onSend(content);
            // Replace optimistic message with confirmed one
            setMessages((prev) => prev.map((msg) => msg.id === optimisticId
                ? { ...confirmedMessage, isOptimistic: false }
                : msg));
            onConfirm?.(confirmedMessage);
        }
        catch (error) {
            // Mark as error
            setMessages((prev) => prev.map((msg) => msg.id === optimisticId
                ? {
                    ...msg,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Failed to send',
                }
                : msg));
            onError?.(error, optimisticMessage);
        }
        finally {
            setSending((prev) => {
                const next = new Set(prev);
                next.delete(optimisticId);
                return next;
            });
        }
    }, [onSend, onConfirm, onError, defaultUser]);
    // Use ref to avoid stale closure with messages array
    const messagesRef = React.useRef(messages);
    React.useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    // Retry failed message
    const retry = React.useCallback(async (messageId) => {
        const message = messagesRef.current.find((m) => m.id === messageId);
        if (!message || message.status !== 'error')
            return;
        // Reset status to sending
        setMessages((prev) => prev.map((msg) => msg.id === messageId
            ? { ...msg, status: 'sending', error: undefined }
            : msg));
        setSending((prev) => new Set(prev).add(messageId));
        try {
            const confirmedMessage = await onSend(message.content);
            setMessages((prev) => prev.map((msg) => msg.id === messageId
                ? { ...confirmedMessage, isOptimistic: false }
                : msg));
            onConfirm?.(confirmedMessage);
        }
        catch (error) {
            setMessages((prev) => prev.map((msg) => msg.id === messageId
                ? {
                    ...msg,
                    status: 'error',
                    error: error instanceof Error ? error.message : 'Failed to send',
                }
                : msg));
            onError?.(error, message);
        }
        finally {
            setSending((prev) => {
                const next = new Set(prev);
                next.delete(messageId);
                return next;
            });
        }
    }, [onSend, onConfirm, onError] // Removed messages, using ref instead
    );
    // Cancel optimistic message
    const cancel = React.useCallback((messageId) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setSending((prev) => {
            const next = new Set(prev);
            next.delete(messageId);
            return next;
        });
    }, []);
    return {
        messages,
        sendOptimistic,
        setMessages,
        isSending,
        retry,
        cancel,
    };
}
export function useOptimisticState(options) {
    const { serverState, onUpdate, onConfirm, onError } = options;
    const [optimisticState, setOptimisticState] = React.useState(null);
    const [isPending, setIsPending] = React.useState(false);
    const state = optimisticState ?? serverState;
    const update = React.useCallback(async (newState) => {
        // Apply optimistically
        setOptimisticState(newState);
        setIsPending(true);
        try {
            // Send to server
            const confirmedState = await onUpdate(newState);
            // Clear optimistic state (use server state)
            setOptimisticState(null);
            onConfirm?.(confirmedState);
        }
        catch (error) {
            // Revert to server state
            setOptimisticState(null);
            onError?.(error, newState);
        }
        finally {
            setIsPending(false);
        }
    }, [onUpdate, onConfirm, onError]);
    const revert = React.useCallback(() => {
        setOptimisticState(null);
        setIsPending(false);
    }, []);
    // Update when server state changes
    React.useEffect(() => {
        if (!isPending) {
            setOptimisticState(null);
        }
    }, [serverState, isPending]);
    return {
        state,
        update,
        isPending,
        revert,
    };
}
//# sourceMappingURL=use-optimistic-message.js.map