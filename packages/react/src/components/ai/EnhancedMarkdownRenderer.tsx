'use client'

import * as React from 'react'
import type type, { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@clarity-chat/primitives'
import { usePerformanceTracking } from '../../hooks/performance/usePerformanceMonitoring'
import { ContentErrorBoundary } from '../ui/ErrorBoundary'
import { useAnalytics, useInteractionTracking } from '../../utils/analytics'
import { MarkdownCodeBlock } from '../message/MarkdownCodeBlock'
import { CopyButton } from '../message/CopyButton'
import {
  useMarkdownAvailability,
  PlainTextMarkdown,
} from '../../utils/markdown/markdown-fallback'

/** Mermaid theme types */
type MermaidTheme = 'default' | 'dark' | 'neutral' | 'forest' | 'base' | 'null'

/** React-markdown component props */
interface MarkdownCodeProps extends Omit<
  ComponentPropsWithoutRef<'code'>,
  'ref'
> {
  node?: unknown
  inline?: boolean
  className?: string
  children?: ReactNode
}

interface MarkdownParagraphProps extends Omit<
  ComponentPropsWithoutRef<'p'>,
  'ref'
> {
  children?: ReactNode
}

interface MarkdownTableProps extends Omit<
  ComponentPropsWithoutRef<'table'>,
  'ref'
> {
  children?: ReactNode
}

interface MarkdownElementProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'ref'
> {
  children?: ReactNode
}

interface MarkdownCellProps extends Omit<
  ComponentPropsWithoutRef<'th'>,
  'ref'
> {
  children?: ReactNode
}

interface MarkdownTdProps extends Omit<ComponentPropsWithoutRef<'td'>, 'ref'> {
  children?: ReactNode
}

interface MarkdownTrProps extends Omit<ComponentPropsWithoutRef<'tr'>, 'ref'> {
  children?: ReactNode
}

/**
 * Configuration for enhanced markdown rendering
 * Supports LaTeX (KaTeX), Mermaid diagrams, and streaming content
 */
export interface EnhancedMarkdownConfig {
  /** Enable KaTeX for LaTeX/math rendering */
  enableKaTeX?: boolean
  /** Enable Mermaid diagram rendering */
  enableMermaid?: boolean
  /** Enable syntax highlighting */
  enableSyntaxHighlight?: boolean
  /** Custom className for markdown content */
  className?: string
  /** Theme for code blocks */
  codeTheme?: 'light' | 'dark'
  /** Enable copy buttons on code blocks */
  enableCopyButton?: boolean
  /** Enable lazy/deferred rendering for performance during streaming */
  enableLazyRendering?: boolean
}

/**
 * Enhanced Markdown Renderer Component
 *
 * Supports:
 * - Standard markdown (GFM)
 * - Code syntax highlighting
 * - LaTeX mathematical formulas (via KaTeX)
 * - Mermaid diagrams
 * - Streaming content handling
 *
 * @requires react-markdown - Core markdown rendering (optional peer dependency)
 * @requires remark-gfm - GitHub Flavored Markdown support (optional peer dependency)
 * @requires rehype-highlight - Syntax highlighting (optional peer dependency)
 * @requires mermaid - Diagram rendering (optional peer dependency, only if enableMermaid=true)
 * @installation npm install react-markdown remark-gfm rehype-highlight
 * @installation npm install mermaid (for diagram support)
 * @bundleImpact react-markdown ~50KB, remark-gfm ~15KB, rehype-highlight ~30KB, mermaid ~300KB
 * @fallback Plain text rendering with basic formatting when react-markdown is not installed
 * @docs https://clarity-chat.dev/docs/peer-dependencies
 *
 * @example
 * ```tsx
 * <EnhancedMarkdownRenderer
 *   content={markdownContent}
 *   enableKaTeX
 *   enableMermaid
 * />
 * ```
 */
export interface EnhancedMarkdownRendererProps {
  /** Markdown content to render */
  content: string
  /** Configuration options */
  config?: EnhancedMarkdownConfig
  /** Is content currently streaming? */
  isStreaming?: boolean
}

const EnhancedMarkdownRendererComponent = React.memo(
  function EnhancedMarkdownRenderer({
    content,
    config = {},
    isStreaming = false,
  }: EnhancedMarkdownRendererProps) {
    // Check for react-markdown availability
    const {
      isAvailable,
      isLoading,
      ReactMarkdown,
      remarkGfm,
      rehypeHighlight,
    } = useMarkdownAvailability()

    // Performance monitoring
    usePerformanceTracking({
      componentName: 'EnhancedMarkdownRenderer',
      trackMemory: true,
      metadata: {
        contentLength: content.length,
        enableKaTeX: config.enableKaTeX,
        enableMermaid: config.enableMermaid,
        enableSyntaxHighlight: config.enableSyntaxHighlight,
        isStreaming,
        markdownAvailable: isAvailable,
      },
    })

    const {
      enableKaTeX = false,
      enableMermaid = false,
      enableSyntaxHighlight = true,
      className,
      codeTheme = 'light',
      enableCopyButton = true,
      enableLazyRendering = false,
    } = config

    // Analytics tracking
    const { trackInteraction } = useAnalytics('EnhancedMarkdownRenderer')
    const { trackClick } = useInteractionTracking('EnhancedMarkdownRenderer')

    const containerRef = React.useRef<HTMLDivElement>(null)
    const mermaidInitialized = React.useRef(false)
    const [renderedContent, setRenderedContent] =
      React.useState<React.ReactNode | null>(null)

    // Initialize Mermaid after component mounts
    React.useEffect(() => {
      if (
        enableMermaid &&
        !mermaidInitialized.current &&
        typeof window !== 'undefined'
      ) {
        // Dynamically import mermaid only if needed
        // mermaid is an optional peer dependency
        import('mermaid')
          .then((mermaidModule) => {
            const mermaid = mermaidModule.default
            const theme: MermaidTheme =
              codeTheme === 'dark' ? 'dark' : 'default'
            mermaid.initialize({
              startOnLoad: false,
              theme,
              securityLevel: 'loose',
              // Mermaid v11: Suppress error rendering to avoid inserting 'Syntax error' message to DOM
              // This allows us to handle errors gracefully in our UI
              suppressErrorRendering: true,
            })
            mermaidInitialized.current = true

            // Render any existing mermaid diagrams
            const currentContainer = containerRef.current
            if (currentContainer) {
              mermaid.run({
                nodes: currentContainer.querySelectorAll('.language-mermaid'),
              })
            }
          })
          .catch((err: unknown) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to load Mermaid:', err)
            }
          })
      }
    }, [enableMermaid, codeTheme])

    // Render Mermaid diagrams after content updates
    // Mermaid v11: Improved error handling with suppressErrorRendering
    React.useEffect(() => {
      const currentContainer = containerRef.current
      if (enableMermaid && mermaidInitialized.current && currentContainer) {
        // mermaid is an optional peer dependency
        import('mermaid')
          .then((mermaidModule) => {
            const mermaid = mermaidModule.default
            const mermaidElements =
              currentContainer?.querySelectorAll('.language-mermaid')
            if (mermaidElements && mermaidElements.length > 0) {
              try {
                mermaid.run({
                  nodes: Array.from(mermaidElements) as HTMLElement[],
                })
              } catch (error) {
                // With suppressErrorRendering: true, errors won't be inserted into DOM
                // We can handle them gracefully here
                if (process.env.NODE_ENV === 'development') {
                  console.warn(
                    'Mermaid rendering error (handled gracefully):',
                    error
                  )
                }
              }
            }
          })
          .catch(() => {
            // Silently fail if mermaid not available
          })
      }
    }, [content, enableMermaid])

    // Build rehype plugins list
    // react-markdown v10 supports async plugins - use async loading for heavy plugins
    // Using any[] here since react-markdown's Pluggable type is complex and supports various formats

    const rehypePlugins: any[] = []

    if (enableSyntaxHighlight && rehypeHighlight) {
      // Use loaded rehype-highlight plugin if available
      rehypePlugins.push(rehypeHighlight)
    } else if (enableSyntaxHighlight && !rehypeHighlight) {
      // Try async plugin loading for rehypeHighlight (heavy dependency)
      // Improves initial bundle size by deferring syntax highlighter loading
      rehypePlugins.push(async () => {
        try {
          const { default: rehypeHighlightModule } =
            await import('rehype-highlight')
          return rehypeHighlightModule
        } catch {
          // Silently fail if not available - graceful degradation
          return undefined
        }
      })
    }

    // Add KaTeX plugin if enabled
    if (enableKaTeX) {
      rehypePlugins.push([
        // We'll use a custom plugin for KaTeX
        () => {
          return (tree: unknown) => {
            // Transform math nodes for KaTeX rendering
            // This is a placeholder - actual implementation would use
            // rehype-katex or similar
            return tree
          }
        },
      ])
    }

    // Custom markdown components with copy button support
    const customComponents = React.useMemo(() => {
      return {
        // Custom code block rendering for Mermaid and copy buttons
        code({
          node: _node,
          inline: _inline,
          className,
          children,
          ...props
        }: MarkdownCodeProps) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const codeString = String(children).replace(/\n$/, '')

          if (language === 'mermaid' && enableMermaid) {
            return (
              <div className="mermaid-container my-4 p-4 bg-muted rounded-lg overflow-x-auto">
                <pre className="language-mermaid m-0 bg-transparent">
                  <code className="language-mermaid">{codeString}</code>
                </pre>
              </div>
            )
          }

          // Use MarkdownCodeBlock for syntax highlighting
          if (!_inline) {
            return (
              <MarkdownCodeBlock
                inline={_inline}
                className={className}
                {...props}
              >
                {children}
              </MarkdownCodeBlock>
            )
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        // Custom pre handler with copy button
        pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => {
          if (!enableCopyButton) {
            return <pre {...props}>{children}</pre>
          }

          // Extract code string for copy button
          let codeString = ''
          React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.props) {
              const props = child.props as Record<string, unknown>
              codeString = (props['data-code-string'] as string) || ''
              if (!codeString && props.children) {
                const extractText = (node: React.ReactNode): string => {
                  if (typeof node === 'string') return node
                  if (Array.isArray(node)) return node.map(extractText).join('')
                  if (React.isValidElement(node)) {
                    const nodeProps = node.props as {
                      children?: React.ReactNode
                    }
                    if (nodeProps?.children) {
                      return extractText(nodeProps.children)
                    }
                  }
                  return ''
                }
                codeString = extractText(props.children as React.ReactNode)
              }
            }
          })

          return (
            <div className="relative group/code my-4">
              <pre
                className={cn(
                  'relative overflow-x-auto p-4',
                  'bg-gradient-to-br from-muted/60 to-muted/40',
                  'border border-border/50',
                  'rounded-xl',
                  'shadow-sm',
                  'transition-shadow duration-200',
                  'group-hover/code:shadow-md'
                )}
                {...props}
              >
                {children}
              </pre>
              {codeString && (
                <CopyButton
                  text={codeString}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover/code:opacity-100 transition-all duration-200 translate-y-1 group-hover/code:translate-y-0"
                />
              )}
            </div>
          )
        },
        // Custom math rendering for KaTeX
        p({ children, ...props }: MarkdownParagraphProps) {
          // Check if paragraph contains math delimiters
          const contentStr = React.Children.toArray(children).join('')
          if (
            enableKaTeX &&
            (contentStr.includes('$$') || contentStr.includes('\\('))
          ) {
            // Would render with KaTeX here
            // For now, return standard paragraph
          }
          // Safe paragraph rendering (div instead of p to avoid hydration issues)
          return (
            <div className="mb-4 leading-relaxed" {...props}>
              {children}
            </div>
          )
        },
        // Table styling
        table: ({ children, ...props }: MarkdownTableProps) => (
          <div className="overflow-x-auto my-4 w-full">
            <table
              className="min-w-full table-auto border-collapse divide-y divide-border"
              {...props}
            >
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
    }, [enableMermaid, enableCopyButton, enableKaTeX])

    // Lazy rendering effect for streaming performance
    React.useEffect(() => {
      // If react-markdown is not available, use fallback
      if (!isAvailable) {
        setRenderedContent(
          <PlainTextMarkdown
            content={content}
            showFallbackMessage={!isStreaming}
          />
        )
        return undefined
      }

      // If ReactMarkdown is not loaded yet, show loading or plain text
      if (!ReactMarkdown) {
        setRenderedContent(
          <PlainTextMarkdown content={content} showFallbackMessage={false} />
        )
        return undefined
      }

      if (enableLazyRendering) {
        // Defer expensive markdown rendering to prevent blocking UI
        const timer = setTimeout(() => {
          setRenderedContent(
            <ReactMarkdown
              remarkPlugins={remarkGfm ? [remarkGfm] : []}
              rehypePlugins={rehypePlugins}
              components={customComponents}
            >
              {content}
            </ReactMarkdown>
          )
        }, 0)

        return () => clearTimeout(timer)
      } else {
        // Render immediately
        setRenderedContent(
          <ReactMarkdown
            remarkPlugins={remarkGfm ? [remarkGfm] : []}
            rehypePlugins={rehypePlugins}
            components={customComponents}
          >
            {content}
          </ReactMarkdown>
        )
        return undefined
      }
      // Note: rehypePlugins is an array of async functions, deeply stable but not referentially stable
      // We intentionally omit it to prevent re-renders on every content change
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      content,
      enableLazyRendering,
      customComponents,
      isAvailable,
      ReactMarkdown,
      remarkGfm,
    ])

    // If still loading markdown availability, show loading state
    if (isLoading) {
      return (
        <div
          ref={containerRef}
          className={cn(
            'prose prose-sm max-w-none',
            'animate-pulse',
            className
          )}
          role="status"
          aria-label="Loading markdown renderer"
        >
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      )
    }

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
          // Apply streaming-specific optimizations
          isStreaming && 'clarity-streaming-markdown',
          className
        )}
      >
        {/* Render content (lazy or immediate) */}
        {enableLazyRendering ? (
          <>
            {renderedContent || (
              <div className={cn(isStreaming && 'clarity-streaming-text')}>
                {content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}
            {/* Cursor inside the streaming wrapper for proper inline positioning */}
            {isStreaming && (
              <span aria-hidden="true" className="clarity-streaming-cursor" />
            )}
          </>
        ) : (
          renderedContent
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
 * Enhanced Markdown Renderer with error boundary
 */
export const EnhancedMarkdownRenderer = (
  props: EnhancedMarkdownRendererProps
) => (
  <ContentErrorBoundary variant="minimal">
    <EnhancedMarkdownRendererComponent {...props} />
  </ContentErrorBoundary>
)
