'use client'

import * as React from 'react'
import { useState, useCallback, useMemo, Suspense } from 'react'
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import {
  Code,
  Eye,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'
import { useClipboard } from '@clarity-chat/react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface ComponentPreviewProps {
  /** The name of the component (used for registry lookup) */
  name?: string
  /** Direct code to display and execute */
  code: string
  /** Title for the preview */
  title?: string
  /** Description of the component/example */
  description?: string
  /** Additional dependencies for the scope */
  dependencies?: Record<string, unknown>
  /** Whether to hide the code panel initially */
  hideCode?: boolean
  /** Alignment of preview content */
  align?: 'start' | 'center' | 'end'
  /** Custom class for the preview container */
  previewClassName?: string
  /** Custom class for the wrapper */
  className?: string
  /** Height of the preview area */
  previewHeight?: string
  /** Whether to show line numbers in code */
  showLineNumbers?: boolean
  /** Whether the code is editable */
  editable?: boolean
  /** Callback when code changes */
  onCodeChange?: (code: string) => void
  /** Language for syntax highlighting */
  language?: 'tsx' | 'jsx' | 'typescript' | 'javascript'
}

// ============================================================================
// Syntax Highlighting Theme (VS Code Dark+)
// ============================================================================

const theme = {
  plain: {
    color: '#d4d4d4',
    backgroundColor: '#1e1e1e',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6a9955', fontStyle: 'italic' as const },
    },
    { types: ['namespace'], style: { opacity: 0.7 } },
    { types: ['string', 'attr-value'], style: { color: '#ce9178' } },
    { types: ['punctuation', 'operator'], style: { color: '#d4d4d4' } },
    {
      types: [
        'entity',
        'url',
        'symbol',
        'number',
        'boolean',
        'variable',
        'constant',
        'property',
        'regex',
        'inserted',
      ],
      style: { color: '#b5cea8' },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: { color: '#569cd6' },
    },
    { types: ['function', 'deleted', 'tag'], style: { color: '#dcdcaa' } },
    { types: ['function-variable'], style: { color: '#dcdcaa' } },
    { types: ['tag', 'selector', 'keyword'], style: { color: '#569cd6' } },
    { types: ['class-name'], style: { color: '#4ec9b0' } },
    { types: ['attr-name'], style: { color: '#9cdcfe' } },
  ],
}

// ============================================================================
// Tab Components (inline shadcn/ui style)
// ============================================================================

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn('w-full', className)} data-state={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{
              value?: string
              onValueChange?: (v: string) => void
            }>,
            {
              value,
              onValueChange,
            }
          )
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

function TabsList({
  children,
  className,
  value,
  onValueChange,
}: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-9 items-center justify-start rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<{
              currentValue?: string
              onSelect?: (v: string) => void
            }>,
            {
              currentValue: value,
              onSelect: onValueChange,
            }
          )
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  currentValue?: string
  onSelect?: (value: string) => void
}

function TabsTrigger({
  value,
  children,
  className,
  currentValue,
  onSelect,
}: TabsTriggerProps) {
  const isActive = currentValue === value
  return (
    <button
      onClick={() => onSelect?.(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
        className
      )}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  currentValue?: string
}

function TabsContent({
  value,
  children,
  className,
  currentValue,
}: TabsContentProps) {
  // Get value from context or prop
  const isActive = currentValue === value
  if (!isActive) return null

  return (
    <div
      className={cn('mt-2', className)}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </div>
  )
}

// Wrapper to pass value to TabsContent
function TabsContentWrapper({
  value,
  children,
  className,
}: {
  value?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(
            child as React.ReactElement<{ currentValue?: string }>,
            {
              currentValue: value,
            }
          )
        }
        return child
      })}
    </>
  )
}

// ============================================================================
// Code Block with Syntax Highlighting
// ============================================================================

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  className?: string
}

function CodeBlock({
  code,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  // Simple syntax highlighting using regex patterns
  const highlightCode = (code: string) => {
    const lines = code.split('\n')
    return lines.map((line, i) => (
      <div key={i} className="table-row">
        {showLineNumbers && (
          <span className="table-cell pr-4 text-right text-gray-500 select-none w-[3ch]">
            {i + 1}
          </span>
        )}
        <span className="table-cell">
          <HighlightedLine line={line} />
        </span>
      </div>
    ))
  }

  return (
    <pre
      className={cn(
        'overflow-x-auto p-4 text-sm font-mono bg-[#1e1e1e] text-[#d4d4d4] rounded-b-lg',
        className
      )}
    >
      <code className="table w-full">{highlightCode(code)}</code>
    </pre>
  )
}

function HighlightedLine({ line }: { line: string }) {
  // Simple regex-based highlighting
  const patterns = [
    { regex: /(\/\/.*$)/gm, className: 'text-[#6a9955] italic' }, // comments
    { regex: /('.*?'|".*?")/g, className: 'text-[#ce9178]' }, // strings
    {
      regex:
        /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|instanceof)\b/g,
      className: 'text-[#569cd6]',
    }, // keywords
    { regex: /\b(true|false|null|undefined)\b/g, className: 'text-[#569cd6]' }, // literals
    { regex: /\b(\d+)\b/g, className: 'text-[#b5cea8]' }, // numbers
    { regex: /([A-Z][a-zA-Z0-9]*)/g, className: 'text-[#4ec9b0]' }, // PascalCase (components)
    { regex: /(\w+)(?=\s*\()/g, className: 'text-[#dcdcaa]' }, // function calls
  ]

  let result = line
  const segments: Array<{ text: string; className?: string; index: number }> =
    []

  // For simplicity, just return the line with basic highlighting
  // A full implementation would use a proper tokenizer
  return <span dangerouslySetInnerHTML={{ __html: escapeAndHighlight(line) }} />
}

function escapeAndHighlight(line: string): string {
  // Escape HTML
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Apply highlighting
  // Comments
  escaped = escaped.replace(
    /(\/\/.*)$/gm,
    '<span class="text-[#6a9955] italic">$1</span>'
  )
  // Strings
  escaped = escaped.replace(
    /(&quot;[^&]*&quot;|'[^']*'|`[^`]*`)/g,
    '<span class="text-[#ce9178]">$1</span>'
  )
  // Keywords
  escaped = escaped.replace(
    /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|instanceof|default|as|type|interface)\b/g,
    '<span class="text-[#569cd6]">$1</span>'
  )
  // Booleans/null
  escaped = escaped.replace(
    /\b(true|false|null|undefined)\b/g,
    '<span class="text-[#569cd6]">$1</span>'
  )
  // Numbers
  escaped = escaped.replace(
    /\b(\d+)\b/g,
    '<span class="text-[#b5cea8]">$1</span>'
  )
  // JSX tags
  escaped = escaped.replace(
    /(&lt;\/?)([\w]+)/g,
    '$1<span class="text-[#4ec9b0]">$2</span>'
  )

  return escaped
}

