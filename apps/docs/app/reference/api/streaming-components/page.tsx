import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Streaming Components API Reference - Clarity Chat',
  description: 'Complete API reference for streaming components: StreamingMessage, ToolInvocationCard, CitationCard, and ModelSelector.',
}

export default function StreamingComponentsAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Streaming Components API</h1>
        <p className="docs-lead">
          Complete API reference for streaming components: StreamingMessage, ToolInvocationCard, CitationCard, and ModelSelector.
        </p>
      </div>

      <section className="docs-section">
        <h2>StreamingMessage</h2>
        <p>
          Renders AI responses with real-time streaming, tool calls, citations, and thinking steps.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface StreamingMessageProps {
  /** Message content (plain text or JSON) */
  content: string
  
  /** Whether currently streaming */
  isStreaming?: boolean
  
  /** Tool/function calls */
  toolCalls?: ToolCall[]
  
  /** RAG citations */
  citations?: Citation[]
  
  /** Chain-of-thought thinking steps */
  thinkingSteps?: string[]
  
  /** Error message */
  error?: Error | string
  
  /** Show thinking steps section */
  showThinking?: boolean
  
  /** Show citations section */
  showCitations?: boolean
  
  /** Show tool calls section */
  showTools?: boolean
  
  /** Retry callback for errors */
  onRetry?: () => void
  
  /** Additional CSS classes */
  className?: string
}`}
        />

        <h3>Example</h3>
        <CodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

<StreamingMessage
  content={streamingText}
  isStreaming={true}
  toolCalls={toolCalls}
  citations={citations}
  thinkingSteps={thinkingSteps}
  showThinking
  showTools
  showCitations
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>ToolInvocationCard</h2>
        <p>
          Displays function/tool invocations with approval workflow.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface ToolInvocationCardProps {
  /** Tool call data */
  toolCall: ToolCall
  
  /** Current status */
  status?: ToolStatus
  
  /** Execution result */
  result?: unknown
  
  /** Error if execution failed */
  error?: Error | string
  
  /** Requires user approval */
  requiresApproval?: boolean
  
  /** Approval callback */
  onApprove?: (tool: ToolCall) => void | Promise<void>
  
  /** Rejection callback */
  onReject?: (tool: ToolCall) => void
  
  /** Retry callback for errors */
  onRetry?: (tool: ToolCall) => void
  
  /** Additional CSS classes */
  className?: string
}

type ToolStatus = 
  | 'pending'    // Waiting for approval
  | 'approved'   // Approved, not yet executed
  | 'rejected'   // User rejected
  | 'executing'  // Currently running
  | 'success'    // Completed successfully
  | 'error'      // Failed with error`}
        />
      </section>

      <section className="docs-section">
        <h2>CitationCard</h2>
        <p>
          Displays RAG sources with confidence scores and metadata.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface CitationCardProps {
  /** Citation data */
  citation: Citation
  
  /** Start expanded */
  defaultExpanded?: boolean
  
  /** Preview text length */
  previewLength?: number
  
  /** Show confidence badge */
  showConfidence?: boolean
  
  /** Additional CSS classes */
  className?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>ModelSelector</h2>
        <p>
          Visual selector for switching between AI models.
        </p>

        <h3>Props</h3>
        <CodeBlock
          language="typescript"
          code={`interface ModelSelectorProps {
  /** Available models */
  models: ModelMetadata[]
  
  /** Selected model ID */
  value: string
  
  /** Selection callback */
  onChange: (modelId: string, config: ModelConfig) => void
  
  /** Show speed/cost/quality badges */
  showMetrics?: boolean
  
  /** Disabled state */
  disabled?: boolean
  
  /** Additional CSS classes */
  className?: string
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/streaming">Streaming Guide</a> - Learn about streaming</li>
          <li><a href="/reference/api/model-adapters">Model Adapters API</a> - Adapter reference</li>
          <li><a href="/examples/streaming">Examples</a> - See streaming in action</li>
        </ul>
      </section>
    </div>
  )
}
