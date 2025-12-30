'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  RotateCw,
} from 'lucide-react'
import { useClipboard } from '@clarity-chat/react/internal'
import { openInCodeSandbox } from '@/lib/sandbox-export'

// Dynamic import for code editor to avoid SSR issues
const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false })

interface CodePlaygroundProps {
  initialCode?: string
  /** @deprecated Use initialCode instead */
  code?: string
  title?: string
  dependencies?: Record<string, string>
  onCodeChange?: (code: string) => void
  className?: string
  /** @deprecated height is set automatically */
  height?: string
}

export function CodePlayground({
  initialCode: initialCodeProp,
  code: codeProp,
  title = 'Clarity Chat Example',
  dependencies = {},
  onCodeChange,
  className,
}: CodePlaygroundProps) {
  // Support both 'code' and 'initialCode' props for backward compatibility
  const initialCode = initialCodeProp ?? codeProp ?? ''
  const [code, setCode] = useState(initialCode)
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal')
  const [editorSize, setEditorSize] = useState(50)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { copy, copied } = useClipboard({ timeout: 2000 })

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  // Handle fullscreen toggle with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      onCodeChange?.(newCode)
    },
    [onCodeChange]
  )

  const handleCopyCode = useCallback(() => {
    copy(code)
  }, [copy, code])

  const handleResetCode = useCallback(() => {
    setCode(initialCode)
    onCodeChange?.(initialCode)
  }, [initialCode, onCodeChange])

  const handleOpenInSandbox = () => {
    openInCodeSandbox({
      code,
      title,
      dependencies,
    })
  }

  // Load ClarityChat components dynamically on client only
  const [clarityComponents, setClarityComponents] = useState<Record<
    string,
    unknown
  > | null>(null)

  useEffect(() => {
    let mounted = true
    import('@clarity-chat/react').then((mod) => {
      if (mounted) {
        setClarityComponents(mod)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const scope = useMemo(
    () => ({
      ...(clarityComponents || {}),
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useCallback: React.useCallback,
      useMemo: React.useMemo,
      useRef: React.useRef,
      useContext: React.useContext,
      createContext: React.createContext,
      // Add render function for react-live
      render: (component: React.ReactElement) => component,
    }),
    [clarityComponents]
  )

  // Transform code to work with react-live (remove imports, handle exports)
  const transformCode = (code: string) => {
    // Remove all import statements
    let transformed = code.replace(
      /import\s+.*?from\s+['"].*?['"]\s*;?\n?/g,
      ''
    )

    // Remove 'use client' directive
    transformed = transformed.replace(/'use client'\s*;?\n?/g, '')

    // Replace export default function with just function and render it
    transformed = transformed.replace(
      /export\s+default\s+function\s+(\w+)\s*\(/g,
      'function $1('
    )

    // If there's a function definition, add a render call at the end
    if (
      transformed.includes('function App(') ||
      transformed.includes('function Home(')
    ) {
      const functionName = transformed.includes('function App(')
        ? 'App'
        : 'Home'
      transformed += `\n\nrender(<${functionName} />)`
    }

    return transformed.trim()
  }

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800'
    : `w-full max-w-[1400px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className || ''}`

  const heightStyle = isFullscreen
    ? { height: '100vh' }
    : { height: 'calc(100vh - 200px)', minHeight: '700px' }

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Layout:
          </span>
          <button
            onClick={() => setLayout('horizontal')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              layout === 'horizontal'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label="Side by side layout"
          >
            Side by Side
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              layout === 'vertical'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label="Stacked layout"
          >
            Stacked
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset code"
            disabled={code === initialCode}
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Open in CodeSandbox */}
          <button
            onClick={handleOpenInSandbox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            aria-label="Open in CodeSandbox"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">CodeSandbox</span>
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <LiveProvider code={transformCode(code)} scope={scope} noInline={true}>
        <div
          className={`flex ${
            layout === 'horizontal' ? 'flex-row' : 'flex-col'
          }`}
          style={heightStyle}
        >
          {/* Code Editor */}
          <div
            className="border-r border-gray-200 dark:border-gray-700"
            style={{
              width: layout === 'horizontal' ? `${editorSize}%` : '100%',
              height: layout === 'vertical' ? `${editorSize}%` : '100%',
            }}
          >
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language="typescript"
            />
          </div>

          {/* Resize Handle */}
          <div
            className={`${
              layout === 'horizontal'
                ? 'w-1 cursor-col-resize'
                : 'h-1 cursor-row-resize'
            } bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 transition-colors`}
            onMouseDown={(e) => {
              e.preventDefault()
              const startPos = layout === 'horizontal' ? e.clientX : e.clientY
              const startSize = editorSize

              const handleMouseMove = (e: MouseEvent) => {
                const container = e.currentTarget as HTMLElement
                const rect = container.getBoundingClientRect()
                const total = layout === 'horizontal' ? rect.width : rect.height
                const current = layout === 'horizontal' ? e.clientX : e.clientY
                const delta = current - startPos
                const deltaPercent = (delta / total) * 100
                const newSize = Math.min(
                  Math.max(startSize + deltaPercent, 20),
                  80
                )
                setEditorSize(newSize)
              }

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          />

          {/* Preview */}
          <div
            className="overflow-auto bg-white dark:bg-gray-900"
            style={{
              width: layout === 'horizontal' ? `${100 - editorSize}%` : '100%',
              height: layout === 'vertical' ? `${100 - editorSize}%` : '100%',
            }}
          >
            <div className="p-6 h-full">
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </h3>
              </div>

              <LiveError className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-800 dark:text-red-200 text-sm font-mono whitespace-pre-wrap" />

              <div className="playground-preview h-full">
                {clarityComponents ? (
                  <LivePreview />
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    Loading components...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LiveProvider>

      {/* Status Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Ready</span>
          <span>•</span>
          <span>{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span>TypeScript</span>
        </div>
      </div>
    </div>
  )
}
