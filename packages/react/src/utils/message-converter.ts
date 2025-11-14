/**
 * Message conversion utilities
 * 
 * Converts between CoreMessage (Vercel AI SDK compatible) and Message (Clarity types)
 */

import type { Message, MessageRole } from '@clarity-chat/types'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import { generateId } from '@clarity-chat/primitives'

/**
 * Extract text content from CoreMessageContent
 */
function extractTextContent(content: CoreMessage['content']): string {
  if (typeof content === 'string') {
    return content
  }
  
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text')
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join('')
  }
  
  return ''
}

/**
 * Convert CoreMessage to Message
 */
export function coreMessageToMessage(
  coreMessage: CoreMessage,
  chatId: string = 'default'
): Message {
  const content = extractTextContent(coreMessage.content)
  const role = coreMessage.role as MessageRole

  return {
    id: coreMessage.id || generateId(),
    chatId,
    role,
    content,
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Convert array of CoreMessage to Message[]
 */
export function coreMessagesToMessages(
  coreMessages: CoreMessage[],
  chatId: string = 'default'
): Message[] {
  return coreMessages.map((msg) => coreMessageToMessage(msg, chatId))
}
