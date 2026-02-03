import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { PropsTable, PropDefinition } from '../../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'useTokenCount Hook | Clarity AI Chat Components',
  description:
    'Simple React hook for counting tokens with real-time updates, automatic debouncing, and model-aware tokenization. The easiest way to track token usage in your AI applications.',
  openGraph: {
    title: 'useTokenCount Hook',
    description: 'Simple token counting with React - real-time updates and debouncing',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'api', title: 'API Reference', level: 2 },
  { id: 'debouncing', title: 'Debouncing', level: 2 },
  { id: 'model-selection', title: 'Model Selection', level: 2 },
  { id: 'advanced-features', title: 'Advanced Features', level: 2 },
  { id: 'examples', title: 'Real-World Examples', level: 2 },
  { id: 'performance', title: 'Performance Tips', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Options props
const optionsProps: PropDefinition[] = [
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description:
      'Model to use for tokenization. Different models have different tokenizers (e.g., GPT-4o, Claude 3.5, GPT-3.5 Turbo)',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '150',
    description: 'Debounce delay in milliseconds. Set to 0 to disable debouncing.',
  },
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable the hook. Useful for conditional token counting.',
  },
]

// Return value props
const returnProps: PropDefinition[] = [
  {
    name: 'count',
    type: 'number',
    description:
      'The token count for the input text. Returns 0 while loading or if text is empty.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description:
      'Whether the count is currently being calculated. True during debounce delay and during counting.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Error if counting failed, undefined otherwise.',
  },
  {
    name: 'info',
    type: '{ characters: number; words: number; ratio: number }',
    description:
      'Additional token information including character count, word count, and characters per token ratio.',
  },
  {
    name: 'recount',
    type: '() => void',
    description: 'Force a recount immediately, bypassing debounce.',
  },
  {
    name: 'isStale',
    type: 'boolean',
    description:
      'React 19: Whether the displayed count is for stale (previous) text. True when text has changed but count hasn\'t updated yet.',
  },
]

