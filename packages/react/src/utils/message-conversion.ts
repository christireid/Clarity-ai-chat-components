/**
 * Message Conversion Utilities
 * 
 * Utilities for converting between CoreMessage (Vercel AI SDK format)
 * and Message (Clarity internal format) types.
 */

import type { CoreMessage } from '../hooks/use-chat-enhanced'
import type { Message, MessageRole } from '@clarity-chat/types'

/**
 * Convert CoreMessage to Message format
 * 
 * @param coreMessage - CoreMessage from useChatEnhanced
 * @param chatId - Chat ID for the message
 * @returns Message compatible with ChatWindow
 */
export function convertCoreMessageToMessage(
  coreMessage: CoreMessage,
  chatId: string = 'default'
): Message {
  // Extract text content from CoreMessage
  const content = typeof coreMessage.content === 'string'
    ? coreMessage.content
    : Array.isArray(coreMessage.content)
    ? coreMessage.content
        .filter((part) => part.type === 'text')
        .map((part) => (part as { type: 'text'; text: string }).text)
        .join('')
    : ''

  // Map role types
  const role: MessageRole = 
    coreMessage.role === 'function' || coreMessage.role === 'tool'
      ? 'assistant'
      : (coreMessage.role as MessageRole)

  return {
    id: coreMessage.id || `msg-${Date.now()}-${Math.random()}`,
    chatId,
    role,
    content,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Convert Message to CoreMessage format
 * 
 * @param message - Message from Clarity types
 * @returns CoreMessage compatible with useChatEnhanced
 */
export function convertMessageToCoreMessage(
  message: Message
): CoreMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
  }
}

/**
 * Convert array of CoreMessages to Messages
 * 
 * @param coreMessages - Array of CoreMessages
 * @param chatId - Chat ID for all messages
 * @returns Array of Messages
 */
export function convertCoreMessagesToMessages(
  coreMessages: CoreMessage[],
  chatId: string = 'default'
): Message[] {
  return coreMessages.map((msg) => convertCoreMessageToMessage(msg, chatId))
}

/**
 * Convert array of Messages to CoreMessages
 * 
 * @param messages - Array of Messages
 * @returns Array of CoreMessages
 */
export function convertMessagesToCoreMessages(
  messages: Message[]
): CoreMessage[] {
  return messages.map(convertMessageToCoreMessage)
}
