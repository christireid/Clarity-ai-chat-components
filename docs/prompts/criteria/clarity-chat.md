# Clarity Chat Review Criteria

> Canonical criteria for Clarity Chat API usage and patterns

## Hook Usage

### Critical Checks
- [ ] `useClarityChat` configured with required options
- [ ] `useTokenBudget` integrated for token-aware UIs
- [ ] `useMemory` used within MemoryProvider context
- [ ] `useStreaming` handles all stream states
- [ ] `useAgent` properly configured with tools
- [ ] Custom hooks follow `use*` naming convention

### Core Hook Patterns

```tsx
import {
  useClarityChat,
  useTokenBudget,
  useMemory,
  useStreaming
} from '@clarity-chat/react'

// Basic chat setup
const { messages, sendMessage, isStreaming, error } = useClarityChat({
  systemPrompt: 'You are a helpful assistant.',
  provider: 'openai',
  model: 'gpt-4',
})

// Token budget integration
const { budget, remaining, percentage, isNearLimit } = useTokenBudget({
  maxTokens: 4000,
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
})

// Memory integration (must be within MemoryProvider)
const { addMemory, queryMemories, clearMemories } = useMemory()

// Streaming with full state handling
const {
  isConnected,
  isStreaming,
  partialResponse,
  error,
  cancel
} = useStreaming()
```

## Streaming Patterns

### Critical Checks
- [ ] Loading state shown during stream initialization
- [ ] Partial tokens handled correctly (no split words)
- [ ] Stream cancellation supported and accessible
- [ ] Error recovery on stream interruption
- [ ] Progressive markdown rendering enabled
- [ ] Backpressure handled for fast streams

### Streaming Implementation

```tsx
'use client'

import { useClarityChat, StreamingMessage } from '@clarity-chat/react'

export function ChatInterface() {
  const {
    messages,
    sendMessage,
    isStreaming,
    cancelStream,
    error
  } = useClarityChat({
    systemPrompt: 'You are helpful.',
    onStreamStart: () => console.log('Stream started'),
    onStreamEnd: () => console.log('Stream complete'),
    onError: (err) => console.error('Stream error:', err),
  })

  return (
    <div>
      {messages.map(msg => (
        <StreamingMessage
          key={msg.id}
          message={msg}
          renderMarkdown
          showTokenCount
        />
      ))}

      {isStreaming && (
        <button onClick={cancelStream}>
          Cancel
        </button>
      )}

      {error && (
        <div className="text-red-600">
          Error: {error.message}
          <button onClick={() => sendMessage(lastInput)}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
```

## Token Budget Integration

### Critical Checks
- [ ] Budget warnings displayed at 80% usage
- [ ] Critical warnings at 95% usage
- [ ] System prompts protected from trimming
- [ ] Cost estimation shown before send
- [ ] Token count visible during message composition
- [ ] KV-cache alignment considered for optimization

### Token Budget UI

```tsx
import { useTokenBudget, TokenBudgetBar } from '@clarity-chat/react'

export function ChatWithBudget() {
  const budget = useTokenBudget({
    maxTokens: 4000,
    reservedForOutput: 1000,
    warningThreshold: 0.8,
  })

  const handleSend = async (content: string) => {
    if (budget.remaining < 100) {
      alert('Token budget nearly exhausted. Consider starting a new conversation.')
      return
    }
    await sendMessage(content)
  }

  return (
    <>
      <TokenBudgetBar
        budget={budget}
        showCost
        showWarnings
      />

      {budget.isNearLimit && (
        <div className="text-amber-600 text-sm">
          Warning: {budget.percentage}% of token budget used
        </div>
      )}

      <ChatInput
        onSend={handleSend}
        disabled={budget.remaining < 50}
        tokenCount={budget.inputTokens}
      />
    </>
  )
}
```

## Memory Integration

### Critical Checks
- [ ] MemoryProvider wraps chat components
- [ ] Context window limits respected
- [ ] Summarization configured for long conversations
- [ ] Cross-session memory persistence handled
- [ ] Memory query used for relevant context retrieval
- [ ] User data privacy controls implemented

### Memory Setup

