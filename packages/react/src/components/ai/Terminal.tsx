'use client'

/**
 * Terminal Component
 *
 * An interactive terminal component with dark Night Owl theme.
 * Supports command execution, output streaming, and multiple themes.
 *
 * Features:
 * - Night Owl dark theme (default)
 * - Interactive command input
 * - Streaming output support
 * - Command history navigation
 * - Auto-scroll to bottom
 * - Copy output functionality
 * - Multiple theme presets
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Terminal
 *   lines={[
 *     { type: 'command', content: 'npm install' },
 *     { type: 'output', content: 'Installing dependencies...' },
 *     { type: 'success', content: 'Done in 2.3s' },
 *   ]}
 * />
 *
 * // Interactive with input
 * <Terminal
 *   interactive
 *   onCommand={(cmd) => console.log(cmd)}
 *   prompt="$"
 * />
 *
 * // Streaming output
 * <Terminal lines={lines} isStreaming />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { durations } from '../../animations/zero-dependency'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type TerminalTheme =
  | 'night-owl'
  | 'dracula'
  | 'monokai'
  | 'github-dark'
  | 'one-dark'
  | 'nord'
export type TerminalLineType =
  | 'command'
  | 'output'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'system'

export interface TerminalLine {
  /** Unique identifier */
  id?: string
  /** Line type */
  type: TerminalLineType
  /** Content text */
  content: string
  /** Timestamp */
  timestamp?: Date
  /** Whether line is still streaming */
  isStreaming?: boolean
  /** Custom prompt for command lines */
  prompt?: string
}

export interface TerminalProps {
  /** Array of terminal lines */
  lines?: TerminalLine[]
  /** Terminal title */
  title?: string
  /** Theme preset */
  theme?: TerminalTheme
  /** Command prompt symbol */
  prompt?: string
  /** Current working directory */
  cwd?: string
  /** Whether terminal accepts input */
  interactive?: boolean
  /** Whether output is streaming */
  isStreaming?: boolean
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Show timestamps */
  showTimestamps?: boolean
  /** Show window controls */
  showControls?: boolean
  /** Max height with scroll */
  maxHeight?: number | string
  /** Command handler */
  onCommand?: (command: string) => void
  /** Copy handler */
  onCopy?: (content: string) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Theme Configurations
// ============================================================================

const themes: Record<
  TerminalTheme,
  {
    background: string
    foreground: string
    command: string
    output: string
    error: string
    success: string
    warning: string
    info: string
    system: string
    prompt: string
    selection: string
    border: string
  }
> = {
  'night-owl': {
    background: '#011627',
    foreground: '#d6deeb',
    command: '#82aaff',
    output: '#d6deeb',
    error: '#ef5350',
    success: '#22da6e',
    warning: '#ffcb6b',
    info: '#7fdbca',
    system: '#637777',
    prompt: '#c792ea',
    selection: '#1d3b53',
    border: '#1d3b53',
  },
  dracula: {
    background: '#282a36',
    foreground: '#f8f8f2',
    command: '#8be9fd',
    output: '#f8f8f2',
    error: '#ff5555',
    success: '#50fa7b',
    warning: '#ffb86c',
    info: '#8be9fd',
    system: '#6272a4',
    prompt: '#ff79c6',
    selection: '#44475a',
    border: '#44475a',
  },
  monokai: {
    background: '#272822',
    foreground: '#f8f8f2',
    command: '#66d9ef',
    output: '#f8f8f2',
    error: '#f92672',
    success: '#a6e22e',
    warning: '#fd971f',
    info: '#66d9ef',
    system: '#75715e',
    prompt: '#ae81ff',
    selection: '#49483e',
    border: '#49483e',
  },
  'github-dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    command: '#79c0ff',
    output: '#c9d1d9',
    error: '#f85149',
    success: '#3fb950',
    warning: '#d29922',
    info: '#58a6ff',
    system: '#8b949e',
    prompt: '#d2a8ff',
    selection: '#161b22',
    border: '#30363d',
  },
  'one-dark': {
    background: '#282c34',
    foreground: '#abb2bf',
    command: '#61afef',
    output: '#abb2bf',
    error: '#e06c75',
    success: '#98c379',
    warning: '#e5c07b',
    info: '#56b6c2',
    system: '#5c6370',
    prompt: '#c678dd',
    selection: '#3e4451',
    border: '#3e4451',
  },
  nord: {
    background: '#2e3440',
    foreground: '#eceff4',
    command: '#88c0d0',
    output: '#eceff4',
    error: '#bf616a',
    success: '#a3be8c',
    warning: '#ebcb8b',
    info: '#81a1c1',
    system: '#4c566a',
    prompt: '#b48ead',
    selection: '#3b4252',
    border: '#3b4252',
  },
}

