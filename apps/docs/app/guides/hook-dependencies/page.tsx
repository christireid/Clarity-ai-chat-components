import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Hook Dependencies Guide - Clarity Chat Components',
  description:
    'Understand hook dependencies, when hooks depend on each other, and how to manage hook composition effectively.',
}

export default function HookDependenciesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Hook Dependencies</h1>
        <p className="docs-lead">
          Understand hook dependencies, when hooks depend on each other, and how
          to manage hook composition effectively.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand hook dependencies',
          'Compose hooks effectively',
          'Avoid dependency cycles',
          'Manage hook order',
          'Debug hook issues',
        ]}
      />

      <section className="docs-section">
        <h2>Hook Composition</h2>
        <p>Compose hooks in the correct order:</p>
        <CodePlayground
          initialCode={`import {
  useClarityChat,
  useTokenOptimizationEnhanced,
  useStreaming,
} from '@clarity-chat/react/internal'

function ChatWithHooks() {
  // 1. Base chat hook (no dependencies)
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // 2. Token optimization (depends on messages)
  const optimized = useTokenOptimizationEnhanced({
    messages: chat.messages,
    enableToon: true,
  })

  // 3. Streaming (depends on chat)
  const streaming = useStreaming({
    onChunk: (chunk) => {
      chat.appendMessage(chunk)
    },
  })

  return (
    <ChatWindow
      messages={optimized.messages}
      onSend={chat.sendMessage}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Dependency Order</h2>
        <p>Order hooks by dependency:</p>
        <CodePlayground
          initialCode={`// Correct order
function CorrectHookOrder() {
  // Independent hooks first
  const battery = useBatteryAware()
  const keyboard = useMobileKeyboard()

  // Hooks that depend on state
  const chat = useClarityChat({ api: '/api/chat' })

  // Hooks that depend on chat
  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages,
  })

  // Hooks that depend on optimization
  const budget = useTokenBudgetMonitor({
    messages: optimization.messages,
  })

  return <ChatWindow messages={budget.messages} />
}

// Incorrect order (will cause issues)
function IncorrectHookOrder() {
  // ❌ Using chat before it's defined
  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages, // Error: chat is not defined
  })

  const chat = useClarityChat({ api: '/api/chat' })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Avoiding Dependency Cycles</h2>
        <p>Avoid circular dependencies:</p>
        <CodePlayground
          initialCode={`// ❌ Circular dependency
function CircularDependency() {
  const chat = useClarityChat({
    onMessage: (msg) => {
      optimization.optimize(msg) // Uses optimization
    },
  })

  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages, // Uses chat
  })
}

// ✅ No circular dependency
function NoCircularDependency() {
  const chat = useClarityChat({ api: '/api/chat' })

  const optimization = useTokenOptimizationEnhanced({
    messages: chat.messages,
  })

  // Use optimization results separately
  useEffect(() => {
    if (optimization.messages.length > 0) {
      chat.updateMessages(optimization.messages)
    }
  }, [optimization.messages])
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conditional Hooks</h2>
        <p>Handle conditional hook usage:</p>
        <CodePlayground
          initialCode={`// ✅ Conditional hooks (same order)
function ConditionalHooks({ enableOptimization }: { enableOptimization: boolean }) {
  const chat = useClarityChat({ api: '/api/chat' })

  // Always call hooks in the same order
  const optimization = enableOptimization
    ? useTokenOptimizationEnhanced({ messages: chat.messages })
    : { messages: chat.messages } // Return same shape

  return <ChatWindow messages={optimization.messages} />
}

// ❌ Conditional hook calls (wrong)
function WrongConditionalHooks({ enableOptimization }: { enableOptimization: boolean }) {
  if (enableOptimization) {
    const optimization = useTokenOptimizationEnhanced({ messages: [] })
    // Error: Hooks must be called unconditionally
  }

  const chat = useClarityChat({ api: '/api/chat' })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Hook Dependencies Map</h2>
        <p>Common hook dependencies:</p>
        <ul>
          <li>
            <strong>useClarityChat</strong>: No dependencies (base hook)
          </li>
          <li>
            <strong>useTokenOptimizationEnhanced</strong>: Depends on messages
            (from useClarityChat)
          </li>
          <li>
            <strong>useTokenBudgetMonitor</strong>: Depends on messages (from
            useClarityChat or useTokenOptimizationEnhanced)
          </li>
          <li>
            <strong>useStreaming</strong>: Depends on useClarityChat
          </li>
          <li>
            <strong>useContextMonitor</strong>: Depends on messages
          </li>
          <li>
            <strong>useBatteryAware</strong>: No dependencies (independent)
          </li>
          <li>
            <strong>useMobileKeyboard</strong>: No dependencies (independent)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Call hooks in the same order every render</li>
          <li>Order hooks by dependency (independent first)</li>
          <li>Avoid circular dependencies</li>
          <li>Use conditional logic inside hooks, not around them</li>
          <li>Document hook dependencies in your code</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/composition-patterns">Composition Patterns</a> -
            Hook composition
          </li>
          <li>
            <a href="/guides/data-flow">Data Flow</a> - Data flow documentation
          </li>
        </ul>
      </section>
    </div>
  )
}
