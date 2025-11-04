import type { Message } from '@clarity-chat/types';
export declare function useChat(): {
    sendMessage: import("@tanstack/react-query").UseMutateFunction<{
        userMessage: Message;
        aiMessage: any;
        conversationId: any;
    }, Error, string, unknown>;
    isLoading: boolean;
    error: Error | null;
};
//# sourceMappingURL=useChat.d.ts.map