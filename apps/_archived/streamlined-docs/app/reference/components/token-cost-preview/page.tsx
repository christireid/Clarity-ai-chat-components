import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'TokenCostPreview Component | Clarity AI Chat Components',
  description:
    'Real-time token counting and cost estimation as users type. Essential for budget-conscious applications with pay-per-token LLM APIs.',
  openGraph: {
    title: 'TokenCostPreview Component',
    description: 'Real-time token and cost estimation with live updates',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'demo', title: 'Live Typing Demo', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'component-props', title: 'Component Props', level: 2 },
  { id: 'hook-interface', title: 'Hook Interface', level: 2 },
  { id: 'before-after', title: 'Before/After Cost Display', level: 2 },
  { id: 'savings-preview', title: 'Savings Preview & Optimization Badge', level: 2 },
  { id: 'message-list', title: 'Message List Preview', level: 2 },
  { id: 'multi-model', title: 'Multi-Model Comparison', level: 2 },
  { id: 'budget-alerts', title: 'Budget Threshold Alerts', level: 2 },
  { id: 'animations', title: 'Animation & Transition Options', level: 2 },
  { id: 'custom-formatters', title: 'Custom Formatters', level: 2 },
  { id: 'integration', title: 'Integration Examples', level: 2 },
  { id: 'accessibility', title: 'Accessibility', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Component props definition
const componentProps: PropDefinition[] = [
  {
    name: 'text',
    type: 'string',
    required: true,
    description: 'The text content to analyze for tokens and cost estimation',
  },
  {
    name: 'model',
    type: 'ModelId | string',
    default: "'gpt-4'",
    description: 'The LLM model to use for pricing calculations',
  },
  {
    name: 'showTokenCount',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the token count',
  },
  {
    name: 'showCost',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the estimated cost',
  },
  {
    name: 'minDisplayCost',
    type: 'number',
    default: '0.0001',
    description: 'Minimum cost threshold to display (prevents showing $0.00 for tiny inputs)',
  },
  {
    name: 'variant',
    type: "'inline' | 'card'",
    default: "'inline'",
    description: 'Display variant - inline text or glassmorphism card',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for custom styling',
  },
  {
    name: 'onCostChange',
    type: '(cost: number, tokens: number) => void',
    description: 'Callback fired when cost or token count changes',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback fired when estimation fails',
  },
  {
    name: 'formatCost',
    type: '(cost: number) => string',
    description: 'Custom formatter for cost display (default: smart precision based on magnitude)',
  },
  {
    name: 'formatTokens',
    type: '(tokens: number) => string',
    description: 'Custom formatter for token count (default: K notation for large numbers)',
  },
  {
    name: 'throttleMs',
    type: 'number',
    default: '100',
    description: 'Milliseconds to throttle estimation updates (prevents excessive re-renders)',
  },
  {
    name: 'ariaLabel',
    type: 'string',
    description: 'Accessible label for screen readers',
  },
  {
    name: 'id',
    type: 'string',
    description: 'HTML id attribute for the component',
  },
  {
    name: 'showLoading',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show loading state during estimation',
  },
  {
    name: 'loadingText',
    type: 'string',
    default: '"Calculating..."',
    description: 'Text to display during loading state',
  },
  {
    name: 'showError',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display error messages',
  },
  {
    name: 'renderError',
    type: '(error: Error) => React.ReactNode',
    description: 'Custom error renderer for advanced error UI',
  },
]

// Hook interface definition
const hookInterface: PropDefinition[] = [
  {
    name: 'tokens',
    type: 'number',
    description: 'Estimated token count for the input text',
  },
  {
    name: 'inputCost',
    type: 'number',
    description: 'Estimated cost in USD for processing the input',
  },
  {
    name: 'model',
    type: 'string',
    description: 'The model ID used for pricing',
  },
  {
    name: 'isStale',
    type: 'boolean',
    description: 'Whether the estimate is stale (input changed but throttled)',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether estimation is in progress',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error object if estimation failed, null otherwise',
  },
]

export default function TokenCostPreviewPage() {
  return (
    <DocumentationPage
      title="TokenCostPreview"
      description="Real-time token counting and cost estimation as users type"
      category="Token Optimization"
      icon="💰"
      badges={[
        { label: 'Critical', variant: 'danger' },
        { label: 'Real-time', variant: 'primary' },
        { label: 'Cost Control', variant: 'info' },
      ]}
      features={[
        'Live token counting as users type',
        'Real-time cost estimation with model-specific pricing',
        'Throttled updates for optimal performance',
        'Budget threshold alerts and warnings',
        'Multi-model cost comparison',
        'Custom formatters for display preferences',
        'Inline and card display variants',
        'Full accessibility support with ARIA',
        'Error handling and loading states',
        'Zero-cost display for tiny inputs',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          TokenCostPreview provides instant feedback on token usage and costs as users type their
          prompts. Essential for budget-conscious applications where LLM API costs are paid per
          token.
        </p>

        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Why Real-Time Cost Estimation Matters</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Prevents Budget Overruns:</strong> Users see
                costs before submitting expensive prompts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Encourages Optimization:</strong> Visual
                feedback motivates users to write concise prompts
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Transparent Pricing:</strong> Build trust by
                showing exact costs upfront
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Multi-Model Awareness:</strong> Help users
                understand cost differences between models
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>⚡</span>
            <span>Performance Characteristics</span>
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Throttled Updates:</strong> Default 100ms
              throttle prevents excessive re-renders during typing
            </li>
            <li>
              <strong className="text-foreground">Lightweight Estimation:</strong> Fast
              character-based tokenization approximation
            </li>
            <li>
              <strong className="text-foreground">Stale State Detection:</strong> Visual
              indicators when estimate is outdated
            </li>
            <li>
              <strong className="text-foreground">Reduced Motion Support:</strong> Respects user
              accessibility preferences
            </li>
          </ul>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`# Install the token optimization package
pnpm add @clarity-ai/token-optimization

# Or with npm
npm install @clarity-ai/token-optimization

# Or with yarn
yarn add @clarity-ai/token-optimization`}
          filename="terminal"
        />
      </Section>

      <Section id="demo" title="Live Typing Demo">
        <LiveDemoContainer title="Interactive Cost Estimation" description="Type to see real-time token counting and cost updates">
          <div className="space-y-6">
            {/* Demo implementation would go here in actual component */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Model Selection
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                      GPT-4 Turbo
                    </button>
                    <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm">
                      GPT-3.5 Turbo
                    </button>
                    <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm">
                      Claude 3 Opus
                    </button>
                    <button className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm">
                      Claude 3 Sonnet
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type your prompt
                  </label>
                  <textarea
                    className="w-full h-32 bg-background border border-border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Start typing to see real-time token and cost estimation..."
                    defaultValue="Analyze the sentiment of customer feedback and provide actionable insights for product improvement."
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Estimated Tokens</div>
                    <div className="text-2xl font-bold">24</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-sm text-muted-foreground">Estimated Cost</div>
                    <div className="text-2xl font-bold text-green-500">$0.0007</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong>Pricing:</strong> GPT-4 Turbo @ $0.03 per 1K input tokens • Updates
                  throttled at 100ms intervals
                </div>
              </div>
            </div>
          </div>
        </LiveDemoContainer>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-6">
          The simplest use case: show token count and cost for a text input.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

export function PromptEditor() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full h-32 p-4 border rounded-lg"
      />

      {/* Real-time cost estimation */}
      <TokenCostPreview
        text={prompt}
        model="gpt-4-turbo"
      />
    </div>
  )
}`}
          filename="PromptEditor.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3">Default Behavior</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Displays both token count and estimated cost</li>
            <li>• Uses inline text variant for minimal footprint</li>
            <li>• Updates throttled at 100ms intervals during typing</li>
            <li>• Shows $0.00 for inputs below minDisplayCost threshold</li>
            <li>• Automatically formats large numbers with K notation</li>
          </ul>
        </div>
      </Section>

      <Section id="component-props" title="Component Props">
        <p className="text-muted-foreground mb-6">
          Complete reference of all TokenCostPreview component props.
        </p>
        <PropsTable props={componentProps} />
      </Section>

      <Section id="before-after" title="Before/After Cost Display">
        <p className="text-muted-foreground mb-6">
          Show users potential cost savings by comparing optimized vs. unoptimized prompts. Essential
          for demonstrating the value of prompt engineering and token optimization strategies.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview, useTokenEstimate } from '@clarity-ai/token-optimization/react'
import { useState } from 'react'

interface BeforeAfterCostProps {
  beforeText: string
  afterText: string
  model?: string
}

export function BeforeAfterCostDisplay({
  beforeText,
  afterText,
  model = 'gpt-4-turbo'
}: BeforeAfterCostProps) {
  const before = useTokenEstimate({ text: beforeText, model })
  const after = useTokenEstimate({ text: afterText, model })

  const tokensSaved = before.tokens - after.tokens
  const costSaved = before.inputCost - after.inputCost
  const savingsPercentage = before.tokens > 0
    ? ((tokensSaved / before.tokens) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-4">
      {/* Before state */}
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-red-500">
            ❌ Before Optimization
          </span>
          <TokenCostPreview
            text={beforeText}
            model={model}
            variant="inline"
            className="text-sm text-red-600"
          />
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {beforeText}
        </div>
      </div>

      {/* Savings indicator */}
      <div className="flex items-center justify-center">
        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-sm shadow-lg">
          💰 {savingsPercentage}% Cost Reduction
        </div>
      </div>

      {/* After state */}
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-green-500">
            ✓ After Optimization
          </span>
          <TokenCostPreview
            text={afterText}
            model={model}
            variant="inline"
            className="text-sm text-green-600"
          />
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {afterText}
        </div>
      </div>

      {/* Detailed savings breakdown */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 border border-border rounded-xl">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Tokens Saved</div>
          <div className="text-lg font-bold text-green-500">
            -{tokensSaved.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Cost Saved</div>
          <div className="text-lg font-bold text-green-500">
            -\${costSaved.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  )
}

// Example usage
export function PromptOptimizationDemo() {
  const beforePrompt = \`Please analyze the sentiment of the following customer feedback and provide detailed insights into what aspects customers appreciate and what areas need improvement, along with actionable recommendations for the product team.\`

  const afterPrompt = \`Analyze sentiment and provide insights with recommendations for this customer feedback.\`

  return (
    <BeforeAfterCostDisplay
      beforeText={beforePrompt}
      afterText={afterPrompt}
      model="gpt-4-turbo"
    />
  )
}`}
          filename="BeforeAfterCostDisplay.tsx"
        />

        <div className="mt-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Real-World Optimization Examples</span>
          </h4>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">System Prompt Optimization</span>
                <span className="text-green-500 font-semibold">67% savings</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Removing verbose instructions and using concise directives: 450 tokens → 150 tokens
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Context Trimming</span>
                <span className="text-green-500 font-semibold">82% savings</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Summarizing conversation history instead of full context: 2,200 tokens → 400 tokens
              </div>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Template Simplification</span>
                <span className="text-green-500 font-semibold">54% savings</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Using structured format over natural language: 650 tokens → 300 tokens
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="savings-preview" title="Savings Preview & Optimization Badge">
        <p className="text-muted-foreground mb-6">
          Preview potential savings before sending messages and display optimization badges to
          encourage cost-conscious behavior.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'
import { useState } from 'react'

interface SavingsPreviewProps {
  originalText: string
  optimizedText: string
  model?: string
  onAcceptOptimization?: () => void
}

export function SavingsPreview({
  originalText,
  optimizedText,
  model = 'gpt-4-turbo',
  onAcceptOptimization
}: SavingsPreviewProps) {
  const [useOptimized, setUseOptimized] = useState(false)

  const original = useTokenEstimate({ text: originalText, model })
  const optimized = useTokenEstimate({ text: optimizedText, model })

  const savingsPercentage = original.tokens > 0
    ? Math.round(((original.tokens - optimized.tokens) / original.tokens) * 100)
    : 0

  const showBadge = savingsPercentage >= 30

  return (
    <div className="space-y-4">
      {/* Cost Impact Section */}
      <div className="p-6 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💡</span>
          <span>Preview Savings Before Sending</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current cost */}
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Current Message</div>
            <TokenCostPreview
              text={originalText}
              model={model}
              variant="card"
              className="bg-muted/30"
            />
            <div className="text-xs text-muted-foreground">
              {original.tokens.toLocaleString()} tokens
            </div>
          </div>

          {/* Optimized cost */}
          <div className="space-y-3">
            <div className="text-sm text-green-500 font-medium">
              Optimized Version
              {showBadge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                  ⚡ {savingsPercentage}% Savings
                </span>
              )}
            </div>
            <TokenCostPreview
              text={optimizedText}
              model={model}
              variant="card"
              className="bg-green-500/10 border-green-500/30"
            />
            <div className="text-xs text-green-600">
              {optimized.tokens.toLocaleString()} tokens (-{original.tokens - optimized.tokens})
            </div>
          </div>
        </div>

        {/* Savings summary */}
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-green-500">
                Potential Savings
              </div>
              <div className="text-xs text-muted-foreground">
                Save on every message with optimization
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">
                \${(original.inputCost - optimized.inputCost).toFixed(4)}
              </div>
              <div className="text-xs text-muted-foreground">
                per message
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        {onAcceptOptimization && (
          <button
            onClick={() => {
              setUseOptimized(true)
              onAcceptOptimization()
            }}
            className="mt-4 w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Use Optimized Version →
          </button>
        )}
      </div>
    </div>
  )
}

