import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Performance Optimization Patterns - Clarity Chat Components',
  description:
    'Learn performance optimization patterns for Clarity Chat Components including memoization, virtualization, and lazy loading.',
}

export default function PerformanceOptimizationPatternsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Performance Optimization Patterns</h1>
        <p className="docs-lead">
          Learn performance optimization patterns for Clarity Chat Components
          including memoization, virtualization, lazy loading, and code
          splitting.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Optimize component rendering',
          'Use memoization effectively',
          'Implement virtualization',
          'Lazy load components',
          'Optimize bundle size',
        ]}
      />

      <section className="docs-section">
        <h2>Memoization</h2>
        <p>Use React.memo and useMemo for optimization:</p>
        <CodePlayground
          code={`import { memo, useMemo } from 'react'
import { Message } from '@clarity-chat/react/internal'

// Memoize message component
const OptimizedMessage = memo(({ message }: { message: Message }) => {
  return <Message message={message} />
}, (prev, next) => {
  // Custom comparison
  return prev.message.id === next.message.id &&
         prev.message.content === next.message.content
})

// Memoize expensive computations
function ChatWindow({ messages }: { messages: Message[] }) {
  const sortedMessages = useMemo(() => {
    return messages.sort((a, b) => 
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
        <h2>Virtualization</h2>
        <p>Virtualize long message lists:</p>
        <CodePlayground
          code={`import { useVirtualizer } from '@tanstack/react-virtual'
import { MessageList } from '@clarity-chat/react/internal'

function VirtualizedMessageList({ messages }: { messages: Message[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated message height
    overscan: 5, // Render 5 extra items
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: \`\${virtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = messages[virtualItem.index]
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: \`\${virtualItem.size}px\`,
                transform: \`translateY(\${virtualItem.start}px)\`,
              }}
            >
              <Message message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Lazy Loading</h2>
        <p>Lazy load components and features:</p>
        <CodePlayground
          code={`import { lazy, Suspense } from 'react'
import { ChatWindow } from '@clarity-chat/react/internal'

// Lazy load heavy components
const PerformanceAnalytics = lazy(() => 
  import('@clarity-chat/react').then(module => ({
    default: module.PerformanceAnalyticsDashboard
  }))
)

function LazyLoadedChat() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  return (
    <div>
      <ChatWindow messages={messages} />
      <button onClick={() => setShowAnalytics(true)}>
        Show Analytics
      </button>
      {showAnalytics && (
        <Suspense fallback={<div>Loading analytics...</div>}>
          <PerformanceAnalytics />
        </Suspense>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Code Splitting</h2>
        <p>Split code by route or feature:</p>
        <CodePlayground
          code={`// app/chat/page.tsx
import dynamic from 'next/dynamic'

// Dynamic import with no SSR
const ChatWindow = dynamic(
  () => import('@clarity-chat/react').then(mod => mod.ChatWindow),
  { ssr: false }
)

export default function ChatPage() {
  return <ChatWindow messages={messages} />
}

// Or split by feature
const AdvancedFeatures = dynamic(() => import('./AdvancedFeatures'))

function ChatWithFeatures() {
  return (
    <div>
      <ChatWindow messages={messages} />
      <AdvancedFeatures />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Debouncing and Throttling</h2>
        <p>Optimize frequent updates:</p>
        <CodePlayground
          code={`import { useDebouncedCallback } from 'use-debounce'
import { ChatInput } from '@clarity-chat/react/internal'

function OptimizedChatInput() {
  // Debounce search
  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      performSearch(query)
    },
    300 // 300ms delay
  )

  // Throttle scroll
  const throttledScroll = useThrottledCallback(
    () => {
      updateScrollPosition()
    },
    100 // 100ms throttle
  )

  return (
    <ChatInput
      onSearch={debouncedSearch}
      onScroll={throttledScroll}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Memoize expensive computations</li>
          <li>Virtualize long lists</li>
          <li>Lazy load heavy components</li>
          <li>Split code by route/feature</li>
          <li>Debounce/throttle frequent updates</li>
          <li>Monitor performance with analytics</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/performance-analytics-dashboard">
              PerformanceAnalyticsDashboard
            </a>{' '}
            - Performance monitoring
          </li>
          <li>
            <a href="/guides/state-management-patterns">
              State Management Patterns
            </a>{' '}
            - State optimization
          </li>
        </ul>
      </section>
    </div>
  )
}
