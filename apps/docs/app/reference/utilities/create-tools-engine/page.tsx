import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: 'createToolsEngine | Clarity Chat',
  description:
    'Factory function for creating tool execution engines with type-safe registries, parameter validation, timeout handling, and result caching.',
}

const toolsConfigProps: Prop[] = [
  {
    name: 'registry',
    type: 'ToolDefinition[]',
    description: 'Array of custom tool definitions to register.',
  },
  {
    name: 'autoApprove',
    type: 'boolean',
    default: 'true',
    description: 'Automatically approve tool calls without user confirmation.',
  },
  {
    name: 'timeoutMs',
    type: 'number',
    default: '30000',
    description: 'Maximum execution time in milliseconds before timeout.',
  },
  {
    name: 'defaultRenderer',
    type: '"json" | "card" | "custom"',
    default: '"json"',
    description: 'Default UI renderer for tool results.',
  },
  {
    name: 'customRenderer',
    type: 'React.ComponentType<{ result: unknown; toolName: string }>',
    description: 'Custom component for rendering tool results.',
  },
]

const toolDefinitionProps: Prop[] = [
  {
    name: 'name',
    type: 'string',
    description: 'Unique identifier for the tool (e.g., "get_weather").',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Human-readable description of what the tool does.',
  },
  {
    name: 'parameters',
    type: 'Record<string, unknown>',
    description: 'JSON Schema defining the tool parameters.',
  },
  {
    name: 'execute',
    type: '(params: unknown) => Promise<unknown>',
    description: 'Async function that executes the tool logic.',
  },
  {
    name: 'renderer',
    type: 'React.ComponentType<{ result: unknown }>',
    description: 'Optional custom renderer for this specific tool.',
  },
]

const statsProps: Prop[] = [
  {
    name: 'totalCalls',
    type: 'number',
    description: 'Total number of completed tool calls.',
  },
  {
    name: 'successfulCalls',
    type: 'number',
    description: 'Number of successfully completed calls.',
  },
  {
    name: 'failedCalls',
    type: 'number',
    description: 'Number of failed or timed out calls.',
  },
  {
    name: 'pendingCalls',
    type: 'number',
    description: 'Number of calls awaiting approval or execution.',
  },
  {
    name: 'averageExecutionTimeMs',
    type: 'number',
    description: 'Average execution time in milliseconds.',
  },
  {
    name: 'registeredTools',
    type: 'number',
    description: 'Total number of registered tools.',
  },
]

export default function CreateToolsEnginePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>createToolsEngine</h1>

      <p className="lead">
        Factory function that creates a tool execution engine for LLM function calling.
        Features type-safe tool registries, automatic parameter validation, timeout handling,
        result caching, and approval workflows.
      </p>

      <Callout type="info">
        <p>
          For React components, consider using{' '}
          <Link href="/reference/components/clarity-chat-app">
            ClarityChatApp
          </Link>{' '}
          with the <code>preset=&quot;tools&quot;</code> option for automatic tool integration.
          <code>createToolsEngine</code> is for non-React contexts, server-side usage,
          or custom tool pipelines.
        </p>
      </Callout>

      <section className="my-12">
        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import {
  createToolsEngine,
  registerTool,
  unregisterTool,
  getAvailableTools,
  createToolCall,
  approveToolCall,
  rejectToolCall,
  executeToolCall,
  executeTool,
  getToolStats,
  clearToolHistory,
  clearToolCache,
} from '@clarity-chat/react'

