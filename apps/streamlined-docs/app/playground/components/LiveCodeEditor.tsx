'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Editor, { Monaco, OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { Play, Copy, RotateCcw, Download, Save, AlertCircle, CheckCircle2, Loader2, Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveCodeEditorProps {
  initialCode?: string
  language?: string
  theme?: 'light' | 'dark'
  onRun?: (code: string) => void
  height?: string
  showPreview?: boolean
  readOnly?: boolean
  exampleTemplates?: Array<{ id: string; name: string; code: string }>
}

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: number
}

export function LiveCodeEditor({
  initialCode = '// Write your code here...',
  language = 'typescript',
  theme = 'dark',
  onRun,
  height = '500px',
  showPreview = true,
  readOnly = false,
  exampleTemplates = [],
}: LiveCodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  const [code, setCode] = useState(initialCode)
  const [previewOutput, setPreviewOutput] = useState<string>('')
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>(theme === 'dark' ? 'vs-dark' : 'vs-light')
  const [fontSize, setFontSize] = useState(14)
  const [minimap, setMinimap] = useState(true)
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off')

  // Initialize Monaco Editor with TypeScript support
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    })

    // Add React type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' {
        export function useState<T>(initialState: T): [T, (newState: T) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export const createElement: any;
      }`,
      'file:///node_modules/@types/react/index.d.ts'
    )

    // Enable auto-completion
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const suggestions = [
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useState(${1:initialValue})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            documentation: 'React useState hook',
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'useEffect(() => {\n\t${1}\n}, [${2}])',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            documentation: 'React useEffect hook',
          },
          {
            label: 'console.log',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'console.log(${1})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            documentation: 'Log to console',
          },
        ]

        return { suggestions }
      },
    })

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveCode()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
  }

  // Handle code execution
  const handleRunCode = useCallback(() => {
    setIsRunning(true)
    setConsoleMessages([])
    setErrors([])

    try {
      // Create a sandboxed environment
      const capturedLogs: ConsoleMessage[] = []

      const mockConsole = {
        log: (...args: any[]) => {
          capturedLogs.push({
            type: 'log',
            message: args.map(arg => JSON.stringify(arg, null, 2)).join(' '),
            timestamp: Date.now(),
          })
        },
        error: (...args: any[]) => {
          capturedLogs.push({
            type: 'error',
            message: args.map(arg => JSON.stringify(arg, null, 2)).join(' '),
            timestamp: Date.now(),
          })
        },
        warn: (...args: any[]) => {
          capturedLogs.push({
            type: 'warn',
            message: args.map(arg => JSON.stringify(arg, null, 2)).join(' '),
            timestamp: Date.now(),
          })
        },
        info: (...args: any[]) => {
          capturedLogs.push({
            type: 'info',
            message: args.map(arg => JSON.stringify(arg, null, 2)).join(' '),
            timestamp: Date.now(),
          })
        },
      }

      // Execute code in sandboxed context
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const fn = new AsyncFunction('console', code)
      const result = fn(mockConsole)

      // Handle async results
      if (result instanceof Promise) {
        result
          .then((output) => {
            setPreviewOutput(output !== undefined ? JSON.stringify(output, null, 2) : '')
            setConsoleMessages(capturedLogs)
          })
          .catch((error) => {
            setErrors([error.message])
            capturedLogs.push({
              type: 'error',
              message: error.message,
              timestamp: Date.now(),
            })
            setConsoleMessages(capturedLogs)
          })
          .finally(() => {
            setIsRunning(false)
          })
      } else {
        setPreviewOutput(result !== undefined ? JSON.stringify(result, null, 2) : '')
        setConsoleMessages(capturedLogs)
        setIsRunning(false)
      }

      if (onRun) {
        onRun(code)
      }
    } catch (error: any) {
      setErrors([error.message])
      setConsoleMessages([
        {
          type: 'error',
          message: error.message,
          timestamp: Date.now(),
        },
      ])
      setIsRunning(false)
    }
  }, [code, onRun])

  // Handle code formatting
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
    }
  }

  // Handle code reset
  const handleResetCode = () => {
    setCode(initialCode)
    setPreviewOutput('')
    setConsoleMessages([])
    setErrors([])
  }

  // Handle code copy
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // Show toast or notification
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  // Handle code save
  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language === 'typescript' ? 'ts' : language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle template selection
  const handleSelectTemplate = (templateCode: string) => {
    setCode(templateCode)
    setPreviewOutput('')
    setConsoleMessages([])
    setErrors([])
  }

  // Update editor settings
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        minimap: { enabled: minimap },
        wordWrap,
      })
    }
  }, [fontSize, minimap, wordWrap])

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning || readOnly}
            className="flex items-center gap-2 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run (⌘↵)
          </button>

          <button
            onClick={handleFormatCode}
            disabled={readOnly}
            className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            title="Format code"
          >
            <Settings className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={handleCopyCode}
            className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={handleResetCode}
            disabled={readOnly}
            className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={handleSaveCode}
            className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            title="Save code (⌘S)"
          >
            <Download className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Template selector */}
          {exampleTemplates.length > 0 && (
            <select
              onChange={(e) => {
                const template = exampleTemplates.find((t) => t.id === e.target.value)
                if (template) handleSelectTemplate(template.code)
              }}
              className="px-3 py-1.5 bg-neutral-800 text-neutral-200 text-sm rounded-md border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Select Template...</option>
              {exampleTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-neutral-800 rounded-md transition-colors"
            title="Editor settings"
          >
            <Settings className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-neutral-900 border-b border-neutral-800 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-200">Editor Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-neutral-800 rounded-md"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Font Size</label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-neutral-500">{fontSize}px</span>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Theme</label>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value as 'vs-dark' | 'vs-light')}
                    className="w-full px-2 py-1 bg-neutral-800 text-neutral-200 text-xs rounded border border-neutral-700"
                  >
                    <option value="vs-dark">Dark</option>
                    <option value="vs-light">Light</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-neutral-400">
                    <input
                      type="checkbox"
                      checked={minimap}
                      onChange={(e) => setMinimap(e.target.checked)}
                      className="rounded"
                    />
                    Show Minimap
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-400">
                    <input
                      type="checkbox"
                      checked={wordWrap === 'on'}
                      onChange={(e) => setWordWrap(e.target.checked ? 'on' : 'off')}
                      className="rounded"
                    />
                    Word Wrap
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor and Preview */}
      <div className={`flex-1 flex ${showPreview ? 'flex-col lg:flex-row' : 'flex-col'} overflow-hidden`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-full lg:w-1/2' : 'w-full'} border-r border-neutral-800`}>
          <Editor
            height={height}
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme={editorTheme}
            options={{
              fontSize,
              minimap: { enabled: minimap },
              wordWrap,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
            }}
          />
        </div>

        {/* Preview/Console */}
        {showPreview && (
          <div className="w-full lg:w-1/2 flex flex-col bg-neutral-950">
            {/* Console Output */}
            <div className="flex-1 overflow-auto p-4 space-y-2">
              <div className="text-xs font-medium text-neutral-400 mb-2">Console Output</div>

              {/* Errors */}
              {errors.map((error, index) => (
                <motion.div
                  key={`error-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-2 bg-red-950/20 border border-red-900/30 rounded text-xs"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-300 font-mono">{error}</span>
                </motion.div>
              ))}

              {/* Console messages */}
              {consoleMessages.map((msg, index) => (
                <motion.div
                  key={`msg-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 p-2 rounded text-xs font-mono ${
                    msg.type === 'error'
                      ? 'bg-red-950/20 border border-red-900/30 text-red-300'
                      : msg.type === 'warn'
                      ? 'bg-yellow-950/20 border border-yellow-900/30 text-yellow-300'
                      : msg.type === 'info'
                      ? 'bg-blue-950/20 border border-blue-900/30 text-blue-300'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300'
                  }`}
                >
                  <span className="text-neutral-500 text-xs">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap">{msg.message}</span>
                </motion.div>
              ))}

              {/* Preview output */}
              {previewOutput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 bg-brand-950/20 border border-brand-900/30 rounded"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-medium text-brand-400">Result</span>
                  </div>
                  <pre className="text-xs text-brand-300 font-mono whitespace-pre-wrap">
                    {previewOutput}
                  </pre>
                </motion.div>
              )}

              {consoleMessages.length === 0 && !previewOutput && !errors.length && (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  Run your code to see output here
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
