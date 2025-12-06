import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useTokenBudgetMonitor - Clarity Chat Components',
  description: 'Real-time token budget monitoring with threshold warnings, auto-trimming, and status tracking.',
}

const configProps: Prop[] = [
  {
    name: 'maxInputTokens',
    type: 'number',
    required: true,
    description: 'Maximum input tokens for the model (e.g., 128000 for GPT-4)',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    description: 'Warning threshold as decimal (default: 0.8 = 80%)',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    description: 'Critical threshold as decimal (default: 0.95 = 95%)',
  },
  {
    name: 'reservedForOutput',
    type: 'number',
    description: 'Tokens reserved for output response (default: 4096)',
  },
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model name for accurate token counting',
  },
  {
    name: 'onWarning',
    type: '(usage: TokenUsage) => void',
    description: 'Callback when warning threshold is crossed',
  },
  {
    name: 'onCritical',
    type: '(usage: TokenUsage) => void',
    description: 'Callback when critical threshold is crossed',
  },
  {
    name: 'onExceeded',
    type: '(usage: TokenUsage) => void',
    description: 'Callback when exceeded (over 100%)',
  },
  {
    name: 'autoTrim',
    type: 'boolean',
    description: 'Auto-trigger trimming at critical threshold',
  },
  {
    name: 'onAutoTrim',
    type: '(result: TrimResult) => void',
    description: 'Callback after auto-trim occurs',
  },
  {
    name: 'debounceMs',
    type: 'number',
    description: 'Debounce delay for token counting in ms (default: 300)',
  },
  {
    name: 'useAccurateTokenization',
    type: 'boolean',
    description: 'Use accurate tokenization (slower but precise)',
  },
]

export default function UseTokenBudgetMonitorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useTokenBudgetMonitor</h1>
        <p className="docs-lead">
          Real-time token budget monitoring with threshold warnings, auto-trimming, and status tracking.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Monitor token usage in real-time',
          'Configure warning and critical thresholds',
          'Enable auto-trimming when limits are exceeded',
          'Track token utilization status',
          'Handle threshold callbacks',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Monitor token usage with default thresholds:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function BudgetMonitor({ messages }: { messages: Message[] }) {
  const {
    usage,
    status,
    trimMessages,
  } = useTokenBudgetMonitor(messages, {
    maxInputTokens: 128000,  // GPT-4 context window
    model: 'gpt-4',
  })

  return (
    <div>
      <div>Status: {status}</div>
      <div>Used: {usage.current} / {usage.max}</div>
      <div>Available: {usage.available}</div>
      {status === 'critical' && (
        <button onClick={() => trimMessages()}>
          Trim Messages
        </button>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Threshold Configuration</h2>
        <p>
          Configure custom warning and critical thresholds:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'

function CustomThresholds({ messages }: { messages: Message[] }) {
  const { usage, status } = useTokenBudgetMonitor(messages, {
    maxInputTokens: 8000,
    warningThreshold: 0.7,   // Warn at 70%
    criticalThreshold: 0.9,   // Critical at 90%
    reservedForOutput: 2048,
  })

  return (
    <div className={\`status-\${status}\`}>
      {status === 'warning' && <div>Approaching limit</div>}
      {status === 'critical' && <div>Near limit - consider trimming</div>}
      {status === 'exceeded' && <div>Limit exceeded!</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Auto-Trim on Critical</h2>
        <p>
          Automatically trim messages when critical threshold is reached:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'

function AutoTrim({ messages, setMessages }: { messages: Message[], setMessages: (msgs: Message[]) => void }) {
  const { usage, trimmedMessages } = useTokenBudgetMonitor(messages, {
    maxInputTokens: 8000,
    autoTrim: true,
    onAutoTrim: (result) => {
      console.log(\`Trimmed \${result.tokensRemoved} tokens\`)
      console.log('Removed items:', result.removedItems)
      setMessages(result.trimmedContent as Message[])
    },
  })

  // trimmedMessages will be automatically updated when critical threshold is reached
  return <ChatWindow messages={trimmedMessages || messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Threshold Callbacks</h2>
        <p>
          Handle threshold crossings with callbacks:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'

function WithCallbacks({ messages }: { messages: Message[] }) {
  const { usage } = useTokenBudgetMonitor(messages, {
    maxInputTokens: 8000,
    onWarning: (usage) => {
      console.warn(\`Token usage at \${usage.utilizationPercent}%\`)
      // Show warning notification
    },
    onCritical: (usage) => {
      console.error(\`Token usage critical: \${usage.utilizationPercent}%\`)
      // Show critical alert
    },
    onExceeded: (usage) => {
      console.error('Token limit exceeded!')
      // Force trim or show error
    },
  })

  return <div>Usage: {usage.utilizationPercent}%</div>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Manual Trimming</h2>
        <p>
          Manually trim messages with priority-based trimming:
        </p>
        <CodePlayground
          initialCode={`import { useTokenBudgetMonitor } from '@clarity-chat/react'

function ManualTrim({ messages, setMessages }: { messages: Message[], setMessages: (msgs: Message[]) => void }) {
  const { trimMessages, usage } = useTokenBudgetMonitor(messages, {
    maxInputTokens: 8000,
  })

  const handleTrim = () => {
    const result = trimMessages({
      targetTokens: usage.effectiveMax,
      preserveRecent: 10,  // Keep last 10 messages
    })
    
    if (result) {
      setMessages(result.trimmedContent as Message[])
      console.log(\`Removed \${result.tokensRemoved} tokens\`)
    }
  }

  return (
    <div>
      <div>Usage: {usage.utilizationPercent}%</div>
      <button onClick={handleTrim}>Trim Messages</button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Usage Status</h2>
        <p>
          Status levels:
        </p>
        <ul>
          <li><strong>safe</strong>: Below warning threshold</li>
          <li><strong>warning</strong>: Between warning and critical thresholds</li>
          <li><strong>critical</strong>: Between critical threshold and 100%</li>
          <li><strong>exceeded</strong>: Over 100% utilization</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <PropsTable props={configProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>usage</code>: Current token usage metrics (current, max, available, utilizationPercent, status)</li>
          <li><code>status</code>: Current status level ('safe' | 'warning' | 'critical' | 'exceeded')</li>
          <li><code>trimMessages</code>: Function to manually trim messages</li>
          <li><code>trimmedMessages</code>: Automatically trimmed messages (when autoTrim is enabled)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Set <code>maxInputTokens</code> based on your model's context window</li>
          <li>Reserve tokens for output with <code>reservedForOutput</code></li>
          <li>Use <code>warningThreshold</code> at 70-80% for early warnings</li>
          <li>Set <code>criticalThreshold</code> at 90-95% to allow time for trimming</li>
          <li>Enable <code>autoTrim</code> for automatic management</li>
          <li>Use callbacks to show user notifications</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-token-optimization-enhanced">useTokenOptimizationEnhanced</a> - Advanced token optimization</li>
          <li><a href="/reference/hooks/use-context-monitor">useContextMonitor</a> - Context utilization monitoring</li>
          <li><a href="/reference/components/token-counter">TokenCounter</a> - Token usage display</li>
        </ul>
      </section>
    </div>
  )
}
