// Shared types for all advanced demos
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tools?: ToolExecution[]
  thinking?: ThinkingStep[]
  citations?: Citation[]
  sources?: Source[]
  artifacts?: ArtifactRef[]
  status?: 'sending' | 'streaming' | 'sent' | 'delivered' | 'error'
  isEditing?: boolean
  feedback?: 'up' | 'down' | null
  attachments?: FileAttachment[]
}

export interface ToolExecution {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  duration?: string
  icon?: string
}

export interface ThinkingStep {
  id: string
  content: string
  timestamp: Date
}

export interface Citation {
  id: string
  title: string
  url?: string
  snippet: string
  type?: 'library' | 'web' | 'academic' | 'documentation' | 'news'
  relevance?: number
}

export interface Source {
  id: string
  title: string
  url: string
  favicon?: string
  excerpt: string
  type: 'academic' | 'web' | 'documentation' | 'news' | 'forum'
  relevance: number
}

export interface ArtifactRef {
  id: string
  title: string
  type: ArtifactType
  version: number
}

export type ArtifactType =
  | 'code'
  | 'document'
  | 'html'
  | 'svg'
  | 'mermaid'
  | 'table'
  | 'json'

export interface Artifact {
  id: string
  title: string
  type: ArtifactType
  content: string
  language?: string
  versions: ArtifactVersion[]
  createdAt: Date
  updatedAt: Date
}

export interface ArtifactVersion {
  id: string
  content: string
  timestamp: Date
  label?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  context?: string
  artifactCount?: number
}

export interface ModelProvider {
  id: string
  name: string
  icon: string
  models: ModelOption[]
}

export interface ModelOption {
  id: string
  name: string
  description: string
  contextWindow: number
  costPer1kInput: number
  costPer1kOutput: number
}

export interface SavedPrompt {
  id: string
  text: string
  label?: string
  category?: string
}

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  content?: string
}

export interface MCPServer {
  id: string
  name: string
  endpoint: string
  authToken?: string
  status: 'connected' | 'disconnected' | 'error' | 'connecting'
  enabled: boolean
  tools: string[]
}

export interface MemorySettings {
  enabled: boolean
  strategy: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens: number
  usage: number
  rememberFindings?: boolean
  crossReference?: boolean
  trackPatterns?: boolean
  rememberPreferences?: boolean
}

export interface TokenSettings {
  optimizationEnabled: boolean
  techniques: {
    compression: boolean
    summarization: boolean
    pruning: boolean
  }
  budget: number
  used: { input: number; output: number; total: number }
  showExpenditure: boolean
}

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: 'O',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most capable',
        contextWindow: 128000,
        costPer1kInput: 0.005,
        costPer1kOutput: 0.015,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Fast & powerful',
        contextWindow: 128000,
        costPer1kInput: 0.01,
        costPer1kOutput: 0.03,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast & affordable',
        contextWindow: 16385,
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'A',
    models: [
      {
        id: 'claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Best balance',
        contextWindow: 200000,
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most powerful',
        contextWindow: 200000,
        costPer1kInput: 0.015,
        costPer1kOutput: 0.075,
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'Fastest',
        contextWindow: 200000,
        costPer1kInput: 0.00025,
        costPer1kOutput: 0.00125,
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'G',
    models: [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Fast & efficient',
        contextWindow: 1048576,
        costPer1kInput: 0.0001,
        costPer1kOutput: 0.0004,
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Advanced reasoning',
        contextWindow: 2097152,
        costPer1kInput: 0.00125,
        costPer1kOutput: 0.005,
      },
    ],
  },
]

// Import utilities from library packages for local use and re-export
import { generateId, formatBytes } from '@clarity-chat/utils'
export { generateId }
export { formatBytes as formatFileSize }

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Minimal message shape returned by useClarityChat.
 * The package dist lacks generated .d.ts declarations, so we define the shape
 * here once instead of repeating it in each demo page.
 */
export interface HookMessage {
  id?: string
  role: string
  content: string | unknown
}

/** Safely extract string content from a HookMessage. */
export function getTextContent(content: string | unknown): string {
  return typeof content === 'string' ? content : ''
}

/** Shared markdown renderer configuration used by all demo pages. */
export const MARKDOWN_CONFIG = {
  enableSyntaxHighlight: true,
  codeTheme: 'dark' as const,
  enableCopyButton: true,
}

/** Factory for creating a new conversation with the given title. */
export function createConversation(title: string): Conversation {
  return {
    id: generateId(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
