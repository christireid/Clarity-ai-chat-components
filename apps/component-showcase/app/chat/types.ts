/**
 * Type definitions for Chat Page components
 */

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tools?: ToolExecution[]
  thinking?: ThinkingStep[]
  citations?: Citation[]
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  isDraft?: boolean
  isArchived?: boolean
  isPinned?: boolean
}

export interface ToolExecution {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  duration?: string
}

export interface ThinkingStep {
  id: string
  content: string
  timestamp: Date
}

export interface Citation {
  id: string
  title: string
  url: string
  snippet: string
}

export interface SettingsState {
  model: string
  temperature: number
  maxTokens: number
  streamingEnabled: boolean
  toolsEnabled: boolean
  memoryEnabled: boolean
  autoSave: boolean
}

export interface TokenUsage {
  input: number
  output: number
  total: number
  budget: number
}
