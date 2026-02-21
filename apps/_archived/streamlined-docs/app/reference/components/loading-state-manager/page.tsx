'use client'

/**
 * LoadingStateManager Component - API Reference Documentation
 *
 * Intelligent loading state orchestration with skeleton screens, progress indicators,
 * and optimistic UI updates for building responsive and engaging user experiences.
 */

import * as React from 'react'
import {
  Loader2,
  Zap,
  Eye,
  Clock,
  RefreshCw,
  Sparkles,
  Activity,
  CheckCircle2,
  Database,
  Gauge,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import type { TocItem } from '@/components/Docs/TableOfContents'
import type {
  FeatureHighlight,
  RelatedAPI,
  FooterLink,
} from '@/components/Docs/DocumentationPage'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Feature Highlights
// ============================================================================

const features: FeatureHighlight[] = [
  {
    icon: Sparkles,
    label: 'Smart Skeletons',
    description: 'Content-aware loading placeholders',
  },
  {
    icon: Activity,
    label: 'Progress Tracking',
    description: 'Real-time loading indicators',
  },
  {
    icon: Zap,
    label: 'Optimistic UI',
    description: 'Instant feedback before server response',
  },
  {
    icon: RefreshCw,
    label: 'Stale-While-Revalidate',
    description: 'Show cached data during refresh',
  },
]

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'props', title: 'Props API' },
  { id: 'loading-strategies', title: 'Loading Strategies' },
  { id: 'examples', title: 'Code Examples' },
  { id: 'performance', title: 'Performance' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'related', title: 'Related APIs' },
]

// ============================================================================
// Related APIs
// ============================================================================

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'Skeleton',
    type: 'component',
    description: 'Basic skeleton loading placeholder',
    href: '/reference/components/skeleton',
  },
  {
    name: 'Progress',
    type: 'component',
    description: 'Linear and circular progress indicators',
    href: '/reference/components/progress',
  },
  {
    name: 'useOptimisticMessage',
    type: 'hook',
    description: 'Hook for optimistic UI updates',
    href: '/reference/hooks/use-optimistic-message',
  },
]

// ============================================================================
// Footer Navigation
// ============================================================================

