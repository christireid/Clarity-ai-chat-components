'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ToastProvider } from '@clarity-chat/react/internal'

const entryPointComparison: Prop[] = [
  {
    name: '@clarity-chat/react',
    type: '~120KB gzipped',
    required: false,
    default: 'Full',
    description: 'Complete library with all 200+ components and 95+ hooks',
  },
  {
    name: '@clarity-chat/react/core',
    type: '~85KB gzipped',
    required: false,
    default: 'Medium',
    description: 'Core components without enterprise features',
  },
  {
    name: '@clarity-chat/react/core-minimal',
    type: '~30KB gzipped',
    required: false,
    default: 'Minimal',
    description: 'Minimal bundle with lazy-loading for features',
  },
]

const lazyLoadFunctions: Prop[] = [
  {
    name: 'lazyLoadRAG',
    type: '() => Promise<RAGModule>',
    required: false,
    description: 'Lazy-load RAG pipeline components and utilities',
  },
  {
    name: 'lazyLoadAnalytics',
    type: '() => Promise<AnalyticsModule>',
    required: false,
    description: 'Lazy-load analytics dashboard components',
  },
  {
    name: 'lazyLoadTokenOptimization',
    type: '() => Promise<TokenOptModule>',
    required: false,
    description: 'Lazy-load token optimization utilities and UI',
  },
  {
    name: 'lazyLoadVectorStores',
    type: '() => Promise<VectorModule>',
    required: false,
    description: 'Lazy-load vector store integrations',
  },
  {
    name: 'lazyLoadAgents',
    type: '() => Promise<AgentsModule>',
    required: false,
    description: 'Lazy-load agent orchestration components',
  },
  {
    name: 'lazyLoadMemory',
    type: '() => Promise<MemoryModule>',
    required: false,
    description: 'Lazy-load memory management features',
  },
]

export default function BundleSizeGuidePage() {
  return (
    <ToastProvider>
      <Breadcrumbs />

      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
          Performance Guide
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Bundle Size Optimization
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Reduce your bundle size from 120KB to 30KB with entry point selection
          and lazy loading. Ship only what you need.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Choose the right entry point for your app',
          'Use core-minimal for maximum performance',
          'Lazy-load features on demand',
          'Use FeatureLoader for code splitting',
          'Analyze and monitor bundle size',
        ]}
      />

      <Callout type="info" className="my-8">
        <p>
          <strong>TL;DR:</strong> Use{' '}
          <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">
            @clarity-chat/react/core-minimal
          </code>{' '}
          for the smallest bundle (~30KB), then lazy-load features as needed.
        </p>
      </Callout>

      {/* Entry Points Comparison */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Entry Points Comparison</h2>

        <p className="text-text-secondary mb-6">
          Clarity Chat offers three entry points with different bundle sizes.
          Choose based on your needs:
        </p>

        <PropsTable
          props={entryPointComparison}
          title="Bundle Size Comparison"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
            <h3 className="font-bold text-lg mb-2 text-green-600 dark:text-green-400">
              Main Bundle
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Best for: Full-featured apps that use most components
            </p>
            <EnhancedCodeBlock
              code={`import { ClarityChat } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
              language="tsx"
              showCopyButton
            />
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
            <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">
              Core Bundle
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Best for: Standard chat apps without enterprise features
            </p>
            <EnhancedCodeBlock
              code={`import { ClarityChat } from '@clarity-chat/react/core'
import '@clarity-chat/react/styles.css'`}
              language="tsx"
              showCopyButton
            />
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <h3 className="font-bold text-lg mb-2 text-purple-600 dark:text-purple-400">
              Core Minimal
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Best for: Performance-critical apps with lazy loading
            </p>
            <EnhancedCodeBlock
              code={`import { ChatWindow } from '@clarity-chat/react/core-minimal'
import '@clarity-chat/react/styles.css'`}
              language="tsx"
              showCopyButton
            />
          </div>
        </div>
      </section>

      {/* Core Minimal Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">
          Using <code>core-minimal</code>
        </h2>

        <p className="text-text-secondary mb-6">
          The <code>core-minimal</code> entry point includes only essential chat
          components. Advanced features are loaded on-demand using lazy loading
          functions.
        </p>

        <h3 className="text-2xl font-semibold mb-4">
          Included in core-minimal
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">Components</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>
                <code>ChatWindow</code> - Main chat container
              </li>
              <li>
                <code>MessageList</code> - Message display
              </li>
              <li>
                <code>Message</code> - Individual message
              </li>
              <li>
                <code>ChatInput</code> - User input
              </li>
              <li>
                <code>StreamingMessage</code> - Streaming display
              </li>
              <li>
                <code>ThinkingIndicator</code> - Loading state
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">Hooks</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>
                <code>useClarityChat</code> - Primary chat hook
              </li>
              <li>
                <code>useChat</code> - Basic chat state
              </li>
              <li>
                <code>useAutoScroll</code> - Scroll management
              </li>
              <li>
                <code>useStreamingSSE</code> - SSE streaming
              </li>
              <li>
                <code>useDebounce</code> - Input debouncing
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4">Basic Example</h3>

        <EnhancedCodeBlock
          code={`import { useState } from 'react'
import {
  ChatWindow,
  MessageList,
  ChatInput,
  useClarityChat,
} from '@clarity-chat/react/core-minimal'
import type { Message } from '@clarity-chat/types'
import '@clarity-chat/react/styles.css'

function MinimalChat() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow>
      <MessageList messages={messages} />
      <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </ChatWindow>
  )
}

