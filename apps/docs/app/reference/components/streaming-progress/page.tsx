'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const streamingProgressProps: Prop[] = [
  {
    name: 'progress',
    type: 'number',
    required: true,
    description: 'Progress percentage (0-100).',
  },
  {
    name: 'tokens',
    type: 'StreamStatusTokens',
    description: 'Token information including received, estimated, and tokensPerSecond.',
  },
  {
    name: 'variant',
    type: '"bar" | "circular" | "text" | "minimal"',
    default: '"bar"',
    description: 'Visual variant of the progress component.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Size variant.',
  },
  {
    name: 'color',
    type: '"default" | "success" | "warning" | "error" | "auto"',
    default: '"default"',
    description: 'Color variant. "auto" changes based on progress thresholds.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Whether streaming is currently active.',
  },
  {
    name: 'isComplete',
    type: 'boolean',
    default: 'false',
    description: 'Whether streaming is complete.',
  },
  {
    name: 'showPercentage',
    type: 'boolean',
    default: 'true',
    description: 'Show percentage text.',
  },
  {
    name: 'showTokenCount',
    type: 'boolean',
    default: 'true',
    description: 'Show token count.',
  },
  {
    name: 'showThroughput',
    type: 'boolean',
    default: 'false',
    description: 'Show throughput (tokens/second).',
  },
  {
    name: 'showTimeRemaining',
    type: 'boolean',
    default: 'false',
    description: 'Show estimated time remaining.',
  },
  {
    name: 'timeRemaining',
    type: 'number',
    description: 'Time remaining in milliseconds.',
  },
]

export default function StreamingProgressPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>StreamingProgress</h1>

      <p className="lead">
        Visualize streaming progress with token tracking, throughput display, and time estimation.
        Perfect for showing real-time AI generation progress.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { StreamStatusProgress } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { StreamStatusProgress } from '@clarity-chat/react/internal'

function Example() {
  return (
    <StreamStatusProgress
      progress={65}
      tokens={{
        received: 325,
        estimated: 500,
        tokensPerSecond: 45
      }}
      isStreaming
      showTokenCount
      showThroughput
    />
  )
}`}
        language="tsx"
      />

      <h2 id="variants">Variants</h2>

      <EnhancedCodeBlock
        code={`// Bar variant (default) - horizontal progress bar
<StreamStatusProgress
  progress={60}
  variant="bar"
  tokens={{ received: 300, estimated: 500 }}
/>

// Circular variant - circular progress ring
<StreamStatusProgress
  progress={75}
  variant="circular"
  showPercentage
/>

// Text variant - text-only progress
<StreamStatusProgress
  progress={80}
  variant="text"
  tokens={{ received: 400, estimated: 500 }}
/>

// Minimal variant - compact inline display
<StreamStatusProgress
  progress={90}
  variant="minimal"
/>`}
        language="tsx"
      />

      <h2 id="token-tracking">Token Tracking</h2>

      <EnhancedCodeBlock
        code={`<StreamStatusProgress
  progress={70}
  tokens={{
    received: 350,
    estimated: 500,
    tokensPerSecond: 42
  }}
  showTokenCount
  showThroughput
  label="Generating response"
/>`}
        language="tsx"
      />

      <h2 id="time-estimation">Time Estimation</h2>

      <EnhancedCodeBlock
        code={`<StreamStatusProgress
  progress={45}
  timeRemaining={5000} // 5 seconds
  showTimeRemaining
  tokens={{ received: 225, estimated: 500 }}
/>`}
        language="tsx"
      />

      <h2 id="field-progress">With Field Progress</h2>

      <p>
        Use <code>StreamStatusProgressWithFields</code> for per-field status tracking:
      </p>

      <EnhancedCodeBlock
        code={`import { StreamStatusProgressWithFields } from '@clarity-chat/react/internal'

function Example() {
  const fieldStatus = new Map([
    ['title', {
      name: 'title',
      status: 'complete',
      tokensReceived: 50,
      progress: 100
    }],
    ['summary', {
      name: 'summary',
      status: 'streaming',
      tokensReceived: 120,
      progress: 65
    }],
    ['details', {
      name: 'details',
      status: 'pending',
      tokensReceived: 0,
      progress: 0
    }]
  ])

  return (
    <StreamStatusProgressWithFields
      progress={55}
      tokens={{ received: 170, estimated: 500 }}
      fieldStatus={fieldStatus}
      showFieldProgress
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="props">Props</h2>

      <PropsTable props={streamingProgressProps} />

      <h2 id="token-type">StreamStatusTokens Type</h2>

      <EnhancedCodeBlock
        code={`interface StreamStatusTokens {
  /** Tokens received so far */
  received: number
  /** Estimated total tokens (optional) */
  estimated?: number
  /** Tokens per second throughput (optional) */
  tokensPerSecond?: number
}`}
        language="tsx"
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ ARIA progressbar role with proper attributes</li>
        <li>✅ Screen reader announcements for progress updates</li>
        <li>✅ Reduced motion support</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/thinking-bar">ThinkingBar</a> - Processing status indicator
        </li>
        <li>
          <a href="/reference/components/chain-of-thought">ChainOfThought</a> - Reasoning steps
        </li>
        <li>
          <a href="/reference/hooks/use-token-tracker">useTokenTracker</a> - Token tracking hook
        </li>
      </ul>
    </>
  )
}
