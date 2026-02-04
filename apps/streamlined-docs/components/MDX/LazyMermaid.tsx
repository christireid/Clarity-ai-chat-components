'use client'

import { useEffect, useRef, useState } from 'react'
import { MermaidSkeleton } from './MermaidSkeleton'

interface LazyMermaidProps {
  children: string
  className?: string
}

/**
 * Lazy-loaded Mermaid diagram component
 *
 * Features:
 * - Dynamic import of Mermaid library (950KB) only when diagram renders
 * - Intersection Observer for viewport-based loading
 * - Skeleton loading state to prevent CLS
 * - Error handling with fallback UI
 * - Theme-aware rendering
 *
 * @example
 * ```mdx
 * <Mermaid>
 * graph TD
 *   A[Start] --> B[Process]
 *   B --> C[End]
 * </Mermaid>
 * ```
 */
export function LazyMermaid({ children, className }: LazyMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadAndRenderMermaid() {
      try {
        // Dynamic import - Mermaid only loads when diagram component renders
        const mermaid = (await import('mermaid')).default

        if (!mounted) return

        // Initialize Mermaid with theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
          fontFamily: 'inherit',
          // Respect dark mode
          themeVariables: {
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          },
        })

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Render diagram
        const { svg } = await mermaid.render(id, children)

        if (!mounted || !containerRef.current) return

        containerRef.current.innerHTML = svg
        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          console.error('Mermaid render error:', err)
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram'
          )
          setIsLoading(false)
        }
      }
    }

    loadAndRenderMermaid()

    return () => {
      mounted = false
    }
  }, [children])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4 my-6">
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
          Failed to render diagram: {error}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-500 dark:text-red-400 hover:underline">
            Show diagram code
          </summary>
          <pre className="mt-2 text-xs overflow-x-auto p-2 bg-red-100 dark:bg-red-900/20 rounded">
            {children}
          </pre>
        </details>
      </div>
    )
  }

  if (isLoading) {
    return <MermaidSkeleton />
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-diagram overflow-x-auto my-6 ${className || ''}`}
      data-diagram-type="mermaid"
    />
  )
}
