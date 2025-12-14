# Agent Orchestration

> **Build AI agents with tool calling and ReAct pattern**

This recipe shows how to build an AI agent that can use tools, reason about actions, and execute complex workflows.

## Prerequisites

- Agent orchestration configured
- Tools defined
- Tool UI registry set up (optional)

## Complete Example

```tsx
import { 
  useClarityChat,
  useAgentOrchestration,
  createToolUIRegistry,
  ClarityToolResult,
  ChatWindow,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

// Define tools
const tools = [
  {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name' },
        unit: { type: 'string', enum: ['celsius', 'fahrenheit'], default: 'celsius' },
      },
      required: ['location'],
    },
    execute: async ({ location, unit }) => {
      // Mock weather API call
      return {
        location,
        temperature: unit === 'celsius' ? '22°C' : '72°F',
        condition: 'Sunny',
      }
    },
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string', description: 'Mathematical expression' },
      },
      required: ['expression'],
    },
    execute: async ({ expression }) => {
      try {
        // Safe evaluation (use a proper math parser in production)
        const result = Function(`"use strict"; return (${expression})`)()
        return { expression, result }
      } catch (error) {
        return { expression, error: 'Invalid expression' }
      }
    },
  },
]

// Tool UI registry for custom rendering
const toolRegistry = createToolUIRegistry({
  get_weather: ({ data }) => (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold">Weather in {data.location}</h3>
      <p className="text-2xl">{data.temperature}</p>
      <p>{data.condition}</p>
    </div>
  ),
  calculate: ({ data }) => (
    <div className="p-4 bg-green-50 rounded-lg">
      <p className="font-mono">{data.expression} = {data.result}</p>
    </div>
  ),
})

function AgentChat() {
  // Initialize agent orchestration
  const agent = useAgentOrchestration({
    model: 'gpt-4',
    tools,
    strategy: 'react', // ReAct pattern
    maxIterations: 5,
  })

  // Chat hook
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    tools,
    onToolCall: async (toolCall) => {
      // Execute tool
      const tool = tools.find(t => t.name === toolCall.name)
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`)
      }

      const result = await tool.execute(toolCall.arguments)
      return result
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-purple-50">
        <p className="text-sm text-purple-700">
          🤖 Agent Mode: Can use tools to answer questions
        </p>
      </div>
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
        renderMessage={(message) => {
          // Custom rendering for tool results
          if (message.metadata?.toolInvocations) {
            return (
              <div>
                {message.metadata.toolInvocations.map((toolCall, idx) => (
                  <ClarityToolResult
                    key={idx}
                    registry={toolRegistry}
                    toolCall={toolCall}
                    result={toolCall.result}
                  />
                ))}
              </div>
            )
          }
          return <div>{message.content}</div>
        }}
      />
    </div>
  )
}
```

## Step-by-Step Setup

### 1. Define Tools

```tsx
const tools = [
  {
    name: 'tool_name',
    description: 'What the tool does',
    parameters: {
      type: 'object',
      properties: {
        param: { type: 'string', description: 'Parameter description' },
      },
      required: ['param'],
    },
    execute: async ({ param }) => {
      // Tool implementation
      return { result: 'value' }
    },
  },
]
```

### 2. Initialize Agent

```tsx
import { useAgentOrchestration } from '@clarity-chat/react'

const agent = useAgentOrchestration({
  model: 'gpt-4',
  tools,
  strategy: 'react', // ReAct pattern
  maxIterations: 5,
})
```

### 3. Configure Chat with Tools

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  tools,
  onToolCall: async (toolCall) => {
    const tool = tools.find(t => t.name === toolCall.name)
    return await tool.execute(toolCall.arguments)
  },
})
```

### 4. Render Tool Results

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

const toolRegistry = createToolUIRegistry({
  tool_name: ({ data }) => <CustomComponent data={data} />,
})

// In message rendering
<ClarityToolResult
  registry={toolRegistry}
  toolCall={toolCall}
  result={result}
/>
```

## Key Points

- **Tool Definition**: Use JSON Schema for parameters
- **Tool Execution**: Handle errors gracefully
- **Tool UI**: Custom rendering for better UX
- **Agent Strategy**: Choose ReAct for complex reasoning

## Advanced: Multi-Agent System

```tsx
const agents = {
  research: useAgentOrchestration({
    model: 'gpt-4',
    tools: [webSearchTool, summarizeTool],
    strategy: 'react',
  }),
  analysis: useAgentOrchestration({
    model: 'gpt-4',
    tools: [analyzeTool, compareTool],
    strategy: 'react',
  }),
}

// Coordinate agents
const result = await agents.research.run({ query: 'Research topic' })
const analysis = await agents.analysis.run({ data: result })
```

## Related

- [Custom Tools](./custom-tools.md) - Custom tool result rendering
- [Tool UI Registry](../../packages/react/README.md#tool-ui-registry) - Tool result patterns
- [Examples](../../apps/examples/README.md) - Production examples
