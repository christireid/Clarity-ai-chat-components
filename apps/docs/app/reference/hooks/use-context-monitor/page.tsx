import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useContextMonitor - Clarity Chat Components',
  description:
    'Monitor context utilization, efficiency, and get optimization recommendations.',
}

const configProps: Prop[] = [
  {
    name: 'maxTokens',
    type: 'number',
    required: true,
    description: 'Maximum context window size',
  },
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model name for accurate token counting',
  },
  {
    name: 'enableEfficiencyMetrics',
    type: 'boolean',
    description: 'Enable efficiency metrics calculation',
  },
  {
    name: 'enableRecommendations',
    type: 'boolean',
    description: 'Enable optimization recommendations',
  },
  {
    name: 'onWarning',
    type: '(warning: ContextWarning) => void',
    description: 'Callback when warning is generated',
  },
  {
    name: 'onRecommendation',
    type: '(recommendation: OptimizationRecommendation) => void',
    description: 'Callback when recommendation is generated',
  },
]

export default function UseContextMonitorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useContextMonitor</h1>
        <p className="docs-lead">
          Monitor context utilization, efficiency metrics, and get intelligent
          optimization recommendations.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Monitor context utilization by category',
          'Track efficiency metrics (density, recency, relevance)',
          'Receive optimization recommendations',
          'Handle context warnings',
          'Analyze context breakdown',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Monitor context utilization:</p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ContextMonitor({ messages }: { messages: Message[] }) {
  const {
    utilization,
    warnings,
    recommendations,
  } = useContextMonitor(messages, {
    maxTokens: 128000,
    model: 'gpt-4',
  })

  return (
    <div>
      <div>Total: {utilization.totalTokens} / {utilization.maxTokens}</div>
      <div>Utilization: {utilization.utilizationPercent}%</div>
      <div>System: {utilization.breakdown.systemPrompt}</div>
      <div>History: {utilization.breakdown.conversationHistory}</div>
      <div>Context: {utilization.breakdown.retrievedContext}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Efficiency Metrics</h2>
        <p>Track information density, recency, and relevance:</p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

function EfficiencyMetrics({ messages }: { messages: Message[] }) {
  const { utilization } = useContextMonitor(messages, {
    maxTokens: 128000,
    enableEfficiencyMetrics: true,
  })

  const { efficiency } = utilization

  return (
    <div>
      <div>Information Density: {(efficiency.informationDensity * 100).toFixed(1)}%</div>
      <div>Recency Score: {(efficiency.recencyScore * 100).toFixed(1)}%</div>
      <div>Relevance Score: {(efficiency.relevanceScore * 100).toFixed(1)}%</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Optimization Recommendations</h2>
        <p>Get intelligent recommendations for context optimization:</p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

function WithRecommendations({ messages }: { messages: Message[] }) {
  const { recommendations } = useContextMonitor(messages, {
    maxTokens: 128000,
    enableRecommendations: true,
    onRecommendation: (rec) => {
      console.log(\`Recommendation: \${rec.description}\`)
      console.log(\`Estimated savings: \${rec.estimatedSavings} tokens\`)
      console.log(\`Action: \${rec.action}\`)
    },
  })

  return (
    <div>
      {recommendations.map((rec) => (
        <div key={rec.id}>
          <div>{rec.description}</div>
          <div>Savings: {rec.estimatedSavings} tokens</div>
          <div>Action: {rec.action}</div>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Context Warnings</h2>
        <p>Handle context warnings with callbacks:</p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

function WithWarnings({ messages }: { messages: Message[] }) {
  const { warnings } = useContextMonitor(messages, {
    maxTokens: 128000,
    onWarning: (warning) => {
      if (warning.level === 'critical') {
        console.error(warning.message)
        // Show critical alert
      } else if (warning.level === 'warning') {
        console.warn(warning.message)
        // Show warning notification
      }
      console.log('Recommendation:', warning.recommendation)
    },
  })

  return (
    <div>
      {warnings.map((warning, i) => (
        <div key={i} className={\`warning-\${warning.level}\`}>
          <div>{warning.message}</div>
          <div>{warning.recommendation}</div>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Context Breakdown</h2>
        <p>Analyze token usage by category:</p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

function Breakdown({ messages }: { messages: Message[] }) {
  const { utilization } = useContextMonitor(messages, {
    maxTokens: 128000,
  })

  const { breakdown } = utilization

  return (
    <div>
      <div>System Prompt: {breakdown.systemPrompt} tokens</div>
      <div>Conversation History: {breakdown.conversationHistory} tokens</div>
      <div>Retrieved Context (RAG): {breakdown.retrievedContext} tokens</div>
      <div>Current Message: {breakdown.userMessage} tokens</div>
      <div>Reserved: {breakdown.reserved} tokens</div>
      <div>Total: {utilization.totalTokens} tokens</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <PropsTable props={configProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>utilization</code>: Full context utilization metrics with
            breakdown and efficiency
          </li>
          <li>
            <code>warnings</code>: Array of context warnings with
            recommendations
          </li>
          <li>
            <code>recommendations</code>: Array of optimization recommendations
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Warning Types</h2>
        <ul>
          <li>
            <strong>utilization</strong>: Context window utilization too high
          </li>
          <li>
            <strong>efficiency</strong>: Low information density or relevance
          </li>
          <li>
            <strong>staleness</strong>: Context is outdated
          </li>
          <li>
            <strong>density</strong>: Too much filler content
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Recommendation Actions</h2>
        <ul>
          <li>
            <strong>compress</strong>: Compress existing context
          </li>
          <li>
            <strong>summarize</strong>: Summarize old messages
          </li>
          <li>
            <strong>archive</strong>: Archive old conversation
          </li>
          <li>
            <strong>prune</strong>: Remove low-priority content
          </li>
          <li>
            <strong>switch-model</strong>: Use a model with larger context
            window
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Enable <code>enableEfficiencyMetrics</code> to track context quality
          </li>
          <li>
            Use <code>enableRecommendations</code> for actionable optimization
            suggestions
          </li>
          <li>Handle warnings with user-friendly notifications</li>
          <li>Monitor breakdown to identify token-heavy categories</li>
          <li>Use recommendations to optimize context before hitting limits</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-token-budget-monitor">
              useTokenBudgetMonitor
            </a>{' '}
            - Budget monitoring
          </li>
          <li>
            <a href="/reference/hooks/use-token-optimization-enhanced">
              useTokenOptimization
            </a>{' '}
            - Token optimization
          </li>
          <li>
            <a href="/reference/components/token-counter">TokenCounter</a> -
            Token usage display
          </li>
        </ul>
      </section>
    </div>
  )
}
