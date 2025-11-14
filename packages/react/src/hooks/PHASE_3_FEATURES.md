# Phase 3 Features: Structured Output & Tool UI Registry

## Overview

Phase 3 introduces two major features that extend Clarity's capabilities beyond Vercel AI SDK:

1. **Structured Object Generation** - Type-safe object generation with `useClarityObject<T>`
2. **Tool → UI Registry Pattern** - Custom rendering of tool results with `ClarityToolResult`

## 1. Structured Object Generation

### useClarityObject Hook

Generate structured, type-safe objects from AI models.

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product>({
  api: '/api/generate-product',
  initialInput: { query: 'laptop' },
})

await run()
console.log(object) // Fully typed Product object
```

### Features

- ✅ **Type-safe** - Generic type parameter ensures correct object shape
- ✅ **Streaming support** - Optional streaming for large objects
- ✅ **Error handling** - Built-in error states and callbacks
- ✅ **Abort support** - Cancel requests mid-stream
- ✅ **Flexible input** - Pass any input type to the API

### API Reference

```typescript
interface UseClarityObjectOptions<TInput> {
  api: string
  initialInput?: TInput
  headers?: HeadersInit
  body?: Record<string, any>
  stream?: boolean
  streamFormat?: StreamFormat
  fetch?: typeof fetch
  onResponse?: (response: Response) => void | Promise<void>
  onFinish?: (object: any, input: TInput) => void | Promise<void>
  onError?: (error: Error) => void
  credentials?: RequestCredentials
}

interface UseClarityObjectReturn<TObject, TInput> {
  input: TInput
  setInput: (value: TInput) => void
  object: TObject | null
  isLoading: boolean
  error: Error | null
  run: (overrideInput?: TInput) => Promise<void>
  reset: () => void
  abort: () => void
}
```

### Example: Product Recommendations

See `examples/product-recommendation-object.tsx` for a complete example.

## 2. Tool → UI Registry Pattern

### Overview

The tool UI registry pattern allows you to register custom React components for rendering tool execution results. This enables rich, domain-specific UIs for different tools.

### Basic Usage

```tsx
import { 
  createToolUIRegistry, 
  ClarityToolResult 
} from '@clarity-chat/react'

// Define custom tool result components
function WeatherToolResult({ data }) {
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

// Create registry
const registry = createToolUIRegistry({
  weather: WeatherToolResult,
  search: SearchToolResult,
})

// Use in chat
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

### useClarityChatWithTools Hook

Automatically extract and render tool results from chat messages.

```tsx
import { useClarityChatWithTools } from '@clarity-chat/react'

const { messages, toolResults, append } = useClarityChatWithTools({
  api: '/api/chat',
  toolRegistry: registry,
})

// toolResults automatically extracted from messages
toolResults.forEach(({ toolCall, result }) => {
  // Render with ClarityToolResult
})
```

### Features

- ✅ **Type-safe registry** - TypeScript ensures correct component props
- ✅ **Automatic extraction** - Tool results extracted from messages automatically
- ✅ **Fallback rendering** - Default card for unregistered tools
- ✅ **Message context** - Components receive full message history
- ✅ **Flexible** - Works with any tool result shape

### API Reference

```typescript
// Create registry
function createToolUIRegistry<T extends ToolComponentRegistry>(
  registry: T
): T

// Tool component props
interface ToolComponentProps<TData> {
  data: TData
  messages: Message[]
  toolCall?: {
    name: string
    arguments: Record<string, any>
  }
}

// ClarityToolResult props
interface ClarityToolResultProps {
  registry: ToolComponentRegistry
  toolCall: ToolCall
  result: any
  messages: Message[]
  showDefaultCard?: boolean
  className?: string
}
```

### Example: Generative UI Chat

See `examples/generative-ui-tools.tsx` for a complete example with weather and FAQ search tools.

## Comparison to Vercel AI SDK

### Structured Output

| Feature | Clarity | Vercel AI SDK |
|---------|---------|---------------|
| Type-safe object generation | ✅ `useClarityObject<T>` | ❌ Manual parsing required |
| Streaming support | ✅ Built-in | ⚠️ Requires custom handling |
| TypeScript generics | ✅ Full support | ❌ No built-in support |
| Error handling | ✅ Comprehensive | ⚠️ Basic |

### Tool UI Registry

| Feature | Clarity | Vercel AI SDK |
|---------|---------|---------------|
| Custom tool rendering | ✅ Registry pattern | ❌ Manual rendering |
| Type-safe components | ✅ TypeScript enforced | ❌ Manual types |
| Automatic extraction | ✅ `useClarityChatWithTools` | ❌ Manual parsing |
| Fallback rendering | ✅ Default card | ❌ No fallback |

## Best Practices

### 1. Structured Objects

- **Use TypeScript interfaces** - Define clear object shapes
- **Handle errors gracefully** - Use `error` state and `onError` callback
- **Validate responses** - Check object structure before using
- **Use streaming for large objects** - Enable `stream: true` for better UX

### 2. Tool UI Registry

- **Keep components focused** - One component per tool type
- **Use message context** - Access full conversation history
- **Provide fallbacks** - Handle missing or malformed data
- **Make components reusable** - Share across different chats

### 3. Integration

- **Combine with useClarityChat** - Use `useClarityChatWithTools` for automatic extraction
- **Register tools early** - Create registry before rendering
- **Handle loading states** - Show loading indicators for tool execution
- **Error boundaries** - Wrap tool result components in error boundaries

## Examples

1. **Product Recommendation** - `examples/product-recommendation-object.tsx`
   - Uses `useClarityObject` to generate product recommendations
   - Displays results in a card grid
   - Handles loading and error states

2. **Generative UI Tools** - `examples/generative-ui-tools.tsx`
   - Uses `useClarityChatWithTools` for automatic tool extraction
   - Registers custom components for weather and FAQ search
   - Renders tool results in chat interface

## Migration Guide

### From Manual Object Parsing

**Before:**
```tsx
const { completion } = useCompletion({ api: '/api/generate' })
const object = JSON.parse(completion) // No type safety!
```

**After:**
```tsx
const { object } = useClarityObject<Product>({
  api: '/api/generate',
})
// Fully typed!
```

### From Manual Tool Rendering

**Before:**
```tsx
{messages.map(msg => {
  if (msg.toolCalls) {
    return <div>{JSON.stringify(msg.toolCalls)}</div>
  }
})}
```

**After:**
```tsx
const { toolResults } = useClarityChatWithTools({
  api: '/api/chat',
  toolRegistry,
})

{toolResults.map(({ toolCall, result }) => (
  <ClarityToolResult
    registry={toolRegistry}
    toolCall={toolCall}
    result={result}
    messages={messages}
  />
))}
```

## Next Steps

- Add more tool UI components to the examples
- Create shared tool component library
- Add tool result caching
- Implement tool result streaming
- Add tool result validation
