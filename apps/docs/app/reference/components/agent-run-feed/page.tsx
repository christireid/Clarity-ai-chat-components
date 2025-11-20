import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Agent Run Feed - Clarity Chat Components',
  description: 'Display AI agent execution steps showing tool calls, reasoning, and multi-step workflows.',
}

export default function AgentRunFeedPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Agent Run Feed</h1>
        <p className="docs-lead">
          Watch an AI agent work in real-time. See each step it takes - calling tools, processing data, making decisions. Like watching a robot think.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          AI agents (like LangChain agents or OpenAI Assistants) take multiple steps to solve problems. This component shows those steps as they happen - perfect for debugging or showing users "what's happening behind the scenes."
        </p>
        
        <Callout type="info" title="What's an AI Agent?">
          An agent can use tools (call APIs, search databases, run code) to solve problems.
          Unlike simple chatbots, agents make plans and take multiple steps. This shows those steps.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function SimpleAgentFeed() {
  const steps = [
    {
      id: '1',
      title: 'Planning',
      detail: 'Analyzing user request and determining required tools',
      status: 'succeeded',
      startedAt: new Date('2024-11-03T10:00:00'),
      completedAt: new Date('2024-11-03T10:00:01')
    },
    {
      id: '2',
      title: 'Searching knowledge base',
      detail: 'Query: "customer support best practices"',
      status: 'succeeded',
      tool: 'vector_search',
      startedAt: new Date('2024-11-03T10:00:01'),
      completedAt: new Date('2024-11-03T10:00:03')
    },
    {
      id: '3',
      title: 'Generating response',
      detail: 'Synthesizing answer from search results',
      status: 'succeeded',
      startedAt: new Date('2024-11-03T10:00:03'),
      completedAt: new Date('2024-11-03T10:00:06')
    }
  ]

  return (
    <AgentRunFeed steps={steps} />
  )
}

