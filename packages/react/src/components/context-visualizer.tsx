import * as React from 'react'

/**
 * Message for context visualization
 */
export interface ContextMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number
  timestamp?: number
  /** Whether this message is included in context */
  isIncluded: boolean
  /** Reason for exclusion if not included */
  exclusionReason?: 'token_limit' | 'pruned' | 'too_old' | 'manual'
}

/**
 * Context visualizer props
 */
export interface ContextVisualizerProps {
  /** All messages in conversation */
  messages: ContextMessage[]
  
  /** Maximum tokens for context */
  maxTokens: number
  
  /** Current token count */
  currentTokens: number
  
  /** Show token counts for each message */
  showTokens?: boolean
  
  /** Highlight included messages */
  highlightIncluded?: boolean
  
  /** Callback when prune is requested */
  onPrune?: (messageIds: string[]) => void
  
  /** Callback when message is toggled */
  onToggleMessage?: (messageId: string, include: boolean) => void
  
  /** Show prune suggestions */
  showPruneSuggestions?: boolean
  
  /** View mode */
  viewMode?: 'compact' | 'detailed'
  
  /** Custom CSS class */
  className?: string
}

/**
 * Get exclusion reason label
 */
function getExclusionLabel(reason?: string): string {
  switch (reason) {
    case 'token_limit':
      return 'Excluded: Token limit'
    case 'pruned':
      return 'Pruned by user'
    case 'too_old':
      return 'Too old'
    case 'manual':
      return 'Manually excluded'
    default:
      return 'Excluded'
  }
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

/**
 * Production-ready Context Visualizer component.
 * 
 * **Features:**
 * - Visual display of included/excluded messages
 * - Token counts per message
 * - Exclusion reasons
 * - Manual message inclusion toggle
 * - Prune suggestions
 * - Compact and detailed view modes
 * - Token usage progress bar
 * 
 * **Use Cases:**
 * - Show users what AI "sees" in context
 * - Help debug context issues
 * - Allow manual context control
 * - Visualize token usage per message
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 * />
 * 
 * // With pruning
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={7500}
 *   showPruneSuggestions={true}
 *   onPrune={(ids) => {
 *     ids.forEach(id => deleteMessage(id))
 *   }}
 * />
 * 
 * // With manual control
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 *   onToggleMessage={(id, include) => {
 *     updateMessageInclusion(id, include)
 *   }}
 * />
 * 
 * // Detailed view with tokens
 * <ContextVisualizer
 *   messages={messages}
 *   maxTokens={8192}
 *   currentTokens={6200}
 *   viewMode="detailed"
 *   showTokens={true}
 *   highlightIncluded={true}
 * />
 * ```
 */
export function ContextVisualizer({
  messages,
  maxTokens,
  currentTokens,
  showTokens = true,
  highlightIncluded = true,
  onPrune,
  onToggleMessage,
  showPruneSuggestions = false,
  viewMode = 'compact',
  className = '',
}: ContextVisualizerProps) {
  const includedMessages = messages.filter((m) => m.isIncluded)
  const excludedMessages = messages.filter((m) => !m.isIncluded)
  const percentage = Math.min((currentTokens / maxTokens) * 100, 100)
  const isNearLimit = percentage >= 80

  // Find messages to suggest pruning (oldest excluded)
  const pruneSuggestions = React.useMemo(() => {
    return excludedMessages
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .slice(0, 5)
  }, [excludedMessages])

  const handlePruneAll = () => {
    if (pruneSuggestions.length > 0) {
      onPrune?.(pruneSuggestions.map((m) => m.id))
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
      role="region"
      aria-label="Context window visualization"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Context Window
          </h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {includedMessages.length} of {messages.length} messages
        </div>
      </div>

      {/* Token usage bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Token Usage</span>
          <span className={`font-medium ${isNearLimit ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
        </div>
        
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentage >= 95
                ? 'bg-red-500'
                : percentage >= 80
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={currentTokens}
            aria-valuemin={0}
            aria-valuemax={maxTokens}
          />
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-500">
          {percentage.toFixed(1)}% of context window used
        </div>
      </div>

      {/* Messages list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg border transition-all ${
              message.isIncluded
                ? highlightIncluded
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              {/* Message info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {/* Role badge */}
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      message.role === 'user'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : message.role === 'assistant'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}
                  >
                    {message.role}
                  </span>

                  {/* Token count */}
                  {showTokens && message.tokens && (
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {message.tokens} tokens
                    </span>
                  )}

                  {/* Timestamp */}
                  {message.timestamp && (
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  )}

                  {/* Inclusion status */}
                  {message.isIncluded ? (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Included
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {getExclusionLabel(message.exclusionReason)}
                    </span>
                  )}
                </div>

                {/* Content preview */}
                {viewMode === 'detailed' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Toggle button */}
              {onToggleMessage && (
                <button
                  onClick={() => onToggleMessage(message.id, !message.isIncluded)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    message.isIncluded
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                  }`}
                  aria-label={message.isIncluded ? 'Exclude message' : 'Include message'}
                >
                  {message.isIncluded ? 'Exclude' : 'Include'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prune suggestions */}
      {showPruneSuggestions && pruneSuggestions.length > 0 && onPrune && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Consider pruning old messages
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                {pruneSuggestions.length} old messages are excluded from context. You can
                permanently delete them to clean up.
              </p>
              <button
                onClick={handlePruneAll}
                className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
              >
                Prune {pruneSuggestions.length} messages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="flex gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {includedMessages.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Included</div>
        </div>
        
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">
            {excludedMessages.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Excluded</div>
        </div>
        
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentTokens}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Tokens</div>
        </div>
      </div>
    </div>
  )
}
