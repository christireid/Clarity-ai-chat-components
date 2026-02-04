# Enhanced Types Guide

This guide demonstrates how to use the enhanced TypeScript types from `/sessions/brave-nice-cray/mnt/packages/react/src/types/enhanced.ts`.

## 1. Stricter Event Types with Discriminated Unions

### Problem Solved
Type-safe event handling without runtime checks.

### Usage Examples

```tsx
import type { StrictChatEvent, EventPayload, isEventType } from '@clarity-chat/react/types'

// Define a type-safe event handler
function handleChatEvent(event: StrictChatEvent) {
  // Use discriminated union for type narrowing
  switch (event.type) {
    case 'message:sent':
      console.log('Message sent:', event.content)
      break
    case 'message:received':
      console.log('Response received:', event.finishReason)
      break
    case 'stream:started':
      console.log('Streaming started for message:', event.messageId)
      break
    case 'tool:started':
      console.log('Tool called:', event.toolName, event.input)
      break
    case 'error:occurred':
      console.error('Error context:', event.context, event.error)
      break
  }
}

// Get specific event payload type
type MessageSentPayload = EventPayload<'message:sent'>

// Type guard function
if (isEventType(event, 'tool:completed')) {
  // event is now typed as ToolCompletedEvent
  console.log(`Tool ${event.toolName} completed in ${event.executionTimeMs}ms`)
}
```

## 2. Generic Message Types with Custom Metadata

### Problem Solved
Allow applications to attach custom metadata to messages while maintaining type safety.

### Usage Examples

```tsx
import type { GenericMessage, UserMessage, createMessageFactory } from '@clarity-chat/react/types'

// Define custom metadata for your application
interface CustomMetadata {
  sentiment: 'positive' | 'negative' | 'neutral'
  userId: string
  source: 'api' | 'web' | 'mobile'
  tags: string[]
}

// Create typed message instances
type MyMessage = GenericMessage<CustomMetadata>
type MyUserMessage = UserMessage<CustomMetadata>

const myMessage: MyMessage = {
  id: 'msg-123',
  role: 'user',
  content: 'Hello!',
  createdAt: new Date(),
  status: 'complete',
  metadata: {
    sentiment: 'positive',
    userId: 'user-456',
    source: 'web',
    tags: ['greeting', 'test'],
  },
}

// Use message factory for convenience
const createUserMsg = createMessageFactory<CustomMetadata>('user')
const userMsg = createUserMsg('Hi there!', {
  sentiment: 'positive',
  userId: 'user-456',
  source: 'web',
  tags: ['greeting'],
})

// Type-safe metadata access
const sentiment = myMessage.metadata?.sentiment
const userId = myMessage.metadata?.userId
```

## 3. Plugin Type Helpers

### Problem Solved
Create reusable plugins with full type safety and lifecycle management.

### Usage Examples

```tsx
import type { CreatePluginOptions, Plugin } from '@clarity-chat/react/types'
import { createPlugin } from '@clarity-chat/react/types'

interface AnalyticsMetadata {
  userId: string
  sessionId: string
}

// Create a typed plugin with lifecycle hooks
const analyticsPlugin = createPlugin<AnalyticsMetadata>({
  name: 'analytics',
  version: '1.0.0',
  description: 'Track user interactions',
  author: 'my-team',
  license: 'MIT',
  config: {
    endpoint: 'https://analytics.example.com',
    batchSize: 10,
  },
  hooks: {
    async onMessageSend(message) {
      // Track message sent
      await fetch('https://analytics.example.com/events', {
        method: 'POST',
        body: JSON.stringify({
          type: 'message.sent',
          messageId: message.id,
          userId: message.metadata?.userId,
        }),
      })
    },
    async onError(event) {
      // Track errors
      console.error(`Error in ${event.context}:`, event.error)
    },
  },
  async onInit() {
    console.log('Analytics plugin initialized')
  },
  async onDestroy() {
    console.log('Analytics plugin destroyed')
  },
})

// Plugin can be registered and managed
// Usage depends on the plugin manager implementation
```

