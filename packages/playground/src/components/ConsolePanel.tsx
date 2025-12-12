/**
 * Console Panel Component
 *
 * Displays console output from the preview iframe.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Terminal,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react'
import type { ConsoleLogEntry } from '../types'

interface ConsolePanelProps {
  entries: ConsoleLogEntry[]
  onClear: () => void
  maxHeight?: string
  className?: string
}

const levelIcons = {
  log: Terminal,
  info: Info,
  warn: AlertTriangle,
  error: AlertCircle,
}

const levelColors = {
  log: 'text-gray-600 dark:text-gray-400',
  info: 'text-blue-600 dark:text-blue-400',
  warn: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
}

const levelBgColors = {
  log: 'bg-gray-50 dark:bg-gray-800/50',
  info: 'bg-blue-50 dark:bg-blue-900/20',
  warn: 'bg-yellow-50 dark:bg-yellow-900/20',
  error: 'bg-red-50 dark:bg-red-900/20',
}

export function ConsolePanel({
  entries,
  onClear,
  maxHeight = '200px',
  className = '',
}: ConsolePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [filter, setFilter] = useState<
    'all' | 'log' | 'info' | 'warn' | 'error'
  >('all')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries, autoScroll])

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      // Consider "at bottom" if within 50px
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setAutoScroll(isAtBottom)
    }
  }, [])

  const filteredEntries = entries.filter(
    (entry) => filter === 'all' || entry.level === filter
  )

  const counts = {
    all: entries.length,
    log: entries.filter((e) => e.level === 'log').length,
    info: entries.filter((e) => e.level === 'info').length,
    warn: entries.filter((e) => e.level === 'warn').length,
    error: entries.filter((e) => e.level === 'error').length,
  }

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand console' : 'Collapse console'}
        >
          <Terminal className="w-4 h-4" aria-hidden="true" />
          <span>Console</span>
          {counts.all > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
              {counts.all}
            </span>
          )}
          {counts.error > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
              {counts.error} error{counts.error !== 1 ? 's' : ''}
            </span>
          )}
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* Filter buttons */}
          {!isCollapsed && (
            <div className="flex items-center gap-1 mr-2">
              {(['all', 'log', 'info', 'warn', 'error'] as const).map(
                (level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      filter === level
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    aria-pressed={filter === level}
                  >
                    {level === 'all'
                      ? 'All'
                      : level.charAt(0).toUpperCase() + level.slice(1)}
                    {counts[level] > 0 && ` (${counts[level]})`}
                  </button>
                )
              )}
            </div>
          )}

          <button
            onClick={onClear}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Clear console"
            aria-label="Clear console"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto font-mono text-sm"
          style={{ maxHeight }}
          role="log"
          aria-live="polite"
          aria-label="Console output"
        >
          {filteredEntries.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              {entries.length === 0
                ? 'No console output yet. Run code to see logs here.'
                : `No ${filter} messages.`}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = levelIcons[entry.level]
              return (
                <div
                  key={entry.id}
                  className={`flex items-start gap-2 px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${levelBgColors[entry.level]}`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${levelColors[entry.level]}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <pre
                      className={`whitespace-pre-wrap break-words ${levelColors[entry.level]}`}
                    >
                      {entry.message}
                      {entry.args && entry.args.length > 0 && (
                        <span className="text-gray-500">
                          {entry.args.map((arg, i) => (
                            <span key={i}> {formatValue(arg)}</span>
                          ))}
                        </span>
                      )}
                    </pre>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {entry.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default ConsolePanel
