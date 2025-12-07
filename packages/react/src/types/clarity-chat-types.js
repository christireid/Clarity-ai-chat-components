/**
 * TypeScript Utility Types for Clarity Chat
 *
 * Helper types for working with useClarityChat and related components
 */
/**
 * Type guard: Check if memory is enabled
 */
export function isMemoryEnabled(options) {
    return options.memory?.enabled === true;
}
/**
 * Type guard: Check if message is user message
 */
export function isUserMessage(message) {
    return message.role === 'user';
}
/**
 * Type guard: Check if message is assistant message
 */
export function isAssistantMessage(message) {
    return message.role === 'assistant';
}
/**
 * Type guard: Check if message has text content
 */
export function hasTextContent(message) {
    return typeof message.content === 'string' ||
        (Array.isArray(message.content) &&
            message.content.some(part => part.type === 'text'));
}
/**
 * Extract text content from message
 */
export function extractTextContent(message) {
    if (typeof message.content === 'string') {
        return message.content;
    }
    if (Array.isArray(message.content)) {
        return message.content
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join(' ');
    }
    return '';
}
/**
 * Create a user message
 */
export function createUserMessage(content, id) {
    return {
        id: id || `user-${Date.now()}`,
        role: 'user',
        content,
    };
}
/**
 * Create an assistant message
 */
export function createAssistantMessage(content, id) {
    return {
        id: id || `assistant-${Date.now()}`,
        role: 'assistant',
        content,
    };
}
/**
 * Create a system message
 */
export function createSystemMessage(content, id) {
    return {
        id: id || `system-${Date.now()}`,
        role: 'system',
        content,
    };
}
//# sourceMappingURL=clarity-chat-types.js.map