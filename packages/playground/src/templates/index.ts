/**
 * Playground Templates
 *
 * A collection of pre-built code templates demonstrating various
 * Clarity Chat component patterns and use cases.
 *
 * This module has been refactored into a modular structure:
 * - templates/getting-started/ - Basic examples to get started
 * - templates/chat-components/ - Pre-built chat UI components
 * - templates/controls/ - Input and control components
 * - templates/advanced/ - Complex patterns and integrations
 * - templates/patterns/ - Common design patterns
 * - templates/memory/ - Conversation memory and context
 */

import type { PlaygroundTemplate } from '../types'

// Import all templates from their respective modules
export * from './getting-started'
export * from './chat-components'
export * from './controls'
export * from './advanced'
export * from './patterns'
export * from './memory'

// Import individual templates for array export
import { basicChat, streamingResponse, multiTurnConversation } from './getting-started'
import { chatWindow, messageBubble } from './chat-components'
import { tokenCounter, modelSelector } from './controls'
import { functionCalling, ragPattern, multiModal } from './advanced'
import { typingIndicator, loadingStates, errorHandling, voiceInput } from './patterns'
import { conversationMemory } from './memory'

// Export all templates as array for iteration
export const templates: PlaygroundTemplate[] = [
  // Getting Started
  basicChat,
  streamingResponse,
  multiTurnConversation,
  // Chat Components
  chatWindow,
  messageBubble,
  // Controls
  tokenCounter,
  modelSelector,
  // Advanced
  functionCalling,
  ragPattern,
  multiModal,
  // Memory
  conversationMemory,
  // Patterns
  typingIndicator,
  loadingStates,
  errorHandling,
  voiceInput,
]

// Template categories for UI grouping
export const templateCategories = {
  'getting-started': {
    label: 'Getting Started',
    description: 'Basic examples to get you started',
    icon: '🚀',
  },
  'chat-components': {
    label: 'Chat Components',
    description: 'Pre-built chat UI components',
    icon: '💬',
  },
  streaming: {
    label: 'Streaming',
    description: 'Real-time streaming examples',
    icon: '⚡',
  },
  controls: {
    label: 'Controls',
    description: 'Input and control components',
    icon: '🎛️',
  },
  advanced: {
    label: 'Advanced',
    description: 'Complex patterns and integrations',
    icon: '🔧',
  },
  memory: {
    label: 'Memory',
    description: 'Conversation memory and context',
    icon: '🧠',
  },
  patterns: {
    label: 'Patterns',
    description: 'Common design patterns',
    icon: '📐',
  },
}

// Helper functions
export function getTemplateById(id: string): PlaygroundTemplate | undefined {
  return templates.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: string): PlaygroundTemplate[] {
  return templates.filter((t) => t.category === category)
}

export function searchTemplates(query: string): PlaygroundTemplate[] {
  const lowerQuery = query.toLowerCase()
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

// Legacy export for backwards compatibility
export const legacyTemplates: Record<string, string> = {
  basic: basicChat.code,
  streaming: streamingResponse.code,
  conversation: multiTurnConversation.code,
  'chat-window': chatWindow.code,
  'message-bubble': messageBubble.code,
  'token-counter': tokenCounter.code,
  'model-selector': modelSelector.code,
  'function-calling': functionCalling.code,
  'rag-pattern': ragPattern.code,
}
