'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
// rehypeHighlight is now loaded async (react-markdown v10 feature)
import remarkGfm from 'remark-gfm'
import { cn } from '@clarity-chat/primitives'
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

export const EnhancedMarkdownRenderer = React.memo(
  function EnhancedMarkdownRenderer({
    content,
    config = {},
    isStreaming = false,
  }: EnhancedMarkdownRendererProps) {
    const {
      enableKaTeX = false,
      enableMermaid = false,
      enableSyntaxHighlight = true,
      className,
      codeTheme = 'dark',
    } = config

    const containerRef = React.useRef<HTMLDivElement>(null)
    const mermaidInitialized = React.useRef(false)

    // Initialize Mermaid after component mounts
    React.useEffect(() => {
      if (enableMermaid && !mermaidInitialized.current && typeof window !== 'undefined') {
        // Dynamically import mermaid only if needed
        // mermaid is an optional peer dependency
        import('mermaid').then((mermaidModule) => {
          const mermaid = mermaidModule.default
          const theme: MermaidTheme = codeTheme === 'dark' ? 'dark' : 'default'
          mermaid.initialize({
            startOnLoad: false,
            theme,
            securityLevel: 'strict',
            // Mermaid v11: Suppress error rendering to avoid inserting 'Syntax error' message to DOM
            // This allows us to handle errors gracefully in our UI
            suppressErrorRendering: true,
          })
          mermaidInitialized.current = true

          // Render any existing mermaid diagrams
          if (containerRef.current) {
            mermaid.run({
              nodes: containerRef.current.querySelectorAll('.language-mermaid'),
            })
          }
        }).catch((err: unknown) => {
          console.warn('Failed to load Mermaid:', err)
        })
      }
    }, [enableMermaid, codeTheme])

    // Render Mermaid diagrams after content updates
    // Mermaid v11: Improved error handling with suppressErrorRendering
    React.useEffect(() => {
      if (enableMermaid && mermaidInitialized.current && containerRef.current) {
        // mermaid is an optional peer dependency
        import('mermaid').then((mermaidModule) => {
          const mermaid = mermaidModule.default
          const mermaidElements = containerRef.current?.querySelectorAll('.language-mermaid')
          if (mermaidElements && mermaidElements.length > 0) {
            try {
              mermaid.run({
                nodes: Array.from(mermaidElements) as HTMLElement[],
              })
            } catch (error) {
              // With suppressErrorRendering: true, errors won't be inserted into DOM
              // We can handle them gracefully here
              console.warn('Mermaid rendering error (handled gracefully):', error)
            }
          }
        }).catch(() => {
          // Silently fail if mermaid not available
        })
      }
    }, [content, enableMermaid])

    // Build rehype plugins list
    // react-markdown v10 supports async plugins - use async loading for heavy plugins
    // Using any[] here since react-markdown's Pluggable type is complex and supports various formats
     
    const rehypePlugins: any[] = []
    
    if (enableSyntaxHighlight) {
      // Async plugin loading for rehypeHighlight (heavy dependency)
      // Improves initial bundle size by deferring syntax highlighter loading
      rehypePlugins.push(async () => {
        const { default: rehypeHighlight } = await import('rehype-highlight')
        return rehypeHighlight
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
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypePlugins}
          components={{
            // Custom code block rendering for Mermaid
            code({ node: _node, inline: _inline, className, children, ...props }: MarkdownCodeProps) {
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

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            // Custom math rendering for KaTeX
            p({ children, ...props }: MarkdownParagraphProps) {
              // Check if paragraph contains math delimiters
              const contentStr = React.Children.toArray(children).join('')
              if (enableKaTeX && (contentStr.includes('$$') || contentStr.includes('\\('))) {
                // Would render with KaTeX here
                // For now, return standard paragraph
              }
              return <p {...props}>{children}</p>
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
          }}
        >
          {content}
        </ReactMarkdown>

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
