/**
 * TypeScript Utility Types for Clarity Chat
 * 
 * Helper types for working with useClarityChat and related components
 */

import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityChatMemoryInfo,
  ClarityChatErrorInfo,
} from '../hooks/use-clarity-chat'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import type { Message } from '@clarity-chat/types'

/**
 * Extract message content as string
 */
export type MessageContent = string | CoreMessage['content']

/**
 * Message role type
 */
export type MessageRole = CoreMessage['role']

/**
 * Chat configuration with memory enabled
 */
export interface ClarityChatWithMemoryConfig extends UseClarityChatOptions {
  memory: ClarityMemoryOptions & { enabled: true }
}

/**
 * Chat configuration without memory
 */
export interface ClarityChatWithoutMemoryConfig extends UseClarityChatOptions {
  memory?: never
}

/**
 * Chat return type with memory enabled
 */
export interface ClarityChatWithMemoryReturn extends UseClarityChatReturn {
  memoryInfo: ClarityChatMemoryInfo & { enabled: true }
}

/**
 * Chat return type without memory
 */
export interface ClarityChatWithoutMemoryReturn extends UseClarityChatReturn {
  memoryInfo: ClarityChatMemoryInfo & { enabled: false }
}

/**
 * Helper to check if memory is enabled
 */
export type IsMemoryEnabled<T extends UseClarityChatOptions> = 
  T['memory'] extends { enabled: true } ? true : false

/**
 * Extract memory strategy type
 */
export type MemoryStrategy = ClarityMemoryOptions['strategy']

/**
 * Extract transport type
 */
export type TransportType = UseClarityChatOptions['transport']

/**
 * Message with metadata for display
 */
export interface MessageWithMetadata extends Message {
  /** Whether message is currently streaming */
  isStreaming?: boolean
  /** Timestamp when message was sent */
  sentAt?: Date
  /** Token count */
  tokenCount?: number
  /** Whether message has been edited */
  isEdited?: boolean
}

/**
 * Chat state snapshot
 */
export interface ChatStateSnapshot {
  messages: CoreMessage[]
  input: string
  isLoading: boolean
  error: Error | undefined
  memoryInfo: ClarityChatMemoryInfo
  memoryErrorInfo: ClarityChatErrorInfo
  timestamp: Date
}

/**
 * Chat event types
 */
export type ChatEventType =
  | 'message-sent'
  | 'message-received'
  | 'stream-started'
  | 'stream-completed'
  | 'error-occurred'
  | 'memory-queried'
  | 'memory-stored'

/**
 * Chat event payload
 */
export interface ChatEvent {
  type: ChatEventType
  timestamp: Date
  data?: unknown
  error?: Error
}

/**
 * Chat event handler
 */
export type ChatEventHandler = (event: ChatEvent) => void

/**
 * Configuration for chat analytics
 */
export interface ChatAnalyticsConfig {
  /** Track message events */
  trackMessages?: boolean
  /** Track memory operations */
  trackMemory?: boolean
  /** Track errors */
  trackErrors?: boolean
  /** Custom event handler */
  onEvent?: ChatEventHandler
}

/**
 * Chat performance metrics
 */
export interface ChatPerformanceMetrics {
  /** Average response time in ms */
  averageResponseTime: number
  /** Total messages sent */
  messagesSent: number
  /** Total messages received */
  messagesReceived: number
  /** Memory operations count */
  memoryOperations: number
  /** Error count */
  errorCount: number
}

/**
 * Type guard: Check if memory is enabled
 */
export function isMemoryEnabled(
  options: UseClarityChatOptions
): options is ClarityChatWithMemoryConfig {
  return options.memory?.enabled === true
}

/**
 * Type guard: Check if message is user message
 */
export function isUserMessage(message: CoreMessage): boolean {
  return message.role === 'user'
}

/**
 * Type guard: Check if message is assistant message
 */
export function isAssistantMessage(message: CoreMessage): boolean {
  return message.role === 'assistant'
}

/**
 * Type guard: Check if message has text content
 */
export function hasTextContent(message: CoreMessage): boolean {
  return typeof message.content === 'string' || 
         (Array.isArray(message.content) && 
          message.content.some(part => part.type === 'text'))
}

/**
 * Extract text content from message
 */
export function extractTextContent(message: CoreMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }
  
  if (Array.isArray(message.content)) {
    return message.content
      .filter(part => part.type === 'text')
      .map(part => (part as { type: 'text'; text: string }).text)
      .join(' ')
  }
  
  return ''
}

/**
 * Create a user message
 */
export function createUserMessage(content: string, id?: string): CoreMessage {
  return {
    id: id || `user-${Date.now()}`,
    role: 'user',
    content,
  }
}

/**
 * Create an assistant message
 */
export function createAssistantMessage(content: string, id?: string): CoreMessage {
  return {
    id: id || `assistant-${Date.now()}`,
    role: 'assistant',
    content,
  }
}

/**
 * Create a system message
 */
export function createSystemMessage(content: string, id?: string): CoreMessage {
  return {
    id: id || `system-${Date.now()}`,
    role: 'system',
    content,
  }
}
