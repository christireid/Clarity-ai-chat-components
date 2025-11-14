# TypeScript Guide for useClarityChat

Comprehensive TypeScript type definitions and usage patterns for `useClarityChat`.

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Usage Patterns](#usage-patterns)
3. [Type Guards](#type-guards)
4. [Advanced Types](#advanced-types)
5. [Migration from Vercel AI SDK](#migration-from-vercel-ai-sdk)

## Type Definitions

### Core Types

```typescript
import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityTransport,
} from '@clarity-chat/react'
```

### UseClarityChatOptions

```typescript
interface UseClarityChatOptions {
  // Vercel AI SDK compatible options
  api?: string
  id?: string
  initialMessages?: CoreMessage[]
  onFinish?: (message: CoreMessage) => void | Promise<void>
  onError?: (error: Error) => void
  headers?: Record<string, string>
  body?: Record<string, any>
  credentials?: RequestCredentials
  keepLastMessage?: boolean
  
  // Clarity-specific options
  memory?: ClarityMemoryOptions
  transport?: ClarityTransport
  userId?: string
  threadId?: string
}
```

### ClarityMemoryOptions

```typescript
interface ClarityMemoryOptions {
  enabled?: boolean
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens?: number
  autoCapture?: boolean
}
```

### UseClarityChatReturn

```typescript
interface UseClarityChatReturn {
  // Standard chat properties
  messages: CoreMessage[]
  append: (message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>, options?: { data?: Record<string, any> }) => Promise<void>
  setInput: (input: string) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  isLoading: boolean
  error: Error | undefined
  stop: () => void
  reload: () => void
  setMessages: (messages: CoreMessage[]) => void
  
  // Clarity-specific additions
  memoryEnabled: boolean
  contextSummary?: string
}
```

## Usage Patterns

### Basic Usage

```typescript
import { useClarityChat } from '@clarity-chat/react'
import type { UseClarityChatReturn } from '@clarity-chat/react'

function ChatComponent() {
  const chat: UseClarityChatReturn = useClarityChat({
    api: '/api/chat',
  })

  // TypeScript knows chat.messages is CoreMessage[]
  const messages = chat.messages
  
  // TypeScript knows append accepts CoreMessage
  await chat.append({
    role: 'user',
    content: 'Hello',
  })

  return null
}
```

### With Memory

```typescript
import { useClarityChat } from '@clarity-chat/react'
import type { ClarityMemoryOptions } from '@clarity-chat/react'

const memoryOptions: ClarityMemoryOptions = {
  enabled: true,
  strategy: 'semantic-chunks',
  maxTokens: 4000,
  autoCapture: true,
}

function MemoryChat() {
  const { messages, append, memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: memoryOptions,
  })

  // TypeScript knows memoryEnabled is boolean
  if (memoryEnabled) {
    // TypeScript knows contextSummary is string | undefined
    console.log('Context:', contextSummary)
  }
}
```

### With Transport

```typescript
import { useClarityChat } from '@clarity-chat/react'
import type { ClarityTransport } from '@clarity-chat/react'

function WebSocketChat() {
  const transport: ClarityTransport = 'websocket'
  
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    transport,
  })

  return null
}
```

## Type Guards

### Check Memory Status

```typescript
function ChatWithMemoryCheck() {
  const { memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true },
  })

  // Type guard for memory context
  if (memoryEnabled && contextSummary) {
    // TypeScript knows contextSummary is string here
    const summary: string = contextSummary
    console.log(summary.length)
  }
}
```

### Check Error State

```typescript
function ChatWithErrorHandling() {
  const { error, messages } = useClarityChat({
    api: '/api/chat',
  })

  // Type guard for error
  if (error) {
    // TypeScript knows error is Error
    console.error(error.message)
    console.error(error.stack)
  }
}
```

## Advanced Types

### Custom Message Handler

```typescript
import type { CoreMessage } from '@clarity-chat/react'

type MessageHandler = (message: CoreMessage) => void | Promise<void>

function ChatWithCustomHandler() {
  const handleFinish: MessageHandler = async (message) => {
    // TypeScript knows message is CoreMessage
    console.log('Finished:', message.role, message.content)
  }

  useClarityChat({
    api: '/api/chat',
    onFinish: handleFinish,
  })
}
```

### Memory Strategy Type

```typescript
import type { ClarityMemoryOptions } from '@clarity-chat/react'

type MemoryStrategy = ClarityMemoryOptions['strategy']

function ChatWithStrategy(strategy: MemoryStrategy) {
  useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy, // TypeScript ensures strategy is valid
    },
  })
}

// Usage
ChatWithStrategy('sliding-window') // ✅ Valid
ChatWithStrategy('invalid') // ❌ TypeScript error
```

### Partial Options

```typescript
import type { UseClarityChatOptions } from '@clarity-chat/react'

function createChatConfig(base: Partial<UseClarityChatOptions>): UseClarityChatOptions {
  return {
    api: '/api/chat',
    ...base,
  }
}

const config = createChatConfig({
  memory: { enabled: true },
  transport: 'websocket',
})
```

## Migration from Vercel AI SDK

### Before (Vercel AI SDK)

```typescript
import { useChat } from 'ai/react'

const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})
```

### After (Clarity)

```typescript
import { useClarityChat } from '@clarity-chat/react'
import type { UseClarityChatReturn } from '@clarity-chat/react'

// Drop-in replacement - same types!
const { messages, append, isLoading }: UseClarityChatReturn = useClarityChat({
  api: '/api/chat',
})
```

### With Memory (New Feature)

```typescript
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, memoryEnabled, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
  },
})
```

## Type Safety Tips

### 1. Use Type Annotations for Complex Cases

```typescript
const chat: UseClarityChatReturn = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})

// TypeScript will catch errors
chat.messages.forEach((msg) => {
  // msg is CoreMessage
  console.log(msg.role, msg.content)
})
```

### 2. Leverage Type Inference

```typescript
// TypeScript infers types automatically
const { messages, append } = useClarityChat({
  api: '/api/chat',
})

// messages is CoreMessage[]
// append is (message: CoreMessage) => Promise<void>
```

### 3. Use Discriminated Unions

```typescript
type MemoryStrategy = 'sliding-window' | 'semantic-chunks' | 'vector-store'

function getStrategyConfig(strategy: MemoryStrategy) {
  switch (strategy) {
    case 'sliding-window':
      return { maxTokens: 2000 }
    case 'semantic-chunks':
      return { maxTokens: 6000 }
    case 'vector-store':
      return { maxTokens: 10000 }
  }
}
```

### 4. Type-Safe Error Handling

```typescript
const { error, append } = useClarityChat({
  api: '/api/chat',
  onError: (err: Error) => {
    // TypeScript knows err is Error
    console.error('Chat error:', err.message)
  },
})
```

## Common Type Patterns

### Conditional Memory

```typescript
function ConditionalMemoryChat(enableMemory: boolean) {
  const { memoryEnabled } = useClarityChat({
    api: '/api/chat',
    memory: enableMemory
      ? { enabled: true, strategy: 'sliding-window' }
      : undefined,
  })

  // TypeScript knows memoryEnabled is boolean
  return memoryEnabled ? 'Memory enabled' : 'Memory disabled'
}
```

### Dynamic Transport

```typescript
function DynamicTransportChat(useWebSocket: boolean) {
  const transport: ClarityTransport = useWebSocket ? 'websocket' : 'sse'
  
  const { messages } = useClarityChat({
    api: '/api/chat',
    transport,
  })

  return messages
}
```

## Type Exports

All types are exported from `@clarity-chat/react`:

```typescript
export {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
  type ClarityMemoryOptions,
  type ClarityTransport,
} from './hooks/use-clarity-chat'
```

## Best Practices

1. **Use Type Annotations**: Explicitly type complex return values
2. **Leverage Type Guards**: Use conditional checks for optional properties
3. **Import Types Separately**: Use `import type` for type-only imports
4. **Use Const Assertions**: For literal types, use `as const`
5. **Enable Strict Mode**: Use TypeScript strict mode for better type safety

```typescript
// Good: Type-only import
import type { UseClarityChatReturn } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

// Good: Const assertion
const strategy = 'sliding-window' as const

// Good: Type guard
if (memoryEnabled && contextSummary) {
  // contextSummary is string here
}
```
