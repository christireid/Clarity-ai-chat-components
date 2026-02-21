import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'TokenCounter Component | Clarity AI Chat Components',
  description:
    'Display token usage with visual progress bars, threshold warnings, and smart pruning suggestions. Essential for managing context window limits.',
  openGraph: {
    title: 'TokenCounter Component',
    description: 'Token usage visualization with context window management',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'demo', title: 'Interactive Demo', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'props', title: 'Props Reference', level: 2 },
  { id: 'threshold-warnings', title: 'Threshold Warnings', level: 2 },
  { id: 'pruning-workflow', title: 'Pruning Workflow', level: 2 },
  { id: 'model-scenarios', title: 'Model-Specific Scenarios', level: 2 },
  { id: 'size-variants', title: 'Size Variants', level: 2 },
  { id: 'integration', title: 'Integration Examples', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Component props definition
const componentProps: PropDefinition[] = [
  {
    name: 'currentTokens',
    type: 'number',
    required: true,
    description: 'Current token count in the conversation',
  },
  {
    name: 'maxTokens',
    type: 'number',
    required: true,
    description: 'Maximum tokens allowed by the model context window',
  },
  {
    name: 'costPerToken',
    type: 'number',
    description:
      'Cost per token in dollars (e.g., 0.000002 for $0.002 per 1K tokens) - enables cost estimation',
  },
  {
    name: 'showWarning',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display warning alerts when approaching limits',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description: 'Warning threshold as decimal percentage (0.8 = 80% usage)',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    default: '0.95',
    description: 'Critical threshold as decimal percentage (0.95 = 95% usage)',
  },
  {
    name: 'showCost',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display estimated cost (requires costPerToken)',
  },
  {
    name: 'showBar',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the visual progress bar',
  },
  {
    name: 'onWarning',
    type: '() => void',
    description: 'Callback fired once when warning threshold is first exceeded',
  },
  {
    name: 'onCritical',
    type: '() => void',
    description: 'Callback fired once when critical threshold is first exceeded',
  },
  {
    name: 'suggestPruning',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show "Prune old messages" button in critical state',
  },
  {
    name: 'onPruneSuggested',
    type: '() => void',
    description: 'Callback fired when user clicks the prune suggestion button',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Size variant affecting text size, icon size, and bar height',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for custom styling',
  },
]

export default function TokenCounterPage() {
  return (
    <DocumentationPage
      title="TokenCounter"
      description="Display token usage with visual progress bars and threshold warnings"
      category="Token Optimization"
      icon="📊"
      badges={[
        { label: 'High Priority', variant: 'warning' },
        { label: 'Context Management', variant: 'info' },
        { label: 'Visual Feedback', variant: 'primary' },
      ]}
      features={[
        'Real-time token count visualization',
        'Color-coded progress bar (green → yellow → red)',
        'Threshold-based warning alerts (80% and 95%)',
        'Cost estimation display',
        'Smart pruning suggestions at critical levels',
        'Callback hooks for warning and critical states',
        'Three size variants (sm, md, lg)',
        'Full ARIA support for screen readers',
        'Responsive design for all screen sizes',
        'Auto-reset warnings when usage drops',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          TokenCounter provides visual feedback on context window usage with color-coded progress
          bars and threshold warnings. Essential for managing long conversations where older
          messages may be truncated.
        </p>

        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Why Context Window Management Matters</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Prevents Message Loss:</strong> Warn users
                before older messages are automatically pruned
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Cost Awareness:</strong> Show estimated costs
                as conversations grow
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">User Control:</strong> Empower users to prune
                unnecessary messages proactively
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Model Awareness:</strong> Different models have
                different limits (4K, 8K, 32K, 128K tokens)
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>🎨</span>
            <span>Visual Feedback System</span>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-3 bg-green-500 rounded-full" />
              <div className="text-sm">
                <strong className="text-foreground">Safe (0-79%):</strong> Green progress bar,
                normal usage
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-3 bg-yellow-500 rounded-full" />
              <div className="text-sm">
                <strong className="text-foreground">Warning (80-94%):</strong> Yellow bar with alert
                message
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-3 bg-red-500 rounded-full" />
              <div className="text-sm">
                <strong className="text-foreground">Critical (95-100%):</strong> Red bar with
                pruning suggestion
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`# Install the React components package
pnpm add @clarity-chat/react

# Or with npm
npm install @clarity-chat/react

# Or with yarn
yarn add @clarity-chat/react`}
          filename="terminal"
        />
      </Section>

      <Section id="demo" title="Interactive Demo">
        <LiveDemoContainer
          title="Threshold Testing"
          description="Drag the slider to see how TokenCounter responds at different usage levels"
        >
          <div className="space-y-6">
            {/* Demo implementation would go here in actual component */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <div className="space-y-6">
                {/* Token slider */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Current Usage: <span className="text-primary font-mono">3,276</span> /{' '}
                    <span className="font-mono">4,096</span> tokens (80%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4096"
                    defaultValue="3276"
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* TokenCounter preview */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-medium text-yellow-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>3,276 / 4,096 tokens</span>
                    </div>
                    <div className="text-muted-foreground font-mono text-sm">$0.0066</div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className="h-2 bg-yellow-500 transition-all duration-150"
                      style={{ width: '80%' }}
                    />
                  </div>

                  <div className="text-xs text-yellow-600 mb-3">
                    80.0% of context window used
                  </div>

                  {/* Warning alert */}
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                    <svg
                      className="w-5 h-5 text-yellow-600 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-yellow-600 text-sm">
                        Approaching Context Limit
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You're using a large portion of the context window. Older messages may be
                        excluded.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="text-sm text-muted-foreground">
                  <strong>Current State:</strong> Warning (80% threshold exceeded)
                  <br />
                  <strong>Callbacks Fired:</strong> onWarning()
                </div>
              </div>
            </div>
          </div>
        </LiveDemoContainer>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-6">
          The simplest integration: display token count with a visual progress bar.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCounter } from '@clarity-chat/react'

export function ChatWindow() {
  const currentTokens = 1250
  const maxTokens = 4096

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="messages">
        {/* ... message list ... */}
      </div>

      {/* Token usage indicator */}
      <TokenCounter
        currentTokens={currentTokens}
        maxTokens={maxTokens}
      />
    </div>
  )
}`}
          filename="ChatWindow.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">Default Behavior</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Shows token count with localized number formatting (e.g., "1,250")</li>
            <li>• Displays visual progress bar with color-coded thresholds</li>
            <li>• Shows percentage of context window used</li>
            <li>• Warns at 80% (yellow) and 95% (red) by default</li>
            <li>• Medium size variant suitable for most UIs</li>
          </ul>
        </div>
      </Section>

      <Section id="props" title="Props Reference">
        <p className="text-muted-foreground mb-6">
          Complete reference of all TokenCounter component props.
        </p>
        <PropsTable props={componentProps} />
      </Section>

      <Section id="threshold-warnings" title="Threshold Warnings">
        <p className="text-muted-foreground mb-6">
          Configure custom warning and critical thresholds with callbacks for application logic.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCounter } from '@clarity-chat/react'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export function ConversationManager() {
  const [currentTokens, setCurrentTokens] = useState(2500)
  const maxTokens = 4096

  const handleWarning = useCallback(() => {
    toast.warning('Approaching token limit', {
      description: 'Consider summarizing or pruning older messages',
    })
    // Log to analytics
    console.log('Token warning triggered at', currentTokens)
  }, [currentTokens])

  const handleCritical = useCallback(() => {
    toast.error('Critical token limit reached', {
      description: 'Older messages will be automatically pruned',
      action: {
        label: 'Prune Now',
        onClick: () => pruneOldMessages(),
      },
    })
    // Alert user more prominently
    showPruneDialog()
  }, [])

  return (
    <TokenCounter
      currentTokens={currentTokens}
      maxTokens={maxTokens}
      warningThreshold={0.75}    // Warn at 75% (earlier than default)
      criticalThreshold={0.90}   // Critical at 90%
      onWarning={handleWarning}
      onCritical={handleCritical}
    />
  )
}`}
          filename="ConversationManager.tsx"
        />

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">
              💡 Best Practice: One-Time Callbacks
            </div>
            <p className="text-sm text-muted-foreground">
              onWarning and onCritical fire only once when the threshold is first crossed. They
              automatically reset when usage drops below the warning threshold, preventing alert
              fatigue.
            </p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="font-semibold text-yellow-500 mb-2">⚙️ Configurable Thresholds</div>
            <p className="text-sm text-muted-foreground">
              Default thresholds (80% warning, 95% critical) work for most cases, but you can
              customize based on your use case. Stricter thresholds (70%/85%) give users more
              time to react.
            </p>
          </div>
        </div>
      </Section>

      <Section id="pruning-workflow" title="Pruning Workflow">
        <p className="text-muted-foreground mb-6">
          Enable smart pruning suggestions that guide users to free up context space when
          approaching limits.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCounter } from '@clarity-chat/react'
import { useState } from 'react'

interface Message {
  id: string
  content: string
  timestamp: Date
}

export function ChatWithPruning() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTokens, setCurrentTokens] = useState(3900)
  const maxTokens = 4096

  const handlePruneSuggested = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Remove older messages to free up context space?'
    )

    if (confirmed) {
      // Keep only the 10 most recent messages
      const prunedMessages = messages.slice(-10)
      setMessages(prunedMessages)

      // Recalculate token count
      const newTokens = calculateTokens(prunedMessages)
      setCurrentTokens(newTokens)

      console.log(\`Pruned \${messages.length - prunedMessages.length} messages\`)
    }
  }

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Token counter with pruning */}
      <TokenCounter
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        suggestPruning={true}
        onPruneSuggested={handlePruneSuggested}
      />
    </div>
  )
}

function calculateTokens(messages: Message[]): number {
  // Approximate: 4 characters = 1 token
  return messages.reduce((total, msg) => {
    return total + Math.ceil(msg.content.length / 4)
  }, 0)
}`}
          filename="ChatWithPruning.tsx"
        />

        <div className="mt-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>🔧</span>
            <span>Advanced Pruning Strategies</span>
          </h4>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-medium mb-1">1. Time-Based Pruning</div>
              <p className="text-muted-foreground">
                Remove messages older than X hours/days while keeping recent context intact
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">2. Importance-Based Pruning</div>
              <p className="text-muted-foreground">
                Preserve "pinned" or "important" messages, prune less relevant ones
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">3. Sliding Window</div>
              <p className="text-muted-foreground">
                Keep the first N and last N messages, prune the middle
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">4. Summarization</div>
              <p className="text-muted-foreground">
                Replace old messages with AI-generated summary to preserve context efficiently
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="model-scenarios" title="Model-Specific Scenarios">
        <p className="text-muted-foreground mb-6">
          Different models have different context windows. Configure TokenCounter to match your
          model's limits.
        </p>

        <div className="space-y-6">
          {/* Model comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Model</th>
                  <th className="text-left py-3 px-4 font-semibold">Max Tokens</th>
                  <th className="text-left py-3 px-4 font-semibold">Cost/1K Tokens</th>
                  <th className="text-left py-3 px-4 font-semibold">Use Case</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">GPT-3.5 Turbo</td>
                  <td className="py-3 px-4 font-mono">4,096</td>
                  <td className="py-3 px-4 font-mono">$0.002</td>
                  <td className="py-3 px-4">Quick queries, cost-sensitive apps</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">GPT-4</td>
                  <td className="py-3 px-4 font-mono">8,192</td>
                  <td className="py-3 px-4 font-mono">$0.03</td>
                  <td className="py-3 px-4">Standard conversations</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">GPT-4 Turbo</td>
                  <td className="py-3 px-4 font-mono">128,000</td>
                  <td className="py-3 px-4 font-mono">$0.01</td>
                  <td className="py-3 px-4">Long documents, extensive context</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">Claude 3 Opus</td>
                  <td className="py-3 px-4 font-mono">200,000</td>
                  <td className="py-3 px-4 font-mono">$0.015</td>
                  <td className="py-3 px-4">Maximum context, complex analysis</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">Claude 3 Sonnet</td>
                  <td className="py-3 px-4 font-mono">200,000</td>
                  <td className="py-3 px-4 font-mono">$0.003</td>
                  <td className="py-3 px-4">Long conversations, best value</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Implementation example */}
          <div>
            <h4 className="font-semibold mb-4">Dynamic Model Configuration</h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCounter } from '@clarity-chat/react'
import { useState } from 'react'

type ModelId = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'claude-3-opus' | 'claude-3-sonnet'

const MODEL_CONFIG = {
  'gpt-3.5-turbo': { maxTokens: 4096, costPer1K: 0.002 },
  'gpt-4': { maxTokens: 8192, costPer1K: 0.03 },
  'gpt-4-turbo': { maxTokens: 128000, costPer1K: 0.01 },
  'claude-3-opus': { maxTokens: 200000, costPer1K: 0.015 },
  'claude-3-sonnet': { maxTokens: 200000, costPer1K: 0.003 },
} as const

export function ModelAwareTokenCounter() {
  const [selectedModel, setSelectedModel] = useState<ModelId>('gpt-4')
  const [currentTokens, setCurrentTokens] = useState(3500)

  const config = MODEL_CONFIG[selectedModel]
  const costPerToken = config.costPer1K / 1000

  return (
    <div className="space-y-4">
      {/* Model selector */}
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value as ModelId)}
        className="px-3 py-2 border rounded-lg"
      >
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (4K)</option>
        <option value="gpt-4">GPT-4 (8K)</option>
        <option value="gpt-4-turbo">GPT-4 Turbo (128K)</option>
        <option value="claude-3-opus">Claude 3 Opus (200K)</option>
        <option value="claude-3-sonnet">Claude 3 Sonnet (200K)</option>
      </select>

      {/* Token counter dynamically configured */}
      <TokenCounter
        currentTokens={currentTokens}
        maxTokens={config.maxTokens}
        costPerToken={costPerToken}
        showCost={true}
      />
    </div>
  )
}`}
              filename="ModelAwareTokenCounter.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="size-variants" title="Size Variants">
        <p className="text-muted-foreground mb-6">
          TokenCounter supports three size variants to fit different UI contexts.
        </p>

        <div className="space-y-8">
          {/* Small variant */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Small Variant (size="sm")</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Compact display for sidebars, mobile views, or when space is limited.
            </p>
            <CodeBlock
              language="tsx"
              code={`<TokenCounter
  currentTokens={1250}
  maxTokens={4096}
  size="sm"
  showBar={false}  // Often hide bar in small variant
  className="text-xs"
