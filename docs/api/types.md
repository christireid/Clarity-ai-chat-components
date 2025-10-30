# 📘 TypeScript Types Reference

> **Complete type definitions for type-safe development**

---

## 📚 Overview

Clarity Chat is built with TypeScript-first design, providing comprehensive type definitions for:
- 💬 **Messages** - Chat message types
- 👤 **Users** - User and participant types
- 🎨 **Themes** - Theme configuration types
- 🔌 **Providers** - AI and analytics provider types
- ⚙️ **Configuration** - Component configuration types
- 🎭 **Events** - Event handler types
- 📊 **Analytics** - Analytics event types
- ❌ **Errors** - Error class types

---

## 💬 Message Types

### `Message`

Core message type used throughout the library.

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  
  // Optional properties
  name?: string
  avatar?: string
  metadata?: Record<string, any>
  error?: boolean
  loading?: boolean
  streaming?: boolean
  
  // Advanced features
  attachments?: Attachment[]
  citations?: Citation[]
  toolCalls?: ToolCall[]
  feedback?: MessageFeedback
}
```

**Usage:**
```typescript
import type { Message } from '@clarity-chat/types'

const message: Message = {
  id: crypto.randomUUID(),
  role: 'user',
  content: 'Hello, AI!',
  timestamp: new Date(),
}
```

### `MessageRole`

Message role type.

```typescript
type MessageRole = 'user' | 'assistant' | 'system'
```

### `Attachment`

File attachment type.

```typescript
interface Attachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'document' | 'other'
  name: string
  url: string
  size: number
  mimeType: string
  thumbnail?: string
}
```

### `Citation`

Source citation type.

```typescript
interface Citation {
  id: string
  title: string
  url?: string
  snippet?: string
  source?: string
  relevance?: number
}
```

### `ToolCall`

Function/tool call type.

```typescript
interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  error?: string
  status: 'pending' | 'success' | 'error'
}
```

### `MessageFeedback`

User feedback on messages.

```typescript
interface MessageFeedback {
  helpful?: boolean
  rating?: 1 | 2 | 3 | 4 | 5
  comment?: string
  timestamp: Date
}
```

---

## 👤 User Types

### `User`

User/participant type.

```typescript
interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: 'admin' | 'user' | 'guest'
  metadata?: Record<string, any>
}
```

### `Conversation`

Conversation metadata type.

```typescript
interface Conversation {
  id: string
  title: string
  messages: Message[]
  participants: User[]
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}
```

---

## 🎨 Theme Types

### `Theme`

Complete theme configuration.

```typescript
interface Theme {
  name: string
  colors: ThemeColors
  fonts?: ThemeFonts
  spacing?: ThemeSpacing
  borderRadius?: string
  shadows?: ThemeShadows
  animations?: ThemeAnimations
}
```

### `ThemeColors`

Color palette definition.

```typescript
interface ThemeColors {
  // Base colors
  background: string
  foreground: string
  
  // Brand colors
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  
  // UI colors
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  
  // Semantic colors
  destructive: string
  destructiveForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  
  // Component colors
  border: string
  input: string
  ring: string
  
  // Message colors
  messageBubbleUser: string
  messageBubbleAssistant: string
  messageTextUser: string
  messageTextAssistant: string
}
```

### `ThemeFonts`

Typography configuration.

```typescript
interface ThemeFonts {
  body: string
  heading: string
  mono: string
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
  }
}
```

### `ThemeAnimations`

Animation configuration.

```typescript
interface ThemeAnimations {
  duration: {
    fast: number
    normal: number
    slow: number
  }
  easing: {
    default: string
    in: string
    out: string
    inOut: string
  }
}
```

---

## 🤖 AI Provider Types

### `AIProvider`

AI provider interface.

```typescript
interface AIProvider {
  name: string
  apiKey?: string
  baseURL?: string
  
