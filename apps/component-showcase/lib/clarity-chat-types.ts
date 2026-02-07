/**
 * Local type definitions matching @clarity-chat/react provider types.
 *
 * These mirror the canonical types in:
 * - packages/react/src/providers/ClarityChatProvider.tsx
 * - packages/react/src/adapters/types.ts
 *
 * They are defined locally because the dev-mode tsup config has `dts: false`
 * (sandbox memory constraint). The production build (`tsup.config.production.ts`)
 * enables .d.ts generation, which would make this file unnecessary.
 *
 * TODO: Once deployed with production build, delete this file and import
 * types directly from '@clarity-chat/react'.
 */

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error'

export interface MessageAttachment {
  id: string
  name: string
  type: string
  size?: number
  url?: string
  previewUrl?: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
  status: MessageStatus
  attachments?: MessageAttachment[]
  metadata?: Record<string, unknown>
}

export interface ThinkingStep {
  id: string
  content: string
  status: 'pending' | 'active' | 'complete'
  timestamp: Date
}

export interface StreamStatus {
  isStreaming: boolean
  phase:
    | 'idle'
    | 'connecting'
    | 'receiving'
    | 'processing'
    | 'complete'
    | 'error'
  progress: number
  tokensUsed: number
  tokensTotal?: number
  startedAt?: Date
  estimatedCompletion?: Date
  error?: string
}

export interface ToolExecution {
  id: string
  callId: string
  name: string
  description?: string
  arguments: Record<string, unknown>
  status: 'pending' | 'approved' | 'rejected' | 'running' | 'complete' | 'error'
  result?: unknown
  error?: string
  requiresApproval: boolean
  startedAt?: Date
  completedAt?: Date
}

export interface ChatConfig {
  model?: string
  provider?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  streaming?: boolean
}

export interface ChatAdapter {
  sendMessage: (
    content: string,
    attachments?: MessageAttachment[]
  ) => Promise<void>
  stopGeneration: () => void
  regenerate: (messageId?: string) => Promise<void>
  approveTool?: (toolId: string) => Promise<void>
  rejectTool?: (toolId: string, reason?: string) => Promise<void>
  getMessages: () => ChatMessage[]
  getStreamStatus: () => StreamStatus
  getActiveTools: () => ToolExecution[]
  getThinkingSteps: () => ThinkingStep[]
  subscribe: (callback: () => void) => () => void
  setConfig?: (config: Partial<ChatConfig>) => void
}

/** Context value returned by useClarityChatContext / useClarityChat (provider) */
export interface ClarityChatContextValue {
  messages: ChatMessage[]
  streamStatus: StreamStatus
  activeTools: ToolExecution[]
  thinkingSteps: ThinkingStep[]
  config: ChatConfig
  isStreaming: boolean
  isThinking: boolean
  lastMessage: ChatMessage | null
  streamingMessage: ChatMessage | null
  sendMessage: (
    content: string,
    attachments?: MessageAttachment[]
  ) => Promise<void>
  stopGeneration: () => void
  regenerate: (messageId?: string) => Promise<void>
  clearMessages: () => void
  adapter: ChatAdapter | null
}
