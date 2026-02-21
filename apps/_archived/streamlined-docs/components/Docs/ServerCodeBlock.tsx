import { CodeBlock, type CodeBlockProps } from './CodeBlock'
import { highlightCode } from '@/lib/syntax-highlighter'

/**
 * ServerCodeBlock - Server-side rendered code block with Shiki syntax highlighting
 *
 * This component should be used in Server Components for optimal performance.
 * It pre-renders syntax highlighting with Night Owl theme on the server.
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { ServerCodeBlock } from '@/components/Docs/ServerCodeBlock'
 *
 * export default function Page() {
 *   return (
 *     <ServerCodeBlock
 *       code={`const greeting = "Hello, World!"`}
 *       language="typescript"
 *       showLineNumbers
 *     />
 *   )
 * }
 * ```
 */
export async function ServerCodeBlock(props: Omit<CodeBlockProps, 'highlightedHtml'>) {
  const { code, language, highlightLines = [], showLineNumbers = false } = props

  // Pre-highlight code with Shiki on the server
  const highlightedHtml = await highlightCode({
    code,
    language,
    theme: 'night-owl',
    lineNumbers: showLineNumbers,
    highlightLines,
  })

  // Pass pre-highlighted HTML to client component
  return <CodeBlock {...props} highlightedHtml={highlightedHtml} />
}
