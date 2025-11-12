# Streaming

Clarity Chat provides world-class streaming support for real-time AI responses. Stream token-by-token updates, tool invocations, thinking steps, and RAG citations with full error handling and cancellation support.

## Overview

Streaming enables:

- **Real-time Updates**: Display tokens as they arrive
- **Better UX**: Users see progress immediately
- **Tool Invocations**: Approve/reject function calls in real-time
- **Chain-of-Thought**: Show AI reasoning steps
- **RAG Citations**: Display sources as they're retrieved
- **Cost Visibility**: Track token usage during generation

## Quick Start

### Basic Streaming

The simplest way to stream AI responses:

```tsx
import { openAIAdapter, StreamingMessage } from '@clarity-chat/react'
import { useState } from 'react'

function Chat() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleStream = async () => {
    setContent('')
    setIsStreaming(true)

    const config = { 
      provider: 'openai', 
      model: 'gpt-4-turbo',
      apiKey: process.env.OPENAI_API_KEY
    }

    try {
      for await (const chunk of openAIAdapter.stream(messages, config)) {
        if (chunk.type === 'token') {
          setContent(prev => prev + chunk.content)
        } else if (chunk.type === 'done') {
          console.log('Token usage:', chunk.usage)
        }
      }
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div>
      <StreamingMessage 
        content={content} 
        isStreaming={isStreaming} 
      />
      <button onClick={handleStream}>Start</button>
    </div>
  )
}
```

## StreamingMessage Component

The `StreamingMessage` component handles all streaming scenarios:

```tsx
<StreamingMessage
  content={streamingText}
  isStreaming={true}
  toolCalls={pendingTools}
  citations={ragSources}
  thinkingSteps={['Analyzing query...', 'Searching database...']}
  showThinking={true}
  showTools={true}
  showCitations={true}
  error={error}
  onRetry={handleRetry}
/>
```

### Features

| Feature | Description |
|---------|-------------|
| **Token Streaming** | Display text as it arrives with cursor animation |
| **Partial JSON** | Parse and display incomplete JSON objects |
| **Tool Calls** | Show function invocations with approve/reject buttons |
| **Thinking Steps** | Display chain-of-thought reasoning |
| **Citations** | Show RAG sources with confidence scores |
| **Error Handling** | Display errors with retry option |

## Advanced Streaming

### Tool Invocations

Handle function calls during streaming:

```tsx
import { openAIAdapter, StreamingMessage, ToolInvocationCard } from '@clarity-chat/react'
import { useState } from 'react'

function AdvancedChat() {
  const [content, setContent] = useState('')
  const [toolCalls, setToolCalls] = useState([])
  const [toolStatuses, setToolStatuses] = useState({})

  const handleStream = async () => {
    const config = { 
      provider: 'openai', 
      model: 'gpt-4-turbo',
      streamOptions: {
        onToolCall: (tool) => {
          console.log('Tool requested:', tool.function.name)
        }
      }
    }

    for await (const chunk of openAIAdapter.stream(messages, config)) {
      switch (chunk.type) {
        case 'token':
          setContent(prev => prev + chunk.content)
          break
        
        case 'tool_call':
          setToolCalls(prev => [...prev, chunk.toolCall])
          setToolStatuses(prev => ({
            ...prev,
            [chunk.toolCall.id]: 'pending'
          }))
          break
        
        case 'done':
          console.log('Stream complete:', chunk.usage)
          break
      }
    }
  }

  const handleApprove = async (tool) => {
    setToolStatuses(prev => ({ ...prev, [tool.id]: 'executing' }))
    
    try {
      const result = await executeTool(tool.function.name, tool.function.arguments)
      setToolStatuses(prev => ({ ...prev, [tool.id]: 'success' }))
      return result
    } catch (error) {
      setToolStatuses(prev => ({ ...prev, [tool.id]: 'error' }))
      throw error
    }
  }

  return (
    <div>
      <StreamingMessage content={content} />
      
      {toolCalls.map(tool => (
        <ToolInvocationCard
          key={tool.id}
          toolCall={tool}
          status={toolStatuses[tool.id]}
          requiresApproval
          onApprove={handleApprove}
          onReject={(tool) => setToolStatuses(prev => ({ ...prev, [tool.id]: 'rejected' }))}
        />
      ))}
    </div>
  )
}
```

