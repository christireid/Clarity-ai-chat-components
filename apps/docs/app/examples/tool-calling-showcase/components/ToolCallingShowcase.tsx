import { logger } from '@clarity-chat/utils/logger';
'use client'

/**
 * ToolCallingShowcase Component
 *
 * Main orchestrator for the Advanced Tool Calling Demo.
 * Demonstrates multi-step tool chains, generative UI, and human-in-the-loop patterns.
 *
 * Now refactored to use custom hooks for cleaner state management.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  RefreshCw,
  User,
  Bot,
  Loader2,
  Zap,
  TrendingUp,
  Search,
  BarChart3,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Cpu,
  Play,
} from 'lucide-react'

import type {
  Message,
  ToolCallState,
  TickerSearchResult,
  FinancialData,
  ChartData,
  TradeResult,
  ExecuteTradeArgs,
} from '../lib/types'

import { useToolOrchestration, useAIToolOrchestration } from '../hooks'
import {
  TickerSearchCard,
  StockAnalysisCard,
  InteractiveStockChart,
  TradeConfirmationModal,
  TradeResultCard,
} from './tool-cards'
import { GlassBoxPanel } from './GlassBoxPanel'
import { ToolSkeleton } from './SkeletonLoaders'

// ============================================================================
// Error Boundary for Tool Cards
// ============================================================================

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onRetry?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ToolErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.logger.error('ToolErrorBoundary caught error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h4 className="font-medium text-red-700 dark:text-red-400">
                Component Error
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {this.state.error?.message || 'Something went wrong rendering this component.'}
              </p>
              {this.props.onRetry && (
                <button
                  onClick={this.handleRetry}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                             bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900
                             text-red-700 dark:text-red-300 rounded-lg transition-colors"
                  aria-label="Retry loading component"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

// ============================================================================
// Tool Result Renderer
// ============================================================================

interface ToolResultRendererProps {
  toolCall: ToolCallState
  onAction?: (action: string, payload?: unknown) => void
  onRetry?: (toolCall: ToolCallState) => void
}

function ToolResultRenderer({ toolCall, onAction, onRetry }: ToolResultRendererProps) {
  if (toolCall.status === 'executing' || toolCall.status === 'pending') {
    return <ToolSkeleton toolName={toolCall.name} />
  }

  if (toolCall.status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 p-4"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h4 className="font-medium text-red-600 dark:text-red-400">Tool Error</h4>
            <p className="text-sm text-red-500 dark:text-red-300 mt-1">{toolCall.error}</p>
            {onRetry && (
              <button
                onClick={() => onRetry(toolCall)}
                className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                           bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900
                           text-red-700 dark:text-red-300 rounded-lg transition-colors"
                aria-label={`Retry ${toolCall.name} tool`}
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Retry
              </button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const data = toolCall.result

  return (
    <ToolErrorBoundary onRetry={() => onRetry?.(toolCall)}>
      {(() => {
        switch (toolCall.name) {
          case 'search_ticker':
            return (
              <TickerSearchCard
                data={data as TickerSearchResult}
                onSelect={(symbol) => onAction?.('analyze', { symbol })}
              />
            )
          case 'get_financials':
            return (
              <StockAnalysisCard
                data={data as FinancialData}
                onViewChart={() => onAction?.('chart', { symbol: (data as FinancialData).symbol })}
                onTrade={(action) =>
                  onAction?.('trade', { symbol: (data as FinancialData).symbol, action })
                }
              />
            )
          case 'render_chart':
            return <InteractiveStockChart data={data as ChartData} />
          case 'execute_trade':
            return <TradeResultCard data={data as TradeResult} />
          default:
            return (
              <div
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
                role="region"
                aria-label="Tool result"
              >
                <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
              </div>
            )
        }
      })()}
    </ToolErrorBoundary>
  )
}

// ============================================================================
// Message Component
// ============================================================================

interface MessageBubbleProps {
  message: Message
  onToolAction?: (action: string, payload?: unknown) => void
  onToolRetry?: (toolCall: ToolCallState) => void
  pendingApproval?: ToolCallState | null
  onApprove?: () => void
  onReject?: () => void
  isProcessingApproval?: boolean
}

function MessageBubble({
  message,
  onToolAction,
  onToolRetry,
  pendingApproval,
  onApprove,
  onReject,
  isProcessingApproval,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-label={`${isUser ? 'You' : 'AI Assistant'}: ${message.content || 'Tool call'}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
              : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
          }`}
          aria-hidden="true"
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Content */}
        <div className={`space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Text Content */}
          {message.content && (
            <div
              className={`rounded-2xl px-4 py-3 ${
                isUser
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          )}

          {/* Tool Calls */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="space-y-3 w-full max-w-md" role="list" aria-label="Tool results">
              {message.toolCalls.map((tc) => {
                // Check if this tool needs approval
                if (
                  pendingApproval &&
                  pendingApproval.id === tc.id &&
                  tc.status === 'awaiting_approval'
                ) {
                  const financialData = message.toolCalls?.find(
                    (t) => t.name === 'get_financials' && t.status === 'complete'
                  )?.result as FinancialData | undefined

                  return (
                    <TradeConfirmationModal
                      key={tc.id}
                      toolCall={{
                        name: 'execute_trade',
                        args: tc.args as ExecuteTradeArgs,
                      }}
                      currentPrice={financialData?.currentPrice || 100}
                      onApprove={onApprove!}
                      onReject={onReject!}
                      isProcessing={isProcessingApproval}
                    />
                  )
                }

                return (
                  <ToolResultRenderer
                    key={tc.id}
                    toolCall={tc}
                    onAction={onToolAction}
                    onRetry={onToolRetry}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Example Prompts
// ============================================================================

const EXAMPLE_PROMPTS = [
  {
    icon: Search,
    label: 'Search for Apple stock',
    prompt: 'Search for Apple ticker',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    label: 'Analyze NVIDIA',
    prompt: 'Analyze NVDA stock and show me the financials',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    label: 'Chart Tesla',
    prompt: 'Show me a chart of Tesla stock for the past month',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: DollarSign,
    label: 'Buy Microsoft',
    prompt: 'Buy 5 shares of Microsoft',
    color: 'from-amber-500 to-orange-500',
  },
]

// ============================================================================
// Main Component
// ============================================================================

export function ToolCallingShowcase() {
  // Mode toggle - switch between mock demo and real AI
  const [useAI, setUseAI] = useState(false)

  // Call both hooks unconditionally (React rules) and select active one
  const mockOrchestration = useToolOrchestration()
  const aiOrchestration = useAIToolOrchestration()

  // Select the active orchestration based on mode
  const {
    messages,
    isLoading,
    orchestratorState,
    pendingApproval,
    isProcessingApproval,
    error,
    sendMessage,
    handleApprove,
    handleReject,
    clearMessages,
    clearError,
    debugEvents,
  } = useAI ? aiOrchestration : mockOrchestration

  // Local UI state
  const [input, setInput] = useState('')
  const [isDebugExpanded, setIsDebugExpanded] = useState(true)
  const [isSwitchingMode, setIsSwitchingMode] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatRegionRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount and after loading
  useEffect(() => {
    if (!isLoading && !pendingApproval) {
      inputRef.current?.focus()
    }
  }, [isLoading, pendingApproval])

  // Announce state changes for screen readers
  useEffect(() => {
    if (orchestratorState === 'awaiting_approval') {
      // Focus trap will be on the modal
    }
  }, [orchestratorState])

  // Handle tool action from rendered components
  const handleToolAction = useCallback((action: string, payload?: unknown) => {
    const data = payload as Record<string, unknown>
    switch (action) {
      case 'analyze':
        setInput(`Analyze ${data?.symbol} stock and show me the financials`)
        inputRef.current?.focus()
        break
      case 'chart':
        setInput(`Show me a chart of ${data?.symbol} for the past month`)
        inputRef.current?.focus()
        break
      case 'trade':
        setInput(`${data?.action === 'buy' ? 'Buy' : 'Sell'} 10 shares of ${data?.symbol}`)
        inputRef.current?.focus()
        break
    }
  }, [])

  // Handle tool retry
  const handleToolRetry = useCallback((toolCall: ToolCallState) => {
    // For demo, just re-trigger the same action
    const { name, args } = toolCall
    if (name === 'search_ticker') {
      const query = (args as { query: string }).query
      setInput(`Search for ${query}`)
    } else if (name === 'get_financials') {
      const symbol = (args as { symbol: string }).symbol
      setInput(`Analyze ${symbol} stock`)
    }
    inputRef.current?.focus()
  }, [])

  // Send message handler
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return
      setInput('')
      await sendMessage(content)
    },
    [isLoading, sendMessage]
  )

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  // Clear chat
  const handleClear = () => {
    clearMessages()
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex flex-col h-[700px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl"
      role="application"
      aria-label="AI Stock Market Analyst - Tool Calling Demo"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">AI Stock Market Analyst</h1>
            <p className="text-xs text-muted-foreground">
              Multi-step tool chains • Generative UI • Human-in-the-loop
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Mode Toggle */}
          <button
            onClick={async () => {
              if (isSwitchingMode || isLoading) return
              setIsSwitchingMode(true)
              clearMessages()
              // Small delay to let clearMessages complete
              await new Promise(r => setTimeout(r, 100))
              setUseAI(!useAI)
              setIsSwitchingMode(false)
            }}
            disabled={isSwitchingMode || isLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isSwitchingMode
                ? 'bg-gray-200 dark:bg-gray-700 text-muted-foreground cursor-wait'
                : useAI
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={useAI ? 'Using Real AI + Live Data' : 'Using Mock Demo Mode'}
            aria-label={useAI ? 'Switch to mock demo mode' : 'Switch to real AI mode'}
            aria-pressed={useAI}
          >
            {isSwitchingMode ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Switching...</span>
              </>
            ) : useAI ? (
              <>
                <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Live AI</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Demo</span>
              </>
            )}
          </button>
          {/* Status Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs"
            role="status"
            aria-live="polite"
            aria-label={`Status: ${orchestratorState.replace('_', ' ')}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                orchestratorState === 'idle'
                  ? 'bg-gray-400'
                  : orchestratorState === 'awaiting_approval'
                    ? 'bg-amber-500 animate-pulse'
                    : orchestratorState === 'streaming' || orchestratorState === 'executing_tool'
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-blue-500'
              }`}
              aria-hidden="true"
            />
            <span className="capitalize">{orchestratorState.replace('_', ' ')}</span>
          </div>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground transition-colors"
            title="Clear chat"
            aria-label="Clear conversation"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main
        ref={chatRegionRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
        role="log"
        aria-label="Conversation messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 p-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <h4 className="font-medium text-red-700 dark:text-red-400">
                  {useAI ? 'AI Connection Error' : 'Error'}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  {error.message}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                  {useAI && error.message.includes('API key')
                    ? 'Check that OPENAI_API_KEY and FINNHUB_API_KEY are set in your .env.local file.'
                    : 'Try again or switch to Demo mode.'}
                </p>
                <button
                  onClick={clearError}
                  className="mt-3 flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                             bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900
                             text-red-700 dark:text-red-300 rounded-lg transition-colors"
                  aria-label="Dismiss error"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {messages.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/25"
              aria-hidden="true"
            >
              <Zap className="w-8 h-8" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">
              {useAI ? 'Live AI Stock Analyst' : 'Advanced Tool Calling Demo'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {useAI ? (
                <>
                  <span className="text-green-600 dark:text-green-400 font-medium">Real AI + Live Market Data</span>
                  {' '}— GPT-4o-mini with Finnhub integration. Ask about real stocks!
                </>
              ) : (
                'Watch the AI orchestrate multiple tools, render interactive UI components, and request approval for critical actions.'
              )}
            </p>
            {!useAI && (
              <p className="text-xs text-muted-foreground mb-6 max-w-md">
                Toggle <span className="font-medium">"Live AI"</span> in the header for real market data.
              </p>
            )}
            {useAI && <div className="mb-6" />}
            <div
              className="grid grid-cols-2 gap-3"
              role="group"
              aria-label="Example prompts"
            >
              {EXAMPLE_PROMPTS.map((example, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSendMessage(example.prompt)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-left group"
                  aria-label={`Try: ${example.label}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${example.color} flex items-center justify-center text-white`}
                    aria-hidden="true"
                  >
                    <example.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {example.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div role="list" aria-label="Messages">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onToolAction={handleToolAction}
                    onToolRetry={handleToolRetry}
                    pendingApproval={pendingApproval}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isProcessingApproval={isProcessingApproval}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Loading indicator */}
            {isLoading && !pendingApproval && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
                role="status"
                aria-label="AI is thinking"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </>
        )}
      </main>

      {/* Debug Panel */}
      <aside className="px-4 pb-4" aria-label="Debug panel">
        <GlassBoxPanel
          events={debugEvents.events}
          isExpanded={isDebugExpanded}
          onToggle={() => setIsDebugExpanded(!isDebugExpanded)}
          onClear={() => debugEvents.clearEvents()}
        />
      </aside>

      {/* Input Area */}
      <footer className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="relative">
          <label htmlFor="chat-input" className="sr-only">
            Message input
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, request analysis, or execute trades..."
            disabled={isLoading || !!pendingApproval}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 transition-all"
            aria-describedby="input-hint"
          />
          <span id="input-hint" className="sr-only">
            Press Enter to send, Shift+Enter for new line
          </span>
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !!pendingApproval}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </footer>
    </div>
  )
}

ToolCallingShowcase.displayName = 'ToolCallingShowcase'
