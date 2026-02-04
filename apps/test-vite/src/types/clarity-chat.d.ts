/**
 * Type declarations for workspace packages
 * These are used during development when .d.ts files are not generated
 *
 * Note: This is a test app for validating Vite integration.
 * Full type definitions are validated in the main packages.
 */

declare module '@clarity-chat/react' {
  import { ReactNode, FC } from 'react'

  // Primary Hook - useClarityChat
  export interface UseClarityChatOptions {
    apiKey?: string
    model?: string
    systemPrompt?: string
    apiEndpoint?: string
    maxTokens?: number
    temperature?: number
    topP?: number
    onError?: (error: Error) => void
    onMessage?: (message: ChatMessage) => void
    initialMessages?: ChatMessage[]
  }

  export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    createdAt?: Date | number
    metadata?: Record<string, unknown>
  }

  export interface UseClarityChatReturn {
    messages: ChatMessage[]
    sendMessage: (content: string) => Promise<void>
    isLoading: boolean
    error: Error | null
    clearMessages: () => void
    regenerate: () => Promise<void>
    stopGeneration: () => void
  }

  export function useClarityChat(
    options?: UseClarityChatOptions
  ): UseClarityChatReturn

  // ClarityChatApp component
  export interface ClarityChatAppProps {
    api: string
    preset?: 'default' | 'minimal' | 'enterprise'
    features?: {
      memory?: boolean
      streaming?: boolean
      markdown?: boolean
    }
    className?: string
    children?: ReactNode
  }

  export const ClarityChatApp: FC<ClarityChatAppProps>
}

declare module '@clarity-chat/react/*' {
  const content: unknown
  export default content
}

declare module '@clarity-chat/primitives' {
  export function cn(...inputs: unknown[]): string
  export const Button: unknown
  export const Card: unknown
  export const Input: unknown
}

declare module '@clarity-chat/primitives/*' {
  const content: unknown
  export default content
}
