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
 * - useReducedMotion - Accessibility preferences
 * - useToast - Toast notifications
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
import { AlertCircle, Search, Terminal, History } from 'lucide-react'
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
  FollowUpSuggestions,
  // Hooks
  useToast,
  useKeyboardShortcuts,
  useClipboard,
  useReducedMotion,
  // Types
  type PromptSuggestion,
  // Accessibility hooks
  useFocusTrap,
  useFocusRestoration,
} from '@clarity-chat/react/internal'
import { ChatButton } from './ChatButton'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { CompactPromptSelector, useSelectedPrompt } from './PromptSelector'
import { HistorySidebar } from './HistorySidebar'
import { ToolResultRenderer, ToolUseIndicator } from './ToolResultRenderer'
import { DocsAssistantInput } from './DocsAssistantInput'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// Local imports
import type { DocsAssistantProps } from './types'
import {
  CLIPBOARD_TIMEOUT_MS,
  TOAST_DURATION_MS,
  FOCUS_DELAY_MS,
  MODEL_MAX_TOKENS,
  TOKEN_COST_PER_TOKEN,
  TOKEN_WARNING_THRESHOLD,
  TOKEN_CRITICAL_THRESHOLD,
  BACKDROP_VARIANTS,
  DIALOG_VARIANTS_REDUCED,
  DIALOG_VARIANTS_NORMAL,
  DOCS_STARTER_PROMPTS,
} from './constants'
import {
  extractCodeBlocks,
  isPlaygroundCompatible,
  openInPlayground,
} from './utils'
import { useBranching, useDocsChat } from './hooks'

// ============================================================================
// Inner Component (wrapped by ErrorBoundary)
// ============================================================================

