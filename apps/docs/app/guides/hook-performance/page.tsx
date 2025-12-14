import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Hook Performance Guide - Clarity Chat Components',
  description:
    'Learn how to optimize hook performance, including dependency management, memoization, and avoiding unnecessary computations.',
}

export default function HookPerformancePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Hook Performance</h1>
        <p className="docs-lead">
          Learn how to optimize hook performance, including dependency
          management, memoization, avoiding unnecessary computations, and hook
          composition.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Optimize hook dependencies',
          'Memoize hook results',
          'Avoid unnecessary hook calls',
          'Compose hooks efficiently',
          'Measure hook performance',
        ]}
      />

      <section className="docs-section">
        <h2>Dependency Optimization</h2>
        <p>Optimize hook dependencies:</p>
        <CodePlayground
          initialCode={`import { useMemo, useCallback } from 'react'
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function OptimizedChat() {
  const [messages, setMessages] = useState([])

  // Memoize options object
  const optimizationOptions = useMemo(() => ({
    enableToon: true,
    enablePromptCaching: true,
    maxTokens: 4000,
  }), [])

  // Hook uses memoized options
  const optimization = useTokenOptimizationEnhanced({
    messages,
    ...optimizationOptions,
  })

  // Memoize callback
  const handleSend = useCallback((content: string) => {
    setMessages(prev => [...prev, { content }])
  }, [])

  return (
    <ChatWindow
      messages={optimization.messages}
      onSend={handleSend}
    />
  )
}

// ❌ Bad: Creating new object on every render
function BadExample() {
  const optimization = useTokenOptimizationEnhanced({
    messages,
    options: { enableToon: true }, // New object every render!
  })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Memoizing Hook Results</h2>
        <p>Memoize expensive hook computations:</p>
        <CodePlayground
          initialCode={`import { useMemo } from 'react'
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function MemoizedResults() {
  const optimization = useTokenOptimizationEnhanced({
    messages,
    enableToon: true,
  })

  // Memoize expensive computation
  const tokenStats = useMemo(() => {
    return {
      total: optimization.totalTokens,
      saved: optimization.savedTokens,
      percentage: (optimization.savedTokens / optimization.totalTokens) * 100,
    }
  }, [optimization.totalTokens, optimization.savedTokens])

  return (
    <div>
      <TokenStats stats={tokenStats} />
      <ChatWindow messages={optimization.messages} />
    </div>
  )
}

// Memoize filtered/transformed data
function FilteredMessages() {
  const chat = useClarityChat({ api: '/api/chat' })

  const visibleMessages = useMemo(() => {
    return chat.messages.filter(msg => !msg.hidden)
  }, [chat.messages])

  return <MessageList messages={visibleMessages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Avoiding Unnecessary Hook Calls</h2>
        <p>Avoid calling hooks unnecessarily:</p>
        <CodePlayground
          initialCode={`import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

// ✅ Good: Conditional logic inside hook
function ConditionalOptimization({ enableOptimization }: { enableOptimization: boolean }) {
  const optimization = useTokenOptimizationEnhanced({
    messages,
    enableToon: enableOptimization,
    // Hook always called, but options change
  })

  return <ChatWindow messages={optimization.messages} />
}

// ❌ Bad: Conditional hook call
function BadConditional({ enableOptimization }: { enableOptimization: boolean }) {
  if (enableOptimization) {
    const optimization = useTokenOptimizationEnhanced({ messages })
    // Error: Hooks must be called unconditionally
  }
}

// ✅ Good: Use hook options for conditional behavior
function SmartOptimization() {
  const [enabled, setEnabled] = useState(true)

  const optimization = useTokenOptimizationEnhanced({
    messages,
    enableToon: enabled, // Control via options
    enablePromptCaching: enabled,
  })

  return (
    <div>
      <button onClick={() => setEnabled(!enabled)}>
        Toggle Optimization
      </button>
      <ChatWindow messages={optimization.messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Hook Composition</h2>
        <p>Compose hooks efficiently:</p>
        <CodePlayground
          initialCode={`import {
  useClarityChat,
  useTokenOptimizationEnhanced,
  useTokenBudgetMonitor,
} from '@clarity-chat/react'

// ✅ Good: Compose hooks in order
function ComposedHooks() {
  // Base hook
  const chat = useClarityChat({ api: '/api/chat' })

  // Depends on chat.messages
  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages,
  })

  // Depends on optimization.messages
  const budget = useTokenBudgetMonitor({
    messages: optimization.messages,
  })

  return (
    <ChatWindow
      messages={budget.messages}
      onSend={chat.sendMessage}
    />
  )
}

// Custom hook to encapsulate composition
function useOptimizedChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages,
  })
  const budget = useTokenBudgetMonitor({
    messages: optimization.messages,
  })

  return {
    ...chat,
    messages: budget.messages,
    optimization,
    budget,
  }
}

// Use composed hook
function ChatWithOptimization() {
  const chat = useOptimizedChat()
  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance Measurement</h2>
        <p>Measure hook performance:</p>
        <CodePlayground
          initialCode={`import { useEffect, useRef } from 'react'
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function MeasuredOptimization() {
  const startTime = useRef(Date.now())

  const optimization = useTokenOptimizationEnhanced({
    messages,
    enableToon: true,
  })

  useEffect(() => {
    const duration = Date.now() - startTime.current
    console.log(\`Optimization took \${duration}ms\`)

    if (duration > 100) {
      console.warn('Optimization is slow')
    }
  }, [optimization.messages])

  return <ChatWindow messages={optimization.messages} />
}

// Use React DevTools Profiler
// Or PerformanceAnalyticsDashboard
function AnalyticsOptimization() {
  const optimization = useTokenOptimizationEnhanced({ messages })

  return (
    <div>
      <ChatWindow messages={optimization.messages} />
      <PerformanceAnalyticsDashboard
        metrics={{
          hookExecution: true,
          hookDuration: true,
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Memoize hook options and dependencies</li>
          <li>Use useMemo for expensive hook computations</li>
          <li>Compose hooks in the correct order</li>
          <li>Avoid conditional hook calls</li>
          <li>Measure hook performance</li>
          <li>Create custom hooks for common compositions</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/hook-dependencies">Hook Dependencies</a> -
            Dependency management
          </li>
          <li>
            <a href="/guides/performance-optimization-patterns">
              Performance Optimization Patterns
            </a>{' '}
            - General optimization
          </li>
        </ul>
      </section>
    </div>
  )
}
