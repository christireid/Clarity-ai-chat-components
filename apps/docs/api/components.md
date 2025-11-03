# Components API

Complete reference for all Clarity Chat components.

## ChatWindow

The main container component that orchestrates the entire chat interface.

### Props

```typescript
interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  onSendMessage: (content: string) => void | Promise<void>
  onCancel?: () => void
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onBranchMessage?: (messageId: string) => void
  onFileUpload?: (files: File[]) => void
  placeholder?: string
  maxHeight?: string | number
  enableFileUpload?: boolean
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  theme?: ThemeConfig
  className?: string
}
```

### Usage

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSendMessage}
  onCancel={handleCancel}
  placeholder="Type your message..."
  maxHeight="600px"
  enableFileUpload
  enableMessageOperations
/>
```

---

## MessageList

Displays a scrollable list of messages with auto-scroll and virtualization.

### Props

```typescript
interface MessageListProps {
  messages: Message[]
  onEditMessage?: (messageId: string, newContent: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onCopyMessage?: (messageId: string) => void
  enableMessageOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  virtualizeMessages?: boolean
  className?: string
}
```

### Usage

```tsx
<MessageList
  messages={messages}
  onEditMessage={handleEdit}
  onRegenerateMessage={handleRegenerate}
  enableMessageOperations
  virtualizeMessages
/>
```

---

## ChatInput

Multi-line text input with auto-resize, file upload, and keyboard shortcuts.

### Props

```typescript
interface ChatInputProps {
  onSend: (content: string) => void
  onFileUpload?: (files: File[]) => void
  onCancel?: () => void
  isLoading?: boolean
  isCancellable?: boolean
  placeholder?: string
  maxLength?: number
  enableFileUpload?: boolean
  disabled?: boolean
  className?: string
}
```

### Usage

```tsx
<ChatInput
  onSend={handleSend}
  onFileUpload={handleFileUpload}
  isLoading={isLoading}
  placeholder="Type a message..."
  maxLength={4000}
  enableFileUpload
/>
```

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line
- `Cmd/Ctrl + K` - Clear input
- `Esc` - Cancel (if cancellable)

---

## Message

Individual message component with role-based styling.

### Props

```typescript
interface MessageProps {
  message: Message
  onEdit?: (messageId: string, newContent: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onCopy?: (messageId: string) => void
  enableOperations?: boolean
  enableMarkdown?: boolean
  enableCodeHighlight?: boolean
  className?: string
}
```

### Usage

```tsx
<Message
  message={message}
  onEdit={handleEdit}
  onRegenerate={handleRegenerate}
  onDelete={handleDelete}
  onCopy={handleCopy}
  enableOperations
  enableMarkdown
/>
```

---

## ThinkingIndicator

Animated indicator showing AI processing stages.

### Props

```typescript
interface ThinkingIndicatorProps {
  stage?: 'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
  message?: string
  className?: string
}
```

### Usage

```tsx
<ThinkingIndicator 
  stage="generating" 
  message="Generating response..." 
/>
```

---

## FileUpload

Drag-and-drop file upload with validation and preview.

### Props

```typescript
interface FileUploadProps {
  onUpload: (files: File[]) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  className?: string
}
```

### Usage

```tsx
<FileUpload
  onUpload={handleUpload}
  accept="image/*,.pdf"
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
/>
```

---

## CopyButton

Button to copy content to clipboard with success feedback.

### Props

```typescript
interface CopyButtonProps {
  content: string
  onCopy?: () => void
  className?: string
}
```

### Usage

```tsx
<CopyButton 
  content={messageContent} 
  onCopy={() => console.log('Copied!')} 
/>
```

---

## RetryButton

Button with smart retry logic and exponential backoff.

### Props

```typescript
interface RetryButtonProps {
  onRetry: () => void | Promise<void>
  maxAttempts?: number
  disabled?: boolean
  className?: string
}
```

### Usage

```tsx
<RetryButton 
  onRetry={handleRetry}
  maxAttempts={3}
/>
```

---

## NetworkStatus

Displays current network connection status.

### Props

```typescript
interface NetworkStatusProps {
  onReconnect?: () => void
  className?: string
}
```

### Usage

```tsx
<NetworkStatus onReconnect={handleReconnect} />
```

---

## TokenCounter

Real-time token counting and cost estimation.

### Props

```typescript
interface TokenCounterProps {
  messages: Message[]
  model?: string
  maxTokens?: number
  showCost?: boolean
  className?: string
}
```

### Usage

```tsx
<TokenCounter
  messages={messages}
  model="gpt-4"
  maxTokens={8000}
  showCost
/>
```

---

## ContextCard

Display context items (documents, images, links).

### Props

```typescript
interface ContextCardProps {
  context: ContextItem
  onRemove?: (id: string) => void
  className?: string
}
```

### Usage

```tsx
<ContextCard
  context={{
    id: '1',
    type: 'document',
    title: 'Project Brief',
    content: '...',
  }}
  onRemove={handleRemove}
/>
```

---

## ConversationList

List of conversations with search and filtering.

### Props

```typescript
interface ConversationListProps {
  conversations: Conversation[]
  currentId?: string
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onSearch?: (query: string) => void
  className?: string
}
```

### Usage

```tsx
<ConversationList
  conversations={conversations}
  currentId={currentConversationId}
  onSelect={handleSelect}
  onDelete={handleDelete}
  onSearch={handleSearch}
/>
```

---

## ProjectSidebar

Sidebar for project and conversation management.

### Props

```typescript
interface ProjectSidebarProps {
  projects: Project[]
  conversations: Conversation[]
  currentProjectId?: string
  currentConversationId?: string
  onSelectProject: (id: string) => void
  onSelectConversation: (id: string) => void
  onCreateProject?: () => void
  onCreateConversation?: () => void
  className?: string
}
```

### Usage

```tsx
<ProjectSidebar
  projects={projects}
  conversations={conversations}
  currentProjectId={currentProjectId}
  onSelectProject={handleSelectProject}
  onSelectConversation={handleSelectConversation}
/>
```

---

## PromptLibrary

Template prompt management with categories.

### Props

```typescript
interface PromptLibraryProps {
  prompts: Prompt[]
  categories: string[]
  onSelect: (prompt: Prompt) => void
  onSave?: (prompt: Prompt) => void
  onDelete?: (id: string) => void
  className?: string
}
```

### Usage

```tsx
<PromptLibrary
  prompts={prompts}
  categories={['Development', 'Writing', 'Analysis']}
  onSelect={handleSelectPrompt}
  onSave={handleSavePrompt}
/>
```

---

## FollowUpSuggestions

Display contextual follow-up prompts the assistant can suggest to the user.

```typescript
interface FollowUpSuggestion {
  id: string
  title: string
  description?: string
  keywords?: string[]
  icon?: React.ReactNode
  confidence?: number
}

interface FollowUpSuggestionsProps {
  suggestions: FollowUpSuggestion[]
  onSelect: (suggestion: FollowUpSuggestion) => void
  title?: string
  subtitle?: string
  layout?: 'grid' | 'list'
  isLoading?: boolean
  loadingCount?: number
  emptyState?: React.ReactNode
  className?: string
}
```

---

## PersonaPanel

Switch between curated personas or assistants optimised for different workflows.

```typescript
type PersonaRole = 'strategist' | 'researcher' | 'assistant' | 'critic' | 'coach' | 'custom'

interface Persona {
  id: string
  name: string
  role: PersonaRole
  summary: string
  expertise: string[]
  avatarUrl?: string
  color?: string
  temperature?: number
  tags?: string[]
}

interface PersonaPanelProps {
  personas: Persona[]
  activePersonaId?: string
  onSelect?: (persona: Persona) => void
  onConfigure?: (persona: Persona) => void
  toneSubtitle?: string
  showTemperature?: boolean
  className?: string
}
```

---

## ConversationTimeline

Audit every turn in the dialogue?including tool invocations?with a chronological timeline.

```typescript
type TimelineEventType = 'user' | 'assistant' | 'tool' | 'system' | 'note'

interface ConversationTimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  timestamp: Date
  summary?: string
  metadata?: Array<{ label: string; value: string }>
  durationMs?: number
  status?: 'pending' | 'complete' | 'error'
  icon?: React.ReactNode
}

interface ConversationTimelineProps {
  events: ConversationTimelineEvent[]
  onJumpToEvent?: (event: ConversationTimelineEvent) => void
  showStatusIndicators?: boolean
  className?: string
  title?: string
  subtitle?: string
}
```

---

## MemoryInspector

Inspect session, thread, and global memories captured during the conversation.

```typescript
type MemoryScope = 'session' | 'thread' | 'global'

interface MemoryItem {
  id: string
  label: string
  value: string
  scope: MemoryScope
  confidence?: number
  source?: string
  lastUpdated: Date
  tokens?: number
}

interface MemoryInspectorProps {
  memories: MemoryItem[]
  isLoading?: boolean
  onRemove?: (memory: MemoryItem) => void
  onPromote?: (memory: MemoryItem) => void
  onRefresh?: () => void
  className?: string
  title?: string
  subtitle?: string
  showHeaderActions?: boolean
}
```

---

## SafetyStatusCard

Summarise safety, moderation, and policy checks for the latest reply.

```typescript
type SafetyStatus = 'pass' | 'warn' | 'fail'

interface SafetyCheck {
  id: string
  label: string
  status: SafetyStatus
  detail?: string
  remediation?: string
}

interface SafetyStatusCardProps {
  checks: SafetyCheck[]
  lastReviewedAt?: Date
  onReviewPolicy?: () => void
  onAcknowledge?: (check: SafetyCheck) => void
  className?: string
  title?: string
  subtitle?: string
}
```

---

## ResponseQualityMeter

Visualise AI evaluation metrics such as groundedness or coverage.

```typescript
interface ResponseQualityMetric {
  id: string
  label: string
  score: number
  target?: number
  description?: string
}

interface ResponseQualityMeterProps {
  metrics: ResponseQualityMetric[]
  overallLabel?: string
  overallScore?: number
  className?: string
  title?: string
  subtitle?: string
  scaleLabel?: string
}
```

---

## MultiModalPreview

Render the attachments (images, audio clips, docs) referenced by the assistant.

```typescript
type AttachmentType = 'image' | 'audio' | 'video' | 'file' | 'link'

interface AttachmentPreview {
  id: string
  type: AttachmentType
  title: string
  description?: string
  thumbnailUrl?: string
  status?: 'processing' | 'ready' | 'failed'
  durationMs?: number
  sizeLabel?: string
  metadata?: Array<{ label: string; value: string }>
}

interface MultiModalPreviewProps {
  attachments: AttachmentPreview[]
  onOpen?: (attachment: AttachmentPreview) => void
  onRetry?: (attachment: AttachmentPreview) => void
  onRemove?: (attachment: AttachmentPreview) => void
  className?: string
  title?: string
  subtitle?: string
}
```

---

## AgentRunFeed

Timeline for orchestrated agent tool calls, including output previews and retry actions.

```typescript
type AgentRunStatus = 'pending' | 'running' | 'succeeded' | 'failed'

interface AgentRunStep {
  id: string
  title: string
  detail?: string
  status: AgentRunStatus
  tool?: string
  startedAt: Date
  completedAt?: Date
  outputPreview?: string
}

interface AgentRunFeedProps {
  steps: AgentRunStep[]
  onRetry?: (step: AgentRunStep) => void
  onOpenLogs?: (step: AgentRunStep) => void
  className?: string
  title?: string
  subtitle?: string
}
```

---

## SessionSummaryCard

Produce an executive summary with highlights, structured metrics, and next actions.

```typescript
interface SessionSummaryHighlights {
  title: string
  highlights: string[]
  nextActions?: string[]
}

interface SessionMetric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'steady'
}

