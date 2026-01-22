'use client'

import { useState } from 'react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ChainOfThought, useChainOfThought } from '@clarity-chat/react'
import type { ChainOfThoughtStep } from '@clarity-chat/react'

// Demo component
function ChainOfThoughtDemo() {
  const { steps, addStep, updateStep } = useChainOfThought({
    initialSteps: [
      {
        id: '1',
        title: 'Analyzing query',
        content: 'Understanding the user\'s request and breaking down the problem into manageable steps.',
        status: 'complete',
        duration: 1200,
      },
      {
        id: '2',
        title: 'Searching knowledge base',
        content: 'Querying relevant documents and previous conversations to gather context.',
        status: 'complete',
        duration: 2500,
      },
      {
        id: '3',
        title: 'Generating response',
        content: 'Formulating a comprehensive answer based on the gathered information.',
        status: 'in-progress',
        progress: 65,
      },
      {
        id: '4',
        title: 'Verifying accuracy',
        content: 'Cross-checking facts and ensuring response quality.',
        status: 'pending',
      },
    ],
  })

  return (
    <div className="w-full max-w-2xl">
      <ChainOfThought
        steps={steps}
        title="AI Reasoning Process"
        subtitle="See how the AI thinks through your request"
        showTimestamps
        showDuration
        variant="default"
      />
    </div>
  )
}

const chainOfThoughtProps: Prop[] = [
  {
    name: 'steps',
    type: 'ChainOfThoughtStep[]',
    required: true,
    description: 'Array of reasoning steps to display. Each step includes id, title, content, status, and optional metadata.',
  },
  {
    name: 'expanded',
    type: 'boolean',
    default: 'false',
    description: 'Whether all steps are expanded by default. When true, all step contents are visible.',
  },
  {
    name: 'expandedSteps',
    type: 'string[]',
    description: 'Controlled array of expanded step IDs for precise control over which steps are visible.',
  },
  {
    name: 'onExpandedStepsChange',
    type: '(stepIds: string[]) => void',
    description: 'Callback when expanded steps change. Used for controlled component pattern.',
  },
  {
    name: 'onStepClick',
    type: '(stepId: string) => void',
    description: 'Callback when a step is clicked. Useful for custom interactions.',
  },
  {
    name: 'onRetry',
    type: '(stepId: string) => void',
    description: 'Callback when retry is requested for error steps. Enables retry button on failed steps.',
  },
  {
    name: 'variant',
    type: '"default" | "compact" | "detailed" | "minimal"',
    default: '"default"',
    description: 'Visual variant of the component. Controls size, spacing, and information density.',
  },
  {
    name: 'showTimestamps',
    type: 'boolean',
    default: 'false',
    description: 'Display timestamps for each step.',
  },
  {
    name: 'showStepNumbers',
    type: 'boolean',
    default: 'false',
    description: 'Show numbered badges instead of status icons.',
  },
  {
    name: 'showDuration',
    type: 'boolean',
    default: 'true',
    description: 'Show duration for completed steps.',
  },
  {
    name: 'maxVisibleSteps',
    type: 'number',
    description: 'Maximum steps to show before "show more" button appears.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Header title for the reasoning chain.',
  },
  {
    name: 'subtitle',
    type: 'string',
    description: 'Header subtitle for additional context.',
  },
  {
    name: 'showToggleAll',
    type: 'boolean',
    default: 'true',
    description: 'Show "expand all" / "collapse all" button in the header.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the steps container.',
  },
  {
    name: 'containerClassName',
    type: 'string',
    description: 'CSS classes for the outer container.',
  },
  {
    name: 'stepClassName',
    type: 'string',
    description: 'CSS classes for individual step items.',
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations for accessibility or performance.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Show skeleton loading state.',
  },
  {
    name: 'emptyMessage',
    type: 'string',
    default: '"No reasoning steps available"',
    description: 'Message to display when there are no steps.',
  },
]

