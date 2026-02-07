/**
 * Message-related type definitions
 *
 * This module contains all types related to chat messages, including:
 * - Message roles and status types
 * - Core Message interface and variants
 * - Streaming message types
 * - Message actions and feedback
 *
 * @packageDocumentation
 */

/**
 * Role of the message sender in a conversation.
 *
 * @remarks
 * - `user`: Human user sending a message
 * - `assistant`: AI assistant response
 * - `system`: System-level instructions or context
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Current status of a message in its lifecycle.
 *
 * @remarks
 * Status progression typically follows:
 * - `pending` → `sending` → `sent` (for user messages)
 * - `pending` → `streaming` → `sent` (for AI responses)
 * - Any state → `error` (on failure)
 */
export type MessageStatus =
  | 'pending'
  | 'sending'
  | 'sent'
  | 'streaming'
  | 'error'

/**
 * Type of user feedback on a message (thumbs up/down).
 */
export type FeedbackType = 'up' | 'down'

/**
 * Metadata associated with a message, typically from the AI provider.
 *
 * @remarks
 * This interface includes common metadata fields and supports additional
 * custom properties through an index signature. Custom properties are typed
 * as `unknown` to enforce type narrowing before use.
 *
 * @example
 * ```typescript
 * const metadata: MessageMetadata = {
 *   tokens: 150,
 *   model: 'gpt-4',
 *   processingTime: 1234,
 *   customField: 'value', // Additional custom properties allowed
 * }
 *
 * // Accessing custom properties requires type narrowing
 * if (typeof metadata.customField === 'string') {
 *   console.log(metadata.customField)
 * }
 * ```
 */
export interface MessageMetadata {
  /** Number of tokens used by this message */
  tokens?: number
  /** AI model identifier that generated the response */
  model?: string
  /** Time taken to process/generate the message in milliseconds */
  processingTime?: number
  /** Estimated cost of generating this message */
  cost?: number
  /** Source references used to generate the response */
  sources?: string[]
  /** Additional custom metadata properties (requires type narrowing) */
  [key: string]: unknown
}

/**
 * File or media attachment on a message.
 *
 * @example
 * ```typescript
 * const attachment: MessageAttachment = {
 *   id: 'att-1',
 *   type: 'image',
 *   url: 'https://example.com/image.png',
 *   name: 'screenshot.png',
 *   size: 102400,
 *   mimeType: 'image/png',
 * }
 * ```
 */
export interface MessageAttachment {
  /** Unique attachment identifier */
  id: string
  /** Type of attachment content */
  type: 'image' | 'video' | 'document' | 'audio' | 'link'
  /** URL to access the attachment */
  url: string
  /** Display name of the attachment */
  name: string
  /** File size in bytes */
  size?: number
  /** MIME type of the file */
  mimeType?: string
  /** URL to a thumbnail preview (for images/videos) */
  thumbnail?: string
}

/**
 * User feedback on a message.
 *
 * @example
 * ```typescript
 * const feedback: MessageFeedback = {
 *   type: 'up',
 *   timestamp: new Date(),
 *   comment: 'Helpful response!',
 * }
 * ```
 */
export interface MessageFeedback {
  /** Feedback type (thumbs up or down) */
  type: FeedbackType
  /** When the feedback was given */
  timestamp: Date
  /** Optional comment explaining the feedback */
  comment?: string
}

/**
 * Core message interface representing a single message in a conversation.
 *
 * @remarks
 * This is the primary message type used throughout the Clarity Chat system.
 * It includes all properties needed to display, track, and manage messages.
 *
 * @example
 * ```typescript
 * const message: Message = {
 *   id: 'msg-1',
 *   chatId: 'chat-1',
 *   role: 'user',
 *   content: 'Hello, how can you help me?',
 *   status: 'sent',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface Message {
  /** Unique message identifier */
  id: string
  /** ID of the chat this message belongs to */
  chatId: string
  /** Role of the message sender */
  role: MessageRole
  /** Text content of the message */
  content: string
  /** Current message status */
  status: MessageStatus
  /** File/media attachments */
  attachments?: MessageAttachment[]
  /** Provider metadata (tokens, model, etc.) */
  metadata?: MessageMetadata
  /** User feedback on this message */
  feedback?: MessageFeedback
  /** When the message was created */
  createdAt: Date
  /** When the message was last updated */
  updatedAt: Date
  /** History of edits to this message */
  editHistory?: MessageEdit[]
}

/**
 * Record of a message edit.
 */
export interface MessageEdit {
  /** Previous content before the edit */
  content: string
  /** When the edit was made */
  timestamp: Date
}

