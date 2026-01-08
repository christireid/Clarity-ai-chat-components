'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, ToolInvocationCard } from '@clarity-chat/react/internal'
import type { ToolCall } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicToolCardDemo() {
  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco', unit: 'celsius' }),
    },
  }

  return (
    <div className="w-full max-w-2xl">
      <ToolInvocationCard
        toolCall={toolCall}
        status="pending"
        requiresApproval
      />
    </div>
  )
}

// With approval demo
function ToolCardWithApprovalDemo() {
  const [status, setStatus] = useState<
    'pending' | 'approved' | 'executing' | 'success'
  >('pending')
  const [result, setResult] = useState<any>(null)

  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'search_database',
      arguments: JSON.stringify({ query: 'customer data', limit: 10 }),
    },
  }

  const handleApprove = useCallback(() => {
    setStatus('approved')
    setTimeout(() => {
      setStatus('executing')
      setTimeout(() => {
        setStatus('success')
        setResult({ results: [{ id: 1, name: 'Customer 1' }] })
      }, 2000)
    }, 500)
  }, [])

  const handleReject = useCallback(() => {
    logger.debug('Tool rejected')
  }, [])

  return (
    <div className="w-full max-w-2xl">
      <ToolInvocationCard
        toolCall={toolCall}
        status={status}
        result={result}
        requiresApproval
        onApprove={handleApprove}
        onReject={handleReject}
      />
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
            initialCode={`function Example() {
  const toolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco' }),
    },
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status="pending"
      requiresApproval
      onApprove={() => logger.debug('Approved')}
      onReject={() => logger.debug('Rejected')}
    />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'
import type { ToolCall } from '@clarity-chat/react/internal'
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
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'
import type { ToolCall } from '@clarity-chat/react/internal'

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
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'
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
      onReject={() => logger.debug('Rejected')}
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
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'

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
  onRetry={() => logger.debug('Retry')}
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

        <h2 id="with-results">Displaying Results</h2>

        <p>Show tool execution results in an expandable section:</p>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'

function ToolWithResult() {
  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'get_weather',
      arguments: JSON.stringify({ location: 'San Francisco' }),
    },
  }

  const result = {
    location: 'San Francisco',
    temperature: 18,
    condition: 'Sunny',
    humidity: 65,
  }

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status="success"
      result={result}
      expandableResult={true} // Result is expandable (default)
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="error-handling">Error Handling</h2>

        <p>Display error messages and provide retry functionality:</p>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'

function ToolWithError() {
  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'api_call',
      arguments: JSON.stringify({ endpoint: '/api/data' }),
    },
  }

  const handleRetry = useCallback(() => {
    // Retry the tool call
    logger.debug('Retrying tool call...')
  }, [])

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status="error"
      error="Network error: Failed to connect to server"
      onRetry={handleRetry}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="custom-formatting">Custom Argument Formatting</h2>

        <p>Control how arguments are displayed:</p>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard } from '@clarity-chat/react/internal'

// Formatted JSON (default)
<ToolInvocationCard
  toolCall={toolCall}
  formatArguments={true} // Pretty-print JSON
/>

// Raw JSON string
<ToolInvocationCard
  toolCall={toolCall}
  formatArguments={false} // Show raw string
/>`}
          language="tsx"
          showLineNumbers
        />

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

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useCallback } from 'react'
import { ToolInvocationCard } from '@clarity-chat/react/internal'
import type { ToolCall } from '@clarity-chat/react/internal'

function CompleteToolCard() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'executing' | 'success' | 'error'>('pending')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const toolCall: ToolCall = {
    id: 'call-1',
    type: 'function',
    function: {
      name: 'process_payment',
      arguments: JSON.stringify({
        amount: 100,
        currency: 'USD',
        paymentMethod: 'card',
      }),
    },
  }

  const handleApprove = useCallback(async () => {
    setStatus('approved')
    
    try {
      setStatus('executing')
      
      // Execute tool
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        body: JSON.parse(toolCall.function.arguments),
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      const data = await response.json()
      setStatus('success')
      setResult(data)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [toolCall])

  const handleRetry = useCallback(() => {
    setError(undefined)
    handleApprove()
  }, [handleApprove])

  return (
    <ToolInvocationCard
      toolCall={toolCall}
      status={status}
      result={result}
      error={error}
      requiresApproval
      onApprove={handleApprove}
      onReject={() => {
        setStatus('rejected')
      }}
      onRetry={handleRetry}
      formatArguments
      expandableResult
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The API endpoint{' '}
            <code>/api/process-payment</code> is a placeholder. You'll need to
            implement your own backend endpoint for tool execution.
          </p>
        </Callout>

        <h2 id="integration-with-streaming">Integration with Streaming</h2>

        <p>ToolInvocationCard works seamlessly with streaming messages:</p>

        <EnhancedCodeBlock
          code={`import { ToolInvocationCard, StreamingMessage } from '@clarity-chat/react/internal'
import { useStreamingSSE } from '@clarity-chat/react/internal'

function StreamingWithTools() {
  const { toolCalls, content } = useStreamingSSE({ api: '/api/stream' })

  return (
    <div className="space-y-4">
      <StreamingMessage content={content} toolCalls={toolCalls} />
      
      {toolCalls.map((toolCall) => (
        <ToolInvocationCard
          key={toolCall.id}
          toolCall={toolCall}
          status="pending"
          requiresApproval
          onApprove={(tool) => {
            // Execute tool
          }}
        />
      ))}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="accessibility">Accessibility</h2>

        <p>ToolInvocationCard is built with accessibility in mind:</p>

        <ul>
          <li>✅ Semantic HTML structure</li>
          <li>✅ ARIA labels for all interactive elements</li>
          <li>✅ Keyboard navigation for buttons</li>
          <li>✅ Status announcements for screen readers</li>
          <li>✅ Focus management</li>
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
