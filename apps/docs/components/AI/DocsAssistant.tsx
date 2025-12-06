'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Code2, Lightbulb, MessageSquare, Sparkles } from 'lucide-react'
import { ChatWindow, FollowUpSuggestions, useToast, type FollowUpSuggestion } from '@clarity-chat/react'
import type { Message, AIStatus } from '@clarity-chat/types'
import { ChatButton } from './ChatButton'
import { FeedbackButtons } from './FeedbackButtons'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { cn } from '@/lib/utils'

// Throttle helper to reduce re-renders during streaming
// Returns both the throttled function and a flush function to ensure final update
function createThrottle<T extends (...args: any[]) => void>(fn: T, delay: number): {
  throttled: T
  flush: () => void
  cancel: () => void
} {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall
    lastArgs = args

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    if (timeSinceLastCall >= delay) {
      lastCall = now
      lastArgs = null
      fn(...args)
    } else {
      // Schedule the update for when the delay passes
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        if (lastArgs) {
          const argsToUse = lastArgs
          lastArgs = null
          fn(...argsToUse)
        }
      }, delay - timeSinceLastCall)
    }
  }) as T

  // Flush any pending update immediately
  const flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (lastArgs) {
      const argsToUse = lastArgs
      lastArgs = null
      fn(...argsToUse)
    }
  }

  // Cancel any pending update without executing
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastArgs = null
  }

  return { throttled, flush, cancel }
}

interface DocsAssistantProps {
  className?: string
}

// Session ID management
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  const key = 'clarity-docs-assistant-session-id'
  let sessionId = localStorage.getItem(key)

  if (!sessionId) {
    // Generate simple session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(key, sessionId)
  }

  return sessionId
}

/**
 * Convert a raw URL from the docs index to a proper route URL
 * Handles malformed URLs like "//page.tsx" or file paths
 * Always returns a path starting with "/" to ensure relative routing
 */
function normalizeSourceUrl(rawUrl: string, title: string): string {
  // Handle empty/invalid URLs
  if (!rawUrl || rawUrl === '#' || rawUrl === 'undefined' || rawUrl.trim() === '') {
    return generateUrlFromTitle(title)
  }

  // If it starts with http/https, return as-is (external link)
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  // If it's already a valid route starting with /, check if it's a real route
  const validPrefixes = ['/learn', '/guides/', '/reference/', '/examples/', '/integrations/', '/tools/', '/blog/', '/enterprise/']
  if (validPrefixes.some(prefix => rawUrl.startsWith(prefix))) {
    return rawUrl
  }

  // Handle malformed URLs - generate a proper URL from the title
  return generateUrlFromTitle(title)
}

/**
 * Generate a URL path from a document title
 * Maps to actual routes in the docs site
 */
