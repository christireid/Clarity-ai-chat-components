'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@clarity-chat/primitives'
import {
  Check,
  Copy,
  Download,
  ChevronDown,
  Play,
  ExternalLink,
  Maximize2,
  Minimize2,
  WrapText,
  FileCode,
  Terminal,
  Eye,
} from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  showCopy?: boolean
  showDownload?: boolean
  showRun?: boolean
  onRun?: () => void
  maxHeight?: number | string
  className?: string
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  py: 'Python',
  rust: 'Rust',
  go: 'Go',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  cs: 'C#',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  markdown: 'Markdown',
  md: 'Markdown',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  sql: 'SQL',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  text: 'Text',
  plaintext: 'Plain Text',
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  showCopy = true,
  showDownload = false,
  showRun = false,
  onRun,
  maxHeight,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [wordWrap, setWordWrap] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const safeCode = code || ''
  const lines = safeCode.split('\n')
  const displayLanguage =
    languageLabels[language?.toLowerCase() || 'text'] || language || 'text'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(safeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([safeCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-code-border bg-code-bg overflow-hidden group',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-code-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          {filename ? (
            <span className="text-sm font-mono text-foreground">
              {filename}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {displayLanguage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {showRun && onRun && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRun}
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setWordWrap(!wordWrap)}
          >
            <WrapText
              className={cn('h-3.5 w-3.5', wordWrap && 'text-ai-user')}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>

          {showDownload && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}

          {showCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-ai-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Code content */}
      <div
        className={cn(
          'overflow-auto scrollbar-thin',
          !isExpanded && maxHeight && `max-h-[${maxHeight}]`
        )}
        style={{ maxHeight: !isExpanded && maxHeight ? maxHeight : undefined }}
      >
        <div
          className={cn(
            'p-4 text-sm font-mono',
            wordWrap && 'whitespace-pre-wrap break-words'
          )}
        >
          {!mounted ? (
            // SSR / Initial Render: Simple pre/code block to prevent hydration mismatch
            <pre className="m-0 p-0 bg-transparent">
              <code className={`language-${language}`}>{safeCode}</code>
            </pre>
          ) : // Client Render: Complex interactive table or highlighted code
          showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      highlightLines.includes(idx + 1) && 'bg-ai-user/10'
                    )}
                  >
                    <td className="pr-4 text-right text-muted-foreground/50 select-none w-[1%] whitespace-nowrap align-top">
                      {idx + 1}
                    </td>
                    <td className="pl-4 border-l border-code-border align-top">
                      <SyntaxHighlight code={line || ' '} language={language} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="m-0 p-0 bg-transparent">
              <code className={`language-${language}`}>
                <SyntaxHighlight code={safeCode} language={language} />
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

// Basic syntax highlighting (simplified - in production use a proper library)
function SyntaxHighlight({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const highlighted = React.useMemo(() => {
    if (!code) return ''
    return highlightCode(code, language || 'text')
  }, [code, language])

  if (!code) return null
  // Use span for inline content, pre/code wrappers are handled by parent
  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
}

function highlightCode(code: string, language: string): string {
  if (!code) return ''
  const safeLang = language || 'text'
  // Keywords for different languages
  const keywords: Record<string, string[]> = {
    javascript: [
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'class',
      'import',
      'export',
      'from',
      'default',
      'async',
      'await',
      'try',
      'catch',
      'throw',
      'new',
      'this',
      'null',
      'undefined',
      'true',
      'false',
    ],
    typescript: [
      'const',
      'let',
      'var',
      'function',
      'return',
      'if',
      'else',
      'for',
      'while',
      'class',
      'import',
      'export',
      'from',
      'default',
      'async',
      'await',
      'try',
      'catch',
      'throw',
      'new',
      'this',
      'null',
      'undefined',
      'true',
      'false',
      'interface',
      'type',
      'enum',
      'implements',
      'extends',
      'public',
      'private',
      'protected',
    ],
    python: [
      'def',
      'class',
      'return',
      'if',
      'elif',
      'else',
      'for',
      'while',
      'import',
      'from',
      'as',
      'try',
      'except',
      'raise',
      'with',
      'True',
      'False',
      'None',
      'and',
      'or',
      'not',
      'in',
      'is',
      'lambda',
      'yield',
      'async',
      'await',
    ],
    rust: [
      'fn',
      'let',
      'mut',
      'const',
      'if',
      'else',
      'match',
      'for',
      'while',
      'loop',
      'return',
      'struct',
      'enum',
      'impl',
      'trait',
      'pub',
      'use',
      'mod',
      'self',
      'Self',
      'true',
      'false',
      'Some',
      'None',
      'Ok',
      'Err',
    ],
    go: [
      'func',
      'var',
      'const',
      'if',
      'else',
      'for',
      'range',
      'return',
      'struct',
      'interface',
      'type',
      'import',
      'package',
      'defer',
      'go',
      'chan',
      'select',
      'case',
      'default',
      'nil',
      'true',
      'false',
    ],
  }

  const langKeywords =
    keywords[safeLang.toLowerCase()] || keywords['javascript'] || []

  let result = escapeHtml(code)

  // Highlight strings
  result = result.replace(
    /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
    '<span class="text-ai-success">$&</span>'
  )

  // Highlight comments
  result = result.replace(
    /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
    '<span class="text-muted-foreground italic">$&</span>'
  )

  // Highlight numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-ai-warning">$1</span>'
  )

  // Highlight keywords
  const keywordRegex = new RegExp(`\\b(${langKeywords.join('|')})\\b`, 'g')
  result = result.replace(
    keywordRegex,
    '<span class="text-ai-user font-medium">$1</span>'
  )

  // Highlight function calls
  result = result.replace(
    /\b([a-zA-Z_]\w*)\s*\(/g,
    '<span class="text-chart-2">$1</span>('
  )

  return result
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Code block with tabs for multiple files
export function MultiFileCodeBlock({
  files,
  defaultFile,
  className,
}: {
  files: Array<{ filename: string; code: string; language: string }>
  defaultFile?: string
  className?: string
}) {
  const [activeFile, setActiveFile] = React.useState(
    defaultFile || files[0]?.filename
  )

  return (
    <div
      className={cn(
        'rounded-lg border border-code-border bg-code-bg overflow-hidden',
        className
      )}
    >
      <Tabs value={activeFile} onValueChange={setActiveFile}>
        <div className="border-b border-code-border bg-secondary/30">
          <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
            {files.map((file) => (
              <TabsTrigger
                key={file.filename}
                value={file.filename}
                className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-ai-user data-[state=active]:bg-transparent px-4"
              >
                <FileCode className="h-4 w-4 mr-2 text-muted-foreground" />
                {file.filename}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {files.map((file) => (
          <TabsContent
            key={file.filename}
            value={file.filename}
            className="mt-0"
          >
            <CodeBlock
              code={file.code}
              language={file.language}
              showLineNumbers
              className="border-0 rounded-none"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Code diff display
export function CodeDiff({
  oldCode,
  newCode,
  language = 'text',
  filename,
  className,
}: {
  oldCode: string
  newCode: string
  language?: string
  filename?: string
  className?: string
}) {
  const safeOldCode = oldCode || ''
  const safeNewCode = newCode || ''
  const oldLines = safeOldCode.split('\n')
  const newLines = safeNewCode.split('\n')

  // Simple line-by-line diff (in production use a proper diff library)
  const diff = computeSimpleDiff(oldLines, newLines)

  return (
    <div
      className={cn(
        'rounded-lg border border-code-border bg-code-bg overflow-hidden',
        className
      )}
    >
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-code-border bg-secondary/30">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
      )}
      <div className="overflow-auto">
        <div className="p-4 text-sm font-mono">
          <table className="w-full border-collapse">
            <tbody>
              {diff.map((line, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    line.type === 'add' && 'bg-ai-success/10',
                    line.type === 'remove' && 'bg-destructive/10'
                  )}
                >
                  <td className="pr-2 text-right text-muted-foreground/50 select-none w-[1%] whitespace-nowrap align-top">
                    {line.type !== 'add' ? line.oldLineNum : ''}
                  </td>
                  <td className="pr-4 text-right text-muted-foreground/50 select-none w-[1%] whitespace-nowrap border-r border-code-border align-top">
                    {line.type !== 'remove' ? line.newLineNum : ''}
                  </td>
                  <td className="px-2 w-4 text-center select-none align-top">
                    {line.type === 'add' && (
                      <span className="text-ai-success">+</span>
                    )}
                    {line.type === 'remove' && (
                      <span className="text-destructive">-</span>
                    )}
                  </td>
                  <td className="pl-2 align-top">
                    <SyntaxHighlight
                      code={line.content || ' '}
                      language={language}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

type DiffLine = {
  type: 'same' | 'add' | 'remove'
  content: string
  oldLineNum?: number
  newLineNum?: number
}

function computeSimpleDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const diff: DiffLine[] = []
  let oldIdx = 0
  let newIdx = 0

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (oldIdx >= oldLines.length) {
      diff.push({
        type: 'add',
        content: newLines[newIdx],
        newLineNum: newIdx + 1,
      })
      newIdx++
    } else if (newIdx >= newLines.length) {
      diff.push({
        type: 'remove',
        content: oldLines[oldIdx],
        oldLineNum: oldIdx + 1,
      })
      oldIdx++
    } else if (oldLines[oldIdx] === newLines[newIdx]) {
      diff.push({
        type: 'same',
        content: oldLines[oldIdx],
        oldLineNum: oldIdx + 1,
        newLineNum: newIdx + 1,
      })
      oldIdx++
      newIdx++
    } else {
      diff.push({
        type: 'remove',
        content: oldLines[oldIdx],
        oldLineNum: oldIdx + 1,
      })
      oldIdx++
    }
  }

  return diff
}

// Inline code snippet
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded-md bg-code-bg text-sm font-mono',
        className
      )}
    >
      {children}
    </code>
  )
}

// Code snippet with copy button
export function CodeSnippet({
  code,
  language,
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-code-bg border border-code-border group',
        className
      )}
    >
      <code className="text-sm font-mono">
        <SyntaxHighlight code={code || ''} language={language || 'text'} />
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-ai-success" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
