'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ToastProvider,
  useTokenBudgetMonitor,
} from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicBudgetMonitorDemo() {
  const [messages, setMessages] = useState([
    { role: 'user' as const, content: 'Hello, how are you?' },
    { role: 'assistant' as const, content: 'I am doing well, thank you!' },
  ])

  const {
    usage,
    isWarning,
    isCritical,
    isExceeded,
    updateMessages,
    trimToCritical,
    lastTrimResult,
  } = useTokenBudgetMonitor({
    maxInputTokens: 1000, // Small limit for demo
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    reservedForOutput: 100,
    onWarning: (usage: { utilizationPercent: number }) => {
      console.debug('Warning:', usage.utilizationPercent)
    },
    onCritical: (usage: { utilizationPercent: number }) => {
      console.debug('Critical:', usage.utilizationPercent)
    },
  })

  useEffect(() => {
    updateMessages(messages)
  }, [messages, updateMessages])

  const addMessage = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'user' as const,
        content:
          'This is a longer message that will add more tokens to the conversation.',
      },
    ])
  }, [])

  const handleTrim = useCallback(() => {
    const result = trimToCritical()
    if (result) {
      setMessages((prev) =>
        prev.filter(
          (_: unknown, i: number) => !result.removedItems.some((item: { index: number }) => item.index === i)
        )
      )
    }
  }, [trimToCritical])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Token Usage</span>
            <span
              className={`text-sm font-bold ${
                isExceeded
                  ? 'text-red-600'
                  : isCritical
                    ? 'text-orange-600'
                    : isWarning
                      ? 'text-yellow-600'
                      : 'text-green-600'
              }`}
            >
              {usage.utilizationPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isExceeded
                  ? 'bg-red-600'
                  : isCritical
                    ? 'bg-orange-600'
                    : isWarning
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(usage.utilizationPercent, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {usage.current} / {usage.max} tokens ({usage.available} available)
          </div>
        </div>

        {isWarning && !isCritical && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
            Warning: Token usage is high ({usage.utilizationPercent.toFixed(1)}
            %)
          </div>
        )}

        {isCritical && (
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
            Critical: Token usage is very high (
            {usage.utilizationPercent.toFixed(1)}%)
          </div>
        )}

        {isExceeded && (
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
            Exceeded: Token limit exceeded!
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={addMessage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            aria-label="Add message"
          >
            Add Message
          </button>
          {isCritical && (
            <button
              onClick={handleTrim}
              className="px-4 py-2 bg-orange-600 text-white rounded"
              aria-label="Trim to critical"
            >
              Trim History
            </button>
          )}
        </div>

        {lastTrimResult && (
          <div className="p-3 bg-muted rounded text-sm">
            <p className="font-semibold mb-1">Last Trim:</p>
            <p>Removed {lastTrimResult.tokensRemoved} tokens</p>
            <p>Removed {lastTrimResult.removedItems.length} messages</p>
          </div>
        )}
      </div>
    </div>
  )
}

const tokenBudgetConfigProps: Prop[] = [
  {
    name: 'maxInputTokens',
    type: 'number',
    required: true,
    description:
      'Maximum input tokens for the model (e.g., 128000 for GPT-4 Turbo).',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description:
      'Warning threshold as decimal (0.8 = 80%). Triggers onWarning callback.',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    default: '0.95',
    description:
      'Critical threshold as decimal (0.95 = 95%). Triggers onCritical callback.',
  },
  {
    name: 'reservedForOutput',
    type: 'number',
    default: '4096',
    description:
      'Tokens reserved for output response. Effective max = maxInputTokens - reservedForOutput.',
  },
  {
    name: 'model',
    type: 'ModelName',
    description:
      'Model name for accurate token counting (e.g., "gpt-4", "claude-3-5-sonnet").',
  },
  {
    name: 'onWarning',
    type: '(usage: TokenUsage) => void',
    description:
      'Callback when warning threshold is crossed. Receives current usage metrics.',
  },
  {
    name: 'onCritical',
    type: '(usage: TokenUsage) => void',
    description:
      'Callback when critical threshold is crossed. Receives current usage metrics.',
  },
  {
    name: 'onExceeded',
    type: '(usage: TokenUsage) => void',
    description:
      'Callback when exceeded (over 100%). Receives current usage metrics.',
  },
  {
    name: 'autoTrim',
    type: 'boolean',
    default: 'false',
    description:
      'Auto-trigger trimming at critical threshold. Calls onAutoTrim after trimming.',
  },
  {
    name: 'onAutoTrim',
    type: '(result: TrimResult) => void',
    description:
      'Callback after auto-trim occurs. Receives trim result with details.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '300',
    description: 'Debounce delay for token counting in milliseconds.',
  },
  {
    name: 'useAccurateTokenization',
    type: 'boolean',
    default: 'false',
    description:
      'Use accurate tokenization (slower but precise). Requires js-tiktoken.',
  },
]

const tokenBudgetMonitorReturnProps: Prop[] = [
  {
    name: 'usage',
    type: 'TokenUsage',
    description:
      'Current token usage metrics (current, max, available, utilizationPercent, status).',
  },
  {
    name: 'isWarning',
    type: 'boolean',
    description:
      'Whether currently in warning state (utilization >= warningThreshold).',
  },
  {
    name: 'isCritical',
    type: 'boolean',
    description:
      'Whether currently in critical state (utilization >= criticalThreshold).',
  },
  {
    name: 'isExceeded',
    type: 'boolean',
    description: 'Whether currently exceeded (utilization >= 100%).',
  },
  {
    name: 'wouldExceed',
    type: '(additionalTokens: number) => boolean',
    description: 'Check if adding additional tokens would exceed budget.',
  },
  {
    name: 'calculateTokens',
    type: '(text: string) => Promise<number>',
    description:
      'Calculate tokens for text. Returns promise for async tokenization.',
  },
  {
    name: 'updateMessages',
    type: '(messages: BudgetMessage[]) => void',
    description:
      'Update messages and recalculate usage. Call when messages change.',
  },
  {
    name: 'trimToCritical',
    type: '() => TrimResult | null',
    description:
      'Manually trigger trim to get below critical threshold. Returns trim result or null.',
  },
  {
    name: 'reset',
    type: '() => void',
    description:
      'Reset the monitor state (clear usage, messages, trim result).',
  },
  {
    name: 'lastTrimResult',
    type: 'TrimResult | null',
    description:
      'Last trim result if any. Contains details about what was removed.',
  },
  {
    name: 'isCalculating',
    type: 'boolean',
    description:
      'Whether currently calculating tokens (useful for loading states).',
  },
]

export function UseTokenBudgetMonitorContent() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useTokenBudgetMonitor</h1>

        <p className="lead">
          Real-time token budget monitoring with threshold-based warnings,
          automatic trimming, and immediate cost awareness. Prevents context
          overflow and provides proactive alerts.
        </p>

        <ViewInStorybook component="useTokenBudgetMonitor" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Monitor token usage in real-time! Add messages and see warnings when
            approaching limits.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const [messages, setMessages] = useState([])

  const { usage, isWarning, isCritical, updateMessages, trimToCritical } = useTokenBudgetMonitor({
    maxInputTokens: 1000,
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
  })

  useEffect(() => {
    updateMessages(messages)
  }, [messages])

  return (
    <div>
      <p>Usage: {usage.utilizationPercent.toFixed(1)}%</p>
      {isWarning && <p>Warning</p>}
      {isCritical && <button onClick={trimToCritical}>Trim</button>}
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useTokenBudgetMonitor } from '@clarity-chat/react'
import type { TokenBudgetConfig, TokenBudgetMonitorReturn, TokenUsage, TrimResult } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>Monitor token usage with threshold-based warnings:</p>

        <ComponentPreview
          title="Basic Token Budget Monitor"
          description="Monitor token usage with warnings and critical alerts"
          code={`import { useTokenBudgetMonitor } from '@clarity-chat/react'
import { useEffect } from 'react'

function BasicMonitor() {
  const [messages, setMessages] = useState([])

  const {
    usage,
    isWarning,
    isCritical,
    isExceeded,
    updateMessages,
  } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    warningThreshold: 0.8, // 80%
    criticalThreshold: 0.95, // 95%
    reservedForOutput: 4096,
    onWarning: (usage: { utilizationPercent: number }) => {
      console.debug('Warning:', usage.utilizationPercent)
    },
    onCritical: (usage: { utilizationPercent: number }) => {
      console.debug('Critical:', usage.utilizationPercent)
    },
  })

  useEffect(() => {
    updateMessages(messages)
  }, [messages, updateMessages])

  return (
    <div>
      <p>Usage: {usage.utilizationPercent.toFixed(1)}%</p>
      {isWarning && <p>Warning</p>}
      {isCritical && <p>Critical</p>}
    </div>
  )
}`}
        >
          <BasicBudgetMonitorDemo />
        </ComponentPreview>

        <h2 id="options">Options</h2>

        <PropsTable props={tokenBudgetConfigProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={tokenBudgetMonitorReturnProps} />

        <h2 id="token-usage-type">TokenUsage Type</h2>

        <p>
          The <code>TokenUsage</code> type structure:
        </p>

        <EnhancedCodeBlock
          code={`interface TokenUsage {
  /** Current tokens used */
  current: number
  /** Maximum tokens allowed */
  max: number
  /** Available tokens remaining */
  available: number
  /** Utilization as percentage (0-100) */
  utilizationPercent: number
  /** Current status based on thresholds */
  status: 'safe' | 'warning' | 'critical' | 'exceeded'
  /** Tokens reserved for output */
  reservedForOutput: number
  /** Effective max for input (max - reserved) */
  effectiveMax: number
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Set appropriate thresholds:</strong> Use 0.8 for warning and
            0.95 for critical
          </li>
          <li>
            <strong>Reserve output tokens:</strong> Always set{' '}
            <code>reservedForOutput</code> to ensure space for responses
          </li>
          <li>
            <strong>Update on message changes:</strong> Call{' '}
            <code>updateMessages</code> whenever messages change
          </li>
          <li>
            <strong>Use pre-computed tokens:</strong> Provide{' '}
            <code>tokens</code> in <code>BudgetMessage</code> for performance
          </li>
          <li>
            <strong>Check before sending:</strong> Use <code>wouldExceed</code>{' '}
            to prevent exceeding budget
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-token-optimization-enhanced">
              useTokenOptimizationEnhanced
            </a>{' '}
            - Comprehensive token optimization
          </li>
          <li>
            <a href="/reference/hooks/use-token-tracker">useTokenTracker</a> -
            Token usage and cost tracking
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> -
            Token management strategies
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useTokenOptimizationEnhanced',
            href: '/reference/hooks/use-token-optimization-enhanced',
          }}
          next={{
            title: 'useTokenTracker',
            href: '/reference/hooks/use-token-tracker',
          }}
        />
      </>
    </ToastProvider>
  )
}
