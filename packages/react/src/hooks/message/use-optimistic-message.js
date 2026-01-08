/**
 * Optimistic Message Updates
 *
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 *
 * Now leverages React 19's native `useOptimistic` hook for better
 * integration with React's concurrent features.
 *
 * Accessibility: Automatically announces message status changes to screen readers
 * via ARIA live regions for a better experience for users with assistive technology.
 */
'use client';
import * as React from 'react';
import { announceToScreenReader } from '../../accessibility';
/**
 * Reducer for optimistic message updates
 */
function optimisticReducer(messages, action) {
    switch (action.type) {
        case 'add':
            return [...messages, action.message];
        case 'confirm':
            return messages.map((msg) => msg.id === action.id
                ? { ...action.confirmedMessage, isOptimistic: false }
                : msg);
        case 'error':
            return messages.map((msg) => msg.id === action.id
                ? { ...msg, status: 'error', error: action.error }
                : msg);
        case 'remove':
            return messages.filter((msg) => msg.id !== action.id);
        case 'retry':
            return messages.map((msg) => msg.id === action.id
                ? { ...msg, status: 'sending', error: undefined }
                : msg);
        default:
            return messages;
    }
}
export function useOptimisticMessage(options) {
    const { onSend, onConfirm, onError } = options;
    // Server-confirmed messages
    const [confirmedMessages, setConfirmedMessages] = React.useState([]);
    // React 19's useOptimistic for instant UI feedback
    const [optimisticMessages, addOptimisticMessage] = React.useOptimistic(confirmedMessages, optimisticReducer);
    // Track sending state with ref for cleanup safety
    const [sending, setSending] = React.useState(new Set());
    const isSending = sending.size > 0;
    // Track mounted state to prevent state updates after unmount
    const isMountedRef = React.useRef(true);
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    // React 19 requires useOptimistic updates within a transition
    const [, startTransition] = React.useTransition();
    // Send message optimistically
    const sendOptimistic = React.useCallback(async (content) => {
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
        // Add optimistic message immediately within a transition (React 19 requirement)
        startTransition(() => {
            addOptimisticMessage({ type: 'add', message: optimisticMessage });
        });
        setSending((prev) => new Set(prev).add(optimisticId));
        try {
            // Send to server
            const confirmedMessage = await onSend(content);
            // Only update state if still mounted
            if (isMountedRef.current) {
                // Update confirmed messages (will replace optimistic)
                setConfirmedMessages((prev) => [
                    ...prev.filter((m) => m.id !== optimisticId),
                    { ...confirmedMessage, isOptimistic: false },
                ]);
                // Announce success to screen readers
                announceToScreenReader('Message sent successfully', 'polite');
                onConfirm?.(confirmedMessage);
            }
        }
        catch (error) {
            // Only update state if still mounted
            if (isMountedRef.current) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to send';
                // Mark as error in confirmed state
                setConfirmedMessages((prev) => [
                    ...prev,
                    {
                        ...optimisticMessage,
                        status: 'error',
                        error: errorMessage,
                    },
                ]);
                // Announce error to screen readers with assertive priority
                announceToScreenReader(`Failed to send message: ${errorMessage}`, 'assertive');
                onError?.(error, optimisticMessage);
            }
        }
        finally {
            // Only update state if still mounted
            if (isMountedRef.current) {
                setSending((prev) => {
                    const next = new Set(prev);
                    next.delete(optimisticId);
                    return next;
                });
            }
        }
    }, [onSend, onConfirm, onError, addOptimisticMessage, startTransition]);
    // Retry failed message
    const retry = React.useCallback(async (messageId) => {
        const message = confirmedMessages.find((m) => m.id === messageId);
        if (!message || message.status !== 'error')
            return;
        // Show retry state optimistically within a transition
        startTransition(() => {
            addOptimisticMessage({ type: 'retry', id: messageId });
        });
        setSending((prev) => new Set(prev).add(messageId));
        try {
            const confirmedMessage = await onSend(message.content);
            if (isMountedRef.current) {
                setConfirmedMessages((prev) => prev.map((msg) => msg.id === messageId
                    ? { ...confirmedMessage, isOptimistic: false }
                    : msg));
                // Announce retry success to screen readers
                announceToScreenReader('Message retry successful', 'polite');
                onConfirm?.(confirmedMessage);
            }
        }
        catch (error) {
            if (isMountedRef.current) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to send';
                setConfirmedMessages((prev) => prev.map((msg) => msg.id === messageId
                    ? {
                        ...msg,
                        status: 'error',
                        error: errorMessage,
                    }
                    : msg));
                // Announce retry failure to screen readers
                announceToScreenReader(`Message retry failed: ${errorMessage}`, 'assertive');
                onError?.(error, message);
            }
        }
        finally {
            if (isMountedRef.current) {
                setSending((prev) => {
                    const next = new Set(prev);
                    next.delete(messageId);
                    return next;
                });
            }
        }
    }, [
        confirmedMessages,
        onSend,
        onConfirm,
        onError,
        addOptimisticMessage,
        startTransition,
    ]);
    // Cancel optimistic message
    const cancel = React.useCallback((messageId) => {
        startTransition(() => {
            addOptimisticMessage({ type: 'remove', id: messageId });
        });
        setConfirmedMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        setSending((prev) => {
            const next = new Set(prev);
            next.delete(messageId);
            return next;
        });
    }, [addOptimisticMessage, startTransition]);
    // Set messages from server
    const setMessages = React.useCallback((messages) => {
        setConfirmedMessages(messages.map((m) => ({ ...m, isOptimistic: false })));
    }, []);
    return {
        messages: optimisticMessages,
        sendOptimistic,
        setMessages,
        isSending,
        retry,
        cancel,
    };
}
export function useOptimisticState(options) {
    const { serverState, onUpdate, onConfirm, onError } = options;
    // React 19's useOptimistic - returns [optimisticState, addOptimistic]
    const [optimisticState, setOptimisticState] = React.useOptimistic(serverState, (_current, newState) => newState);
    const [isPending, startTransition] = React.useTransition();
    const update = React.useCallback(async (newState) => {
        // Apply optimistically using React 19's useOptimistic
        startTransition(async () => {
            setOptimisticState(newState);
            try {
                const confirmedState = await onUpdate(newState);
                onConfirm?.(confirmedState);
            }
            catch (error) {
                onError?.(error, newState);
            }
        });
    }, [onUpdate, onConfirm, onError, setOptimisticState]);
    const revert = React.useCallback(() => {
        // React 19's useOptimistic automatically reverts when the transition completes
        // No manual revert needed - the state will sync with serverState
    }, []);
    return {
        state: optimisticState,
        update,
        isPending,
        revert,
    };
}
//# sourceMappingURL=use-optimistic-message.js.map