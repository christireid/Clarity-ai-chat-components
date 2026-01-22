'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ToolExecutionCard } from '@clarity-chat/react'

const toolExecutionCardProps: Prop[] = [
  {
    name: 'tool',
    type: 'ToolExecution',
    required: true,
    description: 'Tool execution data including id, name, status, input/output, and timing.',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback when retry button is clicked (shown for error status).',
  },
  {
    name: 'onCancel',
    type: '() => void',
    description: 'Callback when cancel button is clicked (shown for executing status).',
  },
  {
    name: 'defaultInputExpanded',
    type: 'boolean',
    default: 'false',
    description: 'Whether input section is expanded by default.',
  },
  {
    name: 'defaultOutputExpanded',
    type: 'boolean',
    default: 'true',
    description: 'Whether output section is expanded by default.',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Custom icon to display instead of default tool icon.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
  {
    name: 'compact',
    type: 'boolean',
    default: 'false',
    description: 'Compact mode for inline display with reduced spacing.',
  },
  {
    name: 'showTimestamps',
    type: 'boolean',
    default: 'false',
    description: 'Show start and end timestamps.',
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations.',
  },
]

export default function ToolExecutionCardPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ToolExecutionCard</h1>

      <p className="lead">
        Display tool call execution status with input/output visualization, duration timer,
        and action buttons. Perfect for showing function calling in AI chat interfaces.
      </p>

      <Callout type="info">
        <p>
          ToolExecutionCard provides real-time feedback on tool/function executions,
          making it easy for users to understand what actions the AI is performing.
        </p>
      </Callout>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ToolExecutionCard, useToolExecution } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { ToolExecutionCard } from '@clarity-chat/react'

function Example() {
  const tool = {
    id: 'tool_123',
    name: 'web_search',
    description: 'Search the web for information',
    status: 'executing',
    input: { query: 'React hooks best practices' },
    output: null,
    startTime: new Date(),
  }

  return (
    <ToolExecutionCard
      tool={tool}
      onCancel={() => console.log('Cancelled')}
    />
  )
}`}
        language="tsx"
      />

      <h2 id="statuses">Tool Statuses</h2>

      <p>
        ToolExecutionCard supports four execution statuses:
      </p>

      <EnhancedCodeBlock
        code={`// Pending - tool queued for execution
const pending = {
  id: '1',
  name: 'calculate',
  status: 'pending',
  input: { expression: '2 + 2' },
  output: null,
}

// Executing - tool currently running
const executing = {
  id: '2',
  name: 'web_search',
  status: 'executing',
  input: { query: 'weather NYC' },
  output: null,
  startTime: new Date(),
}

// Complete - tool finished successfully
const complete = {
  id: '3',
  name: 'get_weather',
  status: 'complete',
  input: { location: 'NYC' },
  output: { temp: 72, condition: 'sunny' },
  startTime: new Date(Date.now() - 2000),
  endTime: new Date(),
}

// Error - tool execution failed
const error = {
  id: '4',
  name: 'send_email',
  status: 'error',
  input: { to: 'user@example.com' },
  output: null,
  error: 'SMTP server unreachable',
  startTime: new Date(Date.now() - 1000),
  endTime: new Date(),
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-hook">With useToolExecution Hook</h2>

      <EnhancedCodeBlock
        code={`import { ToolExecutionCard, useToolExecution } from '@clarity-chat/react'

function Example() {
  const toolExecution = useToolExecution({
    initialTool: {
      name: 'web_search',
      description: 'Search the web',
      input: { query: 'AI news' },
    },
    autoStart: true,
  })

  const handleExecute = async () => {
    toolExecution.start()

    try {
      const result = await fetch('/api/tools/search', {
        method: 'POST',
        body: JSON.stringify(toolExecution.tool.input),
      })
      const data = await result.json()
      toolExecution.complete(data)
    } catch (error) {
      toolExecution.fail(error.message)
    }
  }

  return (
    <ToolExecutionCard
      tool={toolExecution.tool}
      onRetry={handleExecute}
      onCancel={() => toolExecution.reset()}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="input-output">Input/Output Display</h2>

      <p>
        Tool input and output are displayed in collapsible sections with JSON formatting:
      </p>

      <EnhancedCodeBlock
        code={`<ToolExecutionCard
  tool={{
    id: '1',
    name: 'calculator',
    status: 'complete',
    input: {
      operation: 'add',
      numbers: [42, 58],
    },
    output: {
      result: 100,
      duration: 12,
    },
    startTime: new Date(Date.now() - 500),
    endTime: new Date(),
  }}
  defaultInputExpanded={true}
  defaultOutputExpanded={true}
/>`}
        language="tsx"
      />

      <h2 id="live-timer">Live Duration Timer</h2>

      <p>
        ToolExecutionCard automatically updates the duration timer every 100ms during execution:
      </p>

      <EnhancedCodeBlock
        code={`<ToolExecutionCard
  tool={{
    id: '1',
    name: 'long_running_task',
    status: 'executing',
    input: { data: 'large dataset' },
    output: null,
    startTime: new Date(), // Live timer starts
  }}
/>`}
        language="tsx"
      />

      <h2 id="error-handling">Error Handling</h2>

      <p>
        Display errors with retry functionality:
      </p>

      <EnhancedCodeBlock
        code={`function Example() {
  const handleRetry = () => {
    // Retry tool execution
    console.log('Retrying...')
  }

  return (
    <ToolExecutionCard
      tool={{
        id: '1',
        name: 'api_call',
        status: 'error',
        input: { endpoint: '/data' },
        output: null,
        error: 'Network timeout after 30s',
        startTime: new Date(Date.now() - 30000),
        endTime: new Date(),
      }}
      onRetry={handleRetry}
    />
  )
}`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={toolExecutionCardProps} />

      <h2 id="tool-type">ToolExecution Type</h2>

      <EnhancedCodeBlock
        code={`interface ToolExecution {
  /** Unique identifier */
  id: string
  /** Tool name (e.g., 'web_search', 'calculator') */
  name: string
  /** Human-readable description */
  description?: string
  /** Current execution status */
  status: 'pending' | 'executing' | 'complete' | 'error'
  /** Input parameters */
  input: Record<string, unknown> | null
  /** Output result */
  output: unknown | null
  /** Error message if status is 'error' */
  error?: string
  /** Timestamp when execution started */
  startTime?: Date
  /** Timestamp when execution completed */
  endTime?: Date
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Proper ARIA labels and roles</li>
        <li>✅ Keyboard navigation for expand/collapse</li>
        <li>✅ Screen reader announcements for status changes</li>
        <li>✅ Focus management for action buttons</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/chain-of-thought">ChainOfThought</a> - Reasoning visualization
        </li>
        <li>
          <a href="/reference/components/thinking-bar">ThinkingBar</a> - Processing status
        </li>
        <li>
          <a href="/examples/tool-calling-showcase">Tool Calling Showcase</a> - Full example
        </li>
      </ul>
    </>
  )
}
