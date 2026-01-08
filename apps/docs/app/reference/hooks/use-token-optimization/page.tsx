'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Pagination } from '@/components/Navigation/Pagination'

export default function UseTokenOptimizationPage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">useTokenOptimization</h1>
          <p className="text-lg text-muted-foreground">
            Legacy token optimization hook. <strong>Deprecated</strong> - use{' '}
            <a
              href="/reference/hooks/use-token-optimization-enhanced"
              className="text-primary underline"
            >
              useTokenOptimizationEnhanced
            </a>{' '}
            instead.
          </p>
        </header>

        <Callout type="warning">
          <p>
            <strong>Deprecated:</strong> This hook is deprecated and maintained
            for backward compatibility only. Please migrate to{' '}
            <a href="/reference/hooks/use-token-optimization-enhanced">
              useTokenOptimizationEnhanced
            </a>{' '}
            which includes all features from this hook plus additional
            optimizations like TOON format, prompt caching, semantic caching,
            response prefilling, and more.
          </p>
        </Callout>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Migration Guide</h2>
          <p className="mb-4">
            To migrate from <code>useTokenOptimization</code> to{' '}
            <code>useTokenOptimizationEnhanced</code>:
          </p>
          <EnhancedCodeBlock
            code={`// Old (deprecated)
import { useTokenOptimization } from '@clarity-chat/react/internal'

const { optimizePrompt } = useTokenOptimization({
  enablePromptShortening: true,
})

// New (recommended)
import { useTokenOptimizationEnhanced } from '@clarity-chat/react/internal'

const { optimizePrompt } = useTokenOptimizationEnhanced({
  preset: 'balanced', // or customize individual options
  enablePromptCompression: true,
})`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">What It Does</h2>
          <p className="mb-4 text-muted-foreground">
            This legacy hook provided basic prompt optimization features. The
            enhanced version includes all of these features plus many more
            optimizations.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Basic prompt shortening and optimization</li>
            <li>Token counting and estimation</li>
            <li>Simple statistics tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Related Hooks</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a
                href="/reference/hooks/use-token-optimization-enhanced"
                className="text-primary underline"
              >
                useTokenOptimizationEnhanced
              </a>{' '}
              – Recommended replacement with all features plus TOON, caching,
              compression, routing, and more
            </li>
            <li>
              <a
                href="/reference/hooks/use-token-budget-monitor"
                className="text-primary underline"
              >
                useTokenBudgetMonitor
              </a>{' '}
              – Real-time token budget monitoring with auto-trimming
            </li>
            <li>
              <a
                href="/reference/hooks/use-token-tracker"
                className="text-primary underline"
              >
                useTokenTracker
              </a>{' '}
              – Token usage and cost tracking
            </li>
          </ul>
        </section>

        <Pagination
          prev={{
            title: 'useTokenTracker',
            href: '/reference/hooks/use-token-tracker',
          }}
          next={{
            title: 'useTokenOptimizationEnhanced',
            href: '/reference/hooks/use-token-optimization-enhanced',
          }}
        />
      </div>
    </>
  )
}
