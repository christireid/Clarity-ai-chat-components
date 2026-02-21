'use client'

/**
 * useTokenCount Hook - API Reference Documentation
 *
 * Comprehensive documentation for the useTokenCount hook.
 * The simplest way to count tokens in React with automatic debouncing,
 * caching, and React 19 useDeferredValue integration.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator,
  Copy,
  Check,
  ChevronRight,
  AlertTriangle,
  Zap,
  Activity,
  Clock,
  Database,
  TrendingUp,
  Hash,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  {
    id: 'api-reference',
    title: 'API Reference',
    children: [
      { id: 'signature', title: 'Signature' },
      { id: 'parameters', title: 'Parameters' },
      { id: 'return-value', title: 'Return Value' },
    ],
  },
  {
    id: 'usage',
    title: 'Basic Usage',
    children: [
      { id: 'basic-example', title: 'Simple Counter' },
      { id: 'with-loading', title: 'With Loading State' },
      { id: 'model-selection', title: 'Model Selection' },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Patterns',
    children: [
      { id: 'debouncing', title: 'Custom Debouncing' },
      { id: 'real-time', title: 'Real-Time Counting' },
      { id: 'conditional', title: 'Conditional Counting' },
      { id: 'force-recount', title: 'Force Recount' },
    ],
  },
  {
    id: 'react-19',
    title: 'React 19 Features',
    children: [
      { id: 'use-deferred-value', title: 'useDeferredValue' },
      { id: 'stale-indicator', title: 'Stale Indicator' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    children: [
      { id: 'caching', title: 'Caching Strategy' },
      { id: 'optimization-tips', title: 'Optimization Tips' },
    ],
  },
  { id: 'pitfalls', title: 'Common Pitfalls' },
  { id: 'integration', title: 'Integration Patterns' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related APIs' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const optionsProps: PropDefinition[] = [
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description:
      'Model to use for tokenization. Different models have different tokenizers. Supports OpenAI (GPT-4o, o1, o3), Anthropic Claude, and Google Gemini.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '150',
    description:
      'Debounce delay in milliseconds. Set to 0 to disable debouncing. Prevents excessive re-renders during rapid typing.',
  },
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description:
      'Enable or disable the hook. Useful for conditional token counting. When disabled, returns count of 0.',
  },
]

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
    description:
      'Error if counting failed, undefined otherwise. Use this to handle tokenization errors gracefully.',
  },
  {
    name: 'info',
    type: '{ characters: number; words: number; ratio: number }',
    description:
      'Additional token information: character count, word count, and characters per token ratio.',
  },
  {
    name: 'recount',
    type: '() => void',
    description:
      'Force a recount immediately, bypassing debounce. Useful for explicit "count now" actions.',
  },
  {
    name: 'isStale',
    type: 'boolean',
    description:
      'React 19: Whether the displayed count is for stale (previous) text. True when text has changed but count hasn\'t updated yet. Useful for showing a subtle "calculating" indicator without blocking UI.',
  },
]

const infoProps: PropDefinition[] = [
  {
    name: 'characters',
    type: 'number',
    description: 'Total character count in the text.',
  },
  {
    name: 'words',
    type: 'number',
    description: 'Estimated word count (split by whitespace).',
  },
  {
    name: 'ratio',
    type: 'number',
    description:
      'Characters per token ratio. Higher ratios indicate more efficient tokenization.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  useTokenCount,
  type UseTokenCountOptions,
  type UseTokenCountReturn,
} from '@clarity-chat/token-optimization'`

const signatureCode = `function useTokenCount(
  text: string,
  options?: UseTokenCountOptions
): UseTokenCountReturn`

const basicExampleCode = `import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenCounter({ text }: { text: string }) {
  const { count, isLoading } = useTokenCount(text)

  return (
    <span>
      {isLoading ? '...' : count} tokens
    </span>
  )
}`

const withLoadingCode = `import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenDisplay({ text }: { text: string }) {
  const { count, isLoading, info } = useTokenCount(text)

  return (
    <div className="token-info">
      <div className="count">
        {isLoading ? (
          <span className="loading">Counting...</span>
        ) : (
          <span className="value">{count.toLocaleString()} tokens</span>
        )}
      </div>
      <div className="details">
        <span>{info.characters} characters</span>
        <span>{info.words} words</span>
        <span>{info.ratio.toFixed(1)} chars/token</span>
      </div>
    </div>
  )
}`

const modelSelectionCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function ModelAwareCounter() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gpt-4o')

  const { count, info } = useTokenCount(text, { model })

  return (
    <div>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-4o-mini">GPT-4o Mini</option>
        <option value="o1">o1</option>
        <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to count..."
      />

      <div className="stats">
        <p>{count} tokens for {model}</p>
        <p className="small">
          {info.ratio.toFixed(2)} chars/token
        </p>
      </div>
    </div>
  )
}`

const customDebouncingCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function CustomDebounceExample() {
  const [text, setText] = useState('')
  const [debounce, setDebounce] = useState(150)

  // Adjust debounce based on text length
  const { count, isLoading } = useTokenCount(text, {
    debounceMs: text.length > 1000 ? 300 : 150
  })

  return (
    <div>
      <div className="controls">
        <label>
          Debounce: {debounce}ms
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={debounce}
            onChange={(e) => setDebounce(Number(e.target.value))}
          />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to see debounced counting..."
      />

      <p>
        {count} tokens
        {isLoading && ' (updating...)'}
      </p>
    </div>
  )
}`

const realTimeCountingCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function RealTimeCounter() {
  const [text, setText] = useState('')

  // No debounce for real-time counting
  const { count, isLoading } = useTokenCount(text, {
    debounceMs: 0
  })

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Real-time token counting (no debounce)"
      />
      <p className="live-count">
        {count} tokens
        {isLoading && <span className="dot">•</span>}
      </p>
    </div>
  )
}

// Note: Real-time (no debounce) is useful for:
// - Small text inputs (< 100 chars)
// - Live character limits
// - Instant feedback scenarios
// But can cause performance issues with large texts`

const conditionalCountingCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function ConditionalCounter() {
  const [text, setText] = useState('')
  const [countEnabled, setCountEnabled] = useState(false)

  const { count, isLoading } = useTokenCount(text, {
    enabled: countEnabled
  })

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={countEnabled}
          onChange={(e) => setCountEnabled(e.target.checked)}
        />
        Enable token counting
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tokens only counted when enabled"
      />

      {countEnabled && (
        <p>
          {isLoading ? 'Counting...' : \`\${count} tokens\`}
        </p>
      )}
    </div>
  )
}

// Use cases for conditional counting:
// - Premium features (count only for paid users)
// - Performance optimization (disable on mobile)
// - Toggle visibility (show/hide token info)`

const forceRecountCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function ForceRecountExample() {
  const [text, setText] = useState('')

  const { count, isLoading, recount } = useTokenCount(text, {
    debounceMs: 500 // Longer debounce
  })

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type and click 'Count Now' for immediate results"
      />

      <div className="actions">
        <button
          onClick={recount}
          disabled={isLoading}
        >
          Count Now (Skip Debounce)
        </button>

        <span className="count">
          {isLoading ? 'Counting...' : \`\${count} tokens\`}
        </span>
      </div>
    </div>
  )
}

// recount() use cases:
// - Explicit "count now" button
// - Save/submit handlers (ensure latest count)
// - Tab focus (recount on tab activation)
// - External triggers (API updates, model changes)`

const useDeferredValueCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function DeferredValueExample() {
  const [text, setText] = useState('')

  // React 19: useDeferredValue is used internally
  // This prevents UI blocking during expensive token counting
  const { count, isStale } = useTokenCount(text)

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type rapidly to see deferred updates..."
      />

      <div className={isStale ? 'stale' : 'fresh'}>
        {count} tokens
        {isStale && <span className="badge">updating...</span>}
      </div>
    </div>
  )
}

// How useDeferredValue helps:
// 1. UI remains responsive during rapid typing
// 2. Token counting happens in background
// 3. isStale indicates when count is outdated
// 4. No jank or frame drops

// React 19 internal flow:
// User types "Hello" → text = "Hello" (immediate)
//                    → deferredText = "Hell" (deferred)
//                    → isStale = true
// After delay      → deferredText = "Hello"
//                    → count updates
//                    → isStale = false`

const staleIndicatorCode = `import { useTokenCount } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function StaleIndicator() {
  const [text, setText] = useState('')

  const { count, isLoading, isStale } = useTokenCount(text)

  // Derive a comprehensive status
  const status = isLoading
    ? 'counting'
    : isStale
      ? 'stale'
      : 'fresh'

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="token-display">
        <span className="count">{count} tokens</span>

        {status === 'counting' && (
          <span className="status counting">
            <Spinner /> Counting...
          </span>
        )}

        {status === 'stale' && (
          <span className="status stale">
            <Clock /> Updating...
          </span>
        )}

        {status === 'fresh' && (
          <span className="status fresh">
            <Check /> Up to date
          </span>
        )}
      </div>
    </div>
  )
}

// Status meanings:
// - counting: Debounce or tokenization in progress
// - stale: Count is for previous text, new count pending
// - fresh: Count matches current text`

const cachingStrategyCode = `// Internal caching strategy (no configuration needed)

// The hook uses AccurateTokenCounter with built-in caching:
const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: true,  // Enabled by default
  cacheSize: 10000,     // Default size
})

// Cache benefits:
// 1. Identical text counted once
// 2. LRU eviction (10,000 entries)
// 3. Cache cleared every hour
// 4. ~99% hit rate for repeated text

// Example cache behavior:
const text = "Hello, world!"

// First call: Cache miss → tokenize → cache result
const count1 = counter.count(text) // Takes ~1ms

// Second call: Cache hit → return cached value
const count2 = counter.count(text) // Takes ~0.01ms

// Different text: Cache miss again
const count3 = counter.count("Goodbye!") // Takes ~1ms`

const optimizationTipsCode = `// Performance optimization tips for useTokenCount

// 1. Use appropriate debounce values
const shortText = useTokenCount(text, { debounceMs: 100 })  // < 100 chars
const longText = useTokenCount(text, { debounceMs: 300 })   // > 1000 chars
const hugeText = useTokenCount(text, { debounceMs: 500 })   // > 10000 chars

// 2. Disable counting when not needed
const { count } = useTokenCount(text, {
  enabled: isVisible && isPremiumUser
})

// 3. Extract count/info separately to avoid re-renders
function OptimizedComponent({ text }) {
  const { count } = useTokenCount(text)

  // Only re-renders when count changes
  return <div>{count}</div>
}

function SeparateInfoComponent({ text }) {
  const { info } = useTokenCount(text)

  // Only re-renders when info changes
  return <div>{info.characters} chars</div>
}

// 4. Use recount sparingly
function SaveButton({ text, onSave }) {
  const { count, recount } = useTokenCount(text)

  const handleSave = () => {
    recount() // Ensure latest count
    onSave({ text, tokenCount: count })
  }

  return <button onClick={handleSave}>Save</button>
}

// 5. Memoize text when possible
const memoizedText = useMemo(() => {
  // Process text once
  return preprocessText(rawText)
}, [rawText])

const { count } = useTokenCount(memoizedText)

// Anti-patterns to avoid:
// ❌ Don't disable debounce for large texts
// ❌ Don't call recount() in render loop
// ❌ Don't enable counting for invisible components
// ❌ Don't use different models frequently (causes cache misses)`

const pitfallsCode = `// Common pitfalls and how to avoid them

// 1. Pitfall: Counting empty strings
function BadExample({ text }) {
  const { count } = useTokenCount(text)
  // count is 0 for empty strings
  return <div>{count} tokens</div>
}

// Solution: Check for empty text first
function GoodExample({ text }) {
  if (!text) return <div>No text to count</div>

  const { count } = useTokenCount(text)
  return <div>{count} tokens</div>
}

// 2. Pitfall: Ignoring loading state
function BadExample({ text }) {
  const { count } = useTokenCount(text)
  // Shows 0 while loading!
  return <div>{count} tokens</div>
}

// Solution: Handle loading state
function GoodExample({ text }) {
  const { count, isLoading } = useTokenCount(text)
  return <div>{isLoading ? 'Counting...' : \`\${count} tokens\`}</div>
}

// 3. Pitfall: Forgetting error handling
function BadExample({ text }) {
  const { count } = useTokenCount(text)
  // Silently fails on errors
  return <div>{count} tokens</div>
}

// Solution: Handle errors gracefully
function GoodExample({ text }) {
  const { count, error } = useTokenCount(text)

  if (error) {
    return <div className="error">Failed to count tokens</div>
  }

  return <div>{count} tokens</div>
}

// 4. Pitfall: Over-aggressive debouncing
function BadExample({ text }) {
  const { count } = useTokenCount(text, { debounceMs: 2000 })
  // User types, waits 2 seconds, frustrating!
  return <div>{count} tokens</div>
}

// Solution: Use sensible defaults (150ms)
function GoodExample({ text }) {
  const { count } = useTokenCount(text) // Default 150ms
  return <div>{count} tokens</div>
}

// 5. Pitfall: Calling recount() too often
function BadExample({ text }) {
  const { count, recount } = useTokenCount(text)

  useEffect(() => {
    recount() // Called on every render!
  })

  return <div>{count} tokens</div>
}

// Solution: Only recount when necessary
function GoodExample({ text }) {
  const { count, recount } = useTokenCount(text)

  const handleManualCount = () => {
    recount() // Only on explicit action
  }

  return (
    <div>
      {count} tokens
      <button onClick={handleManualCount}>Recount</button>
    </div>
  )
}`

const integrationCode = `// Integration patterns with other hooks

// 1. With useTokenBudget
import { useTokenCount, useTokenBudget } from '@clarity-chat/token-optimization'

function IntegratedExample({ text, maxTokens = 4096 }) {
  const { count } = useTokenCount(text)
  const budget = useTokenBudget({ maxTokens, current: count })

  return (
    <div>
      <textarea value={text} />
      <div className={budget.isOverLimit ? 'error' : 'info'}>
        {count} / {maxTokens} tokens
        {budget.isOverLimit && ' - Too long!'}
      </div>
    </div>
  )
}

// 2. With useClarityChat
import { useClarityChat } from '@clarity-chat/react'
import { useTokenCount } from '@clarity-chat/token-optimization'

function ChatWithTokens() {
  const { messages, sendMessage } = useClarityChat()
  const [input, setInput] = useState('')

  const { count, isLoading } = useTokenCount(input)

  const canSend = count > 0 && count < 1000

  return (
    <div>
      <MessageList messages={messages} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => sendMessage(input)}
        disabled={!canSend || isLoading}
      >
        Send ({count} tokens)
      </button>
    </div>
  )
}

// 3. With useMemory
import { useMemory } from '@clarity-chat/memory'
import { useTokenCount } from '@clarity-chat/token-optimization'

function MemoryAwareChat() {
  const { history, addMessage } = useMemory()

  // Count tokens in entire conversation
  const conversationText = history
    .map(m => m.content)
    .join('\\n')

  const { count } = useTokenCount(conversationText)

  // Warn when approaching context limit
  const contextLimit = 128000
  const usage = (count / contextLimit) * 100

  return (
    <div>
      <div className="context-usage">
        Context: {usage.toFixed(1)}% ({count.toLocaleString()} tokens)
        {usage > 80 && <Warning>Context nearly full</Warning>}
      </div>
      <Chat history={history} />
    </div>
  )
}

// 4. With custom validation
import { useTokenCount } from '@clarity-chat/token-optimization'
import { z } from 'zod'

function ValidatedInput() {
  const [text, setText] = useState('')
  const { count, error } = useTokenCount(text)

  // Combine token counting with Zod validation
  const schema = z.object({
    text: z.string()
      .min(1, 'Text is required')
      .refine(() => !error, 'Token counting failed')
      .refine(() => count <= 1000, 'Text too long (max 1000 tokens)')
  })

  const validation = schema.safeParse({ text })

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      {!validation.success && (
        <div className="errors">
          {validation.error.issues.map(issue => (
            <p key={issue.path.join('.')}>{issue.message}</p>
          ))}
        </div>
      )}
      <p>{count} / 1000 tokens</p>
    </div>
  )
}`

const troubleshootingCode = `// Troubleshooting common issues

// Issue 1: Count always shows 0
// Cause: Text is empty or model initialization failed
// Solution:
function Debug1() {
  const { count, error, isLoading } = useTokenCount(text)

  console.log('Text:', text)
  console.log('Count:', count)
  console.log('Error:', error)
  console.log('Loading:', isLoading)

  if (error) return <div>Error: {error.message}</div>
  if (isLoading) return <div>Loading...</div>
  if (!text) return <div>No text provided</div>

  return <div>{count} tokens</div>
}

// Issue 2: Count doesn't update
// Cause: Debounce too long or text not changing
// Solution:
function Debug2() {
  const [text, setText] = useState('')

  // Force immediate update
  const { count, recount } = useTokenCount(text, {
    debounceMs: 0 // Disable debounce for debugging
  })

  useEffect(() => {
    console.log('Text changed:', text)
    recount() // Force recount
  }, [text, recount])

  return <div>{count} tokens</div>
}

// Issue 3: Memory leak warnings
// Cause: Hook not cleaning up properly
// Solution: Ensure component unmounts cleanly
function Debug3() {
  const [mounted, setMounted] = useState(true)
  const { count } = useTokenCount(text, {
    enabled: mounted // Disable on unmount
  })

  useEffect(() => {
    return () => setMounted(false)
  }, [])

  return <div>{count} tokens</div>
}

// Issue 4: Count differs from API
// Cause: Different tokenizers or estimation
// Solution: Use exact model match
function Debug4() {
  // ❌ Generic model
  const generic = useTokenCount(text, { model: 'gpt-4' })

  // ✅ Exact model match
  const exact = useTokenCount(text, {
    model: 'gpt-4o-2024-11-20' // Exact version
  })

  return (
    <div>
      <p>Generic: {generic.count} tokens</p>
      <p>Exact: {exact.count} tokens</p>
    </div>
  )
}

// Issue 5: Performance problems
// Cause: Counting large text with no debounce
// Solution:
function Debug5() {
  const textLength = text.length

  // Adaptive debouncing
  const { count } = useTokenCount(text, {
    debounceMs: textLength < 100 ? 0 :
                textLength < 1000 ? 150 :
                textLength < 10000 ? 300 : 500
  })

  return <div>{count} tokens</div>
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseTokenCountPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Calculator className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                      HIGH PRIORITY
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Cost Tracking
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useTokenCount
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                The simplest way to count tokens in React. Just pass text, get
                a count. Features automatic debouncing, caching, React 19
                useDeferredValue integration, and support for all major AI
                models.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Zap,
                  label: 'Zero Config',
                  desc: 'Works out of the box',
                },
                {
                  icon: Clock,
                  label: 'Auto Debouncing',
                  desc: '150ms default',
                },
                {
                  icon: Database,
                  label: 'Built-in Cache',
                  desc: '~99% hit rate',
                },
                {
                  icon: Activity,
                  label: 'React 19',
                  desc: 'useDeferredValue',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The <code>useTokenCount</code> hook provides accurate token
                  counting for any text with automatic debouncing, caching, and
                  React 19 optimizations. It's the foundation for token budget
                  management, cost estimation, and context window optimization.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Accurate Tokenization:</strong> Uses gpt-tokenizer
                    for exact counts matching API usage
                  </li>
                  <li>
                    <strong>Multi-Model Support:</strong> OpenAI (GPT-4o, o1,
                    o3), Anthropic Claude, Google Gemini
                  </li>
                  <li>
                    <strong>Automatic Debouncing:</strong> Prevents excessive
                    re-renders during rapid typing
                  </li>
                  <li>
                    <strong>Built-in Caching:</strong> LRU cache with 10,000
                    entries for instant repeat counts
                  </li>
                  <li>
                    <strong>React 19 useDeferredValue:</strong> Non-blocking UI
                    during expensive counting
                  </li>
                  <li>
                    <strong>Additional Metrics:</strong> Character count, word
                    count, and chars/token ratio
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border/50 not-prose">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Use Case
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Recommended Hook
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">Simple token counting</td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenCount
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">
                          Token counting with budget limits
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenBudget
                        </td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">
                          Full optimization pipeline
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenOptimization
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Cost estimation</td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenBudgetMonitor
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* API Reference Section */}
            <Section id="api-reference" title="API Reference">
              <SubSection id="signature" title="Signature">
                <CodeBlock
                  code={signatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="parameters" title="Parameters">
                <div className="mb-4">
                  <p className="text-muted-foreground mb-4">
                    The hook accepts two parameters:
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border/50">
                      <code className="text-brand-600 dark:text-brand-400">
                        text
                      </code>
                      <span className="text-red-500 ml-1">*</span>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        string
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        The text to count tokens for. Can be empty string (returns 0).
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50">
                      <code className="text-brand-600 dark:text-brand-400">
                        options
                      </code>
                      <span className="ml-2 text-xs font-mono text-muted-foreground">
                        UseTokenCountOptions (optional)
                      </span>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Configuration options for the hook.
                      </p>
                    </div>
                  </div>
                </div>
                <PropsTable props={optionsProps} title="Options Properties" />
              </SubSection>

              <SubSection id="return-value" title="Return Value">
                <p className="text-muted-foreground mb-4">
                  The hook returns a <code>UseTokenCountReturn</code> object
                  with the following properties:
                </p>
                <PropsTable props={returnProps} />
                <div className="mt-4">
                  <PropsTable props={infoProps} title="info Properties" />
                </div>
              </SubSection>
            </Section>

            {/* Basic Usage Section */}
            <Section id="usage" title="Basic Usage">
              <SubSection id="basic-example" title="Simple Counter">
                <p className="text-muted-foreground mb-4">
                  The most basic usage - just pass text and get a count:
                </p>
                <CodeBlock
                  code={basicExampleCode}
                  language="tsx"
                  filename="SimpleCounter.tsx"
                />
              </SubSection>

              <SubSection id="with-loading" title="With Loading State">
                <p className="text-muted-foreground mb-4">
                  Handle loading state and display additional information:
                </p>
                <CodeBlock
                  code={withLoadingCode}
                  language="tsx"
                  filename="TokenDisplay.tsx"
                />
              </SubSection>

              <SubSection id="model-selection" title="Model Selection">
                <p className="text-muted-foreground mb-4">
                  Count tokens for different AI models:
                </p>
                <CodeBlock
                  code={modelSelectionCode}
                  language="tsx"
                  filename="ModelAwareCounter.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Advanced Patterns Section */}
            <Section id="advanced" title="Advanced Patterns">
              <SubSection id="debouncing" title="Custom Debouncing">
                <p className="text-muted-foreground mb-4">
                  Adjust debounce timing based on context:
                </p>
                <CodeBlock
                  code={customDebouncingCode}
                  language="tsx"
                  filename="CustomDebounce.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="real-time" title="Real-Time Counting">
                <p className="text-muted-foreground mb-4">
                  Disable debouncing for instant feedback:
                </p>
                <CodeBlock
                  code={realTimeCountingCode}
                  language="tsx"
                  filename="RealTimeCounter.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="conditional" title="Conditional Counting">
                <p className="text-muted-foreground mb-4">
                  Enable/disable counting dynamically:
                </p>
                <CodeBlock
                  code={conditionalCountingCode}
                  language="tsx"
                  filename="ConditionalCounter.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="force-recount" title="Force Recount">
                <p className="text-muted-foreground mb-4">
                  Bypass debounce for immediate results:
                </p>
                <CodeBlock
                  code={forceRecountCode}
                  language="tsx"
                  filename="ForceRecount.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* React 19 Features Section */}
            <Section id="react-19" title="React 19 Features">
              <SubSection id="use-deferred-value" title="useDeferredValue">
                <p className="text-muted-foreground mb-4">
                  The hook uses React 19's useDeferredValue internally to
                  prevent UI blocking:
                </p>
                <CodeBlock
                  code={useDeferredValueCode}
                  language="tsx"
                  filename="DeferredValue.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="stale-indicator" title="Stale Indicator">
                <p className="text-muted-foreground mb-4">
                  Use the isStale flag for comprehensive status indicators:
                </p>
                <CodeBlock
                  code={staleIndicatorCode}
                  language="tsx"
                  filename="StaleIndicator.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Performance Section */}
            <Section id="performance" title="Performance">
              <SubSection id="caching" title="Caching Strategy">
                <p className="text-muted-foreground mb-4">
                  The hook uses an internal LRU cache for optimal performance:
                </p>
                <CodeBlock
                  code={cachingStrategyCode}
                  language="tsx"
                  filename="CachingStrategy.ts"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="optimization-tips" title="Optimization Tips">
                <p className="text-muted-foreground mb-4">
                  Best practices for optimal performance:
                </p>
                <CodeBlock
                  code={optimizationTipsCode}
                  language="tsx"
                  filename="OptimizationTips.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Common Pitfalls Section */}
            <Section id="pitfalls" title="Common Pitfalls">
              <p className="text-muted-foreground mb-4">
                Avoid these common mistakes when using useTokenCount:
              </p>
              <CodeBlock
                code={pitfallsCode}
                language="tsx"
                filename="CommonPitfalls.tsx"
                showLineNumbers
              />
            </Section>

            {/* Integration Patterns Section */}
            <Section id="integration" title="Integration Patterns">
              <p className="text-muted-foreground mb-4">
                Examples of integrating useTokenCount with other hooks:
              </p>
              <CodeBlock
                code={integrationCode}
                language="tsx"
                filename="Integration.tsx"
                showLineNumbers
              />
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Count always shows 0
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    This can happen when text is empty or tokenizer initialization fails.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Check that text prop is not empty</li>
                    <li>Verify model name is supported</li>
                    <li>Check console for error messages</li>
                    <li>Use error and isLoading flags to debug</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Count doesn't update
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Usually caused by long debounce or stale text reference.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Reduce debounceMs for faster updates</li>
                    <li>Check that text is actually changing</li>
                    <li>Use recount() to force immediate update</li>
                    <li>Verify enabled option is true</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Performance issues
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Large texts or no debouncing can cause performance problems.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Increase debounceMs for large texts (300-500ms)</li>
                    <li>Disable counting when component is not visible</li>
                    <li>Use React.memo to prevent unnecessary re-renders</li>
                    <li>Check that you're not calling recount() too often</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Count differs from API
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Token counts may differ slightly from actual API usage.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Use exact model version (e.g., 'gpt-4o-2024-11-20')</li>
                    <li>Message formatting adds ~4 tokens per message</li>
                    <li>System prompts may have additional overhead</li>
                    <li>Claude/Gemini counts are estimates (~90% accurate)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground mb-4">
                  For detailed debugging examples:
                </p>
                <CodeBlock
                  code={troubleshootingCode}
                  language="tsx"
                  filename="Troubleshooting.tsx"
                  showLineNumbers
                />
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useTokenBudget',
                    type: 'hook',
                    description:
                      'Token counting with budget limits and visual indicators',
                    href: '/reference/hooks/use-token-budget',
                  },
                  {
                    name: 'useTokenOptimization',
                    type: 'hook',
                    description:
                      'Full token optimization pipeline with caching and compression',
                    href: '/reference/hooks/use-token-optimization',
                  },
                  {
                    name: 'AccurateTokenCounter',
                    type: 'class',
                    description:
                      'Low-level tokenizer class for advanced use cases',
                    href: '/reference/utilities/accurate-token-counter',
                  },
                  {
                    name: 'TokenBudgetBar',
                    type: 'component',
                    description: 'Pre-built UI component for displaying token usage',
                    href: '/reference/components/token-budget-bar',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'component'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-green-500/10 text-green-600 dark:text-green-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-token-optimization"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Token Optimization Hooks
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-token-budget"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      useTokenBudget
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
