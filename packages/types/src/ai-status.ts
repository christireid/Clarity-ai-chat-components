/**
 * AI Status type definitions
 *
 * This module contains types for tracking AI processing status,
 * capabilities, and model information.
 *
 * @packageDocumentation
 */

/**
 * Stage of AI processing.
 *
 * @remarks
 * - `thinking`: Initial processing and understanding
 * - `researching`: Gathering additional information
 * - `compiling`: Organizing and structuring response
 * - `generating`: Creating the response text
 * - `finalizing`: Final formatting and checks
 */
export type AIStage =
  | 'thinking'
  | 'researching'
  | 'compiling'
  | 'generating'
  | 'finalizing'

/**
 * Current AI processing status.
 *
 * @remarks
 * Provides real-time status information during AI response generation,
 * useful for displaying progress indicators to users.
 *
 * @example
 * ```typescript
 * const status: AIStatus = {
 *   stage: 'generating',
 *   topic: 'TypeScript best practices',
 *   progress: 0.65,
 *   startedAt: new Date(),
 *   estimatedCompletion: new Date(Date.now() + 5000),
 * }
 * ```
 */
export interface AIStatus {
  /** Current processing stage */
  stage: AIStage
  /** Topic or context being processed */
  topic?: string
  /** Progress percentage (0-1) */
  progress?: number
  /** When processing started */
  startedAt: Date
  /** Estimated completion time */
  estimatedCompletion?: Date
}

/**
 * Research topic being explored by the AI.
 *
 * @example
 * ```typescript
 * const topic: AIResearchTopic = {
 *   name: 'React Server Components',
 *   confidence: 0.92,
 *   sources: ['React documentation', 'Vercel blog'],
 * }
 * ```
 */
export interface AIResearchTopic {
  /** Topic name */
  name: string
  /** Confidence score (0-1) in information accuracy */
  confidence: number
  /** Sources consulted */
  sources: string[]
}

/**
 * Individual step in AI processing.
 *
 * @remarks
 * Provides detailed tracking of each processing step,
 * useful for debugging and transparency.
 *
 * @example
 * ```typescript
 * const step: AIProcessingStep = {
 *   id: 'step-1',
 *   stage: 'researching',
 *   description: 'Searching knowledge base',
 *   duration: 1500,
 *   completed: true,
 *   timestamp: new Date(),
 * }
 * ```
 */
export interface AIProcessingStep {
  /** Step identifier */
  id: string
  /** Processing stage */
  stage: AIStage
  /** Human-readable description */
  description: string
  /** Duration in milliseconds */
  duration?: number
  /** Whether the step is complete */
  completed: boolean
  /** When the step occurred */
  timestamp: Date
}

/**
 * AI model capabilities.
 *
 * @remarks
 * Describes what features an AI model supports,
 * used for capability detection and feature flags.
 *
 * @example
 * ```typescript
 * const capabilities: AICapabilities = {
 *   canGenerateImages: true,
 *   canAnalyzeFiles: true,
 *   canAccessWeb: false,
 *   canExecuteCode: true,
 *   supportedLanguages: ['en', 'es', 'fr', 'de'],
 *   maxTokens: 128000,
 * }
 * ```
 */
export interface AICapabilities {
  /** Can generate images */
  canGenerateImages: boolean
  /** Can analyze uploaded files */
  canAnalyzeFiles: boolean
  /** Can access web/internet */
  canAccessWeb: boolean
  /** Can execute code */
  canExecuteCode: boolean
  /** Supported language codes */
  supportedLanguages: string[]
  /** Maximum token context window */
  maxTokens: number
}

/**
 * AI model information.
 *
 * @example
 * ```typescript
 * const model: AIModel = {
 *   id: 'gpt-4-turbo',
 *   name: 'GPT-4 Turbo',
 *   provider: 'OpenAI',
 *   capabilities: {
 *     canGenerateImages: false,
 *     canAnalyzeFiles: true,
 *     canAccessWeb: false,
 *     canExecuteCode: false,
 *     supportedLanguages: ['en'],
 *     maxTokens: 128000,
 *   },
 *   costPerToken: 0.00001,
 * }
 * ```
 */
export interface AIModel {
  /** Model identifier */
  id: string
  /** Display name */
  name: string
  /** Provider name (OpenAI, Anthropic, etc.) */
  provider: string
  /** Model capabilities */
  capabilities: AICapabilities
  /** Cost per token in USD */
  costPerToken: number
}
