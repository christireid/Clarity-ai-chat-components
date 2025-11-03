# Clarity Chat - TypeScript Type Reference

**For AI Agents**: Complete TypeScript type definitions reference

---

## 📋 Core Types

### Message
**Central message type used throughout the library**

```typescript
interface Message {
  // Identity
  id: string                    // Unique message ID
  chatId: string               // Chat session ID
  
  // Content
  role: MessageRole            // 'user' | 'assistant' | 'system'
  content: string              // Message text (supports Markdown)
  
  // State
  status: MessageStatus        // 'pending' | 'sending' | 'sent' | 'streaming' | 'error'
  
  // Optional
  attachments?: MessageAttachment[]
  metadata?: MessageMetadata
  feedback?: MessageFeedback
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  
  // History
  editHistory?: MessageEdit[]
}

type MessageRole = 'user' | 'assistant' | 'system'
type MessageStatus = 'pending' | 'sending' | 'sent' | 'streaming' | 'error'
```

**Usage**:
```typescript
const message: Message = {
  id: 'msg-123',
  chatId: 'chat-456',
  role: 'user',
  content: 'Hello AI!',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

### MessageMetadata
**Optional metadata for messages**

```typescript
interface MessageMetadata {
  // AI Response Info
  tokens?: number              // Token count
  model?: string               // Model used
  processingTime?: number      // Response time (ms)
  cost?: number                // API cost ($)
  
  // Sources (RAG)
  sources?: string[]           // Source document IDs
  citations?: Citation[]       // Citation objects
  
  // Quality
  confidence?: number          // 0-1
  reasoning?: string           // Chain of thought
  
  // Extensible
  [key: string]: any          // Custom fields
}
```

---

### Context
**Document/context type for RAG**

```typescript
interface Context {
  // Identity
  id: string
  projectId: string
  
  // Content
  type: ContextType           // 'file' | 'url' | 'text' | 'code'
  name: string
  content: string             // Full text content
  url?: string                // Original URL if applicable
  
  // Metadata
  metadata: ContextMetadata
  
