'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Code2, Sparkles, Zap, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Simulated syntax highlighting for demo purposes
// In production, use Prism.js or Shiki
const highlightCode = (code: string, language: string): { text: string; className: string }[] => {
  const tokens: { text: string; className: string }[] = []

  if (language === 'typescript' || language === 'javascript') {
    const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'async', 'await', 'import', 'export', 'interface', 'type', 'class']
    const pattern = new RegExp(
      `\\b(${keywords.join('|')})\\b|` + // keywords
      `('([^'\\\\]|\\\\.)*'|"([^"\\\\]|\\\\.)*")|` + // strings
      `(//.*$)|` + // comments
      `(\\b\\d+\\b)|` + // numbers
      `([a-zA-Z_$][a-zA-Z0-9_$]*)`,
      'gm'
    )

    let lastIndex = 0
    let match

    while ((match = pattern.exec(code)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ text: code.slice(lastIndex, match.index), className: '' })
      }

      const text = match[0]
      let className = ''

      if (keywords.includes(text)) {
        className = 'text-purple-600 dark:text-purple-400'
      } else if (match[2]) {
        className = 'text-emerald-600 dark:text-emerald-400'
      } else if (match[5]) {
        className = 'text-gray-500 dark:text-gray-400 italic'
      } else if (match[6]) {
        className = 'text-amber-600 dark:text-amber-400'
      } else if (match[7]) {
        className = 'text-blue-600 dark:text-blue-400'
      }

      tokens.push({ text, className })
      lastIndex = pattern.lastIndex
    }

    if (lastIndex < code.length) {
      tokens.push({ text: code.slice(lastIndex), className: '' })
    }
  } else {
    tokens.push({ text: code, className: '' })
  }

  return tokens
}

// Demo StreamingCodeBlock component
function DemoStreamingCodeBlock({
  code,
  language,
  isStreaming,
  showLineNumbers,
  highlightLines,
  theme,
  showCopyButton,
  showLanguageLabel,
  animationSpeed,
}: {
  code: string
  language: string
  isStreaming: boolean
  showLineNumbers: boolean
  highlightLines: number[]
  theme: 'dark' | 'light'
  showCopyButton: boolean
  showLanguageLabel: boolean
  animationSpeed: number
}) {
  const [displayedCode, setDisplayedCode] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (isStreaming) {
      setDisplayedCode('')
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= code.length) {
          setDisplayedCode(code.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, animationSpeed)

      return () => clearInterval(interval)
    } else {
      setDisplayedCode(code)
    }
  }, [code, isStreaming, animationSpeed])

  const lines = displayedCode.split('\n')
  const tokens = highlightCode(displayedCode, language)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 border-gray-700 text-gray-100'
    : 'bg-gray-50 border-gray-200 text-gray-900'

  return (
    <div className={cn('rounded-lg border overflow-hidden', themeClasses)}>
      {/* Header */}
      {(showLanguageLabel || showCopyButton) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50">
          {showLanguageLabel && (
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{language}</span>
            </div>
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs rounded-md bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-1.5"
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        {isStreaming && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-blue-500 font-medium">Streaming</span>
          </div>
        )}

        <pre className="overflow-x-auto p-4 text-sm leading-6 font-mono scrollbar-hide">
          <code>
            {lines.map((line, lineIndex) => {
              const isHighlighted = highlightLines.includes(lineIndex + 1)
              return (
                <div
                  key={lineIndex}
                  className={cn(
                    'flex',
                    isHighlighted && 'bg-blue-500/10 -mx-4 px-4 border-l-2 border-blue-500'
                  )}
                >
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 select-none text-gray-500 dark:text-gray-600 tabular-nums">
                      {lineIndex + 1}
                    </span>
                  )}
                  <span className="flex-1">
                    {line.split('').map((char, charIndex) => {
                      // Find which token this character belongs to
                      let charPosition = lines.slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0) + charIndex
                      let currentPos = 0

                      for (const token of tokens) {
                        if (charPosition >= currentPos && charPosition < currentPos + token.text.length) {
                          return (
                            <span key={`${lineIndex}-${charIndex}`} className={token.className}>
                              {char}
                            </span>
                          )
                        }
                        currentPos += token.text.length
                      }

                      return <span key={`${lineIndex}-${charIndex}`}>{char}</span>
                    })}
                    {lineIndex < lines.length - 1 && '\n'}
                  </span>
                </div>
              )
            })}
            {isStreaming && displayedCode.length < code.length && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-blue-500 ml-0.5"
              />
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}

export const revalidate = 3600

