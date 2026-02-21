'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Share2, Download, Code2, Eye, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnhancedCopyButton } from './EnhancedCopyButton'
import { toast } from '@/lib/toast'

interface LivePlaygroundProps {
  /** Initial code */
  initialCode?: string
  /** Language/Framework */
  language?: 'typescript' | 'javascript' | 'tsx' | 'jsx'
  /** Show preview panel */
  showPreview?: boolean
  /** Title */
  title?: string
  /** Template files */
  files?: Record<string, string>
  className?: string
}

const defaultCode = `import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Count: {count}
      </h2>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCount(count - 1)}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Increase
        </button>
      </div>
    </div>
  )
}

export default Counter`

export function LivePlayground({
  initialCode = defaultCode,
  language = 'tsx',
  showPreview = true,
  title = 'Live Playground',
  files,
  className,
}: LivePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [isPreviewVisible, setIsPreviewVisible] = useState(showPreview)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  // Simulate code execution (in production, use Sandpack or iframe sandbox)
  const runCode = () => {
    setIsRunning(true)
    
    try {
      // Simple preview generation (in production, use actual transpilation)
      setPreviewHtml(`
        <div style="padding: 2rem; font-family: system-ui; background: white; color: #1a1a1a; min-height: 100%;">
          <div style="text-align: center;">
            <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Live Preview</h2>
            <p style="color: #666; margin-bottom: 1rem;">Your component will render here</p>
            <div style="padding: 2rem; background: #f3f4f6; border-radius: 0.5rem;">
              <p style="font-size: 0.875rem;">✨ Component rendered successfully!</p>
            </div>
          </div>
        </div>
      `)
      
      toast.success('Code executed!', {
        description: 'Preview updated successfully',
        duration: 2000,
      })
    } catch (error) {
      toast.error('Execution failed', {
        description: 'Check your code for errors',
        duration: 3000,
      })
    }
    
    setTimeout(() => setIsRunning(false), 500)
  }

  const resetCode = () => {
    setCode(initialCode)
    toast.success('Code reset!', {
      description: 'Restored to initial template',
      duration: 2000,
    })
  }

  const shareCode = () => {
    const encoded = btoa(code)
    const url = `${window.location.origin}/playground?code=${encoded}`
    navigator.clipboard.writeText(url)
    toast.success('Share link copied!', {
      description: 'Anyone with this link can see your code',
      duration: 3000,
    })
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `component.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Downloaded!', {
      description: `component.${language}`,
      duration: 2000,
    })
  }

  useEffect(() => {
    // Auto-run on mount
    runCode()
  }, [])

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-950',
        isFullscreen && 'fixed inset-4 z-50 shadow-2xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-brand-500" />
          {title}
        </h3>

        <div className="flex items-center gap-2">
          {/* Run Button */}
          <motion.button
            onClick={runCode}
            disabled={isRunning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run'}
          </motion.button>

          {/* Toggle Preview */}
          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            aria-label={isPreviewVisible ? 'Hide preview' : 'Show preview'}
          >
            {isPreviewVisible ? <Code2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 border-l border-neutral-200 dark:border-neutral-800 pl-2">
            <button
              onClick={resetCode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label="Reset code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <EnhancedCopyButton
              text={code}
              label="Copy code"
              size="sm"
              celebration="pulse"
              showToast={false}
            />
            
            <button
              onClick={downloadCode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label="Download code"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={shareCode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label="Share code"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-brand-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className={cn('grid', isPreviewVisible && 'md:grid-cols-2')}>
        {/* Code Editor */}
        <div className="relative">
          <div className="absolute top-2 right-2 text-xs font-mono text-neutral-400 bg-neutral-900/50 px-2 py-1 rounded z-10">
            {language}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[500px] p-4 bg-neutral-950 text-neutral-100 font-mono text-sm focus:outline-none resize-none"
            spellCheck={false}
            style={{
              tabSize: 2,
              lineHeight: '1.6',
            }}
          />
        </div>

        {/* Preview Panel */}
        <AnimatePresence mode="wait">
          {isPreviewVisible && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-500" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
              </div>
              <div className="h-[462px] overflow-auto">
                {previewHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-400">
                    <div className="text-center">
                      <Play className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Click Run to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-4">
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}

// Template starter codes
export const playgroundTemplates = {
  counter: defaultCode,
  
  button: `import React from 'react'

function Button({ children, variant = 'primary' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500',
    secondary: 'bg-gray-200 text-gray-900',
    ghost: 'bg-transparent border-2 border-blue-500',
  }

  return (
    <button
      className={\`px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg \${variants[variant]}\`}
    >
      {children}
    </button>
  )
}

export default function App() {
  return (
    <div className="p-8 space-y-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`,

  card: `import React from 'react'

function Card({ title, description, image }) {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="p-8 bg-gray-50">
      <Card
        title="Beautiful Card"
        description="A card component with hover effects"
        image="https://picsum.photos/400/300"
      />
    </div>
  )
}`,
}
