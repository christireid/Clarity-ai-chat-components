import { logger } from '@clarity-chat/utils/logger';
'use client'

/**
 * useToolOrchestration Hook
 *
 * Manages the state machine for tool calling orchestration:
 * idle → streaming → tool_pending → executing_tool → completed
 * With special handling for critical tools requiring approval.
 */

import { useState, useCallback, useRef } from 'react'
import type {
  Message,
  ToolCallState,
  OrchestratorState,
  ToolName,
} from '../lib/types'
import { CRITICAL_TOOLS } from '../lib/types'
import { executeTool, getSimulatedResponse } from '../lib/mock-data'
import { useDebugEvents } from './useDebugEvents'

interface UseToolOrchestrationOptions {
  onToolAction?: (action: string, payload?: unknown) => void
}

interface UseToolOrchestrationReturn {
  messages: Message[]
  isLoading: boolean
  orchestratorState: OrchestratorState
  pendingApproval: ToolCallState | null
  isProcessingApproval: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  handleApprove: () => Promise<void>
  handleReject: () => void
  clearMessages: () => void
  clearError: () => void
  debugEvents: ReturnType<typeof useDebugEvents>
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export function useToolOrchestration(
  _options: UseToolOrchestrationOptions = {}
): UseToolOrchestrationReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>('idle')
  const [pendingApproval, setPendingApproval] = useState<ToolCallState | null>(null)
  const [isProcessingApproval, setIsProcessingApproval] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debugEvents = useDebugEvents()
  const lastPriceRef = useRef<Record<string, number>>({})

  // Ref-based lock to prevent race conditions with concurrent sendMessage calls
  // This ensures only one message is processed at a time, even with rapid clicks
  const isProcessingRef = useRef(false)

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

      debugEvents.addEvent('TOOL_CALL', toolCall.args, toolCall.name)

      // Execute the tool
      const result = await executeTool(toolCall.name, toolCall.args)
      const duration = Date.now() - startTime

      if (result.success) {
        debugEvents.addEvent('TOOL_RESULT', result.data, toolCall.name, duration)

        // Store price for later reference
        if (toolCall.name === 'get_financials' && result.data) {
          const data = result.data as { symbol: string; currentPrice: number }
          lastPriceRef.current[data.symbol] = data.currentPrice
        }

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
        debugEvents.addEvent('TOOL_ERROR', result.error, toolCall.name, duration)

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
    [debugEvents]
  )

  // Handle approval for critical tools
  const handleApprove = useCallback(async () => {
    if (!pendingApproval) return

    setIsProcessingApproval(true)
    debugEvents.addEvent('APPROVAL_GRANTED', { toolId: pendingApproval.id })

    // Find the message containing this tool call
    const message = messages.find((m) => m.toolCalls?.some((tc) => tc.id === pendingApproval.id))

    if (message) {
      try {
        await executeToolCall(pendingApproval, message.id)
      } catch (error) {
        logger.error('Tool execution failed:', error)
      }
    }

    setPendingApproval(null)
    setIsProcessingApproval(false)
    setOrchestratorState('completed')
  }, [pendingApproval, messages, executeToolCall, debugEvents])

  const handleReject = useCallback(() => {
    if (!pendingApproval) return

    debugEvents.addEvent('APPROVAL_DENIED', { toolId: pendingApproval.id })

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
  }, [pendingApproval, debugEvents])

  // Retry a failed tool
  const retryTool = useCallback(
    async (toolCall: ToolCallState, messageId: string) => {
      debugEvents.addEvent('TOOL_CALL', { ...toolCall.args, retry: true }, toolCall.name)
      await executeToolCall({ ...toolCall, status: 'pending' }, messageId)
    },
    [executeToolCall, debugEvents]
  )

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      // Use ref-based lock to prevent race conditions
      // State check (isLoading) can have stale values in rapid succession
      if (!content.trim() || isLoading || isProcessingRef.current) return

      // Acquire lock immediately using ref (synchronous)
      isProcessingRef.current = true

      setIsLoading(true)
      setOrchestratorState('streaming')
      debugEvents.addEvent('STREAM_START', {})

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      debugEvents.addEvent('USER_MESSAGE', { content })

      // Get simulated AI response
      const response = getSimulatedResponse(content)

      // Add thinking event if present
      if (response.thinking) {
        debugEvents.addEvent('ASSISTANT_THINKING', { thinking: response.thinking })
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
          if (CRITICAL_TOOLS.includes(tc.name as ToolName)) {
            setOrchestratorState('awaiting_approval')
            debugEvents.addEvent('AWAITING_APPROVAL', tc)

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
            isProcessingRef.current = false // Release lock
            debugEvents.addEvent('STREAM_END', { waitingForApproval: true })
            return // Stop here and wait for approval
          }

          // Execute non-critical tools
          try {
            const result = await executeToolCall(toolCall, assistantMessage.id)

            // Smart chaining: If search_ticker returns results, auto-analyze the first one
            if (tc.name === 'search_ticker' && result) {
              const searchResult = result as { matches: Array<{ symbol: string; name: string }> }
              if (searchResult.matches.length > 0) {
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
                debugEvents.addEvent('ASSISTANT_THINKING', {
                  thinking: `Chaining to get_financials for ${searchResult.matches[0].symbol}`,
                })

                // Execute the chained tool
                const financialResult = await executeToolCall(followUp.toolCalls![0], followUpId)

                // Offer to show chart after financials
                if (financialResult) {
                  await new Promise((r) => setTimeout(r, 300))
                  const chartOfferId = generateId()
                  const chartOffer: Message = {
                    id: chartOfferId,
                    role: 'assistant',
                    content: `I've got the financials for ${searchResult.matches[0].symbol}. Would you like me to show you an interactive chart? Just say "show chart" or click the View Chart button above.`,
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, chartOffer])
                }
              }
            }

            // Smart chaining: After get_financials, offer chart
            if (tc.name === 'get_financials' && result && !response.toolCalls?.some(t => t.name === 'search_ticker')) {
              const data = result as { symbol: string }
              await new Promise((r) => setTimeout(r, 300))
              const chartOfferId = generateId()
              const chartOffer: Message = {
                id: chartOfferId,
                role: 'assistant',
                content: `Here's the analysis for ${data.symbol}. You can click "View Chart" for an interactive price chart, or "Buy"/"Sell" to simulate a trade.`,
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, chartOffer])
            }
          } catch (error) {
            logger.error('Tool execution failed:', error)
          }
        }
      }

      setIsLoading(false)
      isProcessingRef.current = false // Release lock
      setOrchestratorState('completed')
      debugEvents.addEvent('STREAM_END', {})
    },
    [isLoading, executeToolCall, debugEvents]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setOrchestratorState('idle')
    setPendingApproval(null)
    setError(null)
    isProcessingRef.current = false // Ensure lock is released on clear
    debugEvents.clearEvents()
  }, [debugEvents])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
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
  }
}
