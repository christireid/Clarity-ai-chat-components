# Components API Reference

Complete API documentation for all Clarity Chat components.

---

## 📚 **Table of Contents**

### Core Components
- [ChatWindow](#chatwindow)
- [MessageList](#messagelist)
- [Message](#message)
- [ChatInput](#chatinput)
- [AdvancedChatInput](#advancedchatinput)

### UI Components
- [ThinkingIndicator](#thinkingindicator)
- [CopyButton](#copybutton)
- [RetryButton](#retrybutton)
- [VoiceInput](#voiceinput)
- [FileUpload](#fileupload)

### Layout Components
- [ProjectSidebar](#projectsidebar)
- [ContextManager](#contextmanager)
- [ConversationList](#conversationlist)

### Theme Components
- [ThemeProvider](#themeprovider)
- [ThemeSelector](#themeselector)
- [ThemeEditor](#themeeditor)

[View All Components](#all-components)

---

## 🎯 **Core Components**

### **ChatWindow**

The main chat interface component. Combines message list, input, and optional sidebar.

#### **Import**

```typescript
import { ChatWindow } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ChatWindowProps {
  // Required
  messages: Message[]
  onSendMessage: (content: string, options?: SendOptions) => void | Promise<void>

  // Optional - UI
  placeholder?: string
  title?: string
  subtitle?: string
  isLoading?: boolean
  showSidebar?: boolean
  showTimestamps?: boolean
  
  // Optional - Features
  enableFileUpload?: boolean
  enableVoiceInput?: boolean
  enableMarkdown?: boolean
  enableCodeHighlighting?: boolean
  maxFileSize?: number // bytes
  allowedFileTypes?: string[]
  
  // Optional - Behavior
  autoScroll?: boolean
  autoFocus?: boolean
  submitOnEnter?: boolean
  clearOnSubmit?: boolean
  
  // Optional - Callbacks
  onEditMessage?: (id: string, content: string) => void
  onDeleteMessage?: (id: string) => void
  onRegenerateMessage?: (id: string) => void
  onFileUpload?: (files: File[]) => void
  
  // Optional - Customization
  className?: string
  style?: React.CSSProperties
  renderMessage?: (message: Message) => React.ReactNode
  renderInput?: (props: InputProps) => React.ReactNode
  
  // Optional - Advanced
  virtualized?: boolean
  maxMessages?: number
  theme?: Partial<Theme>
}
```

#### **Usage**

**Basic:**

```typescript
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
/>
```

**With All Features:**

```typescript
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  placeholder="Ask me anything..."
  title="AI Assistant"
  isLoading={isLoading}
  enableFileUpload
  enableVoiceInput
  enableMarkdown
  showSidebar
  showTimestamps
  onEditMessage={handleEdit}
  onDeleteMessage={handleDelete}
  onRegenerateMessage={handleRegenerate}
/>
```

**Custom Rendering:**

```typescript
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  renderMessage={(message) => (
    <CustomMessage
      message={message}
      className="custom-style"
    />
  )}
  renderInput={(props) => (
    <CustomInput {...props} />
  )}
/>
```

#### **Examples**

- [Basic Chat](../../examples/basic-chat)
- [Full Features](../../examples/ai-assistant)
- [Custom Theme](../../examples/custom-theme)

---

### **MessageList**

Displays a scrollable list of messages with virtualization support.

#### **Import**

```typescript
import { MessageList } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface MessageListProps {
  // Required
  messages: Message[]
  
  // Optional - Behavior
  autoScroll?: boolean
  virtualized?: boolean
  onScrollToBottom?: () => void
  
  // Optional - UI
  showTimestamps?: boolean
  showAvatars?: boolean
  groupByDate?: boolean
  emptyState?: React.ReactNode
  
  // Optional - Callbacks
  onMessageClick?: (message: Message) => void
  onCopy?: (content: string) => void
  
  // Optional - Customization
  className?: string
  messageClassName?: string
  renderMessage?: (message: Message) => React.ReactNode
}
```

#### **Usage**

```typescript
<MessageList
  messages={messages}
  autoScroll
  virtualized
  showTimestamps
  groupByDate
  onMessageClick={(msg) => console.log('Clicked:', msg.id)}
/>
```

---

### **Message**

Renders a single message with markdown, code highlighting, and actions.

#### **Import**

```typescript
import { Message } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface MessageProps {
  // Required
  message: Message
  
  // Optional - Features
  enableMarkdown?: boolean
  enableCodeHighlighting?: boolean
  showTimestamp?: boolean
  showAvatar?: boolean
  
  // Optional - Actions
  onCopy?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onRegenerate?: () => void
  
  // Optional - UI
  className?: string
  avatarUrl?: string
  avatarFallback?: string
  
  // Optional - Customization
  renderContent?: (content: string) => React.ReactNode
  renderActions?: () => React.ReactNode
}
```

#### **Usage**

```typescript
<Message
  message={message}
  enableMarkdown
  enableCodeHighlighting
  showTimestamp
  showAvatar
  onCopy={() => copyToClipboard(message.content)}
  onEdit={() => startEdit(message)}
  onDelete={() => deleteMessage(message.id)}
/>
```

---

### **ChatInput**

Basic message input component.

#### **Import**

```typescript
import { ChatInput } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ChatInputProps {
  // Optional - Value
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  
  // Optional - Behavior
  onSubmit?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  clearOnSubmit?: boolean
  submitOnEnter?: boolean
  maxLength?: number
  
  // Optional - UI
  className?: string
  rows?: number
  minRows?: number
  maxRows?: number
  
  // Optional - Features
  showCharCount?: boolean
  showEmojiPicker?: boolean
}
```

#### **Usage**

```typescript
<ChatInput
  placeholder="Type your message..."
  onSubmit={handleSend}
  submitOnEnter
  clearOnSubmit
  maxLength={5000}
  showCharCount
/>
```

---

### **AdvancedChatInput**

Enhanced input with autocomplete, file upload, and voice input.

#### **Import**

```typescript
import { AdvancedChatInput } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface AdvancedChatInputProps extends ChatInputProps {
  // Autocomplete
  enableAutocomplete?: boolean
  suggestions?: Suggestion[]
  onSuggestionSelect?: (suggestion: Suggestion) => void
  
  // File Upload
  enableFileUpload?: boolean
  onFileUpload?: (files: File[]) => void
  maxFileSize?: number
  allowedFileTypes?: string[]
  
  // Voice Input
  enableVoiceInput?: boolean
  onVoiceTranscript?: (text: string) => void
  voiceLang?: string
  
  // Mentions & Commands
  enableMentions?: boolean
  mentions?: User[]
  enableCommands?: boolean
  commands?: Command[]
}
```

#### **Usage**

```typescript
<AdvancedChatInput
  placeholder="Type @ for mentions, / for commands..."
  onSubmit={handleSend}
  enableAutocomplete
  enableFileUpload
  enableVoiceInput
  enableMentions
  enableCommands
  suggestions={suggestions}
  mentions={users}
  commands={commands}
/>
```

---

## 🎨 **UI Components**

### **ThinkingIndicator**

Animated indicator showing AI is processing.

#### **Import**

```typescript
import { ThinkingIndicator } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ThinkingIndicatorProps {
  variant?: 'dots' | 'pulse' | 'wave' | 'typing'
  text?: string
  className?: string
}
```

#### **Usage**

```typescript
<ThinkingIndicator
  variant="typing"
  text="AI is thinking..."
/>
```

---

### **CopyButton**

Button to copy text to clipboard with visual feedback.

#### **Import**

```typescript
import { CopyButton } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface CopyButtonProps {
  content: string
  onCopy?: () => void
  className?: string
  successMessage?: string
  variant?: 'icon' | 'text' | 'icon-text'
}
```

#### **Usage**

```typescript
<CopyButton
  content="Text to copy"
  successMessage="Copied!"
  variant="icon-text"
/>
```

---

### **VoiceInput**

Speech-to-text input button with recording UI.

#### **Import**

```typescript
import { VoiceInput } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface VoiceInputProps {
  // Required
  onTranscript: (text: string) => void
  
  // Optional - Behavior
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  autoSubmit?: boolean
  maxDuration?: number // seconds
  
  // Optional - Callbacks
  onStart?: () => void
  onStop?: () => void
  onError?: (error: Error) => void
  
  // Optional - UI
  variant?: 'button' | 'inline'
  className?: string
  showTranscript?: boolean
}
```

#### **Usage**

```typescript
<VoiceInput
  onTranscript={(text) => setMessage(text)}
  lang="en-US"
  continuous
  interimResults
  autoSubmit
  showTranscript
  onError={(err) => console.error(err)}
/>
```

**Supported Languages:**
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish (Spain)
- `fr-FR` - French
- `de-DE` - German
- `it-IT` - Italian
- `ja-JP` - Japanese
- `ko-KR` - Korean
- `zh-CN` - Chinese (Simplified)
- [+ 20 more languages]

---

### **FileUpload**

Drag-and-drop file upload with previews.

#### **Import**

```typescript
import { FileUpload } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface FileUploadProps {
  // Optional - Behavior
  onUpload?: (files: File[]) => void
  onChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // bytes
  accept?: string[]
  multiple?: boolean
  
  // Optional - UI
  className?: string
  showPreviews?: boolean
  showProgress?: boolean
  variant?: 'button' | 'dropzone'
  
  // Optional - Text
  uploadText?: string
  dropText?: string
  errorText?: string
}
```

#### **Usage**

```typescript
<FileUpload
  onUpload={handleUpload}
  maxFiles={5}
  maxSize={10 * 1024 * 1024} // 10MB
  accept={['image/*', 'application/pdf']}
  multiple
  showPreviews
  variant="dropzone"
/>
```

---

## 🎭 **Theme Components**

### **ThemeProvider**

Provides theme context to child components.

#### **Import**

```typescript
import { ThemeProvider, themes } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ThemeProviderProps {
  theme: Theme
  children: React.ReactNode
}
```

#### **Usage**

```typescript
<ThemeProvider theme={themes.ocean}>
  <ChatWindow {...props} />
</ThemeProvider>
```

---

### **ThemeSelector**

UI component for selecting from available themes.

#### **Import**

```typescript
import { ThemeSelector } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ThemeSelectorProps {
  themes: Theme[]
  selected: Theme
  onChange: (theme: Theme) => void
  variant?: 'dropdown' | 'grid' | 'list'
  showPreview?: boolean
  className?: string
}
```

#### **Usage**

```typescript
<ThemeSelector
  themes={Object.values(themes)}
  selected={currentTheme}
  onChange={setTheme}
  variant="grid"
  showPreview
/>
```

---

### **ThemeEditor**

Visual theme editor with live preview.

#### **Import**

```typescript
import { ThemeEditor } from '@clarity-chat/react'
```

#### **Props**

```typescript
interface ThemeEditorProps {
  theme: Theme
  onChange: (theme: Theme) => void
  showPreview?: boolean
  onExport?: (theme: Theme) => void
  onReset?: () => void
  className?: string
}
```

#### **Usage**

```typescript
<ThemeEditor
  theme={customTheme}
  onChange={setCustomTheme}
  showPreview
  onExport={(theme) => download(theme)}
  onReset={() => setCustomTheme(themes.default)}
/>
```

---

## 📋 **All Components**

### **By Category**

**Chat Core:**
- ChatWindow
- MessageList
- Message
- ChatInput
- AdvancedChatInput

**Message UI:**
- ThinkingIndicator
- CopyButton
- RetryButton
- StreamingMessage
- ToolInvocationCard
- CitationCard

**Input Features:**
- VoiceInput
- FileUpload
- EmojiPicker (planned)
- MentionInput (planned)

**Context & Organization:**
- ContextManager
- ContextCard
- ContextVisualizer
- ProjectSidebar
- ConversationList
- PromptLibrary

**Monitoring & Analytics:**
- PerformanceDashboard
- UsageDashboard
- TokenCounter
- NetworkStatus

**Theme & Customization:**
- ThemeProvider
- ThemeSelector
- ThemeEditor
- ThemePreview

**Error Handling:**
- ErrorBoundary
- ErrorBoundaryEnhanced
- ErrorFeedback

**Utilities:**
- Toast
- Progress
- Skeleton
- EmptyState
- AnimatedList
- InteractiveCard

---

## 📊 **TypeScript Types**

### **Message**

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
  
  // Optional
  attachments?: Attachment[]
  citations?: Citation[]
  tools?: ToolInvocation[]
  status?: 'sending' | 'sent' | 'error'
  error?: Error
}
```

### **Theme**

```typescript
interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    accent: string
    // ... more colors
  }
  typography: {
    fontFamily: { sans: string; mono: string }
    fontSize: Record<string, string>
    fontWeight: Record<string, number>
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}
```

### **Suggestion**

```typescript
interface Suggestion {
  id: string
  text: string
  type: 'quick-reply' | 'command' | 'completion'
  description?: string
  icon?: React.ReactNode
  action?: () => void
}
```

---

## 🔗 **Related Documentation**

- [Hooks API](./hooks.md) - All custom hooks
- [Utilities API](./utilities.md) - Helper functions
- [TypeScript Types](./types.md) - Complete type reference
- [Examples](../examples/README.md) - Code examples

---

**Need help?** [Join our Discord](https://discord.gg/clarity-chat) or [open an issue](https://github.com/christireid/Clarity-ai-chat-components/issues).