export default MinimalChat`}
          language="tsx"
          filename="MinimalChat.tsx"
          showLineNumbers
          showCopyButton
        />
      </section>

      {/* Lazy Loading Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Lazy Loading Features</h2>

        <p className="text-text-secondary mb-6">
          Load advanced features only when needed. Each lazy-load function
          returns a Promise that resolves to the feature module.
        </p>

        <PropsTable props={lazyLoadFunctions} title="Available Lazy Loaders" />

        <h3 className="text-2xl font-semibold mt-8 mb-4">
          Example: Lazy Loading RAG
        </h3>

        <EnhancedCodeBlock
          code={`import { useState, useEffect } from 'react'
import {
  ChatWindow,
  lazyLoadRAG,
} from '@clarity-chat/react/core-minimal'

function ChatWithRAG() {
  const [RAGModule, setRAGModule] = useState(null)

  // Lazy load RAG when user requests it
  const enableRAG = async () => {
    const module = await lazyLoadRAG()
    setRAGModule(module)
  }

  return (
    <ChatWindow>
      {/* Basic chat UI */}

      {!RAGModule && (
        <button onClick={enableRAG}>
          Enable Document Search
        </button>
      )}

      {RAGModule && (
        <RAGModule.RAGPanel
          onDocumentUpload={handleUpload}
          vectorStore={vectorStore}
        />
      )}
    </ChatWindow>
  )
}`}
          language="tsx"
          filename="ChatWithRAG.tsx"
          showLineNumbers
          showCopyButton
        />

        <Callout type="tip" className="mt-6">
          <p>
            <strong>Pro tip:</strong> Combine lazy loading with React Suspense
            for seamless loading states.
          </p>
        </Callout>
      </section>

      {/* FeatureLoader Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Using FeatureLoader</h2>

        <p className="text-text-secondary mb-6">
          The <code>FeatureLoader</code> class provides a higher-level API for
          managing feature loading with caching, preloading, and error handling.
        </p>

        <EnhancedCodeBlock
          code={`import { FeatureLoader } from '@clarity-chat/react/core-minimal'

// Create a feature loader instance
const loader = new FeatureLoader({
  cache: true,           // Cache loaded modules
  preloadOnIdle: true,   // Preload features when browser is idle
  timeout: 5000,         // Timeout for loading (ms)
})

// Load a feature
const RAG = await loader.load('rag')

// Check if a feature is loaded
if (loader.isLoaded('rag')) {
  // Use RAG features
}

// Preload features for better UX
loader.preload(['analytics', 'memory'])

// Get loading status
const status = loader.getStatus('rag')
// { loaded: true, loading: false, error: null }

