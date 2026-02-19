# Clarity Chat Components - API Reference

> **Complete API reference for the 8 core Clarity Chat components**
> **Generated:** January 28, 2026

---

## Table of Contents

1. [ClarityChat](#1-claritychat) - Drop-in chat component
2. [ClarityChatApp](#2-claritychatapp) - Top-level app wrapper
3. [ChatWindow](#3-chatwindow) - Main chat container
4. [ChatInput](#4-chatinput) - Message input
5. [MessageList](#5-messagelist) - Message display
6. [Message](#6-message) - Individual message
7. [StreamingMessage](#7-streamingmessage) - Streaming message display
8. [TypingIndicator](#8-typingindicator) - Loading state

---

## 1. ClarityChat

> The simplest way to add AI chat to your app. Drop-in component with built-in streaming, memory, and error handling.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
```

### Basic Usage

```tsx
// app/page.tsx
import { ClarityChat } from '@clarity-chat/react'

export default function ChatPage() {
  return <ClarityChat api="/api/chat" />
}
```

### Examples

#### With Header and Session Info

```tsx
<ClarityChat
  api="/api/chat"
  header={{
    show: true,
    title: "AI Assistant",
    subtitle: "Powered by Claude",
    showMessageCount: true
  }}
/>
```

#### With Memory Enabled

```tsx
<ClarityChat
  api="/api/chat"
  memory={{
    enabled: true,
    strategy: 'vector-store'
  }}
  header={{
    show: true,
    title: "Smart Assistant",
    subtitle: "Remembers your conversations"
  }}
/>
```

#### Robust Setup

```tsx
import { ClarityChat } from '@clarity-chat/react'
import { toast } from 'sonner'

export default function ChatPage() {
  return (
    <ClarityChat
      api="/api/chat"
      
      // Header
      header={{
        show: true,
        title: "AI Assistant",
        subtitle: "Powered by Claude Opus 4.5",
        showMessageCount: true
      }}
      
      // Memory
      memory={{
        enabled: true,
        strategy: 'vector-store',
        maxTokens: 100000
      }}
      
      // Message Actions
      messageActions={{
        onCopy: (id, content) => {
          navigator.clipboard.writeText(content)
          toast.success('Copied!')
        },
        onFeedback: (id, type, comment) => {
          fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify({ id, type, comment })
          })
          toast.success('Feedback received')
        }
      }}
      
      // Rate Limiting
      rateLimiting={{
        enable: true,
        maxConcurrentRequests: 3,
        showQueueStatus: true
      }}
      
      // Error Handling
      onError={(error) => {
        console.error('Chat error:', error)
        toast.error('Something went wrong')
      }}
      
      // Styling
      className="h-screen"
      theme="light"
      showTokenCounter={true}
      showNetworkStatus={true}
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api` | `string` | **required** | API endpoint URL for chat |
| `chatId` | `string` | - | Optional chat ID for persistence |
| `header` | `ClarityChatHeaderProps` | - | Header configuration |
| `messageActions` | `ClarityChatMessageActionsProps` | - | Message action callbacks |
| `prompts` | `ClarityChatPromptsProps` | - | Prompt configuration |
| `rateLimiting` | `ClarityChatRateLimitingProps` | - | Rate limiting configuration |
| `memory` | `MemoryConfig` | - | Memory configuration |
| `className` | `string` | - | Optional CSS class name |
| `theme` | `string` | - | Theme for the interface |
| `showTokenCounter` | `boolean` | `false` | Show token counter in input |
| `onError` | `(error: Error) => void` | - | Error handler callback |

### Accessibility

- **Keyboard Navigation:** Tab, Enter, Shift+Enter, End, Escape
- **Screen Reader:** Announces new messages via aria-live
- **ARIA:** Complete landmark structure with descriptive labels

### Related

- [ChatWindow](/reference/components/chat-window) - Mid-level composable
- [useClarityChat](/reference/hooks/use-clarity-chat) - Core chat hook

---

## 2. ClarityChatApp

> Top-level app wrapper with theming, providers, and global state management.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { ClarityChatApp } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      theme="light"
    />
  )
}
```

### Examples

#### Custom Renderers

```tsx
<ClarityChatApp
  api="/api/chat"
  renderMessage={(message) => (
    <CustomMessage message={message} />
  )}
  renderInput={(props) => (
    <CustomInput {...props} />
  )}
  renderHeader={() => (
    <CustomHeader />
  )}
/>
```

#### With All Providers

```tsx
<ClarityChatApp
  api="/api/chat"
  theme="dark"
  enableErrorBoundary={true}
  enableMemory={true}
  enableAnalytics={true}
  onEvent={(event) => {
    console.log('Chat event:', event)
  }}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api` | `string` | **required** | API endpoint URL |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme mode |
| `renderMessage` | `(message: Message) => ReactNode` | - | Custom message renderer |
| `renderInput` | `(props: InputProps) => ReactNode` | - | Custom input renderer |
| `renderHeader` | `() => ReactNode` | - | Custom header renderer |
| `enableErrorBoundary` | `boolean` | `true` | Enable error boundary |
| `onEvent` | `(event: ClarityEvent) => void` | - | Event handler |

### Accessibility

- Wraps entire app with A11yProvider
- Manages focus restoration
- Provides announce() function for screen readers

---

## 3. ChatWindow

> Mid-level composable chat container component with message list, input, and header.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { ChatWindow } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

export default function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat'
  })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### Examples

#### With Header

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  header={{
    show: true,
    title: "AI Assistant",
    subtitle: "Ask me anything",
    showMessageCount: true
  }}
/>
```

#### With Message Actions

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  messageActions={{
    onCopy: (id, content) => navigator.clipboard.writeText(content),
    onFeedback: (id, type) => trackFeedback(id, type),
    onRetry: (id) => retryMessage(id)
  }}
/>
```

#### With Stop Generation

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={handleSend}
  onStopGeneration={() => {
    controller.abort()
    setIsLoading(false)
  }}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `Message[] \| CoreMessage[]` | **required** | Messages array |
| `isLoading` | `boolean` | `false` | Loading state |
| `onSendMessage` | `(content: string) => void` | **required** | Send handler |
| `onStopGeneration` | `() => void` | - | Stop streaming handler |
| `messageActions` | `ChatWindowMessageActions` | - | Message callbacks |
| `header` | `ChatWindowHeaderConfig` | - | Header configuration |
| `className` | `string` | - | CSS class name |

### Accessibility

- Skip links to messages and input
- Live region for new messages
- Keyboard shortcuts (End key to scroll)
- Complete ARIA landmark structure

---

## 4. ChatInput

> Composable input component with character counting, validation, and animations.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { ChatInput } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { ChatInput } from '@clarity-chat/react'
import { useState } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  
  return (
    <ChatInput
      value={input}
      onChange={setInput}
      onSubmit={(value) => {
        sendMessage(value)
        setInput('')
      }}
    />
  )
}
```

### Examples

#### With Character Limit

```tsx
<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  maxLength={500}
  showCharCounter={true}
  warningThreshold={0.9}
/>
```

#### With Loading State

```tsx
<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  disabled={isLoading}
  placeholder={isLoading ? "Sending..." : "Type a message..."}
/>
```

#### Without Animations

```tsx
<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
  animateHeight={false}
  glowOnFocus={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Current input value |
| `onChange` | `(value: string) => void` | **required** | Change handler |
| `onSubmit` | `(value: string) => void \| Promise<void>` | **required** | Submit handler |
| `placeholder` | `string` | `"Type a message..."` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `maxLength` | `number` | - | Maximum character length |
| `showCharCounter` | `boolean` | `true` | Show character counter |
| `warningThreshold` | `number` | `0.8` | Warning threshold (0-1) |
| `animateHeight` | `boolean` | `true` | Enable height animation |
| `glowOnFocus` | `boolean` | `true` | Enable focus glow |

### Accessibility

- Enter to submit, Shift+Enter for newline
- Character counter announced to screen readers
- Error messages with aria-live
- Disabled state properly communicated

---

## 5. MessageList

> Composable message list with auto-scrolling, animations, and message grouping.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { MessageList } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { MessageList } from '@clarity-chat/react'

export default function Chat() {
  return (
    <MessageList
      messages={messages}
      isLoading={isLoading}
      onMessageCopy={(id, content) => navigator.clipboard.writeText(content)}
    />
  )
}
```

### Examples

#### With Message Actions

```tsx
<MessageList
  messages={messages}
  onMessageCopy={(id, content) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied!')
  }}
  onMessageFeedback={(id, type, comment) => {
    trackFeedback(id, type, comment)
  }}
  onMessageRetry={(id) => retryMessage(id)}
  onEditMessage={(id) => setEditingId(id)}
  onRegenerateMessage={(id) => regenerate(id)}
  onDeleteMessage={(id) => deleteMessage(id)}
/>
```

#### With Custom Empty State

```tsx
<MessageList
  messages={messages}
  emptyState={
    <div className="text-center">
      <h3>No messages yet</h3>
      <p>Start a conversation!</p>
    </div>
  }
/>
```

#### Without Grouping

```tsx
<MessageList
  messages={messages}
  enableGrouping={false}
  showTimeSeparators={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `MessageType[]` | **required** | Messages to display |
| `onMessageCopy` | `(id: string, content: string) => void` | - | Copy callback |
| `onMessageFeedback` | `(id: string, type: 'up' \| 'down', comment?: string) => void` | - | Feedback callback |
| `onMessageRetry` | `(id: string) => void` | - | Retry callback |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `emptyState` | `ReactNode` | - | Custom empty state |
| `enableGrouping` | `boolean` | `true` | Enable message grouping |
| `showTimeSeparators` | `boolean` | `true` | Show time separators |
| `autoScroll` | `boolean` | `true` | Auto-scroll to bottom |

### Accessibility

- Jump-to-bottom button with new message count
- End key to scroll to bottom
- Announces new messages to screen readers
- Role="log" with aria-live="polite"

---

## 6. Message

> Individual message component with markdown rendering and actions.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { Message } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { Message } from '@clarity-chat/react'

export default function ChatMessage({ message }) {
  return (
    <Message
      message={message}
      onCopy={(content) => navigator.clipboard.writeText(content)}
    />
  )
}
```

### Examples

#### With All Actions

```tsx
<Message
  message={message}
  onCopy={handleCopy}
  onFeedback={handleFeedback}
  onRetry={handleRetry}
  onEdit={handleEdit}
  onRegenerate={handleRegenerate}
  onDelete={handleDelete}
  onStopGeneration={handleStop}
/>
```

#### Without Avatar or Timestamp

```tsx
<Message
  message={message}
  showAvatar={false}
  showTimestamp={false}
/>
```

#### Grouped Messages

```tsx
<Message
  message={message}
  isGroupStart={false}
  isGroupEnd={true}
  isGrouped={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `MessageType` | **required** | Message data |
| `onCopy` | `(content: string) => void` | - | Copy callback |
| `onFeedback` | `(type: 'up' \| 'down', comment?: string) => void` | - | Feedback callback |
| `onRetry` | `() => void` | - | Retry callback |
| `onEdit` | `(id: string) => void` | - | Edit callback |
| `onRegenerate` | `(id: string) => void` | - | Regenerate callback |
| `onDelete` | `(id: string) => void` | - | Delete callback |
| `showAvatar` | `boolean` | `true` | Show avatar |
| `showTimestamp` | `boolean` | `true` | Show timestamp |
| `isGroupStart` | `boolean` | `true` | First in group |
| `isGroupEnd` | `boolean` | `true` | Last in group |
| `isGrouped` | `boolean` | `false` | Part of group |

### Accessibility

- role="article" with descriptive aria-label
- Focus management for edit mode
- Announces edit state changes
- Keyboard-accessible actions

---

## 7. StreamingMessage

> Streaming message display with tool calls, citations, and thinking steps.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { StreamingMessage } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { StreamingMessage } from '@clarity-chat/react'

export default function StreamingResponse() {
  return (
    <StreamingMessage
      content={streamingContent}
      isStreaming={true}
    />
  )
}
```

### Examples

#### With Tool Calls

```tsx
<StreamingMessage
  content={content}
  isStreaming={true}
  toolCalls={[
    {
      id: 'call-1',
      function: {
        name: 'search',
        arguments: '{"query": "weather"}'
      }
    }
  ]}
  showTools={true}
  onToolApprove={(tool) => executeTool(tool)}
  onToolReject={(tool) => cancelTool(tool)}
/>
```

#### With Citations

```tsx
<StreamingMessage
  content={content}
  citations={[
    {
      id: 'cite-1',
      source: 'Documentation',
      chunkText: 'Relevant excerpt...',
      confidence: 0.95
    }
  ]}
  showCitations={true}
/>
```

#### With Thinking Steps

```tsx
<StreamingMessage
  content={content}
  isStreaming={true}
  thinkingSteps={[
    "Analyzing query...",
    "Searching knowledge base...",
    "Found 5 relevant documents"
  ]}
  currentThinkingStep="Formulating response..."
  showThinking={true}
/>
```

#### Smooth Streaming

```tsx
<StreamingMessage
  content={content}
  isStreaming={true}
  smoothStreaming={true}
  streamingSpeed="normal"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | **required** | Accumulated content |
| `isStreaming` | `boolean` | `false` | Streaming in progress |
| `toolCalls` | `ToolCall[]` | `[]` | Tool calls made |
| `citations` | `Citation[]` | `[]` | Citations/sources |
| `thinkingSteps` | `string[]` | `[]` | Thinking steps |
| `currentThinkingStep` | `string` | - | Current step |
| `error` | `string` | - | Error message |
| `showThinking` | `boolean` | `true` | Show thinking steps |
| `showCitations` | `boolean` | `true` | Show citations |
| `showTools` | `boolean` | `true` | Show tool calls |
| `smoothStreaming` | `boolean` | `false` | Enable smooth animation |
| `streamingSpeed` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Streaming speed |
| `onRetry` | `() => void` | - | Retry after error |

### Accessibility

- Streaming cursor with aria-hidden
- Error alerts with role="alert"
- Loading states announced
- Keyboard-accessible tool approval

---

## 8. TypingIndicator

> Classic "typing..." indicator with animated dots.

### Installation

```bash
pnpm add @clarity-chat/react
```

### Import

```tsx
import { TypingIndicator } from '@clarity-chat/react'
```

### Basic Usage

```tsx
import { TypingIndicator } from '@clarity-chat/react'

export default function Chat() {
  return (
    <>
      {isAITyping && <TypingIndicator />}
    </>
  )
}
```

### Examples

#### With Custom Label

```tsx
<TypingIndicator label="Assistant is thinking..." />
```

#### Without Avatar

```tsx
<TypingIndicator showAvatar={false} />
```

#### Different Variants

```tsx
// Dots (default)
<TypingIndicator variant="dots" />

// Pulse
<TypingIndicator variant="pulse" />

// Wave
<TypingIndicator variant="wave" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAvatar` | `boolean` | `true` | Show avatar |
| `avatarSrc` | `string` | - | Avatar source URL |
| `avatarFallback` | `string` | `"AI"` | Avatar fallback text |
| `label` | `string` | `"AI is typing"` | Label text |
| `variant` | `'dots' \| 'pulse' \| 'wave'` | `'dots'` | Animation variant |
| `className` | `string` | - | CSS class name |

### Accessibility

- role="status" with aria-live="polite"
- Announces typing state to screen readers
- Reduced motion support

---

## Integration Examples

### Full Chat Application

```tsx
import { ClarityChat } from '@clarity-chat/react'
import { toast } from 'sonner'

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <ClarityChat
        api="/api/chat"
        
        header={{
          show: true,
          title: "AI Assistant",
          showMessageCount: true
        }}
        
        memory={{
          enabled: true,
          strategy: 'vector-store'
        }}
        
        messageActions={{
          onCopy: (id, content) => {
            navigator.clipboard.writeText(content)
            toast.success('Copied!')
          },
          onFeedback: async (id, type, comment) => {
            await fetch('/api/feedback', {
              method: 'POST',
              body: JSON.stringify({ id, type, comment })
            })
            toast.success('Thank you for your feedback!')
          }
        }}
        
        rateLimiting={{
          enable: true,
          maxConcurrentRequests: 3,
          showQueueStatus: true
        }}
        
        className="flex-1"
      />
    </div>
  )
}
```

### Custom Implementation

```tsx
import { ChatWindow, useClarityChat } from '@clarity-chat/react'

export default function CustomChat() {
  const { messages, append, isLoading, stop } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true }
  })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
      onStopGeneration={stop}
      
      header={{
        show: true,
        title: "Custom Chat"
      }}
      
      messageActions={{
        onCopy: (id, content) => navigator.clipboard.writeText(content),
        onFeedback: (id, type) => trackFeedback(id, type)
      }}
    />
  )
}
```

---

## TypeScript Types

### Message Types

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date | string | number
  status?: 'pending' | 'streaming' | 'sent' | 'error'
  attachments?: Attachment[]
  feedback?: { type: 'up' | 'down'; comment?: string }
}

interface CoreMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
```

### Component Prop Types

```typescript
// ClarityChat
interface ClarityChatHeaderProps {
  show?: boolean
  title?: string
  subtitle?: string
  actions?: ReactNode
  showMessageCount?: boolean
}

interface ClarityChatMessageActionsProps {
  onCopy?: (id: string, content: string) => void
  onFeedback?: (id: string, type: 'up' | 'down', comment?: string) => void
  onEdit?: (id: string) => void
  onRegenerate?: (id: string) => void
  onDelete?: (id: string) => void
}

// ChatWindow
interface ChatWindowMessageActions {
  onCopy?: (messageId: string, content: string) => void
  onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  onRetry?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
}

interface ChatWindowHeaderConfig {
  show?: boolean
  title?: string
  subtitle?: string
  actions?: ReactNode
  showMessageCount?: boolean
}

// StreamingMessage
interface ToolCall {
  id: string
  function: {
    name: string
    arguments: string
  }
}

interface Citation {
  id: string
  source: string
  chunkText: string
  confidence?: number
}
```

---

## Common Patterns

### Error Handling

```tsx
<ClarityChat
  api="/api/chat"
  onError={(error) => {
    console.error('Chat error:', error)
    
    if (error.message.includes('rate limit')) {
      toast.error('Too many requests. Please try again later.')
    } else if (error.message.includes('network')) {
      toast.error('Network error. Check your connection.')
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }}
/>
```

### Message Persistence

```tsx
import { ClarityChat } from '@clarity-chat/react'
import { useEffect } from 'react'

export default function Chat({ chatId }: { chatId: string }) {
  return (
    <ClarityChat
      api="/api/chat"
      chatId={chatId}
      
      // Messages automatically persisted by chatId
      memory={{
        enabled: true,
        strategy: 'vector-store'
      }}
    />
  )
}
```

### Custom Styling

```tsx
<ClarityChat
  api="/api/chat"
  className="
    h-screen
    bg-gradient-to-br from-blue-50 to-purple-50
    dark:from-slate-900 dark:to-slate-800
  "
  theme="system"
/>
```

---

## Browser Support

- **Chrome/Edge:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **iOS Safari:** 14+
- **Android Chrome:** 90+

---

## Bundle Size

- **ClarityChat:** ~45KB (gzipped)
- **ChatWindow:** ~28KB (gzipped)
- **Message:** ~12KB (gzipped)
- **ChatInput:** ~8KB (gzipped)

All sizes include dependencies.

---

## License

MIT © Clarity AI Chat Components

---

**Last Updated:** January 28, 2026
**Version:** 1.0+