// Optimization Badge Component
export function OptimizationBadge({
  savingsPercentage,
  size = 'md'
}: {
  savingsPercentage: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  const colorClass = savingsPercentage >= 50
    ? 'from-purple-600 to-pink-600'
    : savingsPercentage >= 30
    ? 'from-green-600 to-emerald-600'
    : 'from-blue-600 to-cyan-600'

  return (
    <span
      className={\`inline-flex items-center gap-1.5 \${sizeClasses[size]} bg-gradient-to-r \${colorClass} text-white rounded-full font-semibold shadow-sm\`}
    >
      <span>⚡</span>
      <span>{savingsPercentage}% Savings</span>
    </span>
  )
}`}
          filename="SavingsPreview.tsx"
        />

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <div className="font-semibold text-purple-500 mb-2 flex items-center gap-2">
              <span>🏆</span>
              <span>Badge Tier System</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full">
                  ⚡ 10-29%
                </span>
                <span>Good savings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full">
                  ⚡ 30-49%
                </span>
                <span>Great savings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                  ⚡ 50%+
                </span>
                <span>Exceptional savings</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">💡 When to Show Badges</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Display for savings ≥30% to highlight significant optimization</li>
              <li>• Use in message composition UI as real-time feedback</li>
              <li>• Show in analytics dashboards for historical performance</li>
              <li>• Include in user profiles to gamify cost reduction</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="message-list" title="Message List Preview">
        <p className="text-muted-foreground mb-6">
          Show cumulative token costs for entire message lists/conversations, helping users
          understand total context window usage and associated costs.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview, useTokenEstimate } from '@clarity-ai/token-optimization/react'
import { useMemo } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface MessageListPreviewProps {
  messages: Message[]
  model?: string
  showPerMessage?: boolean
}

export function MessageListPreview({
  messages,
  model = 'gpt-4-turbo',
  showPerMessage = false
}: MessageListPreviewProps) {
  // Calculate total tokens and cost for entire conversation
  const totalText = useMemo(() => {
    return messages.map(m => m.content).join('\\n')
  }, [messages])

  const total = useTokenEstimate({ text: totalText, model })

  // Calculate average per message
  const avgTokensPerMessage = messages.length > 0
    ? Math.round(total.tokens / messages.length)
    : 0
  const avgCostPerMessage = messages.length > 0
    ? total.inputCost / messages.length
    : 0

  return (
    <div className="space-y-6">
      {/* Conversation summary header */}
      <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">
          Conversation Cost Summary
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Messages</div>
            <div className="text-2xl font-bold">{messages.length}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Tokens</div>
            <div className="text-2xl font-bold">{total.tokens.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-green-500">
              \${total.inputCost.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border grid md:grid-cols-2 gap-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg tokens/message:</span>
            <span className="font-semibold">{avgTokensPerMessage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Avg cost/message:</span>
            <span className="font-semibold">\${avgCostPerMessage.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Optional per-message breakdown */}
      {showPerMessage && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Per-Message Breakdown
          </h4>
          {messages.map((message, index) => {
            const msgEstimate = useTokenEstimate({
              text: message.content,
              model
            })

            return (
              <div
                key={message.id}
                className="p-4 bg-muted/30 border border-border rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className={\`text-xs px-2 py-0.5 rounded-full \${
                      message.role === 'user'
                        ? 'bg-blue-500/10 text-blue-500'
                        : message.role === 'assistant'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-purple-500/10 text-purple-500'
                    }\`}>
                      {message.role}
                    </span>
                  </div>
                  <TokenCostPreview
                    text={message.content}
                    model={model}
                    variant="inline"
                    className="text-xs"
                  />
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {message.content}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Context window usage warning */}
      {total.tokens > 4000 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2">
            <span>⚠️</span>
            <span>High Context Usage</span>
          </div>
          <div className="text-sm text-muted-foreground">
            This conversation is using {total.tokens.toLocaleString()} tokens. Consider summarizing
            older messages to reduce costs and stay within context limits.
          </div>
        </div>
      )}
    </div>
  )
}`}
          filename="MessageListPreview.tsx"
        />

        <div className="mt-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>Scaling Impact Example</span>
          </h4>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              A customer support conversation with 20 messages:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Short Messages</div>
                <div className="font-semibold">2,000 tokens</div>
                <div className="text-xs text-green-500">$0.06 total</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Medium Messages</div>
                <div className="font-semibold">4,500 tokens</div>
                <div className="text-xs text-yellow-500">$0.14 total</div>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Long Messages</div>
                <div className="font-semibold">8,000 tokens</div>
                <div className="text-xs text-red-500">$0.24 total</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-4 border-t border-border">
              At 100 conversations/day, the difference between short and long messages is
              $5,400/month in costs.
            </p>
          </div>
        </div>
      </Section>

      <Section id="hook-interface" title="Hook Interface">
        <p className="text-muted-foreground mb-6">
          The useTokenEstimate hook provides programmatic access to token and cost estimation.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useTokenEstimate } from '@clarity-ai/token-optimization/react'

export function CustomEstimator() {
  const [text, setText] = useState('')

  const {
    tokens,
    inputCost,
    model,
    isStale,
    isLoading,
    error
  } = useTokenEstimate(text, 'gpt-4-turbo', { throttleMs: 150 })

  return (
    <div>
      {isLoading && <span>Calculating...</span>}
      {error && <span className="text-red-500">{error.message}</span>}
      {!isLoading && !error && (
        <div className={isStale ? 'opacity-50' : ''}>
          <div>Tokens: {tokens.toLocaleString()}</div>
          <div>Cost: ${inputCost.toFixed(4)}</div>
          <div>Model: {model}</div>
        </div>
      )}
    </div>
  )
}`}
          filename="CustomEstimator.tsx"
        />

        <div className="mt-6">
          <h4 className="font-semibold mb-4">Hook Return Values</h4>
          <PropsTable props={hookInterface} />
        </div>
      </Section>

      <Section id="multi-model" title="Multi-Model Comparison">
        <p className="text-muted-foreground mb-6">
          Compare costs across different LLM models to help users make informed decisions.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

const MODELS = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', price: '$0.03/1K' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', price: '$0.002/1K' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', price: '$0.015/1K' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', price: '$0.003/1K' },
]

export function ModelComparison({ text }: { text: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {MODELS.map((model) => (
        <div
          key={model.id}
          className="p-4 bg-muted/30 border border-border rounded-xl"
        >
          <div className="text-sm font-medium mb-2">{model.name}</div>
          <div className="text-xs text-muted-foreground mb-3">{model.price}</div>

          <TokenCostPreview
            text={text}
            model={model.id}
            variant="inline"
            className="text-sm"
          />
        </div>
      ))}
    </div>
  )
}`}
          filename="ModelComparison.tsx"
        />

        <div className="mt-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Example: Cost Comparison for 1000-token prompt</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>GPT-4 Turbo:</span>
                <span className="font-mono font-semibold">$0.030</span>
              </div>
              <div className="flex justify-between">
                <span>Claude 3 Opus:</span>
                <span className="font-mono font-semibold">$0.015</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Claude 3 Sonnet:</span>
                <span className="font-mono font-semibold text-green-500">$0.003</span>
              </div>
              <div className="flex justify-between">
                <span>GPT-3.5 Turbo:</span>
                <span className="font-mono font-semibold text-green-500">$0.002</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            Switching from GPT-4 to Claude 3 Sonnet can reduce costs by 90% for similar
            performance on many tasks.
          </div>
        </div>
      </Section>

      <Section id="budget-alerts" title="Budget Threshold Alerts">
        <p className="text-muted-foreground mb-6">
          Warn users when their prompts approach or exceed budget thresholds.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'
import { useState } from 'react'

const BUDGET_THRESHOLDS = {
  warning: 0.01,  // $0.01
  danger: 0.05,   // $0.05
  critical: 0.10, // $0.10
}

export function BudgetAlertPromptEditor() {
  const [prompt, setPrompt] = useState('')
  const [currentCost, setCurrentCost] = useState(0)

  const getAlertLevel = (cost: number) => {
    if (cost >= BUDGET_THRESHOLDS.critical) return 'critical'
    if (cost >= BUDGET_THRESHOLDS.danger) return 'danger'
    if (cost >= BUDGET_THRESHOLDS.warning) return 'warning'
    return 'safe'
  }

  const alertLevel = getAlertLevel(currentCost)

  return (
    <div className="space-y-4">
      {/* Budget indicator bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={\`h-full transition-all duration-300 \${
            alertLevel === 'critical' ? 'bg-red-500' :
            alertLevel === 'danger' ? 'bg-orange-500' :
            alertLevel === 'warning' ? 'bg-yellow-500' :
            'bg-green-500'
          }\`}
          style={{
            width: \`\${Math.min((currentCost / BUDGET_THRESHOLDS.critical) * 100, 100)}%\`
          }}
        />
      </div>

      {/* Alert message */}
      {alertLevel !== 'safe' && (
        <div className={\`p-4 rounded-xl border \${
          alertLevel === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
          alertLevel === 'danger' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
          'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
        }\`}>
          <div className="flex items-center gap-2 font-semibold mb-1">
            <span>{alertLevel === 'critical' ? '🚨' : alertLevel === 'danger' ? '⚠️' : '💡'}</span>
            <span>
              {alertLevel === 'critical' ? 'Cost Critical!' :
               alertLevel === 'danger' ? 'High Cost Warning' :
               'Approaching Budget Limit'}
            </span>
          </div>
          <div className="text-sm opacity-90">
            This prompt costs ${currentCost.toFixed(4)}. Consider using a more efficient model
            or optimizing your prompt.
          </div>
        </div>
      )}

      {/* Prompt textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full h-32 p-4 border rounded-lg"
      />

      {/* Cost preview with callback */}
      <TokenCostPreview
        text={prompt}
        model="gpt-4-turbo"
        variant="card"
        onCostChange={(cost) => setCurrentCost(cost)}
      />
    </div>
  )
}`}
          filename="BudgetAlertPromptEditor.tsx"
        />

        <div className="mt-6 space-y-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="font-semibold text-yellow-500 mb-2">💡 Best Practice: Progressive Warnings</div>
            <p className="text-sm text-muted-foreground">
              Implement multiple threshold levels (warning, danger, critical) to gently guide users
              toward cost-effective prompts before blocking submissions.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">💼 Enterprise Pattern: Budget Pools</div>
            <p className="text-sm text-muted-foreground">
              For team/organization accounts, track cumulative daily/monthly spending and show
              percentage of budget consumed. Prevents surprise overage charges.
            </p>
          </div>
        </div>
      </Section>

      <Section id="animations" title="Animation & Transition Options">
        <p className="text-muted-foreground mb-6">
          Configure animations and transitions for cost updates to provide smooth visual feedback
          while respecting user accessibility preferences.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// Custom animated wrapper for TokenCostPreview
export function AnimatedCostPreview({
  text,
  model = 'gpt-4-turbo'
}: {
  text: string
  model?: string
}) {
  const { tokens, inputCost } = useTokenEstimate({ text, model })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={\`\${tokens}-\${inputCost}\`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{
          duration: 0.2,
          ease: [0.25, 0.1, 0.25, 1.0] // Custom easing
        }}
      >
        <TokenCostPreview
          text={text}
          model={model}
          variant="card"
        />
      </motion.div>
    </AnimatePresence>
  )
}

// Pulsing badge for significant cost changes
export function PulsingCostBadge({
  text,
  model = 'gpt-4-turbo',
  costThreshold = 0.01
}: {
  text: string
  model?: string
  costThreshold?: number
}) {
  const { inputCost } = useTokenEstimate({ text, model })
  const shouldPulse = inputCost > costThreshold

  return (
    <motion.div
      animate={shouldPulse ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 0 rgba(239, 68, 68, 0)',
          '0 0 0 8px rgba(239, 68, 68, 0.2)',
          '0 0 0 0 rgba(239, 68, 68, 0)'
        ]
      } : {}}
      transition={{
        duration: 2,
        repeat: shouldPulse ? Infinity : 0,
        ease: 'easeInOut'
      }}
      className={\`inline-block rounded-lg \${
        shouldPulse ? 'bg-red-500/10 border-red-500/30' : ''
      }\`}
    >
      <TokenCostPreview
        text={text}
        model={model}
        variant="inline"
        className={shouldPulse ? 'text-red-500 font-semibold' : ''}
      />
    </motion.div>
  )
}

// Slide-in cost comparison
export function SlidingCostComparison({
  beforeText,
  afterText,
  model = 'gpt-4-turbo'
}: {
  beforeText: string
  afterText: string
  model?: string
}) {
  const [showAfter, setShowAfter] = useState(false)

  const before = useTokenEstimate({ text: beforeText, model })
  const after = useTokenEstimate({ text: afterText, model })
  const savings = before.inputCost - after.inputCost

  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: showAfter ? '-100%' : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex"
      >
        {/* Before state */}
        <div className="min-w-full p-6 bg-muted/30 border border-border rounded-xl">
          <div className="text-sm font-semibold mb-3">Current Cost</div>
          <TokenCostPreview
            text={beforeText}
            model={model}
            variant="card"
          />
        </div>

        {/* After state */}
        <div className="min-w-full p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="text-sm font-semibold text-green-500 mb-3">
            Optimized Cost
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
              -\${savings.toFixed(4)}
            </span>
          </div>
          <TokenCostPreview
            text={afterText}
            model={model}
            variant="card"
          />
        </div>
      </motion.div>

      <button
        onClick={() => setShowAfter(!showAfter)}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        {showAfter ? '← Show Current' : 'Show Optimized →'}
      </button>
    </div>
  )
}

// Number counter animation for token count
export function AnimatedTokenCounter({
  text,
  model = 'gpt-4-turbo'
}: {
  text: string
  model?: string
}) {
  const { tokens } = useTokenEstimate({ text, model })

  return (
    <motion.span
      key={tokens}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="font-mono text-2xl font-bold"
    >
      {tokens.toLocaleString()}
    </motion.span>
  )
}

// Respecting prefers-reduced-motion
export function AccessibleAnimatedPreview({
  text,
  model = 'gpt-4-turbo'
}: {
  text: string
  model?: string
}) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const { tokens, inputCost } = useTokenEstimate({ text, model })

  const variants = prefersReducedMotion
    ? {
        // No animation for users who prefer reduced motion
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      }
    : {
        // Smooth animations for others
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
      }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      <TokenCostPreview
        text={text}
        model={model}
        variant="card"
      />
    </motion.div>
  )
}`}
          filename="AnimatedCostPreview.tsx"
        />

        <div className="mt-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>🎨</span>
              <span>Animation Best Practices</span>
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Keep Durations Short:</strong> Use 200-300ms
                  for cost updates to avoid feeling sluggish during typing
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Use Easing Functions:</strong> Custom easing
                  (like cubic-bezier) makes transitions feel more natural
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Respect Reduced Motion:</strong> ALWAYS check
                  prefers-reduced-motion and disable animations for accessibility
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Highlight Significant Changes:</strong> Use
                  pulsing or color changes only for important cost thresholds
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-xl shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Avoid Animation Overload:</strong> Too many
                  simultaneous animations distract from content
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-500 mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>Performance Considerations</span>
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Animations on every keystroke can impact performance. The TokenCostPreview component
                already includes throttling (default 100ms), but additional animation layers should
                be lightweight.
              </p>
              <div className="p-3 bg-background rounded-lg border border-border">
                <div className="font-semibold text-foreground mb-2">Recommended Approach</div>
                <ul className="space-y-1 text-xs ml-4">
                  <li>• Use CSS transitions for simple opacity/color changes</li>
                  <li>• Reserve Framer Motion for complex state transitions</li>
                  <li>• Apply will-change CSS property sparingly</li>
                  <li>• Throttle animations to match component throttleMs prop</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-purple-500 mb-4">Built-in Transitions</h4>
            <p className="text-sm text-muted-foreground mb-3">
              TokenCostPreview includes subtle built-in transitions that respect user preferences:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                <span>Opacity fade during stale state</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">150ms ease</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                <span>Disabled when prefers-reduced-motion</span>
                <code className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                  Auto-detected
                </code>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="custom-formatters" title="Custom Formatters">
        <p className="text-muted-foreground mb-6">
          Override default formatting logic for tokens and costs to match your application's style.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

// Custom cost formatter with currency symbol positioning
const formatCostEuro = (cost: number): string => {
  if (cost < 0.0001) return '€0.00'
  if (cost < 0.01) return \`€\${cost.toFixed(4)}\`
  if (cost < 1) return \`€\${cost.toFixed(3)}\`
  return \`€\${cost.toFixed(2)}\`
}

// Custom token formatter with full number spelling
const formatTokensVerbose = (tokens: number): string => {
  if (tokens < 1000) return \`\${tokens} tokens\`
  if (tokens < 1_000_000) {
    return \`\${(tokens / 1000).toFixed(1)}K tokens\`
  }
  return \`\${(tokens / 1_000_000).toFixed(2)}M tokens\`
}

// Color-coded cost formatter
const formatCostWithThreshold = (cost: number): string => {
  const formatted = cost < 0.0001 ? '$0.00' : \`$\${cost.toFixed(4)}\`

  // Could return JSX here for color-coding, but formatCost expects string
  // Use className prop on TokenCostPreview for dynamic styling instead
  return formatted
}

export function CustomFormattedPreview({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {/* Euro formatting */}
      <TokenCostPreview
        text={text}
        model="gpt-4-turbo"
        formatCost={formatCostEuro}
      />

      {/* Verbose token display */}
      <TokenCostPreview
        text={text}
        model="gpt-4-turbo"
        formatTokens={formatTokensVerbose}
      />

      {/* Both custom formatters */}
      <TokenCostPreview
        text={text}
        model="gpt-4-turbo"
        formatCost={formatCostEuro}
        formatTokens={formatTokensVerbose}
        variant="card"
      />
    </div>
  )
}`}
          filename="CustomFormatters.tsx"
        />

        <div className="mt-6 bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-4">Default Formatter Behavior</h4>
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-medium mb-2">Cost Formatting (formatCost)</div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• &lt; $0.0001: Shows $0.00</li>
                <li>• &lt; $0.01: Shows 4 decimal places (e.g., $0.0007)</li>
                <li>• &lt; $1.00: Shows 3 decimal places (e.g., $0.142)</li>
                <li>• ≥ $1.00: Shows 2 decimal places (e.g., $12.45)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-2">Token Formatting (formatTokens)</div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• &lt; 1,000: Shows exact count (e.g., 847)</li>
                <li>• &lt; 10,000: Shows K with 1 decimal (e.g., 5.3K)</li>
                <li>• ≥ 10,000: Shows rounded K (e.g., 47K)</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section id="integration" title="Integration Examples">
        <p className="text-muted-foreground mb-6">
          Common integration patterns for different use cases.
        </p>

        <div className="space-y-8">
          {/* Inline variant */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Inline Variant (Minimal Footprint)</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

export function CompactPromptInput() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-24 p-3 pr-32 border rounded-lg text-sm"
        placeholder="Quick prompt..."
      />

      {/* Positioned in bottom-right of textarea */}
      <div className="absolute bottom-2 right-2">
        <TokenCostPreview
          text={prompt}
          model="gpt-3.5-turbo"
          variant="inline"
          className="text-xs text-muted-foreground"
        />
      </div>
    </div>
  )
}`}
              filename="CompactPromptInput.tsx"
            />
          </div>

          {/* Card variant */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Card Variant (Prominent Display)</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

export function ProminentCostDisplay() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-4 border rounded-lg"
      />

      {/* Glassmorphism card with backdrop blur */}
      <TokenCostPreview
        text={prompt}
        model="gpt-4-turbo"
        variant="card"
        showLoading={true}
      />
    </div>
  )
}`}
              filename="ProminentCostDisplay.tsx"
            />
          </div>

          {/* With callbacks */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>With Callbacks (Advanced Control)</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'
import { useState, useCallback } from 'react'

export function CallbackIntegration() {
  const [prompt, setPrompt] = useState('')
  const [canSubmit, setCanSubmit] = useState(true)
  const [costHistory, setCostHistory] = useState<number[]>([])

  const handleCostChange = useCallback((cost: number, tokens: number) => {
    // Update submission gate
    setCanSubmit(cost < 0.10)

    // Track cost history for analytics
    setCostHistory(prev => [...prev.slice(-9), cost])

    // Log to analytics
    console.log('Token usage:', { cost, tokens, timestamp: Date.now() })
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('Estimation failed:', error)
    // Show user-friendly error message
  }, [])

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-4 border rounded-lg"
      />

      <TokenCostPreview
        text={prompt}
        model="gpt-4-turbo"
        variant="card"
        onCostChange={handleCostChange}
        onError={handleError}
      />

      <button
        disabled={!canSubmit}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
      >
        {canSubmit ? 'Submit Prompt' : 'Cost Exceeds Budget ($0.10)'}
      </button>

      {/* Cost trend indicator */}
      {costHistory.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Average prompt cost: ${(costHistory.reduce((a, b) => a + b, 0) / costHistory.length).toFixed(4)}
        </div>
      )}
    </div>
  )
}`}
              filename="CallbackIntegration.tsx"
            />
          </div>

          {/* Error handling */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>4️⃣</span>
              <span>Custom Error Handling</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCostPreview } from '@clarity-ai/token-optimization/react'

export function RobustErrorHandling() {
  const [prompt, setPrompt] = useState('')

  const renderError = (error: Error) => {
    // Custom error UI with retry action
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-red-500">
          <span>⚠️</span>
          <span>Estimation failed</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-32 p-4 border rounded-lg"
      />

      <TokenCostPreview
        text={prompt}
        model="gpt-4-turbo"
        variant="card"
        showError={true}
        renderError={renderError}
      />
    </div>
  )
}`}
              filename="ErrorHandling.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <p className="text-muted-foreground mb-6">
          TokenCostPreview is built with accessibility as a first-class concern.
        </p>

        <div className="space-y-6">
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Built-in Accessibility Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">ARIA Labels:</strong> Meaningful labels for
                  screen readers (customize with ariaLabel prop)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Live Regions:</strong> Cost updates announced
                  to screen readers with aria-live="polite"
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Reduced Motion:</strong> Respects
                  prefers-reduced-motion for animations
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Focus Management:</strong> Proper focus
                  indicators and keyboard navigation
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Color Independence:</strong> Cost thresholds
                  communicated through text and icons, not just color
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Custom ARIA Label Example</h4>
            <CodeBlock
              language="tsx"
              code={`<TokenCostPreview
  text={prompt}
  model="gpt-4-turbo"
  ariaLabel="Estimated cost for current prompt based on GPT-4 Turbo pricing"
  id="prompt-cost-estimate"
/>`}
              filename="AccessiblePreview.tsx"
            />
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="font-semibold text-blue-500 mb-2">🎯 WCAG Compliance</div>
            <p className="text-sm text-muted-foreground">
              TokenCostPreview meets WCAG 2.1 Level AA standards with sufficient color contrast,
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
              Dashboard UI for displaying optimization statistics and performance metrics
            </p>
          </a>

          <a
            href="/reference/components/token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCounter →
            </h4>
            <p className="text-sm text-muted-foreground">
              Lightweight token counting with threshold warnings and color-coded indicators
            </p>
          </a>

          <a
            href="/reference/hooks/use-token-estimate"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenEstimate Hook →
            </h4>
            <p className="text-sm text-muted-foreground">
              Headless hook for custom token estimation UIs with full control
            </p>
          </a>

          <a
            href="/reference/core/tokenizer"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              Tokenizer Core →
            </h4>
            <p className="text-sm text-muted-foreground">
              Low-level tokenization engine with model-specific encoding
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
