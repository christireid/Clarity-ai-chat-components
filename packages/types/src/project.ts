/**
 * Project-related type definitions
 *
 * This module contains types for organizing chats and context
 * into projects, including project settings and summaries.
 *
 * @packageDocumentation
 */

import type { Chat } from './chat'
import type { Context, ContextType } from './context'
import type { KnowledgeBase } from './knowledge-base'

/**
 * A project containing related chats and context.
 *
 * @remarks
 * Projects are the top-level organizational unit in Clarity Chat.
 * They group related chats together and can include shared context
 * (documents, links, etc.) that inform AI responses.
 *
 * @example
 * ```typescript
 * const project: Project = {
 *   id: 'proj-1',
 *   userId: 'user-1',
 *   name: 'Website Redesign',
 *   description: 'Planning the new company website',
 *   icon: 'globe',
 *   color: '#3B82F6',
 *   context: [],
 *   chats: [],
 *   isPinned: true,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * }
 * ```
 */
export interface Project {
  /** Unique project identifier */
  id: string
  /** ID of the user who owns this project */
  userId: string
  /** Display name for the project */
  name: string
  /** Optional description of the project */
  description?: string
  /** Icon identifier for the project */
  icon?: string
  /** Color code for the project (hex or CSS color) */
  color?: string
  /** Context items attached to this project */
  context: Context[]
  /** Chats belonging to this project */
  chats: Chat[]
  /** Auto-generated knowledge base */
  knowledgeBase?: KnowledgeBase
  /** Whether this project is pinned to the top */
  isPinned: boolean
  /** When the project was created */
  createdAt: Date
  /** When the project was last updated */
  updatedAt: Date
}

/**
 * Lightweight project summary for listings.
 *
 * @remarks
 * Used in project lists where full context and chat arrays
 * are not needed.
 *
 * @example
 * ```typescript
 * const summary: ProjectSummary = {
 *   id: 'proj-1',
 *   name: 'Website Redesign',
 *   description: 'Planning the new company website',
 *   icon: 'globe',
 *   color: '#3B82F6',
 *   chatCount: 5,
 *   contextCount: 3,
 *   lastActivityAt: new Date(),
 * }
 * ```
 */
export interface ProjectSummary {
  /** Unique project identifier */
  id: string
  /** Display name for the project */
  name: string
  /** Optional description of the project */
  description?: string
  /** Icon identifier for the project */
  icon?: string
  /** Color code for the project */
  color?: string
  /** Number of chats in this project */
  chatCount: number
  /** Number of context items in this project */
  contextCount: number
  /** When the last activity occurred */
  lastActivityAt?: Date
}

/**
 * Configuration settings for a project.
 *
 * @example
 * ```typescript
 * const settings: ProjectSettings = {
 *   autoGenerateKnowledgeBase: true,
 *   allowedContextTypes: ['document', 'link', 'text'],
 *   maxContextSize: 10485760, // 10MB
 *   retentionDays: 90,
 * }
 * ```
 */
export interface ProjectSettings {
  /** Whether to auto-generate a knowledge base from conversations */
  autoGenerateKnowledgeBase: boolean
  /** Types of context allowed in this project */
  allowedContextTypes: ContextType[]
  /** Maximum total context size in bytes */
  maxContextSize: number
  /** Number of days to retain data (undefined = forever) */
  retentionDays?: number
}
