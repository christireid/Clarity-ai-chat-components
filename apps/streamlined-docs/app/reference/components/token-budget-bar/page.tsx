'use client'
import Link from 'next/link'
import { ArrowLeft, Target } from 'lucide-react'

export default function TokenBudgetBarAPIPage() {
  return (
    <div className="min-h-screen bg-background"><div className="container-docs py-8">
      <Link href="/guides/token-optimization" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" />Back to Guide</Link>
      <h1 className="text-4xl font-bold mb-4">TokenBudgetBar</h1>
      <p className="text-muted-foreground mb-8">Budget visualization with warning thresholds and limit enforcement.</p>
      <div className="p-6 rounded-xl bg-neutral-900 text-white"><pre><code>{`import { TokenBudgetBar } from '@clarity-chat/react'

<TokenBudgetBar currentTokens={3200} maxTokens={4000} warningThreshold={0.8} showLabels />`}</code></pre></div>
    </div></div>
  )
}
