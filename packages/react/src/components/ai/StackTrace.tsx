'use client'

/**
 * StackTrace Component
 *
 * A component for displaying error stack traces with syntax highlighting
 * and collapsible frames.
 *
 * Features:
 * - Night Owl theme (default)
 * - Collapsible stack frames
 * - File path highlighting
 * - Line number links
 * - Error message display
 * - Framework/library frame detection
 * - Copy functionality
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <StackTrace
 *   error={{
 *     name: 'TypeError',
 *     message: 'Cannot read property "foo" of undefined',
 *     stack: `TypeError: Cannot read property...
 *       at Object.<anonymous> (/app/src/index.ts:42:15)
 *       at Module._compile (node:internal/modules/cjs/loader:1105:14)`,
 *   }}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type StackTraceTheme = 'night-owl' | 'github-dark' | 'light'

export interface StackFrame {
  /** Function/method name */
  functionName?: string
  /** File path */
  fileName?: string
  /** Line number */
  lineNumber?: number
  /** Column number */
  columnNumber?: number
  /** Whether this is from node_modules/framework */
  isExternal?: boolean
  /** Raw frame string */
  raw: string
}

export interface ParsedError {
  /** Error name/type */
  name: string
  /** Error message */
  message: string
  /** Stack frames */
  frames: StackFrame[]
  /** Raw stack string */
  rawStack?: string
}

export interface StackTraceProps {
  /** Error object or parsed error */
  error: Error | ParsedError | string
  /** Theme preset */
  theme?: StackTraceTheme
  /** Maximum frames to show initially */
  maxFrames?: number
  /** Show external/framework frames */
  showExternalFrames?: boolean
  /** Collapse external frames by default */
  collapseExternal?: boolean
  /** Show copy button */
  showCopy?: boolean
  /** Show raw stack toggle */
  showRaw?: boolean
  /** File click handler */
  onFileClick?: (frame: StackFrame) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Theme Configurations
// ============================================================================

const themes: Record<StackTraceTheme, {
  background: string
  foreground: string
  errorName: string
  errorMessage: string
  functionName: string
  fileName: string
  lineNumber: string
  external: string
  border: string
  frameBg: string
  frameHover: string
}> = {
  'night-owl': {
    background: '#011627',
    foreground: '#d6deeb',
    errorName: '#ef5350',
    errorMessage: '#ffcb6b',
    functionName: '#82aaff',
    fileName: '#c792ea',
    lineNumber: '#7fdbca',
    external: '#637777',
    border: '#1d3b53',
    frameBg: '#0b2942',
    frameHover: '#1d3b53',
  },
  'github-dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    errorName: '#f85149',
    errorMessage: '#d29922',
    functionName: '#79c0ff',
    fileName: '#d2a8ff',
    lineNumber: '#7ee787',
    external: '#8b949e',
    border: '#30363d',
    frameBg: '#161b22',
    frameHover: '#21262d',
  },
  'light': {
    background: '#ffffff',
    foreground: '#24292f',
    errorName: '#cf222e',
    errorMessage: '#9a6700',
    functionName: '#0550ae',
    fileName: '#8250df',
    lineNumber: '#1a7f37',
    external: '#6e7781',
    border: '#d0d7de',
    frameBg: '#f6f8fa',
    frameHover: '#eaeef2',
  },
}

// ============================================================================
// Helper Functions
// ============================================================================

function parseStackTrace(error: Error | ParsedError | string): ParsedError {
  if (typeof error === 'string') {
    const lines = error.split('\n')
    const firstLine = lines[0] || ''
    const colonIndex = firstLine.indexOf(':')
    return {
      name: colonIndex > 0 ? firstLine.substring(0, colonIndex) : 'Error',
      message: colonIndex > 0 ? firstLine.substring(colonIndex + 1).trim() : firstLine,
      frames: parseFrames(lines.slice(1)),
      rawStack: error,
    }
  }

  if ('frames' in error) {
    return error
  }

  const stack = error.stack || ''
  const lines = stack.split('\n')

  return {
    name: error.name,
    message: error.message,
    frames: parseFrames(lines.slice(1)),
    rawStack: stack,
  }
}

