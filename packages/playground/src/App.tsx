/**
 * Clarity Chat Playground
 *
 * Interactive component testing and experimentation environment.
 * Features:
 * - Live code preview with hot reloading
 * - Console output interception
 * - URL sharing with compression
 * - Export to CodeSandbox/StackBlitz
 * - Keyboard shortcuts
 * - Auto-save to localStorage
 */

import { useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Toaster } from 'sonner'
import {
  Play,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Settings,
  ExternalLink,
  Terminal,
  Keyboard,
} from 'lucide-react'
import { LivePreview } from './components/LivePreview'
import { ComponentLibrary } from './components/ComponentLibrary'
import { ConsolePanel } from './components/ConsolePanel'
import { ErrorBoundary, PreviewErrorBoundary } from './components/ErrorBoundary'
import { PlaygroundProvider, usePlayground } from './contexts/PlaygroundContext'
import {
  useKeyboardShortcuts,
  getShortcutLabel,
} from './hooks/useKeyboardShortcuts'

/**
 * Main Playground Content
 * Uses the PlaygroundContext for all state management
 */
function PlaygroundContent() {
  const { state, actions } = usePlayground()
  const runPreviewRef = useRef<(() => void) | null>(null)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onShare: actions.share,
    onRun: () => runPreviewRef.current?.(),
    onCopy: actions.copyCode,
    onReset: actions.reset,
    onToggleTheme: actions.toggleTheme,
    onToggleConsole: actions.toggleConsole,
    onToggleSettings: actions.toggleSettings,
    onEscape: actions.closeExportMenu,
  })

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      actions.setCode(value || '')
    },
    [actions]
  )

  const handleConsoleEntry = useCallback(
    (entry: {
      level: 'log' | 'info' | 'warn' | 'error'
      message: string
      args?: unknown[]
    }) => {
      actions.addConsoleEntry(entry)
    },
    [actions]
  )

  const handlePreviewStatus = useCallback(
    (status: 'idle' | 'compiling' | 'rendering' | 'success' | 'error') => {
      actions.setPreviewStatus(status)
    },
    [actions]
  )

  return (
    <div
      className={`h-screen flex flex-col ${state.theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Clarity Chat Playground
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive component testing environment
              {state.lastSaved && (
                <span className="ml-2 text-xs">
                  (Auto-saved {state.lastSaved.toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={actions.reset}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Reset to template (${getShortcutLabel('reset')})`}
              aria-label="Reset code to selected template"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={actions.copyCode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Copy code (${getShortcutLabel('copy')})`}
              aria-label="Copy code to clipboard"
            >
              <Copy className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={actions.downloadZip}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Download as ZIP"
              aria-label="Download code as file"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={actions.share}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Share (${getShortcutLabel('share')})`}
              aria-label="Share code via URL"
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={actions.toggleExportMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Export"
                aria-label="Export options"
                aria-expanded={state.showExportMenu}
              >
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
              </button>
              {state.showExportMenu && (
                <>
                  {/* Backdrop for closing */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={actions.closeExportMenu}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                      onClick={actions.exportToCodeSandbox}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Open in CodeSandbox
                    </button>
                    <button
                      onClick={actions.exportToStackBlitz}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Open in StackBlitz
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={actions.toggleConsole}
              className={`p-2 rounded-lg transition-colors ${
                state.showConsole
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={`Toggle console (${getShortcutLabel('console')})`}
              aria-label="Toggle console panel"
              aria-pressed={state.showConsole}
            >
              <Terminal className="w-5 h-5" aria-hidden="true" />
              {state.consoleEntries.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {state.consoleEntries.length > 99
                    ? '99+'
                    : state.consoleEntries.length}
                </span>
              )}
            </button>

            <button
              onClick={actions.toggleSettings}
              className={`p-2 rounded-lg transition-colors ${
                state.showSettings
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={`Settings (${getShortcutLabel('settings')})`}
              aria-label="Toggle settings panel"
              aria-expanded={state.showSettings}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              onClick={actions.toggleTheme}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={`Toggle theme (${getShortcutLabel('theme')})`}
              aria-label={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span aria-hidden="true">
                {state.theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {state.showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.settings.autoRun}
                  onChange={(e) =>
                    actions.updateSettings({ autoRun: e.target.checked })
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
                  checked={state.settings.lineNumbers}
                  onChange={(e) =>
                    actions.updateSettings({ lineNumbers: e.target.checked })
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
                  checked={state.settings.wordWrap}
                  onChange={(e) =>
                    actions.updateSettings({ wordWrap: e.target.checked })
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
                  checked={state.settings.minimap}
                  onChange={(e) =>
                    actions.updateSettings({ minimap: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Minimap
                </span>
              </label>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Keyboard className="w-4 h-4" />
                <span className="font-medium">Keyboard Shortcuts</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    {getShortcutLabel('run')}
                  </kbd>{' '}
                  Run
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    {getShortcutLabel('share')}
                  </kbd>{' '}
                  Share
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    {getShortcutLabel('copy')}
                  </kbd>{' '}
                  Copy
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                    {getShortcutLabel('console')}
                  </kbd>{' '}
                  Console
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Component Library */}
        <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ComponentLibrary
            selectedTemplate={state.selectedTemplate}
            onTemplateChange={actions.setTemplate}
          />
        </aside>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={state.code}
              onChange={handleEditorChange}
              theme={state.theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: state.settings.minimap },
                fontSize: state.settings.fontSize,
                lineNumbers: state.settings.lineNumbers ? 'on' : 'off',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                tabSize: state.settings.tabSize,
                formatOnPaste: true,
                formatOnType: true,
                wordWrap: state.settings.wordWrap ? 'on' : 'off',
              }}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preview
              </h2>
              <button
                onClick={() => runPreviewRef.current?.()}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title={`Run preview (${getShortcutLabel('run')})`}
              >
                <Play className="w-4 h-4" />
                Run
              </button>
            </div>

            <ErrorBoundary onReset={() => runPreviewRef.current?.()}>
              <PreviewErrorBoundary onRetry={() => runPreviewRef.current?.()}>
                <LivePreview
                  code={state.code}
                  theme={state.theme}
                  autoRun={state.settings.autoRun}
                  onRunRef={runPreviewRef}
                  onConsoleEntry={handleConsoleEntry}
                  onError={actions.setError}
                  onPreviewStatus={handlePreviewStatus}
                />
              </PreviewErrorBoundary>
            </ErrorBoundary>
          </div>

          {/* Console Panel */}
          {state.showConsole && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <ConsolePanel
                entries={state.consoleEntries}
                onClear={actions.clearConsole}
                maxHeight="200px"
              />
            </div>
          )}
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        theme={state.theme}
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </div>
  )
}

/**
 * Main App Component
 * Wraps everything with the PlaygroundProvider
 */
export default function App() {
  return (
    <ErrorBoundary>
      <PlaygroundProvider>
        <PlaygroundContent />
      </PlaygroundProvider>
    </ErrorBoundary>
  )
}