/>`}
              filename="SmallVariant.tsx"
            />
          </div>

          {/* Medium variant (default) */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Medium Variant (size="md", default)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Standard display suitable for most UIs, balanced between visibility and space usage.
            </p>
            <CodeBlock
              language="tsx"
              code={`<TokenCounter
  currentTokens={3500}
  maxTokens={4096}
  size="md"
/>`}
              filename="MediumVariant.tsx"
            />
          </div>

          {/* Large variant */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Large Variant (size="lg")</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Prominent display for dashboards, settings pages, or when token usage is a primary
              concern.
            </p>
            <CodeBlock
              language="tsx"
              code={`<TokenCounter
  currentTokens={95000}
  maxTokens={128000}
  size="lg"
  showCost={true}
  costPerToken={0.00001}
/>`}
              filename="LargeVariant.tsx"
            />
          </div>
        </div>

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">Size Specifications</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>
                <strong className="text-foreground">Small:</strong> text-xs, h-1 bar, 12px icons
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                <strong className="text-foreground">Medium:</strong> text-sm, h-2 bar, 16px icons
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                <strong className="text-foreground">Large:</strong> text-base, h-3 bar, 20px icons
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="integration" title="Integration Examples">
        <p className="text-muted-foreground mb-6">
          Common integration patterns for different use cases.
        </p>

        <div className="space-y-8">
          {/* Chat footer */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Chat Window Footer</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCounter } from '@clarity-chat/react'
import { ChatInput } from '@clarity-chat/react'

export function ChatWindow({ messages }: Props) {
  const currentTokens = calculateTokens(messages)

  return (
    <div className="flex flex-col h-screen">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Footer with token counter and input */}
      <div className="border-t bg-background p-4 space-y-3">
        <TokenCounter
          currentTokens={currentTokens}
          maxTokens={4096}
          showCost={true}
          costPerToken={0.000002}
          size="sm"
        />

        <ChatInput
          onSend={handleSend}
          disabled={currentTokens >= 4096}
        />
      </div>
    </div>
  )
}`}
              filename="ChatWindow.tsx"
            />
          </div>

          {/* Status bar */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Sidebar Status Indicator</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCounter } from '@clarity-chat/react'

