/**
 * Type declarations for @clarity-chat/react
 *
 * These are intentionally minimal stub types for example/demo purposes.
 * The actual @clarity-chat/react package provides full type definitions.
 *
 * @packageDocumentation
 */
declare module '@clarity-chat/react' {
  import type { ComponentType, ReactNode } from 'react'

  // ==========================================================================
  // Core Components
  // ==========================================================================

  export interface StreamingMessageProps {
    content: string
    isStreaming?: boolean
    role?: 'user' | 'assistant' | 'system'
    className?: string
  }
  export const StreamingMessage: ComponentType<StreamingMessageProps>

  export interface ChatWindowProps {
    messages?: ChatMessage[]
    isLoading?: boolean
    error?: Error | null
    className?: string
    children?: ReactNode
    enableAnimations?: boolean
    updateInterval?: number
  }
  export const ChatWindow: ComponentType<ChatWindowProps>

  export interface ModelSelectorProps {
    value?: string
    onChange?: (modelId: string) => void
    models?: ModelInfo[]
    className?: string
  }
  export const ModelSelector: ComponentType<ModelSelectorProps>

  export interface ChatInputProps {
    onSendMessage?: (content: string) => void | Promise<void>
    disabled?: boolean
    placeholder?: string
    className?: string
  }
  export const ChatInput: ComponentType<ChatInputProps>

  // ==========================================================================
  // Types
  // ==========================================================================

  export interface ModelInfo {
    id: string
    provider: string
    name?: string
    contextWindow?: number
    maxTokens?: number
  }
  export const allModels: ModelInfo[]

  export interface ModelConfig {
    provider: string
    model: string
    temperature?: number
    maxTokens?: number
    apiKey?: string
  }

  export interface ChatMessage {
    id?: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: number
    status?: 'pending' | 'streaming' | 'complete' | 'error'
  }

  export interface StreamChunk {
    content?: string
    done?: boolean
    error?: string
  }

  export interface UsageInfo {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }

  // ==========================================================================
  // Adapter
  // ==========================================================================

  export interface StreamConfig {
    model: string
    temperature?: number
    maxTokens?: number
    apiKey?: string
  }

  export interface ProviderAdapter {
    stream: (
      messages: ChatMessage[],
      config: StreamConfig
    ) => AsyncIterable<StreamChunk>
    estimateCost: (usage: UsageInfo, model: string) => number
  }

  export function getAdapter(provider: string): ProviderAdapter
}
