'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function TokenBudgetProviderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Top-Level Provider</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">TokenBudgetProvider</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Context provider for tracking and managing token usage across your chat application.
          Monitor input/output tokens, set budgets per model, and prevent exceeding API limits.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Token Management & Cost Control
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { TokenBudgetProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <TokenBudgetProvider model="gpt-4o">
      <ClarityChat
        api="/api/chat"
        tokenOptimization={{ enabled: true }}
      />
    </TokenBudgetProvider>
  )
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Real-time Tracking
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Model Presets
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Cost Optimization
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            Performance Split
          </span>
        </div>
      </section>

      {/* Why TokenBudgetProvider */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why TokenBudgetProvider?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">
              What It Solves
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Exceeding API token limits mid-conversation
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Unexpected API costs from large requests
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                No visibility into token consumption
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Different limits across models
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              Key Benefits
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Pre-built model presets (GPT-4, Claude, etc.)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Real-time token counting as users type
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Automatic budget warnings before limits
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Performance-optimized with split contexts
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Basic Usage</h2>

        <CollapsibleSection title="With Model Preset" defaultOpen={true}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, ClarityChat } from '@clarity-chat/react'

// Use built-in model presets - automatically sets correct limits
function App() {
  return (
    <TokenBudgetProvider model="gpt-4o">
      <ClarityChat api="/api/chat" />
    </TokenBudgetProvider>
  )
}

// Available models:
// - 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'
// - 'gpt-3.5-turbo', 'gpt-3.5-turbo-16k'
// - 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'
// - 'claude-3.5-sonnet', 'claude-3.5-haiku'`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="With Custom Configuration" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <TokenBudgetProvider
      config={{
        maxInputTokens: 100000,     // Max input tokens allowed
        reservedForOutput: 8000,    // Reserve tokens for AI response
        warningThreshold: 0.8,      // Warn at 80% usage
        errorThreshold: 0.95        // Error at 95% usage
      }}
    >
      <ClarityChat api="/api/chat" />
    </TokenBudgetProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Model Preset with Overrides" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, ClarityChat } from '@clarity-chat/react'

