/**
 * Lazy Loading - Performance Optimization Utilities
 *
 * Utilities for lazy loading components and features to improve performance,
 * reduce bundle size, and enable code splitting.
 *
 * @module utils/lazy-loading
 */

import * as React from 'react'
import { devLog } from './dev-helpers'

// =============================================================================
// LAZY COMPONENT CREATION
// =============================================================================

/**
 * Create a lazy-loaded component with automatic code splitting
 *
 * @param importFn - Dynamic import function
 * @param fallback - Loading fallback component
 * @param errorBoundary - Error boundary for failed loads
 * @returns Lazy-loaded component
 *
 * @example
 * ```tsx
 * const LazyMarkdown = createLazyComponent(
 *   () => import('../components/markdown/MarkdownRenderer'),
 *   <div>Loading markdown...</div>
 * )
 * ```
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <div>Loading...</div>,
  errorBoundary?: React.ComponentType<{ children: React.ReactNode }>
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFn)

  const ComponentWithBoundary = (props: React.ComponentProps<T>) => {
    const [hasError, setHasError] = React.useState(false)

    if (hasError && errorBoundary) {
      const ErrorBoundary = errorBoundary
      return <ErrorBoundary>{fallback}</ErrorBoundary>
    }

    return (
      <React.Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }

  ComponentWithBoundary.displayName = `Lazy(${LazyComponent.displayName || 'Component'})`
  return ComponentWithBoundary
}

/**
 * Create a lazy-loaded component with built-in error boundary
 *
 * @param importFn - Dynamic import function
 * @param options - Configuration options
 * @returns Lazy-loaded component with error handling
 */
export function createLazyComponentWithBoundary<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: React.ReactNode
    errorFallback?: React.ReactNode
    onError?: (error: Error) => void
  } = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    fallback = <div>Loading...</div>,
    errorFallback = <div>Failed to load component</div>,
    onError
  } = options

  const LazyComponent = React.lazy(importFn)

  const ComponentWithBoundary = (props: React.ComponentProps<T>) => {
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        devLog.error('Lazy loading error:', event.error)
        setHasError(true)
        onError?.(event.error)
      }

      window.addEventListener('error', handleError)
      return () => window.removeEventListener('error', handleError)
    }, [onError])

    if (hasError) {
      return <>{errorFallback}</>
    }

    return (
      <React.Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }

  ComponentWithBoundary.displayName = `LazyWithBoundary(${LazyComponent.displayName || 'Component'})`
  return ComponentWithBoundary
}

// =============================================================================
// PRELOADING UTILITIES
// =============================================================================

/**
 * Preload a component module for faster future loads
 *
 * @param importFn - Dynamic import function
 * @returns Promise that resolves when preloaded
 *
 * @example
 * ```tsx
 * // Preload on hover
 * <button
 *   onMouseEnter={() => preloadComponent(() => import('./HeavyComponent'))}
 * >
 *   Load Heavy Component
 * </button>
 * ```
 */
export function preloadComponent<T>(
  importFn: () => Promise<T>
): Promise<T> {
  return importFn()
}

/**
 * Load a component when a condition is met
 *
 * @param condition - Function that returns true when component should load
 * @param importFn - Dynamic import function
 * @param options - Loading options
 * @returns Component that loads conditionally
 */
export function loadWhen<T extends React.ComponentType<any>>(
  condition: () => boolean,
  importFn: () => Promise<{ default: T }>,
  options: {
    placeholder?: React.ReactNode
    onLoad?: () => void
  } = {}
): React.ComponentType<React.ComponentProps<T>> {
  return (props: React.ComponentProps<T>) => {
    const [shouldLoad, setShouldLoad] = React.useState(condition())
    const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)

    React.useEffect(() => {
      if (shouldLoad && !Component) {
        importFn().then(module => {
          setComponent(() => module.default)
          options.onLoad?.()
        })
      }
    }, [shouldLoad, Component])

    if (!shouldLoad) {
      return <>{options.placeholder}</>
    }

    if (!Component) {
      return <div>Loading...</div>
    }

    return <Component {...props} />
  }
}

// =============================================================================
// FEATURE FLAGS & CONDITIONAL LOADING
// =============================================================================

/**
 * Feature flags for conditional component loading
 */
export const FeatureFlags = {
  /** Enable advanced markdown features */
  ADVANCED_MARKDOWN: 'advanced-markdown',

  /** Enable code syntax highlighting */
  CODE_HIGHLIGHTING: 'code-highlighting',

  /** Enable vector store integration */
  VECTOR_STORE: 'vector-store',

  /** Enable prompt marketplace */
  PROMPT_MARKETPLACE: 'prompt-marketplace',

  /** Enable analytics tracking */
  ANALYTICS: 'analytics',

  /** Enable accessibility features */
  ACCESSIBILITY: 'accessibility',

  /** Enable performance monitoring */
  PERFORMANCE_MONITORING: 'performance-monitoring',
} as const

/**
 * Load a component based on feature flag
 *
 * @param feature - Feature flag to check
 * @param importFn - Dynamic import function
 * @param fallback - Fallback component if feature is disabled
 * @returns Component that loads based on feature flag
 */
