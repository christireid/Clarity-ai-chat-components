# Model Adapters

Clarity Chat provides model-agnostic adapters that allow you to switch between different AI providers (OpenAI, Anthropic, Google) with a unified interface.

## Overview

Model adapters abstract away provider-specific differences, giving you a consistent API regardless of which AI model you're using. This makes it easy to:

- Switch between providers without code changes
- Support multiple models simultaneously
- Fallback to alternative models on errors
- Compare model performance

## Supported Providers

### OpenAI

```tsx
import { openAIAdapter, openAIModels } from '@clarity-chat/react'

const adapter = openAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo-preview',
})

// Available models
const models = openAIModels
// ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo', ...]
```

### Anthropic (Claude)

```tsx
import { anthropicAdapter, anthropicModels } from '@clarity-chat/react'

const adapter = anthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus-20240229',
})

const models = anthropicModels
// ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', ...]
```

### Google AI

```tsx
import { googleAdapter, googleModels } from '@clarity-chat/react'

const adapter = googleAdapter({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  defaultModel: 'gemini-pro',
})

const models = googleModels
// ['gemini-pro', 'gemini-pro-vision', ...]
```

## Basic Usage

### Creating an Adapter

```tsx
import { openAIAdapter } from '@clarity-chat/react'

const adapter = openAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo-preview',
  maxTokens: 2000,
  temperature: 0.7,
})
```

### Streaming Responses

```tsx
import { useStreamingSSE } from '@clarity-chat/react'
import { openAIAdapter } from '@clarity-chat/react'

function ChatComponent() {
  const adapter = openAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const { connect, disconnect, isConnected } = useStreamingSSE({
    url: '/api/chat/stream',
    adapter,
    onMessage: (chunk) => {
      // Handle streaming chunks
      console.log('Received:', chunk)
    },
  })

  const handleSend = async (message: string) => {
    await connect({
      messages: [{ role: 'user', content: message }],
    })
  }

  return (
    <div>
      <button onClick={handleSend}>Send</button>
      <button onClick={disconnect}>Stop</button>
    </div>
  )
}
```

### Non-Streaming Requests

```tsx
const response = await adapter.complete({
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  model: 'gpt-4-turbo-preview',
})

console.log(response.content)
```

## Model Switching

Use the `ModelSelector` component to let users switch between models:

```tsx
import { ModelSelector, openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const adapters = {
  'gpt-4': openAIAdapter({ apiKey: process.env.OPENAI_API_KEY }),
  'claude-3': anthropicAdapter({ apiKey: process.env.ANTHROPIC_API_KEY }),
}

function ChatWithModelSelector() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const adapter = adapters[selectedModel]

  return (
    <div>
      <ModelSelector
        models={[
          { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
          { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
        ]}
        selectedModel={selectedModel}
        onSelect={setSelectedModel}
      />
      {/* Use adapter for chat */}
    </div>
  )
}
```

## Cost Estimation

Adapters automatically track token usage and estimate costs:

```tsx
import { useTokenTracker } from '@clarity-chat/react'

const { 
  inputTokens, 
  outputTokens, 
  estimatedCost 
} = useTokenTracker({
  messages,
  model: 'gpt-4-turbo-preview',
  adapter: openAIAdapter({ apiKey: '...' }),
})

console.log(`Cost: $${estimatedCost.toFixed(4)}`)
```

## Error Handling & Fallback

Implement automatic fallback to alternative models:

```tsx
import { useModelFallback } from '@clarity-chat/react'

const { executeWithFallback } = useModelFallback({
  primaryAdapter: openAIAdapter({ apiKey: '...' }),
  fallbackAdapters: [
    anthropicAdapter({ apiKey: '...' }),
    googleAdapter({ apiKey: '...' }),
  ],
})

try {
  const response = await executeWithFallback({
    messages: [{ role: 'user', content: 'Hello!' }],
  })
} catch (error) {
  console.error('All models failed:', error)
}
```

## Custom Adapter

Create your own adapter for custom models:

```tsx
import type { ModelAdapter } from '@clarity-chat/react'

const customAdapter: ModelAdapter = {
  name: 'custom-model',
  complete: async (options) => {
    const response = await fetch('https://api.custom-model.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: options.messages,
        model: options.model,
      }),
    })
    
    const data = await response.json()
    return {
      content: data.response,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      },
    }
  },
  stream: async function* (options) {
    // Implement streaming
  },
  estimateCost: (tokens, model) => {
    // Custom cost calculation
    return tokens * 0.0001
  },
}
```

## Best Practices

1. **Environment Variables**: Always store API keys in environment variables
2. **Error Handling**: Implement retry logic and fallbacks
3. **Token Limits**: Respect model-specific context windows
4. **Cost Monitoring**: Track usage to avoid unexpected bills
5. **Rate Limiting**: Implement rate limiting for production apps

## Next Steps

- [Streaming Guide](/guide/streaming) - Learn about streaming responses
- [Token Optimization](/guide/token-optimization) - Optimize token usage
- [Error Handling](/guide/error-handling) - Handle errors gracefully
- [API Reference](/api/model-adapters) - Complete adapter API
