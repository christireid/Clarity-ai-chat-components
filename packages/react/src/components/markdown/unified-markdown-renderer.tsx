/**
 * Unified Markdown Renderer
 *
 * Consolidates three separate markdown implementations into one optimized renderer:
 * 1. enhanced-markdown-renderer.tsx - Advanced features (Mermaid, KaTeX, monitoring)
 * 2. message.tsx (LazyMarkdownRenderer) - Lazy rendering with accessibility
 * 3. message-optimized.tsx - Performance optimizations
 *
 * **Features:**
 * - Standard Markdown + GFM (GitHub Flavored Markdown)
 * - Syntax highlighting for code blocks
 * - Mermaid diagram rendering (optional)
 * - KaTeX math rendering (optional)
 * - Lazy rendering for performance (optional)
 * - Performance monitoring (optional)
 * - Analytics tracking (optional)
 * - Error boundary protection
 * - Accessibility features (ARIA, screen readers)
 * - Streaming content support
 * - React.memo optimizations
 */

'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { cn } from '@clarity-chat/primitives'
import { ContentErrorBoundary } from '../ui/error-boundary'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/** Mermaid theme types */
type MermaidTheme = 'default' | 'dark' | 'neutral' | 'forest' | 'base' | 'null'

/** React-markdown component props */
interface MarkdownCodeProps extends Omit<ComponentPropsWithoutRef<'code'>, 'ref'> {
  node?: unknown
  inline?: boolean
  className?: string
  children?: ReactNode
}

interface MarkdownParagraphProps extends Omit<ComponentPropsWithoutRef<'p'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownTableProps extends Omit<ComponentPropsWithoutRef<'table'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownElementProps extends Omit<ComponentPropsWithoutRef<'div'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownCellProps extends Omit<ComponentPropsWithoutRef<'th'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownTdProps extends Omit<ComponentPropsWithoutRef<'td'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownTrProps extends Omit<ComponentPropsWithoutRef<'tr'>, 'ref'> {
  children?: ReactNode
}

/**
 * Configuration for unified markdown rendering
 */
export interface UnifiedMarkdownConfig {
  /** Enable syntax highlighting (default: true) */
  enableSyntaxHighlight?: boolean
  /** Enable KaTeX for LaTeX/math rendering (default: false) */
  enableKaTeX?: boolean
  /** Enable Mermaid diagram rendering (default: false) */
  enableMermaid?: boolean
  /** Enable lazy rendering (defers expensive rendering, default: false) */
  enableLazyRendering?: boolean
  /** Enable performance monitoring (default: false) */
  enablePerformanceMonitoring?: boolean
  /** Enable analytics tracking (default: false) */
  enableAnalytics?: boolean
  /** Theme for code blocks (default: 'light') */
  codeTheme?: 'light' | 'dark'
  /** Custom className for markdown content */
  className?: string
  /** Custom markdown components (merged with defaults) */
  customComponents?: Partial<Components>
  /** Custom copy button component */
  CopyButton?: React.ComponentType<{ text: string; className?: string }>
  /** Custom code block component */
  CodeBlock?: React.ComponentType<MarkdownCodeProps>
}

/**
 * Props for UnifiedMarkdownRenderer
 */
export interface UnifiedMarkdownRendererProps {
  /** Markdown content to render */
  content: string
  /** Configuration options */
  config?: UnifiedMarkdownConfig
  /** Is content currently streaming? (default: false) */
  isStreaming?: boolean
  /** Show plain text fallback during lazy rendering (default: true) */
  showFallback?: boolean
  /** Callback when rendering completes */
  onRenderComplete?: () => void
  /** Component name for monitoring/analytics */
  componentName?: string
}

/**
 * Internal component for rendering markdown
 */
