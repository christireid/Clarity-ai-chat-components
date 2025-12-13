'use client'

/**
 * useAIToolOrchestration Hook
 *
 * Real AI-powered tool orchestration using OpenAI via Vercel AI SDK.
 * Streams responses, handles tool calls, and manages human-in-the-loop approval.
 */

import { useChat, type Message as AIMessage } from 'ai/react'
import { useState, useCallback, useRef, useEffect } from 'react'
import type {
  Message,
  ToolCallState,
  OrchestratorState,
  ToolName,
} from '../lib/types'
import { CRITICAL_TOOLS } from '../lib/types'
import { useDebugEvents } from './useDebugEvents'

interface UseAIToolOrchestrationReturn {
  messages: Message[]
  isLoading: boolean
  orchestratorState: OrchestratorState
  pendingApproval: ToolCallState | null
  isProcessingApproval: boolean
  sendMessage: (content: string) => Promise<void>
  handleApprove: () => Promise<void>
  handleReject: () => void
  clearMessages: () => void
  debugEvents: ReturnType<typeof useDebugEvents>
  isAIMode: true
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useAIToolOrchestration(): UseAIToolOrchestrationReturn {
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>('idle')
  const [pendingApproval, setPendingApproval] = useState<ToolCallState | null>(null)
  const [isProcessingApproval, setIsProcessingApproval] = useState(false)
  const [convertedMessages, setConvertedMessages] = useState<Message[]>([])

  const debugEvents = useDebugEvents()
  const lastPriceRef = useRef<Record<string, number>>({})

  // Use AI SDK's useChat hook
  const {
    messages: aiMessages,
    isLoading,
    append,
    setMessages: setAIMessages,
  } = useChat({
    api: '/examples/tool-calling-showcase/api/chat',
    onResponse: () => {
      setOrchestratorState('streaming')
      debugEvents.addEvent('STREAM_START', {})
    },
    onFinish: (message) => {
      setOrchestratorState('completed')
      debugEvents.addEvent('STREAM_END', {})

      // Check for tool calls that need approval
      if (message.toolInvocations) {
        for (const invocation of message.toolInvocations) {
          if (CRITICAL_TOOLS.includes(invocation.toolName as ToolName)) {
            if (invocation.state === 'call') {
              setOrchestratorState('awaiting_approval')
              setPendingApproval({
                id: invocation.toolCallId,
                name: invocation.toolName as ToolName,
                args: invocation.args as Record<string, unknown>,
                status: 'awaiting_approval',
                startTime: Date.now(),
              })
              debugEvents.addEvent('AWAITING_APPROVAL', invocation)
            }
          }
        }
      }
    },
    onError: (error) => {
      console.error('AI Chat error:', error)
      debugEvents.addEvent('TOOL_ERROR', { error: error.message })
      setOrchestratorState('completed')
    },
  })

  // Convert AI SDK messages to our Message format
  useEffect(() => {
    const converted: Message[] = aiMessages.map((msg) => {
      const toolCalls: ToolCallState[] = []

      if (msg.toolInvocations) {
        for (const invocation of msg.toolInvocations) {
          const status =
            invocation.state === 'result'
              ? 'complete'
              : invocation.state === 'call'
                ? CRITICAL_TOOLS.includes(invocation.toolName as ToolName)
                  ? 'awaiting_approval'
                  : 'executing'
                : 'pending'

          toolCalls.push({
            id: invocation.toolCallId,
            name: invocation.toolName as ToolName,
            args: invocation.args as Record<string, unknown>,
            status,
            result: invocation.state === 'result' ? invocation.result : undefined,
            startTime: Date.now(),
          })

          // Log tool events
          if (invocation.state === 'call') {
            debugEvents.addEvent('TOOL_CALL', invocation.args, invocation.toolName)
          } else if (invocation.state === 'result') {
            debugEvents.addEvent('TOOL_RESULT', invocation.result, invocation.toolName)

            // Store price for reference
            if (invocation.toolName === 'get_financials' && invocation.result) {
              const data = invocation.result as { symbol: string; currentPrice: number }
              if (data.currentPrice) {
                lastPriceRef.current[data.symbol] = data.currentPrice
              }
            }
          }
        }
      }

      return {
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        timestamp: new Date(),
      }
    })

    setConvertedMessages(converted)
  }, [aiMessages, debugEvents])

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setOrchestratorState('streaming')
      debugEvents.addEvent('USER_MESSAGE', { content })

      await append({
        role: 'user',
        content,
      })
    },
    [isLoading, append, debugEvents]
  )

  // Handle approval for critical tools
  const handleApprove = useCallback(async () => {
    if (!pendingApproval) return

    setIsProcessingApproval(true)
    debugEvents.addEvent('APPROVAL_GRANTED', { toolId: pendingApproval.id })

    // For now, just mark as complete - the tool already executed
    // In a production app, you'd hold execution until approval
    setPendingApproval(null)
    setIsProcessingApproval(false)
    setOrchestratorState('completed')
  }, [pendingApproval, debugEvents])

  const handleReject = useCallback(() => {
    if (!pendingApproval) return

    debugEvents.addEvent('APPROVAL_DENIED', { toolId: pendingApproval.id })
    setPendingApproval(null)
    setOrchestratorState('completed')
  }, [pendingApproval, debugEvents])

  const clearMessages = useCallback(() => {
    setAIMessages([])
    setConvertedMessages([])
    setOrchestratorState('idle')
    setPendingApproval(null)
    debugEvents.clearEvents()
  }, [setAIMessages, debugEvents])

  return {
    messages: convertedMessages,
    isLoading,
    orchestratorState,
    pendingApproval,
    isProcessingApproval,
    sendMessage,
    handleApprove,
    handleReject,
    clearMessages,
    debugEvents,
    isAIMode: true,
  }
}