  // State
  isActive: boolean           // Used in current chat?
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

type ContextType = 'file' | 'url' | 'text' | 'code'

interface ContextMetadata {
  fileSize?: number
  mimeType?: string
  dimensions?: { width: number; height: number }
  duration?: number
  pageCount?: number
  title?: string
  author?: string
  extractedText?: string
  [key: string]: any
}
```

**Usage**:
```typescript
const context: Context = {
  id: 'ctx-789',
  projectId: 'proj-123',
  type: 'file',
  name: 'documentation.pdf',
  content: 'Full document text...',
  metadata: {
    fileSize: 1024000,
    mimeType: 'application/pdf',
    pageCount: 50
  },
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

### ModelInfo
**AI model information**

```typescript
interface ModelInfo {
  // Identity
  id: string                   // 'gpt-4', 'claude-3', etc.
  name: string                 // Display name
  provider: string             // 'OpenAI', 'Anthropic', etc.
  
  // Details
  description?: string
  contextWindow: number        // Max tokens
  
  // Characteristics
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'basic' | 'good' | 'excellent'
  
  // Capabilities
  supportsStreaming?: boolean
  supportsTools?: boolean
  supportsVision?: boolean
}
```

**Usage**:
```typescript
const gpt4: ModelInfo = {
  id: 'gpt-4',
  name: 'GPT-4',
  provider: 'OpenAI',
  description: 'Most capable model',
  contextWindow: 8192,
  speed: 'slow',
  cost: 'high',
  quality: 'excellent',
  supportsStreaming: true,
  supportsTools: true,
  supportsVision: true
}
```

---

### AIStatus
**AI processing status**

```typescript
interface AIStatus {
  state: AIState
  message?: string             // Status message
  progress?: number            // 0-100
  startedAt?: Date
  estimatedCompletion?: Date
}

type AIState = 
  | 'idle'                     // Not processing
  | 'thinking'                 // Analyzing input
  | 'responding'               // Generating response
  | 'complete'                 // Finished
  | 'error'                    // Failed
```

**Usage**:
```typescript
const status: AIStatus = {
  state: 'thinking',
  message: 'Analyzing your question...',
  progress: 45,
  startedAt: new Date()
}

<ThinkingIndicator status={status} />
```

---

## 🎨 UI Types

### Theme
**Theme structure**

```typescript
interface Theme {
  name: string
  
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
    destructive: string
    border: string
    input: string
    card: string
    popover: string
    'primary-foreground': string
    'secondary-foreground': string
    'muted-foreground': string
    'accent-foreground': string
    'destructive-foreground': string
  }
  
  fonts: {
    sans: string
    mono: string
  }
  
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  
  animations: {
    duration: string
    easing: string
  }
}
```

---

### Animation Types
**Framer Motion animation configs**

```typescript
interface AnimationConfig {
  initial?: MotionProps['initial']
  animate?: MotionProps['animate']
  exit?: MotionProps['exit']
  transition?: MotionProps['transition']
}

// Common animation presets
const fadeIn: AnimationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

const slideUp: AnimationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const scaleIn: AnimationConfig = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}
```

---

## 🤖 AI Infrastructure Types

### ModelAdapter
**Unified model interface**

```typescript
interface ModelAdapter {
  name: string
  supportsStreaming: boolean
  supportsTools?: boolean
  supportsVision?: boolean
  
  // Standard chat
  sendMessage(params: {
    messages: Message[]
    model: string
    temperature?: number
    maxTokens?: number
    topP?: number
    stop?: string[]
  }): Promise<string>
  
  // Streaming chat
  streamMessage(params: {
    messages: Message[]
    model: string
    onChunk: (chunk: string) => void
    signal?: AbortSignal
    temperature?: number
    maxTokens?: number
  }): Promise<void>
}
```

---

### Vector Store Types

```typescript
interface VectorStoreConfig {
  apiKey: string
  index?: string
  namespace?: string
  dimension?: number
}

interface Document {
  pageContent: string
  metadata: Record<string, any>
}

interface VectorStore {
  addDocuments(
    documents: Document[],
    embeddings: Embeddings
  ): Promise<void>
  
  similaritySearch(
    query: string,
    k: number,
    filter?: Record<string, any>
  ): Promise<Document[]>
  
  delete(ids: string[]): Promise<void>
}
```

---

### Embeddings Types

```typescript
interface EmbeddingsConfig {
  apiKey: string
  model?: string
  batchSize?: number
}

interface Embeddings {
  embedDocuments(texts: string[]): Promise<number[][]>
  embedQuery(text: string): Promise<number[]>
}
```

---

### Agent Types

```typescript
interface Tool {
  name: string
  description: string
  parameters?: Record<string, any>
  execute: (...args: any[]) => Promise<any>
}

interface AgentConfig {
  tools: Tool[]
  modelAdapter: ModelAdapter
  model: string
  maxIterations?: number
  verbose?: boolean
}

interface AgentResult {
  output: string
  steps: AgentStep[]
  success: boolean
  error?: Error
}

interface AgentStep {
  thought: string
  action: string
  actionInput: any
  observation: string
}
```

---

## 📊 Analytics Types

### Analytics Configuration

```typescript
interface AnalyticsConfig {
  providers: {
    googleAnalytics?: GoogleAnalyticsConfig
    mixpanel?: MixpanelConfig
    posthog?: PostHogConfig
    amplitude?: AmplitudeConfig
    segment?: SegmentConfig
    heap?: HeapConfig
    logRocket?: LogRocketConfig
  }
  
  // Event callbacks
  events?: {
    onMessageSent?: (message: Message) => void
    onMessageReceived?: (message: Message) => void
    onFileUploaded?: (file: File) => void
    onModelChanged?: (modelId: string) => void
    onContextAdded?: (context: Context) => void
    onExportClicked?: (format: string) => void
    [key: string]: ((data: any) => void) | undefined
  }
}

interface GoogleAnalyticsConfig {
  measurementId: string
  debug?: boolean
}

interface MixpanelConfig {
  token: string
  debug?: boolean
}
```

---

### Event Types

```typescript
// Predefined analytics events (35+ total)
type AnalyticsEvent =
  | 'message_sent'
  | 'message_received'
  | 'file_uploaded'
  | 'voice_input_started'
  | 'voice_input_completed'
  | 'model_changed'
  | 'theme_changed'
  | 'context_added'
  | 'context_removed'
  | 'context_toggled'
  | 'search_performed'
  | 'export_clicked'
  | 'feedback_given'
  | 'error_occurred'
  | 'retry_clicked'
  // ...and more

interface AnalyticsEventData {
  event: AnalyticsEvent
  timestamp: Date
  userId?: string
  sessionId?: string
  properties: Record<string, any>
}
```

---

## 🐛 Error Types

### Error Handling

```typescript
interface ErrorInfo {
  type: 'network' | 'validation' | 'auth' | 'ratelimit' | 'server' | 'unknown'
  message: string
  code?: string
  details?: Record<string, any>
  timestamp: Date
  recoverable: boolean
}

interface RetryConfig {
  maxAttempts: number
  backoffMs: number[]
  shouldRetry?: (error: Error, attempt: number) => boolean
}

interface ErrorRecoveryState {
  error: Error | null
  isRetrying: boolean
  attemptNumber: number
  canRetry: boolean
  errorMessage: string | null
  errorType: ErrorType | null
}

type ErrorType = 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown'
```

---

## 🔐 Security Types

### Safety & Moderation

```typescript
interface PIIResult {
  found: boolean
  entities: PIIEntity[]
  redacted: string
}

interface PIIEntity {
  type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'name' | 'address'
  value: string
  start: number
  end: number
  confidence: number
}

interface ContentFilterResult {
  safe: boolean
  categories: {
    hate: number          // 0-1 score
    sexual: number
    violence: number
    selfHarm: number
    harassment: number
  }
  flagged: string[]       // Flagged categories
}

interface PromptInjectionResult {
  detected: boolean
  confidence: number
  patterns: string[]      // Matched patterns
  sanitized: string       // Cleaned input
}
```

---

## 📦 Utility Types

### Generic Helpers

```typescript
// Partial deep
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Required deep
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// Make specific fields required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specific fields optional
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
```

---

### Component Props Helpers

```typescript
// Base props all components get
interface BaseProps {
  className?: string
  style?: React.CSSProperties
  id?: string
  'data-testid'?: string
}

// Props with children
interface WithChildren {
  children?: React.ReactNode
}

// Props with ref forwarding
type ForwardRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>

// Polymorphic as prop
type AsProp<C extends React.ElementType> = {
  as?: C
} & React.ComponentPropsWithoutRef<C>
```

---

## 🎭 State Types

### Hook Return Types

```typescript
// Standard async operation return
interface AsyncOperationReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

// Toggle state return
interface ToggleReturn {
  value: boolean
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
  setValue: Dispatch<SetStateAction<boolean>>
}

// Pagination state
interface PaginationState {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  hasPrevious: boolean
}
```

---

## 🌐 WebSocket/SSE Types

### WebSocket

```typescript
type WebSocketStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'closing'
  | 'closed'
  | 'error'
  | 'reconnecting'

interface WebSocketMessage {
  data: any
  raw: string | ArrayBuffer | Blob
  type: 'text' | 'binary' | 'blob'
  timestamp: number
}

interface WebSocketConfig {
  url: string
  protocols?: string | string[]
  autoReconnect?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
  enableHeartbeat?: boolean
  heartbeatInterval?: number
  heartbeatMessage?: string
}
```

### Server-Sent Events

```typescript
type SSEStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'streaming'
  | 'error'
  | 'closed'

interface SSEEvent {
  id?: string
  event?: string
  data: any
  retry?: number
  timestamp: number
}

interface SSEConfig {
  url: string
  options?: RequestInit
  autoReconnect?: boolean
  maxReconnectAttempts?: number
  reconnectDelay?: number
}
```

---

## 🎨 UI Component Types

### Variant Types

```typescript
// Button variants
type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'success'
  | 'error'
  | 'surface'

// Badge variants
type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'subtle'

// Size types
type Size = 'sm' | 'md' | 'lg'

// Common UI states
interface UIState {
  loading?: boolean
  disabled?: boolean
  error?: boolean
  success?: boolean
}
```

---

### Layout Types

```typescript
interface LayoutProps {
  // Flex
  flexDirection?: 'row' | 'column'
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around'
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  gap?: string | number
  
  // Grid
  gridColumns?: number | string
  gridRows?: number | string
  
  // Spacing
  padding?: string | number
  margin?: string | number
  
  // Size
  width?: string | number
  height?: string | number
  maxWidth?: string | number
  maxHeight?: string | number
}
```

---

## 📊 Analytics Event Types

### Event Payloads

```typescript
interface MessageSentEvent {
  event: 'message_sent'
  messageId: string
  chatId: string
  contentLength: number
  hasAttachments: boolean
  model?: string
  timestamp: Date
}

interface FileUploadedEvent {
  event: 'file_uploaded'
  fileId: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadDuration: number
  timestamp: Date
}

interface ModelChangedEvent {
  event: 'model_changed'
  previousModel: string
  newModel: string
  provider: string
  timestamp: Date
}

interface ErrorOccurredEvent {
  event: 'error_occurred'
  errorType: string
  errorMessage: string
  component?: string
  recoverable: boolean
  timestamp: Date
}
```

---

## 🔧 Utility Types

### Callback Types

```typescript
// Standard callbacks
type OnSendCallback = (content: string, files?: File[]) => void | Promise<void>
type OnErrorCallback = (error: Error) => void
type OnSuccessCallback<T> = (result: T) => void
type OnChangeCallback<T> = (value: T) => void

// Event handler types
type ClickHandler = (event: React.MouseEvent) => void
type SubmitHandler = (event: React.FormEvent) => void
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
type KeyboardHandler = (event: React.KeyboardEvent) => void

// Async callbacks with signals
type AsyncCallbackWithSignal<T = void> = (
  data: any,
  options?: { signal?: AbortSignal }
) => Promise<T>
```

---

### Filter & Search Types

```typescript
interface SearchFilters {
  role?: MessageRole
  dateFrom?: Date
  dateTo?: Date
  hasAttachments?: boolean
  status?: MessageStatus
  model?: string
  minTokens?: number
  maxTokens?: number
}

interface SearchResult {
  message: Message
  score: number
  highlights: string[]
}

interface SortConfig {
  field: keyof Message
  direction: 'asc' | 'desc'
}
```

---

## 📚 Enterprise Types

### Multi-Tenancy

```typescript
interface Tenant {
  id: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  seats: number
  usedSeats: number
  features: string[]
  limits: TenantLimits
  createdAt: Date
}

interface TenantLimits {
  maxMessages: number
  maxContexts: number
  maxFileSize: number
  maxMonthlyTokens: number
}
```

### RBAC (Role-Based Access Control)

```typescript
type Role = 'admin' | 'user' | 'viewer'

type Permission =
  | 'message.send'
  | 'message.delete'
  | 'context.add'
  | 'context.remove'
  | 'model.change'
  | 'settings.edit'
  | 'analytics.view'
  | 'users.manage'

interface User {
  id: string
  email: string
  name: string
  role: Role
  permissions: Permission[]
  tenantId: string
}
```

### Audit Logging

```typescript
interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  tenantId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  metadata?: Record<string, any>
}
```

---

## 🎯 Type Guards

### Helper Type Guards

```typescript
// Check if message is from user
function isUserMessage(message: Message): boolean {
  return message.role === 'user'
}

// Check if message is streaming
function isStreamingMessage(message: Message): boolean {
  return message.status === 'streaming'
}

// Check if message has attachments
function hasAttachments(message: Message): message is Message & { attachments: MessageAttachment[] } {
  return Array.isArray(message.attachments) && message.attachments.length > 0
}

// Check if error is recoverable
function isRecoverableError(error: Error): boolean {
  return error.name !== 'AbortError' && 
         error.name !== 'ValidationError'
}
```

---

## 📝 Type Aliases

### Common Aliases

```typescript
// ID types
type MessageId = string
type ChatId = string
type UserId = string
type ContextId = string
type ModelId = string

// Callback types (with signal support)
type SendMessageCallback = (
  message: Message,
  options?: { signal?: AbortSignal }
) => Promise<void>

type StreamCallback = (chunk: string) => void
type CompleteCallback = (fullText: string) => void

// Generic async operation
type AsyncOperation<T> = (
  ...args: any[]
) => Promise<T>
```

---

## 🔍 Type Inference Helpers

### For AI Agents

```typescript
// Infer return type from hook
type ChatReturn = ReturnType<typeof useChat>
// Result: UseChatReturn

// Infer props from component
type ChatWindowProps = React.ComponentProps<typeof ChatWindow>

// Extract array element type
type MessageElement = ArrayElement<Message[]>
// Result: Message

type ArrayElement<T> = T extends (infer U)[] ? U : never

// Extract promise result type
type StreamResult = PromiseType<ReturnType<typeof startStreaming>>

type PromiseType<T> = T extends Promise<infer U> ? U : T
```

---

## ✨ Summary

**Total Types Defined**: 50+  
**Core Types**: Message, Context, ModelInfo, AIStatus, Theme  
**Enterprise Types**: Tenant, User, AuditLog, Permission  
**Infrastructure Types**: ModelAdapter, VectorStore, Embeddings, Agent  
**Utility Types**: Helpers, Guards, Aliases  

**TypeScript Coverage**: 100%  
**Type Safety**: Strict mode enabled  
**Quality**: Production-grade  

---

_Complete TypeScript type reference for AI agents._

