// TODO: AgentRunFeed and AgentRunStep are planned but not yet implemented in @clarity-chat/react.
// This page documents the intended API and features.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import { AgentRunFeed } from '@clarity-chat/react'
// import type { AgentRunStep } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Placeholder type definition until component is implemented
interface AgentRunStep {
  id: string
  title: string
  detail?: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  tool?: string
  startedAt: Date
  completedAt?: Date
  outputPreview?: string
}

// Placeholder demo component - shows Coming Soon notice
function BasicAgentFeedDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">AgentRunFeed is planned but not yet implemented.</p>
      </div>
    </div>
  )
}

// Placeholder demo component
function LiveAgentFeedDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">Live agent execution will be available when AgentRunFeed is implemented.</p>
      </div>
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

        <Callout type="warning" className="mb-6">
          <p>
            <strong>Coming Soon:</strong> AgentRunFeed is planned but not yet implemented
            in @clarity-chat/react. This page documents the intended API and features.
          </p>
        </Callout>

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
            initialCode={`// AgentRunFeed is coming soon!
// This playground will be functional once the component is implemented.

function Example() {
  const [steps, setSteps] = React.useState([])

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <p className="text-center text-muted-foreground py-8">
        AgentRunFeed coming soon...
      </p>
      {/* Once implemented:
      <AgentRunFeed steps={steps} />
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
import { AgentRunFeed } from '@clarity-chat/react'
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
          <li>Semantic HTML structure (ordered list)</li>
          <li>ARIA labels for status indicators</li>
          <li>Keyboard navigation for buttons</li>
          <li>Screen reader announcements for status changes</li>
          <li>Focus management</li>
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
