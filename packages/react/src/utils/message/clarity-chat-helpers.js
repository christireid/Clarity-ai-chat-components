/**
 * Clarity Chat Helper Utilities
 *
 * Common utilities and helpers for working with Clarity Chat.
 * These make common patterns easier and reduce boilerplate.
 *
 * Note: For message creation helpers, use the ones from './chat-helpers'
 * which provide more options (like custom IDs).
 */
/**
 * Create a basic chat configuration with sensible defaults
 */
export function createBasicChatConfig(api) {
    return {
        api,
        // Sensible defaults
        streamProtocol: 'sse',
    };
}
/**
 * Create a chat configuration with memory enabled
 */
export function createMemoryChatConfig(api, strategy = 'sliding-window', maxTokens = 4000) {
    return {
        api,
        memory: {
            enabled: true,
            strategy,
            maxTokens,
        },
    };
}
/**
 * Create a chat configuration optimized for streaming
 */
export function createStreamingChatConfig(api, useWebSocket = false) {
    return {
        api,
        transport: useWebSocket ? 'websocket' : 'sse',
    };
}
/**
 * Create an enterprise chat configuration with all features
 */
export function createEnterpriseChatConfig(api) {
    return {
        api,
        memory: {
            enabled: true,
            strategy: 'vector-store',
            maxTokens: 10000,
        },
        promptOptimization: {
            enabled: true,
            strategy: 'hybrid',
        },
        transport: 'sse',
    };
}
/**
 * Check if API endpoint is valid
 */
export function isValidApiEndpoint(api) {
    if (!api)
        return false;
    if (typeof api !== 'string')
        return false;
    if (api.trim().length === 0)
        return false;
    return true;
}
/**
 * Get default API endpoint from environment or throw helpful error
 */
export function getApiEndpoint(api, envVar = 'CLARITY_CHAT_API') {
    if (api && isValidApiEndpoint(api)) {
        return api;
    }
    const envApi = typeof process !== 'undefined' && process.env?.[envVar];
    if (envApi && isValidApiEndpoint(envApi)) {
        return envApi;
    }
    throw new Error(`Clarity Chat: API endpoint is required. ` +
        `Provide it via the "api" prop or set the ${envVar} environment variable. ` +
        `Example: <ClarityChat api="/api/chat" />`);
}
//# sourceMappingURL=clarity-chat-helpers.js.map