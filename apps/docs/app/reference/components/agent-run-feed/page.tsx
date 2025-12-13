'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastProvider, AgentRunFeed } from '@clarity-chat/react'
import type { AgentRunStep } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicAgentFeedDemo() {
  const [steps] = useState<AgentRunStep[]>([
    {
      id: '1',
      title: 'Analyzing request',
      detail: 'Understanding user intent and requirements',
      status: 'succeeded',
      startedAt: new Date(Date.now() - 5000),
      completedAt: new Date(Date.now() - 4000),
    },
    {
      id: '2',
      title: 'Searching knowledge base',
      detail: 'Query: "customer support best practices"',
      status: 'succeeded',
      tool: 'vector_search',
      startedAt: new Date(Date.now() - 4000),
      completedAt: new Date(Date.now() - 2000),
    },
    {
      id: '3',
      title: 'Generating response',
      detail: 'Synthesizing answer from search results',
      status: 'succeeded',
      startedAt: new Date(Date.now() - 2000),
      completedAt: new Date(),
    },
  ])

  return (
    <div className="w-full max-w-2xl">
      <AgentRunFeed steps={steps} />
    </div>
  )
}

// Live execution demo
function LiveAgentFeedDemo() {
  const [steps, setSteps] = useState<AgentRunStep[]>([])

  useEffect(() => {
    const sequence: Array<
      Omit<AgentRunStep, 'id' | 'startedAt' | 'completedAt'> & { delay: number }
    > = [
      {
        title: 'Planning',
        detail: 'Breaking down the task into steps',
        status: 'running',
        delay: 0,
      },
      {
        title: 'Calling weather API',
        detail: 'Fetching current weather data',
        status: 'running',
        tool: 'weather_api',
        delay: 1000,
      },
      {
        title: 'Calling calendar API',
        detail: 'Checking available time slots',
        status: 'running',
        tool: 'calendar_api',
        delay: 2500,
      },
      {
        title: 'Generating recommendation',
        detail: 'Combining data to create suggestion',
        status: 'running',
        delay: 4000,
      },
    ]

    sequence.forEach((step, i) => {
      setTimeout(() => {
        const newStep: AgentRunStep = {
          id: `step-${i + 1}`,
          ...step,
          startedAt: new Date(),
        }
        setSteps((prev) => [...prev, newStep])

        // Mark as succeeded after delay
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === newStep.id
                ? {
                    ...s,
                    status: 'succeeded' as const,
                    completedAt: new Date(),
                    outputPreview: `Step ${i + 1} completed successfully`,
                  }
                : s
            )
          )
        }, 800)
      }, step.delay)
    })
  }, [])

  return (
    <div className="w-full max-w-2xl">
      <AgentRunFeed
        steps={steps}
        title="Weather Planning Agent"
        subtitle="Checking weather and calendar to suggest best meeting time"
      />
    </div>
  )
}

