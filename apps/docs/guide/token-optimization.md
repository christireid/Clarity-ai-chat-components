# Token Optimization

Optimize token usage to reduce costs and stay within model context limits.

## Overview

Token optimization features help you:
- Compress prompts while preserving meaning
- Cache frequently used responses
- Route requests to cheaper models when appropriate
- Limit response length
- Batch requests efficiently

## Prompt Compression

Reduce prompt size while maintaining context:

```tsx
import { usePromptCompression } from '@clarity-chat/react'

function OptimizedChat() {
  const { compress, compressionRatio } = usePromptCompression({
    enabled: true,
    targetReduction: 0.3, // Reduce by 30%
    preserveImportant: true, // Keep important information
  })

  const handleSend = async (messages: Message[]) => {
    // Compress messages if needed
    const compressed = await compress(messages)
    
    // Send compressed messages
    await sendMessage(compressed)
  }

  return (
    <div>
      <p>Compression: {(compressionRatio * 100).toFixed(0)}%</p>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

### Compression Strategies

1. **Summarization**: Summarize older messages
2. **Extraction**: Extract only key information
3. **Truncation**: Remove less important content
4. **Semantic Compression**: Use embeddings to compress

## Smart Caching

Cache responses to avoid redundant API calls:

```tsx
import { useSmartCache } from '@clarity-chat/react'

function CachedChat() {
  const { get, set, has } = useSmartCache({
    ttl: 3600, // Cache for 1 hour
    maxSize: 100, // Max 100 cached items
  })

  const handleSend = async (message: string) => {
    // Check cache first
    const cacheKey = hashMessage(message)
    if (has(cacheKey)) {
      const cached = get(cacheKey)
      return cached.response
    }

    // Call API
    const response = await fetch('/api/chat', {
      body: JSON.stringify({ message }),
    })
    const data = await response.json()

    // Cache response
    set(cacheKey, data)

    return data
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Model Routing

Route requests to cheaper models when appropriate:

```tsx
import { useModelRouter } from '@clarity-chat/react'

const router = useModelRouter({
  routes: [
    {
      condition: (message) => message.length < 100,
      model: 'gpt-3.5-turbo', // Cheaper model for short messages
    },
    {
      condition: (message) => message.includes('complex'),
      model: 'gpt-4-turbo-preview', // Better model for complex queries
    },
    {
      default: true,
      model: 'gpt-4', // Default model
    },
  ],
})

const handleSend = async (message: string) => {
  const model = router.selectModel(message)
  // Use selected model
}
```

## Response Limiting

Limit response length to control costs:

```tsx
import { useResponseLimiter } from '@clarity-chat/react'

function LimitedChat() {
  const { limit } = useResponseLimiter({
    maxTokens: 500,
    strategy: 'truncate', // or 'summarize'
  })

  const handleSend = async (message: string) => {
    const response = await chat({ message })
    const limited = await limit(response)
    return limited
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Request Batching

Batch multiple requests together:

```tsx
import { useRequestBatcher } from '@clarity-chat/react'

function BatchedChat() {
  const { batch } = useRequestBatcher({
    maxBatchSize: 10,
    maxWaitTime: 1000, // Wait up to 1 second
  })

  const handleSend = async (message: string) => {
    // Add to batch
    return batch(() => chat({ message }))
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Smart Throttling

Throttle requests intelligently:

```tsx
import { useSmartThrottle } from '@clarity-chat/react'

function ThrottledChat() {
  const { throttle } = useSmartThrottle({
    maxRequests: 10,
    windowMs: 60000, // Per minute
    strategy: 'adaptive', // Adjusts based on load
  })

  const handleSend = async (message: string) => {
    return throttle(() => chat({ message }))
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Token Optimization Dashboard

Monitor token usage and optimization:

```tsx
import { TokenOptimizationDashboard } from '@clarity-chat/react'

function AdminPanel() {
  return (
    <TokenOptimizationDashboard
      metrics={{
        totalTokens: 15000,
        savedTokens: 3000,
        savingsPercentage: 20,
        estimatedSavings: 0.15, // USD
      }}
    />
  )
}
```

## Complete Optimization Setup

```tsx
import {
  usePromptCompression,
  useSmartCache,
  useModelRouter,
  useResponseLimiter,
  TokenCounter,
} from '@clarity-chat/react'

function FullyOptimizedChat() {
  const { compress } = usePromptCompression({ enabled: true })
  const { get, set, has } = useSmartCache({ ttl: 3600 })
  const router = useModelRouter({ routes: [...] })
  const { limit } = useResponseLimiter({ maxTokens: 500 })

  const handleSend = async (message: string) => {
    // Check cache
    const cacheKey = hashMessage(message)
    if (has(cacheKey)) {
      return get(cacheKey)
    }

    // Select model
    const model = router.selectModel(message)

    // Compress if needed
    const compressed = await compress([{ role: 'user', content: message }])

    // Get response
    const response = await chat({ messages: compressed, model })

    // Limit response
    const limited = await limit(response)

    // Cache result
    set(cacheKey, limited)

    return limited
  }

  return (
    <div>
      <TokenCounter messages={messages} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

## Best Practices

1. **Monitor Usage**: Track token usage regularly
2. **Compress When Needed**: Use compression for long conversations
3. **Cache Aggressively**: Cache common queries
4. **Route Intelligently**: Use cheaper models when appropriate
5. **Set Limits**: Prevent runaway costs with limits
6. **Batch Requests**: Batch when possible to reduce overhead

## Next Steps

- [Token Counter Component](/api/components/token-counter) - Display token usage
- [Token Optimization API](/api/token-optimization) - Complete optimization API
- [Cost Estimation](/guide/cost-estimation) - Estimate and track costs
