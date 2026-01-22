'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

interface StateInspectorProps {
  state?: Record<string, any>
  events?: Array<{ name: string; timestamp: number; data?: any }>
  className?: string
}

export function PlaygroundStateInspector({
  state = {},
  events = [],
  className,
}: StateInspectorProps) {
  const [expanded, setExpanded] = useState(true)
  const [showEvents, setShowEvents] = useState(false)

  const formatValue = (value: any): string => {
    if (typeof value === 'function') return '[Function]'
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  return (
    <div className={clsx('border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-purple-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-50">
            🔍 State Inspector
          </span>
        </div>
        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium">
          {Object.keys(state).length} properties
        </span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="bg-white dark:bg-gray-950">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowEvents(false)}
              className={clsx(
                'flex-1 px-4 py-2 text-sm font-medium transition-colors border-b-2',
                !showEvents
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              State
            </button>
            <button
              onClick={() => setShowEvents(true)}
              className={clsx(
                'flex-1 px-4 py-2 text-sm font-medium transition-colors border-b-2',
                showEvents
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              Events ({events.length})
            </button>
          </div>

          {/* State View */}
          {!showEvents && (
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {Object.keys(state).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">
                  No state to display
                </p>
              ) : (
                Object.entries(state).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono font-semibold text-purple-600 dark:text-purple-400">
                          {key}
                        </code>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({typeof value})
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                        {formatValue(value)}
                      </pre>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Events View */}
          {showEvents && (
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">
                  No events recorded yet. Interact with the component!
                </p>
              ) : (
                events.slice().reverse().map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {event.name}
                        </code>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {event.data && (
                        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all mt-2">
                          {formatValue(event.data)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
