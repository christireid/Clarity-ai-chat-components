# Model Adapters

Clarity Chat provides a **model-agnostic adapter system** that lets you switch between AI providers with minimal code changes. This eliminates vendor lock-in and enables easy A/B testing, cost optimization, and feature comparison.

## Overview

The adapter system provides:

- **Unified Interface**: Same API for OpenAI, Anthropic, and Google AI
- **Streaming Support**: AsyncGenerator-based streaming for all providers
- **Cost Estimation**: Accurate pricing calculations per model
- **Token Usage Tracking**: Monitor prompt and completion tokens
- **Tree-Shakeable**: Import only the adapters you need

## Quick Start

### Basic Usage

Switch providers in just 3 lines:

```tsx
import { openAIAdapter, anthropicAdapter, googleAdapter } from '@clarity-chat/react'

// Use OpenAI
const config = { 
  provider: 'openai', 
  model: 'gpt-4-turbo',
  apiKey: process.env.OPENAI_API_KEY 
}

const response = await openAIAdapter.chat(messages, config)

// Switch to Anthropic - just change the adapter!
const response = await anthropicAdapter.chat(messages, {
  provider: 'anthropic',
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
})
```

## Available Adapters

### OpenAI

Supports GPT-4, GPT-3.5, and other OpenAI models:

```tsx
import { openAIAdapter, openAIModels } from '@clarity-chat/react'

// Get available models
console.log(openAIModels)
// [
//   { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', speed: 'fast', cost: 'medium', quality: 'best' },
//   { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', speed: 'fastest', cost: 'low', quality: 'good' }
// ]

// Use adapter
const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1000
})
```

**Supported Models**:
- `gpt-4-turbo` - GPT-4 Turbo (128K context)
- `gpt-4` - GPT-4 (8K context)
- `gpt-3.5-turbo` - GPT-3.5 Turbo (16K context)

### Anthropic

Supports Claude 3 family:

```tsx
import { anthropicAdapter, anthropicModels } from '@clarity-chat/react'

const response = await anthropicAdapter.chat(messages, {
  provider: 'anthropic',
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
})
```

**Supported Models**:
- `claude-3-opus` - Claude 3 Opus (200K context, best quality)
- `claude-3-sonnet` - Claude 3 Sonnet (200K context, balanced)
- `claude-3-haiku` - Claude 3 Haiku (200K context, fastest)

### Google AI

Supports Gemini models:

```tsx
import { googleAdapter, googleModels } from '@clarity-chat/react'

const response = await googleAdapter.chat(messages, {
  provider: 'google',
  model: 'gemini-pro',
  apiKey: process.env.GOOGLE_API_KEY
})
```

**Supported Models**:
- `gemini-pro` - Gemini Pro (32K context)
- `gemini-pro-vision` - Gemini Pro Vision (multimodal)

## Streaming Responses

All adapters support streaming using AsyncGenerator:

```tsx
import { openAIAdapter } from '@clarity-chat/react'

const config = { 
  provider: 'openai', 
  model: 'gpt-4-turbo',
  streamOptions: {
    onToken: (token) => console.log('Token:', token),
    onToolCall: (tool) => console.log('Tool:', tool)
  }
}

// Stream tokens
for await (const chunk of openAIAdapter.stream(messages, config)) {
  if (chunk.type === 'token') {
    console.log(chunk.content) // "Hello", " world", "!"
  } else if (chunk.type === 'tool_call') {
    console.log(chunk.toolCall) // { function: { name: 'search', arguments: '...' } }
  } else if (chunk.type === 'done') {
    console.log('Usage:', chunk.usage) // { promptTokens: 100, completionTokens: 50 }
  }
}
```

### Stream Chunk Types

| Type | Description | Properties |
|------|-------------|------------|
| `token` | Text token | `content: string` |
| `tool_call` | Function call | `toolCall: ToolCall` |
| `thinking` | Chain-of-thought step | `content: string` |
| `citation` | RAG source | `citation: Citation` |
| `done` | Stream complete | `usage: TokenUsage` |
| `error` | Error occurred | `error: Error` |

## Cost Estimation

Calculate costs before making API calls:

```tsx
import { openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const usage = { 
  promptTokens: 1000, 
  completionTokens: 500 
}

// Compare costs
const gpt4Cost = openAIAdapter.estimateCost(usage, 'gpt-4-turbo')
console.log('GPT-4 Turbo:', `$${gpt4Cost.toFixed(4)}`) // $0.0250

const claudeCost = anthropicAdapter.estimateCost(usage, 'claude-3-sonnet')
console.log('Claude 3 Sonnet:', `$${claudeCost.toFixed(4)}`) // $0.0105

const savings = ((gpt4Cost - claudeCost) / gpt4Cost * 100).toFixed(1)
console.log(`Savings with Claude: ${savings}%`) // 58.0%
```