interface SessionSummaryCardProps {
  summary: SessionSummaryHighlights
  metrics: SessionMetric[]
  onAction?: (action: string) => void
  onExport?: () => void
  className?: string
  title?: string
  subtitle?: string
}
```

---

## WorkflowSuggestionList

Offer templated multi-step workflows the user can trigger from within the chat.

```typescript
interface WorkflowSuggestion {
  id: string
  name: string
  description: string
  steps: string[]
  estimatedTime?: string
  audience?: string
  tags?: string[]
}

interface WorkflowSuggestionListProps {
  workflows: WorkflowSuggestion[]
  onSelect?: (workflow: WorkflowSuggestion) => void
  onPreview?: (workflow: WorkflowSuggestion) => void
  className?: string
  title?: string
  subtitle?: string
}
```

---

## PromptTestHarness

Regression harness for comparing prompt variants across datasets.

```typescript
type PromptTestStatus = 'pending' | 'running' | 'pass' | 'fail'

interface PromptVariant {
  id: string
  label: string
}

interface PromptTestCase {
  id: string
  input: string
  status: PromptTestStatus
  output?: string
  expected?: string
  latencyMs?: number
  costUsd?: number
}

interface PromptTestHarnessProps {
  datasetName?: string
  datasets?: Array<{ id: string; name: string }>
  variants: PromptVariant[]
  tests: PromptTestCase[]
  onRunAll?: () => void
  onRunVariant?: (variantId: string) => void
  onSelectDataset?: (datasetId: string) => void
  isRunning?: boolean
  className?: string
}
```

---

## EvaluationDashboard

Aggregates evaluation metrics, quality scores, and sparklines for AI releases.

```typescript
interface EvaluationMetric {
  id: string
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  change?: string
}

