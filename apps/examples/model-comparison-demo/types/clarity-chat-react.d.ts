declare module '@clarity-chat/react' {
  import type { ComponentType } from 'react'

  export const ModelSelector: ComponentType<any>
  export const StreamingMessage: ComponentType<any>
  export const allModels: Array<{ id: string; provider: string; name?: string }>
  export type ModelMetadata = { id: string; provider: string; name?: string }
  export type ChatMessage = { role: string; content: string }
  export type ModelConfig = { provider: string; model: string; temperature?: number; maxTokens?: number }
}