// ============================================================================
// Transform Code for react-live
// ============================================================================

function transformCode(code: string): string {
  let transformed = code

  // Remove import statements
  transformed = transformed.replace(
    /import\s+.*?from\s+['"].*?['"]\s*;?\n?/g,
    ''
  )

  // Remove 'use client' directive
  transformed = transformed.replace(/'use client'\s*;?\n?/g, '')

  // Remove export default
  transformed = transformed.replace(
    /export\s+default\s+function\s+(\w+)/g,
    'function $1'
  )
  transformed = transformed.replace(/export\s+default\s+/g, '')

  // Find component name (PascalCase function)
  const functionMatch = transformed.match(/function\s+([A-Z][a-zA-Z0-9]*)\s*\(/)
  const arrowMatch = transformed.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/)

  const componentName = functionMatch?.[1] || arrowMatch?.[1]

  // Add render call if needed
  if (componentName && !transformed.includes('render(')) {
    transformed += `\n\nrender(<${componentName} />)`
  }

  return transformed.trim()
}

// ============================================================================
// Main ComponentPreview Component
// ============================================================================

export function ComponentPreview({
  name,
  code,
  title,
  description,
  dependencies = {},
  hideCode = false,
  align = 'center',
  previewClassName,
  className,
  previewHeight = '350px',
  showLineNumbers = true,
  editable = false,
  onCodeChange,
  language = 'tsx',
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>('preview')
  const [currentCode, setCurrentCode] = useState(code)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCodeExpanded, setIsCodeExpanded] = useState(false)
  const { copy, copied } = useClipboard({ timeout: 2000 })

  // Load Clarity Chat components for scope
  const [clarityComponents, setClarityComponents] = useState<Record<
    string,
    unknown
  > | null>(null)

  React.useEffect(() => {
    let mounted = true
    import('@clarity-chat/react').then((mod) => {
      if (mounted) setClarityComponents(mod)
    })
    return () => {
      mounted = false
    }
  }, [])

  const scope = useMemo(
    () => ({
      ...(clarityComponents || {}),
      ...dependencies,
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useCallback: React.useCallback,
      useMemo: React.useMemo,
      useRef: React.useRef,
      render: (component: React.ReactElement) => component,
    }),
    [clarityComponents, dependencies]
  )

  const handleCopy = useCallback(() => {
    copy(currentCode)
  }, [copy, currentCode])

  const handleReset = useCallback(() => {
    setCurrentCode(code)
    onCodeChange?.(code)
  }, [code, onCodeChange])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCurrentCode(newCode)
      onCodeChange?.(newCode)
    },
    [onCodeChange]
  )

  // Fullscreen escape handler
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  const containerClassName = cn(
    'group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900',
    isFullscreen && 'fixed inset-4 z-50 shadow-2xl',
    className
  )

  return (
    <div className={containerClassName}>
      {/* Header with Tabs and Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2">
        <div className="flex items-center gap-4">
          {title && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </span>
          )}

          {!hideCode && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-1.5" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="w-4 h-4 mr-1.5" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Reset Button (only if code changed) */}
          {currentCode !== code && (
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Reset code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <LiveProvider
        code={transformCode(currentCode)}
        scope={scope}
        noInline={true}
      >
        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div
            className={cn(
              'flex w-full p-6',
              align === 'center' && 'items-center justify-center',
              align === 'start' && 'items-start justify-start',
              align === 'end' && 'items-end justify-end',
              previewClassName
            )}
            style={{ minHeight: previewHeight }}
          >
            <LiveError className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm font-mono whitespace-pre-wrap" />

            {clarityComponents ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center text-gray-500">
                    Loading preview...
                  </div>
                }
              >
                <LivePreview />
              </Suspense>
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                Loading components...
              </div>
            )}
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="relative">
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                !isCodeExpanded && 'max-h-[400px]'
              )}
            >
              <CodeBlock
                code={currentCode}
                language={language}
                showLineNumbers={showLineNumbers}
              />
            </div>

            {/* Expand/Collapse for long code */}
            {currentCode.split('\n').length > 15 && (
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 flex justify-center pb-2 pt-8',
                  !isCodeExpanded &&
                    'bg-gradient-to-t from-[#1e1e1e] to-transparent'
                )}
              >
                <button
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  className="px-3 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  {isCodeExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
            )}
          </div>
        )}
      </LiveProvider>

      {/* Optional: Show code preview below preview (like shadcn) */}
      {activeTab === 'preview' && !hideCode && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('code')}
            className="w-full px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
          >
            <Code className="w-4 h-4" />
            View Code
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Exports
// ============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent }
