# Enhanced Types Integration Examples

This document provides real-world integration examples for the enhanced TypeScript types.

## Example 1: Analytics Plugin with Custom Metadata

```tsx
// Define your application's message metadata
interface AnalyticsMetadata {
  userId: string
  sessionId: string
  timestamp: number
  source: 'api' | 'web' | 'mobile'
  ipAddress?: string
}

// Create typed message factory
const createAnalyticsMessage = createMessageFactory<AnalyticsMetadata>('user')

// Create analytics plugin
import { createPlugin } from '@clarity-chat/react/types'

const analyticsPlugin = createPlugin<AnalyticsMetadata>({
  name: 'analytics',
  version: '1.0.0',
  description: 'Track all user interactions',
  config: {
    endpoint: process.env.REACT_APP_ANALYTICS_ENDPOINT,
  },
  hooks: {
    async onMessageSend(message) {
      // Message is typed with AnalyticsMetadata
      await fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT!, {
        method: 'POST',
        body: JSON.stringify({
          event: 'message.sent',
          messageId: message.id,
          userId: message.metadata?.userId,
          sessionId: message.metadata?.sessionId,
          timestamp: message.metadata?.timestamp,
          source: message.metadata?.source,
        }),
      })
    },
    async onMessageReceived(message) {
      await fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT!, {
        method: 'POST',
        body: JSON.stringify({
          event: 'message.received',
          messageId: message.id,
          userId: message.metadata?.userId,
          responseTime: Date.now() - (message.metadata?.timestamp || 0),
        }),
      })
    },
    async onError(event) {
      console.error(`Error in ${event.context}:`, event.error)
    },
  },
  async onInit() {
    console.log('Analytics plugin initialized')
  },
})

// Use in your React component
function ChatWithAnalytics() {
  const metadata: AnalyticsMetadata = {
    userId: currentUser.id,
    sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
    timestamp: Date.now(),
    source: 'web',
  }

  const msg = createAnalyticsMessage('Hello!', metadata)

  return (
    <ClarityChat
      adapter={adapter}
      onMessage={(message) => {
        // message is typed with AnalyticsMetadata
        console.log(`User ${message.metadata?.userId} sent: ${message.content}`)
      }}
    />
  )
}
```

## Example 2: Type-Safe Event Handling

```tsx
import { createStrictEventEmitter, createEventDispatcher, isEventType } from '@clarity-chat/react/types'
import type { StrictChatEvent } from '@clarity-chat/react/types'

// Create event emitter
const emitter = createStrictEventEmitter()

// Subscribe to specific events
emitter.on('message:sent', (event) => {
  console.log('User sent:', event.content)
  // event is MessageSentEvent - all properties typed
})

emitter.on('tool:completed', (event) => {
  console.log(`Tool ${event.toolName} executed in ${event.executionTimeMs}ms`)
  // event is ToolCompletedEvent
})

emitter.on('error:occurred', (event) => {
  if (event.recoverable) {
    console.warn(`Recoverable error in ${event.context}:`, event.error)
  } else {
    console.error(`Fatal error in ${event.context}:`, event.error)
  }
})

// Or use dispatcher for cleaner code
const eventDispatcher = createEventDispatcher({
  'message:sent': (event) => {
    analytics.track('message_sent', { length: event.content.length })
  },
  'message:received': (event) => {
    analytics.track('message_received', { finishReason: event.finishReason })
  },
  'stream:chunk': (event) => {
    updateProgressBar(event.usage?.completionTokens || 0)
  },
  'tool:started': (event) => {
    showToolStatus(`Executing ${event.toolName}...`)
  },
  'tool:completed': (event) => {
    showToolStatus(`Completed: ${event.toolName}`)
  },
  'error:occurred': (event) => {
    showErrorNotification(event.error.message)
  },
})

// Dispatch all events
emitter.on('message:sent', (event) => eventDispatcher(event as StrictChatEvent))
emitter.on('message:received', (event) => eventDispatcher(event as StrictChatEvent))
// ... etc
```

## Example 3: Adapter Validation and Runtime Checking

