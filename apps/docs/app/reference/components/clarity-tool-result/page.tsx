'use client'

import { useState, useCallback } from 'react'
import {
  ToastProvider,
  ClarityToolResult,
  createToolUIRegistry,
} from '@clarity-chat/react/internal'
import type { CoreMessage } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Weather result component example
function WeatherResult({ data, toolCall }: { data: any; toolCall?: any }) {
  return (
    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🌤️</span>
        <h3 className="font-semibold">
          Weather in {toolCall?.args?.location || 'Unknown'}
        </h3>
      </div>
      <div className="space-y-1">
        <p>
          <strong>Temperature:</strong> {data.temperature}°C
        </p>
        <p>
          <strong>Condition:</strong> {data.condition}
        </p>
        <p>
          <strong>Humidity:</strong> {data.humidity}%
        </p>
      </div>
    </div>
  )
}

// Search results component example
function SearchResults({ data }: { data: any }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">Search Results</h3>
      <ul className="space-y-2">
        {data.results?.map((result: any, i: number) => (
          <li key={i} className="border-b pb-2">
            <a href={result.url} className="text-primary hover:underline">
              {result.title}
            </a>
            <p className="text-sm text-muted-foreground">{result.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Basic demo component
function BasicToolResultDemo() {
  const registry = createToolUIRegistry({
    weather: WeatherResult,
    search: SearchResults,
  })

  const toolCall = {
    name: 'weather',
    args: { location: 'San Francisco' },
    id: 'call-1',
  }

  const result = {
    temperature: 18,
    condition: 'Sunny',
    humidity: 65,
  }

  const messages: CoreMessage[] = []

  return (
    <div className="w-full max-w-2xl">
      <ClarityToolResult
        registry={registry}
        toolCall={toolCall}
        result={result}
        messages={messages}
      />
    </div>
  )
}

// Fallback demo
function ToolResultWithFallbackDemo() {
  const registry = createToolUIRegistry({
    weather: WeatherResult,
  })

  const toolCall = {
    name: 'unknown_tool', // Not in registry
    args: {},
    id: 'call-1',
  }

  const result = { data: 'Some result data' }
  const messages: CoreMessage[] = []

  return (
    <div className="w-full max-w-2xl">
      <ClarityToolResult
        registry={registry}
        toolCall={toolCall}
        result={result}
        messages={messages}
        // Uses default fallback (JSON display)
      />
    </div>
  )
}

const clarityToolResultProps: Prop[] = [
  {
    name: 'registry',
    type: 'ToolComponentRegistry',
    required: true,
    description:
      'Registry mapping tool names to React components. Created with createToolUIRegistry().',
  },
  {
    name: 'toolCall',
    type: 'ToolCall',
    required: true,
    description:
      'Tool call information containing name, args, and optional id.',
  },
  {
    name: 'result',
    type: 'unknown',
    required: true,
    description:
      'Tool execution result. Passed as `data` prop to the registered component.',
  },
  {
    name: 'messages',
    type: 'CoreMessage[]',
    required: true,
    description:
      'All messages in the conversation. Passed to tool components for context.',
  },
  {
    name: 'fallback',
    type: 'React.ComponentType<{ toolCall: ToolCall; result: unknown }>',
    description:
      'Custom fallback component for unregistered tools. Defaults to JSON display.',
  },
  {
    name: 'componentProps',
    type: 'Record<string, unknown>',
    description: 'Additional props to pass to the registered tool component.',
  },
  {
    name: 'showHeader',
    type: 'boolean',
    default: 'false',
    description: 'Show tool name header above the component.',
  },
  {
    name: 'enableErrorBoundary',
    type: 'boolean',
    default: 'true',
    description:
      'Wrap tool component in error boundary to catch rendering errors.',
  },
  {
    name: 'errorFallback',
    type: 'React.ComponentType<{ error: Error; toolCall: ToolCall }>',
    description:
      'Custom error fallback component. Used when tool component throws an error.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function ClarityToolResultPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>ClarityToolResult</h1>

        <p className="lead">
          Renders tool execution results using registered UI components.
          Provides a registry pattern for mapping tool names to custom React
          components, with automatic fallback for unregistered tools.
        </p>

        <Callout type="info">
          <p>
            ClarityToolResult uses a registry pattern to map tool names to React
            components. This allows you to create custom, user-friendly UI for
            each tool's results instead of showing raw JSON.
          </p>
        </Callout>

        <ViewInStorybook component="ClarityToolResult" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try different tool results! See how registered tools get custom UI
            while unregistered ones fall back to JSON.
          </p>
          <CodePlayground
            code={`function Example() {
  const registry = createToolUIRegistry({
    weather: ({ data }) => (
      <div className="p-4 border rounded-lg">
        <h3>Weather: {data.temperature}°C</h3>
      </div>
    ),
  })

  const toolCall = { name: 'weather', args: { location: 'SF' } }
  const result = { temperature: 18, condition: 'Sunny' }

  return (
    <ClarityToolResult
      registry={registry}
      toolCall={toolCall}
      result={result}
      messages={[]}
    />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'
import type { CoreMessage, ToolComponentProps } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Create a registry of tool components and use ClarityToolResult to
          render results:
        </p>

        <ComponentPreview
          title="Simple Tool Result"
          description="Custom UI for weather tool results"
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'
import type { ToolComponentProps } from '@clarity-chat/react/internal'

// Custom component for weather tool
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold">Weather in {toolCall?.args?.location}</h3>
      <p>Temperature: {data.temperature}°C</p>
      <p>Condition: {data.condition}</p>
    </div>
  )
}

// Create registry
const registry = createToolUIRegistry({
  weather: WeatherResult,
})

// Use in your component
function ToolResultExample() {
  const toolCall = {
    name: 'weather',
    args: { location: 'San Francisco' },
  }

  const result = {
    temperature: 18,
    condition: 'Sunny',
    humidity: 65,
  }

  return (
    <ClarityToolResult
      registry={registry}
      toolCall={toolCall}
      result={result}
      messages={[]}
    />
  )
}`}
        >
          <BasicToolResultDemo />
        </ComponentPreview>

        <h2 id="creating-registry">Creating a Tool Registry</h2>

        <p>
          Use <code>createToolUIRegistry</code> to create a type-safe registry:
        </p>

        <EnhancedCodeBlock
          code={`import { createToolUIRegistry } from '@clarity-chat/react/internal'
import type { ToolComponentProps } from '@clarity-chat/react/internal'

// Define your tool result components
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  // Render weather data
}

function SearchResults({ data }: ToolComponentProps) {
  // Render search results
}

function DatabaseQuery({ data, messages }: ToolComponentProps) {
  // Render database query results
  // Can access conversation context via messages
}

// Create registry
const toolRegistry = createToolUIRegistry({
  weather: WeatherResult,
  search: SearchResults,
  database_query: DatabaseQuery,
})

// Use in your app
export { toolRegistry }`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="tool-component-props">Tool Component Props</h2>

        <p>Tool components receive the following props:</p>

        <EnhancedCodeBlock
          code={`interface ToolComponentProps<TData = any> {
  /** Tool execution result data */
  data: TData
  
  /** All messages in the conversation */
  messages: CoreMessage[]
  
  /** Tool call metadata */
  toolCall?: {
    name: string
    args: Record<string, any>
  }
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="multiple-tools">Multiple Tools</h2>

        <p>Register multiple tools in a single registry:</p>

        <ComponentPreview
          title="Multiple Tool Results"
          description="Registry with multiple tool components"
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'

// Weather tool component
function WeatherResult({ data }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>Weather: {data.temperature}°C</h3>
    </div>
  )
}

// Search tool component
function SearchResults({ data }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>Search Results</h3>
      <ul>
        {data.results?.map((r, i) => (
          <li key={i}>{r.title}</li>
        ))}
      </ul>
    </div>
  )
}

// Create registry with multiple tools
const registry = createToolUIRegistry({
  weather: WeatherResult,
  search: SearchResults,
})

// Use for different tools
<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'weather', args: {} }}
  result={{ temperature: 18 }}
  messages={[]}
/>

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'search', args: {} }}
  result={{ results: [{ title: 'Result 1' }] }}
  messages={[]}
/>`}
        >
          <BasicToolResultDemo />
        </ComponentPreview>

        <h2 id="fallback">Fallback for Unregistered Tools</h2>

        <p>
          When a tool isn't registered, ClarityToolResult falls back to
          displaying JSON:
        </p>

        <ComponentPreview
          title="Unregistered Tool Fallback"
          description="Default JSON display for unregistered tools"
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'

const registry = createToolUIRegistry({
  weather: WeatherResult,
  // 'unknown_tool' is not registered
})

function UnregisteredTool() {
  const toolCall = {
    name: 'unknown_tool', // Not in registry
    args: {},
  }

  const result = { data: 'Some result' }

  return (
    <ClarityToolResult
      registry={registry}
      toolCall={toolCall}
      result={result}
      messages={[]}
      // Automatically uses default fallback (JSON display)
    />
  )
}`}
        >
          <ToolResultWithFallbackDemo />
        </ComponentPreview>

        <h2 id="custom-fallback">Custom Fallback Component</h2>

        <p>Provide a custom fallback component for unregistered tools:</p>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'

function CustomFallback({ toolCall, result }: { toolCall: ToolCall; result: unknown }) {
  return (
    <div className="p-4 border border-dashed rounded-lg">
      <p className="text-sm text-muted-foreground">
        Tool "{toolCall.name}" is not registered. Raw result:
      </p>
      <pre className="mt-2 text-xs overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}

const registry = createToolUIRegistry({
  weather: WeatherResult,
})

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'unknown', args: {} }}
  result={{ data: 'test' }}
  messages={[]}
  fallback={CustomFallback}
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="error-handling">Error Handling</h2>

        <p>
          ClarityToolResult includes error boundary support to catch rendering
          errors:
        </p>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'

function ErrorProneTool({ data }: ToolComponentProps) {
  // This might throw an error
  return <div>{data.nonExistentProperty.value}</div>
}

const registry = createToolUIRegistry({
  risky_tool: ErrorProneTool,
})

function CustomErrorFallback({ error, toolCall }: { error: Error; toolCall: ToolCall }) {
  return (
    <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
      <p className="text-destructive font-semibold">
        Error rendering {toolCall.name}
      </p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  )
}

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'risky_tool', args: {} }}
  result={{}}
  messages={[]}
  enableErrorBoundary={true} // Default
  errorFallback={CustomErrorFallback}
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="using-conversation-context">Using Conversation Context</h2>

        <p>
          Tool components receive the full conversation history for context:
        </p>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'
import type { ToolComponentProps, CoreMessage } from '@clarity-chat/react/internal'

function ContextAwareTool({ data, messages, toolCall }: ToolComponentProps) {
  // Access conversation context
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground mb-2">
        Responding to: "{lastUserMessage?.content}"
      </p>
      <div>{/* Render tool result */}</div>
    </div>
  )
}

const registry = createToolUIRegistry({
  context_aware_tool: ContextAwareTool,
})

<ClarityToolResult
  registry={registry}
  toolCall={{ name: 'context_aware_tool', args: {} }}
  result={{}}
  messages={conversationMessages} // Full conversation history
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={clarityToolResultProps} />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react/internal'
import type { ToolComponentProps, CoreMessage } from '@clarity-chat/react/internal'

// Weather tool component
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🌤️</span>
        <h3 className="font-semibold text-lg">
          Weather in {toolCall?.args?.location || 'Unknown'}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Temperature:</span>
          <span className="ml-2 font-semibold">{data.temperature}°C</span>
        </div>
        <div>
          <span className="text-muted-foreground">Condition:</span>
          <span className="ml-2 font-semibold">{data.condition}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Humidity:</span>
          <span className="ml-2 font-semibold">{data.humidity}%</span>
        </div>
        <div>
          <span className="text-muted-foreground">Wind:</span>
          <span className="ml-2 font-semibold">{data.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}

// Search tool component
function SearchResults({ data }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-3">Search Results</h3>
      <div className="space-y-3">
        {data.results?.map((result: any, i: number) => (
          <div key={i} className="border-b pb-3 last:border-0">
            <a
              href={result.url}
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.title}
            </a>
            <p className="text-sm text-muted-foreground mt-1">{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Create registry
const toolRegistry = createToolUIRegistry({
  weather: WeatherResult,
  search: SearchResults,
})

// Use in your app
function App() {
  const messages: CoreMessage[] = [
    { role: 'user', content: 'What is the weather in San Francisco?' },
  ]

  const toolCall = {
    name: 'weather',
    args: { location: 'San Francisco' },
    id: 'call-1',
  }

  const result = {
    temperature: 18,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 15,
  }

  return (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={toolCall}
      result={result}
      messages={messages}
      showHeader={false}
      enableErrorBoundary={true}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="integration-with-streaming">Integration with Streaming</h2>

        <p>
          Use ClarityToolResult with streaming messages to render tool results:
        </p>

        <EnhancedCodeBlock
          code={`import { ClarityToolResult, createToolUIRegistry, StreamingMessage } from '@clarity-chat/react/internal'
import { useStreamingSSE } from '@clarity-chat/react/internal'

function StreamingWithToolResults() {
  const registry = createToolUIRegistry({
    weather: WeatherResult,
    search: SearchResults,
  })

  const { content, toolCalls, messages } = useStreamingSSE({ api: '/api/stream' })

  return (
    <div className="space-y-4">
      <StreamingMessage content={content} toolCalls={toolCalls} />
      
      {toolCalls.map((toolCall) => {
        // Get result from messages
        const toolResult = messages.find(
          m => m.role === 'tool' && m.toolCallId === toolCall.id
        )?.content

        if (!toolResult) return null

        return (
          <ClarityToolResult
            key={toolCall.id}
            registry={registry}
            toolCall={{
              name: toolCall.function.name,
              args: JSON.parse(toolCall.function.arguments),
              id: toolCall.id,
            }}
            result={toolResult}
            messages={messages}
          />
        )
      })}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Create reusable components:</strong> Design tool result
            components to be reusable across your app
          </li>
          <li>
            <strong>Handle errors gracefully:</strong> Use error boundaries and
            provide fallbacks
          </li>
          <li>
            <strong>Type your data:</strong> Use TypeScript to type tool result
            data for better developer experience
          </li>
          <li>
            <strong>Keep components focused:</strong> Each tool component should
            focus on rendering that tool's results
          </li>
          <li>
            <strong>Provide fallbacks:</strong> Always have a fallback for
            unregistered tools
          </li>
        </ul>

        <h2 id="accessibility">Accessibility</h2>

        <p>ClarityToolResult maintains accessibility:</p>

        <ul>
          <li>
            ✅ Error boundaries prevent crashes from affecting the rest of the
            UI
          </li>
          <li>✅ Semantic HTML in tool components</li>
          <li>✅ Screen reader compatibility</li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/tool-invocation-card">
              ToolInvocationCard
            </a>{' '}
            - Display tool calls with approval workflow
          </li>
          <li>
            <a href="/reference/components/agent-run-feed">AgentRunFeed</a> -
            Display multiple agent execution steps
          </li>
          <li>
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            - Display streaming responses
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat-with-tools">
              useClarityChatWithTools
            </a>{' '}
            - Hook for tool-enabled chat
          </li>
        </ul>

        <Pagination
          prev={{
            title: 'AgentRunFeed',
            href: '/reference/components/agent-run-feed',
          }}
          next={{
            title: 'Hooks Overview',
            href: '/reference/hooks',
          }}
        />
      </>
    </ToastProvider>
  )
}