function DocsAssistantInner({ className }: DocsAssistantProps) {
  // State
  const [isOpen, setIsOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null)

  // Chat Logic Hook
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

  // Branching hook
  const {
    branchState,
    currentBranch,
    switchBranch: switchBranchInternal,
    createBranch,
    hasBranches,
  } = useBranching({
    onBranchSwitch: (branch) => {
      setMessages(branch.messages)
      toast.info(`Switched to: ${branch.name}`)
      setShowHistory(false)
    },
    onBranchCreate: (branch) => {
      setMessages(branch.messages)
      toast.success(`Created new chat: ${branch.name}`)
      setShowHistory(false)
    },
  })

  // Prompt/personality mode selector
  const [selectedPrompt, setSelectedPrompt] = useSelectedPrompt()

  // Keyboard shortcuts
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
          toast.info(
            'Press Escape or Cmd+. to close',
            'Documentation Assistant',
            TOAST_DURATION_MS
          )
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
        } else if (showHistory) {
          setShowHistory(false)
        } else if (isOpen) {
          setIsOpen(false)
          restoreFocus()
        }
      },
      description: 'Close assistant, history or search',
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

  // Switch branch wrapper
  const switchBranch = useCallback(
    (branchId: string) => {
      const result = switchBranchInternal(branchId, messages)
      if (!result) {
        toast.error('Branch not found')
      }
    },
    [switchBranchInternal, messages, toast]
  )

  const handleCreateBranch = useCallback(() => {
    createBranch(`Chat ${branchState.branches.length + 1}`, [])
  }, [createBranch, branchState.branches.length])

  // Open code in playground handler
  const handleOpenInPlayground = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.role !== 'assistant') return

      const codeBlocks = extractCodeBlocks(message.content)
      const playgroundCompatibleBlocks = codeBlocks.filter((block) =>
        isPlaygroundCompatible(block.language, block.code)
      )

      if (playgroundCompatibleBlocks.length === 0) {
        toast.warning('No playground-compatible code found in this message')
        return
      }

      const blockToOpen = playgroundCompatibleBlocks.reduce(
        (largest, current) =>
          current.code.length > largest.code.length ? current : largest
      )

      const result = openInPlayground(blockToOpen.code, blockToOpen.language)
      if (result.success) {
        toast.success('Opening code in playground...')
      } else {
        toast.error(result.error || 'Failed to open playground')
        if (result.url) {
          navigator.clipboard?.writeText(result.url)
          toast.info('Playground URL copied to clipboard')
        }
      }
    },
    [messages, toast]
  )

  // Check if messages have playground-compatible code (memoized)
  const messagesWithPlaygroundCode = useMemo(() => {
    const result = new Map<string, string>() // messageId -> language
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      const codeBlocks = extractCodeBlocks(message.content)
      const compatibleBlock = codeBlocks.find((block) =>
        isPlaygroundCompatible(block.language, block.code)
      )
      if (compatibleBlock) {
        result.set(message.id, compatibleBlock.language)
      }
    }
    return result
  }, [messages])

  // Message copy handler
  const handleMessageCopy = useCallback(
    async (_messageId: string, content: string) => {
      await copy(content)
    },
    [copy]
  )

  // Voice input handler
  const handleVoiceTranscript = useCallback(
    (transcript: string) => {
      if (transcript.trim()) {
        handleSendMessage(transcript.trim())
      }
    },
    [handleSendMessage]
  )

  const handleOpenExportDialog = useCallback(() => {
    setShowExportDialog(true)
  }, [])

  // Handler for library PromptSuggestion
  const handleSelectSuggestion = useCallback(
    (suggestion: PromptSuggestion) => {
      handleSendMessage(suggestion.text)
    },
    [handleSendMessage]
  )

  const handleSelectFollowUp = useCallback(
    (text: string) => {
      handleSendMessage(text)
    },
    [handleSendMessage]
  )

  // Get tool results for the current conversation
  const messageToolResults = useMemo(() => {
    const results: Array<{
      messageId: string
      result: { tool_name: string; tool_use_id: string; tool_result: unknown }
    }> = []
    toolResults.forEach((result, key) => {
      const [messageId] = key.split(':')
      results.push({ messageId, result })
    })
    return results
  }, [toolResults])

  // Animation variants
  const dialogVariants = useMemo(
    () =>
      prefersReducedMotion ? DIALOG_VARIANTS_REDUCED : DIALOG_VARIANTS_NORMAL,
    [prefersReducedMotion]
  )

  // Combine refs for dialog and focus trap
  const setDialogRefs = useCallback(
    (node: HTMLDivElement | null) => {
      dialogRef.current = node
      if (focusTrapRef.current !== node) {
        ;(
          focusTrapRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node
      }
    },
    [focusTrapRef]
  )

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

            {/* History Sidebar */}
            <HistorySidebar
              isOpen={showHistory}
              onClose={() => setShowHistory(false)}
              branches={branchState.branches}
              currentBranchId={branchState.currentBranchId}
              onSwitchBranch={switchBranch}
              onCreateBranch={handleCreateBranch}
            />

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

            {/* Branch Selector Toggle */}
            <div className="absolute top-2 left-4 z-10">
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-md transition-colors',
                  'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                )}
                aria-label="Toggle chat history"
              >
                <History className="w-3.5 h-3.5" />
                {currentBranch.name}
              </button>
            </div>

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
                  transition={{ duration: durations.normal, ease: 'easeOut' }}
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
            {tokenTracker.tokenCount > 0 && (
              <div className="absolute top-2 left-4 z-10 max-w-[200px] mt-8 lg:mt-0 lg:left-32">
                <TokenCounter
                  currentTokens={tokenTracker.tokenCount}
                  maxTokens={MODEL_MAX_TOKENS}
                  costPerToken={TOKEN_COST_PER_TOKEN}
                  showWarning={
                    tokenTracker.isWarning || tokenTracker.isCritical
                  }
                  warningThreshold={TOKEN_WARNING_THRESHOLD}
                  criticalThreshold={TOKEN_CRITICAL_THRESHOLD}
                  showCost
                  showBar
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-border/40"
                />
              </div>
            )}

            {/* Wrapper to hide ChatWindow's internal input - we use our own with command support */}
            <div className="flex-1 min-h-0 [&_.docs-assistant-chat-window>div:last-child]:hidden">
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
                sessionSubtitle={
                  isDemoMode
                    ? 'Demo Mode - Configure API key for full functionality'
                    : providerInfo?.model
                      ? `Powered by ${providerInfo.model}`
                      : 'Powered by Clarity Chat'
                }
                error={apiError}
                onDismissError={() => {/* apiError will be cleared on successful fetch */}}
                showMessageCount
                onExport={
                  messages.length > 0 ? handleOpenExportDialog : undefined
                }
                onClear={messages.length > 0 ? handleClear : undefined}
                headerActions={
                  <div className="flex items-center gap-2">
                    {/* AI Mode Selector */}
                    <CompactPromptSelector
                      value={selectedPrompt.id}
                      onChange={setSelectedPrompt}
                    />

                    {/* Playground button - only when code is available */}
                    {messagesWithPlaygroundCode.size > 0 && (
                      <button
                        onClick={() => {
                          const lastWithCode = [...messages]
                            .reverse()
                            .find(
                              (m) =>
                                m.role === 'assistant' &&
                                messagesWithPlaygroundCode.has(m.id)
                            )
                          if (lastWithCode) {
                            handleOpenInPlayground(lastWithCode.id)
                          }
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                        title="Open code in playground"
                        aria-label="Open code in CodeSandbox playground"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        Try{' '}
                        {messagesWithPlaygroundCode.get(
                          [...messages]
                            .reverse()
                            .find(
                              (m) =>
                                m.role === 'assistant' &&
                                messagesWithPlaygroundCode.has(m.id)
                            )?.id || ''
                        ) || 'Code'}
                      </button>
                    )}
                  </div>
                }
                emptyState={
                  <EmptyChatState
                    suggestions={DOCS_STARTER_PROMPTS}
                    onSuggestionSelect={handleSelectSuggestion}
                    showSuggestions
                  />
                }
                className="h-full flex flex-col docs-assistant-chat-window"
              >
                {/* Tool Use Progress Indicator */}
                <AnimatePresence>
                  {currentToolUse && (
                    <div className="px-4 py-2">
                      <ToolUseIndicator toolUse={currentToolUse} />
                    </div>
                  )}
                </AnimatePresence>

                {/* Tool Results - rendered inline after messages */}
                {messageToolResults.length > 0 && (
                  <div className="px-4 space-y-2">
                    {messageToolResults.map(({ result }) => (
                      <ToolResultRenderer
                        key={result.tool_use_id}
                        result={result}
                      />
                    ))}
                  </div>
                )}

                {/* Follow-up Suggestions at bottom of chat */}
                {suggestedFollowUps.length > 0 && !isLoading && (
                  <div className="px-4 pb-4">
                    <FollowUpSuggestions
                      suggestions={suggestedFollowUps}
                      onSelect={handleSelectFollowUp}
                    />
                  </div>
                )}
              </ChatWindow>
            </div>

            {/* Custom Input with Slash/@ Commands */}
            <DocsAssistantInput
              onSendMessage={handleSendMessage}
              onClear={handleClear}
              onExport={handleOpenExportDialog}
              disabled={isLoading}
            />

            {/* Citations Panel */}
            <AnimatePresence>
              {currentCitations.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: durations.normal, ease: 'easeOut' }}
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
                          onSourceClick={(url: string) =>
                            window.open(url, '_blank', 'noopener,noreferrer')
                          }
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
// Error Message Helper
// ============================================================================

/**
 * Get a user-friendly error message based on the error type
 */
function getUserFriendlyErrorMessage(error: Error): {
  title: string
  message: string
  suggestion: string
} {
  const errorMsg = error.message.toLowerCase()

  // Network/connectivity errors
  if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('failed to fetch')) {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the AI service.',
      suggestion: 'Please check your internet connection and try again.',
    }
  }

  // API key errors
  if (errorMsg.includes('api key') || errorMsg.includes('unauthorized') || errorMsg.includes('401')) {
    return {
      title: 'Configuration Error',
      message: 'The AI service is not properly configured.',
      suggestion: 'Add a valid API key to .env.local (ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY).',
    }
  }

  // Rate limiting
  if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
    return {
      title: 'Rate Limit Exceeded',
      message: 'Too many requests. Please wait a moment.',
      suggestion: 'Wait a few seconds before trying again.',
    }
  }

  // Server errors
  if (errorMsg.includes('500') || errorMsg.includes('502') || errorMsg.includes('503')) {
    return {
      title: 'Service Unavailable',
      message: 'The AI service is temporarily unavailable.',
      suggestion: 'Please try again in a few moments.',
    }
  }

  // Default error
  return {
    title: 'Documentation Assistant Error',
    message: error.message || 'An unexpected error occurred.',
    suggestion: 'Try refreshing the page or contact support if the issue persists.',
  }
}

// ============================================================================
// Exported Component with Error Boundary
// ============================================================================

export function DocsAssistant({ className }: DocsAssistantProps) {
  const toast = useToast()

  return (
    <ErrorBoundary
      fallback={(error: Error, resetError: () => void) => {
        const { title, message, suggestion } = getUserFriendlyErrorMessage(error)

        return (
          <div className="fixed bottom-4 right-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg shadow-lg max-w-sm z-[100]">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {suggestion}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={resetError}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Try Again
                  </button>
                  <a
                    href="/guides/configuration"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Configuration Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      }}
      onError={(error: Error, errorInfo: { componentStack: string }) => {
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