export default function UseTokenCountPage() {
  return (
    <DocumentationPage
      title="useTokenCount"
      description="Simple token counting hook with real-time updates and debouncing"
      category="Token Optimization"
      icon="🔢"
      badges={[
        { label: 'Hook', variant: 'info' },
        { label: 'Token Counting', variant: 'primary' },
        { label: 'Recommended', variant: 'success' },
      ]}
      features={[
        'Simple API - just pass text, get a count',
        'Automatic debouncing to avoid excessive re-renders',
        'Model-aware tokenization (GPT-4o, Claude, etc.)',
        'Caching for optimal performance',
        'Additional metrics (characters, words, ratio)',
        'React 19 useDeferredValue for UI responsiveness',
        'TypeScript support with full type safety',
        'Force recount capability',
        'Conditional enabling/disabling',
        'Zero dependencies beyond the package',
      ]}
      tableOfContents={tableOfContents}
    >
      <Section id="overview" title="Overview">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          <code className="text-sm bg-muted px-2 py-1 rounded">useTokenCount</code> is the simplest
          way to count tokens in React. Just pass text and get back a count with automatic
          debouncing, caching, and model-aware tokenization built in.
        </p>

        <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Why Use useTokenCount?</span>
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Simple API:</strong> Just pass text, get a
                count - no complex configuration needed
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Accurate Counting:</strong> Uses AccurateTokenCounter
                with model-specific tokenizers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Performance Optimized:</strong> Automatic
                debouncing and caching prevent excessive recalculations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl shrink-0">✓</span>
              <span>
                <strong className="text-foreground">React 19 Ready:</strong> Uses useDeferredValue
                to keep UI responsive during counting
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>Perfect For</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-foreground mb-1">Input Validation</div>
              <p className="text-muted-foreground">
                Show users remaining tokens as they type in chat inputs
              </p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Budget Monitoring</div>
              <p className="text-muted-foreground">
                Track token usage against limits in real-time
              </p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Cost Estimation</div>
              <p className="text-muted-foreground">
                Calculate API costs before sending requests
              </p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Context Management</div>
              <p className="text-muted-foreground">
                Monitor conversation length to prevent truncation
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <CodeBlock
          language="bash"
          code={`# Install the token optimization package
pnpm add @clarity-chat/token-optimization

# Or with npm
npm install @clarity-chat/token-optimization

# Or with yarn
yarn add @clarity-chat/token-optimization`}
          filename="terminal"
        />
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <p className="text-muted-foreground mb-6">
          The simplest integration: count tokens as users type.
        </p>

        <CodeBlock
          language="tsx"
          code={`import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

export function TokenCounter() {
  const [text, setText] = useState('')
  const { count, isLoading } = useTokenCount(text)

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="w-full h-32 p-3 border rounded-lg"
      />

      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <span>Counting tokens...</span>
        ) : (
          <span>{count} tokens</span>
        )}
      </div>
    </div>
  )
}`}
          filename="TokenCounter.tsx"
        />

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="font-semibold text-blue-500 mb-2">💡 How It Works</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Text changes trigger debounced token counting (default 150ms)</li>
            <li>• Loading state shows while counting is in progress</li>
            <li>• Count updates automatically when debounce completes</li>
            <li>• Empty text returns 0 immediately without counting</li>
            <li>• Results are cached for repeated identical inputs</li>
          </ul>
        </div>
      </Section>

      <Section id="api" title="API Reference">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hook Signature</h3>
            <CodeBlock
              language="tsx"
              code={`function useTokenCount(
  text: string,
  options?: UseTokenCountOptions
): UseTokenCountReturn`}
              filename="signature.ts"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Options</h3>
            <PropsTable props={optionsProps} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Return Value</h3>
            <PropsTable props={returnProps} />
          </div>
        </div>
      </Section>

      <Section id="debouncing" title="Debouncing">
        <p className="text-muted-foreground mb-6">
          Control how often token counting happens with configurable debouncing.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Default Debouncing (150ms)</h4>
            <CodeBlock
              language="tsx"
              code={`// Counts after user stops typing for 150ms
const { count } = useTokenCount(text)
// Good for: Most use cases, balances responsiveness and performance`}
              filename="default-debounce.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Fast Debouncing (50ms)</h4>
            <CodeBlock
              language="tsx"
              code={`// More responsive, counts after 50ms of no typing
const { count } = useTokenCount(text, { debounceMs: 50 })
// Good for: Real-time feedback, short inputs`}
              filename="fast-debounce.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Slow Debouncing (500ms)</h4>
            <CodeBlock
              language="tsx"
              code={`// Less frequent updates, waits 500ms
const { count } = useTokenCount(text, { debounceMs: 500 })
// Good for: Long documents, reducing computation`}
              filename="slow-debounce.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">No Debouncing (Instant)</h4>
            <CodeBlock
              language="tsx"
              code={`// Counts on every keystroke (not recommended for large texts)
const { count } = useTokenCount(text, { debounceMs: 0 })
// Good for: Small inputs only, testing`}
              filename="no-debounce.tsx"
            />
          </div>
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="font-semibold text-yellow-600 mb-2">⚠️ Debouncing Best Practices</div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>
              • <strong>Short inputs (chat messages):</strong> 50-150ms debounce
            </li>
            <li>
              • <strong>Medium inputs (paragraphs):</strong> 150-300ms debounce
            </li>
            <li>
              • <strong>Long inputs (documents):</strong> 300-500ms debounce
            </li>
            <li>
              • <strong>Avoid debounceMs: 0</strong> unless input is very short
            </li>
          </ul>
        </div>
      </Section>

      <Section id="model-selection" title="Model Selection">
        <p className="text-muted-foreground mb-6">
          Different AI models use different tokenizers. Specify the model for accurate counts.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">OpenAI Models</h4>
            <CodeBlock
              language="tsx"
              code={`// GPT-4o (default)
const { count } = useTokenCount(text, { model: 'gpt-4o' })

// GPT-4 Turbo
const { count } = useTokenCount(text, { model: 'gpt-4-turbo' })

// GPT-3.5 Turbo
const { count } = useTokenCount(text, { model: 'gpt-3.5-turbo' })`}
              filename="openai-models.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Anthropic Models</h4>
            <CodeBlock
              language="tsx"
              code={`// Claude 3.5 Sonnet
const { count } = useTokenCount(text, { model: 'claude-3-5-sonnet' })

// Claude 3 Opus
const { count } = useTokenCount(text, { model: 'claude-3-opus' })

// Claude 3 Haiku
const { count } = useTokenCount(text, { model: 'claude-3-haiku' })`}
              filename="anthropic-models.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Dynamic Model Selection</h4>
            <CodeBlock
              language="tsx"
              code={`import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

export function ModelAwareCounter() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o')

  const { count, info } = useTokenCount(text, { model })

  return (
    <div className="space-y-4">
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg"
      />

      <div className="space-y-1 text-sm">
        <div>Tokens: {count}</div>
        <div>Characters: {info.characters}</div>
        <div>Ratio: {info.ratio.toFixed(2)} chars/token</div>
      </div>
    </div>
  )
}`}
              filename="ModelAwareCounter.tsx"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Model</th>
                <th className="text-left py-3 px-4 font-semibold">Tokenizer</th>
                <th className="text-left py-3 px-4 font-semibold">Avg Chars/Token</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono">gpt-4o</td>
                <td className="py-3 px-4">o200k_base</td>
                <td className="py-3 px-4">~4.2</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono">gpt-4-turbo</td>
                <td className="py-3 px-4">cl100k_base</td>
                <td className="py-3 px-4">~4.0</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono">gpt-3.5-turbo</td>
                <td className="py-3 px-4">cl100k_base</td>
                <td className="py-3 px-4">~4.0</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-mono">claude-3-5-sonnet</td>
                <td className="py-3 px-4">claude</td>
                <td className="py-3 px-4">~3.8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="advanced-features" title="Advanced Features">
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4">Additional Token Information</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get detailed metrics beyond just token count.
            </p>
            <CodeBlock
              language="tsx"
              code={`const { count, info } = useTokenCount(text)

// info provides additional metrics
console.log({
  tokens: count,
  characters: info.characters,
  words: info.words,
  ratio: info.ratio, // characters per token
})`}
              filename="token-info.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Force Recount</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Bypass debouncing to get an immediate count.
            </p>
            <CodeBlock
              language="tsx"
              code={`const { count, recount, isLoading } = useTokenCount(text)

// Force immediate recount (bypasses debounce)
<button onClick={recount} disabled={isLoading}>
  {isLoading ? 'Counting...' : 'Recount Tokens'}
</button>`}
              filename="force-recount.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Conditional Enabling</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Enable or disable counting based on conditions.
            </p>
            <CodeBlock
              language="tsx"
              code={`const [showTokenCount, setShowTokenCount] = useState(false)

// Only count when enabled
const { count } = useTokenCount(text, {
  enabled: showTokenCount,
})

// Toggle counting
<label>
  <input
    type="checkbox"
    checked={showTokenCount}
    onChange={(e) => setShowTokenCount(e.target.checked)}
  />
  Show token count
</label>`}
              filename="conditional-enable.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stale Data Detection (React 19)</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Show a subtle indicator when count is updating.
            </p>
            <CodeBlock
              language="tsx"
              code={`const { count, isStale, isLoading } = useTokenCount(text)

// Show different UI for stale vs loading
<div className="flex items-center gap-2">
  <span>{count} tokens</span>
  {isStale && (
    <span className="text-xs text-muted-foreground">
      (updating...)
    </span>
  )}
  {isLoading && (
    <span className="animate-spin">⏳</span>
  )}
</div>`}
              filename="stale-detection.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Error Handling</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Handle counting errors gracefully.
            </p>
            <CodeBlock
              language="tsx"
              code={`const { count, error } = useTokenCount(text)

if (error) {
  return (
    <div className="text-red-500 text-sm">
      Failed to count tokens: {error.message}
    </div>
  )
}

return <div>{count} tokens</div>`}
              filename="error-handling.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="examples" title="Real-World Examples">
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold mb-4">1. Chat Input with Token Limit</h4>
            <CodeBlock
              language="tsx"
              code={`import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

export function ChatInputWithLimit() {
  const [message, setMessage] = useState('')
  const { count, isLoading } = useTokenCount(message)

  const MAX_TOKENS = 4096
  const isOverLimit = count > MAX_TOKENS
  const percentage = (count / MAX_TOKENS) * 100

  return (
    <div className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full h-32 p-3 border rounded-lg"
        disabled={isOverLimit}
      />

      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className={isOverLimit ? 'text-red-500' : 'text-muted-foreground'}>
            {count.toLocaleString()} / {MAX_TOKENS.toLocaleString()} tokens
          </span>
          {isLoading && <span className="ml-2 text-xs">(counting...)</span>}
        </div>

        {/* Progress bar */}
        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={\`h-full transition-all \${
              isOverLimit ? 'bg-red-500' : 'bg-green-500'
            }\`}
            style={{ width: \`\${Math.min(percentage, 100)}%\` }}
          />
        </div>
      </div>

      <button
        disabled={isOverLimit || !message.trim()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
      >
        Send Message
      </button>
    </div>
  )
}`}
              filename="ChatInputWithLimit.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">2. Cost Calculator</h4>
            <CodeBlock
              language="tsx"
              code={`import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

// Cost per 1M tokens
const MODEL_COSTS = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'claude-3-5-sonnet': { input: 3.00, output: 15.00 },
} as const

export function CostCalculator() {
  const [input, setInput] = useState('')
  const [expectedOutput, setExpectedOutput] = useState(500)
  const [model, setModel] = useState<keyof typeof MODEL_COSTS>('gpt-4o')

  const { count: inputTokens } = useTokenCount(input, { model })

  const costs = MODEL_COSTS[model]
  const inputCost = (inputTokens / 1_000_000) * costs.input
  const outputCost = (expectedOutput / 1_000_000) * costs.output
  const totalCost = inputCost + outputCost

  return (
    <div className="space-y-4">
      <select
        value={model}
        onChange={(e) => setModel(e.target.value as keyof typeof MODEL_COSTS)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
      </select>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full h-32 p-3 border rounded-lg"
      />

      <div>
        <label className="block text-sm mb-2">
          Expected output tokens: {expectedOutput}
        </label>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
        <h4 className="font-semibold">Cost Estimate</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Input tokens</div>
            <div className="font-mono">{inputTokens.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Input cost</div>
            <div className="font-mono">\${inputCost.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Output tokens</div>
            <div className="font-mono">{expectedOutput.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Output cost</div>
            <div className="font-mono">\${outputCost.toFixed(6)}</div>
          </div>
        </div>
        <div className="pt-2 border-t mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Cost</span>
            <span className="text-lg font-mono text-primary">
              \${totalCost.toFixed(6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}`}
              filename="CostCalculator.tsx"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-4">3. Prompt Optimizer</h4>
            <CodeBlock
              language="tsx"
              code={`import { useState } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

export function PromptOptimizer() {
  const [prompt, setPrompt] = useState('')
  const { count, info } = useTokenCount(prompt)

  // Calculate optimization suggestions
  const averageRatio = 4.0
  const efficiency = (info.ratio / averageRatio) * 100
  const wastedTokens = Math.max(0, count - Math.ceil(info.characters / averageRatio))

  return (
    <div className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt to optimize..."
        className="w-full h-40 p-3 border rounded-lg font-mono text-sm"
      />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Token Count</div>
          <div className="text-2xl font-bold">{count}</div>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Efficiency</div>
          <div className="text-2xl font-bold">
            {efficiency.toFixed(0)}%
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Wasted Tokens</div>
          <div className="text-2xl font-bold">{wastedTokens}</div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="font-semibold mb-2">Optimization Tips</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          {efficiency < 80 && (
            <li>• Remove unnecessary words and filler phrases</li>
          )}
          {info.words / count > 0.8 && (
            <li>• Consider using more concise language</li>
          )}
          {count > 1000 && (
            <li>• Long prompts may need compression for better performance</li>
          )}
          {wastedTokens > 50 && (
            <li>• Optimize whitespace and formatting</li>
          )}
        </ul>
      </div>
    </div>
  )
}`}
              filename="PromptOptimizer.tsx"
            />
          </div>
        </div>
      </Section>

      <Section id="performance" title="Performance Tips">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span>
              <span>Built-in Performance Optimizations</span>
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Automatic Caching:</strong> Identical inputs
                  return cached results instantly
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Debouncing:</strong> Prevents excessive
                  recalculations during rapid typing
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">React 19 useDeferredValue:</strong> Keeps UI
                  responsive during counting
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 shrink-0">✓</span>
                <div>
                  <strong className="text-foreground">Smart Cleanup:</strong> Automatic cleanup on
                  unmount prevents memory leaks
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Best Practices</h4>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-medium mb-2">1. Choose Appropriate Debounce Timing</div>
                <CodeBlock
                  language="tsx"
                  code={`// Short inputs: faster debounce
const { count } = useTokenCount(chatMessage, { debounceMs: 50 })

// Long inputs: slower debounce
const { count } = useTokenCount(document, { debounceMs: 500 })`}
                  filename="debounce-timing.tsx"
                />
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-medium mb-2">2. Disable When Not Needed</div>
                <CodeBlock
                  language="tsx"
                  code={`// Only count when panel is open
const { count } = useTokenCount(text, {
  enabled: isPanelOpen,
})`}
                  filename="conditional-counting.tsx"
                />
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-medium mb-2">3. Avoid Unnecessary Recounts</div>
                <CodeBlock
                  language="tsx"
                  code={`// ✅ Good: Let debouncing handle it
const { count } = useTokenCount(text)

// ❌ Bad: Don't call recount unnecessarily
const { count, recount } = useTokenCount(text)
useEffect(() => {
  recount() // Unnecessary - debouncing handles updates
}, [text])`}
                  filename="avoid-recount.tsx"
                />
              </div>

              <div className="p-4 bg-muted/30 border border-border rounded-xl">
                <div className="font-medium mb-2">4. Memoize Model Selection</div>
                <CodeBlock
                  language="tsx"
                  code={`// ✅ Good: Stable model reference
const model = useMemo(() => getSelectedModel(), [selectedModelId])
const { count } = useTokenCount(text, { model })

// ❌ Bad: Model changes on every render
const { count } = useTokenCount(text, {
  model: getSelectedModel() // Re-creates counter unnecessarily
})`}
                  filename="memoize-model.tsx"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="font-semibold text-yellow-600 mb-3">⚠️ Performance Considerations</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                • Token counting is CPU-intensive for large texts (&gt;10K characters)
              </li>
              <li>
                • Debouncing is crucial for good UX during typing
              </li>
              <li>
                • Consider using <code className="text-xs">enabled: false</code> when count isn't
                visible
              </li>
              <li>
                • React 19's useDeferredValue prevents UI blocking during counting
              </li>
              <li>
                • Cache persists between renders but not between sessions
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="related" title="Related APIs">
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-token-optimization"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenOptimization →
            </h4>
            <p className="text-sm text-muted-foreground">
              Full optimization pipeline with caching, compression, and intelligent routing
            </p>
          </a>

          <a
            href="/reference/hooks/use-token-budget-monitor"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              useTokenBudgetMonitor →
            </h4>
            <p className="text-sm text-muted-foreground">
              Monitor and enforce token budgets with alerts and automatic trimming
            </p>
          </a>

          <a
            href="/reference/components/token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              TokenCounter Component →
            </h4>
            <p className="text-sm text-muted-foreground">
              Pre-built UI component for displaying token usage with progress bars
            </p>
          </a>

          <a
            href="/reference/utils/accurate-token-counter"
            className="group p-6 bg-muted/30 border border-border hover:border-primary/50 rounded-xl transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              AccurateTokenCounter →
            </h4>
            <p className="text-sm text-muted-foreground">
              Low-level token counting class with model-specific tokenizers
            </p>
          </a>
        </div>
      </Section>
    </DocumentationPage>
  )
}
