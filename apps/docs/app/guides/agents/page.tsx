'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Pagination } from '@/components/Navigation/Pagination'

export const dynamic = 'force-dynamic'

export default function AgentsGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">Agent System Guide</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to building AI agents that can use tools, make decisions, and complete multi-step tasks
            using the ReAct (Reasoning + Acting) pattern.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            AI agents extend chatbots by giving them the ability to take actions, not just respond with text.
            Agents can call APIs, search databases, perform calculations, and execute complex multi-step workflows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 border-2 border-muted rounded-xl">
              <div className="font-semibold mb-2">💬 Chatbot (Simple)</div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div>User: "What's the weather?"</div>
                <div>Bot: "I don't have access to real-time weather data."</div>
                <div className="mt-4 text-xs text-destructive">
                  ❌ Can only respond with training data
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl">
              <div className="font-semibold mb-2 text-primary">🤖 Agent (Powerful)</div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div>User: "What's the weather?"</div>
                <div className="italic">*calls weather API*</div>
                <div>Agent: "It's 72°F and sunny in San Francisco."</div>
                <div className="mt-4 text-xs text-green-600 dark:text-green-400">
                  ✅ Can take actions and get real data
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">The ReAct Pattern</h2>
          <p className="mb-4">
            Clarity Chat agents use the ReAct (Reasoning + Acting) pattern, which follows a simple loop:
          </p>

          <EnhancedCodeBlock
            code={`1. THINK: "I need current weather data"
2. ACT: Calls get_weather("San Francisco")
3. OBSERVE: Gets { temp: 72, condition: "sunny" }
4. THINK: "Now I can answer"
5. RESPOND: "It's 72°F and sunny"`}
            language="text"
            showLineNumbers
          />

          <p className="mt-4 mb-4">
            This loop can repeat multiple times for complex tasks, allowing agents to break down problems
            into smaller steps and use tools as needed.
          </p>

          <Callout type="info">
            <p>
              <strong>ReAct Pattern:</strong> The agent alternates between reasoning (thinking about what to do)
              and acting (using tools), observing results, and repeating until it has enough information to answer.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Creating an Agent</h2>
          <p className="mb-4">
            Use <code>createAgent</code> to create an agent with tools and configuration:
          </p>

          <EnhancedCodeBlock
            code={`import { createAgent } from '@clarity-chat/react'
import type { Tool } from '@clarity-chat/react'

// Define tools
const weatherTool: Tool = {
  name: 'get_weather',
  description: 'Get current weather for a city',
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
  async execute(args) {
    const response = await fetch(\`/api/weather?location=\${args.location}\`)
    return await response.json()
  },
}

const calculatorTool: Tool = {
  name: 'calculate',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate',
      },
    },
    required: ['expression'],
  },
  async execute(args) {
    // Safe evaluation (no eval)
    return { result: evaluateMath(args.expression) }
  },
}

// Create agent
const agent = createAgent({
  name: 'ResearchAgent',
  description: 'An agent that can research topics and perform calculations',
  tools: [weatherTool, calculatorTool],
  maxIterations: 10,
  model: 'gpt-4',
  temperature: 0.7,
})`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Executing an Agent</h2>
          <p className="mb-4">
            Execute an agent query and track the execution steps:
          </p>

          <EnhancedCodeBlock
            code={`import { createAgent } from '@clarity-chat/react'
import { useState } from 'react'

function AgentExample() {
  const [execution, setExecution] = useState(null)
  const [steps, setSteps] = useState([])

  const agent = createAgent({
    name: 'ResearchAgent',
    description: 'Research agent',
    tools: [weatherTool, calculatorTool],
    maxIterations: 10,
  }, {
    onThought: (thought) => {
      console.log('Agent thinking:', thought)
    },
    onAction: (tool, args) => {
      console.log('Agent using tool:', tool, args)
      setSteps(prev => [...prev, {
        id: Date.now().toString(),
        title: \`Using \${tool}\`,
        detail: JSON.stringify(args),
        status: 'running',
        tool,
        startedAt: new Date(),
      }])
    },
    onObservation: (result) => {
      console.log('Tool result:', result)
      setSteps(prev => prev.map(step =>
        step.status === 'running'
          ? { ...step, status: 'succeeded', completedAt: new Date(), outputPreview: JSON.stringify(result).slice(0, 100) }
          : step
      ))
    },
    onAnswer: (answer) => {
      console.log('Final answer:', answer)
    },
  })

  const handleQuery = async () => {
    const exec = await agent.execute('What is the weather in San Francisco and what is 15 * 23?')
    setExecution(exec)
  }

  return (
    <div>
      <button onClick={handleQuery}>Run Agent</button>
      {execution && (
        <div>
          <p>Status: {execution.status}</p>
          <p>Answer: {execution.answer}</p>
          <p>Steps: {execution.steps.length}</p>
        </div>
      )}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Agent Run Feed</h2>
          <p className="mb-4">
            The <code>AgentRunFeed</code> component displays agent execution steps in real-time:
          </p>

          <EnhancedCodeBlock
            code={`import { AgentRunFeed } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function AgentRunFeedExample() {
  const [steps, setSteps] = useState([])

  const agent = createAgent({
    name: 'ResearchAgent',
    description: 'Research agent',
    tools: [weatherTool, calculatorTool],
  }, {
    onAction: (tool, args) => {
      setSteps(prev => [...prev, {
        id: Date.now().toString(),
        title: \`Calling \${tool}\`,
        detail: JSON.stringify(args),
        status: 'running',
        tool,
        startedAt: new Date(),
      }])
    },
    onObservation: (result) => {
      setSteps(prev => prev.map(step =>
        step.status === 'running'
          ? {
              ...step,
              status: 'succeeded',
              completedAt: new Date(),
              outputPreview: JSON.stringify(result).slice(0, 100),
            }
          : step
      ))
    },
  })

  const handleQuery = async () => {
    await agent.execute('What is the weather in San Francisco?')
  }

  return (
    <div>
      <button onClick={handleQuery}>Run Agent</button>
      <AgentRunFeed
        steps={steps}
        onRetry={(step) => {
          // Retry failed step
          console.log('Retrying:', step)
        }}
        onOpenLogs={(step) => {
          // Show detailed logs
          console.log('Logs for:', step)
        }}
      />
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Agent Execution Steps</h2>
          <p className="mb-4">
            Agent executions consist of multiple steps, each with a specific type:
          </p>

          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              <strong>thought:</strong> Agent reasoning about what to do next
            </li>
            <li>
              <strong>action:</strong> Agent calling a tool with specific arguments
            </li>
            <li>
              <strong>observation:</strong> Result from tool execution
            </li>
            <li>
              <strong>answer:</strong> Final response to the user
            </li>
          </ul>

          <EnhancedCodeBlock
            code={`interface AgentStep {
  /** Step number */
  step: number
  /** Step type */
  type: 'thought' | 'action' | 'observation' | 'answer'
  /** Step content */
  content: string
  /** Tool used (if action) */
  tool?: string
  /** Tool arguments (if action) */
  args?: Record<string, any>
  /** Tool result (if observation) */
  result?: any
  /** Error (if failed) */
  error?: string
  /** Timestamp */
  timestamp: number
}

interface AgentExecution {
  /** Execution ID */
  id: string
  /** Agent name */
  agent: string
  /** User query */
  query: string
  /** Execution steps */
  steps: AgentStep[]
  /** Final answer */
  answer?: string
  /** Status */
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  /** Start time */
  startTime: number
  /** End time */
  endTime?: number
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Tool Approval</h2>
          <p className="mb-4">
            For sensitive operations, require user approval before executing tools:
          </p>

          <EnhancedCodeBlock
            code={`import { createAgent } from '@clarity-chat/react'

const agent = createAgent({
  name: 'EmailAgent',
  description: 'Agent that can send emails',
  tools: [sendEmailTool],
}, {
  onToolApproval: async (tool, args) => {
    // Show approval UI
    if (tool.requiresApproval) {
      const approved = await showApprovalDialog({
        tool: tool.name,
        args,
        description: \`The agent wants to send an email to \${args.to}\`,
      })
      return approved
    }
    return true // Auto-approve safe tools
  },
})

// Tool with approval requirement
const sendEmailTool: Tool = {
  name: 'send_email',
  description: 'Send an email',
  requiresApproval: true, // Requires user approval
  parameters: {
    type: 'object',
    properties: {
      to: { type: 'string' },
      subject: { type: 'string' },
      body: { type: 'string' },
    },
    required: ['to', 'subject', 'body'],
  },
  async execute(args) {
    // Send email
    return { sent: true }
  },
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Safety & Guardrails</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Validate Tool Arguments</h3>
          <p className="mb-4">
            Always validate tool arguments before execution to prevent errors and security issues:
          </p>

          <EnhancedCodeBlock
            code={`const sendEmailTool: Tool = {
  name: 'send_email',
  description: 'Send an email',
  async execute(args) {
    // Validate email
    if (!isValidEmail(args.to)) {
      throw new Error('Invalid email address')
    }
    
    // Prevent sending to external domains
    if (!args.to.endsWith('@yourcompany.com')) {
      throw new Error('Can only email internal users')
    }
    
    // Validate subject length
    if (args.subject.length > 200) {
      throw new Error('Subject too long (max 200 characters)')
    }
    
    // Execute
    return await sendEmail(args)
  },
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">2. Set Iteration Limits</h3>
          <p className="mb-4">
            Prevent infinite loops by setting maximum iterations:
          </p>

          <EnhancedCodeBlock
            code={`const agent = createAgent({
  name: 'ResearchAgent',
  description: 'Research agent',
  tools: [searchTool, calculatorTool],
  maxIterations: 10, // Prevent infinite loops
})`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">3. Require Approval for Dangerous Actions</h3>
          <EnhancedCodeBlock
            code={`const dangerousTools = ['delete_user', 'send_email', 'charge_card', 'update_database']

const agent = createAgent({
  name: 'AdminAgent',
  description: 'Admin agent',
  tools: [deleteUserTool, sendEmailTool],
}, {
  onToolApproval: async (tool, args) => {
    if (dangerousTools.includes(tool.name)) {
      const approved = await showApprovalDialog({
        tool: tool.name,
        args,
        warning: 'This action cannot be undone',
      })
      return approved
    }
    return true // Auto-approve safe tools
  },
})`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Set Timeouts</h3>
          <EnhancedCodeBlock
            code={`const agent = createAgent({
  name: 'ResearchAgent',
  description: 'Research agent',
  tools: [searchTool],
  maxIterations: 10,
})

// Execute with timeout
const execution = await Promise.race([
  agent.execute(query),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Execution timeout')), 30000)
  ),
])`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Complete Example</h2>
          <p className="mb-4">
            Here's a complete example of an agent with tool approval, error handling, and UI:
          </p>

          <EnhancedCodeBlock
            code={`import { useState } from 'react'
import { createAgent, AgentRunFeed } from '@clarity-chat/react'
import type { Tool, AgentRunStep } from '@clarity-chat/react'

function CompleteAgentExample() {
  const [steps, setSteps] = useState<AgentRunStep[]>([])
  const [execution, setExecution] = useState(null)
  const [pendingApproval, setPendingApproval] = useState(null)

  // Define tools
  const weatherTool: Tool = {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City name' },
      },
      required: ['location'],
    },
    async execute(args) {
      const response = await fetch(\`/api/weather?location=\${args.location}\`)
      if (!response.ok) throw new Error('Weather API failed')
      return await response.json()
    },
  }

  const sendEmailTool: Tool = {
    name: 'send_email',
    description: 'Send an email',
    requiresApproval: true,
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string' },
      },
      required: ['to', 'subject', 'body'],
    },
    async execute(args) {
      // Validate
      if (!isValidEmail(args.to)) {
        throw new Error('Invalid email address')
      }
      // Send email
      return { sent: true }
    },
  }

  // Create agent
  const agent = createAgent({
    name: 'AssistantAgent',
    description: 'Helpful assistant that can check weather and send emails',
    tools: [weatherTool, sendEmailTool],
    maxIterations: 10,
  }, {
    onThought: (thought) => {
      console.log('Thinking:', thought)
    },
    onAction: (tool, args) => {
      setSteps(prev => [...prev, {
        id: Date.now().toString(),
        title: \`Using \${tool}\`,
        detail: JSON.stringify(args),
        status: 'running',
        tool,
        startedAt: new Date(),
      }])
    },
    onObservation: (result) => {
      setSteps(prev => prev.map(step =>
        step.status === 'running'
          ? {
              ...step,
              status: 'succeeded',
              completedAt: new Date(),
              outputPreview: JSON.stringify(result).slice(0, 100),
            }
          : step
      ))
    },
    onAnswer: (answer) => {
      console.log('Answer:', answer)
    },
    onError: (error) => {
      console.error('Agent error:', error)
      setSteps(prev => prev.map(step =>
        step.status === 'running'
          ? { ...step, status: 'failed', completedAt: new Date() }
          : step
      ))
    },
    onToolApproval: async (tool, args) => {
      if (tool.requiresApproval) {
        return new Promise((resolve) => {
          setPendingApproval({ tool, args, resolve })
        })
      }
      return true
    },
  })

  const handleQuery = async () => {
    setSteps([])
    const exec = await agent.execute('What is the weather in San Francisco?')
    setExecution(exec)
  }

  const handleApprove = () => {
    if (pendingApproval) {
      pendingApproval.resolve(true)
      setPendingApproval(null)
    }
  }

  const handleReject = () => {
    if (pendingApproval) {
      pendingApproval.resolve(false)
      setPendingApproval(null)
    }
  }

  return (
    <div className="space-y-4">
      <button onClick={handleQuery}>Run Agent</button>

      {pendingApproval && (
        <div className="p-4 border rounded-lg bg-yellow-50">
          <p>Approve tool execution?</p>
          <p>Tool: {pendingApproval.tool.name}</p>
          <p>Args: {JSON.stringify(pendingApproval.args)}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleReject}>Reject</button>
          </div>
        </div>
      )}

      <AgentRunFeed
        steps={steps}
        onRetry={(step) => {
          console.log('Retrying step:', step)
        }}
        onOpenLogs={(step) => {
          console.log('Logs for step:', step)
        }}
      />

      {execution && (
        <div>
          <p>Status: {execution.status}</p>
          {execution.answer && <p>Answer: {execution.answer}</p>}
          {execution.error && <p>Error: {execution.error}</p>}
        </div>
      )}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Start Simple</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Start with 2-3 simple tools</li>
            <li>Add more tools gradually as needed</li>
            <li>Test each tool independently before giving to agent</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">2. Write Clear Tool Descriptions</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Be specific about when to use the tool</li>
            <li>Include examples in descriptions when helpful</li>
            <li>Describe parameters clearly</li>
            <li>Mark required parameters explicitly</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">3. Show Agent Work</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use <code>AgentRunFeed</code> to show execution steps</li>
            <li>Display tool calls and results transparently</li>
            <li>Show progress for long-running tasks</li>
            <li>Provide retry options for failed steps</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Handle Errors Gracefully</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Validate all tool arguments</li>
            <li>Provide clear error messages</li>
            <li>Allow retry for transient failures</li>
            <li>Log errors for debugging</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">5. Set Appropriate Limits</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Set <code>maxIterations</code> to prevent infinite loops</li>
            <li>Set timeouts for tool execution</li>
            <li>Limit tool execution time</li>
            <li>Monitor token usage</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">6. Security Considerations</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Require approval for dangerous operations</li>
            <li>Validate and sanitize all inputs</li>
            <li>Implement rate limiting</li>
            <li>Log all tool executions for audit trails</li>
            <li>Use authentication for sensitive tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a href="/reference/components/agent-run-feed" className="text-primary underline">
                AgentRunFeed Component
              </a> – Display agent execution steps
            </li>
            <li>
              <a href="/reference/components/tool-invocation-card" className="text-primary underline">
                ToolInvocationCard Component
              </a> – Tool approval UI
            </li>
            <li>
              <a href="/guides/tool-integration" className="text-primary underline">
                Tool Integration Guide
              </a> – Comprehensive tool integration guide
            </li>
            <li>
              <a href="/reference/hooks/use-clarity-chat-with-tools" className="text-primary underline">
                useClarityChatWithTools Hook
              </a> – Chat hook with tool support
            </li>
          </ul>
        </section>

        <Pagination
          previous={{
            title: 'Tool Integration Guide',
            href: '/guides/tool-integration',
          }}
          next={{
            title: 'RAG Pipeline Guide',
            href: '/guides/rag',
          }}
        />
      </div>
    </>
  )
}
