'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Pagination } from '@/components/Navigation/Pagination'


export default function ToolIntegrationGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">Tool Integration Guide</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to integrating AI tool calls, creating custom tool UIs, handling tool execution,
            and implementing approval workflows.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            Tool integration allows AI assistants to call external functions and APIs, extending their capabilities
            beyond text generation. Clarity Chat provides a complete system for handling tool calls, displaying
            tool invocations, executing tools, and rendering results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 border-2 border-blue-500/20 rounded-xl bg-blue-500/5">
              <div className="font-semibold text-blue-600 dark:text-blue-400 mb-2">✅ With Tools</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Access external APIs</li>
                <li>• Perform calculations</li>
                <li>• Search databases</li>
                <li>• Execute actions</li>
                <li>• Real-time data access</li>
              </ul>
            </div>

            <div className="p-4 border-2 border-muted rounded-xl">
              <div className="font-semibold mb-2">❌ Without Tools</div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Text-only responses</li>
                <li>• No real-time data</li>
                <li>• Limited capabilities</li>
                <li>• Static information</li>
                <li>• No external actions</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <p>
              <strong>Tool Flow:</strong> AI requests tool → Tool invocation card shown → User approves (optional) →
              Tool executes → Result displayed → AI uses result in response.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Tool Call Structure</h2>
          <p className="mb-4">
            Tool calls follow a standard structure that works across different AI providers:
          </p>

          <EnhancedCodeBlock
            code={`interface ToolCall {
  /** Unique tool call ID */
  id: string
  /** Tool call type (always 'function') */
  type: 'function'
  /** Function details */
  function: {
    /** Function/tool name */
    name: string
    /** Function arguments as JSON string */
    arguments: string
  }
}

// Example tool call
const toolCall: ToolCall = {
  id: 'call_abc123',
  type: 'function',
  function: {
    name: 'get_weather',
    arguments: JSON.stringify({
      location: 'San Francisco',
      units: 'celsius'
    })
  }
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Tool Definitions</h3>
          <p className="mb-4">
            Tools are defined with a schema that describes their name, description, and parameters:
          </p>

          <EnhancedCodeBlock
            code={`// Tool definition for AI provider
const weatherTool = {
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name or location',
        },
        units: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature units',
        },
      },
      required: ['location'],
    },
  },
}

// Provide tools to AI
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  tools: [weatherTool],
  tool_choice: 'auto', // or 'required' or specific tool
})`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Tool Invocation Cards</h2>
          <p className="mb-4">
            The <code>ToolInvocationCard</code> component displays tool calls with status, approval buttons,
            and result visualization:
          </p>

          <EnhancedCodeBlock
            code={`import { ToolInvocationCard } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/react'