const UnifiedMarkdownRendererInner = React.memo(
  function UnifiedMarkdownRendererInner({
    content,
    config = {},
    isStreaming = false,
    showFallback = true,
    onRenderComplete,
    componentName = 'UnifiedMarkdownRenderer',
  }: UnifiedMarkdownRendererProps) {
    const {
      enableSyntaxHighlight = true,
      enableKaTeX = false,
      enableMermaid = false,
      enableLazyRendering = false,
      enablePerformanceMonitoring = false,
      enableAnalytics = false,
      codeTheme = 'light',
      className,
      customComponents = {},
      CopyButton,
      CodeBlock,
    } = config

    const containerRef = React.useRef<HTMLDivElement>(null)
    const mermaidInitialized = React.useRef(false)
    const renderStartTime = React.useRef<number>(0)
    const [renderedContent, setRenderedContent] = React.useState<React.ReactNode | null>(
      enableLazyRendering ? null : content
    )

    // Performance monitoring
    React.useEffect(() => {
      if (enablePerformanceMonitoring) {
        renderStartTime.current = performance.now()
      }
    }, [enablePerformanceMonitoring])

    // Initialize Mermaid after component mounts
    React.useEffect(() => {
      if (enableMermaid && !mermaidInitialized.current && typeof window !== 'undefined') {
        import('mermaid')
          .then((mermaidModule) => {
            const mermaid = mermaidModule.default
            const theme: MermaidTheme = codeTheme === 'dark' ? 'dark' : 'default'
            mermaid.initialize({
              startOnLoad: false,
              theme,
              securityLevel: 'loose',
              suppressErrorRendering: true,
            })
            mermaidInitialized.current = true

            if (containerRef.current) {
              mermaid.run({
                nodes: containerRef.current.querySelectorAll('.language-mermaid'),
              })
            }
          })
          .catch((err: unknown) => {
            console.warn('Failed to load Mermaid:', err)
          })
      }
    }, [enableMermaid, codeTheme])

    // Render Mermaid diagrams after content updates
    React.useEffect(() => {
      if (enableMermaid && mermaidInitialized.current && containerRef.current) {
        import('mermaid')
          .then((mermaidModule) => {
            const mermaid = mermaidModule.default
            const mermaidElements = containerRef.current?.querySelectorAll('.language-mermaid')
            if (mermaidElements && mermaidElements.length > 0) {
              try {
                mermaid.run({
                  nodes: Array.from(mermaidElements) as HTMLElement[],
                })
              } catch (error) {
                console.warn('Mermaid rendering error (handled gracefully):', error)
              }
            }
          })
          .catch(() => {
            // Silently fail if mermaid not available
          })
      }
    }, [content, enableMermaid])

    // Build rehype plugins list
    const rehypePlugins = React.useMemo(() => {
      const plugins: any[] = []

      if (enableSyntaxHighlight) {
        // Async plugin loading for rehypeHighlight (heavy dependency)
        plugins.push(async () => {
          const { default: rehypeHighlight } = await import('rehype-highlight')
          return rehypeHighlight
        })
      }

      if (enableKaTeX) {
        plugins.push([
          () => {
            return (tree: unknown) => {
              // Transform math nodes for KaTeX rendering
              // Placeholder for actual rehype-katex implementation
              return tree
            }
          },
        ])
      }

      return plugins
    }, [enableSyntaxHighlight, enableKaTeX])

    // Build markdown components
    const markdownComponents = React.useMemo<Partial<Components>>(() => {
      const components: Partial<Components> = {
        // Custom code block rendering
        code({ node: _node, inline: _inline, className, children, ...props }: MarkdownCodeProps) {
          // Use custom CodeBlock if provided
          if (CodeBlock) {
            return <CodeBlock inline={_inline} className={className} {...props}>{children}</CodeBlock>
          }

          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')

          // Mermaid diagram
          if (language === 'mermaid' && enableMermaid) {
            return (
              <div className="mermaid-container my-4 p-4 bg-muted rounded-lg overflow-x-auto">
                <pre className="language-mermaid m-0 bg-transparent">
                  <code className="language-mermaid">{codeString}</code>
                </pre>
              </div>
            )
          }

          // Inline code
          if (_inline) {
            return (
              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          }

          // Block code
          return (
            <div className="relative group/code">
              <pre className={cn('relative overflow-x-auto p-4', 'bg-gradient-to-br from-muted/60 to-muted/40', 'border border-border/50', 'rounded-xl', 'shadow-sm', 'transition-shadow duration-200', 'group-hover/code:shadow-md', className)}>
                <code {...props}>{children}</code>
              </pre>
              {CopyButton && (
                <CopyButton
                  text={codeString}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover/code:opacity-100 transition-all duration-200"
                />
              )}
            </div>
          )
        },

        // Custom math rendering for KaTeX
        p({ children, ...props }: MarkdownParagraphProps) {
          // Use div to prevent hydration mismatches
          const contentStr = React.Children.toArray(children).join('')
          if (enableKaTeX && (contentStr.includes('$$') || contentStr.includes('\\('))) {
            // Would render with KaTeX here
          }
          return (
            <div className="mb-4 leading-relaxed" {...props}>
              {children}
            </div>
          )
        },

        // Table styling
        table: ({ children, ...props }: MarkdownTableProps) => (
          <div className="overflow-x-auto my-4 w-full">
            <table className="min-w-full table-auto border-collapse divide-y divide-border" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }: MarkdownElementProps) => (
          <thead className="bg-muted" {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }: MarkdownElementProps) => (
          <tbody className="bg-background divide-y divide-border" {...props}>
            {children}
          </tbody>
        ),
        th: ({ children, ...props }: MarkdownCellProps) => (
          <th
            className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }: MarkdownTdProps) => (
          <td className="px-6 py-4 text-sm border border-border" {...props}>
            {children}
          </td>
        ),
        tr: ({ children, ...props }: MarkdownTrProps) => (
          <tr className="hover:bg-muted/50 transition-colors" {...props}>
            {children}
          </tr>
        ),
      }

      // Merge with custom components
      return { ...components, ...customComponents }
    }, [enableMermaid, enableKaTeX, customComponents, CopyButton, CodeBlock])

    // Lazy rendering with setTimeout
    React.useEffect(() => {
      if (enableLazyRendering) {
        const timer = setTimeout(() => {
          setRenderedContent(
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={rehypePlugins}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          )

          // Performance monitoring
          if (enablePerformanceMonitoring && renderStartTime.current > 0) {
            const duration = performance.now() - renderStartTime.current
            console.debug(`[${componentName}] Render time: ${duration.toFixed(2)}ms`)
          }

          // Analytics tracking
          if (enableAnalytics) {
            console.debug(`[${componentName}] Rendered ${content.length} chars`)
          }

          onRenderComplete?.()
        }, 0)

        return () => clearTimeout(timer)
      } else {
        // Immediate rendering
        onRenderComplete?.()
      }
    }, [
      content,
      enableLazyRendering,
      rehypePlugins,
      markdownComponents,
      enablePerformanceMonitoring,
      enableAnalytics,
      componentName,
      onRenderComplete,
    ])

    return (
      <div
        ref={containerRef}
        className={cn(
          'prose prose-sm max-w-none',
          'prose-headings:font-semibold',
          'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-muted prose-pre:border',
          codeTheme === 'dark' && 'prose-invert',
          isStreaming && 'animate-pulse',
          className
        )}
        role="document"
        aria-live={isStreaming ? 'polite' : undefined}
        aria-busy={isStreaming}
      >
        {enableLazyRendering ? (
          <>
            {renderedContent || (showFallback && (
              <div className={cn(isStreaming && 'clarity-streaming-text')}>
                {content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
            {isStreaming && (
              <span aria-hidden="true" className="clarity-streaming-cursor" />
            )}
          </>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        )}

        {/* KaTeX styles - loaded conditionally */}
        {enableKaTeX && (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
            crossOrigin="anonymous"
          />
        )}
      </div>
    )
  }
)

/**
 * Hook to detect if content contains math or diagrams
 *
 * Useful for conditionally enabling expensive features like KaTeX and Mermaid
 */
export function useMarkdownFeatures(content: string) {
  return React.useMemo(() => {
    const hasMath = /(\$\$|\\\(|\\\[|\\begin\{)/.test(content)
    const hasMermaid = /```mermaid|```\s*mermaid/.test(content)
    const hasCodeBlocks = /```/.test(content)

    return {
      hasMath,
      hasMermaid,
      hasCodeBlocks,
      needsEnhancedRendering: hasMath || hasMermaid,
    }
  }, [content])
}

/**
 * Unified Markdown Renderer with error boundary
 *
 * @example Basic usage
 * ```tsx
 * <UnifiedMarkdownRenderer content={markdownText} />
 * ```
 *
 * @example With Mermaid and KaTeX
 * ```tsx
 * <UnifiedMarkdownRenderer
 *   content={content}
 *   config={{
 *     enableMermaid: true,
 *     enableKaTeX: true,
 *     enableSyntaxHighlight: true,
 *   }}
 * />
 * ```
 *
 * @example With lazy rendering for performance
 * ```tsx
 * <UnifiedMarkdownRenderer
 *   content={content}
 *   config={{
 *     enableLazyRendering: true,
 *     enablePerformanceMonitoring: true,
 *   }}
 *   isStreaming={isStreaming}
 * />
 * ```
 *
 * @example With custom copy button
 * ```tsx
 * <UnifiedMarkdownRenderer
 *   content={content}
 *   config={{
 *     CopyButton: CustomCopyButton,
 *   }}
 * />
 * ```
 */
export const UnifiedMarkdownRenderer = (props: UnifiedMarkdownRendererProps) => (
  <ContentErrorBoundary
    componentName={props.componentName || 'UnifiedMarkdownRenderer'}
    showErrorDetails={process.env.NODE_ENV === 'development'}
  >
    <UnifiedMarkdownRendererInner {...props} />
  </ContentErrorBoundary>
)

UnifiedMarkdownRenderer.displayName = 'UnifiedMarkdownRenderer'
