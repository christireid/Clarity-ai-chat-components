/**
 * Configuration Manager Types
 * Types for export/import configuration functionality
 */

export interface ChatConfiguration {
  id: string
  name: string
  description: string
  version: string
  createdAt: string
  updatedAt: string
  author?: string
  tags?: string[]

  // UI Configuration
  theme: {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    fontFamily: string
  }

  // Chat Features
  features: {
    memory: boolean
    streaming: boolean
    tools: boolean
    voiceInput: boolean
    fileAttachments: boolean
    codeExecution: boolean
    webSearch: boolean
    citations: boolean
    tokenOptimization: boolean
    rateLimiting: boolean
  }

  // Model Configuration
  model: {
    provider: 'openai' | 'anthropic' | 'cohere' | 'custom'
    name: string
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }

  // UI Layout
  layout: {
    variant: 'default' | 'compact' | 'wide' | 'split'
    showSidebar: boolean
    showHeader: boolean
    showFooter: boolean
    messageLayout: 'bubbles' | 'flat' | 'cards'
  }

  // Advanced Settings
  advanced: {
    customSystemPrompt?: string
    maxHistoryLength: number
    autoSave: boolean
    debugMode: boolean
    analytics: boolean
  }
}

export interface ConfigurationTemplate {
  id: string
  name: string
  description: string
  category: 'basic' | 'advanced' | 'enterprise' | 'custom'
  thumbnail?: string
  config: Partial<ChatConfiguration>
}

export interface ConfigurationVersion {
  id: string
  configId: string
  version: string
  changes: string
  createdAt: string
  config: ChatConfiguration
}

export interface ExportFormat {
  format: 'json' | 'typescript' | 'yaml' | 'url'
  includeMetadata: boolean
  prettify: boolean
}

export interface ImportResult {
  success: boolean
  config?: ChatConfiguration
  errors?: string[]
  warnings?: string[]
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}
