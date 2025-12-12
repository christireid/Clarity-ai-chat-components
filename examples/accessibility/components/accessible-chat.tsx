'use client'

/**
 * Accessible Chat Component
 *
 * Demonstrates WCAG 2.1 AA compliant chat interface:
 * - Keyboard navigation
 * - Screen reader announcements
 * - Focus management
 * - High contrast mode
 * - Reduced motion support
 * - Large font mode
 * - ARIA labels and live regions
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from 'react'

// ============================================================================
// Types
// ============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AccessibilitySettings {
  highContrast: boolean
  largeFont: boolean
  reducedMotion: boolean
  announceMessages: boolean
}

// ============================================================================
// Accessibility Settings Panel
// ============================================================================

function AccessibilityPanel({
  settings,
  onSettingsChange,
}: {
  settings: AccessibilitySettings
  onSettingsChange: (settings: AccessibilitySettings) => void
}) {
  return (
    <div
      className="p-4 border-b"
      role="region"
      aria-label="Accessibility settings"
    >
      <h2 className="text-sm font-semibold mb-3">Accessibility Options</h2>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) =>
              onSettingsChange({ ...settings, highContrast: e.target.checked })
            }
            className="w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2"
            aria-describedby="high-contrast-desc"
          />
          <span className="text-sm">High Contrast</span>
          <span id="high-contrast-desc" className="sr-only">
            Enable high contrast mode for better visibility
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.largeFont}
            onChange={(e) =>
              onSettingsChange({ ...settings, largeFont: e.target.checked })
            }
            className="w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2"
            aria-describedby="large-font-desc"
          />
          <span className="text-sm">Large Font</span>
          <span id="large-font-desc" className="sr-only">
            Increase text size for better readability
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) =>
              onSettingsChange({ ...settings, reducedMotion: e.target.checked })
            }
            className="w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2"
            aria-describedby="reduced-motion-desc"
          />
          <span className="text-sm">Reduced Motion</span>
          <span id="reduced-motion-desc" className="sr-only">
            Disable animations for users sensitive to motion
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.announceMessages}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                announceMessages: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-2 border-current focus:ring-2 focus:ring-offset-2"
            aria-describedby="announce-messages-desc"
          />
          <span className="text-sm">Announce Messages</span>
          <span id="announce-messages-desc" className="sr-only">
            Have new messages announced by screen reader
          </span>
        </label>
      </div>
    </div>
  )
}

// ============================================================================
// Screen Reader Announcer
// ============================================================================

function ScreenReaderAnnouncer({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// ============================================================================
// Message Component
// ============================================================================

function MessageItem({
  message,
  isLatest,
}: {
  message: Message
  isLatest: boolean
}) {
  const messageRef = useRef<HTMLDivElement>(null)

  // Focus latest message for screen readers
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.focus()
    }
  }, [isLatest])

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      ref={messageRef}
      tabIndex={isLatest ? 0 : -1}
      role="article"
      aria-label={`${message.role === 'user' ? 'You' : 'Assistant'} said at ${time}`}
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } focus:outline-none focus:ring-2 focus:ring-ring rounded-lg`}
    >
      <div
        className={`max-w-[80%] p-4 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
            : 'bg-muted rounded-2xl rounded-bl-md'
        }`}
      >
        <div className="sr-only">
          {message.role === 'user' ? 'You' : 'Assistant'}:
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time
          dateTime={new Date(message.timestamp).toISOString()}
          className="block text-xs opacity-60 mt-2"
        >
          {time}
        </time>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function AccessibleChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeFont: false,
    reducedMotion: false,
    announceMessages: true,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Load accessibility preferences
  useEffect(() => {
    const savedSettings = localStorage.getItem('a11y-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings((s) => ({ ...s, reducedMotion: true }))
    }
  }, [])

  // Save and apply settings
  useEffect(() => {
    localStorage.setItem('a11y-settings', JSON.stringify(settings))

    // Apply to document
    document.documentElement.classList.toggle(
      'high-contrast',
      settings.highContrast
    )
    document.documentElement.classList.toggle('large-font', settings.largeFont)
  }, [settings])

  // Auto-scroll
  useEffect(() => {
    if (!settings.reducedMotion) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      messagesEndRef.current?.scrollIntoView()
    }
  }, [messages, settings.reducedMotion])

  // Announce new messages
  const announceMessage = useCallback(
    (role: string, content: string) => {
      if (settings.announceMessages) {
        const truncated =
          content.length > 100 ? content.slice(0, 100) + '...' : content
        setAnnouncement(
          `${role === 'assistant' ? 'Assistant' : 'You'} said: ${truncated}`
        )
        setTimeout(() => setAnnouncement(''), 1000)
      }
    },
    [settings.announceMessages]
  )

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)
      setAnnouncement('Sending message...')

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      }
      setMessages((prev: Message[]) => [...prev, userMessage])
      setInput('')
      announceMessage('user', content)

      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      setMessages((prev: Message[]) => [...prev, assistantMessage])
      setIsLoading(true)
      setAnnouncement('Assistant is typing...')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m: Message) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) throw new Error('No response body')

        let fullContent = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))

          for (const line of lines) {
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text-delta') {
                fullContent += parsed.content
                setMessages((prev: Message[]) =>
                  prev.map((m: Message) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                )
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }

        setAnnouncement('Response complete')
        announceMessage('assistant', fullContent)
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to send message'
        setError(errorMsg)
        setAnnouncement(`Error: ${errorMsg}`)
        setMessages((prev: Message[]) =>
          prev.filter((m: Message) => m.id !== assistantId)
        )
      } finally {
        setIsLoading(false)
        inputRef.current?.focus()
      }
    },
    [messages, isLoading, announceMessage]
  )

  // Form handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Keyboard navigation for message list
  const handleMessagesKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const container = messagesContainerRef.current
    if (!container) return

    const focusableMessages = container.querySelectorAll('[role="article"]')
    const currentIndex = Array.from(focusableMessages).findIndex(
      (el) => el === document.activeElement
    )

    if (e.key === 'ArrowDown' && currentIndex < focusableMessages.length - 1) {
      e.preventDefault()
      ;(focusableMessages[currentIndex + 1] as HTMLElement).focus()
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      e.preventDefault()
      ;(focusableMessages[currentIndex - 1] as HTMLElement).focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      ;(focusableMessages[0] as HTMLElement)?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      ;(focusableMessages[focusableMessages.length - 1] as HTMLElement)?.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Screen reader announcer */}
      <ScreenReaderAnnouncer message={announcement} />

      {/* Header */}
      <header className="p-4 border-b" role="banner">
        <h1 className="text-xl font-semibold">Accessible Chat</h1>
        <p className="text-sm text-muted-foreground">
          WCAG 2.1 AA compliant AI chat interface
        </p>
      </header>

      {/* Accessibility settings */}
      <AccessibilityPanel settings={settings} onSettingsChange={setSettings} />

      {/* Messages region */}
      <main
        id="main-content"
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live={settings.announceMessages ? 'polite' : 'off'}
        aria-relevant="additions"
        tabIndex={0}
        onKeyDown={handleMessagesKeyDown}
      >
        {messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full text-center"
            role="status"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium mb-2">Start a Conversation</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Type a message in the input field below or use keyboard shortcuts
              to navigate.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-left">
              <h3 className="font-medium mb-2">Keyboard Shortcuts:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <kbd className="px-1 py-0.5 bg-background rounded text-xs">
                    Enter
                  </kbd>{' '}
                  - Send message
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-background rounded text-xs">
                    Shift + Enter
                  </kbd>{' '}
                  - New line
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-background rounded text-xs">
                    Arrow Up/Down
                  </kbd>{' '}
                  - Navigate messages
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-background rounded text-xs">
                    Home/End
                  </kbd>{' '}
                  - First/Last message
                </li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div
            role="status"
            aria-label="Assistant is typing"
            className="flex justify-start"
          >
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <span className="inline-flex gap-1" aria-hidden="true">
                <span
                  className={`w-2 h-2 bg-current rounded-full ${
                    settings.reducedMotion ? '' : 'animate-bounce'
                  }`}
                />
                <span
                  className={`w-2 h-2 bg-current rounded-full ${
                    settings.reducedMotion ? '' : 'animate-bounce'
                  }`}
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className={`w-2 h-2 bg-current rounded-full ${
                    settings.reducedMotion ? '' : 'animate-bounce'
                  }`}
                  style={{ animationDelay: '300ms' }}
                />
              </span>
              <span className="sr-only">Assistant is typing</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Error display */}
      {error && (
        <div
          role="alert"
          className="mx-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm"
        >
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline focus:ring-2 focus:ring-ring rounded"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t"
        role="form"
        aria-label="Send a message"
      >
        <div className="flex gap-2">
          <label htmlFor="message-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="message-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            rows={1}
            aria-describedby="input-instructions"
            className="flex-1 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span id="input-instructions" className="sr-only">
            Press Enter to send your message, or Shift+Enter to add a new line.
          </span>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label={isLoading ? 'Sending message...' : 'Send message'}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <span
                  className={`inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full ${
                    settings.reducedMotion ? '' : 'animate-spin'
                  }`}
                  aria-hidden="true"
                />
                <span className="sr-only">Sending...</span>
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>

        {/* Character count */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span aria-live="polite">{input.length} characters</span>
        </div>
      </form>

      {/* Clear chat button */}
      {messages.length > 0 && (
        <div className="p-4 pt-0">
          <button
            onClick={() => {
              setMessages([])
              setAnnouncement('Chat cleared')
            }}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Clear conversation
          </button>
        </div>
      )}
    </div>
  )
}

export default AccessibleChat
