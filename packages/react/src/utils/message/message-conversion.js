/**
 * Message Conversion Utilities
 *
 * Unified utilities for converting between CoreMessage (Vercel AI SDK format)
 * and Message (Clarity internal format) types.
 *
 * This is the canonical implementation. All message conversion should use these functions.
 */
// Simple ID generator (inline to avoid circular deps)
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * Extract text content from CoreMessageContent
 * @internal
 */
function extractTextContent(content) {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('\n');
    }
    return '';
}
/**
 * Convert CoreMessage to Message format
 *
 * @param coreMessage - CoreMessage from useChatEnhanced
 * @param chatId - Chat ID for the message
 * @returns Message compatible with ChatWindow
 */
export function convertCoreMessageToMessage(coreMessage, chatId = 'default') {
    const content = extractTextContent(coreMessage.content);
    const now = new Date();
    // Map role types
    const role = coreMessage.role === 'function' || coreMessage.role === 'tool'
        ? 'assistant'
        : coreMessage.role;
    return {
        id: coreMessage.id || generateId(),
        chatId,
        role,
        content,
        status: 'sent',
        createdAt: now,
        updatedAt: now,
        metadata: {
            toolInvocations: coreMessage.toolInvocations,
            toolCallId: coreMessage.toolCallId,
            name: coreMessage.name,
        },
    };
}
/**
 * Convert Message to CoreMessage format
 *
 * @param message - Message from Clarity types
 * @returns CoreMessage compatible with useChatEnhanced
 */
export function convertMessageToCoreMessage(message) {
    return {
        id: message.id,
        role: message.role,
        content: message.content,
    };
}
/**
 * Convert array of CoreMessages to Messages
 *
 * @param coreMessages - Array of CoreMessages
 * @param chatId - Chat ID for all messages
 * @returns Array of Messages
 */
export function convertCoreMessagesToMessages(coreMessages, chatId = 'default') {
    return coreMessages.map((msg) => convertCoreMessageToMessage(msg, chatId));
}
/**
 * Convert array of Messages to CoreMessages
 *
 * @param messages - Array of Messages
 * @returns Array of CoreMessages
 */
export function convertMessagesToCoreMessages(messages) {
    return messages.map(convertMessageToCoreMessage);
}
//# sourceMappingURL=message-conversion.js.map