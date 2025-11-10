# React Components API Documentation

This document provides comprehensive API documentation for all React components in the Clarity Chat component library.

---

## ChatInput

Enhanced chat input component with smooth animations, character counting, and comprehensive state management.

### Import

```tsx
import { ChatInput } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Input value (controlled) |
| `onChange` | `(value: string) => void` | - | Change handler |
| `onSubmit` | `(value: string) => void \| Promise<void>` | - | Submit handler |
| `placeholder` | `string` | `'Type a message...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |
| `maxLength` | `number` | - | Maximum character length |
| `showCharCounter` | `boolean` | `true` | Show character counter |
| `warningThreshold` | `number` | `0.8` | Warning threshold (0-1) |
| `animateHeight` | `boolean` | `true` | Enable height animation |
| `glowOnFocus` | `boolean` | `true` | Enable focus glow |
| `className` | `string` | - | Additional CSS classes |

### Features

- Smooth expand/contract animation as user types
- Character counter with color-coded feedback
- Progress bar showing character limit
- Glowing focus ring with pulse animation
- Send button state transitions (idle → loading → success → error)
- Auto-resize textarea up to 6 lines
- Error shake animation when over limit
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Examples

```tsx
<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={500}
  showCharCounter
/>
```

---

## Message

Enhanced message component for displaying chat messages with animations, feedback, and interactive features.

### Import

```tsx
import { Message } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `Message` | - | Message object (from @clarity-chat/types) |
| `onCopy` | `(content: string) => void` | - | Copy handler |
| `onFeedback` | `(type: 'up' \| 'down') => void` | - | Feedback handler |
| `onRetry` | `() => void` | - | Retry handler |
| `onEdit` | `(content: string) => void` | - | Edit handler |
| `showAvatar` | `boolean` | `true` | Show avatar |
| `showTimestamp` | `boolean` | `true` | Show timestamp |
| `className` | `string` | - | Additional CSS classes |

### Message Type

```tsx
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status?: 'streaming' | 'complete' | 'error'
  timestamp?: Date
  feedback?: {
    type: 'up' | 'down'
  }
}
```

### Features

- Slide-in animations
- Hover actions
- Feedback buttons with confetti
- Streaming cursor pulse
- Avatar bounce animations
- Copy functionality
- Retry on error
- Markdown rendering

### Examples

```tsx
<Message
  message={message}
  onCopy={handleCopy}
  onFeedback={handleFeedback}
  onRetry={handleRetry}
/>
```

---

## ChatWindow

Complete chat window component combining MessageList and ChatInput.

### Import

```tsx
import { ChatWindow } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `Message[]` | - | Array of messages |
| `onSend` | `(content: string) => Promise<void>` | - | Send handler |
| `isLoading` | `boolean` | `false` | Loading state |
| `placeholder` | `string` | - | Input placeholder |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<ChatWindow
  messages={messages}
  onSend={handleSend}
  isLoading={isLoading}
/>
```

---

## Toast

Toast notification component for displaying temporary messages.

### Import

```tsx
import { Toast, useToast } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Toast title |
| `description` | `string` | - | Toast description |
| `variant` | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'` | Toast variant |
| `duration` | `number` | `5000` | Duration in milliseconds |
| `onClose` | `() => void` | - | Close handler |

### Hook Usage

```tsx
const { toast } = useToast()

toast({
  title: 'Success',
  description: 'Message sent',
  variant: 'success',
})
```

---

## CommandPalette

Command palette component for quick actions and navigation.

### Import

```tsx
import { CommandPalette } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state change handler |
| `commands` | `Command[]` | - | Array of commands |
| `onSelect` | `(command: Command) => void` | - | Command selection handler |

### Command Type

```tsx
interface Command {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  group?: string
}
```

### Examples

```tsx
<CommandPalette
  open={isOpen}
  onOpenChange={setIsOpen}
  commands={commands}
  onSelect={handleSelect}
/>
```

---

## FileUpload

File upload component with drag-and-drop support.

### Import

```tsx
import { FileUpload } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(files: File[]) => void` | - | Upload handler |
| `accept` | `string` | - | Accepted file types |
| `maxSize` | `number` | - | Maximum file size in bytes |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `disabled` | `boolean` | `false` | Disable upload |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<FileUpload
  onUpload={handleUpload}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple
/>
```

---

## TokenCounter

Token counter component for displaying token usage and warnings.

### Import

```tsx
import { TokenCounter } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tokens` | `number` | - | Current token count |
| `limit` | `number` | - | Token limit |
| `warningThreshold` | `number` | `0.8` | Warning threshold (0-1) |
| `showCost` | `boolean` | `false` | Show cost estimate |
| `costPerToken` | `number` | - | Cost per token |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<TokenCounter
  tokens={1500}
  limit={2000}
  warningThreshold={0.8}
  showCost
  costPerToken={0.0001}
