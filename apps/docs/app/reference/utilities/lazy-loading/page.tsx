import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lazy Loading',
  description: 'Performance optimization utilities for lazy loading components.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Lazy Loading</h1>
        <p className="lead">
          Performance optimization utilities for lazy loading components,
          reducing bundle size and improving load times.
        </p>
      </div>

      <div className="docs-section">
        <h2>📦 Create Lazy Components</h2>
        <p>Create lazy-loaded components with automatic code splitting.</p>

        <div className="code-block">
          <pre><code>{`import { createLazyComponent } from '@clarity-chat/react'

// Basic lazy component
const LazyMarkdown = createLazyComponent(
  () => import('./components/MarkdownRenderer'),
  <div>Loading markdown...</div>
)

// Use in your component
function MyComponent() {
  return (
    <div>
      <LazyMarkdown content="# Hello" />
    </div>
  )
}`}</code></pre>
        </div>

        <h3>With Error Boundary</h3>
        <div className="code-block">
          <pre><code>{`import { createLazyComponentWithBoundary } from '@clarity-chat/react'

const LazyHeavyComponent = createLazyComponentWithBoundary(
  () => import('./HeavyComponent'),
  {
    fallback: <div>Loading...</div>,
    errorFallback: <div>Failed to load component</div>,
    onError: (error) => console.error('Lazy load failed:', error)
  }
)`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Conditional Loading</h2>
        <p>Load components based on conditions or user interactions.</p>

        <div className="code-block">
          <pre><code>{`import { loadWhen, useConditionalLoad } from '@clarity-chat/react'

// Load when condition is met
const LazyAdminPanel = loadWhen(
  () => userRole === 'admin',
  () => import('./AdminPanel'),
  { placeholder: <div>Access denied</div> }
)

// Hook-based conditional loading
function MyComponent() {
  const LazyComponent = useConditionalLoad(
    isFeatureEnabled,
    () => import('./FeatureComponent')
  )

  return LazyComponent ? <LazyComponent /> : <div>Loading...</div>
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🚩 Feature Flags</h2>
        <p>Load components based on feature flags.</p>

        <div className="code-block">
          <pre><code>{`import { loadFeature, FeatureFlags } from '@clarity-chat/react'

// Load based on feature flag
const LazyAnalytics = loadFeature(
  FeatureFlags.ANALYTICS,
  () => import('./AnalyticsDashboard'),
  () => <div>Analytics not available</div>
)

// Use in component
function Dashboard() {
  return (
    <div>
      <LazyAnalytics />
    </div>
  )
}`}</code></pre>
        </div>

        <h3>Available Feature Flags</h3>
        <div className="feature-flags">
          <div className="flag">
            <code>ADVANCED_MARKDOWN</code>
            <span>Enhanced markdown rendering</span>
          </div>
          <div className="flag">
            <code>CODE_HIGHLIGHTING</code>
            <span>Syntax highlighting</span>
          </div>
          <div className="flag">
            <code>VECTOR_STORE</code>
            <span>Vector store integration</span>
          </div>
          <div className="flag">
            <code>PROMPT_MARKETPLACE</code>
            <span>Prompt marketplace</span>
          </div>
          <div className="flag">
            <code>ANALYTICS</code>
            <span>Analytics tracking</span>
          </div>
          <div className="flag">
            <code>ACCESSIBILITY</code>
            <span>Accessibility features</span>
          </div>
          <div className="flag">
            <code>PERFORMANCE_MONITORING</code>
            <span>Performance monitoring</span>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Pre-configured Components</h2>
        <p>Ready-to-use lazy-loaded components for common features.</p>

        <div className="code-block">
          <pre><code>{`import { LazyComponents } from '@clarity-chat/react'

function App() {
  return (
    <div>
      <LazyComponents.MarkdownRenderer content="# Hello" />
      <LazyComponents.CodeBlock code="console.log('hello')" />
      <LazyComponents.TemplateMarketplace />
      <LazyComponents.AnalyticsDashboard />
    </div>
  )
}`}</code></pre>
        </div>

        <h3>Available Components</h3>
        <ul>
          <li><code>LazyComponents.MarkdownRenderer</code> - Enhanced markdown</li>
          <li><code>LazyComponents.CodeBlock</code> - Syntax highlighted code</li>
          <li><code>LazyComponents.TemplateMarketplace</code> - Prompt marketplace</li>
          <li><code>LazyComponents.AnalyticsDashboard</code> - Analytics UI</li>
          <li><code>LazyComponents.PerformanceMonitor</code> - Performance dashboard</li>
          <li><code>LazyComponents.AccessibilityTester</code> - A11y testing tools</li>
          <li><code>LazyComponents.VectorStoreManager</code> - Memory management UI</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>📊 Performance Monitoring</h2>
        <p>Monitor lazy loading performance and bundle sizes.</p>

        <div className="code-block">
          <pre><code>{`import { LazyLoadPerformanceMonitor } from '@clarity-chat/react'

const monitor = new LazyLoadPerformanceMonitor()

// Track load start
monitor.startLoad('MarkdownRenderer')

// When component loads
import('./MarkdownRenderer').then(() => {
  monitor.endLoad('MarkdownRenderer', 45000) // 45KB
})

// Get metrics
const metrics = monitor.getAllMetrics()
console.log('Load times:', metrics)

// Log slow loads
monitor.logSlowLoads(2000) // Log loads > 2s`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎣 Hooks</h2>
        <p>React hooks for lazy loading with loading states.</p>

        <h3>useLazyLoad</h3>
        <div className="code-block">
          <pre><code>{`import { useLazyLoad } from '@clarity-chat/react'

function LazyButton() {
  const { Component, loading, error, load } = useLazyLoad(
    () => import('./HeavyComponent'),
    {
      preload: false, // Don't load immediately
      onLoad: () => console.log('Component loaded')
    }
  )

  return (
    <div>
      <button onClick={load} disabled={loading}>
        {loading ? 'Loading...' : 'Load Component'}
      </button>
      {Component && <Component />}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}`}</code></pre>
        </div>

        <h3>useConditionalLoad</h3>
        <div className="code-block">
          <pre><code>{`import { useConditionalLoad } from '@clarity-chat/react'

function FeatureComponent({ featureEnabled }: { featureEnabled: boolean }) {
  const LazyComponent = useConditionalLoad(
    featureEnabled,
    () => import('./FeatureSpecificComponent')
  )

  return LazyComponent ? <LazyComponent /> : <div>Feature disabled</div>
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 API Reference</h2>

        <h3>createLazyComponent</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createLazyComponent(importFn, fallback?, errorBoundary?): Component</code>
            <p>Create a lazy-loaded component with React.lazy.</p>
          </div>
        </div>

        <h3>createLazyComponentWithBoundary</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createLazyComponentWithBoundary(importFn, options): Component</code>
            <p>Create lazy component with error boundary and callbacks.</p>
          </div>
        </div>

        <h3>loadWhen</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>loadWhen(condition, importFn, options): Component</code>
            <p>Load component when condition is met.</p>
          </div>
        </div>

        <h3>loadFeature</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>loadFeature(flag, importFn, fallback): Component</code>
            <p>Load component based on feature flag.</p>
          </div>
        </div>

        <h3>preloadComponent</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>preloadComponent(importFn): Promise</code>
            <p>Preload a component module.</p>
          </div>
        </div>

        <h3>LazyComponents</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>LazyComponents.*</code>
            <p>Pre-configured lazy components.</p>
          </div>
        </div>

        <h3>LazyLoadPerformanceMonitor</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>new LazyLoadPerformanceMonitor()</code>
            <p>Create performance monitor.</p>
          </div>
          <div className="api-item">
            <code>startLoad(id)</code>
            <p>Start tracking load time.</p>
          </div>
          <div className="api-item">
            <code>endLoad(id, size?)</code>
            <p>End tracking load time.</p>
          </div>
          <div className="api-item">
            <code>getMetrics(id)</code>
            <p>Get metrics for specific load.</p>
          </div>
          <div className="api-item">
            <code>getAllMetrics()</code>
            <p>Get all load metrics.</p>
          </div>
          <div className="api-item">
            <code>logSlowLoads(threshold)</code>
            <p>Log loads exceeding threshold.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>When to Use Lazy Loading</h3>
        <ul>
          <li>Large components (>50KB)</li>
          <li>Infrequently used features</li>
          <li>Admin/dashboard components</li>
          <li>Heavy visualizations</li>
          <li>Optional integrations</li>
        </ul>

        <h3>Loading Strategies</h3>
        <ul>
          <li><strong>On interaction:</strong> Load when user clicks/hovers</li>
          <li><strong>On condition:</strong> Load when feature is enabled</li>
          <li><strong>On viewport:</strong> Load when component enters viewport</li>
          <li><strong>Route-based:</strong> Load components for specific routes</li>
        </ul>

        <h3>Performance Tips</h3>
        <ul>
          <li>Use dynamic imports for code splitting</li>
          <li>Preload critical components</li>
          <li>Monitor bundle sizes</li>
          <li>Use feature flags for gradual rollout</li>
          <li>Implement proper loading states</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>With React Router</h3>
        <div className="code-block">
          <pre><code>{`import { createLazyComponent } from '@clarity-chat/react'

const LazyDashboard = createLazyComponent(
  () => import('./Dashboard'),
  <div>Loading dashboard...</div>
)

function App() {
  return (
    <Router>
      <Route path="/dashboard" component={LazyDashboard} />
    </Router>
  )
}`}</code></pre>
        </div>

        <h3>With Feature Flags</h3>
        <div className="code-block">
          <pre><code>{`import { loadFeature, FeatureFlags } from '@clarity-chat/react'

// Set feature flags (could come from environment/config)
window.CLARITY_FEATURES = ['analytics', 'accessibility']

function App() {
  const LazyAnalytics = loadFeature(
    FeatureFlags.ANALYTICS,
    () => import('./Analytics'),
    () => <div>Analytics disabled</div>
  )

  return <LazyAnalytics />
}`}</code></pre>
        </div>

        <h3>With Error Boundaries</h3>
        <div className="code-block">
          <pre><code>{`import { createLazyComponentWithBoundary } from '@clarity-chat/react'

const ErrorFallback = ({ error }) => (
  <div>
    <h3>Failed to load component</h3>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>
      Reload
    </button>
  </div>
)

const LazyComponent = createLazyComponentWithBoundary(
  () => import('./HeavyComponent'),
  {
    fallback: <div>Loading...</div>,
    errorFallback: <ErrorFallback />,
    onError: (error) => {
      // Log to error reporting service
      reportError(error)
    }
  }
)`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Components not loading</h4>
            <p>Check that dynamic imports are correctly formatted and paths are valid.</p>
          </div>
          <div className="issue">
            <h4>Bundle not splitting</h4>
            <p>Ensure your bundler supports dynamic imports and code splitting.</p>
          </div>
          <div className="issue">
            <h4>Slow loading times</h4>
            <p>Use performance monitoring to identify bottlenecks and consider preloading.</p>
          </div>
          <div className="issue">
            <h4>Feature flags not working</h4>
            <p>Check that feature flags are properly configured in your environment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}