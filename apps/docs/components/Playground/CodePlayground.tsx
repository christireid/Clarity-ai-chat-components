'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
// @ts-expect-error - react-live is an optional dependency for playground functionality
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import * as ClarityChat from '@clarity-chat/react'

// Dynamic import for code editor to avoid SSR issues
const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false })

interface CodePlaygroundProps {
  initialCode: string
  dependencies?: Record<string, string>
  onCodeChange?: (code: string) => void
}

export function CodePlayground({ 
  initialCode, 
  dependencies = {},
  onCodeChange 
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal')
  const [editorSize, setEditorSize] = useState(50)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  const scope = {
    ...ClarityChat,
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    useRef: React.useRef,
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Layout:
          </span>
          <button
            onClick={() => setLayout('horizontal')}
            className={`px-3 py-1 text-sm rounded ${
              layout === 'horizontal'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setLayout('vertical')}
            className={`px-3 py-1 text-sm rounded ${
              layout === 'vertical'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Stacked
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press Ctrl+Enter to run
          </span>
        </div>
      </div>

      {/* Editor and Preview */}
      <LiveProvider code={code} scope={scope} noInline={false}>
        <div 
          className={`flex ${
            layout === 'horizontal' ? 'flex-row' : 'flex-col'
          }`}
          style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}
        >
          {/* Code Editor */}
          <div 
            className="border-r border-gray-200 dark:border-gray-700"
            style={{ 
              width: layout === 'horizontal' ? `${editorSize}%` : '100%',
              height: layout === 'vertical' ? `${editorSize}%` : '100%'
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
              layout === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
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
                const newSize = Math.min(Math.max(startSize + deltaPercent, 20), 80)
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
              height: layout === 'vertical' ? `${100 - editorSize}%` : '100%'
            }}
          >
            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </h3>
              </div>
              
              <LiveError className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-800 dark:text-red-200 text-sm font-mono" />
              
              <div className="playground-preview">
                <LivePreview />
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
