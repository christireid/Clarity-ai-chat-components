'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@clarity-chat/primitives'
import { MarkdownCodeBlock } from './markdown-code-block'
import { CopyButton } from './copy-button'

// Memoized plugin arrays
const REMARK_PLUGINS = [remarkGfm]
// Type assertion for rehype-highlight due to upstream type issues
const REHYPE_PLUGINS = [rehypeHighlight] as unknown as any[]

export interface MarkdownRendererProps {
  content: string
  isStreaming?: boolean
  className?: string
}

/**
 * Custom hook to provide memoized markdown components
 */
function useMarkdownComponents(): Partial<Components> {
  return React.useMemo<Partial<Components>>(() => {
    // Wrapper for code block
    const CodeWrapper: Components['code'] = (props) => {
      return <MarkdownCodeBlock {...props} />
    }

    return {
      code: CodeWrapper,
      // Custom pre handler with copy button
      pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
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
                  const nodeProps = node.props as { children?: React.ReactNode }
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
      // Safe paragraph rendering (div instead of p)
      p: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className="mb-4 leading-relaxed" {...props}>
          {children}
        </div>
      ),
      // Tables
      table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4 w-full">
          <table
            className="min-w-full table-auto border-collapse divide-y divide-border"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead className="bg-muted" {...props}>
          {children}
        </thead>
      ),
      tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody className="bg-background divide-y divide-border" {...props}>
          {children}
        </tbody>
      ),
      th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th
          className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="px-6 py-4 text-sm border border-border" {...props}>
          {children}
        </td>
      ),
      tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr className="hover:bg-muted/50 transition-colors" {...props}>
          {children}
        </tr>
      ),
    }
  }, [])
}

/**
 * LazyMarkdownRenderer - Optimized markdown rendering
 * 
 * Defers rendering to avoid blocking the main thread during heavy updates
 */
export const LazyMarkdownRenderer = React.memo(function LazyMarkdownRenderer({
  content,
  isStreaming,
}: MarkdownRendererProps) {
  const [renderedContent, setRenderedContent] = React.useState<React.ReactNode | null>(null)
  const components = useMarkdownComponents()

  React.useEffect(() => {
    // Defer expensive markdown rendering to prevent blocking UI
    const timer = setTimeout(() => {
      setRenderedContent(
        <ReactMarkdown
          remarkPlugins={REMARK_PLUGINS}
          rehypePlugins={REHYPE_PLUGINS}
          components={components}
        >
          {content}
        </ReactMarkdown>
      )
    }, 0)

    return () => clearTimeout(timer)
  }, [content, components])

  // Show plain text as fallback while markdown is rendering
  return (
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
  )
})
