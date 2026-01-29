/**
 * PromptComposer Types
 *
 * Type definitions for the PromptComposer system including
 * context items, token budgets, and progressive disclosure.
 */

// ============================================================================
// Context Item Types
// ============================================================================

export type ContextType = 'file' | 'doc' | 'user' | 'web' | 'memory'

export interface ContextTokenBudget {
  summary: number // Initial lightweight summary (50 tokens)
  preview: number // Medium-detail preview (200 tokens)
  full: number // Full content (only on explicit request)
}

export interface ContextItem {
  id: string
  type: ContextType
  label: string
  description?: string
  icon?: React.ReactNode

  // Progressive detail levels
  summary: string // Always sent (50 tokens max)
  preview?: string // Sent on hover/focus (200 tokens max)
  full?: string // Only sent when explicitly needed

  // Token tracking
  tokens: {
    summary: number
    preview: number
    full: number
  }

  // Smart expansion
  autoExpand?: boolean // AI decides if full context needed
  relevance?: number // 0-1 relevance score
  priority?: number // 0-100 priority for display order

  // Metadata
  metadata?: Record<string, unknown>
  lastAccessed?: number
}

export interface ContextRelevanceScore {
  item: ContextItem
  score: number // 0-1
  reason: string
}

// ============================================================================
// Context Provider Types
// ============================================================================

export interface ContextProvider {
  type: ContextType
  search: (query: string) => Promise<ContextItem[]>
  icon?: React.ReactNode
  priority?: number
  enabled?: boolean
  maxResults?: number
}

export interface ContextConfig {
  triggers: string[] // ['@', '#']
  providers: ContextProvider[]
  fuzzySearch?: boolean
  maxResults?: number
}

// ============================================================================
// Command Types
// ============================================================================

export interface Command {
  id: string
  trigger: string // '/search', '/code', etc
  label: string
  description: string
  icon: React.ReactNode
  category?: string
  available?: boolean | (() => boolean)
  execute: (args?: string) => void | Promise<void>
  shortcut?: string
}

export interface CommandsConfig {
  commands: Command[]
  categories?: CommandCategory[]
  fuzzySearch?: boolean
}

export interface CommandCategory {
  id: string
  label: string
  icon?: React.ReactNode
  priority?: number
}

// ============================================================================
// Suggestion Types
// ============================================================================

export type SuggestionType = 'starter' | 'continuation' | 'template' | 'smart'

export interface Suggestion {
  id: string
  type: SuggestionType
  text: string
  description?: string
  icon?: React.ReactNode
  category?: string
  confidence?: number // For smart suggestions (0-1)
  metadata?: Record<string, unknown>
}

export interface SuggestionSource {
  type: SuggestionType
  generate: (context: SuggestionContext) => Promise<Suggestion[]>
  priority?: number
}

export interface SuggestionContext {
  value: string // Current input
  history: Message[] // Conversation history
  attachments: Attachment[] // Current attachments
  contextItems: ContextItem[] // @mentions
  userProfile?: UserProfile // User preferences/patterns
}

export interface SuggestionsConfig {
  sources: SuggestionSource[]
  maxSuggestions?: number
  showOnEmpty?: boolean
  enableSmart?: boolean // AI-powered suggestions
}

// ============================================================================
// Attachment Types
// ============================================================================

export type AttachmentType = 'image' | 'document' | 'code' | 'url'

export interface Attachment {
  id: string
  type: AttachmentType
  name: string
  size: number
  url: string
  preview?: string
  metadata?: Record<string, unknown>
}

export interface AttachmentsConfig {
  maxFiles?: number
  maxSize?: number // bytes
  acceptedTypes?: string[]
  enableDragDrop?: boolean
  enablePaste?: boolean
  uploadHandler?: (file: File) => Promise<Attachment>
}

// ============================================================================
// Settings Types
// ============================================================================

export interface PromptSettings {
  autoComplete: boolean
  streaming: boolean
  showHistory: boolean
  showShortcuts: boolean
  enableMarkdown: boolean
  submitOnEnter: boolean // vs Shift+Enter
  theme: 'light' | 'dark' | 'auto'
}

// ============================================================================
// State Types
// ============================================================================

