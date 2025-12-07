/**
 * Streaming Utilities
 *
 * Handles streaming responses from LLMs using Server-Sent Events (SSE).
 * Supports OpenAI, Anthropic, and Google Gemini streaming APIs.
 */
export interface StreamChunk {
    type: 'text' | 'error' | 'done' | 'sources' | 'thinking';
    content?: string;
    data?: unknown;
}
/**
 * Create a ReadableStream for Server-Sent Events
 */
export declare function createSSEStream(generator: AsyncGenerator<StreamChunk>): ReadableStream<Uint8Array>;
/**
 * Stream from OpenAI API
 */
export declare function streamFromOpenAI(messages: {
    role: string;
    content: string;
}[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}): AsyncGenerator<StreamChunk>;
/**
 * Stream from Anthropic Claude API
 */
export declare function streamFromClaude(messages: {
    role: string;
    content: string;
}[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}): AsyncGenerator<StreamChunk>;
/**
 * Stream from Google Gemini API
 */
export declare function streamFromGemini(messages: {
    role: string;
    content: string;
}[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}): AsyncGenerator<StreamChunk>;
/**
 * Demo/fallback streaming function when no API keys are configured
 */
export declare function streamFromDemo(messages: {
    role: string;
    content: string;
}[]): AsyncGenerator<StreamChunk>;
/**
 * Get the appropriate streaming function based on configured model
 */
export declare function getStreamingFunction(): typeof streamFromOpenAI | typeof streamFromClaude | typeof streamFromGemini | typeof streamFromDemo;
export declare function checkRateLimit(identifier: string, maxRequests?: number, windowMs?: number): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
};
/**
 * Token counter for rate limiting
 */
export declare function estimateMessageTokens(messages: {
    role: string;
    content: string;
}[]): number;
/**
 * Validate request size
 */
export declare function validateRequest(messages: {
    role: string;
    content: string;
}[], maxTokens?: number): {
    valid: boolean;
    error?: string;
};
/**
 * Error handler for streaming errors
 */
export declare function handleStreamError(error: unknown): StreamChunk;
/**
 * Retry logic for failed requests
 */
export declare function withRetry<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
/**
 * Format response with metadata
 */
export interface FormattedResponse {
    content: string;
    metadata: {
        model: string;
        tokensUsed?: number;
        sources?: Array<{
            title: string;
            url: string;
        }>;
        timestamp: string;
    };
}
export declare function formatResponse(content: string, sources?: Array<{
    title: string;
    url: string;
}>): FormattedResponse;
//# sourceMappingURL=streaming.d.ts.map