function parseFrames(lines: string[]): StackFrame[] {
  return lines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('at ')) {
        return null
      }

      const raw = trimmed

      // Parse "at functionName (file:line:col)" or "at file:line:col"
      const atMatch = trimmed.match(/^at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/)
      if (atMatch) {
        return {
          functionName: atMatch[1],
          fileName: atMatch[2],
          lineNumber: parseInt(atMatch[3], 10),
          columnNumber: parseInt(atMatch[4], 10),
          isExternal: isExternalFrame(atMatch[2]),
          raw,
        }
      }

      const simpleMatch = trimmed.match(/^at\s+(.+?):(\d+):(\d+)$/)
      if (simpleMatch) {
        return {
          fileName: simpleMatch[1],
          lineNumber: parseInt(simpleMatch[2], 10),
          columnNumber: parseInt(simpleMatch[3], 10),
          isExternal: isExternalFrame(simpleMatch[1]),
          raw,
        }
      }

      const funcOnlyMatch = trimmed.match(/^at\s+(.+)$/)
      if (funcOnlyMatch) {
        return {
          functionName: funcOnlyMatch[1],
          isExternal: false,
          raw,
        }
      }

      return { raw, isExternal: false }
    })
    .filter((frame): frame is StackFrame => frame !== null)
}

function isExternalFrame(fileName: string): boolean {
  return (
    fileName.includes('node_modules') ||
    fileName.includes('node:internal') ||
    fileName.includes('webpack') ||
    fileName.includes('turbopack') ||
    fileName.includes('<anonymous>')
  )
}

function getShortFileName(fileName?: string): string {
  if (!fileName) return ''
  // Get last part of path
  const parts = fileName.split('/')
  return parts[parts.length - 1] || fileName
}

// ============================================================================
// StackFrame Component
// ============================================================================

interface StackFrameItemProps {
  frame: StackFrame
  index: number
  theme: StackTraceTheme
  isExpanded: boolean
  onFileClick?: (frame: StackFrame) => void
}

