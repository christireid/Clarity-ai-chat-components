import type { Metadata } from 'next'
import Link from 'next/link'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'Token Optimization System | Clarity AI Chat Components',
  description:
    'Complete guide to token optimization with cost estimation, usage monitoring, and budget management for LLM applications.',
  openGraph: {
    title: 'Token Optimization System',
    description: 'Manage LLM costs and context windows effectively',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'why-optimize', title: 'Why Token Optimization', level: 2 },
  { id: 'architecture', title: 'System Architecture', level: 2 },
  { id: 'components', title: 'Core Components', level: 2 },
  { id: 'quick-start', title: 'Quick Start', level: 2 },
  { id: 'integration-patterns', title: 'Integration Patterns', level: 2 },
  { id: 'cost-analysis', title: 'Cost Analysis', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
  { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
]

export default function TokenOptimizationOverviewPage() {
  return (
    <DocumentationPage
      title="Token Optimization System"
      description="Complete token management solution for cost control and context window optimization"
      category="Token Optimization"
      icon="⚡"
      badges={[
        { label: 'System Overview', variant: 'info' },
        { label: 'Cost Management', variant: 'success' },
        { label: 'Production Ready', variant: 'primary' },
      ]}
      features={[
        'Real-time token counting and cost estimation',
        'Context window usage monitoring',
        'Budget threshold alerts and warnings',
        'Optimization statistics dashboard',
        'Multi-model pricing support',
        'Smart message pruning suggestions',
        'ROI calculation and reporting',
        'Production-grade performance',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          The Token Optimization System provides a comprehensive suite of components for managing
          LLM costs and context window limits in production applications. Built for real-world use
          cases where token budgets and conversation length matter.
        </p>

        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>System Goals</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Cost Transparency</h4>
              <p className="text-sm text-muted-foreground">
                Show users exactly how much their prompts cost before submission, preventing
                surprise bills and budget overruns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Context Management</h4>
              <p className="text-sm text-muted-foreground">
                Warn users before hitting context limits, suggest pruning, and maintain
                conversation quality as usage grows.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Usage Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track optimization statistics, savings, and performance metrics for continuous
                improvement and reporting.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-foreground">User Empowerment</h4>
              <p className="text-sm text-muted-foreground">
                Give users control over their costs with budget alerts, model comparisons, and
                optimization recommendations.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="why-optimize" title="Why Token Optimization">
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
              <span>💸</span>
              <span>The Cost Problem</span>
            </h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Without token optimization, LLM costs can quickly spiral out of control:
              </p>
              <ul className="space-y-2 ml-4">
                <li>
                  • <strong className="text-foreground">GPT-4</strong>: A 10,000-token conversation
                  costs $0.30 (input + output)
                </li>
                <li>
                  • <strong className="text-foreground">Scale Impact</strong>: 1,000 conversations/day
                  = $300/day = $9,000/month
                </li>
                <li>
                  • <strong className="text-foreground">Context Growth</strong>: Long conversations
                  exponentially increase costs as context window fills
                </li>
                <li>
                  • <strong className="text-foreground">Invisible Usage</strong>: Users unaware
                  they're generating expensive prompts
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>The Optimization Solution</span>
            </h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Token optimization delivers measurable business impact:
              </p>
              <ul className="space-y-2 ml-4">
                <li>
                  • <strong className="text-foreground">Cost Savings</strong>: 40-70% reduction in
                  token usage through smart optimization
                </li>
                <li>
                  • <strong className="text-foreground">User Trust</strong>: Transparent pricing
                  builds confidence and adoption
                </li>
                <li>
                  • <strong className="text-foreground">Scalability</strong>: Controlled costs
                  enable sustainable growth
                </li>
                <li>
                  • <strong className="text-foreground">Better UX</strong>: Proactive warnings
                  prevent frustration from truncated conversations
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold text-blue-500 mb-3">Real-World Example</h4>
            <div className="text-sm space-y-3">
              <p className="text-muted-foreground">
                A customer support platform handling 500 conversations/day:
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Without Optimization</div>
                  <div className="text-2xl font-bold text-red-500">$4,500/mo</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Average 15K tokens per conversation
                  </div>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">With Optimization</div>
                  <div className="text-2xl font-bold text-green-500">$1,800/mo</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Average 6K tokens per conversation (-60%)
                  </div>
                </div>
              </div>
              <p className="text-green-500 font-semibold">
                Annual Savings: $32,400 | ROI: 15,000%+ (assuming $200 integration cost)
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="architecture" title="System Architecture">
        <p className="text-muted-foreground mb-6">
          The token optimization system consists of three core components that work together to
          provide complete cost and context management.
        </p>

        <div className="bg-muted/30 border border-border rounded-xl p-8 mb-8">
          <div className="space-y-8">
            {/* Component hierarchy diagram */}
            <div className="text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                <div className="font-semibold">User Types Prompt</div>
              </div>
              <div className="my-4 text-muted-foreground">↓</div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                  <div className="font-semibold mb-2">1. TokenCostPreview</div>
                  <div className="text-xs text-muted-foreground">
                    Real-time cost estimation as they type
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <div className="font-semibold mb-2">2. TokenCounter</div>
                  <div className="text-xs text-muted-foreground">
                    Usage warnings before hitting limits
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                  <div className="font-semibold mb-2">3. OptimizationPanel</div>
                  <div className="text-xs text-muted-foreground">
                    Long-term analytics and savings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Component Responsibilities</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Component</th>
                  <th className="text-left py-3 px-4 font-semibold">Primary Function</th>
                  <th className="text-left py-3 px-4 font-semibold">Use Case</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">TokenCostPreview</td>
                  <td className="py-3 px-4">Economic awareness</td>
                  <td className="py-3 px-4">Show costs before submission</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">TokenCounter</td>
                  <td className="py-3 px-4">Context management</td>
                  <td className="py-3 px-4">Warn before hitting limits</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground">OptimizationPanel</td>
                  <td className="py-3 px-4">Performance analytics</td>
                  <td className="py-3 px-4">Track savings over time</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section id="components" title="Core Components">
        <div className="grid md:grid-cols-3 gap-6">
          {/* TokenCostPreview */}
          <Link
            href="/reference/components/token-cost-preview"
            className="group p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 rounded-xl transition-all"
          >
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-500 transition-colors">
              TokenCostPreview
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time cost estimation as users type. Essential for budget-conscious applications.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Live token counting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Model-specific pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Budget threshold alerts</span>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-amber-600 group-hover:text-amber-500">
              View documentation →
            </div>
          </Link>

          {/* TokenCounter */}
          <Link
            href="/reference/components/token-counter"
            className="group p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-500 transition-colors">
              TokenCounter
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Visual progress bars with threshold warnings. Prevents message loss from context
              overflow.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Color-coded progress bar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>80% and 95% warnings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Smart pruning suggestions</span>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-green-600 group-hover:text-green-500">
              View documentation →
            </div>
          </Link>

          {/* TokenOptimizationPanel */}
          <Link
            href="/reference/components/token-optimization-panel"
            className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all"
          >
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-500 transition-colors">
              TokenOptimizationPanel
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive dashboard for optimization statistics and performance analytics.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Savings tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Method breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Cache hit rate analysis</span>
              </div>
            </div>
            <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-500">
              View documentation →
            </div>
          </Link>
        </div>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <p className="text-muted-foreground mb-6">
          Get started with token optimization in under 5 minutes.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">1. Installation</h4>
            <CodeBlock
              language="bash"
              code={`# Install React components package
pnpm add @clarity-chat/react

# Or token-optimization package specifically
pnpm add @clarity-chat/token-optimization`}
              filename="terminal"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">2. Basic Integration</h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenCostPreview, TokenCounter } from '@clarity-chat/react'

export function ChatWindow() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const currentTokens = calculateTokens(messages)
  const maxTokens = 4096

  return (
    <div className="chat-container">
      {/* Messages area */}
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* Input with cost preview */}
      <div className="input-area">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message..."
        />

        {/* Real-time cost estimation */}
        <TokenCostPreview
          text={prompt}
          model="gpt-4-turbo"
        />

        {/* Context usage indicator */}
        <TokenCounter
          currentTokens={currentTokens}
          maxTokens={maxTokens}
        />
      </div>
    </div>
  )
}`}
              filename="ChatWindow.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">3. Add Analytics Dashboard</h4>
            <CodeBlock
              language="tsx"
              code={`import { TokenOptimizationPanel } from '@clarity-chat/react'

export function AdminDashboard() {
  const stats = useTokenOptimizationStats()

  return (
    <div className="dashboard">
      <TokenOptimizationPanel
        stats={stats}
        onMethodClick={(method) => {
          console.log('Clicked method:', method)
        }}
      />
    </div>
  )
}`}
              filename="AdminDashboard.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="integration-patterns" title="Integration Patterns">
        <div className="space-y-8">
          {/* Pattern 1 */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>1️⃣</span>
              <span>Single Chat Window (Most Common)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Integrate TokenCostPreview and TokenCounter directly in your chat interface.
            </p>
            <CodeBlock
              language="tsx"
              code={`export function ChatInterface() {
  return (
    <div className="h-screen flex flex-col">
      <MessageList messages={messages} />

      <div className="border-t p-4 space-y-3">
        {/* Token usage at 80% - show warning */}
        <TokenCounter
          currentTokens={3276}
          maxTokens={4096}
          suggestPruning={true}
          onPruneSuggested={handlePrune}
        />

        <div className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1"
          />

          {/* Show cost next to send button */}
          <TokenCostPreview
            text={prompt}
            model="gpt-4-turbo"
            variant="inline"
          />

          <button>Send</button>
        </div>
      </div>
    </div>
  )
}`}
              filename="SingleChatWindow.tsx"
            />
          </div>

          {/* Pattern 2 */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>2️⃣</span>
              <span>Admin Dashboard (Analytics)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Use TokenOptimizationPanel for system-wide metrics and ROI tracking.
            </p>
            <CodeBlock
              language="tsx"
              code={`export function TokenAnalyticsDashboard() {
  const stats = {
    totalOptimizations: 1847,
    totalTokensSaved: 3_425_890,
    averageSavings: 67.4,
    securityEvents: 3,
    cacheHitRate: 83.2,
    methods: {
      'toon': 892,
      'llmlingua': 534,
      'semantic': 287,
      'truncation': 134
    }
  }

  return (
    <div className="grid gap-6">
      <TokenOptimizationPanel
        stats={stats}
        showMethodBreakdown={true}
        onMethodClick={(method) => {
          router.push(\`/analytics/methods/\${method}\`)
        }}
      />
    </div>
  )
}`}
              filename="AnalyticsDashboard.tsx"
            />
          </div>

          {/* Pattern 3 */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>3️⃣</span>
              <span>Model Comparison (Settings)</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Help users choose cost-effective models with side-by-side comparisons.
            </p>
            <CodeBlock
              language="tsx"
              code={`const MODELS = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
]

export function ModelSelector() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="grid grid-cols-3 gap-4">
      {MODELS.map((model) => (
        <div key={model.id} className="p-4 border rounded-xl">
          <h3 className="font-semibold mb-3">{model.name}</h3>

          <TokenCostPreview
            text={prompt}
            model={model.id}
            variant="card"
          />
        </div>
      ))}
    </div>
  )
}`}
              filename="ModelComparison.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="cost-analysis" title="Cost Analysis">
        <p className="text-muted-foreground mb-6">
          Understanding the financial impact of token optimization.
        </p>

        <div className="space-y-6">
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h4 className="font-semibold mb-4">Monthly Cost Comparison</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Volume</th>
                  <th className="text-right py-3 px-4 font-semibold">Without Optimization</th>
                  <th className="text-right py-3 px-4 font-semibold">With Optimization</th>
                  <th className="text-right py-3 px-4 font-semibold">Monthly Savings</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">100 conversations/day</td>
                  <td className="py-3 px-4 text-right font-mono text-red-500">$900</td>
                  <td className="py-3 px-4 text-right font-mono text-green-500">$360</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-green-500">
                    $540
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">500 conversations/day</td>
                  <td className="py-3 px-4 text-right font-mono text-red-500">$4,500</td>
                  <td className="py-3 px-4 text-right font-mono text-green-500">$1,800</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-green-500">
                    $2,700
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">1,000 conversations/day</td>
                  <td className="py-3 px-4 text-right font-mono text-red-500">$9,000</td>
                  <td className="py-3 px-4 text-right font-mono text-green-500">$3,600</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-green-500">
                    $5,400
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-xs text-muted-foreground">
              Assumes GPT-4 Turbo pricing, average 15K tokens per conversation unoptimized, 6K
              tokens optimized (60% reduction)
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
              <h4 className="font-semibold text-green-500 mb-3">Break-Even Analysis</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integration cost:</span>
                  <span className="font-mono">$200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly savings (500/day):</span>
                  <span className="font-mono text-green-500">$2,700</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-semibold">Break-even time:</span>
                  <span className="font-mono font-bold">2.7 days</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h4 className="font-semibold text-blue-500 mb-3">3-Year ROI</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total savings (3 years):</span>
                  <span className="font-mono">$97,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total cost:</span>
                  <span className="font-mono">$200</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-semibold">ROI:</span>
                  <span className="font-mono font-bold text-green-500">48,500%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>1. Show Costs Early and Often</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Display TokenCostPreview as users type, not just after submission. This encourages
              cost-conscious behavior and builds trust.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Example:</strong> Place cost preview next to the
              send button or in the input footer area.
            </div>
          </div>

          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h4 className="font-semibold text-yellow-500 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>2. Warn Before It's Too Late</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use TokenCounter with 80% and 95% thresholds. Give users time to prune before
              automatic truncation occurs.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Anti-pattern:</strong> Only warning at 99% usage
              gives no time to react.
            </div>
          </div>

          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>3. Make Pruning Easy</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              When TokenCounter hits critical threshold, show a clear "Prune old messages" button.
              Don't make users figure out how to free up space.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Implementation:</strong> Use suggestPruning prop
              with onPruneSuggested callback for one-click pruning.
            </div>
          </div>

          <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h4 className="font-semibold text-purple-500 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>4. Track and Report Savings</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use TokenOptimizationPanel in admin dashboards to demonstrate ROI to stakeholders.
              Show both absolute savings and percentage reduction.
            </p>
            <div className="text-xs text-muted-foreground bg-background rounded-lg p-3">
              <strong className="text-foreground">Business Impact:</strong> Quantifiable savings
              justify continued investment in optimization infrastructure.
            </div>
          </div>
        </div>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Common Issues</h4>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: Cost estimates are inaccurate</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Wrong model specified or
                  outdated pricing data
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Verify model prop matches
                  actual LLM being used. Update pricing constants if models have changed rates.
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: TokenCounter warnings not firing</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> currentTokens not updated or
                  callbacks not provided
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Ensure currentTokens prop
                  updates with message changes. Add onWarning and onCritical callbacks.
                </div>
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span>Issue: Performance degradation with live typing</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Cause:</strong> Excessive re-renders from
                  TokenCostPreview
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Solution:</strong> Increase throttleMs prop
                  (default 100ms). For very long texts, consider 200-300ms.
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h4 className="font-semibold text-blue-500 mb-3">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you encounter issues not covered here:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Check component-specific documentation for detailed props and examples</li>
              <li>• Review the source code in packages/token-optimization/</li>
              <li>• Open a GitHub issue with reproduction steps</li>
            </ul>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