import type { ToolsConfig, ToolDefinition, ToolCall, ToolsEngineState } from '@clarity-chat/react'`}
          language="tsx"
        />
      </section>

      <section className="my-12">
        <h2 id="basic-usage">Basic Usage</h2>

        <p>Create a tools engine and execute tool calls:</p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, executeTool } from '@clarity-chat/react'

// 1. Create engine (includes 4 built-in tools)
let engine = createToolsEngine()

// 2. Execute a built-in tool
const { state, result } = await executeTool(engine, 'calculate', {
  expression: '2 + 2 * 3'
})
engine = state

console.log(result)
// => { success: true, result: { expression: '2 + 2 * 3', result: 8 }, executionTimeMs: 1 }

// 3. Execute another built-in tool
const { state: state2, result: result2 } = await executeTool(engine, 'get_current_time', {
  timezone: 'America/New_York'
})
engine = state2

console.log(result2)
// => { success: true, result: '1/19/2026, 3:45:00 PM', executionTimeMs: 0 }`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="built-in-tools">Built-in Tools</h2>

        <p>The tools engine includes 4 safe, commonly-needed tools:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg font-mono">get_current_time</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Get the current date and time, optionally in a specific timezone.
            </p>
            <EnhancedCodeBlock
              code={`await executeTool(engine, 'get_current_time', {
  timezone: 'Europe/London' // optional
})`}
              language="tsx"
            />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg font-mono">calculate</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Perform safe mathematical calculations.
            </p>
            <EnhancedCodeBlock
              code={`await executeTool(engine, 'calculate', {
  expression: '(100 - 20) * 1.15'
})`}
              language="tsx"
            />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg font-mono">generate_uuid</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Generate unique identifiers in various formats.
            </p>
            <EnhancedCodeBlock
              code={`await executeTool(engine, 'generate_uuid', {
  format: 'uuid' // 'uuid' | 'short' | 'nano'
})`}
              language="tsx"
            />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg font-mono">format_json</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Format or validate JSON data.
            </p>
            <EnhancedCodeBlock
              code={`await executeTool(engine, 'format_json', {
  json: '{"key":"value"}',
  indent: 2
})`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="custom-tools">Registering Custom Tools</h2>

        <p>Add your own tools to the engine:</p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, registerTool } from '@clarity-chat/react'

