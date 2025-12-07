import type { Message } from '@clarity-chat/types';
export interface ChatResponse {
    message: Message;
}
export declare function sendChatMessage(messages: Message[], signal?: AbortSignal): Promise<ChatResponse>;
export interface StreamChunk {
    content: string;
    done: boolean;
}
export declare function streamChatMessage(messages: Message[], signal?: AbortSignal): AsyncGenerator<StreamChunk>;
//# sourceMappingURL=chat.d.ts.map