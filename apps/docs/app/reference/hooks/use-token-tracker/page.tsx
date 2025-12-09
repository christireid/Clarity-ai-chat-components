'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, useTokenTracker } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { FeedbackWidget } from '@/components/FeedbackWidget'

// Basic demo component
function BasicTrackerDemo() {
  const [messages, setMessages] = useState([
    { role: 'user' as const, content: 'Hello!' },
    { role: 'assistant' as const, content: 'Hi there!' },
  ])

  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    isNearLimit,
    isCritical,
    percentage,
    canSend,
    suggestPruning,
    addMessage,
    removeMessage,
    clear,
    estimateTokens,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      console.log('Warning threshold reached')
    },
    onCritical: () => {
      console.log('Critical threshold reached')
    },
  })

  const handleAddMessage = useCallback(() => {
    const newMessage = { role: 'user' as const, content: 'This is a new message.' }
    const estimated = estimateTokens(newMessage.content)
    if (canSend(estimated)) {
      addMessage(newMessage)
      setMessages(prev => [...prev, newMessage])
    } else {
      alert('Message would exceed token limit!')
    }
  }, [addMessage, canSend, estimateTokens])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Token Usage</span>
            <span className={`text-sm font-bold ${
              isCritical ? 'text-red-600' :
              isNearLimit ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isCritical ? 'bg-red-600' :
                isNearLimit ? 'bg-yellow-600' :
                'bg-green-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {tokens} tokens ({inputTokens} input, {outputTokens} output)
          </div>
        </div>

        <div className="p-3 bg-muted rounded">
          <p className="text-sm font-semibold mb-1">Cost Estimate</p>
          <p className="text-sm">${estimatedCost.toFixed(4)}</p>
        </div>

        {isNearLimit && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
            ⚠️ Warning: Approaching token limit
          </div>
        )}

        {isCritical && (
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
            🚨 Critical: Token limit nearly reached
          </div>
        )}

        {suggestPruning && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
            💡 Suggestion: Consider pruning old messages
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAddMessage}
            disabled={isCritical}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            aria-label="Add message"
          >
            Add Message
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => {
                removeMessage(messages.length - 1)
                setMessages(prev => prev.slice(0, -1))
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
              aria-label="Remove last message"
            >
              Remove Last
            </button>
          )}
          <button
            onClick={() => {
              clear()
              setMessages([])
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
            aria-label="Clear all messages"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

const useTokenTrackerOptionsProps: Prop[] = [
  {
    name: 'modelName',
    type: 'string',
    required: true,
    description: 'Model name (e.g., "gpt-4", "gpt-4-turbo", "claude-3-opus"). Used for token limits and pricing.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for model. Auto-detected if modelName matches known models.',
  },
  {
    name: 'inputCostPerToken',
    type: 'number',
    description: 'Cost per input token in dollars. Auto-detected if modelName matches known models.',
  },
  {
    name: 'outputCostPerToken',
    type: 'number',
    description: 'Cost per output token in dollars. Auto-detected if modelName matches known models.',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description: 'Warning threshold as decimal (0.8 = 80%). Triggers onWarning callback.',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    default: '0.95',
    description: 'Critical threshold as decimal (0.95 = 95%). Triggers onCritical callback.',
  },
  {
    name: 'onWarning',
    type: '() => void',
    description: 'Callback when warning threshold exceeded.',
  },
  {
    name: 'onCritical',
    type: '() => void',
    description: 'Callback when critical threshold exceeded.',
  },
]

const useTokenTrackerReturnProps: Prop[] = [
  {
    name: 'tokens',
    type: 'number',
    description: 'Current total tokens in conversation (input + output).',
  },
  {
    name: 'inputTokens',
    type: 'number',
    description: 'Input tokens (user messages).',
  },
  {
    name: 'outputTokens',
    type: 'number',
    description: 'Output tokens (assistant messages).',
  },
  {
    name: 'estimatedCost',
    type: 'number',
    description: 'Estimated total cost in dollars (input cost + output cost).',
  },
  {
    name: 'isNearLimit',
    type: 'boolean',
    description: 'Whether near token limit (utilization >= warningThreshold).',
  },
  {
    name: 'isCritical',
    type: 'boolean',
    description: 'Whether at critical token limit (utilization >= criticalThreshold).',
  },
  {
    name: 'percentage',
    type: 'number',
    description: 'Percentage of limit used (0-100).',
  },
  {
    name: 'canSend',
    type: '(estimatedTokens: number) => boolean',
    description: 'Check if sending a message with estimated tokens would exceed limit.',
  },
  {
    name: 'suggestPruning',
    type: 'boolean',
    description: 'Whether to suggest pruning old messages (true when near limit).',
  },
  {
    name: 'addMessage',
    type: '(message: MessageWithTokens) => void',
    description: 'Add message to tracker. Updates token counts and cost estimates.',
  },
  {
    name: 'removeMessage',
    type: '(index: number) => void',
    description: 'Remove message from tracker by index. Updates token counts and cost estimates.',
  },
  {
    name: 'clear',
    type: '() => void',
    description: 'Clear all messages and reset token counts.',
  },
  {
    name: 'estimateTokens',
    type: '(text: string) => number',
    description: 'Estimate tokens for text (rough approximation).',
  },
]

export const dynamic = 'force-dynamic'

export default function UseTokenTrackerPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useTokenTracker</h1>

        <p className="lead">
          A production-ready hook for tracking token usage, estimating costs, and managing context window limits
          in AI conversations. Provides real-time token counting, automatic model pricing lookup, and threshold-based alerts.
        </p>

        <ViewInStorybook component="useTokenTracker" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Track token usage and costs! Add messages and see real-time updates.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const { tokens, estimatedCost, isNearLimit, addMessage } = useTokenTracker({
    modelName: 'gpt-4',
  })

  return (
    <div>
      <p>Tokens: {tokens}</p>
      <p>Cost: ${estimatedCost.toFixed(4)}</p>
      {isNearLimit && <p>⚠️ Near limit</p>}
      <button onClick={() => addMessage({ role: 'user', content: 'Hello' })}>
        Add Message
      </button>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useTokenTracker } from '@clarity-chat/react'
import type { UseTokenTrackerOptions, UseTokenTrackerReturn, MessageWithTokens } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Track token usage and costs for a conversation:
        </p>

        <ComponentPreview
          title="Basic Token Tracker"
          description="Track tokens and costs with automatic model pricing"
          code={`import { useTokenTracker } from '@clarity-chat/react'
import { useState } from 'react'

function BasicTracker() {
  const [messages, setMessages] = useState([])

  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    isNearLimit,
    percentage,
    addMessage,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
  })

  const handleAddMessage = (content: string) => {
    const newMessage = { role: 'user', content }
    addMessage(newMessage)
    setMessages(prev => [...prev, newMessage])
  }

  return (
    <div>
      <p>Tokens: {tokens} ({percentage.toFixed(1)}%)</p>
      <p>Cost: ${estimatedCost.toFixed(4)}</p>
      {isNearLimit && <p>⚠️ Warning: Near limit</p>}
    </div>
  )
}`}
        >
          <BasicTrackerDemo />
        </ComponentPreview>

        <h2 id="check-before-sending">Check Before Sending</h2>

        <p>
          Check if a message would exceed the token limit:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenTracker } from '@clarity-chat/react'

function CheckBeforeSend() {
  const { canSend, estimateTokens, addMessage } = useTokenTracker({
    modelName: 'gpt-4',
  })

  const handleSend = (content: string) => {
    const estimated = estimateTokens(content)
    if (canSend(estimated)) {
      addMessage({ role: 'user', content })
    } else {
      alert('Message would exceed token limit!')
    }
  }

  return <button onClick={() => handleSend('Hello')}>Send</button>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="cost-tracking">Cost Tracking</h2>

        <p>
          Track costs for different models:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenTracker } from '@clarity-chat/react'

function CostTracking() {
  const gpt4 = useTokenTracker({ modelName: 'gpt-4' })
  const gpt35 = useTokenTracker({ modelName: 'gpt-3.5-turbo' })
  const claude = useTokenTracker({ modelName: 'claude-3-opus' })

  return (
    <div>
      <div>
        <p>GPT-4: ${gpt4.estimatedCost.toFixed(4)}</p>
        <p>GPT-3.5: ${gpt35.estimatedCost.toFixed(4)}</p>
        <p>Claude: ${claude.estimatedCost.toFixed(4)}</p>
      </div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="custom-pricing">Custom Pricing</h2>

        <p>
          Override automatic pricing with custom costs:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenTracker } from '@clarity-chat/react'

function CustomPricing() {
  const {
    tokens,
    estimatedCost,
  } = useTokenTracker({
    modelName: 'custom-model',
    maxTokens: 128000,
    inputCostPerToken: 0.00001, // $0.00001 per input token
    outputCostPerToken: 0.00003, // $0.00003 per output token
  })

  return (
    <div>
      <p>Tokens: {tokens}</p>
      <p>Cost: ${estimatedCost.toFixed(4)}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="threshold-alerts">Threshold Alerts</h2>

        <p>
          Get alerts when approaching token limits:
        </p>

        <EnhancedCodeBlock
          code={`import { useTokenTracker } from '@clarity-chat/react'

