'use client'

/**
 * ToolCallingShowcase Component
 *
 * Main orchestrator for the Advanced Tool Calling Demo.
 * Demonstrates multi-step tool chains, generative UI, and human-in-the-loop patterns.
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
} from 'lucide-react'

import type {
  Message,
  ToolCallState,
  DebugEvent,
  DebugEventType,
  OrchestratorState,
  TickerSearchResult,
  FinancialData,
  ChartData,
  TradeResult,
  ExecuteTradeArgs,
} from '../lib/types'
import { CRITICAL_TOOLS, TOOL_DEFINITIONS } from '../lib/types'
import { executeTool, getSimulatedResponse } from '../lib/mock-data'

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
// Helper Functions
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function addDebugEvent(
  setEvents: React.Dispatch<React.SetStateAction<DebugEvent[]>>,
  type: DebugEventType,
  payload: unknown,
  toolName?: string,
  duration?: number
) {
  const event: DebugEvent = {
    id: generateId(),
    timestamp: new Date(),
    type,
    payload,
    toolName,
    duration,
  }
  setEvents((prev) => [...prev, event])
}

// ============================================================================
// Tool Result Renderer
// ============================================================================

interface ToolResultRendererProps {
  toolCall: ToolCallState
  onAction?: (action: string, payload?: unknown) => void
}

function ToolResultRenderer({ toolCall, onAction }: ToolResultRendererProps) {
  if (toolCall.status === 'executing' || toolCall.status === 'pending') {
    return <ToolSkeleton toolName={toolCall.name} />
  }

  if (toolCall.status === 'error') {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/30 p-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
          <span className="text-lg">Error</span>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400">{toolCall.error}</p>
      </div>
    )
  }

  const data = toolCall.result

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
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )
  }
}

// ============================================================================
// Message Component
// ============================================================================

interface MessageBubbleProps {
  message: Message
  onToolAction?: (action: string, payload?: unknown) => void
  pendingApproval?: ToolCallState | null
  onApprove?: () => void
  onReject?: () => void
  isProcessingApproval?: boolean
}

function MessageBubble({
  message,
  onToolAction,
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
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'
              : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
          }`}
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
            <div className="space-y-3 w-full max-w-md">
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

                return <ToolResultRenderer key={tc.id} toolCall={tc} onAction={onToolAction} />
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
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>('idle')
  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([])
  const [isDebugExpanded, setIsDebugExpanded] = useState(true)
  const [pendingApproval, setPendingApproval] = useState<ToolCallState | null>(null)
  const [isProcessingApproval, setIsProcessingApproval] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  // Execute a tool and update state
  const executeToolCall = useCallback(
    async (toolCall: ToolCallState, messageId: string): Promise<unknown> => {
      const startTime = Date.now()

      // Update tool status to executing
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                toolCalls: m.toolCalls?.map((tc) =>
                  tc.id === toolCall.id ? { ...tc, status: 'executing' as const } : tc
                ),
              }
            : m
        )
      )

      addDebugEvent(setDebugEvents, 'TOOL_CALL', toolCall.args, toolCall.name)

      // Execute the tool
      const result = await executeTool(toolCall.name, toolCall.args)
      const duration = Date.now() - startTime

      if (result.success) {
        addDebugEvent(setDebugEvents, 'TOOL_RESULT', result.data, toolCall.name, duration)

        // Update tool with result
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  toolCalls: m.toolCalls?.map((tc) =>
                    tc.id === toolCall.id
                      ? { ...tc, status: 'complete' as const, result: result.data, endTime: Date.now() }
                      : tc
                  ),
                }
              : m
          )
        )

        return result.data
      } else {
        addDebugEvent(setDebugEvents, 'TOOL_ERROR', result.error, toolCall.name, duration)

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  toolCalls: m.toolCalls?.map((tc) =>
                    tc.id === toolCall.id
                      ? { ...tc, status: 'error' as const, error: result.error }
                      : tc
                  ),
                }
              : m
          )
        )

        throw new Error(result.error)
      }
    },
    []
  )

  // Handle approval for critical tools
  const handleApprove = useCallback(async () => {
    if (!pendingApproval) return

    setIsProcessingApproval(true)
    addDebugEvent(setDebugEvents, 'APPROVAL_GRANTED', { toolId: pendingApproval.id })

    // Find the message containing this tool call
    const message = messages.find((m) => m.toolCalls?.some((tc) => tc.id === pendingApproval.id))

    if (message) {
      try {
        await executeToolCall(pendingApproval, message.id)
      } catch (error) {
        console.error('Tool execution failed:', error)
      }
    }

    setPendingApproval(null)
    setIsProcessingApproval(false)
    setOrchestratorState('completed')
  }, [pendingApproval, messages, executeToolCall])

  const handleReject = useCallback(() => {
    if (!pendingApproval) return

    addDebugEvent(setDebugEvents, 'APPROVAL_DENIED', { toolId: pendingApproval.id })

    // Update the tool call status to show it was rejected
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        toolCalls: m.toolCalls?.map((tc) =>
          tc.id === pendingApproval.id
            ? { ...tc, status: 'error' as const, error: 'Trade cancelled by user' }
            : tc
        ),
      }))
    )

    // Add an assistant message acknowledging the cancellation
    const cancelMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: "Trade cancelled. Is there anything else you'd like to do?",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, cancelMessage])

    setPendingApproval(null)
    setOrchestratorState('completed')
  }, [pendingApproval])

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setIsLoading(true)
      setOrchestratorState('streaming')

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      addDebugEvent(setDebugEvents, 'USER_MESSAGE', { content })

      // Get simulated AI response
      const response = getSimulatedResponse(content)

      // Add thinking event if present
      if (response.thinking) {
        addDebugEvent(setDebugEvents, 'ASSISTANT_THINKING', { thinking: response.thinking })
      }

      // Simulate some delay
      await new Promise((r) => setTimeout(r, 500))

      // Create assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.content || '',
        toolCalls: response.toolCalls?.map((tc) => ({
          id: tc.id,
          name: tc.name,
          args: tc.args,
          status: 'pending' as const,
          startTime: Date.now(),
        })),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // If there are tool calls, execute them
      if (response.toolCalls && response.toolCalls.length > 0) {
        setOrchestratorState('tool_pending')

        for (const tc of response.toolCalls) {
          const toolCall = assistantMessage.toolCalls?.find((t) => t.id === tc.id)
          if (!toolCall) continue

          // Check if this is a critical tool requiring approval
          if (CRITICAL_TOOLS.includes(tc.name as (typeof CRITICAL_TOOLS)[number])) {
            setOrchestratorState('awaiting_approval')
            addDebugEvent(setDebugEvents, 'AWAITING_APPROVAL', tc)

            // Update tool status to awaiting approval
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? {
                      ...m,
                      toolCalls: m.toolCalls?.map((t) =>
                        t.id === tc.id ? { ...t, status: 'awaiting_approval' as const } : t
                      ),
                    }
                  : m
              )
            )

            setPendingApproval({
              ...toolCall,
              status: 'awaiting_approval',
            })

            setIsLoading(false)
            return // Stop here and wait for approval
          }

          // Execute non-critical tools
          try {
            const result = await executeToolCall(toolCall, assistantMessage.id)

            // Chain: If search_ticker returns results, auto-analyze the first one
            if (tc.name === 'search_ticker' && result) {
              const searchResult = result as TickerSearchResult
              if (searchResult.matches.length > 0) {
                // Add a follow-up message
                await new Promise((r) => setTimeout(r, 300))

                const followUpId = generateId()
                const followUp: Message = {
                  id: followUpId,
                  role: 'assistant',
                  content: `Found ${searchResult.matches[0].name}. Let me get the financial details...`,
                  toolCalls: [
                    {
                      id: generateId(),
                      name: 'get_financials',
                      args: { symbol: searchResult.matches[0].symbol, includeHistory: true },
                      status: 'pending',
                      startTime: Date.now(),
                    },
                  ],
                  timestamp: new Date(),
                }
                setMessages((prev) => [...prev, followUp])
                addDebugEvent(setDebugEvents, 'ASSISTANT_THINKING', {
                  thinking: `Chaining to get_financials for ${searchResult.matches[0].symbol}`,
                })

                // Execute the chained tool
                await executeToolCall(followUp.toolCalls![0], followUpId)
              }
            }
          } catch (error) {
            console.error('Tool execution failed:', error)
          }
        }
      }

      setIsLoading(false)
      setOrchestratorState('completed')
      inputRef.current?.focus()
    },
    [isLoading, executeToolCall]
  )

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Clear chat
  const handleClear = () => {
    setMessages([])
    setDebugEvents([])
    setOrchestratorState('idle')
    setPendingApproval(null)
  }

  return (
    <div className="flex flex-col h-[700px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Stock Market Analyst</h2>
            <p className="text-xs text-muted-foreground">
              Multi-step tool chains • Generative UI • Human-in-the-loop
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
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
            />
            <span className="capitalize">{orchestratorState.replace('_', ' ')}</span>
          </div>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground transition-colors"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/25"
            >
              <Zap className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Advanced Tool Calling Demo</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Watch the AI orchestrate multiple tools, render interactive UI components, and request
              approval for critical actions.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {EXAMPLE_PROMPTS.map((example, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => sendMessage(example.prompt)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all text-left group"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${example.color} flex items-center justify-center text-white`}
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
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onToolAction={handleToolAction}
                  pendingApproval={pendingApproval}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessingApproval={isProcessingApproval}
                />
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && !pendingApproval && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Debug Panel */}
      <div className="px-4 pb-4">
        <GlassBoxPanel
          events={debugEvents}
          isExpanded={isDebugExpanded}
          onToggle={() => setIsDebugExpanded(!isDebugExpanded)}
          onClear={() => setDebugEvents([])}
        />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, request analysis, or execute trades..."
            disabled={isLoading || !!pendingApproval}
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !!pendingApproval}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

ToolCallingShowcase.displayName = 'ToolCallingShowcase'
