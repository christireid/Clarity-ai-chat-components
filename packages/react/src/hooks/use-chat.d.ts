import type { Message } from '@clarity-chat/types';
export interface UseChatOptions {
    initialMessages?: Message[];
    onSendMessage?: (message: Message, options?: {
        signal?: AbortSignal;
    }) => Promise<void>;
}
export interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
    sendMessage: (content: string, options?: {
        signal?: AbortSignal;
    }) => Promise<void>;
    retry: (messageId: string, options?: {
        signal?: AbortSignal;
    }) => Promise<void>;
    clear: () => void;
}
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
export declare function useChat(options?: UseChatOptions): UseChatReturn;
//# sourceMappingURL=use-chat.d.ts.map