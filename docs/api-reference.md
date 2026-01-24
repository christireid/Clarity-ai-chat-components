# API Reference

> **Complete API documentation** - Comprehensive reference for all Clarity Chat APIs

This document provides a complete reference for all public APIs in Clarity Chat. For getting started guides and examples, see the [Getting Started Guide](./getting-started.md) and [Cookbook](./cookbook/).

---

## Table of Contents

- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Types](#types)
- [Error Handling](#error-handling)

---

## Components

### ChatWindow

The main chat interface component.

```tsx
import { ChatWindow } from '@clarity-chat/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `Message[]` | `[]` | Array of chat messages to display |
| `isLoading` | `boolean` | `false` | Whether a message is currently being generated |
| `onSendMessage` | `(content: string) => void \| Promise<void>` | - | Callback when user sends a message |
| `error` | `string \| null` | `null` | Error message to display |
| `onRetry` | `() => void` | - | Callback when user clicks retry |
| `className` | `string` | - | Additional CSS classes |
| `emptyState` | `React.ReactNode` | - | Custom empty state component |
| `showAvatar` | `boolean` | `true` | Show avatars for messages |
| `showTimestamp` | `boolean` | `true` | Show timestamps |
| `enableMarkdown` | `boolean` | `true` | Enable markdown rendering |

#### Example

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  onSendMessage={async (content) => {
    await append({ role: 'user', content })
  }}
  error={error}
  onRetry={() => retry()}
/>
```

---

### ChatInput

Input component for sending messages.

```tsx
import { ChatInput } from '@clarity-chat/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Current input value |
| `onChange` | `(value: string) => void` | - | Callback when value changes |
| `onSubmit` | `(value: string) => void \| Promise<void>` | - | Callback when message is submitted |
| `placeholder` | `string` | `'Type a message...'` | Placeholder text |
| `maxLength` | `number` | - | Maximum character length |
| `showCharCounter` | `boolean` | `true` | Show character counter |
| `disabled` | `boolean` | `false` | Disable input |
| `className` | `string` | - | Additional CSS classes |

#### Example

```tsx
<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSend}
  maxLength={2000}
  placeholder="Ask me anything..."
/>
```

---

### Message

Individual message component.

```tsx
import { Message } from '@clarity-chat/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `Message` | - | Message object to display |
| `onFeedback` | `(type: 'up' \| 'down') => void` | - | Callback for feedback |
| `onCopy` | `(id: string, content: string) => void` | - | Callback when message is copied |
| `onRetry` | `(id: string) => void` | - | Callback when retry is requested |
| `showAvatar` | `boolean` | `true` | Show avatar |
| `showTimestamp` | `boolean` | `true` | Show timestamp |
| `enableMarkdown` | `boolean` | `true` | Enable markdown rendering |

#### Example

```tsx
<Message
  message={message}
  onFeedback={(type) => handleFeedback(message.id, type)}
  onCopy={(id, content) => copyToClipboard(content)}
  onRetry={(id) => retryMessage(id)}
/>
```

---

### MemoryProvider

Provider component for memory management.

```tsx
import { MemoryProvider } from '@clarity-chat/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `MemoryConfig` | - | Memory configuration |
| `children` | `React.ReactNode` | - | Child components |

#### Example

```tsx
<MemoryProvider config={{ maxTokens: 10000 }}>
  <ChatApp />
</MemoryProvider>
```

---

## Hooks

### useClarityChat

Flagship hook for building AI chat applications.

```tsx
import { useClarityChat } from '@clarity-chat/react'
```

#### Parameters

```typescript
interface UseClarityChatOptions {
  api: string
  memory?: {
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  transport?: 'sse' | 'websocket'
  headers?: Record<string, string>
  onBeforeSend?: (messages: CoreMessage[]) => Promise<CoreMessage[]>
  onToolCall?: (toolCall: ToolCall) => Promise<any>
}
```

#### Returns

```typescript
interface UseClarityChatReturn {
  messages: CoreMessage[]
  append: (message: CoreMessage) => Promise<void>
  isLoading: boolean
  error: Error | null
  memoryEnabled: boolean
  contextSummary: string | null
  retry: () => void
  stop: () => void
}
```

#### Example

```tsx
const {
  messages: coreMessages,
  append,
  isLoading,
  error,
  memoryEnabled,
} = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  },
})
```

---

### useClarityObject

Hook for structured output generation.

```tsx
import { useClarityObject } from '@clarity-chat/react'
```

#### Parameters

```typescript
interface UseClarityObjectOptions<T> {
  api: string
  schema: JSONSchema
  model?: string
}
```

#### Returns

```typescript
interface UseClarityObjectReturn<T> {
  object: T | null
  run: (prompt: string) => Promise<T>
  isLoading: boolean
  error: Error | null
}
```

#### Example

```tsx
interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product>({
  api: '/api/object',
  schema: productSchema,
})

await run('Generate a product recommendation')
```

---

### useMemory

Hook for memory management.

```tsx
import { useMemory } from '@clarity-chat/react'
```

#### Returns

```typescript
interface UseMemoryReturn {
  add: (content: string, options?: MemoryOptions) => Promise<string>
  search: (query: string, options?: SearchOptions) => Promise<MemoryResult[]>
  context: (options: ContextOptions) => Promise<ContextBundle>
  forget: (id: string) => Promise<void>
  getStats: () => Promise<MemoryStats>
}
```

#### Example

```tsx
const { add, search, context } = useMemory()

await add('User prefers dark mode', {
  type: 'semantic',
  importance: 0.9,
})

