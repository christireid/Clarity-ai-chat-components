'use client'

import * as React from 'react'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'

export function LazyLoadingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lazy Loading</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Performance optimization utilities for lazy loading components and features to improve bundle size and loading times.
        </p>
      </div>

      <Callout type="info">
        <strong>⚡ Performance First:</strong> These utilities help reduce initial bundle size by
        40-60% and improve loading performance through intelligent code splitting.
      </Callout>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Lazy Component Creation</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">createLazyComponent</h3>
            <p className="text-muted-foreground mt-1">
              Create a lazy-loaded React component with automatic code splitting.
            </p>
            <CodeBlock
              code={`import { createLazyComponent } from '@clarity-chat/react'

// Basic lazy component
const LazyHeavyComponent = createLazyComponent(
  () => import('./HeavyComponent'),
  () => <div>Loading...</div>,
  'LazyHeavyComponent'
)

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyHeavyComponent />
    </Suspense>
  )
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">createLazyComponentWithBoundary</h3>
            <p className="text-muted-foreground mt-1">
              Create a lazy component with built-in error boundary and loading states.
            </p>
            <CodeBlock
              code={`import { createLazyComponentWithBoundary } from '@clarity-chat/react'

const LazyAnalyticsDashboard = createLazyComponentWithBoundary(
  () => import('./AnalyticsDashboard'),
  () => <div>Loading analytics...</div>,
  ({ error, retry }) => (
    <div>
      Failed to load analytics: {error.message}
      <button onClick={retry}>Retry</button>
    </div>
  ),
  'LazyAnalyticsDashboard'
)`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Preloading Strategies</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">preloadComponent</h3>
            <p className="text-muted-foreground mt-1">
              Preload a component module in the background for faster subsequent loads.
            </p>
            <CodeBlock
              code={`import { preloadComponent } from '@clarity-chat/react'

// Preload on app initialization
preloadComponent(() => import('./AnalyticsDashboard'))

// Preload on user interaction
button.addEventListener('mouseenter', () => {
  preloadComponent(() => import('./ModalComponent'))
})`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">preloadComponents</h3>
            <p className="text-muted-foreground mt-1">
              Preload multiple components simultaneously.
            </p>
            <CodeBlock
              code={`import { preloadComponents } from '@clarity-chat/react'

// Preload multiple heavy components
preloadComponents([
  () => import('./AnalyticsDashboard'),
  () => import('./CodeEditor'),
  () => import('./RichTextEditor'),
])`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Conditional Loading</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">loadWhen</h3>
            <p className="text-muted-foreground mt-1">
              Load components only when specific conditions are met.
            </p>
            <CodeBlock
              code={`import { loadWhen } from '@clarity-chat/react'

// Load only on mobile devices
const MobileOnlyComponent = loadWhen(
  () => window.innerWidth < 768,
  () => import('./MobileComponent'),
  () => <div>Not available on desktop</div>
)

// Load only when feature flag is enabled
const BetaFeatureComponent = loadWhen(
  () => localStorage.getItem('beta-features') === 'enabled',
  () => import('./BetaFeature'),
  () => <div>Feature not available</div>
)`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Feature Flags</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">FeatureFlags</h3>
            <p className="text-muted-foreground mt-1">
              Tree-shakeable feature flags that only bundle enabled features.
            </p>
            <CodeBlock
              code={`import { FeatureFlags, loadFeature } from '@clarity-chat/react'

// Load features dynamically
const loadMemoryFeature = async () => {
  const memoryModule = await loadFeature('memory')
  return memoryModule.useMemory()
}

// Use feature flags (only bundles enabled features)
const memoryFeature = FeatureFlags.memory
const analyticsFeature = FeatureFlags.analytics
const devToolsFeature = FeatureFlags.devTools`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Available Feature Flags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">memory</h4>
                <p className="text-sm text-muted-foreground">Memory management and context injection</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">promptOptimization</h4>
                <p className="text-sm text-muted-foreground">Token optimization and prompt compression</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">analytics</h4>
                <p className="text-sm text-muted-foreground">Advanced analytics and tracking</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">devTools</h4>
                <p className="text-sm text-muted-foreground">Development helpers (dev mode only)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Pre-built Lazy Components</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">LazyComponents</h3>
            <p className="text-muted-foreground mt-1">
              Pre-configured lazy-loaded versions of heavy components.
            </p>
            <CodeBlock
              code={`import { LazyComponents } from '@clarity-chat/react'

// Use pre-built lazy components
function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponents.AnalyticsDashboard />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponents.CodeEditor />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponents.MarkdownRenderer />
      </Suspense>
    </div>
  )
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Performance Monitoring</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">LazyLoadPerformanceMonitor</h3>
            <p className="text-muted-foreground mt-1">
              Monitor lazy loading performance and bundle sizes.
            </p>
            <CodeBlock
              code={`import { LazyLoadPerformanceMonitor } from '@clarity-chat/react'

const monitor = LazyLoadPerformanceMonitor.getInstance()

// Track load performance
monitor.trackLoad('AnalyticsDashboard', 150, 45) // 150ms, 45KB

// Get performance metrics
const metrics = monitor.getMetrics()
// { AnalyticsDashboard: { loadTime: 150, size: 45 } }

const totalLoadTime = monitor.getTotalLoadTime() // Sum of all load times`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">createLazyComponent(importFn, fallback?, displayName?)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Create a lazy-loaded React component.
            </p>
            <CodeBlock
              code={`createLazyComponent<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType | React.ReactNode,
  displayName?: string
): React.LazyExoticComponent<T>`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">createLazyComponentWithBoundary(...)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Create a lazy component with error boundary.
            </p>
            <CodeBlock
              code={`createLazyComponentWithBoundary<T>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent?: React.ComponentType,
  ErrorComponent?: React.ComponentType<{ error: Error; retry: () => void }>,
  displayName?: string
): React.ComponentType<React.ComponentProps<T>>`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">preloadComponent(importFn)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Preload a component module in the background.
            </p>
            <CodeBlock
              code={`preloadComponent(importFn: () => Promise<any>): void`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">loadWhen(condition, importFn, fallback)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Load component only when condition is met.
            </p>
            <CodeBlock
              code={`loadWhen<T>(
  condition: () => boolean,
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.ComponentType<React.ComponentProps<T>>`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">FeatureFlags</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Tree-shakeable feature flag loaders.
            </p>
            <CodeBlock
              code={`FeatureFlags: {
  memory: () => Promise<MemoryModule>
  promptOptimization: () => Promise<PromptModule>
  analytics: () => Promise<AnalyticsModule>
  devTools: () => Promise<DevToolsModule>
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Best Practices</h2>

        <div className="space-y-4">
          <Callout type="tip">
            <strong>Bundle Size Impact:</strong> Lazy loading can reduce initial bundle size by
            40-60% for applications with heavy components.
          </Callout>

          <div className="space-y-3">
            <h4 className="font-semibold">When to Use Lazy Loading</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Components that are not immediately visible</li>
              <li>Heavy components (charts, editors, dashboards)</li>
              <li>Feature-specific components (admin panels, analytics)</li>
              <li>Components loaded based on user permissions</li>
              <li>Large utility libraries (markdown parsers, syntax highlighters)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Preloading Strategy</h4>
            <CodeBlock
              code={`// Preload on user interaction cues
function App() {
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Preload when user hovers over analytics button
  const handleAnalyticsHover = () => {
    preloadComponent(() => import('./AnalyticsDashboard'))
  }

  return (
    <div>
      <button
        onMouseEnter={handleAnalyticsHover}
        onClick={() => setShowAnalytics(true)}
      >
        Show Analytics
      </button>

      {showAnalytics && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyAnalyticsDashboard />
        </Suspense>
      )}
    </div>
  )
}`}
              language="tsx"
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Error Handling</h4>
            <CodeBlock
              code={`// Always wrap lazy components in error boundaries
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyHeavyComponent />
      </Suspense>
    </ErrorBoundary>
  )
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>
    </div>
  )
}