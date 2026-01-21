# Agent Hooks

Hooks for building AI agents with tool calling and multi-step reasoning.

## Overview

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useAgent` | AI agent orchestration with tool calling | Multi-step reasoning, automatic tool management, state tracking, error handling |

---

## useAgent

Top-level hook for AI agent orchestration with automatic tool management and multi-step execution.

### Signature

```typescript
function useAgent(options: UseAgentOptions): UseAgentReturn

interface UseAgentOptions {
  model: string                      // Model identifier (e.g., 'gpt-4')
  tools?: Tool[]                     // Available tools
  api?: string                       // API endpoint
  config?: Record<string, any>       // Additional configuration
}

interface UseAgentReturn {
  run: (input: { query: string; context?: any }) => Promise<string>
  isLoading: boolean
  error: Error | null
  state: {
    currentStep: number
    totalSteps: number
    toolCalls: ToolCall[]
  }
}

interface Tool {
  name: string
  description: string
  execute: (args: Record<string, unknown>) => Promise<unknown>
  parameters?: Record<string, unknown>
}

interface ToolCall {
  tool: string
  args: Record<string, unknown>
  result: unknown
}
```

### Examples

#### Basic Agent with Calculator Tool

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

// Define a calculator tool
const calculatorTool = {
  name: 'calculator',
  description: 'Performs basic arithmetic operations',
  parameters: {
    operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
    a: { type: 'number' },
    b: { type: 'number' },
  },
  execute: async (args: Record<string, unknown>) => {
    const { operation, a, b } = args as { operation: string; a: number; b: number }
    switch (operation) {
      case 'add': return a + b
      case 'subtract': return a - b
      case 'multiply': return a * b
      case 'divide': return a / b
      default: throw new Error('Invalid operation')
    }
  },
}

function CalculatorAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [calculatorTool],
  })

  const handleSubmit = async (query: string) => {
    try {
      const response = await agent.run({ query })
      console.log('Agent response:', response)
    } catch (error) {
      console.error('Agent failed:', error)
    }
  }

  return (
    <div>
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e.currentTarget.value)
          }
        }}
        placeholder="Ask a math question..."
        disabled={agent.isLoading}
      />
      {agent.isLoading && <Spinner />}
      {agent.error && <div className="text-red-500">{agent.error.message}</div>}
      {agent.state.toolCalls.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Tool calls: {agent.state.toolCalls.length}
        </div>
      )}
    </div>
  )
}
```

#### Agent with Web Search Tool

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

// Web search tool
const webSearchTool = {
  name: 'web_search',
  description: 'Searches the web for current information',
  parameters: {
    query: { type: 'string', description: 'Search query' },
  },
  execute: async (args: Record<string, unknown>) => {
    const { query } = args as { query: string }
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
    const results = await response.json()
    return results
  },
}

function ResearchAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [webSearchTool],
    config: {
      maxIterations: 5,  // Limit reasoning steps
    },
  })

  const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([])

  const handleQuery = async (query: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: query }])

    try {
      const response = await agent.run({ query })
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Agent error:', error)
    }
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Show agent progress */}
      {agent.isLoading && (
        <div className="agent-status">
          <Spinner />
          <span>Step {agent.state.currentStep} / {agent.state.totalSteps}</span>
        </div>
      )}

      {/* Show tool calls */}
      {agent.state.toolCalls.length > 0 && (
        <div className="tool-calls">
          {agent.state.toolCalls.map((call, i) => (
            <div key={i} className="tool-call">
              <strong>{call.tool}</strong>
              <pre>{JSON.stringify(call.args, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}

      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !agent.isLoading) {
            handleQuery(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        placeholder="Ask me anything..."
        disabled={agent.isLoading}
      />
    </div>
  )
}
```

#### Multi-Tool Agent

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

// Multiple tools for different capabilities
const tools = [
  {
    name: 'calculator',
    description: 'Performs arithmetic operations',
    parameters: {
      expression: { type: 'string', description: 'Math expression like "2 + 2"' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { expression } = args as { expression: string }
      // Use eval safely with validation
      return eval(expression)
    },
  },
  {
    name: 'get_weather',
    description: 'Gets current weather for a location',
    parameters: {
      location: { type: 'string', description: 'City name' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { location } = args as { location: string }
      const response = await fetch(`/api/weather?location=${location}`)
      return response.json()
    },
  },
  {
    name: 'send_email',
    description: 'Sends an email',
    parameters: {
      to: { type: 'string' },
      subject: { type: 'string' },
      body: { type: 'string' },
    },
    execute: async (args: Record<string, unknown>) => {
      const { to, subject, body } = args as { to: string; subject: string; body: string }
      await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify({ to, subject, body }),
      })
      return { success: true }
    },
  },
]

function MultiToolAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools,
    api: '/api/agent',
  })

  const [conversation, setConversation] = React.useState<string[]>([])

  const handleMessage = async (message: string) => {
    setConversation((prev) => [...prev, `User: ${message}`])

    try {
      const response = await agent.run({ query: message })
      setConversation((prev) => [...prev, `Agent: ${response}`])
    } catch (error) {
      setConversation((prev) => [...prev, `Error: ${error.message}`])
    }
  }

  return (
    <div>
      <div className="conversation">
        {conversation.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {agent.isLoading && (
        <div className="agent-thinking">
          <span>Agent is thinking...</span>
          <div className="tool-calls">
            {agent.state.toolCalls.map((call, i) => (
              <span key={i} className="tool-badge">
                {call.tool}
              </span>
            ))}
          </div>
        </div>
      )}

      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !agent.isLoading) {
            handleMessage(e.currentTarget.value)
            e.currentTarget.value = ''
          }
        }}
        placeholder="What can I help you with?"
        disabled={agent.isLoading}
      />
    </div>
  )
}
```

#### Agent with Custom API Endpoint

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

function CustomAPIAgent() {
  const agent = useAgent({
    model: 'claude-3-5-sonnet-20241022',
    tools: [/* your tools */],
    api: '/api/custom-agent',  // Custom backend endpoint
    config: {
      maxIterations: 10,
      temperature: 0.7,
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
  })

  const handleQuery = async (query: string) => {
    const response = await agent.run({
      query,
      context: {
        userId: 'user-123',
        sessionId: 'session-456',
        // Additional context for the agent
      },
    })
    return response
  }

  return (
    <div>
      {/* Agent UI */}
    </div>
  )
}
```

#### Agent Progress Visualization

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

function AgentWithProgress() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [webSearchTool, calculatorTool, databaseTool],
  })

  return (
    <div>
      {/* Progress bar */}
      {agent.isLoading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(agent.state.currentStep / agent.state.totalSteps) * 100}%`,
              }}
            />
          </div>
          <span className="progress-text">
            Step {agent.state.currentStep} of {agent.state.totalSteps}
          </span>
        </div>
      )}

      {/* Tool execution timeline */}
      <div className="tool-timeline">
        {agent.state.toolCalls.map((call, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-icon">
              <ToolIcon name={call.tool} />
            </div>
            <div className="timeline-content">
              <strong>{call.tool}</strong>
              <div className="tool-args">
                {Object.entries(call.args).map(([key, value]) => (
                  <span key={key}>
                    {key}: {JSON.stringify(value)}
                  </span>
                ))}
              </div>
              <div className="tool-result">
                Result: {JSON.stringify(call.result)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error display */}
      {agent.error && (
        <div className="error-banner">
          <strong>Agent Error:</strong> {agent.error.message}
        </div>
      )}
    </div>
  )
}
```

#### Agent with Error Recovery

```tsx
import { useAgent } from '@clarity/react/hooks/chat'

function ResilientAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [apiTool, databaseTool],
  })

  const [retryCount, setRetryCount] = React.useState(0)
  const maxRetries = 3

  const handleQueryWithRetry = async (query: string) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt)
        const response = await agent.run({ query })
        setRetryCount(0) // Reset on success
        return response
      } catch (error) {
        if (attempt === maxRetries) {
          console.error('Max retries reached:', error)
          throw error
        }
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000))
      }
    }
  }

  return (
    <div>
      {retryCount > 0 && (
        <div className="retry-indicator">
          Retry attempt {retryCount} of {maxRetries}
        </div>
      )}

      {agent.error && (
        <div className="error-recovery">
          <strong>Agent failed:</strong> {agent.error.message}
          <button onClick={() => handleQueryWithRetry('retry last query')}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
```

### When to Use

✅ **Use when:**
- Building AI assistants with tool calling capabilities
- Need multi-step reasoning with external tools
- Want automatic tool orchestration
- Building research agents that need web search
- Creating task automation agents

❌ **Avoid when:**
- Simple chat without tools (use `useClarityChat` instead)
- No need for multi-step reasoning
- Tools are not available or too slow
- LLM API doesn't support tool calling

### Common Patterns

#### Pattern 1: Tool Definition

```typescript
const tool = {
  name: 'tool_name',
  description: 'Clear description of what the tool does',
  parameters: {
    param1: { type: 'string', description: 'Parameter description' },
    param2: { type: 'number', description: 'Numeric parameter' },
  },
  execute: async (args: Record<string, unknown>) => {
    // Validate args
    // Execute tool logic
    // Return result
  },
}
```

#### Pattern 2: Async Tool Execution

```typescript
const asyncTool = {
  name: 'database_query',
  description: 'Queries database for information',
  execute: async (args: Record<string, unknown>) => {
    const { query } = args as { query: string }

    // Async database call
    const result = await db.query(query)

    // Return formatted result
    return {
      rows: result.rows,
      count: result.count,
    }
  },
}
```

#### Pattern 3: Tool with Error Handling

```typescript
const robustTool = {
  name: 'api_call',
  description: 'Calls external API',
  execute: async (args: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/external', {
        method: 'POST',
        body: JSON.stringify(args),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      // Return error information to agent
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }
    }
  },
}
```

---

## Agent Types

### ReactAgent

Low-level agent implementation class (used internally by `useAgent`).

```typescript
class ReactAgent {
  constructor(config: AgentConfig)
  execute(query: string): Promise<AgentExecution>
  getTools(): Tool[]
  getConfig(): AgentConfig
}

interface AgentConfig {
  name: string
  description: string
  model: string
  tools: Tool[]
  maxIterations?: number
}

interface AgentExecution {
  steps: AgentStep[]
  answer: string | null
  success: boolean
}

interface AgentStep {
  type: 'thought' | 'action' | 'observation'
  content?: string
  tool?: string
  args?: Record<string, unknown>
  result?: unknown
}
```

**Usage:**

```typescript
import { ReactAgent } from '@clarity/react/hooks/agents'

const agent = new ReactAgent({
  name: 'my-agent',
  description: 'Custom agent',
  model: 'gpt-4',
  tools: [tool1, tool2],
  maxIterations: 10,
})

const execution = await agent.execute('What is 2+2?')
console.log(execution.answer) // "4"
console.log(execution.steps)  // [{ type: 'thought', ... }, { type: 'action', ... }]
```

---

## Troubleshooting

### "Agent not initialized" error

**Problem:** Calling `agent.run()` before agent is ready.

**Solution:** Wait for component mount or check loading state:

```tsx
const agent = useAgent({ model: 'gpt-4', tools })

// Ensure agent is initialized
React.useEffect(() => {
  if (!agent.isLoading && !agent.error) {
    // Agent is ready
  }
}, [agent.isLoading, agent.error])
```

---

### Tool execution fails silently

**Problem:** Tool throws error but agent doesn't handle it.

**Solution:** Add error handling in tool `execute` function:

```typescript
const tool = {
  name: 'my_tool',
  execute: async (args) => {
    try {
      // Tool logic
      return result
    } catch (error) {
      // Return error info instead of throwing
      return {
        error: error.message,
        success: false,
      }
    }
  },
}
```

---

### Agent exceeds max iterations

**Problem:** Agent loops indefinitely without reaching answer.

**Solution:** Increase `maxIterations` or improve tool descriptions:

```tsx
const agent = useAgent({
  model: 'gpt-4',
  tools,
  config: {
    maxIterations: 20,  // Increase limit
  },
})

// OR improve tool descriptions
const betterTool = {
  name: 'calculator',
  description: 'Performs arithmetic. Use this for ANY math calculation including basic operations like addition, subtraction, multiplication, division.',
  // Clear description helps agent know when to use the tool
}
```

---

### Model doesn't support tool calling

**Problem:** Model doesn't support function calling format.

**Solution:** Use models that support tool calling:

```tsx
// ✅ Models with tool calling support
const agent = useAgent({
  model: 'gpt-4-turbo',         // OpenAI
  // OR
  model: 'claude-3-5-sonnet',   // Anthropic
  // OR
  model: 'gemini-1.5-pro',      // Google
  tools,
})

// ❌ Models without tool calling
// - gpt-3.5-turbo (older versions)
// - claude-2
// - text-davinci-003
```

---

### Tool parameters not validated

**Problem:** Tool receives invalid arguments.

**Solution:** Add parameter validation:

```typescript
const tool = {
  name: 'calculator',
  parameters: {
    operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
    a: { type: 'number', required: true },
    b: { type: 'number', required: true },
  },
  execute: async (args: Record<string, unknown>) => {
    // Validate args match parameters
    const { operation, a, b } = args as { operation: string; a: number; b: number }

    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Invalid arguments: a and b must be numbers')
    }

    if (!['add', 'subtract', 'multiply', 'divide'].includes(operation)) {
      throw new Error(`Invalid operation: ${operation}`)
    }

    // Execute tool
  },
}
```

---

## Related Hooks

- `useClarityChat` - Simple chat without agents
- `useToolCalling` - Lower-level tool calling
- `useStreamingAgent` - Agent with streaming responses

---

## Advanced Examples

### Agent with Streaming

```tsx
import { useAgent } from '@clarity/react/hooks/chat'
import { useStreaming } from '@clarity/react/hooks/streaming'

function StreamingAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [webSearchTool],
  })

  const { streamingText, isStreaming } = useStreaming()

  const handleQueryWithStreaming = async (query: string) => {
    // Agent executes tools in background
    const response = await agent.run({ query })

    // Stream the final response
    streamingText(response)
  }

  return (
    <div>
      {isStreaming ? (
        <TypewriterText text={streamingText} />
      ) : (
        <div>{streamingText}</div>
      )}

      {agent.state.toolCalls.length > 0 && (
        <div className="tools-used">
          Tools: {agent.state.toolCalls.map(c => c.tool).join(', ')}
        </div>
      )}
    </div>
  )
}
```

### Agent with Memory

```tsx
import { useAgent } from '@clarity/react/hooks/chat'
import { useConversationHistory } from '@clarity/react/hooks/memory'

function AgentWithMemory() {
  const history = useConversationHistory({ maxMessages: 10 })

  const agent = useAgent({
    model: 'gpt-4',
    tools: [calculatorTool, webSearchTool],
  })

  const handleMessage = async (message: string) => {
    // Add user message to history
    history.addMessage({ role: 'user', content: message })

    // Run agent with context from history
    const response = await agent.run({
      query: message,
      context: {
        history: history.messages,
      },
    })

    // Add agent response to history
    history.addMessage({ role: 'assistant', content: response })

    return response
  }

  return (
    <div>
      <MessageList messages={history.messages} />
      <input onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleMessage(e.currentTarget.value)
        }
      }} />
    </div>
  )
}
```

---

## Best Practices

### 1. Clear Tool Descriptions

```typescript
// ✅ Good: Clear, specific description
const goodTool = {
  name: 'get_weather',
  description: 'Gets current weather conditions for a specified city. Returns temperature, conditions, and forecast. Use this when user asks about weather or temperature.',
  parameters: {
    city: { type: 'string', description: 'City name (e.g., "San Francisco")' },
  },
  execute: async (args) => { /* ... */ },
}

// ❌ Bad: Vague description
const badTool = {
  name: 'weather',
  description: 'Weather stuff',
  execute: async (args) => { /* ... */ },
}
```

### 2. Limit Max Iterations

```typescript
// Prevent infinite loops
const agent = useAgent({
  model: 'gpt-4',
  tools,
  config: {
    maxIterations: 10,  // Reasonable limit
  },
})
```

### 3. Handle Tool Errors Gracefully

```typescript
const resilientTool = {
  name: 'api_call',
  execute: async (args) => {
    try {
      return await callAPI(args)
    } catch (error) {
      // Return error as result, don't throw
      return {
        error: error.message,
        success: false,
        fallback: 'default value',
      }
    }
  },
}
```

### 4. Monitor Tool Usage

```typescript
const agent = useAgent({ model: 'gpt-4', tools })

// Track tool usage for analytics
React.useEffect(() => {
  if (agent.state.toolCalls.length > 0) {
    const toolNames = agent.state.toolCalls.map(c => c.tool)
    analytics.track('agent_tools_used', { tools: toolNames })
  }
}, [agent.state.toolCalls])
```
