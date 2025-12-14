import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'HistoryManager - Clarity Chat Components',
  description:
    'Manage conversation history with token tracking, pruning, and bulk operations.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'HistoryMessage[]',
    required: true,
    description: 'Array of messages in the conversation',
  },
  {
    name: 'onMessagesChange',
    type: '(messages: HistoryMessage[]) => void',
    required: true,
    description: 'Callback when messages are updated',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens allowed',
  },
  {
    name: 'currentTokens',
    type: 'number',
    description: 'Current total token count (calculated if not provided)',
  },
  {
    name: 'showTokenCounts',
    type: 'boolean',
    description: 'Show token counts for each message',
  },
  {
    name: 'allowBulkDelete',
    type: 'boolean',
    description: 'Allow bulk delete operations',
  },
  {
    name: 'allowIndividualDelete',
    type: 'boolean',
    description: 'Allow selecting and deleting individual messages',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    description: 'Warning threshold percentage (default: 0.8)',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    description: 'Critical threshold percentage (default: 0.95)',
  },
  {
    name: 'compact',
    type: 'boolean',
    description: 'Compact mode for smaller displays',
  },
  {
    name: 'onPrune',
    type: '(prunedCount: number, tokensSaved: number) => void',
    description: 'Callback when messages are pruned',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function HistoryManagerPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>HistoryManager</h1>
        <p className="docs-lead">
          Manage conversation history with token tracking, visual usage
          indicators, and smart pruning capabilities.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Track token usage per message',
          'Visualize token consumption',
          'Prune messages to stay within limits',
          'Bulk delete operations',
          'Configure warning thresholds',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Manage conversation history with token tracking:</p>
        <CodePlayground
          initialCode={`import { HistoryManager, type HistoryMessage } from '@clarity-chat/react'

function ChatWithHistory() {
  const [messages, setMessages] = React.useState<HistoryMessage[]>([
    { id: '1', role: 'user', content: 'Hello', timestamp: new Date() },
    { id: '2', role: 'assistant', content: 'Hi there!', timestamp: new Date() },
  ])

  return (
    <div className="p-4">
      <HistoryManager
        messages={messages}
        onMessagesChange={setMessages}
        maxTokens={8000}
        showTokenCounts
        allowBulkDelete
        allowIndividualDelete
      />
    </div>
  )
}

render(<ChatWithHistory />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Tracking</h2>
        <p>Visualize token usage with color-coded indicators:</p>
        <CodePlayground
          initialCode={`import { HistoryManager } from '@clarity-chat/react'

function TokenTracking() {
  return (
    <HistoryManager
      messages={messages}
      onMessagesChange={setMessages}
      maxTokens={8000}
      currentTokens={6000}  // Pre-calculated token count
      showTokenCounts={true}
      warningThreshold={0.8}  // 80% = yellow warning
      criticalThreshold={0.95}  // 95% = red critical
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Bulk Operations</h2>
        <p>Enable bulk delete and pruning operations:</p>
        <CodePlayground
          initialCode={`import { HistoryManager } from '@clarity-chat/react'

function BulkOperations() {
  return (
    <HistoryManager
      messages={messages}
      onMessagesChange={setMessages}
      maxTokens={8000}
      allowBulkDelete={true}
      allowIndividualDelete={true}
      onPrune={(prunedCount, tokensSaved) => {
        console.log(\`Pruned \${prunedCount} messages, saved \${tokensSaved} tokens\`)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Compact Mode</h2>
        <p>Use compact mode for smaller displays:</p>
        <CodePlayground
          initialCode={`import { HistoryManager } from '@clarity-chat/react'

function CompactHistory() {
  return (
    <HistoryManager
      messages={messages}
      onMessagesChange={setMessages}
      maxTokens={8000}
      compact={true}
      showTokenCounts={false}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Thresholds</h2>
        <p>Configure warning and critical thresholds:</p>
        <CodePlayground
          initialCode={`import { HistoryManager } from '@clarity-chat/react'

function ThresholdHistory() {
  return (
    <HistoryManager
      messages={messages}
      onMessagesChange={setMessages}
      maxTokens={8000}
      warningThreshold={0.7}  // 70% = start showing warnings
      criticalThreshold={0.9}  // 90% = critical level
      onPrune={(count, tokens) => {
        // Auto-prune when approaching limit
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Token Usage Bar</h2>
        <p>The component includes a visual token usage bar that shows:</p>
        <ul>
          <li>Current token usage (green)</li>
          <li>Warning threshold (yellow)</li>
          <li>Critical threshold (red)</li>
          <li>Maximum tokens limit</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Set <code>maxTokens</code> based on your model's context window
          </li>
          <li>
            Use <code>warningThreshold</code> of 0.8 for early warnings
          </li>
          <li>
            Enable <code>showTokenCounts</code> during development
          </li>
          <li>
            Use <code>compact</code> mode for production
          </li>
          <li>
            Implement <code>onPrune</code> callback to track pruning events
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/token-counter">TokenCounter</a> -
            Simple token counter
          </li>
          <li>
            <a href="/reference/hooks/use-token-tracker">useTokenTracker</a> -
            Token tracking hook
          </li>
          <li>
            <a href="/reference/hooks/use-token-budget-monitor">
              useTokenBudgetMonitor
            </a>{' '}
            - Budget monitoring
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> -
            Optimization strategies
          </li>
        </ul>
      </section>
    </div>
  )
}
