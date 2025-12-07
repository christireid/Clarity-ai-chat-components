/**
 * Enhanced Markdown Renderer with LaTeX/Math Support
 * 
 * Extends the existing markdown renderer to support LaTeX mathematical
 * expressions using KaTeX.
 * 
 * @blueprint Feature 1.6 - LaTeX/Math Rendering
 * @priority MEDIUM
 * @status NEW - Enhancement based on blueprint analysis
 */

'use client'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { cn } from '@clarity-chat/primitives'

// Import KaTeX CSS
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

// ============================================================================
// Types
// ============================================================================

export interface MarkdownRendererProps {
  /** Markdown content to render */
  content: string
  
  /** Enable LaTeX/math rendering */
  enableMath?: boolean
  
  /** Enable syntax highlighting for code blocks */
  enableHighlight?: boolean
  
  /** Enable GitHub Flavored Markdown (tables, strikethrough, etc.) */
  enableGFM?: boolean
  
  /** Enable HTML in markdown (use with caution) */
  allowHtml?: boolean
  
  /** Custom component overrides */
  components?: Record<string, React.ComponentType<any>>
  
  /** Custom CSS class */
  className?: string
  
  /** Show line numbers in code blocks */
  showLineNumbers?: boolean
  
  /** Enable copy button on code blocks */
  enableCodeCopy?: boolean
  
  /** Callback when LaTeX rendering fails */
  onMathError?: (error: Error, latex: string) => void
}

// ============================================================================
// Custom Components
// ============================================================================

/**
 * Enhanced code block with copy button and line numbers
 */
interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  showLineNumbers?: boolean
  enableCopy?: boolean
}

function CodeBlock({
  inline,
  className,
  children,
  showLineNumbers = false,
  enableCopy = true,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const code = String(children).replace(/\n$/, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  if (inline) {
    return (
      <code className={cn('px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono', className)} {...props}>
        {children}
      </code>
    )
  }

  const lines = code.split('\n')

  return (
    <div className="relative group my-4">
      {/* Language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
        {language && (
          <span className="text-xs font-semibold text-gray-300 uppercase">
            {language}
          </span>
        )}
        {enableCopy && (
          <button
            onClick={handleCopy}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            aria-label="Copy code"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Code content */}
      <pre className="!mt-0 !rounded-t-none overflow-x-auto">
        <code className={className} {...props}>
          {showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="pr-4 text-right text-gray-500 select-none border-r border-gray-700">
                      {i + 1}
                    </td>
                    <td className="pl-4">{line || '\n'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            children
          )}
        </code>
      </pre>
    </div>
  )
}

/**
 * Enhanced math block with error handling
 */
function MathBlock({
  value,
  onError,
}: {
  value: string
  onError?: (error: Error, latex: string) => void
}) {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    setHasError(false)
  }, [value])

  if (hasError) {
    return (
      <div className="my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
        <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
          LaTeX Rendering Error
        </div>
        <code className="text-xs text-red-600 dark:text-red-300 font-mono">
          {value}
        </code>
      </div>
    )
  }

  return (
    <div
      className="math-block my-4 overflow-x-auto"
      onError={(e: any) => {
        const error = new Error('LaTeX rendering failed')
        setHasError(true)
        onError?.(error, value)
      }}
    />
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function MarkdownRendererEnhanced({
  content,
  enableMath = true,
  enableHighlight = true,
  enableGFM = true,
  allowHtml = false,
  components: customComponents,
  className,
  showLineNumbers = false,
  enableCodeCopy = true,
  onMathError,
}: MarkdownRendererProps) {
  // Build remark plugins list
  const remarkPlugins = useMemo(() => {
    const plugins: any[] = []
    if (enableGFM) plugins.push(remarkGfm)
    if (enableMath) plugins.push(remarkMath)
    return plugins
  }, [enableGFM, enableMath])

  // Build rehype plugins list
  const rehypePlugins = useMemo(() => {
    const plugins: any[] = []
    if (allowHtml) plugins.push(rehypeRaw)
    if (enableHighlight) plugins.push(rehypeHighlight)
    if (enableMath) plugins.push(rehypeKatex)
    return plugins
  }, [allowHtml, enableHighlight, enableMath])

  // Custom component overrides - using proper Types from react-markdown v10
  const components = useMemo<Partial<Components>>(() => ({
    code: ({ className, children, inline, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      // Extract language from className (format: "language-js")
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : undefined
      
      // Inline code (no language)
      if (inline || !language) {
        return (
          <code className={cn('px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono', className)} {...props}>
            {children}
          </code>
        )
      }
      
      // Code block with language - extract from className
      const codeString = String(children).replace(/\n$/, '')
      return (
        <CodeBlock
          className={className}
          showLineNumbers={showLineNumbers}
          enableCopy={enableCodeCopy}
        >
          {codeString}
        </CodeBlock>
      )
    },
    // Table styling
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </td>
    ),
    // Link styling
    a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    // Blockquote styling
    blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),
    // Heading IDs for anchor links
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold mt-6 mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold mt-5 mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-xl font-bold mt-4 mb-2" {...props}>
        {children}
      </h3>
    ),
    // Merge custom components
    ...customComponents,
  }), [showLineNumbers, enableCodeCopy, customComponents])

  return (
    <div className={cn('markdown-content prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates LaTeX syntax before rendering
 */
export function validateLatex(latex: string): { valid: boolean; error?: string } {
  // Basic validation - check for common issues
  const issues = []

  // Check for unmatched braces
  const openBraces = (latex.match(/{/g) || []).length
  const closeBraces = (latex.match(/}/g) || []).length
  if (openBraces !== closeBraces) {
    issues.push('Unmatched braces')
  }

  // Check for unmatched dollar signs
  const dollarSigns = (latex.match(/\$/g) || []).length
  if (dollarSigns % 2 !== 0) {
    issues.push('Unmatched dollar signs')
  }

  return {
    valid: issues.length === 0,
    error: issues.length > 0 ? issues.join(', ') : undefined,
  }
}

/**
 * Extracts all math expressions from markdown content
 */
export function extractMathExpressions(content: string): {
  inline: string[]
  block: string[]
} {
  const inline: string[] = []
  const block: string[] = []

  // Extract inline math ($...$)
  const inlineRegex = /\$(?!\$)(.*?)\$/g
  let match
  while ((match = inlineRegex.exec(content)) !== null) {
    const mathContent = match[1]
    if (mathContent) inline.push(mathContent)
  }

  // Extract block math ($$...$$)
  const blockRegex = /\$\$(.*?)\$\$/gs
  while ((match = blockRegex.exec(content)) !== null) {
    const mathContent = match[1]
    if (mathContent) block.push(mathContent)
  }

  return { inline, block }
}

/**
 * Preview LaTeX rendering
 */
export function previewLatex(latex: string): string {
  // This would use KaTeX to render to string
  // For now, return placeholder
  return `[Math: ${latex.substring(0, 50)}...]`
}

// ============================================================================
// Example Usage
// ============================================================================

export const MATH_EXAMPLES = {
  inline: 'The equation $E = mc^2$ is famous.',
  block: `
The quadratic formula is:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`,
  complex: `
# Mathematical Examples

## Calculus

The derivative of $f(x) = x^2$ is:

$$
f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = 2x
$$

## Linear Algebra

Matrix multiplication:

$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\begin{bmatrix}
e & f \\\\
g & h
\\end{bmatrix}
=
\\begin{bmatrix}
ae + bg & af + bh \\\\
ce + dg & cf + dh
\\end{bmatrix}
$$

## Statistics

The normal distribution:

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}
$$
`,
}

export default MarkdownRendererEnhanced