  // Methods
  chat(messages: Message[], options?: ChatOptions): Promise<Message>
  stream(messages: Message[], options?: ChatOptions): AsyncGenerator<string>
  embed(text: string): Promise<number[]>
}
```

### `ChatOptions`

Chat completion options.

```typescript
interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  stream?: boolean
  tools?: Tool[]
}
```

### `Tool`

Function calling tool definition.

```typescript
interface Tool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, any>
      required?: string[]
    }
  }
}
```

---

## 📊 Analytics Types

### `AnalyticsEvent`

Analytics event type.

```typescript
interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: Date
  userId?: string
  sessionId?: string
}
```

### `AnalyticsProvider`

Analytics provider interface.

```typescript
interface AnalyticsProvider {
  name: string
  
  // Methods
  track(event: string, properties?: Record<string, any>): void
  page(name: string, properties?: Record<string, any>): void
  identify(userId: string, traits?: Record<string, any>): void
  group(groupId: string, traits?: Record<string, any>): void
  reset(): void
}
```

### `AnalyticsConfig`

Analytics configuration.

```typescript
interface AnalyticsConfig {
  enabled: boolean
  providers: AnalyticsProvider[]
  debug?: boolean
  autoTrack?: {
    pageViews?: boolean
    errors?: boolean
    performance?: boolean
  }
  respectDoNotTrack?: boolean
}
```

---

## ⚙️ Component Props Types

### `ChatWindowProps`

Main chat window props.

```typescript
interface ChatWindowProps {
  // Required
  messages: Message[]
  onSendMessage: (content: string) => void | Promise<void>
  
  // Optional
  isLoading?: boolean
  placeholder?: string
  showTimestamps?: boolean
  showAvatars?: boolean
  enableFileUpload?: boolean
  enableVoiceInput?: boolean
  enableMarkdown?: boolean
  autoScroll?: boolean
  autoFocus?: boolean
  
  // Customization
  header?: ReactNode
  footer?: ReactNode
  className?: string
  
  // Event handlers
  onMessageEdit?: (messageId: string, content: string) => void
  onMessageDelete?: (messageId: string) => void
  onCopy?: (content: string) => void
  onFileUpload?: (file: File) => void | Promise<void>
  
  // Accessibility
  ariaLabel?: string
  ariaLive?: 'polite' | 'assertive'
  
  // Advanced
  virtualizeMessages?: boolean
  mobileOptimized?: boolean
  enableKeyboardShortcuts?: boolean
}
```

### `MessageListProps`

Message list props.

```typescript
interface MessageListProps {
  messages: Message[]
  showTimestamps?: boolean
  showAvatars?: boolean
  virtualized?: boolean
  className?: string
  
  onCopy?: (content: string) => void
  onEdit?: (messageId: string, content: string) => void
  onDelete?: (messageId: string) => void
  onFeedback?: (messageId: string, feedback: MessageFeedback) => void
}
```

### `ChatInputProps`

Chat input props.

```typescript
interface ChatInputProps {
  value?: string
  onChange?: (value: string) => void
  onSend: (content: string) => void | Promise<void>
  
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  maxLength?: number
  minRows?: number
  maxRows?: number
  
  enableFileUpload?: boolean
  enableVoiceInput?: boolean
  enableFormatting?: boolean
  enableEmoji?: boolean
  
  className?: string
  autoFocus?: boolean
  
  onFocus?: () => void
  onBlur?: () => void
  onFileSelect?: (file: File) => void
}
```

---

## ❌ Error Types

### `AppError`

Base error class.

```typescript
class AppError extends Error {
  code: string
  statusCode?: number
  details?: Record<string, any>
  recoverable: boolean
  
  constructor(message: string, options?: ErrorOptions)
}
```

### Error Classes

```typescript
// Network errors
class NetworkError extends AppError {}

// API errors
class APIError extends AppError {
  statusCode: number
  endpoint?: string
}