## 4. Adapter Type Guards

### Problem Solved
Runtime validation of adapters with proper error handling.

### Usage Examples

```tsx
import {
  isFormalizedModelAdapter,
  validateAdapter,
  supportsCapability,
  isAdapterCapabilities,
} from '@clarity-chat/react/types'

// Safe validation with type guard
function ensureValidAdapter(adapter: unknown) {
  if (!isFormalizedModelAdapter(adapter)) {
    throw new Error('Invalid adapter provided')
  }
  return adapter // Now properly typed
}

// Validate before use
try {
  const adapter = await loadAdapterDynamically()
  validateAdapter(adapter) // Throws if invalid
  
  // Check capabilities
  if (supportsCapability(adapter, 'supportsStreaming')) {
    // Use streaming features
  }
  
  if (supportsCapability(adapter, 'supportsTools')) {
    // Use tool calling features
  }
} catch (error) {
  console.error('Adapter validation failed:', error)
}

// Safe casting
const possibleAdapter = someUnknownValue
const adapter = asAdapter(possibleAdapter)
if (adapter) {
  // Use validated adapter
}
```

## 5. Component Prop Inference

### Problem Solved
Infer and manipulate component props with full type safety.

### Usage Examples

```tsx
import type {
  InferComponentProps,
  RequirePropKeys,
  PropsOfType,
  CallbackProps,
  DataProps,
} from '@clarity-chat/react/types'
import { createPropsBuilder } from '@clarity-chat/react/types'
import { ClarityChat } from '@clarity-chat/react'

// Extract component props automatically
type ChatProps = InferComponentProps<typeof ClarityChat>

// Make specific props required
type RequiredChatProps = RequirePropKeys<ChatProps, 'adapter' | 'config'>

// Extract only callback props
type ChatCallbacks = CallbackProps<ChatProps>
// Result: { onError, onLoad, onMessage, etc. }

// Extract only data props
type ChatDataProps = DataProps<ChatProps>
// Result: { adapter, config, messages, etc. }

// Extract props of specific type
type StringProps = PropsOfType<ChatProps, string>
// Result: { model, placeholder, etc. }

// Use props builder for safe construction
const propsBuilder = createPropsBuilder<ChatProps>()
const chatProps = propsBuilder
  .set('adapter', myAdapter)
  .set('config', { model: 'claude-3' })
  .set('onError', handleError)
  .build()

// Build and validate required props
const requiredProps = propsBuilder
  .set('adapter', myAdapter)
  .set('config', { model: 'claude-3' })
  .toRequired() // Throws if required props missing
```

## 6. Conditional Types for Feature-Dependent Props

### Problem Solved
Require handler callbacks only when features are enabled.

### Usage Examples

```tsx
import type {
  ConditionalStreamingProps,
  ConditionalToolProps,
  ConditionalThinkingProps,
} from '@clarity-chat/react/types'
import { validateConditionalProps } from '@clarity-chat/react/types'

// Define props with conditional requirements
interface AdvancedChatProps extends
  ConditionalStreamingProps<{ streaming: true }>,
  ConditionalToolProps<{ tools: true }>,
  ConditionalThinkingProps<{ thinking: true }> {
  adapter: string
  streaming: true
  tools: true
  thinking: true
}

// Now these callbacks are REQUIRED:
// - onChunk
// - onStreamComplete
// - onToolStart
// - onToolComplete
// - onThinkingStep

// Validate conditional requirements
const props = {
  adapter: 'openai',
  streaming: true,
  tools: false,
  // Missing onChunk, onStreamComplete!
}

const validation = validateConditionalProps(props, [
  {
    if: (p) => p.streaming === true,
    require: ['onChunk', 'onStreamComplete'],
  },
  {
    if: (p) => p.tools === true,
    require: ['onToolStart', 'onToolComplete'],
  },
])

if (!validation.valid) {
  console.error('Missing required props:', validation.missing)
}

// Conditional type example
type ChatProps<T extends { streaming?: boolean }> =
  T['streaming'] extends true
    ? { onChunk: (chunk: any) => void } // Required if streaming
    : { onChunk?: (chunk: any) => void } // Optional otherwise
```

