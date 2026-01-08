import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Advanced Agent Workflow - Cookbook',
  description:
    'Build multi-step agent workflows with tool calling and decision trees.',
}

export default function AdvancedAgentWorkflowCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Advanced Agent Workflow</h1>
        <p className="docs-lead">
          Create sophisticated AI agents with tool calling, parallel execution,
          and error recovery.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Build agents that can use multiple tools, reason about their actions,
          and execute complex multi-step workflows with proper error handling.
        </p>
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <CodePlayground
          code={`function ResearchAgent() {
  const tools = [
    {
      name: 'web_search',
      description: 'Search the web for information',
      parameters: {
        query: { type: 'string', required: true }
      }
    },
    {
      name: 'calculator',
      description: 'Perform calculations',
      parameters: {
        expression: { type: 'string', required: true }
      }
    },
    {
      name: 'get_weather',
      description: 'Get weather for a location',
      parameters: {
        location: { type: 'string', required: true }
      }
    }
  ]

  const { messages, isRunning, currentStep, sendMessage } = useAgent({
    endpoint: '/api/agent',
    tools,
    maxIterations: 10,
    onToolCall: (tool, args) => {
      logger.debug(\`Calling \${tool}:\`, args)
    }
  })

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isRunning}
        />
      </div>
      <div>
        <AgentRunFeed
          currentStep={currentStep}
          showLogs={true}
        />
      </div>
    </div>
  )
}

render(<ResearchAgent />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Agent API Implementation</h2>
        <pre>
          <code>{`// app/api/agent/route.ts
import { ReactAgent } from '@clarity-chat/react/agents'
import { tools } from './tools'

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  const agent = new ReactAgent({
    model: 'gpt-4',
    tools,
    maxIterations: 10,
    systemPrompt: \`You are a helpful research assistant.
Think step by step and use tools when needed.\`
  })
  
  try {
    const result = await agent.run({
      input: messages[messages.length - 1].content,
      userId
    })
    
    return Response.json({
      message: result.output,
      steps: result.steps,
      toolCalls: result.toolCalls
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Tool Definitions</h2>
        <pre>
          <code>{`// app/api/agent/tools.ts
export const tools = {
  web_search: async ({ query }: { query: string }) => {
    const response = await fetch(
      \`https://api.tavily.com/search\`,
      {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 
          'Authorization': \`Bearer \${process.env.TAVILY_API_KEY}\` 
        }
      }
    )
    const data = await response.json()
    return data.results.slice(0, 5).map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet
    }))
  },

  calculator: async ({ expression }: { expression: string }) => {
    // Safe eval implementation
    const result = evalMathExpression(expression)
    return { result, expression }
  },

  get_weather: async ({ location }: { location: string }) => {
    const response = await fetch(
      \`https://api.openweathermap.org/data/2.5/weather?q=\${location}\`,
      { headers: { 'X-API-Key': process.env.WEATHER_API_KEY } }
    )
    return await response.json()
  }
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Parallel Tool Execution</h2>
        <Callout type="tip" title="Performance">
          Execute independent tool calls in parallel to reduce total latency.
        </Callout>
        <pre>
          <code>{`const agent = new ReactAgent({
  model: 'gpt-4',
  tools,
  parallelExecution: true, // Enable parallel tool calls
  maxConcurrency: 3 // Limit concurrent tools
})

// The agent will automatically parallelize independent tool calls
const result = await agent.run({
  input: 'Get weather for SF, NYC, and Boston'
})
// All 3 weather calls execute in parallel`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Error Recovery</h2>
        <pre>
          <code>{`const agent = new ReactAgent({
  model: 'gpt-4',
  tools,
  errorRecovery: {
    maxRetries: 3,
    backoffMs: 1000,
    fallbackStrategy: 'skip' // or 'retry', 'fail'
  },
  onError: (error, toolName, attempt) => {
    console.error(\`Tool \${toolName} failed (attempt \${attempt}):\`, error)
  }
})`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Provide clear, specific tool descriptions for better agent reasoning
          </li>
          <li>
            Set <code>maxIterations</code> to prevent infinite loops
          </li>
          <li>Implement timeout and rate limiting for tool calls</li>
          <li>Log all tool executions for debugging and audit trails</li>
          <li>Use parallel execution for independent tools</li>
          <li>Handle partial failures gracefully with fallback strategies</li>
          <li>Validate tool parameters before execution</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/agent-with-tools" className="docs-card">
            <h3>Simple Agent with Tools</h3>
            <p>Getting started with agents</p>
          </a>
          <a href="/guides/agents" className="docs-card">
            <h3>Agent Guide</h3>
            <p>Complete agent documentation</p>
          </a>
        </div>
      </section>
    </div>
  )
}