```tsx
import {
  isFormalizedModelAdapter,
  supportsCapability,
  validateAdapter,
  asAdapter,
} from '@clarity-chat/react/types'
import type { FormalizedModelAdapter } from '@clarity-chat/react/types'

// Dynamic adapter loading
async function loadAdapter(adapterName: string): Promise<FormalizedModelAdapter> {
  const module = await import(`./adapters/${adapterName}`)
  const adapter = module.default

  // Validate before returning
  validateAdapter(adapter) // Throws if invalid

  return adapter
}

// Safe adapter usage
async function initializeChat(adapterName: string) {
  try {
    const adapter = await loadAdapter(adapterName)

    // Check capabilities before using features
    if (supportsCapability(adapter, 'supportsStreaming')) {
      console.log('Streaming enabled')
    }

    if (supportsCapability(adapter, 'supportsTools')) {
      console.log('Tool calling enabled')
    }

    // Type-safe generation
    const response = await adapter.generate(messages, {
      model: 'gpt-4',
      temperature: 0.7,
    })

    return response
  } catch (error) {
    console.error('Failed to initialize chat:', error)
    throw error
  }
}

// Safe casting
function tryAsAdapter(value: unknown): FormalizedModelAdapter | null {
  return asAdapter(value)
}

// Feature gating
async function chatWithOptionalStreaming(
  adapter: FormalizedModelAdapter,
  messages: ChatMessage[]
) {
  if (supportsCapability(adapter, 'supportsStreaming')) {
    // Stream
    for await (const chunk of adapter.stream!(messages, config)) {
      processChunk(chunk)
    }
  } else {
    // Non-streaming fallback
    const response = await adapter.generate(messages, config)
    processResponse(response)
  }
}
```

## Example 4: Conditional Component Props

```tsx
import type {
  ConditionalStreamingProps,
  ConditionalToolProps,
  ConditionalThinkingProps,
} from '@clarity-chat/react/types'
import { validateConditionalProps } from '@clarity-chat/react/types'

// Component with streaming enabled - callbacks REQUIRED
interface StreamingChatProps
  extends ConditionalStreamingProps<{ streaming: true }>,
    ConditionalToolProps<{ tools: false }>,
    ConditionalThinkingProps<{ thinking: false }> {
  adapter: string
  streaming: true
  tools?: false
  thinking?: false
}

// Component with tools enabled - tool callbacks REQUIRED
interface ToolsChatProps
  extends ConditionalStreamingProps<{ streaming: false }>,
    ConditionalToolProps<{ tools: true }>,
    ConditionalThinkingProps<{ thinking: false }> {
  adapter: string
  streaming?: false
  tools: true
  thinking?: false
}

// Component with all features enabled
interface FullFeatureChatProps
  extends ConditionalStreamingProps<{ streaming: true }>,
    ConditionalToolProps<{ tools: true }>,
    ConditionalThinkingProps<{ thinking: true }> {
  adapter: string
  streaming: true
  tools: true
  thinking: true
}

// TypeScript will error if required callbacks are missing
const streamingChat: StreamingChatProps = {
  adapter: 'openai',
  streaming: true,
  // ERROR: onChunk and onStreamComplete are required!
}

// Correct implementation
const streamingChat: StreamingChatProps = {
  adapter: 'openai',
  streaming: true,
  onChunk: (chunk) => console.log(chunk),
  onStreamComplete: (event) => console.log('Done'),
}

// Runtime validation as fallback
const validateChatConfig = (config: any) => {
  const validation = validateConditionalProps(config, [
    {
      if: (c) => c.streaming === true,
      require: ['onChunk', 'onStreamComplete'],
    },
    {
      if: (c) => c.tools === true,
      require: ['onToolStart', 'onToolComplete'],
    },
    {
      if: (c) => c.thinking === true,
      require: ['onThinkingStep'],
    },
  ])

  if (!validation.valid) {
    throw new Error(`Missing required callbacks: ${validation.missing.join(', ')}`)
  }

  return config
}
```

## Example 5: Component Props Builder Pattern

```tsx
import { createPropsBuilder, InferComponentProps } from '@clarity-chat/react/types'
import { ClarityChat } from '@clarity-chat/react'

type ChatProps = InferComponentProps<typeof ClarityChat>

// Safe props builder
function buildChatProps(options: {
  adapter: string
  model: string
  streaming?: boolean
  tools?: boolean
}) {
  const builder = createPropsBuilder<ChatProps>()

  // Required props
  const props = builder
    .set('adapter', loadAdapter(options.adapter))
    .set('config', { model: options.model })

  // Conditional props
  if (options.streaming) {
    props.set('onChunk', (chunk) => {
      console.log('Stream chunk:', chunk)
    })
    props.set('onStreamComplete', (event) => {
      console.log('Streaming done')
    })
  }

  if (options.tools) {
    props.set('onToolStart', (event) => {
      console.log('Tool started:', event.toolName)
    })
    props.set('onToolComplete', (event) => {
      console.log('Tool completed:', event.toolName)
    })
  }

  return props.build()
}

// Usage
function MyChat() {
  const props = buildChatProps({
    adapter: 'openai',
    model: 'gpt-4',
    streaming: true,
    tools: true,
  })

  return <ClarityChat {...props} />
}
```