const footerNavigation: FooterLink[] = [
  {
    label: 'Progress',
    href: '/reference/components/progress',
    direction: 'previous',
  },
  {
    label: 'Skeleton',
    href: '/reference/components/skeleton',
    direction: 'next',
  },
]

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({ props }: { props: PropDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
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
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Strategy Table Component
// ============================================================================

interface StrategyDefinition {
  name: string
  description: string
  useCase: string
  perceived: string
}

function StrategyTable({ strategies }: { strategies: StrategyDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Strategy
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Best For
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Perceived Speed
            </th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((strategy, index) => (
            <tr
              key={strategy.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-semibold text-foreground">
                {strategy.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {strategy.description}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {strategy.useCase}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
                    strategy.perceived === 'Fast'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : strategy.perceived === 'Medium'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  )}
                >
                  {strategy.perceived}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

type LoadingStrategy =
  | 'skeleton'
  | 'spinner'
  | 'progressive'
  | 'optimistic'
  | 'swr'
  | 'shimmer'

function LiveDemo() {
  const [strategy, setStrategy] = React.useState<LoadingStrategy>('skeleton')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showStale, setShowStale] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const startLoading = () => {
    setIsLoading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const renderLoadingState = () => {
    if (!isLoading && !showStale) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Database className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">Click "Load Data" to see the loading state</p>
        </div>
      )
    }

    switch (strategy) {
      case 'skeleton':
        return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-muted/50 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-3" />
            <p className="text-sm text-muted-foreground">
              Loading... {progress}%
            </p>
          </div>
        )

      case 'progressive':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loading data</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            {progress > 30 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-sm">Connection established</p>
              </motion.div>
            )}
            {progress > 60 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                <p className="text-sm">Data fetched</p>
              </motion.div>
            )}
          </div>
        )

      case 'optimistic':
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-sm font-medium">Sending...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your message appears instantly while being sent to the server
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-muted/30"
            >
              <p className="text-sm">Previous messages load normally</p>
            </motion.div>
          </div>
        )

      case 'swr':
        return (
          <div className="space-y-3">
            {showStale && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Stale Data</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Showing cached content while fetching fresh data
                </p>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center gap-2 p-2 rounded bg-brand-500/10">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
                <span className="text-sm">Revalidating...</span>
              </div>
            )}
          </div>
        )

      case 'shimmer':
        return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Loading Strategy
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { value: 'skeleton', label: 'Skeleton' },
              { value: 'spinner', label: 'Spinner' },
              { value: 'progressive', label: 'Progressive' },
              { value: 'optimistic', label: 'Optimistic' },
              { value: 'swr', label: 'SWR' },
              { value: 'shimmer', label: 'Shimmer' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStrategy(opt.value as LoadingStrategy)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  strategy === opt.value
                    ? 'bg-brand-500 text-white'
                    : 'bg-muted hover:bg-muted/70 text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startLoading}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              'bg-brand-500 text-white hover:bg-brand-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2'
            )}
          >
            <Play className="w-4 h-4" />
            Load Data
          </button>

          {strategy === 'swr' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showStale}
                onChange={(e) => setShowStale(e.target.checked)}
                className="rounded"
              />
              Show stale data
            </label>
          )}

          {isLoading && (
            <button
              onClick={() => {
                setIsLoading(false)
                setProgress(0)
              }}
              className="px-4 py-2 rounded-md text-sm font-medium bg-muted hover:bg-muted/70 flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          )}

          <button
            onClick={() => {
              setIsLoading(false)
              setProgress(0)
              setShowStale(false)
            }}
            className="ml-auto px-4 py-2 rounded-md text-sm font-medium bg-muted hover:bg-muted/70 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Demo Display */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h3 className="font-semibold text-foreground">
            {strategy.charAt(0).toUpperCase() + strategy.slice(1)} Loading State
          </h3>
          <p className="text-xs text-muted-foreground">
            Live demonstration of loading patterns
          </p>
        </div>

        <div className="p-6 min-h-[300px]">{renderLoadingState()}</div>
      </div>
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
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      {children}
    </section>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'strategy',
    type: "'skeleton' | 'spinner' | 'progressive' | 'optimistic' | 'swr' | 'shimmer'",
    default: "'skeleton'",
    description: 'Loading strategy to use',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    required: true,
    description: 'Whether content is currently loading',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    description: 'Content to show when not loading',
  },
  {
    name: 'fallback',
    type: 'React.ReactNode',
    description: 'Custom loading fallback component',
  },
  {
    name: 'timeout',
    type: 'number',
    default: '0',
    description: 'Minimum loading duration in ms (prevents flashing)',
  },
  {
    name: 'delay',
    type: 'number',
    default: '0',
    description: 'Delay before showing loading state in ms',
  },
  {
    name: 'onLoadingChange',
    type: '(isLoading: boolean) => void',
    description: 'Callback when loading state changes',
  },
  {
    name: 'showProgress',
    type: 'boolean',
    default: 'false',
    description: 'Show progress indicator for progressive strategy',
  },
  {
    name: 'progress',
    type: 'number',
    description: 'Current progress (0-100) for progressive strategy',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Accessible label for loading state',
  },
]

const skeletonProps: PropDefinition[] = [
  {
    name: 'skeletonCount',
    type: 'number',
    default: '3',
    description: 'Number of skeleton placeholders to show',
  },
  {
    name: 'skeletonHeight',
    type: 'number | string',
    default: "'auto'",
    description: 'Height of skeleton placeholders',
  },
  {
    name: 'skeletonVariant',
    type: "'text' | 'avatar' | 'card' | 'message'",
    default: "'text'",
    description: 'Skeleton component variant',
  },
  {
    name: 'skeletonAnimation',
    type: "'pulse' | 'wave' | 'shimmer'",
    default: "'pulse'",
    description: 'Skeleton animation type',
  },
]

const optimisticProps: PropDefinition[] = [
  {
    name: 'optimisticData',
    type: 'any',
    description: 'Data to show optimistically before server confirmation',
  },
  {
    name: 'onOptimisticUpdate',
    type: '(data: any) => void',
    description: 'Callback when optimistic update is applied',
  },
  {
    name: 'onOptimisticError',
    type: '(error: Error) => void',
    description: 'Callback when optimistic update fails',
  },
  {
    name: 'rollbackOnError',
    type: 'boolean',
    default: 'true',
    description: 'Automatically rollback on error',
  },
]

