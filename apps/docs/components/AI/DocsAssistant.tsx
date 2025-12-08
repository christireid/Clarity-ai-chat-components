'use client'

/**
 * DocsAssistant - Documentation Assistant Component
 *
 * A fully integrated documentation assistant that leverages the @clarity-chat/react
 * library components and hooks instead of custom implementations.
 *
 * Library Components Used:
 * - ChatWindow - Main chat interface
 * - CitationCard - Display RAG sources with confidence scores
 * - EmptyChatState - Empty state with starter prompts (replaces custom)
 * - ErrorBoundary - Error handling wrapper
 * - MessageSearch - Search through conversation history (Cmd+K)
 * - NetworkStatus - Connection status indicator
 * - TokenCounter - Display token usage and cost estimates
 * - VoiceInput - Voice input support
 *
 * Library Hooks Used:
 * - useKeyboardShortcuts - Keyboard handling (replaces custom)
 * - useClipboard - Copy functionality
 * - useFocusTrap - Modal focus management (WCAG compliance)
 * - useFocusRestoration - Restore focus on close
 * - useLocalStorage - Session ID & conversation storage (replaces custom)
 * - useReducedMotion - Accessibility preferences
 * - useThrottledCallback - Throttled streaming updates (replaces custom)
 * - useToast - Toast notifications
 * - useTokenTracker - Track conversation token usage and costs
 *
 * Animation Utilities:
 * - createFadeVariant - Fade animation presets
 * - createSlideVariant - Slide animation presets
 *
 * Keyboard Shortcuts:
 * - Cmd+. - Toggle assistant
 * - Cmd+K - Toggle message search (when open)
 * - ? - Show keyboard shortcuts help
 * - Escape - Close assistant or search
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Search } from 'lucide-react'
import {
  // Components
  ChatWindow,
  CitationCard,
  EmptyChatState,
  ErrorBoundary,
  ExportDialog,
  MessageSearch,
  NetworkStatus,
  TokenCounter,
  VoiceInput,
  // Hooks
  useToast,
  useKeyboardShortcuts,
  useClipboard,
  useLocalStorage,
  useThrottledCallback,
  useReducedMotion,
  useTokenTracker,
  // Types
  type PromptSuggestion,
  type Citation,
  // Accessibility hooks
  useFocusTrap,
  useFocusRestoration,
} from '@clarity-chat/react'
import type { Message, AIStatus } from '@clarity-chat/types'
import { ChatButton } from './ChatButton'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { cn } from '@/lib/utils'

// Local imports from extracted modules
import type { DocsAssistantProps, StreamingStatus, SavedConversation, Source } from './types'
import {
  SESSION_ID_KEY,
  MESSAGES_KEY,
  CONVERSATION_TTL_MS,
  STREAM_THROTTLE_MS,
  CLIPBOARD_TIMEOUT_MS,
  TOAST_DURATION_MS,
  FOCUS_DELAY_MS,
  MAX_RETRY_ATTEMPTS,
  INITIAL_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  RETRY_BACKOFF_MULTIPLIER,
  MODEL_MAX_TOKENS,
  TOKEN_COST_PER_TOKEN,
  TOKEN_WARNING_THRESHOLD,
  TOKEN_CRITICAL_THRESHOLD,
  BACKDROP_VARIANTS,
  DIALOG_VARIANTS_REDUCED,
  DIALOG_VARIANTS_NORMAL,
  DOCS_STARTER_PROMPTS,
  generateSessionId,
} from './constants'
import {
  extractCodeBlocks,
  isPlaygroundCompatible,
  openInPlayground,
  normalizeSourceUrl,
  normalizeLinksInContent,
  generateExportContent,
  downloadExport,
} from './utils'
import {
  useOfflineQueue,
  createPendingMessage,
  useBranching,
} from './hooks'

// ============================================================================
// Inner Component (wrapped by ErrorBoundary)
// ============================================================================

function DocsAssistantInner({ className }: DocsAssistantProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<AIStatus | undefined>(undefined)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [streamingStatus, setStreamingStatus] = useState<StreamingStatus>('idle')
  const [retryCount, setRetryCount] = useState(0)

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const partialContentRef = useRef<string>('')

  // Library hooks
  const toast = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { copy } = useClipboard({
    timeout: CLIPBOARD_TIMEOUT_MS,
    onSuccess: () => toast.success('Copied to clipboard'),
    onError: () => toast.error('Failed to copy'),
  })

  // Focus trap for modal accessibility
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  // Offline queue hook
  const {
    isOnline,
    messageQueue,
    queueMessage,
    handleNetworkStatusChange,
  } = useOfflineQueue({
    onQueueMessage: () => toast.info('Message queued. Will be sent when you reconnect.'),
    onProcessQueue: (queue) => toast.info(`You're back online! ${queue.length} message${queue.length > 1 ? 's' : ''} queued.`),
    onStatusChange: (online) => {
      if (!online) {
        toast.warning('You are offline. Messages will be queued and sent when you reconnect.')
      }
    },
  })

  // Branching hook
  const {
    branchState,
    currentBranch,
    switchBranch: switchBranchInternal,
    hasBranches,
  } = useBranching({
    onBranchSwitch: (branch) => {
      setMessages(branch.messages)
      toast.info(`Switched to: ${branch.name}`)
    },
  })

  // Token tracking using library hook
  const {
    tokens: totalTokens,
    isNearLimit,
    isCritical,
    addMessage: trackMessage,
    clear: clearTokens,
  } = useTokenTracker({
    modelName: 'claude-3-sonnet',
    maxTokens: MODEL_MAX_TOKENS,
    warningThreshold: TOKEN_WARNING_THRESHOLD,
    criticalThreshold: TOKEN_CRITICAL_THRESHOLD,
    onWarning: () => toast.warning('Approaching context limit'),
    onCritical: () => toast.error('Near context limit - consider clearing conversation'),
  })

  // State for citation display
  const [currentCitations, setCurrentCitations] = useState<Citation[]>([])

  // Session ID using library hook
  const [sessionId] = useLocalStorage<string>(SESSION_ID_KEY, generateSessionId())

  // Persistent conversation storage using library hook
  const [savedConversation, setSavedConversation, clearSavedConversation] = useLocalStorage<SavedConversation | null>(
    MESSAGES_KEY,
    null
  )

  // Initialize messages from saved conversation
  useEffect(() => {
    if (savedConversation) {
      const isValid = savedConversation.timestamp &&
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

  // Keyboard shortcuts using library hook
  useKeyboardShortcuts([
    {
      key: 'mod+.',
      callback: () => {
        const willOpen = !isOpen
        if (willOpen) {
          saveFocus()
        }
        setIsOpen(willOpen)
        if (willOpen) {
          toast.info('Press Escape or Cmd+. to close', 'Documentation Assistant', TOAST_DURATION_MS)
        } else {
          restoreFocus()
        }
      },
      description: 'Toggle documentation assistant',
    },
    {
      key: '?',
      callback: () => {
        if (isOpen) setShowShortcuts(true)
      },
      description: 'Show keyboard shortcuts',
      enableInInput: false,
    },
    {
      key: 'escape',
      callback: () => {
        if (showSearch) {
          setShowSearch(false)
        } else if (isOpen) {
          setIsOpen(false)
          restoreFocus()
        }
      },
      description: 'Close assistant or search',
    },
    {
      key: 'mod+k',
      callback: () => {
        if (isOpen && messages.length > 0) {
          setShowSearch((prev) => !prev)
        }
      },
      description: 'Toggle message search',
    },
  ])

  // Focus management - focus input when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const timer = setTimeout(() => {
        const textarea = dialogRef.current?.querySelector('textarea')
        textarea?.focus()
      }, FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // Switch branch wrapper
  const switchBranch = useCallback((branchId: string) => {
    const result = switchBranchInternal(branchId, messages)
    if (!result) {
      toast.error('Branch not found')
    }
  }, [switchBranchInternal, messages, toast])

  // Open code in playground handler
  const handleOpenInPlayground = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    const codeBlocks = extractCodeBlocks(message.content)
    const playgroundCompatibleBlocks = codeBlocks.filter(
      block => isPlaygroundCompatible(block.language, block.code)
    )

    if (playgroundCompatibleBlocks.length === 0) {
      toast.warning('No playground-compatible code found in this message')
      return
    }

    const blockToOpen = playgroundCompatibleBlocks.reduce((largest, current) =>
      current.code.length > largest.code.length ? current : largest
    )

    openInPlayground(blockToOpen.code, blockToOpen.language)
    toast.success('Opening code in playground...')
  }, [messages, toast])

  // Check if messages have playground-compatible code (memoized)
  const messagesWithPlaygroundCode = useMemo(() => {
    const result = new Set<string>()
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      const codeBlocks = extractCodeBlocks(message.content)
      if (codeBlocks.some(block => isPlaygroundCompatible(block.language, block.code))) {
        result.add(message.id)
      }
    }
    return result
  }, [messages])

  // Throttled message update for streaming
  const updateStreamingMessage = useThrottledCallback(
    (messageId: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content } : m
        )
      )
    },
    STREAM_THROTTLE_MS
  )

  // Calculate exponential backoff delay for retries
  const calculateRetryDelay = useCallback((attempt: number): number => {
    const delay = INITIAL_RETRY_DELAY_MS * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt)
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

  // Internal send message handler with validation and automatic retry
  const handleSendMessageInternal = useCallback(async (content: string, currentRetry = 0) => {
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
      trackMessage({ role: 'user', content })
    }

    setIsLoading(true)
    setStreamingStatus('connecting')
    setRetryCount(currentRetry)
    setCurrentCitations([])
    partialContentRef.current = ''
    setAiStatus({
      stage: 'researching',
      topic: currentRetry > 0 ? `Retrying (${currentRetry}/${MAX_RETRY_ATTEMPTS})...` : 'Searching documentation',
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
          currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
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

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'text' && data.content) {
                accumulatedContent += data.content
                partialContentRef.current = accumulatedContent
                updateStreamingMessage(assistantMessage.id, accumulatedContent)
              } else if (data.type === 'sources' && data.data?.sources) {
                sources = data.data.sources
                const citations: Citation[] = sources
                  .filter((s) => s && (s.title || s.source || s.url))
                  .map((source, index) => ({
                    id: source.id || `citation-${index}-${Date.now()}`,
                    source: (source.title || source.source || 'Documentation').trim(),
                    chunkText: source.chunkText || source.title || source.source || 'See documentation for more details',
                    confidence: Number(source.score) || Number(source.confidence) || 0,
                    url: normalizeSourceUrl(source.url || '', source.title || source.source || ''),
                  }))
                setCurrentCitations(citations)
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Stream error')
              } else if (data.type === 'done') {
                const finalContent = normalizeLinksInContent(accumulatedContent)
                trackMessage({ role: 'assistant', content: finalContent })
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: finalContent, status: 'sent' as const }
                      : m
                  )
                )
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
        trackMessage({ role: 'assistant', content: finalContent })
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
                ? { ...m, content: partialContentRef.current + '\n\n_(Response interrupted)_', status: 'sent' as const }
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
        toast.warning(`Connection issue. Retrying in ${Math.round(retryDelay / 1000)}s...`, 'Retry')
        setTimeout(() => {
          handleSendMessageInternal(content, currentRetry + 1)
        }, retryDelay)
        return
      }

      setStreamingStatus('error')

      if (partialContentRef.current && partialContentRef.current.length > 50) {
        setMessages((prev) =>
          prev.map((m) =>
            m.status === 'streaming'
              ? {
                  ...m,
                  content: partialContentRef.current + '\n\n_(Stream interrupted - click retry to continue)_',
                  status: 'error' as const,
                }
              : m
          )
        )
        toast.warning('Response interrupted. Partial content preserved - use retry to continue.')
      } else {
        const retryInfo = currentRetry > 0 ? ` (after ${currentRetry} retries)` : ''
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
  }, [messages, sessionId, toast, updateStreamingMessage, trackMessage, isRetryableError, calculateRetryDelay])

  // Public send message handler that checks for offline status
  const handleSendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      toast.warning('Please enter a message')
      return
    }

    if (!isOnline) {
      const queued = queueMessage(trimmedContent)
      const pendingMessage = createPendingMessage(queued)
      setMessages(prev => [...prev, pendingMessage])
      return
    }

    await handleSendMessageInternal(trimmedContent, 0)
  }, [isOnline, queueMessage, handleSendMessageInternal, toast])

  // Message copy handler
  const handleMessageCopy = useCallback(async (_messageId: string, content: string) => {
    await copy(content)
  }, [copy])

  // Message retry handler
  const handleMessageRetry = useCallback((messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1]
      if (previousMessage.role === 'user') {
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
        handleSendMessage(previousMessage.content)
        toast.info('Retrying message...')
      }
    }
  }, [messages, toast, handleSendMessage])

  // Voice input handler
  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript.trim())
    }
  }, [handleSendMessage])

  // Export handler
  const handleExportWithFormat = useCallback(async (options: {
    format: string
    includeMetadata?: boolean
    includeImages?: boolean
  }) => {
    try {
      const result = generateExportContent(
        messages,
        sessionId,
        { ...options, format: options.format as 'json' | 'html' | 'markdown' }
      )
      downloadExport(result)
      toast.success(`Conversation exported as ${result.extension.toUpperCase()}`)
    } catch (error) {
      console.error('Failed to export conversation:', error)
      toast.error('Failed to export conversation')
      throw error
    }
  }, [messages, sessionId, toast])

  const handleOpenExportDialog = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handler for library PromptSuggestion
  const handleSelectSuggestion = useCallback((suggestion: PromptSuggestion) => {
    handleSendMessage(suggestion.text)
  }, [handleSendMessage])

  // Feedback handler
  const handleFeedback = useCallback(async (messageId: string, type: 'up' | 'down') => {
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
    }
  }, [sessionId, toast])

  const handleClear = useCallback(() => {
    setMessages([])
    clearSavedConversation()
    clearTokens()
    setCurrentCitations([])
    setShowSearch(false)
    toast.info('Conversation cleared')
  }, [clearSavedConversation, clearTokens, toast])

  // Animation variants - respect reduced motion preference
  const dialogVariants = useMemo(
    () => prefersReducedMotion ? DIALOG_VARIANTS_REDUCED : DIALOG_VARIANTS_NORMAL,
    [prefersReducedMotion]
  )

  // Combine refs for dialog and focus trap
  const setDialogRefs = useCallback((node: HTMLDivElement | null) => {
    dialogRef.current = node
    if (focusTrapRef.current !== node) {
      (focusTrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }, [focusTrapRef])

  return (
    <>
      {/* Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={setDialogRefs}
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.25,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              'fixed inset-2 sm:inset-4 md:inset-6',
              'lg:right-6 lg:left-auto lg:top-6 lg:bottom-6 lg:w-[640px] xl:w-[720px]',
              'z-[70]',
              'flex flex-col',
              'rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden',
              'bg-white dark:bg-gray-900',
              'border border-gray-200/80 dark:border-gray-800',
              'touch-manipulation',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-assistant-title"
            aria-describedby="docs-assistant-description"
          >
            {/* Screen reader title */}
            <h2 id="docs-assistant-title" className="sr-only">
              Documentation Assistant
            </h2>
            <span id="docs-assistant-description" className="sr-only">
              Chat with the Clarity Chat documentation assistant.
            </span>

            {/* Network Status Indicator */}
            <NetworkStatus
              className="absolute top-2 right-12 z-10"
              show={!isOnline || messageQueue.length > 0}
              onStatusChange={handleNetworkStatusChange}
              showDetails={!isOnline}
            />

            {/* Offline Queue Indicator */}
            {messageQueue.length > 0 && (
              <div
                className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md text-xs font-medium"
                title="Messages waiting to be sent"
              >
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {messageQueue.length} queued
              </div>
            )}

            {/* Voice Input Button */}
            <div className="absolute top-2 right-24 z-10">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                size="sm"
                variant="ghost"
                tooltipText="Speak your question"
                autoSubmit
              />
            </div>

            {/* Branch Selector */}
            {hasBranches && (
              <div className="absolute top-2 left-4 z-10 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {branchState.branches.length > 1 ? (
                  <>
                    <label htmlFor="branch-selector" className="sr-only">
                      Select conversation branch
                    </label>
                    <select
                      id="branch-selector"
                      value={branchState.currentBranchId}
                      onChange={(e) => switchBranch(e.target.value)}
                      className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      aria-label="Switch conversation branch"
                    >
                      {branchState.branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                    {currentBranch.name}
                  </span>
                )}
              </div>
            )}

            {/* Search Toggle Button */}
            {messages.length > 0 && (
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className={cn(
                  'absolute top-2 right-36 z-10 p-2 rounded-lg transition-colors',
                  'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring/40',
                  showSearch && 'bg-accent text-accent-foreground'
                )}
                title="Search messages (Cmd+K)"
                aria-label="Toggle message search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Message Search Panel */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-14 left-4 right-4 z-10 bg-background/95 backdrop-blur-sm rounded-lg border border-border/40 shadow-lg overflow-hidden"
                >
                  <div className="p-3">
                    <MessageSearch
                      messages={messages}
                      placeholder="Search conversation..."
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Token Counter */}
            {totalTokens > 0 && (
              <div className="absolute top-2 left-4 z-10 max-w-[200px]">
                <TokenCounter
                  currentTokens={totalTokens}
                  maxTokens={MODEL_MAX_TOKENS}
                  costPerToken={TOKEN_COST_PER_TOKEN}
                  showWarning={isNearLimit || isCritical}
                  warningThreshold={TOKEN_WARNING_THRESHOLD}
                  criticalThreshold={TOKEN_CRITICAL_THRESHOLD}
                  showCost
                  showBar
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-border/40"
                />
              </div>
            )}

            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              aiStatus={aiStatus}
              onSendMessage={handleSendMessage}
              onMessageCopy={handleMessageCopy}
              onMessageRetry={handleMessageRetry}
              onMessageFeedback={handleFeedback}
              showHeader
              sessionTitle="Documentation Assistant"
              sessionSubtitle="Powered by Clarity Chat"
              showMessageCount
              onExport={messages.length > 0 ? handleOpenExportDialog : undefined}
              onClear={messages.length > 0 ? handleClear : undefined}
              headerActions={
                messagesWithPlaygroundCode.size > 0 ? (
                  <button
                    onClick={() => {
                      const lastWithCode = [...messages]
                        .reverse()
                        .find(m => m.role === 'assistant' && messagesWithPlaygroundCode.has(m.id))
                      if (lastWithCode) {
                        handleOpenInPlayground(lastWithCode.id)
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                    title="Open code in playground"
                    aria-label="Open code in CodeSandbox playground"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Try Code
                  </button>
                ) : undefined
              }
              emptyState={
                <EmptyChatState
                  suggestions={DOCS_STARTER_PROMPTS}
                  onSuggestionSelect={handleSelectSuggestion}
                  showSuggestions
                />
              }
              className="h-full flex flex-col"
            />

            {/* Citations Panel */}
            <AnimatePresence>
              {currentCitations.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="border-t border-border/40 bg-muted/30 overflow-hidden"
                >
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Sources ({currentCitations.length})
                    </h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {currentCitations.map((citation) => (
                        <CitationCard
                          key={citation.id}
                          citation={citation}
                          previewLength={80}
                          showConfidence
                          onSourceClick={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
                          className="text-sm"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={BACKDROP_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
            className="fixed inset-0 bg-black/40 sm:bg-black/30 backdrop-blur-sm sm:backdrop-blur-md z-[60]"
            onClick={() => {
              setIsOpen(false)
              restoreFocus()
            }}
            style={{ backdropFilter: 'blur(8px)' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExportWithFormat}
        resourceType="chat"
        resourceName="Documentation Assistant Conversation"
      />
    </>
  )
}

// ============================================================================
// Exported Component with Error Boundary
// ============================================================================

export function DocsAssistant({ className }: DocsAssistantProps) {
  const toast = useToast()

  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div className="fixed bottom-4 right-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Documentation Assistant Error</h3>
              <p className="text-sm text-muted-foreground">
                {error.message || 'An unexpected error occurred.'}
              </p>
              <button
                onClick={resetError}
                className="text-sm text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('[DocsAssistant] Error:', error, errorInfo)
      }}
      onReset={() => {
        toast.info('Documentation Assistant has been reset')
      }}
    >
      <DocsAssistantInner className={className} />
    </ErrorBoundary>
  )
}
