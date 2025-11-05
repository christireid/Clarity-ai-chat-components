/**
 * Enhanced TypeScript types for chat hooks
 * 
 * Provides better type inference and type safety
 */

import type { CoreMessage, CoreMessageContent } from '../hooks/use-chat-enhanced'

/**
 * Type guard for string content
 */
export function isStringContent(
  content: CoreMessageContent
): content is string {
  return typeof content === 'string'
}

/**
 * Type guard for array content
 */
export function isArrayContent(
  content: CoreMessageContent
): content is Array<{
  type: 'text' | 'image' | 'tool-call' | 'tool-result'
  [key: string]: any
}> {
  return Array.isArray(content)
}

/**
 * Type guard for text content part
 */
export function isTextContentPart(
  part: CoreMessageContent extends Array<infer T> ? T : never
): part is { type: 'text'; text: string } {
  return typeof part === 'object' && part !== null && 'type' in part && part.type === 'text'
}

/**
 * Type guard for image content part
 */
export function isImageContentPart(
  part: CoreMessageContent extends Array<infer T> ? T : never
): part is { type: 'image'; image: string | ArrayBuffer } {
  return typeof part === 'object' && part !== null && 'type' in part && part.type === 'image'
}

/**
 * Type guard for tool call content part
 */
export function isToolCallContentPart(
  part: CoreMessageContent extends Array<infer T> ? T : never
): part is {
  type: 'tool-call'
  toolCallId: string
  toolName: string
  args: Record<string, any>
} {
  return typeof part === 'object' && part !== null && 'type' in part && part.type === 'tool-call'
}

/**
 * Type guard for tool result content part
 */
export function isToolResultContentPart(
  part: CoreMessageContent extends Array<infer T> ? T : never
): part is {
  type: 'tool-result'
  toolCallId: string
  toolName: string
  result: any
} {
  return typeof part === 'object' && part !== null && 'type' in part && part.type === 'tool-result'
}

/**
 * Extract message role type
 */
export type MessageRole<T extends CoreMessage> = T['role']

/**
 * Extract message content type
 */
export type MessageContent<T extends CoreMessage> = T['content']

/**
 * Create typed message builder
 */
export class TypedMessageBuilder {
  static user(content: string): CoreMessage {
    return {
      role: 'user',
      content,
    }
  }

  static assistant(content: string): CoreMessage {
    return {
      role: 'assistant',
      content,
    }
  }

  static system(content: string): CoreMessage {
    return {
      role: 'system',
      content,
    }
  }

  static tool(
    toolCallId: string,
    toolName: string,
    result: any
  ): CoreMessage {
    return {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId,
          toolName,
          result,
        },
      ],
      toolCallId,
    }
  }

  static multimodal(
    role: 'user' | 'assistant',
    parts: Array<
      | { type: 'text'; text: string }
      | { type: 'image'; image: string | ArrayBuffer }
    >
  ): CoreMessage {
    return {
      role,
      content: parts,
    }
  }
}

/**
 * Type-safe message validator
 */
export class MessageValidator {
  static validate(message: CoreMessage): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (!message.role) {
      errors.push('Message must have a role')
    }

    const validRoles = ['user', 'assistant', 'system', 'function', 'tool']
    if (!validRoles.includes(message.role)) {
      errors.push(`Invalid role: ${message.role}`)
    }

    if (message.content === undefined || message.content === null) {
      errors.push('Message must have content')
    }

    if (typeof message.content === 'string' && message.content.trim() === '') {
      errors.push('Message content cannot be empty')
    }

    if (Array.isArray(message.content) && message.content.length === 0) {
      errors.push('Message content array cannot be empty')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  static validateBatch(messages: CoreMessage[]): {
    valid: boolean
    errors: Array<{ index: number; errors: string[] }>
  } {
    const errors: Array<{ index: number; errors: string[] }> = []

    messages.forEach((message, index) => {
      const validation = this.validate(message)
      if (!validation.valid) {
        errors.push({ index, errors: validation.errors })
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

/**
 * Type helper for inferring message content type
 */
export type InferMessageContent<T> = T extends CoreMessage<infer C> ? C : never

/**
 * Type helper for creating message with specific content type
 */
export type MessageWithContent<C extends CoreMessageContent> = CoreMessage & {
  content: C
}