## Example 6: Type-Safe Message Processing

```tsx
import type {
  GenericMessage,
  UserMessage,
  AssistantMessage,
  isMessageRole,
} from '@clarity-chat/react/types'
import { isMessageRole, isUserMessage } from '@clarity-chat/react/types'

// Define your domain metadata
interface DomainMetadata {
  source: 'user' | 'api' | 'system'
  priority: 'low' | 'medium' | 'high'
  category: string
}

type DomainMessage = GenericMessage<DomainMetadata>

// Type-safe message processor
function processMessage(message: DomainMessage): void {
  // Check role safely
  if (isMessageRole('user')(message)) {
    // message is now UserMessage<DomainMetadata>
    console.log(`User (${message.metadata?.source}) said:`, message.content)
  }

  if (isMessageRole('assistant')(message)) {
    // message is now AssistantMessage<DomainMetadata>
    console.log(`Assistant responded:`, message.content)
  }

  // Access metadata safely
  if (message.metadata?.priority === 'high') {
    console.log(`[HIGH] ${message.metadata.category}:`, message.content)
  }
}

// Process messages from API
async function loadMessagesFromAPI(): Promise<DomainMessage[]> {
  const response = await fetch('/api/messages')
  const data = await response.json()

  return data.messages.map((msg: any) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.createdAt),
    status: msg.status,
    metadata: {
      source: msg.source,
      priority: msg.priority,
      category: msg.category,
    },
  }))
}

// Process all messages
async function loadAndProcess() {
  const messages = await loadMessagesFromAPI()
  messages.forEach(processMessage)
}
```

## Example 7: Complete Integration

```tsx
import React from 'react'
import {
  createStrictEventEmitter,
  createPlugin,
  validateAdapter,
  createMessageFactory,
  supportsCapability,
} from '@clarity-chat/react/types'
import type {
  GenericMessage,
  StrictChatEvent,
  AnalyticsMetadata,
} from '@clarity-chat/react/types'

// App metadata
interface AppMetadata {
  userId: string
  sessionId: string
  source: 'web' | 'mobile'
}

// Components
export function ChatApp() {
  const [messages, setMessages] = React.useState<GenericMessage<AppMetadata>[]>([])
  const emitterRef = React.useRef(createStrictEventEmitter())

  // Initialize
  React.useEffect(() => {
    const emitter = emitterRef.current

    // Handle all events with type safety
    const unsubscribers = [
      emitter.on('message:sent', (event) => {
        console.log('Message sent:', event.messageId, event.content)
      }),
      emitter.on('message:received', (event) => {
        console.log('Response received:', event.finishReason)
      }),
      emitter.on('stream:started', (event) => {
        console.log('Streaming started')
      }),
      emitter.on('error:occurred', (event) => {
        console.error(`Error (${event.context}):`, event.error)
      }),
    ]

    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [])

  const handleSendMessage = async (content: string) => {
    const createMsg = createMessageFactory<AppMetadata>('user')
    const message = createMsg(content, {
      userId: 'user-123',
      sessionId: sessionStorage.getItem('sessionId') || 'new',
      source: 'web',
    })

    setMessages((prev) => [...prev, message])
    emitterRef.current.emit('message:sent', {
      type: 'message:sent',
      timestamp: new Date(),
      messageId: message.id,
      content: message.content,
      role: 'user',
      metadata: message.metadata,
    })
  }

  return (
    <div className="chat-app">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="content">{msg.content}</div>
            <div className="metadata">
              User: {msg.metadata?.userId} | Source: {msg.metadata?.source}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type message..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
      />
    </div>
  )
}

export default ChatApp
```

## Best Practices

1. **Always validate adapters at load time**
   ```tsx
   validateAdapter(adapter) // Throws immediately if invalid
   ```

2. **Use discriminated unions for event handling**
   ```tsx
   switch (event.type) {
     case 'message:sent': // TypeScript knows event properties
   }
   ```

3. **Extend generic types for your domain**
   ```tsx
   type AppMessage = GenericMessage<YourMetadata>
   // Use AppMessage everywhere
   ```

4. **Check capabilities before using features**
   ```tsx
   if (supportsCapability(adapter, 'supportsStreaming')) {
     // Safe to use streaming
   }
   ```

5. **Use factories for consistent object creation**
   ```tsx
   const createMsg = createMessageFactory<YourMetadata>('user')
   ```

6. **Validate conditional requirements at runtime if needed**
   ```tsx
   const validation = validateConditionalProps(props, requirements)
   ```

7. **Leverage type inference in your IDE**
   - Hover over types to see documentation
   - Use autocomplete for event properties
   - Get compile-time errors for type mismatches
