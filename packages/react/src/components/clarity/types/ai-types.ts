import React from 'react'
// Core AI Chat Types

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export type MessageStatus =
  | 'pending'
  | 'streaming'
  | 'complete'
  | 'error'
  | 'cancelled'

export interface Attachment {
  id: string
  type: 'image' | 'file' | 'audio' | 'video' | 'code'
  name: string
  url?: string
  size?: number
  mimeType?: string
  preview?: string
}

export interface Citation {
  id: string
  title: string
  url: string
  snippet?: string
  favicon?: string
  domain?: string
}

export interface ToolCall {
  id: string
  name: string
  arguments?: Record<string, unknown>
  args?: Record<string, unknown>
  status: 'pending' | 'running' | 'complete' | 'error'
  result?: unknown
  error?: string
  startedAt?: Date
  completedAt?: Date
}

export interface ThinkingStep {
  id: string
  type: 'thinking' | 'planning' | 'searching' | 'analyzing' | 'writing'
  content: string
  status: 'active' | 'complete'
  duration?: number
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  createdAt?: Date
  timestamp?: Date
  status?: MessageStatus
  attachments?: Attachment[]
  citations?: Citation[]
  toolCalls?: ToolCall[]
  thinkingSteps?: ThinkingStep[]
  parentId?: string
  branchId?: string
  metadata?: Record<string, unknown>
  model?: string
  tokenCount?: {
    input: number
    output: number
    total: number
  }
}

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  model: string
  systemPrompt?: string
  metadata?: Record<string, unknown>
  checkpoints?: Checkpoint[]
  branches?: Branch[]
}

export interface Checkpoint {
  id: string
  name: string
  messageId: string
  createdAt: Date
  description?: string
}

export interface Branch {
  id: string
  name: string
  parentMessageId: string
  createdAt: Date
  messages: Message[]
}

export interface Project {
  id: string
  name: string
  description?: string
  conversations: Conversation[]
  sharedContext?: string
  createdAt: Date
  updatedAt: Date
}

export interface Model {
  id: string
  name: string
  provider: string
  description?: string
  contextWindow: number
  maxOutput: number
  capabilities: ModelCapability[]
  pricing?: {
    input: number
    output: number
  }
}

export type ModelCapability =
  | 'text'
  | 'vision'
  | 'code'
  | 'function-calling'
  | 'streaming'
  | 'reasoning'

export interface MCPServer {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'error'
  tools?: MCPTool[]
  resources?: MCPResource[]
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface MCPResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface Plugin {
  id: string
  name: string
  description: string
  version: string
  enabled: boolean
  icon?: string
  settings?: Record<string, unknown>
}

export interface PromptTemplate {
  id: string
  name: string
  content: string
  variables: PromptVariable[]
  category?: string
  tags?: string[]
}

export interface PromptVariable {
  name: string
  type: 'text' | 'number' | 'select' | 'boolean'
  default?: string | number | boolean
  options?: string[]
  required?: boolean
}

export interface QueueItem {
  id: string
  type: 'message' | 'task' | 'todo'
  content: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  priority: number
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'complete' | 'blocked'
  subtasks?: Task[]
  assignedTo?: string
  dueDate?: Date
}

export interface Agent {
  id: string
  name: string
  description: string
  avatar?: string
  systemPrompt: string
  tools: string[]
  model: string
  status: 'idle' | 'running' | 'paused' | 'error'
}

export interface Artifact {
  id: string
  type: 'code' | 'document' | 'image' | 'diagram' | 'canvas'
  title: string
  content: string
  language?: string
  createdAt: Date
  updatedAt: Date
}

export interface WebSearchResult {
  id: string
  title: string
  url: string
  snippet: string
  favicon?: string
  publishedAt?: Date
}

export interface TokenUsage {
  used: number
  limit: number
  percentage: number
}

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  path: string
  children?: FileNode[]
  language?: string
  size?: number
  modified?: Date
}

export interface TestResult {
  id: string
  name: string
  status: 'passed' | 'failed' | 'skipped' | 'running'
  duration?: number
  error?: string
  stackTrace?: string
}

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string[]
  action: () => void
  category?: string
}

export interface SlashCommand {
  name: string
  description: string
  icon?: React.ReactNode
  action: (args?: string) => void
}

export interface MentionItem {
  id: string
  label: string
  type: 'file' | 'user' | 'tool' | 'prompt' | 'context'
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
}
