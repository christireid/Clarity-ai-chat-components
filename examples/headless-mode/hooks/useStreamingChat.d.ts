export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    tokens?: number;
}
export interface StreamingChatOptions {
    /** API endpoint for chat */
    api?: string;
    /** Called when streaming starts */
    onStart?: () => void;
    /** Called for each chunk of content */
    onChunk?: (content: string) => void;
    /** Called when streaming completes */
    onFinish?: (content: string) => void;
    /** Called on error */
    onError?: (error: Error) => void;
}
/**
 * Custom hook for handling streaming chat with SSE.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, error } = useStreamingChat({
 *   api: '/api/chat',
 *   onFinish: (content) => console.log('Complete:', content),
 * })
 *
 * // Send a message
 * await sendMessage('Hello!')
 * ```
 */
export declare function useStreamingChat(options?: StreamingChatOptions): {
    messages: any;
    sendMessage: any;
    isLoading: any;
    error: any;
    cancel: any;
    clearMessages: any;
};
//# sourceMappingURL=useStreamingChat.d.ts.map