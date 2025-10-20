/**
 * Project-related type definitions
 */

import type { Chat } from './chat'
import type { Context } from './context'
import type { KnowledgeBase } from './knowledge-base'

export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  icon?: string
  color?: string
  context: Context[]
  chats: Chat[]
  knowledgeBase?: KnowledgeBase
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProjectSummary {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  chatCount: number
  contextCount: number
  lastActivityAt?: Date
}

export interface ProjectSettings {
  autoGenerateKnowledgeBase: boolean
  allowedContextTypes: ContextType[]
  maxContextSize: number
  retentionDays?: number
}

export type ContextType = 'document' | 'image' | 'link' | 'text' | 'video' | 'audio'
