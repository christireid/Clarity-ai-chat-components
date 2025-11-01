import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tool Invocation Card | Clarity Chat',
  description: 'Display function/tool calls with approval flow, execution status, and result visualization.'
}

export default function ToolInvocationCardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Tool Invocation Card</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Interactive card for displaying AI tool/function calls with approval workflow and result visualization.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Six status states: pending, approved, rejected, executing, success, error</li>
          <li>Approval workflow with approve/reject buttons</li>
          <li>Color-coded status indicators and icons</li>
          <li>Formatted JSON display for function arguments</li>
          <li>Expandable result section for output visualization</li>
          <li>Retry functionality for failed executions</li>
          <li>Loading animations during execution</li>
          <li>Framer Motion animations for smooth transitions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { ToolInvocationCard } from '@clarity-chat/react'

const toolCall = {
  id: 'call_123',
  function: { name: 'search', arguments: '{"query":"AI"}' },
  type: 'function'
}

<ToolInvocationCard
  toolCall={toolCall}
  status="pending"
  requiresApproval
  onApprove={(call) => executeToolCall(call)}
  onReject={(call) => console.log('Rejected', call)}
  formatArguments
  expandableResult
/>`}</code></pre>
        </div>
      </section>
    </div>
  )
}