export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tools?: ToolExecution[]
  thinking?: ThinkingStep[]
  citations?: Citation[]
  status?: 'pending' | 'streaming' | 'complete' | 'error'
  isDraft?: boolean
  isArchived?: boolean
  isPinned?: boolean
}

export interface ToolExecution {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  input?: string
  output?: string
  duration?: string
}

export interface ThinkingStep {
  id: string
  content: string
  timestamp: Date
}

export interface Citation {
  id: string
  title: string
  url: string
  snippet: string
}

export interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}
