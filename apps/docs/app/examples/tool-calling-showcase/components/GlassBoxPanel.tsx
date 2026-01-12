'use client'

/**
 * GlassBoxPanel Component
 *
 * Debug panel that shows the AI's "thought process" in real-time.
 * Displays tool calls, results, and events with color coding.
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Filter,
  Trash2,
  User,
  Bot,
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  Eye,
  type LucideIcon,
} from 'lucide-react'
import type { DebugEvent, DebugEventType } from '../lib/types'

interface GlassBoxPanelProps {
  events: DebugEvent[]
  isExpanded: boolean
  onToggle: () => void
  onClear?: () => void
  maxEvents?: number
  filterTypes?: DebugEventType[]
}

const eventConfig: Record<
  DebugEventType,
  { icon: LucideIcon; color: string; label: string; bgColor: string }
> = {
  USER_MESSAGE: {
    icon: User,
    color: 'text-blue-600 dark:text-blue-400',
    label: 'User Message',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  ASSISTANT_THINKING: {
    icon: Bot,
    color: 'text-purple-600 dark:text-purple-400',
    label: 'AI Thinking',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
  ASSISTANT_MESSAGE: {
    icon: Bot,
    color: 'text-indigo-600 dark:text-indigo-400',
    label: 'AI Response',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
  },
  TOOL_CALL: {
    icon: Wrench,
    color: 'text-amber-600 dark:text-amber-400',
    label: 'Tool Call',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  TOOL_RESULT: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    label: 'Tool Result',
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
  TOOL_ERROR: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    label: 'Tool Error',
    bgColor: 'bg-red-500/10 border-red-500/20',
  },
  AWAITING_APPROVAL: {
    icon: Pause,
    color: 'text-orange-600 dark:text-orange-400',
    label: 'Awaiting Approval',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
  },
  APPROVAL_GRANTED: {
    icon: Check,
    color: 'text-green-600 dark:text-green-400',
    label: 'Approved',
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
  APPROVAL_DENIED: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    label: 'Denied',
    bgColor: 'bg-red-500/10 border-red-500/20',
  },
  STREAM_START: {
    icon: Play,
    color: 'text-cyan-600 dark:text-cyan-400',
    label: 'Stream Start',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
  },
  STREAM_END: {
    icon: Clock,
    color: 'text-gray-600 dark:text-gray-400',
    label: 'Stream End',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
  },
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function formatJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function EventItem({ event, index }: { event: DebugEvent; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const config = eventConfig[event.type]
  const Icon = config.icon

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatJson(event.payload))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`rounded-lg border ${config.bgColor} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className="text-xs font-mono text-muted-foreground">
          {formatTimestamp(event.timestamp)}
        </span>
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        {event.toolName && (
          <span className="text-xs px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded">
            {event.toolName}
          </span>
        )}
        {event.duration !== undefined && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            {formatDuration(event.duration)}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">
              <div className="relative">
                <pre className="text-[10px] font-mono bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto max-h-40">
                  <code>{formatJson(event.payload)}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-1 right-1 p-1 rounded bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function GlassBoxPanel({
  events,
  isExpanded,
  onToggle,
  onClear,
  maxEvents = 50,
  filterTypes,
}: GlassBoxPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeFilters, setActiveFilters] = useState<Set<DebugEventType>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [events.length, isExpanded])

  // Filter events
  const filteredEvents = useMemo(() => {
    let result = events
    if (activeFilters.size > 0) {
      result = result.filter((e) => activeFilters.has(e.type))
    }
    if (filterTypes) {
      result = result.filter((e) => filterTypes.includes(e.type))
    }
    return result.slice(-maxEvents)
  }, [events, activeFilters, filterTypes, maxEvents])

  const toggleFilter = (type: DebugEventType) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setActiveFilters(newFilters)
  }

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? 'auto' : 48,
        maxHeight: isExpanded ? 500 : 48,
      }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 flex items-center justify-center text-white">
            <Bug className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm flex items-center gap-2">
              Glass Box Debug
              {events.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                  {filteredEvents.length} events
                </span>
              )}
            </div>
            {!isExpanded && events.length > 0 && (
              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                Latest: {eventConfig[events[events.length - 1].type].label}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFilters(!showFilters)
                }}
                className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  activeFilters.size > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                }`}
                title="Filter events"
              >
                <Filter className="w-4 h-4" />
              </button>
              {onClear && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                  }}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-muted-foreground transition-colors"
                  title="Clear events"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <AnimatePresence>
        {isExpanded && showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-2 flex flex-wrap gap-1">
              {Object.entries(eventConfig).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => toggleFilter(type as DebugEventType)}
                  className={`px-2 py-1 text-[10px] rounded-full border transition-all ${
                    activeFilters.size === 0 || activeFilters.has(type as DebugEventType)
                      ? `${config.bgColor} ${config.color}`
                      : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground opacity-50'
                  }`}
                >
                  {config.label}
                </button>
              ))}
              {activeFilters.size > 0 && (
                <button
                  onClick={() => setActiveFilters(new Set())}
                  className="px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={scrollRef}
            className="px-3 pb-3 space-y-2 overflow-y-auto max-h-[350px] border-t border-gray-200 dark:border-gray-700 pt-3"
          >
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No events yet</p>
                <p className="text-xs mt-1">Start a conversation to see the AI's thought process</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <EventItem key={event.id} event={event} index={index} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

GlassBoxPanel.displayName = 'GlassBoxPanel'
