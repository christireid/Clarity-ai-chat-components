/**
 * Message Conversion Utilities
 *
 * Unified utilities for converting between CoreMessage (Vercel AI SDK format)
 * and Message (Clarity internal format) types.
 *
 * This is the canonical implementation. All message conversion should use these functions.
 */
import { generateId } from '@clarity-chat/primitives';
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
// ============================================================================
// Backward Compatibility Aliases
// ============================================================================
// These aliases maintain backward compatibility with older code that used
// the message-converter.ts file. New code should use the "convert" prefixed
// versions above.
/**
 * @deprecated Use convertCoreMessageToMessage instead
 * @alias convertCoreMessageToMessage
 */
export const coreMessageToMessage = convertCoreMessageToMessage;
/**
 * @deprecated Use convertCoreMessagesToMessages instead
 * @alias convertCoreMessagesToMessages
 */
export const coreMessagesToMessages = convertCoreMessagesToMessages;
/**
 * @deprecated Use convertMessageToCoreMessage instead
 * @alias convertMessageToCoreMessage
 */
export const messageToCoreMessage = convertMessageToCoreMessage;
/**
 * @deprecated Use convertMessagesToCoreMessages instead
 * @alias convertMessagesToCoreMessages
 */
export const messagesToCoreMessages = convertMessagesToCoreMessages;
//# sourceMappingURL=message-conversion.js.map