/**
 * Chat-related type definitions
 *
 * This module contains types for chat sessions, including
 * the core Chat interface, filtering, sorting, and history management.
 *
 * @packageDocumentation
 */

import type { Message } from './message'

/**
 * A chat session containing a conversation thread.
 *
 * @remarks
 * Chats are the primary container for conversations in Clarity Chat.
 * They can optionally belong to a project and contain metadata for
 * organization like pinned/favorite status.
 *
 * @example
 * ```typescript
 * const chat: Chat = {
 *   id: 'chat-1',
 *   name: 'Project Discussion',
 *   description: 'Discussion about the new feature',
 *   messages: [],
 *   isPinned: false,
 *   isFavorite: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface Chat {
  /** Unique chat identifier */
  id: string
  /** ID of the project this chat belongs to (if any) */
  projectId?: string
  /** Display name for the chat */
  name: string
  /** Optional description of the chat topic */
  description?: string
  /** Array of messages in this chat */
  messages: Message[]
  /** Whether this chat is pinned to the top */
  isPinned: boolean
  /** Whether this chat is marked as favorite */
  isFavorite: boolean
  /** When the chat was created */
  createdAt: Date
  /** When the chat was last updated */
  updatedAt: Date
  /** When the last message was sent */
  lastMessageAt?: Date
}

/**
 * Lightweight chat summary for listings.
 *
 * @remarks
 * Used in chat lists and history views where the full message
 * array is not needed.
 *
 * @example
 * ```typescript
 * const summary: ChatSummary = {
 *   id: 'chat-1',
 *   name: 'Project Discussion',
 *   lastMessage: 'Thanks for the help!',
 *   messageCount: 42,
 *   lastMessageAt: new Date(),
 * }
 * ```
 */
export interface ChatSummary {
  /** Unique chat identifier */
  id: string
  /** Display name for the chat */
  name: string
  /** Preview of the last message content */
  lastMessage?: string
  /** Total number of messages in the chat */
  messageCount: number
  /** When the last message was sent */
  lastMessageAt?: Date
}

/**
 * Paginated chat history response.
 *
 * @example
 * ```typescript
 * const history: ChatHistory = {
 *   chats: [{ id: 'chat-1', name: 'Discussion', messageCount: 10 }],
 *   total: 100,
 *   hasMore: true,
 * }
 * ```
 */
export interface ChatHistory {
  /** Array of chat summaries */
  chats: ChatSummary[]
  /** Total number of chats (for pagination) */
  total: number
  /** Whether more chats are available */
  hasMore: boolean
}

/**
 * Filter criteria for querying chats.
 *
 * @example
 * ```typescript
 * const filter: ChatFilter = {
 *   projectId: 'proj-1',
 *   search: 'typescript',
 *   isPinned: true,
 *   dateFrom: new Date('2024-01-01'),
 * }
 * ```
 */
export interface ChatFilter {
  /** Filter by project ID */
  projectId?: string
  /** Search term for name/content */
  search?: string
  /** Filter by pinned status */
  isPinned?: boolean
  /** Filter by favorite status */
  isFavorite?: boolean
  /** Filter by date range start */
  dateFrom?: Date
  /** Filter by date range end */
  dateTo?: Date
}

/**
 * Sort configuration for chat listings.
 *
 * @example
 * ```typescript
 * const sort: ChatSort = {
 *   field: 'lastMessageAt',
 *   direction: 'desc',
 * }
 * ```
 */
export interface ChatSort {
  /** Field to sort by */
  field: 'name' | 'createdAt' | 'updatedAt' | 'lastMessageAt'
  /** Sort direction */
  direction: 'asc' | 'desc'
}
