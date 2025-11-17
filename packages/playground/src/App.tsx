/**
 * Clarity Chat Playground
 * Interactive component testing and experimentation environment
 */

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Copy, Download, Share2, RefreshCw, Settings } from 'lucide-react'
import { LivePreview } from './components/LivePreview'
import { ComponentLibrary } from './components/ComponentLibrary'
import { templates } from './templates'

export default function App() {
  const [code, setCode] = useState(templates.basic)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [selectedTemplate, setSelectedTemplate] = useState('basic')
  const [autoRun, setAutoRun] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const runPreviewRef = useRef<(() => void) | null>(null)
  const hasLoadedFromUrl = useRef(false)

  // Load code from URL parameters on mount (before formatting)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codeParam = params.get('code')
    if (codeParam) {
      try {
        const decoded = decodeURIComponent(codeParam)
        const codeFromUrl = atob(decoded)
        setCode(codeFromUrl)
        hasLoadedFromUrl.current = true
        // Clear URL parameter after loading
        window.history.replaceState({}, '', window.location.pathname)
      } catch (error) {
        console.error('Failed to load code from URL:', error)
        // Silently fail - use default template
      }
    }
  }, [])

  // Auto-format code on initial load only (skip if loaded from URL)
  useEffect(() => {
    if (hasLoadedFromUrl.current) return

    const format = async () => {
      try {
        const prettierMod = await import('prettier/standalone')
        const parserBabel = await import('prettier/parser-babel')
        const formatted = await prettierMod.default.format(code, {
          parser: 'babel',
          plugins: [parserBabel.default],
          semi: false,
          singleQuote: true,
        })
        setCode(formatted)
      } catch (error) {
        console.error('Failed to format code:', error)
        // Silently fail - code will remain unformatted
      }
    }
    void format()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Could use a toast notification here instead of alert
      alert('Code copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      alert('Failed to copy code. Please try selecting and copying manually.')
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clarity-chat-component.tsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download file:', error)
      alert('Failed to download file. Please try again.')
    }
  }

  const handleShare = async () => {
    try {
      // Encode code to base64, then URL encode
      const base64 = btoa(unescape(encodeURIComponent(code)))
      const encoded = encodeURIComponent(base64)
      const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`

      // Check URL length (browsers have limits around 2000-8000 chars)
      if (url.length > 2000) {
        alert('Code is too long to share via URL. Please use the download feature instead.')
        return
      }

      await navigator.clipboard.writeText(url)
      alert('Share link copied to clipboard!')
    } catch (error) {
      console.error('Failed to share:', error)
      alert('Failed to create share link. Please try again.')
    }
  }

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey)
    const template = templates[templateKey as keyof typeof templates]
    if (template) {
      setCode(template)
    } else {
      console.warn(`Template "${templateKey}" not found`)
      setCode(templates.basic)
    }
  }

  const handleReset = () => {
    const template = templates[selectedTemplate as keyof typeof templates]
    if (template) {
      setCode(template)
    } else {
      setCode(templates.basic)
    }
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Clarity Chat Playground
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive component testing environment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Reset to template"
              aria-label="Reset code to selected template"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Copy code"
              aria-label="Copy code to clipboard"
            >
              <Copy className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Download"
              aria-label="Download code as file"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Share"
              aria-label="Share code via URL"
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Settings"
              aria-label="Toggle settings panel"
              aria-expanded={showSettings}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-run on change
                </span>
              </label>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Component Library */}
        <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ComponentLibrary
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
          />
        </aside>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-1/2 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <button
                onClick={() => runPreviewRef.current?.()}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Run preview manually"
              >
                <Play className="w-4 h-4" />
                Run
              </button>
            </div>
            <LivePreview code={code} theme={theme} autoRun={autoRun} onRunRef={runPreviewRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
