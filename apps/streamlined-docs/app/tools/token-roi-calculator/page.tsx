'use client'

import { TokenOptimizationROICalculator } from '@/components/AI/TokenOptimizationROICalculator'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TokenROICalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container-docs py-4">
        <Link
          href="/get-started"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Get Started
        </Link>
      </div>

      {/* Calculator */}
      <div className="container-docs py-12">
        <TokenOptimizationROICalculator />

        {/* Additional Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl border border-border bg-accent/20">
            <h3 className="text-lg font-semibold mb-4">About Token Optimization</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Token optimization is a critical feature of production AI chat applications. By implementing
                intelligent strategies to reduce token usage, you can significantly lower costs while
                maintaining conversation quality and context.
              </p>
              <p>
                The Clarity Chat library includes built-in token optimization features:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Automatic Compression:</strong> Remove redundant whitespace and optimize message formatting</li>
                <li><strong>Context Summarization:</strong> Summarize older messages to preserve context while reducing tokens</li>
                <li><strong>Selective Context:</strong> Include only relevant conversation history for each query</li>
                <li><strong>Smart Truncation:</strong> Intelligently truncate long conversations at natural boundaries</li>
                <li><strong>Real-time Monitoring:</strong> Track token usage and costs in real-time with visual dashboards</li>
                <li><strong>Budget Enforcement:</strong> Set token budgets and receive warnings when approaching limits</li>
              </ul>
              <p>
                Learn more about implementing these strategies in the{' '}
                <Link href="/api/token-optimization" className="text-brand-500 hover:underline">
                  Token Optimization API documentation
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