### Pricing Tables

**OpenAI Pricing (per 1K tokens)**:
| Model | Input | Output |
|-------|-------|--------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-4 | $0.03 | $0.06 |
| GPT-3.5 Turbo | $0.0015 | $0.002 |

**Anthropic Pricing (per 1M tokens)**:
| Model | Input | Output |
|-------|-------|--------|
| Claude 3 Opus | $15 | $75 |
| Claude 3 Sonnet | $3 | $15 |
| Claude 3 Haiku | $0.25 | $1.25 |

**Google AI Pricing (per 1M tokens)**:
| Model | Input | Output |
|-------|-------|--------|
| Gemini Pro | $0.50 | $1.50 |

## Model Selection

Use the `ModelSelector` component for a visual model picker:

```tsx
import { ModelSelector, allModels } from '@clarity-chat/react'

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [config, setConfig] = useState({})

  return (
    <ModelSelector
      models={allModels}
      value={selectedModel}
      onChange={(modelId, modelConfig) => {
        setSelectedModel(modelId)
        setConfig(modelConfig)
      }}
      showMetrics // Show speed/cost/quality badges
    />
  )
}
```

## Advanced Usage

### Custom Base URL

Use with Azure OpenAI or custom endpoints:

```tsx
const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4-turbo',
  baseURL: 'https://your-azure-instance.openai.azure.com/openai/deployments/gpt-4',
  apiKey: process.env.AZURE_API_KEY
})
```

### Helper Functions

Get adapters dynamically:

```tsx
import { getAdapter } from '@clarity-chat/react'

const provider = 'openai' // From user selection
const adapter = getAdapter(provider)

const response = await adapter.chat(messages, config)
```

Get all available models:

```tsx
import { allModels } from '@clarity-chat/react'

// Filter by provider
const openAIOnlyModels = allModels.filter(m => m.provider === 'openai')

// Filter by speed
const fastModels = allModels.filter(m => m.speed === 'fastest')

// Filter by cost
const cheapModels = allModels.filter(m => m.cost === 'low')
```

## Best Practices

### 1. Use Environment Variables

Never hardcode API keys:

```tsx
// ✅ Good
const config = {
  provider: 'openai',
  model: 'gpt-4-turbo',
  apiKey: process.env.OPENAI_API_KEY
}

// ❌ Bad
const config = {
  apiKey: 'sk-...' // Never commit API keys!
}
```

### 2. Handle Errors Gracefully

```tsx
try {
  const response = await openAIAdapter.chat(messages, config)
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
    await sleep(1000)
    return retry()
  } else if (error.message.includes('401')) {
    // Handle auth error
    console.error('Invalid API key')
  }
}
```

### 3. Optimize for Cost

Choose the right model for the task:

```tsx
// Use cheaper models for simple tasks
const config = content.length < 100
  ? { model: 'gpt-3.5-turbo' } // Cheap
  : { model: 'gpt-4-turbo' } // Quality
```

### 4. Implement Caching

Cache responses to reduce costs:

```tsx
const cacheKey = `${provider}:${model}:${JSON.stringify(messages)}`

const cached = cache.get(cacheKey)
if (cached) return cached

const response = await adapter.chat(messages, config)
cache.set(cacheKey, response, { ttl: 3600 })
```

## TypeScript Types

All adapters are fully typed:

```tsx
import type { 
  ModelAdapter, 
  ModelConfig, 
  StreamChunk, 
  ToolCall,
  TokenUsage,
  Citation
} from '@clarity-chat/react'

// Implement custom adapter
const customAdapter: ModelAdapter = {
  name: 'custom',
  
  async chat(messages, config) {
    // Your implementation
  },
  
  async *stream(messages, config) {
    // Your streaming implementation
    yield { type: 'token', content: 'Hello' }
    yield { type: 'done' }
  },
  
  estimateCost(usage, model) {
    // Your cost calculation
    return 0.01
  }
}
```

## Next Steps

- **[Streaming Guide](/guide/streaming)** - Learn about real-time streaming
- **[API Reference](/api/model-adapters)** - Complete adapter API
- **[Examples](/examples/model-switching)** - Working demos
- **[Cost Optimization](/cookbook#cost-optimization)** - Save money on API calls