// ============================================================================
// Helper Components
// ============================================================================

function WindowControls({ theme }: { theme: TerminalTheme }) {
  return (
    <div className="terminal-controls">
      <span className="terminal-control terminal-control-close" />
      <span className="terminal-control terminal-control-minimize" />
      <span className="terminal-control terminal-control-maximize" />
    </div>
  )
}

function StreamingCursor() {
  return (
    <motion.span
      className="terminal-cursor"
      animate={{ opacity: [1, 0] }}
      transition={{
        duration: durations.slower,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      ▋
    </motion.span>
  )
}

// ============================================================================
// Terminal Component
// ============================================================================

export function Terminal({
  lines = [],
  title = 'Terminal',
  theme = 'night-owl',
  prompt = '$',
  cwd,
  interactive = false,
  isStreaming = false,
  showLineNumbers = false,
  showTimestamps = false,
  showControls = true,
  maxHeight = 400,
  onCommand,
  onCopy,
  className,
}: TerminalProps) {
  const prefersReducedMotion = useReducedMotion()
  const themeConfig = themes[theme]
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState('')
  const [commandHistory, setCommandHistory] = React.useState<string[]>([])
  const [historyIndex, setHistoryIndex] = React.useState(-1)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    onCommand?.(inputValue.trim())
    setCommandHistory((prev) => [...prev, inputValue.trim()])
    setHistoryIndex(-1)
    setInputValue('')
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputValue('')
      }
    }
  }

  // Copy all output
  const handleCopy = () => {
    const content = lines.map((l) => l.content).join('\n')
    navigator.clipboard?.writeText(content)
    onCopy?.(content)
  }

  // Focus input on click
  const handleContainerClick = () => {
    if (interactive && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <motion.div
      className={cn('terminal', `terminal-${theme}`, className)}
      style={
        {
          '--terminal-bg': themeConfig.background,
          '--terminal-fg': themeConfig.foreground,
          '--terminal-border': themeConfig.border,
          '--terminal-selection': themeConfig.selection,
          '--terminal-prompt': themeConfig.prompt,
          '--terminal-command': themeConfig.command,
          '--terminal-output': themeConfig.output,
          '--terminal-error': themeConfig.error,
          '--terminal-success': themeConfig.success,
          '--terminal-warning': themeConfig.warning,
          '--terminal-info': themeConfig.info,
          '--terminal-system': themeConfig.system,
        } as React.CSSProperties
      }
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="region"
      aria-label={title}
    >
      {/* Header */}
      <div className="terminal-header">
        {showControls && <WindowControls theme={theme} />}
        <div className="terminal-title">
          {cwd ? `${title} — ${cwd}` : title}
        </div>
        <button
          type="button"
          className="terminal-copy-btn"
          onClick={handleCopy}
          aria-label="Copy terminal output"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="terminal-content"
        style={{ maxHeight }}
        onClick={handleContainerClick}
        role="log"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {lines.map((line, index) => (
            <motion.div
              key={line.id || `${index}-${line.content.slice(0, 20)}`}
              className={cn('terminal-line', `terminal-line-${line.type}`)}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: DURATION_SECONDS.fast,
                ease: EASING_FRAMER.standard,
              }}
            >
              {showLineNumbers && (
                <span className="terminal-line-number">{index + 1}</span>
              )}

              {showTimestamps && line.timestamp && (
                <span className="terminal-timestamp">
                  {formatTimestamp(line.timestamp)}
                </span>
              )}

              {line.type === 'command' && (
                <span className="terminal-prompt">{line.prompt || prompt}</span>
              )}

              <span className="terminal-line-content">
                {line.content}
                {line.isStreaming && <StreamingCursor />}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming indicator */}
        {isStreaming &&
          lines.length > 0 &&
          !lines[lines.length - 1]?.isStreaming && (
            <div className="terminal-line terminal-line-output">
              <StreamingCursor />
            </div>
          )}

        {/* Interactive input */}
        {interactive && (
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="terminal-prompt">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              aria-label="Terminal input"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// useTerminal Hook
// ============================================================================

export interface UseTerminalOptions {
  /** Initial lines */
  initialLines?: TerminalLine[]
  /** Maximum lines to keep */
  maxLines?: number
  /** Default theme */
  theme?: TerminalTheme
}

export interface UseTerminalReturn {
  /** Current lines */
  lines: TerminalLine[]
  /** Add a line */
  addLine: (line: Omit<TerminalLine, 'id'>) => void
  /** Add command line */
  addCommand: (content: string, prompt?: string) => void
  /** Add output line */
  addOutput: (content: string) => void
  /** Add error line */
  addError: (content: string) => void
  /** Add success line */
  addSuccess: (content: string) => void
  /** Clear all lines */
  clear: () => void
  /** Update last line (for streaming) */
  updateLastLine: (content: string) => void
  /** Set streaming state on last line */
  setStreaming: (isStreaming: boolean) => void
  /** Current theme */
  theme: TerminalTheme
  /** Set theme */
  setTheme: (theme: TerminalTheme) => void
}

export function useTerminal(
  options: UseTerminalOptions = {}
): UseTerminalReturn {
  const {
    initialLines = [],
    maxLines = 1000,
    theme: initialTheme = 'night-owl',
  } = options

  const [lines, setLines] = React.useState<TerminalLine[]>(initialLines)
  const [theme, setTheme] = React.useState<TerminalTheme>(initialTheme)
  const lineIdRef = React.useRef(0)

  const generateId = () => {
    lineIdRef.current += 1
    return `line-${lineIdRef.current}-${Date.now()}`
  }

  const addLine = React.useCallback(
    (line: Omit<TerminalLine, 'id'>) => {
      setLines((prev) => {
        const newLines = [
          ...prev,
          {
            ...line,
            id: generateId(),
            timestamp: line.timestamp || new Date(),
          },
        ]
        return newLines.slice(-maxLines)
      })
    },
    [maxLines]
  )

  const addCommand = React.useCallback(
    (content: string, prompt?: string) => {
      addLine({ type: 'command', content, prompt })
    },
    [addLine]
  )

  const addOutput = React.useCallback(
    (content: string) => {
      addLine({ type: 'output', content })
    },
    [addLine]
  )

  const addError = React.useCallback(
    (content: string) => {
      addLine({ type: 'error', content })
    },
    [addLine]
  )

  const addSuccess = React.useCallback(
    (content: string) => {
      addLine({ type: 'success', content })
    },
    [addLine]
  )

  const clear = React.useCallback(() => {
    setLines([])
  }, [])

  const updateLastLine = React.useCallback((content: string) => {
    setLines((prev) => {
      if (prev.length === 0) return prev
      const newLines = [...prev]
      newLines[newLines.length - 1] = {
        ...newLines[newLines.length - 1],
        content,
      }
      return newLines
    })
  }, [])

  const setStreaming = React.useCallback((isStreaming: boolean) => {
    setLines((prev) => {
      if (prev.length === 0) return prev
      const newLines = [...prev]
      newLines[newLines.length - 1] = {
        ...newLines[newLines.length - 1],
        isStreaming,
      }
      return newLines
    })
  }, [])

  return {
    lines,
    addLine,
    addCommand,
    addOutput,
    addError,
    addSuccess,
    clear,
    updateLastLine,
    setStreaming,
    theme,
    setTheme,
  }
}

export default Terminal
