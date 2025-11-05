'use client'

import { useState } from 'react'
import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react'
import { nightOwl } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import { Play, RefreshCw, Maximize2, Minimize2, Copy, Check, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

interface LiveDemoProps extends Partial<SandpackProps> {
  title?: string
  code: string
  dependencies?: Record<string, string>
  showConsole?: boolean
  height?: string
  showCopyButton?: boolean
  showExternalLinks?: boolean
}

export function LiveDemo({
  title,
  code,
  dependencies = {},
  showConsole = false,
  height = '500px',
  showCopyButton = true,
  showExternalLinks = true,
  ...props
}: LiveDemoProps) {
  const { theme } = useTheme()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [key, setKey] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openInCodeSandbox = () => {
    const params = new URLSearchParams({
      file: '/App.tsx',
      template: 'react-ts',
    })
    window.open(`https://codesandbox.io/s/new?${params.toString()}`, '_blank')
  }

  const defaultDependencies = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    '@clarity-chat/react': 'latest',
    ...dependencies,
  }

  const files = {
    '/App.tsx': code,
    '/index.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`,
  }

  const sandpackTheme = theme === 'dark' ? nightOwl : 'light'

  return (
    <div
      className={clsx(
        'my-6 border border-border rounded-xl overflow-hidden',
        isFullscreen && 'fixed inset-4 z-50 bg-bg-primary'
      )}
    >
      {/* Enhanced Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-500 rounded-lg">
              <Play className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {showCopyButton && (
              <button
                onClick={handleCopyCode}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm',
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                )}
                title="Copy code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            )}
            {showExternalLinks && (
              <button
                onClick={openInCodeSandbox}
                className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                title="Open in CodeSandbox"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setKey(key + 1)}
              className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
              aria-label="Reset demo"
              title="Reset demo"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sandpack Editor */}
      <div style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}>
        <Sandpack
          key={key}
          template="react-ts"
          theme={sandpackTheme}
          files={files}
          customSetup={{
            dependencies: defaultDependencies,
          }}
          options={{
            showNavigator: false,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: isFullscreen ? '100%' : height,
            editorWidthPercentage: 50,
            showConsole: showConsole,
            showConsoleButton: true,
            ...props.options,
          }}
          {...props}
        />
      </div>
    </div>
  )
}