export default function StreamingCodeBlockPage() {
  const [language, setLanguage] = React.useState('typescript')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [showLineNumbers, setShowLineNumbers] = React.useState(true)
  const [showCopyButton, setShowCopyButton] = React.useState(true)
  const [showLanguageLabel, setShowLanguageLabel] = React.useState(true)
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark')
  const [highlightLines, setHighlightLines] = React.useState<number[]>([3, 4])
  const [animationSpeed, setAnimationSpeed] = React.useState(20)

  const codeExamples = {
    typescript: `function greet(name: string): string {
  const message = \`Hello, \${name}!\`
  console.log(message)
  return message
}

const result = greet('World')
console.log(result)`,
    javascript: `function calculateSum(a, b) {
  const sum = a + b
  return sum
}

const result = calculateSum(5, 10)
console.log('Result:', result)`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(10)
print(f"Fibonacci: {result}")`,
  }

  const currentCode = codeExamples[language as keyof typeof codeExamples] || codeExamples.typescript

  const handleStartStreaming = () => {
    setIsStreaming(true)
    setTimeout(() => setIsStreaming(false), currentCode.length * animationSpeed + 500)
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">StreamingCodeBlock</h1>
              <p className="text-sm text-muted-foreground mt-1">Streaming Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Live syntax-highlighted code display with real-time streaming, line numbers, and interactive controls for AI-powered code generation.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
              <DemoStreamingCodeBlock
                code={currentCode}
                language={language}
                isStreaming={isStreaming}
                showLineNumbers={showLineNumbers}
                highlightLines={highlightLines}
                theme={theme}
                showCopyButton={showCopyButton}
                showLanguageLabel={showLanguageLabel}
                animationSpeed={animationSpeed}
              />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleStartStreaming}
                  disabled={isStreaming}
                  className={cn(
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2',
                    isStreaming
                      ? 'border-border/50 bg-muted/20 text-muted-foreground cursor-not-allowed'
                      : 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  {isStreaming ? 'Streaming...' : 'Start Streaming'}
                </button>

                <label className="text-sm font-medium text-foreground">
                  Speed: {animationSpeed}ms
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                  className="flex-1 max-w-xs"
                  disabled={isStreaming}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Language</label>
                <div className="flex flex-wrap gap-2">
                  {(['typescript', 'javascript', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => !isStreaming && setLanguage(lang)}
                      disabled={isStreaming}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        language === lang
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50',
                        isStreaming && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Theme</label>
                <div className="flex flex-wrap gap-2">
                  {(['dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        theme === t
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Highlight Lines (comma-separated)
                </label>
                <input
                  type="text"
                  value={highlightLines.join(', ')}
                  onChange={(e) => {
                    const lines = e.target.value
                      .split(',')
                      .map((s) => parseInt(s.trim()))
                      .filter((n) => !isNaN(n))
                    setHighlightLines(lines)
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground text-sm"
                  placeholder="e.g., 1, 3, 5"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Line Numbers</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCopyButton}
                    onChange={(e) => setShowCopyButton(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Copy Button</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLanguageLabel}
                    onChange={(e) => setShowLanguageLabel(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Language Label</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react prismjs</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Streaming Code</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { StreamingCodeBlock } from '@clarity-chat/react'

function MyComponent() {
  const [code, setCode] = useState('')

  return (
    <StreamingCodeBlock
      code={code}
      language="typescript"
      isStreaming={true}
      showLineNumbers={true}
      onComplete={() => console.log('Streaming complete')}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Syntax Highlighting</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { StreamingCodeBlock } from '@clarity-chat/react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

function CodeDemo() {
  return (
    <StreamingCodeBlock
      code={generatedCode}
      language="javascript"
      isStreaming={isGenerating}
      highlighter={Prism}
      theme="tomorrow"
      showLineNumbers={true}
      showCopyButton={true}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Line Highlighting</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingCodeBlock
  code={code}
  language="python"
  isStreaming={false}
  highlightLines={[1, 3, 5]}
  showLineNumbers={true}
  lineNumberStart={1}
  onLineComplete={(lineNumber) => {
    console.log(\`Line \${lineNumber} complete\`)
  }}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Custom Theme</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamingCodeBlock
  code={code}
  language="typescript"
  isStreaming={true}
  theme={{
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    keyword: '#569cd6',
    string: '#ce9178',
    comment: '#6a9955',
    number: '#b5cea8',
  }}
  showLineNumbers={true}
  animationSpeed={15}
  onComplete={() => setIsComplete(true)}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>code</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Code content to display</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>language</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">'typescript'</td>
                  <td className="py-3 px-4 text-muted-foreground">Programming language for syntax highlighting</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isStreaming</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether code is currently streaming</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showLineNumbers</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Display line numbers</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>highlightLines</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number[]</td>
                  <td className="py-3 px-4 text-muted-foreground">[]</td>
                  <td className="py-3 px-4 text-muted-foreground">Array of line numbers to highlight</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>theme</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string | ThemeObject</td>
                  <td className="py-3 px-4 text-muted-foreground">'dark'</td>
                  <td className="py-3 px-4 text-muted-foreground">Color theme (predefined or custom object)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showCopyButton</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show copy to clipboard button</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showLanguageLabel</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Display language label in header</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>animationSpeed</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">20</td>
                  <td className="py-3 px-4 text-muted-foreground">Character streaming delay in milliseconds</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>lineNumberStart</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">1</td>
                  <td className="py-3 px-4 text-muted-foreground">Starting line number</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>highlighter</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">Prism | Shiki</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Syntax highlighter instance</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onComplete</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">() =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when streaming completes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onLineComplete</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(line: number) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when each line completes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onCopy</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(code: string) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when code is copied</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>maxHeight</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string | number</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Maximum height with scroll</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>wrapLongLines</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Wrap long lines instead of scroll</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Real-Time Streaming</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Display code as it generates with smooth character-by-character streaming animation
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Syntax Highlighting</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full syntax highlighting support with Prism.js or Shiki for 100+ languages
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Line Highlighting</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Highlight specific lines to draw attention to important code sections
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Performance Optimized</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Virtualized rendering for large code files with smooth 60fps animations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="font-semibold">Theme Customization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Built-in themes or custom color schemes to match your design system
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with keyboard navigation and screen reader support
              </p>
            </motion.div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display</p>
            </Link>

            <Link
              href="/reference/components/streaming-progress"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingProgress</h3>
              <p className="text-sm text-muted-foreground">Progress indicator for streaming responses</p>
            </Link>

            <Link
              href="/reference/components/code-editor"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">CodeEditor</h3>
              <p className="text-sm text-muted-foreground">Full-featured code editor with Monaco</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
