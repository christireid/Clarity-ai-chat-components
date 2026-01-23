'use client'

/**
 * Hero Chat - Flagship Demo Component
 *
 * Showcases 100% of Clarity Chat library capabilities:
 * - Streaming responses with tool calling
 * - Command palette (Cmd+K)
 * - Context menus
 * - Voice input
 * - Markdown rendering with math support
 * - Message persistence
 * - Theme switching
 * - Accessibility (WCAG AA)
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCommandPalette } from '@clarity-chat/react'

// Decomposed components
import {
  HeroChatHeader,
  HeroChatInput,
  HeroChatMessage,
  HeroChatEmptyState,
  HeroChatCommandPalette,
  HeroChatContextMenu,
  HeroChatToast,
  HeroChatSidebar,
  HeroChatTokenCounter,
  PROMPT_SUGGESTIONS,
  // New enhanced components
  HeroChatErrorBoundary,
  HeroChatTypingIndicator,
  HeroChatOfflineBanner,
  HeroChatVoicePreview,
  HeroChatStorageIndicator,
  exportAllConversations,
} from './components'

// Hooks
import { useHeroChat, Message, Theme } from './hooks/useHeroChat'

// ============================================================================
// TYPES
// ============================================================================

interface HeroChatProps {
  className?: string
}

interface ContextMenuState {
  x: number
  y: number
  messageId: string
  messageRole: 'user' | 'assistant'
}

// ============================================================================
// HOOK: Theme Management
// ============================================================================

function useThemeEffect(theme: Theme) {
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', isDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme])
}

// ============================================================================
// HOOK: Auto Scroll
// ============================================================================

function useAutoScroll(dependencies: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = useCallback(
    (force = false) => {
      if (!containerRef.current) return
      if (isUserScrolling && !force) return

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    },
    [isUserScrolling]
  )

  useEffect(() => {
    scrollToBottom()
  }, dependencies)

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100

    if (!isAtBottom) {
      setIsUserScrolling(true)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false)
      }, 3000)
    } else {
      setIsUserScrolling(false)
    }
  }, [])

  return { containerRef, scrollToBottom, handleScroll, isUserScrolling }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function HeroChatInner({ className = '' }: HeroChatProps) {
  // -------------------------------------------------------------------------
  // State from useHeroChat hook
  // -------------------------------------------------------------------------
  const {
    // Conversations
    conversations,
    currentConversation,
    createConversation,
    switchConversation,
    deleteConversation,
    renameConversation,
    // Messages
    messages,
    sendMessage,
    regenerateMessage,
    deleteMessage,
    clearMessages,
    copyMessage,
    hasCopied,
    // Streaming
    isStreaming,
    // Voice
    isRecording,
    startVoiceInput,
    stopVoiceInput,
    voiceTranscript,
    isVoiceSupported,
    // Theme
    theme,
    setTheme,
    // Token tracking
    tokenUsage,
    estimatedCost,
    // Error
    error,
    clearError,
  } = useHeroChat()

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------
  const [input, setInput] = useState('')
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  // -------------------------------------------------------------------------
  // Library hooks
  // -------------------------------------------------------------------------
  const {
    isOpen: showCommandPalette,
    open: openCommandPalette,
    close: closeCommandPalette,
    shortcutDisplay,
  } = useCommandPalette({
    onOpen: () => {},
    onClose: () => {},
  })

  // -------------------------------------------------------------------------
  // Auto scroll
  // -------------------------------------------------------------------------
  const { containerRef, scrollToBottom, handleScroll, isUserScrolling } =
    useAutoScroll([messages])

  // -------------------------------------------------------------------------
  // Theme effect
  // -------------------------------------------------------------------------
  useThemeEffect(theme)

  // -------------------------------------------------------------------------
  // Toast helper
  // -------------------------------------------------------------------------
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 3000)
    },
    []
  )

  // Show error as toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
      clearError()
    }
  }, [error, showToast, clearError])

  // -------------------------------------------------------------------------
  // Voice transcript -> input
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (voiceTranscript) {
      setInput((prev) => prev + voiceTranscript)
    }
  }, [voiceTranscript])

  // -------------------------------------------------------------------------
  // Theme cycling
  // -------------------------------------------------------------------------
  const cycleTheme = useCallback(() => {
    const nextTheme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
    showToast(`Theme: ${nextTheme}`)
  }, [theme, setTheme, showToast])

  // -------------------------------------------------------------------------
  // Handle message send
  // -------------------------------------------------------------------------
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return
    const content = input.trim()
    setInput('')
    await sendMessage(content)
  }, [input, isStreaming, sendMessage])

  // -------------------------------------------------------------------------
  // Handle voice toggle
  // -------------------------------------------------------------------------
  const handleVoiceToggle = useCallback(() => {
    if (!isVoiceSupported) {
      showToast('Voice input not supported in this browser', 'error')
      return
    }
    if (isRecording) {
      stopVoiceInput()
    } else {
      startVoiceInput()
    }
  }, [
    isVoiceSupported,
    isRecording,
    startVoiceInput,
    stopVoiceInput,
    showToast,
  ])

  // -------------------------------------------------------------------------
  // Command palette actions
  // -------------------------------------------------------------------------
  const executeCommand = useCallback(
    (commandId: string) => {
      switch (commandId) {
        // Navigation
        case 'sidebar':
          setShowSidebar((prev) => !prev)
          break
        case 'new':
          createConversation()
          showToast('New conversation created')
          break
        case 'search':
          setShowSidebar(true)
          // Focus search input after sidebar opens
          setTimeout(() => {
            const searchInput = document.querySelector('[data-sidebar-search]')
            if (searchInput instanceof HTMLInputElement) {
              searchInput.focus()
            }
          }, 100)
          break

        // Actions
        case 'clear':
          clearMessages()
          showToast('Chat history cleared')
          break
        case 'regenerate': {
          const lastAssistant = [...messages]
            .reverse()
            .find((m) => m.role === 'assistant')
          if (lastAssistant) {
            regenerateMessage(lastAssistant.id)
          } else {
            showToast('No response to regenerate', 'error')
          }
          break
        }
        case 'copy': {
          const lastResponse = [...messages]
            .reverse()
            .find((m) => m.role === 'assistant')
          if (lastResponse) {
            copyMessage(lastResponse.content)
            showToast('Response copied')
          } else {
            showToast('No response to copy', 'error')
          }
          break
        }

        // Input
        case 'voice':
          handleVoiceToggle()
          break
        case 'focus': {
          const chatInput = document.querySelector('[data-chat-input]')
          if (chatInput instanceof HTMLTextAreaElement) {
            chatInput.focus()
          }
          break
        }

        // Output
        case 'speak': {
          const lastToSpeak = [...messages]
            .reverse()
            .find((m) => m.role === 'assistant')
          if (lastToSpeak) {
            const utterance = new SpeechSynthesisUtterance(lastToSpeak.content)
            speechSynthesis.speak(utterance)
            showToast('Speaking...')
          } else {
            showToast('No response to speak', 'error')
          }
          break
        }
        case 'export': {
          const data = JSON.stringify(messages, null, 2)
          const blob = new Blob([data], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `chat-export-${Date.now()}.json`
          a.click()
          URL.revokeObjectURL(url)
          showToast('Chat exported')
          break
        }
        case 'export-all':
          exportAllConversations(conversations)
          showToast('All conversations exported')
          break

        // Settings
        case 'theme':
          cycleTheme()
          break
        case 'shortcuts':
          showToast(
            'Keyboard shortcuts: ⌘K (palette), ⌘B (sidebar), ⌘T (theme)'
          )
          break
        case 'settings':
          showToast('Settings panel coming soon')
          break

        default:
          showToast('Command not implemented yet')
      }
      closeCommandPalette()
    },
    [
      clearMessages,
      cycleTheme,
      messages,
      conversations,
      showToast,
      closeCommandPalette,
      createConversation,
      regenerateMessage,
      copyMessage,
      handleVoiceToggle,
    ]
  )

  // -------------------------------------------------------------------------
  // Context menu actions
  // -------------------------------------------------------------------------
  const handleContextAction = useCallback(
    (actionId: string, messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message) return

      switch (actionId) {
        case 'copy':
          copyMessage(message.content)
          showToast('Copied to clipboard')
          break
        case 'regenerate':
          regenerateMessage(messageId)
          break
        case 'speak': {
          const utterance = new SpeechSynthesisUtterance(message.content)
          speechSynthesis.speak(utterance)
          showToast('Speaking...')
          break
        }
        case 'delete':
          deleteMessage(messageId)
          showToast('Message deleted')
          break
        default:
          showToast('Action not implemented yet')
      }
      setContextMenu(null)
    },
    [messages, copyMessage, regenerateMessage, deleteMessage, showToast]
  )

  // -------------------------------------------------------------------------
  // Global keyboard shortcuts
  // -------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        setContextMenu(null)
        setShowSidebar(false)
      }
      // Cmd+T toggles theme
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault()
        cycleTheme()
      }
      // Cmd+B toggles sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setShowSidebar((prev) => !prev)
      }
      // Cmd+Shift+E exports all conversations
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
        e.preventDefault()
        exportAllConversations(conversations)
        showToast('All conversations exported')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cycleTheme, conversations, showToast])

  // -------------------------------------------------------------------------
  // Convert messages for display
  // -------------------------------------------------------------------------
  const displayMessages = messages.map((m) => ({
    ...m,
    timestamp: new Date(m.timestamp),
  }))

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div
      className={`relative flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}
      role="application"
      aria-label="Clarity Chat Demo"
    >
      {/* Subtle gradient background - consistent with brand colors */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-purple-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-indigo-950/20 pointer-events-none transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Offline banner */}
      <HeroChatOfflineBanner />

      {/* Sidebar */}
      <HeroChatSidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id || null}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onCreateConversation={createConversation}
        onSwitchConversation={switchConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
      />

      {/* Header */}
      <HeroChatHeader
        theme={theme}
        onCycleTheme={cycleTheme}
        onOpenCommandPalette={openCommandPalette}
        onOpenSidebar={() => setShowSidebar(true)}
        shortcutDisplay={shortcutDisplay}
        conversationCount={conversations.length}
      />

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {/* Empty state */}
        {displayMessages.length === 0 && (
          <HeroChatEmptyState
            suggestions={PROMPT_SUGGESTIONS}
            onSelectSuggestion={(text) => {
              setInput(text)
              setTimeout(() => handleSend(), 100)
            }}
          />
        )}

        {/* Message list */}
        <AnimatePresence mode="popLayout">
          {displayMessages.map((message, index) => (
            <HeroChatMessage
              key={message.id}
              message={message}
              isStreaming={isStreaming}
              isLastMessage={index === displayMessages.length - 1}
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  messageId: message.id,
                  messageRole: message.role,
                })
              }}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator when streaming */}
        {isStreaming && displayMessages.length > 0 && (
          <HeroChatTypingIndicator />
        )}

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {isUserScrolling && displayMessages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => scrollToBottom(true)}
              className="fixed bottom-32 right-8 p-3 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors"
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Token Counter */}
      <HeroChatTokenCounter
        tokenUsage={tokenUsage}
        estimatedCost={estimatedCost}
        isStreaming={isStreaming}
      />

      {/* Voice Preview (when recording) */}
      <HeroChatVoicePreview
        isRecording={isRecording}
        transcript={voiceTranscript}
        isSupported={isVoiceSupported}
        onStop={stopVoiceInput}
      />

      {/* Input area */}
      <HeroChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        isStreaming={isStreaming}
        isRecording={isRecording}
        onToggleVoice={handleVoiceToggle}
      />

      {/* Command Palette */}
      <HeroChatCommandPalette
        isOpen={showCommandPalette}
        onClose={closeCommandPalette}
        onExecuteCommand={executeCommand}
      />

      {/* Context Menu */}
      <HeroChatContextMenu
        contextMenu={contextMenu}
        onClose={() => setContextMenu(null)}
        onAction={handleContextAction}
      />

      {/* Toast */}
      <HeroChatToast toast={toast} />
    </div>
  )
}

// ============================================================================
// EXPORTED COMPONENT WITH ERROR BOUNDARY
// ============================================================================

export function HeroChat(props: HeroChatProps) {
  return (
    <HeroChatErrorBoundary
      onReset={() => {
        // Clear any persisted state that might be causing issues
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }}
    >
      <HeroChatInner {...props} />
    </HeroChatErrorBoundary>
  )
}
