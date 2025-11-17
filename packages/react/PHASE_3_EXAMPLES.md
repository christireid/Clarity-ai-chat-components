# Phase 3 Examples Guide

Complete guide to using Phase 3 features: structured output and tool UI registry.

## Examples Overview

### 1. Product Recommendation Object (`product-recommendation-object.tsx`)

Demonstrates `useClarityObject` for generating structured product recommendations.

**Key Features:**
- Type-safe Product interface
- Input management (query, maxResults, category)
- Product card rendering
- Error handling

**Usage:**
```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
  category: string
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  initialInput: { query: 'laptops', maxResults: 5 },
})
```

### 2. Generative UI Tools (`generative-ui-tools.tsx`)

Basic example showing tool definitions, registry setup, and result rendering.

**Key Features:**
- Weather tool with custom UI
- FAQ search tool with custom UI
- Tool registry setup
- useClarityChat integration
- ClarityToolResult rendering

**Usage:**
```tsx
import { createToolUIRegistry } from '@clarity-chat/react'
import { ClarityToolResult } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQSearchResults,
})

<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

### 3. Integrated Generative UI (`generative-ui-integrated.tsx`)

Complete example showing useClarityChat + useAssistant + tool registry working together.

**Key Features:**
- Toggle between chat and assistant modes
- Real tool invocations from useAssistant
- Automatic tool result rendering
- Tool invocation status tracking
- Full integration example

**Usage:**
```tsx
// Use assistant mode for tool calling
const assistantHook = useAssistant({
  api: '/api/assistant',
  assistantId: 'generative-ui-assistant',
  tools: [weatherTool, faqSearchTool],
})

// Tool invocations are automatically available
const { toolInvocations } = assistantHook

// Render tool results
{toolInvocations.map((invocation) => (
  <ClarityToolResult
    registry={toolRegistry}
    toolCall={convertToToolCall(invocation)}
    result={invocation.result}
    messages={messages}
  />
))}
```

## Tool UI Component Patterns

### Basic Tool Component

```tsx
interface MyToolData {
  // Define your tool result structure
  field1: string
  field2: number
}

function MyToolResult({ data }: { data: MyToolData }) {
  return (
    <Card>
      <CardHeader>
        <h3>{data.field1}</h3>
      </CardHeader>
      <CardContent>
        <p>Value: {data.field2}</p>
      </CardContent>
    </Card>
  )
}
```

### Tool Component with Message Context

```tsx
function ContextAwareToolResult({ data, messages }: ToolComponentProps<MyToolData>) {
  // Access conversation context
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()
  
  return (
    <Card>
      <CardContent>
        <p>Responding to: {lastUserMessage?.content}</p>
        <p>Result: {data.field1}</p>
      </CardContent>
    </Card>
  )
}
```

### Tool Component with Tool Call Info

```tsx
function ToolCallAwareResult({ data, toolCall }: ToolComponentProps<MyToolData>) {
  return (
    <Card>
      <CardHeader>
        <h3>Tool: {toolCall?.name}</h3>
        <p>Args: {JSON.stringify(toolCall?.args)}</p>
      </CardHeader>
      <CardContent>
        <p>Result: {data.field1}</p>
      </CardContent>
    </Card>
  )
}
```

## Registry Setup Patterns

### Basic Registry

```tsx
const registry = createToolUIRegistry({
  tool1: Tool1Component,
  tool2: Tool2Component,
})
```

### Type-Safe Registry

```tsx
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQSearchResults,
} as const)
```

### Dynamic Registry

```tsx
const toolComponents = {
  weather: WeatherResult,
  faq: FAQSearchResults,
}

const registry = createToolUIRegistry(toolComponents)
```

## Integration Patterns

### With useClarityChat

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
})

// Extract tool calls from messages and render
{messages.map(msg => {
  if (hasToolCall(msg)) {
    return (
      <ClarityToolResult
        registry={registry}
        toolCall={extractToolCall(msg)}
        result={extractToolResult(msg)}
        messages={messages}
      />
    )
  }
  return <MessageComponent message={msg} />
})}
```

### With useAssistant

```tsx
const { toolInvocations, messages } = useAssistant({
  api: '/api/assistant',
  tools: [weatherTool, faqTool],
})

// Tool invocations are automatically tracked
{toolInvocations.map(invocation => (
  <ClarityToolResult
    registry={registry}
    toolCall={{
      name: invocation.toolName,
      args: invocation.args,
      id: invocation.toolCallId,
    }}
    result={invocation.result}
    messages={messages}
  />
))}
```

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for tool data
2. **Error Handling**: Handle missing or invalid tool results gracefully
3. **Loading States**: Show loading indicators while tools execute
4. **Fallback Rendering**: Use fallback prop for unregistered tools
5. **Message Context**: Leverage message context for better UX
6. **Registry Organization**: Group related tools in separate registries

## Common Patterns

### Conditional Rendering

```tsx
{invocation.state === 'result' && invocation.result && (
  <ClarityToolResult
    registry={registry}
    toolCall={toolCall}
    result={invocation.result}
    messages={messages}
  />
)}
```

### Error Display

```tsx
{invocation.state === 'error' && (
  <div className="error">
    Tool execution failed: {invocation.error}
  </div>
)}
```

### Loading State

```tsx
{invocation.state === 'call' && (
  <div className="loading">
    Executing {invocation.toolName}...
  </div>
)}
```

## Next Steps

1. Create custom tool UI components for your tools
2. Set up tool registry
3. Integrate with useClarityChat or useAssistant
4. Add error handling and loading states
5. Test with real API endpoints
