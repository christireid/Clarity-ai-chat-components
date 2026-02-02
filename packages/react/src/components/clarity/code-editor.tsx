'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Play,
  Copy,
  Check,
  Download,
  Upload,
  Undo,
  Redo,
  Search,
  Settings,
  Maximize2,
  Minimize2,
  Code,
  FileCode,
  Sparkles,
  Wand2,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Save,
  RefreshCw,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@clarity-chat/primitives'

// Language configurations
const languages = [
  { id: 'javascript', label: 'JavaScript', extension: '.js' },
  { id: 'typescript', label: 'TypeScript', extension: '.ts' },
  { id: 'python', label: 'Python', extension: '.py' },
  { id: 'rust', label: 'Rust', extension: '.rs' },
  { id: 'go', label: 'Go', extension: '.go' },
  { id: 'java', label: 'Java', extension: '.java' },
  { id: 'cpp', label: 'C++', extension: '.cpp' },
  { id: 'html', label: 'HTML', extension: '.html' },
  { id: 'css', label: 'CSS', extension: '.css' },
  { id: 'json', label: 'JSON', extension: '.json' },
  { id: 'sql', label: 'SQL', extension: '.sql' },
  { id: 'markdown', label: 'Markdown', extension: '.md' },
]

const themes = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'github-dark', label: 'GitHub Dark' },
  { id: 'monokai', label: 'Monokai' },
  { id: 'dracula', label: 'Dracula' },
]

interface CodeEditorProps {
  value?: string
  defaultValue?: string
  language?: string
  theme?: string
  readOnly?: boolean
  showLineNumbers?: boolean
  showMinimap?: boolean
  height?: string | number
  filename?: string
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  onRun?: (value: string) => void
  onAIAssist?: (selection: string, action: string) => void
  className?: string
}

export function CodeEditor({
  value,
  defaultValue = '',
  language = 'typescript',
  theme = 'dark',
  readOnly = false,
  showLineNumbers = true,
  showMinimap = false,
  height = 400,
  filename,
  onChange,
  onSave,
  onRun,
  onAIAssist,
  className,
}: CodeEditorProps) {
  const [code, setCode] = React.useState(value ?? defaultValue)
  const [selectedLanguage, setSelectedLanguage] = React.useState(language)
  const [copied, setCopied] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [cursorPosition, setCursorPosition] = React.useState({
    line: 1,
    col: 1,
  })
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setCode(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setCode(newValue)
    onChange?.(newValue)

    // Update cursor position
    const textarea = e.target
    const text = textarea.value.substring(0, textarea.selectionStart)
    const lines = text.split('\n')
    setCursorPosition({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newValue)
      onChange?.(newValue)

      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }

    // Handle save shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      onSave?.(code)
    }

    // Handle search shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault()
      setShowSearch(true)
    }
  }

  const lines = code.split('\n')

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border bg-code-bg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-2 py-1.5">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          {filename && <span className="text-sm font-medium">{filename}</span>}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          {onAIAssist && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs">AI</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAIAssist(code, 'explain')}>
                  <Code className="mr-2 h-4 w-4" />
                  Explain Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAIAssist(code, 'improve')}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Improve Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAIAssist(code, 'fix')}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Fix Bugs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAIAssist(code, 'test')}>
                  Generate Tests
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAIAssist(code, 'docs')}>
                  Add Documentation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search (Cmd+F)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onRun && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-green-500 hover:text-green-400"
                    onClick={() => onRun(code)}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-2 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="h-7 flex-1 text-sm"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery('')
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div className="flex flex-col border-r border-border bg-secondary/30 px-3 py-3 text-right font-mono text-xs text-muted-foreground select-none">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code Area */}
        <div className="relative flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            className={cn(
              'absolute inset-0 w-full h-full resize-none bg-transparent p-3 font-mono text-sm leading-6 outline-none',
              'scrollbar-thin text-foreground placeholder:text-muted-foreground',
              readOnly && 'cursor-default'
            )}
            placeholder="// Start typing your code..."
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <span>{lines.length} lines</span>
          <span>{code.length} chars</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{languages.find((l) => l.id === selectedLanguage)?.label}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  )
}

// Multi-file editor with tabs
interface EditorFile {
  id: string
  name: string
  language: string
  content: string
  isDirty?: boolean
}

interface MultiFileEditorProps {
  files: EditorFile[]
  activeFileId?: string
  onFileChange?: (fileId: string, content: string) => void
  onFileSelect?: (fileId: string) => void
  onFileClose?: (fileId: string) => void
  onFileSave?: (fileId: string, content: string) => void
  className?: string
}

export function MultiFileEditor({
  files,
  activeFileId,
  onFileChange,
  onFileSelect,
  onFileClose,
  onFileSave,
  className,
}: MultiFileEditorProps) {
  const [activeId, setActiveId] = React.useState(activeFileId ?? files[0]?.id)
  const activeFile = files.find((f) => f.id === activeId)

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border overflow-hidden',
        className
      )}
    >
      {/* File Tabs */}
      <div className="flex items-center gap-0.5 border-b border-border bg-secondary/50 px-1 overflow-x-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              'group flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer border-b-2 transition-colors',
              activeId === file.id
                ? 'border-accent bg-background text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
            onClick={() => {
              setActiveId(file.id)
              onFileSelect?.(file.id)
            }}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>{file.name}</span>
            {file.isDirty && (
              <span className="h-2 w-2 rounded-full bg-accent" />
            )}
            {onFileClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileClose(file.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Editor */}
      {activeFile && (
        <CodeEditor
          value={activeFile.content}
          language={activeFile.language}
          filename={activeFile.name}
          onChange={(content) => onFileChange?.(activeFile.id, content)}
          onSave={(content) => onFileSave?.(activeFile.id, content)}
          height={500}
        />
      )}
    </div>
  )
}

// Inline code editor for quick edits
interface InlineEditorProps {
  value: string
  language?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onCancel?: () => void
  placeholder?: string
  className?: string
}

export function InlineEditor({
  value,
  language = 'typescript',
  onChange,
  onSubmit,
  onCancel,
  placeholder = 'Enter code...',
  className,
}: InlineEditorProps) {
  const [code, setCode] = React.useState(value)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit?.(code)
    }
    if (e.key === 'Escape') {
      onCancel?.()
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-code-bg overflow-hidden',
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => {
          setCode(e.target.value)
          onChange?.(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[100px] resize-none bg-transparent p-3 font-mono text-sm outline-none"
        spellCheck={false}
      />
      <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-3 py-2">
        <span className="text-xs text-muted-foreground">
          Cmd+Enter to submit, Esc to cancel
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSubmit?.(code)}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