interface EvaluationSparkline {
  id: string
  label: string
  percentage: number
  objective?: number
}

interface EvaluationDashboardProps {
  metrics: EvaluationMetric[]
  sparklines?: EvaluationSparkline[]
  quality?: ResponseQualityMeterProps
  className?: string
}
```

---

## SafetyReviewConsole

Interactive redaction tool for reviewing flagged content before approval.

```typescript
interface SafetyHighlight {
  id: string
  start: number
  end: number
  category: string
  severity?: 'low' | 'medium' | 'high'
  suggestion?: string
}

interface SafetyReviewConsoleProps {
  content: string
  highlights: SafetyHighlight[]
  onRedact?: (highlight: SafetyHighlight) => void
  onApprove?: () => void
  onReject?: () => void
  className?: string
}
```

---

## Common Props

### Message Type

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isStreaming?: boolean
  error?: boolean
  metadata?: Record<string, any>
}
```

### Theme Config

```typescript
interface ThemeConfig {
  primaryColor?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  fontFamily?: string
  fontSize?: string
}
```

### Context Item

```typescript
interface ContextItem {
  id: string
  type: 'document' | 'image' | 'link' | 'code'
  title: string
  content: string
  url?: string
  metadata?: Record<string, any>
}
```

## CSS Variables

All components use CSS variables for theming:

```css
:root {
  --chat-primary-color: #2563eb;
  --chat-background-color: #ffffff;
  --chat-text-color: #1f2937;
  --chat-border-color: #e5e7eb;
  --chat-border-radius: 8px;
  --chat-font-family: system-ui, sans-serif;
  --chat-font-size: 14px;
}
```

## Next Steps

- [Hooks API](/api/hooks) - Learn about available hooks
- [Types](/api/types) - Complete type definitions
- [Theming](/guide/theming) - Customize appearance
- [Examples](/examples/) - See components in action