// Validation errors
class ValidationError extends AppError {
  field?: string
  constraint?: string
}

// Authentication errors
class AuthenticationError extends AppError {}

// Configuration errors
class ConfigurationError extends AppError {}

// Timeout errors
class TimeoutError extends AppError {
  timeout: number
}

// Rate limit errors
class RateLimitError extends AppError {
  retryAfter?: number
  limit?: number
}

// Streaming errors
class StreamError extends AppError {}

// Context errors
class ContextError extends AppError {}
```

---

## 🎭 Event Handler Types

### Common Event Handlers

```typescript
// Message events
type OnSendMessage = (content: string) => void | Promise<void>
type OnMessageEdit = (messageId: string, content: string) => void
type OnMessageDelete = (messageId: string) => void
type OnMessageCopy = (content: string) => void

// File events
type OnFileUpload = (file: File) => void | Promise<void>
type OnFileDelete = (fileId: string) => void

// Voice events
type OnVoiceTranscript = (transcript: string) => void
type OnVoiceStart = () => void
type OnVoiceStop = () => void
type OnVoiceError = (error: string) => void

// UI events
type OnThemeChange = (theme: Theme) => void
type OnSettingsChange = (settings: Settings) => void

// Analytics events
type OnTrackEvent = (event: string, properties?: Record<string, any>) => void

// Error events
type OnError = (error: Error) => void
```

---

## 🔄 Hook Return Types

### `UseChatReturn`

Return type of `useChat` hook.

```typescript
interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  
  sendMessage: (content: string) => Promise<void>
  editMessage: (messageId: string, content: string) => void
  deleteMessage: (messageId: string) => void
  clearMessages: () => void
  regenerateMessage: (messageId: string) => Promise<void>
  
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}
```

### `UseStreamingReturn`

Return type of `useStreaming` hook.

```typescript
interface UseStreamingReturn {
  isStreaming: boolean
  streamingMessageId: string | null
  error: Error | null
  
  streamMessage: (url: string, options: RequestInit) => Promise<void>
  cancelStream: () => void
}
```

### `UseVoiceInputReturn`

Return type of `useVoiceInput` hook.

```typescript
interface UseVoiceInputReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  error: string | null
  
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}
```

---

## 💡 Usage Examples

### Complete Type-Safe Component

```typescript
import type { 
  Message, 
  ChatWindowProps, 
  Theme,
  AnalyticsEvent,
} from '@clarity-chat/types'
import { ChatWindow, ThemeProvider } from '@clarity-chat/react'

interface MyChatProps {
  userId: string
  conversationId: string
  theme: Theme
}

function MyChat({ userId, conversationId, theme }: MyChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  
  const handleSend: ChatWindowProps['onSendMessage'] = async (content) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, message])
  }
  
  const handleEdit: ChatWindowProps['onMessageEdit'] = (id, content) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content } : msg
    ))
  }
  
  return (
    <ThemeProvider theme={theme}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        onMessageEdit={handleEdit}
        showTimestamps
        enableFileUpload
      />
    </ThemeProvider>
  )
}
```

---

## 📚 Best Practices

### ✅ Do's
- Import types from `@clarity-chat/types`
- Use explicit type annotations
- Leverage TypeScript's inference
- Use discriminated unions for variants
- Define custom types for domain logic
- Use `Partial<>` for optional props
- Use `Pick<>` and `Omit<>` for derived types

### ❌ Don'ts
- Don't use `any` type
- Don't ignore TypeScript errors
- Don't duplicate type definitions
- Don't use loose types
- Don't bypass type checking
- Don't use `as` assertions unnecessarily

---

## 🔗 Related Documentation

- **[Components API](./components.md)** - Component props
- **[Hooks API](./hooks.md)** - Hook return types
- **[Utilities](./utilities.md)** - Utility functions
- **[Theming](../guides/theming.md)** - Theme types

---

**Build with confidence using TypeScript!** 📘
