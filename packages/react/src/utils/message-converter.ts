/**
 * Message Converter Utilities
 * 
 * Utilities for converting between CoreMessage (Vercel-compatible) 
 * and Message (@clarity-chat/types) formats
 */

import type { CoreMessage, CoreMessageContent } from '../hooks/use-chat-enhanced'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

/**
 * Extract text content from CoreMessageContent
 */
function extractTextContent(content: CoreMessageContent): string {
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text')
      .map((part) => (part as { type: 'text'; text: string }).text)
      .join('\n')
  }
  return ''
}

/**
 * Convert CoreMessage to Message format
 */
export function coreMessageToMessage(
  coreMessage: CoreMessage,
  chatId: string = 'default'
): Message {
  const content = extractTextContent(coreMessage.content)
  const now = new Date()

  return {
    id: coreMessage.id || generateId(),
    chatId,
    role: coreMessage.role === 'function' || coreMessage.role === 'tool' 
      ? 'assistant' 
      : coreMessage.role,
    content,
    status: 'sent',
    createdAt: now,
    updatedAt: now,
    metadata: {
      toolInvocations: coreMessage.toolInvocations,
      toolCallId: coreMessage.toolCallId,
      name: coreMessage.name,
    },
  }
}

/**
 * Convert array of CoreMessage to Message array
 */
export function coreMessagesToMessages(
  coreMessages: CoreMessage[],
  chatId: string = 'default'
): Message[] {
  return coreMessages.map((msg) => coreMessageToMessage(msg, chatId))
}