function ToolCardExample() {
  const [status, setStatus] = useState<'pending' | 'executing' | 'success' | 'error'>('pending')
  const [result, setResult] = useState(null)

  const toolCall: ToolCall = {
    id: 'call_abc123',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco' }),
    },
  }

  const handleApprove = async () => {
    setStatus('executing')
    try {
      const weather = await fetch('/api/weather', {
        method: 'POST',
        body: JSON.stringify({ location: 'San Francisco' }),
      }).then(r => r.json())
      setResult(weather)
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      result={result}
      requiresApproval={true}
      onApprove={handleApprove}
      onReject={() => setStatus('rejected')}
      formatArguments={true}
      expandableResult={true}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Tool Status</h3>
          <p className="mb-4">
            Tool invocations go through several status states:
          </p>

          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>pending:</strong> Awaiting approval or execution</li>
            <li><strong>approved:</strong> Approved but not yet executed</li>
            <li><strong>rejected:</strong> User rejected the tool call</li>
            <li><strong>executing:</strong> Tool is currently running</li>
            <li><strong>success:</strong> Tool executed successfully</li>
            <li><strong>error:</strong> Tool execution failed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Tool UI Registry</h2>
          <p className="mb-4">
            The tool UI registry allows you to create custom UI components for rendering tool results.
            This provides a better user experience than showing raw JSON.
          </p>

          <h3 className="text-2xl font-semibold mb-3">Creating a Registry</h3>
          <EnhancedCodeBlock
            code={`import { createToolUIRegistry } from '@clarity-chat/react'
import type { ToolComponentProps } from '@clarity-chat/react'

// Custom component for weather tool
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-semibold">Weather in {toolCall?.args?.location}</h3>
      <p>Temperature: {data.temperature}°C</p>
      <p>Condition: {data.condition}</p>
      <p>Humidity: {data.humidity}%</p>
    </div>
  )
}

// Custom component for search tool
function SearchResults({ data }: ToolComponentProps) {
  return (
    <div className="space-y-2">
      {data.results?.map((result, i) => (
        <div key={i} className="p-2 border rounded">
          <a href={result.url} className="font-semibold">{result.title}</a>
          <p className="text-sm text-muted-foreground">{result.snippet}</p>
        </div>
      ))}
    </div>
  )
}

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResults,
})`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Using the Registry</h3>
          <EnhancedCodeBlock
            code={`import { ClarityToolResult } from '@clarity-chat/react'

function ToolResultExample() {
  const toolCall = {
    name: 'get_weather',
    args: { location: 'San Francisco' },
  }

  const result = {
    temperature: 18,
    condition: 'Sunny',
    humidity: 65,
  }

  return (
    <ClarityToolResult
      registry={toolRegistry}
      toolCall={toolCall}
      result={result}
      messages={messages}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Approval Workflows</h2>
          <p className="mb-4">
            For sensitive operations, you can require user approval before executing tools:
          </p>

          <EnhancedCodeBlock
            code={`import { ToolInvocationCard } from '@clarity-chat/react'
import { useState } from 'react'

function ApprovalWorkflow() {
  const [pendingTools, setPendingTools] = useState<ToolCall[]>([])
  const [executedTools, setExecutedTools] = useState<Map<string, any>>(new Map())

  const handleToolCall = (toolCall: ToolCall) => {
    // Check if tool requires approval
    const requiresApproval = ['send_email', 'delete_file', 'update_database'].includes(
      toolCall.function.name
    )

    if (requiresApproval) {
      setPendingTools(prev => [...prev, toolCall])
    } else {
      // Auto-execute safe tools
      executeTool(toolCall)
    }
  }

  const executeTool = async (toolCall: ToolCall) => {
    try {
      const result = await callToolAPI(toolCall)
      setExecutedTools(prev => new Map(prev).set(toolCall.id, result))
    } catch (error) {
      console.error('Tool execution failed:', error)
    }
  }

  const handleApprove = (toolCall: ToolCall) => {
    setPendingTools(prev => prev.filter(t => t.id !== toolCall.id))
    executeTool(toolCall)
  }

  const handleReject = (toolCall: ToolCall) => {
    setPendingTools(prev => prev.filter(t => t.id !== toolCall.id))
  }

  return (
    <div>
      {pendingTools.map(toolCall => (
        <ToolInvocationCard
          key={toolCall.id}
          toolCall={toolCall}
          status="pending"
          requiresApproval={true}
          onApprove={() => handleApprove(toolCall)}
          onReject={() => handleReject(toolCall)}
        />
      ))}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Displaying Tool Calls in Messages</h2>
          <p className="mb-4">
            Tool calls are automatically displayed in streaming messages using the <code>StreamingMessage</code> component:
          </p>

          <EnhancedCodeBlock
            code={`import { StreamingMessage } from '@clarity-chat/react'

function MessageWithToolCall() {
  const toolCalls: ToolCall[] = [
    {
      id: 'call_abc123',
      type: 'function',
      function: {
        name: 'get_weather',
        arguments: JSON.stringify({ location: 'San Francisco' }),
      },
    },
  ]

  return (
    <StreamingMessage
      content="Let me check the weather for you."
      isStreaming={false}
      toolCalls={toolCalls}
      onToolCallApprove={async (toolCall) => {
        // Execute tool
        const result = await executeTool(toolCall)
        return result
      }}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Complete Example</h2>
          <p className="mb-4">
            Here's a complete example integrating tools with a chat interface:
          </p>

          <EnhancedCodeBlock
            code={`import { useState } from 'react'
import { useClarityChat } from '@clarity-chat/react'
import { ToolInvocationCard, ClarityToolResult, createToolUIRegistry } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/react'

// Custom tool result components
function WeatherResult({ data, toolCall }: ToolComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>Weather in {toolCall?.args?.location}</h3>
      <p>Temperature: {data.temperature}°C</p>
      <p>Condition: {data.condition}</p>
    </div>
  )
}

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
})

function ChatWithTools() {
  const [pendingTools, setPendingTools] = useState<ToolCall[]>([])
  const [toolResults, setToolResults] = useState<Map<string, any>>(new Map())

  const {
    messages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    onToolCall: async (toolCall: ToolCall) => {
      // Check if requires approval
      if (requiresApproval(toolCall)) {
        setPendingTools(prev => [...prev, toolCall])
        return null // Don't execute yet
      }

      // Auto-execute
      return await executeTool(toolCall)
    },
  })

  const executeTool = async (toolCall: ToolCall): Promise<any> => {
    try {
      const response = await fetch('/api/tools/execute', {
        method: 'POST',
        body: JSON.stringify(toolCall),
      })
      const result = await response.json()
      setToolResults(prev => new Map(prev).set(toolCall.id, result))
      return result
    } catch (error) {
      console.error('Tool execution failed:', error)
      throw error
    }
  }

  const handleApprove = async (toolCall: ToolCall) => {
    setPendingTools(prev => prev.filter(t => t.id !== toolCall.id))
    const result = await executeTool(toolCall)
    // Continue conversation with tool result
    await append({
      role: 'tool',
      content: JSON.stringify(result),
      toolCallId: toolCall.id,
    })
  }

  return (
    <div>
      {/* Chat messages */}
      <div>
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.content}
            {msg.toolCalls?.map(toolCall => (
              <div key={toolCall.id}>
                {toolResults.has(toolCall.id) ? (
                  <ClarityToolResult
                    registry={toolRegistry}
                    toolCall={toolCall}
                    result={toolResults.get(toolCall.id)}
                    messages={messages}
                  />
                ) : (
                  <ToolInvocationCard
                    toolCall={toolCall}
                    status="pending"
                    requiresApproval={requiresApproval(toolCall)}
                    onApprove={() => handleApprove(toolCall)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      {pendingTools.map(toolCall => (
        <ToolInvocationCard
          key={toolCall.id}
          toolCall={toolCall}
          status="pending"
          requiresApproval={true}
          onApprove={() => handleApprove(toolCall)}
          onReject={() => setPendingTools(prev => prev.filter(t => t.id !== toolCall.id))}
        />
      ))}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Define Clear Tool Schemas</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Provide clear descriptions for tools and parameters</li>
            <li>Use appropriate parameter types (string, number, boolean, object)</li>
            <li>Mark required parameters explicitly</li>
            <li>Include examples in descriptions when helpful</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">2. Implement Approval for Sensitive Operations</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Require approval for destructive operations (delete, update, send)</li>
            <li>Auto-execute safe read-only operations</li>
            <li>Show clear descriptions of what the tool will do</li>
            <li>Provide context about why the tool is being called</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">3. Create Custom Tool UIs</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use the tool UI registry for better UX</li>
            <li>Display results in a user-friendly format</li>
            <li>Show relevant information, not raw JSON</li>
            <li>Handle errors gracefully with fallback UI</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Handle Errors Gracefully</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Show clear error messages when tools fail</li>
            <li>Provide retry options for transient failures</li>
            <li>Log errors for debugging</li>
            <li>Allow users to cancel long-running tools</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">5. Optimize Tool Execution</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Cache tool results when appropriate</li>
            <li>Batch multiple tool calls when possible</li>
            <li>Use streaming for long-running tools</li>
            <li>Set timeouts for tool execution</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">6. Security Considerations</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Validate tool arguments before execution</li>
            <li>Sanitize inputs to prevent injection attacks</li>
            <li>Implement rate limiting for tool calls</li>
            <li>Use authentication for sensitive tools</li>
            <li>Log all tool executions for audit trails</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Server-Side Tool Execution</h2>
          <p className="mb-4">
            Tools should be executed on the server for security. Here's an example API route:
          </p>

          <EnhancedCodeBlock
            code={`// app/api/tools/execute/route.ts
import { NextResponse } from 'next/server'
import type { ToolCall } from '@clarity-chat/react'

export async function POST(req: Request) {
  const toolCall: ToolCall = await req.json()

  try {
    let result

    switch (toolCall.function.name) {
      case 'get_weather':
        result = await getWeather(JSON.parse(toolCall.function.arguments))
        break
      case 'search':
        result = await search(JSON.parse(toolCall.function.arguments))
        break
      default:
        throw new Error(\`Unknown tool: \${toolCall.function.name}\`)
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function getWeather(args: { location: string; units?: string }) {
  const response = await fetch(
    \`https://api.weather.com/v1/current?location=\${args.location}\`
  )
  return response.json()
}

async function search(args: { query: string; limit?: number }) {
  // Implement search logic
  return { results: [] }
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a href="/reference/components/tool-invocation-card" className="text-primary underline">
                ToolInvocationCard Component
              </a> – Display tool calls with approval workflow
            </li>
            <li>
              <a href="/reference/components/clarity-tool-result" className="text-primary underline">
                ClarityToolResult Component
              </a> – Render tool results with custom UIs
            </li>
            <li>
              <a href="/reference/components/streaming-message" className="text-primary underline">
                StreamingMessage Component
              </a> – Display tool calls in streaming messages
            </li>
            <li>
              <a href="/reference/hooks/use-clarity-chat" className="text-primary underline">
                useClarityChat Hook
              </a> – Chat hook with tool call support
            </li>
            <li>
              <a href="/guides/agents" className="text-primary underline">
                Agent System Guide
              </a> – Advanced agent workflows with tools
            </li>
          </ul>
        </section>

        <Pagination
          previous={{
            title: 'Token Optimization Guide',
            href: '/guides/token-optimization',
          }}
          next={{
            title: 'Agent System Guide',
            href: '/guides/agents',
          }}
        />
      </div>
    </>
  )
}
