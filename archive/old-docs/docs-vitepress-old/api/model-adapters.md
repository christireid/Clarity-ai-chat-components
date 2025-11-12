# Model Adapters API

Complete API reference for the model adapter system.

## Overview

Model adapters provide a unified interface for multiple AI providers, enabling easy switching between OpenAI, Anthropic, Google AI, and custom implementations.

## Core Interfaces

### ModelAdapter

The base interface that all adapters implement:

```typescript
interface ModelAdapter {
  /** Adapter name */
  name: string
  
  /** Send a chat completion request */
  chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
  
  /** Stream chat completion tokens */
  stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
  
  /** Estimate cost based on token usage */
  estimateCost(usage: TokenUsage, model: string): number
}
```

### ModelConfig

Configuration for model requests:

```typescript
interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  
  /** Model ID */
  model: string
  
  /** API key (optional, can use env vars) */
  apiKey?: string
  
  /** Custom API base URL */
  baseURL?: string
  
  /** Sampling temperature (0-2) */
  temperature?: number
  
  /** Maximum tokens to generate */
  maxTokens?: number
  
  /** Top-p sampling parameter */
  topP?: number
  
  /** Frequency penalty (-2 to 2) */
  frequencyPenalty?: number
  
  /** Presence penalty (-2 to 2) */
  presencePenalty?: number
  
  /** Stop sequences */
  stop?: string[]
  
  /** Streaming callbacks */
  streamOptions?: StreamOptions
  
  /** AbortSignal for cancellation */
  signal?: AbortSignal
}
```

### StreamOptions

Callbacks for streaming events:

```typescript
interface StreamOptions {
  /** Called for each token */
  onToken?: (token: string) => void
  
  /** Called for each tool invocation */
  onToolCall?: (tool: ToolCall) => void
  
  /** Called for each thinking step */
  onThinking?: (step: string) => void
  
  /** Called for each citation */
  onCitation?: (citation: Citation) => void
  
  /** Called when streaming starts */
  onStart?: () => void
  
  /** Called when streaming completes */
  onComplete?: (usage: TokenUsage) => void
  
  /** Called on error */
  onError?: (error: Error) => void
}
```

### StreamChunk

Union type for all streaming events:

```typescript
type StreamChunk = 
  | TokenChunk
  | ToolCallChunk
  | ThinkingChunk
  | CitationChunk
  | DoneChunk
  | ErrorChunk

interface TokenChunk {
  type: 'token'
  content: string
}

interface ToolCallChunk {
  type: 'tool_call'
  toolCall: ToolCall
}

interface ThinkingChunk {
  type: 'thinking'
  content: string
}

interface CitationChunk {
  type: 'citation'
  citation: Citation
}

interface DoneChunk {
  type: 'done'
  usage: TokenUsage
}

interface ErrorChunk {
  type: 'error'
  error: Error
}
```

### ToolCall

Function/tool invocation data:

```typescript
interface ToolCall {
  /** Unique call ID */
  id: string
  
  /** Call type */
  type: 'function'
  
  /** Function details */
  function: {
    /** Function name */
    name: string
    
    /** JSON-encoded arguments */
    arguments: string
  }
}
```

### Citation

RAG source reference:

```typescript
interface Citation {
  /** Unique citation ID */
  id: string
  
  /** Source name/title */
  source: string
  
  /** Chunk text content */
  chunkText: string
  
  /** Confidence score (0-1) */
  confidence: number
  
  /** Source URL (optional) */
  url?: string
  
  /** Metadata */
  metadata?: {
    /** Publication date */
    date?: string
    
    /** Page number */
    page?: number
    
    /** Section name */
    section?: string
    
    /** Author */
    author?: string
  }
}
```

### TokenUsage

Token consumption data:

```typescript
interface TokenUsage {
  /** Tokens in prompt */
  promptTokens: number
  
  /** Tokens in completion */
  completionTokens: number
  
  /** Total tokens (prompt + completion) */
  totalTokens: number
}
```

### ChatMessage

Standard message format:

```typescript
interface ChatMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant' | 'function'
  
  /** Message content */
  content: string
  
  /** Function call (optional) */
  functionCall?: {
    name: string
    arguments: string
  }
  
  /** Function name (for function role) */
  name?: string
}
```

## Adapters

### openAIAdapter

OpenAI GPT models adapter:

```typescript
const openAIAdapter: ModelAdapter

// Methods
chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
estimateCost(usage: TokenUsage, model: string): number
```

**Example**:
```typescript
import { openAIAdapter } from '@clarity-chat/react'

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

**Pricing** (per 1K tokens):
| Model | Input | Output |
|-------|-------|--------|
| gpt-4-turbo | $0.01 | $0.03 |
| gpt-4 | $0.03 | $0.06 |
| gpt-3.5-turbo | $0.0015 | $0.002 |

### anthropicAdapter

Anthropic Claude models adapter:

```typescript
const anthropicAdapter: ModelAdapter

// Methods
chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
estimateCost(usage: TokenUsage, model: string): number
```

**Example**:
```typescript
import { anthropicAdapter } from '@clarity-chat/react'

