import { useState, useRef, useCallback, useEffect } from 'react'
import {
  useToast,
  useLocalStorage,
  useThrottledCallback,
} from '@clarity-chat/react/internal'
// Use local stub to avoid tiktoken WASM issues with Turbopack
import { useTokenTrackerStub as useTokenTracker } from './useTokenTrackerStub'
import type { Message, AIStatus } from '@clarity-chat/types'
import type { Citation } from '@/lib/ai/rag'
import type {
  StreamingStatus,
  SavedConversation,
  Source,
  ToolUseProgress,
  ToolResult,
} from '../types'
import {
  SESSION_ID_KEY,
  MESSAGES_KEY,
  CONVERSATION_TTL_MS,
  STREAM_THROTTLE_MS,
  MAX_RETRY_ATTEMPTS,
  INITIAL_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  RETRY_BACKOFF_MULTIPLIER,
  MODEL_MAX_TOKENS,
  TOKEN_WARNING_THRESHOLD,
  TOKEN_CRITICAL_THRESHOLD,
  generateSessionId,
} from '../constants'
import {
  normalizeSourceUrl,
  normalizeLinksInContent,
  generateExportContent,
  downloadExport,
} from '../utils'
import { useOfflineQueue, createPendingMessage } from './'

export function useDocsChat() {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<AIStatus | undefined>(undefined)
  const [streamingStatus, setStreamingStatus] =
    useState<StreamingStatus>('idle')
  const [retryCount, setRetryCount] = useState(0)
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([])
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([])
  const [currentToolUse, setCurrentToolUse] = useState<ToolUseProgress | null>(
    null
  )
  const [toolResults, setToolResults] = useState<Map<string, ToolResult>>(
    new Map()
  )

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const partialContentRef = useRef<string>('')

  // Library hooks
  const toast = useToast()

  // Offline queue hook
  const { isOnline, messageQueue, queueMessage, handleNetworkStatusChange } =
    useOfflineQueue({
      onQueueMessage: () =>
        toast.info('Message queued. Will be sent when you reconnect.'),
      onProcessQueue: (queue) =>
        toast.info(
          `You're back online! ${queue.length} message${
            queue.length > 1 ? 's' : ''
          } queued.`
        ),
      onStatusChange: (online) => {
        if (!online) {
          toast.warning(
            'You are offline. Messages will be queued and sent when you reconnect.'
          )
        }
      },
    })

  // Token tracking
  const tokenTracker = useTokenTracker({
    modelName: 'claude-3-sonnet',
    maxTokens: MODEL_MAX_TOKENS,
    warningThreshold: TOKEN_WARNING_THRESHOLD,
    criticalThreshold: TOKEN_CRITICAL_THRESHOLD,
    onWarning: () => toast.warning('Approaching context limit'),
    onCritical: () =>
      toast.error('Near context limit - consider clearing conversation'),
  })

  // Session ID
  const [sessionId] = useLocalStorage<string>(
    SESSION_ID_KEY,
    generateSessionId()
  )

  // Persistent conversation storage
  const [savedConversation, setSavedConversation, clearSavedConversation] =
    useLocalStorage<SavedConversation | null>(MESSAGES_KEY, null)

  // Initialize messages from saved conversation
  useEffect(() => {
    if (savedConversation) {
      const isValid =
        savedConversation.timestamp &&
        Date.now() - savedConversation.timestamp < CONVERSATION_TTL_MS

      if (isValid && savedConversation.messages) {
        setMessages(savedConversation.messages)
      } else {
        clearSavedConversation()
      }
    }
  }, []) // Only run on mount

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      setSavedConversation({
        messages,
        timestamp: Date.now(),
      })
    }
  }, [messages, setSavedConversation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // Throttled message update for streaming
  const updateStreamingMessage = useThrottledCallback(
    (messageId: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content } : m))
      )
    },
    STREAM_THROTTLE_MS
  )

  // Calculate exponential backoff delay for retries
  const calculateRetryDelay = useCallback((attempt: number): number => {
    const delay =
      INITIAL_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt)
    return Math.min(delay, MAX_RETRY_DELAY_MS)
  }, [])

  // Check if an error is retryable
  const isRetryableError = useCallback((error: Error): boolean => {
    const errorMsg = error.message.toLowerCase()
    return (
      error.name === 'TypeError' ||
      errorMsg.includes('network') ||
      errorMsg.includes('fetch') ||
      errorMsg.includes('429') ||
      errorMsg.includes('500') ||
      errorMsg.includes('502') ||
      errorMsg.includes('503') ||
      errorMsg.includes('504')
    )
  }, [])

  // Simple heuristics to generate follow-up questions based on content
  const generateFollowUps = useCallback((content: string) => {
    const suggestions: string[] = []
    const lowerContent = content.toLowerCase()

    if (
      lowerContent.includes('install') ||
      lowerContent.includes('npm') ||
      lowerContent.includes('yarn')
    ) {
      suggestions.push('How do I configure the theme?')
    }
    if (
      lowerContent.includes('theme') ||
      lowerContent.includes('color') ||
      lowerContent.includes('style')
    ) {
      suggestions.push('Show me a dark mode example')
    }
    if (
      lowerContent.includes('component') ||
      lowerContent.includes('ui') ||
      lowerContent.includes('button')
    ) {
      suggestions.push('What hooks are available?')
    }
    if (
      lowerContent.includes('hook') ||
      lowerContent.includes('usechat') ||
      lowerContent.includes('state')
    ) {
      suggestions.push('How do I handle streaming?')
    }
    if (
      lowerContent.includes('stream') ||
      lowerContent.includes('real-time') ||
      lowerContent.includes('sse')
    ) {
      suggestions.push('How do I optimize token usage?')
    }

    setSuggestedFollowUps(suggestions.slice(0, 3))
  }, [])

  // Internal send message handler with validation and automatic retry
  const handleSendMessageInternal = useCallback(
    async (content: string, currentRetry = 0) => {
      const trimmedContent = content.trim()
      if (!trimmedContent) {
        toast.warning('Please enter a message')
        return
      }

      // Only add user message on first attempt
      if (currentRetry === 0) {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          chatId: 'docs-assistant',
          role: 'user',
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'sent',
        }
        setMessages((prev) => [...prev, userMessage])
        tokenTracker.addMessage({ role: 'user', content })
        setSuggestedFollowUps([]) // Clear previous suggestions
      }

      setIsLoading(true)
      setStreamingStatus('connecting')
      setRetryCount(currentRetry)
      setCurrentCitations([])
      partialContentRef.current = ''
      setAiStatus({
        stage: 'researching',
        topic:
          currentRetry > 0
            ? `Retrying (${currentRetry}/${MAX_RETRY_ATTEMPTS})...`
            : 'Searching documentation',
        startedAt: new Date(),
      })

      try {
        abortControllerRef.current?.abort()
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        const response = await fetch('/api/docs-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            sessionId,
            currentPath:
              typeof window !== 'undefined' ? window.location.pathname : '/',
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          chatId: 'docs-assistant',
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'streaming',
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
        setStreamingStatus('streaming')
        setAiStatus({
          stage: 'generating',
          topic: 'Generating response',
          startedAt: new Date(),
        })

        let accumulatedContent = ''
        let sources: Source[] = []
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // Keep the last line in the buffer if it doesn't end with a newline
          // or if it's the last element (which might be empty or incomplete)
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === 'text' && data.content) {
                  accumulatedContent += data.content
                  partialContentRef.current = accumulatedContent
                  updateStreamingMessage(
                    assistantMessage.id,
                    accumulatedContent
                  )
                } else if (data.type === 'tool_use') {
                  // Tool is being invoked - show progress
                  const toolUse: ToolUseProgress = {
                    tool_name: data.tool_name,
                    tool_use_id: data.tool_use_id,
                    tool_input: data.tool_input,
                  }
                  setCurrentToolUse(toolUse)
                  setAiStatus({
                    stage: 'generating',
                    topic: `Using ${data.tool_name.replace('_', ' ')}...`,
                    startedAt: new Date(),
                  })
                } else if (data.type === 'tool_result') {
                  // Tool completed - store result and clear progress
                  const toolResult: ToolResult = {
                    tool_name: data.tool_name,
                    tool_use_id: data.tool_use_id,
                    tool_result: data.tool_result,
                  }
                  setToolResults((prev) => {
                    const newMap = new Map(prev)
                    newMap.set(
                      assistantMessage.id + ':' + data.tool_use_id,
                      toolResult
                    )
                    return newMap
                  })
                  setCurrentToolUse(null)
                  setAiStatus({
                    stage: 'generating',
                    topic: 'Generating response',
                    startedAt: new Date(),
                  })
                } else if (data.type === 'sources' && data.data?.sources) {
                  sources = data.data.sources
                  const citations: Citation[] = sources
                    .filter((s) => s && (s.title || s.source || s.url))
                    .map((source, index) => ({
                      id: source.id || `citation-${index}-${Date.now()}`,
                      source: (
                        source.title ||
                        source.source ||
                        'Documentation'
                      ).trim(),
                      chunkText:
                        source.chunkText ||
                        source.title ||
                        source.source ||
                        'See documentation for more details',
                      confidence:
                        Number(source.score) || Number(source.confidence) || 0,
                      url: normalizeSourceUrl(
                        source.url || '',
                        source.title || source.source || ''
                      ),
                    }))
                  setCurrentCitations(citations)
                } else if (data.type === 'error') {
                  throw new Error(data.content || 'Stream error')
                } else if (data.type === 'done') {
                  const finalContent =
                    normalizeLinksInContent(accumulatedContent)
                  tokenTracker.addMessage({
                    role: 'assistant',
                    content: finalContent,
                  })
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? {
                            ...m,
                            content: finalContent,
                            status: 'sent' as const,
                          }
                        : m
                    )
                  )
                  generateFollowUps(finalContent)
                  setAiStatus(undefined)
                }
              } catch (parseError) {
                if (process.env.NODE_ENV === 'development') {
                  console.debug('[DocsAssistant] JSON parse error:', parseError)
                }
              }
            }
          }
        }

        // Finalize any streaming message that didn't receive 'done'
        if (accumulatedContent && accumulatedContent.length > 0) {
          const finalContent = normalizeLinksInContent(accumulatedContent)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id && m.status === 'streaming'
                ? { ...m, content: finalContent, status: 'sent' as const }
                : m
            )
          )
          tokenTracker.addMessage({ role: 'assistant', content: finalContent })
          generateFollowUps(finalContent)
        }

        abortControllerRef.current = null
        setIsLoading(false)
        setStreamingStatus('idle')
        setRetryCount(0)
        setAiStatus(undefined)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          if (partialContentRef.current) {
            setMessages((prev) =>
              prev.map((m) =>
                m.status === 'streaming'
                  ? {
                      ...m,
                      content:
                        partialContentRef.current +
                        '\n\n_(Response interrupted)_',
                      status: 'sent' as const,
                    }
                  : m
              )
            )
            toast.info('Response interrupted. Partial content preserved.')
          }
          setIsLoading(false)
          setStreamingStatus('idle')
          setAiStatus(undefined)
          return
        }

        abortControllerRef.current = null
        const err = error instanceof Error ? error : new Error('Unknown error')
        const errorMsg = err.message

        // Retry with exponential backoff
        if (isRetryableError(err) && currentRetry < MAX_RETRY_ATTEMPTS) {
          const retryDelay = calculateRetryDelay(currentRetry)
          setStreamingStatus('retrying')
          toast.warning(
            `Connection issue. Retrying in ${Math.round(retryDelay / 1000)}s...`,
            'Retry'
          )
          setTimeout(() => {
            handleSendMessageInternal(content, currentRetry + 1)
          }, retryDelay)
          return
        }

        setStreamingStatus('error')

        if (
          partialContentRef.current &&
          partialContentRef.current.length > 50
        ) {
          setMessages((prev) =>
            prev.map((m) =>
              m.status === 'streaming'
                ? {
                    ...m,
                    content:
                      partialContentRef.current +
                      '\n\n_(Stream interrupted - click retry to continue)_',
                    status: 'error' as const,
                  }
                : m
            )
          )
          toast.warning(
            'Response interrupted. Partial content preserved - use retry to continue.'
          )
        } else {
          const retryInfo =
            currentRetry > 0 ? ` (after ${currentRetry} retries)` : ''
          toast.error(`${errorMsg}${retryInfo}`, 'Failed to get response')
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            chatId: 'docs-assistant',
            role: 'assistant',
            content: `I encountered an error while processing your request. ${errorMsg}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'error',
          }
          setMessages((prev) => [...prev, errorMessage])
        }

        setIsLoading(false)
        setRetryCount(0)
        setAiStatus(undefined)
      }
    },
    [
      messages,
      sessionId,
      toast,
      updateStreamingMessage,
      tokenTracker,
      isRetryableError,
      calculateRetryDelay,
      generateFollowUps,
    ]
  )

  // Public send message handler
  const handleSendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim()
      if (!trimmedContent) {
        toast.warning('Please enter a message')
        return
      }

      if (!isOnline) {
        const queued = queueMessage(trimmedContent)
        const pendingMessage = createPendingMessage(queued)
        setMessages((prev) => [...prev, pendingMessage])
        return
      }

      await handleSendMessageInternal(trimmedContent, 0)
    },
    [isOnline, queueMessage, handleSendMessageInternal, toast]
  )

  // Message retry handler
  const handleMessageRetry = useCallback(
    (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex > 0) {
        const previousMessage = messages[messageIndex - 1]
        if (previousMessage.role === 'user') {
          setMessages((prev) => prev.filter((m) => m.id !== messageId))
          handleSendMessage(previousMessage.content)
          toast.info('Retrying message...')
        }
      }
    },
    [messages, toast, handleSendMessage]
  )

  // Feedback handler
  const handleFeedback = useCallback(
    async (messageId: string, type: 'up' | 'down') => {
      // Optimistically update UI
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                feedback: {
                  type,
                  timestamp: new Date(),
                },
              }
            : m
        )
      )

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messageId,
            feedbackType: type,
            sessionId,
            timestamp: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          throw new Error(`Feedback submission failed: ${response.status}`)
        }

        toast.success(
          type === 'up'
            ? 'Thanks for your feedback!'
            : "Feedback received. We'll work on improving."
        )
      } catch (error) {
        console.error('Failed to submit feedback:', error)
        toast.error('Failed to submit feedback. Please try again.')
        // Revert optimistic update on failure
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, feedback: undefined } : m
          )
        )
      }
    },
    [sessionId, toast]
  )

  // Export handler
  const handleExportWithFormat = useCallback(
    async (options: {
      format: string
      includeMetadata?: boolean
      includeImages?: boolean
    }) => {
      try {
        const exportResult = generateExportContent(messages, sessionId, {
          ...options,
          format: options.format as 'json' | 'html' | 'markdown',
        })
        const downloadResult = downloadExport(exportResult)
        if (downloadResult.success) {
          toast.success(
            `Conversation exported as ${exportResult.extension.toUpperCase()}`
          )
        } else {
          throw new Error(downloadResult.error || 'Download failed')
        }
      } catch (error) {
        console.error('Failed to export conversation:', error)
        toast.error('Failed to export conversation')
        throw error
      }
    },
    [messages, sessionId, toast]
  )

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setStreamingStatus('idle')
      setAiStatus(undefined)
      // If we stopped during streaming, mark the message as interrupted
      setMessages((prev) =>
        prev.map((m) =>
          m.status === 'streaming'
            ? {
                ...m,
                content: m.content + '\n\n_(Stopped by user)_',
                status: 'sent' as const,
              }
            : m
        )
      )
    }
  }, [])

  const handleClear = useCallback(() => {
    // Abort any ongoing request first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setStreamingStatus('idle')
      setAiStatus(undefined)
    }

    setMessages([])
    clearSavedConversation()
    tokenTracker.clear()
    setCurrentCitations([])
    setSuggestedFollowUps([])
    setCurrentToolUse(null)
    setToolResults(new Map())
    toast.info('Conversation cleared')
  }, [clearSavedConversation, tokenTracker, toast])

  return {
    messages,
    setMessages,
    isLoading,
    aiStatus,
    streamingStatus,
    currentCitations,
    sessionId,
    tokenTracker,
    isOnline,
    messageQueue,
    suggestedFollowUps,
    currentToolUse,
    toolResults,
    handleSendMessage,
    handleMessageRetry,
    handleFeedback,
    handleExportWithFormat,
    handleClear,
    handleStop,
    handleNetworkStatusChange,
  }
}