const results = await search('user preferences')
const bundle = await context({ maxTokens: 1000, query: 'preferences' })
```

---

## Utilities

### Core Utilities (@clarity-chat/utils)

For general-purpose utilities, import from the dedicated utils package:

```tsx
import {
  // Formatting
  formatBytes,
  formatDuration,
  formatNumber,
  formatPercent,
  truncate,

  // Validation
  isString,
  isNumber,
  isValidEmail,
  isValidUrl,
  assertDefined,

  // Async operations
  debounce,
  throttle,
  retry,
  sleep,

  // Caching
  LRUCache,
  TTLCache,
  memoize,

  // Logging
  getLogger,
  logger,

  // Environment
  isBrowser,
  isNode,
  isDev,
  isProd,
} from '@clarity-chat/utils'
```

See the [@clarity-chat/utils documentation](../packages/utils/README.md) for complete API reference.

---

### Token Optimization (@clarity-chat/token-optimization)

For token counting, budgeting, and optimization:

```tsx
import {
  // Token counting
  AccurateTokenCounter,
  countTokens,
  estimateTokens,

  // Budget monitoring
  useTokenBudgetMonitor,
  createModelBudgetMonitor,

  // Cost calculation
  calculateCost,
  estimateTokenCost,

  // Model registry
  MODEL_REGISTRY,
  isValidModelId,

  // Compression
  LLMLinguaCompressor,
  AdaptiveCompressor,
  compressAdaptively,
} from '@clarity-chat/token-optimization'
```

See the [@clarity-chat/token-optimization documentation](../packages/token-optimization/README.md) for complete API reference.

---

### Primitives (@clarity-chat/primitives)

For UI utilities and core functions:

```tsx
import {
  // Class name merging
  cn,

  // ARIA utilities
  generateAriaId,
  announce,
  getFocusableElements,

  // Animation utilities
  useReducedMotion,
  fadeVariants,
  springPresets,
} from '@clarity-chat/primitives'
```

---

### React Package Utilities

Message conversion utilities specific to the React package:

```tsx
import { convertCoreMessagesToMessages, convertMessagesToCoreMessages } from '@clarity-chat/react'
```

#### convertCoreMessagesToMessages

Convert CoreMessage[] to Message[] format.

**Parameters:**
- `coreMessages: CoreMessage[]` - Array of core messages
- `chatId?: string` - Optional chat ID (default: 'default')

**Returns:** `Message[]`

**Example:**

```tsx
import { useMemo } from 'react'

const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

#### convertMessagesToCoreMessages

Convert Message[] to CoreMessage[] format.

**Parameters:**
- `messages: Message[]` - Array of messages
- `chatId?: string` - Optional chat ID (default: 'default')

**Returns:** `CoreMessage[]`

---

## Types

### Message

```typescript
interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
  status: 'sending' | 'sent' | 'streaming' | 'error'
  metadata?: Record<string, any>
}
```

### CoreMessage

```typescript
interface CoreMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | CoreMessageContent[]
}
```

### MemoryConfig

```typescript
interface MemoryConfig {
  maxTokens?: number
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  vectorStore?: VectorStoreConfig
}
```

---

## Error Handling

### Error Types

All errors extend `ClarityError`:

- `APIKeyMissingError` - API key not configured
- `APIRateLimitError` - Rate limit exceeded
- `APIAuthenticationError` - Authentication failed
- `APINetworkError` - Network connection failed
- `APIResponseError` - API returned error response
- `ValidationError` - Input validation failed
- `ConfigurationError` - Invalid configuration

### Error Handling

```tsx
import { ErrorBoundary } from '@clarity-chat/react'

<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

---

## Package Import Guide

Clarity Chat is organized into focused packages. Here's the recommended import strategy:

### @clarity-chat/react
**Use for:** Complete chat UI components and hooks
```tsx
import { ClarityChatApp, useClarityChat, ChatWindow } from '@clarity-chat/react'
```

### @clarity-chat/primitives
**Use for:** Core UI primitives (buttons, dialogs, tooltips)
```tsx
import { Button, Dialog, Tooltip, cn } from '@clarity-chat/primitives'
```

### @clarity-chat/utils
**Use for:** General utilities (formatting, validation, caching, logging)
```tsx
import { formatBytes, debounce, LRUCache, getLogger } from '@clarity-chat/utils'
```

### @clarity-chat/token-optimization
**Use for:** Token counting, budgeting, cost optimization
```tsx
import { AccurateTokenCounter, useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
```

### @clarity-chat/memory
**Use for:** Conversation memory and context management
```tsx
import { MemoryService, useMemory } from '@clarity-chat/memory'
```

### @clarity-chat/error-handling
**Use for:** Error handling and recovery
```tsx
import { ErrorBoundary, useErrorHandler } from '@clarity-chat/error-handling'
```

---

## Migration from Deprecated Patterns

If you're using deprecated import patterns, update them as follows:

### Token Counting
```tsx
// ❌ Old (deprecated)
import { TokenCounter } from '@clarity-chat/react'

// ✅ New (recommended)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
```

### Utilities
```tsx
// ❌ Old (deprecated)
import { formatBytes, debounce } from '@clarity-chat/react'

// ✅ New (recommended)
import { formatBytes, debounce } from '@clarity-chat/utils'
```

### Core Types
```tsx
// ❌ Old (adds unnecessary bundle weight)
import { Message } from '@clarity-chat/react'

// ✅ New (smaller bundle)
import { Message } from '@clarity-chat/primitives'
```

---

## Related Documentation

- [Getting Started Guide](./getting-started.md) - Step-by-step setup
- [Cookbook](./cookbook/) - Copy-paste ready patterns
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [Package Documentation](../packages/) - Individual package docs
- [Storybook](http://localhost:6006) - Interactive examples

---

**Note**: This is a living document. APIs may change between versions. Always check the [CHANGELOG.md](../CHANGELOG.md) for breaking changes.
