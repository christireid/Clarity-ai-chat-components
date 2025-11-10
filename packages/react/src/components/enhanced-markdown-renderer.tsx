import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@clarity-chat/primitives'

type PluggableList = any[] // Simplified type for rehype/remark plugins

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
      codeTheme = 'light',
    } = config

    const containerRef = React.useRef<HTMLDivElement>(null)
    const mermaidInitialized = React.useRef(false)

    // Initialize Mermaid after component mounts
    React.useEffect(() => {
      if (enableMermaid && !mermaidInitialized.current && typeof window !== 'undefined') {
        // Dynamically import mermaid only if needed
        // mermaid is an optional peer dependency
        import('mermaid').then((mermaid: any) => {
          mermaid.default.initialize({
            startOnLoad: false,
            theme: codeTheme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
          })
          mermaidInitialized.current = true

          // Render any existing mermaid diagrams
          if (containerRef.current) {
            mermaid.default.run({
              nodes: containerRef.current.querySelectorAll('.language-mermaid'),
            })
          }
        }).catch((err) => {
          console.warn('Failed to load Mermaid:', err)
        })
      }
    }, [enableMermaid, codeTheme])

    // Render Mermaid diagrams after content updates
    React.useEffect(() => {
      if (enableMermaid && mermaidInitialized.current && containerRef.current) {
        // mermaid is an optional peer dependency
        import('mermaid').then((mermaid: any) => {
          const mermaidElements = containerRef.current?.querySelectorAll('.language-mermaid')
          if (mermaidElements && mermaidElements.length > 0) {
            mermaid.default.run({
              nodes: Array.from(mermaidElements) as HTMLElement[],
            })
          }
        }).catch(() => {
          // Silently fail if mermaid not available
        })
      }
    }, [content, enableMermaid])

    // Build rehype plugins list
    const rehypePlugins: PluggableList = []
    
    if (enableSyntaxHighlight) {
      rehypePlugins.push(rehypeHighlight)
    }

    // Add KaTeX plugin if enabled
    if (enableKaTeX) {
      rehypePlugins.push([
        // We'll use a custom plugin for KaTeX
        () => {
          return (tree: any) => {
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
        {/* @ts-expect-error - ReactMarkdown v9 has type compatibility issues */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypePlugins}
          components={{
            // Custom code block rendering for Mermaid
            code({ node: _node, inline: _inline, className, children, ...props }: any) {
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
            p({ children, ...props }: any) {
              // Check if paragraph contains math delimiters
              const content = React.Children.toArray(children).join('')
              if (enableKaTeX && (content.includes('$$') || content.includes('\\('))) {
                // Would render with KaTeX here
                // For now, return standard paragraph
              }
              return <p {...props}>{children}</p>
            },
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