/**
 * Message variant used during streaming responses.
 *
 * @remarks
 * Extends Message with additional streaming-specific properties.
 * The `delta` property contains only the new content since the last update.
 *
 * @example
 * ```typescript
 * const streamingMessage: StreamingMessage = {
 *   id: 'msg-1',
 *   chatId: 'chat-1',
 *   role: 'assistant',
 *   content: 'Hello, I can help you with...',
 *   delta: 'with...',
 *   status: 'streaming',
 *   isComplete: false,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface StreamingMessage extends Omit<Message, 'content'> {
  /** Full accumulated content so far */
  content: string
  /** New content delta since last update */
  delta?: string
  /** Whether streaming has completed */
  isComplete: boolean
}

/**
 * Action that can be performed on a message.
 *
 * @remarks
 * Used to define custom actions in message context menus or action bars.
 *
 * @example
 * ```typescript
 * const copyAction: MessageAction = {
 *   id: 'copy',
 *   label: 'Copy',
 *   icon: 'clipboard',
 *   onClick: (message) => navigator.clipboard.writeText(message.content),
 *   condition: (message) => message.role === 'assistant',
 * }
 * ```
 */
export interface MessageAction {
  /** Unique action identifier */
  id: string
  /** Display label for the action */
  label: string
  /** Optional icon identifier */
  icon?: string
  /** Handler called when action is triggered */
  onClick: (message: Message) => void
  /** Optional condition to show/enable the action */
  condition?: (message: Message) => boolean
}

/**
 * Client-side message type optimized for streaming UIs.
 *
 * @remarks
 * This type is designed for use in chat interfaces where messages are
 * streamed in real-time. It has optional fields to accommodate both
 * the streaming phase and the final state.
 *
 * Use this type for:
 * - Real-time message display during streaming
 * - Optimistic UI updates before server confirmation
 * - Lightweight message representations
 *
 * @example
 * ```typescript
 * const message: StreamMessage = {
 *   id: '1',
 *   role: 'assistant',
 *   content: 'Hello...',
 *   isStreaming: true,
 *   status: 'sending',
 * }
 * ```
 */
// =============================================================================
// Canonical ChatMessage type
// =============================================================================

/**
 * Canonical role type for chat messages across all packages.
 *
 * Superset of all role types used in the system:
 * - `user` / `assistant` / `system`: Standard chat roles
 * - `tool` / `function`: Used by token-optimization and pipeline packages
 */
export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'tool' | 'function'

/**
 * Canonical ChatMessage interface for the Clarity Chat ecosystem.
 *
 * This is the single source of truth for chat message types. All packages
 * should import `ChatMessage` from `@clarity-chat/types` instead of defining
 * their own. Use the narrower subtypes below when you need a constrained shape.
 *
 * @example
 * ```typescript
 * import type { ChatMessage } from '@clarity-chat/types'
 *
 * const msg: ChatMessage = {
 *   id: 'msg-1',
 *   role: 'user',
 *   content: 'Hello!',
 * }
 * ```
 */
export interface ChatMessage {
  /** Unique message identifier */
  id?: string
  /** Role of the message sender */
  role: ChatMessageRole
  /** Text content of the message */
  content: string
  /** When the message was created */
  createdAt?: Date
  /** Message lifecycle status */
  status?: 'pending' | 'sending' | 'sent' | 'streaming' | 'complete' | 'error'
  /** Unix timestamp (milliseconds) — alternative to createdAt */
  timestamp?: number
  /** Tool/function call name (for role: 'tool' | 'function') */
  name?: string
  /** Tool call ID for correlating tool results */
  toolCallId?: string
  /** Tool calls made by this message */
  toolCalls?: Array<{
    id: string
    name: string
    arguments: Record<string, unknown>
    result?: unknown
    status?: 'pending' | 'running' | 'complete' | 'error'
    error?: string
  }>
  /** File/media attachments */
  attachments?: Array<{
    id: string
    name: string
    type: string
    url?: string
    size?: number
    mimeType?: string
    previewUrl?: string
    data?: unknown
  }>
  /** Flexible metadata bag */
  metadata?: Record<string, unknown>
}

/**
 * Minimal ChatMessage for token counting and pipeline operations.
 * Only the fields needed for tokenization.
 */
export type TokenChatMessage = Pick<ChatMessage, 'role' | 'content' | 'name'>

/**
 * ChatMessage with required id — used by UI components and state management.
 */
export type IdentifiedChatMessage = ChatMessage & { id: string }

// =============================================================================
// StreamMessage (legacy)
// =============================================================================

export interface StreamMessage {
  /** Unique message identifier */
  id: string
  /** Optional chat/conversation identifier */
  chatId?: string
  /** Message sender role */
  role: MessageRole
  /** Message text content */
  content: string
  /** When the message was created */
  createdAt?: Date
  /** When the message was last updated */
  updatedAt?: Date
  /** Current message status */
  status?: 'sending' | 'sent' | 'error'
  /** Unix timestamp (milliseconds) - alternative to createdAt */
  timestamp?: number
  /** Whether the message is currently being streamed */
  isStreaming?: boolean
}