/>
```

---

## ThinkingIndicator

Thinking indicator component for showing AI processing state.

### Import

```tsx
import { ThinkingIndicator } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `'Thinking...'` | Indicator message |
| `variant` | `'dots' \| 'pulse' \| 'spinner'` | `'dots'` | Animation variant |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<ThinkingIndicator message="Processing your request..." variant="dots" />
```

---

## ErrorBoundary

Error boundary component for catching and displaying React errors.

### Import

```tsx
import { ErrorBoundary } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | `React.ComponentType<{error: Error}>` | - | Custom fallback component |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | Error handler |
| `children` | `React.ReactNode` | - | Child components |

### Examples

```tsx
<ErrorBoundary
  fallback={ErrorFallback}
  onError={(error) => console.error(error)}
>
  <App />
</ErrorBoundary>
```

---

## StreamingMessage

Message component optimized for streaming content.

### Import

```tsx
import { StreamingMessage } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | Streaming content |
| `isStreaming` | `boolean` | `false` | Streaming state |
| `onComplete` | `() => void` | - | Completion handler |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
<StreamingMessage
  content={streamingContent}
  isStreaming={true}
  onComplete={handleComplete}
/>
```

---

## ContextCard

Card component for displaying context information.

### Import

```tsx
import { ContextCard } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `description` | `string` | - | Card description |
| `icon` | `React.ReactNode` | - | Icon element |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |

---

## CitationCard

Card component for displaying citations and references.

### Import

```tsx
import { CitationCard } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Citation title |
| `url` | `string` | - | Source URL |
| `excerpt` | `string` | - | Excerpt text |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |

---

## SessionSummaryCard

Card component for displaying session summaries.

### Import

```tsx
import { SessionSummaryCard } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Session title |
| `summary` | `string` | - | Summary text |
| `messageCount` | `number` | - | Number of messages |
| `timestamp` | `Date` | - | Session timestamp |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |

---

## FollowUpSuggestions

Component for displaying follow-up question suggestions.

### Import

```tsx
import { FollowUpSuggestions } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `suggestions` | `string[]` | - | Array of suggestions |
| `onSelect` | `(suggestion: string) => void` | - | Selection handler |
| `maxVisible` | `number` | `3` | Maximum visible suggestions |
| `className` | `string` | - | Additional CSS classes |

---

## PersonaPanel

Panel component for managing AI persona settings.

### Import

```tsx
import { PersonaPanel } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `persona` | `Persona` | - | Persona object |
| `onChange` | `(persona: Persona) => void` | - | Change handler |
| `className` | `string` | - | Additional CSS classes |

---

## ModelSelector

Component for selecting AI models.

### Import

```tsx
import { ModelSelector } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `models` | `Model[]` | - | Array of available models |
| `selected` | `string` | - | Selected model ID |
| `onSelect` | `(modelId: string) => void` | - | Selection handler |
| `className` | `string` | - | Additional CSS classes |

---

## ConversationList

List component for displaying conversations.

### Import

```tsx
import { ConversationList } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `conversations` | `Conversation[]` | - | Array of conversations |
| `selected` | `string` | - | Selected conversation ID |
| `onSelect` | `(id: string) => void` | - | Selection handler |
| `onDelete` | `(id: string) => void` | - | Delete handler |
| `className` | `string` | - | Additional CSS classes |

---

## ThemeSwitcher

Component for switching between light and dark themes.

### Import

```tsx
import { ThemeSwitcher } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'toggle' \| 'select'` | `'toggle'` | Display variant |
| `className` | `string` | - | Additional CSS classes |

---

## NetworkStatus

Component for displaying network connection status.

### Import

```tsx
import { NetworkStatus } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'online' \| 'offline' \| 'slow'` | - | Network status |
| `showDetails` | `boolean` | `false` | Show detailed information |
| `className` | `string` | - | Additional CSS classes |

---

## RetryButton

Button component for retrying failed operations.

### Import

```tsx
import { RetryButton } from '@clarity-chat/react'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRetry` | `() => void` | - | Retry handler |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | - | Additional CSS classes |

---

## Enterprise Components

### SSOConfigWizard

Wizard component for configuring SSO settings.

### AuthTenantDashboard

Dashboard component for managing tenant authentication.

### SafetyReviewConsole

Console component for reviewing AI safety highlights.

### EvaluationDashboard

Dashboard component for evaluating AI model performance.

---

## Design Tokens

All React components use consistent design tokens matching the primitives:

- **Border Radius**: `rounded-lg` (8px)
- **Transitions**: `duration-150` (150ms)
- **Shadows**: Layered shadow system
- **Borders**: 1px with opacity
- **Focus Rings**: Consistent focus states

---

## Accessibility

All React components follow accessibility best practices:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

---

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type { ChatInputProps, MessageProps } from '@clarity-chat/react'
```
