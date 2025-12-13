'use client'

import * as React from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'
import { MarkdownCodeBlock } from './markdown-code-block'
import { CodeWindowHeader } from '../code/CodeWindowHeader'

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
// Internal Components
// ============================================================================

interface PreBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  node?: unknown
}

function PreBlock({ children, ...props }: PreBlockProps) {
  const [wrapText, setWrapText] = React.useState(false)
  
  // Extract code string from the code element for copy/download
  const codeInfo = React.useMemo(() => {
    let text = ''
    let language = ''
    
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props) {
        const childProps = child.props as Record<string, unknown>
        
        // Extract language from className if possible
        const className = (childProps.className as string) || ''
        const match = /language-(\w+)/.exec(className)
        if (match) language = match[1]
        
        text = (childProps['data-code-string'] as string) || ''
        if (!text && childProps.children) {
          text = extractTextFromNode(childProps.children as React.ReactNode)
        }
      }
    })
    
    return { text: text.replace(/\n$/, ''), language }
  }, [children])

  return (
    <div className="relative group/code my-6 rounded-xl border border-border shadow-sm overflow-hidden bg-[#1e1e1e]">
      <CodeWindowHeader
        codeString={codeInfo.text}
        language={codeInfo.language}
        wrapText={wrapText}
        onToggleWrap={() => setWrapText(!wrapText)}
        showCopyButton={!!codeInfo.text}
        theme="dark"
      />

      <pre
        className={cn(
          "relative overflow-x-auto !m-0 !p-4 !bg-transparent font-fira-code",
          wrapText ? "whitespace-pre-wrap break-all" : "whitespace-pre"
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}

// ============================================================================
// Hook: useMarkdownPlugins
// ============================================================================

/**
 * Returns memoized remark and rehype plugin arrays for react-markdown.
 */
export function useMarkdownPlugins() {
  const remarkPlugins = React.useMemo(() => [remarkGfm], [])
  
  // Removed rehype-highlight to prevent duplicate highlighting
  // Prism (MarkdownCodeBlock) handles syntax highlighting client-side
  const rehypePlugins = React.useMemo(() => [], [])

  return { remarkPlugins, rehypePlugins }
}

// ============================================================================
// Hook: useMarkdownComponents
// ============================================================================

/**
 * Returns memoized custom component overrides for react-markdown.
 */
export function useMarkdownComponents(): Partial<Components> {
  return React.useMemo<Partial<Components>>(() => {
    // Create wrapper for memoized code component
    const CodeWrapper: Components['code'] = (props) => {
      return <MarkdownCodeBlock {...props} />
    }

    return {
      code: CodeWrapper,

      // Custom pre handler
      pre: (props) => <PreBlock {...props} />,

      // Paragraphs
      p: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className="mb-4 leading-relaxed" {...props}>
          {children}
        </div>
      ),

      // Table components
      table: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-6 rounded-lg border border-border shadow-sm">
          <table
            className="min-w-full table-auto border-collapse divide-y divide-border bg-card"
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
        <thead className="bg-muted/50" {...props}>
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
          className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          {...props}
        >
          {children}
        </th>
      ),

      td: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="px-6 py-4 text-sm border-t border-border/50 text-card-foreground" {...props}>
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
      
      // Blockquotes
      blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
          className="border-l-4 border-primary/30 pl-4 my-6 italic text-muted-foreground bg-muted/20 py-2 rounded-r-lg"
          {...props}
        >
          {children}
        </blockquote>
      ),
      
      // Links
      a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          href={href}
          className="font-medium text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-all"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      ),
    }
  }, [])
}

// ============================================================================
// Component: MessageMarkdownRenderer
// ============================================================================

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