const swrProps: PropDefinition[] = [
  {
    name: 'staleData',
    type: 'any',
    description: 'Stale data to show while revalidating',
  },
  {
    name: 'showStaleIndicator',
    type: 'boolean',
    default: 'true',
    description: 'Show visual indicator for stale data',
  },
  {
    name: 'revalidateOnFocus',
    type: 'boolean',
    default: 'true',
    description: 'Revalidate when window regains focus',
  },
  {
    name: 'revalidateOnReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Revalidate when network reconnects',
  },
]

// ============================================================================
// Loading Strategies Data
// ============================================================================

const loadingStrategies: StrategyDefinition[] = [
  {
    name: 'Skeleton',
    description: 'Content-aware placeholder matching final layout',
    useCase: 'Lists, cards, complex layouts',
    perceived: 'Fast',
  },
  {
    name: 'Spinner',
    description: 'Animated loading indicator',
    useCase: 'Simple operations, overlays',
    perceived: 'Medium',
  },
  {
    name: 'Progressive',
    description: 'Multi-step loading with progress bar',
    useCase: 'Long operations, file uploads',
    perceived: 'Medium',
  },
  {
    name: 'Optimistic',
    description: 'Show result immediately, confirm later',
    useCase: 'User actions, form submissions',
    perceived: 'Fast',
  },
  {
    name: 'SWR',
    description: 'Show cached data while fetching fresh',
    useCase: 'Data that updates frequently',
    perceived: 'Fast',
  },
  {
    name: 'Shimmer',
    description: 'Animated gradient sweep effect',
    useCase: 'Modern UIs, mobile apps',
    perceived: 'Fast',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const basicUsageCode = `import { LoadingStateManager } from '@clarity-chat/react'

function MyComponent() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    const result = await fetch('/api/data')
    setData(await result.json())
    setIsLoading(false)
  }

  return (
    <LoadingStateManager
      strategy="skeleton"
      isLoading={isLoading}
      skeletonCount={5}
    >
      <DataList data={data} />
    </LoadingStateManager>
  )
}`

const optimisticCode = `import { LoadingStateManager } from '@clarity-chat/react'
import { useOptimisticMessage } from '@clarity-chat/react'

function ChatWithOptimistic() {
  const {
    messages,
    sendOptimistic,
    isSending,
  } = useOptimisticMessage({
    onSend: async (content) => {
      return await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
      }).then(r => r.json())
    },
  })

  const handleSend = async (content: string) => {
    // Message appears instantly in UI
    await sendOptimistic(content)
  }

  return (
    <div>
      <LoadingStateManager
        strategy="optimistic"
        isLoading={isSending}
        optimisticData={messages}
      >
        <MessageList messages={messages} />
      </LoadingStateManager>

      <ChatInput onSend={handleSend} />
    </div>
  )
}`

const swrIntegrationCode = `import { LoadingStateManager } from '@clarity-chat/react'
import useSWR from 'swr'

function DataWithSWR() {
  const { data, error, isValidating } = useSWR(
    '/api/data',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return (
    <LoadingStateManager
      strategy="swr"
      isLoading={isValidating && !data}
      staleData={data}
      showStaleIndicator
      revalidateOnFocus
      revalidateOnReconnect
    >
      {data && <DataDisplay data={data} />}
    </LoadingStateManager>
  )
}`

const progressiveCode = `import { LoadingStateManager } from '@clarity-chat/react'

function FileUpload() {
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const uploadFile = async (file: File) => {
    setUploading(true)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setProgress(i)
    }

    setUploading(false)
  }

  return (
    <LoadingStateManager
      strategy="progressive"
      isLoading={uploading}
      showProgress
      progress={progress}
      label="Uploading file..."
    >
      <FileList files={files} />
    </LoadingStateManager>
  )
}`

const customFallbackCode = `import { LoadingStateManager } from '@clarity-chat/react'
import { Skeleton } from '@clarity-chat/react'

function CustomLoading() {
  return (
    <LoadingStateManager
      isLoading={isLoading}
      fallback={
        <div className="space-y-4">
          <Skeleton variant="avatar" width={48} height={48} />
          <Skeleton variant="text" count={3} />
          <Skeleton variant="card" height={200} />
        </div>
      }
    >
      <Content />
    </LoadingStateManager>
  )
}`

const timeoutDelayCode = `import { LoadingStateManager } from '@clarity-chat/react'

function SmartLoading() {
  return (
    <LoadingStateManager
      isLoading={isLoading}
      // Don't show loading for quick operations (<300ms)
      delay={300}
      // Show loading for at least 500ms to prevent flashing
      timeout={500}
    >
      <Content />
    </LoadingStateManager>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function LoadingStateManagerPage() {
  return (
    <DocumentationPage
      title="LoadingStateManager"
      description="Intelligent loading state orchestration with skeleton screens, progress indicators, and optimistic UI updates for building responsive and engaging user experiences"
      icon={Loader2}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>LoadingStateManager</code> is a comprehensive component for
            managing loading states across your application. It provides
            multiple loading strategies optimized for different use cases, from
            skeleton screens for content loading to optimistic UI updates for
            instant feedback.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Loading UX Best Practices
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Perceived Performance:</strong> Users perceive interfaces
              as faster when they see immediate feedback, even if actual load
              time is the same
            </li>
            <li>
              <strong>Context-Aware:</strong> Different loading states work
              better for different operations (skeleton for layout, spinner for
              actions)
            </li>
            <li>
              <strong>Progressive Disclosure:</strong> Show what you can as
              soon as you can, rather than waiting for everything
            </li>
            <li>
              <strong>Prevent Flashing:</strong> Use minimum timeouts and
              delays to avoid distracting flashes for fast operations
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            When to Use Each Strategy
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Skeleton:</strong> Use for content that has a predictable
              layout (lists, cards, profiles)
            </li>
            <li>
              <strong>Spinner:</strong> Use for simple operations where layout
              is not known (initial page load, overlays)
            </li>
            <li>
              <strong>Progressive:</strong> Use for long operations where you
              can track progress (uploads, multi-step processes)
            </li>
            <li>
              <strong>Optimistic:</strong> Use for user actions where failure
              is rare (likes, votes, simple updates)
            </li>
            <li>
              <strong>SWR:</strong> Use for data that updates frequently and
              stale data is acceptable (dashboards, feeds)
            </li>
            <li>
              <strong>Shimmer:</strong> Use for modern, mobile-first interfaces
              (similar to Facebook, LinkedIn)
            </li>
          </ul>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">
            Import the component and required styles:
          </p>

          <CodeBlock
            code={`import { LoadingStateManager } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Try different loading strategies and see how they affect perceived
          performance. Toggle between strategies and start the loading
          simulation.
        </p>

        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Core Props
            </h3>
            <PropsTable props={coreProps} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Skeleton Strategy Props
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Additional props when <code>strategy="skeleton"</code>:
            </p>
            <PropsTable props={skeletonProps} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Optimistic Strategy Props
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Additional props when <code>strategy="optimistic"</code>:
            </p>
            <PropsTable props={optimisticProps} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              SWR Strategy Props
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Additional props when <code>strategy="swr"</code>:
            </p>
            <PropsTable props={swrProps} />
          </div>
        </div>
      </Section>

      {/* Loading Strategies Section */}
      <Section id="loading-strategies" title="Loading Strategies">
        <p className="text-muted-foreground mb-6">
          LoadingStateManager supports 6 loading strategies, each optimized for
          different use cases and perceived performance characteristics.
        </p>

        <StrategyTable strategies={loadingStrategies} />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Code Examples">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Basic Usage with Skeleton
            </h3>
            <p className="text-muted-foreground mb-4">
              Show skeleton placeholders while loading data:
            </p>
            <CodeBlock
              code={basicUsageCode}
              language="tsx"
              filename="BasicLoading.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Optimistic UI Updates
            </h3>
            <p className="text-muted-foreground mb-4">
              Show instant feedback before server confirmation:
            </p>
            <CodeBlock
              code={optimisticCode}
              language="tsx"
              filename="OptimisticChat.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              SWR Integration
            </h3>
            <p className="text-muted-foreground mb-4">
              Show cached data while revalidating:
            </p>
            <CodeBlock
              code={swrIntegrationCode}
              language="tsx"
              filename="SWRData.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Progressive Loading with Progress
            </h3>
            <p className="text-muted-foreground mb-4">
              Track and display loading progress for long operations:
            </p>
            <CodeBlock
              code={progressiveCode}
              language="tsx"
              filename="ProgressiveUpload.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Custom Loading Fallback
            </h3>
            <p className="text-muted-foreground mb-4">
              Create custom loading states with your own components:
            </p>
            <CodeBlock
              code={customFallbackCode}
              language="tsx"
              filename="CustomFallback.tsx"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Smart Timeouts and Delays
            </h3>
            <p className="text-muted-foreground mb-4">
              Prevent flashing for fast operations:
            </p>
            <CodeBlock
              code={timeoutDelayCode}
              language="tsx"
              filename="SmartLoading.tsx"
            />
          </div>
        </div>
      </Section>

      {/* Performance Section */}
      <Section id="performance" title="Performance">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mb-3">
            Perceived vs Actual Load Time
          </h4>
          <p>
            Research shows that perceived performance is often more important
            than actual performance. A 3-second load with good loading states
            can feel faster than a 2-second load with a blank screen.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <Gauge className="w-6 h-6 text-red-500 mb-2" />
              <h5 className="font-semibold mb-2">Without Loading States</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Blank screen during load</li>
                <li>• Users unsure if app is working</li>
                <li>• Higher perceived wait time</li>
                <li>• More likely to abandon</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <Gauge className="w-6 h-6 text-green-500 mb-2" />
              <h5 className="font-semibold mb-2">With Loading States</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Immediate visual feedback</li>
                <li>• Clear progress indication</li>
                <li>• Lower perceived wait time</li>
                <li>• Better user confidence</li>
              </ul>
            </div>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Performance Best Practices
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>Use appropriate timeouts:</strong> Set <code>delay</code>{' '}
              to 200-300ms to avoid showing loading for very fast operations
            </li>
            <li>
              <strong>Match skeleton to content:</strong> Skeleton layouts
              should closely match the final content to minimize layout shift
            </li>
            <li>
              <strong>Prefer optimistic updates:</strong> For user actions with
              high success rates, optimistic UI provides the best perceived
              performance
            </li>
            <li>
              <strong>Use SWR for frequently updated data:</strong> Show stale
              data immediately while fetching fresh data in the background
            </li>
            <li>
              <strong>Progressive loading:</strong> Load and show content
              incrementally rather than waiting for everything
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Measuring Impact
          </h4>
          <p>Track these metrics to measure loading state effectiveness:</p>
          <ul className="space-y-2">
            <li>
              <strong>Bounce rate:</strong> Users should be less likely to
              leave during loading
            </li>
            <li>
              <strong>Time to Interactive (TTI):</strong> When users can start
              interacting
            </li>
            <li>
              <strong>Perceived load time:</strong> Survey users on how fast
              the app feels
            </li>
            <li>
              <strong>Cumulative Layout Shift (CLS):</strong> Skeleton should
              minimize layout shift
            </li>
          </ul>
        </div>
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            LoadingStateManager includes comprehensive accessibility features to
            ensure loading states are properly communicated to all users.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Screen Reader Announcements
          </h4>
          <p>
            Loading state changes are automatically announced to screen readers
            using ARIA live regions:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Loading started:</strong> "Loading [label]" announced
              with <code>aria-live="polite"</code>
            </li>
            <li>
              <strong>Loading complete:</strong> "Content loaded" announced
              when ready
            </li>
            <li>
              <strong>Errors:</strong> Error messages announced with{' '}
              <code>aria-live="assertive"</code>
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">ARIA Attributes</h4>
          <ul className="space-y-2">
            <li>
              <code>role="status"</code> on loading indicators
            </li>
            <li>
              <code>aria-busy="true"</code> while loading
            </li>
            <li>
              <code>aria-label</code> for loading state context
            </li>
            <li>
              <code>aria-valuenow</code>, <code>aria-valuemin</code>,{' '}
              <code>aria-valuemax</code> for progress indicators
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Reduced Motion Support
          </h4>
          <p>
            All animations respect the <code>prefers-reduced-motion</code> user
            preference:
          </p>
          <ul className="space-y-2">
            <li>Skeleton animations are disabled</li>
            <li>Spinner rotation is disabled</li>
            <li>Progress bar transitions are instant</li>
            <li>Shimmer effects are replaced with static states</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Keyboard Navigation
          </h4>
          <p>
            When loading states include interactive elements (like cancel
            buttons):
          </p>
          <ul className="space-y-2">
            <li>All controls are keyboard accessible</li>
            <li>Focus is properly managed during state transitions</li>
            <li>Focus is not trapped in loading overlays</li>
          </ul>
        </div>
      </Section>
    </DocumentationPage>
  )
}
