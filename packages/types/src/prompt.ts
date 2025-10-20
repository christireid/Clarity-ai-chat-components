/**
 * Prompt-related type definitions
 */

export interface PromptVariable {
  name: string
  description?: string
  defaultValue?: string
  required: boolean
}

export interface SavedPrompt {
  id: string
  userId: string
  name: string
  content: string
  description?: string
  category?: string
  tags: string[]
  variables: PromptVariable[]
  usageCount: number
  lastUsed?: Date
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PromptCategory {
  id: string
  name: string
  description?: string
  icon?: string
  promptCount: number
}

export interface PromptTemplate {
  id: string
  name: string
  content: string
  variables: PromptVariable[]
  isPublic: boolean
}

export interface PromptSuggestion {
  id: string
  text: string
  category?: string
  relevance: number
}
