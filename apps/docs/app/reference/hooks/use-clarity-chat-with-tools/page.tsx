import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'useClarityChatWithTools Hook | Clarity Chat',
  description:
    'Mid-level hook combining chat functionality with tool UI registry for seamless tool result rendering.',
}

export default function UseClarityChatWithToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium mb-4">
          <span>Tools & Agents</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useClarityChatWithTools</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Combines useClarityChat with tool UI registry for seamless tool result
          rendering. Automatically extracts tool calls from messages and renders
          them using registered components.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable Building
          Blocks) • <strong>Domain:</strong> Tools & Agents
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>
            Building AI agents that call external APIs and display results
            visually
          </li>
          <li>
            Chat applications with function calling (weather, search,
            calculations, etc.)
          </li>
          <li>When you need custom React components to render tool outputs</li>
          <li>
            Applications requiring seamless tool call extraction from AI
            responses
          </li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Simple chat without tools - use{' '}
            <code className="bg-muted px-2 py-1 rounded">useClarityChat</code>{' '}
            instead
          </li>
          <li>Backend-only tool execution - handle in your API routes</li>
          <li>When tool results don&apos;t need custom UI rendering</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import {
  useClarityChatWithTools,
  createToolUIRegistry
} from '@clarity-chat/react'

// Create a registry mapping tool names to components
const registry = createToolUIRegistry({
  weather: WeatherComponent,
  search: SearchComponent,
  calculator: CalculatorComponent,
})

function ChatWithTools() {
  const { messages, toolResults, isLoading } = useClarityChatWithTools({
    api: '/api/chat',
    toolRegistry: registry,
  })

  return (
    <div>
      {/* Render messages */}
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      {/* Render tool results */}
      {toolResults.map((result, i) => {
        const Component = registry.get(result.toolCall.function.name)
        return Component ? (
          <Component key={i} result={result.result} />
        ) : null
      })}
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Options</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">api</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <strong>Required.</strong> API endpoint URL for chat
                      requests.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">toolRegistry</td>
                    <td className="p-3 font-mono text-sm">
                      ToolComponentRegistry
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <strong>Required.</strong> Registry mapping tool names to
                      React components.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">autoExtractTools</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether to automatically extract tool results from
                      messages. Default: true.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">...rest</td>
                    <td className="p-3 font-mono text-sm">
                      UseClarityChatOptions
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      All options from{' '}
                      <Link
                        href="/reference/hooks/use-clarity-chat"
                        className="text-brand-600 hover:underline"
                      >
                        useClarityChat
                      </Link>
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">toolResults</td>
                    <td className="p-3 font-mono text-sm">
                      ExtractedToolResult[]
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Array of extracted tool results from messages.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">
                      getToolResultsForMessage
                    </td>
                    <td className="p-3 font-mono text-sm">
                      (messageId: string) =&gt; ExtractedToolResult[]
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Get tool results for a specific message.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">...rest</td>
                    <td className="p-3 font-mono text-sm">
                      UseClarityChatReturn
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      All return values from useClarityChat.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Base chat hook without tool integration.
            </p>
          </Link>
          <Link
            href="/guides/tool-integration"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Tool Integration Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to build tool-enabled chat applications.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