// Define a custom tool
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name or coordinates'
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units'
      }
    },
    required: ['location']
  },
  execute: async (params) => {
    const { location, units = 'celsius' } = params
    // Call your weather API here
    const response = await fetch(\`/api/weather?location=\${location}&units=\${units}\`)
    return response.json()
  }
}

// Create engine with custom tools
let engine = createToolsEngine({
  registry: [weatherTool],
  autoApprove: true,
  timeoutMs: 10000
})

// Or register after creation
engine = registerTool(engine, {
  name: 'search_database',
  description: 'Search the product database',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      limit: { type: 'number' }
    },
    required: ['query']
  },
  execute: async ({ query, limit = 10 }) => {
    return await db.products.search(query, limit)
  }
})`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="approval-workflow">Approval Workflow</h2>

        <p>
          For sensitive tools, disable auto-approval and implement a confirmation flow:
        </p>

        <EnhancedCodeBlock
          code={`import {
  createToolsEngine,
  createToolCall,
  approveToolCall,
  rejectToolCall,
  executeToolCall
} from '@clarity-chat/react'

// Create engine with manual approval
let engine = createToolsEngine({
  autoApprove: false, // Require manual approval
  registry: [{
    name: 'delete_record',
    description: 'Delete a database record',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id']
    },
    execute: async ({ id }) => db.delete(id)
  }]
})

// 1. Create a tool call (status: 'pending')
const { state: s1, call } = createToolCall(engine, 'delete_record', { id: '123' })
engine = s1

console.log(call.status) // => 'pending'
console.log(call.id)     // => 'call_1705678900000_abc123'

// 2a. Approve the call
engine = approveToolCall(engine, call.id)
// Now call.status === 'approved'

// 2b. Or reject the call
// engine = rejectToolCall(engine, call.id, 'User cancelled')

// 3. Execute the approved call
const { state: s2, result } = await executeToolCall(engine, call.id)
engine = s2

if (result.success) {
  console.log('Deleted:', result.result)
} else {
  console.error('Failed:', result.error)
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="parameter-validation">Parameter Validation</h2>

        <p>
          The tools engine automatically validates parameters against the JSON Schema:
        </p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, executeTool } from '@clarity-chat/react'

let engine = createToolsEngine({
  registry: [{
    name: 'send_email',
    description: 'Send an email',
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string' },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high']
        }
      },
      required: ['to', 'subject', 'body']
    },
    execute: async (params) => sendEmail(params)
  }]
})

// Missing required parameter - fails validation
const { result: r1 } = await executeTool(engine, 'send_email', {
  to: 'user@example.com'
})
console.log(r1)
// => { success: false, error: 'Parameter validation failed: Missing required parameter: subject; Missing required parameter: body', executionTimeMs: 0 }

// Invalid enum value - fails validation
const { result: r2 } = await executeTool(engine, 'send_email', {
  to: 'user@example.com',
  subject: 'Hello',
  body: 'World',
  priority: 'urgent' // not in enum
})
console.log(r2)
// => { success: false, error: 'Parameter validation failed: Parameter "priority" must be one of: low, normal, high', executionTimeMs: 0 }

// Valid parameters - executes successfully
const { result: r3 } = await executeTool(engine, 'send_email', {
  to: 'user@example.com',
  subject: 'Hello',
  body: 'World',
  priority: 'high'
})
console.log(r3)
// => { success: true, result: {...}, executionTimeMs: 125 }`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="timeout-handling">Timeout Handling</h2>

        <p>Long-running tools are automatically terminated:</p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, executeTool } from '@clarity-chat/react'

let engine = createToolsEngine({
  timeoutMs: 5000, // 5 second timeout
  registry: [{
    name: 'slow_operation',
    description: 'A slow operation',
    parameters: { type: 'object' },
    execute: async () => {
      // This will be interrupted after 5 seconds
      await new Promise(resolve => setTimeout(resolve, 10000))
      return 'done'
    }
  }]
})

const { result } = await executeTool(engine, 'slow_operation', {})
console.log(result)
// => { success: false, error: 'Execution timeout', executionTimeMs: 5001 }`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="caching">Result Caching</h2>

        <p>
          Tool results are cached for 1 minute by default to avoid redundant executions:
        </p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, executeTool, clearToolCache } from '@clarity-chat/react'

let engine = createToolsEngine()

// First call - executes the tool
const { state: s1, result: r1 } = await executeTool(engine, 'calculate', {
  expression: '100 * 100'
})
engine = s1
console.log(r1.executionTimeMs) // => 2

// Second call with same params - returns cached result
const { state: s2, result: r2 } = await executeTool(engine, 'calculate', {
  expression: '100 * 100'
})
engine = s2
console.log(r2.executionTimeMs) // => 0 (cached)

// Clear cache when needed
engine = clearToolCache(engine)`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="with-llm">Integrating with LLM Chat</h2>

        <p>Connect the tools engine to your chat for function calling:</p>

        <EnhancedCodeBlock
          code={`import { createToolsEngine, executeTool, getAvailableTools } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

// Setup tools engine
let engine = createToolsEngine({
  registry: [
    // Your custom tools...
  ]
})

function ChatWithTools() {
  const chat = useClarityChat({
    api: '/api/chat',
    // Pass tool definitions to the LLM
    body: {
      tools: getAvailableTools(engine)
    },
    onToolCall: async ({ name, parameters }) => {
      // Execute tool calls from the LLM
      const { state, result } = await executeTool(engine, name, parameters)
      engine = state

      if (result.success) {
        return result.result
      } else {
        throw new Error(result.error)
      }
    }
  })

  return <ChatWindow messages={chat.messages} isLoading={chat.isLoading} onSendMessage={chat.append} />
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="statistics">Engine Statistics</h2>

        <p>Monitor tool usage and performance:</p>

        <EnhancedCodeBlock
          code={`import { getToolStats } from '@clarity-chat/react'

const stats = getToolStats(engine)

console.log(\`Registered tools: \${stats.registeredTools}\`)
console.log(\`Total calls: \${stats.totalCalls}\`)
console.log(\`Successful: \${stats.successfulCalls}\`)
console.log(\`Failed: \${stats.failedCalls}\`)
console.log(\`Pending: \${stats.pendingCalls}\`)
console.log(\`Avg execution time: \${stats.averageExecutionTimeMs}ms\`)`}
          language="tsx"
          showLineNumbers
        />

        <PropsTable props={statsProps} />
      </section>

      <section className="my-12">
        <h2 id="config">ToolsConfig Options</h2>
        <PropsTable props={toolsConfigProps} />
      </section>

      <section className="my-12">
        <h2 id="tool-definition">ToolDefinition Interface</h2>
        <PropsTable props={toolDefinitionProps} />
      </section>

      <section className="my-12">
        <h2 id="type-definitions">Type Definitions</h2>

        <EnhancedCodeBlock
          code={`// Tool definition
interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown> // JSON Schema
  execute: (params: unknown) => Promise<unknown>
  renderer?: React.ComponentType<{ result: unknown }>
}

// Tool call state
interface ToolCall {
  id: string
  name: string
  parameters: Record<string, unknown>
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'timeout'
  result?: unknown
  error?: string
  startTime?: number
  endTime?: number
}

// Execution result
interface ToolExecutionResult {
  success: boolean
  result?: unknown
  error?: string
  executionTimeMs: number
}

// Engine state (internal)
interface ToolsEngineState {
  registry: Map<string, ToolDefinition>
  pendingCalls: ToolCall[]
  completedCalls: ToolCall[]
  autoApprove: boolean
  timeoutMs: number
  cache: Map<string, { result: unknown; timestamp: number }>
  cacheTtlMs: number
}

// Configuration
interface ToolsConfig {
  registry?: ToolDefinition[]
  defaultRenderer?: 'json' | 'card' | 'custom'
  customRenderer?: React.ComponentType<{ result: unknown; toolName: string }>
  autoApprove?: boolean
  timeoutMs?: number
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="api-reference">API Reference</h2>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">createToolsEngine(config?)</h3>
            <p className="text-sm text-muted-foreground">
              Create a new tools engine instance with optional configuration.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">registerTool(state, tool)</h3>
            <p className="text-sm text-muted-foreground">
              Register a new tool definition. Returns updated state.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">unregisterTool(state, toolName)</h3>
            <p className="text-sm text-muted-foreground">
              Remove a tool from the registry. Returns updated state.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">getAvailableTools(state)</h3>
            <p className="text-sm text-muted-foreground">
              Get list of all registered tools with their schemas.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">executeTool(state, name, params)</h3>
            <p className="text-sm text-muted-foreground">
              Convenience method: create, approve, and execute a tool call in one step.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">createToolCall(state, name, params)</h3>
            <p className="text-sm text-muted-foreground">
              Create a tool call request. Returns state and call object.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">approveToolCall(state, callId)</h3>
            <p className="text-sm text-muted-foreground">
              Approve a pending tool call for execution.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">rejectToolCall(state, callId, reason)</h3>
            <p className="text-sm text-muted-foreground">
              Reject a pending tool call with a reason.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">executeToolCall(state, callId)</h3>
            <p className="text-sm text-muted-foreground">
              Execute an approved tool call. Returns result and updated state.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">getToolStats(state)</h3>
            <p className="text-sm text-muted-foreground">
              Get execution statistics for the tools engine.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">clearToolHistory(state)</h3>
            <p className="text-sm text-muted-foreground">
              Clear the completed calls history.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold font-mono">clearToolCache(state)</h3>
            <p className="text-sm text-muted-foreground">
              Clear the result cache.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="best-practices">Best Practices</h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Use clear tool names</strong>: Follow snake_case convention and use
              descriptive verbs (e.g., <code>get_weather</code>, <code>create_ticket</code>).
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Write detailed descriptions</strong>: LLMs use descriptions to decide
              which tool to call. Be specific about what the tool does and when to use it.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Define complete parameter schemas</strong>: Include types, descriptions,
              required fields, and enums. Better schemas lead to better tool usage.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Disable autoApprove for sensitive tools</strong>: Tools that modify
              data, send emails, or access external systems should require approval.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong>Set appropriate timeouts</strong>: Default 30s is fine for most tools.
              Increase for slow APIs, decrease for user-facing real-time interactions.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong>Handle errors gracefully</strong>: Return meaningful error messages
              from your execute functions. The LLM can use these to recover.
            </div>
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 id="related">Related</h2>

        <ul>
          <li>
            <Link href="/reference/components/clarity-chat-app">
              ClarityChatApp
            </Link>{' '}
            - Full chat component with tools preset
          </li>
          <li>
            <Link href="/reference/utilities/create-rag-engine">
              createRAGEngine
            </Link>{' '}
            - RAG engine for document-based responses
          </li>
          <li>
            <Link href="/reference/utilities/create-memory-store">
              createMemoryStore
            </Link>{' '}
            - Memory store for conversation persistence
          </li>
          <li>
            <Link href="/guides/tools">Tools Guide</Link> - Understanding tool calling patterns
          </li>
        </ul>
      </section>

      <Pagination
        previous={{
          title: 'createRAGEngine',
          href: '/reference/utilities/create-rag-engine',
        }}
        next={{
          title: 'Types',
          href: '/reference/api/types',
        }}
      />
    </>
  )
}
