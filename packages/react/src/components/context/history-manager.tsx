'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'
import { estimateTokens } from '../../utils/tokenization/estimator'

/**
 * Individual message in conversation history
 */
export interface HistoryMessage {
  /** Unique identifier for the message */
  id: string
  /** Role of the message sender */
  role: 'user' | 'assistant' | 'system'
  /** Message content */
  content: string
  /** Optional timestamp */
  timestamp?: Date
  /** Pre-calculated token count (if available) */
  tokenCount?: number
}

/**
 * Props for HistoryManager component
 */
export interface HistoryManagerProps {
  /** Array of messages in the conversation */
  messages: HistoryMessage[]
  /** Callback when messages are updated */
  onMessagesChange: (messages: HistoryMessage[]) => void
  /** Maximum tokens allowed */
  maxTokens?: number
  /** Current total token count (calculated if not provided) */
  currentTokens?: number
  /** Show token counts for each message */
  showTokenCounts?: boolean
  /** Allow bulk delete operations */
  allowBulkDelete?: boolean
  /** Allow selecting and deleting individual messages */
  allowIndividualDelete?: boolean
  /** Warning threshold percentage (default: 0.8) */
  warningThreshold?: number
  /** Critical threshold percentage (default: 0.95) */
  criticalThreshold?: number
  /** Custom CSS class */
  className?: string
  /** Compact mode for smaller displays */
  compact?: boolean
  /** Callback when messages are pruned */
  onPrune?: (prunedCount: number, tokensSaved: number) => void
}

/**
 * Props for message row subcomponent
 */
interface HistoryMessageRowProps {
  message: HistoryMessage
  tokenCount: number
  selected: boolean
  onSelect: (selected: boolean) => void
  onDelete: () => void
  compact?: boolean
  showTokenCount?: boolean
  /** Whether to show delete button (default: true) */
  showDeleteButton?: boolean
}

/**
 * Props for token usage bar subcomponent
 */
interface TokenUsageBarProps {
  current: number
  max: number
  warningThreshold: number
  criticalThreshold: number
}

/**
 * Props for history toolbar subcomponent
 */
interface HistoryToolbarProps {
  selectedCount: number
  totalCount: number
  onDeleteSelected: () => void
  onKeepLast: (count: number) => void
  onClear: () => void
  disabled?: boolean
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Get role display info
 */
function getRoleInfo(role: HistoryMessage['role']) {
  switch (role) {
    case 'user':
      return {
        label: 'User',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      }
    case 'assistant':
      return {
        label: 'AI',
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      }
    case 'system':
      return {
        label: 'System',
        color:
          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      }
  }
}

/**
 * Token Usage Bar Component
 *
 * Visual progress bar showing current token usage with color-coded thresholds.
 */
export function TokenUsageBar({
  current,
  max,
  warningThreshold,
  criticalThreshold,
}: TokenUsageBarProps) {
  // Guard against division by zero
  const safeMax = max > 0 ? max : 1
  const percentage = Math.min((current / safeMax) * 100, 100)
  // Ensure warning < critical for sensible behavior
  const effectiveWarning = Math.min(warningThreshold, criticalThreshold - 0.01)
  const isWarning = percentage >= effectiveWarning * 100
  const isCritical = percentage >= criticalThreshold * 100

  const getBarColor = () => {
    if (isCritical) return 'bg-red-500'
    if (isWarning) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTextColor = () => {
    if (isCritical) return 'text-red-600 dark:text-red-400'
    if (isWarning) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={cn('font-medium', getTextColor())}>
          {formatNumber(current)} / {formatNumber(max)} tokens
        </span>
        <span className={cn('font-mono', getTextColor())}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-200', getBarColor())}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {isCritical && (
        <p className="text-xs text-red-600 dark:text-red-400">
          ⚠️ Critical: Consider pruning old messages
        </p>
      )}
    </div>
  )
}

/**
 * History Message Row Component
 *
 * Individual message row with selection, delete, and token count display.
 */
