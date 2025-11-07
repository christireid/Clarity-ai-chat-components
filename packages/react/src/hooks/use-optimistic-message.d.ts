/**
 * Optimistic Message Updates
 *
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 */
import type { Message } from '@clarity-chat/types';
export interface OptimisticMessage extends Message {
    /** Whether this is an optimistic (not yet confirmed) message */
    isOptimistic?: boolean;
    /** Error that occurred during sending */
    error?: string;
}
export interface UseOptimisticMessageOptions {
    /** Callback to send message to server */
    onSend: (content: string) => Promise<Message>;
    /** Callback when message is confirmed */
    onConfirm?: (message: Message) => void;
    /** Callback when message fails */
    onError?: (error: Error, optimisticMessage: OptimisticMessage) => void;
    /** Default user for optimistic messages */
    defaultUser?: {
        id: string;
        name?: string;
        avatar?: string;
    };
}
export interface UseOptimisticMessageReturn {
    /** All messages including optimistic ones */
    messages: OptimisticMessage[];
    /** Send a message optimistically */
    sendOptimistic: (content: string) => Promise<void>;
    /** Set messages from server */
    setMessages: (messages: Message[]) => void;
    /** Whether any message is currently being sent */
    isSending: boolean;
    /** Retry a failed optimistic message */
    retry: (messageId: string) => Promise<void>;
    /** Cancel an optimistic message */
    cancel: (messageId: string) => void;
}
export declare function useOptimisticMessage(options: UseOptimisticMessageOptions): UseOptimisticMessageReturn;
/**
 * Simple optimistic state hook (generic)
 */
export interface UseOptimisticStateOptions<T> {
    /** Current server state */
    serverState: T;
    /** Function to apply optimistic update to server */
    onUpdate: (newState: T) => Promise<T>;
    /** Callback when update is confirmed */
    onConfirm?: (state: T) => void;
    /** Callback when update fails */
    onError?: (error: Error, optimisticState: T) => void;
}
export interface UseOptimisticStateReturn<T> {
    /** Current state (server or optimistic) */
    state: T;
    /** Apply optimistic update */
    update: (newState: T) => Promise<void>;
    /** Whether update is pending */
    isPending: boolean;
    /** Revert to server state */
    revert: () => void;
}
export declare function useOptimisticState<T>(options: UseOptimisticStateOptions<T>): UseOptimisticStateReturn<T>;
//# sourceMappingURL=use-optimistic-message.d.ts.map