const agentRunFeedProps: Prop[] = [
  {
    name: 'steps',
    type: 'AgentRunStep[]',
    required: true,
    description:
      'Array of agent execution steps. Each step represents one action in the agent workflow.',
  },
  {
    name: 'onRetry',
    type: '(step: AgentRunStep) => void',
    description:
      'Callback when user retries a failed step. Shows retry button for failed steps.',
  },
  {
    name: 'onOpenLogs',
    type: '(step: AgentRunStep) => void',
    description:
      'Callback when user opens detailed logs for a step. Shows "View logs" button.',
  },
  {
    name: 'title',
    type: 'string',
    default: '"Agent execution feed"',
    description: 'Title displayed at the top of the feed.',
  },
  {
    name: 'subtitle',
    type: 'string',
    default:
      '"Observe how the orchestrator called tools, merged evidence, and delivered the final answer."',
    description: 'Subtitle/description displayed below the title.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function AgentRunFeedPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>AgentRunFeed</h1>

        <p className="lead">
          Display AI agent execution steps in real-time, showing tool calls,
          reasoning, and multi-step workflows. Perfect for debugging agents or
          showing users what's happening behind the scenes.
        </p>

        <Callout type="info">
          <p>
            <strong>What's an AI Agent?</strong> An agent can use tools (call
            APIs, search databases, run code) to solve problems. Unlike simple
            chatbots, agents make plans and take multiple steps. AgentRunFeed
            visualizes these steps as they happen.
          </p>
        </Callout>

        <ViewInStorybook component="AgentRunFeed" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Watch an agent execute steps in real-time! See how it progresses
            through the workflow.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const [steps, setSteps] = React.useState([])

  React.useEffect(() => {
    const sequence = [
      { id: '1', title: 'Planning', status: 'running', startedAt: new Date(), delay: 0 },
      { id: '2', title: 'Calling API', tool: 'weather_api', status: 'running', startedAt: new Date(), delay: 1000 },
    ]

    sequence.forEach((step) => {
      setTimeout(() => {
        setSteps(prev => [...prev, step])
        setTimeout(() => {
          setSteps(prev => prev.map(s =>
            s.id === step.id ? { ...s, status: 'succeeded', completedAt: new Date() } : s
          ))
        }, 800)
      }, step.delay)
    })
  }, [])

  return <AgentRunFeed steps={steps} />
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { AgentRunFeed } from '@clarity-chat/react'
import type { AgentRunStep } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          AgentRunFeed displays a list of agent execution steps with status
          indicators:
        </p>

        <ComponentPreview
          title="Simple Agent Feed"
          description="Basic agent execution steps"
          code={`import { AgentRunFeed } from '@clarity-chat/react'
import type { AgentRunStep } from '@clarity-chat/react'

function SimpleAgentFeed() {
  const steps: AgentRunStep[] = [
    {
      id: '1',
      title: 'Analyzing request',
      detail: 'Understanding user intent',
      status: 'succeeded',
      startedAt: new Date(Date.now() - 5000),
      completedAt: new Date(Date.now() - 4000),
    },
    {
      id: '2',
      title: 'Searching knowledge base',
      status: 'succeeded',
      tool: 'vector_search',
      startedAt: new Date(Date.now() - 4000),
      completedAt: new Date(Date.now() - 2000),
    },
  ]

  return <AgentRunFeed steps={steps} />
}`}
        >
          <BasicAgentFeedDemo />
        </ComponentPreview>

        <h2 id="live-execution">Live Agent Execution</h2>

        <p>Update steps in real-time as the agent executes:</p>

        <ComponentPreview
          title="Live Execution"
          description="Real-time step updates as agent executes"
          code={`import { AgentRunFeed } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function LiveAgentExecution() {
  const [steps, setSteps] = useState<AgentRunStep[]>([])

  useEffect(() => {
    // Simulate agent executing steps
    const sequence = [
      {
        id: '1',
        title: 'Planning',
        status: 'running',
        startedAt: new Date(),
        delay: 0,
      },
      {
        id: '2',
        title: 'Calling weather API',
        tool: 'weather_api',
        status: 'running',
        startedAt: new Date(),
        delay: 1000,
      },
    ]

    sequence.forEach((step, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, step])
        
        // Mark as succeeded after delay
        setTimeout(() => {
          setSteps(prev => prev.map(s =>
            s.id === step.id
              ? { ...s, status: 'succeeded', completedAt: new Date() }
              : s
          ))
        }, 800)
      }, step.delay)
    })
  }, [])

  return (
    <AgentRunFeed
      steps={steps}
      title="Weather Planning Agent"
      subtitle="Checking weather and calendar"
    />
  )
}`}
        >
          <LiveAgentFeedDemo />
        </ComponentPreview>

        <h2 id="with-retry">With Retry and Logs</h2>

        <p>Enable retry for failed steps and log viewing:</p>

        <EnhancedCodeBlock
          code={`import { AgentRunFeed } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function AgentWithRetry() {
  const [steps, setSteps] = useState<AgentRunStep[]>([
    {
      id: '1',
      title: 'Database query',
      detail: 'SELECT * FROM users',
      status: 'succeeded',
      tool: 'postgres',
      startedAt: new Date(Date.now() - 5000),
      completedAt: new Date(Date.now() - 3000),
    },
    {
      id: '2',
      title: 'External API call',
      detail: 'Failed to connect to api.example.com',
      status: 'failed',
      tool: 'rest_api',
      startedAt: new Date(Date.now() - 3000),
      completedAt: new Date(Date.now() - 1000),
    },
  ])

  const handleRetry = useCallback((step: AgentRunStep) => {
    // Mark as running
    setSteps(prev => prev.map(s =>
      s.id === step.id
        ? { ...s, status: 'running', detail: 'Retrying...' }
        : s
    ))

    // Simulate retry
    setTimeout(() => {
      setSteps(prev => prev.map(s =>
        s.id === step.id
          ? {
              ...s,
              status: 'succeeded',
              detail: 'Connected successfully on retry',
              completedAt: new Date(),
            }
          : s
      ))
    }, 2000)
  }, [])

  const handleOpenLogs = useCallback((step: AgentRunStep) => {
    // Open logs modal or navigate to logs page
    console.log('Logs for:', step)
  }, [])

  return (
    <AgentRunFeed
      steps={steps}
      onRetry={handleRetry}
      onOpenLogs={handleOpenLogs}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="status-indicators">Status Indicators</h2>

        <p>Each step displays a status badge with appropriate colors:</p>

        <ul>
          <li>
            <strong>pending:</strong> Queued (blue badge, spinner icon)
          </li>
          <li>
            <strong>running:</strong> In progress (blue badge, pulsing icon)
          </li>
          <li>
            <strong>succeeded:</strong> Completed (green badge, checkmark icon)
          </li>
          <li>
            <strong>failed:</strong> Failed (red badge, X icon)
          </li>
        </ul>

        <h2 id="step-details">Step Details</h2>

        <p>Steps can include additional information:</p>

        <EnhancedCodeBlock
          code={`import { AgentRunFeed } from '@clarity-chat/react'

function DetailedSteps() {
  const steps: AgentRunStep[] = [
    {
      id: '1',
      title: 'Searching database',
      detail: 'Query: SELECT * FROM products WHERE category = "electronics"',
      status: 'succeeded',
      tool: 'postgres',
      startedAt: new Date(),
      completedAt: new Date(),
      outputPreview: 'Found 42 products',
    },
  ]

  return <AgentRunFeed steps={steps} />
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={agentRunFeedProps} />

        <h2 id="agent-run-step-type">AgentRunStep Type</h2>

        <p>
          The <code>AgentRunStep</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface AgentRunStep {
  id: string
  title: string
  detail?: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  tool?: string
  startedAt: Date
  completedAt?: Date
  outputPreview?: string
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="integration-with-langchain">Integration with LangChain</h2>

        <p>Stream agent steps from LangChain:</p>

        <EnhancedCodeBlock
          code={`import { AgentRunFeed } from '@clarity-chat/react'
import { AgentExecutor } from 'langchain/agents'
import { useState } from 'react'

function LangChainAgent() {
  const [steps, setSteps] = useState<AgentRunStep[]>([])

  const runAgent = async (query: string) => {
    const executor = new AgentExecutor({
      // Your agent configuration
    })

    // Stream intermediate steps
    for await (const step of executor.stream(query)) {
      if (step.intermediateSteps) {
        setSteps(prev => [...prev, {
          id: Date.now().toString(),
          title: step.tool || 'Processing',
          detail: step.input,
          status: step.status === 'error' ? 'failed' : 'succeeded',
          tool: step.tool,
          startedAt: new Date(step.startTime),
          completedAt: step.endTime ? new Date(step.endTime) : undefined,
        }])
      }
    }
  }

  return <AgentRunFeed steps={steps} />
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useEffect, useCallback } from 'react'
import { AgentRunFeed } from '@clarity-chat/react'
import type { AgentRunStep } from '@clarity-chat/react'

function CompleteAgentFeed() {
  const [steps, setSteps] = useState<AgentRunStep[]>([])

  useEffect(() => {
    // Simulate agent execution
    const executeAgent = async () => {
      // Step 1: Planning
      setSteps([{
        id: '1',
        title: 'Planning',
        detail: 'Analyzing request and determining required tools',
        status: 'running',
        startedAt: new Date(),
      }])

      await new Promise(resolve => setTimeout(resolve, 1000))

      setSteps(prev => prev.map(s =>
        s.id === '1'
          ? { ...s, status: 'succeeded', completedAt: new Date() }
          : s
      ))

      // Step 2: Tool call
      setSteps(prev => [...prev, {
        id: '2',
        title: 'Calling weather API',
        detail: 'Fetching weather for San Francisco',
        status: 'running',
        tool: 'weather_api',
        startedAt: new Date(),
      }])

      await new Promise(resolve => setTimeout(resolve, 2000))

      setSteps(prev => prev.map(s =>
        s.id === '2'
          ? {
              ...s,
              status: 'succeeded',
              completedAt: new Date(),
              outputPreview: 'Temperature: 18°C, Condition: Sunny',
            }
          : s
      ))

      // Step 3: Final response
      setSteps(prev => [...prev, {
        id: '3',
        title: 'Generating response',
        detail: 'Combining results into final answer',
        status: 'running',
        startedAt: new Date(),
      }])

      await new Promise(resolve => setTimeout(resolve, 1500))

      setSteps(prev => prev.map(s =>
        s.id === '3'
          ? { ...s, status: 'succeeded', completedAt: new Date() }
          : s
      ))
    }

    executeAgent()
  }, [])

  const handleRetry = useCallback((step: AgentRunStep) => {
    // Retry logic
    console.log('Retrying step:', step.id)
  }, [])

  const handleOpenLogs = useCallback((step: AgentRunStep) => {
    // Open logs
    console.log('Opening logs for:', step.id)
  }, [])

  return (
    <AgentRunFeed
      steps={steps}
      title="Weather Assistant Agent"
      subtitle="Checking weather and generating recommendations"
      onRetry={handleRetry}
      onOpenLogs={handleOpenLogs}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Update in real-time:</strong> Update steps as the agent
            executes for best UX
          </li>
          <li>
            <strong>Show tool names:</strong> Include <code>tool</code> property
            so users understand what's happening
          </li>
          <li>
            <strong>Include timing:</strong> Provide <code>startedAt</code> and{' '}
            <code>completedAt</code> for performance debugging
          </li>
          <li>
            <strong>Provide retry:</strong> Enable retry for failed steps to
            improve reliability
          </li>
          <li>
            <strong>Add log viewing:</strong> Provide detailed logs for
            debugging complex issues
          </li>
        </ul>

        <Callout type="tip">
          <p>
            <strong>UX Consideration:</strong> For end users, you might want to
            hide this by default and show a simple loading spinner. Expose this
            view in "advanced" or "debug" mode.
          </p>
        </Callout>

        <h2 id="accessibility">Accessibility</h2>

        <p>AgentRunFeed is built with accessibility in mind:</p>

        <ul>
          <li>✅ Semantic HTML structure (ordered list)</li>
          <li>✅ ARIA labels for status indicators</li>
          <li>✅ Keyboard navigation for buttons</li>
          <li>✅ Screen reader announcements for status changes</li>
          <li>✅ Focus management</li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/tool-invocation-card">
              ToolInvocationCard
            </a>{' '}
            - Individual tool call details
          </li>
          <li>
            <a href="/reference/components/clarity-tool-result">
              ClarityToolResult
            </a>{' '}
            - Render tool results with custom UI
          </li>
          <li>
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            - Display streaming responses
          </li>
          <li>
            <a href="/reference/components/thinking-indicator">
              ThinkingIndicator
            </a>{' '}
            - Simple "AI is thinking" loader
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'ToolInvocationCard',
            href: '/reference/components/tool-invocation-card',
          }}
          next={{
            title: 'ClarityToolResult',
            href: '/reference/components/clarity-tool-result',
          }}
        />
      </>
    </ToastProvider>
  )
}