export function HistoryMessageRow({
  message,
  tokenCount,
  selected,
  onSelect,
  onDelete,
  compact = false,
  showTokenCount = true,
  showDeleteButton = true,
}: HistoryMessageRowProps) {
  const roleInfo = getRoleInfo(message.role)
  const maxContentLength = compact ? 50 : 120

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border transition-colors',
        selected
          ? 'bg-accent border-accent-foreground/20'
          : 'bg-background border-border hover:bg-muted/50'
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelect(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        aria-label={`Select message from ${message.role}`}
      />

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {/* Role badge */}
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded',
              roleInfo.color
            )}
          >
            {roleInfo.label}
          </span>

          {/* Timestamp */}
          {message.timestamp && (
            <span className="text-xs text-muted-foreground">
              {(() => {
                // Handle both Date objects and ISO strings (from JSON)
                const date =
                  message.timestamp instanceof Date
                    ? message.timestamp
                    : new Date(message.timestamp)
                return isNaN(date.getTime()) ? '' : date.toLocaleTimeString()
              })()}
            </span>
          )}

          {/* Token count */}
          {showTokenCount && (
            <span className="text-xs text-muted-foreground font-mono">
              {formatNumber(tokenCount)} tokens
            </span>
          )}
        </div>

        {/* Content preview */}
        <p className="text-sm text-foreground break-words">
          {truncateText(message.content, maxContentLength)}
        </p>
      </div>

      {/* Delete button - only shown when allowed */}
      {showDeleteButton && (
        <button
          onClick={onDelete}
          className={cn(
            'p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            'opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity',
            'focus:outline-none focus:ring-2 focus:ring-destructive/50'
          )}
          aria-label={`Delete message from ${message.role}`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * History Toolbar Component
 *
 * Bulk action controls for managing conversation history.
 */
export function HistoryToolbar({
  selectedCount,
  totalCount,
  onDeleteSelected,
  onKeepLast,
  onClear,
  disabled = false,
}: HistoryToolbarProps) {
  const [showKeepLastOptions, setShowKeepLastOptions] = React.useState(false)
  const [showClearConfirm, setShowClearConfirm] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!showKeepLastOptions) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowKeepLastOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showKeepLastOptions])

  const keepLastOptions = [5, 10, 20, 50]

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border">
      {/* Selection count */}
      <span className="text-sm text-muted-foreground">
        {selectedCount} of {totalCount} selected
      </span>

      <div className="flex-1" />

      {/* Delete selected */}
      <button
        onClick={onDeleteSelected}
        disabled={disabled || selectedCount === 0}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-destructive/50'
        )}
      >
        Delete Selected ({selectedCount})
      </button>

      {/* Keep last N */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowKeepLastOptions(!showKeepLastOptions)}
          disabled={disabled}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-ring'
          )}
        >
          Keep Last...
        </button>

        {showKeepLastOptions && (
          <div className="absolute right-0 mt-1 py-1 bg-popover border border-border rounded-md shadow-lg z-10">
            {keepLastOptions.map((count) => (
              <button
                key={count}
                onClick={() => {
                  onKeepLast(count)
                  setShowKeepLastOptions(false)
                }}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-accent transition-colors"
              >
                Keep last {count} messages
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear all */}
      {showClearConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-destructive">Clear all?</span>
          <button
            onClick={() => {
              onClear()
              setShowClearConfirm(false)
            }}
            className="px-2 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Yes
          </button>
          <button
            onClick={() => setShowClearConfirm(false)}
            className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowClearConfirm(true)}
          disabled={disabled || totalCount === 0}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            'border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-destructive/50'
          )}
        >
          Clear All
        </button>
      )}
    </div>
  )
}

/**
 * Conversation History Manager Component
 *
 * A comprehensive UI component for managing conversation history with token awareness.
 * Allows users to view, select, and delete messages to control token usage.
 *
 * **Features:**
 * - Real-time token usage visualization
 * - Individual message deletion
 * - Bulk selection and deletion
 * - "Keep last N messages" quick action
 * - Token count per message
 * - Warning/critical thresholds
 * - Keyboard accessible
 * - Responsive design
 *
 * **Performance Notes:**
 * - Best for conversations under 200 messages
 * - For very long histories (500+), consider pagination or virtualization
 * - Each message requires unique `id` - duplicates cause undefined behavior
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [messages, setMessages] = useState<HistoryMessage[]>([
 *   { id: '1', role: 'user', content: 'Hello!' },
 *   { id: '2', role: 'assistant', content: 'Hi there!' },
 * ])
 *
 * <HistoryManager
 *   messages={messages}
 *   onMessagesChange={setMessages}
 *   maxTokens={4096}
 * />
 *
 * // With pruning callback and compact mode
 * <HistoryManager
 *   messages={messages}
 *   onMessagesChange={setMessages}
 *   maxTokens={4096}
 *   compact={true}
 *   onPrune={(count, tokens) => {
 *     console.log(`Pruned ${count} messages, saved ${tokens} tokens`)
 *   }}
 * />
 * ```
 */
