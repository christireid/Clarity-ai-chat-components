/**
 * Clarity Chat Playground
 * Interactive component testing and experimentation environment
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import {
  Play,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Settings,
  ExternalLink,
  Check,
} from 'lucide-react'
import { LivePreview } from './components/LivePreview'
import { ComponentLibrary } from './components/ComponentLibrary'
import { ConsolePanel } from './components/ConsolePanel'
import { templates, getTemplateById } from './templates/index'
import {
  parseUrlState,
  copyShareableUrl,
  openInCodeSandbox,
  openInStackBlitz,
  downloadAsZip,
} from './utils'
import type { PlaygroundSettings, ConsoleLogEntry } from './types'

const DEFAULT_SETTINGS: PlaygroundSettings = {
  autoRun: true,
  lineNumbers: true,
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  minimap: false,
}

const DEFAULT_TEMPLATE = templates[0]

export default function App() {
  const [code, setCode] = useState(DEFAULT_TEMPLATE.code)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE.id)
  const [settings, setSettings] = useState<PlaygroundSettings>(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  )
  const [consoleEntries, setConsoleEntries] = useState<ConsoleLogEntry[]>([])
  const [showConsole, setShowConsole] = useState(false)
  const runPreviewRef = useRef<(() => void) | null>(null)
  const hasLoadedFromUrl = useRef(false)

  // Load state from URL parameters on mount
  useEffect(() => {
    const urlState = parseUrlState()
    if (urlState) {
      if (urlState.code) {
        setCode(urlState.code)
        hasLoadedFromUrl.current = true
      }
      if (urlState.templateId) {
        const template = getTemplateById(urlState.templateId)
        if (template) {
          setSelectedTemplate(template.id)
          if (!urlState.code) {
            setCode(template.code)
          }
        }
      }
      if (urlState.theme) {
        setTheme(urlState.theme)
      }
      if (urlState.settings) {
        setSettings((prev) => ({ ...prev, ...urlState.settings }))
      }
      // Clear URL parameter after loading
      window.history.replaceState({}, '', window.location.pathname)
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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setShareStatus('error')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }, [code])

  const handleDownload = useCallback(() => {
    downloadAsZip({
      code,
      title: getTemplateById(selectedTemplate)?.name || 'Clarity Chat Example',
    })
  }, [code, selectedTemplate])

  const handleShare = useCallback(async () => {
    const result = await copyShareableUrl({
      code,
      templateId: selectedTemplate,
      theme,
      settings,
    })

    if (result.success) {
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } else {
      setShareStatus('error')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }, [code, selectedTemplate, theme, settings])

  const handleOpenInCodeSandbox = useCallback(() => {
    openInCodeSandbox({
      code,
      title: getTemplateById(selectedTemplate)?.name || 'Clarity Chat Example',
    })
    setShowExportMenu(false)
  }, [code, selectedTemplate])

  const handleOpenInStackBlitz = useCallback(() => {
    openInStackBlitz({
      code,
      title: getTemplateById(selectedTemplate)?.name || 'Clarity Chat Example',
    })
    setShowExportMenu(false)
  }, [code, selectedTemplate])

  const handleTemplateChange = useCallback((templateId: string) => {
    setSelectedTemplate(templateId)
    const template = getTemplateById(templateId)
    if (template) {
      setCode(template.code)
    } else {
      console.warn(`Template "${templateId}" not found`)
      setCode(DEFAULT_TEMPLATE.code)
    }
  }, [])

  const handleReset = useCallback(() => {
    const template = getTemplateById(selectedTemplate)
    if (template) {
      setCode(template.code)
    } else {
      setCode(DEFAULT_TEMPLATE.code)
    }
  }, [selectedTemplate])

  const handleClearConsole = useCallback(() => {
    setConsoleEntries([])
  }, [])

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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              title={shareStatus === 'copied' ? 'Copied!' : 'Share'}
              aria-label="Share code via URL"
            >
              {shareStatus === 'copied' ? (
                <Check className="w-5 h-5 text-green-500" aria-hidden="true" />
              ) : (
                <Share2 className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Export"
                aria-label="Export options"
                aria-expanded={showExportMenu}
              >
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={handleOpenInCodeSandbox}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Open in CodeSandbox
                  </button>
                  <button
                    onClick={handleOpenInStackBlitz}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Open in StackBlitz
                  </button>
                </div>
              )}
            </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.autoRun}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoRun: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-run
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.lineNumbers}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lineNumbers: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Line numbers
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.wordWrap}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      wordWrap: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Word wrap
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConsole}
                  onChange={(e) => setShowConsole(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show console
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
              onChange={(value: string | undefined) => setCode(value || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: settings.minimap },
                fontSize: settings.fontSize,
                lineNumbers: settings.lineNumbers ? 'on' : 'off',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                tabSize: settings.tabSize,
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: settings.wordWrap ? 'on' : 'off',
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
            <LivePreview
              code={code}
              theme={theme}
              autoRun={settings.autoRun}
              onRunRef={runPreviewRef}
            />

            {/* Console Panel */}
            {showConsole && (
              <div className="mt-4">
                <ConsolePanel
                  entries={consoleEntries}
                  onClear={handleClearConsole}
                  maxHeight="150px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