export function loadFeature<T extends React.ComponentType<any>>(
  feature: keyof typeof FeatureFlags,
  importFn: () => Promise<{ default: T }>,
  fallback: React.ComponentType<any> = () => <div>Feature not available</div>
): React.ComponentType<React.ComponentProps<T>> {
  // Check if feature is enabled (could be from environment, config, etc.)
  const isEnabled = checkFeatureEnabled(feature)

  if (!isEnabled) {
    return fallback
  }

  return createLazyComponent(importFn)
}

/**
 * Check if a feature is enabled
 * In production, this could check environment variables, user preferences, etc.
 */
function checkFeatureEnabled(feature: keyof typeof FeatureFlags): boolean {
  // Development mode: enable all features
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Production: check feature flags
  const enabledFeatures = (window as any)?.CLARITY_FEATURES || []

  return enabledFeatures.includes(FeatureFlags[feature])
}

// =============================================================================
// LAZY-LOADED COMPONENT LIBRARY
// =============================================================================

/**
 * Pre-configured lazy-loaded components for common use cases
 */
export const LazyComponents = {
  /** Lazy-loaded enhanced markdown renderer */
  MarkdownRenderer: createLazyComponent(
    () => import('../components/ai/enhanced-markdown-renderer'),
    <div>Loading markdown...</div>
  ),

  /** Lazy-loaded code block with syntax highlighting */
  CodeBlock: createLazyComponent(
    () => import('../components/code/CodeBlock'),
    <div>Loading code...</div>
  ),

  /** Lazy-loaded template marketplace */
  TemplateMarketplace: createLazyComponent(
    () => import('../components/prompt/template-marketplace'),
    <div>Loading marketplace...</div>
  ),

  /** Lazy-loaded analytics dashboard */
  AnalyticsDashboard: createLazyComponent(
    () => import('../components/dashboards/conversation-analytics-dashboard'),
    <div>Loading analytics...</div>
  ),

  /** Lazy-loaded performance monitor */
  PerformanceMonitor: createLazyComponent(
    () => import('../components/dashboards/performance-dashboard'),
    <div>Loading performance...</div>
  ),

  /** Lazy-loaded accessibility tester */
  AccessibilityTester: createLazyComponent(
    () => import('../components/dashboards/accessibility-dashboard'),
    <div>Loading accessibility tools...</div>
  ),

  /** Lazy-loaded vector store components */
  VectorStoreManager: createLazyComponent(
    () => import('../components/memory/vector-store-manager'),
    <div>Loading memory tools...</div>
  ),
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

/**
 * Performance monitor for lazy loading operations
 */
export class LazyLoadPerformanceMonitor {
  private loads: Map<string, { start: number; end?: number; size?: number }> = new Map()

  startLoad(id: string): void {
    this.loads.set(id, { start: performance.now() })
  }

  endLoad(id: string, size?: number): void {
    const load = this.loads.get(id)
    if (load) {
      load.end = performance.now()
      load.size = size
    }
  }

  getMetrics(id: string): { duration?: number; size?: number } | null {
    const load = this.loads.get(id)
    if (!load?.end) return null

    return {
      duration: load.end - load.start,
      size: load.size,
    }
  }

  getAllMetrics(): Record<string, { duration?: number; size?: number }> {
    const metrics: Record<string, { duration?: number; size?: number }> = {}

    for (const [id, load] of this.loads.entries()) {
      if (load.end) {
        metrics[id] = {
          duration: load.end - load.start,
          size: load.size,
        }
      }
    }

    return metrics
  }

  logSlowLoads(thresholdMs: number = 1000): void {
    for (const [id, metrics] of Object.entries(this.getAllMetrics())) {
      if (metrics.duration && metrics.duration > thresholdMs) {
        devLog.warn(`Slow lazy load: ${id} took ${metrics.duration.toFixed(2)}ms`)
      }
    }
  }
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook for lazy loading with loading states
 */
export function useLazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  options: {
    preload?: boolean
    onLoad?: () => void
    onError?: (error: Error) => void
  } = {}
): {
  Component: T | null
  loading: boolean
  error: Error | null
  load: () => void
} {
  const [Component, setComponent] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const load = React.useCallback(async () => {
    if (Component || loading) return

    setLoading(true)
    setError(null)

    try {
      const module = await importFn()
      setComponent(() => module.default)
      options.onLoad?.()
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [Component, loading, importFn, options])

  React.useEffect(() => {
    if (options.preload) {
      load()
    }
  }, [options.preload, load])

  return { Component, loading, error, load }
}

/**
 * Hook for conditional lazy loading
 */
export function useConditionalLoad<T extends React.ComponentType<any>>(
  condition: boolean,
  importFn: () => Promise<{ default: T }>
): React.ComponentType<React.ComponentProps<T>> | null {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)

  React.useEffect(() => {
    if (condition && !Component) {
      importFn().then(module => setComponent(() => module.default))
    }
  }, [condition, Component, importFn])

  return Component
}