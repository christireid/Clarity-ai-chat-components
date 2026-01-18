// TODO: ToolInvocationCard is planned but not yet implemented in @clarity-chat/react.
// This page documents the intended API and features.

'use client'

import { useState, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import { ToolInvocationCard } from '@clarity-chat/react'
// import type { ToolCall } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Placeholder type definition until component is implemented
interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

// Placeholder demo component - shows Coming Soon notice
function BasicToolCardDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">ToolInvocationCard is planned but not yet implemented.</p>
      </div>
    </div>
  )
}

// Placeholder demo component
function ToolCardWithApprovalDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">Approval workflow will be available when ToolInvocationCard is implemented.</p>
      </div>
    </div>
  )
}

const toolInvocationCardProps: Prop[] = [
  {
    name: 'toolCall',
    type: 'ToolCall',
    required: true,
    description: 'Tool call object containing function name and arguments.',
  },
  {
    name: 'status',
    type: '"pending" | "approved" | "rejected" | "executing" | "success" | "error"',
    default: '"pending"',
    description:
      'Current status of the tool call. Determines badge color and available actions.',
  },
  {
    name: 'result',
    type: 'any',
    description:
      'Tool execution result. Displayed in expandable section when available.',
  },
  {
    name: 'error',
    type: 'string',
    description:
      'Error message if tool execution failed. Displayed with error styling.',
  },
  {
    name: 'requiresApproval',
    type: 'boolean',
    default: 'false',
    description:
      'Show approve/reject buttons. When true, tool requires user approval before execution.',
  },
  {
    name: 'onApprove',
    type: '(toolCall: ToolCall) => void',
    description:
      'Callback when user approves the tool call. Only shown when requiresApproval is true.',
  },
  {
    name: 'onReject',
    type: '(toolCall: ToolCall) => void',
    description:
      'Callback when user rejects the tool call. Only shown when requiresApproval is true.',
  },
  {
    name: 'onRetry',
    type: '(toolCall: ToolCall) => void',
    description:
      'Callback to retry a failed tool call. Shows retry button when status is "error".',
  },
  {
    name: 'formatArguments',
    type: 'boolean',
    default: 'true',
    description:
      'Format JSON arguments with indentation for better readability.',
  },
  {
    name: 'expandableResult',
    type: 'boolean',
    default: 'true',
    description:
      'Show result in expandable section. When false, result is always visible.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the card container.',
  },
]

export default function ToolInvocationCardPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>ToolInvocationCard</h1>

        <p className="lead">
          A component for displaying tool/function calls with approval workflow,
          execution status, and result visualization. Perfect for showing AI
          agent tool usage in conversations.
        </p>

        <Callout type="warning" className="mb-6">
          <p>
            <strong>Coming Soon:</strong> ToolInvocationCard is planned but not yet implemented
            in @clarity-chat/react. This page documents the intended API and features.
          </p>
        </Callout>

        <Callout type="info">
          <p>
            ToolInvocationCard is used to display individual tool calls. For
            displaying multiple agent steps, use{' '}
            <a href="/reference/components/agent-run-feed">AgentRunFeed</a>. For
            rendering tool results with custom UI, use{' '}
            <a href="/reference/components/clarity-tool-result">
              ClarityToolResult
            </a>
            .
          </p>
        </Callout>

        <ViewInStorybook component="ToolInvocationCard" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try approving a tool call and watch it execute! See how the status
            changes through the workflow.
          </p>
          <CodePlayground
            initialCode={`// ToolInvocationCard is coming soon!
// This playground will be functional once the component is implemented.

function Example() {
  const toolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco' }),
    },
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <p className="text-center text-muted-foreground py-8">
        ToolInvocationCard coming soon...
      </p>
      {/* Once implemented:
      <ToolInvocationCard
        toolCall={toolCall}
        status="pending"
        requiresApproval
        onApprove={() => console.log('Approved')}
        onReject={() => console.log('Rejected')}
      />
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
import { ToolInvocationCard } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          ToolInvocationCard displays a tool call with its function name and
          arguments:
        </p>

        <ComponentPreview
          title="Simple Tool Card"
          description="Basic tool call display"
          code={`import { ToolInvocationCard } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/react'

function SimpleToolCard() {
  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco', unit: 'celsius' }),
    },
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status="pending"
    />
  )
}`}
        >
          <BasicToolCardDemo />
        </ComponentPreview>

        <h2 id="approval-workflow">Approval Workflow</h2>

        <p>
          Enable approval workflow to require user confirmation before tool
          execution:
        </p>

        <ComponentPreview
          title="With Approval Workflow"
          description="Tool call requiring user approval"
          code={`import { ToolInvocationCard } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function ToolWithApproval() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'executing' | 'success'>('pending')
  const [result, setResult] = useState<any>(null)

  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'search_database',
      arguments: JSON.stringify({ query: 'customer data' }),
    },
  }

  const handleApprove = useCallback(() => {
    setStatus('approved')
    // Execute tool
    setTimeout(() => {
      setStatus('executing')
      // Simulate execution
      setTimeout(() => {
        setStatus('success')
        setResult({ results: [] })
      }, 2000)
    }, 500)
  }, [])

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      result={result}
      requiresApproval
      onApprove={handleApprove}
      onReject={() => console.log('Rejected')}
    />
  )
}`}
        >
          <ToolCardWithApprovalDemo />
        </ComponentPreview>

        <h2 id="status-states">Status States</h2>

        <p>
          ToolInvocationCard supports multiple status states with appropriate
          visual indicators:
        </p>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard } from '@clarity-chat/react'

// Pending - awaiting approval
<ToolInvocationCard
  toolCall={toolCall}
  status="pending"
  requiresApproval
/>

// Approved - ready to execute
<ToolInvocationCard
  toolCall={toolCall}
  status="approved"
/>

// Executing - currently running
<ToolInvocationCard
  toolCall={toolCall}
  status="executing"
/>

// Success - completed successfully
<ToolInvocationCard
  toolCall={toolCall}
  status="success"
  result={{ data: 'result' }}
/>

// Error - execution failed
<ToolInvocationCard
  toolCall={toolCall}
  status="error"
  error="Failed to connect to API"
  onRetry={() => console.log('Retry')}
/>`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            <strong>Status Badge Colors:</strong>
          </p>
          <ul>
            <li>
              <strong>pending/rejected:</strong> Warning (yellow)
            </li>
            <li>
              <strong>approved/executing:</strong> Info (blue)
            </li>
            <li>
              <strong>success:</strong> Success (green)
            </li>
            <li>
              <strong>error:</strong> Destructive (red)
            </li>
          </ul>
        </Callout>

        <h2 id="props">Props</h2>

        <PropsTable props={toolInvocationCardProps} />

        <h2 id="tool-call-type">ToolCall Type</h2>

        <p>
          The <code>ToolCall</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="accessibility">Accessibility</h2>

        <p>ToolInvocationCard is built with accessibility in mind:</p>

        <ul>
          <li>Semantic HTML structure</li>
          <li>ARIA labels for all interactive elements</li>
          <li>Keyboard navigation for buttons</li>
          <li>Status announcements for screen readers</li>
          <li>Focus management</li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/agent-run-feed">AgentRunFeed</a> -
            Display multiple agent execution steps
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
            - Display streaming responses with tool calls
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat-with-tools">
              useClarityChatWithTools
            </a>{' '}
            - Hook for tool-enabled chat
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'StreamingMessage',
            href: '/reference/components/streaming-message',
          }}
          next={{
            title: 'AgentRunFeed',
            href: '/reference/components/agent-run-feed',
          }}
        />
      </>
    </ToastProvider>
  )
}
