/**
 * Chat helper utilities for Vercel AI SDK compatible hooks
 *
 * Provides utilities for message transformation, formatting, and manipulation
 */

import type {
  CoreMessage,
  CoreMessageContent,
} from '../../hooks/chat/use-chat-enhanced'
import { estimateTokens } from '../tokenization/estimator'

/**
 * Convert CoreMessage to plain text
 */
export function messageToText(message: CoreMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }

  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (part.type === 'text') {
          return part.text
        }
        if (part.type === 'tool-call') {
          return `[Tool: ${part.toolName}]`
        }
        if (part.type === 'tool-result') {
          return `[Result: ${JSON.stringify(part.result)}]`
        }
        return ''
      })
      .join('')
  }

  return ''
}

/**
 * Extract text content from message content
 */
export function extractTextContent(content: CoreMessageContent): string {
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
 * Check if message contains tool calls
 */
export function hasToolCalls(message: CoreMessage): boolean {
  if (message.toolInvocations && message.toolInvocations.length > 0) {
    return true
  }

  if (Array.isArray(message.content)) {
    return message.content.some((part) => part.type === 'tool-call')
  }

  return false
}

/**
 * Extract tool calls from message
 */
export function extractToolCalls(message: CoreMessage): Array<{
  toolCallId: string
  toolName: string
  args: Record<string, any>
}> {
  const toolCalls: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
  }> = []

  if (message.toolInvocations) {
    toolCalls.push(
      ...message.toolInvocations.map((inv) => ({
        toolCallId: inv.toolCallId,
        toolName: inv.toolName,
        args: inv.args,
      }))
    )
  }

  if (Array.isArray(message.content)) {
    const contentToolCalls = message.content
      .filter((part) => part.type === 'tool-call')
      .map((part) => {
        if (part.type === 'tool-call') {
          return {
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            args: part.args,
          }
        }
        return null
      })
      .filter((tc): tc is NonNullable<typeof tc> => tc !== null)

    toolCalls.push(...contentToolCalls)
  }

  return toolCalls
}

/**
 * Format messages for API request
 */
export function formatMessagesForAPI(messages: CoreMessage[]): Array<{
  role: string
  content: string | Array<Record<string, any>>
  name?: string
  toolCallId?: string
}> {
  return messages.map((msg) => {
    const formatted: {
      role: string
      content: string | Array<Record<string, any>>
      name?: string
      toolCallId?: string
    } = {
      role: msg.role,
      content:
        typeof msg.content === 'string'
          ? msg.content
          : msg.content.map((part) => {
              if (part.type === 'text') {
                return { type: 'text', text: part.text }
              }
              if (part.type === 'image') {
                return {
                  type: 'image',
                  image: part.image,
                }
              }
              if (part.type === 'tool-call') {
                return {
                  type: 'tool-call',
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  args: part.args,
                }
              }
              if (part.type === 'tool-result') {
                return {
                  type: 'tool-result',
                  toolCallId: part.toolCallId,
                  toolName: part.toolName,
                  result: part.result,
                }
              }
              return part
            }),
    }

    if (msg.name) {
      formatted.name = msg.name
    }

    if (msg.toolCallId) {
      formatted.toolCallId = msg.toolCallId
    }

    return formatted
  })
}

/**
 * Merge streaming chunks into message
 */
export function mergeStreamingChunks(
  existing: CoreMessage,
  chunk: string | Record<string, any>
): CoreMessage {
  const content =
    typeof chunk === 'string'
      ? chunk
      : chunk['content'] || chunk['text'] || chunk['delta'] || ''

  if (typeof existing.content === 'string') {
    return {
      ...existing,
      content: existing.content + content,
    }
  }

  // For array content, append to last text part or add new text part
  if (Array.isArray(existing.content)) {
    const lastPart = existing.content[existing.content.length - 1]
    if (lastPart && lastPart.type === 'text') {
      return {
        ...existing,
        content: [
          ...existing.content.slice(0, -1),
          {
            ...lastPart,
            text: lastPart.text + content,
          },
        ],
      }
    } else {
      return {
        ...existing,
        content: [
          ...existing.content,
          {
            type: 'text' as const,
            text: content,
          },
        ],
      }
    }
  }

  return existing
}

/**
 * Create a user message
 */
export function createUserMessage(
  content: string,
  options?: { id?: string }
): CoreMessage {
  return {
    id: options?.id,
    role: 'user',
    content,
  }
}

/**
 * Create an assistant message
 */
export function createAssistantMessage(
  content: string,
  options?: { id?: string; toolInvocations?: CoreMessage['toolInvocations'] }
): CoreMessage {
  return {
    id: options?.id,
    role: 'assistant',
    content,
    toolInvocations: options?.toolInvocations,
  }
}

/**
 * Create a system message
 */
export function createSystemMessage(
  content: string,
  options?: { id?: string }
): CoreMessage {
  return {
    id: options?.id,
    role: 'system',
    content,
  }
}

/**
 * Create a tool result message
 */
export function createToolResultMessage(
  toolCallId: string,
  toolName: string,
  result: any,
  options?: { id?: string }
): CoreMessage {
  return {
    id: options?.id,
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

/**
 * Validate message structure
 */
export function validateMessage(message: CoreMessage): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!message.role) {
    errors.push('Message must have a role')
  }

  if (
    !['user', 'assistant', 'system', 'function', 'tool'].includes(message.role)
  ) {
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

/**
 * Estimate token count (rough approximation)
 * Uses centralized estimator for consistency across codebase
 *
 * @param {CoreMessage} message - Message to estimate tokens for
 * @returns {number} Estimated token count
 */
export function estimateTokenCount(message: CoreMessage): number {
  const text = messageToText(message)
  if (!text) return 0

  // Use centralized estimator for consistent token counting
  return estimateTokens(text)
}

/**
 * Filter messages by role
 */
export function filterMessagesByRole(
  messages: CoreMessage[],
  role: CoreMessage['role']
): CoreMessage[] {
  return messages.filter((msg) => msg.role === role)
}

/**
 * Get last message of specific role.
 * More efficient than filtering entire array - iterates from end.
 */
export function getLastMessageByRole(
  messages: CoreMessage[],
  role: CoreMessage['role']
): CoreMessage | undefined {
  // Iterate from end for better performance
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === role) {
      return messages[i]
    }
  }
  return undefined
}

/**
 * Truncate messages to fit token limit
 */
export function truncateMessagesToTokenLimit(
  messages: CoreMessage[],
  maxTokens: number
): CoreMessage[] {
  let totalTokens = 0
  const truncated: CoreMessage[] = []

  // Start from the end and work backwards
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (!message) continue

    const messageTokens = estimateTokenCount(message)

    if (totalTokens + messageTokens <= maxTokens) {
      truncated.unshift(message)
      totalTokens += messageTokens
    } else {
      break
    }
  }

  return truncated
}
