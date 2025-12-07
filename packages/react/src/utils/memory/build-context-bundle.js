/**
 * buildContextBundle - Low-level utility for building context bundles
 *
 * Primitive function for constructing context bundles from messages and memories.
 * Used internally by memory system and available for custom implementations.
 */
import { estimateTokens } from '../tokenization/estimator';
/**
 * buildContextBundle - Build context bundle from messages and memories
 *
 * Low-level utility for constructing context bundles. Used by memory system
 * and available for custom context management strategies.
 */
export function buildContextBundle(messages, memories = [], options = {}) {
    const { maxTokens = 8000, includeSystem = true, memoryThreshold = 0.7, } = options;
    // Filter messages
    const filteredMessages = messages.filter((msg) => {
        if (!includeSystem && msg.role === 'system')
            return false;
        return true;
    });
    // Filter memories by threshold
    const relevantMemories = memories.filter((mem) => (mem.metadata?.['relevance'] || 0) >= memoryThreshold);
    // Build combined text
    const messageTexts = filteredMessages.map((msg) => `${msg.role}: ${msg.content}`);
    const memoryTexts = relevantMemories.map((mem) => `Memory: ${mem.content}`);
    const text = [...memoryTexts, ...messageTexts].join('\n\n');
    // Estimate token count using centralized estimator
    const tokenCount = estimateTokens(text);
    return {
        messages: filteredMessages,
        memories: relevantMemories,
        text,
        tokenCount,
    };
}
//# sourceMappingURL=build-context-bundle.js.map