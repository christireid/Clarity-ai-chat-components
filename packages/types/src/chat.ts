/**
 * Chat-related type definitions
 */

import type { Message } from './message'

export interface Chat {
  id: string
  projectId?: string
  name: string
  description?: string
  messages: Message[]
  isPinned: boolean
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date
}

export interface ChatSummary {
  id: string
  name: string
  lastMessage?: string
  messageCount: number
  lastMessageAt?: Date
}

export interface ChatHistory {
  chats: ChatSummary[]
  total: number
  hasMore: boolean
}

export interface ChatFilter {
  projectId?: string
  search?: string
  isPinned?: boolean
  isFavorite?: boolean
  dateFrom?: Date
  dateTo?: Date
}

export interface ChatSort {
  field: 'name' | 'createdAt' | 'updatedAt' | 'lastMessageAt'
  direction: 'asc' | 'desc'
}
