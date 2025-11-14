# Phase 3: Structured Output & Tool UI Registry

## Overview

Phase 3 adds two powerful features to Clarity's React library:
1. **Structured Output Hook** - Type-safe object generation from AI models
2. **Tool UI Registry** - Automatic rendering of tool results with custom components

## Quick Start

### Structured Output

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  initialInput: { query: 'laptops' },
})

await run({ query: 'gaming laptops' })
// object is now Product[] | null
```

### Tool UI Registry

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Define tool UI components
const WeatherResult = ({ data }) => (
  <Card>
    <CardHeader>Weather in {data.location}</CardHeader>
    <CardContent>{data.temperature}°C</CardContent>
  </Card>
)

// Create registry
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Render tool results
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

## Features

### useClarityObject<T>

- ✅ Generic type support for type-safe object generation
- ✅ Streaming and non-streaming modes
- ✅ Automatic JSON parsing from streams
- ✅ Error handling and loading states
- ✅ Input management and reset functionality
- ✅ Callback support (onFinish, onError, onProgress)

### Tool UI Registry

- ✅ Type-safe component mapping
- ✅ Automatic tool result rendering
- ✅ Fallback rendering for unregistered tools
- ✅ Message context integration
- ✅ Customizable props and styling

## Examples

See the following example files:
- `examples/product-recommendation-object.tsx` - Structured output example
- `examples/generative-ui-tools.tsx` - Basic tool registry example
- `examples/generative-ui-integrated.tsx` - Full integration example

## Documentation

- [Phase 3 Complete](./PHASE_3_COMPLETE.md) - Implementation details
- [Phase 3 Examples](./PHASE_3_EXAMPLES.md) - Usage patterns and best practices
- [Phase 3 Summary](./PHASE_3_SUMMARY.md) - Comparison to Vercel AI SDK
- [Phase 3 Final](./PHASE_3_FINAL.md) - Final summary

## API Reference

### useClarityObject

```typescript
function useClarityObject<TObject = any, TInput = any>(
  options: UseClarityObjectOptions<TInput>
): UseClarityObjectReturn<TObject, TInput>
```

### createToolUIRegistry

```typescript
function createToolUIRegistry<T extends ToolComponentRegistry>(
  registry: T
): T
```

### ClarityToolResult

```typescript
interface ClarityToolResultProps {
  registry: ToolComponentRegistry
  toolCall: ToolCall
  result: any
  messages: CoreMessage[]
  fallback?: React.ComponentType<{ toolCall: ToolCall; result: any }>
  showHeader?: boolean
  className?: string
}
```

## Testing

Comprehensive test coverage:
- `use-clarity-object.test.tsx` - 11 test cases
- `clarity-tool-result.test.tsx` - 6 test cases

Run tests:
```bash
pnpm test --filter @clarity-chat/react
```

## Status

✅ **Phase 3 Complete** - Production ready with tests and documentation