export function HistoryManager({
  messages,
  onMessagesChange,
  maxTokens = 4096,
  currentTokens,
  showTokenCounts = true,
  allowBulkDelete = true,
  allowIndividualDelete = true,
  warningThreshold = 0.8,
  criticalThreshold = 0.95,
  className,
  compact = false,
  onPrune,
}: HistoryManagerProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Warn about duplicate IDs in development
  React.useEffect(() => {
    if (process.env['NODE_ENV'] === 'development') {
      const ids = messages.map((m) => m.id)
      const uniqueIds = new Set(ids)
      if (uniqueIds.size !== ids.length) {
        const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
        console.warn(
          `[HistoryManager] Duplicate message IDs detected: ${[...new Set(duplicates)].join(', ')}. ` +
            'Each message must have a unique id for correct behavior.'
        )
      }
    }
  }, [messages])

  // Clean up stale selectedIds when messages change externally
  React.useEffect(() => {
    const currentIds = new Set(messages.map((m) => m.id))
    setSelectedIds((prev) => {
      const hasStale = [...prev].some((id) => !currentIds.has(id))
      if (!hasStale) return prev // No change needed
      return new Set([...prev].filter((id) => currentIds.has(id)))
    })
  }, [messages])

  // Calculate token counts for each message
  const messageTokenCounts = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const message of messages) {
      const count = message.tokenCount ?? estimateTokens(message.content)
      counts.set(message.id, count)
    }
    return counts
  }, [messages])

  // Calculate total tokens
  const totalTokens = React.useMemo(() => {
    if (currentTokens !== undefined) return currentTokens
    let total = 0
    for (const count of messageTokenCounts.values()) {
      total += count
    }
    return total
  }, [messageTokenCounts, currentTokens])

  // Handle individual selection
  const handleSelect = React.useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  // Handle individual delete
  const handleDelete = React.useCallback(
    (id: string) => {
      const tokensSaved = messageTokenCounts.get(id) ?? 0
      const newMessages = messages.filter((m) => m.id !== id)
      onMessagesChange(newMessages)
      onPrune?.(1, tokensSaved)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    },
    [messages, messageTokenCounts, onMessagesChange, onPrune]
  )

  // Handle bulk delete selected
  const handleDeleteSelected = React.useCallback(() => {
    if (selectedIds.size === 0) return

    let tokensSaved = 0
    const newMessages = messages.filter((m) => {
      if (selectedIds.has(m.id)) {
        tokensSaved += messageTokenCounts.get(m.id) ?? 0
        return false
      }
      return true
    })

    onMessagesChange(newMessages)
    onPrune?.(selectedIds.size, tokensSaved)
    setSelectedIds(new Set())
  }, [messages, selectedIds, messageTokenCounts, onMessagesChange, onPrune])

  // Handle keep last N messages
  const handleKeepLast = React.useCallback(
    (count: number) => {
      if (messages.length <= count) return

      const removedCount = messages.length - count
      let tokensSaved = 0

      // Calculate tokens being removed
      for (let i = 0; i < removedCount; i++) {
        const msg = messages[i]
        if (msg) {
          tokensSaved += messageTokenCounts.get(msg.id) ?? 0
        }
      }

      const newMessages = messages.slice(-count)
      onMessagesChange(newMessages)
      onPrune?.(removedCount, tokensSaved)
      setSelectedIds(new Set())
    },
    [messages, messageTokenCounts, onMessagesChange, onPrune]
  )

  // Handle clear all
  const handleClear = React.useCallback(() => {
    onMessagesChange([])
    onPrune?.(messages.length, totalTokens)
    setSelectedIds(new Set())
  }, [messages.length, totalTokens, onMessagesChange, onPrune])

  // Select all / deselect all
  const handleSelectAll = React.useCallback(() => {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)))
    }
  }, [messages, selectedIds.size])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Token usage bar */}
      <TokenUsageBar
        current={totalTokens}
        max={maxTokens}
        warningThreshold={warningThreshold}
        criticalThreshold={criticalThreshold}
      />

      {/* Toolbar */}
      {allowBulkDelete && (
        <HistoryToolbar
          selectedCount={selectedIds.size}
          totalCount={messages.length}
          onDeleteSelected={handleDeleteSelected}
          onKeepLast={handleKeepLast}
          onClear={handleClear}
          disabled={messages.length === 0}
        />
      )}

      {/* Select all checkbox */}
      {allowBulkDelete && messages.length > 0 && (
        <div className="flex items-center gap-2 px-3">
          <input
            type="checkbox"
            checked={
              selectedIds.size === messages.length && messages.length > 0
            }
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            aria-label="Select all messages"
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>
      )}

      {/* Message list */}
      <div className="space-y-2" role="list" aria-label="Conversation history">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No messages in history</p>
          </div>
        ) : (
          messages.map((message) => (
            <HistoryMessageRow
              key={message.id}
              message={message}
              tokenCount={messageTokenCounts.get(message.id) ?? 0}
              selected={selectedIds.has(message.id)}
              onSelect={(selected) => handleSelect(message.id, selected)}
              onDelete={() => handleDelete(message.id)}
              compact={compact}
              showTokenCount={showTokenCounts}
              showDeleteButton={allowIndividualDelete}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {messages.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {messages.length} message{messages.length !== 1 ? 's' : ''} •{' '}
          {formatNumber(totalTokens)} total tokens
        </div>
      )}
    </div>
  )
}

export default HistoryManager
