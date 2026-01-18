// TODO: ClarityToolResult and createToolUIRegistry are planned but not yet implemented
// in @clarity-chat/react. This page documents the intended API and features.

'use client'

import { useState, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import {
//   ClarityToolResult,
//   createToolUIRegistry,
// } from '@clarity-chat/react'
// import type { CoreMessage } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Weather result component example (for documentation purposes)
function WeatherResult({ data, toolCall }: { data: Record<string, unknown>; toolCall?: Record<string, unknown> }) {
  return (
    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">Weather Icon</span>
        <h3 className="font-semibold">
          Weather in {String((toolCall?.args as Record<string, unknown>)?.location || 'Unknown')}
        </h3>
      </div>
      <div className="space-y-1">
        <p>
          <strong>Temperature:</strong> {String(data.temperature)}C
        </p>
        <p>
          <strong>Condition:</strong> {String(data.condition)}
        </p>
        <p>
          <strong>Humidity:</strong> {String(data.humidity)}%
        </p>
      </div>
    </div>
  )
}

// Placeholder demo component - shows Coming Soon notice
function BasicToolResultDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">ClarityToolResult is planned but not yet implemented.</p>
      </div>
    </div>
  )
}

// Placeholder fallback demo
function ToolResultWithFallbackDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">Fallback rendering will be available when ClarityToolResult is implemented.</p>
      </div>
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

        <Callout type="warning" className="mb-6">
          <p>
            <strong>Coming Soon:</strong> ClarityToolResult and createToolUIRegistry are planned
            but not yet implemented in @clarity-chat/react. This page documents the intended API.
          </p>
        </Callout>

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
            initialCode={`// ClarityToolResult is coming soon!
// This playground will be functional once the component is implemented.

function Example() {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <p className="text-center text-muted-foreground py-8">
        ClarityToolResult coming soon...
      </p>
      {/* Once implemented:
      const registry = createToolUIRegistry({
        weather: ({ data }) => (
          <div className="p-4 border rounded-lg">
            <h3>Weather: {data.temperature}C</h3>
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
      */}
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`// Coming soon:
import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'
import type { CoreMessage, ToolComponentProps } from '@clarity-chat/react'
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
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'
import type { ToolComponentProps } from '@clarity-chat/react'

// Custom component for weather tool
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold">Weather in {toolCall?.args?.location}</h3>
      <p>Temperature: {data.temperature}C</p>
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
          code={`import { createToolUIRegistry } from '@clarity-chat/react'
import type { ToolComponentProps } from '@clarity-chat/react'

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

        <h2 id="fallback">Fallback for Unregistered Tools</h2>

        <p>
          When a tool isn't registered, ClarityToolResult falls back to
          displaying JSON:
        </p>

        <ComponentPreview
          title="Unregistered Tool Fallback"
          description="Default JSON display for unregistered tools"
          code={`import { ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'

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

        <h2 id="props">Props</h2>

        <PropsTable props={clarityToolResultProps} />

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
            Error boundaries prevent crashes from affecting the rest of the
            UI
          </li>
          <li>Semantic HTML in tool components</li>
          <li>Screen reader compatibility</li>
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
          previous={{
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