export default function ChainOfThoughtPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ChainOfThought</h1>

      <p className="lead">
        Visualize step-by-step AI reasoning with collapsible sections, progress indicators,
        and streaming support. Perfect for showing users how an AI arrives at its conclusions.
      </p>

      <Callout type="info">
        <p>
          This component is inspired by modern AI systems that expose their reasoning process,
          helping users understand and trust AI decision-making.
        </p>
      </Callout>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ChainOfThought, useChainOfThought } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <p>
        ChainOfThought displays a sequence of reasoning steps with expandable content.
        Each step can have a status (pending, in-progress, complete, error) and optional progress.
      </p>

      <ComponentPreview
        title="Basic Chain of Thought"
        description="Simple reasoning visualization with multiple steps"
        code={`import { ChainOfThought } from '@clarity-chat/react'

function Example() {
  const steps = [
    {
      id: '1',
      title: 'Analyzing query',
      content: 'Breaking down the user request into components.',
      status: 'complete',
      duration: 1200,
    },
    {
      id: '2',
      title: 'Searching knowledge',
      content: 'Looking through documents and context.',
      status: 'complete',
      duration: 2500,
    },
    {
      id: '3',
      title: 'Generating answer',
      content: 'Formulating response based on findings.',
      status: 'in-progress',
      progress: 65,
    },
  ]

  return (
    <ChainOfThought
      steps={steps}
      showDuration
    />
  )
}`}
      >
        <ChainOfThoughtDemo />
      </ComponentPreview>

      <h2 id="with-hook">With useChainOfThought Hook</h2>

      <p>
        Use the <code>useChainOfThought</code> hook for dynamic step management:
      </p>

      <EnhancedCodeBlock
        code={`import { ChainOfThought, useChainOfThought } from '@clarity-chat/react'

function Example() {
  const { steps, addStep, updateStep, isProcessing } = useChainOfThought()

  const handleProcess = async () => {
    // Add initial step
    addStep({
      id: '1',
      title: 'Starting analysis',
      content: '',
      status: 'in-progress',
    })

    // Update step as processing continues
    setTimeout(() => {
      updateStep('1', {
        content: 'Analysis complete',
        status: 'complete',
        duration: 1500,
      })

      // Add next step
      addStep({
        id: '2',
        title: 'Generating response',
        content: '',
        status: 'in-progress',
      })
    }, 1500)
  }

  return (
    <ChainOfThought
      steps={steps}
      title="Processing Request"
      showDuration
      showToggleAll
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="variants">Variants</h2>

      <p>
        ChainOfThought comes in four variants to match your design needs:
      </p>

      <EnhancedCodeBlock
        code={`// Default - balanced information density
<ChainOfThought steps={steps} variant="default" />

// Compact - minimal spacing for dense layouts
<ChainOfThought steps={steps} variant="compact" />

// Detailed - shows all metadata and sub-steps
<ChainOfThought steps={steps} variant="detailed" />

// Minimal - essential information only
<ChainOfThought steps={steps} variant="minimal" />`}
        language="tsx"
      />

      <h2 id="nested-steps">Nested Steps</h2>

      <p>
        Steps can contain sub-steps for hierarchical reasoning:
      </p>

      <EnhancedCodeBlock
        code={`const steps = [
  {
    id: '1',
    title: 'Data Analysis',
    content: 'Analyzing input data...',
    status: 'complete',
    subSteps: [
      {
        id: '1-1',
        title: 'Parse input',
        content: 'Validating structure',
        status: 'complete',
      },
      {
        id: '1-2',
        title: 'Extract features',
        content: 'Identifying key patterns',
        status: 'complete',
      },
    ],
  },
]`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="streaming">Streaming Updates</h2>

      <p>
        Update steps in real-time as AI processes:
      </p>

      <EnhancedCodeBlock
        code={`function StreamingExample() {
  const { steps, updateStep } = useChainOfThought({
    initialSteps: [
      { id: '1', title: 'Thinking', content: '', status: 'in-progress' }
    ]
  })

  // Simulate streaming updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateStep('1', (prev) => ({
        content: prev.content + ' thinking...',
        progress: Math.min((prev.progress || 0) + 10, 100),
      }))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return <ChainOfThought steps={steps} />
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="error-handling">Error Handling</h2>

      <p>
        Display errors and provide retry functionality:
      </p>

      <EnhancedCodeBlock
        code={`function Example() {
  const handleRetry = (stepId: string) => {
    // Retry logic here
    console.log('Retrying step:', stepId)
  }

  const steps = [
    {
      id: '1',
      title: 'Database query',
      content: 'Attempting to query database...',
      status: 'error',
      error: 'Connection timeout after 30s',
    },
  ]

  return (
    <ChainOfThought
      steps={steps}
      onRetry={handleRetry}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="props">Props</h2>

      <PropsTable props={chainOfThoughtProps} />

      <h2 id="step-type">ChainOfThoughtStep Type</h2>

      <EnhancedCodeBlock
        code={`interface ChainOfThoughtStep {
  /** Unique identifier */
  id: string
  /** Step title/label */
  title: string
  /** Step content/reasoning text */
  content: string
  /** Current status */
  status: 'pending' | 'in-progress' | 'complete' | 'error' | 'skipped'
  /** Optional icon override */
  icon?: React.ReactNode
  /** Optional timestamp */
  timestamp?: Date
  /** Duration in milliseconds (for completed steps) */
  duration?: number
  /** Progress percentage (0-100, for in-progress steps) */
  progress?: number
  /** Optional metadata to display */
  metadata?: Record<string, string | number | boolean>
  /** Nested sub-steps */
  subSteps?: ChainOfThoughtStep[]
  /** Error message (when status is 'error') */
  error?: string
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Full keyboard navigation support</li>
        <li>✅ ARIA labels and roles for screen readers</li>
        <li>✅ Expandable sections with proper ARIA attributes</li>
        <li>✅ Status announcements for screen readers</li>
        <li>✅ Reduced motion support</li>
        <li>✅ Focus management</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/thinking-bar">ThinkingBar</a> - Processing status indicator
        </li>
        <li>
          <a href="/reference/components/tool-execution-card">ToolExecutionCard</a> - Tool call display
        </li>
        <li>
          <a href="/reference/components/streaming-progress">StreamingProgress</a> - Progress tracking
        </li>
      </ul>
    </>
  )
}