### RAG Citations

Display sources during streaming:

```tsx
import { openAIAdapter, StreamingMessage, CitationCard } from '@clarity-chat/react'
import { useState } from 'react'

function RAGChat() {
  const [content, setContent] = useState('')
  const [citations, setCitations] = useState([])

  const handleStream = async () => {
    for await (const chunk of openAIAdapter.stream(messages, config)) {
      if (chunk.type === 'token') {
        setContent(prev => prev + chunk.content)
      } else if (chunk.type === 'citation') {
        setCitations(prev => [...prev, chunk.citation])
      }
    }
  }

  return (
    <div>
      <StreamingMessage 
        content={content}
        citations={citations}
        showCitations
      />
      
      <div className="citations">
        {citations.map(citation => (
          <CitationCard
            key={citation.id}
            citation={citation}
            showConfidence
          />
        ))}
      </div>
    </div>
  )
}
```

### Chain-of-Thought

Show AI reasoning steps:

```tsx
function ThinkingChat() {
  const [content, setContent] = useState('')
  const [thinkingSteps, setThinkingSteps] = useState([])

  const handleStream = async () => {
    for await (const chunk of openAIAdapter.stream(messages, config)) {
      if (chunk.type === 'token') {
        setContent(prev => prev + chunk.content)
      } else if (chunk.type === 'thinking') {
        setThinkingSteps(prev => [...prev, chunk.content])
      }
    }
  }

  return (
    <StreamingMessage
      content={content}
      thinkingSteps={thinkingSteps}
      showThinking
    />
  )
}
```

## Partial JSON Parsing

StreamingMessage automatically parses incomplete JSON:

```tsx
// Streaming JSON object
// Chunk 1: '{"name": "John'
// Chunk 2: '", "age": 30'
// Chunk 3: ', "city": "NYC"}'

// StreamingMessage handles this automatically:
<StreamingMessage
  content='{"name": "John", "age": 30, "city": "NYC"}'
  isStreaming={true}
/>
// Displays formatted JSON with syntax highlighting
// Unparsed remainder shown as plain text
```

### How It Works

```tsx
const parsePartialJSON = (text: string) => {
  try {
    // Try full parse
    return { parsed: JSON.parse(text), remainder: '' }
  } catch {
    // Find last complete object
    let lastBrace = text.lastIndexOf('}')
    while (lastBrace > 0) {
      try {
        const candidate = text.slice(0, lastBrace + 1)
        const parsed = JSON.parse(candidate)
        const remainder = text.slice(lastBrace + 1)
        return { parsed, remainder }
      } catch {
        lastBrace = text.lastIndexOf('}', lastBrace - 1)
      }
    }
    return { parsed: null, remainder: text }
  }
}
```

## Error Handling

Handle streaming errors gracefully:

```tsx
function ErrorHandlingChat() {
  const [content, setContent] = useState('')
  const [error, setError] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const handleStream = async () => {
    setContent('')
    setError(null)
    setIsStreaming(true)

    try {
      for await (const chunk of openAIAdapter.stream(messages, config)) {
        if (chunk.type === 'token') {
          setContent(prev => prev + chunk.content)
        } else if (chunk.type === 'error') {
          throw new Error(chunk.error.message)
        }
      }
    } catch (err) {
      setError(err)
    } finally {
      setIsStreaming(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    handleStream()
  }

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      error={error}
      onRetry={handleRetry}
    />
  )
}
```

## Cancellation

Cancel streaming requests:

```tsx
function CancellableChat() {
  const [content, setContent] = useState('')
  const abortControllerRef = useRef(null)

  const handleStream = async () => {
    abortControllerRef.current = new AbortController()
    
    const config = {
      provider: 'openai',
      model: 'gpt-4-turbo',
      signal: abortControllerRef.current.signal
    }

    try {
      for await (const chunk of openAIAdapter.stream(messages, config)) {
        if (chunk.type === 'token') {
          setContent(prev => prev + chunk.content)
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream cancelled by user')
      }
    }
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
  }

  return (
    <div>
      <StreamingMessage content={content} />
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}
```

## Performance Optimization

### Debouncing Updates

For very fast streams, debounce state updates:

```tsx
import { useDeferredValue } from 'react'

function OptimizedChat() {
  const [content, setContent] = useState('')
  const deferredContent = useDeferredValue(content)

  return <StreamingMessage content={deferredContent} />
}
```

### Batching Tokens

Batch multiple tokens into single update:

```tsx
function BatchedChat() {
  const [content, setContent] = useState('')
  const bufferRef = useRef('')

  const handleStream = async () => {
    const interval = setInterval(() => {
      if (bufferRef.current) {
        setContent(prev => prev + bufferRef.current)
        bufferRef.current = ''
      }
    }, 50) // Update every 50ms

    try {
      for await (const chunk of openAIAdapter.stream(messages, config)) {
        if (chunk.type === 'token') {
          bufferRef.current += chunk.content
        }
      }
    } finally {
      clearInterval(interval)
      // Flush remaining buffer
      if (bufferRef.current) {
        setContent(prev => prev + bufferRef.current)
      }
    }
  }
}
```

## Multi-Provider Streaming

Stream from any provider with same code:

```tsx
import { getAdapter } from '@clarity-chat/react'

function MultiProviderChat({ provider }) {
  const [content, setContent] = useState('')

  const handleStream = async () => {
    // Works with any provider!
    const adapter = getAdapter(provider)
    
    for await (const chunk of adapter.stream(messages, config)) {
      if (chunk.type === 'token') {
        setContent(prev => prev + chunk.content)
      }
    }
  }

  return <StreamingMessage content={content} />
}

// Usage:
<MultiProviderChat provider="openai" />
<MultiProviderChat provider="anthropic" />
<MultiProviderChat provider="google" />
```

## Best Practices

### 1. Always Handle Errors

```tsx
// ✅ Good
try {
  for await (const chunk of adapter.stream(messages, config)) {
    // Handle chunks
  }
} catch (error) {
  handleError(error)
}

// ❌ Bad
for await (const chunk of adapter.stream(messages, config)) {
  // No error handling!
}
```

### 2. Clean Up Resources

```tsx
// ✅ Good
useEffect(() => {
  const controller = new AbortController()
  
  startStreaming(controller.signal)
  
  return () => controller.abort() // Clean up on unmount
}, [])
```

### 3. Show Progress

```tsx
// ✅ Good
<StreamingMessage 
  content={content} 
  isStreaming={true} // Shows cursor animation
/>

// ❌ Bad
<div>{content}</div> // No indication of streaming
```

### 4. Track Token Usage

```tsx
for await (const chunk of adapter.stream(messages, config)) {
  if (chunk.type === 'done') {
    const cost = adapter.estimateCost(chunk.usage, config.model)
    console.log(`Cost: $${cost.toFixed(4)}`)
  }
}
```

## TypeScript Types

Full type safety for streaming:

```tsx
import type { 
  StreamChunk, 
  ToolCall, 
  Citation, 
  TokenUsage 
} from '@clarity-chat/react'

// Chunk types
type StreamChunk = 
  | { type: 'token'; content: string }
  | { type: 'tool_call'; toolCall: ToolCall }
  | { type: 'thinking'; content: string }
  | { type: 'citation'; citation: Citation }
  | { type: 'done'; usage: TokenUsage }
  | { type: 'error'; error: Error }
```

## Next Steps

- **[Model Adapters](/guide/model-adapters)** - Learn about adapter system
- **[API Reference](/api/streaming-components)** - Complete component API
- **[Examples](/examples/streaming)** - Working streaming demos
- **[Cookbook](/cookbook#streaming)** - Streaming recipes
