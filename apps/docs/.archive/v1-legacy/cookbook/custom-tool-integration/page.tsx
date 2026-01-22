import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Custom Tool Integration Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to integrate custom tools and functions with your chat application for extended AI capabilities.',
}

export default function CustomToolIntegrationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Custom Tool Integration Recipe</h1>

      <p className="lead">
        Integrate custom tools and functions with your chat application to
        extend AI capabilities. Perfect for adding domain-specific functionality
        like database queries, API calls, and custom business logic.
      </p>

      <Callout type="info" title="What are Tools?">
        <p>
          Tools allow the AI to call your functions during conversations. For
          example, the AI can search the web, query a database, or call your API
          when needed.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Add tool support with useClarityChatWithTools:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChatWithTools, ChatWindow } from '@clarity-chat/react'

function ChatWithTools() {
  const { messages, append, toolInvocations } = useClarityChatWithTools({
    api: '/api/chat',
    tools: [
      {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
        execute: async (args) => {
          return await getWeather(args.location)
        },
      },
    ],
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Tool Definition</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Define tools with OpenAPI schema:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`interface Tool {
  name: string                    // Tool identifier
  description: string             // What the tool does
  parameters: {
    type: 'object'
    properties: Record<string, any>  // Parameter definitions
    required?: string[]            // Required parameters
  }
  execute: (args: Record<string, any>) => Promise<any>  // Tool implementation
}

const tools: Tool[] = [
  {
    name: 'search_database',
    description: 'Search the product database',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        limit: {
          type: 'number',
          description: 'Maximum results',
          default: 10,
        },
      },
      required: ['query'],
    },
    execute: async (args) => {
      return await database.search(args.query, args.limit)
    },
  },
]`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Example Tools</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Weather Tool</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather conditions for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City and state or country',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius',
      },
    },
    required: ['location'],
  },
  execute: async (args) => {
    const response = await fetch(
      \`https://api.weather.com/v1/current?location=\${args.location}&units=\${args.units}\`
    )
    const data = await response.json()
    return {
      temperature: data.temp,
      condition: data.condition,
      humidity: data.humidity,
    }
  },
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Database Query Tool</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`const databaseTool = {
  name: 'query_database',
  description: 'Query the customer database',
  parameters: {
    type: 'object',
    properties: {
      sql: {
        type: 'string',
        description: 'SQL query to execute',
      },
    },
    required: ['sql'],
  },
  execute: async (args) => {
    // Validate and execute SQL query
    const results = await db.query(args.sql)
    return results
  },
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">API Call Tool</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`const apiTool = {
  name: 'call_api',
  description: 'Call an external API endpoint',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'API endpoint URL',
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'GET',
      },
      body: {
        type: 'object',
        description: 'Request body (for POST/PUT)',
      },
    },
    required: ['url'],
  },
  execute: async (args) => {
    const response = await fetch(args.url, {
      method: args.method,
      body: args.body ? JSON.stringify(args.body) : undefined,
    })
    return await response.json()
  },
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useAssistant</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use the assistant hook for more control:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react'

function AssistantWithTools() {
  const { messages, append, toolInvocations } = useAssistant({
    api: '/api/assistant',
    assistantId: 'asst_123',
    onToolCall: async (invocation) => {
      // Route to appropriate tool
      switch (invocation.toolName) {
        case 'get_weather':
          return await getWeather(invocation.args.location)
        case 'search_database':
          return await searchDatabase(invocation.args.query)
        case 'send_email':
          return await sendEmail(invocation.args)
        default:
          throw new Error(\`Unknown tool: \${invocation.toolName}\`)
      }
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Tool Approval</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Require user approval before executing tools:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAssistant } from '@clarity-chat/react'

function AssistantWithApproval() {
  const { messages, append, toolInvocations } = useAssistant({
    api: '/api/assistant',
    autoRunTools: false, // Require manual approval
    onToolCall: async (invocation) => {
      // Show approval dialog
      const approved = await showToolApprovalDialog({
        toolName: invocation.toolName,
        args: invocation.args,
      })

      if (!approved) {
        throw new Error('Tool execution cancelled by user')
      }

      // Execute tool
      return await executeTool(invocation)
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Handle tool execution errors:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`const tool = {
  name: 'risky_operation',
  description: 'Perform a risky operation',
  parameters: { /* ... */ },
  execute: async (args) => {
    try {
      return await performRiskyOperation(args)
    } catch (error) {
      // Return error information to AI
      return {
        error: true,
        message: error.message,
        // AI can handle the error and inform the user
      }
    }
  },
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Write clear descriptions</strong> - Help the AI understand
            when to use each tool
          </li>
          <li>
            <strong>Validate inputs</strong> - Always validate tool arguments
            before execution
          </li>
          <li>
            <strong>Handle errors gracefully</strong> - Return meaningful error
            messages
          </li>
          <li>
            <strong>Limit tool scope</strong> - Only expose necessary
            functionality
          </li>
          <li>
            <strong>Require approval for sensitive operations</strong> - Ask
            user before executing risky tools
          </li>
          <li>
            <strong>Log tool executions</strong> - Track tool usage for
            debugging and analytics
          </li>
          <li>
            <strong>Rate limit tools</strong> - Prevent abuse of expensive
            operations
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-clarity-chat-with-tools"
            className="docs-card"
          >
            <h3>useClarityChatWithTools Hook</h3>
            <p>Top-level hook with tool support</p>
          </a>
          <a href="/reference/hooks/use-assistant" className="docs-card">
            <h3>useAssistant Hook</h3>
            <p>Assistant hook with tool calling</p>
          </a>
          <a href="/guides/agents" className="docs-card">
            <h3>Agents Guide</h3>
            <p>Complete agents and tools guide</p>
          </a>
          <a href="/cookbook/error-handling" className="docs-card">
            <h3>Error Handling Recipe</h3>
            <p>Handle errors in tools</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Voice Input', href: '/cookbook/voice-input' }}
        next={{ title: 'Offline-First', href: '/cookbook/offline-first' }}
      />
    </>
  )
}
