# Clarity Chat API Guide

## API Hierarchy

Clarity Chat provides multiple APIs from simplest to most advanced:

```
┌─────────────────────────────────────────────────────────┐
│  Recipe Components (ChatWithMemory, ChatComplete, etc.) │
│  ⭐⭐⭐ Simplest - Pre-built combinations                │
└─────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  ClarityChat Component                                  │
│  ⭐⭐ Simple - One component, zero config              │
└─────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  useChat Hook                                           │
│  ⭐⭐ Simple - Automatic conversions                   │
└─────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Composable Hooks (useChatComposable, Builder Pattern)  │
│  ⭐⭐⭐ Flexible - Easy feature composition             │
└─────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  useClarityChat Hook                                    │
│  ⭐⭐⭐⭐ Advanced - Full control                        │
└─────────────────────────────────────────────────────────┘
```

## Quick Reference

### Recipe Components

Pre-built combinations for common patterns:

```tsx
// Chat with memory
<ChatWithMemory api="/api/chat" strategy="vector-store" />

// Chat with analytics
<ChatWithAnalytics
  api="/api/chat"
  onMessageSent={(content) => track('message_sent')}
/>

// Chat with preset
<ChatWithPreset preset="enterprise" api="/api/chat" />

// Complete chat (everything enabled)
<ChatComplete api="/api/chat" />
```

### ClarityChat Component

Simplest way to get started:

```tsx
<ClarityChat api="/api/chat" />
```

### useChat Hook

Simplified hook with automatic conversions:

```tsx
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
```

### Composable Hooks

Easy feature composition:

```tsx
// With features object
const chat = useChatComposable({
  api: '/api/chat',
  features: {
    memory: { enabled: true },
    persistence: { enabled: true },
  },
})

// With builder pattern
const chat = createChatHook('/api/chat')
  .withMemory('vector-store')
  .withPersistence('my-chat')
  .build()
```

### useClarityChat Hook

Full control and advanced features:

```tsx
const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
```

## Presets

Pre-configured settings for common scenarios:

```tsx
import { chatPresets, applyChatPreset } from '@clarity-chat/react'

// Use a preset
const options = applyChatPreset('enterprise', { api: '/api/chat' })

// Available presets:
// - basic: Simple chat
// - enterprise: Full-featured with memory
// - support: Customer support optimized
// - codeAssistant: Code-focused
// - minimal: Ultra-minimal
// - persistent: With localStorage
```

## Feature Composition

### Using Composable Hooks

```tsx
const chat = useChatComposable({
  api: '/api/chat',
  features: {
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 8000,
    },
    persistence: {
      enabled: true,
      storageKey: 'my-chat',
    },
    analytics: {
      onMessageSent: (content) => track('sent', { content }),
      onMessageReceived: (id) => track('received', { id }),
    },
  },
})
```

### Using Builder Pattern

```tsx
const chat = createChatHook('/api/chat')
  .withMemory('vector-store', 8000)
  .withPersistence('my-chat')
  .withAnalytics({
    onMessageSent: track,
    onMessageReceived: track,
  })
  .withErrorRecovery(3)
  .build()
```

## TypeScript Types

All APIs are fully typed with excellent autocomplete:

```tsx
import type {
  ClarityChatProps,
  UseChatOptions,
  UseChatReturn,
  ChatFeatures,
} from '@clarity-chat/react'
```

## Migration Guide

### From useClarityChat to useChat

```tsx
// Before
const { messages, append } = useClarityChat({ api: '/api/chat' })
const converted = convertCoreMessagesToMessages(messages)

// After
const { messages, sendMessage } = useChat({ api: '/api/chat' })
// messages already converted, sendMessage is simpler
```

### From Hook + Component to ClarityChat

```tsx
// Before
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={sendMessage} />

// After
return <ClarityChat api="/api/chat" />
```

### Adding Features

```tsx
// Start simple
const chat = useChat({ api: '/api/chat' })

// Add features
const chat = useChatComposable({
  api: '/api/chat',
  features: {
    memory: { enabled: true },
    persistence: { enabled: true },
  },
})
```

## Best Practices

1. **Start Simple**: Begin with `ClarityChat` or `useChat`
2. **Add Features Gradually**: Use composable hooks to add features as needed
3. **Use Presets**: Leverage presets for common scenarios
4. **Type Safety**: Use TypeScript for better DX
5. **Error Handling**: Use `ChatWithErrorBoundary` or `ChatWithErrorHandling` for production

## Examples

See the examples directory for complete, copy-pasteable examples:
- `clarity-chat-quickstart.tsx` - ClarityChat examples
- `unified-chat-examples.tsx` - useChat examples
- `recipe-examples.tsx` - Recipe component examples
- `composable-examples.tsx` - Composable hook examples

---

**Questions?** Check the [Quickstart Guide](./QUICKSTART.md) or [Full Documentation](../README.md).
