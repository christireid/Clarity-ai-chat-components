import { logger } from '@clarity-chat/utils/logger';
'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useAgent Hook | Clarity Chat',
  description: 'Top-level hook for AI agent orchestration with tool calling.',
}

const useAgentOptions: Prop[] = [
  {
    name: 'model',
    type: 'string',
    required: true,
    description: 'Model identifier (e.g., "gpt-4", "claude-3-opus").',
  },
  {
    name: 'tools',
    type: 'Tool[]',
    description: 'Array of tools the agent can use.',
  },
  {
    name: 'api',
    type: 'string',
    description: 'API endpoint for agent execution (optional).',
  },
  {
    name: 'config',
    type: 'Record<string, any>',
    description: 'Additional configuration options (e.g., maxIterations).',
  },
]

const useAgentReturn: Prop[] = [
  {
    name: 'run',
    type: '(input: { query: string; context?: any }) => Promise<string>',
    description: 'Run the agent with a query. Returns the final answer.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether the agent is currently running.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Current error, if any.',
  },
  {
    name: 'state',
    type: '{ currentStep: number; totalSteps: number; toolCalls: any[] }',
    description: 'Agent execution state with step tracking and tool calls.',
  },
]

export default function UseAgentPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useAgent</h1>

      <p className="lead">
        Top-level hook for AI agent orchestration with automatic tool management
        and error handling. Perfect for building AI agents that can use tools,
        make decisions, and complete multi-step tasks.
      </p>

      <Callout type="info" title="AI Agents">
        <p>
          AI agents can autonomously use tools, make decisions, and complete
          complex tasks through multiple steps. This hook handles the
          orchestration automatically.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAgent } from '@clarity-chat/react'

