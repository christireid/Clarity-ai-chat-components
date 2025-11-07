import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

export const metadata: Metadata = {
  title: 'useTokenOptimization Hook | Clarity Chat',
  description: 'Coordinate token budgeting, compression, caching, and routing for cost-efficient AI conversations.',
}

const secondaryHooks = [
  { name: 'useTokenTracker', description: 'Live token + cost tracking UI (documented separately).' },
  { name: 'usePromptCompression', description: 'Compress prompts and histories using heuristic + semantic strategies.' },
  { name: 'useSmartCache', description: 'Cache LLM responses and embeddings to avoid duplicate calls.' },
  { name: 'useSmartThrottle', description: 'Back off high-volume requests to avoid rate limits.' },
  { name: 'useRequestBatcher', description: 'Batch small requests to reduce HTTP overhead.' },
  { name: 'useModelRouter', description: 'Route requests to the cheapest provider meeting quality thresholds.' },
  { name: 'useResponseLimiter', description: 'Limit output tokens or streaming duration dynamically.' },
]

export default function UseTokenOptimizationPage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">useTokenOptimization</h1>
          <p className="text-lg text-muted-foreground">
            Central coordinator for Clarity Chat’s token optimization suite. Automatically balances context window
            allocation, compression, caching, throttling, and provider routing.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Usage</h2>
          <div className="bg-muted p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              <code>{`import {
  useTokenOptimization,
  useTokenTracker,
  usePromptCompression,
  useModelRouter,
} from '@clarity-chat/react'

const { optimizeContext, recommendation, state } = useTokenOptimization({
  maxContextWindow: 128_000,
  budgetUsd: 25,
  targets: {
    latencyMs: 4_000,
    accuracy: 0.92,
    costSavings: 0.6,
  },
})`}</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What It Does</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Evaluates conversation state (token counts, roles, metadata) and returns optimized context bundles.</li>
            <li>Triggers compression pipelines (<code>usePromptCompression</code>) when nearing budget thresholds.</li>
            <li>Advises provider/model selection via <code>useModelRouter</code> based on price/performance goals.</li>
            <li>Integrates with <code>useSmartCache</code> to reuse previous completions or embeddings.</li>
            <li>Feeds <code>useTokenTracker</code> so the UI reflects savings in real time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Return Value</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <code>optimizeContext(input)</code> – Accepts {`{ systemPrompt, userPreferences, recentMessages, semanticMemories }`} and
              returns trimmed segments respecting budgets.
            </li>
            <li>
              <code>recommendation</code> – Suggested model/provider + rationale.
            </li>
            <li>
              <code>state</code> – Current budget, savings, compression ratios, and throttling status.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Related Hooks</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {secondaryHooks.map((hook) => (
              <li key={hook.name}>
                <code>{hook.name}</code> – {hook.description}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
