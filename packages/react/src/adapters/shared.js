/**
 * Shared Adapter Utilities
 *
 * Common utilities used across all AI model adapters.
 * Centralizes duplicate code and enforces security best practices.
 *
 * @module adapters/shared
 */
import { APIKeyMissingError } from '@clarity-chat/utils/errors';
// Re-export for backwards compatibility and convenience
export { APIKeyMissingError };
/**
 * Validates that an API key is provided.
 * SECURITY: Removed process.env fallbacks to prevent key exposure in frontend bundles.
 *
 * @param apiKey - The API key to validate
 * @param provider - The provider name for error messages
 * @returns The validated API key
 * @throws {APIKeyMissingError} If API key is not provided (provides helpful solutions)
 */
export function validateApiKey(apiKey, provider) {
    if (!apiKey || apiKey.trim() === '') {
        throw new APIKeyMissingError(provider);
    }
    return apiKey;
}
/**
 * Extract system message from chat messages
 */
export function extractSystemMessage(messages) {
    return messages.find((m) => m.role === 'system');
}
/**
 * Filter out system messages from chat messages
 */
export function filterConversationMessages(messages) {
    return messages.filter((m) => m.role !== 'system');
}
/**
 * Convert OpenAI tool calls to our unified format
 */
export function convertOpenAIToolCalls(toolCalls) {
    if (!toolCalls)
        return undefined;
    return toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
        },
    }));
}
/**
 * Create an error with rate limit info attached
 */
export function createRateLimitError(message, rateLimitInfo) {
    const err = new Error(message);
    if (rateLimitInfo) {
        err.rateLimitInfo = rateLimitInfo;
    }
    return err;
}
/**
 * Parse SSE data line to JSON
 * @returns Parsed JSON or null if line should be skipped
 */
export function parseSSELine(line) {
    const trimmed = line.trim();
    // Skip empty lines and DONE marker
    if (!trimmed || trimmed === 'data: [DONE]' || trimmed === '[DONE]') {
        return null;
    }
    // Handle SSE data prefix
    if (!trimmed.startsWith('data: ')) {
        return null;
    }
    try {
        return JSON.parse(trimmed.slice(6));
    }
    catch {
        return null;
    }
}
/**
 * Default timeouts for different operation types
 */
export const DEFAULT_TIMEOUTS = {
    chat: 30000, // 30 seconds for non-streaming
    stream: 60000, // 60 seconds for streaming
};
//# sourceMappingURL=shared.js.map