export function ConversationSidebar({ conversations }: Props) {
  const activeConversation = conversations.find((c) => c.isActive)

  return (
    <aside className="w-64 border-r bg-muted/30 p-4">
      {/* Conversation list */}
      <div className="space-y-2 mb-4">
        {conversations.map((conv) => (
          <ConversationItem key={conv.id} conversation={conv} />
        ))}
      </div>

      {/* Active conversation token usage */}
      {activeConversation && (
        <div className="border-t pt-4">
          <div className="text-xs font-medium mb-2">Current Conversation</div>
          <TokenCounter
            currentTokens={activeConversation.tokenCount}
            maxTokens={activeConversation.maxTokens}
            size="sm"
            showCost={false}
          />
        </div>
      )}
    </aside>
  )
}`}
              filename="ConversationSidebar.tsx"
            />
          </div>

          {/* Settings panel */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Settings Panel with Cost Preview</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCounter } from '@clarity-chat/react'
import { useState } from 'react'

export function ModelSettings() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [estimatedTokens, setEstimatedTokens] = useState(5000)

  const modelLimits = {
    'gpt-3.5-turbo': { max: 4096, cost: 0.000002 },
    'gpt-4': { max: 8192, cost: 0.00003 },
    'gpt-4-turbo': { max: 128000, cost: 0.00001 },
  }

  const config = modelLimits[selectedModel]

  return (
    <div className="space-y-6 p-6 bg-muted/30 rounded-xl">
      <div>
        <h3 className="font-semibold mb-4">Model Configuration</h3>

        <label className="block text-sm mb-2">Model</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-2">
          Estimated conversation size: {estimatedTokens.toLocaleString()} tokens
        </label>
        <input
          type="range"
          min="1000"
          max="20000"
          step="500"
          value={estimatedTokens}
          onChange={(e) => setEstimatedTokens(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Cost preview */}
      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-3">Cost Estimate</div>
        <TokenCounter
          currentTokens={estimatedTokens}
          maxTokens={config.max}
          costPerToken={config.cost}
          showCost={true}
          size="lg"
        />
      </div>
    </div>
  )
}`}
              filename="ModelSettings.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <p className="text-muted-foreground mb-6">
          TokenCounter is built with accessibility as a core requirement.
        </p>

        <div className="space-y-6">
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Built-in Accessibility Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">ARIA Labels:</strong> Comprehensive labels
                  announce token usage to screen readers
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Progress Bar Semantics:</strong> Progress
                  bar uses proper ARIA attributes (role, aria-valuenow, aria-valuemin,
                  aria-valuemax)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Alert Regions:</strong> Warning and critical
                  messages use role="alert" for immediate announcement
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Color Independence:</strong> States
                  communicated through text, icons, AND color (not color alone)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Keyboard Navigation:</strong> Prune button
                  fully keyboard accessible with Enter key support
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Screen Reader Announcement Example</h4>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm font-mono">
              <div className="text-blue-500 mb-2">Screen reader announces:</div>
              <div className="text-muted-foreground">
                "Token usage: 3,276 of 4,096 (80.0%). Warning: Approaching context limit. You're
                using a large portion of the context window."
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">🎯 WCAG Compliance</div>
            <p className="text-sm text-muted-foreground">
              TokenCounter meets WCAG 2.1 Level AA standards with 4.5:1 color contrast ratios,
              keyboard operability, and screen reader support.
            </p>
          </div>
        </div>
      </Section>

      <Section id="related" title="Related APIs">
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/components/token-optimization-panel"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenOptimizationPanel →
            </h4>
            <p className="text-sm text-muted-foreground">
              Dashboard UI for displaying comprehensive optimization statistics and analytics
            </p>
          </a>

          <a
            href="/reference/components/token-cost-preview"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCostPreview →
            </h4>
            <p className="text-sm text-muted-foreground">
              Real-time cost estimation as users type, with budget threshold alerts
            </p>
          </a>

          <a
            href="/reference/hooks/use-token-budget-monitor"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenBudgetMonitor Hook →
            </h4>
            <p className="text-sm text-muted-foreground">
              Monitor and enforce token budgets programmatically with alerts and limits
            </p>
          </a>

          <a
            href="/reference/utils/calculate-tokens"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              calculateTokens Utility →
            </h4>
            <p className="text-sm text-muted-foreground">
              Accurate token counting for different models and encoding schemes
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
