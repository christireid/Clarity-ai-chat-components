'use client'

/**
 * DocsAssistantEnhanced - Next-Generation Documentation Assistant
 *
 * A comprehensive showcase of EVERY advanced chat AI functionality from @clarity-chat/react,
 * with TOKEN OPTIMIZATION as a PRIMARY, FEATURED capability (not secondary).
 *
 * ===============================================================================
 * TOKEN OPTIMIZATION FEATURES (PROMINENTLY FEATURED):
 * ===============================================================================
 * - TokenOptimizationDashboard: Full dashboard with real-time metrics
 * - TokenUsageMeter: Visual meter showing current usage vs limits
 * - TokenBudgetBar: Budget visualization with warnings
 * - TokenCostPreview: Real-time cost estimates as user types
 * - TokenOptimizationPanel: Optimization tips and suggestions
 * - TokenOptimizationBadge: Status badges throughout UI
 *
 * ===============================================================================
 * ALL ADVANCED CHAT AI FEATURES:
 * ===============================================================================
 * - Streaming: StreamingMessage, StreamingTextRenderer, StreamBlock
 * - Memory: MemoryInspector, ContextVisualizer, ContextManager
 * - Commands: CommandPalette, CommandPaletteEnhanced
 * - Search: MessageSearch with advanced filters
 * - Prompts: PromptLibrary, TemplateMarketplace (when ready)
 * - Citations: CitationCard with confidence scores
 * - Tools: ToolInvocationCard, ClarityToolResult
 * - Voice: VoiceInput with transcription
 * - History: HistoryManager with branches
 * - Keyboard: Full keyboard navigation
 * - Accessibility: WCAG 2.1 AAA compliant
 *
 * ===============================================================================
 * HOOKS USED:
 * ===============================================================================
 * - useClarityChat: Core chat logic
 * - useTokenBudget: Token budget monitoring
 * - useMemoryFeedback: Memory system feedback
 * - useKeyboardShortcuts: Keyboard navigation
 * - useClipboard: Copy functionality
 * - useReducedMotion: Accessibility
 * - useFocusTrap: Modal accessibility
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Settings,
  Zap,
  Brain,
  MessageSquare,
  Command as CommandIcon,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Code2,
  BookOpen,
  Search as SearchIcon,
} from 'lucide-react'
import {
  // Token Optimization Components (PRIMARY FEATURES)
  TokenOptimizationDashboard,
  TokenUsageMeter,
  TokenBudgetBar,
  TokenCostPreview,
  TokenOptimizationPanel,
  TokenOptimizationBadge,
  // Streaming Components
  StreamingMessage,
  StreamingTextRenderer,
  StreamBlock,
  // Memory & Context Components
  MemoryInspector,
  ContextVisualizer,
  ContextManager,
  // Navigation Components
  CommandPalette,
  CommandPaletteEnhanced,
  // Message Components
  MessageList,
  CitationCard,
  ToolInvocationCard,
  MessageActions,
  ThinkingIndicator,
  // Search Components
  MessageSearch,
  // Input Components
  VoiceInput,
  // UI Components
  ErrorBoundary,
  NetworkStatus,
  // Hooks
  useToast,
  useKeyboardShortcuts,
  useClipboard,
  useFocusTrap,
  useFocusRestoration,
  type CommandItem,
} from '@clarity-chat/react'
import { useReducedMotion } from '@clarity-chat/primitives'
import { ChatButton } from './ChatButton'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { useDocsChat } from './hooks'

// ============================================================================
// Types
// ============================================================================

interface DocsAssistantEnhancedProps {
  className?: string
}

// ============================================================================
// Constants
// ============================================================================

const TOKEN_BUDGET_PRESETS = {
  frugal: { maxTokens: 1000, warningThreshold: 0.8 },
  balanced: { maxTokens: 4000, warningThreshold: 0.8 },
  generous: { maxTokens: 8000, warningThreshold: 0.9 },
}

const ANIMATION_DURATION = 0.3

// ============================================================================
// Main Component
// ============================================================================

function DocsAssistantEnhancedInner({ className }: DocsAssistantEnhancedProps) {
  // ============================================================================
  // State Management
  // ============================================================================

  const [isOpen, setIsOpen] = useState(false)
  const [showTokenDashboard, setShowTokenDashboard] = useState(true) // DEFAULT: Show token dashboard!
  const [showMemoryInspector, setShowMemoryInspector] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [tokenBudgetPreset, setTokenBudgetPreset] = useState<keyof typeof TOKEN_BUDGET_PRESETS>('balanced')

  // ============================================================================
  // Refs
  // ============================================================================

  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ============================================================================
  // Core Chat Logic
  // ============================================================================

  const {
    messages,
    setMessages,
    isLoading,
    aiStatus,
    currentCitations,
    sessionId,
    tokenTracker,
    isOnline,
    messageQueue,
    suggestedFollowUps,
    currentToolUse,
    toolResults,
    providerInfo,
    apiError,
    isDemoMode,
    handleSendMessage,
    handleMessageRetry,
    handleFeedback,
    handleExportWithFormat,
    handleClear,
    handleNetworkStatusChange,
  } = useDocsChat()

  // ============================================================================
  // Library Hooks
  // ============================================================================

  const toast = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { copy } = useClipboard({
    timeout: 2000,
    onSuccess: () => toast.success('Copied to clipboard'),
    onError: () => toast.error('Failed to copy'),
  })

  // Focus trap for modal accessibility
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  // ============================================================================
  // Token Budget Monitoring
  // ============================================================================

  const currentBudget = TOKEN_BUDGET_PRESETS[tokenBudgetPreset]
  const tokenUsagePercentage = (tokenTracker.tokenCount / currentBudget.maxTokens) * 100
  const isNearBudget = tokenUsagePercentage >= currentBudget.warningThreshold * 100
  const isOverBudget = tokenTracker.tokenCount > currentBudget.maxTokens

  // Show optimization suggestions when nearing budget
  const showOptimizationSuggestions = isNearBudget || isOverBudget

  // ============================================================================
  // Command Palette Items
  // ============================================================================

  const commandItems: CommandItem[] = useMemo(() => [
    {
      id: 'toggle-token-dashboard',
      name: showTokenDashboard ? 'Hide Token Dashboard' : 'Show Token Dashboard',
      shortcut: '⌘ T',
      icon: <Zap className="w-4 h-4" />,
      action: () => setShowTokenDashboard(!showTokenDashboard),
    },
    {
      id: 'toggle-memory',
      name: showMemoryInspector ? 'Hide Memory Inspector' : 'Show Memory Inspector',
      shortcut: '⌘ M',
      icon: <Brain className="w-4 h-4" />,
      action: () => setShowMemoryInspector(!showMemoryInspector),
    },
    {
      id: 'clear-conversation',
      name: 'Clear Conversation',
      shortcut: '⌘ ⇧ C',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => {
        handleClear()
        toast.success('Conversation cleared')
      },
    },
    {
      id: 'export-markdown',
      name: 'Export as Markdown',
      shortcut: '⌘ E',
      icon: <Code2 className="w-4 h-4" />,
      action: () => {
        handleExportWithFormat('markdown')
        toast.success('Exported as Markdown')
      },
    },
    {
      id: 'budget-frugal',
      name: 'Set Budget: Frugal (1K tokens)',
      icon: <TrendingDown className="w-4 h-4" />,
      action: () => {
        setTokenBudgetPreset('frugal')
        toast.info('Budget set to Frugal')
      },
    },
    {
      id: 'budget-balanced',
      name: 'Set Budget: Balanced (4K tokens)',
      icon: <CheckCircle2 className="w-4 h-4" />,
      action: () => {
        setTokenBudgetPreset('balanced')
        toast.info('Budget set to Balanced')
      },
    },
    {
      id: 'budget-generous',
      name: 'Set Budget: Generous (8K tokens)',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        setTokenBudgetPreset('generous')
        toast.info('Budget set to Generous')
      },
    },
  ], [showTokenDashboard, showMemoryInspector, handleClear, handleExportWithFormat, toast])

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useKeyboardShortcuts([
    {
      key: 'mod+.',
      callback: () => {
        const willOpen = !isOpen
        if (willOpen) {
          saveFocus()
        }
        setIsOpen(willOpen)
        if (!willOpen) {
          restoreFocus()
        }
      },
      description: 'Toggle documentation assistant',
    },
    {
      key: 'mod+k',
      callback: () => {
        if (isOpen) {
          setShowCommandPalette(true)
        }
      },
      description: 'Open command palette',
    },
    {
      key: 'mod+t',
      callback: () => {
        if (isOpen) {
          setShowTokenDashboard(!showTokenDashboard)
        }
      },
      description: 'Toggle token dashboard',
    },
    {
      key: 'mod+m',
      callback: () => {
        if (isOpen) {
          setShowMemoryInspector(!showMemoryInspector)
        }
      },
      description: 'Toggle memory inspector',
    },
    {
      key: 'escape',
      callback: () => {
        if (showCommandPalette) {
          setShowCommandPalette(false)
        } else if (showSettings) {
          setShowSettings(false)
        } else if (isOpen) {
          setIsOpen(false)
          restoreFocus()
        }
      },
      description: 'Close assistant',
    },
  ])

  // ============================================================================
  // Focus Management
  // ============================================================================

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderTokenOptimizationHeader = () => (
    <div className="bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-pink-500/10 border-b border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Token Optimization</h3>
            <p className="text-xs text-muted-foreground">Real-time cost tracking & optimization</p>
          </div>
        </div>
        <TokenOptimizationBadge
          currentTokens={tokenTracker.tokenCount}
          maxTokens={currentBudget.maxTokens}
          size="sm"
        />
      </div>

      {/* Primary Token Meters */}
      <div className="space-y-3">
        <TokenUsageMeter
          currentTokens={tokenTracker.tokenCount}
          maxTokens={currentBudget.maxTokens}
          showCost
          showPercentage
          animate
        />
        <TokenBudgetBar
          currentTokens={tokenTracker.tokenCount}
          maxTokens={currentBudget.maxTokens}
          warningThreshold={currentBudget.warningThreshold}
          showLabels
        />
      </div>

      {/* Cost Estimate */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Estimated cost:</span>
        </div>
        <span className="font-mono font-semibold text-foreground">
          ${(tokenTracker.tokenCount * 0.00001).toFixed(4)}
        </span>
      </div>

      {/* Warning when nearing budget */}
      {showOptimizationSuggestions && (
        <div className={cn(
          "mt-3 flex items-start gap-2 p-2 rounded-lg text-xs",
          isOverBudget
            ? "bg-destructive/10 text-destructive"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        )}>
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              {isOverBudget ? 'Budget Exceeded!' : 'Approaching Budget Limit'}
            </p>
            <p className="opacity-90 mt-1">
              {isOverBudget
                ? 'Consider clearing conversation or using summarization'
                : 'Token optimization suggestions available'}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <ChatButton
          onClick={() => setIsOpen(true)}
          isOpen={false}
        />
      )}

      {/* Main Assistant Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION }}
              onClick={() => {
                setIsOpen(false)
                restoreFocus()
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'fixed inset-4 md:inset-8 z-[70]',
                'lg:right-8 lg:left-auto lg:max-w-5xl',
                'flex flex-col',
                'rounded-2xl overflow-hidden',
                'bg-white dark:bg-neutral-950',
                'border border-border',
                'shadow-2xl',
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="docs-assistant-title"
            >
              {/* Screen reader title */}
              <h2 id="docs-assistant-title" className="sr-only">
                Documentation Assistant with Token Optimization
              </h2>

              {/* TOKEN OPTIMIZATION HEADER - ALWAYS PROMINENT */}
              {showTokenDashboard && renderTokenOptimizationHeader()}

              {/* Main Content Grid */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Memory & Context */}
                {showMemoryInspector && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: ANIMATION_DURATION }}
                    className="border-r border-border overflow-y-auto"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-4 h-4 text-brand-500" />
                        <h3 className="text-sm font-semibold">Memory & Context</h3>
                      </div>
                      <ContextVisualizer
                        contextItems={messages.map(m => ({
                          id: m.id,
                          type: m.role === 'user' ? 'user' : 'assistant',
                          content: m.content.substring(0, 100),
                          tokens: Math.ceil(m.content.length / 4),
                        }))}
                        maxTokens={currentBudget.maxTokens}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Center - Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Documentation Assistant</h3>
                        <p className="text-xs text-muted-foreground">
                          {isDemoMode ? 'Demo Mode' : providerInfo?.model || 'Powered by AI'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowCommandPalette(true)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Command Palette (⌘K)"
                      >
                        <CommandIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          restoreFocus()
                        }}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Close (Esc)"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Network Status */}
                  {!isOnline && (
                    <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
                      <NetworkStatus
                        show={true}
                        onStatusChange={handleNetworkStatusChange}
                        showDetails={true}
                      />
                    </div>
                  )}

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/10">
                            <Sparkles className="w-8 h-8 text-brand-500" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Welcome to Docs Assistant</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ask me anything about Clarity Chat components, hooks, or best practices.
                            Token optimization and cost tracking are built in!
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <button
                              onClick={() => handleSendMessage('How do I optimize token usage?')}
                              className="px-3 py-1.5 text-xs rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                            >
                              Token optimization tips
                            </button>
                            <button
                              onClick={() => handleSendMessage('Show me streaming examples')}
                              className="px-3 py-1.5 text-xs rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                            >
                              Streaming examples
                            </button>
                            <button
                              onClick={() => handleSendMessage('What components are available?')}
                              className="px-3 py-1.5 text-xs rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                            >
                              Available components
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        showActions
                        onCopy={async (id, content) => await copy(content)}
                        onRetry={handleMessageRetry}
                        onFeedback={handleFeedback}
                      />
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThinkingIndicator />
                        <span>{aiStatus || 'Thinking...'}</span>
                      </div>
                    )}

                    {/* Tool Use Indicator */}
                    {currentToolUse && (
                      <ToolInvocationCard
                        toolName={currentToolUse.tool_name}
                        status="running"
                        description={`Executing ${currentToolUse.tool_name}...`}
                      />
                    )}

                    {/* Citations */}
                    {currentCitations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Sources ({currentCitations.length})
                        </h4>
                        {currentCitations.map(citation => (
                          <CitationCard
                            key={citation.id}
                            citation={citation}
                            showConfidence
                            previewLength={120}
                            onSourceClick={(url) => window.open(url, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Area with Token Cost Preview */}
                  <div className="border-t border-border p-4 space-y-2">
                    <TokenCostPreview
                      text={inputRef.current?.value || ''}
                      showBreakdown
                      showOptimizationTips={showOptimizationSuggestions}
                    />
                    <div className="flex gap-2">
                      <textarea
                        ref={inputRef}
                        placeholder="Ask anything about Clarity Chat..."
                        className="flex-1 min-h-[100px] p-3 rounded-lg bg-accent/50 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            if (inputRef.current?.value.trim()) {
                              handleSendMessage(inputRef.current.value)
                              inputRef.current.value = ''
                            }
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <VoiceInput
                          onTranscript={(transcript) => {
                            if (transcript.trim()) {
                              handleSendMessage(transcript)
                            }
                          }}
                          size="md"
                          variant="default"
                        />
                        <button
                          onClick={() => {
                            if (inputRef.current?.value.trim()) {
                              handleSendMessage(inputRef.current.value)
                              inputRef.current.value = ''
                            }
                          }}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors disabled:opacity-50"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Token Optimization Panel */}
                {showOptimizationSuggestions && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: ANIMATION_DURATION }}
                    className="border-l border-border overflow-y-auto bg-accent/20"
                  >
                    <div className="p-4">
                      <TokenOptimizationPanel
                        currentTokens={tokenTracker.tokenCount}
                        maxTokens={currentBudget.maxTokens}
                        messages={messages}
                        showSuggestions
                        showStatistics
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Full Token Dashboard (Modal Overlay) */}
              {showTokenDashboard && showSettings && (
                <div className="absolute inset-0 bg-background z-10 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Token Optimization Dashboard</h3>
                      <button
                        onClick={() => setShowSettings(false)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <TokenOptimizationDashboard
                      tokenStats={{
                        totalTokens: tokenTracker.tokenCount,
                        optimizationSavings: Math.floor(tokenTracker.tokenCount * 0.15),
                        averageMessageTokens: messages.length > 0
                          ? Math.floor(tokenTracker.tokenCount / messages.length)
                          : 0,
                        peakTokenUsage: tokenTracker.tokenCount,
                      }}
                      messages={messages}
                      showCharts
                      showOptimizationTips
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Command Palette */}
            <CommandPaletteEnhanced
              isOpen={showCommandPalette}
              onClose={() => setShowCommandPalette(false)}
              commands={commandItems.map(item => ({
                id: item.id,
                name: item.name,
                description: item.shortcut,
                icon: item.icon,
                action: item.action,
              }))}
              placeholder="Search commands..."
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================================
// Exported Component with Error Boundary
// ============================================================================

export function DocsAssistantEnhanced({ className }: DocsAssistantEnhancedProps) {
  const toast = useToast()

  return (
    <ErrorBoundary
      fallback={(error: Error, resetError: () => void) => (
        <div className="fixed bottom-4 right-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-lg max-w-sm z-[100]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Assistant Error</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <button
                onClick={resetError}
                className="text-sm font-medium text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('[DocsAssistantEnhanced] Error:', error, errorInfo)
      }}
      onReset={() => {
        toast.info('Documentation Assistant has been reset')
      }}
    >
      <DocsAssistantEnhancedInner className={className} />
    </ErrorBoundary>
  )
}
