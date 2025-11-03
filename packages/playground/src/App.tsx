/**
 * Clarity Chat Playground
 * Interactive component testing and experimentation environment
 */

import { useState, useEffect } from 'react'
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

  // Auto-format code on load
  useEffect(() => {
    try {
      const prettier = require('prettier/standalone')
      const parserBabel = require('prettier/parser-babel')
      const formatted = prettier.format(code, {
        parser: 'babel',
        plugins: [parserBabel],
        semi: false,
        singleQuote: true,
      })
      setCode(formatted)
    } catch (error) {
      console.error('Failed to format code:', error)
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clarity-chat-component.tsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const encoded = btoa(code)
    const url = `${window.location.origin}?code=${encoded}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey)
    setCode(templates[templateKey as keyof typeof templates])
  }

  const handleReset = () => {
    setCode(templates[selectedTemplate as keyof typeof templates])
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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Reset to template"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? '🌙' : '☀️'}
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
              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Play className="w-4 h-4" />
                Run
              </button>
            </div>
            <LivePreview code={code} theme={theme} autoRun={autoRun} />
          </div>
        </div>
      </div>
    </div>
  )
}