const response = await anthropicAdapter.chat(messages, {
  provider: 'anthropic',
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
})
```

**Supported Models**:
- `claude-3-opus` - Claude 3 Opus (200K context)
- `claude-3-sonnet` - Claude 3 Sonnet (200K context)
- `claude-3-haiku` - Claude 3 Haiku (200K context)

**Pricing** (per 1M tokens):
| Model | Input | Output |
|-------|-------|--------|
| claude-3-opus | $15 | $75 |
| claude-3-sonnet | $3 | $15 |
| claude-3-haiku | $0.25 | $1.25 |

### googleAdapter

Google Gemini models adapter:

```typescript
const googleAdapter: ModelAdapter

// Methods
chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
estimateCost(usage: TokenUsage, model: string): number
```

**Example**:
```typescript
import { googleAdapter } from '@clarity-chat/react'

const response = await googleAdapter.chat(messages, {
  provider: 'google',
  model: 'gemini-pro',
  apiKey: process.env.GOOGLE_API_KEY
})
```

**Supported Models**:
- `gemini-pro` - Gemini Pro (32K context)
- `gemini-pro-vision` - Gemini Pro Vision (multimodal)

**Pricing** (per 1M tokens):
| Model | Input | Output |
|-------|-------|--------|
| gemini-pro | $0.50 | $1.50 |

## Model Metadata

### ModelMetadata

Rich metadata for each model:

```typescript
interface ModelMetadata {
  /** Model ID */
  id: string
  
  /** Display name */
  name: string
  
  /** Provider */
  provider: 'openai' | 'anthropic' | 'google'
  
  /** Speed rating */
  speed: 'fastest' | 'fast' | 'medium' | 'slow'
  
  /** Cost rating */
  cost: 'low' | 'medium' | 'high'
  
  /** Quality rating */
  quality: 'good' | 'better' | 'best'
  
  /** Context window size */
  contextWindow: number
  
  /** Description */
  description?: string
  
  /** Capabilities */
  capabilities?: {
    streaming?: boolean
    functionCalling?: boolean
    vision?: boolean
  }
}
```

### openAIModels

Array of OpenAI model metadata:

```typescript
const openAIModels: ModelMetadata[]

// Example
[
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    speed: 'fast',
    cost: 'medium',
    quality: 'best',
    contextWindow: 128000,
    capabilities: {
      streaming: true,
      functionCalling: true,
      vision: false
    }
  },
  // ...
]
```

### anthropicModels

Array of Anthropic model metadata:

```typescript
const anthropicModels: ModelMetadata[]
```

### googleModels

Array of Google model metadata:

```typescript
const googleModels: ModelMetadata[]
```

### allModels

Combined array of all models:

```typescript
const allModels: ModelMetadata[]

// Usage
import { allModels } from '@clarity-chat/react'

// Filter by provider
const openAIOnly = allModels.filter(m => m.provider === 'openai')

// Filter by speed
const fastModels = allModels.filter(m => m.speed === 'fastest')

// Filter by cost
const cheapModels = allModels.filter(m => m.cost === 'low')
```

## Helper Functions

### getAdapter

Get adapter by provider name:

```typescript
function getAdapter(provider: string): ModelAdapter

// Usage
import { getAdapter } from '@clarity-chat/react'

const adapter = getAdapter('openai')
const response = await adapter.chat(messages, config)
```

**Parameters**:
- `provider` - Provider name ('openai' | 'anthropic' | 'google')

**Returns**: ModelAdapter instance

**Throws**: Error if provider is unknown

## Usage Examples

### Basic Chat

```typescript
import { openAIAdapter } from '@clarity-chat/react'

const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello!' }
]

const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7
})

console.log(response.content) // "Hello! How can I help you today?"
```

### Streaming

```typescript
import { openAIAdapter } from '@clarity-chat/react'

for await (const chunk of openAIAdapter.stream(messages, config)) {
  if (chunk.type === 'token') {
    process.stdout.write(chunk.content)
  } else if (chunk.type === 'done') {
    console.log('\nTokens used:', chunk.usage.totalTokens)
  }
}
```

### Cost Estimation

```typescript
import { openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const usage = { promptTokens: 1000, completionTokens: 500, totalTokens: 1500 }

const gpt4Cost = openAIAdapter.estimateCost(usage, 'gpt-4-turbo')
console.log('GPT-4 Turbo:', `$${gpt4Cost.toFixed(4)}`)

const claudeCost = anthropicAdapter.estimateCost(usage, 'claude-3-sonnet')
console.log('Claude 3 Sonnet:', `$${claudeCost.toFixed(4)}`)
```

### With Callbacks

```typescript
const config = {
  provider: 'openai',
  model: 'gpt-4-turbo',
  streamOptions: {
    onToken: (token) => console.log('Token:', token),
    onToolCall: (tool) => console.log('Tool:', tool.function.name),
    onComplete: (usage) => console.log('Usage:', usage),
    onError: (error) => console.error('Error:', error)
  }
}

for await (const chunk of openAIAdapter.stream(messages, config)) {
  // Chunks are also yielded in addition to callbacks
}
```

### With Cancellation

```typescript
const controller = new AbortController()

const config = {
  provider: 'openai',
  model: 'gpt-4-turbo',
  signal: controller.signal
}

// Start streaming
const streamPromise = (async () => {
  for await (const chunk of openAIAdapter.stream(messages, config)) {
    console.log(chunk)
  }
})()

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000)

try {
  await streamPromise
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream cancelled')
  }
}
```

## See Also

- [Model Adapters Guide](/guide/model-adapters)
- [Streaming Guide](/guide/streaming)
- [Streaming Components API](/api/streaming-components)
- [Examples](/examples/model-switching)
