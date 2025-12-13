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
import { AlertCircle, Search, Terminal } from 'lucide-react'
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
  useReducedMotion,
  // Types
  type PromptSuggestion,
  // Accessibility hooks
  useFocusTrap,
  useFocusRestoration,
} from '@clarity-chat/react'
import { ChatButton } from './ChatButton'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { CompactPromptSelector, useSelectedPrompt } from './PromptSelector'
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
    hasBranches,
  } = useBranching({
    onBranchSwitch: (branch) => {
      setMessages(branch.messages)
      toast.info(`Switched to: ${branch.name}`)
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
    const result = new Set<string>()
    for (const message of messages) {
      if (message.role !== 'assistant') continue
      const codeBlocks = extractCodeBlocks(message.content)
      if (
        codeBlocks.some((block) =>
          isPlaygroundCompatible(block.language, block.code)
        )
      ) {
        result.add(message.id)
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
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
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
            {tokenTracker.tokens > 0 && (
              <div className="absolute top-2 left-4 z-10 max-w-[200px]">
                <TokenCounter
                  currentTokens={tokenTracker.tokens}
                  maxTokens={MODEL_MAX_TOKENS}
                  costPerToken={TOKEN_COST_PER_TOKEN}
                  showWarning={
                    tokenTracker.isNearLimit || tokenTracker.isCritical
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
                      Try Code
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
              className="h-full flex flex-col"
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
                          onSourceClick={(url) =>
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
              <h3 className="font-semibold text-foreground">
                Documentation Assistant Error
              </h3>
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
