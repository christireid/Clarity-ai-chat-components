import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Context Visualizer | Clarity Chat',
  description: 'Visualize conversation context window with token tracking and pruning.'
}

export default function ContextVisualizerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Context Visualizer</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Visual representation of conversation context window showing which messages are included and token usage.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { ContextVisualizer } from '@clarity-chat/react'

<ContextVisualizer
  messages={messages}
  maxTokens={4096}
  currentTokens={2048}
  showTokens={true}
  highlightIncluded={true}
  onPrune={(ids) => pruneMessages(ids)}
  onToggleMessage={(id, include) => toggleMessage(id, include)}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Visual token usage tracking</li>
          <li>Included/excluded message highlighting</li>
          <li>Exclusion reason display</li>
          <li>Manual message toggle</li>
          <li>Prune suggestions</li>
          <li>Compact/detailed view modes</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Exclusion Reasons</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>token_limit:</strong> Exceeds max tokens</li>
          <li><strong>pruned:</strong> Manually pruned</li>
          <li><strong>too_old:</strong> Outside context window</li>
          <li><strong>manual:</strong> User excluded</li>
        </ul>
      </section>
    </div>
  )
}