## 7. Event Emitter with Type Safety

### Problem Solved
Create type-safe event emitters with proper type inference.

### Usage Examples

```tsx
import { createStrictEventEmitter, createEventDispatcher } from '@clarity-chat/react/types'
import type { StrictChatEvent } from '@clarity-chat/react/types'

// Create a type-safe emitter
const emitter = createStrictEventEmitter()

// Subscribe to specific event types with type inference
const unsubscribe = emitter.on('message:sent', (event) => {
  // event is automatically typed as MessageSentEvent
  console.log('Sent:', event.content)
})

// Listen to streaming events
emitter.on('stream:chunk', (event) => {
  // event is StreamChunkReceivedEvent
  console.log(`Token usage: ${event.usage?.completionTokens}`)
})

// Handle errors
emitter.on('error:occurred', (event) => {
  console.error(`Error in ${event.context}:`, event.error)
})

// Unsubscribe when done
unsubscribe()

// Create an event dispatcher for cleaner handling
const dispatch = createEventDispatcher({
  'message:sent': (event) => console.log('Sent:', event.content),
  'message:received': (event) => console.log('Received, stopped by:', event.finishReason),
  'tool:completed': (event) => console.log(`Tool ${event.toolName} completed`),
  'error:occurred': (event) => console.error('Error:', event.error),
})

// Use dispatcher with any event
emitter.on('message:sent', (event) => dispatch(event as StrictChatEvent))
```

## Key Patterns and Best Practices

### 1. Discriminated Unions for Type Safety

```tsx
// Good: Use switch with exhaustiveness checking
function handle(event: StrictChatEvent) {
  switch (event.type) {
    case 'message:sent':
      return event.content // Properly typed
    case 'message:received':
      return event.finishReason // Properly typed
    // TypeScript will error if you miss a case
  }
}
```

### 2. Generic Types for Extensibility

```tsx
// Define once, reuse everywhere
interface AppMetadata {
  userId: string
  sessionId: string
}

type AppMessage = GenericMessage<AppMetadata>
type AppUserMessage = UserMessage<AppMetadata>

// All messages now have consistent metadata type
```

### 3. Type Guards for Runtime Safety

```tsx
// Always validate before assuming types
if (isFormalizedModelAdapter(adapter)) {
  // Safe to use adapter
  await adapter.generate(messages, config)
}
```

### 4. Conditional Types for Feature Flags

```tsx
// Props adjust based on enabled features
type ChatProps = BaseProps &
  ConditionalStreamingProps<{ streaming: enabled }> &
  ConditionalToolProps<{ tools: enabled }>

// Callbacks are required only when features are enabled
```

## Migration Guide

### From Basic Types to Enhanced Types

Before:
```tsx
function handleEvent(event: any) {
  if (event.type === 'message:sent') {
    console.log(event.something) // No type checking
  }
}
```

After:
```tsx
import type { StrictChatEvent } from '@clarity-chat/react/types'

function handleEvent(event: StrictChatEvent) {
  if (event.type === 'message:sent') {
    console.log(event.content) // Full type safety
  }
}
```

## Summary

Enhanced types provide:
- **Type Safety**: Discriminated unions prevent runtime errors
- **Developer Experience**: Auto-complete and inline documentation
- **Extensibility**: Generic types for custom metadata
- **Flexibility**: Conditional types for feature management
- **Validation**: Type guards for runtime checks
- **Scalability**: Plugin system for extensible functionality

All types are exported from `@clarity-chat/react/types` for convenient importing.
