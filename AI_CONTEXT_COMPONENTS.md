# Clarity Chat - Component API Reference

**For AI Agents**: Comprehensive component API reference with TypeScript interfaces

---

## 📋 Table of Contents

1. [Core Chat Components](#core-chat-components)
2. [Context & Knowledge](#context--knowledge-components)
3. [Advanced Features](#advanced-features)
4. [Analytics & Monitoring](#analytics--monitoring)
5. [Error Handling](#error-handling)
6. [Enterprise Components](#enterprise-components)
7. [Interactive UI](#interactive-ui)
8. [Common Props Patterns](#common-props-patterns)

---

## Core Chat Components

### `<ChatWindow>`
**Complete chat interface with messages, input, and controls**

```typescript
interface ChatWindowProps {
  // Messages
  messages: Message[]
  
  // Callbacks
  onSend: (content: string) => void | Promise<void>
  onRetry?: (messageId: string) => void
  onClear?: () => void
  onExport?: (format: 'json' | 'txt' | 'md') => void
  
  // State
  isLoading?: boolean
  loadingMessage?: string
  
  // Features
  enableVoice?: boolean
  enableFileUpload?: boolean
  enableExport?: boolean
  enableSearch?: boolean
  
  // UI
  placeholder?: string
  className?: string
  theme?: Theme
}
```

**Usage**:
```typescript
<ChatWindow
  messages={messages}
  onSend={handleSend}
  isLoading={isLoading}
  enableVoice
  placeholder="Ask me anything..."
/>
```

---

### `<Message>`
**Display single message with markdown, code highlighting, and streaming**

```typescript
interface MessageProps {
  // Content
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  
  // State
  status?: 'pending' | 'sent' | 'error' | 'streaming'
  streaming?: boolean
  
  // Metadata
  timestamp?: Date
  metadata?: {
    model?: string
    tokens?: number
    duration?: number
    sources?: Citation[]
  }
  
  // Callbacks
  onRetry?: (id: string) => void
  onCopy?: (content: string) => void
  onEdit?: (id: string, newContent: string) => void
  onDelete?: (id: string) => void
  
  // UI
  showTimestamp?: boolean
  showStatus?: boolean
  showActions?: boolean
  className?: string
}
```

**Usage**:
```typescript
<Message
  id="msg-1"
  role="assistant"
  content="# Hello!\n\nI'm here to help."
  status="sent"
  showTimestamp
  onCopy={handleCopy}
/>
```

---

### `<ChatInput>`
**Simple text input with keyboard shortcuts**

```typescript
interface ChatInputProps {
  // Core
  value?: string
  onChange?: (value: string) => void
  onSend: (content: string) => void
  
  // State
  disabled?: boolean
  loading?: boolean
  
  // Features
  multiline?: boolean
  maxLength?: number
  minRows?: number
  maxRows?: number
  
  // UI
  placeholder?: string
  autoFocus?: boolean
  className?: string
  
  // Keyboard
  submitOnEnter?: boolean // default: true
  submitOnCtrlEnter?: boolean
}
```

**Usage**:
```typescript
<ChatInput
  onSend={handleSend}
  placeholder="Type a message..."
  multiline
  maxRows={5}
/>
```

---

### `<AdvancedChatInput>`
**Rich input with file upload, voice, and suggestions**

```typescript
interface AdvancedChatInputProps {
  // Core (extends ChatInputProps)
  onSend: (content: string, files?: File[]) => void
  
  // File upload
  onFileUpload?: (files: File[]) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // bytes
  maxFiles?: number
  
  // Voice input
  onVoiceInput?: (transcript: string) => void
  enableVoice?: boolean
  
  // Suggestions
  suggestions?: InputSuggestion[]
  onSuggestionClick?: (suggestion: InputSuggestion) => void
  
  // Features
  enableMentions?: boolean
  enableCommands?: boolean
  enableFormatting?: boolean
  
  // UI
  showFilePreview?: boolean
  showCharCount?: boolean
}

interface InputSuggestion {
  id: string
  text: string
  icon?: React.ReactNode
  category?: string
}
```

**Usage**:
```typescript
<AdvancedChatInput
  onSend={handleSend}
  onFileUpload={handleFileUpload}
  enableVoice
  acceptedFileTypes={['image/*', '.pdf', '.txt']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  suggestions={[
    { id: '1', text: 'Explain quantum computing' },
    { id: '2', text: 'Write a poem about AI' }
  ]}
/>
```

---

### `<MessageList>`
**Scrollable message feed with virtualization**

```typescript
interface MessageListProps {
  // Messages
  messages: Message[]
  
  // Callbacks
  onRetry?: (messageId: string) => void
  onLoadMore?: () => void | Promise<void>
  
  // Features
  virtualized?: boolean
  autoScroll?: boolean
  groupByDate?: boolean
  showAvatars?: boolean
  showTimestamps?: boolean
  
  // Loading
  isLoading?: boolean
  hasMore?: boolean
  loadingMessage?: string
  
  // UI
  className?: string
  height?: string | number
  emptyState?: React.ReactNode
}
```

**Usage**:
```typescript
<MessageList
  messages={messages}
  virtualized
  autoScroll
  groupByDate
  onLoadMore={fetchOlderMessages}
  hasMore={hasMoreMessages}
/>
```

---

### `<StreamingMessage>`
**Real-time streaming message display with typing effect**

```typescript
interface StreamingMessageProps {
  // Content
  content: string
  role?: 'assistant' | 'system'
  
  // State
  isStreaming: boolean
  
  // Callbacks
  onComplete?: (finalContent: string) => void
  onCancel?: () => void
  
  // Animation
  typingSpeed?: number // ms per character
  showCursor?: boolean
  cursorStyle?: 'block' | 'line' | 'underscore'
  
  // UI
  className?: string
  showStatus?: boolean
}
```

**Usage**:
```typescript
<StreamingMessage
  content={streamingContent}
  isStreaming={isStreaming}
  showCursor
  onCancel={cancelStream}
/>
```

---

### `<ModelSelector>`
**AI model picker with metadata**

```typescript
interface ModelSelectorProps {
  // Models
  models: ModelInfo[]
  value: string
  onChange: (modelId: string) => void
  
  // Display
  showDescription?: boolean
  showMetadata?: boolean // speed, cost, quality
  showProvider?: boolean
  
  // Grouping
  groupByProvider?: boolean
  
  // UI
  className?: string
  variant?: 'dropdown' | 'grid' | 'list'
}

interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string
  contextWindow: number
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'basic' | 'good' | 'excellent'
}
```

**Usage**:
```typescript
<ModelSelector
  models={availableModels}
  value={selectedModel}
  onChange={setSelectedModel}
  showMetadata
  groupByProvider
  variant="grid"
/>
```

---

### `<ThinkingIndicator>`
**Loading animation with status**

```typescript
interface ThinkingIndicatorProps {
  // Status
  status: AIStatus
  
  // Messages
  message?: string
  messages?: string[] // rotates through
  messageInterval?: number
  
  // Animation
  variant?: 'dots' | 'pulse' | 'wave' | 'spinner'
  size?: 'sm' | 'md' | 'lg'
  
  // Progress
  showProgress?: boolean
  progress?: number // 0-100
  
  // UI
  className?: string
}

interface AIStatus {
  state: 'idle' | 'thinking' | 'responding' | 'complete' | 'error'
  message?: string
  progress?: number
  startedAt?: Date
}
```

**Usage**:
```typescript
<ThinkingIndicator
  status={aiStatus}
  messages={[
    'Analyzing your question...',
    'Searching knowledge base...',
    'Generating response...'
  ]}
  variant="wave"
  showProgress
/>
```

---

## Context & Knowledge Components

### `<ContextManager>`
**Multi-document organizer with add/remove/toggle**

```typescript
interface ContextManagerProps {
  // Contexts
  contexts: Context[]
  
  // Callbacks
  onAdd: (context: Context) => void
  onRemove: (contextId: string) => void
  onToggle: (contextId: string) => void
  onEdit?: (contextId: string, updates: Partial<Context>) => void
  
  // Features
  enableSearch?: boolean
  enableFilters?: boolean
  enableDragDrop?: boolean
  
  // Limits
  maxContexts?: number
  maxTotalSize?: number // bytes
  
  // UI
  variant?: 'list' | 'grid' | 'compact'
  className?: string
}

interface Context {
  id: string
  projectId: string
  name: string
  content: string
  type: 'file' | 'url' | 'text' | 'code'
  metadata?: {
    size?: number
    mimeType?: string
    lastModified?: Date
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Usage**:
```typescript
<ContextManager
  contexts={contexts}
  onAdd={handleAddContext}
  onRemove={handleRemoveContext}
  onToggle={handleToggleContext}
  enableDragDrop
  maxContexts={10}
  variant="grid"
/>
```

---

### `<ContextCard>`
**Individual document card**

```typescript
interface ContextCardProps {
  // Context
  context: Context
  
  // State
  isActive: boolean
  isSelected?: boolean
  
  // Callbacks
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  
  // Display
  showPreview?: boolean
  showMetadata?: boolean
  showActions?: boolean
  
  // UI
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
}
```

**Usage**:
```typescript
<ContextCard
  context={context}
  isActive={context.isActive}
  onToggle={handleToggle}
  onRemove={handleRemove}
  showPreview
  showMetadata
/>
```

---

### `<ContextVisualizer>`
**Visual context map showing relationships**

```typescript
interface ContextVisualizerProps {
  // Contexts
  contexts: Context[]
  messages?: ContextMessage[]
  
  // Interactions
  onContextClick?: (contextId: string) => void
  onMessageClick?: (messageId: string) => void
  
  // Display
  showConnections?: boolean
  showUsageStats?: boolean
  layout?: 'tree' | 'force' | 'circular'
  
  // UI
  height?: string | number
  className?: string
}

interface ContextMessage {
  id: string
  content: string
  contextIds: string[]
  timestamp: Date
}
```

**Usage**:
```typescript
<ContextVisualizer
  contexts={contexts}
  messages={messages}
  showConnections
  showUsageStats
  layout="force"
  height={400}
/>
```

---

## Advanced Features

### `<FileUpload>`
**Drag & drop file upload with preview**

```typescript
interface FileUploadProps {
  // Callbacks
  onFileUpload: (files: File[]) => void | Promise<void>
  onFileRemove?: (fileId: string) => void
  
  // Constraints
  accept?: string[]
  maxFiles?: number
  maxFileSize?: number // bytes
  minFileSize?: number
  
  // Features
  multiple?: boolean
  disabled?: boolean
  
  // Preview
  showPreview?: boolean
  showProgress?: boolean
  
  // Validation
  validator?: (file: File) => boolean | string // true or error message
  
  // UI
  className?: string
  dropzoneText?: string
  dragActiveText?: string
}
```

**Usage**:
```typescript
<FileUpload
  onFileUpload={handleUpload}
  accept={['image/*', '.pdf', '.txt']}
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024}
  multiple
  showPreview
  showProgress
/>
```

---

### `<VoiceInput>`
**Speech-to-text input with visual feedback**

```typescript
interface VoiceInputProps {
  // Callbacks
  onTranscript: (transcript: string) => void
  onError?: (error: Error) => void
  onStart?: () => void
  onEnd?: () => void
  
  // Settings
  language?: string // 'en-US', 'es-ES', etc.
  continuous?: boolean
  interimResults?: boolean
  
  // UI
  variant?: 'button' | 'icon' | 'fab'
  size?: 'sm' | 'md' | 'lg'
  showWaveform?: boolean
  showTranscript?: boolean
  className?: string
}
```

**Usage**:
```typescript
<VoiceInput
  onTranscript={handleTranscript}
  language="en-US"
  continuous={false}
  showWaveform
  variant="fab"
/>
```

---

### `<MessageSearch>`
**Search message history with filters**

```typescript
interface MessageSearchProps {
  // Messages
  messages: Message[]
  
  // Callbacks
  onSearch: (query: string, filters: SearchFilters) => void
  onResultClick: (messageId: string) => void
  
  // Filters
  filters?: SearchFilters
  showFilters?: boolean
  
  // Features
  enableHighlight?: boolean
  enableRegex?: boolean
  caseSensitive?: boolean
  
  // UI
  placeholder?: string
  className?: string
}

interface SearchFilters {
  role?: 'user' | 'assistant' | 'system'
  dateFrom?: Date
  dateTo?: Date
  hasAttachments?: boolean
  status?: MessageStatus
}
```

**Usage**:
```typescript
<MessageSearch
  messages={messages}
  onSearch={handleSearch}
  onResultClick={scrollToMessage}
  showFilters
  enableHighlight
/>
```

---

### `<FollowUpSuggestions>`
**AI-powered suggestion chips**

```typescript
interface FollowUpSuggestionsProps {
  // Suggestions
  suggestions: FollowUpSuggestion[]
  
  // Callbacks
  onSuggestionClick: (suggestion: FollowUpSuggestion) => void
  onRefresh?: () => void
  
  // Display
  maxSuggestions?: number
  variant?: 'chips' | 'list' | 'grid'
  
  // Animation
  animate?: boolean
  stagger?: boolean
  
  // UI
  className?: string
  loading?: boolean
}

interface FollowUpSuggestion {
  id: string
  text: string
  category?: string
  confidence?: number
  icon?: React.ReactNode
}
```

**Usage**:
```typescript
<FollowUpSuggestions
  suggestions={suggestions}
  onSuggestionClick={handleSuggestionClick}
  maxSuggestions={4}
  variant="chips"
  animate
  stagger
/>
```

---

## Common Props Patterns

### Standard Component Props
```typescript
// Most components accept these
interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  id?: string
  'data-testid'?: string
}
```

### Callback Props
```typescript
// Common callback patterns
onSend: (content: string) => void | Promise<void>
onClick: (id: string) => void
onChange: (value: T) => void
onError: (error: Error) => void
onSuccess: (result: T) => void
```

### State Props
```typescript
// Common state patterns
loading?: boolean
disabled?: boolean
error?: Error | string
success?: boolean
```

### Display Props
```typescript
// Common display options
variant?: 'default' | 'outline' | 'ghost'
size?: 'sm' | 'md' | 'lg'
fullWidth?: boolean
className?: string
```

---

## Props Naming Conventions

| Pattern | Example | Description |
|---------|---------|-------------|
| `on*` | `onSend`, `onClick` | Callbacks/handlers |
| `is*` | `isLoading`, `isActive` | Boolean state |
| `has*` | `hasError`, `hasMore` | Boolean conditions |
| `show*` | `showTimestamp`, `showActions` | Display toggles |
| `enable*` | `enableVoice`, `enableSearch` | Feature toggles |
| `max*` / `min*` | `maxFiles`, `minLength` | Limits |

---

**Total Components**: 70+  
**All Components**: Fully typed with TypeScript  
**Pattern**: Consistent prop naming across all components  

For complete list of all 70+ components, see main exports in `packages/react/src/index.ts`

---

_This API reference provides comprehensive component documentation for AI agents._

