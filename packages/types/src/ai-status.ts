/**
 * AI Status type definitions
 */

export type AIStage = 'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'

export interface AIStatus {
  stage: AIStage
  topic?: string
  progress?: number
  startedAt: Date
  estimatedCompletion?: Date
}

export interface AIResearchTopic {
  name: string
  confidence: number
  sources: string[]
}

export interface AIProcessingStep {
  id: string
  stage: AIStage
  description: string
  duration?: number
  completed: boolean
  timestamp: Date
}

export interface AICapabilities {
  canGenerateImages: boolean
  canAnalyzeFiles: boolean
  canAccessWeb: boolean
  canExecuteCode: boolean
  supportedLanguages: string[]
  maxTokens: number
}

export interface AIModel {
  id: string
  name: string
  provider: string
  capabilities: AICapabilities
  costPerToken: number
}
