declare module '@clarity-chat/react' {
  import type { ComponentType } from 'react'

  export const StreamingMessage: ComponentType<any>
  export const ChatWindow: ComponentType<any>
  export const ModelSelector: ComponentType<any>
  export const allModels: Array<{ id: string; provider: string; name?: string }>
  export const ChatInput: ComponentType<any>
  export function getAdapter(provider: string): {
    stream: (messages: Array<{ role: string; content: string }>, config: any) => AsyncIterable<any>
    estimateCost: (usage: any, model: string) => number
  }
  export type ModelConfig = { provider: string; model: string; temperature?: number; maxTokens?: number; apiKey?: string }
  export type ChatMessage = { role: string; content: string }
}
