/**
 * DocsAssistant Types
 *
 * TypeScript interfaces and types for the DocsAssistant component.
 */

import type { Message } from '@clarity-chat/types'

// ============================================================================
// Component Props
// ============================================================================

export interface DocsAssistantProps {
  className?: string
}

// ============================================================================
// Streaming Types
// ============================================================================

export type StreamingStatus =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'error'
  | 'retrying'

// ============================================================================
// Conversation Types
// ============================================================================

export interface SavedConversation {
  messages: Message[]
  timestamp: number
}

// ============================================================================
// Source/Citation Types
// ============================================================================

export interface Source {
  id?: string
  source?: string
  title?: string
  url: string
  confidence?: number
  chunkText?: string // Content preview from enhanced RAG
  score?: number
}
