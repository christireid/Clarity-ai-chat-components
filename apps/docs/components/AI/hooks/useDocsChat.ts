import { useState, useRef, useCallback, useEffect } from 'react'
import {
  useToast,
  useLocalStorage,
  useThrottledCallback,
} from '@clarity-chat/react'
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

/**
 * Provider status returned from health check endpoint
 */
interface ProviderInfo {
  active: string
  model: string
  isDemoMode: boolean
  summary: string
  available: Array<{ name: string; model: string }>
}
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
import { logger } from '@/lib/logger'

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
  // Provider status - tracks which AI provider is active
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const partialContentRef = useRef<string>('')
  const isRequestInProgressRef = useRef<boolean>(false)
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  const [sessionId] = useLocalStorage(
    SESSION_ID_KEY,
    generateSessionId()
  )

  // Persistent conversation storage
  const [savedConversation, setSavedConversation, clearSavedConversation] =
    useLocalStorage(MESSAGES_KEY, null as SavedConversation | null)

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
      abortControllerRef.current = null
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current)
        requestTimeoutRef.current = null
      }
      isRequestInProgressRef.current = false
    }
  }, [])

  // Fetch provider status on mount with AbortController for cleanup
  useEffect(() => {
    const controller = new AbortController()

    async function fetchProviderStatus() {
      try {
        const response = await fetch('/api/docs-assistant', {
          signal: controller.signal,
        })
        if (response.ok) {
          const data = await response.json()
          if (data.provider) {
            setProviderInfo(data.provider)
            setApiError(null)
            // Show demo mode notification on first load
            if (data.provider.isDemoMode) {
              toast.info(
                'Running in demo mode. Configure an API key for full AI functionality.',
                'Demo Mode'
              )
            }
          }
        }
      } catch (error) {
        // Ignore abort errors - component unmounted
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        logger.error('Failed to fetch provider status:', error)
        setApiError('Unable to connect to AI service')
      }
    }
    fetchProviderStatus()

    return () => {
      controller.abort()
    }
  }, [toast])

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

      // Prevent duplicate concurrent requests
      if (isRequestInProgressRef.current && currentRetry === 0) {
        toast.info('Request already in progress. Please wait...')
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
      isRequestInProgressRef.current = true
      setAiStatus({
        stage: 'researching',
        topic:
          currentRetry > 0
            ? `Retrying (${currentRetry}/${MAX_RETRY_ATTEMPTS})...`
            : 'Searching documentation',
        startedAt: new Date(),
      })

      // Set request timeout (5 minutes)
      const REQUEST_TIMEOUT_MS = 5 * 60 * 1000
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current)
      }
      requestTimeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
          toast.error('Request timed out. Please try again.')
        }
      }, REQUEST_TIMEOUT_MS)

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
          const errorText = await response.text().catch(() => 'Unknown error')
          let errorMessage = `API error: ${response.status}`
          
          // Provide more specific error messages
          if (response.status === 401) {
            errorMessage = 'Authentication failed. Please check your API key.'
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait before trying again.'
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          } else if (errorText && errorText.length < 200) {
            try {
              const errorJson = JSON.parse(errorText)
              if (errorJson.error) {
                errorMessage = errorJson.error
              }
            } catch {
              // Not JSON, use text as-is if short
              if (errorText.length < 100) {
                errorMessage = errorText
              }
            }
          }
          
          throw new Error(errorMessage)
        }
        
        // Clear any previous API errors on successful response
        setApiError(null)

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error('No response body received from server')
        }

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
        // Keep isLoading true until first content arrives
        setStreamingStatus('streaming')
        setAiStatus({
          stage: 'generating',
          topic: 'Generating response',
          startedAt: new Date(),
        })

        let accumulatedContent = ''
        let sources: Source[] = []
        let buffer = ''
        let hasReceivedContent = false

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
                  // Backend sends accumulated content, so use it directly
                  // Don't accumulate on frontend since backend already accumulates
                  accumulatedContent = data.content
                  partialContentRef.current = accumulatedContent
                  // Set isLoading to false once we receive first content
                  if (!hasReceivedContent) {
                    hasReceivedContent = true
                    setIsLoading(false)
                  }
                  updateStreamingMessage(
                    assistantMessage.id,
                    accumulatedContent
                  )
                } else if (data.type === 'text' && !data.content) {
                    // Log empty text chunks for debugging
                    logger.debug('Received empty text chunk:', data)
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
                  // If error contains API key issue, show helpful message
                  const errorMsg = typeof data.content === 'string' ? data.content : 'Stream error'
                  setApiError(errorMsg)
                  
                  if (errorMsg.includes('API key') || errorMsg.includes('Invalid API')) {
                    accumulatedContent = `⚠️ **API Configuration Issue**\n\n${errorMsg}\n\n**Demo Mode Active:** Since no valid API keys are configured, I'm running in demo mode with limited responses.\n\nTo enable full AI-powered responses:\n1. Get an API key from [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)\n2. Add it to \`.env.local\`:\n   \`\`\`\n   OPENAI_API_KEY=sk-your-actual-key\n   # or\n   ANTHROPIC_API_KEY=sk-ant-your-actual-key\n   \`\`\`\n3. Restart the dev server\n\n**What I can help with in demo mode:**\n- Installation & getting started\n- Component and hook references\n- Theming & customization\n- Code examples\n\nTry asking: "How do I install Clarity Chat?" or "What components are available?"`
                    updateStreamingMessage(assistantMessage.id, accumulatedContent)
                    // Don't throw - let it complete with the helpful message
                  } else {
                    throw new Error(errorMsg)
                  }
                } else if (data.type === 'done') {
                  const finalContent =
                    normalizeLinksInContent(accumulatedContent)
                  
                  // Always finalize the message, even if content is empty
                  // This handles cases where the stream completes without text chunks
                  if (finalContent && finalContent.length > 0) {
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
                  } else {
                    // No content received - mark as error or show helpful message
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMessage.id
                          ? {
                              ...m,
                              content: 'I apologize, but I didn\'t receive any content in the response. Please try asking your question again, or check if API keys are configured.',
                              status: 'error' as const,
                            }
                          : m
                      )
                    )
                    toast.warning('No content received in response. Check API configuration.')
                  }
                  setAiStatus(undefined)
                  setIsLoading(false)
                }
              } catch (parseError) {
                logger.debug('JSON parse error (non-fatal):', parseError)
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
          setIsLoading(false)
          setAiStatus(undefined)
        } else if (assistantMessage.status === 'streaming') {
          // Stream completed but no content was received
          // This can happen if the stream ends without sending text chunks
          const errorMessage = apiError || 'No content received in response. This might be due to a configuration issue or API error.'
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id && m.status === 'streaming'
                ? {
                    ...m,
                    content: `I apologize, but I didn't receive any content in the response.\n\n**Possible causes:**\n- API key configuration issue\n- Network connectivity problem\n- Server error\n\n**Error:** ${errorMessage}\n\nPlease check your API configuration or try asking again.`,
                    status: 'error' as const,
                  }
                : m
            )
          )
          setIsLoading(false)
          setAiStatus(undefined)
          toast.error('No content received. Check API configuration or try again.')
        }

        abortControllerRef.current = null
        isRequestInProgressRef.current = false
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current)
          requestTimeoutRef.current = null
        }
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
          abortControllerRef.current = null
          isRequestInProgressRef.current = false
          if (requestTimeoutRef.current) {
            clearTimeout(requestTimeoutRef.current)
            requestTimeoutRef.current = null
          }
          setIsLoading(false)
          setStreamingStatus('idle')
          setAiStatus(undefined)
          return
        }

        abortControllerRef.current = null
        isRequestInProgressRef.current = false
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current)
          requestTimeoutRef.current = null
        }
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

  // Regenerate handler - removes assistant message and resends the previous user message
  const handleRegenerate = useCallback(
    (messageId: string) => {
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) {
        toast.error('Message not found')
        return
      }

      const messageToRegenerate = messages[messageIndex]
      
      // Only regenerate assistant messages
      if (messageToRegenerate.role !== 'assistant') {
        toast.warning('Can only regenerate assistant messages')
        return
      }

      // Find the previous user message
      if (messageIndex === 0) {
        toast.warning('No previous message to regenerate from')
        return
      }

      const previousMessage = messages[messageIndex - 1]
      if (previousMessage.role !== 'user') {
        toast.warning('Previous message must be from user')
        return
      }

      // Remove the assistant message and any subsequent messages in the same turn
      // (in case there are tool results or follow-ups)
      setMessages((prev) => {
        const newMessages = [...prev]
        // Remove the assistant message and everything after it until the next user message
        const removeFromIndex = messageIndex
        const nextUserIndex = newMessages.findIndex(
          (m, idx) => idx > removeFromIndex && m.role === 'user'
        )
        const removeToIndex = nextUserIndex === -1 ? newMessages.length : nextUserIndex
        newMessages.splice(removeFromIndex, removeToIndex - removeFromIndex)
        return newMessages
      })

      // Clear any related state
      setCurrentCitations([])
      setSuggestedFollowUps([])
      setCurrentToolUse(null)
      setToolResults(new Map())

      // Resend the user message
      toast.info('Regenerating response...')
      handleSendMessage(previousMessage.content)
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
        logger.error('Failed to submit feedback:', error)
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
        logger.error('Failed to export conversation:', error)
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
      isRequestInProgressRef.current = false
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current)
        requestTimeoutRef.current = null
      }
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
    }
    isRequestInProgressRef.current = false
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current)
      requestTimeoutRef.current = null
    }
    setIsLoading(false)
    setStreamingStatus('idle')
    setAiStatus(undefined)

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
    // Provider info for UI display
    providerInfo,
    apiError,
    isDemoMode: providerInfo?.isDemoMode ?? false,
    handleSendMessage,
    handleMessageRetry,
    handleRegenerate,
    handleFeedback,
    handleExportWithFormat,
    handleClear,
    handleStop,
    handleNetworkStatusChange,
  }
}
