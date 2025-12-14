/**
 * Clarity Chat Playground
 *
 * A world-class interactive component testing and experimentation environment.
 * Features:
 * - Live code preview with hot reloading
 * - Console output interception
 * - URL sharing with compression
 * - Export to CodeSandbox/StackBlitz
 * - Command palette with keyboard shortcuts
 * - Auto-save to localStorage
 * - Beautiful UI with smooth animations
 */

import { useRef, useCallback, useState, useEffect } from 'react'
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
  Moon,
  Sun,
  Code2,
  Sparkles,
  Search,
  Command,
  Check,
  Zap,
  FileCode,
  BookOpen,
} from 'lucide-react'
import { LivePreview } from './components/LivePreview'
import { ComponentLibrary } from './components/ComponentLibrary'
import { ConsolePanel } from './components/ConsolePanel'
import { ErrorBoundary, PreviewErrorBoundary } from './components/ErrorBoundary'
import { PlaygroundProvider, usePlayground } from './contexts/PlaygroundContext'
import {
  useKeyboardShortcuts,
  getShortcutLabel,
  KEYBOARD_SHORTCUTS,
} from './hooks/useKeyboardShortcuts'

// Logo component with gradient
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">AI</span>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Clarity Chat
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
          PLAYGROUND
        </p>
      </div>
    </div>
  )
}

// Status badge component
function StatusBadge({
  status,
  lastSaved,
}: {
  status: string
  lastSaved: Date | null
}) {
  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-fade-in">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Ready
      </div>
    )
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
        <Check className="w-3 h-3" />
        Saved{' '}
        {lastSaved.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    )
  }

  return null
}