// Clear cache if needed
loader.clearCache()`}
          language="tsx"
          filename="feature-loader-example.tsx"
          showLineNumbers
          showCopyButton
        />

        <h3 className="text-2xl font-semibold mt-8 mb-4">
          FeatureLoader with React Context
        </h3>

        <EnhancedCodeBlock
          code={`import { createContext, useContext, useState, useEffect } from 'react'
import { FeatureLoader } from '@clarity-chat/react/core-minimal'

// Create context
const FeatureContext = createContext<FeatureLoader | null>(null)

// Provider component
export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [loader] = useState(() => new FeatureLoader({
    cache: true,
    preloadOnIdle: true,
  }))

  return (
    <FeatureContext.Provider value={loader}>
      {children}
    </FeatureContext.Provider>
  )
}

// Custom hook for loading features
export function useFeature(featureName: string) {
  const loader = useContext(FeatureContext)
  const [feature, setFeature] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loader) return

    setLoading(true)
    loader.load(featureName)
      .then(setFeature)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [loader, featureName])

  return { feature, loading, error }
}

// Usage in component
function AnalyticsDashboard() {
  const { feature: Analytics, loading, error } = useFeature('analytics')

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!Analytics) return null

  return <Analytics.Dashboard data={dashboardData} />
}`}
          language="tsx"
          filename="FeatureProvider.tsx"
          showLineNumbers
          showCopyButton
        />
      </section>

      {/* Bundle Analysis Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Analyzing Your Bundle</h2>

        <p className="text-text-secondary mb-6">
          Use these tools to understand and optimize your bundle size:
        </p>

        <h3 className="text-xl font-semibold mb-4">
          1. Using @next/bundle-analyzer (Next.js)
        </h3>

        <EnhancedCodeBlock
          code={`// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your Next.js config
})

// Run with: ANALYZE=true npm run build`}
          language="javascript"
          filename="next.config.js"
          showCopyButton
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">
          2. Using source-map-explorer (Vite/CRA)
        </h3>

        <EnhancedCodeBlock
          code={`# Install
npm install -D source-map-explorer

# Add to package.json scripts
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Build with source maps and analyze
npm run build
npm run analyze`}
          language="bash"
          filename="Terminal"
          showCopyButton
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">
          3. Import Cost VS Code Extension
        </h3>

        <p className="text-text-secondary mb-4">
          Install the{' '}
          <a
            href="https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost"
            className="text-brand-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Import Cost
          </a>{' '}
          extension to see the size of imports inline in your editor.
        </p>
      </section>

      {/* Best Practices */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Best Practices</h2>

        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h3 className="font-semibold text-lg mb-2">
              1. Start with core-minimal
            </h3>
            <p className="text-text-secondary">
              Begin with the smallest bundle and add features as needed. This
              ensures you only ship what you use.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h3 className="font-semibold text-lg mb-2">2. Preload on idle</h3>
            <p className="text-text-secondary">
              Use <code>requestIdleCallback</code> or FeatureLoader's{' '}
              <code>preloadOnIdle</code> to load features during idle time.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h3 className="font-semibold text-lg mb-2">
              3. Route-based code splitting
            </h3>
            <p className="text-text-secondary">
              Load features based on routes. Analytics dashboard components
              don't need to be in the chat page bundle.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h3 className="font-semibold text-lg mb-2">
              4. Monitor bundle size in CI
            </h3>
            <p className="text-text-secondary">
              Use tools like{' '}
              <a
                href="https://github.com/ai/size-limit"
                className="text-brand-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                size-limit
              </a>{' '}
              to prevent bundle size regression in your CI pipeline.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Next Steps</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/learn/guides/performance"
            className="p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20 hover:border-brand-500/40 transition-all group"
          >
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-500 transition-colors">
              Performance Guide
            </h3>
            <p className="text-sm text-text-secondary">
              Learn more optimization techniques for production
            </p>
          </Link>

          <Link
            href="/reference/hooks"
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
          >
            <h3 className="font-semibold text-text-primary mb-2 group-hover:text-blue-500 transition-colors">
              Hooks Reference
            </h3>
            <p className="text-sm text-text-secondary">
              See all available hooks and their usage
            </p>
          </Link>
        </div>
      </section>
    </ToastProvider>
  )
}