function generateUrlFromTitle(title: string): string {
  if (!title || title.trim() === '') {
    return '/learn'
  }

  const lowerTitle = title.toLowerCase()

  // Convert title to a URL-friendly slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()

  // Map to actual routes in the docs site

  // Getting started / Learn
  if (lowerTitle.includes('getting started') || lowerTitle.includes('quickstart') || lowerTitle.includes('introduction')) {
    return '/learn'
  }
  if (lowerTitle.includes('installation') || lowerTitle.includes('install')) {
    return '/guides/installation'
  }

  // Hooks - map to /reference/hooks/...
  if (lowerTitle.includes('useautoscroll') || lowerTitle.includes('auto scroll') || lowerTitle.includes('auto-scroll')) {
    return '/reference/hooks/use-auto-scroll'
  }
  if (lowerTitle.includes('usechat') || lowerTitle.includes('use chat') || lowerTitle.includes('use-chat')) {
    return '/reference/hooks/use-chat-optimized'
  }
  if (lowerTitle.includes('usedebounce') || lowerTitle.includes('debounce')) {
    return '/reference/hooks/use-debounce'
  }
  if (lowerTitle.includes('useerror') || lowerTitle.includes('error recovery')) {
    return '/reference/hooks/use-error-recovery'
  }
  if (lowerTitle.includes('uselocalstorage') || lowerTitle.includes('local storage')) {
    return '/reference/hooks/use-local-storage'
  }
  if (lowerTitle.includes('usemessage') || lowerTitle.includes('message operations')) {
    return '/reference/hooks/use-message-operations'
  }
  if (lowerTitle.includes('usestreaming') || lowerTitle.includes('streaming')) {
    return '/reference/hooks/use-streaming-sse'
  }
  if (lowerTitle.includes('hook')) {
    return '/reference/hooks'
  }

  // Components - map to /reference/components/...
  if (lowerTitle.includes('chat input') || lowerTitle.includes('chatinput')) {
    return '/reference/components/advanced-chat-input'
  }
  if (lowerTitle.includes('chat window') || lowerTitle.includes('chatwindow')) {
    return '/reference/components'
  }
  if (lowerTitle.includes('message') && !lowerTitle.includes('operations')) {
    return '/reference/components/message-optimized'
  }
  if (lowerTitle.includes('token counter') || lowerTitle.includes('tokencounter')) {
    return '/reference/components/token-counter'
  }
  if (lowerTitle.includes('thinking indicator') || lowerTitle.includes('thinking')) {
    return '/reference/components/thinking-indicator'
  }
  if (lowerTitle.includes('voice input') || lowerTitle.includes('voice')) {
    return '/reference/components/voice-input'
  }
  if (lowerTitle.includes('empty state')) {
    return '/reference/components/empty-state'
  }
  if (lowerTitle.includes('error boundary')) {
    return '/reference/components/error-boundary'
  }
  if (lowerTitle.includes('component')) {
    return '/reference/components'
  }

  // Guides
  if (lowerTitle.includes('theme') || lowerTitle.includes('styling') || lowerTitle.includes('customiz')) {
    return '/guides/theming'
  }
  if (lowerTitle.includes('error') || lowerTitle.includes('handling')) {
    return '/guides/error-handling'
  }
  if (lowerTitle.includes('memory')) {
    return '/guides/memory'
  }
  if (lowerTitle.includes('plugin')) {
    return '/guides/plugins'
  }
  if (lowerTitle.includes('model adapter')) {
    return '/guides/model-adapters'
  }
  if (lowerTitle.includes('file upload')) {
    return '/guides/file-upload'
  }

  // Examples
  if (lowerTitle.includes('example') || lowerTitle.includes('demo')) {
    return '/examples'
  }

  // Default to learn page
  return '/learn'
}

/**
 * Normalize all markdown links in content to use valid routes
 * Finds all [text](url) patterns and fixes the URLs
 */
function normalizeLinksInContent(content: string): string {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

  return content.replace(linkRegex, (match, text, url) => {
    // Skip external links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match
    }

    // Skip anchor links
    if (url.startsWith('#')) {
      return match
    }

    // Normalize the URL using the title/text as context
    const normalizedUrl = normalizeSourceUrl(url, text)
    return `[${text}](${normalizedUrl})`
  })
}

// Suggested questions to help users get started
const SUGGESTED_QUESTIONS: FollowUpSuggestion[] = [
  {
    id: 'getting-started',
    title: 'How do I get started with Clarity Chat?',
    description: 'Learn the basics of installation and setup',
    icon: <Sparkles className="w-4 h-4" />,
    keywords: ['installation', 'setup', 'quickstart'],
  },
  {
    id: 'streaming',
    title: 'How do I implement streaming messages?',
    description: 'Add real-time streaming to your chat interface',
    icon: <MessageSquare className="w-4 h-4" />,
    keywords: ['streaming', 'real-time', 'SSE'],
  },
  {
    id: 'components',
    title: 'What components are available?',
    description: 'Explore all available UI components',
    icon: <Code2 className="w-4 h-4" />,
    keywords: ['components', 'ui', 'reference'],
  },
  {
    id: 'theming',
    title: 'How do I customize the theme?',
    description: 'Learn about theming and customization options',
    icon: <Lightbulb className="w-4 h-4" />,
    keywords: ['theme', 'customize', 'styling'],
  },
]

// Custom empty state for the docs assistant
function DocsAssistantEmptyState({ onSelectSuggestion }: { onSelectSuggestion: (suggestion: FollowUpSuggestion) => void }) {
  return (
    <div className="flex flex-col items-center p-4 pb-8 space-y-5 overflow-hidden">
      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 shadow-lg ring-1 ring-brand-500/30">
        <BookOpen className="w-10 h-10 text-brand-600" />
      </div>

      {/* Content */}
      <div className="space-y-2 text-center max-w-md">
        <h3 className="text-xl font-bold text-foreground">
          Clarity Chat Documentation Assistant
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I'm here to help you navigate the documentation and answer questions about Clarity Chat.
          Ask me anything about components, hooks, examples, or best practices.
        </p>
      </div>

      {/* Suggestions */}
      <div className="w-full">
        <FollowUpSuggestions
          suggestions={SUGGESTED_QUESTIONS}
          onSelect={onSelectSuggestion}
          title="Quick Start"
          subtitle="Try asking about these topics"
          layout="grid"
        />
      </div>
    </div>
  )
}

export function DocsAssistant({ className }: DocsAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState<AIStatus | undefined>(undefined)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const sessionIdRef = useRef<string>('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  // Initialize session ID and restore conversation history
  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId()

    // Restore conversation history from localStorage
    try {
      const savedMessages = localStorage.getItem('clarity-docs-assistant-messages')
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages)
        // Only restore if messages were saved in the last 24 hours
        if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setMessages(parsed.messages || [])
        }
      }
    } catch (error) {
      console.error('Failed to restore conversation history:', error)
    }
  }, [])

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          'clarity-docs-assistant-messages',
          JSON.stringify({
            messages,
            timestamp: Date.now(),
          })
        )
      } catch (error) {
        console.error('Failed to save conversation history:', error)
      }
    }
  }, [messages])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      // Cmd/Ctrl+A to toggle chat (AI Assistant)
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        const willOpen = !isOpen
        setIsOpen(willOpen)
        if (willOpen) {
          toast.info('Press Escape or Cmd+A to close', 'Documentation Assistant', 3000)
        }
      }
      // ? to show shortcuts help (only when not typing)
      else if (e.key === '?' && !isTyping && isOpen) {
        e.preventDefault()
        setShowShortcuts(true)
      }
      // Escape to close
      else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [isOpen, toast])

  // Focus management: Focus first input when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const textarea = dialogRef.current?.querySelector('textarea')
        if (textarea) {
          textarea.focus()
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Focus trap: Keep focus within dialog when open
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return

    const dialog = dialogRef.current
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    dialog.addEventListener('keydown', handleTabKey as EventListener)
    return () => dialog.removeEventListener('keydown', handleTabKey as EventListener)
  }, [isOpen])

  const handleSendMessage = async (content: string) => {
    // Add user message
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
      // Call API endpoint with streaming
      const response = await fetch('/api/docs-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: sessionIdRef.current,
          currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      // Create assistant message with streaming status
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

      // Hide skeleton and show thinking indicator as we start generating
      setIsLoading(false)
      setAiStatus({
        stage: 'generating',
        topic: 'Generating response',
        startedAt: new Date(),
      })

      let accumulatedContent = ''
      let sources: Array<{ id: string; source: string; url: string; confidence: number }> = []

      // Create a throttled update function to reduce flickering
      // Updates at most every 50ms to prevent layout thrashing
      const { throttled: updateStreamingMessage, flush: flushUpdate, cancel: cancelUpdate } = createThrottle(
        (content: string) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content }
                : m
            )
          )
        },
        50
      )

      try {
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

                  // Update with throttling to reduce flicker
                  updateStreamingMessage(accumulatedContent)
                } else if (data.type === 'sources' && data.data?.sources) {
                // Store sources for potential display
                // API sends: { url, title, score }
                sources = data.data.sources
                console.log('📚 Sources retrieved:', JSON.stringify(sources, null, 2))
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Stream error')
              } else if (data.type === 'done') {
                // Normalize all links in the AI response before finalizing
                const normalizedContent = normalizeLinksInContent(accumulatedContent)

                // Append sources to the message content if available
                let finalContent = normalizedContent
                if (sources.length > 0) {
                  // Filter out invalid sources and format valid ones
                  const validSources = sources.filter((s: any) =>
                    s && typeof s === 'object' && (s.title || s.source || s.url)
                  )

                  if (validSources.length > 0) {
                    finalContent += '\n\n---\n\n**📚 Sources:**\n'
                    validSources.forEach((source: any) => {
                      const confidence = Number(source.score) || Number(source.confidence) || 0
                      // Ensure title is a valid non-empty string
                      const rawTitle = source.title || source.source
                      const title = (typeof rawTitle === 'string' && rawTitle.trim() && rawTitle !== 'undefined')
                        ? rawTitle.trim()
                        : 'Documentation'
                      // Normalize the URL to ensure it's a valid route
                      const rawUrl = (typeof source.url === 'string') ? source.url.trim() : ''
                      const url = normalizeSourceUrl(rawUrl, title)
                      finalContent += `- [${title}](${url}) (${Math.round(confidence * 100)}% relevance)\n`
                    })
                  }
                }

                // Mark as sent with sources
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: finalContent, status: 'sent' as const }
                      : m
                  )
                )

                // Clear AI status when complete
                setAiStatus(undefined)
              }
            } catch (parseError) {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      } finally {
        // Ensure any pending throttled update is flushed before we finish
        flushUpdate()
      }

      // Clear loading and AI status when streaming completes
      setIsLoading(false)
      setAiStatus(undefined)
    } catch (error) {
      // Cancel any pending throttled updates on error
      cancelUpdate()
      console.error('Chat error:', error)

      const errorMsg = error instanceof Error ? error.message : 'Please try again.'

      // Show error toast
      toast.error(errorMsg, 'Failed to get response')

      // Add error message
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
  }

  // Handle message copy
  const handleMessageCopy = useCallback(async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Message copied to clipboard')
    } catch (error) {
      console.error('Failed to copy message:', error)
      toast.error('Failed to copy message')
    }
  }, [toast])

  // Handle message retry
  const handleMessageRetry = useCallback((messageId: string) => {
    // Find the user message before the failed message
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex > 0) {
      const previousMessage = messages[messageIndex - 1]
      if (previousMessage.role === 'user') {
        // Remove the error message and retry
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
        handleSendMessage(previousMessage.content)
        toast.info('Retrying message...')
      }
    }
  }, [messages, toast])

  // Handle export conversation
  const handleExport = useCallback(() => {
    try {
      // Format conversation as markdown
      let markdown = '# Clarity Chat Documentation Assistant\n\n'
      markdown += `Exported: ${new Date().toLocaleString()}\n\n`
      markdown += '---\n\n'

      messages.forEach((message) => {
        const role = message.role === 'user' ? 'You' : 'Assistant'
        const timestamp = new Date(message.createdAt).toLocaleTimeString()
        markdown += `## ${role} (${timestamp})\n\n${message.content}\n\n`
      })

      // Create blob and download
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

  const handleSelectSuggestion = (suggestion: FollowUpSuggestion) => {
    handleSendMessage(suggestion.title)
  }

  const handleFeedback = useCallback(async (
    messageId: string,
    type: 'positive' | 'negative',
    comment?: string
  ) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          type,
          comment,
          sessionId: sessionIdRef.current,
        }),
      })

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.status}`)
      }

      toast.success(
        type === 'positive'
          ? 'Thanks for your feedback!'
          : 'Feedback received. We\'ll work on improving.'
      )
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    }
  }, [toast])

  // Custom message renderer with feedback buttons
  const renderMessageWithFeedback = useCallback((message: Message) => {
    const isAssistant = message.role === 'assistant'
    const isComplete = message.status === 'sent'

    return (
      <div className="space-y-2">
        {/* Message content is rendered by ChatWindow */}

        {/* Add feedback buttons for completed assistant messages */}
        {isAssistant && isComplete && (
          <FeedbackButtons
            messageId={message.id}
            onFeedback={handleFeedback}
            className="mt-2"
          />
        )}
      </div>
    )
  }, [handleFeedback])

  return (
    <>
      {/* Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              // Mobile: Full screen with small padding
              'fixed inset-2 sm:inset-4 md:inset-6',
              // Desktop: Positioned right with fixed width
              'lg:right-6 lg:left-auto lg:top-6 lg:bottom-6 lg:w-[640px] xl:w-[720px]',
              'z-[70]',
              'flex flex-col',
              'rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden',
              'bg-white dark:bg-gray-900',
              'border border-gray-200/80 dark:border-gray-800',
              // Improve touch interactions on mobile
              'touch-manipulation',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="docs-assistant-title"
            aria-describedby="docs-assistant-description"
          >
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
              onClear={
                messages.length > 0
                  ? () => {
                      setMessages([])
                      localStorage.removeItem('clarity-docs-assistant-messages')
                      toast.info('Conversation cleared')
                    }
                  : undefined
              }
              emptyState={<DocsAssistantEmptyState onSelectSuggestion={handleSelectSuggestion} />}
              className="h-full flex flex-col"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop - covers everything including sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
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