// Command Palette Modal
function CommandPalette({
  isOpen,
  onClose,
  actions,
}: {
  isOpen: boolean
  onClose: () => void
  actions: {
    share: () => void
    copyCode: () => void
    reset: () => void
    toggleTheme: () => void
    toggleConsole: () => void
    toggleSettings: () => void
    exportToCodeSandbox: () => void
    exportToStackBlitz: () => void
    downloadZip: () => void
    run: () => void
  }
}) {
  const [search, setSearch] = useState('')

  const commands = [
    {
      id: 'run',
      label: 'Run Preview',
      icon: Play,
      shortcut: getShortcutLabel('run'),
      action: actions.run,
    },
    {
      id: 'share',
      label: 'Share Playground',
      icon: Share2,
      shortcut: getShortcutLabel('share'),
      action: actions.share,
    },
    {
      id: 'copy',
      label: 'Copy Code',
      icon: Copy,
      shortcut: getShortcutLabel('copy'),
      action: actions.copyCode,
    },
    {
      id: 'reset',
      label: 'Reset to Template',
      icon: RefreshCw,
      shortcut: getShortcutLabel('reset'),
      action: actions.reset,
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      icon: Moon,
      shortcut: getShortcutLabel('theme'),
      action: actions.toggleTheme,
    },
    {
      id: 'console',
      label: 'Toggle Console',
      icon: Terminal,
      shortcut: getShortcutLabel('console'),
      action: actions.toggleConsole,
    },
    {
      id: 'settings',
      label: 'Toggle Settings',
      icon: Settings,
      shortcut: getShortcutLabel('settings'),
      action: actions.toggleSettings,
    },
    {
      id: 'codesandbox',
      label: 'Open in CodeSandbox',
      icon: ExternalLink,
      action: actions.exportToCodeSandbox,
    },
    {
      id: 'stackblitz',
      label: 'Open in StackBlitz',
      icon: Zap,
      action: actions.exportToStackBlitz,
    },
    {
      id: 'download',
      label: 'Download as File',
      icon: Download,
      action: actions.downloadZip,
    },
  ]

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.id.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (action: () => void) => {
    action()
    onClose()
    setSearch('')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        setSearch('')
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => {
          onClose()
          setSearch('')
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
            autoFocus
          />
          <kbd className="kbd text-xs">ESC</kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleSelect(cmd.action)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <cmd.icon className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300">
                  {cmd.label}
                </span>
                {cmd.shortcut && (
                  <kbd className="kbd text-xs">{cmd.shortcut}</kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="kbd">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="kbd">↵</kbd> Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" />K to open
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Header Action Button
function HeaderButton({
  onClick,
  title,
  children,
  active = false,
  badge,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
  active?: boolean
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative btn-icon ${active ? 'active' : ''}`}
      title={title}
      aria-label={title}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}

/**
 * Main Playground Content
 * Uses the PlaygroundContext for all state management
 */
function PlaygroundContent() {
  const { state, actions } = usePlayground()
  const runPreviewRef = useRef<(() => void) | null>(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onShare: actions.share,
    onRun: () => runPreviewRef.current?.(),
    onCopy: actions.copyCode,
    onReset: actions.reset,
    onToggleTheme: actions.toggleTheme,
    onToggleConsole: actions.toggleConsole,
    onToggleSettings: actions.toggleSettings,
    onEscape: () => {
      actions.closeExportMenu()
      setShowCommandPalette(false)
    },
  })

  // Command palette shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
      className={`h-screen flex flex-col gradient-mesh ${state.theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Header */}
      <header className="glass border-b border-gray-200/50 dark:border-gray-700/50 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Status */}
          <div className="flex items-center gap-6">
            <Logo />
            <StatusBadge
              status={state.previewStatus}
              lastSaved={state.lastSaved}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setShowCommandPalette(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-gray-400">Search commands...</span>
              <kbd className="kbd text-xs ml-2">⌘K</kbd>
            </button>

            <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

            <HeaderButton
              onClick={actions.reset}
              title={`Reset to template (${getShortcutLabel('reset')})`}
            >
              <RefreshCw className="w-5 h-5" />
            </HeaderButton>

            <HeaderButton
              onClick={actions.copyCode}
              title={`Copy code (${getShortcutLabel('copy')})`}
            >
              <Copy className="w-5 h-5" />
            </HeaderButton>

            <HeaderButton
              onClick={actions.downloadZip}
              title="Download as file"
            >
              <Download className="w-5 h-5" />
            </HeaderButton>

            <HeaderButton
              onClick={actions.share}
              title={`Share (${getShortcutLabel('share')})`}
            >
              <Share2 className="w-5 h-5" />
            </HeaderButton>

            {/* Export Menu */}
            <div className="relative">
              <HeaderButton
                onClick={actions.toggleExportMenu}
                title="Export options"
              >
                <ExternalLink className="w-5 h-5" />
              </HeaderButton>

              {state.showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={actions.closeExportMenu}
                  />
                  <div className="dropdown-menu right-0 mt-2">
                    <button
                      onClick={actions.exportToCodeSandbox}
                      className="dropdown-item"
                    >
                      <Code2 className="dropdown-item-icon" />
                      Open in CodeSandbox
                    </button>
                    <button
                      onClick={actions.exportToStackBlitz}
                      className="dropdown-item"
                    >
                      <Zap className="dropdown-item-icon" />
                      Open in StackBlitz
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

            <HeaderButton
              onClick={actions.toggleConsole}
              title={`Toggle console (${getShortcutLabel('console')})`}
              active={state.showConsole}
              badge={
                state.consoleEntries.filter((e) => e.level === 'error').length
              }
            >
              <Terminal className="w-5 h-5" />
            </HeaderButton>

            <HeaderButton
              onClick={actions.toggleSettings}
              title={`Settings (${getShortcutLabel('settings')})`}
              active={state.showSettings}
            >
              <Settings className="w-5 h-5" />
            </HeaderButton>

            <button
              onClick={actions.toggleTheme}
              className="ml-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              title={`Toggle theme (${getShortcutLabel('theme')})`}
            >
              {state.theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">
                {state.theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {state.showSettings && (
          <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in-down">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={state.settings.autoRun}
                  onChange={(e) =>
                    actions.updateSettings({ autoRun: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-run
                </span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={state.settings.lineNumbers}
                  onChange={(e) =>
                    actions.updateSettings({ lineNumbers: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Line numbers
                </span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={state.settings.wordWrap}
                  onChange={(e) =>
                    actions.updateSettings({ wordWrap: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Word wrap
                </span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={state.settings.minimap}
                  onChange={(e) =>
                    actions.updateSettings({ minimap: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimap
                </span>
              </label>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Keyboard className="w-4 h-4" />
                <span className="font-medium">Keyboard Shortcuts</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-100/50 dark:bg-gray-700/50"
                  >
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="kbd text-xs">
                      {getShortcutLabel(key as keyof typeof KEYBOARD_SHORTCUTS)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Sidebar - Component Library */}
        <aside className="w-72 hidden lg:block flex-shrink-0">
          <div className="h-full card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Templates
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ComponentLibrary
                selectedTemplate={state.selectedTemplate}
                onTemplateChange={actions.setTemplate}
              />
            </div>
          </div>
        </aside>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 card overflow-hidden flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Editor
                </span>
                <span className="badge badge-neutral text-xs">TypeScript</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{state.code.split('\n').length} lines</span>
              </div>
            </div>

            {/* Monaco Editor */}
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
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  tabSize: state.settings.tabSize,
                  formatOnPaste: true,
                  formatOnType: true,
                  wordWrap: state.settings.wordWrap ? 'on' : 'off',
                  padding: { top: 16, bottom: 16 },
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="w-[45%] hidden md:flex flex-col gap-4">
          <div className="flex-1 card overflow-hidden flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview
                </span>
                {state.previewStatus === 'success' && (
                  <span className="badge badge-success text-xs">Running</span>
                )}
                {state.previewStatus === 'error' && (
                  <span className="badge badge-error text-xs">Error</span>
                )}
                {(state.previewStatus === 'compiling' ||
                  state.previewStatus === 'rendering') && (
                  <span className="badge badge-primary text-xs animate-pulse">
                    Loading...
                  </span>
                )}
              </div>
              <button
                onClick={() => runPreviewRef.current?.()}
                className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2"
                title={`Run preview (${getShortcutLabel('run')})`}
              >
                <Play className="w-3.5 h-3.5" />
                Run
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
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
          </div>

          {/* Console Panel */}
          {state.showConsole && (
            <div className="animate-fade-in-up">
              <ConsolePanel
                entries={state.consoleEntries}
                onClear={actions.clearConsole}
                maxHeight="250px"
                className="card"
              />
            </div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        actions={{
          share: actions.share,
          copyCode: actions.copyCode,
          reset: actions.reset,
          toggleTheme: actions.toggleTheme,
          toggleConsole: actions.toggleConsole,
          toggleSettings: actions.toggleSettings,
          exportToCodeSandbox: actions.exportToCodeSandbox,
          exportToStackBlitz: actions.exportToStackBlitz,
          downloadZip: actions.downloadZip,
          run: () => runPreviewRef.current?.(),
        }}
      />

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        theme={state.theme}
        toastOptions={{
          className: 'card',
          style: {
            background: state.theme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${state.theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          },
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