export type PromptState =
  | 'collapsed' // Initial: Single line, minimal chrome
  | 'focused' // User clicked: Show suggestions
  | 'typing' // User typing: Hide suggestions, show commands on /
  | 'expanding' // Content growing: Transition to multiline
  | 'expanded' // Multiline: Show all features
  | 'with-context' // Context added: Show token budget
  | 'submitting' // Sending: Show loading state

export interface PromptComposerState {
  // Input state
  value: string
  cursorPosition: number
  isExpanded: boolean
  isFocused: boolean
  currentState: PromptState

  // Feature states (progressive disclosure)
  showSuggestions: boolean
  showCommands: boolean
  showContext: boolean
  showSettings: boolean

  // Content state
  attachments: Attachment[]
  contextItems: ContextItem[]
  activeCommand: Command | null
  selectedSuggestion: Suggestion | null

  // Token state
  totalTokens: number
  tokenBudget: number
  tokenUsage: number // 0-1 (totalTokens / tokenBudget)

  // UI state
  isSubmitting: boolean
  error: Error | null
}

// ============================================================================
// Action Types
// ============================================================================

export interface PromptComposerActions {
  // Input actions
  setValue: (value: string) => void
  clear: () => void
  focus: () => void
  blur: () => void

  // Feature toggles
  toggleSuggestions: () => void
  toggleCommands: () => void
  toggleSettings: () => void

  // Content actions
  addAttachment: (file: File) => Promise<Attachment>
  removeAttachment: (id: string) => void
  addContext: (item: ContextItem) => void
  removeContext: (id: string) => void
  expandContext: (id: string, level: 'preview' | 'full') => void
  executeCommand: (command: Command) => void
  applySuggestion: (suggestion: Suggestion) => void

  // Submit
  submit: () => Promise<void>
  cancel: () => void
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface PromptComposerConfig {
  api: string

  // Feature flags (progressive disclosure)
  features?: {
    suggestions?: boolean | SuggestionsConfig
    commands?: boolean | CommandsConfig
    context?: boolean | ContextConfig
    attachments?: boolean | AttachmentsConfig
    settings?: boolean | Partial<PromptSettings>
  }

  // Token optimization
  tokenBudget?: number // Default: 8000
  tokenBudgets?: Record<ContextType, ContextTokenBudget>

  // Behavior
  behavior?: {
    autoSubmit?: boolean
    expandOnFocus?: boolean
    showShortcuts?: boolean
    enableMarkdown?: boolean
    expandThreshold?: number // Characters before expanding (default: 100)
  }

  // Integrations
  onSubmit?: (message: PromptMessage) => void | Promise<void>
  onStateChange?: (state: PromptComposerState) => void
  onTokenUsageChange?: (usage: number) => void
}

// ============================================================================
// Message Types
// ============================================================================

export interface PromptMessage {
  content: string
  contextItems: ContextItem[]
  attachments: Attachment[]
  metadata?: {
    command?: Command
    suggestion?: Suggestion
    totalTokens: number
    timestamp: number
  }
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface UserProfile {
  commonPrompts: string[]
  preferences: Partial<PromptSettings>
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UsePromptComposerReturn {
  state: PromptComposerState
  actions: PromptComposerActions
  ref: React.RefObject<HTMLTextAreaElement>
}

// ============================================================================
// Default Budgets
// ============================================================================

export const DEFAULT_TOKEN_BUDGETS: Record<ContextType, ContextTokenBudget> = {
  file: {
    summary: 50, // "Button.tsx - 250 lines, exports 3 components"
    preview: 200, // Show exports, types, key functions
    full: 5000, // Full file content
  },
  doc: {
    summary: 30, // "API Reference: Authentication"
    preview: 150, // Show headings and key sections
    full: 3000,
  },
  user: {
    summary: 20, // "@john - Senior Engineer"
    preview: 100, // Recent activity, expertise
    full: 500,
  },
  web: {
    summary: 40,
    preview: 200,
    full: 4000,
  },
  memory: {
    summary: 30,
    preview: 150,
    full: 2000,
  },
}

export const DEFAULT_PRIORITY: Record<ContextType, number> = {
  file: 80, // Files most relevant for coding
  doc: 60, // Docs second
  user: 40, // Users third
  web: 20, // Web searches last (expensive)
  memory: 50, // Conversation memory middle
}
