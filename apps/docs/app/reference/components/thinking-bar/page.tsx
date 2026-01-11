'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ThinkingBar, useThinkingBar } from '@clarity-chat/react/internal'

// Demo component
function ThinkingBarDemo() {
  const thinking = useThinkingBar({ initialStatus: 'thinking' })

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ThinkingBar
        status="thinking"
        message="Analyzing your request..."
        progress={35}
      />
      <ThinkingBar
        status="searching"
        message="Searching knowledge base..."
        progress={60}
        variant="detailed"
      />
      <ThinkingBar
        status="generating"
        message="Generating response..."
        progress={85}
        variant="default"
      />
    </div>
  )
}

const thinkingBarProps: Prop[] = [
  {
    name: 'status',
    type: '"idle" | "thinking" | "searching" | "generating" | "complete" | "error"',
    required: true,
    description: 'Current processing status. Determines the icon, color, and default message.',
  },
  {
    name: 'message',
    type: 'string',
    description: 'Custom message to display. Overrides default status message.',
  },
  {
    name: 'progress',
    type: 'number',
    description: 'Progress percentage (0-100). When not provided, shows indeterminate animation.',
  },
  {
    name: 'variant',
    type: '"default" | "minimal" | "detailed"',
    default: '"default"',
    description: 'Visual variant. Minimal shows just icon+text, detailed shows full stats.',
  },
  {
    name: 'estimatedTime',
    type: 'number',
    description: 'Estimated time remaining in seconds. Displayed in detailed variant.',
  },
  {
    name: 'showDots',
    type: 'boolean',
    default: 'true',
    description: 'Show animated dots next to the message.',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    description: 'Force indeterminate progress animation. Auto-detected when progress is undefined.',
  },
  {
    name: 'onComplete',
    type: '() => void',
    description: 'Callback when status changes to "complete".',
  },
  {
    name: 'disableAnimations',
    type: 'boolean',
    default: 'false',
    description: 'Disable all animations.',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Custom icon override.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function ThinkingBarPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ThinkingBar</h1>

      <p className="lead">
        Show AI processing status with an animated progress bar. Perfect for displaying
        thinking, searching, and generating states during AI operations.
      </p>

      <Callout type="info">
        <p>
          ThinkingBar provides visual feedback during AI processing with multiple status states,
          progress tracking, and smooth animations.
        </p>
      </Callout>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { ThinkingBar, useThinkingBar } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <ComponentPreview
        title="Basic Thinking Bar"
        description="Simple progress indicator for AI processing"
        code={`import { ThinkingBar } from '@clarity-chat/react/internal'

function Example() {
  return (
    <ThinkingBar
      status="thinking"
      message="Processing your request..."
      progress={45}
    />
  )
}`}
      >
        <ThinkingBarDemo />
      </ComponentPreview>

      <h2 id="status-states">Status States</h2>

      <p>
        ThinkingBar supports six status states, each with its own icon and color:
      </p>

      <EnhancedCodeBlock
        code={`// Idle - ready state
<ThinkingBar status="idle" />

// Thinking - analyzing/processing
<ThinkingBar status="thinking" message="Analyzing query..." />

// Searching - looking up information
<ThinkingBar status="searching" message="Searching database..." />

// Generating - creating response
<ThinkingBar status="generating" message="Generating answer..." />

// Complete - finished successfully
<ThinkingBar status="complete" message="Done!" />

// Error - something went wrong
<ThinkingBar status="error" message="Failed to process" />`}
        language="tsx"
      />

      <h2 id="with-hook">With useThinkingBar Hook</h2>

      <p>
        Manage thinking state with the <code>useThinkingBar</code> hook:
      </p>

      <EnhancedCodeBlock
        code={`import { ThinkingBar, useThinkingBar } from '@clarity-chat/react/internal'

function Example() {
  const thinking = useThinkingBar()

  const handleSubmit = async () => {
    thinking.startThinking('Analyzing request...')
    thinking.setProgress(25)

    await doSomething()

    thinking.startSearching('Finding relevant data...')
    thinking.setProgress(50)

    await searchData()

    thinking.startGenerating('Creating response...')
    thinking.setProgress(75)

    await generate()

    thinking.complete('All done!')
  }

  return (
    <>
      <ThinkingBar
        status={thinking.status}
        message={thinking.message}
        progress={thinking.progress}
      />
      <button onClick={handleSubmit}>Submit</button>
    </>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="variants">Variants</h2>

      <EnhancedCodeBlock
        code={`// Default - standard size with progress bar
<ThinkingBar
  status="thinking"
  variant="default"
  progress={50}
/>

// Minimal - compact inline display
<ThinkingBar
  status="searching"
  variant="minimal"
  message="Searching..."
/>

// Detailed - full stats with time estimation
<ThinkingBar
  status="generating"
  variant="detailed"
  progress={75}
  estimatedTime={5}
/>`}
        language="tsx"
      />

      <h2 id="indeterminate">Indeterminate Progress</h2>

      <p>
        When progress is unknown, ThinkingBar shows an indeterminate animation:
      </p>

      <EnhancedCodeBlock
        code={`// Auto-indeterminate (no progress prop)
<ThinkingBar status="thinking" message="Processing..." />

// Explicit indeterminate
<ThinkingBar
  status="searching"
  message="Searching..."
  indeterminate
/>`}
        language="tsx"
      />

      <h2 id="time-estimation">Time Estimation</h2>

      <p>
        Show estimated time remaining in the detailed variant:
      </p>

      <EnhancedCodeBlock
        code={`<ThinkingBar
  status="generating"
  variant="detailed"
  progress={60}
  estimatedTime={8}
  message="Generating detailed response..."
/>`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={thinkingBarProps} />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ ARIA live regions for status announcements</li>
        <li>✅ Proper progress bar semantics</li>
        <li>✅ Screen reader friendly status updates</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/chain-of-thought">ChainOfThought</a> - Reasoning visualization
        </li>
        <li>
          <a href="/reference/components/streaming-progress">StreamingProgress</a> - Streaming progress tracker
        </li>
        <li>
          <a href="/reference/components/thinking-indicator">ThinkingIndicator</a> - Simple thinking dots
        </li>
      </ul>
    </>
  )
}
