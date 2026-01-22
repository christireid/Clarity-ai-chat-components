# Tool Calling (Function Calling) Guide

Complete guide to using tool calling across all model adapters (OpenAI, Anthropic, Google).

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Tool Definition Format](#tool-definition-format)
- [Usage Examples](#usage-examples)
  - [OpenAI](#openai-example)
  - [Anthropic](#anthropic-example)
  - [Google](#google-example)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Tool calling (also known as function calling) allows AI models to invoke external functions with structured arguments. This enables:

- **Database queries**: Query databases with natural language
- **API integration**: Call external APIs based on user intent
- **Calculations**: Perform precise calculations
- **Data retrieval**: Fetch real-time information
- **Multi-step workflows**: Chain multiple operations

All three adapters (OpenAI, Anthropic, Google) support tool calling through a unified interface.

## Quick Start

```typescript
import { openAIAdapter } from '@clarity-ai/react/adapters'

// 1. Define your tools
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object' as const,
        properties: {
          location: {
            type: 'string',
            description: 'City name (e.g., "San Francisco, CA")',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit',
          },
        },
        required: ['location'],
      },
    },
  },
]

// 2. Send request with tools
const response = await openAIAdapter.chat(
  [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  {
    model: 'gpt-4o',
    apiKey: 'your-api-key',
    tools,
  }
)

// 3. Handle tool calls
if (response.toolCalls && response.toolCalls.length > 0) {
  for (const toolCall of response.toolCalls) {
    console.log('Tool:', toolCall.function.name)
    console.log('Arguments:', JSON.parse(toolCall.function.arguments))

    // Execute the function
    const result = await executeFunction(
      toolCall.function.name,
      JSON.parse(toolCall.function.arguments)
    )

    // Send result back to model
    // (See full example below)
  }
}
```

## Tool Definition Format

All adapters use the same unified tool definition format:

```typescript
interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters?: FunctionParameters
  }
}

interface FunctionParameters {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array'
  properties?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    description?: string
    enum?: unknown[]
    items?: unknown
    [key: string]: unknown
  }>
  required?: string[]
  additionalProperties?: boolean
  description?: string
  [key: string]: unknown
}
```

### Example Tool Definition

```typescript
const searchTool: ToolDefinition = {
  type: 'function',
  function: {
    name: 'search_products',
    description: 'Search for products in the catalog',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        category: {
          type: 'string',
          enum: ['electronics', 'clothing', 'books', 'home'],
          description: 'Product category to filter by',
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price in USD',
        },
        sortBy: {
          type: 'string',
          enum: ['relevance', 'price_asc', 'price_desc', 'rating'],
          description: 'Sort order for results',
        },
      },
      required: ['query'],
    },
  },
}
```

## Usage Examples

### OpenAI Example

Complete workflow with OpenAI:

```typescript
import { openAIAdapter } from '@clarity-ai/react/adapters'

// Define available tools
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_current_temperature',
      description: 'Get the current temperature for a specific location',
      parameters: {
        type: 'object' as const,
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g., San Francisco, CA',
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
          },
        },
        required: ['location'],
      },
    },
  },
]

// Function implementations
const functions = {
  get_current_temperature: async ({ location, unit = 'fahrenheit' }) => {
    // In production, call actual weather API
    return {
      location,
      temperature: 72,
      unit,
    }
  },
}

// Chat loop with tool calling
async function chatWithTools() {
  const messages = [
    { role: 'user' as const, content: 'What is the weather in Boston?' },
  ]

  // First request
  const response = await openAIAdapter.chat(messages, {
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY!,
    tools,
  })

  console.log('Assistant:', response.content)

  // Check for tool calls
  if (response.toolCalls && response.toolCalls.length > 0) {
    // Add assistant response to messages
    messages.push(response)

    // Execute each tool call
    for (const toolCall of response.toolCalls) {
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      console.log(`Calling function: ${functionName}`, functionArgs)

      // Execute the function
      const result = await functions[functionName](functionArgs)

      // Add function result to messages
      messages.push({
        role: 'assistant' as const,
        content: [
          {
            type: 'tool_result' as const,
            toolCallId: toolCall.id,
            toolResult: result,
          },
        ],
      })
    }

    // Send function results back to model
    const finalResponse = await openAIAdapter.chat(messages, {
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY!,
      tools,
    })

    console.log('Final response:', finalResponse.content)
  }
}
```

### Anthropic Example

Complete workflow with Anthropic:

```typescript
import { anthropicAdapter } from '@clarity-ai/react/adapters'

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'calculate',
      description: 'Perform a mathematical calculation',
      parameters: {
        type: 'object' as const,
        properties: {
          expression: {
            type: 'string',
            description: 'Math expression to evaluate (e.g., "2 + 2")',
          },
        },
        required: ['expression'],
      },
    },
  },
]

const functions = {
  calculate: async ({ expression }: { expression: string }) => {
    // Simple eval (in production, use a safer math parser)
    try {
      const result = eval(expression)
      return { result, expression }
    } catch (error) {
      return { error: 'Invalid expression' }
    }
  },
}

async function chatWithClaude() {
  const messages = [
    { role: 'user' as const, content: 'What is 15 * 234?' },
  ]

  const response = await anthropicAdapter.chat(messages, {
    model: 'claude-3-5-sonnet-latest',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    tools,
  })

  if (response.toolCalls && response.toolCalls.length > 0) {
    messages.push(response)

    for (const toolCall of response.toolCalls) {
      const result = await functions[toolCall.function.name](
        JSON.parse(toolCall.function.arguments)
      )

      messages.push({
        role: 'assistant' as const,
        content: [
          {
            type: 'tool_result' as const,
            toolCallId: toolCall.id,
            toolResult: result,
          },
        ],
      })
    }

    const finalResponse = await anthropicAdapter.chat(messages, {
      model: 'claude-3-5-sonnet-latest',
      apiKey: process.env.ANTHROPIC_API_KEY!,
      tools,
    })

    console.log('Final answer:', finalResponse.content)
  }
}
```

### Google Example

Complete workflow with Google Gemini:

```typescript
import { googleAdapter } from '@clarity-ai/react/adapters'

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_database',
      description: 'Search the product database',
      parameters: {
        type: 'object' as const,
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results',
          },
        },
        required: ['query'],
      },
    },
  },
]

const functions = {
  search_database: async ({ query, limit = 10 }) => {
    // In production, query actual database
    return {
      results: [
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 49.99 },
      ].slice(0, limit),
      total: 2,
    }
  },
}

async function chatWithGemini() {
  const messages = [
    { role: 'user' as const, content: 'Find wireless headphones under $50' },
  ]

  const response = await googleAdapter.chat(messages, {
    model: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_API_KEY!,
    tools,
  })

  if (response.toolCalls && response.toolCalls.length > 0) {
    messages.push(response)

    for (const toolCall of response.toolCalls) {
      const result = await functions[toolCall.function.name](
        JSON.parse(toolCall.function.arguments)
      )

      messages.push({
        role: 'assistant' as const,
        content: [
          {
            type: 'tool_result' as const,
            toolCallId: toolCall.id,
            toolResult: result,
          },
        ],
      })
    }

    const finalResponse = await googleAdapter.chat(messages, {
      model: 'gemini-2.0-flash-exp',
      apiKey: process.env.GOOGLE_API_KEY!,
      tools,
    })

    console.log('Results:', finalResponse.content)
  }
}
```

## Advanced Patterns

### Multi-Tool Chat Agent

```typescript
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_user_info',
      description: 'Get information about a user',
      parameters: {
        type: 'object' as const,
        properties: {
          userId: { type: 'string', description: 'User ID' },
        },
        required: ['userId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'update_user_preferences',
      description: 'Update user preferences',
      parameters: {
        type: 'object' as const,
        properties: {
          userId: { type: 'string' },
          preferences: {
            type: 'object',
            description: 'Preference updates',
          },
        },
        required: ['userId', 'preferences'],
      },
    },
  },
]

async function multiStepAgent(userMessage: string) {
  const messages = [{ role: 'user' as const, content: userMessage }]

  let iterations = 0
  const maxIterations = 5

  while (iterations < maxIterations) {
    const response = await openAIAdapter.chat(messages, {
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY!,
      tools,
    })

    messages.push(response)

    // If no tool calls, we're done
    if (!response.toolCalls || response.toolCalls.length === 0) {
      return response.content
    }

    // Execute all tool calls
    for (const toolCall of response.toolCalls) {
      const result = await executeFunction(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      )

      messages.push({
        role: 'assistant' as const,
        content: [
          {
            type: 'tool_result' as const,
            toolCallId: toolCall.id,
            toolResult: result,
          },
        ],
      })
    }

    iterations++
  }

  throw new Error('Max iterations reached')
}
```

### Streaming with Tool Calls

```typescript
async function streamWithTools() {
  const stream = openAIAdapter.stream(
    [{ role: 'user', content: 'Search for "laptop" and show results' }],
    {
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY!,
      tools,
      streamOptions: {
        onToken: (token) => process.stdout.write(token),
        onToolCall: (toolCall) => {
          console.log('\nTool call:', toolCall.function.name)
        },
      },
    }
  )

  let toolCalls: ToolCall[] = []

  for await (const chunk of stream) {
    if (chunk.type === 'tool_call' && chunk.toolCall) {
      toolCalls.push(chunk.toolCall)
    }

    if (chunk.type === 'done') {
      console.log('\nUsage:', chunk.usage)
    }
  }

  // Execute tool calls after streaming completes
  if (toolCalls.length > 0) {
    for (const toolCall of toolCalls) {
      const result = await executeFunction(
        toolCall.function.name,
        JSON.parse(toolCall.function.arguments)
      )
      console.log('Tool result:', result)
    }
  }
}
```

### Error Handling

```typescript
async function robustToolCalling() {
  try {
    const response = await openAIAdapter.chat(messages, {
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY!,
      tools,
    })

    if (response.toolCalls) {
      for (const toolCall of response.toolCalls) {
        try {
          // Validate arguments
          const args = JSON.parse(toolCall.function.arguments)

          // Execute with timeout
          const result = await Promise.race([
            executeFunction(toolCall.function.name, args),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), 5000)
            ),
          ])

          // Add successful result
          messages.push({
            role: 'assistant' as const,
            content: [
              {
                type: 'tool_result' as const,
                toolCallId: toolCall.id,
                toolResult: result,
              },
            ],
          })
        } catch (error) {
          // Add error result
          messages.push({
            role: 'assistant' as const,
            content: [
              {
                type: 'tool_result' as const,
                toolCallId: toolCall.id,
                toolResult: {
                  error: error.message,
                  success: false,
                },
              },
            ],
          })
        }
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}
```

## Best Practices

### 1. Clear Function Descriptions

```typescript
// ❌ Bad: Vague description
{
  name: 'search',
  description: 'Search stuff',
}

// ✅ Good: Specific and actionable
{
  name: 'search_products',
  description: 'Search the product catalog by keyword, category, and price range. Returns matching products sorted by relevance.',
}
```

### 2. Detailed Parameter Descriptions

```typescript
// ❌ Bad: Missing context
{
  properties: {
    date: { type: 'string' },
  }
}

// ✅ Good: Format specified
{
  properties: {
    date: {
      type: 'string',
      description: 'Date in ISO 8601 format (YYYY-MM-DD), e.g., "2025-01-22"',
    },
  }
}
```

### 3. Use Enums for Constrained Values

```typescript
{
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'approved', 'rejected'],
      description: 'Order status',
    },
  }
}
```

### 4. Validate Arguments

```typescript
async function executeFunction(name: string, args: unknown) {
  // Validate args match expected schema
  if (name === 'get_weather') {
    const schema = {
      location: 'string',
      unit: 'string?',
    }

    if (typeof args.location !== 'string') {
      throw new Error('Invalid location parameter')
    }
  }

  // Execute function
  return functions[name](args)
}
```

### 5. Handle Tool Call Loops

```typescript
// Prevent infinite loops
const MAX_ITERATIONS = 10
let iterations = 0

while (iterations < MAX_ITERATIONS) {
  const response = await adapter.chat(messages, { tools })

  if (!response.toolCalls || response.toolCalls.length === 0) {
    break
  }

  // Execute tools...
  iterations++
}
```

### 6. Return Structured Results

```typescript
// ✅ Good: Consistent result format
async function executeFunction(name: string, args: unknown) {
  try {
    const result = await functions[name](args)
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
```

## Troubleshooting

### Tool Not Being Called

**Problem**: Model returns text instead of calling the tool.

**Solutions**:
1. Make function description more specific
2. Add examples to the description
3. Use a more capable model (e.g., GPT-4o instead of GPT-3.5)
4. Explicitly mention the tool in the prompt

```typescript
// Add examples to description
{
  name: 'calculate',
  description: 'Perform mathematical calculations. Examples: "2 + 2", "15 * 234", "sqrt(144)"',
}
```

### Invalid Arguments

**Problem**: Model provides arguments in wrong format.

**Solutions**:
1. Add format examples to parameter descriptions
2. Use enums to constrain values
3. Specify required vs optional parameters

```typescript
{
  properties: {
    date: {
      type: 'string',
      description: 'Date in YYYY-MM-DD format, e.g., "2025-01-22"',
    },
  },
  required: ['date'],
}
```

### Multiple Tool Calls

**Problem**: Model calls tools but doesn't finish task.

**Solutions**:
1. Implement iterative loop to handle multiple rounds
2. Set maximum iterations to prevent infinite loops
3. Return comprehensive results that don't require follow-up

### Streaming Tool Calls Incomplete

**Problem**: Tool calls are partial when streaming.

**Solutions**:
1. Accumulate tool call deltas during streaming
2. Only execute tools after streaming completes
3. Use the `onToolCall` callback for real-time notifications

```typescript
const toolCalls = []

for await (const chunk of stream) {
  if (chunk.type === 'tool_call') {
    toolCalls.push(chunk.toolCall)
  }
}

// Now execute complete tool calls
for (const toolCall of toolCalls) {
  await executeFunction(toolCall.function.name, ...)
}
```

## Model Compatibility

### OpenAI
- ✅ GPT-4o, GPT-4o Mini: Full support
- ✅ GPT-4 Turbo: Full support
- ✅ GPT-3.5 Turbo: Full support
- ❌ o1, o1-mini: Tool calling not supported

### Anthropic
- ✅ Claude 3.5 Sonnet: Full support
- ✅ Claude 3.5 Haiku: Full support
- ✅ Claude 3 Opus: Full support
- ✅ Claude 3 Sonnet: Full support
- ✅ Claude 3 Haiku: Full support

### Google
- ✅ Gemini 2.0 Flash: Full support
- ✅ Gemini 1.5 Pro: Full support
- ✅ Gemini 1.5 Flash: Full support
- ✅ Gemini 1.5 Flash 8B: Full support

## Related Documentation

- [Adapter Types Reference](./types.ts)
- [Reliability Features](./RELIABILITY_FEATURES.md)
- [Observability](./OBSERVABILITY.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