```tsx
import { MemoryProvider, useMemory } from '@clarity-chat/react'

// Wrap app with provider
export function App() {
  return (
    <MemoryProvider config={{
      strategy: 'sliding-window',
      maxTokens: 8000,
      summarizationThreshold: 0.7,
      persistenceKey: 'chat-memory',
    }}>
      <ChatApp />
    </MemoryProvider>
  )
}

// Use memory in components
function ChatApp() {
  const {
    addMemory,
    queryMemories,
    summarize,
    stats
  } = useMemory()

  // Add important context
  await addMemory({
    content: 'User prefers dark mode',
    type: 'preference',
    importance: 'high',
  })

  // Query relevant memories
  const relevant = await queryMemories({
    query: 'user preferences',
    limit: 5,
  })

  return (
    <div>
      <MemoryStats stats={stats} />
      <Chat memories={relevant} />
    </div>
  )
}
```

## Tool/Agent Patterns

### Critical Checks
- [ ] Tool schemas validated with Zod
- [ ] Tool UI registered in ToolUIRegistry
- [ ] Dangerous tools require user confirmation (`requiresApproval: true`)
- [ ] Tool errors displayed gracefully
- [ ] Loading states during tool execution
- [ ] Tool results rendered appropriately

### Tool Implementation

```tsx
import { z } from 'zod'
import {
  createTool,
  ToolUIRegistry,
  useAgent
} from '@clarity-chat/react'

// Define tool with schema
const weatherTool = createTool({
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: z.object({
    location: z.string().describe('City name'),
    units: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  }),
  execute: async ({ location, units }) => {
    const data = await fetchWeather(location, units)
    return { temperature: data.temp, conditions: data.conditions }
  },
  requiresApproval: false,
})

// Register custom UI for tool results
ToolUIRegistry.register('get_weather', ({ result, isLoading }) => (
  <div className="p-3 bg-blue-50 rounded-lg">
    {isLoading ? (
      <Spinner />
    ) : (
      <>
        <div className="text-2xl">{result.temperature}°</div>
        <div className="text-gray-600">{result.conditions}</div>
      </>
    )}
  </div>
))

// Use agent with tools
function AgentChat() {
  const { messages, sendMessage, pendingTools } = useAgent({
    tools: [weatherTool],
    onToolCall: (tool, args) => {
      console.log(`Calling ${tool.name} with`, args)
    },
  })

  return (
    <div>
      {pendingTools.map(tool => (
        <ToolApprovalDialog
          key={tool.id}
          tool={tool}
          onApprove={() => tool.execute()}
          onReject={() => tool.cancel()}
        />
      ))}
    </div>
  )
}
```

## Provider Compatibility

### Critical Checks
- [ ] Code works with OpenAI, Anthropic, and Google providers
- [ ] Provider-specific features gracefully degrade
- [ ] API errors handled appropriately per provider
- [ ] Rate limiting handled per provider
- [ ] Model-specific token limits respected

### Provider Compatibility Matrix

| Feature | OpenAI | Anthropic | Google | Notes |
|---------|--------|-----------|--------|-------|
| Streaming | ✓ | ✓ | ✓ | All support SSE |
| Tool Calls | ✓ | ✓ | ⚠ | Google limited |
| Vision | ✓ | ✓ | ✓ | Model-dependent |
| System Prompt | ✓ | ✓ | ✓ | Format differs |
| Token Counting | ✓ | ✓ | ⚠ | Google estimates |

### Provider-Agnostic Pattern

```tsx
import { useClarityChat, ProviderConfig } from '@clarity-chat/react'

const providerConfig: ProviderConfig = {
  openai: { model: 'gpt-4-turbo' },
  anthropic: { model: 'claude-3-opus' },
  google: { model: 'gemini-pro' },
}

function Chat({ provider }: { provider: keyof typeof providerConfig }) {
  const chat = useClarityChat({
    provider,
    ...providerConfig[provider],
    onError: (error) => {
      // Handle provider-specific errors
      if (error.code === 'rate_limit') {
        // Show rate limit UI
      } else if (error.code === 'context_length') {
        // Trigger summarization
      }
    },
  })

  return <ChatUI {...chat} />
}
```

## Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| Missing MemoryProvider | Critical | Hook crashes |
| No stream error handling | High | Silent failures |
| No token budget warnings | Medium | Unexpected truncation |
| Missing tool confirmation | Medium | User trust |
| No loading states | Low | Poor UX |
