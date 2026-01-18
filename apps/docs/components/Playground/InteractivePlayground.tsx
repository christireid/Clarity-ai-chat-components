'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  RefreshCw,
  Copy,
  Check,
  Code2,
  Eye,
  SplitSquareHorizontal,
  Maximize2,
  Minimize2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import DOMPurify from 'dompurify'

interface PlaygroundProps {
  initialCode: string
  language?: 'tsx' | 'jsx' | 'javascript'
  title?: string
  description?: string
  height?: string
  showPreview?: boolean
}

interface PreviewError {
  message: string
  line?: number
}

// Simple syntax highlighting for demonstration
function highlightCode(code: string): string {
  return (
    code
      // Keywords
      .replace(
        /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|instanceof)\b/g,
        '<span class="text-purple-400">$1</span>'
      )
      // React/JSX keywords
      .replace(
        /\b(useState|useEffect|useCallback|useMemo|useRef)\b/g,
        '<span class="text-yellow-400">$1</span>'
      )
      // Strings
      .replace(
        /(['"`])((?:\\.|[^\\])*?)\1/g,
        '<span class="text-green-400">$1$2$1</span>'
      )
      // JSX tags
      .replace(/(&lt;\/?)(\w+)/g, '$1<span class="text-blue-400">$2</span>')
      // Props/attributes
      .replace(/\s(\w+)=/g, ' <span class="text-cyan-400">$1</span>=')
      // Comments
      .replace(
        /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        '<span class="text-gray-500">$1</span>'
      )
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
      // Booleans
      .replace(
        /\b(true|false|null|undefined)\b/g,
        '<span class="text-orange-400">$1</span>'
      )
  )
}

// Escape HTML for safe display
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

type ViewMode = 'code' | 'preview' | 'split'

export function InteractivePlayground({
  initialCode,
  language = 'tsx',
  title,
  description,
  height = '400px',
  showPreview = true,
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [viewMode, setViewMode] = useState<ViewMode>(
    showPreview ? 'split' : 'code'
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<PreviewError | null>(null)
  const [previewKey, setPreviewKey] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  // Sync scroll between textarea and highlight layer
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value)
      setError(null)
    },
    []
  )

  const handleReset = useCallback(() => {
    setCode(initialCode)
    setError(null)
    setPreviewKey((k) => k + 1)
  }, [initialCode])

  const handleRun = useCallback(() => {
    setPreviewKey((k) => k + 1)
    // Simple validation
    try {
      // Check for basic syntax issues
      if (code.includes('import') && !code.includes('from')) {
        setError({ message: 'Import statement missing "from" clause' })
        return
      }
      setError(null)
    } catch {
      setError({ message: 'Syntax error in code' })
    }
  }, [code])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }, [code])

  // Handle tab key in textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd
        const newCode = code.substring(0, start) + '  ' + code.substring(end)
        setCode(newCode)
        // Set cursor position after state update
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = start + 2
          }
        }, 0)
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleRun()
      }
    },
    [code, handleRun]
  )

  // Get highlighted code
  const highlightedCode = highlightCode(escapeHtml(code))

  const containerClass = cn(
    'rounded-xl border border-border bg-bg-primary overflow-hidden transition-all',
    isFullscreen && 'fixed inset-4 z-50'
  )

  return (
    <>
      {/* Fullscreen backdrop */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>

      <div className={containerClass}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary/50">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-brand-500" />
            <div>
              {title && (
                <h3 className="font-semibold text-text-primary">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-text-tertiary">{description}</p>
              )}
              {!title && !description && (
                <span className="text-sm font-mono text-text-secondary">
                  {language}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            {showPreview && (
              <div className="flex items-center rounded-lg bg-bg-tertiary p-1">
                <button
                  onClick={() => setViewMode('code')}
                  className={cn(
                    'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors',
                    viewMode === 'code'
                      ? 'bg-bg-primary text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label="Code view"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={cn(
                    'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors',
                    viewMode === 'split'
                      ? 'bg-bg-primary text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label="Split view"
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={cn(
                    'p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors',
                    viewMode === 'preview'
                      ? 'bg-bg-primary text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                  aria-label="Preview view"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                onClick={handleRun}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Run</span>
              </motion.button>
              <button
                onClick={handleReset}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Reset code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={cn(
            'flex',
            viewMode === 'split' ? 'flex-col md:flex-row' : ''
          )}
          style={{ height: isFullscreen ? 'calc(100% - 56px)' : height }}
        >
          {/* Code Editor */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <div
              className={cn(
                'relative flex-1 overflow-hidden',
                viewMode === 'split' && 'md:border-r border-border'
              )}
            >
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-900 border-r border-gray-700 overflow-hidden pointer-events-none z-10">
                <div className="py-4 px-2">
                  {code.split('\n').map((_, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-500 text-right leading-6 font-mono"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlighted code layer */}
              <div
                ref={highlightRef}
                className="absolute inset-0 pl-12 py-4 pr-4 overflow-auto pointer-events-none bg-gray-950"
                aria-hidden="true"
              >
                <pre className="text-sm font-mono leading-6 whitespace-pre-wrap break-words">
                  <code
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlightedCode + '\n', {
                      ALLOWED_TAGS: ['span', 'div', 'br', 'strong', 'em', 'code'],
                      ALLOWED_ATTR: ['class', 'style']
                    }) }}
                  />
                </pre>
              </div>

              {/* Editable textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 pl-12 py-4 pr-4 w-full h-full resize-none bg-transparent text-transparent caret-white text-sm font-mono leading-6 outline-none whitespace-pre-wrap"
                spellCheck={false}
                aria-label="Code editor"
              />
            </div>
          )}

          {/* Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={cn(
                'flex-1 bg-white dark:bg-gray-900 overflow-auto',
                viewMode === 'split' && 'md:w-1/2'
              )}
            >
              {error ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error.message}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4" key={previewKey}>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="text-center text-text-secondary">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 mb-4">
                        <Eye className="w-8 h-8 text-brand-500" />
                      </div>
                      <h4 className="font-semibold text-text-primary mb-2">
                        Code Editor Mode
                      </h4>
                      <p className="text-sm text-text-tertiary max-w-sm mx-auto mb-4">
                        Edit and copy the code above. To see live previews, check out our{' '}
                        <a
                          href="/playground"
                          className="text-brand-500 hover:underline font-medium"
                        >
                          Interactive Playground
                        </a>{' '}
                        or{' '}
                        <a
                          href="https://storybook.clarity-chat.dev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:underline font-medium"
                        >
                          Storybook
                        </a>
                        .
                      </p>
                      <div className="flex items-center justify-center gap-3 text-xs text-text-tertiary">
                        <kbd className="px-2 py-1 bg-bg-tertiary rounded text-xs font-mono">
                          Cmd/Ctrl + Enter
                        </kbd>
                        <span>to validate syntax</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-bg-secondary/30 text-xs text-text-tertiary">
          <span>
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">Tab</kbd> for
            indent
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">Cmd</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">Enter</kbd> to
            run
          </span>
        </div>
      </div>
    </>
  )
}
