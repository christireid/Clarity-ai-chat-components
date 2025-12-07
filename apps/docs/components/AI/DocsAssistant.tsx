'use client'

/**
 * DocsAssistant - Documentation Assistant Component
 *
 * A fully integrated documentation assistant that leverages the @clarity-chat/react
 * library components and hooks instead of custom implementations.
 *
 * Library Components Used:
 * - ChatWindow - Main chat interface
 * - EmptyChatState - Empty state with starter prompts (replaces custom)
 * - ErrorBoundary - Error handling wrapper
 * - NetworkStatus - Connection status indicator
 * - VoiceInput - Voice input support
 * - CopyButton - Copy to clipboard (available)
 * - ThinkingIndicator - AI status (available)
 *
 * Library Hooks Used:
 * - useKeyboardShortcuts - Keyboard handling (replaces custom)
 * - useClipboard - Copy functionality
 * - useLocalStorage - Session ID & conversation storage (replaces custom)
 * - useThrottledCallback - Throttled streaming updates (replaces custom)
 * - useReducedMotion - Accessibility preferences
 * - useAutoScroll - Auto-scroll message list
 * - useToast - Toast notifications
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2, Lightbulb, MessageSquare, Sparkles, AlertCircle } from 'lucide-react'
import {
  // Components
  ChatWindow,
  EmptyChatState,
  ErrorBoundary,
  NetworkStatus,
  VoiceInput,
  CopyButton,
  ThinkingIndicator,
  // Hooks
  useToast,
  useKeyboardShortcuts,
  useClipboard,
  useLocalStorage,
  useThrottledCallback,
  useReducedMotion,
  useAutoScroll,
  // Types
  type PromptSuggestion,
} from '@clarity-chat/react'
import type { Message, AIStatus } from '@clarity-chat/types'
import { ChatButton } from './ChatButton'
import { FeedbackButtons } from './FeedbackButtons'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface DocsAssistantProps {
  className?: string
}

interface SavedConversation {
  messages: Message[]
  timestamp: number
}

interface Source {
  id?: string
  source?: string
  title?: string
  url: string
  confidence?: number
  score?: number
}

// ============================================================================
// Constants
// ============================================================================

const SESSION_ID_KEY = 'clarity-docs-assistant-session-id'
const MESSAGES_KEY = 'clarity-docs-assistant-messages'
const CONVERSATION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const STREAM_THROTTLE_MS = 50 // Throttle streaming updates

// Suggested questions to help users get started (using library PromptSuggestion type)
const DOCS_STARTER_PROMPTS: PromptSuggestion[] = [
  {
    id: 'getting-started',
    text: 'How do I get started with Clarity Chat?',
    label: 'Get Started',
    description: 'Learn the basics of installation and setup',
    icon: <Sparkles className="w-4 h-4" />,
    type: 'starter',
    category: 'Setup',
    keywords: ['installation', 'setup', 'quickstart'],
  },
  {
    id: 'streaming',
    text: 'How do I implement streaming messages?',
    label: 'Streaming',
    description: 'Add real-time streaming to your chat interface',
    icon: <MessageSquare className="w-4 h-4" />,
    type: 'starter',
    category: 'Features',
    keywords: ['streaming', 'real-time', 'SSE'],
  },
  {
    id: 'components',
    text: 'What components are available?',
    label: 'Components',
    description: 'Explore all available UI components',
    icon: <Code2 className="w-4 h-4" />,
    type: 'starter',
    category: 'Reference',
    keywords: ['components', 'ui', 'reference'],
  },
  {
    id: 'theming',
    text: 'How do I customize the theme?',
    label: 'Theming',
    description: 'Learn about theming and customization options',
    icon: <Lightbulb className="w-4 h-4" />,
    type: 'starter',
    category: 'Customization',
    keywords: ['theme', 'customize', 'styling'],
  },
]

// ============================================================================
// URL Normalization Utilities
// ============================================================================

function normalizeSourceUrl(rawUrl: string, title: string): string {
  if (!rawUrl || rawUrl === '#' || rawUrl === 'undefined' || rawUrl.trim() === '') {
    return generateUrlFromTitle(title)
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  const validPrefixes = ['/learn', '/guides/', '/reference/', '/examples/', '/integrations/', '/tools/', '/blog/', '/enterprise/']
  if (validPrefixes.some(prefix => rawUrl.startsWith(prefix))) {
    return rawUrl
  }

  return generateUrlFromTitle(title)
}

function generateUrlFromTitle(title: string): string {
  if (!title || title.trim() === '') {
    return '/learn'
  }

  const lowerTitle = title.toLowerCase()

  // Route mappings
  const routeMappings: Record<string, string> = {
    'getting started': '/learn',
    'quickstart': '/learn',
    'introduction': '/learn',
    'installation': '/guides/installation',
    'theme': '/guides/theming',
    'styling': '/guides/theming',
    'error': '/guides/error-handling',
    'memory': '/guides/memory',
    'hook': '/reference/hooks',
    'component': '/reference/components',
    'streaming': '/reference/hooks/use-streaming-sse',
    'voice': '/reference/components/voice-input',
  }

  for (const [key, route] of Object.entries(routeMappings)) {
    if (lowerTitle.includes(key)) {
      return route
    }
  }

  return '/learn'
}

function normalizeLinksInContent(content: string): string {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

  return content.replace(linkRegex, (match, text, url) => {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      return match
    }
    const normalizedUrl = normalizeSourceUrl(url, text)
    return `[${text}](${normalizedUrl})`
  })
}

// Session ID generation helper
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

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

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Library hooks
  const toast = useToast()
  const prefersReducedMotion = useReducedMotion()
  const { copy } = useClipboard({
    timeout: 2000,
    onSuccess: () => toast.success('Copied to clipboard'),
    onError: () => toast.error('Failed to copy'),
  })

  // Session ID using library hook (replaces custom useSessionId)
  const [sessionId] = useLocalStorage<string>(SESSION_ID_KEY, generateSessionId())

  // Persistent conversation storage using library hook
  const [savedConversation, setSavedConversation, clearSavedConversation] = useLocalStorage<SavedConversation | null>(
    MESSAGES_KEY,
    null
  )

  // Auto-scroll for message list using library hook
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })

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
      key: 'mod+a',
      callback: () => {
        const willOpen = !isOpen
        setIsOpen(willOpen)
        if (willOpen) {
          toast.info('Press Escape or Cmd+A to close', 'Documentation Assistant', 3000)
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
        if (isOpen) setIsOpen(false)
      },
      description: 'Close assistant',
    },
  ])

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const timer = setTimeout(() => {
        const textarea = dialogRef.current?.querySelector('textarea')
        textarea?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // Throttled message update for streaming using library hook
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

  // Send message handler
  const handleSendMessage = useCallback(async (content: string) => {
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
    setIsLoading(true)
    setAiStatus({
      stage: 'researching',
      topic: 'Searching documentation',
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
                updateStreamingMessage(assistantMessage.id, accumulatedContent)
              } else if (data.type === 'sources' && data.data?.sources) {
                sources = data.data.sources
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Stream error')
              } else if (data.type === 'done') {
                const normalizedContent = normalizeLinksInContent(accumulatedContent)
                let finalContent = normalizedContent

                if (sources.length > 0) {
                  const validSources = sources.filter((s) => s && (s.title || s.source || s.url))
                  if (validSources.length > 0) {
                    finalContent += '\n\n---\n\n**Sources:**\n'
                    validSources.forEach((source) => {
                      const confidence = Number(source.score) || Number(source.confidence) || 0
                      const title = (source.title || source.source || 'Documentation').trim()
                      const url = normalizeSourceUrl(source.url || '', title)
                      finalContent += `- [${title}](${url}) (${Math.round(confidence * 100)}% relevance)\n`
                    })
                  }
                }

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: finalContent, status: 'sent' as const }
                      : m
                  )
                )
                setAiStatus(undefined)
              }
            } catch {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }

      abortControllerRef.current = null
      setIsLoading(false)
      setAiStatus(undefined)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setIsLoading(false)
        setAiStatus(undefined)
        return
      }

      abortControllerRef.current = null
      const errorMsg = error instanceof Error ? error.message : 'Please try again.'
      toast.error(errorMsg, 'Failed to get response')

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
      setIsLoading(false)
      setAiStatus(undefined)
    }
  }, [messages, sessionId, toast, updateStreamingMessage])

  // Message copy handler using library clipboard hook
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
  const handleExport = useCallback(() => {
    try {
      let markdown = '# Clarity Chat Documentation Assistant\n\n'
      markdown += `Exported: ${new Date().toLocaleString()}\n\n---\n\n`

      messages.forEach((message) => {
        const role = message.role === 'user' ? 'You' : 'Assistant'
        const timestamp = new Date(message.createdAt).toLocaleTimeString()
        markdown += `## ${role} (${timestamp})\n\n${message.content}\n\n`
      })

      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clarity-chat-${Date.now()}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Conversation exported')
    } catch (error) {
      console.error('Failed to export conversation:', error)
      toast.error('Failed to export conversation')
    }
  }, [messages, toast])

  // Handler for library PromptSuggestion (uses text property)
  const handleSelectSuggestion = useCallback((suggestion: PromptSuggestion) => {
    handleSendMessage(suggestion.text)
  }, [handleSendMessage])

  const handleFeedback = useCallback(async (
    messageId: string,
    type: 'positive' | 'negative',
    comment?: string
  ) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          type,
          comment,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.status}`)
      }

      toast.success(
        type === 'positive'
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
    toast.info('Conversation cleared')
  }, [clearSavedConversation, toast])

  // Animation variants - respect reduced motion preference
  const dialogVariants = useMemo(() => ({
    initial: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.96, y: 20 },
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.96, y: 20 },
  }), [prefersReducedMotion])

  const backdropVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }), [])

  return (
    <>
      {/* Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
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
            {/* Network Status Indicator */}
            <NetworkStatus
              className="absolute top-2 right-12 z-10"
              showOnlyWhenOffline
            />

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

            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              aiStatus={aiStatus}
              onSendMessage={handleSendMessage}
              onMessageCopy={handleMessageCopy}
              onMessageRetry={handleMessageRetry}
              showHeader
              sessionTitle="Documentation Assistant"
              sessionSubtitle="Powered by Clarity Chat"
              showMessageCount
              onExport={messages.length > 0 ? handleExport : undefined}
              onClear={messages.length > 0 ? handleClear : undefined}
              emptyState={
                <EmptyChatState
                  suggestions={DOCS_STARTER_PROMPTS}
                  onSuggestionSelect={handleSelectSuggestion}
                  showSuggestions
                />
              }
              className="h-full flex flex-col"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
            className="fixed inset-0 bg-black/40 sm:bg-black/30 backdrop-blur-sm sm:backdrop-blur-md z-[60]"
            onClick={() => setIsOpen(false)}
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
