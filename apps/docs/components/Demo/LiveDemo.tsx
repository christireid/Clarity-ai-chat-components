'use client'

import { useState } from 'react'
import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react'
import { nightOwl } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import { Play, RefreshCw, Maximize2, Minimize2, Copy, Check, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { useToast } from '@clarity-chat/react'

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
  const { success } = useToast()

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    success('Code copied to clipboard')
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
    'framer-motion': '^11.0.0',
    'lucide-react': '^0.344.0',
    'clsx': '^2.1.0',
    ...dependencies,
  }

  const files = {
    '/App.tsx': code.replace(/@clarity-chat\/react/g, './clarity-chat'),
    '/clarity-chat.tsx': `// Mock implementations for demo purposes
import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link' | 'outline' | 'outline-primary' | 'outline-secondary' | 'outline-danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  disabled?: boolean
  iconOnly?: boolean
  as?: 'button' | 'a'
  href?: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  iconOnly = false,
  as = 'button',
  onClick,
  className = '',
  ...props
}: ButtonProps) {
  const variantStyles = {
    default: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    link: 'bg-transparent hover:underline text-blue-500 p-0',
    outline: 'bg-transparent border-2 border-gray-300 hover:bg-gray-50 text-gray-900',
    'outline-primary': 'bg-transparent border-2 border-blue-500 hover:bg-blue-50 text-blue-600',
    'outline-secondary': 'bg-transparent border-2 border-gray-600 hover:bg-gray-50 text-gray-700',
    'outline-danger': 'bg-transparent border-2 border-red-500 hover:bg-red-50 text-red-600',
  }

  const sizeStyles = {
    xs: iconOnly ? 'p-1 text-xs' : 'px-2 py-1 text-xs',
    sm: iconOnly ? 'p-1.5 text-sm' : 'px-3 py-1.5 text-sm',
    md: iconOnly ? 'p-2' : 'px-4 py-2',
    lg: iconOnly ? 'p-3 text-lg' : 'px-6 py-3 text-lg',
  }

  const baseStyles = 'font-medium rounded-lg transition-colors inline-flex items-center justify-center'
  const widthStyle = fullWidth ? 'w-full' : ''
  const disabledStyle = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  const Component = as
  const allClasses = \`\${baseStyles} \${variantStyles[variant]} \${sizeStyles[size]} \${widthStyle} \${disabledStyle} \${className}\`

  return (
    <Component
      className={allClasses}
      onClick={disabled || isLoading ? undefined : onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="mr-2">⏳</span>}
      {children}
    </Component>
  )
}

// Add more component exports as needed
export const Badge = Button
export const Message = ({ children }: { children: React.ReactNode }) => <div className="p-3 bg-gray-100 rounded">{children}</div>`,
    '/index.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`,
    '/styles.css': `/* Basic styles for demo */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 1rem;
  background: white;
}

#root {
  width: 100%;
}

.dark {
  background: #1a1a1a;
  color: white;
}

.dark .bg-gray-100 {
  background: #2a2a2a !important;
}

.dark .bg-gray-200 {
  background: #3a3a3a !important;
}`,
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