function ThresholdAlerts() {
  const {
    tokens,
    isNearLimit,
    isCritical,
    suggestPruning,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      console.log('Warning: Approaching token limit')
    },
    onCritical: () => {
      console.log('Critical: Token limit nearly reached')
    },
  })

  return (
    <div>
      <p>Tokens: {tokens}</p>
      {isNearLimit && <p>⚠️ Warning: Near limit</p>}
      {isCritical && <p>🚨 Critical: Limit nearly reached</p>}
      {suggestPruning && <p>💡 Suggestion: Consider pruning old messages</p>}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable props={useTokenTrackerOptionsProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={useTokenTrackerReturnProps} />

        <h2 id="message-with-tokens-type">MessageWithTokens Type</h2>

        <p>
          The <code>MessageWithTokens</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface MessageWithTokens {
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number // Optional pre-computed token count
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="supported-models">Supported Models</h2>

        <p>
          Automatic pricing and limits are available for:
        </p>

        <ul>
          <li><strong>GPT-4:</strong> 8192 tokens, $0.00003/$0.00006 per token</li>
          <li><strong>GPT-4 Turbo:</strong> 128000 tokens, $0.00001/$0.00003 per token</li>
          <li><strong>GPT-3.5 Turbo:</strong> 16385 tokens, $0.0000005/$0.0000015 per token</li>
          <li><strong>Claude 3 Opus:</strong> 200000 tokens, $0.000015/$0.000075 per token</li>
          <li><strong>Claude 3 Sonnet:</strong> 200000 tokens, $0.000003/$0.000015 per token</li>
          <li><strong>Claude 3 Haiku:</strong> 200000 tokens, $0.00000025/$0.00000125 per token</li>
        </ul>

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useCallback } from 'react'
import { useTokenTracker } from '@clarity-chat/react'
import type { MessageWithTokens } from '@clarity-chat/react'

function CompleteTrackerExample() {
  const [messages, setMessages] = useState<MessageWithTokens[]>([])

  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    isNearLimit,
    isCritical,
    percentage,
    canSend,
    suggestPruning,
    addMessage,
    removeMessage,
    clear,
    estimateTokens,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      console.log('Warning threshold reached')
    },
    onCritical: () => {
      console.log('Critical threshold reached')
    },
  })

  const handleAddMessage = useCallback((content: string) => {
    const estimated = estimateTokens(content)
    if (canSend(estimated)) {
      const newMessage: MessageWithTokens = { role: 'user', content }
      addMessage(newMessage)
      setMessages(prev => [...prev, newMessage])
    } else {
      alert('Message would exceed token limit!')
    }
  }, [addMessage, canSend, estimateTokens])

  const handleRemoveMessage = useCallback((index: number) => {
    removeMessage(index)
    setMessages(prev => prev.filter((_, i) => i !== index))
  }, [removeMessage])

  return (
    <div className="space-y-4">
      {/* Token Usage Display */}
      <div className="p-4 bg-muted rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Token Usage</span>
          <span className={\`font-bold ${
            isCritical ? 'text-red-600' :
            isNearLimit ? 'text-yellow-600' :
            'text-green-600'
          }\`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={\`h-2 rounded-full transition-all ${
              isCritical ? 'bg-red-600' :
              isNearLimit ? 'bg-yellow-600' :
              'bg-green-600'
            }\`}
            style={{ width: \`\${Math.min(percentage, 100)}%\` }}
          />
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <p>Total: {tokens} tokens</p>
          <p>Input: {inputTokens} tokens</p>
          <p>Output: {outputTokens} tokens</p>
          <p>Estimated Cost: ${estimatedCost.toFixed(4)}</p>
        </div>
      </div>

      {/* Alerts */}
      {isNearLimit && !isCritical && (
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          ⚠️ Warning: Approaching token limit
        </div>
      )}
      {isCritical && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
          🚨 Critical: Token limit nearly reached
        </div>
      )}
      {suggestPruning && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          💡 Suggestion: Consider pruning old messages
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleAddMessage('New message')}
          disabled={isCritical}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Add Message
        </button>
        {messages.length > 0 && (
          <button
            onClick={() => handleRemoveMessage(messages.length - 1)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          >
            Remove Last
          </button>
        )}
        <button
          onClick={() => {
            clear()
            setMessages([])
          }}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
        >
          Clear All
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 bg-muted rounded">
            <p className="text-sm font-semibold">{msg.role}</p>
            <p className="text-sm">{msg.content}</p>
            <button
              onClick={() => handleRemoveMessage(i)}
              className="text-xs text-muted-foreground mt-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Use model name:</strong> Provide <code>modelName</code> for automatic pricing and limits
          </li>
          <li>
            <strong>Check before sending:</strong> Use <code>canSend</code> to prevent exceeding limits
          </li>
          <li>
            <strong>Monitor thresholds:</strong> Set <code>warningThreshold</code> and <code>criticalThreshold</code> for alerts
          </li>
          <li>
            <strong>Track costs:</strong> Use <code>estimatedCost</code> to show users API costs
          </li>
          <li>
            <strong>Suggest pruning:</strong> Check <code>suggestPruning</code> to prompt users to trim history
          </li>
          <li>
            <strong>Pre-compute tokens:</strong> Provide <code>tokens</code> in messages for better performance
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-token-optimization-enhanced">useTokenOptimizationEnhanced</a> - Comprehensive token optimization
          </li>
          <li>
            <a href="/reference/hooks/use-token-budget-monitor">useTokenBudgetMonitor</a> - Real-time budget monitoring with auto-trimming
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> - Token management strategies
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useTokenBudgetMonitor',
            href: '/reference/hooks/use-token-budget-monitor',
          }}
          next={{
            title: 'useTokenOptimization',
            href: '/reference/hooks/use-token-optimization',
          }}
        />

        {/* Feedback Widget */}
        <FeedbackWidget pageId="use-token-tracker" className="mt-12" />
      </>
    </ToastProvider>
  )
}
