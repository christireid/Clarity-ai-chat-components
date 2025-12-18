import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Component Optimization Guide - Clarity Chat Components',
  description:
    'Learn how to optimize Clarity Chat Components for performance, including rendering optimization, memoization, and code splitting.',
}

export default function ComponentOptimizationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Component Optimization</h1>
        <p className="docs-lead">
          Learn how to optimize Clarity Chat Components for performance,
          including rendering optimization, memoization, code splitting, and
          bundle size reduction.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Optimize component rendering',
          'Reduce re-renders',
          'Split component code',
          'Optimize bundle size',
          'Measure component performance',
        ]}
      />

      <section className="docs-section">
        <h2>Rendering Optimization</h2>
        <p>Optimize component rendering:</p>
        <CodePlayground
          initialCode={`import { memo, useMemo } from 'react'
import { Message } from '@clarity-chat/react'

// Memoize expensive components
const OptimizedMessage = memo(({ message }: { message: Message }) => {
  return <Message message={message} />
}, (prev, next) => {
  // Only re-render if message content or id changes
  return prev.message.id === next.message.id &&
         prev.message.content === next.message.content
})

// Memoize expensive computations
function ChatWindow({ messages }: { messages: Message[] }) {
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      a.timestamp - b.timestamp
    )
  }, [messages])

  return (
    <MessageList messages={sortedMessages} />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Reducing Re-renders</h2>
        <p>Reduce unnecessary re-renders:</p>
        <CodePlayground
          initialCode={`import { useCallback, useMemo } from 'react'
import { ChatInput } from '@clarity-chat/react'

function OptimizedChat() {
  const [messages, setMessages] = useState([])

  // Memoize callbacks to prevent re-renders
  const handleSend = useCallback((content: string) => {
    setMessages(prev => [...prev, { content, timestamp: Date.now() }])
  }, [])

  // Memoize props
  const chatProps = useMemo(() => ({
    messages,
    onSend: handleSend,
  }), [messages, handleSend])

  return (
    <ChatWindow {...chatProps} />
  )
}

// Use React.memo for child components
const MessageList = memo(({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  )
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Code Splitting</h2>
        <p>Split component code:</p>
        <CodePlayground
          initialCode={`import { lazy, Suspense } from 'react'

// Lazy load heavy components
const PerformanceAnalytics = lazy(() => 
  import('@clarity-chat/react').then(module => ({
    default: module.PerformanceAnalyticsDashboard
  }))
)

const AdvancedFeatures = lazy(() => import('./AdvancedFeatures'))

function OptimizedChat() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <div>
      <ChatWindow messages={messages} />
      <button onClick={() => setShowAnalytics(true)}>
        Show Analytics
      </button>
      {showAnalytics && (
        <Suspense fallback={<div>Loading...</div>}>
          <PerformanceAnalytics />
        </Suspense>
      )}
    </div>
  )
}

// Route-based code splitting
const ChatPage = lazy(() => import('./ChatPage'))
const SettingsPage = lazy(() => import('./SettingsPage'))`}
        />
      </section>

      <section className="docs-section">
        <h2>Bundle Size Optimization</h2>
        <p>Optimize bundle size:</p>
        <CodePlayground
          initialCode={`// Import only what you need
import { ChatWindow } from '@clarity-chat/react'
// Instead of: import * from '@clarity-chat/react'

// Tree-shake unused code
import { useClarityChat } from '@clarity-chat/react/hooks'
// Instead of: import { useClarityChat } from '@clarity-chat/react'

// Use dynamic imports for optional features
function ConditionalFeature() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (enabled) {
      import('@clarity-chat/react/advanced').then(module => {
        // Load advanced features only when needed
      })
    }
  }, [enabled])

  return <div>...</div>
}

// Webpack/Vite configuration
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'clarity-chat': ['@clarity-chat/react'],
        },
      },
    },
  },
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance Measurement</h2>
        <p>Measure component performance:</p>
        <CodePlayground
          initialCode={`import { Profiler } from 'react'
import { PerformanceAnalyticsDashboard } from '@clarity-chat/react'

function MeasuredChat() {
  const onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number
  ) => {
    logger.debug(\`\${id} \${phase}: \${actualDuration}ms\`)
    
    // Send to analytics
    if (actualDuration > 16) { // > 1 frame at 60fps
      sendPerformanceMetric({
        component: id,
        phase,
        duration: actualDuration,
      })
    }
  }

  return (
    <Profiler id="ChatWindow" onRender={onRenderCallback}>
      <ChatWindow messages={messages} />
    </Profiler>
  )
}

// Or use PerformanceAnalyticsDashboard
function AnalyticsChat() {
  return (
    <div>
      <ChatWindow messages={messages} />
      <PerformanceAnalyticsDashboard
        metrics={{
          componentRenders: true,
          renderDuration: true,
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
          <li>Memoize expensive components and computations</li>
          <li>Use useCallback for event handlers</li>
          <li>Split code by route or feature</li>
          <li>Import only what you need</li>
          <li>Measure performance before optimizing</li>
          <li>Use React DevTools Profiler</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/performance-optimization-patterns">
              Performance Optimization Patterns
            </a>{' '}
            - General optimization guide
          </li>
          <li>
            <a href="/reference/components/performance-analytics-dashboard">
              PerformanceAnalyticsDashboard
            </a>{' '}
            - Performance monitoring
          </li>
        </ul>
      </section>
    </div>
  )
}
