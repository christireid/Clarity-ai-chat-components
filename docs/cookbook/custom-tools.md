# Custom Tool UI

> **Create beautiful custom UI for tool results**

This recipe shows how to create custom, visually appealing UI components for displaying tool invocation results.

## Prerequisites

- Tool UI registry set up
- Tools defined and working
- Basic React component knowledge

## Complete Example

```tsx
import { 
  createToolUIRegistry,
  ClarityToolResult,
  Card,
  Badge 
} from '@clarity-chat/react'

// Weather Tool Component
function WeatherToolResult({ data }: { data: any }) {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Weather in {data.location}</h3>
        <Badge variant="info">Live</Badge>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{data.temperature}</div>
        <div>
          <p className="text-sm text-gray-600">{data.condition}</p>
          <p className="text-xs text-gray-500">Humidity: {data.humidity}%</p>
        </div>
      </div>
    </Card>
  )
}

// Calculator Tool Component
function CalculatorToolResult({ data }: { data: any }) {
  return (
    <Card className="p-4 bg-green-50 border-l-4 border-green-500">
      <div className="font-mono text-lg">
        <span className="text-gray-600">{data.expression}</span>
        <span className="mx-2">=</span>
        <span className="font-bold text-green-700">{data.result}</span>
      </div>
    </Card>
  )
}

// Search Tool Component
function SearchToolResult({ data }: { data: any }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Search Results</h3>
      <div className="space-y-2">
        {data.results?.slice(0, 3).map((result: any, idx: number) => (
          <div key={idx} className="p-2 bg-gray-50 rounded">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {result.title}
            </a>
            <p className="text-sm text-gray-600 mt-1">{result.snippet}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherToolResult,
  calculate: CalculatorToolResult,
  web_search: SearchToolResult,
})

// Use in chat
function ChatWithCustomTools() {
  return (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={toolCall}
      result={result}
    />
  )
}
```

## Step-by-Step Setup

### 1. Create Tool Component

```tsx
function MyToolResult({ data }: { data: any }) {
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3>{data.title}</h3>
      <p>{data.content}</p>
    </div>
  )
}
```

### 2. Register Component

```tsx
import { createToolUIRegistry } from '@clarity-chat/react'

const toolRegistry = createToolUIRegistry({
  tool_name: MyToolResult,
})
```

### 3. Use in Chat

```tsx
import { ClarityToolResult } from '@clarity-chat/react'

// In message rendering
{message.metadata?.toolInvocations?.map((toolCall, idx) => (
  <ClarityToolResult
    key={idx}
    registry={toolRegistry}
    toolCall={toolCall}
    result={toolCall.result}
  />
))}
```

## Advanced Patterns

### Loading States

```tsx
function ToolResultWithLoading({ data, isLoading }: { data: any; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  return <Card className="p-4">{/* Tool result */}</Card>
}
```

### Error Handling

```tsx
function ToolResultWithError({ data, error }: { data: any; error?: Error }) {
  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-l-4 border-red-500">
        <p className="text-red-700">Error: {error.message}</p>
      </Card>
    )
  }

  return <Card className="p-4">{/* Tool result */}</Card>
}
```

### Interactive Components

```tsx
function InteractiveToolResult({ data }: { data: any }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <h3>{data.title}</h3>
      </button>
      {expanded && (
        <div className="mt-2">
          {data.details}
        </div>
      )}
    </Card>
  )
}
```

## Key Points

- **Visual Design**: Make tool results visually distinct
- **Loading States**: Show loading indicators
- **Error Handling**: Display errors gracefully
- **Interactivity**: Add expand/collapse, actions, etc.

## Best Practices

1. **Consistent Styling**: Use your design system
2. **Accessibility**: Ensure keyboard navigation and screen reader support
3. **Performance**: Lazy load heavy components
4. **Responsive**: Make components mobile-friendly

## Related

- [Tool UI Registry](../../packages/react/README.md#tool-ui-registry) - Tool result rendering patterns
- [Agent Orchestration](./agents.md) - Agent-powered chat patterns
- [Component Library](../../packages/react/README.md#components) - Available components