// Use model preset but customize some settings
function App() {
  return (
    <TokenBudgetProvider
      model="claude-3.5-sonnet"
      configOverrides={{
        reservedForOutput: 12000,  // Override output reservation
        warningThreshold: 0.7      // Warn earlier at 70%
      }}
    >
      <ClarityChat api="/api/chat" />
    </TokenBudgetProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* Advanced Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Advanced Examples</h2>

        <CollapsibleSection title="Display Token Usage UI" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use useTokenState to display real-time token usage.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, useTokenState } from '@clarity-chat/react'

function TokenUsageDisplay() {
  const {
    usage,
    isWarning,
    isCritical,
    isExceeded
  } = useTokenState()

  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">Token Usage</span>
        <span className={\`text-sm font-mono \${
          isExceeded ? 'text-red-500' : 'text-muted-foreground'
        }\`}>
          {usage.current.toLocaleString()} / {usage.effectiveMax.toLocaleString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div
          className={\`h-full transition-all \${
            isExceeded
              ? 'bg-red-500'
              : isCritical
                ? 'bg-red-400'
                : isWarning
                  ? 'bg-amber-500'
                  : 'bg-green-500'
          }\`}
          style={{ width: \`\${Math.min(usage.utilizationPercent, 100)}%\` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Current:</span>
          <span className="ml-1 font-mono">{usage.current}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Available:</span>
          <span className="ml-1 font-mono">{usage.available}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Reserved:</span>
          <span className="ml-1 font-mono">{usage.reservedForOutput}</span>
        </div>
      </div>

      {/* Status badge */}
      {usage.status !== 'safe' && (
        <div className={\`mt-2 text-xs px-2 py-1 rounded \${
          usage.status === 'exceeded'
            ? 'bg-red-100 text-red-700'
            : usage.status === 'critical'
              ? 'bg-red-100 text-red-600'
              : 'bg-amber-100 text-amber-700'
        }\`}>
          {usage.status === 'exceeded'
            ? 'Token limit exceeded'
            : usage.status === 'critical'
              ? 'Critical: Near limit'
              : 'Warning: Approaching limit'}
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <TokenBudgetProvider model="gpt-4o">
      <TokenUsageDisplay />
      <ClarityChat api="/api/chat" />
    </TokenBudgetProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Dynamic Model Switching" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use useTokenConfig to switch models at runtime.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, useTokenConfig } from '@clarity-chat/react'

function ModelSelector() {
  const { model, setModel } = useTokenConfig()

  const models = [
    { value: 'gpt-4o', label: 'GPT-4o (128K)', cost: '$$$' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', cost: '$' },
    { value: 'claude-3.5-sonnet', label: 'Claude 3.5', cost: '$$' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5', cost: '$' },
  ]

  return (
    <div className="flex gap-2">
      {models.map((m) => (
        <button
          key={m.value}
          onClick={() => setModel(m.value)}
          className={\`px-3 py-2 rounded-lg text-sm \${
            model === m.value
              ? 'bg-brand-500 text-white'
              : 'bg-muted hover:bg-muted/80'
          }\`}
        >
          <span>{m.label}</span>
          <span className="ml-1 text-xs opacity-70">{m.cost}</span>
        </button>
      ))}
    </div>
  )
}

function App() {
  return (
    <TokenBudgetProvider model="gpt-4o">
      <ModelSelector />
      <ClarityChat api="/api/chat" />
    </TokenBudgetProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Prevent Over-Budget Messages" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Block sending when over budget to prevent API errors.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { TokenBudgetProvider, useTokenState, useClarityChat } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function BudgetAwareChat() {
  const [input, setInput] = useState('')
  const [estimatedTokens, setEstimatedTokens] = useState(0)
  const { isExceeded, wouldExceed, calculateTokens } = useTokenState()
  const { append, isLoading } = useClarityChat({ api: '/api/chat' })

  // Calculate tokens when input changes (debounced in hook)
  useEffect(() => {
    calculateTokens(input).then(setEstimatedTokens)
  }, [input, calculateTokens])

  // Check if sending would exceed the budget
  const wouldExceedBudget = isExceeded || wouldExceed(estimatedTokens)

  const handleSend = async () => {
    if (wouldExceedBudget || !input.trim()) return

    await append({ role: 'user', content: input })
    setInput('')
    setEstimatedTokens(0)
  }

  return (
    <div className="p-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={\`w-full p-3 border rounded-lg \${
          wouldExceedBudget ? 'border-red-500' : 'border-border'
        }\`}
      />

      <div className="flex justify-between items-center mt-2">
        <span className={\`text-xs \${
          wouldExceedBudget ? 'text-red-500' : 'text-muted-foreground'
        }\`}>
          Estimated: {estimatedTokens} tokens
          {wouldExceedBudget && ' (exceeds budget)'}
        </span>

        <button
          onClick={handleSend}
          disabled={wouldExceedBudget || isLoading || !input.trim()}
          className={\`px-4 py-2 rounded-lg \${
            wouldExceedBudget
              ? 'bg-red-100 text-red-500 cursor-not-allowed'
              : 'bg-brand-500 text-white hover:bg-brand-600'
          }\`}
        >
          {wouldExceedBudget ? 'Over Budget' : 'Send'}
        </button>
      </div>
    </div>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Cost Estimation Display" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Show estimated costs using the built-in estimateTokenCost utility.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import {
  TokenBudgetProvider,
  useTokenState,
  useTokenConfig,
  estimateTokenCost
} from '@clarity-chat/react'

function CostEstimate() {
  const { model } = useTokenConfig()
  const { usage } = useTokenState()

  // Use the built-in cost estimation helper
  const cost = model ? estimateTokenCost(usage, model) : null

  if (!cost) {
    return (
      <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
        Cost estimation unavailable for this model
      </div>
    )
  }

  return (
    <div className="p-3 bg-muted rounded-lg text-sm">
      <div className="font-semibold mb-2">Estimated Cost ({cost.model})</div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Input:</span>
          <span className="ml-1 font-mono">\${cost.inputCost.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Output (est.):</span>
          <span className="ml-1 font-mono">\${cost.estimatedOutputCost.toFixed(4)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total:</span>
          <span className="ml-1 font-mono font-semibold">
            {cost.formattedCost}
          </span>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Based on {usage.current.toLocaleString()} input tokens,
        {usage.reservedForOutput.toLocaleString()} reserved for output
      </div>
    </div>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        {/* Props */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Props</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Prop</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Default</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">model</td>
                  <td className="p-3 font-mono text-sm">BudgetMonitorModel</td>
                  <td className="p-3 text-muted-foreground">undefined</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Model preset name (auto-configures limits)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">config</td>
                  <td className="p-3 font-mono text-sm">TokenBudgetConfig</td>
                  <td className="p-3 text-muted-foreground">undefined</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Custom budget configuration (use instead of model)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">configOverrides</td>
                  <td className="p-3 font-mono text-sm">Partial&lt;TokenBudgetConfig&gt;</td>
                  <td className="p-3 text-muted-foreground">undefined</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Override specific settings when using model preset
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">children</td>
                  <td className="p-3 font-mono text-sm">React.ReactNode</td>
                  <td className="p-3 text-muted-foreground">Required</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Child components with access to token context
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TokenBudgetConfig */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">TokenBudgetConfig</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Option</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Default</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">maxInputTokens</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-muted-foreground">128000</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Maximum input tokens allowed
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">reservedForOutput</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-muted-foreground">4096</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Tokens to reserve for AI response
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">warningThreshold</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-muted-foreground">0.8</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Percentage (0-1) at which to show warning
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">errorThreshold</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-muted-foreground">0.95</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Percentage (0-1) at which to show error
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Supported Models */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Supported Models</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">OpenAI GPT</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>gpt-4o (128K)</li>
                <li>gpt-4o-mini (128K)</li>
                <li>gpt-4-turbo (128K)</li>
                <li>gpt-4.1 (1M)</li>
                <li>gpt-4.1-mini (1M)</li>
                <li>gpt-4.1-nano (1M)</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">OpenAI O-Series</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>o1 (200K)</li>
                <li>o1-mini (128K)</li>
                <li>o3-mini (200K)</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Anthropic Claude 3</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>claude-3-opus (200K)</li>
                <li>claude-3-sonnet (200K)</li>
                <li>claude-3-haiku (200K)</li>
                <li>claude-3-5-sonnet (200K)</li>
                <li>claude-3-5-haiku (200K)</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Anthropic Claude 4</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>claude-sonnet-4 (200K)</li>
                <li>claude-opus-4 (200K)</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Google Gemini</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>gemini-1.5-pro (2M)</li>
                <li>gemini-1.5-flash (1M)</li>
                <li>gemini-2.0-pro (2M)</li>
                <li>gemini-2.0-flash (1M)</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Other Models</h4>
              <ul className="space-y-1 text-sm font-mono">
                <li>deepseek-chat (64K)</li>
                <li>deepseek-r1 (64K)</li>
                <li>mistral-large (128K)</li>
                <li>mistral-small (32K)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Hooks */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Related Hooks</h2>
        <div className="grid gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useTokenState</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Access volatile token usage data. Re-renders on every token update.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const {
  usage,           // { current, max, available, utilizationPercent, status, ... }
  isWarning,       // boolean - at warning threshold
  isCritical,      // boolean - at critical threshold
  isExceeded,      // boolean - over budget
  wouldExceed,     // (additionalTokens) => boolean
  calculateTokens, // (text) => Promise<number>
  updateMessages,  // (messages) => void
  isCalculating,   // boolean - currently calculating
} = useTokenState()`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useTokenConfig</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Access stable configuration and setters. Does NOT re-render on token changes.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const { model, setModel, config, updateConfig } = useTokenConfig()`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useTokenBudget (Legacy)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Combined hook with all functionality. Causes re-renders on every update.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`// Prefer useTokenConfig + useTokenState for better performance
const budget = useTokenBudget()`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Performance Tips */}
      <section className="mb-12 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <h2 className="text-xl font-semibold mb-4">Performance Tips</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-amber-600">&#9733;</span>
            <span>
              <strong>Use useTokenConfig for stable references</strong> - Components that only need to change models
              or read config should use useTokenConfig to avoid re-renders.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600">&#9733;</span>
            <span>
              <strong>Isolate useTokenState</strong> - Only components that display live token counts should use
              useTokenState. Wrap them in React.memo if needed.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-600">&#9733;</span>
            <span>
              <strong>Avoid useTokenBudget in forms</strong> - The combined hook re-renders on every keystroke.
              Use useTokenConfig for buttons and useTokenState only for displays.
            </span>
          </li>
        </ul>
      </section>

      {/* Feedback */}
      <section className="border-t pt-8">
        <FeedbackWidget pageId="token-budget-provider" />
      </section>
    </div>
  )
}
