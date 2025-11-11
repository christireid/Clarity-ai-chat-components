# AI Agents

Clarity Chat includes a powerful agent orchestration system for building multi-step AI workflows with tool calling, memory, and reasoning capabilities.

## Overview

Agents enable your AI assistant to:
- Call external tools and APIs
- Maintain memory across conversations
- Break down complex tasks into steps
- Make decisions based on context
- Chain multiple operations together

## Basic Agent Setup

### Creating an Agent

```tsx
import { ReactAgent, AgentTool } from '@clarity-chat/react'

const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  apiKey: process.env.OPENAI_API_KEY,
  tools: [
    {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string' },
        },
        required: ['location'],
      },
      execute: async ({ location }) => {
        // Call weather API
        const response = await fetch(`https://api.weather.com/${location}`)
        return response.json()
      },
    },
  ],
})
```

### Using an Agent in Chat

```tsx
import { ChatWindow, useAgent } from '@clarity-chat/react'

function AgentChat() {
  const { messages, sendMessage, isRunning } = useAgent({
    agent,
    onToolCall: (tool, args) => {
      console.log(`Calling ${tool} with`, args)
    },
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isRunning}
    />
  )
}
```

## Tool Definitions

### Simple Tool

```tsx
const calculatorTool: AgentTool = {
  name: 'calculator',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate',
      },
    },
    required: ['expression'],
  },
  execute: async ({ expression }) => {
    try {
      return { result: eval(expression) }
    } catch (error) {
      return { error: 'Invalid expression' }
    }
  },
}
```

### Async Tool with External API

```tsx
const searchTool: AgentTool = {
  name: 'web_search',
  description: 'Search the web for information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      maxResults: { type: 'number', default: 5 },
    },
    required: ['query'],
  },
  execute: async ({ query, maxResults = 5 }) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, maxResults }),
    })
    return response.json()
  },
}
```

## Agent Memory

Agents can maintain memory across conversations:

```tsx
import { ReactAgent, MemoryService } from '@clarity-chat/react'

const memoryService = new MemoryService({
  provider: 'local', // or 'vector-store' for persistent memory
})

const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  memory: memoryService,
  systemPrompt: `You are a helpful assistant with memory.
    Remember important facts about the user and reference them in future conversations.`,
})
```

### Memory Types

1. **Session Memory**: Temporary, cleared when session ends
2. **Thread Memory**: Persists across sessions for a conversation thread
3. **Global Memory**: Shared across all conversations

```tsx
// Store in memory
await memoryService.store({
  key: 'user_preference',
  value: 'dark mode',
  scope: 'thread',
})

// Retrieve from memory
const preference = await memoryService.retrieve({
  key: 'user_preference',
  scope: 'thread',
})
```

## Agent Workflows

### Sequential Tool Execution

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  tools: [searchTool, calculatorTool],
  executionMode: 'sequential', // Execute tools one at a time
})
```

### Parallel Tool Execution

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  tools: [searchTool, weatherTool],
  executionMode: 'parallel', // Execute multiple tools simultaneously
})
```

## Agent Run Feed

Display agent execution steps to users:

```tsx
import { AgentRunFeed } from '@clarity-chat/react'

function AgentChat() {
  const [steps, setSteps] = useState([])

  const agent = new ReactAgent({
    model: 'gpt-4-turbo',
    tools: [searchTool],
    onStep: (step) => {
      setSteps(prev => [...prev, step])
    },
  })

  return (
    <div>
      <AgentRunFeed steps={steps} />
      <ChatWindow messages={messages} onSendMessage={sendMessage} />
    </div>
  )
}
```

## Error Handling

Handle tool execution errors gracefully:

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  tools: [
    {
      name: 'risky_tool',
      execute: async (args) => {
        try {
          return await callExternalAPI(args)
        } catch (error) {
          return {
            error: error.message,
            retryable: true,
          }
        }
      },
    },
  ],
  onToolError: (tool, error, retry) => {
    console.error(`Tool ${tool} failed:`, error)
    // Optionally retry
    if (error.retryable) {
      setTimeout(retry, 1000)
    }
  },
})
```

## Agent Templates

Use pre-built agent templates for common use cases:

```tsx
import { CodeAssistantTemplate } from '@clarity-chat/react'

const codeAgent = CodeAssistantTemplate({
  model: 'gpt-4-turbo',
  tools: [
    // Code-specific tools
  ],
})
```

Available templates:
- `CodeAssistantTemplate` - Code review, debugging, generation
- `DataAnalystTemplate` - Data analysis and visualization
- `CustomerSupportTemplate` - Customer service automation
- `ResearchAssistantTemplate` - Research and information gathering

## Advanced Patterns

### Conditional Tool Execution

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  tools: [searchTool, calculatorTool],
  toolSelectionStrategy: (context, availableTools) => {
    // Custom logic to select which tools to use
    if (context.includes('calculate')) {
      return [calculatorTool]
    }
    return availableTools
  },
})
```

### Tool Result Transformation

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  tools: [searchTool],
  transformToolResult: (tool, result) => {
    // Transform tool results before sending to model
    if (tool === 'web_search') {
      return {
        ...result,
        formatted: result.items.map(item => item.title).join('\n'),
      }
    }
    return result
  },
})
```

## Best Practices

1. **Tool Descriptions**: Write clear, detailed tool descriptions
2. **Error Handling**: Always handle tool errors gracefully
3. **Rate Limiting**: Implement rate limits for external API calls
4. **Cost Monitoring**: Track token usage for agent operations
5. **User Feedback**: Show agent progress with `AgentRunFeed`
6. **Memory Management**: Use appropriate memory scopes
7. **Security**: Validate and sanitize tool inputs

## Next Steps

- [Tool Invocation Card](/api/components/tool-invocation-card) - Display tool calls
- [Agent Run Feed](/api/components/agent-run-feed) - Show execution steps
- [Memory System](/guide/memory) - Learn about memory management
- [API Reference](/api/agents) - Complete agent API
