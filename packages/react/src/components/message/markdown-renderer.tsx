'use client'

import * as React from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import { MarkdownCodeBlock } from './markdown-code-block'

// ============================================================================
// Types
// ============================================================================

export interface MessageMarkdownRendererProps {
  /** The markdown content to render */
  content: string
  /** Whether the content is currently streaming */
  isStreaming?: boolean
  /** Additional className for the wrapper */
  className?: string
}

// ============================================================================
// Utility: Extract text from React nodes
// ============================================================================

/**
 * Recursively extracts text content from React nodes.
 * Used to get code string for copy functionality.
 */
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('')
  if (React.isValidElement(node)) {
    const nodeProps = node.props as { children?: React.ReactNode }
    if (nodeProps?.children) {
      return extractTextFromNode(nodeProps.children)
    }
  }
  return ''
}

// ============================================================================
// Hook: useMarkdownPlugins
// ============================================================================

/**
 * Returns memoized remark and rehype plugin arrays for react-markdown.
 *
 * @returns Object containing remarkPlugins and rehypePlugins arrays
 *
 * @example
 * ```tsx
 * const { remarkPlugins, rehypePlugins } = useMarkdownPlugins()
 * <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
 *   {content}
 * </ReactMarkdown>
 * ```
 */
export function useMarkdownPlugins() {
  // Memoize plugin arrays to avoid recreation on every render
  const remarkPlugins = React.useMemo(() => [remarkGfm], [])

  // rehypeHighlight has type incompatibilities due to vfile version mismatches across
  // the unified ecosystem. This is a known upstream issue. We use a readonly tuple
  // assertion to preserve the plugin reference while satisfying the type checker.
  // See: https://github.com/rehypejs/rehype-highlight/issues/26
  const rehypePlugins = React.useMemo(
    () => [rehypeHighlight] as readonly [typeof rehypeHighlight],
    []
  )

  return { remarkPlugins, rehypePlugins }
}

// ============================================================================
// Hook: useMarkdownComponents
// ============================================================================

/**
 * Returns memoized custom component overrides for react-markdown.
 * Includes styled code blocks, tables, paragraphs, and more.
 *
 * @returns Partial<Components> object for react-markdown's components prop
 *
 * @example
 * ```tsx
 * const components = useMarkdownComponents()
 * <ReactMarkdown components={components}>{content}</ReactMarkdown>
 * ```
 */
export function useMarkdownComponents(): Partial<Components> {
  return React.useMemo<Partial<Components>>(() => {
    // Create wrapper for memoized code component
    const CodeWrapper: Components['code'] = (props) => {
      return <MarkdownCodeBlock {...props} />
    }

    return {
      code: CodeWrapper,

      // Custom pre handler - wrap code blocks with styling and copy button
      pre: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLPreElement> & { node?: unknown }) => {
        // Extract code string from the code element for copy button
        let codeString = ''
        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child) && child.props) {
            const childProps = child.props as Record<string, unknown>
            codeString = (childProps['data-code-string'] as string) || ''
            if (!codeString && childProps.children) {
              codeString = extractTextFromNode(
                childProps.children as React.ReactNode
              )
            }
          }
        })

        return (
          <div className="relative group/code my-4">
            <pre
              className="relative overflow-x-auto bg-muted/50 border border-border rounded-lg p-4"
              {...props}
            >
              {children}
            </pre>
            {codeString && (
              <CopyButton
                text={codeString}
                iconOnly
                className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity"
              />
            )}
          </div>
        )
      },

      // Always use div for paragraphs to prevent hydration mismatches.
      // The <p> element cannot contain block elements, and detecting them
      // reliably across server/client is problematic.
      p: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className="mb-4 leading-relaxed" {...props}>
          {children}
        </div>
      ),

      // Table components with proper styling
      table: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4 w-full">
          <table
            className="min-w-full table-auto border-collapse divide-y divide-border"
            {...props}
          >
            {children}
          </table>
        </div>
      ),

      thead: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead className="bg-muted" {...props}>
          {children}
        </thead>
      ),

      tbody: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody className="bg-background divide-y divide-border" {...props}>
          {children}
        </tbody>
      ),

      th: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th
          className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
          {...props}
        >
          {children}
        </th>
      ),

      td: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="px-6 py-4 text-sm border border-border" {...props}>
          {children}
        </td>
      ),

      tr: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr className="hover:bg-muted/50 transition-colors" {...props}>
          {children}
        </tr>
      ),
    }
  }, [])
}

// ============================================================================
// Component: MessageMarkdownRenderer
// ============================================================================

/**
 * MessageMarkdownRenderer - Renders markdown content with syntax highlighting
 *
 * A dedicated component for rendering markdown in chat messages. Extracts the
 * complex markdown rendering logic from the Message component for better
 * maintainability and testability.
 *
 * Features:
 * - GitHub Flavored Markdown (tables, strikethrough, etc.)
 * - Syntax highlighting for code blocks
 * - Copy button on code blocks
 * - Responsive tables with horizontal scroll
 * - Streaming cursor support
 *
 * @param props - Component props
 * @param props.content - The markdown string to render
 * @param props.isStreaming - Whether content is still being streamed
 * @param props.className - Additional CSS classes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MessageMarkdownRenderer content={message.content} />
 *
 * // With streaming indicator
 * <MessageMarkdownRenderer
 *   content={partialContent}
 *   isStreaming={true}
 * />
 * ```
 */
export function MessageMarkdownRenderer({
  content,
  isStreaming = false,
  className,
}: MessageMarkdownRendererProps) {
  const { remarkPlugins, rehypePlugins } = useMarkdownPlugins()
  const components = useMarkdownComponents()

  return (
    <div className={cn(isStreaming && 'clarity-streaming-text', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
      {/* Streaming cursor - purely visual */}
      {isStreaming && (
        <span aria-hidden="true" className="clarity-streaming-cursor" />
      )}
    </div>
  )
}

MessageMarkdownRenderer.displayName = 'MessageMarkdownRenderer'
