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

// Streaming simulation utility
export function simulateStreaming(
  text: string,
  onChunk: (text: string) => void,
  onComplete: () => void,
  speed = 15
): () => void {
  let index = 0
  const interval = setInterval(() => {
    if (index < text.length) {
      // Stream 1-3 characters at a time for more natural feel
      const chunkSize = Math.min(
        1 + Math.floor(Math.random() * 2),
        text.length - index
      )
      onChunk(text.slice(index, index + chunkSize))
      index += chunkSize
    } else {
      clearInterval(interval)
      onComplete()
    }
  }, speed)
  return () => clearInterval(interval)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateCost(tokens: number, costPer1k: number): string {
  return `$${((tokens / 1000) * costPer1k).toFixed(4)}`
}

// Escape HTML entities to prevent XSS when rendering user content
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
