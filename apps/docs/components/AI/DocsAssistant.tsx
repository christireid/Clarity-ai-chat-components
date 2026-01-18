'use client'

/**
 * DocsAssistant - Premium Documentation Assistant Component
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
import { AlertCircle, Search, Terminal, History, Sparkles, X, Trash2 } from 'lucide-react'
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
  type PromptSuggestion as PromptSuggestionBase,
  // Accessibility hooks
  useFocusTrap,
  useFocusRestoration,
} from '@clarity-chat/react'
import { logger } from '@/lib/logger'

// Re-export the type with proper typing for local use
type PromptSuggestion = PromptSuggestionBase

import { ChatButton } from './ChatButton'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { CompactPromptSelector, useSelectedPrompt } from './PromptSelector'
import { HistorySidebar } from './HistorySidebar'
import { ToolResultRenderer, ToolUseIndicator } from './ToolResultRenderer'
import { DocsAssistantInput } from './DocsAssistantInput'
import { cn } from '@/lib/utils'
import { durations, springs } from '@/lib/animations'

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
  DOCS_STARTER_PROMPTS,
} from './constants'
import {
  extractCodeBlocks,
  isPlaygroundCompatible,
  openInPlayground,
} from './utils'
import { useBranching, useDocsChat } from './hooks'

// ============================================================================
// Animation Variants - Premium Spring Physics
// ============================================================================

const dialogVariantsNormal = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
  },
}

const dialogVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

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
    handleRegenerate,
    handleFeedback,
    handleExportWithFormat,
    handleClear,
    handleNetworkStatusChange,
    handleStop,
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
  const focusTrapRef = useFocusTrap(isOpen)
  const { saveFocus, restoreFocus } = useFocusRestoration()

  // Hide ChatWindow's built-in input to prevent duplicate inputs
  useEffect(() => {
    if (isOpen) {
      // Use a very specific selector that ONLY targets the ChatInput textarea
      // This avoids accidentally hiding messages or other content
      const style = document.createElement('style')
      style.id = 'docs-assistant-hide-input'
      style.textContent = `
        /* Hide only the ChatInput textarea - very specific to avoid hiding messages */
        .docs-assistant-chat-window textarea[aria-label="Type your message"] {
          display: none !important;
        }
        /* Hide the parent container that has border-t and contains the hidden textarea */
        .docs-assistant-chat-window div:has(> textarea[aria-label="Type your message"]) {
          display: none !important;
        }
      `
      document.head.appendChild(style)
      return () => {
        const existingStyle = document.getElementById('docs-assistant-hide-input')
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [isOpen])

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
          // Note: toast.info accepts (description, title?) - duration uses provider default
          toast.info(
            'Press Escape or Cmd+. to close',
            'Documentation Assistant'
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
        // Try to focus the custom input first (DocsAssistantInput)
        const customTextarea = dialogRef.current?.querySelector('[aria-label="Message input"]') as HTMLTextAreaElement
        if (customTextarea) {
          customTextarea.focus()
        } else {
          // Fallback to any textarea
          const textarea = dialogRef.current?.querySelector('textarea') as HTMLTextAreaElement
          textarea?.focus()
        }
      }, FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Enhanced keyboard navigation - improve focus management
  useEffect(() => {
    if (!isOpen) return

    const handleTabNavigation = (e: KeyboardEvent) => {
      // If Tab is pressed and we're at the last focusable element, wrap to first
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTabNavigation)
    return () => document.removeEventListener('keydown', handleTabNavigation)
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

  // Memoize completed messages count to avoid recalculation
  const completedMessagesCount = useMemo(() => {
    return messages.filter(
      (m) => 
        m.status !== 'streaming' && 
        m.status !== 'sending' && 
        (m.role === 'user' || m.role === 'assistant')
    ).length
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
      // Focus input after selecting suggestion for better UX
      setTimeout(() => {
        const textarea = dialogRef.current?.querySelector('[aria-label="Message input"]') as HTMLTextAreaElement
        textarea?.focus()
      }, 100)
    },
    [handleSendMessage]
  )

  const handleSelectFollowUp = useCallback(
    (text: string) => {
      handleSendMessage(text)
    },
    [handleSendMessage]
  )

  // Handle search results change
  const handleSearchResultsChange = useCallback(
    (filteredMessages: typeof messages) => {
      // Could highlight or filter messages if needed
      // For now, just keep track of search state
    },
    []
  )

  // Handle message selection from search
  const handleMessageSelect = useCallback(
    (message: typeof messages[0]) => {
      // Scroll to the selected message
      if (message?.id) {
        // Try to find message element by data attribute first (most reliable)
        let messageElement = document.querySelector(
          `[data-message-id="${message.id}"]`
        ) as HTMLElement | null
        
        // Fallback: find by role="article" and index
        if (!messageElement) {
          const allMessageElements = document.querySelectorAll('[role="article"]')
          const messageIndex = messages.findIndex((m) => m.id === message.id)
          
          if (messageIndex >= 0 && allMessageElements[messageIndex]) {
            messageElement = allMessageElements[messageIndex] as HTMLElement
          }
        }
        
        if (messageElement) {
          // Wait a bit for any animations to complete
          setTimeout(() => {
            // Get the scroll container (ChatWindow's message list)
            const scrollContainer = messageElement.closest('.overflow-y-auto, [data-scroll-container]') || 
                                   document.querySelector('[role="log"]') ||
                                   messageElement.parentElement
            
            // Calculate position relative to scroll container
            const elementRect = messageElement.getBoundingClientRect()
            const containerRect = scrollContainer?.getBoundingClientRect() || { top: 0, height: window.innerHeight }
            
            // Scroll into view with smooth behavior
            messageElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            })
            
            // Highlight the message briefly with a visible ring and pulse animation
            messageElement.classList.add(
              'ring-2', 
              'ring-primary/50', 
              'ring-offset-2',
              'ring-offset-background',
              'transition-all', 
              'duration-300',
              'rounded-lg',
              'animate-pulse'
            )
            
            // Remove pulse after 1 second, keep ring for 2 more seconds
            setTimeout(() => {
              messageElement?.classList.remove('animate-pulse')
            }, 1000)
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
              messageElement?.classList.remove(
                'ring-2', 
                'ring-primary/50',
                'ring-offset-2',
                'ring-offset-background'
              )
            }, 2000)
          }, 100)
        } else {
          // If still not found, log for debugging
          logger.warn('Message element not found for ID:', message.id)
        }
      }
      // Close search panel after selection
      setShowSearch(false)
    },
    [messages]
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

  // Animation variants based on reduced motion preference
  const dialogVariants = useMemo(
    () => (prefersReducedMotion ? dialogVariantsReduced : dialogVariantsNormal),
    [prefersReducedMotion]
  )

  // Spring transition for smooth animations
  const springTransition = useMemo(
    () =>
      prefersReducedMotion
        ? { duration: 0.1 }
        : {
            type: 'spring' as const,
            stiffness: 380,
            damping: 32,
            mass: 0.8,
          },
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
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            ref={setDialogRefs}
            variants={dialogVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
            className={cn(
              // Base positioning - full screen on mobile with safe areas
              'fixed z-[70]',
              'inset-0 sm:inset-2 md:inset-4 lg:inset-6',
              // Mobile: full screen with safe areas
              'sm:rounded-2xl',
              // Desktop: right-aligned panel
              'lg:right-6 lg:left-auto lg:top-6 lg:bottom-6',
              'lg:w-[600px] xl:w-[680px] 2xl:w-[720px]',
              // Mobile optimizations
              'touch-pan-y',
              'overscroll-contain',
              // Layout
              'flex flex-col',
              // Premium glass-morphism background
              'bg-white/[0.97] dark:bg-gray-900/[0.98]',
              'backdrop-blur-2xl backdrop-saturate-150',
              // Refined borders and shadows with enhanced depth
              'rounded-2xl sm:rounded-[20px]',
              'border border-gray-200/60 dark:border-gray-700/50',
              'shadow-2xl shadow-gray-900/10 dark:shadow-black/30',
              // Ring for extra depth with subtle glow
              'ring-1 ring-black/[0.03] dark:ring-white/[0.03]',
              // Enhanced shadow on focus/interaction
              'focus-within:shadow-2xl focus-within:shadow-primary/5',
              // Performance optimizations
              'will-change-transform',
              'touch-manipulation',
              // Safe area for mobile notches
              'pb-safe',
              // Smooth transitions
              'transition-shadow duration-300',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-assistant-title"
            aria-describedby="docs-assistant-description"
          >
            {/* Screen reader content */}
            <h2 id="docs-assistant-title" className="sr-only">
              Documentation Assistant
            </h2>
            <span id="docs-assistant-description" className="sr-only">
              Chat with the Clarity Chat documentation assistant.
            </span>
            {/* ARIA live region for streaming content announcements */}
            <div
              aria-live="polite"
              aria-atomic="false"
              className="sr-only"
              role="status"
              aria-label="AI response status"
            >
              {isLoading && 'AI is typing a response...'}
              {!isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' &&
                `AI response complete: ${messages[messages.length - 1].content.substring(0, 100)}${messages[messages.length - 1].content.length > 100 ? '...' : ''}`}
              {apiError && `Error: ${apiError}`}
              {isDemoMode && 'Running in demo mode. Add API key for full functionality.'}
            </div>
            
            {/* Additional ARIA region for important status changes */}
            <div
              aria-live="assertive"
              aria-atomic="true"
              className="sr-only"
              role="alert"
            >
              {apiError && `Error occurred: ${apiError}`}
            </div>

            {/* Premium Header Bar */}
            <header className={cn(
              'relative flex items-center justify-between',
              'px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4',
              'border-b border-gray-100 dark:border-gray-800/80',
              // Subtle gradient header background with enhanced depth
              'bg-gradient-to-b from-gray-50/80 to-transparent dark:from-gray-800/40 dark:to-transparent',
              // Subtle shadow for separation
              'shadow-sm shadow-gray-900/5 dark:shadow-black/10',
              // Mobile safe area
              'pt-safe',
            )}>
              {/* Left Section: History Toggle + Title */}
              <div className="flex items-center gap-3">
                {/* History Button */}
                <button
                  onClick={() => setShowHistory((prev) => !prev)}
                  className={cn(
                    'flex items-center justify-center',
                    'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
                    'transition-all duration-200 ease-out',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'hover:scale-105 active:scale-95',
                    'touch-manipulation', // Better touch handling
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                    showHistory && 'bg-gray-100 dark:bg-gray-800 shadow-sm'
                  )}
                  aria-label="Toggle chat history"
                  aria-expanded={showHistory}
                >
                  <History className={cn(
                    'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200',
                    'text-gray-600 dark:text-gray-400',
                    showHistory && 'text-primary'
                  )} />
                </button>

                {/* Title + AI Badge */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex items-center justify-center',
                      'w-7 h-7 rounded-lg',
                      'bg-gradient-to-br from-primary/20 to-primary/10',
                      'dark:from-primary/30 dark:to-primary/15'
                    )}>
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {currentBranch.name || 'AI Assistant'}
                        </h3>
                        {(() => {
                          const messageCount = completedMessagesCount
                          return messageCount > 0 && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                'bg-primary/10 text-primary',
                                'dark:bg-primary/20 dark:text-primary',
                                'transition-all duration-200',
                                'shadow-sm'
                              )}
                              aria-label={`${messageCount} ${messageCount === 1 ? 'message' : 'messages'} in conversation`}
                            >
                              {messageCount} {messageCount === 1 ? 'message' : 'messages'}
                            </motion.span>
                          )
                        })()}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                        <span aria-label="AI model status">
                          {isDemoMode ? (
                            <span className="inline-flex items-center gap-1">
                              <span>Demo Mode</span>
                              <span className="text-[10px]" aria-label="Demo mode indicator">⚠️</span>
                            </span>
                          ) : (
                            providerInfo?.model || 'Powered by AI'
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Actions */}
              <div className="flex items-center gap-1.5">
                {/* Voice Input */}
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  size="sm"
                  variant="ghost"
                  tooltipText="Speak your question"
                  autoSubmit
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  icon={undefined}
                  listeningIcon={undefined}
                  onStart={() => {}}
                  onStop={() => {}}
                  onError={() => {}}
                />

                {/* Clear Conversation */}
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the conversation? This cannot be undone.')) {
                        handleClear()
                      }
                    }}
                    className={cn(
                      'flex items-center justify-center',
                      'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
                      'transition-all duration-200 ease-out',
                      'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400',
                      'hover:bg-red-50 dark:hover:bg-red-900/20',
                      'hover:scale-105 active:scale-95',
                      'touch-manipulation', // Better touch handling
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2'
                    )}
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200" />
                  </button>
                )}

                {/* Search Toggle */}
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      setShowSearch((prev) => !prev)
                      // Focus search input when opened
                      if (!showSearch) {
                        setTimeout(() => {
                          const searchInput = document.querySelector('[placeholder*="Search conversation"]') as HTMLInputElement
                          searchInput?.focus()
                        }, 100)
                      }
                    }}
                    className={cn(
                      'flex items-center justify-center',
                      'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
                      'transition-all duration-200 ease-out',
                      'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'hover:scale-105 active:scale-95',
                      'touch-manipulation', // Better touch handling
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                      showSearch && 'bg-primary/10 text-primary dark:bg-primary/20 shadow-sm'
                    )}
                    title="Search messages (Cmd+K)"
                    aria-label="Toggle message search"
                    aria-expanded={showSearch}
                  >
                    <Search className={cn(
                      'w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-200',
                      showSearch && 'scale-110'
                    )} />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    restoreFocus()
                  }}
                  className={cn(
                    'flex items-center justify-center',
                    'w-8 h-8 sm:w-9 sm:h-9 rounded-xl',
                    'transition-all duration-200 ease-out',
                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                    'hover:scale-105 active:scale-95',
                    'touch-manipulation', // Better touch handling
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2'
                  )}
                  aria-label="Close assistant"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200" />
                </button>
              </div>
            </header>

            {/* Status Indicators Row */}
            <AnimatePresence>
              {(tokenTracker.tokenCount > 0 || !isOnline || messageQueue.length > 0) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: durations.fast }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2',
                    'border-b border-gray-100/80 dark:border-gray-800/60',
                    'bg-gray-50/50 dark:bg-gray-800/30',
                    'overflow-x-auto overflow-y-hidden',
                    'min-w-0'
                  )}
                >
                  {/* Token Counter */}
                  {tokenTracker.tokenCount > 0 && (
                    <TokenCounter
                      currentTokens={tokenTracker.tokenCount}
                      maxTokens={MODEL_MAX_TOKENS}
                      costPerToken={TOKEN_COST_PER_TOKEN}
                      showWarning={tokenTracker.isWarning || tokenTracker.isCritical}
                      warningThreshold={TOKEN_WARNING_THRESHOLD}
                      criticalThreshold={TOKEN_CRITICAL_THRESHOLD}
                      showCost
                      showBar
                      size="sm"
                      className="flex-shrink-0 min-w-0"
                      onWarning={() => {}}
                      onCritical={() => {}}
                      onPruneSuggested={() => {}}
                    />
                  )}

                  {/* Network Status */}
                  <NetworkStatus
                    status={isOnline ? 'online' : 'offline'}
                    show={!isOnline || messageQueue.length > 0}
                    onStatusChange={handleNetworkStatusChange}
                    showDetails={!isOnline}
                  />

                  {/* Offline Queue Indicator */}
                  {messageQueue.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1',
                        'bg-amber-100 dark:bg-amber-900/30',
                        'text-amber-700 dark:text-amber-400',
                        'rounded-lg text-xs font-medium',
                        'shadow-sm border border-amber-200/50 dark:border-amber-800/50',
                        'transition-all duration-200'
                      )}
                      title="Messages waiting to be sent"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      {messageQueue.length} queued
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Sidebar - Slides over content */}
            <HistorySidebar
              isOpen={showHistory}
              onClose={() => setShowHistory(false)}
              branches={branchState.branches}
              currentBranchId={branchState.currentBranchId}
              onSwitchBranch={switchBranch}
              onCreateBranch={handleCreateBranch}
            />

            {/* Message Search Panel */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: durations.normal, ease: 'easeOut' }}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-800/80',
                    'bg-gray-50/80 dark:bg-gray-800/50',
                    'overflow-hidden'
                  )}
                >
                  <div className="p-3 sm:p-4">
                    <MessageSearch
                      messages={messages}
                      placeholder="Search conversation..."
                      className="w-full"
                      onResultsChange={handleSearchResultsChange}
                      onMessageSelect={handleMessageSelect}
                      enableKeyboardShortcut={true}
                      autoFocus={true}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div 
              className="flex-1 min-h-0 overflow-hidden"
              role="region"
              aria-label="Chat conversation"
              aria-live="polite"
              aria-atomic="false"
              aria-busy={isLoading}
            >
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                aiStatus={aiStatus}
                onSendMessage={handleSendMessage}
                onMessageCopy={handleMessageCopy}
                onMessageRetry={handleMessageRetry}
                onMessageFeedback={handleFeedback}
                onStopGeneration={handleStop}
                onEditMessage={() => {
                  // Edit message functionality - can be implemented later
                  toast.info('Edit message feature coming soon')
                }}
                onRegenerateMessage={handleRegenerate}
                onDeleteMessage={(messageId: string) => {
                  // Delete message functionality
                  setMessages((prev) => prev.filter((m) => m.id !== messageId))
                  toast.success('Message deleted')
                }}
                editingMessageId={null}
                onSaveEdit={() => {}}
                onCancelEdit={() => {}}
                onRetry={() => {
                  // Retry last failed request
                  if (messages.length > 0) {
                    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
                    if (lastUserMessage) {
                      handleSendMessage(lastUserMessage.content)
                    }
                  }
                }}
                starterPrompts={messages.length === 0 ? DOCS_STARTER_PROMPTS : undefined}
                followUpSuggestions={undefined}
                showStarterPrompts={messages.length === 0}
                showFollowUpSuggestions={false}
                showHeader={false}
                sessionSubtitle={undefined}
                error={apiError || undefined}
                onDismissError={() => {/* apiError will be cleared on successful fetch */}}
                showMessageCount={false}
                onExport={messages.length > 0 ? handleOpenExportDialog : undefined}
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
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5',
                          'text-xs font-medium',
                          'text-primary bg-primary/10 hover:bg-primary/15',
                          'dark:bg-primary/20 dark:hover:bg-primary/25',
                          'rounded-lg transition-all duration-200',
                          'shadow-sm hover:shadow-md',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
                        )}
                        title="Open code in playground"
                        aria-label="Open code in CodeSandbox playground"
                      >
                        <Terminal className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-12" />
                        <span>
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
                        </span>
                      </motion.button>
                    )}
                  </div>
                }
                emptyState={
                  <EmptyChatState
                    suggestions={DOCS_STARTER_PROMPTS}
                    onSuggestionSelect={handleSelectSuggestion}
                    showSuggestions={true}
                    onStartChat={() => {
                      // Focus the input when "Start Chat" is clicked
                      setTimeout(() => {
                        const textarea = dialogRef.current?.querySelector('textarea')
                        textarea?.focus()
                      }, 100)
                    }}
                    className={cn(
                      // Enhanced empty state styling
                      'px-4 sm:px-6',
                      'py-8 sm:py-12',
                    )}
                  />
                }
                className="h-full flex flex-col docs-assistant-chat-window"
              />

              {/* Tool Use Progress Indicator - rendered outside ChatWindow */}
              <AnimatePresence>
                {currentToolUse && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 400,
                      damping: 25
                    }}
                    className="px-4 py-2"
                  >
                    <ToolUseIndicator toolUse={currentToolUse} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tool Results */}
              {messageToolResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 space-y-3"
                >
                  {messageToolResults.map(({ result }, index) => (
                    <motion.div
                      key={result.tool_use_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: 'easeOut'
                      }}
                    >
                      <ToolResultRenderer
                        result={result}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Follow-up Suggestions - transform string[] to FollowUpSuggestion[] */}
              {suggestedFollowUps.length > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                  className="px-4 pb-4"
                >
                  <FollowUpSuggestions
                    suggestions={suggestedFollowUps.map((text, index) => ({
                      id: `followup-${index}`,
                      title: text,
                    }))}
                    onSelect={(suggestion: { id: string; title: string }) => handleSelectFollowUp(suggestion.title)}
                    emptyState={null}
                    className=""
                  />
                </motion.div>
              )}
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
                  className={cn(
                    'border-t border-gray-100 dark:border-gray-800/80',
                    'bg-gradient-to-b from-gray-50/80 to-gray-50/40',
                    'dark:from-gray-800/50 dark:to-gray-800/20',
                    'overflow-hidden'
                  )}
                >
                  <div className="p-4">
                    <h3 className={cn(
                      'text-xs font-semibold uppercase tracking-wider mb-3',
                      'text-gray-500 dark:text-gray-400'
                    )}>
                      Sources ({currentCitations.length})
                    </h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
                      {currentCitations.map((citation) => (
                        <CitationCard
                          key={citation.id}
                          citation={citation}
                          previewLength={80}
                          showConfidence
                          onClick={() => {}}
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

      {/* Backdrop with Premium Blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
            className={cn(
              'fixed inset-0 z-[60]',
              'bg-gray-900/20 dark:bg-black/40',
              'backdrop-blur-sm sm:backdrop-blur-md',
              'supports-[backdrop-filter]:bg-gray-900/10',
              'dark:supports-[backdrop-filter]:bg-black/30'
            )}
            onClick={() => {
              setIsOpen(false)
              restoreFocus()
            }}
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
        className=""
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
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'fixed bottom-4 right-4 z-[100]',
              'max-w-sm p-5',
              'bg-white dark:bg-gray-900',
              'rounded-2xl',
              'border border-red-200/60 dark:border-red-800/40',
              'shadow-xl shadow-red-900/10 dark:shadow-red-900/20',
              'ring-1 ring-red-500/10'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex items-center justify-center',
                'w-10 h-10 rounded-xl flex-shrink-0',
                'bg-red-100 dark:bg-red-900/30'
              )}>
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {suggestion}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={resetError}
                    className={cn(
                      'text-sm font-medium',
                      'text-primary hover:text-primary/80',
                      'transition-colors',
                      'focus-visible:outline-none focus-visible:underline'
                    )}
                  >
                    Try Again
                  </button>
                  <a
                    href="/guides/configuration"
                    className={cn(
                      'text-sm',
                      'text-gray-500 hover:text-gray-700',
                      'dark:text-gray-400 dark:hover:text-gray-300',
                      'transition-colors'
                    )}
                  >
                    Configuration Guide
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )
      }}
      onError={(error: Error, errorInfo: React.ErrorInfo) => {
        logger.error('[DocsAssistant] Error:', error, errorInfo)
      }}
      onReset={() => {
        toast.info('Documentation Assistant has been reset')
      }}
    >
      <DocsAssistantInner className={className} />
    </ErrorBoundary>
  )
}
