import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Optimization Quick Start - Save 50% in 5 Minutes',
  description: 'Get started with token optimization and reduce your LLM costs by 50% or more with copy-paste examples.',
}

export default function TokenOptimizationMVPPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="not-prose mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            💰 Save 50-90% on Token Costs
          </div>
          <h1 className="text-4xl font-bold mb-4">Token Optimization Quick Start</h1>
          <p className="text-xl text-muted-foreground">
            Reduce your LLM costs by 50% or more in under 5 minutes with copy-paste examples.
          </p>
        </div>

        {/* Quick Start Section */}
        <section id="quick-start" className="not-prose mb-12">
          <h2 className="text-2xl font-bold mb-4">⚡ 5-Minute Quick Start</h2>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Copy-Paste This to Save 50% Immediately</h3>

            <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4">
              <code className="text-sm">{`import { useTokenOptimization } from '@clarity-chat/token-optimization'

function ChatComponent() {
  const { count, optimize } = useTokenOptimization(userInput, {
    preset: 'standard',
    enableCache: true,
    enableCompression: true,
  })

  const handleSend = async () => {
    const { optimized, savings } = await optimize(userInput)

    // Send optimized text instead of original
    await sendToLLM(optimized)

    console.log(\`Saved \${savings}% tokens!\`)
  }

  return (
    <div>
      <input value={userInput} onChange={...} />
      <button onClick={handleSend}>Send</button>
      <div className="text-sm text-muted-foreground">
        {count} tokens · Save ~50% with optimization
      </div>
    </div>
  )
}`}</code>
            </pre>

            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-md">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">Typical Savings</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• <strong>Standard preset:</strong> 40-60% reduction</li>
                  <li>• <strong>With caching:</strong> 70-90% on repeated content</li>
                  <li>• <strong>With provider caching:</strong> 90% on cached tokens</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Three Hero Recipes */}
        <section id="hero-recipes" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🎯 Three Ways to Save Big</h2>

          {/* Recipe 1: Provider Caching */}
          <div className="not-prose bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚀</span>
              <div>
                <h3 className="text-xl font-bold">Recipe 1: Provider Caching (90% Savings)</h3>
                <p className="text-sm text-muted-foreground">Anthropic, OpenAI, and Google native caching</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">❌ Before: $10/day on repeated system prompts</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-2">
                <code>{`const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  system: largeSystemPrompt, // 5,000 tokens, sent every request
  messages: [{ role: 'user', content: userQuery }]
})
// Cost: 5,000 tokens × $3/1M = $0.015 per request
// At 1,000 requests/day = $15/day`}</code>
              </pre>

              <h4 className="font-semibold mb-2 mt-4">✅ After: $1.50/day with provider caching</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{`import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

const { messages, system } = await formatMessagesForProviderCaching(
  [{ role: 'user', content: userQuery }],
  'anthropic',
  {
    model: 'claude-3-5-sonnet-20241022',
    cacheSystemPrompt: largeSystemPrompt
  }
)

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  system, // Now includes cache_control markers
  messages
})

// Cost:
// - First request: 5,000 tokens × $3.75/1M (write to cache) = $0.01875
// - Cached requests: 5,000 tokens × $0.30/1M (90% cheaper!) = $0.0015
// At 1,000 requests/day = $1.50/day (90% savings!)`}</code>
              </pre>
            </div>

            <div className="bg-emerald-500/10 p-4 rounded-md">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Real Impact</p>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Savings:</strong> 90% on cached tokens (Anthropic: $3.00 → $0.30 per 1M)</li>
                <li>• <strong>Best for:</strong> System prompts, knowledge bases, few-shot examples</li>
                <li>• <strong>Cache TTL:</strong> 5 minutes (Anthropic), varies by provider</li>
              </ul>
            </div>
          </div>

          {/* Recipe 2: Compression Strategies */}
          <div className="not-prose bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🗜️</span>
              <div>
                <h3 className="text-xl font-bold">Recipe 2: Smart Compression (30-50% Savings)</h3>
                <p className="text-sm text-muted-foreground">LLMLingua, Extractive, and Adaptive strategies</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">❌ Before: 2,000 tokens</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-2">
                <code>{`const prompt = \`
Please analyze this customer feedback and provide insights:

Customer Feedback:
"I really loved the new features you added, but I have to say that
the loading times are quite slow, especially on mobile devices.
Also, the navigation could be more intuitive. However, the design
is beautiful and I appreciate the dark mode option."

Please provide:
1. Sentiment analysis
2. Key themes
3. Actionable recommendations
\`

// 2,000 tokens × $2.50/1M input = $0.005 per request`}</code>
              </pre>

              <h4 className="font-semibold mb-2 mt-4">✅ After: 1,000 tokens with adaptive compression</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{`import { compressAdaptively } from '@clarity-chat/token-optimization'

const result = await compressAdaptively(prompt, 0.5, { // 50% compression
  minQuality: 0.85, // Maintain 85% quality
  preserveCode: true,
  preserveInstructions: true
})

console.log(result.compressed)
// Output: "Analyze customer feedback:
// Feedback: Loved new features, but slow loading (especially mobile),
// unintuitive navigation. Beautiful design, appreciate dark mode.
// Provide: 1. Sentiment 2. Themes 3. Recommendations"

console.log(\`Saved \${result.compressionRatio}x tokens!\`)
// Saved 2x tokens (2,000 → 1,000)
// New cost: 1,000 tokens × $2.50/1M = $0.0025 (50% savings)`}</code>
              </pre>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-md">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Choose Your Strategy</p>
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Strategy</th>
                    <th className="text-left py-2">Savings</th>
                    <th className="text-left py-2">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2"><code>LLMLingua</code></td>
                    <td className="py-2">20-50%</td>
                    <td className="py-2">Long documents, code-heavy</td>
                  </tr>
                  <tr>
                    <td className="py-2"><code>Extractive</code></td>
                    <td className="py-2">30-60%</td>
                    <td className="py-2">News, articles, reports</td>
                  </tr>
                  <tr>
                    <td className="py-2"><code>Adaptive</code></td>
                    <td className="py-2">10-40%</td>
                    <td className="py-2">Auto-selects best strategy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recipe 3: Model Routing */}
          <div className="not-prose bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-xl font-bold">Recipe 3: Smart Model Routing (40-70% Savings)</h3>
                <p className="text-sm text-muted-foreground">Route queries to cost-optimal models</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">❌ Before: Using GPT-4 for everything</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-2">
                <code>{`// Always using expensive model
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [{ role: 'user', content: 'What is 2+2?' }]
})
// Cost: ~$0.01 per simple query
// At 10,000 queries/day = $100/day`}</code>
              </pre>

              <h4 className="font-semibold mb-2 mt-4">✅ After: Route by complexity</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{`import { ModelRouter } from '@clarity-chat/token-optimization'

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .build()

const decision = router.route(userQuery)

const response = await openai.chat.completions.create({
  model: decision.selectedModel.id, // Auto-selects: gpt-4o-mini, gpt-4o, or gpt-4
  messages: [{ role: 'user', content: userQuery }]
})

console.log(\`Using \${decision.selectedModel.id} - \${decision.complexity.level} complexity\`)

// Results:
// - Simple queries → gpt-4o-mini ($0.15/1M) - 93% cheaper!
// - Medium queries → gpt-4o ($2.50/1M) - 75% cheaper
// - Complex queries → gpt-4-turbo ($10/1M) - when needed
// Average cost: $30/day (70% savings)`}</code>
              </pre>
            </div>

            <div className="bg-purple-500/10 p-4 rounded-md">
              <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Routing Logic</p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Low complexity:</strong> Math, definitions, simple tasks → Small models (90%+ savings)</li>
                <li>• <strong>Medium complexity:</strong> Analysis, summaries → Mid-tier models (60% savings)</li>
                <li>• <strong>High complexity:</strong> Code generation, reasoning → Premium models (use when needed)</li>
                <li>• <strong>Automatic:</strong> Analyzes query length, keywords, structure</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core API Quick Reference */}
        <section id="core-apis" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📚 Core APIs (Top 5)</h2>

          <div className="not-prose space-y-4">
            <a href="/api/token-optimization/accurate-token-counter" className="block p-4 bg-card border border-border rounded-lg hover:border-brand-500/30 transition-colors">
              <h3 className="font-semibold mb-1">AccurateTokenCounter</h3>
              <p className="text-sm text-muted-foreground">Primary token counting for GPT-4o, Claude, Gemini</p>
            </a>

            <a href="/api/token-optimization/provider-caching" className="block p-4 bg-card border border-border rounded-lg hover:border-brand-500/30 transition-colors">
              <h3 className="font-semibold mb-1">ProviderCachingFormatter</h3>
              <p className="text-sm text-muted-foreground">Format messages for 90% provider caching savings</p>
            </a>

            <a href="/api/token-optimization/tiered-cache" className="block p-4 bg-card border border-border rounded-lg hover:border-brand-500/30 transition-colors">
              <h3 className="font-semibold mb-1">TieredCache</h3>
              <p className="text-sm text-muted-foreground">Multi-tier application-level caching (exact → pattern → semantic)</p>
            </a>

            <a href="/api/token-optimization/adaptive-compressor" className="block p-4 bg-card border border-border rounded-lg hover:border-brand-500/30 transition-colors">
              <h3 className="font-semibold mb-1">AdaptiveCompressor</h3>
              <p className="text-sm text-muted-foreground">Context-aware compression (20-50% reduction)</p>
            </a>

            <a href="/api/token-optimization/model-router" className="block p-4 bg-card border border-border rounded-lg hover:border-brand-500/30 transition-colors">
              <h3 className="font-semibold mb-1">ModelRouter</h3>
              <p className="text-sm text-muted-foreground">Complexity-based model selection (40-70% cost reduction)</p>
            </a>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🔧 Troubleshooting (Top 5 Issues)</h2>

          <div className="not-prose space-y-6">
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-2">1. Token count doesn't match provider's count</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Cause:</strong> Different tokenizers between providers (GPT vs Claude vs Gemini)
              </p>
              <p className="text-sm">
                <strong>Solution:</strong> Use provider-specific counting or ProviderNativeCounter for 100% accuracy
              </p>
              <pre className="bg-muted p-3 rounded text-xs mt-2">
                <code>{`import { ProviderNativeCounter } from '@clarity-chat/token-optimization'

const counter = new ProviderNativeCounter({ provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' })
const result = await counter.count(text) // 100% accurate`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-2">2. Caching not working / no savings</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Cause:</strong> Cache TTL expired or prompt variations prevent cache hits
              </p>
              <p className="text-sm">
                <strong>Solution:</strong> Check cache stats and increase TTL if needed
              </p>
              <pre className="bg-muted p-3 rounded text-xs mt-2">
                <code>{`const cache = useTieredCache({ ttl: 3600000 }) // 1 hour
console.log(cache.stats.hitRate) // Should be >30% for good caching`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-2">3. Compression quality too low / responses degraded</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Cause:</strong> Aggressive compression settings
              </p>
              <p className="text-sm">
                <strong>Solution:</strong> Increase minQuality threshold or reduce compressionRate
              </p>
              <pre className="bg-muted p-3 rounded text-xs mt-2">
                <code>{`const result = await compressAdaptively(text, 0.3, { // 30% instead of 50%
  minQuality: 0.90 // Stricter quality gate (default: 0.85)
})`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-2">4. Model routing always picks expensive model</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Cause:</strong> Quality-first strategy or queries always classified as high complexity
              </p>
              <p className="text-sm">
                <strong>Solution:</strong> Use 'cost-optimized' strategy or adjust complexity thresholds
              </p>
              <pre className="bg-muted p-3 rounded text-xs mt-2">
                <code>{`const router = ModelRouter.builder()
  .withStrategy('cost-optimized') // Not 'quality-first'
  .build()`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-2">5. Provider caching shows 0% savings</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Cause:</strong> Cache not being created (wrong model, content too short, or cache_control not set)
              </p>
              <p className="text-sm">
                <strong>Solution:</strong> Verify model supports caching and content meets minimum length
              </p>
              <pre className="bg-muted p-3 rounded text-xs mt-2">
                <code>{`// Anthropic requires:
// - Supported model (claude-3-5-sonnet, claude-3-opus, claude-3-haiku)
// - At least 1,024 tokens for cache_control block
// - At least 2,048 tokens for system prompt caching

if (systemPrompt.length < 2000) {
  console.warn('System prompt too short for caching (need 2,048+ tokens)')
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="not-prose">
          <h2 className="text-2xl font-bold mb-6">🚀 Next Steps</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <a href="/cookbook/token-optimization" className="block p-6 bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-brand-500/20 rounded-lg hover:border-brand-500/40 transition-colors">
              <h3 className="font-semibold mb-2">📖 Full Cookbook</h3>
              <p className="text-sm text-muted-foreground">20+ recipes for advanced optimization</p>
            </a>

            <a href="/examples/token-optimization" className="block p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors">
              <h3 className="font-semibold mb-2">💻 Live Examples</h3>
              <p className="text-sm text-muted-foreground">Interactive demos you can run</p>
            </a>

            <a href="/tools/token-roi-calculator" className="block p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg hover:border-emerald-500/40 transition-colors">
              <h3 className="font-semibold mb-2">🧮 ROI Calculator</h3>
              <p className="text-sm text-muted-foreground">Calculate your potential savings</p>
            </a>

            <a href="/api/token-optimization" className="block p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors">
              <h3 className="font-semibold mb-2">📚 Complete API Reference</h3>
              <p className="text-sm text-muted-foreground">All 640+ exports documented</p>
            </a>
          </div>
        </section>
      </article>
    </div>
  )
}
