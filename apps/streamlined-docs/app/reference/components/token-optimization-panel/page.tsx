'use client'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function TokenOptimizationPanelAPIPage() {
  return (
    <div className="min-h-screen bg-background"><div className="container-docs py-8">
      <Link href="/guides/token-optimization" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" />Back to Guide</Link>
      <h1 className="text-4xl font-bold mb-4">TokenOptimizationPanel</h1>
      <p className="text-muted-foreground mb-8">Full panel with optimization tips, suggestions, and statistics.</p>
      <div className="p-6 rounded-xl bg-neutral-900 text-white"><pre><code>{`import { TokenOptimizationPanel } from '@clarity-chat/react'

<TokenOptimizationPanel currentTokens={2500} maxTokens={4000} messages={messages} showSuggestions />`}</code></pre></div>
    </div></div>
  )
}