function StackFrameItem({
  frame,
  index,
  theme,
  isExpanded,
  onFileClick,
}: StackFrameItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const themeConfig = themes[theme]

  const handleClick = () => {
    if (frame.fileName && frame.lineNumber && onFileClick) {
      onFileClick(frame)
    }
  }

  return (
    <motion.div
      className={cn(
        'stack-frame',
        frame.isExternal && 'stack-frame-external'
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        delay: prefersReducedMotion ? 0 : index * 0.02,
      }}
      onClick={handleClick}
      role={onFileClick && frame.fileName ? 'button' : undefined}
      tabIndex={onFileClick && frame.fileName ? 0 : undefined}
      style={{
        cursor: onFileClick && frame.fileName ? 'pointer' : 'default',
      }}
    >
      <span className="stack-frame-index">{index + 1}</span>

      <div className="stack-frame-content">
        {frame.functionName && (
          <span
            className="stack-frame-function"
            style={{ color: frame.isExternal ? themeConfig.external : themeConfig.functionName }}
          >
            {frame.functionName}
          </span>
        )}

        {frame.fileName && (
          <span className="stack-frame-location">
            <span
              className="stack-frame-file"
              style={{ color: frame.isExternal ? themeConfig.external : themeConfig.fileName }}
            >
              {getShortFileName(frame.fileName)}
            </span>
            {frame.lineNumber && (
              <span
                className="stack-frame-line"
                style={{ color: themeConfig.lineNumber }}
              >
                :{frame.lineNumber}
                {frame.columnNumber && `:${frame.columnNumber}`}
              </span>
            )}
          </span>
        )}

        {!frame.functionName && !frame.fileName && (
          <span style={{ color: themeConfig.external }}>{frame.raw}</span>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// StackTrace Component
// ============================================================================

export function StackTrace({
  error,
  theme = 'night-owl',
  maxFrames = 10,
  showExternalFrames = true,
  collapseExternal = true,
  showCopy = true,
  showRaw = false,
  onFileClick,
  className,
}: StackTraceProps) {
  const prefersReducedMotion = useReducedMotion()
  const themeConfig = themes[theme]
  const [showAllFrames, setShowAllFrames] = React.useState(false)
  const [showExternal, setShowExternal] = React.useState(!collapseExternal)
  const [showRawStack, setShowRawStack] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const parsed = React.useMemo(() => parseStackTrace(error), [error])

  const visibleFrames = React.useMemo(() => {
    let frames = parsed.frames

    if (!showExternalFrames || !showExternal) {
      frames = frames.filter((f) => !f.isExternal)
    }

    if (!showAllFrames && frames.length > maxFrames) {
      frames = frames.slice(0, maxFrames)
    }

    return frames
  }, [parsed.frames, showExternalFrames, showExternal, showAllFrames, maxFrames])

  const hiddenCount = React.useMemo(() => {
    const total = showExternal ? parsed.frames.length : parsed.frames.filter((f) => !f.isExternal).length
    return Math.max(0, total - visibleFrames.length)
  }, [parsed.frames, showExternal, visibleFrames.length])

  const externalCount = parsed.frames.filter((f) => f.isExternal).length

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parsed.rawStack || `${parsed.name}: ${parsed.message}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.div
      className={cn('stack-trace', `stack-trace-${theme}`, className)}
      style={{
        '--stack-bg': themeConfig.background,
        '--stack-fg': themeConfig.foreground,
        '--stack-border': themeConfig.border,
        '--stack-frame-bg': themeConfig.frameBg,
        '--stack-frame-hover': themeConfig.frameHover,
      } as React.CSSProperties}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="alert"
      aria-label="Error stack trace"
    >
      {/* Header */}
      <div className="stack-trace-header">
        <div className="stack-trace-error">
          <span className="stack-trace-name" style={{ color: themeConfig.errorName }}>
            {parsed.name}
          </span>
          <span className="stack-trace-message" style={{ color: themeConfig.errorMessage }}>
            {parsed.message}
          </span>
        </div>

        <div className="stack-trace-actions">
          {showRaw && (
            <button
              type="button"
              className="stack-trace-action"
              onClick={() => setShowRawStack(!showRawStack)}
            >
              {showRawStack ? 'Formatted' : 'Raw'}
            </button>
          )}
          {showCopy && (
            <button
              type="button"
              className={cn('stack-trace-action', copied && 'stack-trace-action-success')}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {/* Frames or Raw */}
      {showRawStack ? (
        <pre className="stack-trace-raw">{parsed.rawStack}</pre>
      ) : (
        <div className="stack-trace-frames">
          <AnimatePresence mode="popLayout">
            {visibleFrames.map((frame, index) => (
              <StackFrameItem
                key={`${frame.raw}-${index}`}
                frame={frame}
                index={index}
                theme={theme}
                isExpanded={showAllFrames}
                onFileClick={onFileClick}
              />
            ))}
          </AnimatePresence>

          {/* Show more */}
          {hiddenCount > 0 && (
            <button
              type="button"
              className="stack-trace-show-more"
              onClick={() => setShowAllFrames(true)}
            >
              Show {hiddenCount} more frame{hiddenCount > 1 ? 's' : ''}
            </button>
          )}

          {/* Toggle external */}
          {showExternalFrames && externalCount > 0 && collapseExternal && (
            <button
              type="button"
              className="stack-trace-toggle-external"
              onClick={() => setShowExternal(!showExternal)}
            >
              {showExternal ? 'Hide' : 'Show'} {externalCount} framework frame{externalCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default StackTrace
