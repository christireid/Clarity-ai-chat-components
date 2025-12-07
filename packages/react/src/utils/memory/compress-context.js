/**
 * compressContext - Low-level utility for compressing context
 *
 * Primitive function for compressing context to fit within token limits.
 * Used internally by memory system and available for custom implementations.
 */
import { estimateTokens as estimateTokensFromText } from '../tokenization/estimator';
/**
 * compressContext - Compress context to fit token limit
 *
 * Low-level utility for compressing message context. Used by memory system
 * and available for custom context management strategies.
 */
export function compressContext(messages, options) {
    const { targetTokens, strategy = 'truncate', keepRecent = 2, } = options;
    // Always keep recent messages
    const recentMessages = messages.slice(-keepRecent);
    const olderMessages = messages.slice(0, -keepRecent);
    if (strategy === 'truncate') {
        // Simple truncation: remove oldest messages until under limit
        let compressed = [...olderMessages, ...recentMessages];
        let tokenCount = estimateTokens(compressed);
        while (tokenCount > targetTokens && compressed.length > keepRecent) {
            compressed = compressed.slice(1);
            tokenCount = estimateTokens(compressed);
        }
        return compressed;
    }
    // Other strategies would go here
    return messages;
}
/**
 * Estimate token count for messages using centralized estimator
 */
function estimateTokens(messages) {
    const text = messages.map((m) => m.content).join(' ');
    return estimateTokensFromText(text);
}
//# sourceMappingURL=compress-context.js.map