function AgentChat() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [
      {
        name: 'web_search',
        description: 'Search the web for information',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
          },
          required: ['query'],
        },
        execute: async (args) => {
          // Implement web search
          return await searchWeb(args.query)
        },
      },
    ],
  })

  const handleQuery = async (query: string) => {
    const response = await agent.run({ query })
    return response
  }

  return (
    <div>
      {agent.isLoading && <div>Agent thinking...</div>}
      {agent.error && <div>Error: {agent.error.message}</div>}
      <div>Step {agent.state.currentStep} of {agent.state.totalSteps}</div>
      <ChatWindow onSendMessage={handleQuery} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useAgent:
        </p>
        <CodePlayground
          initialCode={`import { useAgent } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [
      {
        name: 'calculator',
        description: 'Perform calculations',
        parameters: {
          type: 'object',
          properties: {
            expression: { type: 'string' },
          },
          required: ['expression'],
        },
        execute: async (args) => {
          // Safe math evaluation - sanitize input
          const expr = String(args.expression).replace(/[^0-9+\\-*/().\\s]/g, '')
          const result = new Function(\`"use strict"; return (\${expr})\`)()
          return { result: typeof result === 'number' ? result : 'Invalid' }
        },
      },
    ],
  })
  const [result, setResult] = useState('')

  const handleRun = async (query: string) => {
    const answer = await agent.run({ query })
    setResult(answer)
  }

  return (
    <div>
      <button onClick={() => handleRun('What is 2+2?')}>Run Agent</button>
      {agent.isLoading && <div>Running...</div>}
      {result && <div>Result: {result}</div>}
      <div>Steps: {agent.state.currentStep}/{agent.state.totalSteps}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Multiple Tools</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAgent } from '@clarity-chat/react'

function MultiToolAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [
      {
        name: 'web_search',
        description: 'Search the web',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
        execute: async (args) => await searchWeb(args.query),
      },
      {
        name: 'get_weather',
        description: 'Get weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string' },
          },
          required: ['location'],
        },
        execute: async (args) => await getWeather(args.location),
      },
      {
        name: 'send_email',
        description: 'Send an email',
        parameters: {
          type: 'object',
          properties: {
            to: { type: 'string' },
            subject: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['to', 'subject', 'body'],
        },
        execute: async (args) => await sendEmail(args),
      },
    ],
    config: {
      maxIterations: 10, // Maximum tool calls
    },
  })

  const handleQuery = async (query: string) => {
    return await agent.run({ query })
  }

  return (
    <div>
      {agent.state.toolCalls.map((call, i) => (
        <div key={i}>
          Used {call.tool} with {JSON.stringify(call.args)}
        </div>
      ))}
      <ChatWindow onSendMessage={handleQuery} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAgent } from '@clarity-chat/react'

function RobustAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [/* tools */],
  })

  const handleQuery = async (query: string) => {
    try {
      const response = await agent.run({ query })
      return response
    } catch (error) {
      logger.logger.error('Agent error:', error)
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  return (
    <div>
      {agent.error && (
        <div className="error">
          Error: {agent.error.message}
        </div>
      )}
      {agent.isLoading && (
        <div>
          Processing... (Step {agent.state.currentStep} of {agent.state.totalSteps})
        </div>
      )}
      <ChatWindow onSendMessage={handleQuery} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Custom API Endpoint
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAgent } from '@clarity-chat/react'

function CustomAPIAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    api: '/api/agent', // Custom agent API endpoint
    tools: [
      {
        name: 'database_query',
        description: 'Query the database',
        parameters: {
          type: 'object',
          properties: {
            sql: { type: 'string' },
          },
          required: ['sql'],
        },
        execute: async (args) => {
          return await fetch('/api/database', {
            method: 'POST',
            body: JSON.stringify({ sql: args.sql }),
          }).then(r => r.json())
        },
      },
    ],
  })

  const handleQuery = async (query: string) => {
    return await agent.run({ query })
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Context</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useAgent } from '@clarity-chat/react'

function ContextualAgent() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [/* tools */],
  })

  const handleQuery = async (query: string, userContext: any) => {
    // Pass context to agent
    const response = await agent.run({
      query,
      context: {
        userId: userContext.id,
        preferences: userContext.preferences,
        history: userContext.recentInteractions,
      },
    })
    return response
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useAgentOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useAgentReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Query Processing</strong> - Agent receives query and
            analyzes what needs to be done
          </li>
          <li>
            <strong>Tool Selection</strong> - Agent decides which tools to use
            based on the query
          </li>
          <li>
            <strong>Tool Execution</strong> - Tools are executed with
            appropriate parameters
          </li>
          <li>
            <strong>Result Processing</strong> - Agent processes tool results
            and decides next steps
          </li>
          <li>
            <strong>Iteration</strong> - Process repeats until task is complete
            or max iterations reached
          </li>
          <li>
            <strong>Final Answer</strong> - Agent returns the final answer based
            on all tool results
          </li>
        </ol>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Tool Definition</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Tools are defined using the OpenAI Function Calling format:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`const tool = {
  name: 'tool_name',
  description: 'What the tool does',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description',
      },
      param2: {
        type: 'number',
        description: 'Another parameter',
      },
    },
    required: ['param1'],
  },
  execute: async (args) => {
    // Tool implementation
    return { result: 'tool output' }
  },
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Limit iterations</strong> - Set maxIterations to prevent
            infinite loops
          </li>
          <li>
            <strong>Handle errors</strong> - Tools should handle errors
            gracefully
          </li>
          <li>
            <strong>Provide clear descriptions</strong> - Tool descriptions help
            agents choose correctly
          </li>
          <li>
            <strong>Validate inputs</strong> - Validate tool parameters before
            execution
          </li>
          <li>
            <strong>Monitor state</strong> - Use state.currentStep to show
            progress
          </li>
          <li>
            <strong>Track tool calls</strong> - Use state.toolCalls to debug
            agent behavior
          </li>
          <li>
            <strong>Use context</strong> - Pass relevant context to help agents
            make better decisions
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-rag-pipeline" className="docs-card">
            <h3>useRAGPipeline Hook</h3>
            <p>RAG with vector stores</p>
          </a>
          <a href="/reference/hooks/use-assistant" className="docs-card">
            <h3>useAssistant Hook</h3>
            <p>Assistant with tool calling</p>
          </a>
          <a href="/guides/agent-setup" className="docs-card">
            <h3>Agent Setup Guide</h3>
            <p>Complete agent implementation guide</p>
          </a>
          <a href="/cookbook/custom-tool-integration" className="docs-card">
            <h3>Custom Tool Integration</h3>
            <p>Tool integration patterns</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'useRAGPipeline',
          href: '/reference/hooks/use-rag-pipeline',
        }}
        next={{
          title: 'useVectorStore',
          href: '/reference/hooks/use-vector-store',
        }}
      />
    </>
  )
}