render(<SimpleAgentFeed />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Live Agent Execution</h2>
        <CodePlayground
          initialCode={`import { useState, useEffect } from 'react'

function LiveAgentExecution() {
  const [steps, setSteps] = useState([])

  useEffect(() => {
    // Simulate agent executing steps
    const sequence = [
      {
        id: '1',
        title: 'Received request',
        status: 'running',
        startedAt: new Date(),
        delay: 0
      },
      {
        id: '2',
        title: 'Calling weather API',
        tool: 'weather_api',
        status: 'running',
        startedAt: new Date(),
        delay: 1000
      },
      {
        id: '3',
        title: 'Calling calendar API',
        tool: 'calendar_api',
        status: 'running',
        startedAt: new Date(),
        delay: 2500
      },
      {
        id: '4',
        title: 'Generating recommendation',
        status: 'running',
        startedAt: new Date(),
        delay: 4000
      }
    ]

    sequence.forEach((step, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, {
          ...step,
          status: 'running'
        }])

        // Mark as succeeded after a bit
        setTimeout(() => {
          setSteps(prev => prev.map(s =>
            s.id === step.id
              ? {
                  ...s,
                  status: 'succeeded',
                  completedAt: new Date(),
                  detail: \`Step \${i + 1} completed successfully\`
                }
              : s
          ))
        }, 800)
      }, step.delay)
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-sm font-medium">Agent Status</div>
        <div className="text-xs text-muted-foreground">
          {steps.length} / 4 steps completed
        </div>
      </div>
      
      <AgentRunFeed
        steps={steps}
        title="Weather Planning Agent"
        subtitle="Checking weather and calendar to suggest best meeting time"
      />
    </div>
  )
}

render(<LiveAgentExecution />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Failed Steps and Retry</h2>
        <CodePlayground
          initialCode={`import { useState } from 'react'

function FailureHandling() {
  const [steps, setSteps] = useState([
    {
      id: '1',
      title: 'Database query',
      detail: 'SELECT * FROM users WHERE active=true',
      status: 'succeeded',
      tool: 'postgres',
      startedAt: new Date('2024-11-03T10:00:00'),
      completedAt: new Date('2024-11-03T10:00:02')
    },
    {
      id: '2',
      title: 'External API call',
      detail: 'Failed to connect to api.example.com',
      status: 'failed',
      tool: 'rest_api',
      startedAt: new Date('2024-11-03T10:00:02'),
      completedAt: new Date('2024-11-03T10:00:05')
    }
  ])

  const handleRetry = (step) => {
    console.log('Retrying:', step.title)
    // Mark as running
    setSteps(prev => prev.map(s =>
      s.id === step.id ? { ...s, status: 'running', detail: 'Retrying...' } : s
    ))

    // Simulate success after delay
    setTimeout(() => {
      setSteps(prev => prev.map(s =>
        s.id === step.id
          ? {
              ...s,
              status: 'succeeded',
              detail: 'Connected successfully on retry',
              completedAt: new Date()
            }
          : s
      ))
    }, 2000)
  }

  const handleOpenLogs = (step) => {
    alert(\`Logs for: \${step.title}\\n\\nTool: \${step.tool}\\nStatus: \${step.status}\\nDetail: \${step.detail}\`)
  }

  return (
    <AgentRunFeed
      steps={steps}
      onRetry={handleRetry}
      onOpenLogs={handleOpenLogs}
    />
  )
}

render(<FailureHandling />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="AgentRunFeed Props" data={agentProps} />
      </section>

      <section className="docs-section">
        <h2>Integration with LangChain</h2>
        <pre><code>{`// Stream agent steps from LangChain
import { AgentRunFeed } from '@clarity-chat/react'
import { AgentExecutor } from 'langchain/agents'

function LangChainAgent() {
  const [steps, setSteps] = useState([])

  const runAgent = async (query: string) => {
    const executor = new AgentExecutor({ ... })

    // Stream intermediate steps
    for await (const step of executor.stream(query)) {
      if (step.intermediateSteps) {
        setSteps(prev => [...prev, {
          id: Date.now().toString(),
          title: step.tool,
          detail: step.input,
          status: step.status,
          tool: step.tool,
          startedAt: new Date(step.startTime),
          completedAt: step.endTime ? new Date(step.endTime) : undefined
        }])
      }
    }
  }

  return <AgentRunFeed steps={steps} />
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Update steps in real-time as agent executes</li>
          <li>Show tool names so users understand what's happening</li>
          <li>Include timing information for performance debugging</li>
          <li>Provide retry for failed steps</li>
          <li>Add log viewing for detailed debugging</li>
        </ul>

        <Callout type="tip" title="UX Consideration">
          For end users, you might want to hide this by default and show a simple
          loading spinner. Expose this view in "advanced" or "debug" mode.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/conversation-timeline" className="docs-card">
            <h3>Conversation Timeline</h3>
            <p>Complete conversation history</p>
          </a>
          <a href="/reference/components/tool-invocation-card" className="docs-card">
            <h3>Tool Invocation Card</h3>
            <p>Individual tool call details</p>
          </a>
          <a href="/reference/components/thinking-indicator" className="docs-card">
            <h3>Thinking Indicator</h3>
            <p>Simple "AI is thinking" loader</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const agentProps = [
  {
    name: 'steps',
    type: 'AgentRunStep[]',
    required: true,
    description: 'Array of agent execution steps'
  },
  {
    name: 'onRetry',
    type: '(step: AgentRunStep) => void',
    required: false,
    description: 'Callback to retry failed steps'
  },
  {
    name: 'onOpenLogs',
    type: '(step: AgentRunStep) => void',
    required: false,
    description: 'Callback to view detailed logs'
  },
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Agent execution feed'",
    description: 'Feed heading'
  },
  {
    name: 'subtitle',
    type: 'string',
    required: false,
    description: 'Feed description'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  }
]

