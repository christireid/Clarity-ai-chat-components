# Phase 3 Quick Start Guide

Get started with Clarity's structured output and tool UI registry features in 5 minutes.

## 1. Structured Object Generation

### Basic Example

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
}

function ProductGenerator() {
  const { object, run, isLoading } = useClarityObject<Product>({
    api: '/api/generate-product',
  })

  return (
    <div>
      <button onClick={() => run()}>Generate Product</button>
      {isLoading && <p>Generating...</p>}
      {object && (
        <div>
          <h3>{object.name}</h3>
          <p>${object.price}</p>
          <p>{object.description}</p>
        </div>
      )}
    </div>
  )
}
```

### With Input

```tsx
const { object, input, setInput, run } = useClarityObject<Product, { query: string }>({
  api: '/api/generate-product',
  initialInput: { query: 'laptop' },
})

// Update input
setInput({ query: 'gaming laptop' })

// Run with new input
await run({ query: 'gaming laptop' })
```

## 2. Tool UI Registry

### Step 1: Create Tool Components

```tsx
import { type ToolComponentProps } from '@clarity-chat/react'
import { Card, CardContent, CardHeader, CardTitle } from '@clarity-chat/primitives'

function WeatherToolResult({ data }: ToolComponentProps<{
  location: string
  temperature: number
  condition: string
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather in {data.location}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl">{data.temperature}°F</div>
        <div>{data.condition}</div>
      </CardContent>
    </Card>
  )
}
```

### Step 2: Create Registry

```tsx
import { createToolUIRegistry } from '@clarity-chat/react'

const toolRegistry = createToolUIRegistry({
  weather: WeatherToolResult,
  search: SearchToolResult,
})
```

### Step 3: Use in Chat

```tsx
import { useClarityChatWithTools, ClarityToolResult } from '@clarity-chat/react'

function ChatWithTools() {
  const { messages, toolResults, append } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry,
  })

  return (
    <div>
      {/* Render chat messages */}
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      {/* Render tool results */}
      {toolResults.map(({ toolCall, result }, idx) => (
        <ClarityToolResult
          key={idx}
          registry={toolRegistry}
          toolCall={toolCall}
          result={result}
          messages={messages}
        />
      ))}
    </div>
  )
}
```

## 3. Complete Example

```tsx
import {
  useClarityChatWithTools,
  useClarityObject,
  createToolUIRegistry,
  ClarityToolResult,
} from '@clarity-chat/react'

// Define types
interface Product {
  name: string
  price: number
}

// Create tool components
function PriceToolResult({ data }) {
  return <div>Price: ${data.price}</div>
}

// Create registry
const registry = createToolUIRegistry({
  get_price: PriceToolResult,
})

// Use in component
function ECommerceAssistant() {
  // Generate product recommendations
  const { object, run } = useClarityObject<Product>({
    api: '/api/products',
  })

  // Chat with tools
  const { messages, toolResults, append } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry: registry,
  })

  return (
    <div>
      {/* Product recommendations */}
      {object && <div>{object.name}</div>}

      {/* Chat */}
      {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}

      {/* Tool results */}
      {toolResults.map(({ toolCall, result }, idx) => (
        <ClarityToolResult
          key={idx}
          registry={registry}
          toolCall={toolCall}
          result={result}
          messages={messages}
        />
      ))}
    </div>
  )
}
```

## 4. API Setup

### Structured Object API

```tsx
// app/api/generate-product/route.ts
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { input } = await req.json()

  const result = await generateObject({
    model: openai('gpt-4'),
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
      },
    },
    prompt: `Generate a product for: ${input.query}`,
  })

  return Response.json(result.object)
}
```

### Chat with Tools API

```tsx
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4'),
    messages,
    tools: {
      get_price: {
        description: 'Get product price',
        parameters: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
        },
      },
    },
  })

  return result.toDataStreamResponse()
}
```

## 5. Common Patterns

### Pattern 1: Extract Tool Results by Message

```tsx
const { getToolResultsForMessage } = useClarityChatWithTools({
  api: '/api/chat',
  toolRegistry,
})

const results = getToolResultsForMessage(messageId)
```

### Pattern 2: Check if Tool Was Called

```tsx
import { hasToolBeenCalled } from '@clarity-chat/react/utils/tool-result-helpers'

const hasWeather = hasToolBeenCalled(toolResults, 'weather')
```

### Pattern 3: Group by Tool Name

```tsx
import { groupToolResultsByToolName } from '@clarity-chat/react/utils/tool-result-helpers'

const grouped = groupToolResultsByToolName(toolResults)
const weatherResults = grouped.get('weather') || []
```

### Pattern 4: Handle Errors

```tsx
import { hasToolError, getToolError } from '@clarity-chat/react/utils/tool-result-helpers'

toolResults.forEach((result) => {
  if (hasToolError(result)) {
    const error = getToolError(result)
    console.error(`Tool ${result.toolCall.function.name} failed:`, error)
  }
})
```

## 6. Next Steps

1. **Read Full Documentation** - See `PHASE_3_FEATURES.md` for complete API reference
2. **Explore Examples** - Check `examples/` directory for more examples
3. **Use Pre-built Components** - Import from `examples/tool-ui-components.tsx`
4. **Customize** - Create your own tool components following the patterns

## 7. TypeScript Tips

### Use Type Guards

```tsx
import { isWeatherToolResult } from '@clarity-chat/react/types/tool-result-types'

if (isWeatherToolResult(result)) {
  // TypeScript knows result is WeatherToolResult
  console.log(result.temperature)
}
```

### Type Your Tool Components

```tsx
import type { WeatherToolResult } from '@clarity-chat/react/types/tool-result-types'

function WeatherComponent({ data }: ToolComponentProps<WeatherToolResult>) {
  // Fully typed!
}
```

## Troubleshooting

### Tool results not showing?

- Check that `toolRegistry` includes your tool name
- Verify tool results are in the correct format
- Ensure `autoExtractTools` is `true` (default)

### Structured object is null?

- Check API response format (should be `{ object: {...} }` or direct object)
- Verify TypeScript type matches API response
- Check for errors in `error` state

### Type errors?

- Ensure tool component props match tool result shape
- Use type guards for runtime validation
- Check `tool-result-types.ts` for common types

## Resources

- **Full API Docs**: `PHASE_3_FEATURES.md`
- **Examples**: `examples/` directory
- **Type Definitions**: `types/tool-result-types.ts`
- **Utilities**: `utils/tool-result-helpers.ts`
