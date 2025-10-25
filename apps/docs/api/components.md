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
