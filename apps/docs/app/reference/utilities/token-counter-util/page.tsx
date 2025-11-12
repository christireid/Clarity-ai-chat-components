import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter Utility | Clarity Chat',
  description: 'Utility functions for accurate token counting across different AI models.'
}

export default function TokenCounterUtilPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Token Counter Utility</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Accurate token counting utilities for OpenAI, Anthropic, and Google AI models with cost estimation.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Model-specific token counting (GPT, Claude, Gemini)</li>
          <li>Cost estimation per model</li>
          <li>Batch message token counting</li>
          <li>Context window calculations</li>
          <li>Token budget management</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { countTokens, estimateCost } from '@clarity-chat/react/utils'

const tokens = countTokens('Hello world', 'gpt-4')
const cost = estimateCost(tokens, 'gpt-4')
console.log(\`\${tokens} tokens = $\${cost}\`)`}</code></pre>
        </div>
      </section>
    </div>
  )
}
