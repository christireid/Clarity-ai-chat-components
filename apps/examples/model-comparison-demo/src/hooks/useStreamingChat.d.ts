export type ChatMessage = any;
export interface ModelConfig {
    id: string;
    name: string;
    [key: string]: any;
}
export type ModelMetadata = ModelConfig;
interface UseStreamingChatOptions {
    onToken?: (token: string) => void;
    onComplete?: (data: {
        usage: any;
        cost: number;
        duration: number;
    }) => void;
    onError?: (error: string) => void;
}
export declare function useStreamingChat(options?: UseStreamingChatOptions): {
    stream: (messages: ChatMessage[], config: ModelConfig) => Promise<void>;
    cancel: () => void;
    isStreaming: boolean;
    error: string | null;
};
export {};
//# sourceMappingURL=useStreamingChat.d.ts.map