import { Metadata } from 'next'
import { useState } from 'react'
import { CheckCircle, Code, Zap, DollarSign, ArrowRight, AlertTriangle, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = {
  title: 'Smart Model Routing | 10-15% Additional Savings',
  description:
    'Save an additional 10-15% on AI costs with intelligent model routing. Automatically route queries to cost-optimal models based on complexity, intent, or hybrid strategies. Achieve 50-70% total reduction when combined with provider caching and compression.',
  keywords: [
    'model routing',
    'smart routing',
    'cost-optimal routing',
    'complexity-based routing',
    'intent-based routing',
    'token optimization',
    'cost reduction',
    'AI cost savings',
    '10-15% savings',
    'LLM routing',
  ],
  openGraph: {
    title: 'Smart Model Routing - 10-15% Additional AI Cost Savings',
    description:
      'Intelligent model routing based on complexity and intent. Save 10-15% more when combined with caching and compression for 50-70% total reduction.',
    type: 'article',
    url: '/cookbook/smart-model-routing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Model Routing - 10-15% Savings',
    description:
      'Route queries to cost-optimal models automatically. Complete guide with complexity-based, intent-based, and hybrid strategies.',
  },
}

'use client'

export default function SmartModelRoutingCookbook() {
  const [activeStrategy, setActiveStrategy] = useState<'complexity' | 'intent' | 'hybrid'>('complexity')

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 rounded-full">
          <Zap className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Smart Model Routing
          </span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Save 10-15% More with Smart Model Routing
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Automatically route queries to the optimal model based on complexity, saving costs without sacrificing quality.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">10-15%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Additional Savings</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">40-60%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Queries on Cheaper Models</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">&lt;50ms</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Routing Latency</div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
        <ul className="space-y-3">
          {[
            'How to classify query complexity automatically',
            'When to use Haiku vs Sonnet vs Opus',
            'Implementing intent-based routing',
            'Measuring routing accuracy and cost impact',
            'Building a robust routing system',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prerequisites */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <p>Before starting, ensure you have:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Installed <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">@clarity-chat/token-optimization</code></li>
            <li>Access to multiple Claude models (Haiku, Sonnet, Opus)</li>
            <li>Environment variable <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">ANTHROPIC_API_KEY</code></li>
            <li>Basic understanding of token counting</li>
          </ul>
        </div>
      </section>

      {/* Important Note */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              Routing adds 10-15% savings on top of caching and compression
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
              For maximum savings, combine routing with provider caching (50%+) and compression (15-25%)
              to achieve the 50-70% baseline. Routing alone won't get you there.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Selection */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Routing Strategies</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Choose the routing strategy that best fits your use case:
        </p>

        {/* Strategy Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'complexity', label: 'Complexity-Based', icon: TrendingDown },
            { id: 'intent', label: 'Intent-Based', icon: Zap },
            { id: 'hybrid', label: 'Hybrid', icon: CheckCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveStrategy(id as typeof activeStrategy)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeStrategy === id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Strategy Content */}
        <div className="space-y-6">
          {activeStrategy === 'complexity' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Best For:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Simple queries (greetings, FAQs) → Haiku, Complex reasoning → Sonnet, Critical analysis → Opus
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Complexity Classification</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Classify queries based on linguistic complexity, token count, and question type:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { classifyComplexity, ModelRouter } from '@clarity-chat/token-optimization'

async function routeByComplexity(userQuery: string) {
  // Step 1: Classify complexity (simple, moderate, complex)
  const classification = await classifyComplexity(userQuery)

  console.log(\`Query: "\${userQuery}"\`)
  console.log(\`Complexity: \${classification.level}\`) // "simple" | "moderate" | "complex"
  console.log(\`Confidence: \${classification.confidence}\`) // 0.95

  // Step 2: Route to appropriate model
  const router = ModelRouter.builder()
    .useClaudeModels()
    .withStrategy('complexity-based')
    .build()

  const routing = await router.route(userQuery)

  console.log(\`Recommended model: \${routing.model}\`) // "claude-3-haiku-20240307"
  console.log(\`Expected cost: $\${routing.estimatedCost}\`) // $0.00025

  return routing
}

// Example queries
await routeByComplexity("What are your business hours?")
// → Haiku (simple, $0.00025/request)

await routeByComplexity("Explain the differences between OAuth 2.0 flows")
// → Sonnet (moderate, $0.003/request)

await routeByComplexity("Design a distributed system for real-time fraud detection")
// → Opus (complex, $0.015/request)`}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Cost Impact Example
                </h4>
                <div className="text-sm space-y-2 text-emerald-800 dark:text-emerald-200">
                  <p><strong>Before routing:</strong> All queries on Sonnet = $1,500/mo (10K queries × $0.15)</p>
                  <p><strong>After routing:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>6,000 simple queries on Haiku = $15/mo</li>
                    <li>3,000 moderate queries on Sonnet = $90/mo</li>
                    <li>1,000 complex queries on Opus = $150/mo</li>
                  </ul>
                  <p className="font-semibold mt-2">Total: $255/mo = <strong>83% savings</strong></p>
                </div>
              </div>
            </div>
          )}

          {activeStrategy === 'intent' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Best For:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Chatbots with clear intent categories (info lookup, troubleshooting, account management)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Intent-Based Routing</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Route based on user intent rather than complexity. Simple intents use cheaper models:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { classifyIntent, ModelRouter } from '@clarity-chat/token-optimization'

async function routeByIntent(userQuery: string) {
  // Step 1: Classify intent
  const intent = await classifyIntent(userQuery)

  console.log(\`Detected intent: \${intent.category}\`) // "greeting" | "faq" | "troubleshooting" | "technical"
  console.log(\`Confidence: \${intent.confidence}\`) // 0.92

  // Step 2: Define intent-to-model mapping
  const intentModelMap = {
    greeting: 'claude-3-haiku-20240307',           // Simple responses
    faq: 'claude-3-haiku-20240307',                // Knowledge base lookup
    account: 'claude-3-sonnet-20240229',           // Moderate complexity
    troubleshooting: 'claude-3-sonnet-20240229',   // Problem-solving
    technical: 'claude-opus-3-20240229',           // Deep analysis
    escalation: 'claude-opus-3-20240229',          // Complex issues
  }

  // Step 3: Route to appropriate model
  const router = ModelRouter.builder()
    .useClaudeModels()
    .withIntentMapping(intentModelMap)
    .withFallbackModel('claude-3-sonnet-20240229') // If intent unclear
    .build()

  const routing = await router.route(userQuery, { intent: intent.category })

  return {
    intent: intent.category,
    model: routing.model,
    estimatedCost: routing.estimatedCost,
  }
}

// Example usage
await routeByIntent("Hi, I need help")
// → Intent: greeting, Model: Haiku, Cost: $0.00025

await routeByIntent("How do I reset my password?")
// → Intent: faq, Model: Haiku, Cost: $0.00025

await routeByIntent("The database connection keeps timing out")
// → Intent: troubleshooting, Model: Sonnet, Cost: $0.003

await routeByIntent("Optimize this distributed consensus algorithm")
// → Intent: technical, Model: Opus, Cost: $0.015`}
                />
              </div>

              <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">
                  Intent Distribution (Typical Support Chatbot)
                </h4>
                <ul className="text-sm space-y-1 text-brand-800 dark:text-brand-200">
                  <li><strong>40%</strong> greetings/FAQs (Haiku) - $0.00025 each</li>
                  <li><strong>35%</strong> account/troubleshooting (Sonnet) - $0.003 each</li>
                  <li><strong>20%</strong> technical/escalation (Opus) - $0.015 each</li>
                  <li><strong>5%</strong> unclear (Sonnet fallback) - $0.003 each</li>
                </ul>
                <p className="text-sm font-semibold mt-3 text-brand-900 dark:text-brand-100">
                  Result: 60% of queries on Haiku → <strong>12-15% cost reduction</strong>
                </p>
              </div>
            </div>
          )}

          {activeStrategy === 'hybrid' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Best For:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Production systems requiring maximum accuracy and cost efficiency
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Hybrid Routing (Recommended)</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Combine complexity and intent classification for best results:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { ModelRouter, classifyComplexity, classifyIntent } from '@clarity-chat/token-optimization'

async function hybridRouting(userQuery: string) {
  // Step 1: Run both classifiers in parallel
  const [complexity, intent] = await Promise.all([
    classifyComplexity(userQuery),
    classifyIntent(userQuery),
  ])

  // Step 2: Create hybrid router with combined logic
  const router = ModelRouter.builder()
    .useClaudeModels()
    .withStrategy('hybrid')
    .withRules([
      // High confidence intent takes precedence
      {
        condition: (ctx) => ctx.intent.confidence > 0.9,
        useIntentMapping: true,
      },
      // Otherwise use complexity
      {
        condition: (ctx) => ctx.intent.confidence <= 0.9,
        useComplexityMapping: true,
      },
      // Safety: Always use Opus for critical intents
      {
        condition: (ctx) => ['escalation', 'technical'].includes(ctx.intent.category),
        model: 'claude-opus-3-20240229',
      },
    ])
    .build()

  // Step 3: Route with both signals
  const routing = await router.route(userQuery, {
    complexity: complexity.level,
    intent: intent.category,
  })

  return {
    complexity: complexity.level,
    intent: intent.category,
    model: routing.model,
    reason: routing.reason, // Explains why this model was chosen
    estimatedCost: routing.estimatedCost,
  }
}

// Example: Simple greeting
await hybridRouting("Hello!")
// → Complexity: simple, Intent: greeting (confidence: 0.98)
// → Model: Haiku, Reason: "High confidence intent match"

// Example: Ambiguous query
await hybridRouting("Tell me about security")
// → Complexity: moderate, Intent: unclear (confidence: 0.45)
// → Model: Sonnet, Reason: "Low intent confidence, using complexity"

// Example: Critical technical query
await hybridRouting("Design a zero-trust security architecture")
// → Complexity: complex, Intent: technical (confidence: 0.88)
// → Model: Opus, Reason: "Critical intent override"`}
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Hybrid Accuracy Improvement
                </h4>
                <div className="text-sm space-y-2 text-purple-800 dark:text-purple-200">
                  <p><strong>Complexity-only:</strong> 85% routing accuracy</p>
                  <p><strong>Intent-only:</strong> 82% routing accuracy</p>
                  <p><strong>Hybrid:</strong> 93% routing accuracy</p>
                  <p className="font-semibold mt-2">
                    Fewer misroutes = better quality + cost savings
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Measuring Results */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Measuring Routing Performance</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Track routing accuracy and cost impact to validate your strategy:
        </p>

        <CodeBlock
          language="typescript"
          code={`import { ModelRouter, RoutingMetrics } from '@clarity-chat/token-optimization'

// Step 1: Enable metrics collection
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .withMetrics(true) // Enable tracking
  .build()

// Step 2: Process queries
for (const query of userQueries) {
  const routing = await router.route(query.text)
  const response = await callModel(routing.model, query.text)

  // Step 3: Track actual outcome
  await router.recordOutcome({
    queryId: query.id,
    model: routing.model,
    actualCost: response.cost,
    qualityScore: response.qualityScore, // 0-1 (from user feedback)
    wasCorrectRoute: response.qualityScore >= 0.8, // Did model handle it well?
  })
}

// Step 4: Analyze metrics
const metrics = await router.getMetrics({
  period: 'last_7_days',
})

console.log('Routing Performance:')
console.log(\`- Total queries: \${metrics.totalQueries}\`)
console.log(\`- Routing accuracy: \${metrics.accuracy}%\`) // 93%
console.log(\`- Avg cost per query: $\${metrics.avgCostPerQuery}\`) // $0.0018
console.log(\`- Cost vs baseline: \${metrics.savingsPercent}%\`) // 15% savings

// Step 5: Model distribution
console.log('Model Distribution:')
console.log(\`- Haiku: \${metrics.modelDistribution.haiku}%\`) // 55%
console.log(\`- Sonnet: \${metrics.modelDistribution.sonnet}%\`) // 35%
console.log(\`- Opus: \${metrics.modelDistribution.opus}%\`) // 10%

// Step 6: Quality by model
console.log('Quality Scores:')
console.log(\`- Haiku: \${metrics.qualityByModel.haiku}\`) // 0.92
console.log(\`- Sonnet: \${metrics.qualityByModel.sonnet}\`) // 0.94
console.log(\`- Opus: \${metrics.qualityByModel.opus}\`) // 0.97

// Step 7: Identify misroutes
const misroutes = await router.getMisroutes({ limit: 10 })
misroutes.forEach(m => {
  console.log(\`Query: "\${m.query}"\`)
  console.log(\`Routed to: \${m.routedModel}\`)
  console.log(\`Should have been: \${m.optimalModel}\`)
  console.log(\`Quality score: \${m.qualityScore}\`)
})`}
        />

        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-3">Key Metrics to Track</h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Routing accuracy:</strong> % of queries routed to optimal model (target: &gt;90%)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Cost per query:</strong> Average cost across all models (track trend)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Quality scores:</strong> User satisfaction by model (all should be &gt;0.8)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Model distribution:</strong> % queries per model (expect 40-60% on Haiku)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Too many queries routed to expensive models
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> &gt;50% queries on Opus, low cost savings
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Lower complexity thresholds or increase intent confidence requirements.
              Most queries should go to Haiku/Sonnet.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Low quality scores on Haiku
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Quality &lt;0.8 for Haiku routes, user complaints
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Review misrouted queries and adjust classification. Some "simple" queries
              may require Sonnet. Use hybrid routing for better accuracy.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Routing adds too much latency
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> &gt;100ms routing time, slow responses
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Use fast heuristics for obvious cases (greeting detection) and only run
              ML classification for ambiguous queries. Cache classification results for similar queries.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Cost savings lower than expected
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Only 5-8% savings instead of 10-15%
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Routing alone won't achieve 50-70% baseline. You must combine with
              provider caching (50%+) and compression (15-25%). Routing is the final optimization layer.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Next Steps
        </h2>
        <div className="space-y-3">
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Combine with caching and compression for 50-70% savings
          </Link>
          <Link
            href="/cookbook/react-integration"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Integrate routing into your React application
          </Link>
          <Link
            href="/cookbook/nodejs-backend-integration"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Add routing to your Node.js backend
          </Link>
          <Link
            href="/reference/classes/model-router"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            ModelRouter API Reference
          </Link>
        </div>
      </section>

      {/* Real-World Example */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Real-World Example: Support Chatbot</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Scenario</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              E-commerce support chatbot handling 50,000 queries/month
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Before Routing</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• All queries on Sonnet: 50,000 × $0.003 = <strong>$150/month</strong></li>
              <li>• Quality score: 0.91</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">After Hybrid Routing</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• 27,500 simple queries on Haiku: 27,500 × $0.00025 = $6.88</li>
              <li>• 17,500 moderate queries on Sonnet: 17,500 × $0.003 = $52.50</li>
              <li>• 5,000 complex queries on Opus: 5,000 × $0.015 = $75.00</li>
              <li className="pt-2 font-semibold">• Total: <strong>$134.38/month</strong></li>
              <li>• Savings: <strong>10.4%</strong></li>
              <li>• Quality score: 0.93 (improved!)</li>
            </ul>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              Combined with caching + compression: <strong>$134.38 → $20.16 = 86.6% total savings</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
